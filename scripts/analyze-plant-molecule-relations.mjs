import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';

// Déterminer le chemin de la base de données
const dbPath = process.env.DATABASE_URL?.replace('file:', '') || './data.db';
console.log(`Connecting to database: ${dbPath}`);

const db = new Database(dbPath);

// Analyser les pourcentages
console.log('\n=== DISTRIBUTION DES POURCENTAGES ===');
const percentageRanges = db.prepare(`
  SELECT 
    CASE 
      WHEN percentage IS NULL THEN 'NULL'
      WHEN percentage = 0 THEN '0'
      WHEN percentage BETWEEN 1 AND 5 THEN '1-5'
      WHEN percentage BETWEEN 5 AND 10 THEN '5-10'
      WHEN percentage BETWEEN 10 AND 20 THEN '10-20'
      WHEN percentage BETWEEN 20 AND 30 THEN '20-30'
      WHEN percentage > 30 THEN '>30'
    END as range,
    COUNT(*) as count
  FROM plant_molecules
  GROUP BY range
  ORDER BY CAST(range AS UNSIGNED)
`).all();

console.table(percentageRanges);

// Analyser les sources
console.log('\n=== COUVERTURE DES SOURCES ===');
const sourcesCoverage = db.prepare(`
  SELECT 
    CASE 
      WHEN source IS NULL OR source = '' THEN 'Sans source'
      ELSE 'Avec source'
    END as source_status,
    COUNT(*) as count
  FROM plant_molecules
  GROUP BY source_status
`).all();

console.table(sourcesCoverage);

// Analyser par catégorie de plante
console.log('\n=== PAR CATÉGORIE DE PLANTE ===');
const byCategory = db.prepare(`
  SELECT 
    p.category,
    COUNT(DISTINCT p.id) as plant_count,
    COUNT(pm.id) as molecule_links,
    ROUND(AVG(pm.percentage), 2) as avg_percentage,
    SUM(CASE WHEN pm.source IS NOT NULL AND pm.source != '' THEN 1 ELSE 0 END) as with_source
  FROM plants p
  LEFT JOIN plant_molecules pm ON p.id = pm.plant_id
  GROUP BY p.category
  ORDER BY plant_count DESC
`).all();

console.table(byCategory);

// Top 20 plantes avec le moins de liaisons
console.log('\n=== TOP 20 PLANTES AVEC LE MOINS DE LIAISONS ===');
const orphans = db.prepare(`
  SELECT 
    p.name,
    p.category,
    COUNT(pm.id) as molecule_count,
    GROUP_CONCAT(m.name, ', ') as molecules
  FROM plants p
  LEFT JOIN plant_molecules pm ON p.id = pm.plant_id
  LEFT JOIN molecules m ON pm.molecule_id = m.id
  GROUP BY p.id
  ORDER BY molecule_count ASC
  LIMIT 20
`).all();

console.table(orphans);

// Analyser les molécules les plus liées
console.log('\n=== TOP 20 MOLÉCULES LES PLUS LIÉES ===');
const topMolecules = db.prepare(`
  SELECT 
    m.name,
    COUNT(pm.id) as plant_count,
    ROUND(AVG(pm.percentage), 2) as avg_percentage,
    MIN(pm.percentage) as min_percentage,
    MAX(pm.percentage) as max_percentage,
    SUM(CASE WHEN pm.source IS NOT NULL AND pm.source != '' THEN 1 ELSE 0 END) as with_source
  FROM molecules m
  LEFT JOIN plant_molecules pm ON m.id = pm.molecule_id
  GROUP BY m.id
  ORDER BY plant_count DESC
  LIMIT 20
`).all();

console.table(topMolecules);

// Statistiques globales
console.log('\n=== STATISTIQUES GLOBALES ===');
const stats = db.prepare(`
  SELECT 
    COUNT(DISTINCT p.id) as total_plants,
    COUNT(DISTINCT m.id) as total_molecules,
    COUNT(pm.id) as total_links,
    ROUND(AVG(pm.percentage), 2) as avg_percentage,
    MIN(pm.percentage) as min_percentage,
    MAX(pm.percentage) as max_percentage,
    SUM(CASE WHEN pm.source IS NOT NULL AND pm.source != '' THEN 1 ELSE 0 END) as links_with_source,
    ROUND(100.0 * SUM(CASE WHEN pm.source IS NOT NULL AND pm.source != '' THEN 1 ELSE 0 END) / COUNT(pm.id), 2) as source_coverage_percent
  FROM plants p
  CROSS JOIN molecules m
  LEFT JOIN plant_molecules pm ON p.id = pm.plant_id AND m.id = pm.molecule_id
`).all();

console.table(stats);

db.close();
