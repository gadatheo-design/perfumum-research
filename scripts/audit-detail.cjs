const mysql = require('mysql2/promise');
const fs = require('fs');

(async () => {
  const db = await mysql.createConnection(process.env.DATABASE_URL);
  const lines = [];
  const log = (s) => { lines.push(s); console.log(s); };
  
  // 1. Noms trop courts
  const [short] = await db.query('SELECT id, name, family FROM molecules WHERE LENGTH(name) < 3 LIMIT 20');
  log('=== NOMS TROP COURTS (<3 chars) : ' + short.length + ' ===');
  short.forEach(m => log('  ID:' + m.id + ' | "' + m.name + '" | famille:' + m.family));
  
  // 2. Noms trop longs
  const [long] = await db.query('SELECT id, name, family FROM molecules WHERE LENGTH(name) > 100 LIMIT 10');
  log('\n=== NOMS TROP LONGS (>100 chars) : ' + long.length + ' ===');
  long.forEach(m => log('  ID:' + m.id + ' | "' + m.name.substring(0,80) + '..." (' + m.name.length + ' chars)'));
  
  // 3. Noms avec virgules (CSV bruts)
  const [csv] = await db.query("SELECT id, name FROM molecules WHERE name LIKE '%,%' LIMIT 20");
  log('\n=== NOMS AVEC VIRGULES (CSV bruts) : ' + csv.length + ' ===');
  csv.forEach(m => log('  ID:' + m.id + ' | "' + m.name.substring(0,80) + '"'));
  
  // 4. Formules chimiques trop longues ou avec espaces
  const [formulas] = await db.query("SELECT id, name, chemicalFormula FROM molecules WHERE chemicalFormula IS NOT NULL AND chemicalFormula != '' AND (LENGTH(chemicalFormula) > 60 OR chemicalFormula LIKE '% %') LIMIT 20");
  log('\n=== FORMULES CHIMIQUES SUSPECTES : ' + formulas.length + ' ===');
  formulas.forEach(m => log('  ID:' + m.id + ' | "' + m.name + '" | "' + (m.chemicalFormula||'').substring(0,80) + '"'));
  
  // 5. Doublons exacts (même nom insensible à la casse)
  const [dup] = await db.query("SELECT LOWER(name) as name_lower, COUNT(*) as cnt, MIN(name) as name FROM molecules GROUP BY LOWER(name) HAVING cnt > 1 ORDER BY cnt DESC LIMIT 20");
  log('\n=== DOUBLONS EXACTS (meme nom) : ' + dup.length + ' ===');
  dup.forEach(d => log('  "' + d.name + '" : ' + d.cnt + ' fois'));
  
  // 6. Recettes avec proportions anormales
  const [recettes] = await db.query("SELECT r.id, r.name, r.category, SUM(rm.proportion) as total_prop, COUNT(rm.id) as nb FROM recettes r LEFT JOIN recette_molecules rm ON r.id = rm.recette_id GROUP BY r.id HAVING total_prop > 105 OR (total_prop < 50 AND total_prop > 0) ORDER BY total_prop DESC LIMIT 20");
  log('\n=== RECETTES AVEC PROPORTIONS ANORMALES (>105% ou <50%) : ' + recettes.length + ' ===');
  recettes.forEach(r => log('  ID:' + r.id + ' | "' + r.name + '" | total:' + parseFloat(r.total_prop||0).toFixed(1) + '% | ' + r.nb + ' ingr.'));
  
  // 7. Ingrédients avec molécule inexistante
  const [orphan] = await db.query("SELECT rm.recette_id, rm.molecule_id, r.name as rname FROM recette_molecules rm JOIN recettes r ON rm.recette_id = r.id LEFT JOIN molecules m ON rm.molecule_id = m.id WHERE m.id IS NULL LIMIT 20");
  log('\n=== INGREDIENTS AVEC MOLECULE INEXISTANTE : ' + orphan.length + ' ===');
  orphan.forEach(i => log('  recette_id:' + i.recette_id + ' | "' + i.rname + '" | molecule_id:' + i.molecule_id));
  
  // 8. Recettes sans ingrédients
  const [empty] = await db.query("SELECT r.id, r.name, r.category FROM recettes r LEFT JOIN recette_molecules rm ON r.id = rm.recette_id WHERE rm.recette_id IS NULL LIMIT 20");
  log('\n=== RECETTES SANS INGREDIENTS : ' + empty.length + ' ===');
  empty.forEach(r => log('  ID:' + r.id + ' | "' + r.name + '" | cat:' + r.category));
  
  // 9. Doublons potentiels (noms normalisés)
  const [allMols] = await db.query("SELECT id, name, cas_number FROM molecules ORDER BY name");
  const nameMap = new Map();
  const dups = [];
  for (const mol of allMols) {
    const norm = mol.name.toLowerCase().replace(/[^a-z0-9]/g, '').replace(/alpha|beta|gamma|delta/g, '');
    if (norm.length < 3) continue;
    if (nameMap.has(norm) && Math.abs(mol.name.length - nameMap.get(norm).name.length) < 5) {
      dups.push({ a: nameMap.get(norm), b: mol });
    } else {
      nameMap.set(norm, mol);
    }
  }
  log('\n=== DOUBLONS POTENTIELS (noms normalises) : ' + dups.length + ' ===');
  dups.slice(0, 40).forEach(d => log('  "' + d.a.name + '" (id:' + d.a.id + ') <-> "' + d.b.name + '" (id:' + d.b.id + ') | CAS: ' + (d.a.cas_number||'N/A') + ' vs ' + (d.b.cas_number||'N/A')));
  
  // 10. Molécules avec therapeuticProperties très longs (>2000 chars)
  const [longTherapy] = await db.query("SELECT id, name, LENGTH(therapeuticProperties) as len FROM molecules WHERE therapeuticProperties IS NOT NULL AND LENGTH(therapeuticProperties) > 2000 ORDER BY len DESC LIMIT 10");
  log('\n=== PROPRIETES THERAPEUTIQUES TROP LONGUES (>2000 chars) : ' + longTherapy.length + ' ===');
  longTherapy.forEach(m => log('  ID:' + m.id + ' | "' + m.name + '" | ' + m.len + ' chars'));
  
  // 11. Molécules avec olfactiveProfile vide mais famille connue
  const [noOlfactive] = await db.query("SELECT id, name, family, chemical_class FROM molecules WHERE (olfactiveProfile IS NULL OR olfactiveProfile = '') AND family IS NOT NULL AND family NOT IN ('Polysaccharide', 'Peptide', 'Acide aminé', 'Protéine', 'Enzyme', 'Acide aminé aromatique') LIMIT 20");
  log('\n=== MOLECULES SANS PROFIL OLFACTIF (famille connue) : ' + noOlfactive.length + ' (info) ===');
  
  // 12. Statistiques globales
  const [totMol] = await db.query('SELECT COUNT(*) as n FROM molecules');
  const [totRec] = await db.query('SELECT COUNT(*) as n FROM recettes');
  const [totRM] = await db.query('SELECT COUNT(*) as n FROM recette_molecules');
  const [withTherapy] = await db.query("SELECT COUNT(*) as n FROM molecules WHERE therapeuticProperties IS NOT NULL AND therapeuticProperties != ''");
  const [withOlfactive] = await db.query("SELECT COUNT(*) as n FROM molecules WHERE olfactiveProfile IS NOT NULL AND olfactiveProfile != ''");
  const [withFormula] = await db.query("SELECT COUNT(*) as n FROM molecules WHERE chemicalFormula IS NOT NULL AND chemicalFormula != ''");
  
  log('\n=== STATISTIQUES GLOBALES ===');
  log('  Molécules totales : ' + totMol[0].n);
  log('  Recettes totales  : ' + totRec[0].n);
  log('  Liaisons recette-molécule : ' + totRM[0].n);
  log('  Molécules avec propriétés thérapeutiques : ' + withTherapy[0].n + ' (' + Math.round(withTherapy[0].n/totMol[0].n*100) + '%)');
  log('  Molécules avec profil olfactif : ' + withOlfactive[0].n + ' (' + Math.round(withOlfactive[0].n/totMol[0].n*100) + '%)');
  log('  Molécules avec formule chimique : ' + withFormula[0].n + ' (' + Math.round(withFormula[0].n/totMol[0].n*100) + '%)');
  
  fs.writeFileSync('/home/ubuntu/perfumum-research/scripts/audit-results.txt', lines.join('\n'));
  log('\n✅ Résultats sauvegardés dans scripts/audit-results.txt');
  
  await db.end();
})().catch(e => { console.error('ERREUR:', e.message); process.exit(1); });
