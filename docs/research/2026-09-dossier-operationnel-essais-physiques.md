# Dossier opérationnel — première vague d’essais physiques PERFUMUM

**État :** prêt pour trois essais locaux, courts et sans émission.  
**Périmètre :** projection, interaction de proximité et champ graphique ; aucun essai de chauffe, de brumisation, de diffusion ou de combustion.

## Ce qui est réellement prêt

| Élément | Emplacement | Validation effectuée |
|---|---|---|
| Audit de raccordement | [Carte d’exploitabilité](./2026-09-carte-exploitabilite-installation-physique.md) | Code, endpoints, CORS, pages visuelles et limites documentés. |
| Données de séance | [`tools/physical-tests/data/fleur-fantome-2026-09-15.json`](../../tools/physical-tests/data/fleur-fantome-2026-09-15.json) | Huit relations réellement extraites de *Fleur Fantôme* ; export daté, sans appel réseau en séance. |
| Trois protocoles | [Protocoles d’essai](./2026-09-protocoles-essais-physiques.md) | Durées, critères de réussite, pannes, retours attendus, limites et références. |
| Prototype A | [`projection-mapping`](../../tools/physical-tests/projection-mapping/) | Page ouverte ; huit relations, quatre poignées, journal CSV. |
| Prototype B | [`arduino-proximity`](../../tools/physical-tests/arduino-proximity/) | Page ouverte ; simulation 80 cm et connexion série conditionnée à une action volontaire. |
| Prototype C | [`dark-field`](../../tools/physical-tests/dark-field/) | Page ouverte ; l’activation de Linalol modifie le champ et affiche la relation. |
| Garde-fous | [`physical-tests.test.ts`](../../server/physical-tests.test.ts) | 136 fichiers Vitest validés, soit 1 924 tests réussis et 2 ignorés ; contrôle TypeScript réussi. |

## Séquence recommandée

Commencez par **A — Graphe anamorphique**. Il vérifie le rapport entre une forme de données existante et une surface réelle sans introduire de capteur. Poursuivez par **C — Champ noir**, car il vérifie l’interaction et l’archivage local sans dépendre d’un navigateur compatible série. Ne branchez **B — Graphe de proximité** qu’après ces deux essais, avec l’Arduino déjà vérifié dans son environnement habituel.

| Ordre | Essai | Durée | Décision produite |
|---:|---|---:|---|
| 1 | A — Graphe anamorphique | 90 min | La calibration navigateur suffit-elle sur le volume choisi ? |
| 2 | C — Champ noir | 60 min | Une relation de donnée devient-elle lisible comme changement d’état, sans effet matériel ? |
| 3 | B — Graphe de proximité | 75 min | La distance volontairement fournie par le capteur produit-elle un changement graphique stable ? |

## Démarrage local

```bash
cd /home/ubuntu/perfumum-research
pnpm physical-tests
```

Ouvrez ensuite dans Chromium :

```text
http://localhost:4174/projection-mapping/
http://localhost:4174/dark-field/
http://localhost:4174/arduino-proximity/
```

Chaque page télécharge son propre CSV local. Conservez ce CSV avec deux photographies ou une courte vidéo, plutôt que de l’importer dans la base. La première itération est un **journal d’essai** : elle sert à décider si une seconde itération mérite un connecteur durable, un scan Revopoint ou un logiciel de mapping.

## Décisions express après la séance

| Observation | Décision conseillée |
|---|---|
| La projection A reste lisible avec les quatre points | Conserver la solution navigateur ; ne pas acheter de logiciel de mapping. |
| A échoue à cause d’occlusions/reliefs, malgré une surface claire et stable | Scanner le volume, puis tester une démo MadMapper avant toute licence. |
| C est graphiquement séduisant mais la relation active n’est pas lisible | Réduire l’animation et renforcer la trace de données ; ne pas ajouter de brume. |
| B réagit de manière instable | Conserver le CSV brut, revoir câble/baudrate/lissage ; ne pas basculer vers réseau ou collecte supplémentaire. |
| Un essai suggère une atmosphère matérielle | Mettre le sujet en attente : validation de lieu, ventilation, sécurité incendie, SDS et évaluation professionnelle doivent précéder toute émission. |

## Limites assumées

La valeur de point d’ébullition apparaît dans les prototypes comme une information documentaire. Elle n’est pas une température de consigne et ne produit aucune action sur un chauffage. Les radars, proportions et profils présents dans l’export sont également des données de recherche affichées avec leur statut ; ils ne constituent pas des mesures sensorielles. Le présent lot ne modifie aucune molécule, recette, association, bibliographie ou table de remédiation.

Le script Zenodo retrouvé manquant pendant la validation globale a été restauré sous la forme d’un garde-fou CLI : il rend la simulation explicite et refuse toute écriture scientifique de production. Les opérations de transit à double revue restent confinées au parcours administrateur authentifié, plutôt qu’à une commande locale ambiguë.
