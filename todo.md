# TODO — PERFUMUM Research

**Projet** : PERFUMUM — Plateforme de recherche olfactive expérimentale  
**Durée** : 10 ans (2025-2035)  
**Dernière mise à jour** : 25 décembre 2025

---

## ✅ ITÉRATION 1 : QUICK WINS (Terminée)

### Objectif
Améliorer la compréhension immédiate du site pour qu'un visiteur comprenne en 10 secondes ce qu'est PERFUMUM et où trouver les données.

### Tâches

- [x] 1.1 Ajouter texte de contexte sur la home (2-3 lignes après le titre principal)
- [x] 1.2 Ajouter tagline sous le logo dans le header
- [x] 1.3 Améliorer la hiérarchie visuelle des 3 parcours (icônes, couleurs, tailles)
- [x] 1.4 Différencier les boutons CTA (primaire vs secondaire)
- [x] 1.5 Simplifier le footer (réduire de 12 à 6 liens essentiels)

### Critères "done"
- [x] Un visiteur comprend en 10 secondes ce qu'est PERFUMUM
- [x] Les 3 parcours sont visuellement différenciés
- [x] Le CTA principal est clairement identifié
- [x] Le footer est lisible et non surchargé

**Statut** : ✅ Terminée le 25 décembre 2025

**Statut Itération 2** : ✅ Terminée le 25 décembre 2025

---

## 🎨 ITÉRATION 2 : COMPARAISON & FILTRES (Terminée)

### Objectif
Améliorer l'expérience de navigation et de comparaison des recettes

### Tâches

#### 1. Dropdown de tri sur /recettes
- [x] 2.1.1 Ajouter un Select "Trier par" avec 5 options :
  - Plus récentes (défaut)
  - Nom A-Z
  - Nom Z-A
  - Intensité croissante
  - Intensité décroissante
- [x] 2.1.2 Positionner le dropdown à droite des filtres
- [x] 2.1.3 Appliquer le tri en temps réel

#### 2. Page de comparaison de recettes MVP
- [x] 2.2.1 Créer route `/compare-recettes` (déjà existante)
- [x] 2.2.2 Système de sélection : checkboxes sur cartes recettes (max 4)
- [x] 2.2.3 Barre flottante affichant nombre de recettes sélectionnées
- [x] 2.2.4 Bouton "Comparer" (désactivé si < 2 recettes)
- [x] 2.2.5 Page comparaison avec tableau côte-à-côte (9 critères)
- [x] 2.2.6 Graphiques radar superposés
- [x] 2.2.7 Highlighting automatique des valeurs identiques
- [x] 2.2.8 Bouton "Partager" (copie URL avec IDs)

#### 3. Bouton "Réinitialiser filtres"
- [x] 2.3.1 Ajouter bouton "Réinitialiser" visible uniquement si filtres actifs
- [x] 2.3.2 Réinitialiser tous les filtres (gamme, famille, prototype, ingrédients, recherche, radar)
- [x] 2.3.3 Toast de confirmation

#### 4. Tooltips des filtres avancés
- [x] 2.4.1 Ajouter tooltips sur les 6 sliders radar avec définitions
- [x] 2.4.2 Tooltip "Gamme" : explication des 5 gammes
- [x] 2.4.3 Tooltip "Famille" : différence parfum/résine/résine_cbd
- [x] 2.4.4 Tooltip "Prototype" : explication C1-C4
- [x] 2.4.5 Utiliser composant Tooltip de shadcn/ui

### Durée estimée
3-5 jours

### Priorité
**Haute** — Amélioration UX critique

---

## 📦 ITÉRATION 3 : EXPORTS & FAVORIS (En cours)

### Objectif
Améliorer l'expérience utilisateur avec favoris, exports et navigation

### Tâches

#### 0. Système de sélection de recettes (Suggestion 2)
- [x] 3.0.1 Ajouter checkboxes sur RecetteCard (max 4 sélections)
- [x] 3.0.2 Créer composant FloatingCompareBar
- [x] 3.0.3 Afficher compteur et bouton "Comparer"
- [x] 3.0.4 Redirection vers /compare-recettes?ids=1,2,3
- [x] 3.0.5 Feedback visuel sur cartes sélectionnées (ring primary)

#### 1. Système de favoris
- [x] 3.1.1 Créer hook useFavorites avec localStorage
- [x] 3.1.2 Ajouter bouton cœur sur RecetteCard
- [x] 3.1.3 Toggle favori avec animation
- [x] 3.1.4 Toast de confirmation
- [ ] 3.1.5 Créer page /favoris avec liste filtrée (page existante pour molécules)
- [ ] 3.1.6 Badge compteur dans navigation (non prioritaire)

#### 2. Exports Markdown & JSON
- [x] 3.2.1 Créer utilitaire exportToMarkdown (format Notion-ready)
- [x] 3.2.2 Créer utilitaire exportToJSON (structure complète)
- [x] 3.2.3 Ajouter bouton "Exporter" dans RecetteDetail
- [x] 3.2.4 Dropdown avec 2 options (Markdown / JSON)
- [x] 3.2.5 Téléchargement automatique du fichier
- [x] 3.2.6 Toast de confirmation

#### 3. Breadcrumbs de navigation
- [x] 3.3.1 Créer composant Breadcrumbs réutilisable (déjà existant)
- [x] 3.3.2 Intégrer dans RecetteDetail (déjà présent)
- [x] 3.3.3 Intégrer dans MoleculeDetail (déjà présent)
- [x] 3.3.4 Intégrer dans pages gammes (déjà présent)
- [x] 3.3.5 Génération automatique depuis URL (déjà implémenté)

#### 4. Skeleton loaders
- [x] 3.4.1 Créer composant RecetteCardSkeleton
- [x] 3.4.2 Créer composant RecetteDetailSkeleton
- [x] 3.4.3 Afficher pendant chargement tRPC
- [x] 3.4.4 Animation shimmer effect (via composant Skeleton de shadcn)
- [ ] 3.4.5 Tester avec throttling réseau (test manuel utilisateur)

### Durée estimée
7-10 heures

### Priorité
**Haute** — Amélioration UX demandée par l'utilisateur

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
- Documentation obligatoire pour chaque modification
- Checkpoints fréquents pour sauvegarder l'état
- Tester avant et après chaque modification


---

## 🌍 AXES RÉGIONAUX : COLOMBIE & BURKINA FASO (À intégrer)

### Contexte
Deux axes de recherche olfactive majeurs à structurer dans le site :
- **Colombie** : Humidité, fermentation, stratification (pôle HUMIDE/FERMENTÉ/INSTABLE)
- **Burkina Faso / Mossi** : Sécheresse, autorité, combustion (pôle SEC/RITUEL/ÉPURÉ)

### Tâches d'intégration

#### Phase 1 : Structure de base
- [ ] Créer page `/axes-regionaux` (vue d'ensemble)
- [ ] Créer page `/axes-regionaux/colombie` avec sections :
  - [ ] Positionnement conceptuel
  - [ ] Axes moléculaires dominants (Humidité/sol, Fermentation, Air tropical)
  - [ ] Contextes d'usage site-specific
  - [ ] 10 typologies de recettes
  - [ ] Contraintes techniques
- [ ] Créer page `/axes-regionaux/burkina-faso` avec sections :
  - [ ] Positionnement conceptuel
  - [ ] Axes moléculaires dominants (Sec/minéral, Animalité, Bois/pouvoir)
  - [ ] Contextes d'usage
  - [ ] 10 typologies de recettes
  - [ ] Dimension éthique

#### Phase 2 : Données et relations
- [ ] Ajouter champ `axe_regional` dans table `recettes` (enum: 'colombie', 'burkina_faso', null)
- [ ] Créer 10 recettes colombiennes (Pétrichor équatorial, Fermentation tropicale, etc.)
- [ ] Créer 10 recettes burkinabées (Terre sahélienne, Fumée des ancêtres, etc.)
- [ ] Lier molécules spécifiques à chaque axe (Géosmin pour Colombie, Phénols secs pour Burkina)

#### Phase 3 : Filtres et comparaisons
- [ ] Ajouter filtre "Axe régional" sur page `/recettes`
- [ ] Créer page `/compare-axes` (Colombie ↔ Burkina Faso)
- [ ] Tableau comparatif : Humidité vs Sécheresse, Fermentation vs Combustion, etc.
- [ ] Visualisation radar superposée (profils olfactifs opposés)

#### Phase 4 : Navigation et exports
- [ ] Ajouter "Axes Régionaux" dans le menu principal
- [ ] Créer liens croisés : depuis `/gammes` vers `/axes-regionaux`
- [ ] Export Markdown par recette avec mention de l'axe régional
- [ ] Export JSON avec métadonnées d'axe

### Priorité
**Moyenne** — À intégrer après l'Itération 3 (Exports & Favoris)

### Fichier source
`/home/ubuntu/upload/Pasted_content_14.txt` — Document de référence complet
