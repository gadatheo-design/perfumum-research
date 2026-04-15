# Plan de Corrections UX/UI — PERFUMUM

**Date** : 2 décembre 2025  
**Basé sur** : AUDIT_UX_UI.md

---

## 🎯 Corrections Haute Priorité

### 1. Simplifier la navigation (Header.tsx)

**Problème** : 13 liens dans le header, navigation surchargée et difficile à parcourir.

**Solution** : Regrouper en 4 catégories avec menu déroulant :

```
PERFUMUM | Recherche | [Données ▼] [Visualisations ▼] [Méthodologie ▼]
```

- **Données** : Prototypes, Familles, Chimie, Accords, Expérimental, Civilisations
- **Visualisations** : ABSORBE, Timeline, Installations
- **Méthodologie** : Le Projet, Laboratoire, Glossaire

**Fichier à modifier** : `client/src/components/layout/Header.tsx`

**Composant à utiliser** : `DropdownMenu` de shadcn/ui

---

### 2. Ajouter des breadcrumbs

**Problème** : Difficile de savoir où on est dans la hiérarchie, surtout sur les pages de détail.

**Solution** : Créer un composant `Breadcrumb.tsx` et l'ajouter sur toutes les pages de détail.

**Exemple** :
```
Home > Chimie > Familles Chimiques > Monoterpène > Limonène
```

**Fichier à créer** : `client/src/components/layout/Breadcrumb.tsx`

**Pages à modifier** :
- `client/src/pages/MoleculeDetail.tsx`
- `client/src/pages/RecetteDetail.tsx`
- `client/src/pages/CivilisationDetail.tsx`
- `client/src/pages/PrototypeDetail.tsx`

---

### 3. Harmoniser les cartes

**Problème** : Incohérence visuelle entre les cartes (bordures pointillées sur Home, ombres sur d'autres pages).

**Solution** : Choisir un style unique pour toutes les cartes :
- **Bordure** : `border border-border` (fine, solide)
- **Ombre** : `shadow-sm hover:shadow-md transition-shadow`
- **Padding** : `p-6`
- **Radius** : `rounded-lg`

**Fichiers à modifier** :
- `client/src/pages/Home.tsx` (supprimer les bordures pointillées)
- `client/src/pages/ChemicalFamilies.tsx`
- `client/src/pages/Civilisations.tsx`
- `client/src/pages/ExperimentalAccords.tsx`

**Classe à remplacer** : `border-dashed` → `border-solid` ou supprimer

---

### 4. Améliorer les hover effects

**Problème** : Pas de feedback visuel clair sur les éléments cliquables.

**Solution** : Ajouter des hover effects cohérents :
- **Cartes cliquables** : `hover:shadow-md hover:scale-[1.02] transition-all cursor-pointer`
- **Liens** : `hover:text-primary transition-colors`
- **Boutons** : Déjà gérés par shadcn/ui

**Fichiers à modifier** :
- `client/src/pages/ChemicalFamilies.tsx` (cartes molécules)
- `client/src/pages/Civilisations.tsx` (cartes civilisations)
- `client/src/pages/Home.tsx` (cartes de navigation)

---

## 📊 Corrections Moyenne Priorité

### 5. Améliorer les graphes React Flow

**Problème** : Nœuds trop petits, texte difficile à lire.

**Solution** :
- Augmenter la taille des nœuds : `p-4` → `p-6`
- Augmenter la taille du texte : `text-sm` → `text-base`
- Augmenter la taille de la légende

**Fichiers à modifier** :
- `client/src/pages/MoleculeDetail.tsx`
- `client/src/pages/RecetteDetail.tsx`
- `client/src/pages/CivilisationDetail.tsx`

---

### 6. Ajouter des états vides

**Problème** : Pas de message explicite quand aucune donnée.

**Solution** : Créer un composant `EmptyState.tsx` avec icône et message.

**Exemple** :
```tsx
<EmptyState
  icon={<Search className="h-12 w-12" />}
  title="Aucun résultat trouvé"
  description="Essayez avec un autre terme de recherche"
/>
```

**Fichier à créer** : `client/src/components/ui/EmptyState.tsx`

**Pages à modifier** :
- `client/src/pages/Recherche.tsx`
- `client/src/pages/ChemicalFamilies.tsx`
- `client/src/pages/Civilisations.tsx`

---

### 7. Améliorer le contraste

**Problème** : Certains textes en gris clair difficiles à lire.

**Solution** : Remplacer `text-muted-foreground` par `text-foreground/80` pour les textes importants.

**Fichiers à modifier** : Tous les fichiers utilisant `text-muted-foreground`

---

### 8. Ajouter des placeholders

**Problème** : Champs de recherche sans indication.

**Solution** : Ajouter des placeholders explicites.

**Exemple** :
```tsx
<Input
  placeholder="Rechercher dans toute la base de données..."
  value={query}
  onChange={(e) => setQuery(e.target.value)}
/>
```

**Fichiers à modifier** :
- `client/src/pages/Recherche.tsx`
- `client/src/pages/Glossaire.tsx`

---

## 🔧 Corrections Basse Priorité

### 9. Responsive

**À tester** :
- Navigation mobile (menu hamburger ?)
- Graphes React Flow sur tablette
- Cartes en grid responsive

**Fichiers à modifier** : Tous les fichiers avec des grids et des layouts complexes

---

### 10. Accessibilité

**À ajouter** :
- Alt text sur les images
- Focus visible sur les éléments interactifs (`focus:ring-2 focus:ring-primary`)
- ARIA labels sur les boutons sans texte
- Contraste WCAG AA minimum

**Fichiers à modifier** : Tous les fichiers

---

## 📝 Ordre d'implémentation recommandé

1. **Harmoniser les cartes** (30 min) — Impact visuel immédiat
2. **Améliorer les hover effects** (20 min) — Meilleure UX
3. **Ajouter des placeholders** (10 min) — Quick win
4. **Simplifier la navigation** (1h) — Nécessite création de DropdownMenu
5. **Ajouter des breadcrumbs** (1h) — Nécessite création de composant
6. **Améliorer les graphes** (30 min) — Meilleure lisibilité
7. **Ajouter des états vides** (30 min) — Meilleure UX
8. **Améliorer le contraste** (20 min) — Accessibilité
9. **Responsive** (2h) — Tests et ajustements
10. **Accessibilité complète** (2h) — Alt text, ARIA, focus

**Total estimé** : ~8 heures de développement

---

## 🎨 Système de design à respecter

### Couleurs
- **Primary** : `#8b5cf6` (violet)
- **Background** : `#ffffff` (clair) / `#0a0a0a` (sombre)
- **Foreground** : `#0a0a0a` (clair) / `#fafafa` (sombre)
- **Muted** : `#f4f4f5` (clair) / `#27272a` (sombre)
- **Border** : `#e4e4e7` (clair) / `#3f3f46` (sombre)

### Typographie
- **Titres** : `font-bold tracking-tight`
- **Sous-titres** : `font-semibold`
- **Corps** : `font-normal`
- **Tailles** : `text-4xl` (h1), `text-3xl` (h2), `text-2xl` (h3), `text-xl` (h4), `text-base` (p)

### Espacements
- **Sections** : `py-16`
- **Cartes** : `p-6`
- **Grids** : `gap-6`
- **Stacks** : `space-y-4`

### Composants
- **Cartes** : `Card` de shadcn/ui
- **Boutons** : `Button` de shadcn/ui
- **Badges** : `Badge` de shadcn/ui
- **Inputs** : `Input` de shadcn/ui

---

## ✅ Checklist de validation

Après chaque correction, vérifier :
- [ ] Le design est cohérent avec le reste du site
- [ ] Les hover effects fonctionnent
- [ ] Les liens sont cliquables
- [ ] Le responsive est OK (desktop + mobile)
- [ ] L'accessibilité est respectée (contraste, focus, alt text)
- [ ] Les performances sont bonnes (pas de lag)
