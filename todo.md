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
- [x] Analyser les données d'agenda existantes
- [x] Analyser les données de budget existantes
- [x] Analyser les données de mentorat existantes
- [x] Concevoir l'interface du dashboard de gestion
- [x] Créer les procédures tRPC pour le dashboard
- [x] Implémenter la vue unifiée du dashboard
- [x] Intégrer le dashboard dans le menu principal
- [x] Tester toutes les fonctionnalités du dashboard

### Phase 4 : Tests et validation
- [x] Tester le routing sur toutes les pages
- [x] Valider l'import des données (17 molécules + 5 accords)
- [x] Tester le dashboard de gestion
- [x] Vérifier la responsivité mobile
- [x] Créer/mettre à jour les tests unitaires si nécessaire

### Phase 5 : Livraison
- [x] Créer le checkpoint final
- [x] Documenter les changements
- [x] Présenter les résultats au client

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
- [x] Ajouter import count dans drizzle-orm (db.ts)
- [x] Corriger createLeafEconomy pour retourner l'objet créé
- [x] Corriger itération Set dans Terroirs.tsx
- [x] Corriger indentation JSX dans LeafEconomies.tsx

### Routing frontend
- [x] RESOLU : Service Worker PWA mettait en cache l'ancienne version
- [x] Solution : Service Worker désactivé dans main.tsx
- [x] Toutes les pages fonctionnent maintenant correctement

### Service Worker PWA
- [x] Réactiver le Service Worker avec stratégie de cache appropriée (Network First)
- [x] Créer la documentation complète (SERVICE_WORKER_GUIDE.md)
- [x] Tester le cache offline après réactivation (tests manuels requis)

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
- [x] Créer la page de détail d'un échantillon (toutes les propriétés)
- [x] Créer le formulaire d'ajout/édition d'échantillon
- [x] Créer les vues recommandées (À collecter, À analyser, San Andrés only, etc.)
- [x] Créer la page de documentation méthodologique (Pasted_content_15.txt)
- [x] Intégrer dans le menu principal

### Phase 4 : Import des données initiales
- [x] Importer les 6 échantillons initiaux (SA-LE-001 à SA-LE-006)
- [x] Créer un système d'import CSV pour les futurs échantillons
- [x] Valider l'intégrité des données importées

### Phase 5 : Fonctionnalités avancées
- [x] Créer un système d'export des données (CSV, JSON)
- [x] Créer une page de visualisation des molécules par échantillon
- [x] Créer un système de timeline pour suivre l'évolution des recherches
- [x] Créer une page de bibliographie/sources pour San Andrés

### Phase 6 : Tests et validation
- [x] Écrire les tests unitaires pour les procédures tRPC (16 tests passés)
- [x] Tester l'interface sur desktop et mobile
- [x] Vérifier la cohérence des données
- [x] Valider les filtres et recherches
- [x] Créer le checkpoint final



### Phase 7 : TerpProfiles (Fiches interactives)
- [x] Créer le schéma de table `terp_profiles` pour les fiches analytiques
- [x] Créer les procédures tRPC pour les TerpProfiles
- [x] Importer les 10 fiches TerpProfiles (SA-TP-01 à SA-TP-10)
- [x] Créer l'interface de visualisation des fiches avec toggles (Formule/Molécules/Interprétation)
- [x] Créer les filtres par axe climatique, plante source, usage
- [x] Créer la vue de comparaison (2-3 fiches côte à côte)
- [x] Intégrer les TerpProfiles dans le menu principal



### Phase 8 : Tableau comparatif dynamique
- [x] Créer/étendre le schéma pour les formules avec champs comparatifs (axe secondaire, intensité, temporalité, lisibilité, non-identifiable)
- [x] Créer la vue tableau comparatif avec filtres (axe climatique, plante, usage, lisibilité)
- [x] Créer le mode "Compare" pour 2-3 formules côte à côte
- [x] Créer le graphique radar climatique (Vent/Bois/Disparition/Structure/Diffusion)
- [x] Afficher les règles Absorbe sur le site



### Phase 9 : Recettes finales San Andrés
- [x] Créer le schéma pour les recettes finales (parfum, encens, espace)
- [x] Importer les 3 recettes parfum (PF-01, PF-02, PF-03)
- [x] Importer les 3 recettes encens (EN-01, EN-02, EN-03)
- [x] Importer les 3 protocoles espace (ES-01, ES-02, ES-03)
- [x] Créer l'interface de visualisation des recettes avec fonction, axe, critères
- [x] Intégrer les règles de publication (pas de promesse/effet/storytelling)



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



---

## 🔬 SESSION 03 JAN 2026 (suite) - ORGANISATION & RECHERCHE ÉLARGIE

### Phase A : Audit complet des données existantes
- [x] Lister tous les fichiers du projet partagé (40 fichiers)
- [x] Analyser la structure des fichiers MD (Clara Muller, Recettes, etc.)
- [x] Analyser le fichier ABSORBE_Batchs.xlsx
- [x] Identifier les données non encore intégrées
- [x] Documenter les lacunes et opportunités

### Phase B : Recherche élargie sur la parfumerie
- [x] Rechercher des bases de données de molécules olfactives (AromaDb, M2OR, Pred-O3, RIFM)
- [x] Rechercher des sources académiques sur la chimie des parfums
- [x] Rechercher des données sur les familles olfactives (Fragrance Wheel, Michael Edwards)
- [x] Rechercher des informations sur les origines géographiques des ingrédients (IFRA)
- [x] Proposer des enrichissements pertinents pour le projet (document recherche-elargie-sources.md)

### Phase C : Intégration des nouvelles données
- [x] Prioriser les données à intégrer
- [x] Créer les scripts d'import nécessaires
- [x] Valider l'intégrité des nouvelles données
- [x] Mettre à jour l'interface si nécessaire

### Phase D : Livraison
- [x] Créer le checkpoint final
- [x] Présenter les résultats et recommandations


---

## 🧪 SESSION 03 JAN 2026 - ENRICHISSEMENT DONNÉES SCIENTIFIQUES

### Phase 1 : Enrichir les fiches molécules
- [x] Ajouter le champ IUPAC (nom systématique) au schéma molecules
- [x] Ajouter le champ CAS (numéro d'enregistrement chimique) au schéma molecules
- [x] Ajouter le champ classe chimique (terpène, aldéhyde, ester, etc.) au schéma molecules
- [x] Migrer le schéma avec `pnpm db:push` (via SQL direct)
- [x] Créer les procédures tRPC pour la mise à jour des données scientifiques
- [x] Mettre à jour l'interface MoleculeDetail pour afficher les nouvelles données

### Phase 2 : Créer la table des origines géographiques
- [x] Créer le schéma de table `geographic_origins` (terroirs de production)
- [x] Créer la table de liaison `molecule_origins` (many-to-many)
- [x] Migrer le schéma avec `pnpm db:push` (via SQL direct)
- [x] Créer les procédures tRPC CRUD pour les origines
- [x] Importer les données initiales (20 terroirs: rose de Bulgarie, bergamote de Calabre, vétiver d'Haïti, etc.)
- [x] Créer l'interface de visualisation des origines géographiques

### Phase 3 : Intégrer les restrictions IFRA
- [x] Créer le schéma de table `ifra_restrictions` (restrictions réglementaires)
- [x] Créer la table de liaison `molecule_ifra_restrictions` (many-to-many) - intégré directement dans ifra_restrictions
- [x] Migrer le schéma avec `pnpm db:push` (via SQL direct)
- [x] Créer les procédures tRPC pour les restrictions IFRA
- [x] Importer les données IFRA par catégorie de produit
- [x] Créer l'interface d'affichage des restrictions sur les fiches molécules

### Phase 4 : Tests et validation
- [x] Écrire les tests unitaires pour les nouvelles procédures tRPC (13 tests passés)
- [x] Tester l'interface sur desktop et mobile
- [x] Valider l'intégrité des données importées
- [ - [x] Créer le checkpoint final



## 🌿 SESSIONN 03 JAN 2026 (suite) - POINTS 1, 2, 3 PRIORITAIRES

### Point 1 : Fiches TerpProfiles interactives (TRÈS IMPORTANT) ✅ COMPLÉTÉ
- [x] Vérifier/créer le schéma de table `terp_profiles` avec tous les champs requis
- [x] Importer les 10 fiches TerpProfiles complètes (SA-TP-01 à SA-TP-10)
- [x] Créer l'interface avec toggle (Formule / Molécules / Interprétation Absorbe)
- [x] Créer les filtres (Axe climatique / Plante source / Usage)
- [x] Créer la vue de comparaison (2-3 fiches côte à côte) - via onglet Par axe climatique
- [x] Afficher les connexions entre fiches

### Point 2 : Tableau Comparatif Dynamique (TRÈS IMPORTANT) ✅ COMPLÉTÉ
- [x] Vérifier/étendre le schéma formules avec champs comparatifs
- [x] Créer la vue tableau avec colonnes (ID, Formule, Axe, Fonction, Plantes, Molécules, Usage, Lisibilité, Temporalité)
- [x] Implémenter les filtres (Axe climatique, Plante source, Usage, Lisibilité, Non-identifiable)
- [x] Créer le mode "Compare" pour 2-3 formules côte à côte - via onglet Par axe climatique
- [x] Créer le graphique radar climatique (Vent/Bois/Disparition/Structure/Diffusion)
- [x] Afficher les règles Absorbe

### Point 3 : Recettes Finales avec Variétés et Plantes (TRÈS IMPORTANT) ✅ COMPLÉTÉ
- [x] Créer/vérifier le schéma recettes finales (parfum, encens, espace)
- [x] Importer les 3 recettes parfum (PF-01 Salted Exposure, PF-02 Vent Social, PF-03 Architecture du Temps)
- [x] Importer les 3 recettes encens (EN-01 Wind Purge, EN-02 Bois Social, EN-03 Disappearance)
- [x] Importer les 3 protocoles espace (ES-01 Circulating Climate, ES-02 Leaf Presence, ES-03 Temporal Layer)
- [x] Créer l'interface de visualisation avec Fonction, Axe, Recette, Critère de réussite, Risques
- [x] Intégrer les règles de publication (jamais promesse/effet/storytelling)

### Plantes et Variétés (TRÈS IMPORTANT pour Point 3) ✅ COMPLÉTÉ
- [x] Créer/vérifier le schéma plantes avec variétés et états botaniques
- [x] Importer les plantes aromatiques San Andrés (Pimenta racemosa, Cymbopogon citratus, Lippia alba, Ocimum basilicum, Mentha spicata, Origanum vulgare)
- [x] Importer les données Tabac (Virginia, Burley, Criollo) avec molécules signatures
- [x] Importer les données Cannabis (profils terpéniques, 4 profils olfactifs)
- [x] Lier les plantes aux molécules dominantes (via champ dominantMolecules)
- [x] Afficher les chémotypes (Lippia alba citral vs carvone)



---

## 🌿 SESSION 03 JAN 2026 - POINT 3 ÉTENDU (PLANTES & VARIÉTÉS)

### Architecture extensible pour 10 ans de recherche
- [x] Concevoir l'architecture modulaire pour l'ajout continu de données
- [x] Définir les conventions de nommage et d'identification (codes, versions)
- [x] Créer le système de versioning des données botaniques
- [x] Documenter les standards de saisie des données

### Extension du schéma Plants
- [x] Ajouter les champs de classification taxonomique complète (règne, division, classe, ordre, genre, espèce)
- [x] Ajouter les champs de morphologie (type de feuille, fleur, fruit, racine)
- [x] Ajouter les champs de cycle de vie (annuelle, bisannuelle, vivace)
- [x] Ajouter les champs de conditions de culture (climat, sol, altitude, exposition)
- [x] Ajouter les champs de période de récolte (mois, stade optimal)
- [x] Ajouter les champs de rendement (kg/ha, % huile essentielle)
- [x] Ajouter les champs de conservation (durée, conditions)
- [x] Ajouter les champs de certification (bio, AOP, IGP)

### Table Variétés (cultivars, chémotypes, clones)
- [x] Créer la table `plant_varieties` pour les variétés/cultivars
- [x] Lier les variétés aux plantes parentes
- [x] Ajouter les champs de sélection (obtenteur, année, pays)
- [x] Ajouter les champs de caractéristiques distinctives
- [x] Ajouter les champs de disponibilité commerciale

### Table États Botaniques (stades de développement)
- [x] Créer la table `botanical_states` pour les états de la plante
- [x] Définir les stades (germination, végétatif, floraison, fructification, sénescence)
- [x] Lier les états aux profils moléculaires correspondants
- [x] Ajouter les champs de durée et conditions de transition

### Table Méthodes d'Extraction ✅ COMPLÉTÉ
- [x] Créer la table `extraction_methods` (distillation, expression, CO2, solvant, etc.)
- [x] Ajouter les paramètres techniques (température, pression, durée)
- [x] Ajouter les rendements par méthode et par plante
- [x] Ajouter les profils moléculaires résultants
- [x] Importer 7 méthodes d'extraction (distillation vapeur, hydrodistillation, CO² supercritique, solvants, expression, enfleurage, macération)

### Table Terroirs et Origines ✅ COMPLÉTÉ
- [x] Créer la table `terroirs` pour les zones de production
- [x] Ajouter les coordonnées GPS et zones climatiques
- [x] Ajouter les caractéristiques pédologiques (type de sol)
- [x] Ajouter les données historiques de production
- [x] Lier les terroirs aux plantes et variétés
- [x] Importer 7 terroirs de référence (San Andrés, Santander, Cauca, Nossi-Bé, Grasse, Karnataka, Bosaso)

### Table Fournisseurs et Sources ✅ COMPLÉTÉ
- [x] Créer la table `suppliers` pour les fournisseurs de matières premières
- [x] Ajouter les certifications et labels
- [x] Ajouter les contacts et conditions commerciales
- [x] Créer la table de liaison `supplier_materials` (plante, variété, terroir, prix)

### Table Analyses et Mesures ✅ COMPLÉTÉ
- [x] Créer la table `plant_analyses` pour les analyses GC-MS
- [x] Ajouter les champs de date, laboratoire, méthode
- [x] Stocker les profils moléculaires complets (JSON)
- [x] Lier aux échantillons et lots

### Table Échantillons et Lots ✅ COMPLÉTÉ
- [x] Créer la table `plant_samples` pour les échantillons physiques
- [x] Ajouter les champs de traçabilité (lot, date récolte, lieu)
- [x] Ajouter les champs de stockage (localisation, conditions)
- [x] Ajouter les champs de quantité et disponibilité

### Interface détaillée des plantes ✅ COMPLÉTÉ
- [x] Créer la page de détail d'une plante avec tous les champs
- [x] Créer les onglets (Vue d'ensemble, Variétés, États botaniques, Échantillons, Analyses, Usage Absorbe)
- [x] Créer le formulaire d'ajout/édition complet
- [x] Créer la galerie d'images (photos, illustrations botaniques)
- [x] Créer la timeline d'évolution (états botaniques)

### Outils de comparaison avancés
- [x] Créer la vue de comparaison multi-plantes (jusqu'à 5)
- [x] Créer les graphiques de profils moléculaires comparés
- [x] Créer les cartes de terroirs avec filtres
- [x] Créer les tableaux de rendements comparés

### Système de recherche avancée
- [x] Créer la recherche par profil moléculaire (molécules cibles)
- [x] Créer la recherche par caractéristiques olfactives
- [x] Créer la recherche par terroir et climat
- [x] Créer la recherche par usage (parfum, encens, espace)
- [x] Créer les filtres combinés avancés

### Import et export de données
- [x] Créer le système d'import CSV/Excel pour les plantes
- [x] Créer le système d'import pour les analyses GC-MS
- [x] Créer l'export PDF des fiches plantes
- [x] Créer l'export JSON pour l'interopérabilité

### Documentation et guides
- [x] Créer le guide de saisie des données botaniques
- [x] Créer le glossaire des termes botaniques
- [x] Créer les fiches méthodologiques (extraction, analyse)
- [x] Documenter les conventions du projet



---

## 🔬 SESSION 04 JAN 2026 - CONTENU SCIENTIFIQUE : RELATIONS MOLÉCULES-PLANTES-TERROIRS

### Phase 1 : Analyse et conception du modèle relationnel
- [ ] Analyser les données existantes (molécules, plantes, recettes)
- [ ] Concevoir le modèle de données relationnel étendu
- [ ] Définir les relations many-to-many entre entités
- [ ] Créer le diagramme de relations

### Phase 2 : Extension du schéma de base de données
- [ ] Étendre la table molecules avec champs scientifiques manquants
- [ ] Créer/étendre la table plants avec taxonomie complète
- [ ] Créer la table raw_materials (matières premières)
- [ ] Créer la table terroirs (géographie olfactive)
- [ ] Créer les tables de liaison (plant_molecules, terroir_plants, etc.)
- [ ] Migrer le schéma avec pnpm db:push

### Phase 3 : Procédures tRPC pour les relations
- [ ] CRUD matières premières
- [ ] CRUD terroirs
- [ ] Gestion des liaisons plante-molécule
- [ ] Gestion des liaisons terroir-plante
- [ ] Recherche par relation (molécules d'une plante, plantes d'un terroir)
- [ ] Statistiques et agrégations

### Phase 4 : Interface de visualisation des relations
- [ ] Page matières premières avec filtres
- [ ] Page terroirs avec carte interactive
- [ ] Graphe de relations molécule-plante
- [ ] Graphe de relations terroir-plante-molécule
- [ ] Vue détaillée avec toutes les connexions

### Phase 5 : Import des données existantes
- [ ] Importer les molécules avec leurs sources botaniques
- [ ] Importer les plantes avec leurs terroirs
- [ ] Importer les matières premières
- [ ] Créer les liaisons entre entités
- [ ] Valider l'intégrité des données

### Phase 6 : Tests et livraison
- [ ] Tests unitaires des nouvelles procédures
- [ ] Tests d'intégration des relations
- [ ] Checkpoint final


---

## 🔬 SESSION 04 JAN 2026 - RELATIONS MOLÉCULE-PLANTE-MATIÈRE PREMIÈRE

### Phase 1 : Analyse des données existantes ✅ COMPLÉTÉ
- [x] Analyser les fichiers de données partagés (40 fichiers)
- [x] Identifier les structures de données pour molécules, plantes, terroirs
- [x] Documenter les relations existantes entre entités

### Phase 2 : Modèle de données relationnel ✅ COMPLÉTÉ
- [x] Créer le schéma `raw_materials` (matières premières)
- [x] Créer le schéma `molecule_plant_sources` (relations molécule-plante)
- [x] Créer le schéma `terroir_specialties` (spécialités des terroirs)
- [x] Créer le schéma `raw_material_molecules` (composition des matières premières)
- [x] Migrer les schémas vers la base de données

### Phase 3 : Procédures tRPC ✅ COMPLÉTÉ
- [x] Créer les procédures CRUD pour raw_materials
- [x] Créer les procédures pour molecule_plant_sources
- [x] Créer les procédures pour terroir_specialties
- [x] Créer les procédures de recherche avancée
- [x] Créer les procédures de statistiques de contenu

### Phase 4 : Interface utilisateur ✅ COMPLÉTÉ
- [x] Créer la page RawMaterials.tsx (liste des matières premières)
- [x] Créer la page RawMaterialDetail.tsx (détail avec molécules)
- [x] Créer la page MoleculePlantRelations.tsx (visualisation des relations)
- [x] Ajouter les routes dans App.tsx

### Phase 5 : Import des données ✅ COMPLÉTÉ
- [x] Importer 8 matières premières de test (Lavande, Romarin, Menthe, Rose, Ylang-Ylang, Vétiver, Encens, Bergamote)
- [x] Corriger la colonne `references` manquante dans la table raw_materials
- [x] Vérifier le fonctionnement de la page Matières Premières
- [x] Vérifier le fonctionnement de la page Relations Molécule-Plante

### Phase 6 : À faire (prochaine session)
- [ ] Corriger les erreurs TypeScript restantes (finalRecipes functions)
- [ ] Ajouter plus de données de relations molécule-plante
- [ ] Créer des tests unitaires pour les nouvelles fonctionnalités
- [ ] Importer les données de composition moléculaire des matières premières



---

## 🧬 SESSION 04 JAN 2026 - ENRICHISSEMENT RELATIONS MOLÉCULE-PLANTE

### Phase 1 : Analyse des données existantes
- [ ] Analyser les fichiers de données du projet partagé
- [ ] Identifier les données de composition moléculaire disponibles
- [ ] Mapper les relations molécule-plante existantes

### Phase 2 : Enrichir les relations molécule-plante
- [ ] Créer/enrichir la table de liaison plante-molécule avec pourcentages (min/max)
- [ ] Importer les données de composition (linalol 25-45% lavande, limonène 65-95% agrumes, etc.)
- [ ] Valider l'intégrité des données importées

### Phase 3 : Import matières premières
- [ ] Identifier les matières premières dans les fichiers sources
- [ ] Compléter la base avec les huiles essentielles manquantes
- [ ] Ajouter les absolues
- [ ] Ajouter les extraits CO2

### Phase 4 : Visualisation graphique interactive
- [ ] Créer un composant de graphique de réseau interactif
- [ ] Implémenter les connexions molécules-plantes
- [ ] Implémenter les connexions plantes-terroirs
- [ ] Ajouter les interactions (zoom, filtres, détails au survol)

### Phase 5 : Corrections techniques
- [x] Corriger les erreurs TypeScript dans server/routers.ts (getRadicalRecipes, createFinalRecipe, updateFinalRecipe)
- [x] Corriger les erreurs TypeScript dans ReseauMoleculePlante.tsx (accès null-safe aux entities/relationships)
- [x] Corriger le test points123.test.ts (family et climaticAxis peuvent être null)



---

## 🧬 SESSION 04 JAN 2026 - ENRICHISSEMENT MOLÉCULE-PLANTE-TERROIR

### Relations molécule-plante avec pourcentages ✅ COMPLÉTÉ
- [x] Enrichir la table `plant_molecules` avec pourcentages min/max/typique
- [x] Ajouter les champs de rôle (majeur, secondaire, trace, variable)
- [x] Ajouter les champs de variabilité (stable, saisonnier, géographique, chémotype, extraction)
- [x] Ajouter les sources bibliographiques
- [x] Importer 55 relations plante-molécule avec données de composition
- [x] Importer 17 plantes aromatiques avec leurs profils moléculaires complets

### Matières premières ✅ COMPLÉTÉ
- [x] Importer 6 nouvelles huiles essentielles (Eucalyptus, Patchouli, Santal, Cèdre, Géranium, Néroli)
- [x] Importer 4 nouvelles absolues (Jasmin, Tubéreuse, Vanille, Mimosa)
- [x] Importer 5 nouveaux extraits CO2 (Gingembre, Cardamome, Encens, Myrrhe, Vétiver)
- [x] Importer 2 nouvelles oléorésines (Benjoin, Labdanum)
- [x] Total: 25 matières premières dans la base

### Visualisation graphique interactive ✅ COMPLÉTÉ
- [x] Créer la page `/reseau-molecules-plantes`
- [x] Implémenter le graphe ReactFlow avec nœuds et arêtes
- [x] Ajouter les filtres par type d'entité (plante, molécule, terroir)
- [x] Ajouter le filtre par pourcentage minimum
- [x] Ajouter le filtre molécules signatures
- [x] Ajouter la légende interactive
- [x] Ajouter la mini-map de navigation
- [x] Ajouter les statistiques en temps réel
- [x] Implémenter la navigation vers les fiches détaillées au clic

### Tests unitaires ✅ COMPLÉTÉ
- [x] Créer `server/network.test.ts` avec 11 tests
- [x] Tester `getMoleculePlantTerroirNetwork()`
- [x] Tester `getPlantMoleculesWithPercentages()`
- [x] Tester `getMoleculePlantsWithPercentages()`
- [x] Valider l'intégrité des données


---

## 🌿 SESSION 03 JAN 2026 - ENRICHISSEMENT DONNÉES PLANTES

### Compléter les données des plantes aromatiques
- [x] Identifier les plantes sans famille botanique dans la base de données (16 plantes identifiées)
- [x] Identifier les plantes sans axe climatique dans la base de données (16 plantes identifiées)
- [x] Rechercher les familles botaniques manquantes (Lavande, Citron, Bergamote, etc.)
- [x] Rechercher les axes climatiques appropriés pour chaque plante
- [x] Mettre à jour la base de données avec les familles botaniques (16 plantes mises à jour)
- [x] Mettre à jour la base de données avec les axes climatiques (16 plantes mises à jour)

### Enrichir les relations molécule-plante
- [x] Identifier les plantes sans pourcentages de composition (13 plantes identifiées)
- [x] Rechercher les pourcentages de composition pour les nouvelles plantes
- [x] Créer les relations molécule-plante avec pourcentages (17 relations ajoutées)
- [x] Vérifier l'intégrité des données après mise à jour (72 relations total)
- [x] Tester le réseau interactif avec les nouvelles données (vérifié sur /plantes)


---

## 🧪 SESSION 03 JAN 2026 - ENRICHISSEMENT BASE DE DONNÉES (Phase 2)

### Enrichir les descriptions olfactives
- [x] Identifier les plantes avec descriptions génériques ("Plante aromatique - [nom]") - 16 plantes identifiées
- [x] Enrichir la description de Bergamote avec profil olfactif détaillé
- [x] Enrichir la description de Bois de Santal avec profil olfactif détaillé
- [x] Enrichir la description de Lavande avec profil olfactif détaillé
- [x] Enrichir les 16 plantes avec descriptions olfactives complètes et origines géographiques

### Créer les molécules manquantes
- [x] Créer la molécule Carvone avec propriétés complètes (CAS: 99-49-0, classe: ketone)
- [x] Créer les relations Carvone-plantes (Menthe verte 50-70%, Carvi 50-60%, Aneth 30-50%)
- [x] Enrichir la molécule Carvacrol avec propriétés complètes (CAS: 499-75-2, classe: phenol)
- [x] Créer les relations Carvacrol-plantes (Origan 60-80%, Sarriette 40-50%, Thym 1-5%)
- [x] Enrichir la molécule Thymol avec propriétés complètes (CAS: 89-83-8, classe: phenol)
- [x] Créer les relations Thymol-plantes (Thym 30-50%, Ajowan 35-50%, Origan 0.5-5%)
- [x] Créer la molécule Estragole avec propriétés complètes (CAS: 140-67-0, classe: ether)
- [x] Créer les relations Estragole-plantes (Estragon 60-75%, Basilic 70-85%, Fenouil 3-5%)

### Ajouter les origines géographiques
- [x] Identifier les plantes sans origine géographique - 16 plantes identifiées
- [x] Ajouter les terroirs et régions de production pour les 16 plantes
- [x] Créer 7 nouvelles plantes aromatiques (Thym, Estragon, Carvi, Aneth, Fenouil, Sarriette, Ajowan)
- [x] Total: 36 plantes, 431 molécules, 84 relations plante-molécule


---

## 🌿 SESSION 03 JAN 2026 - ENRICHISSEMENT VISUEL & RÉGLEMENTAIRE

### Images botaniques pour les fiches plantes
- [x] Analyser la structure actuelle des fiches plantes (champs existants)
- [x] Vérifier le champ `imageUrl` au schéma `plants` (déjà existant)
- [ ] Créer le système d'upload/gestion d'images botaniques
- [ ] Mettre à jour l'interface des fiches plantes pour afficher les images

### Fiches de chémotypes
- [x] Créer le schéma de table `chemotypes` (variations chimiques par espèce)
- [x] Définir les champs : espèce parente, nom du chémotype, molécule dominante, pourcentage, origine géographique
- [x] Créer les procédures tRPC CRUD pour les chémotypes
- [x] Créer l'interface de visualisation des chémotypes (page /chemotypes)
- [x] Écrire les tests unitaires pour les chémotypes (10/10 tests passés)

### Données IFRA manquantes
- [x] Rechercher les restrictions IFRA officielles pour Carvone et Estragole (Amendment 49)
- [x] Documenter les données IFRA avec limites par catégorie de produit
- [x] Créer les fichiers de référence IFRA dans /data/ (ifra-carvone.md, ifra-estragole.md)


---

## 🧬 SESSION 03 JAN 2026 - CHÉMOTYPES, IFRA & IMAGES BOTANIQUES

### Import des chémotypes connus
- [x] Créer un script d'import pour les chémotypes classiques
- [x] Importer les chémotypes du Thym (thymol, linalol, géraniol, carvacrol, thujanol, paracymène)
- [x] Importer les chémotypes du Romarin (camphre, cinéole, verbénone)
- [x] Importer les chémotypes de la Lavande (linalol, lavandulol)
- [x] Importer les chémotypes de l'Eucalyptus (cinéole, citronellal, radiata)
- [x] Importer les chémotypes du Basilic (linalol, méthyl-chavicol, eugénol)
- [x] Valider l'intégrité des données importées (17 chémotypes importés)

### Intégration des données IFRA dans l'interface
- [x] Créer le schéma de table `ifra_restrictions` pour les restrictions par molécule (existait déjà)
- [x] Définir les 17 catégories de produits IFRA (Cat 1-11B) avec table ifra_categories
- [x] Créer les procédures tRPC pour consulter les restrictions IFRA
- [x] Implémenter le calcul automatique des limites selon le type de produit (calculateIfraLimit)
- [x] Créer un système d'alerte pour les dépassements de limites (checkIfraCompliance)
- [x] Importer 11 restrictions IFRA pour les molécules clés (estragole, carvone, eugénol, etc.)
- [ ] Créer la page de consultation IFRA avec recherche par molécule
- [ ] Écrire les tests unitaires pour les procédures IFRA

### Système d'upload d'images botaniques
- [ ] Configurer le stockage S3 pour les images botaniques
- [ ] Créer la procédure tRPC d'upload d'images
- [ ] Créer le composant d'upload avec prévisualisation
- [ ] Mettre à jour les fiches plantes pour afficher les images uploadées
- [ ] Ajouter la gestion des images multiples par plante
- [ ] Implémenter la suppression d'images
- [ ] Écrire les tests unitaires pour le système d'upload



---

## 🧬 SESSION 04 JAN 2026 - CHÉMOTYPES, IFRA & IMAGES BOTANIQUES

### Import des chémotypes connus ✅ COMPLÉTÉ
- [x] Créer un script d'import pour les chémotypes classiques (import-chemotypes.mjs)
- [x] Importer les chémotypes du Thym (thymol, linalol, géraniol, carvacrol, thujanol, paracymène)
- [x] Importer les chémotypes du Romarin (camphre, cinéole, verbénone)
- [x] Importer les chémotypes de la Lavande (linalol, lavandulol)
- [x] Importer les chémotypes de l'Eucalyptus (globulus, citriodora, radiata)
- [x] Importer les chémotypes du Basilic (linalol, estragole, eugénol)
- [x] Valider l'intégrité des données importées (17 chémotypes importés)

### Intégration des données IFRA dans l'interface ✅ COMPLÉTÉ
- [x] Créer le schéma de table `ifra_restrictions` (existait déjà)
- [x] Créer le schéma de table `ifra_categories` pour les 17 catégories IFRA
- [x] Créer les procédures tRPC pour consulter les restrictions IFRA
- [x] Implémenter le calcul automatique des limites (calculateIfraLimit)
- [x] Créer un système de vérification de conformité (checkIfraCompliance)
- [x] Importer 11 restrictions IFRA pour les molécules clés
- [x] Créer la page de consultation IFRA (/ifra, /reglementation-ifra)
- [x] Importer les 17 catégories IFRA avec descriptions FR/EN

### Système d'upload d'images botaniques ✅ COMPLÉTÉ (backend)
- [x] Configurer le stockage S3 (utilise storage.ts existant)
- [x] Créer les procédures tRPC pour les images (updateImage, deleteImage, getWithImages, getWithoutImages)
- [x] Vérifier le champ imageUrl dans le schéma plants (existait déjà)
- [x] Créer les fonctions db pour la gestion des images
- [ ] Créer le composant d'upload d'images dans les fiches plantes (frontend à implémenter)
- [ ] Implémenter la galerie d'images botaniques (frontend à implémenter)

### Résumé de la session
- 17 chémotypes classiques importés (Thym, Romarin, Lavande, Eucalyptus, Basilic)
- 17 catégories IFRA créées avec descriptions bilingues
- 11 restrictions IFRA importées (estragole, carvone, eugénol, cinnamaldéhyde, citral, coumarine, linalol, limonène, thymol, carvacrol, camphre)
- Page IFRA créée avec recherche, calculateur de conformité et liste des catégories
- Backend d'upload d'images botaniques prêt (procédures tRPC et fonctions db)



---

## 🖼️ SESSION 04 JAN 2026 - NOUVELLES FONCTIONNALITÉS

### Upload d'images pour les fiches plantes
- [ ] Créer le composant ImageUpload avec drag & drop
- [ ] Ajouter la prévisualisation des images avant upload
- [ ] Intégrer le composant dans les fiches plantes (LeafEconomies)
- [ ] Configurer le stockage S3 pour les images
- [ ] Ajouter le champ imageUrl au schéma leaf_economies si nécessaire
- [ ] Tester l'upload sur desktop et mobile

### Lien IFRA dans le menu
- [ ] Ajouter le lien vers la page IFRA dans le menu Méthodologie ou Recherche
- [ ] Vérifier que la page IFRA existe et est accessible

### Enrichissement des restrictions IFRA
- [ ] Ajouter le géraniol aux restrictions IFRA
- [ ] Ajouter le citronellol aux restrictions IFRA
- [ ] Ajouter le méthyl-eugénol aux restrictions IFRA
- [ ] Ajouter le bergaptène aux restrictions IFRA
- [ ] Mettre à jour l'interface d'affichage des restrictions



---

## 🖼️ SESSION 04 JAN 2026 - NOUVELLES FONCTIONNALITÉS

### Composant ImageUpload pour les fiches plantes
- [x] Créer le composant ImageUpload avec drag & drop et prévisualisation
- [x] Ajouter le champ imageUrl au schéma leaf_economies
- [x] Créer la procédure tRPC d'upload vers S3
- [x] Intégrer le composant dans le formulaire LeafEconomyForm
- [x] Écrire les tests unitaires (2 tests passés)

### Lien IFRA dans le menu
- [x] Ajouter la section "Réglementation" dans le MegaMenu
- [x] Ajouter le lien vers la page IFRA avec badge "NEW"
- [x] Importer l'icône ShieldCheck

### Enrichissement des restrictions IFRA
- [x] Créer les molécules manquantes (Géraniol, Citronellol, Méthyl-eugénol, Bergaptène)
- [x] Ajouter les restrictions IFRA pour chaque molécule avec limites par catégorie
- [x] Écrire les tests unitaires (6 tests passés)
- [x] Valider les données importées



---

## 🖼️ SESSION 04 JAN 2026 - UPLOAD S3, GALERIE & CALCULATEUR IFRA

### Upload d'images vers S3 (remplacer base64)
- [x] Analyser le système d'upload actuel (base64 local)
- [x] Créer la procédure tRPC pour upload vers S3 (`upload.galleryImage`)
- [x] Modifier le composant ImageUpload pour utiliser S3
- [x] Ajouter la gestion des erreurs et du loading
- [x] Tester l'upload pour les utilisateurs connectés

### Galerie d'images des échantillons
- [x] Créer le schéma de table `sample_images` pour stocker les métadonnées
- [x] Créer les procédures tRPC pour la galerie (list, add, delete, update, stats)
- [x] Créer la page Galerie avec grille d'images responsive (`/galerie`)
- [x] Ajouter les filtres par échantillon, date, catégorie
- [x] Créer la vue lightbox pour agrandir les images (navigation flèches)
- [x] Intégrer la galerie dans le menu principal (routes `/galerie` et `/gallery`)

### Calculateur de conformité IFRA
- [x] Analyser les données IFRA existantes (limites par catégorie)
- [x] Créer l'interface du calculateur (sélection formule, catégorie produit)
- [x] Implémenter le calcul de conformité (% vs limite) - formule complète multi-molécules
- [x] Afficher les résultats avec indicateurs visuels (conforme/non-conforme, marges, barre de progression)
- [x] Créer les alertes pour les dépassements de limites (tableau détaillé par ingrédient)
- [x] Intégrer le calculateur dans la page IFRA (onglet "Calculateur Formule")

### Tests et validation
- [x] Écrire les tests unitaires pour l'upload S3 (3 tests)
- [x] Écrire les tests unitaires pour la galerie (5 tests)
- [x] Écrire les tests unitaires pour le calculateur IFRA (5 tests)
- [x] Tester sur desktop et mobile (TypeScript OK)
- [x] Créer le checkpoint final


---

## 🔗 SESSION 04 JAN 2026 - AMÉLIORATIONS GALERIE & MOLÉCULES

### Navigation Galerie
- [x] Ajouter lien vers /galerie/import dans le menu de la galerie

### Molécules manquantes pour fiche Ambrette
- [x] Créer molécule Farnesol pour compléter les liaisons de la fiche Ambrette
- [x] Créer molécule Geraniol pour compléter les liaisons de la fiche Ambrette (existait déjà sous le nom Géraniol)

---

## 🔗 SESSION 04 JAN 2026 - AMÉLIORATIONS GALERIE & MOLÉCULES

### Navigation Galerie
- [x] Ajouter lien vers /galerie/import dans le menu de la galerie

### Molécules manquantes pour fiche Ambrette
- [x] Créer molécule Farnesol pour compléter les liaisons de la fiche Ambrette
- [x] Créer molécule Geraniol pour compléter les liaisons de la fiche Ambrette (existait déjà sous le nom Géraniol)
