import { beforeEach, describe, expect, it, vi } from "vitest";

// mysql2 simulé : chaque prise rend un nouvel objet connexion, comme mysql2,
// dont la restitution aboutit au même espion.
const releaseSpy = vi.fn();
vi.mock("mysql2/promise", () => ({
  default: {
    createPool: () => ({
      getConnection: async () => ({ release: releaseSpy, end: vi.fn(), query: vi.fn(), connection: { lastActiveTime: Date.now() } }),
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
    releaseSpy.mockClear();
  });

  it("renvoie le résultat et rend la connexion au pool", async () => {
    const { withMysqlConnection } = await import("./mysqlPool");
    expect(await withMysqlConnection(async () => 42)).toBe(42);
    expect(releaseSpy).toHaveBeenCalledTimes(1);
  });

  it("rend la connexion au pool même quand la requête échoue", async () => {
    const { withMysqlConnection } = await import("./mysqlPool");
    await expect(withMysqlConnection(async () => { throw new Error("table absente"); })).rejects.toThrow("table absente");
    expect(releaseSpy).toHaveBeenCalledTimes(1);
  });
});
