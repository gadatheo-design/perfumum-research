#!/usr/bin/env node

/**
 * PERFUMUM Data Import Standalone Script
 * Imports tobacco, cannabis, and related data directly into PostgreSQL
 * 
 * Usage: node scripts/import-data-standalone.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mysql from 'mysql2/promise';
import https from 'https';
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

// Parse DATABASE_URL (mysql://user:password@host:port/database)
const url = new URL(DATABASE_URL);
const dbConfig = {
  host: url.hostname,
  user: url.username,
  password: url.password,
  database: url.pathname.slice(1),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: {  // Enable SSL for TiDB Cloud
    rejectUnauthorized: false,
  }
};

console.log(`🔗 Connecting to database: ${dbConfig.host}/${dbConfig.database}`);
console.log(`🔐 Using SSL connection for TiDB Cloud`);

let pool;
try {
  pool = mysql.createPool(dbConfig);
  console.log('✅ Connection pool created');
} catch (err) {
  console.error('❌ Failed to create connection pool:', err.message);
  process.exit(1);
}

const UPLOAD_DIR = '/home/ubuntu/upload';

/**
 * Import Tobacco Varieties
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
    const connection = await pool.getConnection();
    
    let count = 0;
    
    if (data.landraces && Array.isArray(data.landraces)) {
      for (const variety of data.landraces) {
        try {
          await connection.execute(
            `INSERT INTO tobacco_varieties 
            (name, latinName, category, origin, region, olfactiveFamily, 
             aromaProfile, chemicalProfile, historicalSignificance, sourceReferences, createdAt, updatedAt)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
            [
              variety.nom || variety.name || 'Unknown',
              variety.latin_name || null,
              'landrace',
              variety.region_origine || variety.origin || null,
              variety.terroir?.zones_production?.[0] || null,
              variety.profil_aromatique?.famille || null,
              JSON.stringify(variety.profil_aromatique || {}),
              JSON.stringify(variety.profil_chimique || {}),
              variety.historique || null,
              JSON.stringify(variety.sources || []),
            ]
          );
          count++;
        } catch (err) {
          // Skip duplicates and errors
        }
      }
    }
    
    connection.release();
    console.log(`✅ Imported ${count} tobacco varieties`);
    return count;
  } catch (err) {
    console.error('❌ Error importing tobacco varieties:', err.message);
    return 0;
  }
}

/**
 * Import Terroirs
 */
async function importTerroirs() {
  console.log('📥 Importing terroirs...');
  
  const filePath = path.join(UPLOAD_DIR, 'perfumum_terroirs_tabac.json');
  
  try {
    if (!fs.existsSync(filePath)) {
      console.warn(`⚠️  File not found: ${filePath}`);
      return 0;
    }
    
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const connection = await pool.getConnection();
    
    let count = 0;
    
    if (data.terroirs && Array.isArray(data.terroirs)) {
      for (const terroir of data.terroirs) {
        try {
          await connection.execute(
            `INSERT INTO tobacco_terroirs 
            (name, region, country, coordinates, soilType, soilComposition, 
             climate, elevation, rainfall, chemicalImpact, sourceReferences, createdAt, updatedAt)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
            [
              terroir.nom || terroir.name || 'Unknown',
              terroir.region || null,
              terroir.pays || terroir.country || null,
              JSON.stringify(terroir.coordonnees || terroir.coordinates || {}),
              terroir.sol?.type || terroir.soilType || null,
              JSON.stringify(terroir.sol || {}),
              terroir.climat || terroir.climate || null,
              terroir.altitude || terroir.elevation || null,
              terroir.precipitation || terroir.rainfall || null,
              terroir.impact_chimique || terroir.chemicalImpact || null,
              JSON.stringify(terroir.sources || []),
            ]
          );
          count++;
        } catch (err) {
          // Skip duplicates and errors
        }
      }
    }
    
    connection.release();
    console.log(`✅ Imported ${count} terroirs`);
    return count;
  } catch (err) {
    console.error('❌ Error importing terroirs:', err.message);
    return 0;
  }
}

/**
 * Import Additives
 */
async function importAdditives() {
  console.log('📥 Importing tobacco additives...');
  
  const filePath = path.join(UPLOAD_DIR, 'perfumum_additifs_tabac.json');
  
  try {
    if (!fs.existsSync(filePath)) {
      console.warn(`⚠️  File not found: ${filePath}`);
      return 0;
    }
    
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const connection = await pool.getConnection();
    
    let count = 0;
    
    if (data.additifs && Array.isArray(data.additifs)) {
      for (const additive of data.additifs) {
        try {
          await connection.execute(
            `INSERT INTO tobacco_additives 
            (name, type, chemicalFormula, source, historicalUse, 
             alkalinizingPower, applicationMethods, sourceReferences, createdAt, updatedAt)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
            [
              additive.nom || additive.name || 'Unknown',
              additive.type || 'other',
              additive.formule_chimique || null,
              additive.source || null,
              additive.usage_historique || null,
              additive.pouvoir_alcalinisant || null,
              JSON.stringify(additive.methodes_application || []),
              JSON.stringify(additive.sources || []),
            ]
          );
          count++;
        } catch (err) {
          // Skip duplicates and errors
        }
      }
    }
    
    connection.release();
    console.log(`✅ Imported ${count} additives`);
    return count;
  } catch (err) {
    console.error('❌ Error importing additives:', err.message);
    return 0;
  }
}

/**
 * Import Pyrazines
 */
async function importPyrazines() {
  console.log('📥 Importing pyrazines...');
  
  const filePath = path.join(UPLOAD_DIR, 'perfumum_pyrazines.json');
  
  try {
    if (!fs.existsSync(filePath)) {
      console.warn(`⚠️  File not found: ${filePath}`);
      return 0;
    }
    
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const connection = await pool.getConnection();
    
    let count = 0;
    
    if (data.pyrazines && Array.isArray(data.pyrazines)) {
      for (const pyrazine of data.pyrazines) {
        try {
          await connection.execute(
            `INSERT INTO pyrazines 
            (name, chemicalFormula, molecularWeight, odorProfile, 
             tobaccoContribution, perfumeryPotential, sourceReferences, createdAt, updatedAt)
            VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
            [
              pyrazine.nom || pyrazine.name || 'Unknown',
              pyrazine.formule_chimique || 'Unknown',
              pyrazine.poids_moleculaire || null,
              JSON.stringify(pyrazine.profil_olfactif || {}),
              pyrazine.contribution_tabac || null,
              pyrazine.potentiel_parfumerie || null,
              JSON.stringify(pyrazine.sources || []),
            ]
          );
          count++;
        } catch (err) {
          // Skip duplicates and errors
        }
      }
    }
    
    connection.release();
    console.log(`✅ Imported ${count} pyrazines`);
    return count;
  } catch (err) {
    console.error('❌ Error importing pyrazines:', err.message);
    return 0;
  }
}

/**
 * Import Aromatic Molecules
 */
async function importAromaticMolecules() {
  console.log('📥 Importing aromatic molecules...');
  
  const filePath = path.join(UPLOAD_DIR, 'perfumum_molecules_tabac.json');
  
  try {
    if (!fs.existsSync(filePath)) {
      console.warn(`⚠️  File not found: ${filePath}`);
      return 0;
    }
    
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const connection = await pool.getConnection();
    
    let count = 0;
    
    if (data.molecules && Array.isArray(data.molecules)) {
      for (const molecule of data.molecules) {
        try {
          await connection.execute(
            `INSERT INTO aromatic_molecules_tabac 
            (name, chemicalFormula, molecularWeight, odorDescriptors, 
             tobaccoContribution, therapeuticProperties, sourceReferences, createdAt, updatedAt)
            VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
            [
              molecule.nom || molecule.name || 'Unknown',
              molecule.formule_chimique || 'Unknown',
              molecule.poids_moleculaire || null,
              JSON.stringify(molecule.descripteurs_odeur || []),
              molecule.contribution_tabac || null,
              JSON.stringify(molecule.proprietes_therapeutiques || []),
              JSON.stringify(molecule.sources || []),
            ]
          );
          count++;
        } catch (err) {
          // Skip duplicates and errors
        }
      }
    }
    
    connection.release();
    console.log(`✅ Imported ${count} aromatic molecules`);
    return count;
  } catch (err) {
    console.error('❌ Error importing aromatic molecules:', err.message);
    return 0;
  }
}

/**
 * Import Landraces
 */
async function importLandraces() {
  console.log('📥 Importing landraces...');
  
  const filePath = path.join(UPLOAD_DIR, 'perfumum_landraces_monde_v2_complet.json');
  
  try {
    if (!fs.existsSync(filePath)) {
      console.warn(`⚠️  File not found: ${filePath}`);
      return 0;
    }
    
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const connection = await pool.getConnection();
    
    let count = 0;
    
    if (data.landraces && Array.isArray(data.landraces)) {
      for (const landrace of data.landraces) {
        try {
          await connection.execute(
            `INSERT INTO landraces 
            (name, originCountry, originRegion, historicalPeriod, 
             culturalSignificance, molecularProfile, aromaCharacteristics, sourceReferences, createdAt, updatedAt)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
            [
              landrace.nom || landrace.name || 'Unknown',
              landrace.pays_origine || landrace.originCountry || 'Unknown',
              landrace.region_origine || landrace.originRegion || null,
              landrace.periode_historique || null,
              landrace.signification_culturelle || null,
              JSON.stringify(landrace.profil_moleculaire || {}),
              landrace.caracteristiques_aroma || null,
              JSON.stringify(landrace.sources || []),
            ]
          );
          count++;
        } catch (err) {
          // Skip duplicates and errors
        }
      }
    }
    
    connection.release();
    console.log(`✅ Imported ${count} landraces`);
    return count;
  } catch (err) {
    console.error('❌ Error importing landraces:', err.message);
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
    const connection = await pool.getConnection();
    
    let count = 0;
    
    for (const line of lines) {
      if (!line.trim()) continue;
      
      try {
        const parts = line.split(',').map(p => p.trim().replace(/^"|"$/g, ''));
        
        if (parts.length >= 2) {
          await connection.execute(
            `INSERT INTO research_claims 
            (claimId, claim, claimType, status, createdAt, updatedAt)
            VALUES (?, ?, ?, ?, NOW(), NOW())`,
            [
              parts[0] || `CLAIM-${Date.now()}`,
              parts[1] || 'Unknown claim',
              'ethnobotanical',
              'pending',
            ]
          );
          count++;
        }
      } catch (err) {
        // Skip malformed lines
      }
    }
    
    connection.release();
    console.log(`✅ Imported ${count} research claims`);
    return count;
  } catch (err) {
    console.error('❌ Error importing research claims:', err.message);
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
    const connection = await pool.getConnection();
    
    let count = 0;
    
    for (const line of lines) {
      if (!line.trim()) continue;
      
      try {
        const parts = line.split(',').map(p => p.trim().replace(/^"|"$/g, ''));
        
        if (parts.length >= 2) {
          await connection.execute(
            `INSERT INTO research_sources 
            (sourceId, reference, quality, status, createdAt, updatedAt)
            VALUES (?, ?, ?, ?, NOW(), NOW())`,
            [
              parts[0] || `SRC-${Date.now()}`,
              parts[1] || 'Unknown source',
              'medium',
              'pending',
            ]
          );
          count++;
        }
      } catch (err) {
        // Skip malformed lines
      }
    }
    
    connection.release();
    console.log(`✅ Imported ${count} research sources`);
    return count;
  } catch (err) {
    console.error('❌ Error importing research sources:', err.message);
    return 0;
  }
}

/**
 * Main function
 */
async function main() {
  console.log('🚀 Starting PERFUMUM data import...\n');
  
  try {
    const results = {
      varieties: await importTobaccoVarieties(),
      terroirs: await importTerroirs(),
      additives: await importAdditives(),
      pyrazines: await importPyrazines(),
      molecules: await importAromaticMolecules(),
      landraces: await importLandraces(),
      claims: await importResearchClaims(),
      sources: await importResearchSources(),
    };
    
    console.log('\n📊 Import Summary:');
    console.log(`   Tobacco Varieties: ${results.varieties}`);
    console.log(`   Terroirs: ${results.terroirs}`);
    console.log(`   Additives: ${results.additives}`);
    console.log(`   Pyrazines: ${results.pyrazines}`);
    console.log(`   Aromatic Molecules: ${results.molecules}`);
    console.log(`   Landraces: ${results.landraces}`);
    console.log(`   Research Claims: ${results.claims}`);
    console.log(`   Research Sources: ${results.sources}`);
    
    const total = Object.values(results).reduce((a, b) => a + b, 0);
    console.log(`\n✅ Total imported: ${total} entities\n`);
    
  } catch (err) {
    console.error('❌ Fatal error:', err.message);
  } finally {
    await pool.end();
    process.exit(0);
  }
}

// Run the import
main();
