import Database from 'better-sqlite3';
const db = new Database('.data/local.db');

// Récupérer les recettes sans associations par gamme
const query = `
SELECT 
  r.id, 
  r.name, 
  r.category,
  CASE 
    WHEN r.name LIKE '%Volcanique%' OR r.name LIKE '%Fumé%' OR r.name LIKE '%Pyrolyse%' OR r.category = 'tabac' THEN 'Volcanique'
    WHEN r.name LIKE '%Glaciaire%' OR r.name LIKE '%Frais%' OR r.name LIKE '%Ozone%' OR r.name LIKE '%Menthe%' THEN 'Glaciaire'
    WHEN r.name LIKE '%Bio%' OR r.name LIKE '%CBD%' OR r.name LIKE '%Résine%' OR r.category = 'resine_cbd' THEN 'Bio-Lab'
    WHEN r.name LIKE '%Pétrichor%' OR r.name LIKE '%Terre%' OR r.name LIKE '%Minéral%' THEN 'Pétrichor'
    ELSE 'Autre'
  END as gamme,
  (SELECT COUNT(*) FROM molecules_recettes WHERE recette_id = r.id) as nb_molecules
FROM recettes r
ORDER BY gamme, nb_molecules ASC
`;

const rows = db.prepare(query).all();

// Grouper par gamme
const gammes = {};
rows.forEach(r => {
  if (!gammes[r.gamme]) gammes[r.gamme] = { total: 0, sans: [], avec: 0 };
  gammes[r.gamme].total++;
  if (r.nb_molecules === 0) {
    gammes[r.gamme].sans.push({ id: r.id, name: r.name, category: r.category });
  } else {
    gammes[r.gamme].avec++;
  }
});

console.log('\n=== ANALYSE DES GAMMES ===\n');
for (const [gamme, data] of Object.entries(gammes)) {
  console.log(`${gamme}: ${data.total} recettes (${data.avec} avec molécules, ${data.sans.length} sans)`);
  if (data.sans.length > 0 && data.sans.length <= 20) {
    data.sans.forEach(r => console.log(`  - [${r.id}] ${r.name} (${r.category})`));
  }
}

db.close();
