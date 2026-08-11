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
 * Une `PoolConnection` mysql2 expose exactement la même API qu'une
 * `Connection` classique (`.execute()`, `.query()`, `.end()`), donc les
 * appelants existants qui font `const conn = await getDb(); ...; await
 * conn.end();` n'ont besoin de changer que la ligne d'acquisition — `.end()`
 * sur une connexion de pool referme proprement cette connexion précise sans
 * affecter le reste du pool (mysql2 la recrée à la demande).
 */

import mysql from "mysql2/promise";
import { ENV } from "../_core/env";

let _pool: mysql.Pool | null = null;

function getPool(): mysql.Pool {
  if (!_pool) {
    const uri = ENV.databaseUrl || process.env.DATABASE_URL;
    if (!uri) {
      throw new Error("DATABASE_URL is not configured");
    }
    _pool = mysql.createPool({
      uri,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
  }
  return _pool;
}

export async function getMysqlConnection(): Promise<mysql.PoolConnection> {
  return getPool().getConnection();
}
