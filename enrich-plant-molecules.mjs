import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const connection = await mysql.createConnection(process.env.DATABASE_URL);

// ============================================================================
// ÉTAPE 1 : Créer les molécules manquantes
// ============================================================================

const newMolecules = [
  // Rose - molécules manquantes
  {
    name: '2-Phényléthanol',
    iupacName: '2-phenylethanol',
    casNumber: '60-12-8',
    chemicalClass: 'alcohol',
    family: 'Alcool aromatique',
    chemicalFormula: 'C8H10O',
    olfactiveProfile: 'Rose, miel, floral doux, légèrement épicé',
    molecularWeight: 122,
    boilingPoint: 220,
    botanicalSources: 'Rose, Jasmin, Ylang-ylang, Géranium',
    therapeuticProperties: 'Antimicrobien, sédatif léger'
  },
  {
    name: 'Oxyde de rose',
    iupacName: '4-methyl-2-(2-methylprop-1-enyl)tetrahydropyran',
    casNumber: '16409-43-1',
    chemicalClass: 'ether',
    family: 'Éther cyclique',
    chemicalFormula: 'C10H18O',
    olfactiveProfile: 'Rose fraîche, verte, métallique, géranium',
    molecularWeight: 154,
    boilingPoint: 190,
    botanicalSources: 'Rose de Damas, Rose de Mai, Géranium rosat',
    therapeuticProperties: 'Caractère distinctif de la rose fraîche'
  },
  {
    name: 'Nerolidol',
    iupacName: '(E)-3,7,11-trimethyldodeca-1,6,10-trien-3-ol',
    casNumber: '7212-44-4',
    chemicalClass: 'sesquiterpene',
    family: 'Sesquiterpène alcool',
    chemicalFormula: 'C15H26O',
    olfactiveProfile: 'Boisé, floral, écorce fraîche, légèrement fruité',
    molecularWeight: 222,
    boilingPoint: 276,
    botanicalSources: 'Néroli, Jasmin, Gingembre, Cannabis',
    therapeuticProperties: 'Anti-inflammatoire, sédatif, antimicrobien'
  },
  {
    name: 'Citronellal',
    iupacName: '3,7-dimethyloct-6-enal',
    casNumber: '106-23-0',
    chemicalClass: 'aldehyde',
    family: 'Aldéhyde terpénique',
    chemicalFormula: 'C10H18O',
    olfactiveProfile: 'Citronné, frais, herbacé, légèrement floral',
    molecularWeight: 154,
    boilingPoint: 207,
    botanicalSources: 'Citronnelle, Eucalyptus citronné, Mélisse',
    therapeuticProperties: 'Répulsif insectes, anti-inflammatoire'
  },
  // Jasmin - molécules manquantes
  {
    name: 'cis-Jasmone',
    iupacName: '(Z)-3-methyl-2-(pent-2-en-1-yl)cyclopent-2-en-1-one',
    casNumber: '488-10-8',
    chemicalClass: 'ketone',
    family: 'Cétone cyclique',
    chemicalFormula: 'C11H16O',
    olfactiveProfile: 'Jasmin, floral herbacé, fruité, céleri',
    molecularWeight: 164,
    boilingPoint: 260,
    botanicalSources: 'Jasmin, Néroli, Bergamote',
    therapeuticProperties: 'Phéromone végétale, attractif pour pollinisateurs'
  },
  {
    name: 'Méthyl jasmonate',
    iupacName: 'methyl (1R,2R)-3-oxo-2-(pent-2-enyl)cyclopentane-1-carboxylate',
    casNumber: '1211-29-6',
    chemicalClass: 'ester',
    family: 'Ester jasmonique',
    chemicalFormula: 'C13H20O3',
    olfactiveProfile: 'Jasmin intense, fruité, légèrement herbacé',
    molecularWeight: 224,
    boilingPoint: 300,
    botanicalSources: 'Jasmin, nombreuses plantes (hormone végétale)',
    therapeuticProperties: 'Hormone de stress végétal, anticancéreux potentiel'
  },
  {
    name: 'Phytol',
    iupacName: '(2E,7R,11R)-3,7,11,15-tetramethylhexadec-2-en-1-ol',
    casNumber: '150-86-7',
    chemicalClass: 'diterpene',
    family: 'Diterpène alcool',
    chemicalFormula: 'C20H40O',
    olfactiveProfile: 'Vert, balsamique, floral doux, herbacé',
    molecularWeight: 296,
    boilingPoint: 202,
    botanicalSources: 'Jasmin, Thé vert, Chlorophylle (toutes plantes)',
    therapeuticProperties: 'Antioxydant, précurseur de vitamine E et K'
  },
  // Vétiver - molécules manquantes
  {
    name: 'α-Vétivène',
    iupacName: '(1S,7R,8aS)-1,8a-dimethyl-7-(prop-1-en-2-yl)-1,2,3,5,6,7,8,8a-octahydronaphthalene',
    casNumber: '5765-27-5',
    chemicalClass: 'sesquiterpene',
    family: 'Sesquiterpène',
    chemicalFormula: 'C15H24',
    olfactiveProfile: 'Boisé, terreux, fumé, caractère vétiver',
    molecularWeight: 204,
    boilingPoint: 262,
    botanicalSources: 'Vétiver (Vetiveria zizanioides)',
    therapeuticProperties: 'Ancrage, stabilisation des parfums'
  },
  {
    name: 'β-Vétivène',
    iupacName: 'beta-vetivene',
    casNumber: '18444-79-6',
    chemicalClass: 'sesquiterpene',
    family: 'Sesquiterpène',
    chemicalFormula: 'C15H24',
    olfactiveProfile: 'Boisé profond, terreux, légèrement fumé',
    molecularWeight: 204,
    boilingPoint: 265,
    botanicalSources: 'Vétiver (Vetiveria zizanioides)',
    therapeuticProperties: 'Note de fond, fixateur naturel'
  },
  {
    name: 'Isovalencénol',
    iupacName: 'isovalencenol',
    casNumber: '22451-73-6',
    chemicalClass: 'sesquiterpene',
    family: 'Sesquiterpène alcool',
    chemicalFormula: 'C15H24O',
    olfactiveProfile: 'Boisé, terreux, légèrement agrumé, vétiver',
    molecularWeight: 220,
    boilingPoint: 280,
    botanicalSources: 'Vétiver, Pamplemousse',
    therapeuticProperties: 'Fixateur, caractère distinctif du vétiver'
  },
  {
    name: 'Zizanol',
    iupacName: 'zizanol',
    casNumber: '41060-17-1',
    chemicalClass: 'sesquiterpene',
    family: 'Sesquiterpène alcool',
    chemicalFormula: 'C15H26O',
    olfactiveProfile: 'Boisé, terreux, humide, racine',
    molecularWeight: 222,
    boilingPoint: 285,
    botanicalSources: 'Vétiver (Vetiveria zizanioides)',
    therapeuticProperties: 'Note de fond caractéristique'
  },
  {
    name: 'Nootkatone',
    iupacName: '(4R,4aS,6R)-4,4a-dimethyl-6-(prop-1-en-2-yl)-4,4a,5,6,7,8-hexahydronaphthalen-2(3H)-one',
    casNumber: '4674-50-4',
    chemicalClass: 'sesquiterpene',
    family: 'Sesquiterpène cétone',
    chemicalFormula: 'C15H22O',
    olfactiveProfile: 'Pamplemousse, boisé, terreux, agrumé',
    molecularWeight: 218,
    boilingPoint: 270,
    botanicalSources: 'Vétiver, Pamplemousse, Cèdre d\'Alaska',
    therapeuticProperties: 'Répulsif insectes, anti-inflammatoire'
  }
];

console.log('=== CRÉATION DES MOLÉCULES MANQUANTES ===');

for (const mol of newMolecules) {
  try {
    // Vérifier si la molécule existe déjà
    const [existing] = await connection.execute(
      'SELECT id FROM molecules WHERE name = ?',
      [mol.name]
    );
    
    if (existing.length > 0) {
      console.log(`⏭️  ${mol.name} existe déjà (ID: ${existing[0].id})`);
      continue;
    }
    
    // Créer la molécule
    const [result] = await connection.execute(
      `INSERT INTO molecules (name, iupac_name, cas_number, chemical_class, family, chemicalFormula, olfactiveProfile, molecularWeight, boilingPoint, botanicalSources, therapeuticProperties)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [mol.name, mol.iupacName, mol.casNumber, mol.chemicalClass, mol.family, mol.chemicalFormula, mol.olfactiveProfile, mol.molecularWeight, mol.boilingPoint, mol.botanicalSources, mol.therapeuticProperties]
    );
    console.log(`✅ ${mol.name} créée (ID: ${result.insertId})`);
  } catch (error) {
    console.error(`❌ Erreur pour ${mol.name}:`, error.message);
  }
}

// ============================================================================
// ÉTAPE 2 : Récupérer les IDs des plantes et molécules
// ============================================================================

console.log('\n=== RÉCUPÉRATION DES IDs ===');

// Récupérer les plantes
const [plants] = await connection.execute('SELECT id, name FROM plants');
const plantMap = {};
plants.forEach(p => plantMap[p.name] = p.id);

// Récupérer les molécules
const [molecules] = await connection.execute('SELECT id, name FROM molecules');
const moleculeMap = {};
molecules.forEach(m => moleculeMap[m.name] = m.id);

// Fonction pour trouver une molécule par nom (avec recherche flexible)
function findMoleculeId(name) {
  // Recherche exacte
  if (moleculeMap[name]) return moleculeMap[name];
  
  // Recherche partielle
  const found = molecules.find(m => 
    m.name.toLowerCase().includes(name.toLowerCase()) ||
    name.toLowerCase().includes(m.name.toLowerCase())
  );
  return found ? found.id : null;
}

// ============================================================================
// ÉTAPE 3 : Enrichir les associations plantes-molécules
// ============================================================================

console.log('\n=== ENRICHISSEMENT DES ASSOCIATIONS ===');

const enrichments = [
  // ROSE DE DAMAS - enrichissement
  {
    plant: 'Rose de Damas',
    molecules: [
      { name: '2-Phényléthanol', percentageTypical: 2.5, role: 'secondaire', notes: 'Caractère miellé de la rose' },
      { name: 'Oxyde de rose', percentageTypical: 0.5, role: 'trace', notes: 'Note fraîche métallique caractéristique' },
      { name: 'Farnesol', percentageTypical: 1.5, role: 'secondaire', notes: 'Note florale douce' },
      { name: 'Linalool', percentageTypical: 3.0, role: 'secondaire', notes: 'Fraîcheur florale' },
      { name: 'β-Damascénone', percentageTypical: 0.01, role: 'trace', notes: 'Impact olfactif majeur malgré faible concentration' }
    ]
  },
  // JASMIN GRANDIFLORUM - enrichissement
  {
    plant: 'Jasmin grandiflorum',
    molecules: [
      { name: 'cis-Jasmone', percentageTypical: 3.0, role: 'secondaire', notes: 'Caractère jasmin herbacé' },
      { name: 'Méthyl jasmonate', percentageTypical: 0.5, role: 'trace', notes: 'Note jasmin intense' },
      { name: 'Phytol', percentageTypical: 5.0, role: 'secondaire', notes: 'Note verte balsamique' },
      { name: '2-Phényléthanol', percentageTypical: 2.0, role: 'secondaire', notes: 'Note miellée florale' },
      { name: 'Nerolidol', percentageTypical: 1.5, role: 'secondaire', notes: 'Note boisée florale' },
      { name: 'Farnesol', percentageTypical: 1.0, role: 'trace', notes: 'Note florale douce' }
    ]
  },
  // VÉTIVER - enrichissement
  {
    plant: 'Vétiver',
    molecules: [
      { name: 'α-Vétivène', percentageTypical: 8.0, role: 'majeur', notes: 'Caractère boisé terreux' },
      { name: 'β-Vétivène', percentageTypical: 6.0, role: 'majeur', notes: 'Profondeur boisée' },
      { name: 'Isovalencénol', percentageTypical: 5.0, role: 'secondaire', notes: 'Note agrumée boisée' },
      { name: 'Zizanol', percentageTypical: 3.0, role: 'secondaire', notes: 'Caractère racine humide' },
      { name: 'Nootkatone', percentageTypical: 2.0, role: 'secondaire', notes: 'Note pamplemousse boisée' }
    ]
  },
  // YLANG-YLANG - enrichissement
  {
    plant: 'Ylang-Ylang',
    molecules: [
      { name: '2-Phényléthanol', percentageTypical: 1.5, role: 'secondaire', notes: 'Note miellée' },
      { name: 'Farnesol', percentageTypical: 2.0, role: 'secondaire', notes: 'Note florale douce' },
      { name: 'Nerolidol', percentageTypical: 1.0, role: 'trace', notes: 'Note boisée' }
    ]
  },
  // GÉRANIUM ROSAT - enrichissement
  {
    plant: 'Géranium rosat',
    molecules: [
      { name: 'Citronellal', percentageTypical: 8.0, role: 'majeur', notes: 'Note citronnée fraîche' },
      { name: 'Nérol', percentageTypical: 2.0, role: 'secondaire', notes: 'Note florale douce' },
      { name: 'Farnesol', percentageTypical: 1.0, role: 'trace', notes: 'Note florale' }
    ]
  },
  // LAVANDE VRAIE - enrichissement
  {
    plant: 'Lavande vraie',
    molecules: [
      { name: 'Géraniol', percentageTypical: 1.5, role: 'secondaire', notes: 'Note florale rose' },
      { name: 'Nérol', percentageTypical: 0.5, role: 'trace', notes: 'Note florale douce' }
    ]
  },
  // PATCHOULI - enrichissement
  {
    plant: 'Patchouli',
    molecules: [
      { name: 'Nerolidol', percentageTypical: 1.0, role: 'trace', notes: 'Note boisée florale' }
    ]
  }
];

for (const enrichment of enrichments) {
  const plantId = plantMap[enrichment.plant];
  if (!plantId) {
    console.log(`⚠️  Plante non trouvée: ${enrichment.plant}`);
    continue;
  }
  
  console.log(`\n📌 ${enrichment.plant} (ID: ${plantId})`);
  
  for (const mol of enrichment.molecules) {
    const moleculeId = findMoleculeId(mol.name);
    if (!moleculeId) {
      console.log(`  ⚠️  Molécule non trouvée: ${mol.name}`);
      continue;
    }
    
    try {
      // Vérifier si l'association existe déjà
      const [existing] = await connection.execute(
        'SELECT plant_id FROM plant_molecules WHERE plant_id = ? AND molecule_id = ?',
        [plantId, moleculeId]
      );
      
      if (existing.length > 0) {
        console.log(`  ⏭️  ${mol.name} déjà associée`);
        continue;
      }
      
      // Créer l'association
      await connection.execute(
        `INSERT INTO plant_molecules (plant_id, molecule_id, percentage_typical, role, notes, source)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [plantId, moleculeId, mol.percentageTypical, mol.role, mol.notes, 'Enrichissement PERFUMUM 2026']
      );
      console.log(`  ✅ ${mol.name} (${mol.percentageTypical}%, ${mol.role})`);
    } catch (error) {
      console.error(`  ❌ Erreur pour ${mol.name}:`, error.message);
    }
  }
}

await connection.end();
console.log('\n=== ENRICHISSEMENT TERMINÉ ===');
