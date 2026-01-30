#!/usr/bin/env node
/**
 * PERFUMUM - Import Boswellia (Encens)
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
  console.log('🌿 Import des Boswellia (Encens)...\n');

  // Connexion à la base de données
  const connection = await mysql.createConnection(DB_URL);

  try {
    // Charger les données
    const dataPath = join(__dirname, 'data', 'boswellia-data.json');
    const data = JSON.parse(readFileSync(dataPath, 'utf-8'));

    let totalPlants = 0;
    let totalMolecules = 0;
    let totalRelations = 0;

    for (const entry of data.entries) {
      const plantData = entry.plant;
      
      console.log(`\n📦 Import de ${plantData.name}...`);
      
      // Mapper climatic_axis: "vent; bois" -> "vent_bois"
      let climaticAxis = null;
      if (plantData.climatic_axis) {
        const axes = plantData.climatic_axis.toLowerCase().split(';').map(a => a.trim());
        if (axes.length === 1) {
          climaticAxis = axes[0];
        } else if (axes.length === 2) {
          // Ordre canonique: vent < bois < disparition
          const order = { vent: 1, bois: 2, disparition: 3 };
          axes.sort((a, b) => (order[a] || 99) - (order[b] || 99));
          climaticAxis = axes.join('_');
        }
      }
      
      // 1. Importer la plante
      const [plantResult] = await connection.execute(
        `INSERT INTO plants (
          name, latin_name, family, category, origin, habitat,
          olfactive_signature, dominant_molecules, climatic_axis,
          traditional_use, absorbe_use,
          conservation_status, cites_appendix, conservation_notes,
          threat_factors, sustainable_alternatives,
          last_assessment_year, historical_status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
          plantData.sustainable_alternatives,
          plantData.last_assessment_year,
          plantData.historical_status
        ]
      );

      const plantId = plantResult.insertId;
      console.log(`✅ Plante importée : ${plantData.name} (ID: ${plantId})`);
      totalPlants++;

      // 2. Importer les molécules
      const moleculeIds = new Map();
      
      for (const mol of entry.molecules) {
        const [molResult] = await connection.execute(
          `INSERT INTO molecules (name, family) VALUES (?, ?)
           ON DUPLICATE KEY UPDATE id = LAST_INSERT_ID(id)`,
          [mol.molecule_name, mol.family]
        );
        moleculeIds.set(mol.molecule_name, molResult.insertId);
        totalMolecules++;
      }

      // 3. Créer les relations plante-molécules
      for (const rel of entry.relations) {
        const moleculeId = moleculeIds.get(rel.molecule_name);
        if (!moleculeId) continue;

        // Mapper weight -> role
        const roleMap = {
          'dominant': 'majeur',
          'majeur': 'majeur',
          'secondaire': 'secondaire',
          'trace': 'trace'
        };
        const role = roleMap[rel.weight.toLowerCase()] || 'majeur';

        await connection.execute(
          `INSERT IGNORE INTO plant_molecules (plant_id, molecule_id, role, is_signature, source, notes)
           VALUES (?, ?, ?, 1, 'littérature', ?)`,
          [plantId, moleculeId, role, `Profil moléculaire de ${plantData.name}`]
        );
        totalRelations++;
      }
    }

    console.log('\n✅ Import des Boswellia terminé avec succès !');
    console.log(`   - ${totalPlants} plantes importées`);
    console.log(`   - ${totalMolecules} molécules importées`);
    console.log(`   - ${totalRelations} relations créées`);

  } catch (error) {
    console.error('❌ Erreur lors de l\'import:', error);
    throw error;
  } finally {
    await connection.end();
  }
}

main().catch(console.error);
