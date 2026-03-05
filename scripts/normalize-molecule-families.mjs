/**
 * Normalisation taxonomique du champ `family` des molécules
 * 69 valeurs distinctes → ~20 classes canoniques
 * 
 * Taxonomie canonique PERFUMUM v2 :
 * - Sesquiterpène       (C15, 3 unités isoprène)
 * - Monoterpène         (C10, 2 unités isoprène)
 * - Diterpène           (C20)
 * - Triterpène          (C30)
 * - Norisoprénoïde      (dégradation caroténoïdes)
 * - Phénylpropanoïde    (dérivés acide cinnamique)
 * - Phénol              (aromatiques hydroxylés)
 * - Aldéhyde            (groupe CHO)
 * - Ester               (groupe COO)
 * - Cétone              (groupe C=O)
 * - Lactone             (ester cyclique)
 * - Alcaloïde           (azote hétérocyclique)
 * - Flavonoïde          (polyphénols C6-C3-C6)
 * - Cannabinoïde        (spécifique cannabis)
 * - Composé du tabac    (spécifique tabac)
 * - Acide organique     (COOH)
 * - Composé soufré      (S)
 * - Hétérocycle         (cycles N/O/S)
 * - Musc                (macrocycliques/nitrés)
 * - Autre               (non classifiable)
 */

import mysql from 'mysql2/promise';

const MAPPING = {
  // Sesquiterpènes (C15)
  'Sesquiterpène': 'Sesquiterpène',
  'Sesquiterpénol': 'Sesquiterpène',
  'Cétone sesquiterpénique': 'Sesquiterpène',
  'Aldéhyde sesquiterpénique': 'Sesquiterpène',
  
  // Monoterpènes (C10)
  'Monoterpène': 'Monoterpène',
  'Monoterpénol': 'Monoterpène',
  'Monoterpénol bicyclique': 'Monoterpène',
  'Aldéhyde terpénique': 'Monoterpène',
  'Cétone terpénique': 'Monoterpène',
  'Ester terpénique': 'Monoterpène',
  'Oxyde terpénique': 'Monoterpène',
  'Éther terpénique': 'Monoterpène',
  'Terpène': 'Monoterpène',
  'Ionone': 'Norisoprénoïde',
  
  // Diterpènes (C20)
  'Diterpène': 'Diterpène',
  
  // Triterpènes (C30)
  'Triterpène': 'Triterpène',
  'Stéroïde': 'Triterpène',
  
  // Norisoprénoïdes
  'Norisoprénoïde': 'Norisoprénoïde',
  'Caroténoïde': 'Norisoprénoïde',
  
  // Phénylpropanoïdes
  'Phénylpropanoïde': 'Phénylpropanoïde',
  'Coumarine': 'Phénylpropanoïde',
  'Lignane': 'Phénylpropanoïde',
  'Iridoïde': 'Phénylpropanoïde',
  
  // Phénols
  'Phénol': 'Phénol',
  'Phénol fumé': 'Phénol',
  'Acide phénolique': 'Phénol',
  'Ester phénolique': 'Phénol',
  'Polyphénol': 'Phénol',
  
  // Aldéhydes
  'Aldéhyde': 'Aldéhyde',
  'Aldéhyde aromatique': 'Aldéhyde',
  'Aldéhyde marin': 'Aldéhyde',
  'Aldéhyde vert': 'Aldéhyde',
  
  // Esters
  'Ester': 'Ester',
  'Ester aromatique': 'Ester',
  'Ester fruité': 'Ester',
  'Ester jasminé': 'Ester',
  'Ester balsamique': 'Ester',
  'Ester lactique': 'Ester',
  'Ester gras': 'Ester',
  
  // Cétones
  'Cétone': 'Cétone',
  'Cétone irone': 'Cétone',
  
  // Lactones
  'Lactone': 'Lactone',
  'Lactone macrocyclique': 'Lactone',
  
  // Alcaloïdes
  'Alcaloïde': 'Alcaloïde',
  'Pyrazine': 'Alcaloïde',
  'Indole': 'Alcaloïde',
  'Polyamine': 'Alcaloïde',
  
  // Flavonoïdes
  'Flavonoïde': 'Flavonoïde',
  'Glucoside': 'Flavonoïde',
  'Polysaccharide': 'Polysaccharide',
  
  // Cannabinoïdes
  'Cannabinoïde': 'Cannabinoïde',
  'Terpène cannabinoïde': 'Cannabinoïde',
  
  // Composés du tabac
  'Composé du tabac': 'Composé du tabac',
  'Résinoïde': 'Résinoïde',
  
  // Acides organiques
  'Acide organique': 'Acide organique',
  'Acide gras': 'Acide organique',
  'Acide aminé': 'Acide organique',
  'Acide carboxylique': 'Acide organique',
  
  // Composés soufrés
  'Composé soufré': 'Composé soufré',
  
  // Hétérocycles
  'Hétérocycle': 'Hétérocycle',
  'Éther': 'Hétérocycle',
  
  // Muscs
  'Musc': 'Musc',
  'Musc macrocyclique': 'Musc',
  
  // Composés spéciaux
  'Composé animal': 'Composé animal',
  'Composé marin': 'Composé marin',
  'Composé minéral': 'Composé minéral',
  
  // Vitamines
  'Vitamine': 'Vitamine',
  
  // Alcool simple
  'Alcool': 'Alcool',
  
  // Autre/Non classé
  'Autre': 'Non classé',
  'Non classé': 'Non classé',
};

async function run() {
  const conn = await mysql.createConnection(process.env.DATABASE_URL);
  
  try {
    // Vérifier l'état actuel
    const [before] = await conn.execute('SELECT COUNT(DISTINCT family) as cnt FROM molecules WHERE family IS NOT NULL');
    console.log('Familles distinctes avant normalisation:', before[0].cnt);
    
    let totalUpdated = 0;
    
    for (const [from, to] of Object.entries(MAPPING)) {
      if (from === to) continue; // Pas de changement nécessaire
      
      const [result] = await conn.execute(
        'UPDATE molecules SET family = ? WHERE family = ?',
        [to, from]
      );
      
      if (result.affectedRows > 0) {
        console.log(`  ${from} → ${to} : ${result.affectedRows} molécules`);
        totalUpdated += result.affectedRows;
      }
    }
    
    // Vérifier l'état final
    const [after] = await conn.execute('SELECT family, COUNT(*) as cnt FROM molecules WHERE family IS NOT NULL GROUP BY family ORDER BY cnt DESC');
    console.log('\nFamilles distinctes après normalisation:', after.length);
    after.forEach(r => console.log(`  ${r.cnt} "${r.family}"`));
    console.log(`\nTotal molécules mises à jour: ${totalUpdated}`);
    
  } finally {
    await conn.end();
  }
}

run().catch(console.error);
