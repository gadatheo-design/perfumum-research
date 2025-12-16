import Database from 'better-sqlite3';

const db = new Database(process.env.DATABASE_URL || './local.db');

const tabacs = db.prepare(`
  SELECT id, name, type, intensity, internalNotes, dominantMolecules, perfumeumFamilies
  FROM tabacs
  ORDER BY name
`).all();

console.log(JSON.stringify(tabacs, null, 2));

db.close();
