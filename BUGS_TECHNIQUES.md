# 🐛 Bugs Techniques à Résoudre

## 1. Liens imbriqués `<Link><a>` causant des erreurs HTML

**Symptôme** : Erreur console "In HTML, `<a>` cannot be a descendant of `<a>`"

**Impact** : Empêche le rendu correct de certaines sections de pages (notamment la section Export CSV dans Admin.tsx)

**Fichiers corrigés** :
- ✅ `/client/src/components/Breadcrumbs.tsx` (lignes 178-186, 225-233)
- ✅ `/client/src/components/layout/Header.tsx` (lignes 191-201, 219-225)
- ✅ `/client/src/components/layout/Breadcrumb.tsx` (lignes 16-20, 26-30)
- ✅ `/client/src/components/DynamicBreadcrumb.tsx` (lignes 30-35, 51-55, 65-69)
- ✅ 18 fichiers dans `/pages/` corrigés automatiquement via script Python

**Fichiers restants à vérifier** :
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

## 2. Invalid Hook Call dans les composants d'export/import CSV

**Symptôme** : Erreur console "Invalid hook call. Hooks can only be called inside of the body of a function component"

**Impact** : Page `/admin/import-export` complètement blanche, composants non fonctionnels

**Composants affectés** :
- `/client/src/components/ExportCSVButton.tsx`
- `/client/src/components/ImportCSVDialog.tsx`

**Tentatives de correction** :
1. ✅ Réduction de 5 hooks `useQuery` à 1 seul basé sur `entityType`
2. ❌ Erreur persiste malgré la correction

**Hypothèses** :
- Possible conflit de versions React/React-DOM
- Possible duplication de React dans node_modules
- Problème de configuration tRPC

**Solution temporaire** :
- Intégration directe des hooks dans la page `AdminImportExport.tsx` au lieu d'utiliser des composants séparés
- ⚠️ Cette solution n'a pas résolu le problème non plus

**Prochaines étapes recommandées** :
1. Vérifier les versions de dépendances :
   ```bash
   npm ls react react-dom
   ```
2. Nettoyer et réinstaller les dépendances :
   ```bash
   rm -rf node_modules package-lock.json
   pnpm install
   ```
3. Vérifier la configuration tRPC dans `/client/src/lib/trpc.ts`
4. Ajouter un error boundary React pour isoler l'erreur

---

## 3. Section Export CSV invisible dans Admin.tsx

**Symptôme** : La section "Export des données" (lignes 373-467) n'apparaît pas dans le rendu de la page Admin

**Cause probable** : Erreur de liens imbriqués dans Breadcrumbs qui casse le rendu React

**Code présent mais non affiché** :
- Boutons d'export CSV pour les 5 entités
- Boutons d'import CSV pour les 5 entités
- Section complète avec cartes et descriptions

**Solution temporaire** : Création d'une page dédiée `/admin/import-export` (mais elle rencontre le bug #2)

---

## État actuel du projet

### ✅ Backend fonctionnel
- Endpoints tRPC pour export CSV (5 entités)
- Endpoints tRPC pour import CSV (5 entités)
- Utilitaires CSV robustes (`/server/csv-utils.ts`)
- 16 tests unitaires validés
- Table `modification_history` créée en base de données

### ❌ Frontend bloqué
- Composants Export/Import non fonctionnels
- Page `/admin/import-export` blanche
- Section Export dans `/admin` invisible

### 🔧 Recommandations
1. **Priorité haute** : Résoudre le bug "Invalid hook call" qui bloque toute l'interface
2. **Priorité moyenne** : Finaliser la correction des liens imbriqués dans les 7 fichiers restants
3. **Alternative** : Créer une interface d'export/import sans utiliser tRPC hooks (fetch direct)
