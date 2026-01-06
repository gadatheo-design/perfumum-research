/**
 * NEZ ingestion script (seed)
 * Reads a JSON list of URLs and extracts basic metadata -> CSV.
 *
 * Usage:
 *   node scripts/nez_ingest.mjs data/nez_seed_urls.json out/nez_articles.csv
 */
import fs from "node:fs";
import path from "node:path";
import { parse } from "node-html-parser";

function detectLang(url, root) {
  if (url.includes("/en/")) return "en";
  const htmlTag = root.querySelector("html");
  const lang = htmlTag?.getAttribute("lang");
  if (lang?.startsWith("en")) return "en";
  return "fr";
}
function extractTitle(root) {
  return root.querySelector("h1")?.text?.trim() || "";
}
function extractAuthorAndDate(root) {
  const txt = root.text;
  const fr = txt.match(/\b(\d{1,2})\s+(janvier|février|fevrier|mars|avril|mai|juin|juillet|août|aout|septembre|octobre|novembre|décembre|decembre)\s+(\d{4})\b/i);
  const en = txt.match(/\b(\d{1,2})\s+(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{4})\b/i);
  const author = (txt.match(/\bpar\s+([A-ZÉÈÊËÀÂÎÏÔÖÛÜÇ][^\n\r]{2,40})\b/i)?.[1] || txt.match(/\bBy\s+([A-Z][^\n\r]{2,40})\b/)?.[1] || "").trim();
  const dateStr = (fr?.[0] || en?.[0] || "").trim();
  return { author, dateStr };
}
function dateToISO(dateStr) {
  const fr = {janvier:"01",février:"02",fevrier:"02",mars:"03",avril:"04",mai:"05",juin:"06",juillet:"07",août:"08",aout:"08",septembre:"09",octobre:"10",novembre:"11",décembre:"12",decembre:"12"};
  const en = {January:"01",February:"02",March:"03",April:"04",May:"05",June:"06",July:"07",August:"08",September:"09",October:"10",November:"11",December:"12"};
  const m = dateStr.match(/^(\d{1,2})\s+([A-Za-zéèêëàâîïôöûüç]+)\s+(\d{4})$/i);
  if (!m) return "";
  const day = m[1].padStart(2,"0");
  const monthName = m[2];
  const year = m[3];
  const mm = fr[monthName.toLowerCase()] || en[monthName] || "";
  return mm ? `${year}-${mm}-${day}` : "";
}
function csvEscape(s) {
  s = (s ?? "").toString();
  return /[,"\n]/.test(s) ? `"${s.replace(/"/g,'""')}"` : s;
}

async function main() {
  const [,, inJson, outCsv] = process.argv;
  if (!inJson || !outCsv) {
    console.error("Usage: node scripts/nez_ingest.mjs data/nez_seed_urls.json out/nez_articles.csv");
    process.exit(1);
  }
  const urls = JSON.parse(fs.readFileSync(inJson, "utf-8"));
  const rows = [];

  for (const url of urls) {
    const res = await fetch(url, { redirect: "follow" });
    if (!res.ok) continue;
    const html = await res.text();
    const root = parse(html);
    const lang = detectLang(url, root);
    const title = extractTitle(root);
    const { author, dateStr } = extractAuthorAndDate(root);
    const published_at = dateToISO(dateStr);
    const source_id = "NEZ_" + (published_at || "unknown").replaceAll("-", "_") + "_" + title.slice(0, 24).replace(/[^A-Za-z0-9]+/g, "_").replace(/_+/g, "_").replace(/^_|_$/g, "").toUpperCase();
    rows.push({ source_id, url, title, lang, published_at, author, categories:"", themes:"" });
  }

  const header = ["source_id","url","title","lang","published_at","author","categories","themes"];
  const lines = [header.join(",")].concat(rows.map(r => header.map(k => csvEscape(r[k])).join(",")));
  fs.mkdirSync(path.dirname(outCsv), { recursive: true });
  fs.writeFileSync(outCsv, lines.join("\n"), "utf-8");
  console.log("Wrote", outCsv, rows.length, "rows");
}
main().catch((e)=>{console.error(e); process.exit(1);});
