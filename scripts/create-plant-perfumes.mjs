/**
 * Crée la table plant_perfumes et la peuple avec les liaisons plantes → parfums emblématiques
 * Permet l'onglet "Parfums emblématiques" dans les fiches plantes
 */
import mysql from "mysql2/promise";
import * as dotenv from "dotenv";
dotenv.config();

const conn = await mysql.createConnection(process.env.DATABASE_URL);

// ─── Créer la table plant_perfumes ───────────────────────────────────────────
await conn.execute(`
  CREATE TABLE IF NOT EXISTS plant_perfumes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    plant_id INT NOT NULL,
    perfume_name VARCHAR(255) NOT NULL,
    perfume_house VARCHAR(255) NOT NULL,
    perfumer VARCHAR(255),
    year INT,
    role_in_perfume ENUM('signature','accord_principal','note_coeur','note_fond','note_tete','ingredient_cle') NOT NULL DEFAULT 'ingredient_cle',
    ingredient_type VARCHAR(100) COMMENT 'absolue, huile essentielle, résine, extrait CO2, etc.',
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_plant_perfume (plant_id, perfume_name, perfume_house),
    FOREIGN KEY (plant_id) REFERENCES plants(id) ON DELETE CASCADE
  )
`);
console.log('✓ Table plant_perfumes créée/vérifiée');

// ─── Données : plantes → parfums emblématiques ────────────────────────────────
// IDs plantes : Rose de Damas=30010, Jasmin grandiflorum=30011, Patchouli=30012,
// Vétiver=30008, Iris de Florence=270006, Lavande vraie=30001, Bois de Santal=30013,
// Rose de Mai=720006, Jasmin sambac=660883, Vétiver d'Haïti=270007
const links = [

  // ── ROSE DE DAMAS (30010) ─────────────────────────────────────────────────
  { plant: 30010, perfume: "Chanel N°5", house: "Chanel", perfumer: "Ernest Beaux", year: 1921, role: "accord_principal", type: "absolue", desc: "L'absolue de rose de Damas est l'un des ingrédients les plus coûteux de Chanel N°5, contribuant au cœur floral aldéhydé iconique." },
  { plant: 30010, perfume: "Joy", house: "Jean Patou", perfumer: "Henri Alméras", year: 1930, role: "accord_principal", type: "absolue", desc: "Joy utilise 28 douzaines de roses de Damas pour 30ml — l'une des concentrations les plus élevées de l'histoire de la parfumerie." },
  { plant: 30010, perfume: "Rose Absolue", house: "Yves Saint Laurent", perfumer: "Sophia Grojsman", year: 2000, role: "signature", type: "absolue", desc: "La rose de Damas est l'ingrédient central et signature de ce parfum solistique." },
  { plant: 30010, perfume: "Nahema", house: "Guerlain", perfumer: "Jean-Paul Guerlain", year: 1979, role: "signature", type: "absolue", desc: "Nahema est construit autour de la rose de Damas en accord avec la pêche et le bois de santal." },
  { plant: 30010, perfume: "Shalimar", house: "Guerlain", perfumer: "Jacques Guerlain", year: 1925, role: "note_coeur", type: "absolue", desc: "Note florale-rose qui contribue au cœur oriental de Shalimar avant que la vanille et le benjoin dominent." },

  // ── JASMIN GRANDIFLORUM (30011) ───────────────────────────────────────────
  { plant: 30011, perfume: "Chanel N°5", house: "Chanel", perfumer: "Ernest Beaux", year: 1921, role: "accord_principal", type: "absolue", desc: "L'absolue de jasmin de Grasse est l'autre pilier floral de Chanel N°5, en synergie avec la rose de Damas." },
  { plant: 30011, perfume: "Joy", house: "Jean Patou", perfumer: "Henri Alméras", year: 1930, role: "accord_principal", type: "absolue", desc: "10 600 fleurs de jasmin pour 30ml — Joy est le parfum le plus cher du monde à sa création en 1930." },
  { plant: 30011, perfume: "Fracas", house: "Robert Piguet", perfumer: "Germaine Cellier", year: 1948, role: "note_coeur", type: "absolue", desc: "Le jasmin renforce l'accord floral blanc opulent de Fracas dominé par la tubéreuse." },
  { plant: 30011, perfume: "Samsara", house: "Guerlain", perfumer: "Jean-Paul Guerlain", year: 1989, role: "accord_principal", type: "absolue", desc: "Jasmin grandiflorum en accord avec le bois de santal, créant le cœur floral-boisé de Samsara." },

  // ── PATCHOULI (30012) ─────────────────────────────────────────────────────
  { plant: 30012, perfume: "Angel", house: "Mugler", perfumer: "Olivier Cresp / Yves de Chirin", year: 1992, role: "accord_principal", type: "huile essentielle", desc: "Le patchouli est l'épine dorsale boisée-terrestre d'Angel, contrastant avec le sucré gourmand des muscs macrocycliques." },
  { plant: 30012, perfume: "Opium", house: "Yves Saint Laurent", perfumer: "Jean-Louis Sieuzac", year: 1977, role: "note_fond", type: "huile essentielle", desc: "Patchouli qui ancre le fond oriental-épicé d'Opium dans un registre terreux-boisé." },
  { plant: 30012, perfume: "Shalimar", house: "Guerlain", perfumer: "Jacques Guerlain", year: 1925, role: "note_fond", type: "huile essentielle", desc: "Note terreuse qui renforce le fond oriental de Shalimar." },
  { plant: 30012, perfume: "Mitsouko", house: "Guerlain", perfumer: "Jacques Guerlain", year: 1919, role: "note_fond", type: "huile essentielle", desc: "Patchouli qui ancre le fond chypré-boisé de Mitsouko." },
  { plant: 30012, perfume: "Poison", house: "Dior", perfumer: "Edouard Fléchier", year: 1985, role: "note_fond", type: "huile essentielle", desc: "Fond terreux-boisé qui renforce le caractère opulent et lourd de Poison." },

  // ── VÉTIVER (30008) ───────────────────────────────────────────────────────
  { plant: 30008, perfume: "Vétiver", house: "Guerlain", perfumer: "Jean-Paul Guerlain", year: 1959, role: "signature", type: "huile essentielle", desc: "Le vétiver de Haïti est l'ingrédient central et signature de ce parfum solistique masculin iconique." },
  { plant: 30008, perfume: "Terre d'Hermès", house: "Hermès", perfumer: "Jean-Claude Ellena", year: 2006, role: "note_fond", type: "huile essentielle", desc: "Vétiver qui contribue à la facette minérale-terreuse du fond de Terre d'Hermès." },
  { plant: 30008, perfume: "Kouros", house: "Yves Saint Laurent", perfumer: "Pierre Bourdon", year: 1981, role: "note_fond", type: "huile essentielle", desc: "Vétiver qui ancre le fond animal-boisé de Kouros." },
  { plant: 30008, perfume: "Fahrenheit", house: "Dior", perfumer: "Jean-Louis Sieuzac / Michel Almairac", year: 1988, role: "note_fond", type: "huile essentielle", desc: "Note terreuse-fumée qui contribue au fond sec et minéral de Fahrenheit." },

  // ── IRIS DE FLORENCE (270006) ─────────────────────────────────────────────
  { plant: 270006, perfume: "Chanel N°19", house: "Chanel", perfumer: "Henri Robert", year: 1970, role: "signature", type: "beurre d'iris / orris", desc: "L'iris de Florence (orris butter) est la molécule signature de Chanel N°19, créant le cœur iris-poudré-vert iconique." },
  { plant: 270006, perfume: "Iris Silver Mist", house: "Serge Lutens", perfumer: "Christopher Sheldrake", year: 1994, role: "signature", type: "beurre d'iris / orris", desc: "Parfum solistique d'iris, utilisant l'orris butter de Florence en quantité record pour un résultat minéral-poudré-carotte." },
  { plant: 270006, perfume: "Infusion d'Iris", house: "Prada", perfumer: "Daniela Andrier", year: 2007, role: "signature", type: "beurre d'iris / orris", desc: "L'iris de Florence crée le cœur poudré-propre-floral de ce classique contemporain." },
  { plant: 270006, perfume: "Mitsouko", house: "Guerlain", perfumer: "Jacques Guerlain", year: 1919, role: "note_coeur", type: "beurre d'iris / orris", desc: "Iris-violet qui contribue au cœur floral-poudré de Mitsouko." },

  // ── LAVANDE VRAIE (30001) ─────────────────────────────────────────────────
  { plant: 30001, perfume: "Jicky", house: "Guerlain", perfumer: "Aimé Guerlain", year: 1889, role: "note_coeur", type: "huile essentielle", desc: "Lavande de Provence qui ouvre la composition sur un accord herbacé-frais dans ce premier parfum moderne." },
  { plant: 30001, perfume: "Drakkar Noir", house: "Guy Laroche", perfumer: "Pierre Wargnye", year: 1982, role: "note_coeur", type: "huile essentielle", desc: "Lavande qui renforce le caractère fougère aromatique masculin de Drakkar Noir." },
  { plant: 30001, perfume: "Kouros", house: "Yves Saint Laurent", perfumer: "Pierre Bourdon", year: 1981, role: "note_tete", type: "huile essentielle", desc: "Note herbacée-fraîche qui ouvre Kouros avant que le caractère animal-fougère s'installe." },
  { plant: 30001, perfume: "Pour un Homme", house: "Caron", perfumer: "Ernest Daltroff", year: 1934, role: "signature", type: "huile essentielle", desc: "La lavande de Provence est l'ingrédient central de ce parfum masculin pionnier, en accord avec la vanilline." },

  // ── BOIS DE SANTAL (30013) ────────────────────────────────────────────────
  { plant: 30013, perfume: "Samsara", house: "Guerlain", perfumer: "Jean-Paul Guerlain", year: 1989, role: "accord_principal", type: "huile essentielle", desc: "Le bois de santal de Mysore (Santalum album) est l'autre pilier de Samsara avec le jasmin, créant un accord floral-boisé-crémeux." },
  { plant: 30013, perfume: "Chanel N°5", house: "Chanel", perfumer: "Ernest Beaux", year: 1921, role: "note_fond", type: "huile essentielle", desc: "Note boisée-crémeuse qui ancre le fond aldéhydé-floral de Chanel N°5." },
  { plant: 30013, perfume: "Santal 33", house: "Le Labo", perfumer: "Frank Voelkl", year: 2011, role: "signature", type: "huile essentielle", desc: "Le bois de santal (Santalum spicatum) est l'ingrédient central de ce parfum solistique contemporain culte." },

  // ── ROSE DE MAI (720006) ──────────────────────────────────────────────────
  { plant: 720006, perfume: "Chanel N°5", house: "Chanel", perfumer: "Ernest Beaux", year: 1921, role: "accord_principal", type: "absolue", desc: "La rose de Mai de Grasse (Rosa centifolia) contribue à l'accord floral aldéhydé de Chanel N°5 aux côtés de la rose de Damas." },
  { plant: 720006, perfume: "No. 19", house: "Chanel", perfumer: "Henri Robert", year: 1970, role: "note_coeur", type: "absolue", desc: "Rose de Mai qui renforce le cœur floral-vert de Chanel N°19." },

  // ── JASMIN SAMBAC (660883) ────────────────────────────────────────────────
  { plant: 660883, perfume: "Alien", house: "Mugler", perfumer: "Dominique Ropion", year: 2005, role: "note_coeur", type: "absolue", desc: "Le jasmin sambac contribue à la facette florale-solaire du cœur d'Alien, en contraste avec le cashmeran minéral." },
  { plant: 660883, perfume: "Pleasures", house: "Estée Lauder", perfumer: "Annie Buzantian", year: 1995, role: "note_coeur", type: "absolue", desc: "Jasmin sambac qui renforce l'accord floral-blanc printanier de Pleasures." },
];

// ─── Insérer les liaisons ─────────────────────────────────────────────────────
let inserted = 0, skipped = 0;

for (const link of links) {
  try {
    await conn.execute(
      `INSERT INTO plant_perfumes (plant_id, perfume_name, perfume_house, perfumer, year, role_in_perfume, ingredient_type, description)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [link.plant, link.perfume, link.house, link.perfumer, link.year, link.role, link.type, link.desc]
    );
    inserted++;
  } catch (e) {
    if (e.code === 'ER_DUP_ENTRY') skipped++;
    else throw e;
  }
}

const [cnt] = await conn.execute('SELECT COUNT(*) AS t FROM plant_perfumes');
const [pc] = await conn.execute('SELECT COUNT(DISTINCT perfume_name) AS t FROM plant_perfumes');
const [plc] = await conn.execute('SELECT COUNT(DISTINCT plant_id) AS t FROM plant_perfumes');

console.log(`\n✅ plant_perfumes peuplée :`);
console.log(`   Liaisons insérées : ${inserted}`);
console.log(`   Déjà existantes   : ${skipped}`);
console.log(`   Total liaisons    : ${cnt[0].t}`);
console.log(`   Parfums distincts : ${pc[0].t}`);
console.log(`   Plantes couvertes : ${plc[0].t}`);

await conn.end();
