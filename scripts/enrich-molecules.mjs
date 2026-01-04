import mysql from 'mysql2/promise';

// Données d'enrichissement pour les molécules principales
const enrichmentData = [
  // Terpènes
  { name: 'Linalol', casNumber: '78-70-6', iupacName: '3,7-dimethylocta-1,6-dien-3-ol', chemicalClass: 'monoterpene', molecularWeight: 154, boilingPoint: 196 },
  { name: 'Linalool', casNumber: '78-70-6', iupacName: '3,7-dimethylocta-1,6-dien-3-ol', chemicalClass: 'monoterpene', molecularWeight: 154, boilingPoint: 196 },
  { name: 'α-Pinène', casNumber: '80-56-8', iupacName: '(1S,5S)-2,6,6-trimethylbicyclo[3.1.1]hept-2-ene', chemicalClass: 'monoterpene', molecularWeight: 136, boilingPoint: 156 },
  { name: 'Alpha-Pinene', casNumber: '80-56-8', iupacName: '(1S,5S)-2,6,6-trimethylbicyclo[3.1.1]hept-2-ene', chemicalClass: 'monoterpene', molecularWeight: 136, boilingPoint: 156 },
  { name: 'β-Pinène', casNumber: '127-91-3', iupacName: '6,6-dimethyl-2-methylenebicyclo[3.1.1]heptane', chemicalClass: 'monoterpene', molecularWeight: 136, boilingPoint: 166 },
  { name: 'Beta-Pinene', casNumber: '127-91-3', iupacName: '6,6-dimethyl-2-methylenebicyclo[3.1.1]heptane', chemicalClass: 'monoterpene', molecularWeight: 136, boilingPoint: 166 },
  { name: 'Limonène', casNumber: '138-86-3', iupacName: '1-methyl-4-(1-methylethenyl)cyclohexene', chemicalClass: 'monoterpene', molecularWeight: 136, boilingPoint: 176 },
  { name: 'Limonene', casNumber: '138-86-3', iupacName: '1-methyl-4-(1-methylethenyl)cyclohexene', chemicalClass: 'monoterpene', molecularWeight: 136, boilingPoint: 176 },
  { name: 'Myrcène', casNumber: '123-35-3', iupacName: '7-methyl-3-methyleneocta-1,6-diene', chemicalClass: 'monoterpene', molecularWeight: 136, boilingPoint: 167 },
  { name: 'Myrcene', casNumber: '123-35-3', iupacName: '7-methyl-3-methyleneocta-1,6-diene', chemicalClass: 'monoterpene', molecularWeight: 136, boilingPoint: 167 },
  { name: 'β-Caryophyllène', casNumber: '87-44-5', iupacName: '(1R,4E,9S)-4,11,11-trimethyl-8-methylenebicyclo[7.2.0]undec-4-ene', chemicalClass: 'sesquiterpene', molecularWeight: 204, boilingPoint: 262 },
  { name: 'Caryophyllene', casNumber: '87-44-5', iupacName: '(1R,4E,9S)-4,11,11-trimethyl-8-methylenebicyclo[7.2.0]undec-4-ene', chemicalClass: 'sesquiterpene', molecularWeight: 204, boilingPoint: 262 },
  { name: 'Humulène', casNumber: '6753-98-6', iupacName: '(1E,4E,8E)-2,6,6,9-tetramethylcycloundeca-1,4,8-triene', chemicalClass: 'sesquiterpene', molecularWeight: 204, boilingPoint: 166 },
  { name: 'Humulene', casNumber: '6753-98-6', iupacName: '(1E,4E,8E)-2,6,6,9-tetramethylcycloundeca-1,4,8-triene', chemicalClass: 'sesquiterpene', molecularWeight: 204, boilingPoint: 166 },
  { name: 'Terpinolène', casNumber: '586-62-9', iupacName: '1-methyl-4-(1-methylethylidene)cyclohexene', chemicalClass: 'monoterpene', molecularWeight: 136, boilingPoint: 186 },
  { name: 'Terpinolene', casNumber: '586-62-9', iupacName: '1-methyl-4-(1-methylethylidene)cyclohexene', chemicalClass: 'monoterpene', molecularWeight: 136, boilingPoint: 186 },
  { name: 'Ocimène', casNumber: '13877-91-3', iupacName: '3,7-dimethylocta-1,3,6-triene', chemicalClass: 'monoterpene', molecularWeight: 136, boilingPoint: 177 },
  { name: 'Ocimene', casNumber: '13877-91-3', iupacName: '3,7-dimethylocta-1,3,6-triene', chemicalClass: 'monoterpene', molecularWeight: 136, boilingPoint: 177 },
  
  // Aldéhydes
  { name: 'Citral', casNumber: '5392-40-5', iupacName: '3,7-dimethylocta-2,6-dienal', chemicalClass: 'aldehyde', molecularWeight: 152, boilingPoint: 229 },
  { name: 'Citronellal', casNumber: '106-23-0', iupacName: '3,7-dimethyloct-6-enal', chemicalClass: 'aldehyde', molecularWeight: 154, boilingPoint: 207 },
  { name: 'Géranial', casNumber: '141-27-5', iupacName: '(E)-3,7-dimethylocta-2,6-dienal', chemicalClass: 'aldehyde', molecularWeight: 152, boilingPoint: 229 },
  { name: 'Geranial', casNumber: '141-27-5', iupacName: '(E)-3,7-dimethylocta-2,6-dienal', chemicalClass: 'aldehyde', molecularWeight: 152, boilingPoint: 229 },
  
  // Alcools
  { name: 'Géraniol', casNumber: '106-24-1', iupacName: '(E)-3,7-dimethylocta-2,6-dien-1-ol', chemicalClass: 'alcohol', molecularWeight: 154, boilingPoint: 230 },
  { name: 'Geraniol', casNumber: '106-24-1', iupacName: '(E)-3,7-dimethylocta-2,6-dien-1-ol', chemicalClass: 'alcohol', molecularWeight: 154, boilingPoint: 230 },
  { name: 'Nérol', casNumber: '106-25-2', iupacName: '(Z)-3,7-dimethylocta-2,6-dien-1-ol', chemicalClass: 'alcohol', molecularWeight: 154, boilingPoint: 225 },
  { name: 'Nerol', casNumber: '106-25-2', iupacName: '(Z)-3,7-dimethylocta-2,6-dien-1-ol', chemicalClass: 'alcohol', molecularWeight: 154, boilingPoint: 225 },
  { name: 'Citronellol', casNumber: '106-22-9', iupacName: '3,7-dimethyloct-6-en-1-ol', chemicalClass: 'alcohol', molecularWeight: 156, boilingPoint: 225 },
  { name: 'Menthol', casNumber: '89-78-1', iupacName: '(1R,2S,5R)-2-isopropyl-5-methylcyclohexanol', chemicalClass: 'alcohol', molecularWeight: 156, boilingPoint: 212 },
  { name: 'Eucalyptol', casNumber: '470-82-6', iupacName: '1,3,3-trimethyl-2-oxabicyclo[2.2.2]octane', chemicalClass: 'ether', molecularWeight: 154, boilingPoint: 176 },
  
  // Esters
  { name: 'Acétate de linalyle', casNumber: '115-95-7', iupacName: '3,7-dimethylocta-1,6-dien-3-yl acetate', chemicalClass: 'ester', molecularWeight: 196, boilingPoint: 220 },
  { name: 'Linalyl acetate', casNumber: '115-95-7', iupacName: '3,7-dimethylocta-1,6-dien-3-yl acetate', chemicalClass: 'ester', molecularWeight: 196, boilingPoint: 220 },
  { name: 'Acétate de géranyle', casNumber: '105-87-3', iupacName: '(E)-3,7-dimethylocta-2,6-dien-1-yl acetate', chemicalClass: 'ester', molecularWeight: 196, boilingPoint: 245 },
  { name: 'Geranyl acetate', casNumber: '105-87-3', iupacName: '(E)-3,7-dimethylocta-2,6-dien-1-yl acetate', chemicalClass: 'ester', molecularWeight: 196, boilingPoint: 245 },
  
  // Phénols
  { name: 'Eugénol', casNumber: '97-53-0', iupacName: '4-allyl-2-methoxyphenol', chemicalClass: 'phenol', molecularWeight: 164, boilingPoint: 254 },
  { name: 'Eugenol', casNumber: '97-53-0', iupacName: '4-allyl-2-methoxyphenol', chemicalClass: 'phenol', molecularWeight: 164, boilingPoint: 254 },
  { name: 'Thymol', casNumber: '89-83-8', iupacName: '2-isopropyl-5-methylphenol', chemicalClass: 'phenol', molecularWeight: 150, boilingPoint: 233 },
  { name: 'Carvacrol', casNumber: '499-75-2', iupacName: '5-isopropyl-2-methylphenol', chemicalClass: 'phenol', molecularWeight: 150, boilingPoint: 238 },
  
  // Cétones
  { name: 'Carvone', casNumber: '99-49-0', iupacName: '2-methyl-5-(1-methylethenyl)cyclohex-2-en-1-one', chemicalClass: 'ketone', molecularWeight: 150, boilingPoint: 231 },
  { name: 'Menthone', casNumber: '89-80-5', iupacName: '(2S,5R)-2-isopropyl-5-methylcyclohexanone', chemicalClass: 'ketone', molecularWeight: 154, boilingPoint: 207 },
  
  // Molécules spéciales
  { name: 'Géosmine', casNumber: '19700-21-1', iupacName: '(4S,4aS,8aR)-4,8a-dimethyl-1,2,3,4,5,6,7,8-octahydronaphthalen-4a-ol', chemicalClass: 'alcohol', molecularWeight: 182, boilingPoint: 270 },
  { name: 'Geosmin', casNumber: '19700-21-1', iupacName: '(4S,4aS,8aR)-4,8a-dimethyl-1,2,3,4,5,6,7,8-octahydronaphthalen-4a-ol', chemicalClass: 'alcohol', molecularWeight: 182, boilingPoint: 270 },
  { name: 'Ambroxan', casNumber: '6790-58-5', iupacName: '(3aR,5aS,9aS,9bR)-3a,6,6,9a-tetramethyldodecahydronaphtho[2,1-b]furan', chemicalClass: 'ether', molecularWeight: 236, boilingPoint: 310 },
  { name: 'Iso E Super', casNumber: '54464-57-2', iupacName: '1-(2,3,8,8-tetramethyl-1,2,3,4,5,6,7,8-octahydronaphthalen-2-yl)ethanone', chemicalClass: 'ketone', molecularWeight: 234, boilingPoint: 290 },
  { name: 'Hedione', casNumber: '24851-98-7', iupacName: 'methyl 3-oxo-2-pentylcyclopentaneacetate', chemicalClass: 'ester', molecularWeight: 226, boilingPoint: 280 },
  { name: 'Galaxolide', casNumber: '1222-05-5', iupacName: '1,3,4,6,7,8-hexahydro-4,6,6,7,8,8-hexamethylcyclopenta[g]-2-benzopyran', chemicalClass: 'musk', molecularWeight: 258, boilingPoint: 327 },
];

async function enrichMolecules() {
  const connection = await mysql.createConnection(process.env.DATABASE_URL);
  
  let updated = 0;
  let notFound = 0;
  
  for (const data of enrichmentData) {
    try {
      const [result] = await connection.execute(
        `UPDATE molecules 
         SET cas_number = COALESCE(cas_number, ?),
             iupac_name = COALESCE(iupac_name, ?),
             chemical_class = COALESCE(chemical_class, ?),
             molecularWeight = COALESCE(molecularWeight, ?),
             boilingPoint = COALESCE(boilingPoint, ?)
         WHERE LOWER(name) = LOWER(?) AND (cas_number IS NULL OR iupac_name IS NULL)`,
        [data.casNumber, data.iupacName, data.chemicalClass, data.molecularWeight, data.boilingPoint, data.name]
      );
      
      if (result.affectedRows > 0) {
        console.log(`✓ Enrichi: ${data.name} (CAS: ${data.casNumber})`);
        updated++;
      }
    } catch (err) {
      console.error(`✗ Erreur pour ${data.name}:`, err.message);
    }
  }
  
  console.log(`\n=== Résumé ===`);
  console.log(`Molécules enrichies: ${updated}`);
  
  await connection.end();
}

enrichMolecules().catch(console.error);
