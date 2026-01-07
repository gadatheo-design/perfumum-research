#!/usr/bin/env node
/**
 * Script d'import batch des références via mysql2
 * Exécute les INSERT statements un par un
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mysql from 'mysql2/promise';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Mapping des domaines vers les valeurs enum valides
const domainMapping = {
  'perfumery': 'chimie_olfactive',
  'genomics': 'botanique',
  'metabolomics': 'chimie_olfactive',
  'biochemistry': 'chimie_olfactive',
  'chemistry': 'chimie_olfactive',
  'archaeochemistry': 'histoire_parfumerie',
  'other': 'autre',
};

async function main() {
  // Lire le fichier JSON des références
  const jsonPath = path.join(__dirname, '../data/new_references_to_import.json');
  const data = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
  
  console.log(`📚 Import de ${data.totalCount} références bibliographiques\n`);
  
  // Connexion à la base de données
  const connection = await mysql.createConnection(process.env.DATABASE_URL);
  
  let success = 0;
  let failed = 0;
  const errors = [];
  
  for (const ref of data.references) {
    const mappedDomain = domainMapping[ref.researchDomain] || 'autre';
    
    try {
      await connection.execute(
        `INSERT INTO bibliography_entries 
         (entry_key, entry_type, title, authors, year, journal, doi, url, tags, notes, research_domain, read_status, relevance_score)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE title = VALUES(title), notes = VALUES(notes), updated_at = NOW()`,
        [
          ref.entryKey,
          ref.entryType,
          ref.title,
          ref.authors,
          ref.year,
          ref.journal,
          ref.doi,
          ref.url,
          ref.tags,
          ref.notes,
          mappedDomain,
          ref.readStatus,
          ref.relevanceScore || 70,
        ]
      );
      success++;
      process.stdout.write(`\r✅ Importées: ${success} / ${data.totalCount}`);
    } catch (error) {
      failed++;
      errors.push(`${ref.entryKey}: ${error.message}`);
    }
  }
  
  console.log(`\n\n📊 Résultat:`);
  console.log(`   ✅ Succès: ${success}`);
  console.log(`   ❌ Échecs: ${failed}`);
  
  if (errors.length > 0) {
    console.log(`\n⚠️  Erreurs:`);
    errors.slice(0, 10).forEach(e => console.log(`   - ${e}`));
    if (errors.length > 10) {
      console.log(`   ... et ${errors.length - 10} autres`);
    }
  }
  
  await connection.end();
}

main().catch(console.error);
