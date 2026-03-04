/**
 * Enrichissement scientifique final - Noms réels de la base de données
 */
import mysql from 'mysql2/promise';
const url = process.env.DATABASE_URL;
const conn = await mysql.createConnection(url);

console.log('=== ENRICHISSEMENT SCIENTIFIQUE FINAL ===\n');

// Dictionnaire avec noms réels de la base
const priorityEnrichment = {
  // CANNABIS
  'Acapulco Gold': [
    { name: 'myrcene', percentage: 25 },
    { name: 'limonene', percentage: 12 },
    { name: 'beta-caryophyllene', percentage: 10 },
  ],
  'Chitral': [
    { name: 'myrcene', percentage: 28 },
    { name: 'beta-caryophyllene', percentage: 18 },
    { name: 'limonene', percentage: 8 },
  ],
  'Colombian Gold': [
    { name: 'limonene', percentage: 22 },
    { name: 'myrcene', percentage: 15 },
    { name: 'beta-caryophyllene', percentage: 12 },
  ],
  'Durban Poison': [
    { name: 'limonene', percentage: 25 },
    { name: 'myrcene', percentage: 15 },
    { name: 'beta-caryophyllene', percentage: 10 },
  ],
  
  // TABACS
  'Virginia (flue-cured)': [
    { name: 'Nornicotine', percentage: 1.5 },
    { name: 'Beta-ionone', percentage: 0.61 },
    { name: 'Dihydro-β-ionone', percentage: 0.96 },
    { name: 'beta-damascenone', percentage: 1.26 },
  ],
  'Tabac cultivé': [
    { name: 'Nornicotine', percentage: 2.0 },
    { name: 'Beta-ionone', percentage: 0.73 },
    { name: 'Dihydro-β-ionone', percentage: 1.19 },
    { name: 'beta-damascenone', percentage: 1.35 },
  ],
  'Tabac rustique (Mapacho)': [
    { name: 'Nornicotine', percentage: 2.5 },
    { name: 'Beta-ionone', percentage: 0.50 },
    { name: 'Dihydro-β-ionone', percentage: 1.00 },
    { name: 'beta-damascenone', percentage: 0.80 },
  ],
  
  // ROSES
  'Rose de Damas': [
    { name: 'geraniol', percentage: 35 },
    { name: 'Beta-ionone', percentage: 20 },
    { name: 'geraniol', percentage: 10 },
  ],
  'Bois de rose colombien': [
    { name: 'Linalol', percentage: 85 },
    { name: 'geraniol', percentage: 5 },
  ],
};

// Récupérer les molécules
const [molecules] = await conn.execute(`
  SELECT id, name FROM molecules ORDER BY name
`);

// Créer une map pour recherche
const moleculeMap = {};
molecules.forEach(m => {
  moleculeMap[m.name] = m.id;
  moleculeMap[m.name.toLowerCase()] = m.id;
});

console.log(`Molécules disponibles : ${molecules.length}\n`);

// Enrichir les plantes
let enriched = 0;
let totalLinks = 0;
let notFound = [];

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
    const molId = moleculeMap[mol.name] || moleculeMap[mol.name.toLowerCase()];
    
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
      notFound.push(`${plantName}: ${mol.name}`);
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

if (notFound.length > 0) {
  console.log(`\n⚠️  Molécules non trouvées :`);
  notFound.forEach(m => console.log(`  - ${m}`));
}

await conn.end();
console.log('\n✅ Enrichissement terminé');
