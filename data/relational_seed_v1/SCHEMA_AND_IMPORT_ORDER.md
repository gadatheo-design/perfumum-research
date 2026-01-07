# PERFUMUM — Dataset seed relationnel (Cannabis & Tabac) v1
_Généré le 2026-01-07_

Objectif : fournir au développeur un **seed dataset** importable pour relier :
`references ↔ plants ↔ varieties ↔ molecules ↔ regions`

## Import order (recommandé)
1. `regions_seed.csv`
2. `plants_seed.csv`
3. `varieties_seed.csv`
4. `molecules_seed.csv`
5. `references_seed.csv`
6. Tables de relations (toutes les `rel_*.csv`)

## Tables (overview)
- **regions_seed** : régions hiérarchiques (`parent_region_id`)
- **plants_seed** : entités plantes (Cannabis, Nicotiana…)
- **varieties_seed** : cultivars / landraces / accessions
- **molecules_seed** : molécules (cannabinoïdes, terpènes, alcaloïdes, TSNAs)
- **references_seed** : sources (articles/DB) issues de la veille v4

## Relations
- **rel_plant_variety** : une variété appartient à une plante
- **rel_plant_molecule** : association plante ↔ classe moléculaire (seed générique)
- **rel_variety_molecule** : ancres de chimiotypes (sans ratios; à enrichir)
- **rel_plant_reference** : sources attachées à une plante (genomics, review, DB…)
- **rel_variety_reference** : sources attachées à une variété (evidence)
- **rel_molecule_reference** : sources attachées à une molécule (mention)
- **rel_plant_region** : liens entités ↔ régions (focus/origin/context)

## Notes importantes
- Ce seed est **conservateur** : il évite d’affirmer des ratios ou profils exacts par variété.
- Le dev peut ensuite enrichir via :
  - ingestion automatique (PubMed/DOI metadata)
  - extraction de molécules cités dans les papiers
  - pages “chemotype cards” par région (ex: Colombie)

## Champs minimaux recommandés côté DB
- `plants`: plant_id, scientific_name, common_name, family, notes
- `varieties`: variety_id, plant_id, name, type, region_id, notes
- `molecules`: molecule_id, name, class, formula, notes
- `references`: reference_id, title, authors, year, venue, doi, url, tags, notes
