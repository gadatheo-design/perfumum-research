import { db } from './server/db.ts';
import { molecules } from './drizzle/schema.ts';
import { eq, and } from 'drizzle-orm';
import fs from 'fs';

const defaultMolecules = await db.select({
  id: molecules.id,
  name: molecules.name,
  family: molecules.family,
  olfactiveProfile: molecules.olfactiveProfile
}).from(molecules).where(
  and(
    eq(molecules.radarIntensity, 50),
    eq(molecules.radarFreshness, 50),
    eq(molecules.radarWarmth, 50),
    eq(molecules.radarSweetness, 50),
    eq(molecules.radarSpiciness, 50),
    eq(molecules.radarEarthiness, 50)
  )
).orderBy(molecules.name);

console.log(`Found ${defaultMolecules.length} molecules with default radar values`);
fs.writeFileSync('default-molecules.json', JSON.stringify(defaultMolecules, null, 2));
console.log('Exported to default-molecules.json');
process.exit(0);
