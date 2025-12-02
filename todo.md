# PERFUMUM Research - Todo List

## ✅ Phase 1: Structure de base de données
- [x] Créer le schéma de base de données complet (11 tables interconnectées)
- [x] Ajouter les tables: tabacs, molecules, familles, accords, recettes
- [x] Ajouter les tables: civilisations, petrichor, volcanique, perfumeum12
- [x] Ajouter les tables: installations, laboratoire
- [x] Créer les tables de relations many-to-many
- [x] Pousser le schéma vers la base de données

## ✅ Phase 2: Composants UI réutilisables
- [x] Créer le système de design (couleurs, typographie)
- [x] Créer les composants de cartes (MatiereCard, AccordCard, RecetteCard, etc.)
- [ ] Créer les composants de filtres (MultiSelect, SearchBar)
- [x] Créer les composants de layout (Header, Navigation)
- [x] Créer les badges pour catégories

## ✅ Phase 3: Pages principales et navigation
- [x] Créer la page d'accueil avec hero section
- [x] Créer la page Prototypes (C1-C4)
- [x] Créer la page Familles olfactives
- [x] Créer la page Laboratoire (matières, molécules, accords, recettes)
- [x] Créer la page Civilisations
- [x] Créer la page Installations
- [x] Créer la page Projet (introduction et méthodologie)
- [x] Configurer la navigation dans App.tsx
- [x] Créer les procédures tRPC pour l'API

## ✅ Phase 4: Analyse et structuration des données
- [x] Analyser la structure des fichiers arch_1.txt et arch_2.txt
- [x] Identifier les patterns de données dans les fichiers markdown
- [x] Extraire les données du fichier CSV Molécules
- [x] Créer un mapping entre fichiers sources et tables DB
- [x] Documenter la structure des données pour import

## 🔄 Phase 5: Scripts d'import sécurisés
- [x] Créer le script d'import pour les prototypes C1-C4
- [ ] Créer le script d'import pour les matières premières
- [ ] Créer le script d'import pour les molécules
- [ ] Créer le script d'import pour les familles olfactives
- [ ] Créer le script d'import pour les accords
- [ ] Créer le script d'import pour les recettes
- [ ] Créer le script d'import pour les civilisations
- [ ] Ajouter la validation des données avant insertion
- [ ] Ajouter la gestion des erreurs et rollback

## 🔄 Phase 6: Import progressif avec validation
- [x] Importer les prototypes C1-C4 et valider
- [ ] Importer les familles olfactives et valider
- [ ] Importer les matières premières et valider
- [ ] Importer les molécules et valider
- [ ] Importer les accords et valider
- [ ] Importer les recettes et valider
- [ ] Importer les civilisations et valider
- [ ] Importer les installations et valider
- [ ] Vérifier l'intégrité des relations many-to-many
## ✅ Phase 7: Création des pages de détail dynamiques
- [x] Créer la page de détail pour les prototypes
- [x] Connecter les pages aux données de la base via tRPC
- [x] Ajouter les routes dynamiques dans App.tsx

## 🔄 Phase 8: Amélioration UI/UX et pages dynamiques- [ ] Créer les pages de détail pour chaque prototype
- [ ] Créer la page liste des matières avec filtres
- [ ] Créer les pages de détail des matières
- [ ] Créer la page liste des molécules avec filtres
- [ ] Créer la page liste des accords avec filtres
- [ ] Créer la page liste des recettes avec filtres
- [ ] Créer la page liste des civilisations
- [ ] Créer la page liste des installations
- [ ] Ajouter la recherche globale fonctionnelle
- [ ] Améliorer le responsive mobile
- [ ] Ajouter des animations et transitions fluides
- [ ] Optimiser les performances de chargement

## Phase 8: Tests exhaustifs
- [ ] Tester la navigation entre toutes les pages
- [ ] Tester les filtres et la recherche
- [ ] Tester l'affichage des données sur desktop
- [ ] Tester l'affichage des données sur mobile
- [ ] Tester les relations entre entités
- [ ] Vérifier l'absence de bugs visuels
- [ ] Tester les performances avec données complètes
- [ ] Valider l'accessibilité (contraste, navigation clavier)

## Phase 9: Finalisation et livraison
- [ ] Créer le checkpoint final
- [ ] Documenter l'architecture du site
- [ ] Documenter comment ajouter de nouvelles données
- [ ] Préparer le guide d'utilisation
- [ ] Livrer le site à l'utilisateur


## 🔄 Phase actuelle: Ajustement du schéma et import des données
- [x] Ajuster le schéma molecules pour plus de flexibilité (text au lieu d'enum)
- [x] Migrer la base de données avec le nouveau schéma
- [x] Importer les molécules (CSV + données curées) - 9 molécules importées
- [x] Importer les familles olfactives depuis arch_2.txt - 10 familles importées (181 variations)
- [x] Importer les accords depuis les fichiers sources - 19 accords importés
- [ ] Importer les recettes depuis les fichiers markdown
- [x] Créer la page de détail des familles olfactives avec filtres
- [x] Créer la page de détail des molécules avec filtres
- [x] Créer la page de détail des accords avec filtres
- [ ] Créer la page liste des recettes avec filtres
- [x] Ajouter les composants de filtres interactifs (SearchBar, FilterSelect)
- [x] Tester toutes les pages et fonctionnalités
- [ ] Créer le checkpoint final


## 🔄 Phase actuelle: Import des données restantes et création de l'interface d'administration

### Import des données restantes
- [ ] Analyser les fichiers arch_1.txt et arch_2.txt pour extraire les données manquantes
- [x] Créer un script d'import pour les matières premières (huiles essentielles, absolus, résinoïdes) - 18 matières importées
- [x] Créer un script d'import pour les recettes complètes avec formulations - 86 recettes importées
- [ ] Créer un script d'import pour les civilisations
- [ ] Créer un script d'import pour les installations olfactives
- [x] Valider l'import de toutes les données

### Interface d'administration
- [x] Créer la page d'administration principale avec dashboard
- [x] Créer le formulaire d'ajout de molécules
- [ ] Créer le formulaire d'ajout d'accords
- [ ] Créer le formulaire d'ajout de familles
- [ ] Créer le formulaire d'ajout de matières premières
- [ ] Créer le formulaire d'ajout de recettes
- [ ] Créer le formulaire d'ajout de civilisations
- [ ] Ajouter la gestion des relations (many-to-many)
- [ ] Ajouter la validation des formulaires
- [x] Tester toutes les fonctionnalités d'administration
- [ ] Créer le checkpoint final
