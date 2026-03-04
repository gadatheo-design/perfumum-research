/**
 * Vérification complète de la qualité des données après nettoyage
 */
import mysql from 'mysql2/promise';
const url = process.env.DATABASE_URL;
const conn = await mysql.createConnection(url);

console.log('=== RAPPORT DE QUALITÉ DES DONNÉES ===\n');

// 1. Statistiques générales
const [total] = await conn.execute(`SELECT COUNT(*) as cnt FROM plants`);
const [totalMols] = await conn.execute(`SELECT COUNT(*) as cnt FROM molecules`);
const [totalLinks] = await conn.execute(`SELECT COUNT(*) as cnt FROM plant_molecules`);
console.log(`📊 STATISTIQUES GÉNÉRALES`);
console.log(`  Plantes : ${total[0].cnt}`);
console.log(`  Molécules : ${totalMols[0].cnt}`);
console.log(`  Relations plantes-molécules : ${totalLinks[0].cnt}`);

// 2. Noms encore mal formatés
const [badNames] = await conn.execute(`SELECT COUNT(*) as cnt FROM plants WHERE name LIKE '%;%'`);
const [badLatins] = await conn.execute(`SELECT COUNT(*) as cnt FROM plants WHERE latin_name LIKE '%;%'`);
console.log(`\n📋 NOMS MAL FORMATÉS`);
console.log(`  name avec ; : ${badNames[0].cnt}`);
console.log(`  latin_name avec ; : ${badLatins[0].cnt}`);

// 3. Plantes sans latin_name
const [noLatin] = await conn.execute(`SELECT COUNT(*) as cnt FROM plants WHERE latin_name IS NULL OR latin_name = '' OR latin_name = 'null'`);
console.log(`\n🌿 DONNÉES MANQUANTES`);
console.log(`  Plantes sans latin_name : ${noLatin[0].cnt}`);

// 4. Répartition par catégorie
const [cats] = await conn.execute(`
  SELECT category, COUNT(*) as cnt 
  FROM plants 
  GROUP BY category 
  ORDER BY cnt DESC
`);
console.log(`\n📂 RÉPARTITION PAR CATÉGORIE`);
cats.forEach(c => console.log(`  ${c.category || 'NULL'}: ${c.cnt}`));

// 5. Plantes avec des relations plant_molecules
const [withLinks] = await conn.execute(`SELECT COUNT(DISTINCT plant_id) as cnt FROM plant_molecules`);
console.log(`\n🔗 COUVERTURE COMPOSITIONS CHIMIQUES`);
console.log(`  Plantes avec compositions : ${withLinks[0].cnt}/${total[0].cnt} (${Math.round(withLinks[0].cnt/total[0].cnt*100)}%)`);

// 6. Vérifier les doublons de noms
const [dupNames] = await conn.execute(`
  SELECT LOWER(TRIM(name)) as name_lower, COUNT(*) as cnt 
  FROM plants 
  GROUP BY LOWER(TRIM(name)) 
  HAVING cnt > 1 
  ORDER BY cnt DESC 
  LIMIT 10
`);
console.log(`\n🔄 DOUBLONS DE NOMS (top 10)`);
if (dupNames.length === 0) {
  console.log(`  Aucun doublon détecté ✅`);
} else {
  dupNames.forEach(d => console.log(`  "${d.name_lower}": ${d.cnt} occurrences`));
}

// 7. Plantes avec latin_name descriptif restant
const [descriptive] = await conn.execute(`
  SELECT COUNT(*) as cnt FROM plants 
  WHERE latin_name IS NOT NULL 
  AND (latin_name LIKE '%Accords%' OR latin_name LIKE '%accord%' OR latin_name LIKE '%Axe %')
`);
console.log(`\n⚠️  latin_name encore descriptifs : ${descriptive[0].cnt}`);

// 8. Plantes récemment corrigées (IDs 600xxx, 630xxx)
const [corrected600] = await conn.execute(`SELECT COUNT(*) as cnt FROM plants WHERE id BETWEEN 600000 AND 699999`);
console.log(`\n✅ Plantes importées (IDs 600xxx-690xxx) : ${corrected600[0].cnt}`);

// 9. Quelques exemples de plantes bien formatées
const [examples] = await conn.execute(`
  SELECT id, name, latin_name, category, family 
  FROM plants 
  WHERE id BETWEEN 600002 AND 600020
  ORDER BY id
  LIMIT 10
`);
console.log(`\n📝 EXEMPLES DE PLANTES CORRIGÉES`);
examples.forEach(p => {
  console.log(`  ID ${p.id}: "${p.name}" (${p.latin_name}) [${p.category}]`);
});

await conn.end();
console.log('\n✅ Vérification terminée');
