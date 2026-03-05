/**
 * Script de normalisation du champ `family` dans la table molecules.
 * Règles :
 * 1. Normaliser la casse (première lettre majuscule, reste minuscule sauf noms propres)
 * 2. Fusionner les doublons sémantiques évidents
 * 3. Remplacer les valeurs olfactives descriptives (boise, floral, etc.) par des familles chimiques
 * 4. Conserver "Non classé" pour les entrées sans famille connue
 */

import mysql from 'mysql2/promise';

const NORMALIZATION_MAP = {
  // Doublons singulier/pluriel → forme canonique au singulier
  'Sesquiterpènes': 'Sesquiterpène',
  'sesquiterpene': 'Sesquiterpène',
  'Monoterpènes': 'Monoterpène',
  'Terpènes': 'Terpène',
  'Aldéhydes': 'Aldéhyde',
  'Cétones': 'Cétone',
  'Phénols': 'Phénol',
  'Esters': 'Ester',
  'Lactones': 'Lactone',
  'Alcools': 'Alcool',
  'Coumarines': 'Coumarine',
  'Muscs': 'Musc',
  
  // Casse non normalisée → forme canonique
  'aldehyde': 'Aldéhyde',
  'ketone': 'Cétone',
  'alcohol': 'Alcool',
  'ester': 'Ester',
  'phenol': 'Phénol',
  'lactone': 'Lactone',
  'terpene': 'Terpène',
  'autre': 'Autre',
  
  // Valeurs olfactives descriptives → familles chimiques appropriées
  'boise': 'Sesquiterpène',           // boisé = majoritairement sesquiterpènes
  'balsamique': 'Résinoïde',          // balsamique = résinoïdes/diterpènes
  'aromatique': 'Phénylpropanoïde',   // aromatique = phénylpropanoïdes
  'terreux': 'Sesquiterpène',         // terreux = sesquiterpènes géosminiques
  'fume': 'Phénol fumé',              // fumé = phénols pyrogénés
  'floral': 'Monoterpénol',           // floral = monoterpénols
  'gourmand': 'Ester',                // gourmand = esters fruités/lactones
  'animal': 'Composé animal',         // animal = muscs/castoreum
  'agrume': 'Monoterpène',            // agrume = monoterpènes (limonène, etc.)
  'musque': 'Musc',                   // musqué = muscs
  'fruite': 'Ester',                  // fruité = esters
  'marin': 'Composé marin',           // marin = composés spéciaux
  'vert': 'Aldéhyde vert',            // vert = aldéhydes verts (C6)
  'herbace': 'Monoterpène',           // herbacé = monoterpènes
  'sulfure': 'Composé soufré',        // sulfure = composés soufrés
  'acide carboxylique': 'Acide carboxylique',
  
  // Variantes avec accents/casse
  'Terpène (Cannabis)': 'Terpène cannabinoïde',
  'Composé du Tabac': 'Composé du tabac',
  'Phénols fumés': 'Phénol fumé',
  'Cétones terpéniques': 'Cétone terpénique',
  'Aldéhydes terpéniques': 'Aldéhyde terpénique',
  'Esters terpéniques': 'Ester terpénique',
  'Esters aromatiques': 'Ester aromatique',
  'Alcools sesquiterpéniques': 'Sesquiterpénol',
  'Alcools terpéniques': 'Monoterpénol',
  'Sesquiterpène alcool': 'Sesquiterpénol',
  'Alcool bicyclique': 'Monoterpénol bicyclique',
  'Monoterpène alcool': 'Monoterpénol',
  'Sesquiterpènes Boisés': 'Sesquiterpène',
  'Alcools boisés': 'Sesquiterpénol',
  'Sesquiterpénols': 'Sesquiterpénol',
  'Terpènes agrumes': 'Monoterpène',
  'Phénols terpéniques': 'Phénol terpénique',
  'Phénols boisés': 'Phénol',
  'Terpènes floraux': 'Monoterpénol',
  'Terpènes verts': 'Aldéhyde vert',
  'Terpènes poivrés': 'Sesquiterpène',
  'Terpènes fruités': 'Ester',
  'Muscs synthétiques': 'Musc synthétique',
  'Synthétique marin': 'Composé marin',
  'Ambre synthétique': 'Musc ambré',
  'Aldéhyde aromatique': 'Aldéhyde aromatique',
  'Aldéhydes aromatiques': 'Aldéhyde aromatique',
  'Aldéhydes spéciaux': 'Aldéhyde',
  'Aldéhydes Fruités': 'Aldéhyde',
  'Esters jasminés': 'Ester jasminé',
  'Esters lactiques': 'Ester lactique',
  'Esters Lactones': 'Lactone',
  'Esters soufrés': 'Composé soufré',
  'Esters gras': 'Ester gras',
  'Esters Fruités': 'Ester fruité',
  'Ester jasmonique': 'Ester jasminé',
  'Lactone aromatique': 'Lactone',
  'Lactone macrocyclique': 'Lactone macrocyclique',
  'Lactone-Terre': 'Lactone',
  'Lactones florales': 'Lactone',
  'Lactones marines': 'Lactone',
  'Éthers terpéniques': 'Éther terpénique',
  'Éthers': 'Éther',
  'Éther cyclique': 'Éther',
  'Esters Lactones': 'Lactone',
  'Aromatiques': 'Aromatique',
  'Alcools': 'Alcool',
  'Alcools gras': 'Alcool gras',
  'Alcools monoterpéniques': 'Monoterpénol',
  'Acides': 'Acide carboxylique',
  'Acides carboxyliques': 'Acide carboxylique',
  'Cétone cyclique': 'Cétone',
  'Cétones (Irones)': 'Cétone irone',
  'Diterpènes Résineux': 'Diterpène',
  'Diterpène alcool': 'Diterpène',
  'Monoterpène bicyclique': 'Monoterpène',
  'Monoterpène cyclique': 'Monoterpène',
  'Sesquiterpène macrocyclique': 'Sesquiterpène',
  'Phénylpropanoïdes': 'Phénylpropanoïde',
  'Hétérocycle azoté': 'Hétérocycle',
  'Furanes': 'Hétérocycle',
  'Pyrones': 'Hétérocycle',
  'Quinoléine': 'Hétérocycle',
  'Xanthones': 'Polyphénol',
  'Stilbènes': 'Polyphénol',
  'Polyphénols': 'Polyphénol',
  'Catécholamines': 'Alcaloïde',
  'Phytostérol': 'Stéroïde',
  'Saponines': 'Triterpène',
  'Quinones': 'Phénol',
  'Phénols pyrogénés': 'Phénol fumé',
  'Acétals': 'Aldéhyde',
  'Oxydes': 'Oxyde terpénique',
  'Élémane': 'Sesquiterpène',
  'Sélinane': 'Sesquiterpène',
  'Mélanges': 'Autre',
  'Minéraux clairs': 'Composé minéral',
  'Accords terreux': 'Sesquiterpène',
  'Cannabinoïde': 'Cannabinoïde',
  'Cannabinoïdes': 'Cannabinoïde',
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
  
  console.log(`\n=== NORMALISATION TERMINÉE ===`);
  console.log(`Total molécules mises à jour : ${totalUpdated}`);
  console.log('\nDétail des modifications :');
  updateLog.forEach(u => console.log(`  "${u.from}" → "${u.to}" (${u.count} molécules)`));
  
  // Vérification finale
  const [remaining] = await conn.execute(
    'SELECT DISTINCT family, COUNT(*) as n FROM molecules GROUP BY family ORDER BY n DESC LIMIT 30'
  );
  console.log('\n=== TOP 30 FAMILLES APRÈS NORMALISATION ===');
  remaining.forEach(r => console.log(`  ${r.family}: ${r.n}`));
  
  const [totalFamilies] = await conn.execute(
    'SELECT COUNT(DISTINCT family) as n FROM molecules'
  );
  console.log(`\nNombre total de familles distinctes : ${totalFamilies[0].n}`);
  
  await conn.end();
}

main().catch(console.error);
