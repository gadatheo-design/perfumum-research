# PERFUMUM — Analyse des Tâches Manquantes

**Date d'analyse** : 03 janvier 2026  
**Total tâches non complétées** : 102  
**Total tâches complétées** : 136  

---

## 🔴 PRIORITÉ CRITIQUE (Bugs & Erreurs)

### Erreurs TypeScript à corriger immédiatement
Les erreurs suivantes bloquent potentiellement le build :
- `server/routers.ts(2510)` : Property 'getRadicalRecipes' does not exist on type 'typeof import("server/db")'
- `server/routers.ts(2539)` : Property 'createFinalRecipe' does not exist on type 'typeof import("server/db")'
- `server/routers.ts(2570)` : Property 'updateFinalRecipe' does not exist on type 'typeof import("server/db")'

**Action requise** : Ajouter les fonctions manquantes dans `server/db.ts`

---

## 🟠 PRIORITÉ HAUTE (Fonctionnalités Core)

### Phase 3 : Dashboard de Gestion Unifié (8 tâches)
- [ ] Analyser les données d'agenda existantes
- [ ] Analyser les données de budget existantes
- [ ] Analyser les données de mentorat existantes
- [ ] Concevoir l'interface du dashboard de gestion
- [ ] Créer les procédures tRPC pour le dashboard
- [ ] Implémenter la vue unifiée du dashboard
- [ ] Intégrer le dashboard dans le menu principal
- [ ] Tester toutes les fonctionnalités du dashboard

### Interface Molécules (2 tâches)
- [ ] Mettre à jour l'interface MoleculeDetail pour afficher les nouvelles données (IUPAC, CAS, classe chimique)
- [ ] Créer l'interface de visualisation des origines géographiques

### Restrictions IFRA (2 tâches)
- [ ] Importer les données IFRA par catégorie de produit
- [ ] Créer l'interface d'affichage des restrictions sur les fiches molécules

---

## 🟡 PRIORITÉ MOYENNE (Fonctionnalités Avancées)

### San Andrés / Seaflower (5 tâches)
- [ ] Créer un système d'import CSV pour les futurs échantillons
- [ ] Créer un système d'export des données (CSV, JSON)
- [ ] Créer une page de visualisation des molécules par échantillon
- [ ] Créer un système de timeline pour suivre l'évolution des recherches
- [ ] Créer une page de bibliographie/sources pour San Andrés

### TerpProfiles - Phase 7 (7 tâches)
- [ ] Créer le schéma de table `terp_profiles` pour les fiches analytiques
- [ ] Créer les procédures tRPC pour les TerpProfiles
- [ ] Importer les 10 fiches TerpProfiles (SA-TP-01 à SA-TP-10)
- [ ] Créer l'interface de visualisation des fiches avec toggles
- [ ] Créer les filtres par axe climatique, plante source, usage
- [ ] Créer la vue de comparaison (2-3 fiches côte à côte)
- [ ] Intégrer les TerpProfiles dans le menu principal

### Tableau Comparatif - Phase 8 (5 tâches)
- [ ] Créer/étendre le schéma pour les formules avec champs comparatifs
- [ ] Créer la vue tableau comparatif avec filtres
- [ ] Créer le mode "Compare" pour 2-3 formules côte à côte
- [ ] Créer le graphique radar climatique
- [ ] Afficher les règles Absorbe sur le site

### Recettes Finales - Phase 9 (6 tâches)
- [ ] Créer le schéma pour les recettes finales (parfum, encens, espace)
- [ ] Importer les 3 recettes parfum (PF-01, PF-02, PF-03)
- [ ] Importer les 3 recettes encens (EN-01, EN-02, EN-03)
- [ ] Importer les 3 protocoles espace (ES-01, ES-02, ES-03)
- [ ] Créer l'interface de visualisation des recettes
- [ ] Intégrer les règles de publication

---

## 🟢 PRIORITÉ BASSE (Améliorations Long Terme)

### Architecture Extensible (4 tâches)
- [ ] Concevoir l'architecture modulaire pour l'ajout continu de données
- [ ] Définir les conventions de nommage et d'identification
- [ ] Créer le système de versioning des données botaniques
- [ ] Documenter les standards de saisie des données

### Extension Schéma Plants (8 tâches)
- [ ] Ajouter les champs de classification taxonomique complète
- [ ] Ajouter les champs de morphologie
- [ ] Ajouter les champs de cycle de vie
- [ ] Ajouter les champs de conditions de culture
- [ ] Ajouter les champs de période de récolte
- [ ] Ajouter les champs de rendement
- [ ] Ajouter les champs de conservation
- [ ] Ajouter les champs de certification

### Table Variétés (5 tâches)
- [ ] Créer la table `plant_varieties` pour les variétés/cultivars
- [ ] Lier les variétés aux plantes parentes
- [ ] Ajouter les champs de sélection
- [ ] Ajouter les champs de caractéristiques distinctives
- [ ] Ajouter les champs de disponibilité commerciale

### Table États Botaniques (4 tâches)
- [ ] Créer la table `botanical_states` pour les états de la plante
- [ ] Définir les stades (germination, végétatif, floraison, etc.)
- [ ] Lier les états aux profils moléculaires correspondants
- [ ] Ajouter les champs de durée et conditions de transition

### Interface Plantes Avancée (7 tâches)
- [ ] Créer le formulaire d'ajout/édition complet
- [ ] Créer la galerie d'images
- [ ] Créer la timeline d'évolution
- [ ] Créer la vue de comparaison multi-plantes
- [ ] Créer les graphiques de profils moléculaires comparés
- [ ] Créer les cartes de terroirs avec filtres
- [ ] Créer les tableaux de rendements comparés

### Recherche Avancée Plantes (5 tâches)
- [ ] Créer la recherche par profil moléculaire
- [ ] Créer la recherche par caractéristiques olfactives
- [ ] Créer la recherche par terroir et climat
- [ ] Créer la recherche par usage
- [ ] Créer les filtres combinés avancés

### Import/Export (4 tâches)
- [ ] Créer le système d'import CSV/Excel pour les plantes
- [ ] Créer le système d'import pour les analyses GC-MS
- [ ] Créer l'export PDF des fiches plantes
- [ ] Créer l'export JSON pour l'interopérabilité

### Documentation (4 tâches)
- [ ] Créer le guide de saisie des données botaniques
- [ ] Créer le glossaire des termes botaniques
- [ ] Créer les fiches méthodologiques (extraction, analyse)
- [ ] Documenter les conventions du projet

---

## 📋 TESTS & VALIDATION (Récurrents)

- [ ] Tester le routing sur toutes les pages
- [ ] Valider l'import des données
- [ ] Tester le dashboard de gestion
- [ ] Vérifier la responsivité mobile
- [ ] Créer/mettre à jour les tests unitaires
- [ ] Tester l'interface sur desktop et mobile
- [ ] Valider l'intégrité des données importées
- [ ] Tester le cache offline après réactivation
- [ ] Valider les filtres et recherches

---

## 🎯 RECOMMANDATION D'ORDRE D'EXÉCUTION

1. **Immédiat** : Corriger les erreurs TypeScript (db.ts)
2. **Court terme** : Dashboard de gestion + Interface MoleculeDetail
3. **Moyen terme** : TerpProfiles + Tableau comparatif + Recettes finales
4. **Long terme** : Architecture extensible + Extensions schéma + Documentation

---

## 📊 RÉSUMÉ PAR CATÉGORIE

| Catégorie | Tâches | Priorité |
|-----------|--------|----------|
| Bugs/Erreurs | 3 | Critique |
| Dashboard Gestion | 8 | Haute |
| Interfaces Core | 4 | Haute |
| San Andrés | 5 | Moyenne |
| TerpProfiles | 7 | Moyenne |
| Tableau Comparatif | 5 | Moyenne |
| Recettes Finales | 6 | Moyenne |
| Architecture | 4 | Basse |
| Schéma Plants | 8 | Basse |
| Variétés | 5 | Basse |
| États Botaniques | 4 | Basse |
| Interface Plantes | 7 | Basse |
| Recherche Avancée | 5 | Basse |
| Import/Export | 4 | Basse |
| Documentation | 4 | Basse |
| Tests | 9 | Récurrent |

**Total** : 102 tâches non complétées
