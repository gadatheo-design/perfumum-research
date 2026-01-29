# Analyse des 40 Fichiers d'Import PERFUMUM

**Date d'analyse** : 28 janvier 2026
**Total fichiers** : 40 (33 MD + 4 JSON + 2 CSV + 6 PY)

---

## 📊 CATÉGORISATION PAR PRIORITÉ

### 🔴 PRIORITÉ 1 — Données Moléculaires Critiques (Import immédiat)

| Fichier | Type | Contenu | Entités |
|---------|------|---------|---------|
| `analyse_composes_differenciateurs.json` | JSON | Marqueurs moléculaires Tier 1 vs autres | ~50 composés |
| `comparaison_7_landraces.json` | JSON | Profils moléculaires 7 landraces | 7 profils |
| `comparaison_basma_izmir.json` | JSON | Comparaison Basma vs Izmir | 2 profils |
| `comparaison_originaux_modernes.json` | JSON | Originaux vs descendants modernes | ~10 comparaisons |
| `CompositionMoléculaireduPerique-DécouvertesClés.md` | MD | 334 composés du Perique | 334 molécules |
| `AnalyseMoléculaireComplète7LandracesExceptionnelles+334ComposésduPerique.md` | MD | Documentation complète | 7 landraces + 334 |

**Estimation** : ~400 nouvelles entrées moléculaires

---

### 🟠 PRIORITÉ 2 — Archives Olfactives (Cigarettes historiques)

| Fichier | Type | Contenu | Entités |
|---------|------|---------|---------|
| `ArchiveOlfactiveCigarettesSoviétiques,OrientalesetChinoises.md` | MD | 11 marques documentées | 11 cigarettes |
| `analyse_cigarettes_perfumum.md` | MD | Analyse cigarettes PERFUMUM | ~15 marques |
| `cigarettes_disparues_recherche.md` | MD | Recherche cigarettes disparues | ~10 marques |
| `AnalyseChimiqueDifférenciatriceCigarettesTier1vsAutresProfils.md` | MD | Différenciation chimique | Profils chimiques |

**Estimation** : ~35 nouvelles entrées cigarettes

---

### 🟡 PRIORITÉ 3 — Analyses Pédologiques et Terroirs

| Fichier | Type | Contenu | Entités |
|---------|------|---------|---------|
| `AnalysePédologiqueComparativeVueltaAbajovs.Estelí.md` | MD | Comparaison sols Cuba/Nicaragua | 2 terroirs |
| `analyse_pedologique_detaillee.md` | MD | Analyse pédologique détaillée | Données sols |
| `comparaison_pedologique_vuelta_esteli.csv` | CSV | Données comparatives | Métriques sols |
| `DocumentationdelaBasedeDonnéesPERFUMUMTerroirsdeTabacv1.0.md` | MD | Documentation terroirs | ~10 terroirs |
| `Au-delàdesPyrazinesLesMoléculesSecrètesduTabacd'Estelí.md` | MD | Molécules secrètes Estelí | ~20 molécules |

**Estimation** : ~30 nouvelles entrées terroirs/sols

---

### 🟢 PRIORITÉ 4 — Analyses Génomiques

| Fichier | Type | Contenu | Entités |
|---------|------|---------|---------|
| `AnalyseGénomiquedesVariétésdeTabac-PERFUMUM.md` | MD | Génomique variétés tabac | Données génétiques |
| `AnalyseGénomiqueGènesResponsablesdesMoléculesAromatiquesPerdues.md` | MD | Gènes molécules perdues | Gènes identifiés |
| `AnalysedesVariationsGénétiquesHypothétiques.md` | MD | Variations génétiques | Hypothèses |

**Estimation** : Données de recherche (pas d'import direct)

---

### 🔵 PRIORITÉ 5 — Documentation et Méthodologie

| Fichier | Type | Contenu |
|---------|------|---------|
| `Documentationdel'analysePERFUMUM.md` | MD | Documentation analyse |
| `DocumentationdelaPERFUMUMTabacothèquev1.0.md` | MD | Documentation tabacothèque |
| `DocumentationdelaBasedeDonnéesPERFUMUMAdditifsduTabacv1.0.md` | MD | Documentation additifs |
| `DocumentationdesProfilsMoléculairesDétaillés.md` | MD | Profils moléculaires |
| `DocumentationApprofondiedesHybridesdeTabacOriginauxetParticuliers.md` | MD | Documentation hybrides |
| `DocumentationComplètedesLandracesdeTabacduMondeEntier.md` | MD | Documentation landraces |

**Action** : Intégrer dans la section Recherche & Méthodologie

---

### ⚪ PRIORITÉ 6 — Scripts et Outils

| Fichier | Type | Contenu |
|---------|------|---------|
| `create_blends_db.py` | PY | Script création blends |
| `create_coupes_viz.py` | PY | Script visualisation coupes |
| `create_full_database.py` | PY | Script base complète |
| `create_perique_db.py` | PY | Script base Perique |
| `create_terroirs_db.py` | PY | Script base terroirs |

**Action** : Analyser pour réutilisation

---

### 📝 Fichiers de Recherche Additionnels

| Fichier | Type | Contenu |
|---------|------|---------|
| `additifs_tabac_recherche.md` | MD | Recherche additifs |
| `blends_recherche.md` | MD | Recherche blends |
| `descendants_modernes_recherche.md` | MD | Recherche descendants |
| `basma_study_notes.md` | MD | Notes étude Basma |
| `Analysedel'universdutabacàpipepourleprojetPERFUMUM.md` | MD | Analyse tabac à pipe |

---

## 📈 PLAN D'IMPLÉMENTATION RECOMMANDÉ

### Phase 1 : Données Moléculaires (2-3h)
1. Importer les 334 composés du Perique
2. Importer les profils moléculaires des 7 landraces
3. Importer les composés différenciateurs Tier 1
4. Créer les liaisons avec les landraces existantes

### Phase 2 : Archives Olfactives (1-2h)
1. Créer la table `historical_cigarettes`
2. Importer les 11 cigarettes soviétiques/orientales/chinoises
3. Importer les cigarettes disparues additionnelles

### Phase 3 : Terroirs et Pédologie (1h)
1. Enrichir les terroirs existants avec données pédologiques
2. Ajouter les molécules secrètes d'Estelí
3. Créer les comparaisons Vuelta Abajo vs Estelí

### Phase 4 : Documentation (30min)
1. Intégrer les fichiers de documentation dans la section Recherche
2. Créer les liens vers les références bibliographiques

### Phase 5 : Visualisations (1-2h)
1. Créer une page de comparaison des profils moléculaires
2. Créer une page d'archive des cigarettes historiques
3. Créer une page de comparaison pédologique

---

## ⏱️ ESTIMATION TOTALE

| Phase | Durée estimée | Entités |
|-------|---------------|---------|
| Phase 1 | 2-3h | ~400 molécules |
| Phase 2 | 1-2h | ~35 cigarettes |
| Phase 3 | 1h | ~30 terroirs/sols |
| Phase 4 | 30min | Documentation |
| Phase 5 | 1-2h | 3 pages |
| **TOTAL** | **5-8h** | **~465 entités** |

---

**Recommandation** : Procéder par phases avec checkpoint après chaque phase pour sécuriser les données.
