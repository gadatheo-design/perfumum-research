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
 */

import mysql from "mysql2/promise";
import { ENV } from "../_core/env";
import { logger } from "../_core/logger";

let _pool: mysql.Pool | null = null;

function getPool(): mysql.Pool {
  if (!_pool) {
    const uri = ENV.databaseUrl || process.env.DATABASE_URL;
    if (!uri) {
      throw new Error("DATABASE_URL is not configured");
    }
    logger.info("création du pool MySQL", { connectionLimit: 10 });
    _pool = mysql.createPool({
      uri,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
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

export async function getMysqlConnection(): Promise<mysql.PoolConnection> {
  return releaseOnEnd(await getPool().getConnection());
}
