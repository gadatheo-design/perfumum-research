# Rapport — Lot 1 : rendre PERFUMUM déployable hors de Manus

Branche : `claude/charming-edison-6tnuvl`, créée depuis `main` (commit `7274cf5e`).
Dates : 23 novembre 2026.
Rien n'a été poussé sur `main`. Aucune connexion à la base de production ni à un service Manus.

## En bref

- Les huit étapes du brief sont faites.
- `pnpm build:standalone`, `pnpm build` (mode Manus) et `pnpm check` passent.
- `pnpm test` : vert depuis le 24 novembre (1 454 tests réussis, 1 ignoré). Le test ignoré lit un script perdu, voir « Fichiers perdus : `server/scripts/` ».
- L'image Docker a été construite et lancée ; la porte d'accès, `/healthz`, les requêtes corrigées et les suggestions de synergies ont été essayées dans l'image, sur MySQL 8.0.46 avec des données synthétiques.
- **Une chose demande votre intervention** : faire un premier essai sur TiDB Cloud et Render, que je n'ai pas pu joindre.
- **Les 19 images de l'interface** qui venaient du stockage Manus ont été retirées, sur décision du 24 novembre : voir l'étape 7.
- **Trois scripts sont définitivement perdus** (`server/scripts/`) : voir la section qui leur est consacrée.

## Ce qui est fait, commit par commit

| Commit | Étape | Contenu |
|---|---|---|
| `0ec1c362` | 1 | Fusion de `claude/perfumum-manus-audit-iu0c7t` (34 commits) dans la branche. Résolution des 8 conflits ci-dessous. |
| `b912c8cb` | 1 | Trois suites de tests ajoutées par Manus, qui interrogent une vraie base, rejoignent la liste des tests d'intégration. |
| `83652106` | 2 | `GET /healthz` : 200, version et commit, sans toucher à la base. |
| `11621f0f` | 2 | Dockerfile : client compilé en `standalone`, plus de `pnpm store prune`, cache en `sharing=locked`, `HEALTHCHECK` sur `/healthz`, commit transmis à l'image. |
| `a78adadf` | 2 | `docker.yml` : publie aussi `autonomie` et `claude/**`, étiquetées par branche et par SHA ; plateforme `linux/amd64`. |
| `ea5492fd` | 3 | Porte d'accès privée `SITE_ACCESS_PASSWORD` et ses 20 tests. |
| `9bc6b05a` | 4 | Sept `LIMIT ?` corrigés ; test qui empêche d'en réintroduire. |
| `8e11e402` | 4 | Pool de connexions : inactivité, âge maximal, reprise après coupure. |
| `9f76cec5` | 5 | `synergies.getSuggestions` : mémoire bornée, profil par défaut exclu, message quand il n'y a rien. |
| `8c8a4864` | 6 | Script umami inséré seulement si `VITE_ANALYTICS_ENDPOINT` est défini. |
| `243d66f4` | 7 | Les 19 adresses CloudFront du code remplacées par `/media/…`, avec un filet de sécurité. |
| `32d12fd0` | 7 | `deploy/migrate-media-urls.mjs` pour les adresses enregistrées en base. |
| `2c7e013a` | 8 | `docs/DEPLOIEMENT.md`, `CLAUDE.md`, ce rapport. |
| `e4acabc2` | — | `server/scripts/` perdu : `.gitignore` corrigé, deux tests ignorés tant que les fichiers sont absents, perte consignée ici. |
| `989b133d` | 7 | Les 19 images de l'interface sont retirées au lieu d'être recopiées ; filet de sécurité, dossier `client/public/media/` et `deploy/fetch-media.mjs` supprimés. |
| `2b7cd592` | — | Commandes `pnpm` des scripts perdus retirées de `package.json`, leur documentation annotée ; workflow Datadog supprimé. |
| (24 novembre) | 7 | `Projets` : quatre photos de terrain restaurées depuis l'historique Git. `GalerieBotaniques`, `GammesPetrichor` : références aux images absentes retirées. `ZenodoTermReview` : renvoi à la commande disparue remplacé. |
| (24 novembre) | — | Compression gzip des réponses HTTP. |

## Comment chaque conflit a été résolu

| Fichier | Résolution |
|---|---|
| `package.json` | Scripts des deux côtés gardés (`pilot:zenodo:*`, `physical-tests*` de Manus ; `build:standalone`, `test:integration`, `test:all` de la branche). `nanoid ^5.1.16` (Manus). `mysql2` passe en dépendance d'exécution (branche) : sans cela, l'image installée sans dépendances de développement ne démarre pas. Bloc `pnpm.overrides` rétabli, voir la note. |
| `pnpm-lock.yaml` | Repris de `main`, puis régénéré avec pnpm 10.4.1. |
| `server/db/mysqlPool.ts` | Version de `main` plus la journalisation de la branche (réécrit ensuite à l'étape 4). |
| `drizzle/schema-modules/shadow-tables.ts` | Les quatre colonnes de validation ajoutées par Manus à `perique_molecule_links` sont gardées. |
| `server/routers/cinema-smellscapes.ts`, `molecules-qid.ts`, `sparql.ts` | Import `OUTBOUND_USER_AGENT` de la branche gardé : le code fusionné s'en sert. |
| `tsconfig.check.json` | Points d'entrée de `main` (sans `App.tsx` ni `main.tsx`), sans les exclusions en bloc que la branche avait retirées. En-tête réécrit. |

**Note sur les overrides pnpm.** Manus avait déplacé les `overrides` de `package.json` vers `pnpm-workspace.yaml`. pnpm 10.4.1, la version fixée par le projet, ignore cet emplacement : le lockfile de `main` ne les appliquait donc pas. Ils sont de nouveau dans `package.json`, avec ceux de Manus (`path-to-regexp 0.1.13`, `qs 6.15.2`) et celui de la branche (`three-bmfont-text ^3.0.1`, qui évite un téléchargement Git). Conséquence : `path-to-regexp` et `qs` changent réellement de version dans le lockfile, comme Manus le voulait. `pnpm-workspace.yaml` garde la même liste.

**Fichiers supprimés par la fusion.** `server/_core/dataApi.ts`, `imageGeneration.ts`, `map.ts`, `voiceTranscription.ts` (modules Manus sans aucun appelant, vérifié) et deux `tsconfig.temp.json`. Aucune page ni fonction ne disparaît.

## Détail par étape

### 2. Image de production

- **Écart par rapport au brief :** le `HEALTHCHECK` appelle `/healthz` avec Node au lieu de `curl`, ce qui supprime l'étape `apt` du Dockerfile. Le pare-feu de la session bloque les dépôts Debian, donc l'image n'était pas constructible ici avec `curl`. Effet secondaire utile : une dépendance réseau de moins à la construction.
- L'image crée `/app/uploads`, propriété de l'utilisateur `node`.
- Le serveur de l'image tourne par défaut en `standalone`, comme le client compilé.

### 3. Porte d'accès privée

- Module `server/_core/accessGate.ts`, monté avant toutes les routes et avant les analyseurs de corps ; `/healthz` est enregistré avant lui.
- Sans laissez-passer : les pages sont redirigées vers `/acces`, tout le reste (`/api`, `/files`, fichiers statiques, WebSocket) reçoit un 401.
- Cookie `perfumum_access` : `HttpOnly`, `Secure` en production, `SameSite=Lax`, 30 jours, signé en HMAC-SHA256. La clé dérive de `JWT_SECRET` et du mot de passe : changer l'un ou l'autre invalide les cookies émis.
- Comparaison à temps constant ; 8 essais par adresse et par quart d'heure.
- Si `SITE_ACCESS_PASSWORD` est défini sans `JWT_SECRET`, le serveur refuse de démarrer plutôt que de signer avec une clé vide.
- **Ajout non demandé : `TRUST_PROXY`.** Derrière un proxy, tous les visiteurs ont la même adresse aux yeux de l'application : la limite d'essais devenait globale, et huit erreurs bloquaient tout le monde. La variable est facultative ; sans elle, rien ne change. `docker-compose.yml` la met à 1 (Caddy est le seul chemin vers l'application).

### 4. MySQL 8 et TiDB

- Les sept requêtes étaient bien celles du brief ; je les ai retrouvées par un balayage du code. Les `LIMIT ?` passés à `.query(` (non préparé) ne sont pas concernés et n'ont pas été touchés.
- L'erreur reproduite sur MySQL 8.0.46 est bien `Incorrect arguments to mysqld_stmt_execute`.
- **Constat sur le pool :** mysql2 3.16 n'applique `idleTimeout` que si `maxIdle < connectionLimit`. Avec les réglages par défaut, les connexions inactives n'étaient jamais fermées.
- **Constat :** l'application avait trois pools, pas un. Drizzle recevait l'adresse de la base et se créait le sien, aux réglages par défaut ; `pubchem-iupac.ts` avait le sien. Les trois passent maintenant par `createAppPool`.
- Réglages : inactivité 60 s, âge maximal 20 min, test d'une connexion au repos depuis plus de 15 s avant de la confier. Taille réglable par `DB_POOL_SIZE` (10 par défaut).
- Limite : la reprise par test préalable ne vaut que pour `getMysqlConnection()`. Les requêtes Drizzle sont protégées par la fermeture à 60 s et l'âge maximal, pas par le test.

### 5. `synergies.getSuggestions`

- La réponse change de forme : `{ suggestions, message, moleculesWithProfile, moleculesCompared }` au lieu d'une liste. La page `/suggestions-synergies`, seule appelante, est adaptée et affiche le message.
- Plafonds : 2 000 molécules comparées, 50 suggestions.
- La requête SQL écarte déjà les profils par défaut et ne ramène que 8 colonnes.
- Mesures : 8 000 lignes dont 7 700 par défaut, sur MySQL 8 : 20 ms, 8 Mo. Pire cas (8 000 profils tous renseignés, seuil à 0) : sous 5 s et 300 Mo dans le test.

### 6. Script d'analyse

- `client/index.html` n'est pas modifié : un plugin Vite retire la balise à la construction quand la variable manque. Avec la variable, la page produite est identique à avant.

### 7. Fichiers du stockage Manus

- **Les 19 images de l'interface sont retirées** (décision du 24 novembre), et non recopiées dans le dépôt. Le 23 novembre, elles avaient d'abord été déplacées vers `/media/…`, avec une redirection vers leur ancienne adresse ; ce filet de sécurité (`server/_core/mediaFallback.ts`), le dossier `client/public/media/` et `deploy/fetch-media.mjs` sont supprimés. Il ne reste dans le client ni adresse CloudFront ni chemin `/media/`, ce que vérifie `server/client-assets.test.ts`.
- Page par page :

  | Page | Images retirées | Ce qui les remplace |
  |---|---|---|
  | `ColombieLine` | 8 illustrations de plantes, en tête des cartes de molécules | Rien : la carte commence par son en-tête coloré (marge haute de la carte retirée, sans quoi une bande blanche restait au-dessus). |
  | `GalerieBotaniques` | 4 illustrations de *Tagetes lucida* (3 fichiers) | Les quatre fiches restent. À la place de l'image, un bloc de même format porte le nom latin et les molécules, pour que la grille reste alignée. Les boutons « Télécharger » et le cadre d'image de la fenêtre de détail ne s'affichent que si la fiche a une image. Une phrase signale ces fiches sans illustration. |
  | `GammesPetrichor` | 2 photos d'axes (urbain, fantôme) | Rien : l'affichage était déjà conditionnel. La description textuelle de l'image (« bitume mouillé… ») reste. |
  | `GammesMossi` | Texture de grain sur le bandeau | Rien : le dégradé du bandeau reste. |
  | `PlantMoleculeNetwork` | Trame en grille sur le bandeau | Rien : le dégradé du bandeau reste. |
  | `Projets` | 1 photo, utilisée par deux cartes « Musée » | Un bloc de même hauteur qui décrit la scène, pour que la grille reste alignée. |

- **Icônes de l'application** : la référence `apple-touch-icon` de `client/index.html`, les quatre icônes de `manifest.json` et les deux du service worker sont retirées. L'application installée sur un téléphone n'a donc plus d'icône propre.
- Le service worker met ses ressources en cache une à une : une seule absente n'annule plus son installation. Version du cache passée à `v5`, pour que les navigateurs abandonnent l'ancienne liste.
- Aucune image n'a été créée.
- Vérifié à l'écran (construction autonome, Chromium) : `/colombie` en largeur bureau et téléphone, `/projets`, `/reseau-plantes-molecules`. **`GammesMossi`, `GammesPetrichor` et `GalerieBotaniques` ne sont montées sur aucune route** (`App.tsx` : galerie « intégrée dans Plants.tsx », mais `Plants.tsx` ne l'importe pas ; aucune route pour les deux gammes) : elles ne sont pas visibles sur le site, et n'ont été vérifiées que par la compilation et les types.
- **Clé de stockage vérifiée** dans `server/_core/filesRoute.ts` et `server/storage.ts` : `/files/<clé>` est résolu sous `STORAGE_LOCAL_DIR/<clé>`. L'inventaire de `recovery-preparation/` le confirme : `file_key = variety-images/….jpg` pour une adresse `…/3105…/H2pj…/variety-images/….jpg`.
- Le script de migration parcourt toutes les colonnes de texte et JSON, ignore les vues, gère les tables sans clé primaire, et ne fait rien la seconde fois.


## Résultat de chaque vérification

| Vérification | Résultat |
|---|---|
| `pnpm install --frozen-lockfile` (pnpm 10.4.1) | Réussi. |
| `pnpm test` | Au 23 novembre : 1 448 réussis, 1 échec (`server/physical-tests.test.ts`, identique sur `main` intact). Au 24 novembre, après le traitement de `server/scripts/` : **98 fichiers réussis ; 1 449 tests réussis, 1 ignoré, aucun échec.** Après le retrait des images : 1 447 réussis, 1 ignoré (5 tests du filet de sécurité supprimés, 3 ajoutés). |
| `pnpm check` | Réussi (la machine avait 15 Go de mémoire). |
| `pnpm check` étendu à tout le client | 6 erreurs dans 3 pages écrites par Manus : `TerroirMapPage.tsx` (2), `admin/DataIntegrityTab.tsx` (3), `admin/ZenodoTermReview.tsx` (1). Non corrigées. |
| `pnpm build:standalone` | Réussi. Page produite : ni runtime Manus, ni umami, ni adresse CloudFront. |
| `pnpm build` (mode Manus, variable d'analyse définie) | Réussi. Runtime Manus et balise umami présents, comme avant. |
| Image Docker, construite par GitHub | Réussie au commit `a78adadf` (étape 2) et publiée sur GHCR. Les constructions suivantes n'ont pas été contrôlées une à une. |
| Image Docker, construite ici au commit `32d12fd0` | Réussie, `linux/amd64`, 2,27 Go décompressée. |
| Image lancée, sans base | `/healthz` : 200, version et commit ; conteneur « healthy » ; utilisateur `node` ; `/app/uploads` inscriptible. |
| Image lancée, porte active, MySQL 8.0.46 synthétique | Sans cookie : page 302 vers `/acces`, `/api` 401, `/files` 401, `robots.txt` interdit tout, `X-Robots-Tag` présent. Mauvais mot de passe : 401. Bon : 303 et cookie `HttpOnly; Secure; SameSite=Lax; Max-Age=2592000`. Avec cookie : page 200, suggestions de synergies et recherche (les trois requêtes corrigées) renvoient les données. |
| `LIMIT ?` sur MySQL 8.0.46 | Erreur reproduite avant correction, requête acceptée après. |
| Pool sur MySQL 8.0.46 | Connexions tuées côté serveur : les requêtes suivantes (brute et Drizzle) réussissent. Après 63 s d'inactivité : plus aucune connexion ouverte. |
| `migrate-media-urls.mjs` sur MySQL 8.0.46 | Simulation : rien d'écrit. `--appliquer` : 4 lignes, 5 adresses, 3 colonnes (texte, JSON, clé composite, table sans clé). Seconde passe : rien à faire. |

## Ce qui n'a pas pu être vérifié, et pourquoi

- **TiDB.** Tous les essais de base ont tourné sur MySQL 8.0.46. Aucun essai sur TiDB : ni le pool, ni le script de migration, ni la forme de `DATABASE_URL` avec `?ssl={…}` donnée dans le guide. mysql2 lit bien ce paramètre (vérifié dans son code), mais la connexion réelle reste à faire.
- **Render.** Aucun essai. En particulier : le disque monté sur `/app/uploads` est-il inscriptible par l'utilisateur `node` de l'image ? C'est le cas avec un volume Docker ; sur Render, à vérifier au premier déploiement en envoyant une image. Si ce n'est pas le cas, il faudra ajuster le Dockerfile.
- **Le guide `docs/DEPLOIEMENT.md`** a été écrit sans accès à la documentation de Render ni de TiDB Cloud (domaines bloqués). Les valeurs à saisir viennent du code ; les noms de boutons, la disponibilité de Francfort pour l'offre Starter, la forme exacte du « deploy hook » avec `imgURL`, le retour en arrière et la durée des sauvegardes viennent de ma connaissance de ces produits et sont marqués « À vérifier ».
- **Le Dockerfile tel qu'il est dans le dépôt** n'a été construit que par GitHub. Ici, j'ai construit une copie qui ajoute le certificat du proxy de la session et prend l'image de base sur un miroir (Docker Hub limitait les téléchargements).
- **Image tirée depuis GHCR.** Je n'ai pas téléchargé l'image publiée ni contrôlé ses étiquettes dans le registre.
- **La course sur le cache pnpm.** Sa cause est retirée ; je ne l'ai pas reproduite avant correction.
- **`pnpm test:integration`.** Non lancé : il demande une base de test peuplée.
- **Navigateur.** La page `/acces` et la page `/suggestions-synergies` modifiée n'ont pas été ouvertes dans un navigateur ; elles ont été essayées par requêtes HTTP. Le service worker modifié n'a pas été essayé.
- **Le WebSocket derrière la porte** est couvert par un test unitaire, pas par un essai dans l'image.

## Ce qui reste ouvert

### À faire pour terminer le lot

1. **Premier déploiement d'essai** sur TiDB Cloud et Render, en suivant `docs/DEPLOIEMENT.md`, pour lever les points « non vérifiés ».
2. **Migrer les adresses en base** et copier les fichiers correspondants sur le disque (étape 7 du guide). L'inventaire de `recovery-preparation/` en mentionne 32 dans `variety_images`.

### Fichiers perdus : `server/scripts/`

La ligne `scripts/` du `.gitignore` masquait tout dossier de ce nom, donc aussi `server/scripts/` : son contenu n'a jamais été versionné. Manus a confirmé le 24 novembre 2026 que le dossier n'existe plus dans son espace de travail. Trois scripts, que `package.json` appelait, sont donc perdus, ainsi que leurs fichiers de données :

| Fichier perdu | Commandes `pnpm` retirées | Ce qu'il en reste |
|---|---|---|
| `server/scripts/serve-physical-tests.mjs` | `physical-tests` | Les pages et leurs données sont intactes. Celles de `deliverables/essais-physiques-autonomes/` s'ouvrent sans serveur ; celles de `tools/physical-tests/` chargent des modules et un fichier JSON, donc demandent un serveur web local, quel qu'il soit. Seul ce petit serveur manque. `physical-tests:zip`, qui ne dépend pas du script, est gardée. |
| `server/scripts/zenodo-olfactory-pilot.mjs` | `pilot:zenodo:dry-run`, `pilot:zenodo:stage`, `pilot:zenodo:preannotate` | Le protocole et les options de la ligne de commande sont décrits dans `docs/protocols/pilote-zenodo-script.md`, sans le code. Le routeur et les tables du pilote sont intacts. |
| `server/scripts/pred-o3-import.mjs` et `pred-o3-data.json` | `import:pred-o3`, `import:pred-o3:dry-run` | `PRED-O3-IMPORT.md` contient un listing, mais ce n'est pas le script perdu (voir ci-dessous). Les routeurs `pred-o3.ts` et `pred-o3-bulk-import.ts` sont intacts. |

Ce qui a été fait :

- `.gitignore` : `scripts/` devient `/scripts/`. Seul le dossier `scripts/` de la racine reste ignoré ; `server/scripts/` sera suivi à l'avenir.
- `server/physical-tests.test.ts` : le test qui lisait d'un bloc trois pages et le serveur est scindé. Les trois pages restent vérifiées ; la vérification du serveur est ignorée (`skipIf`) tant que le fichier est absent, avec la raison dans son intitulé. Elle se réactive d'elle-même si le fichier revient.
- `server/zenodo-olfactory-pilot.test.ts` (suite d'intégration) : même traitement pour le test qui lit le script Zenodo. Ce second cas n'était pas demandé ; c'est la même perte.
- Aucun script n'a été réinventé.
- Décision du 24 novembre : les commandes `physical-tests`, `pilot:zenodo:*` et `import:pred-o3*` sont retirées de `package.json`. Leur documentation est gardée (`docs/protocols/pilote-zenodo-script.md`, `PRED-O3-IMPORT.md`, et `tools/physical-tests/README.md`, qui décrivait aussi `pnpm physical-tests`), avec en tête une note : script perdu à la sortie de Manus, commande disparue. Le troisième test de `server/physical-tests.test.ts` vérifiait la présence de `physical-tests` dans `package.json` ; il vérifie désormais son absence.
- La page d'administration `admin/ZenodoTermReview` renvoyait, quand la zone de transit est vide, à `pnpm pilot:zenodo:stage`. Le texte dit maintenant que la préparation d'un nouveau lot n'est plus disponible, l'outil ayant été perdu à la sortie de Manus.

**`pred-o3-import.mjs` n'a pas été reconstitué.** `PRED-O3-IMPORT.md` contient bien un listing complet (135 lignes), mais :

- ce n'est pas le fichier perdu : `todo.md` décrit un script de 50 lignes, livré avec 25 descripteurs, et `package.json` le lance par `node --import tsx` quand le document écrit `--loader tsx` ;
- il ne démarre pas. Extrait tel quel et lancé en simulation, il s'arrête au chargement : `The requested module '../../drizzle/schema.ts' does not provide an export named 'odorDescriptors'`. La table `odor_descriptors` a été créée par SQL direct et n'est pas déclarée dans le schéma Drizzle ;
- il appelle `getDb()` sans l'attendre, alors que la fonction est asynchrone ;
- les colonnes qu'il écrit ne correspondent pas à celles que lit `server/routers/pred-o3.ts` (`descriptor_id`, `source`) ;
- son fichier de données est perdu lui aussi.

Le remettre dans le dépôt aurait donné l'apparence d'une restauration à un fichier qui ne fonctionne pas. Décision du 24 novembre : pas de nouveau script pour l'instant, les 25 descripteurs importés étant déjà dans la table `odor_descriptors`. S'il en faut un un jour, il faudra la définition réelle de cette table (colonnes et clé unique), que le dépôt ne contient pas.

### Compression des réponses HTTP

Ajoutée le 24 novembre (paquet `compression`, gzip ou deflate selon le navigateur), dans `server/_core/compression.ts`. Elle est enregistrée après `/healthz` et avant la porte d'accès et toutes les routes : l'API, le client compilé et le formulaire `/acces` sont compressés. Les images déjà compressées (WebP, PNG, JPEG) et les réponses de moins de 1 Ko ne le sont pas ; le WebSocket n'est pas concerné.

Vérifié dans l'image Docker, porte active : `/healthz` répond 200 avec son JSON ; page sans cookie redirigée vers `/acces`, API en 401, formulaire servi compressé, connexion en 303 ; une fois connecté, le JavaScript principal passe de 834 Ko à 220 Ko, la page HTML de 3,3 Ko à 1,2 Ko ; une photo WebP est transmise telle quelle, à l'octet près. `server/compression.test.ts` reprend ces vérifications.

### Workflow Datadog supprimé

`.github/workflows/datadog-synthetics.yml` est supprimé (décision du 24 novembre). C'était le modèle fourni par GitHub, jamais configuré : aucune clé Datadog dans le dépôt, échec à chaque commit, sur `main` comme sur cette branche. Ce n'était pas un contrôle de qualité du code.

### Relevé en passant, non corrigé

- **Seize autres images locales manquaient au dépôt** (relevé du 24 novembre), sur les pages touchées à l'étape 7. Traitées le même jour :
  - `Projets`, page branchée : les quatre photos de terrain (`terrain-foret-alpine-1` et `2`, `terrain-friche-1` et `2`) ont été supprimées du dépôt par le commit Manus `66b07ea1` du 3 mars 2026 (« outil admin molecule-manager »), sans que la page cesse de les citer. Elles sont restaurées telles qu'elles étaient juste avant ce commit : WebP 1200 × 670, 829 Ko au total. Vérifié dans le navigateur, derrière la porte d'accès : les quatre s'affichent.
  - `GalerieBotaniques` (7 illustrations de terpènes) et `GammesPetrichor` (5 photos d'axes), pages non branchées : références retirées, rien de restauré. La galerie affiche toutes ses fiches dans le bloc sans illustration déjà utilisé pour *Tagetes* ; son texte « À propos » ne promet plus d'images en haute résolution. Son titre (« Galerie Botanique », « Collection d'illustrations scientifiques ») est laissé tel quel. Leur sort est renvoyé au lot 2.
  - `GammesMossi` ne citait plus aucune image.
  - Le même commit `66b07ea1` a supprimé d'autres fichiers de `client/public` (dont `petrichor-souterrain.webp`, `terrain-musee-2.webp`, `absorbe-gammes.png`, des captures d'écran). Ils n'ont pas été restaurés : aucune page branchée ne les cite, sauf `petrichor-souterrain.webp`, cité par les balises Open Graph de `client/index.html` sur le domaine Manus (voir plus haut).
  - `server/client-assets.test.ts` vérifie désormais que chaque image locale citée par ces quatre pages existe.

- **Mentions de Manus dans la page.** `client/index.html` cite `https://perfumum.manus.space` quatre fois (balises Open Graph et Twitter), dont une image `petrichor-souterrain.webp` servie par ce domaine. `server/_core/env.ts` prend aussi ce domaine comme adresse publique par défaut : d'où `PUBLIC_BASE_URL` dans le guide.
- **Polices Google.** La page charge ses polices depuis `fonts.googleapis.com` : dépendance externe, sans rapport avec Manus.
- **Erreur avalée.** `advancedSearch.getSearchSuggestions` renvoie toujours une liste vide en cas d'erreur de base ; c'est ce qui masquait le `LIMIT ?`. Le comportement est laissé tel quel.
- **Journal au démarrage.** En mode autonome, le serveur écrit `[OAuth] ERROR: OAUTH_SERVER_URL is not configured!`. Sans conséquence, mais trompeur.
- **Port.** Si le port demandé est occupé, le serveur en prend un autre en silence (`findAvailablePort`). Dans un conteneur, mieux vaudrait échouer.
- **`patches/wouter@3.7.1.patch`** existe mais n'est référencé nulle part : il n'est pas appliqué.
- **`pnpm` en dépendance de développement** (`^10.15.1`) alors que `packageManager` fixe 10.4.1 : deux versions coexistent.
- **Taille de l'image** : 2,27 Go décompressée, à cause des dépendances d'exécution (le serveur est bundlé avec `--packages=external`).
- **Limite de débit** de l'API (`server/_core/rateLimiter.ts`) : elle compte aussi par adresse et profite donc de `TRUST_PROXY`.

### Lot 2 — non commencé

Cartes Google à remplacer par Leaflet ; procédures qui citent des tables ou colonnes absentes ; les 8 pages qui plantent ; affichage des références sur les fiches de plantes ; listes coupées par `GROUP_CONCAT`. Les 6 erreurs de types relevées plus haut touchent trois de ces pages.
