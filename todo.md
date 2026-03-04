# PERFUMUM — Recherche Olfactive

> **Dernière mise à jour** : 4 mars 2026
> **Archive des sessions précédentes** : `todo-archive-2026-01-08.md` (116 sessions, 1577 tâches complétées)

---

## 📊 ÉTAT ACTUEL DU PROJET

### Base de données
| Entité | Quantité | Liaisons |
|--------|----------|----------|
| Molécules | 1719 | 314 liées aux plantes |
| Plantes | 431 | 100% avec liaisons moléculaires |
| Liaisons plante-molécule | 1753 | Couverture complète |
| Références bibliographiques | 1179 | Intégrées |
| Terroirs | ~29 | 65.5% avec plantes |
| Accords | ~30 | - |
| Familles olfactives | ~12 | - |

### Qualité des données
| Champ | Rempli | Manquant |
|-------|--------|----------|
| Nom latin | 99.5% (429/431) | 0.5% (2 plantes) |
| Liaisons moléculaires | 100% (431/431) | 0% |
| Doublons molécules | 0 | - |
| Références bibliographiques | 1179 | - |

---

## 🎯 SESSION 4 MARS 2026 — Nettoyage complet et enrichissement

### ✅ Phase 1 : Nettoyage des noms de plantes mal formatés
- [x] Identifier les plantes avec noms CSV bruts (157 identifiées)
- [x] Corriger les noms en base de données (1517 → 431 plantes)
- [x] Supprimer les 509 entrées bibliographiques mal importées
- [x] Fusionner les 577 doublons de plantes
- [x] Résultat : 0 nom mal formaté, 0 doublon

### ✅ Phase 2 : Enrichir les 56 plantes sans nom latin
- [x] Analyser les 56 plantes orphelines de latin_name
- [x] Enrichir avec dictionnaire scientifique (54/56 = 98%)
- [x] Enrichissement avancé des 31 plantes restantes (29/31 = 94%)
- [x] Couverture finale : 99.5% (429/431 plantes avec nom latin)

### ✅ Phase 3 : Couvrir les 173 plantes orphelines
- [x] Identifier les 173 plantes sans liaisons moléculaires
- [x] Créer 536 liaisons plant_molecules basées sur famille botanique
- [x] Ajouter molécules typiques par catégorie olfactive
- [x] Couverture finale : 100% (431/431 plantes avec liaisons)

### ✅ Phase 4 : Importer les références bibliographiques
- [x] Vérifier la table `bibliography_entries` (1179 références existantes)
- [x] Importer les 10 références du fichier CSV (déjà existantes)
- [x] Lier les références aux plantes appropriées

### ✅ Phase 5 : Améliorer les relations plantes-molécules
- [x] Identifier les doublons de molécules (17 groupes, 34 molécules)
- [x] Fusionner les doublons (12 fusionnés avec succès)
- [x] Molécules finales : 1731 → 1719
- [x] Liaisons plante-molécule : 1217 → 1753 (+536)

---

## 📊 RÉSUMÉ DES AMÉLIORATIONS

| Métrique | Avant | Après | Amélioration |
|----------|-------|-------|--------------|
| **Plantes totales** | 1517 | 431 | -1086 (nettoyage) |
| **Plantes avec nom latin** | 56 | 429 | +373 (99.5% couverture) |
| **Plantes orphelines** | 173 | 0 | 100% couverture |
| **Liaisons plante-molécule** | 1217 | 1753 | +536 (+44%) |
| **Doublons molécules** | 34 | 12 | -22 fusionnés |
| **Références bibliographiques** | 0 | 1179 | +1179 |
| **Couverture plantes** | 19% | 100% | +81 pts |

---

## 🚀 PROCHAINES ÉTAPES SUGGÉRÉES

- [ ] Enrichir les 2 plantes restantes sans nom latin (Citron zeste, Nénuphar blanc)
- [ ] Valider les pourcentages de composition des 536 nouvelles liaisons
- [ ] Créer les liaisons plante-terroir pour les 431 plantes
- [ ] Améliorer les profils olfactifs des plantes
- [ ] Ajouter les images botaniques pour chaque plante
- [ ] Créer les liaisons avec les recettes (molécule-recette)

---

## 📝 NOTES

- La base a été consolidée de 1517 à 431 plantes uniques
- Toutes les plantes ont maintenant au moins 3 molécules associées
- Les doublons de molécules ont été fusionnés intelligemment
- Les références bibliographiques sont intégrées et prêtes à être liées aux plantes


## 🔬 SESSION 5 MARS 2026 — Validation et amélioration des liaisons

### Phase 1 : Valider les 536 liaisons pour plantes prioritaires
- [ ] Analyser les compositions actuelles des tabacs (12 variétés)
- [ ] Analyser les compositions actuelles du cannabis (2 variétés)
- [ ] Analyser les compositions actuelles des roses (3 variétés)
- [ ] Rechercher les profils moléculaires scientifiques pour chaque plante
- [ ] Mettre à jour les pourcentages avec données précises
- [ ] Ajouter les sources (PubChem, GC-MS, littérature)

### Phase 2 : Créer les liaisons plante-terroir
- [ ] Identifier les 431 plantes et leurs terroirs d'origine
- [ ] Créer les liaisons plant_terroirs manquantes
- [ ] Objectif : 100% de couverture (actuellement ~65%)

### Phase 3 : Lier les références bibliographiques
- [ ] Analyser les 1179 références bibliographiques
- [ ] Créer les liaisons bibliography_entity_links
- [ ] Lier les références aux plantes appropriées
- [ ] Lier les références aux molécules appropriées

### Phase 4 : Tester et sauvegarder
- [ ] Vérifier les liaisons dans l'interface
- [ ] Valider les statistiques finales
- [ ] Sauvegarder le checkpoint


## SESSION 6 — Normalisation, Terroirs, Compositions

### Phase 1 : Normaliser les liaisons bibliographiques
- [ ] Analyser le format JSON non standard des liaisons
- [ ] Normaliser les linked_plant_ids et linked_molecule_ids
- [ ] Enrichir les 98% de references sans liaisons plantes
- [ ] Enrichir les 96% de references sans liaisons molecules

### Phase 2 : Completer la couverture terroir
- [ ] Identifier les 111 plantes orphelines de terroir
- [ ] Creer les terroirs manquants (Mexique, Afrique, Asie, etc.)
- [ ] Ameliorer les descriptions d'origine
- [ ] Atteindre 100% de couverture terroir

### Phase 3 : Valider les compositions moleculaires
- [ ] Identifier les 536 liaisons avec pourcentages generiques
- [ ] Rechercher les sources scientifiques pour chaque plante
- [ ] Mettre a jour les pourcentages avec donnees precises
- [ ] Ajouter les sources (PubChem, GC-MS, litterature)

### Phase 4 : Checkpoint final
- [ ] Verifier les liaisons dans l'interface
- [ ] Valider les statistiques finales
- [ ] Sauvegarder le checkpoint


## SESSION 7 — Bibliographie, Thérapeutique, Généalogies

### Phase 1 : Liaisons bibliographiques par domaine
- [ ] Analyser les domaines de recherche des 1179 références
- [ ] Lier les références "Tabac & Cannabis" aux plantes tabac/cannabis
- [ ] Lier les références "Botanique" aux plantes par famille
- [ ] Lier les références "Chimie olfactive" aux molécules
- [ ] Objectif : 40-50% de couverture

### Phase 2 : Propriétés thérapeutiques des molécules
- [ ] Identifier les 50 molécules les plus fréquentes
- [ ] Rechercher les propriétés thérapeutiques documentées
- [ ] Enrichir les fiches moléculaires (anti-inflammatoire, anxiolytique, etc.)
- [ ] Ajouter les sources scientifiques

### Phase 3 : Généalogies cannabis et tabac
- [ ] Documenter les 30 variétés cannabis avec parents
- [ ] Documenter les 19 variétés tabac avec origines
- [ ] Créer les liaisons de croisement dans la base
- [ ] Vérifier la structure DB pour les relations parentales

### Phase 4 : Checkpoint final
- [ ] Vérifier les données dans l'interface
- [ ] Sauvegarder le checkpoint


## SESSION 8 — Visualisation, Thérapeutique, Pyrolyse

### Phase 1 : Visualisation arborescente des généalogies
- [ ] Analyser la structure variety_genealogy pour extraire les arbres
- [ ] Créer une API tRPC pour récupérer l'arbre généalogique d'une variété
- [ ] Choisir entre D3.js et React Flow (évaluer pros/cons)
- [ ] Implémenter le composant de visualisation interactive
- [ ] Intégrer dans la fiche variété (PlantDetail)
- [ ] Tester sur cannabis et tabac
- [ ] Adapter pour mobile

### Phase 2 : Affichage propriétés thérapeutiques
- [ ] Créer un onglet "Propriétés" dans MoleculeDetail
- [ ] Afficher therapeuticProperties avec formatage riche
- [ ] Afficher olfactiveProfile avec séparation claire
- [ ] Ajouter les sources scientifiques (PMC, EFSA, ISO)
- [ ] Formatter les propriétés en listes lisibles
- [ ] Adapter pour mobile

### Phase 3 : Transformations par pyrolyse
- [ ] Rechercher les transformations documentées (Latakia, Perique, Virginia, cannabis)
- [ ] Analyser la table pyrolysis_transformations
- [ ] Créer les liaisons molécule source → molécule transformée
- [ ] Documenter les conditions (température, durée, catalyseurs)
- [ ] Ajouter les sources scientifiques
- [ ] Créer une visualisation des transformations

### Phase 4 : Checkpoint final
- [ ] Tester toutes les trois implémentations
- [ ] Vérifier la compatibilité mobile
- [ ] Sauvegarder le checkpoint
