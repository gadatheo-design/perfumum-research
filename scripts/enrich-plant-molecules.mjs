/**
 * Script d'enrichissement des liaisons molécule-plante
 * Basé sur les données scientifiques de composition des huiles essentielles
 */

import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;

// Données scientifiques de composition moléculaire des plantes
// Source: Littérature scientifique, bases de données PubChem, études de composition HE
const PLANT_MOLECULE_DATA = {
  // Lavande (Lavandula angustifolia)
  "Lavande": {
    latinName: "Lavandula angustifolia",
    molecules: [
      { name: "Linalol", percentage: 35, role: "majeur", isSignature: true },
      { name: "Acétate de Linalyle", percentage: 30, role: "majeur", isSignature: true },
      { name: "Lavandulol", percentage: 3, role: "secondaire" },
      { name: "Terpinène-4-ol", percentage: 5, role: "secondaire" },
      { name: "β-Caryophyllène", percentage: 4, role: "secondaire" },
      { name: "Camphre", percentage: 2, role: "trace" },
      { name: "1,8-Cinéole", percentage: 3, role: "secondaire" },
      { name: "Limonène", percentage: 2, role: "trace" },
      { name: "α-Pinène", percentage: 1, role: "trace" },
      { name: "β-Pinène", percentage: 1, role: "trace" }
    ]
  },
  
  // Rose (Rosa damascena)
  "Rose": {
    latinName: "Rosa damascena",
    molecules: [
      { name: "Citronellol", percentage: 35, role: "majeur", isSignature: true },
      { name: "Géraniol", percentage: 20, role: "majeur", isSignature: true },
      { name: "Nérol", percentage: 8, role: "secondaire" },
      { name: "Phényléthanol", percentage: 3, role: "secondaire" },
      { name: "Eugénol", percentage: 2, role: "trace" },
      { name: "Méthyleugénol", percentage: 1, role: "trace" },
      { name: "Linalol", percentage: 2, role: "trace" },
      { name: "β-Caryophyllène", percentage: 1, role: "trace" },
      { name: "Farnésol", percentage: 2, role: "trace" }
    ]
  },
  
  // Jasmin (Jasminum grandiflorum)
  "Jasmin": {
    latinName: "Jasminum grandiflorum",
    molecules: [
      { name: "Benzyl acétate", percentage: 25, role: "majeur", isSignature: true },
      { name: "Linalol", percentage: 8, role: "secondaire" },
      { name: "Indole", percentage: 3, role: "secondaire", isSignature: true },
      { name: "Jasmone", percentage: 3, role: "secondaire", isSignature: true },
      { name: "Méthyl anthranilate", percentage: 2, role: "trace" },
      { name: "Phytol", percentage: 5, role: "secondaire" },
      { name: "Eugénol", percentage: 2, role: "trace" },
      { name: "Benzyl benzoate", percentage: 4, role: "secondaire" }
    ]
  },
  
  // Ylang-Ylang (Cananga odorata)
  "Ylang-Ylang": {
    latinName: "Cananga odorata",
    molecules: [
      { name: "Linalol", percentage: 15, role: "majeur" },
      { name: "Géraniol", percentage: 10, role: "secondaire" },
      { name: "β-Caryophyllène", percentage: 12, role: "majeur" },
      { name: "Germacrène D", percentage: 8, role: "secondaire" },
      { name: "Acétate de benzyle", percentage: 10, role: "secondaire" },
      { name: "Méthyl benzoate", percentage: 5, role: "secondaire" },
      { name: "p-Crésyl méthyl éther", percentage: 8, role: "secondaire", isSignature: true },
      { name: "Farnésène", percentage: 5, role: "secondaire" }
    ]
  },
  
  // Vétiver (Chrysopogon zizanioides)
  "Vétiver": {
    latinName: "Chrysopogon zizanioides",
    molecules: [
      { name: "Vétivénol", percentage: 15, role: "majeur", isSignature: true },
      { name: "α-Vétivone", percentage: 8, role: "secondaire", isSignature: true },
      { name: "β-Vétivone", percentage: 5, role: "secondaire", isSignature: true },
      { name: "Khusimol", percentage: 12, role: "majeur", isSignature: true },
      { name: "Isovalencénol", percentage: 5, role: "secondaire" },
      { name: "Vétisélénène", percentage: 3, role: "trace" },
      { name: "β-Vétispirène", percentage: 2, role: "trace" }
    ]
  },
  
  // Patchouli (Pogostemon cablin)
  "Patchouli": {
    latinName: "Pogostemon cablin",
    molecules: [
      { name: "Patchoulol", percentage: 35, role: "majeur", isSignature: true },
      { name: "α-Bulnésène", percentage: 15, role: "majeur" },
      { name: "α-Guaiène", percentage: 12, role: "secondaire" },
      { name: "Séychellène", percentage: 8, role: "secondaire" },
      { name: "α-Patchoulène", percentage: 5, role: "secondaire" },
      { name: "β-Patchoulène", percentage: 3, role: "trace" },
      { name: "Pogostol", percentage: 2, role: "trace" },
      { name: "Norpatchoulénol", percentage: 3, role: "trace", isSignature: true }
    ]
  },
  
  // Santal (Santalum album)
  "Santal": {
    latinName: "Santalum album",
    molecules: [
      { name: "α-Santalol", percentage: 50, role: "majeur", isSignature: true },
      { name: "β-Santalol", percentage: 20, role: "majeur", isSignature: true },
      { name: "α-Bergamotène", percentage: 5, role: "secondaire" },
      { name: "Santalène", percentage: 3, role: "trace" },
      { name: "Epi-β-santalène", percentage: 2, role: "trace" },
      { name: "Nuciférol", percentage: 2, role: "trace" }
    ]
  },
  
  // Encens (Boswellia)
  "Encens": {
    latinName: "Boswellia sacra",
    molecules: [
      { name: "α-Pinène", percentage: 40, role: "majeur" },
      { name: "Limonène", percentage: 12, role: "secondaire" },
      { name: "α-Thujène", percentage: 8, role: "secondaire" },
      { name: "Myrcène", percentage: 5, role: "secondaire" },
      { name: "Sabinène", percentage: 4, role: "secondaire" },
      { name: "p-Cymène", percentage: 3, role: "trace" },
      { name: "Incensole", percentage: 5, role: "secondaire", isSignature: true },
      { name: "Acétate d'incensole", percentage: 3, role: "trace", isSignature: true },
      { name: "Acide β-boswellique", percentage: 2, role: "trace", isSignature: true }
    ]
  },
  
  // Myrrhe (Commiphora myrrha)
  "Myrrhe": {
    latinName: "Commiphora myrrha",
    molecules: [
      { name: "Furanoeudesma-1,3-diène", percentage: 25, role: "majeur", isSignature: true },
      { name: "Curzerène", percentage: 15, role: "majeur", isSignature: true },
      { name: "Lindestrène", percentage: 10, role: "secondaire" },
      { name: "β-Élémène", percentage: 8, role: "secondaire" },
      { name: "Germacrène D", percentage: 5, role: "secondaire" },
      { name: "δ-Élémène", percentage: 3, role: "trace" }
    ]
  },
  
  // Bergamote (Citrus bergamia)
  "Bergamote": {
    latinName: "Citrus bergamia",
    molecules: [
      { name: "Limonène", percentage: 40, role: "majeur" },
      { name: "Acétate de Linalyle", percentage: 30, role: "majeur", isSignature: true },
      { name: "Linalol", percentage: 10, role: "secondaire" },
      { name: "γ-Terpinène", percentage: 8, role: "secondaire" },
      { name: "β-Pinène", percentage: 5, role: "secondaire" },
      { name: "Bergaptène", percentage: 0.3, role: "trace", isSignature: true },
      { name: "Bergamotène", percentage: 0.5, role: "trace", isSignature: true }
    ]
  },
  
  // Citron (Citrus limon)
  "Citron": {
    latinName: "Citrus limon",
    molecules: [
      { name: "Limonène", percentage: 70, role: "majeur", isSignature: true },
      { name: "β-Pinène", percentage: 12, role: "secondaire" },
      { name: "γ-Terpinène", percentage: 8, role: "secondaire" },
      { name: "Citral", percentage: 3, role: "trace" },
      { name: "Géranial", percentage: 2, role: "trace" },
      { name: "Néral", percentage: 1, role: "trace" },
      { name: "α-Pinène", percentage: 2, role: "trace" }
    ]
  },
  
  // Orange (Citrus sinensis)
  "Orange": {
    latinName: "Citrus sinensis",
    molecules: [
      { name: "Limonène", percentage: 95, role: "majeur", isSignature: true },
      { name: "Myrcène", percentage: 2, role: "trace" },
      { name: "α-Pinène", percentage: 0.5, role: "trace" },
      { name: "Linalol", percentage: 0.5, role: "trace" },
      { name: "Décanal", percentage: 0.3, role: "trace" }
    ]
  },
  
  // Menthe poivrée (Mentha piperita)
  "Menthe poivrée": {
    latinName: "Mentha piperita",
    molecules: [
      { name: "Menthol", percentage: 45, role: "majeur", isSignature: true },
      { name: "Menthone", percentage: 25, role: "majeur", isSignature: true },
      { name: "Isomenthone", percentage: 5, role: "secondaire" },
      { name: "1,8-Cinéole", percentage: 5, role: "secondaire" },
      { name: "Menthofurane", percentage: 3, role: "trace" },
      { name: "Limonène", percentage: 2, role: "trace" },
      { name: "Acétate de menthyle", percentage: 5, role: "secondaire" }
    ]
  },
  
  // Eucalyptus (Eucalyptus globulus)
  "Eucalyptus": {
    latinName: "Eucalyptus globulus",
    molecules: [
      { name: "1,8-Cinéole", percentage: 80, role: "majeur", isSignature: true },
      { name: "α-Pinène", percentage: 8, role: "secondaire" },
      { name: "Limonène", percentage: 5, role: "secondaire" },
      { name: "p-Cymène", percentage: 2, role: "trace" },
      { name: "α-Terpinéol", percentage: 2, role: "trace" },
      { name: "Globulol", percentage: 1, role: "trace" }
    ]
  },
  
  // Romarin (Rosmarinus officinalis)
  "Romarin": {
    latinName: "Rosmarinus officinalis",
    molecules: [
      { name: "1,8-Cinéole", percentage: 45, role: "majeur" },
      { name: "Camphre", percentage: 15, role: "secondaire" },
      { name: "α-Pinène", percentage: 12, role: "secondaire" },
      { name: "Bornéol", percentage: 5, role: "secondaire" },
      { name: "Verbénone", percentage: 3, role: "trace" },
      { name: "β-Caryophyllène", percentage: 3, role: "trace" },
      { name: "Limonène", percentage: 3, role: "trace" }
    ]
  },
  
  // Thym (Thymus vulgaris)
  "Thym": {
    latinName: "Thymus vulgaris",
    molecules: [
      { name: "Thymol", percentage: 45, role: "majeur", isSignature: true },
      { name: "Carvacrol", percentage: 5, role: "secondaire" },
      { name: "p-Cymène", percentage: 20, role: "majeur" },
      { name: "γ-Terpinène", percentage: 8, role: "secondaire" },
      { name: "Linalol", percentage: 5, role: "secondaire" },
      { name: "β-Caryophyllène", percentage: 3, role: "trace" }
    ]
  },
  
  // Géranium (Pelargonium graveolens)
  "Géranium": {
    latinName: "Pelargonium graveolens",
    molecules: [
      { name: "Citronellol", percentage: 30, role: "majeur", isSignature: true },
      { name: "Géraniol", percentage: 15, role: "majeur" },
      { name: "Linalol", percentage: 8, role: "secondaire" },
      { name: "Isomenthone", percentage: 7, role: "secondaire" },
      { name: "Formate de citronellyle", percentage: 10, role: "secondaire" },
      { name: "Guaia-6,9-diène", percentage: 5, role: "secondaire" },
      { name: "10-épi-γ-Eudesmol", percentage: 3, role: "trace" }
    ]
  },
  
  // Cèdre (Cedrus atlantica)
  "Cèdre": {
    latinName: "Cedrus atlantica",
    molecules: [
      { name: "α-Cédrène", percentage: 25, role: "majeur" },
      { name: "β-Cédrène", percentage: 10, role: "secondaire" },
      { name: "Cédrol", percentage: 20, role: "majeur", isSignature: true },
      { name: "Thujopsène", percentage: 15, role: "secondaire" },
      { name: "α-Himachalène", percentage: 12, role: "secondaire" },
      { name: "β-Himachalène", percentage: 8, role: "secondaire" }
    ]
  },
  
  // Gingembre (Zingiber officinale)
  "Gingembre": {
    latinName: "Zingiber officinale",
    molecules: [
      { name: "Zingibérène", percentage: 30, role: "majeur", isSignature: true },
      { name: "β-Sesquiphellandrène", percentage: 12, role: "secondaire" },
      { name: "ar-Curcumène", percentage: 8, role: "secondaire" },
      { name: "β-Bisabolène", percentage: 5, role: "secondaire" },
      { name: "Camphène", percentage: 8, role: "secondaire" },
      { name: "β-Phellandrène", percentage: 5, role: "secondaire" },
      { name: "1,8-Cinéole", percentage: 3, role: "trace" },
      { name: "Géranial", percentage: 5, role: "secondaire" },
      { name: "Néral", percentage: 3, role: "trace" }
    ]
  },
  
  // Cannelle (Cinnamomum verum)
  "Cannelle": {
    latinName: "Cinnamomum verum",
    molecules: [
      { name: "Cinnamaldéhyde", percentage: 75, role: "majeur", isSignature: true },
      { name: "Eugénol", percentage: 8, role: "secondaire" },
      { name: "Linalol", percentage: 3, role: "trace" },
      { name: "β-Caryophyllène", percentage: 5, role: "secondaire" },
      { name: "Acétate de cinnamyle", percentage: 3, role: "trace" },
      { name: "Coumarine", percentage: 0.5, role: "trace" }
    ]
  },
  
  // Clou de girofle (Syzygium aromaticum)
  "Clou de girofle": {
    latinName: "Syzygium aromaticum",
    molecules: [
      { name: "Eugénol", percentage: 85, role: "majeur", isSignature: true },
      { name: "Acétate d'eugényle", percentage: 10, role: "secondaire" },
      { name: "β-Caryophyllène", percentage: 3, role: "trace" },
      { name: "α-Humulène", percentage: 1, role: "trace" }
    ]
  },
  
  // Vanille (Vanilla planifolia)
  "Vanille": {
    latinName: "Vanilla planifolia",
    molecules: [
      { name: "Vanilline", percentage: 2.5, role: "majeur", isSignature: true },
      { name: "p-Hydroxybenzaldéhyde", percentage: 0.5, role: "trace" },
      { name: "Acide vanillique", percentage: 0.3, role: "trace" },
      { name: "Anisaldéhyde", percentage: 0.1, role: "trace" }
    ]
  },
  
  // Tubéreuse (Polianthes tuberosa)
  "Tubéreuse": {
    latinName: "Polianthes tuberosa",
    molecules: [
      { name: "Méthyl benzoate", percentage: 15, role: "majeur" },
      { name: "Benzyl benzoate", percentage: 12, role: "secondaire" },
      { name: "Méthyl salicylate", percentage: 8, role: "secondaire" },
      { name: "Géraniol", percentage: 5, role: "secondaire" },
      { name: "Nérol", percentage: 3, role: "trace" },
      { name: "Farnésol", percentage: 2, role: "trace" },
      { name: "Benzyl alcool", percentage: 5, role: "secondaire" }
    ]
  },
  
  // Cacao (Theobroma cacao)
  "Cacao": {
    latinName: "Theobroma cacao",
    molecules: [
      { name: "Pyrazine", percentage: 0.5, role: "trace", isSignature: true },
      { name: "Linalol", percentage: 3, role: "trace" },
      { name: "2-Phényléthanol", percentage: 2, role: "trace" },
      { name: "Acide acétique", percentage: 1, role: "trace" },
      { name: "Théobromine", percentage: 2, role: "trace", isSignature: true }
    ]
  },
  
  // Tagetes (Tagetes erecta) - Cempasúchil
  "Cempasúchil": {
    latinName: "Tagetes erecta",
    molecules: [
      { name: "Limonène", percentage: 25, role: "majeur" },
      { name: "β-Ocimène", percentage: 20, role: "majeur" },
      { name: "Tagetone", percentage: 15, role: "secondaire", isSignature: true },
      { name: "Terpinolène", percentage: 8, role: "secondaire" },
      { name: "Linalol", percentage: 5, role: "secondaire" },
      { name: "β-Caryophyllène", percentage: 3, role: "trace" }
    ]
  },
  
  // Copal (Bursera)
  "Copal": {
    latinName: "Bursera microphylla",
    molecules: [
      { name: "α-Pinène", percentage: 35, role: "majeur" },
      { name: "Limonène", percentage: 20, role: "majeur" },
      { name: "β-Phellandrène", percentage: 10, role: "secondaire" },
      { name: "α-Phellandrène", percentage: 8, role: "secondaire" },
      { name: "Sabinène", percentage: 5, role: "secondaire" },
      { name: "p-Cymène", percentage: 3, role: "trace" }
    ]
  },
  
  // Sauge blanche (Salvia apiana)
  "Sauge Blanche": {
    latinName: "Salvia apiana",
    molecules: [
      { name: "1,8-Cinéole", percentage: 50, role: "majeur", isSignature: true },
      { name: "Camphre", percentage: 20, role: "majeur" },
      { name: "α-Pinène", percentage: 8, role: "secondaire" },
      { name: "β-Pinène", percentage: 5, role: "secondaire" },
      { name: "Bornéol", percentage: 3, role: "trace" },
      { name: "Camphène", percentage: 2, role: "trace" }
    ]
  },
  
  // Pin Pinyon (Pinus edulis)
  "Pin Pinyon": {
    latinName: "Pinus edulis",
    molecules: [
      { name: "α-Pinène", percentage: 45, role: "majeur", isSignature: true },
      { name: "β-Pinène", percentage: 25, role: "majeur" },
      { name: "Limonène", percentage: 8, role: "secondaire" },
      { name: "Myrcène", percentage: 5, role: "secondaire" },
      { name: "β-Phellandrène", percentage: 3, role: "trace" },
      { name: "Camphène", percentage: 2, role: "trace" },
      { name: "δ-3-Carène", percentage: 5, role: "secondaire" }
    ]
  },
  
  // Gobernadora (Larrea tridentata)
  "Gobernadora": {
    latinName: "Larrea tridentata",
    molecules: [
      { name: "NDGA", percentage: 5, role: "secondaire", isSignature: true },
      { name: "α-Pinène", percentage: 15, role: "secondaire" },
      { name: "Camphène", percentage: 8, role: "secondaire" },
      { name: "Limonène", percentage: 10, role: "secondaire" },
      { name: "β-Caryophyllène", percentage: 5, role: "secondaire" },
      { name: "Géosmine", percentage: 0.1, role: "trace", isSignature: true }
    ]
  }
};

async function main() {
  const connection = await mysql.createConnection(DATABASE_URL);
  
  console.log('\n=== ENRICHISSEMENT DES LIAISONS MOLÉCULE-PLANTE ===\n');
  
  let totalCreated = 0;
  let totalUpdated = 0;
  let totalSkipped = 0;
  
  for (const [plantName, data] of Object.entries(PLANT_MOLECULE_DATA)) {
    console.log(`\nTraitement de: ${plantName} (${data.latinName})`);
    
    // Chercher la plante dans la base
    const [plants] = await connection.query(
      `SELECT id, name, latin_name FROM plants WHERE name LIKE ? OR latin_name LIKE ? LIMIT 1`,
      [`%${plantName}%`, `%${data.latinName}%`]
    );
    
    if (plants.length === 0) {
      console.log(`  ⚠️ Plante non trouvée: ${plantName}`);
      continue;
    }
    
    const plant = plants[0];
    console.log(`  ✓ Plante trouvée: ${plant.name} (ID: ${plant.id})`);
    
    for (const mol of data.molecules) {
      // Chercher la molécule dans la base
      const [molecules] = await connection.query(
        `SELECT id, name FROM molecules WHERE name LIKE ? LIMIT 1`,
        [`%${mol.name}%`]
      );
      
      if (molecules.length === 0) {
        console.log(`    ⚠️ Molécule non trouvée: ${mol.name}`);
        totalSkipped++;
        continue;
      }
      
      const molecule = molecules[0];
      
      // Vérifier si la liaison existe déjà
      const [existing] = await connection.query(
        `SELECT * FROM plant_molecules WHERE plant_id = ? AND molecule_id = ?`,
        [plant.id, molecule.id]
      );
      
      if (existing.length > 0) {
        // Mettre à jour si les données sont plus complètes
        if (mol.percentage && (!existing[0].percentage_typical || existing[0].percentage_typical < mol.percentage)) {
          await connection.query(
            `UPDATE plant_molecules SET 
              percentage_typical = ?,
              role = ?,
              is_signature = ?,
              source = 'Enrichissement scientifique 2026-01-09',
              updated_at = NOW()
            WHERE plant_id = ? AND molecule_id = ?`,
            [mol.percentage, mol.role, mol.isSignature ? 1 : 0, plant.id, molecule.id]
          );
          console.log(`    ↻ Mise à jour: ${mol.name} (${mol.percentage}%)`);
          totalUpdated++;
        } else {
          console.log(`    - Existant: ${mol.name}`);
        }
      } else {
        // Créer la nouvelle liaison
        await connection.query(
          `INSERT INTO plant_molecules (plant_id, molecule_id, percentage_typical, role, is_signature, source, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, 'Enrichissement scientifique 2026-01-09', NOW(), NOW())`,
          [plant.id, molecule.id, mol.percentage, mol.role, mol.isSignature ? 1 : 0]
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
  
  await connection.end();
}

main().catch(console.error);
