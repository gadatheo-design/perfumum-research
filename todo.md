# PERFUMUM — TODO

> **Dernière mise à jour** : 08 janvier 2026
> **Archive des sessions précédentes** : `todo-archive-2026-01-08.md` (116 sessions, 1577 tâches complétées)

---

## 📊 ÉTAT ACTUEL DU PROJET

### Base de données
| Entité | Quantité | Liaisons |
|--------|----------|----------|
| Molécules | ~556 | 50% liées aux recettes (278/556) |
| Recettes | ~266 | 93% avec molécules (248/266) |
| Plantes | ~144 | 19.4% liées aux terroirs (28/144) |
| Terroirs | ~29 | 65.5% avec plantes (19/29) |
| Accords | ~30 | - |
| Familles olfactives | ~12 | - |
| Matières premières | ~80 | - |

### Qualité des données scientifiques
| Champ | Rempli | Manquant |
|-------|--------|----------|
| CAS Number | 25% | 75% |
| Nom IUPAC | 18% | 82% |
| Classe chimique | 28% | 72% |
| Formule | 66% | 34% |
| Profil olfactif | 94% | 6% |

---

## 🚨 P0 — CRITIQUE (Bloquant pour les contributeurs)

### Interface Contributeur
- [x] Créer le formulaire d'ajout de molécule avec recherche de doublons (`/contributor`)
- [x] Créer le formulaire d'ajout de plante avec recherche de doublons (`/contributor`)
- [x] Implémenter la recherche automatique de doublons avant création
- [x] Créer l'interface de création de liaisons molécule↔recette
- [x] Connecter dialog d'édition AdminAccords aux mutations update/delete
- [x] Connecter dialog d'édition AdminFamilles aux mutations update/delete
- [x] Connecter dialog d'édition AdminMatieres aux mutations update/delete
- [x] Créer l'interface de création de liaisons plante↔terroir

### Liaisons entre entités (Couverture actuelle très faible)
- [x] Interface de liaison plante-molécule avec statistiques (`/plant-molecule-linking`)
- [x] Auditer les liaisons existantes et identifier les priorités (`/plant-terroir-audit`)
- [x] Créer une interface drag-drop pour créer des liaisons rapidement (`/plant-terroir-dragdrop`)
- [x] Permettre la création de liaisons en masse via CSV (`/plant-terroir-import-csv`)
- [x] Audit des liaisons molécule-recette (`/molecule-recette-audit`)
- [x] Interface drag-drop molécule-recette (`/molecule-recette-dragdrop`)
- [x] Import CSV molécule-recette (`/molecule-recette-import-csv`)
- [x] Objectif : Atteindre 50% de couverture molécule→recette (atteint: 50.0%) — 66 liaisons créées automatiquement
- [x] Objectif : Atteindre 10% de couverture molécule→plante (atteint: 16%)
- [x] Objectif : Atteindre 20% de couverture plante→terroir (actuellement 19.4%) ✅

### Pages Admin (Complétées le 08 Jan 2026)
- [x] Créer la page `/admin/molecules` (liste complète avec radar)
- [x] Créer la page `/admin/accords` (gestion des accords olfactifs)
- [x] Créer la page `/admin/familles` (gestion des familles olfactives)
- [x] Créer la page `/admin/matieres` (gestion des matières premières)
- [x] Tester les fonctionnalités CRUD sur chaque page (validé via tests vitest)
- [x] Valider le responsive mobile des pages admin (validé visuellement)

---

## ⚠️ P1 — IMPORTANT (Améliore significativement l'expérience)

### Système de brouillons et validation
- [x] Ajouter un champ "status" (brouillon/validé) aux entités principales (molécules et plantes)
- [x] Créer l'interface de validation admin (`/admin/validation`)
- [x] Implémenter les notifications admin pour les nouvelles contributions (alertes automatiques)
- [x] Créer les formulaires d'entrée de données simplifiés (`/contributor/simple`)

### Import/Export CSV amélioré
- [x] Interface d'import CSV basique (`/admin/import-csv`)
- [x] Créer l'interface d'upload avec prévisualisation (`/admin/import-csv-preview`)
- [x] Ajouter la validation des données avant import (`/csv-validation-import`)
- [x] Permettre la correction des erreurs avant import final (édition inline + dialog + auto-correction)
- [x] Créer le système d'export des données (CSV, JSON) - page améliorée avec export groupeé

### Enrichissement des données scientifiques
- [ ] Ajouter plus de données de relations molécule-plante
- [ ] Importer les données de composition moléculaire des matières premières
- [ ] Compléter la base avec les huiles essentielles manquantes
- [ ] Ajouter les absolues et extraits CO2
- [ ] Implémenter les connexions plantes-terroirs

### Restrictions IFRA
- [x] Créer la page de consultation IFRA avec recherche par molécule (`/ifra`)
- [x] Ajouter le géraniol aux restrictions IFRA (déjà présent - 49th Amendment, 5.3%)
- [x] Ajouter le citronellol aux restrictions IFRA (déjà présent - 49th Amendment, 8.0%)
- [x] Ajouter le méthyl-eugénol aux restrictions IFRA (déjà présent - 49th Amendment, 0.0002%)
- [x] Ajouter le bergaptène aux restrictions IFRA (déjà présent - 49th Amendment, 0.0015%)
- [ ] Écrire les tests unitaires pour les procédures IFRA

---

## 🔧 P2 — AMÉLIORATION (Qualité et UX)

### Système d'images botaniques
- [ ] Configurer le stockage S3 pour les images botaniques
- [ ] Créer la procédure tRPC d'upload d'images
- [ ] Créer le composant ImageUpload avec drag & drop
- [ ] Ajouter la prévisualisation des images avant upload
- [ ] Intégrer le composant dans les fiches plantes (LeafEconomies)
- [ ] Ajouter la gestion des images multiples par plante
- [ ] Implémenter la suppression d'images
- [ ] Écrire les tests unitaires pour le système d'upload

### Visualisations avancées
- [ ] Graphe de relations molécule-plante (D3.js)
- [ ] Graphe de relations terroir-plante-molécule
- [ ] Vue détaillée avec toutes les connexions
- [ ] Page terroirs avec carte interactive
- [ ] Améliorer le Diagramme Sankey
- [ ] Améliorer la Heatmap Synergies
- [ ] Améliorer le Graphe Réseau
- [ ] Améliorer le Radar Enrichi

### Système de tags et notes
- [ ] Ajouter le système de tags au schéma de base de données
- [ ] Ajouter le système de notes au schéma de base de données
- [ ] Créer les procédures tRPC pour gérer les tags (CRUD)
- [ ] Créer les procédures tRPC pour gérer les notes (CRUD)
- [ ] Créer l'interface utilisateur pour ajouter/modifier les tags
- [ ] Créer l'interface utilisateur pour ajouter/modifier les notes
- [ ] Intégrer les tags dans la recherche avancée

### Graphe de force D3.js pour axes thématiques
- [ ] Installer D3.js dans le projet
- [ ] Créer le composant de graphe de force pour les axes thématiques
- [ ] Implémenter les nœuds pour les références et les axes
- [ ] Implémenter les liens entre références et axes
- [ ] Ajouter les interactions (zoom, drag, hover, click)
- [ ] Créer les filtres pour le graphe (par axe, par famille, par période)
- [ ] Intégrer le graphe dans une nouvelle page dédiée
- [ ] Optimiser les performances pour les grands ensembles de données

---

## 🎨 P3 — UX/UI (Polissage)

### Navigation et structure
- [ ] Simplifier le MegaMenu avec structure plus claire
- [ ] Améliorer la hiérarchie des liens dans le header
- [ ] Réorganiser les sections pour réduire la longueur
- [ ] Améliorer les CTA avec plus de clarté visuelle
- [ ] Ajouter des transitions et micro-interactions

### Cohérence visuelle
- [ ] Vérifier la cohérence typographique sur toutes les pages
- [ ] Harmoniser les styles de cartes
- [ ] Améliorer les états hover et focus
- [ ] Tester le responsive sur différentes tailles d'écran
- [ ] Normaliser les échelles d'intensité (0-10 partout)

### Amélioration des cartes
- [ ] Améliorer les cartes de molécules avec plus d'informations
- [ ] Améliorer les cartes de recettes avec descriptions courtes
- [ ] Ajouter des vues alternatives (grille compacte / liste détaillée)
- [ ] Limiter le badge "Nouveau" aux 30 derniers jours

### Pages à améliorer
- [ ] Améliorer la page Gammes (cohérence visuelle)
- [ ] Améliorer la page Formules de Référence
- [ ] Améliorer la page Recherche Avancée
- [ ] Améliorer l'Éditeur de Formulation
- [ ] Améliorer le Générateur de Formules IA
- [ ] Améliorer le Calculateur
- [ ] Améliorer la page Synergies
- [ ] Améliorer les pages Méthode ABSORBE
- [ ] Améliorer les pages GC-MS et Pyrolyse
- [ ] Améliorer les pages Archives de Terrain
- [ ] Améliorer le Glossaire
- [ ] Améliorer la Timeline
- [ ] Améliorer les pages À propos et Contribuer

---

## 📚 P4 — DONNÉES RELATIONNELLES (Long terme)

### Import des données relationnelles v4
- [ ] Analyser les fichiers du pack v4 (BibTeX, CSV, ZIP)
- [ ] Créer le script d'import pour les références v4
- [ ] Importer les nouvelles références génomiques
- [ ] Lier les références v4 aux axes thématiques existants

### Tables relationnelles
- [ ] Créer les tables pour les données relationnelles (regions, plants, varieties, molecules)
- [ ] Importer les 7 régions (Colombia, San Andrés, Burkina Faso, Caribbean, Global)
- [ ] Importer les 6 plantes (Cannabis sativa, Nicotiana tabacum, etc.)
- [ ] Importer les 9 variétés (CBDRx, Pink Pepper, Cherry Pie, etc.)
- [ ] Importer les 19 molécules (cannabinoïdes, terpènes, alcaloïdes, TSNAs)
- [ ] Créer les tables de relations (plant_variety, plant_molecule, variety_molecule, etc.)
- [ ] Importer les relations plantes-molécules, variétés-références, etc.

### Liaisons références-entités
- [ ] Lier les références H2 (durabilité) aux plantes menacées (leaf_economies)
- [ ] Lier les références H3 (traditions antiques) aux traditions olfactives documentées
- [ ] Créer les procédures tRPC pour gérer les liaisons
- [ ] Créer l'interface de visualisation des liaisons

### Heritage & Conservation
- [ ] Importer les références avec métadonnées (DOI, auteurs, année)
- [ ] Créer les axes thématiques génomiques si nécessaire
- [ ] Valider l'intégrité des données importées
- [ ] Créer les tests vitest pour les nouvelles fonctionnalités
- [ ] Tester l'interface Heritage & Conservation
- [ ] Tester les liaisons références-entités
- [ ] Valider l'import du pack v4

---

## 🧪 TESTS & QUALITÉ

### Tests à écrire
- [ ] Écrire les tests unitaires pour les nouvelles procédures tRPC
- [ ] Tests d'intégration des relations
- [ ] Tester l'interface sur desktop et mobile
- [ ] Valider les performances du graphe D3.js
- [ ] Créer les tests vitest pour les nouvelles fonctionnalités

### Corrections techniques
- [ ] Corriger les erreurs TypeScript restantes (finalRecipes functions)
- [ ] Corriger les erreurs TypeScript restantes dans db.ts
- [ ] Vérifier la compilation TypeScript sans erreurs
- [ ] Valider le fonctionnement du serveur de développement

---

## 🛠️ DETTE TECHNIQUE

### Nettoyage effectué (08 Jan 2026)
- [x] Archiver les 116 sessions précédentes dans `todo-archive-2026-01-08.md`
- [x] Restructurer le todo.md avec une structure claire par priorité
- [x] Documenter l'état réel du projet

### À faire
- [x] Implémenter les mutations CRUD complètes pour families (create, update, delete)
- [x] Implémenter les mutations CRUD complètes pour accords (create, update, delete)
- [x] Implémenter les mutations update et delete pour laboratoire
- [ ] Vérifier les fonctionnalités annoncées vs implémentées
- [ ] Supprimer le code mort et les composants inutilisés
- [ ] Mettre à jour la documentation technique
- [ ] Créer le composant AxisForceGraph (D3.js)
- [ ] Créer l'interface utilisateur pour les références v3

---

## 🎯 ROADMAP 2026

### Q1 2026 (Jan-Mar) — Consolidation
| Semaine | Objectif | Statut |
|---------|----------|--------|
| S1-2 | Interface contributeur basique | ✅ Complété |
| S3-4 | Système de liaisons amélioré | 🔄 En cours |
| S5-6 | Import CSV avec prévisualisation | ⏳ À faire |
| S7-8 | Système brouillons/validation | ⏳ À faire |
| S9-10 | Tests utilisateurs (5 collègues) | ⏳ À faire |
| S11-12 | Corrections UX | ⏳ À faire |

### Q2-Q4 2026 — Expansion
- Enrichissement automatique des données scientifiques
- Intégration d'APIs externes (PubChem, IFRA)
- Visualisations avancées (réseaux, cartes, graphes D3.js)
- Import des données relationnelles v4

---

## 📌 NOTES IMPORTANTES

- **Projet long terme (10 ans)** : Priorité à la stabilité et la maintenabilité
- **5 collègues contributeurs** : L'interface doit être intuitive et sécurisée
- **Données scientifiques** : Toujours vérifier les sources et la qualité
- **Checkpoints réguliers** : Créer un checkpoint après chaque fonctionnalité majeure

---

## 🔗 LIENS UTILES

| Page | URL | Description |
|------|-----|-------------|
| Hub Admin | `/admin` | Centre de gestion |
| Interface Contributeur | `/contributor` | Ajout molécules/plantes |
| Liaisons Plante-Molécule | `/plant-molecule-linking` | Création de liaisons |
| Import CSV | `/admin/import-csv` | Import de données |
| Molécules Admin | `/admin/molecules` | Gestion molécules |
| Accords Admin | `/admin/accords` | Gestion accords |
| Familles Admin | `/admin/familles` | Gestion familles |
| Matières Admin | `/admin/matieres` | Gestion matières premières |



---

## 📚 RÉFÉRENCES À INTÉGRER (Bibliographie)

### Nouvelles références (08 Jan 2026)
- [x] Intégrer "Terpenes and Terpenoids in Cannabis sativa" (Sommano et al., 2020) - DOI: 10.1016/j.foodchem.2020.127491
- [x] Intégrer "Terpenes from Forests and Human Health" (Antonelli et al., 2020) - DOI: 10.3390/toxins12040232
- [x] Intégrer "Terpene Synthases and Their Contribution to Herbivore-Induced Volatile Emission in Western Balsam Poplar" (Irmisch et al., 2014) - DOI: 10.1186/1471-2229-14-270
- [x] Importé 16 références supplémentaires (patrimoine olfactif, tabac/cannabis, terpenes)

---

## 🆕 NOUVELLES TÂCHES (08 Jan 2026 - Session courante)

### Objectif de couverture molécule→plante (10%)
- [x] Analyser la couverture actuelle molécule→plante
- [x] Créer un tableau de bord de suivi de la couverture (`/coverage-goal`)
- [x] Identifier les molécules prioritaires à lier
- [x] Créer une interface dédiée pour atteindre l'objectif 10%

### Formulaires d'entrée de données simplifiés
- [x] Concevoir les formulaires simplifiés pour contributeurs
- [x] Créer le formulaire simplifié d'ajout de molécule (`/contributor/simple`)
- [x] Créer le formulaire simplifié d'ajout de plante (`/contributor/simple`)
- [x] Créer le formulaire simplifié de liaison molécule-plante (`/contributor/simple`)
- [x] Ajouter des guides/tooltips pour chaque champ

### Validation des données avant import CSV
- [x] Créer le système de validation des données CSV (`/csv-validation-import`)
- [x] Ajouter la détection des erreurs de format (CAS, formules, pourcentages)
- [x] Ajouter la détection des doublons potentiels
- [x] Créer l'interface de prévisualisation avec erreurs
- [x] Permettre la correction des erreurs avant import final


---

## 🔥 SESSION ACTIVE — 08 Jan 2026 (Soir)

### Tâches demandées par l'utilisateur
- [x] Enrichir les données molécule-plante (ajouter plus de relations) — 107 nouvelles liaisons créées
- [x] Configurer le stockage S3 pour les images botaniques
- [x] Créer la procédure tRPC d'upload d'images botaniques
- [x] Créer le composant ImageUpload avec drag & drop (BotanicalImageUpload.tsx)
- [x] Écrire les tests unitaires vitest pour les procédures IFRA — 22 tests passés


---

## 🔥 SESSION ACTIVE — 08 Jan 2026 (Nuit)

### Tâches demandées par l'utilisateur
- [x] Intégrer BotanicalImageUpload dans les fiches LeafEconomies
- [x] Ajouter les plantes manquantes (Gingembre, Sauge sclarée, Pin sylvestre, Tea tree, Cardamome)
- [x] Ajouter les molécules manquantes (13 molécules ajoutées)
- [x] Créer les liaisons plantes-molécules pour les nouvelles entrées (15 liaisons)
- [x] Tester l'upload d'images depuis l'interface (21 tests passés)
