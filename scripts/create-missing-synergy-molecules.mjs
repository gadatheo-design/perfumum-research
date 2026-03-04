import mysql from 'mysql2/promise';
const conn = await mysql.createConnection(process.env.DATABASE_URL);

const missing = [
  ['Dimethyl sulfide','C2H6S','sulfure',['antibacterien'],'Soufré, légumes cuits, chou','Allium sativum, Brassica oleracea'],
  ['cis-3-Hexenol','C6H12O','alcool aliphatique',['antibacterien','insectifuge'],'Herbe coupée, vert, frais','Herbe fraîche (ubiquitaire)'],
  ['Geraniol','C10H18O','alcool monoterpenique',['antibacterien','antifongique','insectifuge','anti-inflammatoire'],'Rose, géranium, fruité, doux','Pelargonium graveolens, Rosa spp., Cymbopogon martinii'],
  ['Acetic acid','C2H4O2','acide carboxylique',['antibacterien','antifongique'],'Vinaigre, acide, piquant','Ubiquitaire (fermentation)'],
  ['Eugenol','C10H12O2','phenylpropanoide',['antibacterien','antifongique','anti-inflammatoire','analgesique','antioxydant'],'Clou de girofle, épicé, chaud','Syzygium aromaticum, Ocimum basilicum, Cinnamomum verum'],
];

let created = 0;
for (const [name, formula, family, tp, olf, src] of missing) {
  const [ex] = await conn.execute('SELECT id FROM molecules WHERE name = ? LIMIT 1', [name]);
  if (ex.length > 0) {
    console.log('Déjà en base: ' + name + ' (id:' + ex[0].id + ')');
    continue;
  }
  const [res] = await conn.execute(
    'INSERT INTO molecules (name, formula, family, therapeuticProperties, olfactiveProfile, botanicalSources, createdAt, updatedAt) VALUES (?,?,?,?,?,?,NOW(),NOW())',
    [name, formula, family, JSON.stringify(tp), olf, src]
  );
  console.log('Créé: ' + name + ' (id:' + res.insertId + ')');
  created++;
}

console.log('Total créées: ' + created);

// Maintenant créer les synergies manquantes
const synergies = [
  { m1: 'Vanillin', m2: 'Dimethyl sulfide', type: 'masquage',
    desc: 'La vanilline masque les notes soufrées désagréables du diméthylsulfure. Utilisé en parfumerie pour adoucir les accords animaliques.',
    mech: 'Compétition au niveau des récepteurs olfactifs OR1A1 et OR2W1. La vanilline à haute concentration sature les récepteurs et réduit la perception du soufre.',
    app: 'Parfumerie fine, correction de formules animaliques, tabac' },
  { m1: 'Linalool', m2: 'cis-3-Hexenol', type: 'masquage',
    desc: 'Le linalol atténue les notes vertes coupées du cis-3-hexénol. Crée un équilibre floral-vert plus harmonieux.',
    mech: 'Modulation allostérique des récepteurs olfactifs. Le linalol agit comme modulateur négatif des récepteurs sensibles aux alcools verts.',
    app: 'Parfums floraux, eaux de toilette printanières, cosmétiques' },
  { m1: 'Geraniol', m2: 'Indole', type: 'masquage',
    desc: 'Le géraniol adoucit les notes indoliques animales/fécales de l\'indole. Transforme un accord animal en floral sophistiqué.',
    mech: 'Compétition réceptorielle et interaction moléculaire. Le géraniol réduit la volatilité de l\'indole par formation de complexes hydrophobes.',
    app: 'Parfums floraux orientaux, jasmin synthétique, cosmétiques' },
  { m1: 'Benzyl acetate', m2: 'Acetic acid', type: 'masquage',
    desc: 'L\'acétate de benzyle masque les notes acides piquantes de l\'acide acétique. Transforme un accord vinaigré en floral fruité.',
    mech: 'Compétition olfactive directe. L\'acétate de benzyle à concentration élevée supprime la perception des acides carboxyliques courts.',
    app: 'Parfumerie florale, produits ménagers, cosmétiques' },
  { m1: 'Eugenol', m2: 'Guaiacol', type: 'masquage',
    desc: 'L\'eugénol atténue les notes phénoliques fumées du gaïacol. Transforme un accord fumé brut en épicé chaleureux.',
    mech: 'Compétition au niveau des récepteurs OR2W1 et OR1G1 sensibles aux phénols.',
    app: 'Parfums orientaux épicés, tabac, produits alimentaires' },
];

for (const syn of synergies) {
  const [r1] = await conn.execute('SELECT id FROM molecules WHERE name = ? LIMIT 1', [syn.m1]);
  const [r2] = await conn.execute('SELECT id FROM molecules WHERE name = ? LIMIT 1', [syn.m2]);
  if (!r1.length || !r2.length) { console.log('Molécule manquante: ' + syn.m1 + ' ou ' + syn.m2); continue; }
  const id1 = r1[0].id, id2 = r2[0].id;
  const [ex] = await conn.execute('SELECT id FROM molecule_synergies WHERE (molecule1_id = ? AND molecule2_id = ?) OR (molecule1_id = ? AND molecule2_id = ?) LIMIT 1', [id1, id2, id2, id1]);
  if (ex.length > 0) { console.log('Synergie déjà en base: ' + syn.m1 + ' + ' + syn.m2); continue; }
  await conn.execute('INSERT INTO molecule_synergies (molecule1_id, molecule2_id, type, description, chemical_mechanism, applications, createdAt) VALUES (?,?,?,?,?,?,NOW())', [id1, id2, syn.type, syn.desc, syn.mech, syn.app]);
  console.log('✓ ' + syn.type + ': ' + syn.m1 + ' + ' + syn.m2);
}

const [types] = await conn.execute('SELECT type, COUNT(*) as n FROM molecule_synergies GROUP BY type');
console.log('\nDistribution finale:');
types.forEach(r => console.log('  ' + r.type + ': ' + r.n));

await conn.end();
