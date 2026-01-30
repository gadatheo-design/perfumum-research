import Database from 'better-sqlite3';

const db = new Database('perfumum.db');

const tables = db.prepare(`
  SELECT name FROM sqlite_master 
  WHERE type='table' 
  ORDER BY name
`).all();

console.log('=== TABLES DANS LA BASE ===');
tables.forEach(t => console.log(`- ${t.name}`));

db.close();
