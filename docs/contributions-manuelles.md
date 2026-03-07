# Contributions manuelles possibles — PERFUMUM

*Généré le 7 mars 2026 — État de la base de données*

---

## Vue d'ensemble

Ce document liste l'ensemble des données manquantes dans la base PERFUMUM qui nécessitent une saisie ou validation manuelle. Il est organisé par priorité et par table.

---

## 1. MOLÉCULES (1 045 entrées)

### Priorité haute — Impact direct sur la recherche

| Champ manquant | Nb entrées | % | Action recommandée |
|---------------|-----------|---|-------------------|
| Numéro CAS | 292 | 28% | Recherche manuelle sur NIST/PubChem par nom IUPAC |
| Formule chimique | 454 | 43% | Import depuis PubChem (si CID connu) ou saisie |
| SMILES | 843 | 81% | Récupérable automatiquement si CID PubChem connu |
| CID PubChem | 597 | 57% | Batch automatique possible pour les molécules pures |
| InChIKey | 737 | 71% | Dérivé du SMILES — automatisable si SMILES présent |
| Nom IUPAC | 393 | 38% | Récupérable via PubChem si CID connu |

### Priorité moyenne — Enrichissement qualitatif

| Champ manquant | Nb entrées | % | Action recommandée |
|---------------|-----------|---|-------------------|
| Profil olfactif | 24 | 2% | Saisie manuelle — 24 molécules prioritaires |
| Famille chimique (ChEBI) | 1 045 | 100% | Batch automatique ChEBI possible |
| Statut IFRA | 0 | 0% | ✅ Complet |
| Propriétés thérapeutiques | 0 | 0% | ✅ Complet |
| Plante source | 699 | 67% | Saisie manuelle via interface admin `/admin/molecules` |

### Molécules prioritaires sans source botanique (699)

Ces 699 molécules n'ont aucune plante source associée. Commencer par les molécules les plus connues :

- Linalol, Géraniol, Citronellol, Limonène, α-Pinène (terpènes ubiquitaires)
- Eugénol (Clou de girofle, Basilic), Vanilline (Vanille, Fève Tonka)
- Coumarine (Fève Tonka, Lavande), Cinnamaldéhyde (Cannelle)
- Méthyl chavicol / Estragole (Basilic, Estragon)
- β-Caryophyllène (Poivre noir, Cannabis), Humulène (Houblon, Cannabis)

---

## 2. PLANTES / MATIÈRES (450 entrées)

### Priorité haute

| Champ manquant | Nb entrées | % | Action recommandée |
|---------------|-----------|---|-------------------|
| Image | 450 | 100% | Upload via interface admin — commencer par les 30 plantes principales |
| Auteur botanique | 450 | 100% | Récupérable via GBIF (batch en cours) |
| Synonymes | 350 | 78% | Récupérables via GBIF (batch en cours — 112/450 faits) |
| GBIF ID | 338 | 75% | Batch automatique en cours (112/450 faits) |
| Propriétés thérapeutiques | 315 | 70% | Saisie manuelle ou import depuis bases ethnobotaniques |
| Usages ethnobotaniques | 323 | 72% | Saisie manuelle — sources : Plants for a Future, Ethnobotany.com |

### Priorité moyenne

| Champ manquant | Nb entrées | % | Action recommandée |
|---------------|-----------|---|-------------------|
| Origine géographique | 72 | 16% | Saisie manuelle — 72 plantes sans région d'origine |
| Statut de conservation | 0 | 0% | ✅ Complet (valeur par défaut "NE") |

### Images prioritaires à uploader (30 plantes les plus liées aux molécules)

1. *Nicotiana tabacum* (Tabac commun)
2. *Cannabis sativa* (Cannabis)
3. *Lavandula angustifolia* (Lavande vraie)
4. *Rosa damascena* (Rose de Damas)
5. *Jasminum grandiflorum* (Jasmin)
6. *Vetiveria zizanioides* (Vétiver)
7. *Santalum album* (Santal blanc)
8. *Boswellia sacra* (Encens / Oliban)
9. *Commiphora myrrha* (Myrrhe)
10. *Pelargonium graveolens* (Géranium rosat)
11. *Citrus bergamia* (Bergamote)
12. *Pogostemon cablin* (Patchouli)
13. *Ylang-ylang* (Cananga odorata)
14. *Cedrus atlantica* (Cèdre de l'Atlas)
15. *Cymbopogon citratus* (Lemongrass)
16. *Eucalyptus globulus* (Eucalyptus)
17. *Mentha piperita* (Menthe poivrée)
18. *Ocimum basilicum* (Basilic)
19. *Origanum majorana* (Marjolaine)
20. *Thymus vulgaris* (Thym)

---

## 3. VARIÉTÉS (9 entrées)

| Champ manquant | Nb entrées | % | Action recommandée |
|---------------|-----------|---|-------------------|
| Profil terpénique | 9 | 100% | Saisie manuelle — données disponibles dans les fichiers source |
| Molécules associées | 9 | 100% | Saisie manuelle via `/admin/varieties` |
| Généalogie parentale | 6 | 67% | Saisie manuelle — 3 variétés ont déjà leur généalogie |

**Variétés à compléter en priorité :**
- Nicotiana tabacum Virginia (profil terpénique + généalogie)
- Nicotiana tabacum Burley (profil terpénique + généalogie)
- Nicotiana tabacum Oriental (profil terpénique + généalogie)
- Cannabis sativa Sativa (profil terpénique complet)
- Cannabis indica (profil terpénique complet)

---

## 4. RECETTES (310 entrées)

| Champ manquant | Nb entrées | % | Action recommandée |
|---------------|-----------|---|-------------------|
| Formule détaillée | 78 | 25% | Saisie manuelle — 78 recettes sans formule |
| Notes de tête | 224 | 72% | Saisie manuelle — description olfactive de la pyramide |

**Recettes prioritaires sans formule (à compléter) :**
Les 78 recettes sans formule sont probablement des recettes conceptuelles ou en cours de développement. Les identifier via `/admin/recettes?filter=no_formula`.

---

## 5. TERROIRS (93 entrées)

| Champ manquant | Nb entrées | % | Action recommandée |
|---------------|-----------|---|-------------------|
| Coordonnées GPS | 35 | 38% | Saisie manuelle ou géocodage automatique par nom de région |

**35 terroirs sans GPS** — récupérables via Google Maps Geocoding API par nom de région.

---

## 6. TRANSFORMATIONS PYROLYTIQUES (161 entrées)

| Champ manquant | Nb entrées | % | Action recommandée |
|---------------|-----------|---|-------------------|
| Notes | 0 | 0% | ✅ Complet |
| Plage de température | 0 | 0% | ✅ Complet |

Les 161 transformations sont complètes. Enrichissement possible : ajouter des **références bibliographiques** (articles scientifiques, DOI) pour chaque transformation.

---

## 7. ACCORDS (32 entrées)

| Champ manquant | Nb entrées | % | Action recommandée |
|---------------|-----------|---|-------------------|
| Description | 0 | 0% | ✅ Complet |

---

## Synthèse par priorité

### 🔴 Priorité immédiate (impact fort, faisable rapidement)

1. **Images des 30 plantes principales** — Upload via `/admin/plantes` — Impact visuel immédiat sur toutes les fiches
2. **Profil olfactif des 24 molécules sans famille** — Saisie courte via `/admin/molecules`
3. **Plantes sources des molécules connues** — Linalol, Géraniol, Limonène, Eugénol, etc.

### 🟡 Priorité moyenne (enrichissement progressif)

4. **Profils terpéniques des 9 variétés** — Données disponibles dans les fichiers source du projet
5. **Généalogie des 6 variétés sans parenté** — Données historiques à rechercher
6. **Propriétés thérapeutiques des 315 plantes** — Import possible depuis Plants for a Future

### 🟢 Priorité basse (automatisable ou long terme)

7. **GBIF batch** — En cours automatiquement (112/450 → objectif 400+)
8. **PubChem batch** — Relancer sur les molécules avec CAS connu
9. **Géocodage des 35 terroirs sans GPS** — Script automatique possible
10. **Références bibliographiques pyrolyse** — Enrichissement scientifique long terme

---

*Ce document est mis à jour automatiquement via `node scripts/audit-db.mjs`*
