import mysql from 'mysql2/promise';

const db = await mysql.createConnection(process.env.DATABASE_URL);
const log = (s) => console.log(s);

log('🌿 CRÉATION DES ENTRÉES MANQUANTES — PERFUMUM');
log('='.repeat(60));

// ─────────────────────────────────────────────────────────────
// 1. MASTIHA — Créer comme PLANTE (résine) dans la table plants
// ─────────────────────────────────────────────────────────────
log('\n📋 1. Mastiha — Création comme plante/résine');

const [existingMastiha] = await db.query(
  `SELECT id FROM plants WHERE name = 'Mastiha (Mastic de Chios)' OR name = 'Mastiha'`
);

let mastihaPlantId;
if (existingMastiha.length > 0) {
  mastihaPlantId = existingMastiha[0].id;
  log(`  ✅ Mastiha déjà présente (ID: ${mastihaPlantId})`);
} else {
  const [result] = await db.query(`
    INSERT INTO plants (
      name, latin_name, family, category, origin, habitat,
      olfactive_signature, dominant_molecules, traditional_use,
      therapeutic_properties, historical_significance,
      conservation_status, status, validation_status,
      kingdom, division, class, order_name, genus, species,
      life_cycle, koppen_zone, koppen_description,
      latitude, longitude, altitude_min, altitude_max
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    'Mastiha (Mastic de Chios)', 'Pistacia lentiscus var. chia', 'Anacardiaceae', 'resine',
    'Île de Chios, Grèce (production exclusive AOP)',
    'Maquis méditerranéen, sols calcaires pauvres, exposition sud, altitude 0-300m. Endémique de Chios pour la production de résine.',
    'Résine cristalline, fraîche et résineuse. Notes de pin, cèdre, citron vert, eucalyptus. Légèrement camphrée avec une douceur balsamique unique.',
    'α-Pinène (25-35%), β-Myrcène (15-20%), β-Pinène (8-12%), Limonène (5-8%), Sabinène (3-6%), Linalol (2-4%)',
    'Utilisée depuis l\'Antiquité grecque comme chewing-gum naturel, médicament digestif, vernis et encens. Mentionnée par Hippocrate et Dioscoride. Commerce florissant depuis 2500 ans.',
    JSON.stringify({
      digestive: 'Traitement des ulcères gastriques (H. pylori). Activité antibactérienne documentée cliniquement.',
      antimicrobial: 'Antibactérien à large spectre (Staphylococcus aureus, E. coli). Antifongique (Candida).',
      anti_inflammatory: 'Inhibition COX-1 et COX-2. Utilisée dans les maladies inflammatoires intestinales.',
      antioxidant: 'Riche en polyphénols et triterpènes. ORAC élevé.',
      hepatoprotective: 'Protection hépatique documentée. Réduction des transaminases.',
      oral_health: 'Antibactérien oral. Réduction de la plaque dentaire. Utilisée dans les chewing-gums thérapeutiques.'
    }),
    'Résine emblématique de l\'île de Chios depuis l\'Antiquité. Produit AOP européen. Mentionnée dans la Bible (Genèse 37:25). Commerce historique majeur de la Méditerranée orientale.',
    'LC', 'validated', 'valide',
    'Plantae', 'Magnoliophyta', 'Magnoliopsida', 'Sapindales', 'Pistacia', 'lentiscus',
    'perennial', 'Csa', 'Méditerranéen chaud et sec',
    38.3667, 26.1333, 0, 300
  ]);
  mastihaPlantId = result.insertId;
  log(`  ✅ Mastiha créée (ID: ${mastihaPlantId})`);
}

// Créer une molécule "Mastiha (résine absolue)" représentant l'extrait
const [existingMastihaExtract] = await db.query(`SELECT id FROM molecules WHERE name = 'Mastiha (résine absolue)'`);
let mastihaExtractId;
if (existingMastihaExtract.length > 0) {
  mastihaExtractId = existingMastihaExtract[0].id;
  log(`  ✅ Extrait Mastiha déjà présent (ID: ${mastihaExtractId})`);
} else {
  const [r] = await db.query(`
    INSERT INTO molecules (name, cas_number, chemicalFormula, chemicalFamily, therapeuticProperties, olfactiveProfile)
    VALUES (?, ?, ?, ?, ?, ?)
  `, [
    'Mastiha (résine absolue)', null, 'Mélange complexe',
    '[EXTRAIT RÉSINE] Pistacia lentiscus',
    'Antibactérien (H. pylori, Staphylococcus aureus). Digestif et anti-ulcéreux documenté cliniquement. Anti-inflammatoire (COX-1/COX-2). Antifongique (Candida). Hépatoprotecteur. Antioxydant puissant. Utilisé en médecine traditionnelle grecque depuis 2500 ans.',
    'Résineuse, fraîche, légèrement camphrée. Notes de pin, cèdre, citron vert. Douceur balsamique unique.'
  ]);
  mastihaExtractId = r.insertId;
  log(`  ✅ Molécule "Mastiha (résine absolue)" créée (ID: ${mastihaExtractId})`);
}

// Lier la molécule à la plante
try {
  await db.query(`INSERT IGNORE INTO plant_molecules (plant_id, molecule_id, role) VALUES (?, ?, 'extrait')`, [mastihaPlantId, mastihaExtractId]);
} catch(e) {}

// Lier aux recettes 60001 (Mastiha Brut) et 60003 (Figue & Santal Blanc)
for (const recetteId of [60001, 60003]) {
  const [existing] = await db.query(`SELECT id FROM recette_molecules WHERE recette_id = ? AND molecule_id = ?`, [recetteId, mastihaExtractId]);
  if (existing.length === 0) {
    await db.query(`INSERT INTO recette_molecules (recette_id, molecule_id, proportion, role) VALUES (?, ?, 20, 'ingredient')`, [recetteId, mastihaExtractId]);
    log(`  ✅ Mastiha liée à la recette ID:${recetteId}`);
  }
}

// ─────────────────────────────────────────────────────────────
// 2. CYPRIOL (Nagarmotha) — Huile essentielle de Cyperus scariosus
// ─────────────────────────────────────────────────────────────
log('\n📋 2. Cypriol (Nagarmotha) — Huile essentielle');

const [existingCypriol] = await db.query(`SELECT id FROM molecules WHERE name LIKE '%ypriol%' OR name LIKE '%agarmotha%'`);
let cypriolId;
if (existingCypriol.length > 0) {
  cypriolId = existingCypriol[0].id;
  log(`  ✅ Cypriol déjà présent (ID: ${cypriolId})`);
} else {
  const [r] = await db.query(`
    INSERT INTO molecules (name, cas_number, chemicalFormula, chemicalFamily, therapeuticProperties, olfactiveProfile)
    VALUES (?, ?, ?, ?, ?, ?)
  `, [
    'Cypriol (Nagarmotha HE)', '8023-93-6', 'Mélange complexe',
    '[EXTRAIT PLANTE] Racine / Cyperus',
    'Anti-inflammatoire puissant (sesquiterpènes : mustakone, isokobusone). Antibactérien et antifongique. Activité anxiolytique légère. Diurétique. Utilisé en médecine ayurvédique (Musta) pour les troubles digestifs, fièvres et inflammations. Activité antiparasitaire documentée.',
    'Terreux, boisé, fumé, légèrement épicé. Notes de vétiver, patchouli, encens. Profondeur tellurique unique.'
  ]);
  cypriolId = r.insertId;
  log(`  ✅ Cypriol créé (ID: ${cypriolId})`);
}

// Lier à la recette 60006 (Sève Noire / Feuillage Mort)
const [existingCypriolLink] = await db.query(`SELECT id FROM recette_molecules WHERE recette_id = 60006 AND molecule_id = ?`, [cypriolId]);
if (existingCypriolLink.length === 0) {
  await db.query(`INSERT INTO recette_molecules (recette_id, molecule_id, proportion, role) VALUES (60006, ?, 12.5, 'ingredient')`, [cypriolId]);
  log(`  ✅ Cypriol lié à la recette ID:60006`);
}

// ─────────────────────────────────────────────────────────────
// 3. ISOQUINOLINE — Alcaloïde hétérocyclique
// ─────────────────────────────────────────────────────────────
log('\n📋 3. Isoquinoline — Alcaloïde hétérocyclique');

const [existingIsoq] = await db.query(`SELECT id FROM molecules WHERE name = 'Isoquinoline'`);
let isoqId;
if (existingIsoq.length > 0) {
  isoqId = existingIsoq[0].id;
  log(`  ✅ Isoquinoline déjà présente (ID: ${isoqId})`);
} else {
  const [r] = await db.query(`
    INSERT INTO molecules (name, cas_number, chemicalFormula, molecularWeight, chemicalFamily, therapeuticProperties, olfactiveProfile, boilingPoint)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    'Isoquinoline', '119-65-3', 'C9H7N', 129.16,
    'alcaloide heterocyclique',
    'Activité antimicrobienne (noyau isoquinoléique, précurseur de nombreux alcaloïdes médicinaux : berbérine, morphine, codéine). Activité bronchodilatatrice légère. Anti-inflammatoire. Présent dans le tabac et les fumées de bois. Inhibiteur de certaines kinases (activité antitumorale potentielle in vitro).',
    'Pyridine, légèrement naphtalénique, fumé. Note caractéristique du tabac et des cuirs fumés.',
    243.25
  ]);
  isoqId = r.insertId;
  log(`  ✅ Isoquinoline créée (ID: ${isoqId})`);
}

// Lier à la recette "Noir Tabac"
const [noirTabac] = await db.query(`SELECT id FROM recettes WHERE name LIKE '%Noir Tabac%'`);
if (noirTabac.length > 0) {
  const [existingLink] = await db.query(`SELECT id FROM recette_molecules WHERE recette_id = ? AND molecule_id = ?`, [noirTabac[0].id, isoqId]);
  if (existingLink.length === 0) {
    await db.query(`INSERT INTO recette_molecules (recette_id, molecule_id, proportion, role) VALUES (?, ?, 0, 'ingredient')`, [noirTabac[0].id, isoqId]);
    log(`  ✅ Isoquinoline liée à la recette "${noirTabac[0].id}: Noir Tabac"`);
  }
} else {
  log(`  ⚠️  Recette "Noir Tabac" non trouvée`);
}

// ─────────────────────────────────────────────────────────────
// 4. MEGASTIGMATRIENONE — Norisoprénoïde tabac oriental
// ─────────────────────────────────────────────────────────────
log('\n📋 4. Megastigmatrienone — Norisoprénoïde du tabac oriental');

const [existingMegaGeneric] = await db.query(`SELECT id FROM molecules WHERE name = 'Megastigmatrienone'`);
let megaId;
if (existingMegaGeneric.length > 0) {
  megaId = existingMegaGeneric[0].id;
  log(`  ✅ Megastigmatrienone déjà présente (ID: ${megaId})`);
} else {
  const [r] = await db.query(`
    INSERT INTO molecules (name, cas_number, chemicalFormula, molecularWeight, chemicalFamily, therapeuticProperties, olfactiveProfile)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `, [
    'Megastigmatrienone', '38818-55-2', 'C13H18O', 190.28,
    'norisoprenoid',
    'Norisoprénoïde issu de la dégradation des caroténoïdes (β-carotène). Antioxydant puissant. Activité anti-inflammatoire légère. Marqueur de qualité et de maturité des tabacs orientaux. Présent dans les vins (marqueur de terroir). Activité neuroprotectrice potentielle (dérivé caroténoïde).',
    'Tabac, boisé, légèrement fruité. Note caractéristique des tabacs orientaux (Katerini, Samsun). Rappelle le β-Damascénone mais plus terreux.'
  ]);
  megaId = r.insertId;
  log(`  ✅ Megastigmatrienone créée (ID: ${megaId})`);
}

// ─────────────────────────────────────────────────────────────
// 5. SYRINGALDÉHYDE — Phénol de lignine
// ─────────────────────────────────────────────────────────────
log('\n📋 5. Syringaldéhyde — Phénol de lignine');

const [existingSyring] = await db.query(`SELECT id FROM molecules WHERE name LIKE '%yringald%'`);
let syringId;
if (existingSyring.length > 0) {
  syringId = existingSyring[0].id;
  log(`  ✅ Syringaldéhyde déjà présent (ID: ${syringId})`);
} else {
  const [r] = await db.query(`
    INSERT INTO molecules (name, cas_number, chemicalFormula, molecularWeight, chemicalFamily, therapeuticProperties, olfactiveProfile, boilingPoint)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    'Syringaldéhyde', '134-96-3', 'C9H10O4', 182.17,
    'phenylpropanoide',
    'Antioxydant puissant (dérivé de la lignine). Activité anti-inflammatoire documentée (inhibition NF-κB). Antibactérien. Neuroprotecteur potentiel (études in vitro sur cellules neuronales). Présent dans les vins vieillis en fût de chêne, le tabac Latakia fumé, les bois pyrogénés. Activité anticancéreuse potentielle in vitro.',
     'Fumé, boisé, légèrement vanilé. Note caractéristique du tabac Latakia et des vins en fût. Rappelle la vanilline mais plus complexe et fumé.',
    192.0
  ]);
  syringId = r.insertId;
  log(`  ✅ Syringaldéhyde créé (ID: ${syringId})`);
}

// ─────────────────────────────────────────────────────────────
// 6. GOTU KOLA (Centella asiatica) — Plante nootropique
// ─────────────────────────────────────────────────────────────
log('\n📋 6. Gotu Kola (Centella asiatica) — Extrait nootropique');

// Créer la plante
const [existingGKPlant] = await db.query(`SELECT id FROM plants WHERE name LIKE '%entella%' OR name LIKE '%otu Kola%'`);
let gkPlantId;
if (existingGKPlant.length > 0) {
  gkPlantId = existingGKPlant[0].id;
  log(`  ✅ Plante Centella asiatica déjà présente (ID: ${gkPlantId})`);
} else {
  const [r] = await db.query(`
    INSERT INTO plants (name, latin_name, family, category, origin, olfactive_signature, traditional_use,
      therapeutic_properties, conservation_status, status, validation_status, kingdom, genus, species, life_cycle)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    'Gotu Kola (Centella asiatica)', 'Centella asiatica', 'Apiaceae', 'aromatique',
    'Asie tropicale et subtropicale (Inde, Sri Lanka, Indonésie, Afrique)',
    'Herbacée, légèrement terreuse, fraîche. Notes vertes discrètes.',
    'Plante médicinale majeure de l\'Ayurveda et de la Médecine Traditionnelle Chinoise. Utilisée depuis 3000 ans pour améliorer la mémoire, cicatriser les plaies et traiter les maladies de peau.',
    JSON.stringify({
      nootropic: 'Amélioration de la mémoire et de la concentration (asiaticoside, madécassoside). Études cliniques positives.',
      wound_healing: 'Cicatrisant cutané puissant. Stimulation de la synthèse de collagène.',
      anxiolytic: 'Anxiolytique léger (modulation GABA). Réduction du stress documentée.',
      anti_inflammatory: 'Inhibition des cytokines pro-inflammatoires.',
      neuroprotective: 'Protection neuronale. Potentiel dans la maladie d\'Alzheimer (études préliminaires).'
    }),
    'LC', 'validated', 'valide',
    'Plantae', 'Centella', 'asiatica', 'perennial'
  ]);
  gkPlantId = r.insertId;
  log(`  ✅ Plante Gotu Kola créée (ID: ${gkPlantId})`);
}

// Créer la molécule extrait
const [existingGKMol] = await db.query(`SELECT id FROM molecules WHERE name LIKE '%otu Kola%' OR name LIKE '%entella asiatica%'`);
let gkMolId;
if (existingGKMol.length > 0) {
  gkMolId = existingGKMol[0].id;
  log(`  ✅ Extrait Gotu Kola déjà présent (ID: ${gkMolId})`);
} else {
  const [r] = await db.query(`
    INSERT INTO molecules (name, cas_number, chemicalFormula, chemicalFamily, therapeuticProperties, olfactiveProfile)
    VALUES (?, ?, ?, ?, ?, ?)
  `, [
    'Gotu Kola (Centella asiatica) — extrait', '16830-15-2', 'Mélange complexe (asiaticoside principal)',
    'saponine triterpénique',
    'Nootropique documenté cliniquement (amélioration mémoire et concentration). Cicatrisant cutané puissant (stimulation collagène). Anxiolytique léger (modulation GABA). Anti-inflammatoire. Neuroprotecteur potentiel. Activité antioxydante. Utilisé en Ayurveda depuis 3000 ans. Composants actifs : asiaticoside, madécassoside, acide asiatique.',
    'Herbacée, légèrement terreuse, fraîche. Discret.'
  ]);
  gkMolId = r.insertId;
  log(`  ✅ Extrait Gotu Kola créé (ID: ${gkMolId})`);
}

// Lier à la plante
try {
  await db.query(`INSERT IGNORE INTO plant_molecules (plant_id, molecule_id, role) VALUES (?, ?, 'extrait')`, [gkPlantId, gkMolId]);
} catch(e) {}

// Lier à la recette "Tabac Entourage Nootropique"
const [nootropicRec] = await db.query(`SELECT id FROM recettes WHERE name LIKE '%Entourage Nootropique%' OR name LIKE '%Nootropique%'`);
if (nootropicRec.length > 0) {
  const [existingLink] = await db.query(`SELECT id FROM recette_molecules WHERE recette_id = ? AND molecule_id = ?`, [nootropicRec[0].id, gkMolId]);
  if (existingLink.length === 0) {
    await db.query(`INSERT INTO recette_molecules (recette_id, molecule_id, proportion, role) VALUES (?, ?, 20, 'ingredient')`, [nootropicRec[0].id, gkMolId]);
    log(`  ✅ Gotu Kola lié à la recette ID:${nootropicRec[0].id}`);
  }
} else {
  log(`  ⚠️  Recette "Tabac Entourage Nootropique" non trouvée`);
}

// ─────────────────────────────────────────────────────────────
// RÉSUMÉ FINAL
// ─────────────────────────────────────────────────────────────
const [totalMols] = await db.query('SELECT COUNT(*) as n FROM molecules');
const [totalPlants] = await db.query('SELECT COUNT(*) as n FROM plants');
const [totalLinks] = await db.query('SELECT COUNT(DISTINCT recette_id) as n FROM recette_molecules');
const [totalRecettes] = await db.query('SELECT COUNT(*) as n FROM recettes');
const [withThera] = await db.query('SELECT COUNT(*) as n FROM molecules WHERE therapeuticProperties IS NOT NULL AND therapeuticProperties != ""');

log('\n' + '='.repeat(60));
log('📊 RÉSUMÉ FINAL');
log(`  Molécules totales : ${totalMols[0].n}`);
log(`  Plantes totales : ${totalPlants[0].n}`);
log(`  Couverture thérapeutique : ${withThera[0].n}/${totalMols[0].n} (${Math.round(withThera[0].n/totalMols[0].n*100)}%)`);
log(`  Recettes avec liaisons : ${totalLinks[0].n}/${totalRecettes[0].n}`);
log('✅ Création des entrées manquantes terminée');

await db.end();
