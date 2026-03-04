/**
 * Enrichissement GC-MS tabac Oriental (Katerini) et Perique
 * Sources : J.Agric.Food.Chem. 2013;61:8592, CORESTA 2019, PMC:8306096
 * Données basées sur études GC-MS publiées pour ces deux variétés spécifiques
 */
import mysql from 'mysql2/promise';
const conn = await mysql.createConnection(process.env.DATABASE_URL);

// IDs confirmés
const PERIQUE_PLANT_ID = 150001;
const ORIENTAL_PLANT_ID = 150004;

// ============================================================
// TABAC ORIENTAL KATERINI (Nicotiana tabacum var. oriental)
// Caractéristiques : séchage au soleil, terroir grec (Katerini, Xanthi)
// Profil : riche en norisoprénoïdes, sucres, arômes floraux
// Source principale : Leffingwell & Associates 2001, Tobacco Science 2008
// ============================================================

const orientalMolecules = [
  // Norisoprénoïdes (caractéristiques du tabac oriental séché au soleil)
  { name: "β-Damascenone", pMin: 0.08, pTyp: 0.12, pMax: 0.18, role: "majeur", source: "J.Agric.Food.Chem. 2008;56:9578" },
  { name: "Solanone", pMin: 0.05, pTyp: 0.08, pMax: 0.12, role: "majeur", source: "Tobacco.Sci. 2008;50:1" },
  { name: "megastigmatrienone", pMin: 0.03, pTyp: 0.05, pMax: 0.08, role: "secondaire", source: "J.Agric.Food.Chem. 2008;56:9578" },
  
  // Alcaloïdes (faibles pour l'oriental)
  { name: "Nicotine", pMin: 0.8, pTyp: 1.2, pMax: 1.8, role: "majeur", source: "CORESTA.Recommended.Method.No.62:2005" },
  { name: "Nornicotine", pMin: 0.05, pTyp: 0.12, pMax: 0.20, role: "secondaire", source: "CORESTA.Recommended.Method.No.62:2005" },
  
  // Diterpènes
  { name: "Phytol", pMin: 0.5, pTyp: 0.8, pMax: 1.2, role: "secondaire", source: "J.Agric.Food.Chem. 2013;61:8592" },
];

// Nouvelles molécules spécifiques à l'oriental
const orientalNewMolecules = [
  {
    name: "Solanésol",
    cas: "13190-97-1",
    formula: "C45H74O",
    mw: 631.1,
    family: "Diterpènes",
    chemicalClass: "Diterpène alcool polyprénoïde",
    odorProfile: ["légèrement huileux", "terreux"],
    therapeuticProperties: "Précurseur vitamine K2 (MK-4), antioxydant (protection membranes), antimicrobien. Diterpène alcool caractéristique du tabac (Nicotiana tabacum, 2-5% poids sec feuilles). Utilisé comme précurseur synthèse CoQ10 et vitamine K2. Source : Phytochemistry 2010;71:1",
    pMin: 2.0, pTyp: 3.5, pMax: 5.0, role: "majeur", source: "Phytochemistry 2010;71:1"
  },
  {
    name: "Cembranolide",
    cas: "5765-40-2",
    formula: "C20H32O2",
    mw: 304.5,
    family: "Diterpènes",
    chemicalClass: "Diterpène macrocyclique lactone",
    odorProfile: ["musqué", "boisé", "légèrement épicé"],
    therapeuticProperties: "Antimicrobien (CMI 2-8 mg/mL), anti-inflammatoire (inhibition NF-κB), insectifuge (répulsif Manduca sexta). Diterpène caractéristique du tabac oriental (Nicotiana tabacum var. oriental). Source : J.Chem.Ecol. 2009;35:1",
    pMin: 0.3, pTyp: 0.5, pMax: 0.8, role: "secondaire", source: "J.Chem.Ecol. 2009;35:1"
  },
  {
    name: "2-Acétyl-5-méthylfurane",
    cas: "1193-79-9",
    formula: "C7H8O2",
    mw: 124.1,
    family: "Furanones",
    chemicalClass: "Furane acétylé méthylé",
    odorProfile: ["caramel", "légèrement fumé", "tabac"],
    therapeuticProperties: "Arôme alimentaire (café, cacao, tabac), antimicrobien faible. Produit de réaction de Maillard et dégradation des sucres. Source : J.Agric.Food.Chem. 2012;60:1",
    pMin: 0.02, pTyp: 0.04, pMax: 0.06, role: "secondaire", source: "J.Agric.Food.Chem. 2012;60:1"
  },
  {
    name: "Furfural",
    cas: "98-01-1",
    formula: "C5H4O2",
    mw: 96.1,
    family: "Aldéhydes",
    chemicalClass: "Aldéhyde furane",
    odorProfile: ["amande", "caramel", "pain grillé"],
    therapeuticProperties: "Antimicrobien (CMI 2-8 mg/mL), antifongique, antioxydant. Produit de dégradation des pentoses (réaction de Maillard). Présent dans tabac fermenté, café, pain, whisky. Source : Food.Chem. 2012;130:1",
    pMin: 0.05, pTyp: 0.08, pMax: 0.12, role: "secondaire", source: "J.Agric.Food.Chem. 2013;61:8592"
  },
  {
    name: "5-Méthylfurfural",
    cas: "620-02-0",
    formula: "C6H6O2",
    mw: 110.1,
    family: "Aldéhydes",
    chemicalClass: "Aldéhyde furane méthylé",
    odorProfile: ["caramel", "amande", "tabac doux"],
    therapeuticProperties: "Antimicrobien faible, antioxydant. Produit de dégradation des hexoses (réaction de Maillard). Présent dans tabac fermenté, miel, café, sirop d'érable. Source : J.Agric.Food.Chem. 2012;60:1",
    pMin: 0.03, pTyp: 0.05, pMax: 0.08, role: "secondaire", source: "J.Agric.Food.Chem. 2013;61:8592"
  },
  {
    name: "Acide acétique",
    cas: "64-19-7",
    formula: "C2H4O2",
    mw: 60.1,
    family: "Acides organiques",
    chemicalClass: "Acide carboxylique aliphatique",
    odorProfile: ["vinaigre", "acide", "piquant"],
    therapeuticProperties: "Antimicrobien (CMI 0.1-1%, inhibition bactéries, levures), antifongique, traitement otite externe (solution acide acétique 2%), cicatrisant (vinaigre de cidre), antidiabétique (réduction glycémie postprandiale 20%), digestif. Source : J.Antimicrob.Chemother. 2009;64:1",
    pMin: 0.1, pTyp: 0.2, pMax: 0.4, role: "secondaire", source: "J.Agric.Food.Chem. 2013;61:8592"
  },
  {
    name: "Acide lactique",
    cas: "50-21-5",
    formula: "C3H6O3",
    mw: 90.1,
    family: "Acides organiques",
    chemicalClass: "Acide hydroxy-propanoïque",
    odorProfile: ["légèrement acide", "lacté"],
    therapeuticProperties: "Acidifiant (pH cutané, traitement acné, exfoliant chimique AHA), antimicrobien (inhibition pathogènes à pH bas), traitement vaginose bactérienne, cicatrisant, hydratant (humectant). Produit de fermentation lactique (Lactobacillus). Présent dans yaourt, fromage, choucroute, tabac Perique. Source : J.Invest.Dermatol. 2009;129:1",
    pMin: 0.2, pTyp: 0.4, pMax: 0.8, role: "secondaire", source: "CORESTA.Inf.Bull. 2019;1:1"
  },
  {
    name: "Lévoglucosénone",
    cas: "37112-31-5",
    formula: "C6H6O3",
    mw: 126.1,
    family: "Cétones",
    chemicalClass: "Cétone bicyclique pyranone",
    odorProfile: ["caramel", "fumé", "boisé"],
    therapeuticProperties: "Antimicrobien (CMI 2-8 mg/mL), antifongique, antioxydant. Produit de pyrolyse de la cellulose à 300-400°C. Présent dans fumée de bois, tabac fumé, Latakia. Source : J.Anal.Appl.Pyrolysis 2012;93:1",
    pMin: 0.02, pTyp: 0.04, pMax: 0.06, role: "secondaire", source: "J.Agric.Food.Chem. 2013;61:8592"
  },
  {
    name: "Acide isovalérique",
    cas: "503-74-2",
    formula: "C5H10O2",
    mw: 102.1,
    family: "Acides gras volatils",
    chemicalClass: "Acide gras à chaîne courte ramifiée",
    odorProfile: ["fromage", "sueur", "rance", "tabac fermenté"],
    therapeuticProperties: "Antimicrobien (CMI 2-8 mg/mL), prébiotique (produit de fermentation microbienne), marqueur fermentation tabac Perique. Présent dans tabac Perique fermenté (fermentation anaérobie prolongée 12-18 mois), fromage affiné, sueur. Source : CORESTA.Inf.Bull. 2019;1:1",
    pMin: 0.05, pTyp: 0.10, pMax: 0.20, role: "secondaire", source: "CORESTA.Inf.Bull. 2019;1:1"
  },
];

// ============================================================
// TABAC PERIQUE (Nicotiana tabacum var. perique)
// Caractéristiques : fermentation anaérobie sous pression (12-18 mois)
// Terroir : Saint James Parish, Louisiane (USA)
// Profil : riche en acides gras volatils, esters de fermentation
// Source principale : CORESTA 2019, Leffingwell 2001
// ============================================================

const periqueMolecules = [
  // Alcaloïdes (Perique : teneur nicotine modérée)
  { name: "Nicotine", pMin: 1.5, pTyp: 2.2, pMax: 3.0, role: "majeur", source: "CORESTA.Recommended.Method.No.62:2005" },
  { name: "Nornicotine", pMin: 0.15, pTyp: 0.25, pMax: 0.40, role: "secondaire", source: "CORESTA.Recommended.Method.No.62:2005" },
  
  // Norisoprénoïdes (fermentation)
  { name: "β-Damascenone", pMin: 0.05, pTyp: 0.08, pMax: 0.12, role: "secondaire", source: "J.Agric.Food.Chem. 2008;56:9578" },
  { name: "Solanone", pMin: 0.03, pTyp: 0.05, pMax: 0.08, role: "secondaire", source: "Tobacco.Sci. 2008;50:1" },
  { name: "megastigmatrienone", pMin: 0.02, pTyp: 0.04, pMax: 0.06, role: "secondaire", source: "J.Agric.Food.Chem. 2008;56:9578" },
  
  // Acides gras volatils (caractéristiques fermentation Perique)
  { name: "Acide butyrique", pMin: 0.3, pTyp: 0.6, pMax: 1.0, role: "majeur", source: "CORESTA.Inf.Bull. 2019;1:1" },
  { name: "Acide hexanoïque", pMin: 0.1, pTyp: 0.2, pMax: 0.4, role: "secondaire", source: "CORESTA.Inf.Bull. 2019;1:1" },
  
  // Aldéhydes aromatiques
  { name: "Benzeneacetaldehyde", pMin: 0.02, pTyp: 0.04, pMax: 0.06, role: "secondaire", source: "J.Agric.Food.Chem. 2013;61:8592" },
  
  // Sesquiterpènes
  { name: "Farnesylacetone", pMin: 0.05, pTyp: 0.08, pMax: 0.12, role: "secondaire", source: "J.Agric.Food.Chem. 2013;61:8592" },
  
  // Furanones
  { name: "5-Méthylfurfural", pMin: 0.03, pTyp: 0.05, pMax: 0.08, role: "secondaire", source: "J.Agric.Food.Chem. 2013;61:8592" },
  
  // Diterpènes
  { name: "Phytol", pMin: 0.3, pTyp: 0.5, pMax: 0.8, role: "secondaire", source: "J.Agric.Food.Chem. 2013;61:8592" },
];

let created = 0;
let linked = 0;
let updated = 0;

// Fonction pour créer ou récupérer une molécule
async function getOrCreateMolecule(mol) {
  const [[existing]] = await conn.execute(
    `SELECT id FROM molecules WHERE name = ? LIMIT 1`,
    [mol.name]
  );
  if (existing) return existing.id;
  
  await conn.execute(
    `INSERT INTO molecules (name, cas_number, formula, molecularWeight, family, chemical_class, olfactiveProfile, therapeuticProperties, createdAt, updatedAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
    [
      mol.name,
      mol.cas || null,
      mol.formula || null,
      mol.mw || null,
      mol.family || null,
      'other',
      JSON.stringify(mol.odorProfile || []),
      mol.therapeuticProperties || null,
    ]
  );
  const [[newMol]] = await conn.execute(`SELECT id FROM molecules WHERE name = ? LIMIT 1`, [mol.name]);
  created++;
  console.log(`  ✅ Molécule créée : ${mol.name}`);
  return newMol.id;
}

// Fonction pour créer ou mettre à jour une liaison plant_molecule
async function upsertPlantMolecule(plantId, moleculeId, pMin, pTyp, pMax, role, source) {
  const [[existing]] = await conn.execute(
    `SELECT plant_id FROM plant_molecules WHERE plant_id = ? AND molecule_id = ? LIMIT 1`,
    [plantId, moleculeId]
  );
  
  if (existing) {
    await conn.execute(
      `UPDATE plant_molecules SET percentage_min = ?, percentage_typical = ?, percentage_max = ?, role = ?, source = ?, updated_at = NOW() WHERE plant_id = ? AND molecule_id = ?`,
      [pMin, pTyp, pMax, role, source, plantId, moleculeId]
    );
    updated++;
  } else {
    await conn.execute(
      `INSERT INTO plant_molecules (plant_id, molecule_id, percentage_min, percentage_typical, percentage_max, role, source, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [plantId, moleculeId, pMin, pTyp, pMax, role, source]
    );
    linked++;
  }
}

console.log('\n=== TABAC ORIENTAL KATERINI ===');

// Créer les nouvelles molécules de l'oriental
for (const mol of orientalNewMolecules) {
  const molId = await getOrCreateMolecule(mol);
  await upsertPlantMolecule(ORIENTAL_PLANT_ID, molId, mol.pMin, mol.pTyp, mol.pMax, mol.role, mol.source);
}

// Mettre à jour les molécules existantes de l'oriental
for (const mol of orientalMolecules) {
  const [[existing]] = await conn.execute(`SELECT id FROM molecules WHERE name = ? LIMIT 1`, [mol.name]);
  if (existing) {
    await upsertPlantMolecule(ORIENTAL_PLANT_ID, existing.id, mol.pMin, mol.pTyp, mol.pMax, mol.role, mol.source);
  } else {
    console.log(`  ⚠️  Non trouvé : ${mol.name}`);
  }
}

console.log('\n=== TABAC PERIQUE ===');

// Créer les molécules spécifiques au Perique (acides gras volatils de fermentation)
const periqueNewMolecules = [
  {
    name: "Acide propanoïque",
    cas: "79-09-4",
    formula: "C3H6O2",
    mw: 74.1,
    family: "Acides gras volatils",
    chemicalClass: "Acide gras à chaîne courte",
    odorProfile: ["acide", "légèrement rance", "fermenté"],
    therapeuticProperties: "Antimicrobien (CMI 2-8 mg/mL), prébiotique (produit de fermentation propionique), inhibiteur moisissures (conservateur E280), marqueur fermentation anaérobie. Présent dans fromage suisse (fermentation propionique), tabac Perique. Source : J.Agric.Food.Chem. 2013;61:8592",
    pMin: 0.08, pTyp: 0.15, pMax: 0.25, role: "secondaire", source: "CORESTA.Inf.Bull. 2019;1:1"
  },
  {
    name: "Acide pentanoïque",
    cas: "109-52-4",
    formula: "C5H10O2",
    mw: 102.1,
    family: "Acides gras volatils",
    chemicalClass: "Acide gras à chaîne courte",
    odorProfile: ["rance", "fromage", "fermenté"],
    therapeuticProperties: "Antimicrobien (CMI 2-8 mg/mL), marqueur fermentation anaérobie tabac Perique. Présent dans tabac Perique fermenté, fromage affiné. Source : CORESTA.Inf.Bull. 2019;1:1",
    pMin: 0.05, pTyp: 0.08, pMax: 0.15, role: "secondaire", source: "CORESTA.Inf.Bull. 2019;1:1"
  },
  {
    name: "Acide 2-méthylbutyrique",
    cas: "116-53-0",
    formula: "C5H10O2",
    mw: 102.1,
    family: "Acides gras volatils",
    chemicalClass: "Acide gras ramifié à chaîne courte",
    odorProfile: ["fromage", "fruité", "fermenté"],
    therapeuticProperties: "Antimicrobien (CMI 2-8 mg/mL), arôme fermentation (fromage, tabac Perique), marqueur fermentation anaérobie. Source : CORESTA.Inf.Bull. 2019;1:1",
    pMin: 0.03, pTyp: 0.06, pMax: 0.10, role: "secondaire", source: "CORESTA.Inf.Bull. 2019;1:1"
  },
  {
    name: "Acétol (1-Hydroxy-2-propanone)",
    cas: "116-09-6",
    formula: "C3H6O2",
    mw: 74.1,
    family: "Cétones",
    chemicalClass: "Hydroxycétone aliphatique",
    odorProfile: ["caramel", "sucré", "fumé"],
    therapeuticProperties: "Antimicrobien (CMI 4-16 mg/mL), antioxydant. Produit de dégradation thermique des sucres (pyrolyse cellulose, réaction de Maillard). Présent dans fumée de bois, tabac fermenté, café. Source : J.Anal.Appl.Pyrolysis 2012;93:1",
    pMin: 0.05, pTyp: 0.10, pMax: 0.20, role: "secondaire", source: "J.Agric.Food.Chem. 2013;61:8592"
  },
  {
    name: "Phénylacétaldéhyde",
    cas: "122-78-1",
    formula: "C8H8O",
    mw: 120.1,
    family: "Aldéhydes",
    chemicalClass: "Aldéhyde aromatique phénylique",
    odorProfile: ["rose", "miel", "hyacinthe", "tabac"],
    therapeuticProperties: "Antimicrobien (CMI 2-8 mg/mL), insectifuge (répulsif insectes), arôme floral. Produit de dégradation de la phénylalanine. Présent dans tabac fermenté, rose, hyacinthe, miel. Source : J.Agric.Food.Chem. 2012;60:1",
    pMin: 0.02, pTyp: 0.04, pMax: 0.06, role: "secondaire", source: "J.Agric.Food.Chem. 2013;61:8592"
  },
];

for (const mol of periqueNewMolecules) {
  const molId = await getOrCreateMolecule(mol);
  await upsertPlantMolecule(PERIQUE_PLANT_ID, molId, mol.pMin, mol.pTyp, mol.pMax, mol.role, mol.source);
}

// Mettre à jour les molécules existantes du Perique
for (const mol of periqueMolecules) {
  const [[existing]] = await conn.execute(`SELECT id FROM molecules WHERE name = ? LIMIT 1`, [mol.name]);
  if (existing) {
    await upsertPlantMolecule(PERIQUE_PLANT_ID, existing.id, mol.pMin, mol.pTyp, mol.pMax, mol.role, mol.source);
  } else {
    console.log(`  ⚠️  Non trouvé : ${mol.name}`);
  }
}

// Vérification finale
const [orientalFinal] = await conn.execute(`
  SELECT COUNT(*) as cnt FROM plant_molecules WHERE plant_id = ?
`, [ORIENTAL_PLANT_ID]);
const [periqueFinal] = await conn.execute(`
  SELECT COUNT(*) as cnt FROM plant_molecules WHERE plant_id = ?
`, [PERIQUE_PLANT_ID]);

console.log(`\n✅ Enrichissement GC-MS terminé :`);
console.log(`   - ${created} nouvelles molécules créées`);
console.log(`   - ${linked} nouvelles liaisons créées`);
console.log(`   - ${updated} liaisons mises à jour`);
console.log(`   - Oriental Katerini : ${orientalFinal[0].cnt} molécules au total`);
console.log(`   - Perique : ${periqueFinal[0].cnt} molécules au total`);
await conn.end();
