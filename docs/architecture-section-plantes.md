# Architecture de la section « Matières » — Analyse et proposition de refonte

**PERFUMUM — Document de réflexion architecturale**
*Mars 2026 — Version 1.0*

---

## 1. État actuel : diagnostic

### 1.1 La table `plants` en chiffres

| Indicateur | Valeur |
|-----------|--------|
| Entrées totales | 450 |
| Catégorie « autre » | 185 (41%) |
| Catégorie « aromatique » | 127 (28%) |
| Catégorie « résine » | 37 (8%) |
| Catégorie « cannabis » | 32 (7%) |
| Catégorie « fleur » | 28 (6%) |
| Catégorie « tabac » | 19 (4%) |
| Catégorie « bois » | 16 (4%) |
| Catégorie « racine » | 6 (1%) |

La catégorie « autre » représente **41% des entrées** — c'est le signal le plus fort d'une inadéquation structurelle. Ces 185 entrées non classifiables révèlent que la taxonomie actuelle ne couvre pas la réalité du corpus.

### 1.2 Le problème fondamental : confusion entre organisme et matière

La table `plants` mélange actuellement **deux niveaux ontologiques distincts** :

**Niveau 1 — L'organisme biologique** (l'être vivant)
> *Nicotiana tabacum* est une plante. Elle a un nom latin, une famille botanique, une aire de distribution, un statut IUCN, des synonymes, un auteur botanique.

**Niveau 2 — La matière extraite** (le produit)
> La **feuille séchée de Nicotiana tabacum** est une matière. Elle a un mode d'extraction, une texture, une composition moléculaire spécifique, un usage dans une formule.

Ces deux niveaux coexistent actuellement dans la même table avec les mêmes colonnes, ce qui crée des incohérences : une « résine de Boswellia sacra » n'a pas de nom latin propre, pas de statut IUCN, pas de coordonnées GPS — mais elle a un profil olfactif, une viscosité, une méthode d'extraction.

### 1.3 Inventaire des types de matières non couverts

En analysant les 185 entrées « autre » et les catégories existantes, voici les types de matières présents dans le corpus qui n'ont pas de catégorie dédiée :

| Type de matière | Exemples dans le corpus | Champs spécifiques nécessaires |
|----------------|------------------------|-------------------------------|
| **Extrait végétal** | Absolue d'Iris, Concrète de Rose, CO₂ de Gingembre | Méthode d'extraction, solvant, rendement |
| **Résine / Oléorésine** | Benjoin Siam, Myrrhe, Encens Oliban | Viscosité, couleur, point de fusion |
| **Graine / Fruit sec** | Cardamome, Poivre noir, Coriandre | Partie utilisée, teneur en HE |
| **Racine / Rhizome** | Vétiver, Iris, Gingembre | Âge de récolte, profondeur |
| **Écorce / Bois** | Cannelle, Cèdre, Santal | Partie de l'arbre, âge |
| **Mousse / Lichen** | Mousse de Chêne, Evernia prunastri | Substrat, humidité |
| **Algue / Marin** | Algue brune, Sel marin | Milieu, salinité |
| **Champignon** | Truffe, Agaric | Substrat, mycorhizes |
| **Animal / Sécrétions** | Ambre Gris, Musc, Civette | Origine éthique, CITES |
| **Synthétique / Semi-synthétique** | Iso E Super, Ambroxan, Galaxolide | Précurseur, brevet |
| **Accord / Mélange** | Accord Chypre, Fougère, Cuir | Composition, famille olfactive |

---

## 2. Proposition d'architecture refondue

### 2.1 Principe directeur : séparation Organisme / Matière

L'architecture proposée repose sur une distinction claire entre **ce qui vit** (l'organisme) et **ce qui est utilisé** (la matière). Cette séparation est cohérente avec les standards botaniques (GBIF, ITIS, Plants of the World) et avec la pratique parfumerie (IFRA, ECHA, ISO 9235).

```
ORGANISME BIOLOGIQUE          MATIÈRE PREMIÈRE
(Plante, Champignon, Animal)  (Extrait, Résine, Synthétique)
         │                              │
         └──────────── lien ────────────┘
                  "est la source de"
```

### 2.2 Architecture proposée : 3 tables principales

#### Table A — `botanical_sources` (anciennement `plants`)

Recentrée sur **l'organisme biologique uniquement**. Tous les champs nomenclaturaux, géographiques, climatiques et de conservation restent ici.

```
botanical_sources
├── id, name, latin_name, family, genus, species
├── kingdom, division, class, order_name
├── synonyms, author_citation
├── gbif_id, itis_id, pow_id
├── origin, habitat, latitude, longitude
├── koppen_zone, altitude_min/max, precipitation_min/max
├── conservation_status (IUCN), cites_appendix
├── threat_factors, sustainable_alternatives
├── historical_status, last_assessment_year
├── ethnobotanical_uses, historical_significance
└── validation_status, contributor_id
```

**Nouveau champ clé :** `organism_type` (enum)
```
"plante_vasculaire" | "mousse_lichen" | "champignon" | "algue" |
"animal" | "micro_organisme"
```

#### Table B — `raw_materials` (nouvelle)

Représente **la matière première** telle qu'elle est utilisée en parfumerie ou en formulation. Une matière peut avoir une ou plusieurs sources botaniques, ou être entièrement synthétique.

```
raw_materials
├── id, name, common_name, inci_name
├── material_type (enum — voir ci-dessous)
├── plant_part (enum — partie de l'organisme utilisée)
├── extraction_method (enum)
├── olfactive_profile, olfactive_family
├── dominant_molecules (JSON array → liens vers molecules)
├── texture, color, viscosity
├── cas_number, einecs_number
├── ifra_status, ifra_category
├── therapeutic_properties
├── traditional_use, absorbe_use
├── botanical_states (JSON — états A/B/C/D)
├── climatic_axis (Absorbe)
├── notes, image_url
└── validation_status, contributor_id
```

**`material_type`** (enum complet) :
```
"huile_essentielle"     | "absolue"           | "concrete"
"co2_extrait"           | "oleoresine"        | "resine_brute"
"teinture"              | "infusion"          | "macerat"
"beurre_vegetal"        | "cire"              | "hydrolat"
"graine_seche"          | "fruit_sec"         | "ecorce"
"racine_rhizome"        | "bois_copeaux"      | "mousse_lichen"
"secretion_animale"     | "accord_naturel"    | "synthetique_pur"
"semi_synthetique"      | "isole_naturel"     | "autre"
```

**`plant_part`** (enum) :
```
"feuille" | "fleur" | "fruit" | "graine" | "ecorce" | "bois"
"racine"  | "rhizome" | "resine" | "gomme" | "latex" | "mousse"
"lichen"  | "algue"   | "entier" | "secretion" | "autre"
```

#### Table C — `material_sources` (table de liaison)

Relie une matière première à ses sources botaniques, avec le contexte de l'extraction.

```
material_sources
├── id
├── material_id → raw_materials.id
├── source_id → botanical_sources.id
├── plant_part (partie utilisée pour cette source spécifique)
├── extraction_method
├── yield_percentage (rendement d'extraction)
├── quality_grade (enum: "premium" | "standard" | "industriel")
├── origin_terroir_id → terroirs.id (optionnel)
└── notes
```

### 2.3 Schéma de relations complet

```
botanical_sources ──┐
                    ├── material_sources ── raw_materials
terroirs ───────────┘                           │
                                                ├── plant_molecules (molécules)
                                                ├── tabac_accords (accords)
                                                └── recettes (formules)
```

### 2.4 Mapping des catégories actuelles vers la nouvelle architecture

| Catégorie actuelle | Nouvelle table | `material_type` suggéré |
|-------------------|---------------|------------------------|
| `aromatique` | `raw_materials` | `huile_essentielle`, `absolue`, `co2_extrait` |
| `resine` | `raw_materials` | `resine_brute`, `oleoresine`, `gomme` |
| `fleur` | `raw_materials` | `absolue`, `concrete`, `huile_essentielle` |
| `bois` | `raw_materials` | `bois_copeaux`, `huile_essentielle` |
| `racine` | `raw_materials` | `racine_rhizome`, `huile_essentielle` |
| `tabac` | `raw_materials` | `feuille_seche` (nouveau type) |
| `cannabis` | `raw_materials` | `huile_essentielle`, `resine_brute` |
| `autre` (185) | À classifier | Selon analyse individuelle |

Les entrées `tabac` et `cannabis` ont déjà leurs propres tables (`tabacs`, `varieties`) — elles peuvent rester comme tables spécialisées avec un lien vers `botanical_sources` et `raw_materials`.

---

## 3. Plan de migration

### Phase 1 — Ajout du champ `material_type` à la table `plants` (non destructif)

Ajouter une colonne `material_type` à la table existante pour commencer à distinguer les matières sans casser l'existant. Durée estimée : 1 session.

### Phase 2 — Création de la table `raw_materials` et migration des données

Créer la nouvelle table, migrer les 450 entrées en les reclassifiant selon leur type réel. Les entrées purement botaniques restent dans `plants` (renommée `botanical_sources`). Durée estimée : 2-3 sessions.

### Phase 3 — Mise à jour des interfaces

Adapter `PlantDetail.tsx` → `BotanicalSourceDetail.tsx` et créer `RawMaterialDetail.tsx` avec les champs spécifiques à chaque type. Durée estimée : 3-4 sessions.

### Phase 4 — Reclassification des 185 « autre »

Traiter les 185 entrées non classifiées, idéalement avec une interface d'administration dédiée permettant de reclassifier en masse. Durée estimée : 2-3 sessions + saisie manuelle.

---

## 4. Impact sur la navigation

### Navigation actuelle
```
/plantes → liste de toutes les "plantes"
/plante/:slug → fiche détail
```

### Navigation proposée
```
/matieres → hub avec filtres par type
  ├── /matieres/botaniques → organismes vivants (botanical_sources)
  ├── /matieres/extraits → HE, absolues, CO₂ (raw_materials)
  ├── /matieres/resines → résines, gommes, oléorésines
  ├── /matieres/synthetiques → molécules de synthèse
  └── /matieres/accords → accords naturels et mélanges

/botanique/:slug → fiche organisme (nomenclature, conservation, génétique)
/matiere/:slug → fiche matière (extraction, olfactif, formulation)
```

---

## 5. Recommandation

L'approche recommandée est une **migration progressive et non destructive** :

1. **Court terme (prochaines sessions)** : ajouter `material_type` à la table `plants` existante et commencer à reclassifier les 185 « autre » via l'interface admin. Aucune migration de données, aucun risque.

2. **Moyen terme (1-3 mois)** : créer la table `raw_materials` en parallèle de `plants`, migrer les données progressivement, maintenir les deux tables actives pendant la transition.

3. **Long terme (6-12 mois)** : renommer `plants` en `botanical_sources`, supprimer les colonnes redondantes, mettre à jour toutes les interfaces.

Cette approche garantit la **continuité du projet** et permet d'enrichir les données sans interruption de service.

---

*Document généré le 7 mars 2026 — PERFUMUM Research Platform*
