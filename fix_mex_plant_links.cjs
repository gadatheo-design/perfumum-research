const mysql = require('mysql2/promise');
require('dotenv').config();

async function main() {
  const url = new URL(process.env.DATABASE_URL);
  const conn = await mysql.createConnection({
    host: url.hostname, port: parseInt(url.port) || 3306,
    user: url.username, password: url.password,
    database: url.pathname.slice(1), ssl: { rejectUnauthorized: false }
  });

  const plantLinks = [
    { plantId: 480006, plantName: 'Copal Negro', molecules: [
      { name: 'alpha-Pinene', pct: 32.0, notes: 'Molécule principale copal negro (25-40%)' },
      { name: 'Limonene', pct: 17.5, notes: 'Composant secondaire (15-20%)' },
      { name: 'p-Cymene', pct: 7.5, notes: 'Composant tertiaire (5-10%)' },
    ]},
    { plantId: 300001, plantName: 'Pericón', molecules: [
      { name: 'Estragole', pct: 70.0, notes: 'Molécule dominante pericón (60-80%)' },
      { name: 'Anethole', pct: 12.5, notes: 'Composant secondaire (10-15%)' },
    ]},
    { plantId: 150003, plantName: 'Mapacho Nicotiana rustica', molecules: [
      { name: 'Nornicotine', pct: 50.0, notes: 'Alcaloïde principal N. rustica (40-60%)' },
      { name: 'Anabasine', pct: 15.0, notes: 'Alcaloïde secondaire (10-20%)' },
      { name: 'Pyridine', pct: 3.0, notes: 'Produit combustion, note tabac' },
      { name: 'Furfural', pct: 2.0, notes: 'Produit pyrolyse, note caramel' },
    ]},
    { plantId: 540022, plantName: 'Liquidambar styraciflua', molecules: [
      { name: 'Cinnamaldehyde', pct: 15.0, notes: 'Note épicée, cannelle (10-20%)' },
      { name: 'Vanillin', pct: 7.5, notes: 'Note vanillée, balsamique (5-10%)' },
    ]},
  ];

  let created = 0;
  for (const { plantId, plantName, molecules } of plantLinks) {
    for (const mol of molecules) {
      const [mols] = await conn.execute('SELECT id, name FROM molecules WHERE name LIKE ? LIMIT 3', ['%' + mol.name.split(' ')[0] + '%']);
      if (!mols.length) { console.log('  Molécule non trouvée:', mol.name); continue; }
      const molId = mols[0].id;
      const [ex] = await conn.execute('SELECT plant_id FROM plant_molecules WHERE plant_id=? AND molecule_id=? LIMIT 1', [plantId, molId]);
      if (ex.length) { console.log('  Lien déjà existant:', plantName, '->', mols[0].name); continue; }
      await conn.execute('INSERT INTO plant_molecules (plant_id, molecule_id, percentage, notes, created_at) VALUES (?,?,?,?,NOW())', [plantId, molId, mol.pct, mol.notes]);
      console.log('  + Lien:', plantName, '->', mols[0].name, '(' + mol.pct + '%)');
      created++;
    }
  }
  const [total] = await conn.execute('SELECT COUNT(*) as c FROM plant_molecules');
  console.log('Total liaisons:', total[0].c, '| Nouveaux:', created);
  await conn.end();
}

main().catch(console.error);
