/* PERFUMUM — 02 Purge. Script classique (compatible file://). */
(function () {
  "use strict";
  const { $, el } = PM;
  const TL = window.PM_TIMELINE;
  const W = 1600;
  const H = 1000;
  const GRID = { x: 230, y: 70, w: 1350, h: 770 };
  const DAY = 86400000;
  const MOTIVE_TIMEOUT_MS = 12000;
  const canvas = $("#canvas");
  const ctx = canvas.getContext("2d");
  const demoCanvas = PM.demoImage("PURGE — MIRE");
  const loadedImages = new Map();

  // ---------------------------------------------------------------------------
  // Préparation de la frise (déterministe, à partir de l'export expurgé)
  // ---------------------------------------------------------------------------

  const entries = TL.entries
    .map(([t, kind, table, error]) => ({ t, kind: TL.kinds[kind], table: table >= 0 ? TL.tables[table] : null, error: error === 1 }))
    .sort((a, b) => a.t - b.t);
  const purgesByFile = new Map();
  TL.purges.forEach((p) => {
    if (!purgesByFile.has(p.file)) purgesByFile.set(p.file, { file: p.file, t: p.t, error: p.error, statements: [] });
    purgesByFile.get(p.file).statements.push(p);
  });
  const purgeFiles = [...purgesByFile.values()].sort((a, b) => a.t - b.t);
  const t0 = Math.floor(entries[0].t / DAY) * DAY;
  const tEnd = (Math.floor(entries[entries.length - 1].t / DAY) + 1) * DAY;
  const nDays = Math.round((tEnd - t0) / DAY);

  const tableCounts = new Map();
  entries.forEach((e) => tableCounts.set(e.table, (tableCounts.get(e.table) || 0) + 1));
  const purgeTables = new Set(TL.purges.map((p) => p.table));
  const ranked = [...tableCounts.entries()].filter(([table]) => table).sort((a, b) => b[1] - a[1]).map(([table]) => table);
  const rows = [...new Set([...ranked.filter((t) => purgeTables.has(t)), ...ranked])].slice(0, 24);
  rows.sort((a, b) => tableCounts.get(b) - tableCounts.get(a));
  const OTHER = "autres tables";
  const NONE = "sans table";
  rows.push(OTHER, NONE);
  const rowIndex = (table) => (table === null ? rows.length - 1 : rows.indexOf(table) >= 0 ? rows.indexOf(table) : rows.length - 2);
  const rowH = GRID.h / rows.length;
  const colW = GRID.w / nDays;
  const xOf = (t) => GRID.x + ((t - t0) / (tEnd - t0)) * GRID.w;
  const dayOf = (t) => Math.floor((t - t0) / DAY);

  // ---------------------------------------------------------------------------
  // État (réduit depuis les événements du run) et calcul de la grille
  // ---------------------------------------------------------------------------

  let state;
  let grid;

  function resetGrid() {
    grid = {
      exposure: rows.map(() => new Float32Array(nDays)),
      errors: rows.map(() => new Uint16Array(nDays)),
      erased: rows.map(() => new Uint8Array(nDays)),
      totalPurges: [],
      partialPurges: [],
      refusedPurges: [],
      processed: 0,
      purgesProcessed: 0,
      cursor: t0,
      last: null,
    };
  }

  function resetState() {
    state = {
      imageMeta: null, imageSource: null,
      playing: false, speed: 100000, anchorArchive: t0, anchorWall: performance.now(),
      stopMode: "executed", reached: new Map(), awaiting: null, awaitingSince: 0,
    };
    resetGrid();
  }
  resetState();

  /** Avance (ou recalcule) la grille jusqu'au curseur d'archive. */
  function advanceTo(cursor) {
    if (cursor < grid.cursor) resetGrid();
    while (grid.processed < entries.length && entries[grid.processed].t <= cursor) {
      const e = entries[grid.processed];
      const row = rowIndex(e.table);
      const day = dayOf(e.t);
      if (e.error) grid.errors[row][day] += 1;
      else grid.exposure[row][day] += 1;
      grid.last = e;
      grid.processed += 1;
    }
    while (grid.purgesProcessed < purgeFiles.length && purgeFiles[grid.purgesProcessed].t <= cursor) {
      const purge = purgeFiles[grid.purgesProcessed];
      purge.statements.forEach((s) => {
        const row = rowIndex(s.table);
        const mark = { ...s, row };
        if (s.error) grid.refusedPurges.push(mark);
        else if (s.partial) grid.partialPurges.push(mark);
        else {
          for (let d = 0; d <= dayOf(s.t); d += 1) {
            if (grid.exposure[row][d] > 0) grid.erased[row][d] = 1;
            grid.exposure[row][d] = 0;
          }
          grid.totalPurges.push(mark);
        }
      });
      grid.purgesProcessed += 1;
    }
    grid.cursor = cursor;
  }

  function currentCursor() {
    if (!state.playing) return state.anchorArchive;
    const scale = app.replayState ? (Number.isFinite(app.replayState.speed) ? app.replayState.speed : 1) : 1;
    return Math.min(tEnd, state.anchorArchive + (performance.now() - state.anchorWall) * state.speed * scale);
  }

  function setAnchor(archiveMs, playing) {
    state.anchorArchive = archiveMs;
    state.anchorWall = performance.now();
    state.playing = playing;
  }

  function apply(line) {
    const p = line.payload || {};
    switch (line.event_type) {
      case "image_loaded":
        state.imageMeta = p;
        state.imageSource = p.generated ? demoCanvas : loadedImages.get(p.sha256) || null;
        break;
      case "playback":
        if (p.speed) state.speed = p.speed;
        if (p.stop_mode) state.stopMode = p.stop_mode;
        setAnchor(p.archive_ms, p.action === "play");
        if (p.action === "play") state.awaiting = null;
        advanceTo(p.archive_ms);
        break;
      case "purge_reached":
        setAnchor(p.archive_ms, false);
        advanceTo(p.archive_ms);
        state.reached.set(p.file, { ...p, seq: line.seq, motive: null });
        state.awaiting = p.file;
        state.awaitingSince = performance.now();
        break;
      case "purge_motive": {
        const reached = state.reached.get(p.file);
        if (reached) reached.motive = { ...p, seq: line.seq, actor: line.actor_source };
        if (state.awaiting === p.file) state.awaiting = null;
        break;
      }
      case "run_closed":
        // Un run clos ne lit plus : le curseur se fige là où le run s'est arrêté.
        setAnchor(currentCursor(), false);
        advanceTo(state.anchorArchive);
        state.awaiting = null;
        break;
      default:
        break;
    }
    refreshPanel();
  }

  const app = PM.createApp({
    concept: "MAP-02-purge",
    title: "Purge",
    sources: [{ path: TL.source.path, manifest_sha256: TL.source.manifest_sha256, file_count: TL.source.file_count }],
    width: W,
    height: H,
    apply,
    resetState,
    render,
  });
  app.headerExtra = () => ({ timeline_export: { generated_at: TL.generated_at, git_commit: TL.git_commit, redaction: TL.redaction } });
  app.summary = () => ({
    cursor_utc: new Date(state.anchorArchive).toISOString(),
    purges_reached: state.reached.size,
    motives: [...state.reached.values()].reduce((acc, r) => {
      const key = r.motive ? r.motive.motive : "en attente";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {}),
  });

  // ---------------------------------------------------------------------------
  // Boucle de lecture : arrêt aux purges (direct seulement ; le rejeu suit le journal)
  // ---------------------------------------------------------------------------

  function shouldStopAt(purge) {
    if (state.stopMode === "none") return false;
    if (state.stopMode === "executed" && purge.error) return false;
    return !state.reached.has(purge.file);
  }

  function liveTick() {
    if (app.replayState || !app.journal.header || app.journal.closed) return;
    if (state.awaiting) {
      if (performance.now() - state.awaitingSince > MOTIVE_TIMEOUT_MS && !state.timeoutSent) {
        state.timeoutSent = true;
        const file = state.awaiting;
        app.act("purge_motive", { file, motive: "absent", text: null, note: `aucune réponse en ${MOTIVE_TIMEOUT_MS / 1000} s` }, { actor: "sequencer" })
          .then(() => app.act("playback", { action: "play", archive_ms: state.anchorArchive, speed: state.speed, stop_mode: state.stopMode }, { actor: "sequencer" }))
          .finally(() => { state.timeoutSent = false; });
      }
      return;
    }
    if (!state.playing) return;
    const cursor = currentCursor();
    const next = purgeFiles.find((purge) => purge.t > grid.cursor && purge.t <= cursor && shouldStopAt(purge));
    if (next && !state.pendingStop) {
      state.pendingStop = true;
      state.playing = false;
      app.act("purge_reached", {
        file: next.file, archive_ms: next.t, refused: next.error,
        statements: next.statements.map((s) => ({ kind: s.kind, table: s.table, partial: s.partial })),
      }, { actor: "sequencer" }).finally(() => { state.pendingStop = false; });
      return;
    }
    if (cursor >= tEnd) {
      // Garde locale : évite d'émettre un arrêt à chaque image tant que l'événement n'est pas écrit.
      state.playing = false;
      state.anchorArchive = tEnd;
      app.act("playback", { action: "pause", archive_ms: tEnd, speed: state.speed, reason: "fin de l’archive" }, { actor: "sequencer" });
      return;
    }
    advanceTo(cursor);
  }

  // ---------------------------------------------------------------------------
  // Rendu
  // ---------------------------------------------------------------------------

  function drawImageCover(source) {
    const iw = source.width || source.naturalWidth;
    const ih = source.height || source.naturalHeight;
    const scale = Math.max(GRID.w / iw, GRID.h / ih);
    const sw = GRID.w / scale;
    const sh = GRID.h / scale;
    ctx.drawImage(source, (iw - sw) / 2, (ih - sh) / 2, sw, sh, GRID.x, GRID.y, GRID.w, GRID.h);
  }

  function render() {
    if (state.playing) {
      if (app.replayState) advanceTo(currentCursor());
      else liveTick();
      app.requestRender();
    } else if (state.awaiting && !app.replayState) {
      liveTick();
      app.requestRender();
    }

    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, W, H);
    const showImage = app.imageVisible && state.imageSource;

    if (showImage) drawImageCover(state.imageSource);
    for (let r = 0; r < rows.length; r += 1) {
      for (let d = 0; d < nDays; d += 1) {
        const visible = 1 - Math.exp(-grid.exposure[r][d]);
        const x = GRID.x + d * colW;
        const y = GRID.y + r * rowH;
        if (showImage) {
          ctx.fillStyle = `rgba(0,0,0,${1 - visible})`;
          ctx.fillRect(x, y, colW + 0.5, rowH + 0.5);
        } else if (visible > 0) {
          // Support physique : la lumière projetée révèle l'œuvre réelle là où l'archive a travaillé.
          ctx.fillStyle = `rgba(255,248,235,${visible})`;
          ctx.fillRect(x, y, colW + 0.5, rowH + 0.5);
        }
        if (grid.erased[r][d] && !grid.exposure[r][d]) {
          // Fantôme : ici l'archive avait travaillé, une purge totale l'a effacé.
          ctx.strokeStyle = "rgba(255,255,255,.55)";
          ctx.lineWidth = 1;
          ctx.strokeRect(x + 1.5, y + 1.5, colW - 3, rowH - 3);
        }
        if (grid.errors[r][d]) {
          ctx.fillStyle = "#ff5a5a";
          ctx.beginPath();
          ctx.arc(x + colW / 2, y + rowH - 5, Math.min(4, 1.5 + grid.errors[r][d] * 0.5), 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    // Purges partielles : étendue inconnue → hachure sur l'histoire antérieure de la table.
    grid.partialPurges.forEach((p) => {
      const y = GRID.y + p.row * rowH;
      ctx.save();
      ctx.beginPath();
      ctx.rect(GRID.x, y, xOf(p.t) - GRID.x, rowH);
      ctx.clip();
      ctx.strokeStyle = "rgba(255,207,110,.55)";
      ctx.lineWidth = 1;
      for (let x = GRID.x - rowH; x < xOf(p.t); x += 9) {
        ctx.beginPath();
        ctx.moveTo(x, y + rowH);
        ctx.lineTo(x + rowH, y);
        ctx.stroke();
      }
      ctx.restore();
      ctx.strokeStyle = "#ffcf6e";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(xOf(p.t), y);
      ctx.lineTo(xOf(p.t), y + rowH);
      ctx.stroke();
    });
    // Purges totales : ligne blanche franche, l'histoire visible de la table est effacée.
    grid.totalPurges.forEach((p) => {
      const y = GRID.y + p.row * rowH;
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(xOf(p.t), y - 4);
      ctx.lineTo(xOf(p.t), y + rowH + 4);
      ctx.stroke();
      ctx.fillStyle = "rgba(0,0,0,.85)";
      ctx.font = "bold 12px ui-monospace, Menlo, monospace";
      const text = `${p.kind} total · ${p.table} · ${PM.fmtDate(p.t)} · ${p.file.replace(".json", "")}`;
      const width = ctx.measureText(text).width + 10;
      const x = Math.min(xOf(p.t) + 6, W - width - 8);
      ctx.fillRect(x, y + 2, width, 17);
      ctx.fillStyle = "#ffffff";
      ctx.fillText(text, x + 5, y + 15);
    });
    // Purges refusées : cercle pointillé rouge.
    grid.refusedPurges.forEach((p) => {
      const y = GRID.y + p.row * rowH + rowH / 2;
      ctx.strokeStyle = "#ff6b6b";
      ctx.setLineDash([3, 3]);
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(xOf(p.t), y, rowH / 2 - 2, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
    });

    // Étiquettes de lignes et axe des mois.
    ctx.font = "12px ui-monospace, Menlo, monospace";
    rows.forEach((table, r) => {
      ctx.fillStyle = purgeTables.has(table) ? "#ffd9a0" : "#9aa7bb";
      const label = table.length > 24 ? table.slice(0, 23) + "…" : table;
      ctx.fillText(label, 14, GRID.y + r * rowH + rowH / 2 + 4);
    });
    ctx.strokeStyle = "rgba(255,255,255,.25)";
    ctx.strokeRect(GRID.x, GRID.y, GRID.w, GRID.h);
    const start = new Date(t0);
    for (let m = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth() + 1, 1)); m.getTime() < tEnd; m = new Date(Date.UTC(m.getUTCFullYear(), m.getUTCMonth() + 1, 1))) {
      const x = xOf(m.getTime());
      ctx.strokeStyle = "rgba(255,255,255,.35)";
      ctx.beginPath();
      ctx.moveTo(x, GRID.y - 8);
      ctx.lineTo(x, GRID.y + GRID.h);
      ctx.stroke();
      ctx.fillStyle = "#c9d3e3";
      ctx.fillText(m.toISOString().slice(0, 7), x + 4, GRID.y - 12);
    }
    ctx.fillStyle = "#c9d3e3";
    ctx.fillText(PM.fmtDate(t0, false), GRID.x, GRID.y - 30);
    ctx.fillText(`→ ${PM.fmtDate(tEnd - 1, false)} · ${nDays} jours · ${rows.length} lignes`, GRID.x + 110, GRID.y - 30);

    // Curseur d'archive.
    const cursorX = xOf(grid.cursor);
    ctx.strokeStyle = "#7fe3ff";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cursorX, GRID.y - 6);
    ctx.lineTo(cursorX, GRID.y + GRID.h + 6);
    ctx.stroke();

    const exposedCells = grid.exposure.reduce((sum, row) => sum + row.filter((v) => v > 0).length, 0);
    const last = grid.last;
    const motives = [...state.reached.values()];
    const unknown = motives.filter((r) => r.motive && r.motive.motive !== "connu").length;
    const meta = state.imageMeta;
    PM.drawCartel(ctx, {
      x: 20, y: 862, width: 1560, app,
      lines: [
        `curseur ${PM.fmtDate(grid.cursor)} · requêtes lues ${grid.processed}/${entries.length} · ${last ? `dernière : ${last.error ? "db-query-error" : "db-query"}-${last.t} · ${last.kind} · ${last.table || "—"}${last.error ? " · ÉCHEC" : ""}` : "aucune"}`,
        `cellules exposées ${exposedCells}/${rows.length * nDays} · purges totales ${grid.totalPurges.length} · partielles ${grid.partialPurges.length} · refusées ${grid.refusedPurges.length} · motifs inconnus ou absents ${unknown}/${motives.length}`,
        `source .manus/db · ${TL.source.file_count} fichiers · manifeste sha256 ${PM.short(TL.source.manifest_sha256)} · export ${TL.generated_at.slice(0, 10)} @${(TL.git_commit || "").slice(0, 7)} · sans hôte ni SQL`,
        meta ? `image ${meta.name} · sha256 ${PM.short(meta.sha256) || "générée"} · ${showImage ? "affichée" : "masquée : la lumière révèle l’œuvre réelle"}` : "image : aucune — la grille reste lisible seule",
      ],
    });
  }

  // ---------------------------------------------------------------------------
  // Panneau et commandes
  // ---------------------------------------------------------------------------

  function refreshPanel() {
    const meta = state.imageMeta;
    $("#image-meta").textContent = meta ? `${meta.name} · ${meta.width}×${meta.height} · sha256 ${meta.sha256 || "—"}` : "Aucune image journalisée.";
    $("#cursor-label").textContent = `Curseur : ${PM.fmtDate(state.anchorArchive)}${state.playing ? " · lecture" : " · arrêt"}`;
    $("#seek").value = String(Math.round(((state.anchorArchive - t0) / (tEnd - t0)) * 1000));
    const awaiting = state.awaiting && state.reached.get(state.awaiting);
    $("#motive-section").hidden = !awaiting || Boolean(app.replayState);
    if (awaiting) {
      $("#motive-detail").textContent = `${awaiting.file} · ${PM.fmtDate(awaiting.archive_ms)} · ${awaiting.refused ? "REFUSÉE par la base · " : ""}${awaiting.statements.map((s) => `${s.kind} ${s.partial ? "partiel" : "total"} ${s.table}`).join(" ; ")}`;
    }
    $("#purge-list").replaceChildren(...[...state.reached.values()].map((r) => el("li", {},
      `${PM.fmtDate(r.archive_ms, false)} · ${r.statements.map((s) => s.table).join(", ")} · ${r.refused ? "refusée · " : ""}motif : ${r.motive ? `${r.motive.motive}${r.motive.text ? ` (« ${r.motive.text} »)` : ""} #${r.motive.seq}` : "en attente"}`)));
  }

  setInterval(() => {
    if (state.awaiting && !app.replayState) {
      const left = Math.max(0, MOTIVE_TIMEOUT_MS - (performance.now() - state.awaitingSince));
      $("#motive-timer").textContent = `Sans réponse dans ${Math.ceil(left / 1000)} s, le motif sera journalisé « absent ».`;
    }
  }, 250);

  const playback = (action, archiveMs = currentCursor()) => app.act("playback", {
    action, archive_ms: Math.round(archiveMs), speed: Number($("#speed-select").value), stop_mode: $("#stop-select").value,
  });

  $("#play-button").onclick = () => {
    if (state.awaiting) return;
    playback("play", state.anchorArchive >= tEnd ? t0 : currentCursor());
  };
  $("#pause-button").onclick = () => playback("pause");
  $("#restart-button").onclick = () => playback("pause", t0);
  $("#speed-select").onchange = () => playback(state.playing ? "play" : "pause");
  $("#stop-select").onchange = () => playback(state.playing ? "play" : "pause");
  $("#seek").onchange = (event) => playback("seek", t0 + (Number(event.target.value) / 1000) * (tEnd - t0));

  const answer = (motive) => {
    const file = state.awaiting;
    if (!file) return;
    const text = $("#motive-text").value.trim() || null;
    $("#motive-text").value = "";
    app.act("purge_motive", { file, motive, text }).then(() => playback("play", state.anchorArchive));
  };
  $("#motive-known").onclick = () => answer("connu");
  $("#motive-unknown").onclick = () => answer("inconnu");

  $("#image-input").addEventListener("change", async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const loaded = await PM.loadImageFile(file);
    loadedImages.set(loaded.meta.sha256, loaded.image);
    if ((state.imageMeta && state.imageMeta.sha256 === loaded.meta.sha256) || app.replayState) {
      if (state.imageMeta && state.imageMeta.sha256 === loaded.meta.sha256) state.imageSource = loaded.image;
      app.requestRender();
      return;
    }
    await app.act("image_loaded", loaded.meta);
    event.target.value = "";
  });
  $("#demo-button").onclick = () => app.act("image_loaded", PM.demoMeta);

  app.onKey = (event) => {
    if (event.key === " ") {
      event.preventDefault();
      if (state.playing) $("#pause-button").click();
      else $("#play-button").click();
    }
  };

  PM.mountShell(app);
  refreshPanel();
})();
