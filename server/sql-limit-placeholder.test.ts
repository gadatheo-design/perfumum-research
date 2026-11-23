import { describe, expect, it } from "vitest";
import fs from "fs";
import path from "path";
import { sqlInt } from "./db/sqlInt";

/**
 * Garde-fou : MySQL 8 refuse `LIMIT ?` / `OFFSET ?` dans une requête préparée
 * (`.execute(`) — « Incorrect arguments to mysqld_stmt_execute ». Sept
 * requêtes étaient dans ce cas. Ce test parcourt le code du serveur et échoue
 * si l'une d'elles réapparaît. Correction : `sqlInt()` (server/db/sqlInt.ts).
 *
 * `.query(` n'est pas concerné : mysql2 y insère les valeurs côté client.
 */

const ROOTS = ["server", "deploy", "drizzle", "shared"];
const EXTENSIONS = new Set([".ts", ".tsx", ".mjs", ".js"]);

function listSources(dir: string, out: string[] = []): string[] {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === "node_modules" || entry.name.startsWith(".")) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) listSources(full, out);
    else if (EXTENSIONS.has(path.extname(entry.name)) && !/\.test\.[tj]sx?$/.test(entry.name)) {
      out.push(full);
    }
  }
  return out;
}

/** Retire les commentaires, en conservant les numéros de ligne. */
function stripComments(source: string): string {
  return source
    .replace(/\/\*[\s\S]*?\*\//g, block => block.replace(/[^\n]/g, " "))
    .replace(/^[ \t]*\/\/.*$/gm, line => " ".repeat(line.length));
}

export function findPreparedLimitPlaceholders(source: string): number[] {
  const code = stripComments(source);
  const calls = [...code.matchAll(/\.(execute|query)\s*(?:<[^>()]*>)?\s*\(/g)];
  const lines: number[] = [];
  for (const hit of code.matchAll(/\b(?:LIMIT|OFFSET)\s+\?/gi)) {
    // L'appel qui contient ce fragment SQL est le dernier ouvert avant lui.
    const owner = calls.filter(call => (call.index ?? 0) < (hit.index ?? 0)).pop();
    if (owner?.[1] === "execute") {
      lines.push(code.slice(0, hit.index).split("\n").length);
    }
  }
  return lines;
}

describe("LIMIT ? / OFFSET ? dans une requête préparée", () => {
  it("le détecteur reconnaît les formes fautives et ignore les formes sûres", () => {
    expect(findPreparedLimitPlaceholders('conn.execute("SELECT 1 LIMIT ?", [n])')).toEqual([1]);
    expect(
      findPreparedLimitPlaceholders("db.execute<Row[]>(\n  `SELECT 1\n   LIMIT ? OFFSET ?`,\n  [a, b])")
    ).toEqual([3, 3]);
    expect(findPreparedLimitPlaceholders('conn.query("SELECT 1 LIMIT ? OFFSET ?", [a, b])')).toEqual([]);
    expect(findPreparedLimitPlaceholders("conn.execute(`SELECT 1 LIMIT ${n}`)")).toEqual([]);
    expect(findPreparedLimitPlaceholders("// conn.execute('… LIMIT ?')\n/* execute( LIMIT ? */")).toEqual([]);
  });

  it("n'apparaît nulle part dans le code du serveur", () => {
    const offenders: string[] = [];
    const files = ROOTS.flatMap(root => listSources(path.resolve(process.cwd(), root)));
    expect(files.length).toBeGreaterThan(100);
    for (const file of files) {
      for (const line of findPreparedLimitPlaceholders(fs.readFileSync(file, "utf8"))) {
        offenders.push(`${path.relative(process.cwd(), file)}:${line}`);
      }
    }
    expect(offenders, "utiliser sqlInt() de server/db/sqlInt.ts").toEqual([]);
  });
});

describe("sqlInt", () => {
  const bounds = { min: 1, max: 100 };

  it("renvoie un entier dans les bornes", () => {
    expect(sqlInt(8, bounds)).toBe(8);
    expect(sqlInt(8.9, bounds)).toBe(8);
    expect(sqlInt(0, bounds)).toBe(1);
    expect(sqlInt(-5, bounds)).toBe(1);
    expect(sqlInt(1e9, bounds)).toBe(100);
  });

  it("refuse tout ce qui n'est pas un nombre fini", () => {
    for (const bad of ["10", "1; DROP TABLE plants", null, undefined, NaN, Infinity, {}, [5], 5n]) {
      expect(() => sqlInt(bad, bounds), String(bad)).toThrow(TypeError);
    }
  });

  it("refuse des bornes incohérentes", () => {
    expect(() => sqlInt(1, { min: 5, max: 1 })).toThrow(RangeError);
    expect(() => sqlInt(1, { min: 0.5, max: 2 })).toThrow(RangeError);
  });
});
