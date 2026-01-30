import mysql from 'mysql2/promise';

const connection = await mysql.createConnection(process.env.DATABASE_URL);

// Les 8 recettes radicales (R-11 à R-18)
// Adaptées à la structure de la table recettes existante
const recettesRadicales = [
  {
    name: 'R-11 Green Tobacco Headspace',
    category: 'tabac',
    description: 'Axe: Vent → Disparition | Support: espace uniquement',
    ingredients: 'Feuille de tabac verte fraîche',
    protocol: 'Cloche verre, capture headspace 15 min, diffusion passive (sans alcool)',
    notes: 'Effet: Vert amer, vivant, instable. Archive du moment avant la transformation.',
    texture: 'headspace',
    intensity: 3,
    stability: 'low',
    status: 'experimental',
    gamme: 'Leaf Economies'
  },
  {
    name: 'R-12 Yellowing Leaf / Moment Critique',
    category: 'tabac',
    description: 'Axe: Vent → Bois | Support: étude comparative',
    ingredients: 'Feuille de tabac en jaunissement',
    protocol: 'Macération alcool 12h, filtration fine',
    notes: 'Effet: Fruit sec fragile, impossible à stabiliser. Moment critique rarement capturé.',
    texture: 'macération',
    intensity: 4,
    stability: 'low',
    status: 'experimental',
    gamme: 'Leaf Economies'
  },
  {
    name: 'R-13 Salted Air-Cured Tobacco',
    category: 'tabac',
    description: 'Axe: Bois | Support: parfum / encens',
    ingredients: 'Tabac air-cured insulaire',
    formula: 'megastigmatrienones 22%, β-damascenone 3%, Iso E Super 35%, β-caryophyllène 15%, support 25%',
    protocol: 'Concentré structuré',
    notes: 'Effet: Tabac clair, salin, non fumé. Structure sèche du tabac caribéen.',
    texture: 'sec',
    intensity: 6,
    stability: 'medium',
    status: 'testing',
    gamme: 'Leaf Economies'
  },
  {
    name: 'R-14 Rehydrated Tobacco Leaf',
    category: 'tabac',
    description: 'Axe: Bois → Disparition | Support: recherche',
    ingredients: 'Feuille sèche réhydratée',
    protocol: 'Feuille sèche réhydratée à 65% HR, macération courte 6h',
    notes: 'Effet: Feuille vivante ralentie, temps suspendu. État très peu documenté → zone de recherche Absorbe.',
    texture: 'réhydraté',
    intensity: 4,
    stability: 'low',
    status: 'experimental',
    gamme: 'Leaf Economies'
  },
  {
    name: 'R-15 Living Cannabis Vent',
    category: 'encens',
    description: 'Axe: Vent pur | Support: espace',
    ingredients: 'Plante vivante (feuille + tige)',
    protocol: 'Pas d\'extraction, circulation d\'air uniquement',
    notes: 'Effet: Pinène dominant, sensation d\'extérieur. Pure interaction avec l\'air. CANNABIS - recherche botanique.',
    texture: 'vivant',
    intensity: 2,
    stability: 'low',
    status: 'experimental',
    gamme: 'Leaf Economies'
  },
  {
    name: 'R-16 Dry Cannabis Leaf Incense',
    category: 'encens',
    description: 'Axe: Vent → Disparition | Support: encens',
    ingredients: 'Feuilles de cannabis sèches',
    formula: 'Feuilles broyées 12%, fibres végétales 38%, bois sec 25%, terre minérale 15%, makko 10%',
    protocol: 'Encens de feuille',
    notes: 'Effet: Aucun effet narcotique. Climat sec, vert, rapide. Encens de feuille, non de fleur. CANNABIS - recherche botanique.',
    texture: 'sec',
    intensity: 5,
    stability: 'medium',
    status: 'testing',
    gamme: 'Leaf Economies'
  },
  {
    name: 'R-17 Terpene-Depleted Cannabis',
    category: 'extrait',
    description: 'Axe: Disparition | Support: conceptuel',
    ingredients: 'Cannabis distillé partiellement',
    protocol: 'Distillation partielle, réintroduction à 10%',
    notes: 'Effet: Absence perceptible, plante "fantôme". Présence par absence. CANNABIS - recherche botanique.',
    texture: 'distillat',
    intensity: 1,
    stability: 'low',
    status: 'experimental',
    gamme: 'Leaf Economies'
  },
  {
    name: 'R-18 Leaf Economies / Extreme',
    category: 'parfum',
    description: 'Axe: Bois → Disparition | Support: parfum',
    ingredients: 'Synthèse Leaf Economies',
    formula: 'megastigmatrienone 14%, myrcène 12%, β-caryophyllène 18%, humulène 10%, Iso E Super 26%, support 20%',
    protocol: 'Concentré final',
    notes: 'Effet: Relation sans signature. Socialité silencieuse. Synthèse finale du projet Leaf Economies.',
    texture: 'concentré',
    intensity: 7,
    stability: 'medium',
    status: 'testing',
    gamme: 'Leaf Economies'
  }
];

console.log('Importing 8 radical recipes (R-11 to R-18)...');

for (const recette of recettesRadicales) {
  try {
    await connection.execute(
      `INSERT INTO recettes (name, category, description, ingredients, formula, protocol, notes, texture, intensity, stability, status, gamme, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        recette.name,
        recette.category,
        recette.description,
        recette.ingredients,
        recette.formula || null,
        recette.protocol,
        recette.notes,
        recette.texture,
        recette.intensity,
        recette.stability,
        recette.status,
        recette.gamme
      ]
    );
    console.log(`✓ Imported: ${recette.name}`);
  } catch (error) {
    console.error(`✗ Error importing ${recette.name}:`, error.message);
  }
}

await connection.end();
console.log('\\nDone! 8 radical recipes imported.');
