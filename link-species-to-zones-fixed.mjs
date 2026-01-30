import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { eq } from "drizzle-orm";
import * as schema from "./drizzle/schema.ts";

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection, { schema, mode: "default" });

// Récupérer les IDs des nouvelles espèces
const santalumSpicatum = await db.select().from(schema.plants).where(eq(schema.plants.latinName, "Santalum spicatum")).limit(1);
const aquilariaCrassna = await db.select().from(schema.plants).where(eq(schema.plants.latinName, "Aquilaria crassna")).limit(1);
const cinnamomumVerum = await db.select().from(schema.plants).where(eq(schema.plants.latinName, "Cinnamomum verum")).limit(1);
const syzygiumAromaticum = await db.select().from(schema.plants).where(eq(schema.plants.latinName, "Syzygium aromaticum")).limit(1);
const liquidambarOrientalis = await db.select().from(schema.plants).where(eq(schema.plants.latinName, "Liquidambar orientalis")).limit(1);
const styraxBenzoin = await db.select().from(schema.plants).where(eq(schema.plants.latinName, "Styrax benzoin")).limit(1);

// Définir les liaisons espèces-zones avec les IDs corrects
const speciesZoneLinks = [
  // Santalum spicatum - Australie occidentale (Zone 30003)
  {
    plantId: santalumSpicatum[0]?.id,
    zoneId: 30003,
    notes: "Espèce endémique d'Australie occidentale, régions semi-arides"
  },
  
  // Aquilaria crassna - Asie du Sud-Est Triangle Aquilaria (Zone 3)
  {
    plantId: aquilariaCrassna[0]?.id,
    zoneId: 3,
    notes: "Forêts tropicales du Cambodge, Laos et Vietnam"
  },
  
  // Cinnamomum verum - Sri Lanka (Zone 30005)
  {
    plantId: cinnamomumVerum[0]?.id,
    zoneId: 30005,
    notes: "Endémique du Sri Lanka, forêts tropicales humides"
  },
  
  // Syzygium aromaticum - Zanzibar (Zone 30006)
  {
    plantId: syzygiumAromaticum[0]?.id,
    zoneId: 30006,
    notes: "Zanzibar et Madagascar (production principale)"
  },
  
  // Syzygium aromaticum - Indonésie (Zone 8 - Kalimantan)
  {
    plantId: syzygiumAromaticum[0]?.id,
    zoneId: 8,
    notes: "Indonésie (Moluques, origine historique du giroflier)"
  },
  
  // Liquidambar orientalis - Turquie (Zone 30004)
  {
    plantId: liquidambarOrientalis[0]?.id,
    zoneId: 30004,
    notes: "Sud-ouest de la Turquie (région de Marmaris)"
  },
  
  // Styrax benzoin - Sumatra (Zone 30007)
  {
    plantId: styraxBenzoin[0]?.id,
    zoneId: 30007,
    notes: "Indonésie (Sumatra et Java), forêts tropicales de montagne"
  }
];

console.log(`🔗 Création de ${speciesZoneLinks.length} liaisons espèces-zones corrigées...`);

for (const link of speciesZoneLinks) {
  if (!link.plantId || !link.zoneId) {
    console.log(`⚠️ Liaison ignorée (données manquantes): plantId=${link.plantId}, zoneId=${link.zoneId}`);
    continue;
  }
  
  try {
    await db.insert(schema.plantGeographicZones).values(link);
    const plant = await db.select().from(schema.plants).where(eq(schema.plants.id, link.plantId)).limit(1);
    const zone = await db.select().from(schema.geographicZones).where(eq(schema.geographicZones.id, link.zoneId)).limit(1);
    console.log(`✅ ${plant[0]?.name} ↔ ${zone[0]?.name} (${link.notes})`);
  } catch (error) {
    console.error(`❌ Erreur lors de la création de la liaison:`, error.message);
  }
}

console.log(`\n✨ Liaisons créées avec succès !`);

await connection.end();
