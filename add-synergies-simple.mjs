import mysql from 'mysql2/promise';

const connection = await mysql.createConnection(process.env.DATABASE_URL);

// Get all valid molecule and tabac IDs
const [molecules] = await connection.query('SELECT id, name FROM molecules ORDER BY id LIMIT 131');
const [tabacs] = await connection.query('SELECT id, name FROM tabacs ORDER BY id');

console.log(`Found ${molecules.length} molecules and ${tabacs.length} tabacs`);

// Create 25 synergies using valid IDs
const synergies = [
  // Burley
  { name: `${tabacs[0].name} × ${molecules[5].name}`, type: 'potentialisation', effet: 'Amplifie notes boisées', notes: 'Synergie forte', tabac_id: tabacs[0].id, molecule_id: molecules[5].id },
  { name: `${tabacs[0].name} × ${molecules[10].name}`, type: 'stabilisation', effet: 'Stabilise notes citriques', notes: 'Adoucit profil', tabac_id: tabacs[0].id, molecule_id: molecules[10].id },
  { name: `${tabacs[0].name} × ${molecules[15].name}`, type: 'potentialisation', effet: 'Renforce notes herbacées', notes: 'Synergie naturelle', tabac_id: tabacs[0].id, molecule_id: molecules[15].id },
  
  // Virginia
  { name: `${tabacs[1].name} × ${molecules[8].name}`, type: 'potentialisation', effet: 'Amplifie notes citriques', notes: 'Synergie excellente', tabac_id: tabacs[1].id, molecule_id: molecules[8].id },
  { name: `${tabacs[1].name} × ${molecules[12].name}`, type: 'transformation', effet: 'Transforme vers floral', notes: 'Crée complexité', tabac_id: tabacs[1].id, molecule_id: molecules[12].id },
  { name: `${tabacs[1].name} × ${molecules[18].name}`, type: 'stabilisation', effet: 'Stabilise notes florales', notes: 'Maintient caractère', tabac_id: tabacs[1].id, molecule_id: molecules[18].id },
  
  // Oriental
  { name: `${tabacs[2].name} × ${molecules[20].name}`, type: 'potentialisation', effet: 'Amplifie notes épicées', notes: 'Synergie puissante', tabac_id: tabacs[2].id, molecule_id: molecules[20].id },
  { name: `${tabacs[2].name} × ${molecules[25].name}`, type: 'potentialisation', effet: 'Renforce notes boisées', notes: 'Synergie naturelle', tabac_id: tabacs[2].id, molecule_id: molecules[25].id },
  { name: `${tabacs[2].name} × ${molecules[30].name}`, type: 'transformation', effet: 'Ajoute dimension résineuse', notes: 'Transforme profil', tabac_id: tabacs[2].id, molecule_id: molecules[30].id },
  
  // Latakia
  { name: `${tabacs[3].name} × ${molecules[35].name}`, type: 'potentialisation', effet: 'Amplifie notes fumées', notes: 'Synergie intense', tabac_id: tabacs[3].id, molecule_id: molecules[35].id },
  { name: `${tabacs[3].name} × ${molecules[40].name}`, type: 'transformation', effet: 'Ajoute dimension médicinale', notes: 'Transforme profil', tabac_id: tabacs[3].id, molecule_id: molecules[40].id },
  { name: `${tabacs[3].name} × ${molecules[45].name}`, type: 'stabilisation', effet: 'Stabilise notes cuir', notes: 'Ancre le profil', tabac_id: tabacs[3].id, molecule_id: molecules[45].id },
  
  // Perique
  { name: `${tabacs[4].name} × ${molecules[50].name}`, type: 'potentialisation', effet: 'Amplifie notes poivrées', notes: 'Synergie parfaite', tabac_id: tabacs[4].id, molecule_id: molecules[50].id },
  { name: `${tabacs[4].name} × ${molecules[55].name}`, type: 'stabilisation', effet: 'Stabilise notes fermentées', notes: 'Maintient profil', tabac_id: tabacs[4].id, molecule_id: molecules[55].id },
  { name: `${tabacs[4].name} × ${molecules[60].name}`, type: 'transformation', effet: 'Transforme vers fruité', notes: 'Ajoute complexité', tabac_id: tabacs[4].id, molecule_id: molecules[60].id },
  
  // Cavendish
  { name: `${tabacs[5].name} × ${molecules[65].name}`, type: 'potentialisation', effet: 'Amplifie notes vanillées', notes: 'Synergie naturelle', tabac_id: tabacs[5].id, molecule_id: molecules[65].id },
  { name: `${tabacs[5].name} × ${molecules[70].name}`, type: 'transformation', effet: 'Ajoute dimension foin', notes: 'Transforme profil', tabac_id: tabacs[5].id, molecule_id: molecules[70].id },
  { name: `${tabacs[5].name} × ${molecules[75].name}`, type: 'stabilisation', effet: 'Stabilise notes caramel', notes: 'Maintient sucrosité', tabac_id: tabacs[5].id, molecule_id: molecules[75].id },
  
  // Turkish
  { name: `${tabacs[6].name} × ${molecules[80].name}`, type: 'potentialisation', effet: 'Amplifie notes florales', notes: 'Synergie excellente', tabac_id: tabacs[6].id, molecule_id: molecules[80].id },
  { name: `${tabacs[6].name} × ${molecules[85].name}`, type: 'stabilisation', effet: 'Stabilise notes roses', notes: 'Maintient complexité', tabac_id: tabacs[6].id, molecule_id: molecules[85].id },
  { name: `${tabacs[6].name} × ${molecules[90].name}`, type: 'transformation', effet: 'Transforme vers épicé', notes: 'Ajoute profondeur', tabac_id: tabacs[6].id, molecule_id: molecules[90].id },
  
  // Kentucky
  { name: `${tabacs[7].name} × ${molecules[95].name}`, type: 'potentialisation', effet: 'Amplifie notes fumées intenses', notes: 'Synergie puissante', tabac_id: tabacs[7].id, molecule_id: molecules[95].id },
  { name: `${tabacs[7].name} × ${molecules[100].name}`, type: 'stabilisation', effet: 'Stabilise notes boisées', notes: 'Ancre le profil', tabac_id: tabacs[7].id, molecule_id: molecules[100].id },
  { name: `${tabacs[7].name} × ${molecules[105].name}`, type: 'transformation', effet: 'Ajoute dimension bacon', notes: 'Transforme vers animal', tabac_id: tabacs[7].id, molecule_id: molecules[105].id },
  
  // Additional cross-combinations
  { name: `${tabacs[0].name} × ${molecules[22].name}`, type: 'transformation', effet: 'Transforme vers épicé', notes: 'Ajoute complexité', tabac_id: tabacs[0].id, molecule_id: molecules[22].id },
  { name: `${tabacs[1].name} × ${molecules[28].name}`, type: 'potentialisation', effet: 'Renforce notes résineuses', notes: 'Synergie avec sucrosité', tabac_id: tabacs[1].id, molecule_id: molecules[28].id },
];

// Insert synergies
for (const synergy of synergies) {
  await connection.query(
    'INSERT INTO synergies (name, type, effet, notes, tabac_id, molecule_id, createdAt) VALUES (?, ?, ?, ?, ?, ?, NOW())',
    [synergy.name, synergy.type, synergy.effet, synergy.notes, synergy.tabac_id, synergy.molecule_id]
  );
  console.log(`✓ Added: ${synergy.name}`);
}

console.log(`\n✅ Successfully added ${synergies.length} synergies!`);

await connection.end();
