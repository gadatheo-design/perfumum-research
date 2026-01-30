/**
 * Script pour créer les plantes et molécules manquantes
 * et établir leurs liaisons
 */

import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;

// Les 11 plantes manquantes avec leurs données complètes
const MISSING_PLANTS = [
  {
    name: "Réglisse",
    latin_name: "Glycyrrhiza glabra",
    family: "Fabaceae",
    description: "Plante vivace dont la racine est utilisée pour son goût sucré caractéristique et ses propriétés médicinales.",
    origin: "Méditerranée, Asie",
    parts_used: "Racine",
    koppen_zones: "Csa"
  },
  {
    name: "Genêt",
    latin_name: "Spartium junceum",
    family: "Fabaceae",
    description: "Arbuste méditerranéen aux fleurs jaunes très parfumées, utilisé en parfumerie pour son absolue.",
    origin: "Méditerranée",
    parts_used: "Fleurs",
    koppen_zones: "Csa"
  },
  {
    name: "Cassie",
    latin_name: "Acacia farnesiana",
    family: "Fabaceae",
    description: "Arbuste épineux aux fleurs jaunes très odorantes, produisant une absolue précieuse en parfumerie.",
    origin: "Amérique tropicale",
    parts_used: "Fleurs",
    koppen_zones: "Aw"
  },
  {
    name: "Niaouli",
    latin_name: "Melaleuca quinquenervia",
    family: "Myrtaceae",
    description: "Arbre de la famille du tea tree, dont l'huile essentielle est riche en 1,8-cinéole.",
    origin: "Nouvelle-Calédonie, Australie",
    parts_used: "Feuilles",
    koppen_zones: "Af"
  },
  {
    name: "Myrte",
    latin_name: "Myrtus communis",
    family: "Myrtaceae",
    description: "Arbuste méditerranéen aromatique aux feuilles persistantes et aux baies bleu-noir.",
    origin: "Méditerranée",
    parts_used: "Feuilles, rameaux",
    koppen_zones: "Csa"
  },
  {
    name: "Curcuma",
    latin_name: "Curcuma longa",
    family: "Zingiberaceae",
    description: "Plante herbacée dont le rhizome est utilisé comme épice et colorant, avec des notes terreuses et épicées.",
    origin: "Asie du Sud-Est",
    parts_used: "Rhizome",
    koppen_zones: "Am"
  },
  {
    name: "Sapin baumier",
    latin_name: "Abies balsamea",
    family: "Pinaceae",
    description: "Conifère nord-américain produisant une résine balsamique très parfumée.",
    origin: "Amérique du Nord",
    parts_used: "Résine, aiguilles",
    koppen_zones: "Dfb"
  },
  {
    name: "Camphrier",
    latin_name: "Cinnamomum camphora",
    family: "Lauraceae",
    description: "Grand arbre dont le bois et les feuilles produisent le camphre naturel.",
    origin: "Asie de l'Est",
    parts_used: "Bois, feuilles",
    koppen_zones: "Cfa"
  },
  {
    name: "Laurier noble",
    latin_name: "Laurus nobilis",
    family: "Lauraceae",
    description: "Arbre méditerranéen dont les feuilles aromatiques sont utilisées en cuisine et en parfumerie.",
    origin: "Méditerranée",
    parts_used: "Feuilles",
    koppen_zones: "Csa"
  },
  {
    name: "Angélique",
    latin_name: "Angelica archangelica",
    family: "Apiaceae",
    description: "Grande plante herbacée aux notes musquées et terreuses, utilisée en parfumerie et liquoristerie.",
    origin: "Europe du Nord",
    parts_used: "Racines, graines",
    koppen_zones: "Cfb"
  },
  {
    name: "Anis vert",
    latin_name: "Pimpinella anisum",
    family: "Apiaceae",
    description: "Plante herbacée dont les graines ont une saveur anisée caractéristique.",
    origin: "Méditerranée orientale",
    parts_used: "Graines",
    koppen_zones: "Csa"
  }
];

// Les 8 molécules manquantes avec leurs données complètes
const MISSING_MOLECULES = [
  {
    name: "1,8-Cinéole",
    cas_number: "470-82-6",
    iupac_name: "1,3,3-trimethyl-2-oxabicyclo[2.2.2]octane",
    chemical_class: "Oxydes terpéniques",
    molecular_formula: "C10H18O",
    molecular_weight: 154.25,
    description: "Oxyde monoterpénique à l'odeur fraîche, camphrée et eucalyptée. Principal composant de l'huile d'eucalyptus.",
    odor_profile: "Frais, camphré, eucalypté, mentholé",
    volatility: "Tête",
    therapeutic_properties: "Expectorant, antiseptique respiratoire, anti-inflammatoire"
  },
  {
    name: "Terpinène-4-ol",
    cas_number: "562-74-3",
    iupac_name: "4-methyl-1-propan-2-ylcyclohex-3-en-1-ol",
    chemical_class: "Alcools monoterpéniques",
    molecular_formula: "C10H18O",
    molecular_weight: 154.25,
    description: "Alcool monoterpénique aux propriétés antiseptiques puissantes, composant majeur du tea tree.",
    odor_profile: "Herbacé, épicé, légèrement terreux",
    volatility: "Cœur",
    therapeutic_properties: "Antibactérien, antifongique, anti-inflammatoire"
  },
  {
    name: "Cuminaldéhyde",
    cas_number: "122-03-2",
    iupac_name: "4-propan-2-ylbenzaldehyde",
    chemical_class: "Aldéhydes aromatiques",
    molecular_formula: "C10H12O",
    molecular_weight: 148.20,
    description: "Aldéhyde aromatique responsable de l'odeur caractéristique du cumin.",
    odor_profile: "Épicé, cumin, chaud, légèrement vert",
    volatility: "Cœur",
    therapeutic_properties: "Digestif, carminatif"
  },
  {
    name: "Anisaldéhyde",
    cas_number: "123-11-5",
    iupac_name: "4-methoxybenzaldehyde",
    chemical_class: "Aldéhydes aromatiques",
    molecular_formula: "C8H8O2",
    molecular_weight: 136.15,
    description: "Aldéhyde aromatique à l'odeur d'aubépine et d'amande amère.",
    odor_profile: "Floral, aubépine, amande, anisé",
    volatility: "Cœur",
    therapeutic_properties: "Antioxydant"
  },
  {
    name: "Néral",
    cas_number: "106-26-3",
    iupac_name: "(2Z)-3,7-dimethylocta-2,6-dienal",
    chemical_class: "Aldéhydes monoterpéniques",
    molecular_formula: "C10H16O",
    molecular_weight: 152.23,
    description: "Isomère Z du citral, contribuant à l'odeur citronnée avec des nuances plus douces que le géranial.",
    odor_profile: "Citronné, frais, doux, légèrement floral",
    volatility: "Tête",
    therapeutic_properties: "Antimicrobien, calmant"
  },
  {
    name: "Farnésol",
    cas_number: "4602-84-0",
    iupac_name: "(2E,6E)-3,7,11-trimethyldodeca-2,6,10-trien-1-ol",
    chemical_class: "Alcools sesquiterpéniques",
    molecular_formula: "C15H26O",
    molecular_weight: 222.37,
    description: "Alcool sesquiterpénique aux notes florales délicates, présent dans de nombreuses fleurs.",
    odor_profile: "Floral, muguet, tilleul, légèrement boisé",
    volatility: "Fond",
    therapeutic_properties: "Antibactérien, régulateur hormonal"
  },
  {
    name: "Acétate de géranyle",
    cas_number: "105-87-3",
    iupac_name: "(2E)-3,7-dimethylocta-2,6-dien-1-yl acetate",
    chemical_class: "Esters terpéniques",
    molecular_formula: "C12H20O2",
    molecular_weight: 196.29,
    description: "Ester aux notes fruitées et florales, présent dans les huiles de palmarosa et géranium.",
    odor_profile: "Floral, fruité, rose, légèrement citronné",
    volatility: "Cœur",
    therapeutic_properties: "Relaxant, harmonisant"
  },
  {
    name: "Acétate de benzyle",
    cas_number: "140-11-4",
    iupac_name: "benzyl acetate",
    chemical_class: "Esters aromatiques",
    molecular_formula: "C9H10O2",
    molecular_weight: 150.17,
    description: "Ester aux notes florales et fruitées, rappelant le jasmin et la poire.",
    odor_profile: "Floral, jasmin, fruité, poire",
    volatility: "Cœur",
    therapeutic_properties: "Relaxant"
  }
];

// Liaisons molécule-plante à créer
const MOLECULE_PLANT_LINKS = [
  // 1,8-Cinéole
  { molecule: "1,8-Cinéole", plant: "Niaouli", percentage: 55, isMain: true },
  { molecule: "1,8-Cinéole", plant: "Myrte", percentage: 25, isMain: true },
  { molecule: "1,8-Cinéole", plant: "Laurier noble", percentage: 45, isMain: true },
  { molecule: "1,8-Cinéole", plant: "Camphrier", percentage: 50, isMain: true },
  
  // Terpinène-4-ol
  { molecule: "Terpinène-4-ol", plant: "Niaouli", percentage: 8, isMain: false },
  { molecule: "Terpinène-4-ol", plant: "Myrte", percentage: 5, isMain: false },
  
  // Cuminaldéhyde
  { molecule: "Cuminaldéhyde", plant: "Cumin", percentage: 35, isMain: true },
  
  // Anisaldéhyde
  { molecule: "Anisaldéhyde", plant: "Anis vert", percentage: 3, isMain: false },
  
  // Néral
  { molecule: "Néral", plant: "Angélique", percentage: 5, isMain: false },
  
  // Farnésol
  { molecule: "Farnésol", plant: "Cassie", percentage: 8, isMain: false },
  { molecule: "Farnésol", plant: "Genêt", percentage: 5, isMain: false },
  
  // Acétate de géranyle
  { molecule: "Acétate de géranyle", plant: "Angélique", percentage: 3, isMain: false },
  
  // Acétate de benzyle
  { molecule: "Acétate de benzyle", plant: "Cassie", percentage: 15, isMain: true },
  { molecule: "Acétate de benzyle", plant: "Genêt", percentage: 10, isMain: false },
  
  // Autres liaisons pour les nouvelles plantes
  { molecule: "α-Pinène", plant: "Sapin baumier", percentage: 25, isMain: true },
  { molecule: "β-Pinène", plant: "Sapin baumier", percentage: 30, isMain: true },
  { molecule: "Limonène", plant: "Sapin baumier", percentage: 8, isMain: false },
  { molecule: "Camphre", plant: "Camphrier", percentage: 40, isMain: true },
  { molecule: "Linalol", plant: "Laurier noble", percentage: 10, isMain: false },
  { molecule: "Eugénol", plant: "Laurier noble", percentage: 3, isMain: false },
  { molecule: "Anéthole", plant: "Anis vert", percentage: 90, isMain: true },
  { molecule: "Estragole", plant: "Angélique", percentage: 5, isMain: false }
];

async function main() {
  const connection = await mysql.createConnection(DATABASE_URL);
  
  console.log('\n=== CRÉATION DES ENTITÉS MANQUANTES ===\n');
  
  // 1. Créer les plantes manquantes
  console.log('--- CRÉATION DES PLANTES ---\n');
  let plantsCreated = 0;
  
  for (const plant of MISSING_PLANTS) {
    // Vérifier si la plante existe déjà
    const [existing] = await connection.query(
      'SELECT id FROM plants WHERE latin_name = ? OR name = ?',
      [plant.latin_name, plant.name]
    );
    
    if (existing.length > 0) {
      console.log('- ' + plant.name + ' existe déjà (ID: ' + existing[0].id + ')');
      continue;
    }
    
    // Créer la plante
    const [result] = await connection.query(
      'INSERT INTO plants (name, latin_name, family, category, origin, habitat, koppen_zone, olfactive_signature, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())',
      [plant.name, plant.latin_name, plant.family, 'aromatique', plant.origin, plant.parts_used, plant.koppen_zones, plant.description]
    );
    
    console.log('✓ ' + plant.name + ' créée (ID: ' + result.insertId + ')');
    plantsCreated++;
  }
  
  // 2. Créer les molécules manquantes
  console.log('\n--- CRÉATION DES MOLÉCULES ---\n');
  let moleculesCreated = 0;
  
  for (const mol of MISSING_MOLECULES) {
    // Vérifier si la molécule existe déjà
    const [existing] = await connection.query(
      'SELECT id FROM molecules WHERE cas_number = ? OR name = ?',
      [mol.cas_number, mol.name]
    );
    
    if (existing.length > 0) {
      console.log('- ' + mol.name + ' existe déjà (ID: ' + existing[0].id + ')');
      continue;
    }
    
    // Créer la molécule
    const [result] = await connection.query(
      'INSERT INTO molecules (name, cas_number, iupac_name, family, chemicalFormula, olfactiveProfile, emotionalResonance) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [mol.name, mol.cas_number, mol.iupac_name, mol.chemical_class, mol.molecular_formula, mol.odor_profile, mol.therapeutic_properties]
    );
    
    console.log('✓ ' + mol.name + ' créée (ID: ' + result.insertId + ')');
    moleculesCreated++;
  }
  
  // 3. Créer les liaisons molécule-plante
  console.log('\n--- CRÉATION DES LIAISONS ---\n');
  let linksCreated = 0;
  
  for (const link of MOLECULE_PLANT_LINKS) {
    // Trouver la molécule
    const [molecules] = await connection.query(
      'SELECT id FROM molecules WHERE name LIKE ?',
      ['%' + link.molecule + '%']
    );
    
    if (molecules.length === 0) {
      console.log('⚠️ Molécule non trouvée: ' + link.molecule);
      continue;
    }
    
    // Trouver la plante
    const [plants] = await connection.query(
      'SELECT id FROM plants WHERE name LIKE ?',
      ['%' + link.plant + '%']
    );
    
    if (plants.length === 0) {
      console.log('⚠️ Plante non trouvée: ' + link.plant);
      continue;
    }
    
    const moleculeId = molecules[0].id;
    const plantId = plants[0].id;
    
    // Vérifier si la liaison existe
    const [existingLink] = await connection.query(
      'SELECT id FROM molecule_plant_sources WHERE molecule_id = ? AND plant_id = ?',
      [moleculeId, plantId]
    );
    
    if (existingLink.length > 0) {
      console.log('- Liaison existante: ' + link.molecule + ' ↔ ' + link.plant);
      continue;
    }
    
    // Créer la liaison
    await connection.query(
      'INSERT INTO molecule_plant_sources (molecule_id, plant_id, percentage_in_oil, is_main_source, notes, created_at) VALUES (?, ?, ?, ?, ?, NOW())',
      [moleculeId, plantId, link.percentage, link.isMain ? 1 : 0, 'Enrichissement scientifique 2026-01-30']
    );
    
    console.log('✓ ' + link.molecule + ' ↔ ' + link.plant + ' (' + link.percentage + '%)');
    linksCreated++;
  }
  
  console.log('\n=== RÉSUMÉ ===');
  console.log('Plantes créées: ' + plantsCreated);
  console.log('Molécules créées: ' + moleculesCreated);
  console.log('Liaisons créées: ' + linksCreated);
  
  await connection.end();
}

main().catch(console.error);
