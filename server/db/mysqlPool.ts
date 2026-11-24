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
 *   1. inactivité — une connexion inutilisée depuis 60 s est fermée.
 *   2. âge — une connexion de plus de 20 minutes est fermée quand elle est
 *      rendue au pool, donc jamais au milieu d'une requête.
 *   3. reprise — avant de confier une connexion restée au repos plus de 15 s,
 *      `getMysqlConnection()` la teste (ping). Si elle est morte, elle est
 *      détruite et une autre est prise : l'appelant ne voit pas la coupure.
 *
 * S'y ajoute le keep-alive TCP, qui permet au système de détecter une
 * connexion coupée sans préavis.
 *
 * ── Fermer proprement, et pas en rafale ─────────────────────────────────────
 * Première version (8e11e402) : le ménage de mysql2 (`maxIdle` = 4 <
 * `connectionLimit` = 10, `idleTimeout`). Mesuré sur MySQL 8 : deux défauts.
 *   - mysql2 ferme chaque seconde toute connexion libre au-delà de `maxIdle`,
 *     même utilisée l'instant d'avant. Chaque rafale de plus de 4 requêtes
 *     ouvrait donc des connexions aussitôt refermées (20 rafales : 240).
 *   - il les ferme par `destroy()`, sans envoyer COM_QUIT : le serveur compte
 *     chaque fermeture comme une erreur de lecture (ER_NET_READ_ERROR,
 *     Aborted_clients).
 * Désormais : `maxIdle` = `connectionLimit` (le ménage de mysql2 ne tourne
 * plus), et ce module ferme lui-même les connexions inactives depuis plus de
 * 60 s ou trop vieilles, avec `end()` et `gracefulEnd`, qui envoie COM_QUIT.
 * À l'arrêt du serveur, `closeAllPools()` ferme tout de la même façon.
 */

import mysql from "mysql2/promise";
import { ENV } from "../_core/env";
import { logger } from "../_core/logger";

/** Fermeture des connexions inactives : bien avant les 340 s de TiDB Cloud. */
export const IDLE_TIMEOUT_MS = 60_000;
/** Fréquence du ménage des connexions inactives. */
export const IDLE_SWEEP_INTERVAL_MS = 5_000;
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
    // Égal à connectionLimit : le ménage de mysql2, qui refermait en rafale
    // des connexions à peine rendues, ne tourne pas. Celui de ce module
    // (sweepIdleConnections) le remplace. Voir l'en-tête du fichier.
    maxIdle: limit,
    // end() envoie COM_QUIT au lieu de couper le socket.
    gracefulEnd: true,
    enableKeepAlive: true,
    keepAliveInitialDelay: 30_000,
    connectTimeout: 10_000,
  };
}

/** Ce dont le ménage a besoin : la connexion « cœur » de mysql2. */
interface CoreConnection {
  /** Avec gracefulEnd : envoie COM_QUIT et retire la connexion du pool. */
  end(): void;
  lastActiveTime?: number;
}

interface PoolEvents {
  on(event: "connection" | "release", listener: (connection: CoreConnection) => void): unknown;
}

/** Liste des connexions libres de mysql2 (file, la plus ancienne en tête). */
export interface FreeConnections {
  length: number;
  get(index: number): CoreConnection;
}

const bornAt = new WeakMap<object, number>();

/**
 * Ferme les connexions libres inactives depuis plus de `idleMs`. mysql2 range
 * les connexions rendues en fin de file et prend la dernière : la tête de
 * file est donc toujours la moins récemment utilisée.
 */
export function sweepIdleConnections(
  free: FreeConnections,
  idleMs: number = IDLE_TIMEOUT_MS,
  now: () => number = Date.now
): number {
  let closed = 0;
  // Garde-fou : end() retire la connexion de la file ; sans cela, on s'arrête.
  for (let guard = free.length; guard > 0 && free.length > 0; guard--) {
    const oldest = free.get(0);
    const last = oldest.lastActiveTime ?? now();
    if (now() - last <= idleMs) break;
    const before = free.length;
    oldest.end();
    closed += 1;
    if (free.length >= before) break;
  }
  return closed;
}

/**
 * Ferme les connexions trop vieilles au moment où elles sont rendues au
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
      // end() (gracefulEnd) retire la connexion de la liste des connexions
      // libres et envoie COM_QUIT.
      connection.end();
    }
  });
  return pool;
}

const appPools = new Set<mysql.Pool>();

/** Crée un pool muni des protections décrites en tête de fichier. */
export function createAppPool(uri: string, connectionLimit?: number): mysql.Pool {
  const options = buildPoolOptions(uri, connectionLimit);
  logger.info("création du pool MySQL", {
    connectionLimit: options.connectionLimit,
    idleTimeoutMs: IDLE_TIMEOUT_MS,
  });
  const pool = mysql.createPool(options);
  enforceMaxLifetime(pool as unknown as PoolEvents);

  // `pool.pool` est le pool « cœur » de mysql2 ; `_freeConnections` y est
  // privé. mysqlPool.test.ts vérifie dans le paquet installé que ce champ
  // existe et garde la forme attendue.
  const core = (pool as unknown as { pool: { _freeConnections: FreeConnections; _closed: boolean } }).pool;
  const timer = setInterval(() => {
    if (core._closed) return clearInterval(timer);
    try {
      sweepIdleConnections(core._freeConnections);
    } catch (error) {
      logger.warn("ménage des connexions MySQL inactives en échec", { error });
    }
  }, IDLE_SWEEP_INTERVAL_MS);
  timer.unref();

  appPools.add(pool);
  return pool;
}

/**
 * Ferme proprement tous les pools de l'application (COM_QUIT sur chaque
 * connexion). Appelé à l'arrêt du serveur : sans cela, chaque redéploiement
 * laisse côté base autant d'erreurs de lecture que de connexions ouvertes.
 */
export async function closeAllPools(): Promise<void> {
  const pools = [...appPools];
  appPools.clear();
  await Promise.allSettled(pools.map(pool => pool.end()));
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

/**
 * Prend une connexion du pool, exécute `fn`, et la rend au pool dans tous les
 * cas, erreur comprise. À préférer au couple getMysqlConnection()/end() sans
 * `finally`, qui ne rend pas la connexion si la requête échoue.
 */
export async function withMysqlConnection<T>(fn: (conn: mysql.PoolConnection) => Promise<T>): Promise<T> {
  const conn = await getMysqlConnection();
  try {
    return await fn(conn);
  } finally {
    conn.release();
  }
}
