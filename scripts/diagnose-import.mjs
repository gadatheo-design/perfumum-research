#!/usr/bin/env node

/**
 * PERFUMUM Data Import Diagnostic Script
 * Diagnoses issues with database connection and table structure
 */

import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

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

let connection;

async function main() {
  try {
    // Create connection
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected to database\n');
    
    // Test 1: List all tables
    console.log('📋 Available tables:');
    const [tables] = await connection.execute(
      `SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = ?`,
      [dbConfig.database]
    );
    
    const tableNames = tables.map(t => t.TABLE_NAME).sort();
    console.log(tableNames.map(t => `   - ${t}`).join('\n'));
    
    // Test 2: Check tobacco_varieties table structure
    console.log('\n📊 tobacco_varieties table structure:');
    const [columns] = await connection.execute(
      `SELECT COLUMN_NAME, COLUMN_TYPE, IS_NULLABLE, COLUMN_KEY FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'tobacco_varieties'`,
      [dbConfig.database]
    );
    
    if (columns.length > 0) {
      console.log(columns.map(c => `   - ${c.COLUMN_NAME}: ${c.COLUMN_TYPE} (${c.IS_NULLABLE === 'YES' ? 'nullable' : 'required'})`).join('\n'));
    } else {
      console.log('   ⚠️  Table not found or empty');
    }
    
    // Test 3: Try a simple insert
    console.log('\n🧪 Testing simple insert into tobacco_varieties...');
    try {
      const result = await connection.execute(
        `INSERT INTO tobacco_varieties 
        (name, category, createdAt, updatedAt)
        VALUES (?, ?, NOW(), NOW())`,
        ['Test Variety', 'landrace']
      );
      console.log(`   ✅ Insert successful (ID: ${result[0].insertId})`);
      
      // Delete the test record
      await connection.execute(
        `DELETE FROM tobacco_varieties WHERE id = ?`,
        [result[0].insertId]
      );
      console.log('   ✅ Test record deleted');
    } catch (err) {
      console.log(`   ❌ Insert failed: ${err.message}`);
    }
    
    // Test 4: Count existing records
    console.log('\n📈 Record counts:');
    const tables_to_check = [
      'tobacco_varieties',
      'tobacco_terroirs',
      'tobacco_additives',
      'pyrazines',
      'aromatic_molecules_tabac',
      'landraces',
      'research_claims',
      'research_sources'
    ];
    
    for (const tableName of tables_to_check) {
      try {
        const [result] = await connection.execute(`SELECT COUNT(*) as count FROM ${tableName}`);
        console.log(`   - ${tableName}: ${result[0].count} records`);
      } catch (err) {
        console.log(`   - ${tableName}: ⚠️  Error (${err.message.split('\n')[0]})`);
      }
    }
    
    console.log('\n✅ Diagnostic complete\n');
    
  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    if (connection) {
      await connection.end();
    }
    process.exit(0);
  }
}

main();
