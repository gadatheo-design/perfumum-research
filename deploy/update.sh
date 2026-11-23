#!/usr/bin/env bash
#
# Met à jour l'application sur le VPS.
#
#   ./deploy/update.sh
#
# Récupère l'image publiée par l'intégration continue et redémarre le service.
# Si APP_IMAGE pointe sur une image locale (perfumum:local), le script
# reconstruit sur place — en prévenant que c'est l'option coûteuse.
#
set -euo pipefail
cd "$(dirname "$0")/.."

if [[ ! -f .env ]]; then
  echo "erreur : .env introuvable" >&2
  exit 2
fi
set -a; . ./.env; set +a

IMAGE="${APP_IMAGE:-perfumum:local}"

echo "▸ Sauvegarde de la base avant mise à jour…"
./deploy/db-backup.sh

if [[ "$IMAGE" == *"/"* ]]; then
  echo "▸ Récupération de l'image $IMAGE…"
  docker compose pull app
else
  echo "▸ APP_IMAGE=$IMAGE : construction sur ce serveur."
  echo "  ⚠ Le build atteint ~3,2 Go au pic et monopolise la machine"
  echo "    plusieurs minutes. Publier l'image depuis l'intégration continue"
  echo "    (workflow .github/workflows/docker.yml) évite cela."
  docker compose build app
fi

echo "▸ Redémarrage du service applicatif…"
docker compose up -d app

echo "▸ Attente de l'état « healthy »…"
for _ in $(seq 1 30); do
  STATE=$(docker compose ps --format json app 2>/dev/null \
          | python3 -c "import sys,json
try:
    d=json.loads(sys.stdin.read() or '{}')
    if isinstance(d, list): d = d[0] if d else {}
    print(d.get('Health') or d.get('State') or '')
except Exception:
    print('')" 2>/dev/null || echo "")
  if [[ "$STATE" == "healthy" || "$STATE" == "running" ]]; then
    echo "✅ Service en ligne ($STATE)."
    docker image prune -f >/dev/null 2>&1 || true
    exit 0
  fi
  sleep 4
done

echo "❌ Le service n'est pas devenu sain dans le délai imparti." >&2
echo "   Journaux :  docker compose logs --tail=50 app" >&2
exit 1
