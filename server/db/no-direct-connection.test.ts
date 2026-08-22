/**
 * Interdit les connexions MySQL ouvertes à la main.
 *
 * Le dépôt ouvrait une connexion TCP + authentification neuve à chaque appel,
 * via `mysql.createConnection(process.env.DATABASE_URL!)`. Le lot 5 a introduit
 * `getMysqlConnection()` — un pool partagé — mais onze appels répartis dans six
 * routeurs avaient été oubliés et continuaient à ouvrir leur propre connexion.
 *
 * Ce test empêche le motif de revenir. `server/db/mysqlPool.ts` est le seul
 * endroit autorisé à créer des connexions : c'est sa raison d'être.
 */
import fs from "fs";
import path from "path";
import { describe, expect, it } from "vitest";

/** Chemins autorisés à appeler `createConnection`, relatifs à la racine. */
const ALLOWED = ["server/db/mysqlPool.ts"];

function collect(dir: string, out: string[] = []): string[] {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "node_modules") continue;
      collect(full, out);
    } else if (/\.ts$/.test(entry.name)) {
      out.push(full);
    }
  }
  return out;
}

describe("connexions MySQL", () => {
  const root = path.resolve(import.meta.dirname, "..", "..");

  it("passent toutes par le pool partagé", () => {
    // On cherche l'appel avec DATABASE_URL : c'est celui qui court-circuite le
    // pool. Un `createConnection` vers une autre base (outil ponctuel, script
    // de migration) n'est pas visé.
    const pattern = /createConnection\(\s*process\.env\.DATABASE_URL/;

    const offenders = collect(path.join(root, "server"))
      .filter(f => !/\.test\.ts$/.test(f))
      .map(f => path.relative(root, f))
      .filter(rel => !ALLOWED.includes(rel))
      .filter(rel => pattern.test(fs.readFileSync(path.join(root, rel), "utf8")));

    expect(
      offenders,
      `Ces fichiers ouvrent une connexion hors du pool :\n${offenders.join("\n")}\n` +
      `Utiliser \`getMysqlConnection()\` depuis server/db/mysqlPool.ts.`
    ).toEqual([]);
  });
});
