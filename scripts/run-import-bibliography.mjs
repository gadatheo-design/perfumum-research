#!/usr/bin/env node
/**
 * PERFUMUM - Run Bibliography Import via Drizzle
 * 
 * Imports all 50 references from the parsed JSON file into the database
 * using the project's Drizzle connection.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mysql from 'mysql2/promise';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load parsed references
const jsonPath = path.join(__dirname, 'bibliography-v2-parsed.json');
const references = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

// Database connection from environment
const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('DATABASE_URL not set');
  process.exit(1);
}

// Parse DATABASE_URL
function parseDbUrl(url) {
  const match = url.match(/mysql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/([^?]+)/);
  if (!match) throw new Error('Invalid DATABASE_URL format');
  return {
    user: match[1],
    password: match[2],
    host: match[3],
    port: parseInt(match[4]),
    database: match[5]
  };
}

async function main() {
  console.log('📚 PERFUMUM Bibliography Import - Database Insert');
  console.log('=================================================\n');
  
  const dbConfig = parseDbUrl(DATABASE_URL);
  console.log(`Connecting to ${dbConfig.host}:${dbConfig.port}/${dbConfig.database}...`);
  
  const connection = await mysql.createConnection({
    host: dbConfig.host,
    port: dbConfig.port,
    user: dbConfig.user,
    password: dbConfig.password,
    database: dbConfig.database,
    ssl: { rejectUnauthorized: true }
  });
  
  console.log('Connected!\n');
  
  let inserted = 0;
  let updated = 0;
  let errors = 0;
  
  for (const ref of references) {
    try {
      const tagsJson = ref.tags.length > 0 ? JSON.stringify(ref.tags) : null;
      
      const sql = `INSERT INTO v3_references 
        (entry_key, entry_type, title, authors, year, container_title, doi, url, axis_primary_code, tags, notes, read_status, relevance_score)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'unread', 50)
        ON DUPLICATE KEY UPDATE
          title = VALUES(title),
          authors = VALUES(authors),
          year = VALUES(year),
          container_title = VALUES(container_title),
          doi = VALUES(doi),
          url = VALUES(url),
          axis_primary_code = VALUES(axis_primary_code),
          tags = VALUES(tags),
          notes = VALUES(notes)`;
      
      const [result] = await connection.execute(sql, [
        ref.entryKey,
        ref.entryType,
        ref.title,
        ref.authors,
        ref.year,
        ref.containerTitle,
        ref.doi,
        ref.url,
        ref.axisPrimaryCode,
        tagsJson,
        ref.notes
      ]);
      
      if (result.affectedRows === 1) {
        inserted++;
        console.log(`✅ Inserted: ${ref.entryKey}`);
      } else if (result.affectedRows === 2) {
        updated++;
        console.log(`🔄 Updated: ${ref.entryKey}`);
      }
    } catch (err) {
      errors++;
      console.error(`❌ Error for ${ref.entryKey}: ${err.message}`);
    }
  }
  
  await connection.end();
  
  console.log('\n=================================================');
  console.log(`📊 Import Summary:`);
  console.log(`   - Inserted: ${inserted}`);
  console.log(`   - Updated: ${updated}`);
  console.log(`   - Errors: ${errors}`);
  console.log(`   - Total: ${references.length}`);
}

main().catch(console.error);
