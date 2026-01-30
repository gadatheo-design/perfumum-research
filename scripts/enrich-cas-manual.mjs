/**
 * Script d'enrichissement manuel des CAS Numbers
 * Données compilées à partir de PubChem, ChemSpider, et Sigma-Aldrich
 */

import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;

// CAS Numbers recherchés manuellement pour les molécules non trouvées sur PubChem
const CAS_DATA = {
  // Molécules communes en parfumerie
  "1,8-Cinéole": { cas: "470-82-6", iupac: "1,3,3-trimethyl-2-oxabicyclo[2.2.2]octane" },
  "Eucalyptol": { cas: "470-82-6", iupac: "1,3,3-trimethyl-2-oxabicyclo[2.2.2]octane" },
  "Terpinène-4-ol": { cas: "562-74-3", iupac: "4-methyl-1-propan-2-ylcyclohex-3-en-1-ol" },
  "Cuminaldéhyde": { cas: "122-03-2", iupac: "4-propan-2-ylbenzaldehyde" },
  "Anisaldéhyde": { cas: "123-11-5", iupac: "4-methoxybenzaldehyde" },
  
  // Terpènes
  "α-Pinène": { cas: "80-56-8", iupac: "(1S,5S)-2,6,6-trimethylbicyclo[3.1.1]hept-2-ene" },
  "β-Pinène": { cas: "127-91-3", iupac: "(1S,5S)-6,6-dimethyl-2-methylidenebicyclo[3.1.1]heptane" },
  "Limonène": { cas: "138-86-3", iupac: "1-methyl-4-prop-1-en-2-ylcyclohexene" },
  "Myrcène": { cas: "123-35-3", iupac: "7-methyl-3-methylideneocta-1,6-diene" },
  "Linalol": { cas: "78-70-6", iupac: "3,7-dimethylocta-1,6-dien-3-ol" },
  "Géraniol": { cas: "106-24-1", iupac: "(2E)-3,7-dimethylocta-2,6-dien-1-ol" },
  "Nérol": { cas: "106-25-2", iupac: "(2Z)-3,7-dimethylocta-2,6-dien-1-ol" },
  "Citronellol": { cas: "106-22-9", iupac: "3,7-dimethyloct-6-en-1-ol" },
  "Citral": { cas: "5392-40-5", iupac: "3,7-dimethylocta-2,6-dienal" },
  "Géranial": { cas: "141-27-5", iupac: "(2E)-3,7-dimethylocta-2,6-dienal" },
  "Néral": { cas: "106-26-3", iupac: "(2Z)-3,7-dimethylocta-2,6-dienal" },
  
  // Sesquiterpènes
  "β-Caryophyllène": { cas: "87-44-5", iupac: "(1R,4E,9S)-4,11,11-trimethyl-8-methylidenebicyclo[7.2.0]undec-4-ene" },
  "α-Humulène": { cas: "6753-98-6", iupac: "(1E,4E,8E)-2,6,6,9-tetramethylcycloundeca-1,4,8-triene" },
  "Farnésol": { cas: "4602-84-0", iupac: "(2E,6E)-3,7,11-trimethyldodeca-2,6,10-trien-1-ol" },
  "Nerolidol": { cas: "7212-44-4", iupac: "3,7,11-trimethyldodeca-1,6,10-trien-3-ol" },
  
  // Phénols et dérivés
  "Eugénol": { cas: "97-53-0", iupac: "4-allyl-2-methoxyphenol" },
  "Thymol": { cas: "89-83-8", iupac: "2-propan-2-yl-5-methylphenol" },
  "Carvacrol": { cas: "499-75-2", iupac: "5-propan-2-yl-2-methylphenol" },
  "Vanilline": { cas: "121-33-5", iupac: "4-hydroxy-3-methoxybenzaldehyde" },
  "Coumarine": { cas: "91-64-5", iupac: "chromen-2-one" },
  
  // Aldéhydes
  "Cinnamaldéhyde": { cas: "104-55-2", iupac: "(2E)-3-phenylprop-2-enal" },
  "Benzaldéhyde": { cas: "100-52-7", iupac: "benzaldehyde" },
  
  // Cétones
  "Camphre": { cas: "76-22-2", iupac: "1,7,7-trimethylbicyclo[2.2.1]heptan-2-one" },
  "Menthone": { cas: "89-80-5", iupac: "(2S,5R)-2-propan-2-yl-5-methylcyclohexan-1-one" },
  "Menthol": { cas: "89-78-1", iupac: "(1R,2S,5R)-2-propan-2-yl-5-methylcyclohexan-1-ol" },
  
  // Esters
  "Acétate de Linalyle": { cas: "115-95-7", iupac: "3,7-dimethylocta-1,6-dien-3-yl acetate" },
  "Acétate de géranyle": { cas: "105-87-3", iupac: "(2E)-3,7-dimethylocta-2,6-dien-1-yl acetate" },
  "Benzyl acétate": { cas: "140-11-4", iupac: "benzyl acetate" },
  
  // Autres composés aromatiques
  "Anéthole": { cas: "104-46-1", iupac: "1-methoxy-4-[(E)-prop-1-enyl]benzene" },
  "Estragole": { cas: "140-67-0", iupac: "1-allyl-4-methoxybenzene" },
  "Indole": { cas: "120-72-9", iupac: "1H-indole" },
  "Jasmone": { cas: "488-10-8", iupac: "(Z)-3-methyl-2-(pent-2-en-1-yl)cyclopent-2-en-1-one" },
  "p-Cymène": { cas: "99-87-6", iupac: "1-methyl-4-propan-2-ylbenzene" },
  "γ-Terpinène": { cas: "99-85-4", iupac: "1-methyl-4-propan-2-ylcyclohexa-1,4-diene" },
  "α-Terpinéol": { cas: "98-55-5", iupac: "2-(4-methylcyclohex-3-en-1-yl)propan-2-ol" },
  "Sabinène": { cas: "3387-41-5", iupac: "4-methylene-1-propan-2-ylbicyclo[3.1.0]hexane" },
  "Camphène": { cas: "79-92-5", iupac: "2,2-dimethyl-3-methylidenebicyclo[2.2.1]heptane" },
  "Bornéol": { cas: "507-70-0", iupac: "(1R,2S,4R)-1,7,7-trimethylbicyclo[2.2.1]heptan-2-ol" },
  
  // Molécules spécifiques parfumerie
  "Zingibérène": { cas: "495-60-3", iupac: "(5R)-2-methyl-5-[(2S)-6-methylhept-5-en-2-yl]cyclohexa-1,3-diene" },
  "Patchoulol": { cas: "5986-55-0", iupac: "patchouli alcohol" },
  "Vétivénol": { cas: "89-88-3", iupac: "vetiverol" },
  "α-Santalol": { cas: "115-71-9", iupac: "alpha-santalol" },
  "β-Santalol": { cas: "77-42-9", iupac: "beta-santalol" }
};

async function main() {
  const connection = await mysql.createConnection(DATABASE_URL);
  
  console.log('\n=== ENRICHISSEMENT MANUEL DES CAS NUMBERS ===\n');
  
  let totalUpdated = 0;
  let notFound = [];
  
  for (const [molName, data] of Object.entries(CAS_DATA)) {
    // Chercher la molécule dans la base
    const [molecules] = await connection.query(
      'SELECT id, name, cas_number, iupac_name FROM molecules WHERE name LIKE ? LIMIT 1',
      ['%' + molName + '%']
    );
    
    if (molecules.length === 0) {
      notFound.push(molName);
      continue;
    }
    
    const mol = molecules[0];
    
    // Mettre à jour si CAS manquant
    if (!mol.cas_number || mol.cas_number === '') {
      await connection.query(
        'UPDATE molecules SET cas_number = ?, iupac_name = COALESCE(iupac_name, ?) WHERE id = ?',
        [data.cas, data.iupac, mol.id]
      );
      console.log('✓ ' + mol.name + ': CAS ' + data.cas);
      totalUpdated++;
    } else {
      console.log('- ' + mol.name + ': déjà renseigné (' + mol.cas_number + ')');
    }
  }
  
  console.log('\n=== RÉSUMÉ ===');
  console.log('CAS Numbers ajoutés: ' + totalUpdated);
  console.log('Molécules non trouvées: ' + notFound.length);
  
  if (notFound.length > 0) {
    console.log('\nMolécules non trouvées:');
    notFound.forEach(m => console.log('  - ' + m));
  }
  
  await connection.end();
}

main().catch(console.error);
