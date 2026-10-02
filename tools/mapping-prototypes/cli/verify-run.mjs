#!/usr/bin/env node
/**
 * Vérifie la chaîne d'empreintes d'un run NDJSON produit par les prototypes de mapping.
 *
 * Règle (identique à shared/pm-core.js) :
 *   hash = sha256(prev_hash + "\n" + JSON canonique de la ligne sans `hash`)
 *   prev_hash de l'en-tête = 64 zéros ; seq strictement croissant à partir de 0.
 *
 * Usage : node tools/mapping-prototypes/cli/verify-run.mjs RUN-20261002-001.ndjson [...]
 * Code de sortie 0 si toutes les chaînes sont intactes, 1 sinon.
 */
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";

const ZERO_HASH = "0".repeat(64);

function canon(value) {
  if (Array.isArray(value)) return "[" + value.map((item) => (item === undefined ? "null" : canon(item))).join(",") + "]";
  if (value && typeof value === "object") {
    return "{" + Object.keys(value).filter((key) => value[key] !== undefined).sort()
      .map((key) => JSON.stringify(key) + ":" + canon(value[key])).join(",") + "}";
  }
  return JSON.stringify(value);
}

export function verifyText(text) {
  const problems = [];
  const lines = [];
  let previous = ZERO_HASH;
  text.split(/\r?\n/).forEach((raw, index) => {
    if (!raw.trim()) return;
    let line;
    try {
      line = JSON.parse(raw);
    } catch {
      problems.push(`ligne ${index + 1} : JSON illisible`);
      return;
    }
    const { hash, ...rest } = line;
    const expected = createHash("sha256").update(line.prev_hash + "\n" + canon(rest)).digest("hex");
    if (line.prev_hash !== previous) problems.push(`seq ${line.seq} : prev_hash rompu`);
    if (expected !== hash) problems.push(`seq ${line.seq} : empreinte différente (attendu ${expected.slice(0, 8)})`);
    if (line.seq !== lines.length) problems.push(`seq ${line.seq} : numéro attendu ${lines.length}`);
    previous = hash;
    lines.push(line);
  });
  return { lines, problems, valid: problems.length === 0 && lines.length > 0 };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const files = process.argv.slice(2);
  if (!files.length) {
    console.error("Usage : node verify-run.mjs fichier.ndjson [...]");
    process.exit(2);
  }
  let ok = true;
  for (const file of files) {
    const { lines, problems, valid } = verifyText(readFileSync(file, "utf8"));
    const header = lines[0] || {};
    const last = lines[lines.length - 1] || {};
    console.log(`${valid ? "✓" : "✗"} ${file} — ${header.run_id || "?"} · ${header.concept || "?"} · ${lines.length} lignes · dernière empreinte ${String(last.hash || "").slice(0, 16)} · ${last.kind === "close" ? "clos" : "NON CLOS"}`);
    problems.slice(0, 20).forEach((p) => console.log(`   - ${p}`));
    ok = ok && valid;
  }
  process.exit(ok ? 0 : 1);
}
