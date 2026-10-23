#!/usr/bin/env bash
# Restore Recovery Proof v0.1 into an explicitly named, local isolated database.
# Preconditions: mysql/mariadb client, a local server socket, and no production URL.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SOCKET="${RECOVERY_MYSQL_SOCKET:?Set RECOVERY_MYSQL_SOCKET to the local MySQL/MariaDB socket.}"
DATABASE_NAME="${RECOVERY_DATABASE_NAME:-perfumum_recovery_proof_v01}"

if [[ "$SOCKET" != /* ]]; then
  echo "Refusing non-local socket path: $SOCKET" >&2
  exit 2
fi
if [[ "$DATABASE_NAME" != "perfumum_recovery_proof_v01" ]]; then
  echo "Refusing an unexpected database name: $DATABASE_NAME" >&2
  exit 2
fi

mysql=(mysql --protocol=socket --socket="$SOCKET" --user=root)

if "${mysql[@]}" --skip-column-names -e "SHOW DATABASES LIKE '${DATABASE_NAME}'" | grep -qx "$DATABASE_NAME"; then
  echo "Refusing to overwrite existing database ${DATABASE_NAME}. Drop it manually only after inspection." >&2
  exit 3
fi

"${mysql[@]}" -e "CREATE DATABASE \`${DATABASE_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_bin;"
"${mysql[@]}" "$DATABASE_NAME" < "$ROOT/database/schema/sample-schema.sql"
"${mysql[@]}" "$DATABASE_NAME" < "$ROOT/database/sample/sample-data.sql"

"${mysql[@]}" --batch --skip-column-names "$DATABASE_NAME" <<'SQL'
SELECT 'plants', COUNT(*) FROM plants;
SELECT 'molecules', COUNT(*) FROM molecules;
SELECT 'terroirs', COUNT(*) FROM terroirs;
SELECT 'plant_molecules', COUNT(*) FROM plant_molecules;
SELECT 'plant_terroirs', COUNT(*) FROM plant_terroirs;
SELECT 'bibliography_entries', COUNT(*) FROM bibliography_entries;
SELECT 'bibliography_entity_links', COUNT(*) FROM bibliography_entity_links;
SELECT CONCAT('plant=', name, ' | latin=', latin_name) FROM plants WHERE id=480029;
SELECT CONCAT('molecules_for_plant=', COUNT(*)) FROM plant_molecules WHERE plant_id=480029;
SELECT CONCAT('terroirs_for_plant=', COUNT(*)) FROM plant_terroirs WHERE plant_id=480029;
SELECT CONCAT('bibliography_for_plant=', COUNT(*))
FROM bibliography_entity_links WHERE entity_type='plant' AND entity_id=480029;
SQL

echo "Restore completed in local database: ${DATABASE_NAME}"
