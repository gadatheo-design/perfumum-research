# PERFUMUM — Problèmes Connus et Solutions

> **Projet de recherche sur 10 ans (2025-2035)**  
> Ce document recense les problèmes techniques récurrents rencontrés et leurs solutions.  
> **IMPORTANT** : Consulter ce fichier AVANT toute intervention technique.

---

## 🔴 PROBLÈME CRITIQUE : Écran blanc sur certaines pages

### Description
Certaines pages affichent un écran blanc au lieu du contenu. L'erreur dans la console est :
```
@vitejs/plugin-react can't detect preamble. Something is wrong.
```

### Pages affectées (historique)
- `/compare-terpenes`
- `/compare-molecules-advanced`
- `/comparateur-avance`
- `/compare-radar`
- Potentiellement toute nouvelle page de comparaison

### Causes identifiées
1. **Cache Vite corrompu** - Le cache de développement peut se corrompre
2. **Conflit HMR (Hot Module Replacement)** - Les modules React ne se rechargent pas correctement
3. **Problème d'encodage de fichier** - Caractères invisibles ou BOM dans les fichiers .tsx

### Solutions tentées (INEFFICACES)
- ❌ Supprimer et recréer le fichier
- ❌ Nettoyer le cache avec `rm -rf node_modules/.vite`
- ❌ Réinstaller les dépendances avec `pnpm install --force`
- ❌ Redémarrer le serveur plusieurs fois
- ❌ Rollback vers un checkpoint précédent

### Solutions à tester (NON CONFIRMÉES)
- [ ] Vérifier la version de `@vitejs/plugin-react` dans package.json
- [ ] Mettre à jour Vite et ses plugins
- [ ] Créer un nouveau projet et migrer les fichiers un par un
- [ ] Vérifier si le problème existe en production (après build)

### Recommandation
**Si ce problème survient, NE PAS passer plus de 15 minutes à le débugger.**  
Informer l'utilisateur et passer à une autre tâche.

---

## 🟡 PROBLÈME MODÉRÉ : Lenteur de compilation TypeScript

### Description
La vérification TypeScript (`pnpm exec tsc`) peut être très lente (>60 secondes).

### Solution
Utiliser `pnpm exec tsc --noEmit` pour une vérification plus rapide, ou cibler un fichier spécifique.

---

## 🟡 PROBLÈME MODÉRÉ : Erreurs de session cookie

### Description
Les logs affichent fréquemment `[Auth] Missing session cookie`.

### Impact
Aucun impact fonctionnel - c'est normal pour les utilisateurs non connectés.

### Solution
Ignorer ces messages, ils ne sont pas des erreurs.

---

## 🟢 BONNES PRATIQUES CONFIRMÉES

### Avant de créer une nouvelle page
1. **Tester les pages similaires existantes** - S'assurer qu'elles fonctionnent
2. **Copier la structure d'une page fonctionnelle** - Ne pas partir de zéro
3. **Tester immédiatement après création** - Avant d'ajouter du contenu complexe

### Après modification de fichiers
1. Attendre 10-15 secondes que Vite recompile
2. Rafraîchir le navigateur avec Ctrl+Shift+R (hard refresh)
3. Vérifier la console du navigateur pour les erreurs

### En cas de problème
1. **Maximum 3 tentatives** de la même solution
2. **Informer l'utilisateur** après 10-15 minutes sans progrès
3. **Documenter le problème** dans ce fichier

---

## 📅 Historique des incidents

| Date | Problème | Résolution | Temps perdu |
|------|----------|------------|-------------|
| 2025-12-15 | Écran blanc sur /comparateur-avance | Non résolu | ~50 min |
| 2025-12-15 | Écran blanc sur /compare-terpenes | Non résolu | ~10 min |

---

## 📝 Notes pour les futures sessions

- Ce projet utilise **Vite + React 19 + TypeScript + tRPC**
- Le template est `web-db-user` avec authentification Manus OAuth
- La base de données est **MySQL/TiDB** via Drizzle ORM
- Les fichiers sources sont dans `/home/ubuntu/perfumum-research/`

---

*Dernière mise à jour : 15 décembre 2025*
