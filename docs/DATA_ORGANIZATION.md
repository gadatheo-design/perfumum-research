# 📊 Organisation des Données PERFUMUM — Plan d'Intégration Complet

## 🎯 Vue d'ensemble

Intégration complète de l'ensemble des données transmises (180+ fichiers) dans le site PERFUMUM avec structure PostgreSQL scalable et pages interactives.

---

## 📁 Catégories de Données Identifiées

### 1. **TABACOTHÈQUE** (Tabacs & Variétés)
**Fichiers sources :**
- `perfumum_tabacotheque_complete_v3.json` (données structurées)
- `PERFUMUMTabacothèqueComplètev3.0.md` (documentation)
- `tabacotheque_data.json` (données brutes)
- `tabacotheque.html` (source web)
- `perfumum_extraction_tabacotheque.md` (extraction)

**Contenu :**
- 100+ variétés de tabac (landraces, cultivars modernes)
- Profils olfactifs et chimiques
- Origines géographiques et terroirs
- Utilisations (pipe, cigare, cigarette)
- Propriétés aromatiques détaillées

**Pages à créer :**
- `/tabacs` - Hub principal avec filtres (région, type, famille olfactive)
- `/tabacs/:id` - Fiche détaillée de chaque variété
- `/tabacs/comparaison` - Outil de comparaison multi-variétés

---

### 2. **TERROIRS DE TABAC** (Pédologie & Géographie)
**Fichiers sources :**
- `perfumum_terroirs_tabac.json` (données)
- `PERFUMUMTerroirsdeTabacv1.0.md` (documentation)
- `analyse_pedologique_detaillee.md` (analyses)
- `comparaison_pedologique_vuelta_esteli.csv` (données comparatives)
- `terroirs_analyse_comparative.png` (visualisation)

**Contenu :**
- Analyses pédologiques détaillées
- Comparaisons géographiques (Vuelta Abajo vs Estelí, etc.)
- Impact du terroir sur les profils chimiques
- Données climatiques et géologiques

**Pages à créer :**
- `/terroirs` - Carte interactive et liste des terroirs
- `/terroirs/:id` - Fiche détaillée avec analyse pédologique
- `/terroirs/comparaison` - Outil de comparaison pédologique

---

### 3. **ADDITIFS DU TABAC** (Alcalinisants & Composants)
**Fichiers sources :**
- `perfumum_additifs_tabac.json` (données)
- `PERFUMUMAdditifsduTabacv1.0.md` (documentation)
- `documentation_additifs.md` (guide)
- `additifs_analyse_comparative.png` (visualisation)

**Contenu :**
- Additifs alcalinisants historiques et modernes
- Composants aromatisants
- Protocoles d'application
- Comparaisons d'efficacité

**Pages à créer :**
- `/additifs` - Hub des additifs avec filtres
- `/additifs/:id` - Fiche détaillée de chaque additif
- `/additifs/protocoles` - Protocoles d'application

---

### 4. **PYRAZINES** (Molécules Aromatiques Clés)
**Fichiers sources :**
- `perfumum_pyrazines.json` (données)
- `PERFUMUMPyrazinesv1.0.md` (documentation)
- `LesPyrazinesL'ÂmeVolcaniqueduTabacd'EstelíetleurPotentielenParfumerie.md` (analyse)
- `pyrazines_analyse_comparative.png` (visualisation)

**Contenu :**
- Profils pyraziniques par variété
- Rôle dans l'arôme volcanique
- Potentiel en parfumerie
- Analyses comparatives

**Pages à créer :**
- `/pyrazines` - Hub des pyrazines
- `/pyrazines/:id` - Fiche détaillée
- `/pyrazines/analyse-comparative` - Comparaisons interactives

---

### 5. **MOLÉCULES AROMATIQUES** (Chimie Complète)
**Fichiers sources :**
- `perfumum_molecules_tabac.json` (données)
- `PERFUMUMMoléculesAromatiquesduTabacv1.0.md` (documentation)
- `Au-delàdesPyrazinesLesMoléculesSecrètesduTabacd'Estelí.md` (analyse)
- `molecules_recherche.md` (recherche)
- `molecules_tabac_analyse.png` (visualisation)

**Contenu :**
- 334+ molécules détaillées (incluant Périque)
- Profils moléculaires complets
- Transformations par pyrolyse
- Potentiel en parfumerie

**Pages à créer :**
- `/molecules` - Hub des molécules avec recherche
- `/molecules/:id` - Fiche détaillée de chaque molécule
- `/molecules/pyrolyse` - Analyse des transformations par pyrolyse

---

### 6. **LANDRACES** (Variétés Patrimoniales)
**Fichiers sources :**
- `perfumum_landraces_tabac.json` (données)
- `perfumum_landraces_monde_v2_complet.json` (données mondiales)
- `PERFUMUMLandracesdeTabac&Terroirsv1.0.md` (documentation)
- `landraces_analyse_complete.png` (visualisation)
- `profils_moleculaires_detailles.json` (profils)

**Contenu :**
- 50+ landraces du monde entier
- Profils moléculaires détaillés
- Études spécifiques (Basma, Latakia, Nicotiana rustica)
- Comparaisons chimiques

**Pages à créer :**
- `/landraces` - Hub des landraces mondiales
- `/landraces/:id` - Fiche détaillée
- `/landraces/comparaison` - Outil de comparaison multi-landraces

---

### 7. **TABACS DISPARUS** (Archive Olfactive)
**Fichiers sources :**
- `perfumum_tabacs_disparus_v1.json` (données)
- `PERFUMUMBasedeDonnéesdesTabacsDisparusv1.0.md` (documentation)
- `tabacs_disparus_recherche.md` (recherche)
- `tabacs_disparus_visualisation.png` (visualisation)

**Contenu :**
- Tabacs historiques disparus
- Profils olfactifs reconstitués
- Substituts modernes
- Archives olfactives

**Pages à créer :**
- `/tabacs-disparus` - Archive des tabacs disparus
- `/tabacs-disparus/:id` - Fiche avec profil reconstitué
- `/tabacs-disparus/substituts` - Substituts modernes

---

### 8. **HYBRIDES & BLENDS** (Créations & Mélanges)
**Fichiers sources :**
- `perfumum_hybrides_tabac.json` (données hybrides)
- `perfumum_blends_tabac.json` (données blends)
- `perfumum_cigarettes_est_orient_chine.json` (cigarettes)
- `comparaison_originaux_modernes.json` (comparaisons)

**Contenu :**
- Hybrides de tabac
- Blends iconiques
- Cigarettes disparues (soviétiques, orientales, chinoises)
- Comparaisons originaux vs modernes

**Pages à créer :**
- `/hybrides` - Hub des hybrides
- `/blends` - Hub des blends
- `/cigarettes-historiques` - Archive des cigarettes

---

### 9. **TRADITIONS TABAC-CANNABIS** (Accords & Protocoles)
**Fichiers sources :**
- `Claims—Traditionstabac–cannabis15a05738f16b415986c08cb8dde0c5e4.csv` (claims)
- `Sources—Traditionstabac–cannabis0b169f1f69df42c9bae3d15407e7e32f.csv` (sources)
- `Dashboard—Traditionstabac–cannabis19e5ba1554af48c2a50c5685b16a90b0.md` (dashboard)
- `Index—TraditionsTabac–Cannabis(AsieduSud&A4e0a2266c3554a38ac1f028959791152.md` (index)
- `RechercheBibliographiqueApprofondieDokha(Tabac2f5dbb3d5e6c809a99f0c6e4e2bc760f.md` (recherche)
- 15+ fichiers MD d'accords spécifiques (Accord1-4, Pétrichor1-6)
- 4+ fichiers d'analyses comparatives

**Contenu :**
- 15+ accords tabac-cannabis documentés
- Protocoles de préparation détaillés
- Traditions régionales (Asie du Sud, Afrique, Moyen-Orient)
- Analyses chimiques comparatives
- Sources bibliographiques complètes

**Pages à créer :**
- `/traditions-tabac-cannabis` - Hub principal
- `/traditions-tabac-cannabis/:id` - Fiche détaillée de chaque accord
- `/traditions-tabac-cannabis/protocoles` - Protocoles d'application
- `/traditions-tabac-cannabis/sources` - Bibliographie complète

---

### 10. **SUPER JUICE & FORMULATIONS** (Recettes Spéciales)
**Fichiers sources :**
- `perfumum_super_juice_analyse.json` (données)
- `SuperJuiceLaRecetteSecrètedePhilipMorrisetsesLeçonspourlaParfumerie.md` (analyse)

**Contenu :**
- Recette secrète Philip Morris
- Leçons pour la parfumerie
- Formulations spéciales

**Pages à créer :**
- `/formulations-speciales` - Hub des formulations
- `/formulations-speciales/:id` - Fiche détaillée

---

### 11. **PÉRIQUE** (Analyse Moléculaire Complète)
**Fichiers sources :**
- `perique_334_composes_detailles.json` (334 composés)
- `CompositionMoléculaireduPerique-DécouvertesClés.md` (analyse)
- `perique_composition_moleculaire.md` (composition)
- `perique_volatiles.pdf` (étude PDF)

**Contenu :**
- 334 composés détaillés
- Profil moléculaire complet
- Volatiles et transformations
- Découvertes clés

**Pages à créer :**
- `/perique` - Hub du Périque
- `/perique/molecules` - Les 334 molécules
- `/perique/volatiles` - Profil des volatiles

---

### 12. **ANALYSES GÉNOMIQUES** (Gènes Biosynthétiques)
**Fichiers sources :**
- `genes_biosynthetiques_nicotiana_tabacum.json` (données)
- `AnalyseGénomiqueGènesResponsablesdesMoléculesAromatiquesPerdues.md` (analyse)
- `AnalyseGénomiquedesVariétésdeTabac-PERFUMUM.md` (analyse variétés)

**Contenu :**
- Gènes responsables des molécules aromatiques
- Variations génétiques hypothétiques
- Analyse des variétés

**Pages à créer :**
- `/genomique` - Hub de l'analyse génomique
- `/genomique/genes` - Gènes biosynthétiques
- `/genomique/variations` - Variations génétiques

---

### 13. **VISUALISATIONS & COMPARAISONS** (Assets)
**Fichiers PNG :**
- 30+ visualisations (heatmaps, graphiques, timelines, radars)
- Comparaisons détaillées
- Analyses visuelles

**À intégrer :**
- Galerie de visualisations
- Comparaisons interactives
- Graphiques D3.js

---

### 14. **RECHERCHES COMPLÉMENTAIRES** (Documentation)
**Fichiers MD :**
- 50+ fichiers de recherche approfondie
- Analyses comparatives
- Protocoles et méthodologies
- Bibliographie

**À intégrer :**
- Ressources de recherche
- Protocoles détaillés
- Bibliographie complète

---

## 🗄️ Structure PostgreSQL Proposée

```sql
-- Catégories principales
CREATE TABLE tobacco_varieties (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100),
  origin VARCHAR(255),
  olfactory_family VARCHAR(100),
  chemical_profile JSONB,
  aromatic_notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE terroirs (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  region VARCHAR(255),
  pedological_analysis JSONB,
  climate_data JSONB,
  chemical_impact JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE additives (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(100),
  alkalinizing_power FLOAT,
  application_protocols JSONB,
  effectiveness_data JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE molecules (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  chemical_formula VARCHAR(50),
  molecular_weight FLOAT,
  pyrolysis_transformations JSONB,
  perfumery_potential TEXT,
  sources JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE landraces (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  origin_country VARCHAR(100),
  molecular_profile JSONB,
  historical_significance TEXT,
  modern_substitutes JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tobacco_cannabis_traditions (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  region VARCHAR(255),
  components JSONB,
  preparation_protocol JSONB,
  sources JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE accords (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  components JSONB,
  olfactory_family VARCHAR(100),
  intensity INT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 📋 Plan d'Implémentation par Phase

### Phase 1 : Organisation (ACTUELLE)
- ✅ Cataloguer toutes les données
- ✅ Créer ce document d'organisation
- ⏳ Identifier les dépendances entre catégories

### Phase 2 : Base de Données
- Créer les tables PostgreSQL
- Importer les données JSON/CSV
- Valider l'intégrité des données

### Phase 3 : Pages Principales
- Créer les hubs pour chaque catégorie
- Implémenter les filtres de base
- Ajouter la recherche

### Phase 4 : Visualisations
- Intégrer les graphiques D3.js
- Créer les comparaisons interactives
- Ajouter les heatmaps

### Phase 5 : Détails & Avancé
- Pages de détail complètes
- Filtres avancés
- Liens croisés entre catégories

### Phase 6 : Traditions Tabac-Cannabis
- Pages dédiées
- Protocoles interactifs
- Bibliographie complète

### Phase 7 : Tests & Optimisation
- Tests vitest complets
- Optimisation des performances
- Responsive design

### Phase 8 : Livraison
- Checkpoint final
- Documentation utilisateur
- Guide de maintenance

---

## 🔗 Dépendances Identifiées

```
Tabacothèque
├── Terroirs (impact géographique)
├── Additifs (composants)
├── Pyrazines (molécules clés)
├── Molécules (profil chimique)
├── Landraces (variétés patrimoniales)
└── Traditions Tabac-Cannabis (utilisations)

Traditions Tabac-Cannabis
├── Tabacothèque (tabacs utilisés)
├── Molécules (profils chimiques)
└── Sources Bibliographiques (références)

Périque
├── Molécules (334 composés)
└── Pyrolyse (transformations)
```

---

## 📊 Statistiques des Données

| Catégorie | Quantité | Fichiers |
|-----------|----------|----------|
| Variétés de tabac | 100+ | 5 |
| Terroirs | 20+ | 4 |
| Additifs | 50+ | 3 |
| Pyrazines | 30+ | 3 |
| Molécules | 334+ | 4 |
| Landraces | 50+ | 5 |
| Tabacs disparus | 30+ | 4 |
| Hybrides | 20+ | 2 |
| Blends | 40+ | 2 |
| Accords Tabac-Cannabis | 15+ | 20 |
| Visualisations | 30+ | 30 PNG |
| **TOTAL** | **700+** | **180+** |

---

## ✅ Prochaines Étapes

1. **Phase 2** : Créer les tables PostgreSQL
2. **Phase 3** : Importer les données
3. **Phase 4** : Créer les pages principales
4. **Phase 5** : Implémenter les visualisations
5. **Phase 6** : Intégrer les traditions
6. **Phase 7** : Tests complets
7. **Phase 8** : Livraison finale
