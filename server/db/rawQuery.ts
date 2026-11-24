/**
 * Requête SQL brute sur le pool de l'instance Drizzle.
 *
 * Jusqu'au commit 8e11e402, Drizzle créait lui-même un pool « à callbacks »
 * à partir de l'adresse de la base, et quatre fonctions écrivaient
 * `db.$client.promise().query(...)`. Drizzle reçoit désormais le pool
 * PROMESSE de createAppPool (fermeture des connexions inactives, reprise
 * après coupure) : `.promise()` n'existe plus et ces appels échouaient
 * (« db.$client.promise is not a function »).
 *
 * Ce module est le seul endroit qui touche `$client` pour du SQL brut ;
 * server/db-client-promise.test.ts empêche de réintroduire `.promise()`.
 */

import type { Pool } from "mysql2/promise";

export async function queryRows<T = Record<string, unknown>>(
  db: { $client: Pool },
  sql: string,
  params?: unknown[]
): Promise<T[]> {
  const [rows] = await db.$client.query(sql, params);
  return rows as T[];
}
