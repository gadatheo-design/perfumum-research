# PERFUMUM — Guide d'Implémentation des Données
### Document à destination des collaborateurs de recherche
*Version 1.0 — Mars 2026*

---

## Introduction

Ce document recense l'ensemble des **implémentations de données possibles** depuis le site PERFUMUM. Il est destiné aux collaborateurs qui souhaitent enrichir la base de données de recherche. Chaque section décrit une entité du projet, ses champs disponibles, son état actuel, et les actions concrètes réalisables directement depuis l'interface web.

Le site est accessible à l'adresse : **https://perfumum-h2pjhhjb.manus.space**

---

## État actuel de la base (Mars 2026)

| Entité | Enregistrements | Liaisons actives |
|---|---|---|
| Molécules | **1 045** | — |
| Recettes | **310** | — |
| Matières premières | **372** | — |
| Terroirs | **93** | — |
| Variétés botaniques | **105** | — |
| Accords olfactifs | **32** | — |
| Familles chimiques | en cours | — |
| Liaisons plante ↔ molécule | actives | via `/admin/plant-molecules` |
| Liaisons recette ↔ matière première | **0** | à saisir |
| Liaisons généalogiques variétés | **0** | à saisir |

---

## 1. Molécules (`/molecules`)

### Description
Catalogue central de 1 045 molécules aromatiques. Chaque molécule est une entité structurée avec des données chimiques, olfactives, analytiques et bibliographiques.

### Champs disponibles et leur état

| Champ | Description | État moyen | Priorité |
|---|---|---|---|
| `name` | Nom commun | ✅ Complet | — |
| `iupacName` | Nom IUPAC | ⚠️ Partiel | Haute |
| `casNumber` | Numéro CAS | ⚠️ Partiel | Haute |
| `molecularFormula` | Formule brute | ⚠️ Partiel | Haute |
| `molecularWeight` | Masse molaire (g/mol) | ⚠️ Partiel | Haute |
| `smiles` | Structure SMILES | ⚠️ Partiel | Haute |
| `olfactiveProfile` | Profil olfactif (array de descripteurs) | ⚠️ Partiel | Haute |
| `olfactiveFamily` | Famille olfactive principale | ⚠️ Partiel | Haute |
| `chemicalFamily` | Famille chimique (terpène, ester, etc.) | ⚠️ Partiel | Haute |
| `boilingPoint` | Point d'ébullition (°C) | ⚠️ Partiel | Moyenne |
| `meltingPoint` | Point de fusion (°C) | ⚠️ Partiel | Moyenne |
| `flashPoint` | Point d'éclair (°C) | ⚠️ Partiel | Moyenne |
| `logP` | Coefficient de partage | ⚠️ Partiel | Moyenne |
| `vaporPressure` | Pression de vapeur | ⚠️ Partiel | Moyenne |
| `odorThreshold` | Seuil de détection olfactif | ⚠️ Partiel | Haute |
| `odorDescription` | Description olfactive longue | ⚠️ Partiel | Haute |
| `naturalSources` | Sources naturelles (texte) | ⚠️ Partiel | Haute |
| `biosynthesisPathway` | Voie de biosynthèse | ⚠️ Partiel | Moyenne |
| `ifraStatus` | Statut IFRA (restricted/allowed/prohibited) | ⚠️ Partiel | Haute |
| `ifraLimit` | Limite IFRA (%) | ⚠️ Partiel | Haute |
| `pubchemCid` | Identifiant PubChem | ⚠️ Partiel | Moyenne |
| `inchiKey` | Clé InChI | ⚠️ Partiel | Moyenne |
| `synonyms` | Synonymes (JSON array) | ⚠️ Partiel | Moyenne |
| `imageUrl` | Image de la structure | ⚠️ Partiel | Basse |
| `notes` | Notes de recherche libres | ⚠️ Partiel | Haute |

### Actions disponibles depuis le site

**Depuis `/molecules/:id` (fiche molécule) :**
- **Enrichissement IA** — Bouton "Analyser" dans la section "Classification IA" : génère automatiquement des suggestions de famille chimique, profil olfactif, et notes à partir du nom et des données existantes.
- **Lier à une plante** — Onglet "Sources Botaniques" : dialog de sélection pour associer la molécule à une ou plusieurs plantes, avec indication du pourcentage et du rôle.
- **Édition directe** — Via `/admin/molecules/:id/edit` : formulaire complet de modification de tous les champs.
- **Enrichissement PubChem** — Bouton dans l'onglet Nomenclature : récupère automatiquement CAS, IUPAC, formule, masse depuis PubChem.

**Depuis `/admin/molecules` :**
- Créer une nouvelle molécule via le bouton "+ Nouvelle molécule".
- Rechercher et filtrer par famille chimique, famille olfactive, statut IFRA.

---

## 2. Recettes (`/recettes`)

### Description
310 formules de recherche olfactive. Chaque recette peut être liée à des matières premières (avec dosage, rôle, pourcentage), à des molécules (notes de tête/cœur/fond), et à des accords.

### Champs disponibles et leur état

| Champ | Description | État moyen | Priorité |
|---|---|---|---|
| `name` | Nom de la recette | ✅ Complet | — |
| `code` | Code de référence | ✅ Complet | — |
| `description` | Description olfactive | ⚠️ Partiel | Haute |
| `notesTete` | Notes de tête (texte ou liste de molécules) | ⚠️ Partiel | Haute |
| `notesCoeur` | Notes de cœur | ⚠️ Partiel | Haute |
| `notesFond` | Notes de fond | ⚠️ Partiel | Haute |
| `family` | Famille olfactive de la recette | ⚠️ Partiel | Haute |
| `concentration` | Concentration (EDP, EDT, etc.) | ⚠️ Partiel | Moyenne |
| `season` | Saison recommandée | ⚠️ Partiel | Basse |
| `occasion` | Occasion (jour, soir, etc.) | ⚠️ Partiel | Basse |
| `gender` | Genre (masculin, féminin, mixte) | ⚠️ Partiel | Basse |
| `inspiration` | Source d'inspiration | ⚠️ Partiel | Haute |
| `notes` | Notes de recherche libres | ⚠️ Partiel | Haute |
| `status` | Statut (brouillon, prototype, finalisé) | ⚠️ Partiel | Moyenne |

### Liaisons recette ↔ matières premières (PRIORITÉ CRITIQUE)

**État actuel : 0 liaison saisie.** C'est la donnée la plus importante à renseigner pour activer la visualisation pyramidale et le réseau de liaisons.

**Depuis `/recettes/:id` (fiche recette) :**
- Section "Matières Premières" → Bouton "+ Ajouter une matière première" : ouvre un dialog de sélection avec les champs suivants :
  - **Matière première** : recherche en temps réel dans les 372 références
  - **Rôle** : Base / Cœur / Tête / Fixateur / Modificateur
  - **Dosage** : valeur numérique + unité (g, ml, gouttes, mg)
  - **Pourcentage** : pourcentage dans la formule totale
  - **Notes** : observations spécifiques à cette liaison
- Modifier une liaison existante : icône crayon au survol de chaque ligne.
- Supprimer une liaison : icône poubelle au survol.

---

## 3. Matières Premières (`/matieres-premieres`)

### Description
372 matières premières classées par catégorie : huiles essentielles (73), molécules isolées (87), résinoïdes (59), accords olfactifs (48), absolues (41), infusions (27), extraits CO₂ (26), et autres.

### Champs disponibles et leur état

| Champ | Description | État moyen | Priorité |
|---|---|---|---|
| `name` | Nom commercial | ✅ Complet | — |
| `category` | Catégorie (HE, absolue, CO₂, etc.) | ✅ Complet | — |
| `supplier` | Fournisseur | ⚠️ Partiel | Haute |
| `origin` | Origine géographique | ⚠️ Partiel | Haute |
| `botanicalSource` | Source botanique (plante) | ⚠️ Partiel | Haute |
| `extractionMethod` | Méthode d'extraction | ⚠️ Partiel | Haute |
| `olfactiveDescription` | Description olfactive | ⚠️ Partiel | Haute |
| `olfactiveFamily` | Famille olfactive | ⚠️ Partiel | Haute |
| `concentration` | Concentration (%) | ⚠️ Partiel | Moyenne |
| `price` | Prix indicatif | ⚠️ Partiel | Basse |
| `stockQuantity` | Stock disponible | ⚠️ Partiel | Moyenne |
| `stockUnit` | Unité de stock | ⚠️ Partiel | Moyenne |
| `ifraStatus` | Statut IFRA | ⚠️ Partiel | Haute |
| `certifications` | Certifications (bio, naturel, etc.) | ⚠️ Partiel | Moyenne |
| `notes` | Notes de recherche | ⚠️ Partiel | Haute |

### Actions disponibles depuis le site

**Depuis `/matieres-premieres/:id` (fiche matière première) :**
- Voir les molécules constitutives liées.
- Voir les recettes qui utilisent cette matière première.
- Lier à une recette via le bouton "+ Lier à une recette".

**Depuis `/matieres-premieres/nouvelle` :**
- Créer une nouvelle matière première avec le formulaire complet.

---

## 4. Plantes & Variétés (`/plantes`, `/varietes`)

### Description
Catalogue botanique avec deux niveaux : les **plantes** (espèces botaniques) et les **variétés** (cultivars, landraces, sélections). Les variétés cannabis comptent 105 entrées avec leurs profils terpéniques.

### Champs plante disponibles

| Champ | Description | État moyen | Priorité |
|---|---|---|---|
| `name` | Nom commun | ✅ Complet | — |
| `scientificName` | Nom scientifique | ✅ Complet | — |
| `family` | Famille botanique | ✅ Complet | — |
| `origin` | Origine géographique | ⚠️ Partiel | Haute |
| `description` | Description botanique | ⚠️ Partiel | Haute |
| `olfactiveDescription` | Description olfactive | ⚠️ Partiel | Haute |
| `harvestPeriod` | Période de récolte | ⚠️ Partiel | Moyenne |
| `extractionMethods` | Méthodes d'extraction applicables | ⚠️ Partiel | Haute |
| `conservationStatus` | Statut de conservation (UICN) | ⚠️ Partiel | Haute |
| `notes` | Notes de recherche | ⚠️ Partiel | Haute |

### Liaisons plante ↔ molécule (PRIORITÉ HAUTE)

**Depuis `/plants/:id` (fiche plante) :**
- Onglet "Molécules" → Bouton "+ Ajouter une molécule" : dialog de sélection avec pourcentage et rôle.
- Supprimer une liaison existante via l'icône poubelle.

**Depuis `/admin/plant-molecules` :**
- Interface d'administration batch pour gérer toutes les liaisons plante-molécule.

### Liaisons généalogiques variétés (PRIORITÉ HAUTE)

**Depuis `/varietes/:id` (fiche variété) :**
- Onglet "Généalogie" → Bouton "+ Ajouter une relation" : dialog avec sélection du type (parent/enfant), de la variété liée, et du type de croisement.
- Visualisation de l'arbre généalogique via le bouton "Voir dans l'arbre généalogique".

---

## 5. Terroirs (`/terroirs`)

### Description
93 terroirs géographiques liés aux plantes aromatiques. Chaque terroir peut être associé à des plantes et visualisé sur la carte interactive.

### Champs disponibles

| Champ | Description | État moyen | Priorité |
|---|---|---|---|
| `name` | Nom du terroir | ✅ Complet | — |
| `country` | Pays | ✅ Complet | — |
| `region` | Région | ⚠️ Partiel | Haute |
| `climate` | Type climatique | ⚠️ Partiel | Haute |
| `altitude` | Altitude (m) | ⚠️ Partiel | Moyenne |
| `soilType` | Type de sol | ⚠️ Partiel | Haute |
| `description` | Description du terroir | ⚠️ Partiel | Haute |
| `olfactiveInfluence` | Influence sur le profil olfactif | ⚠️ Partiel | Haute |
| `latitude` / `longitude` | Coordonnées GPS | ⚠️ Partiel | Haute |
| `notes` | Notes de recherche | ⚠️ Partiel | Haute |

### Actions disponibles depuis le site

**Depuis `/terroirs/:id` (fiche terroir) :**
- Voir les plantes associées à ce terroir.
- Naviguer vers les plantes liées.

**Depuis `/carte-terroirs` :**
- Visualisation cartographique de tous les terroirs avec leurs plantes.

---

## 6. Accords Olfactifs (`/recettes?tab=accords`)

### Description
32 accords olfactifs documentés, représentant des associations de molécules ou de matières premières produisant un effet olfactif particulier.

### Actions disponibles depuis le site

**Depuis `/admin/accords` :**
- Créer, modifier et supprimer des accords.
- Lier des molécules à un accord.

---

## 7. Axes de Recherche (`/axes-recherche`)

### Description
Axes thématiques structurant le projet de recherche à long terme. Chaque axe peut être lié à des molécules, des recettes, des références bibliographiques et des protocoles.

### Actions disponibles depuis le site

**Depuis `/axes-recherche` :**
- Consulter les axes existants et leur avancement.
- Naviguer vers les entités liées à chaque axe.

---

## 8. Bibliographie (`/axes-recherche` → onglet Bibliographie)

### Description
Références bibliographiques scientifiques liées aux axes de recherche.

### Actions disponibles depuis le site

**Depuis `/bibliographie` :**
- Ajouter une référence bibliographique.
- Exporter la bibliographie au format BibTeX ou APA.

---

## 9. Glossaire (`/glossaire`)

### Description
Glossaire des termes techniques du projet. Chaque terme peut être lié à des molécules, des familles chimiques ou des concepts olfactifs.

### Actions disponibles depuis le site

**Depuis `/glossaire` :**
- Consulter les termes existants.
- Ajouter un nouveau terme via le formulaire dédié.

---

## Priorités de saisie recommandées

Le tableau suivant synthétise les actions les plus impactantes pour enrichir la base, classées par priorité décroissante.

| Priorité | Action | Impact | Temps estimé |
|---|---|---|---|
| 🔴 Critique | Saisir les liaisons recette ↔ matière première | Active la pyramide olfactive et le réseau de liaisons | ~2h pour 10 recettes |
| 🔴 Critique | Compléter `odorThreshold` et `olfactiveProfile` des molécules | Active les visualisations olfactives | ~30 min/molécule |
| 🟠 Haute | Lier les plantes à leurs molécules constitutives | Active le réseau plante-molécule | ~15 min/plante |
| 🟠 Haute | Saisir les généalogies des variétés cannabis | Active l'arbre généalogique | ~5 min/variété |
| 🟡 Moyenne | Compléter les données IFRA des molécules | Active la conformité réglementaire | ~10 min/molécule |
| 🟡 Moyenne | Renseigner les coordonnées GPS des terroirs | Active la carte interactive | ~2 min/terroir |
| 🟢 Basse | Enrichir les descriptions olfactives des matières premières | Améliore la recherche sémantique | ~10 min/MP |

---

## Accès aux interfaces d'administration

| Interface | URL | Description |
|---|---|---|
| Admin Molécules | `/admin/molecules` | Gestion complète des molécules |
| Admin Recettes | `/admin/recettes` | Gestion des recettes |
| Admin Matières | `/admin/matieres` | Gestion des matières premières |
| Admin Accords | `/admin/accords` | Gestion des accords olfactifs |
| Admin Familles | `/admin/familles` | Gestion des familles chimiques |
| Liaisons Plante-Molécule | `/admin/plant-molecules` | Interface batch de liaison |
| Tableau de Complétude | `/admin/completude` | Vue d'ensemble de la qualité des données |
| Doublons | `/admin/duplicates` | Détection et fusion des doublons |

---

## Notes techniques pour les collaborateurs

Toutes les données saisies sont **immédiatement persistées** en base de données et visibles sur le site. Il n'y a pas de validation manuelle requise. Les champs marqués comme "Partiel" acceptent des valeurs partielles — il vaut mieux saisir une information incomplète que de laisser le champ vide.

Les **enrichissements IA** (bouton "Analyser" sur les fiches molécules) génèrent des suggestions qui doivent être **validées manuellement** avant d'être enregistrées. Ces suggestions sont basées sur le nom de la molécule et les données existantes.

Pour toute question sur la structure des données ou les priorités de saisie, contacter le responsable du projet PERFUMUM.

---

*Document généré automatiquement depuis la base de données PERFUMUM — Mars 2026*
