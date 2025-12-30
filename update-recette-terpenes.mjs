import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "./drizzle/schema.js";
import { eq, and } from "drizzle-orm";

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection, { schema, mode: "default" });

// Récupérer IDs des recettes CBD
const recettesCBD = await db
  .select()
  .from(schema.recettes)
  .where(eq(schema.recettes.category, "resine_cbd"));

console.log(`Found ${recettesCBD.length} CBD recipes`);

// Récupérer IDs des nouveaux terpènes
const terpenes = await db
  .select()
  .from(schema.molecules)
  .where(eq(schema.molecules.name, "Myrcène"))
  .union(
    db.select().from(schema.molecules).where(eq(schema.molecules.name, "Limonène"))
  )
  .union(
    db.select().from(schema.molecules).where(eq(schema.molecules.name, "α-Pinène"))
  )
  .union(
    db.select().from(schema.molecules).where(eq(schema.molecules.name, "β-Caryophyllène"))
  )
  .union(
    db.select().from(schema.molecules).where(eq(schema.molecules.name, "Linalool"))
  );

console.log(`Found ${terpenes.length} terpenes`);

// Supprimer anciennes liaisons
await db.delete(schema.recetteMolecules);
console.log("✓ Deleted old links");

// Créer nouvelles liaisons avec profils terpéniques réalistes
const profiles = {
  // Collection Classique
  "Mastiha Brut": [
    { terpene: "α-Pinène", proportion: 35, role: "base" },
    { terpene: "β-Caryophyllène", proportion: 25, role: "accent" },
    { terpene: "Limonène", proportion: 20, role: "accent" },
    { terpene: "Myrcène", proportion: 20, role: "fixative" },
  ],
  "Vétiver Labdanum": [
    { terpene: "β-Caryophyllène", proportion: 40, role: "base" },
    { terpene: "Myrcène", proportion: 30, role: "accent" },
    { terpene: "α-Pinène", proportion: 30, role: "fixative" },
  ],
  "Figue & Santal Blanc": [
    { terpene: "Linalool", proportion: 35, role: "base" },
    { terpene: "Limonène", proportion: 30, role: "accent" },
    { terpene: "Myrcène", proportion: 35, role: "fixative" },
  ],
  "Noir de Myrrhe": [
    { terpene: "β-Caryophyllène", proportion: 45, role: "base" },
    { terpene: "α-Pinène", proportion: 30, role: "accent" },
    { terpene: "Myrcène", proportion: 25, role: "fixative" },
  ],
  "Cuir d'Ambre": [
    { terpene: "Myrcène", proportion: 40, role: "base" },
    { terpene: "β-Caryophyllène", proportion: 35, role: "accent" },
    { terpene: "Linalool", proportion: 25, role: "fixative" },
  ],
  
  // Collection Expérimentale
  "Sève Noire / Feuillage Mort": [
    { terpene: "Myrcène", proportion: 50, role: "base" },
    { terpene: "β-Caryophyllène", proportion: 30, role: "accent" },
    { terpene: "α-Pinène", proportion: 20, role: "fixative" },
  ],
  "Métal Liquide": [
    { terpene: "α-Pinène", proportion: 40, role: "base" },
    { terpene: "Limonène", proportion: 35, role: "accent" },
    { terpene: "β-Caryophyllène", proportion: 25, role: "fixative" },
  ],
  "Feu Fumé / Soufre Doux": [
    { terpene: "β-Caryophyllène", proportion: 50, role: "base" },
    { terpene: "Myrcène", proportion: 30, role: "accent" },
    { terpene: "α-Pinène", proportion: 20, role: "fixative" },
  ],
  "Orchidée Salée": [
    { terpene: "Linalool", proportion: 45, role: "base" },
    { terpene: "Limonène", proportion: 30, role: "accent" },
    { terpene: "Myrcène", proportion: 25, role: "fixative" },
  ],
  "Distillat de Nuit / Morphée": [
    { terpene: "Myrcène", proportion: 45, role: "base" },
    { terpene: "Linalool", proportion: 30, role: "accent" },
    { terpene: "β-Caryophyllène", proportion: 25, role: "fixative" },
  ],
};

// Créer liaisons
let count = 0;
for (const recette of recettesCBD) {
  const profile = profiles[recette.name];
  if (!profile) {
    console.log(`⚠ No profile for ${recette.name}`);
    continue;
  }
  
  for (const link of profile) {
    const terpene = terpenes.find(t => t.name === link.terpene);
    if (!terpene) {
      console.log(`⚠ Terpene ${link.terpene} not found`);
      continue;
    }
    
    await db.insert(schema.recetteMolecules).values({
      recetteId: recette.id,
      moleculeId: terpene.id,
      proportion: link.proportion,
      role: link.role,
    });
    count++;
  }
  console.log(`✓ Linked ${recette.name} (${profile.length} terpenes)`);
}

console.log(`✅ Created ${count} links!`);
await connection.end();
