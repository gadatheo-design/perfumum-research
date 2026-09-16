# PERFUMUM — Protocole de propositions plante–molécule

**Statut :** procédure de prévisualisation et de revue ; elle n’autorise ni insertion, ni suppression, ni modification de `plant_molecules`, `molecule_plant_sources` ou des champs moléculaires.

## Principe

Une relation proposée exprime une observation analytique précisément située. Elle ne signifie ni que la molécule est universellement présente dans le taxon, ni qu’elle est perçue dans toutes ses formes olfactives, ni qu’elle intervient à une concentration donnée hors de l’échantillon publié.

> Une correspondance de nom ou un champ `dominant_molecules` constitue un **indice de recherche**, jamais une preuve suffisante pour créer une relation scientifique.

## Seuil d’admissibilité

| Contrôle | Condition obligatoire pour une proposition | Si le contrôle échoue |
|---|---|---|
| Source | Publication primaire ou jeu de données analysable, cité par DOI/URL stable. | Retenir hors proposition. |
| Analyse | Méthode d’identification annoncée ; pour le premier lot, GC-MS. | Retenir hors proposition. |
| Taxon | Le taxon étudié doit correspondre à la plante locale au rang que la source autorise. Variété, cultivar et chémotype ne sont jamais inférés. | Retenir ou dégrader en piste « espèce proche ». |
| Échantillon | Partie végétale, préparation, origine ou contexte doivent être conservés dans la preuve. | Retenir hors proposition. |
| Molécule | CAS présent et associé à une seule entrée locale, ou autre résolution structurelle explicitement vérifiée. | Retenir hors proposition. |
| Doublon | La relation ne doit pas déjà exister dans `plant_molecules`. | Ne pas dupliquer ; consigner uniquement la source additionnelle dans une future procédure dédiée. |
| Portée quantitative | Toute valeur est libellée comme proportion de l’échantillon et associée à la méthode. | Ne pas afficher de plage ni suggérer une concentration générale. |

## Niveaux de confiance

| Niveau | Définition | Usage dans le cockpit |
|---|---|---|
| **Confirmé GC-MS** | Taxon et molécule localement compatibles ; source primaire, méthode et contexte d’échantillon conservés ; cible locale CAS unique. | Peut être affiché comme proposition, avec revue humaine obligatoire. |
| **Espèce proche** | Source pertinente au niveau de l’espèce, mais variété, cultivar, chémotype, terroir ou partie végétale diffère. | Visible uniquement comme piste ; jamais prêt à créer une relation précise. |
| **Retenu** | Cible moléculaire ambiguë, taxon incomplet, source insuffisante, ou relation déjà présente. | Non affiché comme proposition appliquable ; justification conservée. |

## Décision humaine et application future

La décision de revue doit citer la source, la raison de l’acceptation ou du rejet et les réserves résiduelles. Une éventuelle phase d’application devra être distincte du présent protocole : elle exigera une confirmation explicite, un aperçu ligne par ligne, l’identifiant de l’utilisateur, un instant UTC et un instantané de la preuve. L’acceptation d’une proposition ne produit **aucune écriture** par elle-même.

Les données du premier lot sont documentées dans [`2026-09-verification-sources-plante-molecule-lot-1.md`](../research/2026-09-verification-sources-plante-molecule-lot-1.md).
