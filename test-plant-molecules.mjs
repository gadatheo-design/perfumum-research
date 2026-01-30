import { drizzle } from 'drizzle-orm/mysql2';
import { eq } from 'drizzle-orm';
import * as schema from './drizzle/schema.js';

async function main() {
  const db = drizzle(process.env.DATABASE_URL, { mode: 'default' });
  
  // Récupérer Rose de Damas
  const plants = await db.select().from(schema.plants);
  const rose = plants.find(p => p.name === 'Rose de Damas');
  console.log('Rose de Damas trouvée:', rose ? 'Oui' : 'Non', rose?.id);
  
  if (rose) {
    // Récupérer les molécules
    const molecules = await db
      .select()
      .from(schema.plantMolecules)
      .where(eq(schema.plantMolecules.plantId, rose.id));
    console.log('Nombre de molécules:', molecules.length);
    console.log('Première molécule:', molecules[0]);
  }
  
  process.exit(0);
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
