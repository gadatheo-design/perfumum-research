/**
 * Script d'import des relations plante-molécule enrichies
 * Utilise SQL direct pour l'import
 */

import mysql from 'mysql2/promise';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Parse CSV file
function parseCSV(content) {
  const lines = content.trim().split('\n');
  const headers = lines[0].split(',');
  
  return lines.slice(1).map(line => {
    const values = [];
    let current = '';
    let inQuotes = false;
    
    for (const char of line) {
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current.trim());
    
    const row = {};
    headers.forEach((header, i) => {
      row[header.trim()] = values[i] || '';
    });
    return row;
  });
}

async function main() {
  console.log('=== Import des relations plante-molécule enrichies ===\n');
  
  // Connexion à la base de données
  const connection = await mysql.createConnection(process.env.DATABASE_URL);
  
  try {
    // Lire le fichier CSV
    const csvPath = path.join(__dirname, '../data/enriched_plant_molecules.csv');
    const csvContent = fs.readFileSync(csvPath, 'utf-8');
    const rows = parseCSV(csvContent);
    
    console.log(`Fichier CSV lu: ${rows.length} lignes\n`);
    
    // Récupérer les plantes et molécules existantes
    const [plantsRows] = await connection.execute('SELECT id, name, latin_name FROM plants');
    const [moleculesRows] = await connection.execute('SELECT id, name FROM molecules');
    
    console.log(`Plantes en base: ${plantsRows.length}`);
    console.log(`Molécules en base: ${moleculesRows.length}\n`);
    
    // Créer des maps pour la recherche rapide
    const plantsMap = new Map();
    for (const plant of plantsRows) {
      // Indexer par nom latin (normalisé)
      if (plant.latin_name) {
        plantsMap.set(plant.latin_name.toLowerCase().trim(), plant.id);
      }
      // Indexer par nom
      if (plant.name) {
        plantsMap.set(plant.name.toLowerCase().trim(), plant.id);
      }
    }
    
    const moleculesMap = new Map();
    for (const mol of moleculesRows) {
      if (mol.name) {
        moleculesMap.set(mol.name.toLowerCase().trim(), mol.id);
      }
    }
    
    // Récupérer les liaisons existantes
    const [existingLinks] = await connection.execute('SELECT plant_id, molecule_id FROM plant_molecules');
    const existingSet = new Set(existingLinks.map(l => `${l.plant_id}-${l.molecule_id}`));
    
    console.log(`Liaisons existantes: ${existingLinks.length}\n`);
    
    // Statistiques
    let created = 0;
    let plantNotFound = 0;
    let moleculeNotFound = 0;
    let alreadyExists = 0;
    
    const missingPlants = new Set();
    const missingMolecules = new Set();
    
    for (const row of rows) {
      // Trouver la plante
      const latinNameNorm = row.plant_latin_name?.toLowerCase().trim();
      const commonNameNorm = row.plant_common_name?.toLowerCase().trim();
      
      let plantId = plantsMap.get(latinNameNorm) || plantsMap.get(commonNameNorm);
      
      // Essayer avec le premier mot du nom latin (genre)
      if (!plantId && latinNameNorm) {
        const genus = latinNameNorm.split(' ')[0];
        for (const [key, id] of plantsMap.entries()) {
          if (key.startsWith(genus)) {
            plantId = id;
            break;
          }
        }
      }
      
      if (!plantId) {
        plantNotFound++;
        missingPlants.add(`${row.plant_common_name} (${row.plant_latin_name})`);
        continue;
      }
      
      // Trouver la molécule
      const moleculeNameNorm = row.molecule_name?.toLowerCase().trim();
      let moleculeId = moleculesMap.get(moleculeNameNorm);
      
      // Essayer avec des variantes
      if (!moleculeId) {
        // Essayer sans accents
        const withoutAccents = moleculeNameNorm
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '');
        moleculeId = moleculesMap.get(withoutAccents);
      }
      
      // Essayer avec recherche partielle
      if (!moleculeId) {
        for (const [key, id] of moleculesMap.entries()) {
          if (key.includes(moleculeNameNorm) || moleculeNameNorm.includes(key)) {
            moleculeId = id;
            break;
          }
        }
      }
      
      if (!moleculeId) {
        moleculeNotFound++;
        missingMolecules.add(row.molecule_name);
        continue;
      }
      
      // Vérifier si le lien existe déjà
      const linkKey = `${plantId}-${moleculeId}`;
      if (existingSet.has(linkKey)) {
        alreadyExists++;
        continue;
      }
      
      // Créer le lien
      try {
        const percentage = parseFloat(row.percentage_typical) || 0;
        const role = row.role || 'composant';
        const isSignature = parseInt(row.is_signature) || 0;
        
        await connection.execute(
          `INSERT INTO plant_molecules (plant_id, molecule_id, percentage_typical, role, is_signature) 
           VALUES (?, ?, ?, ?, ?)`,
          [plantId, moleculeId, percentage.toString(), role, isSignature]
        );
        
        existingSet.add(linkKey);
        created++;
        console.log(`✓ Lié: ${row.plant_common_name} ↔ ${row.molecule_name} (${percentage}%)`);
      } catch (error) {
        console.error(`Erreur: ${row.plant_common_name} ↔ ${row.molecule_name}:`, error.message);
      }
    }
    
    console.log('\n=== Résumé de l\'import ===');
    console.log(`Liaisons créées: ${created}`);
    console.log(`Liaisons existantes (ignorées): ${alreadyExists}`);
    console.log(`Plantes non trouvées: ${plantNotFound}`);
    console.log(`Molécules non trouvées: ${moleculeNotFound}`);
    
    if (missingPlants.size > 0) {
      console.log('\n--- Plantes manquantes (top 15) ---');
      Array.from(missingPlants).slice(0, 15).forEach(p => console.log(`  - ${p}`));
      if (missingPlants.size > 15) {
        console.log(`  ... et ${missingPlants.size - 15} autres`);
      }
    }
    
    if (missingMolecules.size > 0) {
      console.log('\n--- Molécules manquantes (top 15) ---');
      Array.from(missingMolecules).slice(0, 15).forEach(m => console.log(`  - ${m}`));
      if (missingMolecules.size > 15) {
        console.log(`  ... et ${missingMolecules.size - 15} autres`);
      }
    }
    
  } finally {
    await connection.end();
  }
}

main().catch(console.error);
