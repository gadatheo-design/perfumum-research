# Modèles Analytiques GC-MS - Données Scientifiques

## 1. Protocoles d'Analyse GC-MS

### 1.1 Préparation des Échantillons

#### Tabacs
**Méthode** : Extraction par solvant + Headspace dynamique
- **Masse échantillon** : 100 mg de tabac séché
- **Solvant** : Dichlorométhane (DCM) ou Hexane, 1 mL
- **Extraction** : Ultrasons 15 min, 40°C
- **Filtration** : 0.45 μm PTFE
- **Dilution** : 1:10 dans solvant d'injection
- **Volume injection** : 1 μL (split 1:20)

#### Molécules pures (standards)
- **Concentration stock** : 1000 μg/mL dans méthanol
- **Gamme de calibration** : 1-100 μg/mL (7 points)
- **Étalon interne** : n-Décane (50 μg/mL)

### 1.2 Paramètres Instrumentaux GC

**Colonne**
- Type : DB-5MS (5% phényl-polysiloxane)
- Dimensions : 30 m × 0.25 mm × 0.25 μm
- Température max : 350°C

**Programme de Température**
1. Température initiale : 60°C, maintien 2 min
2. Rampe 1 : 5°C/min jusqu'à 150°C
3. Rampe 2 : 10°C/min jusqu'à 250°C
4. Maintien final : 250°C, 5 min
5. **Durée totale** : 35 min

**Gaz vecteur**
- Type : Hélium (He) ultra-pur (99.9999%)
- Débit : 1.2 mL/min (mode débit constant)
- Pression : ~8 psi

**Injecteur**
- Type : Split/Splitless
- Température : 250°C
- Mode : Split 1:20
- Liner : Single taper, laine de verre déactivée

### 1.3 Paramètres MS

**Source d'Ionisation**
- Type : Impact électronique (EI)
- Énergie : 70 eV
- Température source : 230°C
- Température quadrupôle : 150°C

**Acquisition**
- Mode : Scan complet (Full Scan) + SIM (Selected Ion Monitoring)
- Plage m/z : 35-350 (Full Scan)
- Vitesse scan : 3 scans/sec
- Solvant delay : 3 min

**Ions de Quantification (SIM)**
| Molécule | Ion quantification (m/z) | Ions confirmation (m/z) |
|----------|--------------------------|-------------------------|
| α-Pinène | 93 | 77, 121, 136 |
| Limonène | 68 | 93, 107, 136 |
| Myrcène | 93 | 69, 77, 136 |
| Linalool | 71 | 93, 121, 154 |
| β-Caryophyllène | 93 | 133, 161, 204 |

---

## 2. Spectres de Référence (Temps de Rétention)

### 2.1 Monoterpènes (C10H16)

| Molécule | TR (min) | Ion base (m/z) | Ions caractéristiques | Pureté (%) |
|----------|----------|----------------|----------------------|------------|
| α-Pinène | 8.2 | 93 | 77, 91, 121, 136 | ≥ 98 |
| β-Pinène | 9.1 | 93 | 69, 79, 121, 136 | ≥ 97 |
| Myrcène | 9.8 | 93 | 69, 77, 107, 136 | ≥ 95 |
| Limonène | 10.5 | 68 | 93, 107, 121, 136 | ≥ 97 |
| γ-Terpinène | 11.2 | 93 | 77, 91, 121, 136 | ≥ 96 |
| Terpinolène | 12.1 | 121 | 93, 105, 136 | ≥ 95 |
| Linalool | 13.5 | 71 | 93, 121, 139, 154 | ≥ 97 |
| α-Terpinéol | 15.8 | 59 | 93, 121, 136, 154 | ≥ 96 |

### 2.2 Sesquiterpènes (C15H24)

| Molécule | TR (min) | Ion base (m/z) | Ions caractéristiques | Pureté (%) |
|----------|----------|----------------|----------------------|------------|
| β-Caryophyllène | 22.3 | 93 | 133, 161, 189, 204 | ≥ 98 |
| Humulène | 23.1 | 93 | 121, 147, 189, 204 | ≥ 96 |
| Caryophyllène oxide | 24.8 | 79 | 93, 121, 161, 220 | ≥ 95 |

### 2.3 Aldéhydes et Cétones

| Molécule | TR (min) | Ion base (m/z) | Ions caractéristiques | Pureté (%) |
|----------|----------|----------------|----------------------|------------|
| Hexanal | 5.2 | 44 | 56, 72, 82, 100 | ≥ 98 |
| Furfural | 7.8 | 96 | 39, 67, 95 | ≥ 99 |
| Benzaldéhyde | 11.3 | 106 | 77, 105 | ≥ 99 |
| Acétophénone | 13.2 | 105 | 77, 120 | ≥ 98 |

### 2.4 Pyrazines

| Molécule | TR (min) | Ion base (m/z) | Ions caractéristiques | Pureté (%) |
|----------|----------|----------------|----------------------|------------|
| 2-Méthylpyrazine | 6.5 | 94 | 67, 93 | ≥ 98 |
| 2,5-Diméthylpyrazine | 8.7 | 108 | 42, 67, 107 | ≥ 97 |
| 2,3,5-Triméthylpyrazine | 11.4 | 122 | 42, 81, 121 | ≥ 96 |

---

## 3. Profils Chromatographiques des 8 Tabacs

### 3.1 Burley
**Composés majeurs** (% aire totale)
| TR (min) | Molécule | % Aire | Famille |
|----------|----------|--------|---------|
| 8.2 | α-Pinène | 2.3 | Monoterpène |
| 9.8 | Myrcène | 1.8 | Monoterpène |
| 11.3 | Benzaldéhyde | 4.2 | Aldéhyde |
| 13.5 | Linalool | 3.1 | Monoterpène |
| 15.8 | α-Terpinéol | 2.7 | Monoterpène |
| 22.3 | β-Caryophyllène | 8.5 | Sesquiterpène |
| 24.8 | Caryophyllène oxide | 5.2 | Sesquiterpène |

**Profil dominant** : Sesquiterpènes (13.7%), Aldéhydes (4.2%)

### 3.2 Virginia Gold
**Composés majeurs** (% aire totale)
| TR (min) | Molécule | % Aire | Famille |
|----------|----------|--------|---------|
| 5.2 | Hexanal | 3.8 | Aldéhyde |
| 8.2 | α-Pinène | 4.5 | Monoterpène |
| 10.5 | Limonène | 6.2 | Monoterpène |
| 13.5 | Linalool | 7.8 | Monoterpène |
| 15.8 | α-Terpinéol | 5.3 | Monoterpène |
| 22.3 | β-Caryophyllène | 4.1 | Sesquiterpène |

**Profil dominant** : Monoterpènes (23.8%), Aldéhydes (3.8%)

### 3.3 Krumovgrad
**Composés majeurs** (% aire totale)
| TR (min) | Molécule | % Aire | Famille |
|----------|----------|--------|---------|
| 8.2 | α-Pinène | 3.2 | Monoterpène |
| 9.8 | Myrcène | 2.5 | Monoterpène |
| 10.5 | Limonène | 4.8 | Monoterpène |
| 13.5 | Linalool | 6.5 | Monoterpène |
| 22.3 | β-Caryophyllène | 7.2 | Sesquiterpène |
| 23.1 | Humulène | 3.8 | Sesquiterpène |

**Profil dominant** : Monoterpènes (17.0%), Sesquiterpènes (11.0%)

---

## 4. Méthodes de Quantification

### 4.1 Étalonnage Externe

**Principe** : Courbe de calibration avec standards purs

**Protocole**
1. Préparer 7 solutions standards (1, 5, 10, 25, 50, 75, 100 μg/mL)
2. Injecter chaque concentration en triplicat
3. Tracer courbe Aire vs Concentration
4. Calculer équation de régression linéaire : y = ax + b
5. Coefficient de corrélation : R² ≥ 0.995

**Exemple : Linalool**
- Équation : Aire = 45230 × C + 1250
- R² = 0.998
- Plage linéaire : 1-100 μg/mL

### 4.2 Étalonnage Interne

**Principe** : Utilisation d'un étalon interne (EI) pour corriger variations

**Étalon interne recommandé** : n-Décane (TR = 7.5 min)
- Concentration fixe : 50 μg/mL dans tous échantillons
- Ion quantification : m/z 57

**Protocole**
1. Ajouter EI à concentration fixe dans tous échantillons et standards
2. Calculer rapport Aire_analyte / Aire_EI
3. Tracer courbe Rapport vs Concentration
4. Équation : Rapport = a × C + b

**Avantages**
- Compense variations volume injection
- Corrige pertes lors préparation
- Améliore précision (CV < 5%)

### 4.3 Limites de Détection et Quantification

| Molécule | LOD (μg/mL) | LOQ (μg/mL) | Précision (RSD %) | Justesse (%) |
|----------|-------------|-------------|-------------------|--------------|
| α-Pinène | 0.05 | 0.15 | 3.2 | 98-102 |
| Limonène | 0.03 | 0.10 | 2.8 | 97-103 |
| Myrcène | 0.08 | 0.25 | 4.1 | 96-104 |
| Linalool | 0.04 | 0.12 | 3.5 | 98-102 |
| β-Caryophyllène | 0.10 | 0.30 | 4.8 | 95-105 |

**Définitions**
- **LOD** (Limit of Detection) : 3 × σ / pente
- **LOQ** (Limit of Quantification) : 10 × σ / pente
- **RSD** (Relative Standard Deviation) : (σ / moyenne) × 100
- **Justesse** : (Valeur mesurée / Valeur vraie) × 100

---

## 5. Contrôle Qualité

### 5.1 Validation de Méthode

**Critères de performance**
- **Linéarité** : R² ≥ 0.995 sur plage 1-100 μg/mL
- **Répétabilité** : RSD ≤ 5% (n=6, même jour)
- **Reproductibilité** : RSD ≤ 10% (n=6, jours différents)
- **Justesse** : Récupération 95-105%
- **Spécificité** : Résolution ≥ 1.5 entre pics adjacents

### 5.2 Échantillons de Contrôle

**QC Bas** : 3 μg/mL (près LOQ)
**QC Moyen** : 50 μg/mL (milieu de gamme)
**QC Haut** : 90 μg/mL (haut de gamme)

**Fréquence** : 1 QC tous les 10 échantillons

### 5.3 Maintenance Instrument

**Quotidienne**
- Vérifier pressions gaz vecteur
- Contrôler température injecteur/détecteur
- Injecter blanc solvant (vérifier contamination)

**Hebdomadaire**
- Injecter mélange de standards (vérifier TR et résolution)
- Nettoyer liner injecteur
- Vérifier tune MS (perfluorotributylamine PFTBA)

**Mensuelle**
- Remplacer septum injecteur
- Nettoyer source MS
- Vérifier calibration masse (m/z 69, 219, 502)

---

## 6. Applications PERFUMUM

### 6.1 Caractérisation des Tabacs

**Objectif** : Établir profil moléculaire complet des 8 variétés

**Protocole**
1. Extraire 3 échantillons par variété (triplicat biologique)
2. Analyser en GC-MS (Full Scan + SIM)
3. Identifier composés par comparaison spectres (NIST library)
4. Quantifier terpènes majeurs (étalonnage interne)
5. Calculer ratios caractéristiques (ex: Linalool/Limonène)

**Livrables**
- Chromatogrammes annotés (PDF)
- Tableaux composition (% aire, μg/g tabac)
- Cartes thermiques (heatmaps) pour comparaison variétés

### 6.2 Suivi de Stabilité

**Objectif** : Monitorer dégradation terpènes durant stockage

**Conditions testées**
- Température : 4°C, 20°C, 40°C
- Durée : 0, 1, 3, 6, 12 mois
- Atmosphère : Air, N₂

**Indicateurs**
- Concentration absolue (μg/g)
- % dégradation vs T0
- Apparition produits d'oxydation (oxydes, aldéhydes)

### 6.3 Contrôle Qualité Recettes

**Objectif** : Vérifier conformité formulation vs composition réelle

**Protocole**
1. Prélever échantillon recette finale
2. Analyser en GC-MS (SIM ciblé sur terpènes clés)
3. Comparer concentrations mesurées vs théoriques
4. Calculer écart relatif (%)
5. Accepter si écart < 10%

**Exemple : Recette "Lacta Solis"**
| Molécule | Théorique (μg/g) | Mesuré (μg/g) | Écart (%) | Statut |
|----------|------------------|---------------|-----------|--------|
| Linalool | 250 | 245 | -2.0 | ✅ OK |
| Limonène | 180 | 172 | -4.4 | ✅ OK |
| β-Caryophyllène | 120 | 128 | +6.7 | ✅ OK |

---

## Références Normatives

- **ISO 22382:2018** - Gas chromatography-mass spectrometry (GC-MS) - General guidelines
- **CORESTA Recommended Method N° 74** - Determination of selected terpenes in tobacco
- **FDA Guidance** - Analytical Procedures and Methods Validation for Drugs and Biologics (2015)
- **ICH Q2(R1)** - Validation of Analytical Procedures: Text and Methodology
