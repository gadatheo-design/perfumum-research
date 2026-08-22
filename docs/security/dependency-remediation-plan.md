# Plan de remédiation des dépendances — PERFUMUM

## État au 22 août 2026

L’audit de production compte **3 vulnérabilités critiques, 27 hautes et 55 modérées**. Le correctif non majeur disponible pour `nanoid` a été appliqué en version `5.1.16`. Les alertes restantes proviennent principalement de chaînes autour de `axios`, `mermaid`, `react-force-graph`, `jspdf`, `ws` et de dépendances transitives.

> Aucun changement majeur de dépendance ne doit être appliqué directement sur `main`. Chaque famille doit être évaluée dans une branche de sécurité, avec tests fonctionnels ciblés et validation CI.

## Ordre de traitement

| Lot | Dépendances | Risque de rupture | Validation exigée |
|---|---|---:|---|
| A | Résolutions transitives compatibles : `path-to-regexp`, `qs`, `lodash`, `ws`, `uuid` | Faible à moyen | `pnpm test`, `pnpm check`, audit production. |
| B | `axios` et ses sous-dépendances | Moyen | Tests des enrichissements externes, redirections HTTP, authentification API et imports. |
| C | `streamdown` / `mermaid` | Moyen à élevé | Rendu des notes, markdown, graphes Mermaid et absence d’injection HTML. |
| D | `react-force-graph` et sa chaîne 3D | Élevé | Pages Knowledge Graph, graphes D3/3D, chargement mobile et bundle. |
| E | `jspdf` | Moyen | Export PDF des fiches plantes, molécules, recettes et bibliographie. |

## Protocole pour chaque lot

1. Créer une branche `security/dependency-<lot>` depuis le dernier checkpoint stable.
2. Mettre à jour exclusivement les paquets du lot, sans `--latest` global.
3. Lire le diff du lockfile et vérifier les versions de transitives réellement résolues.
4. Exécuter `pnpm check`, `pnpm test` et `pnpm audit --prod`.
5. Tester les parcours fonctionnels propres au lot dans l’aperçu et en CI GitHub.
6. Comparer le nombre d’alertes avant/après, puis documenter les alertes sans correctif disponible.

## Règles de décision

- Une mise à jour qui supprime une vulnérabilité critique mais casse un enrichissement est **refusée** jusqu’à correction fonctionnelle.
- Les dépendances 3D, PDF et markdown sont isolées par domaine afin que leur mise à niveau reste réversible.
- Les alertes seulement transitives ne justifient pas une mise à niveau majeure du framework React ou Express sans analyse dédiée.
- Les dépendances sans version corrigée sont surveillées ; réduire leur surface d’exposition est préférable à une migration précipitée.
