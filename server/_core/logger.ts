/**
 * Journalisation structurée.
 *
 * Le projet n'avait aucun suivi d'erreurs : 263 appels `console.*` répartis
 * dans le serveur, sans niveau, sans horodatage, sans contexte. En
 * production, une panne de base ou un quota d'API externe épuisé passait
 * inaperçu.
 *
 * Choix d'implémentation : pas de dépendance externe. pino ou winston
 * feraient mieux à fort débit, mais pour ce volume une sortie JSON d'une
 * centaine de lignes suffit — et cela évite d'alourdir l'image et d'ajouter
 * une dépendance de plus à surveiller. Le format (une ligne JSON par
 * événement) est celui qu'attendent Loki, Vector, Datadog ou un simple
 * `docker logs | jq`.
 *
 * En développement, la sortie redevient lisible par un humain.
 */

import { isStandalonePlatform } from "./platform";

export type LogLevel = "debug" | "info" | "warn" | "error";

const LEVELS: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
};

function configuredLevel(): number {
  const raw = (process.env.LOG_LEVEL ?? "").trim().toLowerCase();
  if (raw in LEVELS) return LEVELS[raw as LogLevel];
  return process.env.NODE_ENV === "production" ? LEVELS.info : LEVELS.debug;
}

const MIN_LEVEL = configuredLevel();

/** JSON en production (exploitable par un collecteur), lisible en dev. */
const USE_JSON =
  (process.env.LOG_FORMAT ?? "").toLowerCase() === "json" ||
  ((process.env.LOG_FORMAT ?? "") === "" && process.env.NODE_ENV === "production");

/**
 * Clés dont la valeur ne doit jamais apparaître dans un journal.
 *
 * Le vrai risque n'est pas théorique : la route de connexion reçoit un mot de
 * passe en clair dans son corps de requête, et plusieurs routeurs manipulent
 * des clés d'API. Un journal est souvent expédié à un tiers et conservé
 * longtemps — c'est exactement le mauvais endroit pour un secret.
 */
const REDACTED_KEYS = new Set([
  "password",
  "motdepasse",
  "pass",
  "token",
  "secret",
  "authorization",
  "cookie",
  "apikey",
  "api_key",
  "accesskey",
  "access_key",
  "jwt",
  "hash",
  "adminpasswordhash",
  "admin_password_hash",
]);

const REDACTED = "[masqué]";

function redact(value: unknown, depth = 0): unknown {
  if (depth > 6) return "[trop profond]";
  if (value === null || value === undefined) return value;

  if (Array.isArray(value)) {
    return value.slice(0, 50).map(v => redact(v, depth + 1));
  }

  if (value instanceof Error) {
    return {
      name: value.name,
      message: value.message,
      stack: value.stack,
      ...(typeof (value as NodeJS.ErrnoException).code === "string"
        ? { code: (value as NodeJS.ErrnoException).code }
        : {}),
    };
  }

  if (typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      out[k] = REDACTED_KEYS.has(k.toLowerCase()) ? REDACTED : redact(v, depth + 1);
    }
    return out;
  }

  return value;
}

function emit(level: LogLevel, message: string, context?: Record<string, unknown>) {
  if (LEVELS[level] < MIN_LEVEL) return;

  const safeContext = context
    ? (redact(context) as Record<string, unknown>)
    : undefined;

  if (USE_JSON) {
    const line = {
      ts: new Date().toISOString(),
      level,
      msg: message,
      ...(safeContext ?? {}),
    };
    // JSON.stringify peut échouer sur une référence circulaire : mieux vaut
    // une ligne dégradée qu'une exception dans le chemin de journalisation.
    let serialized: string;
    try {
      serialized = JSON.stringify(line);
    } catch {
      serialized = JSON.stringify({
        ts: line.ts,
        level,
        msg: message,
        contextError: "non sérialisable",
      });
    }
    process.stdout.write(serialized + "\n");
    return;
  }

  const stamp = new Date().toISOString().slice(11, 23);
  const tag = level.toUpperCase().padEnd(5);
  const suffix = safeContext && Object.keys(safeContext).length
    ? " " + JSON.stringify(safeContext)
    : "";
  process.stdout.write(`${stamp} ${tag} ${message}${suffix}\n`);
}

export const logger = {
  debug: (msg: string, ctx?: Record<string, unknown>) => emit("debug", msg, ctx),
  info: (msg: string, ctx?: Record<string, unknown>) => emit("info", msg, ctx),
  warn: (msg: string, ctx?: Record<string, unknown>) => emit("warn", msg, ctx),
  error: (msg: string, ctx?: Record<string, unknown>) => emit("error", msg, ctx),

  /** Contexte figé, pour rattacher tous les messages d'un module. */
  child(base: Record<string, unknown>) {
    return {
      debug: (m: string, c?: Record<string, unknown>) => emit("debug", m, { ...base, ...c }),
      info: (m: string, c?: Record<string, unknown>) => emit("info", m, { ...base, ...c }),
      warn: (m: string, c?: Record<string, unknown>) => emit("warn", m, { ...base, ...c }),
      error: (m: string, c?: Record<string, unknown>) => emit("error", m, { ...base, ...c }),
    };
  },
};

/** Exposé pour les tests. */
export const __loggerInternals = { redact, REDACTED, USE_JSON, MIN_LEVEL, isStandalonePlatform };
