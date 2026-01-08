/**
 * NETTOYAGE DES DOUBLONS V2 - BASE DE DONNÉES PERFUMUM
 * Gère toutes les contraintes de clés étrangères
 */
import mysql from "mysql2/promise";

const DATABASE_URL = process.env.DATABASE_URL;

async function cleanMoleculeReferences(connection, deleteIds, keepId) {
  // Liste de toutes les tables qui référencent molecules
  const refTables = [
    { table: 'molecules_recettes', column: 'molecule_id' },
    { table: 'molecule_plant_sources', column: 'molecule_id' },
    { table: 'molecule_notes', column: 'molecule_id' },
    { table: 'user_favorites', column: 'molecule_id' },
    { table: 'raw_material_molecules', column: 'molecule_id' },
    { table: 'terp_profile_molecules', column: 'terp_profile_id' }, // Non applicable
    { table: 'chemotypes', column: 'dominant_molecule_id' },
  ];

  for (const deleteId of deleteIds) {
    // Transférer ou supprimer les références
    for (const ref of refTables) {
      try {
        // D'abord essayer de transférer
        await connection.execute(
          `UPDATE IGNORE ${ref.table} SET ${ref.column} = ? WHERE ${ref.column} = ?`,
          [keepId, deleteId]
        );
        // Puis supprimer les doublons restants
        await connection.execute(
          `DELETE FROM ${ref.table} WHERE ${ref.column} = ?`,
          [deleteId]
        );
      } catch (e) {
        // Table n'existe pas ou autre erreur, ignorer
      }
    }
  }
}

async function cleanPlantReferences(connection, deleteIds, keepId) {
  const refTables = [
    { table: 'molecule_plant_sources', column: 'plant_id' },
    { table: 'plant_terroirs', column: 'plant_id' },
    { table: 'plant_varieties', column: 'plant_id' },
    { table: 'botanical_states', column: 'plant_id' },
    { table: 'plant_extractions', column: 'plant_id' },
    { table: 'raw_materials', column: 'plant_id' },
    { table: 'terp_profile_plants', column: 'plant_id' },
    { table: 'plant_molecules', column: 'plant_id' },
    { table: 'chemotypes', column: 'plant_id' },
    { table: 'plant_geographic_zones', column: 'plant_id' },
    { table: 'sustainable_alternatives', column: 'threatened_plant_id' },
    { table: 'sustainable_alternatives', column: 'alternative_plant_id' },
  ];

  for (const deleteId of deleteIds) {
    for (const ref of refTables) {
      try {
        await connection.execute(
          `UPDATE IGNORE ${ref.table} SET ${ref.column} = ? WHERE ${ref.column} = ?`,
          [keepId, deleteId]
        );
        await connection.execute(
          `DELETE FROM ${ref.table} WHERE ${ref.column} = ?`,
          [deleteId]
        );
      } catch (e) {
        // Ignorer les erreurs
      }
    }
  }
}

async function main() {
  const connection = await mysql.createConnection(DATABASE_URL);
  
  console.log("╔══════════════════════════════════════════════════════════════╗");
  console.log("║           NETTOYAGE DES DOUBLONS V2 - PERFUMUM               ║");
  console.log("╚══════════════════════════════════════════════════════════════╝\n");

  // Statistiques initiales
  const [initialStats] = await connection.execute(`
    SELECT 
      (SELECT COUNT(*) FROM molecules) as molecules,
      (SELECT COUNT(*) FROM plants) as plants
  `);
  console.log(`  État initial: ${initialStats[0].molecules} molécules, ${initialStats[0].plants} plantes\n`);

  // ============================================================================
  // 1. NETTOYAGE DES MOLÉCULES PAR CAS NUMBER
  // ============================================================================
  console.log("═══ 1. FUSION DES MOLÉCULES PAR CAS NUMBER ═══\n");

  const [casDuplicates] = await connection.execute(`
    SELECT cas_number, GROUP_CONCAT(id ORDER BY 
      (CASE WHEN iupac_name IS NOT NULL AND iupac_name != '' THEN 100 ELSE 0 END) +
      (CASE WHEN chemicalFormula IS NOT NULL AND chemicalFormula != '' THEN 50 ELSE 0 END) +
      (CASE WHEN molecularWeight IS NOT NULL THEN 25 ELSE 0 END) +
      LENGTH(COALESCE(olfactiveProfile, ''))
    DESC) as ids
    FROM molecules 
    WHERE cas_number IS NOT NULL AND cas_number != ''
    GROUP BY cas_number 
    HAVING COUNT(*) > 1
  `);

  let deletedMolecules = 0;

  for (const group of casDuplicates) {
    const ids = group.ids.split(',').map(Number);
    const keepId = ids[0];
    const deleteIds = ids.slice(1);

    console.log(`  CAS ${group.cas_number}: garder ID ${keepId}, supprimer ${deleteIds.length} doublon(s)`);

    await cleanMoleculeReferences(connection, deleteIds, keepId);

    // Supprimer les doublons
    try {
      await connection.execute(
        `DELETE FROM molecules WHERE id IN (${deleteIds.join(',')})`,
        []
      );
      deletedMolecules += deleteIds.length;
    } catch (e) {
      console.log(`    ⚠ Impossible de supprimer: ${e.message.substring(0, 50)}...`);
    }
  }

  console.log(`\n  ✓ ${deletedMolecules} molécules supprimées (doublons CAS)\n`);

  // ============================================================================
  // 2. NETTOYAGE DES MOLÉCULES PAR NOM NORMALISÉ
  // ============================================================================
  console.log("═══ 2. FUSION DES MOLÉCULES PAR NOM SIMILAIRE ═══\n");

  const [nameDuplicates] = await connection.execute(`
    SELECT 
      LOWER(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(name, 'α', 'alpha'), 'β', 'beta'), '-', ''), ' ', ''), 'é', 'e')) as normalized,
      GROUP_CONCAT(id ORDER BY 
        (CASE WHEN cas_number IS NOT NULL AND cas_number != '' THEN 1000 ELSE 0 END) +
        (CASE WHEN iupac_name IS NOT NULL THEN 100 ELSE 0 END) +
        LENGTH(COALESCE(olfactiveProfile, ''))
      DESC) as ids,
      GROUP_CONCAT(name SEPARATOR ' | ') as names
    FROM molecules 
    GROUP BY normalized
    HAVING COUNT(*) > 1
    LIMIT 50
  `);

  let deletedByName = 0;

  for (const group of nameDuplicates) {
    const ids = group.ids.split(',').map(Number);
    if (ids.length <= 1) continue;

    const keepId = ids[0];
    const deleteIds = ids.slice(1);

    const shortName = group.names.split(' | ')[0].substring(0, 30);
    console.log(`  "${shortName}...": garder ID ${keepId}, supprimer ${deleteIds.length}`);

    await cleanMoleculeReferences(connection, deleteIds, keepId);

    try {
      await connection.execute(
        `DELETE FROM molecules WHERE id IN (${deleteIds.join(',')})`,
        []
      );
      deletedByName += deleteIds.length;
    } catch (e) {
      console.log(`    ⚠ Erreur: ${e.message.substring(0, 40)}...`);
    }
  }

  console.log(`\n  ✓ ${deletedByName} molécules supprimées (doublons nom)\n`);

  // ============================================================================
  // 3. NETTOYAGE DES PLANTES
  // ============================================================================
  console.log("═══ 3. FUSION DES PLANTES EN DOUBLE ═══\n");

  const [plantDuplicates] = await connection.execute(`
    SELECT name, GROUP_CONCAT(id ORDER BY 
      (CASE WHEN latin_name IS NOT NULL AND latin_name != '' THEN 100 ELSE 0 END) +
      LENGTH(COALESCE(olfactive_signature, '')) +
      LENGTH(COALESCE(traditional_use, ''))
    DESC) as ids
    FROM plants 
    GROUP BY name 
    HAVING COUNT(*) > 1
  `);

  let deletedPlants = 0;

  for (const group of plantDuplicates) {
    const ids = group.ids.split(',').map(Number);
    const keepId = ids[0];
    const deleteIds = ids.slice(1);

    console.log(`  "${group.name}": garder ID ${keepId}, supprimer ${deleteIds.length}`);

    await cleanPlantReferences(connection, deleteIds, keepId);

    try {
      await connection.execute(
        `DELETE FROM plants WHERE id IN (${deleteIds.join(',')})`,
        []
      );
      deletedPlants += deleteIds.length;
    } catch (e) {
      console.log(`    ⚠ Erreur: ${e.message.substring(0, 40)}...`);
    }
  }

  console.log(`\n  ✓ ${deletedPlants} plantes supprimées\n`);

  // ============================================================================
  // 4. STATISTIQUES FINALES
  // ============================================================================
  console.log("═══ 4. STATISTIQUES APRÈS NETTOYAGE ═══\n");

  const [finalStats] = await connection.execute(`
    SELECT 
      (SELECT COUNT(*) FROM molecules) as molecules,
      (SELECT COUNT(*) FROM plants) as plants,
      (SELECT COUNT(*) FROM terroirs) as terroirs
  `);

  console.log(`  Molécules: ${initialStats[0].molecules} → ${finalStats[0].molecules} (-${initialStats[0].molecules - finalStats[0].molecules})`);
  console.log(`  Plantes: ${initialStats[0].plants} → ${finalStats[0].plants} (-${initialStats[0].plants - finalStats[0].plants})`);
  console.log(`  Terroirs: ${finalStats[0].terroirs}`);

  console.log("\n╔══════════════════════════════════════════════════════════════╗");
  console.log("║                    NETTOYAGE TERMINÉ                         ║");
  console.log("╚══════════════════════════════════════════════════════════════╝\n");

  await connection.end();
}

main().catch(console.error);
