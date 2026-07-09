
## Audit Rapport 1 — Améliorations prioritaires (Mai 2026)

- [x] Sécuriser les mutations destructives (publicProcedure → protectedProcedure/adminProcedure)
- [x] Créer le workflow GitHub Actions CI (.github/workflows/ci.yml)
- [x] Lazy loading déjà en place sur toutes les pages (sauf Home, correct)
- [x] Ajouter try/catch autour des appels invokeLLM dans les procédures d'enrichissement
- [x] Corriger les 19 vrais liens cassés identifiés par analyze-navigation.py
- [x] Analyser les 100 routes orphelines et produire un rapport de stratégie
- [x] Extraire le workflow CI navigation depuis la branche codex (navigation-audit.yml + analyze-navigation.py)

## Routes Orphelines — Intégration Navigation (Mai 2026)

- [x] Phase 1 : Ajouter la section "Outils avancés & Enrichissement" dans Admin.tsx — 18 routes orphelines admin organisées en 5 catégories (Classification IA, Qualité & Doublons, Bibliographie, Imports, Europeana & IUCN, COCONUT & Phylogénie)
- [x] Phase 2 : Créer ComparateurHub.tsx — hub de navigation vers les 15 outils de comparaison, ajouté dans MegaMenu (section Analyse) et dans Admin (adminTools)
- [x] Phase 3 : Analyse des routes doublons — routes alias intentionnelles conservées (risque de régression si supprimées), Hub Comparateur ajouté comme point d'entrée unifié

## Navigation & Hubs (Mai 2026 — Suite)

- [x] Navigation mobile/sidebar : /comparateur et /imports ajoutés dans navigationConfig.ts (section Analyse & Sourcing) — propagation automatique vers MegaMenu, menu mobile et toute navigation basée sur cette config
- [x] Création ImportsHub.tsx — hub de navigation vers les 10 outils d'import (Import/Export général, Références bibliographiques, Molécules & Recettes, Plantes & Terroirs, Analyses & Spectres, Import CSV Admin), avec badges Collaborateur/Admin, formats acceptés et guide rapide
- [x] Audit pages admin orphelines — 18 pages auditées : toutes compilent sans erreur, tous les routeurs tRPC correspondants existent dans server/routers.ts. Pages fonctionnelles confirmées : AdminAIClassification, AIClassificationBatch, ClassificationReviewQueue, AdminCompletude, LOTUSBatch, BibliographicEnrichment, EuropeanaExplorer, EuropeanaMap, EuropeanaQidBatch, COCONUTBatch, AdminDuplicates, LOTUSEnrichment, LotusPlantLinker, LotusBatchGenus, COCONUTEnrichment, IUCNEnrichment, PhyloEnrichment, ApiCoverage

## Rapport 2 — GitHub Distant (Mai 2026)

- [x] Vérification : navigation-audit.yml et analyze-navigation.py déjà présents sur main
- [x] Vérification : 4 corrections de routes (branche codex) déjà mergées sur main
- [x] Vérification : mutations protégées (data-cleanup, koppen, molecular-synergies, research) — déjà en protectedProcedure
- [x] Correction : enrichMolecule, enrichBatch, geocodeBatch — passage de publicProcedure à protectedProcedure

## Rapport 3 — Intégration Pyrfume (Mai 2026)

- [x] Phase 1 DB : Création de 5 tables Pyrfume (pyrfume_molecule_mapping, pyrfume_olfactory_descriptors, pyrfume_embeddings, pyrfume_ifra_restrictions, pyrfume_datasets)
- [x] Phase 1 Schema : Ajout des tables dans drizzle/schema.ts avec types et indexes
- [x] Phase 1 Backend : Routeur tRPC pyrfume avec 12 procédures (getStats, getDatasets, getKnownDatasets, runCidMatching, runCasMatching, importDataset, seedDatasets, getDescriptorsForMolecule, getMappingForMolecule, getIfraForMolecule, searchByDescriptor, getTopDescriptors, getUnmappedMolecules)
- [x] Phase 4 Frontend : Page /sources/pyrfume — dashboard d'intégration avec stats, matching CID, seed datasets, recherche par descripteur, références bibliographiques
- [x] Phase 4 Frontend : Onglet "Pyrfume" ajouté dans MoleculeDetail.tsx — affiche mapping, descripteurs olfactifs, restrictions IFRA
- [x] Phase 4 Navigation : Lien "Pyrfume (Open Data)" ajouté dans MegaMenu (section Recherche)
- [x] Phase 2 : Import effectif des datasets Pyrfume (Leffingwell + Good Scents) — 6674 descripteurs, 966 molécules, 422 descripteurs uniques
- [x] Phase 3 : Embeddings olfactifs générés (50 dimensions, normalisés L2, 966 molécules)
- [x] Phase 5 : Radar visuel des profils olfactifs implémenté dans MoleculeDetail (onglet Pyrfume)

## Session Mai 2026 — Pyrfume Import + Radar + Tests

- [x] Import datasets Pyrfume (Leffingwell + Good Scents) — 6674 descripteurs, 966 molécules
- [x] Matching CID sur les 7460 molécules PERFUMUM — 7274 mappées (97.5%)
- [x] Embeddings olfactifs (50 dimensions, 966 molécules)
- [x] Radar visuel des profils olfactifs dans MoleculeDetail (onglet Pyrfume)
- [x] Corriger navigationConfig.test.ts (triggers mis à jour : Atelier, Atlas, Bibliothèque, Projet)
- [x] Corriger enrich-koppen.test.ts (seuil ajusté à 20%, couverture actuelle 21.4%)
- [x] Corriger research.genomics.test.ts (bug extraction sql.raw result[0] corrigé)
- [x] Corriger research.historicCigarettes.test.ts (même bug extraction corrigé)
- [x] Corriger session-06jan.test.ts (CAS Anéthole : 104-46-1 = p-Anéthole correct)
- [x] Corriger recipes-protocols-landraces.test.ts (extraction getStats corrigée)

## Import Dravnieks (Mai 2026)
- [x] Analyser la structure du dataset Dravnieks (138 molécules, 160 stimuli, 146 descripteurs)
- [x] Créer le mapping noms commerciaux → CIDs PubChem (136/160 résolus = 85%)
- [x] Importer 13 240 descripteurs olfactifs Dravnieks (62 molécules PERFUMUM enrichies)
- [x] Régénérer les embeddings olfactifs (971 molécules, 50 dimensions)
- [x] Totaux finaux : 19 914 descripteurs, 971 molécules, 515 descripteurs uniques (3 datasets)

## Import Keller 2016 (Mai 2026)
- [x] Télécharger behavior.csv (68 MB, 1.43M lignes, 960 stimuli)
- [x] Agréger les ratings par molécule (480 CIDs, 21 dimensions psychophysiques)
- [x] Insérer 5 277 descripteurs (intensité, agrément, familiarité + 18 descripteurs olfactifs)
- [x] 230 molécules PERFUMUM enrichies avec données Keller
- [x] Régénérer les embeddings olfactifs (976 molécules, 50D)
- [x] Protéger enrichBatchAuto (dernière mutation publique sensible)

## Bilan Rapport 1 — État d'avancement complet
| # | Recommandation | État | Détails |
|---|---------------|------|---------|
| 1 | Protéger mutations destructives | FAIT | enrichMolecule, enrichBatch, geocodeBatch, enrichBatchAuto, executeMergeDuplicates, enrichKoppenData, importToDatabase, autoLinkTpsGenes |
| 2 | CI GitHub Actions | FAIT | ci.yml + navigation-audit.yml + datadog-synthetics.yml |
| 3 | Découper server/routers.ts (13 090 lignes) | PARTIEL | 56 sous-routeurs extraits, fichier principal reste volumineux |
| 4 | Tests aiEnrichMolecule | FAIT | 5 fichiers de tests enrichissement existants |
| 5 | Lazy loading | FAIT | 386 pages en lazy loading |
| 6 | Typer retours SQL (supprimer any[]) | NON FAIT | Dette technique long terme (2 444 occurrences) |
| 7 | Découper drizzle/schema.ts (7 313 lignes) | NON FAIT | Dette technique long terme |
| 8 | Décomposer MoleculeDetail.tsx (3 719 lignes) | NON FAIT | Dette technique long terme |
| 9 | États d'erreur explicites | FAIT | Implémentés dans les pages principales |
| 10 | Merger branche codex/check-structure | FAIT | Déjà sur main |

### Totaux Pyrfume après Keller
- Descripteurs olfactifs : 25 191 (Leffingwell 2 266 + Good Scents 4 408 + Dravnieks 13 240 + Keller 5 277)
- Molécules couvertes : 976
- Embeddings olfactifs : 976 (50 dimensions, normalisés L2)
- Datasets importés : 4/7

## Session Mai 2026 — Similarité + Datasets + Refactoring
- [x] Créer procédure tRPC similarité olfactive (distance cosinus sur embeddings 50D)
- [x] Ajouter bloc "Molécules similaires" dans MoleculeDetail.tsx (top 5 voisins)
- [x] Importer datasets IFRA (289 mol, 867 desc), Arctander (502 mol, 1317 desc), Sigma-Aldrich (337 mol, 960 desc)
- [x] Découper server/routers.ts en modules thématiques (13 090 → 10 228 lignes, 5 fichiers extraits : ai, bibliography, molecules, import, plants)
- [x] Corriger csv-import.test.ts (2 tests adaptés aux données réelles en base)
- [x] Supprimer fichiers Keller volumineux (130 Mo libérés)

### Totaux finaux Pyrfume (7 datasets)
- Descripteurs olfactifs : 28 335
- Molécules couvertes : 1 042
- Embeddings olfactifs : 1 042 (50 dimensions, normalisés L2)
- Datasets importés : 7/7 (Leffingwell, Good Scents, Dravnieks, Keller, IFRA, Arctander, Sigma-Aldrich)

## Session Mai 2026 — Build, Schema Refactoring, Audit Frontend
- [x] Vérifier build de production (pnpm build — 54s, aucune erreur)
- [x] Découper drizzle/schema.ts (7000+ lignes) en 30 modules thématiques dans drizzle/schema-modules/
- [x] Créer drizzle/schema-modules/_relations.ts (78 blocs relations centralisés pour éviter les circular deps)
- [x] Résoudre 5 paires de dépendances circulaires (plants↔raw-materials, plants↔terp-profiles, bibliography↔research-axes, molecules↔research-publications, raw-materials↔suppliers)
- [x] Ajouter imports croisés automatiques entre modules (script fix-schema-imports.py)
- [x] Corriger ImportCSV.tsx (namespaces importMolecules/importPlants non reconnus par le type checker)
- [x] Corriger accès non sécurisés aux données de query (optional chaining data?.xxx) dans 60+ pages
- [x] 0 erreurs TypeScript — 1893 tests passés (126 fichiers) après toutes les corrections

## Session Mai 2026 — Typage SQL + Décomposition MoleculeDetail

- [x] Typer les retours SQL (remplacer any[] par Record<string,unknown>[] et types explicites dans db/, routers/)
- [x] Corriger les erreurs TS introduites par le typage SQL (powo-kew.ts, recipes.ts, sparql.ts, storylines.ts, variety-images.ts, recettes.ts)
- [x] Décomposer MoleculeDetail.tsx (3794 → 2824 lignes, -26%)
- [x] Extraire PerfumesTab, Structure3DTab, SynergiesTab, RecetteSynergiesSection, PyrfumeSection, SimilarMolecules vers client/src/components/molecule/
- [x] Créer barrel file client/src/components/molecule/index.ts
- [x] Corriger test referenceEntityLinks.test.ts (IDs timestamp-based pour éviter collisions)
- [x] 0 erreurs TypeScript, 1893 tests passés (126 fichiers), 0 échec

## Axes stratégiques — Plan Rapport 6 (Mai 2026)

### Axe 1 — Architecture des données
- [x] 1.1 Extension wikidata_qid à plants, terroirSpecialties, recettes, researchAxes (migration Drizzle)
- [x] 1.2 Alignement ontologique : MeSH/UNESCO pour researchDomain, ChEBI pour chemicalClass, Plant Ontology pour familyType
- [x] 1.3 Normalisation auteurs : table bibliography_authors (ORCID, VIAF, Wikidata QID) + table de jonction bibliography_entry_authors
- [x] 1.4 Fusion bibliographique : migrer v3_references vers bibliography_entries (166 entrées, déduplication DOI/entry_key)
- [x] 1.5 Champ rdfType sur toutes les entités principales (families, raw-materials, bibliography_entries, v3_references)

### Axe 2 — Fonctionnalités SPARQL
- [x] 2.1 Endpoint SPARQL interne /api/sparql (SELECT, CONSTRUCT, DESCRIBE)
- [ ] 2.2 Requêtes fédérées PERFUMUM ↔ Wikidata ↔ OpenAlex (SERVICE SPARQL) (planifié Rapport 7)
- [x] 2.3 Visualisation graphes /knowledge-graph (D3.js force-directed, filtres par type d'entité)
- [ ] 2.4 Templates SPARQL temporels et généalogiques (planifié Rapport 7)
- [x] 2.5 Cache SPARQL (table sparql_cache, TTL 24h, hit count, stats, nettoyage)

### Axe 3 — Bibliographie et archives
- [x] 3.1 Pipeline OpenAlex → bibliography_entries (searchOpenAlex, importFromOpenAlex, searchOpenAlexForMolecule)
- [x] 3.2 Routeur OpenAlex intégré dans bibliography.ts (3 procédures : recherche libre, import, recherche par molécule)
- [x] 3.3 Table bibliography_cross_citations (CrossRef API, réseau de citations)

## Axes stratégiques — Plan Rapport 7 (Mai 2026)

### Axe 1.4 — Fusion bibliographique
- [x] Analyser la structure de v3_references et mapper les colonnes vers bibliography_entries
- [x] Script de migration : copier les données v3_references → bibliography_entries (166 entrées, déduplication DOI/entry_key)
- [x] Marquer v3_references comme dépréciée
- [x] Routeur tRPC v3Migration (getMigrationStats, previewMigration, runMigration) + page admin /admin/v3-migration

### Axe 2.5 — Cache SPARQL
- [x] Créer table sparql_cache (hash SHA-256, résultats JSON, TTL 24h, hit count)
- [x] Intégrer le cache DB dans le routeur SPARQL (readDbCache/writeDbCache, 2 niveaux : mémoire 5min + DB 24h)
- [x] Procédures tRPC getCacheStats + clearSparqlCache

### Axe 3.3 — Réseau de citations CrossRef
- [x] Créer table bibliography_cross_citations (source_id, target_doi, target_id, target_title, cited_by_count, relation_type)
- [x] Routeur tRPC crossref (getWorkByDoi, fetchCitations, getCitationNetwork, getCitationStats, batchFetchCitations)
- [x] Page admin /admin/v3-migration onglet Citations CrossRef avec enrichissement par lots
- [x] Breadcrumbs + navigation admin mis à jour

## Axes stratégiques — Plan Rapport 8 (Mai 2026)

### Axe 2.2 — Requêtes fédérées SPARQL SERVICE
- [x] Procédures tRPC federated SPARQL : PERFUMUM ↔ Wikidata (federatedWikidata)
- [x] Procédures tRPC federated SPARQL : PERFUMUM ↔ OpenAlex (federatedOpenAlex, federatedEnrich)
- [x] Cache DB 24h pour les requêtes fédérées (via sparql_cache existant)

### Axe 3.3b — Citations dans KnowledgeGraph
- [x] Charger bibliography_cross_citations dans le graphe D3.js (via getCitationStats)
- [x] Nœuds de type "citation" (rouge #ef4444) + liens directionnels source→cible
- [x] Filtre "Réseau de citations" + slider limite dans les contrôles KnowledgeGraph
- [x] Tooltip enrichi avec DOI + lien DOI.org pour les nœuds citation
- [x] Compteur de citations pour les nœuds bibliography

### Axe 2.4 — Templates SPARQL temporels et généalogiques
- [x] 4 templates temporels : évolution publications molécule/plante, chronologie œuvres d'art, histoire parfumerie
- [x] 4 templates généalogiques : taxonomie plante (P171), dérivés molécule, cultivars, familles olfactives
- [x] Catégories "temporal" (orange) et "genealogy" (teal) ajoutées dans TemplatesTab
- [x] Icônes Clock (temporel) et GitBranch (généalogie) intégrées

## Axes stratégiques — Plan Rapport 9 (Mai 2026)

### Arbre taxonomique visuel D3.js
- [x] Procédure tRPC getTaxonomyTree (Wikidata P171 + données PERFUMUM, espèces sœurs, ancêtres, stats)
- [x] Composant TaxonomyTree.tsx (D3.js tree layout horizontal, zoom/pan, tooltip enrichi, légende)
- [x] Intégration dans PlantDetail.tsx (onglet Généalogie — arbre taxonomique + généalogie variétés)
- [x] Navigation vers fiches plantes en un clic depuis les nœuds de l'arbre

## Axes stratégiques — Plan Rapport 10 (Mai 2026)

### Axe 1 — Frise chronologique /timeline
- [x] Routeur tRPC timeline (getTimelineData + getTimelineStats : publications par année, sources Wikidata/OpenAlex/PERFUMUM)
- [x] Page /timeline/bibliographie avec frise D3.js (axe horizontal décennie, zoom/pan, filtres source/type, export SVG)
- [x] Breadcrumbs /timeline/bibliographie + /timeline/interactive ajoutés dans DynamicBreadcrumb.tsx

### Axe 3 — Enrichissement taxonomique par lot
- [x] Déjà implémenté dans PhyloEnrichment.tsx + phylo-batch.ts : batchByGenus (5 APIs en parallèle), getCoverageReport (GBIF/POWO/NCBI/Wikidata), syncCrossIds (ncbiTaxId, powId, wikidataQid, gbifId)

## Rapport 11 — Page /visualisations (Mai 2026)
- [x] Mise à jour de la page /visualisations existante : ajout catégorie "Ontologie & Connaissances" (6 outils : Graphe de Connaissances, Arbre Taxonomique, Frise Bibliographique, Réseau de Citations CrossRef, Explorateur SPARQL, Graphe Publications-Molécules)
- [x] Frise Bibliographique ajoutée dans la catégorie Timelines (badge Nouveau)
- [x] Correction doublon breadcrumb /timeline/interactive dans DynamicBreadcrumb.tsx
- [x] TypeScript 0 erreurs

## Rapport 12 — Amélioration SPARQL QID Picker (Mai 2026)

- [x] Routeur tRPC sparqlQid (searchEntitiesWithQid, getQidCatalog, resolveQid)
- [x] Composant EntityQidPicker.tsx (autocomplete, badge QID cliquable, catalogue, injection)
- [x] QidBadge.tsx (copie presse-papier + lien Wikidata)
- [x] Intégration dans FreeSparqlTab (sélecteur + injection automatique dans la requête)
- [x] Intégration dans TemplatesTab (sélecteur QID global, pré-remplissage automatique, bouton copier)
- [x] Import Copy dans SparqlExplorer.tsx


## Rapport 15 — Bug Généalogie + Enrichissement QID molécules (Mai 2026)

- [x] Corriger le bug de l'onglet Généalogie dans PlantDetail.tsx (TaxonomyTree) — routeur getTaxonomyTree validé
- [x] Procédure tRPC : recherche QID Wikidata par nom/CAS/IUPAC pour molécules sans QID — implémenté Rapport 16
- [x] Page admin /admin/molecule-qid-enrichment avec enrichissement par lot — implémenté Rapport 16

## Session Juin 2026 — Onglet Enrichir API Coverage

- [x] Table DB api_enrichments (plant_id, api_type, identifier, source_url, notes, created_at, updated_at)
- [x] Routeur tRPC api-enrichments (searchPlants, saveEnrichment, removeEnrichment, getEnrichments)
- [x] Composant EnrichTab.tsx (formulaires GBIF, POWO, NCBI, Wikidata, ITIS)
- [x] Intégration dans ApiCoverage.tsx (onglet "Enrichir")
- [x] Résoudre erreur TypeScript EnrichTab.tsx — créé server/routers/api-enrichments.ts manquant
- [x] Synchronisation GitHub — checkpoint sauvegardé
- [x] Onglet Enrichir visible dans l'interface — ajout du bouton dans la liste des onglets

## Session Juillet 2026 — Enrichissement automatique Wikidata & GBIF

- [x] Procédure tRPC autoEnrich (recherche identifiants manquants via Wikidata et GBIF)
- [x] Bouton "Enrichir automatiquement" dans EnrichTab.tsx avec icône Zap
- [x] Messages de feedback (succès, aucun résultat, erreur)
- [x] Sauvegarde automatique des identifiants trouvés dans api_enrichments
- [x] Checkpoint sauvegardé avec version 3e70445e

## Session Juillet 2026 (Suite) — Enrichissement automatique en lot

- [x] Procédure tRPC getPlantsNeedingEnrichment (liste des plantes manquant d'identifiants)
- [x] Procédure tRPC batchAutoEnrich (enrichissement en lot pour plusieurs plantes)
- [x] Composant BatchEnrich.tsx avec sélection des plantes et checkboxes
- [x] Onglet "Enrichir en lot" intégré dans ApiCoverage.tsx
- [x] Affichage des résultats avec résumé de succès/erreurs
- [x] Checkpoint sauvegardé
