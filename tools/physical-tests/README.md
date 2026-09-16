# Essais physiques locaux — PERFUMUM

Ces trois pages sont des supports d’atelier en lecture seule. Elles chargent l’export local daté `data/fleur-fantome-2026-09-15.json` et écrivent seulement des CSV téléchargés par l’opérateur. Elles n’appellent ni API de production, ni actionneur, ni dispositif de chauffe, de diffusion ou de combustion.

## Démarrage

```bash
cd /home/ubuntu/perfumum-research
pnpm physical-tests
```

Ouvrir dans Chromium :

| Essai | URL locale |
|---|---|
| A — Graphe anamorphique | `http://localhost:4174/projection-mapping/` |
| B — Graphe de proximité | `http://localhost:4174/arduino-proximity/` |
| C — Champ noir | `http://localhost:4174/dark-field/` |

Le prototype B attend une valeur numérique en centimètres terminée par un retour à la ligne. Si aucun Arduino n’est branché, son curseur de simulation permet de vérifier la logique graphique, sans faire croire à une lecture matérielle.

Voir `docs/research/2026-09-protocoles-essais-physiques.md` pour les étapes de séance, les critères de réussite et les garde-fous.
