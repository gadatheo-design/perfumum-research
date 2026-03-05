# Rapport d'Audit Qualité — PERFUMUM
**Date :** 5 mars 2026 (Session 16)
**Comparaison avec :** Audit précédent — 5 mars 2026 (Session 14-15)

---

## Résumé Exécutif

Cet audit compare l'état actuel de la base de données PERFUMUM avec les métriques enregistrées lors du dernier audit de qualité (session 14-15, 5 mars 2026). L'objectif est de mesurer les progrès accomplis sur les axes prioritaires : enrichissement PubChem, normalisation taxonomique, couverture des données structurales et connexions inter-entités.

---

## 1. Molécules — État actuel

| Indicateur | Audit précédent | Aujourd'hui | Évolution |
|---|---|---|---|
| **Total molécules** | 1 045 | 1 045 | = |
| Validées (`validee`) | 500 | **0** | ⚠️ Régression |
| En révision (`en_revision`) | 108 | **284** | +176 |
| Brouillon (`brouillon`) | 437 | **261** | -176 |
| **Couverture CAS** | ~730 (70%) | **745 (71,3%)** | +15 |
| **Couverture SMILES** | ~172 (16%) | **202 (19,3%)** | +30 |
| **Couverture InChI** | ~172 (16%) | **240 (23%)** | +68 |
| **Masse exacte** | ~172 | **240 (23%)** | +68 |
| **PubChem CID** | ~172 | **251 (24%)** | +79 |
| Avec famille chimique | — | **284 (27,2%)** | — |
| Avec profil olfactif | — | **1 021 (97,7%)** | — |
| Avec classe chimique | — | **747 (71,5%)** | — |
| Avec données IFRA | — | **1 045 (100%)** | — |

> **Note sur le statut "validée" :** La valeur 0 indique un problème de mapping entre le champ `validation_status` et la valeur `"validee"` — les 500 molécules précédemment marquées comme validées semblent avoir migré vers `"en_revision"` lors de l'enrichissement PubChem. Ce point nécessite une vérification et une correction de mapping.

### Lacunes prioritaires

| Lacune | Nombre de molécules | Priorité |
|---|---|---|
| Sans SMILES | 843 (80,7%) | Haute |
| Sans famille chimique | 761 (72,8%) | Haute |
| Sans CAS (hors validées) | 300 (28,7%) | Moyenne |
| Sans profil olfactif | 24 (2,3%) | Basse |

### Top 10 familles chimiques représentées

Les 284 molécules avec famille renseignée révèlent une fragmentation taxonomique persistante : `"acide phenolique"` et `"acide_phenolique"` coexistent comme deux entrées distinctes, de même que `"[MÉLANGE] "` (avec espace parasite). Une deuxième passe de normalisation est recommandée.

---

## 2. Plantes — État actuel

| Indicateur | Audit précédent | Aujourd'hui | Évolution |
|---|---|---|---|
| **Total plantes** | 450 | 450 | = |
| Couverture Köppen | 450 (100%) | **450 (100%)** | = ✅ |
| Avec profil olfactif | — | **379 (84,2%)** | — |
| Avec liaisons molécules | — | **435 (96,7%)** | — |
| Total liaisons plante-molécule | — | **1 903** | — |
| Sans molécule | — | **15 (3,3%)** | — |
| Avec coordonnées GPS | — | **133 (29,6%)** | — |

La couverture Köppen est complète (100%). Les 15 plantes sans molécule représentent la priorité résiduelle pour les liaisons botaniques. La couverture GPS à 29,6% est un axe d'amélioration pour la carte des origines.

---

## 3. Tabacs — État actuel

| Indicateur | Audit précédent | Aujourd'hui | Évolution |
|---|---|---|---|
| **Total variétés** | 42 | 42 | = |
| Avec lien terroir | 42 (100%) | **42 (100%)** | = ✅ |
| Avec profil aromatique | — | **42 (100%)** | ✅ |
| Avec liaisons moléculaires | — | **6 (14,3%)** | ⚠️ Faible |

La couverture terroir et aromatique est complète. En revanche, seulement 6 des 42 variétés de tabac ont des liaisons moléculaires directes — c'est le principal axe de progression pour renforcer l'axe tabac×parfum.

---

## 4. Synergies Moléculaires

| Indicateur | Audit précédent | Aujourd'hui | Évolution |
|---|---|---|---|
| Synergies (table `synergies`) | — | **53** | — |
| Synergies moléculaires avancées | 173 | **173** | = |
| — Potentialisation | 100 | **96** | -4 |
| — Transformation | — | **39** | — |
| — Stabilisation | — | **20** | — |
| — Masquage | — | **12** | — |
| — Neutralisation | — | **6** | — |

Les 173 synergies moléculaires avancées (table `molecule_synergies`) restent stables. La répartition par type montre une prédominance des potentialisations (55%), suivies des transformations (22,5%).

---

## 5. Bibliographie

| Indicateur | Audit précédent | Aujourd'hui | Évolution |
|---|---|---|---|
| **Total références** | 1 179 | 1 179 | = |
| Références liées à une entité | 404 (34,3%) | **404 (34,3%)** | = |
| Total liaisons bibliographiques | 10 987 | **10 987** | = |

La couverture bibliographique plafonne à 34,3% — les 775 références institutionnelles sans entités spécifiques constituent le plafond identifié lors de la session 13. Un travail de liaison manuelle ou par LLM ciblé sur des entités précises permettrait de progresser.

---

## 6. Accords, Recettes & Cigarillos

| Indicateur | Audit précédent | Aujourd'hui | Évolution |
|---|---|---|---|
| **Accords** | 32 | 32 | = |
| Avec description | 32 (100%) | **32 (100%)** | = ✅ |
| Avec liaisons moléculaires | — | **0** | ⚠️ |
| **Recettes** | — | **310** | — |
| Avec description | — | **170 (54,8%)** | — |
| **Recettes cigarillos** | 24 | **32** | +8 |
| Avec profil terpénique | 24 (100%) | **32 (100%)** | ✅ |

Les accords n'ont aucune liaison moléculaire directe dans la table `molecule_accords` — les liaisons passent probablement par une autre table. À vérifier. Les recettes cigarillos ont progressé de 24 à 32 (+8) avec 100% de couverture terpénique.

---

## 7. Terroirs

| Indicateur | Audit précédent | Aujourd'hui | Évolution |
|---|---|---|---|
| **Total terroirs** | 93 | 93 | = |
| Avec coordonnées GPS | — | **58 (62,4%)** | — |
| Avec description | — | **56 (60,2%)** | — |
| Liés à des plantes | — | **88 (94,6%)** | — |

La couverture GPS (62,4%) et descriptive (60,2%) laisse 37-40% des terroirs sans données géographiques ou textuelles. Les 5 terroirs prioritaires identifiés (Grasse, Ispahan, Mysore, Yunnan, Bulgarie) devraient être enrichis en priorité.

---

## 8. Parfums Emblématiques

| Indicateur | Audit précédent | Aujourd'hui | Évolution |
|---|---|---|---|
| Parfums distincts | 66 | **66** | = |
| Liaisons molécule-parfum | — | **169** | — |
| Liaisons plante-parfum | — | **59** | — |
| Molécules liées à un parfum | — | **45 (4,3%)** | — |

La base parfums est stable avec 66 parfums emblématiques. Seulement 4,3% des molécules ont une liaison parfum — un axe d'enrichissement important pour le projet.

---

## 9. Variétés & Généalogie

| Indicateur | Audit précédent | Aujourd'hui | Évolution |
|---|---|---|---|
| Variétés | 9 | **9** | = |
| Liaisons généalogiques | 86 | **86** | = |
| Landraces | 54 | **54** | = |
| Landraces avec profil terpénique | — | **8 (14,8%)** | ⚠️ Faible |

Seulement 8 des 54 landraces ont un profil terpénique documenté (14,8%). C'est un axe de progression important pour la section cannabis.

---

## 10. Pyrolyse & Transformations

| Indicateur | Audit précédent | Aujourd'hui | Évolution |
|---|---|---|---|
| Transformations pyrolytiques | 123 | **123** | = |

---

## 11. Sourcing & Fournisseurs

| Indicateur | Audit précédent | Aujourd'hui | Évolution |
|---|---|---|---|
| **Total fournisseurs** | 11 | 11 | = |
| Spécialistes tabac | 6 | 6 | = |
| Spécialistes cannabis | 5 | 5 | = |
| Fournisseurs parfum/botanique | 0 | **0** | ⚠️ À compléter |

---

## Synthèse des Priorités

### Priorité 1 — Corrections urgentes

| Action | Impact | Effort |
|---|---|---|
| Corriger le mapping `validation_status = "validee"` (500 molécules perdues) | Élevé | Faible |
| Normaliser les doublons de familles chimiques (`acide phenolique` vs `acide_phenolique`, `[MÉLANGE] `) | Moyen | Faible |
| Ajouter liaisons moléculaires aux accords (table `molecule_accords` vide) | Moyen | Moyen |

### Priorité 2 — Enrichissement structurel

| Action | Impact | Effort |
|---|---|---|
| Enrichir SMILES pour les 843 molécules sans structure (via PubChem synonymes) | Élevé | Élevé |
| Compléter les familles chimiques (761 molécules sans famille) | Élevé | Moyen |
| Ajouter liaisons moléculaires aux 36 tabacs sans molécules | Moyen | Moyen |
| Enrichir profils terpéniques des 46 landraces sans données | Moyen | Moyen |

### Priorité 3 — Expansion des données

| Action | Impact | Effort |
|---|---|---|
| Ajouter 15 fournisseurs parfum/botanique (Givaudan, Firmenich, Robertet…) | Moyen | Faible |
| Enrichir GPS des 335 plantes sans coordonnées | Moyen | Moyen |
| Lier davantage de molécules aux 66 parfums emblématiques | Moyen | Moyen |
| Enrichir descriptions des 37 terroirs sans texte | Faible | Moyen |

---

## Score Global de Qualité

| Dimension | Score | Commentaire |
|---|---|---|
| Couverture CAS | 71,3% | Bon, objectif 80% |
| Couverture SMILES | 19,3% | Faible, axe prioritaire |
| Couverture olfactive | 97,7% | Excellent |
| Couverture Köppen | 100% | Complet ✅ |
| Couverture terroir tabac | 100% | Complet ✅ |
| Couverture terpénique cigarillos | 100% | Complet ✅ |
| Couverture bibliographique | 34,3% | Plafond identifié |
| Couverture moléculaire tabac | 14,3% | Priorité |
| Couverture terpénique landraces | 14,8% | Priorité |

**Score global estimé : 68/100** — en progression par rapport à l'audit précédent (estimé ~62/100), principalement grâce à l'enrichissement PubChem (+79 CID, +68 InChI/masse) et à la complétion des profils terpéniques cigarillos.

---

*Rapport généré automatiquement — PERFUMUM Research Platform — Mars 2026*
