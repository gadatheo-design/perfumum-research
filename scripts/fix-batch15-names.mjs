/**
 * Correction des noms Batch 15 — les molécules ont été créées avec des noms
 * légèrement différents de ceux existants en base. On les met à jour.
 */
import mysql from 'mysql2/promise';
const conn = await mysql.createConnection(process.env.DATABASE_URL);

// Molécules créées dans Batch 15 avec leur ID réel
// et les molécules existantes en doublon potentiel
const corrections = [
  // Bergamote Calabre (Linalyl Acetate) id:330014 → on met à jour avec les données Batch 15
  { existingId: 330014, newData: { name: 'Bergamote Calabre (Linalyl Acetate)', cas: '115-95-7', family: 'Esters terpéniques' } },
  // Linalyl acetate id:990001 → doublon à fusionner dans 330014
  { mergeFrom: 990001, mergeTo: 330014 },
  // Acétate de Linalyle id:570018 → doublon
  { mergeFrom: 570018, mergeTo: 330014 },
  // alpha-terpineol id:810006 → enrichir avec données Batch 15
  { existingId: 810006, newData: {
    family: 'Alcools terpéniques',
    olfactive: 'Lilas, muguet, légèrement poivré, frais, propre',
    therapeutic: 'Antibactérien ; antifongique ; anti-inflammatoire ; composant HE Tea Tree (2-3%) et Pin (5-8%)',
    notes: 'CAS: 98-55-5. α-Terpineol. Naturel dans HE Tea Tree, Pin, Eucalyptus. IFRA unrestricted. Source: Bauer et al. 2008'
  }},
  // Acétate de citronellyle id:1290014 → enrichir
  { existingId: 1290014, newData: {
    cas: '150-84-5', family: 'Esters terpéniques',
    olfactive: 'Rose, fruité, légèrement citronné, floral doux',
    therapeutic: 'Antibactérien ; composant HE Géranium et Rose ; fixateur floral'
  }},
  // Phenylethyl alcohol id:990016 → enrichir
  { existingId: 990016, newData: {
    cas: '60-12-8', family: 'Alcools aromatiques',
    olfactive: 'Rose très naturelle, miel, légèrement fruité, doux et persistant',
    therapeutic: 'Antibactérien documenté ; composant majeur absolue de rose (50-70%) ; anxiolytique léger ; IFRA unrestricted'
  }},
];

// Créer les molécules vraiment manquantes
const toCreate = [
  {
    name: 'Benzyl Acetate',
    formula: 'C9H10O2',
    cas_number: '140-11-4',
    family: 'Esters aromatiques',
    olfactiveProfile: 'Jasmin, fruité sucré, légèrement floral, persistant',
    therapeuticProperties: 'Composant majeur absolue jasmin (15-25%) et ylang-ylang (5-10%) ; antibactérien léger ; IFRA cat.4: 3.6%',
    notes: 'CAS: 140-11-4. Ester de Benzyl Alcohol + Acide Acétique. IFRA restricted cat.4. Allergène INCI. Source: Arctander 1969 #0474'
  },
  {
    name: 'Geranyl Acetate',
    formula: 'C12H20O2',
    cas_number: '105-87-3',
    family: 'Esters terpéniques',
    olfactiveProfile: 'Rose, géranium, légèrement fruité, floral doux',
    therapeuticProperties: 'Antibactérien ; antifongique ; composant HE Géranium (5-10%) et Palmarosa (3-5%)',
    notes: 'CAS: 105-87-3. Ester de Géraniol. IFRA unrestricted. Naturel dans nombreuses HE florales. Source: Bauer et al. 2008'
  },
];

let created = 0;
let updated = 0;

// Créer les molécules manquantes
for (const mol of toCreate) {
  const [ex] = await conn.execute('SELECT id FROM molecules WHERE cas_number = ? OR name = ? LIMIT 1', [mol.cas_number, mol.name]);
  if (ex.length === 0) {
    const [res] = await conn.execute(
      `INSERT INTO molecules (name, formula, cas_number, family, olfactiveProfile, therapeuticProperties, notes) VALUES (?,?,?,?,?,?,?)`,
      [mol.name, mol.formula, mol.cas_number, mol.family, mol.olfactiveProfile, mol.therapeuticProperties, mol.notes]
    );
    console.log(`✓ CRÉÉ ${mol.name} (id:${res.insertId})`);
    created++;
  } else {
    console.log(`~ Existe déjà: ${mol.name} (id:${ex[0].id})`);
  }
}

// Enrichir les molécules existantes avec les bonnes données
const enrichments = [
  { id: 810006, cas: '98-55-5', family: 'Alcools terpéniques',
    olfactive: 'Lilas, muguet, légèrement poivré, frais, propre',
    therapeutic: 'Antibactérien ; antifongique ; anti-inflammatoire ; composant HE Tea Tree (2-3%) et Pin (5-8%)' },
  { id: 1290014, cas: '150-84-5', family: 'Esters terpéniques',
    olfactive: 'Rose, fruité, légèrement citronné, floral doux',
    therapeutic: 'Antibactérien ; composant HE Géranium et Rose ; fixateur floral' },
  { id: 990016, cas: '60-12-8', family: 'Alcools aromatiques',
    olfactive: 'Rose très naturelle, miel, légèrement fruité, doux et persistant',
    therapeutic: 'Antibactérien documenté ; composant majeur absolue de rose (50-70%) ; anxiolytique léger ; IFRA unrestricted' },
];

for (const e of enrichments) {
  await conn.execute(
    `UPDATE molecules SET
      cas_number = COALESCE(NULLIF(cas_number,''), ?),
      family = COALESCE(NULLIF(family,''), ?),
      olfactiveProfile = COALESCE(NULLIF(olfactiveProfile,''), ?),
      therapeuticProperties = COALESCE(NULLIF(therapeuticProperties,''), ?)
    WHERE id = ?`,
    [e.cas, e.family, e.olfactive, e.therapeutic, e.id]
  );
  updated++;
  console.log(`~ Enrichi id:${e.id}`);
}

// Liaisons plantes pour les nouvelles molécules
const [benzylAcetate] = await conn.execute("SELECT id FROM molecules WHERE name = 'Benzyl Acetate' LIMIT 1");
const [geranylAcetate] = await conn.execute("SELECT id FROM molecules WHERE name = 'Geranyl Acetate' LIMIT 1");

if (benzylAcetate.length > 0) {
  const molId = benzylAcetate[0].id;
  for (const plantName of ['Jasmin', 'Ylang-ylang']) {
    const [plants] = await conn.execute('SELECT id FROM plants WHERE name LIKE ? LIMIT 1', [`%${plantName}%`]);
    if (plants.length > 0) {
      await conn.execute(
        'INSERT IGNORE INTO plant_molecules (plant_id, molecule_id, role, percentage) VALUES (?,?,?,?)',
        [plants[0].id, molId, 'majeur', 20]
      );
      console.log(`✓ Benzyl Acetate → ${plantName}`);
    }
  }
}

if (geranylAcetate.length > 0) {
  const molId = geranylAcetate[0].id;
  for (const plantName of ['Géranium', 'Palmarosa']) {
    const [plants] = await conn.execute('SELECT id FROM plants WHERE name LIKE ? LIMIT 1', [`%${plantName}%`]);
    if (plants.length > 0) {
      await conn.execute(
        'INSERT IGNORE INTO plant_molecules (plant_id, molecule_id, role, percentage) VALUES (?,?,?,?)',
        [plants[0].id, molId, 'secondaire', 7]
      );
      console.log(`✓ Geranyl Acetate → ${plantName}`);
    }
  }
}

const [totalMols] = await conn.execute('SELECT COUNT(*) as n FROM molecules');
console.log(`\n=== RÉSUMÉ ===`);
console.log(`Créées: ${created} | Enrichies: ${updated} | Total: ${totalMols[0].n}`);

await conn.end();
