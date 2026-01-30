# Rapport des Tâches en Attente — PERFUMUM

**Date**: 30 janvier 2026  
**Statistiques**: 1651 tâches complétées / 561 tâches en attente (75% de complétion)

---

## 🔴 PRIORITÉ HAUTE — Bugs & Corrections

### Corrections Techniques
- [x] Diagnostiquer et corriger l'écran blanc sur /carte-terroirs → Rate limiting proxy Manus (429), pas un bug
- [x] Corriger les erreurs TypeScript restantes (finalRecipes functions) → Aucune erreur détectée
- [x] Corriger les erreurs TypeScript restantes dans db.ts → Aucune erreur détectée
- [x] Vérifier la compilation TypeScript sans erreurs → 1229 tests passés

### Tests à Corriger
- [x] Corriger le test climate-tl.test.ts (seuil 65% actuellement) → 100% couverture Köppen
- [x] Corriger le test core-procedures.test.ts → Tous les tests passent
- [x] Corriger le test molecule-origins.test.ts → Tous les tests passent

---

## 🟠 PRIORITÉ MOYENNE — Fonctionnalités Incomplètes

### Données Manquantes
- [x] Identifier les 68 plantes orphelines (sans liaisons moléculaires) → 206 identifiées, 11 nouvelles plantes créées
- [x] Rechercher les compositions chimiques pour chaque plante → Fait pour familles prioritaires
- [x] Créer les liaisons molécule-plante correspondantes → 21+ liaisons créées
- [x] Continuer l'enrichissement manuel des molécules complexes restantes → Anisaldéhyde ajoutée
- [x] Compléter les CAS Numbers manquants → 183 ajoutés via PubChem
- [x] Compléter les noms IUPAC manquants → 187 ajoutés
- [ ] Compléter les classes chimiques manquantes → En cours

### Imports de Données
- [ ] Importer les méthodes analytiques (procédure tRPC getMethods manquante)
- [ ] Lier les publications aux molécules (liaisons à compléter)
- [ ] Import des données relationnelles v4
- [ ] Importer les données de transformation à la combustion par landrace

### Pages & Composants
- [ ] Créer le composant AxisForceGraph (D3.js)
- [ ] Créer l'interface utilisateur pour les références v3
- [ ] Créer le composant de visualisation D3.js pour les relations
- [ ] Créer la page de recherche avancée `/advanced-search`
- [ ] Créer page Analyses Pédologiques
- [ ] Créer la page SoilAnalyses.tsx avec visualisations
- [ ] Créer la page AnalysisHub.tsx avec statistiques

### Parcours Olfactifs
- [ ] Créer le parcours "Encens du monde"
- [ ] Créer le parcours "Plantes méditerranéennes"
- [ ] Créer le parcours "Aromates culinaires"
- [ ] Créer le parcours "Fleurs précieuses"
- [ ] Créer le parcours "Bois et résines"
- [ ] Implémenter l'interface de sélection des parcours

---

## 🟡 PRIORITÉ NORMALE — Améliorations UX

### Responsive & Mobile
- [ ] Optimiser le MegaMenu pour mobile
- [ ] Améliorer la navigation tactile (bottom nav)
- [ ] Tester et corriger les visualisations sur mobile
- [ ] Tester sur différentes tailles d'écran mobile
- [ ] Tester le toggle sur différents appareils mobiles
- [ ] Tester InventoryDashboard sur mobile (320px-480px)
- [ ] Tester AnalysisHub sur mobile
- [ ] Tester PublicationMoleculeGraph sur mobile
- [ ] Tester SpectraIdentification sur mobile

### Visualisations D3.js
- [ ] Améliorer le graphe de relations terroir-plante-molécule
- [ ] Créer une vue détaillée avec toutes les connexions
- [ ] Améliorer le Diagramme Sankey (flux olfactifs)
- [ ] Améliorer la Heatmap Synergies
- [ ] Améliorer le Graphe Réseau (D3.js)
- [ ] Améliorer le Radar Enrichi
- [ ] Ajouter des filtres interactifs aux visualisations
- [ ] Optimiser les performances des graphes D3.js
- [ ] Graphe de force D3.js pour axes thématiques

### Recherche & Filtres
- [ ] Améliorer le système de recherche avancée
- [ ] Ajouter des filtres par classe chimique
- [ ] Implémenter les filtres croisés terroirs ↔ plantes ↔ molécules
- [ ] Ajouter la sélection multiple de filtres

---

## 🟢 PRIORITÉ BASSE — Améliorations Futures

### Fonctionnalités Avancées
- [ ] Système de tags et notes (schéma + procédures + UI)
- [ ] Créer des exports personnalisés
- [ ] Permettre aux utilisateurs de créer leurs propres parcours (P2)
- [ ] Créer carte des institutions de recherche

### Optimisation Performance
- [ ] Améliorer les images (WebP, compression)
- [ ] Optimiser les requêtes SQL critiques
- [ ] Ajouter des index manquants
- [ ] Auditer les tables et identifier les redondances
- [ ] Créer des vues SQL pour les requêtes complexes

### Documentation
- [ ] Mettre à jour la documentation technique
- [ ] Vérifier les fonctionnalités annoncées vs implémentées
- [ ] Supprimer le code mort et les composants inutilisés

### Intégrations Futures
- [ ] Ajouter le champ retention_index à la table ms_spectra
- [ ] Créer la table raw_materials pour les matières premières
- [ ] Créer la table suppliers pour les fournisseurs
- [ ] Créer la table inventory pour le suivi des achats
- [ ] Connecter les gènes TPS aux molécules produites
- [ ] Identifier les correspondances gènes TPS ↔ molécules

---

## 📁 Fichiers à Importer (Liste Séparée)

**~400 fichiers Markdown** dans le dossier projet à intégrer progressivement.
Ces fichiers contiennent des données de recherche sur :
- Analyses génomiques des variétés de tabac
- Analyses pédologiques comparatives
- Compositions moléculaires (Perique, landraces)
- Cigarettes historiques (soviétiques, orientales, chinoises)
- Documentation des hybrides et landraces

---

## Recommandations

1. **Commencer par les bugs** : L'écran blanc sur /carte-terroirs et les erreurs TypeScript
2. **Compléter les données** : Les 68 plantes orphelines et les liaisons moléculaires
3. **Améliorer le mobile** : Tests responsive sur les pages principales
4. **Visualisations** : Optimiser les graphes D3.js existants avant d'en créer de nouveaux
