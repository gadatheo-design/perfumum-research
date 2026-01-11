import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const conn = await mysql.createConnection(process.env.DATABASE_URL);

console.log('=== Compléter les liaisons manquantes ===\n');

// Vérifier si les molécules existent déjà
const moleculesToAdd = [
  {
    name: 'Citronellol',
    iupacName: '3,7-Dimethyloct-6-en-1-ol',
    casNumber: '106-22-9',
    chemicalClass: 'monoterpene',
    family: 'Monoterpène alcool',
    chemicalFormula: 'C10H20O',
    olfactiveProfile: 'Rose, géranium, citronné, frais, doux',
    radarIntensity: 60,
    radarFreshness: 70,
    radarWarmth: 30,
    radarSweetness: 75,
    radarSpiciness: 10,
    radarEarthiness: 15,
  },
  {
    name: 'Nérol',
    iupacName: '(Z)-3,7-Dimethylocta-2,6-dien-1-ol',
    casNumber: '106-25-2',
    chemicalClass: 'monoterpene',
    family: 'Monoterpène alcool',
    chemicalFormula: 'C10H18O',
    olfactiveProfile: 'Rose douce, floral, légèrement citronné',
    radarIntensity: 55,
    radarFreshness: 60,
    radarWarmth: 25,
    radarSweetness: 80,
    radarSpiciness: 5,
    radarEarthiness: 10,
  },
  {
    name: 'Indole',
    iupacName: '1H-Indole',
    casNumber: '120-72-9',
    chemicalClass: 'heterocyclic',
    family: 'Hétérocycle azoté',
    chemicalFormula: 'C8H7N',
    olfactiveProfile: 'Floral intense, jasmin, animal, fécal à haute concentration',
    radarIntensity: 85,
    radarFreshness: 20,
    radarWarmth: 40,
    radarSweetness: 60,
    radarSpiciness: 15,
    radarEarthiness: 50,
  },
  {
    name: 'Coumarine',
    iupacName: '2H-Chromen-2-one',
    casNumber: '91-64-5',
    chemicalClass: 'coumarin',
    family: 'Coumarine',
    chemicalFormula: 'C9H6O2',
    olfactiveProfile: 'Foin coupé, vanille, amande, tabac, tonka',
    radarIntensity: 70,
    radarFreshness: 30,
    radarWarmth: 65,
    radarSweetness: 80,
    radarSpiciness: 20,
    radarEarthiness: 40,
  },
];

// Ajouter les molécules si elles n'existent pas
for (const mol of moleculesToAdd) {
  const [existing] = await conn.execute(
    'SELECT id FROM molecules WHERE name = ? OR cas_number = ?',
    [mol.name, mol.casNumber]
  );
  
  if (existing.length === 0) {
    await conn.execute(
      `INSERT INTO molecules 
       (name, iupac_name, cas_number, chemical_class, family, chemicalFormula, olfactiveProfile,
        radar_intensity, radar_freshness, radar_warmth, radar_sweetness, radar_spiciness, radar_earthiness,
        validation_status, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'valide', NOW(), NOW())`,
      [mol.name, mol.iupacName, mol.casNumber, mol.chemicalClass, mol.family, mol.chemicalFormula, 
       mol.olfactiveProfile, mol.radarIntensity, mol.radarFreshness, mol.radarWarmth, 
       mol.radarSweetness, mol.radarSpiciness, mol.radarEarthiness]
    );
    console.log(`✓ Molécule ajoutée: ${mol.name}`);
  } else {
    console.log(`○ Molécule existante: ${mol.name}`);
  }
}

// Récupérer les IDs des molécules
const [mols] = await conn.execute(
  `SELECT id, name FROM molecules WHERE name IN ('Citronellol', 'Nérol', 'Indole', 'Coumarine')`
);
console.log("\nMolécules trouvées:", mols.map(m => `${m.name} (${m.id})`).join(', '));

// Créer les liaisons manquantes
const linksToCreate = [
  { varietyId: 1, molName: 'Citronellol', type: 'dominant', percentage: 18, confidence: 'high' },
  { varietyId: 1, molName: 'Nérol', type: 'characteristic', percentage: 8, confidence: 'high' },
  { varietyId: 2, molName: 'Indole', type: 'characteristic', percentage: 2.5, confidence: 'high' },
  { varietyId: 3, molName: 'Coumarine', type: 'trace', percentage: 0.5, confidence: 'medium' },
];

console.log("\nCréation des liaisons:");
for (const link of linksToCreate) {
  const mol = mols.find(m => m.name === link.molName);
  if (mol) {
    // Vérifier si la liaison existe déjà
    const [existingLink] = await conn.execute(
      'SELECT id FROM ghost_variety_molecule_links WHERE ghost_variety_id = ? AND molecule_id = ?',
      [link.varietyId, mol.id]
    );
    
    if (existingLink.length === 0) {
      await conn.execute(
        `INSERT INTO ghost_variety_molecule_links 
         (ghost_variety_id, molecule_id, link_type, percentage, confidence, source_type, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, 'comparative', NOW(), NOW())`,
        [link.varietyId, mol.id, link.type, link.percentage, link.confidence]
      );
      console.log(`✓ Liaison créée: Variété ${link.varietyId} → ${link.molName}`);
    } else {
      console.log(`○ Liaison existante: Variété ${link.varietyId} → ${link.molName}`);
    }
  } else {
    console.log(`✗ Molécule non trouvée: ${link.molName}`);
  }
}

// Résumé final
const [totalMolLinks] = await conn.execute('SELECT COUNT(*) as count FROM ghost_variety_molecule_links');
const [totalPlantLinks] = await conn.execute('SELECT COUNT(*) as count FROM ghost_variety_plant_links');

console.log("\n=== Résumé final ===");
console.log(`Total liaisons moléculaires: ${totalMolLinks[0].count}`);
console.log(`Total liaisons plantes: ${totalPlantLinks[0].count}`);

await conn.end();
console.log('\n✅ Terminé!');
