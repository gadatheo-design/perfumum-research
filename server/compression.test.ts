import { describe, expect, it } from "vitest";
import express from "express";
import { createServer, request as httpRequest } from "http";
import type { AddressInfo } from "net";
import { gunzipSync } from "zlib";
import { ACCESS_COOKIE_NAME, createAccessGate } from "./_core/accessGate";
import { registerCompression } from "./_core/compression";
import { registerHealthRoute } from "./_core/health";

const PASSWORD = "mot-de-passe-fictif";
const BIG = { items: Array.from({ length: 400 }, (_, i) => ({ id: i, name: `Molécule synthétique ${i}` })) };

/** Requête brute, sans décompression automatique, pour lire les octets reçus. */
function rawGet(url: string, headers: Record<string, string> = {}) {
  return new Promise<{ status: number; headers: Record<string, string | string[] | undefined>; body: Buffer }>(
    (resolve, reject) => {
      const req = httpRequest(url, { headers }, res => {
        const chunks: Buffer[] = [];
        res.on("data", chunk => chunks.push(chunk));
        res.on("end", () => resolve({ status: res.statusCode ?? 0, headers: res.headers, body: Buffer.concat(chunks) }));
      });
      req.on("error", reject);
      req.end();
    }
  );
}

/** Même ordre que server/_core/index.ts : santé, compression, porte, routes. */
async function withApp<T>(gateActive: boolean, run: (baseUrl: string, cookie: string) => Promise<T>) {
  const gate = createAccessGate({ password: PASSWORD, secret: "secret-de-test", secureCookie: false });
  const app = express();
  registerHealthRoute(app);
  registerCompression(app);
  if (gateActive) app.use(gate.middleware);
  app.get("/api/trpc/liste", (_req, res) => res.json(BIG));
  app.get("/api/trpc/court", (_req, res) => res.json({ ok: true }));
  app.use((_req, res) => res.type("html").send(`<html>${"<p>page</p>".repeat(300)}</html>`));
  const server = createServer(app);
  await new Promise<void>(resolve => server.listen(0, resolve));
  try {
    const baseUrl = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
    return await run(baseUrl, `${ACCESS_COOKIE_NAME}=${gate.issueToken()}`);
  } finally {
    await new Promise(resolve => server.close(resolve));
  }
}

describe("compression des réponses", () => {
  it("compresse en gzip une grosse réponse JSON de l'API", async () => {
    await withApp(false, async baseUrl => {
      const res = await rawGet(`${baseUrl}/api/trpc/liste`, { "accept-encoding": "gzip" });
      expect(res.status).toBe(200);
      expect(res.headers["content-encoding"]).toBe("gzip");
      const plain = JSON.stringify(BIG);
      expect(res.body.length).toBeLessThan(plain.length / 3);
      expect(JSON.parse(gunzipSync(res.body).toString("utf8"))).toEqual(BIG);
    });
  });

  it("compresse aussi les pages", async () => {
    await withApp(false, async baseUrl => {
      const res = await rawGet(`${baseUrl}/plantes`, { "accept-encoding": "gzip" });
      expect(res.headers["content-encoding"]).toBe("gzip");
    });
  });

  it("ne compresse pas une réponse minuscule, ni sans Accept-Encoding", async () => {
    await withApp(false, async baseUrl => {
      expect((await rawGet(`${baseUrl}/api/trpc/court`, { "accept-encoding": "gzip" })).headers["content-encoding"]).toBeUndefined();
      const plain = await rawGet(`${baseUrl}/api/trpc/liste`);
      expect(plain.headers["content-encoding"]).toBeUndefined();
      expect(JSON.parse(plain.body.toString("utf8"))).toEqual(BIG);
    });
  });

  it("laisse /healthz répondre 200 avec son JSON", async () => {
    await withApp(true, async baseUrl => {
      const res = await rawGet(`${baseUrl}/healthz`, { "accept-encoding": "gzip" });
      expect(res.status).toBe(200);
      expect(res.headers["content-encoding"]).toBeUndefined();
      expect(JSON.parse(res.body.toString("utf8"))).toMatchObject({ status: "ok" });
      // Et par un client ordinaire, qui annonce gzip et décompresse seul.
      expect(await (await fetch(`${baseUrl}/healthz`)).json()).toMatchObject({ status: "ok" });
    });
  });

  it("laisse la porte d'accès fonctionner : redirection, 401, formulaire, connexion, robots", async () => {
    await withApp(true, async (baseUrl, cookie) => {
      const page = await fetch(`${baseUrl}/plantes`, { redirect: "manual", headers: { accept: "text/html" } });
      expect(page.status).toBe(302);
      expect(page.headers.get("location")).toBe("/acces?next=%2Fplantes");
      expect((await fetch(`${baseUrl}/api/trpc/liste`)).status).toBe(401);

      const form = await rawGet(`${baseUrl}/acces`, { "accept-encoding": "gzip" });
      expect(form.status).toBe(200);
      expect(form.headers["content-encoding"]).toBe("gzip");
      expect(gunzipSync(form.body).toString("utf8")).toContain('type="password"');

      const login = await fetch(`${baseUrl}/acces`, {
        method: "POST",
        redirect: "manual",
        headers: { "content-type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ password: PASSWORD, next: "/plantes" }),
      });
      expect(login.status).toBe(303);
      expect(login.headers.get("set-cookie")).toMatch(new RegExp(`^${ACCESS_COOKIE_NAME}=`));

      const api = await rawGet(`${baseUrl}/api/trpc/liste`, { "accept-encoding": "gzip", cookie });
      expect(api.status).toBe(200);
      expect(api.headers["content-encoding"]).toBe("gzip");
      expect(api.headers["x-robots-tag"]).toBe("noindex, nofollow");
      expect(JSON.parse(gunzipSync(api.body).toString("utf8"))).toEqual(BIG);

      expect(await (await fetch(`${baseUrl}/robots.txt`)).text()).toBe("User-agent: *\nDisallow: /\n");
    });
  });
});
