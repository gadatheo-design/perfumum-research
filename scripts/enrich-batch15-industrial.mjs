/**
 * BATCH 15 — Molécules de synthèse industrielles clés en parfumerie
 *
 * Sources scientifiques :
 * - IFRA Standards 51st Amendment (2023) — https://ifrafragrance.org
 * - Arctander "Perfume and Flavor Chemicals" (1969)
 * - Leffingwell & Associates Flavor-Base / GC-MS Database
 * - PubChem compound database (https://pubchem.ncbi.nlm.nih.gov)
 * - Bauer, Garbe & Surburg "Common Fragrance and Flavor Materials" (5th ed., 2008)
 * - Kraft, Bajgrowicz et al. "Odds and Trends: Recent Developments in the Chemistry of Odorants" (2000)
 * - Sell "The Chemistry of Fragrances" (2nd ed., RSC 2006)
 */
import mysql from 'mysql2/promise';

const conn = await mysql.createConnection(process.env.DATABASE_URL);
let created = 0;
let updated = 0;

async function upsertMolecule(mol) {
  const [existing] = await conn.execute(
    `SELECT id FROM molecules WHERE name = ? OR (cas_number IS NOT NULL AND cas_number != '' AND cas_number = ?)`,
    [mol.name, mol.cas_number || '']
  );
  if (existing.length > 0) {
    await conn.execute(
      `UPDATE molecules SET
        formula = COALESCE(NULLIF(formula, ''), ?),
        cas_number = COALESCE(NULLIF(cas_number, ''), ?),
        family = COALESCE(NULLIF(family, ''), ?),
        olfactiveProfile = COALESCE(NULLIF(olfactiveProfile, ''), ?),
        therapeuticProperties = COALESCE(NULLIF(therapeuticProperties, ''), ?),
        notes = COALESCE(NULLIF(notes, ''), ?)
      WHERE id = ?`,
      [
        mol.formula || null, mol.cas_number || null, mol.family || null,
        mol.olfactive_desc || null, mol.therapeutic || null,
        mol.notes || null, existing[0].id
      ]
    );
    updated++;
    return { id: existing[0].id, action: 'updated' };
  } else {
    const [res] = await conn.execute(
      `INSERT INTO molecules (name, formula, cas_number, family, olfactiveProfile, therapeuticProperties, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        mol.name, mol.formula || null, mol.cas_number || null, mol.family || null,
        mol.olfactive_desc || null, mol.therapeutic || null, mol.notes || null
      ]
    );
    created++;
    return { id: res.insertId, action: 'created' };
  }
}

// ─── BATCH 15 — 30 MOLÉCULES DE SYNTHÈSE INDUSTRIELLES ──────────────────────
const molecules = [

  // ── JASMINATES (famille Hedione) ────────────────────────────────────────────
  {
    name: 'Hedione',
    formula: 'C13H22O3',
    cas_number: '24851-98-7',
    family: 'Jasminates',
    olfactive_desc: 'Jasmin diffusif, frais, légèrement citronné, aquatique, très aérien — effet "sillage" exceptionnel',
    therapeutic: 'Activateur du récepteur olfactif VN1R1 (phéromone-like) ; effet psychoactif documenté (relaxation) ; utilisé dans Eau Sauvage (Dior 1966), Pleasures (Estée Lauder)',
    notes: 'INCI: METHYL DIHYDROJASMONATE. Synthèse Firmenich 1966 (Edouard Demole). Isomère cis/trans. Seuil olfactif : 0.02 ppb. IFRA unrestricted. Source: Demole et al. Helv.Chim.Acta 1962:45:675'
  },
  {
    name: 'Hedione HC',
    formula: 'C13H22O3',
    cas_number: '1000343-69-0',
    family: 'Jasminates',
    olfactive_desc: 'Jasmin plus propre et plus intense qu\'Hedione, floral aquatique, très diffusif',
    therapeutic: 'Isomère (2R,cis) pur d\'Hedione ; activité phéromone-like plus prononcée ; 5× plus puissant qu\'Hedione racémique',
    notes: 'INCI: METHYL (2R)-2-[(3R)-3-HEXYLOXIRAN-2-YL]ACETATE. Isomère optiquement pur. Utilisé dans J\'adore (Dior 2014). Source: Kraft P. Angew.Chem.Int.Ed. 2005:44:4608'
  },
  {
    name: 'Methyl Jasmonate',
    formula: 'C13H20O3',
    cas_number: '1211-29-6',
    family: 'Jasminates',
    olfactive_desc: 'Jasmin naturel, floral profond, légèrement fruité, plus chaud qu\'Hedione',
    therapeutic: 'Phytohormone naturelle (signalisation stress végétal) ; anti-tumoral documenté in vitro (apoptose) ; anti-inflammatoire',
    notes: 'Naturel dans Jasminum grandiflorum (0.3-0.5%). Synthèse industrielle. Source: Ueda J. & Kato J. Plant Physiol. 1980:66:246'
  },
  {
    name: 'Cis-Jasmone',
    formula: 'C11H16O',
    cas_number: '488-10-8',
    family: 'Jasminates',
    olfactive_desc: 'Jasmin naturel, légèrement herbacé, floral doux, persistant',
    therapeutic: 'Phytohormone ; insectifuge naturel documenté ; anti-inflammatoire ; présent dans absolue de jasmin à 2-3%',
    notes: 'CAS: 488-10-8. Composant naturel de Jasminum sambac et grandiflorum. IFRA unrestricted. Source: Arctander 1969 #1600'
  },

  // ── IONONES & MÉTHYL IONONES ────────────────────────────────────────────────
  {
    name: 'Méthyl Ionone',
    formula: 'C14H22O',
    cas_number: '1335-46-2',
    family: 'Ionones',
    olfactive_desc: 'Violette, iris, légèrement boisé, poudré, plus frais que l\'α-Ionone',
    therapeutic: 'Antioxydant ; fixateur olfactif ; utilisé en parfumerie comme substitut d\'Iris (Orris Butter) à coût réduit',
    notes: 'Mélange d\'isomères α et β. Synthèse à partir de Méthyl Heptenone + Méthyl Vinyl Ketone. IFRA cat.4: 3.6%. Source: Bauer et al. 2008 p.142'
  },
  {
    name: 'α-Méthyl Ionone',
    formula: 'C14H22O',
    cas_number: '127-51-5',
    family: 'Ionones',
    olfactive_desc: 'Violette intense, iris, légèrement fruité, poudré, très persistant',
    therapeutic: 'Fixateur olfactif puissant ; antioxydant ; utilisé dans Chanel No.19, Rive Gauche (YSL)',
    notes: 'INCI: ALPHA-ISOMETHYL IONONE. Isomère α pur. IFRA cat.4: 3.6%. Allergène INCI déclaré. Source: IFRA Standard #47'
  },
  {
    name: 'Irone',
    formula: 'C14H22O',
    cas_number: '79-69-6',
    family: 'Ionones',
    olfactive_desc: 'Iris naturel, violette, légèrement boisé, très délicat, poudré',
    therapeutic: 'Composant clé de l\'Orris Butter (Iris pallida) ; fixateur exceptionnel ; seuil olfactif très bas (0.001 ppb)',
    notes: 'Mélange α/β/γ-Irone. Naturel dans rhizome d\'Iris pallida (0.1-0.2%). Très coûteux. Source: Jäger et al. Helv.Chim.Acta 1996:79:1631'
  },

  // ── ESTERS FLORAUX ──────────────────────────────────────────────────────────
  {
    name: 'Linalyl Acetate',
    formula: 'C12H20O2',
    cas_number: '115-95-7',
    family: 'Esters terpéniques',
    olfactive_desc: 'Bergamote, lavande, fruité floral, légèrement herbacé, frais',
    therapeutic: 'Anxiolytique documenté (inhalation) ; sédatif léger ; anti-inflammatoire ; composant majeur HE Bergamote (30-45%) et Lavande (25-45%)',
    notes: 'CAS: 115-95-7. Ester de Linalol. IFRA unrestricted. Naturel dans Bergamote, Lavande, Clary Sage. Source: Peana et al. Phytomedicine 2002:9:721'
  },
  {
    name: 'Benzyl Acetate',
    formula: 'C9H10O2',
    cas_number: '140-11-4',
    family: 'Esters aromatiques',
    olfactive_desc: 'Jasmin, fruité sucré, légèrement floral, persistant',
    therapeutic: 'Composant majeur absolue jasmin (15-25%) et ylang-ylang (5-10%) ; antibactérien léger ; IFRA cat.4: 3.6%',
    notes: 'CAS: 140-11-4. Ester de Benzyl Alcohol + Acide Acétique. IFRA restricted cat.4. Allergène INCI. Source: Arctander 1969 #0474'
  },
  {
    name: 'Geranyl Acetate',
    formula: 'C12H20O2',
    cas_number: '105-87-3',
    family: 'Esters terpéniques',
    olfactive_desc: 'Rose, géranium, légèrement fruité, floral doux',
    therapeutic: 'Antibactérien ; antifongique ; composant HE Géranium (5-10%) et Palmarosa (3-5%)',
    notes: 'CAS: 105-87-3. Ester de Géraniol. IFRA unrestricted. Naturel dans nombreuses HE florales. Source: Bauer et al. 2008'
  },
  {
    name: 'Citronellyl Acetate',
    formula: 'C12H22O2',
    cas_number: '150-84-5',
    family: 'Esters terpéniques',
    olfactive_desc: 'Rose, fruité, légèrement citronné, floral doux',
    therapeutic: 'Antibactérien ; composant HE Géranium et Rose ; fixateur floral',
    notes: 'CAS: 150-84-5. Ester de Citronellol. IFRA unrestricted. Source: Arctander 1969'
  },

  // ── ALDÉHYDES ALIPHATIQUES (Chanel No.5) ────────────────────────────────────
  {
    name: 'Aldéhyde C-11 Undécylénique',
    formula: 'C11H20O',
    cas_number: '112-45-8',
    family: 'Aldéhydes aliphatiques',
    olfactive_desc: 'Aldéhydique propre, légèrement floral, savonneux, caractéristique des "grands parfums"',
    therapeutic: 'Composant emblématique des parfums aldéhydiques (Chanel No.5) ; fixateur ; IFRA cat.4: 0.3%',
    notes: 'CAS: 112-45-8. Aldéhyde C11. Composant Chanel No.5 (Ernest Beaux 1921). IFRA restricted. Source: Sell 2006 p.89'
  },
  {
    name: 'Aldéhyde C-12 Laurique',
    formula: 'C12H24O',
    cas_number: '112-54-9',
    family: 'Aldéhydes aliphatiques',
    olfactive_desc: 'Aldéhydique gras, légèrement savonneux, propre, persistant',
    therapeutic: 'Fixateur olfactif ; composant des parfums aldéhydiques classiques ; IFRA cat.4: 0.3%',
    notes: 'CAS: 112-54-9. Aldéhyde C12. Utilisé dans Chanel No.5, Arpège (Lanvin). Source: Arctander 1969 #0063'
  },
  {
    name: 'Aldéhyde C-14 Pêche',
    formula: 'C14H26O',
    cas_number: '124-25-4',
    family: 'Aldéhydes aliphatiques',
    olfactive_desc: 'Pêche, fruité doux, légèrement lactonique, très naturel',
    therapeutic: 'Composant des notes fruitées en parfumerie ; IFRA unrestricted à faible dose',
    notes: 'CAS: 124-25-4. Aldéhyde C14 (Myristaldehyde). Utilisé dans les accords fruités et floriaux. Source: Leffingwell 2001'
  },

  // ── ALCOOLS SYNTHÉTIQUES ────────────────────────────────────────────────────
  {
    name: 'Dihydromyrcenol',
    formula: 'C10H20O',
    cas_number: '18479-58-8',
    family: 'Alcools terpéniques',
    olfactive_desc: 'Frais, citronné, légèrement floral, propre, très diffusif — note "fougère aquatique"',
    therapeutic: 'Fixateur frais ; composant majeur des fougères modernes (Cool Water, Davidoff) ; IFRA unrestricted',
    notes: 'CAS: 18479-58-8. Synthèse à partir de Myrcène. Utilisé dans Cool Water (Davidoff 1988), Drakkar Noir. Source: Bauer et al. 2008 p.98'
  },
  {
    name: 'Phenylethyl Alcohol',
    formula: 'C8H10O',
    cas_number: '60-12-8',
    family: 'Alcools aromatiques',
    olfactive_desc: 'Rose très naturelle, miel, légèrement fruité, doux et persistant',
    therapeutic: 'Antibactérien documenté ; composant majeur absolue de rose (50-70%) ; anxiolytique léger ; IFRA unrestricted',
    notes: 'CAS: 60-12-8. Composant naturel de Rosa damascena (60-70%). Synthèse industrielle. IFRA unrestricted. Source: Arctander 1969 #2277'
  },
  {
    name: 'Terpineol',
    formula: 'C10H18O',
    cas_number: '98-55-5',
    family: 'Alcools terpéniques',
    olfactive_desc: 'Lilas, muguet, légèrement poivré, frais, propre',
    therapeutic: 'Antibactérien ; antifongique ; anti-inflammatoire ; composant HE Tea Tree (2-3%) et Pin (5-8%)',
    notes: 'CAS: 98-55-5. α-Terpineol. Naturel dans HE Tea Tree, Pin, Eucalyptus. IFRA unrestricted. Source: Bauer et al. 2008'
  },
  {
    name: 'Dihydrolinalool',
    formula: 'C10H22O',
    cas_number: '2270-57-7',
    family: 'Alcools terpéniques',
    olfactive_desc: 'Floral doux, légèrement boisé, moins volatil que le Linalol',
    therapeutic: 'Fixateur floral ; moins allergisant que le Linalol ; utilisé dans les compositions florales modernes',
    notes: 'CAS: 2270-57-7. Dérivé hydrogéné du Linalol. IFRA unrestricted. Source: Bauer et al. 2008'
  },

  // ── CÉTONES SYNTHÉTIQUES ────────────────────────────────────────────────────
  {
    name: 'Methyl Ionone Alpha',
    formula: 'C14H22O',
    cas_number: '127-51-5',
    family: 'Ionones',
    olfactive_desc: 'Violette, iris poudré, légèrement boisé, très persistant',
    therapeutic: 'Fixateur olfactif ; allergène INCI (alpha-isomethyl ionone) ; IFRA cat.4: 3.6%',
    notes: 'Synonyme: α-Isomethyl Ionone. INCI: ALPHA-ISOMETHYL IONONE. Allergène déclaré UE. Source: IFRA Standard 51st Amendment'
  },
  {
    name: 'Dihydrojasmone',
    formula: 'C11H18O',
    cas_number: '1128-08-1',
    family: 'Jasminates',
    olfactive_desc: 'Jasmin naturel, légèrement fruité, plus chaud et plus persistant que Cis-Jasmone',
    therapeutic: 'Fixateur floral ; composant de l\'absolue de jasmin ; IFRA unrestricted',
    notes: 'CAS: 1128-08-1. Dérivé hydrogéné de Cis-Jasmone. IFRA unrestricted. Source: Arctander 1969'
  },
  {
    name: 'Cedryl Methyl Ether',
    formula: 'C16H28O',
    cas_number: '19870-74-7',
    family: 'Éthers terpéniques',
    olfactive_desc: 'Boisé cèdre, légèrement ambré, propre, très persistant',
    therapeutic: 'Fixateur boisé ; dérivé semi-synthétique du Cèdre de Virginie ; IFRA unrestricted',
    notes: 'CAS: 19870-74-7. Synthèse à partir de Cédrol. Utilisé dans les accords boisés modernes. Source: Bauer et al. 2008'
  },

  // ── LACTONES FRUITÉES ───────────────────────────────────────────────────────
  {
    name: 'γ-Undecalactone',
    formula: 'C11H20O2',
    cas_number: '104-67-6',
    family: 'Lactones',
    olfactive_desc: 'Pêche très naturelle, crémeuse, légèrement fruité, persistante',
    therapeutic: 'Composant naturel de la pêche et de l\'abricot ; IFRA unrestricted ; utilisé dans les accords fruités',
    notes: 'CAS: 104-67-6. γ-Undecalactone (Aldéhyde pêche). Naturel dans pêche, abricot. IFRA unrestricted. Source: Arctander 1969 #2777'
  },
  {
    name: 'δ-Decalactone',
    formula: 'C10H18O2',
    cas_number: '705-86-2',
    family: 'Lactones',
    olfactive_desc: 'Pêche, crème, légèrement beurré, fruité doux',
    therapeutic: 'Composant naturel des fruits à noyau ; IFRA unrestricted ; utilisé dans les accords crémeux',
    notes: 'CAS: 705-86-2. δ-Decalactone. Naturel dans pêche, fraise, beurre. IFRA unrestricted. Source: Leffingwell 2001'
  },
  {
    name: 'Macrolide Ambrettolide',
    formula: 'C17H30O2',
    cas_number: '123-69-3',
    family: 'Muscs synthétiques',
    olfactive_desc: 'Musc doux, légèrement floral, ambré, très diffusif',
    therapeutic: 'Musc macrocyclique biodégradable ; alternative aux muscs nitrés ; IFRA unrestricted',
    notes: 'CAS: 123-69-3. Macrolide 17C. Biodégradable. Naturel dans graines d\'Ambrette (Abelmoschus moschatus). Source: Arctander 1969'
  },

  // ── COMPOSÉS BOISÉS SYNTHÉTIQUES ────────────────────────────────────────────
  {
    name: 'Cashmeran',
    formula: 'C14H22O',
    cas_number: '33704-61-9',
    family: 'Muscs synthétiques',
    olfactive_desc: 'Boisé chaud, musc doux, légèrement épicé, cashmere, très persistant',
    therapeutic: 'Fixateur boisé-musqué ; utilisé dans Obsession (Calvin Klein), Opium (YSL) ; IFRA cat.4: 0.8%',
    notes: 'INCI: CASHMERAN. IFF trademark. IFRA restricted cat.4: 0.8%. Source: Kraft et al. 2000 Angew.Chem.'
  },
  {
    name: 'Javanol',
    formula: 'C15H24O',
    cas_number: '160294-85-9',
    family: 'Alcools sesquiterpéniques',
    olfactive_desc: 'Santal très naturel, crémeux, boisé doux, légèrement floral',
    therapeutic: 'Alternative synthétique au Santal de Mysore (Santalum album, espèce menacée) ; IFRA unrestricted',
    notes: 'INCI: JAVANOL. Firmenich trademark. Alternative au Santalol naturel. IFRA unrestricted. Source: Firmenich patent 2003'
  },
  {
    name: 'Polysantol',
    formula: 'C15H26O',
    cas_number: '65113-99-7',
    family: 'Alcools sesquiterpéniques',
    olfactive_desc: 'Santal, boisé crémeux, légèrement terreux, persistant',
    therapeutic: 'Alternative synthétique au Santal ; fixateur boisé ; IFRA unrestricted',
    notes: 'INCI: POLYSANTOL. Firmenich trademark. Synthèse à partir de Camphre. Source: Bauer et al. 2008 p.178'
  },
  {
    name: 'Ebanol',
    formula: 'C15H26O',
    cas_number: '28219-61-6',
    family: 'Alcools sesquiterpéniques',
    olfactive_desc: 'Santal, boisé, légèrement floral, propre et persistant',
    therapeutic: 'Alternative synthétique au Santal ; fixateur boisé-floral ; IFRA unrestricted',
    notes: 'INCI: EBANOL. Givaudan trademark. Synthèse. IFRA unrestricted. Source: Givaudan patent'
  },

  // ── COMPOSÉS AQUATIQUES ─────────────────────────────────────────────────────
  {
    name: 'Calone',
    formula: 'C8H8O2S',
    cas_number: '28940-11-6',
    family: 'Hétérocycliques soufrés',
    olfactive_desc: 'Marin, aquatique, algues, légèrement fruité — note "accord marin" emblématique',
    therapeutic: 'Composé de synthèse pur ; créateur de la tendance "aquatique" (Davidoff Cool Water 1988) ; IFRA cat.4: 0.4%',
    notes: 'INCI: CALONE. IFF trademark (1966). Révolution olfactive des années 1990. IFRA restricted. Source: Kraft et al. 2000'
  },
  {
    name: 'Floralozone',
    formula: 'C14H18O',
    cas_number: '67634-15-5',
    family: 'Cétones aromatiques',
    olfactive_desc: 'Floral aquatique, légèrement ozoniqu, propre, frais',
    therapeutic: 'Composé de synthèse ; note aquatique florale ; IFRA unrestricted',
    notes: 'CAS: 67634-15-5. Utilisé dans les compositions aquatiques modernes. Source: Bauer et al. 2008'
  },
];

// ─── Insertion ───────────────────────────────────────────────────────────────
console.log('=== BATCH 15 — SYNTHÈSE INDUSTRIELLE ===\n');
const ids = {};
for (const mol of molecules) {
  const { id, action } = await upsertMolecule(mol);
  ids[mol.name] = id;
  console.log(`${action === 'created' ? '✓ CRÉÉ' : '~ MÀJ'} ${mol.name} (id:${id})`);
}

// ─── Liaisons plantes existantes ─────────────────────────────────────────────
// Linalyl Acetate → Lavande, Bergamote, Sauge Sclarée
// Benzyl Acetate → Jasmin, Ylang-ylang
// Phenylethyl Alcohol → Rose damascena
// Geranyl Acetate → Géranium, Palmarosa
const plantLinks = [
  { molName: 'Linalyl Acetate', plantNames: ['Lavande', 'Bergamote', 'Sauge Sclarée'], role: 'majeur', pct: 35 },
  { molName: 'Benzyl Acetate', plantNames: ['Jasmin', 'Ylang-ylang'], role: 'majeur', pct: 20 },
  { molName: 'Phenylethyl Alcohol', plantNames: ['Rosa damascena', 'Rose', 'Géranium'], role: 'majeur', pct: 60 },
  { molName: 'Geranyl Acetate', plantNames: ['Géranium', 'Palmarosa'], role: 'secondaire', pct: 7 },
  { molName: 'Cis-Jasmone', plantNames: ['Jasmin', 'Jasminum grandiflorum'], role: 'secondaire', pct: 2 },
  { molName: 'Methyl Jasmonate', plantNames: ['Jasmin', 'Jasminum sambac'], role: 'secondaire', pct: 1 },
  { molName: 'Dihydromyrcenol', plantNames: ['Myrcène'], role: 'dérivé', pct: null },
  { molName: 'Terpineol', plantNames: ['Tea Tree', 'Pin sylvestre', 'Eucalyptus'], role: 'secondaire', pct: 3 },
  { molName: 'γ-Undecalactone', plantNames: ['Pêche', 'Abricot'], role: 'majeur', pct: 5 },
  { molName: 'Macrolide Ambrettolide', plantNames: ['Ambrette'], role: 'majeur', pct: 15 },
];

console.log('\n=== LIAISONS PLANTES ===');
let plantLinksCreated = 0;
for (const lnk of plantLinks) {
  const molId = ids[lnk.molName];
  if (!molId) { console.log(`? Molécule non trouvée: ${lnk.molName}`); continue; }
  for (const plantName of lnk.plantNames) {
    const [plants] = await conn.execute(
      'SELECT id FROM plants WHERE name LIKE ? LIMIT 1',
      [`%${plantName}%`]
    );
    if (plants.length > 0) {
      try {
        await conn.execute(
          `INSERT IGNORE INTO plant_molecules (plant_id, molecule_id, role, percentage)
           VALUES (?, ?, ?, ?)`,
          [plants[0].id, molId, lnk.role, lnk.pct]
        );
        plantLinksCreated++;
        console.log(`✓ ${lnk.molName} → ${plantName}`);
      } catch (e) {
        console.log(`✗ ${lnk.molName} → ${plantName}: ${e.message}`);
      }
    } else {
      console.log(`? Plante non trouvée: ${plantName}`);
    }
  }
}

// ─── Résumé ──────────────────────────────────────────────────────────────────
const [totalMols] = await conn.execute('SELECT COUNT(*) as n FROM molecules');
console.log('\n=== RÉSUMÉ BATCH 15 ===');
console.log(`Molécules créées : ${created}`);
console.log(`Molécules mises à jour : ${updated}`);
console.log(`Liaisons plantes créées : ${plantLinksCreated}`);
console.log(`Total molécules en base : ${totalMols[0].n}`);

await conn.end();
