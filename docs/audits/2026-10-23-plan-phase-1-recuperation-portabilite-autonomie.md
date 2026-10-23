# PERFUMUM — Phase 1 : plan de récupération, portabilité et autonomie

**Date de coupe du diagnostic : 23 octobre 2026**  
**Statut : plan d’exécution soumis à décision ; aucune migration, aucun export effectif, aucune écriture de données de production ni nouvelle visualisation ne fait partie de ce document.**

## 1. Décision de Phase 1

La priorité immédiate n’est ni une refonte, ni un graphe, ni un pilote d’assertions. PERFUMUM doit d’abord devenir **récupérable, explicable et restaurable hors de Manus**. L’objectif de Phase 1 est de pouvoir répondre, avec des preuves vérifiables, à la question suivante :

> Si l’environnement Manus devenait indisponible demain, quels éléments de PERFUMUM pourraient être restaurés, exécutés, compris et prolongés ailleurs — et quels éléments resteraient dépendants d’une configuration ou d’un service à remplacer ?

Cette phase ne présume pas qu’une migration complète soit souhaitable. Elle prépare une architecture hybride : un dépôt Git et un paquet de récupération portable pour le code, les données, les documents et les scripts ; Notion comme espace de conception et de gouvernance référencé ; et Manus comme environnement d’exécution tant qu’il reste utile. Aucun synchronisme automatique entre ces espaces ne doit être introduit.

## 2. Règles de sécurité et de vérité

Les constats ci-dessous sont séparés en quatre statuts.

| Statut | Définition dans ce plan |
|---|---|
| **Vérifié directement** | Constat observé dans le dépôt courant, sa configuration déclarée, ou dans la base interrogée en lecture seule. |
| **Documenté mais non vérifié ici** | Information présente dans une note, un ancien audit ou une page Notion ; elle sert de contexte mais pas de source de vérité technique. |
| **Inconnu à lever** | Élément non déductible sans export contrôlé, accès de propriétaire, test de restauration ou audit dédié. |
| **Recommandation** | Décision de méthode proposée pour la récupération ; elle ne modifie aucun état existant. |

Pendant Phase 1, les interdits sont les suivants : pas de `db:push`, pas de génération ni application de migration, pas de suppression ou fusion de données, pas d’enrichissement externe, pas de réassociation, pas de normalisation scientifique, pas de mise en production d’interface nouvelle, pas de passage d’une proposition en donnée validée.

Les cas déjà en attente — CAS intermédiaires, liens plante–terroir historiques, proposition chavicol, sept relations GC-MS lavande/lavandin, bibliographie DOI et revue Zenodo — doivent rester dans cet état. Ils font partie du contexte documentaire et du futur registre de décisions ; ils ne sont pas des tâches de nettoyage de Phase 1.

## 3. Diagnostic réel à la date de coupe

### 3.1 Code, exécution et versionnement

Le dépôt courant est propre, sur `main`, à la révision Git `7213aaf2a3bf`. Deux remotes sont configurés : un remote de plateforme et le dépôt GitHub `gadatheo-design/perfumum-research`. Le code est donc déjà versionné et copiable, ce qui est une force importante.

Le manifeste courant décrit une application TypeScript ESM avec React 18, Vite 7, Express 4, tRPC 11, Drizzle et MySQL/TiDB. L’interface utilise Wouter ; le serveur monte l’authentification, tRPC et un WebSocket de collaboration. Le dépôt contient le client, le serveur, les schémas Drizzle, des migrations SQL, des tests serveur, des workflows GitHub, des données de recherche versionnées et plusieurs livrables statiques autonomes.

Cette base est techniquement portable comme application Node.js. Elle n’est cependant pas exécutable hors Manus par simple clonage : l’authentification, le stockage, les services d’IA, les cartes, les notifications, certains appels de données et une partie du runtime Vite reposent sur des adaptateurs Manus/Forge.

### 3.2 Base de données : le risque central

La connexion de production a été interrogée en lecture seule. Elle pointe vers TiDB Serverless compatible MySQL. La base réelle contient **293 tables**, **4 169 colonnes**, **558 contraintes**, **268 tables avec clé primaire** et **25 tables sans clé primaire physique**. Elle comprend notamment 7 473 molécules, 3 782 plantes, 31 484 liens plante–molécule, 1 758 liens plante–terroir, 1 501 notices bibliographiques et 49 011 descripteurs olfactifs Pyrfume.

Le risque le plus important est la divergence entre cette base réelle et les artefacts versionnés : le schéma Drizzle en déclare 199 tables, dont 193 noms seulement correspondent à des tables réelles ; environ 100 tables réelles n’y figurent pas, tandis que six tables déclarées n’existent pas dans la base connectée. Les 98 fichiers de migration SQL ne peuvent pas être retenus seuls comme mécanisme de reconstruction : aucun journal `drizzle/meta` n’est présent et la table `__drizzle_migrations` n’enregistre que trois lignes.

La source de vérité de récupération ne peut donc être ni le schéma TypeScript seul, ni les migrations seules. Elle doit être un **instantané de la base réellement déployée**, accompagné de son DDL, d’un manifeste de contrôle et d’exports relationnels par table.

### 3.3 Données, médias et fonctions historiques

Les tables principales ne suffisent pas à reconstituer PERFUMUM. Il faut préserver les référentiels, les liens, les bibliographies, la recherche, les enrichissements spécialisés, les données utilisateur, les snapshots, les caches qualifiés, les journaux applicatifs nécessaires et les médias associés.

Les médias restent un inconnu critique : le code utilise le stockage Manus/Forge et la base conserve des URL ou métadonnées d’images. Un dump relationnel seul ne garantit pas la récupération des objets réels. L’inventaire de chaque objet, de son emplacement, de sa disponibilité et de son checksum est donc une condition de sortie de Phase 1.

### 3.4 Gouvernance et recherche

Les documents récents sont une force notable. Les audits et protocoles de septembre 2026 distinguent correctement signal, preuve, proposition, décision humaine et application éventuelle. Ils organisent la non-application de cas ambiguës, les prévisualisations, les journaux append-only, les règles de source et les limites de conclusion.

La faiblesse documentaire est transversale : les décisions sont réparties entre audits, manuels, fichiers `todo`, commits, exports et Notion. Il n’existe pas encore de registre maître unique des décisions humaines, ni de hiérarchie formalisée entre état de la base, export, source externe, note Notion, résultat d’agent et document Git.

## 4. PERFUMUM Recovery Map — ce qui doit être récupéré

Le Research Kit ne doit pas être un zip indistinct du dépôt. Il doit être un ensemble de paquets identifiables, avec une date de coupe, des versions, des checksums, des droits connus, des exclusions explicites et une procédure de restauration.

```text
PERFUMUM-Research-Kit/
├── MANIFEST.md                  # date de coupe, commit, schéma, hashes, inclusions/exclusions
├── code/
│   ├── repository.bundle         # bundle Git ou archive Git vérifiable
│   ├── source/                   # clone propre à la révision sélectionnée
│   ├── SBOM/                     # dépendances et licences, si produit
│   └── configuration/            # .env.example et matrice de variables sans secrets
├── database/
│   ├── ddl/                      # schéma réellement exporté depuis TiDB/MySQL
│   ├── logical-dump/             # dump SQL cohérent, chiffré au repos si sensible
│   ├── tabular/                  # exports par table CSV + JSONL/NDJSON
│   ├── domains/                  # exports lisibles par domaine métier
│   ├── integrity/                # comptes, PK/FK, orphelins, tables sans PK, hashes
│   └── restore/                  # procédure et rapport de restauration testée
├── assets/
│   ├── inventory/                # clé/URL, type, propriétaire, checksum, droit, statut
│   ├── recovered/                # médias copiés lorsque autorisés et accessibles
│   └── missing/                  # objets non récupérés, avec motif et piste de reprise
├── provenance/
│   ├── decision-register/        # décisions humaines et actions suspendues
│   ├── source-catalog/           # sources externes, Notion, exports, droits et snapshots
│   ├── divergences/              # contradictions de documents, schémas et états
│   └── assertion-spec/           # spécification future seulement, aucune migration
├── documentation/
│   ├── architecture/
│   ├── data-dictionary/
│   ├── operations/
│   ├── integrations/
│   └── handover/
├── scripts/
│   ├── inventory/                # description des scripts existants et risques
│   ├── export/                   # futurs scripts contrôlés de sauvegarde
│   └── validation/               # futurs contrôles de manifeste et de restauration
├── research/
│   ├── protocols/                # protocoles et dossiers de recherche sélectionnés
│   ├── static-deliverables/      # prototypes autonomes déjà documentés
│   └── notion-snapshots/         # export daté et autorisé, jamais synchronisé automatiquement
└── archive/
    └── releases/                 # paquets gelés, manifeste et procédure de vérification
```

La structure exacte peut vivre dans le dépôt ou dans un stockage d’archives séparé selon la taille et la sensibilité des dumps. La règle ne change pas : le dépôt Git conserve les manifestes, scripts, documentation, petits exports ouverts et métadonnées ; les dumps chiffrés et médias potentiellement sensibles peuvent résider dans une archive à accès contrôlé, mais doivent être référencés par hash, version et procédure de récupération.

## 5. Manus Dependency Map

La classification suivante décrit la récupérabilité, non la qualité scientifique de chaque composant.

| Composant | Classe | État vérifié | Méthode de reprise / risque |
|---|---|---|---|
| Code React, Express, tRPC, Drizzle, styles, PWA | **A — portable immédiatement** | Versionné dans Git avec lockfile | Copier/réviser le dépôt ; nécessite Node, pnpm et les variables documentées. |
| Tests serveur, workflows GitHub, outil d’audit de navigation | **A** | Versionnés | Portables ; une base de test autonome reste nécessaire pour les tests d’intégration. |
| Documents de recherche, protocoles, livrables physiques statiques | **A** | Versionnés dans le dépôt | Vérifier droits et licences avant diffusion ; conserver les manifests de contexte. |
| Notion comme espace de conception et décisions | **B — portable avec documentation** | Pages accessibles et URL/ID consultés ; état d’accès variable selon les documents historiques | Référencer, exporter à date de coupe autorisée, hasher et cataloguer ; ne pas traiter comme archive immuable ou preuve externe. |
| Base relationnelle réelle TiDB/MySQL | **B**, sous condition | Connexion et structure réelle vérifiées | Créer dump DDL + dump logique + export tabulaire + restauration testée. Sans cela, dépendance critique. |
| Données relationnelles de production | **B**, sous condition | 293 tables et volumes observés | Export atomique et contrôles d’intégrité ; cas des tables sans PK documenté. |
| Schéma Drizzle et migrations | **C — nécessite adaptation** | Divergence réelle entre code, migrations et base | Conserver comme historique, mais reconstruire un état canonique à partir du DDL réel et d’une matrice de réconciliation. |
| Scripts d’import/remédiation | **C** | Certains sont versionnés mais non intégrés ; certains scripts npm référencés sont absents | Inventorier, classifier lecture seule / transformation / import ; aucun usage automatique sans runbook et dry-run. |
| Déploiement, CI d’intégration et santé applicative | **C** | Build/CI partiellement versionnés ; pas de Dockerfile, Compose ni CD | Créer une recette reproductible et une DB CI. Ne pas appeler cela portable avant test de restauration. |
| Auth OAuth Manus/WebDev et identité propriétaire | **D — fortement dépendant de Manus** | Adaptateurs Manus observés dans le code | Remplacer par OIDC/OAuth standard ou une option locale ; migrer les rôles indépendamment des jetons Manus. |
| Stockage Forge/Manus, uploads et assets | **D** | Proxy de stockage Forge vérifié | Exporter les objets et remplacer par S3 compatible/direct ou un stockage choisi. |
| LLM, Data API, cartes, image, transcription, notifications Forge | **D** | Adaptateurs de plateforme présents | Définir interfaces et fournisseurs ou désactiver proprement les fonctions hors Manus. |
| Runtime Vite et HMR spécifiques Manus | **D** | Plugin et correctif proxy présents | Rendre conditionnel ou retirer après validation hors Manus. |
| Valeurs de secrets, clés, jetons, cookies de session | **E — impossible à récupérer comme artefact de Kit** | Des secrets locaux existent mais ne doivent pas être exportés | Exclure. Inventorier les noms de variables, les propriétaires et la rotation ; recréer des secrets dans le nouvel environnement. |
| État effectif des sauvegardes hébergeur, droits de bucket et objets manquants | **E à ce stade** | Non démontré dans le dépôt | Vérification par accès administrateur et exercice de récupération obligatoire. |

La classe D n’est pas un échec : elle signifie qu’un adaptateur ou un remplacement doit être planifié. La classe E ne doit jamais conduire à copier des secrets ; elle impose de documenter l’absence, de nommer le responsable et de définir une procédure de recréation.

## 6. Export Plan — exports à réaliser après approbation

Les exports ne doivent commencer qu’après une décision explicite de lancer l’exécution de Phase 1. L’export doit se dérouler sur un état gelé et documenté, en lecture seule côté données scientifiques.

### 6.1 Préparation d’un snapshot cohérent

1. Enregistrer la révision Git de départ, le hash du lockfile, la date UTC, la version de serveur de base et le nom logique de l’instantané.
2. Établir le manifeste de périmètre : tables incluses, tables exclues, objets, raisons d’exclusion, données sensibles, droits connus et informations encore inconnues.
3. Prévoir un emplacement de stockage chiffré et contrôlé pour tout export incluant utilisateurs, historiques, données personnelles, notes privées ou identifiants externes.
4. Ne pas lancer d’import, d’enrichissement ou de mutation concurrente pendant la fenêtre de coupe.

### 6.2 Base relationnelle : quatre sorties complémentaires

| Sortie | Finalité | Format | Critère de réussite |
|---|---|---|---|
| DDL réel | Reconstituer tables, index, contraintes, vues, triggers et procédures s’ils existent | SQL TiDB/MySQL + inventaire `information_schema` | Une base vide compatible accepte le schéma ou les exceptions sont documentées. |
| Dump logique cohérent | Restaurer l’état complet | Dump SQL natif, chiffré au repos si sensible | Restauration sur clone non productif, avec mêmes comptes de lignes sur les tables incluses. |
| Export interopérable | Lire et analyser les données hors application | CSV UTF-8 RFC 4180 et JSONL/NDJSON par table | Chaque table a un schéma, nombre de lignes, checksum et encodage déclarés. |
| Export par domaines | Reprise humaine et scientifique | CSV/JSONL accompagnés d’un README de domaine | Les relations nécessaires sont explicitement jointes ou listées dans un manifeste. |

Le CSV seul est insuffisant pour les colonnes JSON, vecteurs, listes, textes longs et valeurs nulles ambiguës. Les données Pyrfume, embeddings et structures semi-structurées doivent conserver un export JSONL ou SQL ; des tables volumineuses peuvent en outre être archivées en Parquet pour l’analyse, sans remplacer les exports de restauration.

### 6.3 Domaines minimaux à inclure

Le plan d’export ne se limite pas aux « tables principales ». Il doit couvrir au minimum les référentiels, les relations et les couches suivantes :

| Domaine | Contenu à inventorier et exporter |
|---|---|
| Botanique et territoire | plantes, taxons/synonymes, terroirs, liens plante–terroir, méthodes d’extraction, images et identifiants externes. |
| Chimie et olfaction | molécules, familles, liaisons de familles, descripteurs, profils, transformations, pyrolyse, GC-MS/chromatogrammes s’ils existent, identifiants, données Pyrfume et caches à qualifier. |
| Relations scientifiques | plante–molécule, molécule–accord, molécule–recette, profils terpéniques, interactions, génétique/TPS, liens spécialisés et tables sans PK. |
| Matières et formulation | matières premières, accords, recettes, ingrédients, formules, versions, traditions, tabacs et variétés. |
| Bibliographie et recherche | notices classiques/V3, auteurs, liens entité–référence, citations, chercheurs, institutions, axes, entrées et publications. |
| Application et gouvernance | utilisateurs, rôles, favoris, collections, notifications, snapshots, classifications, journaux applicatifs indispensables, paramètres métier. |
| Spécialisations présentes dans la base réelle | archives olfactives, fermentation, sol/climat, herbiers, installations, laboratoires, scènes/VR, contributions et tout domaine absent de Drizzle mais présent dans TiDB. |

Les 25 tables sans clé primaire physique constituent un lot spécifique. Elles doivent être exportées intégralement, avec une clé technique d’export si nécessaire et une fiche décrivant la clé naturelle ou composite envisagée. Aucun dédoublonnage ne doit être fait au moment du backup.

### 6.4 Médias et stockage d’objets

La récupération des médias doit être précédée d’un inventaire, pas d’une copie aveugle. Pour chaque référence, le manifeste doit indiquer la table, l’ID de ligne, l’URL ou la clé, le type MIME, la taille si disponible, le checksum, le statut d’accès, le droit/licence connu, la date de récupération et le résultat. Les objets indisponibles doivent être listés comme manquants avec leur dernier emplacement connu, sans être remplacés par une URL fictive.

### 6.5 Code, dépendances et secrets

Le Kit doit inclure une archive Git vérifiable ou `git bundle`, le clone source à la révision de coupe, le lockfile pnpm, les configurations Vite/TypeScript/Vitest/Drizzle, les workflows CI, les tests, les fixtures et les données versionnées qui sont légalement redistribuables.

Il ne doit contenir aucun `.env`, secret, cookie, jeton, configuration locale de plateforme ou cache sensible. Un fichier `.env.example` doit seulement recenser les **noms** de variables, leurs consommateurs, leur caractère obligatoire/facultatif, leur nature (DB, OAuth, stockage, fournisseur externe) et la procédure de création hors Manus.

## 7. Data Dictionary Plan

Le dictionnaire de données doit décrire la base réelle et non seulement le schéma TypeScript. Sa construction se fait en deux niveaux : un inventaire automatisé exhaustif pour les 293 tables, puis des fiches humaines approfondies pour les domaines qui portent une signification scientifique, culturelle ou opérationnelle.

### 7.1 Livrables du dictionnaire

| Livrable | Contenu | Priorité |
|---|---|---|
| `TABLE-INVENTORY` | Nom, nombre de lignes, PK, FKs, index, statut Drizzle/migration, domaine proposé et sensibilité | MUST HAVE |
| `COLUMN-DICTIONARY` | Table, colonne, type réel, nullabilité, valeur d’exemple anonymisée, définition, unité, vocabulaire, origine et risque | MUST HAVE |
| `RELATION-CATALOG` | Source, cible, table ou champ, cardinalité déclarée/observée, FK réelle ou convention, provenance disponible et risque d’interprétation | MUST HAVE |
| `DOMAIN-MAPS` | Cartes lisibles botanique, chimie, formulation, bibliographie, recherche, médias, application et tables spécialisées | SHOULD HAVE |
| `UNUSED-AND-DERIVED-FIELDS` | Champs calculés, caches, imports, colonnes probablement inutilisées, recomputables ou obsolètes | SHOULD HAVE |
| `SEMANTIC-RISK-REGISTER` | Termes qui suggèrent plus de précision que les preuves disponibles (`gc_ms`, profil olfactif, confiance, origine, etc.) | MUST HAVE |

Chaque fiche de table importante doit répondre aux questions suivantes : fonction, propriétaire logique, clé primaire, clés étrangères, relations, sens des colonnes, unité et vocabulaire, source et méthode d’acquisition, statut de validation, exemple non sensible, usage dans le code, tables/caches dérivés, export recommandé et problèmes connus.

Le dictionnaire ne doit jamais fabriquer une provenance historique. Quand une source ou une méthode est inconnue, l’état doit être explicitement `non documenté dans l’état actuel`, avec un lien vers le registre de divergence ou de décision.

### 7.2 Écarts prioritaires à consigner

1. Les divergences 293 tables réelles / 199 tables Drizzle / 98 migrations SQL.
2. Les tables de liaison sans PK et les clés conventionnelles.
3. La coexistence de `camelCase` et `snake_case`.
4. Les colonnes qui ressemblent à des faits scientifiques consolidés alors que leur source, méthode, contexte ou validation est inconnue.
5. Les caches SPARQL, analytics, embeddings, résultats d’enrichissement et snapshots : les distinguer comme patrimoine historique, données régénérables, données opérationnelles ou données à accès restreint.
6. Les fonctionnalités déclarées par des scripts npm mais dont les fichiers cibles sont absents du dépôt courant.

## 8. Inventaire des scripts et pipelines

L’inventaire de Phase 1 ne vise pas à relancer les automatisations. Il qualifie leurs risques et leur portabilité.

| Classe | Éléments observés | Décision Phase 1 |
|---|---|---|
| Lecture/analyse portable | `analyze-navigation.py`, audits documentaires, exports statiques déjà livrés | Conserver, documenter entrée/sortie et exécution hors Manus. |
| Build/test standard | `dev`, `build`, `start`, `check`, `check:full`, `test` | Documenter les prérequis et isoler les tests susceptibles de toucher une DB. |
| Transformation de code | scripts `scripts-remediation/`, formatteur | Mettre en quarantaine opérationnelle : runbook, branche, backup Git et dry-run avant toute utilisation. |
| Mutation de schéma/données | `db:push`, imports, scripts de staging | Interdits en Phase 1 ; documenter comme opérations à haut risque. |
| Scripts npm brisés ou non transférables | PRED-O3, Zenodo et lanceur physique référencés mais cibles absentes | Inscrire comme anomalie ; ne pas promettre leur restauration sans retrouver une source de vérité. |
| Services externes | PubChem, GBIF, Wikidata, Europeana, LOTUS, COCONUT, Pyrfume, etc. | Créer une fiche fournisseur : route, finalité, licence, clé, quota, cache, mode dégradé, données persistées et propriétaire. |

Aucune opération d’évolution de données ne doit s’exécuter à l’import ou au démarrage d’un environnement restauré. Tous les scripts qui écrivent doivent exiger un argument explicite, une cible non productive, une prévisualisation et un journal de résultat.

## 9. Documentation Plan

Les documents suivants sont nécessaires pour qu’une personne extérieure puisse reprendre le projet. Ils doivent être produits progressivement à partir des constats effectifs, non remplis par hypothèses.

| Document | Fonction |
|---|---|
| `README.md` | Point d’entrée : objectif, limites, prérequis, démarrage local et liens vers les guides. |
| `ARCHITECTURE.md` | Front, serveur, tRPC, auth, données, stockage, WebSocket, services externes, limites Manus. |
| `DATABASE.md` | Moteur, connexion sans secret, DDL de référence, restauration, ordre des données, contraintes et limites de migration. |
| `DATA_DICTIONARY.md` + inventaires générés | Accès au dictionnaire, domaines, conventions et registre des risques sémantiques. |
| `API.md` | Routeurs tRPC, auth, procédures d’administration, export, politiques de pagination/erreur et services externes. |
| `DEVELOPMENT.md` | Versions Node/pnpm, installation, variables, commandes, tests, conventions et diagnostic. |
| `DEPLOYMENT.md` | Build, serveur, port, healthcheck, reverse proxy, TLS, migrations séparées, monitoring et rollback. |
| `BACKUP_AND_RESTORE.md` | Snapshot DB, assets, code, checksums, chiffrement, rétention, restauration testée et RPO/RTO à décider. |
| `INTEGRATIONS.md` | Fiche par fournisseur : usage, données transmises, licence, secrets, quota, adaptateur et repli. |
| `PROVENANCE_AND_GOVERNANCE.md` | Hiérarchie des sources, notions de preuve, propositions, décisions humaines, restrictions et liens Notion/Git. |
| `DECISIONS.md` | Registre maître des décisions ouvertes, acceptées, refusées et reportées. |
| `CHANGELOG.md` | Changements versionnés lisibles, séparant code, données, documentation et décisions. |
| `MIGRATION_STATUS.md` | Écart base réelle/Drizzle/migrations, stratégie de réconciliation et interdits. |
| `LICENSE_AND_RIGHTS.md` | Licence de code/données, droits de sources et contradiction actuelle entre manifeste MIT et README confidentiel. |
| `HANDOVER.md` | Guide de reprise avec un autre environnement ou un autre assistant de développement. |

Les documents de Phase 1 doivent inclure une date de coupe. Une ancienne procédure n’est pas supprimée : elle est marquée comme historique, remplacée ou incompatible avec les garde-fous actuels.

## 10. Modèle futur d’assertions — spécification seulement

La couche future doit être latérale, réversible et pilote. Elle ne doit pas rétroattribuer une provenance inconnue au corpus historique, ni convertir une absence de contexte en preuve faible.

Les champs demandés sont nécessaires mais insuffisants. La spécification minimale proposée est la suivante :

| Groupe | Champs minimaux | Fonction |
|---|---|---|
| Identité | `assertion_id`, `statement_form`, `subject_ref`, `predicate_ref`, `object_ref` ou `object_literal` | Définir une affirmation sans ambiguïté de structure. |
| Contexte | `scope_ref`, `event_or_transformation_ref`, `observation_time`, `place_ref` | Éviter d’attribuer à une entité une relation qui dépend d’un lot, d’une transformation ou d’un moment. |
| Preuve | `source_id`, `source_locator`, `evidence_excerpt_or_record`, `method_ref`, `acquisition_date` | Dire d’où vient l’affirmation et localiser le fragment ou résultat. |
| Épistémique | `validation_status`, `evidence_level`, `reported_confidence`, `uncertainty_type`, `reserve` | Séparer validation, nature de la preuve, confiance rapportée et limite. Aucun score global. |
| Attribution | `asserter_or_import_actor`, `perspective_ref`, `language_or_community_context` | Préserver le cadre de savoir et l’attribution. |
| Gouvernance | `decision_id`, `decision_actor`, `decision_time`, `decision_rationale`, `supersedes_or_contests` | Lier une décision humaine à une assertion sans effacer l’historique. |
| Traçabilité technique | `import_batch`, `created_at`, `updated_at`, `source_snapshot_hash`, `visibility_and_rights` | Rejouer, restreindre et auditer l’import. |
| Inférence | `is_inferred`, `inference_rule_or_model`, `inputs` | Isoler une relation calculée d’une relation observée ou documentée. |

Les dimensions **statut de validation**, **niveau de preuve**, **confiance rapportée**, **perspective**, **droits de diffusion** et **réserve** doivent rester séparées. Elles ne doivent jamais être comprimées dans une note globale de fiabilité. Cette spécification n’est pas une proposition d’écrasement des champs historiques : c’est le contrat du futur pilote.

## 11. Notion, Manus, Git et archive : découplage recommandé

| Espace | Rôle recommandé | Ce qu’il ne doit pas être |
|---|---|---|
| Manus | Environnement d’exécution, analyses, brouillons, tâches techniques et intégrations tant qu’elles restent utiles | Source unique de vérité scientifique, coffre-fort unique ou registre final de décisions. |
| Base opérationnelle | Corpus volumineux et fonctionnalités applicatives existantes | Preuve implicite que chaque relation est scientifiquement validée. |
| Notion | Conception, gouvernance, intentions, préparation de décisions et contexte de recherche | Archive probante non versionnée, validation automatique ou substitut de source externe. |
| Git | Code, documentation, manifests, exports figés sélectionnés, décisions validées et traces de versions | Copie brute de tous les caches, secrets, comptes et médias sans politique. |
| Archive de conservation | Paquets clos de données/documents/médias avec droits, hashes et notice de restauration | Dossier de travail courant, poubelle technique ou synchronisation implicite. |

Le passage entre les espaces doit se faire par une référence explicite : ID, URL, hash, manifeste et date de coupe. Il ne doit jamais propager automatiquement une donnée, une relation ou une décision.

## 12. Backup & Versioning Plan

Git, dumps et manifests suffisent au départ ; il n’est pas nécessaire de mettre en place une infrastructure de snapshot complexe. Chaque snapshot de récupération doit toutefois lier quatre dimensions : code, base, assets et documentation.

### Format d’un snapshot

| Élément | Information obligatoire |
|---|---|
| Identifiant | Nom stable, par exemple `perfumum-YYYY-MM-DDThhmmZ` |
| Code | Commit Git, branche, hash du lockfile, liste des modifications non commitées (normalement vide) |
| Base | Version serveur, DDL hashé, dump hashé, comptes par table, exceptions, statut de restauration |
| Assets | Manifeste, comptes récupérés/manquants, checksums et restrictions de droits |
| Documentation | Version du dictionnaire, registre de décisions inclus, pages Notion exportées/référencées |
| Transformations | Aucune, ou liste exacte des scripts, versions, arguments, journal et résultats |
| Sécurité | Niveau de sensibilité, emplacement chiffré, propriétaire et règle de rétention |

### Test de restauration minimal

Un snapshot ne devient pas « récupérable » parce qu’un fichier de dump existe. Il doit être restauré sur une base isolée, sans jamais viser la production. Les contrôles minimums sont : création du schéma, comptes de lignes, vérification des PK et FKs connues, contrôle ciblé des tables sans PK, réconciliation des comptes de domaines, capacité à installer les dépendances, build sans secret, démarrage en mode où les services Manus sont explicitement désactivés ou simulés, et journal de résultat.

## 13. Plan d’exécution de Phase 1

La consommation de crédits ou de ressources ne peut pas être prédite ni garantie ici. Le plan utilise donc des **jalons arrêtables**, chacun ayant un résultat vérifiable. Aucun jalon suivant ne doit commencer si le précédent révèle un risque critique non résolu.

### MUST HAVE

| Jalon | Objectif | Dépendances | Résultat vérifiable | Réversibilité | Critère de réussite |
|---|---|---|---|---|---|
| P1-A — Baseline | Figer le point de départ et le périmètre | Accès dépôt et DB lecture seule | Manifeste de coupe, commit, inventaire de la structure réelle | Lecture seule | Le manifeste distingue inclus, exclus et inconnus. |
| P1-B — Schéma réel | Obtenir le DDL réel et la matrice 293/199/98 | Accès DB contrôlé | DDL + inventaire information_schema + rapport d’écarts | Lecture seule | Toute table réelle est classée : active, historique, cache, inconnue ou à documenter. |
| P1-C — Snapshot DB | Créer un dump cohérent et des exports tabulaires | Stockage chiffré approuvé | Dump, CSV/JSONL, hashes et comptes | Création de copies seulement | Une restauration isolée reproduit les comptes déclarés. |
| P1-D — Médias | Cartographier et récupérer les objets accessibles | Accès stockage/propriétaire | Manifeste assets et répertoire de récupération/missing | Copie seulement | Chaque référence est récupérée, explicitement manquante ou juridiquement restreinte. |
| P1-E — Secrets et intégrations | Décrire sans exporter les secrets | Propriétaires de services | `.env.example`, matrice de variables, fiches intégrations et plan de rotation | Documentation | Aucun secret n’est dans le Kit ; chaque dépendance a un responsable et un repli. |
| P1-F — Reprise documentée | Produire les documents de restauration et handover | Résultats P1-A à E | Guides vérifiés, inventaires et registre de décisions | Documentation | Une personne externe peut suivre le chemin de récupération sans information implicite Manus. |

### SHOULD HAVE

| Jalon | Valeur |
|---|---|
| Dictionnaire de données détaillé des domaines principaux | Réduit le risque de perdre la signification des données, au-delà de leur simple export. |
| Inventaire complet scripts/pipelines avec drapeau de risque | Empêche de relancer accidentellement une ancienne automatisation destructive. |
| Bootstrap local en conteneur ou recette équivalente | Prouve une première indépendance d’exécution, sans nécessiter de changer la production. |
| DB CI isolée et résultat de référence | Rend les tests reproductibles au lieu de conditionnels. |
| Registre maître des décisions et hiérarchie de sources | Préserve la gouvernance et les suspensions actuelles. |

### NICE TO HAVE

| Jalon | Valeur |
|---|---|
| SBOM et inventaire de licences des dépendances | Facilite sécurité, conformité et reprise par un tiers. |
| Tag Git signé et paquet de release archivé | Rend la date de coupe facilement identifiable. |
| Première procédure d’adaptateur de service, sans bascule | Prépare la sortie de Manus sans toucher au runtime. |
| Rapport de couverture tests et plan de comblement | Donne une base objective à la qualité future. |

### Ne pas faire maintenant

- Ne pas appliquer ni générer de migration Drizzle globale.
- Ne pas réconcilier automatiquement les 293 tables avec les 199 déclarations Drizzle.
- Ne pas supprimer les tables, caches, archives ou scripts jugés historiques avant qu’ils soient inventoriés.
- Ne pas corriger automatiquement les CAS, DOI, taxons, liens plante–terroir ou relations plante–molécule.
- Ne pas mettre en œuvre la table d’assertions, le graphe, l’Atlas ou toute visualisation nouvelle.
- Ne pas migrer l’authentification, le stockage ou les fournisseurs en production avant l’existence d’un snapshot restaurable et d’un environnement de test.
- Ne pas inclure les secrets, cookies, fichiers de configuration locaux sensibles ou `.manus/` non audité dans un export diffusé.

## 14. Go / No-Go pour la Phase 2

La Phase 2 — pilote d’assertions ou interface de recherche limitée — n’est autorisée que si tous les critères suivants sont satisfaits.

| Condition | Go | No-Go |
|---|---|---|
| Code | Révision Git de reprise, lockfile et instructions d’installation figés | Dépendances ou configuration de build non identifiées. |
| Base | DDL + dump logique + export tabulaire produits et restauration isolée attestée | Dump absent, non restauré ou divergence de comptes inexpliquée. |
| Médias | Manifest complet et statut de récupération connu | Objets indispensables non inventoriés ou droits inconnus. |
| Schéma | Matrice d’écarts base/Drizzle/migrations disponible | Migration proposée sur la base d’hypothèses ou de Drizzle seul. |
| Documentation | Architecture, DB, restauration, intégrations et handover disponibles | Reprise nécessitant une connaissance orale ou implicite Manus. |
| Gouvernance | Registre des décisions suspendues et hiérarchie de sources en place | Cas scientifiques ambigus susceptibles d’être réouverts comme tâches techniques. |
| Secrets | Aucun secret dans le Kit ; plan de rotation/recréation documenté | Secrets seulement détenus dans une configuration locale opaque. |
| Tests | Périmètre connu, DB de test prévue et statut des tests déclaré | Test « vert » impossible à reproduire ou non interprétable. |
| Licences/droits | Contradictions de licence et droits de corpus identifiés | Publication/export sans statut de droit. |

Le checkpoint final doit présenter, dimension par dimension, une évaluation réaliste :

| Dimension | Objectif Phase 1 | Blocage acceptable restant |
|---|---|---|
| Code | Autonome | Aucun, hors configuration de fournisseurs optionnels. |
| Base | Autonome après restauration vérifiée | Choix futur de l’hébergeur seulement. |
| Données | Partiellement autonome à autonome selon droits des médias | Objets légalement non exportables explicitement listés. |
| Documentation | Autonome | Améliorations éditoriales non bloquantes. |
| Scripts | Partiellement autonome | Scripts historiques brisés clairement quarantainés. |
| API | Partiellement autonome | Fournisseurs Manus à remplacer ou à désactiver. |
| Recherche | Autonome pour les dossiers archivés | Sources externes soumises à leurs droits. |
| Déploiement | Partiellement autonome | Choix d’hébergeur/IdP/stockage à valider. |
| Visualisations | Autonome pour celles déjà versionnées | Nouvelles visualisations volontairement hors Phase 1. |

## 15. Feuille de route au-delà de Phase 1

### Horizon 1 — 1 à 2 semaines de travail effectif

Obtenir la baseline, la matrice de dépendances, le DDL réel, le manifeste de snapshot, l’inventaire des scripts, le registre de décisions et le plan de droits. Le résultat attendu est une visibilité complète sur ce qui doit être exporté et sur ce qui ne peut pas être récupéré sans action du propriétaire ou d’un fournisseur.

### Horizon 2 — 1 à 3 mois

Après un snapshot restauré : compléter le dictionnaire de données, produire le Kit de reprise, écrire la recette d’exécution locale, rendre les adaptateurs Manus explicites et décider ce qui reste temporairement Manus-only. Cette phase doit aussi stabiliser la licence, les secrets, la CI avec DB isolée et la politique de sauvegarde.

### Horizon 3 — 6 à 12 mois

Seulement après autonomie démontrée : créer une couche pilote d’assertions séparée, sur un corpus fermé à preuves explicitement localisées ; construire un outil de parcours typé ; puis considérer une visualisation, à partir de données comparables et non sur un graphe générique. L’expérimentation artistique et les dispositifs matériels doivent se connecter à la documentation et aux journaux d’observation, sans modifier automatiquement les données validées.

## 16. Conclusion de décision

PERFUMUM possède déjà des actifs difficiles à reproduire : un corpus de données très étendu, des outils métiers nombreux, des protocoles récents de non-application prudente, un historique Git actif, une documentation de recherche riche et des prototypes autonomes. Sa faiblesse actuelle n’est pas l’absence d’idées ou d’interface : c’est l’écart entre ces actifs et une capacité démontrée à les restaurer, les expliquer et les exploiter sans la plateforme qui les héberge aujourd’hui.

La décision recommandée est donc : **lancer uniquement les jalons MUST HAVE de Phase 1 après approbation explicite, dans l’ordre P1-A à P1-F, avec un arrêt obligatoire après chaque résultat vérifiable.** La réussite de cette phase ne sera pas un site plus spectaculaire. Ce sera un PERFUMUM dont le code, la base, les données, les limites, les décisions et les dépendances pourront enfin être transmis, testés et prolongés durablement.
