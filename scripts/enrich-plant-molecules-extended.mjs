/**
 * Script d'enrichissement étendu des liaisons molécule-plante
 * Couvre les familles secondaires: Fabaceae, Myrtaceae, Poaceae, Zingiberaceae, etc.
 */

import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;

// Données scientifiques de composition moléculaire des plantes - Familles secondaires
const PLANT_MOLECULE_DATA = {
  // === FABACEAE (Légumineuses) ===
  "Fève tonka": {
    latinName: "Dipteryx odorata",
    molecules: [
      { name: "Coumarine", percentage: 35, role: "majeur", isSignature: true },
      { name: "Vanilline", percentage: 2, role: "trace" }
    ]
  },
  "Réglisse": {
    latinName: "Glycyrrhiza glabra",
    molecules: [
      { name: "Anéthole", percentage: 15, role: "majeur", isSignature: true },
      { name: "Estragole", percentage: 5, role: "secondaire" },
      { name: "Limonène", percentage: 3, role: "trace" }
    ]
  },
  "Genêt": {
    latinName: "Spartium junceum",
    molecules: [
      { name: "Linalol", percentage: 15, role: "majeur" },
      { name: "Benzyl acétate", percentage: 10, role: "secondaire" },
      { name: "Indole", percentage: 2, role: "trace" }
    ]
  },
  "Cassie": {
    latinName: "Acacia farnesiana",
    molecules: [
      { name: "Farnésol", percentage: 20, role: "majeur", isSignature: true },
      { name: "Géraniol", percentage: 5, role: "secondaire" }
    ]
  },
  "Mimosa": {
    latinName: "Acacia dealbata",
    molecules: [
      { name: "Anisaldéhyde", percentage: 25, role: "majeur", isSignature: true },
      { name: "Linalol", percentage: 3, role: "trace" }
    ]
  },

  // === MYRTACEAE ===
  "Tea Tree": {
    latinName: "Melaleuca alternifolia",
    molecules: [
      { name: "Terpinène-4-ol", percentage: 40, role: "majeur", isSignature: true },
      { name: "γ-Terpinène", percentage: 20, role: "majeur" },
      { name: "1,8-Cinéole", percentage: 5, role: "secondaire" },
      { name: "α-Terpinéol", percentage: 5, role: "secondaire" }
    ]
  },
  "Niaouli": {
    latinName: "Melaleuca quinquenervia",
    molecules: [
      { name: "1,8-Cinéole", percentage: 55, role: "majeur", isSignature: true },
      { name: "α-Terpinéol", percentage: 10, role: "secondaire" },
      { name: "Limonène", percentage: 5, role: "secondaire" }
    ]
  },
  "Myrte": {
    latinName: "Myrtus communis",
    molecules: [
      { name: "1,8-Cinéole", percentage: 30, role: "majeur" },
      { name: "α-Pinène", percentage: 25, role: "majeur" },
      { name: "Limonène", percentage: 8, role: "secondaire" }
    ]
  },
  "Giroflier": {
    latinName: "Syzygium aromaticum",
    molecules: [
      { name: "Eugénol", percentage: 85, role: "majeur", isSignature: true },
      { name: "β-Caryophyllène", percentage: 5, role: "secondaire" }
    ]
  },

  // === POACEAE (Graminées) ===
  "Citronnelle": {
    latinName: "Cymbopogon citratus",
    molecules: [
      { name: "Citral", percentage: 75, role: "majeur", isSignature: true },
      { name: "Myrcène", percentage: 10, role: "secondaire" },
      { name: "Géraniol", percentage: 5, role: "secondaire" }
    ]
  },
  "Palmarosa": {
    latinName: "Cymbopogon martinii",
    molecules: [
      { name: "Géraniol", percentage: 80, role: "majeur", isSignature: true },
      { name: "Linalol", percentage: 3, role: "trace" }
    ]
  },

  // === ZINGIBERACEAE ===
  "Gingembre": {
    latinName: "Zingiber officinale",
    molecules: [
      { name: "Zingibérène", percentage: 30, role: "majeur", isSignature: true },
      { name: "α-Pinène", percentage: 3, role: "trace" },
      { name: "Camphène", percentage: 5, role: "secondaire" }
    ]
  },
  "Curcuma": {
    latinName: "Curcuma longa",
    molecules: [
      { name: "ar-Turmérone", percentage: 30, role: "majeur", isSignature: true },
      { name: "Zingibérène", percentage: 5, role: "secondaire" }
    ]
  },
  "Cardamome": {
    latinName: "Elettaria cardamomum",
    molecules: [
      { name: "1,8-Cinéole", percentage: 35, role: "majeur" },
      { name: "Linalol", percentage: 5, role: "secondaire" },
      { name: "Limonène", percentage: 5, role: "secondaire" }
    ]
  },

  // === PIPERACEAE ===
  "Poivre noir": {
    latinName: "Piper nigrum",
    molecules: [
      { name: "β-Caryophyllène", percentage: 30, role: "majeur", isSignature: true },
      { name: "Limonène", percentage: 20, role: "majeur" },
      { name: "Sabinène", percentage: 15, role: "secondaire" },
      { name: "α-Pinène", percentage: 10, role: "secondaire" }
    ]
  },

  // === CUPRESSACEAE ===
  "Cyprès": {
    latinName: "Cupressus sempervirens",
    molecules: [
      { name: "α-Pinène", percentage: 50, role: "majeur", isSignature: true },
      { name: "Limonène", percentage: 5, role: "secondaire" },
      { name: "Myrcène", percentage: 3, role: "trace" }
    ]
  },
  "Genévrier": {
    latinName: "Juniperus communis",
    molecules: [
      { name: "α-Pinène", percentage: 40, role: "majeur", isSignature: true },
      { name: "Sabinène", percentage: 15, role: "secondaire" },
      { name: "Myrcène", percentage: 10, role: "secondaire" },
      { name: "Limonène", percentage: 8, role: "secondaire" }
    ]
  },

  // === PINACEAE ===
  "Pin sylvestre": {
    latinName: "Pinus sylvestris",
    molecules: [
      { name: "α-Pinène", percentage: 45, role: "majeur", isSignature: true },
      { name: "β-Pinène", percentage: 25, role: "majeur" },
      { name: "Limonène", percentage: 5, role: "secondaire" },
      { name: "Camphène", percentage: 3, role: "trace" }
    ]
  },
  "Sapin baumier": {
    latinName: "Abies balsamea",
    molecules: [
      { name: "β-Pinène", percentage: 30, role: "majeur", isSignature: true },
      { name: "α-Pinène", percentage: 15, role: "secondaire" },
      { name: "Limonène", percentage: 10, role: "secondaire" },
      { name: "Camphène", percentage: 5, role: "secondaire" }
    ]
  },

  // === LAURACEAE ===
  "Cannelle de Ceylan": {
    latinName: "Cinnamomum verum",
    molecules: [
      { name: "Cinnamaldéhyde", percentage: 75, role: "majeur", isSignature: true },
      { name: "Eugénol", percentage: 10, role: "secondaire" },
      { name: "Linalol", percentage: 5, role: "secondaire" }
    ]
  },
  "Camphrier": {
    latinName: "Cinnamomum camphora",
    molecules: [
      { name: "Camphre", percentage: 50, role: "majeur", isSignature: true },
      { name: "1,8-Cinéole", percentage: 20, role: "secondaire" },
      { name: "α-Pinène", percentage: 10, role: "secondaire" },
      { name: "Linalol", percentage: 5, role: "secondaire" }
    ]
  },
  "Laurier noble": {
    latinName: "Laurus nobilis",
    molecules: [
      { name: "1,8-Cinéole", percentage: 45, role: "majeur", isSignature: true },
      { name: "Eugénol", percentage: 5, role: "secondaire" },
      { name: "Sabinène", percentage: 8, role: "secondaire" },
      { name: "α-Pinène", percentage: 5, role: "secondaire" }
    ]
  },

  // === ASTERACEAE (Composées) ===
  "Camomille romaine": {
    latinName: "Chamaemelum nobile",
    molecules: [
      { name: "α-Pinène", percentage: 10, role: "secondaire" },
      { name: "Camphène", percentage: 5, role: "secondaire" }
    ]
  },
  "Hélichryse": {
    latinName: "Helichrysum italicum",
    molecules: [
      { name: "α-Pinène", percentage: 8, role: "secondaire" },
      { name: "Limonène", percentage: 5, role: "secondaire" }
    ]
  },
  "Estragon": {
    latinName: "Artemisia dracunculus",
    molecules: [
      { name: "Estragole", percentage: 75, role: "majeur", isSignature: true },
      { name: "Limonène", percentage: 5, role: "secondaire" }
    ]
  },

  // === APIACEAE (Ombellifères) ===
  "Angélique": {
    latinName: "Angelica archangelica",
    molecules: [
      { name: "α-Pinène", percentage: 15, role: "secondaire" },
      { name: "Limonène", percentage: 8, role: "secondaire" }
    ]
  },
  "Fenouil": {
    latinName: "Foeniculum vulgare",
    molecules: [
      { name: "Anéthole", percentage: 80, role: "majeur", isSignature: true },
      { name: "Estragole", percentage: 5, role: "secondaire" },
      { name: "Limonène", percentage: 3, role: "trace" }
    ]
  },
  "Anis vert": {
    latinName: "Pimpinella anisum",
    molecules: [
      { name: "Anéthole", percentage: 90, role: "majeur", isSignature: true },
      { name: "Estragole", percentage: 3, role: "trace" }
    ]
  },
  "Coriandre": {
    latinName: "Coriandrum sativum",
    molecules: [
      { name: "Linalol", percentage: 70, role: "majeur", isSignature: true },
      { name: "α-Pinène", percentage: 5, role: "secondaire" },
      { name: "Camphre", percentage: 5, role: "secondaire" }
    ]
  },
  "Cumin": {
    latinName: "Cuminum cyminum",
    molecules: [
      { name: "Cuminaldéhyde", percentage: 40, role: "majeur", isSignature: true },
      { name: "p-Cymène", percentage: 10, role: "secondaire" }
    ]
  },

  // === VERBENACEAE ===
  "Verveine citronnée": {
    latinName: "Aloysia citrodora",
    molecules: [
      { name: "Citral", percentage: 40, role: "majeur", isSignature: true },
      { name: "Limonène", percentage: 10, role: "secondaire" },
      { name: "1,8-Cinéole", percentage: 5, role: "secondaire" }
    ]
  },

  // === GERANIACEAE ===
  "Géranium rosat": {
    latinName: "Pelargonium x asperum",
    molecules: [
      { name: "Citronellol", percentage: 35, role: "majeur", isSignature: true },
      { name: "Géraniol", percentage: 15, role: "secondaire" },
      { name: "Linalol", percentage: 5, role: "secondaire" }
    ]
  },

  // === STYRACACEAE ===
  "Benjoin": {
    latinName: "Styrax benzoin",
    molecules: [
      { name: "Vanilline", percentage: 15, role: "secondaire", isSignature: true }
    ]
  },

  // === CISTACEAE ===
  "Ciste ladanifère": {
    latinName: "Cistus ladanifer",
    molecules: [
      { name: "α-Pinène", percentage: 45, role: "majeur" },
      { name: "Camphène", percentage: 8, role: "secondaire" }
    ]
  }
};

async function main() {
  const connection = await mysql.createConnection(DATABASE_URL);
  
  console.log('\n=== ENRICHISSEMENT ÉTENDU DES LIAISONS MOLÉCULE-PLANTE ===');
  console.log('=== Familles secondaires: Fabaceae, Myrtaceae, Poaceae, etc. ===\n');
  
  let totalCreated = 0;
  let totalUpdated = 0;
  let totalSkipped = 0;
  let plantsNotFound = [];
  let moleculesNotFound = new Set();
  
  for (const [plantName, data] of Object.entries(PLANT_MOLECULE_DATA)) {
    console.log(`\nTraitement de: ${plantName} (${data.latinName})`);
    
    // Chercher la plante dans la base
    const [plants] = await connection.query(
      'SELECT id, name, latin_name FROM plants WHERE name LIKE ? OR latin_name LIKE ? LIMIT 1',
      [`%${plantName}%`, `%${data.latinName}%`]
    );
    
    if (plants.length === 0) {
      console.log(`  ⚠️ Plante non trouvée: ${plantName}`);
      plantsNotFound.push({ name: plantName, latinName: data.latinName });
      continue;
    }
    
    const plant = plants[0];
    console.log(`  ✓ Plante trouvée: ${plant.name} (ID: ${plant.id})`);
    
    for (const mol of data.molecules) {
      // Chercher la molécule dans la base
      const [molecules] = await connection.query(
        'SELECT id, name FROM molecules WHERE name LIKE ? LIMIT 1',
        [`%${mol.name}%`]
      );
      
      if (molecules.length === 0) {
        console.log(`    ⚠️ Molécule non trouvée: ${mol.name}`);
        moleculesNotFound.add(mol.name);
        totalSkipped++;
        continue;
      }
      
      const molecule = molecules[0];
      
      // Vérifier si la liaison existe déjà dans molecule_plant_sources
      const [existing] = await connection.query(
        'SELECT * FROM molecule_plant_sources WHERE molecule_id = ? AND plant_id = ?',
        [molecule.id, plant.id]
      );
      
      if (existing.length > 0) {
        // Mettre à jour si les données sont plus complètes
        const currentPercentage = existing[0].percentage_in_oil || 0;
        if (mol.percentage && currentPercentage < mol.percentage) {
          await connection.query(
            `UPDATE molecule_plant_sources SET 
              percentage_in_oil = ?,
              is_main_source = ?,
              notes = CONCAT(IFNULL(notes, ''), ' | Enrichissement 2026-01-30')
            WHERE molecule_id = ? AND plant_id = ?`,
            [mol.percentage, mol.isSignature ? 1 : 0, molecule.id, plant.id]
          );
          console.log(`    ↻ Mise à jour: ${mol.name} (${mol.percentage}%)`);
          totalUpdated++;
        } else {
          console.log(`    - Existant: ${mol.name}`);
        }
      } else {
        // Créer la nouvelle liaison
        await connection.query(
          `INSERT INTO molecule_plant_sources (molecule_id, plant_id, percentage_in_oil, is_main_source, notes, created_at)
           VALUES (?, ?, ?, ?, 'Enrichissement scientifique 2026-01-30', NOW())`,
          [molecule.id, plant.id, mol.percentage, mol.isSignature ? 1 : 0]
        );
        console.log(`    + Créé: ${mol.name} (${mol.percentage}%)`);
        totalCreated++;
      }
    }
  }
  
  console.log('\n=== RÉSUMÉ ===');
  console.log(`Liaisons créées: ${totalCreated}`);
  console.log(`Liaisons mises à jour: ${totalUpdated}`);
  console.log(`Molécules non trouvées: ${totalSkipped}`);
  
  if (plantsNotFound.length > 0) {
    console.log(`\nPlantes non trouvées (${plantsNotFound.length}):`);
    plantsNotFound.forEach(p => console.log(`  - ${p.name} (${p.latinName})`));
  }
  
  if (moleculesNotFound.size > 0) {
    console.log(`\nMolécules non trouvées (${moleculesNotFound.size}):`);
    [...moleculesNotFound].forEach(m => console.log(`  - ${m}`));
  }
  
  await connection.end();
}

main().catch(console.error);
