/**
 * Entiers à écrire directement dans une requête SQL (LIMIT, OFFSET).
 *
 * MySQL 8 refuse `LIMIT ?` dans une requête PRÉPARÉE (`conn.execute`) quand
 * le paramètre est un nombre JavaScript : mysql2 l'envoie comme DOUBLE et le
 * serveur répond « Incorrect arguments to mysqld_stmt_execute ». TiDB et les
 * anciennes versions étaient plus tolérants, d'où des requêtes qui passaient
 * chez Manus et échouent ailleurs.
 *
 * La valeur est donc validée ici — entier, borné — puis écrite dans le texte
 * de la requête. Un entier borné ne peut pas porter d'injection SQL.
 *
 *   const limit = sqlInt(input.limit, { min: 1, max: 100 });
 *   conn.execute(`SELECT … LIMIT ${limit}`, [autresParamètres]);
 *
 * Le test server/sql-limit-placeholder.test.ts échoue si un `LIMIT ?` ou un
 * `OFFSET ?` réapparaît dans un appel `.execute(`.
 */

export interface SqlIntBounds {
  min: number;
  max: number;
}

export function sqlInt(value: unknown, bounds: SqlIntBounds): number {
  const { min, max } = bounds;
  if (!Number.isSafeInteger(min) || !Number.isSafeInteger(max) || min > max) {
    throw new RangeError("sqlInt : bornes invalides");
  }
  // Seuls les nombres sont acceptés : ni chaîne, ni objet, ni BigInt.
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new TypeError("sqlInt : un nombre fini est attendu");
  }
  const truncated = Math.trunc(value);
  return Math.min(max, Math.max(min, truncated));
}

/** Bornes usuelles. */
export const SQL_LIMIT_MAX = 1000;
export const SQL_OFFSET_MAX = 10_000_000;
