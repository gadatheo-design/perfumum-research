import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const connection = await mysql.createConnection(process.env.DATABASE_URL);

// Molécules nécessaires pour enrichir les fiches
const neededMolecules = [
  // Rose
  'Phényléthanol', '2-Phényléthanol', 'Phényl-éthanol', 'Alcool phényléthylique',
  'Oxyde de rose', 'Damascénone', 'β-Damascénone', 'Damascone',
  'Farnésol', 'Farnesol',
  // Jasmin
  'Jasmone', 'cis-Jasmone', 'Méthyl jasmonate',
  'Phytol', 'Phytol acétate',
  // Vétiver
  'Vétivène', 'α-Vétivène', 'β-Vétivène',
  'Isovalencénol', 'Zizanol',
  'Khusinol', 'Nootkatone',
  // Autres molécules importantes
  'Nérol', 'Nerolidol', 'Nerolidol trans',
  'Linalol', 'Linalool',
  'Géraniol', 'Geraniol',
  'Citronellol', 'Citronellal',
  'α-Terpinéol', 'Terpinéol', 'Terpineol'
];

// Rechercher les molécules existantes
const [molecules] = await connection.execute('SELECT id, name FROM molecules ORDER BY name');
console.log('=== MOLÉCULES EXISTANTES (échantillon) ===');
molecules.slice(0, 50).forEach(m => console.log(`${m.id}: ${m.name}`));
console.log(`\nTotal: ${molecules.length} molécules`);

// Vérifier lesquelles existent déjà
console.log('\n=== VÉRIFICATION DES MOLÉCULES NÉCESSAIRES ===');
for (const needed of neededMolecules) {
  const found = molecules.find(m => m.name.toLowerCase().includes(needed.toLowerCase()));
  if (found) {
    console.log(`✓ ${needed} -> trouvé: ${found.name} (ID: ${found.id})`);
  } else {
    console.log(`✗ ${needed} -> NON TROUVÉ`);
  }
}

await connection.end();
