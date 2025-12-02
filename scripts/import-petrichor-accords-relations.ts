import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "../drizzle/schema";
import { eq } from "drizzle-orm";

const connection = await mysql.createConnection(process.env.DATABASE_URL!);
const db = drizzle(connection, { schema, mode: "default" });

console.log("=== Import des relations Pétrichor ↔ Accords expérimentaux ===\n");

// Récupérer toutes les variations Pétrichor
const petrichorVariations = await db.select().from(schema.petrichor);
console.log(`📊 ${petrichorVariations.length} variations Pétrichor trouvées`);

// Récupérer les accords standards (isExtreme = 0)
const standardAccords = await db
  .select()
  .from(schema.experimentalAccords)
  .where(eq(schema.experimentalAccords.isExtreme, 0));

console.log(`📊 ${standardAccords.length} accords standards trouvés\n`);

// Mapping des sous-familles Pétrichor vers les accords standards
// Basé sur les profils olfactifs et les intentions
const mappings: Record<string, number[]> = {
  // Pétrichor urbain (Terre & Minéral) - Accord 1
  clair: [1, 3], // Pétrichor urbain + Figue & Iris (minéral doux)
  noir: [1, 5], // Pétrichor urbain + Cuir patiné (terre sombre)
  argile: [1, 9], // Pétrichor urbain + Bois flotté (terre sèche)
  
  // Végétal & Résine
  bois_humide: [2, 9], // Forêt méditerranéenne + Bois flotté
  racine: [2, 8], // Forêt méditerranéenne + Herbes fraîches
  mousse: [2, 10], // Forêt méditerranéenne + Miel & Foin
  
  // Minéral sec
  desert: [1, 7], // Pétrichor urbain + Épices orientales (chaleur minérale)
  
  // Marin & Iodé
  marin: [6], // Algue & Sel
  glaciaire: [6, 1], // Algue & Sel + Pétrichor urbain (froid minéral)
  
  // Urbain & Fumé
  urbain: [1, 4], // Pétrichor urbain + Encens noir
  sacre: [4, 2], // Encens noir + Forêt méditerranéenne (sacré végétal)
};

let relationCount = 0;

for (const variation of petrichorVariations) {
  const accordIds = mappings[variation.subfamily];
  
  if (!accordIds || accordIds.length === 0) {
    console.log(`⚠️  Aucun mapping pour ${variation.subfamily}`);
    continue;
  }

  for (const accordNumber of accordIds) {
    const accord = standardAccords.find(a => a.number === accordNumber);
    
    if (!accord) {
      console.log(`⚠️  Accord ${accordNumber} introuvable`);
      continue;
    }

    // Insérer la relation
    await db.insert(schema.petrichorExperimentalAccords).values({
      petrichorId: variation.id,
      experimentalAccordId: accord.id,
    });

    relationCount++;
  }
}

console.log(`\n✅ ${relationCount} relations Pétrichor ↔ Accords créées avec succès !`);

await connection.end();
