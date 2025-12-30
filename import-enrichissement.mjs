import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration de la base de données
const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection);

// Fonction pour parser CSV
function parseCSV(content) {
  const lines = content.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
  
  return lines.slice(1).map(line => {
    const values = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim().replace(/^"|"$/g, ''));
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current.trim().replace(/^"|"$/g, ''));
    
    const obj = {};
    headers.forEach((header, index) => {
      obj[header] = values[index] || '';
    });
    return obj;
  });
}

// Import des molécules
async function importMolecules() {
  console.log('📦 Import des molécules...');
  
  const csvPath = path.join(__dirname, 'NOUVELLES_MOLECULES_25.csv');
  const content = fs.readFileSync(csvPath, 'utf-8');
  const molecules = parseCSV(content);
  
  let imported = 0;
  let skipped = 0;
  
  for (const mol of molecules) {
    try {
      if (!mol.name) {
        console.log(`⏭️  Ligne vide ou invalide, ignorée`);
        skipped++;
        continue;
      }
      
      // Vérifier si la molécule existe déjà
      const [existing] = await connection.execute(
        'SELECT id FROM molecules WHERE name = ?',
        [mol.name]
      );
      
      if (existing.length > 0) {
        console.log(`⏭️  Molécule "${mol.name}" existe déjà`);
        skipped++;
        continue;
      }
      
      // Insérer la molécule
      await connection.execute(`
        INSERT INTO molecules (
          name, chemicalFormula, family, 
          olfactiveProfile, intensity, volatility,
          radar_intensity, radar_freshness, radar_warmth, 
          radar_spiciness, radar_sweetness, radar_earthiness,
          createdAt
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
      `, [
        mol.name,
        mol.chemicalFormula || null,
        mol.family || null,
        mol.olfactiveProfile || null,
        parseInt(mol.intensity) || 50,
        parseInt(mol.volatility) || 50,
        parseFloat(mol.radarIntensity) || 50,
        parseFloat(mol.radarFreshness) || 50,
        parseFloat(mol.radarWarmth) || 50,
        parseFloat(mol.radarSpiciness) || 50,
        parseFloat(mol.radarSweetness) || 50,
        parseFloat(mol.radarEarthiness) || 50
      ]);
      
      console.log(`✅ Molécule "${mol.name}" importée`);
      imported++;
    } catch (error) {
      console.error(`❌ Erreur import molécule "${mol.name}":`, error.message);
    }
  }
  
  console.log(`\n📊 Molécules : ${imported} importées, ${skipped} ignorées\n`);
  return imported;
}

// Import des recettes
async function importRecettes() {
  console.log('📦 Import des recettes...');
  
  const csvPath = path.join(__dirname, 'NOUVELLES_RECETTES_18.csv');
  const content = fs.readFileSync(csvPath, 'utf-8');
  const recettes = parseCSV(content);
  
  let imported = 0;
  let skipped = 0;
  let liaisons = 0;
  
  for (const rec of recettes) {
    try {
      if (!rec.name) {
        console.log(`⏭️  Ligne vide ou invalide, ignorée`);
        skipped++;
        continue;
      }
      
      // Vérifier si la recette existe déjà
      const [existing] = await connection.execute(
        'SELECT id FROM recettes WHERE name = ?',
        [rec.name]
      );
      
      if (existing.length > 0) {
        console.log(`⏭️  Recette "${rec.name}" existe déjà`);
        skipped++;
        continue;
      }
      
      // Insérer la recette
      const [result] = await connection.execute(`
        INSERT INTO recettes (
          name, category, gamme,
          description, protocol, notes_tete, notes_coeur, notes_fond,
          intensity, status,
          createdAt
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
      `, [
        rec.name,
        rec.category || 'parfum',
        rec.gamme || null,
        rec.description || null,
        rec.protocol || null,
        rec.notesTete || null,
        rec.notesCoeur || null,
        rec.notesFond || null,
        parseInt(rec.radarIntensity) || 5,
        rec.status || 'experimental'
      ]);
      
      const recetteId = result.insertId;
      console.log(`✅ Recette "${rec.name}" importée (ID: ${recetteId})`);
      imported++;
      
      // Créer les liaisons molécules-recettes
      if (rec.formulation) {
        const moleculesData = rec.formulation.split(',').map(m => m.trim()).filter(Boolean);
        
        for (const molData of moleculesData) {
          const match = molData.match(/^(.+?)\s+(\d+(?:\.\d+)?)%$/);
          if (!match) continue;
          
          const [, nomMolecule, proportion] = match;
          
          // Trouver l'ID de la molécule
          const [molResult] = await connection.execute(
            'SELECT id FROM molecules WHERE name = ?',
            [nomMolecule.trim()]
          );
          
          if (molResult.length === 0) {
            console.warn(`⚠️  Molécule "${nomMolecule}" introuvable pour recette "${rec.nom}"`);
            continue;
          }
          
          const moleculeId = molResult[0].id;
          
          // Créer la liaison
          await connection.execute(`
            INSERT INTO recette_molecules (recette_id, molecule_id, proportion)
            VALUES (?, ?, ?)
          `, [recetteId, moleculeId, parseFloat(proportion)]);
          
          liaisons++;
        }
      }
    } catch (error) {
      console.error(`❌ Erreur import recette "${rec.nom}":`, error.message);
    }
  }
  
  console.log(`\n📊 Recettes : ${imported} importées, ${skipped} ignorées`);
  console.log(`🔗 Liaisons : ${liaisons} créées\n`);
  return { imported, liaisons };
}

// Validation finale
async function validateImport() {
  console.log('🔍 Validation de l\'import...\n');
  
  const [molecules] = await connection.execute('SELECT COUNT(*) as count FROM molecules');
  const [recettes] = await connection.execute('SELECT COUNT(*) as count FROM recettes');
  const [liaisons] = await connection.execute('SELECT COUNT(*) as count FROM recette_molecules');
  
  console.log(`📊 État final de la base de données :`);
  console.log(`   - Molécules : ${molecules[0].count}`);
  console.log(`   - Recettes : ${recettes[0].count}`);
  console.log(`   - Liaisons : ${liaisons[0].count}`);
  
  // Vérifier les objectifs
  const targetMolecules = 199;
  const targetRecettes = 213;
  
  if (molecules[0].count >= targetMolecules) {
    console.log(`\n✅ Objectif molécules atteint (${targetMolecules})`);
  } else {
    console.log(`\n⚠️  Objectif molécules non atteint : ${molecules[0].count}/${targetMolecules}`);
  }
  
  if (recettes[0].count >= targetRecettes) {
    console.log(`✅ Objectif recettes atteint (${targetRecettes})`);
  } else {
    console.log(`⚠️  Objectif recettes non atteint : ${recettes[0].count}/${targetRecettes}`);
  }
}

// Exécution principale
async function main() {
  try {
    console.log('🚀 Début de l\'import des données d\'enrichissement\n');
    console.log('=' .repeat(60) + '\n');
    
    await importMolecules();
    await importRecettes();
    await validateImport();
    
    console.log('\n' + '='.repeat(60));
    console.log('✨ Import terminé avec succès !\n');
  } catch (error) {
    console.error('❌ Erreur fatale :', error);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

main();
