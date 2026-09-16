# Protocoles d’essai — première vague physique

**Régime de sécurité :** les trois essais sont réalisés sans chauffer, diffuser, brûler, atomiser ou nébuliser une matière. Ils ne produisent aucune écriture vers la base PERFUMUM. Chaque session ajoute seulement une ligne dans un CSV local d’observation.

## Protocole de liaison retenu : Web Serial, USB, lecture seule

Le premier raccordement navigateur–Arduino emploiera **Web Serial via USB**. Le choix est intentionnellement local : un seul ordinateur, un seul Arduino, aucun réseau, aucun middleware et une permission explicite donnée à l’instant de l’essai. Web Serial nécessite un contexte sécurisé et une sélection du port à l’initiative de l’utilisateur ; l’API n’est pas interopérable avec tous les navigateurs, ce qui fixe Chromium/Chrome sur ordinateur comme prérequis [1] [2]. L’Arduino envoie uniquement une ligne de texte contenant la distance ou l’état de présence. La page ne lui envoie aucune commande d’actionneur.

> **Décision :** pas d’OSC, MIDI, DMX, ArtNet, WebSocket ni pont ESP32 pour la première vague. Ils ne deviennent pertinents qu’après validation d’une interaction stable sur un seul poste.

| Élément | Rôle réel | État | Prix à engager maintenant |
|---|---|---:|---:|
| Arduino + capteur de distance + USB | Source locale d’une valeur de présence/distance. | Annoncé comme possédé. | 0 € |
| Ordinateur Chromium + page locale | Lecture de la ligne série et rendu du graphe. | Disponible dans l’environnement de développement ; confirmer le poste d’atelier. | 0 € |
| Beamer | Projection de l’image locale. | Annoncé comme possédé. | 0 € |
| Makey Makey | Alternative sans code à la liaison série : l’objet devient une touche clavier. | Annoncé comme possédé. | 0 € |

## A — Graphe anamorphique sur peinture ou volume

**But vérifiable.** Projeter un graphe recette–molécule calculé à partir d’une tranche de données versionnée, puis confirmer qu’au moins quatre nœuds et trois liens restent lisibles sur une surface non plane.

| Paramètre | Valeur de séance |
|---|---|
| Durée totale | 90 minutes, dont 20 minutes de calibration. |
| Donnée | Recette `Fleur Fantôme` (`id = 150025`) et ses huit relations moléculaires avec point d’ébullition renseigné. |
| Fichier de départ | Export local daté ; aucun appel live en séance. |
| Surface | Peinture/volume stable clair ou recouvert de papier blanc mat. |
| Rendu | Nœuds D3, liens pondérés par `proportion`, positions stabilisées avant projection. |
| Critère binaire | **Réussite** si la même image est lisible avant/après déplacement de l’observateur, sans masquer le nom de la recette ni les six premiers nœuds. |

### Ordre d’installation

Installez le beamer à une distance qui permet une image de 1 à 1,5 m de large. Immobilisez le volume et marquez quatre points de référence visibles avec du ruban de masquage. Lancez la page locale `projection-mapping`, chargez l’export fourni, puis déplacez les quatre coins jusqu’à ce que les repères de la page coïncident avec les marques physiques. Enfin, activez le graphe et consignez la version de données affichée.

### Pannes probables

| Panne | Remède direct |
|---|---|
| Image trop déformée sur les zones en relief | Revenir à une surface moins profonde ; ne pas prétendre à une correction 3D. |
| Texte illisible | Désactiver les étiquettes de détail, conserver les identifiants courts et photographier la projection. |
| Quatre-corner insuffisant | C’est un résultat : arrêter et réserver le scan Revopoint à une seconde itération. |

### Retour utile à fournir

Photographiez la surface de face et à 30° ; notez largeur projetée, distance beamer–surface, lumière ambiante, nombre de nœuds lisibles et l’instant où la géométrie cesse d’être interprétable.

## B — Graphe de proximité avec Arduino

**But vérifiable.** Faire varier un paramètre graphique annoncé — opacité et rayon d’interaction du graphe — à partir de la distance lue par le capteur, sans capturer d’identité ni construire un profil de visiteur.

| Paramètre | Valeur de séance |
|---|---|
| Durée totale | 75 minutes. |
| Donnée | Même export relationnel que le prototype A. |
| Capteur | Capteur de distance déjà possédé ; l’unité affichée est celle réellement envoyée par l’Arduino. |
| Protocole | Arduino → USB → Web Serial → page locale. |
| Critère binaire | **Réussite** si l’affichage de distance évolue lorsque la main passe de la zone lointaine à la zone proche et si le graphe change exactement dans le sens décrit à l’écran. |

### Ordre d’installation

Placez le capteur face à une zone de passage sans fermer d’issue. Branchez l’Arduino en USB, ouvrez la page dans Chromium, cliquez sur « Connecter le capteur » et choisissez explicitement le port. Sans personne devant le capteur, notez une valeur de repos. Passez ensuite une main à deux positions différentes, à trois répétitions par position. La page doit journaliser les valeurs reçues dans le CSV local de séance.

### Pannes probables

| Panne | Remède direct |
|---|---|
| Aucun port proposé | Vérifier câble de données, navigateur Chromium et permission de port ; ne pas changer de protocole pendant la séance. |
| Valeur qui saute | Laisser la page appliquer un lissage visuel déclaré ; enregistrer aussi la valeur brute. |
| Changement graphique imperceptible | Réduire le nombre de nœuds affichés et augmenter seulement le contraste, pas la puissance du capteur. |

### Retour utile à fournir

Envoyez le CSV local, le modèle de navigateur, une courte vidéo de 20 secondes montrant l’écran et la main, et la distance réelle approximative mesurée avec un mètre ruban. Les valeurs ne servent pas à identifier une personne.

## C — Champ noir de diffusion, sans fumée

**But vérifiable.** Vérifier si un champ de particules projeté et commandé par l’opérateur peut rendre visible la relation entre une tranche de données et un changement d’état, sans remplir la salle d’aérosols.

| Paramètre | Valeur de séance |
|---|---|
| Durée totale | 60 minutes. |
| Donnée | Export local de la recette et liens `proportion` ; chaque élément est identifié comme donnée documentaire. |
| Surface | Écran, tissu blanc mat ou mur clair ; noir complet autour. |
| Interaction | Touches opérateur `1–8` ou Makey Makey ; une touche révèle une relation. |
| Critère binaire | **Réussite** si l’opérateur peut activer puis désactiver une relation et que l’état actif est lisible dans l’image et dans le CSV de session. |

### Pannes probables

| Panne | Remède direct |
|---|---|
| Les particules ne sont qu’un effet décoratif | Afficher au minimum le nom/ID de la relation active, la version de l’export et l’action reçue. |
| L’image manque de contraste | Réduire à deux couleurs et à un seul flux simultané. |
| Le Makey Makey déclenche à tort | Revenir au clavier ; un faux déclenchement est plus coûteux qu’une interaction manuelle. |

## Fumée ou brume : décision ajournée, pas d’achat recommandé

La brume n’est pas un simple support visuel. Les recommandations professionnelles exigent des produits, couples machine–fluide, temps, distances et/ou mesures d’aérosol précis ; elles ne se réduisent pas à l’achat d’une machine [3]. Une étude de santé au travail a également associé les expositions aux brouillards minéraux ou glycolés à des effets respiratoires aigus et chroniques chez des salariés [4]. Les établissements peuvent en outre exiger une validation préalable liée aux alarmes, évacuations, SDS et ventilation [5].

Par conséquent, aucune machine à fumée, brumisateur ultrasonique, fumée de combustion, diffuseur olfactif ou fluide n’est inscrit à la liste d’achat de cette vague. La surface de projection de C est d’abord une surface solide. Toute phase atmosphérique doit être portée par le responsable de lieu et un professionnel qualifié, avec validation écrite du site, fiche de données de sécurité, procédure incendie, ventilation documentée et absence de public tant que les conditions n’ont pas été vérifiées.

## Logiciels : décision et prix documentés

| Logiciel | Rôle réel | Prix indicatif au 15 septembre 2026 | Décision |
|---|---|---:|---|
| Page locale HTML/Canvas | Calibration à quatre points, graphe et Web Serial. | 0 € | **À utiliser maintenant.** |
| MadMapper | Mapping complexe, masques, calibration 3D ; essai gratuit avec sortie marquée. | À partir de 39 €/mois HT ; licence artiste à partir de 399 € HT. [6] | Ne l’acheter/louer qu’après l’échec documenté de la calibration navigateur. |
| Resolume Arena | Lecture vidéo, mapping, sorties multiples et contrôle de scène. | 799 € / ordinateur ; démo disponible avec marquage. [7] | Superflu pour les trois premiers tests. |
| Resolume Avenue | Lecture/mix vidéo sans mapping Arena. | 299 € / ordinateur. [7] | Superflu pour les trois premiers tests. |
| TouchDesigner, Unity, Processing, SuperCollider | Environnements possibles mais non nécessaires à la preuve de raccordement. | Non chiffrés ici : non requis. | Écarter jusqu’à ce qu’un besoin précis soit constaté. |

## Références

[1] [MDN — Web Serial API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Serial_API)  
[2] [Chrome for Developers — Read from and write to a serial port](https://developer.chrome.com/docs/capabilities/serial)  
[3] [Actors’ Equity Association — Theatrical Smoke and Haze Regulations](https://actorsequity.org/resources/producers/safe-and-sanitary/smoke-and-haze)  
[4] [Varughese et al. — Effects of theatrical smokes and fogs on respiratory health](https://pubmed.ncbi.nlm.nih.gov/15828073/)  
[5] [University of Kentucky Fire Marshal — Smoke and Haze Use](https://fire.uky.edu/smoke-and-haze-use)  
[6] [MadMapper — Software and pricing](https://madmapper.com/madmapper/software)  
[7] [Resolume — Avenue & Arena](https://www.resolume.com/software/avenue-arena)
