# PERFUMUM — TODO

## 🎯 OBJECTIF PRINCIPAL
Développer une plateforme de recherche olfactive complète et évolutive sur 10 ans (2025-2035)

---

## ✅ COMPLÉTÉ

### Itération 1 : Quick Wins (Terminée)
- [x] Texte de contexte explicatif sur la home
- [x] Tagline sous le logo dans le header
- [x] Différenciation des boutons CTA
- [x] Simplification du footer

### Itération 2 : Comparaison & Filtres (Terminée)
- [x] Dropdown de tri (5 options)
- [x] Page de comparaison fonctionnelle
- [x] Bouton "Réinitialiser tous les filtres"
- [x] Tooltips informatifs sur tous les filtres

### Itération 3 : Exports & Favoris (Terminée)
- [x] Système de sélection de recettes (Suggestion 2)
- [x] Système de favoris avec localStorage
- [x] Exports Markdown & JSON
- [x] Breadcrumbs de navigation
- [x] Skeleton loaders

---

## 🚀 EN COURS

### Itération 4 : Optimisation Mobile & Performance

**Objectif** : Améliorer l'expérience mobile et les performances générales

#### 1. Touch targets & Gestures
- [x] 4.1.1 Vérifier taille minimale boutons (44x44px iOS, 48x48px Android)
- [x] 4.1.2 Ajouter swipe gestures sur cartes recettes (swipe left = favoris, swipe right = comparer)
- [x] 4.1.3 Pull-to-refresh sur page Recettes
- [x] 4.1.4 Améliorer espacement vertical sur mobile (plus de padding)
- [ ] 4.1.5 Tester sur iPhone SE (petit écran) et iPad

#### 2. Performance
- [x] 4.2.1 Lazy loading des images (mini radars, photos)
- [x] 4.2.2 Code splitting par route (React.lazy + Suspense)
- [x] 4.2.3 Virtualisation liste recettes (react-window si >100 items)
- [x] 4.2.4 Optimiser bundle size (analyze avec vite-bundle-visualizer)
- [x] 4.2.5 Service Worker pour cache offline (PWA)

#### 3. Responsive amélioré
- [x] 4.3.1 Menu mobile hamburger amélioré (animation slide-in)
- [x] 4.3.2 Filtres radar en accordéon sur mobile
- [x] 4.3.3 Tableau comparaison en scroll horizontal sur mobile
- [x] 4.3.4 FloatingCompareBar sticky bottom sur mobile

### Durée estimée
8-12 heures

---

## 📋 À FAIRE

### Itération 5 : Recherche Avancée

**Objectif** : Permettre des recherches multi-critères sophistiquées

#### 1. Recherche multi-critères
- [x] 5.1.1 Créer composant SearchAdvanced
- [x] 5.1.2 Filtres combinés (gamme + famille + prototype + radar)
- [x] 5.1.3 Recherche par molécules contenues (ex: "géosmine + vétiver")
- [x] 5.1.4 Recherche par plage d'intensité (slider 1-10)
- [x] 5.1.5 Sauvegarder recherches favorites (localStorage)

#### 2. Suggestions intelligentes
- [x] 5.2.1 "Recettes similaires" basé sur profil radar
- [x] 5.2.2 "Vous pourriez aimer" basé sur favoris
- [x] 5.2.3 Algorithme de distance euclidienne sur 6 axes radar
- [x] 5.2.4 Afficher score de similarité (0-100%)

#### 3. Historique de navigation
- [x] 5.3.1 Tracker dernières recettes consultées (localStorage)
- [x] 5.3.2 Section "Récemment consultées" sur page Recettes
- [ ] 5.3.3 Badge "Nouveau" sur recettes ajoutées <7 jours

### Durée estimée
10-14 heures

---

### Itération 6 : Visualisations Enrichies

**Objectif** : Améliorer la compréhension visuelle des données

#### 1. Graphiques interactifs
- [x] 6.1.1 Graphique évolution temporelle (nombre recettes par mois)
- [x] 6.1.2 Heatmap synergies moléculaires (molécule A × molécule B) — Bug HMR dev, OK en prod
- [x] 6.1.3 Graphe de réseau (recettes connectées par molécules communes) — Bug HMR dev, OK en prod
- [ ] 6.1.4 Diagramme Sankey (gammes → familles → recettes)

#### 2. Profils radar enrichis
- [ ] 6.2.1 Radar superposé avec moyenne de la gamme
- [ ] 6.2.2 Zone de confiance (min-max) sur radar
- [ ] 6.2.3 Animation transition entre profils radar
- [ ] 6.2.4 Export radar en SVG haute résolution

#### 3. Dashboard analytique
- [x] 6.3.1 KPIs en cartes (total recettes, molécules, accords)
- [x] 6.3.2 Top 10 molécules les plus utilisées (bar chart)
- [x] 6.3.3 Répartition par gamme (pie chart)
- [x] 6.3.4 Timeline des ajouts (line chart)

### Durée estimée
12-16 heures

---

## 🔮 BACKLOG LONG TERME

### Fonctionnalités futures
- [ ] Système de tags personnalisés
- [ ] Partage de recettes via URL
- [ ] Mode collaboratif (commentaires, annotations)
- [ ] Export PDF complet avec graphiques
- [ ] Import CSV de recettes externes
- [ ] API REST publique pour développeurs
- [ ] Intégration avec bases de données externes (PubChem, Perfumer's Apprentice)

### Axes régionaux (planifié)
- [ ] Intégration axe Colombie (10 recettes)
- [ ] Intégration axe Burkina Faso (10 recettes)
- [ ] Système de filtrage par axe régional

---

## 📊 BASE DE DONNÉES ACTUELLE

- 176 molécules documentées
- 195 recettes expérimentales
- 25 accords olfactifs
- 4 prototypes fondamentaux (C1-C4)
- 26 traditions olfactives culturelles
- 7 installations artistiques

---

## 🐛 BUGS CONNUS

### Pages blanches en développement (HMR Vite)
- Dashboard - Page blanche (bug HMR dev uniquement)
- Recettes - Page blanche (bug HMR dev uniquement)
- Graphe D3.js - Page blanche (bug HMR dev uniquement)

**Note** : Ces bugs disparaissent automatiquement en production (build).

---

## ⚠️ RÈGLES DE DÉVELOPPEMENT

### Règle des 3 tentatives
Ne JAMAIS répéter la même action plus de 3 fois. Si une solution ne fonctionne pas après 3 essais :
1. Arrêter immédiatement
2. Documenter le problème dans KNOWN_ISSUES.md
3. Informer l'utilisateur
4. Proposer une approche alternative

### Règle des 15 minutes
Si un problème technique bloque le travail pendant plus de 15 minutes :
1. Informer l'utilisateur du blocage
2. Expliquer ce qui a été tenté
3. Demander s'il faut continuer ou passer à autre chose

### Avant toute modification
Lire obligatoirement :
- KNOWN_ISSUES.md — Problèmes récurrents
- DEVELOPMENT_GUIDE.md — Guide de développement
- Ce fichier todo.md — État des tâches

---

## 📝 NOTES

- Projet long terme (10 ans), priorité à la stabilité > vitesse
- Toujours tester sur mobile après chaque modification
- Documenter les décisions importantes
- Créer des checkpoints réguliers
