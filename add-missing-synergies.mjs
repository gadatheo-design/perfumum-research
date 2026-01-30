import mysql from 'mysql2/promise';
import 'dotenv/config';

const connection = await mysql.createConnection(process.env.DATABASE_URL);

// Récupérer les IDs des molécules récemment ajoutées
const [molecules] = await connection.execute(
  `SELECT id, name FROM molecules WHERE name IN (
    'GEOSMIN', 'JASMINE ABSOLUTE', 'VETIVEROL', 'CEDARWOOD OIL', 'PATCHOULI ALCOHOL',
    'SANDALWOOD OIL', 'FRANKINCENSE OIL', 'MYRRH OIL', 'BENZOIN RESIN', 'LABDANUM ABSOLUTE',
    'OPOPONAX RESIN', 'STYRAX RESIN', 'TONKA BEAN ABSOLUTE',
    'LIMONENE', 'MYRCENE', 'LINALOOL', 'PINENE', 'CARYOPHYLLENE', 'VETIVER'
  )`
);

const molMap = {};
molecules.forEach(m => {
  molMap[m.name] = m.id;
});

const synergies = [
  {
    mol1: 'GEOSMIN',
    mol2: 'VETIVER',
    type: 'potentialisation',
    description: 'La géosmine amplifie les notes terreuses du vétiver, créant un effet pétrichor intense et authentique.'
  },
  {
    mol1: 'JASMINE ABSOLUTE',
    mol2: 'SANDALWOOD OIL',
    type: 'transformation',
    description: 'Le jasmin et le santal créent ensemble une facette lactée-crémeuse unique, évoquant le lait maternel et la douceur.'
  },
  {
    mol1: 'VETIVEROL',
    mol2: 'PATCHOULI ALCOHOL',
    type: 'potentialisation',
    description: 'Ces deux sesquiterpènes alcools renforcent mutuellement leurs notes terreuses et boisées profondes.'
  },
  {
    mol1: 'CEDARWOOD OIL',
    mol2: 'FRANKINCENSE OIL',
    type: 'transformation',
    description: 'Le cèdre et l\'encens créent une synergie sacrée, évoquant les temples et rituels spirituels.'
  },
  {
    mol1: 'MYRRH OIL',
    mol2: 'BENZOIN RESIN',
    type: 'stabilisation',
    description: 'La myrrhe stabilise la vanilline du benjoin, prolongeant sa tenue et adoucissant son amertume.'
  },
  {
    mol1: 'LABDANUM ABSOLUTE',
    mol2: 'OPOPONAX RESIN',
    type: 'potentialisation',
    description: 'Ces deux résines ambrées s\'amplifient mutuellement, créant une profondeur animale et chaleureuse exceptionnelle.'
  },
  {
    mol1: 'STYRAX RESIN',
    mol2: 'TONKA BEAN ABSOLUTE',
    type: 'potentialisation',
    description: 'Le styrax et la fève tonka renforcent leurs facettes vanillées-balsamiques, créant une douceur gourmande intense.'
  },
  {
    mol1: 'GEOSMIN',
    mol2: 'LIMONENE',
    type: 'transformation',
    description: 'Le limonène apporte une fraîcheur citronnée qui transforme la géosmine en une note de pluie d\'été sur agrumes.'
  },
  {
    mol1: 'JASMINE ABSOLUTE',
    mol2: 'LINALOOL',
    type: 'stabilisation',
    description: 'Le linalol stabilise les notes indoliques du jasmin, les rendant plus douces et accessibles.'
  },
  {
    mol1: 'FRANKINCENSE OIL',
    mol2: 'PINENE',
    type: 'potentialisation',
    description: 'Le pinène amplifie les notes résineuses de l\'encens, créant un effet de forêt sacrée.'
  },
  {
    mol1: 'PATCHOULI ALCOHOL',
    mol2: 'CARYOPHYLLENE',
    type: 'transformation',
    description: 'Le caryophyllène ajoute une facette épicée-boisée au patchouli, le rendant plus complexe et moins terreux.'
  },
  {
    mol1: 'SANDALWOOD OIL',
    mol2: 'MYRCENE',
    type: 'transformation',
    description: 'Le myrcène apporte une facette herbacée-verte au santal, créant une note lactée-végétale unique.'
  },
  {
    mol1: 'TONKA BEAN ABSOLUTE',
    mol2: 'VETIVEROL',
    type: 'masquage',
    description: 'La fève tonka masque les aspects trop terreux du vétiverol, ne laissant que ses facettes boisées nobles.'
  }
];

console.log('🔄 Ajout des 13 synergies moléculaires...\n');

let added = 0;
let skipped = 0;

for (const syn of synergies) {
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
await connection.end();
