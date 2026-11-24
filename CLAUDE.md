# PERFUMUM — consignes pour les sessions Claude Code

PERFUMUM est hébergé par Manus et doit pouvoir tourner ailleurs : un service web Docker (Render, Francfort) relié à une base MySQL 8 ou TiDB (TiDB Cloud Starter, Francfort). Le code doit rester utilisable sur tout hébergeur Docker.

État du chantier : `docs/RAPPORT-LOT-1.md`. Guide d'installation : `docs/DEPLOIEMENT.md`.

## Règles

1. **Pas de production.** Ne jamais se connecter à la base de production ni à un service Manus. Aucune donnée réelle n'est nécessaire : tests unitaires, base de test vide ou données synthétiques.
2. **Branche dédiée.** Travailler sur une branche créée depuis `main` (celle que la session ouvre, ou `autonomie`). Ne rien pousser sur `main` et ne pas fusionner la pull request : Manus pousse lui-même sur `main`, la fusion se fera au moment de la bascule.
3. **Le mode Manus continue de marcher.** `PERFUMUM_PLATFORM` garde `manus` comme valeur par défaut dans le code ; seul le Dockerfile de production choisit `standalone`. Toute nouveauté est inactive tant que sa variable n'est pas définie.
4. **Rien ne disparaît.** Ne supprimer aucune fonctionnalité ni aucune page. Une page cassée se répare ou se signale dans le rapport.
5. **Aucun secret.** Ni secret ni adresse de base réelle dans le dépôt ; les exemples de configuration prennent des valeurs fictives.
6. **Petits commits vérifiés.** Petits commits, messages en français, chacun avec sa raison. Tests et construction verts avant chaque poussée. Si une vérification ne peut pas tourner dans l'environnement, le dire dans le rapport plutôt que la contourner.

## Commandes

| Commande | Rôle |
|---|---|
| `pnpm install --frozen-lockfile` | Dépendances. pnpm **10.4.1** (champ `packageManager`). |
| `pnpm test` | Tests unitaires, sans base. |
| `pnpm test:integration` | Tests qui demandent une base de test peuplée (`DATABASE_URL`). |
| `pnpm check` | Types. Demande jusqu'à 8 Go de mémoire. |
| `pnpm build:standalone` | Construction en mode autonome. `pnpm build` : mode Manus. |
| `docker build --platform linux/amd64 -t perfumum .` | Image de production. |

`server/scripts/` est perdu (jamais versionné, absent de l'espace Manus) : `serve-physical-tests.mjs`, `zenodo-olfactory-pilot.mjs`, `pred-o3-import.mjs`. Leurs commandes `pnpm` ont été retirées ; leur documentation est gardée, annotée. Les deux tests qui lisaient ces fichiers sont ignorés tant qu'ils sont absents. Ne pas réinventer ces scripts sans demande ; détail dans `docs/RAPPORT-LOT-1.md`.

## À savoir avant de modifier

- **Overrides pnpm.** pnpm 10.4.1 ignore ceux de `pnpm-workspace.yaml`. Ils sont dans `package.json` (`pnpm.overrides`) ; garder les deux listes identiques.
- **Tests avec base.** Une nouvelle suite qui interroge la base s'ajoute à `DB_DEPENDENT_TESTS` dans `vitest.config.ts`.
- **`LIMIT ?` interdit dans `.execute(`.** MySQL 8 le refuse. Utiliser `sqlInt()` (`server/db/sqlInt.ts`) ; `server/sql-limit-placeholder.test.ts` veille.
- **Connexions à la base.** Toujours `getMysqlConnection()` ou `createAppPool()` (`server/db/mysqlPool.ts`), jamais `mysql.createPool` ni `createConnection` directement : TiDB Cloud coupe les connexions inactives.
- **Porte d'accès** (`SITE_ACCESS_PASSWORD`, `server/_core/accessGate.ts`). Elle est montée avant toutes les routes ; `/healthz` est enregistré avant elle et doit le rester.
- **Fichiers.** Les adresses enregistrées sont relatives (`/files/<clé>`). Ne jamais écrire en dur une adresse du stockage Manus. Les 19 images de l'interface qui en venaient ont été retirées, pas recopiées : n'en réintroduire aucune (`server/client-assets.test.ts` veille).
- **Profil radar 50 × 6.** C'est la valeur par défaut de la colonne, pas une mesure : le traiter comme « non renseigné ».

## Lot 2 — ne pas commencer sans demande

Remplacer les cartes Google par Leaflet ; réparer les procédures qui citent des tables ou colonnes absentes ; réparer les 8 pages qui plantent ; corriger l'affichage des références sur les fiches de plantes ; corriger les listes coupées par `GROUP_CONCAT`. Relever ce qu'on croise, sans corriger.
