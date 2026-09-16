# PERFUMUM — Bilan de remédiation contrôlée

**Période :** août–septembre 2026  
**Principe directeur :** séparer le signal, la preuve, la décision et une éventuelle application. Ce bilan ne correspond à aucune fusion, suppression, normalisation appliquée ni enrichissement automatique des tables scientifiques de production.

## État par domaine

| Domaine | Constat et propositions | Décision actuelle | Écriture dans les entités scientifiques |
|---|---|---|---|
| Conflits CAS | 169 groupes initiaux ; 2 groupes à convergence complète acceptés pour préparation ; tranche de convergence intermédiaire exportable. | Les cas intermédiaires sont ouverts en revue. | Aucune fusion, redirection ou modification de `molecules`. |
| Liens orphelins | 0 orphelin descripteur vivant ; 22 liens plante–terroir avec plante absente et aucun contexte de rattachement fiable. | Les 22 relations sont préservées comme historiques non résolues. | Aucune suppression ni réassociation. |
| Profils olfactifs | 1 proposition Flavornet explicitement horodatée : chavicol `spicy · clove · basil` ; 4 profils JSON historiques retenus faute de provenance. | Proposition maintenue en revue. | Aucune écriture dans `olfactiveProfile`. |
| Relations plante–molécule | 7 propositions GC-MS contextualisées pour deux lavandes ; cas à CAS ambigu, variété non alignée ou source incomplète retenus hors proposition. | Lot maintenu en revue sur instruction du propriétaire. | Aucune insertion dans `plant_molecules`, `molecule_plant_sources` ou tables associées. |
| Bibliographie | 23 DOI dont la forme seule diffère ; 36 groupes de même DOI normalisé ; 1 208 notices sans DOI à conserver ; lacunes d’auteurs, année, résumé et mots-clés affichées. | Cas maintenus en revue sur instruction du propriétaire. | Aucune notice fusionnée, supprimée, normalisée ou complétée. |

## Décisions et limites

Les deux confirmations CAS à forte convergence concernent les groupes `1405-86-3` et `473-98-3`. Elles n’établissent pas une fusion : elles permettent seulement de préparer une éventuelle résolution future, qui devra vérifier le plan complet de redirection des relations avant toute écriture.

Les seuils utilisés pour les relations plante–molécule exigent une source primaire, une méthode analytique, un contexte d’échantillon, un taxon local compatible, une cible moléculaire locale unique et l’absence de relation déjà existante. Les pourcentages affichés sont propres aux échantillons publiés ; ils ne sont ni des propriétés universelles du taxon ni des données de sécurité.

La normalisation bibliographique reste une opération de forme uniquement. Les notices sans DOI, notamment historiques ou archivistiques, ne sont pas des erreurs. De même, l’égalité de DOI normalisé est un signal de comparaison, non une décision de dédoublonnage.

## Liste de décisions humaines futures

| Décision | Précondition minimale | Prochaine action sûre |
|---|---|---|
| Appliquer un correctif CAS | Revue structurelle complète et test de redirection de toutes les relations. | Créer une prévisualisation dédiée par groupe, puis exiger une confirmation typée. |
| Réassocier un lien plante–terroir historique | Source primaire ou choix explicite d’une plante via autocomplétion. | Conserver la relation d’origine, afficher l’avant/après et journaliser le motif. |
| Publier un profil olfactif | Validation de la source et du vocabulaire. | Appliquer sur une seule molécule avec instantané de la preuve. |
| Créer une relation plante–molécule | Validation de la source GC-MS, de l’échantillon et du taxon précis. | Insérer une relation unique avec DOI, méthode, contexte et niveau de confiance. |
| Normaliser ou regrouper des notices | Comparaison humaine des titres, auteurs, années, types, provenance et liens. | Prévisualiser le diff, conserver les alias, ne supprimer aucune notice. |

## Validation technique

Les nouvelles procédures de prévisualisation sont réservées aux administrateurs. Les tests ciblés couvrent les permissions, l’idempotence du scan, les preuves CAS, l’audit vivant des orphelins, les profils sourcés, les relations GC-MS et la prévisualisation bibliographique ; ils valident l’absence de modification de `molecules`, `plants`, `bibliography_entries` et `plant_molecules` pendant les lectures. Le contrôle TypeScript a réussi après l’ajout du panneau bibliographique.
