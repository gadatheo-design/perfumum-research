/**
 * Seconde passe de normalisation taxonomique des familles de molécules.
 * Consolide les doublons restants et les valeurs en anglais/non normalisées.
 */

import mysql from 'mysql2/promise';

const NORMALIZATION_MAP = {
  // Pluriels → singulier
  'Flavonoïdes': 'Flavonoïde',
  'Vitamines': 'Vitamine',
  'Alcaloïdes': 'Alcaloïde',
  'Diterpènes': 'Diterpène',
  'Triterpènes': 'Triterpène',
  'Iridoïdes': 'Iridoïde',
  'Indoles': 'Indole',
  'indoles': 'Indole',
  'Caroténoïdes': 'Caroténoïde',
  'Lignanes': 'Lignane',
  'Pyrazines': 'Pyrazine',
  'Polyamines': 'Polyamine',
  'Ionones': 'Ionone',
  'Norisoprénoïdes': 'Norisoprénoïde',
  'Muscs macrocycliques': 'Musc macrocyclique',
  'Terpènes Floraux': 'Monoterpénol',
  'Esters fruités': 'Ester fruité',
  'Aldéhydes marins': 'Aldéhyde marin',
  'Aldéhydes Marins': 'Aldéhyde marin',
  'Aldéhydes verts': 'Aldéhyde vert',
  'Sesquiterpènes aromatiques': 'Sesquiterpène',
  'Cétones sesquiterpéniques': 'Cétone sesquiterpénique',
  'Esters Balsamiques': 'Ester balsamique',
  'Alcools aromatiques': 'Alcool aromatique',
  'Terpènes boisés': 'Sesquiterpène',
  'Esters phénoliques': 'Ester phénolique',
  'Minéraux': 'Composé minéral',
  'Stéroïdes': 'Stéroïde',
  'Furanones': 'Hétérocycle',
  'Floraux': 'Monoterpénol',
  'Éthers cycliques': 'Éther',
  'Glucosides': 'Glucoside',
  'Furocoumarines': 'Coumarine',
  'Jasminates': 'Ester jasminé',
  'Esters furaniques': 'Hétérocycle',
  'Acides phénoliques': 'Acide phénolique',
  'Aldéhydes aliphatiques': 'Aldéhyde',
  'Triterpène pentacyclique': 'Triterpène',
  'Furanosesquiterpène': 'Sesquiterpène',
  'Alcaloïde tropanique': 'Alcaloïde',
  'Phéromone': 'Composé animal',
  'Matière animale': 'Composé animal',
  'Matière première': 'Autre',
  'Huile essentielle': 'Autre',
  'Accords métalliques': 'Composé minéral',
  'Accords minéraux': 'Composé minéral',
  'Lipides végétaux fumés': 'Phénol fumé',
  'Aldéhyde synthétique': 'Aldéhyde',
  'Musc synthétique': 'Musc',
  'Musc ambré': 'Musc',
  
  // Anglais → français
  'cannabinoid': 'Cannabinoïde',
  'cannabinoid-acid': 'Cannabinoïde',
  'unknown': 'Non classé',
  'alkaloid': 'Alcaloïde',
  'norisoprenoid': 'Norisoprénoïde',
  'sesquiterpene ketone': 'Cétone sesquiterpénique',
  'terpene aldehyde': 'Aldéhyde terpénique',
  
  // Valeurs non standard
  'epice': 'Phénylpropanoïde',
  'acides_aromatiques': 'Acide phénolique',
  'TSNA': 'Composé du tabac',
  
  // Consolidations supplémentaires
  'Dicétone': 'Cétone',
  'Salicylate': 'Ester aromatique',
  'Phénol aromatique': 'Phénol',
  'Phénol monoterpénique': 'Phénol',
  'Phénol terpénique': 'Phénol',
  'Alcool aromatique': 'Phénylpropanoïde',
  'Alcools aromatiques': 'Phénylpropanoïde',
  'Aromatique': 'Phénylpropanoïde',
  'Alcool gras': 'Alcool',
  'Acide carboxylique': 'Acide carboxylique',
  'Acides gras': 'Acide gras',
  'Acides gras volatils': 'Acide gras',
  'Acides organiques': 'Acide organique',
  'Acides aminés': 'Acide aminé',
  'Polysaccharides': 'Polysaccharide',
  'Minéral': 'Composé minéral',
};

async function main() {
  const conn = await mysql.createConnection(process.env.DATABASE_URL);
  
  let totalUpdated = 0;
  const updateLog = [];
  
  for (const [oldVal, newVal] of Object.entries(NORMALIZATION_MAP)) {
    const [result] = await conn.execute(
      'UPDATE molecules SET family = ? WHERE family = ?',
      [newVal, oldVal]
    );
    if (result.affectedRows > 0) {
      updateLog.push({ from: oldVal, to: newVal, count: result.affectedRows });
      totalUpdated += result.affectedRows;
    }
  }
  
  console.log(`\n=== SECONDE PASSE TERMINÉE ===`);
  console.log(`Total molécules mises à jour : ${totalUpdated}`);
  console.log('\nDétail :');
  updateLog.forEach(u => console.log(`  "${u.from}" → "${u.to}" (${u.count})`));
  
  // Vérification finale
  const [remaining] = await conn.execute(
    'SELECT DISTINCT family, COUNT(*) as n FROM molecules GROUP BY family ORDER BY n DESC'
  );
  console.log('\n=== TOUTES LES FAMILLES APRÈS NORMALISATION ===');
  remaining.forEach(r => console.log(`  ${r.family}: ${r.n}`));
  console.log(`\nNombre total de familles distinctes : ${remaining.length}`);
  
  await conn.end();
}

main().catch(console.error);
