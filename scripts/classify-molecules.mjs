/**
 * Script de classification automatique des molécules par classe chimique
 * 
 * Utilise les noms, formules et familles existantes pour déterminer la classe chimique
 */

import mysql from 'mysql2/promise';

// Règles de classification basées sur les noms et formules
const CLASSIFICATION_RULES = [
  // Terpènes et dérivés
  { pattern: /pinene|pinène/i, class: 'monoterpene' },
  { pattern: /limonene|limonène/i, class: 'monoterpene' },
  { pattern: /myrcene|myrcène/i, class: 'monoterpene' },
  { pattern: /terpinene|terpinène/i, class: 'monoterpene' },
  { pattern: /camphene|camphène/i, class: 'monoterpene' },
  { pattern: /carene|carène/i, class: 'monoterpene' },
  { pattern: /ocimene|ocimène/i, class: 'monoterpene' },
  { pattern: /phellandrene|phellandrène/i, class: 'monoterpene' },
  { pattern: /sabinene|sabinène/i, class: 'monoterpene' },
  { pattern: /thujene|thujène/i, class: 'monoterpene' },
  { pattern: /cymene|cymène/i, class: 'monoterpene' },
  
  // Sesquiterpènes
  { pattern: /caryophyllene|caryophyllène/i, class: 'sesquiterpene' },
  { pattern: /humulene|humulène/i, class: 'sesquiterpene' },
  { pattern: /farnesene|farnésène/i, class: 'sesquiterpene' },
  { pattern: /bisabolene|bisabolène/i, class: 'sesquiterpene' },
  { pattern: /cadinene|cadinène/i, class: 'sesquiterpene' },
  { pattern: /selinene|sélinène/i, class: 'sesquiterpene' },
  { pattern: /cedrene|cédrène/i, class: 'sesquiterpene' },
  { pattern: /santalene|santalène/i, class: 'sesquiterpene' },
  { pattern: /vetivene|vétivène/i, class: 'sesquiterpene' },
  { pattern: /guaiene|guaiène/i, class: 'sesquiterpene' },
  { pattern: /elemene|élémène/i, class: 'sesquiterpene' },
  { pattern: /copaene|copaène/i, class: 'sesquiterpene' },
  { pattern: /cubebene|cubébène/i, class: 'sesquiterpene' },
  { pattern: /valencene|valencène/i, class: 'sesquiterpene' },
  { pattern: /zingiberene|zingibérène/i, class: 'sesquiterpene' },
  { pattern: /bergamotene|bergamotène/i, class: 'sesquiterpene' },
  { pattern: /nootkatone/i, class: 'sesquiterpene' },
  
  // Aldéhydes
  { pattern: /aldehyde|aldéhyde/i, class: 'aldehyde' },
  { pattern: /citral/i, class: 'aldehyde' },
  { pattern: /citronellal/i, class: 'aldehyde' },
  { pattern: /geranial|géranial/i, class: 'aldehyde' },
  { pattern: /neral|néral/i, class: 'aldehyde' },
  { pattern: /benzaldehyde|benzaldéhyde/i, class: 'aldehyde' },
  { pattern: /cinnamaldehyde|cinnamaldéhyde/i, class: 'aldehyde' },
  { pattern: /anisaldehyde|anisaldéhyde/i, class: 'aldehyde' },
  { pattern: /vanillin|vanilline/i, class: 'aldehyde' },
  { pattern: /cuminaldehyde/i, class: 'aldehyde' },
  { pattern: /hexanal/i, class: 'aldehyde' },
  { pattern: /octanal/i, class: 'aldehyde' },
  { pattern: /decanal|décanal/i, class: 'aldehyde' },
  { pattern: /undecanal|undécanal/i, class: 'aldehyde' },
  
  // Cétones
  { pattern: /ketone|cétone/i, class: 'ketone' },
  { pattern: /carvone/i, class: 'ketone' },
  { pattern: /camphor|camphre/i, class: 'ketone' },
  { pattern: /ionone/i, class: 'ketone' },
  { pattern: /vetivone|vétivone/i, class: 'ketone' },
  { pattern: /damascone/i, class: 'ketone' },
  { pattern: /damascenone|damascénone/i, class: 'ketone' },
  { pattern: /menthone/i, class: 'ketone' },
  { pattern: /pulegone|pulégone/i, class: 'ketone' },
  { pattern: /fenchone/i, class: 'ketone' },
  { pattern: /thujone/i, class: 'ketone' },
  { pattern: /jasmone/i, class: 'ketone' },
  { pattern: /muscone/i, class: 'ketone' },
  
  // Alcools
  { pattern: /linalool|linalol/i, class: 'alcohol' },
  { pattern: /geraniol|géraniol/i, class: 'alcohol' },
  { pattern: /nerol|nérol/i, class: 'alcohol' },
  { pattern: /citronellol/i, class: 'alcohol' },
  { pattern: /menthol/i, class: 'alcohol' },
  { pattern: /terpineol|terpinéol/i, class: 'alcohol' },
  { pattern: /borneol|bornéol/i, class: 'alcohol' },
  { pattern: /cedrol|cédrol/i, class: 'alcohol' },
  { pattern: /santalol/i, class: 'alcohol' },
  { pattern: /patchoulol/i, class: 'alcohol' },
  { pattern: /nerolidol|nérolidol/i, class: 'alcohol' },
  { pattern: /farnesol|farnésol/i, class: 'alcohol' },
  { pattern: /bisabolol/i, class: 'alcohol' },
  { pattern: /vetivenol|vétivénol/i, class: 'alcohol' },
  { pattern: /phenyléthanol|phenylethanol/i, class: 'alcohol' },
  { pattern: /benzyl alcohol|alcool benzylique/i, class: 'alcohol' },
  
  // Esters
  { pattern: /acetate|acétate/i, class: 'ester' },
  { pattern: /benzoate/i, class: 'ester' },
  { pattern: /salicylate/i, class: 'ester' },
  { pattern: /cinnamate/i, class: 'ester' },
  { pattern: /formate/i, class: 'ester' },
  { pattern: /propionate/i, class: 'ester' },
  { pattern: /butyrate/i, class: 'ester' },
  { pattern: /anthranilate/i, class: 'ester' },
  
  // Éthers
  { pattern: /oxide|oxyde/i, class: 'ether' },
  { pattern: /cineole|cinéole/i, class: 'ether' },
  { pattern: /eucalyptol/i, class: 'ether' },
  { pattern: /estragole/i, class: 'ether' },
  { pattern: /anethole|anéthol/i, class: 'ether' },
  { pattern: /methyleugenol|méthyleugénol/i, class: 'ether' },
  
  // Phénols
  { pattern: /eugenol|eugénol/i, class: 'phenol' },
  { pattern: /thymol/i, class: 'phenol' },
  { pattern: /carvacrol/i, class: 'phenol' },
  { pattern: /guaiacol|gaïacol/i, class: 'phenol' },
  { pattern: /chavicol/i, class: 'phenol' },
  { pattern: /phenol|phénol/i, class: 'phenol' },
  { pattern: /cresol|crésol/i, class: 'phenol' },
  
  // Lactones
  { pattern: /lactone/i, class: 'lactone' },
  { pattern: /coumarin|coumarine/i, class: 'lactone' },
  { pattern: /decalactone|décalactone/i, class: 'lactone' },
  { pattern: /jasmine lactone/i, class: 'lactone' },
  
  // Muscs
  { pattern: /musk|musc/i, class: 'musk' },
  { pattern: /muscone/i, class: 'musk' },
  { pattern: /galaxolide/i, class: 'musk' },
  { pattern: /ambrettolide/i, class: 'musk' },
  { pattern: /exaltolide/i, class: 'musk' },
  { pattern: /civetone|civettone/i, class: 'musk' },
  
  // Composés soufrés
  { pattern: /sulfur|soufre|thiol|mercaptan/i, class: 'sulfur_compound' },
  { pattern: /dimethyl sulfide/i, class: 'sulfur_compound' },
  
  // Composés hétérocycliques
  { pattern: /pyrazine/i, class: 'heterocyclic' },
  { pattern: /pyridine/i, class: 'heterocyclic' },
  { pattern: /furan|furane/i, class: 'heterocyclic' },
  { pattern: /indole/i, class: 'heterocyclic' },
  { pattern: /thiazole/i, class: 'heterocyclic' },
  
  // Composés aromatiques
  { pattern: /benzene|benzène/i, class: 'aromatic' },
  { pattern: /toluene|toluène/i, class: 'aromatic' },
  { pattern: /styrene|styrène/i, class: 'aromatic' },
];

// Classification basée sur la famille existante
const FAMILY_TO_CLASS = {
  'terpène': 'monoterpene',
  'terpene': 'monoterpene',
  'monoterpène': 'monoterpene',
  'monoterpene': 'monoterpene',
  'sesquiterpène': 'sesquiterpene',
  'sesquiterpene': 'sesquiterpene',
  'diterpène': 'diterpene',
  'diterpene': 'diterpene',
  'aldéhyde': 'aldehyde',
  'aldehyde': 'aldehyde',
  'cétone': 'ketone',
  'ketone': 'ketone',
  'alcool': 'alcohol',
  'alcohol': 'alcohol',
  'ester': 'ester',
  'éther': 'ether',
  'ether': 'ether',
  'phénol': 'phenol',
  'phenol': 'phenol',
  'lactone': 'lactone',
  'coumarine': 'coumarin',
  'musc': 'musk',
  'musk': 'musk',
};

function classifyMolecule(name, family, formula) {
  // 1. Essayer de classifier par le nom
  for (const rule of CLASSIFICATION_RULES) {
    if (rule.pattern.test(name)) {
      return rule.class;
    }
  }
  
  // 2. Essayer de classifier par la famille existante
  if (family) {
    const lowerFamily = family.toLowerCase().trim();
    for (const [key, value] of Object.entries(FAMILY_TO_CLASS)) {
      if (lowerFamily.includes(key)) {
        return value;
      }
    }
  }
  
  // 3. Classification basée sur la formule (heuristique simple)
  if (formula) {
    // C10H16 est typique des monoterpènes
    if (/^C10H1[46]$/i.test(formula)) {
      return 'monoterpene';
    }
    // C15H24 est typique des sesquiterpènes
    if (/^C15H2[24]$/i.test(formula)) {
      return 'sesquiterpene';
    }
    // Formules avec O et terminant en -ol suggèrent des alcools
    if (formula.includes('O') && name.toLowerCase().endsWith('ol')) {
      return 'alcohol';
    }
  }
  
  return null;
}

async function main() {
  const connection = await mysql.createConnection(process.env.DATABASE_URL);
  
  console.log('=== CLASSIFICATION AUTOMATIQUE DES MOLÉCULES ===\n');
  
  // Récupérer les molécules sans classe chimique
  const [molecules] = await connection.execute(`
    SELECT id, name, family, chemicalFormula, chemical_class
    FROM molecules 
    WHERE chemical_class IS NULL
    ORDER BY name
  `);
  
  console.log(`Molécules sans classe chimique: ${molecules.length}\n`);
  
  let classified = 0;
  const classificationCounts = {};
  
  for (const mol of molecules) {
    const chemClass = classifyMolecule(mol.name, mol.family, mol.chemicalFormula);
    
    if (chemClass) {
      await connection.execute(
        'UPDATE molecules SET chemical_class = ? WHERE id = ?',
        [chemClass, mol.id]
      );
      classified++;
      classificationCounts[chemClass] = (classificationCounts[chemClass] || 0) + 1;
      console.log(`✓ ${mol.name.substring(0, 40).padEnd(40)} → ${chemClass}`);
    }
  }
  
  console.log('\n=== RÉSUMÉ ===');
  console.log(`Molécules classifiées: ${classified}`);
  console.log('\nRépartition par classe:');
  for (const [cls, count] of Object.entries(classificationCounts).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${cls}: ${count}`);
  }
  
  // Nouvelles statistiques
  const [newStats] = await connection.execute(`
    SELECT 
      COUNT(*) as total,
      SUM(CASE WHEN chemical_class IS NOT NULL THEN 1 ELSE 0 END) as class_filled
    FROM molecules
  `);
  
  const total = Number(newStats[0].total);
  console.log(`\nClasse chimique: ${newStats[0].class_filled}/${total} (${Math.round(Number(newStats[0].class_filled)/total*100)}%)`);
  
  await connection.end();
}

main().catch(console.error);
