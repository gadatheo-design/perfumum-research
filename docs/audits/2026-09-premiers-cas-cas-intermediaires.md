# PERFUMUM — Première tranche de conflits CAS à convergence intermédiaire

**Date de relevé :** 16 septembre 2026  
**Périmètre :** lecture seule de `molecules`, sans modification du statut des cas et sans écriture dans les entités scientifiques.

## Critère de sélection

Cette tranche ne contient que des groupes présentant un **InChIKey non vide et identique**, un checksum CAS déjà qualifié par le cockpit, au moins un corroborateur commun (CID PubChem, formule ou QID Wikidata) et aucune divergence parmi les identifiants disponibles. Une ou plusieurs données restent toutefois absentes, ce qui interdit toute acceptation automatique.

| CAS | Enregistrements | Élément absent | Identifiants déjà convergents | Décision proposée |
|---|---|---|---|---|
| 106-23-0 | Citronellal ; (RS)-citronellal | formule sur les deux lignes | InChIKey, CID PubChem, QID Wikidata | Revue humaine : vérifier si l’écriture racémique est intentionnelle. |
| 138-87-4 | (E)-beta-terpineol ; trans-β-terpineol | formule sur une ligne | InChIKey, CID PubChem, QID Wikidata | Revue humaine : conserver l’information de stéréochimie si elle est significative. |
| 28976-68-3 | γ-Curcumène ; γ-Curcumene | formule sur les deux lignes | InChIKey, CID PubChem, QID Wikidata | Revue humaine : probable variante orthographique, à documenter sans fusion. |
| 473-15-4 | Eudesmol beta ; β-Eudesmol | formule sur une ligne | InChIKey, CID PubChem, QID Wikidata | Revue humaine : normaliser les formes de nom seulement après validation. |
| 501-94-0 | Tyrosol ; tyrosol | formule sur une ligne | InChIKey, CID PubChem, QID Wikidata | Revue humaine : probable variation de casse, à conserver comme hypothèse. |
| 531-75-9 | Esculin ; Esculine | formule sur une ligne | InChIKey, CID PubChem, QID Wikidata | Revue humaine : vérifier le statut de synonyme multilingue. |
| 631-69-6 | Acide β-boswellique ; Acide boswellique | formule sur les deux lignes | InChIKey, CID PubChem, QID Wikidata | Revue humaine : vérifier la spécificité de l’isomère bêta. |
| 79067-61-1 | iminoaspartic acid ; iminosuccinic acid | formule sur une ligne | InChIKey, CID PubChem, QID Wikidata | Revue humaine : vérifier les synonymies chimiques avant toute consolidation. |

> La présence d’un même CID, InChIKey ou QID dans des imports historiques est un **indice de convergence**, pas une autorisation de fusion. Les noms qui encodent un isomère, une forme racémique, une langue ou une granularité chimique différente requièrent une décision humaine et, si nécessaire, une source externe conservée avec la décision.

## Étape suivante

Le bouton **« Exporter les preuves CAS »** du cockpit produit le dossier complet, incluant les identités disponibles et le journal. Cette note est une liste de travail courte permettant d’ouvrir la revue au cas par cas, en commençant par les contraintes stéréochimiques avant les simples variantes de casse ou de translittération.
