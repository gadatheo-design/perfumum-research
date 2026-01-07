#!/usr/bin/env node
/**
 * PERFUMUM — Import Relational Seed Pack v2
 * 
 * Ce script importe les données relationnelles Cannabis/Tabac :
 * - Plantes (Cannabis, Nicotiana)
 * - Variétés (cultivars, landraces)
 * - Molécules (cannabinoïdes, terpènes, alcaloïdes)
 * - Références bibliographiques
 * - Chémotypes
 * - Régions géographiques
 * - Relations entre entités
 */

import { createConnection } from 'mysql2/promise';
import { readFileSync } from 'fs';
import { parse } from 'csv-parse/sync';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuration
const SEED_DIR = '/home/ubuntu/seed-pack';

// Connexion à la base de données
async function getConnection() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error('DATABASE_URL non définie');
  }
  
  // Parser l'URL MySQL/TiDB
  const urlObj = new URL(url);
  const host = urlObj.hostname;
  const port = parseInt(urlObj.port) || 4000;
  const user = decodeURIComponent(urlObj.username);
  const password = decodeURIComponent(urlObj.password);
  const database = urlObj.pathname.slice(1).split('?')[0]; // Enlever le / initial et les params
  
  return createConnection({
    host,
    port,
    user,
    password,
    database,
    ssl: { rejectUnauthorized: true }
  });
}

// Lecture CSV
function readCSV(filename) {
  const filepath = join(SEED_DIR, filename);
  const content = readFileSync(filepath, 'utf-8');
  return parse(content, {
    columns: true,
    skip_empty_lines: true,
    trim: true
  });
}

// Maps pour stocker les IDs créés
const idMaps = {
  plants: new Map(),      // seed_id -> db_id
  varieties: new Map(),
  molecules: new Map(),
  references: new Map(),
  chemotypes: new Map(),
  regions: new Map()
};

// ============================================================================
// IMPORT DES PLANTES
// ============================================================================
async function importPlants(conn) {
  console.log('\n📗 Import des plantes...');
  const plants = readCSV('plants_seed.csv');
  
  for (const plant of plants) {
    // Vérifier si la plante existe déjà (par nom latin)
    const [existing] = await conn.execute(
      'SELECT id FROM plants WHERE latin_name = ? OR name = ?',
      [plant.scientific_name, plant.common_name]
    );
    
    if (existing.length > 0) {
      idMaps.plants.set(plant.plant_id, existing[0].id);
      console.log(`  ✓ Plante existante: ${plant.common_name} (ID: ${existing[0].id})`);
      continue;
    }
    
    // Mapper la catégorie
    let category = 'autre';
    if (plant.common_name.toLowerCase().includes('cannabis')) category = 'cannabis';
    else if (plant.common_name.toLowerCase().includes('tabac') || 
             plant.scientific_name.toLowerCase().includes('nicotiana')) category = 'tabac';
    
    // Insérer la nouvelle plante
    const [result] = await conn.execute(
      `INSERT INTO plants (name, latin_name, family, category, olfactive_signature)
       VALUES (?, ?, ?, ?, ?)`,
      [
        plant.common_name,
        plant.scientific_name,
        plant.family,
        category,
        plant.notes || `Importé depuis seed pack v2 - ${plant.plant_id}`
      ]
    );
    
    idMaps.plants.set(plant.plant_id, result.insertId);
    console.log(`  + Plante créée: ${plant.common_name} (ID: ${result.insertId})`);
  }
  
  console.log(`  Total: ${idMaps.plants.size} plantes mappées`);
}

// ============================================================================
// IMPORT DES VARIÉTÉS
// ============================================================================
async function importVarieties(conn) {
  console.log('\n🌱 Import des variétés...');
  const varieties = readCSV('varieties_seed.csv');
  let varCounter = 1;
  
  for (const variety of varieties) {
    const plantId = idMaps.plants.get(variety.plant_id);
    if (!plantId) {
      console.log(`  ⚠ Plante non trouvée pour variété: ${variety.name}`);
      continue;
    }
    
    // Vérifier si la variété existe déjà
    const [existing] = await conn.execute(
      'SELECT id FROM plant_varieties WHERE name = ? AND plant_id = ?',
      [variety.name, plantId]
    );
    
    if (existing.length > 0) {
      idMaps.varieties.set(variety.variety_id, existing[0].id);
      console.log(`  ✓ Variété existante: ${variety.name} (ID: ${existing[0].id})`);
      continue;
    }
    
    // Mapper le type de variété
    let varietyType = 'cultivar';
    if (variety.type.includes('landrace')) varietyType = 'landrace';
    else if (variety.type.includes('wild')) varietyType = 'wild';
    else if (variety.type.includes('lab')) varietyType = 'cultivar';
    
    // Générer un variety_id unique
    const varietyIdStr = `PV-SEED-${String(varCounter++).padStart(3, '0')}`;
    
    // Insérer la nouvelle variété
    const [result] = await conn.execute(
      `INSERT INTO plant_varieties (variety_id, plant_id, name, variety_type, distinctive_features)
       VALUES (?, ?, ?, ?, ?)`,
      [
        varietyIdStr,
        plantId,
        variety.name,
        varietyType,
        variety.notes || `Type original: ${variety.type} | Importé depuis seed pack v2`
      ]
    );
    
    idMaps.varieties.set(variety.variety_id, result.insertId);
    console.log(`  + Variété créée: ${variety.name} (ID: ${result.insertId})`);
  }
  
  console.log(`  Total: ${idMaps.varieties.size} variétés mappées`);
}

// ============================================================================
// IMPORT DES MOLÉCULES
// ============================================================================
async function importMolecules(conn) {
  console.log('\n🧪 Import des molécules...');
  const molecules = readCSV('molecules_seed.csv');
  
  for (const mol of molecules) {
    // Vérifier si la molécule existe déjà
    const [existing] = await conn.execute(
      'SELECT id FROM molecules WHERE name = ? OR name LIKE ?',
      [mol.name, `%${mol.name}%`]
    );
    
    if (existing.length > 0) {
      idMaps.molecules.set(mol.molecule_id, existing[0].id);
      console.log(`  ✓ Molécule existante: ${mol.name} (ID: ${existing[0].id})`);
      continue;
    }
    
    // Mapper la classe chimique
    let chemicalClass = 'other';
    const classLower = (mol.class || '').toLowerCase();
    if (classLower.includes('terpene') && !classLower.includes('sesqui')) chemicalClass = 'terpene';
    else if (classLower.includes('sesquiterpene')) chemicalClass = 'sesquiterpene';
    else if (classLower.includes('alcohol')) chemicalClass = 'alcohol';
    else if (classLower.includes('cannabinoid') || classLower.includes('alkaloid') || classLower.includes('tsna')) chemicalClass = 'other';
    
    // Insérer la nouvelle molécule
    const [result] = await conn.execute(
      `INSERT INTO molecules (name, chemicalFormula, chemical_class, family, notes)
       VALUES (?, ?, ?, ?, ?)`,
      [
        mol.name,
        mol.formula || null,
        chemicalClass,
        mol.class || null,
        mol.notes !== '—' ? mol.notes : `Classe: ${mol.class} | Importé depuis seed pack v2`
      ]
    );
    
    idMaps.molecules.set(mol.molecule_id, result.insertId);
    console.log(`  + Molécule créée: ${mol.name} (ID: ${result.insertId})`);
  }
  
  console.log(`  Total: ${idMaps.molecules.size} molécules mappées`);
}

// ============================================================================
// IMPORT DES RÉFÉRENCES BIBLIOGRAPHIQUES
// ============================================================================
async function importReferences(conn) {
  console.log('\n📚 Import des références bibliographiques...');
  const references = readCSV('references_seed.csv');
  
  for (const ref of references) {
    // Vérifier si la référence existe déjà (par clé ou DOI)
    const [existing] = await conn.execute(
      'SELECT id FROM bibliography_entries WHERE entry_key = ? OR (doi IS NOT NULL AND doi = ?)',
      [ref.reference_id, ref.doi || '']
    );
    
    if (existing.length > 0) {
      idMaps.references.set(ref.reference_id, existing[0].id);
      console.log(`  ✓ Référence existante: ${ref.reference_id} (ID: ${existing[0].id})`);
      continue;
    }
    
    // Déterminer le type d'entrée
    let entryType = 'article';
    if (ref.reference_id.startsWith('db-')) entryType = 'online';
    else if (ref.venue?.toLowerCase().includes('preprint') || ref.venue?.toLowerCase().includes('biorxiv')) entryType = 'unpublished';
    
    // Déterminer le domaine de recherche
    let researchDomain = 'botanique';
    const tags = (ref.tags || '').toLowerCase();
    if (tags.includes('cannabis')) researchDomain = 'tabac_cannabis';
    else if (tags.includes('tobacco') || tags.includes('nicotiana')) researchDomain = 'tabac_cannabis';
    else if (tags.includes('genome') || tags.includes('genomics')) researchDomain = 'botanique';
    
    // Parser les mots-clés
    const keywords = ref.tags ? ref.tags.split(';').map(k => k.trim()) : [];
    
    // Insérer la nouvelle référence
    const [result] = await conn.execute(
      `INSERT INTO bibliography_entries 
       (entry_key, entry_type, title, authors, year, journal, doi, url, keywords, notes, research_domain, read_status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'unread')`,
      [
        ref.reference_id,
        entryType,
        ref.title,
        ref.authors || null,
        ref.year ? parseInt(ref.year) : null,
        ref.venue || null,
        ref.doi || null,
        ref.url || null,
        JSON.stringify(keywords),
        ref.notes || null,
        researchDomain
      ]
    );
    
    idMaps.references.set(ref.reference_id, result.insertId);
    console.log(`  + Référence créée: ${ref.reference_id} (ID: ${result.insertId})`);
  }
  
  console.log(`  Total: ${idMaps.references.size} références mappées`);
}

// ============================================================================
// IMPORT DES CHÉMOTYPES
// ============================================================================
async function importChemotypes(conn) {
  console.log('\n🧬 Import des chémotypes...');
  const chemotypes = readCSV('chemotypes_seed.csv');
  
  for (const chem of chemotypes) {
    // Vérifier si le chémotype existe déjà
    const [existing] = await conn.execute(
      'SELECT id FROM chemotypes WHERE name = ?',
      [chem.name]
    );
    
    if (existing.length > 0) {
      idMaps.chemotypes.set(chem.chemotype_id, existing[0].id);
      console.log(`  ✓ Chémotype existant: ${chem.name} (ID: ${existing[0].id})`);
      continue;
    }
    
    // Trouver la plante parente (Cannabis ou Nicotiana)
    let plantId = null;
    let plantName = 'Cannabis';
    if (chem.domain === 'cannabis') {
      plantId = idMaps.plants.get('pl-cannabis-sativa');
      plantName = 'Cannabis';
    } else if (chem.domain === 'tobacco') {
      plantId = idMaps.plants.get('pl-nicotiana-tabacum');
      plantName = 'Tabac';
    }
    
    // Extraire la molécule dominante du nom
    let dominantMoleculeName = 'Non spécifié';
    if (chem.name.includes('CBD')) dominantMoleculeName = 'CBD';
    else if (chem.name.includes('THC')) dominantMoleculeName = 'THC';
    else if (chem.name.includes('Myrcene')) dominantMoleculeName = 'β-Myrcene';
    else if (chem.name.includes('Terpinolene')) dominantMoleculeName = 'Terpinolene';
    else if (chem.name.includes('Caryophyllene')) dominantMoleculeName = 'β-Caryophyllene';
    else if (chem.name.includes('Linalool')) dominantMoleculeName = 'Linalool';
    else if (chem.name.includes('nicotine')) dominantMoleculeName = 'Nicotine';
    else if (chem.name.includes('nornicotine')) dominantMoleculeName = 'Nornicotine';
    else if (chem.name.includes('Anatabine')) dominantMoleculeName = 'Anatabine';
    else if (chem.name.includes('TSNA')) dominantMoleculeName = 'NNN/NNK';
    
    // Insérer le nouveau chémotype
    const [result] = await conn.execute(
      `INSERT INTO chemotypes (plant_id, plant_name, name, dominant_molecule_name, olfactive_profile)
       VALUES (?, ?, ?, ?, ?)`,
      [
        plantId,
        plantName,
        chem.name,
        dominantMoleculeName,
        `${chem.description || ''} | Domaine: ${chem.domain} | Niveau d'évidence: ${chem.evidence_level} | ${chem.notes || ''}`
      ]
    );
    
    idMaps.chemotypes.set(chem.chemotype_id, result.insertId);
    console.log(`  + Chémotype créé: ${chem.name} (ID: ${result.insertId})`);
  }
  
  console.log(`  Total: ${idMaps.chemotypes.size} chémotypes mappés`);
}

// ============================================================================
// IMPORT DES RÉGIONS
// ============================================================================
async function importRegions(conn) {
  console.log('\n🌍 Import des régions...');
  const regions = readCSV('regions_seed.csv');
  
  for (const region of regions) {
    // Vérifier si la région existe déjà dans terroirs
    const [existing] = await conn.execute(
      'SELECT id FROM terroirs WHERE name = ?',
      [region.name]
    );
    
    if (existing.length > 0) {
      idMaps.regions.set(region.region_id, existing[0].id);
      console.log(`  ✓ Région existante: ${region.name} (ID: ${existing[0].id})`);
      continue;
    }
    
    // Déterminer le pays
    let country = 'Global';
    if (region.name.includes('Colombia')) country = 'Colombie';
    else if (region.name.includes('Burkina')) country = 'Burkina Faso';
    else if (region.name.includes('Caribbean')) country = 'Caraïbes';
    else if (region.name.includes('San Andrés')) country = 'Colombie';
    
    // Générer un terroir_id unique
    const terroirId = `TER-SEED-${region.region_id.replace('reg-', '').toUpperCase().slice(0, 10)}`;
    
    // Insérer la nouvelle région
    const [result] = await conn.execute(
      `INSERT INTO terroirs (terroir_id, name, country, region, notes)
       VALUES (?, ?, ?, ?, ?)`,
      [
        terroirId,
        region.name,
        country,
        region.notes || null,
        `ISO: ${region.iso || 'N/A'} | Importé depuis seed pack v2`
      ]
    );
    
    idMaps.regions.set(region.region_id, result.insertId);
    console.log(`  + Région créée: ${region.name} (ID: ${result.insertId})`);
  }
  
  console.log(`  Total: ${idMaps.regions.size} régions mappées`);
}

// ============================================================================
// IMPORT DES RELATIONS PLANTES-MOLÉCULES
// ============================================================================
async function importPlantMoleculeRelations(conn) {
  console.log('\n🔗 Import des relations plantes-molécules...');
  const relations = readCSV('rel_plant_molecule.csv');
  let created = 0, skipped = 0;
  
  for (const rel of relations) {
    const plantId = idMaps.plants.get(rel.plant_id);
    const moleculeId = idMaps.molecules.get(rel.molecule_id);
    
    if (!plantId || !moleculeId) {
      skipped++;
      continue;
    }
    
    // Vérifier si la relation existe déjà
    const [existing] = await conn.execute(
      'SELECT * FROM plant_molecules WHERE plant_id = ? AND molecule_id = ?',
      [plantId, moleculeId]
    );
    
    if (existing.length > 0) {
      skipped++;
      continue;
    }
    
    // Créer la relation
    await conn.execute(
      `INSERT INTO plant_molecules (plant_id, molecule_id, is_signature, role, source, notes)
       VALUES (?, ?, 1, 'majeur', 'seed-pack-v2', ?)`,
      [plantId, moleculeId, rel.notes || `Evidence: ${rel.evidence}`]
    );
    created++;
  }
  
  console.log(`  + ${created} relations créées, ${skipped} ignorées`);
}

// ============================================================================
// IMPORT DES RELATIONS PLANTES-RÉFÉRENCES
// ============================================================================
async function importPlantReferenceRelations(conn) {
  console.log('\n📖 Import des relations plantes-références...');
  const relations = readCSV('rel_plant_reference.csv');
  let created = 0, skipped = 0;
  
  for (const rel of relations) {
    const plantId = idMaps.plants.get(rel.plant_id);
    const refId = idMaps.references.get(rel.reference_id);
    
    if (!plantId || !refId) {
      skipped++;
      continue;
    }
    
    // Récupérer les linkedPlantIds actuels
    const [entry] = await conn.execute(
      'SELECT linked_plant_ids FROM bibliography_entries WHERE id = ?',
      [refId]
    );
    
    if (entry.length === 0) {
      skipped++;
      continue;
    }
    
    let linkedPlants = [];
    try {
      const raw = entry[0].linked_plant_ids;
      if (raw) {
        linkedPlants = typeof raw === 'string' ? JSON.parse(raw) : raw;
      }
    } catch (e) {
      linkedPlants = [];
    }
    
    if (!Array.isArray(linkedPlants)) linkedPlants = [];
    
    if (linkedPlants.includes(plantId)) {
      skipped++;
      continue;
    }
    
    linkedPlants.push(plantId);
    
    await conn.execute(
      'UPDATE bibliography_entries SET linked_plant_ids = ? WHERE id = ?',
      [JSON.stringify(linkedPlants), refId]
    );
    created++;
  }
  
  console.log(`  + ${created} liaisons créées, ${skipped} ignorées`);
}

// ============================================================================
// IMPORT DES RELATIONS CHÉMOTYPES-MOLÉCULES
// ============================================================================
async function importChemotypeMoleculeRelations(conn) {
  console.log('\n🧬 Import des relations chémotypes-molécules...');
  const relations = readCSV('rel_chemotype_molecule.csv');
  let created = 0, skipped = 0;
  
  for (const rel of relations) {
    const chemotypeId = idMaps.chemotypes.get(rel.chemotype_id);
    const moleculeId = idMaps.molecules.get(rel.molecule_id);
    
    if (!chemotypeId || !moleculeId) {
      skipped++;
      continue;
    }
    
    // Mettre à jour le chémotype avec la molécule dominante
    // (On utilise le premier comme molécule dominante)
    const [existing] = await conn.execute(
      'SELECT dominant_molecule_id FROM chemotypes WHERE id = ?',
      [chemotypeId]
    );
    
    if (existing.length > 0 && !existing[0].dominant_molecule_id) {
      await conn.execute(
        'UPDATE chemotypes SET dominant_molecule_id = ? WHERE id = ?',
        [moleculeId, chemotypeId]
      );
      created++;
    } else {
      skipped++;
    }
  }
  
  console.log(`  + ${created} liaisons créées, ${skipped} ignorées`);
}

// ============================================================================
// MAIN
// ============================================================================
async function main() {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('  PERFUMUM — Import Relational Seed Pack v2');
  console.log('  Cannabis & Tabac: Plantes, Variétés, Molécules, Références');
  console.log('═══════════════════════════════════════════════════════════════');
  
  let conn;
  try {
    conn = await getConnection();
    console.log('\n✅ Connexion à la base de données établie');
    
    // Import dans l'ordre recommandé
    await importRegions(conn);
    await importPlants(conn);
    await importVarieties(conn);
    await importMolecules(conn);
    await importReferences(conn);
    await importChemotypes(conn);
    
    // Import des relations
    await importPlantMoleculeRelations(conn);
    await importPlantReferenceRelations(conn);
    await importChemotypeMoleculeRelations(conn);
    
    console.log('\n═══════════════════════════════════════════════════════════════');
    console.log('  ✅ Import terminé avec succès !');
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('\nRésumé:');
    console.log(`  - Plantes: ${idMaps.plants.size}`);
    console.log(`  - Variétés: ${idMaps.varieties.size}`);
    console.log(`  - Molécules: ${idMaps.molecules.size}`);
    console.log(`  - Références: ${idMaps.references.size}`);
    console.log(`  - Chémotypes: ${idMaps.chemotypes.size}`);
    console.log(`  - Régions: ${idMaps.regions.size}`);
    
  } catch (error) {
    console.error('\n❌ Erreur:', error.message);
    console.error(error.stack);
    process.exit(1);
  } finally {
    if (conn) {
      await conn.end();
    }
  }
}

main();
