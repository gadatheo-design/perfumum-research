#!/usr/bin/env node
/**
 * PERFUMUM - Import Espèces Menacées
 * Jour 4 - Import des espèces avec statuts IUCN/CITES
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import mysql from 'mysql2/promise';
import Papa from 'papaparse';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuration de la base de données depuis les variables d'environnement
const DB_URL = process.env.DATABASE_URL;

if (!DB_URL) {
  console.error('❌ DATABASE_URL non définie');
  process.exit(1);
}

async function main() {
  console.log('🌿 Import des espèces menacées...\n');

  // Connexion à la base de données
  const connection = await mysql.createConnection(DB_URL);

  try {
    // Charger les données CSV
    const csvPath = join(__dirname, 'data', 'threatened-species.csv');
    const csvContent = readFileSync(csvPath, 'utf-8');
    
    const parsed = Papa.parse(csvContent, {
      header: true,
      skipEmptyLines: true
    });

    console.log(`📊 ${parsed.data.length} espèces à importer\n`);

    let imported = 0;
    let updated = 0;

    for (const row of parsed.data) {
      const latinName = row.latin_name || row.plant_latin_name;
      if (!latinName) continue;

      // Vérifier si la plante existe déjà
      const [existing] = await connection.execute(
        'SELECT id FROM plants WHERE latin_name = ?',
        [latinName]
      );

      const threatFactors = row.threat_factors ? JSON.parse(row.threat_factors) : {};

      if (existing.length > 0) {
        // Mise à jour de la plante existante
        await connection.execute(
          `UPDATE plants SET
            conservation_status = ?,
            cites_appendix = ?,
            conservation_notes = ?,
            threat_factors = ?,
            sustainable_alternatives = ?
          WHERE id = ?`,
          [
            row.conservation_status || null,
            row.cites_appendix || 'UNKNOWN',
            row.conservation_notes || null,
            JSON.stringify(threatFactors),
            row.sustainable_alternatives || null,
            existing[0].id
          ]
        );
        console.log(`✓ Mise à jour : ${latinName} (${row.conservation_status})`);
        updated++;
      } else {
        // Créer une nouvelle plante
        await connection.execute(
          `INSERT INTO plants (
            name, latin_name, category,
            conservation_status, cites_appendix, conservation_notes,
            threat_factors, sustainable_alternatives
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            latinName.split(' ')[0], // Nom de genre comme nom commun par défaut
            latinName,
            'aromatique',
            row.conservation_status || null,
            row.cites_appendix || 'UNKNOWN',
            row.conservation_notes || null,
            JSON.stringify(threatFactors),
            row.sustainable_alternatives || null
          ]
        );
        console.log(`✓ Nouvelle plante : ${latinName} (${row.conservation_status})`);
        imported++;
      }
    }

    console.log('\n✅ Import des espèces menacées terminé !');
    console.log(`   - ${imported} nouvelles plantes importées`);
    console.log(`   - ${updated} plantes existantes mises à jour`);

  } catch (error) {
    console.error('❌ Erreur lors de l\'import:', error);
    throw error;
  } finally {
    await connection.end();
  }
}

main().catch(console.error);
