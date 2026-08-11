/**
 * Échappement de littéraux SQL pour les requêtes construites dynamiquement.
 *
 * À n'utiliser QUE là où la forme de la requête est bâtie à l'exécution
 * (filtres optionnels concaténés puis passés à `sql.raw`). Partout où la
 * requête a une forme fixe, préférer le template `sql` de Drizzle ou
 * `conn.execute(text, params)`, qui produisent de vrais paramètres liés.
 *
 * Pourquoi ce module existe : le dépôt utilisait `str.replace(/'/g, "''")`.
 * Ce doublage de quotes est contournable en MySQL, où le backslash est un
 * caractère d'échappement par défaut : une entrée `\'` ressort en `\''`, dont
 * le `\'` est lu comme une quote littérale et le `'` suivant referme la
 * chaîne — le reste de l'entrée devient du SQL.
 *
 * On délègue donc à l'échappement de `mysql2` (via `sqlstring`), qui traite
 * backslash, quotes, NUL, retours ligne et Ctrl-Z.
 */

import mysql from "mysql2";

/**
 * Renvoie un littéral SQL sûr, quotes comprises.
 * `sqlLiteral("O'Brien")` → `'O\'Brien'`
 */
export function sqlLiteral(value: string | number | null | undefined): string {
  return mysql.escape(value ?? null);
}

/**
 * Renvoie un littéral SQL sûr pour un motif LIKE « contient », quotes comprises.
 * `sqlLike("foo")` → `'%foo%'`
 *
 * Note : les métacaractères LIKE (`%` et `_`) présents dans l'entrée restent
 * actifs — c'est voulu pour ces recherches plein texte, et sans danger
 * d'injection puisque la valeur est échappée en tant que littéral.
 */
export function sqlLike(value: string): string {
  return mysql.escape(`%${value}%`);
}
