/**
 * PERFUMUM — Script de diagnostic et nettoyage des champs JSON malformés
 *
 * Stratégies de correction :
 *  - "text_to_array"  : convertit "a; b, c" → ["a", "b", "c"] (préserve les données)
 *  - "reset_array"    : remplace par [] (données perdues mais ininterprétables)
 *  - "reset_null"     : remplace par NULL
 *
 * Usage :
 *   node scripts/json-cleanup.mjs              → Diagnostic (lecture seule)
 *   node scripts/json-cleanup.mjs --fix        → Correction (écriture en base)
 *   node scripts/json-cleanup.mjs --table X    → Cibler une table spécifique
 */

import mysql from "mysql2/promise";

const DRY_RUN = !process.argv.includes("--fix");
const TARGET_TABLE = process.argv.includes("--table")
  ? process.argv[process.argv.indexOf("--table") + 1]
  : null;

const db = await mysql.createConnection(process.env.DATABASE_URL);

// ─── Définition des champs JSON à auditer ─────────────────────────────────────
const JSON_FIELDS = [
  // ── Plants ──────────────────────────────────────────────────────────────────
  {
    table: "plants",
    column: "dominant_molecules",
    strategy: "text_to_array",   // Convertit "linalool; beta-caryophyllene" → ["linalool", "beta-caryophyllene"]
    description: "Molécules dominantes",
  },
  {
    table: "plants",
    column: "botanical_states",
    strategy: "reset_array",
    description: "États botaniques",
  },

  // ── Plant Varieties ──────────────────────────────────────────────────────────
  {
    table: "plant_varieties",
    column: "dominant_molecules",
    strategy: "text_to_array",
    description: "Molécules dominantes variété",
  },

  // ── Molecules ────────────────────────────────────────────────────────────────
  {
    table: "molecules",
    column: "pubchem_synonyms",
    strategy: "reset_array",
    description: "Synonymes PubChem",
  },

  // ── Prototypes ───────────────────────────────────────────────────────────────
  {
    table: "prototypes",
    column: "composition",
    strategy: "reset_null",
    description: "Composition prototype",
  },

  // ── Terroirs ─────────────────────────────────────────────────────────────────
  {
    table: "terroirs",
    column: "main_crops",
    strategy: "reset_array",
    description: "Cultures principales terroir",
  },
  {
    table: "terroirs",
    column: "certifications",
    strategy: "reset_array",
    description: "Certifications terroir",
  },

  // ── Researchers ──────────────────────────────────────────────────────────────
  {
    table: "researchers",
    column: "awards",
    strategy: "reset_array",
    description: "Récompenses chercheur",
  },
];

// ─── Fonctions utilitaires ────────────────────────────────────────────────────

function isValidJson(str) {
  if (str === null || str === undefined) return true;
  if (typeof str !== "string") return true;
  const trimmed = str.trim();
  if (trimmed === "" || trimmed === "null" || trimmed === "undefined") return false;
  try {
    JSON.parse(trimmed);
    return true;
  } catch {
    return false;
  }
}

function classifyIssue(value) {
  if (value === null || value === undefined) return null;
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (trimmed === "") return "empty_string";
  if (trimmed === "null") return "string_null";
  if (trimmed === "undefined") return "string_undefined";
  if (trimmed === "[]" || trimmed === "{}") return null;
  try {
    JSON.parse(trimmed);
    return null;
  } catch {
    if (trimmed.startsWith("{") || trimmed.startsWith("[")) return "malformed_json";
    return "text_instead_of_json";
  }
}

/**
 * Convertit une chaîne textuelle en tableau JSON.
 * "linalool (majoritaire); beta-caryophyllene; traces terpéniques"
 * → ["linalool (majoritaire)", "beta-caryophyllene", "traces terpéniques"]
 */
function textToJsonArray(str) {
  if (!str || typeof str !== "string") return "[]";
  const trimmed = str.trim();
  if (trimmed === "") return "[]";
  // Tenter d'abord un parse JSON direct
  try {
    JSON.parse(trimmed);
    return trimmed; // Déjà valide
  } catch {}
  // Découper sur ; ou , (mais pas les virgules dans les parenthèses)
  const items = trimmed
    .split(/[;]+/)
    .flatMap((part) => part.split(/,(?![^(]*\))/)) // Virgule hors parenthèses
    .map((s) => s.trim())
    .filter((s) => s.length > 0 && s !== "null" && s !== "undefined");
  return JSON.stringify(items);
}

function computeCorrection(value, strategy) {
  switch (strategy) {
    case "text_to_array":
      return textToJsonArray(value);
    case "reset_array":
      return "[]";
    case "reset_null":
      return null;
    default:
      return null;
  }
}

// ─── Rapport ──────────────────────────────────────────────────────────────────

const report = {
  scanned: 0,
  issues: [],
  fixed: 0,
  errors: [],
  tableStats: {},
};

// ─── Audit principal ──────────────────────────────────────────────────────────

console.log("\n" + "═".repeat(72));
console.log("  PERFUMUM — Diagnostic JSON" + (DRY_RUN ? " (MODE LECTURE SEULE)" : " (MODE CORRECTION)"));
console.log("═".repeat(72) + "\n");

for (const field of JSON_FIELDS) {
  if (TARGET_TABLE && field.table !== TARGET_TABLE) continue;

  // Vérifier si la table existe
  const [tableCheck] = await db.execute(
    `SELECT COUNT(*) as cnt FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = ?`,
    [field.table]
  ).catch(() => [[{ cnt: 0 }]]);
  if (!tableCheck[0].cnt) {
    console.log(`  ⚠️  Table "${field.table}" introuvable — ignorée`);
    continue;
  }

  // Vérifier si la colonne existe
  const [colCheck] = await db.execute(
    `SELECT COUNT(*) as cnt FROM information_schema.columns WHERE table_schema = DATABASE() AND table_name = ? AND column_name = ?`,
    [field.table, field.column]
  ).catch(() => [[{ cnt: 0 }]]);
  if (!colCheck[0].cnt) {
    console.log(`  ⚠️  Colonne "${field.table}.${field.column}" introuvable — ignorée`);
    continue;
  }

  // Récupérer toutes les valeurs
  const [rows] = await db.execute(
    `SELECT id, \`${field.column}\` as val FROM \`${field.table}\` WHERE \`${field.column}\` IS NOT NULL`
  ).catch((e) => {
    report.errors.push({ table: field.table, column: field.column, error: e.message });
    return [[]];
  });

  report.scanned += rows.length;
  if (!report.tableStats[field.table]) {
    report.tableStats[field.table] = { scanned: 0, issues: 0, fixed: 0 };
  }
  report.tableStats[field.table].scanned += rows.length;

  const issues = [];
  for (const row of rows) {
    const issue = classifyIssue(row.val);
    if (issue) {
      const correction = computeCorrection(row.val, field.strategy);
      issues.push({
        id: row.id,
        original: String(row.val).substring(0, 100),
        issue,
        correction: correction === null ? "NULL" : String(correction).substring(0, 100),
      });
    }
  }

  report.tableStats[field.table].issues += issues.length;

  if (issues.length === 0) {
    console.log(`  ✅  ${field.table}.${field.column} — ${rows.length} valeurs OK`);
  } else {
    const strategyLabel = {
      text_to_array: "→ conversion texte→tableau",
      reset_array: "→ remplacement par []",
      reset_null: "→ remplacement par NULL",
    }[field.strategy] || "";

    console.log(`\n  ❌  ${field.table}.${field.column} — ${issues.length}/${rows.length} problèmes [${field.strategy}]`);
    for (const issue of issues.slice(0, 3)) {
      console.log(`      ID ${issue.id} [${issue.issue}]`);
      console.log(`        Avant  : "${issue.original}"`);
      console.log(`        Après  : "${issue.correction}"`);
    }
    if (issues.length > 3) {
      console.log(`      ... et ${issues.length - 3} autres ${strategyLabel}`);
    }

    if (!DRY_RUN) {
      for (const issue of issues) {
        const correctedValue = computeCorrection(
          rows.find((r) => r.id === issue.id)?.val,
          field.strategy
        );
        try {
          await db.execute(
            `UPDATE \`${field.table}\` SET \`${field.column}\` = ? WHERE id = ?`,
            [correctedValue, issue.id]
          );
          report.fixed++;
          report.tableStats[field.table].fixed++;
        } catch (e) {
          report.errors.push({
            table: field.table,
            column: field.column,
            id: issue.id,
            error: e.message,
          });
        }
      }
      console.log(`      ✔  ${issues.length} valeurs corrigées`);
    }

    report.issues.push(
      ...issues.map((i) => ({
        table: field.table,
        column: field.column,
        description: field.description,
        strategy: field.strategy,
        ...i,
      }))
    );
  }
}

// ─── Rapport final ────────────────────────────────────────────────────────────

console.log("\n" + "═".repeat(72));
console.log("  RAPPORT FINAL");
console.log("═".repeat(72));
console.log(`\n  Valeurs analysées  : ${report.scanned}`);
console.log(`  Problèmes détectés : ${report.issues.length}`);
if (!DRY_RUN) {
  console.log(`  Corrections faites : ${report.fixed}`);
}
if (report.errors.length > 0) {
  console.log(`  Erreurs            : ${report.errors.length}`);
  for (const e of report.errors) {
    console.log(`    ✗ ${e.table}.${e.column}${e.id ? ` ID ${e.id}` : ""}: ${e.error}`);
  }
}

console.log("\n  Détail par table :");
const pad = 32;
for (const [table, stats] of Object.entries(report.tableStats)) {
  const status = stats.issues === 0 ? "✅" : DRY_RUN ? "⚠️ " : "🔧";
  const fixedStr = !DRY_RUN && stats.fixed > 0 ? ` → ${stats.fixed} corrigés` : "";
  console.log(
    `    ${status}  ${table.padEnd(pad)} ${String(stats.scanned).padStart(4)} valeurs, ${String(stats.issues).padStart(4)} problèmes${fixedStr}`
  );
}

if (DRY_RUN && report.issues.length > 0) {
  console.log(`\n  ℹ️  Pour appliquer les corrections :`);
  console.log(`      node scripts/json-cleanup.mjs --fix`);
  console.log(`\n  ℹ️  Pour cibler une table spécifique :`);
  console.log(`      node scripts/json-cleanup.mjs --fix --table plants`);
}

console.log("\n" + "═".repeat(72) + "\n");

await db.end();
