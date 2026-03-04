import mysql from 'mysql2/promise';
const conn = await mysql.createConnection(process.env.DATABASE_URL);

const targets = [
  'damascena', 'centifolia', 'angustifolia', 'intermedia',
  'grandiflorum', 'sambac', 'bergamia', 'odorata', 'gallica', 'latifolia'
];

console.log('=== PLANTES À PARFUM — ÉTAT DES COMPOSITIONS ===\n');
for (const keyword of targets) {
  const [plants] = await conn.execute(
    'SELECT id, name, latinName FROM plants WHERE latinName LIKE ? OR name LIKE ? LIMIT 2',
    ['%'+keyword+'%', '%'+keyword+'%']
  );
  for (const p of plants) {
    const [mols] = await conn.execute(
      'SELECT COUNT(*) as cnt, AVG(typicalPercentage) as avg, SUM(CASE WHEN typicalPercentage > 5 THEN 1 ELSE 0 END) as precise FROM plant_molecules WHERE plant_id = ?',
      [p.id]
    );
    const m = mols[0];
    console.log(`[${p.id}] ${p.name} (${p.latinName||'?'}) — ${m.cnt} mols, avg ${(m.avg||0).toFixed(1)}%, précises: ${m.precise}`);
  }
}

// Vérifier les molécules clés pour Rosa damascena
console.log('\n=== MOLÉCULES CLÉS ROSES ===');
const keyMols = ['Phenylethanol','2-Phenylethanol','Citronellol','Geraniol','Nerol','Damascenone','Rose oxide','Eugenol'];
for (const mol of keyMols) {
  const [rows] = await conn.execute('SELECT id, name FROM molecules WHERE name LIKE ? LIMIT 1', ['%'+mol+'%']);
  if (rows.length > 0) console.log('  FOUND: ' + rows[0].id + ' | ' + rows[0].name);
  else console.log('  MISSING: ' + mol);
}

console.log('\n=== MOLÉCULES CLÉS LAVANDE ===');
const lavMols = ['Linalool','Linalyl acetate','Camphor','Borneol','1,8-Cineole','Terpinen-4-ol','Lavandulol','Lavandulyl acetate'];
for (const mol of lavMols) {
  const [rows] = await conn.execute('SELECT id, name FROM molecules WHERE name LIKE ? LIMIT 1', ['%'+mol.split(' ')[0]+'%']);
  if (rows.length > 0) console.log('  FOUND: ' + rows[0].id + ' | ' + rows[0].name);
  else console.log('  MISSING: ' + mol);
}

await conn.end();
