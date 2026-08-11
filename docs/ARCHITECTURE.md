# 🏗️ ARCHITECTURE — PERFUMUM

**Version:** 1.0  
**Date:** 12 janvier 2026  
**Auteur:** Manus AI  
**Horizon:** 2025-2035 (10 ans de recherche)

---

## 📋 Table des Matières

1. [Vue d'ensemble](#vue-densemble)
2. [Stack technologique](#stack-technologique)
3. [Architecture générale](#architecture-générale)
4. [Structure des fichiers](#structure-des-fichiers)
5. [Modèle de données](#modèle-de-données)
6. [Flux de données](#flux-de-données)
7. [Authentification & Sécurité](#authentification--sécurité)
8. [Performance & Optimisation](#performance--optimisation)
9. [Déploiement](#déploiement)
10. [Contribution & Maintenance](#contribution--maintenance)

---

## Vue d'ensemble

**PERFUMUM** est une plateforme web complète de recherche olfactive expérimentale. Elle combine une **interface utilisateur riche** (React 18.3 + Tailwind 4) avec un **backend robuste** (Express 4 + tRPC 11) et une **base de données complexe** (MySQL + Drizzle ORM).

### Principes de conception

| Principe | Description |
|----------|-------------|
| **Type-safe** | tRPC garantit la sécurité des types end-to-end |
| **Scalable** | Architecture modulaire pour supporter 10 ans de croissance |
| **Maintainable** | Code bien organisé, documenté et testé |
| **Performant** | Optimisation des requêtes, caching, lazy loading |
| **Sécurisé** | Authentification OAuth, validation des données, HTTPS |

---

## Stack technologique

### Frontend
```
React 18.3            → Framework UI moderne
Tailwind CSS 4        → Utility-first CSS
shadcn/ui             → Composants réutilisables
Wouter                → Routage léger
TanStack Query        → Gestion du cache côté client
D3.js                 → Visualisations de données
Vitest                → Tests unitaires
```

### Backend
```
Express 4             → Framework web minimaliste
tRPC 11               → RPC type-safe
Drizzle ORM           → ORM type-safe pour MySQL
Node.js               → Runtime JavaScript serveur
Zod                   → Validation de schémas
```

### Infrastructure
```
MySQL                 → Base de données relationnelle
S3 (AWS)              → Stockage de fichiers
Manus OAuth           → Authentification
WebSocket             → Communication temps réel
Vite                  → Build tool moderne
```

---

## Architecture générale

### Diagramme d'architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                       CLIENT (React 18.3)                       │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Pages (267)  │  Composants (193)  │  Hooks  │  Contexts │  │
│  │  Home, Gammes, Molécules, Recettes, Admin, etc.         │  │
│  └──────────────────────────────────────────────────────────┘  │
│                              ↓                                   │
│                    TanStack Query + tRPC                        │
└─────────────────────────────────────────────────────────────────┘
                              ↓ HTTP
┌─────────────────────────────────────────────────────────────────┐
│                      API GATEWAY (Express)                      │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  /api/trpc    → tRPC procedures (9914 lignes)           │  │
│  │  /api/oauth   → Manus OAuth callback                    │  │
│  │  /ws          → WebSocket pour collaboration            │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    SERVER LOGIC (tRPC Routers)                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Dashboard    │  Molecules    │  Recipes                │  │
│  │  Admin        │  Plants       │  Terroirs               │  │
│  │  References   │  Accords      │  Families               │  │
│  │  Auth         │  System       │  ...                    │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    DATABASE LAYER (Drizzle)                     │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Query Helpers  │  Schema Definitions  │  Migrations    │  │
│  │  db.ts (5775 lignes)                                    │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                         MySQL Database                          │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Users  │  Molecules  │  Recipes  │  Plants  │  ...      │  │
│  │  ~556 molécules  │  ~266 recettes  │  ~144 plantes      │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### Flux de requête

```
1. User clicks button in React component
   ↓
2. Component calls trpc.feature.useMutation() or useQuery()
   ↓
3. TanStack Query sends HTTP POST to /api/trpc
   ↓
4. Express middleware routes to tRPC handler
   ↓
5. tRPC procedure validates input with Zod
   ↓
6. Procedure calls db helper function
   ↓
7. Drizzle ORM generates SQL query
   ↓
8. MySQL executes query
   ↓
9. Result flows back through layers (DB → helper → procedure → client)
   ↓
10. TanStack Query updates cache
    ↓
11. React component re-renders with new data
```

---

## Structure des fichiers

### Répertoire racine

```
perfumum-research/
├── client/                    # Frontend React
├── server/                    # Backend Express + tRPC
├── drizzle/                   # Schéma DB + migrations
├── shared/                    # Code partagé (types, constantes)
├── storage/                   # Helpers S3
├── package.json               # Dépendances
├── tsconfig.json              # Configuration TypeScript
├── vite.config.ts             # Configuration Vite
├── vitest.config.ts           # Configuration Vitest
├── ARCHITECTURE.md            # Ce fichier
├── CONTRIBUTING.md            # Guide de contribution
├── DATABASE.md                # Documentation DB
└── todo.md                    # Suivi des tâches
```

### Frontend (client/)

```
client/
├── src/
│   ├── pages/                 # 267 pages (à consolider)
│   │   ├── Home.tsx           # Page d'accueil
│   │   ├── Admin.tsx          # Hub administrateur
│   │   ├── Molecules.tsx      # Catalogue de molécules
│   │   ├── Recettes.tsx       # Catalogue de recettes
│   │   ├── Gammes.tsx         # Gammes olfactives
│   │   ├── Laboratoire.tsx    # Laboratoire virtuel
│   │   ├── Prototypes.tsx     # Prototypes C1-C4
│   │   ├── admin/             # Pages admin
│   │   ├── outils/            # Outils (calculateurs, etc.)
│   │   ├── methodologie/      # Méthodologie ABSORBE, GC-MS
│   │   └── ...                # 250+ autres pages
│   │
│   ├── components/            # 193 composants réutilisables
│   │   ├── ui/                # shadcn/ui components
│   │   ├── layout/            # Layout components (Header, Footer)
│   │   ├── admin/             # Admin-specific components
│   │   ├── forms/             # Form components
│   │   ├── cards/             # Card components
│   │   ├── charts/            # Chart components (D3, Recharts)
│   │   ├── tables/            # Table components
│   │   └── ...                # 180+ autres composants
│   │
│   ├── contexts/              # React contexts
│   │   ├── ThemeContext.tsx   # Gestion du thème
│   │   ├── AuthContext.tsx    # Gestion de l'authentification
│   │   └── ...
│   │
│   ├── hooks/                 # Custom hooks
│   │   ├── useAuth.ts         # Hook d'authentification
│   │   ├── useKeyboardNavigation.ts
│   │   └── ...
│   │
│   ├── lib/
│   │   ├── trpc.ts            # Configuration tRPC client
│   │   ├── utils.ts           # Utilitaires
│   │   └── ...
│   │
│   ├── App.tsx                # Routing principal
│   ├── main.tsx               # Point d'entrée
│   └── index.css              # Styles globaux
│
├── public/                    # Assets statiques
│   ├── index.html
│   ├── favicon.ico
│   └── ...
│
└── package.json
```

### Backend (server/)

```
server/
├── _core/                     # Framework plumbing (ne pas éditer)
│   ├── index.ts               # Point d'entrée serveur
│   ├── context.ts             # Contexte tRPC (user, db)
│   ├── trpc.ts                # Configuration tRPC
│   ├── oauth.ts               # Manus OAuth
│   ├── vite.ts                # Intégration Vite
│   ├── websocket.ts           # WebSocket pour collaboration
│   ├── llm.ts                 # Intégration LLM
│   ├── imageGeneration.ts     # Génération d'images
│   ├── voiceTranscription.ts  # Transcription audio
│   ├── map.ts                 # Intégration Google Maps
│   ├── notification.ts        # Notifications propriétaire
│   ├── env.ts                 # Variables d'environnement
│   └── ...
│
├── routers.ts                 # 9914 lignes - Procédures tRPC
│   ├── dashboard.*            # Dashboard stats
│   ├── molecules.*            # CRUD molécules
│   ├── recipes.*              # CRUD recettes
│   ├── plants.*               # CRUD plantes
│   ├── terroirs.*             # CRUD terroirs
│   ├── accords.*              # CRUD accords
│   ├── families.*             # CRUD familles
│   ├── references.*           # CRUD références
│   ├── auth.*                 # Authentification
│   ├── admin.*                # Fonctions admin
│   └── ...
│
├── db.ts                      # Query helpers
│   ├── getAllMolecules()
│   ├── getMoleculeById()
│   ├── createMolecule()
│   ├── updateMolecule()
│   ├── deleteMolecule()
│   ├── getAllRecipes()
│   ├── getRecipesByMolecule()
│   ├── getPlantStatistics()
│   └── ... (100+ helpers)
│
├── db-*.ts                    # Helpers spécialisés
│   ├── db-recettes-radar.ts   # Logique radar pour recettes
│   ├── db-recommendations.ts  # Recommandations
│   └── ...
│
├── storage.ts                 # Helpers S3
│   ├── storagePut()           # Upload fichier
│   ├── storageGet()           # Récupérer fichier
│   └── ...
│
└── *.test.ts                  # Tests unitaires
    ├── auth.logout.test.ts
    ├── molecules.test.ts
    └── ...
```

### Base de données (drizzle/)

```
drizzle/
├── schema.ts                  # 5775 lignes - Schéma complet
│   ├── users table
│   ├── molecules table
│   ├── recipes table
│   ├── plants table
│   ├── terroirs table
│   ├── accords table
│   ├── families table
│   ├── references table
│   ├── prototypes table
│   ├── relations
│   └── ... (30+ tables)
│
└── migrations/                # Migrations SQL
    ├── 0001_*.sql
    ├── 0002_*.sql
    └── ...
```

---

## Modèle de données

### Entités principales

| Entité | Quantité | Description |
|--------|----------|-------------|
| **Molécules** | ~556 | Composés chimiques olfactifs |
| **Recettes** | ~266 | Formulations olfactives |
| **Plantes** | ~144 | Sources botaniques |
| **Terroirs** | ~29 | Origines géographiques |
| **Accords** | ~30 | Combinaisons harmonieuses |
| **Familles** | ~12 | Catégories olfactives |
| **Prototypes** | 4 | C1, C2, C3, C4 |
| **Utilisateurs** | Variable | Contributeurs et admin |

### Relations principales

```
Molécule ──→ Recette (many-to-many)
Molécule ──→ Plante (many-to-many)
Molécule ──→ Famille (many-to-one)
Plante ──→ Terroir (many-to-many)
Recette ──→ Accord (many-to-one)
Recette ──→ Prototype (many-to-one)
Utilisateur ──→ Favoris (one-to-many)
Utilisateur ──→ Notes (one-to-many)
```

### Schéma simplifié

```sql
-- Molécules
CREATE TABLE molecules (
  id INT PRIMARY KEY,
  name VARCHAR(255),
  casNumber VARCHAR(50),
  iupacName TEXT,
  chemicalClass VARCHAR(100),
  formula VARCHAR(100),
  olfactiveProfile TEXT,
  familyId INT,
  createdAt TIMESTAMP,
  updatedAt TIMESTAMP
);

-- Recettes
CREATE TABLE recipes (
  id INT PRIMARY KEY,
  name VARCHAR(255),
  description TEXT,
  composition JSON,
  prototypeId INT,
  accordId INT,
  createdAt TIMESTAMP,
  updatedAt TIMESTAMP
);

-- Liaisons Molécule-Recette
CREATE TABLE molecule_recipe_links (
  id INT PRIMARY KEY,
  moleculeId INT,
  recipeId INT,
  percentage DECIMAL(5,2),
  FOREIGN KEY (moleculeId) REFERENCES molecules(id),
  FOREIGN KEY (recipeId) REFERENCES recipes(id)
);

-- Plantes
CREATE TABLE plants (
  id INT PRIMARY KEY,
  name VARCHAR(255),
  scientificName VARCHAR(255),
  family VARCHAR(100),
  description TEXT,
  createdAt TIMESTAMP,
  updatedAt TIMESTAMP
);

-- Terroirs
CREATE TABLE terroirs (
  id INT PRIMARY KEY,
  name VARCHAR(255),
  country VARCHAR(100),
  region VARCHAR(100),
  coordinates JSON,
  createdAt TIMESTAMP,
  updatedAt TIMESTAMP
);

-- Liaisons Plante-Terroir
CREATE TABLE plant_terroir_links (
  id INT PRIMARY KEY,
  plantId INT,
  terroirId INT,
  FOREIGN KEY (plantId) REFERENCES plants(id),
  FOREIGN KEY (terroirId) REFERENCES terroirs(id)
);

-- Utilisateurs
CREATE TABLE users (
  id INT PRIMARY KEY,
  openId VARCHAR(64) UNIQUE,
  name TEXT,
  email VARCHAR(320),
  role ENUM('user', 'admin'),
  createdAt TIMESTAMP,
  updatedAt TIMESTAMP
);
```

---

## Flux de données

### Cycle de vie d'une mutation (Ajout de molécule)

```
1. User remplit le formulaire dans MoleculeForm.tsx
   ↓
2. User clique "Ajouter"
   ↓
3. Component appelle: trpc.molecules.create.useMutation()
   ↓
4. TanStack Query valide les données avec Zod
   ↓
5. HTTP POST envoyé à /api/trpc/molecules.create
   ↓
6. Express reçoit la requête
   ↓
7. tRPC router appelle la procédure molecules.create
   ↓
8. Procédure vérifie les permissions (admin ou contributeur)
   ↓
9. Procédure appelle db.createMolecule(data)
   ↓
10. Drizzle ORM génère: INSERT INTO molecules (...)
    ↓
11. MySQL exécute la requête
    ↓
12. Résultat retourne à travers les couches
    ↓
13. TanStack Query invalide le cache (getAllMolecules)
    ↓
14. React re-rend la liste avec la nouvelle molécule
    ↓
15. Toast de succès affiché à l'utilisateur
```

### Cycle de vie d'une query (Charger les molécules)

```
1. Component monte: Molecules.tsx
   ↓
2. useEffect déclenche: trpc.molecules.getAll.useQuery()
   ↓
3. TanStack Query vérifie le cache
   ↓
4. Si pas en cache: HTTP GET à /api/trpc/molecules.getAll
   ↓
5. Express reçoit la requête
   ↓
6. tRPC router appelle la procédure molecules.getAll
   ↓
7. Procédure appelle db.getAllMolecules()
   ↓
8. Drizzle ORM génère: SELECT * FROM molecules
   ↓
9. MySQL retourne les résultats
   ↓
10. Données retournent au client
    ↓
11. TanStack Query cache les données
    ↓
12. React re-rend avec les données
    ↓
13. Component affiche la liste
```

---

## Authentification & Sécurité

### Flux OAuth

```
1. User clique "Se connecter"
   ↓
2. Redirection vers Manus OAuth portal
   ↓
3. User s'authentifie avec ses credentials Manus
   ↓
4. Redirection vers /api/oauth/callback?code=...
   ↓
5. Server échange le code contre un token
   ↓
6. Server crée/met à jour l'utilisateur en DB
   ↓
7. Server crée une session cookie (JWT)
   ↓
8. Redirection vers /dashboard
   ↓
9. Client envoie le cookie à chaque requête
   ↓
10. tRPC vérifie le cookie et injecte ctx.user
```

### Sécurité

| Aspect | Implémentation |
|--------|-----------------|
| **Authentification** | Manus OAuth (OAuth 2.0) |
| **Autorisation** | Rôles (admin/user) + protectedProcedure |
| **Validation** | Zod schemas sur toutes les entrées |
| **HTTPS** | Obligatoire en production |
| **CORS** | Configuré pour le domaine |
| **Rate limiting** | Proxy Manus (à optimiser) |
| **SQL injection** | Drizzle ORM (requêtes paramétrées) |
| **XSS** | React échappe le contenu par défaut |

---

## Performance & Optimisation

### Stratégies de caching

```
1. TanStack Query (client-side)
   - Cache les résultats des queries
   - Stale time: 5 minutes
   - Invalidation au mutation success

2. Database indexes
   - Index sur les colonnes fréquemment recherchées
   - Index composites pour les jointures

3. Lazy loading
   - Composants chargés à la demande
   - Images avec lazy loading

4. Pagination
   - Listes longues paginées (50 items/page)
   - Infinite scroll optionnel
```

### Optimisations à faire

- [ ] Audit Lighthouse (performance, accessibility, SEO)
- [ ] Optimisation des images (WebP, compression)
- [ ] Code splitting des pages
- [ ] Minification des assets
- [ ] Gzip compression
- [ ] CDN pour les fichiers statiques

---

## Déploiement

### Environnements

| Environnement | URL | Base de données |
|---------------|-----|-----------------|
| **Development** | localhost:3000 | MySQL local |
| **Staging** | staging.perfumum.manus.space | MySQL staging |
| **Production** | perfumum.manus.space | MySQL production |

### Variables d'environnement

```bash
# Database
DATABASE_URL=mysql://user:pass@host/perfumum

# Authentication
JWT_SECRET=your-secret-key
VITE_APP_ID=your-app-id
OAUTH_SERVER_URL=https://api.manus.im

# Storage
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
AWS_REGION=us-east-1

# LLM
OPENAI_API_KEY=your-key

# Analytics
VITE_ANALYTICS_ENDPOINT=https://analytics.manus.im
VITE_ANALYTICS_WEBSITE_ID=your-id
```

### Processus de déploiement

```bash
# 1. Créer un checkpoint
npm run checkpoint "Deploy v1.0"

# 2. Compiler
npm run build

# 3. Exécuter les migrations
pnpm db:push

# 4. Démarrer le serveur
npm run start

# 5. Vérifier la santé
curl https://perfumum.manus.space/api/health
```

---

## Contribution & Maintenance

### Workflow de contribution

```
1. Créer une branche: git checkout -b feature/mon-feature
2. Implémenter la feature
3. Écrire les tests: npm run test
4. Vérifier le type: npm run check
5. Formater le code: npm run format
6. Créer une PR avec description
7. Code review
8. Merge et déploiement
```

### Bonnes pratiques

| Pratique | Description |
|----------|-------------|
| **Type-safety** | Utiliser Zod pour valider les données |
| **Tests** | Écrire des tests pour chaque feature |
| **Documentation** | Documenter les fonctions complexes |
| **Performance** | Vérifier les requêtes DB générées |
| **Sécurité** | Valider toutes les entrées utilisateur |
| **Accessibilité** | Tester avec un lecteur d'écran |

### Checklist avant merge

- [ ] Tests passent (`npm run test`)
- [ ] Pas d'erreurs TypeScript (`npm run check`)
- [ ] Code formaté (`npm run format`)
- [ ] Documentation mise à jour
- [ ] Performance vérifiée
- [ ] Sécurité vérifiée
- [ ] Responsive testé

---

## 🔗 Ressources

- [tRPC Documentation](https://trpc.io)
- [React Documentation](https://react.dev)
- [Drizzle ORM Documentation](https://orm.drizzle.team)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [shadcn/ui Documentation](https://ui.shadcn.com)

---

**Dernière mise à jour:** 12 janvier 2026  
**Auteur:** Manus AI  
**Prochaine révision:** Après restructuration majeure
