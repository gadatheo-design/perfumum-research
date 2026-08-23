# Protocole contrôlé — 50 termes olfactifs multilingues issus du corpus Zenodo

**Projet :** PERFUMUM  
**Version :** 1.0  
**Date :** 23 août 2026  
**Statut :** protocole préalable à toute écriture dans les tables de production

## 1. Objet et principe de précaution

Ce pilote teste la capacité de PERFUMUM à accueillir des **termes olfactifs attestés en chinois** sans les réduire à une traduction unique, sans transformer des ressemblances lexicales en preuves chimiques, et sans écraser les descripteurs existants. Il porte sur cinquante entrées du fichier `Olfactory_Lexcion.xlsx` déposé sur Zenodo par Yan *et al.*.[1]

Le pilote ne vise ni l’importation du corpus complet, ni la création automatique de liens plante–molécule–odeur. Son résultat attendu est un ensemble de **propositions traçables**, revues par des humains, pouvant seulement ensuite devenir des termes multilingues validés dans PERFUMUM.

> **Règle de décision :** le LLM suggère ; les réviseurs qualifient ; l’administrateur valide ; le système journalise. Une suggestion ne devient jamais une assertion scientifique par simple proximité sémantique.

## 2. Périmètre des données et licence

La sélection part exclusivement de l’onglet `Strongly_Olfaction-Associated_D` du lexique Zenodo, qui offre pour chaque entrée un terme chinois, une glose anglaise, une catégorie, un score OAI et un score OSI. Le dépôt de données est sous CC BY 4.0 ; chaque enregistrement importé devra donc conserver l’URI Zenodo, le DOI et la mention d’attribution. L’article associé, sous CC BY-NC-ND 4.0, est une référence méthodologique et ne doit pas être adapté ou republié sous une forme dérivée.[1] [2] [3]

| Élément | Inclus | Exclu dans le pilote |
|---|---|---|
| Lexique Zenodo | 50 termes proposés | Import massif des 3 563 descripteurs |
| Langues | chinois simplifié, pinyin si ajouté par un réviseur, gloses anglaises, propositions françaises | traduction automatique considérée comme équivalence définitive |
| Relations PERFUMUM | liens proposés vers descripteurs canoniques, plantes, molécules ou matériaux | écriture automatique dans les associations scientifiques existantes |
| Corpus contextuel | référence de provenance et exemples si les droits sont documentés | ingestion des 150 198 phrases sans examen ligne par ligne |

## 3. Hypothèses testées

Le pilote évaluera quatre hypothèses opérationnelles :

1. Le modèle de données peut conserver un terme original, sa glose, sa langue, sa catégorie et sa provenance sans perte d’information culturelle.
2. Un LLM peut produire des **candidats de rapprochement** vers les descripteurs PERFUMUM et les entités existantes, sans décider de l’équivalence.
3. Deux réviseurs aux compétences complémentaires peuvent qualifier les propositions de façon reproductible.
4. Les termes ayant une forte association olfactive dans le corpus source restent utiles pour PERFUMUM sans que leurs scores OAI/OSI soient interprétés comme universels ou directement comparables aux corpus français et anglais.

## 4. Échantillonnage stratifié des cinquante termes

L’onglet fortement associé comprend 189 termes, alors que l’ensemble du lexique est très dominé par les descripteurs fondés sur une source. Le pilote doit donc suréchantillonner les catégories minoritaires afin de tester le modèle de données plutôt que de reproduire mécaniquement la distribution du corpus source.

| Strate | Nombre | Critères de sélection | Exemples présents dans le lexique source |
|---|---:|---|---|
| Source matérielle, botanique ou alimentaire | 20 | Termes reliables à une matière, une plante, un matériau ou une substance identifiable | 橡树苔 / oakmoss ; 西洋杉 / cedarwood ; 蜜糖香 / honeyed aroma ; 麝香 / musk |
| Qualité olfactive abstraite | 15 | Facettes ou accords sans source matérielle univoque | 花果调 / floral-fruity notes ; 木质香 / woody scent ; 酯香 / estery aroma ; 柑橘调 / citrus notes |
| Évaluation, intensité ou réaction | 10 | Valence, gêne, intensité et effet perceptif | 难闻 / malodorous ; 刺鼻 / nasal-irritating ; 臭不可闻 / putrid |
| Terme culturel, technique ou ambigu | 5 | Cas dont la portée culturelle, alimentaire, médicinale ou linguistique appelle une revue renforcée | 熟汤气 / overcooked tea aroma ; 中药味 / traditional medicine scent ; 酱酯 / sauce ester flavor |

Les cinquante lignes seront sélectionnées dans l’ordre décroissant de pertinence documentaire au sein de chaque strate, en tenant compte des critères suivants : présence d’une glose anglaise, catégorie renseignée, score OAI/OSI disponible, diversité des sources et absence de doublon graphique évident. Les termes trop proches morphologiquement ne seront pas retenus simultanément, sauf lorsqu’ils servent à tester une relation explicite de synonymie ou de variation.

## 5. Modèle de proposition réversible

Chaque ligne est manipulée dans un CSV de travail ; aucune écriture de production n’est autorisée avant un statut humain `accepted`. Le fichier doit pouvoir être relu, comparé et annulé.

| Colonne CSV | Rôle |
|---|---|
| `external_term_id` | Identifiant stable du pilote, par exemple `zenodo-cocd-0001`. |
| `term_original` | Terme chinois exact, préservé sans normalisation destructive. |
| `language_code` | `zh-Hans`. |
| `english_gloss_source` | Glose anglaise provenant du lexique Zenodo. |
| `pinyin` | Ajout manuel ou proposé, jamais inféré comme fait certain. |
| `french_gloss_proposed` | Traduction de travail, explicitement révisable. |
| `source_category` | `source-based`, `abstract` ou `evaluative`. |
| `oai` / `osi` | Scores source conservés tels quels avec leur méthode d’origine. |
| `canonical_descriptor_candidate` | Descripteur PERFUMUM potentiel, facultatif. |
| `candidate_relation_type` | `exact_candidate`, `broader_candidate`, `related_candidate`, `no_mapping`. |
| `candidate_entity_type` / `candidate_entity_id` | Plante, molécule, matériau ou descripteur ; facultatifs. |
| `llm_rationale` | Raison courte et vérifiable de la proposition. |
| `confidence` | `low`, `medium`, `high` ; mesure de priorité de revue, pas une vérité scientifique. |
| `review_linguistic` / `review_domain` | Décision des deux réviseurs. |
| `final_decision` | `accepted`, `accepted_with_context`, `needs_research`, `rejected`. |
| `source_doi` / `source_url` | `10.5281/zenodo.21261901` et URL de provenance. |
| `license` | `CC-BY-4.0`. |
| `reviewed_by` / `reviewed_at` | Traçabilité éditoriale. |

## 6. Pré-annotation LLM : tâches et interdits

La pré-annotation a uniquement quatre tâches : identifier un équivalent ou voisin français possible, rapprocher le terme de la taxonomie PERFUMUM, signaler une ambiguïté et proposer un niveau de confiance. La sortie doit respecter un schéma JSON fermé correspondant aux colonnes CSV.

Le prompt doit rappeler que le modèle ne doit pas :

- affirmer qu’un terme chinois décrit une molécule précise sans source chimique ;
- confondre une note de parfum avec une matière première ;
- convertir un terme culturel en simple synonyme français ;
- créer ou modifier une association plante–descripteur ou molécule–descripteur ;
- émettre une explication sans indiquer les indices lexicaux utilisés.

La stratégie P-COT de l’article est retenue comme inspiration, car elle a présenté la meilleure performance d’extraction rapportée parmi les prompts testés ; cependant, le raisonnement détaillé du modèle ne sera pas stocké. Seule une justification concise, contrôlable et non spéculative sera conservée.[2]

## 7. Revue humaine à deux voix

Chaque terme est revu séparément par :

| Rôle | Responsabilité |
|---|---|
| Réviseur linguistique et culturel | Vérifie la forme chinoise, la translittération, la glose, le registre et les non-équivalences culturelles. |
| Réviseur olfactif / chimio-botanique | Vérifie la plausibilité d’un rapprochement avec descripteur, plante, molécule ou matière PERFUMUM ; distingue association documentaire et preuve scientifique. |
| Administrateur PERFUMUM | Arbitre les désaccords, valide l’écriture éventuelle et garantit la journalisation. |

Un accord complet produit `accepted` ou `accepted_with_context`. Un désaccord produit `needs_research`. Une traduction trompeuse, une absence de provenance ou une hypothèse chimique non sourcée produit `rejected`. Aucun désaccord ne doit être résolu par moyenne de scores.

## 8. Contrôles de qualité et seuils d’arrêt

| Contrôle | Seuil de réussite | Action si échec |
|---|---:|---|
| Provenance complète | 50/50 lignes ont DOI, URL et licence | Bloquer l’import. |
| Structure CSV | 50/50 lignes valident le schéma | Corriger le fichier de simulation. |
| Double revue | 50/50 lignes ont deux décisions | Bloquer toute écriture. |
| Accord initial | au moins 70 % d’accord direct sur les catégories et statuts | Réviser les définitions et refaire une revue ciblée. |
| Rapprochements « exacts » | 100 % documentés par un commentaire humain | Dégrader les rapprochements insuffisants en `related_candidate`. |
| Associations scientifiques | 0 écriture automatique | Arrêt immédiat du flux si une écriture non validée est détectée. |

## 9. Déroulé opérationnel

1. Télécharger le lexique depuis Zenodo et le conserver hors des tables de production.
2. Produire un CSV de simulation de cinquante termes selon la stratification ci-dessus.
3. Enrichir uniquement les colonnes de proposition LLM et les raisons synthétiques.
4. Affecter les deux réviseurs ; produire leurs décisions sans pouvoir modifier les données source.
5. Calculer l’accord et isoler les désaccords pour discussion.
6. Présenter une prévisualisation administrative par terme, avec provenance et décisions.
7. Autoriser une écriture finale seulement pour les entrées acceptées, dans une future table de termes attestés ; ne pas alimenter directement les liens scientifiques existants.
8. Exporter le CSV final, le journal de validation et le rapport de qualité.

## 10. Livrables et critères de clôture

Le pilote est considéré comme clos lorsqu’il produit : un CSV de 50 lignes avec provenance complète, un rapport d’accord entre réviseurs, un journal de décisions, une liste des termes acceptés ou contextualisés, une liste des termes nécessitant recherche et une note sur les modifications requises du modèle de données.

L’exécution ne doit pas créer de données ambiguës dans les tables de production existantes. La transition vers un lot plus important ne sera proposée que si les contrôles de qualité sont remplis et si les termes acceptés sont lisibles, reliés et correctement distingués des associations chimiques ou botaniques établies.

## Références

[1]: https://doi.org/10.5281/zenodo.21261901 "Yan et al. (2026), jeu de données COCD sur Zenodo"
[2]: https://doi.org/10.1038/s41597-026-08117-y "Yan et al. (2026), article Scientific Data"
[3]: https://creativecommons.org/licenses/by/4.0/legalcode "Creative Commons Attribution 4.0 International"
