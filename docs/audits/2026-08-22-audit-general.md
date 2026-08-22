# Audit général PERFUMUM — 22 août 2026

## Objet et méthode

Cet audit couvre la stabilité applicative, la dette TypeScript, l’architecture, la sécurité des dépendances, la cohérence des données et l’expérience des fiches plantes et molécules. Il s’appuie sur la compilation TypeScript, la suite Vitest, la consultation de la base MySQL, les journaux de développement, l’analyse des dépendances de production et une revue visuelle des pages d’accueil, molécule et plante.

> La priorité pour un projet de recherche conçu sur dix ans est de préserver la traçabilité et la qualité des données avant d’ajouter des interfaces ou des sources supplémentaires.

## État constaté

| Domaine | Constat | Évaluation |
|---|---|---|
| Tests | 131 fichiers de test passent, soit 1 903 tests réussis et 2 ignorés. | Base de régression solide. |
| TypeScript | Le contrôle `pnpm check` est vert. Six directives `@ts-nocheck` ont été retirées sans régression. | Dette encore importante : 215 fichiers portent encore une directive. |
| Architecture | 43 714 lignes sont concentrées dans les routeurs ; `research.ts` atteint 2 284 lignes et `sparql.ts` 1 661. | Risque de régressions et de conflits croissant. |
| Données plantes | 3 782 plantes, toutes avec nom latin ; 4 QIDs Wikidata et 23 IDs GBIF restent manquants. | Couverture référentielle très bonne. |
| Données molécules | 7 501 molécules ; 3 330 CAS et 2 881 InChI manquent ; seulement 41 QIDs Wikidata manquent. | Priorité majeure d’enrichissement chimique. |
| Bibliographie | 1 499 références ; 576 années et 1 208 DOI manquent. | Normalisation bibliographique nécessaire. |
| Intégrité | Deux liens descripteur→plante et deux liens descripteur→molécule sont orphelins. | Correction simple et prioritaire. |
| Sécurité applicative | Les protections de mutations tRPC et l’usage du pool MySQL sont couverts par tests. | Socle nettement amélioré. |
| Dépendances | `pnpm audit --prod` signale 3 vulnérabilités critiques, 26 hautes et 54 modérées dans 863 dépendances de production après les correctifs nanoid, ws, qs et path-to-regexp. | Action de sécurité prioritaire. |
| CI | TypeScript et build passent sur GitHub ; les tests d’intégration attendent un secret `CI_DATABASE_URL`. | Contrôle distant incomplet. |

## Correctif inclus dans cette itération

La procédure `research.getTransformationsByMolecule` traitait une ligne SQL comme un tableau de lignes, ce qui provoquait l’erreur `Cannot read properties of undefined (reading 'length')` sur certaines fiches molécules. Le résultat est maintenant normalisé en tableau avant le calcul des statistiques. Le test `server/research-transformations.test.ts` verrouille ce comportement.

Le routeur `descriptor-links` et les déclarations Drizzle associées ont également été réalignés sur les colonnes MySQL réelles (`descriptor_id`, `plant_id`, `molecule_id`, `force_level` et métadonnées archivées). Les mutations refusent désormais explicitement les plantes et molécules absentes avant l’insertion. Un rapport tRPC de liens orphelins reste disponible pour la revue administrative, sans suppression automatique de données.

## Priorités de mise en œuvre

### Priorité P0 — Sécurité, intégrité et reproductibilité

| Action | Justification | Résultat attendu |
|---|---|---|
| Mettre à niveau les dépendances vulnérables dans une branche dédiée. | L’audit de production contient 3 alertes critiques et 28 alertes hautes, notamment dans des chaînes `axios`, `express/path-to-regexp`, `ws`, `mermaid` et `react-force-graph`. | Lockfile assaini, tests et build verts après chaque groupe de mises à niveau. |
| Définir `CI_DATABASE_URL` vers une base MySQL exclusivement réservée aux tests. | Le CI ignore actuellement les tests d’intégration quand ce secret est absent. | Tests tRPC et SQL exécutés à chaque pull request sans toucher aux données de recherche. |
| Réparer les quatre liens de descripteurs orphelins. | Les associations incomplètes affaiblissent la navigation hypertextuelle. | Suppression ou résolution documentée des liens invalides, avec contrôle d’intégrité automatisé. |
| Ajouter un budget de temps et une journalisation structurée aux appels externes. | Wikidata, GBIF, Europeana et OpenAlex conditionnent la fiabilité des enrichissements. | Erreurs traçables, timeouts explicites, indicateurs de couverture par source. |

### Priorité P1 — Maintenabilité dans les 30 prochains jours

| Action | Cible | Stratégie |
|---|---|---|
| Découper les routeurs les plus longs. | `research.ts`, `sparql.ts`, `resin-maturation.ts`, `bibliography.ts`. | Extraire par sous-domaines et ajouter un test de contrat par routeur extrait. |
| Continuer la réduction de `@ts-nocheck`. | 170 pages, 42 composants, 3 utilitaires/hooks. | Lots de 5 à 10 fichiers compacts, compilation et Vitest après chaque lot ; commencer par les composants sans accès réseau ni base. |
| Définir des contrats de réponse pour les enrichissements. | PubChem, Wikidata, GBIF, Europeana, OpenAlex. | Schémas Zod versionnés et états `source`, `updatedAt`, `confidence`, `error`. |
| Isoler les pages de détail volumineuses. | `PlantDetail.tsx` (2 478 lignes), `MoleculeDetail.tsx` (2 131 lignes), `RecetteDetail.tsx` (1 707 lignes). | Un onglet = un composant typé, avec chargement et erreur locaux. |

### Priorité P2 — Qualité des données pour l’équipe de recherche

| Ensemble | Lacune | Mode d’implémentation conseillé |
|---|---|---|
| Molécules | CAS et InChI manquants. | Batch PubChem avec aperçu, provenance, date, taux de confiance et validation humaine pour les correspondances ambiguës. |
| Bibliographie | Années et DOI manquants. | Normalisation par DOI/Crossref/OpenAlex, puis file de revue manuelle pour les références anciennes. |
| Plantes | IDs GBIF/Wikidata manquants. | Suggestions automatiques à partir du nom latin, validées en lot par un administrateur. |
| Descripteurs | Liens orphelins et associations ambiguës. | Tableau de revue avec entité source, score, motif de l’erreur et correction assistée. |

Chaque entité doit conserver une représentation JSON structurée, sa provenance, la date de vérification et un statut de validation. Cette règle permettra les exports, les comparaisons, les filtres et les futurs traitements IA sans perte de contexte.

### Priorité P3 — Expérience et identité visuelle

La revue visuelle confirme une base claire et cohérente, mais encore proche d’un tableau de bord générique. Les détails moléculaires rendent déjà les données utiles ; les onglets sont toutefois très denses à largeur bureau. La fiche plante affichait un état de chargement prolongé dans la capture d’audit : il faut distinguer visuellement chargement, absence de données et erreur de requête.

Les évolutions recommandées sont les suivantes :

1. Adopter une direction « archive de recherche olfactive » : papier chaud, encre profonde, bleu scientifique, vert botanique et ambre uniquement comme accents sémantiques.
2. Regrouper les onglets de détail sous des catégories stables : **Identification**, **Olfaction**, **Science**, **Relations**, **Sources**. Conserver un accès direct aux sous-onglets sur mobile par un sélecteur.
3. Donner aux fiches l’apparence de dossiers scientifiques : métadonnées mono ou serif technique, traces chromatographiques, planches botaniques et références archivistiques.
4. Mettre en place un composant d’état asynchrone commun : squelette limité dans le temps, message d’erreur actionnable, bouton de relance et trace technique réservée à l’administration.

## Indicateurs de pilotage trimestriels

| Indicateur | Objectif initial |
|---|---|
| Directives `@ts-nocheck` | Réduire de 10 % par trimestre sans régression. |
| Molécules avec CAS + InChI | Dépasser 80 % de couverture. |
| Références avec année + DOI | Dépasser 70 % de couverture pour les références modernes. |
| Liens orphelins | Zéro lien non résolu. |
| Tests CI avec base isolée | 100 % des pull requests. |
| Vulnérabilités critiques de production | Zéro. |

## Preuves et commandes utilisées

- `pnpm test -- --reporter=dot`
- `pnpm check`
- `pnpm audit --prod --json`
- contrôles SQL de couverture et d’intégrité sur MySQL
- revue visuelle de `/`, `/molecules/30002` et `/plants/2`

Ce document est un plan de travail : chaque évolution importante doit être menée dans une branche, accompagnée de tests et d’un checkpoint restaurable.
