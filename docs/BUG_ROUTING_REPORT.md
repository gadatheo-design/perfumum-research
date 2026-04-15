# Rapport de Bug : Routing Pages Blanches

**Date :** 29 décembre 2025  
**Statut :** Non résolu - Investigation nécessaire  
**Sévérité :** Critique

## Symptômes

Toutes les pages du site PERFUMUM (sauf la page d'accueil `/`) affichent une **page blanche** sans contenu ni erreur JavaScript visible dans la console.

### Pages affectées

- `/projets` ❌
- `/bibliographie` ❌
- `/molecules` ❌
- `/recettes` ❌
- `/gammes` ❌
- Toutes les autres routes sauf `/` ❌

### Page fonctionnelle

- `/` (page d'accueil) ✅

## Observations

1. **Aucune erreur JavaScript** dans la console du navigateur
2. **Aucune erreur de compilation** côté Vite (sauf 104 erreurs TypeScript LSP qui sont des faux positifs)
3. **Le HTML de base se charge** (titre de la page correct)
4. **React ne monte pas** les composants de page
5. **Le problème existe dans tous les checkpoints testés** :
   - Checkpoint `24ae1d69` (initial)
   - Checkpoint `2738b471` (récent)
   - Checkpoint `9648549f` (actuel)

## Tentatives de résolution

### Essayées sans succès :

1. ✗ Nettoyage du cache Vite (`rm -rf client/.vite client/dist node_modules/.vite`)
2. ✗ Redémarrage complet du serveur de développement
3. ✗ Recréation des fichiers de page avec structure simplifiée
4. ✗ Renommage des fichiers (Bibliographie.tsx → BibliographiePage.tsx)
5. ✗ Rollback vers différents checkpoints
6. ✗ Vérification des imports et exports

### Vérifications effectuées :

- ✓ Les composants `Header`, `Footer`, `Breadcrumbs` existent bien
- ✓ Les routes sont correctement définies dans `App.tsx`
- ✓ Les imports sont corrects
- ✓ Le composant `ErrorBoundary` fonctionne (mais ne capture aucune erreur)
- ✓ Le serveur backend fonctionne correctement

## Hypothèses

### Hypothèse 1 : Problème avec wouter routing
Le système de routing `wouter` pourrait avoir un bug ou une mauvaise configuration qui empêche le rendu des composants de page.

**À investiguer :**
- Configuration du `<Switch>` dans `App.tsx`
- Ordre des routes
- Présence d'une route catch-all qui intercepte toutes les requêtes

### Hypothèse 2 : Problème de lazy loading / code splitting
Vite pourrait avoir un problème avec le lazy loading des composants de page.

**À investiguer :**
- Configuration Vite dans `vite.config.ts`
- Imports dynamiques vs statiques
- Chunks de build

### Hypothèse 3 : Problème avec le serveur backend
Le serveur Express pourrait intercepter les routes et ne pas les transmettre correctement au frontend.

**À investiguer :**
- Configuration du serveur dans `server/_core/index.ts`
- Middleware de routing
- Gestion des routes SPA (Single Page Application)

## Recommandations

### Investigation prioritaire :

1. **Vérifier la configuration du serveur backend** pour s'assurer qu'il renvoie bien `index.html` pour toutes les routes SPA
2. **Examiner les logs du serveur Vite** en mode verbose pour identifier les erreurs de module loading
3. **Tester avec une route minimale** (ex: `/test`) pour isoler le problème
4. **Vérifier la configuration de wouter** et envisager de passer à React Router si nécessaire

### Workaround temporaire :

En attendant la résolution, les pages peuvent être intégrées comme **sections de la page d'accueil** plutôt que comme routes séparées.

## Impact

- ❌ Impossible de naviguer vers les pages internes du site
- ❌ Impossible d'ajouter de nouvelles pages
- ✅ La page d'accueil fonctionne correctement
- ✅ La base de données et le backend fonctionnent correctement

## Prochaines étapes

1. Investigation approfondie de la configuration du serveur backend
2. Test avec une configuration minimale de wouter
3. Si non résolu : migration vers React Router
4. Documentation complète de la solution une fois trouvée

---

**Note :** Ce bug est **préexistant** et n'a pas été causé par les modifications récentes. Il existe dans tous les checkpoints testés.
