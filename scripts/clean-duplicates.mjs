/**
 * NETTOYAGE DES DOUBLONS - BASE DE DONNÉES PERFUMUM
 * Ce script identifie et fusionne les doublons en préservant les données les plus complètes
 */
import mysql from "mysql2/promise";

const DATABASE_URL = process.env.DATABASE_URL;

async function main() {
  const connection = await mysql.createConnection(DATABASE_URL);
  
  console.log("╔══════════════════════════════════════════════════════════════╗");
  console.log("║           NETTOYAGE DES DOUBLONS - PERFUMUM                  ║");
  console.log("╚══════════════════════════════════════════════════════════════╝\n");

  // ============================================================================
  // 1. NETTOYAGE DES MOLÉCULES PAR CAS NUMBER
  // ============================================================================
  console.log("═══ 1. FUSION DES MOLÉCULES PAR CAS NUMBER ═══\n");

  // Récupérer les groupes de doublons par CAS
  const [casDuplicates] = await connection.execute(`
    SELECT cas_number, GROUP_CONCAT(id ORDER BY 
      (CASE WHEN iupac_name IS NOT NULL THEN 1 ELSE 0 END) +
      (CASE WHEN chemicalFormula IS NOT NULL THEN 1 ELSE 0 END) +
      (CASE WHEN molecularWeight IS NOT NULL THEN 1 ELSE 0 END) +
      LENGTH(COALESCE(olfactiveProfile, '')) +
      LENGTH(COALESCE(notes, ''))
    DESC) as ids
    FROM molecules 
    WHERE cas_number IS NOT NULL AND cas_number != ''
    GROUP BY cas_number 
    HAVING COUNT(*) > 1
  `);

  let mergedCount = 0;
  let deletedCount = 0;

  for (const group of casDuplicates) {
    const ids = group.ids.split(',').map(Number);
    const keepId = ids[0]; // Le premier a le plus de données
    const deleteIds = ids.slice(1);

    console.log(`  CAS ${group.cas_number}: garder ID ${keepId}, supprimer IDs ${deleteIds.join(', ')}`);

    // Transférer les liaisons molecules_recettes vers l'ID conservé
    for (const deleteId of deleteIds) {
      // Vérifier si des liaisons existent pour l'ID à supprimer
      const [existingLinks] = await connection.execute(
        `SELECT recette_id FROM molecules_recettes WHERE molecule_id = ?`,
        [deleteId]
      );

      for (const link of existingLinks) {
        // Vérifier si la liaison existe déjà pour l'ID conservé
        const [existing] = await connection.execute(
          `SELECT id FROM molecules_recettes WHERE molecule_id = ? AND recette_id = ?`,
          [keepId, link.recette_id]
        );

        if (existing.length === 0) {
          // Transférer la liaison
          await connection.execute(
            `UPDATE molecules_recettes SET molecule_id = ? WHERE molecule_id = ? AND recette_id = ?`,
            [keepId, deleteId, link.recette_id]
          );
        }
      }

      // Supprimer les liaisons restantes (doublons)
      await connection.execute(
        `DELETE FROM molecules_recettes WHERE molecule_id = ?`,
        [deleteId]
      );

      // Transférer molecule_plant_sources
      await connection.execute(
        `UPDATE molecule_plant_sources SET molecule_id = ? WHERE molecule_id = ?`,
        [keepId, deleteId]
      );
    }

    // Supprimer les doublons
    await connection.execute(
      `DELETE FROM molecules WHERE id IN (${deleteIds.join(',')})`,
      []
    );

    deletedCount += deleteIds.length;
    mergedCount++;
  }

  console.log(`\n  ✓ ${mergedCount} groupes fusionnés, ${deletedCount} doublons supprimés\n`);

  // ============================================================================
  // 2. NETTOYAGE DES MOLÉCULES PAR NOM NORMALISÉ
  // ============================================================================
  console.log("═══ 2. FUSION DES MOLÉCULES PAR NOM SIMILAIRE ═══\n");

  // Normaliser les noms (alpha/α, beta/β, etc.)
  const [nameDuplicates] = await connection.execute(`
    SELECT 
      LOWER(REPLACE(REPLACE(REPLACE(REPLACE(name, 'α', 'alpha'), 'β', 'beta'), '-', ''), ' ', '')) as normalized,
      GROUP_CONCAT(id ORDER BY 
        (CASE WHEN cas_number IS NOT NULL THEN 100 ELSE 0 END) +
        (CASE WHEN iupac_name IS NOT NULL THEN 50 ELSE 0 END) +
        LENGTH(COALESCE(olfactiveProfile, ''))
      DESC) as ids,
      GROUP_CONCAT(name SEPARATOR ' | ') as names
    FROM molecules 
    WHERE cas_number IS NULL OR cas_number = ''
    GROUP BY normalized
    HAVING COUNT(*) > 1
    LIMIT 30
  `);

  let namesMerged = 0;
  let namesDeleted = 0;

  for (const group of nameDuplicates) {
    const ids = group.ids.split(',').map(Number);
    if (ids.length <= 1) continue;

    const keepId = ids[0];
    const deleteIds = ids.slice(1);

    console.log(`  "${group.names.split(' | ')[0]}": garder ID ${keepId}, supprimer ${deleteIds.length} doublon(s)`);

    // Transférer les liaisons
    for (const deleteId of deleteIds) {
      await connection.execute(
        `UPDATE molecules_recettes SET molecule_id = ? WHERE molecule_id = ? 
         AND NOT EXISTS (SELECT 1 FROM (SELECT * FROM molecules_recettes) as mr WHERE mr.molecule_id = ? AND mr.recette_id = molecules_recettes.recette_id)`,
        [keepId, deleteId, keepId]
      );
      await connection.execute(
        `DELETE FROM molecules_recettes WHERE molecule_id = ?`,
        [deleteId]
      );
      await connection.execute(
        `UPDATE molecule_plant_sources SET molecule_id = ? WHERE molecule_id = ?`,
        [keepId, deleteId]
      );
    }

    // Supprimer les doublons
    await connection.execute(
      `DELETE FROM molecules WHERE id IN (${deleteIds.join(',')})`,
      []
    );

    namesDeleted += deleteIds.length;
    namesMerged++;
  }

  console.log(`\n  ✓ ${namesMerged} groupes fusionnés, ${namesDeleted} doublons supprimés\n`);

  // ============================================================================
  // 3. NETTOYAGE DES PLANTES
  // ============================================================================
  console.log("═══ 3. FUSION DES PLANTES EN DOUBLE ═══\n");

  const [plantDuplicates] = await connection.execute(`
    SELECT name, GROUP_CONCAT(id ORDER BY 
      (CASE WHEN latin_name IS NOT NULL THEN 100 ELSE 0 END) +
      LENGTH(COALESCE(olfactive_signature, '')) +
      LENGTH(COALESCE(traditional_use, ''))
    DESC) as ids
    FROM plants 
    GROUP BY name 
    HAVING COUNT(*) > 1
  `);

  let plantsMerged = 0;
  let plantsDeleted = 0;

  for (const group of plantDuplicates) {
    const ids = group.ids.split(',').map(Number);
    const keepId = ids[0];
    const deleteIds = ids.slice(1);

    console.log(`  "${group.name}": garder ID ${keepId}, supprimer IDs ${deleteIds.join(', ')}`);

    for (const deleteId of deleteIds) {
      // Transférer les liaisons
      await connection.execute(
        `UPDATE molecule_plant_sources SET plant_id = ? WHERE plant_id = ?`,
        [keepId, deleteId]
      );
      await connection.execute(
        `UPDATE plant_terroirs SET plant_id = ? WHERE plant_id = ? 
         AND NOT EXISTS (SELECT 1 FROM (SELECT * FROM plant_terroirs) as pt WHERE pt.plant_id = ? AND pt.terroir_id = plant_terroirs.terroir_id)`,
        [keepId, deleteId, keepId]
      );
      await connection.execute(
        `DELETE FROM plant_terroirs WHERE plant_id = ?`,
        [deleteId]
      );
    }

    // Supprimer les doublons
    await connection.execute(
      `DELETE FROM plants WHERE id IN (${deleteIds.join(',')})`,
      []
    );

    plantsDeleted += deleteIds.length;
    plantsMerged++;
  }

  console.log(`\n  ✓ ${plantsMerged} groupes fusionnés, ${plantsDeleted} doublons supprimés\n`);

  // ============================================================================
  // 4. STATISTIQUES FINALES
  // ============================================================================
  console.log("═══ 4. STATISTIQUES APRÈS NETTOYAGE ═══\n");

  const [finalStats] = await connection.execute(`
    SELECT 
      (SELECT COUNT(*) FROM molecules) as molecules,
      (SELECT COUNT(*) FROM plants) as plants,
      (SELECT COUNT(*) FROM terroirs) as terroirs,
      (SELECT COUNT(*) FROM molecules_recettes) as mol_recettes_links,
      (SELECT COUNT(*) FROM molecule_plant_sources) as mol_plant_links
  `);

  console.log(`  Molécules: ${finalStats[0].molecules}`);
  console.log(`  Plantes: ${finalStats[0].plants}`);
  console.log(`  Terroirs: ${finalStats[0].terroirs}`);
  console.log(`  Liaisons molécules-recettes: ${finalStats[0].mol_recettes_links}`);
  console.log(`  Liaisons molécules-plantes: ${finalStats[0].mol_plant_links}`);

  console.log("\n╔══════════════════════════════════════════════════════════════╗");
  console.log("║                    NETTOYAGE TERMINÉ                         ║");
  console.log("╚══════════════════════════════════════════════════════════════╝\n");

  console.log(`  Total supprimé: ${deletedCount + namesDeleted + plantsDeleted} entrées`);
  console.log(`  Total fusionné: ${mergedCount + namesMerged + plantsMerged} groupes`);

  await connection.end();
}

main().catch(console.error);
