# PERFUMUM — Guide de Présentation Orale

> **Durée totale** : 15 minutes  
> **Format** : Présentation accompagnée d'une navigation live sur le site web  
> **Projet** : ABSORBE Laboratory — Recherche Olfactive Expérimentale  
> **Période** : 2025-2035 (projet décennal)

---

## Vue d'Ensemble de la Présentation

Cette présentation est conçue pour accompagner une démonstration en direct du site PERFUMUM. Le document ci-dessous fournit le script oral complet, les points de navigation, et les éléments visuels à mettre en avant pour chaque section. La structure en sept parties permet une progression logique du contexte général vers les applications concrètes.

| Section | Durée | Contenu | Page(s) web |
|---------|-------|---------|-------------|
| Introduction | 2 min | Vision et contexte du projet | Accueil `/` |
| Architecture des données | 3 min | Structure relationnelle, molécules | `/molecules-hub` → détail |
| Méthodologie ABSORBE | 2 min | Cadre scientifique, échelle de notation | `/methodologie/absorbe` |
| Outils analytiques | 3 min | Synergies, graphes, recherche | `/suggestions-synergies`, `/graphe-relations` |
| Créations & Gammes | 2 min | Applications concrètes | `/gammes-hub`, `/prototypes/c1` |
| Contribution & Évolution | 2 min | Système collaboratif, roadmap | `/contributor` |
| Conclusion | 1 min | Synthèse et ouverture | `/dashboard` |

---

## Section 1 — Introduction et Contexte (2 minutes)

### Page à afficher : Accueil (`/`)

Le présentateur commence par la page d'accueil qui offre une vue synthétique du projet. Cette page présente les statistiques dynamiques et les trois parcours utilisateurs.

---

**SCRIPT ORAL :**

« Bienvenue dans PERFUMUM. Ce nom, dérivé du latin *per fumum* — "à travers la fumée" — évoque l'essence même de la parfumerie : la transformation de la matière en sensation olfactive.

PERFUMUM est une plateforme de recherche olfactive que je développe depuis 2025 au sein du laboratoire ABSORBE, basé à Berne. Ce projet s'inscrit dans une vision décennale : dix années d'exploration, de documentation et de création qui aboutiront en 2035 à une archive scientifique et artistique sans équivalent.

Aujourd'hui, la plateforme centralise **556 molécules** documentées avec leurs propriétés chimiques et olfactives, **266 recettes** de compositions parfumées, **144 plantes** sources de matières premières, et **29 terroirs** géographiques caractérisés. Ces chiffres, que vous voyez s'afficher dynamiquement sur l'écran, évoluent constamment à mesure que nos recherches progressent.

L'interface propose trois parcours distincts selon votre profil. Le parcours **Chercheur** donne accès aux données moléculaires brutes, aux protocoles analytiques et aux méthodologies scientifiques. Le parcours **Créateur** met l'accent sur les outils de formulation, les recettes et les fournisseurs de matières premières. Le parcours **Explorateur** offre une découverte plus libre à travers les visualisations interactives et les contenus éditoriaux.

Cette architecture tripartite reflète la nature même du projet : à la croisée de la science, de l'art et de la curiosité. »

---

**ÉLÉMENTS À MONTRER :**

Sur la page d'accueil, le présentateur doit attirer l'attention sur les éléments suivants. Premièrement, le titre PERFUMUM avec sa baseline qui établit immédiatement le positionnement du projet. Deuxièmement, les statistiques dynamiques qui démontrent l'ampleur de la base de données. Troisièmement, les trois cartes de parcours utilisateurs qui illustrent la diversité des publics visés.

---

## Section 2 — Architecture des Données (3 minutes)

### Pages à afficher : Hub Molécules (`/molecules-hub`) → Fiche détaillée d'une molécule

Cette section constitue le cœur technique de la présentation. Elle démontre la profondeur et la rigueur de la documentation.

---

**SCRIPT ORAL :**

« Entrons maintenant dans le cœur du système. PERFUMUM repose sur une architecture de données relationnelle où chaque entité — molécule, plante, recette, terroir — est connectée aux autres par un réseau de relations sémantiques.

Prenons l'exemple des molécules, qui constituent l'unité fondamentale de notre système. Sur ce hub, vous voyez l'ensemble de notre catalogue avec des filtres par famille chimique, par note olfactive, par intensité. Chaque molécule est identifiée par son nom commun, mais aussi par son numéro CAS — le standard international de la chimie — et son nom IUPAC pour une identification sans ambiguïté.

*[Cliquer sur une molécule, par exemple le Linalol]*

Voici la fiche détaillée du Linalol, un monoterpénol que l'on retrouve dans de nombreuses huiles essentielles. Observez le **radar de profil olfactif** : huit axes qui caractérisent cette molécule selon notre échelle ABSORBE. L'intensité à 7, la persistance à 5, la diffusion à 8... Ces valeurs permettent une comparaison objective entre molécules et guident les choix de formulation.

Plus bas, vous trouvez les **relations** : les plantes qui contiennent naturellement cette molécule — lavande, bergamote, bois de rose — les recettes qui l'utilisent, et les synergies connues avec d'autres molécules. C'est ce maillage relationnel qui fait la richesse de PERFUMUM.

La qualité des données est un enjeu permanent. Actuellement, nous avons documenté les numéros CAS pour 25% de nos molécules, les noms IUPAC pour 18%, les formules chimiques pour 66%, et les profils olfactifs pour 94%. Ces pourcentages reflètent nos priorités : le profil olfactif, directement utile pour la création, est quasi-complet, tandis que les données chimiques strictes sont enrichies progressivement. »

---

**NAVIGATION SUGGÉRÉE :**

Le présentateur doit suivre cette séquence de navigation. D'abord, afficher le hub molécules et utiliser un filtre (par exemple, famille "Terpènes"). Ensuite, cliquer sur une molécule emblématique comme le Linalol ou le Géraniol. Sur la fiche détaillée, pointer le radar de profil olfactif et expliquer chaque axe. Enfin, faire défiler jusqu'à la section des relations pour montrer les connexions avec les plantes et recettes.

---

## Section 3 — Méthodologie ABSORBE (2 minutes)

### Page à afficher : `/methodologie/absorbe`

Cette section établit la crédibilité scientifique du projet en présentant le cadre méthodologique.

---

**SCRIPT ORAL :**

« Toute recherche sérieuse nécessite un cadre méthodologique rigoureux. ABSORBE est l'acronyme qui structure l'ensemble de nos travaux.

**A** pour Analyse — chaque substance est caractérisée selon des protocoles standardisés. **B** pour Base de données — la documentation systématique de toutes nos observations. **S** pour Synergies — l'étude des interactions entre molécules. **O** pour Olfaction — l'évaluation sensorielle par des panels entraînés. **R** pour Recettes — la formalisation des compositions. **B** pour Botanique — l'étude des plantes sources. **E** pour Expérimentation — les protocoles de test et de validation.

L'échelle ABSORBE, que vous avez vue sur les profils moléculaires, est calibrée de 0 à 10. Cette échelle n'est pas arbitraire : elle a été développée et affinée sur plusieurs années pour garantir une cohérence dans l'évaluation. Un score de 5 représente la moyenne, les extrêmes — 0 et 10 — sont réservés aux cas exceptionnels.

Notre méthodologie intègre également des protocoles d'analyse instrumentale. La **chromatographie GC-MS** permet d'identifier et de quantifier les composés volatils. Les études de **pyrolyse** révèlent le comportement des molécules sous l'effet de la chaleur — crucial pour les applications en fumigation ou en diffusion thermique. Les protocoles de **maturation** documentent l'évolution des compositions dans le temps.

Ce cadre rigoureux nous permet de maintenir une cohérence scientifique sur la durée du projet, tout en restant suffisamment flexible pour intégrer de nouvelles découvertes et méthodologies. »

---

**ÉLÉMENTS À MONTRER :**

Sur la page méthodologie, mettre en évidence l'explication de l'acronyme ABSORBE avec ses six composantes. Montrer le tableau de l'échelle de notation avec des exemples concrets. Si disponibles, afficher les liens vers les protocoles détaillés de GC-MS et de pyrolyse.

---

## Section 4 — Outils de Recherche et Visualisations (3 minutes)

### Pages à afficher : Synergies (`/suggestions-synergies`) → Graphe de relations (`/graphe-relations`)

Cette section démontre la valeur ajoutée analytique de la plateforme.

---

**SCRIPT ORAL :**

« Les données brutes n'ont de valeur que si elles peuvent être exploitées. PERFUMUM propose une suite d'outils analytiques qui transforment notre base de connaissances en insights actionnables.

*[Afficher la page des synergies]*

Le premier outil majeur est notre **système de suggestion de synergies**. Basé sur l'analyse des compatibilités chimiques et des profils olfactifs, il identifie des combinaisons prometteuses entre molécules. Prenons cet exemple : le système suggère une association entre le linalol et l'acétate de linalyle. Pourquoi ? Parce que leurs profils sont complémentaires — l'un apporte la fraîcheur florale, l'autre la tenue et la rondeur — et parce que cette combinaison est validée par des recettes existantes dans notre base.

*[Naviguer vers le graphe de relations]*

Le second outil est notre **visualisation en graphe de relations**. Cette représentation permet de naviguer visuellement dans le réseau complexe qui relie nos entités. Chaque nœud représente une molécule, une plante, un terroir ou une recette. Les liens montrent les relations : contient, provient de, utilise, est associé à.

Observez comment certains nœuds sont des hubs — fortement connectés — tandis que d'autres sont plus périphériques. Cette topologie révèle des insights : les molécules les plus connectées sont souvent les plus polyvalentes en formulation, les terroirs les plus riches en biodiversité apparaissent comme des clusters denses.

On peut filtrer par type d'entité, zoomer sur une région du graphe, ou suivre un chemin de relations. Par exemple, partir d'un terroir comme la Provence, voir les plantes qui y poussent, puis les molécules qu'elles contiennent, et enfin les recettes qui les utilisent. C'est une exploration non-linéaire qui révèle des connexions inattendues. »

---

**NAVIGATION SUGGÉRÉE :**

Sur la page des synergies, montrer une suggestion concrète et expliquer le raisonnement du système. Ensuite, naviguer vers le graphe de relations et démontrer l'interactivité : zoom, filtres par type d'entité, clic sur un nœud pour voir ses connexions. Si le temps le permet, tracer un chemin de relations du terroir à la recette.

---

## Section 5 — Gammes et Prototypes (2 minutes)

### Pages à afficher : Hub Gammes (`/gammes-hub`) → Prototype C1 (`/prototypes/c1`)

Cette section montre les applications concrètes de la recherche.

---

**SCRIPT ORAL :**

« Au-delà de la recherche fondamentale, PERFUMUM documente nos créations concrètes. Celles-ci sont organisées en **gammes thématiques**, chacune explorant un territoire olfactif distinct.

*[Afficher le hub des gammes]*

La gamme **Petrichor** — du grec "sang des pierres" — explore les odeurs de pluie sur terre sèche, ce parfum si particulier qui suit les orages d'été. La gamme **Volcanique** travaille les notes fumées, soufrées, minérales — l'odeur des terres volcaniques actives. La gamme **Glaciaire** s'intéresse aux accords frais, cristallins, presque métalliques des environnements polaires.

Chaque gamme représente un axe de recherche avec ses propres défis. Comment capturer l'odeur de la pluie ? Quelles molécules reproduisent l'impression du froid ? Ces questions guident nos expérimentations.

*[Naviguer vers le prototype C1]*

Les **prototypes** sont nos créations les plus abouties. Voici C1 — FERMENTUM — une composition qui explore les notes fermentées et umami. Vous trouvez ici la formule complète avec les pourcentages de chaque ingrédient, le processus de création documenté étape par étape, les résultats d'analyse GC-MS, et les notes de dégustation olfactive.

Cette documentation exhaustive permet de reproduire exactement la composition, de comprendre les choix créatifs, et de tracer l'évolution de notre travail sur la décennie. C'est un journal de bord olfactif autant qu'une base de données scientifique. »

---

**NAVIGATION SUGGÉRÉE :**

Afficher le hub des gammes et présenter brièvement deux ou trois thématiques. Cliquer sur une gamme pour montrer son contenu. Naviguer vers le prototype C1 et montrer la documentation détaillée : formule, processus, analyses.

---

## Section 6 — Contribution et Évolution (2 minutes)

### Page à afficher : Interface contributeur (`/contributor`)

Cette section présente la dimension collaborative et la vision à long terme.

---

**SCRIPT ORAL :**

« PERFUMUM est conçu pour évoluer et pour accueillir des contributions externes. Actuellement, cinq collaborateurs utilisent régulièrement la plateforme pour enrichir la base de données.

*[Afficher l'interface contributeur]*

L'interface contributeur permet d'ajouter de nouvelles molécules, plantes ou recettes de manière structurée. Le système inclut une **détection automatique des doublons** : avant de créer une nouvelle entrée, il vérifie si une entité similaire existe déjà et propose de la compléter plutôt que de créer un doublon.

Un **workflow de validation** garantit la qualité des données. Les nouvelles contributions sont d'abord enregistrées comme brouillons, visibles uniquement par leur auteur. Un administrateur — actuellement moi-même — les révise et les valide avant publication. Ce processus évite les erreurs et maintient la cohérence de la base.

Pour les imports en masse, nous proposons un système d'**import CSV** avec prévisualisation et correction des erreurs. On peut ainsi intégrer des centaines d'entrées en une seule opération, tout en vérifiant la qualité des données avant l'import final.

La **roadmap** des prochaines années prévoit plusieurs évolutions majeures. L'enrichissement automatique via des APIs externes comme PubChem permettra de compléter les données chimiques. De nouvelles visualisations — cartes géographiques des terroirs, timelines historiques — enrichiront l'exploration. Et des fonctionnalités collaboratives avancées — commentaires, annotations, partage de collections — renforceront la dimension communautaire. »

---

**ÉLÉMENTS À MONTRER :**

Afficher le formulaire d'ajout de molécule et montrer les champs disponibles. Démontrer la recherche de doublons en temps réel en tapant un nom de molécule existante. Expliquer le système de validation brouillon/validé.

---

## Section 7 — Conclusion (1 minute)

### Page à afficher : Dashboard (`/dashboard`)

La conclusion synthétise les points clés et ouvre sur les questions.

---

**SCRIPT ORAL :**

« Pour conclure, revenons au dashboard qui offre une vue synthétique de l'état du projet.

*[Afficher le dashboard]*

PERFUMUM représente bien plus qu'un simple outil de documentation. C'est une **infrastructure de recherche** pensée pour le long terme, capable d'accompagner une décennie d'exploration olfactive.

Les chiffres actuels — 556 molécules, 266 recettes, 144 plantes, 29 terroirs — ne sont qu'un point de départ. L'architecture flexible du système permet une croissance organique : nous pouvons ajouter de nouvelles entités, de nouveaux types de relations, de nouvelles visualisations sans remettre en cause l'existant.

La rigueur méthodologique — l'échelle ABSORBE, les protocoles documentés, le workflow de validation — garantit la qualité et la cohérence des données sur la durée. Dans dix ans, en 2035, nous disposerons d'une archive unique : dix années de recherche olfactive documentées avec une précision scientifique.

Je vous remercie pour votre attention et je suis maintenant disponible pour répondre à vos questions. Que ce soit sur les aspects techniques de la plateforme, sur la méthodologie ABSORBE, ou sur la vision à long terme du projet, n'hésitez pas. »

---

## Annexes

### A. URLs de Navigation Rapide

| Page | URL | Usage dans la présentation |
|------|-----|---------------------------|
| Accueil | `/` | Section 1 — Introduction |
| Hub Molécules | `/molecules-hub` | Section 2 — Architecture |
| Détail Molécule | `/molecules/[id]` | Section 2 — Architecture |
| Méthodologie ABSORBE | `/methodologie/absorbe` | Section 3 — Méthodologie |
| Synergies | `/suggestions-synergies` | Section 4 — Outils |
| Graphe Relations | `/graphe-relations` | Section 4 — Outils |
| Hub Gammes | `/gammes-hub` | Section 5 — Gammes |
| Prototype C1 | `/prototypes/c1` | Section 5 — Gammes |
| Contributeur | `/contributor` | Section 6 — Contribution |
| Dashboard | `/dashboard` | Section 7 — Conclusion |

### B. Checklist Technique Avant Présentation

La préparation technique est essentielle pour une démonstration fluide. Avant la présentation, vérifier que le site est accessible et que le serveur de développement fonctionne correctement. Préparer les dix pages listées ci-dessus dans des onglets séparés pour éviter les temps de chargement pendant la présentation. Tester le partage d'écran si la présentation se fait en visioconférence, en vérifiant que la résolution est suffisante pour lire les textes. Préparer une connexion de secours (partage de connexion mobile) en cas de problème réseau.

### C. Adaptation selon l'Audience

Le contenu peut être modulé selon le profil de l'audience. Pour un **public scientifique** (chimistes, chercheurs), insister sur la méthodologie ABSORBE, les protocoles GC-MS, et la rigueur des données chimiques (CAS, IUPAC). Pour un **public créatif** (parfumeurs, artistes), mettre l'accent sur les gammes, les prototypes, les outils de formulation et les synergies. Pour un **public général** (curieux, investisseurs, médias), privilégier les visualisations spectaculaires (graphe de relations), les exemples concrets (prototype C1), et la vision à long terme du projet.

### D. Questions Fréquentes Anticipées

Plusieurs questions reviennent régulièrement lors des présentations de PERFUMUM. Concernant l'**accès aux données**, la plateforme est actuellement en accès restreint pour les collaborateurs du projet, mais une version publique avec des données partielles est envisagée à terme. Sur la **propriété intellectuelle**, les recettes et formulations restent la propriété du laboratoire ABSORBE, seules les données scientifiques générales (propriétés des molécules) sont destinées à être partagées. Quant au **financement**, le projet est actuellement autofinancé et développé sur le temps personnel, mais des partenariats avec des institutions de recherche sont explorés.

---

*Document préparé pour la présentation orale du projet PERFUMUM — Janvier 2026*
