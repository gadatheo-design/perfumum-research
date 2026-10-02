/* PERFUMUM — 04 Érosion. Script classique (compatible file://). */
(function () {
  "use strict";
  const { $, el } = PM;
  const DATA = window.PM_DATA;
  const W = 1600;
  const H = 1000;
  const GRID = { x: 20, y: 20, w: 1560, h: 680 };
  const COLS = 11;
  const ROWS = 7;
  const canvas = $("#canvas");
  const ctx = canvas.getContext("2d");
  const demoCanvas = PM.demoImage("ÉROSION — MIRE");
  const loadedImages = new Map();
  const pool = DATA.absence_pool;
  const poolById = new Map(pool.map((item) => [item.id, item]));

  // Phrases fixes par catégorie (rédigées pour le prototype, à relire) : la lacune n'autorise pas la conclusion suivante.
  const FORBIDDEN = {
    ref_sans_doi: "…que cette source est fausse ou non scientifique : une notice sans DOI est courante pour une source ancienne, locale ou institutionnelle.",
    molecule_manquante: "…que cette molécule manque aujourd’hui à la base : la liste qui la déclare manquante n’est pas datée (versée au dépôt le 2026-08-22).",
    plante_non_geocodee: "…que cette plante n’a pas d’origine : seule sa localisation n’est pas renseignée.",
    variation_sans_source: "…que ces plages sont des mesures : aucune source, méthode ni échantillon n’est attaché à cette variation.",
    preuve_retenue: "…que cette relation est fausse : elle est retenue, en attente d’une décision humaine.",
  };
  const CATEGORY_LABEL = {
    ref_sans_doi: "référence sans DOI",
    molecule_manquante: "molécule absente de la base",
    plante_non_geocodee: "plante non géocodée",
    variation_sans_source: "variation sans source",
    preuve_retenue: "preuve retenue",
  };
  const CATEGORY_COLOR = {
    ref_sans_doi: "#8fb8ff", molecule_manquante: "#ffcf6e", plante_non_geocodee: "#7ef0a8",
    variation_sans_source: "#ff9bd2", preuve_retenue: "#c49bff",
  };

  // Placement : permutation déterministe des tuiles, graine = empreinte du premier fichier source de l'export.
  const tileOf = new Map();
  (function assignTiles() {
    const rng = PM.prng(DATA.sources[0].sha256);
    const cells = [...Array(COLS * ROWS).keys()];
    for (let i = cells.length - 1; i > 0; i -= 1) {
      const j = Math.floor(rng() * (i + 1));
      [cells[i], cells[j]] = [cells[j], cells[i]];
    }
    pool.forEach((item, index) => tileOf.set(item.id, cells[index]));
  })();
  const tileW = GRID.w / COLS;
  const tileH = GRID.h / ROWS;
  const freeCells = new Set([...Array(COLS * ROWS).keys()].filter((cell) => ![...tileOf.values()].includes(cell)));

  let state;
  let liveSeed = null; // graine du run en direct, conservée quand on revient d'un rejeu
  function resetState() {
    state = { imageMeta: null, imageSource: null, seed: liveSeed, drawn: new Map(), order: [], pending: null, verification: [] };
  }
  resetState();

  /** Tirage pondéré déterministe : k-ième valeur du PRNG, parmi les absences restantes dans l'ordre du pool. */
  function expectedDraw(seed, k, drawnIds) {
    const rng = PM.prng(seed);
    let r = 0;
    for (let i = 0; i <= k; i += 1) r = rng();
    const remaining = pool.filter((item) => !drawnIds.has(item.id));
    const total = remaining.reduce((sum, item) => sum + item.weight, 0);
    let target = r * total;
    for (const item of remaining) {
      target -= item.weight;
      if (target < 0) return { item, r, total };
    }
    return { item: remaining[remaining.length - 1], r, total };
  }

  function apply(line) {
    const p = line.payload || {};
    switch (line.event_type) {
      case "image_loaded":
        state.imageMeta = p;
        state.imageSource = p.generated ? demoCanvas : loadedImages.get(p.sha256) || null;
        break;
      case "absence_drawn": {
        const expected = state.seed ? expectedDraw(state.seed, p.draw_index, new Set(state.order)) : null;
        state.verification.push({ index: p.draw_index, ok: Boolean(expected && expected.item.id === p.item_id) });
        state.drawn.set(p.item_id, { ...p, seq: line.seq, decision: null });
        state.order.push(p.item_id);
        state.pending = p.item_id;
        break;
      }
      case "absence_decided": {
        const drawn = state.drawn.get(p.item_id);
        if (drawn) drawn.decision = { decision: p.decision, seq: line.seq };
        if (state.pending === p.item_id) state.pending = null;
        break;
      }
      default:
        break;
    }
    refreshPanel();
  }

  const app = PM.createApp({
    concept: "MAP-04-erosion",
    title: "Érosion",
    sources: DATA.sources,
    width: W,
    height: H,
    apply,
    resetState,
    render,
  });
  app.headerExtra = () => ({ pool_size: pool.length, weight_formula: DATA.absence_weight_formula, data_export: { generated_at: DATA.generated_at, git_commit: DATA.git_commit } });
  app.afterStart = () => {
    liveSeed = app.journal.header.seed;
    state.seed = liveSeed;
    refreshPanel();
  };
  app.onReplayHeader = (header) => {
    state.seed = header.seed;
  };
  app.summary = () => ({
    drawn: state.order.length,
    remaining: pool.length - state.order.length,
    kept: [...state.drawn.values()].filter((d) => d.decision && d.decision.decision === "garder").length,
    left: [...state.drawn.values()].filter((d) => d.decision && d.decision.decision === "laisser").length,
  });

  // ---------------------------------------------------------------------------
  // Rendu
  // ---------------------------------------------------------------------------

  function cellRect(cell) {
    return { x: GRID.x + (cell % COLS) * tileW, y: GRID.y + Math.floor(cell / COLS) * tileH, w: tileW, h: tileH };
  }

  function drawImageCover(source) {
    const iw = source.width || source.naturalWidth;
    const ih = source.height || source.naturalHeight;
    const scale = Math.max(GRID.w / iw, GRID.h / ih);
    const sw = GRID.w / scale;
    const sh = GRID.h / scale;
    ctx.drawImage(source, (iw - sw) / 2, (ih - sh) / 2, sw, sh, GRID.x, GRID.y, GRID.w, GRID.h);
  }

  function render() {
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, W, H);
    const showImage = app.imageVisible && state.imageSource;
    if (showImage) drawImageCover(state.imageSource);

    freeCells.forEach((cell) => {
      const r = cellRect(cell);
      ctx.fillStyle = "#000";
      ctx.fillRect(r.x, r.y, r.w, r.h);
      ctx.fillStyle = "#4b5566";
      ctx.font = "11px ui-monospace, Menlo, monospace";
      ctx.fillText("hors pool", r.x + 8, r.y + 18);
    });

    state.order.forEach((id) => {
      const item = poolById.get(id);
      const drawn = state.drawn.get(id);
      const r = cellRect(tileOf.get(id));
      const color = CATEGORY_COLOR[item.category] || "#ffffff";
      const left = drawn.decision && drawn.decision.decision === "laisser";
      ctx.fillStyle = left ? "#0c0f14" : "#f4efe6";
      ctx.fillRect(r.x + 1, r.y + 1, r.w - 2, r.h - 2);
      ctx.fillStyle = color;
      ctx.fillRect(r.x + 1, r.y + 1, 6, r.h - 2);
      ctx.fillStyle = left ? "#8a94a6" : "#11161f";
      ctx.font = "bold 12px ui-monospace, Menlo, monospace";
      ctx.fillText(item.id.length > 18 ? item.id.slice(0, 17) + "…" : item.id, r.x + 12, r.y + 18);
      ctx.font = "11px system-ui, sans-serif";
      PM.wrapText(ctx, item.title, r.x + 12, r.y + 34, r.w - 20, 13, 3);
      ctx.font = "10px ui-monospace, Menlo, monospace";
      ctx.fillStyle = left ? "#6f7c90" : "#5a4632";
      ctx.fillText(`#${drawn.draw_index + 1} · seq ${drawn.seq} · ${drawn.decision ? drawn.decision.decision : "?"}`, r.x + 12, r.y + r.h - 8);
      if (item.contradiction) {
        // Coin rouge : l'absence est contredite par une autre source du dépôt.
        ctx.fillStyle = "#ff5a5a";
        ctx.beginPath();
        ctx.moveTo(r.x + r.w - 1, r.y + 1);
        ctx.lineTo(r.x + r.w - 22, r.y + 1);
        ctx.lineTo(r.x + r.w - 1, r.y + 22);
        ctx.fill();
      }
      if (state.pending === id) {
        ctx.strokeStyle = "#ff5a5a";
        ctx.lineWidth = 3;
        ctx.strokeRect(r.x + 2, r.y + 2, r.w - 4, r.h - 4);
      }
    });

    ctx.strokeStyle = "rgba(255,255,255,.12)";
    ctx.lineWidth = 1;
    for (let c = 0; c <= COLS; c += 1) {
      ctx.beginPath();
      ctx.moveTo(GRID.x + c * tileW, GRID.y);
      ctx.lineTo(GRID.x + c * tileW, GRID.y + GRID.h);
      ctx.stroke();
    }
    for (let r = 0; r <= ROWS; r += 1) {
      ctx.beginPath();
      ctx.moveTo(GRID.x, GRID.y + r * tileH);
      ctx.lineTo(GRID.x + GRID.w, GRID.y + r * tileH);
      ctx.stroke();
    }

    // Fiche détaillée de la dernière absence tirée.
    const lastId = state.order[state.order.length - 1];
    ctx.fillStyle = "#06090e";
    ctx.fillRect(20, 712, 1560, 140);
    if (lastId) {
      const item = poolById.get(lastId);
      const drawn = state.drawn.get(lastId);
      ctx.fillStyle = CATEGORY_COLOR[item.category];
      ctx.fillRect(20, 712, 8, 140);
      ctx.font = "bold 20px ui-monospace, Menlo, monospace";
      ctx.fillStyle = "#f4efe6";
      const pointer = `${item.pointer.file}${item.pointer.id ? ` · ${item.pointer.table} #${item.pointer.id}` : ""}${item.pointer.key ? ` · ${item.pointer.key}` : ""}`;
      ctx.fillText(pointer.length > 110 ? pointer.slice(0, 109) + "…" : pointer, 40, 742);
      ctx.font = "15px system-ui, sans-serif";
      ctx.fillStyle = "#c9d3e3";
      ctx.fillText(`${CATEGORY_LABEL[item.category]} · ${item.title}`.slice(0, 150), 40, 768);
      ctx.fillStyle = "#9aa7bb";
      ctx.fillText(`manque : ${item.missing.join(", ")} · poids ${item.weight} · tirage #${drawn.draw_index + 1} · r = ${drawn.r.toFixed(6)} sur un poids restant de ${drawn.total_weight}`.slice(0, 170), 40, 792);
      ctx.font = "italic 17px system-ui, sans-serif";
      ctx.fillStyle = "#ffe2a8";
      ctx.fillText(`Ceci interdit de conclure ${FORBIDDEN[item.category]}`.slice(0, 160), 40, 822);
      if (item.contradiction) {
        const c = item.contradiction;
        ctx.font = "bold 14px ui-monospace, Menlo, monospace";
        ctx.fillStyle = "#ff8f8f";
        ctx.fillText(`⚠ absence contredite, non résolue : ${c.statement} — ${c.file} (${c.exported_at}) · molecule_id ${c.molecule_id} · CAS ${c.cas}`.slice(0, 160), 40, 845);
      }
    } else {
      ctx.font = "16px system-ui, sans-serif";
      ctx.fillStyle = "#9aa7bb";
      ctx.fillText("Aucune absence tirée : l’œuvre est intacte. Démarrez un run puis tirez.", 40, 790);
    }

    const verified = state.verification.filter((v) => v.ok).length;
    const meta = state.imageMeta;
    PM.drawCartel(ctx, {
      x: 20, y: 862, width: 1560, app,
      lines: [
        `absences ${pool.length} · consultées ${state.order.length} · restantes ${pool.length - state.order.length} · tuiles hors pool ${freeCells.size}`,
        `graine ${state.seed || "—"} · tirages recalculés et conformes ${verified}/${state.verification.length}${state.verification.some((v) => !v.ok) ? " · DIVERGENCE" : ""}`,
        `sources : ${DATA.sources.slice(2, 6).map((s) => `${s.path.split("/").pop()} ${PM.short(s.sha256)}`).join(" · ")}`,
        meta ? `œuvre ${meta.name} · sha256 ${PM.short(meta.sha256) || "générée"} · ${showImage ? "affichée" : "masquée : les fiches recouvrent l’œuvre réelle, le reste ne reçoit aucune lumière"}` : "œuvre : aucune",
      ],
    });
  }

  // ---------------------------------------------------------------------------
  // Commandes
  // ---------------------------------------------------------------------------

  function refreshPanel() {
    const meta = state.imageMeta;
    $("#image-meta").textContent = meta ? `${meta.name} · ${meta.width}×${meta.height} · sha256 ${meta.sha256 || "—"}` : "Aucune image journalisée.";
    $("#draw-info").textContent = state.seed
      ? `Graine ${state.seed} · ${pool.length - state.order.length} absences restantes`
      : "Démarrez un run : la graine du tirage est fixée à l’ouverture.";
    $("#decision").hidden = !state.pending || Boolean(app.replayState);
    $("#draw-button").disabled = Boolean(state.pending) || state.order.length >= pool.length;
    $("#drawn-list").replaceChildren(...[...state.order].reverse().map((id) => {
      const drawn = state.drawn.get(id);
      const item = poolById.get(id);
      return el("li", {}, `#${drawn.draw_index + 1} ${id} · ${CATEGORY_LABEL[item.category]} · ${drawn.decision ? drawn.decision.decision : "en attente"}`);
    }));
  }

  function draw() {
    if (!state.seed || state.pending || state.order.length >= pool.length) return;
    const k = state.order.length;
    const { item, r, total } = expectedDraw(state.seed, k, new Set(state.order));
    app.act("absence_drawn", {
      item_id: item.id, draw_index: k, r: Math.round(r * 1e9) / 1e9, total_weight: total, weight: item.weight,
      category: item.category, pointer: item.pointer, missing: item.missing, contradiction: item.contradiction || null,
      forbidden_conclusion: `Ceci interdit de conclure ${FORBIDDEN[item.category]}`,
    }, { actor: "operator" });
  }

  const decide = (decision) => {
    if (!state.pending) return;
    app.act("absence_decided", { item_id: state.pending, decision });
  };

  $("#draw-button").onclick = draw;
  $("#keep-button").onclick = () => decide("garder");
  $("#leave-button").onclick = () => decide("laisser");
  app.onKey = (event) => {
    if (event.key === " ") {
      event.preventDefault();
      draw();
    } else if (event.key === "g" || event.key === "G") decide("garder");
    else if (event.key === "l" || event.key === "L") decide("laisser");
  };

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

  PM.mountShell(app);
  refreshPanel();
})();
