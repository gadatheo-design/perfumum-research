import mysql from 'mysql2/promise';
const conn = await mysql.createConnection(process.env.DATABASE_URL);

// Colonnes réelles : percentage_min, percentage_max, percentage_typical, percentage, role, source
// Valeurs enum role : 'majeur','secondaire','trace','variable'

// D'abord créer les molécules manquantes
const newMolecules = [
  { name: '2-Phénylethanol', formula: 'C8H10O', family: 'alcool aromatique', therapeutic: JSON.stringify(['antibacterien','antifongique','antioxydant']), olfactive: 'Rose, miel, doux, floral', sources: 'Rosa damascena, Rosa centifolia' },
  { name: 'Citronellol', formula: 'C10H20O', family: 'monoterpene alcool', therapeutic: JSON.stringify(['antibacterien','antifongique','anti-inflammatoire','insectifuge']), olfactive: 'Rose, citronné, frais', sources: 'Rosa damascena, Pelargonium graveolens, Cymbopogon nardus' },
  { name: 'Nerol', formula: 'C10H18O', family: 'monoterpene alcool', therapeutic: JSON.stringify(['antibacterien','antifongique','sedatif']), olfactive: 'Rose, citronné, doux', sources: 'Rosa damascena, Neroli, Lemongrass' },
  { name: 'Linalyl acetate', formula: 'C12H20O2', family: 'ester monoterpenique', therapeutic: JSON.stringify(['sedatif','anxiolytique','antispasmodique','anti-inflammatoire']), olfactive: 'Lavande, bergamote, floral, frais', sources: 'Lavandula angustifolia, Citrus bergamia, Salvia sclarea' },
  { name: 'Bergapten', formula: 'C12H8O4', family: 'coumarine', therapeutic: JSON.stringify(['photosensibilisant','antipsoriatique','antifongique']), olfactive: 'Inodore (phototoxique)', sources: 'Citrus bergamia, Citrus limon, Petroselinum crispum' },
  { name: 'Nonadecane', formula: 'C19H40', family: 'alcane', therapeutic: JSON.stringify(['emollient']), olfactive: 'Cire, neutre', sources: 'Rosa damascena, Rosa centifolia' },
  { name: 'Phytol', formula: 'C20H40O', family: 'diterpene alcool', therapeutic: JSON.stringify(['antioxydant','anti-inflammatoire','immunomodulateur']), olfactive: 'Floral, herbacé, doux', sources: 'Jasminum grandiflorum, Chlorophylle (ubiquitaire)' },
  { name: 'Indole', formula: 'C8H7N', family: 'indole', therapeutic: JSON.stringify(['antibacterien faible','neurologique']), olfactive: 'Jasmin, floral, animal, fécal à haute concentration', sources: 'Jasminum grandiflorum, Jasminum sambac, Narcissus' },
  { name: 'Methyl jasmonate', formula: 'C13H20O3', family: 'jasmonate', therapeutic: JSON.stringify(['anticancereux etudes','anti-inflammatoire','inducteur apoptose']), olfactive: 'Jasmin, floral, fruité', sources: 'Jasminum grandiflorum, Jasminum sambac' },
  { name: 'Germacrene D', formula: 'C15H24', family: 'sesquiterpene', therapeutic: JSON.stringify(['antibacterien','antifongique','insectifuge']), olfactive: 'Boisé, terreux, épicé', sources: 'Cananga odorata, Pelargonium graveolens, Cannabis sativa' },
  { name: 'p-Cresyl methyl ether', formula: 'C8H10O', family: 'ether aromatique', therapeutic: JSON.stringify(['antibacterien faible']), olfactive: 'Ylang-ylang, floral, animal, phénolique', sources: 'Cananga odorata' },
  { name: 'beta-Ocimene', formula: 'C10H16', family: 'monoterpene', therapeutic: JSON.stringify(['antibacterien','antifongique','anti-inflammatoire']), olfactive: 'Herbe, floral, doux, citronné', sources: 'Lavandula angustifolia, Ocimum basilicum, Cannabis sativa' },
];

let molsCreated = 0;
const molCache = {};

for (const mol of newMolecules) {
  const [ex] = await conn.execute('SELECT id FROM molecules WHERE name = ? LIMIT 1', [mol.name]);
  if (ex.length > 0) {
    molCache[mol.name] = ex[0].id;
    continue;
  }
  const [res] = await conn.execute(
    'INSERT INTO molecules (name, formula, chemicalFamily, therapeuticProperties, olfactiveProfile, botanicalSources, createdAt, updatedAt) VALUES (?,?,?,?,?,?,NOW(),NOW())',
    [mol.name, mol.formula, mol.family, mol.therapeutic, mol.olfactive, mol.sources]
  );
  molCache[mol.name] = res.insertId;
  molsCreated++;
  console.log('+ Créé: ' + mol.name + ' (id:' + res.insertId + ')');
}

// Mapper les noms vers IDs existants
const molMap = {
  '2-Phenylethanol': molCache['2-Phénylethanol'],
  'Citronellol': molCache['Citronellol'],
  'Geraniol': 810043,
  'Nerol': molCache['Nerol'],
  'Eugenol': null, // chercher
  'Linalool': 1260764,
  'Nonadecane': molCache['Nonadecane'],
  'beta-Damascenone': null,
  'Linalyl acetate': molCache['Linalyl acetate'],
  'Terpinen-4-ol': null,
  'Camphor': null,
  '1,8-Cineole': null,
  'Borneol': null,
  'beta-Ocimene': molCache['beta-Ocimene'],
  'Benzyl acetate': 570059,
  'Benzyl benzoate': 570060,
  'Phytol': molCache['Phytol'],
  'Indole': null,
  'Methyl jasmonate': molCache['Methyl jasmonate'],
  'Limonene': 810003,
  'beta-Pinene': null,
  'gamma-Terpinene': null,
  'Bergapten': molCache['Bergapten'],
  'Germacrene D': molCache['Germacrene D'],
  'beta-Caryophyllene': 810013,
  'p-Cresyl methyl ether': molCache['p-Cresyl methyl ether'],
};

// Chercher les molécules manquantes dans la base
const toFind = {
  'Eugenol': 'eugenol',
  'beta-Damascenone': 'damascenone',
  'Terpinen-4-ol': 'terpinen',
  'Camphor': 'camphre',
  '1,8-Cineole': 'cineole',
  'Borneol': 'borneol',
  'Indole': 'indole',
  'beta-Pinene': 'pinene',
  'gamma-Terpinene': 'terpinene',
};

for (const [key, term] of Object.entries(toFind)) {
  const [r] = await conn.execute('SELECT id, name FROM molecules WHERE name LIKE ? LIMIT 1', ['%'+term+'%']);
  if (r.length > 0) {
    molMap[key] = r[0].id;
  }
}

// Données GC-MS scientifiques
const gcmsData = [
  {
    plantKeywords: ['Rose de Damas', 'Rosa damascena', 'Damask'],
    molecules: [
      { name: '2-Phenylethanol', min: 55, typ: 65, max: 75, role: 'majeur', source: 'Baser & Buchbauer 2010, ISO 9842' },
      { name: 'Citronellol', min: 12, typ: 18, max: 25, role: 'majeur', source: 'ISO 9842' },
      { name: 'Geraniol', min: 5, typ: 10, max: 15, role: 'secondaire', source: 'ISO 9842' },
      { name: 'Nerol', min: 3, typ: 7, max: 12, role: 'secondaire', source: 'Baser & Buchbauer 2010' },
      { name: 'Eugenol', min: 0.5, typ: 1.5, max: 3, role: 'trace', source: 'Tisserand & Young 2014' },
      { name: 'Linalool', min: 1, typ: 2, max: 4, role: 'secondaire', source: 'ISO 9842' },
      { name: 'Nonadecane', min: 5, typ: 8, max: 12, role: 'secondaire', source: 'Baser & Buchbauer 2010' },
      { name: 'beta-Damascenone', min: 0.1, typ: 0.3, max: 0.8, role: 'trace', source: 'Baser & Buchbauer 2010' },
    ]
  },
  {
    plantKeywords: ['Rose de Mai', 'Rosa centifolia', 'centifolia'],
    molecules: [
      { name: '2-Phenylethanol', min: 60, typ: 68, max: 78, role: 'majeur', source: 'Baser & Buchbauer 2010' },
      { name: 'Citronellol', min: 8, typ: 14, max: 20, role: 'majeur', source: 'Baser & Buchbauer 2010' },
      { name: 'Geraniol', min: 3, typ: 7, max: 12, role: 'secondaire', source: 'Baser & Buchbauer 2010' },
      { name: 'Nerol', min: 2, typ: 5, max: 9, role: 'secondaire', source: 'Baser & Buchbauer 2010' },
      { name: 'Eugenol', min: 1, typ: 2, max: 4, role: 'secondaire', source: 'Baser & Buchbauer 2010' },
      { name: 'Linalool', min: 0.5, typ: 1.5, max: 3, role: 'trace', source: 'Baser & Buchbauer 2010' },
    ]
  },
  {
    plantKeywords: ['Lavande vraie', 'Lavandula angustifolia', 'angustifolia'],
    molecules: [
      { name: 'Linalool', min: 25, typ: 38, max: 45, role: 'majeur', source: 'ISO 3515, Tisserand & Young 2014' },
      { name: 'Linalyl acetate', min: 25, typ: 35, max: 45, role: 'majeur', source: 'ISO 3515' },
      { name: 'Terpinen-4-ol', min: 2, typ: 4, max: 6, role: 'secondaire', source: 'ISO 3515' },
      { name: 'Camphor', min: 0.5, typ: 1.5, max: 3, role: 'trace', source: 'ISO 3515' },
      { name: 'beta-Ocimene', min: 2, typ: 4, max: 7, role: 'secondaire', source: 'Tisserand & Young 2014' },
      { name: '1,8-Cineole', min: 0.5, typ: 1, max: 2.5, role: 'trace', source: 'ISO 3515' },
      { name: 'Borneol', min: 0.5, typ: 1.5, max: 3, role: 'trace', source: 'ISO 3515' },
    ]
  },
  {
    plantKeywords: ['Lavandin', 'Lavandula intermedia', 'intermedia'],
    molecules: [
      { name: 'Linalool', min: 20, typ: 28, max: 38, role: 'majeur', source: 'ISO 8902' },
      { name: 'Linalyl acetate', min: 18, typ: 28, max: 38, role: 'majeur', source: 'ISO 8902' },
      { name: 'Camphor', min: 5, typ: 9, max: 14, role: 'secondaire', source: 'ISO 8902' },
      { name: '1,8-Cineole', min: 4, typ: 7, max: 11, role: 'secondaire', source: 'ISO 8902' },
      { name: 'Borneol', min: 1, typ: 2.5, max: 4, role: 'secondaire', source: 'ISO 8902' },
      { name: 'Terpinen-4-ol', min: 1, typ: 2, max: 4, role: 'trace', source: 'ISO 8902' },
    ]
  },
  {
    plantKeywords: ['Jasmin grandiflore', 'Jasminum grandiflorum', 'grandiflorum'],
    molecules: [
      { name: 'Benzyl acetate', min: 15, typ: 22, max: 30, role: 'majeur', source: 'Baser & Buchbauer 2010, ISO 9843' },
      { name: 'Linalool', min: 10, typ: 16, max: 22, role: 'majeur', source: 'ISO 9843' },
      { name: 'Benzyl benzoate', min: 8, typ: 14, max: 20, role: 'secondaire', source: 'ISO 9843' },
      { name: 'Phytol', min: 5, typ: 9, max: 14, role: 'secondaire', source: 'Baser & Buchbauer 2010' },
      { name: 'Indole', min: 1, typ: 2.5, max: 5, role: 'trace', source: 'Baser & Buchbauer 2010' },
      { name: 'Eugenol', min: 1, typ: 2, max: 4, role: 'secondaire', source: 'ISO 9843' },
      { name: 'Methyl jasmonate', min: 0.5, typ: 1.5, max: 3, role: 'trace', source: 'Baser & Buchbauer 2010' },
    ]
  },
  {
    plantKeywords: ['Jasmin arabique', 'Jasminum sambac', 'sambac'],
    molecules: [
      { name: 'Benzyl acetate', min: 20, typ: 28, max: 38, role: 'majeur', source: 'Baser & Buchbauer 2010' },
      { name: 'Linalool', min: 8, typ: 14, max: 20, role: 'majeur', source: 'Baser & Buchbauer 2010' },
      { name: 'Benzyl benzoate', min: 5, typ: 10, max: 16, role: 'secondaire', source: 'Baser & Buchbauer 2010' },
      { name: 'Indole', min: 1.5, typ: 3, max: 6, role: 'trace', source: 'Baser & Buchbauer 2010' },
      { name: 'Eugenol', min: 0.5, typ: 1.5, max: 3, role: 'trace', source: 'Baser & Buchbauer 2010' },
    ]
  },
  {
    plantKeywords: ['Bergamote', 'Citrus bergamia', 'bergamia'],
    molecules: [
      { name: 'Limonene', min: 25, typ: 35, max: 45, role: 'majeur', source: 'ISO 3520, Tisserand & Young 2014' },
      { name: 'Linalyl acetate', min: 18, typ: 28, max: 38, role: 'majeur', source: 'ISO 3520' },
      { name: 'Linalool', min: 5, typ: 10, max: 15, role: 'secondaire', source: 'ISO 3520' },
      { name: 'beta-Pinene', min: 4, typ: 7, max: 10, role: 'secondaire', source: 'ISO 3520' },
      { name: 'gamma-Terpinene', min: 4, typ: 7, max: 10, role: 'secondaire', source: 'ISO 3520' },
      { name: 'Bergapten', min: 0.1, typ: 0.3, max: 0.5, role: 'trace', source: 'ISO 3520' },
    ]
  },
  {
    plantKeywords: ['Ylang-ylang', 'Cananga odorata', 'odorata'],
    molecules: [
      { name: 'Benzyl benzoate', min: 10, typ: 16, max: 22, role: 'majeur', source: 'ISO 3063, Baser & Buchbauer 2010' },
      { name: 'Linalool', min: 5, typ: 10, max: 18, role: 'majeur', source: 'ISO 3063' },
      { name: 'Benzyl acetate', min: 5, typ: 9, max: 14, role: 'secondaire', source: 'ISO 3063' },
      { name: 'Germacrene D', min: 8, typ: 14, max: 20, role: 'majeur', source: 'Baser & Buchbauer 2010' },
      { name: 'beta-Caryophyllene', min: 5, typ: 9, max: 14, role: 'secondaire', source: 'ISO 3063' },
      { name: 'p-Cresyl methyl ether', min: 3, typ: 6, max: 10, role: 'trace', source: 'Baser & Buchbauer 2010' },
    ]
  }
];

let totalUpdated = 0;
let totalCreated = 0;
let notFound = 0;

for (const plant of gcmsData) {
  // Trouver la plante
  let plantRow = null;
  for (const kw of plant.plantKeywords) {
    const [rows] = await conn.execute(
      'SELECT id, name FROM plants WHERE name LIKE ? OR latin_name LIKE ? LIMIT 1',
      ['%'+kw+'%', '%'+kw+'%']
    );
    if (rows.length > 0) { plantRow = rows[0]; break; }
  }
  
  if (!plantRow) {
    console.log('PLANTE NON TROUVÉE: ' + plant.plantKeywords[0]);
    notFound++;
    continue;
  }
  
  console.log('\n[' + plantRow.id + '] ' + plantRow.name);
  
  for (const mol of plant.molecules) {
    const molId = molMap[mol.name];
    if (!molId) {
      console.log('  MOL NON TROUVÉE: ' + mol.name);
      continue;
    }
    
    const [existing] = await conn.execute(
      'SELECT plant_id FROM plant_molecules WHERE plant_id = ? AND molecule_id = ?',
      [plantRow.id, molId]
    );
    
    if (existing.length > 0) {
      await conn.execute(
        'UPDATE plant_molecules SET percentage_min = ?, percentage_typical = ?, percentage_max = ?, percentage = ?, role = ?, source = ?, updated_at = NOW() WHERE plant_id = ? AND molecule_id = ?',
        [mol.min, mol.typ, mol.max, mol.typ, mol.role, mol.source, plantRow.id, molId]
      );
      console.log('  ✓ MAJ: ' + mol.name + ' ' + mol.typ + '% (' + mol.role + ')');
      totalUpdated++;
    } else {
      await conn.execute(
        'INSERT INTO plant_molecules (plant_id, molecule_id, percentage_min, percentage_typical, percentage_max, percentage, role, source, created_at, updated_at) VALUES (?,?,?,?,?,?,?,?,NOW(),NOW())',
        [plantRow.id, molId, mol.min, mol.typ, mol.max, mol.typ, mol.role, mol.source]
      );
      console.log('  + CRÉÉ: ' + mol.name + ' ' + mol.typ + '% (' + mol.role + ')');
      totalCreated++;
    }
  }
}

console.log('\n=== RÉSUMÉ ===');
console.log('Molécules créées: ' + molsCreated);
console.log('Liaisons mises à jour: ' + totalUpdated);
console.log('Liaisons créées: ' + totalCreated);
console.log('Plantes non trouvées: ' + notFound);

const [[stats]] = await conn.execute(
  "SELECT COUNT(*) as total, SUM(CASE WHEN percentage_typical > 5 THEN 1 ELSE 0 END) as precise FROM plant_molecules"
);
console.log('Couverture précise (>5%): ' + stats.precise + '/' + stats.total + ' (' + (stats.precise/stats.total*100).toFixed(1) + '%)');

await conn.end();
