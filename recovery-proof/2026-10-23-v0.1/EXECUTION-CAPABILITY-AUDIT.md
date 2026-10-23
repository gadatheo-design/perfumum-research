# Audit d’exécution — capacités de récupération réellement testées

**Date : 23 octobre 2026**  
**Portée : constat opérationnel, non stratégie générale.**

| Élément | Accessible maintenant ? | Exportable maintenant ? | Format possible | Téléchargeable hors Manus ? | Permission supplémentaire ? |
|---|---|---|---|---|---|
| Dépôt Git | **Vérifié et possible** — clone local et historique présents | **Vérifié et possible** — bundle créé et vérifié | Git bundle, archive Git | **Oui** — fichier ordinaire, inclus dans ZIP | Non |
| Commit actuel | **Vérifié et possible** | **Vérifié et possible** | SHA-1 Git, texte | **Oui** — `GIT-COMMIT.txt` | Non |
| Lockfile | **Vérifié et possible** | **Vérifié et possible** | YAML | **Oui** — copié dans le kit | Non |
| Code source | **Vérifié et possible** | **Vérifié et possible** — bundle cloné hors dépôt et build exécuté | Git bundle ; fichiers TypeScript | **Oui** — bundle et ZIP | Non |
| Schéma réel TiDB | **Vérifié et possible** — 293 tables, 4 169 colonnes, 558 contraintes observées | **Vérifié et possible pour DDL ciblé et inventaire complet** | SQL `SHOW CREATE TABLE`, CSV information_schema | **Oui** — DDL de 7 tables et inventaire inclus | Non |
| Données TiDB | **Vérifié et possible** — lecture SQL réussie | **Vérifié et possible pour le micro-corpus seulement** | SQL, CSV, JSONL | **Oui** — 21 lignes incluses | Non pour le micro-corpus ; permission de propriétaire à confirmer avant export global |
| Dump SQL intégral | **Non vérifié** — aucun dump global tenté | **Possible mais permission requise** | SQL compatible TiDB/MySQL | **Non démontré** | Oui — validation explicite d’un export global et de sa destination chiffrée |
| CSV par table | **Vérifié et possible pour 7 tables sélectionnées** | **Vérifié et possible pour le micro-corpus** | CSV UTF-8 | **Oui** — inclus dans ZIP | Non pour le micro-corpus ; permission requise avant 293 tables |
| JSONL | **Vérifié et possible pour 7 tables sélectionnées** | **Vérifié et possible pour le micro-corpus** | JSON Lines UTF-8 | **Oui** — inclus dans ZIP | Non pour le micro-corpus ; permission requise avant 293 tables |
| Assets / images | **Vérifié partiellement** — 32 références dans `variety_images`, toutes avec clé, URL, taille et source déclarées | **Vérifié et possible seulement comme inventaire de références** | CSV | **Oui** — inventaire inclus ; **binaire non démontré** | Oui — permission/droit de copie et accès Forge pour une récupération des binaires |
| Stockage Forge | **Vérifié dans le code comme dépendance** | **Non vérifié pour une extraction d’objets** | URLs signées/objets, selon API | **Non démontré** | Oui — accès propriétaire/autorisation de stockage et revue des droits |
| Notion | **Possible mais permission requise** — l’espace autorisé a été consulté précédemment, sans export dans ce kit | Markdown/HTML/PDF/CSV selon l’export Notion autorisé | **Non démontré dans ce micro-test** | Oui — accès de partage/export et décision de périmètre nécessaires |
| Documentation versionnée | **Vérifié et possible** | **Vérifié et possible** — incluse dans Git bundle | Markdown, PDF/CSV versionnés | **Oui** — bundle et archive | Non |
| Configuration non secrète | **Vérifié et possible** | **Vérifié et possible** — fichiers de config et `.env.example` créés | JSON, YAML, TypeScript, texte | **Oui** — inclus dans ZIP | Non |

## Éléments de catégorie C — présents seulement comme état interne ou dépendance Manus

- secrets, jetons, cookies et sessions : exclus volontairement et non exportables comme artefacts sûrs ; ils doivent être recréés ;
- contenu complet de TiDB : non encore extrait, donc encore dépendant de l’accès plateforme actuel ;
- objets binaires du stockage Forge : références inventoriées, récupération binaire non testée ;
- configuration effective d’hébergement, droits de bucket, OAuth Manus et services Forge ;
- état courant non versionné de l’instance WebDev, hormis ce qui a été extrait dans le bundle et le kit.
