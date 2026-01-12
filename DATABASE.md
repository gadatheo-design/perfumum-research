# 🗄️ DOCUMENTATION BASE DE DONNÉES — PERFUMUM

**Version:** 1.0  
**Date:** 12 janvier 2026  
**Auteur:** Manus AI

---

## 📋 Table des Matières

1. [Vue d'ensemble](#vue-densemble)
2. [Entités principales](#entités-principales)
3. [Relations](#relations)
4. [Schéma détaillé](#schéma-détaillé)
5. [Migrations](#migrations)
6. [Requêtes courantes](#requêtes-courantes)
7. [Performance](#performance)
8. [Maintenance](#maintenance)

---

## Vue d'ensemble

La base de données PERFUMUM contient **~30 tables** organisées en plusieurs domaines :

| Domaine | Tables | Entités | Description |
|---------|--------|---------|-------------|
| **Authentification** | users, sessions | ~10 | Gestion des utilisateurs et sessions |
| **Molécules** | molecules, moleculeFamilies, moleculeNotes | ~556 | Composés chimiques olfactifs |
| **Recettes** | recipes, recipeCompositions, recipeNotes | ~266 | Formulations olfactives |
| **Plantes** | plants, plantVarieties, plantAnalyses | ~144 | Sources botaniques |
| **Terroirs** | terroirs, terroirGeocodes | ~29 | Origines géographiques |
| **Accords** | accords, accordCompositions | ~30 | Combinaisons harmonieuses |
| **Prototypes** | prototypes | 4 | C1, C2, C3, C4 |
| **Recherche** | references, studies, archives, protocols | ~100+ | Contenu éditorial scientifique |
| **Liaisons** | molecule_recipe_links, plant_molecule_links, etc. | Millions | Relations many-to-many |

### Statistiques actuelles

```
Molécules:           556 (50% liées aux recettes)
Recettes:            266 (93% avec molécules)
Plantes:             144 (19.4% liées aux terroirs)
Terroirs:            29  (65.5% avec plantes)
Accords:             30
Familles olfactives: 12
Matières premières:  80
Utilisateurs:        Variable
```

---

## Entités principales

### 1. Users (Utilisateurs)

Gère l'authentification et les rôles.

```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  openId VARCHAR(64) UNIQUE NOT NULL,          -- ID Manus OAuth
  name TEXT,                                    -- Nom complet
  email VARCHAR(320),                           -- Email
  loginMethod VARCHAR(64),                      -- Méthode de connexion
  role ENUM('user', 'admin') DEFAULT 'user',   -- Rôle
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  lastSignedIn TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE UNIQUE INDEX idx_users_openid ON users(openId);
CREATE INDEX idx_users_email ON users(email);
```

**Rôles:**
- `user` — Contributeur standard (peut ajouter des données)
- `admin` — Administrateur (peut éditer/supprimer tout)

---

### 2. Molecules (Molécules)

Contient les données chimiques des composés olfactifs.

```sql
CREATE TABLE molecules (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,                   -- Nom courant
  casNumber VARCHAR(50),                        -- Numéro CAS
  iupacName TEXT,                               -- Nom IUPAC
  chemicalClass VARCHAR(100),                   -- Classe chimique
  formula VARCHAR(100),                         -- Formule chimique
  molecularWeight DECIMAL(10, 2),               -- Poids moléculaire
  olfactiveProfile TEXT,                        -- Profil olfactif
  familyId INT,                                 -- Famille olfactive
  volatilityScore INT,                          -- Score de volatilité (0-10)
  intensityScore INT,                           -- Score d'intensité (0-10)
  status ENUM('draft', 'validated') DEFAULT 'draft',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (familyId) REFERENCES moleculeFamilies(id)
);

-- Indexes
CREATE UNIQUE INDEX idx_molecules_cas ON molecules(casNumber);
CREATE INDEX idx_molecules_family ON molecules(familyId);
CREATE INDEX idx_molecules_name ON molecules(name);
CREATE FULLTEXT INDEX idx_molecules_fulltext ON molecules(name, olfactiveProfile);
```

**Champs importants:**
- `casNumber` — Identifiant chimique unique (ex: 138-86-3 pour le limonène)
- `olfactiveProfile` — Description sensorielle (ex: "agrume frais, citron, pin")
- `volatilityScore` — 0-10 (0=fixe, 10=très volatil)
- `intensityScore` — 0-10 (0=très léger, 10=très intense)

---

### 3. Recipes (Recettes)

Contient les formulations olfactives.

```sql
CREATE TABLE recipes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,                   -- Nom de la recette
  description TEXT,                             -- Description
  composition JSON,                             -- Composition détaillée
  prototypeId INT,                              -- Prototype associé (C1-C4)
  accordId INT,                                 -- Accord principal
  concentration DECIMAL(5, 2),                  -- Concentration (%)
  status ENUM('draft', 'validated') DEFAULT 'draft',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (prototypeId) REFERENCES prototypes(id),
  FOREIGN KEY (accordId) REFERENCES accords(id)
);

-- Indexes
CREATE INDEX idx_recipes_prototype ON recipes(prototypeId);
CREATE INDEX idx_recipes_accord ON recipes(accordId);
CREATE FULLTEXT INDEX idx_recipes_fulltext ON recipes(name, description);
```

**Composition JSON:**
```json
{
  "molecules": [
    { "moleculeId": 1, "percentage": 25.5 },
    { "moleculeId": 2, "percentage": 15.0 }
  ],
  "notes": "Accord floral avec base boisée"
}
```

---

### 4. Plants (Plantes)

Contient les données botaniques.

```sql
CREATE TABLE plants (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,                   -- Nom courant
  scientificName VARCHAR(255),                  -- Nom scientifique
  family VARCHAR(100),                          -- Famille botanique
  description TEXT,                             -- Description
  origin VARCHAR(100),                          -- Origine géographique
  status ENUM('draft', 'validated') DEFAULT 'draft',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Indexes
CREATE UNIQUE INDEX idx_plants_scientific ON plants(scientificName);
CREATE INDEX idx_plants_family ON plants(family);
CREATE FULLTEXT INDEX idx_plants_fulltext ON plants(name, scientificName);
```

---

### 5. Terroirs (Terroirs)

Contient les origines géographiques.

```sql
CREATE TABLE terroirs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,                   -- Nom du terroir
  country VARCHAR(100) NOT NULL,                -- Pays
  region VARCHAR(100),                          -- Région
  latitude DECIMAL(10, 8),                      -- Latitude GPS
  longitude DECIMAL(11, 8),                     -- Longitude GPS
  climate VARCHAR(100),                         -- Type de climat
  altitude INT,                                 -- Altitude (m)
  description TEXT,                             -- Description
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_terroirs_country ON terroirs(country);
CREATE INDEX idx_terroirs_region ON terroirs(region);
```

---

### 6. Liaisons Many-to-Many

#### molecule_recipe_links (Molécule ↔ Recette)

```sql
CREATE TABLE molecule_recipe_links (
  id INT PRIMARY KEY AUTO_INCREMENT,
  moleculeId INT NOT NULL,
  recipeId INT NOT NULL,
  percentage DECIMAL(5, 2) NOT NULL,            -- Pourcentage dans la recette
  role VARCHAR(50),                             -- Rôle (note, base, cœur, etc.)
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (moleculeId) REFERENCES molecules(id) ON DELETE CASCADE,
  FOREIGN KEY (recipeId) REFERENCES recipes(id) ON DELETE CASCADE,
  UNIQUE KEY unique_molecule_recipe (moleculeId, recipeId)
);

-- Indexes
CREATE INDEX idx_links_molecule ON molecule_recipe_links(moleculeId);
CREATE INDEX idx_links_recipe ON molecule_recipe_links(recipeId);
```

#### plant_molecule_links (Plante ↔ Molécule)

```sql
CREATE TABLE plant_molecule_links (
  id INT PRIMARY KEY AUTO_INCREMENT,
  plantId INT NOT NULL,
  moleculeId INT NOT NULL,
  extractionMethod VARCHAR(100),                -- Méthode d'extraction
  percentage DECIMAL(5, 2),                     -- Pourcentage naturel
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (plantId) REFERENCES plants(id) ON DELETE CASCADE,
  FOREIGN KEY (moleculeId) REFERENCES molecules(id) ON DELETE CASCADE,
  UNIQUE KEY unique_plant_molecule (plantId, moleculeId)
);

-- Indexes
CREATE INDEX idx_plant_molecule_plant ON plant_molecule_links(plantId);
CREATE INDEX idx_plant_molecule_molecule ON plant_molecule_links(moleculeId);
```

#### plant_terroir_links (Plante ↔ Terroir)

```sql
CREATE TABLE plant_terroir_links (
  id INT PRIMARY KEY AUTO_INCREMENT,
  plantId INT NOT NULL,
  terroirId INT NOT NULL,
  cultivationMethod VARCHAR(100),               -- Méthode de culture
  harvestSeason VARCHAR(50),                    -- Saison de récolte
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (plantId) REFERENCES plants(id) ON DELETE CASCADE,
  FOREIGN KEY (terroirId) REFERENCES terroirs(id) ON DELETE CASCADE,
  UNIQUE KEY unique_plant_terroir (plantId, terroirId)
);

-- Indexes
CREATE INDEX idx_plant_terroir_plant ON plant_terroir_links(plantId);
CREATE INDEX idx_plant_terroir_terroir ON plant_terroir_links(terroirId);
```

---

## Relations

### Diagramme des relations

```
Users
  ├─ UserFavorites → Molecules
  ├─ MoleculeNotes
  ├─ RecipeNotes
  └─ UserNotes

Molecules
  ├─ MoleculeFamilies
  ├─ molecule_recipe_links → Recipes
  ├─ plant_molecule_links → Plants
  └─ MoleculeNotes

Recipes
  ├─ Prototypes
  ├─ Accords
  ├─ molecule_recipe_links → Molecules
  └─ RecipeNotes

Plants
  ├─ plant_molecule_links → Molecules
  ├─ plant_terroir_links → Terroirs
  ├─ PlantVarieties
  ├─ PlantAnalyses
  └─ PlantSamples

Terroirs
  ├─ plant_terroir_links → Plants
  └─ TerroirGeocodes

Prototypes (C1-C4)
  └─ Recipes

Accords
  └─ Recipes
```

---

## Schéma détaillé

### Tables de support

#### MoleculeFamilies (Familles olfactives)

```sql
CREATE TABLE moleculeFamilies (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  emoji VARCHAR(10),
  color VARCHAR(20),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Données d'exemple
INSERT INTO moleculeFamilies (name, emoji, color) VALUES
('Agrumes', '🍋', '#FDB913'),
('Floraux', '🌸', '#FF69B4'),
('Boisés', '🌲', '#8B4513'),
('Épicés', '🌶️', '#FF6347'),
('Fruités', '🍓', '#DC143C'),
('Herbacés', '🌿', '#228B22'),
('Minéraux', '🪨', '#808080'),
('Musqués', '🐚', '#DEB887'),
('Vanillés', '🍦', '#F4A460'),
('Tabacés', '🚬', '#8B7355'),
('Alcaloïdes', '⚗️', '#4B0082'),
('Terpéniques', '🌊', '#1E90FF');
```

#### Prototypes

```sql
CREATE TABLE prototypes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  code VARCHAR(10) UNIQUE NOT NULL,             -- C1, C2, C3, C4
  name VARCHAR(255) NOT NULL,
  emoji VARCHAR(10),
  conceptualAxis TEXT,
  sensoryForm TEXT,
  olfactiveFamily TEXT,
  keyEmotion TEXT,
  color VARCHAR(20),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Données d'exemple
INSERT INTO prototypes (code, name, emoji, color) VALUES
('C1', 'Fermentum', '🍂', '#8B4513'),
('C2', 'Clarus Verde', '🌿', '#228B22'),
('C3', 'Lacta Solis', '☀️', '#FFD700'),
('C4', 'Terra Ambra', '🪨', '#A0826D');
```

---

## Migrations

### Créer une migration

```bash
# 1. Modifier le schéma dans drizzle/schema.ts
# 2. Générer la migration
pnpm db:push

# Ou manuellement:
pnpm drizzle-kit generate

# 3. Vérifier la migration générée
# Fichier créé: drizzle/migrations/0XXX_*.sql

# 4. Appliquer la migration
pnpm drizzle-kit migrate

# 5. Vérifier le résultat
mysql -u user -p database < drizzle/migrations/0XXX_*.sql
```

### Exemple de migration

```sql
-- Migration: Ajouter colonne volatilityScore aux molécules
ALTER TABLE molecules ADD COLUMN volatilityScore INT DEFAULT 5;
ALTER TABLE molecules ADD COLUMN intensityScore INT DEFAULT 5;

-- Créer index pour performance
CREATE INDEX idx_molecules_volatility ON molecules(volatilityScore);
CREATE INDEX idx_molecules_intensity ON molecules(intensityScore);
```

---

## Requêtes courantes

### Récupérer une molécule avec ses recettes

```sql
SELECT 
  m.*,
  COUNT(DISTINCT mrl.recipeId) as recipe_count
FROM molecules m
LEFT JOIN molecule_recipe_links mrl ON m.id = mrl.moleculeId
WHERE m.id = 1
GROUP BY m.id;
```

### Récupérer une recette avec ses molécules

```sql
SELECT 
  r.*,
  JSON_ARRAYAGG(
    JSON_OBJECT(
      'moleculeId', mrl.moleculeId,
      'moleculeName', m.name,
      'percentage', mrl.percentage
    )
  ) as molecules
FROM recipes r
LEFT JOIN molecule_recipe_links mrl ON r.id = mrl.recipeId
LEFT JOIN molecules m ON mrl.moleculeId = m.id
WHERE r.id = 1
GROUP BY r.id;
```

### Récupérer les plantes d'un terroir

```sql
SELECT DISTINCT p.*
FROM plants p
JOIN plant_terroir_links ptl ON p.id = ptl.plantId
WHERE ptl.terroirId = 1;
```

### Recherche full-text

```sql
SELECT * FROM molecules
WHERE MATCH(name, olfactiveProfile) AGAINST('citron agrume' IN BOOLEAN MODE);
```

### Statistiques de couverture

```sql
-- Couverture molécule → recette
SELECT 
  COUNT(DISTINCT m.id) as total_molecules,
  COUNT(DISTINCT mrl.moleculeId) as molecules_with_recipes,
  ROUND(100 * COUNT(DISTINCT mrl.moleculeId) / COUNT(DISTINCT m.id), 1) as coverage_percent
FROM molecules m
LEFT JOIN molecule_recipe_links mrl ON m.id = mrl.moleculeId;

-- Couverture plante → terroir
SELECT 
  COUNT(DISTINCT p.id) as total_plants,
  COUNT(DISTINCT ptl.plantId) as plants_with_terroirs,
  ROUND(100 * COUNT(DISTINCT ptl.plantId) / COUNT(DISTINCT p.id), 1) as coverage_percent
FROM plants p
LEFT JOIN plant_terroir_links ptl ON p.id = ptl.plantId;
```

---

## Performance

### Indexes critiques

```sql
-- Recherche par CAS
CREATE UNIQUE INDEX idx_molecules_cas ON molecules(casNumber);

-- Recherche par famille
CREATE INDEX idx_molecules_family ON molecules(familyId);

-- Recherche full-text
CREATE FULLTEXT INDEX idx_molecules_fulltext ON molecules(name, olfactiveProfile);

-- Liaisons rapides
CREATE INDEX idx_links_molecule ON molecule_recipe_links(moleculeId);
CREATE INDEX idx_links_recipe ON molecule_recipe_links(recipeId);

-- Géolocalisation
CREATE SPATIAL INDEX idx_terroirs_location ON terroirs(POINT(latitude, longitude));
```

### Optimisations recommandées

- [ ] Ajouter des indexes sur les colonnes fréquemment filtrées
- [ ] Utiliser le partitioning pour les grandes tables
- [ ] Archiver les données anciennes
- [ ] Analyser les requêtes lentes avec `EXPLAIN`
- [ ] Cacher les résultats avec Redis

### Vérifier les performances

```bash
# Analyser une requête
EXPLAIN SELECT * FROM molecules WHERE familyId = 1;

# Vérifier les index utilisés
SHOW INDEX FROM molecules;

# Statistiques de table
SHOW TABLE STATUS LIKE 'molecules';
```

---

## Maintenance

### Backup

```bash
# Backup complet
mysqldump -u user -p database > backup.sql

# Backup avec compression
mysqldump -u user -p database | gzip > backup.sql.gz

# Restore
mysql -u user -p database < backup.sql
```

### Nettoyage

```sql
-- Supprimer les brouillons non validés (> 30 jours)
DELETE FROM molecules 
WHERE status = 'draft' 
AND updatedAt < DATE_SUB(NOW(), INTERVAL 30 DAY);

-- Supprimer les liaisons orphelines
DELETE FROM molecule_recipe_links 
WHERE moleculeId NOT IN (SELECT id FROM molecules)
OR recipeId NOT IN (SELECT id FROM recipes);
```

### Monitoring

```sql
-- Taille de la base de données
SELECT 
  table_name,
  ROUND(((data_length + index_length) / 1024 / 1024), 2) AS size_mb
FROM information_schema.tables
WHERE table_schema = 'perfumum'
ORDER BY size_mb DESC;

-- Nombre de lignes par table
SELECT table_name, table_rows
FROM information_schema.tables
WHERE table_schema = 'perfumum'
ORDER BY table_rows DESC;
```

---

## 🔗 Ressources

- [Drizzle ORM Documentation](https://orm.drizzle.team)
- [MySQL Documentation](https://dev.mysql.com/doc)
- [SQL Performance Tuning](https://use-the-index-luke.com)

---

**Dernière mise à jour:** 12 janvier 2026  
**Auteur:** Manus AI  
**Prochaine révision:** Après restructuration majeure
