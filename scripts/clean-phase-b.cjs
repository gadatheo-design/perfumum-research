/**
 * NETTOYAGE PHASE B — PERFUMUM
 * Fusion des doublons potentiels sans CAS number identique
 * Basé sur l'analyse manuelle des 52 paires signalées par l'audit
 * 
 * Règle : on conserve l'entrée avec le plus de données (CAS, liaisons, données thérapeutiques)
 * On ne fusionne QUE les vrais doublons (même molécule, orthographe différente)
 * On NE fusionne PAS les isomères (alpha/beta, cis/trans, L/D) — ce sont des molécules distinctes
 */

const mysql = require('mysql2/promise');

(async () => {
  const db = await mysql.createConnection(process.env.DATABASE_URL);
  const log = (s) => console.log(s);
  let merged = 0;

  log('🧹 NETTOYAGE PHASE B — Doublons sans CAS identique');
  log('='.repeat(60));

  // Fonction helper : fusionner deux molécules
  async function mergeMolecules(idToDelete, idToKeep, reason) {
    const [exists] = await db.query(`SELECT id, name FROM molecules WHERE id IN (?, ?)`, [idToDelete, idToKeep]);
    if (exists.length < 2) {
      log(`  ⚠️  Ignoré (entrée manquante) : ${reason}`);
      return;
    }
    const keep = exists.find(m => m.id === idToKeep);
    const del = exists.find(m => m.id === idToDelete);
    log(`  Fusion : "${del.name}" (${idToDelete}) → "${keep.name}" (${idToKeep})`);
    log(`    Raison : ${reason}`);

    // Mettre à jour plant_molecules (éviter les doublons)
    await db.query(`
      UPDATE plant_molecules SET molecule_id = ?
      WHERE molecule_id = ?
        AND NOT EXISTS (
          SELECT 1 FROM plant_molecules pm2
          WHERE pm2.molecule_id = ? AND pm2.plant_id = plant_molecules.plant_id
        )
    `, [idToKeep, idToDelete, idToKeep]);
    await db.query(`DELETE FROM plant_molecules WHERE molecule_id = ?`, [idToDelete]);

    // Mettre à jour recette_molecules
    await db.query(`UPDATE recette_molecules SET molecule_id = ? WHERE molecule_id = ?`, [idToKeep, idToDelete]);

    // Supprimer les synergies liées
    await db.query(`DELETE FROM molecule_synergies WHERE molecule1_id = ? OR molecule2_id = ?`, [idToDelete, idToDelete]);

    // Supprimer les autres liaisons potentielles
    const tables = ['molecule_evidence','molecule_notes','molecule_origins','molecule_plant_sources',
      'molecule_links_unified','molecule_accords','molecule_chemical_families','molecular_interactions',
      'molecular_markers','molecular_comparisons','molecule_families','pyrolysis_transformations',
      'variety_molecules','raw_material_molecules','landrace_terpenes','tabac_molecule_links'];
    for (const t of tables) {
      try { await db.query(`DELETE FROM ${t} WHERE molecule_id = ?`, [idToDelete]); } catch(e) {}
    }

    // Supprimer la molécule en doublon
    await db.query(`DELETE FROM molecules WHERE id = ?`, [idToDelete]);
    merged++;
    log(`    ✅ Fusion effectuée`);
  }

  // ─────────────────────────────────────────────────────────────
  // VRAIS DOUBLONS CONFIRMÉS (même molécule, orthographe différente)
  // ─────────────────────────────────────────────────────────────

  log('\n📋 Groupe 1 : Doublons orthographiques (casse, tiret, accent)');

  // 1,8-Cineole / 1,8-cineole → conserver 810007 (avec CAS 470-82-6)
  await mergeMolecules(1320001, 810007, '1,8-Cineole — doublon de casse, conserver version avec CAS');

  // 4-Methylguaiacol / 4-methyl-guaiacol → conserver 120006 (avec CAS 2229-07-4)
  await mergeMolecules(1260049, 120006, '4-Methylguaiacol — doublon avec tiret, conserver version avec CAS');

  // Iso-eugénol / Isoeugénol → conserver 1350089 (avec CAS 97-54-1)
  await mergeMolecules(1110015, 1350089, 'Iso-eugénol / Isoeugénol — même molécule, orthographe différente');

  // Ar-turmerone / ar-turmerone → conserver 810044 (avec CAS 532-65-0)
  await mergeMolecules(1320035, 810044, 'Ar-turmerone — doublon de casse, conserver version avec CAS');

  // Cinnamaldehyde / cinnamaldehyde → conserver 810025 (avec CAS 104-55-2)
  await mergeMolecules(1320170, 810025, 'Cinnamaldehyde — doublon de casse, conserver version avec CAS');

  // cis-3-Hexenol / cis-3-hexenol → conserver 810030 (avec CAS 928-96-1)
  await mergeMolecules(1320210, 810030, 'cis-3-Hexenol — doublon de casse, conserver version avec CAS');

  // Elemol / elemol → conserver 810015 (avec CAS 639-99-6)
  await mergeMolecules(1320008, 810015, 'Elemol — doublon de casse, conserver version avec CAS');

  // Eugenol / eugenol → conserver 810022 (avec CAS 97-53-0)
  await mergeMolecules(1320213, 810022, 'Eugenol — doublon de casse, conserver version avec CAS');

  // Geranial / geranial → conserver 810032 (avec CAS 5392-40-5)
  await mergeMolecules(1320186, 810032, 'Geranial — doublon de casse, conserver version avec CAS');

  // Geraniol / geraniol → conserver 810043 (avec CAS 106-24-1)
  await mergeMolecules(1320211, 810043, 'Geraniol — doublon de casse, conserver version avec CAS');

  // Neral / neral → conserver 810033 (avec CAS 106-26-3)
  await mergeMolecules(1320185, 810033, 'Neral — doublon de casse, conserver version avec CAS');

  // Sabinene / sabinene → conserver 810010 (avec CAS 3387-41-5)
  await mergeMolecules(1320029, 810010, 'Sabinene — doublon de casse, conserver version avec CAS');

  // Terpinolene / terpinolene → conserver 810012 (avec CAS 586-62-9)
  await mergeMolecules(1320030, 810012, 'Terpinolene — doublon de casse, conserver version avec CAS');

  // Zingiberene / zingiberene → conserver 810020 (avec CAS 495-60-3)
  await mergeMolecules(1320034, 810020, 'Zingiberene — doublon de casse, conserver version avec CAS');

  log('\n📋 Groupe 2 : Doublons préfixe grec (α/alpha, β/beta)');

  // Androsténol / α-Androsténol → conserver 240001 (plus de liaisons recettes)
  await mergeMolecules(570075, 240001, 'Androsténol / α-Androsténol — même molécule (l\'androsténol est par défaut α)');

  // Bisabolol / α-Bisabolol → conserver 720016 (avec CAS 23089-26-1)
  await mergeMolecules(1260437, 720016, 'Bisabolol / α-Bisabolol — même molécule (le bisabolol commercial est α)');

  // Vétivone / α-Vétivone → conserver 1050002 (avec CAS 15764-04-2)
  await mergeMolecules(120002, 1050002, 'Vétivone / α-Vétivone — même molécule, conserver version avec CAS');

  log('\n📋 Groupe 3 : Doublons format HE (parenthèse vs point-virgule)');

  // Ylang-ylang (Cananga odorata) (HE) / Ylang-ylang (Cananga odorata; HE) → conserver 1260027
  await mergeMolecules(1260198, 1260027, 'Ylang-ylang HE — parenthèse vs point-virgule, même entrée');

  log('\n📋 Groupe 4 : Doublons Damascone (Alpha/α)');

  // Damascone Alpha / α-Damascone → conserver 720025 (avec CAS 43052-87-5)
  await mergeMolecules(570031, 720025, 'Damascone Alpha / α-Damascone — même molécule, conserver version avec CAS');

  // ─────────────────────────────────────────────────────────────
  // PAIRES À NE PAS FUSIONNER (isomères distincts — pour mémoire)
  // ─────────────────────────────────────────────────────────────
  log('\n📋 Isomères distincts — NON fusionnés (scientifiquement différents) :');
  log('  ✓ Alpha-cedrene / Beta-cedrene (isomères sesquiterpéniques)');
  log('  ✓ Alpha-Ionone / Beta-ionone (profils olfactifs distincts)');
  log('  ✓ Alpha-santalene / Beta-santalene (isomères sesquiterpéniques)');
  log('  ✓ Damascone Alpha / Damascone Beta (isomères de cétone)');
  log('  ✓ Delta-decalactone / Gamma-decalactone (lactones distinctes)');
  log('  ✓ Alpha-mangostin / Gamma-mangostin (xanthones distinctes)');
  log('  ✓ Eudesmol alpha / Eudesmol beta (sesquiterpènes distincts)');
  log('  ✓ Methyl ionone alpha / beta / gamma (isomères distincts)');
  log('  ✓ alpha-pinene / beta-pinene (déjà fusionné en Phase A)');
  log('  ✓ Alpha-terpinene / gamma-terpinene (isomères distincts)');
  log('  ✓ Alpha-Ionone / Ionone β / Ionone γ (isomères distincts)');
  log('  ✓ Asarone alpha / β-Asarone (isomères phénylpropanoïdes)');

  // ─────────────────────────────────────────────────────────────
  // RÉSUMÉ
  // ─────────────────────────────────────────────────────────────
  const [finalCount] = await db.query(`SELECT COUNT(*) as n FROM molecules`);
  log('\n' + '='.repeat(60));
  log(`📊 RÉSUMÉ PHASE B`);
  log(`  Doublons fusionnés : ${merged}`);
  log(`  Molécules en base après Phase B : ${finalCount[0].n}`);
  log('✅ Phase B terminée');

  await db.end();
})().catch(e => { console.error('ERREUR:', e.message); process.exit(1); });
