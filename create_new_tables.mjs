import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

async function main() {
  const conn = await mysql.createConnection({
    uri: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  // Create reference_entity_links table
  const createReferenceEntityLinks = `
    CREATE TABLE IF NOT EXISTS reference_entity_links (
      id INT AUTO_INCREMENT PRIMARY KEY,
      reference_id INT NOT NULL,
      entity_type ENUM('leaf_economy', 'molecule', 'recette', 'plant', 'prototype', 'tradition', 'terroir', 'supplier') NOT NULL,
      entity_id INT NOT NULL,
      link_type ENUM('documents', 'mentions', 'analyzes', 'conserves', 'reconstructs', 'sources', 'validates', 'contextualizes') DEFAULT 'documents',
      relevance_score INT DEFAULT 50,
      notes TEXT,
      context TEXT,
      created_by INT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
      UNIQUE KEY unique_ref_entity_link (reference_id, entity_type, entity_id),
      INDEX ref_entity_ref_idx (reference_id),
      INDEX ref_entity_entity_idx (entity_type, entity_id),
      INDEX ref_entity_link_type_idx (link_type),
      FOREIGN KEY (reference_id) REFERENCES v3_references(id) ON DELETE CASCADE,
      FOREIGN KEY (created_by) REFERENCES users(id)
    )
  `;

  // Create olfactory_traditions table
  const createOlfactoryTraditions = `
    CREATE TABLE IF NOT EXISTS olfactory_traditions (
      id INT AUTO_INCREMENT PRIMARY KEY,
      code VARCHAR(50) NOT NULL UNIQUE,
      name VARCHAR(255) NOT NULL,
      period VARCHAR(100),
      start_year INT,
      end_year INT,
      region VARCHAR(255),
      civilization VARCHAR(255),
      description TEXT,
      historical_context TEXT,
      known_ingredients JSON,
      techniques JSON,
      reconstruction_status ENUM('documented', 'partial', 'reconstructed', 'speculative') DEFAULT 'documented',
      primary_sources TEXT,
      modern_sources TEXT,
      tags JSON,
      created_by INT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
      UNIQUE KEY tradition_code_idx (code),
      INDEX tradition_period_idx (period),
      INDEX tradition_region_idx (region),
      INDEX tradition_status_idx (reconstruction_status),
      FOREIGN KEY (created_by) REFERENCES users(id)
    )
  `;

  try {
    console.log('Creating reference_entity_links table...');
    await conn.execute(createReferenceEntityLinks);
    console.log('✓ reference_entity_links table created');

    console.log('Creating olfactory_traditions table...');
    await conn.execute(createOlfactoryTraditions);
    console.log('✓ olfactory_traditions table created');

    console.log('\nAll tables created successfully!');
  } catch (error) {
    console.error('Error:', error.message);
  }

  await conn.end();
}

main().catch(console.error);
