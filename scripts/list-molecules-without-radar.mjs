import Database from 'better-sqlite3';

const db = new Database('./data.db');

const molecules = db.prepare(`
  SELECT id, name, chemicalFamily, olfactiveProfile 
  FROM molecules 
  WHERE radarIntensity = 50 
    AND radarFreshness = 50 
    AND radarWarmth = 50 
    AND radarSweetness = 50 
    AND radarSpiciness = 50 
    AND radarEarthiness = 50
  ORDER BY chemicalFamily, name
`).all();

const total = molecules.length;

console.log(`\n📊 Molécules sans profil radar configuré: ${total}\n`);

// Grouper par famille chimique
const byFamily = molecules.reduce((acc, m) => {
  const family = m.chemicalFamily || 'Non classé';
  if (!acc[family]) acc[family] = [];
  acc[family].push(m);
  return acc;
}, {});

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

db.close();
