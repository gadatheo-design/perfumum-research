/**
 * Enrichissement scientifique v2 - Gestion des variantes de noms
 */
import mysql from 'mysql2/promise';
const url = process.env.DATABASE_URL;
const conn = await mysql.createConnection(url);

console.log('=== ENRICHISSEMENT SCIENTIFIQUE V2 ===\n');

// Dictionnaire avec variantes de noms
const priorityEnrichment = {
  // CANNABIS
  'Acapulco Gold': [
    { names: ['Myrcène', 'myrcene', 'Myrcene'], percentage: 25 },
    { names: ['Limonène', 'limonene', 'Limonene'], percentage: 12 },
    { names: ['β-Caryophyllène', 'beta-caryophyllene', 'β-Caryophyllène'], percentage: 10 },
  ],
  'Chitral': [
    { names: ['Myrcène', 'myrcene'], percentage: 28 },
    { names: ['β-Caryophyllène', 'beta-caryophyllene'], percentage: 18 },
    { names: ['Limonène', 'limonene'], percentage: 8 },
  ],
  'Colombian Gold': [
    { names: ['Limonène', 'limonene'], percentage: 22 },
    { names: ['Myrcène', 'myrcene'], percentage: 15 },
    { names: ['β-Caryophyllène', 'beta-caryophyllene'], percentage: 12 },
  ],
  'Durban Poison': [
    { names: ['Limonène', 'limonene'], percentage: 25 },
    { names: ['Myrcène', 'myrcene'], percentage: 15 },
    { names: ['β-Caryophyllène', 'beta-caryophyllene'], percentage: 10 },
  ],
  
  // TABACS
  'Virginia (flue-cured)': [
    { names: ['Nicotine'], percentage: 1.5 },
    { names: ['α-Ionone', 'alpha-ionone'], percentage: 0.61 },
    { names: ['Dihydro-β-ionone'], percentage: 0.96 },
    { names: ['β-Damascenone'], percentage: 1.26 },
  ],
  'Tabac cultivé': [
    { names: ['Nicotine'], percentage: 2.0 },
    { names: ['α-Ionone', 'alpha-ionone'], percentage: 0.73 },
    { names: ['Dihydro-β-ionone'], percentage: 1.19 },
    { names: ['β-Damascenone'], percentage: 1.35 },
  ],
  'Tabac rustique (Mapacho)': [
    { names: ['Nicotine'], percentage: 2.5 },
    { names: ['α-Ionone', 'alpha-ionone'], percentage: 0.50 },
    { names: ['Dihydro-β-ionone'], percentage: 1.00 },
    { names: ['β-Damascenone'], percentage: 0.80 },
  ],
  
  // ROSES
  'Rose de Damas': [
    { names: ['Citronellol', 'citronellol'], percentage: 35 },
    { names: ['Géraniol', 'geraniol'], percentage: 20 },
    { names: ['Nérol', 'nerol'], percentage: 10 },
    { names: ['Phénéthyl alcool'], percentage: 8 },
  ],
  'Bois de rose colombien': [
    { names: ['Linalol', 'linalool'], percentage: 85 },
    { names: ['α-Terpinéol', 'alpha-terpineol'], percentage: 5 },
    { names: ['Géraniol', 'geraniol'], percentage: 3 },
  ],
};

// Récupérer les molécules
const [molecules] = await conn.execute(`
  SELECT id, name FROM molecules ORDER BY name
`);

// Créer une map pour recherche flexible
const moleculeMap = {};
molecules.forEach(m => {
  moleculeMap[m.name] = m.id;
  moleculeMap[m.name.toLowerCase()] = m.id;
});

console.log(`Molécules disponibles : ${molecules.length}\n`);

// Fonction pour trouver une molécule par variantes
function findMoleculeId(names) {
  for (const name of names) {
    if (moleculeMap[name]) return moleculeMap[name];
    if (moleculeMap[name.toLowerCase()]) return moleculeMap[name.toLowerCase()];
  }
  return null;
}

// Enrichir les plantes
let enriched = 0;
let totalLinks = 0;

for (const [plantName, targetMolecules] of Object.entries(priorityEnrichment)) {
  const [plants] = await conn.execute(
    `SELECT id FROM plants WHERE name = ? LIMIT 1`,
    [plantName]
  );
  
  if (plants.length === 0) {
    console.log(`⏭️  ${plantName} — non trouvée`);
    continue;
  }
  
  const plantId = plants[0].id;
  
  // Supprimer les liaisons enrichies
  await conn.execute(
    `DELETE FROM plant_molecules WHERE plant_id = ? AND source = 'enrichment'`,
    [plantId]
  );
  
  let molCount = 0;
  for (const mol of targetMolecules) {
    const molId = findMoleculeId(mol.names);
    
    if (molId) {
      try {
        await conn.execute(
          `INSERT INTO plant_molecules (plant_id, molecule_id, percentage, source)
           VALUES (?, ?, ?, ?)`,
          [plantId, molId, mol.percentage, 'scientific']
        );
        molCount++;
        totalLinks++;
      } catch (err) {
        // Ignorer
      }
    } else {
      console.log(`    ⚠️  ${mol.names[0]} non trouvée`);
    }
  }
  
  if (molCount > 0) {
    console.log(`✅ ${plantName} — ${molCount} liaisons scientifiques`);
    enriched++;
  }
}

console.log(`\n📊 Résultats :`);
console.log(`  Plantes enrichies : ${enriched}`);
console.log(`  Liaisons créées : ${totalLinks}`);

await conn.end();
console.log('\n✅ Enrichissement terminé');
