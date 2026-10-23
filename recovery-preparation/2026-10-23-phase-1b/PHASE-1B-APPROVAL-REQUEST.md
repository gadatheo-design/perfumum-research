# Demande d’approbation explicite — passage à l’exécution de l’export complet

## Ce qui est prêt

- matrice exhaustive de 293 tables et manifest de périmètre ;
- inventaire structures, PK/FK/index, Drizzle/migrations, catégories, sensibilités et recommandations ;
- stratégie de snapshot cohérent, formats SQL/CSV/JSONL et reprise après échec ;
- plan de destination, chiffrement et restauration ;
- inventaire de 1 809 références média sans copie binaire ;
- registre des permissions et risques.

## Ce qui manque

1. **Destination contrôlée** : emplacement de réception sous contrôle du propriétaire et capacité d’au moins 1 Gio pour le premier lot sans médias binaires.
2. **Chiffrement** : empreinte d’une clé publique GPG du propriétaire, validée hors bande.
3. **Périmètre sensible** : décision sur les 66 tables marquées « inclure chiffré après approbation », les 133 en « révision humaine », les 67 potentiellement personnelles, les 25 privées et les 113 à vérifier.
4. **Snapshot TiDB** : autorisation d’un préflight lecture seule avec méthode explicite, fenêtre de gel DDL et privilèges de lecture minimale.
5. **Médias** : décision séparée : inventaire seul (déjà fait) ou permission de lecture/copie binaire avec contrôle des droits.

## Approbation demandée — périmètre exact

Le propriétaire doit choisir une seule option :

### Option A — Préflight seulement

Autoriser un test TiDB strictement lecture seule de snapshot cohérent et de compatibilité `mariadb-dump`/exporteur, **sans produire de dump global**, sans médias et sans transfert. Cette option lève uniquement l’incertitude technique du snapshot.

### Option B — Export relationnel complet chiffré, sans binaires médias

Autoriser, après réussite du préflight :

- DDL, 293 tables, 3 vues et métadonnées depuis un unique snapshot TiDB approuvé ;
- SQL + CSV + JSONL + hashes + manifestes ;
- chiffrement pour la clé publique désignée ;
- destination approuvée sous contrôle du propriétaire ;
- restauration complète isolée et rapport PASS/FAIL ;
- **aucune** copie d’objet Forge binaire, aucune synchronisation Notion, aucune modification source.

Cette option exige une décision explicite sur les tables sensibles : les inclure dans le paquet chiffré ou les exclure avec une restauration déclarée incomplète.

### Option C — Médias, en lot séparé

Uniquement après Option B réussie : autoriser l’accès lecture Forge pour les clés approuvées, dans une destination chiffrée, avec inventaire par objet, hash, licence/attribution et point d’arrêt. Aucune suppression ni upload Forge.

## Réponse attendue

Indiquer l’option A, B ou C, la destination contrôlée, l’empreinte de clé publique GPG, et la décision de traitement des tables sensibles. Sans ces éléments, l’état correct est : **préparation terminée ; exécution suspendue**.
