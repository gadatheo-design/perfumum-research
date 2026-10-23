# Code Exit Test — Recovery Proof v0.1

**Résultat : RÉUSSI POUR LE CLONAGE ET LE BUILD**  
**Révision obtenue : `7213aaf2a3bf1e1c67e574272a3282359a68a65e`**

## Exécution effective

Le fichier `perfumum-research.bundle` a été cloné dans un répertoire temporaire hors du dépôt de travail avec :

```bash
git clone perfumum-research.bundle restored
```

Le clone a résolu la révision attendue. Les dépendances ont été installées depuis `pnpm-lock.yaml` au moyen de :

```bash
CI=1 pnpm install --frozen-lockfile --ignore-scripts
```

Le build a ensuite été exécuté avec succès :

```bash
pnpm build
```

La construction Vite a terminé sans erreur. Le serveur compilé a été produit (`dist/index.js`, environ 2,9 Mo) et les assets publics ont été générés. La sortie textuelle complète est dans `BUNDLE-CLONE-TEST.txt`.

## Limites explicitement maintenues

Le test atteste de la portabilité du code et de sa compilation ; il n’atteste pas du fonctionnement complet hors Manus. Le bundle ne contient ni `.env`, ni secrets, ni cookies, ni jetons, ni objets Forge. Les composants suivants restent à remplacer, configurer ou désactiver pour exécuter réellement l’application ailleurs :

- authentification OAuth Manus et sessions associées ;
- stockage et uploads Forge ;
- LLM, Data API, génération d’images, transcription et notifications Forge ;
- proxy de cartes ;
- configuration de déploiement et runtime Vite spécifiques à Manus ;
- une base MySQL/TiDB restaurée au-delà du sous-corpus de preuve.

Ainsi, « le code peut sortir de Manus » est établi au niveau du versionnement, de l’installation et du build. « L’application entière peut opérer hors Manus » n’est pas encore établi et ne doit pas être inféré de ce test.
