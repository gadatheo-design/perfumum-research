# syntax=docker/dockerfile:1

# ==============================================================================
# PERFUMUM — image de production
#
# Deux étapes :
#   1. builder — toutes les dépendances, compile le client (Vite) et le
#      serveur (esbuild). Cette étape a besoin d'environ 3,2 Go de mémoire.
#   2. runtime  — dépendances de production uniquement + le résultat du build.
#
# Le serveur est bundlé avec `--packages=external` : node_modules reste donc
# nécessaire à l'exécution, d'où le `pnpm install --prod` de l'étape 2.
# ==============================================================================

# ------------------------------------------------------------------ builder --
FROM node:22-slim AS builder

ENV PNPM_HOME=/pnpm
ENV PATH=$PNPM_HOME:$PATH
RUN corepack enable

WORKDIR /app

# Couche de dépendances séparée : tant que ces deux fichiers ne changent pas,
# Docker réutilise le cache et n'a pas à réinstaller 1166 paquets.
COPY package.json pnpm-lock.yaml ./

# --ignore-scripts : aucune dépendance de production n'a besoin de compilation
# native. Seul better-sqlite3 (dépendance de développement, utilisée par des
# tests) en aurait besoin ; l'ignorer évite d'embarquer une chaîne de
# compilation C++ et supprime l'exécution de scripts d'installation arbitraires.
RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store \
    pnpm install --frozen-lockfile --ignore-scripts

COPY . .

# Le build du client demande ~3,2 Go au pic. Voir le guide de déploiement si
# la machine de build est limitée à 4 Go.
ENV NODE_ENV=production
RUN pnpm build

# ------------------------------------------------------------------ runtime --
FROM node:22-slim AS runtime

ENV PNPM_HOME=/pnpm
ENV PATH=$PNPM_HOME:$PATH
ENV NODE_ENV=production
ENV PORT=3000

RUN corepack enable \
 && apt-get update \
 && apt-get install -y --no-install-recommends curl \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store \
    pnpm install --prod --frozen-lockfile --ignore-scripts \
 && pnpm store prune

COPY --from=builder /app/dist ./dist

# L'image de base fournit déjà un utilisateur non privilégié `node` (uid 1000).
RUN chown -R node:node /app
USER node

EXPOSE 3000

# Le serveur écoute sur PORT ; la racine renvoie index.html en production.
HEALTHCHECK --interval=30s --timeout=5s --start-period=40s --retries=3 \
  CMD curl -fsS "http://127.0.0.1:${PORT}/" > /dev/null || exit 1

CMD ["node", "dist/index.js"]
