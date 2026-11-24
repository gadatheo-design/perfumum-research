#!/usr/bin/env node
/**
 * Remplace, dans la base, les adresses du stockage Manus par `/files/<clé>`.
 *
 * Les fichiers envoyés du temps de Manus sont enregistrés en base sous une
 * adresse absolue :
 *   https://d2xsxph8kpxj0f.cloudfront.net/<dossier 1>/<dossier 2>/<clé>
 * Hors de Manus, l'application sert ces mêmes fichiers sous `/files/<clé>`
 * (server/_core/filesRoute.ts) : avec STORAGE_PROVIDER=local, la clé est le
 * chemin du fichier sous STORAGE_LOCAL_DIR. La clé est donc le chemin de
 * l'adresse, sans le domaine et sans ses deux premiers dossiers.
 *
 *   …cloudfront.net/3105…/H2pj…/variety-images/rose.jpg
 *   →  /files/variety-images/rose.jpg   →  /app/uploads/variety-images/rose.jpg
 *
 * UTILISATION — la base visée est celle de DATABASE_URL.
 *
 *   node deploy/migrate-media-urls.mjs
 *       N'ÉCRIT RIEN. Affiche ce qui serait fait : table, colonne, nombre
 *       de lignes, et un exemple avant → après.
 *
 *   node deploy/migrate-media-urls.mjs --appliquer
 *       Effectue les remplacements (une transaction par table).
 *
 * Options :
 *   --liste              affiche aussi chaque adresse trouvée et sa clé
 *                        (adresse<TAB>clé) : la liste des fichiers à copier
 *                        dans le dossier de stockage ;
 *   --domaine=<hôte>     hôte supplémentaire à traiter (répétable).
 *
 * Le script parcourt toutes les colonnes de texte et JSON des tables de la
 * base. Le relancer est sans effet : une adresse déjà convertie ne
 * correspond plus. Faire une sauvegarde avant `--appliquer`.
 */

import { pathToFileURL } from "node:url";

export const DEFAULT_HOSTS = ["d2xsxph8kpxj0f.cloudfront.net"];

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Motif d'une adresse de stockage : hôte, deux dossiers, puis la clé. */
export function buildUrlPattern(hosts = DEFAULT_HOSTS) {
  const hostGroup = hosts.map(escapeRegExp).join("|");
  // La clé s'arrête au premier caractère qui ne peut pas faire partie de
  // l'adresse dans un texte, du HTML, du Markdown ou du JSON.
  return new RegExp(`https?://(?:${hostGroup})/[^/\\s"'<>()\\\\]+/[^/\\s"'<>()\\\\]+/([^\\s"'<>()\\\\]+)`, "gi");
}

/**
 * Réécrit toutes les adresses de stockage d'un texte.
 * Renvoie le nouveau texte et la liste des remplacements effectués.
 */
export function rewriteMediaUrls(text, hosts = DEFAULT_HOSTS) {
  const replacements = [];
  if (typeof text !== "string" || text === "") return { text, replacements };
  const rewritten = text.replace(buildUrlPattern(hosts), (url, key) => {
    const replacement = `/files/${key}`;
    replacements.push({ url, key, replacement });
    return replacement;
  });
  return { text: rewritten, replacements };
}

const TEXT_TYPES = ["char", "varchar", "tinytext", "text", "mediumtext", "longtext", "json"];

const quoteId = name => "`" + String(name).replace(/`/g, "``") + "`";

function describeTarget(databaseUrl) {
  try {
    const url = new URL(databaseUrl);
    return `${url.hostname}:${url.port || 3306}${url.pathname}`;
  } catch {
    return "(adresse illisible)";
  }
}

export function parseArgs(argv) {
  const options = { apply: false, list: false, hosts: [...DEFAULT_HOSTS], unknown: [] };
  for (const arg of argv) {
    if (arg === "--appliquer") options.apply = true;
    else if (arg === "--liste") options.list = true;
    else if (arg.startsWith("--domaine=")) {
      const host = arg.slice("--domaine=".length).trim().toLowerCase();
      if (/^[a-z0-9.-]+$/.test(host)) options.hosts.push(host);
      else options.unknown.push(arg);
    } else options.unknown.push(arg);
  }
  return options;
}

/**
 * Parcourt la base. `connection` est une connexion mysql2/promise.
 * Renvoie le bilan par colonne ; n'écrit que si `apply` est vrai.
 */
export async function migrate(connection, { apply = false, hosts = DEFAULT_HOSTS, log = () => {} } = {}) {
  const [columns] = await connection.query(
    `SELECT c.TABLE_NAME AS tableName, c.COLUMN_NAME AS columnName, c.DATA_TYPE AS dataType
       FROM information_schema.COLUMNS c
       JOIN information_schema.TABLES t
         ON t.TABLE_SCHEMA = c.TABLE_SCHEMA AND t.TABLE_NAME = c.TABLE_NAME
      WHERE c.TABLE_SCHEMA = DATABASE()
        AND t.TABLE_TYPE = 'BASE TABLE'
        AND c.DATA_TYPE IN (?)
      ORDER BY c.TABLE_NAME, c.ORDINAL_POSITION`,
    [TEXT_TYPES]
  );
  const [keyRows] = await connection.query(
    `SELECT TABLE_NAME AS tableName, COLUMN_NAME AS columnName
       FROM information_schema.KEY_COLUMN_USAGE
      WHERE TABLE_SCHEMA = DATABASE() AND CONSTRAINT_NAME = 'PRIMARY'
      ORDER BY TABLE_NAME, ORDINAL_POSITION`
  );
  const primaryKeys = new Map();
  for (const row of keyRows) {
    if (!primaryKeys.has(row.tableName)) primaryKeys.set(row.tableName, []);
    primaryKeys.get(row.tableName).push(row.columnName);
  }

  const byTable = new Map();
  for (const column of columns) {
    if (!byTable.has(column.tableName)) byTable.set(column.tableName, []);
    byTable.get(column.tableName).push(column);
  }

  const report = [];
  for (const [tableName, tableColumns] of byTable) {
    const pk = primaryKeys.get(tableName) ?? [];
    const pending = [];

    for (const { columnName, dataType } of tableColumns) {
      // Une colonne JSON est lue et réécrite comme du texte.
      const valueExpr = dataType === "json" ? `CAST(${quoteId(columnName)} AS CHAR)` : quoteId(columnName);
      const where = hosts.map(() => `${valueExpr} LIKE ?`).join(" OR ");
      const pkSelect = pk.map(quoteId).join(", ");
      const [rows] = await connection.query(
        `SELECT ${pkSelect ? pkSelect + ", " : ""}${valueExpr} AS __value FROM ${quoteId(tableName)} WHERE ${where}`,
        hosts.map(host => `%://${host}/%`)
      );
      if (rows.length === 0) continue;

      const entry = { tableName, columnName, rows: 0, urls: 0, untouched: 0, example: null, replacements: [] };
      for (const row of rows) {
        const { text, replacements } = rewriteMediaUrls(row.__value, hosts);
        if (replacements.length === 0) {
          // Adresse du bon domaine mais sans les deux dossiers attendus.
          entry.untouched += 1;
          continue;
        }
        entry.rows += 1;
        entry.urls += replacements.length;
        entry.replacements.push(...replacements);
        entry.example ??= replacements[0];
        pending.push({ columnName, dataType, row, text });
      }
      report.push(entry);
      log(entry);
    }

    if (!apply || pending.length === 0) continue;

    await connection.beginTransaction();
    try {
      for (const { columnName, row, text } of pending) {
        if (pk.length > 0) {
          await connection.query(
            `UPDATE ${quoteId(tableName)} SET ${quoteId(columnName)} = ? WHERE ${pk.map(k => `${quoteId(k)} = ?`).join(" AND ")}`,
            [text, ...pk.map(k => row[k])]
          );
        } else {
          // Table sans clé primaire : on vise la valeur exacte d'origine.
          await connection.query(
            `UPDATE ${quoteId(tableName)} SET ${quoteId(columnName)} = ? WHERE BINARY ${quoteId(columnName)} = ?`,
            [text, row.__value]
          );
        }
      }
      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw new Error(`Table ${tableName} : ${error.message} — aucune ligne de cette table n'a été modifiée.`);
    }
  }
  return report;
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  if (options.unknown.length > 0) {
    console.error(`Option inconnue : ${options.unknown.join(", ")}`);
    console.error("Options : --appliquer, --liste, --domaine=<hôte>");
    process.exit(2);
  }
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error("DATABASE_URL n'est pas défini : indiquez la base à traiter.");
    process.exit(2);
  }

  const { default: mysql } = await import("mysql2/promise");
  const connection = await mysql.createConnection(databaseUrl);

  console.log(`Base visée : ${describeTarget(databaseUrl)}`);
  console.log(`Domaines   : ${options.hosts.join(", ")}`);
  console.log(
    options.apply
      ? "Mode       : --appliquer — LES LIGNES SONT MODIFIÉES"
      : "Mode       : simulation — rien n'est écrit (ajouter --appliquer pour écrire)"
  );
  console.log("");

  try {
    const report = await migrate(connection, {
      apply: options.apply,
      hosts: options.hosts,
      log: entry => {
        const verb = options.apply ? "modifiées" : "à modifier";
        console.log(`${entry.tableName}.${entry.columnName} : ${entry.rows} ligne(s) ${verb}, ${entry.urls} adresse(s)`);
        if (entry.example) console.log(`    ${entry.example.url}\n    → ${entry.example.replacement}`);
        if (entry.untouched > 0) {
          console.log(`    ${entry.untouched} ligne(s) laissée(s) telle(s) quelle(s) : adresse sans les deux dossiers attendus`);
        }
      },
    });

    const rows = report.reduce((sum, e) => sum + e.rows, 0);
    const urls = report.reduce((sum, e) => sum + e.urls, 0);
    console.log("");
    if (rows === 0) {
      console.log("Aucune adresse du stockage Manus trouvée.");
    } else {
      console.log(
        `Total : ${rows} ligne(s), ${urls} adresse(s), ${report.filter(e => e.rows > 0).length} colonne(s) — ` +
          (options.apply ? "remplacées." : "rien n'a été écrit.")
      );
    }

    if (options.list) {
      const seen = new Map();
      for (const entry of report) for (const r of entry.replacements) seen.set(r.url, r.key);
      console.log("");
      console.log("adresse\tclé");
      for (const [url, key] of seen) console.log(`${url}\t${decodeURIComponent(key.split(/[?#]/)[0])}`);
    }
  } finally {
    await connection.end();
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch(error => {
    console.error(`Échec : ${error.message}`);
    process.exit(1);
  });
}
