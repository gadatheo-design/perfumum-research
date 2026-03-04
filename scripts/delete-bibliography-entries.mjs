/**
 * Suppression des entrées bibliographiques importées par erreur comme plantes
 * Ces entrées contiennent des descriptions géographiques en anglais, des URLs,
 * des références bibliographiques, etc.
 */
import mysql from 'mysql2/promise';
const url = process.env.DATABASE_URL;
const conn = await mysql.createConnection(url);

// 1. Identifier toutes les entrées qui sont clairement des données bibliographiques/textuelles
const [badEntries] = await conn.execute(`
  SELECT id, name, latin_name
  FROM plants 
  WHERE name LIKE '%;%'
     OR name LIKE '%References%'
     OR name LIKE '%World Flora Online%'
     OR name LIKE '%Plants of the World%'
     OR name LIKE '%URL:%'
     OR name LIKE '%https://%'
     OR name LIKE '%http://%'
     OR name LIKE 'EN: %'
     OR name LIKE 'FR: %'
     OR name LIKE '• %'
     OR name LIKE '(%'
     OR (name LIKE '%accessed%' AND name LIKE '%2026%')
  ORDER BY id
`);

console.log(`📊 ${badEntries.length} entrées bibliographiques/textuelles trouvées\n`);

// Vérifier qu'aucune n'a de relations plant_molecules
let withRelations = 0;
const toDelete = [];

for (const entry of badEntries) {
  const [rels] = await conn.execute(
    `SELECT COUNT(*) as cnt FROM plant_molecules WHERE plant_id = ?`,
    [entry.id]
  );
  
  if (rels[0].cnt > 0) {
    console.log(`⚠️  ID ${entry.id} a ${rels[0].cnt} relations - IGNORÉ`);
    withRelations++;
  } else {
    toDelete.push(entry.id);
  }
}

console.log(`\n🗑️  ${toDelete.length} entrées à supprimer (sans relations)`);
console.log(`⚠️  ${withRelations} entrées ignorées (ont des relations)`);

if (toDelete.length > 0) {
  // Afficher les 10 premières
  console.log('\n=== Aperçu des suppressions (10 premières) ===');
  badEntries.slice(0, 10).forEach(e => {
    if (toDelete.includes(e.id)) {
      console.log(`  ID ${e.id}: "${e.name.substring(0, 80)}"`);
    }
  });
  
  // Supprimer par lots
  const batchSize = 100;
  let deleted = 0;
  
  for (let i = 0; i < toDelete.length; i += batchSize) {
    const batch = toDelete.slice(i, i + batchSize);
    const placeholders = batch.map(() => '?').join(',');
    await conn.execute(`DELETE FROM plants WHERE id IN (${placeholders})`, batch);
    deleted += batch.length;
  }
  
  console.log(`\n✅ ${deleted} entrées supprimées`);
}

// Vérification finale
const [remaining] = await conn.execute(`SELECT COUNT(*) as cnt FROM plants WHERE name LIKE '%;%'`);
console.log(`\nPlantes avec name encore mal formaté : ${remaining[0].cnt}`);

const [total] = await conn.execute(`SELECT COUNT(*) as cnt FROM plants`);
console.log(`Total plantes en base : ${total[0].cnt}`);

await conn.end();
console.log('\n✅ Script terminé');
