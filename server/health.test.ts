import { afterEach, describe, expect, it, vi } from "vitest";
import express from "express";
import type { AddressInfo } from "net";
import { registerHealthRoute, resolveHealthInfo } from "./_core/health";

async function withApp<T>(run: (baseUrl: string) => Promise<T>): Promise<T> {
  const app = express();
  registerHealthRoute(app);
  // Tout ce qui suit simule le reste de l'application : s'il était atteint,
  // la réponse ne serait pas celle de /healthz.
  app.use((_req, res) => res.status(418).send("repli"));
  const server = app.listen(0);
  try {
    const { port } = server.address() as AddressInfo;
    return await run(`http://127.0.0.1:${port}`);
  } finally {
    await new Promise(resolve => server.close(resolve));
  }
}

describe("GET /healthz", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("répond 200 avec la version et le commit de l'image", async () => {
    vi.stubEnv("APP_VERSION", "9.9.9");
    vi.stubEnv("GIT_COMMIT", "abc1234");
    await withApp(async baseUrl => {
      const res = await fetch(`${baseUrl}/healthz`);
      expect(res.status).toBe(200);
      expect(res.headers.get("cache-control")).toBe("no-store");
      expect(await res.json()).toEqual({ status: "ok", version: "9.9.9", commit: "abc1234" });
    });
  });

  it("répond sans base de données configurée", async () => {
    vi.stubEnv("DATABASE_URL", "");
    await withApp(async baseUrl => {
      const res = await fetch(`${baseUrl}/healthz`);
      expect(res.status).toBe(200);
    });
  });

  it("retombe sur la version du package.json et un commit « inconnu »", () => {
    const info = resolveHealthInfo({});
    expect(info.version).toMatch(/^\d+\.\d+\.\d+/);
    expect(info.commit).toBe("inconnu");
  });

  it("n'importe ni la base ni le pool de connexions", async () => {
    const { readFile } = await import("fs/promises");
    const source = await readFile(new URL("./_core/health.ts", import.meta.url), "utf8");
    expect(source).not.toMatch(/from\s+["'][^"']*(db|mysql|drizzle)[^"']*["']/);
  });
});
