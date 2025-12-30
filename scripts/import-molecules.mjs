import { drizzle } from "drizzle-orm/mysql2";
import { molecules } from "../drizzle/schema.ts";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config();

const db = drizzle(process.env.DATABASE_URL);

// Données du CSV intégrées directement
const moleculesData = [
  {
    name: "Hexanoic acid",
    family: "Organique / Cheese",
    chemicalFormula: "C6H12O2",
    olfactiveProfile: "fermentée, laiteuse, charnelle",
    emotionalResonance: "matérialité du vivant",
    functionalEffect: null,
    sourceOrigin: null,
    concentration: null,
    notes: null,
  },
  {
    name: "Linalol",
    family: "Florale",
    chemicalFormula: "C10H18O",
    olfactiveProfile: "doux, lavandé, transparent",
    emotionalResonance: "respiration ouverte",
    functionalEffect: null,
    sourceOrigin: null,
    concentration: null,
    notes: null,
  },
  {
    name: "Ambroxan",
    family: "Ambrée / Boisée",
    chemicalFormula: "C16H28O",
    olfactiveProfile: "chaud, velouté, diffusant",
    emotionalResonance: "chaleur du silence",
    functionalEffect: null,
    sourceOrigin: null,
    concentration: null,
    notes: null,
  },
];

// Add additional molecules from arch_1.txt and arch_2.txt (manual curation)
const additionalMolecules = [
  {
    name: "Géosmine",
    family: "Terpène / Terre",
    chemicalFormula: "C12H22O",
    olfactiveProfile: "Terre humide, pluie, sous-bois, betterave",
    emotionalResonance: "Mémoire de la pluie, ancrage terrestre",
    functionalEffect: "Marqueur du petrichor",
    sourceOrigin: "Actinomycètes du sol",
    concentration: "Détectable à 0.1 ppb",
    notes: "Molécule clé du phénomène petrichor. Responsable de l'odeur de terre mouillée après la pluie.",
  },
  {
    name: "Caryophyllène",
    family: "Sesquiterpène",
    chemicalFormula: "C15H24",
    olfactiveProfile: "Épicé, boisé, poivré, clou de girofle",
    emotionalResonance: "Chaleur épicée, profondeur",
    functionalEffect: "Anti-inflammatoire, cannabinoïde (CB2)",
    sourceOrigin: "Cannabis, poivre noir, clou de girofle",
    concentration: "Variable selon source",
    notes: "Sesquiterpène majeur du cannabis. Seul terpène connu à agir comme cannabinoïde.",
  },
  {
    name: "Myrcène",
    family: "Monoterpène",
    chemicalFormula: "C10H16",
    olfactiveProfile: "Terreux, musqué, herbacé, clou de girofle",
    emotionalResonance: "Relaxation, ancrage",
    functionalEffect: "Sédatif, analgésique",
    sourceOrigin: "Cannabis, houblon, thym, citronnelle",
    concentration: "Variable selon source",
    notes: "Terpène le plus abondant dans de nombreuses variétés de cannabis.",
  },
  {
    name: "Limonène",
    family: "Monoterpène",
    chemicalFormula: "C10H16",
    olfactiveProfile: "Agrume, citron, orange",
    emotionalResonance: "Élévation, clarté mentale",
    functionalEffect: "Anxiolytique, antidépresseur",
    sourceOrigin: "Agrumes, menthe, genévrier",
    concentration: "Variable selon source",
    notes: "Deuxième terpène le plus répandu dans la nature après le pinène.",
  },
  {
    name: "Pinène (α et β)",
    family: "Monoterpène",
    chemicalFormula: "C10H16",
    olfactiveProfile: "Pin, résine, forêt, frais",
    emotionalResonance: "Clarté, vigilance, connexion à la nature",
    functionalEffect: "Bronchodilatateur, anti-inflammatoire",
    sourceOrigin: "Pin, sapin, romarin, cannabis",
    concentration: "Variable selon source",
    notes: "Terpène le plus répandu dans le règne végétal. Deux isomères : α-pinène et β-pinène.",
  },
  {
    name: "Linalool",
    family: "Monoterpène alcool",
    chemicalFormula: "C10H18O",
    olfactiveProfile: "Floral, lavande, doux, légèrement épicé",
    emotionalResonance: "Apaisement, douceur, relaxation",
    functionalEffect: "Anxiolytique, sédatif, analgésique",
    sourceOrigin: "Lavande, coriandre, cannabis",
    concentration: "Variable selon source",
    notes: "Utilisé en parfumerie et aromathérapie pour ses propriétés calmantes.",
  },
];

async function importMolecules() {
  console.log("🚀 Début de l'import des molécules...\n");

  try {
    const allMolecules = [...moleculesData, ...additionalMolecules];
    
    console.log(`📊 Total de molécules à importer: ${allMolecules.length}\n`);

    for (const molecule of allMolecules) {
      console.log(`📝 Import de la molécule: ${molecule.name}...`);
      
      await db.insert(molecules).values(molecule);
      
      console.log(`✅ ${molecule.name} importée avec succès\n`);
    }

    console.log("🎉 Import terminé avec succès !");
    console.log(`📊 Total: ${allMolecules.length} molécules importées`);
    
  } catch (error) {
    console.error("❌ Erreur lors de l'import:", error);
    process.exit(1);
  }
  
  process.exit(0);
}

importMolecules();
