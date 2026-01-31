
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
