/* PERFUMUM — 03 Trois horloges. Script classique (compatible file://). */
(function () {
  "use strict";
  const { $, el } = PM;
  const W = 1600;
  const H = 1000;
  const TIMELINE = { x: 270, w: 1290 };
  const LANES = [
    { key: "device", y: 120, label: "Appareil", sub: "EXIF DateTimeOriginal" },
    { key: "file", y: 300, label: "Fichier", sub: "dernière modification système" },
    { key: "declared", y: 480, label: "Déclaration", sub: "témoignage de l’opérateur" },
  ];
  const THUMB = { w: 66, h: 46 };
  const COLORS = ["#8fb8ff", "#ffcf6e", "#7ef0a8", "#ff9bd2", "#c49bff", "#7fe3ff", "#ffb38a", "#d8f07e", "#ff8f8f", "#9be7ff", "#f5d0ff", "#b6f5c9"];
  const canvas = $("#canvas");
  const ctx = canvas.getContext("2d");
  const loadedImages = new Map();

  let state;
  function resetState() {
    state = { photos: new Map(), order: [], selected: null };
  }
  resetState();

  // ---------------------------------------------------------------------------
  // Horloges → intervalles UTC [min, max]
  // ---------------------------------------------------------------------------

  function deviceInterval(meta) {
    const exif = meta.exif;
    if (!exif) return { absent: "aucun bloc EXIF" };
    const interval = PM.exifInterval(exif.datetime_original || exif.datetime, exif.offset_time_original);
    if (!interval) return { absent: "aucune date EXIF lisible" };
    return { ...interval, source: exif.datetime_original ? "DateTimeOriginal" : "DateTime (modification)", raw: exif.datetime_original || exif.datetime };
  }

  function fileInterval(meta) {
    if (!meta.file_last_modified_utc) return { absent: "date système indisponible" };
    const t = Date.parse(meta.file_last_modified_utc);
    return { min: t, max: t, timezone_known: true, raw: meta.file_last_modified_utc };
  }

  function declaredInterval(declaration) {
    if (!declaration || !declaration.date) return { absent: "aucune déclaration" };
    const [y, m, d] = declaration.date.split("-").map(Number);
    const [hh, mm] = (declaration.time || "00:00").split(":").map(Number);
    const naive = Date.UTC(y, m - 1, d, hh, mm);
    const span = declaration.time ? 60000 : 86400000;
    const tz = /^([+-])(\d{2}):(\d{2})$/.exec(declaration.tz || "");
    if (tz) {
      const offset = (tz[1] === "-" ? -1 : 1) * (+tz[2] * 60 + +tz[3]) * 60000;
      return { min: naive - offset, max: naive - offset + span, timezone_known: true, raw: `${declaration.date} ${declaration.time || "(jour entier)"} ${declaration.tz}` };
    }
    return { min: naive - 14 * 3600000, max: naive + span + 12 * 3600000, timezone_known: false, raw: `${declaration.date} ${declaration.time || "(jour entier)"} fuseau inconnu` };
  }

  function clocks(photo) {
    return { device: deviceInterval(photo.meta), file: fileInterval(photo.meta), declared: declaredInterval(photo.declaration) };
  }

  function gap(a, b) {
    if (!a || !b || a.absent || b.absent) return null;
    if (a.max >= b.min && b.max >= a.min) return 0;
    return a.max < b.min ? b.min - a.max : a.min - b.max;
  }

  function fmtGap(ms) {
    if (ms === null) return "non mesurable";
    if (ms === 0) return "intervalles compatibles";
    const days = Math.floor(ms / 86400000);
    const hours = Math.floor((ms % 86400000) / 3600000);
    const minutes = Math.round((ms % 3600000) / 60000);
    return `écart ≥ ${days ? `${days} j ` : ""}${hours ? `${hours} h ` : ""}${!days ? `${minutes} min` : ""}`.trim();
  }

  function haversineKm(lat1, lon1, lat2, lon2) {
    const rad = Math.PI / 180;
    const a = Math.sin(((lat2 - lat1) * rad) / 2) ** 2 + Math.cos(lat1 * rad) * Math.cos(lat2 * rad) * Math.sin(((lon2 - lon1) * rad) / 2) ** 2;
    return 6371 * 2 * Math.asin(Math.sqrt(a));
  }

  // ---------------------------------------------------------------------------
  // Événements
  // ---------------------------------------------------------------------------

  function apply(line) {
    const p = line.payload || {};
    switch (line.event_type) {
      case "photo_loaded":
        state.photos.set(p.photo_id, { id: p.photo_id, meta: p.meta, declaration: null, declarations: [], loadedSeq: line.seq, color: COLORS[state.order.length % COLORS.length] });
        state.order.push(p.photo_id);
        if (!state.selected) state.selected = p.photo_id;
        break;
      case "photo_declared": {
        const photo = state.photos.get(p.photo_id);
        if (photo) {
          const declaration = { ...p, seq: line.seq };
          photo.declarations.push(declaration);
          photo.declaration = declaration;
        }
        break;
      }
      default:
        break;
    }
    refreshPanel();
  }

  const app = PM.createApp({
    concept: "MAP-03-trois-horloges",
    title: "Trois horloges",
    sources: [],
    width: W,
    height: H,
    apply,
    resetState,
    render,
  });
  app.summary = () => ({
    photos: state.order.length,
    gaps: state.order.map((id) => {
      const photo = state.photos.get(id);
      const c = clocks(photo);
      return { photo_id: id, device_vs_declared_ms: gap(c.device, c.declared), device_vs_file_ms: gap(c.device, c.file) };
    }),
  });

  // ---------------------------------------------------------------------------
  // Rendu
  // ---------------------------------------------------------------------------

  /**
   * Axe brisé : les périodes séparées de plus de 3 jours deviennent des segments distincts,
   * séparés par une coupure étiquetée (« +103 j »). Chaque segment garde une échelle linéaire.
   */
  function buildAxis() {
    const spans = [];
    state.order.forEach((id) => {
      const c = clocks(state.photos.get(id));
      Object.values(c).forEach((interval) => {
        if (!interval.absent) spans.push([interval.min, interval.max]);
      });
    });
    if (!spans.length) {
      const now = Date.now();
      spans.push([now - 43200000, now + 43200000]);
    }
    spans.sort((a, b) => a[0] - b[0]);
    const clusters = [];
    spans.forEach(([min, max]) => {
      const last = clusters[clusters.length - 1];
      if (last && min - last.max <= 3 * 86400000) last.max = Math.max(last.max, max);
      else clusters.push({ min, max });
    });
    clusters.forEach((c) => {
      const span = Math.max(c.max - c.min, 86400000);
      const pad = span * 0.08 + 6 * 3600000;
      const mid = (c.min + c.max) / 2;
      c.min = Math.min(c.min, mid - span / 2) - pad;
      c.max = Math.max(c.max, mid + span / 2) + pad;
    });
    const GAP_W = 70;
    const available = TIMELINE.w - GAP_W * (clusters.length - 1);
    const total = clusters.reduce((sum, c) => sum + (c.max - c.min), 0);
    let x = TIMELINE.x;
    clusters.forEach((c, i) => {
      c.x = x;
      c.w = Math.max(90, (available * (c.max - c.min)) / total);
      x += c.w + (i < clusters.length - 1 ? GAP_W : 0);
    });
    const scale = TIMELINE.w / (x - TIMELINE.x);
    clusters.forEach((c) => {
      c.x = TIMELINE.x + (c.x - TIMELINE.x) * scale;
      c.w *= scale;
    });
    const xOf = (t) => {
      const c = clusters.find((cl) => t >= cl.min && t <= cl.max) || clusters.reduce((best, cl) => (Math.abs(t - (cl.min + cl.max) / 2) < Math.abs(t - (best.min + best.max) / 2) ? cl : best));
      return c.x + ((Math.min(Math.max(t, c.min), c.max) - c.min) / (c.max - c.min)) * c.w;
    };
    return { clusters, xOf };
  }

  function drawThumb(photo, x, y, w = THUMB.w, h = THUMB.h) {
    const image = loadedImages.get(photo.meta.sha256);
    ctx.fillStyle = "#0b1018";
    ctx.fillRect(x, y, w, h);
    if (image && app.imageVisible) {
      const scale = Math.max(w / image.naturalWidth, h / image.naturalHeight);
      const sw = w / scale;
      const sh = h / scale;
      ctx.drawImage(image, (image.naturalWidth - sw) / 2, (image.naturalHeight - sh) / 2, sw, sh, x, y, w, h);
    } else if (!image) {
      ctx.fillStyle = "#ff9b9b";
      ctx.font = "10px ui-monospace, Menlo, monospace";
      ctx.fillText("image absente", x + 4, y + 14);
      ctx.fillText(PM.short(photo.meta.sha256), x + 4, y + 28);
    }
    ctx.strokeStyle = photo.color;
    ctx.lineWidth = state.selected === photo.id ? 3 : 1.5;
    ctx.strokeRect(x, y, w, h);
    ctx.fillStyle = photo.color;
    ctx.font = "bold 11px ui-monospace, Menlo, monospace";
    ctx.fillText(photo.id, x, y - 4);
  }

  function render() {
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, W, H);
    const { clusters, xOf } = buildAxis();

    // Axe temporel brisé : un segment par période, coupures étiquetées.
    ctx.font = "12px ui-monospace, Menlo, monospace";
    clusters.forEach((c, i) => {
      ctx.fillStyle = "rgba(143,184,255,.06)";
      ctx.fillRect(c.x, 56, c.w, 500);
      ctx.strokeStyle = "rgba(255,255,255,.2)";
      ctx.strokeRect(c.x, 56, c.w, 500);
      const days = (c.max - c.min) / 86400000;
      ctx.fillStyle = "#c9d3e3";
      ctx.fillText(PM.fmtDate(c.min, days < 3).replace(" UTC", ""), c.x + 4, 48);
      const endLabel = PM.fmtDate(c.max, days < 3).replace(" UTC", "");
      if (c.w > 260) ctx.fillText(endLabel, c.x + c.w - ctx.measureText(endLabel).width - 4, 48);
      const next = clusters[i + 1];
      if (next) {
        const gx = c.x + c.w;
        const gw = next.x - gx;
        ctx.strokeStyle = "#ffcf6e";
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let k = 0; k <= 6; k += 1) ctx.lineTo(gx + (gw * k) / 6, 300 + (k % 2 ? -8 : 8));
        ctx.stroke();
        ctx.fillStyle = "#ffcf6e";
        const gapDays = Math.round((next.min - c.max) / 86400000);
        const label = `+${gapDays} j`;
        ctx.fillText(label, gx + gw / 2 - ctx.measureText(label).width / 2, 284);
      }
    });

    // Couloirs et marges « non datable ».
    LANES.forEach((lane) => {
      ctx.fillStyle = "#e6ecf5";
      ctx.font = "bold 15px system-ui, sans-serif";
      ctx.fillText(lane.label, 20, lane.y - 14);
      ctx.fillStyle = "#9aa7bb";
      ctx.font = "12px system-ui, sans-serif";
      ctx.fillText(lane.sub, 20, lane.y + 2);
      ctx.strokeStyle = "rgba(255,255,255,.18)";
      ctx.setLineDash([3, 5]);
      ctx.strokeRect(20, lane.y + 12, 220, THUMB.h + 34);
      ctx.setLineDash([]);
      ctx.fillStyle = "#6f7c90";
      ctx.font = "11px system-ui, sans-serif";
      ctx.fillText("non datable par cette horloge", 26, lane.y + 26 + THUMB.h + 14);
      ctx.strokeStyle = "rgba(255,255,255,.25)";
      ctx.beginPath();
      ctx.moveTo(TIMELINE.x, lane.y + 40);
      ctx.lineTo(TIMELINE.x + TIMELINE.w, lane.y + 40);
      ctx.stroke();
    });

    // Placement de chaque photo dans les trois couloirs.
    const positions = new Map();
    const marginSlots = { device: 0, file: 0, declared: 0 };
    const laneRows = { device: [], file: [], declared: [] };
    const placeInLane = (key, x) => {
      // Deux rangées par couloir ; si elles sont pleines, la vignette glisse vers la droite.
      const rowsEnd = laneRows[key];
      for (let shift = 0; shift < 8; shift += 1) {
        const candidate = Math.min(x + shift * (THUMB.w + 6), W - THUMB.w - 10);
        for (let row = 0; row < 2; row += 1) {
          if (rowsEnd[row] === undefined || candidate >= rowsEnd[row] + 6) {
            rowsEnd[row] = candidate + THUMB.w;
            return { row, x: candidate };
          }
        }
      }
      return { row: 0, x };
    };
    state.order.forEach((id, index) => {
      const photo = state.photos.get(id);
      const c = clocks(photo);
      const placed = {};
      LANES.forEach((lane) => {
        const interval = c[lane.key];
        if (interval.absent) {
          const slot = marginSlots[lane.key]++;
          placed[lane.key] = { x: 26 + (slot % 2) * 104, y: lane.y + 22 + Math.floor(slot / 2) * 4, absent: interval.absent };
          return;
        }
        const x0 = xOf(interval.min);
        const x1 = xOf(interval.max);
        const barY = lane.y + 40 + ((index % 4) - 1.5) * 6;
        ctx.strokeStyle = photo.color;
        ctx.lineWidth = 4;
        ctx.globalAlpha = interval.timezone_known ? 0.95 : 0.45;
        ctx.beginPath();
        ctx.moveTo(x0, barY);
        ctx.lineTo(Math.max(x1, x0 + 2), barY);
        ctx.stroke();
        ctx.globalAlpha = 1;
        const cx = (x0 + x1) / 2;
        const tx = Math.min(Math.max(cx - THUMB.w / 2, TIMELINE.x - 10), W - THUMB.w - 10);
        const slot = placeInLane(lane.key, tx);
        placed[lane.key] = { x: slot.x, y: lane.y + 54 + slot.row * (THUMB.h + 16), cx, barY, interval };
      });
      positions.set(id, placed);
    });

    // Liens entre les trois positions d'une même photo (aucune n'est la « bonne »).
    state.order.forEach((id) => {
      const photo = state.photos.get(id);
      const placed = positions.get(id);
      ctx.strokeStyle = photo.color;
      ctx.globalAlpha = state.selected === id ? 0.9 : 0.35;
      ctx.lineWidth = state.selected === id ? 2 : 1;
      ctx.setLineDash([6, 4]);
      ctx.beginPath();
      LANES.forEach((lane, i) => {
        const p = placed[lane.key];
        const x = p.x + THUMB.w / 2;
        const y = p.y + THUMB.h / 2;
        if (i) ctx.lineTo(x, y);
        else ctx.moveTo(x, y);
      });
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.globalAlpha = 1;
    });
    state.order.forEach((id) => {
      const photo = state.photos.get(id);
      const placed = positions.get(id);
      LANES.forEach((lane) => drawThumb(photo, placed[lane.key].x, placed[lane.key].y));
    });

    // Fiche de la photo sélectionnée.
    const selected = state.selected && state.photos.get(state.selected);
    ctx.fillStyle = "rgba(255,255,255,.08)";
    ctx.fillRect(20, 600, 1560, 1);
    if (selected) {
      drawThumb(selected, 20, 616, 330, 230);
      const c = clocks(selected);
      const exif = selected.meta.exif || {};
      const decl = selected.declaration || {};
      const dGap = gap(c.device, c.declared);
      const fGap = gap(c.device, c.file);
      const gps = Number.isFinite(exif.gps_lat) && Number.isFinite(exif.gps_lon);
      const declaredPos = Number.isFinite(decl.lat) && Number.isFinite(decl.lon);
      const lines = [
        [`${selected.id} · ${selected.meta.name} · sha256 ${selected.meta.sha256}`, "#e6ecf5"],
        [`appareil : ${c.device.absent ? `ABSENT (${c.device.absent})` : `${c.device.raw} · ${c.device.source} · ${c.device.timezone_known ? "fuseau connu" : "fuseau inconnu → intervalle de 26 h"}`}`, c.device.absent ? "#ff9b9b" : "#c9d3e3"],
        [`fichier  : ${c.file.absent ? `ABSENT (${c.file.absent})` : `${c.file.raw} (peut être la date de copie ou d’export)`}`, "#c9d3e3"],
        [`déclaré  : ${c.declared.absent ? "ABSENT (aucune déclaration)" : `${c.declared.raw} · ${decl.place || "lieu ?"} · ${decl.subject || "sujet ?"} · seq ${decl.seq}${selected.declarations.length > 1 ? ` · ${selected.declarations.length} déclarations dans l’historique` : ""}`}`, c.declared.absent ? "#ff9b9b" : "#c9d3e3"],
        [`appareil ↔ déclaration : ${fmtGap(dGap)}   ·   appareil ↔ fichier : ${fmtGap(fGap)}`, dGap ? "#ffcf6e" : "#7ef0a8"],
        [`appareil : ${[exif.make, exif.model].filter(Boolean).join(" ") || "modèle inconnu"}${exif.software ? ` · logiciel « ${exif.software} » → métadonnées possiblement réécrites` : ""}`, exif.software ? "#ffcf6e" : "#9aa7bb"],
        [`lieu : ${gps ? `GPS appareil ${exif.gps_lat.toFixed(5)}, ${exif.gps_lon.toFixed(5)}` : "GPS appareil absent"}${declaredPos ? ` · déclaré ${decl.lat}, ${decl.lon}` : " · coordonnées déclarées absentes"}${gps && declaredPos ? ` · distance ${haversineKm(exif.gps_lat, exif.gps_lon, decl.lat, decl.lon).toFixed(1)} km` : ""}`, "#c9d3e3"],
        ["aucune horloge ne l’emporte : les trois restent dans le journal", "#9aa7bb"],
      ];
      ctx.font = "14px ui-monospace, Menlo, monospace";
      lines.forEach(([text, color], i) => {
        ctx.fillStyle = color;
        ctx.fillText(text.length > 132 ? text.slice(0, 131) + "…" : text, 372, 636 + i * 26);
      });
    } else {
      ctx.fillStyle = "#9aa7bb";
      ctx.font = "16px system-ui, sans-serif";
      ctx.fillText("Démarrez un run puis chargez des photos de terrain : chacune sera placée selon ses trois horloges.", 30, 660);
    }

    const declaredCount = state.order.filter((id) => state.photos.get(id).declaration).length;
    const exifCount = state.order.filter((id) => !deviceInterval(state.photos.get(id).meta).absent).length;
    PM.drawCartel(ctx, {
      x: 20, y: 862, width: 1560, app,
      lines: [
        `photos ${state.order.length} · datées par l’appareil ${exifCount} · déclarées ${declaredCount} · non datables par l’appareil ${state.order.length - exifCount}`,
        "règle : un fuseau inconnu élargit l’intervalle (UTC−12 → UTC+14) ; une date déclarée sans heure couvre le jour entier",
        "écart = distance entre intervalles ; « compatible » ne veut pas dire « vérifié »",
        app.imageVisible ? "vignettes affichées (I pour les masquer)" : "vignettes masquées : seuls les placements sont projetés",
      ],
    });
  }

  // ---------------------------------------------------------------------------
  // Panneau
  // ---------------------------------------------------------------------------

  function refreshPanel() {
    $("#photo-list").replaceChildren(...state.order.map((id) => {
      const photo = state.photos.get(id);
      const c = clocks(photo);
      return el("li", { class: state.selected === id ? "active" : "", onclick: () => { state.selected = id; refreshPanel(); app.requestRender(); } },
        `${id} · ${photo.meta.name} · ${c.device.absent ? "sans EXIF" : "EXIF"} · ${photo.declaration ? "déclarée" : "non déclarée"}`);
    }));
    const selected = state.selected && state.photos.get(state.selected);
    $("#declare-section").hidden = !selected;
    if (selected) {
      $("#declare-target").textContent = selected.id;
      const decl = selected.declaration || {};
      $("#d-date").value = decl.date || "";
      $("#d-time").value = decl.time || "";
      $("#d-tz").value = decl.tz || "";
      $("#d-place").value = decl.place || "";
      $("#d-lat").value = Number.isFinite(decl.lat) ? decl.lat : "";
      $("#d-lon").value = Number.isFinite(decl.lon) ? decl.lon : "";
      $("#d-subject").value = decl.subject || "";
    }
  }

  $("#photo-input").addEventListener("change", async (event) => {
    const files = [...event.target.files];
    event.target.value = "";
    for (const file of files) {
      const loaded = await PM.loadImageFile(file);
      loadedImages.set(loaded.meta.sha256, loaded.image);
      const already = [...state.photos.values()].find((photo) => photo.meta.sha256 === loaded.meta.sha256);
      if (already || app.replayState) continue;
      const photoId = `P-${String(state.order.length + 1).padStart(3, "0")}`;
      await app.act("photo_loaded", { photo_id: photoId, meta: loaded.meta });
    }
    app.requestRender();
  });

  $("#declare-button").onclick = () => {
    const selected = state.selected && state.photos.get(state.selected);
    if (!selected) return;
    const number = (value) => (value === "" ? null : Number(value));
    app.act("photo_declared", {
      photo_id: selected.id,
      date: $("#d-date").value || null,
      time: $("#d-time").value || null,
      tz: $("#d-tz").value || null,
      place: $("#d-place").value.trim() || null,
      lat: number($("#d-lat").value),
      lon: number($("#d-lon").value),
      subject: $("#d-subject").value.trim() || null,
      status: "témoignage de l’opérateur, à vérifier",
    });
  };

  PM.mountShell(app);
  refreshPanel();
})();
