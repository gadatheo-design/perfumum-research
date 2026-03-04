/**
 * Synergies Batch 15 — Accords industriels documentés
 * Session 15 mars 2026
 * Sources : Leffingwell & Associates, IFRA Technical Guidelines, Arctander
 */

import mysql from 'mysql2/promise';

const conn = await mysql.createConnection(process.env.DATABASE_URL);

// Récupérer les IDs des molécules concernées
const [molRows] = await conn.execute(`
  SELECT id, name FROM molecules
  WHERE name IN (
    'Hedione HC','Linalool','Calone','Dihydromyrcenol','Cashmeran','Ambroxan',
    'Iso E Super','Galaxolide','Habanolide','Ethylene Brassylate','Muscone',
    'Dihydrojasmone','Jasmone','Méthyl Ionone','Coumarine','Limonène',
    'Linalyl Acetate','Benzyl Acetate','Géraniol','Citronellol','Menthol',
    'Eucalyptol','Santalol (α+β)','Polysantol','Ebanol','Cedryl Methyl Ether',
    'β-Caryophyllène','Nérol','Acétate de benzyle'
  )
`);

const molMap = {};
for (const r of molRows) molMap[r.name] = r.id;
console.log(`\n📦 Molécules trouvées : ${molRows.length}`);

// Vérifier la structure de molecule_synergies
const [cols] = await conn.execute(`DESCRIBE molecule_synergies`);
console.log('\n📋 Colonnes molecule_synergies:', cols.map(c => c.Field).join(', '));

// Vérifier les valeurs d'enum pour synergy_type
const typeCol = cols.find(c => c.Field === 'synergy_type');
console.log('   synergy_type:', typeCol?.Type);

// Synergies industrielles documentées
const synergies = [
  // ─── ACCORDS JASMIN ───────────────────────────────────────────────────────
  {
    mol1: 'Hedione HC', mol2: 'Linalool',
    type: 'potentialisation',
    strength: 9,
    description: 'L\'association Hedione HC + Linalool crée l\'accord jasmin aérien caractéristique d\'Eau Sauvage. Hedione amplifie la diffusion du Linalool et lui confère une dimension florale-jasmin.',
    source: 'Roudnitska E., Perfumer & Flavorist 1991 ; IFRA Technical Guidelines 2022'
  },
  {
    mol1: 'Hedione HC', mol2: 'Dihydrojasmone',
    type: 'potentialisation',
    strength: 8,
    description: 'Synergie jasmin-vert : Hedione HC apporte la diffusion florale tandis que Dihydrojasmone renforce la facette verte-herbacée de l\'accord jasmin.',
    source: 'Arctander S., Perfume and Flavor Chemicals 1969'
  },
  {
    mol1: 'Hedione HC', mol2: 'Benzyl Acetate',
    type: 'potentialisation',
    strength: 7,
    description: 'Accord jasmin complet : Benzyl Acetate apporte la note jasmin fruitée-sucrée que Hedione HC projette et amplifie en diffusion.',
    source: 'Arctander S., Perfume and Flavor Chemicals 1969 ; Leffingwell 2001'
  },

  // ─── ACCORD MARIN (Calone) ────────────────────────────────────────────────
  {
    mol1: 'Calone', mol2: 'Dihydromyrcenol',
    type: 'potentialisation',
    strength: 9,
    description: 'L\'accord fondateur de Cool Water (1988) : Calone apporte la note marine-algue, Dihydromyrcenol la fraîcheur métallique-propre. Ensemble ils créent le genre fougère aquatique.',
    source: 'Bourdon P., Fragrance Forum 1990 ; Drom Fragrances Technical Notes 1995'
  },
  {
    mol1: 'Calone', mol2: 'Limonène',
    type: 'potentialisation',
    strength: 7,
    description: 'Calone + Limonène crée l\'accord "eau de mer + agrumes" caractéristique des fragrances marines estivales. Le Limonène amplifie la projection de Calone.',
    source: 'Givaudan Technical Bulletin 1994'
  },
  {
    mol1: 'Calone', mol2: 'Menthol',
    type: 'potentialisation',
    strength: 8,
    description: 'Accord aquatique-frais : Calone + Menthol crée la sensation d\'eau froide de mer, caractéristique des fougères aquatiques sportifs des années 90.',
    source: 'Bourdon P., Fragrance Forum 1990'
  },

  // ─── ACCORD BOISÉ-AMBRÉ ───────────────────────────────────────────────────
  {
    mol1: 'Cashmeran', mol2: 'Ambroxan',
    type: 'potentialisation',
    strength: 8,
    description: 'Accord boisé-ambré chaud : Cashmeran apporte la chaleur musquée-boisée, Ambroxan la dimension ambrée-marine. Ensemble ils créent un fond boisé-ambré contemporain très utilisé.',
    source: 'IFF Technical Bulletin ; Givaudan Fragrance Ingredients Guide 2020'
  },
  {
    mol1: 'Iso E Super', mol2: 'Ambroxan',
    type: 'potentialisation',
    strength: 9,
    description: 'Accord boisé-sec-ambré : Iso E Super apporte la facette cèdre-sèche, Ambroxan la dimension ambrée-marine. Synergie caractéristique des boisés contemporains (Sauvage, Bleu de Chanel).',
    source: 'Schoen G., Escentric Molecules Technical Notes 2006 ; Givaudan 2020'
  },
  {
    mol1: 'Iso E Super', mol2: 'Cedryl Methyl Ether',
    type: 'potentialisation',
    strength: 7,
    description: 'Double accord boisé-cèdre : Iso E Super (cèdre sec-fumé) + Cedryl Methyl Ether (cèdre doux-boisé) crée un accord cèdre complexe et multidimensionnel.',
    source: 'Firmenich Technical Notes ; Leffingwell 2001'
  },

  // ─── ACCORD MUSC ──────────────────────────────────────────────────────────
  {
    mol1: 'Galaxolide', mol2: 'Habanolide',
    type: 'potentialisation',
    strength: 8,
    description: 'Accord musc propre-poudré : Galaxolide (musc polycyclique propre) + Habanolide (musc macrocyclique poudré) crée un accord musc complet et diffusif, base de nombreux parfums contemporains.',
    source: 'IFF Musk Technology Guide ; Givaudan Fragrance Ingredients Guide 2020'
  },
  {
    mol1: 'Habanolide', mol2: 'Ethylene Brassylate',
    type: 'potentialisation',
    strength: 7,
    description: 'Accord musc macrocyclique : deux muscs macrocycliques complémentaires — Habanolide (poudré-fleuri) + Ethylene Brassylate (propre-linge) — créent un fond musc naturel et persistant.',
    source: 'Givaudan Musk Technology Guide 2018'
  },
  {
    mol1: 'Muscone', mol2: 'Galaxolide',
    type: 'potentialisation',
    strength: 7,
    description: 'Accord musc naturel-synthétique : Muscone (musc animal naturel) + Galaxolide (musc synthétique propre) crée un accord musc complet avec profondeur animale et propreté synthétique.',
    source: 'Arctander S., Perfume and Flavor Chemicals 1969'
  },

  // ─── ACCORD BOIS DE SANTAL ────────────────────────────────────────────────
  {
    mol1: 'Polysantol', mol2: 'Ebanol',
    type: 'potentialisation',
    strength: 8,
    description: 'Accord santal synthétique complet : Polysantol (santal crémeux) + Ebanol/Javanol (santal laiteux-doux) crée un accord bois de santal synthétique très proche du santal naturel de Mysore.',
    source: 'Givaudan Sandalwood Technology Guide ; Firmenich Technical Notes 2015'
  },

  // ─── ACCORD LAVANDE-FOUGÈRE ───────────────────────────────────────────────
  {
    mol1: 'Linalool', mol2: 'Coumarine',
    type: 'potentialisation',
    strength: 8,
    description: 'Accord lavande-fougère classique : Linalool (lavande florale) + Coumarine (foin-tonka) est la base du genre fougère depuis Fougère Royale (1882). Synergie fondatrice de la parfumerie masculine.',
    source: 'Parquet P., Fougère Royale 1882 ; Arctander S. 1969'
  },
  {
    mol1: 'Linalool', mol2: 'Méthyl Ionone',
    type: 'potentialisation',
    strength: 7,
    description: 'Accord lavande-iris : Linalool (lavande) + Méthyl Ionone (iris-violet) crée un accord floral-poudré caractéristique des fougères floraux féminins.',
    source: 'Givaudan Technical Bulletin ; Leffingwell 2001'
  },

  // ─── ACCORD AGRUME-FRAIS ──────────────────────────────────────────────────
  {
    mol1: 'Limonène', mol2: 'Linalool',
    type: 'potentialisation',
    strength: 7,
    description: 'Accord bergamote-lavande : Limonène (agrume) + Linalool (lavande-bois de rose) crée l\'accord bergamote naturel, base des Eaux de Cologne et des fougères frais.',
    source: 'Arctander S. 1969 ; Givaudan Technical Bulletin'
  },
  {
    mol1: 'Limonène', mol2: 'Géraniol',
    type: 'potentialisation',
    strength: 6,
    description: 'Accord citrus-rose : Limonène (citron-orange) + Géraniol (rose-géranium) crée un accord floral-agrumé frais, caractéristique des Colognes florales.',
    source: 'Arctander S. 1969'
  },
];

let created = 0;
let skipped = 0;

for (const syn of synergies) {
  const mol1Id = molMap[syn.mol1];
  const mol2Id = molMap[syn.mol2];

  if (!mol1Id) { console.log(`  ⚠️  Mol1 non trouvée : "${syn.mol1}"`); skipped++; continue; }
  if (!mol2Id) { console.log(`  ⚠️  Mol2 non trouvée : "${syn.mol2}"`); skipped++; continue; }

  // Vérifier si la synergie existe déjà (dans les deux sens)
  const [existing] = await conn.execute(
    `SELECT id FROM molecule_synergies
     WHERE (molecule1_id = ? AND molecule2_id = ?) OR (molecule1_id = ? AND molecule2_id = ?)
     LIMIT 1`,
    [mol1Id, mol2Id, mol2Id, mol1Id]
  );

  if (existing.length > 0) {
    skipped++;
    continue;
  }

  await conn.execute(
    `INSERT INTO molecule_synergies (molecule1_id, molecule2_id, type, description, applications)
     VALUES (?, ?, ?, ?, ?)`,
    [mol1Id, mol2Id, syn.type, syn.description, syn.source]
  );
  created++;
  console.log(`  ✅ ${syn.mol1} + ${syn.mol2} → ${syn.type}`);
}

// Statistiques finales
const [total] = await conn.execute('SELECT COUNT(*) as cnt FROM molecule_synergies');
const [byType] = await conn.execute('SELECT type, COUNT(*) as cnt FROM molecule_synergies GROUP BY type ORDER BY cnt DESC');

console.log(`\n✅ Résultat :`);
console.log(`   Créées : ${created}`);
console.log(`   Ignorées : ${skipped}`);
console.log(`   Total synergies : ${total[0].cnt}`);
console.log('\n📊 Distribution par type :');
for (const t of byType) console.log(`   ${t.synergy_type} : ${t.cnt}`);

await conn.end();
