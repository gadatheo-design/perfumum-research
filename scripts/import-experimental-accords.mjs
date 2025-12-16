#!/usr/bin/env node
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection);

console.log("🧪 Import des accords expérimentaux...\n");

// ============================================================================
// ACCORDS STANDARDS (10 accords)
// ============================================================================

const standardAccords = [
  {
    number: 1,
    olfactiveAxis: "Terre & Minéral",
    intention: "Pétrichor urbain",
    baseTabac: "Virginia + Burley (70/30)",
    resinExtract: "Vétiver + Cypriol (MCT 1.5%)",
    sensoryModifier: "Poussière de pierre ponce",
    conceptualNote: "Asphalte après la pluie, béton humide"
  },
  {
    number: 2,
    olfactiveAxis: "Végétal & Résine",
    intention: "Forêt méditerranéenne",
    baseTabac: "Oriental + Latakia (60/40)",
    resinExtract: "Pin + Mastiha + Cèdre (MCT 2%)",
    sensoryModifier: "Aiguilles de pin séchées",
    conceptualNote: "Colline de pins sous le soleil, résine chaude"
  },
  {
    number: 3,
    olfactiveAxis: "Lactonique & Floral",
    intention: "Figue & Iris",
    baseTabac: "Burley clair (100%)",
    resinExtract: "Iris + Tonka + Ambrette (MCT 2%)",
    sensoryModifier: "Feuilles de figuier + pétales de rose",
    conceptualNote: "Jardin méditerranéen, peau tiède, lait de figue"
  },
  {
    number: 4,
    olfactiveAxis: "Fumé & Balsamique",
    intention: "Encens noir",
    baseTabac: "Latakia + Kentucky (50/50)",
    resinExtract: "Oliban + Myrrhe + Benjoin (MCT 3%)",
    sensoryModifier: "Charbon de bois + propolis",
    conceptualNote: "Temple obscur, fumée d'encens, résine brûlée"
  },
  {
    number: 5,
    olfactiveAxis: "Cuir & Animal",
    intention: "Cuir patiné",
    baseTabac: "Kentucky + Oriental (70/30)",
    resinExtract: "Labdanum + Castoreum + Cade (MCT 2%)",
    sensoryModifier: "Bois de cèdre fumé",
    conceptualNote: "Bibliothèque ancienne, cuir de selle, fumée de bois"
  },
  {
    number: 6,
    olfactiveAxis: "Marin & Iodé",
    intention: "Algue & Sel",
    baseTabac: "Virginia Bright (100%)",
    resinExtract: "Algue + Sel marin + Ciste (MCT 1%)",
    sensoryModifier: "Poudre de varech",
    conceptualNote: "Marée basse, rochers humides, air salin"
  },
  {
    number: 7,
    olfactiveAxis: "Épicé & Chaud",
    intention: "Épices orientales",
    baseTabac: "Oriental turc (100%)",
    resinExtract: "Cardamome + Safran + Cannelle (MCT 2%)",
    sensoryModifier: "Poudre de cacao",
    conceptualNote: "Souk aux épices, chaleur dorée, poudre aromatique"
  },
  {
    number: 8,
    olfactiveAxis: "Vert & Aromatique",
    intention: "Herbes fraîches",
    baseTabac: "Virginia + Menthe (80/20)",
    resinExtract: "Basilic + Verveine + Citron (MCT 1.5%)",
    sensoryModifier: "Feuilles de menthe séchées",
    conceptualNote: "Jardin d'herbes aromatiques, fraîcheur verte"
  },
  {
    number: 9,
    olfactiveAxis: "Boisé & Sec",
    intention: "Bois flotté",
    baseTabac: "Burley + Virginia (50/50)",
    resinExtract: "Santal + Cèdre + Vétiver (MCT 2%)",
    sensoryModifier: "Copeaux de bois de cèdre",
    conceptualNote: "Plage déserte, bois blanchi par le sel et le soleil"
  },
  {
    number: 10,
    olfactiveAxis: "Gourmand & Vanillé",
    intention: "Miel & Foin",
    baseTabac: "Burley + Oriental (60/40)",
    resinExtract: "Vanille + Tonka + Fève Tonka (MCT 2.5%)",
    sensoryModifier: "Miel + foin séché",
    conceptualNote: "Grange dorée, foin coupé, douceur sucrée"
  }
];

// ============================================================================
// ACCORDS EXTRÊMES (10 accords)
// ============================================================================

const extremeAccords = [
  {
    number: 11,
    olfactiveAxis: "Fécal & Animal",
    intention: "Animalité brute",
    baseTabac: "Kentucky air-cured (100%)",
    resinExtract: "Skatole + Indole + Castoreum (MCT 1%)",
    sensoryModifier: "Propolis brute",
    conceptualNote: "Cuir animal, étable, intensité primitive",
    isExtreme: 1
  },
  {
    number: 12,
    olfactiveAxis: "Soufré & Volcanique",
    intention: "Cratère actif",
    baseTabac: "Latakia + Charbon (80/20)",
    resinExtract: "Soufre + Cade + Goudron (MCT 0.5%)",
    sensoryModifier: "Poudre de pierre volcanique",
    conceptualNote: "Fumée noire, soufre, lave refroidie",
    isExtreme: 1
  },
  {
    number: 13,
    olfactiveAxis: "Putride & Fermenté",
    intention: "Fermentation extrême",
    baseTabac: "Tabac fermenté 6 mois (100%)",
    resinExtract: "Acide butyrique + Acide isovalérique (MCT 0.3%)",
    sensoryModifier: "Levure + fromage affiné",
    conceptualNote: "Fromage bleu, fermentation lactique, cave humide",
    isExtreme: 1
  },
  {
    number: 14,
    olfactiveAxis: "Métallique & Minéral",
    intention: "Fer & Sang",
    baseTabac: "Virginia + Kentucky (50/50)",
    resinExtract: "Oxyde de fer + Myrrhe + Cypriol (MCT 1%)",
    sensoryModifier: "Limaille de fer",
    conceptualNote: "Sang séché, métal rouillé, terre ferrugineuse",
    isExtreme: 1
  },
  {
    number: 15,
    olfactiveAxis: "Bitume & Goudron",
    intention: "Route fondue",
    baseTabac: "Latakia + Kentucky (70/30)",
    resinExtract: "Goudron de bouleau + Cade + Vétiver (MCT 1.5%)",
    sensoryModifier: "Charbon actif",
    conceptualNote: "Asphalte chaud, bitume, fumée industrielle",
    isExtreme: 1
  },
  {
    number: 16,
    olfactiveAxis: "Ammoniacal & Urineux",
    intention: "Cuir tanné",
    baseTabac: "Kentucky (100%)",
    resinExtract: "Ammoniac + Castoreum + Cuir (MCT 0.5%)",
    sensoryModifier: "Cuir brut non tanné",
    conceptualNote: "Tannerie, urine animale, cuir vert",
    isExtreme: 1
  },
  {
    number: 17,
    olfactiveAxis: "Iodé & Marin Extrême",
    intention: "Marée noire",
    baseTabac: "Latakia (100%)",
    resinExtract: "Algue pourrie + Iode + Sel (MCT 1%)",
    sensoryModifier: "Varech fermenté",
    conceptualNote: "Marée basse extrême, poisson pourri, iode concentré",
    isExtreme: 1
  },
  {
    number: 18,
    olfactiveAxis: "Acide & Vinaigré",
    intention: "Fermentation acétique",
    baseTabac: "Burley + Virginia (50/50)",
    resinExtract: "Acide acétique + Acide lactique (MCT 0.5%)",
    sensoryModifier: "Vinaigre de vin",
    conceptualNote: "Vinaigre balsamique, acidité piquante, fermentation",
    isExtreme: 1
  },
  {
    number: 19,
    olfactiveAxis: "Brûlé & Carbonisé",
    intention: "Cendre froide",
    baseTabac: "Tabac pyrolysé (100%)",
    resinExtract: "Charbon + Cendre + Cade (MCT 1%)",
    sensoryModifier: "Cendre de bois",
    conceptualNote: "Feu éteint, bois carbonisé, cendre froide",
    isExtreme: 1
  },
  {
    number: 20,
    olfactiveAxis: "Chimique & Pharmaceutique",
    intention: "Laboratoire",
    baseTabac: "Virginia Bright (100%)",
    resinExtract: "Camphre + Eucalyptus + Menthol (MCT 2%)",
    sensoryModifier: "Alcool à 90°",
    conceptualNote: "Désinfectant, hôpital, froid chimique",
    isExtreme: 1
  }
];

console.log("Importation des 10 accords standards...");
for (const accord of standardAccords) {
  await connection.execute(
    `INSERT INTO experimental_accords (\`number\`, \`olfactiveAxis\`, \`intention\`, \`baseTabac\`, \`resinExtract\`, \`sensoryModifier\`, \`conceptualNote\`, \`isExtreme\`) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [accord.number, accord.olfactiveAxis, accord.intention, accord.baseTabac, accord.resinExtract, accord.sensoryModifier, accord.conceptualNote, 0]
  );
  console.log(`  ✓ Accord ${accord.number}: ${accord.olfactiveAxis} - ${accord.intention}`);
}

console.log("\nImportation des 10 accords extrêmes...");
for (const accord of extremeAccords) {
  await connection.execute(
    `INSERT INTO experimental_accords (\`number\`, \`olfactiveAxis\`, \`intention\`, \`baseTabac\`, \`resinExtract\`, \`sensoryModifier\`, \`conceptualNote\`, \`isExtreme\`) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [accord.number, accord.olfactiveAxis, accord.intention, accord.baseTabac, accord.resinExtract, accord.sensoryModifier, accord.conceptualNote, accord.isExtreme]
  );
  console.log(`  ✓ Accord ${accord.number}: ${accord.olfactiveAxis} - ${accord.intention} [EXTRÊME]`);
}

console.log("\n✅ Import terminé avec succès !");
console.log(`   - 10 accords standards`);
console.log(`   - 10 accords extrêmes`);
console.log(`   - Total: 20 accords expérimentaux`);

await connection.end();
