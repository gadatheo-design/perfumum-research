import mysql from 'mysql2/promise';
const conn = await mysql.createConnection(process.env.DATABASE_URL);

// Chercher les IDs des molécules clés
async function getMolId(name) {
  const [rows] = await conn.execute('SELECT id FROM molecules WHERE name LIKE ? LIMIT 1', ['%' + name + '%']);
  return rows.length > 0 ? rows[0].id : null;
}

// Synergies de MASQUAGE documentées (une molécule atténue/cache une autre)
const maskingSynergies = [
  // Vanilline masque les notes soufrées
  { m1: 'Vanillin', m2: 'Dimethyl sulfide', type: 'masquage',
    desc: 'La vanilline masque les notes soufrées désagréables du diméthylsulfure. Utilisé en parfumerie pour adoucir les accords animaliques.',
    mech: 'Compétition au niveau des récepteurs olfactifs OR1A1 et OR2W1. La vanilline à haute concentration sature les récepteurs et réduit la perception du soufre.',
    app: 'Parfumerie fine, correction de formules animaliques, tabac' },
  // Linalool masque les notes vertes
  { m1: 'Linalool', m2: 'cis-3-Hexenol', type: 'masquage',
    desc: 'Le linalol atténue les notes vertes coupées du cis-3-hexénol. Crée un équilibre floral-vert plus harmonieux.',
    mech: 'Modulation allostérique des récepteurs olfactifs. Le linalol agit comme modulateur négatif des récepteurs sensibles aux alcools verts.',
    app: 'Parfums floraux, eaux de toilette printanières, cosmétiques' },
  // Géraniol masque les notes indoliques
  { m1: 'Geraniol', m2: 'Indole', type: 'masquage',
    desc: 'Le géraniol adoucit les notes indoliques animales/fécales de l\'indole. Transforme un accord animal en floral sophistiqué.',
    mech: 'Compétition réceptorielle et interaction moléculaire. Le géraniol réduit la volatilité de l\'indole par formation de complexes hydrophobes.',
    app: 'Parfums floraux orientaux, jasmin synthétique, cosmétiques' },
  // Citronellol masque les notes camphrées
  { m1: 'Citronellol', m2: 'Camphre', type: 'masquage',
    desc: 'Le citronellol atténue les notes camphrées médicinales du camphre. Rend les formules à base de camphre plus acceptables.',
    mech: 'Dilution perceptive et compétition au niveau des récepteurs TRPM8 et olfactifs.',
    app: 'Produits pharmaceutiques, cosmétiques, parfums frais' },
  // Benzyl acetate masque les notes acides
  { m1: 'Benzyl acetate', m2: 'Acetic acid', type: 'masquage',
    desc: 'L\'acétate de benzyle masque les notes acides piquantes de l\'acide acétique. Transforme un accord vinaigré en floral fruité.',
    mech: 'Compétition olfactive directe. L\'acétate de benzyle à concentration élevée supprime la perception des acides carboxyliques courts.',
    app: 'Parfumerie florale, produits ménagers, cosmétiques' },
  // Coumarin masque les notes animales
  { m1: 'Coumarin', m2: 'Civetone', type: 'masquage',
    desc: 'La coumarine adoucit et "poudre" les notes animales de la civétone. Classique des fougères et orientaux.',
    mech: 'Interaction moléculaire et modulation de la volatilité. La coumarine forme des complexes avec les macrolides réduisant leur perception brute.',
    app: 'Fougères, orientaux, parfums masculins classiques' },
  // Iso E Super masque les notes boisées sèches
  { m1: 'Cedryl acetate', m2: 'Vetiverol', type: 'masquage',
    desc: 'L\'acétate de cédryle adoucit les notes terreuses fumées du vétiverol. Crée un boisé plus élégant et accessible.',
    mech: 'Modulation perceptive par compétition réceptorielle. Les acétates terpéniques réduisent la perception des alcools sesquiterpéniques lourds.',
    app: 'Parfums boisés masculins, fonds de parfums, eaux de cologne' },
  // Eugenol masque les notes phénoliques
  { m1: 'Eugenol', m2: 'Guaiacol', type: 'masquage',
    desc: 'L\'eugénol atténue les notes phénoliques fumées du gaïacol. Transforme un accord fumé brut en épicé chaleureux.',
    mech: 'Compétition au niveau des récepteurs OR2W1 et OR1G1 sensibles aux phénols.',
    app: 'Parfums orientaux épicés, tabac, produits alimentaires' },
];

// Synergies de NEUTRALISATION documentées (annulation mutuelle)
const neutralSynergies = [
  // Linalool + Limonene = neutralisation partielle
  { m1: 'Linalool', m2: 'Limonene', type: 'neutralisation',
    desc: 'À concentrations équimolaires, le linalol et le limonène s\'annulent partiellement. L\'accord résultant est moins floral et moins citronné que chacun séparément.',
    mech: 'Inhibition compétitive au niveau des récepteurs olfactifs partagés. Les deux molécules se disputent les mêmes sites de liaison sur OR2T11 et OR1A2.',
    app: 'Équilibrage de formules, réduction de la dominance d\'une note' },
  // Camphre + Menthol = neutralisation
  { m1: 'Camphre', m2: 'Menthol', type: 'neutralisation',
    desc: 'Le camphre et le menthol à concentrations égales se neutralisent mutuellement. L\'effet rafraîchissant du menthol est réduit par le camphre.',
    mech: 'Compétition au niveau du canal TRPM8 (récepteur du froid). Les deux molécules sont agonistes de TRPM8 mais avec des cinétiques différentes, créant une inhibition mutuelle.',
    app: 'Formulation pharmaceutique, cosmétiques, produits dentaires' },
  // Indole + Rose oxide = neutralisation
  { m1: 'Indole', m2: 'Rose oxide', type: 'neutralisation',
    desc: 'L\'indole et l\'oxyde de rose se neutralisent à concentrations élevées. L\'accord perd ses caractéristiques distinctives des deux molécules.',
    mech: 'Inhibition compétitive sur les récepteurs olfactifs OR51E2 et OR2T11.',
    app: 'Parfumerie florale, jasmin, rose' },
];

let created = 0;
let skipped = 0;

const allSynergies = [...maskingSynergies, ...neutralSynergies];

for (const syn of allSynergies) {
  const id1 = await getMolId(syn.m1);
  const id2 = await getMolId(syn.m2);
  
  if (!id1 || !id2) {
    console.log('Molécule non trouvée: ' + syn.m1 + ' (' + (id1||'?') + ') ou ' + syn.m2 + ' (' + (id2||'?') + ')');
    skipped++;
    continue;
  }
  
  // Vérifier si la synergie existe déjà
  const [ex] = await conn.execute(
    'SELECT id FROM molecule_synergies WHERE (molecule1_id = ? AND molecule2_id = ?) OR (molecule1_id = ? AND molecule2_id = ?) LIMIT 1',
    [id1, id2, id2, id1]
  );
  
  if (ex.length > 0) { skipped++; continue; }
  
  await conn.execute(
    'INSERT INTO molecule_synergies (molecule1_id, molecule2_id, type, description, chemical_mechanism, applications, createdAt) VALUES (?,?,?,?,?,?,NOW())',
    [id1, id2, syn.type, syn.desc, syn.mech, syn.app]
  );
  created++;
  console.log('✓ ' + syn.type + ': ' + syn.m1 + ' + ' + syn.m2);
}

console.log('\nCréées: ' + created + ' | Ignorées: ' + skipped);
const [[cnt]] = await conn.execute('SELECT type, COUNT(*) as n FROM molecule_synergies GROUP BY type');
console.log('Distribution: ' + JSON.stringify(cnt));

// Afficher toutes les distributions
const [types] = await conn.execute('SELECT type, COUNT(*) as n FROM molecule_synergies GROUP BY type');
types.forEach(r => console.log('  ' + r.type + ': ' + r.n));

await conn.end();
