import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { plants, molecules, terpProfiles } from "../drizzle/schema.ts";
import { like, or } from "drizzle-orm";

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection);

// Rechercher Tagetes lucida dans les plantes
console.log("=== Recherche de Tagetes lucida dans plants ===");
const tagetesPlants = await db.select().from(plants).where(
  or(
    like(plants.name, '%Tagetes%'),
    like(plants.latinName, '%Tagetes%'),
    like(plants.name, '%Pericón%'),
    like(plants.name, '%pericon%')
  )
);
console.log("Plantes trouvées:", JSON.stringify(tagetesPlants, null, 2));

// Rechercher dans les molécules
console.log("\n=== Recherche de molécules liées à Tagetes ===");
const tagetesMolecules = await db.select().from(molecules).where(
  or(
    like(molecules.botanicalSources, '%Tagetes%'),
    like(molecules.sourceOrigin, '%Tagetes%'),
    like(molecules.name, '%estragole%'),
    like(molecules.name, '%méthyl-chavicol%'),
    like(molecules.name, '%anéthole%')
  )
);
console.log("Molécules trouvées:", tagetesMolecules.length);
for (const mol of tagetesMolecules) {
  console.log(`- ${mol.name} (${mol.family || 'N/A'}): ${mol.olfactiveProfile || 'N/A'}`);
}

// Rechercher dans les TerpProfiles
console.log("\n=== Recherche dans TerpProfiles ===");
const tagetesProfiles = await db.select().from(terpProfiles).where(
  or(
    like(terpProfiles.plantSource, '%Tagetes%'),
    like(terpProfiles.plantSource, '%Pericón%')
  )
);
console.log("TerpProfiles trouvés:", tagetesProfiles.length);
for (const tp of tagetesProfiles) {
  console.log(`- ${tp.code}: ${tp.plantSource} - ${tp.climaticAxis}`);
}

await connection.end();
