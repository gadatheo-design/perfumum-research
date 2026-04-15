# PERFUMUM — Guide de Développement

> **Projet de recherche olfactive sur 10 ans (2025-2035)**  
> Ce guide assure la continuité et la cohérence du développement à travers les sessions.

---

## 🎯 Vision du Projet

PERFUMUM est une plateforme de recherche-création dédiée à l'exploration olfactive expérimentale, articulant :
- Design terpénique
- Résines CBD
- Variétés de tabacs rares

**Objectifs à 10 ans :**
- 5 gammes olfactives conceptuelles
- 131+ molécules documentées
- 142+ recettes expérimentales
- 26 traditions olfactives culturelles

---

## 📁 Structure du Projet

```
/home/ubuntu/perfumum-research/
├── client/                 # Frontend React
│   ├── src/
│   │   ├── pages/         # Pages de l'application
│   │   ├── components/    # Composants réutilisables
│   │   ├── lib/           # Utilitaires (trpc, gammeMapping, etc.)
│   │   └── App.tsx        # Routes et navigation
│   └── public/            # Assets statiques
├── server/                 # Backend tRPC
│   ├── routers.ts         # Procédures API
│   └── db.ts              # Helpers base de données
├── drizzle/               # Schéma base de données
│   └── schema.ts          # Tables et types
├── shared/                # Types partagés
├── KNOWN_ISSUES.md        # ⚠️ LIRE EN PREMIER
├── DEVELOPMENT_GUIDE.md   # Ce fichier
└── todo.md                # Tâches en cours
```

---

## 🚀 Avant de Commencer une Session

### Checklist obligatoire

1. **Lire `KNOWN_ISSUES.md`** - Problèmes récurrents à éviter
2. **Lire `todo.md`** - État des tâches en cours
3. **Vérifier l'état du serveur** - `webdev_check_status`
4. **Tester la page d'accueil** - S'assurer que le site fonctionne

### Commandes utiles

```bash
# Vérifier l'état du projet
cd /home/ubuntu/perfumum-research

# Voir les erreurs TypeScript
pnpm exec tsc --noEmit

# Voir les logs du serveur
cat /tmp/dev-server.log | tail -50

# Nettoyer le cache (si problèmes)
rm -rf node_modules/.vite
```

---

## 🏗️ Architecture Technique

### Stack
- **Frontend** : React 19 + Tailwind CSS 4 + shadcn/ui
- **Backend** : Express 4 + tRPC 11
- **Base de données** : MySQL/TiDB via Drizzle ORM
- **Auth** : Manus OAuth (intégré)
- **Build** : Vite

### Conventions de code

- **Pages** : `client/src/pages/NomPage.tsx` (PascalCase)
- **Composants** : `client/src/components/NomComposant.tsx`
- **Routes** : Définies dans `client/src/App.tsx`
- **API** : Procédures dans `server/routers.ts`

### Gammes olfactives (constantes)

Les 5 gammes sont définies dans `client/src/lib/gammeMapping.ts` :
1. **Pétrichor** - Terre, minéral, pluie
2. **Volcanique** - Fumée, pyrolyse, intensité
3. **Traditions Olfactives** - Sacré, culturel, rituel
4. **Glaciaire** - Fraîcheur, ozone, altitude
5. **Bio-Lab** - Expérimental, biotechnologie

---

## ⚠️ Règles de Développement

### FAIRE ✅

- Tester les pages existantes similaires AVANT de créer une nouvelle
- Copier la structure d'une page fonctionnelle comme base
- Informer l'utilisateur après 10-15 min de blocage
- Documenter tout nouveau problème dans `KNOWN_ISSUES.md`
- Créer des checkpoints avant modifications risquées

### NE PAS FAIRE ❌

- Passer plus de 15 min sur le même problème sans informer
- Répéter la même action plus de 3 fois
- Créer de nouvelles pages sans tester les existantes
- Ignorer les erreurs de console
- Modifier les fichiers `server/_core/*` (infrastructure)

---

## 📊 Base de Données

### Tables principales

| Table | Description | Champs clés |
|-------|-------------|-------------|
| `molecules` | Molécules aromatiques | nom, formule, categorie, profil_olfactif |
| `recettes` | Formulations | nom, gamme, molecules, notes |
| `accords` | Combinaisons | nom, molecules, description |
| `traditions` | Pratiques culturelles | nom, region, description |

### Requêtes fréquentes

```typescript
// Récupérer toutes les molécules
trpc.molecules.getAll.useQuery()

// Récupérer une recette par ID
trpc.recettes.getById.useQuery({ id })

// Recherche par gamme
trpc.molecules.getByGamme.useQuery({ gamme: 'petrichor' })
```

---

## 🔄 Workflow de Modification

### Pour ajouter une nouvelle page

1. Vérifier que les pages similaires fonctionnent
2. Copier une page existante comme template
3. Modifier le contenu progressivement
4. Tester après chaque modification majeure
5. Ajouter la route dans `App.tsx`
6. Ajouter le lien dans `MegaMenu.tsx` si nécessaire

### Pour modifier le schéma de base de données

1. Modifier `drizzle/schema.ts`
2. Exécuter `pnpm db:push`
3. Mettre à jour les types dans `shared/`
4. Mettre à jour les procédures dans `server/routers.ts`

---

## 📅 Roadmap du Projet

### Phase 1 (2025) - Fondations ✅
- [x] Structure de base du site
- [x] Base de données molécules/recettes
- [x] Navigation et gammes
- [ ] Résolution des bugs Vite (en cours)

### Phase 2 (2026) - Enrichissement
- [ ] Compléter les 131 molécules
- [ ] Ajouter les visualisations avancées
- [ ] Intégrer les données de recherche

### Phase 3 (2027-2030) - Expansion
- [ ] Documentation des 26 traditions
- [ ] Outils de formulation avancés
- [ ] API publique

### Phase 4 (2031-2035) - Consolidation
- [ ] Publication des résultats
- [ ] Archive pérenne

---

## 📞 Support

En cas de problème technique majeur :
1. Documenter dans `KNOWN_ISSUES.md`
2. Créer un checkpoint de l'état actuel
3. Informer l'utilisateur avec les détails

---

*Dernière mise à jour : 15 décembre 2025*
