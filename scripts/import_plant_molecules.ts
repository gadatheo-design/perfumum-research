/**
 * Script d'import des relations plante-molécule enrichies
 * Importe les données du fichier CSV dans la base de données
 */

import { db } from '../server/db';
import { plants, molecules, plantMolecules } from '../drizzle/schema';
import { eq, like, or, sql } from 'drizzle-orm';
import * as fs from 'fs';
import * as path from 'path';

interface PlantMoleculeRow {
  plant_latin_name: string;
  plant_common_name: string;
  molecule_name: string;
  percentage_typical: string;
  role: string;
  is_signature: string;
  evidence: string;
  notes: string;
}

// Parse CSV file
function parseCSV(content: string): PlantMoleculeRow[] {
  const lines = content.trim().split('\n');
  const headers = lines[0].split(',');
  
  return lines.slice(1).map(line => {
    const values: string[] = [];
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
    
    const row: any = {};
    headers.forEach((header, i) => {
      row[header.trim()] = values[i] || '';
    });
    return row as PlantMoleculeRow;
  });
}

async function findPlant(latinName: string, commonName: string): Promise<number | null> {
  const dbInstance = await db;
  if (!dbInstance) return null;
  
  // Chercher par nom latin exact
  const [byLatin] = await dbInstance
    .select({ id: plants.id })
    .from(plants)
    .where(eq(plants.latinName, latinName))
    .limit(1);
  
  if (byLatin) return byLatin.id;
  
  // Chercher par nom commun
  const [byCommon] = await dbInstance
    .select({ id: plants.id })
    .from(plants)
    .where(or(
      eq(plants.commonName, commonName),
      eq(plants.name, commonName)
    ))
    .limit(1);
  
  if (byCommon) return byCommon.id;
  
  // Chercher par nom latin partiel
  const [byPartialLatin] = await dbInstance
    .select({ id: plants.id })
    .from(plants)
    .where(like(plants.latinName, `%${latinName.split(' ')[0]}%`))
    .limit(1);
  
  return byPartialLatin?.id || null;
}

async function findMolecule(name: string): Promise<number | null> {
  const dbInstance = await db;
  if (!dbInstance) return null;
  
  // Normaliser le nom
  const normalizedName = name.toLowerCase().trim();
  
  // Chercher par nom exact (insensible à la casse)
  const [byExact] = await dbInstance
    .select({ id: molecules.id })
    .from(molecules)
    .where(sql`LOWER(${molecules.name}) = ${normalizedName}`)
    .limit(1);
  
  if (byExact) return byExact.id;
  
  // Chercher par nom partiel
  const [byPartial] = await dbInstance
    .select({ id: molecules.id })
    .from(molecules)
    .where(sql`LOWER(${molecules.name}) LIKE ${`%${normalizedName}%`}`)
    .limit(1);
  
  return byPartial?.id || null;
}

async function linkExists(plantId: number, moleculeId: number): Promise<boolean> {
  const dbInstance = await db;
  if (!dbInstance) return true;
  
  const [existing] = await dbInstance
    .select({ plantId: plantMolecules.plantId })
    .from(plantMolecules)
    .where(sql`${plantMolecules.plantId} = ${plantId} AND ${plantMolecules.moleculeId} = ${moleculeId}`)
    .limit(1);
  
  return !!existing;
}

async function createLink(
  plantId: number,
  moleculeId: number,
  percentageTypical: number,
  role: string,
  isSignature: number
): Promise<boolean> {
  const dbInstance = await db;
  if (!dbInstance) return false;
  
  try {
    await dbInstance.insert(plantMolecules).values({
      plantId,
      moleculeId,
      percentageTypical: percentageTypical.toString(),
      role: role as any,
      isSignature,
    });
    return true;
  } catch (error) {
    console.error(`Erreur lors de la création du lien ${plantId}-${moleculeId}:`, error);
    return false;
  }
}

async function main() {
  console.log('=== Import des relations plante-molécule enrichies ===\n');
  
  // Lire le fichier CSV
  const csvPath = path.join(__dirname, '../data/enriched_plant_molecules.csv');
  const csvContent = fs.readFileSync(csvPath, 'utf-8');
  const rows = parseCSV(csvContent);
  
  console.log(`Fichier CSV lu: ${rows.length} lignes\n`);
  
  // Statistiques
  let created = 0;
  let skipped = 0;
  let plantNotFound = 0;
  let moleculeNotFound = 0;
  let alreadyExists = 0;
  
  const missingPlants = new Set<string>();
  const missingMolecules = new Set<string>();
  
  for (const row of rows) {
    // Trouver la plante
    const plantId = await findPlant(row.plant_latin_name, row.plant_common_name);
    if (!plantId) {
      plantNotFound++;
      missingPlants.add(`${row.plant_common_name} (${row.plant_latin_name})`);
      continue;
    }
    
    // Trouver la molécule
    const moleculeId = await findMolecule(row.molecule_name);
    if (!moleculeId) {
      moleculeNotFound++;
      missingMolecules.add(row.molecule_name);
      continue;
    }
    
    // Vérifier si le lien existe déjà
    if (await linkExists(plantId, moleculeId)) {
      alreadyExists++;
      continue;
    }
    
    // Créer le lien
    const success = await createLink(
      plantId,
      moleculeId,
      parseFloat(row.percentage_typical),
      row.role,
      parseInt(row.is_signature)
    );
    
    if (success) {
      created++;
      console.log(`✓ Lié: ${row.plant_common_name} ↔ ${row.molecule_name} (${row.percentage_typical}%)`);
    } else {
      skipped++;
    }
  }
  
  console.log('\n=== Résumé de l\'import ===');
  console.log(`Liaisons créées: ${created}`);
  console.log(`Liaisons existantes (ignorées): ${alreadyExists}`);
  console.log(`Plantes non trouvées: ${plantNotFound}`);
  console.log(`Molécules non trouvées: ${moleculeNotFound}`);
  console.log(`Erreurs: ${skipped}`);
  
  if (missingPlants.size > 0) {
    console.log('\n--- Plantes manquantes ---');
    Array.from(missingPlants).slice(0, 20).forEach(p => console.log(`  - ${p}`));
    if (missingPlants.size > 20) {
      console.log(`  ... et ${missingPlants.size - 20} autres`);
    }
  }
  
  if (missingMolecules.size > 0) {
    console.log('\n--- Molécules manquantes ---');
    Array.from(missingMolecules).slice(0, 20).forEach(m => console.log(`  - ${m}`));
    if (missingMolecules.size > 20) {
      console.log(`  ... et ${missingMolecules.size - 20} autres`);
    }
  }
  
  process.exit(0);
}

main().catch(console.error);
