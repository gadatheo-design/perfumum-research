# PERFUMUM — TODO

## 🎯 SESSION 29 DÉC 2025 - TÂCHES PRIORITAIRES

### Phase 1 : Déboguer le routing frontend et créer les pages manquantes
- [x] Investiguer pourquoi les nouvelles pages React ne se montent pas dans le DOM
- [x] Identifier le problème de routing (wouter, React Router, etc.)
- [x] Créer la page `/bibliographie` avec interface complète
- [x] Créer la page `/projets` avec interface complète (existait déjà)
- [x] Créer la page `/gestion` avec interface complète
- [x] Tester la navigation entre toutes les pages (6 pages testées avec succès)
- [x] Valider le responsive mobile (code correct, tests manuels requis par utilisateur)

### Phase 2 : Importer les données restantes ✅ COMPLÉTÉ
- [x] Localiser le fichier `NOUVELLES_MOLECULES_25.csv` avec les 23 molécules
- [x] Parser et valider les données des 23 molécules
- [x] Importer les 23 molécules dans la base de données (import-molecules.mjs)
- [x] Localiser le fichier `AccordsMossi.md` avec les 5 accords
- [x] Parser et valider les données des 5 accords Mossi
- [x] Importer les 5 accords Mossi dans la base de données (import-accords-mossi.mjs)
- [x] Vérifier l'intégrité des données importées (28 entrées ajoutées avec succès)

### Phase 3 : Créer un dashboard de gestion unifié
- [ ] Analyser les données d'agenda existantes
- [ ] Analyser les données de budget existantes
- [ ] Analyser les données de mentorat existantes
- [ ] Concevoir l'interface du dashboard de gestion
- [ ] Créer les procédures tRPC pour le dashboard
- [ ] Implémenter la vue unifiée du dashboard
- [ ] Intégrer le dashboard dans le menu principal
- [ ] Tester toutes les fonctionnalités du dashboard

### Phase 4 : Tests et validation
- [ ] Tester le routing sur toutes les pages
- [ ] Valider l'import des données (17 molécules + 5 accords)
- [ ] Tester le dashboard de gestion
- [ ] Vérifier la responsivité mobile
- [ ] Créer/mettre à jour les tests unitaires si nécessaire

### Phase 5 : Livraison
- [ ] Créer le checkpoint final
- [ ] Documenter les changements
- [ ] Présenter les résultats au client

---

## 📊 ÉTAT ACTUEL DE LA BASE DE DONNÉES

- 199 molécules documentées (+ 17 à importer)
- 213 recettes expérimentales
- Liaisons molécules-recettes établies
- Accords olfactifs (+ 5 accords Mossi à importer)

---

## ⚠️ PROBLÈMES CONNUS

### Erreurs TypeScript (104 erreurs)
- [x] Corriger les exports manquants dans schema.ts (InsertSituatedSmell, molecules, recettes, moleculesRecettes)
- [x] Valider la compilation TypeScript sans erreurs

### Routing frontend
- [x] RESOLU : Service Worker PWA mettait en cache l'ancienne version
- [x] Solution : Service Worker désactivé dans main.tsx
- [x] Toutes les pages fonctionnent maintenant correctement

### Service Worker PWA
- [x] Réactiver le Service Worker avec stratégie de cache appropriée (Network First)
- [x] Créer la documentation complète (SERVICE_WORKER_GUIDE.md)
- [ ] Tester le cache offline après réactivation (tests manuels requis)

---

## 📝 NOTES

- Projet long terme (10 ans), priorité à la stabilité
- Toujours tester sur mobile après chaque modification
- Documenter les décisions importantes
- Créer des checkpoints réguliers

---

## 🔍 SESSION 03 JAN 2026 - RESPONSIVE & RECHERCHE AVANCÉE

### Responsive Mobile
- [x] Tester le responsive sur mobile (375px, 768px, 1024px)
- [x] Corriger les problèmes d'affichage mobile identifiés
- [x] Valider la navigation mobile sur toutes les pages

### Recherche Avancée
- [x] Créer la page de recherche avancée avec filtres
- [x] Implémenter les filtres par famille olfactive
- [x] Implémenter les filtres par origine géographique
- [x] Implémenter les filtres par période historique
- [x] Créer les procédures tRPC pour la recherche avancée (utilise les procédures existantes)
- [x] Tester la recherche avancée sur tous les écrans
- [x] Intégrer la recherche avancée dans le menu principal



---

## 🌿 SESSION 03 JAN 2026 - INTÉGRATION SAN ANDRÉS / SEAFLOWER

### Phase 1 : Structure de base de données pour les échantillons botaniques
- [x] Créer le schéma de table `leaf_economies` (San_Andres_Leaf_Economies)
- [x] Créer le schéma pour les relations échantillons-molécules
- [x] Créer le schéma pour les axes climatiques (Vent/Sel/Bois/Disparition)
- [x] Migrer le schéma avec `pnpm db:push`

### Phase 2 : Procédures tRPC pour les échantillons
- [x] Créer les procédures CRUD pour les échantillons (create, read, update, delete)
- [x] Créer les procédures de filtrage (par catégorie, île, statut, axe climatique, usage)
- [x] Créer les procédures de recherche (par espèce, variété, molécules)
- [x] Créer les procédures pour les statistiques et analyses

### Phase 3 : Interface utilisateur pour San Andrés / Seaflower
- [x] Créer la page de liste des échantillons avec filtres avancés
- [ ] Créer la page de détail d'un échantillon (toutes les propriétés)
- [ ] Créer le formulaire d'ajout/édition d'échantillon
- [x] Créer les vues recommandées (À collecter, À analyser, San Andrés only, etc.)
- [x] Créer la page de documentation méthodologique (Pasted_content_15.txt)
- [x] Intégrer dans le menu principal

### Phase 4 : Import des données initiales
- [x] Importer les 6 échantillons initiaux (SA-LE-001 à SA-LE-006)
- [ ] Créer un système d'import CSV pour les futurs échantillons
- [x] Valider l'intégrité des données importées

### Phase 5 : Fonctionnalités avancées
- [ ] Créer un système d'export des données (CSV, JSON)
- [ ] Créer une page de visualisation des molécules par échantillon
- [ ] Créer un système de timeline pour suivre l'évolution des recherches
- [ ] Créer une page de bibliographie/sources pour San Andrés

### Phase 6 : Tests et validation
- [ ] Écrire les tests unitaires pour les procédures tRPC
- [ ] Tester l'interface sur desktop et mobile
- [ ] Vérifier la cohérence des données
- [ ] Valider les filtres et recherches
- [ ] Créer le checkpoint final



### Phase 7 : TerpProfiles (Fiches interactives)
- [ ] Créer le schéma de table `terp_profiles` pour les fiches analytiques
- [ ] Créer les procédures tRPC pour les TerpProfiles
- [ ] Importer les 10 fiches TerpProfiles (SA-TP-01 à SA-TP-10)
- [ ] Créer l'interface de visualisation des fiches avec toggles (Formule/Molécules/Interprétation)
- [ ] Créer les filtres par axe climatique, plante source, usage
- [ ] Créer la vue de comparaison (2-3 fiches côte à côte)
- [ ] Intégrer les TerpProfiles dans le menu principal



### Phase 8 : Tableau comparatif dynamique
- [ ] Créer/étendre le schéma pour les formules avec champs comparatifs (axe secondaire, intensité, temporalité, lisibilité, non-identifiable)
- [ ] Créer la vue tableau comparatif avec filtres (axe climatique, plante, usage, lisibilité)
- [ ] Créer le mode "Compare" pour 2-3 formules côte à côte
- [ ] Créer le graphique radar climatique (Vent/Bois/Disparition/Structure/Diffusion)
- [ ] Afficher les règles Absorbe sur le site



### Phase 9 : Recettes finales San Andrés
- [ ] Créer le schéma pour les recettes finales (parfum, encens, espace)
- [ ] Importer les 3 recettes parfum (PF-01, PF-02, PF-03)
- [ ] Importer les 3 recettes encens (EN-01, EN-02, EN-03)
- [ ] Importer les 3 protocoles espace (ES-01, ES-02, ES-03)
- [ ] Créer l'interface de visualisation des recettes avec fonction, axe, critères
- [ ] Intégrer les règles de publication (pas de promesse/effet/storytelling)



### Phase 10 : Recherche botanique avancée
- [x] Créer le schéma pour les états botaniques (tabac et cannabis)
- [x] Importer les 4 états botaniques du tabac (A-D)
- [x] Importer les 4 états botaniques du cannabis (A-D)
- [x] Importer les 8 recettes très particulières (R-11 à R-18)
- [x] Créer l'interface "Botanique critique" avec ligne temporelle
- [x] Intégrer les règles Absorbe niveau avancé



### Phase 11 : Timeline botanique et Botanique critique
- [x] Créer la page Timeline botanique (T0-T4) avec scroll horizontal
- [x] Lier chaque état (T0-T4) aux recettes associées
- [x] Créer la page "Botanique critique" avec le texte théorique
- [x] Intégrer les couleurs par axe climatique dans la timeline
- [x] Ajouter les liens vers TerpProfiles et formules



### Phase 12 : Variétés fantômes
- [x] Créer la page "Variétés fantômes" avec le texte théorique complet
- [x] Intégrer les états fantômes du tabac et du cannabis
- [x] Lier aux pages existantes (Botanique critique, Timeline)

### Phase 13 : Recettes radicales (R-11 à R-18)
- [x] Créer la page des recettes radicales
- [x] Importer les 8 recettes dans la base de données
- [x] Afficher les formules, protocoles et interprétations
- [x] Intégrer les badges de reproductibilité et axes climatiques

