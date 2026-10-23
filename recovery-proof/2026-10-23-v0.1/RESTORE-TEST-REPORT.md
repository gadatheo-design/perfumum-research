# Restore Test — Recovery Proof v0.1

**Résultat : RÉUSSI**  
**Cible : MariaDB 10.11.14 locale, socket Unix uniquement, réseau désactivé**  
**Source de données : micro-export TiDB en lecture seule ; aucune mutation de la base de production.**

## Exécution effective

Une instance MariaDB a été initialisée dans un répertoire temporaire sous `/tmp`, avec `--skip-networking`. Elle n’a écouté sur aucun port TCP. Le script `RESTORE-SAMPLE.sh` a créé la base locale `perfumum_recovery_proof_v01`, chargé `database/schema/sample-schema.sql`, puis importé `database/sample/sample-data.sql`.

Les contrôles de fin d’exécution ont retourné :

| Table | Lignes attendues | Lignes restaurées |
|---|---:|---:|
| `plants` | 1 | 1 |
| `molecules` | 3 | 3 |
| `terroirs` | 1 | 1 |
| `plant_molecules` | 3 | 3 |
| `plant_terroirs` | 1 | 1 |
| `bibliography_entries` | 6 | 6 |
| `bibliography_entity_links` | 6 | 6 |
| **Total** | **21** | **21** |

La lecture post-restauration a bien retourné `Ferula galbaniflua (galbanum)`, ses trois relations molécule, sa relation terroir et ses six liens bibliographiques. La sortie brute est conservée dans `RESTORE-TEST-RAW.txt`.

## Anomalies réellement rencontrées, puis corrigées

1. Le premier lancement a échoué avant import parce que `RESTORE-SAMPLE.sh` n’avait pas le bit exécutable. Il a été ajouté (`chmod 755`) ; aucun fichier de production n’a été modifié.
2. Le premier import après cette correction a révélé une erreur de contrainte JSON MariaDB : le sérialiseur de l’exporteur transformait des objets JSON retournés par `mysql2` en texte `[object Object]`. Le sérialiseur de **l’exporteur du kit uniquement** a été corrigé pour produire du JSON valide. L’export a été régénéré et le second test a réussi.

Ces erreurs concernent la preuve de récupération nouvellement créée, pas les données TiDB source. Elles sont rapportées afin que le succès final soit vérifiable et non simulé.

## Nettoyage

Après les contrôles, le processus MariaDB a été arrêté et son répertoire de données temporaire a été supprimé. La base locale restaurée n’existe plus. La base TiDB de production n’a reçu aucune instruction `INSERT`, `UPDATE`, `DELETE`, `ALTER`, `CREATE`, `DROP`, migration ou `db:push`.

## Ce que ce test ne prouve pas

Il ne prouve pas la restauration intégrale des 293 tables, la récupération des médias, ni le remplacement des services Manus/Forge. Il établit seulement qu’un sous-corpus réel et relationnel peut être extrait de TiDB, transféré sous forme de fichiers ordinaires et relu dans une base locale indépendante de Manus.
