/**
 * Script pour ajouter les molécules manquantes et le terroir Désert de Sonora
 */

import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;

// Molécules manquantes à ajouter
const MISSING_MOLECULES = [
  // Terpènes et sesquiterpènes
  { name: "1,8-Cinéole", iupacName: "1,3,3-trimethyl-2-oxabicyclo[2.2.2]octane", casNumber: "470-82-6", chemicalClass: "monoterpene", family: "Oxydes terpéniques", olfactiveProfile: "Frais, camphré, eucalyptus, mentholé" },
  { name: "Zingibérène", iupacName: "(5R)-2-methyl-5-[(2S)-6-methylhept-5-en-2-yl]cyclohexa-1,3-diene", casNumber: "495-60-3", chemicalClass: "sesquiterpene", family: "Sesquiterpènes monocycliques", olfactiveProfile: "Épicé, gingembre, boisé chaud" },
  { name: "β-Santalol", iupacName: "[(1S,4R)-4-[(Z)-1-hydroxy-1-methylallyl]-4-methylcyclohex-2-en-1-yl]methanol", casNumber: "77-42-9", chemicalClass: "sesquiterpene", family: "Sesquiterpènes", olfactiveProfile: "Boisé, crémeux, santal, doux" },
  { name: "α-Vétivone", iupacName: "(4aS,8aR)-4,4a,5,6,7,8-hexahydro-4,4a-dimethyl-6-(1-methylethenyl)-2(3H)-naphthalenone", casNumber: "15764-04-2", chemicalClass: "sesquiterpene", family: "Cétones sesquiterpéniques", olfactiveProfile: "Terreux, boisé, vétiver" },
  { name: "β-Vétivone", iupacName: "(4aR,8aS)-4,4a,5,6,7,8-hexahydro-4,4a-dimethyl-6-(1-methylethenyl)-2(3H)-naphthalenone", casNumber: "18444-79-6", chemicalClass: "sesquiterpene", family: "Cétones sesquiterpéniques", olfactiveProfile: "Terreux, boisé, vétiver" },
  { name: "Germacrène D", iupacName: "(1E,6E,8S)-1-methyl-5-methylidene-8-(1-methylethyl)cyclodeca-1,6-diene", casNumber: "23986-74-5", chemicalClass: "sesquiterpene", family: "Sesquiterpènes macrocycliques", olfactiveProfile: "Boisé, épicé, herbacé" },
  { name: "α-Bulnésène", casNumber: "3691-11-0", chemicalClass: "sesquiterpene", family: "Sesquiterpènes", olfactiveProfile: "Boisé, terreux" },
  { name: "α-Guaiène", casNumber: "3691-12-1", chemicalClass: "sesquiterpene", family: "Sesquiterpènes", olfactiveProfile: "Boisé, balsamique" },
  { name: "Séychellène", casNumber: "20085-93-2", chemicalClass: "sesquiterpene", family: "Sesquiterpènes tricycliques", olfactiveProfile: "Boisé, patchouli" },
  { name: "α-Patchoulène", casNumber: "560-32-7", chemicalClass: "sesquiterpene", family: "Sesquiterpènes", olfactiveProfile: "Boisé, terreux, patchouli" },
  { name: "β-Patchoulène", casNumber: "514-51-2", chemicalClass: "sesquiterpene", family: "Sesquiterpènes", olfactiveProfile: "Boisé, terreux" },
  { name: "Norpatchoulénol", casNumber: "41429-52-1", chemicalClass: "sesquiterpene", family: "Alcools sesquiterpéniques", olfactiveProfile: "Boisé, patchouli, terreux" },
  { name: "α-Bergamotène", casNumber: "17699-05-7", chemicalClass: "sesquiterpene", family: "Sesquiterpènes", olfactiveProfile: "Boisé, bergamote" },
  { name: "Santalène", casNumber: "512-61-8", chemicalClass: "sesquiterpene", family: "Sesquiterpènes", olfactiveProfile: "Boisé, santal" },
  { name: "β-Bisabolène", casNumber: "495-61-4", chemicalClass: "sesquiterpene", family: "Sesquiterpènes", olfactiveProfile: "Balsamique, épicé" },
  { name: "β-Sesquiphellandrène", casNumber: "20307-83-9", chemicalClass: "sesquiterpene", family: "Sesquiterpènes", olfactiveProfile: "Épicé, gingembre" },
  { name: "ar-Curcumène", casNumber: "644-30-4", chemicalClass: "sesquiterpene", family: "Sesquiterpènes aromatiques", olfactiveProfile: "Épicé, curcuma" },
  { name: "β-Phellandrène", casNumber: "555-10-2", chemicalClass: "monoterpene", family: "Monoterpènes", olfactiveProfile: "Menthé, terpénique" },
  { name: "α-Thujène", casNumber: "2867-05-2", chemicalClass: "monoterpene", family: "Monoterpènes bicycliques", olfactiveProfile: "Herbacé, boisé" },
  { name: "δ-3-Carène", casNumber: "13466-78-9", chemicalClass: "monoterpene", family: "Monoterpènes bicycliques", olfactiveProfile: "Résineux, pin, doux" },
  
  // Alcools
  { name: "Lavandulol", casNumber: "498-16-8", chemicalClass: "alcohol", family: "Alcools monoterpéniques", olfactiveProfile: "Floral, lavande, herbacé" },
  { name: "Terpinène-4-ol", casNumber: "562-74-3", chemicalClass: "alcohol", family: "Alcools monoterpéniques", olfactiveProfile: "Terreux, musqué, épicé" },
  { name: "Farnésol", casNumber: "4602-84-0", chemicalClass: "alcohol", family: "Alcools sesquiterpéniques", olfactiveProfile: "Floral, muguet, tilleul" },
  { name: "Vétisélénène", casNumber: "28624-23-9", chemicalClass: "sesquiterpene", family: "Sesquiterpènes", olfactiveProfile: "Boisé, vétiver" },
  { name: "β-Vétispirène", casNumber: "63837-33-2", chemicalClass: "sesquiterpene", family: "Sesquiterpènes spiraniques", olfactiveProfile: "Boisé, vétiver" },
  { name: "Benzyl alcool", casNumber: "100-51-6", chemicalClass: "alcohol", family: "Alcools aromatiques", olfactiveProfile: "Floral, amande, balsamique" },
  { name: "Nuciférol", casNumber: "28400-11-5", chemicalClass: "alcohol", family: "Alcools sesquiterpéniques", olfactiveProfile: "Boisé, santal" },
  
  // Esters
  { name: "Benzyl acétate", casNumber: "140-11-4", chemicalClass: "ester", family: "Esters aromatiques", olfactiveProfile: "Floral, jasmin, fruité" },
  { name: "Benzyl benzoate", casNumber: "120-51-4", chemicalClass: "ester", family: "Esters aromatiques", olfactiveProfile: "Balsamique, amande, léger" },
  { name: "Acétate de cinnamyle", casNumber: "103-54-8", chemicalClass: "ester", family: "Esters aromatiques", olfactiveProfile: "Floral, balsamique, cannelle" },
  { name: "Acétate d'eugényle", casNumber: "93-28-7", chemicalClass: "ester", family: "Esters phénoliques", olfactiveProfile: "Épicé, clou de girofle, floral" },
  { name: "Méthyl benzoate", casNumber: "93-58-3", chemicalClass: "ester", family: "Esters aromatiques", olfactiveProfile: "Floral, fruité, balsamique" },
  { name: "Méthyl salicylate", casNumber: "119-36-8", chemicalClass: "ester", family: "Esters salicyliques", olfactiveProfile: "Wintergreen, menthé, médicinal" },
  { name: "Méthyl anthranilate", casNumber: "134-20-3", chemicalClass: "ester", family: "Esters anthraniliques", olfactiveProfile: "Fruité, raisin, floral" },
  
  // Aldéhydes et cétones
  { name: "Géranial", casNumber: "141-27-5", chemicalClass: "aldehyde", family: "Aldéhydes monoterpéniques", olfactiveProfile: "Citronné, citron, frais" },
  { name: "Néral", casNumber: "106-26-3", chemicalClass: "aldehyde", family: "Aldéhydes monoterpéniques", olfactiveProfile: "Citronné, doux, citron" },
  { name: "Tagetone", casNumber: "546-49-6", chemicalClass: "ketone", family: "Cétones monoterpéniques", olfactiveProfile: "Herbacé, fruité, tagète" },
  
  // Autres composés
  { name: "Méthyleugénol", casNumber: "93-15-2", chemicalClass: "phenol", family: "Phénylpropanoïdes", olfactiveProfile: "Épicé, clou de girofle, herbacé" },
  { name: "p-Crésyl méthyl éther", casNumber: "104-93-8", chemicalClass: "ether", family: "Éthers aromatiques", olfactiveProfile: "Floral, ylang, animalique" },
  { name: "NDGA", iupacName: "Acide nordihydroguaiarétique", casNumber: "500-38-9", chemicalClass: "phenol", family: "Lignanes", olfactiveProfile: "Résineux, créosote" },
  { name: "Théobromine", casNumber: "83-67-0", chemicalClass: "heterocyclic", family: "Alcaloïdes", olfactiveProfile: "Cacao, amer" },
  { name: "Acide acétique", casNumber: "64-19-7", chemicalClass: "other", family: "Acides carboxyliques", olfactiveProfile: "Vinaigre, acide" },
  { name: "Epi-β-santalène", casNumber: "25532-79-0", chemicalClass: "sesquiterpene", family: "Sesquiterpènes", olfactiveProfile: "Boisé, santal" }
];

// Terroir Désert de Sonora
const SONORA_TERROIR = {
  terroirId: "TER-MEX-SON",
  name: "Désert de Sonora",
  country: "Mexique",
  region: "Sonora / Arizona",
  subRegion: "Désert de Sonora",
  latitude: 31.5,
  longitude: -111.0,
  altitude: "0-1500m",
  climateType: "arid",
  avgTemperature: "20-35°C",
  annualRainfall: "75-400mm",
  humidity: "10-40%",
  soilType: "sandy",
  soilDescription: "Sols sableux et rocailleux, riches en minéraux, drainage excellent",
  olfactiveSignature: "Créosote (gobernadora), résines de pin, sauge, terre sèche après la pluie (petrichor)",
  historicalContext: "Le désert de Sonora est l'un des déserts les plus chauds d'Amérique du Nord, s'étendant sur le nord-ouest du Mexique et le sud-ouest des États-Unis. Les peuples autochtones Tohono O'odham et Seri utilisent traditionnellement les plantes locales pour leurs rituels et médecines.",
  culturalSignificance: "La gobernadora (Larrea tridentata) est considérée comme la plante la plus caractéristique du désert de Sonora, connue pour son odeur distinctive après la pluie. La sauge blanche est utilisée dans les cérémonies de purification.",
  keyPlants: "Gobernadora, Sauge Blanche, Pin Pinyon, Agave, Jojoba, Ocotillo"
};

// Plantes à associer au terroir Désert de Sonora
const SONORA_PLANTS = [
  "Gobernadora",
  "Sauge Blanche", 
  "Pin Pinyon"
];

async function main() {
  const connection = await mysql.createConnection(DATABASE_URL);
  
  console.log('\n=== AJOUT DES MOLÉCULES MANQUANTES ===\n');
  
  let moleculesCreated = 0;
  let moleculesSkipped = 0;
  
  for (const mol of MISSING_MOLECULES) {
    // Vérifier si la molécule existe déjà
    const [existing] = await connection.query(
      `SELECT id FROM molecules WHERE name = ? OR cas_number = ?`,
      [mol.name, mol.casNumber]
    );
    
    if (existing.length > 0) {
      console.log(`  - Existant: ${mol.name}`);
      moleculesSkipped++;
      continue;
    }
    
    // Créer la molécule
    await connection.query(
      `INSERT INTO molecules (name, iupac_name, cas_number, chemical_class, family, olfactiveProfile, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [mol.name, mol.iupacName || null, mol.casNumber, mol.chemicalClass, mol.family, mol.olfactiveProfile]
    );
    console.log(`  + Créé: ${mol.name} (${mol.chemicalClass})`);
    moleculesCreated++;
  }
  
  console.log(`\nMolécules créées: ${moleculesCreated}`);
  console.log(`Molécules existantes: ${moleculesSkipped}`);
  
  // Créer le terroir Désert de Sonora
  console.log('\n=== CRÉATION DU TERROIR DÉSERT DE SONORA ===\n');
  
  const [existingTerroir] = await connection.query(
    `SELECT id FROM terroirs WHERE terroir_id = ?`,
    [SONORA_TERROIR.terroirId]
  );
  
  let terroirId;
  if (existingTerroir.length > 0) {
    console.log(`  - Terroir existant: ${SONORA_TERROIR.name}`);
    terroirId = existingTerroir[0].id;
  } else {
    const [result] = await connection.query(
      `INSERT INTO terroirs (terroir_id, name, country, region, sub_region, latitude, longitude, altitude, climate_type, avg_temperature, annual_rainfall, humidity, soil_type, soil_characteristics, production_history, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        SONORA_TERROIR.terroirId,
        SONORA_TERROIR.name,
        SONORA_TERROIR.country,
        SONORA_TERROIR.region,
        SONORA_TERROIR.subRegion,
        SONORA_TERROIR.latitude,
        SONORA_TERROIR.longitude,
        SONORA_TERROIR.altitude,
        SONORA_TERROIR.climateType,
        SONORA_TERROIR.avgTemperature,
        SONORA_TERROIR.annualRainfall,
        SONORA_TERROIR.humidity,
        SONORA_TERROIR.soilType,
        SONORA_TERROIR.soilDescription + " | Signature olfactive: " + SONORA_TERROIR.olfactiveSignature + " | Plantes clés: " + SONORA_TERROIR.keyPlants,
        SONORA_TERROIR.historicalContext + " | " + SONORA_TERROIR.culturalSignificance
      ]
    );
    terroirId = result.insertId;
    console.log(`  + Terroir créé: ${SONORA_TERROIR.name} (ID: ${terroirId})`);
  }
  
  // Associer les plantes au terroir
  console.log('\n=== ASSOCIATION DES PLANTES AU TERROIR ===\n');
  
  for (const plantName of SONORA_PLANTS) {
    const [plants] = await connection.query(
      `SELECT id, name FROM plants WHERE name LIKE ?`,
      [`%${plantName}%`]
    );
    
    if (plants.length === 0) {
      console.log(`  ⚠️ Plante non trouvée: ${plantName}`);
      continue;
    }
    
    const plant = plants[0];
    
    // Vérifier si l'association existe déjà
    const [existingLink] = await connection.query(
      `SELECT * FROM plant_terroirs WHERE plant_id = ? AND terroir_id = ?`,
      [plant.id, terroirId]
    );
    
    if (existingLink.length > 0) {
      console.log(`  - Association existante: ${plant.name} → ${SONORA_TERROIR.name}`);
    } else {
      await connection.query(
        `INSERT INTO plant_terroirs (plant_id, terroir_id, quality_notes, notes, created_at)
         VALUES (?, ?, 'Qualité exceptionnelle dans son habitat naturel', 'Plante native du désert de Sonora - endémique', NOW())`,
        [plant.id, terroirId]
      );
      console.log(`  + Association créée: ${plant.name} → ${SONORA_TERROIR.name}`);
    }
  }
  
  console.log('\n=== TERMINÉ ===\n');
  
  await connection.end();
}

main().catch(console.error);
