#!/usr/bin/env node

/**
 * PERFUMUM Setup and Import Script
 * Creates missing tables and imports data into existing tables
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL environment variable not set');
  process.exit(1);
}

// Parse DATABASE_URL
const url = new URL(DATABASE_URL);
const dbConfig = {
  host: url.hostname,
  user: url.username,
  password: url.password,
  database: url.pathname.slice(1),
  ssl: {
    rejectUnauthorized: false,
  }
};

console.log(`🔗 Connecting to database: ${dbConfig.host}/${dbConfig.database}\n`);

const UPLOAD_DIR = '/home/ubuntu/upload';

let connection;

/**
 * Create missing tables
 */
async function createMissingTables() {
  console.log('📋 Creating missing tables...\n');
  
  const createTableSQL = `
    CREATE TABLE IF NOT EXISTS research_claims (
      id INT AUTO_INCREMENT PRIMARY KEY,
      claimId VARCHAR(255) UNIQUE,
      claim TEXT NOT NULL,
      claimType VARCHAR(100),
      status VARCHAR(50),
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS research_sources (
      id INT AUTO_INCREMENT PRIMARY KEY,
      sourceId VARCHAR(255) UNIQUE,
      reference TEXT NOT NULL,
      quality VARCHAR(50),
      status VARCHAR(50),
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );
  `;
  
  const statements = createTableSQL.split(';').filter(s => s.trim());
  
  for (const statement of statements) {
    if (!statement.trim()) continue;
    
    try {
      await connection.execute(statement);
      console.log(`✅ ${statement.split('TABLE')[1].split('(')[0].trim()} created`);
    } catch (err) {
      if (err.code === 'ER_TABLE_EXISTS_ERROR') {
        console.log(`✅ ${statement.split('TABLE')[1].split('(')[0].trim()} already exists`);
      } else {
        console.error(`❌ Error: ${err.message}`);
      }
    }
  }
  
  console.log('');
}

/**
 * Import Tobacco Varieties (using existing tabacs table)
 */
async function importTobaccoVarieties() {
  console.log('📥 Importing tobacco varieties...');
  
  const filePath = path.join(UPLOAD_DIR, 'perfumum_tabacotheque_complete_v3.json');
  
  try {
    if (!fs.existsSync(filePath)) {
      console.warn(`⚠️  File not found: ${filePath}`);
      return 0;
    }
    
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    let count = 0;
    
    if (data.landraces && Array.isArray(data.landraces)) {
      for (const variety of data.landraces) {
        try {
          // Use existing tabacs table
          const tabacType = variety.profil_aromatique?.famille?.toLowerCase().includes('oriental') ? 'oriental' : 'experimental';
          const result = await connection.execute(
            `INSERT IGNORE INTO tabacs 
            (name, type, origin, aromaticProfile, internalNotes)
            VALUES (?, ?, ?, ?, ?)`,
            [
              variety.nom || variety.name || 'Unknown',
              tabacType,
              variety.region_origine || variety.origin || null,
              JSON.stringify(variety.profil_aromatique || {}),
              variety.historique || null,
            ]
          );
          if (result[0].affectedRows > 0) count++;
        } catch (err) {
          // Skip errors
        }
      }
    }
    
    console.log(`✅ Imported ${count} tobacco varieties\n`);
    return count;
  } catch (err) {
    console.error(`❌ Error importing tobacco varieties: ${err.message}\n`);
    return 0;
  }
}

/**
 * Import Aromatic Molecules (using existing molecules table)
 */
async function importAromaticMolecules() {
  console.log('📥 Importing aromatic molecules...');
  
  const filePath = path.join(UPLOAD_DIR, 'perfumum_molecules_tabac.json');
  
  try {
    if (!fs.existsSync(filePath)) {
      console.warn(`⚠️  File not found: ${filePath}`);
      return 0;
    }
    
    const rawData = fs.readFileSync(filePath, 'utf8');
    // Fix common JSON issues
    const cleanedData = rawData
      .replace(/,\s*}/g, '}')
      .replace(/,\s*]/g, ']')
      .replace(/:\s*undefined/g, ': null')
      .replace(/NaN/g, 'null')
      .replace(/Infinity/g, 'null');
    
    const data = JSON.parse(cleanedData);
    let count = 0;
    
    if (data.molecules && Array.isArray(data.molecules)) {
      for (const molecule of data.molecules) {
        try {
          // Use existing molecules table
          const result = await connection.execute(
            `INSERT IGNORE INTO molecules 
            (name, family, origin, description)
            VALUES (?, ?, ?, ?)`,
            [
              molecule.nom || molecule.name || 'Unknown',
              'aromatic',
              'tobacco',
              JSON.stringify({
                formula: molecule.formule_chimique,
                weight: molecule.poids_moleculaire,
                odor: molecule.descripteurs_odeur,
                therapeutic: molecule.proprietes_therapeutiques,
              }),
            ]
          );
          if (result[0].affectedRows > 0) count++;
        } catch (err) {
          // Skip errors
        }
      }
    }
    
    console.log(`✅ Imported ${count} aromatic molecules\n`);
    return count;
  } catch (err) {
    console.error(`❌ Error importing aromatic molecules: ${err.message}\n`);
    return 0;
  }
}

/**
 * Import Research Claims
 */
async function importResearchClaims() {
  console.log('📥 Importing research claims...');
  
  const filePath = path.join(UPLOAD_DIR, 'Claims—Traditionstabac–cannabis15a05738f16b415986c08cb8dde0c5e4_all.csv');
  
  try {
    if (!fs.existsSync(filePath)) {
      console.warn(`⚠️  File not found: ${filePath}`);
      return 0;
    }
    
    const data = fs.readFileSync(filePath, 'utf8');
    const lines = data.split('\n').slice(1);
    let count = 0;
    
    for (const line of lines) {
      if (!line.trim()) continue;
      
      try {
        const parts = line.split(',').map(p => p.trim().replace(/^"|"$/g, ''));
        
        if (parts.length >= 2) {
          const result = await connection.execute(
            `INSERT IGNORE INTO research_claims 
            (claimId, claim, claimType, status)
            VALUES (?, ?, ?, ?)`,
            [
              parts[0] || `CLAIM-${Date.now()}`,
              parts[1] || 'Unknown claim',
              'ethnobotanical',
              'pending',
            ]
          );
          if (result[0].affectedRows > 0) count++;
        }
      } catch (err) {
        // Skip malformed lines
      }
    }
    
    console.log(`✅ Imported ${count} research claims\n`);
    return count;
  } catch (err) {
    console.error(`❌ Error importing research claims: ${err.message}\n`);
    return 0;
  }
}

/**
 * Import Research Sources
 */
async function importResearchSources() {
  console.log('📥 Importing research sources...');
  
  const filePath = path.join(UPLOAD_DIR, 'Sources—Traditionstabac–cannabis0b169f1f69df42c9bae3d15407e7e32f_all.csv');
  
  try {
    if (!fs.existsSync(filePath)) {
      console.warn(`⚠️  File not found: ${filePath}`);
      return 0;
    }
    
    const data = fs.readFileSync(filePath, 'utf8');
    const lines = data.split('\n').slice(1);
    let count = 0;
    
    for (const line of lines) {
      if (!line.trim()) continue;
      
      try {
        const parts = line.split(',').map(p => p.trim().replace(/^"|"$/g, ''));
        
        if (parts.length >= 2) {
          const result = await connection.execute(
            `INSERT IGNORE INTO research_sources 
            (sourceId, reference, quality, status)
            VALUES (?, ?, ?, ?)`,
            [
              parts[0] || `SRC-${Date.now()}`,
              parts[1] || 'Unknown source',
              'medium',
              'pending',
            ]
          );
          if (result[0].affectedRows > 0) count++;
        }
      } catch (err) {
        // Skip malformed lines
      }
    }
    
    console.log(`✅ Imported ${count} research sources\n`);
    return count;
  } catch (err) {
    console.error(`❌ Error importing research sources: ${err.message}\n`);
    return 0;
  }
}

/**
 * Main function
 */
async function main() {
  try {
    // Create connection
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected to database\n');
    
    // Create missing tables
    await createMissingTables();
    
    // Import data
    const results = {
      varieties: await importTobaccoVarieties(),
      molecules: await importAromaticMolecules(),
      claims: await importResearchClaims(),
      sources: await importResearchSources(),
    };
    
    // Summary
    console.log('📊 Import Summary:');
    console.log(`   Tobacco Varieties: ${results.varieties}`);
    console.log(`   Aromatic Molecules: ${results.molecules}`);
    console.log(`   Research Claims: ${results.claims}`);
    console.log(`   Research Sources: ${results.sources}`);
    
    const total = Object.values(results).reduce((a, b) => a + b, 0);
    console.log(`\n✅ Total imported: ${total} entities\n`);
    
  } catch (err) {
    console.error('❌ Fatal error:', err.message);
  } finally {
    if (connection) {
      await connection.end();
    }
    process.exit(0);
  }
}

main();
