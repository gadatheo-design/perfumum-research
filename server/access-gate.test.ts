import { describe, expect, it } from "vitest";
import express from "express";
import { createServer } from "http";
import type { AddressInfo } from "net";
import { WebSocket, WebSocketServer } from "ws";
import {
  ACCESS_COOKIE_NAME,
  createAccessGate,
  isAccessGateEnabled,
  registerAccessGate,
  safeEqual,
  safeNextPath,
} from "./_core/accessGate";
import { registerHealthRoute } from "./_core/health";

const PASSWORD = "mot-de-passe-fictif";
const SECRET = "secret-de-test-0123456789";

interface Harness {
  baseUrl: string;
  wsUrl: string;
  clock: { now: number };
  token: () => string;
}

/** Monte une application minimale derrière la porte, comme server/_core/index.ts. */
async function withGate<T>(
  run: (h: Harness) => Promise<T>,
  overrides: { secureCookie?: boolean } = {}
): Promise<T> {
  const clock = { now: Date.UTC(2026, 10, 23) };
  const gate = createAccessGate({
    password: PASSWORD,
    secret: SECRET,
    secureCookie: overrides.secureCookie ?? true,
    now: () => clock.now,
  });
  const app = express();
  registerHealthRoute(app);
  app.use(gate.middleware);
  app.use(express.json());
  app.get("/api/trpc/ping", (_req, res) => res.json({ ok: true }));
  app.post("/api/trpc/ecrire", (_req, res) => res.json({ ok: true }));
  app.get("/files/image.png", (_req, res) => res.type("png").send("PNG"));
  app.get("/robots.txt", (_req, res) => res.type("text/plain").send("User-agent: *\nAllow: /\n"));
  app.use((_req, res) => res.type("html").send("<html>application</html>"));

  const server = createServer(app);
  const wss = new WebSocketServer({
    server,
    path: "/ws/collaboration",
    verifyClient: (info, done) => {
      const ok = gate.isAuthorizedCookieHeader(info.req.headers.cookie);
      done(ok, ok ? undefined : 401, ok ? undefined : "Unauthorized");
    },
  });
  wss.on("connection", ws => ws.send("bienvenue"));
  await new Promise<void>(resolve => server.listen(0, resolve));
  const { port } = server.address() as AddressInfo;
  try {
    return await run({
      baseUrl: `http://127.0.0.1:${port}`,
      wsUrl: `ws://127.0.0.1:${port}`,
      clock,
      token: gate.issueToken,
    });
  } finally {
    for (const client of wss.clients) client.terminate();
    wss.close();
    await new Promise(resolve => server.close(resolve));
  }
}

const HTML = { accept: "text/html,application/xhtml+xml" };

function submit(baseUrl: string, password: string, next = "/") {
  return fetch(`${baseUrl}/acces`, {
    method: "POST",
    redirect: "manual",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ password, next }),
  });
}

function cookieFrom(res: Response): string {
  const raw = res.headers.get("set-cookie") ?? "";
  return raw.split(";")[0];
}

function openSocket(url: string, cookie?: string): Promise<"ouvert" | number> {
  return new Promise(resolve => {
    const ws = new WebSocket(url, { headers: cookie ? { cookie } : {} });
    ws.on("open", () => {
      ws.close();
      resolve("ouvert");
    });
    ws.on("unexpected-response", (_req, res) => resolve(res.statusCode ?? 0));
    ws.on("error", () => resolve(0));
  });
}

describe("porte d'accès — sans SITE_ACCESS_PASSWORD", () => {
  it("est inactive quand la variable est absente ou vide", () => {
    expect(isAccessGateEnabled({})).toBe(false);
    expect(isAccessGateEnabled({ SITE_ACCESS_PASSWORD: "" })).toBe(false);
    expect(isAccessGateEnabled({ SITE_ACCESS_PASSWORD: "x" })).toBe(true);
  });

  it("ne monte aucun middleware : rien ne change", async () => {
    expect(process.env.SITE_ACCESS_PASSWORD ?? "").toBe("");
    const app = express();
    const before = app._router?.stack.length ?? 0;
    expect(registerAccessGate(app)).toBe(false);
    expect(app._router?.stack.length ?? 0).toBe(before);

    app.get("/api/trpc/ping", (_req, res) => res.json({ ok: true }));
    const server = app.listen(0);
    try {
      const { port } = server.address() as AddressInfo;
      const res = await fetch(`http://127.0.0.1:${port}/api/trpc/ping`);
      expect(res.status).toBe(200);
      expect(res.headers.get("x-robots-tag")).toBeNull();
    } finally {
      await new Promise(resolve => server.close(resolve));
    }
  });
});

describe("porte d'accès — configuration", () => {
  it("refuse de démarrer sans JWT_SECRET plutôt que de signer avec une clé vide", () => {
    expect(() => createAccessGate({ password: PASSWORD, secret: "", secureCookie: true })).toThrow(
      /JWT_SECRET/
    );
  });
});

describe("porte d'accès — sans laissez-passer", () => {
  it("redirige les pages vers /acces en gardant la destination", async () => {
    await withGate(async ({ baseUrl }) => {
      const res = await fetch(`${baseUrl}/plantes/12?onglet=chimie`, { redirect: "manual", headers: HTML });
      expect(res.status).toBe(302);
      expect(res.headers.get("location")).toBe(
        `/acces?next=${encodeURIComponent("/plantes/12?onglet=chimie")}`
      );
    });
  });

  it("refuse /api, /files et les écritures par un 401", async () => {
    await withGate(async ({ baseUrl }) => {
      const api = await fetch(`${baseUrl}/api/trpc/ping`);
      expect(api.status).toBe(401);
      expect(await api.json()).toMatchObject({ acces: "/acces" });
      // Même si le navigateur dit accepter du HTML : pas de redirection pour l'API.
      expect((await fetch(`${baseUrl}/api/trpc/ping`, { redirect: "manual", headers: HTML })).status).toBe(401);
      expect((await fetch(`${baseUrl}/files/image.png`, { redirect: "manual", headers: HTML })).status).toBe(401);
      expect((await fetch(`${baseUrl}/api/trpc/ecrire`, { method: "POST" })).status).toBe(401);
      expect((await fetch(`${baseUrl}/assets/index.js`)).status).toBe(401);
    });
  });

  it("refuse la poignée de main WebSocket", async () => {
    await withGate(async ({ wsUrl }) => {
      expect(await openSocket(`${wsUrl}/ws/collaboration`)).toBe(401);
      expect(await openSocket(`${wsUrl}/ws/collaboration`, `${ACCESS_COOKIE_NAME}=v1.9999999999999.faux`)).toBe(401);
    });
  });

  it("laisse /healthz ouvert", async () => {
    await withGate(async ({ baseUrl }) => {
      const res = await fetch(`${baseUrl}/healthz`);
      expect(res.status).toBe(200);
      expect(await res.json()).toMatchObject({ status: "ok" });
    });
  });

  it("sert un robots.txt qui interdit tout, et l'en-tête X-Robots-Tag partout", async () => {
    await withGate(async ({ baseUrl, token }) => {
      const robots = await fetch(`${baseUrl}/robots.txt`);
      expect(robots.status).toBe(200);
      expect(await robots.text()).toBe("User-agent: *\nDisallow: /\n");

      const cookie = `${ACCESS_COOKIE_NAME}=${token()}`;
      const responses = await Promise.all([
        fetch(`${baseUrl}/robots.txt`),
        fetch(`${baseUrl}/acces`),
        fetch(`${baseUrl}/api/trpc/ping`),
        fetch(`${baseUrl}/`, { redirect: "manual", headers: HTML }),
        fetch(`${baseUrl}/`, { headers: { ...HTML, cookie } }),
        fetch(`${baseUrl}/api/trpc/ping`, { headers: { cookie } }),
      ]);
      for (const res of responses) {
        expect(res.headers.get("x-robots-tag")).toBe("noindex, nofollow");
      }
    });
  });

  it("affiche le formulaire sur /acces", async () => {
    await withGate(async ({ baseUrl }) => {
      const res = await fetch(`${baseUrl}/acces?next=/molecules`);
      expect(res.status).toBe(200);
      const html = await res.text();
      expect(html).toContain('type="password"');
      expect(html).toContain('name="next" value="/molecules"');
      expect(html).not.toContain(PASSWORD);
    });
  });
});

describe("porte d'accès — connexion", () => {
  it("refuse un mauvais mot de passe sans poser de cookie", async () => {
    await withGate(async ({ baseUrl }) => {
      const res = await submit(baseUrl, "mauvais");
      expect(res.status).toBe(401);
      expect(res.headers.get("set-cookie")).toBeNull();
    });
  });

  it("pose un cookie HttpOnly, Secure, SameSite=Lax, valable 30 jours", async () => {
    await withGate(async ({ baseUrl }) => {
      const res = await submit(baseUrl, PASSWORD, "/molecules?page=2");
      expect(res.status).toBe(303);
      expect(res.headers.get("location")).toBe("/molecules?page=2");
      const raw = res.headers.get("set-cookie") ?? "";
      expect(raw).toMatch(new RegExp(`^${ACCESS_COOKIE_NAME}=v1\\.`));
      expect(raw).toMatch(/;\s*HttpOnly/i);
      expect(raw).toMatch(/;\s*Secure/i);
      expect(raw).toMatch(/;\s*SameSite=Lax/i);
      expect(raw).toMatch(/;\s*Path=\//i);
      expect(raw).toMatch(new RegExp(`Max-Age=${30 * 24 * 60 * 60}(;|$)`));
      expect(raw).not.toContain(PASSWORD);
    });
  });

  it("n'ajoute pas Secure hors production", async () => {
    await withGate(
      async ({ baseUrl }) => {
        const raw = (await submit(baseUrl, PASSWORD)).headers.get("set-cookie") ?? "";
        expect(raw).not.toMatch(/;\s*Secure/i);
        expect(raw).toMatch(/;\s*HttpOnly/i);
      },
      { secureCookie: false }
    );
  });

  it("ouvre ensuite les pages, /api, /files et le WebSocket", async () => {
    await withGate(async ({ baseUrl, wsUrl }) => {
      const cookie = cookieFrom(await submit(baseUrl, PASSWORD));
      const headers = { cookie };
      expect(await (await fetch(`${baseUrl}/plantes`, { headers: { ...HTML, cookie } })).text()).toContain("application");
      expect((await fetch(`${baseUrl}/api/trpc/ping`, { headers })).status).toBe(200);
      expect((await fetch(`${baseUrl}/files/image.png`, { headers })).status).toBe(200);
      expect((await fetch(`${baseUrl}/api/trpc/ecrire`, { method: "POST", headers })).status).toBe(200);
      expect(await openSocket(`${wsUrl}/ws/collaboration`, cookie)).toBe("ouvert");
      // Déjà entré : /acces renvoie vers le site au lieu de redemander.
      const again = await fetch(`${baseUrl}/acces?next=/plantes`, { redirect: "manual", headers });
      expect(again.status).toBe(303);
      expect(again.headers.get("location")).toBe("/plantes");
    });
  });

  it("n'accepte plus le cookie après 30 jours", async () => {
    await withGate(async ({ baseUrl, clock }) => {
      const cookie = cookieFrom(await submit(baseUrl, PASSWORD));
      clock.now += 30 * 24 * 60 * 60 * 1000 - 1000;
      expect((await fetch(`${baseUrl}/api/trpc/ping`, { headers: { cookie } })).status).toBe(200);
      clock.now += 2000;
      expect((await fetch(`${baseUrl}/api/trpc/ping`, { headers: { cookie } })).status).toBe(401);
    });
  });

  it("rejette un cookie falsifié, prolongé ou signé avec un autre secret ou mot de passe", async () => {
    await withGate(async ({ baseUrl, token, clock }) => {
      const good = token();
      const [version, expiry, mac] = good.split(".");
      const forged = [
        `${version}.${Number(expiry) + 1}.${mac}`,
        `${version}.${expiry}.${mac.slice(0, -2)}AA`,
        `${version}.${expiry}`,
        `v2.${expiry}.${mac}`,
        "",
        createAccessGate({ password: PASSWORD, secret: "autre-secret", secureCookie: true, now: () => clock.now }).issueToken(),
        createAccessGate({ password: "autre-mot-de-passe", secret: SECRET, secureCookie: true, now: () => clock.now }).issueToken(),
      ];
      for (const value of forged) {
        const res = await fetch(`${baseUrl}/api/trpc/ping`, { headers: { cookie: `${ACCESS_COOKIE_NAME}=${value}` } });
        expect(res.status, value).toBe(401);
      }
      const ok = await fetch(`${baseUrl}/api/trpc/ping`, { headers: { cookie: `${ACCESS_COOKIE_NAME}=${good}` } });
      expect(ok.status).toBe(200);
    });
  });

  it("limite les essais : 8 échecs, puis 429 même avec le bon mot de passe", async () => {
    await withGate(async ({ baseUrl, clock }) => {
      for (let i = 0; i < 8; i++) {
        expect((await submit(baseUrl, `essai-${i}`)).status).toBe(401);
      }
      const blocked = await submit(baseUrl, PASSWORD);
      expect(blocked.status).toBe(429);
      expect(Number(blocked.headers.get("retry-after"))).toBeGreaterThan(0);
      expect(blocked.headers.get("set-cookie")).toBeNull();

      // La fenêtre de 15 minutes écoulée, on peut réessayer.
      clock.now += 15 * 60 * 1000 + 1;
      expect((await submit(baseUrl, PASSWORD)).status).toBe(303);
    });
  });

  it("ne redirige jamais vers un autre site après connexion", async () => {
    await withGate(async ({ baseUrl }) => {
      for (const next of ["https://exemple.invalid/", "//exemple.invalid", "/\\exemple.invalid", "javascript:alert(1)"]) {
        const res = await submit(baseUrl, PASSWORD, next);
        expect(res.headers.get("location"), next).toBe("/");
      }
    });
  });
});

describe("porte d'accès — fonctions utilitaires", () => {
  it("compare à temps constant, quelle que soit la longueur", () => {
    expect(safeEqual("abc", "abc")).toBe(true);
    expect(safeEqual("abc", "abd")).toBe(false);
    expect(safeEqual("abc", "abcd")).toBe(false);
    expect(safeEqual("", "abc")).toBe(false);
  });

  it("utilise crypto.timingSafeEqual et non une comparaison directe du mot de passe", async () => {
    const { readFile } = await import("fs/promises");
    const source = await readFile(new URL("./_core/accessGate.ts", import.meta.url), "utf8");
    expect(source).toContain("crypto.timingSafeEqual");
    expect(source).not.toMatch(/[=!]==?\s*password\b|(?<![.\w])password\s*[=!]==?/);
  });

  it("ne garde que les chemins locaux", () => {
    expect(safeNextPath("/plantes/3?x=1#y")).toBe("/plantes/3?x=1#y");
    expect(safeNextPath("/acces")).toBe("/");
    expect(safeNextPath("/acces?next=/acces")).toBe("/");
    expect(safeNextPath(undefined)).toBe("/");
    expect(safeNextPath(["/a"])).toBe("/");
  });
});
