# Déployer PERFUMUM hors de Manus

Ce guide installe PERFUMUM sur deux services :

- **TiDB Cloud Starter** pour la base de données (compatible MySQL), région Francfort ;
- **Render** pour l'application, région Francfort, à partir d'une image Docker déjà construite.

Il s'adresse à une personne qui n'est pas développeur. Chaque étape se fait dans un navigateur, sauf deux commandes à copier dans un terminal (le chargement de la base et, une seule fois, la création de l'empreinte du mot de passe administrateur).

Comptez une à deux heures la première fois.

> **Avant de commencer.** Les écrans de TiDB Cloud et de Render changent régulièrement. Ce guide a été écrit sans pouvoir consulter leur documentation en ligne : les noms de boutons peuvent différer légèrement de ce que vous verrez. Les valeurs à saisir, elles, ne changent pas. Les points à vérifier sur place sont signalés par « À vérifier ».

## Vue d'ensemble

| Élément | Où | Rôle |
|---|---|---|
| Image Docker | GitHub (GHCR) | L'application, construite automatiquement à chaque modification du code |
| Base de données | TiDB Cloud Starter, Francfort | Les données |
| Service web | Render, Francfort | Fait tourner l'image |
| Disque de 1 Go | Render, monté sur `/app/uploads` | Les fichiers envoyés (images) |

Ce qu'il vous faut :

- un compte GitHub ayant accès au dépôt `gadatheo-design/perfumum-research` ;
- un compte TiDB Cloud et un compte Render ;
- un export de la base actuelle (fichier `.sql`) ;
- un ordinateur avec un terminal, le client `mysql` et Node.js 22 (pour les deux commandes).

---

## 1. Créer la base TiDB Cloud Starter

1. Connectez-vous sur <https://tidbcloud.com>.
2. Créez un cluster (« Create Cluster ») :
   - offre : **Starter** ;
   - fournisseur et région : **AWS, Frankfurt (eu-central-1)** — *à vérifier : si Francfort n'est pas proposé pour l'offre Starter, choisissez la région européenne la plus proche et prenez la même côté Render si possible* ;
   - nom : `perfumum`.
3. Une fois le cluster prêt, ouvrez « Connect » :
   - type de point d'accès : **Public** ;
   - « Connect with » : **General** ;
   - cliquez sur « Generate Password » et **notez le mot de passe tout de suite** : il n'est affiché qu'une fois.
4. Relevez les quatre informations affichées :

   | Information | Exemple fictif |
   |---|---|
   | Hôte (host) | `gateway01.eu-central-1.prod.aws.tidbcloud.com` |
   | Port | `4000` |
   | Utilisateur (user) | `3xAmPlEpReFiX.root` |
   | Mot de passe | `MotDePasseFictif123` |

5. Créez la base vide. Dans l'éditeur SQL de TiDB Cloud (« SQL Editor »), exécutez :

   ```sql
   CREATE DATABASE perfumum;
   ```

### Composer `DATABASE_URL`

L'application reçoit ces informations en une seule ligne, sous cette forme :

```
mysql://UTILISATEUR:MOT_DE_PASSE@HOTE:4000/perfumum?ssl={"minVersion":"TLSv1.2","rejectUnauthorized":true}
```

Avec l'exemple fictif ci-dessus :

```
mysql://3xAmPlEpReFiX.root:MotDePasseFictif123@gateway01.eu-central-1.prod.aws.tidbcloud.com:4000/perfumum?ssl={"minVersion":"TLSv1.2","rejectUnauthorized":true}
```

Deux points d'attention :

- la fin `?ssl={…}` est **obligatoire** : TiDB Cloud refuse les connexions non chiffrées sur son point d'accès public ;
- si le mot de passe contient un caractère spécial (`@`, `:`, `/`, `#`, `?`, `%`), générez-en un autre plutôt que d'essayer de l'encoder.

### Charger l'export

Dans un terminal, depuis le dossier qui contient l'export :

```bash
mysql --host gateway01.eu-central-1.prod.aws.tidbcloud.com --port 4000 --user '3xAmPlEpReFiX.root' --password --ssl-mode=VERIFY_IDENTITY --database perfumum < export-perfumum.sql
```

Remplacez l'hôte, l'utilisateur et le nom du fichier par les vôtres. Le mot de passe est demandé au clavier et ne s'affiche pas. Le chargement peut durer plusieurs minutes sans rien afficher.

Vérification, dans l'éditeur SQL de TiDB Cloud :

```sql
USE perfumum;
SELECT COUNT(*) FROM molecules;
SELECT COUNT(*) FROM plants;
```

Les deux nombres doivent correspondre à ceux de la base d'origine.

> Si le chargement échoue sur une instruction que TiDB ne connaît pas, notez le message exact et la ligne : c'est un cas à traiter avec un développeur, pas à contourner.

---

## 2. Préparer les secrets

Trois valeurs sont à fabriquer vous-même. Gardez-les dans un gestionnaire de mots de passe ; elles ne doivent jamais être écrites dans le dépôt.

**`JWT_SECRET`** — une longue chaîne aléatoire qui signe les sessions. Dans un terminal :

```bash
openssl rand -base64 36
```

**`ADMIN_PASSWORD_HASH`** — l'empreinte du mot de passe administrateur (le mot de passe lui-même n'est stocké nulle part). Depuis le dossier du dépôt :

```bash
node deploy/hash-password.mjs
```

Le script demande le mot de passe deux fois et affiche une ligne qui commence par `scrypt$`. Copiez-la en entier.

**`SITE_ACCESS_PASSWORD`** — le mot de passe partagé qui garde le site privé. Choisissez une phrase que vous pourrez communiquer aux personnes invitées. Il est distinct du mot de passe administrateur.

---

## 3. Autoriser Render à lire l'image

L'image est publiée sur le registre de GitHub (GHCR) à l'adresse :

```
ghcr.io/gadatheo-design/perfumum-research
```

Si le dépôt est privé, l'image l'est aussi et Render a besoin d'un jeton pour la télécharger.

1. Sur GitHub : votre photo → **Settings** → **Developer settings** → **Personal access tokens** → **Tokens (classic)** → **Generate new token (classic)**.
2. Cochez uniquement **`read:packages`**. Choisissez une date d'expiration et notez-la : à cette date, les déploiements échoueront tant que le jeton n'aura pas été renouvelé.
3. Copiez le jeton (il commence par `ghp_`).
4. Sur Render : paramètres du compte → **Registry Credentials** (ou « Container Registry Credentials ») → ajoutez un identifiant :
   - registre : **GitHub Container Registry** ;
   - nom d'utilisateur : votre identifiant GitHub ;
   - jeton : celui que vous venez de copier.

### Quelle étiquette d'image choisir

Chaque construction publie l'image sous plusieurs étiquettes :

| Étiquette | Contenu | Usage |
|---|---|---|
| `sha-` suivi des 40 caractères du commit | Une version précise, qui ne change jamais | **À préférer** : vous savez exactement ce qui tourne, et le retour en arrière est possible |
| `claude-charming-edison-6tnuvl` (nom de la branche de travail) | La dernière version de cette branche | Essais avant la bascule |
| `latest` | La dernière version de `main` | Après la bascule |

Les étiquettes disponibles se lisent sur GitHub : page du dépôt → **Packages** → `perfumum-research`. Le résultat de chaque construction est dans l'onglet **Actions** → « Image Docker ».

---

## 4. Créer le service web sur Render

1. Sur <https://dashboard.render.com> : **New** → **Web Service**.
2. Source : **Existing Image** (« Deploy an existing image from a registry »).
3. Adresse de l'image, par exemple :

   ```
   ghcr.io/gadatheo-design/perfumum-research:sha-0123456789abcdef0123456789abcdef01234567
   ```

   Sélectionnez l'identifiant de registre créé à l'étape 3.
4. Réglages :
   - nom : `perfumum` ;
   - région : **Frankfurt (EU Central)** ;
   - type d'instance : une offre **payante** d'au moins **1 Go de mémoire**, 2 Go de préférence. *À vérifier : les disques persistants ne sont pas proposés sur l'offre gratuite.*
5. **Health Check Path** (dans les réglages avancés) : `/healthz`
6. Ajoutez les variables d'environnement de l'étape 6, puis le disque de l'étape 5, avant de valider.

### 5. Le disque persistant

Sans disque, les fichiers envoyés disparaissent à chaque redéploiement.

Dans les réglages avancés du service (« Disks » → « Add Disk ») :

| Champ | Valeur |
|---|---|
| Nom | `uploads` |
| Chemin de montage (Mount Path) | `/app/uploads` |
| Taille | `1 GB` |

À savoir :

- un service doté d'un disque ne tourne qu'en **un seul exemplaire** et s'interrompt **quelques secondes** à chaque redéploiement ;
- la taille d'un disque peut être augmentée plus tard, pas réduite ;
- *à vérifier au premier déploiement* : connectez-vous en administrateur et envoyez une image. Si l'envoi échoue avec une erreur de permission, le disque n'est pas inscriptible par l'application : signalez-le à un développeur (voir « Ce qui reste à vérifier » dans `docs/RAPPORT-LOT-1.md`).

### 6. Les variables d'environnement

À saisir dans **Environment** → « Add Environment Variable ». Toutes les valeurs ci-dessous sont **fictives**.

#### Obligatoires

| Variable | Exemple fictif | Rôle |
|---|---|---|
| `PERFUMUM_PLATFORM` | `standalone` | Mode autonome, sans Manus. L'image le définit déjà ; le répéter évite toute ambiguïté. |
| `DATABASE_URL` | `mysql://3xAmPlEpReFiX.root:MotDePasseFictif123@gateway01.eu-central-1.prod.aws.tidbcloud.com:4000/perfumum?ssl={"minVersion":"TLSv1.2","rejectUnauthorized":true}` | Adresse de la base (étape 1). |
| `JWT_SECRET` | `q7Jf2c…48 caractères aléatoires…Zx0=` | Signe les sessions et le cookie d'accès privé. Le changer déconnecte tout le monde. |
| `ADMIN_EMAIL` | `vous@example.org` | Adresse de connexion de l'administrateur. |
| `ADMIN_PASSWORD_HASH` | `scrypt$65536$8$1$c2VsZmljdGlm$ZW1wcmVpbnRlZmljdGl2ZQ==` | Empreinte du mot de passe administrateur (étape 2). Collez la ligne telle quelle, sans guillemets. |
| `STORAGE_PROVIDER` | `local` | Les fichiers envoyés vont sur le disque. |
| `STORAGE_LOCAL_DIR` | `/app/uploads` | Dossier du disque (étape 5). Doit être identique au chemin de montage. |
| `LLM_PROVIDER` | `disabled` | Désactive les fonctions qui appelaient le modèle de langage de Manus. |
| `NOTIFICATION_PROVIDER` | `disabled` | Désactive les notifications Manus ; elles sont seulement écrites dans le journal. |
| `SITE_ACCESS_PASSWORD` | `une-phrase-fictive-a-partager` | Garde tout le site privé (voir ci-dessous). Supprimez la variable le jour où le site devient public. |
| `PUBLIC_BASE_URL` | `https://perfumum.onrender.com` | Adresse publique du site, sans barre finale. Sert aux citations générées et à l'identification auprès des API scientifiques. À mettre à jour si vous branchez un nom de domaine. |

#### Recommandées

| Variable | Exemple fictif | Rôle |
|---|---|---|
| `TRUST_PROXY` | `1` | Render place un proxy devant l'application. Avec cette valeur, les limites d'essais et de débit comptent par visiteur ; sans elle, tous les visiteurs partagent le même compteur et huit erreurs de mot de passe bloquent tout le monde un quart d'heure. |
| `ADMIN_NAME` | `Administrateur` | Nom affiché pour le compte administrateur. |
| `PUBLIC_CONTACT_EMAIL` | `recherche@example.org` | Adresse de contact transmise aux API scientifiques. |

#### À ne pas définir

- `PORT` : Render le fournit lui-même.
- `VITE_ANALYTICS_ENDPOINT` et les autres variables `VITE_…` : elles n'agissent qu'au moment où l'image est construite, pas ici.

### L'accès privé, en pratique

Tant que `SITE_ACCESS_PASSWORD` est défini :

- toute visite arrive d'abord sur la page `/acces`, qui demande le mot de passe ;
- le navigateur est ensuite reconnu pendant **30 jours** ;
- après **8 essais** erronés, il faut attendre un quart d'heure ;
- les moteurs de recherche sont écartés ;
- changer `SITE_ACCESS_PASSWORD` (ou `JWT_SECRET`) redemande le mot de passe à tout le monde : c'est le moyen de retirer l'accès à quelqu'un.

Pour administrer le site, il faut passer cette porte **puis** se connecter avec `ADMIN_EMAIL` et le mot de passe administrateur.

---

## 7. Fichiers hérités de Manus

Deux opérations, à faire une fois, avec l'aide d'un développeur si besoin.

**Images de l'interface.** Dix-neuf images (icônes, illustrations) doivent être ajoutées au dépôt. Depuis le dossier du dépôt :

```bash
node deploy/fetch-media.mjs
```

Tant que ce n'est pas fait, le site va encore les chercher à leur ancienne adresse chez Manus : il fonctionne, mais dépend de Manus pour ces images.

**Images enregistrées en base.** Les fichiers envoyés du temps de Manus sont référencés par leur ancienne adresse. Le script suivant montre ce qu'il changerait, **sans rien écrire** :

```bash
DATABASE_URL='…la valeur de l étape 1…' node deploy/migrate-media-urls.mjs --liste
```

Il affiche les tables et colonnes concernées, le nombre de lignes, et la liste des fichiers. Il faut ensuite :

1. copier chaque fichier listé sur le disque, sous `/app/uploads/<clé>` (la colonne « clé » de la liste) ;
2. relancer la commande en remplaçant `--liste` par `--appliquer` pour écrire les nouvelles adresses.

Faites un export de la base avant `--appliquer`.

---

## 8. Vérifier que tout va bien

Ouvrez dans un navigateur, en remplaçant l'adresse par la vôtre :

```
https://perfumum.onrender.com/healthz
```

Réponse attendue :

```json
{"status":"ok","version":"1.0.0","commit":"0123456789abcdef0123456789abcdef01234567"}
```

- `commit` indique exactement quelle version du code tourne : il doit correspondre à l'étiquette `sha-…` déployée.
- Cette page répond même si la base est en panne : elle dit que l'application tourne, pas que les données sont joignables.

Contrôles à faire après chaque déploiement :

1. `/healthz` répond et affiche le bon `commit` ;
2. la page d'accueil demande le mot de passe d'accès, puis s'affiche ;
3. une fiche de molécule et une fiche de plante s'ouvrent avec leurs données (la base répond) ;
4. la connexion administrateur fonctionne ;
5. dans Render, l'onglet **Logs** ne montre pas de ligne `"level":"error"` répétée.

Render appelle lui-même `/healthz` en permanence : si l'application ne répond plus, il la redémarre, et un déploiement dont la nouvelle version ne répond pas n'est pas mis en service.

---

## 9. Mettre à jour (redéployer)

Render ne redéploie pas tout seul quand une nouvelle image est publiée.

**À la main.** Service → **Settings** → rubrique de l'image → remplacez l'étiquette par la nouvelle (`sha-…`) → enregistrez. Ou bien **Manual Deploy** → « Deploy latest reference » si vous suivez une étiquette mobile comme `latest`.

**Par « deploy hook ».** Render fournit une adresse secrète qui déclenche un déploiement : Service → **Settings** → **Deploy Hook**. Elle ressemble à :

```
https://api.render.com/deploy/srv-exemplefictif0000?key=CleFictive123
```

Pour redéployer l'étiquette actuelle :

```bash
curl -X POST 'https://api.render.com/deploy/srv-exemplefictif0000?key=CleFictive123'
```

Pour déployer une image précise, ajoutez son adresse, encodée, dans le paramètre `imgURL` :

```bash
curl -X POST 'https://api.render.com/deploy/srv-exemplefictif0000?key=CleFictive123&imgURL=ghcr.io%2Fgadatheo-design%2Fperfumum-research%3Asha-0123456789abcdef0123456789abcdef01234567'
```

(`%2F` remplace `/` et `%3A` remplace `:`.) *À vérifier dans la page « Deploy Hook » de Render, qui rappelle la forme exacte.*

Cette adresse vaut un mot de passe : quiconque la connaît peut redéployer le service. Ne la mettez ni dans le dépôt ni dans un message. Si elle fuit, Render permet de la régénérer.

---

## 10. Revenir en arrière

Si une nouvelle version pose problème :

1. Service → onglet **Events** (ou **Deploys**) ;
2. repérez le dernier déploiement qui fonctionnait ;
3. cliquez sur **Rollback** en face.

Autre méthode, toujours disponible : remettez l'ancienne étiquette `sha-…` dans les réglages de l'image, ou utilisez le « deploy hook » avec `imgURL` pointant sur elle. C'est pour cela qu'il vaut mieux déployer des étiquettes `sha-…` : chacune reste disponible sur GitHub.

Ce que le retour en arrière ne fait **pas** :

- il ne touche ni à la base ni au disque. Si la nouvelle version avait modifié des données, elles restent modifiées ;
- pour la base, TiDB Cloud conserve des sauvegardes automatiques (« Backup » dans la page du cluster). *À vérifier : la durée de conservation dépend de l'offre.*

Avant une opération risquée (migration, `--appliquer`), faites vous-même un export.

---

## En cas de problème

| Symptôme | Cause probable | Que faire |
|---|---|---|
| Le déploiement échoue au téléchargement de l'image | Jeton GitHub expiré, ou étiquette inexistante | Renouvelez le jeton (étape 3) ; vérifiez l'étiquette dans **Packages** |
| Le service redémarre en boucle, journal : « JWT_SECRET est vide » | `SITE_ACCESS_PASSWORD` défini sans `JWT_SECRET` | Renseignez `JWT_SECRET` |
| `/healthz` répond mais les pages sont vides ou en erreur | Base injoignable | Vérifiez `DATABASE_URL`, en particulier la fin `?ssl={…}` et le mot de passe |
| « Trop d'essais » sur `/acces` pour tout le monde | `TRUST_PROXY` absent | Ajoutez `TRUST_PROXY=1`, attendez un quart d'heure |
| Connexion administrateur : « La connexion locale n'est pas configurée » | `ADMIN_PASSWORD_HASH` absent ou tronqué | Recollez l'empreinte entière |
| Les images envoyées disparaissent après un redéploiement | Disque absent, ou `STORAGE_LOCAL_DIR` différent du chemin de montage | Reprenez l'étape 5 |
| Mot de passe d'accès accepté, puis redemandé aussitôt | Site consulté en `http://` | Utilisez l'adresse en `https://` |
