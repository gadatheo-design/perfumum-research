import { beforeEach, describe, expect, it, vi } from "vitest";

// mysql2 simulé : le pool rend une connexion factice, sans base réelle.
const fakeConn = { release: vi.fn(), end: vi.fn(), query: vi.fn(), connection: { lastActiveTime: Date.now() } };
vi.mock("mysql2/promise", () => ({
  default: {
    createPool: () => ({
      getConnection: async () => fakeConn,
      on: () => {},
      pool: { _freeConnections: { length: 0, get: () => undefined }, _closed: false, config: { connectionLimit: 10 } },
      end: async () => {},
    }),
  },
}));

describe("withMysqlConnection", () => {
  beforeEach(() => {
    vi.stubEnv("DATABASE_URL", "mysql://utilisateur:fictif@db.invalid:3306/x");
    vi.stubEnv("LOG_LEVEL", "error");
    fakeConn.release.mockClear();
  });

  it("renvoie le résultat et rend la connexion au pool", async () => {
    const { withMysqlConnection } = await import("./mysqlPool");
    expect(await withMysqlConnection(async () => 42)).toBe(42);
    expect(fakeConn.release).toHaveBeenCalledTimes(1);
  });

  it("rend la connexion au pool même quand la requête échoue", async () => {
    const { withMysqlConnection } = await import("./mysqlPool");
    await expect(withMysqlConnection(async () => { throw new Error("table absente"); })).rejects.toThrow("table absente");
    expect(fakeConn.release).toHaveBeenCalledTimes(1);
  });
});
