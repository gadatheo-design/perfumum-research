/**
 * Seed script for Tobacco and Cannabis molecules, varieties, and terpenes
 * Run with: node scripts/seed-tobacco-cannabis.mjs
 */

import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;

// ============================================================================
// CANNABIS TERPENES DATA
// ============================================================================

const cannabisTerpenes = [
  // Monoterpènes
  { name: "α-Pinène", casNumber: "80-56-8", formula: "C10H16", mw: 136.23, bp: 155, olfactive: "Pin, résineux, frais", chemClass: "monoterpene" },
  { name: "β-Pinène", casNumber: "127-91-3", formula: "C10H16", mw: 136.23, bp: 166, olfactive: "Pin, boisé, herbacé", chemClass: "monoterpene" },
  { name: "β-Myrcène", casNumber: "123-35-3", formula: "C10H16", mw: 136.23, bp: 167, olfactive: "Terreux, musqué, mangue, clou de girofle", chemClass: "monoterpene" },
  { name: "Limonène", casNumber: "5989-27-5", formula: "C10H16", mw: 136.23, bp: 176, olfactive: "Agrumes, citron, orange", chemClass: "monoterpene" },
  { name: "Terpinolène", casNumber: "586-62-9", formula: "C10H16", mw: 136.23, bp: 186, olfactive: "Floral, herbacé, pin, agrumes légers", chemClass: "monoterpene" },
  { name: "β-Ocimène", casNumber: "3779-61-1", formula: "C10H16", mw: 136.23, bp: 177, olfactive: "Doux, herbacé, boisé", chemClass: "monoterpene" },
  { name: "Camphène", casNumber: "79-92-5", formula: "C10H16", mw: 136.23, bp: 159, olfactive: "Camphre, pin, terreux", chemClass: "monoterpene" },
  { name: "Sabinène", casNumber: "3387-41-5", formula: "C10H16", mw: 136.23, bp: 163, olfactive: "Épicé, boisé, pin", chemClass: "monoterpene" },
  { name: "α-Phellandrène", casNumber: "99-83-2", formula: "C10H16", mw: 136.23, bp: 171, olfactive: "Menthe, citrus, poivré", chemClass: "monoterpene" },
  { name: "3-Carène", casNumber: "498-15-7", formula: "C10H16", mw: 136.23, bp: 170, olfactive: "Doux, pin, cèdre", chemClass: "monoterpene" },
  { name: "α-Terpinène", casNumber: "99-86-5", formula: "C10H16", mw: 136.23, bp: 174, olfactive: "Citron, herbacé", chemClass: "monoterpene" },
  { name: "γ-Terpinène", casNumber: "99-85-4", formula: "C10H16", mw: 136.23, bp: 183, olfactive: "Citrus, herbacé, doux", chemClass: "monoterpene" },
  
  // Monoterpénoïdes
  { name: "Linalool", casNumber: "78-70-6", formula: "C10H18O", mw: 154.25, bp: 198, olfactive: "Floral, lavande, épicé", chemClass: "alcohol" },
  { name: "Eucalyptol", casNumber: "470-82-6", formula: "C10H18O", mw: 154.25, bp: 176, olfactive: "Menthol, eucalyptus, frais", chemClass: "ether" },
  { name: "Géraniol", casNumber: "106-24-1", formula: "C10H18O", mw: 154.25, bp: 230, olfactive: "Rose, floral, fruité", chemClass: "alcohol" },
  { name: "Nérol", casNumber: "106-25-2", formula: "C10H18O", mw: 154.25, bp: 225, olfactive: "Rose, citrus, doux", chemClass: "alcohol" },
  { name: "α-Terpinéol", casNumber: "98-55-5", formula: "C10H18O", mw: 154.25, bp: 219, olfactive: "Lilas, floral, agrumes", chemClass: "alcohol" },
  { name: "Bornéol", casNumber: "507-70-0", formula: "C10H18O", mw: 154.25, bp: 212, olfactive: "Camphre, menthe, boisé", chemClass: "alcohol" },
  { name: "Isopulégol", casNumber: "89-79-2", formula: "C10H18O", mw: 154.25, bp: 212, olfactive: "Menthe, fraîcheur", chemClass: "alcohol" },
  { name: "Fenchol", casNumber: "1632-73-1", formula: "C10H18O", mw: 154.25, bp: 201, olfactive: "Camphre, citron, terreux", chemClass: "alcohol" },
  { name: "Menthol", casNumber: "89-78-1", formula: "C10H20O", mw: 156.27, bp: 212, olfactive: "Menthe, frais, rafraîchissant", chemClass: "alcohol" },
  { name: "Camphre", casNumber: "76-22-2", formula: "C10H16O", mw: 152.23, bp: 204, olfactive: "Camphre, menthol, piquant", chemClass: "ketone" },
  { name: "Fenchone", casNumber: "1195-79-5", formula: "C10H16O", mw: 152.23, bp: 193, olfactive: "Camphre, menthe", chemClass: "ketone" },
  { name: "Pulégone", casNumber: "89-82-7", formula: "C10H16O", mw: 152.23, bp: 224, olfactive: "Menthe poivrée, camphre", chemClass: "ketone" },
  
  // Sesquiterpènes
  { name: "β-Caryophyllène", casNumber: "87-44-5", formula: "C15H24", mw: 204.35, bp: 262, olfactive: "Poivré, épicé, boisé", chemClass: "sesquiterpene" },
  { name: "α-Humulène", casNumber: "6753-98-6", formula: "C15H24", mw: 204.35, bp: 166, olfactive: "Houblon, terreux, boisé", chemClass: "sesquiterpene" },
  { name: "Valencène", casNumber: "4630-07-3", formula: "C15H24", mw: 204.35, bp: 269, olfactive: "Agrumes, orange douce", chemClass: "sesquiterpene" },
  { name: "α-Cédrène", casNumber: "469-61-4", formula: "C15H24", mw: 204.35, bp: 262, olfactive: "Cèdre, boisé", chemClass: "sesquiterpene" },
  { name: "Farnésène", casNumber: "502-61-4", formula: "C15H24", mw: 204.35, bp: 260, olfactive: "Pomme verte, boisé", chemClass: "sesquiterpene" },
  
  // Sesquiterpénoïdes
  { name: "trans-Nérolidol", casNumber: "40716-66-3", formula: "C15H26O", mw: 222.37, bp: 276, olfactive: "Boisé, écorce, floral", chemClass: "alcohol" },
  { name: "cis-Nérolidol", casNumber: "3790-78-1", formula: "C15H26O", mw: 222.37, bp: 276, olfactive: "Écorce, rose, boisé", chemClass: "alcohol" },
  { name: "α-Bisabolol", casNumber: "23089-26-1", formula: "C15H26O", mw: 222.37, bp: 315, olfactive: "Floral, doux, camomille", chemClass: "alcohol" },
  { name: "Guaiol", casNumber: "489-86-1", formula: "C15H26O", mw: 222.37, bp: 288, olfactive: "Pin, boisé, rose", chemClass: "alcohol" },
  { name: "Caryophyllène oxide", casNumber: "1139-30-6", formula: "C15H24O", mw: 220.35, bp: 280, olfactive: "Boisé, épicé, doux", chemClass: "ether" },
  { name: "Cédrol", casNumber: "77-53-2", formula: "C15H26O", mw: 222.37, bp: 291, olfactive: "Cèdre, boisé, ambré", chemClass: "alcohol" },
];

// ============================================================================
// TOBACCO MOLECULES DATA
// ============================================================================

const tobaccoMolecules = [
  // Norisoprénoïdes (dérivés caroténoïdes)
  { name: "α-Ionone", casNumber: "127-41-3", formula: "C13H20O", mw: 192.30, bp: 258, olfactive: "Violette, boisé, fruité, iris", chemClass: "ketone", source: "tabac" },
  { name: "β-Ionone", casNumber: "14901-07-6", formula: "C13H20O", mw: 192.30, bp: 266, olfactive: "Violette, boisé, fruité, cèdre", chemClass: "ketone", source: "tabac" },
  { name: "Dihydro-β-ionone", casNumber: "17283-81-7", formula: "C13H22O", mw: 194.31, bp: 250, olfactive: "Boisé, ambré, tabac", chemClass: "ketone", source: "tabac" },
  { name: "β-Damascenone", casNumber: "23726-93-4", formula: "C13H18O", mw: 190.28, bp: 274, olfactive: "Fruité, pomme, rose, prune, thé, tabac", chemClass: "ketone", source: "tabac" },
  { name: "β-Damascone", casNumber: "23726-92-3", formula: "C13H20O", mw: 192.30, bp: 280, olfactive: "Tabac, rose, pomme, thé, fruité", chemClass: "ketone", source: "tabac" },
  { name: "α-Damascone", casNumber: "43052-87-5", formula: "C13H20O", mw: 192.30, bp: 278, olfactive: "Fruité, pomme, rose", chemClass: "ketone", source: "tabac" },
  { name: "Megastigmatrienone A", casNumber: "38818-55-2", formula: "C13H18O", mw: 190.28, bp: 265, olfactive: "Tabac, épicé, boisé", chemClass: "ketone", source: "tabac" },
  
  // Diterpènes et labdanoïdes
  { name: "Solanone", casNumber: "1937-54-8", formula: "C13H22O", mw: 194.31, bp: 240, olfactive: "Tabac, foin, herbacé, terreux", chemClass: "ketone", source: "tabac" },
  { name: "Neophytadiene", casNumber: "504-96-1", formula: "C20H38", mw: 278.52, bp: 330, olfactive: "Herbacé, vert, tabac", chemClass: "diterpene", source: "tabac" },
  { name: "Phytol", casNumber: "150-86-7", formula: "C20H40O", mw: 296.53, bp: 350, olfactive: "Floral, balsamique, vert", chemClass: "alcohol", source: "tabac" },
  { name: "Cembratrienol", casNumber: "28266-68-2", formula: "C20H34O", mw: 290.48, bp: 340, olfactive: "Ambré, boisé, tabac", chemClass: "alcohol", source: "tabac" },
  
  // Composés aromatiques
  { name: "Benzaldéhyde", casNumber: "100-52-7", formula: "C7H6O", mw: 106.12, bp: 178, olfactive: "Amande amère, cerise", chemClass: "aldehyde", source: "tabac" },
  { name: "Acétophénone", casNumber: "98-86-2", formula: "C8H8O", mw: 120.15, bp: 202, olfactive: "Floral, amande, cerise", chemClass: "ketone", source: "tabac" },
  { name: "Eugénol", casNumber: "97-53-0", formula: "C10H12O2", mw: 164.20, bp: 254, olfactive: "Clou de girofle, épicé", chemClass: "phenol", source: "tabac" },
  { name: "Vanilline", casNumber: "121-33-5", formula: "C8H8O3", mw: 152.15, bp: 285, olfactive: "Vanille, sucré", chemClass: "aldehyde", source: "tabac" },
  { name: "Guaiacol", casNumber: "90-05-1", formula: "C7H8O2", mw: 124.14, bp: 205, olfactive: "Fumé, phénolique, bacon", chemClass: "phenol", source: "tabac" },
  { name: "4-Vinylguaiacol", casNumber: "7786-61-0", formula: "C9H10O2", mw: 150.17, bp: 224, olfactive: "Fumé, clou de girofle", chemClass: "phenol", source: "tabac" },
  
  // Alcaloïdes
  { name: "Nicotine", casNumber: "54-11-5", formula: "C10H14N2", mw: 162.23, bp: 247, olfactive: "Âcre, tabac (non olfactif)", chemClass: "heterocyclic", source: "tabac" },
  { name: "Nornicotine", casNumber: "494-97-3", formula: "C9H12N2", mw: 148.20, bp: 270, olfactive: "Âcre (non olfactif)", chemClass: "heterocyclic", source: "tabac" },
];

// ============================================================================
// TOBACCO VARIETIES DATA
// ============================================================================

const tobaccoVarieties = [
  // Tabacs orientaux
  { name: "Yenidje", type: "oriental", origin: "Grèce (Thrace)", profile: "Arôme complexe, floral-épicé", status: "Rare" },
  { name: "Samsun", type: "oriental", origin: "Turquie (Mer Noire)", profile: "Doux, aromatique, légèrement sucré", status: "Cultivé" },
  { name: "Basma", type: "oriental", origin: "Grèce", profile: "Fin, délicat, floral", status: "Cultivé" },
  { name: "Katerini", type: "oriental", origin: "Grèce", profile: "Épicé, terreux, riche", status: "Cultivé" },
  { name: "Drama", type: "oriental", origin: "Grèce", profile: "Herbacé, légèrement fumé", status: "Rare" },
  { name: "Izmir/Smyrna", type: "oriental", origin: "Turquie", profile: "Aromatique, doux, fruité", status: "Cultivé" },
  { name: "Xanthi", type: "oriental", origin: "Grèce (Thrace)", profile: "Floral, miel, épicé", status: "Rare" },
  { name: "Bashi Bagli", type: "oriental", origin: "Turquie", profile: "Herbacé, doux", status: "Rare" },
  { name: "Dubek", type: "oriental", origin: "Macédoine", profile: "Aromatique, complexe", status: "Très rare" },
  { name: "Djebel", type: "oriental", origin: "Syrie", profile: "Épicé, résineux", status: "En danger" },
  
  // Tabacs américains
  { name: "Virginia", type: "blond", origin: "États-Unis", profile: "Sucré, foin, miel, notes fruitées légères", status: "Cultivé" },
  { name: "Burley", type: "brun", origin: "États-Unis", profile: "Noisette, chocolat, terreux, léger fumé", status: "Cultivé" },
  { name: "Perique", type: "experimental", origin: "Louisiane, États-Unis", profile: "Fruité fermenté, prune, figue, épicé, poivré", status: "Très rare" },
  { name: "Latakia", type: "oriental", origin: "Syrie/Chypre", profile: "Très fumé, cuir, camphré, épicé", status: "Rare" },
  { name: "Dark Fired Kentucky", type: "brun", origin: "Kentucky, États-Unis", profile: "Fumé intense, bacon", status: "Traditionnel" },
  { name: "Maryland 609", type: "blond", origin: "Maryland, États-Unis", profile: "Neutre, léger", status: "Rare" },
  { name: "Havana Seed", type: "brun", origin: "Cuba/Connecticut", profile: "Riche, terreux", status: "Rare" },
  { name: "Orinoco", type: "blond", origin: "Venezuela/Virginie", profile: "Doux, aromatique", status: "Historique" },
];

// ============================================================================
// CANNABIS VARIETIES DATA
// ============================================================================

const cannabisVarieties = [
  // Asie du Sud (var. indica - "Sativa" historique)
  { name: "Kerala Gold", origin: "Kerala, Inde", type: "landrace", status: "En danger", terpenes: "Limonène, myrcène, pinène", notes: "Sativa pure, effets énergisants" },
  { name: "Malana Cream", origin: "Himachal Pradesh, Inde", type: "landrace", status: "En danger", terpenes: "Myrcène, caryophyllène, pinène", notes: "Célèbre pour le charas" },
  { name: "Idukki Gold", origin: "Kerala, Inde", type: "landrace", status: "Très rare", terpenes: "Limonène, terpinolène", notes: "Landrace légendaire" },
  { name: "Thai Stick", origin: "Thaïlande", type: "landrace", status: "En danger", terpenes: "Terpinolène, limonène, pinène", notes: "Sativa pure, floraison longue" },
  { name: "Chocolate Thai", origin: "Thaïlande", type: "landrace", status: "Très rare", terpenes: "Caryophyllène, myrcène", notes: "Notes chocolatées" },
  { name: "Cambodian", origin: "Cambodge", type: "landrace", status: "Rare", terpenes: "Myrcène, terpinolène", notes: "Sativa équatoriale" },
  
  // Asie Centrale (var. afghanica - "Indica" historique)
  { name: "Afghan Kush", origin: "Hindu Kush, Afghanistan", type: "landrace", status: "En danger", terpenes: "Myrcène, caryophyllène, limonène", notes: "Indica pure, résine abondante" },
  { name: "Mazar-i-Sharif", origin: "Nord Afghanistan", type: "landrace", status: "Très rare", terpenes: "Myrcène, pinène, humulène", notes: "Région de haschich traditionnel" },
  { name: "Kandahar", origin: "Sud Afghanistan", type: "landrace", status: "En danger", terpenes: "Caryophyllène, myrcène", notes: "Climat aride" },
  { name: "Chitral", origin: "Pakistan (KPK)", type: "landrace", status: "Rare", terpenes: "Myrcène, pinène", notes: "Couleurs pourpres" },
  { name: "Pakistani Kush", origin: "Vallée de Swat, Pakistan", type: "landrace", status: "En danger", terpenes: "Myrcène, limonène", notes: "Résistante au froid" },
  
  // Afrique
  { name: "Durban Poison", origin: "Afrique du Sud", type: "landrace", status: "Préservée", terpenes: "Terpinolène, myrcène, ocimène", notes: "Sativa pure, très aromatique" },
  { name: "Malawi Gold", origin: "Malawi", type: "landrace", status: "En danger", terpenes: "Limonène, terpinolène", notes: "Floraison très longue" },
  { name: "Swazi Gold", origin: "Eswatini", type: "landrace", status: "Rare", terpenes: "Limonène, pinène", notes: "Montagnes du Swaziland" },
  { name: "Kilimanjaro", origin: "Tanzanie", type: "landrace", status: "Très rare", terpenes: "Pinène, limonène", notes: "Haute altitude" },
  { name: "Ethiopian Highland", origin: "Éthiopie", type: "landrace", status: "Très rare", terpenes: "Terpinolène, myrcène", notes: "Génétique ancienne" },
  
  // Amériques
  { name: "Acapulco Gold", origin: "Guerrero, Mexique", type: "landrace", status: "Très rare", terpenes: "Limonène, myrcène, caryophyllène", notes: "Légendaire, dorée" },
  { name: "Panama Red", origin: "Panama", type: "landrace", status: "Très rare", terpenes: "Terpinolène, limonène, pinène", notes: "Couleur rougeâtre" },
  { name: "Colombian Gold", origin: "Colombie", type: "landrace", status: "En danger", terpenes: "Limonène, caryophyllène", notes: "Années 70" },
  { name: "Lamb's Bread", origin: "Jamaïque", type: "landrace", status: "Rare", terpenes: "Limonène, myrcène", notes: "Associée à Bob Marley" },
  { name: "Hawaiian", origin: "Hawaï", type: "landrace", status: "Rare", terpenes: "Limonène, myrcène, terpinolène", notes: "Climat tropical" },
  { name: "Maui Wowie", origin: "Maui, Hawaï", type: "landrace", status: "Rare", terpenes: "Limonène, pinène", notes: "Volcanique" },
];

// ============================================================================
// MAIN SEEDING FUNCTION
// ============================================================================

async function seedDatabase() {
  if (!DATABASE_URL) {
    console.error('DATABASE_URL not set');
    process.exit(1);
  }

  const connection = await mysql.createConnection(DATABASE_URL);
  
  try {
    console.log('🌿 Starting seed for Tobacco and Cannabis data...');
    
    // Insert Cannabis Terpenes as molecules
    console.log('\n📊 Inserting Cannabis terpenes...');
    for (const terpene of cannabisTerpenes) {
      const [existing] = await connection.execute(
        'SELECT id FROM molecules WHERE cas_number = ? OR name = ?',
        [terpene.casNumber, terpene.name]
      );
      
      if (existing.length === 0) {
        await connection.execute(
          `INSERT INTO molecules (name, cas_number, chemicalFormula, molecularWeight, boilingPoint, olfactiveProfile, chemical_class, family, sourceOrigin)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            terpene.name,
            terpene.casNumber,
            terpene.formula,
            terpene.mw,
            terpene.bp,
            terpene.olfactive,
            terpene.chemClass,
            'Terpène (Cannabis)',
            'Cannabis sativa'
          ]
        );
        console.log(`  ✓ Added: ${terpene.name}`);
      } else {
        console.log(`  ○ Exists: ${terpene.name}`);
      }
    }
    
    // Insert Tobacco Molecules
    console.log('\n🍂 Inserting Tobacco molecules...');
    for (const mol of tobaccoMolecules) {
      const [existing] = await connection.execute(
        'SELECT id FROM molecules WHERE cas_number = ? OR name = ?',
        [mol.casNumber, mol.name]
      );
      
      if (existing.length === 0) {
        await connection.execute(
          `INSERT INTO molecules (name, cas_number, chemicalFormula, molecularWeight, boilingPoint, olfactiveProfile, chemical_class, family, sourceOrigin)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            mol.name,
            mol.casNumber,
            mol.formula,
            mol.mw,
            mol.bp,
            mol.olfactive,
            mol.chemClass,
            'Composé du Tabac',
            'Nicotiana tabacum'
          ]
        );
        console.log(`  ✓ Added: ${mol.name}`);
      } else {
        console.log(`  ○ Exists: ${mol.name}`);
      }
    }
    
    // Insert Tobacco Varieties
    console.log('\n🚬 Inserting Tobacco varieties...');
    for (const variety of tobaccoVarieties) {
      const [existing] = await connection.execute(
        'SELECT id FROM tabacs WHERE name = ?',
        [variety.name]
      );
      
      if (existing.length === 0) {
        await connection.execute(
          `INSERT INTO tabacs (name, type, origin, aromaticProfile, internalNotes)
           VALUES (?, ?, ?, ?, ?)`,
          [
            variety.name,
            variety.type,
            variety.origin,
            JSON.stringify([variety.profile]),
            `Statut: ${variety.status}`
          ]
        );
        console.log(`  ✓ Added: ${variety.name}`);
      } else {
        console.log(`  ○ Exists: ${variety.name}`);
      }
    }
    
    // Insert Cannabis Varieties as Plants
    console.log('\n🌿 Inserting Cannabis varieties as plants...');
    for (const variety of cannabisVarieties) {
      const [existing] = await connection.execute(
        'SELECT id FROM plants WHERE name = ?',
        [variety.name]
      );
      
      if (existing.length === 0) {
        await connection.execute(
          `INSERT INTO plants (name, latin_name, category, origin, olfactive_signature, dominant_molecules, notes)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            variety.name,
            'Cannabis sativa subsp. indica',
            'cannabis',
            variety.origin,
            variety.notes,
            JSON.stringify(variety.terpenes.split(', ')),
            `Type: ${variety.type} | Statut: ${variety.status}`
          ]
        );
        console.log(`  ✓ Added: ${variety.name}`);
      } else {
        console.log(`  ○ Exists: ${variety.name}`);
      }
    }
    
    console.log('\n✅ Seed completed successfully!');
    
    // Get counts
    const [molCount] = await connection.execute('SELECT COUNT(*) as count FROM molecules');
    const [tabacCount] = await connection.execute('SELECT COUNT(*) as count FROM tabacs');
    const [plantCount] = await connection.execute('SELECT COUNT(*) as count FROM plants');
    
    console.log('\n📈 Database statistics:');
    console.log(`   Molecules: ${molCount[0].count}`);
    console.log(`   Tabacs: ${tabacCount[0].count}`);
    console.log(`   Plants: ${plantCount[0].count}`);
    
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  } finally {
    await connection.end();
  }
}

seedDatabase().catch(console.error);
