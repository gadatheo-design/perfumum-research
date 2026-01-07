/**
 * Script d'import des données MoleculesLostMap v2
 * - 5 méthodes analytiques (methods_catalog_v1.csv)
 * - 38 molécules marqueurs (molecules_seed_lostmap_v2.csv)
 * - 67 liens evidence (molecules_lost_map_seed_v2.csv)
 */

import { createConnection } from 'mysql2/promise';
import { readFileSync } from 'fs';
import { parse } from 'csv-parse/sync';

// Configuration de la base de données
const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('DATABASE_URL non définie');
  process.exit(1);
}

// Parse DATABASE_URL
const url = new URL(DATABASE_URL);
const dbConfig = {
  host: url.hostname,
  port: parseInt(url.port) || 3306,
  user: url.username,
  password: url.password,
  database: url.pathname.slice(1),
  ssl: { rejectUnauthorized: false }
};

async function importMethods(connection) {
  console.log('Import des methodes analytiques...');
  
  const csvPath = '/home/ubuntu/perfumum-research/data/molecules_lost_map_v2/methods_catalog_v1.csv';
  const csvContent = readFileSync(csvPath, 'utf-8');
  const records = parse(csvContent, { columns: true, skip_empty_lines: true });
  
  let imported = 0;
  let skipped = 0;
  
  for (const record of records) {
    try {
      const [existing] = await connection.execute(
        'SELECT id FROM analytical_methods WHERE method_id = ?',
        [record.method_id]
      );
      
      if (existing.length > 0) {
        skipped++;
        continue;
      }
      
      await connection.execute(
        `INSERT INTO analytical_methods 
         (method_id, name, modality, sample_types, output, strengths, limitations, typical_markers, sop_outline)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          record.method_id,
          record.name,
          record.modality || null,
          record.sample_types || null,
          record.output || null,
          record.strengths || null,
          record.limitations || null,
          record.typical_markers || null,
          record.sop_outline || null
        ]
      );
      imported++;
    } catch (error) {
      console.error('Erreur pour ' + record.method_id + ': ' + error.message);
    }
  }
  
  console.log(imported + ' methodes importees, ' + skipped + ' ignorees');
  return imported;
}

async function importLostMolecules(connection) {
  console.log('Import des molecules marqueurs...');
  
  const csvPath = '/home/ubuntu/perfumum-research/data/molecules_lost_map_v2/molecules_seed_lostmap_v2.csv';
  const csvContent = readFileSync(csvPath, 'utf-8');
  const records = parse(csvContent, { columns: true, skip_empty_lines: true });
  
  let imported = 0;
  let skipped = 0;
  
  for (const record of records) {
    if (!record.molecule_id || !record.name) continue;
    
    try {
      const [existing] = await connection.execute(
        'SELECT id FROM lost_molecules WHERE molecule_id = ?',
        [record.molecule_id]
      );
      
      if (existing.length > 0) {
        skipped++;
        continue;
      }
      
      await connection.execute(
        `INSERT INTO lost_molecules 
         (molecule_id, name, molecule_class, formula, notes)
         VALUES (?, ?, ?, ?, ?)`,
        [
          record.molecule_id,
          record.name,
          record.class || null,
          record.formula || null,
          record.notes || null
        ]
      );
      imported++;
    } catch (error) {
      console.error('Erreur pour ' + record.molecule_id + ': ' + error.message);
    }
  }
  
  console.log(imported + ' molecules importees, ' + skipped + ' ignorees');
  return imported;
}

async function importEvidence(connection) {
  console.log('Import des liens evidence...');
  
  const csvPath = '/home/ubuntu/perfumum-research/data/molecules_lost_map_v2/molecules_lost_map_seed_v2.csv';
  const csvContent = readFileSync(csvPath, 'utf-8');
  const records = parse(csvContent, { columns: true, skip_empty_lines: true });
  
  const [molecules] = await connection.execute('SELECT id, molecule_id FROM lost_molecules');
  const moleculeMap = new Map(molecules.map(m => [m.molecule_id, m.id]));
  
  let imported = 0;
  let skipped = 0;
  let errors = 0;
  
  for (const record of records) {
    if (!record.evidence_id || !record.molecule_id) continue;
    
    try {
      const [existing] = await connection.execute(
        'SELECT id FROM molecule_evidence WHERE evidence_id = ?',
        [record.evidence_id]
      );
      
      if (existing.length > 0) {
        skipped++;
        continue;
      }
      
      const lostMoleculeId = moleculeMap.get(record.molecule_id);
      if (!lostMoleculeId) {
        console.error('Molecule non trouvee: ' + record.molecule_id);
        errors++;
        continue;
      }
      
      let entityType = null;
      if (record.entity_type) {
        const validTypes = ['plant', 'animal', 'material', 'reference'];
        entityType = validTypes.includes(record.entity_type) ? record.entity_type : 'reference';
      }
      
      let confidence = 'medium';
      if (record.confidence) {
        const validConf = ['low', 'medium', 'high'];
        confidence = validConf.includes(record.confidence) ? record.confidence : 'medium';
      }
      
      await connection.execute(
        `INSERT INTO molecule_evidence 
         (evidence_id, lost_molecule_id, molecule_name, marker_type, process_context, method,
          time_context, region_context, entity_type, entity_name, entity_id, claim_summary,
          confidence, reference_id, reference_title, doi, url, tags, evidence_notes, method_id)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          record.evidence_id,
          lostMoleculeId,
          record.molecule_name || null,
          record.marker_type || null,
          record.process_context || null,
          record.method || null,
          record.time_context || null,
          record.region_context || null,
          entityType,
          record.entity_name || null,
          record.entity_id || null,
          record.claim_summary || null,
          confidence,
          record.reference_id || null,
          record.reference_title || null,
          record.doi || null,
          record.url || null,
          record.tags || null,
          record.notes || null,
          record.method_id || null
        ]
      );
      imported++;
    } catch (error) {
      console.error('Erreur pour ' + record.evidence_id + ': ' + error.message);
      errors++;
    }
  }
  
  console.log(imported + ' evidence importes, ' + skipped + ' ignores, ' + errors + ' erreurs');
  return imported;
}

async function main() {
  console.log('Import MoleculesLostMap v2');
  console.log('================================');
  
  let connection;
  try {
    connection = await createConnection(dbConfig);
    console.log('Connexion etablie');
    
    const methodsCount = await importMethods(connection);
    const moleculesCount = await importLostMolecules(connection);
    const evidenceCount = await importEvidence(connection);
    
    console.log('================================');
    console.log('Resume:');
    console.log('  - Methodes analytiques: ' + methodsCount);
    console.log('  - Molecules marqueurs: ' + moleculesCount);
    console.log('  - Liens evidence: ' + evidenceCount);
    console.log('================================');
    console.log('Import termine!');
    
  } catch (error) {
    console.error('Erreur: ' + error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

main();
