# Audit structure générale & liens — 12/02/2026

## Résumé
- **Routes détectées** : 386.
- **Liens internes détectés** : 181.
- **Liens cassés** : 0 après corrections.
- **Routes orphelines (échantillon)** : 30.
- **Routes non exposées par la navigation principale (échantillon)** : 50.

_Source: `python3 analyze-navigation.py` + `navigation-audit-report.json`._

## Ce qui cassait les liens (et a été corrigé)
1. **Routes legacy non alignées avec les hubs**
   - `/generateur-formules` pointait vers une route qui n'existait plus.
   - correction vers `/outils/generateur-formules`.

2. **Nommage de route incohérent (EN vs FR)**
   - `/variety/new` alors que l'app expose `/varietes/new`.

3. **Chemins outils obsolètes**
   - `/outils/dilution-calculator` remplacé par `/outils/dilution`.

4. **Lien publication non mappé**
   - `/research-publications` remplacé par une route existante `/bibliographie-hub`.

5. **Script d'audit imprécis**
   - Le script ne détectait pas correctement les routes `LazyRoute` / redirections inline.
   - Il supposait un chemin absolu local (`/home/ubuntu/...`) au lieu de chemin repo courant.

## Analyse structurelle
### Points positifs
- La base de routing est riche et couvre de nombreux cas (hubs, legacy, admin, outils).
- Les redirections de compatibilité existent déjà pour plusieurs parcours.

### Fragilités observées
- **Surface de navigation élevée** (386 routes) : coût de maintenance important.
- **Beaucoup de routes “non accessibles menu”** : plusieurs pages ne sont atteignables que par liens profonds.
- **Conventions de slugs hétérogènes** : mélange FR/EN (`varietes` vs `variety`, `outils/...` vs alias historiques).

## Améliorations recommandées
1. **Centraliser les routes dans une map typée**
   - Créer un registre `routes.ts` (constantes exportées).
   - Interdire les chaînes hardcodées dans les composants (lint rule possible).

2. **Unifier les slugs**
   - Standardiser sur FR (`/varietes/...`, `/outils/...`) + garder des redirections legacy explicites.

3. **Renforcer l'audit en CI**
   - Ajouter une commande CI qui exécute `python3 analyze-navigation.py`.
   - Échec CI si `broken_links > 0`.

4. **Navigation principale plus explicite**
   - Exposer les hubs majeurs et les flux clés via menu desktop + mobile.
   - Ajouter une page “Plan du site / Explorer” pour accéder aux sections non menuisées.

5. **KPI de navigation**
   - Suivre mensuellement: nombre de routes, liens cassés, routes orphelines, routes menuisées.

## Conclusion
L'état actuel est **sain côté liens cassés (0)** après correction ciblée, mais la **complexité structurelle reste élevée**. La prochaine étape prioritaire est de **réduire la dispersion des routes** (registre central + conventions de slug + contrôle CI).
