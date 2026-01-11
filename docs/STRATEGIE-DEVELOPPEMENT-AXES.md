# PERFUMUM — Stratégie de Développement par Axes de Recherche

> **Document de planification stratégique**
> Dernière mise à jour : 11 janvier 2026

---

## 1. Vue d'ensemble des Axes

Le projet PERFUMUM s'articule autour de **trois méta-axes** principaux et de **11 axes de recherche personnalisés**, soutenus par une bibliographie de **150+ références** organisées en axes thématiques.

### 1.1 Méta-Axes Thématiques (v3 References)

| Méta-Axe | Description | Nb Axes | Nb Références |
|----------|-------------|---------|---------------|
| **Meta-A** | Olfactory Heritage & Archives | 6 axes (A1-F2) | ~30 références |
| **Meta-B** | Olfactory Arts & Chimie de l'espace | 3 axes (B1-B2, J1-J3) | ~20 références |
| **Meta-C** | Digital Olfaction (IA/VR/Capteurs) & Datasets | 4 axes (C1-D2) | ~20 références |
| **Genomics** | Génomique et biosynthèse | 3 axes (G1-G3) | ~29 références |
| **Heritage** | Patrimoine et conservation | 3 axes (H1-H3) | ~34 références |
| **Niche** | Cannabis, Tabac, Ethnobotanique | 6 axes (M1-N3) | ~8 références |

### 1.2 Axes de Recherche Personnalisés

| Code | Nom | Catégorie | Statut | Priorité | Progression |
|------|-----|-----------|--------|----------|-------------|
| **AX1** | Variétés Fantômes | Expérimental | En cours | **Haute** | 35% |
| **AX7** | Durabilité et éthique | Appliqué | En cours | **Haute** | 15% |
| **AX8** | Tabac et Cannabis | Expérimental | En cours | Moyenne | 45% |
| **AX9** | Terroirs et origines | Appliqué | En cours | Moyenne | 20% |
| **AX10** | Méthodologie de recherche | Technique | En cours | Moyenne | 50% |
| **AX1** | Neurosciences Olfactives | Fondamental | Planifié | Moyenne | 0% |
| **AX2** | Biotechnologie Durable | Fondamental | Planifié | Moyenne | 0% |
| **AX3** | Régulation Émotionnelle | Fondamental | Planifié | Moyenne | 0% |
| **AX4** | Préservation Patrimoine | Fondamental | Planifié | Moyenne | 0% |
| **AX5** | IA et Création Parfumée | Fondamental | Planifié | Moyenne | 0% |
| **AX6** | Neurologie olfactive | Fondamental | Planifié | Moyenne | 10% |

---

## 2. Stratégie de Développement par Priorité

### 2.1 Priorité Haute — Développement Immédiat (Q1 2026)

#### AX1 — Variétés Fantômes (35% → 70%)

**Objectif** : Documenter et préserver les variétés botaniques non stabilisées, non enregistrées.

**Actions de développement** :
1. **Interface de collecte** : Créer un formulaire dédié pour documenter les variétés fantômes avec métadonnées géographiques et génétiques
2. **Base de données** : Ajouter une table `ghost_varieties` avec champs spécifiques (origine, morphologie, profil chimique, statut de conservation)
3. **Visualisation** : Carte interactive des variétés fantômes par région
4. **Liaisons** : Connecter aux références H2 (durabilité) et G1-G3 (génomique)

**Fonctionnalités à implémenter** :
- [ ] Table `ghost_varieties` dans le schéma
- [ ] Formulaire de contribution `/contributor/ghost-variety`
- [ ] Page de visualisation `/ghost-varieties`
- [ ] Export pour collaboration scientifique

#### AX7 — Durabilité et Éthique (15% → 50%)

**Objectif** : Recherche sur les pratiques durables et la conservation des espèces.

**Actions de développement** :
1. **Enrichir les liaisons H2** : Compléter les liaisons références → plantes menacées (actuellement 144 liaisons)
2. **Indicateurs de durabilité** : Ajouter des scores de durabilité aux matières premières
3. **Traçabilité** : Système de suivi de l'origine des matières
4. **Alertes conservation** : Notifications pour les espèces en danger

**Fonctionnalités à implémenter** :
- [ ] Champ `sustainability_score` sur les matières premières
- [ ] Page `/sustainability-dashboard` avec indicateurs
- [ ] Intégration des données CITES/IUCN
- [ ] Système d'alertes pour espèces menacées

---

### 2.2 Priorité Moyenne — Développement Continu (Q1-Q2 2026)

#### AX8 — Tabac et Cannabis (45% → 80%)

**Objectif** : Étude des profils aromatiques du tabac et du cannabis.

**Actions de développement** :
1. **Enrichir leaf_economies** : Ajouter plus d'échantillons de San Andrés
2. **Profils terpéniques** : Compléter les analyses GC-MS
3. **Liaisons M1-N2** : Connecter aux références spécialisées
4. **Comparaisons** : Outils de comparaison de profils

**Fonctionnalités existantes à améliorer** :
- Page `/leaf-economies` — Ajouter filtres avancés
- Page `/gc-ms` — Intégrer les données d'analyse
- Graphes de comparaison de profils terpéniques

#### AX9 — Terroirs et Origines (20% → 60%)

**Objectif** : Influence du terroir sur les profils aromatiques.

**Actions de développement** :
1. **Compléter les terroirs** : Ajouter les terroirs manquants (actuellement 29)
2. **Liaisons plantes-terroirs** : Atteindre 50% de couverture (actuellement 19.4%)
3. **Carte interactive** : Visualisation géographique des terroirs
4. **Données climatiques** : Intégrer les données météo/sol

**Fonctionnalités à implémenter** :
- [ ] Page `/terroirs-map` avec carte interactive
- [ ] Import de données climatiques
- [ ] Corrélations terroir-profil olfactif

#### AX10 — Méthodologie de Recherche (50% → 90%)

**Objectif** : Protocoles et méthodologies de recherche olfactive.

**Actions de développement** :
1. **Documentation** : Compléter les protocoles existants
2. **Templates** : Créer des modèles de fiches de terrain
3. **Export** : Formats standardisés pour publication
4. **Validation** : Système de peer-review interne

---

### 2.3 Priorité Planifiée — Développement Futur (Q2-Q4 2026)

#### Axes Fondamentaux (AX1-AX6)

Ces axes nécessitent une base de données plus complète avant développement :

| Axe | Prérequis | Fonctionnalités cibles |
|-----|-----------|------------------------|
| AX1 Neurosciences | Données EEG/fMRI | Visualisation cérébrale |
| AX2 Biotechnologie | Données biosynthèse | Calculateur de rendement |
| AX3 Régulation Émotionnelle | Études cliniques | Questionnaires standardisés |
| AX4 Préservation | Archives numérisées | Bibliothèque d'odeurs |
| AX5 IA Parfumée | Dataset d'entraînement | Générateur de formules |
| AX6 Neurologie | Données patients | Outils de diagnostic |

---

## 3. Liaisons Références ↔ Entités

### 3.1 État Actuel des Liaisons

| Type d'entité | Liaisons créées | Objectif Q1 2026 |
|---------------|-----------------|------------------|
| Leaf Economy (H2) | 144 | 200 |
| Tradition (H3) | 97 | 150 |
| Molécule | 0 | 100 |
| Plante | 0 | 50 |
| Recette | 0 | 30 |

### 3.2 Actions de Peuplement

**Phase 1 — Complété** :
- ✅ Liaisons H2 → leaf_economies (144 liaisons)
- ✅ Liaisons H3 → traditions_olfactives (97 liaisons)

**Phase 2 — À faire** :
- [ ] Liaisons G1-G3 → molécules (génomique)
- [ ] Liaisons M1-N2 → tabacs et cannabis
- [ ] Liaisons C1-C2 → recettes historiques

---

## 4. Traditions Olfactives — Enrichissement

### 4.1 Civilisations Actuelles (27)

Les traditions olfactives actuellement documentées couvrent :
- Égypte ancienne, Mésopotamie, Grèce, Rome
- Inde, Chine, Japon, Arabie
- Afrique (Nubie, Meroe, Sahara)
- Amérique (Colombie, Mésoamérique)
- Europe médiévale

### 4.2 Civilisations à Ajouter

| Civilisation | Région | Période | Matériaux symboliques |
|--------------|--------|---------|----------------------|
| **Perse sassanide** | Iran | 224-651 | Rose, ambre, musc |
| **Empire ottoman** | Turquie | 1299-1922 | Rose, oud, ambre |
| **Thaïlande Ayutthaya** | Asie SE | 1351-1767 | Bois de santal, jasmin |
| **Indonésie Majapahit** | Asie SE | 1293-1527 | Clou de girofle, muscade |
| **Empire Songhaï** | Afrique O | 1464-1591 | Encens, myrrhe |
| **Aztèque** | Mésoamérique | 1300-1521 | Copal, cacao, vanille |
| **Inca** | Andes | 1438-1533 | Coca, quinoa, résines |
| **Polynésie** | Pacifique | 1000-1800 | Tiaré, santal, ylang |
| **Vikings** | Scandinavie | 793-1066 | Ambre, pin, bouleau |
| **Celtes** | Europe O | 800 av-400 | Gui, chêne, miel |

---

## 5. Roadmap Technique

### Q1 2026 (Janvier-Mars)

| Semaine | Tâche | Axe concerné |
|---------|-------|--------------|
| S1-2 | Compléter liaisons H2/H3 | AX7 |
| S3-4 | Ajouter civilisations manquantes | H3 |
| S5-6 | Interface variétés fantômes | AX1 |
| S7-8 | Dashboard durabilité | AX7 |
| S9-10 | Enrichir leaf_economies | AX8 |
| S11-12 | Carte terroirs interactive | AX9 |

### Q2 2026 (Avril-Juin)

- Liaisons génomiques (G1-G3)
- Intégration données CITES
- Amélioration graphes D3.js
- Export standardisé

### Q3-Q4 2026

- Axes fondamentaux (AX1-AX6)
- Intégration IA
- API publique
- Documentation complète

---

## 6. Métriques de Succès

| Métrique | Actuel | Objectif Q1 | Objectif 2026 |
|----------|--------|-------------|---------------|
| Liaisons références | 241 | 500 | 2000 |
| Traditions documentées | 27 | 40 | 100 |
| Couverture plante-terroir | 19.4% | 50% | 80% |
| Couverture mol-recette | 50% | 70% | 90% |
| Axes actifs | 5/11 | 8/11 | 11/11 |

---

## 7. Ressources Nécessaires

### 7.1 Données à Collecter

- Données CITES/IUCN pour conservation
- Données climatiques pour terroirs
- Analyses GC-MS supplémentaires
- Archives historiques numérisées

### 7.2 Développement Technique

- Composants de visualisation D3.js
- Intégration cartographique avancée
- Système de notifications
- API pour collaboration externe

---

*Document généré automatiquement — PERFUMUM Research Platform*
