/**
 * Liaison Batch 15 → Recettes existantes
 * Cherche les recettes dont les ingrédients textuels mentionnent les nouvelles molécules
 */
import mysql from 'mysql2/promise';

const conn = await mysql.createConnection(process.env.DATABASE_URL);
let linked = 0;

// Molécules à chercher dans les recettes (nom → variantes de recherche)
const searchTerms = [
  { name: 'Hedione', variants: ['hedione', 'hédione', 'methyl dihydrojasmonate', 'dihydrojasmonate'] },
  { name: 'Hedione HC', variants: ['hedione hc', 'hédione hc'] },
  { name: 'Linalyl Acetate', variants: ['linalyl acetate', 'acétate de linalyle', 'linalool acetate'] },
  { name: 'Benzyl Acetate', variants: ['benzyl acetate', 'acétate de benzyle'] },
  { name: 'Phenylethyl Alcohol', variants: ['phenylethyl alcohol', 'phénoxyéthanol', 'phenyl ethyl alcohol', 'pea', '2-phényléthanol', 'alcool phényléthylique'] },
  { name: 'Dihydromyrcenol', variants: ['dihydromyrcenol', 'dihydro myrcenol'] },
  { name: 'Calone', variants: ['calone', 'calone 1951'] },
  { name: 'Cashmeran', variants: ['cashmeran'] },
  { name: 'Javanol', variants: ['javanol'] },
  { name: 'Méthyl Ionone', variants: ['methyl ionone', 'méthyl ionone', 'methylionone'] },
  { name: 'α-Méthyl Ionone', variants: ['alpha methyl ionone', 'alpha-methyl ionone', 'isomethyl ionone', 'alpha isomethyl ionone'] },
  { name: 'Irone', variants: ['irone', 'iris irone'] },
  { name: 'Dihydrojasmone', variants: ['dihydrojasmone', 'dihydro jasmone'] },
  { name: 'Geranyl Acetate', variants: ['geranyl acetate', 'acétate de géranyle'] },
  { name: 'Citronellyl Acetate', variants: ['citronellyl acetate', 'acétate de citronellyle'] },
  { name: 'Terpineol', variants: ['terpineol', 'terpinéol', 'alpha terpineol'] },
  { name: 'γ-Undecalactone', variants: ['undecalactone', 'undécalactone', 'peach lactone', 'aldehyde c14'] },
  { name: 'δ-Decalactone', variants: ['decalactone', 'décalactone'] },
  { name: 'Macrolide Ambrettolide', variants: ['ambrettolide', 'ambrette lactone'] },
  { name: 'Polysantol', variants: ['polysantol'] },
  { name: 'Ebanol', variants: ['ebanol'] },
  { name: 'Floralozone', variants: ['floralozone'] },
  { name: 'Cedryl Methyl Ether', variants: ['cedryl methyl ether', 'methyl cedryl ether'] },
];

// Récupérer toutes les recettes avec ingrédients textuels
const [recettes] = await conn.execute(
  `SELECT id, name, ingredients FROM recettes WHERE ingredients IS NOT NULL AND ingredients != ''`
);

console.log(`=== LIAISON BATCH 15 → RECETTES (${recettes.length} recettes analysées) ===\n`);

for (const term of searchTerms) {
  // Trouver l'ID de la molécule
  const [mols] = await conn.execute(
    'SELECT id FROM molecules WHERE name = ? LIMIT 1',
    [term.name]
  );
  if (mols.length === 0) { console.log(`? Molécule non trouvée: ${term.name}`); continue; }
  const molId = mols[0].id;

  for (const recette of recettes) {
    const ing = (recette.ingredients || '').toLowerCase();
    const found = term.variants.some(v => ing.includes(v.toLowerCase()));
    if (!found) continue;

    // Vérifier si la liaison existe déjà
    const [exists] = await conn.execute(
      `SELECT 1 FROM recette_molecules WHERE recette_id = ? AND molecule_id = ? LIMIT 1`,
      [recette.id, molId]
    );
    if (exists.length > 0) continue;

    // Créer la liaison
    try {
      await conn.execute(
        `INSERT INTO recette_molecules (recette_id, molecule_id, role) VALUES (?, ?, 'ingredient')`,
        [recette.id, molId]
      );
      linked++;
      console.log(`✓ ${term.name} → "${recette.name}" (id:${recette.id})`);
    } catch (e) {
      console.log(`✗ ${term.name} → recette ${recette.id}: ${e.message}`);
    }
  }
}

// Résumé final
const [totalMols] = await conn.execute('SELECT COUNT(*) as n FROM molecules');
const [totalLinks] = await conn.execute('SELECT COUNT(*) as n FROM recette_molecules');
const [linkedRecettes] = await conn.execute(
  `SELECT COUNT(DISTINCT recette_id) as n FROM recette_molecules`
);
const [totalRecettes] = await conn.execute('SELECT COUNT(*) as n FROM recettes');

console.log('\n=== RÉSUMÉ ===');
console.log(`Nouvelles liaisons créées : ${linked}`);
console.log(`Total liaisons recette_molecules : ${totalLinks[0].n}`);
console.log(`Recettes liées : ${linkedRecettes[0].n}/${totalRecettes[0].n} (${Math.round(linkedRecettes[0].n/totalRecettes[0].n*100)}%)`);
console.log(`Total molécules : ${totalMols[0].n}`);

await conn.end();
