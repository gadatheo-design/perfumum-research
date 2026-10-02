/*
 * PERFUMUM — cœur partagé des prototypes de mapping (script classique, compatible file://).
 *
 * Principes appliqués (docs/research/2026-10-rapport-interactions-v1-v2-touchdesigner.md) :
 *  - écrire avant d'afficher : une action n'est appliquée à l'image qu'après écriture de sa ligne ;
 *  - journal NDJSON add-only, chaque ligne chaînée à la précédente par sha256 ;
 *  - direct et rejeu passent par la même fonction `apply` (état = réduction des événements) ;
 *  - pointeurs visibles (run_id#seq, empreinte, sources) dans la zone projetée ;
 *  - Phase 0 : aucune commande d'émission, de chauffe ou de diffusion.
 */
(function () {
  "use strict";

  const PM = (window.PM = {});
  const ZERO_HASH = "0".repeat(64);
  const TZ = Intl.DateTimeFormat().resolvedOptions().timeZone || "inconnu";

  // ---------------------------------------------------------------------------
  // Utilitaires
  // ---------------------------------------------------------------------------

  PM.$ = (selector, root = document) => root.querySelector(selector);

  PM.el = (tag, attrs = {}, ...children) => {
    const node = document.createElement(tag);
    for (const [key, value] of Object.entries(attrs)) {
      if (key === "class") node.className = value;
      else if (key.startsWith("on")) node.addEventListener(key.slice(2), value);
      else if (value !== undefined && value !== null) node.setAttribute(key, value);
    }
    for (const child of children.flat()) node.append(child instanceof Node ? child : document.createTextNode(String(child)));
    return node;
  };

  PM.store = {
    get(key, fallback = null) {
      try {
        const raw = window.localStorage.getItem(key);
        return raw === null ? fallback : JSON.parse(raw);
      } catch {
        return fallback;
      }
    },
    set(key, value) {
      try {
        window.localStorage.setItem(key, JSON.stringify(value));
        return true;
      } catch {
        return false;
      }
    },
    remove(key) {
      try {
        window.localStorage.removeItem(key);
      } catch {
        /* stockage indisponible : rien à retirer */
      }
    },
    keys(prefix) {
      try {
        return Object.keys(window.localStorage).filter((key) => key.startsWith(prefix));
      } catch {
        return [];
      }
    },
  };

  /** JSON canonique : clés triées récursivement, valeurs `undefined` omises. */
  PM.canon = function canon(value) {
    if (Array.isArray(value)) return "[" + value.map((item) => (item === undefined ? "null" : canon(item))).join(",") + "]";
    if (value && typeof value === "object") {
      return "{" + Object.keys(value).filter((key) => value[key] !== undefined).sort()
        .map((key) => JSON.stringify(key) + ":" + canon(value[key])).join(",") + "}";
    }
    return JSON.stringify(value);
  };

  PM.sha256 = async function (input) {
    const bytes = typeof input === "string" ? new TextEncoder().encode(input) : input;
    if (!(window.crypto && window.crypto.subtle)) throw new Error("WebCrypto indisponible : ouvrez la page dans Chromium récent.");
    const digest = await window.crypto.subtle.digest("SHA-256", bytes);
    return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
  };

  PM.lineHash = (line) => {
    const { hash, ...rest } = line;
    return PM.sha256(line.prev_hash + "\n" + PM.canon(rest));
  };

  PM.short = (hash) => (hash ? String(hash).slice(0, 8) : "—");

  PM.fmtDate = (ms, withTime = true) => {
    if (!Number.isFinite(ms)) return "—";
    const iso = new Date(ms).toISOString();
    return withTime ? iso.slice(0, 16).replace("T", " ") + " UTC" : iso.slice(0, 10);
  };

  /** PRNG déterministe (mulberry32), pour des tirages rejouables à l'identique. */
  PM.prng = function (seedHex) {
    let state = parseInt(String(seedHex).slice(0, 8), 16) >>> 0;
    return function next() {
      state = (state + 0x6d2b79f5) >>> 0;
      let t = state;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  };

  // ---------------------------------------------------------------------------
  // Identifiants de run (convention N6 : RUN-AAAAMMJJ-nnn, jamais recyclé)
  // ---------------------------------------------------------------------------

  PM.newRunId = function () {
    const now = new Date();
    const day = now.toISOString().slice(0, 10).replaceAll("-", "");
    const key = `pm.runcounter.${day}`;
    const previous = PM.store.get(key, 0);
    const next = previous + 1;
    if (PM.store.set(key, next)) return { runId: `RUN-${day}-${String(next).padStart(3, "0")}`, source: "compteur_local_navigateur" };
    const fallback = String(Math.floor(Math.random() * 900) + 100);
    return { runId: `RUN-${day}-${fallback}`, source: "aleatoire_stockage_indisponible" };
  };

  // ---------------------------------------------------------------------------
  // Journal add-only
  // ---------------------------------------------------------------------------

  class Journal {
    constructor({ concept, title, sources, apply, onChange }) {
      this.concept = concept;
      this.title = title;
      this.sources = sources || [];
      this.apply = apply;
      this.onChange = onChange || (() => {});
      this.lines = [];
      this.queue = Promise.resolve();
      this.fileHandle = null;
      this.socket = null;
      this.status = "inactif";
      this.lastError = null;
      this.closed = false;
    }

    get runId() {
      return this.header ? this.header.run_id : null;
    }

    get lastLine() {
      return this.lines[this.lines.length - 1] || null;
    }

    async start({ runType = "rehearsal", operator = "", extra = {} } = {}) {
      const { runId, source } = PM.newRunId();
      const seed = (await PM.sha256(runId + "|" + Date.now() + "|" + Math.random())).slice(0, 16);
      this.header = null;
      this.lines = [];
      this.closed = false;
      const header = await this._write({
        kind: "header", run_id: runId, run_id_source: source, run_type: runType, concept: this.concept,
        title: this.title, operator: operator || null, sources: this.sources, seed,
        phase_olfactive: 0, emission: "aucune", user_agent: navigator.userAgent, ...extra,
      });
      this.header = header;
      this.status = "en cours";
      this.onChange();
      return header;
    }

    /** Écrit un événement puis, seulement si l'écriture a réussi, l'applique à l'état. */
    emit(eventType, payload = {}, options = {}) {
      const task = async () => {
        if (!this.header) throw new Error("Aucun run ouvert : démarrez un run avant d'agir.");
        if (this.closed) throw new Error("Run clos : il est en lecture seule.");
        const line = await this._write({
          kind: options.kind || "event", run_id: this.runId, concept: this.concept, event_type: eventType,
          actor_source: options.actor || "operator", flux: options.flux || "probant", payload,
        });
        this.apply(line, { live: true });
        this.onChange();
        return line;
      };
      const result = this.queue.then(task);
      this.queue = result.catch(() => {});
      return result;
    }

    annotate(refSeq, text) {
      return this.emit("annotation", { ref_seq: refSeq, text }, { kind: "annotation", flux: "marge" });
    }

    async close(summary = {}) {
      await this.emit("run_closed", summary, { kind: "close" });
      this.closed = true;
      this.status = "clos";
      PM.store.remove(`pm.backup.${this.runId}`);
      this.onChange();
    }

    async _write(fields) {
      const previous = this.lastLine;
      const line = {
        v: 1, ...fields, run_id: fields.run_id || this.runId, seq: this.lines.length,
        ts_utc: new Date().toISOString(), tz_local: TZ, prev_hash: previous ? previous.hash : ZERO_HASH,
      };
      line.hash = await PM.lineHash(line);
      const text = JSON.stringify(line) + "\n";
      if (this.fileHandle) {
        try {
          const file = await this.fileHandle.getFile();
          const writable = await this.fileHandle.createWritable({ keepExistingData: true });
          await writable.seek(file.size);
          await writable.write(text);
          await writable.close();
        } catch (error) {
          this.lastError = `Écriture disque échouée : ${error.message}. Action non appliquée.`;
          this.onChange();
          throw error;
        }
      }
      this.lines.push(line);
      if (!PM.store.set(`pm.backup.${line.run_id}`, { concept: this.concept, lines: this.lines })) {
        this.lastError = "Sauvegarde de secours locale impossible (stockage plein ou bloqué).";
      }
      if (this.socket && this.socket.readyState === 1) this.socket.send(text.trim());
      return line;
    }

    async chooseFile() {
      if (!("showSaveFilePicker" in window)) throw new Error("Écriture disque directe indisponible : utilisez Chromium sur ordinateur, ou téléchargez le NDJSON.");
      const handle = await window.showSaveFilePicker({
        suggestedName: `${this.runId || "run"}.ndjson`,
        types: [{ description: "Journal NDJSON", accept: { "application/x-ndjson": [".ndjson"] } }],
      });
      const writable = await handle.createWritable();
      await writable.write(this.lines.map((line) => JSON.stringify(line)).join("\n") + (this.lines.length ? "\n" : ""));
      await writable.close();
      this.fileHandle = handle;
      this.onChange();
    }

    download() {
      PM.downloadText(`${this.runId || "run"}.ndjson`, this.lines.map((line) => JSON.stringify(line)).join("\n") + "\n");
    }

    connectSocket(url) {
      if (this.socket) this.socket.close();
      this.socket = new WebSocket(url);
      this.socket.addEventListener("open", () => {
        this.lines.forEach((line) => this.socket.send(JSON.stringify(line)));
        this.onChange();
      });
      this.socket.addEventListener("close", () => this.onChange());
      this.socket.addEventListener("error", () => {
        this.lastError = `WebSocket ${url} injoignable (TouchDesigner ou relais non démarré ?).`;
        this.onChange();
      });
    }
  }

  PM.Journal = Journal;

  PM.downloadText = (filename, text, type = "application/x-ndjson") => {
    const anchor = document.createElement("a");
    anchor.href = URL.createObjectURL(new Blob([text], { type }));
    anchor.download = filename;
    anchor.click();
    setTimeout(() => URL.revokeObjectURL(anchor.href), 1000);
  };

  /** Lit un fichier NDJSON et vérifie la chaîne d'empreintes ligne par ligne. */
  PM.readRun = async function (file) {
    const text = await file.text();
    const lines = [];
    const problems = [];
    let previousHash = ZERO_HASH;
    for (const [index, raw] of text.split(/\r?\n/).entries()) {
      if (!raw.trim()) continue;
      let line;
      try {
        line = JSON.parse(raw);
      } catch {
        problems.push(`ligne ${index + 1} : JSON illisible`);
        continue;
      }
      if (line.prev_hash !== previousHash) problems.push(`seq ${line.seq} : prev_hash ne suit pas la ligne précédente`);
      const expected = await PM.lineHash(line);
      if (expected !== line.hash) problems.push(`seq ${line.seq} : empreinte recalculée différente`);
      if (line.seq !== lines.length) problems.push(`seq ${line.seq} : numéro attendu ${lines.length}`);
      previousHash = line.hash;
      lines.push(line);
    }
    return { lines, valid: problems.length === 0 && lines.length > 0, problems, header: lines[0] || null };
  };

  /** Rejoue des lignes à leur rythme d'origine (×speed) en appelant `apply`. */
  PM.replay = function ({ lines, apply, speed = 1, onDone, onTick }) {
    const events = lines.filter((line) => line.kind !== "header");
    let index = 0;
    let timer = null;
    let stopped = false;
    const step = () => {
      if (stopped) return;
      if (index >= events.length) {
        if (onDone) onDone();
        return;
      }
      const line = events[index];
      apply(line, { live: false });
      if (onTick) onTick(line, index, events.length);
      index += 1;
      const next = events[index];
      const delay = next ? Math.max(0, (Date.parse(next.ts_utc) - Date.parse(line.ts_utc)) / speed) : 0;
      timer = setTimeout(step, speed === Infinity ? 0 : Math.min(delay, 4000));
    };
    step();
    return { stop() { stopped = true; clearTimeout(timer); } };
  };

  // ---------------------------------------------------------------------------
  // Images : empreinte, dimensions et métadonnées EXIF (lecture seule)
  // ---------------------------------------------------------------------------

  PM.readExif = function (buffer) {
    const view = new DataView(buffer);
    if (view.byteLength < 4 || view.getUint16(0) !== 0xffd8) return null;
    let offset = 2;
    while (offset + 4 < view.byteLength) {
      const marker = view.getUint16(offset);
      const size = view.getUint16(offset + 2);
      if (marker === 0xffe1 && view.getUint32(offset + 4) === 0x45786966) return parseTiff(view, offset + 10);
      if ((marker & 0xff00) !== 0xff00 || marker === 0xffda) break;
      offset += 2 + size;
    }
    return null;
  };

  function parseTiff(view, start) {
    const little = view.getUint16(start) === 0x4949;
    const u16 = (o) => view.getUint16(start + o, little);
    const u32 = (o) => view.getUint32(start + o, little);
    const typeSize = { 1: 1, 2: 1, 3: 2, 4: 4, 5: 8, 7: 1, 9: 4, 10: 8 };
    const readValue = (entry) => {
      const type = u16(entry + 2);
      const count = u32(entry + 4);
      const bytes = (typeSize[type] || 1) * count;
      const dataOffset = bytes > 4 ? u32(entry + 8) : entry + 8;
      if (type === 2) {
        let text = "";
        for (let i = 0; i < count - 1; i += 1) text += String.fromCharCode(view.getUint8(start + dataOffset + i));
        return text.trim();
      }
      if (type === 3) return u16(dataOffset);
      if (type === 4) return u32(dataOffset);
      if (type === 5) {
        const values = [];
        for (let i = 0; i < count; i += 1) values.push(u32(dataOffset + i * 8) / (u32(dataOffset + i * 8 + 4) || 1));
        return count === 1 ? values[0] : values;
      }
      return null;
    };
    const readIfd = (ifdOffset, wanted) => {
      const out = {};
      if (!ifdOffset || start + ifdOffset + 2 > view.byteLength) return out;
      const entries = u16(ifdOffset);
      for (let i = 0; i < entries; i += 1) {
        const entry = ifdOffset + 2 + i * 12;
        if (start + entry + 12 > view.byteLength) break;
        const tag = u16(entry);
        if (wanted[tag]) {
          try {
            out[wanted[tag]] = readValue(entry);
          } catch {
            out[wanted[tag]] = null;
          }
        }
      }
      return out;
    };
    if (u16(2) !== 42) return null;
    const ifd0 = readIfd(u32(4), { 0x010f: "make", 0x0110: "model", 0x0112: "orientation", 0x0131: "software", 0x0132: "datetime", 0x8769: "exif_ifd", 0x8825: "gps_ifd" });
    const exif = readIfd(ifd0.exif_ifd, { 0x9003: "datetime_original", 0x9011: "offset_time_original", 0x9010: "offset_time" });
    const gps = readIfd(ifd0.gps_ifd, { 0x0001: "lat_ref", 0x0002: "lat", 0x0003: "lon_ref", 0x0004: "lon" });
    const toDegrees = (dms, ref) => {
      if (!Array.isArray(dms) || dms.length < 3) return null;
      const value = dms[0] + dms[1] / 60 + dms[2] / 3600;
      return ref === "S" || ref === "W" ? -value : value;
    };
    return {
      make: ifd0.make || null, model: ifd0.model || null, software: ifd0.software || null, orientation: ifd0.orientation || null,
      datetime: ifd0.datetime || null, datetime_original: exif.datetime_original || null,
      offset_time_original: exif.offset_time_original || exif.offset_time || null,
      gps_lat: toDegrees(gps.lat, gps.lat_ref), gps_lon: toDegrees(gps.lon, gps.lon_ref),
    };
  }

  /** "AAAA:MM:JJ HH:MM:SS" + décalage optionnel → intervalle UTC [min, max] en ms. */
  PM.exifInterval = function (datetime, offset) {
    const match = /^(\d{4}):(\d{2}):(\d{2}) (\d{2}):(\d{2}):(\d{2})/.exec(datetime || "");
    if (!match) return null;
    const naive = Date.UTC(+match[1], +match[2] - 1, +match[3], +match[4], +match[5], +match[6]);
    const offsetMatch = /^([+-])(\d{2}):(\d{2})$/.exec(offset || "");
    if (offsetMatch) {
      const minutes = (offsetMatch[1] === "-" ? -1 : 1) * (+offsetMatch[2] * 60 + +offsetMatch[3]);
      const utc = naive - minutes * 60000;
      return { min: utc, max: utc, timezone_known: true };
    }
    // Fuseau inconnu : l'instant réel est quelque part entre UTC−12 et UTC+14.
    return { min: naive - 14 * 3600000, max: naive + 12 * 3600000, timezone_known: false };
  };

  PM.loadImageFile = async function (file) {
    const buffer = await file.arrayBuffer();
    const sha256 = await PM.sha256(buffer);
    const exif = PM.readExif(buffer);
    const url = URL.createObjectURL(file);
    const image = await new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error(`Image illisible : ${file.name}`));
      img.src = url;
    });
    return {
      image, url,
      meta: {
        name: file.name, type: file.type || null, size_bytes: file.size, sha256,
        width: image.naturalWidth, height: image.naturalHeight,
        file_last_modified_utc: file.lastModified ? new Date(file.lastModified).toISOString() : null,
        exif,
      },
    };
  };

  /** Mire de démonstration générée : n'est ni une photo ni une œuvre. */
  PM.demoImage = function (label = "IMAGE DE DÉMONSTRATION") {
    const canvas = document.createElement("canvas");
    canvas.width = 1600;
    canvas.height = 1000;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#11161f";
    ctx.fillRect(0, 0, 1600, 1000);
    for (let x = 0; x <= 1600; x += 100) {
      ctx.strokeStyle = x % 400 === 0 ? "#5d6b82" : "#2a3446";
      ctx.lineWidth = x % 400 === 0 ? 2 : 1;
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 1000); ctx.stroke();
    }
    for (let y = 0; y <= 1000; y += 100) {
      ctx.strokeStyle = y % 500 === 0 ? "#5d6b82" : "#2a3446";
      ctx.lineWidth = y % 500 === 0 ? 2 : 1;
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(1600, y); ctx.stroke();
    }
    const gradient = ctx.createLinearGradient(0, 0, 1600, 1000);
    gradient.addColorStop(0, "rgba(120,170,140,.55)");
    gradient.addColorStop(0.5, "rgba(170,140,200,.35)");
    gradient.addColorStop(1, "rgba(210,170,110,.55)");
    ctx.fillStyle = gradient;
    ctx.beginPath(); ctx.ellipse(800, 500, 520, 330, -0.25, 0, Math.PI * 2); ctx.fill();
    [[60, 60], [1540, 60], [1540, 940], [60, 940]].forEach(([x, y], i) => {
      ctx.strokeStyle = "#f2f5fa"; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(x, y, 26, 0, Math.PI * 2); ctx.moveTo(x - 40, y); ctx.lineTo(x + 40, y); ctx.moveTo(x, y - 40); ctx.lineTo(x, y + 40); ctx.stroke();
      ctx.fillStyle = "#f2f5fa"; ctx.font = "bold 22px system-ui, sans-serif"; ctx.fillText(String(i + 1), x + 34, y - 30);
    });
    ctx.fillStyle = "#f2f5fa";
    ctx.font = "bold 46px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(label, 800, 470);
    ctx.font = "24px system-ui, sans-serif";
    ctx.fillText("Mire générée — ni photo, ni œuvre. Chargez votre image pour une séance réelle.", 800, 520);
    return canvas;
  };

  PM.demoMeta = { name: "mire-demonstration (générée)", type: "generated", size_bytes: 0, sha256: null, width: 1600, height: 1000, exif: null, generated: true };

  // ---------------------------------------------------------------------------
  // Mapping : homographie 4 coins appliquée à la scène (CSS matrix3d)
  // ---------------------------------------------------------------------------

  const adj = (m) => [
    m[4] * m[8] - m[5] * m[7], m[2] * m[7] - m[1] * m[8], m[1] * m[5] - m[2] * m[4],
    m[5] * m[6] - m[3] * m[8], m[0] * m[8] - m[2] * m[6], m[2] * m[3] - m[0] * m[5],
    m[3] * m[7] - m[4] * m[6], m[1] * m[6] - m[0] * m[7], m[0] * m[4] - m[1] * m[3],
  ];
  const mulMM = (a, b) => {
    const c = new Array(9).fill(0);
    for (let i = 0; i < 3; i += 1) for (let j = 0; j < 3; j += 1) for (let k = 0; k < 3; k += 1) c[3 * i + j] += a[3 * i + k] * b[3 * k + j];
    return c;
  };
  const mulMV = (m, v) => [m[0] * v[0] + m[1] * v[1] + m[2] * v[2], m[3] * v[0] + m[4] * v[1] + m[5] * v[2], m[6] * v[0] + m[7] * v[1] + m[8] * v[2]];
  const basis = (p) => {
    const m = [p[0][0], p[1][0], p[2][0], p[0][1], p[1][1], p[2][1], 1, 1, 1];
    const v = mulMV(adj(m), [p[3][0], p[3][1], 1]);
    return mulMM(m, [v[0], 0, 0, 0, v[1], 0, 0, 0, v[2]]);
  };
  PM.homography = (src, dst) => mulMM(basis(dst), adj(basis(src)));
  PM.project = (h, x, y) => {
    const p = mulMV(h, [x, y, 1]);
    return [p[0] / p[2], p[1] / p[2]];
  };

  class Mapper {
    constructor({ key, viewport, stage, width, height, onCalibrated }) {
      this.key = `pm.calib.${key}`;
      this.viewport = viewport;
      this.stage = stage;
      this.width = width;
      this.height = height;
      this.onCalibrated = onCalibrated || (() => {});
      this.calibrating = false;
      this.handles = [];
      stage.style.width = `${width}px`;
      stage.style.height = `${height}px`;
      this.corners = PM.store.get(this.key, null) || this.defaultCorners();
      for (let i = 0; i < 4; i += 1) {
        const handle = PM.el("div", { class: "pm-handle", "data-corner": String(i + 1) });
        handle.addEventListener("pointerdown", (event) => this.startDrag(event, i));
        viewport.append(handle);
        this.handles.push(handle);
      }
      new ResizeObserver(() => this.update()).observe(viewport);
      this.update();
    }

    defaultCorners() {
      const vw = this.viewport.clientWidth || window.innerWidth;
      const vh = this.viewport.clientHeight || window.innerHeight;
      const scale = Math.min(vw / this.width, vh / this.height) * 0.96;
      const w = (this.width * scale) / vw;
      const h = (this.height * scale) / vh;
      const x = (1 - w) / 2;
      const y = (1 - h) / 2;
      return [[x, y], [x + w, y], [x + w, y + h], [x, y + h]];
    }

    pixelCorners() {
      const vw = this.viewport.clientWidth;
      const vh = this.viewport.clientHeight;
      return this.corners.map(([x, y]) => [x * vw, y * vh]);
    }

    update() {
      const src = [[0, 0], [this.width, 0], [this.width, this.height], [0, this.height]];
      const dst = this.pixelCorners();
      this.h = PM.homography(src, dst);
      this.inverse = PM.homography(dst, src);
      const t = this.h.map((value) => value / this.h[8]);
      this.stage.style.transform = `matrix3d(${t[0]},${t[3]},0,${t[6]},${t[1]},${t[4]},0,${t[7]},0,0,1,0,${t[2]},${t[5]},0,${t[8]})`;
      dst.forEach(([x, y], i) => {
        this.handles[i].style.left = `${x}px`;
        this.handles[i].style.top = `${y}px`;
      });
    }

    /** Coordonnées écran → coordonnées de scène (inverse de l'homographie). */
    toStage(clientX, clientY) {
      const rect = this.viewport.getBoundingClientRect();
      return PM.project(this.inverse, clientX - rect.left, clientY - rect.top);
    }

    setCalibrating(flag) {
      this.calibrating = flag;
      this.viewport.classList.toggle("pm-calibrating", flag);
    }

    startDrag(event, index) {
      if (!this.calibrating) return;
      event.preventDefault();
      const rect = this.viewport.getBoundingClientRect();
      const move = (e) => {
        this.corners[index] = [
          Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width)),
          Math.min(1, Math.max(0, (e.clientY - rect.top) / rect.height)),
        ];
        this.update();
      };
      const up = () => {
        window.removeEventListener("pointermove", move);
        window.removeEventListener("pointerup", up);
        PM.store.set(this.key, this.corners);
        this.onCalibrated(this.corners);
      };
      window.addEventListener("pointermove", move);
      window.addEventListener("pointerup", up);
    }

    reset() {
      this.corners = this.defaultCorners();
      PM.store.set(this.key, this.corners);
      this.update();
      this.onCalibrated(this.corners);
    }
  }

  PM.Mapper = Mapper;

  // ---------------------------------------------------------------------------
  // Interface commune : panneau de run, raccourcis, cartel projeté
  // ---------------------------------------------------------------------------

  /**
   * Monte le panneau de contrôle commun.
   * `app` fournit : journal, mapper, concept, onReplayLines(lines, speed), resetState().
   */
  PM.mountShell = function (app) {
    const panel = PM.$("#pm-panel");
    const status = PM.el("div", { class: "pm-status" });
    const runType = PM.el("select", {},
      ...["rehearsal", "experiment", "calibration", "public_performance"].map((value) => PM.el("option", { value }, value)));
    const operator = PM.el("input", { type: "text", placeholder: "opérateur (ex. OPR-TG)", value: PM.store.get("pm.operator", "") });
    const wsUrl = PM.el("input", { type: "text", value: PM.store.get("pm.ws", "ws://127.0.0.1:9980") });
    const replaySpeed = PM.el("select", {}, ...[["1", "×1"], ["4", "×4"], ["16", "×16"], ["Infinity", "instantané"]].map(([value, label]) => PM.el("option", { value }, label)));
    const replayInput = PM.el("input", { type: "file", accept: ".ndjson,.jsonl,.txt" });

    const startButton = PM.el("button", { onclick: async () => {
      PM.store.set("pm.operator", operator.value.trim());
      app.stopReplay();
      app.resetState();
      await app.journal.start({ runType: runType.value, operator: operator.value.trim(), extra: app.headerExtra ? app.headerExtra() : {} });
      if (app.afterStart) await app.afterStart();
    } }, "Démarrer un run");
    const closeButton = PM.el("button", { class: "secondary", onclick: async () => {
      if (!app.journal.header || app.journal.closed) return;
      await app.journal.close(app.summary ? app.summary() : {});
    } }, "Clore le run");
    const fileButton = PM.el("button", { class: "secondary", onclick: async () => {
      try {
        await app.journal.chooseFile();
      } catch (error) {
        app.journal.lastError = error.message;
        app.journal.onChange();
      }
    } }, "Écrire sur disque…");
    const downloadButton = PM.el("button", { class: "secondary", onclick: () => app.journal.download() }, "Télécharger NDJSON");
    const wsButton = PM.el("button", { class: "secondary", onclick: () => {
      PM.store.set("pm.ws", wsUrl.value.trim());
      app.journal.connectSocket(wsUrl.value.trim());
    } }, "Relayer (WebSocket)");
    replayInput.addEventListener("change", async () => {
      const file = replayInput.files[0];
      if (!file) return;
      const run = await PM.readRun(file);
      app.startReplay(run, Number(replaySpeed.value));
      replayInput.value = "";
    });

    const backups = PM.el("div", { class: "pm-small" });
    const refreshBackups = () => {
      backups.replaceChildren();
      PM.store.keys("pm.backup.").forEach((key) => {
        const saved = PM.store.get(key, null);
        if (!saved || saved.concept !== app.journal.concept) return;
        const runId = key.replace("pm.backup.", "");
        if (runId === app.journal.runId) return;
        backups.append(PM.el("div", {},
          `Run non clos retrouvé : ${runId} (${saved.lines.length} lignes) `,
          PM.el("button", { class: "link", onclick: () => PM.downloadText(`${runId}.ndjson`, saved.lines.map((l) => JSON.stringify(l)).join("\n") + "\n") }, "télécharger"),
          PM.el("button", { class: "link", onclick: () => { PM.store.remove(key); refreshBackups(); } }, "oublier")));
      });
    };

    const intro = panel.querySelector(".pm-section");
    const insert = (...sections) => (intro ? intro.after(...sections) : panel.prepend(...sections));
    insert(
      PM.el("section", { class: "pm-section" },
        PM.el("h2", {}, "Run"),
        status,
        PM.el("label", {}, "Type de run ", runType),
        PM.el("label", {}, "Opérateur ", operator),
        PM.el("div", { class: "pm-row" }, startButton, closeButton),
        PM.el("div", { class: "pm-row" }, fileButton, downloadButton),
        PM.el("label", {}, "Relais TouchDesigner ", wsUrl),
        wsButton,
        backups),
      PM.el("section", { class: "pm-section" },
        PM.el("h2", {}, "Rejeu d’un run"),
        PM.el("label", {}, "Vitesse ", replaySpeed),
        PM.el("label", { class: "pm-file" }, "Charger un .ndjson ", replayInput),
        PM.el("p", { class: "pm-small" }, "Le rejeu recalcule la chaîne sha256 puis rejoue les événements avec la même fonction que le direct. Il n’écrit rien."),
        PM.el("button", { class: "secondary", onclick: () => app.stopReplay(true) }, "Arrêter le rejeu")),
      PM.el("section", { class: "pm-section" },
        PM.el("h2", {}, "Mapping"),
        PM.el("p", { class: "pm-small" }, "C : calibrer les 4 coins · R : réinitialiser · I : image visible / masquée (support physique) · H : masquer ce panneau · F : plein écran."))
    );

    const renderStatus = () => {
      const j = app.journal;
      const last = j.lastLine;
      status.replaceChildren(
        PM.el("div", { class: "pm-badge " + (app.replayState ? "replay" : j.header && !j.closed ? "live" : "idle") },
          app.replayState ? `REJEU · ${app.replayState.runId} · ${app.replayState.valid ? "chaîne vérifiée ✓" : "chaîne rompue ✗"}` : j.header ? `${j.closed ? "CLOS" : "LIVE"} · ${j.runId}` : "AUCUN RUN — démarrez un run pour agir"),
        PM.el("div", { class: "pm-small" }, last ? `dernière ligne #${last.seq} · ${PM.short(last.hash)} · ${last.event_type || last.kind}` : "aucune ligne"),
        PM.el("div", { class: "pm-small" }, j.fileHandle ? `écriture disque : ${j.fileHandle.name}` : "écriture disque : non choisie (sauvegarde locale de secours seulement)"),
        PM.el("div", { class: "pm-small" }, j.socket ? `relais : ${j.socket.readyState === 1 ? "connecté" : "déconnecté"}` : "relais : inactif"),
        j.lastError ? PM.el("div", { class: "pm-error" }, j.lastError) : "",
        app.replayState && app.replayState.problems.length ? PM.el("div", { class: "pm-error" }, app.replayState.problems.slice(0, 3).join(" · ")) : "",
      );
      refreshBackups();
    };
    app.renderStatus = renderStatus;
    renderStatus();

    window.addEventListener("keydown", (event) => {
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement || event.target instanceof HTMLSelectElement) return;
      const key = event.key.toLowerCase();
      if (key === "c") app.mapper.setCalibrating(!app.mapper.calibrating);
      else if (key === "r") app.mapper.reset();
      else if (key === "h") document.body.classList.toggle("pm-projection");
      else if (key === "i") { app.imageVisible = !app.imageVisible; app.requestRender(); }
      else if (key === "f") {
        if (document.fullscreenElement) document.exitFullscreen();
        else document.documentElement.requestFullscreen().catch(() => {});
      } else if (app.onKey) app.onKey(event);
    });
  };

  /** Petit contrôleur d'application commun (journal + mapper + rejeu). */
  PM.createApp = function ({ concept, title, sources, width = 1600, height = 1000, apply, resetState, render }) {
    const app = {
      imageVisible: true,
      replayState: null,
      replayHandle: null,
      dirty: true,
      requestRender() { app.dirty = true; },
      resetState,
      stopReplay(resetToLive = false) {
        if (app.replayHandle) app.replayHandle.stop();
        app.replayHandle = null;
        if (app.replayState) {
          app.replayState = null;
          if (resetToLive) {
            resetState();
            app.journal.lines.filter((line) => line.kind !== "header").forEach((line) => apply(line, { live: false }));
          }
        }
        app.renderStatus && app.renderStatus();
        app.requestRender();
      },
      startReplay(run, speed) {
        app.stopReplay();
        if (!run.header) {
          app.journal.lastError = "Fichier de rejeu vide ou illisible.";
          app.renderStatus();
          return;
        }
        if (run.header.concept !== concept) {
          app.journal.lastError = `Ce run appartient au prototype ${run.header.concept}, pas à ${concept}.`;
          app.renderStatus();
          return;
        }
        resetState();
        app.replayState = { runId: run.header.run_id, valid: run.valid, problems: run.problems, header: run.header, speed };
        if (app.onReplayHeader) app.onReplayHeader(run.header);
        app.replayHandle = PM.replay({
          lines: run.lines, speed,
          apply: (line) => { apply(line, { live: false }); app.requestRender(); },
          onTick: () => app.renderStatus(),
          onDone: () => app.renderStatus(),
        });
        app.renderStatus();
      },
    };
    app.journal = new Journal({ concept, title, sources, apply: (line, ctx) => { apply(line, ctx); app.requestRender(); }, onChange: () => app.renderStatus && app.renderStatus() });
    app.mapper = new Mapper({
      key: concept, viewport: PM.$("#pm-viewport"), stage: PM.$("#pm-stage"), width, height,
      onCalibrated: (corners) => {
        if (app.journal.header && !app.journal.closed && !app.replayState) {
          app.journal.emit("calibration", { corners_normalized: corners, method: "homographie 4 coins (plan unique)" }, { actor: "operator" }).catch(() => {});
        }
      },
    });
    /** Action opérateur : refusée en rejeu ou sans run, sinon écrite puis appliquée. */
    app.act = (eventType, payload = {}, options = {}) => {
      if (app.replayState) {
        app.journal.lastError = "Rejeu en cours : arrêtez le rejeu pour agir (le rejeu n’écrit rien).";
        app.renderStatus();
        return Promise.resolve(null);
      }
      return app.journal.emit(eventType, payload, options).catch((error) => {
        app.journal.lastError = error.message;
        app.renderStatus();
        return null;
      });
    };
    const loop = () => {
      if (app.dirty) {
        app.dirty = false;
        render();
      }
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
    return app;
  };

  /** Dessine le cartel de pointeurs dans la scène projetée. */
  PM.drawCartel = function (ctx, { x, y, width, app, lines }) {
    const j = app.journal;
    const replay = app.replayState;
    const last = j.lastLine;
    ctx.save();
    ctx.fillStyle = "rgba(4,7,12,.92)";
    ctx.fillRect(x, y, width, 22 + lines.length * 20);
    ctx.fillStyle = replay ? "#ffcf6e" : j.header && !j.closed ? "#7ef0a8" : "#9aa7bb";
    ctx.font = "bold 15px ui-monospace, SFMono-Regular, Menlo, monospace";
    const head = replay
      ? `REJEU ${replay.runId} · ${replay.valid ? "chaîne ✓" : "chaîne ✗"}`
      : j.header ? `${j.closed ? "CLOS" : "LIVE"} ${j.runId}#${last ? last.seq : 0} · ${PM.short(last && last.hash)}` : "AUCUN RUN";
    ctx.fillText(head + " · Phase 0 · aucune émission", x + 10, y + 18);
    ctx.fillStyle = "#c9d3e3";
    ctx.font = "13px ui-monospace, SFMono-Regular, Menlo, monospace";
    lines.forEach((text, index) => ctx.fillText(String(text), x + 10, y + 38 + index * 20));
    ctx.restore();
  };

  PM.wrapText = function (ctx, text, x, y, maxWidth, lineHeight, maxLines = 6) {
    const words = String(text).split(/\s+/);
    let line = "";
    let lineCount = 0;
    for (const word of words) {
      const candidate = line ? `${line} ${word}` : word;
      if (ctx.measureText(candidate).width > maxWidth && line) {
        ctx.fillText(line, x, y + lineCount * lineHeight);
        lineCount += 1;
        line = word;
        if (lineCount >= maxLines) return lineCount;
      } else {
        line = candidate;
      }
    }
    if (line) {
      ctx.fillText(lineCount === maxLines - 1 && ctx.measureText(line).width > maxWidth ? line.slice(0, 60) + "…" : line, x, y + lineCount * lineHeight);
      lineCount += 1;
    }
    return lineCount;
  };
})();
