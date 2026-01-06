import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { plants } from "../drizzle/schema.ts";

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection);

const allPlants = await db.select({
  id: plants.id,
  name: plants.name,
  latinName: plants.latinName,
  origin: plants.origin,
  latitude: plants.latitude,
  longitude: plants.longitude,
  category: plants.category
}).from(plants).orderBy(plants.name);

console.log("Toutes les plantes:");
for (const plant of allPlants) {
  const hasGPS = plant.latitude && plant.longitude ? "✓" : "✗";
  console.log(`[${hasGPS}] ${plant.name} (${plant.latinName || 'N/A'}) - ${plant.origin || 'N/A'} - GPS: ${plant.latitude || 'null'}, ${plant.longitude || 'null'}`);
}
console.log(`\nTotal: ${allPlants.length} plantes`);
console.log(`Avec GPS: ${allPlants.filter(p => p.latitude && p.longitude).length}`);
console.log(`Sans GPS: ${allPlants.filter(p => !p.latitude || !p.longitude).length}`);

await connection.end();
