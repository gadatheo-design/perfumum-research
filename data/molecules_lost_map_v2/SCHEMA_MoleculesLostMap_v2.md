# PERFUMUM — MoleculesLostMap (v2)

_Généré le 2026-01-07_

v2 ajoute :
1) **Entity linking** : remplissage `entity_type/entity_id/entity_name` par matching de mots-clés (plantes/variétés + matières animales).
2) **methods_catalog_v1.csv** : référentiel des méthodes analytiques (GC–MS, LC–HRMS, GC×GC–TOFMS, HS‑SPME, herbarium aDNA).
3) **method_id** dans `molecules_lost_map_seed_v2.csv` pour relier chaque evidence à une méthode standardisée.
4) Extension légère de la table molécules (marqueurs perfumerie supplémentaires : indole, eugenol, coumarin…)

## Fichiers
- `molecules_seed_lostmap_v2.csv` (PK: molecule_id)
- `molecules_lost_map_seed_v2.csv` (PK: evidence_id)
- `methods_catalog_v1.csv` (PK: method_id)
- `SCHEMA_MoleculesLostMap_v2.md`

## Import order (recommandé)
1. `methods_catalog_v1.csv`
2. `molecules_seed_lostmap_v2.csv`
3. `molecules_lost_map_seed_v2.csv`

## Notes sur le linking
- Le linking est **heuristique** (keyword match). Les champs :
  - `claim_summary` contient un “Keyword match: …” (audit trail).
  - `confidence` reste la variable centrale (low/medium/high).
- Pour une intégration robuste : ajouter une étape de validation manuelle ou un champ `verified_by`.

## Règles de prudence
- Dataset documentaire uniquement : **pas de ratios** ni de guidance d’optimisation.
- TSNAs : stockés comme **context/risk marker** (pas d’usage prescriptif).
