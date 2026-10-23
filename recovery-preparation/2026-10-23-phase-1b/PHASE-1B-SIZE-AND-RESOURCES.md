# Estimation de taille et de ressources — Phase 1B

## Mesures disponibles

| Indicateur | Valeur | Nature |
|---|---:|---|
| Données TiDB estimées | 19,815 Mio | `information_schema.data_length` sur 293 tables ; estimation, pas mesure d’export. |
| Index TiDB estimés | 5,275 Mio | `information_schema.index_length`; les index ne se traduisent pas 1:1 dans un dump. |
| Total TiDB estimé | 24,089 Mio | Données + index ; ne pas confondre avec SQL/CSV/JSONL. |
| Tables | 293 | Mesure directe du catalogue. |
| Tables JSON | 85 | Mesure directe des types. |
| Tables sans PK | 25 | Mesure directe des contraintes. |
| Bundle Git v0.1 | 77,6 Mio | Mesuré lors de la Recovery Proof. |
| Médias aux tailles déclarées | 32,573 Mio | 49 références seulement sur 1 809. |

## Projection de stockage

Le SQL, CSV et JSONL sont redondants par conception. Le poids final dépendra des chaînes longues, JSON, compressibilité et BLOB. Sans médias binaires, une réserve **de 0,5 Gio** est raisonnable pour le staging et l’archive chiffrée ; avec le staging clair, viser au minimum **1 Gio disponible**. Cette valeur est une marge de travail, pas une garantie de taille finale.

La copie des médias est indéterminée : 1 760 références n’ont aucune taille déclarée. Elle doit donc être organisée comme un lot indépendant avec quota, manifestes et points d’arrêt.

## Catégorisation des opérations

| Catégorie | Opérations |
|---|---|
| Indispensables à la récupération | Snapshot cohérent TiDB, DDL, données approuvées par table, métadonnées, hashes, chiffrement, restauration isolée, bundle Git, manifestes. |
| Utiles mais différables | CSV/JSONL de commodité, paquets par domaine, export Notion autorisé, SBOM, médias binaires, deuxième cible de restauration. |
| Coûteuses ou risquées | Dump complet sans snapshot vérifié, copie de 1 809 références média, tables personnelles/privées sans décision, gros exports multi-format sans staging chiffré, analyse ou transformation de données avant sauvegarde. |

## Crédits et incertitude

Aucune télémétrie de crédits exploitable ne permet une estimation chiffrée fiable. Les opérations prévisiblement les plus coûteuses en temps, E/S et stockage sont l’export multi-format des 293 tables, la validation de JSON/chunks, le chiffrement et la copie des médias. Le travail de préparation effectué ici n’implique aucun export massif ; le choix de lancer les lots doit rester jalonné et arrêté au premier échec de snapshot ou de destination.
