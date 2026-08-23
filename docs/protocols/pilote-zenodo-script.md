# Script du pilote Zenodo : exécution sûre et validation humaine

Le flux est volontairement scindé en quatre étapes. Aucune commande ne modifie les descripteurs, les plantes, les molécules ou les associations scientifiques de production.

| Étape | Commande | Écriture autorisée |
|---|---|---|
| Préparer | `python3 server/scripts/prepare-zenodo-olfactory-pilot.py --input <lexique.xlsx> --output data/pilots/zenodo_cocd_pilot_50.csv` | CSV uniquement |
| Simuler | `node --import tsx server/scripts/zenodo-olfactory-pilot.mjs --input data/pilots/zenodo_cocd_pilot_50.csv --dry-run` | aucune |
| Mettre en transit | `node --import tsx server/scripts/zenodo-olfactory-pilot.mjs --input data/pilots/zenodo_cocd_pilot_50.csv --stage` | tables de transit uniquement |
| Pré-annoter | `node --import tsx server/scripts/zenodo-olfactory-pilot.mjs --batch zenodo-cocd-50-v1 --preannotate` | propositions LLM dans la zone de transit |
| Réviser | `node --import tsx server/scripts/zenodo-olfactory-pilot.mjs --batch zenodo-cocd-50-v1 --export-review data/pilots/zenodo_review.csv` | CSV de revue uniquement |
| Appliquer la revue | `node --import tsx server/scripts/zenodo-olfactory-pilot.mjs --apply-review data/pilots/zenodo_review.csv` | décisions humaines dans les tables de transit |

Les deux rôles requis dans le CSV de revue sont `linguistic` et `domain`. Les décisions autorisées sont `accepted`, `accepted_with_context`, `needs_research` et `rejected`. Toute absence de double revue, de licence ou de provenance bloque la transaction.

La dernière étape **ne crée aucune association de production**. Une future étape d’intégration devra cibler une table de termes attestés et être déclenchée explicitement par un administrateur.
