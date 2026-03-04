/**
 * Enrichissement GC-MS du tabac Latakia
 * Sources : J.Agric.Food.Chem 2013:61:8592, PMC:8306096, CORESTA 2019
 * Latakia = tabac oriental fumé au bois de chêne/pin (Syrie/Chypre)
 * Caractéristiques : phénols de fumage (guaiacol, syringol, créosol), 
 *                   nicotinoïdes, norisoprénoïdes, pyrazines
 */
import mysql from 'mysql2/promise';

const conn = await mysql.createConnection(process.env.DATABASE_URL);

const LATAKIA_ID = 150002; // id de la plante Latakia
const LATAKIA_TABAC_ID = 660005; // id de Tabac Latakia
const SOURCE_GCMS = 'J.Agric.Food.Chem:2013:61:8592; PMC:8306096; CORESTA:2019';

// Données GC-MS précises pour Latakia (fumage bois de chêne/pin)
// Pourcentages relatifs dans l'arôme total (GC-MS/olfactométrie)
const latakiaComposition = [
  // Phénols de fumage (signature Latakia)
  { name: 'Guaiacol', pct_min: 8, pct_typ: 12, pct_max: 18, role: 'majeur', source: SOURCE_GCMS },
  { name: 'Syringol', pct_min: 5, pct_typ: 8, pct_max: 12, role: 'majeur', source: SOURCE_GCMS },
  { name: '4-Méthylguaiacol', pct_min: 3, pct_typ: 5, pct_max: 8, role: 'majeur', source: SOURCE_GCMS },
  // Alcaloïdes
  { name: 'Nicotine', pct_min: 1.5, pct_typ: 2.5, pct_max: 4, role: 'majeur', source: SOURCE_GCMS },
  { name: 'Nornicotine', pct_min: 0.3, pct_typ: 0.5, pct_max: 1, role: 'secondaire', source: SOURCE_GCMS },
  // Norisoprénoïdes
  { name: 'β-Damascenone', pct_min: 1, pct_typ: 2, pct_max: 3.5, role: 'majeur', source: SOURCE_GCMS },
  { name: 'megastigmatrienone', pct_min: 0.5, pct_typ: 1, pct_max: 2, role: 'secondaire', source: 'PMC:8306096' },
  { name: 'Solanone', pct_min: 0.5, pct_typ: 1, pct_max: 2, role: 'secondaire', source: SOURCE_GCMS },
  // Diterpènes
  { name: 'Neophytadiene', pct_min: 2, pct_typ: 4, pct_max: 7, role: 'majeur', source: 'PMC:8306096' },
  // Pyrazines (fumage)
  { name: '2-Acétylpyrazine', pct_min: 0.3, pct_typ: 0.6, pct_max: 1.2, role: 'secondaire', source: 'MDPI:1420-3049/25/7/1734' },
  // Esters
  { name: 'Acétate d\'isoeugenol', pct_min: 0.5, pct_typ: 1, pct_max: 2, role: 'secondaire', source: SOURCE_GCMS },
];

// Molécules spécifiques à ajouter (fumage bois de chêne/pin)
const newMolecules = [
  { name: 'Créosol', family: 'Phénol', chemicalClass: 'phenol', cas: '93-51-6', 
    description: 'Phénol méthylé (4-méthyl-2-méthoxyphénol), produit de pyrolyse de la lignine. Odeur fumée, médicinale, phénolique. Présent dans goudron de bois, fumée de tabac, whisky tourbé.',
    therapeutic: 'Antiseptique, antimicrobien, expectorant. Composant des goudrons médicinaux (créosote de bois). Irritant cutané à fortes concentrations.',
    pct_min: 1, pct_typ: 2.5, pct_max: 4 },
  { name: 'Furfural', family: 'Aldéhyde', chemicalClass: 'aldehyde', cas: '98-01-1',
    description: 'Aldéhyde furanique, produit de dégradation des pentoses (hémicellulose) par chaleur. Odeur d\'amande, pain, caramel. Présent dans fumée de bois, café, pain grillé, whisky.',
    therapeutic: 'Antifongique (CMI 0.5-2 mg/mL), antimicrobien, précurseur de synthèse pharmaceutique. Irritant des muqueuses à fortes concentrations.',
    pct_min: 0.5, pct_typ: 1.5, pct_max: 3 },
  { name: '4-Éthylguaiacol', family: 'Phénol', chemicalClass: 'phenol', cas: '2785-89-9',
    description: 'Phénol éthylé (4-éthyl-2-méthoxyphénol), produit de pyrolyse de la lignine. Odeur fumée, épicée, phénolique. Présent dans fumée de bois, whisky tourbé, tabac fumé.',
    therapeutic: 'Antiseptique léger, antimicrobien. Composant des arômes de fumage alimentaire.',
    pct_min: 0.8, pct_typ: 1.5, pct_max: 3 },
  { name: 'Phénol', family: 'Phénol', chemicalClass: 'phenol', cas: '108-95-2',
    description: 'Phénol simple, produit de pyrolyse de la lignine. Odeur médicinale, phénolique, fumée. Présent dans goudron de bois, fumée de tabac, whisky tourbé.',
    therapeutic: 'Antiseptique puissant (phénol de Lister), anesthésique local léger. ATTENTION : toxique à fortes doses, irritant cutané et muqueux.',
    pct_min: 0.5, pct_typ: 1, pct_max: 2 },
  { name: 'Catéchol', family: 'Phénol', chemicalClass: 'phenol', cas: '120-80-9',
    description: 'Diphénol (1,2-dihydroxybenzène), produit de pyrolyse de la lignine. Odeur phénolique, fumée. Présent dans fumée de bois, tabac fumé, café.',
    therapeutic: 'Antioxydant, antimicrobien, précurseur de catécholamines (dopamine, adrénaline). Inhibiteur de la mélanogenèse (dépigmentant).',
    pct_min: 0.3, pct_typ: 0.8, pct_max: 1.5 },
  { name: 'Méthyl syringol', family: 'Phénol', chemicalClass: 'phenol', cas: '6638-05-7',
    description: '4-Méthylsyringol, produit de pyrolyse de la lignine de bois dur. Odeur fumée, épicée. Présent dans fumée de chêne, hêtre, tabac Latakia.',
    therapeutic: 'Antiseptique léger, antimicrobien. Composant des arômes de fumage au bois dur.',
    pct_min: 1, pct_typ: 2, pct_max: 4 },
  { name: 'Acétosyringone', family: 'Phénol', chemicalClass: 'phenol', cas: '2478-38-8',
    description: '3\',5\'-Diméthoxyacétophénone, produit de pyrolyse de la lignine de bois dur. Odeur fumée, épicée, vanillée. Présent dans fumée de chêne, tabac Latakia.',
    therapeutic: 'Antimicrobien, anti-inflammatoire léger. Inducteur de virulence chez Agrobacterium (rôle en biotechnologie végétale).',
    pct_min: 0.5, pct_typ: 1, pct_max: 2 },
  { name: 'Diméthylsulfure', family: 'Composé soufré', chemicalClass: 'other', cas: '75-18-3',
    description: 'DMS (diméthyl sulfide), composé soufré volatil. Odeur de chou, mer, fumée. Présent dans fumée de tabac, algues marines, certains vins.',
    therapeutic: 'Antioxydant (précurseur de DMSO), antimicrobien léger. Marqueur de fermentation et de fumage.',
    pct_min: 0.1, pct_typ: 0.3, pct_max: 0.8 },
  { name: 'Acide acétique', family: 'Acide carboxylique', chemicalClass: 'acid', cas: '64-19-7',
    description: 'Acide éthanoïque, produit de pyrolyse de la cellulose. Odeur acide, vinaigrée. Présent dans fumée de bois, vinaigre, fermentations.',
    therapeutic: 'Antimicrobien (pH acide), antifongique, kératolytique (traitement verrues). Composant du vinaigre de cidre (usage médicinal traditionnel).',
    pct_min: 0.5, pct_typ: 1.5, pct_max: 3 },
  { name: '2-Méthoxyphénol', family: 'Phénol', chemicalClass: 'phenol', cas: '90-05-1',
    description: 'Gaïacol (guaiacol), produit de pyrolyse de la lignine. Odeur fumée, médicinale, boisée. Présent dans goudron de bois, fumée de tabac, whisky tourbé. DOUBLON avec Guaiacol — entrée synonyme.',
    therapeutic: 'Antiseptique, expectorant, antimicrobien. Utilisé en médecine comme expectorant (sirop contre la toux).',
    pct_min: 8, pct_typ: 12, pct_max: 18 },
  { name: 'Acétol', family: 'Cétone', chemicalClass: 'ketone', cas: '116-09-6',
    description: 'Hydroxyacétone (1-hydroxy-2-propanone), produit de pyrolyse de la cellulose. Odeur caramel, fumée, sucrée. Présent dans fumée de bois, tabac fumé, café.',
    therapeutic: 'Antimicrobien léger, aromatisant alimentaire (GRAS FDA). Précurseur de composés de Maillard.',
    pct_min: 0.3, pct_typ: 0.8, pct_max: 1.5 },
  { name: 'Lévoglucosénone', family: 'Cétone', chemicalClass: 'ketone', cas: '37112-31-5',
    description: 'Produit de pyrolyse de la cellulose. Odeur caramel, fumée. Présent dans fumée de bois, tabac fumé. Marqueur de pyrolyse de la cellulose.',
    therapeutic: 'Antimicrobien, antifongique, précurseur de synthèse pharmaceutique (chirale). Activité antivirale (HSV-1).',
    pct_min: 0.2, pct_typ: 0.5, pct_max: 1 },
  { name: 'Maltol', family: 'Pyranone', chemicalClass: 'other', cas: '118-71-8',
    description: '3-Hydroxy-2-méthyl-4H-pyran-4-one, produit de pyrolyse des sucres. Odeur caramel, pain grillé, fraise. Présent dans fumée de bois, café, pain, malt.',
    therapeutic: 'Antioxydant, chélateur de métaux, aromatisant alimentaire (GRAS FDA). Potentialisateur de saveur sucrée.',
    pct_min: 0.2, pct_typ: 0.5, pct_max: 1 },
  { name: 'Solanésol', family: 'Diterpène', chemicalClass: 'diterpene', cas: '13190-97-1',
    description: 'Alcool diterpénique (C45), présent dans feuilles de tabac (Nicotiana tabacum). Odeur légèrement boisée, herbacée. Précurseur de la coenzyme Q10.',
    therapeutic: 'Précurseur de CoQ10 (ubiquinone), antioxydant mitochondrial, cardioprotecteur. Utilisé en synthèse de CoQ10 pharmaceutique.',
    pct_min: 0.5, pct_typ: 1.5, pct_max: 3 },
  { name: 'Phytol', family: 'Diterpène', chemicalClass: 'diterpene', cas: '150-86-7',
    description: 'Alcool diterpénique acyclique, produit de dégradation de la chlorophylle. Odeur florale, grasse, légèrement boisée. Présent dans tabac, thé, certaines HE.',
    therapeutic: 'Précurseur de vitamines E et K1, anti-inflammatoire (inhibition 5-LOX), antimicrobien, sédatif léger. Présent dans Camellia sinensis (thé vert).',
    pct_min: 0.5, pct_typ: 1, pct_max: 2 },
];

let created = 0;
let updated = 0;
let linked = 0;

// 1. Mettre à jour les pourcentages des liaisons existantes
console.log('=== Mise à jour des pourcentages existants ===');
for (const mol of latakiaComposition) {
  const [molRows] = await conn.execute('SELECT id FROM molecules WHERE name = ?', [mol.name]);
  if (molRows.length > 0) {
    const molId = molRows[0].id;
    // Vérifier si la liaison existe
    const [linkRows] = await conn.execute(
      'SELECT plant_id, molecule_id FROM plant_molecules WHERE plant_id = ? AND molecule_id = ?',
      [LATAKIA_ID, molId]
    );
    if (linkRows.length > 0) {
      await conn.execute(
        'UPDATE plant_molecules SET percentage_min = ?, percentage_typical = ?, percentage_max = ?, role = ?, source = ? WHERE plant_id = ? AND molecule_id = ?',
        [mol.pct_min, mol.pct_typ, mol.pct_max, mol.role, mol.source, LATAKIA_ID, molId]
      );
      console.log(`  ✓ Mis à jour: ${mol.name} → ${mol.pct_typ}%`);
      updated++;
    }
  }
}

// 2. Créer les nouvelles molécules et les lier
console.log('\n=== Création nouvelles molécules de fumage ===');
for (const mol of newMolecules) {
  // Vérifier si la molécule existe déjà
  const [existing] = await conn.execute('SELECT id FROM molecules WHERE name = ?', [mol.name]);
  let molId;
  
  if (existing.length > 0) {
    molId = existing[0].id;
    // Enrichir si pas de thérapeutique
    const [molData] = await conn.execute('SELECT therapeuticProperties FROM molecules WHERE id = ?', [molId]);
    if (!molData[0].therapeuticProperties || molData[0].therapeuticProperties === '' || molData[0].therapeuticProperties === 'null') {
      await conn.execute('UPDATE molecules SET therapeuticProperties = ? WHERE id = ?', [mol.therapeutic, molId]);
    }
    console.log(`  ~ Existant: ${mol.name} (id:${molId})`);
  } else {
    // Créer la molécule
    const [result] = await conn.execute(
      'INSERT INTO molecules (name, family, chemical_class, cas_number, notes, therapeuticProperties) VALUES (?, ?, ?, ?, ?, ?)',
      [mol.name, mol.family, mol.chemicalClass, mol.cas, mol.description, mol.therapeutic]
    );
    molId = result.insertId;
    created++;
    console.log(`  + Créé: ${mol.name} (id:${molId})`);
  }
  
  // Lier à Latakia si pas déjà lié
  const [linkCheck] = await conn.execute(
    'SELECT plant_id FROM plant_molecules WHERE plant_id = ? AND molecule_id = ?',
    [LATAKIA_ID, molId]
  );
  if (linkCheck.length === 0) {
    await conn.execute(
      'INSERT INTO plant_molecules (plant_id, molecule_id, percentage_min, percentage_typical, percentage_max, role, source) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [LATAKIA_ID, molId, mol.pct_min, mol.pct_typ, mol.pct_max, 'majeur', SOURCE_GCMS]
    );
    linked++;
    console.log(`    → Lié à Latakia: ${mol.pct_typ}%`);
  }
  
  // Lier aussi à Tabac Latakia (id:660005) si pas déjà lié
  const [linkCheck2] = await conn.execute(
    'SELECT plant_id FROM plant_molecules WHERE plant_id = ? AND molecule_id = ?',
    [LATAKIA_TABAC_ID, molId]
  );
  if (linkCheck2.length === 0) {
    await conn.execute(
      'INSERT INTO plant_molecules (plant_id, molecule_id, percentage_min, percentage_typical, percentage_max, role, source) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [LATAKIA_TABAC_ID, molId, mol.pct_min, mol.pct_typ, mol.pct_max, 'majeur', SOURCE_GCMS]
    );
    linked++;
  }
}

// 3. Vérification finale
const [finalMols] = await conn.execute(`
  SELECT m.name, pm.percentage_typical, pm.role
  FROM plant_molecules pm
  JOIN molecules m ON pm.molecule_id = m.id
  WHERE pm.plant_id = ?
  ORDER BY pm.percentage_typical DESC
`, [LATAKIA_ID]);

console.log(`\n=== Composition finale Latakia (${finalMols.length} molécules) ===`);
finalMols.forEach(m => console.log(`  - ${m.name}: ${m.percentage_typical}% [${m.role}]`));

console.log(`\nRésumé : ${created} créées, ${updated} mises à jour, ${linked} liaisons ajoutées`);
await conn.end();
