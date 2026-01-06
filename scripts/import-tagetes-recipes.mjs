import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { recettes, moleculesRecettes, molecules } from "../drizzle/schema.ts";
import { eq, like } from "drizzle-orm";

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection);

// Récupérer les IDs des molécules clés
async function getMoleculeId(name) {
  const result = await db.select({ id: molecules.id }).from(molecules).where(like(molecules.name, `%${name}%`)).limit(1);
  return result.length > 0 ? result[0].id : null;
}

// Molécules pour les recettes Tagetes lucida
const estragoleId = await getMoleculeId('Estragole');
const anetholeId = await getMoleculeId('Anéthole');
const methylEugenolId = await getMoleculeId('Méthyl-eugénol');
const tagetoneId = await getMoleculeId('tagetone');
const carvoneId = await getMoleculeId('carvone');
const ocimeneId = await getMoleculeId('Ocimène');

console.log("Molécules trouvées:");
console.log(`- Estragole: ${estragoleId}`);
console.log(`- Anéthole: ${anetholeId}`);
console.log(`- Méthyl-eugénol: ${methylEugenolId}`);
console.log(`- Tagetone: ${tagetoneId}`);
console.log(`- Carvone: ${carvoneId}`);
console.log(`- β-Ocimène: ${ocimeneId}`);

// Définir les recettes Tagetes lucida
const tagetesRecipes = [
  {
    name: "TL-01 — Pericón Anisé",
    category: "parfum",
    description: "Accord anisé-herbacé exploitant le profil phénylpropanoïde dominant de Tagetes lucida. Estragole (86%) comme note principale, modulé par l'anéthole pour une signature réglisse-estragon.",
    ingredients: "Tagetes lucida HE (chémotype D2), Anéthole, Estragole, β-Ocimène",
    formula: JSON.stringify({
      "Tagetes lucida HE (D2)": { percent: 40, note: "cœur" },
      "Estragole": { percent: 25, note: "tête-cœur" },
      "Anéthole": { percent: 15, note: "cœur" },
      "β-Ocimène": { percent: 10, note: "tête" },
      "Alcool éthylique": { percent: 10, note: "solvant" }
    }),
    protocol: "1. Préparer le mélange des phénylpropanoïdes (estragole + anéthole) à température ambiante. 2. Incorporer progressivement l'HE de Tagetes lucida. 3. Ajouter le β-ocimène pour la fraîcheur de tête. 4. Diluer dans l'alcool éthylique. 5. Maturation 2 semaines minimum.",
    notes: "Profil olfactif: Anisé dominant avec facettes herbacées vertes. Évocation: Estragon mexicain, anis étoilé, fenouil. Usage: Parfum personnel, accord signature.",
    texture: "liquide",
    intensity: 7,
    stability: "medium",
    maturationTime: 14,
    status: "experimental",
    notesTete: "β-Ocimène herbacé vert, fraîcheur végétale",
    notesCoeur: "Estragole anisé, Tagetes lucida caractéristique",
    notesFond: "Anéthole réglisse doux, persistance chaude",
    dureeTeteMin: 20,
    dureeCoeurMin: 60,
    dureeFondMin: 180,
    gamme: "Colombie - San Andrés"
  },
  {
    name: "TL-02 — Verde Tagetone",
    category: "parfum",
    description: "Accord vert-fruité basé sur les cétones caractéristiques de Tagetes. Tagetone comme note distinctive, équilibrée par la carvone mentholée et les facettes herbacées.",
    ingredients: "Tagetes lucida HE (chémotype D1), Tagetone, Carvone, Dihydrotagetone",
    formula: JSON.stringify({
      "Tagetes lucida HE (D1)": { percent: 35, note: "cœur" },
      "Tagetone": { percent: 20, note: "tête-cœur" },
      "Carvone": { percent: 15, note: "tête" },
      "Dihydrotagetone": { percent: 10, note: "cœur" },
      "Méthyl-eugénol": { percent: 10, note: "fond" },
      "Alcool éthylique": { percent: 10, note: "solvant" }
    }),
    protocol: "1. Mélanger les cétones (tagetone, dihydrotagetone, carvone) à froid. 2. Incorporer l'HE de Tagetes lucida chémotype D1 (β-ocimène dominant). 3. Ajouter le méthyl-eugénol pour la base épicée. 4. Diluer et laisser maturer 3 semaines.",
    notes: "Profil olfactif: Vert fruité avec facettes mentholées. Caractère unique des tagetones. Usage: Parfum unisexe, notes de tête fraîches.",
    texture: "liquide",
    intensity: 6,
    stability: "medium",
    maturationTime: 21,
    status: "experimental",
    notesTete: "Carvone mentholée, tagetone fruité vert",
    notesCoeur: "Tagetes lucida herbacé, dihydrotagetone",
    notesFond: "Méthyl-eugénol épicé chaud",
    dureeTeteMin: 25,
    dureeCoeurMin: 45,
    dureeFondMin: 120,
    gamme: "Colombie - San Andrés"
  },
  {
    name: "TL-03 — Épice Mexicaine",
    category: "parfum",
    description: "Accord épicé-chaud exploitant les synergies entre méthyl-eugénol et les phénylpropanoïdes de Tagetes lucida. Inspiration: épices mexicaines traditionnelles.",
    ingredients: "Tagetes lucida HE, Méthyl-eugénol, Anéthole, Estragole",
    formula: JSON.stringify({
      "Tagetes lucida HE": { percent: 30, note: "cœur" },
      "Méthyl-eugénol": { percent: 25, note: "cœur-fond" },
      "Anéthole": { percent: 15, note: "cœur" },
      "Estragole": { percent: 10, note: "tête" },
      "Carvone": { percent: 5, note: "tête" },
      "Alcool éthylique": { percent: 15, note: "solvant" }
    }),
    protocol: "1. Chauffer légèrement le méthyl-eugénol (35°C) pour faciliter le mélange. 2. Incorporer l'anéthole et l'estragole. 3. Ajouter l'HE de Tagetes lucida. 4. Refroidir et ajouter la carvone. 5. Diluer et maturer 4 semaines pour développer la complexité.",
    notes: "Profil olfactif: Épicé chaud avec anisé en arrière-plan. Évocation: Marché mexicain, épices chaudes, clou de girofle. Usage: Parfum oriental, accord épicé.",
    texture: "liquide",
    intensity: 8,
    stability: "high",
    maturationTime: 28,
    status: "experimental",
    notesTete: "Estragole anisé, carvone fraîche",
    notesCoeur: "Tagetes lucida, anéthole réglisse",
    notesFond: "Méthyl-eugénol clou de girofle, chaleur épicée",
    dureeTeteMin: 15,
    dureeCoeurMin: 90,
    dureeFondMin: 240,
    gamme: "Colombie - San Andrés"
  },
  {
    name: "TL-04 — Encens Pericón",
    category: "encens",
    description: "Encens rituel inspiré de l'usage traditionnel mésoaméricain du Pericón. Combustion lente libérant les phénylpropanoïdes caractéristiques.",
    ingredients: "Tagetes lucida (plante sèche), Résine de copal, Charbon végétal, Salpêtre",
    formula: JSON.stringify({
      "Tagetes lucida (feuilles sèches)": { percent: 45, note: "principal" },
      "Résine de copal": { percent: 25, note: "liant" },
      "Charbon végétal": { percent: 20, note: "combustible" },
      "Salpêtre": { percent: 5, note: "oxydant" },
      "Eau de rose": { percent: 5, note: "humidifiant" }
    }),
    protocol: "1. Broyer finement les feuilles sèches de Tagetes lucida. 2. Fondre la résine de copal au bain-marie. 3. Mélanger le charbon végétal avec le salpêtre. 4. Incorporer la poudre de Tagetes dans la résine fondue. 5. Ajouter le mélange charbon-salpêtre. 6. Humidifier avec l'eau de rose. 7. Former des cônes ou bâtonnets. 8. Sécher 7 jours minimum.",
    notes: "Usage rituel: Purification, célébrations du Día de los Muertos. Profil fumé: Anisé-herbacé avec notes résineuses. Tradition: Utilisé par les Aztèques pour honorer Tlaloc.",
    texture: "sec",
    intensity: 7,
    stability: "high",
    combustionTemperature: 250,
    maturationTime: 7,
    status: "experimental",
    notesTete: "Fumée anisée, notes vertes",
    notesCoeur: "Copal résineux, Tagetes herbacé",
    notesFond: "Cendres aromatiques, persistance anisée",
    dureeTeteMin: 5,
    dureeCoeurMin: 20,
    dureeFondMin: 60,
    gamme: "Colombie - San Andrés"
  },
  {
    name: "TL-05 — Synergie Vent-Herbacé",
    category: "extrait",
    description: "Extrait concentré exploitant l'axe climatique VENT du système Absorbe. Synergie entre Tagetes lucida et les molécules fraîches-herbacées de San Andrés.",
    ingredients: "Tagetes lucida HE, β-Ocimène, Terpinolène, Carvone, Citronellal",
    formula: JSON.stringify({
      "Tagetes lucida HE": { percent: 35, note: "base" },
      "β-Ocimène": { percent: 20, note: "tête" },
      "Terpinolène": { percent: 15, note: "tête-cœur" },
      "Carvone": { percent: 10, note: "cœur" },
      "Citronellal": { percent: 10, note: "tête" },
      "Phytol": { percent: 10, note: "fond" }
    }),
    protocol: "1. Préparer le mélange terpénique (β-ocimène, terpinolène, citronellal). 2. Incorporer l'HE de Tagetes lucida. 3. Ajouter la carvone pour la structure. 4. Finaliser avec le phytol pour la tenue. 5. Pas de dilution - extrait pur. 6. Maturation 1 semaine.",
    notes: "Axe climatique: VENT (fraîcheur, mouvement, clarté). Usage Absorbe: Diffusion spatiale, création d'atmosphère. Synergie moléculaire: Terpènes + Phénylpropanoïdes.",
    texture: "liquide",
    intensity: 9,
    stability: "medium",
    maturationTime: 7,
    status: "experimental",
    notesTete: "Citronellal frais, β-ocimène vert, terpinolène floral",
    notesCoeur: "Tagetes lucida anisé-herbacé, carvone mentholée",
    notesFond: "Phytol balsamique vert",
    dureeTeteMin: 30,
    dureeCoeurMin: 60,
    dureeFondMin: 90,
    gamme: "Colombie - San Andrés"
  }
];

// Insérer les recettes
console.log("\n=== Insertion des recettes Tagetes lucida ===\n");

for (const recipe of tagetesRecipes) {
  try {
    const [result] = await db.insert(recettes).values(recipe);
    const recetteId = result.insertId;
    console.log(`✓ ${recipe.name} (ID: ${recetteId})`);
    
    // Ajouter les liaisons molécules-recettes
    const moleculeIds = [];
    if (estragoleId && recipe.ingredients.includes('Estragole')) moleculeIds.push(estragoleId);
    if (anetholeId && recipe.ingredients.includes('Anéthole')) moleculeIds.push(anetholeId);
    if (methylEugenolId && recipe.ingredients.includes('Méthyl-eugénol')) moleculeIds.push(methylEugenolId);
    if (tagetoneId && recipe.ingredients.includes('Tagetone')) moleculeIds.push(tagetoneId);
    if (carvoneId && recipe.ingredients.includes('Carvone')) moleculeIds.push(carvoneId);
    if (ocimeneId && recipe.ingredients.includes('Ocimène')) moleculeIds.push(ocimeneId);
    
    for (const molId of moleculeIds) {
      await db.insert(moleculesRecettes).values({
        moleculeId: molId,
        recetteId: recetteId
      });
    }
    console.log(`  → ${moleculeIds.length} liaisons moléculaires créées`);
    
  } catch (error) {
    console.error(`✗ Erreur pour ${recipe.name}:`, error.message);
  }
}

console.log("\n=== Import terminé ===");

await connection.end();
