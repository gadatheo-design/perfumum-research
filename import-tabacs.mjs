import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "./drizzle/schema.ts";

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection, { schema, mode: "default" });

const tabacs = [
  {
    name: "Krumovgrad",
    type: "oriental",
    aromaticProfile: JSON.stringify(["résine sombre", "cuir", "terre"]),
    intensity: 9,
    origin: "Bulgarie",
    internalNotes: "β-caryophyllène, α-humulène, pyrazines brunes, guaiène, indoles légers. Familles: Rituels, Civilisations perdues, Encens, Noirs anciens"
  },
  {
    name: "Virginia Orange",
    type: "blond",
    aromaticProfile: JSON.stringify(["miel solaire", "agrume vert", "lait"]),
    intensity: 6,
    origin: "USA",
    internalNotes: "Ionones, limonène, citral/citronellal, lactones légères, furanones. Familles: Bio-Lab, Figuier, Lacta Solis"
  },
  {
    name: "Virginia Deutscher",
    type: "blond",
    aromaticProfile: JSON.stringify(["caramel tabac", "pipe claire"]),
    intensity: 7,
    origin: "Allemagne",
    internalNotes: "Maltol/ethyl maltol, furanones, pyrazines caramel, ionones. Familles: Nag Hammadi, Papier ancien"
  },
  {
    name: "Virginia Gold",
    type: "blond",
    aromaticProfile: JSON.stringify(["crème blanche", "coton", "miel doux"]),
    intensity: 5,
    origin: "USA",
    internalNotes: "Lactone C14, ionones, aldéhydes C6–C10, furanones blancs. Familles: Bio-Lab, Lacta Solis"
  },
  {
    name: "Burley",
    type: "brun",
    aromaticProfile: JSON.stringify(["noix", "cacao", "cendre blonde"]),
    intensity: 8,
    origin: "USA/Kentucky",
    internalNotes: "Pyrazines brunes, maltol, guaiacol/cresols, acétyl-pyrroline. Familles: Nécro-géo, Fossiles, Poussière, Tell Halaf, Akrotiri Ash"
  },
  {
    name: "Samsoun",
    type: "oriental",
    aromaticProfile: JSON.stringify(["encens clair", "épices résineuses"]),
    intensity: 7,
    origin: "Turquie",
    internalNotes: "β-caryophyllène, α-humulène, géranyl acétate, farnésène, sesquiterpènes. Familles: Rituels, Kyfi Akhet, Cordoue 950, Kyoto Kumo"
  },
  {
    name: "Virginia Bright",
    type: "blond",
    aromaticProfile: JSON.stringify(["herbe froide", "coupant", "air sec"]),
    intensity: 4,
    origin: "USA",
    internalNotes: "Aldéhydes verts (hexanal), E-2-hexénal, limonène, traces ionones. Familles: Longyear Ice, Aurora Ionique, Glace Liquide, Silence Profond"
  },
  {
    name: "Virginia Italia",
    type: "blond",
    aromaticProfile: JSON.stringify(["figue verte", "fruit sec", "cuir fin"]),
    intensity: 6,
    origin: "Italie",
    internalNotes: "Furanones fruités, ionones, caroténoïdes dégradés, cuir blond léger. Familles: Malabar Zodiac, Figue & Santal, Umbrian/Mediterra ancien"
  }
];

console.log("Importing 8 tobacco varieties...");

for (const tabac of tabacs) {
  try {
    await db.insert(schema.tabacs).values(tabac);
    console.log(`✓ ${tabac.name} imported`);
  } catch (error) {
    console.error(`✗ Error importing ${tabac.name}:`, error.message);
  }
}

console.log("\nImport complete!");
await connection.end();
