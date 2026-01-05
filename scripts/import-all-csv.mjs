import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mysql from 'mysql2/promise';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database connection
const connection = await mysql.createConnection(process.env.DATABASE_URL);

/**
 * Parse CSV file
 */
function parseCSV(text) {
  const lines = text.split('\n').filter(line => line.trim());
  return lines.map(line => {
    const values = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
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
    return values;
  });
}

/**
 * Map climatic axis to enum value
 */
function mapClimaticAxis(axis) {
  if (!axis) return null;
  const lower = axis.toLowerCase();
  if (lower.includes('vent') && lower.includes('bois')) return 'vent_bois';
  if (lower.includes('bois') && lower.includes('disparition')) return 'bois_disparition';
  if (lower.includes('vent') && lower.includes('disparition')) return 'vent_disparition';
  if (lower.includes('vent')) return 'vent';
  if (lower.includes('bois')) return 'bois';
  if (lower.includes('disparition')) return 'disparition';
  return null;
}

/**
 * Map category to enum value
 */
function mapCategory(category) {
  if (!category) return 'autre';
  const lower = category.toLowerCase();
  if (lower === 'aromatique') return 'aromatique';
  if (lower === 'tabac') return 'tabac';
  if (lower === 'cannabis') return 'cannabis';
  if (lower === 'resine' || lower === 'résine') return 'resine';
  if (lower === 'bois') return 'bois';
  if (lower === 'fleur') return 'fleur';
  if (lower === 'racine') return 'racine';
  return 'autre';
}

/**
 * Import molecules
 */
async function importMolecules() {
  console.log('\n🧪 Importation des molécules...');
  const dataDir = path.join(__dirname, '../data');
  const moleculesPath = path.join(dataDir, 'perfumum_molecules_template.csv');
  const moleculesText = fs.readFileSync(moleculesPath, 'utf-8');
  const moleculesRows = parseCSV(moleculesText);
  const moleculesData = moleculesRows.slice(1);

  let imported = 0;
  let skipped = 0;

  for (const row of moleculesData) {
    const name = row[0];
    const family = row[1] || null;
    const odorKey = row[2] || null;
    const role = row[3] || null;
    const climaticAxis = row[4] || null;

    if (!name) continue;

    // Check if molecule exists
    const [existing] = await connection.execute(
      'SELECT id FROM molecules WHERE name = ?',
      [name]
    );

    if (existing.length > 0) {
      skipped++;
      continue;
    }

    // Insert molecule
    await connection.execute(
      `INSERT INTO molecules (name, family, olfactiveProfile, functionalEffect, notes, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, NOW(), NOW())`,
      [name, family, odorKey, role, climaticAxis ? `Axe climatique: ${climaticAxis}` : null]
    );

    imported++;
  }

  console.log(`   ✓ ${imported} molécules importées`);
  console.log(`   ⊘ ${skipped} molécules ignorées (déjà existantes)`);
}

/**
 * Import plants
 */
async function importPlants() {
  console.log('\n🌿 Importation des plantes...');
  const dataDir = path.join(__dirname, '../data');
  
  // Import from perfumum_plants_template_30_col_bfa_car.csv
  const plantsPath = path.join(dataDir, 'perfumum_plants_template_30_col_bfa_car.csv');
  const plantsText = fs.readFileSync(plantsPath, 'utf-8');
  const plantsRows = parseCSV(plantsText);
  const plantsData = plantsRows.slice(1);

  let imported = 0;
  let skipped = 0;

  for (const row of plantsData) {
    const name = row[0];
    const latinName = row[1] || null;
    const family = row[2] || null;
    const category = mapCategory(row[3]);
    const origin = row[4] || null;
    const habitat = row[5] || null;
    const olfactiveSignature = row[6] || null;
    const dominantMolecules = row[7] || null;
    const climaticAxis = mapClimaticAxis(row[8]);
    const traditionalUse = row[9] || null;
    const absorbeUse = row[10] || null;
    const kingdom = row[11] || null;
    const division = row[12] || null;
    const classValue = row[13] || null;
    const orderValue = row[14] || null;
    const genus = row[15] || null;
    const species = row[16] || null;
    const lifeCycle = row[17] || null;
    const harvestPeriod = row[18] || null;
    const essentialOilYield = row[19] || null;
    const notes = row[20] || null;

    if (!name) continue;

    // Check if plant exists
    const [existing] = await connection.execute(
      'SELECT id FROM plants WHERE latin_name = ? OR (latin_name IS NULL AND name = ?)',
      [latinName, name]
    );

    if (existing.length > 0) {
      skipped++;
      continue;
    }

    // Build notes field
    const notesArray = [
      kingdom && `Règne: ${kingdom}`,
      division && `Division: ${division}`,
      classValue && `Classe: ${classValue}`,
      orderValue && `Ordre: ${orderValue}`,
      genus && `Genre: ${genus}`,
      species && `Espèce: ${species}`,
      lifeCycle && `Cycle: ${lifeCycle}`,
      harvestPeriod && `Récolte: ${harvestPeriod}`,
      essentialOilYield && `Rendement HE: ${essentialOilYield}`,
      notes,
    ].filter(Boolean).join(' | ');

    // Insert plant
    await connection.execute(
      `INSERT INTO plants (
        name, latin_name, family, category, origin, habitat,
        olfactive_signature, dominant_molecules, climatic_axis,
        traditional_use, absorbe_use, notes, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        name, latinName, family, category, origin, habitat,
        olfactiveSignature, dominantMolecules, climaticAxis,
        traditionalUse, absorbeUse, notesArray
      ]
    );

    imported++;
  }

  console.log(`   ✓ ${imported} plantes importées`);
  console.log(`   ⊘ ${skipped} plantes ignorées (déjà existantes)`);
}

/**
 * Import rare plants
 */
async function importRarePlants() {
  console.log('\n🌺 Importation des plantes rares...');
  const dataDir = path.join(__dirname, '../data');
  const raresPath = path.join(dataDir, 'absorbe_plantes_rares_fantomes_25.csv');
  const raresText = fs.readFileSync(raresPath, 'utf-8');
  const raresRows = parseCSV(raresText);
  const raresData = raresRows.slice(1);

  let imported = 0;
  let skipped = 0;

  for (const row of raresData) {
    const name = row[0];
    const latinName = row[1] || null;
    const family = row[2] || null;
    const category = mapCategory(row[3]);
    const origin = row[4] || null;
    const habitat = row[5] || null;
    const olfactiveSignature = row[6] || null;
    const dominantMolecules = row[7] || null;
    const climaticAxis = mapClimaticAxis(row[8]);
    const traditionalUse = row[9] || null;
    const absorbeUse = row[10] || null;
    const notes = row[20] || null;

    if (!name) continue;

    // Check if plant exists
    const [existing] = await connection.execute(
      'SELECT id FROM plants WHERE latin_name = ? OR (latin_name IS NULL AND name = ?)',
      [latinName, name]
    );

    if (existing.length > 0) {
      skipped++;
      continue;
    }

    // Insert plant with "Plante rare/fantôme" tag
    const notesWithTag = notes ? `[Plante rare/fantôme] ${notes}` : '[Plante rare/fantôme]';

    await connection.execute(
      `INSERT INTO plants (
        name, latin_name, family, category, origin, habitat,
        olfactive_signature, dominant_molecules, climatic_axis,
        traditional_use, absorbe_use, notes, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        name, latinName, family, category, origin, habitat,
        olfactiveSignature, dominantMolecules, climaticAxis,
        traditionalUse, absorbeUse, notesWithTag
      ]
    );

    imported++;
  }

  console.log(`   ✓ ${imported} plantes rares importées`);
  console.log(`   ⊘ ${skipped} plantes rares ignorées (déjà existantes)`);
}

/**
 * Main import function
 */
async function main() {
  console.log('🚀 Importation automatique des fichiers CSV\n');
  console.log('='.repeat(60));

  try {
    await importMolecules();
    await importPlants();
    await importRarePlants();

    console.log('\n' + '='.repeat(60));
    console.log('✅ Importation terminée avec succès\n');
  } catch (error) {
    console.error('\n❌ Erreur lors de l\'importation:', error);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

main();
