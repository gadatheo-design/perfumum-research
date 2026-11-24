/**
 * Vérifie la correction décrite dans mysqlPool.ts : sur une connexion de pool,
 * `await conn.end()` doit se résoudre, et rendre la connexion au pool.
 *
 * Le premier test exécute la vraie méthode de mysql2 pour établir le fait sur
 * lequel repose la correction — plutôt que de le supposer. Si une version
 * future de mysql2 change ce comportement, ce test le signalera.
 */
import { createRequire } from "node:module";
import path from "node:path";
import { describe, expect, it, vi } from "vitest";

import { releaseOnEnd } from "./mysqlPool";

const require_ = createRequire(import.meta.url);

describe("mysql2 : end() sur une connexion de pool", () => {
  it("libère la connexion mais n'appelle jamais son callback", () => {
    // On résout le chemin depuis le paquet installé, sans dépendre de la
    // disposition de node_modules (pnpm utilise des chemins hachés).
    const base = path.dirname(require_.resolve("mysql2"));
    const PoolConnection = require_(path.join(base, "lib/base/pool_connection.js"));

    let released = false;
    let callbackCalled = false;
    // `this` minimal : la méthode ne touche que ces trois membres.
    const fake = { config: {}, emit: () => {}, release: () => { released = true; } };

    // La méthode écrit aussi un avertissement de dépréciation à chaque appel ;
    // on le tait ici pour ne pas polluer la sortie des tests.
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    try {
      PoolConnection.prototype.end.call(fake, () => { callbackCalled = true; });
    } finally {
      warn.mockRestore();
    }

    expect(released).toBe(true);
    // C'est tout le problème : l'enrobage « promise » de mysql2 construit sa
    // promesse autour de ce callback. Jamais appelé ⇒ `await` suspendu.
    expect(callbackCalled).toBe(false);
  });
});

describe("releaseOnEnd", () => {
  it("fait de end() une promesse qui se résout", async () => {
    let released = false;
    const conn = releaseOnEnd({
      end: () => new Promise(() => {}), // l'implémentation qui ne se résout jamais
      release: () => { released = true; },
    });

    // Sans la correction, ce `await` suspendrait le test jusqu'au délai maximal.
    await (conn.end as () => Promise<void>)();

    expect(released).toBe(true);
  });

  it("renvoie la connexion elle-même, pour rester chaînable", () => {
    const conn = { end: () => {}, release: () => {} };
    expect(releaseOnEnd(conn)).toBe(conn);
  });
});

// ── Connexions inactives, trop vieilles ou coupées ──────────────────────────

import { EventEmitter } from "node:events";
import {
  IDLE_TIMEOUT_MS,
  MAX_LIFETIME_MS,
  acquireUsable,
  buildPoolOptions,
  enforceMaxLifetime,
  sweepIdleConnections,
} from "./mysqlPool";

describe("buildPoolOptions", () => {
  it("ferme les connexions inactives avant 5 minutes (TiDB Cloud coupe à 340 s)", () => {
    expect(IDLE_TIMEOUT_MS).toBeLessThan(5 * 60_000);
    expect(buildPoolOptions("mysql://u:p@db.invalid:3306/x").enableKeepAlive).toBe(true);
  });

  it("désactive le ménage de mysql2 (maxIdle = connectionLimit) et ferme avec COM_QUIT", () => {
    for (const limit of [1, 2, 5, 10, 50]) {
      const options = buildPoolOptions("mysql://u:p@db.invalid:3306/x", limit);
      expect(options.connectionLimit).toBe(limit);
      expect(options.maxIdle).toBe(limit);
      expect(options.gracefulEnd).toBe(true);
    }
  });

  it("mysql2 installé : son ménage ne tourne que si maxIdle < connectionLimit, et gracefulEnd passe par end()", () => {
    // Les faits sur lesquels reposent ces réglages, vérifiés dans le paquet
    // installé : si mysql2 change, ce test le signalera.
    const base = path.dirname(require_.resolve("mysql2"));
    const read = (f: string) => require_("node:fs").readFileSync(path.join(base, f), "utf8");
    expect(read("lib/base/pool.js")).toMatch(/if \(this\.config\.maxIdle < this\.config\.connectionLimit\)/);
    expect(read("lib/base/pool.js")).toMatch(/this\._freeConnections = new Queue\(\)/);
    expect(read("lib/base/pool.js")).toMatch(/this\._freeConnections\.push\(connection\)/);
    expect(read("lib/base/pool.js")).toMatch(/connection = this\._freeConnections\.pop\(\)/);
    expect(read("lib/base/pool_connection.js")).toMatch(/if \(this\.config\.gracefulEnd\) \{\s*this\._removeFromPool\(\);\s*super\.end\(\);/);
  });

  it("limite l'âge d'une connexion bien avant 30 minutes", () => {
    expect(MAX_LIFETIME_MS).toBeLessThan(30 * 60_000);
  });
});

describe("sweepIdleConnections", () => {
  /** File imitant celle de mysql2 : end() retire la connexion. */
  function queue(idleTimes: number[], now: number) {
    const items: Array<{ lastActiveTime: number; end: ReturnType<typeof vi.fn> }> = [];
    const q = { get length() { return items.length; }, get: (i: number) => items[i] };
    for (const idle of idleTimes) {
      const conn = { lastActiveTime: now - idle, end: vi.fn(() => { items.splice(items.indexOf(conn), 1); }) };
      items.push(conn);
    }
    return { q, items };
  }

  it("ferme, avec end(), les seules connexions inactives depuis plus du délai", () => {
    const now = 1_000_000;
    // Tête de file = la moins récemment utilisée.
    const { q, items } = queue([90_000, 70_000, 30_000, 1_000], now);
    const [old1, old2, recent1, recent2] = [...items];
    expect(sweepIdleConnections(q, 60_000, () => now)).toBe(2);
    expect(old1.end).toHaveBeenCalledTimes(1);
    expect(old2.end).toHaveBeenCalledTimes(1);
    expect(recent1.end).not.toHaveBeenCalled();
    expect(recent2.end).not.toHaveBeenCalled();
    expect(q.length).toBe(2);
  });

  it("ne ferme rien après une rafale : c'était le défaut du ménage de mysql2", () => {
    const now = 1_000_000;
    const { q } = queue(Array.from({ length: 10 }, () => 500), now);
    expect(sweepIdleConnections(q, 60_000, () => now)).toBe(0);
    expect(q.length).toBe(10);
  });

  it("ne boucle pas si end() ne retire pas la connexion", () => {
    const now = 1_000_000;
    const stuck = { lastActiveTime: 0, end: vi.fn() };
    const q = { length: 1, get: () => stuck };
    expect(sweepIdleConnections(q, 60_000, () => now)).toBe(1);
    expect(stuck.end).toHaveBeenCalledTimes(1);
  });
});

describe("enforceMaxLifetime", () => {
  it("ferme (end) une connexion trop vieille quand elle est rendue au pool, pas avant", () => {
    let clock = 0;
    const pool = enforceMaxLifetime(new EventEmitter(), 1000, () => clock);
    const young = { end: vi.fn() };
    const old = { end: vi.fn() };

    pool.emit("connection", old);
    clock = 600;
    pool.emit("connection", young);
    pool.emit("release", old);
    expect(old.end).not.toHaveBeenCalled();

    clock = 1200; // old : 1200 ms, young : 600 ms
    pool.emit("release", young);
    pool.emit("release", old);
    expect(young.end).not.toHaveBeenCalled();
    expect(old.end).toHaveBeenCalledTimes(1);
  });
});

describe("acquireUsable", () => {
  const now = () => 100_000;
  function fakeConn(idleMs: number, ping: () => Promise<unknown>) {
    return { connection: { lastActiveTime: now() - idleMs }, ping: vi.fn(ping), destroy: vi.fn() };
  }
  const opts = { maxAttempts: 5, pingAfterIdleMs: 15_000, pingTimeoutMs: 50, now };

  it("rend sans la tester une connexion qui vient de servir", async () => {
    const fresh = fakeConn(1_000, async () => {});
    expect(await acquireUsable(async () => fresh, opts)).toBe(fresh);
    expect(fresh.ping).not.toHaveBeenCalled();
  });

  it("teste une connexion restée au repos et la rend si elle répond", async () => {
    const idle = fakeConn(40_000, async () => {});
    expect(await acquireUsable(async () => idle, opts)).toBe(idle);
    expect(idle.ping).toHaveBeenCalledTimes(1);
    expect(idle.destroy).not.toHaveBeenCalled();
  });

  it("détruit les connexions coupées et passe à la suivante", async () => {
    const dead1 = fakeConn(50_000, async () => { throw new Error("ECONNRESET"); });
    const dead2 = fakeConn(45_000, () => new Promise(() => {})); // ne répond jamais
    const fresh = fakeConn(0, async () => {});
    const queue = [dead1, dead2, fresh];
    const got = await acquireUsable(async () => queue.shift()!, opts);
    expect(got).toBe(fresh);
    expect(dead1.destroy).toHaveBeenCalledTimes(1);
    expect(dead2.destroy).toHaveBeenCalledTimes(1);
    expect(fresh.destroy).not.toHaveBeenCalled();
  });

  it("ne boucle pas : l'erreur de connexion remonte si la base est injoignable", async () => {
    const acquire = vi.fn(async () => { throw new Error("connect ECONNREFUSED"); });
    await expect(acquireUsable(acquire, opts)).rejects.toThrow("ECONNREFUSED");
    expect(acquire).toHaveBeenCalledTimes(1);
  });

  it("s'arrête au nombre d'essais prévu", async () => {
    const acquire = vi.fn(async () => fakeConn(60_000, async () => { throw new Error("coupée"); }));
    await acquireUsable(acquire, { ...opts, maxAttempts: 3 });
    expect(acquire).toHaveBeenCalledTimes(3);
  });
});
