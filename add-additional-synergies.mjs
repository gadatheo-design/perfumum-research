import mysql from 'mysql2/promise';
import 'dotenv/config';

const connection = await mysql.createConnection(process.env.DATABASE_URL);

// Récupérer les IDs des 13 nouvelles molécules
const [molecules] = await connection.execute(
  `SELECT id, name FROM molecules WHERE name IN (
    'GEOSMIN', 'JASMINE ABSOLUTE', 'VETIVEROL', 'CEDARWOOD OIL', 'PATCHOULI ALCOHOL',
    'SANDALWOOD OIL', 'FRANKINCENSE OIL', 'MYRRH OIL', 'BENZOIN RESIN', 'LABDANUM ABSOLUTE',
    'OPOPONAX RESIN', 'STYRAX RESIN', 'TONKA BEAN ABSOLUTE'
  )`
);

const molMap = {};
molecules.forEach(m => {
  molMap[m.name] = m.id;
});

const additionalSynergies = [
  {
    mol1: 'GEOSMIN',
    mol2: 'PATCHOULI ALCOHOL',
    type: 'potentialisation',
    description: 'La géosmine et le patchouli créent une synergie terreuse intense, évoquant la terre humide après la pluie dans une forêt tropicale.'
  },
  {
    mol1: 'CEDARWOOD OIL',
    mol2: 'SANDALWOOD OIL',
    type: 'transformation',
    description: 'Le cèdre sec et le santal crémeux créent ensemble une facette boisée-lactée unique, équilibrant sécheresse et douceur.'
  },
  {
    mol1: 'FRANKINCENSE OIL',
    mol2: 'MYRRH OIL',
    type: 'potentialisation',
    description: 'L\'encens et la myrrhe, duo sacré millénaire, s\'amplifient mutuellement pour créer une profondeur spirituelle incomparable.'
  },
  {
    mol1: 'BENZOIN RESIN',
    mol2: 'TONKA BEAN ABSOLUTE',
    type: 'potentialisation',
    description: 'Ces deux sources de vanilline naturelle créent une synergie gourmande exceptionnelle, douce et réconfortante.'
  },
  {
    mol1: 'LABDANUM ABSOLUTE',
    mol2: 'STYRAX RESIN',
    type: 'transformation',
    description: 'Le labdanum animal et le styrax balsamique créent une facette ambrée-vanillée complexe, chaude et enveloppante.'
  },
  {
    mol1: 'GEOSMIN',
    mol2: 'VETIVEROL',
    type: 'potentialisation',
    description: 'La géosmine et le vétiverol renforcent mutuellement leurs notes terreuses, créant l\'essence même du pétrichor.'
  }
];

console.log('🔄 Ajout des 6 synergies supplémentaires...\n');

let added = 0;
let skipped = 0;

for (const syn of additionalSynergies) {
  const mol1Id = molMap[syn.mol1];
  const mol2Id = molMap[syn.mol2];
  
  if (!mol1Id || !mol2Id) {
    console.log(`⚠️  Molécule manquante: ${syn.mol1} ou ${syn.mol2}`);
    skipped++;
    continue;
  }
  
  try {
    await connection.execute(
      `INSERT INTO molecule_synergies (molecule1_id, molecule2_id, type, description)
       VALUES (?, ?, ?, ?)`,
      [mol1Id, mol2Id, syn.type, syn.description]
    );
    console.log(`✅ ${syn.mol1} × ${syn.mol2} (${syn.type})`);
    added++;
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      console.log(`⚠️  ${syn.mol1} × ${syn.mol2} existe déjà`);
      skipped++;
    } else {
      console.error(`❌ Erreur:`, error.message);
    }
  }
}

console.log(`\n✅ ${added} synergies ajoutées, ${skipped} ignorées`);

// Compter le total de synergies
const [count] = await connection.execute('SELECT COUNT(*) as total FROM molecule_synergies');
console.log(`\n📊 Total synergies moléculaires : ${count[0].total}`);

await connection.end();
