#!/usr/bin/env node
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection);

console.log("🔬 Import des données chimiques du manuel technique...\n");

// ============================================================================
// 1. FAMILLES CHIMIQUES (4 familles)
// ============================================================================

const chemicalFamiliesData = [
  {
    name: "Acides Gras",
    type: "acides_gras",
    description: "Famille chimique responsable des notes fromagées, beurrées et lactées. Présents naturellement dans les processus de fermentation.",
    olfactiveRole: "Rondeur, profondeur, notes animales et fromagées",
    volatility: "Faible à Moyenne",
    polarity: "Moyenne à Élevée"
  },
  {
    name: "Acides Aromatiques",
    type: "acides_aromatiques",
    description: "Famille chimique apportant des notes balsamiques, vanillées et épicées. Issus de la dégradation thermique de composés phénoliques.",
    olfactiveRole: "Balsamique, vanillé, notes de foin et de miel",
    volatility: "Moyenne",
    polarity: "Élevée"
  },
  {
    name: "Esters",
    type: "esters",
    description: "Famille chimique caractérisée par des notes fruitées, florales et fraîches. Très volatils et perceptibles dès les premières notes.",
    olfactiveRole: "Fraîcheur, fruité, floral, légèreté",
    volatility: "Forte",
    polarity: "Faible à Moyenne"
  },
  {
    name: "Indoles",
    type: "indoles",
    description: "Famille chimique complexe aux notes animales, florales et fécales. Présents dans le tabac fermenté et certaines fleurs blanches.",
    olfactiveRole: "Animalité, profondeur florale, notes fécales à faible concentration",
    volatility: "Moyenne à Forte",
    polarity: "Moyenne"
  }
];

console.log("Importation des 4 familles chimiques...");
for (const family of chemicalFamiliesData) {
  await connection.execute(
    `INSERT INTO chemical_families (name, type, description, olfactiveRole, volatility, polarity) 
     VALUES (?, ?, ?, ?, ?, ?)`,
    [family.name, family.type, family.description, family.olfactiveRole, family.volatility, family.polarity]
  );
  console.log(`  ✓ ${family.name}`);
}

// ============================================================================
// 2. MOLÉCULES (20 molécules réparties dans les 4 familles)
// ============================================================================

const moleculesData = [
  // ACIDES GRAS (5 molécules)
  {
    name: "Acide Hexanoïque (C6)",
    formula: "C6H12O2",
    family: "acides_gras",
    olfactiveProfile: "Fromage, chèvre, beurre rance",
    functionalEffect: "Rondeur, profondeur",
    emotion: "Nostalgie, rusticité"
  },
  {
    name: "Acide Octanoïque (C8)",
    formula: "C8H16O2",
    family: "acides_gras",
    olfactiveProfile: "Fromage affiné, cuir, sueur",
    functionalEffect: "Animalité, corps",
    emotion: "Intensité, présence"
  },
  {
    name: "Acide Décanoïque (C10)",
    formula: "C10H20O2",
    family: "acides_gras",
    olfactiveProfile: "Crème, lait caillé, savon",
    functionalEffect: "Onctuosité, douceur",
    emotion: "Confort, chaleur"
  },
  {
    name: "Acide Linoléique",
    formula: "C18H32O2",
    family: "acides_gras",
    olfactiveProfile: "Huile végétale, noix, gras",
    functionalEffect: "Texture, corps",
    emotion: "Naturalité, terre"
  },
  {
    name: "Acide Oléique",
    formula: "C18H34O2",
    family: "acides_gras",
    olfactiveProfile: "Huile d'olive, gras doux",
    functionalEffect: "Rondeur, fluidité",
    emotion: "Méditerranéen, solaire"
  },
  
  // ACIDES AROMATIQUES (5 molécules)
  {
    name: "Acide Benzoïque",
    formula: "C7H6O2",
    family: "acides_aromatiques",
    olfactiveProfile: "Balsamique, vanillé, poudré",
    functionalEffect: "Fixation, profondeur",
    emotion: "Réconfort, douceur"
  },
  {
    name: "Acide Cinnamique",
    formula: "C9H8O2",
    family: "acides_aromatiques",
    olfactiveProfile: "Cannelle, épicé, balsamique",
    functionalEffect: "Chaleur, épice",
    emotion: "Exotisme, vivacité"
  },
  {
    name: "Acide Caféique",
    formula: "C9H8O4",
    family: "acides_aromatiques",
    olfactiveProfile: "Café, torréfié, amer",
    functionalEffect: "Amertume, profondeur",
    emotion: "Éveil, intensité"
  },
  {
    name: "Acide Férulique",
    formula: "C10H10O4",
    family: "acides_aromatiques",
    olfactiveProfile: "Vanille, foin, miel",
    functionalEffect: "Suavité, rondeur",
    emotion: "Nostalgie, chaleur"
  },
  {
    name: "Acide Coumarique",
    formula: "C9H8O3",
    family: "acides_aromatiques",
    olfactiveProfile: "Foin coupé, miel, tabac blond",
    functionalEffect: "Douceur, notes de foin",
    emotion: "Campagne, sérénité"
  },
  
  // ESTERS (5 molécules)
  {
    name: "Éthyl Butyrate",
    formula: "C6H12O2",
    family: "esters",
    olfactiveProfile: "Ananas, fruité tropical",
    functionalEffect: "Fraîcheur, tête",
    emotion: "Joie, légèreté"
  },
  {
    name: "Isoamyl Acetate",
    formula: "C7H14O2",
    family: "esters",
    olfactiveProfile: "Banane, poire, fruité",
    functionalEffect: "Fruité, volatilité",
    emotion: "Gourmandise, enfance"
  },
  {
    name: "Benzyl Acetate",
    formula: "C9H10O2",
    family: "esters",
    olfactiveProfile: "Jasmin, floral, fruité",
    functionalEffect: "Floral, élégance",
    emotion: "Sensualité, douceur"
  },
  {
    name: "Éthyl Hexanoate",
    formula: "C8H16O2",
    family: "esters",
    olfactiveProfile: "Pomme verte, ananas, fruité",
    functionalEffect: "Fraîcheur, acidité",
    emotion: "Vivacité, fraîcheur"
  },
  {
    name: "Ethyl Lactate",
    formula: "C5H10O3",
    family: "esters",
    olfactiveProfile: "Lait, crème, lactonique",
    functionalEffect: "Douceur lactée, rondeur",
    emotion: "Confort, maternité"
  },
  
  // INDOLES (5 molécules)
  {
    name: "Indole",
    formula: "C8H7N",
    family: "indoles",
    olfactiveProfile: "Floral (jasmin, tubéreuse), fécal à forte concentration",
    functionalEffect: "Profondeur florale, animalité",
    emotion: "Sensualité, ambiguïté"
  },
  {
    name: "Skatole",
    formula: "C9H9N",
    family: "indoles",
    olfactiveProfile: "Fécal, animal, cuir",
    functionalEffect: "Animalité, profondeur",
    emotion: "Intensité, primitivité"
  },
  {
    name: "Methyl Anthranilate",
    formula: "C8H9NO2",
    family: "indoles",
    olfactiveProfile: "Raisin, fruité, floral",
    functionalEffect: "Fruité, douceur",
    emotion: "Gourmandise, nostalgie"
  },
  {
    name: "Indoline",
    formula: "C8H9N",
    family: "indoles",
    olfactiveProfile: "Floral, vert, légèrement animal",
    functionalEffect: "Complexité, profondeur",
    emotion: "Mystère, profondeur"
  }
];

console.log("\nImportation des 19 molécules...");
for (const molecule of moleculesData) {
  await connection.execute(
    `INSERT INTO molecules (name, formula, family, olfactiveProfile, functionalEffect, emotion) 
     VALUES (?, ?, ?, ?, ?, ?)`,
    [molecule.name, molecule.formula, molecule.family, molecule.olfactiveProfile, molecule.functionalEffect, molecule.emotion]
  );
  console.log(`  ✓ ${molecule.name} (${molecule.family})`);
}

console.log("\n✅ Import terminé avec succès !");
console.log(`   - 4 familles chimiques`);
console.log(`   - 19 molécules`);

await connection.end();
