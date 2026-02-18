#!/bin/bash

# Script de nettoyage ultra-profond pour résoudre les problèmes de corruption Vite
# Utilisation: ./scripts/clean-build.sh

set -e  # Arrêter en cas d'erreur

echo "🧹 Nettoyage ultra-profond du projet PERFUMUM..."
echo ""

# Couleurs pour les messages
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Fonction pour afficher les messages
log_info() {
    echo -e "${GREEN}✓${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}⚠${NC} $1"
}

log_error() {
    echo -e "${RED}✗${NC} $1"
}

# 1. Supprimer les caches et builds
log_info "Suppression des caches et builds..."
rm -rf node_modules
rm -rf .vite
rm -rf dist
rm -rf .turbo
rm -rf .cache
rm -rf client/dist
rm -rf server/dist

# 2. Supprimer les fichiers de lock temporaires
log_info "Suppression des fichiers de lock temporaires..."
find . -name "*.lock" -type f -delete 2>/dev/null || true
find . -name ".DS_Store" -type f -delete 2>/dev/null || true

# 3. Nettoyer le store pnpm
log_info "Nettoyage du store pnpm..."
pnpm store prune

# 4. Vérifier l'espace disque disponible
log_info "Vérification de l'espace disque..."
df -h . | tail -1

# 5. Réinstaller les dépendances
log_info "Réinstallation des dépendances (cela peut prendre quelques minutes)..."
pnpm install

# 6. Vérifier l'intégrité des dépendances
log_info "Vérification de l'intégrité des dépendances..."
pnpm audit --audit-level=high || log_warn "Des vulnérabilités ont été détectées (non bloquant)"

# 7. Créer un checkpoint Git (optionnel)
if git rev-parse --git-dir > /dev/null 2>&1; then
    log_info "Création d'un checkpoint Git..."
    CURRENT_BRANCH=$(git branch --show-current)
    TIMESTAMP=$(date +%Y%m%d_%H%M%S)
    git add -A
    git commit -m "🔧 Checkpoint avant build - ${TIMESTAMP}" --no-verify || log_warn "Aucun changement à committer"
    log_info "Checkpoint créé sur la branche: ${CURRENT_BRANCH}"
else
    log_warn "Pas de dépôt Git détecté, checkpoint ignoré"
fi

echo ""
log_info "✨ Nettoyage terminé avec succès!"
echo ""
echo "Vous pouvez maintenant lancer le serveur de développement avec:"
echo "  ${GREEN}pnpm dev${NC}"
echo ""
echo "Ou créer un build de production avec:"
echo "  ${GREEN}pnpm build${NC}"
echo ""
