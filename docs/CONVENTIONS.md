# PERFUMUM — Conventions et Standards de Données

## 1. Architecture Modulaire

### Principes Fondamentaux
- **Extensibilité** : Toutes les tables sont conçues pour accepter de nouveaux champs via JSON
- **Traçabilité** : Chaque entrée possède `created_at` et `updated_at`
- **Relations** : Utilisation de tables de liaison pour les relations many-to-many
- **Versioning** : Les données critiques peuvent être versionnées via le champ `notes`

### Structure des Modules
```
Molécules (molecules)
├── Familles olfactives (families)
├── Origines géographiques (geographic_origins)
├── Restrictions IFRA (ifra_restrictions)
└── Synergies (synergies)

Plantes (plants)
├── Variétés (plant_varieties)
├── États botaniques (botanical_states)
├── Terroirs (terroirs)
├── Méthodes d'extraction (extraction_methods)
├── Échantillons (plant_samples)
└── Analyses (plant_analyses)

Recettes (recettes)
├── Accords (accords)
├── Profils terpéniques (terp_profiles)
└── Recettes finales (final_recipes)
```

## 2. Conventions de Nommage

### Identifiants Uniques
| Entité | Format | Exemple |
|--------|--------|---------|
| Molécule | MOL-XXX | MOL-001, MOL-192 |
| Recette | REC-XXX | REC-001, REC-195 |
| Plante | PLT-XXX | PLT-001, PLT-050 |
| Variété | PV-XXX | PV-001, PV-025 |
| Terroir | TER-XXX | TER-001, TER-007 |
| État botanique | BS-XXX | BS-001, BS-020 |
| Échantillon | SAM-XXX | SAM-001, SAM-100 |
| Analyse | ANA-XXX | ANA-001, ANA-050 |
| Fournisseur | SUP-XXX | SUP-001, SUP-015 |
| Méthode extraction | EXT-XXX | EXT-001, EXT-007 |
| Origine géographique | GEO-XXX | GEO-001, GEO-020 |
| Restriction IFRA | IFRA-XXX | IFRA-001, IFRA-100 |

### Noms de Champs
- **snake_case** pour les colonnes SQL : `created_at`, `plant_id`
- **camelCase** pour les propriétés JSON : `molecularProfile`, `dominantNotes`
- **Préfixes standards** :
  - `is_` pour les booléens : `is_primary_origin`
  - `_id` pour les clés étrangères : `plant_id`, `molecule_id`
  - `_at` pour les timestamps : `created_at`, `updated_at`

## 3. Classification Taxonomique

### Hiérarchie Botanique
```
Règne (Kingdom) → Plantae
├── Division (Phylum) → Magnoliophyta, Pinophyta, etc.
│   ├── Classe (Class) → Magnoliopsida, Liliopsida, etc.
│   │   ├── Ordre (Order) → Lamiales, Asterales, etc.
│   │   │   ├── Famille (Family) → Lamiaceae, Asteraceae, etc.
│   │   │   │   ├── Genre (Genus) → Lavandula, Mentha, etc.
│   │   │   │   │   └── Espèce (Species) → angustifolia, piperita, etc.
```

### Format des Noms Latins
- Genre en majuscule italique : *Lavandula*
- Espèce en minuscule italique : *angustifolia*
- Variété avec "var." : *Lavandula angustifolia* var. *delphinensis*
- Cultivar entre guillemets : *Lavandula angustifolia* 'Hidcote'

## 4. Axes Climatiques ABSORBE

### Définitions
| Axe | Description | Molécules Associées |
|-----|-------------|---------------------|
| **Vent** | Fraîcheur, mouvement, volatilité | Limonène, Linalol, Eucalyptol |
| **Bois** | Structure, profondeur, tenue | Cédrol, Vétivérol, Santalol |
| **Disparition** | Évanescence, subtilité, mémoire | Muscs, Ambroxan, Iso E Super |

### Combinaisons
- `vent` : Fraîcheur pure
- `bois` : Structure pure
- `disparition` : Évanescence pure
- `vent_bois` : Fraîcheur structurée
- `bois_disparition` : Structure évanescente
- `vent_disparition` : Fraîcheur évanescente
- `vent_bois_disparition` : Équilibre complet

## 5. États Botaniques

### Stades Standards
| Code | Nom | Description |
|------|-----|-------------|
| G | Germination | Émergence, premiers tissus |
| V | Végétatif | Croissance foliaire active |
| F | Floraison | Production de fleurs |
| FR | Fructification | Formation des fruits/graines |
| S | Sénescence | Déclin, jaunissement |
| D | Dormance | Repos végétatif |

### Profil Moléculaire par Stade
Chaque stade possède un profil moléculaire distinct :
- **Végétatif** : Chlorophylle, terpènes verts
- **Floraison** : Esters, alcools floraux
- **Fructification** : Aldéhydes, lactones
- **Sénescence** : Composés oxydés, notes tabac

## 6. Méthodes d'Extraction

### Codes Standards
| Code | Méthode | Température | Pression |
|------|---------|-------------|----------|
| DIST-VAP | Distillation vapeur | 100°C | Atmosphérique |
| HYDRO | Hydrodistillation | 100°C | Atmosphérique |
| CO2-SC | CO² supercritique | 31-50°C | 74-300 bar |
| SOLV | Extraction solvant | Variable | Atmosphérique |
| EXPR | Expression à froid | Ambiante | Mécanique |
| ENFL | Enfleurage | Ambiante | Atmosphérique |
| MAC | Macération | Variable | Atmosphérique |

## 7. Qualité et Certification

### Niveaux de Qualité
- ★★★★★ : Qualité exceptionnelle, traçabilité complète
- ★★★★ : Haute qualité, origine certifiée
- ★★★ : Qualité standard, origine connue
- ★★ : Qualité acceptable, origine approximative
- ★ : Qualité basique, origine inconnue

### Certifications
- **Bio** : Agriculture biologique certifiée
- **AOP** : Appellation d'Origine Protégée
- **IGP** : Indication Géographique Protégée
- **Fair Trade** : Commerce équitable
- **Wild** : Récolte sauvage durable

## 8. Formats de Données

### Dates
- Format ISO 8601 : `2025-01-03T17:00:00Z`
- Timestamps Unix pour les calculs
- Affichage localisé en français

### Coordonnées GPS
- Latitude : décimal, 7 chiffres après la virgule
- Longitude : décimal, 7 chiffres après la virgule
- Exemple : `43.7102000, 7.2620000` (Grasse)

### Pourcentages
- Précision : 2 décimales
- Format : `decimal(5, 2)` → 0.00 à 999.99

### JSON Arrays
```json
{
  "molecules": ["Limonène", "Linalol", "Géraniol"],
  "percentages": [45.2, 23.1, 12.8],
  "notes": "Profil typique lavande fine"
}
```

## 9. Règles de Saisie

### Obligatoires
- Identifiant unique
- Nom (commun ou latin)
- Date de création

### Recommandés
- Description olfactive
- Axe climatique ABSORBE
- Source/référence

### Optionnels
- Images
- Notes personnelles
- Liens externes

## 10. Versioning des Données

### Historique des Modifications
- Chaque modification majeure est documentée
- Les anciennes valeurs peuvent être conservées dans `notes`
- Format : `[YYYY-MM-DD] Modification : ancien → nouveau`

### Sauvegarde
- Checkpoints réguliers via le système de versioning
- Export JSON pour archivage
- Synchronisation avec fichiers sources

---

*Document créé le 03 janvier 2026*
*PERFUMUM — Recherche Olfactive Expérimentale*
*Méthodologie ABSORBE*
