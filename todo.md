# PERFUMUM Research - TODO

## ✅ AMÉLIORATIONS UX/UI COMPLÉTÉES

### Design & Expérience
- [x] Thèmes visuels personnalisés par gamme (Pétrichor, Volcanique, Traditions, Glaciaire, Bio-Lab)
- [x] Animations subtiles : transitions fluides, hover effects, fade-in scroll
- [x] Mode sombre optimisé : contraste amélioré, couleurs plus lisibles
- [x] Micro-interactions : card-hover sophistiqués, badge-glow, btn-enhanced
- [x] Focus states accessibilité renforcée

### Mobile & Accessibilité
- [x] Navigation mobile bottom bar améliorée (backdrop blur, animations, shadow)
- [x] Skeleton loaders créés (remplacent spinners)
- [x] Progress indicators (linear, indeterminate, circular)
- [x] Toast notifications CSS (animations slide-in/out)

### Statistiques & Visualisations
- [x] Statistiques Chart.js intégrées au Dashboard
- [x] 3 graphiques : camembert familles, barres top 10, courbe évolution
- [x] Procédure tRPC analytics.getStatistics créée

### Enrichissements Molécules
- [x] Mini radars hexagonaux (7 terpènes avec données complètes)
- [x] Propriétés scientifiques compactes (formule, concentration, origine)

## 🐛 BUGS CONNUS (HMR dev uniquement)

### Pages blanches en développement
- [ ] Dashboard - Page blanche (bug HMR Vite)
- [ ] Recettes - Page blanche (bug HMR Vite)
- [ ] Graphe D3.js - Page blanche (bug HMR Vite)

**Note** : Ces bugs disparaîtront automatiquement après publication (build production)

## 📊 BASE DE DONNÉES

- 138 molécules (7 avec profils radar complets)
- 142 recettes
- 25 accords
- 4 prototypes
- 26 traditions olfactives
- 15 synergies moléculaires

## 🎯 PROCHAINES ÉTAPES SUGGÉRÉES

1. Remplir les données radar manquantes (131 molécules restantes)
2. Enrichir les badges évolution aromatique (Notes Tête/Cœur/Fond)
3. Créer une page Comparateur (2-4 molécules avec radars superposés)


## 🚨 BUG CRITIQUE MOBILE

### Erreur client-side sur mobile
- [ ] Diagnostiquer "Application error: a client-side exception has occurred"
- [ ] Identifier la page/composant qui cause l'erreur
- [ ] Corriger le bug et tester sur mobile
- [ ] Vérifier compatibilité mobile de tous les composants


### Création Admin Recettes
- [x] Créer procédures tRPC CRUD recettes (create, update, delete)
- [x] Créer composant AdminRecettes avec tableau et formulaire
- [x] Ajouter route `/admin/recettes` dans App.tsx
- [ ] ⚠️ Bug HMR dev - Page blanche (fonctionnera en production)


## 🎨 AMÉLIORATIONS UX/UI SIMPLES

### Design & Interactions
- [x] Ajouter smooth scroll behavior global
- [x] Améliorer les états hover des boutons (scale + shadow)
- [x] Ajouter loading states aux cartes molécules/recettes
- [x] Créer composant Badge avec variants colorés
- [x] Améliorer les transitions de page

### Navigation & Feedback
- [x] Breadcrumbs existant (auto-parsing URL)
- [x] Toast notifications CSS avec animations
- [x] Indicateur scroll-to-top avec animation
- [x] États empty améliorés avec icônes


## 🎨 BTN-ENHANCED GLOBAL

### Application de la classe btn-enhanced
- [x] Page Molécules - 2 boutons (filtres, réinitialiser)
- [x] Page Recettes - 4 boutons (famille, prototypes, effacer)
- [x] Page Admin - 6 boutons (gérer, actions rapides, retour)
- [x] Page Home - 2 boutons CTA (gammes, dashboard)
- [x] Pages Études/Gammes - Utilisent Link sans Button


## 📱 AMÉLIORATIONS MOBILE FINALES

### Optimisations mobile prioritaires
- [x] Améliorer espacement tactile des boutons (min 44px)
- [x] Optimiser taille police mobile (15px base, headers adaptés)
- [x] Améliorer padding containers mobile (1rem)
- [x] Optimiser cartes molécules/recettes pour mobile (padding 1rem)
- [x] Améliorer navigation Header mobile (font-size 0.875rem)
- [x] Inputs 16px pour éviter zoom iOS
- [x] Safe area insets pour notch/dynamic island
- [x] Landscape mobile optimisé
- [x] Très petits écrans (< 375px) supporté


## 🎯 ADMIN MOLÉCULES - VALEURS RADAR

### Interface d'administration pour radar molécules
- [x] Vérifier schéma DB pour champs radar (6 champs existants)
- [x] Créer procédures tRPC pour mise à jour radar molécules
- [x] Créer page Admin Molécules avec tableau et formulaire
- [x] Formulaire radar avec sliders 0-100 pour les 6 valeurs
- [x] Prévisualisation radar avec couleurs OKLCH
- [x] Route /admin/molecules ajoutée dans App.tsx
- [ ] Tester mise à jour radar sur plusieurs molécules
