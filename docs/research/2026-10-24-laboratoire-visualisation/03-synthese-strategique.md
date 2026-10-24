# PERFUMUM — Inventer un laboratoire de lectures, pas une nouvelle vitrine

**Recherche du 24 octobre 2026.** Cette mission produit un dossier, des concepts et des fiches de prototypes, pas une application, des mesures ou une installation exécutée. La base scientifique reste inchangée.

## Recommandation

Le projet le plus fécond est un **laboratoire local de traductions réversibles** : choisir un corpus, changer explicitement sa règle de lecture, comparer plusieurs représentations, conserver ce que chacune révèle et masque, puis transférer une sortie vers un médium matériel. La capacité durable à faire ces opérations compte davantage qu’une première interface immersive.

Le premier objet de travail doit être le corpus **Boswellia/oliban**, précisément parce qu’il est à la fois riche en relations et lacunaire en preuve perceptive. L’enjeu n’est pas de montrer « à quoi ressemble l’odeur de l’encens ». Il est de rendre sensible la distance entre composition déclarée, documentation, vocabulaire et expérience. Le nom « atlas des désaccords » désigne ici ces écarts de représentation : il ne présume pas que l’audit a découvert des contradictions scientifiques établies.

Trois propositions forment une progression : **V01, atlas documentaire à l’écran ; V02, mêmes relations sur calques ; V03, mêmes lectures distribuées dans une salle.** Le corpus et les identifiants restent stables. La règle, le médium et les pertes deviennent les variables de recherche.

## 1. Un potentiel important, mais différent de ce que suggèrent les radars

L’audit MySQL en lecture seule relève 3 782 plantes, 7 473 molécules, 31 484 relations plante–molécule, 1 501 notices bibliographiques, 492 recettes et 93 terroirs. Ces comptes ne disent ni que tout est validé, ni que les propriétés renseignées sont mesurées. [Audit des données](notes/audit-donnees.md)

| Domaine | Ce qui permet de commencer | Ce qui interdit une lecture trop affirmative |
| --- | --- | --- |
| Relations plante–molécule | 31 484 liens ; 28 271 avec source déclarée | Seulement 3 981 avec au moins un champ quantitatif ; les méthodes et lots doivent être examinés |
| Structures moléculaires | 7 417 SMILES ; 7 409 InChIKey renseignés | Non vide ne veut pas dire parsable, identité certaine ou stéréochimie complète |
| Radars moléculaires | 174 profils dont les six valeurs diffèrent de 50 | 7 245 profils ont les six valeurs 50 par défaut ; même les valeurs non par défaut ne sont pas certifiées mesurées |
| Profils Terp/ABSORBE | 16 profils à cinq axes | Origine et comparabilité des scores non validées par cet audit ; ce n’est pas le radar moléculaire à six axes |
| Terroirs | 58 paires GPS présentes et dans les bornes | 35 terroirs sans GPS ; Köppen est une zone climatique, pas un point d’observation |
| Bibliographie | Textes, années, URLs, états de lecture et liens | 1 352 notices non lues ; une URL ne prouve pas la portée d’une assertion |
| Transformations | 36 transitions nominales ; bandes de température documentaires | Identifiants source et produit très rarement renseignés ; aucune chauffe ni cinétique reconstruite |
| Émissions | 1 967 lignes provenant de plusieurs tables | Origines de pipeline et méthodes hétérogènes ; pas uniformément un ensemble de mesures vérifiées |
| Expériences | 26 récits avec lieu, texte et étiquette | Aucun lien à une émission dans ces lignes ; pas un panel sensoriel comparable |

Une valeur 50 n’est pas automatiquement fausse : elle peut aussi correspondre à un score voulu. Sans provenance explicite, il faut la traiter comme **non qualifiée ou potentiellement issue du défaut**, pas supprimer toutes les valeurs 50. L’audit identifie un signal très fort à l’échelle du corpus, pas une autorisation de correction.

Les tables `plant_analyses`, `plant_samples`, `botanical_states`, `recipe_versions` et `tasting_notes` sont vides dans le périmètre inspecté. Cela n’établit pas que tout document GC-MS ou toute observation externe est absent du projet. Cela établit que ces tables ne fournissent pas aujourd’hui une série de lots, mesures et répétitions à ce laboratoire. La route `p5data.gcms` fabrique un rendu explicitement simulé : ne pas la rebaptiser chromatogramme mesuré.

Le nouvel audit constate huit liens de descripteurs sans cible et les 22 liens historiques plante–terroir sans plante résolue. C’est un état daté, distinct du bilan antérieur qui signalait zéro orphelin de descripteur. Aucune remédiation n’est reprise : ces liens sont à exclure d’un corpus fermé ou à montrer comme non résolus, sans réassociation automatique.

## 2. Ce que l’Olfactory Ontology apporte réellement

Le dossier Notion fait de l’odeur un événement relationnel et des liens des assertions situées. Il distingue matière, processus, émission, stimulus, expérience, langage, culture et source. Ce sont les bons ancrages pour un laboratoire, à condition de ne pas confondre modèle souhaité et données peuplées. [Synthèse du contexte Notion](01-synthese-notion.md)

Les bases liées interrogées contiennent 77 relations, dont 10 avec au moins un lien source, 18 taxons, 209 molécules et 39 notices bibliographiques. Ce ne sont pas les volumes de la base web ni un inventaire de tout le workspace. Les noms ne doivent pas servir à fusionner silencieusement les deux ensembles.

L’étude Notion évoque Astro/Supabase/PostgreSQL ; le code actif audité utilise React/Vite/Express/tRPC/MySQL. Le laboratoire peut emprunter la discipline d’assertions et le journal prévu dans Notion sans migrer l’application vers la stack imaginée en août. Aucun nouveau triple store, Supabase ou modèle de mesure n’est requis pour les trois premiers essais.

## 3. bl00d.money : emprunter une grammaire de lecture, pas une esthétique d’autorité

L’analyse directe documente une carte relationnelle sur canvas, le zoom, une simulation de forces D3 et l’accès aux fiches et sources par sélection. Le code charge D3 7.9.0. Les liens distinguent des éléments appuyés par des sources primaires de ceux rapportés. L’auteur et les algorithmes détaillés ne sont pas publiquement attribués dans le périmètre consulté. [R01](https://www.bl00d.money/)

**Le principe à reprendre** est l’articulation carte–fiche–source. Une connexion doit être une porte vers l’assertion qui la justifie. Une vue globale peut donner une orientation ; une sélection réduit le voisinage ; le texte permet de revenir à la portée du lien. Pour PERFUMUM, ce voisinage doit être typé : un taxon vers une molécule n’a pas le même sens qu’une molécule vers une évocation rituelle ou qu’une source vers un dossier.

**Le principe à transformer** est la mise en espace des relations. Un layout par forces reflète un algorithme et une topologie, pas une distance olfactive naturelle. Les positions peuvent changer quand on filtre ou change de règle : conserver des repères, une action de retour, la sélection et une légende de la règle active. Plutôt qu’un réseau massif affichant les milliers de molécules, ouvrir un dossier borné, laisser choisir une sortie et enregistrer le chemin.

Le mouvement intéressant n’est pas forcément le ballet permanent des nœuds. Il peut être le changement de lecture : du « lien renseigné » au « lien documenté dans cette source », du taxon au mot, puis au manque qui empêche de continuer. La commutation doit annoncer ce qui change : sélection, règle de placement, filtre ou statut. Une transition animée ne transforme pas deux espaces en métriques scientifiquement comparables.

**Ce qu’il faut éviter** : importer la densité comme preuve de richesse, rendre les sources trop petites, laisser la 3D suggérer une proximité mesurée, ou reprendre une rhétorique d’enquête politique pour des données olfactives hétérogènes. Le sujet de bl00d.money est une économie de violence : ce n’est pas une identité esthétique à recycler. Le transfert porte sur la consultation des sources et les liens étiquetés, pas sur son contenu, ses accusations ou son autorité.

La fiche R01 et le [corpus comparatif](etat-art.md) distinguent navigation directement observée, techniques documentées et possibilités proposées. ORBIT/CLUSTERS/FLOW y figurent comme suggestions de transfert, pas comme fonctions attestées de PERFUMUM ni comme fonctionnalités reprises du site.

## 4. Les références ouvrent plusieurs opérations, pas un seul style

Les 26 références couvrent interface multi-couche, dessin de données, formes génératives, sculpture, optique, mapping et pratiques olfactives. Elles ont été recherchées séparément ; les titres génériques ont été résolus vers une œuvre précise lorsque possible. « FLORA / Unfold » n’a pas été vérifié : la fiche documente explicitement *l’Artisan Électronique*, sans fabriquer l’attribution demandée. La vérification d’un projet ne signifie pas que toute sa technologie, ses vidéos ou son expérience spatiale ont été accessibles. [État de l’art](etat-art.md)

- **On Broadway** : plusieurs couches alignées sur un même repère. Transfert : coordonnées de corpus stables, non superposition de mesures incomparables.
- **Dear Data et Nathalie Miebach** : légende et règle incarnées dans l’objet. Transfert : un imprimé ou un tressage qui conserve une méthode, pas un volume décoratif.
- **Listening Post** : dramaturgie de fragments et régimes de lecture. Transfert : circulation de mots avec citation et contexte, pas synthèse émotionnelle automatique.
- **Hyphae et LIA** : forme issue d’une règle et d’un matériau. Transfert : sculpture dont le fichier conserve la génération ; la matière impose une résistance que l’écran ne reproduit pas.
- **Rayform/EPFL** : géométrie optique inverse. Transfert tardif : éprouver la différence entre cible calculée et image réellement produite, sans croire qu’une impression 3D quelconque crée une caustique lisible.
- **Acqua Alta** : une même proposition déclinée en plusieurs médiums. Transfert prioritaire : chaque médium modifie la lecture au lieu de dupliquer un rendu.
- **McLean et Tolaas** : description située, code et explicitation différée. Transfert : les mots et parcours ne deviennent pas des mesures universelles.

Le corpus manque encore de certaines familles moins visibles : arts tactiles/accessibles, collaborations vernaculaires situées et low-tech optique. Il est large et exploitable, pas exhaustif et pas une preuve de nouveauté mondiale. Son intérêt est de fournir des opérations et des contre-exemples.

## 5. Architecture minimale et transmission

Préparer un paquet local, puis le traiter sans connexion permanente à PERFUMUM :

`corpus daté → validation de lecture → règles versionnées → D3/p5 → configuration + export → imprimé / image / vidéo / volume / projection`

Le paquet doit conserver identifiants locaux et externes, source et table d’origine, statut de validation, unité et contexte des quantités, valeurs manquantes et défauts potentiels. Il ajoute une configuration de représentation, une graine, une version de règle, les fichiers effectivement employés, leurs empreintes et un journal local. Ce contrat est proposé ; il n’est pas un export scientifique effectué dans cette mission.

**D3 d’abord**, pour matrice, sélection, sources et SVG. **p5 ensuite**, pour comportement et trace. **Python en préparation** si le filtrage ou les contrôles deviennent complexes. Pas d’appel LLM ni d’enrichissement scientifique automatique dans cette chaîne.

Three/Blender sont conditionnels à une géométrie pertinente. Processing reste une alternative à p5, pas une couche obligatoire. TouchDesigner n’arrive qu’après le besoin de mapping, de composition multi-sorties ou de paramètres en temps réel. Le navigateur reste utile pour la navigation même si un deuxième moteur produit l’installation. [Architecture documentée](notes/architecture-et-materiaux.md)

| Transfert | Ce qui est conservé | Ce qui est perdu ou doit être refait |
| --- | --- | --- |
| SVG/PNG imprimé | Composition fixe, identifiants/légende si intégrés | Navigation et interactions |
| Séquence ou vidéo vers TouchDesigner | Apparence et rythme enregistrés | Recalcul, sélection et règle éditable |
| JSON de paramètres vers un autre moteur | Valeurs, noms, seed et état | Rendu à reprogrammer et documenter |
| GLB/glTF vers Blender ou autre logiciel | Géométrie et certains matériaux/animations | Shaders et comportements non garantis identiques |
| Mapping sur mur/objet | Image adaptée à une géométrie fixe | Calibration à reprendre dès déplacement |

Un navigateur ne transmet pas directement en UDP/OSC. S’il faut piloter TouchDesigner en OSC, un pont local explicite doit convertir les messages du navigateur ; WebSocket peut assurer le lien vers ce pont. Une vidéo exportée est plus simple pour commencer. MIDI est pertinent pour un contrôleur USB ; MQTT est réservé à plusieurs objets réseau avec courtier. Ne pas installer les quatre protocoles en même temps.

Bibliothèques conservées localement et import par sélection de fichier permettent d’éviter CDN et appels distants. Certaines fonctionnalités sous `file://` restent restreintes : un petit serveur lié à localhost peut devenir nécessaire, selon le moteur retenu. L’objectif est un paquet compréhensible avec lancement documenté, pas la promesse que toute future extension double-cliquée fonctionnera sans installation.

## 6. Quatre espaces et trois horizons

| Espace proposé | Version sobre | Version ambitieuse | Ce qu’il faut éprouver avant construction |
| --- | --- | --- | --- |
| Atelier minimal | Mac, écran, papier, projecteur facultatif ; une surface | Transparence rétroéclairée et projection fixe | Lisibilité et équivalence des identifiants entre écran/imprimé |
| Atelier spatial | Un projecteur déplacé entre essais ; murs/calques/objet fixes | Plusieurs surfaces avec sorties distinctes | Alignement, texture, ombres, changement de couleur |
| Laboratoire interactif | Bouton ou pédale pour tester le scénario | Présence binaire puis suivi seulement si justifié | Faux positifs, arrêt, état sans signal ; minimisation des données |
| Installation distribuée | Composition vidéo montrant trois lectures ; un ordinateur | Plusieurs murs et sorties synchronisées | Synchronisation, dérive, circulation et accès aux sources |

Ces scénarios ne présument ni dimensions de salle, ni parc matériel, ni budget disponible. Leur détail figure dans la note d’architecture. Les objets mobiles peuvent être manipulés hors projection, puis replacés sur un gabarit ; un mapping qui suit réellement l’objet exige un système de repérage et une calibration supplémentaires.

**Horizon A** : corpus local sélectionné, V01 et premières autres règles ; pas de production modifiée. **Horizon B** : V02, papiers/calques/objets, lumière visible et projection fixe. **Horizon C** : V03, plusieurs surfaces et éventuellement un événement de présence. Aucun passage n’est automatique : il faut un résultat de lecture, un critère de succès et une décision.

Fluorescence, phosphorescence, film dichroïque, réfraction, caustique et ombre ne sont pas interchangeables. Commencer par papier/calque/lumière visible. L’UV et les lasers ne sont ni nécessaires ni supposés sûrs ; leurs versions ne peuvent être construites sans évaluation adaptée. Aucune émission odorante n’est nécessaire pour les trois propositions prioritaires. [Matériaux et effets](02-materiaux-optiques.md)

## 7. Contrat des trois premiers prototypes

**V01 — Atlas documentaire Boswellia.** Sélectionner un ensemble borné de plantes et les relations candidates. Afficher type, source déclarée, contexte, quantité et absence ; les liens non résolus restent à part. Comparer matrice et voisinage, garder le même jeu d’identifiants. Réussite : une assertion et sa portée restent retrouvables ; les quantités absentes ne deviennent pas des intensités ; un retour restitue l’état précédent.

**V02 — Calques de preuves.** Figer la sélection V01. Une feuille porte les identifiants ; des calques séparés portent source, quantité et vocabulaire, seulement là où renseignés. Comparer une couche isolée et leur superposition. Réussite : le lecteur peut désigner quelle couche soutient sa lecture ; une rupture n’est pas interprétée comme absence chimique ; la configuration peut être réimprimée.

**V03 — Salle des trois lectures.** Sur trois vues simultanées, montrer source/portée, quantité et non-documentation d’un même état sélectionné. D’abord trois fenêtres ou une vidéo composite sur le Mac ; ensuite surfaces fixes. Un bouton suffit à proposer un changement d’état. Réussite : la sélection est identifiable partout, le texte-source reste accessible et une perte de signal ne crée pas une relation.

Leurs fiches détaillent corpus, règle, test, médium, dépendances, difficulté et temps indicatif. Les douze concepts sont des propositions non construites : [concepts et fiches](concepts-et-prototypes.md).

## 8. Plan d’action et décisions qui vous appartiennent

1. Choisir si le premier corpus sera strictement MySQL Boswellia, strictement Notion ou deux corpus présentés séparément. Recommandation : MySQL pour les premières relations et un dossier Notion associé, sans fusion de noms.
2. Autoriser séparément un petit export de lecture, avec périmètre et colonnes choisis. Les comptes et identifiants repérés ici ne constituent pas le paquet nécessaire aux prototypes.
3. Revoir un premier échantillon de relations et la portée de leurs sources. Les quantités de lots ou méthodes différentes ne doivent pas être normalisées en une composition moyenne.
4. Valider le comportement V01 avant développement : deux modes, retour, source, règle explicite et configuration exportable.
5. Faire V02 sans nouveau pipeline : mêmes identifiants, mêmes filtres, autre médium ; consigner gains et pertes.
6. Simuler V03 avant achat. N’ajouter que le matériel qui révèle une différence impossible à voir à l’écran.

Pour construire, il manque le modèle et l’OS du Mac, l’expérience de programmation, le matériel réellement disponible, le budget, les propriétés de la salle et l’usage privé ou public. Pour une salle : dimensions, occultation, surfaces, recul optique, circulation, alimentation et dégagements. Pour le corpus : état de qualification des sources, champs exportables et choix de règles. Ces réponses ne bloquent pas le dossier documentaire ; elles bloquent des spécifications matérielles honnêtes.

**Décision proposée : autoriser uniquement la préparation d’un corpus local borné et d’un cahier de comportement V01, puis décider de sa construction.** Ni migration, ni correction CAS/DOI, ni reprise des propositions scientifiques en attente, ni automatisation ne font partie de cette recommandation.

## Capitalisation et limites de cette mission

Une extension documentaire a été créée sous Olfactory Ontology, reliée aux ancrages et au laboratoire déjà existants. Les références, matrices, concepts et fiches y sont capitalisés ; le dossier local reste la copie portable de cette étude. Aucun nouveau schéma scientifique parallèle n’est créé. Les détails de synchronisation figurent dans le manifeste de capitalisation.

L’audit des données et le contrôle public de l’accueil et du hub ne constituent pas un audit de sécurité, de performance, de toutes les routes ou de tous les appareils mobiles. Les sources culturelles et scientifiques n’ont pas toutes été relues ; les vidéos et techniques inaccessibles des références sont signalées. Le dossier propose des directions testables, pas des résultats expérimentaux.
