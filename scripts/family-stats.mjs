import mysql from 'mysql2/promise';

const conn = await mysql.createConnection(process.env.DATABASE_URL);

// Statistiques générales
const [stats] = await conn.execute(`
  SELECT 
    COUNT(*) as total,
    COUNT(DISTINCT family) as unique_families,
    COUNT(DISTINCT genus) as unique_genera
  FROM plants
`);
console.log('='.repeat(60));
console.log('STATISTIQUES TAXONOMIQUES DES PLANTES');
console.log('='.repeat(60));
console.log(`Total plantes: ${stats[0].total}`);
console.log(`Familles uniques: ${stats[0].unique_families}`);
console.log(`Genres uniques: ${stats[0].unique_genera}`);

// Top 15 familles
const [families] = await conn.execute(`
  SELECT family, COUNT(*) as count
  FROM plants
  WHERE family IS NOT NULL AND family != ''
  GROUP BY family
  ORDER BY count DESC
  LIMIT 15
`);
console.log('\n' + '-'.repeat(60));
console.log('TOP 15 FAMILLES BOTANIQUES:');
families.forEach((f, i) => {
  console.log(`  ${(i+1).toString().padStart(2)}. ${f.family.padEnd(25)} ${f.count} plantes`);
});

await conn.end();
