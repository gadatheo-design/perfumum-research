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

// Récupérer les zones géographiques existantes
const allZones = await db.select().from(schema.geographicZones);

console.log("🗺️ Zones disponibles:");
allZones.forEach(zone => {
  console.log(`  - ${zone.name} (${zone.region}) [ID: ${zone.id}]`);
});

// Définir les liaisons espèces-zones
const speciesZoneLinks = [
  // Santalum spicatum - Australie occidentale
  {
    plantId: santalumSpicatum[0]?.id,
    zoneId: allZones.find(z => z.region?.includes("Australie") || z.name?.includes("Australie"))?.id || 15, // Zone 15 = Océanie/Australie
    notes: "Espèce endémique d'Australie occidentale, régions semi-arides"
  },
  
  // Aquilaria crassna - Asie du Sud-Est (Cambodge, Laos, Vietnam)
  {
    plantId: aquilariaCrassna[0]?.id,
    zoneId: allZones.find(z => z.region?.includes("Asie du Sud-Est") || z.name?.includes("Asie du Sud-Est"))?.id || 10, // Zone 10 = Asie du Sud-Est
    notes: "Forêts tropicales du Cambodge, Laos et Vietnam"
  },
  
  // Cinnamomum verum - Sri Lanka
  {
    plantId: cinnamomumVerum[0]?.id,
    zoneId: allZones.find(z => z.region?.includes("Asie du Sud") || z.name?.includes("Sri Lanka"))?.id || 9, // Zone 9 = Asie du Sud
    notes: "Endémique du Sri Lanka, forêts tropicales humides"
  },
  
  // Syzygium aromaticum - Zanzibar, Madagascar, Indonésie
  {
    plantId: syzygiumAromaticum[0]?.id,
    zoneId: allZones.find(z => z.region?.includes("Afrique de l'Est") || z.name?.includes("Afrique de l'Est"))?.id || 4, // Zone 4 = Afrique de l'Est
    notes: "Zanzibar et Madagascar (production principale)"
  },
  {
    plantId: syzygiumAromaticum[0]?.id,
    zoneId: allZones.find(z => z.region?.includes("Asie du Sud-Est") || z.name?.includes("Asie du Sud-Est"))?.id || 10, // Zone 10 = Asie du Sud-Est
    notes: "Indonésie (Moluques, origine historique)"
  },
  
  // Liquidambar orientalis - Turquie
  {
    plantId: liquidambarOrientalis[0]?.id,
    zoneId: allZones.find(z => z.region?.includes("Méditerranée") || z.name?.includes("Méditerranée"))?.id || 6, // Zone 6 = Méditerranée
    notes: "Sud-ouest de la Turquie (région de Marmaris)"
  },
  
  // Styrax benzoin - Sumatra, Java (Indonésie)
  {
    plantId: styraxBenzoin[0]?.id,
    zoneId: allZones.find(z => z.region?.includes("Asie du Sud-Est") || z.name?.includes("Asie du Sud-Est"))?.id || 10, // Zone 10 = Asie du Sud-Est
    notes: "Indonésie (Sumatra et Java), forêts tropicales de montagne"
  }
];

console.log(`\n🔗 Création de ${speciesZoneLinks.length} liaisons espèces-zones...`);

for (const link of speciesZoneLinks) {
  if (!link.plantId || !link.zoneId) {
    console.log(`⚠️ Liaison ignorée (données manquantes): plantId=${link.plantId}, zoneId=${link.zoneId}`);
    continue;
  }
  
  try {
    await db.insert(schema.plantGeographicZones).values(link);
    const plant = await db.select().from(schema.plants).where(eq(schema.plants.id, link.plantId)).limit(1);
    const zone = await db.select().from(schema.geographicZones).where(eq(schema.geographicZones.id, link.zoneId)).limit(1);
    console.log(`✅ ${plant[0]?.name} ↔ ${zone[0]?.name}`);
  } catch (error) {
    console.error(`❌ Erreur lors de la création de la liaison:`, error.message);
  }
}

console.log(`\n✨ Liaisons créées avec succès !`);

await connection.end();
