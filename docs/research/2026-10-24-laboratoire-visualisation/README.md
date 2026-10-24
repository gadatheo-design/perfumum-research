# PERFUMUM — Laboratoire de visualisation autonome

Dossier de recherche du **24 octobre 2026**. Il contient un audit en lecture seule, 26 références, 12 concepts et fiches de prototypes, une architecture locale, des scénarios spatiaux et un protocole de comparaison. **Aucun prototype n’a été construit ou exécuté, aucune donnée scientifique corrigée, aucune migration lancée.**

## Commencer ici

Lire la [synthèse stratégique et le plan d’action](03-synthese-strategique.md), puis les [douze concepts et leur classement](concepts-et-prototypes.md). La recommandation est une progression avec le même corpus :

1. [V01 — Atlas des désaccords documentaires Boswellia](prototypes/V01.md) : lire relations, sources déclarées, quantités et silences sans construire une carte perceptive.
2. [V02 — Calques de preuves](prototypes/V02.md) : comparer la lecture du même corpus sur écran, papier et transparents.
3. [V03 — Salle des trois lectures](prototypes/V03.md) : distribuer les lectures dans l’espace, d’abord en simulation sur le Mac.

« Prêt à préparer » n’est pas « corpus exporté » ou « relation validée ». Un petit export et la qualification des sources doivent être autorisés séparément avant développement. Les temps de fiches sont des estimations de maquettes minimales par personne déjà formée, hors apprentissage, qualification scientifique, export, acquisition et montage spatial.

## Ce qui a été consulté

Le dossier Olfactory Ontology et ses douze pages enfants, les ancrages ontologiques/de preuve, les bases Notion liées et une sélection ciblée du laboratoire matériel existant. L’application a été auditée dans son code et sa base MySQL en lecture seule ; l’accueil, le hub de visualisations et un endpoint public GET ont été contrôlés. Les 40 visualisations et l’ensemble du workspace Notion n’ont pas été audités intégralement.

Des chercheurs dédiés ont documenté les 26 références artistiques/techniques. Les sources, accès partiels, techniques non publiées et titres ambigus sont signalés. Les notes individuelles produites dans des environnements isolés ne sont pas livrées comme fichiers accessibles : leurs résultats vérifiés sont consolidés dans l’état de l’art et les exports.

## Dossier documentaire

- [Potentiel et limites de l’Olfactory Ontology](01-synthese-notion.md)
- [Audit vivant des données](notes/audit-donnees.md)
- [Contrôle public du site et écarts de rendu](notes/controle-site-public.md)
- [État de l’art : 26 références et comparaison](etat-art.md)
- [Architecture locale, outils, transferts et quatre espaces](notes/architecture-et-materiaux.md)
- [Matériaux optiques : mécanismes réels et limites](02-materiaux-optiques.md)
- [Protocole de comparaison, rejouabilité et décisions](04-protocole-comparaison.md)
- [Mission initiale](mission.md)

## Matrices et données de recherche structurées

- [Données disponibles → transformations → phénomènes → limites, 15 domaines](matrices/donnees-phenomenes.csv) — CSV séparé par points-virgules.
- [Références, 26 fiches](matrices/references.csv) — CSV séparé par virgules.
- [Donnée → relation → transformation → forme → interaction → médium → expérience → limites, 12 concepts](matrices/concepts-mediums.csv) — CSV séparé par virgules.
- [Références structurées JSON](references.json)
- [Concepts et fiches structurés JSON](prototypes/concepts.json)

Ces fichiers décrivent l’étude : ils ne constituent ni un export global de PERFUMUM ni les corpus de données nécessaires à l’exécution des prototypes.

## Capitalisation Notion

[Laboratoire de visualisation — page d’entrée sous Olfactory Ontology](https://app.notion.com/p/403dbb3d5e6c815d8f9ec1dfa61e343a)

[Concepts et douze fiches](https://app.notion.com/p/403dbb3d5e6c81239dc1ec0cc5708cee)

[Programme et classement](https://app.notion.com/p/403dbb3d5e6c816dbe42c9253cad5206)

[Protocole commun](https://app.notion.com/p/403dbb3d5e6c81db9c20e5c89af865f7)

La capitalisation est documentaire : 25 pages ajoutées au total, dont la page d’entrée, neuf pages de documents et quinze pages de concepts/protocoles. Aucune base scientifique, taxon, molécule, assertion validée ou mesure n’a été modifiée. Le [manifeste des pages](notion/pages-manifest.json) conserve leurs titres, URLs et identifiants. Les pages restent sous les ancrages existants et ne créent pas une nouvelle ontologie parallèle.

## Contrôle des fichiers et autonomie

`SHA256SUMS` permet de vérifier les fichiers de ce dossier. L’archive contient les Markdown, matrices, fiches JSON et registres de capitalisation. Elle ne contient pas de dépendances applicatives, clé, dump complet de production ou fichier exécutable d’un prototype.

Le script `tools/prepare-notion.py` prépare seulement les charges utiles documentaires Notion ; **il ne publie rien à lui seul**. Les créations ont été effectuées via le serveur MCP Notion et leurs réponses conservées. Ne pas relancer les créations : elles ne sont pas idempotentes et ajouteraient des doublons.

Le dossier est indépendant de cette conversation pour sa lecture. Les expériences futures devront, elles, embarquer leurs propres corpus sélectionnés, bibliothèques locales et règles versionnées. La portabilité de ce rapport n’est pas une sauvegarde complète du projet : les phases de récupération de PERFUMUM restent un chantier distinct.
