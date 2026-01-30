import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './drizzle/schema.js';

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection, { schema, mode: 'default' });

const accordsMossi = [
  {
    name: "Mossi Clair",
    category: "parfum",
    description: "Accord lumineux, minéral, aérien, évoquant la première lumière du Sahel.",
    formula: `**Tête (20%):** Citrus sec 5%, Aldéhydes chauds 3%, Feuille d'oranger sèche 2%, Ozone minéral clair 1%

**Cœur (40%):** Oliban clair 14%, Argile blanche 10%, Ionone blanche 8%, Bois tendre 8%

**Fond (40%):** Karité clair 10%, Ambrettolide 4%, Cèdre beige 12%, Poussière blanche du Sahel 14%`,
    notesTete: "Citrus sec, Aldéhydes chauds, Feuille d'oranger sèche, Ozone minéral clair",
    notesCoeur: "Oliban clair, Argile blanche, Ionone blanche, Bois tendre",
    notesFond: "Karité clair, Ambrettolide, Cèdre beige, Poussière blanche du Sahel",
    notes: "Profil olfactif: poussière claire, encens blanc, lumière. Base : oliban blanc, ionones, argile blanche, aldéhydes chauds.",
    gamme: "Traditions Olfactives",
    intensity: 7,
    stability: "medium",
    status: "validated"
  },
  {
    name: "Mossi Sombre",
    category: "parfum",
    description: "Accord nocturne, rituel, profond. Terre noire + myrrhe + bois.",
    formula: `**Tête (10%):** Fumée douce 4%, Aldéhydes sombres 3%, Cuir fumé trace

**Cœur (40%):** Myrrhe noire 10%, Oliban brûlé 8%, Terre noire 12%, Bois de brousse 10%

**Fond (50%):** Karité fumé sombre 20%, Vetiver Assam 8%, Styrax 7%, Ambre profond 15%`,
    notesTete: "Fumée douce, Aldéhydes sombres, Cuir fumé",
    notesCoeur: "Myrrhe noire, Oliban brûlé, Terre noire, Bois de brousse",
    notesFond: "Karité fumé sombre, Vetiver Assam, Styrax, Ambre profond",
    notes: "Profil olfactif: ombre chaude, résine sacrée, terre humide. Accord nocturne, rituel, profond.",
    gamme: "Traditions Olfactives",
    intensity: 9,
    stability: "high",
    status: "validated"
  },
  {
    name: "Mossi du Feu",
    category: "parfum",
    description: "Accord métallique, incandescent. Fer chaud + acacia brûlé.",
    formula: `**Tête (10%):** Fer chaud 4%, Aldéhydes métalliques 3%, Fumée légère 3%

**Cœur (35%):** Acacia brûlé 15%, Charcoal africain 10%, Bois sec 10%

**Fond (55%):** Terre ferrique 20%, Myrrhe chaude 10%, Labdanum 10%, Ambergris trace 3%, Vetiver fumé 12%`,
    notesTete: "Fer chaud, Aldéhydes métalliques, Fumée légère",
    notesCoeur: "Acacia brûlé, Charcoal africain, Bois sec",
    notesFond: "Terre ferrique, Myrrhe chaude, Labdanum, Ambergris, Vetiver fumé",
    notes: "Profil olfactif: incandescent, métallique, boisé-brûlé. Accord métallique, incandescent.",
    gamme: "Traditions Olfactives",
    intensity: 8,
    stability: "medium",
    status: "validated"
  },
  {
    name: "Mossi Verger Sacré",
    category: "parfum",
    description: "Accord végétal sacré. Neem + karité vert + herbes sèches.",
    formula: `**Tête (15%):** Feuille verte 6%, Aldéhyde feuille 3%, Citrus sec 2%, Ozone clair 2%

**Cœur (40%):** Neem 12%, Karité vert 8%, Herbes sèches 10%, Foin chaud 10%

**Fond (45%):** Bois tendre 15%, Ambrettolide 5%, Cèdre clair 12%, Résine douce 13%`,
    notesTete: "Feuille verte, Aldéhyde feuille, Citrus sec, Ozone clair",
    notesCoeur: "Neem, Karité vert, Herbes sèches, Foin chaud",
    notesFond: "Bois tendre, Ambrettolide, Cèdre clair, Résine douce",
    notes: "Profil olfactif: ombre fraîche, bois sacré, herbes sèches. Accord végétal sacré.",
    gamme: "Traditions Olfactives",
    intensity: 6,
    stability: "medium",
    status: "validated"
  },
  {
    name: "Mossi Solaire",
    category: "parfum",
    description: "Accord lumineux, chaud, glorieux. Encens doré + millet chaud.",
    formula: `**Tête:** Aldéhydes chauds + citron sec

**Cœur:** Encens doré + millet

**Fond:** Labdanum + terre claire`,
    notesTete: "Aldéhydes chauds, Citron sec",
    notesCoeur: "Encens doré, Millet",
    notesFond: "Labdanum, Terre claire",
    notes: "Profil olfactif: solaire, noble, céréale sacrée. Accord lumineux, chaud, glorieux.",
    gamme: "Traditions Olfactives",
    intensity: 8,
    stability: "high",
    status: "validated"
  }
];

console.log('🔄 Import des 5 accords Mossi...\n');

for (const accord of accordsMossi) {
  try {
    const [result] = await db.insert(schema.recettes).values(accord);
    console.log(`✅ ${accord.name} importé (ID: ${result.insertId})`);
  } catch (error) {
    console.error(`❌ Erreur pour ${accord.name}:`, error.message);
  }
}

console.log('\n✨ Import terminé !');
await connection.end();
process.exit(0);
