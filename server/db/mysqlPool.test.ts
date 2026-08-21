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
