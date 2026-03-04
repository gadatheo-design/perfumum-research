/**
 * PERFUMUM — Normalisation des familles chimiques et enrichissement des molécules
 * 
 * 1. Fusionne les doublons de noms de familles (ex: "Esters balsamiques" vs "Esters Balsamiques")
 * 2. Fusionne le doublon Limonène
 * 3. Ajoute les molécules prioritaires dans les familles sous-représentées
 * 4. Enrichit les propriétés thérapeutiques des molécules clés
 */

import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const conn = await mysql.createConnection(process.env.DATABASE_URL);
let created = 0, updated = 0, merged = 0;

// ─── ÉTAPE 1 : Normalisation des noms de familles ─────────────────────────────
console.log('\n=== ÉTAPE 1 : Normalisation des familles ===');

const familyMappings = [
  // Doublons de casse/accents
  { from: 'acides_gras', to: 'Acides gras' },
  { from: 'Acide gras', to: 'Acides gras' },
  { from: 'Alcool gras', to: 'Alcools gras' },
  { from: 'terpene', to: 'Terpènes' },
  { from: 'terpene alcohol', to: 'Alcools terpéniques' },
  { from: 'alcohol', to: 'Alcools terpéniques' },
  { from: 'esters', to: 'Esters' },
  { from: 'phenolic', to: 'Phénols' },
  { from: 'mixture', to: 'Mélanges' },
  { from: 'Esters balsamiques', to: 'Esters Balsamiques' },
  { from: 'Furocoumarine', to: 'Furocoumarines' },
  { from: 'Sesquiterpène aromatique', to: 'Sesquiterpènes aromatiques' },
  { from: 'Sesquiterpène cétone', to: 'Cétones sesquiterpéniques' },
  { from: 'Sesquiterpène monocyclique', to: 'Sesquiterpènes' },
  { from: 'Cétone monoterpénique', to: 'Cétones terpéniques' },
  { from: 'Cétone bicyclique', to: 'Cétones terpéniques' },
  { from: 'Cétone terpénique', to: 'Cétones terpéniques' },
  { from: 'Monoterpène cétonique', to: 'Cétones terpéniques' },
  { from: 'Alcools terpéniques', to: 'Alcools terpéniques' },
  { from: 'Monoterpénols', to: 'Alcools terpéniques' },
  { from: 'Monoterpènes bicycliques', to: 'Monoterpènes' },
  { from: 'Ester monoterpénique', to: 'Esters terpéniques' },
  { from: 'Ester phénolique', to: 'Esters phénoliques' },
  { from: 'Esters furaniques', to: 'Esters furaniques' },
  { from: 'Herbes aromatiques', to: 'Aromatiques' },
  { from: 'Florale', to: 'Floraux' },
  { from: 'Floral / Agrumes', to: 'Floraux' },
  { from: 'Terpène / Terre', to: 'Terpènes' },
  { from: 'Terpènes Phénoliques', to: 'Phénols terpéniques' },
  { from: 'Terpènes Poivrés', to: 'Terpènes poivrés' },
  { from: 'Terpènes Fruités', to: 'Terpènes fruités' },
  { from: 'Terpènes Citrus', to: 'Terpènes agrumes' },
  { from: 'Terpènes Boisés', to: 'Terpènes boisés' },
  { from: 'Phénols Boisés', to: 'Phénols boisés' },
  { from: 'Sesquiterpènes spiraniques', to: 'Sesquiterpènes' },
  { from: 'Sesquiterpènes tricycliques', to: 'Sesquiterpènes' },
  { from: 'Acétals santalés', to: 'Acétals' },
  { from: 'Aldéhydes monoterpéniques', to: 'Aldéhydes terpéniques' },
  { from: 'Éthers aromatiques', to: 'Éthers' },
  { from: 'Oxydes terpéniques', to: 'Oxydes' },
  { from: 'Germacrène', to: 'Sesquiterpènes' },
  { from: 'Diterpénol', to: 'Diterpènes' },
  { from: 'Stéroïde / Phéromone', to: 'Stéroïdes' },
  { from: 'Acide', to: 'Acides' },
  { from: 'Furane', to: 'Furanes' },
  { from: 'Pyrone', to: 'Pyrones' },
  { from: 'Flavonoïde', to: 'Flavonoïdes' },
];

for (const { from, to } of familyMappings) {
  const [r] = await conn.execute(
    `UPDATE molecules SET family = ? WHERE family = ?`,
    [to, from]
  );
  if (r.affectedRows > 0) {
    console.log(`  ✅ "${from}" → "${to}" (${r.affectedRows} molécules)`);
    updated += r.affectedRows;
  }
}

// ─── ÉTAPE 2 : Fusion du doublon Limonène ─────────────────────────────────────
console.log('\n=== ÉTAPE 2 : Fusion du doublon Limonène ===');
const [limonenes] = await conn.execute(
  `SELECT id, name FROM molecules WHERE LOWER(name) = 'limonène' ORDER BY id ASC`
);
if (limonenes.length > 1) {
  const keepId = limonenes[0].id;
  const dupeIds = limonenes.slice(1).map(m => m.id);
  for (const dupeId of dupeIds) {
    // Transférer les liaisons plant_molecules
    await conn.execute(
      `UPDATE IGNORE plant_molecules SET molecule_id = ? WHERE molecule_id = ?`,
      [keepId, dupeId]
    );
    await conn.execute(`DELETE FROM plant_molecules WHERE molecule_id = ?`, [dupeId]);
    // Transférer les liaisons molecule_plant_sources
    await conn.execute(
      `UPDATE IGNORE molecule_plant_sources SET molecule_id = ? WHERE molecule_id = ?`,
      [keepId, dupeId]
    ).catch(() => {});
    await conn.execute(`DELETE FROM molecule_plant_sources WHERE molecule_id = ?`, [dupeId]).catch(() => {});
    // Transférer les liaisons molecule_synergies
    await conn.execute(
      `UPDATE IGNORE molecule_synergies SET molecule_a_id = ? WHERE molecule_a_id = ?`,
      [keepId, dupeId]
    ).catch(() => {});
    await conn.execute(
      `UPDATE IGNORE molecule_synergies SET molecule_b_id = ? WHERE molecule_b_id = ?`,
      [keepId, dupeId]
    ).catch(() => {});
    await conn.execute(`DELETE FROM molecule_synergies WHERE molecule_a_id = ? OR molecule_b_id = ?`, [dupeId, dupeId]).catch(() => {});
    // Supprimer le doublon
    await conn.execute(`DELETE FROM molecules WHERE id = ?`, [dupeId]);
    console.log(`  ✅ Doublon Limonène [${dupeId}] fusionné dans [${keepId}]`);
    merged++;
  }
} else {
  console.log('  ✅ Aucun doublon Limonène');
}

// ─── ÉTAPE 3 : Nouvelles molécules pour familles sous-représentées ─────────────
console.log('\n=== ÉTAPE 3 : Nouvelles molécules prioritaires ===');

const newMolecules = [
  // Aldéhydes marins (guideline prioritaire)
  {
    name: 'Aldéhyde C-11 undécylénique',
    formula: 'C11H20O',
    family: 'Aldéhydes marins',
    olfactiveProfile: 'Marin, frais, légèrement floral, waxy',
    therapeuticProperties: 'Antimicrobien, anti-inflammatoire léger',
    notes: 'Molécule clé des accords marins en parfumerie. Présent dans les algues marines.',
    cas_number: '112-45-8',
  },
  {
    name: 'Aldéhyde C-12 MNA (méthyl-nonyl-acétaldéhyde)',
    formula: 'C12H24O',
    family: 'Aldéhydes marins',
    olfactiveProfile: 'Marin, propre, légèrement citronné, waxy',
    therapeuticProperties: 'Antimicrobien',
    notes: 'Utilisé dans Chanel N°5. Accord marin caractéristique.',
    cas_number: '110-41-8',
  },
  {
    name: 'Calone 1951',
    formula: 'C10H10O2S',
    family: 'Aldéhydes marins',
    olfactiveProfile: 'Marin, ozonic, frais, légèrement métallique',
    therapeuticProperties: 'Antimicrobien',
    notes: 'Molécule synthétique emblématique des parfums marins. Inventée en 1966.',
    cas_number: '33046-00-3',
  },
  // Phénols fumés (guideline prioritaire)
  {
    name: 'Gaïacol',
    formula: 'C7H8O2',
    family: 'Phénols fumés',
    olfactiveProfile: 'Fumé, boisé, médicinal, phénolique, légèrement épicé',
    therapeuticProperties: 'Expectorant, antimicrobien, antioxydant',
    notes: 'Principal composé fumé du bois de gaïac et des whiskies tourbés. Présent dans le tabac Latakia.',
    cas_number: '90-05-1',
  },
  {
    name: 'Syringol',
    formula: 'C8H10O3',
    family: 'Phénols fumés',
    olfactiveProfile: 'Fumé intense, boisé, goudronné, légèrement épicé',
    therapeuticProperties: 'Antimicrobien, antioxydant',
    notes: 'Produit de pyrolyse de la lignine. Caractéristique de la fumée de bois dur.',
    cas_number: '91-10-1',
  },
  {
    name: '4-Méthylguaïacol',
    formula: 'C8H10O2',
    family: 'Phénols fumés',
    olfactiveProfile: 'Fumé, épicé, clou de girofle, boisé',
    therapeuticProperties: 'Antimicrobien, antioxydant',
    notes: 'Présent dans les whiskies tourbés, le tabac Latakia, et les aliments fumés.',
    cas_number: '93-51-6',
  },
  // Minéraux (guideline prioritaire)
  {
    name: 'Géosmine',
    formula: 'C12H22O',
    family: 'Minéraux',
    olfactiveProfile: 'Terreux, humide, pluie sur terre sèche, champignon',
    therapeuticProperties: 'Indicateur olfactif de présence bactérienne (Streptomyces)',
    notes: 'Molécule responsable de l\'odeur de la pluie (pétrichor). Produite par les bactéries du sol.',
    cas_number: '19700-21-1',
  },
  {
    name: '2-Méthylisobornéol',
    formula: 'C11H20O',
    family: 'Minéraux',
    olfactiveProfile: 'Terreux, moisi, champignon, légèrement camphré',
    therapeuticProperties: 'Indicateur de contamination de l\'eau',
    notes: 'Co-produit avec la géosmine par les bactéries du sol. Seuil de détection très bas.',
    cas_number: '2371-42-8',
  },
  {
    name: 'Petrichor accord',
    formula: 'Mélange',
    family: 'Minéraux',
    olfactiveProfile: 'Pluie sur terre sèche, minéral, frais, terreux',
    therapeuticProperties: 'Effet apaisant documenté',
    notes: 'Accord complexe : géosmine + huiles végétales oxydées + composés minéraux. Terme créé par Bear & Thomas (1964).',
    cas_number: null,
  },
  // Accords métalliques (guideline prioritaire)
  {
    name: 'Acétate de rose',
    formula: 'C12H20O2',
    family: 'Accords métalliques',
    olfactiveProfile: 'Métallique, rosé, légèrement fruité',
    therapeuticProperties: 'Antimicrobien léger',
    notes: 'Composé métallique-floral utilisé en parfumerie pour créer des accords roses métalliques.',
    cas_number: '16409-44-2',
  },
  {
    name: 'Méthyl mercaptan',
    formula: 'CH4S',
    family: 'Accords métalliques',
    olfactiveProfile: 'Métallique, soufré, légèrement chou, très bas seuil',
    therapeuticProperties: 'Indicateur de fermentation',
    notes: 'Composé soufré à seuil de détection extrêmement bas. Contribue aux accords métalliques complexes.',
    cas_number: '74-93-1',
  },
  // Norisoprénoïdes (guideline prioritaire)
  {
    name: 'Bêta-ionone',
    formula: 'C13H20O',
    family: 'Norisoprénoïdes',
    olfactiveProfile: 'Violette, boisé, légèrement fruité, cèdre',
    therapeuticProperties: 'Antioxydant, potentiel anti-cancéreux (études in vitro)',
    notes: 'Norisoprénoïde majeur des roses et violettes. Produit de dégradation des caroténoïdes.',
    cas_number: '14901-07-6',
  },
  {
    name: 'Alpha-ionone',
    formula: 'C13H20O',
    family: 'Norisoprénoïdes',
    olfactiveProfile: 'Violette, fruitée, légèrement boisée, plus florale que la bêta',
    therapeuticProperties: 'Antioxydant',
    notes: 'Isomère de la bêta-ionone. Présent dans les roses, violettes, framboises.',
    cas_number: '127-41-3',
  },
  {
    name: 'Bêta-damascone',
    formula: 'C13H20O',
    family: 'Norisoprénoïdes',
    olfactiveProfile: 'Rose, fruité, légèrement épicé, miel',
    therapeuticProperties: 'Antioxydant',
    notes: 'Norisoprénoïde clé des roses et du tabac. Produit de dégradation du bêta-carotène.',
    cas_number: '23726-91-2',
  },
  // Pyrazines (guideline prioritaire)
  {
    name: '2-Méthoxypyrazine',
    formula: 'C5H6N2O',
    family: 'Pyrazines',
    olfactiveProfile: 'Poivron vert, herbacé, légèrement terreux',
    therapeuticProperties: 'Indicateur de maturité des raisins',
    notes: 'Pyrazine caractéristique des vins Sauvignon Blanc et Cabernet Sauvignon.',
    cas_number: '3149-28-8',
  },
  {
    name: '2-Isobutyl-3-méthoxypyrazine',
    formula: 'C9H14N2O',
    family: 'Pyrazines',
    olfactiveProfile: 'Poivron vert intense, végétal, légèrement terreux',
    therapeuticProperties: 'Indicateur de maturité des raisins',
    notes: 'Pyrazine la plus puissante olfactivement. Seuil de détection : 2 ng/L dans l\'eau.',
    cas_number: '24683-00-9',
  },
  {
    name: '2-Acétylpyrazine',
    formula: 'C6H6N2O',
    family: 'Pyrazines',
    olfactiveProfile: 'Grillé, noisette, pain, légèrement fumé',
    therapeuticProperties: 'Antioxydant',
    notes: 'Pyrazine formée lors de la réaction de Maillard. Présente dans le café, le pain grillé, le tabac.',
    cas_number: '22047-25-2',
  },
  // Cétones terpéniques (guideline prioritaire)
  {
    name: 'Thuyone',
    formula: 'C10H16O',
    family: 'Cétones terpéniques',
    olfactiveProfile: 'Herbacé, menthé, légèrement camphré, absinthe',
    therapeuticProperties: 'Neurotoxique à haute dose, vermifuge traditionnel',
    notes: 'Cétone terpénique de l\'absinthe, sauge et thuya. Responsable des effets psychoactifs de l\'absinthe.',
    cas_number: '546-80-5',
  },
  {
    name: 'Pulegone',
    formula: 'C10H16O',
    family: 'Cétones terpéniques',
    olfactiveProfile: 'Menthe poivrée, camphré, légèrement fruité',
    therapeuticProperties: 'Antispasmodique, insectifuge, hépatotoxique à haute dose',
    notes: 'Cétone terpénique principale de la menthe pouliot. Précurseur du menthol.',
    cas_number: '89-82-7',
  },
  {
    name: 'Pipéritone',
    formula: 'C10H16O',
    family: 'Cétones terpéniques',
    olfactiveProfile: 'Menthe, herbacé, légèrement boisé',
    therapeuticProperties: 'Antifongique, antibactérien',
    notes: 'Cétone terpénique de la menthe des champs. Précurseur de synthèse du menthol.',
    cas_number: '89-81-6',
  },
  // Esters terpéniques (guideline prioritaire)
  {
    name: 'Acétate de géranyle',
    formula: 'C12H20O2',
    family: 'Esters terpéniques',
    olfactiveProfile: 'Floral, rosé, fruité, légèrement boisé',
    therapeuticProperties: 'Antimicrobien, anti-inflammatoire',
    notes: 'Ester terpénique majeur des huiles essentielles de géranium, rose, palmarosa.',
    cas_number: '105-87-3',
  },
  {
    name: 'Acétate de néryle',
    formula: 'C12H20O2',
    family: 'Esters terpéniques',
    olfactiveProfile: 'Floral, rosé, légèrement fruité, néroli',
    therapeuticProperties: 'Antimicrobien, sédatif léger',
    notes: 'Ester terpénique du néroli et de la bergamote. Isomère cis de l\'acétate de géranyle.',
    cas_number: '141-12-8',
  },
  {
    name: 'Acétate de citronellyle',
    formula: 'C12H22O2',
    family: 'Esters terpéniques',
    olfactiveProfile: 'Rosé, fruité, légèrement citronné',
    therapeuticProperties: 'Antimicrobien, insectifuge',
    notes: 'Ester terpénique du géranium rosat. Contribue à la note rose-citron.',
    cas_number: '150-84-5',
  },
  // Terpènes floraux (guideline prioritaire)
  {
    name: 'Nérolidol',
    formula: 'C15H26O',
    family: 'Terpènes floraux',
    olfactiveProfile: 'Floral, boisé, légèrement fruité, néroli',
    therapeuticProperties: 'Antimicrobien, anti-parasitaire, anxiolytique',
    notes: 'Sesquiterpène floral présent dans la néroli, jasmin, lavande. Potentiel antiparasitaire documenté.',
    cas_number: '7212-44-4',
  },
  {
    name: 'Farnésol',
    formula: 'C15H26O',
    family: 'Terpènes floraux',
    olfactiveProfile: 'Floral délicat, légèrement boisé, muguet, rose',
    therapeuticProperties: 'Antimicrobien, anti-biofilm, potentiel anti-cancéreux',
    notes: 'Sesquiterpène floral présent dans le tilleul, rose, jasmin. Régulateur de croissance fongique.',
    cas_number: '4602-84-0',
  },
  {
    name: 'Nootkatone',
    formula: 'C15H22O',
    family: 'Terpènes floraux',
    olfactiveProfile: 'Pamplemousse, agrume, légèrement boisé, frais',
    therapeuticProperties: 'Insectifuge puissant (EPA approuvé), stimulant métabolique',
    notes: 'Sesquiterpène caractéristique du pamplemousse. Approuvé par l\'EPA comme insectifuge.',
    cas_number: '4674-50-4',
  },
];

for (const mol of newMolecules) {
  // Vérifier si la molécule existe déjà
  const [existing] = await conn.execute(
    `SELECT id FROM molecules WHERE LOWER(name) = LOWER(?)`,
    [mol.name]
  );
  
  if (existing.length > 0) {
    // Mettre à jour si des champs manquent
    await conn.execute(
      `UPDATE molecules SET 
        family = COALESCE(NULLIF(family, ''), ?),
        olfactiveProfile = COALESCE(NULLIF(olfactiveProfile, ''), ?),
        therapeuticProperties = COALESCE(NULLIF(therapeuticProperties, ''), ?),
        notes = COALESCE(NULLIF(notes, ''), ?)
      WHERE id = ?`,
      [mol.family, mol.olfactiveProfile, mol.therapeuticProperties, mol.notes, existing[0].id]
    );
    console.log(`  🔄 Mise à jour: ${mol.name} (famille: ${mol.family})`);
    updated++;
  } else {
    // Créer la nouvelle molécule
    await conn.execute(
      `INSERT INTO molecules (name, formula, family, olfactiveProfile, therapeuticProperties, notes, cas_number, status, validation_status)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'validated', 'valide')`,
      [mol.name, mol.formula || null, mol.family, mol.olfactiveProfile, mol.therapeuticProperties, mol.notes, mol.cas_number || null]
    );
    console.log(`  ✅ Créée: ${mol.name} (famille: ${mol.family})`);
    created++;
  }
}

// ─── ÉTAPE 4 : Enrichissement des propriétés thérapeutiques ───────────────────
console.log('\n=== ÉTAPE 4 : Propriétés thérapeutiques des molécules clés ===');

const therapeuticUpdates = [
  { name: 'Myrcène', props: 'Analgésique, sédatif, anti-inflammatoire, relaxant musculaire. Effet entourage avec le THC. Seuil de détection : 0.5 mg/L.' },
  { name: 'Limonène', props: 'Anxiolytique, antidépresseur, antifongique, immunostimulant. Potentiel anti-cancéreux (études cliniques phase I). Solvant naturel.' },
  { name: 'Linalol', props: 'Anxiolytique, sédatif, analgésique, antimicrobien. Réduit l\'anxiété par modulation des récepteurs GABA. Anticonvulsivant.' },
  { name: 'Bêta-caryophyllène', props: 'Anti-inflammatoire puissant (agoniste CB2), analgésique, gastroprotecteur, anxiolytique. Seul terpène connu à activer les récepteurs cannabinoïdes.' },
  { name: 'Alpha-pinène', props: 'Bronchodilatateur, anti-inflammatoire, antimicrobien, mémoire (inhibiteur AChE). Contre les effets amnésiques du THC.' },
  { name: 'Bêta-pinène', props: 'Antimicrobien, anti-inflammatoire, bronchodilatateur. Synergique avec l\'alpha-pinène.' },
  { name: 'Terpinolène', props: 'Sédatif, antioxydant, antimicrobien, potentiel anti-cancéreux (études in vitro). Présent dans les variétés sativa.' },
  { name: 'Ocimène', props: 'Antifongique, antimicrobien, insectifuge. Propriétés anti-inflammatoires documentées.' },
  { name: 'Humulène', props: 'Anti-inflammatoire, anorexigène, antibactérien. Isomère du bêta-caryophyllène. Présent dans le houblon.' },
  { name: 'Géraniol', props: 'Antimicrobien, insectifuge, neuroprotecteur, antioxydant. Potentiel anti-cancéreux (études in vitro). Répulsif contre les moustiques.' },
  { name: 'Nérol', props: 'Antimicrobien, sédatif léger, anti-inflammatoire. Isomère cis du géraniol.' },
  { name: 'Citronellol', props: 'Antimicrobien, insectifuge, anti-inflammatoire, hypotenseur. Composant majeur des huiles de rose et géranium.' },
  { name: 'Eugénol', props: 'Analgésique local, antimicrobien puissant, anti-inflammatoire, antioxydant. Utilisé en dentisterie. Inhibe COX-2.' },
  { name: 'Thymol', props: 'Antimicrobien puissant, antifongique, antioxydant, expectorant. Principe actif du Listerine. GRAS (FDA).' },
  { name: 'Carvacrol', props: 'Antimicrobien puissant, antifongique, anti-inflammatoire, antioxydant. Synergique avec le thymol.' },
  { name: 'Menthol', props: 'Analgésique topique, décongestionnant, antimicrobien, antispasmodique. Active les récepteurs TRPM8 (froid).' },
  { name: '1,8-Cinéole', props: 'Expectorant, bronchodilatateur, antimicrobien, anti-inflammatoire. Améliore la cognition. Composant principal de l\'eucalyptus.' },
  { name: 'Camphre', props: 'Analgésique topique, antimicrobien, décongestionnant, rubéfiant. Neurotoxique à haute dose.' },
  { name: 'Borneol', props: 'Antimicrobien, anti-inflammatoire, analgésique, neuroprotecteur. Améliore la perméabilité de la barrière hémato-encéphalique.' },
  { name: 'Acétate de linalyle', props: 'Sédatif, anxiolytique, anti-inflammatoire. Principal composant de la lavande vraie et bergamote.' },
  { name: 'Fenchone', props: 'Expectorant, antimicrobien, stimulant digestif. Principal composant du fenouil.' },
  { name: 'Carvone', props: 'Antimicrobien, antispasmodique, stimulant digestif. L-carvone (menthe verte), D-carvone (carvi).' },
  { name: 'Pulegone', props: 'Antispasmodique, insectifuge, hépatotoxique à haute dose. Précurseur du menthol.' },
  { name: 'Sabinène', props: 'Antimicrobien, anti-inflammatoire, antioxydant. Présent dans le poivre noir, la muscade.' },
  { name: 'Terpinène-4-ol', props: 'Antimicrobien puissant, anti-inflammatoire, immunostimulant. Principe actif de l\'arbre à thé (tea tree).' },
  { name: 'Alpha-terpinéol', props: 'Sédatif, antimicrobien, antioxydant, anti-inflammatoire. Présent dans le pin, eucalyptus, tea tree.' },
  { name: 'Néroldiol', props: 'Antimicrobien, anti-parasitaire, anxiolytique. Présent dans la néroli, jasmin, lavande.' },
  { name: 'Farnésène', props: 'Phéromone d\'alarme des pucerons, insectifuge, antimicrobien. Présent dans les pommes, camomille.' },
  { name: 'Zingibérène', props: 'Anti-inflammatoire, antimicrobien, antioxydant. Principal sesquiterpène du gingembre.' },
  { name: 'Bisabolol', props: 'Anti-inflammatoire, antimicrobien, cicatrisant, apaisant cutané. Composant majeur de la camomille allemande.' },
];

for (const { name, props } of therapeuticUpdates) {
  const [r] = await conn.execute(
    `UPDATE molecules SET therapeuticProperties = ? 
     WHERE LOWER(name) = LOWER(?) AND (therapeuticProperties IS NULL OR therapeuticProperties = '')`,
    [props, name]
  );
  if (r.affectedRows > 0) {
    console.log(`  ✅ Propriétés thérapeutiques: ${name}`);
    updated++;
  }
}

// ─── RÉSUMÉ ───────────────────────────────────────────────────────────────────
console.log('\n=== RÉSUMÉ ===');
console.log(`Molécules créées  : ${created}`);
console.log(`Molécules mises à jour : ${updated}`);
console.log(`Doublons fusionnés : ${merged}`);

// Stats finales
const [[final]] = await conn.execute(`
  SELECT 
    COUNT(*) as total,
    SUM(therapeuticProperties IS NOT NULL AND therapeuticProperties != '') as has_therapeutic,
    SUM(olfactiveProfile IS NOT NULL AND olfactiveProfile != '') as has_olfactive
  FROM molecules
`);
console.log(`\nCouverture thérapeutique : ${final.has_therapeutic}/${final.total} (${Math.round(final.has_therapeutic/final.total*100)}%)`);
console.log(`Couverture olfactive     : ${final.has_olfactive}/${final.total} (${Math.round(final.has_olfactive/final.total*100)}%)`);

await conn.end();
console.log('\n✅ Enrichissement terminé');
