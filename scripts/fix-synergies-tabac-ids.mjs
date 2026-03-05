import mysql from 'mysql2/promise';

async function main() {
  const conn = await mysql.createConnection(process.env.DATABASE_URL);
  
  // Récupérer tous les tabacs
  const [tabacs] = await conn.query('SELECT id, name FROM tabacs ORDER BY id');
  console.log('Tabacs disponibles:');
  tabacs.forEach(t => console.log(`  ${t.id} | ${t.name}`));
  
  // Récupérer toutes les synergies avec tabac_id
  const [synergies] = await conn.query('SELECT id, name, tabac_id FROM synergies WHERE tabac_id IS NOT NULL ORDER BY id');
  
  // Construire un mapping nom → id pour les tabacs principaux (id 1-8)
  const tabacMap = {};
  tabacs.forEach(t => {
    tabacMap[t.name.toLowerCase()] = t.id;
  });
  
  console.log('\nCorrections à appliquer:');
  const corrections = [];
  
  for (const syn of synergies) {
    // Extraire le nom du tabac depuis le nom de la synergie (avant le "×")
    const parts = syn.name.split('×');
    if (parts.length < 2) continue;
    
    const tabacInName = parts[0].trim();
    
    // Chercher le tabac correspondant dans la table (correspondance exacte ou partielle)
    let correctTabacId = null;
    let correctTabacName = null;
    
    for (const [name, id] of Object.entries(tabacMap)) {
      if (tabacInName.toLowerCase() === name) {
        correctTabacId = id;
        correctTabacName = name;
        break;
      }
    }
    
    // Si pas de correspondance exacte, chercher partielle
    if (!correctTabacId) {
      for (const [name, id] of Object.entries(tabacMap)) {
        if (tabacInName.toLowerCase().includes(name) || name.includes(tabacInName.toLowerCase())) {
          correctTabacId = id;
          correctTabacName = name;
          break;
        }
      }
    }
    
    if (correctTabacId && correctTabacId !== syn.tabac_id) {
      const currentTabac = tabacs.find(t => t.id === syn.tabac_id);
      console.log(`  Synergie ${syn.id}: "${syn.name.substring(0, 50)}"`);
      console.log(`    tabac_id actuel: ${syn.tabac_id} (${currentTabac?.name}) → correct: ${correctTabacId} (${correctTabacName})`);
      corrections.push({ id: syn.id, tabac_id: correctTabacId });
    } else if (!correctTabacId) {
      console.log(`  ⚠️  Synergie ${syn.id}: "${syn.name.substring(0, 50)}" - tabac "${tabacInName}" non trouvé`);
    } else {
      console.log(`  ✓  Synergie ${syn.id}: "${syn.name.substring(0, 50)}" - tabac_id ${syn.tabac_id} correct`);
    }
  }
  
  console.log(`\n${corrections.length} corrections à appliquer...`);
  
  for (const c of corrections) {
    await conn.query('UPDATE synergies SET tabac_id = ? WHERE id = ?', [c.tabac_id, c.id]);
    console.log(`  ✓ Synergie ${c.id} → tabac_id = ${c.tabac_id}`);
  }
  
  console.log('\nVérification post-correction:');
  const [check] = await conn.query(`
    SELECT s.id, s.name, s.tabac_id, t.name as tabac_name
    FROM synergies s
    LEFT JOIN tabacs t ON s.tabac_id = t.id
    WHERE s.tabac_id IS NOT NULL
    ORDER BY s.id
    LIMIT 20
  `);
  check.forEach(r => console.log(`  ${r.id} | ${r.name?.substring(0, 45)} | tabac_id=${r.tabac_id} | ${r.tabac_name}`));
  
  await conn.end();
  console.log('\nCorrection terminée.');
}

main().catch(console.error);
