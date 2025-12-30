# PERFUMUM — TODO

## 🎯 SESSION 29 DÉC 2025 - TÂCHES PRIORITAIRES

### Phase 1 : Déboguer le routing frontend et créer les pages manquantes
- [x] Investiguer pourquoi les nouvelles pages React ne se montent pas dans le DOM
- [x] Identifier le problème de routing (wouter, React Router, etc.)
- [x] Créer la page `/bibliographie` avec interface complète
- [x] Créer la page `/projets` avec interface complète (existait déjà)
- [x] Créer la page `/gestion` avec interface complète
- [ ] Tester la navigation entre toutes les pages
- [ ] Valider le responsive mobile

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
- Exports manquants dans schema.ts (InsertSituatedSmell, molecules, recettes, moleculesRecettes)
- À corriger après les tâches prioritaires

### Routing frontend
- Nouvelles pages React ne se montent pas dans le DOM
- À investiguer en priorité (Phase 1)

---

## 📝 NOTES

- Projet long terme (10 ans), priorité à la stabilité
- Toujours tester sur mobile après chaque modification
- Documenter les décisions importantes
- Créer des checkpoints réguliers
