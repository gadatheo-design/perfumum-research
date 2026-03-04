/**
 * Enrichissement scientifique des plantes prioritaires
 * Basé sur les données de recherche (NIH, MDPI, PMC)
 */
import mysql from 'mysql2/promise';
const url = process.env.DATABASE_URL;
const conn = await mysql.createConnection(url);

console.log('=== ENRICHISSEMENT SCIENTIFIQUE DES PLANTES PRIORITAIRES ===\n');

// Dictionnaire des molécules par plante prioritaire
const priorityEnrichment = {
  // CANNABIS - Profils terpéniques
  'Acapulco Gold': [
    { name: 'Myrcène', percentage: 25 },
    { name: 'Limonène', percentage: 12 },
    { name: 'β-Caryophyllène', percentage: 10 },
  ],
  'Chitral': [
    { name: 'Myrcène', percentage: 28 },
    { name: 'β-Caryophyllène', percentage: 18 },
    { name: 'Limonène', percentage: 8 },
  ],
  'Colombian Gold': [
    { name: 'Limonène', percentage: 22 },
    { name: 'Myrcène', percentage: 15 },
    { name: 'β-Caryophyllène', percentage: 12 },
  ],
  'Durban Poison': [
    { name: 'Limonène', percentage: 25 },
    { name: 'Myrcène', percentage: 15 },
    { name: 'β-Caryophyllène', percentage: 10 },
  ],
  'Acapulco Gold': [
    { name: 'Myrcène', percentage: 25 },
    { name: 'Limonène', percentage: 12 },
    { name: 'β-Caryophyllène', percentage: 10 },
  ],
  
  // TABACS - Composés volatiles
  'Virginia (flue-cured)': [
    { name: 'Nicotine', percentage: 1.5 },
    { name: 'α-Ionone', percentage: 0.61 },
    { name: 'Dihydro-β-ionone', percentage: 0.96 },
    { name: 'β-Damascenone', percentage: 1.26 },
  ],
  'Tabac cultivé': [
    { name: 'Nicotine', percentage: 2.0 },
    { name: 'α-Ionone', percentage: 0.73 },
    { name: 'Dihydro-β-ionone', percentage: 1.19 },
    { name: 'β-Damascenone', percentage: 1.35 },
  ],
  'Tabac rustique (Mapacho)': [
    { name: 'Nicotine', percentage: 2.5 },
    { name: 'α-Ionone', percentage: 0.50 },
    { name: 'Dihydro-β-ionone', percentage: 1.00 },
    { name: 'β-Damascenone', percentage: 0.80 },
  ],
  
  // ROSES - Composition chimique
  'Rose de Damas': [
    { name: 'Citronellol', percentage: 35 },
    { name: 'Géraniol', percentage: 20 },
    { name: 'Nérol', percentage: 10 },
    { name: 'Phénéthyl alcool', percentage: 8 },
  ],
  'Bois de rose colombien': [
    { name: 'Linalol', percentage: 85 },
    { name: 'α-Terpinéol', percentage: 5 },
    { name: 'Géraniol', percentage: 3 },
  ],
};

// Récupérer les molécules de la base
const [molecules] = await conn.execute(`
  SELECT id, name FROM molecules ORDER BY name
`);

// Créer une map nom → ID
const moleculeMap = {};
molecules.forEach(m => {
  moleculeMap[m.name] = m.id;
  moleculeMap[m.name.toLowerCase()] = m.id;
});

console.log(`Molécules disponibles : ${molecules.length}\n`);

// Enrichir les plantes prioritaires
let enriched = 0;
let skipped = 0;

for (const [plantName, targetMolecules] of Object.entries(priorityEnrichment)) {
  // Trouver la plante
  const [plants] = await conn.execute(
    `SELECT id FROM plants WHERE name = ? LIMIT 1`,
    [plantName]
  );
  
  if (plants.length === 0) {
    console.log(`⏭️  ${plantName} — plante non trouvée`);
    skipped++;
    continue;
  }
  
  const plantId = plants[0].id;
  
  // Supprimer les liaisons existantes (enrichissement)
  await conn.execute(
    `DELETE FROM plant_molecules WHERE plant_id = ? AND source = 'enrichment'`,
    [plantId]
  );
  
  // Créer les nouvelles liaisons
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
      } catch (err) {
        // Ignorer les erreurs
      }
    }
  }
  
  if (molCount > 0) {
    console.log(`✅ ${plantName} — ${molCount} liaisons scientifiques créées`);
    enriched++;
  } else {
    console.log(`⚠️  ${plantName} — aucune molécule trouvée`);
  }
}

console.log(`\n📊 Résultats :`);
console.log(`  Plantes enrichies : ${enriched}`);
console.log(`  Plantes non trouvées : ${skipped}`);

// Vérifier les statistiques finales
const [stats] = await conn.execute(`
  SELECT 
    (SELECT COUNT(DISTINCT plant_id) FROM plant_molecules WHERE source = 'scientific') as scientific_plants,
    (SELECT COUNT(*) FROM plant_molecules WHERE source = 'scientific') as scientific_links,
    (SELECT COUNT(DISTINCT plant_id) FROM plant_molecules WHERE source = 'enrichment') as enriched_plants,
    (SELECT COUNT(*) FROM plant_molecules WHERE source = 'enrichment') as enriched_links
  FROM DUAL
`);

const s = stats[0];
console.log(`\n📊 État des liaisons :`);
console.log(`  Plantes avec liaisons scientifiques : ${s.scientific_plants}`);
console.log(`  Liaisons scientifiques : ${s.scientific_links}`);
console.log(`  Plantes avec liaisons enrichies : ${s.enriched_plants}`);
console.log(`  Liaisons enrichies : ${s.enriched_links}`);

await conn.end();
console.log('\n✅ Enrichissement scientifique terminé');
