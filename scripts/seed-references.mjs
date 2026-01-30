// Script de seed des références bibliographiques dans la base de données
// Usage: node scripts/seed-references.mjs

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

// Lire les références parsées
const referencesPath = path.join(__dirname, '../data/references_to_import.json');
const references = JSON.parse(fs.readFileSync(referencesPath, 'utf-8'));

// Connexion à la base de données
async function getConnection() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error('DATABASE_URL not found in environment');
  }
  
  // Parser l'URL de connexion
  const urlObj = new URL(url);
  
  return mysql.createConnection({
    host: urlObj.hostname,
    port: parseInt(urlObj.port) || 3306,
    user: urlObj.username,
    password: urlObj.password,
    database: urlObj.pathname.slice(1),
    ssl: {
      rejectUnauthorized: true
    }
  });
}

async function main() {
  console.log('Connecting to database...');
  const conn = await getConnection();
  console.log('Connected!');
  
  // Récupérer les axes de recherche existants
  const [axes] = await conn.execute('SELECT id, axis_code FROM research_axes');
  const axisMap = new Map(axes.map(a => [a.axis_code, a.id]));
  console.log(`Found ${axes.length} research axes in database`);
  
  // Récupérer les références existantes pour éviter les doublons
  const [existing] = await conn.execute('SELECT entry_key FROM bibliography_entries');
  const existingKeys = new Set(existing.map(e => e.entry_key));
  console.log(`Found ${existing.length} existing bibliography entries`);
  
  let imported = 0;
  let skipped = 0;
  let linked = 0;
  
  for (const ref of references) {
    // Vérifier si la référence existe déjà
    if (existingKeys.has(ref.entryKey)) {
      console.log(`  Skipping ${ref.entryKey} (already exists)`);
      skipped++;
      continue;
    }
    
    try {
      // Insérer la référence
      const [result] = await conn.execute(
        `INSERT INTO bibliography_entries 
         (entry_key, entry_type, title, authors, year, journal, publisher, volume, number, pages, doi, url, abstract, keywords, notes, research_domain, read_status, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [
          ref.entryKey,
          ref.entryType,
          ref.title,
          ref.authors,
          ref.year,
          ref.journal,
          ref.publisher,
          ref.volume,
          ref.number,
          ref.pages,
          ref.doi,
          ref.url,
          ref.abstract,
          JSON.stringify(ref.keywords || []),
          ref.notes,
          ref.researchDomain,
          ref.readStatus || 'unread'
        ]
      );
      
      const bibId = result.insertId;
      console.log(`  Imported ${ref.entryKey} (id: ${bibId})`);
      imported++;
      
      // Lier aux axes de recherche suggérés
      for (const axisCode of ref.suggestedAxes || []) {
        const axisId = axisMap.get(axisCode);
        if (axisId) {
          try {
            await conn.execute(
              `INSERT INTO bibliography_axis_links (bibliography_id, axis_id, relevance, created_at)
               VALUES (?, ?, 'secondaire', NOW())`,
              [bibId, axisId]
            );
            linked++;
            console.log(`    -> Linked to ${axisCode}`);
          } catch (linkErr) {
            // Ignorer les erreurs de lien (probablement déjà existant)
            console.log(`    -> Failed to link to ${axisCode}: ${linkErr.message}`);
          }
        }
      }
      
    } catch (err) {
      console.error(`  Error importing ${ref.entryKey}: ${err.message}`);
    }
  }
  
  console.log('');
  console.log('Import complete!');
  console.log(`  Imported: ${imported}`);
  console.log(`  Skipped (duplicates): ${skipped}`);
  console.log(`  Axis links created: ${linked}`);
  
  await conn.end();
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
