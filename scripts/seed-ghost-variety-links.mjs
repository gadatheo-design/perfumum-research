import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const conn = await mysql.createConnection(process.env.DATABASE_URL);

// Données de liaison pour chaque variété fantôme
// Basées sur les profils olfactifs réels de ces variétés botaniques

const varietyMoleculeData = {
  // 1. Rose de Damas Ancienne
  1: {
    molecules: [
      { name: 'geraniol', type: 'dominant', percentage: 25, confidence: 'high' },
      { name: 'citronell', type: 'dominant', percentage: 18, confidence: 'high' },
      { name: 'nerol', type: 'characteristic', percentage: 8, confidence: 'high' },
      { name: 'linalool', type: 'characteristic', percentage: 5, confidence: 'medium' },
      { name: 'eugenol', type: 'characteristic', percentage: 3, confidence: 'medium' },
      { name: 'damasc', type: 'characteristic', percentage: 0.5, confidence: 'high' },
      { name: 'rose', type: 'trace', percentage: 2, confidence: 'medium' },
    ],
    plants: [
      { name: 'Rosa', type: 'parent_species', confidence: 'high' },
    ]
  },
  
  // 2. Jasmin de Grasse Original
  2: {
    molecules: [
      { name: 'benzyl', type: 'dominant', percentage: 20, confidence: 'high' },
      { name: 'linalool', type: 'dominant', percentage: 15, confidence: 'high' },
      { name: 'jasmon', type: 'characteristic', percentage: 3, confidence: 'high' },
      { name: 'indol', type: 'characteristic', percentage: 2.5, confidence: 'high' },
      { name: 'farnes', type: 'characteristic', percentage: 5, confidence: 'medium' },
    ],
    plants: []
  },
  
  // 3. Tabac de Virginie Colonial
  3: {
    molecules: [
      { name: 'solanone', type: 'dominant', percentage: 8, confidence: 'high' },
      { name: 'megastigma', type: 'characteristic', percentage: 2, confidence: 'high' },
      { name: 'nicot', type: 'characteristic', percentage: 1, confidence: 'medium' },
      { name: 'vanill', type: 'characteristic', percentage: 3, confidence: 'medium' },
      { name: 'coumarin', type: 'trace', percentage: 0.5, confidence: 'medium' },
    ],
    plants: [
      { name: 'Tabac', type: 'parent_species', confidence: 'high' },
      { name: 'Virginia', type: 'related_variety', confidence: 'high' },
    ]
  },
  
  // 4. Cannabis Indica Afghan Heritage
  4: {
    molecules: [
      { name: 'myrcene', type: 'dominant', percentage: 35, confidence: 'high' },
      { name: 'caryophyll', type: 'dominant', percentage: 20, confidence: 'high' },
      { name: 'pinene', type: 'characteristic', percentage: 12, confidence: 'high' },
      { name: 'limonene', type: 'characteristic', percentage: 8, confidence: 'medium' },
      { name: 'humulene', type: 'characteristic', percentage: 5, confidence: 'medium' },
      { name: 'linalool', type: 'trace', percentage: 3, confidence: 'medium' },
    ],
    plants: []
  },
  
  // 5. Lavande Fine de Haute-Provence Sauvage
  5: {
    molecules: [
      { name: 'linalool', type: 'dominant', percentage: 35, confidence: 'high' },
      { name: 'linalyl', type: 'dominant', percentage: 30, confidence: 'high' },
      { name: 'camph', type: 'characteristic', percentage: 8, confidence: 'high' },
      { name: 'terpinene', type: 'characteristic', percentage: 5, confidence: 'medium' },
      { name: 'borneol', type: 'trace', percentage: 2, confidence: 'medium' },
    ],
    plants: [
      { name: 'Lavande', type: 'parent_species', confidence: 'high' },
    ]
  },
  
  // 6. Bergamote de Calabre Historique
  6: {
    molecules: [
      { name: 'limonene', type: 'dominant', percentage: 40, confidence: 'high' },
      { name: 'linalool', type: 'characteristic', percentage: 12, confidence: 'high' },
      { name: 'linalyl', type: 'characteristic', percentage: 25, confidence: 'high' },
      { name: 'terpinene', type: 'characteristic', percentage: 8, confidence: 'medium' },
      { name: 'geraniol', type: 'trace', percentage: 2, confidence: 'medium' },
    ],
    plants: [
      { name: 'Bergamote', type: 'parent_species', confidence: 'high' },
    ]
  },
  
  // 7. Thym Rouge de Provence
  7: {
    molecules: [
      { name: 'thymol', type: 'dominant', percentage: 45, confidence: 'high' },
      { name: 'carvacrol', type: 'dominant', percentage: 20, confidence: 'high' },
      { name: 'terpinene', type: 'characteristic', percentage: 15, confidence: 'medium' },
      { name: 'borneol', type: 'trace', percentage: 3, confidence: 'medium' },
    ],
    plants: []
  },
  
  // 8. Encens de Dhofar Royal
  8: {
    molecules: [
      { name: 'boswel', type: 'dominant', percentage: 25, confidence: 'high' },
      { name: 'incens', type: 'dominant', percentage: 15, confidence: 'high' },
      { name: 'pinene', type: 'characteristic', percentage: 20, confidence: 'high' },
      { name: 'limonene', type: 'characteristic', percentage: 10, confidence: 'medium' },
      { name: 'myrcene', type: 'trace', percentage: 5, confidence: 'medium' },
      { name: 'terpinene', type: 'trace', percentage: 3, confidence: 'low' },
    ],
    plants: []
  },
};

async function findMoleculeByPattern(pattern) {
  const [rows] = await conn.execute(
    `SELECT id, name FROM molecules WHERE name LIKE ? LIMIT 1`,
    [`%${pattern}%`]
  );
  return rows[0] || null;
}

async function findPlantByPattern(pattern) {
  const [rows] = await conn.execute(
    `SELECT id, name FROM plants WHERE name LIKE ? LIMIT 1`,
    [`%${pattern}%`]
  );
  return rows[0] || null;
}

async function createMoleculeLink(varietyId, moleculeId, linkType, percentage, confidence) {
  try {
    await conn.execute(
      `INSERT INTO ghost_variety_molecule_links 
       (ghost_variety_id, molecule_id, link_type, percentage, confidence, source_type, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, 'comparative', NOW(), NOW())
       ON DUPLICATE KEY UPDATE percentage = VALUES(percentage), confidence = VALUES(confidence)`,
      [varietyId, moleculeId, linkType, percentage, confidence]
    );
    return true;
  } catch (err) {
    console.error(`Error creating molecule link: ${err.message}`);
    return false;
  }
}

async function createPlantLink(varietyId, plantId, relationshipType, confidence) {
  try {
    await conn.execute(
      `INSERT INTO ghost_variety_plant_links 
       (ghost_variety_id, plant_id, relationship_type, confidence, created_at, updated_at)
       VALUES (?, ?, ?, ?, NOW(), NOW())
       ON DUPLICATE KEY UPDATE relationship_type = VALUES(relationship_type), confidence = VALUES(confidence)`,
      [varietyId, plantId, relationshipType, confidence]
    );
    return true;
  } catch (err) {
    console.error(`Error creating plant link: ${err.message}`);
    return false;
  }
}

console.log('=== Peuplement des liaisons variétés fantômes ===\n');

let totalMoleculeLinks = 0;
let totalPlantLinks = 0;

for (const [varietyId, data] of Object.entries(varietyMoleculeData)) {
  const [varieties] = await conn.execute('SELECT name FROM ghost_varieties WHERE id = ?', [varietyId]);
  const varietyName = varieties[0]?.name || `Variété ${varietyId}`;
  
  console.log(`\n📌 ${varietyName} (ID: ${varietyId})`);
  
  // Créer les liaisons moléculaires
  for (const mol of data.molecules) {
    const molecule = await findMoleculeByPattern(mol.name);
    if (molecule) {
      const success = await createMoleculeLink(
        parseInt(varietyId),
        molecule.id,
        mol.type,
        mol.percentage,
        mol.confidence
      );
      if (success) {
        console.log(`  ✓ Molécule: ${molecule.name} (${mol.type}, ${mol.percentage}%)`);
        totalMoleculeLinks++;
      }
    } else {
      console.log(`  ✗ Molécule non trouvée: ${mol.name}`);
    }
  }
  
  // Créer les liaisons plantes
  for (const plant of data.plants) {
    const foundPlant = await findPlantByPattern(plant.name);
    if (foundPlant) {
      const success = await createPlantLink(
        parseInt(varietyId),
        foundPlant.id,
        plant.type,
        plant.confidence
      );
      if (success) {
        console.log(`  ✓ Plante: ${foundPlant.name} (${plant.type})`);
        totalPlantLinks++;
      }
    } else {
      console.log(`  ✗ Plante non trouvée: ${plant.name}`);
    }
  }
}

console.log('\n=== Résumé ===');
console.log(`Liaisons moléculaires créées: ${totalMoleculeLinks}`);
console.log(`Liaisons plantes créées: ${totalPlantLinks}`);

await conn.end();
console.log('\n✅ Terminé!');
