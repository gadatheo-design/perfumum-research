# PERFUMUM — Audit de normalisation bibliographique

**Date :** 16 septembre 2026  
**Méthode :** requêtes SQL de lecture seule sur `bibliography_entries`. Aucun DOI, auteur, résumé, mot-clé ou lien n’a été modifié.

## Indicateurs observés

| Indicateur | Nombre de notices | Lecture correcte |
|---|---:|---|
| Notices bibliographiques | 1 501 | Périmètre du relevé. |
| DOI absent | 1 208 | Une absence de DOI n’est pas une erreur : les sources anciennes, archives et ouvrages peuvent ne pas en avoir. |
| DOI nécessitant uniquement minuscules / suppression des espaces périphériques | 23 | Candidats à une normalisation de forme **prévisualisée**. |
| DOI au format non canonique | 3 | À vérifier individuellement : l’irrégularité peut venir d’un identifiant historique ou d’une saisie erronée. |
| Auteurs absents | 538 | Lacune de métadonnée, sans présumer qu’une récupération externe est possible. |
| Année absente | 576 | Lacune de métadonnée. |
| Résumé absent | 777 | Lacune de métadonnée ; le texte intégral ou l’abstract peut être indisponible sous licence. |
| Mots-clés absents ou vides | 1 288 | Lacune de métadonnée ; à distinguer de termes indexés externes. |

## Doublons DOI candidats

La requête trouve 36 groupes de DOI normalisés dupliqués. Ces groupes sont des **candidats de revue**, non des doublons à fusionner automatiquement : un même DOI peut correspondre à une notice de publication et à un enregistrement secondaire de catalogue, de dépôt, ou de métadonnées enrichies.

Les quatre groupes comptant trois notices sont : `10.1021/cbe.3c00083`, `10.1038/s41586-025-09065-0`, `10.1093/nar/gkn695` et `10.3390/heritage6060236`. Le rapprochement doit comparer titre, auteurs, année, type de notice, provenance et liens existants avant toute décision.

> **Garde-fou.** La première phase ne fait qu’exposer les différences de forme et les lacunes. Elle ne transforme pas les DOI, ne complète pas une notice et ne fusionne ou ne supprime aucun enregistrement.
