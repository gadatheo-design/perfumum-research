#!/usr/bin/env node
/**
 * Script d'enrichissement des liaisons plante-molécule
 * Importe les données depuis les fichiers CSV sources
 */

import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

const DATABASE_URL = process.env.DATABASE_URL;

async function main() {
  console.log('=== ENRICHISSEMENT DES LIAISONS PLANTE-MOLÉCULE ===\n');
  
  const connection = await mysql.createConnection(DATABASE_URL);
  
  try {
    // 1. Charger les plantes et molécules existantes
    console.log('1. Chargement des entités existantes...');
    const [plants] = await connection.execute('SELECT id, name, latin_name FROM plants');
    const [molecules] = await connection.execute('SELECT id, name FROM molecules');
    
    // Créer des maps pour la recherche rapide
    const plantByName = new Map();
    const plantByLatinName = new Map();
    plants.forEach(p => {
      plantByName.set(p.name.toLowerCase().trim(), p.id);
      if (p.latin_name) {
        plantByLatinName.set(p.latin_name.toLowerCase().trim(), p.id);
      }
    });
    
    const moleculeByName = new Map();
    molecules.forEach(m => {
      moleculeByName.set(m.name.toLowerCase().trim(), m.id);
    });
    
    console.log(`   - ${plants.length} plantes chargées`);
    console.log(`   - ${molecules.length} molécules chargées`);
    
    // 2. Charger les liaisons existantes
    const [existingLinks] = await connection.execute('SELECT plant_id, molecule_id FROM plant_molecules');
    const existingSet = new Set(existingLinks.map(l => `${l.plant_id}-${l.molecule_id}`));
    console.log(`   - ${existingLinks.length} liaisons existantes\n`);
    
    // 3. Traiter le fichier enriched_plant_molecules.csv
    console.log('2. Traitement de enriched_plant_molecules.csv...');
    const enrichedPath = path.join(process.cwd(), 'data/enriched_plant_molecules.csv');
    const enrichedData = fs.readFileSync(enrichedPath, 'utf-8');
    const enrichedRecords = parse(enrichedData, { columns: true, skip_empty_lines: true });
    
    let newLinksCount = 0;
    let updatedLinksCount = 0;
    let notFoundPlants = new Set();
    let notFoundMolecules = new Set();
    
    for (const record of enrichedRecords) {
      const plantLatinName = record.plant_latin_name?.toLowerCase().trim();
      const plantCommonName = record.plant_common_name?.toLowerCase().trim();
      const moleculeName = record.molecule_name?.toLowerCase().trim();
      
      // Trouver la plante
      let plantId = plantByLatinName.get(plantLatinName) || plantByName.get(plantCommonName);
      if (!plantId) {
        notFoundPlants.add(record.plant_latin_name || record.plant_common_name);
        continue;
      }
      
      // Trouver la molécule
      let moleculeId = moleculeByName.get(moleculeName);
      if (!moleculeId) {
        notFoundMolecules.add(record.molecule_name);
        continue;
      }
      
      const linkKey = `${plantId}-${moleculeId}`;
      
      // Convertir le rôle
      let role = null;
      if (record.role) {
        const roleMap = {
          'majeur': 'majeur',
          'secondaire': 'secondaire',
          'trace': 'trace',
          'variable': 'variable'
        };
        role = roleMap[record.role.toLowerCase()] || null;
      }
      
      const percentageTypical = record.percentage_typical ? parseFloat(record.percentage_typical) : null;
      const isSignature = record.is_signature === '1' ? 1 : 0;
      
      if (existingSet.has(linkKey)) {
        // Mettre à jour la liaison existante si on a des données supplémentaires
        if (percentageTypical || role || isSignature) {
          await connection.execute(`
            UPDATE plant_molecules 
            SET percentage_typical = COALESCE(?, percentage_typical),
                role = COALESCE(?, role),
                is_signature = COALESCE(?, is_signature),
                updated_at = NOW()
            WHERE plant_id = ? AND molecule_id = ?
          `, [percentageTypical, role, isSignature, plantId, moleculeId]);
          updatedLinksCount++;
        }
      } else {
        // Créer une nouvelle liaison
        await connection.execute(`
          INSERT INTO plant_molecules (plant_id, molecule_id, percentage_typical, role, is_signature, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, NOW(), NOW())
        `, [plantId, moleculeId, percentageTypical, role, isSignature]);
        existingSet.add(linkKey);
        newLinksCount++;
      }
    }
    
    console.log(`   - ${newLinksCount} nouvelles liaisons créées`);
    console.log(`   - ${updatedLinksCount} liaisons mises à jour`);
    if (notFoundPlants.size > 0) {
      console.log(`   - ${notFoundPlants.size} plantes non trouvées`);
    }
    if (notFoundMolecules.size > 0) {
      console.log(`   - ${notFoundMolecules.size} molécules non trouvées`);
    }
    
    // 4. Traiter le fichier perfumum_plants_molecules_relations.csv
    console.log('\n3. Traitement de perfumum_plants_molecules_relations.csv...');
    const relationsPath = path.join(process.cwd(), 'data/perfumum_plants_molecules_relations.csv');
    const relationsData = fs.readFileSync(relationsPath, 'utf-8');
    const relationsRecords = parse(relationsData, { columns: true, skip_empty_lines: true });
    
    let newLinksCount2 = 0;
    let notFoundPlants2 = new Set();
    let notFoundMolecules2 = new Set();
    
    for (const record of relationsRecords) {
      const plantLatinName = record.plant_latin_name?.toLowerCase().trim();
      const plantName = record.plant_name?.toLowerCase().trim();
      const moleculeName = record.molecule_name?.toLowerCase().trim();
      
      // Trouver la plante
      let plantId = plantByLatinName.get(plantLatinName) || plantByName.get(plantName);
      if (!plantId) {
        notFoundPlants2.add(record.plant_latin_name || record.plant_name);
        continue;
      }
      
      // Trouver la molécule
      let moleculeId = moleculeByName.get(moleculeName);
      if (!moleculeId) {
        notFoundMolecules2.add(record.molecule_name);
        continue;
      }
      
      const linkKey = `${plantId}-${moleculeId}`;
      
      if (!existingSet.has(linkKey)) {
        // Convertir le poids en rôle
        let role = null;
        if (record.weight) {
          const weightMap = {
            'dominant': 'majeur',
            'secondary': 'secondaire',
            'trace': 'trace'
          };
          role = weightMap[record.weight.toLowerCase()] || null;
        }
        
        await connection.execute(`
          INSERT INTO plant_molecules (plant_id, molecule_id, role, notes, created_at, updated_at)
          VALUES (?, ?, ?, ?, NOW(), NOW())
        `, [plantId, moleculeId, role, record.notes || null]);
        existingSet.add(linkKey);
        newLinksCount2++;
      }
    }
    
    console.log(`   - ${newLinksCount2} nouvelles liaisons créées`);
    if (notFoundPlants2.size > 0) {
      console.log(`   - ${notFoundPlants2.size} plantes non trouvées`);
    }
    if (notFoundMolecules2.size > 0) {
      console.log(`   - ${notFoundMolecules2.size} molécules non trouvées`);
    }
    
    // 5. Statistiques finales
    console.log('\n=== STATISTIQUES FINALES ===');
    const [finalStats] = await connection.execute(`
      SELECT 
        (SELECT COUNT(*) FROM plant_molecules) as total_liaisons,
        (SELECT COUNT(DISTINCT plant_id) FROM plant_molecules) as plantes_liees,
        (SELECT COUNT(DISTINCT molecule_id) FROM plant_molecules) as molecules_liees,
        (SELECT COUNT(*) FROM plants) as total_plantes,
        (SELECT COUNT(*) FROM molecules) as total_molecules
    `);
    
    const stats = finalStats[0];
    console.log(`Total liaisons: ${stats.total_liaisons}`);
    console.log(`Plantes avec liaisons: ${stats.plantes_liees}/${stats.total_plantes} (${(stats.plantes_liees/stats.total_plantes*100).toFixed(1)}%)`);
    console.log(`Molécules avec liaisons: ${stats.molecules_liees}/${stats.total_molecules} (${(stats.molecules_liees/stats.total_molecules*100).toFixed(1)}%)`);
    
    // 6. Afficher les plantes et molécules non trouvées pour référence
    if (notFoundPlants.size > 0 || notFoundPlants2.size > 0) {
      console.log('\n=== PLANTES NON TROUVÉES (à ajouter manuellement) ===');
      const allNotFoundPlants = new Set([...notFoundPlants, ...notFoundPlants2]);
      [...allNotFoundPlants].slice(0, 20).forEach(p => console.log(`  - ${p}`));
      if (allNotFoundPlants.size > 20) {
        console.log(`  ... et ${allNotFoundPlants.size - 20} autres`);
      }
    }
    
    if (notFoundMolecules.size > 0 || notFoundMolecules2.size > 0) {
      console.log('\n=== MOLÉCULES NON TROUVÉES (à ajouter manuellement) ===');
      const allNotFoundMolecules = new Set([...notFoundMolecules, ...notFoundMolecules2]);
      [...allNotFoundMolecules].slice(0, 20).forEach(m => console.log(`  - ${m}`));
      if (allNotFoundMolecules.size > 20) {
        console.log(`  ... et ${allNotFoundMolecules.size - 20} autres`);
      }
    }
    
  } finally {
    await connection.end();
  }
}

main().catch(console.error);
