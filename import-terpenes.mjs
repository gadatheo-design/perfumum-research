import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "./drizzle/schema.js";

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection, { schema, mode: "default" });

// Terpènes réels présents dans les résines CBD
const terpenes = [
  {
    name: "Myrcène",
    formula: "C₁₀H₁₆",
    description: "Terpène majoritaire dans le cannabis. Arôme terreux, musqué et herbacé avec des notes de clou de girofle.",
    olfactiveProfile: "Terreux, musqué, herbacé, clou de girofle",
    family: "Monoterpène",
    notes: "Propriétés relaxantes et sédatives. Point d'ébullition : 167°C. Présent dans le houblon, la mangue, le thym.",
  },
  {
    name: "Limonène",
    formula: "C₁₀H₁₆",
    description: "Second terpène le plus abondant dans le cannabis. Arôme d'agrumes frais et citronné.",
    olfactiveProfile: "Citron, orange, agrumes frais, zeste",
    family: "Monoterpène",
    notes: "Propriétés énergisantes et anti-stress. Point d'ébullition : 176°C. Présent dans les écorces d'agrumes, le romarin.",
  },
  {
    name: "α-Pinène",
    formula: "C₁₀H₁₆",
    description: "Terpène aromatique répandu dans la nature. Arôme de pin, résine de conifère et forêt.",
    olfactiveProfile: "Pin, résine, forêt de conifères, térébenthine",
    family: "Monoterpène",
    notes: "Propriétés bronchodilatatrices et anti-inflammatoires. Point d'ébullition : 156°C. Présent dans la résine de pin, le romarin.",
  },
  {
    name: "β-Pinène",
    formula: "C₁₀H₁₆",
    description: "Isomère du α-Pinène. Arôme de pin plus doux, boisé et herbacé.",
    olfactiveProfile: "Pin doux, boisé, herbacé, houblon",
    family: "Monoterpène",
    notes: "Propriétés anti-inflammatoires. Point d'ébullition : 166°C. Présent dans le houblon, le persil, le basilic.",
  },
  {
    name: "β-Caryophyllène",
    formula: "C₁₅H₂₄",
    description: "Sesquiterpène unique capable d'interagir avec le système endocannabinoïde. Arôme épicé, poivré et boisé.",
    olfactiveProfile: "Poivre noir, clou de girofle, épicé, boisé",
    family: "Sesquiterpène",
    notes: "Propriétés anti-inflammatoires et analgésiques. Point d'ébullition : 260°C. Présent dans le poivre noir, le clou de girofle.",
  },
  {
    name: "Linalool",
    formula: "C₁₀H₁₈O",
    description: "Terpène alcool aux propriétés apaisantes. Arôme floral de lavande et notes épicées.",
    olfactiveProfile: "Lavande, floral, épicé doux, bergamote",
    family: "Monoterpène alcool",
    notes: "Propriétés anxiolytiques et sédatives. Point d'ébullition : 198°C. Présent dans la lavande, la coriandre.",
  },
  {
    name: "Humulène",
    formula: "C₁₅H₂₄",
    description: "Sesquiterpène présent dans le houblon. Arôme terreux, boisé et herbacé.",
    olfactiveProfile: "Houblon, terreux, boisé, herbacé",
    family: "Sesquiterpène",
    notes: "Propriétés anti-inflammatoires et coupe-faim. Point d'ébullition : 198°C. Présent dans le houblon, la sauge.",
  },
];

console.log(`Importing ${terpenes.length} terpenes...`);

for (const terpene of terpenes) {
  const [result] = await db.insert(schema.molecules).values(terpene);
  console.log(`✓ Imported ${terpene.name} (${terpene.formula})`);
}

console.log("✅ Import completed!");
await connection.end();
