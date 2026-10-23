# Inventaire médias Forge et références binaires — Phase 1B

## Résultat réel

L’inventaire a lu uniquement les références présentes en base ; aucun binaire n’a été téléchargé, aucun URL n’a été testé et aucune requête Forge n’a été émise.

| Table | Références candidates | Nature observée |
|---|---:|---|
| `plants` | 1 750 | `image_url` ; références externes ou de présentation, accessibilité non testée. |
| `variety_images` | 32 | `file_key`, `file_url`, nom, MIME, taille, source, attribution : principal candidat Forge. |
| `sample_images` | 17 | `file_key`, nom, MIME, taille : candidat Forge. |
| `europeana_bookmarks` | 6 | miniatures/IIIF externes : droit et disponibilité à vérifier. |
| `leaf_economies` | 3 | liens média/image : format non caractérisé. |
| `vr_scenes` | 1 | champ `assets` : structure à vérifier. |
| **Total** | **1 809** | Références, pas fichiers récupérés. |

49 références ont une taille déclarée totalisant **34 155 509 octets** (32,573 Mio). Les **1 760** autres n’ont pas de taille renseignée. 49 références portent une clé de fichier ; 1 791 contiennent une URL directe ou un chemin similaire. Ces chiffres ne prouvent ni que les objets existent toujours, ni que leur contenu peut être copié légalement.

## Champs consignés par objet

Le fichier `inventory/media-reference-inventory.csv` enregistre la table, le locator de ligne (PK ou hash de référence pour les tables sans PK), les colonnes de référence, l’emplacement déclaré, MIME, taille, source, URL de source, attribution, accessibilité, droits, statut de récupération et restriction. Les statuts sont volontairement uniformes : `non testée — aucune requête Forge ni téléchargement binaire` et `inventorié seulement`.

## Permissions nécessaires avant récupération binaire

1. Accord écrit du propriétaire pour une copie en lecture des objets de stockage approuvés.
2. Credential/proxy Forge en lecture minimale pour obtenir une URL de téléchargement d’une **clé connue** ; aucune permission d’upload/suppression.
3. Décision explicite sur l’absence ou la nécessité de lister les objets orphelins : éviter le listing par défaut.
4. Validation des licences, source et attribution par média ; une URL Wikimedia, Europeana ou tierce ne constitue pas une autorisation de redistribution.
5. Destination chiffrée et clé publique de récupération avant toute copie.

## Limite

Le code `server/storage.ts` prouve l’existence d’une méthode de récupération d’URL signée pour une clé connue, mais ne prouve ni le scope effectif des credentials, ni un listing Forge, ni la récupération des 49 objets à clé, ni les droits. La récupération binaire est donc hors périmètre jusqu’à approbation distincte.
