# Guide d'Import des Données d'Enrichissement PERFUMUM

**Date** : 25 décembre 2025  
**Objectif** : Enrichir la base de données avec 23 molécules et 18 recettes pour améliorer les recommandations IA

---

## 📋 Vue d'Ensemble

### Fichiers à Importer

1. **NOUVELLES_MOLECULES_25.csv** (23 molécules)
2. **NOUVELLES_RECETTES_18.csv** (18 recettes)

### Impact Attendu

| Métrique | Avant | Après | Amélioration |
|----------|-------|-------|--------------|
| **Molécules** | 176 | 199 | +13% |
| **Recettes** | 195 | 213 | +9% |
| **Liaisons molécules-recettes** | 0 ⚠️ | ~90 | +∞ |
| **Familles < 3 molécules** | 116/145 (80%) | ~100/145 (69%) | -11% |
| **Gamme Colombie** | 8 recettes | 12 recettes | +50% |

---

## 🔬 Phase 1 : Import des Molécules

### Fichier : NOUVELLES_MOLECULES_25.csv

#### Contenu

**23 nouvelles molécules** réparties dans 8 familles sous-représentées :

| Famille Chimique | Nombre | Molécules |
|------------------|--------|-----------|
| **Aldéhydes Marins** | 3 | Calone 1951, Maritima, Triplal |
| **Minéraux** | 3 | Silicate Note, Calcaire Olfactif, Schiste Olfactif |
| **Accords métalliques** | 3 | Fer Olfactif, Cuivre Olfactif, Bronze Note |
| **Phénols fumés** | 3 | Guaiacol Fumé, Crésol Fumé, Phénol Pyrogéné Doux |
| **Terpènes floraux** | 3 | Linalol Synthétique, Géraniol Pur, Nérol |
| **Cétones terpéniques** | 3 | Carvone L, Menthone, Pinocamphone |
| **Esters terpéniques** | 3 | Acétate de Linalyle, Acétate de Géranyle, Acétate de Bornyle |
| **Ionones** | 2 | Alpha-Ionone, Méthyl Ionone Gamma |

#### Caractéristiques Complètes

Chaque molécule possède :
- ✅ **Nom** et **famille chimique**
- ✅ **Formule chimique** (si applicable)
- ✅ **Profil olfactif détaillé** (descripteurs sensoriels)
- ✅ **Résonance émotionnelle** (évocations psychologiques)
- ✅ **Effet fonctionnel** (rôle dans la composition)
- ✅ **Origine/source** (naturelle ou synthétique)
- ✅ **Profil radar complet** (6 axes : intensité, fraîcheur, chaleur, douceur, épices, terreux)
- ✅ **Propriétés chimiques** (poids moléculaire, point d'ébullition, volatilité)
- ✅ **Sources botaniques** (pour molécules naturelles)
- ✅ **Méthode d'extraction** (hydrodistillation, CO₂, etc.)
- ✅ **Propriétés thérapeutiques** (aromathérapie)

#### Procédure d'Import

1. **Accéder à l'interface d'import** (si disponible dans l'application web)
2. **Sélectionner le fichier** `NOUVELLES_MOLECULES_25.csv`
3. **Vérifier le mapping des colonnes** :
   - `name` → Nom de la molécule
   - `family` → Famille chimique
   - `chemicalFormula` → Formule chimique
   - `olfactiveProfile` → Profil olfactif
   - `radarIntensity`, `radarFreshness`, etc. → Axes du radar
4. **Mode d'import** : `create` (nouvelles entrées uniquement)
5. **Lancer l'import**
6. **Vérifier** : 23 nouvelles molécules créées

#### Validation Post-Import

```sql
-- Vérifier le nombre total de molécules
SELECT COUNT(*) FROM molecules; -- Devrait être 199

-- Vérifier les nouvelles familles enrichies
SELECT family, COUNT(*) as count 
FROM molecules 
WHERE family IN ('Aldéhydes Marins', 'Minéraux', 'Accords métalliques', 'Phénols fumés', 'Terpènes floraux', 'Cétones terpéniques', 'Esters terpéniques', 'Ionone')
GROUP BY family;
```

---

## 🧪 Phase 2 : Import des Recettes

### Fichier : NOUVELLES_RECETTES_18.csv

#### Contenu

**18 nouvelles recettes** équilibrées par gamme :

| Gamme | Nombre | Recettes |
|-------|--------|----------|
| **Pétrichor** | 3 | Brume Marine Métallique, Pierre de Lune Humide, Orage Ferreux |
| **Volcanique** | 3 | Fumée de Temple Ancien, Lave Balsamique, Cendres Sacrées |
| **Civilisations** | 3 | Jardin de Roses Persanes, Soie et Épices, Bibliothèque d'Alexandrie |
| **Glaciaire** | 3 | Glacier de Menthe, Toundra Camphrée, Cristal de Glace |
| **Colombie** | 4 | Café Colombien Fumé, Fleur de Café, Cacao Sacré Maya, Tabac Vert Colombien |
| **Mossi** | 2 | Karité Sacré, Terre Rouge Mossi |

#### Caractéristiques Complètes

Chaque recette possède :
- ✅ **Nom** et **gamme** (Pétrichor, Volcanique, etc.)
- ✅ **Prototype** (C1-C4)
- ✅ **Description** poétique et conceptuelle
- ✅ **Notes de tête** (molécules volatiles, 20-30%)
- ✅ **Notes de cœur** (molécules principales, 40-50%)
- ✅ **Notes de fond** (molécules fixatrices, 20-30%)
- ✅ **Profil radar complet** (6 axes)
- ✅ **Formulation détaillée** (liste des molécules avec pourcentages, total 100%)
- ✅ **Protocole de fabrication** (étapes techniques)
- ✅ **Source d'inspiration** (culturelle/géographique)

#### Procédure d'Import

1. **Accéder à l'interface d'import**
2. **Sélectionner le fichier** `NOUVELLES_RECETTES_18.csv`
3. **Vérifier le mapping des colonnes** :
   - `name` → Nom de la recette
   - `gamme` → Gamme olfactive
   - `prototype` → Prototype (C1-C4)
   - `description` → Description
   - `notesTete`, `notesCoeur`, `notesFond` → Pyramide olfactive
   - `radarIntensity`, etc. → Axes du radar
   - `formulation` → Composition moléculaire (avec %)
   - `protocol` → Protocole de fabrication
4. **Mode d'import** : `create`
5. **Lancer l'import**
6. **Vérifier** : 18 nouvelles recettes créées

#### Validation Post-Import

```sql
-- Vérifier le nombre total de recettes
SELECT COUNT(*) FROM recettes; -- Devrait être 213

-- Vérifier la distribution par gamme
SELECT gamme, COUNT(*) as count 
FROM recettes 
GROUP BY gamme
ORDER BY count DESC;

-- Vérifier la gamme Colombie (devrait avoir 12 recettes maintenant)
SELECT COUNT(*) FROM recettes WHERE gamme = 'Colombie'; -- Devrait être 12
```

---

## 🔗 Phase 3 : Création des Liaisons Molécules-Recettes

### ⚠️ Problème Critique Identifié

**Actuellement : 0 liaison molécule-recette dans la base de données.**  
Toutes les 195 recettes existantes sont orphelines (sans molécules associées).

### Solution Intégrée

Les 18 nouvelles recettes incluent déjà les compositions moléculaires dans le champ **`formulation`**, avec :
- Liste des molécules utilisées
- Proportions en pourcentage (total 100%)
- Rôles dans la pyramide olfactive (tête/cœur/fond)

### Parsing Automatique (si implémenté)

Si l'application possède un parser automatique pour le champ `formulation`, les liaisons seront créées automatiquement lors de l'import des recettes.

Format du champ `formulation` :
```
Molécule1 X%, Molécule2 Y%, Molécule3 Z%, ...
```

Exemple :
```
Calone 1951 15%, Maritima 10%, Géosmine 20%, Fer Olfactif 15%, Silicate Note 10%, Vétiver 15%, Ambroxan 10%, Cèdre Atlas 5%
```

### Création Manuelle (si nécessaire)

Si le parsing automatique n'est pas disponible, il faudra créer manuellement les liaisons dans la table `recette_molecules` :

```sql
-- Exemple pour "BRUME MARINE MÉTALLIQUE"
INSERT INTO recette_molecules (recette_id, molecule_id, percentage, role)
VALUES
  (196, (SELECT id FROM molecules WHERE name = 'Calone 1951'), 15, 'tete'),
  (196, (SELECT id FROM molecules WHERE name = 'Maritima'), 10, 'tete'),
  (196, (SELECT id FROM molecules WHERE name = 'Géosmine'), 20, 'coeur'),
  (196, (SELECT id FROM molecules WHERE name = 'Fer Olfactif'), 15, 'coeur'),
  (196, (SELECT id FROM molecules WHERE name = 'Silicate Note'), 10, 'coeur'),
  (196, (SELECT id FROM molecules WHERE name = 'Vétiver'), 15, 'fond'),
  (196, (SELECT id FROM molecules WHERE name = 'Ambroxan'), 10, 'fond'),
  (196, (SELECT id FROM molecules WHERE name = 'Cèdre Atlas'), 5, 'fond');
```

### Validation Post-Liaison

```sql
-- Vérifier le nombre total de liaisons
SELECT COUNT(*) FROM recette_molecules; -- Devrait être > 0

-- Vérifier les liaisons pour les nouvelles recettes
SELECT r.name, COUNT(rm.id) as molecule_count
FROM recettes r
LEFT JOIN recette_molecules rm ON r.id = rm.recette_id
WHERE r.id >= 196
GROUP BY r.id, r.name
ORDER BY r.id;

-- Moyenne de molécules par recette (nouvelles recettes)
SELECT AVG(molecule_count) as avg_molecules
FROM (
  SELECT r.id, COUNT(rm.id) as molecule_count
  FROM recettes r
  LEFT JOIN recette_molecules rm ON r.id = rm.recette_id
  WHERE r.id >= 196
  GROUP BY r.id
) subquery;
-- Devrait être entre 5 et 8
```

---

## 🧪 Phase 4 : Tests et Validation

### 1. Test du Système de Recommandations

Après l'import, tester le système de recommandations IA :

#### Test 1 : Recommandations par Molécule

```
Molécule : Calone 1951
Recettes attendues : BRUME MARINE MÉTALLIQUE (devrait apparaître)
```

#### Test 2 : Recommandations par Profil Radar

```
Profil : Fraîcheur élevée (90), Terreux faible (10)
Recettes attendues : GLACIER DE MENTHE, CRISTAL DE GLACE
```

#### Test 3 : Similarité entre Recettes

```
Recette source : BRUME MARINE MÉTALLIQUE
Recettes similaires attendues : PIERRE DE LUNE HUMIDE, ORAGE FERREUX (même gamme Pétrichor)
```

### 2. Vérification de la Diversité

```sql
-- Distribution des recettes par gamme (devrait être équilibrée)
SELECT gamme, COUNT(*) as count, 
       ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM recettes), 2) as percentage
FROM recettes
GROUP BY gamme
ORDER BY count DESC;

-- Familles chimiques avec < 3 molécules (devrait diminuer)
SELECT family, COUNT(*) as count
FROM molecules
GROUP BY family
HAVING count < 3
ORDER BY count ASC;
```

### 3. Validation des Profils Radar

Vérifier que les profils radar des nouvelles recettes sont cohérents avec leurs gammes :

- **Pétrichor** : Fraîcheur élevée (75-90), Terreux élevé (80-90)
- **Volcanique** : Chaleur élevée (85-90), Épices élevé (45-65)
- **Civilisations** : Douceur élevée (65-85), Chaleur moyenne (50-65)
- **Glaciaire** : Fraîcheur très élevée (85-95), Chaleur faible (15-25)
- **Colombie** : Profils variés selon le concept
- **Mossi** : Chaleur moyenne-élevée (65-70), Terreux élevé (30-85)

---

## 📊 Métriques de Succès

### Avant Enrichissement

- Molécules : **176**
- Recettes : **195**
- Liaisons molécules-recettes : **0** ⚠️
- Familles < 3 molécules : **116/145 (80%)**
- Gamme Colombie : **8 recettes**

### Après Enrichissement (Cible)

- Molécules : **199** (+13%)
- Recettes : **213** (+9%)
- Liaisons molécules-recettes : **~90** (+∞)
- Familles < 3 molécules : **~100/145 (69%)** (-11%)
- Gamme Colombie : **12 recettes** (+50%)

### Indicateurs de Qualité

✅ **Diversité olfactive** : 8 nouvelles familles chimiques enrichies  
✅ **Équilibrage des gammes** : Toutes les gammes ont maintenant au moins 10 recettes  
✅ **Profils radar cohérents** : Chaque recette a un profil radar unique et représentatif  
✅ **Compositions réalistes** : Formulations avec 5-8 molécules, proportions totales = 100%  
✅ **Documentation complète** : Protocoles de fabrication et sources d'inspiration pour chaque recette  

---

## 🚨 Problèmes Potentiels et Solutions

### Problème 1 : Molécules Manquantes dans les Formulations

**Symptôme** : Certaines molécules mentionnées dans les formulations n'existent pas encore dans la base.

**Solution** :
1. Vérifier la liste des molécules existantes
2. Créer les molécules manquantes avant d'importer les recettes
3. Ou modifier les formulations pour utiliser uniquement des molécules existantes

### Problème 2 : Parsing du Champ Formulation

**Symptôme** : Les liaisons molécules-recettes ne sont pas créées automatiquement.

**Solution** :
1. Vérifier si l'application possède un parser pour le champ `formulation`
2. Si non, créer manuellement les liaisons via SQL (voir Phase 3)
3. Ou implémenter un script de parsing personnalisé

### Problème 3 : Doublons de Noms

**Symptôme** : Erreur "Nom déjà existant" lors de l'import.

**Solution** :
1. Vérifier les noms existants dans la base
2. Renommer les nouvelles entrées si nécessaire (ajouter suffixe, ex: "Linalol Synthétique v2")
3. Ou utiliser le mode `upsert` au lieu de `create`

### Problème 4 : Incohérence des Profils Radar

**Symptôme** : Les recommandations IA ne sont pas pertinentes.

**Solution** :
1. Recalculer les profils radar des recettes basés sur leurs compositions moléculaires
2. Vérifier que les profils radar des molécules sont cohérents
3. Ajuster manuellement les valeurs aberrantes

---

## 📝 Checklist Finale

### Avant l'Import

- [ ] Sauvegarder la base de données actuelle (backup)
- [ ] Vérifier que les fichiers CSV sont bien formatés
- [ ] Lire ce guide en entier
- [ ] Préparer les requêtes SQL de validation

### Pendant l'Import

- [ ] Importer `NOUVELLES_MOLECULES_25.csv` (23 molécules)
- [ ] Valider l'import des molécules (COUNT = 199)
- [ ] Importer `NOUVELLES_RECETTES_18.csv` (18 recettes)
- [ ] Valider l'import des recettes (COUNT = 213)
- [ ] Créer les liaisons molécules-recettes (si nécessaire)
- [ ] Valider les liaisons (COUNT > 0)

### Après l'Import

- [ ] Tester le système de recommandations (3 tests minimum)
- [ ] Vérifier la distribution des gammes (équilibrée)
- [ ] Vérifier les familles chimiques (< 100 familles sous-représentées)
- [ ] Valider les profils radar (cohérence avec les gammes)
- [ ] Documenter les résultats dans un rapport

### En Cas de Problème

- [ ] Consulter la section "Problèmes Potentiels et Solutions"
- [ ] Restaurer le backup si nécessaire
- [ ] Contacter le support technique
- [ ] Documenter le problème pour référence future

---

## 🎯 Prochaines Étapes

Après l'import réussi des données d'enrichissement :

1. **Enrichir les 195 recettes existantes** avec des liaisons molécules-recettes
2. **Créer 20-30 molécules supplémentaires** dans les familles encore sous-représentées
3. **Ajouter 15-20 nouvelles recettes** pour atteindre 230+ recettes totales
4. **Implémenter un système de validation automatique** des formulations (total = 100%)
5. **Développer un éditeur visuel de recettes** avec sélection de molécules et calcul automatique des profils radar

---

**Durée estimée totale** : 2-4 heures (selon la méthode d'import et la nécessité de créer manuellement les liaisons)

**Auteur** : Manus AI  
**Date** : 25 décembre 2025  
**Version** : 1.0
