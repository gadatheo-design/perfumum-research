#!/usr/bin/env bash
#
# Importe un dump MySQL/TiDB dans le conteneur `db`.
#
#   ./deploy/db-import.sh backups/perfumum-2026-08-13.sql
#
# Le dump provient de TiDB Cloud ; MySQL 8 en accepte la quasi-totalité, mais
# quelques constructions propres à TiDB peuvent subsister. Le script détecte
# les cas connus AVANT d'écrire quoi que ce soit, et refuse de continuer si
# la base cible n'est pas vide (pour ne pas empiler deux imports).
#
set -euo pipefail

DUMP="${1:-}"
SERVICE="${DB_SERVICE:-db}"

if [[ -z "$DUMP" ]]; then
  echo "usage : $0 <chemin-du-dump.sql[.gz]>" >&2
  exit 2
fi
if [[ ! -f "$DUMP" ]]; then
  echo "erreur : fichier introuvable — $DUMP" >&2
  exit 2
fi

# Les identifiants viennent de .env, jamais de la ligne de commande : un mot
# de passe passé en argument se retrouverait dans l'historique du shell et
# dans la table des processus.
if [[ -f .env ]]; then
  set -a; . ./.env; set +a
else
  echo "erreur : .env introuvable à la racine du projet" >&2
  exit 2
fi

DB_NAME="${MYSQL_DATABASE:-perfumum}"

echo "▸ Vérification du dump…"

READER="cat"
if [[ "$DUMP" == *.gz ]]; then READER="gzip -dc"; fi

# Constructions TiDB que MySQL 8 refuse. On avertit sans bloquer : selon la
# version de mysqldump utilisée, elles sont souvent déjà en commentaires
# conditionnels /*T!...*/ que MySQL ignore silencieusement.
if $READER "$DUMP" | grep -qE 'AUTO_RANDOM|SHARD_ROW_ID_BITS|PRE_SPLIT_REGIONS'; then
  echo "  ⚠ Constructions spécifiques à TiDB détectées (AUTO_RANDOM / SHARD_ROW_ID_BITS)."
  echo "    Si l'import échoue dessus, régénérer le dump avec mysqldump --compatible=ansi"
  echo "    ou retirer ces clauses. Poursuite quand même."
fi

TABLES=$($READER "$DUMP" | grep -cE '^CREATE TABLE' || true)
INSERTS=$($READER "$DUMP" | grep -cE '^INSERT INTO' || true)
echo "  $TABLES instructions CREATE TABLE, $INSERTS instructions INSERT"

if [[ "$TABLES" -eq 0 ]]; then
  echo "erreur : aucun CREATE TABLE trouvé — le dump semble vide ou tronqué." >&2
  exit 1
fi

echo "▸ Attente que MySQL soit prêt…"
until docker compose exec -T "$SERVICE" \
        mysqladmin ping -h 127.0.0.1 -p"$MYSQL_ROOT_PASSWORD" --silent >/dev/null 2>&1; do
  sleep 2
done

EXISTING=$(docker compose exec -T "$SERVICE" \
  mysql -uroot -p"$MYSQL_ROOT_PASSWORD" -N -B \
  -e "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema='$DB_NAME';" 2>/dev/null | tr -d '\r')

if [[ "${EXISTING:-0}" -gt 0 ]]; then
  echo "erreur : la base '$DB_NAME' contient déjà $EXISTING tables." >&2
  echo "        Importer par-dessus mélangerait deux jeux de données." >&2
  echo "        Pour repartir de zéro : docker compose down -v  (DÉTRUIT les données)" >&2
  exit 1
fi

echo "▸ Import en cours (cela peut prendre plusieurs minutes)…"
$READER "$DUMP" | docker compose exec -T "$SERVICE" \
  mysql -uroot -p"$MYSQL_ROOT_PASSWORD" \
        --max-allowed-packet=1G \
        --init-command="SET SESSION FOREIGN_KEY_CHECKS=0; SET SESSION UNIQUE_CHECKS=0;" \
        "$DB_NAME"

echo "▸ Vérification post-import…"
docker compose exec -T "$SERVICE" \
  mysql -uroot -p"$MYSQL_ROOT_PASSWORD" -N -B -e "
    SELECT CONCAT('  tables importées : ', COUNT(*))
    FROM information_schema.tables WHERE table_schema='$DB_NAME';
    SELECT CONCAT('  lignes estimées  : ', IFNULL(SUM(table_rows),0))
    FROM information_schema.tables WHERE table_schema='$DB_NAME';" 2>/dev/null

# Droits de l'utilisateur applicatif : il ne doit avoir accès qu'à cette base,
# et surtout pas les privilèges d'administration de root.
echo "▸ Attribution des droits à '${MYSQL_USER:-perfumum}'…"
docker compose exec -T "$SERVICE" \
  mysql -uroot -p"$MYSQL_ROOT_PASSWORD" -e "
    GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, DROP, INDEX, ALTER, REFERENCES
      ON \`$DB_NAME\`.* TO '${MYSQL_USER:-perfumum}'@'%';
    FLUSH PRIVILEGES;" 2>/dev/null

echo "✅ Import terminé."
echo "   Contrôle utile : docker compose exec db mysql -u${MYSQL_USER:-perfumum} -p $DB_NAME -e 'SHOW TABLES;' | head"
