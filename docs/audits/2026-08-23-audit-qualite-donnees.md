# Audit de qualité des données PERFUMUM

**Date de mesure :** 23 août 2026  
**Périmètre :** molécules, plantes, bibliographie, descripteurs olfactifs, relations plante–molécule, terroirs et liens de descripteurs.  
**Méthode :** lecture SQL non destructive des tables de production ; aucune donnée n’a été corrigée, fusionnée ou supprimée pendant cet audit.

## Conclusion exécutive

PERFUMUM possède une base **volumineuse et prometteuse**, particulièrement solide pour l’identification chimique de surface : 7 478 molécules, 3 782 plantes, 1 501 références, 93 terroirs et 31 495 relations plante–molécule. Le point faible central n’est pas le volume mais la **traçabilité sémantique** : la provenance, les références, les profils olfactifs et les liens narratifs restent très inégalement renseignés.

> La priorité n’est pas d’ajouter d’abord de nouveaux objets. Il faut sécuriser les identifiants conflictuels, rétablir les relations orphelines et convertir les champs textuels existants en preuves, sources et relations inter-entités vérifiables.

| Domaine | État observé | Diagnostic |
|---|---:|---|
| Structure chimique | PubChem, SMILES et InChIKey très largement couverts | Base adaptée à la normalisation et à l’enrichissement scientifique. |
| Sémantique olfactive moléculaire | Profils olfactifs largement absents | Principal frein à l’atlas olfactif et aux comparaisons. |
| Botanique | Taxonomie/identifiants externes forts, contenu olfactif faible | Les plantes sont bien identifiées mais rarement décrites comme matières olfactives. |
| Bibliographie | Titres intacts, métadonnées et annotations lacunaires | Base de sources riche mais peu exploitable comme réseau de preuves. |
| Relations | Graphe plante–molécule dense, mais couverture inégale et quelques orphelins | La densité doit être complétée par des liens sourcés et une gouvernance d’intégrité. |

## 1. Complétude des molécules

| Indicateur | Couvert | Lacune | Interprétation |
|---|---:|---:|---|
| PubChem CID | 7 292 / 7 478 | 186 (2,48 %) | Très bonne base d’identifiants externes. |
| SMILES | 7 421 / 7 478 | 57 (0,76 %) | Couverture structurelle quasi complète. |
| InChI | 4 604 / 7 478 | 2 874 (38,43 %) | Enrichissement PubChem restant à terminer. |
| InChIKey | 7 379 / 7 478 | 99 (1,32 %) | Bon identifiant de déduplication et de rapprochement. |
| CAS renseigné | 4 162 / 7 478 | 3 316 (44,34 %) | Lacune importante, mais le CAS ne doit pas devenir le seul identifiant de référence. |
| ChEBI renseigné | 1 446 / 7 478 | 6 032 (80,66 %) | Couverture sémantique chimique encore faible. |
| Famille chimique | 7 477 / 7 478 | 1 (0,01 %) | Classification interne très complète. |
| Profil olfactif | 1 450 / 7 478 | 6 028 (80,60 %) | Priorité scientifique et éditoriale majeure. |
| Références renseignées | 4 354 / 7 478 | 3 124 (41,78 %) | Preuves à associer aux données enrichies. |
| Origine renseignée | 184 / 7 478 | 7 294 (97,54 %) | Le champ d’origine est sous-utilisé ou ne correspond pas au flux d’import réel. |

Les identifiants de structure sont déjà assez bons pour automatiser un rapprochement prudent. En revanche, la valeur recherchée par PERFUMUM — odeurs, usages, organismes producteurs, contexte culturel — est insuffisamment reliée à des preuves bibliographiques et à une provenance enregistrée.

### Alerte : conflits CAS

L’audit relève **169 groupes de CAS dupliqués**. Certains semblent correspondre à des variantes légitimes (stéréoisomères, synonymes, orthographes), mais plusieurs exemples révèlent des attributions incohérentes : le CAS du méthanol (`67-56-1`) ou de l’acide acétique (`64-19-7`) est associé à des structures manifestement différentes. Cette situation interdit toute fusion automatique sur CAS seul.

**Décision recommandée :** classer chaque conflit CAS en `synonyme / stéréoisomère / erreur probable / à documenter`, puis recalculer le QID Wikidata, PubChem CID et InChIKey avant toute déduplication.

## 2. Qualité botanique et territoriale

| Indicateur | Couvert | Lacune | Interprétation |
|---|---:|---:|---|
| Nom latin | 3 782 / 3 782 | 0 | Très bon socle taxonomique. |
| Famille botanique | 3 782 / 3 782 | 0 | Couverture structurelle complète. |
| GBIF ID | 3 759 / 3 782 | 23 (0,61 %) | Bon potentiel de cartographie et de contrôle taxonomique. |
| Wikidata QID | 3 778 / 3 782 | 4 (0,11 %) | Excellente interopérabilité externe. |
| Signature olfactive | 556 / 3 782 | 3 226 (85,29 %) | Lacune critique pour le projet olfactif. |
| Molécules dominantes | 504 / 3 782 | 3 278 (86,67 %) | Lacune critique pour relier botanique et chimie. |
| Plantes sans relation moléculaire | 790 / 3 782 | 2 992 (79,11 %) | Le graphe est dense mais concentré sur une minorité de plantes. |
| Statut `valide` | 475 / 3 782 | 3 307 brouillons (87,45 %) | Les plantes constituent le chantier principal de revue humaine. |

Le socle taxonomique est remarquablement mûr. En revanche, il faut traiter les plantes non comme une collection d’étiquettes botaniques mais comme des **matières olfactives contextualisées** : partie utilisée, chimio-type, rendement, saison, terroir, composition et sources.

Les 93 terroirs ont tous un pays renseigné ; **35** n’ont toutefois pas de coordonnées (37,63 %) et **22 relations plante–terroir** pointent vers une plante ou un terroir absent. Ces liens doivent être examinés dans l’outil d’intégrité avant toute valorisation géographique.

## 3. Graphe inter-entités et intégrité relationnelle

| Indicateur | Valeur | Risque ou opportunité |
|---|---:|---|
| Relations `plant_molecules` | 31 495 | Socle important pour l’exploration chimio-botanique. |
| Relations `molecule_plant_sources` | 194 | Couche de sources encore trop limitée. |
| Molécules sans lien plante | 545 (7,28 %) | Cible raisonnable de rapprochement par organismes producteurs. |
| Lignes `plant_molecules` orphelines | 0 | Intégrité saine sur la table centrale. |
| Liens descripteur–plante orphelins | 2 / 11 | À corriger via la réassociation guidée existante. |
| Liens descripteur–molécule orphelins | 2 / 5 | À corriger en priorité car le volume total est faible. |
| Liens de descripteurs sans source | 0 | Bon niveau de provenance sur cette couche. |

Le nombre de relations plantes–molécules ne suffit pas à mesurer la qualité du graphe. Il faut maintenant systématiser : un lien, une source ; une source, une référence ; une référence, des entités liées ; une entité, un statut de validation adapté au type de preuve.

## 4. Bibliographie et vocabulaire olfactif

| Indicateur | Valeur | Lecture |
|---|---:|---|
| Références bibliographiques | 1 501 | Corpus substantiel. |
| Sans DOI | 1 208 (80,47 %) | Acceptable pour les sources anciennes, mais à distinguer des articles modernes non enrichis. |
| Sans abstract | 777 (51,76 %) | Limite l’analyse automatisée et la découverte de relations. |
| Sans mots-clés | 1 258 (83,81 %) | Frein principal à la navigation thématique. |
| Sans auteur | 538 (35,84 %) | Problème de citation et d’évaluation de provenance. |
| Sans année | 576 (38,37 %) | Frein à la frise et aux analyses historiques. |
| Liées à au moins une entité | 453 (30,17 %) | Les liens de preuve doivent être étendus. |
| Annotées | 0 | Opportunité forte pour la revue humaine assistée. |
| DOI en doublon | 36 groupes | Déduplication bibliographique nécessaire avant enrichissement massif. |
| Descripteurs olfactifs | 25, dans 16 catégories | Vocabulaire initial propre (pas de doublon exact) mais très insuffisant au regard des 7 478 molécules. |

La bibliographie bénéficie d’une forte couverture d’URL ou DOI (1 237 références, 82,41 %), mais l’exploitation scientifique n’est pas encore proportionnelle au volume. Le prochain gain ne vient pas d’un nouvel import massif : il vient d’un pipeline de normalisation DOI, d’extraction de métadonnées, d’annotation et de liaison aux entités.

## 5. Qualité des statuts

Les statuts actuels doivent être interprétés avec prudence. **7 206 molécules** sont marquées `valide` (96,36 %), alors que les champs de provenance, références et profils olfactifs restent largement incomplets. À l’inverse, seules **475 plantes** sont marquées `valide` (12,55 %). Le statut global est donc utile comme état de flux, mais ne représente pas encore un niveau de preuve homogène.

Je recommande d’adopter un modèle de qualité en dimensions séparées : `identité`, `structure`, `provenance`, `preuve bibliographique`, `contexte olfactif`, `revue humaine` et `licence`. Une entité peut alors être chimiquement vérifiée mais olfactivement incomplète, sans contradiction.

## Feuille de route priorisée

| Horizon | Action | Résultat attendu | Garde-fou |
|---|---|---|---|
| 0–30 jours | Réconcilier les 169 conflits CAS et les 88 groupes de doublons nom/latin/DOI | Identifiants fiables et aucune fusion destructive | Prévisualisation, classement et validation humaine. |
| 0–30 jours | Résoudre les 26 liens orphelins (descripteurs et terroirs) | Graphe relationnel cohérent | Utiliser la réassociation guidée ; journaliser chaque décision. |
| 30–90 jours | Enrichir les 6 028 profils olfactifs manquants via une file de propositions sourcées | Atlas moléculaire exploitable | Séparer faits de source, extraction LLM et validation humaine. |
| 30–90 jours | Compléter les 2 992 plantes sans relation moléculaire et les 3 278 sans molécules dominantes | Connexion botanique–chimie plus équilibrée | Prioriser plantes olfactives, médicinales et patrimoniales. |
| 30–90 jours | Normaliser DOI, auteurs, années, résumés et mots-clés | Bibliographie consultable comme réseau de preuves | Dédupliquer par DOI avant enrichissement ; conserver les sources anciennes sans DOI. |
| 3–12 mois | Créer un tableau de bord de qualité par dimension et par import | Pilotage continu sur dix ans | Seuils explicites, rapports non destructifs et historique de corrections. |

## Indicateurs à suivre trimestriellement

1. Pourcentage de molécules avec **InChI + InChIKey + source + profil olfactif sourcé**.
2. Pourcentage de plantes avec **nom latin + taxon externe + signature olfactive + molécules dominantes**.
3. Pourcentage de références avec **auteur + année + identifiant persistant + mots-clés + liens entités**.
4. Nombre de liens orphelins, de conflits CAS et de doublons DOI ouverts, puis résolus.
5. Nombre de descripteurs, synonymes et traductions validés avec provenance et revue humaine.

## Note méthodologique

Les chiffres ci-dessus décrivent un état de base et non une vérité bibliographique absolue. Les doublons détectés à partir du CAS, du nom latin ou du DOI doivent être examinés comme des **candidats de rapprochement**, jamais fusionnés automatiquement. La même prudence s’applique aux champs vides : une absence peut refléter une source historique, une donnée volontairement non pertinente ou un import partiel ; elle doit donc être traitée par une file de revue, non par une complétion automatique non sourcée.
