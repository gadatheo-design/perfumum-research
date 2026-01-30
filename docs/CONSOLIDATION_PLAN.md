# Plan de Consolidation PERFUMUM

> **Objectif** : Réduire 286 routes → ~70 sections principales tout en **préservant 100% des données et fonctionnalités**

---

## Principe de consolidation

Chaque section principale utilisera un **système d'onglets** pour regrouper les fonctionnalités connexes. Les anciennes URLs seront **redirigées automatiquement** vers les nouvelles sections avec l'onglet approprié pré-sélectionné.

---

## Structure proposée (12 sections principales)

### 1. ACCUEIL & PRÉSENTATION (5 routes → 1 section)
| Ancienne route | Nouvelle structure |
|----------------|-------------------|
| `/` | Accueil (inchangé) |
| `/systeme` | Accueil > Onglet "Système PERFUMUM" |
| `/le-projet` | Accueil > Onglet "Le Projet" |
| `/a-propos` | Accueil > Onglet "À propos" |
| `/manifeste` | Accueil > Onglet "Manifeste" |

### 2. MOLÉCULES (8 routes → 1 section avec 4 onglets)
| Ancienne route | Nouvelle structure |
|----------------|-------------------|
| `/molecules` | `/molecules` > Onglet "Liste" |
| `/molecule/:id` | `/molecules/:id` (détail) |
| `/terpene/:id` | `/molecules/:id?type=terpene` |
| `/familles` | `/molecules` > Onglet "Familles" |
| `/familles/list` | `/molecules` > Onglet "Familles" |
| `/chemical-families` | `/molecules` > Onglet "Familles Chimiques" |
| `/chemical-family-graph` | `/molecules` > Onglet "Graphe Familles" |

**Onglets** : Liste | Familles | Familles Chimiques | Graphe

### 3. RECETTES & ACCORDS (14 routes → 1 section avec 5 onglets)
| Ancienne route | Nouvelle structure |
|----------------|-------------------|
| `/recettes` | `/recettes` > Onglet "Liste" |
| `/recettes-tl` | `/recettes` > Onglet "Timeline" |
| `/recette/:id` | `/recettes/:id` (détail) |
| `/accords` | `/recettes` > Onglet "Accords" |
| `/accords-dedies` | `/recettes` > Onglet "Accords Dédiés" |
| `/experimental-accords` | `/recettes` > Onglet "Expérimental" |
| `/formules-reference` | `/recettes` > Onglet "Formules Référence" |
| `/recipe-timeline` | `/recettes` > Onglet "Timeline" |
| `/resines-cbd` | `/recettes` > Onglet "Résines CBD" |
| `/resine-cbd/:id` | `/recettes/:id?type=cbd` |
| `/protocoles-maturation` | `/recettes` > Onglet "Protocoles" |
| `/final-recipes` | `/recettes` > Onglet "Finales" |
| `/recettes-leaf-economies` | `/recettes` > Onglet "Leaf Economies" |

**Onglets** : Liste | Accords | Formules | CBD | Timeline

### 4. PLANTES & BOTANIQUE (25 routes → 1 section avec 6 onglets)
| Ancienne route | Nouvelle structure |
|----------------|-------------------|
| `/plants`, `/plantes` | `/plants` > Onglet "Liste" |
| `/plants/:id`, `/plantes/:id` | `/plants/:id` (détail) |
| `/plant-varieties`, `/varietes` | `/plants` > Onglet "Variétés" |
| `/varietes/:id` | `/plants/variete/:id` |
| `/terroirs` | `/plants` > Onglet "Terroirs" |
| `/carte-terroirs` | `/plants` > Onglet "Carte Terroirs" |
| `/chemotypes` | `/plants` > Onglet "Chemotypes" |
| `/terp-profiles` | `/plants` > Onglet "Profils Terpéniques" |
| `/leaf-economies` | `/plants` > Onglet "Leaf Economies" |
| `/san-andres/*` | `/plants` > Onglet "San Andrés" |
| `/ghost-varieties-explorer` | `/plants` > Onglet "Variétés Fantômes" |
| `/botanique-critique` | `/plants` > Onglet "Botanique Critique" |

**Onglets** : Liste | Variétés | Terroirs | Chemotypes | Profils | Leaf Economies

### 5. PROTOTYPES & GAMMES (15 routes → 1 section avec 4 onglets)
| Ancienne route | Nouvelle structure |
|----------------|-------------------|
| `/prototypes` | `/prototypes` > Onglet "Vue d'ensemble" |
| `/prototype/:id` | `/prototypes/:id` |
| `/prototypes/c1`, `/c2`, `/c3`, `/c4` | `/prototypes/:code` |
| `/gammes` | `/prototypes` > Onglet "Gammes" |
| `/gammes/petrichor` | `/prototypes` > Onglet "Gammes" > Pétrichor |
| `/gammes/volcanique` | `/prototypes` > Onglet "Gammes" > Volcanique |
| `/gammes/glaciaire` | `/prototypes` > Onglet "Gammes" > Glaciaire |
| `/gammes/biolab` | `/prototypes` > Onglet "Gammes" > BioLab |
| `/gammes/mossi` | `/prototypes` > Onglet "Gammes" > Mossi |
| `/gammes/signatures` | `/prototypes` > Onglet "Gammes" > Signatures |
| `/gammes/pheromones` | `/prototypes` > Onglet "Gammes" > Phéromones |
| `/gammes/raretes` | `/prototypes` > Onglet "Gammes" > Raretés |

**Onglets** : Prototypes | Gammes | Sourcing | Colombie

### 6. VISUALISATIONS & GRAPHES (20 routes → 1 section avec 5 onglets)
| Ancienne route | Nouvelle structure |
|----------------|-------------------|
| `/visualisations` | `/visualisations` > Onglet "Hub" |
| `/graphe-*` | `/visualisations` > Onglet "Graphes" |
| `/matrice-*` | `/visualisations` > Onglet "Matrices" |
| `/sankey-flow` | `/visualisations` > Onglet "Sankey" |
| `/synergies-heatmap` | `/visualisations` > Onglet "Heatmaps" |
| `/recipe-network` | `/visualisations` > Onglet "Réseaux" |
| `/reseau-*` | `/visualisations` > Onglet "Réseaux" |

**Onglets** : Hub | Graphes | Matrices | Heatmaps | Réseaux

### 7. COMPARAISON (11 routes → 1 section avec 4 onglets)
| Ancienne route | Nouvelle structure |
|----------------|-------------------|
| `/compare` | `/compare` > Onglet "Molécules" |
| `/compare-terpenes` | `/compare` > Onglet "Terpènes" |
| `/compare-radar` | `/compare` > Onglet "Radar" |
| `/compare-recettes` | `/compare` > Onglet "Recettes" |
| `/compare-plants` | `/compare` > Onglet "Plantes" |
| `/comparaison-*` | Redirigé vers `/compare` |
| `/comparateur-avance` | `/compare` > Onglet "Avancé" |

**Onglets** : Molécules | Recettes | Plantes | Radar | Avancé

### 8. RECHERCHE & MÉTHODOLOGIE (22 routes → 1 section avec 6 onglets)
| Ancienne route | Nouvelle structure |
|----------------|-------------------|
| `/recherche-avancee` | `/recherche` > Onglet "Avancée" |
| `/recherche-scientifique` | `/recherche` > Onglet "Scientifique" |
| `/recherche-scientifique/*` | `/recherche` > Onglet "Scientifique" > Sous-section |
| `/methodologie/*` | `/recherche` > Onglet "Méthodologie" |
| `/methode-absorbe` | `/recherche` > Onglet "ABSORBE" |
| `/programmes-recherche` | `/recherche` > Onglet "Programmes" |
| `/recherche-radicale` | `/recherche` > Onglet "Radicale" |
| `/synergies-moleculaires` | `/recherche` > Onglet "Synergies" |

**Onglets** : Avancée | Scientifique | Méthodologie | ABSORBE | Programmes | Synergies

### 9. BIBLIOGRAPHIE & RÉFÉRENCES (15 routes → 1 section avec 4 onglets)
| Ancienne route | Nouvelle structure |
|----------------|-------------------|
| `/bibliographie` | `/bibliographie` > Onglet "Références" |
| `/bibliographie-globale` | `/bibliographie` > Onglet "Globale" |
| `/references-v3` | `/bibliographie` > Onglet "V3" |
| `/axes-recherche` | `/bibliographie` > Onglet "Axes" |
| `/graphe-references-axes` | `/bibliographie` > Onglet "Graphe" |
| `/glossaire` | `/bibliographie` > Onglet "Glossaire" |
| `/heritage-conservation` | `/bibliographie` > Onglet "Patrimoine" |

**Onglets** : Références | Axes | Graphe | Glossaire | Patrimoine

### 10. OUTILS & CALCULATEURS (15 routes → 1 section avec 5 onglets)
| Ancienne route | Nouvelle structure |
|----------------|-------------------|
| `/outils` | `/outils` > Onglet "Hub" |
| `/outils-formulation` | `/outils` > Onglet "Formulation" |
| `/outils/editeur-formulation` | `/outils` > Onglet "Éditeur" |
| `/calculateur` | `/outils` > Onglet "Calculateurs" |
| `/outils/dilution` | `/outils` > Onglet "Calculateurs" > Dilution |
| `/outils/calculateur-cout` | `/outils` > Onglet "Calculateurs" > Coût |
| `/outils/enrichissement-pubchem` | `/outils` > Onglet "Enrichissement" |
| `/generateur-formules` | `/outils` > Onglet "Générateur" |
| `/ifra` | `/outils` > Onglet "IFRA" |

**Onglets** : Hub | Formulation | Calculateurs | Enrichissement | IFRA

### 11. ARCHIVES & ÉTUDES (20 routes → 1 section avec 5 onglets)
| Ancienne route | Nouvelle structure |
|----------------|-------------------|
| `/archives` | `/archives` > Onglet "Vue d'ensemble" |
| `/archives-terrain` | `/archives` > Onglet "Terrain" |
| `/archives-olfactives` | `/archives` > Onglet "Olfactives" |
| `/etudes` | `/archives` > Onglet "Études" |
| `/etudes-climatiques` | `/archives` > Onglet "Climatiques" |
| `/protocoles-moleculaires` | `/archives` > Onglet "Protocoles" |
| `/tests-extraction` | `/archives` > Onglet "Tests" |
| `/odeurs-situees` | `/archives` > Onglet "Odeurs" |
| `/journal` | `/archives` > Onglet "Journal" |
| `/timeline` | `/archives` > Onglet "Timeline" |

**Onglets** : Vue d'ensemble | Terrain | Études | Protocoles | Timeline

### 12. ADMINISTRATION (25 routes → 1 section avec 7 onglets)
| Ancienne route | Nouvelle structure |
|----------------|-------------------|
| `/admin` | `/admin` > Onglet "Dashboard" |
| `/admin/molecules` | `/admin` > Onglet "Molécules" |
| `/admin/recettes` | `/admin` > Onglet "Recettes" |
| `/admin/accords` | `/admin` > Onglet "Accords" |
| `/admin/familles` | `/admin` > Onglet "Familles" |
| `/admin/matieres` | `/admin` > Onglet "Matières" |
| `/admin/import-*` | `/admin` > Onglet "Import/Export" |
| `/admin/validation` | `/admin` > Onglet "Validation" |
| `/admin/ai-classification` | `/admin` > Onglet "IA" |
| `/linking-dashboard` | `/admin` > Onglet "Liaisons" |
| `/contributor` | `/admin` > Onglet "Contributeur" |

**Onglets** : Dashboard | Entités | Import/Export | Validation | IA | Liaisons | Contributeur

---

## Cartes géographiques (7 routes → intégrées)

Les cartes seront intégrées dans leurs sections respectives :
- `/carte-terroirs` → `/plants` > Onglet "Carte"
- `/carte-varietes` → `/plants` > Onglet "Carte Variétés"
- `/carte-origines` → `/plants` > Onglet "Origines"
- `/carte-plantes-gps` → `/plants` > Onglet "GPS"

---

## Redirections automatiques

Toutes les anciennes URLs continueront de fonctionner grâce à un système de redirections :

```typescript
// Exemple de redirection
<Route path="/familles" component={() => <Redirect to="/molecules?tab=familles" />} />
<Route path="/compare-terpenes" component={() => <Redirect to="/compare?tab=terpenes" />} />
```

---

## Résumé de la consolidation

| Catégorie | Avant | Après | Réduction |
|-----------|-------|-------|-----------|
| Routes totales | 286 | ~70 | -75% |
| Pages principales | 286 | 12 | -96% |
| Onglets par section | - | 4-7 | - |
| Données perdues | - | 0 | 0% |
| Fonctionnalités perdues | - | 0 | 0% |

---

## Prochaines étapes

1. **Validation** : Confirmer ce plan avec l'utilisateur
2. **Implémentation** : Créer les nouvelles pages avec onglets
3. **Redirections** : Configurer les redirections automatiques
4. **Tests** : Vérifier que toutes les fonctionnalités sont accessibles
5. **Documentation** : Mettre à jour la navigation et l'aide

---

*Document généré le 12 janvier 2026*
