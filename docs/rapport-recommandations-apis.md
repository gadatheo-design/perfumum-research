# Rapport de Recommandations d'APIs pour PERFUMUM

**Auteur** : Manus AI  
**Date** : 31 janvier 2026  
**Version** : 1.0

---

## Résumé Exécutif

Ce rapport présente une analyse approfondie des APIs et bases de données pertinentes pour enrichir le projet PERFUMUM. L'objectif est d'identifier les sources de données complémentaires permettant d'améliorer la qualité scientifique, la conformité réglementaire et la richesse informationnelle de la plateforme de recherche olfactive.

Après analyse de 12 APIs et bases de données, nous recommandons l'intégration prioritaire de **4 sources** qui apporteront une valeur ajoutée significative au projet tout en respectant les contraintes de coût et de complexité technique.

---

## Contexte et Besoins du Projet

Le projet PERFUMUM dispose actuellement des intégrations suivantes :

| API/Service | Statut | Données |
|-------------|--------|---------|
| PubChem | ✅ Implémenté | CID, SMILES, InChI, poids moléculaire, propriétés physico-chimiques |
| ChEBI | ✅ Implémenté | ID ChEBI, nomenclature, classification ontologique |
| Trefle.io (local) | ✅ Implémenté | Familles botaniques, genres, taxonomie |
| Terpene Parser | ✅ Implémenté | Profils terpéniques des landraces cannabis |

Les besoins identifiés pour les prochaines phases du projet sont :

1. **Données olfactives** : descripteurs de parfums, notes pyramidales, accords
2. **Propriétés thérapeutiques** : bioactivités, usages médicinaux des molécules
3. **Conformité réglementaire** : limites IFRA, classification CLP, restrictions d'usage
4. **Sources biologiques** : organismes producteurs, voies biosynthétiques

---

## Analyse des APIs Candidates

### Catégorie 1 : Données Parfumerie et Olfactives

#### Fragella API

L'API Fragella représente la source la plus complète pour les données de parfumerie commerciale. Elle offre un accès structuré à plus de 74 000 parfums avec des informations détaillées sur les notes pyramidales (top, middle, base), les accords exprimés en pourcentages, ainsi que des métriques de performance comme la longévité et le sillage [1].

| Critère | Évaluation |
|---------|------------|
| Couverture | 74 000+ parfums |
| Format | JSON structuré |
| Coût | Gratuit (20 req/mois) à $49/mois (20 000 req) |
| Qualité | Haute (données curées, images CDN) |
| Intégration | Facile (REST API documentée) |

**Intérêt pour PERFUMUM** : Cette API permettrait de créer des liens entre les molécules de la base de données et les parfums célèbres qui les utilisent, enrichissant ainsi la compréhension des applications pratiques de chaque composé aromatique.

#### Flavornet

Flavornet est une compilation académique des composés aromatiques perçus par l'odorat humain. Bien que moins de 1000 odorants soient répertoriés, la base de données inclut des descripteurs olfactifs précis et des seuils de perception qui sont essentiels pour la recherche en parfumerie [2].

| Critère | Évaluation |
|---------|------------|
| Couverture | ~1000 odorants |
| Format | HTML (scraping nécessaire) |
| Coût | Gratuit |
| Qualité | Académique (références scientifiques) |
| Intégration | Moyenne (pas d'API) |

**Intérêt pour PERFUMUM** : Les descripteurs olfactifs et seuils de perception pourraient enrichir les fiches molécules avec des données sensorielles validées scientifiquement.

### Catégorie 2 : Produits Naturels et Biosynthèse

#### COCONUT (COlleCtion of Open NatUral producTs)

COCONUT est la plus grande base de données ouverte de produits naturels, contenant plus de 716 000 molécules avec leurs sources biologiques et références bibliographiques [3]. L'API REST permet un accès temps réel aux données les plus récentes.

| Critère | Évaluation |
|---------|------------|
| Couverture | 716 697 molécules, 70 896 organismes |
| Format | JSON via API REST |
| Coût | Gratuit (open source) |
| Qualité | Haute (curée par la communauté scientifique) |
| Intégration | Facile (API REST documentée) |

**Intérêt pour PERFUMUM** : L'intégration de COCONUT permettrait d'enrichir les molécules avec leurs sources biologiques naturelles, les voies biosynthétiques et les références bibliographiques associées.

#### AromaDb

AromaDb est une base de données spécialisée dans les molécules aromatiques des plantes médicinales, particulièrement celles d'origine indienne. Elle contient 1321 structures chimiques avec leurs bioactivités et 357 types de fragrances [4].

| Critère | Évaluation |
|---------|------------|
| Couverture | 1321 molécules aromatiques |
| Format | Web interface (scraping possible) |
| Coût | Gratuit |
| Qualité | Académique |
| Intégration | Moyenne |

**Intérêt pour PERFUMUM** : Les données de bioactivité et les types de fragrances pourraient enrichir les propriétés thérapeutiques et olfactives des molécules.

### Catégorie 3 : Réglementation et Sécurité

#### IFRA Transparency List

La liste de transparence IFRA représente la "palette du parfumeur" avec plus de 3000 ingrédients utilisés dans l'industrie de la parfumerie mondiale. Chaque ingrédient est identifié par son numéro CAS et classifié selon sa catégorie (naturel, synthétique) [5].

| Critère | Évaluation |
|---------|------------|
| Couverture | 3000+ ingrédients |
| Format | HTML (scraping nécessaire) |
| Coût | Gratuit |
| Qualité | Référence industrielle |
| Intégration | Moyenne (pas d'API officielle) |

**Intérêt pour PERFUMUM** : L'intégration des données IFRA permettrait d'ajouter des informations de conformité réglementaire aux molécules, essentielles pour les applications pratiques en parfumerie.

#### ECHA CHEM (REACH)

ECHA CHEM est la base de données publique de l'Agence européenne des produits chimiques, contenant les données soumises dans le cadre du règlement REACH. Elle inclut des informations sur la toxicité, la classification et l'étiquetage des substances [6].

| Critère | Évaluation |
|---------|------------|
| Couverture | Toutes substances REACH |
| Format | API disponible |
| Coût | Gratuit |
| Qualité | Réglementaire (officielle UE) |
| Intégration | Moyenne |

**Intérêt pour PERFUMUM** : Les données de sécurité et de classification CLP pourraient enrichir les fiches molécules avec des informations toxicologiques officielles.

### Catégorie 4 : Données Botaniques

#### Perenual Plant API

Perenual offre une API gratuite avec des données sur plus de 10 000 espèces de plantes, incluant des images, des informations de culture et des données botaniques [7].

| Critère | Évaluation |
|---------|------------|
| Couverture | 10 000+ espèces |
| Format | JSON via API REST |
| Coût | Gratuit (avec limites) |
| Qualité | Bonne |
| Intégration | Facile |

**Intérêt pour PERFUMUM** : Enrichir les fiches plantes avec des images de qualité et des données de culture complémentaires.

---

## Recommandations Prioritaires

Sur la base de l'analyse précédente, nous recommandons l'intégration des APIs suivantes par ordre de priorité :

### Priorité 1 : COCONUT API

**Justification** : COCONUT offre le meilleur rapport couverture/coût avec plus de 700 000 molécules de produits naturels accessibles gratuitement via une API REST bien documentée. L'intégration permettrait d'enrichir automatiquement les molécules existantes avec leurs sources biologiques et références bibliographiques.

**Effort estimé** : 2-3 jours de développement

**Données à intégrer** :
- ID COCONUT
- Organismes sources
- Voies biosynthétiques
- Références bibliographiques

### Priorité 2 : Fragella API (Plan Basic)

**Justification** : Fragella est la seule API offrant des données structurées sur les parfums commerciaux avec notes pyramidales et accords. Le plan Basic à $12/mois offre 5000 requêtes, suffisant pour enrichir progressivement la base de données avec des liens vers les parfums célèbres.

**Effort estimé** : 3-4 jours de développement

**Données à intégrer** :
- Parfums utilisant chaque molécule
- Notes pyramidales (top, middle, base)
- Accords dominants
- Métriques de performance (longévité, sillage)

### Priorité 3 : IFRA Transparency List (Scraping)

**Justification** : Les données IFRA sont essentielles pour la conformité réglementaire en parfumerie. Bien qu'aucune API officielle ne soit disponible, un script de scraping ponctuel permettrait d'intégrer les limites d'utilisation et classifications.

**Effort estimé** : 1-2 jours de développement

**Données à intégrer** :
- Numéro CAS IFRA
- Catégorie (naturel/synthétique)
- Restrictions d'utilisation
- Standards IFRA applicables

### Priorité 4 : Flavornet (Scraping)

**Justification** : Les descripteurs olfactifs et seuils de perception de Flavornet sont des données scientifiques précieuses qui enrichiraient significativement les fiches molécules avec des informations sensorielles validées.

**Effort estimé** : 1 jour de développement

**Données à intégrer** :
- Descripteurs olfactifs
- Seuils de perception
- Références bibliographiques

---

## Plan d'Implémentation Suggéré

| Phase | API | Durée | Coût |
|-------|-----|-------|------|
| Phase 1 | COCONUT | 2-3 jours | Gratuit |
| Phase 2 | IFRA Scraping | 1-2 jours | Gratuit |
| Phase 3 | Flavornet Scraping | 1 jour | Gratuit |
| Phase 4 | Fragella API | 3-4 jours | $12/mois |

**Durée totale estimée** : 7-10 jours de développement  
**Coût mensuel récurrent** : $12/mois (Fragella Basic)

---

## Conclusion

L'intégration des APIs recommandées permettrait d'enrichir significativement le projet PERFUMUM avec des données complémentaires couvrant les aspects olfactifs, biologiques et réglementaires de la recherche en parfumerie. La stratégie proposée privilégie les sources gratuites et open source tout en réservant un budget minimal pour l'API Fragella qui offre des données uniques sur les parfums commerciaux.

Ces enrichissements renforceront la valeur scientifique et pratique de la plateforme, tout en créant des interconnexions entre les différentes entités (molécules, plantes, parfums, recettes) conformément aux préférences du projet pour une documentation exhaustive et interconnectée.

---

## Références

[1] Fragella API. "The Ultimate Fragrance Data API." https://api.fragella.com/

[2] Flavornet. "A compilation of aroma compounds found in human odor space." https://www.flavornet.org/

[3] COCONUT. "COlleCtion of Open NatUral producTs." https://coconut.naturalproducts.net/

[4] Kumar, Y. et al. (2018). "AromaDb: A Database of Medicinal and Aromatic Plant's Aroma Molecules." PMC6099104. https://pmc.ncbi.nlm.nih.gov/articles/PMC6099104/

[5] IFRA. "Transparency List - The perfumer's palette." https://ifrafragrance.org/transparency-list

[6] ECHA. "ECHA CHEM - Public chemicals database." https://chem.echa.europa.eu/

[7] Perenual. "Plant API Documentation." https://perenual.com/docs/api
