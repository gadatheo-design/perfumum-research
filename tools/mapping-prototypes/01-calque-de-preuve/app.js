/* PERFUMUM — 01 Calque de preuve. Script classique (compatible file://). */
(function () {
  "use strict";
  const { $, el } = PM;
  const DATA = window.PM_DATA;
  const W = 1600;
  const H = 1000;
  const IMAGE_AREA = { x: 20, y: 20, w: 1560, h: 830 };
  const MASK_W = 320;
  const MASK_H = 170;
  const canvas = $("#canvas");
  const ctx = canvas.getContext("2d");
  const assertions = new Map(DATA.assertions.map((a) => [a.id, a]));
  const demoCanvas = PM.demoImage("CALQUE DE PREUVE — MIRE");
  const loadedImages = new Map(); // sha256 → HTMLImageElement chargé dans cette session

  let state;
  let mode = "draw";
  let draft = [];

  function resetState() {
    state = { imageMeta: null, imageSource: null, declared: null, regions: new Map(), order: [], selected: null, masksDirty: true, masks: new Map() };
    draft = [];
  }
  resetState();

  // ---------------------------------------------------------------------------
  // Réduction des événements (direct et rejeu passent ici)
  // ---------------------------------------------------------------------------

  function apply(line) {
    const p = line.payload || {};
    switch (line.event_type) {
      case "image_loaded":
        state.imageMeta = p;
        state.imageSource = p.generated ? demoCanvas : loadedImages.get(p.sha256) || null;
        state.masksDirty = true;
        break;
      case "image_declared":
        state.declared = { ...p, seq: line.seq };
        break;
      case "region_drawn":
        state.regions.set(p.region_id, { id: p.region_id, points: p.points, links: [], annotations: [], drawnSeq: line.seq });
        state.order.push(p.region_id);
        state.selected = p.region_id;
        state.masksDirty = true;
        break;
      case "region_linked":
      case "region_unlinked": {
        const region = state.regions.get(p.region_id);
        if (region) region.links.push({ ...p, type: line.event_type, seq: line.seq, flux: line.flux, ts: line.ts_utc });
        state.masksDirty = true;
        break;
      }
      case "annotation": {
        const target = [...state.regions.values()].find((r) => r.links.some((l) => l.seq === p.ref_seq) || r.drawnSeq === p.ref_seq);
        if (target) target.annotations.push({ text: p.text, seq: line.seq });
        break;
      }
      default:
        break;
    }
    refreshPanel();
  }

  const app = PM.createApp({
    concept: "MAP-01-calque-de-preuve",
    title: "Calque de preuve",
    sources: DATA.sources,
    width: W,
    height: H,
    apply,
    resetState,
    render,
  });
  app.headerExtra = () => ({ data_export: { kind: DATA.kind, generated_at: DATA.generated_at, git_commit: DATA.git_commit } });
  app.summary = () => ({ ...coverage(), regions: state.order.length, conflicts: conflicts().length });
  app.onReplayHeader = () => {};

  // ---------------------------------------------------------------------------
  // Géométrie
  // ---------------------------------------------------------------------------

  function imageRect() {
    const meta = state.imageMeta;
    const iw = meta ? meta.width : 1600;
    const ih = meta ? meta.height : 1000;
    const scale = Math.min(IMAGE_AREA.w / iw, IMAGE_AREA.h / ih);
    const w = iw * scale;
    const h = ih * scale;
    return { x: IMAGE_AREA.x + (IMAGE_AREA.w - w) / 2, y: IMAGE_AREA.y + (IMAGE_AREA.h - h) / 2, w, h };
  }
  const toStage = ([u, v], r = imageRect()) => [r.x + u * r.w, r.y + v * r.h];
  const toImage = ([x, y], r = imageRect()) => [(x - r.x) / r.w, (y - r.y) / r.h];

  function pointInPolygon([x, y], points) {
    let inside = false;
    for (let i = 0, j = points.length - 1; i < points.length; j = i, i += 1) {
      const [xi, yi] = points[i];
      const [xj, yj] = points[j];
      if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
    }
    return inside;
  }

  function currentLink(region) {
    const last = region.links[region.links.length - 1];
    return last && last.type === "region_linked" ? last : null;
  }

  function rasterize(region) {
    const off = document.createElement("canvas");
    off.width = MASK_W;
    off.height = MASK_H;
    const octx = off.getContext("2d");
    octx.fillStyle = "#fff";
    octx.beginPath();
    region.points.forEach(([u, v], i) => (i ? octx.lineTo(u * MASK_W, v * MASK_H) : octx.moveTo(u * MASK_W, v * MASK_H)));
    octx.closePath();
    octx.fill();
    const data = octx.getImageData(0, 0, MASK_W, MASK_H).data;
    const mask = new Uint8Array(MASK_W * MASK_H);
    for (let i = 0; i < mask.length; i += 1) mask[i] = data[i * 4 + 3] > 127 ? 1 : 0;
    return mask;
  }

  function refreshMasks() {
    if (!state.masksDirty) return;
    state.masks.clear();
    state.order.forEach((id) => state.masks.set(id, rasterize(state.regions.get(id))));
    state.masksDirty = false;
  }

  function coverage() {
    refreshMasks();
    const total = MASK_W * MASK_H;
    const probant = new Uint8Array(total);
    const marge = new Uint8Array(total);
    state.order.forEach((id) => {
      const region = state.regions.get(id);
      const link = currentLink(region);
      if (!link) return;
      const mask = state.masks.get(id);
      const target = link.flux === "marge" ? marge : probant;
      for (let i = 0; i < total; i += 1) if (mask[i]) target[i] = 1;
    });
    let p = 0;
    let m = 0;
    for (let i = 0; i < total; i += 1) {
      if (probant[i]) p += 1;
      else if (marge[i]) m += 1;
    }
    const pct = (n) => Math.round((n / total) * 1000) / 10;
    return { probant_pct: pct(p), marge_seule_pct: pct(m), non_documente_pct: pct(total - p - m) };
  }

  /** Paires de zones qui se recouvrent et portent deux mesures différentes du même CAS. */
  function conflicts() {
    refreshMasks();
    const out = [];
    const linked = state.order.map((id) => state.regions.get(id)).filter((r) => currentLink(r) && currentLink(r).assertion_id);
    for (let i = 0; i < linked.length; i += 1) {
      for (let j = i + 1; j < linked.length; j += 1) {
        const a = assertions.get(currentLink(linked[i]).assertion_id);
        const b = assertions.get(currentLink(linked[j]).assertion_id);
        if (!a || !b || a.cas !== b.cas || a.id === b.id) continue;
        const sameValue = a.range_min === b.range_min && a.range_max === b.range_max && a.proportion === b.proportion;
        if (sameValue) continue;
        const ma = state.masks.get(linked[i].id);
        const mb = state.masks.get(linked[j].id);
        let overlap = 0;
        let sumU = 0;
        let sumV = 0;
        for (let k = 0; k < ma.length; k += 1) {
          if (ma[k] && mb[k]) {
            overlap += 1;
            sumU += (k % MASK_W) / MASK_W;
            sumV += Math.floor(k / MASK_W) / MASK_H;
          }
        }
        if (overlap > 0) out.push({ a: linked[i], b: linked[j], assertionA: a, assertionB: b, overlap, centroid: [sumU / overlap, sumV / overlap] });
      }
    }
    return out;
  }

  function normalizeTaxon(text) {
    return String(text || "").toLowerCase().replace(/[×x]\s/g, "").replace(/\b(subsp|ssp|var|cv|f)\.?\s/g, " ").replace(/['‘’"]/g, "").split(/\s+/).filter(Boolean);
  }

  /** Compare le taxon déclaré pour l'image au taxon de la preuve, sans trancher. */
  function taxonGap(assertion) {
    if (!state.declared || !state.declared.subject || !assertion || !assertion.plant_latin) return null;
    const image = normalizeTaxon(state.declared.subject);
    const proof = normalizeTaxon(assertion.plant_latin);
    if (image.join(" ") === proof.join(" ")) return null;
    let relation = "genres différents";
    if (image[0] === proof[0]) relation = image[1] === proof[1] ? "même espèce, rang infraspécifique différent" : "même genre, espèce différente";
    return `${relation} : image « ${state.declared.subject} » ≠ preuve « ${assertion.plant_latin} »`;
  }

  // ---------------------------------------------------------------------------
  // Rendu
  // ---------------------------------------------------------------------------

  const VERIFICATION_COLOR = { a_verifier: "#ffcf6e", verifie: "#7ef0a8", conteste: "#ff6b6b", obsolete: "#8a8f99" };
  const LEVEL_DASH = { primaire: [], secondaire: [14, 8], tertiaire: [3, 6] };
  const CONFIDENCE_ALPHA = { haute: 0.4, moyenne: 0.24, basse: 0.12 };

  function fmtRange(a) {
    if (a.range_min !== undefined) return `${String(a.range_min).replace(".", ",")}–${String(a.range_max).replace(".", ",")} %`;
    if (a.proportion !== undefined) return `proportion ${a.proportion} (unité ?)`;
    return "";
  }

  function regionStyle(region) {
    const link = currentLink(region);
    if (!link) return { stroke: "rgba(255,255,255,.65)", dash: [6, 6], fill: null, label: "non liée" };
    if (link.flux === "marge") return { stroke: "#c49bff", dash: [2, 6], fill: null, label: "MARGE · non probant" };
    const a = assertions.get(link.assertion_id);
    const ev = (a && a.evidence) || {};
    const color = VERIFICATION_COLOR[ev.verification] || "#ffffff";
    return {
      stroke: color,
      dash: ev.level in LEVEL_DASH ? LEVEL_DASH[ev.level] : [1, 10],
      fill: ev.confidence in CONFIDENCE_ALPHA ? hexAlpha(color, CONFIDENCE_ALPHA[ev.confidence]) : null,
      label: a ? a.label : link.assertion_id,
    };
  }

  function hexAlpha(hex, alpha) {
    const n = parseInt(hex.slice(1), 16);
    return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${alpha})`;
  }

  function polygonPath(points) {
    const r = imageRect();
    ctx.beginPath();
    points.forEach((p, i) => {
      const [x, y] = toStage(p, r);
      if (i) ctx.lineTo(x, y);
      else ctx.moveTo(x, y);
    });
    ctx.closePath();
  }

  function drawLabel(region, style) {
    const r = imageRect();
    const pts = region.points.map((p) => toStage(p, r));
    const minX = Math.min(...pts.map((p) => p[0]));
    const minY = Math.min(...pts.map((p) => p[1]));
    const link = currentLink(region);
    const a = link && link.assertion_id ? assertions.get(link.assertion_id) : null;
    const ev = (a && a.evidence) || {};
    const lines = [];
    if (a) {
      lines.push(`${a.molecule} · CAS ${a.cas} · ${fmtRange(a)}`);
      lines.push(a.citation ? `${a.citation}` : `${a.pointer.file} · recette ${a.pointer.recette_id}`);
      lines.push(`niveau ${ev.level || "?"} · confiance ${ev.confidence || "non renseignée"} · ${ev.verification ? ev.verification.replace("_", " ") : "vérification ?"}`);
      const gap = taxonGap(a);
      if (gap) {
        const [relation, detail] = gap.split(" : ");
        lines.push(`⚠ écart taxon — ${relation}`);
        lines.push(`⚠   ${detail}`);
      }
    } else if (link && link.free_text) {
      lines.push(`« ${link.free_text} »`);
      lines.push("attribution libre de l’opérateur — ne vaut pas preuve");
    }
    lines.push(`${region.id} · ${a ? a.id : "—"} · seq ${link ? link.seq : region.drawnSeq}${region.links.length > 1 ? ` · ${region.links.length} liaisons dans l’historique` : ""}${region.annotations.length ? ` · ${region.annotations.length} annotation(s)` : ""}`);
    ctx.font = "13px ui-monospace, Menlo, monospace";
    const fitted = lines.map((text) => fitText(text, 660));
    const width = Math.max(...fitted.map((l) => ctx.measureText(l).width)) + 18;
    const x = Math.min(Math.max(minX, 10), W - width - 10);
    const y = Math.max(minY - 10 - lines.length * 17, 6);
    ctx.fillStyle = "rgba(3,6,10,.86)";
    ctx.fillRect(x, y, width, lines.length * 17 + 8);
    ctx.fillStyle = style.stroke;
    ctx.fillRect(x, y, 3, lines.length * 17 + 8);
    fitted.forEach((text, i) => {
      ctx.fillStyle = text.startsWith("⚠") ? "#ff9b9b" : i === lines.length - 1 ? "#9aa7bb" : "#eef3fa";
      ctx.fillText(text, x + 9, y + 17 + i * 17);
    });
  }

  /** Tronque un texte pour qu'il tienne dans `maxWidth` avec la police courante. */
  function fitText(text, maxWidth) {
    if (ctx.measureText(text).width <= maxWidth) return text;
    let cut = text;
    while (cut.length > 4 && ctx.measureText(cut + "…").width > maxWidth) cut = cut.slice(0, -1);
    return cut + "…";
  }

  function render() {
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, W, H);
    const r = imageRect();
    if (state.imageSource && app.imageVisible) ctx.drawImage(state.imageSource, r.x, r.y, r.w, r.h);
    else if (state.imageMeta) {
      ctx.strokeStyle = "rgba(255,255,255,.18)";
      ctx.setLineDash([4, 8]);
      ctx.strokeRect(r.x, r.y, r.w, r.h);
      ctx.setLineDash([]);
      if (!state.imageSource && app.imageVisible) {
        ctx.fillStyle = "#ff9b9b";
        ctx.font = "16px system-ui, sans-serif";
        ctx.fillText(`Image du run absente de cette session : rechargez le fichier sha256 ${PM.short(state.imageMeta.sha256)}… pour vérifier le pointeur.`, r.x + 16, r.y + 28);
      }
    }

    state.order.forEach((id) => {
      const region = state.regions.get(id);
      const style = regionStyle(region);
      polygonPath(region.points);
      if (style.fill) {
        ctx.fillStyle = style.fill;
        ctx.fill();
      }
      ctx.setLineDash(style.dash);
      ctx.lineWidth = state.selected === id ? 4 : 2.5;
      ctx.strokeStyle = style.stroke;
      ctx.stroke();
      ctx.setLineDash([]);
    });

    const conflictList = conflicts();
    conflictList.forEach(({ a, b }) => {
      ctx.save();
      polygonPath(a.points);
      ctx.clip();
      polygonPath(b.points);
      ctx.clip();
      ctx.strokeStyle = "rgba(255,110,110,.85)";
      ctx.lineWidth = 2;
      for (let x = -H; x < W; x += 12) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x + H, H);
        ctx.stroke();
      }
      ctx.restore();
    });

    state.order.forEach((id) => drawLabel(state.regions.get(id), regionStyle(state.regions.get(id))));

    // Les étiquettes de conflit passent au-dessus des autres : elles sont centrées sur la zone commune.
    conflictList.forEach(({ assertionA, assertionB, centroid }) => {
      const [cx, cy] = toStage(centroid, r);
      ctx.font = "bold 13px ui-monospace, Menlo, monospace";
      const lines = [
        `deux mesures coexistent — ${assertionA.molecule}, CAS ${assertionA.cas}`,
        `${fmtRange(assertionA)} [${assertionA.id}]  /  ${fmtRange(assertionB)} [${assertionB.id}]`,
        "aucune ne l’emporte : échantillons et taxons différents",
      ];
      const width = Math.max(...lines.map((l) => ctx.measureText(l).width)) + 16;
      const x = Math.min(Math.max(cx - width / 2, 10), W - width - 10);
      const y = Math.min(Math.max(cy - 30, 10), 790);
      ctx.fillStyle = "rgba(55,0,0,.9)";
      ctx.fillRect(x, y, width, lines.length * 18 + 8);
      ctx.fillStyle = "#ffb3b3";
      lines.forEach((text, i) => ctx.fillText(text, x + 8, y + 18 + i * 18));
    });

    if (draft.length) {
      ctx.strokeStyle = "#7fe3ff";
      ctx.fillStyle = "#7fe3ff";
      ctx.lineWidth = 2;
      ctx.beginPath();
      draft.forEach((p, i) => {
        const [x, y] = toStage(p, r);
        if (i) ctx.lineTo(x, y);
        else ctx.moveTo(x, y);
      });
      ctx.stroke();
      draft.forEach((p) => {
        const [x, y] = toStage(p, r);
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    const cov = coverage();
    const meta = state.imageMeta;
    PM.drawCartel(ctx, {
      x: 20, y: 862, width: 1560, app,
      lines: [
        meta ? `image ${meta.name} · sha256 ${PM.short(meta.sha256) || "générée"} · ${meta.width}×${meta.height}${state.declared ? ` · déclarée : « ${state.declared.subject || "?"} » ${state.declared.date_declared || ""} (seq ${state.declared.seq}, à vérifier)` : " · aucune déclaration"}` : "image : aucune",
        `surface probante ${cov.probant_pct} % · marge seule ${cov.marge_seule_pct} % · NON DOCUMENTÉE ${cov.non_documente_pct} % · zones ${state.order.length} · conflits ${conflicts().length}`,
        `sources : ${DATA.sources.slice(0, 2).map((s) => `${s.path.split("/").pop()} ${PM.short(s.sha256)}`).join(" · ")} · export ${DATA.generated_at.slice(0, 10)} @${(DATA.git_commit || "").slice(0, 7)}`,
        app.imageVisible ? "image affichée (I pour la masquer sur un support physique)" : "image masquée : seules les zones sont projetées sur l’œuvre réelle",
      ],
    });
    refreshMeasures();
  }

  // ---------------------------------------------------------------------------
  // Interactions
  // ---------------------------------------------------------------------------

  function setMode(next) {
    mode = next;
    draft = [];
    $("#mode-label").textContent = mode === "draw" ? "Mode : tracer une zone" : "Mode : sélectionner une zone";
    app.requestRender();
  }

  async function closeDraft() {
    if (draft.length < 3) return;
    const points = draft.map(([u, v]) => [Math.round(u * 10000) / 10000, Math.round(v * 10000) / 10000]);
    draft = [];
    const regionId = `R-${String(state.order.length + 1).padStart(3, "0")}`;
    await app.act("region_drawn", { region_id: regionId, points, coordinates: "normalisées 0–1 dans le repère de l’image" });
  }

  let lastClick = 0;
  $("#pm-viewport").addEventListener("pointerdown", (event) => {
    if (app.mapper.calibrating || event.target.classList.contains("pm-handle")) return;
    const stagePoint = app.mapper.toStage(event.clientX, event.clientY);
    const [u, v] = toImage(stagePoint);
    if (u < 0 || u > 1 || v < 0 || v > 1) return;
    const now = Date.now();
    if (mode === "draw") {
      if (now - lastClick < 300 && draft.length >= 3) {
        closeDraft();
      } else {
        draft.push([u, v]);
      }
      lastClick = now;
    } else {
      const hit = [...state.order].reverse().find((id) => pointInPolygon([u, v], state.regions.get(id).points));
      state.selected = hit || null;
      refreshPanel();
    }
    app.requestRender();
  });

  app.onKey = (event) => {
    const key = event.key;
    if (key === "d" || key === "D") setMode("draw");
    else if (key === "s" || key === "S") setMode("select");
    else if (key === "Enter") closeDraft();
    else if (key === "Escape") { draft = []; app.requestRender(); }
    else if (key === "Backspace") { draft.pop(); app.requestRender(); }
  };

  $("#mode-draw").onclick = () => setMode("draw");
  $("#mode-select").onclick = () => setMode("select");

  $("#image-input").addEventListener("change", async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const loaded = await PM.loadImageFile(file);
    loadedImages.set(loaded.meta.sha256, loaded.image);
    if (state.imageMeta && state.imageMeta.sha256 === loaded.meta.sha256) {
      state.imageSource = loaded.image;
      app.requestRender();
      return;
    }
    if (app.replayState) {
      app.requestRender();
      return;
    }
    await app.act("image_loaded", loaded.meta);
    event.target.value = "";
  });
  $("#demo-button").onclick = () => app.act("image_loaded", PM.demoMeta);
  $("#declare-button").onclick = () => app.act("image_declared", {
    subject: $("#declared-subject").value.trim() || null,
    author: $("#declared-author").value.trim() || null,
    date_declared: $("#declared-date").value.trim() || null,
    status: "témoignage de l’opérateur, à vérifier",
  });

  // ---------------------------------------------------------------------------
  // Panneau
  // ---------------------------------------------------------------------------

  function assertionSelect() {
    const select = el("select", { id: "assertion-select" });
    const groups = { gcms_lot1: "Preuves GC-MS — lot 1 (en revue)", fleur_fantome: "Relations Fleur Fantôme (export 2026-09-15)" };
    Object.entries(groups).forEach(([family, label]) => {
      const group = el("optgroup", { label });
      DATA.assertions.filter((a) => a.family === family).forEach((a) => group.append(el("option", { value: a.id }, `${a.id} · ${a.label} · ${fmtRange(a)}`)));
      select.append(group);
    });
    select.append(el("optgroup", { label: "Marge" }, el("option", { value: "__free__" }, "Attribution libre (non probante)…")));
    return select;
  }

  function refreshPanel() {
    const meta = state.imageMeta;
    $("#image-meta").textContent = meta
      ? `${meta.name} · ${meta.width}×${meta.height} · sha256 ${meta.sha256 || "—"}${meta.exif && meta.exif.datetime_original ? ` · EXIF ${meta.exif.datetime_original}` : meta.generated ? "" : " · aucune date EXIF"}`
      : "Aucune image journalisée.";

    const list = $("#region-list");
    list.replaceChildren(...state.order.map((id) => {
      const region = state.regions.get(id);
      const link = currentLink(region);
      const label = link ? (link.assertion_id || `marge : ${link.free_text}`) : "non liée";
      return el("li", { class: state.selected === id ? "active" : "", onclick: () => { state.selected = id; refreshPanel(); app.requestRender(); } }, `${id} · ${label}`);
    }));

    const detail = $("#region-detail");
    detail.replaceChildren();
    const region = state.selected && state.regions.get(state.selected);
    if (!region) return;
    const select = assertionSelect();
    const free = el("input", { type: "text", placeholder: "attribution libre (marge)" });
    const note = el("textarea", { placeholder: "annotation (n’efface rien)" });
    const reason = el("input", { type: "text", placeholder: "motif obligatoire pour délier" });
    detail.append(
      el("label", {}, `Lier ${region.id} à `, select),
      free,
      el("div", { class: "pm-row" },
        el("button", { onclick: () => {
          if (select.value === "__free__") {
            if (!free.value.trim()) return;
            app.act("region_linked", { region_id: region.id, free_text: free.value.trim() }, { flux: "marge" });
          } else {
            app.act("region_linked", { region_id: region.id, assertion_id: select.value });
          }
        } }, "Lier"),
        el("button", { class: "secondary", onclick: () => {
          if (!reason.value.trim()) return;
          app.act("region_unlinked", { region_id: region.id, reason: reason.value.trim() });
        } }, "Délier")),
      reason,
      note,
      el("button", { class: "secondary", onclick: () => {
        const link = region.links[region.links.length - 1];
        if (!note.value.trim()) return;
        app.journal.annotate(link ? link.seq : region.drawnSeq, note.value.trim()).catch((e) => { app.journal.lastError = e.message; app.renderStatus(); });
      } }, "Annoter"),
      el("div", { class: "pm-small" }, `Historique : ${region.links.map((l) => `#${l.seq} ${l.type === "region_linked" ? (l.assertion_id || "marge") : "délié (" + l.reason + ")"}`).join(" → ") || "aucune liaison"}`),
      ...region.annotations.map((a) => el("div", { class: "pm-small" }, `✎ #${a.seq} ${a.text}`)),
    );
  }

  function refreshMeasures() {
    const cov = coverage();
    const conflictList = conflicts();
    const gaps = state.order.map((id) => {
      const link = currentLink(state.regions.get(id));
      const gap = link && link.assertion_id ? taxonGap(assertions.get(link.assertion_id)) : null;
      return gap ? `${id} : ${gap}` : null;
    }).filter(Boolean);
    $("#measures").replaceChildren(
      el("div", {}, `Surface probante : ${cov.probant_pct} % · marge seule : ${cov.marge_seule_pct} % · non documentée : ${cov.non_documente_pct} %`),
      el("div", {}, `Conflits de mesures superposées : ${conflictList.length}`),
      ...conflictList.map((c) => el("div", {}, `· ${c.a.id} × ${c.b.id} — ${c.assertionA.molecule} ${fmtRange(c.assertionA)} / ${fmtRange(c.assertionB)}`)),
      el("div", {}, `Écarts de taxon : ${gaps.length}`),
      ...gaps.map((g) => el("div", {}, `· ${g}`)),
    );
  }

  PM.mountShell(app);
  setMode("draw");
  refreshPanel();
})();
