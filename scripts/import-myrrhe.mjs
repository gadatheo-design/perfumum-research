#!/usr/bin/env node
/**
 * PERFUMUM - Import Myrrhe (Commiphora myrrha)
 * Jour 3 - Import des plantes historiques
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import mysql from 'mysql2/promise';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuration de la base de données depuis les variables d'environnement
const DB_URL = process.env.DATABASE_URL;

if (!DB_URL) {
  console.error('❌ DATABASE_URL non définie');
  process.exit(1);
}

async function main() {
  console.log('🌿 Import de la Myrrhe (Commiphora myrrha)...\n');

  // Connexion à la base de données
  const connection = await mysql.createConnection(DB_URL);

  try {
    // Charger les données
    const dataPath = join(__dirname, 'data', 'myrrhe-data.json');
    const data = JSON.parse(readFileSync(dataPath, 'utf-8'));

    // 1. Importer la plante
    console.log('📦 Import de la plante...');
    const plantData = data.plant;
    
    // Convertir climatic_axis ("bois; disparition" -> "bois_disparition")
    let climaticAxis = null;
    if (plantData.climatic_axis) {
      const axes = plantData.climatic_axis.split(';').map(s => s.trim());
      if (axes.length === 1) {
        climaticAxis = axes[0];
      } else if (axes.length === 2) {
        climaticAxis = axes.sort().join('_');
      }
    }

    const [plantResult] = await connection.execute(
      `INSERT INTO plants (
        name, latin_name, family, category, origin, habitat,
        olfactive_signature, dominant_molecules, climatic_axis,
        traditional_use, absorbe_use,
        conservation_status, cites_appendix, conservation_notes,
        threat_factors, sustainable_alternatives
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        conservation_status = VALUES(conservation_status),
        cites_appendix = VALUES(cites_appendix),
        conservation_notes = VALUES(conservation_notes),
        threat_factors = VALUES(threat_factors),
        sustainable_alternatives = VALUES(sustainable_alternatives)`,
      [
        plantData.name,
        plantData.latin_name,
        plantData.family,
        plantData.category,
        plantData.origin,
        plantData.habitat,
        plantData.olfactive_signature,
        plantData.dominant_molecules,
        climaticAxis,
        plantData.traditional_use,
        plantData.absorbe_use,
        plantData.conservation_status,
        plantData.cites_appendix,
        plantData.conservation_notes,
        JSON.stringify(plantData.threat_factors),
        plantData.sustainable_alternatives
      ]
    );

    const plantId = plantResult.insertId;
    console.log(`✅ Plante importée : ${plantData.name} (ID: ${plantId})`);

    // 2. Importer les molécules
    console.log('\n🧪 Import des molécules...');
    const moleculeIds = new Map();
    
    for (const mol of data.molecules) {
      const [molResult] = await connection.execute(
        `INSERT INTO molecules (name, family) VALUES (?, ?)
         ON DUPLICATE KEY UPDATE id = LAST_INSERT_ID(id)`,
        [mol.molecule_name, mol.family]
      );
      moleculeIds.set(mol.molecule_name, molResult.insertId);
      console.log(`  ✓ ${mol.molecule_name}`);
    }

    // 3. Créer les relations plante-molécules
    console.log('\n🔗 Création des relations plante-molécules...');
    for (const rel of data.relations) {
      const moleculeId = moleculeIds.get(rel.molecule_name);
      if (!moleculeId) continue;

      // Convertir weight ("dominant"/"secondary" -> role + percentage)
      const role = rel.weight === 'dominant' ? 'majeur' : 'secondaire';
      const percentage = rel.weight === 'dominant' ? 15.0 : 5.0;
      
      await connection.execute(
        `INSERT IGNORE INTO plant_molecules (plant_id, molecule_id, role, percentage, notes)
         VALUES (?, ?, ?, ?, ?)`,
        [plantId, moleculeId, role, percentage, `Profil moléculaire de ${plantData.name}`]
      );
      console.log(`  ✓ ${plantData.name} → ${rel.molecule_name} (${role}, ${percentage}%)`);
    }

    // 4. Créer les marqueurs civilisationnels
    console.log('\n🏛️ Création des marqueurs civilisationnels...');
    for (const marker of data.civilizational_markers) {
      await connection.execute(
        `INSERT INTO civilizational_markers (
          plant_id, civilization, period, start_year, end_year,
          usage_type, historical_significance, trade_routes, primary_sources
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          plantId,
          marker.civilization,
          marker.period,
          marker.start_year,
          marker.end_year,
          marker.usage_type,
          marker.historical_significance,
          JSON.stringify(marker.trade_routes),
          JSON.stringify(marker.primary_sources)
        ]
      );
      console.log(`  ✓ ${marker.civilization} (${marker.period}) - ${marker.usage_type}`);
    }

    console.log('\n✅ Import de la myrrhe terminé avec succès !');
    console.log(`   - 1 plante importée`);
    console.log(`   - ${data.molecules.length} molécules importées`);
    console.log(`   - ${data.relations.length} relations créées`);
    console.log(`   - ${data.civilizational_markers.length} marqueurs civilisationnels créés`);

  } catch (error) {
    console.error('❌ Erreur lors de l\'import:', error);
    throw error;
  } finally {
    await connection.end();
  }
}

main().catch(console.error);
