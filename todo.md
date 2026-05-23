
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
