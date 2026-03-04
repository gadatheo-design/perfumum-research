const mysql = require('mysql2/promise');
const fs = require('fs');

(async () => {
  const db = await mysql.createConnection(process.env.DATABASE_URL);
  const lines = [];
  const log = (s) => { lines.push(s); console.log(s); };
  
  log('=== AUDIT APPROFONDI DES RECETTES ===\n');
  
  // 1. Vue d'ensemble des recettes
  const [overview] = await db.query(`
    SELECT 
      r.category,
      COUNT(DISTINCT r.id) as nb_recettes,
      COUNT(rm.id) as total_liaisons,
      AVG(rm.proportion) as avg_proportion,
      SUM(rm.proportion) as sum_proportion
    FROM recettes r
    LEFT JOIN recette_molecules rm ON r.id = rm.recette_id
    GROUP BY r.category
    ORDER BY nb_recettes DESC
  `);
  log('=== VUE D\'ENSEMBLE PAR CATÉGORIE ===');
  overview.forEach(c => log('  ' + (c.category||'NULL') + ': ' + c.nb_recettes + ' recettes, ' + c.total_liaisons + ' liaisons, avg proportion: ' + parseFloat(c.avg_proportion||0).toFixed(1) + '%'));
  
  // 2. Recettes avec proportions totales > 105%
  const [over100] = await db.query(`
    SELECT r.id, r.name, r.category, 
      SUM(rm.proportion) as total,
      COUNT(rm.id) as nb_ingr
    FROM recettes r
    JOIN recette_molecules rm ON r.id = rm.recette_id
    WHERE rm.proportion IS NOT NULL
    GROUP BY r.id, r.name, r.category
    HAVING total > 105
    ORDER BY total DESC
    LIMIT 30
  `);
  log('\n=== RECETTES AVEC TOTAL > 105% : ' + over100.length + ' ===');
  over100.forEach(r => log('  ID:' + r.id + ' | "' + r.name + '" | ' + parseFloat(r.total).toFixed(1) + '% | ' + r.nb_ingr + ' ingr.'));
  
  // 3. Recettes avec proportions totales < 50% (mais > 0)
  const [under50] = await db.query(`
    SELECT r.id, r.name, r.category, 
      SUM(rm.proportion) as total,
      COUNT(rm.id) as nb_ingr
    FROM recettes r
    JOIN recette_molecules rm ON r.id = rm.recette_id
    WHERE rm.proportion IS NOT NULL
    GROUP BY r.id, r.name, r.category
    HAVING total < 50 AND total > 0
    ORDER BY total ASC
    LIMIT 20
  `);
  log('\n=== RECETTES AVEC TOTAL < 50% (mais > 0) : ' + under50.length + ' ===');
  under50.forEach(r => log('  ID:' + r.id + ' | "' + r.name + '" | ' + parseFloat(r.total).toFixed(1) + '% | ' + r.nb_ingr + ' ingr.'));
  
  // 4. Ingrédients avec proportion = 0 ou NULL
  const [zeroProp] = await db.query(`
    SELECT rm.id, rm.recette_id, rm.molecule_id, rm.proportion,
      r.name as recette_name, m.name as molecule_name
    FROM recette_molecules rm
    JOIN recettes r ON rm.recette_id = r.id
    LEFT JOIN molecules m ON rm.molecule_id = m.id
    WHERE rm.proportion IS NULL OR rm.proportion = 0
    LIMIT 20
  `);
  log('\n=== INGRÉDIENTS AVEC PROPORTION NULL OU 0 : ' + zeroProp.length + ' ===');
  zeroProp.forEach(i => log('  recette:"' + i.recette_name + '" | mol:"' + (i.molecule_name||'?') + '" | prop:' + i.proportion));
  
  // 5. Ingrédients avec proportion > 100%
  const [bigProp] = await db.query(`
    SELECT rm.id, rm.recette_id, rm.proportion,
      r.name as recette_name, m.name as molecule_name
    FROM recette_molecules rm
    JOIN recettes r ON rm.recette_id = r.id
    LEFT JOIN molecules m ON rm.molecule_id = m.id
    WHERE rm.proportion > 100
    LIMIT 20
  `);
  log('\n=== INGRÉDIENTS AVEC PROPORTION > 100% : ' + bigProp.length + ' ===');
  bigProp.forEach(i => log('  "' + i.recette_name + '" | "' + (i.molecule_name||'?') + '" | ' + i.proportion + '%'));
  
  // 6. Recettes sans ingrédients (avec count)
  const [emptyAll] = await db.query(`
    SELECT r.id, r.name, r.category
    FROM recettes r
    LEFT JOIN recette_molecules rm ON r.id = rm.recette_id
    WHERE rm.recette_id IS NULL
    ORDER BY r.id
  `);
  log('\n=== RECETTES SANS INGRÉDIENTS : ' + emptyAll.length + ' ===');
  log('  (Affichage des 30 premières)');
  emptyAll.slice(0, 30).forEach(r => log('  ID:' + r.id + ' | "' + r.name + '" | cat:' + (r.category||'NULL')));
  
  // 7. Recettes avec un seul ingrédient
  const [single] = await db.query(`
    SELECT r.id, r.name, r.category, COUNT(rm.id) as nb, 
      MIN(m.name) as molecule_name, MIN(rm.proportion) as proportion
    FROM recettes r
    JOIN recette_molecules rm ON r.id = rm.recette_id
    LEFT JOIN molecules m ON rm.molecule_id = m.id
    GROUP BY r.id, r.name, r.category
    HAVING nb = 1
    LIMIT 20
  `);
  log('\n=== RECETTES AVEC UN SEUL INGRÉDIENT : ' + single.length + ' ===');
  single.forEach(r => log('  ID:' + r.id + ' | "' + r.name + '" | mol:"' + (r.molecule_name||'?') + '" | ' + r.proportion + '%'));
  
  // 8. Molécules les plus utilisées dans les recettes
  const [topMols] = await db.query(`
    SELECT m.name, COUNT(rm.id) as usage_count, AVG(rm.proportion) as avg_prop
    FROM recette_molecules rm
    JOIN molecules m ON rm.molecule_id = m.id
    GROUP BY rm.molecule_id, m.name
    ORDER BY usage_count DESC
    LIMIT 15
  `);
  log('\n=== MOLÉCULES LES PLUS UTILISÉES EN RECETTES ===');
  topMols.forEach(m => log('  "' + m.name + '" : ' + m.usage_count + ' recettes, avg ' + parseFloat(m.avg_prop||0).toFixed(1) + '%'));
  
  // 9. Recettes avec des doublons de molécules
  const [dupIngr] = await db.query(`
    SELECT rm.recette_id, rm.molecule_id, MIN(r.name) as recette_name, MIN(m.name) as molecule_name,
      COUNT(*) as occurrences, SUM(rm.proportion) as total_prop
    FROM recette_molecules rm
    JOIN recettes r ON rm.recette_id = r.id
    JOIN molecules m ON rm.molecule_id = m.id
    GROUP BY rm.recette_id, rm.molecule_id
    HAVING occurrences > 1
    LIMIT 20
  `);
  log('\n=== INGRÉDIENTS EN DOUBLON DANS UNE MÊME RECETTE : ' + dupIngr.length + ' ===');
  dupIngr.forEach(i => log('  "' + i.recette_name + '" | "' + i.molecule_name + '" x' + i.occurrences + ' | total:' + parseFloat(i.total_prop||0).toFixed(1) + '%'));
  
  // 10. Recettes avec le champ 'ingredients' (texte brut) mais sans liaisons recette_molecules
  const [textIngr] = await db.query(`
    SELECT r.id, r.name, r.category, 
      SUBSTRING(r.ingredients, 1, 100) as ingredients_preview
    FROM recettes r
    LEFT JOIN recette_molecules rm ON r.id = rm.recette_id
    WHERE rm.recette_id IS NULL
      AND r.ingredients IS NOT NULL 
      AND r.ingredients != ''
    LIMIT 20
  `);
  log('\n=== RECETTES AVEC TEXTE INGRÉDIENTS MAIS SANS LIAISONS : ' + textIngr.length + ' ===');
  textIngr.forEach(r => log('  ID:' + r.id + ' | "' + r.name + '" | "' + (r.ingredients_preview||'').substring(0,60) + '"'));
  
  // 11. Recettes avec notes_tete + notes_coeur + notes_fond incohérents
  const [notesCheck] = await db.query(`
    SELECT r.id, r.name,
      r.duree_tete_min, r.duree_coeur_min, r.duree_fond_min
    FROM recettes r
    WHERE (r.duree_tete_min IS NOT NULL AND r.duree_tete_min < 0)
       OR (r.duree_coeur_min IS NOT NULL AND r.duree_coeur_min < 0)
       OR (r.duree_fond_min IS NOT NULL AND r.duree_fond_min < 0)
       OR (r.duree_tete_min IS NOT NULL AND r.duree_tete_min > 10000)
    LIMIT 10
  `);
  log('\n=== RECETTES AVEC DURÉES INCOHÉRENTES : ' + notesCheck.length + ' ===');
  notesCheck.forEach(r => log('  ID:' + r.id + ' | "' + r.name + '" | tete:' + r.duree_tete_min + ' coeur:' + r.duree_coeur_min + ' fond:' + r.duree_fond_min));
  
  // 12. Statistiques finales
  const [totRec] = await db.query('SELECT COUNT(*) as n FROM recettes');
  const [totRM] = await db.query('SELECT COUNT(*) as n FROM recette_molecules');
  const [recWithIngr] = await db.query('SELECT COUNT(DISTINCT recette_id) as n FROM recette_molecules');
  const [avgIngr] = await db.query('SELECT AVG(cnt) as avg FROM (SELECT COUNT(*) as cnt FROM recette_molecules GROUP BY recette_id) t');
  
  log('\n=== STATISTIQUES RECETTES ===');
  log('  Total recettes : ' + totRec[0].n);
  log('  Recettes avec ingrédients : ' + recWithIngr[0].n + ' (' + Math.round(recWithIngr[0].n/totRec[0].n*100) + '%)');
  log('  Recettes sans ingrédients : ' + (totRec[0].n - recWithIngr[0].n) + ' (' + Math.round((totRec[0].n - recWithIngr[0].n)/totRec[0].n*100) + '%)');
  log('  Total liaisons recette-molécule : ' + totRM[0].n);
  log('  Moyenne ingrédients/recette : ' + parseFloat(avgIngr[0].avg||0).toFixed(1));
  
  fs.writeFileSync('/home/ubuntu/perfumum-research/scripts/audit-recettes-results.txt', lines.join('\n'));
  log('\n✅ Résultats sauvegardés dans scripts/audit-recettes-results.txt');
  
  await db.end();
})().catch(e => { console.error('ERREUR:', e.message); process.exit(1); });
