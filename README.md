# PERFUMUM — Recherche Olfactive

**ABSORBE — Laboratoire atmosphérique olfactif basé à Berne**

Plateforme de recherche-création sur 10 ans (2025-2035) dédiée à l'exploration olfactive expérimentale. Le projet articule design terpénique, résines CBD et variétés de tabacs rares dans une approche scientifique et artistique.

---

## 📊 Vue d'ensemble

PERFUMUM est une plateforme web complète de gestion et documentation d'un projet de recherche olfactive décennal. Le site centralise 439 entrées de données interconnectées à travers 31 tables de base de données, offrant une interface moderne et responsive pour explorer molécules, recettes, traditions olfactives et installations artistiques.

### Statistiques du projet

| Catégorie | Quantité | Description |
|-----------|----------|-------------|
| **Molécules** | 138 | Molécules aromatiques avec profils olfactifs complets |
| **Recettes** | 162 | Formulations expérimentales (parfums, résines, tabacs) |
| **Accords** | 25 | Accords olfactifs conceptuels |
| **Prototypes** | 4 | Prototypes fondamentaux C1-C4 |
| **Traditions** | 26 | Traditions olfactives culturelles documentées |
| **Installations** | 7 | Installations artistiques olfactives |
| **Gammes** | 5 | Univers olfactifs (Pétrichor, Volcanique, Civilisations, Glaciaire, Bio-Lab) |

---

## 🛠 Stack Technique

### Frontend
- **React 19** avec TypeScript
- **Wouter** pour le routing
- **Tailwind CSS 4** pour le styling
- **shadcn/ui** pour les composants UI
- **Chart.js** pour les visualisations
- **React Flow** pour les graphes de relations

### Backend
- **Express 4** avec TypeScript
- **tRPC 11** pour l'API type-safe
- **Drizzle ORM** pour la gestion de base de données
- **TiDB Cloud** (MySQL compatible) pour la persistence

### Outils & Infrastructure
- **Vite** pour le build et HMR
- **pnpm** pour la gestion des dépendances
- **PWA** avec service worker pour installation mobile
- **OAuth Manus** pour l'authentification

---

## 🏗 Architecture

### Structure des fichiers

```
perfumum-research/
├── client/                    # Application React
│   ├── src/
│   │   ├── pages/            # Pages principales (61 pages)
│   │   ├── components/       # Composants réutilisables
│   │   ├── lib/              # Utilitaires et configuration tRPC
│   │   ├── hooks/            # Custom React hooks
│   │   └── contexts/         # Contextes React (Theme)
│   └── public/               # Assets statiques
├── server/                    # Backend Express + tRPC
│   ├── db.ts                 # Fonctions database (110+ fonctions)
│   ├── routers.ts            # Routes tRPC (110+ procédures)
│   └── _core/                # Infrastructure OAuth, LLM, Maps
├── drizzle/                   # Schéma et migrations DB
│   └── schema.ts             # 31 tables interconnectées
└── shared/                    # Types partagés
```

### Base de données

Le projet utilise **31 tables interconnectées** avec **275 relations structurelles** :

**Tables principales** :
- `molecules` : 138 molécules avec profils olfactifs, propriétés chimiques, profils radar
- `recettes` : 162 recettes avec formulations, protocoles, évolution aromatique
- `prototypes` : 4 prototypes fondamentaux (C1-C4)
- `olfactive_families` : 10 familles olfactives avec 181 variations
- `accords` : 25 accords avec textures et résonances émotionnelles
- `civilisations` : 26 traditions olfactives culturelles
- `installations` : 7 installations artistiques

**Tables de relations** :
- `molecules_recettes` : Relations molécules ↔ recettes avec proportions
- `prototype_molecules` : Compositions des prototypes
- `recette_accords` : Associations recettes ↔ accords
- `civilisation_accords` : Pratiques olfactives culturelles

**Tables système** :
- `analytics_events` : Tracking événements (7 types)
- `user_favorites` : Molécules favorites par utilisateur
- `user_notes` : Notes personnelles sur entités
- `shared_collections` : Collections partagées

---

## 🚀 Installation & Démarrage

### Prérequis
- Node.js 22.13.0
- pnpm 9.x
- Accès à TiDB Cloud (DATABASE_URL configuré)

### Installation

```bash
# Cloner le projet
cd /home/ubuntu/perfumum-research

# Installer les dépendances (71 packages)
pnpm install

# Pousser le schéma vers la base de données
pnpm db:push

# Démarrer le serveur de développement
pnpm dev
```

Le site sera accessible sur `http://localhost:3000`

### Variables d'environnement

Les variables suivantes sont automatiquement injectées par la plateforme Manus :

- `DATABASE_URL` : Connexion TiDB Cloud
- `JWT_SECRET` : Secret pour sessions
- `VITE_APP_ID` : ID application OAuth
- `OAUTH_SERVER_URL` : URL serveur OAuth
- `BUILT_IN_FORGE_API_KEY` : Clé API Manus (backend)
- `VITE_FRONTEND_FORGE_API_KEY` : Clé API Manus (frontend)

---

## 📱 Fonctionnalités Principales

### Navigation & Recherche
- **Recherche globale** (⌘K / Ctrl+K) : Recherche instantanée dans molécules, recettes et pages
- **Navigation clavier** : Raccourcis G+T/R/G/M/H/A pour navigation rapide
- **Historique navigation** : 10 dernières pages visitées (localStorage)
- **Breadcrumbs dynamiques** : Navigation hiérarchique contextuelle
- **Mobile bottom nav** : 5 icônes pour navigation mobile optimisée

### Visualisations Scientifiques
- **Graphes React Flow** : Visualisation relations molécules-recettes interactives
- **Diagrammes radar** : Profils olfactifs 6 axes (intensité, fraîcheur, chaleur, douceur, piquant, terreux)
- **Heatmaps** : Matrice synergies terpéniques 7×7
- **Courbes Chart.js** : Évolution aromatique (notes tête/cœur/fond)
- **Statistiques avancées** : Dashboard avec KPI, graphiques distribution, timeline

### Outils de Formulation
- **Calculateur de proportions** : Formulation assistée avec validation 100%
- **Analyses de corrélations** : Matrice co-occurrences terpènes
- **Matrice synergies** : 21 combinaisons terpéniques avec scores compatibilité
- **Comparateur radar** : Superposition profils olfactifs (2-4 molécules)
- **Export PDF/CSV** : Export données pour analyse externe

### Système de Favoris & Notes
- **Favoris molécules** : Sauvegarde molécules avec filtres et tri
- **Notes personnelles** : Annotations privées avec autosave (debounce 1.5s)
- **Collections partagées** : Partage collections avec QR codes et tokens
- **Citations académiques** : Export 4 formats (APA, MLA, Chicago, BibTeX)

### PWA & Mobile
- **Installation PWA** : Application installable iOS/Android
- **Service worker** : Cache stratégies (cache-first assets, network-first API)
- **Offline fallback** : Page hors ligne avec auto-retry 5s
- **Touch targets 44px** : Accessibilité mobile optimisée
- **Mode sombre** : Toggle thème clair/sombre avec persistance

---

## 🎨 Design System

### Palette Couleurs (OKLCH)

| Gamme | Couleur | Usage |
|-------|---------|-------|
| **Pétrichor** | Vert terreux | Terre, minéral, pluie |
| **Volcanique** | Rouge fumé | Fumée, pyrolyse, intensité |
| **Civilisations** | Ambre sacré | Sacré, culturel, rituel |
| **Glaciaire** | Cyan frais | Fraîcheur, ozone, altitude |
| **Bio-Lab** | Rose expérimental | Expérimental, biotechnologie |

### Composants Réutilisables

- **GammeBadge** : Badges colorés avec icônes par gamme (3 tailles : sm/md/lg)
- **RadarChart** : Diagramme radar 6 axes réutilisable
- **MolecularGraph** : Graphe React Flow molécules-processus
- **NotesEditor** : Éditeur notes avec autosave et compteur caractères
- **DetailSidebar** : Navigation séquentielle + liens rapides
- **GlobalSearch** : Modal recherche full-screen avec historique

---

## 🔧 Maintenance & Troubleshooting

### Problèmes Connus

#### 1. Corruption système de build Vite

**Symptômes** : Pages blanches, routes dynamiques cassées, erreurs HMR

**Cause** : Conflit entre React Flow et HMR Vite lors de modifications concurrentes

**Solution** :
```bash
# Nettoyage ultra-profond
rm -rf node_modules .vite dist .turbo .cache
pnpm store prune
pnpm install
pnpm dev
```

**Prévention** :
- Créer checkpoint avant modifications majeures
- Tester après chaque modification
- Éviter modifications simultanées de fichiers pages détail

#### 2. Routes dynamiques cassées

**Symptômes** : `/molecule/:id` et `/recette/:id` affichent page blanche

**Cause** : Cache Vite corrompu ou conflit React Flow

**Solution** :
```bash
# Rollback vers checkpoint stable
# Via UI Manus ou commande git
git reset --hard <commit_stable>
pnpm dev
```

**Note** : Ne jamais modifier `MoleculeDetail.tsx` ou `RecetteDetail.tsx` sans checkpoint préalable

### Checkpoints Importants

| Version | Date | Description |
|---------|------|-------------|
| `3b58d71d` | 2025-01-09 | ✅ **STABLE** - Après nettoyage ultra-profond, site 100% fonctionnel |
| `48895002` | 2025-01-09 | Backend analytics complet + Dashboard restauré |
| `f481147f` | 2025-01-09 | Infrastructure analytics (avant bug routage) |

### Commandes Utiles

```bash
# Vérifier statut base de données
pnpm db:studio

# Générer migration
pnpm db:generate

# Pousser schéma vers DB
pnpm db:push

# Lancer tests
pnpm test

# Build production
pnpm build

# Prévisualiser build
pnpm preview
```

---

## 📚 Documentation Complémentaire

- **ANALYTICS_README.md** : Documentation système analytics (7 types événements, 6 procédures tRPC)
- **ANALYTICS_INTEGRATION_GUIDE.md** : Guide intégration tracking dans pages
- **ROUTING_ISSUE.md** : Documentation bug routage et workarounds
- **RAPPORT_PHASE3_COMPLETE.md** : Rapport intégration manuel technique (275 relations)

---

## 🎯 Roadmap 2025-2035

### Phase 1 (2025) : Fondation ✅
- Structuration base de données (31 tables)
- Import données fondamentales (439 entrées)
- Interface web responsive
- Système analytics complet

### Phase 2 (2026-2027) : Expansion
- Ajout 200+ molécules supplémentaires
- Développement gamme Glaciaire (60 variations)
- Intégration API externes (PubChem, ChemSpider)
- Collaboration laboratoires partenaires

### Phase 3 (2028-2030) : Consolidation
- Publication scientifique (revue internationale)
- Exposition installations olfactives
- Réseau international chercheurs
- Plateforme collaborative open-source

### Phase 4 (2031-2035) : Rayonnement
- Conférences internationales
- Livre monographique PERFUMUM
- Archive numérique pérenne
- Transmission méthodologie ABSORBE

---

## 👥 Crédits

**Projet** : PERFUMUM — Recherche Olfactive  
**Laboratoire** : ABSORBE (Berne, Suisse)  
**Direction** : Jean-Alphonse Bastos  
**Développement** : Manus AI  
**Période** : 2025-2035 (10 ans)  

**Marques déposées** :
- ABSORBE™ (Godinje, Montenegro)
- UNLMTD™

---

## 📄 Licence

© 2025 Jean-Alphonse Bastos. Tous droits réservés.

Ce projet est propriétaire et confidentiel. Toute reproduction, distribution ou utilisation non autorisée est strictement interdite.

---

**Version** : 1.0.0  
**Dernière mise à jour** : 9 janvier 2025  
**Checkpoint stable** : `3b58d71d`
