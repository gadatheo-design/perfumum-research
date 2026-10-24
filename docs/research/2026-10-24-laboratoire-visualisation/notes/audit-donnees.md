# Audit des données disponibles pour le laboratoire de visualisation

**Date d’audit : 24 octobre 2026**  
**Périmètre :** base MySQL de production, schéma réel, code actif `server/` et `client/src/`, routes tRPC publiques lues statiquement.  
**Livrables liés :** `matrices/donnees-phenomenes.csv`.

## Statut et méthode

Audit strictement en lecture seule. Aucune migration, écriture SQL, correction, normalisation, export global, export binaire, appel d’endpoint de mutation ou contact Notion n’a été effectué. La collecte chiffrée provient d’une session MySQL réussie : `information_schema.COLUMNS` a été lu en premier, puis uniquement des `SELECT` d’agrégats et un micro-corpus d’identifiants publics. La connexion était obtenue avec `getMysqlConnection()` et rendue par `conn.end()` dans un `finally`. Le module actif ne fournit pas de `closeMysqlPool` exporté.

Une première tentative préparatoire, elle aussi strictement en lecture seule, a été arrêtée lorsqu’une colonne supposée par le schéma applicatif n’existait pas dans le schéma réel ; aucun résultat n’en a été retenu et la connexion a été rendue. Les chiffres ci-dessous proviennent de la session réussie, datée `2026-10-24T13:28:25.807Z`.

La base réelle comporte **296 tables**. Ce rapport ne confond pas :

- **présence de champ** : une valeur est non nulle/non vide ;
- **validité syntaxique** : une plage ou une coordonnée respecte un contrôle simple ;
- **provenance déclarée** : un champ `source`, `source_reference`, DOI ou URL est renseigné ;
- **preuve validée** : non démontrée par la seule présence de ces champs.

En conséquence, **une source renseignée n’est pas une preuve validée**. De même, un profil, une relation ou une valeur affichée dans l’interface ne doit pas être présenté comme une observation, une mesure GC-MS ou une validation scientifique sans examen de la source, de la méthode et du statut de validation propres à la ligne.

## Résumé décisionnel

PERFUMUM contient déjà une matière importante pour des visualisations relationnelles, structurales et documentaires : **3 782 plantes**, **7 473 molécules**, **31 484 liens plante–molécule**, **1 967 émissions olfactives**, **1 501 références bibliographiques**, **492 recettes**, **93 terroirs** et un corpus oliban/Boswellia exploitable comme sous-ensemble fermé.

Le potentiel le plus robuste à court terme est :

1. **topologie plante–molécule–classe–structure**, avec filtres de complétude et de provenance ;
2. **cartes de densité / manque documentaire**, car les écarts de couverture sont fortement visibles ;
3. **cartes de lieux et de terroirs**, à condition de limiter aux coordonnées présentes et valides ;
4. **trajectoires de transformation chimique**, en distinguant les noms documentés des identifiants relationnels réellement reliés ;
5. **corpus fermé Boswellia**, en visualisant simultanément la densité des liens, la présence de sources et l’absence actuelle de descripteurs reliés.

À l’inverse, une carte perceptive continue, un radar moléculaire généralisé, un chromatogramme présenté comme mesure et une chronologie expérimentale ne sont pas aujourd’hui scientifiquement défendables sans couche explicite de qualification : les axes radar moléculaires sont presque tous à leur valeur par défaut, les analyses et échantillons sont vides, et les données de dégustation/versionnage sont absentes.

## 1. Comptes réels relevés

| Domaine / table | Compte actuel | Lecture pour visualisation |
|---|---:|---|
| `plants` | 3 782 | Corpus botanique large ; taxonomie inégalement profonde. |
| `molecules` | 7 473 | Bonne base de structures et propriétés physico-chimiques. |
| `plant_molecules` | 31 484 | Maillage relationnel principal ; quantification rare. |
| `terroirs` / `plant_terroirs` | 93 / 1 758 | Relations lieu–plante nombreuses, géocodage partiel. |
| `descriptor_plant_links` / `descriptor_molecule_links` | 11 / 37 | Réseau descripteur trop petit pour une carte perceptive générale. |
| `terp_profiles` | 16 | Petit corpus cohérent de cinq axes propres au modèle Terp/ABSORBE. |
| `raw_materials` | 631 | Inventaire descriptif disponible, traçabilité inégale dans les champs inspectés. |
| `recettes` | 492 | Corpus de formes/formules ; liens structurés incomplets. |
| `recette_molecules` / `molecules_recettes` | 406 / 4 326 | Deux tables de liaison distinctes coexistent ; ne pas les fusionner implicitement. |
| `recette_raw_materials` | 56 | Liaison matière–recette encore très parcellaire. |
| `accords` / `experimental_accords` / `final_recipes` | 32 / 20 / 9 | Petits corpus utiles pour prototypes ciblés. |
| `molecular_transformations` / `pyrolysis_transformations` | 36 / 161 | Transformations exploitables, avec modèles de preuve hétérogènes. |
| `bibliography_entries` / `v3_references` | 1 501 / 291 | Corpus documentaire significatif. |
| `bibliography_entity_links` / `reference_entity_links` | 11 151 / 251 | Deux systèmes de liaison bibliographique ; leurs sémantiques ne doivent pas être amalgamées. |
| `traditions_olfactives` | 70 | Contexte culturel présent, mais pas automatiquement une mesure. |
| `olfactive_emissions` | 1 967 | Couche d’émissions quantitative partielle et mixte quant à la provenance. |
| `olfactive_experiences` / `olfactive_archives` / `field_archives` | 26 / 16 / 5 | Capacité narrative et située existante mais très réduite. |
| `plant_analyses` / `plant_samples` / `botanical_states` | 0 / 0 / 0 | Pas de série de mesures, de lots ou de cycle botanique exploitable actuellement. |
| `recipe_versions` / `tasting_notes` | 0 / 0 | Pas de suivi de formulation ni de données sensorielles répétées. |
| `research_axes` / `thematic_axes` / `research_entries` | 11 / 27 / 150 | Couche de cadrage éditorial pour navigations documentaires. |
| `petrichor` / `volcanique` / `prototypes` / `installations` | 60 / 36 / 4 / 7 | Corpus de programmes et formes artistiques restreint mais immédiat. |

## 2. Couverture et qualité par domaine

### 2.1 Plantes, taxons et synonymes

Les 3 782 plantes ont toutes un `name`, `latin_name`, `family`, `kingdom` et un statut de validation. La couverture taxonomique reste asymétrique : `division` est rempli pour **36** plantes (1,0 %), `order_name` pour **42** (1,1 %), `genus` pour **240** (6,3 %), `species` pour **69** (1,8 %) et `subspecies` pour **0**. Les synonymes existent pour **1 286** plantes (34,0 %). Les identifiants externes sont nombreux mais ne signifient pas à eux seuls qu’une taxonomie a été révisée : GBIF 3 759, Wikidata 3 778, NCBI 825 et POWO 266.

**Validation :** 3 307 plantes sont `brouillon` (87,4 %) et 475 `valide` (12,6 %). Une navigation taxonomique peut donc être riche en volume, mais doit exposer le statut et ne pas traiter le corpus entier comme taxonomie stabilisée.

**Visualisable maintenant :** arbre / champ de voisinages par famille, identifiants externes et complétude ; carte des lacunes de rangs taxonomiques. **À éviter sans qualification :** phylogénie inférée ou regroupement fin espèce/sous-espèce pour le corpus entier.

### 2.2 Molécules, classes et structures chimiques

La base moléculaire est le domaine le plus dense pour les propriétés structurales : `iupac_name` 7 468/7 473, formule 7 299 (97,7 %), masse moléculaire 7 473, point d’ébullition 7 472, volatilité 7 407, SMILES 7 417 (99,3 %), InChI 5 351, InChIKey 7 409 et PubChem CID 7 287. Les molécules avec CAS sont 4 171 (55,8 %), avec ChEBI 1 756 et COCONUT 3 617.

Le vide est plus marqué pour la catégorisation et l’olfaction : `chemical_class` est présent pour 3 667 molécules (49,1 %) et `olfactiveProfile` pour 1 442 (19,3 %). La distribution des classes montre 3 806 valeurs manquantes (50,9 %), puis principalement `ketone` (1 421), `alcohol` (801) et `ester` (578). Cela permet une visualisation de structures ou propriétés, mais rend fragile une couleur globale par classe chimique.

**Visualisable maintenant :** projection structurale à partir de SMILES, nuage masse–point d’ébullition uniquement sur les enregistrements non nuls, ou carte de complétude. **Limite :** l’interface `visualizations` classe les absences comme `other` / `Inconnue`; ces catégories de rendu ne sont pas des classes chimiques observées.

### 2.3 Relations plante–molécule et composition

`plant_molecules` compte 31 484 relations. L’intégrité référentielle mesurée est bonne : aucune cible plante ou molécule manquante dans le contrôle de jointure. Un champ `source` est présent sur 28 271 liens (89,8 %) ; cela signale une provenance déclarée, non une validation automatique.

La composition chiffrée est peu couverte : 3 981 liens ont au moins une valeur de pourcentage (12,6 %), 253 ont un couple min/max (0,8 %) ; les 253 couples satisfont la validité arithmétique 0–100 et min ≤ max. `percentage_typical` apparaît sur 3 063 liens, `percentage` historique sur 1 515. Les rôles sont renseignés sur 22 998 liens (73,0 %) — surtout `variable` 12 432 et `trace` 8 920 — tandis que le facteur de variabilité n’est renseigné que 30 fois (0,1 %).

**Visualisable maintenant :** graphe biparti pondéré par présence de composition, rôle ou provenance ; histogramme « quantifié / non quantifié » ; trajectoire visuelle qui devient plus opaque quand le lien est non quantifié. **À ne pas faire :** hauteur, taille ou intensité supposée dériver d’un pourcentage lorsque celui-ci est absent.

### 2.4 Descripteurs olfactifs et liens perceptifs

Le système de liens de descripteurs est très petit : 11 liens plante (6 descripteurs distincts) et 37 liens molécule (8 descripteurs). Les 48 liens ont tous une force 1–5 valide et un champ source renseigné. Toutefois, 2 liens plante et 6 liens molécule ne pointent plus vers une cible existante.

La présence d’une force ou d’une source ne fournit ni protocole sensoriel ni validation indépendante. Cette couche permet une démonstration micro-corpus ou une visualisation de désalignement, pas une cartographie perceptive fiable de l’ensemble de la base.

### 2.5 Profils radar moléculaires : valeurs réelles contre défauts

Les six champs radar moléculaires sont non nuls pour les 7 473 molécules, mais cette complétude est artificielle au sens analytique : **7 245 molécules (96,9 %) portent simultanément les six valeurs par défaut à 50**. Seules **174** (2,3 %) ont les six axes renseignés à des valeurs toutes différentes de 50 ; 54 ont un mélange de valeurs par défaut et non par défaut. Aucun axe ne sort de 0–100.

Les valeurs 50 sont très majoritaires sur chaque axe : intensité 7 255, fraîcheur 7 252, chaleur 7 257, douceur 7 255, piquant 7 248, terreux 7 262. Le code confirme que le schéma déclare `default(50)` et que les suggestions de molécules appliquent aussi `|| 50` / `COALESCE(..., 50)`.

**Conséquence stricte :** un radar global de molécules afficherait principalement le défaut de stockage, non une carte perceptive. Les radars doivent être filtrés aux six axes non par défaut, ou rendre explicitement la valeur 50 comme « non qualifiée / défaut », jamais comme mesure neutre.

### 2.6 Profils Terp / ABSORBE

Il existe 16 `terp_profiles`, tous avec `profile_id`, `name`, `olfactive_reading` et les cinq axes `radar_vent`, `radar_bois`, `radar_disparition`, `radar_structure`, `radar_diffusion` présents et dans 0–100. C’est un corpus minuscule mais visuellement cohérent, distinct du radar moléculaire à six axes.

**Visualisable maintenant :** comparaison de 16 formes, chorégraphie d’axes, impression/transparents superposables. **Limite :** l’audit établit la présence et la plage, non l’origine scientifique de chaque score ni leur comparabilité avec le radar des molécules.

### 2.7 Terroirs, GPS et climat

Les 93 terroirs ont nom, pays, région et qualité renseignés. 58 ont une paire latitude/longitude (62,4 %), toutes valides dans les bornes géographiques ; aucun demi-point GPS n’a été trouvé. Les plantes sont beaucoup moins localisables : 123/3 782 ont une paire GPS valide (3,3 %), tandis que 1 812 (47,9 %) ont une zone Köppen.

Les 1 758 liens `plant_terroirs` sont denses ; 22 ne correspondent à aucune plante lors du contrôle, même si aucune cible terroir ne manque. Le modèle géographique est donc plus fiable pour les terroirs que pour le pointage de chaque plante.

**Visualisable maintenant :** carte de terroirs géocodés, réseaux plante–terroir et champs climatiques Köppen. **Limites :** ne pas extrapoler une origine précise de la plante depuis sa zone Köppen ; isoler les 22 liens sans plante résolue.

### 2.8 Matières premières, extraits et inventaire

`raw_materials` contient 631 lignes. Nom, catégorie et notes sont pleins ; `olfactive_profile` est présent sur 630 lignes. Le nom latin n’est présent que 125 fois. Les autres attributs souhaités pour une traçabilité moléculaire ou d’extraction ne sont pas démontrés par les champs réels inspectés dans cette table.

**Visualisable maintenant :** inventaire de matières, typologie par catégorie et profil textuel. **Limite :** ne pas transformer les descriptions olfactives textuelles en dosages ou données de provenance sans source structurée.

### 2.9 Recettes, accords et formes de formulation

Il y a 492 recettes : nom, catégorie et statut sont partout renseignés, mais les relations directes aux familles, accords, tabacs et civilisations sont vides dans les quatre champs inspectés. Les descriptions sont présentes sur 349 recettes (70,9 %), les formules textuelles sur 333 (67,7 %), protocoles sur 153 (31,1 %), gamme sur 161 (32,7 %), et notes tête/cœur/fond sur 179 (36,4 % chacune). Les statuts sont : 408 `experimental`, 72 `validated`, 12 `testing`.

Seules 145 recettes (29,5 %) possèdent au moins un lien dans `recette_molecules`, et 24 (4,9 %) un lien `recette_raw_materials`. Dans `recette_molecules`, 344/406 proportions sont présentes, toutes dans 0–100 ; 325 rôles sont présents. Dans `recette_raw_materials`, 25/56 dosages et 42/56 pourcentages sont présents, tous les pourcentages renseignés étant valides.

Une seconde table `molecules_recettes` contient 4 326 liens. Elle existe réellement mais n’a pas été sémantiquement fusionnée avec `recette_molecules` dans cet audit : les deux schémas ont des conventions et une généalogie applicative différentes.

**Visualisable maintenant :** lecture de formule textuelle, graphes de relations explicitement étiquetées selon la table, et comparaison expérimentale/validée. **Limite :** une silhouette de recette ne doit être calculée à partir des seules liaisons structurées qu’après avoir choisi et documenté une source relationnelle unique.

### 2.10 Transformations, pyrolyse et température

`molecular_transformations` contient 36 entrées ; `pyrolysis_transformations` en contient 161. Dans la première table, les 36 transformations ont température min/max présente et arithmétiquement valide ; 33 ont une température optimale, 33 une `source_reference`, et 33 une description de changement olfactif. Les identifiants moléculaires source et produit ne sont présents que 3 fois chacun (8,3 %), alors que les noms source/produit sont présents dans les 36 lignes.

Les types sont : oxydation 13, isomérisation 13, pyrolyse 7, puis dégradation, déshydratation et autre à 1 chacun. Les températures et noms peuvent donc alimenter une narration de processus ; ils ne constituent pas automatiquement une chaîne moléculaire calculable par identifiants.

**Visualisable maintenant :** bande thermique, transition avant/après nominale, carte de types de transformation. **Limite :** les 33 références déclarées ne sont pas un label « validé » ; ne pas dessiner une causalité complète lorsque les identifiants moléculaires sont absents.

### 2.11 Analyses, échantillons, mesures et temporalité expérimentale

Les tables capables de soutenir une série expérimentale sont présentes mais sans lignes : `plant_analyses` 0, `plant_samples` 0, `botanical_states` 0, `recipe_versions` 0 et `tasting_notes` 0. Il n’y a donc pas, à la date de l’audit, de chronologie de lots, de chromatogrammes bruts, de résultats GC-MS datés, de répétitions sensorielles ni de versionnage de recette à visualiser comme mesure.

Le routeur public `p5data.gcms` se décrit explicitement comme **« GC-MS simulé »**. Il calcule un temps de rétention à partir du point d’ébullition ou de la masse ; en absence de ces données, il utilise une valeur aléatoire. L’intensité provient du pourcentage quand il existe, sinon d’un rôle avec composante aléatoire. Il ne doit donc jamais être étiqueté chromatogramme mesuré, ni exporté comme résultat analytique.

### 2.12 Bibliographie, sources et provenance

`bibliography_entries` contient 1 501 références : titre et clé pour toutes, auteurs pour 963 (64,2 %), année pour 925 (61,6 %), journal 750 (50,0 %), DOI 293 (19,5 %), URL 1 132 (75,4 %), résumé 724 (48,2 %), mots-clés 243 (16,2 %), domaine de recherche 1 253 (83,5 %). L’annotation est absente partout. Parmi les états de lecture, 1 352 références sont `unread` (90,1 %), 124 `read`, 23 `to_review`, 2 `reading`.

`v3_references` ajoute 291 références structurées, dont 90 DOI, 175 URL et 232 codes d’axe primaire. `reference_entity_links` contient 251 liens, mais seulement 2 ont un champ contextuel. La répartition est dominée par `leaf_economy` (147) et `tradition` (99) ; elle ne compte qu’un lien par type molécule, plante, terroir et prototype. Les types de lien les plus nombreux sont `contextualizes` (119) et `analyzes` (113), contre `documents` (18).

**Conséquence :** la provenance est suffisamment riche pour cartographier sa couverture et les régimes de relation, mais pas pour prétendre que chaque entité scientifique est validée. Le graphe de citations est très peu peuplé (2 `reference_citations`).

### 2.13 Culture, histoire et traditions

Les 70 traditions olfactives forment une couche éditoriale et contextuelle. Les 70 ont nom et région, mais les champs plus riches attendus par le schéma applicatif n’ont pas été confirmés dans la table réelle telle qu’elle a été inspectée. Les 251 liens de références mettent majoritairement en relation traditions et Leaf Economies ; les traditions peuvent donc nourrir des récits, des atlas culturels et des relations documentaires étiquetées.

**Limite :** région, récit ou relation bibliographique ne prouvent pas une pratique historique ou une perception ; les catégories « conceptuelle », « légendaire » ou « mythologique » doivent rester visibles dans les visualisations.

### 2.14 Émissions, perceptions et expériences

`olfactive_emissions` est la couche quantitative la plus fournie après `plant_molecules` : 1 967 lignes, 1 958 avec molécule (99,5 %), 1 612 avec plante (82,0 %), 1 571 avec pourcentage (79,9 %, toutes ces valeurs étant dans 0–100), et 964 avec `analysis_source` (49,0 %). `analysis_method`, rôle, partie de plante, indicateur signature et table source sont tous présents. Les origines déclarées par `source_table` sont : `plant_molecules` 1 612, `tabac_molecule_links` 237, `gcms_peaks` 70, `landrace_terpene_profiles` 48.

Ces données peuvent être explorées comme **émissions enregistrées ou intégrées depuis plusieurs tables**, non uniformément comme mesures analytiques vérifiées. La table source est une information de provenance de pipeline, pas une certification de méthode.

`olfactive_experiences` ne contient que 26 lignes : toutes ont lieu, étiquette perceptive et texte source ; aucune n’a `source_type`, aucune ne référence une émission, 13 référencent une plante et 10 une molécule. Les contextes sont industriel 6, artistique 6, rituel 6, médical 4, culinaire 2, quotidien 2. C’est un matériau de récit situé, non une série sensorielle comparable.

### 2.15 Archives de terrain, événements et temps

Il existe 5 `field_archives`, 16 `olfactive_archives`, 150 `research_entries`, 4 prototypes et 7 installations. Pour `field_archives`, seules les dates et dates de création ont été confirmées par les champs réels relevés dans cet audit ; le volume est trop faible pour soutenir une cartographie spatio-temporelle générale. L’absence de `plant_samples`, `plant_analyses`, `recipe_versions` et `tasting_notes` limite fortement les trajectoires temporelles observées.

**Visualisable maintenant :** petite constellation d’archives / axes de recherche / prototypes, explicitement éditoriale. **À éviter :** timeline de mesures expérimentales ou simulation temporelle présentée comme historique mesuré.

## 3. Confrontation code, UI et base

### Chiffres d’accueil

La page d’accueil appelle `dashboard.getStats`, qui compte les lignes brutes des tables `molecules`, `recettes`, `accords`, `prototypes`, `civilisations`, `plants`, `terroirs` et `rawMaterials`, sans filtrer par statut de validation. Les valeurs actuelles vérifiées pour les tables correspondantes sont donc des **comptes de lignes**, non des comptes d’objets validés.

Des valeurs statiques demeurent dans l’interface :

| Texte/interface | Valeur affichée ou repli | Compte base comparable | Lecture |
|---|---:|---:|---|
| Hero — repli molécules | 808 | 7 473 molécules | Repli statique obsolète si l’API est indisponible. |
| Hero — repli recettes | 476 | 492 recettes | Repli statique divergent. |
| Carte « Créateur » | 234 recettes | 492 recettes | Valeur statique divergente. |
| Texte traditions | 26 traditions culturelles | 70 `traditions_olfactives` | Entités possiblement non identiques ; l’écart doit être expliqué, pas lissé. |
| Pétrichor | 60 variations | 60 lignes `petrichor` | Cohérent sur le compte, pas nécessairement sur la nature de « variation ». |
| Volcanique | 36 variations | 36 lignes `volcanique` | Cohérent sur le compte, pas nécessairement sur la nature de « variation ». |
| Gammes | 5 cartes, ailleurs 8 gammes | pas de table `gammes` auditée | Revendication UI non vérifiable directement par agrégat DB. |

### Routes publiques et données calculées

- `p5data.molecules` expose des valeurs de molécules pour des sketches, avec une limite de 500 lignes ; c’est un sous-ensemble paginé/filtré, non un export du corpus entier.
- `p5data.gcms` est explicitement simulé : voir §2.11. Toute visualisation issue de cette route doit porter le label « dérivé / simulé ».
- `visualizations.getMolecularWeightVsBoilingPoint` filtre les lignes disposant des deux propriétés ; `getChemicalClassVsOlfactiveFamily` remplace les manques par `other`/`Inconnue`. Ces libellés d’interface doivent rester distincts de valeurs de base.
- Les routes d’émissions, d’expériences, de profils Terp, d’archives et d’analyses offrent des procédures de lecture publiques, mais le code contient aussi des mutations protégées. Aucune mutation n’a été appelée dans cet audit.

## 4. Micro-corpus fermé : oliban / Boswellia

Le corpus demandé existe : 12 identifiants publics ont été relevés sans exporter les lignes complètes. Exemples utilisables dans un prototype :

- plante **30014** — « Encens / Oliban », *Boswellia carterii* ;
- plante **150008** — « Oliban (Encens) », *Boswellia sacra* ;
- plante **270002** — « Encens d’Éthiopie », *Boswellia papyrifera* ;
- plante **690259** — « Oliban (Boswellia serrata) », *Boswellia serrata* ;
- plante **2010348** — *Boswellia frereana*.

Pour les 12 entrées Boswellia/oliban repérées :

- **247** liens `plant_molecules` ;
- **219** liens avec champ source (88,7 %) ;
- **29** liens avec au moins une valeur quantitative (11,7 %) ;
- **0** lien dans `descriptor_plant_links` ;
- **30** émissions associées, dont **13** avec `analysis_source` renseigné (43,3 %).

Ce micro-corpus est bon pour une expérience de visualisation de la **densité relationnelle et du gradient de documentation** : plantes ↔ molécules ↔ émission, avec trois états immédiatement visibles — source déclarée, quantification présente, provenance d’analyse présente. Il n’est pas suffisant pour un radar perceptif Boswellia fondé sur des descripteurs : aucun lien descripteur–plante n’est présent dans le corpus vérifié.

## 5. Matrice et recommandations de transformation

La matrice opérationnelle est fournie dans `matrices/donnees-phenomenes.csv`. Elle contient 15 domaines et utilise la chaîne :

> données disponibles → relation → transformation calculable → forme visuelle/spatiale → limites

Règle de travail recommandée pour tout prototype :

1. exporter localement, plus tard et avec autorisation, un sous-ensemble fermé ;
2. conserver les colonnes `source`, `validation_status`, table d’origine et indicateur de défaut ;
3. séparer graphiquement **observé/documenté**, **déclaré mais non vérifié**, **dérivé**, **simulé** et **manquant** ;
4. versionner les règles de transformation visuelle, jamais seulement le rendu ;
5. employer le corpus Boswellia comme premier test car ses limites sont elles-mêmes intéressantes et mesurables.

## Conclusion

La base permet déjà un laboratoire visuel autonome, à condition de fonder sa force sur la structure, la densité, les discontinuités et les régimes de preuve, plutôt que de simuler une précision perceptive ou analytique non disponible. Les structures moléculaires, le réseau plante–molécule, les terroirs partiellement géocodés, la bibliographie et les émissions offrent de multiples formes immédiates. Les radars moléculaires, chromatogrammes et temporalités doivent en revanche être rendus comme données par défaut, dérivées ou simulées lorsque c’est le cas.

Le premier prototype le plus juste serait donc une **cartographie multi-couche Boswellia de la documentation** : structure du réseau, pourcentages réellement disponibles, sources déclarées, provenance d’émission, et vides de descripteurs. Il rendrait visible ce que le corpus sait, ce qu’il relie, et ce qu’il ne permet pas encore d’affirmer.
