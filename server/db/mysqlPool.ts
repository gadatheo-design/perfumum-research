/**
 * Lot 5 (3/3) — Pool MySQL/TiDB partagé.
 *
 * Remplace le pattern dominant du dépôt (32 fichiers, 87 occurrences) où
 * chaque appel ouvrait une connexion TCP + authentification neuve via
 * `mysql.createConnection(process.env.DATABASE_URL!)`, refermée en `finally`
 * avec `conn.end()`. Sous charge, ce pattern épuise vite les connexions
 * autorisées côté TiDB Cloud et paie le coût d'authentification à chaque
 * requête.
 *
 * `getMysqlConnection()` retourne une connexion tirée d'un pool partagé et
 * paresseux (créé au premier appel, pas au chargement du module — cohérent
 * avec `server/db/core.ts` qui permet aux outils locaux de tourner sans DB).
 *
 * ── Pourquoi `end` est réaffecté ────────────────────────────────────────────
 * Les 145 appelants du dépôt écrivent `try { … } finally { await conn.end(); }`.
 * Sur une `PoolConnection`, mysql2 détourne `end()` vers `release()` — mais
 * par un chemin déprécié qui a deux défauts, vérifiés en exécutant la méthode
 * de mysql2 (voir mysqlPool.test.ts) :
 *
 *   1. il écrit un avertissement sur la sortie standard À CHAQUE appel ;
 *   2. surtout, il n'appelle JAMAIS le callback qu'on lui passe. Or
 *      l'enrobage « promise » de mysql2 construit sa promesse autour de ce
 *      callback : `await conn.end()` ne se résout donc jamais, et le
 *      gestionnaire tRPC reste suspendu indéfiniment dans son `finally`.
 *
 * mysql2 annonce par ailleurs qu'`end()` refermera réellement la connexion
 * dans une version future, ce qui viderait le pool à petit feu.
 *
 * On redirige donc `end` vers `release` à l'acquisition : les appelants
 * gardent leur `finally`, et il n'y a qu'un seul endroit à corriger.
 *
 * ── Connexions inactives, coupées ou trop vieilles ──────────────────────────
 * TiDB Cloud ferme une connexion inactive au bout de 340 s sur son point
 * d'accès public, et peut couper toute connexion de plus de 30 minutes. Un
 * pare-feu ou un proxy fait souvent pareil, parfois sans prévenir. Trois
 * protections, communes à tous les pools de l'application (`createAppPool`) :
 *
 *   1. inactivité — une connexion inutilisée depuis 60 s est fermée par le
 *      pool lui-même. Attention : mysql2 ne lance ce ménage QUE si
 *      `maxIdle < connectionLimit` ; avec les valeurs par défaut (égales),
 *      `idleTimeout` est ignoré et les connexions restent ouvertes sans fin.
 *   2. âge — une connexion de plus de 20 minutes est détruite quand elle est
 *      rendue au pool, donc jamais au milieu d'une requête.
 *   3. reprise — avant de confier une connexion restée au repos plus de 15 s,
 *      `getMysqlConnection()` la teste (ping). Si elle est morte, elle est
 *      détruite et une autre est prise : l'appelant ne voit pas la coupure.
 *
 * S'y ajoute le keep-alive TCP, qui permet au système de détecter une
 * connexion coupée sans préavis.
 */

import mysql from "mysql2/promise";
import { ENV } from "../_core/env";
import { logger } from "../_core/logger";

/** Fermeture des connexions inactives : bien avant les 340 s de TiDB Cloud. */
export const IDLE_TIMEOUT_MS = 60_000;
/** Âge maximal d'une connexion : bien avant les 30 minutes de TiDB Cloud. */
export const MAX_LIFETIME_MS = 20 * 60_000;
/** Repos au-delà duquel une connexion est testée avant d'être confiée. */
export const PING_AFTER_IDLE_MS = 15_000;
const PING_TIMEOUT_MS = 5_000;
const DEFAULT_CONNECTION_LIMIT = 10;

function resolveConnectionLimit(requested?: number): number {
  const fromEnv = Number(process.env.DB_POOL_SIZE);
  const value = requested ?? (Number.isInteger(fromEnv) && fromEnv > 0 ? fromEnv : DEFAULT_CONNECTION_LIMIT);
  return Math.min(Math.max(1, Math.trunc(value)), 100);
}

/** Options communes à tous les pools de l'application. */
export function buildPoolOptions(uri: string, connectionLimit?: number): mysql.PoolOptions {
  const limit = resolveConnectionLimit(connectionLimit);
  return {
    uri,
    waitForConnections: true,
    connectionLimit: limit,
    queueLimit: 0,
    // Strictement inférieur à connectionLimit, sans quoi mysql2 ne ferme
    // jamais les connexions inactives (voir l'en-tête du fichier).
    maxIdle: Math.min(4, limit - 1),
    idleTimeout: IDLE_TIMEOUT_MS,
    enableKeepAlive: true,
    keepAliveInitialDelay: 30_000,
    connectTimeout: 10_000,
  };
}

/** Ce dont le suivi d'âge a besoin : la connexion « cœur » de mysql2. */
interface CoreConnection {
  destroy(): void;
  lastActiveTime?: number;
}

interface PoolEvents {
  on(event: "connection" | "release", listener: (connection: CoreConnection) => void): unknown;
}

const bornAt = new WeakMap<object, number>();

/**
 * Détruit les connexions trop vieilles au moment où elles sont rendues au
 * pool. Extrait pour être testable sans base de données.
 */
export function enforceMaxLifetime<T extends PoolEvents>(
  pool: T,
  maxLifetimeMs: number = MAX_LIFETIME_MS,
  now: () => number = Date.now
): T {
  pool.on("connection", connection => {
    bornAt.set(connection, now());
  });
  pool.on("release", connection => {
    const born = bornAt.get(connection);
    if (born !== undefined && now() - born > maxLifetimeMs) {
      // destroy() retire aussi la connexion de la liste des connexions libres.
      connection.destroy();
    }
  });
  return pool;
}

/** Crée un pool muni des protections décrites en tête de fichier. */
export function createAppPool(uri: string, connectionLimit?: number): mysql.Pool {
  const options = buildPoolOptions(uri, connectionLimit);
  logger.info("création du pool MySQL", {
    connectionLimit: options.connectionLimit,
    maxIdle: options.maxIdle,
    idleTimeoutMs: options.idleTimeout,
  });
  const pool = mysql.createPool(options);
  enforceMaxLifetime(pool as unknown as PoolEvents);
  return pool;
}

export function requireDatabaseUrl(): string {
  const uri = ENV.databaseUrl || process.env.DATABASE_URL;
  if (!uri) {
    throw new Error("DATABASE_URL is not configured");
  }
  return uri;
}

let _pool: mysql.Pool | null = null;

function getPool(): mysql.Pool {
  if (!_pool) {
    _pool = createAppPool(requireDatabaseUrl());
  }
  return _pool;
}

/**
 * Remplace `end()` par un appel à `release()` qui se résout bien.
 *
 * Extrait pour être testable sans base de données : on ne peut pas obtenir de
 * vraie `PoolConnection` hors connexion réelle.
 */
export function releaseOnEnd<T extends { end: unknown; release: () => void }>(conn: T): T {
  conn.end = async () => {
    conn.release();
  };
  return conn;
}

/** Ce dont la reprise a besoin sur une connexion tirée du pool. */
export interface AcquiredConnection {
  ping(): Promise<unknown>;
  destroy(): void;
  connection?: { lastActiveTime?: number };
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`pas de réponse en ${ms} ms`)), ms);
    promise.then(
      value => {
        clearTimeout(timer);
        resolve(value);
      },
      error => {
        clearTimeout(timer);
        reject(error);
      }
    );
  });
}

/**
 * Tire une connexion du pool et s'assure qu'elle répond.
 *
 * Une connexion qui vient d'être utilisée (ou d'être ouverte) est rendue
 * telle quelle. Une connexion restée au repos est d'abord testée ; morte,
 * elle est détruite et on en demande une autre. Le pool finit par en ouvrir
 * une neuve, qui n'est pas testée : si la base elle-même est injoignable,
 * c'est l'erreur de connexion qui remonte, sans boucle.
 */
export async function acquireUsable<C extends AcquiredConnection>(
  acquire: () => Promise<C>,
  options: { maxAttempts: number; pingAfterIdleMs?: number; pingTimeoutMs?: number; now?: () => number }
): Promise<C> {
  const now = options.now ?? Date.now;
  const pingAfterIdleMs = options.pingAfterIdleMs ?? PING_AFTER_IDLE_MS;
  for (let attempt = 1; ; attempt++) {
    const conn = await acquire();
    const lastActive = conn.connection?.lastActiveTime;
    const idleMs = lastActive === undefined ? 0 : now() - lastActive;
    if (idleMs <= pingAfterIdleMs || attempt >= options.maxAttempts) return conn;
    try {
      await withTimeout(conn.ping(), options.pingTimeoutMs ?? PING_TIMEOUT_MS);
      return conn;
    } catch (error) {
      logger.warn("connexion MySQL coupée, remplacée", { idleMs, attempt, error });
      conn.destroy();
    }
  }
}

export async function getMysqlConnection(): Promise<mysql.PoolConnection> {
  const pool = getPool();
  const conn = await acquireUsable(
    () => pool.getConnection() as Promise<mysql.PoolConnection & AcquiredConnection>,
    // Au pire, toutes les connexions libres sont mortes : une de plus suffit.
    { maxAttempts: (pool.pool.config.connectionLimit ?? DEFAULT_CONNECTION_LIMIT) + 1 }
  );
  return releaseOnEnd(conn);
}
