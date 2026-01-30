import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './drizzle/schema.js';
import fs from 'fs';

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection, { schema, mode: 'default' });

// Lire et parser le CSV
const csvContent = fs.readFileSync('/home/ubuntu/perfumum-research/NOUVELLES_MOLECULES_25.csv', 'utf-8');
const lines = csvContent.split('\n');
const headers = lines[0].split(',');

console.log('🔄 Import des nouvelles molécules...\n');

let count = 0;

for (let i = 1; i < lines.length; i++) {
  const line = lines[i].trim();
  if (!line) continue;
  
  // Parse CSV line (handle quoted fields)
  const values = [];
  let current = '';
  let inQuotes = false;
  
  for (let char of line) {
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      values.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  values.push(current);
  
  if (values.length < 10) continue; // Skip invalid lines
  
  const molecule = {
    name: values[0] || null,
    family: values[1] || null,
    chemicalFormula: values[2] || null,
    olfactiveProfile: values[3] || null,
    emotionalResonance: values[4] || null,
    functionalEffect: values[5] || null,
    sourceOrigin: values[6] || null,
    radarIntensity: values[7] ? parseInt(values[7]) : null,
    radarFreshness: values[8] ? parseInt(values[8]) : null,
    radarWarmth: values[9] ? parseInt(values[9]) : null,
    radarSweetness: values[10] ? parseInt(values[10]) : null,
    radarSpiciness: values[11] ? parseInt(values[11]) : null,
    radarEarthiness: values[12] ? parseInt(values[12]) : null,
    molecularWeight: values[13] ? parseInt(values[13]) : null,
    boilingPoint: values[14] ? parseInt(values[14]) : null,
    volatility: values[15] ? parseInt(values[15]) : null,
    intensity: values[16] ? parseInt(values[16]) : null,
    complexity: values[17] ? parseInt(values[17]) : null,
    botanicalSources: values[18] || null,
    extractionMethod: values[19] || null,
    therapeuticProperties: values[20] || null
  };
  
  if (!molecule.name) continue;
  
  try {
    const [result] = await db.insert(schema.molecules).values(molecule);
    count++;
    console.log(`✅ ${molecule.name} importée (ID: ${result.insertId})`);
  } catch (error) {
    console.error(`❌ Erreur pour ${molecule.name}:`, error.message);
  }
}

console.log(`\n✨ Import terminé ! ${count} molécules importées.`);
await connection.end();
process.exit(0);
