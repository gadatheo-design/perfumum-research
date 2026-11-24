# Script du pilote Zenodo : exécution sûre et validation humaine

> **Script perdu — ces commandes n'existent plus.** Le script `server/scripts/zenodo-olfactory-pilot.mjs` a été perdu à la sortie de Manus : il n'avait jamais été versionné (la ligne `scripts/` du `.gitignore` masquait le dossier) et il n'existe plus dans l'espace de travail Manus. Les commandes `pnpm pilot:zenodo:*` ont été retirées de `package.json` le 24 novembre 2026. Ce document est conservé pour mémoire : il décrit le protocole, pas un outil disponible. Le routeur et les tables du pilote, eux, sont intacts.

Le flux est volontairement scindé en quatre étapes. Aucune commande ne modifie les descripteurs, les plantes, les molécules ou les associations scientifiques de production.

| Étape | Commande | Écriture autorisée |
|---|---|---|
| Préparer | Produire un CSV conforme depuis le lexique source, hors base | CSV uniquement |
| Simuler | `node --import tsx server/scripts/zenodo-olfactory-pilot.mjs --input <pilot.csv> --dry-run` | aucune |
| Mettre en transit | `node --import tsx server/scripts/zenodo-olfactory-pilot.mjs --input <pilot.csv> --stage --confirm-stage` | tables de transit uniquement ; idempotent sur `external_term_id` |
| Pré-annoter | `node --import tsx server/scripts/zenodo-olfactory-pilot.mjs --batch zenodo-cocd-50-v1 --preannotate --allow-llm --limit 10` | propositions LLM dans la zone de transit, seulement après consentement explicite ; aucun lien scientifique |
| Réviser | `node --import tsx server/scripts/zenodo-olfactory-pilot.mjs --batch zenodo-cocd-50-v1 --export-review <review.csv>` | CSV de revue uniquement |
| Appliquer la revue | `node --import tsx server/scripts/zenodo-olfactory-pilot.mjs --batch zenodo-cocd-50-v1 --apply-review <review.csv> --reviewer-name <nom> --confirm-apply` | deux décisions append-only par ligne, dans les tables de transit uniquement |

Les deux rôles requis dans le CSV de revue sont `linguistic` et `domain`. Les décisions autorisées sont `accepted`, `accepted_with_context`, `needs_research` et `rejected`. Toute absence de double revue, de licence ou de provenance bloque la transaction. Le CLI ne peut pas finaliser un transit : la dernière confirmation `METTRE EN TRANSIT` reste réservée au parcours administrateur authentifié.

La dernière étape **ne crée aucune association de production**. Une future étape d’intégration devra cibler une table de termes attestés et être déclenchée explicitement par un administrateur.
