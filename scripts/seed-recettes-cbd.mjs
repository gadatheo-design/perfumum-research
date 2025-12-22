import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { recettes, moleculesRecettes, molecules } from "../drizzle/schema.ts";
import { eq } from "drizzle-orm";

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("❌ DATABASE_URL not found in environment");
  process.exit(1);
}

// 10 recettes CBD réalistes avec profils terpéniques variés
const recettesCBD = [
  {
    name: "Northern Lights CBD",
    description: "Profil relaxant classique, idéal pour la détente nocturne. Dominance Myrcène pour effet sédatif prononcé.",
    terpenes: [
      { name: "Myrcène", proportion: 35.5 },
      { name: "β-Caryophyllène", proportion: 28.2 },
      { name: "Linalool", proportion: 18.3 },
      { name: "Limonène", proportion: 18.0 },
    ]
  },
  {
    name: "Harlequin CBD",
    description: "Équilibre parfait entre clarté mentale et relaxation. Riche en Pinène pour la concentration.",
    terpenes: [
      { name: "α-Pinène", proportion: 32.0 },
      { name: "Myrcène", proportion: 26.5 },
      { name: "β-Caryophyllène", proportion: 22.5 },
      { name: "Limonène", proportion: 19.0 },
    ]
  },
  {
    name: "ACDC CBD",
    description: "Profil énergisant et anti-inflammatoire. Dominance Limonène pour effet uplifting.",
    terpenes: [
      { name: "Limonène", proportion: 38.0 },
      { name: "α-Pinène", proportion: 24.5 },
      { name: "β-Pinène", proportion: 20.0 },
      { name: "β-Caryophyllène", proportion: 17.5 },
    ]
  },
  {
    name: "Charlotte's Web CBD",
    description: "Profil thérapeutique complet, anti-inflammatoire puissant. Équilibre Caryophyllène-Humulène.",
    terpenes: [
      { name: "β-Caryophyllène", proportion: 33.0 },
      { name: "Humulène", proportion: 27.5 },
      { name: "Myrcène", proportion: 21.0 },
      { name: "α-Pinène", proportion: 18.5 },
    ]
  },
  {
    name: "Cannatonic CBD",
    description: "Profil anxiolytique doux, parfait pour la gestion du stress quotidien.",
    terpenes: [
      { name: "Linalool", proportion: 36.0 },
      { name: "Myrcène", proportion: 28.0 },
      { name: "Limonène", proportion: 20.5 },
      { name: "β-Caryophyllène", proportion: 15.5 },
    ]
  },
  {
    name: "Ringo's Gift CBD",
    description: "Profil forestier frais, bronchodilatateur naturel. Dominance Pinène.",
    terpenes: [
      { name: "α-Pinène", proportion: 34.5 },
      { name: "β-Pinène", proportion: 29.0 },
      { name: "Limonène", proportion: 21.0 },
      { name: "Myrcène", proportion: 15.5 },
    ]
  },
  {
    name: "Harle-Tsu CBD",
    description: "Profil analgésique puissant, idéal pour douleurs chroniques.",
    terpenes: [
      { name: "β-Caryophyllène", proportion: 37.0 },
      { name: "Humulène", proportion: 25.5 },
      { name: "Linalool", proportion: 20.0 },
      { name: "Myrcène", proportion: 17.5 },
    ]
  },
  {
    name: "Sour Tsunami CBD",
    description: "Profil citronné énergisant, anti-dépresseur naturel.",
    terpenes: [
      { name: "Limonène", proportion: 40.0 },
      { name: "β-Pinène", proportion: 24.0 },
      { name: "α-Pinène", proportion: 20.5 },
      { name: "Myrcène", proportion: 15.5 },
    ]
  },
  {
    name: "Remedy CBD",
    description: "Profil sédatif profond, sommeil réparateur garanti.",
    terpenes: [
      { name: "Myrcène", proportion: 42.0 },
      { name: "Linalool", proportion: 28.5 },
      { name: "β-Caryophyllène", proportion: 18.0 },
      { name: "Humulène", proportion: 11.5 },
    ]
  },
  {
    name: "Stephen Hawking Kush CBD",
    description: "Profil complexe équilibré, synergie complète des 7 terpènes principaux.",
    terpenes: [
      { name: "Myrcène", proportion: 22.0 },
      { name: "Limonène", proportion: 18.5 },
      { name: "β-Caryophyllène", proportion: 16.0 },
      { name: "α-Pinène", proportion: 14.5 },
      { name: "Linalool", proportion: 13.0 },
      { name: "Humulène", proportion: 10.0 },
      { name: "β-Pinène", proportion: 6.0 },
    ]
  },
];

async function main() {
  console.log("🌿 Début de l'insertion des recettes CBD...\n");

  const connection = await mysql.createConnection(DATABASE_URL);
  const db = drizzle(connection);

  try {
    // Récupérer les IDs des molécules
    const allMolecules = await db.select().from(molecules);
    const moleculeMap = new Map();
    
    allMolecules.forEach(mol => {
      moleculeMap.set(mol.name, mol.id);
    });

    console.log(`📊 ${moleculeMap.size} molécules trouvées dans la base\n`);

    let recettesInserted = 0;
    let relationsInserted = 0;

    for (const recette of recettesCBD) {
      // Insérer la recette
      const [insertResult] = await db.insert(recettes).values({
        name: recette.name,
        category: "resine_cbd",
        description: recette.description,
        status: "validated",
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const recetteId = insertResult.insertId;
      recettesInserted++;

      console.log(`✅ Recette "${recette.name}" créée (ID: ${recetteId})`);

      // Insérer les relations molécules-recettes
      for (const terpene of recette.terpenes) {
        const moleculeId = moleculeMap.get(terpene.name);
        
        if (!moleculeId) {
          console.warn(`   ⚠️  Terpène "${terpene.name}" non trouvé dans la base`);
          continue;
        }

        await db.insert(moleculesRecettes).values({
          moleculeId: moleculeId,
          recetteId: recetteId,
          proportion: terpene.proportion.toString(),
          notes: `${terpene.proportion}% dans profil terpénique`,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        relationsInserted++;
        console.log(`   → ${terpene.name}: ${terpene.proportion}%`);
      }

      console.log("");
    }

    console.log("═".repeat(60));
    console.log(`🎉 Insertion terminée avec succès !`);
    console.log(`   📦 ${recettesInserted} recettes CBD créées`);
    console.log(`   🔗 ${relationsInserted} relations molécules-recettes créées`);
    console.log("═".repeat(60));

  } catch (error) {
    console.error("❌ Erreur lors de l'insertion:", error);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

main();
