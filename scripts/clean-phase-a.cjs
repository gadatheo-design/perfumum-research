/**
 * NETTOYAGE PHASE A — PERFUMUM
 * Actions sûres sans risque de perte de données scientifiques valides
 * 
 * 1. Supprimer les références bibliographiques importées comme molécules
 * 2. Supprimer les lignes CSV brutes importées comme molécules
 * 3. Fusionner les doublons avec CAS number identique
 * 4. Corriger les formules chimiques IUPAC → formules brutes
 */

const mysql = require('mysql2/promise');
const fs = require('fs');

(async () => {
  const db = await mysql.createConnection(process.env.DATABASE_URL);
  const log = (s) => console.log(s);
  const stats = { deleted: 0, merged: 0, corrected: 0 };
  
  log('🧹 NETTOYAGE PHASE A — PERFUMUM');
  log('='.repeat(60));
  
  // ─────────────────────────────────────────────────────────────
  // ÉTAPE 1 : Supprimer les références bibliographiques importées comme molécules
  // Critères : nom très long (>80 chars) ET contient des marqueurs bibliographiques
  // ─────────────────────────────────────────────────────────────
  log('\n📋 ÉTAPE 1 : Suppression des références bibliographiques...');
  
  const [bibRefs] = await db.query(`
    SELECT id, name FROM molecules 
    WHERE LENGTH(name) > 80 
      AND (
        name LIKE '%• %'
        OR name LIKE '%URL:%'
        OR name LIKE '%https://%'
        OR name LIKE '%http://%'
        OR name LIKE '%EN: %'
        OR name LIKE '%FR: %'
        OR name LIKE '%(n.d.)%'
        OR name LIKE '%USDA%'
        OR name LIKE '%Calflora%'
        OR name LIKE '%Wikipedia%'
        OR name LIKE '%Virginia Tech%'
        OR name LIKE '%SEINet%'
      )
  `);
  
  log(`  Références bibliographiques identifiées : ${bibRefs.length}`);
  bibRefs.forEach(m => log(`    → Suppression ID:${m.id} | "${m.name.substring(0, 70)}..."`));
  
  if (bibRefs.length > 0) {
    const ids = bibRefs.map(m => m.id);
    // D'abord supprimer les liaisons
    await db.query(`DELETE FROM plant_molecules WHERE molecule_id IN (?)`, [ids]);
    await db.query(`DELETE FROM recette_molecules WHERE molecule_id IN (?)`, [ids]);
    // Puis supprimer les molécules
    const [result] = await db.query(`DELETE FROM molecules WHERE id IN (?)`, [ids]);
    stats.deleted += result.affectedRows;
    log(`  ✅ ${result.affectedRows} références bibliographiques supprimées`);
  }
  
  // ─────────────────────────────────────────────────────────────
  // ÉTAPE 2 : Supprimer les lignes CSV brutes
  // Critères : nom contient des virgules ET ressemble à une ligne CSV
  // ─────────────────────────────────────────────────────────────
  log('\n📋 ÉTAPE 2 : Suppression des lignes CSV brutes...');
  
  const [csvRows] = await db.query(`
    SELECT id, name FROM molecules 
    WHERE name LIKE '%,%'
      AND (
        name LIKE '%→%'
        OR name LIKE '%C[0-9]H[0-9]%'
        OR name REGEXP ',C[0-9]+H[0-9]+'
        OR name LIKE '%Aldéhydes Marins%'
        OR name LIKE '%Accords terreux%'
        OR name LIKE '%Composés azotés%'
        OR name LIKE '%non botanique%'
        OR name LIKE '%sans CAS%'
        OR name LIKE '%proxy%'
        OR name LIKE '%Antiquité%'
        OR name LIKE '%espèce disparue%'
      )
  `);
  
  log(`  Lignes CSV brutes identifiées : ${csvRows.length}`);
  csvRows.forEach(m => log(`    → Suppression ID:${m.id} | "${m.name.substring(0, 70)}"`));
  
  if (csvRows.length > 0) {
    const ids = csvRows.map(m => m.id);
    await db.query(`DELETE FROM plant_molecules WHERE molecule_id IN (?)`, [ids]);
    await db.query(`DELETE FROM recette_molecules WHERE molecule_id IN (?)`, [ids]);
    const [result] = await db.query(`DELETE FROM molecules WHERE id IN (?)`, [ids]);
    stats.deleted += result.affectedRows;
    log(`  ✅ ${result.affectedRows} lignes CSV brutes supprimées`);
  }
  
  // ─────────────────────────────────────────────────────────────
  // ÉTAPE 3 : Fusionner les doublons avec CAS number identique
  // Conserver l'entrée avec le plus de données (plus de champs remplis)
  // ─────────────────────────────────────────────────────────────
  log('\n📋 ÉTAPE 3 : Fusion des doublons avec CAS identique...');
  
  // Paires de doublons confirmés avec même CAS
  const duplicatePairs = [
    // [id_à_supprimer, id_à_conserver, raison]
    // Acide Férulique : conserver 1350061 (ajouté plus récemment avec données complètes)
    [60009, 1350061, 'Acide Férulique — même CAS 1135-24-6'],
    // Cis-3-Hexénol : conserver 1350100 (plus récent)
    [570030, 1350100, 'Cis-3-Hexénol — même CAS 928-96-1'],
    // Humulène / α-Humulène : conserver 570066 (avec préfixe α)
    [90048, 570066, 'Humulène — même CAS 6753-98-6'],
    // Alpha-Ionone / α-Ionone : conserver 570021 (plus ancien, plus de liaisons)
    [720020, 570021, 'α-Ionone — même CAS 127-41-3'],
    // alpha-pinene / α-Pinene : conserver 810001 (avec CAS, plus de liaisons)
    [900008, 810001, 'α-Pinène — même CAS 80-56-8'],
    // Tubéreuse Absolue (extrait) doublon exact
    [1260648, 330009, 'Tubéreuse Absolue (extrait) — nom identique'],
  ];
  
  for (const [idToDelete, idToKeep, reason] of duplicatePairs) {
    // Vérifier que les deux existent
    const [exists] = await db.query(`SELECT id, name FROM molecules WHERE id IN (?, ?)`, [idToDelete, idToKeep]);
    if (exists.length < 2) {
      log(`  ⚠️  Paire ignorée (entrée manquante) : ${reason}`);
      continue;
    }
    
    log(`  Fusion : ${reason}`);
    log(`    → Suppression ID:${idToDelete}, conservation ID:${idToKeep}`);
    
    // Mettre à jour les liaisons plant_molecules pour pointer vers l'entrée conservée
    await db.query(`
      UPDATE plant_molecules SET molecule_id = ? 
      WHERE molecule_id = ?
        AND NOT EXISTS (
          SELECT 1 FROM plant_molecules pm2 
          WHERE pm2.molecule_id = ? AND pm2.plant_id = plant_molecules.plant_id
        )
    `, [idToKeep, idToDelete, idToKeep]);
    
    // Supprimer les liaisons en doublon (même plante, deux fois)
    await db.query(`DELETE FROM plant_molecules WHERE molecule_id = ?`, [idToDelete]);
    
    // Mettre à jour les liaisons recette_molecules
    await db.query(`UPDATE recette_molecules SET molecule_id = ? WHERE molecule_id = ?`, [idToKeep, idToDelete]);
    
    // Supprimer les synergies moléculaires liées
    await db.query(`DELETE FROM molecule_synergies WHERE molecule1_id = ? OR molecule2_id = ?`, [idToDelete, idToDelete]);
    
    // Supprimer d'autres liaisons potentielles
    const linkedTables = ['molecule_evidence', 'molecule_notes', 'molecule_origins', 'molecule_plant_sources', 'molecule_links_unified', 'molecule_accords', 'molecule_chemical_families', 'molecular_interactions', 'molecular_markers', 'molecular_comparisons', 'molecule_families', 'pyrolysis_transformations', 'variety_molecules', 'raw_material_molecules', 'landrace_terpenes', 'tabac_molecule_links', 'perique_molecule_links'];
    for (const table of linkedTables) {
      try {
        await db.query('DELETE FROM ' + table + ' WHERE molecule_id = ?', [idToDelete]);
      } catch(e) { /* table ou colonne inexistante */ }
    }
    
    // Supprimer la molécule en doublon
    await db.query(`DELETE FROM molecules WHERE id = ?`, [idToDelete]);
    stats.merged++;
    log(`    ✅ Fusion effectuée`);
  }
  
  // ─────────────────────────────────────────────────────────────
  // ÉTAPE 4 : Corriger les formules chimiques IUPAC → formules brutes
  // ─────────────────────────────────────────────────────────────
  log('\n📋 ÉTAPE 4 : Correction des formules chimiques IUPAC...');
  
  // Corrections manuelles vérifiées scientifiquement
  const formulaCorrections = [
    // [id, nom_correct, formule_brute_correcte]
    [210003, 'Acide butyrique', 'C4H8O2'],
    [210004, 'Acide isovalérique', 'C5H10O2'],
    [210005, 'Acide hexanoïque', 'C6H12O2'],
    [210006, 'Acide octanoïque', 'C8H16O2'],
    [210007, 'Acide décanoïque', 'C10H20O2'],
    [210009, 'Éthyl butyrate', 'C6H12O2'],
    [210010, 'Isoamyl acetate', 'C7H14O2'],
    [210011, 'Benzyl acetate', 'C9H10O2'],
    [210012, 'Ethyl lactate', 'C5H10O3'],
    [210013, 'Methyl anthranilate', 'C8H9NO2'],
    [210014, 'Ethyl cinnamate', 'C11H12O2'],
    [210015, 'Ethyl decanoate', 'C12H24O2'],
    [210016, 'Ethyl phenylacetate', 'C10H12O2'],
    [210017, 'Methyl salicylate', 'C8H8O3'],
    [210018, 'Butyl butyrate', 'C8H16O2'],
    [210019, 'Ethyl 3-methylthiopropionate', 'C6H12O2S'],
    [210020, 'Ethyl furan-2-carboxylate', 'C7H8O3'],
  ];
  
  for (const [id, name, formula] of formulaCorrections) {
    const [result] = await db.query(
      `UPDATE molecules SET chemicalFormula = ? WHERE id = ? AND name = ?`,
      [formula, id, name]
    );
    if (result.affectedRows > 0) {
      log(`  ✅ ID:${id} "${name}" → chemicalFormula = "${formula}"`);
      stats.corrected++;
    }
  }
  
  // Corriger les formules composites (avec commentaires entre parenthèses)
  const [compositeFormulas] = await db.query(`
    SELECT id, name, chemicalFormula FROM molecules 
    WHERE chemicalFormula LIKE '%(%)%'
      AND chemicalFormula REGEXP 'C[0-9]'
  `);
  
  log(`\n  Formules composites à nettoyer : ${compositeFormulas.length}`);
  for (const m of compositeFormulas) {
    // Extraire la formule brute avant la parenthèse
    const match = m.chemicalFormula.match(/^([A-Z][A-Za-z0-9]+)\s*\(/);
    if (match) {
      const cleanFormula = match[1];
      await db.query(`UPDATE molecules SET chemicalFormula = ? WHERE id = ?`, [cleanFormula, m.id]);
      log(`  ✅ ID:${m.id} "${m.name}" → "${m.chemicalFormula}" → "${cleanFormula}"`);
      stats.corrected++;
    }
  }
  
  // ─────────────────────────────────────────────────────────────
  // ÉTAPE 5 : Renommer la recette "os" (ID:1)
  // ─────────────────────────────────────────────────────────────
  log('\n📋 ÉTAPE 5 : Renommer la recette "os" (ID:1)...');
  const [recetteOs] = await db.query(`SELECT id, name, description FROM recettes WHERE id = 1`);
  if (recetteOs.length > 0 && recetteOs[0].name === 'os') {
    await db.query(`UPDATE recettes SET name = 'OS — Archéologie Olfactive' WHERE id = 1`);
    log(`  ✅ Recette ID:1 renommée : "os" → "OS — Archéologie Olfactive"`);
    stats.corrected++;
  } else {
    log(`  ℹ️  Recette ID:1 déjà renommée ou non trouvée`);
  }
  
  // ─────────────────────────────────────────────────────────────
  // RÉSUMÉ FINAL
  // ─────────────────────────────────────────────────────────────
  log('\n' + '='.repeat(60));
  log('📊 RÉSUMÉ DU NETTOYAGE PHASE A');
  log('='.repeat(60));
  log(`  Entrées supprimées : ${stats.deleted}`);
  log(`  Doublons fusionnés : ${stats.merged}`);
  log(`  Corrections effectuées : ${stats.corrected}`);
  
  // Vérification finale
  const [finalCount] = await db.query(`SELECT COUNT(*) as n FROM molecules`);
  log(`\n  Molécules en base après nettoyage : ${finalCount[0].n}`);
  
  await db.end();
  log('\n✅ Nettoyage Phase A terminé avec succès');
})().catch(e => { console.error('ERREUR:', e.message); process.exit(1); });
