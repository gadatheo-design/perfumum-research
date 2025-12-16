import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "../drizzle/schema";
import { eq } from "drizzle-orm";

const connection = await mysql.createConnection(process.env.DATABASE_URL!);
const db = drizzle(connection, { schema, mode: "default" });

console.log("=== Import des relations Volcanique ↔ Accords expérimentaux extrêmes ===\n");

// Récupérer toutes les variations Volcanique
const volcaniqueVariations = await db.select().from(schema.volcanique);
console.log(`📊 ${volcaniqueVariations.length} variations Volcanique trouvées`);

// Récupérer les accords extrêmes (isExtreme = 1)
const extremeAccords = await db
  .select()
  .from(schema.experimentalAccords)
  .where(eq(schema.experimentalAccords.isExtreme, 1));

console.log(`📊 ${extremeAccords.length} accords extrêmes trouvés\n`);

// Mapping des types Volcanique vers les accords extrêmes
// Basé sur les profils olfactifs extrêmes et les intentions
const mappings: Record<string, number[]> = {
  // Cratère actif (Soufré & Volcanique) - Accord 12
  basalte_chaud: [12, 19], // Cratère actif + Cendre froide (chaleur volcanique)
  basalte_froid: [19, 14], // Cendre froide + Fer & Sang (pierre froide)
  
  // Soufre & Chimique
  vapeur: [12, 20], // Cratère actif + Laboratoire (vapeurs chimiques)
  soufre: [12, 18], // Cratère actif + Fermentation acétique (soufre acide)
  
  // Minéral extrême
  poussiere_tectonique: [14, 19], // Fer & Sang + Cendre froide (poussière minérale)
  
  // Magma & Bitume
  magma_blanc: [15, 12], // Route fondue + Cratère actif (chaleur extrême)
  
  // Pierre poreuse & Marée
  pierre_poreuse: [17, 14], // Marée noire + Fer & Sang (pierre humide)
};

let relationCount = 0;

for (const variation of volcaniqueVariations) {
  const accordIds = mappings[variation.type];
  
  if (!accordIds || accordIds.length === 0) {
    console.log(`⚠️  Aucun mapping pour ${variation.type}`);
    continue;
  }

  for (const accordNumber of accordIds) {
    const accord = extremeAccords.find(a => a.number === accordNumber);
    
    if (!accord) {
      console.log(`⚠️  Accord ${accordNumber} introuvable`);
      continue;
    }

    // Insérer la relation
    await db.insert(schema.volcaniqueExperimentalAccords).values({
      volcaniqueId: variation.id,
      experimentalAccordId: accord.id,
    });

    relationCount++;
  }
}

console.log(`\n✅ ${relationCount} relations Volcanique ↔ Accords extrêmes créées avec succès !`);

await connection.end();
