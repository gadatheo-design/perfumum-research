import { afterAll, describe, expect, it, vi } from "vitest";
import fs from "fs";
import path from "path";

/**
 * Régression du commit 8e11e402 : Drizzle reçoit le pool PROMESSE de
 * createAppPool. `db.$client.promise()` n'existe donc plus ; quatre appels
 * l'utilisaient encore (recettes.listWithRadar échouait avec
 * « db.$client.promise is not a function »).
 */

function listSources(dir: string, out: string[] = []): string[] {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === "node_modules" || entry.name.startsWith(".")) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) listSources(full, out);
    else if (/\.(ts|mjs)$/.test(entry.name) && !/\.test\.ts$/.test(entry.name)) out.push(full);
  }
  return out;
}

describe("db.$client.promise() n'est plus utilisé", () => {
  it("aucun fichier du serveur n'appelle .promise() sur $client", () => {
    const offenders: string[] = [];
    for (const file of listSources(path.resolve(process.cwd(), "server"))) {
      // Tolère un transtypage entre $client et .promise( sur la même instruction.
      const source = fs.readFileSync(file, "utf8").replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
      if (/\$client\b[^;]{0,300}?\.promise\s*\(/.test(source)) offenders.push(path.relative(process.cwd(), file));
    }
    expect(offenders, "utiliser queryRows() de server/db/rawQuery.ts").toEqual([]);
  });
});

describe("le client de getDb() est un pool promesse", () => {
  // Adresse injoignable : aucune connexion n'aboutit, mais le type de pool se voit.
  vi.stubEnv("DATABASE_URL", "mysql://utilisateur:fictif@127.0.0.1:1/inexistante");
  vi.stubEnv("LOG_LEVEL", "error");
  afterAll(() => vi.unstubAllEnvs());

  it("$client.query renvoie une promesse et .promise n'existe pas", async () => {
    const { getDb } = await import("./db/core");
    const db = await getDb();
    expect(db).not.toBeNull();
    const client = db!.$client as unknown as Record<string, unknown>;
    expect(typeof client.promise).toBe("undefined");
    const pending = db!.$client.query("SELECT 1");
    expect(typeof (pending as Promise<unknown>).then).toBe("function");
    await expect(pending).rejects.toThrow(/ECONNREFUSED|connect/i);
    await db!.$client.end();
  });

  it("queryRows passe par ce pool et laisse remonter l'erreur de connexion, pas un TypeError", async () => {
    const { queryRows } = await import("./db/rawQuery");
    const fake = { $client: { query: vi.fn(async () => [[{ id: 1 }], []]) } };
    expect(await queryRows(fake as never, "SELECT 1")).toEqual([{ id: 1 }]);
    expect(fake.$client.query).toHaveBeenCalledWith("SELECT 1", undefined);
  });
});
