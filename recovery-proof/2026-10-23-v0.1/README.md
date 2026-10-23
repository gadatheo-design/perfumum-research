# PERFUMUM — Recovery Proof v0.1

## Ce que ce paquet prouve

Ce paquet est une **preuve opérationnelle minimale**, et non une sauvegarde intégrale de PERFUMUM. Il contient une révision Git vérifiable, une sélection de configuration sans secrets, le DDL réel de sept tables, et un micro-corpus relationnel issu de la base TiDB de production mais lu sans aucune mutation.

Le corpus est centré sur la plante `480029`, *Ferula galbaniflua* (galbanum). Il contient exactement : 1 plante, 3 molécules, 1 terroir, 3 relations plante–molécule, 1 relation plante–terroir, 6 notices bibliographiques et 6 liens bibliographiques, soit 21 lignes dans 7 tables.

## Catégories de sortie de Manus

| Élément | État |
|---|---|
| `perfumum-research.bundle` | **B — exportable hors Manus** : archive Git vérifiée, clonable avec Git. |
| `configuration/`, `code-excerpt/`, `database/`, `assets/`, `MANIFEST.json`, `SHA256SUMS` | **B — exportable hors Manus** : fichiers ordinaires inclus dans l’archive ZIP de livraison. |
| Données complètes TiDB, objets de stockage Forge, secrets, cookies, sessions, configuration propriétaire d’hébergement | **C — état non inclus / dépendant de Manus** : le paquet ne prétend pas les extraire. |
| Pages Notion | **B sous permission** : à exporter séparément depuis l’espace Notion autorisé ; pas incluses ici. |

## Vérifier le paquet hors Manus

1. Télécharger `RECOVERY-PROOF-v0.1.zip` et le décompresser.
2. Depuis le dossier extrait, exécuter :

   ```bash
   sha256sum -c SHA256SUMS
   ```

3. Vérifier le bundle Git :

   ```bash
   git bundle verify perfumum-research.bundle
   ```

4. Cloner le dépôt à partir du bundle :

   ```bash
   git clone perfumum-research.bundle perfumum-research-restored
   cd perfumum-research-restored
   git rev-parse HEAD
   ```

   La révision attendue est indiquée dans `GIT-COMMIT.txt`.

## Restaurer le micro-corpus relationnel

Le script `RESTORE-SAMPLE.sh` restaure le corpus dans une base **locale** MySQL ou MariaDB accessible via un socket local. Il refuse toute socket non absolue, tout nom de base différent de `perfumum_recovery_proof_v01` et tout écrasement d’une base déjà existante.

Démarrer une instance locale isolée, puis lancer :

```bash
export RECOVERY_MYSQL_SOCKET=/chemin/vers/mysql.sock
./RESTORE-SAMPLE.sh
```

Le script crée une base vide, charge `database/schema/sample-schema.sql`, importe `database/sample/sample-data.sql`, puis contrôle les comptes et lit des entités du corpus. Il ne lit ni n’écrit dans la base TiDB de production.

## Installer et construire le code

Le bundle Git contient l’historique complet et le fichier `pnpm-lock.yaml`. Dans une copie clonée, lancer :

```bash
corepack enable
pnpm install --frozen-lockfile
pnpm build
```

Le résultat de cette commande doit être interprété avec `MANUS-DEPENDENCY-INITIAL.md` : un build peut fonctionner tout en laissant l’authentification, Forge Storage, Data API, cartes, LLM, image, transcription et notifications dépendants de Manus.

## Contenu et exclusions

Sont exclus intentionnellement : base complète, médias binaires, objets Forge, utilisateurs, comptes, cookies, secrets, jetons, clés, cache local, `node_modules`, données analytiques non sélectionnées et toute mutation du corpus. `assets/variety-images-reference-inventory.csv` est seulement un inventaire de références : aucune image n’est copiée et la présence d’une URL ne prouve ni son accessibilité ni son droit de redistribution.

## Limites connues

- La base réelle contient 293 tables, alors que Drizzle en déclare 199 et que le dépôt contient 98 migrations SQL. La matrice fournie décrit l’écart sans le résoudre.
- Le sous-corpus a été sélectionné pour sa fermeture relationnelle ; il ne prétend pas représenter l’intégralité des pratiques documentaires ou scientifiques de PERFUMUM.
- Le dump n’est pas un backup global et ne doit pas être utilisé pour reconstituer la production.
- Le test de restauration doit être rapporté honnêtement dans `RESTORE-TEST-REPORT.md` ; un échec de compatibilité ne doit pas être masqué.
