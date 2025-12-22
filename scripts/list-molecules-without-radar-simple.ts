import mysql from 'mysql2/promise';

async function listMoleculesWithoutRadar() {
  const connection = await mysql.createConnection(process.env.DATABASE_URL!);
  
  const [rows] = await connection.execute(`
    SELECT id, name, chemicalFamily, olfactiveProfile 
    FROM molecules 
    WHERE radar_intensity = 50 
      AND radar_freshness = 50 
      AND radar_warmth = 50 
      AND radar_sweetness = 50 
      AND radar_spiciness = 50 
      AND radar_earthiness = 50
    ORDER BY chemicalFamily, name
  `);

  const molecules = rows as any[];
  const total = molecules.length;

  console.log(`\n📊 Molécules sans profil radar configuré: ${total}\n`);

  // Grouper par famille chimique
  const byFamily = molecules.reduce((acc, m) => {
    const family = m.chemicalFamily || 'Non classé';
    if (!acc[family]) acc[family] = [];
    acc[family].push(m);
    return acc;
  }, {} as Record<string, any[]>);

  Object.entries(byFamily).forEach(([family, mols]) => {
    console.log(`\n🧪 ${family} (${mols.length} molécules):`);
    mols.slice(0, 5).forEach(m => {
      const profile = m.olfactiveProfile?.substring(0, 60) || 'Pas de profil';
      console.log(`  • ${m.name} (ID: ${m.id})`);
      console.log(`    ${profile}...`);
    });
    if (mols.length > 5) {
      console.log(`    ... et ${mols.length - 5} autres`);
    }
  });

  console.log(`\n✅ Total: ${total} molécules à configurer\n`);
  
  await connection.end();
}

listMoleculesWithoutRadar().catch(console.error);
