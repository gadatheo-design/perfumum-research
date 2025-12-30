import { getDb } from '../server/db';
import { recettes, molecules, moleculesRecettes } from '../drizzle/schema';
import { like, or, eq } from 'drizzle-orm';

async function main() {
  const db = await getDb();
  
  // Trouver les recettes Pétrichor
  console.log("=== RECETTES PÉTRICHOR ===\n");
  const petrichorRecettes = await db.select({
    id: recettes.id,
    name: recettes.name,
    category: recettes.category
  }).from(recettes).where(
    or(
      like(recettes.name, '%Pétrichor%'),
      like(recettes.name, '%petrichor%')
    )
  );
  
  console.log(`Trouvé ${petrichorRecettes.length} recettes Pétrichor:`);
  petrichorRecettes.forEach(r => {
    console.log(`  ID: ${r.id} | ${r.name} | ${r.category}`);
  });

  // Trouver les molécules terreuses
  console.log("\n=== MOLÉCULES TERREUSES ===\n");
  const earthyMolecules = await db.select({
    id: molecules.id,
    name: molecules.name,
    radarEarthiness: molecules.radarEarthiness,
    radarFreshness: molecules.radarFreshness,
    radarIntensity: molecules.radarIntensity
  }).from(molecules).where(
    or(
      like(molecules.olfactiveProfile, '%terre%'),
      like(molecules.olfactiveProfile, '%minéral%'),
      like(molecules.olfactiveProfile, '%boisé%'),
      like(molecules.name, '%Geosmin%'),
      like(molecules.name, '%Vetiver%'),
      like(molecules.name, '%Mitti%')
    )
  );
  
  console.log(`Trouvé ${earthyMolecules.length} molécules terreuses:`);
  earthyMolecules.forEach(m => {
    console.log(`  ID: ${m.id} | ${m.name} | E=${m.radarEarthiness} F=${m.radarFreshness} I=${m.radarIntensity}`);
  });

  // Vérifier associations existantes pour ces recettes
  console.log("\n=== ASSOCIATIONS EXISTANTES ===\n");
  for (const r of petrichorRecettes) {
    const assocs = await db.select({
      moleculeName: molecules.name,
      proportion: moleculesRecettes.proportion
    }).from(moleculesRecettes)
      .innerJoin(molecules, eq(molecules.id, moleculesRecettes.moleculeId))
      .where(eq(moleculesRecettes.recetteId, r.id));
    
    console.log(`${r.name}: ${assocs.length} molécules`);
    assocs.forEach(a => console.log(`  - ${a.moleculeName} (${a.proportion}%)`));
  }
}

main().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
