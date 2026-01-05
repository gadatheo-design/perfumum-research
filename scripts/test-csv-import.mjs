import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
 * Test CSV parsing
 */
async function testCSVImport() {
  const dataDir = path.join(__dirname, '../data');
  
  console.log('🧪 Test d\'importation CSV\n');
  console.log('='.repeat(60));
  
  // Test 1: Molecules
  console.log('\n📦 Test 1: perfumum_molecules_template.csv');
  try {
    const moleculesPath = path.join(dataDir, 'perfumum_molecules_template.csv');
    const moleculesText = fs.readFileSync(moleculesPath, 'utf-8');
    const moleculesRows = parseCSV(moleculesText);
    const moleculesHeaders = moleculesRows[0];
    const moleculesData = moleculesRows.slice(1);
    
    console.log(`   ✓ En-têtes: ${moleculesHeaders.join(', ')}`);
    console.log(`   ✓ Nombre de molécules: ${moleculesData.length}`);
    console.log(`   ✓ Exemple (première ligne):`);
    console.log(`     - Nom: ${moleculesData[0][0]}`);
    console.log(`     - Famille: ${moleculesData[0][1]}`);
    console.log(`     - Profil olfactif: ${moleculesData[0][2]}`);
  } catch (error) {
    console.log(`   ✗ Erreur: ${error.message}`);
  }
  
  // Test 2: Plants
  console.log('\n📦 Test 2: perfumum_plants_template_30_col_bfa_car.csv');
  try {
    const plantsPath = path.join(dataDir, 'perfumum_plants_template_30_col_bfa_car.csv');
    const plantsText = fs.readFileSync(plantsPath, 'utf-8');
    const plantsRows = parseCSV(plantsText);
    const plantsHeaders = plantsRows[0];
    const plantsData = plantsRows.slice(1);
    
    console.log(`   ✓ En-têtes: ${plantsHeaders.slice(0, 5).join(', ')}...`);
    console.log(`   ✓ Nombre de plantes: ${plantsData.length}`);
    console.log(`   ✓ Exemple (première ligne):`);
    console.log(`     - Nom: ${plantsData[0][0]}`);
    console.log(`     - Nom latin: ${plantsData[0][1]}`);
    console.log(`     - Famille: ${plantsData[0][2]}`);
    console.log(`     - Catégorie: ${plantsData[0][3]}`);
  } catch (error) {
    console.log(`   ✗ Erreur: ${error.message}`);
  }
  
  // Test 3: Varieties
  console.log('\n📦 Test 3: perfumum_varieties_template_60_col_bfa_car.csv');
  try {
    const varietiesPath = path.join(dataDir, 'perfumum_varieties_template_60_col_bfa_car.csv');
    const varietiesText = fs.readFileSync(varietiesPath, 'utf-8');
    const varietiesRows = parseCSV(varietiesText);
    const varietiesHeaders = varietiesRows[0];
    const varietiesData = varietiesRows.slice(1);
    
    console.log(`   ✓ En-têtes: ${varietiesHeaders.join(', ')}`);
    console.log(`   ✓ Nombre de variétés: ${varietiesData.length}`);
    console.log(`   ✓ Exemple (première ligne):`);
    console.log(`     - Nom: ${varietiesData[0][0]}`);
    console.log(`     - Plante: ${varietiesData[0][1]}`);
    console.log(`     - Région: ${varietiesData[0][2]}`);
  } catch (error) {
    console.log(`   ✗ Erreur: ${error.message}`);
  }
  
  // Test 4: Relations
  console.log('\n📦 Test 4: perfumum_plants_molecules_relations.csv');
  try {
    const relationsPath = path.join(dataDir, 'perfumum_plants_molecules_relations.csv');
    const relationsText = fs.readFileSync(relationsPath, 'utf-8');
    const relationsRows = parseCSV(relationsText);
    const relationsHeaders = relationsRows[0];
    const relationsData = relationsRows.slice(1);
    
    console.log(`   ✓ En-têtes: ${relationsHeaders.join(', ')}`);
    console.log(`   ✓ Nombre de relations: ${relationsData.length}`);
    console.log(`   ✓ Exemple (première ligne):`);
    console.log(`     - Plante (latin): ${relationsData[0][0]}`);
    console.log(`     - Plante (nom): ${relationsData[0][1]}`);
    console.log(`     - Molécule: ${relationsData[0][2]}`);
    console.log(`     - Poids: ${relationsData[0][3]}`);
  } catch (error) {
    console.log(`   ✗ Erreur: ${error.message}`);
  }
  
  // Test 5: Plantes rares
  console.log('\n📦 Test 5: absorbe_plantes_rares_fantomes_25.csv');
  try {
    const raresPath = path.join(dataDir, 'absorbe_plantes_rares_fantomes_25.csv');
    const raresText = fs.readFileSync(raresPath, 'utf-8');
    const raresRows = parseCSV(raresText);
    const raresHeaders = raresRows[0];
    const raresData = raresRows.slice(1);
    
    console.log(`   ✓ En-têtes: ${raresHeaders.slice(0, 5).join(', ')}...`);
    console.log(`   ✓ Nombre de plantes rares: ${raresData.length}`);
    console.log(`   ✓ Exemple (première ligne):`);
    console.log(`     - Nom: ${raresData[0][0]}`);
    console.log(`     - Nom latin: ${raresData[0][1]}`);
    console.log(`     - Famille: ${raresData[0][2]}`);
  } catch (error) {
    console.log(`   ✗ Erreur: ${error.message}`);
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('✅ Tests de parsing CSV terminés\n');
}

testCSVImport().catch(console.error);
