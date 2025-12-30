import { db } from './server/db.ts';
import { recipes } from './drizzle/schema.ts';
import { like, or } from 'drizzle-orm';

const mossiRecipes = await db.select().from(recipes).where(
  or(
    like(recipes.name, '%Mossi%'),
    like(recipes.category, '%mossi%'),
    like(recipes.notes, '%Mossi%')
  )
);

console.log('=== RECETTES MOSSI TROUVÉES ===');
console.log('Total:', mossiRecipes.length);
console.log('');
mossiRecipes.forEach((r, i) => {
  console.log(`${i+1}. ${r.name} (catégorie: ${r.category})`);
  console.log(`   Formule: ${r.formula?.substring(0, 80)}...`);
  console.log('');
});

// Vérifier aussi les recettes Royal Mossi
const royalRecipes = await db.select().from(recipes).where(
  or(
    like(recipes.name, '%Royal%'),
    like(recipes.notes, '%Royal%')
  )
);

console.log('=== RECETTES ROYAL TROUVÉES ===');
console.log('Total:', royalRecipes.length);
console.log('');
royalRecipes.forEach((r, i) => {
  console.log(`${i+1}. ${r.name} (catégorie: ${r.category})`);
  console.log('');
});

process.exit(0);
