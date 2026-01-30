/**
 * AUDIT COMPLET DE LA BASE DE DONNÉES PERFUMUM
 * Script d'analyse des doublons, incohérences et statistiques
 */
import mysql from "mysql2/promise";
import fs from "fs";

const DATABASE_URL = process.env.DATABASE_URL;

async function main() {
  const connection = await mysql.createConnection(DATABASE_URL);
  const audit = {
    timestamp: new Date().toISOString(),
    tables: {},
    duplicates: {},
    orphans: {},
    statistics: {},
    issues: [],
    recommendations: []
  };

  console.log("╔══════════════════════════════════════════════════════════════╗");
  console.log("║           AUDIT COMPLET - BASE DE DONNÉES PERFUMUM           ║");
  console.log("╚══════════════════════════════════════════════════════════════╝\n");

  // ============================================================================
  // 1. STATISTIQUES GÉNÉRALES
  // ============================================================================
  console.log("═══ 1. STATISTIQUES GÉNÉRALES ═══\n");

  const tables = [
    "molecules", "plants", "terroirs", "recettes", "accords", "families",
    "prototypes", "civilisations", "tabacs", "leaf_economies", "terp_profiles",
    "final_recipes", "botanical_states", "raw_materials", "extraction_methods",
    "plant_varieties", "chemotypes", "molecule_plant_sources", "plant_terroirs",
    "molecules_recettes", "users", "user_favorites", "milestones"
  ];

  for (const table of tables) {
    try {
      const [rows] = await connection.execute(`SELECT COUNT(*) as count FROM ${table}`);
      audit.tables[table] = rows[0].count;
      console.log(`  ${table}: ${rows[0].count} entrées`);
    } catch (e) {
      audit.tables[table] = "TABLE_NOT_FOUND";
    }
  }

  // ============================================================================
  // 2. DOUBLONS DANS MOLECULES
  // ============================================================================
  console.log("\n═══ 2. DOUBLONS DANS MOLECULES ═══\n");

  // Doublons par nom exact
  const [molDuplicatesName] = await connection.execute(`
    SELECT name, COUNT(*) as count, GROUP_CONCAT(id) as ids
    FROM molecules 
    GROUP BY name 
    HAVING count > 1
    ORDER BY count DESC
    LIMIT 50
  `);
  
  audit.duplicates.molecules_by_name = molDuplicatesName;
  console.log(`  Doublons par nom exact: ${molDuplicatesName.length} groupes`);
  
  if (molDuplicatesName.length > 0) {
    console.log("\n  Top 10 doublons par nom:");
    molDuplicatesName.slice(0, 10).forEach(d => {
      console.log(`    - "${d.name}": ${d.count}x (IDs: ${d.ids})`);
    });
  }

  // Doublons par CAS number
  const [molDuplicatesCAS] = await connection.execute(`
    SELECT cas_number, COUNT(*) as count, GROUP_CONCAT(id) as ids, GROUP_CONCAT(name SEPARATOR ' | ') as names
    FROM molecules 
    WHERE cas_number IS NOT NULL AND cas_number != ''
    GROUP BY cas_number 
    HAVING count > 1
    ORDER BY count DESC
  `);
  
  audit.duplicates.molecules_by_cas = molDuplicatesCAS;
  console.log(`\n  Doublons par CAS number: ${molDuplicatesCAS.length} groupes`);
  
  if (molDuplicatesCAS.length > 0) {
    console.log("\n  Doublons CAS:");
    molDuplicatesCAS.forEach(d => {
      console.log(`    - CAS ${d.cas_number}: ${d.count}x (${d.names})`);
    });
  }

  // Molécules similaires (noms proches)
  const [molSimilar] = await connection.execute(`
    SELECT LOWER(REPLACE(REPLACE(REPLACE(name, '-', ''), 'α', 'alpha'), 'β', 'beta')) as normalized, 
           COUNT(*) as count, GROUP_CONCAT(id) as ids, GROUP_CONCAT(name SEPARATOR ' | ') as names
    FROM molecules 
    GROUP BY normalized
    HAVING count > 1
    ORDER BY count DESC
    LIMIT 30
  `);
  
  audit.duplicates.molecules_similar = molSimilar;
  console.log(`\n  Molécules avec noms similaires: ${molSimilar.length} groupes`);

  // ============================================================================
  // 3. DOUBLONS DANS PLANTS
  // ============================================================================
  console.log("\n═══ 3. DOUBLONS DANS PLANTS ═══\n");

  const [plantDuplicatesName] = await connection.execute(`
    SELECT name, COUNT(*) as count, GROUP_CONCAT(id) as ids
    FROM plants 
    GROUP BY name 
    HAVING count > 1
    ORDER BY count DESC
  `);
  
  audit.duplicates.plants_by_name = plantDuplicatesName;
  console.log(`  Doublons par nom: ${plantDuplicatesName.length} groupes`);
  
  if (plantDuplicatesName.length > 0) {
    plantDuplicatesName.forEach(d => {
      console.log(`    - "${d.name}": ${d.count}x (IDs: ${d.ids})`);
    });
  }

  const [plantDuplicatesLatin] = await connection.execute(`
    SELECT latin_name, COUNT(*) as count, GROUP_CONCAT(id) as ids, GROUP_CONCAT(name SEPARATOR ' | ') as names
    FROM plants 
    WHERE latin_name IS NOT NULL AND latin_name != ''
    GROUP BY latin_name 
    HAVING count > 1
    ORDER BY count DESC
  `);
  
  audit.duplicates.plants_by_latin = plantDuplicatesLatin;
  console.log(`\n  Doublons par nom latin: ${plantDuplicatesLatin.length} groupes`);

  // ============================================================================
  // 4. DOUBLONS DANS TERROIRS
  // ============================================================================
  console.log("\n═══ 4. DOUBLONS DANS TERROIRS ═══\n");

  const [terroirDuplicates] = await connection.execute(`
    SELECT name, COUNT(*) as count, GROUP_CONCAT(id) as ids, GROUP_CONCAT(terroir_id SEPARATOR ' | ') as terroir_ids
    FROM terroirs 
    GROUP BY name 
    HAVING count > 1
    ORDER BY count DESC
  `);
  
  audit.duplicates.terroirs_by_name = terroirDuplicates;
  console.log(`  Doublons par nom: ${terroirDuplicates.length} groupes`);

  // ============================================================================
  // 5. DONNÉES ORPHELINES
  // ============================================================================
  console.log("\n═══ 5. DONNÉES ORPHELINES ═══\n");

  // Molécules sans liaisons
  const [orphanMolecules] = await connection.execute(`
    SELECT COUNT(*) as count FROM molecules m
    WHERE NOT EXISTS (SELECT 1 FROM molecules_recettes mr WHERE mr.molecule_id = m.id)
    AND NOT EXISTS (SELECT 1 FROM molecule_plant_sources mps WHERE mps.molecule_id = m.id)
  `);
  audit.orphans.molecules_without_links = orphanMolecules[0].count;
  console.log(`  Molécules sans liaisons (recettes ou plantes): ${orphanMolecules[0].count}`);

  // Plantes sans liaisons
  const [orphanPlants] = await connection.execute(`
    SELECT COUNT(*) as count FROM plants p
    WHERE NOT EXISTS (SELECT 1 FROM molecule_plant_sources mps WHERE mps.plant_id = p.id)
    AND NOT EXISTS (SELECT 1 FROM plant_terroirs pt WHERE pt.plant_id = p.id)
  `);
  audit.orphans.plants_without_links = orphanPlants[0].count;
  console.log(`  Plantes sans liaisons (molécules ou terroirs): ${orphanPlants[0].count}`);

  // Terroirs sans plantes
  const [orphanTerroirs] = await connection.execute(`
    SELECT COUNT(*) as count FROM terroirs t
    WHERE NOT EXISTS (SELECT 1 FROM plant_terroirs pt WHERE pt.terroir_id = t.id)
  `);
  audit.orphans.terroirs_without_plants = orphanTerroirs[0].count;
  console.log(`  Terroirs sans plantes liées: ${orphanTerroirs[0].count}`);

  // ============================================================================
  // 6. QUALITÉ DES DONNÉES
  // ============================================================================
  console.log("\n═══ 6. QUALITÉ DES DONNÉES ═══\n");

  // Molécules avec données scientifiques complètes
  const [molComplete] = await connection.execute(`
    SELECT 
      COUNT(*) as total,
      SUM(CASE WHEN cas_number IS NOT NULL AND cas_number != '' THEN 1 ELSE 0 END) as with_cas,
      SUM(CASE WHEN iupac_name IS NOT NULL AND iupac_name != '' THEN 1 ELSE 0 END) as with_iupac,
      SUM(CASE WHEN chemical_class IS NOT NULL THEN 1 ELSE 0 END) as with_class,
      SUM(CASE WHEN chemicalFormula IS NOT NULL AND chemicalFormula != '' THEN 1 ELSE 0 END) as with_formula,
      SUM(CASE WHEN molecularWeight IS NOT NULL THEN 1 ELSE 0 END) as with_weight,
      SUM(CASE WHEN olfactiveProfile IS NOT NULL AND olfactiveProfile != '' THEN 1 ELSE 0 END) as with_olfactive
    FROM molecules
  `);
  
  audit.statistics.molecules_quality = molComplete[0];
  const total = molComplete[0].total;
  console.log(`  Molécules totales: ${total}`);
  console.log(`    - Avec CAS number: ${molComplete[0].with_cas} (${Math.round(molComplete[0].with_cas/total*100)}%)`);
  console.log(`    - Avec nom IUPAC: ${molComplete[0].with_iupac} (${Math.round(molComplete[0].with_iupac/total*100)}%)`);
  console.log(`    - Avec classe chimique: ${molComplete[0].with_class} (${Math.round(molComplete[0].with_class/total*100)}%)`);
  console.log(`    - Avec formule: ${molComplete[0].with_formula} (${Math.round(molComplete[0].with_formula/total*100)}%)`);
  console.log(`    - Avec poids moléculaire: ${molComplete[0].with_weight} (${Math.round(molComplete[0].with_weight/total*100)}%)`);
  console.log(`    - Avec profil olfactif: ${molComplete[0].with_olfactive} (${Math.round(molComplete[0].with_olfactive/total*100)}%)`);

  // Plantes avec données complètes
  const [plantComplete] = await connection.execute(`
    SELECT 
      COUNT(*) as total,
      SUM(CASE WHEN latin_name IS NOT NULL AND latin_name != '' THEN 1 ELSE 0 END) as with_latin,
      SUM(CASE WHEN family IS NOT NULL AND family != '' THEN 1 ELSE 0 END) as with_family,
      SUM(CASE WHEN origin IS NOT NULL AND origin != '' THEN 1 ELSE 0 END) as with_origin,
      SUM(CASE WHEN olfactive_signature IS NOT NULL AND olfactive_signature != '' THEN 1 ELSE 0 END) as with_olfactive,
      SUM(CASE WHEN traditional_use IS NOT NULL AND traditional_use != '' THEN 1 ELSE 0 END) as with_traditional
    FROM plants
  `);
  
  audit.statistics.plants_quality = plantComplete[0];
  const totalPlants = plantComplete[0].total;
  console.log(`\n  Plantes totales: ${totalPlants}`);
  console.log(`    - Avec nom latin: ${plantComplete[0].with_latin} (${Math.round(plantComplete[0].with_latin/totalPlants*100)}%)`);
  console.log(`    - Avec famille: ${plantComplete[0].with_family} (${Math.round(plantComplete[0].with_family/totalPlants*100)}%)`);
  console.log(`    - Avec origine: ${plantComplete[0].with_origin} (${Math.round(plantComplete[0].with_origin/totalPlants*100)}%)`);
  console.log(`    - Avec signature olfactive: ${plantComplete[0].with_olfactive} (${Math.round(plantComplete[0].with_olfactive/totalPlants*100)}%)`);
  console.log(`    - Avec usage traditionnel: ${plantComplete[0].with_traditional} (${Math.round(plantComplete[0].with_traditional/totalPlants*100)}%)`);

  // ============================================================================
  // 7. LIAISONS ET RELATIONS
  // ============================================================================
  console.log("\n═══ 7. LIAISONS ET RELATIONS ═══\n");

  const [linkStats] = await connection.execute(`
    SELECT 
      (SELECT COUNT(*) FROM molecules_recettes) as mol_recettes,
      (SELECT COUNT(*) FROM molecule_plant_sources) as mol_plants,
      (SELECT COUNT(*) FROM plant_terroirs) as plant_terroirs,
      (SELECT COUNT(DISTINCT molecule_id) FROM molecules_recettes) as unique_mol_in_recettes,
      (SELECT COUNT(DISTINCT molecule_id) FROM molecule_plant_sources) as unique_mol_with_plants
  `);
  
  audit.statistics.links = linkStats[0];
  console.log(`  Liaisons molécules-recettes: ${linkStats[0].mol_recettes}`);
  console.log(`  Liaisons molécules-plantes: ${linkStats[0].mol_plants}`);
  console.log(`  Liaisons plantes-terroirs: ${linkStats[0].plant_terroirs}`);
  console.log(`  Molécules uniques dans recettes: ${linkStats[0].unique_mol_in_recettes}`);
  console.log(`  Molécules uniques avec sources botaniques: ${linkStats[0].unique_mol_with_plants}`);

  // ============================================================================
  // 8. ANALYSE DES DOUBLONS À NETTOYER
  // ============================================================================
  console.log("\n═══ 8. DOUBLONS À NETTOYER (DÉTAIL) ═══\n");

  // Détail des doublons molécules les plus problématiques
  const [detailedDuplicates] = await connection.execute(`
    SELECT m1.id, m1.name, m1.cas_number, m1.chemical_class, m1.chemicalFormula,
           LENGTH(COALESCE(m1.olfactiveProfile, '')) + LENGTH(COALESCE(m1.notes, '')) as data_richness
    FROM molecules m1
    WHERE m1.name IN (
      SELECT name FROM molecules GROUP BY name HAVING COUNT(*) > 1
    )
    ORDER BY m1.name, data_richness DESC
    LIMIT 100
  `);

  // Grouper par nom pour analyse
  const duplicateGroups = {};
  detailedDuplicates.forEach(row => {
    if (!duplicateGroups[row.name]) {
      duplicateGroups[row.name] = [];
    }
    duplicateGroups[row.name].push(row);
  });

  audit.duplicates.detailed_molecules = duplicateGroups;
  console.log(`  Groupes de doublons analysés: ${Object.keys(duplicateGroups).length}`);

  // ============================================================================
  // 9. RÉSUMÉ ET RECOMMANDATIONS
  // ============================================================================
  console.log("\n╔══════════════════════════════════════════════════════════════╗");
  console.log("║                    RÉSUMÉ DE L'AUDIT                         ║");
  console.log("╚══════════════════════════════════════════════════════════════╝\n");

  const totalDuplicateMolecules = molDuplicatesName.reduce((sum, d) => sum + d.count - 1, 0);
  const totalDuplicatePlants = plantDuplicatesName.reduce((sum, d) => sum + d.count - 1, 0);

  console.log(`  DOUBLONS À NETTOYER:`);
  console.log(`    - Molécules en double: ~${totalDuplicateMolecules} entrées à fusionner`);
  console.log(`    - Plantes en double: ~${totalDuplicatePlants} entrées à fusionner`);
  console.log(`    - Terroirs en double: ${terroirDuplicates.length} groupes`);
  
  console.log(`\n  DONNÉES ORPHELINES:`);
  console.log(`    - Molécules isolées: ${orphanMolecules[0].count}`);
  console.log(`    - Plantes isolées: ${orphanPlants[0].count}`);
  console.log(`    - Terroirs sans plantes: ${orphanTerroirs[0].count}`);

  console.log(`\n  QUALITÉ GLOBALE:`);
  const molQuality = Math.round((molComplete[0].with_cas + molComplete[0].with_formula + molComplete[0].with_olfactive) / (total * 3) * 100);
  const plantQuality = Math.round((plantComplete[0].with_latin + plantComplete[0].with_family + plantComplete[0].with_origin) / (totalPlants * 3) * 100);
  console.log(`    - Score qualité molécules: ${molQuality}%`);
  console.log(`    - Score qualité plantes: ${plantQuality}%`);

  // Sauvegarder le rapport
  fs.writeFileSync('/home/ubuntu/perfumum-research/audit-database-report.json', JSON.stringify(audit, null, 2));
  console.log("\n  Rapport détaillé sauvegardé: audit-database-report.json");

  await connection.end();
}

main().catch(console.error);
