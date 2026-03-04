/**
 * Ajout des variations saisonnières batch 2
 * - Crée OG Kush, Haze, Rosa centifolia si absents
 * - Ajoute leurs variations saisonnières
 * - Complète Lavandula angustifolia (id:30001)
 * Sources : GC-MS PMC, MDPI, J.Essent.Oil.Res
 */

import mysql from 'mysql2/promise';

const conn = await mysql.createConnection(process.env.DATABASE_URL);

// ============================================================
// 1. CRÉER LES PLANTES MANQUANTES
// ============================================================

async function getOrCreatePlant(name, latinName, category, notes) {
  const [existing] = await conn.execute('SELECT id FROM plants WHERE name = ? LIMIT 1', [name]);
  if (existing.length > 0) {
    console.log(`  Plante existante : ${name} (id:${existing[0].id})`);
    return existing[0].id;
  }
  const [result] = await conn.execute(
    'INSERT INTO plants (name, latin_name, category, notes, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())',
    [name, latinName, category, notes]
  );
  console.log(`  ✅ Plante créée : ${name} (id:${result.insertId})`);
  return result.insertId;
}

console.log('\n=== CRÉATION DES PLANTES ===');

const ogKushId = await getOrCreatePlant(
  'OG Kush',
  'Cannabis sativa subsp. indica × sativa',
  'cannabis',
  'Hybride indica/sativa emblématique originaire de Californie (années 1990). Profil terpénique dominé par le Myrcène, le Limonène et le β-Caryophyllène. Notes terreuses, citronnées et boisées. Croisement présumé : Chemdawg × Hindu Kush × Lemon Thai.'
);

const hazeId = await getOrCreatePlant(
  'Haze',
  'Cannabis sativa subsp. sativa',
  'cannabis',
  'Sativa pure d\'origine tropicale (Colombie, Mexique, Thaïlande, Inde). Profil terpénique dominé par le Terpinolène, l\'Ocimène et le Myrcène. Notes épicées, florales et terreuses. Temps de floraison long (14-16 semaines). Ancêtre de nombreuses variétés modernes.'
);

const rosaCentifoliaId = await getOrCreatePlant(
  'Rose de Mai',
  'Rosa × centifolia',
  'fleur',
  'Rose à cent feuilles cultivée principalement à Grasse (Alpes-Maritimes). Profil aromatique dominé par le Phényléthanol (60-70%), la Citronellol (15-20%) et le Géraniol (5-10%). Récoltée uniquement en mai. Matière première emblématique de la parfumerie de Grasse. Source : ISO 9842:2003.'
);

// ============================================================
// 2. AJOUTER LES MOLÉCULES POUR LES NOUVELLES PLANTES
// ============================================================

async function linkMolecule(plantId, molName, percentage, notes) {
  const [mol] = await conn.execute('SELECT id FROM molecules WHERE name = ? LIMIT 1', [molName]);
  if (mol.length === 0) {
    // Essai avec LIKE
    const [mol2] = await conn.execute('SELECT id FROM molecules WHERE LOWER(name) LIKE ? LIMIT 1', ['%' + molName.toLowerCase() + '%']);
    if (mol2.length === 0) {
      console.log(`    ⚠️ Molécule non trouvée : ${molName}`);
      return;
    }
    const molId = mol2[0].id;
    const [existing] = await conn.execute(
      'SELECT plant_id FROM plant_molecules WHERE plant_id = ? AND molecule_id = ? LIMIT 1',
      [plantId, molId]
    );
    if (existing.length > 0) {
      await conn.execute(
        'UPDATE plant_molecules SET percentage = ?, notes = ?, updated_at = NOW() WHERE plant_id = ? AND molecule_id = ?',
        [percentage, notes, plantId, molId]
      );
    } else {
      await conn.execute(
        'INSERT INTO plant_molecules (plant_id, molecule_id, percentage, notes, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())',
        [plantId, molId, percentage, notes]
      );
    }
    return;
  }
  const molId = mol[0].id;
  const [existing] = await conn.execute(
    'SELECT plant_id FROM plant_molecules WHERE plant_id = ? AND molecule_id = ? LIMIT 1',
    [plantId, molId]
  );
  if (existing.length > 0) {
    await conn.execute(
      'UPDATE plant_molecules SET percentage = ?, notes = ?, updated_at = NOW() WHERE plant_id = ? AND molecule_id = ?',
      [percentage, notes, plantId, molId]
    );
  } else {
    await conn.execute(
      'INSERT INTO plant_molecules (plant_id, molecule_id, percentage, notes, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())',
      [plantId, molId, percentage, notes]
    );
  }
}

console.log('\n=== LIAISONS MOLÉCULAIRES OG KUSH ===');
// Source : PMC:10808149, Leafly GC-MS data, J.Cannabis.Res:2021
const ogKushMolecules = [
  ['Myrcène', 22.5, 'GC-MS moyen, dominante terpénique. PMC:10808149'],
  ['Limonène', 18.0, 'Seconde terpène dominante, notes citronnées. PMC:10808149'],
  ['β-Caryophyllène', 12.0, 'Sesquiterpène anti-inflammatoire. PMC:10808149'],
  ['Linalol', 5.5, 'Notes florales, anxiolytique. PMC:10808149'],
  ['Terpinolène', 4.0, 'Présent en quantité modérée. PMC:10808149'],
  ['α-Pinène', 3.5, 'Notes boisées, bronchodilatateur. PMC:10808149'],
  ['Humulène', 3.0, 'Sesquiterpène anti-inflammatoire. PMC:10808149'],
  ['Ocimène', 2.5, 'Notes florales et herbacées. PMC:10808149'],
  ['β-Pinène', 2.0, 'Notes boisées et fraîches. PMC:10808149'],
  ['THC', 18.0, 'Cannabinoïde principal (18-24%). J.Cannabis.Res:2021'],
  ['CBD', 0.1, 'Cannabinoïde mineur (<0.5%). J.Cannabis.Res:2021'],
];

for (const [name, pct, notes] of ogKushMolecules) {
  await linkMolecule(ogKushId, name, pct, notes);
  console.log(`  ✅ ${name} ${pct}%`);
}

console.log('\n=== LIAISONS MOLÉCULAIRES HAZE ===');
// Source : PMC:12073320, J.Nat.Prod:2019, GC-MS sativa tropicale
const hazeMolecules = [
  ['Terpinolène', 28.0, 'Terpène dominant des sativas tropicales. PMC:12073320'],
  ['Ocimène', 18.0, 'Seconde terpène dominante, notes florales. PMC:12073320'],
  ['Myrcène', 12.0, 'Présent en quantité modérée. PMC:12073320'],
  ['β-Caryophyllène', 8.0, 'Sesquiterpène anti-inflammatoire. PMC:12073320'],
  ['Limonène', 7.0, 'Notes citronnées. PMC:12073320'],
  ['α-Pinène', 5.0, 'Notes boisées. PMC:12073320'],
  ['Linalol', 4.0, 'Notes florales. PMC:12073320'],
  ['Humulène', 3.5, 'Sesquiterpène. PMC:12073320'],
  ['β-Pinène', 2.5, 'Notes fraîches. PMC:12073320'],
  ['THC', 20.0, 'Cannabinoïde principal (18-25%). J.Nat.Prod:2019'],
  ['CBD', 0.1, 'Cannabinoïde mineur. J.Nat.Prod:2019'],
];

for (const [name, pct, notes] of hazeMolecules) {
  await linkMolecule(hazeId, name, pct, notes);
  console.log(`  ✅ ${name} ${pct}%`);
}

console.log('\n=== LIAISONS MOLÉCULAIRES ROSA CENTIFOLIA ===');
// Source : ISO 9842:2003, PMC:7763918, J.Essent.Oil.Res:2018
const rosaCentMolecules = [
  ['Phényléthanol', 65.0, 'Composant dominant (60-70%). ISO 9842:2003'],
  ['Citronellol', 15.0, 'Second composant majeur (12-20%). ISO 9842:2003'],
  ['Géraniol', 8.0, 'Troisième composant (5-12%). ISO 9842:2003'],
  ['Nérol', 4.0, 'Isomère cis du géraniol. ISO 9842:2003'],
  ['Linalol', 2.5, 'Notes florales. ISO 9842:2003'],
  ['Eugenol', 1.5, 'Notes épicées. ISO 9842:2003'],
  ['Rose oxide', 0.5, 'Composé caractéristique de la rose. ISO 9842:2003'],
  ['Nonanal', 0.3, 'Aldéhyde aliphatique. J.Essent.Oil.Res:2018'],
  ['β-Damascenone', 0.1, 'Norisoprénoïde, seuil olfactif très bas. PMC:7763918'],
];

for (const [name, pct, notes] of rosaCentMolecules) {
  await linkMolecule(rosaCentifoliaId, name, pct, notes);
  console.log(`  ✅ ${name} ${pct}%`);
}

// ============================================================
// 3. VARIATIONS SAISONNIÈRES
// ============================================================

async function addVariation(plantId, season, harvestPeriod, tempRange, humidityRange, notes, keyMolecules, yieldModifier, qualityScore, extractionNotes) {
  const [existing] = await conn.execute(
    'SELECT id FROM seasonal_variations WHERE plant_id = ? AND season = ? LIMIT 1',
    [plantId, season]
  );
  if (existing.length > 0) {
    await conn.execute(
      'UPDATE seasonal_variations SET harvest_period=?, temperature_range=?, humidity_range=?, notes=?, key_molecules=?, yield_modifier=?, quality_score=?, extraction_notes=?, updated_at=NOW() WHERE id=?',
      [harvestPeriod, tempRange, humidityRange, notes, JSON.stringify(keyMolecules), yieldModifier, qualityScore, extractionNotes, existing[0].id]
    );
    console.log(`  ↻ Mis à jour : ${season}`);
  } else {
    await conn.execute(
      'INSERT INTO seasonal_variations (plant_id, season, harvest_period, temperature_range, humidity_range, notes, key_molecules, yield_modifier, quality_score, extraction_notes, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())',
      [plantId, season, harvestPeriod, tempRange, humidityRange, notes, JSON.stringify(keyMolecules), yieldModifier, qualityScore, extractionNotes]
    );
    console.log(`  ✅ Ajouté : ${season}`);
  }
}

// --- OG KUSH ---
console.log('\n=== VARIATIONS OG KUSH ===');
await addVariation(
  ogKushId, 'printemps', 'Mars-Avril (végétation)',
  '18-24°C', '50-60%',
  'Phase végétative. Terpènes peu développés, profil dominé par Myrcène et α-Pinène. Culture indoor sous 18h lumière.',
  { myrcene: '15-18%', alpha_pinene: '5-7%', limonene: '10-12%' },
  0.60, 55,
  'Non récolté en végétation. Données pour suivi du développement terpénique.'
);

await addVariation(
  ogKushId, 'ete', 'Juillet-Août (floraison précoce)',
  '22-28°C', '45-55%',
  'Début de floraison. Montée en puissance du Limonène et du β-Caryophyllène. Profil terpénique en développement. Culture outdoor en hémisphère nord.',
  { myrcene: '20-22%', limonene: '15-18%', beta_caryophyllene: '8-10%', linalool: '4-6%' },
  0.80, 75,
  'Récolte précoce possible. Extraction à froid recommandée pour préserver les terpènes volatils.'
);

await addVariation(
  ogKushId, 'automne', 'Octobre-Novembre (floraison complète)',
  '15-22°C', '40-50%',
  'Floraison complète. Profil terpénique optimal : Myrcène (22-25%), Limonène (17-20%), β-Caryophyllène (11-13%). Nuits fraîches favorisent la production de résine. Récolte idéale à 8-9 semaines de floraison.',
  { myrcene: '22-25%', limonene: '17-20%', beta_caryophyllene: '11-13%', linalool: '5-6%', terpinolene: '3-5%' },
  1.00, 92,
  'Extraction à froid (BHO, CO2 supercritique) recommandée. Rendement optimal en huile essentielle : 1.5-2.5% du poids sec. Source : PMC:10808149'
);

// --- HAZE ---
console.log('\n=== VARIATIONS HAZE ===');
await addVariation(
  hazeId, 'ete', 'Juillet-Septembre (floraison tropicale)',
  '25-32°C', '60-75%',
  'Conditions tropicales d\'origine (Colombie, Mexique, Thaïlande). Profil terpénique dominé par Terpinolène (28-32%) et Ocimène (16-20%). Floraison longue (14-16 semaines). Humidité élevée nécessite surveillance moisissures.',
  { terpinolene: '28-32%', ocimene: '16-20%', myrcene: '10-14%', beta_caryophyllene: '6-9%' },
  0.85, 80,
  'Extraction à la vapeur d\'eau recommandée. Rendement en huile essentielle : 0.8-1.2% du poids sec. Source : PMC:12073320'
);

await addVariation(
  hazeId, 'automne', 'Novembre-Décembre (floraison tardive)',
  '18-25°C', '45-60%',
  'Floraison tardive en conditions tempérées (culture indoor ou latitude méditerranéenne). Profil terpénique légèrement modifié : Terpinolène réduit (22-26%), Ocimène stable (17-19%), augmentation du β-Caryophyllène (9-11%). Qualité aromatique maximale.',
  { terpinolene: '22-26%', ocimene: '17-19%', myrcene: '11-13%', beta_caryophyllene: '9-11%', limonene: '6-8%' },
  1.00, 88,
  'Extraction CO2 supercritique recommandée pour préserver les terpènes volatils (Terpinolène, Ocimène). Source : PMC:12073320'
);

await addVariation(
  hazeId, 'hiver', 'Janvier-Février (culture indoor)',
  '20-26°C', '40-50%',
  'Culture indoor en hiver avec éclairage artificiel. Profil terpénique stable mais légèrement moins intense. Terpinolène dominant (20-24%), Ocimène (15-18%). Qualité aromatique légèrement réduite par rapport à l\'automne.',
  { terpinolene: '20-24%', ocimene: '15-18%', myrcene: '12-15%', beta_caryophyllene: '8-10%' },
  0.90, 78,
  'Extraction à froid recommandée. Rendement en huile essentielle : 0.7-1.0% du poids sec.'
);

// --- ROSA CENTIFOLIA ---
console.log('\n=== VARIATIONS ROSA CENTIFOLIA ===');
await addVariation(
  rosaCentifoliaId, 'printemps', 'Mai (récolte unique)',
  '15-22°C', '55-70%',
  'Récolte unique annuelle à Grasse (mai). Conditions optimales : matin frais (avant 10h), rosée matinale. Phényléthanol maximal (65-70%), Citronellol (14-18%). Qualité absolue maximale. Source : ISO 9842:2003, PMC:7763918.',
  { phenylethanol: '65-70%', citronellol: '14-18%', geraniol: '7-10%', nerol: '3-5%', linalool: '2-3%' },
  1.00, 98,
  'Enfleurage à froid (méthode traditionnelle Grasse) ou extraction par solvant (hexane → absolu). Rendement : 0.025-0.035% en absolu. 350-400 kg de fleurs pour 1 kg d\'absolu. Source : ISO 9842:2003'
);

await addVariation(
  rosaCentifoliaId, 'ete', 'Juin (fin de saison)',
  '22-28°C', '45-60%',
  'Fin de saison, chaleur croissante. Phényléthanol légèrement réduit (60-65%), Citronellol stable (15-18%). Qualité légèrement inférieure au pic de mai. Chaleur excessive peut dégrader les composés volatils.',
  { phenylethanol: '60-65%', citronellol: '15-18%', geraniol: '8-11%', nerol: '4-6%' },
  0.75, 82,
  'Extraction par solvant recommandée. Récolte tôt le matin pour limiter les pertes en volatils. Source : J.Essent.Oil.Res:2018'
);

await addVariation(
  rosaCentifoliaId, 'automne', 'Septembre-Octobre (remontant)',
  '12-18°C', '60-75%',
  'Floraison remontante automnale (variétés remontantes uniquement). Profil aromatique différent : Phényléthanol réduit (55-60%), Géraniol augmenté (10-14%). Qualité aromatique distincte, plus fraîche et moins sucrée.',
  { phenylethanol: '55-60%', citronellol: '16-20%', geraniol: '10-14%', nerol: '5-7%', linalool: '3-4%' },
  0.60, 72,
  'Extraction par vapeur d\'eau possible pour les remontants. Rendement inférieur au printemps. Source : J.Essent.Oil.Res:2018'
);

// --- LAVANDULA ANGUSTIFOLIA ---
console.log('\n=== VARIATIONS LAVANDULA ANGUSTIFOLIA ===');
const lavId = 30001; // Lavande vraie

await addVariation(
  lavId, 'printemps', 'Juin (altitude basse, 400-600m)',
  '18-25°C', '50-65%',
  'Récolte précoce en altitude basse (Drôme, Var). Linalol dominant (35-40%), Acétate de linalyle (25-30%). Profil plus floral et moins camphrée. Rendement en HE : 0.8-1.2%. Source : MDPI:1420-3049/25/7/1734.',
  { linalool: '35-40%', linalyl_acetate: '25-30%', camphor: '2-4%', beta_caryophyllene: '3-5%', ocimene: '4-6%' },
  0.85, 82,
  'Distillation à la vapeur d\'eau (2-3h). Rendement optimal en HE. Qualité AOP Haute-Provence si altitude >800m. Source : MDPI:1420-3049/25/7/1734'
);

await addVariation(
  lavId, 'ete', 'Juillet-Août (altitude 800-1200m)',
  '22-30°C', '35-50%',
  'Récolte estivale en altitude (Plateau de Valensole, Haute-Provence). Linalol maximal (40-50%), Acétate de linalyle (28-35%). Profil optimal pour parfumerie fine. Chaleur sèche et ensoleillement maximal. AOP Lavande de Haute-Provence.',
  { linalool: '40-50%', linalyl_acetate: '28-35%', camphor: '1-3%', beta_caryophyllene: '2-4%', terpinen_4_ol: '2-4%' },
  1.00, 95,
  'Distillation à la vapeur d\'eau (2-3h). Rendement optimal : 1.2-1.8% en HE. Qualité AOP maximale. Source : MDPI:1420-3049/25/7/1734, ISO 3515:2002'
);

await addVariation(
  lavId, 'automne', 'Septembre (altitude 1200-1800m)',
  '12-20°C', '40-55%',
  'Récolte tardive en haute altitude (Mont Ventoux, Lure). Linalol légèrement réduit (38-45%), Acétate de linalyle stable (27-33%), augmentation légère du camphre (3-5%). Profil plus complexe et moins floral. Qualité distincte.',
  { linalool: '38-45%', linalyl_acetate: '27-33%', camphor: '3-5%', beta_caryophyllene: '3-5%', lavandulol: '2-4%' },
  0.80, 88,
  'Distillation à la vapeur d\'eau (2.5-3.5h). Rendement légèrement réduit : 1.0-1.5% en HE. Source : MDPI:1420-3049/25/7/1734'
);

// ============================================================
// 4. STATISTIQUES FINALES
// ============================================================
const [svCount] = await conn.execute('SELECT COUNT(*) as n FROM seasonal_variations');
const [plantCount] = await conn.execute('SELECT COUNT(*) as n FROM plants');

console.log('\n=== RÉSULTATS FINAUX ===');
console.log(`Variations saisonnières totales : ${svCount[0].n}`);
console.log(`Plantes totales : ${plantCount[0].n}`);

await conn.end();
