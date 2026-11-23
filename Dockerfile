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
#
# L'image est celle du mode autonome (PERFUMUM_PLATFORM=standalone) : le
# client est compilé sans le runtime Manus. Le défaut du code reste "manus" ;
# c'est ce Dockerfile, et lui seul, qui choisit "standalone".
#
# Plateforme cible : linux/amd64 (Render, la plupart des hébergeurs). Le
# workflow docker.yml la fixe ; à la main :
#   docker build --platform linux/amd64 \
#     --build-arg GIT_COMMIT="$(git rev-parse HEAD)" -t perfumum .
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
#
# sharing=locked : les deux étapes partagent ce cache et BuildKit les exécute
# en parallèle. Verrouillé, un seul `pnpm install` y accède à la fois.
RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store,sharing=locked \
    pnpm install --frozen-lockfile --ignore-scripts

COPY . .

# Vite lit cette variable au moment du build : sans elle, le client embarque
# le runtime Manus (vite-plugin-manus-runtime), inutilisable ailleurs.
ARG PERFUMUM_PLATFORM=standalone
ENV PERFUMUM_PLATFORM=$PERFUMUM_PLATFORM

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

RUN corepack enable

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

# Pas de `pnpm store prune` ici : le magasin vit dans un cache partagé avec
# l'étape builder, pas dans l'image. Le purger n'allégeait rien et supprimait
# des paquets que l'autre étape était en train de lier (ERR_PNPM_ENOENT).
RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store,sharing=locked \
    pnpm install --prod --frozen-lockfile --ignore-scripts

COPY --from=builder /app/dist ./dist

# Répertoire du stockage local (STORAGE_PROVIDER=local). Créé ici pour que
# l'utilisateur `node` puisse y écrire, y compris quand un volume neuf y est
# monté par Docker.
# L'image de base fournit déjà un utilisateur non privilégié `node` (uid 1000).
RUN mkdir -p /app/uploads && chown -R node:node /app
USER node

# Le serveur doit tourner dans le même mode que le client compilé plus haut.
ARG PERFUMUM_PLATFORM=standalone
ENV PERFUMUM_PLATFORM=$PERFUMUM_PLATFORM

# Identité de l'image, renvoyée par GET /healthz. Déclaré en dernier : le
# commit change à chaque construction et invaliderait les couches suivantes.
ARG APP_VERSION=""
ARG GIT_COMMIT=""
ENV APP_VERSION=$APP_VERSION
ENV GIT_COMMIT=$GIT_COMMIT

EXPOSE 3000

# /healthz répond 200 sans interroger la base ni exiger de session : il reste
# joignable quand la porte d'accès privée est active.
# Appel fait avec Node, déjà présent : pas de curl à installer, donc pas
# d'étape apt (ni de dépôt Debian à joindre) pendant la construction.
HEALTHCHECK --interval=30s --timeout=5s --start-period=40s --retries=3 \
  CMD ["node", "-e", "fetch('http://127.0.0.1:' + (process.env.PORT || 3000) + '/healthz').then(r => process.exit(r.ok ? 0 : 1), () => process.exit(1))"]

CMD ["node", "dist/index.js"]
