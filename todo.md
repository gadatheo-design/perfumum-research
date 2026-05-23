
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
