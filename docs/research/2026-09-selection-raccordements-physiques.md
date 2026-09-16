# Sélection de trois raccordements physiques — première vague

## Décision de sélection

Les trois essais ci-dessous privilégient les données relationnelles déjà disponibles, le matériel annoncé comme possédé et une exécution sans écriture en base. Ils évitent volontairement tout contrôle de chauffe, toute diffusion de matière et toute combustion. Le champ `boilingPoint` reste une **propriété documentaire** : il peut être affiché et comparé à une température mesurée, mais ne permet ni d’inférer la composition de l’air ni de commander une source de chaleur.

| Prototype | Axe du cahier des charges | Pont données ↔ matière | Matériel annoncé suffisant | Décision |
|---|---|---|---|---|
| **A. Graphe anamorphique** | Projection sur peinture ou volume | Relations recette–molécule et proportions → positions D3 projetées | Beamer, peinture/volume déjà disponible, ordinateur ; scanner Revopoint seulement en seconde itération | **Retenu.** La page existante calcule déjà une disposition 2D. |
| **B. Graphe de proximité** | Réaction Arduino | Distance corporelle → force, luminosité et focus du graphe, sans prétendre mesurer une odeur | Arduino, capteur de distance, câble USB, beamer/écran | **Retenu.** C’est le seul pont matériel immédiatement testable sans capteur non confirmé. |
| **C. Champ noir de diffusion** | Jeu et visualisation dans le noir | Données réelles exportées → champ de particules visuel, à activer par l’opérateur | Beamer, écran/tissu clair, noir complet, ordinateur | **Retenu avec réserve.** La première séance se fait **sans fumée** ; une projection sur brume ne peut être envisagée qu’avec la salle, sa ventilation et son protocole de sécurité. |

## Pourquoi la projection navigateur, et non un logiciel de mapping, pour A

Le premier test utilisera une page locale avec calibration manuelle de quatre coins. Cette solution répond à la question pratique : elle permet de vérifier, en moins de trois heures, si la géométrie D3 demeure lisible sur le volume et si l’interaction est utile. Elle n’exige ni achat, ni dépendance à un logiciel propriétaire, ni scan préalable. Si cette preuve échoue parce que la surface comporte des occlusions ou une géométrie non plane trop complexe, le passage à un logiciel de mapping devient justifié ; il n’est pas justifié avant ce constat.

Le scanner Revopoint est donc réservé à l’itération suivante : scanner un volume stable, produire un masque local et comparer ce masque à la calibration à quatre coins. Il ne sert pas à conclure sur la précision d’un mapping avant d’avoir une surface et un projecteur réels.

## Tranche de données retenue

La recette **Fleur Fantôme** (`recettes.id = 150025`) comporte huit molécules reliées avec un point d’ébullition renseigné, compris entre **194 °C et 327 °C** selon le comptage du 15 septembre 2026. Cette tranche est retenue comme matériau graphique : elle est assez petite pour une lecture spatiale et résulte de relations existantes. Elle ne constitue pas une autorisation de formulation, de chauffe ou de diffusion.

## Éléments écartés à ce stade

| Piste | Motif direct |
|---|---|
| Partition thermique avec chauffe réelle | Aucun modèle de thermocouple, interface Seek ni dispositif de chauffage protégé n’a été vérifié. Le `boilingPoint` ne doit pas piloter un chauffage. |
| Fumée de matière brûlée | Non retenue pour une première séance : le besoin de ventilation, de responsabilité de salle, de mesure de particules et d’absence de public ne peut pas être déduit du code. |
| Pilotage olfactif multi-canaux | Aucun actionneur, capteur de flux, protocole de nettoyage ou preuve de rémanence contrôlée n’est disponible dans l’atelier identifié. |
| Visualisations bibliographiques | La bibliographie fait l’objet d’une remédiation qualité ; elle n’est pas une source publique fiable pour un essai. |
| Radars comme données corporelles | Les six axes sont renseignés, mais ne sont pas validés comme mesures perceptives ; ils restent une couche graphique explicitement déclarée. |

## Critère commun de réussite

Chaque prototype ne réussit que si l’opérateur peut répondre **oui** à une question observable : « la tranche de données chargée est-elle affichée, sa version est-elle visible, et l’action physique modifie-t-elle un paramètre graphique annoncé ? ». Tout autre résultat — notamment une atmosphère séduisante mais sans relation traçable aux données — compte comme un échec d’intégration.
