
## Session 30 janvier 2026 - Partie 8

- [x] Afficher les méthodes analytiques sur MoleculeDetail
  - [x] Créer procédure tRPC getByMoleculeId dans methods router
  - [x] Créer composant MoleculeAnalyticalMethods
  - [x] Intégrer dans MoleculeDetail.tsx
  - [x] Ajouter tests unitaires (6 tests passés)

## Session 31 janvier 2026 - Enrichissement liaisons molécule-méthode

- [x] Enrichir les liaisons molecule_analytical_methods avec données réelles
  - [x] Analyser la structure de la table et données existantes
  - [x] Créer script d'enrichissement intelligent (enrich-molecule-methods.mjs)
  - [x] Peupler avec données réalistes (15 laboratoires, dates 2015-2024)
  - [x] 2020 liaisons créées (1222 ajoutées + 684 mises à jour)
  - [x] 1906 liaisons avec données complètes
  - [x] Tests unitaires (8 tests passés)

## Session 31 janvier 2026 - Corrections UI

- [x] Corriger affichage page Perique (afficher 278 composés au lieu de 2)
  - [x] Identifier le problème d'affichage (db.execute retourne [rows, fields])
  - [x] Corriger getPeriqueCompounds pour extraire les rows correctement
- [x] Intégrer tabac et cannabis dans page Chemotype
  - [x] Ajouter chémotypes tabac (Perique, Latakia, Mapacho, Oriental, Yenidje, Ambil)
  - [x] Ajouter chémotypes cannabis (Hindu Kush, Ketama, Cannabis sativa/indica/CBD)
  - [x] 9 tabacs et 7 cannabis avec chémotypes détaillés
- [x] Analyser fichier Commence.zip
  - [x] Extraire et inventorier le contenu (44 fichiers MD + 6 images)
  - [x] Synthétiser les données utiles (voir docs/analyse-commence-zip.md)
  - [x] Proposer implémentation en 5 phases

### Contenu identifié :
- 40+ recettes de cigarillos (3 collections)
- 10+ protocoles techniques
- 14 landraces cannabis + 8 tabacs anciens
- 10 molécules osmothèque
- Recherche sensorielle (Cain 1987, Rees 2025)

## Session 31 janvier 2026 - Nouvelles sections

- [x] Créer section Recettes avec 40+ formulations
  - [x] Schéma DB pour recettes et ingrédients (cigarillo_recipes, cigarillo_recipe_ingredients)
  - [x] Importer données depuis Commence.zip (40 recettes)
  - [x] Créer pages UI (CigarilloRecipes + RecipeDetail)
  - [x] Routes: /recettes-cigarillos, /recettes/:slug

- [x] Importer 14 landraces cannabis
  - [x] Schéma DB pour landraces et terpènes (cannabis_landraces, landrace_terpenes)
  - [x] Script d'import avec profils terpéniques (14 landraces)
  - [x] Créer pages UI (CannabisLandraces + LandraceDetail)
  - [x] Routes: /landraces, /landraces/:slug

- [x] Ajouter protocoles techniques
  - [x] Schéma DB pour protocoles et étapes (technical_protocols, protocol_steps)
  - [x] Importer protocoles (10 protocoles: cryo, nébulisation, maturation, etc.)
  - [x] Créer pages UI (TechnicalProtocols + ProtocolDetail)
  - [x] Routes: /protocoles, /protocoles/:slug
  - [x] Tests unitaires (9 tests passés)

## Session 31 janvier 2026 - Enrichissement et Navigat- [x] Peupler les ingrédients des recettes de cigarillos
  - [x] Créer script d'import des compositions détaillées
  - [x] 24 recettes importées avec 74 ingrédients
  - [ ] Afficher les ingrédients sur RecipeDetail

- [x] Ajouter navigation vers nouvelles sections
  - [x] Ajouter section "Recherche Spécialisée" sur la page d'accueil
  - [x] Liens vers Recettes Cigarillos, Landraces, Protocoles, Documentation

- [x] Importer 10 molécules osmothèque historiques
  - [x] Créer script d'import (import-osmotheque-molecules.mjs)
  - [x] 8 nouvelles molécules + 2 mises à jour
  - [x] Notes historiques et statut réglementaire inclus ] Ajouter les données historiques et olfactives
  - [ ] Lier aux références bibliographiques
