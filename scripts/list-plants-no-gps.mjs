import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { plants } from "../drizzle/schema.ts";
import { isNull, or } from "drizzle-orm";

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection);

const plantsWithoutGPS = await db.select({
  id: plants.id,
  name: plants.name,
  latinName: plants.latinName,
  origin: plants.origin,
  latitude: plants.latitude,
  longitude: plants.longitude
}).from(plants).where(or(isNull(plants.latitude), isNull(plants.longitude)));

console.log("Plantes sans coordonnées GPS:");
console.log(JSON.stringify(plantsWithoutGPS, null, 2));
console.log(`\nTotal: ${plantsWithoutGPS.length} plantes`);

await connection.end();
