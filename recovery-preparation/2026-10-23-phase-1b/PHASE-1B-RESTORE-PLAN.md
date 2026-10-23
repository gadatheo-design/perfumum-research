# Plan de restauration complet isolé — Phase 1B

## Statut actuel

La restauration déjà exécutée couvre 7 tables et 21 lignes dans MariaDB 10.11.14, sans réseau. **Aucune restauration complète n’a été exécutée et ce document ne l’annonce pas.**

## Cible de test

- MariaDB et/ou MySQL choisi après compatibilité TiDB documentée ; datadir neuf ; socket Unix uniquement ; `--skip-networking` ; base nommée explicitement ; refus de tout écrasement.
- Aucun accès à TiDB de production depuis le processus de restauration.
- Journal horodaté de chaque commande, version d’outil, hash de paquet et résultats PASS/FAIL par objet.

## Ordre et contrôles

1. Vérifier le ciphertext, déchiffrer dans un staging local privé et lancer `sha256sum -c`.
2. Créer la base cible vide et importer le DDL source ou le DDL cible séparé, avec un rapport de transformation TiDB→cible par objet.
3. Restaurer les parents avant les enfants selon les FKs réelles ; conserver les tables sans PK à l’identique ; traiter les cycles seulement par un mécanisme documenté de contraintes temporairement différées/désactivées puis réactivées.
4. Restaurer toutes les tables, y compris vides, puis index, uniques, contraintes et vues. Les 3 vues à considérer sont `molecule_links_unified`, `molecule_notes_view` et `molecule_synergies_view`. Aucun trigger, routine ou événement n’a été trouvé lors de l’inventaire, mais ce contrôle doit être refait sur le snapshot d’exécution.
5. Comparer source et cible : comptes par table, bornes de clés, hash canonique par chunk, valeurs JSON, `NULL`, bigint, decimal, encodage, collations et FKs.
6. Vérifier au minimum les domaines botanique (`plants`/`plant_terroirs`), chimique (`molecules`/`plant_molecules`), bibliographique (`bibliography_entries`/liens), formulation (`recettes` et liens), et les tables sans PK.
7. Produire un rapport final : objets importés, non importés, transformations, divergences, erreurs, restauration reproductible ou non.

## Tables sans clé primaire

Les 25 tables sans PK doivent être chargées dans leur intégralité sans suppression ni dédoublonnage. La vérification combine : nombre de lignes, hash de chunk dans l’ordre déclarée par le manifeste et contrôles relationnels. Une absence de PK interdit de prétendre qu’une reprise par identifiant est possible sans convention explicitement validée.

## Compatibilité TiDB / MariaDB / MySQL

| Objet | Exigence |
|---|---|
| DDL | Conserver `SHOW CREATE TABLE` TiDB comme référence ; toute adaptation vers MariaDB/MySQL est écrite dans un fichier séparé. |
| JSON | Parser/valider et comparer de manière canonique ; ne jamais convertir implicitement un objet en texte. |
| Types et collations | Rapport explicite pour ENUM, JSON, bigint, decimal, timestamp, charset/collation, auto-incrément et index. |
| FKs / cycles | Ordre de chargement déterminé depuis `information_schema`; contrôles anti-jointure après import. |
| Vues | Extraire et recréer séparément après leurs tables sources. |
| Routines / triggers / events | Refaire l’inventaire au snapshot. La préparation actuelle en observe 0, mais elle n’est pas un substitut au contrôle final. |

## Critère de succès

Une restauration complète ne sera déclarée réussie que lorsque chaque objet du périmètre approuvé possède un résultat PASS, ou une exception acceptée et signée dans le manifeste. Un succès partiel doit rester intitulé « restauration partielle du périmètre X ».
