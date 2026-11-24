import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import mysql from "mysql2";
import type { AddressInfo } from "net";

/**
 * Le pool retrouve toutes ses connexions libres après des erreurs.
 *
 * Un vrai pool mysql2 parle à un petit serveur MySQL simulé (fourni par
 * mysql2) qui répond par une erreur à toute requête, comme une table absente.
 * On appelle ensuite, bien plus de fois que le pool n'a de connexions, des
 * fonctions et procédures corrigées le 24/11/2026. Avant correction, chacune
 * gardait sa connexion à la première erreur : le pool se vidait, et les
 * requêtes suivantes attendaient sans fin.
 */

const POOL_SIZE = 10;
let server: ReturnType<typeof mysql.createServer>;
let queries = 0;

beforeAll(async () => {
  server = mysql.createServer();
  server.on("connection", (conn: any) => {
    conn.serverHandshake({
      protocolVersion: 10,
      serverVersion: "8.0.46-simule",
      connectionId: 1,
      statusFlags: 2,
      characterSet: 8,
      capabilityFlags: 0xffffff,
    });
    const fail = () => {
      queries += 1;
      conn.writeError({ code: 1146, message: "Table absente (serveur simule)" });
    };
    conn.on("query", fail);
    conn.on("stmt_prepare", fail);
    conn.on("ping", () => conn.writeOk());
    conn.on("quit", () => conn.close?.());
    conn.on("error", () => {});
  });
  await new Promise<void>(resolve => (server as any).listen(0, "127.0.0.1", resolve));
  const { port } = ((server as any)._server.address() as AddressInfo);
  vi.stubEnv("DATABASE_URL", `mysql://utilisateur:fictif@127.0.0.1:${port}/simulee`);
  vi.stubEnv("DB_POOL_SIZE", String(POOL_SIZE));
  vi.stubEnv("LOG_LEVEL", "error");
  // Les fonctions appelées journalisent leurs erreurs : attendues ici.
  vi.spyOn(console, "error").mockImplementation(() => {});
});

afterAll(async () => {
  const { closeAllPools } = await import("./db/mysqlPool");
  await closeAllPools();
  (server as any).close();
  vi.unstubAllEnvs();
});

function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error(`${label} : pas de réponse en ${ms} ms (pool épuisé ?)`)), ms)),
  ]);
}

describe("pool : connexions rendues après une erreur", () => {
  it("le serveur simulé fait bien échouer les requêtes", async () => {
    const { withMysqlConnection } = await import("./db/mysqlPool");
    await expect(withMysqlConnection(conn => conn.query("SELECT 1"))).rejects.toThrow(/Table absente/);
  });

  it("témoin : une connexion prise sans finally reste perdue après l'erreur", async () => {
    const { getMysqlConnection, mainPoolStats } = await import("./db/mysqlPool");
    const conn = await getMysqlConnection();
    await conn.query("SELECT 1").catch(() => {});
    const stats = mainPoolStats()!;
    expect(stats.free).toBe(stats.total - 1);
    conn.release(); // nettoyage du témoin
    expect(mainPoolStats()!.free).toBe(mainPoolStats()!.total);
  });

  it(`après ${POOL_SIZE * 4} appels en échec, le pool a toutes ses connexions libres`, async () => {
    const { mainPoolStats, getMysqlConnection } = await import("./db/mysqlPool");
    const importExport = await import("./db/import_export");
    const molecules = await import("./db/molecules");
    const contributions = await import("./db/plants-contributions");
    const { appRouter } = await import("./routers");
    const caller = appRouter.createCaller({ req: {} as never, res: {} as never, user: null } as never);

    const calls: Array<() => Promise<unknown>> = [
      () => importExport.searchPlantsForGcms("rose"),
      () => importExport.searchMoleculesForGcms("linalol"),
      () => molecules.getPlantPerfumes(1),
      () => contributions.getPlantContributions(1),
      () => caller.sparql.getCacheStats(),
    ];
    const before = queries;
    for (let round = 0; round < POOL_SIZE * 4; round++) {
      // Par vagues de 5 appels parallèles : chacun prend une connexion et échoue.
      await withTimeout(
        Promise.allSettled(calls.map(call => call())),
        5_000,
        `vague ${round + 1}`
      );
    }
    expect(queries - before).toBeGreaterThanOrEqual(POOL_SIZE * 4 * calls.length);

    const stats = mainPoolStats()!;
    expect(stats.total).toBeLessThanOrEqual(POOL_SIZE);
    expect(stats.free).toBe(stats.total);
    expect(stats.waiting).toBe(0);

    // Et le pool sert encore : POOL_SIZE connexions prises en même temps.
    const held = await withTimeout(
      Promise.all(Array.from({ length: POOL_SIZE }, () => getMysqlConnection())),
      2_000,
      "prise de toutes les connexions"
    );
    held.forEach(c => c.release());
    expect(mainPoolStats()!.free).toBe(mainPoolStats()!.total);
  }, 60_000);
});
