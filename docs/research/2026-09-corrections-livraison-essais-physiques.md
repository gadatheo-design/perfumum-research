# PERFUMUM — Corrections de livraison des essais physiques

**Date :** 16 septembre 2026  
**Périmètre :** correction de livrables, lecture de données et visualisation. Aucune écriture scientifique, commande de chauffe, diffusion ou accueil de public n’est implémenté.

## État des sept points signalés

| Point | Constat vérifié | Correction ou livrable | État |
|---|---|---|---|
| Commande locale | `physical-tests` était absente du manifeste courant. | `pnpm physical-tests` démarre le serveur local à `127.0.0.1:4174`. `pnpm physical-tests:zip` reconstruit l’archive. | Corrigé |
| Fichiers sans build | Les anciens prototypes reposaient sur un serveur local. | `deliverables/essais-physiques-autonomes/` contient quatre dossiers ouvrables par double-clic, chacun avec `index.html` et export JSON adjacent. L’archive `deliverables/perfumum-essais-physiques-autonomes.zip` contient l’ensemble. | Livré |
| Carte de complétude | Le relevé actuel porte sur **7 478**, et non 7 477, molécules. | CSV, SVG et SQL lecture seule : `2026-09-completude-molecules-2026-09-16.{csv,svg}` et `server/scripts/report-data-completeness-installation.sql`. | Livré |
| Partition thermique | La comparaison est recevable uniquement comme partition documentaire. | Prototype autonome `04-partition-thermique/` : lecture manuelle ou série consentie, aucun port d’écriture, aucun relais ni commande de chauffage. | Livré |
| Modes Zenodo | Le script restauré refusait des modes que le protocole décrivait. | Le CLI met désormais en œuvre simulation, transit confirmé, préannotation bornée, export et enregistrement de double revue dans les seules tables de transit. | Corrigé |
| Décisions opérateur | Les données de projet ne suffisent pas à déterminer le matériel exact ni les conditions d’essai. | Les questions et mesures demandées sont listées ci-dessous. | Livré |
| Carte terroirs / Köppen | Les deux valeurs ne portent pas sur la même entité. Le zéro était rendu pendant le chargement des requêtes. | La carte affiche désormais « Chargement des coordonnées… » avant réponse puis compte les coordonnées GPS valides ; une note explicite les affectations Köppen séparément. | Corrigé |

## Comptage moléculaire demandé

| Champ et définition | Compte non nul | Part de 7 478 |
|---|---:|---:|
| `boilingPoint IS NOT NULL` | 7 477 | 99,98 % |
| `volatility IS NOT NULL` | 7 411 | 99,10 % |
| `intensity IS NOT NULL` | 7 409 | 99,07 % |
| `radar_intensity IS NOT NULL` | 7 478 | 100,00 % |
| `radar_freshness IS NOT NULL` | 7 478 | 100,00 % |
| `radar_warmth IS NOT NULL` | 7 478 | 100,00 % |
| `radar_sweetness IS NOT NULL` | 7 478 | 100,00 % |
| `radar_spiciness IS NOT NULL` | 7 478 | 100,00 % |
| `radar_earthiness IS NOT NULL` | 7 478 | 100,00 % |
| `pubchem_cid IS NOT NULL` | 7 292 | 97,51 % |
| `ifra_status IS NOT NULL` | 7 478 | 100,00 % |
| `inchi LIKE '%/t%'` | 2 476 | 33,11 % |

> Ces indicateurs mesurent seulement la présence de valeurs. Ils n’établissent ni l’exactitude scientifique d’un point d’ébullition, ni l’actualité d’un statut IFRA, ni une composition d’air, ni une identité stéréochimique certaine.

## Source de vérité : terroirs et Köppen

La requête `dashboard.getKoppenStats` retourne **1 814 affectations** distribuées sur **16 zones**. Elle découpe le champ `plants.koppen_zone` : une même plante peut contribuer à plusieurs zones. La base comporte simultanément **1 812 plantes** avec une valeur `koppen_zone` non vide. Il est donc erroné d’appeler 1 814 un nombre de plantes géolocalisées.

La carte, elle, lit `terroirs.latitude` et `terroirs.longitude`. Le relevé de production a trouvé **93 terroirs**, dont **58** avec deux coordonnées GPS convertibles et dans les bornes terrestres. Les valeurs actuellement rendues après réponse sont 93 terroirs, 58 géolocalisés, 498 plantes liées et 1 736 relations affichables. Les totaux SQL plus larges peuvent inclure des relations orphelines : ils ne doivent pas devenir des marqueurs sans une réassociation revue.

> Ainsi, les deux observations sont vraies mais elles répondent à deux questions différentes : **où sont les terroirs géocodés ?** (58) et **combien d’affectations climatiques sont renseignées pour les plantes ?** (1 814). Le zéro observé au rendu contrôlé était un état de chargement présenté de manière ambiguë, non un résultat de données.

## Questions, décisions et mesures qui reviennent à l’opérateur

| Catégorie | Décision ou mesure attendue | Pourquoi elle est nécessaire |
|---|---|---|
| Ordinateur et navigateur | Indiquer l’OS, la version de Chromium et si l’ouverture directe de chaque `index.html` réussit. | Web Serial dépend du navigateur et de l’autorisation locale ; les autres essais n’en dépendent pas. |
| Projection | Photographier une grille projetée sur la surface, relever largeur/hauteur projetées et distance projecteur–surface. | La calibration quatre points ne peut pas être évaluée depuis le code seul. |
| Capteur de proximité | Indiquer le modèle Arduino et capteur, puis envoyer trois lignes série réelles (en centimètres). | Le prototype ne lit qu’une valeur numérique terminée par un retour ligne ; aucun firmware n’est présumé. |
| Température | Choisir la source — thermocouple ou caméra thermique Seek — puis relever cinq mesures horodatées et leurs unités. | La partition compare une mesure à des valeurs documentaires, sans inférer ce qui est dans l’air. |
| Séance thermique | Confirmer le lieu vide de public, l’opérateur présent en continu, l’absence de commande de chauffe depuis le navigateur et le droit de consigner un CSV local. | Ce sont les conditions minimales du prototype ; il ne traite aucun scénario de chauffage automatisé. |
| Journal | Choisir un identifiant de séance et conserver le CSV téléchargé avec deux images fixes ou une courte vidéo locale. | Le journal reste à l’écart de la base tant que vous ne demandez pas son import documenté. |
| Zenodo | Décider si un CSV source de 50 lignes, provenance et licence complètes doit être mis en transit, et désigner les deux réviseurs. | Le script refuse la finalisation et ne transforme aucune préannotation en fait scientifique. |
| Données | Décider quand reprendre la revue des conflits CAS puis des liens orphelins. | Les cas non strictement convergents restent ouverts ; aucune fusion ne doit être automatisée. |

## Références internes

| Artefact | Usage |
|---|---|
| `deliverables/essais-physiques-autonomes/README.md` | Instructions de double-clic et limites des quatre prototypes. |
| `deliverables/perfumum-essais-physiques-autonomes.zip` | Archive autonome à copier sur l’ordinateur d’essai. |
| `docs/research/2026-09-completude-molecules-2026-09-16.csv` | Comptage tabulaire reproductible. |
| `docs/research/2026-09-completude-molecules-2026-09-16.svg` | Carte vectorielle de complétude. |
| `server/scripts/report-data-completeness-installation.sql` | Requête SQL en lecture seule. |
| `docs/protocols/pilote-zenodo-script.md` | Commandes Zenodo, confirmations et limites de transit. |

## Vérifications d’ouverture directe

Les pages `01-graphe-anamorphique/index.html`, `02-graphe-proximite/index.html`, `03-champ-noir/index.html` et `04-partition-thermique/index.html` ont été ouvertes directement par chemin `file://` dans Chromium, sans serveur ni build. Les contrôles visibles, le rendu canvas, l’export CSV local et les textes de garde-fou ont été observés pour les quatre pages. Le prototype de proximité expose le repli curseur indépendamment de Web Serial ; le champ noir ne présente aucune commande de matière.
