# PERFUMUM — prototypes de mapping image × données

Quatre prototypes de projection confrontent une image à des données du dépôt :
photo de terrain, reproduction d'œuvre, ou **l'œuvre réelle sous le projecteur**.
Ils appliquent les principes du rapport
[`docs/research/2026-10-rapport-interactions-v1-v2-touchdesigner.md`](../../docs/research/2026-10-rapport-interactions-v1-v2-touchdesigner.md) :

- **écrire avant d'afficher** : un geste n'apparaît qu'après l'écriture de sa ligne dans le run ;
- **journal add-only** : NDJSON, chaque ligne chaînée à la précédente par sha256 ;
- **direct = rejeu** : la même fonction applique les événements en direct et en rejeu ;
- **pointeurs visibles dans la zone projetée** : `RUN-…#seq`, empreinte, fichiers sources ;
- **Phase 0** : aucune commande d'émission, de chauffe ou de diffusion.

## Ouvrir

Double-cliquer `index.html` dans **Chromium ou Chrome sur ordinateur**. Aucun serveur, build, réseau ni accès à la base n'est nécessaire : les données sont des exports datés dans `data/`, chargés par balises `<script>` classiques compatibles `file://`.

| Prototype | Confrontation | Données (export daté, hachées) | Mécaniques du rapport | V1 → V2 |
|---|---|---|---|---|
| [01 · Calque de preuve](01-calque-de-preuve/index.html) | Zones tracées sur l'image ↔ assertions du dépôt. Les trois dimensions N5 sont codées séparément (couleur, trait, remplissage). Le prototype affiche la surface **non documentée**, les **mesures superposées** (Linalol 20,65–22,95 % vs 26,58–27,42 %) et les **écarts de taxon** entre l'image déclarée et la preuve. | `server/data/plant-molecule-evidence-lot-1.ts` (7 preuves GC-MS), export *Fleur Fantôme* (8 relations) | Contradiction performée, réversibilité cadrée (lier / délier avec motif / annoter), double flux (marge violette non probante) | V1 : le résident attribue et annote. V2 : rejeu du calque sur l'œuvre réelle (image masquée, `I`). |
| [02 · Purge](02-purge/index.html) | L'image n'apparaît que dans les cellules (jour × table) où l'archive a travaillé. Purge totale = effacement + fantôme ; purge partielle = hachure (étendue inconnue) ; purge refusée = cercle. Arrêt à chaque purge : motif connu / inconnu / absent (12 s). | `.manus/db` → `data/manus-db-timeline.js` (2 006 requêtes, 111 jours, **sans hôte ni SQL**) | Horloge d'archive, archive matérielle (via TD ou impression), blanc instrumenté (erreurs = silences) | V1 : lecture et motifs du résident. V2 : boucle publique, rejeu des motifs ; en mode `I`, la lumière ne révèle l'œuvre réelle que là où l'archive a travaillé. |
| [03 · Trois horloges](03-trois-horloges/index.html) | Chaque photo est placée selon l'appareil (EXIF), le fichier (date système) et la déclaration de l'opérateur. Fuseau inconnu = intervalle de 26 h ; métadonnée absente = marge « non datable » ; logiciel d'édition signalé ; distance GPS / lieu déclaré. Axe brisé avec coupures étiquetées. | Vos photos (lues localement ; seuls sha256 et métadonnées sont journalisés) | Provenance, incertitude, contradiction sans vainqueur | V1 : déclaration terrain photo par photo. V2 : la table des écarts projetée, sans les fichiers si les droits ou la vie privée l'exigent (`I`). |
| [04 · Érosion](04-erosion/index.html) | L'œuvre est découpée en 77 tuiles pour 76 absences documentées. Un tirage pondéré par le manque, à graine journalisée, retire **définitivement** une tuile et la remplace par sa fiche (pointeur, manque, « ceci interdit de conclure… »). Les 4 absences **contredites** par l'export *Fleur Fantôme* portent un coin rouge. | `docs/data/refs-without-doi.json` (26), `MOLECULES_CLASSIQUES_MANQUANTES.csv` (25), `plants-not-geocoded.json` (2), `seasonal-variations.json` (19 variations sans source), 4 preuves retenues | Oracle à trous, épuisement irréversible, archive matérielle | V1 : enquêtes ouvertes ou laissées. V2 : rejeu exact par la graine ; en mode `I`, les fiches recouvrent l'œuvre réelle, le reste ne reçoit aucune lumière. |

Commandes communes : `C` calibrer les 4 coins (homographie, plan unique) · `R` réinitialiser · `I` image visible / masquée · `H` masquer le panneau · `F` plein écran.

## Le run

- **Démarrer un run** crée l'en-tête : `RUN-AAAAMMJJ-nnn` (convention N6, compteur local au navigateur), type de run, opérateur, sources et leurs sha256, graine, `phase_olfactive: 0`.
- **Écrire sur disque…** (File System Access, Chromium) : chaque ligne est ajoutée au fichier choisi avant d'être appliquée. Si l'écriture échoue, l'action n'est pas appliquée.
- Sans fichier choisi, le run vit dans le navigateur, avec une sauvegarde de secours en `localStorage` récupérable au rechargement. **Télécharger NDJSON** exporte le run à tout moment.
- **Clore le run** écrit une ligne `close` ; le run devient alors en lecture seule. Corriger = annoter, jamais réécrire.
- **Charger un .ndjson** rejoue un run après recalcul de sa chaîne. Une seule ligne modifiée affiche « chaîne rompue ✗ ». Le rejeu n'écrit rien.
- **Relayer (WebSocket)** envoie chaque ligne écrite à `ws://127.0.0.1:9980` (TouchDesigner, voir plus bas).

Format d'une ligne :

```json
{"v":1,"run_id":"RUN-20261002-001","seq":4,"ts_utc":"…","tz_local":"Europe/Zurich","kind":"event",
 "concept":"MAP-01-calque-de-preuve","event_type":"region_linked","actor_source":"operator","flux":"probant",
 "payload":{"region_id":"R-001","assertion_id":"LOT1-01"},"prev_hash":"…","hash":"…"}
```

`hash = sha256(prev_hash + "\n" + JSON canonique de la ligne sans hash)` ; clés triées, nombres au format JavaScript.

## Outils

```bash
# Régénérer les exports de données depuis le dépôt (lecture seule, sha256 des sources inclus)
python3 tools/mapping-prototypes/cli/build_data.py

# Vérifier un ou plusieurs runs (code de sortie 1 si une chaîne est rompue)
node tools/mapping-prototypes/cli/verify-run.mjs RUN-20261002-001.ndjson
python3 tools/mapping-prototypes/td/perfumum_ndjson.py RUN-20261002-001.ndjson
```

## TouchDesigner

Aucun fichier `.toe` n'est livré : le dépôt n'en contenait pas et le format binaire ne se versionne pas proprement. Deux points d'entrée en Python standard :

1. **Rejeu (testé hors TD)** : `td/perfumum_ndjson.py`. `load_run()` vérifie la chaîne (parité de formatage des nombres avec JavaScript, contrôlée sur 20 010 valeurs) ; `fill_table(op('events'), run)` remplit un Table DAT avec un pointeur lisible par ligne.
2. **Direct (non testé dans TD)** : `td/webserver_callbacks.py`, à brancher sur un Web Server DAT (port 9980). Chaque ligne relayée par le navigateur est ajoutée au Table DAT `events`. Un trou de `seq` est affiché comme **absence de transmission**, jamais comblé.

TouchDesigner reste consommateur : le navigateur est le seul écrivain du run.

## Limites (vérifiées)

- **Images :** aucune œuvre du domaine public n'est livrée. Le dépôt n'en contient pas, et `commons.wikimedia.org` est bloqué par la politique réseau de l'environnement de développement. La mire de démonstration est générée et dite comme telle.
- **Mapping :** homographie à 4 coins sur **un plan**. Un volume complexe exige un scan (Revopoint) ou un logiciel de mapping (cf. protocoles 2026-09).
- **EXIF :** seuls les JPEG sont lus (pas HEIC/PNG). Le GPS peut être une donnée personnelle : à trancher avant toute présentation publique.
- **Journal `.manus/db` :** c'est le journal de l'outil Manus, pas de la base. Un `DELETE` peut précéder une réimportation. 27 instructions de purge ont été exécutées dans 15 fichiers et 33 ont échoué dans 6 fichiers, dont `DROP TABLE molecules`, refusé par une clé étrangère. Seules deux purges totales ont été exécutées : `installations` (02/12/2025) et `recette_molecules` (06/12/2025).
- **Phrases « ceci interdit de conclure » (04) :** rédigées pour le prototype, à relire. La liste `MOLECULES_CLASSIQUES_MANQUANTES.csv` n'est pas datée, et 4 de ses entrées (Iso E Super, Ambroxan, Galaxolide, Hedione) sont présentes dans l'export *Fleur Fantôme* du 15/09/2026. La contradiction est affichée, pas corrigée.
- **Identifiants de run :** compteur propre à chaque navigateur, donc deux postes peuvent produire le même `RUN-…`. Un préfixe de poste sera nécessaire en V2.
- **Écriture disque :** l'API est disponible en `file://` sous Chromium (vérifié), mais la boîte de dialogue d'enregistrement n'a pas pu être testée automatiquement.

## Validation effectuée (2 octobre 2026)

Des scénarios Playwright ont été exécutés dans Chromium sur les 4 pages ouvertes en `file://` ; ils ne sont pas commités, car Playwright n'est pas une dépendance du dépôt. Résultats :

- aucune erreur console ;
- runs téléchargés validés par `verify-run.mjs` et par `perfumum_ndjson.py` ;
- rejeux « chaîne vérifiée ✓ » ;
- un run altéré d'une seule décision détecté « chaîne rompue ✗ » ;
- calibration 4 coins, mode support physique (`I`), arrêts aux purges avec motif absent journalisé par le séquenceur ;
- EXIF lus sur des JPEG de test synthétiques (fuseau + GPS, sans fuseau + logiciel, sans EXIF) ;
- tirages de l'Érosion recalculés et conformes 24/24.
