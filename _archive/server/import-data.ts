/**
 * Data Import Functions for PERFUMUM
 * These functions import tobacco, cannabis, and related data into the database
 */

import fs from 'fs';
import path from 'path';
import { getDb } from './db';
import {
  tobaccoVarieties,
  tobaccoTerroirs,
  tobaccoAdditives,
  pyrazines,
  aromaticMoleculesTabac,
  landraces,
  researchClaims,
  researchSources,
} from '../drizzle/schema';

const UPLOAD_DIR = '/home/ubuntu/upload';
let db: any;

/**
 * Import Tobacco Varieties
 */
export async function importTobaccoVarietiesData() {
  if (!db) db = await getDb();
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
          await db.insert(tobaccoVarieties).values({
            name: variety.nom || variety.name || 'Unknown',
            latinName: variety.latin_name || null,
            category: 'landrace',
            origin: variety.region_origine || variety.origin || null,
            region: variety.terroir?.zones_production?.[0] || null,
            olfactiveFamily: variety.profil_aromatique?.famille || null,
            aromaProfile: JSON.stringify(variety.profil_aromatique || {}),
            chemicalProfile: JSON.stringify(variety.profil_chimique || {}),
            historicalSignificance: variety.historique || null,
            sourceReferences: JSON.stringify(variety.sources || []),
          });
          count++;
        } catch (err) {
          console.warn(`⚠️  Skipped variety: ${variety.nom}`, (err as Error).message);
        }
      }
    }
    
    console.log(`✅ Imported ${count} tobacco varieties`);
    return count;
  } catch (err) {
    console.error('❌ Error importing tobacco varieties:', (err as Error).message);
    return 0;
  }
}

/**
 * Import Terroirs
 */
export async function importTerroirsData() {
  if (!db) db = await getDb();
  console.log('📥 Importing terroirs...');
  
  const filePath = path.join(UPLOAD_DIR, 'perfumum_terroirs_tabac.json');
  
  try {
    if (!fs.existsSync(filePath)) {
      console.warn(`⚠️  File not found: ${filePath}`);
      return 0;
    }
    
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    let count = 0;
    
    if (data.terroirs && Array.isArray(data.terroirs)) {
      for (const terroir of data.terroirs) {
        try {
          await db.insert(tobaccoTerroirs).values({
            name: terroir.nom || terroir.name || 'Unknown',
            region: terroir.region || null,
            country: terroir.pays || terroir.country || null,
            coordinates: JSON.stringify(terroir.coordonnees || terroir.coordinates || {}),
            soilType: terroir.sol?.type || terroir.soilType || null,
            soilComposition: JSON.stringify(terroir.sol || {}),
            climate: terroir.climat || terroir.climate || null,
            elevation: terroir.altitude || terroir.elevation || null,
            rainfall: terroir.precipitation || terroir.rainfall || null,
            chemicalImpact: terroir.impact_chimique || terroir.chemicalImpact || null,
            sourceReferences: JSON.stringify(terroir.sources || []),
          });
          count++;
        } catch (err) {
          console.warn(`⚠️  Skipped terroir: ${terroir.nom}`, (err as Error).message);
        }
      }
    }
    
    console.log(`✅ Imported ${count} terroirs`);
    return count;
  } catch (err) {
    console.error('❌ Error importing terroirs:', (err as Error).message);
    return 0;
  }
}

/**
 * Import Additives
 */
export async function importAdditivesData() {
  if (!db) db = await getDb();
  console.log('📥 Importing tobacco additives...');
  
  const filePath = path.join(UPLOAD_DIR, 'perfumum_additifs_tabac.json');
  
  try {
    if (!fs.existsSync(filePath)) {
      console.warn(`⚠️  File not found: ${filePath}`);
      return 0;
    }
    
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    let count = 0;
    
    if (data.additifs && Array.isArray(data.additifs)) {
      for (const additive of data.additifs) {
        try {
          await db.insert(tobaccoAdditives).values({
            name: additive.nom || additive.name || 'Unknown',
            type: additive.type || 'other',
            chemicalFormula: additive.formule_chimique || null,
            source: additive.source || null,
            historicalUse: additive.usage_historique || null,
            alkalinizingPower: additive.pouvoir_alcalinisant || null,
            applicationMethods: JSON.stringify(additive.methodes_application || []),
            sourceReferences: JSON.stringify(additive.sources || []),
          });
          count++;
        } catch (err) {
          console.warn(`⚠️  Skipped additive: ${additive.nom}`, (err as Error).message);
        }
      }
    }
    
    console.log(`✅ Imported ${count} additives`);
    return count;
  } catch (err) {
    console.error('❌ Error importing additives:', (err as Error).message);
    return 0;
  }
}

/**
 * Import Pyrazines
 */
export async function importPyrazinesData() {
  if (!db) db = await getDb();
  console.log('📥 Importing pyrazines...');
  
  const filePath = path.join(UPLOAD_DIR, 'perfumum_pyrazines.json');
  
  try {
    if (!fs.existsSync(filePath)) {
      console.warn(`⚠️  File not found: ${filePath}`);
      return 0;
    }
    
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    let count = 0;
    
    if (data.pyrazines && Array.isArray(data.pyrazines)) {
      for (const pyrazine of data.pyrazines) {
        try {
          await db.insert(pyrazines).values({
            name: pyrazine.nom || pyrazine.name || 'Unknown',
            chemicalFormula: pyrazine.formule_chimique || 'Unknown',
            molecularWeight: pyrazine.poids_moleculaire || null,
            odorProfile: JSON.stringify(pyrazine.profil_olfactif || {}),
            tobaccoContribution: pyrazine.contribution_tabac || null,
            perfumeryPotential: pyrazine.potentiel_parfumerie || null,
            sourceReferences: JSON.stringify(pyrazine.sources || []),
          });
          count++;
        } catch (err) {
          console.warn(`⚠️  Skipped pyrazine: ${pyrazine.nom}`, (err as Error).message);
        }
      }
    }
    
    console.log(`✅ Imported ${count} pyrazines`);
    return count;
  } catch (err) {
    console.error('❌ Error importing pyrazines:', (err as Error).message);
    return 0;
  }
}

/**
 * Import Aromatic Molecules
 */
export async function importAromaticMoleculesData() {
  if (!db) db = await getDb();
  console.log('📥 Importing aromatic molecules...');
  
  const filePath = path.join(UPLOAD_DIR, 'perfumum_molecules_tabac.json');
  
  try {
    if (!fs.existsSync(filePath)) {
      console.warn(`⚠️  File not found: ${filePath}`);
      return 0;
    }
    
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    let count = 0;
    
    if (data.molecules && Array.isArray(data.molecules)) {
      for (const molecule of data.molecules) {
        try {
          await db.insert(aromaticMoleculesTabac).values({
            name: molecule.nom || molecule.name || 'Unknown',
            chemicalFormula: molecule.formule_chimique || 'Unknown',
            molecularWeight: molecule.poids_moleculaire || null,
            odorDescriptors: JSON.stringify(molecule.descripteurs_odeur || []),
            tobaccoContribution: molecule.contribution_tabac || null,
            therapeuticProperties: JSON.stringify(molecule.proprietes_therapeutiques || []),
            sourceReferences: JSON.stringify(molecule.sources || []),
          });
          count++;
        } catch (err) {
          console.warn(`⚠️  Skipped molecule: ${molecule.nom}`, (err as Error).message);
        }
      }
    }
    
    console.log(`✅ Imported ${count} aromatic molecules`);
    return count;
  } catch (err) {
    console.error('❌ Error importing aromatic molecules:', (err as Error).message);
    return 0;
  }
}

/**
 * Import Landraces
 */
export async function importLandracesData() {
  if (!db) db = await getDb();
  console.log('📥 Importing landraces...');
  
  const filePath = path.join(UPLOAD_DIR, 'perfumum_landraces_monde_v2_complet.json');
  
  try {
    if (!fs.existsSync(filePath)) {
      console.warn(`⚠️  File not found: ${filePath}`);
      return 0;
    }
    
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    let count = 0;
    
    if (data.landraces && Array.isArray(data.landraces)) {
      for (const landrace of data.landraces) {
        try {
          await db.insert(landraces).values({
            name: landrace.nom || landrace.name || 'Unknown',
            originCountry: landrace.pays_origine || landrace.originCountry || 'Unknown',
            originRegion: landrace.region_origine || landrace.originRegion || null,
            historicalPeriod: landrace.periode_historique || null,
            culturalSignificance: landrace.signification_culturelle || null,
            molecularProfile: JSON.stringify(landrace.profil_moleculaire || {}),
            aromaCharacteristics: landrace.caracteristiques_aroma || null,
            sourceReferences: JSON.stringify(landrace.sources || []),
          });
          count++;
        } catch (err) {
          console.warn(`⚠️  Skipped landrace: ${landrace.nom}`, (err as Error).message);
        }
      }
    }
    
    console.log(`✅ Imported ${count} landraces`);
    return count;
  } catch (err) {
    console.error('❌ Error importing landraces:', (err as Error).message);
    return 0;
  }
}

/**
 * Import Research Claims
 */
export async function importResearchClaimsData() {
  if (!db) db = await getDb();
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
          await db.insert(researchClaims).values({
            claimId: parts[0] || `CLAIM-${Date.now()}`,
            claim: parts[1] || 'Unknown claim',
            claimType: 'ethnobotanical',
            status: 'pending',
          });
          count++;
        }
      } catch (err) {
        // Skip malformed lines
      }
    }
    
    console.log(`✅ Imported ${count} research claims`);
    return count;
  } catch (err) {
    console.error('❌ Error importing research claims:', (err as Error).message);
    return 0;
  }
}

/**
 * Import Research Sources
 */
export async function importResearchSourcesData() {
  if (!db) db = await getDb();
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
          await db.insert(researchSources).values({
            sourceId: parts[0] || `SRC-${Date.now()}`,
            reference: parts[1] || 'Unknown source',
            quality: 'medium',
            status: 'pending',
          });
          count++;
        }
      } catch (err) {
        // Skip malformed lines
      }
    }
    
    console.log(`✅ Imported ${count} research sources`);
    return count;
  } catch (err) {
    console.error('❌ Error importing research sources:', (err as Error).message);
    return 0;
  }
}

/**
 * Run all imports
 */
export async function runAllImports() {
  console.log('🚀 Starting PERFUMUM data import...\n');
  
  const results = {
    varieties: await importTobaccoVarietiesData(),
    terroirs: await importTerroirsData(),
    additives: await importAdditivesData(),
    pyrazines: await importPyrazinesData(),
    molecules: await importAromaticMoleculesData(),
    landraces: await importLandracesData(),
    claims: await importResearchClaimsData(),
    sources: await importResearchSourcesData(),
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
  
  return results;
}
