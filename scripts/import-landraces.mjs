import mysql from 'mysql2/promise';

const landraces = [
  {
    variety_id: 'landrace_afghan_kush',
    name: 'Afghan Kush (Landrace)',
    plant_id: 210030,
    variety_type: 'landrace',
    country_of_origin: 'Afghanistan',
    distinctive_features: 'Landrace Indica. Origine des Indica modernes. Hindu Kush. En danger - Hybridation. Rarity: 7/10',
    olfactive_description: 'Terreux, Musqué, Épicé, Poivré, Résineux, Boisé',
    dominant_molecules: JSON.stringify([
      { molecule: 'Myrcène', percentage: 47.5, role: 'dominant' },
      { molecule: 'β-Caryophyllène', percentage: 15, role: 'secondary' },
      { molecule: 'α-Pinène', percentage: 7.5, role: 'tertiary' }
    ]),
    molecular_profile: JSON.stringify([
      { molecule: 'Myrcène', minPercent: 40, maxPercent: 55, typical: 47.5 },
      { molecule: 'β-Caryophyllène', minPercent: 10, maxPercent: 20, typical: 15 },
      { molecule: 'α-Pinène', minPercent: 5, maxPercent: 10, typical: 7.5 }
    ]),
    olfactive_notes: JSON.stringify({ top: ['Terreux', 'Musqué'], heart: ['Épicé', 'Poivré'], base: ['Résineux', 'Boisé'] })
  },
  {
    variety_id: 'landrace_thai_stick',
    name: 'Thai Stick (Landrace)',
    plant_id: 210030,
    variety_type: 'landrace',
    country_of_origin: 'Thailand',
    distinctive_features: 'Landrace Sativa Asie du Sud-Est. Quasi-éteinte (forme pure). Rarity: 9/10',
    olfactive_description: 'Citrus, Tropical, Terreux, Floral, Épicé doux',
    dominant_molecules: JSON.stringify([
      { molecule: 'Limonène', percentage: 30, role: 'dominant' },
      { molecule: 'Myrcène', percentage: 20, role: 'secondary' },
      { molecule: 'β-Caryophyllène', percentage: 15, role: 'tertiary' },
      { molecule: 'Terpinolène', percentage: 10, role: 'quaternary' }
    ]),
    molecular_profile: JSON.stringify([
      { molecule: 'Limonène', minPercent: 25, maxPercent: 35, typical: 30 },
      { molecule: 'Myrcène', minPercent: 15, maxPercent: 25, typical: 20 }
    ]),
    olfactive_notes: JSON.stringify({ top: ['Citrus', 'Tropical'], heart: ['Terreux', 'Floral'], base: ['Épicé doux'] })
  },
  {
    variety_id: 'landrace_malawi_gold',
    name: 'Malawi Gold (Landrace)',
    plant_id: 210030,
    variety_type: 'landrace',
    country_of_origin: 'Malawi',
    distinctive_features: 'Landrace Sativa Afrique de l Est. Sacrée. Rare - Cannabis interdit. Rarity: 8/10',
    olfactive_description: 'Floral, Pin, Herbacé, Sucré, Terreux',
    dominant_molecules: JSON.stringify([
      { molecule: 'Terpinolène', percentage: 35, role: 'dominant' },
      { molecule: 'Myrcène', percentage: 20, role: 'secondary' },
      { molecule: 'Ocimène', percentage: 12, role: 'tertiary' },
      { molecule: 'β-Caryophyllène', percentage: 10, role: 'quaternary' }
    ]),
    molecular_profile: JSON.stringify([
      { molecule: 'Terpinolène', minPercent: 30, maxPercent: 40, typical: 35 },
      { molecule: 'Myrcène', minPercent: 15, maxPercent: 25, typical: 20 }
    ]),
    olfactive_notes: JSON.stringify({ top: ['Floral', 'Pin'], heart: ['Herbacé', 'Sucré'], base: ['Terreux'] })
  },
  {
    variety_id: 'landrace_durban_poison',
    name: 'Durban Poison (Landrace)',
    plant_id: 210030,
    variety_type: 'landrace',
    country_of_origin: 'South Africa',
    distinctive_features: 'Landrace Sativa Afrique du Sud. Cultivée depuis 14e siècle. Rare - Hybridée. Rarity: 6/10',
    olfactive_description: 'Anis, Réglisse, Pin, Terreux, Résineux',
    dominant_molecules: JSON.stringify([
      { molecule: 'Terpinolène', percentage: 30, role: 'dominant' },
      { molecule: 'Myrcène', percentage: 20, role: 'secondary' },
      { molecule: 'Ocimène', percentage: 12, role: 'tertiary' },
      { molecule: 'β-Caryophyllène', percentage: 10, role: 'quaternary' }
    ]),
    molecular_profile: JSON.stringify([
      { molecule: 'Terpinolène', minPercent: 25, maxPercent: 35, typical: 30 },
      { molecule: 'Myrcène', minPercent: 15, maxPercent: 25, typical: 20 }
    ]),
    olfactive_notes: JSON.stringify({ top: ['Anis', 'Réglisse'], heart: ['Pin', 'Terreux'], base: ['Résineux'] })
  },
  {
    variety_id: 'landrace_angola_red',
    name: 'Angola Red (Landrace)',
    plant_id: 210030,
    variety_type: 'landrace',
    country_of_origin: 'Angola',
    distinctive_features: 'Landrace Sativa Afrique Centrale. Top 10 mondial. Quasi-éteinte. Rarity: 10/10',
    olfactive_description: 'Épicé, Boisé, Terreux, Poivré, Fumé',
    dominant_molecules: JSON.stringify([
      { molecule: 'β-Caryophyllène', percentage: 25, role: 'dominant' },
      { molecule: 'Myrcène', percentage: 15, role: 'secondary' },
      { molecule: 'Limonène', percentage: 12, role: 'tertiary' },
      { molecule: 'Humulène', percentage: 12, role: 'quaternary' }
    ]),
    molecular_profile: JSON.stringify([
      { molecule: 'β-Caryophyllène', minPercent: 20, maxPercent: 30, typical: 25 },
      { molecule: 'Myrcène', minPercent: 10, maxPercent: 20, typical: 15 }
    ]),
    olfactive_notes: JSON.stringify({ top: ['Épicé', 'Boisé'], heart: ['Terreux', 'Poivré'], base: ['Fumé'] })
  },
  {
    variety_id: 'landrace_lebanese_red',
    name: 'Lebanese Red (Landrace)',
    plant_id: 210030,
    variety_type: 'landrace',
    country_of_origin: 'Lebanon',
    distinctive_features: 'Hybride naturel Moyen-Orient. Haschisch libanais rouge. Rarity: 9/10',
    olfactive_description: 'Terreux, Épicé, Cèdre, Résineux, Fumé, Balsamique',
    dominant_molecules: JSON.stringify([
      { molecule: 'Myrcène', percentage: 30, role: 'dominant' },
      { molecule: 'β-Caryophyllène', percentage: 17, role: 'secondary' },
      { molecule: 'Pinène', percentage: 12, role: 'tertiary' },
      { molecule: 'Limonène', percentage: 10, role: 'quaternary' }
    ]),
    molecular_profile: JSON.stringify([
      { molecule: 'Myrcène', minPercent: 25, maxPercent: 35, typical: 30 },
      { molecule: 'β-Caryophyllène', minPercent: 12, maxPercent: 22, typical: 17 }
    ]),
    olfactive_notes: JSON.stringify({ top: ['Terreux', 'Épicé'], heart: ['Cèdre', 'Résineux'], base: ['Fumé', 'Balsamique'] })
  },
  {
    variety_id: 'landrace_oaxacan_gold',
    name: 'Oaxacan Gold (Landrace)',
    plant_id: 210030,
    variety_type: 'landrace',
    country_of_origin: 'Mexico',
    distinctive_features: 'Landrace Sativa Mexique. Exportée massivement années 1970. Rarity: 7/10',
    olfactive_description: 'Citrus, Terreux, Floral, Épicé',
    dominant_molecules: JSON.stringify([
      { molecule: 'Limonène', percentage: 28, role: 'dominant' },
      { molecule: 'Myrcène', percentage: 18, role: 'secondary' },
      { molecule: 'β-Caryophyllène', percentage: 14, role: 'tertiary' },
      { molecule: 'Linalool', percentage: 8, role: 'quaternary' }
    ]),
    molecular_profile: JSON.stringify([
      { molecule: 'Limonène', minPercent: 22, maxPercent: 34, typical: 28 },
      { molecule: 'Myrcène', minPercent: 14, maxPercent: 22, typical: 18 }
    ]),
    olfactive_notes: JSON.stringify({ top: ['Citrus', 'Tropical'], heart: ['Terreux', 'Floral'], base: ['Épicé'] })
  },
  {
    variety_id: 'landrace_colombian_gold',
    name: 'Colombian Gold (Landrace)',
    plant_id: 210030,
    variety_type: 'landrace',
    country_of_origin: 'Colombia',
    distinctive_features: 'Landrace Sativa Colombie. Légendaire années 1970. Quasi-éteinte. Rarity: 8/10',
    olfactive_description: 'Citrus, Skunk, Sucré, Terreux',
    dominant_molecules: JSON.stringify([
      { molecule: 'Limonène', percentage: 32, role: 'dominant' },
      { molecule: 'Myrcène', percentage: 16, role: 'secondary' },
      { molecule: 'β-Caryophyllène', percentage: 12, role: 'tertiary' },
      { molecule: 'Pinène', percentage: 10, role: 'quaternary' }
    ]),
    molecular_profile: JSON.stringify([
      { molecule: 'Limonène', minPercent: 26, maxPercent: 38, typical: 32 },
      { molecule: 'Myrcène', minPercent: 12, maxPercent: 20, typical: 16 }
    ]),
    olfactive_notes: JSON.stringify({ top: ['Citrus', 'Skunk'], heart: ['Sucré'], base: ['Terreux'] })
  },
  {
    variety_id: 'landrace_panama_red',
    name: 'Panama Red (Landrace)',
    plant_id: 210030,
    variety_type: 'landrace',
    country_of_origin: 'Panama',
    distinctive_features: 'Landrace Sativa Panama. Quasi-éteinte. Rarity: 9/10',
    olfactive_description: 'Épicé, Citrus, Boisé, Terreux',
    dominant_molecules: JSON.stringify([
      { molecule: 'β-Caryophyllène', percentage: 26, role: 'dominant' },
      { molecule: 'Limonène', percentage: 18, role: 'secondary' },
      { molecule: 'Myrcène', percentage: 14, role: 'tertiary' },
      { molecule: 'Humulène', percentage: 10, role: 'quaternary' }
    ]),
    molecular_profile: JSON.stringify([
      { molecule: 'β-Caryophyllène', minPercent: 20, maxPercent: 32, typical: 26 },
      { molecule: 'Limonène', minPercent: 14, maxPercent: 22, typical: 18 }
    ]),
    olfactive_notes: JSON.stringify({ top: ['Épicé', 'Citrus'], heart: ['Boisé'], base: ['Terreux'] })
  },
  {
    variety_id: 'landrace_acapulco_gold',
    name: 'Acapulco Gold (Landrace)',
    plant_id: 210030,
    variety_type: 'landrace',
    country_of_origin: 'Mexico',
    distinctive_features: 'Landrace Sativa Mexique. Icône années 1960-70. Hybridée. Rarity: 7/10',
    olfactive_description: 'Épicé, Citrus, Caramel, Terreux',
    dominant_molecules: JSON.stringify([
      { molecule: 'β-Caryophyllène', percentage: 24, role: 'dominant' },
      { molecule: 'Limonène', percentage: 20, role: 'secondary' },
      { molecule: 'Myrcène', percentage: 16, role: 'tertiary' },
      { molecule: 'Pinène', percentage: 8, role: 'quaternary' }
    ]),
    molecular_profile: JSON.stringify([
      { molecule: 'β-Caryophyllène', minPercent: 18, maxPercent: 30, typical: 24 },
      { molecule: 'Limonène', minPercent: 15, maxPercent: 25, typical: 20 }
    ]),
    olfactive_notes: JSON.stringify({ top: ['Épicé', 'Citrus'], heart: ['Caramel'], base: ['Terreux'] })
  },
  {
    variety_id: 'landrace_hindu_kush',
    name: 'Hindu Kush (Landrace)',
    plant_id: 210030,
    variety_type: 'landrace',
    country_of_origin: 'Afghanistan',
    distinctive_features: 'Landrace Indica. Origine Indica modernes. En danger - Hybridation. Rarity: 6/10',
    olfactive_description: 'Terreux, Pin, Sandalwood, Épicé',
    dominant_molecules: JSON.stringify([
      { molecule: 'Myrcène', percentage: 42, role: 'dominant' },
      { molecule: 'β-Caryophyllène', percentage: 14, role: 'secondary' },
      { molecule: 'Limonène', percentage: 10, role: 'tertiary' },
      { molecule: 'Pinène', percentage: 8, role: 'quaternary' }
    ]),
    molecular_profile: JSON.stringify([
      { molecule: 'Myrcène', minPercent: 35, maxPercent: 50, typical: 42 },
      { molecule: 'β-Caryophyllène', minPercent: 10, maxPercent: 18, typical: 14 }
    ]),
    olfactive_notes: JSON.stringify({ top: ['Terreux', 'Pin'], heart: ['Sandalwood'], base: ['Épicé'] })
  }
];

async function main() {
  const connection = await mysql.createConnection(process.env.DATABASE_URL);
  
  for (const landrace of landraces) {
    try {
      await connection.execute(
        `INSERT INTO plant_varieties (variety_id, name, plant_id, variety_type, country_of_origin, distinctive_features, olfactive_description, dominant_molecules, molecular_profile, olfactive_notes)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          landrace.variety_id, 
          landrace.name, 
          landrace.plant_id, 
          landrace.variety_type, 
          landrace.country_of_origin, 
          landrace.distinctive_features,
          landrace.olfactive_description,
          landrace.dominant_molecules,
          landrace.molecular_profile,
          landrace.olfactive_notes
        ]
      );
      console.log(`✓ Imported: ${landrace.name}`);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        console.log(`⊘ Already exists: ${landrace.name}`);
      } else {
        console.error(`✗ Error importing ${landrace.name}:`, error.message);
      }
    }
  }
  
  await connection.end();
  console.log('\\nImport complete!');
}

main().catch(console.error);
