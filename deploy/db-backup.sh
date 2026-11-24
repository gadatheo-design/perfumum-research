#!/usr/bin/env bash
#
# Sauvegarde la base dans ./backups/, compressée et horodatée.
#
#   ./deploy/db-backup.sh
#
# À brancher sur une tâche cron de l'hôte, par exemple tous les jours à 3 h :
#   0 3 * * * cd /opt/perfumum && ./deploy/db-backup.sh >> /var/log/perfumum-backup.log 2>&1
#
# ⚠ Une sauvegarde qui reste sur le même serveur ne protège pas d'une perte
# du serveur. Prévoir une copie hors site (Swiss Backup, rsync vers un autre
# hôte, objet S3…). Voir le guide de déploiement.
#
set -euo pipefail

cd "$(dirname "$0")/.."

SERVICE="${DB_SERVICE:-db}"
RETENTION_DAYS="${RETENTION_DAYS:-14}"
OUT_DIR="backups"

if [[ -f .env ]]; then
  set -a; . ./.env; set +a
else
  echo "erreur : .env introuvable" >&2
  exit 2
fi

DB_NAME="${MYSQL_DATABASE:-perfumum}"
mkdir -p "$OUT_DIR"
STAMP=$(date +%Y-%m-%d_%H%M)
TARGET="$OUT_DIR/perfumum-$STAMP.sql.gz"

echo "▸ Sauvegarde de '$DB_NAME' vers $TARGET"

# --single-transaction : sauvegarde cohérente sans verrouiller les tables,
# donc sans interrompre le service (valable pour InnoDB, ce qui est le cas ici).
docker compose exec -T "$SERVICE" \
  mysqldump -uroot -p"$MYSQL_ROOT_PASSWORD" \
    --single-transaction \
    --quick \
    --routines \
    --triggers \
    --events \
    --default-character-set=utf8mb4 \
    "$DB_NAME" | gzip -9 > "$TARGET"

SIZE=$(du -h "$TARGET" | cut -f1)

# Un dump tronqué est pire qu'une absence de dump : on vérifie que l'archive
# est valide et qu'elle contient bien la marque de fin de mysqldump.
if ! gzip -t "$TARGET" 2>/dev/null; then
  echo "❌ archive corrompue, suppression : $TARGET" >&2
  rm -f "$TARGET"
  exit 1
fi
if ! gzip -dc "$TARGET" | tail -5 | grep -q "Dump completed"; then
  echo "❌ dump incomplet (marque de fin absente), suppression : $TARGET" >&2
  rm -f "$TARGET"
  exit 1
fi

echo "✅ Sauvegarde vérifiée : $TARGET ($SIZE)"

DELETED=$(find "$OUT_DIR" -name 'perfumum-*.sql.gz' -mtime "+$RETENTION_DAYS" -print -delete | wc -l)
[[ "$DELETED" -gt 0 ]] && echo "▸ $DELETED sauvegarde(s) de plus de $RETENTION_DAYS jours supprimée(s)"
exit 0
