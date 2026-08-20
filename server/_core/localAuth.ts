/**
 * Connexion autonome (mode standalone) — Phase 2 du découplage.
 *
 * Le reste de la chaîne d'authentification est DÉJÀ indépendant de la
 * plateforme d'origine : le cookie de session est un JWT signé localement
 * avec `JWT_SECRET`, vérifié hors ligne par `sdk.verifySession()`. Seule la
 * *première connexion* passait par un portail OAuth externe. Ce module la
 * remplace, sans toucher au reste.
 *
 * Choix d'implémentation :
 *
 *  - **scrypt de `node:crypto`** plutôt que bcrypt ou argon2. Ces deux
 *    derniers sont des modules natifs à compiler ; or l'image Docker
 *    s'installe avec `--ignore-scripts` justement pour éviter d'embarquer une
 *    chaîne de compilation C++. scrypt est une KDF solide, déjà présente dans
 *    Node, et ne coûte aucune dépendance.
 *
 *  - **Le mot de passe n'est jamais stocké en base**, seulement son
 *    empreinte, et dans une variable d'environnement (`ADMIN_PASSWORD_HASH`).
 *    Aucune migration de schéma n'est donc nécessaire — ce qui compte
 *    beaucoup ici, le schéma versionné ne décrivant qu'une partie de la base
 *    réelle.
 *
 *  - **Un seul compte administrateur**, ce qui correspond à l'usage actuel
 *    (une seule personne dispose d'un accès en écriture). La structure se
 *    prête à une extension multi-comptes ultérieure sans réécriture.
 */

import { ONE_YEAR_MS } from "@shared/const";
import { COOKIE_NAME } from "@shared/const";
import crypto from "crypto";
import type { Express, NextFunction, Request, Response } from "express";
import * as db from "../db";
import { getSessionCookieOptions } from "./cookies";
import { ENV } from "./env";
import { isStandalonePlatform } from "./platform";
import { sdk } from "./sdk";

// Paramètres scrypt. N=2^16 vise ~100 ms de calcul par vérification sur un
// vCPU modeste : assez lent pour rendre une attaque par force brute hors ligne
// coûteuse, assez rapide pour une connexion interactive.
const SCRYPT_N = 65536;
const SCRYPT_r = 8;
const SCRYPT_p = 1;
const KEY_LEN = 64;
const SALT_LEN = 16;


// `maxmem` doit dépasser 128 * N * r, sinon Node refuse les paramètres.
const SCRYPT_MAXMEM = 256 * SCRYPT_N * SCRYPT_r;

const HASH_PREFIX = "scrypt";

/** Identifiant interne du compte administrateur local. */
export const LOCAL_ADMIN_OPEN_ID = "local-admin";

/**
 * `verifySession()` rejette tout jeton dont `appId` est vide. En mode
 * standalone, `VITE_APP_ID` n'est pas défini : sans cette valeur de repli, le
 * jeton émis à la connexion serait immédiatement invalide à la requête
 * suivante — panne silencieuse et déroutante.
 */
const STANDALONE_APP_ID = "perfumum-standalone";

/** Durée de session. Plus courte que le flux OAuth (un an), volontairement. */
function sessionLifetimeMs(): number {
  const days = Number(process.env.SESSION_LIFETIME_DAYS ?? "30");
  if (!Number.isFinite(days) || days <= 0) return 30 * 24 * 60 * 60 * 1000;
  return Math.min(days, 365) * 24 * 60 * 60 * 1000;
}

/**
 * Calcule l'empreinte d'un mot de passe.
 * Format : `scrypt$N$r$p$selBase64$empreinteBase64`
 */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(SALT_LEN);
  const derived = crypto.scryptSync(password.normalize("NFKC"), salt, KEY_LEN, {
    N: SCRYPT_N,
    r: SCRYPT_r,
    p: SCRYPT_p,
    maxmem: SCRYPT_MAXMEM,
  });
  return [
    HASH_PREFIX,
    SCRYPT_N,
    SCRYPT_r,
    SCRYPT_p,
    salt.toString("base64"),
    derived.toString("base64"),
  ].join("$");
}

/**
 * Vérifie un mot de passe contre une empreinte stockée.
 *
 * La comparaison est faite en temps constant : une comparaison naïve laisse
 * fuir, par sa durée, le nombre d'octets corrects en tête — de quoi
 * reconstituer l'empreinte octet par octet.
 */
export function verifyPassword(password: string, stored: string): boolean {
  try {
    const parts = stored.split("$");
    if (parts.length !== 6 || parts[0] !== HASH_PREFIX) return false;

    const N = Number(parts[1]);
    const r = Number(parts[2]);
    const p = Number(parts[3]);
    const salt = Buffer.from(parts[4], "base64");
    const expected = Buffer.from(parts[5], "base64");

    if (!Number.isInteger(N) || !Number.isInteger(r) || !Number.isInteger(p)) {
      return false;
    }

    // La longueur de clé comparée serait autrement déduite de l'empreinte
    // stockée — donc contrôlable par quiconque modifie cette valeur. Le
    // décodage base64 étant tolérant, une empreinte tronquée produit un
    // buffer plus court plutôt qu'une erreur : la vérification porterait
    // alors sur moins d'octets, et le bon mot de passe continuerait de
    // fonctionner. Personne ne remarquerait l'affaiblissement.
    //
    // Le scénario réaliste n'est pas l'attaque (modifier ADMIN_PASSWORD_HASH
    // suppose déjà l'accès au serveur) mais la troncature accidentelle au
    // copier-coller. On exige donc la longueur exacte que produit
    // hashPassword().
    if (salt.length !== SALT_LEN || expected.length !== KEY_LEN) return false;

    // Garde-fou contre un coût de calcul absurde imposé par l'empreinte.
    if (N < 16384 || N > 1048576 || r < 1 || r > 32 || p < 1 || p > 16) {
      return false;
    }

    const derived = crypto.scryptSync(
      password.normalize("NFKC"),
      salt,
      expected.length,
      { N, r, p, maxmem: 256 * N * r }
    );

    return crypto.timingSafeEqual(derived, expected);
  } catch {
    return false;
  }
}

/** La connexion locale n'est active qu'en standalone et si elle est configurée. */
export function isLocalAuthEnabled(): boolean {
  return isStandalonePlatform && Boolean(process.env.ADMIN_PASSWORD_HASH);
}

// ---------------------------------------------------------------------------
// Limitation des tentatives
// ---------------------------------------------------------------------------

type Attempts = { count: number; resetAt: number };
const attempts = new Map<string, Attempts>();

const LOGIN_WINDOW_MS = 15 * 60 * 1000;
const LOGIN_MAX_ATTEMPTS = 8;

setInterval(() => {
  const now = Date.now();
  for (const [key, a] of attempts) if (a.resetAt <= now) attempts.delete(key);
}, LOGIN_WINDOW_MS).unref();

function clientKey(req: Request): string {
  return req.ip ?? req.socket.remoteAddress ?? "unknown";
}

function tooManyAttempts(req: Request): number | null {
  const key = clientKey(req);
  const now = Date.now();
  const current = attempts.get(key);
  if (!current || current.resetAt <= now) return null;
  if (current.count >= LOGIN_MAX_ATTEMPTS) {
    return Math.ceil((current.resetAt - now) / 1000);
  }
  return null;
}

function recordFailure(req: Request): void {
  const key = clientKey(req);
  const now = Date.now();
  const current = attempts.get(key);
  if (!current || current.resetAt <= now) {
    attempts.set(key, { count: 1, resetAt: now + LOGIN_WINDOW_MS });
  } else {
    current.count += 1;
  }
}

function clearFailures(req: Request): void {
  attempts.delete(clientKey(req));
}

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------

export function registerLocalAuthRoutes(app: Express) {
  if (!isStandalonePlatform) return;

  app.get("/api/auth/config", (_req: Request, res: Response) => {
    // Permet au client de savoir s'il doit afficher un formulaire local.
    res.json({ mode: isLocalAuthEnabled() ? "local" : "disabled" });
  });

  app.post("/api/auth/login", async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!isLocalAuthEnabled()) {
        res.status(503).json({
          error:
            "La connexion locale n'est pas configurée. Renseigner ADMIN_PASSWORD_HASH.",
        });
        return;
      }

      const retryAfter = tooManyAttempts(req);
      if (retryAfter !== null) {
        res.setHeader("Retry-After", String(retryAfter));
        res.status(429).json({
          error: "Trop de tentatives. Réessayez dans quelques minutes.",
        });
        return;
      }

      const email = typeof req.body?.email === "string" ? req.body.email.trim() : "";
      const password = typeof req.body?.password === "string" ? req.body.password : "";

      if (!email || !password) {
        recordFailure(req);
        res.status(400).json({ error: "Adresse et mot de passe requis." });
        return;
      }

      const expectedEmail = (process.env.ADMIN_EMAIL ?? "").trim();
      const storedHash = process.env.ADMIN_PASSWORD_HASH ?? "";

      // On vérifie TOUJOURS le mot de passe, même si l'adresse ne correspond
      // pas : sans cela, une adresse inconnue répondrait beaucoup plus vite
      // qu'une adresse connue, ce qui permettrait d'énumérer les comptes.
      const passwordOk = verifyPassword(password, storedHash);
      const emailOk =
        expectedEmail.length > 0 &&
        email.toLowerCase() === expectedEmail.toLowerCase();

      if (!passwordOk || !emailOk) {
        recordFailure(req);
        // Message volontairement générique : il ne révèle pas lequel des deux
        // champs est erroné.
        res.status(401).json({ error: "Identifiants invalides." });
        return;
      }

      clearFailures(req);

      const displayName = process.env.ADMIN_NAME?.trim() || "Administrateur";

      // Un enregistrement utilisateur est nécessaire : le contexte tRPC résout
      // ctx.user via getUserByOpenId(). On passe par l'upsert existant, donc
      // sans aucune modification de schéma.
      await db.upsertUser({
        openId: LOCAL_ADMIN_OPEN_ID,
        name: displayName,
        email: expectedEmail || null,
        loginMethod: "local",
        role: "admin",
        lastSignedIn: new Date(),
      });

      const expiresInMs = sessionLifetimeMs();
      const token = await sdk.signSession(
        {
          openId: LOCAL_ADMIN_OPEN_ID,
          // Voir STANDALONE_APP_ID : un appId vide rendrait le jeton
          // irrecevable à la vérification.
          appId: ENV.appId || STANDALONE_APP_ID,
          name: displayName,
        },
        { expiresInMs }
      );

      res.cookie(COOKIE_NAME, token, {
        ...getSessionCookieOptions(req),
        maxAge: expiresInMs,
      });

      res.json({ success: true, name: displayName });
    } catch (error) {
      // Ne jamais laisser fuir le détail d'une erreur d'authentification.
      console.error("[LocalAuth] Échec de connexion", error);
      next(error);
    }
  });

  app.post("/api/auth/logout", (req: Request, res: Response) => {
    const options = getSessionCookieOptions(req);
    res.clearCookie(COOKIE_NAME, { ...options, maxAge: -1 });
    res.json({ success: true });
  });

  console.log(
    isLocalAuthEnabled()
      ? "[LocalAuth] Connexion locale active sur /api/auth/login"
      : "[LocalAuth] Mode standalone détecté mais ADMIN_PASSWORD_HASH absent — connexion impossible"
  );
}

// Réexporté pour les tests et l'outil de génération d'empreinte.
export const __internals = { ONE_YEAR_MS, sessionLifetimeMs, STANDALONE_APP_ID };
