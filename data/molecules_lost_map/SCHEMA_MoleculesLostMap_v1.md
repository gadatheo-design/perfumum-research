# PERFUMUM — MoleculesLostMap (v1)

_Généré le 2026-01-07_

Objectif : seed dataset pour relier des **molécules marqueurs** (terpènes, alcaloïdes, odorants clés) à des **preuves** issues de la littérature,
dans l’optique « variétés anciennes / molécules disparues / transformations temporelles ».  
Cette couche est pensée pour alimenter un **graphe** (knowledge graph) sans imposer de ratios.

## Fichiers
- `molecules_seed_lostmap_v1.csv`
- `molecules_lost_map_seed_v1.csv`

## Table: molecules_seed_lostmap_v1.csv
Colonnes :
- `molecule_id` (PK)
- `name`
- `class`
- `formula`
- `notes`

## Table: molecules_lost_map_seed_v1.csv
Chaque ligne = un **lien evidence** entre une molécule et une référence (et potentiellement une variété/plante/région).

Colonnes clés :
- `evidence_id` (PK)
- `molecule_id`, `molecule_name`
- `marker_type` (ex: *oxidation marker*, *volatile marker*, *time-series potential*)
- `process_context` (ex: *aging/oxidation*, *curing/processing*, *herbarium metabolomics*)
- `method` (GC–MS, LC–HRMS, HS-SPME-GC-MS, etc.)
- `time_context` (optionnel; à enrichir)
- `region_context` (optionnel; à enrichir)
- `entity_type` / `entity_name` / `entity_id` (optionnel; pour lier à **plants/varieties/products**)
- `claim_summary` (champ libre court, non-citationnel)
- `confidence` (low/medium/high)
- `reference_id`, `reference_title`, `doi`, `url`, `tags`, `notes`

## Règles de prudence
- Pas de proportions, pas de recettes, pas de guidance d’optimisation.
- Utiliser `confidence` pour distinguer :
  - **high** : biomarker très établi (ex: CBN comme marqueur d’oxydation/ancienneté)
  - **medium** : association fréquente mais dépend du contexte
  - **low** : piste / marqueur de section (à consolider par données)

## Next enrichment (recommandé)
1. Ajouter des entités `plants/varieties` (IDs) et remplir `entity_type/name/id`
2. Renseigner `time_context` & `region_context` (ex: Colombie / Burkina / Caraïbes)
3. Ajouter une table `methods_catalog.csv` (SOP + limites) si nécessaire
