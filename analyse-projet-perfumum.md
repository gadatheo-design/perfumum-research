# Analyse du Projet PERFUMUM — Rapport d'État

> **Date d'analyse** : 09 janvier 2026
> **Projet** : PERFUMUM — Recherche Olfactive

---

## 1. Vue d'ensemble du projet

Le projet PERFUMUM est une plateforme de recherche olfactive expérimentale développée par ABSORBE (laboratoire basé à Berne). Il s'agit d'un projet de recherche sur 10 ans (2025-2035) combinant science moléculaire, art olfactif et documentation ethnobotanique.

---

## 2. État actuel de la base de données

### Entités principales
| Entité | Quantité | Couverture des liaisons |
|--------|----------|------------------------|
| Molécules | ~556 | 50% liées aux recettes |
| Recettes | ~266 | 93% avec molécules |
| Plantes | ~144 | 19.4% liées aux terroirs |
| Terroirs | ~29 | 65.5% avec plantes |
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

## 3. Architecture technique

### Schéma de base de données
Le projet utilise **125 tables MySQL** organisées en plusieurs domaines :

#### Tables principales
- `users` — Gestion des utilisateurs et authentification
- `molecules` — Base moléculaire avec propriétés scientifiques
- `recettes` — Formulations olfactives
- `plants` — Données botaniques
- `terroirs` — Zones géographiques et climatiques
- `accords` — Accords olfactifs
- `families` — Familles olfactives

#### Tables relationnelles
- `molecules_recettes` — Liaisons molécules ↔ recettes
- `plant_molecules` — Liaisons plantes ↔ molécules
- `plant_terroirs` — Liaisons plantes ↔ terroirs
- `recette_molecules` — Compositions des recettes

#### Tables spécialisées
- `terpene_synergies` — Synergies entre terpènes
- `ifra_restrictions` — Restrictions réglementaires IFRA
- `bibliography_entries` — Références bibliographiques
- `research_axes` — Axes de recherche thématiques

---

## 4. Fichiers de données sources

### Répertoire `/data/`
| Fichier | Description |
|---------|-------------|
| `perfumum_molecules_template.csv` | Template des molécules (63 entrées) |
| `perfumum_plants_molecules_relations.csv` | Relations plantes-molécules |
| `perfumum_plants_template_30_col_bfa_car.csv` | Template plantes (30 colonnes) |
| `perfumum_varieties_template.csv` | Template variétés |
| `pack_v3_references.csv` | Références bibliographiques v3 |
| `enriched_plant_molecules.csv` | Données enrichies plantes-molécules |
| `references.csv` | Références scientifiques |

### Fichiers de documentation
- `pack_v3_readme.md` — Documentation des axes de recherche
- `synergies-terpeniques-data.md` — Données sur les synergies
- `cannabis-varieties-terpenes.md` — Profils terpéniques cannabis
- `tobacco-molecules.md` — Molécules du tabac

---

## 5. Interface utilisateur

### Pages développées (~170 pages)
Le projet dispose d'une interface React complète avec :

#### Navigation principale
- Page d'accueil avec statistiques dynamiques
- Système de gammes olfactives (Pétrichor, Volcanique, Glaciaire, BioLab, Mossi)
- Prototypes C1-C4

#### Modules scientifiques
- Catalogue de molécules avec radar olfactif
- Synergies moléculaires et heatmaps
- Restrictions IFRA
- Analyses GC-MS et pyrolyse

#### Outils de gestion
- Administration des entités (CRUD)
- Import/Export CSV
- Liaisons entre entités (drag-drop, import CSV)
- Système de validation des contributions

#### Visualisations
- Cartes interactives des terroirs
- Graphes de relations (D3.js)
- Diagrammes Sankey
- Timeline de recherche

---

## 6. Fonctionnalités complétées

### Interface Contributeur ✅
- Formulaires d'ajout de molécules et plantes
- Recherche automatique de doublons
- Création de liaisons molécule↔recette
- Création de liaisons plante↔terroir

### Système de validation ✅
- Champ "status" (brouillon/validé) sur les entités
- Interface de validation admin
- Notifications automatiques

### Import/Export ✅
- Import CSV avec prévisualisation
- Validation des données avant import
- Export CSV et JSON

### Restrictions IFRA ✅
- Page de consultation avec recherche
- 22 tests unitaires validés

### Système d'images botaniques ✅
- Stockage S3 configuré
- Upload avec drag & drop
- Galerie d'images par plante

---

## 7. Fonctionnalités en cours / à développer

### P2 — Amélioration
- [ ] Graphe de relations terroir-plante-molécule
- [ ] Page terroirs avec carte interactive
- [ ] Système de tags et notes
- [ ] Graphe de force D3.js pour axes thématiques

### P3 — UX/UI
- [ ] Simplification du MegaMenu
- [ ] Cohérence typographique
- [ ] Amélioration des cartes
- [ ] Responsive mobile optimisé

### P4 — Données relationnelles
- [ ] Import pack v4 (BibTeX, CSV, ZIP)
- [ ] Tables relationnelles complètes
- [ ] Liaisons références-entités

---

## 8. Axes de recherche documentés

### Meta-A — Olfactory Heritage & Archives
- Documentation et reconstruction d'odeurs historiques
- Protocoles muséologiques
- Archives olfactives

### Meta-B — Olfactory Arts & Chimie de l'espace
- Installations artistiques
- Smellscapes urbains
- Architecture multisensorielle

### Meta-C — Digital Olfaction (IA/VR/Capteurs)
- Interfaces olfactives VR
- E-noses et capteurs
- Knowledge graphs et datasets

---

## 9. Recommandations

### Court terme
1. Compléter les données CAS Number et IUPAC (actuellement 25% et 18%)
2. Augmenter la couverture des liaisons plante→terroir (objectif 50%)
3. Finaliser les visualisations D3.js

### Moyen terme
1. Importer le pack v4 de références
2. Développer le système de tags
3. Améliorer l'UX mobile

### Long terme
1. Intégration IA pour suggestions de formulation
2. API publique pour partage de données
3. Système de collaboration multi-utilisateurs

---

*Ce rapport a été généré automatiquement lors de l'analyse du projet PERFUMUM.*
