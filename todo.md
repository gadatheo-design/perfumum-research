
## Audit Rapport 1 — Améliorations prioritaires (Mai 2026)

- [x] Sécuriser les mutations destructives (publicProcedure → protectedProcedure/adminProcedure)
- [x] Créer le workflow GitHub Actions CI (.github/workflows/ci.yml)
- [x] Lazy loading déjà en place sur toutes les pages (sauf Home, correct)
- [x] Ajouter try/catch autour des appels invokeLLM dans les procédures d'enrichissement
- [x] Corriger les 19 vrais liens cassés identifiés par analyze-navigation.py
- [x] Analyser les 100 routes orphelines et produire un rapport de stratégie
- [x] Extraire le workflow CI navigation depuis la branche codex (navigation-audit.yml + analyze-navigation.py)
