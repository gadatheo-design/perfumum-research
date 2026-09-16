# PERFUMUM — Politique de prévisualisation bibliographique

**Statut :** lecture, proposition et revue exclusivement. Cette politique ne met à jour, ne fusionne, ne supprime et ne relie aucune notice.

## Normalisation minimale proposée

La forme normalisée d’un DOI est calculée uniquement pour la comparaison : suppression des espaces périphériques et mise en minuscules. Un préfixe d’URL `doi.org` peut être présenté comme une variante d’affichage, mais ne doit pas être retiré de la notice de production sans confirmation explicite. Les procédures existantes de recherche Crossref et OpenAlex peuvent servir à obtenir des candidats de métadonnées ; elles ne constituent pas une preuve d’identité à elles seules.

| Signal | Proposition autorisée | Interdit sans revue humaine |
|---|---|---|
| DOI avec majuscules ou espaces périphériques | Afficher la forme normalisée et le diff caractère par caractère. | Écraser le DOI stocké. |
| DOI non conforme | Afficher l’identifiant, la source de saisie et la raison de l’alerte. | Déclarer automatiquement le DOI invalide ou le supprimer. |
| DOI normalisé dupliqué | Regrouper les notices avec titres, auteurs, années, type, provenance et liens. | Fusionner, désigner une notice canonique ou retirer un doublon. |
| Métadonnée absente | Montrer un candidat Crossref/OpenAlex, sa source, sa date et son niveau de concordance. | Remplir un champ ou écraser une valeur existante. |
| Source sans DOI | La conserver comme notice valable et signaler seulement les champs manquants. | La déclasser ou l’écarter du corpus. |

## Preuve et décision

Une proposition de complétion doit séparer **valeur existante**, **valeur candidate**, **source**, **date de récupération** et **raison de concordance**. Une décision humaine devra être journalisée notice par notice. Les notices anciennes, catalogues, archives et ressources sans DOI sont des objets bibliographiques à conserver : l’absence d’identifiant persistant n’est pas une erreur scientifique.

> Le fait que deux notices possèdent le même DOI normalisé est un signal de comparaison, non une instruction de fusion.
