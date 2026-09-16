# PERFUMUM — Audit vivant des liens orphelins, phase 2

**Date de relevé :** 16 septembre 2026  
**Méthode :** requêtes de lecture seule sur les tables de relations et les tables cibles actuelles. Aucune relation, entité scientifique ou décision de file n’a été modifiée.

## Résultat courant

| Relation contrôlée | Liens orphelins courants | Contexte utile conservé | Décision automatique |
|---|---:|---|---|
| Descripteur → plante | 0 | Sans objet | Aucune |
| Descripteur → molécule | 0 | Sans objet | Aucune |
| Plante → terroir | 22 | Terroir cible présent ; plante cible absente | Interdite |

Les **22** liens plante–terroir correspondent tous à une plante absente et un terroir encore présent. Les colonnes archivées des relations (`local_name`, `quality_notes`, `notes`) ne conservent pas de nom de plante exploitable dans cette tranche. L’ancien `plant_id` ne peut pas être utilisé comme clé de rapprochement : il est un identifiant technique périmé et ne porte ni taxon, ni provenance, ni preuve de continuité.

> **Règle de phase 2.** Sans nom, taxon, source, relation historique ou sélection explicite d’un administrateur, PERFUMUM ne propose pas de nouvelle plante cible. Une proposition par proximité numérique d’identifiant serait arbitraire et risquerait d’écrire une relation scientifique fausse.

## Conséquences pour la file de remédiation

La file créée pendant l’audit antérieur peut encore contenir des signaux `descriptor_orphan` devenus obsolètes, car la lecture directe ne détecte plus d’orphelin descripteur. Ces signaux ne sont pas supprimés ni automatiquement « résolus » : leur journal demeure l’historique de l’audit. La page de remédiation affiche désormais l’état vivant, qui prévaut pour décider si une réassociation doit être étudiée.

Pour les 22 liens plante–terroir, la seule proposition admissible à ce stade est une **retenue documentée** : conserver le lien historique dans la file, associer une source primaire ou faire choisir une plante via un sélecteur administrateur, puis exiger une justification et un journal append-only. Aucune suppression automatique n’est justifiée.
