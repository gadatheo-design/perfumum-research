# Permissions et décisions requises — Phase 1B

## Indispensables avant un export complet

| Permission / décision | Pourquoi | État |
|---|---|---|
| Périmètre table par table | 86 tables proposées à l’inclusion directe, 66 à chiffrer après approbation, 133 à revue humaine, 6 métadonnées média/binaire sous permission, 2 exclues/différées | Requis ; non approuvé. |
| Fenêtre de gel DDL + snapshot TiDB | Une série de `SELECT` successifs n’est pas atomique | Requis ; méthode non vérifiée. |
| Compte lecture seule minimum | Éviter tout DML/DDL et limiter l’exposition | Requis ; scope à confirmer. |
| Destination contrôlée et capacité | Le pack doit survivre hors Manus et être téléchargeable par le propriétaire | Requis ; destination non désignée. |
| Empreinte de clé publique GPG | Chiffrer l’archive sans inclure de secret | Requis ; non fournie. |
| Traitement des 67 tables potentiellement personnelles | Base légale, minimisation, chiffrement et droit d’accès | Requis ; non décidé. |
| Traitement des 25 tables potentiellement privées et 113 à vérifier | Certaines possèdent JSON, contenu libre, formules, état interne ou notes | Requis ; non décidé. |

## Spécifiques aux médias

| Permission | Pourquoi |
|---|---|
| Lecture Forge de clés approuvées | Les objets binaires ne sont pas accessibles par le simple inventaire SQL. |
| Autorisation de copie, pas de suppression | Garantir une opération strictement non destructive. |
| Vérification des droits/licences | La présence d’une URL, d’une source ou attribution ne suffit pas. |
| Destination chiffrée | Les médias et leurs métadonnées peuvent relever de restrictions ou d’informations privées. |

## Spécifiques à Notion

Une exportation Notion n’est pas requise pour l’export TiDB, mais si elle est ajoutée, elle exige un périmètre de pages autorisées, le format d’export, la décision sur les bases reliées et le droit de conservation. Aucune synchronisation automatique n’est autorisée.

## Exclusions permanentes du kit

Secrets, clés privées, mots de passe, tokens, cookies, sessions, configuration d’hébergement propriétaire et données de connexion ne sont jamais exportés. Ils doivent être recréés dans l’environnement de destination.
