/**
 * Porte d'accès privée.
 *
 * Si `SITE_ACCESS_PASSWORD` est défini, TOUT le site exige un cookie obtenu
 * en saisissant ce mot de passe dans un petit formulaire (`/acces`) : pages,
 * `/api`, `/files` et WebSocket. Sans la variable, ce module ne monte rien et
 * le comportement de l'application est strictement inchangé.
 *
 * Ce n'est pas un système de comptes : un seul mot de passe partagé, pour
 * garder le site hors de vue pendant la période d'accès privé. La connexion
 * administrateur (./localAuth.ts) reste distincte et s'ajoute par-dessus.
 *
 * Restent ouverts, porte active :
 *   - `/healthz`    — l'hébergeur doit pouvoir vérifier la santé du service ;
 *   - `/acces`      — le formulaire lui-même ;
 *   - `/robots.txt` — qui interdit alors toute indexation.
 *
 * Le cookie ne contient aucun secret : une date d'expiration et sa signature
 * HMAC-SHA256. La clé de signature dérive de `JWT_SECRET` ET du mot de passe,
 * si bien que changer l'un ou l'autre invalide tous les cookies déjà émis.
 */

import crypto from "crypto";
import { parse as parseCookie } from "cookie";
import express from "express";
import type { Express, NextFunction, Request, RequestHandler, Response } from "express";

export const ACCESS_COOKIE_NAME = "perfumum_access";
export const ACCESS_PATH = "/acces";

const COOKIE_VERSION = "v1";
const COOKIE_LIFETIME_MS = 30 * 24 * 60 * 60 * 1000;
const ATTEMPT_WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 8;
const ROBOTS_TXT = "User-agent: *\nDisallow: /\n";
const ROBOTS_HEADER = "noindex, nofollow";

export interface AccessGateOptions {
  /** Mot de passe partagé (`SITE_ACCESS_PASSWORD`). */
  password: string;
  /** Secret de signature (`JWT_SECRET`). */
  secret: string;
  /** Pose l'attribut `Secure` sur le cookie. */
  secureCookie: boolean;
  /** Horloge injectable, pour les tests. */
  now?: () => number;
}

export interface AccessGate {
  /** Middleware Express : formulaire, robots.txt et contrôle du cookie. */
  middleware: RequestHandler;
  /** Vrai si l'en-tête `Cookie` porte un laissez-passer valide. */
  isAuthorizedCookieHeader(cookieHeader: string | undefined): boolean;
  /** Fabrique la valeur du cookie (exposé pour les tests). */
  issueToken(): string;
}

/** La porte est active dès que la variable est définie et non vide. */
export function isAccessGateEnabled(env: NodeJS.ProcessEnv = process.env): boolean {
  return Boolean(env.SITE_ACCESS_PASSWORD);
}

function sha256(value: string): Buffer {
  return crypto.createHash("sha256").update(value, "utf8").digest();
}

/**
 * Comparaison à temps constant. On compare les empreintes SHA-256 : elles ont
 * toujours la même longueur, ce que `timingSafeEqual` exige, et la durée ne
 * dépend ainsi ni du contenu ni de la longueur du mot de passe attendu.
 */
export function safeEqual(a: string, b: string): boolean {
  return crypto.timingSafeEqual(sha256(a), sha256(b));
}

/** N'accepte qu'un chemin local comme destination après connexion. */
export function safeNextPath(raw: unknown): string {
  if (typeof raw !== "string" || raw.length > 2000) return "/";
  if (!raw.startsWith("/") || raw.startsWith("//") || raw.includes("\\")) return "/";
  if (/[\u0000-\u001f]/.test(raw)) return "/";
  if (raw === ACCESS_PATH || raw.startsWith(`${ACCESS_PATH}?`)) return "/";
  return raw;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderForm(next: string, message?: string): string {
  const notice = message ? `<p class="erreur" role="alert">${escapeHtml(message)}</p>` : "";
  return `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>PERFUMUM — accès privé</title>
<style>
  body { margin: 0; min-height: 100vh; display: grid; place-items: center;
         font-family: system-ui, sans-serif; background: #14110f; color: #f1ebe2; }
  form { width: min(22rem, calc(100vw - 2rem)); display: grid; gap: 0.9rem; }
  h1 { margin: 0; font-size: 1.4rem; font-weight: 600; letter-spacing: 0.08em; }
  p { margin: 0; line-height: 1.45; color: #c9bfb1; }
  label { font-size: 0.9rem; }
  input { font: inherit; padding: 0.65rem 0.75rem; border-radius: 0.4rem;
          border: 1px solid #5c5247; background: #1f1a17; color: inherit; }
  button { font: inherit; padding: 0.65rem 0.75rem; border-radius: 0.4rem; border: 0;
           background: #c8a45c; color: #14110f; font-weight: 600; cursor: pointer; }
  input:focus-visible, button:focus-visible { outline: 2px solid #e6c98a; outline-offset: 2px; }
  .erreur { color: #f0a08c; }
</style>
</head>
<body>
<form method="post" action="${ACCESS_PATH}">
  <h1>PERFUMUM</h1>
  <p>Ce site est en accès privé. Saisissez le mot de passe qui vous a été communiqué.</p>
  ${notice}
  <label for="mot-de-passe">Mot de passe</label>
  <input id="mot-de-passe" name="password" type="password" autocomplete="current-password" required autofocus>
  <input type="hidden" name="next" value="${escapeHtml(next)}">
  <button type="submit">Entrer</button>
</form>
</body>
</html>`;
}

function clientKey(req: Request): string {
  return req.ip ?? req.socket.remoteAddress ?? "unknown";
}

export function createAccessGate(options: AccessGateOptions): AccessGate {
  const { password, secret, secureCookie } = options;
  const now = options.now ?? Date.now;

  if (!password) throw new Error("Porte d'accès : mot de passe vide.");
  if (!secret) {
    // Sans secret, n'importe qui pourrait fabriquer un cookie valide.
    throw new Error(
      "SITE_ACCESS_PASSWORD est défini mais JWT_SECRET est vide : la porte d'accès ne peut pas signer ses cookies."
    );
  }

  const signingKey = crypto
    .createHmac("sha256", secret)
    .update(`perfumum-site-access|${password}`, "utf8")
    .digest();

  function sign(payload: string): string {
    return crypto.createHmac("sha256", signingKey).update(payload, "utf8").digest("base64url");
  }

  function issueToken(): string {
    const payload = `${COOKIE_VERSION}.${now() + COOKIE_LIFETIME_MS}`;
    return `${payload}.${sign(payload)}`;
  }

  function isValidToken(token: string | undefined): boolean {
    if (!token) return false;
    const parts = token.split(".");
    if (parts.length !== 3 || parts[0] !== COOKIE_VERSION) return false;
    const payload = `${parts[0]}.${parts[1]}`;
    if (!safeEqual(parts[2], sign(payload))) return false;
    const expiresAt = Number(parts[1]);
    return Number.isSafeInteger(expiresAt) && expiresAt > now();
  }

  function isAuthorizedCookieHeader(cookieHeader: string | undefined): boolean {
    if (!cookieHeader) return false;
    try {
      return isValidToken(parseCookie(cookieHeader)[ACCESS_COOKIE_NAME]);
    } catch {
      return false;
    }
  }

  // ── Limite d'essais, par adresse IP ──────────────────────────────────────
  const attempts = new Map<string, { count: number; resetAt: number }>();

  function retryAfterSeconds(key: string): number | null {
    const current = attempts.get(key);
    if (!current) return null;
    if (current.resetAt <= now()) {
      attempts.delete(key);
      return null;
    }
    return current.count >= MAX_ATTEMPTS ? Math.ceil((current.resetAt - now()) / 1000) : null;
  }

  function recordFailure(key: string): void {
    const current = attempts.get(key);
    if (!current || current.resetAt <= now()) {
      // Borne la mémoire si un très grand nombre d'adresses défile.
      if (attempts.size > 10_000) attempts.clear();
      attempts.set(key, { count: 1, resetAt: now() + ATTEMPT_WINDOW_MS });
    } else {
      current.count += 1;
    }
  }

  const parseForm = express.urlencoded({ extended: false, limit: "2kb" });

  function handleSubmit(req: Request, res: Response): void {
    const key = clientKey(req);
    const next = safeNextPath(req.body?.next);

    const retryAfter = retryAfterSeconds(key);
    if (retryAfter !== null) {
      res.setHeader("Retry-After", String(retryAfter));
      res
        .status(429)
        .type("html")
        .send(renderForm(next, "Trop d'essais. Réessayez dans quelques minutes."));
      return;
    }

    const submitted = typeof req.body?.password === "string" ? req.body.password : "";
    if (!safeEqual(submitted, password)) {
      recordFailure(key);
      res.status(401).type("html").send(renderForm(next, "Mot de passe incorrect."));
      return;
    }

    attempts.delete(key);
    res.cookie(ACCESS_COOKIE_NAME, issueToken(), {
      httpOnly: true,
      secure: secureCookie,
      sameSite: "lax",
      path: "/",
      maxAge: COOKIE_LIFETIME_MS,
    });
    res.redirect(303, next);
  }

  function wantsPage(req: Request): boolean {
    if (req.method !== "GET" && req.method !== "HEAD") return false;
    if (/^\/(api|files|ws|assets)(\/|$)/.test(req.path)) return false;
    return Boolean(req.accepts("html")) && (req.headers.accept ?? "").includes("text/html");
  }

  const middleware: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
    // Vaut pour toutes les réponses tant que la porte est active, y compris
    // celles servies après connexion : le site ne doit pas être indexé.
    res.setHeader("X-Robots-Tag", ROBOTS_HEADER);

    if (req.path === "/healthz") return next();

    if (req.path === "/robots.txt") {
      res.type("text/plain").send(ROBOTS_TXT);
      return;
    }

    if (req.path === ACCESS_PATH) {
      res.setHeader("Cache-Control", "no-store");
      if (req.method === "GET" || req.method === "HEAD") {
        if (isAuthorizedCookieHeader(req.headers.cookie)) {
          res.redirect(303, safeNextPath(req.query.next));
          return;
        }
        res.status(200).type("html").send(renderForm(safeNextPath(req.query.next)));
        return;
      }
      if (req.method === "POST") {
        parseForm(req, res, err => {
          if (err) {
            res.status(400).type("html").send(renderForm("/", "Demande invalide."));
            return;
          }
          handleSubmit(req, res);
        });
        return;
      }
      res.setHeader("Allow", "GET, HEAD, POST");
      res.status(405).end();
      return;
    }

    if (isAuthorizedCookieHeader(req.headers.cookie)) return next();

    res.setHeader("Cache-Control", "no-store");
    if (wantsPage(req)) {
      const target = safeNextPath(req.originalUrl);
      const query = target === "/" ? "" : `?next=${encodeURIComponent(target)}`;
      res.redirect(302, `${ACCESS_PATH}${query}`);
      return;
    }
    res.status(401).json({ error: "Accès privé : mot de passe requis.", acces: ACCESS_PATH });
  };

  return { middleware, isAuthorizedCookieHeader, issueToken };
}

let _gate: AccessGate | null | undefined;

/**
 * Porte configurée par l'environnement, ou `null` si elle est inactive.
 * Construite une seule fois : le serveur HTTP et le WebSocket partagent la
 * même instance (même clé, même compteur d'essais).
 */
export function getAccessGate(): AccessGate | null {
  if (_gate === undefined) {
    _gate = isAccessGateEnabled()
      ? createAccessGate({
          password: process.env.SITE_ACCESS_PASSWORD as string,
          secret: process.env.JWT_SECRET ?? "",
          secureCookie: process.env.NODE_ENV === "production",
        })
      : null;
  }
  return _gate;
}

/** Monte la porte sur l'application. Sans `SITE_ACCESS_PASSWORD` : ne fait rien. */
export function registerAccessGate(app: Express): boolean {
  const gate = getAccessGate();
  if (!gate) return false;
  app.use(gate.middleware);
  return true;
}
