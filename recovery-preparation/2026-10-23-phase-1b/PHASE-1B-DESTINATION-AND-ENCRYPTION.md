# Destination et chiffrement — Phase 1B

## Condition préalable

**Aucune destination contrôlée par le propriétaire n’est actuellement désignée.** Aucun export complet ne doit démarrer avant la décision ci-dessous. Un lien Manus temporaire est utile pour livrer un artefact, mais ne constitue pas à lui seul une destination pérenne de récupération.

## Destination recommandée

La destination primaire recommandée est un support ou stockage chiffré contrôlé directement par le propriétaire, avec :

- droit de téléchargement indépendant de Manus ;
- propriétaire et responsable de récupération identifiés ;
- capacité de stockage et politique de rétention documentées ;
- chiffrement au repos contrôlé par le propriétaire ;
- une clé **publique** GPG fournie et validée hors bande ;
- une copie secondaire hors de l’environnement d’exécution, également chiffrée.

Aucun secret, mot de passe, clé privée, URL présignée durable ou jeton ne doit être écrit dans l’archive, dans Git, dans un script ou dans les rapports.

## Estimation de capacité

| Élément | Estimation connue | Hypothèse / limite |
|---|---:|---|
| Tables TiDB, données + index | 24,089 Mio | Estimation `information_schema`, non taille de dump. |
| Bundle Git actuel | 77,6 Mio | Mesuré dans Recovery Proof v0.1. |
| Exports multi-format SQL + CSV + JSONL + métadonnées | 75 à 200 Mio | Estimation prudente : duplication des formats, JSON et échappements. À vérifier par préflight sur un échantillon représentatif. |
| Binaires médias connus | au moins 32,573 Mio | 49 tailles déclarées seulement sur 1 809 références ; 1 760 tailles inconnues. |
| Paquet chiffré initial sans médias binaires | prévoir 0,5 Gio | Marge opérationnelle large, non une promesse de taille finale. |
| Paquet avec tous les médias autorisés | indéterminé | Impossible à estimer sans accès, tailles et droits par objet. |
| Espace temporaire d’export | au moins 2× la taille du paquet clair | Fichiers temporaires + archive + chiffrement. À augmenter si multi-format. |

## Procédure de sécurisation

1. Le propriétaire fournit **une empreinte de clé publique GPG**, pas une clé privée ni un mot de passe.
2. L’export prépare un staging local privé (`umask 077`, répertoire 700, absence de symlink, propriétaire vérifié).
3. Chaque artefact reçoit SHA-256 ; le manifeste contient la date, le snapshot `T`, le périmètre, les exclusions, les comptes et les hashes.
4. Le paquet final est chiffré pour la clé publique validée, puis seul le chiffré, son hash et la méthode de récupération sont transférés à la destination approuvée.
5. Le staging clair est supprimé selon la politique validée, sans prétendre à une suppression sécurisée qui n’aurait pas été vérifiée.
6. Une restauration isolée vérifie le ciphertext après téléchargement avec hash, déchiffrement local propriétaire et contrôle du manifeste.

## Contrôle d’accès et données protégées

Les 67 tables repérées comme potentiellement personnelles et les 25 potentiellement privées ne doivent pas être archivées en clair. Les 113 tables `à vérifier` incluent du JSON ou texte libre : elles requièrent un périmètre explicite avant diffusion. Les assets restent distincts des données relationnelles et ne sont pas copiés avant décision sur l’accès Forge et les droits de redistribution.

## Procédure si Manus devient indisponible

Le propriétaire télécharge le paquet chiffré vers sa destination contrôlée, vérifie SHA-256, déchiffre localement avec sa clé privée, consulte `MANIFEST`, restaure le DDL puis les données dans une base isolée, et emploie le bundle Git pour reconstruire le code. Cette procédure ne peut être qualifiée de prête qu’après réception de la destination et de la clé publique de récupération.
