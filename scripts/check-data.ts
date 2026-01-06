import { getDb } from '../server/db.js';
import { sql } from 'drizzle-orm';

async function main() {
  const db = await getDb();
  if (!db) {
    console.log('No DB');
    return;
  }
  
  // Check plants
  const plants = await db.execute(sql`SELECT id, name FROM plants WHERE name LIKE '%Rose%'`);
  console.log('Plants with Rose:', JSON.stringify(plants[0]));
  
  // Check plant_molecules count
  const count = await db.execute(sql`SELECT COUNT(*) as cnt FROM plant_molecules`);
  console.log('Plant molecules count:', JSON.stringify(count[0]));
  
  // Check associations for Rose de Damas (30010)
  const assoc30010 = await db.execute(sql`SELECT COUNT(*) as cnt FROM plant_molecules WHERE plant_id = 30010`);
  console.log('Associations for Rose de Damas (30010):', JSON.stringify(assoc30010[0]));
  
  // Check associations for Rose de Damas (270009)
  const assoc270009 = await db.execute(sql`SELECT COUNT(*) as cnt FROM plant_molecules WHERE plant_id = 270009`);
  console.log('Associations for Rose de Damas (270009):', JSON.stringify(assoc270009[0]));
  
  process.exit(0);
}

main().catch(console.error);
