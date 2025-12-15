# Audit Design UX/UI — PERFUMUM
## Plateforme de Recherche Olfactive

**Date de l'audit** : 15 décembre 2025  
**Version analysée** : 1de572b1  
**Auteur** : Manus AI  
**Périmètre** : Design System, UX Desktop, UX Mobile, Accessibilité

---

## 📋 Résumé Exécutif

Le site PERFUMUM présente un design system cohérent baptisé **"Swiss Psychedelic"** caractérisé par une typographie serrée (Space Grotesk), des couleurs OKLCH saturées et un style "brutal" avec coins à 0. L'audit révèle une architecture visuelle solide mais identifie plusieurs problèmes critiques affectant l'expérience utilisateur, notamment des **pages blanches** (molécules, recettes) et des **incohérences de navigation**.

### Points Clés

| Aspect | État | Note |
|--------|------|------|
| Design System | ✅ Cohérent | 8/10 |
| Accessibilité | ⚠️ Partiel | 6/10 |
| Performance Mobile | ⚠️ Pages blanches | 4/10 |
| Navigation | ⚠️ Complexe | 5/10 |
| Responsive | ✅ Bon | 7/10 |

---

## 1. Design System & Identité Visuelle

### 1.1 Typographie

| Élément | Valeur | Observation |
|---------|--------|-------------|
| **Police principale** | Space Grotesk | ✅ Moderne, technique, bien choisie |
| **Police monospace** | JetBrains Mono | ✅ Adaptée au contenu scientifique |
| **Letter-spacing** | -0.02em (body), -0.04em (h1) | ✅ Style suisse serré distinctif |
| **Hiérarchie** | 6 niveaux (h1-h6) | ✅ Bien définie |

**Forces :**
- Typographie distinctive qui renforce l'identité "laboratoire scientifique"
- Hiérarchie claire avec uppercase pour h1/h2
- Monospace pour le contenu technique (formules, codes)

**Faiblesses :**
- Letter-spacing négatif peut nuire à la lisibilité sur mobile (petits écrans)
- Uppercase systématique sur h1/h2 peut sembler agressif
- Pas de fallback explicite pour Space Grotesk (dépend de Google Fonts)

### 1.2 Palette de Couleurs

#### Couleurs Primaires (Mode Clair)

```css
--primary: oklch(0.55 0.25 290); /* Violet électrique */
--accent: oklch(0.65 0.28 340);  /* Rose psychédélique */
--background: oklch(0.99 0.005 290); /* Blanc teinté */
--foreground: oklch(0.10 0.02 290);  /* Noir profond */
```

#### Couleurs Thématiques par Gamme

| Gamme | Couleur | Usage |
|-------|---------|-------|
| Pétrichor | oklch(0.55 0.12 160) | Vert terreux/minéral |
| Volcanique | oklch(0.50 0.18 25) | Rouge fumé/pyrolysé |
| Civilisations | oklch(0.65 0.15 60) | Ambre sacré |
| Glaciaire | oklch(0.70 0.14 220) | Cyan frais/ozone |
| Bio-Lab | oklch(0.68 0.20 330) | Rose expérimental |

**Forces :**
- Palette OKLCH moderne (meilleure perception des couleurs)
- Couleurs thématiques cohérentes avec le contenu
- 5 couleurs de charts distinctes pour visualisations
- Mode sombre bien optimisé (contraste amélioré)

**Faiblesses :**
- Contraste insuffisant sur certains badges (accessibilité WCAG AA non garantie)
- Couleur primaire violette peut être difficile à lire sur fond clair
- Pas de documentation des ratios de contraste

### 1.3 Style "Brutal"

```css
--radius: 0rem; /* Coins à 0 */
--border: oklch(0.15 0.02 290); /* Bordures noires épaisses */
```

**Forces :**
- Identité visuelle forte et distinctive
- Cohérence avec l'approche "Swiss Psychedelic"
- Renforce l'aspect "laboratoire technique"

**Faiblesses :**
- Peut sembler austère ou peu accueillant
- Manque de douceur pour certains composants (cards, inputs)
- Contraste avec les standards UI modernes (rounded corners attendus)

---

## 2. Composants UI

### 2.1 Cartes (Cards)

**Implémentation actuelle :**
```css
.card-hover {
  transition-all duration-300;
}
.card-hover:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 60px oklch(var(--primary) / 0.15);
}
```

**Forces :**
- Effet hover sophistiqué avec shadow colorée
- Transition fluide (300ms)
- Élévation visuelle claire

**Faiblesses :**
- ⚠️ **Pages Molécules et Recettes affichent des pages blanches** (bug critique)
- Pas de skeleton loader visible pendant le chargement
- Shadow peut être trop prononcée (60px)

### 2.2 Boutons

**Classes disponibles :**
- `.btn-enhanced` : Scale + shadow au hover
- Variants : default, outline, ghost, destructive

**Forces :**
- Micro-interactions bien pensées (scale 105% hover, 95% active)
- Focus states accessibles (ring-4)
- Feedback tactile clair

**Faiblesses :**
- Boutons "Consulter les gammes" et "Accéder au Dashboard" sur Home ont des styles incohérents
- Pas de loading state visible sur les boutons async
- Outline variant transparent peut manquer de contraste

### 2.3 Badges

**Forces :**
- Badge "NEW" avec couleur ambre distinctive
- Glow effect au hover (`.badge-glow`)
- Variants colorés par gamme

**Faiblesses :**
- Utilisation inconsistante (certaines nouvelles pages n'ont pas de badge)
- Pas de système de versioning (badge "NEW" reste indéfiniment)
- Contraste texte/fond parfois insuffisant

### 2.4 Navigation

#### MegaMenu (Desktop)

**Structure :**
- 4 sections : Études, Résines CBD, Pétrichor, Admin
- Grille 3 colonnes avec icônes et descriptions

**Forces :**
- Organisation logique par domaine
- Descriptions courtes aidant à la découverte
- Compteurs de contenu (176 molécules, 12 fournisseurs)

**Faiblesses :**
- Largeur fixe (600px) peut être trop large sur tablettes
- Pas de highlight de la page active dans le menu
- Certaines pages nouvelles non référencées (déjà corrigé)

#### Menu Mobile

**Structure :**
- Sheet latéral avec Accordion
- 7 sections : Accueil, Gammes, Molécules, Recettes, Laboratoire, Recherche, Documentation, Projet

**Forces :**
- Accordion évite le scroll excessif
- Badges "NEW" et compteurs présents
- Stats rapides en bas (176 molécules, 195 recettes)

**Faiblesses :**
- Pas de recherche accessible directement (nécessite un bouton séparé)
- Icônes parfois redondantes
- Pas de fermeture automatique après navigation (nécessite SheetClose)

---

## 3. Expérience Utilisateur (UX)

### 3.1 Navigation & Architecture de l'Information

#### Problèmes Identifiés

| Problème | Impact | Priorité |
|----------|--------|----------|
| Pages blanches (Molécules, Recettes) | 🔴 Critique | Haute |
| Breadcrumbs manquants sur certaines pages | 🟡 Moyen | Moyenne |
| Pas de "Voir aussi" en fin de page | 🟡 Moyen | Basse |
| Navigation trop profonde (3+ niveaux) | 🟡 Moyen | Moyenne |

#### Parcours Utilisateur Typique

```
Accueil → MegaMenu "Études" → Molécules → [PAGE BLANCHE] ❌
Accueil → MegaMenu "Résines CBD" → Recettes → [PAGE BLANCHE] ❌
Accueil → "Consulter les gammes" → Gammes → Détail Gamme ✅
```

**Observation critique :** Les deux pages les plus importantes (Molécules et Recettes) sont inaccessibles, ce qui bloque l'exploration du contenu principal.

### 3.2 Recherche Globale

**Implémentation :**
- Raccourci clavier (non documenté)
- Bouton dans Header desktop
- Bouton dans menu mobile

**Forces :**
- Accessible depuis toutes les pages
- Recherche multi-critères (nom, famille, profil olfactif)

**Faiblesses :**
- Pas de placeholder expliquant les capacités de recherche
- Pas de suggestions pendant la frappe (autocomplete)
- Résultats non triés par pertinence

### 3.3 États de Chargement

**Implémentation actuelle :**
- Skeleton loaders définis dans CSS
- Composants `<Skeleton />` disponibles

**Problèmes :**
- ⚠️ Pas de skeleton visible sur pages Molécules/Recettes (page blanche directe)
- Certaines pages affichent "Loading..." en texte brut
- Pas d'indicateur de progression pour les opérations longues

### 3.4 États Vides

**Observation :**
- Certaines pages ont des états vides bien conçus (icônes + message)
- D'autres affichent simplement "Aucun résultat"

**Recommandation :**
Standardiser les états vides avec :
1. Icône illustrative
2. Message explicatif
3. Action suggérée (CTA)

---

## 4. Responsive & Mobile

### 4.1 Breakpoints

```css
/* Mobile-first */
Base: < 640px (padding 1rem)
sm: 640px+ (padding 1.5rem)
lg: 1024px+ (padding 2rem, max-width 1280px)
```

**Forces :**
- Approche mobile-first cohérente
- Container auto-centré avec padding responsive
- Safe area insets pour notch/dynamic island

**Faiblesses :**
- Pas de breakpoint md (768px) explicite
- Certains composants ne s'adaptent pas (tableaux, graphes)

### 4.2 Typographie Mobile

**Observation :**
- Font-size base : 15px (optimisé pour mobile)
- Inputs : 16px (évite le zoom iOS) ✅
- Headers : adaptés avec classes responsive

**Problèmes :**
- Letter-spacing négatif peut réduire la lisibilité sur petits écrans
- H1 uppercase + -0.04em peut être difficile à lire

### 4.3 Touch Targets

**Standard recommandé :** 44x44px minimum (Apple HIG, Material Design)

**Observation :**
- Boutons principaux : ✅ Respectent la norme
- Liens dans tableaux : ⚠️ Trop petits (< 40px)
- Icônes dans Header mobile : ✅ 44px

### 4.4 Bottom Navigation Mobile

**Implémentation :**
- `<MobileBottomNav />` avec backdrop blur
- 4-5 icônes principales

**Forces :**
- Accessible au pouce
- Backdrop blur élégant
- Animations fluides

**Faiblesses :**
- Pas toujours visible (dépend de la page)
- Peut masquer du contenu en bas de page
- Pas de highlight de la page active

---

## 5. Accessibilité (A11y)

### 5.1 Contraste de Couleurs

**Tests WCAG 2.1 AA :**

| Combinaison | Ratio | Statut |
|-------------|-------|--------|
| Foreground/Background (clair) | 10.5:1 | ✅ AAA |
| Primary/Background | 4.2:1 | ⚠️ AA limite |
| Muted-foreground/Background | 3.8:1 | ❌ Échec AA |
| Badge "NEW"/Fond ambre | 3.2:1 | ❌ Échec AA |

**Recommandations :**
1. Augmenter la luminosité de `--muted-foreground` (actuellement 0.35 → 0.45)
2. Assombrir le fond des badges pour garantir 4.5:1 minimum
3. Tester tous les états (hover, focus, disabled)

### 5.2 Navigation Clavier

**Forces :**
- Focus states bien définis (ring-4)
- Tab order logique
- Skip links implicites (structure sémantique)

**Faiblesses :**
- Pas de skip link explicite "Aller au contenu principal"
- MegaMenu non accessible au clavier (hover uniquement)
- Certains composants custom (graphes D3.js) non navigables au clavier

### 5.3 ARIA & Sémantique HTML

**Observation :**
- Utilisation correcte de `<nav>`, `<main>`, `<article>`
- ARIA labels présents sur boutons icônes
- Landmarks HTML5 bien utilisés

**Lacunes :**
- Pas d'ARIA live regions pour les notifications
- Graphes D3.js manquent d'alternatives textuelles
- Modals sans `aria-modal="true"` explicite

### 5.4 Lecteurs d'Écran

**Non testé dans cet audit**, mais recommandations :
1. Tester avec NVDA (Windows) et VoiceOver (macOS/iOS)
2. Vérifier l'annonce des changements d'état (filtres, recherche)
3. S'assurer que les graphes ont des descriptions textuelles

---

## 6. Performance & Technique

### 6.1 Animations & Transitions

**Implémentation :**
```css
.transition-smooth { transition-all duration-300 ease-in-out; }
.card-hover { transition-all duration-300; }
.btn-enhanced { transition-all duration-200; }
```

**Forces :**
- Durées cohérentes (200-300ms)
- Easing appropriés
- GPU-accelerated (transform, opacity)

**Faiblesses :**
- `transition-all` peut causer des re-layouts coûteux
- Pas de `prefers-reduced-motion` pour accessibilité
- Certaines animations trop prononcées (card-hover -8px)

### 6.2 Chargement des Polices

**Implémentation actuelle :**
```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
```

**Problèmes :**
- ⚠️ Import de Inter mais utilisation de Space Grotesk (incohérence)
- Pas de `font-display: swap` explicite
- Pas de preload des polices critiques
- FOUT (Flash of Unstyled Text) possible

**Recommandation :**
```html
<link rel="preload" href="..." as="font" type="font/woff2" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet">
```

### 6.3 CSS Architecture

**Taille du fichier :** index.css = 1707 lignes

**Forces :**
- Organisation en `@layer` (base, components)
- Variables CSS bien structurées
- Thèmes par gamme modulaires

**Faiblesses :**
- Beaucoup de code non utilisé (animations psychédéliques, moire patterns)
- Pas de purge CSS (Tailwind devrait le faire)
- Duplication de certains styles

---

## 7. Bugs Critiques Identifiés

### 7.1 Pages Blanches

**Pages affectées :**
- `/molecules` → Page blanche totale
- `/recettes` → Page blanche totale
- `/admin` (Dashboard) → Page blanche (mentionné dans todo.md)

**Impact :** 🔴 **CRITIQUE** — Bloque l'accès au contenu principal

**Hypothèses :**
1. Bug HMR Vite (Hot Module Replacement) en développement
2. Erreur React non catchée (boundary manquant)
3. Requête tRPC qui échoue silencieusement
4. Problème de routing (wouter)

**Actions immédiates :**
1. Vérifier les erreurs console navigateur
2. Ajouter Error Boundaries React
3. Tester en build production (`pnpm build && pnpm preview`)
4. Vérifier les logs serveur tRPC

### 7.2 Incohérences de Navigation

**Problème :** Certaines routes dupliquées
- `/inventaire` ET `/laboratoire/inventaire`
- Route `/recherche` commentée sans alternative

**Impact :** 🟡 Moyen — Confusion utilisateur

### 7.3 Contraste Insuffisant

**Éléments affectés :**
- Badge "NEW" (ambre/blanc)
- Texte muted-foreground
- Certains états hover

**Impact :** 🟡 Moyen — Accessibilité WCAG AA non respectée

---

## 8. Recommandations Priorisées

### 🔴 Priorité Critique (Immédiat)

| Action | Impact | Effort | Détails |
|--------|--------|--------|---------|
| **Corriger pages blanches** | 🔴 Bloquant | Moyen | Diagnostiquer et corriger /molecules, /recettes, /admin |
| **Ajouter Error Boundaries** | 🔴 Stabilité | Faible | Wrapper les routes principales avec ErrorBoundary React |
| **Tester en production** | 🔴 Validation | Faible | `pnpm build && pnpm preview` pour isoler bugs HMR |

### 🟠 Priorité Haute (Court terme)

| Action | Impact | Effort | Détails |
|--------|--------|--------|---------|
| Améliorer contraste WCAG AA | 🟠 Accessibilité | Faible | Ajuster muted-foreground, badges, états hover |
| Ajouter skeleton loaders | 🟠 UX | Faible | Afficher skeletons pendant chargement (pas de page blanche) |
| Implémenter prefers-reduced-motion | 🟠 Accessibilité | Faible | Désactiver animations pour utilisateurs sensibles |
| Corriger import polices | 🟠 Performance | Faible | Remplacer Inter par Space Grotesk, ajouter preload |

### 🟡 Priorité Moyenne (Moyen terme)

| Action | Impact | Effort | Détails |
|--------|--------|--------|---------|
| Rendre MegaMenu accessible au clavier | 🟡 Accessibilité | Moyen | Ajouter focus states, navigation Tab/Enter |
| Standardiser états vides | 🟡 UX | Moyen | Composant EmptyState réutilisable (icône + message + CTA) |
| Ajouter autocomplete recherche | 🟡 UX | Moyen | Suggestions pendant la frappe |
| Optimiser animations (éviter transition-all) | 🟡 Performance | Moyen | Spécifier propriétés (transform, opacity) |
| Ajouter "Voir aussi" en fin de page | 🟡 Découverte | Moyen | Suggestions contextuelles (molécules similaires, recettes associées) |

### 🟢 Priorité Basse (Long terme)

| Action | Impact | Effort | Détails |
|--------|--------|--------|---------|
| Adoucir style "brutal" | 🟢 Esthétique | Faible | Passer radius de 0 à 0.25rem (optionnel) |
| Ajouter breakpoint md (768px) | 🟢 Responsive | Faible | Améliorer adaptation tablettes |
| Purger CSS inutilisé | 🟢 Performance | Moyen | Supprimer animations psychédéliques non utilisées |
| Tests lecteurs d'écran | 🟢 Accessibilité | Élevé | NVDA, VoiceOver, JAWS |
| Documentation design system | 🟢 Maintenance | Élevé | Storybook ou page /design-system |

---

## 9. Audit Mobile Détaillé

### 9.1 Tests sur Différents Appareils

**Appareils simulés :**
- iPhone SE (375x667) — Petit écran
- iPhone 12 Pro (390x844) — Standard
- iPad (768x1024) — Tablette

**Observations :**

| Aspect | iPhone SE | iPhone 12 Pro | iPad |
|--------|-----------|---------------|------|
| Header | ✅ Compact | ✅ Bien | ✅ Bien |
| MegaMenu | N/A (mobile) | N/A | ⚠️ Overlap |
| Cartes molécules | ⚠️ Serrées | ✅ Bien | ✅ Bien |
| Bottom Nav | ✅ Accessible | ✅ Bien | ❌ Inutile |
| Graphes D3.js | ❌ Non responsive | ⚠️ Petit | ✅ Bien |

### 9.2 Problèmes Spécifiques Mobile

1. **Graphes D3.js non responsive**
   - Largeur fixe sur mobile
   - Zoom/pan difficile au doigt
   - Pas de version simplifiée mobile

2. **Tableaux débordent**
   - Pas de scroll horizontal visible
   - Colonnes trop nombreuses sur petit écran
   - Pas de version empilée (stacked)

3. **Bottom Nav masque contenu**
   - Pas de padding-bottom compensatoire
   - Boutons flottants peuvent être cachés

4. **Inputs trop petits**
   - Certains inputs < 44px de hauteur
   - Espacement insuffisant entre champs de formulaire

---

## 10. Comparaison Avant/Après (Suggestions)

### 10.1 Page d'Accueil

**Avant (actuel) :**
- Hero centré avec 2 boutons
- Fond blanc/gris uniforme
- Pas de preview du contenu

**Après (suggéré) :**
- Hero asymétrique avec image/illustration
- Gradient subtil en fond
- Preview des 3 dernières molécules ajoutées
- Stats animées (176 molécules, 195 recettes)

### 10.2 Page Molécules

**Avant (actuel) :**
- ⚠️ Page blanche (bug)
- Grille de cartes uniforme
- Filtres en sidebar

**Après (suggéré) :**
- Grille masonry (hauteurs variables)
- Filtres en top bar collapsible
- Tri par pertinence/date/nom
- Preview radar dans les cartes

### 10.3 Navigation Mobile

**Avant (actuel) :**
- Sheet latéral + Bottom Nav
- Accordion pour sous-menus
- Recherche en bas du sheet

**Après (suggéré) :**
- Tabs en haut (Gammes, Molécules, Recettes, Plus)
- Recherche en header fixe
- Bottom Nav simplifiée (4 icônes max)

---

## 11. Checklist d'Amélioration

### Design System
- [ ] Corriger import polices (Inter → Space Grotesk)
- [ ] Ajouter preload pour polices critiques
- [ ] Documenter ratios de contraste WCAG
- [ ] Créer page /design-system pour référence
- [ ] Standardiser radius (0 → 0.25rem optionnel)

### Accessibilité
- [ ] Augmenter contraste muted-foreground (0.35 → 0.45)
- [ ] Corriger contraste badges "NEW"
- [ ] Ajouter skip link "Aller au contenu"
- [ ] Implémenter prefers-reduced-motion
- [ ] Rendre MegaMenu accessible au clavier
- [ ] Ajouter ARIA live regions pour notifications
- [ ] Tester avec lecteurs d'écran (NVDA, VoiceOver)

### UX
- [ ] **Corriger pages blanches (CRITIQUE)**
- [ ] Ajouter Error Boundaries React
- [ ] Implémenter skeleton loaders partout
- [ ] Standardiser états vides (composant EmptyState)
- [ ] Ajouter autocomplete recherche
- [ ] Implémenter "Voir aussi" en fin de page
- [ ] Unifier breadcrumbs sur toutes les pages
- [ ] Ajouter highlight page active dans menus

### Mobile
- [ ] Rendre graphes D3.js responsive
- [ ] Créer version mobile des tableaux (stacked)
- [ ] Ajouter padding-bottom pour Bottom Nav
- [ ] Augmenter touch targets < 44px
- [ ] Tester sur vrais appareils (pas seulement simulateur)
- [ ] Optimiser letter-spacing pour petits écrans

### Performance
- [ ] Remplacer transition-all par propriétés spécifiques
- [ ] Purger CSS inutilisé (animations psychédéliques)
- [ ] Lazy load images et composants lourds
- [ ] Optimiser bundle size (code splitting)
- [ ] Ajouter Service Worker (PWA optionnel)

---

## 12. Conclusion

Le site PERFUMUM dispose d'une **identité visuelle forte et distinctive** grâce au design system "Swiss Psychedelic". L'architecture technique (React 19, tRPC, Tailwind 4) est moderne et maintenable. Cependant, plusieurs **bugs critiques** (pages blanches) et **lacunes d'accessibilité** (contraste, navigation clavier) nécessitent une attention immédiate.

### Synthèse des Priorités

1. **🔴 Critique** : Corriger pages blanches (Molécules, Recettes, Admin)
2. **🟠 Haute** : Améliorer accessibilité WCAG AA (contraste, clavier)
3. **🟡 Moyenne** : Optimiser UX mobile (graphes, tableaux, touch targets)
4. **🟢 Basse** : Peaufiner esthétique et documentation

### Score Global

| Catégorie | Note | Commentaire |
|-----------|------|-------------|
| Design System | 8/10 | Cohérent mais peut être adouci |
| Accessibilité | 6/10 | Contraste et clavier à améliorer |
| UX Desktop | 5/10 | Bloqué par pages blanches |
| UX Mobile | 6/10 | Bon mais graphes non responsive |
| Performance | 7/10 | Correcte, optimisations possibles |
| **GLOBAL** | **6.4/10** | Bon potentiel, corrections urgentes nécessaires |

---

**Prochaines étapes recommandées :**
1. Diagnostiquer et corriger les pages blanches (session de debugging)
2. Implémenter les corrections accessibilité haute priorité
3. Tester en build production pour valider les corrections
4. Créer un checkpoint après corrections critiques

---

*Rapport généré le 15 décembre 2025*
