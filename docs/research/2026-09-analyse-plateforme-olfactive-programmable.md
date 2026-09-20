# Analyse critique — « PERFUMUM : plateforme olfactive programmable, instrumentée et documentée »

**Date :** septembre 2026  
**Auteur :** Manus AI  
**Statut :** analyse documentaire et stratégique. Ce texte n’autorise aucun essai matériel, aucune chauffe, diffusion, captation de personne, prélèvement ou exposition publique.

## Conclusion

Le document soumis est **exceptionnellement riche comme manifeste de recherche et comme cartographie de systèmes possibles**. Il formule une idée juste et rare : l’enjeu n’est pas de posséder un diffuseur, mais de concevoir une relation traçable entre matière, transformation, air, perception, mesure, archive et œuvre. Son meilleur apport à PERFUMUM est la proposition de faire de chaque *run* une source primaire reliée à l’atlas, plutôt qu’un événement isolé.

En revanche, le texte n’est pas encore un cahier des charges exécutable. Il mélange dans le même flux quatre objets qui doivent rester séparés : une hypothèse physicochimique, une recommandation d’ingénierie, une promesse de sécurité et une proposition artistique. Certaines affirmations sont solides dans leur direction mais trop générales dans leur formulation. D’autres deviennent problématiques lorsqu’elles passent d’un phénomène étudié en laboratoire à une recommandation de montage, à une exposition publique ou à une prétention de reproductibilité.

> **Le document doit devenir une architecture de recherche à quatre dossiers distincts :** un manifeste artistique, un protocole de laboratoire fermé, un dossier de déploiement public et un modèle de données expérimental. Tant qu’ils restent mêlés, l’ambition du projet augmente plus vite que sa preuve.

## Ce qui est particulièrement fort

### La priorité donnée au phénomène plutôt qu’au composant

Le premier principe — choisir d’abord le phénomène, puis l’architecture — est très solide. Le texte distingue chauffe douce, évaporation, aérosolisation, sublimation, pyrolyse et combustion. Cette distinction oblige à ne pas appeler indistinctement « odeur d’une matière » les émissions d’une huile, les produits de sa dégradation, les fumées de sa combustion et les aérosols d’un système de nébulisation.

Cette prudence est scientifiquement nécessaire. Les recherches sur une huile essentielle à chémotype linalool montrent que le chauffage peut modifier fortement la composition et générer de nouveaux composés ; elles ne permettent donc pas de déduire le comportement d’un mélange artistique inconnu à partir de son seul nom ou de son point d’ébullition [3]. Le texte porte déjà cette intuition, notamment lorsqu’il distingue matière initiale et produits de transformation.

### L’extraction et l’effacement sont traités comme des problèmes artistiques

La phrase « diffuser est facile, arrêter est difficile » est l’un des meilleurs points du document. Elle corrige l’imaginaire habituel de l’installation olfactive en plaçant la rémanence, l’adsorption sur les surfaces, la ventilation et la séparation des lignes au centre du projet. Cette idée est cohérente avec les problèmes rencontrés par les institutions patrimoniales : l’odeur engage simultanément expérience du visiteur, maintenance, interprétation, accessibilité et conservation [5].

Pour PERFUMUM, cette idée peut devenir une proposition artistique plus forte que la simple diffusion : une œuvre peut rendre perceptible la difficulté de faire disparaître une trace, de revenir à zéro, de maintenir une séparation ou de prouver que la séparation a échoué.

### Le refus de confondre capteur VOC et « nez électronique » est juste

Le document a raison d’affirmer qu’un capteur MOS bon marché ne mesure pas une odeur. Les capteurs non sélectifs détectent généralement une présence ou un signal global de composés volatils, mais ne permettent pas d’identifier les molécules présentes. Leur réponse dépend notamment de la matrice, de l’humidité, de la température, du vieillissement et de l’étalonnage [4].

Il est également juste de traiter un PID comme un instrument plus robuste qu’un MOS pour un signal global de VOC. Toutefois, un PID reste un détecteur de composés ionisables avec des sensibilités variables selon les molécules ; il ne devient pas une mesure de composition ni une concentration fiable d’un mélange parfumé sans stratégie d’étalonnage, de facteurs de réponse et de validation adaptée [4].

### La traçabilité expérimentale peut devenir le véritable médium de PERFUMUM

La section qui relie matière, partition, télémétrie, prélèvement, analyse, évaluation et médias à l’atlas est la proposition la plus importante du document. Elle donne une raison spécifique d’exister à la plateforme : non pas produire de l’odeur pour elle-même, mais rendre inspectable le passage entre une matière, un processus et une archive.

Cette proposition est compatible avec les travaux sur le patrimoine olfactif, qui articulent déjà signification, analyse chimique, analyse sensorielle et archivage sans les réduire l’un à l’autre [5]. L’écart possible de PERFUMUM se situe dans sa capacité à faire coexister ces plans avec les plantes, molécules, terroirs, recettes, transformations et décisions humaines de revue.

## Ce qui doit être corrigé avant toute utilisation pratique

| Sujet | Évaluation | Correction nécessaire |
|---|---|---|
| Les « cinq phénomènes » | La typologie est utile mais les catégories se recouvrent. L’évaporation existe sous le point d’ébullition ; la nébulisation forme un aérosol, elle n’est pas synonyme de vaporisation. | Redéfinir chaque régime par le mécanisme dominant, les phases présentes, les produits attendus et le niveau de preuve. |
| Point d’ébullition et « pyramide » olfactive | Trop simplifié. L’ordre réel dépend de la pression de vapeur, de l’activité dans la matrice, de la surface, du débit, de la géométrie, de l’adsorption, des pertes de ligne et de l’histoire thermique. | Remplacer la logique « point d’ébullition → note → ordre d’apparition » par une hypothèse à mesurer dans une matière et un dispositif identifiés. |
| Nébulisation à froid « non déformée » | Une restitution intégrale ne peut pas être présumée. Formation de gouttelettes, dépôt, fractionnement, évaporation différentielle et matériaux de contact peuvent modifier ce qui atteint l’espace. | Écrire « mécanisme à caractériser », non « restitution fidèle ». |
| Peltier comme interrupteur olfactif | Un refroidissement peut modifier les émissions, mais ni le facteur annoncé ni l’arrêt instantané ne sont génériques. Un module Peltier exige aussi une évacuation thermique et peut créer de la condensation. | Présenter le Peltier comme une piste de contrôle thermique conditionnelle, non comme une fonction garantie. |
| PID et cartographie d’une pièce | Le PID peut être utile pour suivre un signal total de VOC, mais il ne mesure ni une odeur ni la concentration spécifique d’un mélange sans étalonnage approprié. | Étiqueter tout signal comme « réponse instrumentale globale, conditions et calibration documentées ». Ne jamais l’appeler carte de l’odeur. |
| CO₂ comme compteur de visiteurs | Le CO₂ dépend de l’occupation, mais aussi de la ventilation, de l’air extérieur, du volume, de l’activité et du temps de mélange. Il ne constitue pas un comptage fiable de personnes à lui seul. | Le traiter comme une grandeur d’ambiance ou d’occupation indirecte, jamais comme un nombre de visiteurs. |
| Instruments d’alarme | PM, CO, température et fumée sont des garde-fous utiles. Ils ne prouvent ni l’innocuité d’un air, ni la conformité d’un dispositif public. | Séparer « signal d’arrêt » et « évaluation de risque ». L’un ne remplace pas l’autre. |
| Tenax, SPME et GC-MS | La limite de l’archive chimique est bien reconnue, mais la couverture analytique est plus complexe qu’une plage carbonée stable. Échantillonnage, humidité, pertes, transport, désorption, blancs, standards et bibliothèque de spectres modifient l’interprétation [4]. | Définir une chaîne d’assurance qualité avant de produire toute relation molécule–run. |
| « Données publiables » | Une masse, une rampe et un débit constants ne suffisent pas à produire des données publiables. | Ajouter question, contrôles, répétitions, blancs, étalonnage, incertitude, critères d’exclusion, plan d’analyse et revue compétente. |
| CITES, ambre gris, nicotine et réglementation | Les remarques sont utiles comme alertes, mais trop catégoriques sans taxon, pays, mode d’acquisition, lieu et droit applicables. | Créer une fiche de conformité locale par matière et par site. Aucun statut légal ne doit être porté comme universel. |

## Les deux problèmes majeurs du document

### 1. Il transforme trop vite une donnée de base en variable expérimentale

Le point le plus sensible concerne les propriétés extraites de PERFUMUM : CAS, nom, profil, proportion, `boilingPoint`, relation plante–molécule ou recette. Elles ne doivent jamais être traitées comme des paramètres de conduite d’un dispositif. Le projet a déjà établi que nombre de relations et d’identifiants restent incomplets, ambigus ou soumis à revue humaine.

Le schéma proposé dans le document — « matière → transformée à 320 °C → molécules détectées » — est trop direct. Une relation de ce type n’est recevable qu’après une chaîne de preuve plus longue : identité et provenance de l’échantillon, méthode, conditions, données brutes, contrôle qualité, identification analytique avec niveau de confiance, revue humaine et licence de diffusion. Avant cette validation, le bon statut n’est pas « molécules détectées », mais par exemple : **signal analytique candidat associé à un run documenté**.

Cette correction est fondamentale. Elle évite que l’installation ne réintroduise exactement ce que la remédiation de PERFUMUM a cherché à prévenir : une écriture scientifique automatique, une identité chimique surinterprétée et une provenance déduite plutôt que démontrée.

### 2. Il confond parfois banc d’essai et exposition

Le document identifie correctement les dangers de combustion, de pyrolyse et d’aérosolisation. Il ne les maintient pas toujours assez fermement hors du champ public. La combustion d’encens peut émettre particules, VOC, HAP et gaz tels que le CO ; les profils d’émission varient selon le produit et le régime de combustion [2]. Les recommandations de patrimoine olfactif insistent également sur l’information du public, l’accessibilité, la maintenance, la conservation et l’évaluation préalable plutôt que sur une sécurité déduite d’un dispositif générique [5].

Le projet gagnerait à assumer une séparation stricte : **le laboratoire observe les transformations ; l’exposition montre leurs archives, leurs limites ou une médiation distincte**. Une exposition publique ne doit pas devenir la prolongation automatique d’un essai de pyrolyse, de fumée ou de matière active. Les deux peuvent se répondre artistiquement sans partager ni les mêmes risques, ni les mêmes critères de réussite.

## Architecture recommandée pour PERFUMUM

### Un modèle à quatre couches

Le document devrait être refondu autour de quatre couches qui ne se valident pas mutuellement.

| Couche | Rôle | Ce qu’elle produit | Ce qu’elle ne prouve pas |
|---|---|---|---|
| **1. Recherche et représentation** | Lire les relations de la base, les lacunes et les précédents. | Partitions, cartes, hypothèses, maquettes. | Un phénomène physique, une exposition ou une mesure. |
| **2. Banc fermé et documenté** | Examiner une question matérielle avec un lieu et des responsables compétents. | Journal de run, instruments, données brutes, contrôles, anomalies. | Une sécurité publique, une perception humaine ou une généralité scientifique. |
| **3. Analyse et revue** | Qualifier les observations et produire des résultats interprétables. | Résultats analytiques, niveau de confiance, limites, décision de revue. | Une insertion automatique dans la base de production. |
| **4. Médiation ou exposition** | Rendre une question, une trace ou une archive partageable. | Cartel, partition, visualisation, archive matérielle, parcours accessible. | Une démonstration de conformité, une analyse de l’air ou un consentement implicite. |

Cette structure rejoint les régimes A–D déjà établis pour la seconde passe de recherche-création matérielle. La priorité immédiate ne serait pas de réaliser la totalité de l’architecture proposée, mais de construire la couche 1 et le modèle de données de la couche 2.

### Un modèle de données expérimental séparé

Le document a raison de refuser une base parallèle. La solution n’est cependant pas de verser directement les résultats du dispositif dans les tables scientifiques de production. Il faut des tables ou collections séparées, révisables et reliées par provenance :

- `experimental_runs` : objectif, version de partition, opérateur responsable, lieu, statut et décision de clôture ;
- `experimental_samples` : identité déclarée, provenance, lot, restrictions, chaîne de conservation et niveau de caractérisation ;
- `experimental_observations` : signal brut, instrument, calibration, méthode, horodatage, unité et incertitude ;
- `experimental_analysis_results` : résultat candidat, méthode, contrôle qualité, niveau de confiance et limite d’interprétation ;
- `experimental_sensory_records` : seulement si une étude humaine a été autorisée séparément, avec consentement et gouvernance adaptée ;
- `experimental_review_decisions` : acceptation, rejet, réserve, responsable, justification et lien vers les sources.

Une relation vers une molécule existante devrait rester une **proposition de rapprochement** tant qu’une personne compétente ne l’a pas revue. Le principe doit être : *un run enrichit d’abord l’archive expérimentale ; il ne modifie jamais seul l’atlas scientifique.*

## Les priorités à conserver et celles à ajourner

### À conserver immédiatement

Le texte peut nourrir dès maintenant trois chantiers sans matière active : une **partition olfactive versionnée**, un **schéma de traçabilité de run** et une **interface montrant les différences entre simulation, donnée déclarée, signal instrumenté, observation et interprétation**. Ces trois éléments sont déjà artistiquement puissants et réduisent les futurs risques de confusion.

Il faut également conserver l’idée de l’archive physique. Mais les tubes, résidus, cendres ou condensats doivent être présentés comme des traces situées et partielles, jamais comme la preuve exhaustive de ce qui s’est passé dans l’air ou de ce qu’un visiteur a perçu.

### À ajourner jusqu’à une décision distincte

La rampe de température, la pyrolyse, la combustion, l’activation d’accords PETRICHOR, la boucle fermée sur VOC, la diffusion multi-zone, l’usage de CO₂ pour influer sur une diffusion, les capteurs corporels et toute évaluation sensorielle par volontaires doivent être ajournés. Ce ne sont pas des extensions techniques ; ce sont des changements de régime qui exigent une question, un lieu, des experts, des autorisations et des critères d’arrêt propres.

Le document cite justement des sources de danger, mais il ne doit pas faire croire qu’un détecteur de CO, un extracteur local ou une liste d’allergènes suffisent à convertir un phénomène de laboratoire en geste public recevable. L’Organisation mondiale de la Santé rappelle que la pollution particulaire et gazeuse est une question de santé à des concentrations plus basses que celles autrefois considérées [6]. Cette référence donne un contexte sanitaire, non un seuil de conception pour une œuvre particulière.

## Décision stratégique

Le texte mérite d’être conservé comme **document de vision et de repérage technologique**, avec deux corrections éditoriales immédiates : retirer les paramètres de conduite détaillés du document de projet partagé et remplacer les promesses par des « hypothèses à caractériser ». Ensuite, en faire dériver quatre documents courts et autonomes :

1. **Manifeste artistique** : pourquoi une partition, une transformation et une archive forment un médium de recherche.
2. **Protocole de gouvernance des données** : comment un run devient une trace révisable, sans modifier les données de production.
3. **Dossier de recevabilité d’un banc fermé** : question, matière identifiée, risques, compétences, lieu, déchets, métriques et arrêt ; à produire seulement pour une piste choisie.
4. **Dossier d’exposition conditionnelle** : justification de la valeur publique, accessibilité, évitement, information, conservation, assurance et retrait.

La valeur du document ne réside donc pas dans sa capacité à faire passer PERFUMUM plus vite à la fumée, à la chauffe ou à une régie multi-zone. Sa valeur est de montrer qu’un projet olfactif sérieux peut faire de ses **interdits, de ses limites analytiques et de ses chaînes de preuve** une matière artistique à part entière.

## Références

[1]: /home/ubuntu/upload/pasted_content_5.txt "PERFUMUM — Plateforme olfactive programmable, instrumentée et documentée"

[2]: https://pmc.ncbi.nlm.nih.gov/articles/PMC9058426/ "Yadav et al., Health and Environmental Risks of Incense Smoke: Mechanistic Insights and Cumulative Evidence"

[3]: https://pmc.ncbi.nlm.nih.gov/articles/PMC7830006/ "Chang et al., Thermal Degradation of Linalool-Chemotype Cinnamomum osmophloeum Leaf Essential Oil and Its Stabilization by Microencapsulation with β-Cyclodextrin"

[4]: https://pmc.ncbi.nlm.nih.gov/articles/PMC9966347/ "Epping and Koch, On-Site Detection of Volatile Organic Compounds (VOCs)"

[5]: https://odeuropa.eu/wp-content/uploads/2022/05/D6_1_Guidelines_on_the_Use_of_Smells_in_GLAMs.pdf "Bembibre and Strlič, Guidelines on the Use of Smells in GLAMs"

[6]: https://www.who.int/publications/i/item/9789240034228 "World Health Organization, WHO Global Air Quality Guidelines"
