# Risques bloquants — Phase 1B

| Risque | Gravité | État | Condition de levée |
|---|---|---|---|
| Snapshot global non atomique | Bloquant | Aucune méthode TiDB validée | Préflight réussi d’un snapshot explicite et fenêtre de gel DDL confirmée. |
| Destination sous contrôle du propriétaire absente | Bloquant | Non désignée | Chemin/stockage, responsable, rétention et capacité approuvés. |
| Clé publique de chiffrement absente | Bloquant | Non fournie | Empreinte GPG validée hors bande. |
| Périmètre de données personnelles/privées non décidé | Bloquant | 67 potentielles personnelles, 25 privées, 113 à vérifier | Décision table par table et chiffrement obligatoire. |
| Médias Forge non prouvés | Bloquant seulement pour les binaires | Inventaire SQL réalisé, accès/droits non testés | Permission lecture, droit de copie et politique par objet. |
| Divergence TiDB / Drizzle / migrations | Élevé | 293 / 199 / 98 ; 193 intersections | Utiliser DDL réel et matrice ; ne pas migrer ni reconstituer via Drizzle. |
| Tables sans PK | Élevé | 25 tables | Export complet des lignes, chunks ordonnés et absence de dédoublonnage. |
| Types JSON/semi-structurés | Élevé | 85 tables | Validation JSON, règles de `NULL` et hashes canoniques. |
| Compatibilité TiDB → cible | Élevé | Micro-test réussi seulement pour 7 tables | DDL cible séparé, rapport de transformation et restauration complète testée. |
| Vues | Moyen | 3 vues, pas de triggers/routines/events observés lors du sondage | Inclure leur DDL et vérifier leurs dépendances au snapshot final. |
| Droits scientifiques/documentaires | Moyen | Non déductibles de la structure | Préserver provenance/licences et ne pas publier automatiquement. |

## Décision actuelle

La Phase 1B est **prête techniquement**, mais l’export complet est bloqué de façon saine par l’absence de destination approuvée, de clé de chiffrement, de périmètre de données sensibles et de préflight de snapshot TiDB. Aucun de ces blocages ne doit être contourné par une exportation partielle non documentée.
