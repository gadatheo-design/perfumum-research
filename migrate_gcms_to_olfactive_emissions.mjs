/**
 * Migration NOSE Phase 1 — Données GC-MS → olfactive_emissions
 * 
 * Sources migrées :
 * 1. plant_molecules (avec percentage > 0)
 * 2. tabac_molecule_links (avec concentration)
 * 3. landrace_terpene_profiles
 * 4. gcms_peaks (via gcms_chromatograms → landrace)
 */

import mysql from 'mysql2/promise';

const conn = await mysql.createConnection(process.env.DATABASE_URL);

let totalInserted = 0;
let totalSkipped = 0;

console.log('=== Migration NOSE Phase 1 — GC-MS → olfactive_emissions ===\n');

// ─────────────────────────────────────────────────────────────────────────────
// SOURCE 1 : plant_molecules (9362 lignes, 1571 avec percentage > 0)
// ─────────────────────────────────────────────────────────────────────────────
console.log('--- Source 1 : plant_molecules ---');

const [plantMols] = await conn.execute(`
  SELECT 
    pm.plant_id,
    pm.molecule_id,
    pm.percentage,
    pm.percentage_min,
    pm.percentage_max,
    pm.role,
    pm.is_signature,
    pm.source,
    pm.variability_factor,
    pm.notes
  FROM plant_molecules pm
  WHERE pm.percentage > 0 OR pm.percentage_min > 0 OR pm.percentage_max > 0
`);

console.log(`  Lignes candidates : ${plantMols.length}`);

// Vérifier les doublons déjà migrés
const [existingPM] = await conn.execute(
  "SELECT COUNT(*) as n FROM olfactive_emissions WHERE source_table = 'plant_molecules'"
);
if (existingPM[0].n > 0) {
  console.log(`  Déjà migrés : ${existingPM[0].n} — skip`);
} else {
  let inserted = 0;
  const batchSize = 500;
  
  for (let i = 0; i < plantMols.length; i += batchSize) {
    const batch = plantMols.slice(i, i + batchSize);
    const values = batch.map(row => [
      row.plant_id,
      row.molecule_id,
      null, // tabac_id
      'plante_entiere', // plant_part par défaut
      null, // extraction_method (non disponible dans plant_molecules)
      row.percentage || null,
      row.percentage_min || null,
      row.percentage_max || null,
      null, // concentration_ppm
      '%',
      'gc_ms', // analysis_method par défaut
      row.source || null,
      null, // geographic_origin
      null, null, // period_start, period_end
      row.role || 'secondaire',
      row.is_signature || 0,
      'plant_molecules',
      null, // source_id (pas de PK unique dans plant_molecules)
      row.notes || null,
    ]);
    
    await conn.query(`
      INSERT INTO olfactive_emissions 
        (plant_id, molecule_id, tabac_id, plant_part, extraction_method,
         percentage, percentage_min, percentage_max, concentration_ppm, concentration_unit,
         analysis_method, analysis_source, geographic_origin,
         period_start, period_end, role, is_signature,
         source_table, source_id, notes)
      VALUES ?
    `, [values]);
    
    inserted += batch.length;
    process.stdout.write(`  Migré : ${inserted}/${plantMols.length}\r`);
  }
  console.log(`\n  ✓ ${inserted} lignes insérées depuis plant_molecules`);
  totalInserted += inserted;
}

// ─────────────────────────────────────────────────────────────────────────────
// SOURCE 2 : tabac_molecule_links (237 lignes, 70 avec concentration)
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n--- Source 2 : tabac_molecule_links ---');

const [tabacMols] = await conn.execute(`
  SELECT 
    tml.id,
    tml.tabac_id,
    tml.molecule_id,
    tml.concentration,
    tml.notes,
    t.id as plant_id_from_tabac
  FROM tabac_molecule_links tml
  LEFT JOIN tabacs t ON tml.tabac_id = t.id
`);

console.log(`  Lignes candidates : ${tabacMols.length}`);

const [existingTML] = await conn.execute(
  "SELECT COUNT(*) as n FROM olfactive_emissions WHERE source_table = 'tabac_molecule_links'"
);
if (existingTML[0].n > 0) {
  console.log(`  Déjà migrés : ${existingTML[0].n} — skip`);
} else {
  const values = tabacMols.map(row => [
    null, // plant_id (tabac n'est pas dans plants)
    row.molecule_id,
    row.tabac_id,
    'feuille', // plant_part par défaut pour tabac
    'hydrodistillation', // extraction_method par défaut
    null, // percentage
    null, null,
    row.concentration || null, // concentration_ppm
    'ppm',
    'gc_ms',
    null, // analysis_source
    null, null, null,
    'secondaire',
    0,
    'tabac_molecule_links',
    row.id,
    row.notes || null,
  ]);
  
  await conn.query(`
    INSERT INTO olfactive_emissions 
      (plant_id, molecule_id, tabac_id, plant_part, extraction_method,
       percentage, percentage_min, percentage_max, concentration_ppm, concentration_unit,
       analysis_method, analysis_source, geographic_origin,
       period_start, period_end, role, is_signature,
       source_table, source_id, notes)
    VALUES ?
  `, [values]);
  
  console.log(`  ✓ ${tabacMols.length} lignes insérées depuis tabac_molecule_links`);
  totalInserted += tabacMols.length;
}

// ─────────────────────────────────────────────────────────────────────────────
// SOURCE 3 : landrace_terpene_profiles (38 lignes)
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n--- Source 3 : landrace_terpene_profiles ---');

const [landraceProfiles] = await conn.execute(`
  SELECT 
    ltp.id,
    ltp.landrace_id,
    ltp.terpene_name,
    ltp.concentration_ppm,
    ltp.concentration_percent,
    ltp.relative_abundance,
    ltp.detection_method,
    ltp.retention_time,
    ltp.source_reference,
    ltp.notes,
    m.id as molecule_id
  FROM landrace_terpene_profiles ltp
  LEFT JOIN molecules m ON m.name LIKE CONCAT('%', ltp.terpene_name, '%')
`);

console.log(`  Lignes candidates : ${landraceProfiles.length}`);

const [existingLTP] = await conn.execute(
  "SELECT COUNT(*) as n FROM olfactive_emissions WHERE source_table = 'landrace_terpene_profiles'"
);
if (existingLTP[0].n > 0) {
  console.log(`  Déjà migrés : ${existingLTP[0].n} — skip`);
} else {
  const values = landraceProfiles.map(row => [
    null, // plant_id
    row.molecule_id || null,
    null, // tabac_id
    'feuille',
    row.detection_method === 'gc_ms' ? 'hydrodistillation' : 'autre',
    row.concentration_percent ? parseFloat(row.concentration_percent) * 100 : null,
    null, null,
    row.concentration_ppm || null,
    row.concentration_ppm ? 'ppm' : '%',
    row.detection_method === 'gc_ms' ? 'gc_ms' : 'autre',
    row.source_reference || null,
    null, null, null,
    'secondaire',
    0,
    'landrace_terpene_profiles',
    row.id,
    (row.notes || '') + (row.terpene_name ? ` [terpène: ${row.terpene_name}]` : ''),
  ]);
  
  await conn.query(`
    INSERT INTO olfactive_emissions 
      (plant_id, molecule_id, tabac_id, plant_part, extraction_method,
       percentage, percentage_min, percentage_max, concentration_ppm, concentration_unit,
       analysis_method, analysis_source, geographic_origin,
       period_start, period_end, role, is_signature,
       source_table, source_id, notes)
    VALUES ?
  `, [values]);
  
  console.log(`  ✓ ${landraceProfiles.length} lignes insérées depuis landrace_terpene_profiles`);
  totalInserted += landraceProfiles.length;
}

// ─────────────────────────────────────────────────────────────────────────────
// SOURCE 4 : gcms_peaks (60 lignes via gcms_chromatograms)
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n--- Source 4 : gcms_peaks ---');

const [gcmsPeaks] = await conn.execute(`
  SELECT 
    gp.id,
    gp.chromatogram_id,
    gp.retention_time,
    gp.compound_name,
    gp.cas_number,
    gp.match_quality,
    gp.concentration_ppm,
    gc.landrace_id,
    m.id as molecule_id
  FROM gcms_peaks gp
  LEFT JOIN gcms_chromatograms gc ON gp.chromatogram_id = gc.id
  LEFT JOIN molecules m ON m.cas_number = gp.cas_number
    OR m.name LIKE CONCAT('%', gp.compound_name, '%')
`);

console.log(`  Lignes candidates : ${gcmsPeaks.length}`);

const [existingGP] = await conn.execute(
  "SELECT COUNT(*) as n FROM olfactive_emissions WHERE source_table = 'gcms_peaks'"
);
if (existingGP[0].n > 0) {
  console.log(`  Déjà migrés : ${existingGP[0].n} — skip`);
} else {
  const values = gcmsPeaks.map(row => [
    null, // plant_id (landrace n'est pas dans plants directement)
    row.molecule_id || null,
    null, // tabac_id
    'feuille',
    'headspace',
    null, null, null,
    row.concentration_ppm || null,
    'ppm',
    'gc_ms',
    null,
    null, null, null,
    'secondaire',
    0,
    'gcms_peaks',
    row.id,
    row.compound_name ? `[composé: ${row.compound_name}]` : null,
  ]);
  
  await conn.query(`
    INSERT INTO olfactive_emissions 
      (plant_id, molecule_id, tabac_id, plant_part, extraction_method,
       percentage, percentage_min, percentage_max, concentration_ppm, concentration_unit,
       analysis_method, analysis_source, geographic_origin,
       period_start, period_end, role, is_signature,
       source_table, source_id, notes)
    VALUES ?
  `, [values]);
  
  console.log(`  ✓ ${gcmsPeaks.length} lignes insérées depuis gcms_peaks`);
  totalInserted += gcmsPeaks.length;
}

// ─────────────────────────────────────────────────────────────────────────────
// RÉSUMÉ FINAL
// ─────────────────────────────────────────────────────────────────────────────
const [finalCount] = await conn.execute('SELECT COUNT(*) as n FROM olfactive_emissions');
console.log('\n=== RÉSUMÉ MIGRATION ===');
console.log(`  Total inséré cette session : ${totalInserted}`);
console.log(`  Total dans olfactive_emissions : ${finalCount[0].n}`);
console.log('\n  Répartition par source :');

const [bySource] = await conn.execute(`
  SELECT source_table, COUNT(*) as n 
  FROM olfactive_emissions 
  GROUP BY source_table 
  ORDER BY n DESC
`);
bySource.forEach(r => console.log(`    - ${r.source_table} : ${r.n}`));

const [withMolecule] = await conn.execute(
  'SELECT COUNT(*) as n FROM olfactive_emissions WHERE molecule_id IS NOT NULL'
);
const [withPercentage] = await conn.execute(
  'SELECT COUNT(*) as n FROM olfactive_emissions WHERE percentage IS NOT NULL'
);
console.log(`\n  Avec molecule_id : ${withMolecule[0].n}`);
console.log(`  Avec percentage  : ${withPercentage[0].n}`);

await conn.end();
console.log('\n✓ Migration terminée avec succès.');
