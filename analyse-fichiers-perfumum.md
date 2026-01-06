# Analyse des fichiers du projet PERFUMUM

**Rapport d'analyse structurelle et fonctionnelle**  
*Date : 6 janvier 2026*

---

## Résumé exécutif

Le corpus de 60 fichiers fournis constitue une base de données de recherche complète et bien structurée pour le projet PERFUMUM. Ces fichiers s'organisent autour de **6 axes de recherche** distincts, complétés par des **datasets scientifiques** au format CSV et un **glossaire** terminologique. L'architecture adoptée suit un modèle de **knowledge graph** permettant de relier entités, protocoles, notes de recherche et données expérimentales.

---

## 1. Architecture globale des données

### 1.1 Structure par type de contenu

Le corpus se divise en deux catégories principales : les **documents Markdown** (44 fichiers) contenant le contenu éditorial et méthodologique, et les **fichiers CSV** (16 fichiers) contenant les données structurées.

| Catégorie | Nombre de fichiers | Format | Fonction |
|-----------|-------------------|--------|----------|
| Overviews (axes) | 6 | Markdown | Présentation des axes de recherche |
| Notes de recherche | 18 | Markdown | Hypothèses et réflexions de travail |
| Études de cas | 6 | Markdown | Applications concrètes des concepts |
| Protocoles | 12 | Markdown | Procédures opérationnelles standardisées |
| Glossaire | 1 | Markdown | Définitions terminologiques |
| Index de contenu | 1 | CSV | Métadonnées de tous les documents |
| Datasets scientifiques | 15 | CSV | Données expérimentales et opérationnelles |

### 1.2 Les 6 axes de recherche

Le projet PERFUMUM s'articule autour de six axes thématiques complémentaires, chacun disposant d'un identifiant unique et d'un ensemble cohérent de ressources.

| ID Axe | Nom de l'axe | Thématiques clés | Régions couvertes |
|--------|--------------|------------------|-------------------|
| AX1_GENOMIC_CONSERVATION | Génomique olfactive et conservation ex-situ | Genomics, Conservation, Terpene synthase, Cryo | Colombia, Caribbean, Burkina Faso |
| AX2_ETHNOBOTANY_COMP | Ethnobotanique computationnelle | Ethnobotany, NLP, OCR, Knowledge graph | Colombia, Ottoman, India, China |
| AX3_ANALYTICAL_TRANS_EPOCH | Chimie analytique comparative trans-époques | Analytical chemistry, GC-MS, Herbarium, Climate | Colombia, Mediterranean, Burkina Faso |
| AX4_CONSERVATION_BIOTECH | Biotechnologies de conservation | Tissue culture, Fermentation, Biobank, Green biotech | Colombia, Burkina Faso, Caribbean |
| AX5_IMMERSIVE_DEMOCRAT | Technologies immersives et démocratisation | VR, Citizen science, Education, Smellscape | Caribbean, Colombia, Burkina Faso |
| AX6_OLFACTIVE_DIPLOMACY | Diplomatie olfactive et soft power culturel | Partnerships, Fellowships, Cultural heritage, Open data | Colombia, Burkina Faso, Caribbean, UK, Canada, France |

---

## 2. Analyse des documents Markdown

### 2.1 Structure des métadonnées (frontmatter YAML)

Tous les documents Markdown suivent une structure de métadonnées standardisée en frontmatter YAML, garantissant une indexation cohérente et une navigation facilitée.

```yaml
id: [identifiant unique]
slug: [URL-friendly identifier]
axis_id: [référence à l'axe parent]
title: [titre complet]
type: [axis_overview | research_note | case_study | protocol | glossary]
lang: fr
status: published
tags: [liste de mots-clés]
regions: [liste de régions géographiques]
evidence_level: [confirmed | probable | hypothetical]
created_at: [date ISO]
updated_at: [date ISO]
```

Cette structure permet de filtrer le contenu par **région**, **niveau de preuve** et **type de document**, conformément aux spécifications de navigation mentionnées dans les overviews.

### 2.2 Types de documents et leur utilité

**Overviews (6 fichiers)** : Ces documents définissent le cadre conceptuel de chaque axe de recherche. Ils précisent ce que l'axe produit sur le site, les modalités de navigation pour le lecteur, les délivrables concrets attendus (MVP) et les principes éditoriaux à respecter. Chaque overview mentionne explicitement la matrice climatique (`climate_axis_medium_matrix.csv`) comme outil de basculement entre les modes "parfum ↔ encens ↔ espace".

**Notes de recherche (18 fichiers, 3 par axe)** : Ces documents constituent le journal de bord intellectuel du projet. Ils formulent des hypothèses de travail, définissent les modules de contenu à produire, établissent les liens avec le graphe de connaissances et précisent le niveau de preuve actuel. Leur niveau de preuve est systématiquement marqué comme "hypothetical", indiquant leur caractère exploratoire.

**Études de cas (6 fichiers)** : Ces documents illustrent l'application concrète des concepts développés dans chaque axe. Par exemple, l'étude de cas de l'axe génomique documente la diversité olfactive entre îles des Caraïbes via un protocole non destructif, produisant des échantillons génomiques et des profils moléculaires.

**Protocoles (12 fichiers, 2 par axe)** : Ces documents décrivent des procédures opérationnelles standardisées, incluant le matériel nécessaire, les étapes à suivre et les outputs attendus. Ils sont conçus pour être directement implémentables et produire des fichiers importables dans la base PERFUMUM.

### 2.3 Glossaire

Le glossaire définit les termes techniques essentiels du projet : Terpene synthase (TPS), Chimiotype, GC-MS, HS-SPME, Cryoconservation, Knowledge graph et Niveau de preuve. Ce document sert de référence terminologique pour assurer la cohérence du vocabulaire à travers l'ensemble du projet.

---

## 3. Analyse des datasets CSV

### 3.1 Index de contenu (content_index.csv)

Ce fichier constitue le **registre central** de tous les documents du projet. Il contient 44 entrées avec les métadonnées complètes de chaque document : identifiant, slug, axe parent, titre, type, langue, statut, chemin de fichier, niveau de preuve, tags, régions et dates de création/modification. Ce fichier est essentiel pour la génération dynamique de la navigation et des filtres sur le site.

### 3.2 Datasets scientifiques par domaine

#### Génomique et conservation

| Dataset | Entrées | Champs clés | Utilité |
|---------|---------|-------------|---------|
| genome_samples_seed.csv | 10 | sample_id, plant_latin_name, population_code, region, collection_method, non_destructive, storage | Inventaire des échantillons génomiques collectés |
| genome_sequences_seed.csv | 10 | sequence_id, sample_id, target_genes, platform, assembly_level, qc, data_location | Suivi des séquençages réalisés (TPS, DXS, HDR) |

Ces datasets documentent la chaîne complète de la collecte génomique, depuis le prélèvement non destructif (pollen, feuilles tombées, graines) jusqu'au séquençage sur plateformes Illumina ou Nanopore.

#### Chimie analytique

| Dataset | Entrées | Champs clés | Utilité |
|---------|---------|-------------|---------|
| gcms_runs_seed.csv | 12 | run_id, sample_ref, method, standards, top_compounds | Résultats d'analyses GC-MS/HS-SPME |
| herbarium_samples_seed.csv | 12 | herbarium_id, plant_latin_name, year, sample_type, allowed_sampling | Inventaire des échantillons d'herbier |
| compound_trends_seed.csv | 25 | plant_latin_name, compound, year, relative_percent_estimate | Évolution temporelle des composés (1950-2025) |

Ces datasets permettent de tracer l'évolution des profils chimiques des plantes aromatiques à travers le temps, en comparant des échantillons d'herbier historiques avec des analyses contemporaines.

#### Biotechnologies

| Dataset | Entrées | Champs clés | Utilité |
|---------|---------|-------------|---------|
| tissue_culture_lines_seed.csv | 10 | line_id, plant_latin_name, method, status, storage | Registre des lignées de culture tissulaire |
| fermentation_runs_seed.csv | 10 | run_id, target_molecule, host, yield_g_l, purity_percent | Suivi des fermentations (biosynthèse) |

Ces datasets documentent les efforts de conservation ex-situ par culture tissulaire (callus, méristèmes) et la production de molécules aromatiques par fermentation (linalool, patchoulol, ambroxide, sclareol).

#### Ethnobotanique et histoire

| Dataset | Entrées | Champs clés | Utilité |
|---------|---------|-------------|---------|
| manuscripts_seed.csv | 10 | manuscript_id, title, language, date_range, repository, ocr_status | Inventaire des manuscrits historiques |
| text_fragments_seed.csv | 20 | fragment_id, manuscript_id, entities, evidence_level | Fragments textuels extraits avec entités identifiées |
| trade_routes_seed.csv | 6 | route_id, name, time_start, time_end, nodes, materials | Routes commerciales historiques des aromates |

Ces datasets permettent de reconstituer l'histoire des échanges olfactifs à travers les manuscrits anciens (Sanskrit, Arabe, Ottoman, Chinois classique) et les routes commerciales du mastic, labdanum et encens.

#### Science citoyenne et partenariats

| Dataset | Entrées | Champs clés | Utilité |
|---------|---------|-------------|---------|
| citizen_observations_seed.csv | 20 | obs_id, user_handle, plant_guess, lat, lon, confidence_ai, status | Observations citoyennes géolocalisées |
| partners_seed.csv | 15 | partner_id, name, country, type, focus, mou_status | CRM des partenaires institutionnels |
| fellowships_seed.csv | 6 | fellowship_id, title, region_focus, budget_chf, deliverables | Programme de bourses "Gardiens du patrimoine" |
| impact_metrics_seed.csv | 5 | year, genomes_sequenced_target, chemical_profiles_target, citizen_contributors_target | Objectifs annuels (2026-2030) |

Ces datasets supportent les dimensions participatives et institutionnelles du projet, incluant la validation des observations citoyennes par IA et le suivi des partenariats avec Kew Gardens, CNRS Grasse, IUCN, etc.

#### Formulation et création

| Dataset | Entrées | Champs clés | Utilité |
|---------|---------|-------------|---------|
| climate_axis_medium_matrix.csv | 12 | climate_axis, medium, target_diffusion, volatility_bias, carrier_or_support | Matrice de déclinaison parfum/encens/espace |
| scent_blends_space_seed.csv | 12 | blend_id, climate_axis, intended_medium, concept, materials | Formules de mélanges olfactifs |

Ces datasets permettent de traduire les données scientifiques en créations olfactives, en adaptant les formulations selon le médium (parfum, encens, diffusion spatiale) et l'axe climatique (vent, bois, peau, disparition).

---

## 4. Relations et graphe de connaissances

### 4.1 Structure relationnelle

Les données sont conçues pour former un **knowledge graph** interconnecté. Les relations principales identifiées sont :

- **genome_samples → genome_sequences** : via `sample_id`
- **herbarium_samples → gcms_runs** : via `sample_ref` (HB_XXXX)
- **manuscripts → text_fragments** : via `manuscript_id`
- **text_fragments → entités** : via le champ JSON `entities` (plantes, lieux, molécules)
- **content_index → tous les documents** : via `id` et `axis_id`

### 4.2 Système de tags et filtres

Le système de tags permet une navigation transversale entre les axes. Les tags récurrents incluent : Genomics, Conservation, Terpene synthase, Cryo, Ethnobotany, NLP, OCR, Knowledge graph, Analytical chemistry, GC-MS, Herbarium, Climate, Tissue culture, Fermentation, Biobank, VR, Citizen science, Partnerships, Fellowships, Cultural heritage, Open data.

---

## 5. Recommandations pour l'intégration

### 5.1 Modèle de données pour la base de données

Pour intégrer ces fichiers dans la plateforme web, je recommande la création des tables suivantes dans le schéma Drizzle :

1. **content** : stockage des documents Markdown avec métadonnées
2. **axes** : définition des 6 axes de recherche
3. **genome_samples**, **genome_sequences** : données génomiques
4. **herbarium_samples**, **gcms_runs** : données chimiques
5. **manuscripts**, **text_fragments** : données textuelles
6. **trade_routes** : données géographiques historiques
7. **tissue_culture_lines**, **fermentation_runs** : données biotechnologiques
8. **citizen_observations** : données participatives
9. **partners**, **fellowships** : données institutionnelles
10. **scent_blends**, **climate_matrix** : données de formulation
11. **glossary_terms** : définitions terminologiques

### 5.2 Fonctionnalités suggérées pour le site

Sur la base de cette analyse, les fonctionnalités prioritaires pour la plateforme seraient :

1. **Navigation par axe** avec filtres par région et niveau de preuve
2. **Visualisation du knowledge graph** (relations entre entités)
3. **Carte interactive** des routes commerciales et observations citoyennes
4. **Tableaux de données** avec export CSV
5. **Recherche full-text** dans les documents et datasets
6. **Dashboard de métriques** pour le suivi des objectifs annuels
7. **Glossaire interactif** avec liens vers les documents associés

---

## 6. Conclusion

Le corpus fourni constitue une base solide et bien pensée pour le projet PERFUMUM. La structure en 6 axes avec des types de documents standardisés (overview, notes, études de cas, protocoles) et des datasets interconnectés permet une grande flexibilité pour l'ajout de nouvelles données au fil des 10 années de recherche prévues. Le système de niveaux de preuve (confirmed/probable/hypothetical) et la distinction explicite entre données documentées et hypothèses garantissent la rigueur scientifique du projet.

L'architecture adoptée est particulièrement adaptée à une plateforme web évolutive, permettant à la fois la consultation publique des résultats et la gestion interne des données de recherche.

---

*Rapport généré par Manus AI*
