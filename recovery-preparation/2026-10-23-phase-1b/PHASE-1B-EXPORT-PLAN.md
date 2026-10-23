# Plan d’export vérifiable — Phase 1B

## État des moyens vérifiés

`mariadb-dump`/`mysqldump` 10.11.14, `mysql`/`mariadb`, `sha256sum`, `gpg`, `openssl`, `zip` et `unzip` sont disponibles localement. Aucun dump global TiDB n’a été exécuté ; leur compatibilité exacte avec l’instance TiDB doit donc être vérifiée par un préflight sans données avant l’export.

## Comparaison des options

| Option | Valeur | Limite / risque | Décision proposée |
|---|---|---|---|
| Dump SQL natif complet | Meilleur candidat à une restauration relationnelle, conserve DDL, index et ordonnancement selon l’outil | Compatibilité TiDB → outil MariaDB non démontrée ; snapshot cohérent non garanti par une suite de requêtes | Préflight obligatoire, puis option principale si snapshot explicite validé. |
| CSV par table | Inspection simple, logiciel indépendant, pratique pour contrôles de lignes | Types, `NULL`, JSON, BLOB, dates et bigint doivent être documentés ; pas de restauration structurelle autonome | Export complémentaire obligatoire pour chaque table incluse. |
| JSONL/NDJSON par table | Préserve mieux JSON, valeurs nulles et objets semi-structurés ; traitement par chunks | Ne reconstitue ni index ni contraintes | Export complémentaire obligatoire pour toute table ayant JSON ou structure libre. |
| Paquets par domaine | Facilite la reprise humaine : botanique, chimie, relations, bibliographie, application, médias | Ne doit pas créer de cohérence fictive ni remplacer l’archive table par table | Généré depuis le même snapshot uniquement, après export canonique. |

## Protocole exigé avant tout export

1. **Autorisation de périmètre.** Le propriétaire valide les tables par statut du manifeste, en particulier les 66 tables à chiffrement après approbation, les 133 à revue humaine, les métadonnées média et les exclusions.
2. **Destination et chiffrement.** Répertoire de destination sous contrôle du propriétaire, clé publique GPG validée hors bande, rétention et responsable désignés. Sans cela : arrêt.
3. **Fenêtre de cohérence.** Le responsable de la base confirme une fenêtre de gel DDL et une méthode de snapshot TiDB explicite. L’horloge cliente n’est jamais une ancre de snapshot.
4. **Préflight sans données.** Dans une connexion à privilèges minimaux et lecture seule : vérifier version, fuseau, politique de rétention/GC, acceptation de la syntaxe de snapshot, tables/vues/objets et capacité de l’outil SQL. Rollback immédiat.
5. **Une ancre unique `T`.** Si TiDB accepte un `AS OF TIMESTAMP` ou équivalent, tous les `SELECT` du même lot doivent être ancrés sur `T`, dans une seule session lecture seule. DDL et catalogue sont capturés durant le même gel DDL.
6. **Échec = arrêt du lot.** Connexion rompue, expiration/GC du snapshot, absence de gel DDL, divergence de catalogue ou transformation non documentée : le lot est marqué incomplet et ne doit pas être recollé silencieusement avec un second instant.

## Format canonique par table incluse

```text
schema/<table>.source.sql        DDL TiDB extrait sans transformation
schema/<table>.target.sql        DDL cible distinct, seulement si une adaptation est validée
data/<table>.sql                 INSERT par lots, ordre de colonnes explicite
data/<table>.csv                 UTF-8 RFC 4180, protocole NULL documenté
data/<table>.jsonl               un enregistrement par ligne, types préservés
meta/<table>.json                types, collation, PK/FK/index, comptes, bornes, chunks, hashes
```

Les tables vides conservent leur DDL, leur en-tête CSV, leur schéma JSONL et une métadonnée de zéro ligne. Elles ne sont pas omises.

## Types et données semi-structurées

- **JSON :** 85 tables en contiennent. Valider/serialiser comme JSON, jamais via conversion implicite ; `NULL` reste distinct de la chaîne `"null"`.
- **BigInt / Decimal :** conserver en représentation texte exacte dans CSV/JSONL et SQL, sans passage par nombre flottant JavaScript.
- **Dates :** documenter timezone, format UTC et type source ; ne pas convertir un `timestamp` en date locale.
- **BLOB :** si inclus, base64 dans JSONL/CSV et hex dans SQL ; sinon exclusion explicite et manifeste.
- **Tables sans PK :** préserver toutes les lignes, sans dédoublonnage. Les 25 tables sont listées dans le manifeste ; l’export doit déclarer son ordre et ses hashes de chunk.

## Cohérence et reprise après échec

La reprise ne s’effectue qu’au niveau d’un snapshot `T` complet et validé. Des fichiers partiels peuvent être réutilisés seulement si leurs hashes, leur ancre `T`, leurs bornes et leurs comptes correspondent au même manifeste. Aucun lot issu d’un autre instant `T` ne peut compléter le premier sans être déclaré comme export non atomique.
