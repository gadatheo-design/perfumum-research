/**
 * Audit : identifier les plantes classées comme molécules et vice-versa
 * Critères :
 * - Une "molécule" est une plante si : son nom contient un nom de plante connu,
 *   ou si sa famille chimique est vide/générique et son nom ressemble à une espèce botanique
 * - Une "plante" est une molécule si : son nom est un nom de composé chimique pur
 */
import mysql from 'mysql2/promise';

const conn = await mysql.createConnection(process.env.DATABASE_URL);

// ============================================================
// 1. Molécules qui ressemblent à des plantes
// ============================================================
console.log('\n=== MOLÉCULES RESSEMBLANT À DES PLANTES ===\n');

// Noms de plantes connus dans la table molecules
const plantKeywords = [
  'combava', 'bergamot', 'bergamote', 'lavande', 'lavender', 'rose', 'jasmin', 'jasmine',
  'ylang', 'vetiver', 'vétiver', 'patchouli', 'sandalwood', 'santal', 'cedar', 'cèdre',
  'frankincense', 'encens', 'myrrhe', 'myrrh', 'neroli', 'néroli', 'orange', 'citron',
  'lemon', 'lime', 'grapefruit', 'pamplemousse', 'mandarin', 'mandarine', 'tangerine',
  'mint', 'menthe', 'eucalyptus', 'tea tree', 'thyme', 'thym', 'rosemary', 'romarin',
  'basil', 'basilic', 'oregano', 'origan', 'chamomile', 'camomille', 'fennel', 'fenouil',
  'ginger', 'gingembre', 'turmeric', 'curcuma', 'clove', 'girofle', 'cinnamon', 'cannelle',
  'cardamom', 'cardamome', 'pepper', 'poivre', 'cannabis', 'hemp', 'tobacco', 'tabac',
  'absolute', 'absolue', 'oil', 'huile', 'extract', 'extrait', 'concrete', 'concrète',
  'resinoid', 'résinoïde', 'tincture', 'teinture', 'infusion', 'decoction', 'décoction',
  'JASMINE ABSOLUTE', 'FRANKINCENSE OIL', 'CEDARWOOD OIL', 'SANDALWOOD OIL',
  'Italian Bergamot Oil', 'Neroli Bouquetier', 'Rose de Damas', 'Tubéreuse Absolue',
  'Tangerine Dream', 'Acapulco Gold'
];

const plantLike = [];
for (const kw of plantKeywords) {
  const [rows] = await conn.execute(
    `SELECT id, name, chemicalFamily, therapeuticProperties, formula
     FROM molecules 
     WHERE LOWER(name) LIKE ? 
     AND (formula IS NULL OR formula = '' OR formula NOT LIKE 'C%')
     LIMIT 10`,
    ['%' + kw.toLowerCase() + '%']
  );
  for (const r of rows) {
    if (!plantLike.find(p => p.id === r.id)) {
      plantLike.push(r);
    }
  }
}

console.log('Molécules ressemblant à des plantes (' + plantLike.length + '):');
plantLike.forEach(m => {
  console.log(`  [${m.id}] ${m.name} | famille: ${m.chemicalFamily || 'VIDE'} | formule: ${m.formula || 'VIDE'}`);
});

// ============================================================
// 2. Molécules avec noms commerciaux / mélanges
// ============================================================
console.log('\n=== MOLÉCULES AVEC NOMS COMMERCIAUX / MÉLANGES ===\n');

const [commercial] = await conn.execute(`
  SELECT id, name, chemicalFamily, formula
  FROM molecules
  WHERE (
    name LIKE '%OIL%' OR name LIKE '%ABSOLUTE%' OR name LIKE '%EXTRACT%' OR
    name LIKE '%oil%' OR name LIKE '%absolute%' OR name LIKE '%extract%' OR
    name LIKE '%résine%' OR name LIKE '%resin%' OR name LIKE '%mix%' OR
    name LIKE '%mélange%' OR name LIKE '%blend%' OR name LIKE '%fraction%' OR
    name LIKE '%profil%' OR name LIKE '%traces%' OR name LIKE '%supposé%'
  )
  AND (formula IS NULL OR formula = '' OR formula NOT LIKE 'C%H%')
  ORDER BY name
  LIMIT 50
`);

console.log('Entrées commerciales/mélanges (' + commercial.length + '):');
commercial.forEach(m => {
  console.log(`  [${m.id}] ${m.name} | famille: ${m.chemicalFamily || 'VIDE'}`);
});

// ============================================================
// 3. Molécules sans formule chimique et sans famille
// ============================================================
console.log('\n=== MOLÉCULES SANS FORMULE NI FAMILLE (suspects) ===\n');

const [noFormula] = await conn.execute(`
  SELECT id, name, chemicalFamily, formula, therapeuticProperties
  FROM molecules
  WHERE (formula IS NULL OR formula = '')
  AND (chemicalFamily IS NULL OR chemicalFamily = '')
  AND (therapeuticProperties IS NULL OR therapeuticProperties = '')
  ORDER BY name
  LIMIT 30
`);

console.log('Molécules sans formule ni famille (' + noFormula.length + '):');
noFormula.forEach(m => {
  console.log(`  [${m.id}] ${m.name}`);
});

// ============================================================
// 4. Plantes avec noms ressemblant à des molécules
// ============================================================
console.log('\n=== PLANTES RESSEMBLANT À DES MOLÉCULES ===\n');

const molKeywords = [
  'linalool', 'limonene', 'myrcene', 'pinene', 'terpene', 'terpène',
  'aldehyde', 'aldéhyde', 'ketone', 'cétone', 'ester', 'oxide', 'oxyde',
  'alcohol', 'alcool', 'phenol', 'phénol', 'acid', 'acide',
  'methyl', 'ethyl', 'propyl', 'butyl', 'hexyl', 'octyl',
  'benzene', 'benzène', 'toluene', 'xylene', 'naphthalene',
  'hydrocarbon', 'hydrocarbure', 'monoterpene', 'sesquiterpene',
];

const molLike = [];
for (const kw of molKeywords) {
  const [rows] = await conn.execute(
    `SELECT id, name, latin_name, category, family
     FROM plants 
     WHERE LOWER(name) LIKE ? OR LOWER(latin_name) LIKE ?
     LIMIT 5`,
    ['%' + kw.toLowerCase() + '%', '%' + kw.toLowerCase() + '%']
  );
  for (const r of rows) {
    if (!molLike.find(p => p.id === r.id)) {
      molLike.push(r);
    }
  }
}

console.log('Plantes ressemblant à des molécules (' + molLike.length + '):');
molLike.forEach(p => {
  console.log(`  [${p.id}] ${p.name} | latin: ${p.latin_name || 'VIDE'} | catégorie: ${p.category || 'VIDE'}`);
});

// ============================================================
// 5. Statistiques globales
// ============================================================
console.log('\n=== STATISTIQUES ===\n');
const [molTotal] = await conn.execute('SELECT COUNT(*) as n FROM molecules');
const [plantTotal] = await conn.execute('SELECT COUNT(*) as n FROM plants');
const [molNoFormula] = await conn.execute('SELECT COUNT(*) as n FROM molecules WHERE formula IS NULL OR formula = ""');
const [molNoFamily] = await conn.execute('SELECT COUNT(*) as n FROM molecules WHERE chemicalFamily IS NULL OR chemicalFamily = ""');

console.log('Total molécules:', molTotal[0].n);
console.log('Total plantes:', plantTotal[0].n);
console.log('Molécules sans formule:', molNoFormula[0].n);
console.log('Molécules sans famille:', molNoFamily[0].n);
console.log('Suspects plante-dans-molécule:', plantLike.length);
console.log('Suspects molécule-dans-plante:', molLike.length);

await conn.end();
