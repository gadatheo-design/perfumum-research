# Protocole commun — comparer une règle, une lecture et un médium

**Statut : proposition de protocole, non exécutée.** Il concerne les expériences visuelles V01–V12. Il ne lance ni test olfactif, ni recrutement, ni mesure physiologique, ni installation publique.

## 1. Geler la question avant l’apparence

Pour chaque essai, écrire une question et la différence recherchée. Exemple V01 : peut-on distinguer un lien renseigné d’une relation étayée pour ce contexte ? Exemple V02 : le calque rend-il cette différence plus accessible ou crée-t-il une fausse continuité ? Exemple V03 : faut-il que les lectures se voient simultanément, ou que le lecteur se déplace entre elles ?

Une animation agréable ne suffit pas à répondre. Autoriser aussi un résultat négatif : le papier peut mieux fonctionner que le mur ; une légende peut ruiner un effet optique ; un objet peut être trop opaque pour servir de trace.

## 2. Préparer un corpus fermé, pas une moyenne du projet

Le petit export devra être autorisé séparément. Préserver les identifiants source, les tables d’origine et tous les attributs nécessaires aux règles retenues. Un lien dont la cible est non résolue doit être conservé dans une liste d’exclusions explicite, pas raccordé par nom. Les cas CAS/DOI ou taxons candidats de revue restent intacts.

Les quantités doivent conserver champ, unité, méthode, portée et contexte disponibles. Ne pas ramener à 100 % des composants provenant de lots distincts. Ne pas remplir une quantité absente à partir d’un rôle « trace » ou « variable ». Une structure renseignée peut nécessiter un contrôle de parseur local ; ce contrôle n’est pas une expertise de son identité scientifique.

Établir les comptes du fichier exporté : ils doivent être contrôlés à la date de cet export, et ne sont pas tenus de reproduire indéfiniment les agrégats du 24 octobre 2026.

## 3. Séparer les fichiers immuables des annotations

Le paquet proposé comprend corpus, manifeste, configuration, version de règle, versions de bibliothèques, seed lorsque nécessaire et exports. Le manifeste garde origine, date, empreintes, compteurs et exclusions. Il reste figé après une sortie finalisée.

Un journal local distinct conserve les gestes et résultats de lecture. Une nouvelle configuration reçoit une nouvelle version. Une annotation tardive n’écrase pas le corpus, la règle ou le rendu qu’elle commente. Ces fichiers préservent la rejouabilité, pas la validité scientifique.

En cas de matière générative, séparer une trace deterministe de l’image rendue : GPU, navigateur, fonts et encodage peuvent empêcher une égalité pixel pour pixel entre deux machines. La comparaison robuste porte d’abord sur les données retenues, les états calculés, la seed, les paramètres et un rendu de référence enregistré.

## 4. Faire varier un facteur à la fois au premier essai

Pour V01/V02/V03, conserver le même corpus, la même sélection et les mêmes identifiants. Comparer d’abord une règle de lecture sur deux médiums ; puis un médium avec deux règles. Si corpus, règle, palette, ordre et support changent en même temps, le résultat ne permet plus d’attribuer une différence à une décision.

Conserver un témoin neutre : carte simple avec légende fixe, transparent sans film dichroïque, image immobile avant animation, panneau lisible hors zone projetée. Un effet esthétique peut rester ambigu ; le statut des données, lui, doit être accessible.

## 5. Épreuves de lecture proposées

Ces tâches sont proposées pour une auto-évaluation ou une future petite revue consentie, pas réalisées ici.

| Épreuve | Résultat recherché | Signe d’échec |
| --- | --- | --- |
| Retrouver la source d’un lien | Le lecteur rejoint une citation et sa portée | Une arête est perçue comme preuve sans accès au document |
| Lire un manque | Le lecteur nomme le champ non documenté | Le vide devient absence de composé ou absence d’odeur |
| Retrouver le même identifiant | La relation reste identifiable entre deux supports | La position/couleur remplace l’identité |
| Revenir à l’état précédent | Sélection et règle sont restituées | Une navigation dynamique ne permet plus de revoir l’état |
| Comparer deux règles | Le lecteur explique ce qui a changé | Le mouvement est pris pour un événement mesuré |
| Rejouer une configuration | Les états et exclusions concordent | La forme seule est sauvegardée |
| Retirer le matériau spectaculaire | L’intérêt de recherche reste explicable | L’expérience n’a de sens que par son effet optique |

Ne pas convertir trois retours de lecteurs en statistiques de perception générale. Recueillir seulement ce qui est nécessaire à la question ; pas de visage, voix ou trajectoire nominative par défaut. Une auto-évaluation documentée permet de commencer sans capture de public.

## 6. Passage à la matière

L’écran prévisualise une composition, pas tous les phénomènes matériels. Tester sur un petit coupon avant de préparer un mur, et sur une forme simple avant une fabrication complète. Documenter couleur du support, transparence, source visible, angle, contraste, position et photographie de référence.

Une silhouette ajourée encode une sélection de liens. L’épaisseur choisie pour éviter la casse est une contrainte de fabrication, pas une quantité scientifique. Une phosphorescence est une trace matérielle, pas une mesure de rémanence olfactive. Une caustique calculée demeure un calcul jusqu’à son épreuve physique.

Avec un objet mobile, la projection peut être interrompue ou l’objet remis sur gabarit. Sans repérage et calibration, ne pas décrire le déplacement comme suivi en temps réel.

## 7. Portes de décision

**Porte A — numérique.** Corpus et règles lisibles, fichiers locaux, état rejouable, retour fonctionnel. Décider de développer ou d’abandonner une forme avant matériel.

**Porte B — matière.** Le support révèle quelque chose que l’écran masque ; une version neutre existe ; aucune confusion nouvelle sur la nature des données. Décider d’un assemblage à échelle plus grande.

**Porte C — espace.** Surfaces et sélection restent identifiables ; calibration et état sans signal sont définis ; le besoin d’interaction a été démontré. Toute ouverture au public implique une préparation du lieu et des risques propre à cette installation.

L’éclairage UV, le laser, la fumée, la brume, le chauffage et la présentation d’odorants ne sont pas des étapes nécessaires de ce programme visuel. S’ils sont envisagés dans un autre chantier, ils demandent un protocole distinct et ne sont pas autorisés par la validation d’une fiche visuelle.

## 8. Conserver le laboratoire pendant dix ans

Notion sert au cadrage, aux décisions et aux liens. Le dossier local conserve les corpus, règles et sorties. Une expérience ne dépend pas de la persistance d’un lien de CDN, d’une API Manus ou de cette conversation. Les dépendances doivent rester identifiées, téléchargeables et licencées ; une œuvre de référence ne donne pas automatiquement le droit de réutiliser ses images ou son code.

Prévoir des copies indépendantes et vérifier la possibilité de relire les formats ouverts. Sauvegarde complète de PERFUMUM et autonomie de son hébergement restent le chantier de récupération distinct : ce dossier de visualisation n’est pas un remplacement de cette sauvegarde.
