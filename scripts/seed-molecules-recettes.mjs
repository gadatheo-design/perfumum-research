import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "../drizzle/schema.js";

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection, { schema, mode: "default" });

console.log("🌱 Seed molecules_recettes : création données d'exemple réalistes\n");

// Données réalistes : 10 recettes CBD × proportions terpènes variées
const seedData = [
  // Recette 60001: Mastiha Brut (profil résineux, terreux)
  { recetteId: 60001, moleculeId: 1, proportion: "35.5", notes: "Dominant myrcène pour effet relaxant" },
  { recetteId: 60001, moleculeId: 3, proportion: "18.2", notes: "β-Pinène pour fraîcheur résineuse" },
  { recetteId: 60001, moleculeId: 4, proportion: "12.8", notes: "Caryophyllène pour profondeur épicée" },
  { recetteId: 60001, moleculeId: 7, proportion: "8.5", notes: "Humulène pour notes boisées" },
  
  // Recette 60002: Vétiver Labdanum (profil fumé, ambré)
  { recetteId: 60002, moleculeId: 4, proportion: "28.3", notes: "Caryophyllène dominant pour chaleur" },
  { recetteId: 60002, moleculeId: 1, proportion: "22.1", notes: "Myrcène pour rondeur" },
  { recetteId: 60002, moleculeId: 7, proportion: "15.6", notes: "Humulène pour notes terreuses" },
  { recetteId: 60002, moleculeId: 5, proportion: "9.2", notes: "Linalool pour douceur florale" },
  
  // Recette 60003: Figue & Santal Blanc (profil lacté, doux)
  { recetteId: 60003, moleculeId: 5, proportion: "32.4", notes: "Linalool dominant pour douceur" },
  { recetteId: 60003, moleculeId: 2, proportion: "19.7", notes: "Limonène pour fraîcheur fruitée" },
  { recetteId: 60003, moleculeId: 1, proportion: "16.3", notes: "Myrcène pour rondeur lactée" },
  { recetteId: 60003, moleculeId: 4, proportion: "7.8", notes: "Caryophyllène pour structure" },
  
  // Recette 60004: Noir de Myrrhe (profil sombre, résineux)
  { recetteId: 60004, moleculeId: 4, proportion: "31.2", notes: "Caryophyllène pour profondeur" },
  { recetteId: 60004, moleculeId: 1, proportion: "24.6", notes: "Myrcène pour effet apaisant" },
  { recetteId: 60004, moleculeId: 7, proportion: "18.4", notes: "Humulène pour notes boisées sombres" },
  { recetteId: 60004, moleculeId: 3, proportion: "11.2", notes: "β-Pinène pour contraste frais" },
  
  // Recette 60005: Cuir d'Ambre (profil animal, chaud)
  { recetteId: 60005, moleculeId: 4, proportion: "36.8", notes: "Caryophyllène dominant pour chaleur épicée" },
  { recetteId: 60005, moleculeId: 7, proportion: "21.3", notes: "Humulène pour notes cuirées" },
  { recetteId: 60005, moleculeId: 1, proportion: "17.9", notes: "Myrcène pour rondeur" },
  { recetteId: 60005, moleculeId: 6, proportion: "9.4", notes: "α-Pinène pour fraîcheur subtile" },
  
  // Recette 60006: Sève Noire / Feuillage Mort (profil forestier, humide)
  { recetteId: 60006, moleculeId: 3, proportion: "29.7", notes: "β-Pinène dominant pour notes de pin" },
  { recetteId: 60006, moleculeId: 6, proportion: "23.5", notes: "α-Pinène pour fraîcheur résineuse" },
  { recetteId: 60006, moleculeId: 1, proportion: "19.8", notes: "Myrcène pour humidité terreuse" },
  { recetteId: 60006, moleculeId: 7, proportion: "12.6", notes: "Humulène pour profondeur boisée" },
  
  // Recette 60007: Métal Liquide (profil minéral, froid)
  { recetteId: 60007, moleculeId: 2, proportion: "34.2", notes: "Limonène dominant pour fraîcheur métallique" },
  { recetteId: 60007, moleculeId: 6, proportion: "26.8", notes: "α-Pinène pour notes froides" },
  { recetteId: 60007, moleculeId: 3, proportion: "18.3", notes: "β-Pinène pour minéralité" },
  { recetteId: 60007, moleculeId: 5, proportion: "8.1", notes: "Linalool pour adoucir" },
  
  // Recette 60008: Feu Fumé / Soufre Doux (profil fumé, soufré)
  { recetteId: 60008, moleculeId: 4, proportion: "33.6", notes: "Caryophyllène pour notes fumées" },
  { recetteId: 60008, moleculeId: 1, proportion: "25.4", notes: "Myrcène pour rondeur" },
  { recetteId: 60008, moleculeId: 7, proportion: "17.2", notes: "Humulène pour profondeur terreuse" },
  { recetteId: 60008, moleculeId: 2, proportion: "9.8", notes: "Limonène pour contraste frais" },
  
  // Recette 60009: Orchidée Salée (profil floral, marin)
  { recetteId: 60009, moleculeId: 5, proportion: "38.1", notes: "Linalool dominant pour floralité" },
  { recetteId: 60009, moleculeId: 2, proportion: "22.7", notes: "Limonène pour fraîcheur marine" },
  { recetteId: 60009, moleculeId: 1, proportion: "16.4", notes: "Myrcène pour douceur" },
  { recetteId: 60009, moleculeId: 4, proportion: "8.9", notes: "Caryophyllène pour structure" },
  
  // Recette 60010: Distillat de Nuit / Morphée (profil apaisant, nocturne)
  { recetteId: 60010, moleculeId: 1, proportion: "42.3", notes: "Myrcène dominant pour effet sédatif" },
  { recetteId: 60010, moleculeId: 5, proportion: "28.6", notes: "Linalool pour relaxation" },
  { recetteId: 60010, moleculeId: 4, proportion: "14.2", notes: "Caryophyllène pour profondeur" },
  { recetteId: 60010, moleculeId: 7, proportion: "7.4", notes: "Humulène pour notes boisées apaisantes" },
];

console.log(`📦 ${seedData.length} relations à insérer\n`);

let insertCount = 0;
let skipCount = 0;

for (const data of seedData) {
  try {
    await db.insert(schema.moleculesRecettes).values(data);
    console.log(`✓ Recette ${data.recetteId} + Molécule ${data.moleculeId} → ${data.proportion}%`);
    insertCount++;
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      console.log(`⚠️  Relation déjà existante (recette ${data.recetteId}, molécule ${data.moleculeId})`);
      skipCount++;
    } else {
      console.error(`❌ Erreur insertion:`, error.message);
    }
  }
}

console.log(`\n✅ Seed terminé:`);
console.log(`   - ${insertCount} relations insérées`);
console.log(`   - ${skipCount} relations ignorées (doublons)`);

await connection.end();
