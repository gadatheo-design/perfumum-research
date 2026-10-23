# PERFUMUM — Phase 1B : préparation contrôlée de l’export complet

**Statut : préparation terminée ; aucun export complet, aucun téléchargement binaire Forge et aucune mutation de production n’ont été réalisés.**

Cette préparation est fondée sur un inventaire `information_schema` exécuté en lecture seule le 23 octobre 2026 à 13:46:35 UTC sur TiDB `8.0.11-TiDB-v8.5.3-serverless`.

## Résultat vérifié

- **293 tables de base**, 3 vues, 4 143 colonnes et 558 contraintes ;
- **199** tables déclarées par Drizzle, dont **193** correspondent à une table réelle ;
- **98** fichiers de migration SQL ;
- 25 tables sans clé primaire : elles sont toutes préservées telles quelles dans la proposition ;
- taille estimée `data_length + index_length` : **25 259 373 octets** (24,089 Mio), à interpréter comme estimation TiDB et non comme taille du dump ;
- 85 tables comportent au moins une colonne JSON ;
- 1 809 références d’assets candidates dans six tables, sans téléchargement de binaire.

## Livrables

| Fichier | Rôle |
|---|---|
| `inventory/table-recovery-matrix.csv` | Matrice exhaustive des 293 tables : volumétrie estimée, colonnes/types, PK/FK/index, Drizzle, migrations, catégorie proposée, sensibilité, droits et recommandation. |
| `inventory/table-recovery-matrix.json` | Même matrice au format structuré. |
| `PHASE-1B-SCOPE-MANIFEST.json` | Manifest de périmètre proposé, avec décision par table et garde-fous d’approbation. |
| `PHASE-1B-EXPORT-PLAN.md` | Comparaison des formats et protocole de snapshot cohérent à tester avant exécution. |
| `PHASE-1B-DESTINATION-AND-ENCRYPTION.md` | Conditions de destination contrôlée, chiffrement et vérification. |
| `PHASE-1B-RESTORE-PLAN.md` | Procédure de restauration complète à exécuter seulement après export approuvé. |
| `PHASE-1B-MEDIA-INVENTORY-REPORT.md` | État réel des références média, sans copie des binaires. |
| `PHASE-1B-PERMISSIONS-REQUIRED.md` | Permissions et décisions nécessaires avant exécution. |
| `PHASE-1B-SIZE-AND-RESOURCES.md` | Estimations de taille, ressources et incertitudes. |
| `PHASE-1B-BLOCKING-RISKS.md` | Blocages et risques à lever. |
| `PHASE-1B-APPROVAL-REQUEST.md` | Payload précis soumis au propriétaire pour la prochaine décision. |

## Interprétation

La matrice est une **proposition conservatrice de périmètre**, non un classement scientifique définitif. Les catégories et sensibilités sont déduites seulement de la structure, des noms de tables/colonnes, des contraintes et du code local. Toute table à contenu libre/JSON, privée ou potentiellement personnelle reste soumise à revue humaine. L’absence de Drizzle ne justifie jamais une exclusion.

Aucun secret, token, cookie, session, objet Forge binaire ou destination externe n’est présent dans ce répertoire.
