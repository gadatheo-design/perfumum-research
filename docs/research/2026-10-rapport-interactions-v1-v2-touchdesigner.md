# PERFUMUM — Potentiels d’interaction, hardware et TouchDesigner pour un dispositif V1 (LAB) → V2 (installation)

**Date :** 2 octobre 2026
**Dépôt lu :** `gadatheo-design/perfumum-research`, branche `claude/gifted-knuth-m2t5g6` (commit de départ `7213aaf`). Le champ « Repo GitHub » du cahier des charges était resté vide (`[COLLER URL OU NOM DU REPO]`) ; c'est donc le dépôt de cette session qui a été analysé.
**Sources complémentaires lues (lecture seule) :** deux pages Notion citées par le dépôt mais absentes de celui-ci : *Olfactory event log v1* (N6) et *Evidence & Provenance Model* (N5).
**Statut :** ce document est un rapport de recherche. Il ne modifie ni code, ni schéma, ni données. Il n'autorise aucun essai d'émission, de chauffe, de diffusion ou de présence du public.

### Légende épistémique (règle 2)

| Balise | Sens |
|---|---|
| **[F]** | **Factuel.** Vérifié dans le dépôt (fichier, ligne, comptage exécuté le 2 octobre 2026). **[F-Notion]** signale un fait lu dans N5 ou N6. |
| **[I]** | **Inférence.** Déduction raisonnable à partir de faits, non vérifiée directement. |
| **[H]** | **Hypothèse ou proposition.** Choix de conception, produit cité en exemple, ordre de grandeur de prix, ou connaissance technique externe à revérifier. |

---

## 1. Synthèse

1. **[F]** Le dépôt est une plateforme web de recherche (React/Express/tRPC) adossée à une base TiDB distante. Elle ne fonctionne pas hors ligne. Il ne contient **ni TouchDesigner, ni OSC/MIDI/DMX, ni asset média**.
2. **[F]** Sa vraie richesse pour V1/V2 est **épistémique** : journaux append-only (remédiation, pilote Zenodo), 169 conflits CAS, 80,6 % de molécules sans profil olfactif, 7 preuves GC-MS sourcées avec plages, et 2 006 journaux SQL horodatés comportant des purges (27 instructions exécutées, 33 refusées ; correction du 2 octobre 2026, voir C01).
3. **[F]** Quatre prototypes physiques existent (projection, proximité Web Serial, champ noir, partition thermique). Ils sont non émissifs et journalisent en CSV local, mais avec des schémas divergents, sans `run_id` et sans écriture sur disque.
4. **[F]** Fragilités majeures : `server/scripts/` est exclu par `.gitignore`, ce qui casse `pnpm physical-tests` ; `.manus/db` expose des identifiants d'infrastructure ; `p5data.gcms` est non reproductible (`Math.random`).
5. **[F-Notion]** Le modèle canonique existe déjà dans N6 : run immuable, blancs = runs, corrections par annotation, `replay_of`. Il n'est **pas implémenté** dans le dépôt.
6. **[H]** Proposition centrale : un **logger unique, local et add-only (NDJSON chaîné par hash)** devient la seule source de vérité. TouchDesigner n'affiche **que ce qui a été écrit**, de sorte que le direct et le rejeu passent par le même chemin de code.
7. **[H]** 10 concepts (4 P1, 4 P2, 2 P3) mobilisent les 10 mécaniques signature. Les quatre P1 sont testables en 2 h avec le matériel annoncé comme possédé (Arduino, Makey Makey, beamer) plus une imprimante thermique.
8. **[H]** Le premier pas recommandé est un bridge minimal : le logger NDJSON, un patch TD de lecture, et un convertisseur des CSV existants. Le dépôt n'a pas à être refondu.

---

## 2. Cartographie du dépôt

### 2.1 Arborescence commentée

```
perfumum-research/                         [F] 4 041 fichiers suivis
├── client/src/              React 18 + Vite 7 + Tailwind 4 ; ~430 pages .tsx (graphes D3, Sankey, radars, cartes Leaflet)
├── server/
│   ├── _core/               Express + tRPC 11, OAuth Manus, WebSocket /ws/collaboration, CORS p5data
│   ├── routers/             210 routeurs tRPC (dont p5data public, data-quality-remediation, zenodo pilot)
│   ├── db/                  accès MySQL/TiDB (Drizzle + SQL brut)
│   ├── data/                plant-molecule-evidence-lot-1.ts : 7 preuves GC-MS sourcées (DOI, plages, réserves)
│   └── *.test.ts            140 fichiers Vitest (dont physical-tests.test.ts)
├── drizzle/                 41 modules de schéma MySQL + 98 migrations SQL
├── tools/physical-tests/    prototypes navigateur A (anamorphique), B (proximité Web Serial), C (champ noir)
│   └── data/                fleur-fantome-2026-09-15.json : export daté, 8 molécules
├── deliverables/essais-physiques-autonomes/   4 HTML autonomes double-cliquables (dont 04 partition thermique) + ZIP
├── docs/research/2026-09-*  dossiers de recherche-création (hypothèses, protocoles, exploitabilité, territoires)
├── docs/audits/             audits qualité : 169 conflits CAS, 22 liens orphelins, bibliographie, bilan de remédiation
├── docs/data/               listes d'absences hors ligne (refs sans DOI, molécules manquantes, variations saisonnières…)
├── docs/prompts/            prompts maîtres (expérimentations artistiques / matérielles, régimes A–D)
├── .manus/db/               2 006 journaux JSON de requêtes SQL horodatés (02/12/2025 → 22/03/2026)
├── .wave1-backups/          375 sauvegardes de pages avant retrait de @ts-nocheck
├── research/, research-notes/, notes/   notes (pyrolyse, tabac, rose, cannabis, Boswellia, mambe)
└── _archive/                anciens schémas et imports
```

### 2.2 Langages, frameworks, outils [F]

- **TypeScript** (client et serveur), **SQL** MySQL/TiDB, **Python** (scripts de remédiation, `analyze-navigation.py`), **HTML/JS vanilla** (prototypes physiques).
- React 18.3 (le README annonce React 19 : **[F] incohérence**), Vite 7, tRPC 11, Express 4, Drizzle ORM, D3 7, Chart.js, React Flow, Leaflet, `ws`.
- Outillage : pnpm, Vitest, Prettier, esbuild, Lighthouse. `better-sqlite3` figure dans les devDependencies : **[I]** une base SQLite locale est envisageable sans nouvelle dépendance.
- CI GitHub : typecheck et build. Les tests ne s'exécutent que si le secret `CI_DATABASE_URL` est défini ; sinon ils sont ignorés.

### 2.3 Données présentes (formats exacts et exemples)

| Donnée | Format | Exemple d'un enregistrement [F] |
|---|---|---|
| Export *Fleur Fantôme* `tools/physical-tests/data/fleur-fantome-2026-09-15.json` | JSON (objet : `exportedAt`, `source`, `dataStatus`, `recipe`, `molecules[]`) | `{"id":30002,"name":"Linalol","cas":"78-70-6","formula":"C10H18O","boilingPointC":196,"volatility":66,"intensity":55,"proportion":11,"role":"ingredient"}`. Les 8 proportions valent toutes 11, soit une **somme de 88** : **[I]** valeurs de remplissage ou unité non documentée. |
| Journal `.manus/db/db-query-<epoch_ms>.json` (2 006 fichiers, dont 283 `-error-`) | JSON : `query`, `command`, `rows`, `messages`, `stdout`, `stderr`, `execution_time_ms` | `db-query-1764701085690.json` → `"query": "DELETE FROM installations;"` (2025-12-02 18:44 UTC). Le champ `command` contient hôte, utilisateur et base TiDB (aucun mot de passe trouvé). |
| Preuves GC-MS `server/data/plant-molecule-evidence-lot-1.ts` | Objets TS typés `PlantMoleculeEvidence` | Lavande des Pyrénées → Linalol 78-70-6, **20,65–22,95 %**, Mac Sweeney et al. 2025, DOI `10.1002/cbdv.202403478`, réserve : « propre à cet échantillon et à ce protocole ». |
| CSV des prototypes (`shared.js`) | CSV, 7 colonnes : `timestamp_utc, prototype, event_type, value, unit, source_export, operator_note` | `"…Z","champ_noir","relation_active","30002","molecule_id","fleur-fantome-2026-09-15.json","Linalol; BP 196 °C; proportion 11"` |
| CSV du prototype 04 thermique | CSV, 5 colonnes, **sans `source_export`**, note non échappée | `…Z,temperature_observed,20,C; comparaison documentaire, pas composition air`. La virgule de la note décale la colonne `unit`. |
| Complétude `docs/research/2026-09-completude-*.csv` | CSV agrégé | `Molécules,Point d’ébullition renseigné,7477,7478,champ technique déclaré` |
| Listes d'absences `docs/data/` | JSON / CSV | `refs-without-doi.json` (26 références), `MOLECULES_CLASSIQUES_MANQUANTES.csv` (25 molécules), `plants-not-geocoded.json` (2), `seasonal-variations.json` (8 matières, plages min–max par saison **sans source par variation**) |
| Base de production | MySQL/TiDB **distante, absente du dépôt** (`*.db`/`*.sqlite` ignorés) | Tables utiles : `data_quality_remediation_cases/actions`, `olfactory_term_pilot_*`, `ghost_varieties`, `field_archives`, `situated_smells`, `laboratoire`, `modification_history`, `recipe_versions`, `olfactive_emissions` |

### 2.4 Assets [F]

- **Aucune image, aucun son, aucune vidéo versionnés.** Seuls deux SVG sont présents : les graphiques de complétude dans `docs/research/`.
- Les images de l'application passent par un proxy de stockage Manus (`server/storage.ts`, S3) et par Wikimedia : elles sont indisponibles hors ligne.
- Conséquence **[I]** : V1 et V2 produiront leurs propres médias (photos de scellés, scans de tickets). Il faut les hacher et les pointer depuis les runs.

### 2.5 Scripts d'exécution

| Commande | État [F] |
|---|---|
| `pnpm dev` / `pnpm start` | Nécessite `DATABASE_URL` (TiDB), `JWT_SECRET`, OAuth Manus et des clés Forge. **Non utilisable hors ligne.** |
| `pnpm physical-tests` | **Cassée** : le fichier `server/scripts/serve-physical-tests.mjs` est absent, car `.gitignore` contient `scripts/`. |
| `pnpm import:pred-o3*`, `pnpm pilot:zenodo:*` | **Cassées** pour la même raison. `server/scripts/report-data-completeness-installation.sql` est cité dans la documentation mais absent. |
| `deliverables/essais-physiques-autonomes/*/index.html` | **Fonctionnels hors ligne** (double-clic dans Chromium ; Web Serial optionnel). |
| `pnpm test` / `pnpm check` | Exige une base de données pour l'intégration. `physical-tests.test.ts` lit un fichier absent : **[I]** échec attendu s'il est exécuté (non exécuté ici). |

### 2.6 Interfaces existantes [F]

- **tRPC HTTP** `/api/trpc/*`. Le routeur `p5data` est public avec CORS dans le code, mais l'en-tête n'a pas été observé sur le déploiement le 15/09 (d'après la carte d'exploitabilité).
- **WebSocket** `/ws/collaboration` : présence, curseurs, activité. État **en mémoire vive** (50 activités au maximum), **non persisté**.
- **Web Serial** dans les prototypes B et 04 : 9 600 bauds, une valeur numérique par ligne, **lecture seule**, Chromium uniquement.
- **Clavier `1`–`8`** dans le prototype C (Makey Makey prévu comme substitut).
- **Export CSV** par téléchargement navigateur. Les événements restent en mémoire jusqu'au clic : **perdus si l'onglet se ferme**.
- **Absents :** OSC, MIDI, DMX, Art-Net, BLE, MQTT, fichiers TouchDesigner (`.toe`/`.tox`), sketches p5 locaux. Le protocole d'essai **écarte explicitement** OSC/MIDI/DMX/WebSocket et TouchDesigner pour la vague 1 (« écarter jusqu'à ce qu'un besoin précis soit constaté »).

### 2.7 Points fragiles

1. **[F]** `.gitignore` → `scripts/` exclut `server/scripts/`. Les scripts référencés par `package.json`, par les tests et par la documentation sont absents.
2. **[F]** `.manus/db/*.json` contient en clair hôte, utilisateur et nom de base TiDB, ainsi que le texte de requêtes de production. Aucun mot de passe n'a été trouvé, mais ce journal **ne doit jamais être affiché tel quel** en V2.
3. **[F]** `p5data.gcms` produit un « GC-MS simulé » : temps de rétention et intensités de repli en `Math.random()`. Le commentaire dit pourtant « aléatoire mais déterministe ». La sortie annonce aussi « N composés identifiés ». **Inutilisable comme source de run.**
4. **[F]** L'append-only existe par convention de code (tables `*_actions`, `*_reviews`, `*_finalizations`), **sans trigger en base**. `data_quality_remediation_cases` est mutable (upsert, `updated_at`). `modification_history` admet `delete` et `is_undone`.
5. **[F]** Les axes radar sont renseignés à 100 % mais sont des « assertions perceptives non vérifiées ». 7 206 molécules sont marquées `valide` (96 %) malgré des lacunes de provenance (audit du 23/08).
6. **[F]** Le README est obsolète (31 tables, 176 molécules, React 19) face aux 7 478 molécules de l'audit et à React 18.
7. **[F-Notion]** Le modèle de preuve est incohérent entre N5 (trois dimensions séparées : niveau primaire/secondaire/tertiaire, confiance, vérification) et N6 (`evidence_level` unique : eleve/moyen/faible). N5 affirme pourtant que N6 implémente cette séparation.
8. **[F]** Le build est lourd (`tsc` à 8 Go). Web Serial est limité à Chromium.

### 2.8 Tableau composants → opportunités d'interaction

Maturité : 0 = absent, 1 = brut ou cassé, 2 = fonctionnel partiel, 3 = robuste. Opportunité : 0 = nulle, 3 = forte.

| Composant | Rôle | Maturité | Dépendances | Opportunité | Note |
|---|---|:-:|---|:-:|---|
| `deliverables/essais-physiques-autonomes/` | 4 prototypes HTML autonomes | 2 | Chromium | **3** | Seule brique déjà hors ligne ; à brancher sur le logger. |
| `tools/physical-tests/` (A, B, C) | Prototypes servis localement | 1 | Script serveur absent | 2 | Fonctionnels si on les ouvre autrement ; CSV non persistés. |
| Export `fleur-fantome-2026-09-15.json` | Tranche datée de 8 relations | 2 | — | **3** | Pointeurs (`id`, `cas`) prêts à être affichés ; somme des proportions = 88. |
| `data-quality-remediation` (cases + actions + `exportCasEvidence`) | File de contradictions et journal de décisions | **3** | TiDB, rôle admin | **3** | Matière native de contradiction et de décision ; export JSON existant. |
| `server/data/plant-molecule-evidence-lot-1.ts` | 7 preuves GC-MS sourcées | **3** | — | 2 | Hors ligne ; incertitude sous forme de plages. |
| `docs/audits/*` + `docs/data/*` | Absences et conflits quantifiés | 2 | — | **3** | Pools hors ligne pour un oracle et des index d'absence. |
| `.manus/db/` (2 006 journaux) | Vie horodatée de la base | 1 | — | **3** | Horloge d'archive réelle ; à nettoyer (`command`). |
| `p5data` | Données publiques (molécules, plantes, GC-MS simulé) | 2 | Serveur + DB | 1 | `gcms` non reproductible : seulement comme contre-exemple. |
| Visualisations D3 / Sankey / radar | Géométries projetables | 2 | Application + DB | 1 | À recalculer dans TD depuis un export ; radars non probants. |
| WebSocket `/ws/collaboration` | Présence et activité en mémoire | 1 | Serveur, JWT | 1 | Pas un bus add-only. |
| `modification_history`, `recipe_versions`, `classification_snapshots` | Versionnement et instantanés | 2 | DB | 2 | Temporalité et réversibilité (à rendre non destructive). |
| `ghost_varieties` + liens (`hypothetical`, `reconstructed`, `confidence`) | Disparition et reconstruction | 2 | DB | **3** | Absence documentée, confiance explicite. |
| `field_archives` (`whatToKeep` / `whatToLeave`, `personalFeeling`) | Archive terrain subjective | 2 | DB | **3** | Double flux déjà présent dans le schéma. |
| `laboratoire` (`stock` en ml, `status=epuise`, `maxTemperature`) | Inventaire de matières | 2 | DB | 2 | Épuisement ; Phase 1 olfactive. |
| `olfactory_term_pilot_*` (double revue, finalisations immuables) | Revue linguistique et scientifique | **3** | DB | 2 | Désaccords entre réviseurs. |
| `docs/research`, `docs/prompts` | Cadre épistémique (régimes A–D, interdits) | **3** | — | 1 | Garde-fous, pas une interface. |

---

## 3. Diagnostic TouchDesigner et hardware-fit

### 3.1 Principe d'architecture offline-first [H]

```
 capteurs ─┐                     USB-série (NDJSON brut, 115 200 bauds)
 boutons ──┼─► MCU (Arduino/Teensy) ─────────────────────────────┐
           │      ▲  « ACK seq » (l'actionneur n'agit qu'après écriture)
           │      │                                              ▼
 actionneurs ◄────┴──────────────────────────────── RUN-LOGGER (Python, seul écrivain)
                                                     ├─ runs/RUN-AAAAMMJJ-nnn.ndjson  (append-only, fsync, hash chaîné)
                                                     ├─ runs/MANIFEST.sha256          (empreintes des runs clos)
                                                     ├─ imprimante / plotter          (après écriture uniquement)
                                                     └─ OSC/UDP 127.0.0.1 ──► TouchDesigner (lecture seule)
                                                                               └─ rejeu : lit les mêmes fichiers
```

Quatre règles en découlent :

1. **Écrire avant d'agir, écrire avant d'afficher.** Aucun actionneur, aucune impression et aucun pixel ne réagit à une valeur brute. Tout réagit à une ligne déjà écrite et confirmée par son numéro de séquence (`seq`). C'est la garantie structurelle anti-décorative : retirer le journal éteint littéralement l'œuvre.
2. **Un seul écrivain.** Ni TouchDesigner ni le navigateur n'écrivent de run. Ainsi, un plantage de TD ne corrompt rien.
3. **Hors ligne.** Réseau local seulement (localhost ou Wi-Fi isolé), aucune dépendance au déploiement Manus ni à TiDB. Les données de la base entrent uniquement par **exports datés et hachés**, comme le fait déjà le dépôt avec *Fleur Fantôme*.
4. **Aligné sur N6 sans le surconstruire.** Identifiants `RUN-AAAAMMJJ-nnn`, `run_type` (`blank_chamber`, `experiment`, `calibration`, `rehearsal`, `public_performance`), `run_link` (`blank_for`, `replay_of`), `run_annotation` pour toute correction, et `source` des actionneurs (`sequencer`, `operator`, `safety_interlock`). N6 recommande lui-même de commencer « papier + CSV » (P0) avant SQLite (P1) : le NDJSON en est l'étape intermédiaire.

### 3.2 Niveaux matériels

Tous les produits sont cités comme **exemples [H]**, avec des prix en **ordres de grandeur non vérifiés**. Le matériel **annoncé comme possédé** dans les protocoles du dépôt **[F]** : beamer, Arduino + capteur de distance + USB, Makey Makey, scanner Revopoint ; une caméra thermique Seek est mentionnée mais non vérifiée.

**Niveau S — 2 h à 2 jours.** Capteurs simples et TD minimal.

| Élément | Exemples [H] | Rôle dans le run | IO |
|---|---|---|---|
| MCU | Arduino possédé, Teensy 4.0 | Horodatage `t_ms`, `seq`, émission NDJSON | USB-série |
| CO₂ / T / HR | Sensirion SCD41 (I²C) | Contexte et blancs ; **jamais un comptage de personnes** | I²C |
| COV (indice) | Bosch BME688 / Sensirion SGP41 (MOS) | Signal global non sélectif, `quality_flag=warmup` pendant la stabilisation | I²C |
| Balance | Cellule de charge + HX711 | Masse des scellés, des jetons, des bocaux | GPIO |
| Toucher | Makey Makey possédé, MPR121 | Gestes binaires (deux mains, manivelle) | HID / I²C |
| Distance | Capteur possédé, VL53L1X | Présence volontaire **sans inférence** (cf. hypothèse 4 du dépôt) | I²C |
| Actionneurs | Imprimante thermique ESC/POS, solénoïde 12 V + MOSFET, LED | Ticket, frappe, état | USB / GPIO |
| Logiciel | Python (`pyserial`, `python-osc`) + TD (OSC In DAT, File In DAT) | Logger et rendu | — |

Coût **[H]** : 150–600 CHF hors matériel possédé.

**Niveau M — 1 à 2 semaines.** Dispositifs mécaniques et plusieurs canaux.

| Élément | Exemples [H] | Rôle |
|---|---|---|
| RFID / NFC | PN532, RC522 ; étiquettes anti-effraction (ex. NXP NTAG 424 DNA TagTamper, à vérifier) | Jetons d'index, scellés cassables |
| PID | Ion Science MiniPID 2 (cité dans N6), Alphasense PID-AH2 | Réponse COV globale **relative**, avec composé de référence déclaré |
| PM2,5 | Sensirion SPS30 | Garde-fou, **pas** une évaluation de risque |
| Plotter | AxiDraw | Archive manuscrite lente, carte de consultations |
| e-ink | Dalles e-paper 7–13" | Cartels persistants sans écran émissif (IDs visibles sans alimentation) |
| LED | WS2812 / SK6812 via Teensy (OctoWS2811), ou nœud Art-Net / DMX | Index lumineux pilotés par le journal |
| Nœuds | ESP32 sur Wi-Fi local isolé (OSC/UDP) | Multi-postes sans internet |
| Verrous | Ventouse électromagnétique, contact reed | Interlocks journalisés (`source=safety_interlock`) |

Coût **[H]** : 1–5 kCHF.

**Niveau L — résidence.** Instruments rares.

| Élément | Exemples [H] | Rôle |
|---|---|---|
| Bras robotique collaboratif | uFactory xArm, UR3e | Scellement et ouverture rejouables ; en V2, rejeu **sans matière** |
| Vision fixe | Caméra industrielle + éclairage constant | Photographie et hachage de l'état des scellés ; vérification d'actionnement (trou percé, ticket sorti) |
| Balance de laboratoire RS-232 | Classe 0,1 mg | Pertes de masse, `mass_before_g` / `mass_after_g` (N6) |
| Banc PID multi-voies + extraction instrumentée | — | Purge mesurée (« arrêter est difficile ») |
| Perforation XY / gantry | Gantry + poinçon solénoïde | Épuisement irréversible |
| Analyse externe | Tubes Tenax → laboratoire GC-MS | **Phase 1 uniquement**, chaîne qualité N6 (blancs, duplicats) |
| Caméra thermique | Seek (annoncée), FLIR Lepton | Lecture seule ; **aucune consigne de chauffe** |

Coût **[H]** : 15–80 kCHF. Formation, assurance et maintenance sont lourdes.

**Rappel des garde-fous du dépôt [F] :** un capteur MOS n'est pas un nez électronique, un PID ne donne pas une carte de l'odeur, le CO₂ ne compte pas les visiteurs. `boilingPoint` ne commande jamais un chauffage. Brume, fumée, chauffe et diffusion sont **ajournées** (`2026-09-analyse-plateforme-olfactive-programmable.md`, `2026-09-protocoles-essais-physiques.md`).

### 3.3 TouchDesigner : diagnostic

**Constat [F] :** aucun fichier TD dans le dépôt ; TD est explicitement écarté pour la vague 1.
**Évaluation [I] :** TD est cohérent pour V1 et V2 car les volumes sont faibles (dizaines à milliers d'événements). Les besoins sont un **rendu mural stable**, un **rejeu temporel** et une **typographie de pointeurs**, ce que TD fait bien. Il doit rester **consommateur**, jamais écrivain.

**Ingestion**

| Source | Opérateur TD [H, à vérifier selon version] | Usage |
|---|---|---|
| Ligne NDJSON en direct | **OSC In DAT** (UDP localhost). Le logger envoie la ligne écrite avec `seq` et `hash`. | Direct. Un trou de `seq` est affiché comme **absence de transmission**, ce qui fait de l'absence une donnée. |
| Fichiers de runs clos | **Folder DAT** (surveille `runs/`) + **File In DAT** + **Script DAT** (`json.loads` ligne par ligne) → Table DAT | Rejeu et consultation |
| CSV existants des prototypes | **File In DAT** en mode table | Bridge immédiat vers l'existant |
| JSON (exports datés) | Script DAT ou JSON DAT (versions récentes) | Pointeurs `id` / `cas` / `source_export` |
| Série directe | Serial DAT | **Déconseillé** : il contourne le logger. Seulement pour du débogage. |
| WebSocket | WebSocket DAT | Possible, mais OSC suffit en local |

**Direct et rejeu : une seule horloge, deux sources [H]**

- Tous les visuels sont indexés par un **curseur de run** : `t_run = ts_utc − started_at`.
- En direct, le curseur suit la fin du fichier. En rejeu, un Timer CHOP pilote le curseur (vitesse ×1, ×10, ×10 000, ou pas à pas).
- Un badge permanent indique `LIVE · RUN-…` ou `REJEU · RUN-… ×10 · source sha256:ab12…`.
- Un rejeu en V2 ne modifie jamais le run source. S'il doit être tracé, il crée un **nouveau run** `public_performance` lié par `run_link(replay_of)` (N6).

**Mur stable, sans écran de veille [H]**

- Mode Perform au démarrage, Window COMP sur la sortie dédiée, résolution native fixe du projecteur.
- Veille et économie d'énergie désactivées au niveau du système, script de relance (watchdog) au niveau du système, mises à jour automatiques coupées.
- Licence : la version Non-Commercial est plafonnée à 1280×1280 **[H, à revérifier]**. Une licence Commercial ou Pro est probablement nécessaire en V2.
- **État dégradé visible plutôt qu'un écran noir** : « logger silencieux depuis 00:04:12 — dernière ligne RUN-…#412 ». La panne devient une trace.
- Pas de dépendance réseau ni de média distant. Rendu vectoriel et texte (Text TOP / Text COMP) plutôt que des vidéos.

**Pointeurs visibles : règle d'affichage [H]**

- Tout élément visuel porte son pointeur `run_id#seq`, l'empreinte courte (8 caractères hexadécimaux) et, s'il y a lieu, `table:id` ou `source_export`.
- Une zone de cartel fixe affiche le statut (`probant` ou `marge`), la Phase olfactive (0 ou 1) et la mention « aucune émission » le cas échéant.
- **Test :** une photo du mur doit permettre de retrouver la ligne exacte du journal.

### 3.4 Alternatives (2 seulement, quand elles sont plus cohérentes)

1. **Pages navigateur locales existantes** (`deliverables/…`) pour les postes V1 portables et le terrain. Avantages : zéro installation, Web Serial déjà écrit. À brancher sur le logger via une route `POST /append` locale ou via export NDJSON.
2. **Rendu non écran piloté directement par le logger** : imprimante thermique, plotter, e-ink. Pour les concepts dont la forme est le papier, ajouter TD n'apporte rien en V1.

---

## 4. Les 10 concepts (P1 / P2 / P3) — V1 outil → V2 mise en scène

### 4.0 Matrice des mécaniques signature

| # | Concept | Prio | Scellé | Oracle | Contradiction | Blanc | Horloge | Archive matérielle | Index tactile | Double flux | Épuisement | Réversibilité |
|---|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| C01 | Horloge de purge | P1 | | | | ● | ● | ● | | | | ● |
| C02 | Témoin vide | P1 | | | | ● | ● | ● | | | | |
| C03 | Deux mains, deux vérités | P1 | | | ● | | | ● | | | | ● |
| C04 | Oracle à trous | P1 | | ● | | | | ● | | | | ● |
| C05 | Sceau de lot | P2 | ● | | | | ● | ● | | | | |
| C06 | Index à trois dimensions | P2 | | | ● | | | | ● | | | ● |
| C07 | Garder / Laisser | P2 | | | | | | ● | | ● | | |
| C08 | Crible des 7 478 | P2 | | | | | ● | ● | | | ● | |
| C09 | Gardien de cloche | P3 | ● | | ● | ● | ● | | | | ● | |
| C10 | Archive qui respire | P3 | ● | | | ● | ● | | | | ● | |

**Les 10 mécaniques sont couvertes** (le minimum demandé était 6).

### 4.0 bis Format de run commun [H]

Chaque fiche décrit ses champs propres, ajoutés à l'enveloppe commune suivante :

```json
{"v":1,"run_id":"RUN-20261015-003","seq":17,"ts_utc":"2026-10-15T14:03:22.418Z","tz_local":"Europe/Zurich",
 "kind":"measurement|event|annotation|header|close","run_type":"blank_chamber|experiment|calibration|rehearsal|public_performance",
 "concept":"C05","event_type":"seal_read","value":12.41,"unit":"g","quality_flag":"ok",
 "flux":"probant|marge","actor_source":"sequencer|operator|safety_interlock|public",
 "evidence":{"level":"primaire|secondaire|tertiaire","confidence":"haute|moyenne|basse","verification":"a_verifier|verifie|conteste|obsolete"},
 "pointer":{"table":"recettes","id":150025},"source_export":"fleur-fantome-2026-09-15.json","source_sha256":"…",
 "prev_hash":"…","hash":"…"}
```

---

### C01 — Horloge de purge · **P1**

- **Geste.** Le résident règle la vitesse de rejeu avec un encodeur cranté. À chaque purge rejouée (`DELETE` / `DROP`), il a 10 s pour appuyer sur « motif connu » ou « motif inconnu ». Le silence est journalisé comme **absence de motif**.
- **Objet physique.** Une horloge électromécanique : plaque de laiton frappée par un solénoïde (une frappe par requête rejouée, un **silence** par requête en erreur), afficheur de la date d'origine, ticket thermique à chaque purge.
- **Capteurs / actionneurs.** Encodeur rotatif ; bouton double ; micro piézo collé à la plaque (pour **vérifier que la frappe a eu lieu** : un actionneur non confirmé est un incident) ; solénoïde 12 V ; imprimante thermique ; afficheur 7 segments.
- **Donnée produite.** En-tête : `source_manifest_sha256` (empreinte des 2 006 fichiers), `speed`. Par tick : `source_file`, `query_kind`, `table`, `original_ts`, `replay_ts`, `is_error`, `strike_confirmed`, `purge_motive` (`connu` / `inconnu` / `absent`).
  Types : **temporalité** (séquence, intervalle, purge), **provenance** (fichier source), **absence** (erreurs, motifs manquants), **incertitude** (frappe non confirmée).
- **Ancrage dépôt [F].** `.manus/db/` : 2 006 requêtes sur 46 jours actifs, 283 erreurs.
  - *Correction du 2 octobre 2026* : le premier relevé (11 `DELETE` + 1 `DROP`) ne comptait que le premier mot-clé de chaque fichier. Instruction par instruction, il y a **27 purges exécutées dans 15 fichiers** et **33 purges refusées dans 6 fichiers**.
  - Parmi les refus, `DROP TABLE molecules` a été bloqué par une contrainte de clé étrangère.
  - **Deux purges totales seulement** ont été exécutées : `installations` (02/12/2025) et `recette_molecules` (06/12/2025). Cette dernière table porte les relations de *Fleur Fantôme* exportées le 15/09/2026. **[I]** Ces relations ont donc été reconstruites après la purge.
  - Prototype : `tools/mapping-prototypes/02-purge/`.
- **Rendu.** Son acoustique réel (solénoïde, sans TD). TD : frise murale compressée sur les 46 jours actifs ; chaque purge est une bande noire sur la ligne de sa table, avec le pointeur `db-query-<epoch>`. En complément, un rouleau de tickets.
- **Pourquoi PERFUMUM-native.** C'est la vie réelle de l'archive, pas une métaphore. Le principe add-only est confronté à ses propres suppressions passées. La purge devient un médium.
- **Anti-ornement.** Sans le journal, il reste un métronome qui cliquette. Chaque frappe n'existe que comme rejeu d'un fichier daté. ✔
- **Risques.**
  - Technique : cycle de service du solénoïde (échauffement), bruit.
  - Épistémique : c'est le **journal de l'outil Manus, pas le journal de la base** **[I]**. Les écritures applicatives n'y figurent pas. Un `DELETE` peut précéder une réimportation : ne jamais l'afficher comme « perte ».
  - Sécurité : supprimer le champ `command` (hôte, utilisateur, base) **avant** toute ingestion ; ne montrer le SQL que tronqué ou haché ; risque de pincement du solénoïde.
- **Test minimal 2 h.**
  1. Un script Python trie les 2 006 fichiers par époque, classe le premier mot-clé et retire `command`.
  2. Il écrit `RUN-…-001.ndjson` en mode `replay_of`.
  3. Il envoie un octet par requête à l'Arduino (LED ou buzzer si pas de solénoïde).
  4. TD lit le fichier et trace la frise.

  **Résultat attendu :** 2 006 lignes, 283 silences, 21 tickets de purge (15 fichiers exécutés + 6 refusés) ; à ×10 000, environ 16 min pour 110 jours calendaires.
- **Coût et logistique [H].** 150–400 CHF. Logistique faible ; bruit à cadrer.
- **V1 → V2.**
  - Change : en V1, le résident rejoue et annote (runs `replay_of` + annotations). En V2, l'horloge rejoue en boucle et chaque boucle est un run `public_performance` lié.
  - Reste : fichiers source, annotations, tickets.
  - Réserve : texte SQL complet, champ `command`.

### C02 — Témoin vide (blanc d'abord) · **P1**

- **Geste.** Avant toute séance, le résident pose une cloche de verre **vide** sur un socle-capteur, appuie sur « blanc », puis ne touche plus rien pendant l'intervalle fixé (10 à 30 min). Tout run ultérieur **sans blanc lié** est imprimé avec la mention « SUSPECT ».
- **Objet physique.** Socle en bois avec capteurs intégrés et cloche en verre ; ticket du blanc.
- **Capteurs / actionneurs.** SCD41 ; BME688 ou SGP41 ; contact reed (cloche posée) ; ToF (présence humaine qui perturbe le blanc) ; en option, un PID au niveau M. Imprimante thermique, LED d'état.
- **Donnée produite.** `run_type=blank_chamber` ; par canal : `baseline_mean`, `baseline_sd`, `drift_per_h`, `n_exceedances_kσ` (**faux positifs déclarés** : dépassements sans cause), `warmup_flagged_s`, `presence_detected`, `bell_closed_s` ; `run_link(blank_for)` vers les runs suivants. Le ticket imprime aussi **ce que ces capteurs ne peuvent pas voir** : identité moléculaire, odeur, composés non ionisables par le PID.
  Types : **absence / non-détection**, **incertitude** (σ, dérive, chauffe), **temporalité** (intervalle).
- **Ancrage dépôt.**
  - [F] Prototypes 03 (« sans émission ») et 04 (« pas une mesure de composition de l'air ») ; analyse plateforme (MOS ≠ nez, PID ≠ carte de l'odeur) ; hypothèse 4 « Attention à l'épreuve du non-signal ».
  - [F-Notion] N6 : « Les blancs sont des runs » ; vue `v_runs_without_blank`.
- **Rendu.** TD : un « registre des blancs » mural où chaque blanc est une bande de bruit horizontale. Les faux positifs y sont marqués et le compteur des runs sans blanc est affiché. Ticket papier.
- **Pourquoi PERFUMUM-native.** Il rend probante la non-détection. C'est l'éthique de remédiation du dépôt appliquée à l'air.
- **Anti-ornement.** Sans run, une cloche vide sur un socle est un objet de design. Ce concept n'existe **que** par sa trace : le mur n'affiche rien d'autre que des valeurs journalisées. ✔
- **Variantes olfactives.**
  - **Phase 0** (zéro odorant ajouté) : blanc d'air de salle sous cloche vide, matériau du protocole.
  - **Phase 1** (privé contrôlé) : blanc systématique avant chaque run privé où la cloche contient un flacon **fermé** de matière du `laboratoire`.
  - **Hors scope sans validation :** ouverture de flacons, quantification COV d'une matière, présence du public.
- **Risques.**
  - Technique : stabilisation longue des MOS ; sensibilité croisée à l'humidité ; l'autocalibration du SCD41 suppose de l'air frais (la désactiver sous cloche).
  - Épistémique : « rien mesuré » ≠ « rien présent ». Le ticket doit imprimer le périmètre du capteur.
  - Sécurité : faible.
- **Test minimal 2 h.** SCD41 + BME688 sur l'Arduino. Blanc de 10 min sous cloche, puis run de 10 min cloche ouverte. NDJSON, puis ticket. **Résultat attendu :** deux runs liés `blank_for`, avec σ, dérive et nombre de dépassements imprimés, et un état `warmup` visible.
- **Coût et logistique [H].** S : 80–200 CHF. M avec PID : 1–3 kCHF.
- **V1 → V2.**
  - Change : chaque journée d'exposition s'ouvre sur un blanc de salle (`public_present` renseigné). Le mur met en regard les blancs de la résidence et celui du jour.
  - Reste : tous les blancs V1.
  - Réserve : résistances MOS brutes (non interprétables), conservées mais non montrées.

### C03 — Deux mains, deux vérités · **P1**

- **Geste.** Deux plaques de laiton sont posées à bras écartés (environ 1,2 m). Le cas ne s'imprime **que si les deux mains restent posées en même temps**, au moins 3 s : les deux imprimantes sortent alors les deux assertions concurrentes. Lâcher une main interrompt le geste (« préférence non enregistrable »). Une troisième voie, centrale, permet d'**annoter** sans jamais réimprimer ni modifier les tickets latéraux.
- **Objet physique.** Table longue, deux plaques, deux imprimantes thermiques, rail central d'annotations.
- **Capteurs / actionneurs.** **Makey Makey possédé** : plaque gauche = masse, plaque droite = touche. Le circuit ne se ferme qu'à travers le corps qui tient les deux. Une variante MPR121 distingue chaque main. Deux imprimantes, un clavier ou stylet pour l'annotation.
- **Donnée produite.** `case_id`, `assertion_left{value, source, evidence{3 dimensions}}`, `assertion_right{…}`, `both_held_ms`, `interruptions[]`, `annotations[]`, et `winner: null` **imposé par le schéma** (le champ existe et ne peut pas être renseigné).
  Types : **contradiction**, **provenance**, **temporalité** (durée de maintien).
- **Ancrage dépôt.**
  - [F] `data_quality_remediation_cases` (169 groupes CAS, `currentValue` / `proposedValue` / `evidence`) ; procédure `exportCasEvidence` ; exemples de l'audit (CAS 67-56-1 et 64-19-7 rattachés à des structures différentes) ; double revue du pilote Zenodo.
  - [F-Notion] N5 « retain both… avoid silently choosing ».
  - **Pool hors ligne pour le MVP**, contradictions internes au dépôt [F] : README « React 19 » vs `package.json` 18.3.1 ; README « 176 molécules » vs audit 7 478 ; `p5data` « aléatoire mais déterministe » vs `Math.random()` ; « GC-MS simulé » vs « composés identifiés » ; N5 vs N6 sur `evidence_level` ; radars renseignés à 100 % vs profils olfactifs à 19,4 %.
- **Rendu.** V1 : tickets. V2 : TD sur deux murs qui se font face ; une bande centrale accumule les annotations, et chaque côté porte son pointeur et ses trois dimensions de preuve.
- **Pourquoi PERFUMUM-native.** La règle N5 est performée : la coexistence est physiquement nécessaire pour lire le cas.
- **Anti-ornement.** Sans run, il reste deux plaques et du papier générique. Chaque ticket est un cas daté et pointé. ✔
- **Risques.**
  - Épistémique : la symétrie suggère une égalité de poids. Il faut imprimer l'asymétrie des niveaux de preuve et nommer « conflit non tranché », pas « deux vérités égales ». Certaines contradictions sont des **erreurs probables** (CAS du méthanol).
  - Réputationnel : exposer des erreurs de données.
  - Sécurité : très basse tension, négligeable.
- **Test minimal 2 h.** Makey Makey + 2 plaques de cuivre + PC. Un script Python lit l'événement, prend le cas suivant parmi les 6 contradictions internes listées, imprime ou affiche les deux côtés et journalise. **Résultat attendu :** 6 runs avec `both_held_ms` et interruptions ; aucune ligne avec `winner` non nul ; une annotation ajoutée sans altérer les tickets.
- **Coût et logistique [H].** 0–300 CHF.
- **V1 → V2.**
  - Change : le public, s'il y est autorisé, peut tenir les plaques. Cela ne fait que **réimprimer des cas V1**, jamais de nouveaux cas ; les annotations du public vont dans le flux `marge`.
  - Reste : cas, tickets, annotations.
  - Réserve : cas marqués « erreur probable ».

### C04 — Oracle à trous · **P1**

- **Geste.** On tourne une manivelle jusqu'au déclic, ce qui déclenche un **tirage pondéré par le manque**. Le ticket sort avec un pointeur et une phrase « ceci interdit de conclure que… ». Le résident l'agrafe au registre (« enquête ouverte ») ou le glisse dans la fente « laisser », vers une urne scellée. Les deux choix sont journalisés.
- **Objet physique.** Boîte-oracle en bois : manivelle, fente de sortie, fente « laisser », urne.
- **Capteurs / actionneurs.** Encodeur, fin de course, barrière infrarouge dans la fente « laisser ». Imprimante thermique.
- **Donnée produite.** `pool_sha256`, `weight_formula` (imprimée), `seed` (le PRNG est **graine-journalisé**, donc le tirage est rejouable à l'identique), `drawn_pointer`, `missing_fields[]`, `forbidden_conclusion` (phrase pré-écrite par catégorie, **pas générée**), `decision` (`garder` / `laisser`).
  Types : **absence**, **incertitude** (poids), **provenance**, **temporalité** (séquence).
- **Ancrage dépôt [F].** Pools hors ligne : `docs/data/refs-without-doi.json` (26), `MOLECULES_CLASSIQUES_MANQUANTES.csv` (25), `plants-not-geocoded.json` (2), `seasonal-variations.json` (plages sans source). Agrégats d'audit : 6 028 molécules sans profil, 3 226 plantes sans signature, 22 liens orphelins. H1 « Index des absences vérifiables » (première passe et portefeuille). Contre-exemple : `p5data.gcms` est aléatoire **non rejouable**.
- **Rendu.** TD : une « constellation des manques » murale ; chaque tirage allume son point et la carte des poids reste visible. Le rejeu par graine reproduit la séquence. Le ticket reste l'objet principal.
- **Pourquoi PERFUMUM-native.** L'oracle ne comble rien : il oriente l'attention vers un manque, et il est auditable.
- **Anti-ornement.** Sans run, c'est un gadget de fête foraine. **Règle :** le pointeur est imprimé dans le plus grand corps du ticket et la graine est obligatoire. ✔
- **Risques.**
  - Épistémique : la pondération est un choix (d'où son impression) ; risque de « gamification » des lacunes.
  - Technique : le papier thermique **n'est pas archivable** (il s'efface). Le NDJSON est la référence ; chaque ticket est photographié et haché.
  - Sécurité : nulle.
- **Test minimal 2 h.** Python charge les deux premiers pools ; bouton Makey Makey ; graine journalisée ; ticket ou PDF ; NDJSON. **Résultat attendu :** 10 tirages, puis un rejeu par graine qui ressort les 10 mêmes items.
- **Coût et logistique [H].** 150–500 CHF.
- **V1 → V2.**
  - Change : le public peut **rejouer** un tirage V1 par sa graine ou tirer dans le **pool gelé** de V1. Chaque tirage V2 est un nouveau run.
  - Reste : pool, graines, tickets.
  - Réserve : notes d'enquête, urne « laisser » (scellée, non ouverte).

### C05 — Sceau de lot · **P2**

- **Geste.** Le résident clôt un run en scellant la trace matérielle (ticket, note de terrain, résidu en Phase 1) dans un bocal fermé par une **étiquette NFC anti-effraction**, puis le pose sur la station : lecture et pesée. Toute ouverture rompt la boucle de l'étiquette. La **rupture est constatée à la lecture suivante** et journalisée comme un **intervalle** `[dernière lecture intacte, première lecture rompue]`.
- **Objet physique.** Bocaux en verre, étiquettes anti-effraction, station de lecture (lecteur + cellule de charge + T/HR), vitrine.
- **Capteurs / actionneurs.** Lecteur NFC (PN532 ou lecteur USB, compatibilité TagTamper **à vérifier**), cellule de charge + HX711 (balance RS-232 au niveau L), SCD41 (la masse du papier suit l'humidité). Imprimante d'étiquettes : l'ID imprimé est **exactement** le `run_id` (règle N6).
- **Donnée produite.** `seal_uid`, `sealed_run_id`, `content_manifest_sha256`, `mass_at_seal_g ± u`, `rh_at_seal`. Par lecture : `tamper_state`, `mass_g`, `rh`, `delta_mass_g`. Puis `rupture_interval`, et une `calibration` par masse étalon.
  Types : **preuve / provenance**, **temporalité** (intervalle de rupture), **incertitude** (dérive de masse due à l'humidité ou à une fuite, indécidable), **absence** (contenu invisible).
- **Ancrage dépôt.**
  - [F] `field_archives` (`whatToKeep`, `materialState`), `extraction_tests` (`observationDay1` / `Day7`), `laboratoire` (`stock`) ; README des livrables (« conservez ce CSV avec une photo ») ; analyse plateforme (« traces situées et partielles »).
  - [F-Notion] N6 : `sample`, `residue`, `sealed_at`.
- **Rendu.** Vitrine. TD : poser un objet affiche sa chaîne (run → scellé → lectures → rupture), la courbe de masse et les identifiants.
- **Pourquoi PERFUMUM-native.** C'est une preuve matérielle dont l'intégrité est elle-même mesurée, avec une incertitude temporelle honnête.
- **Anti-ornement.** Sans run, un bocal scellé est un objet de vitrine. Tout le sens est dans l'intervalle et la masse journalisés. ✔
- **Variantes olfactives.**
  - **Phase 0** : documents, papiers, objets inertes.
  - **Phase 1** : flacons de matières du `laboratoire` scellés, manipulés par le résident seul en espace ventilé, avec fiches de données de sécurité (SDS).
  - **Hors scope sans validation :** ouverture en public, diffusion, chauffe.
- **Risques.**
  - Technique : approvisionnement en étiquettes et compatibilité des lecteurs ; fluage et dérive thermique de la cellule (d'où des runs `calibration`).
  - Épistémique : ruptures accidentelles, à journaliser « cause inconnue ».
  - Sécurité : verre ; chimie en Phase 1.
- **Test minimal 2 h.** 3 bocaux ; autocollants NTAG215 ordinaires collés **à cheval** sur le couvercle (l'arrachement détruit l'antenne) ; lecteur PN532 ou application téléphone ; HX711. Sceller, rouvrir un bocal, relire. **Résultat attendu :** 3 scellements et 1 rupture avec un intervalle ; deltas de masse corrélés à l'humidité.
- **Coût et logistique [H].** S : 100–200 CHF. M avec étiquettes anti-effraction et balance de laboratoire : 1–3 kCHF.
- **V1 → V2.**
  - Change : en V2, personne n'ouvre ; le public **lit** les scellés en lecture seule. Toute rupture V2 est un incident journalisé.
  - Reste : bocaux, journal des lectures.
  - Réserve : contenus.

### C06 — Index à trois dimensions (classification sans mots) · **P2**

- **Geste.** Pour chaque assertion, le résident choisit un jeton dont :
  - la **texture** code le niveau de preuve (lisse = primaire, strié = secondaire, granuleux = tertiaire) ;
  - la **masse** code la confiance (lourd = haute, moyen = moyenne, léger = basse) ;
  - la **colonne** de la grille où il le pose code la vérification (à vérifier, vérifié, contesté, obsolète).

  Reclasser, c'est déplacer le jeton : un nouvel événement est créé et l'ancien reste.
- **Objet physique.** Plateau à 4 colonnes ; emplacements à antenne RFID et cellule de charge ; 9 familles de jetons (3 textures × 3 masses) en céramique, laiton ou bois.
- **Capteurs / actionneurs.** RFID par emplacement (ou par colonne + ToF), cellules de charge. La **masse lue vérifie physiquement la classe du jeton** : une étiquette contredite par la balance est un incident. LED en option.
- **Donnée produite.** `item_pointer`, `token_id`, `texture_class`, `mass_g`, `column`, `previous_event`, `db_status_at_snapshot`, `divergence` (classement tactile ≠ statut en base, par exemple molécule `valide` posée en « à vérifier »).
  Types : **incertitude**, **contradiction**, **provenance**, **temporalité** (séquence de reclassements).
- **Ancrage dépôt.**
  - [F] `classification_reviews` (confiance IA 0–100 vs corrections manuelles) ; liens `ghost_variety_*` (`confidence`, `sourceType`) ; lot GC-MS 1 (`evidenceLevel`) ; audit (7 206 molécules `valide` malgré les lacunes).
  - [F-Notion] N5 : « Do not collapse these three into one score ».
- **Rendu.** TD : miroir mural de la grille ; trajectoire historique de chaque jeton ; divergences avec la base surlignées.
- **Pourquoi PERFUMUM-native.** N5 devient impossible à violer : trois propriétés physiques ne s'agrègent pas en un score.
- **Anti-ornement.** Sans run, ce sont des jetons. Chaque pose est horodatée et pointée, et la divergence avec la base n'existe que dans le journal. ✔
- **Risques.**
  - Technique : lectures croisées RFID entre emplacements voisins ; coût des cellules par emplacement.
  - Épistémique : codes non verbaux arbitraires (légende tenue dans le journal) ; accessibilité tactile plutôt positive.
  - Sécurité : faible.
- **Test minimal 2 h.** 1 lecteur RC522 + 1 balance ; 9 jetons (rondelles empilées, trois textures de ruban) ; classer les 7 preuves du lot 1 + la proposition chavicol ; reclasser 1 jeton. **Résultat attendu :** 8 classements + 1 reclassement chaîné ; détection d'un jeton dont la masse contredit l'étiquette.
- **Coût et logistique [H].** S : environ 100 CHF. M, grille complète : 1–2 kCHF.
- **V1 → V2.**
  - Change : grille gelée en consultation. Soulever un jeton affiche son historique et journalise une « consultation », pas un reclassement. Le public peut classer dans une **grille marge** séparée.
  - Reste : jetons, historique.
  - Réserve : justifications écrites.

### C07 — Garder / Laisser (double flux) · **P2**

- **Geste.** Un écritoire à deux sorties.
  - À gauche, le flux **probant** n'accepte que des mesures ou des pointeurs sourcés : le logger **refuse** le texte libre et journalise le refus.
  - À droite, le flux **marge** reçoit l'écriture ou la dictée libre (ressenti, souvenir, hypothèse), tracée lentement au plotter sur un papier d'une autre couleur. La marge n'est **jamais promue** en preuve.
- **Objet physique.** Bureau d'archive : imprimante thermique (probant) et plotter à stylo (marge) ; kit terrain ESP32 pour les sorties.
- **Capteurs / actionneurs.** SCD41, luminosité, GNSS (terrain), niveau sonore en dB seulement (probant) ; enregistrement vocal **du résident uniquement** (marge). Imprimante, plotter.
- **Donnée produite.**
  - Flux probant : mesure + pointeur.
  - Flux marge : `text` / `audio_uri`, `author`, `linked_run`, `promotion_forbidden: true`, `evidence: null` imposé.
  - Événement `rejected_free_text_in_probant`.

  Types : **provenance**, **double flux**, **temporalité**.
- **Ancrage dépôt.**
  - [F] `field_archives.whatToKeep` / `whatToLeave` / `personalFeeling` / `olfactiveHypothesis` (« archive subjective assumée ») ; `situated_smells.triggeredMemory`.
  - [F-Notion] N5 : « a literary description… is not automatically evidence of chemical composition ».
- **Rendu.** TD : deux bandes parallèles sur le mur, dans deux registres typographiques, avec un décalage temporel visible et les identifiants des deux côtés. V2 : les deux rouleaux suspendus.
- **Pourquoi PERFUMUM-native.** Il donne un lieu à la marge artistique sans contaminer la preuve.
- **Anti-ornement.** Sans run, c'est une performance d'écriture. Le contenu de l'œuvre est la **séparation contrainte et datée**. ✔, avec un risque si la marge domine.
- **Variantes olfactives.**
  - **Phase 0** : odeurs ambiantes décrites dans la marge, contexte mesuré dans le probant, aucun ajout.
  - **Phase 1** : séance privée avec matière du `laboratoire` ; probant = masse / T / HR / PID, marge = description.
  - **Hors scope sans validation :** évaluation sensorielle par des volontaires (N6 `sensory_evaluation` exige un cadre).
- **Risques.**
  - Épistémique : lecture de la marge comme vérité (d'où un cartel `non-probant` permanent).
  - Vie privée : voix et ressentis du résident.
  - Technique : lenteur du plotter, à assumer comme un coût.
- **Test minimal 2 h.** Logger à deux voies ; clavier → marge ; SCD41 → probant ; deux sorties (thermique + PDF ou plotter) ; tentative d'envoyer du texte dans le probant. **Résultat attendu :** un run à deux flux et 1 refus journalisé.
- **Coût et logistique [H].** 300–900 CHF.
- **V1 → V2.**
  - Change : rouleaux exposés et rejeu synchronisé ; le public n'écrit **que** dans la marge, s'il y est autorisé.
  - Reste : les deux flux.
  - Réserve : audio, notes personnelles.

### C08 — Crible des 7 478 · **P2**

- **Geste.** Chaque consultation d'une molécule, depuis n'importe quel concept, **perfore irréversiblement** sa position sur une grande feuille de 7 478 cases. La feuille est pré-imprimée avec le statut d'absence de chaque molécule (profil manquant, CAS en conflit…). Une molécule ne peut être consultée qu'**une fois** pendant la résidence. Un compteur électromécanique non remettable à zéro affiche le total.
- **Objet physique.** Feuille épaisse grand format (environ 86 × 87 cases) ; gantry XY avec poinçon, ou plotter qui pose un point d'encre au niveau M ; compteur à impulsions.
- **Capteurs / actionneurs.** Caméra de vérification (trou ou point présent = **preuve d'actionnement**), fins de course ; poinçon solénoïde ou plotter ; compteur.
- **Donnée produite.** `molecule_id`, `grid_xy`, `consumer_concept`, `punch_verified`, `counter`, `remaining = 7478 − n`, `absence_status_at_snapshot`.
  Types : **temporalité**, **épuisement**, **absence** (le non-regardé), **provenance**.
- **Ancrage dépôt [F].** 7 478 molécules (complétude 16/09) ; 80,6 % sans profil olfactif ; `laboratoire.status=epuise` (logique de stock fini) ; consultations issues de C03, C04 et C06.
- **Rendu.** Papier : la feuille. TD : miroir mural, compteur restant, rejeu de l'ordre des perforations ; la majorité non perforée est nommée « non regardé ».
- **Pourquoi PERFUMUM-native.** L'attention devient finie et comptable. La carte de ce qui a été regardé révèle surtout l'immensité de ce qui ne l'a pas été.
- **Anti-ornement.** C'est le cas **limite** : une feuille trouée peut être belle sans journal. **Mitigation :** coordonnées et identifiants imprimés sur la feuille, journal indispensable pour lire l'ordre et la date. ⚠ À rejeter si la feuille est exposée sans ses pointeurs.
- **Risques.**
  - Technique : précision du gantry, déchirures.
  - Épistémique : un trou = une consultation, **pas** une validation.
  - Sécurité : pincement du poinçon (carter obligatoire).
- **Test minimal 2 h.** Générer un SVG de 7 478 cases à partir du comptage, avec une correspondance provisoire limitée aux 8 identifiants de *Fleur Fantôme* et aux 25 molécules manquantes (la liste complète exige un export de la base). 20 consultations marquées au plotter ou au tampon guidé par TD. **Résultat attendu :** 20 marques irréversibles et un compteur à 20 cohérent avec le journal.
- **Coût et logistique [H].** Plotter : 500–700 CHF. Gantry à poinçon : 1–3 kCHF.
- **V1 → V2.**
  - Change : la feuille est **gelée** (plus de perforation en V2), le compteur reste figé à la valeur de fin de résidence, et TD rejoue la séquence.
  - Reste : feuille, journal.
  - Réserve : journal détaillé par molécule.

### C09 — Gardien de cloche · **P3** (risqué, signature)

- **Geste.** Le résident demande l'ouverture d'une cloche depuis une console. Un bras robotique ne la soulève **que si** trois conditions sont réunies :
  - un blanc lié de moins de X min existe (C02) ;
  - l'extraction est confirmée par un capteur de débit ;
  - `public_present=false`.

  Sinon, le refus est journalisé avec `source=safety_interlock`, ce qui produit une **contradiction entre la demande humaine et le verrou**. L'ouverture photographie le joint (empreinte avant/après). À la fermeture, la cloche est **purgée jusqu'au retour à la ligne de base**, et la durée de purge est la donnée principale : « diffuser est facile, arrêter est difficile ».
- **Objet physique.** 3 à 6 cloches sur socles instrumentés, bras collaboratif, caméra fixe, extraction locale, enceinte verrouillée.
- **Capteurs / actionneurs.** PID (ppb, relatif), SCD41, SPS30, débitmètre d'extraction, cellules de charge, caméra. Bras, ventilateurs ou registre, ventouse électromagnétique, imprimante.
- **Donnée produite.** `interlock_decisions[]` (avec `source`), `open_ts` / `close_ts`, `pid_curve` (`voc_ref_compound` déclaré), `purge_duration_s` (critère : ligne de base ±10 %, N6), `seal_photo_sha256` avant/après, `mass_before_g` / `mass_after_g` (Phase 1), `public_present`.
  Types : **preuve**, **incertitude** (PID relatif), **temporalité** (purge), **absence** (blanc), **contradiction** (demande ≠ verrou).
- **Ancrage dépôt.**
  - [F] Analyse plateforme (séparation labo / expo, purge comme problème artistique) ; `laboratoire` (`maxTemperature`, `stock`) ; protocoles (brume ajournée).
  - [F-Notion] N6 : `actuator_event.source`, `safety_event`, `purge_criterion`, contrainte `public_present`.
- **Rendu.** V2 : le bras **rejoue exactement les `actuator_event` de V1 avec des cloches vides** (« rejeu sans matière »). TD montre la courbe PID et la purge V1 à côté du PID **mesuré en direct dans la salle**, qui reste plat : le public voit que rien n'est émis maintenant.
- **Pourquoi PERFUMUM-native.** La séparation « le laboratoire observe, l'exposition montre les archives » devient un objet. Le robot est un **lecteur de partition** (le journal), pas un performeur.
- **Anti-ornement.** Un robot qui soulève du verre est un spectacle. ✔ **seulement si** le bras est piloté exclusivement par des lignes `actuator_event` V1 et si chaque rejeu crée un run `replay_of`. Toute improvisation fait échouer le concept.
- **Variantes olfactives.**
  - **Phase 0** : cloches vides ou contenant des objets inertes ; on teste les verrous, la logique de purge et le rejeu.
  - **Phase 1** (privé contrôlé) : matières du `laboratoire`, **non chauffées**, ouvertes par le résident seul, en local ventilé, avec SDS et IFRA et une personne compétente désignée.
  - **Hors scope sans validation :** chauffe, pyrolyse, combustion, nébulisation, présence du public, toute quantification d'« odeur ».
- **Risques.**
  - Sécurité : appréciation des risques du robot collaboratif **[H]** (normes robotiques à vérifier), bris de verre.
  - Technique : étalonnage du PID ; mémoire d'adsorption des cloches (contamination croisée, à documenter comme donnée).
  - Épistémique : PID lu comme une intensité d'odeur (cartel obligatoire).
  - Juridique : assurance, sécurité au travail.
- **Test minimal 2 h** (sans robot). Un servo soulève un couvercle léger en acrylique, ou on le soulève à la main avec un contact reed. Verrou implémenté dans le logger : refus s'il n'y a pas de blanc de moins de 10 min. SCD41 + BME688. **Résultat attendu :** refus journalisés `safety_interlock`, acceptation après un blanc, et chaque `actuator_event` rejouable par le servo à l'identique.
- **Coût et logistique [H].** 15–60 kCHF. Logistique lourde : formation, maintenance, assurance.
- **V1 → V2.**
  - Change : la matière est retirée ; le bras rejoue.
  - Reste : journaux, photos de scellés, courbes de purge.
  - Réserve : identités des lots Phase 1, PID brut.

### C10 — Archive qui respire · **P3** (risqué, signature)

- **Geste.** Le résident dépose des matières de terrain dans des bocaux instrumentés **scellés pour toute la résidence**. L'échantillonnage est **discret** (toutes les 5 à 60 min, N6) ; un bocal reste vide et sert de blanc. Le seul geste ultérieur possible est l'**ouverture finale**, une purge irréversible.
- **Objet physique.** Étagère de 6 à 12 bocaux sur cellules de charge, capteurs dans les couvercles (évents filtrés), alimentation secourue.
- **Capteurs / actionneurs.** HX711 et cellules, SCD41 (**autocalibration désactivée**, sinon elle dérive en milieu clos), BME688, T/HR ; caméra intervallomètre (moisissures, condensation). Pas d'actionneur hormis l'éclairage de la prise de vue.
- **Donnée produite.** `sampling_interval_s`, séries de `mass_g` / `co2_ppm` / `rh_pct` / `voc_index` par bocal, `blank_jar_id`, `calibration_runs`, événements `condensation` / `mold_observed` (annotation + photo hachée), `final_opening` (purge).
  Types : **temporalité** (mois), **incertitude** (dérive longue, attribution biologie vs température), **absence** (bocal blanc), **provenance** (lot / archive terrain).
- **Ancrage dépôt.**
  - [F] `field_archives` (`materialOrigin`, `materialState`) ; `extraction_tests` (J1 / J7) ; `recettes.maturationTime` ; routeur `resin-maturation` (transformations **déclarées** « 6 mois, UV », jamais mesurées) ; `seasonal-variations.json` (plages sans source).
  - [F-Notion] N6 : régimes longs, `sampling_mode=discret`, table `culture`.
- **Rendu.** TD : mur lent où une colonne de pixels correspond à un intervalle et où la largeur de l'image est la durée de la résidence. Identifiants par bocal. V2 : bocaux scellés et journaux.
- **Pourquoi PERFUMUM-native.** Il oppose les **transformations déclarées** dans la base (maturation) aux **transformations observées**, et fait du temps long le médium.
- **Anti-ornement.** Sans run, ce sont des bocaux décoratifs. L'œuvre est la courbe comparée au blanc. ✔
- **Variantes olfactives.**
  - **Phase 0** : matières sans odorant ajouté, restant **scellées** (aucune émission volontaire).
  - **Phase 1** : maturation ou fermentation contrôlée privée (N6 `culture`) avec une personne compétente.
  - **Hors scope sans validation :** inoculation, ouverture en public, prélèvements sans droits (accès et partage des avantages / Nagoya, CITES).
- **Risques.**
  - Sécurité biologique : moisissures ; **montée en pression d'un bocal hermétique**, qui peut le faire éclater (d'où des évents filtrés, avec une perte de masse qui inclut alors les gaz).
  - Technique : dérive des capteurs sur plusieurs mois, continuité électrique.
  - Juridique : provenance et droits des prélèvements.
- **Test minimal 2 h.** 2 bocaux (un vide, un avec de l'écorce sèche ou du papier) ; HX711 + SCD41 (autocalibration désactivée) ; échantillonnage accéléré à 60 s pendant 2 h. **Résultat attendu :** deux courbes, et très probablement **aucune différence hors incertitude en 2 h**. Ce résultat de non-détection est légitime et doit être journalisé comme tel.
- **Coût et logistique [H].** 1–5 kCHF. Durée de plusieurs mois, onduleur, entretien.
- **V1 → V2.**
  - Change : bocaux exposés scellés. Mesures arrêtées, **ou** poursuivies comme runs explicitement V2 (à décider).
  - Reste : séries V1.
  - Réserve : ouverture finale et contenus.

### 4.11 Pistes rejetées au test « retire le run »

| Piste | Motif du rejet |
|---|---|
| Champ de particules du prototype C seul | Reste séduisant sans journal ; le dépôt le note déjà (« effet décoratif »). À garder uniquement adossé à un run (C01, C04). |
| Radar 6 axes en LED ou projection | Assertions perceptives non vérifiées (100 % remplies) : décoratif **et** trompeur. |
| Brume, fumée, diffusion « pour l'ambiance » | Hors scope sécurité (protocoles du dépôt) et décoratif par nature. |
| Carte d'odeur de la salle au PID ou MOS | Pas une mesure d'odeur (analyse plateforme). |
| Chromatogrammes `p5data.gcms` animés | Non reproductibles (`Math.random`) ; utilisables seulement comme contre-exemple étiqueté « simulé ». |

---

## 5. Stack MVP recommandée (sans sur-ingénierie) [H]

1. **Matériel minimal :** l'Arduino possédé (ou un Teensy 4.0) + **SCD41** (CO₂/T/HR) + **cellule de charge HX711** + **solénoïde ou LED** (actionneur) + le **Makey Makey** possédé pour les gestes. Une **imprimante thermique ESC/POS** est pilotée par le PC, après écriture.
2. **Protocole d'événement :** le MCU émet `{"t_ms":…,"seq":…,"ch":"co2_ppm","v":…,"q":"ok"}` par ligne. Le logger ajoute `run_id`, `ts_utc`, `tz_local`, `prev_hash`, `hash = sha256(prev_hash + JSON canonique de la ligne)`. Format **NDJSON add-only** ; fichier ouvert en ajout et `fsync` à chaque ligne.
3. **Logger local unique (Python, environ 150 lignes) :**
   - En-tête de run : `run_type`, `concept`, `operator`, `space`, `source_export` + `sha256`, empreinte du firmware.
   - Ligne de clôture avec l'empreinte finale. Le fichier clos passe ensuite en **lecture seule (444)**, puis il est copié sur un second support.
   - Corrections uniquement sous forme de lignes `annotation` qui référencent `run_id#seq`, jamais d'édition.
4. **Écrire, puis agir :** l'actionneur, l'imprimante et l'OSC vers TD ne partent qu'après `fsync`, avec le `seq` comme accusé de réception.
5. **Patch TouchDesigner, un mur :**
   - Entrée directe par OSC In DAT ; rejeu par Folder DAT + File In DAT + Script DAT.
   - Une horloge de run unique ; badge `LIVE` / `REJEU` ; cartel des pointeurs (`run_id#seq`, empreinte courte, `source_export`).
   - Démarrage en mode Perform, état dégradé visible plutôt qu'un écran noir.
6. **Versioning et instantanés :**
   - Code et firmware sous git.
   - `runs/` add-only + `MANIFEST.sha256` quotidien.
   - Exports de la base **datés et hachés** (convention *Fleur Fantôme*), jamais de lecture directe de TiDB pendant une séance.
   - Photos de tickets et de scellés hachées : le papier thermique s'efface, le NDJSON fait référence.
7. **Bridges minimaux vers l'existant :**
   - Convertisseur des CSV `shared.js` (7 colonnes) et `04-thermique` (5 colonnes) vers NDJSON, avec signalement du `source_export` manquant.
   - Une route locale « append » pour les pages `deliverables/`.
   - Champs alignés sur N6 (identifiants, `run_type`, `run_link`).
   - Plus tard, chargement en SQLite (P1 N6 ; `better-sqlite3` est déjà en devDependencies).
8. **Hygiène préalable** (hors refonte) : retirer `scripts/` du `.gitignore` ou déplacer les scripts ; purger ou masquer `command` dans `.manus/db` avant tout usage artistique ; trancher l'énumération `evidence_level` entre N5 et N6.

---

## 6. Questions bloquantes

### Sept questions pour Théo

1. **Salle(s).** Le LAB (V1) et l'installation (V2) partagent-ils le même lieu ? Il faut connaître les dimensions, le noir possible, le renouvellement d'air (ventilation documentée ?), la puissance électrique disponible, les murs projetables et la possibilité de fixer du matériel (bras, rails, vitrine).
2. **Données en direct ou en instantané.** V1 et V2 peuvent-ils interroger la base de production, ou **seulement des exports datés** (pratique actuelle du dépôt) ? Qui peut produire les exports par entité (169 groupes CAS via `exportCasEvidence`, molécules sans profil), qui exigent un accès administrateur ?
3. **Olfactif et sécurité.** Une Phase 1 (odorant privé contrôlé) est-elle envisagée pendant la résidence ? Si oui : qui est la personne compétente ou le laboratoire partenaire, quelles SDS et quelles règles du lieu (incendie, détection de fumée, extraction) ? À défaut, tout reste en Phase 0.
4. **Matériel et licences.** Peux-tu confirmer les modèles exacts du matériel annoncé (beamer : lumens et résolution ; Arduino ; capteur de distance ; Makey Makey ; Revopoint ; Seek) ? Disposes-tu d'une licence TouchDesigner Commercial ou Pro (la Non-Commercial est limitée en résolution) et de quel GPU ?
5. **Temporalité et exploitation.** Quelles sont les durées de la résidence et de l'exposition ? Qui redémarre, contrôle et entretient chaque jour en V2 (imprimantes, papier, recalibrage) ?
6. **Données personnelles.** En V1, peut-on enregistrer la voix ou l'image du résident (flux marge de C07) ? En V2, les gestes du public peuvent-ils être journalisés comme runs anonymes (sans identité, sans image), et avec quelle durée de conservation ?
7. **Exposition des fragilités et propriété des runs.** Accepte-t-on de montrer publiquement les conflits CAS, les liens orphelins et les purges de `.manus/db` (risque réputationnel, identifiants d'infrastructure) ? Où vivront les runs après la résidence (dépôt privé, Zenodo, autre) et sous quelle licence ?

### Deux questions obligatoires

- **Le LAB (V1) est-il opéré par le résident seulement, ou le public peut-il manipuler ?**
- **En V2, veut-on un rejeu primaire : (a) temporel, (b) contradiction, (c) preuve ? (en choisir un seul)**

---

## Annexe — Sources lues

- **Dépôt [F] :**
  - `README.md`, `package.json`, `.gitignore`, `.github/workflows/main.yml`
  - `tools/physical-tests/**`, `deliverables/essais-physiques-autonomes/**`, `server/physical-tests.test.ts`
  - `server/_core/websocket.ts`, `server/_core/index.ts`, `server/routers/p5data.ts`, `server/routers/data-quality-remediation.ts`, `server/routers/resin-maturation.ts`, `server/data/plant-molecule-evidence-lot-1.ts`
  - `drizzle/schema-modules/{data-quality-remediation,olfactory-term-pilot,field-archives,olfactive-archives,ghost-varieties,installations,laboratoire,misc,recettes,shadow-tables}.ts`
  - `docs/research/2026-09-*` (analyse plateforme, carte d'exploitabilité, raccordements, protocoles, dossier opérationnel, hypothèses première et seconde passe, portefeuille, cartographie Notion, complétude)
  - `docs/audits/2026-08-23-audit-qualite-donnees.md`, `docs/audits/2026-09-bilan-remediation-controlee.md`
  - `docs/prompts/prompt-agent-experimentations-materielles-perfumum.md`
  - `docs/data/*`, `.manus/db/*` (comptage et classification exécutés le 2 octobre 2026)
- **Notion [F-Notion] :** *Schéma de base de données — olfactory event log (v1)* (modifiée le 28/08/2026) ; *PERFUMUM — Evidence & Provenance Model* (modifiée le 29/08/2026).
