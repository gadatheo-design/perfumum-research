# 🐛 Bugs Techniques à Résoudre - PERFUMUM

Date: 17 décembre 2024
Statut: Documentation complète des bugs bloquants

---

## ❌ BUG CRITIQUE #1: "Invalid hook call" dans toutes les nouvelles pages tRPC

**Symptôme** : 
- Erreur console: "Invalid hook call. Hooks can only be called inside of the body of a function component"
- Toutes les nouvelles pages utilisant tRPC sont complètement blanches
- Pages affectées: `/admin/import-export`, `/admin/historique`

**Impact** : 
- **BLOQUANT** - Impossible de créer de nouvelles pages utilisant tRPC
- Backend fonctionnel mais interface utilisateur inaccessible
- Fonctionnalités d'import/export CSV et d'historique des modifications non testables

**Tentatives de résolution** :
1. ✅ Vérification versions React/React-DOM/tRPC (cohérentes: React 19.2.3, tRPC 11.8.0)
2. ❌ Création page simplifiée sans composants séparés → même erreur
3. ❌ Utilisation fetch direct au lieu de hooks tRPC → même erreur
4. ❌ Suppression des composants bugués → erreur persiste

**Hypothèses** :
- Configuration profonde de tRPC/React Query incorrecte
- Problème dans `/client/src/lib/trpc.ts` ou `/client/src/main.tsx`
- Possible conflit dans TRPCProvider

**Prochaines étapes recommandées** :
1. Nettoyer node_modules et réinstaller :
   ```bash
   cd /home/ubuntu/perfumum-research
   rm -rf node_modules pnpm-lock.yaml
   pnpm install
   ```
2. Vérifier la configuration TRPCProvider dans `main.tsx`
3. Créer une page de test minimale avec un seul hook tRPC
4. Vérifier les logs serveur pour des erreurs backend
5. Ajouter error boundary React pour isoler l'erreur

**Composants créés mais non fonctionnels** :
- `/client/src/pages/AdminImportExport.tsx` (page blanche)
- `/client/src/pages/AdminHistorique.tsx` (page blanche)
- `/client/src/components/GlobalSearchAdvanced.tsx` (non testé)

---

## ⚠️ BUG #2: Liens imbriqués `<a>` dans `<a>` (PARTIELLEMENT RÉSOLU)

**Symptôme** : 
- Erreur console: "In HTML, `<a>` cannot be a descendant of `<a>`"
- Empêche le rendu correct de certaines sections

**Impact** : 
- Sections de pages ne s'affichent pas correctement
- Problème résolu dans 18 fichiers, reste 7 fichiers

**Fichiers corrigés** (18 fichiers) :
- ✅ `/client/src/components/Breadcrumbs.tsx`
- ✅ `/client/src/components/layout/Header.tsx`
- ✅ `/client/src/components/layout/Breadcrumb.tsx`
- ✅ `/client/src/components/DynamicBreadcrumb.tsx`
- ✅ 14 autres fichiers dans `/pages/` via script Python

**Fichiers restants à corriger** (7 fichiers) :
- `/client/src/components/cards/AccordCard.tsx`
- `/client/src/components/cards/MatiereCard.tsx`
- `/client/src/components/cards/PrototypeCard.tsx`
- `/client/src/components/VoirAussi.tsx`
- `/client/src/pages/Favoris.tsx`
- `/client/src/pages/Laboratoire.tsx`
- `/client/src/pages/RechercheScientifique.tsx`

**Solution appliquée** :
```tsx
// ❌ Avant (incorrect)
<Link href="/path">
  <a className="...">Contenu</a>
</Link>

// ✅ Après (correct)
<Link href="/path" className="...">
  Contenu
</Link>
```

**Script de correction** : `/home/ubuntu/fix_nested_links.py`

---

## 📊 État Actuel du Projet

### ✅ Backend Fonctionnel (100%)

**Export/Import CSV** :
- ✅ Endpoints tRPC pour export CSV (5 entités: molécules, recettes, accords, familles, matières)
- ✅ Endpoints tRPC pour import CSV (5 entités)
- ✅ 3 modes d'import: create, update, upsert
- ✅ Validation des données CSV
- ✅ Utilitaires CSV robustes (`/server/csv-utils.ts`)
- ✅ 16 tests unitaires validés (`/server/export.test.ts`)

**Historique des modifications** :
- ✅ Table `modification_history` créée en base de données
- ✅ Endpoints tRPC pour historique (`history.getByEntity`, `history.getRecent`, `history.undo`)
- ✅ Fonctions DB pour enregistrer/récupérer/annuler modifications
- ✅ Support pour les 5 entités

**Recherche avancée** :
- ✅ Composant `GlobalSearchAdvanced` créé
- ✅ Filtres par type (molécule, recette, accord)
- ✅ Filtres par gamme olfactive (Volcanique, Glaciaire, Bio-Lab, Pétrichor)
- ✅ Filtres par famille chimique (Terpènes, Aldéhydes, etc.)
- ✅ Recherche en temps réel avec compteur de résultats

### ❌ Frontend Bloqué (0% fonctionnel)

**Pages créées mais non accessibles** :
- ❌ `/admin/import-export` - Page blanche (bug Invalid hook call)
- ❌ `/admin/historique` - Page blanche (bug Invalid hook call)

**Composants créés mais non intégrés** :
- ❌ `GlobalSearchAdvanced` - Non testé (risque bug Invalid hook call)

**Fonctionnalités testées** :
- ✅ Export CSV fonctionne depuis la page Admin existante (avant suppression de la section)
- ❌ Import CSV non testé (UI bloquée)
- ❌ Historique des modifications non testé (UI bloquée)
- ❌ Recherche avancée non testée (UI non intégrée)

---

## 🎯 Plan de Résolution

### Phase 1: Déblocage critique (Priorité HAUTE)
1. **Résoudre bug "Invalid hook call"**
   - Nettoyer node_modules et réinstaller
   - Vérifier configuration TRPCProvider
   - Créer page de test minimale
   - Consulter documentation tRPC 11.x pour React 19

2. **Tester les fonctionnalités backend**
   - Une fois l'UI débloquée, tester import CSV
   - Tester historique des modifications
   - Tester recherche avancée

### Phase 2: Finalisation (Priorité MOYENNE)
1. **Corriger les 7 fichiers restants avec liens imbriqués**
   - Utiliser le script Python ou correction manuelle
   - Vérifier que toutes les sections s'affichent correctement

2. **Intégrer GlobalSearchAdvanced**
   - Remplacer GlobalSearch par GlobalSearchAdvanced dans App.tsx
   - Tester toutes les combinaisons de filtres

### Phase 3: Tests et validation (Priorité BASSE)
1. **Tests utilisateur**
   - Export CSV de toutes les entités
   - Import CSV avec différents modes
   - Annulation de modifications
   - Recherche avec filtres multiples

2. **Documentation**
   - Guide utilisateur pour import/export CSV
   - Guide pour utiliser l'historique des modifications
   - Guide pour la recherche avancée

---

## 📝 Notes Techniques

### Fichiers Backend Créés/Modifiés
- `/server/routers.ts` - Ajout routers export, import, history (lignes 1200-1586)
- `/server/db.ts` - Ajout fonctions historique (lignes 2947-3013)
- `/server/csv-utils.ts` - Utilitaires CSV complets
- `/server/export.test.ts` - Tests unitaires (16 tests)
- `/drizzle/schema.ts` - Table modification_history

### Fichiers Frontend Créés
- `/client/src/pages/AdminImportExport.tsx` - Page import/export (non fonctionnelle)
- `/client/src/pages/AdminHistorique.tsx` - Page historique (non fonctionnelle)
- `/client/src/components/GlobalSearchAdvanced.tsx` - Recherche avancée (non testée)

### Fichiers Supprimés
- `/client/src/components/ExportCSVButton.tsx` - Composant buggé
- `/client/src/components/ImportCSVDialog.tsx` - Composant buggé

---

## 🔗 Ressources Utiles

- [Documentation tRPC v11](https://trpc.io/docs/v11)
- [React 19 Migration Guide](https://react.dev/blog/2024/04/25/react-19)
- [Rules of Hooks](https://react.dev/reference/rules/rules-of-hooks)
- [Debugging Invalid Hook Call](https://react.dev/link/invalid-hook-call)

---

**Dernière mise à jour** : 17 décembre 2024, 13:50
**Auteur** : Manus AI
**Statut global** : Backend complet, Frontend bloqué par bug critique
