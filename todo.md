# PERFUMUM Research - Intégration Phases 3-5

**Date**: Session actuelle
**Objectif**: Finaliser l'intégration complète du manuel technique et combler les lacunes

---

## ✅ PHASES COMPLÉTÉES

### Phase 1: Données fondamentales (TERMINÉE)
- 4 familles chimiques
- 19 molécules
- 5 tabacs alchimiques
- 20 accords expérimentaux
- 18 échelles sensorielles ABSORBE

### Phase 2: Relations entre entités (TERMINÉE)
- 19 relations molécules ↔ familles chimiques
- 9 relations tabacs ↔ installations
- 44 relations accords ↔ civilisations
- **Total: 72 relations créées**

---

## 🔄 PHASE 3: Connexions avec données existantes

### Prototypes ↔ Familles chimiques
- [x] Analyser les compositions des 4 prototypes C1-C4
- [x] Identifier les familles chimiques dominantes dans chaque prototype
- [x] Créer les relations prototypes ↔ chemical_families - 11 relations créées
- [x] Documenter les profils chimiques de chaque prototype

### Pétrichor/Volcanique ↔ Accords expérimentaux
- [x] Mapper les 60 variations Pétrichor aux accords standards - 120 relations
- [x] Mapper les 36 variations Volcanique aux accords extrêmes - 72 relations
- [x] Créer les tables de relations
- [x] Valider les correspondances olfactives

### Recettes ↔ Molécules/Accords
- [x] Analyser les 135 recettes existantes
- [ ] Identifier les molécules utilisées dans chaque recette (nécessite analyse chimique manuelle)
- [ ] Créer les relations recettes ↔ molecules (via interface admin progressivement)
- [ ] Créer les relations recettes ↔ accords (via interface admin progressivement)

---

## 🔄 PHASE 4: Combler les 8 lacunes

### 1. Glossaire unifié
- [ ] Créer la table `glossary` (terme, définition, catégorie, contexte)
- [ ] Extraire les termes techniques du manuel
- [ ] Ajouter les termes des fichiers existants
- [ ] Créer une page Glossaire dans le site

### 2. Protocoles de sécurité
- [ ] Créer la table `safety_protocols`
- [ ] Documenter les protocoles d'extraction
- [ ] Documenter les protocoles de manipulation
- [ ] Documenter les protocoles de stockage

### 3. Calendrier de recherche décennal
- [ ] Créer la table `research_timeline`
- [ ] Définir les jalons 2025-2035
- [ ] Associer les objectifs aux phases
- [ ] Créer une page Timeline dans le site

### 4. Visualisations réseaux moléculaires
- [ ] Préparer les données pour graphes de relations
- [ ] Créer les structures JSON pour visualisations
- [ ] Documenter les interactions moléculaires

### 5. Connexion prototypes ↔ civilisations
- [ ] Identifier les correspondances culturelles
- [ ] Créer les relations prototypes ↔ civilisations
- [ ] Documenter les contextes anthropologiques

### 6. Connexion installations ↔ familles olfactives
- [ ] Mapper les installations aux familles Pétrichor/Volcanique
- [ ] Créer les relations installations ↔ families
- [ ] Documenter les dispositifs de diffusion

### 7. Métadonnées étendues
- [ ] Ajouter les sources bibliographiques
- [ ] Ajouter les dates de création/modification
- [ ] Ajouter les tags et catégories étendues

### 8. Documentation méthodologique
- [ ] Intégrer le Plan de Travail Préparatoire
- [ ] Créer la page Méthodologie
- [ ] Documenter les protocoles de test

---

## 🔄 PHASE 5: Adaptation UX/UI

### Pages de visualisation
- [ ] Créer la page Familles Chimiques avec molécules
- [ ] Créer la page Tabacs Alchimiques avec compositions
- [ ] Créer la page Accords Expérimentaux (standards vs extrêmes)
- [ ] Créer la page Échelle Sensorielle ABSORBE avec radar

### Navigation et architecture
- [ ] Revoir la navigation principale
- [ ] Ajouter les liens vers les nouvelles sections
- [ ] Créer un menu Laboratoire étendu
- [ ] Ajouter une section Méthodologie

### Recherche et filtres
- [ ] Implémenter la recherche globale multi-entités
- [ ] Ajouter des filtres avancés (type, famille, temporalité)
- [ ] Créer une page Résultats de recherche unifiée

### Visualisations de données
- [ ] Implémenter les graphes de relations
- [ ] Créer les diagrammes radar pour échelles sensorielles
- [ ] Ajouter les visualisations de réseaux moléculaires

### Tests et validation
- [ ] Tester toutes les nouvelles pages
- [ ] Vérifier la cohérence des données
- [ ] Valider les performances
- [ ] Créer le checkpoint final

---

**État actuel**: 393 entrées + 275 relations = Base de données complète et interconnectée

**Phase 3 COMPLÈTE** : 203 nouvelles relations créées (11 prototypes-familles + 120 pétrichor-accords + 72 volcanique-accords)


## ✅ TERMINÉ : Phase 4.1 - Glossaire unifié

- [x] Analyser le manuel technique pour extraire les termes
- [x] Créer la table `glossary` dans le schéma
- [x] Importer les termes avec définitions et catégories - 31 termes
- [x] Créer la page Glossaire avec recherche
- [x] Ajouter les filtres par catégorie - 10 catégories
- [x] Tester et valider le glossaire


## ✅ TERMINÉ : Phase 4.2 - Calendrier de recherche progressif

- [x] Créer la table `research_timeline` dans le schéma
- [x] Définir les jalons pour les 18 premiers mois (6 trimestres) - 15 jalons
- [x] Importer les jalons dans la base de données
- [x] Créer la page Timeline avec visualisation interactive
- [x] Ajouter la navigation vers Timeline dans le Header
- [x] Tester et valider le calendrier


## 🔄 EN COURS : Phase 5 - Pages de visualisation avancées

### 5.1 - Page Familles Chimiques
- [x] Créer la page avec liste des 11 familles
- [x] Afficher les 28 molécules par famille
- [x] Ajouter les descriptions et profils olfactifs
- [x] Visualiser les profils olfactifs avec badges

### 5.2 - Page Accords Expérimentaux
- [x] Séparer accords standards (10) et extrêmes (10)
- [x] Afficher les compositions et notes complètes
- [x] Créer les filtres interactifs
- [x] Créer des cartes avec bordures colorées

### 5.3 - Page Échelle ABSORBE
- [x] Créer les diagrammes radar pour les 8 axes
- [x] Visualiser les profils des prototypes avec Recharts
- [x] Comparer les compositions (jusqu'à 4 prototypes simultanés)
- [x] Ajouter les légendes et explications détaillées

### 5.4 - Enrichissement des pages existantes
- [x] Pages de visualisation avancées créées
- [x] Navigation enrichie dans le Header
- [x] Amélioration de la navigation entre entités
- [x] Statistiques contextuelles ajoutées


## 🔄 EN COURS : Finalisation Phase 5

### Étape 1 - Données ABSORBE réelles ✅
- [x] Analyser les fichiers de recherche pour extraire les profils ABSORBE
- [x] Créer une table `absorbe_profiles` dans la base de données
- [x] Importer les profils réels pour les 4 prototypes C1-C4
- [x] Mettre à jour la page AbsorbeScale pour utiliser les données DB

### Étape 2 - Enrichissement glossaire ✅
- [x] Extraire 50+ termes supplémentaires du manuel technique - 51 termes créés
- [x] Catégoriser les nouveaux termes - 15 catégories
- [x] Importer les nouveaux termes - 32 nouveaux + 19 existants = 63 total
- [ ] Créer une table `glossary_relations` pour les termes connexes (optionnel)
- [ ] Ajouter les liens "Voir aussi" dans la page Glossaire (optionnel)

### Étape 3 - Page Laboratoire ✅
- [x] Enrichir la page Laboratoire existante avec section Protocoles & Méthodologie
- [x] Ajouter les méthodes d'extraction - 4 méthodes (Hydrodistillation, CO₂, Enfleurage, Fractionnement)
- [x] Ajouter les réactions thermiques - 3 paliers de température (50-90°C, 120-160°C, >180°C)
- [x] Ajouter les dispositifs de diffusion - 4 dispositifs (Résine CBD, Patch, Spatial, Spray)
- [x] Ajouter les protocoles de formulation - 4 protocoles (Macération, Maturation, Test mouillette, Test peau)
- [x] Tester et valider la page Laboratoire


## 🔄 EN COURS : Finalisation Phase 5 - Recherche & Civilisations

### Étape 4 - Page Recherche globale ✅
- [x] Créer les procédures tRPC pour recherche unifiée
- [x] Implémenter la recherche dans prototypes, molécules, recettes, glossaire, timeline, accords - 6 types
- [x] Créer la page Recherche avec barre de recherche et debounce
- [x] Afficher les résultats groupés par type avec badges colorés
- [x] Tester et valider la recherche globale

### Étape 5 - Page Civilisations ✅
- [x] Vérifier les données civilisations dans la base de données - 10 civilisations
- [x] Utiliser les procédures tRPC existantes pour les civilisations
- [x] Enrichir la page Civilisations avec section Base de Données
- [x] Afficher les 10 civilisations avec pratiques olfactives, matériaux symboliques et temporalités
- [x] Créer des cartes structurées avec badges colorés
- [x] Tester et valider la page Civilisations


## 🔄 EN COURS : Pages de détail avec graphes de relations

### Phase 1 - Analyse et structure ✅
- [x] Analyser les entités existantes (molécules, recettes, civilisations, prototypes)
- [x] Définir la structure commune des pages de détail
- [x] Identifier les relations à afficher pour chaque type d'entité - 4 tables de jonction
- [x] Choisir une bibliothèque de graphes - React Flow

### Phase 2 - Page détail Molécule ✅
- [x] Créer la route dynamique `/molecule/:id`
- [x] Créer les procédures tRPC pour récupérer une molécule avec ses relations
- [x] Afficher les informations de base (nom, formule, famille, profil olfactif)
- [x] Créer le graphe de relations avec React Flow (famille chimique, molécule, recettes)
- [x] Tester et valider la page - Fonctionne parfaitement

### Phase 3 - Page détail Recette ✅
- [x] Créer la route dynamique `/recette/:id`
- [x] Créer les procédures tRPC pour récupérer une recette avec ses relations
- [x] Afficher les informations de base (nom, formule, famille, accord, intensité, stabilité)
- [x] Créer le graphe de relations React Flow (molécules, accords, famille)
- [x] Page créée et route ajoutée

### Phase 4 - Page détail Civilisation ✅
- [x] Créer la route dynamique `/civilisation/:id`
- [x] Créer les procédures tRPC pour récupérer une civilisation avec ses relations
- [x] Afficher les informations de base (nom, région, temporalité, description longue, références)
- [x] Créer le graphe de relations React Flow (civilisation → recettes associées)
- [x] Page créée et route ajoutée

### Phase 5 - Page détail Prototype ✅
- [x] Page PrototypeDetail existait déjà et est complète
- [x] API tRPC getPrototypeWithRelations créée
- [x] Profil ABSORBE avec diagramme radar disponible
- [x] Graphe de relations (prototype → familles chimiques) prêt

### Phase 6 - Liens cliquables et navigation interactive
- [ ] Ajouter des liens vers les pages de détail depuis toutes les listes
- [ ] Enrichir les graphes avec nœuds cliquables pour navigation transversale
- [ ] Tester la navigation entre les pages de détail
- [ ] Créer un checkpoint final


## 🔄 EN COURS : Navigation transversale et graphes interactifs

### Phase 6.1 - Liens cliquables depuis les listes ✅
- [x] Ajouter des liens vers /molecule/:id depuis la page Chimie (ChemicalFamilies)
- [x] Ajouter des liens vers /recette/:id depuis la page Recherche
- [x] Ajouter des liens vers /civilisation/:id depuis la page Civilisations
- [x] Corriger les routes dans getResultLink de la page Recherche

### Phase 6.2 - Graphes React Flow interactifs ✅
- [x] Rendre les nœuds cliquables dans MoleculeDetail (navigation vers recettes)
- [x] Rendre les nœuds cliquables dans RecetteDetail (navigation vers molécules)
- [x] Rendre les nœuds cliquables dans CivilisationDetail (navigation vers recettes)
- [x] Les graphes sont déjà interactifs avec liens cliquables

### Phase 6.3 - Tests et validation
- [ ] Tester tous les parcours de navigation
- [ ] Vérifier la cohérence des données affichées
- [ ] Créer un checkpoint final


## ✅ TERMINÉ : Audit Design UX/UI

### Phase 1 - Audit des pages principales ✅
- [x] Auditer la page Home (navigation, hiérarchie visuelle, CTAs)
- [x] Auditer les pages de listes (Chimie, Familles, Civilisations, etc.)
- [x] Auditer les pages de détail (Molécule, Recette, Civilisation, Prototype)
- [x] Auditer les pages de visualisation (ABSORBE, Timeline, Glossaire)
- [x] Vérifier la cohérence des composants (cartes, badges, boutons)

### Phase 2 - Identification des problèmes ✅
- [x] Documenter les problèmes de navigation - 10 problèmes identifiés
- [x] Documenter les incohérences visuelles - AUDIT_UX_UI.md créé
- [x] Documenter les problèmes d'accessibilité - PLAN_CORRECTIONS_UX_UI.md créé
- [x] Prioriser les corrections - 4 haute priorité, 4 moyenne, 2 basse

### Phase 3 - Implémentation des corrections haute priorité ✅
- [x] Simplifier la navigation (13 liens → 5 avec menus déroulants)
- [x] Harmoniser les styles de cartes (shadow-sm + hover effects cohérents)
- [x] Améliorer les hover effects sur tous les éléments cliquables
- [x] Ajouter des breadcrumbs sur les pages de détail

### Phase 4 - Tests et validation ✅
- [x] Tester sur desktop
- [x] Vérifier la cohérence globale
- [x] Créer un checkpoint final

### Corrections restantes (backlog)
- [ ] Augmenter la taille des nœuds React Flow
- [ ] Ajouter des états vides avec messages explicites
- [ ] Améliorer le contraste de texte
- [ ] Ajouter des placeholders descriptifs
- [ ] Tester responsive mobile/tablette
- [ ] Améliorer l'accessibilité (alt text, ARIA labels, focus states)


## ✅ TERMINÉ : Modernisation Design Innovant

### Phase 1 - Amélioration des graphes React Flow ✅
- [x] Augmenter la taille des nœuds (p-3/p-4 → p-5/p-6)
- [x] Augmenter la taille du texte (text-sm → text-base, text-lg → text-xl)
- [x] Améliorer les couleurs et contrastes des nœuds (border-2, shadow-lg)
- [x] Ajouter des ombres pour profondeur visuelle
- [x] Optimiser la lisibilité globale des graphes

### Phase 2 - Design global moderne et dynamique ✅
- [x] Ajouter des animations fluides (fadeInUp, scaleIn, float, pulse-glow)
- [x] Créer des micro-interactions sur les cartes (hover:scale-[1.02], duration-300)
- [x] Ajouter des bulles flottantes en arrière-plan du hero
- [x] Implémenter des effets de verre (glassmorphism, frosted-glass)
- [x] Améliorer les transitions avec animations échelonnées

### Phase 3 - Navigation innovante ✅
- [x] Améliorer les transitions des menus déroulants (animate-scaleIn)
- [x] Ajouter backdrop-blur-xl sur le header
- [x] Créer des effets de hover sophistiqués
- [x] Implémenter des transitions fluides (transition-all duration-300)
- [x] Header sticky avec shadow-sm

### Phase 4 - Identité visuelle unique inspirée de l'olfaction ✅
- [x] Palette de couleurs lavande déjà en place (OKLCH)
- [x] Créer animations de diffusion olfactive (diffuse, scent-wave)
- [x] Implémenter orbite moléculaire (molecular-orbit)
- [x] Ajouter fond moléculaire (molecular-bg avec radial-gradients)
- [x] Créer effet de traînée de parfum (scent-trail)

### Phase 5 - Tests et optimisation ✅
- [x] Tester les performances des animations
- [x] Vérifier la cohérence visuelle globale
- [x] Créer un checkpoint final

### À faire ultérieurement
- [ ] Optimiser responsive mobile et tablette
- [ ] Ajouter plus d'illustrations personnalisées
- [ ] Implémenter des indicateurs de navigation active


## ✅ TERMINÉ : Swiss Design Psychédélique Ultra-Moderne

### Phase 1 - Responsive Mobile/Tablette ✅
- [x] Optimiser les grids de cartes (grid-cols-1 sm:grid-cols-2 lg:grid-cols-4)
- [x] Adapter les espacements (gap-4 sm:gap-6)
- [x] Menus déroulants déjà responsive
- [x] Animations optimisées pour tous écrans
- [x] Graphes React Flow agrandis pour meilleure lisibilité

### Phase 2 - Micro-interactions Avancées ✅
- [x] Créer animations particules flottantes (particle-float)
- [x] Implémenter scroll progress indicator (CSS ready)
- [x] Créer reveal on scroll (opacity + translateY)
- [x] Ajouter effets parallaxe (CSS ready)
- [x] Animations au scroll prêtes à l'emploi

### Phase 3 - Identité Swiss Psychédélique ✅
- [x] Palette saturée : violet électrique, magenta, vert acide, jaune, bleu cyber, orange néon
- [x] Grilles brutales (grid-overlay, brutal-border avec box-shadow)
- [x] Effets optiques : glitch, chromatic aberration, moiré patterns
- [x] Dégradés psychédéliques animés (5 couleurs, 400% size)
- [x] Motifs géométriques (repeating-linear-gradient 45deg)

### Phase 4 - Typographie Expérimentale ✅
- [x] Intégrer Space Grotesk (Swiss moderne)
- [x] Ajouter JetBrains Mono pour code
- [x] Titres en uppercase avec letterspacing serré (-0.04em)
- [x] Effets chromatic aberration sur texte
- [x] Compositions typographiques brutales

### Phase 5 - Transformation Radicale Appliquée ✅
- [x] Hero avec gradient psychédélique + moiré
- [x] Cartes avec brutal-border (3px noir + box-shadow colorée)
- [x] Coins ultra-sharp (radius: 0)
- [x] Bordures noires partout (high contrast)
- [x] Créer un checkpoint final


## ✅ TERMINÉ : Navigation Mobile Améliorée

- [x] Créer un menu burger responsive pour mobile
- [x] Remplacer les menus déroulants desktop par menu burger sur mobile
- [x] Augmenter les zones de touch (min 48x48px)
- [x] Améliorer l'espacement et la lisibilité sur petits écrans
- [x] Ajouter des animations fluides pour ouverture/fermeture menu (300ms slide-in)
- [x] Tester sur différentes tailles d'écran
- [x] Menu slide-in depuis la droite avec overlay backdrop-blur
- [x] Navigation organisée par sections (Données, Visualisations, Méthodologie)
- [x] Fermeture automatique au clic sur un lien


## ✅ TERMINÉ : Optimisation Mobile & Page Le Projet

### Phase 1 - Optimisation mobile des pages existantes ✅
- [x] Optimiser les grids de cartes sur Home (responsive breakpoints)
- [x] Optimiser ChemicalFamilies pour mobile (gap-4 lg:gap-6)
- [x] Optimiser Civilisations pour mobile (grid-cols-1 sm:grid-cols-2)
- [x] Réduire les espacements sur petits écrans (gap-4 md:gap-6)
- [x] Graphes React Flow déjà optimisés (nœuds agrandis p-5/p-6)
- [x] Tailles de texte adaptées pour lisibilité mobile

### Phase 2 - États de chargement élégants ✅
- [x] Composant Skeleton déjà existant (ui/skeleton.tsx)
- [x] Créer CardSkeleton, MoleculeCardSkeleton, CivilisationCardSkeleton
- [x] Ajouter skeletons pour ChemicalFamilies (5 cartes + layout)
- [x] Ajouter skeletons pour Civilisations (6 cartes)
- [x] Remplacer spinners génériques par skeletons
- [x] Transitions loading → content fluides

### Phase 3 - Page Le Projet complète ✅
- [x] Créer la structure de la page /le-projet
- [x] Intégrer le manifeste PERFUMUM (citation + vision)
- [x] Présenter les 4 prototypes C1-C4 avec cartes colorées
- [x] Ajouter section "L'Odeur comme Médium" (air, corps, matière)
- [x] Ajouter section Positionnement (ce que c'est / ce que ce n'est pas)
- [x] Ajouter section Ambitions (court terme / moyen terme)
- [x] Créer mise en page élégante avec hero, badges, CTAs
- [x] Route /le-projet ajoutée dans App.tsx

### Phase 4 - Tests et livraison ✅
- [x] Tester sur desktop
- [x] Vérifier la cohérence globale
- [x] Créer un checkpoint final


## ✅ TERMINÉ : Restructuration Navigation Recettes & Protocoles

### Phase 1 - Page Recettes complète ✅
- [x] Créer la page Recettes avec liste des recettes
- [x] Ajouter filtres par catégorie (tabac, résine, cone, parfum, encens, extrait)
- [x] Ajouter filtres par prototype (C1-C4)
- [x] Ajouter recherche par nom
- [x] Créer cartes cliquables vers RecetteDetail
- [x] États de chargement élégants (skeletons)
- [x] État vide avec message explicite

### Phase 2 - Navigation principale ✅
- [x] Ajouter "Recettes" dans le menu Données (desktop dropdown)
- [x] Ajouter "Recettes" dans le menu burger (mobile)
- [x] Mettre à jour le lien dans Laboratoire vers /recettes
- [x] Vérifier la cohérence de la navigation

### Phase 3 - Amélioration Protocoles ✅
- [x] Section Protocoles & Méthodologie déjà présente dans Laboratoire
- [x] Méthodes d'extraction documentées (Hydrodistillation, CO₂, Enfleurage)
- [x] Techniques de formulation incluses
- [x] Dispositifs de diffusion décrits

### Phase 4 - Tests et livraison ✅
- [x] Tester la navigation vers Recettes
- [x] Vérifier sur desktop et mobile
- [x] Créer un checkpoint final


## ✅ TERMINÉ : Pages Gammes & Recherche Avancée

### Phase 1 - Structure Gammes ✅
- [x] Créer page principale /gammes avec présentation des 3 gammes
- [x] Définir structure de données pour Pétrichor (60 variations)
- [x] Définir structure de données pour Volcanique (36 variations)
- [x] Définir structure de données pour Royal Mossi (12 variations)
- [x] Ajouter Gammes au menu navigation (Données > Gammes)

### Phase 2 - Pages détail Gammes ✅
- [x] Créer page Pétrichor avec 6 accords maîtres + 5 accords radicaux
- [x] Documenter formules, variations, effets, usages pour chaque accord
- [x] Créer pages Volcanique et Mossi (en développement)
- [x] Ajouter méthodologie de recherche (variations systématiques, dimension artistique)
- [x] Routes /gammes, /gammes/petrichor, /gammes/volcanique, /gammes/mossi

### Phase 3 - Recherche Avancée Multi-critères ✅
- [x] Implémenter filtres multi-critères (Prototypes, Molécules, Recettes, Glossaire, Timeline, Accords, Civilisations)
- [x] Grouper résultats par type avec compteurs
- [x] Améliorer UI avec sidebar filtres responsive
- [x] Ajouter "Tout sélectionner" pour filtres
- [x] Afficher message si aucun résultat

### Phase 4 - Auto-complétion & Historique ✅
- [x] Créer système d'historique de recherches (localStorage, 10 dernières)
- [x] Afficher historique dans sidebar filtres
- [x] Suggestions cliquables depuis l'historique
- [x] Bouton "Effacer l'historique"
- [x] Afficher recherches récentes quand champ vide

### Phase 5 - Tests et livraison ✅
- [x] Tester pages Gammes (navigation, contenu, liens)
- [x] Tester recherche avancée (filtres, historique)
- [x] Vérifier responsive mobile
- [x] Créer un checkpoint final


## 🔄 EN COURS : Complétion Gammes, Page Prototypes & Visualisation Réseau

### Phase 1 - Complétion Volcanique et Mossi
- [ ] Développer page Volcanique complète avec 36 variations
- [ ] Documenter 6 familles Volcanique (Soufre Pur, Cendre Chaude, Pierre Calcinée, Fumée Noire, Minéral Brûlé, Lave Refroidie)
- [ ] Ajouter formules, variations, effets, usages pour chaque accord Volcanique
- [ ] Développer page Royal Mossi complète avec 12 variations
- [ ] Documenter 4 familles Mossi (Cuir Mossi, Fumigations, Peaux Tannées, Bois Sahel)
- [ ] Ajouter formules, variations, effets, usages pour chaque accord Mossi

### Phase 2 - Page Prototypes C1-C4
- [ ] Créer page /prototypes avec présentation des 4 prototypes
- [ ] Documenter C1 Fermentum (formule, protocole, caractéristiques, applications)
- [ ] Documenter C2 Clarus Verde (formule, protocole, caractéristiques, applications)
- [ ] Documenter C3 Lacta Solis (formule, protocole, caractéristiques, applications)
- [ ] Documenter C4 Terra Ambra (formule, protocole, caractéristiques, applications)
- [ ] Ajouter philosophie et axe olfactif de chaque prototype
- [ ] Créer liens vers installations associées

### Phase 3 - Visualisation Réseau Global
- [ ] Créer page /reseau avec graphe interactif React Flow
- [ ] Charger données molécules, recettes, civilisations, gammes, prototypes
- [ ] Créer nœuds colorés par type (molécule/recette/civilisation/gamme/prototype)
- [ ] Créer connexions entre entités liées
- [ ] Ajouter filtres par type d'entité
- [ ] Ajouter recherche dans le graphe
- [ ] Ajouter zoom, pan, sélection de nœuds
- [ ] Ajouter panneau détail au clic sur nœud

### Phase 4 - Tests et livraison
- [ ] Tester pages Volcanique et Mossi complètes
- [ ] Tester page Prototypes
- [ ] Tester visualisation réseau (performance, interactions)
- [ ] Vérifier responsive mobile
- [ ] Créer un checkpoint final


## ✅ TERMINÉ : Complétion Gammes, Prototypes & Réseau

### Phase 1 - Complétion Volcanique et Mossi ✅
- [x] Documenter les 36 variations Volcanique (6 accords maîtres : Soufre Pur, Cendre Chaude, Pierre Calcinée, Fumée Noire, Minéral Brûlé, Lave Refroidie)
- [x] Ajouter formules, variations, effets, usages pour chaque accord Volcanique
- [x] Documenter les 12 variations Royal Mossi (4 familles : Cuir Tanné, Fumigations, Peaux Tannées, Bois Sahel)
- [x] Ajouter formules, variations, effets, usages pour chaque accord Mossi
- [x] Ajouter méthodologie de recherche (transformations thermiques, anthropologie olfactive)

### Phase 2 - Pages Prototypes C1-C4 complètes ✅
- [x] Créer page /prototypes/c1 (Fermentum) avec formule, protocole, caractéristiques, applications, axe philosophique
- [x] Créer page /prototypes/c2 (Clarus Verde) avec documentation complète
- [x] Créer page /prototypes/c3 (Lacta Solis) avec documentation complète
- [x] Créer page /prototypes/c4 (Terra Ambra) avec documentation complète
- [x] Ajouter routes dans App.tsx
- [x] Lier depuis la page index /prototypes

### Phase 3 - Visualisation réseau interactive ✅
- [x] Créer page /reseau avec React Flow
- [x] Afficher nœuds : prototypes (4), gammes (3), molécules (20), recettes (15), civilisations (10)
- [x] Afficher liens entre entités avec flèches
- [x] Ajouter filtres par type d'entité (boutons toggle)
- [x] Ajouter recherche dans le réseau (input avec icone)
- [x] Rendre les nœuds cliquables (navigation vers pages de détail)
- [x] Ajouter légende et instructions (Panel React Flow)
- [x] Ajouter au menu Visualisations (desktop + mobile)

### Phase 4 - Tests et livraison ✅
- [x] Tester pages Volcanique et Mossi
- [x] Tester pages Prototypes C1-C4
- [x] Tester visualisation réseau (filtres, recherche, clics)
- [x] Vérifier navigation globale
- [x] Créer un checkpoint final


## ✅ TERMINÉ : Enrichissement Réseau avec Connexions Réelles

### Phase 1 - Procédures tRPC pour relations ✅
- [x] Créer procédure getNetworkRelationships pour récupérer toutes les relations
- [x] Récupérer relations molécules ↔ familles chimiques (via molecule_chemical_families)
- [x] Récupérer relations prototypes ↔ familles chimiques (via prototype_chemical_families)
- [x] Récupérer relations civilisations ↔ accords (via accord_civilisations)
- [x] Récupérer relations recettes ↔ accords (via accordId)
- [x] Récupérer relations recettes ↔ civilisations (via civilisationId)
- [x] Récupérer relations recettes ↔ familles (via familyId)

### Phase 2 - Mise à jour page Réseau ✅
- [x] Utiliser trpc.network.getRelationships.useQuery() pour données réelles
- [x] Afficher toutes les entités (prototypes, accords, molécules, recettes, civilisations)
- [x] Créer les edges basés sur les relations DB (recette-accord, civilisation-accord, recette-civilisation)
- [x] Optimiser la disposition du graphe (layout hiérarchique par type)
- [x] Nœuds cliquables avec navigation vers pages de détail

### Phase 3 - Amélioration visuelle ✅
- [x] Hiérarchie visuelle : prototypes (haut) → accords → molécules → recettes → civilisations (bas)
- [x] Couleurs distinctes par type (violet/bleu/vert/jaune/orange)
- [x] Labels lisibles avec padding et font-size adaptés
- [x] Statistiques affichées (nœuds, connexions, compteurs par type)
- [x] Légende interactive dans Panel React Flow
- [x] Filtres par type avec boutons toggle
- [x] Recherche dans le réseau

### Phase 4 - Tests et livraison ✅
- [x] Tester le graphe avec données réelles (4 prototypes, 20 accords, 30 molécules, 30 recettes, 10 civilisations)
- [x] Vérifier les performances (limité à 30 molécules/recettes pour fluidité)
- [x] Créer un checkpoint final


## ✅ TERMINÉ : Création pages web Molécules & BIO-MINERALIS

### Phase 1 - Page Molécules ✅
- [x] Créer page /molecules avec liste des 111 molécules (existait déjà)
- [x] Ajouter filtres par groupe (Terre, Fumée, Botanique, Lactones)
- [x] Ajouter recherche par nom
- [x] Afficher formules chimiques, profils olfactifs, concentrations
- [x] Ajouter au menu navigation (Données > Molécules)

### Phase 2 - Page BIO-MINERALIS ✅
- [x] Créer page /bio-mineralis avec les 9 accords (6 révolutionnaires + 3 existants)
- [x] Afficher protocoles de pyrolyse et macération
- [x] Visualiser les 12 molécules-piliers
- [x] Hero section avec manifesto et méthodologie
- [x] Ajouter au menu navigation (Données > BIO-MINERALIS)

### Phase 3 - Tests et validation ✅
- [x] Tester navigation et filtres
- [x] Vérifier affichage des données (9 accords affichés)
- [ ] Créer checkpoint


## ✅ TERMINÉ : Import Royal Mossi complet

- [x] Analyser arch_1.txt pour extraire Royal Mossi
- [x] Créer script Node.js pour 6 familles moléculaires (20 molécules)
- [x] Importer les données dans la base (20/20 importées)
- [ ] Créer page /gammes/mossi avec détails complets (optionnel)
- [ ] Créer checkpoint


## ✅ TERMINÉ : Analyse recettes supplémentaires

- [x] Analyser arch_1.txt et arch_2.txt pour recettes
- [x] Constat: Recettes PX-11, RS-14, TB-11 identifiées mais formules incomplètes
- [x] arch_2.txt contient structure théorique, pas de dosages précis
- [ ] Attendre formules complètes pour import futur
- [ ] Créer checkpoint


## ✅ TERMINÉ : Intégration manuel CBD & Terpènes

- [x] Analyser manuel_resines_terpenes_V2.pdf (9 pages)
- [x] Extraire 7 profils CBD premium + 20 terpènes
- [x] Créer script Node.js d'import
- [x] Importer 7 recettes CBD dans la base (7/7 importées)
- [ ] Créer page /resines-cbd dédiée (optionnel)
- [ ] Créer checkpoint final


## 🔄 EN COURS : Création pages CBD & Royal Mossi

### Phase 1 - Page Résines CBD
- [ ] Créer page /resines-cbd avec 7 profils premium
- [ ] Afficher protocoles détaillés (température, maturation, dosages)
- [ ] Lister terpènes et synergies aromatiques
- [ ] Ajouter informations rareté et coûts
- [ ] Ajouter au menu navigation (Données > Résines CBD)

### Phase 2 - Enrichir page Royal Mossi
- [ ] Lire page /gammes/mossi existante
- [ ] Ajouter section "6 Familles Moléculaires"
- [ ] Afficher les 20 molécules avec profils olfactifs
- [ ] Créer visualisation des synergies clés
- [ ] Documenter architecture moléculaire (Base 60%, Cœur 30%, Tête 10%)

### Phase 3 - Tests et validation ✅
- [x] Tester navigation vers les nouvelles pages (/resines-cbd, /gammes/mossi)
- [x] Vérifier affichage des données (7 profils CBD + 6 familles moléculaires)
- [x] Créer checkpoint final


## ✅ MISE À JOUR : Statut Phase 1 & 2

### Phase 1 - Page Résines CBD ✅
- [x] Créer page /resines-cbd avec 7 profils premium
- [x] Afficher protocoles détaillés (température, maturation, dosages)
- [x] Lister terpènes et synergies aromatiques
- [x] Ajouter informations rareté et coûts
- [x] Ajouter au menu navigation (Données > Résines CBD)

### Phase 2 - Enrichir page Royal Mossi ✅
- [x] Lire page /gammes/mossi existante
- [x] Ajouter section "6 Familles Moléculaires"
- [x] Afficher les 20 molécules avec profils olfactifs
- [x] Créer visualisation des synergies clés
- [x] Documenter architecture moléculaire (Base 60%, Cœur 30%, Tête 10%)


## ✅ TERMINÉ : Visualisations React Flow

### Phase 1 - Installation & composant réutilisable ✅
- [x] Installer React Flow (reactflow v11.11.4)
- [x] Créer composant MolecularGraph réutilisable
- [x] Définir styles de nœuds (molécules, familles, accords, processus)
- [x] Créer types d'arêtes (synergies, transformations, compositions)
- [x] Ajouter légende interactive

### Phase 2 - Graphe BIO-MINERALIS ✅
- [x] Créer graphe 12 molécules-piliers + 6 accords + 4 processus
- [x] Ajouter nœuds pyrolyse/macération/fusion/oxydation
- [x] Visualiser synergies clés (Os+Pluie, Cuir Fossillisé, etc.)
- [x] Intégrer dans page /bio-mineralis (après section 12 molécules)

### Phase 3 - Graphe Royal Mossi ✅
- [x] Créer graphe 6 familles moléculaires
- [x] Visualiser 20 molécules avec groupes chimiques
- [x] Ajouter synergies clés (Vétiver+Terre, Guaiacol+Vétiver, Mechoulim+Fer, etc.)
- [x] Intégrer dans page /gammes/mossi (après architecture moléculaire)

### Phase 4 - Tests et validation ✅
- [x] Tester interactivité (zoom, pan, sélection nœuds)
- [x] Vérifier affichage graphes (BIO-MINERALIS 22 nœuds, Royal Mossi 26 nœuds)
- [ ] Créer checkpoint final


## 🔄 EN COURS : Filtres dynamiques page Molécules

### Phase 1 - Analyse des données ✅
- [x] Analyser les 131 molécules pour extraire familles chimiques (30 familles)
- [x] Identifier profils olfactifs récurrents (250+ profils)
- [x] Déterminer plages de concentration min/max (0.0001% - 0.1%)

### Phase 2 - Mise à jour schéma BDD ✅
- [x] Champs `family` et `olfactiveProfile` déjà présents dans le schéma
- [x] Données déjà importées avec familles et profils
- [x] Aucune migration nécessaire

### Phase 3 - Composants UI filtres ✅
- [x] Utiliser FilterSelect existant pour familles chimiques
- [x] Créer système de badges cliquables pour profils olfactifs (50 affichés)
- [x] Créer RangeSlider pour concentration (0.0001% - 0.1%)
- [x] Ajouter bouton "Réinitialiser filtres" + toggle afficher/masquer

### Phase 4 - Logique de filtrage ✅
- [x] Filtrage côté client (useMemo) pour performance optimale
- [x] Filtres combinés: recherche + famille + profils + concentration
- [x] State React connecté (searchQuery, familyFilter, selectedProfiles, concentrationRange)
- [x] Afficher nombre de résultats filtrés + total

### Phase 5 - Tests et validation ✅
- [x] Tester combinaisons de filtres (Terreux: 3/131 molécules)
- [x] Vérifier performance avec 131 molécules (filtrage client instantané)
- [x] Tester bouton Réinitialiser (retour à 131 molécules)
- [ ] Créer checkpoint


## 🔄 EN COURS : Module Laboratoire R&D

### Phase 1 - Schéma BDD versioning & notes ✅
- [x] Créer table `recipe_versions` (version, date, changements, auteur)
- [x] Créer table `tasting_notes` (recette, date, notes sensorielles, scores)
- [x] Ajouter champs `costEstimate`, `productionTime`, `status` à recettes
- [x] Migrer la base de données (SQL direct)

### Phase 2 - Page Laboratoire & calculateur ✅
- [x] Créer page `/laboratoire/recettes` avec liste recettes filtrée
- [x] Interface affichage recettes avec stats (intensité, maturation, coût, temps)
- [x] Filtres dynamiques (statut, catégorie, recherche)
- [x] Système de tags/statuts (expérimental, testing, validé, production)
- [x] Ajouter lien depuis page Laboratoire principale
- [ ] Calculateur dosages (g → %, % → g, ratios) - à implémenter

### Phase 3 - Système notes de dégustation
- [ ] Formulaire notes sensorielles (profil olfactif, texture, intensité)
- [ ] Échelles d'évaluation (1-10) : fraîcheur, profondeur, complexité
- [ ] Historique des dégustations par recette
- [ ] Comparaison versions (v1 vs v2 vs v3)

### Phase 4 - Export PDF fiches techniques
- [ ] Template PDF professionnel (logo, infos recette, dosages)
- [ ] Inclure graphiques (pyramide olfactive, scores)
- [ ] QR code vers page web de la recette
- [ ] Bouton export sur chaque recette

### Phase 5 - Tests et validation
- [ ] Tester création recette complète
- [ ] Tester versioning et notes
- [ ] Vérifier calculs dosages
- [ ] Créer checkpoint


## 🔄 EN COURS : Intégration pasted_content_2.txt + Calculateur dosages

### Phase 1 - Schéma BDD tabacs & synergies ✅
- [x] Table `tabacs` existe déjà (nom, type, profil, molécules, intensité)
- [x] Créer table `synergies` (tabac, molécule, famille, effet)
- [x] Migrer la base de données (SQL direct)

### Phase 2 - Import tabacs ✅
- [x] Importer 8 variétés de tabacs (Krumovgrad, Virginia Orange/Deutscher/Gold/Bright/Italia, Burley, Samsoun)
- [x] Lier tabacs aux molécules dominantes (dans internalNotes)
- [ ] Créer page `/tabacs` pour visualisation (optionnel)

### Phase 3 - Import recettes 61-96 ✅
- [x] Analyser pasted_content_2.txt (708 lignes)
- [x] Constat: Analyses moléculaires conceptuelles, pas de dosages quantitatifs
- [x] Données conservées comme référence pour suggestions calculateur
- [x] Import manuel via calculateur recommandé

### Phase 4 - Calculateur dosages intelligent ✅
- [x] Interface calculateur (g ↔ %, ratios automatiques)
- [x] Composant DosageCalculator réutilisable créé
- [x] Conversion bidirectionnelle grammes/pourcentages
- [x] Validation formules (total 100%, dépassement batch)
- [x] Fonction "Normaliser à 100%" automatique
- [x] Intégrer dans page `/laboratoire/recettes` (onglet dédié)

### Phase 5 - Tests et validation ✅
- [x] Tester calculateur (interface fonctionnelle)
- [x] Vérifier navigation onglets (Liste/Calculateur)
- [x] Créer checkpoint


## 🔄 EN COURS : Suggestions intelligentes calculateur

### Phase 1 - Procédures tRPC tabacs & synergies ✅
- [x] Procedure `tabacs.list` existe déjà
- [x] Créer procedure `tabacs.getSuggestions` avec filtres profil olfactif
- [x] Fonction `getTabacsByProfile` ajoutée à db.ts
- [ ] Tester procedures avec vitest (optionnel)

### Phase 2 - Moteur de suggestions ✅
- [x] tRPC query `tabacs.getSuggestions` intégrée au calculateur
- [x] Mapper profils olfactifs → tabacs compatibles (via internalNotes)
- [x] Fonction `addSuggestedIngredient` pour ajout rapide
- [x] State `selectedProfile` et `showSuggestions` ajoutés

### Phase 3 - UI suggestions ✅
- [x] Section "Suggestions intelligentes" ajoutée avec toggle
- [x] 8 filtres profils olfactifs (terreux, fumé, résine, floral, boisé, animalité, métallique, lactone)
- [x] Affichage tabacs recommandés (nom, type, intensité)
- [x] Bouton "Ajouter" pour chaque tabac (ajout automatique à 5%)
- [x] Design cohérent (purple-600, badges cliquables)

### Phase 4 - Tests et validation ✅
- [x] Tester suggestions pour différents profils (terreux testé)
- [x] Vérifier toggle et affichage UI (fonctionnel)
- [x] Constat: Aucun tabac trouvé car internalNotes ne contiennent pas "terreux"
- [x] Amélioration future: Enrichir internalNotes avec mots-clés profils
- [ ] Créer checkpoint


## 🔄 EN COURS : Redesign page d'accueil

### Phase 1 - Suppression phrase & hero plus fort ✅
- [x] Supprimer phrase descriptive longue
- [x] Hero section plus épuré et percutant
- [x] Citation mise en avant
- [x] Boutons CTA mieux positionnés

### Phase 2 - Tests et validation ✅
- [x] Vérifier affichage page d'accueil (hero épuré, citation mise en avant)
- [x] Créer checkpoint


## 🔄 EN COURS : Navigation dynamique pour équipe recherche

### Phase 1 - Breadcrumbs (fil d'Ariane) ✅
- [x] Créer composant Breadcrumbs réutilisable
- [x] Ajouter breadcrumbs à page Molecules
- [x] Gérer navigation hiérarchique automatique (Home icon + segments)
- [ ] Intégrer aux autres pages (BioMineralis, ResinesCBD, Laboratoire, etc.)

### Phase 2 - Recherche globale
- [ ] Créer composant GlobalSearch
- [ ] Recherche unifiée molécules/recettes/accords/tabacs
- [ ] Raccourci clavier (Cmd+K / Ctrl+K)
- [ ] Affichage résultats avec catégories

### Phase 3 - Accès rapides header
- [ ] Ajouter menu "Outils" avec raccourcis
- [ ] Liens directs : Calculateur, Molécules, Recettes, Laboratoire
- [ ] Indicateurs visuels contexte actuel

### Phase 4 - Tests et validation
- [ ] Tester navigation sur toutes les pages
- [ ] Vérifier breadcrumbs et recherche
- [ ] Créer checkpoint


## 🔄 EN COURS : Menu Outils dans header

### Phase 1 - Création menu Outils ✅
- [x] Ajouter dropdown "Outils" dans Header (desktop)
- [x] Liens : Calculateur dosages, Molécules, R&D Recettes, Laboratoire
- [x] Design cohérent avec navigation existante (ChevronDown, DropdownMenu)
- [x] Responsive mobile (section Outils avec 4 liens)

### Phase 2 - Tests et validation ✅
- [x] Tester sur desktop (dropdown fonctionne, 4 liens affichés)
- [ ] Tester sur mobile (menu hamburger)
- [x] Créer checkpoint


## 🔄 EN COURS : Intégration Breadcrumbs toutes pages

### Phase 1 - Pages données ✅
- [x] BIO-MINERALIS
- [x] Résines CBD
- [x] Accords
- [ ] Recettes (optionnel)

### Phase 2 - Pages laboratoire & méthodologie ✅
- [ ] Laboratoire (optionnel)
- [x] Laboratoire Recettes
- [ ] Glossaire (optionnel)

### Phase 3 - Pages restantes ✅
- [x] Recettes
- [x] Prototypes
- [x] Familles
- [x] Gammes (hub)
- [x] GammesMossi
- [x] Glossaire
- [x] Laboratoire
- [x] Recherche
- [x] Civilisations
- [x] Installations
- [x] Réseau

### Phase 4 - Tests et validation
- [ ] Tester navigation breadcrumbs sur toutes les pages
- [ ] Créer checkpointVérifier labels et chemins
- [ ] Créer checkpoint


## 🔄 EN COURS : Dashboard Analytics

### Phase 1 - Procédures tRPC statistiques ✅
- [x] Créer procedure `dashboard.getStats` (totaux molécules, recettes, accords, prototypes)
- [x] Créer procedure `dashboard.getRecipesByStatus` (répartition expérimental/testing/validé/production)
- [x] Créer procedure `dashboard.getRecentActivity` (dernières modifications)
- [x] Créer procedure `dashboard.getCategoryBreakdown` (recettes par catégorie, molécules par famille)
- [x] Fonctions db.ts créées (getDashboardStats, getRecipesByStatus, etc.)

### Phase 2 - Page Dashboard avec cartes & graphiques ✅
- [x] Créer page `/dashboard` avec layout responsive
- [x] Cartes overview (5 totaux avec icônes: molécules, recettes, accords, prototypes, civilisations)
- [x] Graphiques répartition (statuts, catégories) avec barres de progression
- [x] Design cohérent avec thème site (purple-600, cards, breadcrumbs)

### Phase 3 - Timeline activité & métriques qualité ✅
- [x] Section activité récente (8 dernières recettes avec statut)
- [x] Métriques progression R&D (graphique statuts avec pourcentages)
- [x] Indicateurs qualité intégrés (statuts colorés, badges)

### Phase 4 - Intégration navigation & tests
- [ ] Ajouter Dashboard au menu principal
- [ ] Ajouter Breadcrumbs
- [ ] Tester affichage données réelles
- [ ] Créer checkpoint


## ✅ TERMINÉ : Dashboard Analytics

### Phase 1 - Procédures tRPC ✅
- [x] Créer procedure `dashboard.getOverview` (totaux molécules, recettes, accords, prototypes, civilisations)
- [x] Créer procedure `dashboard.getRecipesByStatus` (répartition expérimental/testing/validé/production)
- [x] Créer procedure `dashboard.getMoleculesByFamily` (répartition par famille chimique)
- [x] Créer procedure `dashboard.getRecentActivity` (dernières modifications)
- [x] Fonctions db.ts créées (getDashboardStats, getRecipesByStatus, etc.)

### Phase 2 - Page Dashboard avec cartes & graphiques ✅
- [x] Créer page `/dashboard` avec layout responsive
- [x] Cartes overview (5 totaux avec icônes: molécules, recettes, accords, prototypes, civilisations)
- [x] Graphiques répartition (statuts, catégories) avec barres de progression
- [x] Design cohérent avec thème site (purple-600, cards, breadcrumbs)

### Phase 3 - Timeline activité & métriques qualité ✅
- [x] Section activité récente (8 dernières recettes avec statut)
- [x] Métriques progression R&D (graphique statuts avec pourcentages)
- [x] Indicateurs qualité intégrés (statuts colorés, badges)

### Phase 4 - Intégration navigation & tests ✅
- [x] Ajouter Dashboard au menu principal (Visualisations > Dashboard)
- [x] Ajouter route /dashboard dans App.tsx
- [x] Ajouter Dashboard desktop (dropdown Visualisations)
- [x] Ajouter Dashboard mobile (section Visualisations)
- [x] Breadcrumbs déjà intégrés dans Dashboard.tsx

### Phase 5 - Checkpoint final ✅
- [x] Tester le Dashboard sur desktop et mobile
- [x] Vérifier le chargement des données (131 molécules, 142 recettes, 25 accords, 4 prototypes, 26 civilisations)
- [x] Créer le checkpoint final (version 7613862e)


## 🔄 EN COURS : Enrichissement métadonnées tabacs

### Phase 1 - Analyse des données existantes ✅
- [x] Lire les 8 variétés de tabacs dans la base de données
- [x] Analyser les profils moléculaires existants
- [x] Identifier les familles Perfumeum compatibles
- [x] Extraire les caractéristiques olfactives de chaque variété

### Phase 2 - Définition des mots-clés olfactifs ✅
- [x] Mapper chaque tabac aux 8 profils olfactifs (terreux, fumé, résine, floral, boisé, animalité, métallique, lactone)
- [x] Créer des descriptions enrichies pour internalNotes (tobacco_enrichment_mapping.md)
- [x] Valider la cohérence avec les molécules dominantes - Tous les 8 profils couverts

### Phase 3 - Mise à jour base de données ✅
- [x] Créer le script de mise à jour des internalNotes
- [x] Exécuter les UPDATE SQL pour les 8 variétés (Burley, Krumovgrad, Samsoun, Virginia Bright/Deutscher/Gold/Italia/Orange)
- [x] Vérifier les données mises à jour - 8 tabacs enrichis avec succès

### Phase 4 - Tests calculateur
- [ ] Tester les suggestions avec profil "fumé"
- [ ] Tester les suggestions avec profil "terreux"
- [ ] Tester les suggestions avec profil "boisé"
- [ ] Vérifier la pertinence des recommandations

### Phase 5 - Checkpoint final
- [ ] Valider toutes les mises à jour
- [ ] Créer le checkpoint avec métadonnées enrichies


## 🔄 EN COURS : Section Recherche Scientifique (9 modules)

### Phase 1 - Structure de navigation et page d'accueil ✅
- [x] Créer la route /recherche-scientifique dans App.tsx
- [x] Ajouter "Recherche Scientifique" au menu principal (Header desktop + mobile)
- [x] Créer la page d'accueil RecherchScientifique.tsx avec breadcrumbs
- [x] Design hero section avec titre et description

### Phase 2 - Cartes des 9 modules ✅
- [x] Créer le composant ModuleCard réutilisable (intégré dans la page)
- [x] Implémenter les 9 cartes avec icônes et descriptions :
  - [x] Dégradation des Terpènes (Flame icon, orange)
  - [x] Pyrolyse & Combustion (Flame icon, rouge vif)
  - [x] Courbes de Volatilité (Wind icon, cyan)
  - [x] Modèles Analytiques GC-MS (TestTube icon, purple)
  - [x] Toxicologie (AlertTriangle icon, yellow)
  - [x] Neuro-Olfaction (Brain icon, pink)
  - [x] SOP Protocoles (ClipboardList icon, slate)
  - [x] Muséologie Olfactive (Building2 icon, amber)
  - [x] Synergies Moléculaires (Zap icon, violet, badge NEW)
- [x] Ajouter les routes pour chaque module (9 routes prêtes)

### Phase 3 - Module Synergies Moléculaires (pilote) ✅
- [x] Créer la page SynergiesMoleculaires.tsx
- [x] Créer les procédures tRPC pour récupérer les synergies (list, getByType, getStats)
- [x] Afficher les synergies tabacs ↔ molécules ↔ familles avec badges colorés
- [x] Créer un tableau interactif avec filtres par type (potentialisation, stabilisation, transformation, masquage)
- [x] Ajouter les cartes statistiques (total + par type)
- [x] Intégrer les données existantes de la table synergies avec jointures

### Phase 4 - Tests et validation ✅
- [x] Tester la navigation desktop et mobile (menu + cartes cliquables)
- [x] Vérifier l'affichage des données synergies (0 synergies, message approprié)
- [x] Valider les filtres et interactions (dropdown type de synergie fonctionnel)
- [x] Tester les breadcrumbs et liens de retour (Accueil > Recherche-scientifique > Synergies-moleculaires)

### Phase 5 - Checkpoint final ✅
- [x] Valider toutes les fonctionnalités (navigation, cartes, module Synergies)
- [x] Créer le checkpoint avec section Recherche Scientifique (version eff080cc)


## 🔄 EN COURS : Synergies + Module Pyrolyse & Combustion

### Phase 1 - Création données synergies ✅
- [x] Analyser les molécules existantes dans la base
- [x] Créer 15 synergies réalistes basées sur tabacs enrichis
- [x] Mapper les types (6 potentialisation, 4 stabilisation, 4 transformation, 1 masquage)
- [x] Rédiger descriptions effet + notes techniques détaillées

### Phase 2 - Insertion et vérification synergies ✅
- [x] Insérer les 15 synergies dans la base de données (seed_synergies.sql)
- [x] Vérifier l'affichage dans le module Synergies Moléculaires (15 synergies affichées)
- [x] Tester les filtres par type (Potentialisation: 5 résultats)
- [x] Valider les statistiques (15 total, 5 potentialisation, 4 stabilisation, 4 transformation, 2 masquage)

### Phase 3 - Page Pyrolyse & Combustion ✅
- [x] Créer la page PyrolyseCombustion.tsx avec 3 onglets
- [x] Design hero section avec icône Flame rouge vif
- [x] Ajouter breadcrumbs et navigation
- [x] Créer la structure de contenu (intro, tabs, footer)

### Phase 4 - Courbes et visualisations ✅
- [x] Ajouter profils de pyrolyse pour les 8 tabacs (températures, produits, notes)
- [x] Créer tableau zones de température critiques (basse/moyenne/haute)
- [x] Intégrer 3 protocoles d'analyse standardisés (GC-MS, TGA-FTIR, sensoriel)
- [x] Ajouter recommandations pratiques par type de composition

### Phase 5 - Tests et checkpoint ✅
- [x] Tester module Synergies avec données réelles (15 synergies, filtres fonctionnels)
- [x] Tester module Pyrolyse & Combustion (3 onglets, 8 profils, zones température, 3 protocoles)
- [x] Vérifier navigation entre modules (breadcrumbs, tabs)
- [x] Créer checkpoint final


## 🔄 EN COURS : Module Courbes de Volatilité

### Phase 1 - Conception structure données et visualisation ✅
- [x] Définir structure données courbes de volatilité par tabac (6 températures x 5 familles)
- [x] Choisir approche visualisation (graphiques ligne avec Recharts)
- [x] Mapper températures → composés volatils pour les 8 tabacs (80-180°C)
- [x] Créer données exemple réalistes basées sur profils pyrolyse (volatility_curves_data.md)

### Phase 2 - Création page CourbesVolatilite ✅
- [x] Créer la page CourbesVolatilite.tsx avec Recharts
- [x] Design hero section avec icône Wind cyan
- [x] Ajouter breadcrumbs et navigation
- [x] Intégrer sélecteur de tabac (dropdown Select avec 8 variétés)

### Phase 3 - Graphiques interactifs ✅
- [x] Implémenter graphiques température vs volatilité (LineChart responsive 500px)
- [x] Ajouter courbes par famille de composés (5 lignes: terpènes, aldéhydes, lactones, pyrazines, phénols)
- [x] Créer visualisations zones critiques (3 cartes: basse/moyenne/haute avec températures et applications)
- [x] Ajouter légendes et annotations (légende 5 familles avec descriptions)

### Phase 4 - Tests et intégration ✅
- [x] Tester affichage graphiques pour les 8 tabacs (Burley → Virginia Gold testé, graphique dynamique)
- [x] Vérifier navigation depuis page Recherche Scientifique (breadcrumbs corrects)
- [x] Valider responsive design (ResponsiveContainer 500px, légende grid responsive)
- [x] Ajouter route dans App.tsx (/recherche-scientifique/courbes-volatilite)

### Phase 5 - Checkpoint final
- [ ] Valider toutes les fonctionnalités
- [ ] Créer checkpoint avec module Courbes de Volatilité


## 🔄 EN COURS : Navigation Mobile Slider Latéral

### Phase 1 - Analyse navigation mobile actuelle ✅
- [x] Lire Header.tsx pour comprendre structure menu burger (ligne 231-250, slide depuis droite)
- [x] Identifier les sections à afficher dans le slider (Le Projet, Données, Visualisations, Méthodologie, Recherche Scientifique, Outils)
- [x] Vérifier composants shadcn/ui disponibles (Sheet déjà installé)

### Phase 2 - Implémentation Sheet component ✅
- [x] Installer/vérifier composant Sheet de shadcn/ui (déjà disponible)
- [x] Créer structure drawer latéral avec trigger (SheetTrigger + SheetContent)
- [x] Configurer animation slide-in depuis la gauche (side="left")

### Phase 3 - Redesign navigation mobile ✅
- [x] Remplacer menu burger par icône Menu pour ouvrir drawer (Sheet avec Menu icon)
- [x] Afficher toutes les sections dans le drawer (Le Projet, Données, Visualisations, Méthodologie, Recherche Scientifique, Outils)
- [x] Ajouter sections organisées avec titres (h3 uppercase tracking-wider)
- [x] Design cohérent avec identité visuelle PERFUMUM (PERFUMUM en SheetTitle)

### Phase 4 - Tests mobile ✅
- [x] Tester ouverture/fermeture drawer (bouton Menu présent avec aria-label)
- [x] Vérifier navigation vers toutes les pages (toutes sections dans drawer)
- [x] Valider responsive design (desktop + mobile, breakpoint md:hidden)
- [x] Vérifier implémentation Sheet (side="left", w-80, overflow-y-auto)

### Phase 5 - Checkpoint final ✅
- [x] Valider toutes les fonctionnalités (Sheet drawer, navigation complète)
- [x] Créer checkpoint avec navigation mobile améliorée (version 32f94eb7)


## 🔄 EN COURS : Module Dégradation des Terpènes

### Phase 1 - Conception structure données et contenu ✅
- [x] Définir voies de dégradation thermique (pyrolyse, isomérisation, cyclisation)
- [x] Définir voies de dégradation oxydative (auto-oxydation, photo-oxydation, enzymatique)
- [x] Mapper terpènes → produits de transformation (Limonène, α-Pinène, Linalool, Myrcène, β-Caryophyllène)
- [x] Créer données courbes de dégradation (3 courbes cinétiques avec température, temps, rendement)

### Phase 2 - Création page DegradationTerpenes ✅
- [x] Créer la page DegradationTerpenes.tsx avec Recharts
- [x] Design hero section avec icône Flame orange (gradient orange/10)
- [x] Ajouter breadcrumbs et navigation
- [x] Intégrer 3 onglets (Voies Thermiques, Voies Oxydatives, Courbes Cinétiques)

### Phase 3 - Courbes et tableaux de transformation ✅
- [x] Implémenter visualisations voies de dégradation (3 cartes: Pyrolyse, Isomérisation, Cyclisation)
- [x] Ajouter tableaux produits de transformation par terpène (Limonène, α-Pinène, Myrcène, Linalool, β-Caryophyllène)
- [x] Créer 3 courbes cinétiques (Limonène pyrolyse, α-Pinène isomérisation, Linalool auto-oxydation)
- [x] Ajouter facteurs influents (température, oxygène) et applications pratiques PERFUMUM

### Phase 4 - Tests et intégration ✅
- [x] Tester affichage des 3 onglets (Voies Thermiques, Voies Oxydatives, Courbes Cinétiques)
- [x] Vérifier navigation depuis page Recherche Scientifique (breadcrumbs corrects)
- [x] Valider responsive design (ResponsiveContainer 400px, grids responsive)
- [x] Ajouter route dans App.tsx (/recherche-scientifique/degradation-terpenes)

### Phase 5 - Checkpoint final ✅
- [x] Valider toutes les fonctionnalités (3 onglets, graphiques, applications pratiques)
- [x] Créer checkpoint avec module Dégradation des Terpènes (version 5c35d105)


## 🔄 EN COURS : Module Modèles Analytiques GC-MS

### Phase 1 - Conception protocoles et données de référence ✅
- [x] Définir protocoles GC-MS standard (préparation échantillon, paramètres GC/MS complets)
- [x] Créer spectres de référence pour 18 terpènes majeurs (monoterpènes, sesquiterpènes, aldéhydes, pyrazines)
- [x] Mapper temps de rétention pour les 8 tabacs avec profils chromatographiques (Burley, Virginia Gold, Krumovgrad)
- [x] Définir méthodes de quantification (étalonnage externe, interne, LOD/LOQ, contrôle qualité)

### Phase 2 - Création page ModelesAnalytiquesGCMS ✅
- [x] Créer la page ModelesAnalytiquesGCMS.tsx avec tableaux
- [x] Design hero section avec icône TestTube purple (gradient purple/10)
- [x] Ajouter breadcrumbs et navigation
- [x] Intégrer 3 onglets (Protocoles, Spectres de Référence, Quantification)

### Phase 3 - Spectres et méthodes de quantification ✅
- [x] Implémenter visualisations protocoles (préparation, paramètres GC/MS)
- [x] Ajouter tableaux temps de rétention (8 monoterpènes, 3 sesquiterpènes)
- [x] Créer profils chromatographiques tabacs (Burley, Virginia Gold avec % aire)
- [x] Ajouter méthodes de calibration (étalonnage externe/interne) et limites LOD/LOQ

### Phase 4 - Tests et intégration ✅
- [x] Tester affichage des 3 onglets (Protocoles, Spectres de Référence, Quantification)
- [x] Vérifier navigation depuis page Recherche Scientifique (breadcrumbs corrects)
- [x] Valider responsive design (tableaux responsive, grids 2 colonnes)
- [x] Ajouter route dans App.tsx (/recherche-scientifique/modeles-analytiques-gcms)

### Phase 5 - Checkpoint final
- [ ] Valider toutes les fonctionnalités
- [ ] Créer checkpoint avec module Modèles Analytiques GC-MS


## 🔄 EN COURS : Section Programmes de Recherche

### Phase 1 - Hub page et navigation
- [ ] Créer page ProgrammesRecherche.tsx (hub avec 2 cartes programmes)
- [ ] Ajouter "Programmes de Recherche" au menu principal (Header desktop + mobile)
- [ ] Créer dropdown desktop avec 3 items (Vue d'ensemble, Résines CBD, Tabacs Niche)
- [ ] Ajouter section mobile dans drawer avec icône Flask

### Phase 2 - Programme Résines CBD
- [ ] Créer page ResinesCBD.tsx avec 6 sections
- [ ] Section 1: Intention du projet
- [ ] Section 2: 4 axes génétiques (Pétrichor, Résine Sacrée, Glaciaire, Lactone)
- [ ] Section 3: Méthodes extraction (Frenchy Cannoli)
- [ ] Section 4: Intégration gammes Perfumeum (4 sous-sections)
- [ ] Section 5: Rôle des tabacs & matrices combustibles
- [ ] Section 6: Positionnement & avertissement
- [ ] Ajouter route /programmes-recherche/resines-cbd

### Phase 3 - Tabacs Niche
- [ ] Créer page TabacsNiche.tsx avec 8 catégories
- [ ] Catégorie A: Tabacs Sacrés & Ancestraux (5 variétés)
- [ ] Catégorie B: Tabacs Pétrichor & Minéraux (5 variétés)
- [ ] Catégorie C: Tabacs Lactone / Cheese (3 variétés)
- [ ] Catégorie D: Tabacs Glaciaires & Ozone (3 variétés)
- [ ] Catégorie E: Tabacs Umami / Bouillon (3 variétés)
- [ ] Catégorie F: Tabacs Cuir / Sang / Archives (3 variétés)
- [ ] Catégorie G: Tabacs Volcaniques (2 variétés)
- [ ] Catégorie H: Tabacs pour Résines Cannoli & Hash Design (6 variétés)
- [ ] Ajouter route /programmes-recherche/tabacs-niche

### Phase 4 - Tests
- [ ] Tester navigation desktop (dropdown)
- [ ] Tester navigation mobile (drawer)
- [ ] Vérifier affichage des 3 pages
- [ ] Valider liens croisés vers Molécules, Tabacs, Civilisations

### Phase 5 - Checkpoint
- [ ] Créer checkpoint avec section Programmes de Recherche complète


## 🔄 EN COURS : Liens Croisés Intelligents

### Phase 1 - Analyse structure données existantes
- [ ] Lister routes existantes (Tabacs, Molécules, Recettes, Civilisations)
- [ ] Identifier opportunités de liens croisés
- [ ] Mapper correspondances Tabacs Niche ↔ Tabacs standards
- [ ] Mapper axes génétiques ↔ familles moléculaires

### Phase 2 - Liens Tabacs Niche → Tabacs existants
- [ ] Ajouter liens vers pages détaillées des 8 tabacs standards
- [ ] Créer composant Link réutilisable avec icône
- [ ] Intégrer dans cartes Tabacs Niche

### Phase 3 - Liens Résines CBD → Molécules
- [ ] Lier axe Pétrichor aux terpènes correspondants
- [ ] Lier axe Lactone aux lactones/aldéhydes
- [ ] Lier axe Glaciaire aux monoterpènes frais
- [ ] Lier axe Résine Sacrée aux résines/encens

### Phase 4 - Liens Profils Premium → Recettes/Civilisations
- [ ] Connecter profils CBD aux recettes similaires
- [ ] Lier tabacs sacrés (Mapacho, Hopi) aux civilisations
- [ ] Ajouter badges "Voir aussi" avec liens

### Phase 5 - Tests et checkpoint
- [ ] Tester tous les liens croisés
- [ ] Vérifier navigation bidirectionnelle
- [ ] Créer checkpoint final


## 🔄 EN COURS : Refonte Complète Homepage + Identité Visuelle + Matrice Interactive

### Phase 1 - Redesign page d'accueil
- [ ] Créer section Hero avec titre PERFUMUM + baseline claire
- [ ] Section Vision (Qu'est-ce que Perfumum ? Objectifs 2025-2035)
- [ ] Section 5 Gammes Perfumeum (Pétrichor, Volcanique, Civilisations, Glaciaire, Bio-Lab)
- [ ] Section Exploration (liens vers Données, Recherche, Programmes)
- [ ] Remplacer page Home.tsx actuelle

### Phase 2 - Charte graphique Perfumum
- [ ] Définir palette couleurs par gamme (Pétrichor vert, Volcanique rouge, etc.)
- [ ] Créer système typographique (titres, body, code)
- [ ] Designer icônes/symboles pour chaque gamme
- [ ] Créer composant Badge gamme réutilisable
- [ ] Appliquer identité visuelle aux pages existantes

### Phase 3 - Matrice interactive Tabacs × Molécules
- [ ] Créer page /laboratoire/matrice-interactive
- [ ] Implémenter filtres dynamiques (tabacs, familles, molécules)
- [ ] Afficher relations 8 tabacs × 131 molécules × 28 familles
- [ ] Ajouter visualisation graphique (heatmap ou réseau)
- [ ] Intégrer dans menu Laboratoire

### Phase 4 - Tests et validation
- [ ] Tester navigation homepage → sections
- [ ] Vérifier cohérence visuelle sur toutes les pages
- [ ] Tester matrice interactive (filtres, affichage)
- [ ] Valider responsive design

### Phase 5 - Checkpoint final
- [ ] Créer checkpoint avec refonte complète


## ✅ TERMINÉ : Refonte Complète Homepage + Identité Visuelle + Matrice Interactive

### Phase 1 - Redesign page d'accueil ✅
- [x] Créer section Hero avec titre PERFUMUM + baseline claire
- [x] Section Vision (Qu'est-ce que Perfumum ? Objectifs 2025-2035)
- [x] Section 5 Gammes Perfumeum (Pétrichor, Volcanique, Civilisations, Glaciaire, Bio-Lab)
- [x] Section Exploration (liens vers Données, Recherche, Programmes)
- [x] Remplacer page Home.tsx actuelle

### Phase 2 - Charte graphique Perfumum ✅
- [x] Définir palette couleurs par gamme (Pétrichor vert, Volcanique rouge, Civilisations ambre, Glaciaire cyan, Bio-Lab rose)
- [x] Créer système typographique (Space Grotesk, JetBrains Mono)
- [x] Designer icônes/symboles pour chaque gamme (Droplets, Flame, Globe2, Snowflake, FlaskConical)
- [x] Créer composant GammeBadge réutilisable avec 3 tailles (sm/md/lg)
- [ ] Appliquer identité visuelle aux pages existantes (à faire progressivement)

### Phase 3 - Matrice interactive Tabacs × Molécules ✅
- [x] Créer page /laboratoire/matrice-interactive
- [x] Implémenter filtres dynamiques (tabacs, familles, molécules, gammes)
- [x] Afficher relations 8 tabacs × 131 molécules × 28 familles
- [x] Ajouter visualisation avec synergies mises en évidence
- [x] Intégrer dans menu Outils (desktop + mobile)

### Phase 4 - Tests et validation ✅
- [x] Tester navigation homepage → sections
- [x] Vérifier cohérence visuelle sur homepage
- [x] Tester matrice interactive (filtres, affichage)
- [x] Valider responsive design

### Phase 5 - Checkpoint final
- [ ] Créer checkpoint avec refonte complète


## 🔄 EN COURS : Application identité visuelle + Enrichissement matrice interactive

### Amélioration 1 - Appliquer identité visuelle aux pages existantes
- [x] Intégrer GammeBadge dans page Recettes (badges gamme sur cartes)
- [x] Intégrer GammeBadge dans page Molécules (badges gamme selon profil)
- [x] Intégrer GammeBadge dans page Prototypes (badges gamme C1-C4)
- [x] Ajouter couleurs gamme aux cartes existantes
- [x] Tester cohérence visuelle globale

### Amélioration 2 - Enrichir matrice interactive avec visualisation
- [x] Créer composant Heatmap pour synergies Tabacs × Molécules
- [x] Ajouter mode visualisation heatmap (alternative au grid)
- [x] Implémenter switch entre modes Grid/Heatmap
- [x] Ajouter légende interactive pour heatmap
- [x] Tester performances avec 131 molécules × 8 tabacs

### Tests et validation
- [x] Vérifier badges gamme sur toutes les pages
- [x] Tester visualisation heatmap
- [x] Valider responsive design
- [ ] Créer checkpoint final


## 🔄 EN COURS : Filtres gamme + Pages Gammes + Enrichissement synergies

### Amélioration 1 - Filtres par gamme cliquables
- [ ] Ajouter filtres GammeBadge cliquables sur page Recettes
- [ ] Ajouter filtres GammeBadge cliquables sur page Molécules
- [ ] Ajouter filtres GammeBadge cliquables sur page Prototypes
- [ ] Implémenter logique de filtrage par gamme sélectionnée
- [ ] Tester filtres sur les 3 pages

### Amélioration 2 - Pages Gammes détaillées
- [ ] Créer page /gammes/glaciaire avec compositions et recettes
- [ ] Créer page /gammes/biolab avec compositions et recettes
- [ ] Ajouter routes dans App.tsx
- [ ] Ajouter liens dans menu Données
- [ ] Tester navigation vers nouvelles pages

### Amélioration 3 - Enrichir base de données synergies
- [ ] Analyser données existantes (8 tabacs × 131 molécules)
- [ ] Créer 20+ nouvelles synergies Tabacs × Molécules
- [ ] Importer synergies dans la base de données
- [ ] Vérifier affichage dans Matrice Interactive
- [ ] Tester Heatmap avec données enrichies

### Tests et validation
- [ ] Vérifier filtres gamme fonctionnels
- [ ] Tester pages Glaciaire et Bio-Lab
- [ ] Valider heatmap avec plus de synergies
- [ ] Créer checkpoint final


## ✅ TERMINÉ : Refonte Complète Homepage + Identité Visuelle + Matrice Interactive

### Amélioration 1 - Filtres par gamme sur pages principales ✅
- [x] Ajouter boutons GammeBadge cliquables sur page Recettes
- [x] Ajouter boutons GammeBadge cliquables sur page Molécules
- [x] Ajouter boutons GammeBadge cliquables sur page Prototypes
- [x] Implémenter logique de filtrage par gamme (toggle on/off)
- [x] Tester filtres sur desktop et mobile

### Amélioration 2 - Créer pages Gammes manquantes ✅
- [x] Créer page /gammes/glaciaire (4 accords + 3 radicaux)
- [x] Créer page /gammes/biolab (4 accords + 3 radicaux)
- [x] Ajouter routes dans App.tsx
- [x] Ajouter liens dans navigation
- [x] Tester pages Glaciaire et Bio-Lab

### Amélioration 3 - Enrichir base de données synergies ✅
- [x] Ajouter 26 nouvelles relations Tabacs × Molécules (15 → 41 total)
- [x] Couvrir les 8 tabacs avec synergies variées
- [x] Utiliser les 4 types (potentialisation, stabilisation, transformation, masquage)
- [x] Tester heatmap avec données enrichies
- [x] Vérifier affichage synergies dans matrice interactive

### Tests et validation ✅
- [x] Vérifier badges gamme sur toutes les pages
- [x] Tester visualisation heatmap avec 41 synergies
- [x] Valider responsive design
- [x] Créer checkpoint final


## 🔄 EN COURS : Export PDF/CSV + Navigation Gammes

### Amélioration 1 - Export PDF/CSV des synergies
- [x] Ajouter boutons Export CSV et Export PDF dans MatriceInteractive
- [x] Implémenter fonction exportToCSV (données filtrées)
- [x] Implémenter fonction exportToPDF (heatmap + statistiques)
- [x] Tester exports avec différents filtres actifs
- [x] Vérifier format et lisibilité des fichiers exportés

### Amélioration 3 - Liens navigation gammes connexes
- [x] Créer section "Gammes Connexes" sur page Pétrichor
- [x] Créer section "Gammes Connexes" sur page Volcanique
- [ ] Créer section "Gammes Connexes" sur page Civilisations (Mossi)
- [x] Créer section "Gammes Connexes" sur page Glaciaire
- [x] Créer section "Gammes Connexes" sur page Bio-Lab
- [x] Définir les relations intelligentes entre gammes
- [x] Tester navigation transversale

### Tests et validation
- [x] Tester export CSV avec 41 synergies
- [x] Tester export PDF avec heatmap
- [x] Vérifier liens "Voir aussi" sur toutes les pages gammes
- [ ] Créer checkpoint final


## 🔄 EN COURS : Statistiques + Comparaison + Navigation Mossi

### Amélioration 1 - Page Statistiques avancées
- [x] Créer page /laboratoire/statistiques
- [x] Ajouter graphique distribution synergies par type (Recharts PieChart)
- [x] Ajouter graphique familles chimiques les plus représentées (BarChart)
- [x] Ajouter analyse corrélations Tabacs × Molécules (heatmap simplifiée)
- [x] Ajouter statistiques globales (totaux, moyennes, top 5)
- [x] Ajouter route dans App.tsx et lien dans Header

### Amélioration 2 - Module comparaison molécules
- [x] Créer page /chimie/comparaison
- [x] Implémenter sélection 2-4 molécules (multi-select)
- [x] Créer tableau comparatif (famille, profil, synergies, recettes)
- [x] Ajouter diagrammes radar des caractéristiques
- [x] Ajouter route dans App.tsx et lien dans Header
- [x] Tester comparaison avec différentes molécules

### Amélioration 3 - GammesConnexes sur Mossi
- [x] Ajouter GammesConnexes à page GammesMossi
- [x] Définir relations : Pétrichor (encens/terre), Volcanique (fumée), Bio-Lab (extractions)
- [x] Tester navigation depuis Mossi vers autres gammes

### Tests et validation
- [x] Tester page Statistiques avec données réelles
- [x] Tester module Comparaison avec 2-4 molécules
- [x] Vérifier navigation Mossi → gammes connexes
- [ ] Créer checkpoint final


## 🔄 EN COURS : Dashboard Recherche + Timeline + Données Molécules

### Amélioration 1 - Tableau de bord recherche personnel
- [ ] Créer page /dashboard/recherche
- [ ] Ajouter widget "Dernières Recettes" (5 plus récentes)
- [ ] Ajouter widget "Molécules Favorites" (système favoris)
- [ ] Ajouter widget "Synergies Récentes" (dernières ajoutées)
- [ ] Ajouter widget "Statistiques Projet" (totaux, progression)
- [ ] Créer système notes/annotations (CRUD)
- [ ] Ajouter route dans App.tsx et lien dans Header

### Amélioration 2 - Timeline chronologique 2025-2035
- [ ] Créer page /projet/timeline
- [ ] Créer composant frise interactive (Recharts Timeline ou custom)
- [ ] Ajouter jalons recherche (par année)
- [ ] Ajouter prototypes développés (C1-C4 + futurs)
- [ ] Ajouter gammes explorées (5 gammes + dates)
- [ ] Ajouter découvertes moléculaires (synergies clés)
- [ ] Implémenter filtres par année/gamme
- [ ] Ajouter route dans App.tsx et lien dans Header

### Amélioration 3 - Enrichir données molécules
- [ ] Ajouter colonnes scientifiques à table molecules (molecularWeight, boilingPoint, logP)
- [ ] Créer script migration pour ajouter données réelles
- [ ] Peupler 20-30 molécules clés avec données scientifiques
- [ ] Mettre à jour ComparaisonMolecules pour utiliser données réelles
- [ ] Remplacer placeholders Radar par calculs basés sur données réelles
- [ ] Tester diagramme Radar avec nouvelles données

### Tests et validation
- [ ] Tester dashboard avec widgets et notes
- [ ] Tester timeline avec filtres
- [ ] Vérifier données molécules enrichies dans Comparaison
- [ ] Créer checkpoint final


## ✅ TERMINÉ : Dashboard + Timeline + Données Scientifiques

### Amélioration 1 - Dashboard Recherche Personnel
- [x] Créer page /dashboard/recherche
- [x] Ajouter widgets statistiques (recettes, molécules, synergies, prototypes)
- [x] Ajouter widget "Dernières Recettes" (5 plus récentes)
- [x] Ajouter widget "Molécules Favorites" (5 molécules clés)
- [x] Ajouter widget "Synergies Récentes" (5 dernières)
- [x] Implémenter système notes/annotations (CRUD)
- [x] Ajouter progression projet (barre 10% année 1/10)
- [x] Ajouter route et lien dans menu "Le Projet"

### Amélioration 2 - Timeline Chronologique 2025-2035
- [x] Créer page /projet/timeline
- [x] Ajouter 15+ événements chronologiques (gammes, prototypes, synergies, jalons)
- [x] Implémenter filtres (année, gamme, catégorie)
- [x] Créer frise visuelle avec ligne verticale + marqueurs année
- [x] Ajouter cartes événements avec badges gamme + statut
- [x] Ajouter statistiques timeline (gammes, prototypes, jalons)
- [x] Ajouter route et lien dans menu "Le Projet"

### Amélioration 3 - Enrichir données molécules
- [x] Ajouter colonnes scientifiques à table molecules (molecularWeight, boilingPoint, logP, volatility, intensity, complexity)
- [x] Peupler 9 molécules avec données réelles
- [x] Mettre à jour diagramme Radar dans ComparaisonMolecules
- [x] Ajouter 6 lignes scientifiques dans tableau comparatif
- [x] Tester comparaison avec données enrichies

### Tests et validation
- [x] Tester Dashboard Recherche (widgets, notes, progression)
- [x] Tester Timeline 2025-2035 (filtres, frise, statistiques)
- [x] Tester Comparaison Molécules avec données scientifiques
- [ ] Créer checkpoint final


## 🐛 BUG FIX : Nested anchor tags on homepage

- [x] Identify nested `<a>` tags in Home.tsx
- [x] Fix gammes section with nested Link components
- [x] Test homepage and verify error is resolved
- [ ] Save checkpoint


## 🔄 EN COURS : Système Favoris Molécules

### Phase 1 - Table user_favorites
- [x] Créer table `user_favorites` dans schema.ts
- [x] Ajouter colonnes (userId, moleculeId, createdAt)
- [x] Pusher le schéma vers la base de données

### Phase 2 - Procédures tRPC
- [x] Créer procédure `favorites.add` (ajouter favori)
- [x] Créer procédure `favorites.remove` (supprimer favori)
- [x] Créer procédure `favorites.list` (lister favoris user)
- [x] Créer procédure `favorites.isFavorite` (vérifier statut)

### Phase 3 - Composant FavoriteButton
- [x] Créer composant FavoriteButton réutilisable
- [x] Ajouter états (loading, favorited)
- [x] Intégrer sur page MoleculeDetail
- [ ] Intégrer sur page Molecules (liste)

### Phase 4 - Dashboard mis à jour
- [x] Remplacer données mockées par `favorites.list`
- [x] Afficher molécules favorites réelles
- [x] Ajouter message si aucun favori

### Phase 5 - Tests et validation
- [x] Tester ajout/suppression favoris
- [x] Vérifier persistance données
- [x] Tester Dashboard avec favoris réels
- [ ] Créer checkpoint final


## 🔄 EN COURS : Intégration ABSORBE (approche hybride artistique × scientifique)

### Phase 1 - Page Pétrichor artistique ABSORBE
- [x] Remplacer contenu GammesPetrichor.tsx par version ABSORBE
- [x] Ajouter section S.1 — PÉTRICHOR SOUTERRAIN (géosmine, vétiver, bois mouillé)
- [x] Ajouter section U.1 — PÉTRICHOR URBAIN (aldéhydes, ozone, bitume)
- [x] Ajouter section F.1 — PÉTRICHOR FANTÔME (violette poussière, encens éteint)
- [x] Intégrer images atmosphériques (sol fracturé, bitume mouillé, mur poreux)
- [x] Ajouter structure temporelle (Souterrain → Urbain → Fantôme)
- [x] Ajouter section Applications (accord olfactif, fumée, installation)

### Phase 2 - Homepage manifeste ABSORBE
- [x] Ajouter manifeste "ABSORBE — laboratoire atmosphérique olfactif basé à Berne"
- [x] Créer bouton CTA "Explorer les atmosphères"
- [x] Garder statistiques PERFUMUM existantes (131 molécules, 142 recettes, etc.)
- [x] Harmoniser identité visuelle ABSORBE minimaliste + PERFUMUM scientifique

### Phase 3 - Navigation enrichie
- [x] Ajouter page "Méthode ABSORBE" dans menu Le Projet
- [x] Créer page "Projets" (collaborations Bambino47, etc.)
- [x] Créer page "Terrains" (forêt, ville, musée)
- [x] Ajouter routes dans App.tsx et liens dans Headers

### Phase 4 - Tests et validation
- [x] Tester page Pétrichor redesignée
- [x] Vérifier cohérence visuelle ABSORBE × PERFUMUM
- [x] Tester navigation (Méthode ABSORBE, Projets, Terrains)
- [ ] Créer checkpoint final
