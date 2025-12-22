#!/usr/bin/env node
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection);

console.log("📊 Import de l'échelle sensorielle ABSORBE...\n");

// ============================================================================
// 8 AXES SENSORIELS
// ============================================================================

const sensoryAxes = [
  {
    type: "axis",
    name: "Intensité",
    description: "Puissance olfactive globale, de subtil à écrasant",
    scale: "1-10",
    order: 1
  },
  {
    type: "axis",
    name: "Complexité",
    description: "Nombre de facettes perceptibles, de linéaire à multidimensionnel",
    scale: "1-10",
    order: 2
  },
  {
    type: "axis",
    name: "Évolution",
    description: "Transformation dans le temps, de statique à dynamique",
    scale: "1-10",
    order: 3
  },
  {
    type: "axis",
    name: "Persistance",
    description: "Durée de présence olfactive, de fugace à tenace",
    scale: "1-10",
    order: 4
  },
  {
    type: "axis",
    name: "Texture",
    description: "Sensation tactile évoquée, de lisse à rugueux",
    scale: "1-10",
    order: 5
  },
  {
    type: "axis",
    name: "Température",
    description: "Impression thermique, de glacial à brûlant",
    scale: "1-10",
    order: 6
  },
  {
    type: "axis",
    name: "Luminosité",
    description: "Clarté perçue, de sombre à lumineux",
    scale: "1-10",
    order: 7
  },
  {
    type: "axis",
    name: "Densité",
    description: "Poids olfactif, de léger/aérien à dense/lourd",
    scale: "1-10",
    order: 8
  }
];

// ============================================================================
// 10 FAMILLES OLFACTIVES ABSORBE
// ============================================================================

const olfactiveFamilies = [
  {
    type: "family",
    name: "Minéral",
    description: "Pierre, terre, métal, pétrichor, notes géologiques",
    scale: "N/A",
    order: 1
  },
  {
    type: "family",
    name: "Végétal Vert",
    description: "Herbes fraîches, feuilles, sève, chlorophylle",
    scale: "N/A",
    order: 2
  },
  {
    type: "family",
    name: "Boisé",
    description: "Bois sec, écorce, sciure, résine de conifère",
    scale: "N/A",
    order: 3
  },
  {
    type: "family",
    name: "Résine & Balsamique",
    description: "Encens, myrrhe, benjoin, gommes aromatiques",
    scale: "N/A",
    order: 4
  },
  {
    type: "family",
    name: "Floral",
    description: "Pétales, pollens, notes florales blanches ou sombres",
    scale: "N/A",
    order: 5
  },
  {
    type: "family",
    name: "Épicé",
    description: "Épices chaudes, poivre, cannelle, cardamome",
    scale: "N/A",
    order: 6
  },
  {
    type: "family",
    name: "Cuir & Animal",
    description: "Cuir tanné, notes animales, musquées, fécales",
    scale: "N/A",
    order: 7
  },
  {
    type: "family",
    name: "Fumé & Pyrogéné",
    description: "Fumée de bois, tabac, goudron, cendre, carbonisé",
    scale: "N/A",
    order: 8
  },
  {
    type: "family",
    name: "Lactonique & Gourmand",
    description: "Lait, crème, vanille, miel, notes sucrées",
    scale: "N/A",
    order: 9
  },
  {
    type: "family",
    name: "Marin & Iodé",
    description: "Algue, sel, air marin, notes aquatiques",
    scale: "N/A",
    order: 10
  }
];

console.log("Importation des 8 axes sensoriels...");
for (const axis of sensoryAxes) {
  await connection.execute(
    `INSERT INTO sensory_scales (\`type\`, \`name\`, \`description\`, \`scale\`, \`order\`) 
     VALUES (?, ?, ?, ?, ?)`,
    [axis.type, axis.name, axis.description, axis.scale, axis.order]
  );
  console.log(`  ✓ ${axis.name} (${axis.scale})`);
}

console.log("\nImportation des 10 familles olfactives ABSORBE...");
for (const family of olfactiveFamilies) {
  await connection.execute(
    `INSERT INTO sensory_scales (\`type\`, \`name\`, \`description\`, \`scale\`, \`order\`) 
     VALUES (?, ?, ?, ?, ?)`,
    [family.type, family.name, family.description, family.scale, family.order]
  );
  console.log(`  ✓ ${family.name}`);
}

console.log("\n✅ Import terminé avec succès !");
console.log(`   - 8 axes sensoriels`);
console.log(`   - 10 familles olfactives`);
console.log(`   - Total: 18 échelles sensorielles`);

await connection.end();
