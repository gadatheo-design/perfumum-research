/**
 * BATCH 14 — Molécules de synthèse importantes en parfumerie fine
 * + Molécules manquantes identifiées lors du parsing des recettes
 *
 * Sources :
 * - IFRA Standards 2023 (https://ifrafragrance.org/standards)
 * - Arctander "Perfume and Flavor Chemicals" (1969)
 * - Leffingwell & Associates GC-MS Database
 * - PubChem CID references
 */
import mysql from 'mysql2/promise';

const conn = await mysql.createConnection(process.env.DATABASE_URL);

let created = 0;
let updated = 0;
let linked = 0;

async function upsertMolecule(mol) {
  const [existing] = await conn.execute(
    'SELECT id FROM molecules WHERE name = ? OR (cas_number IS NOT NULL AND cas_number != "" AND cas_number = ?)',
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
        mol.odor_description || null, mol.therapeutic_properties || null,
        mol.notes || null,
        existing[0].id
      ]
    );
    updated++;
    return existing[0].id;
  } else {
    const [res] = await conn.execute(
      `INSERT INTO molecules (name, formula, cas_number, family, olfactiveProfile, therapeuticProperties, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        mol.name, mol.formula || null, mol.cas_number || null, mol.family || null,
        mol.odor_description || null, mol.therapeutic_properties || null,
        mol.notes || null
      ]
    );
    created++;
    return res.insertId;
  }
}

// ─── MUSCS SYNTHÉTIQUES MACROCYCLIQUES ───────────────────────────────────────
const molecules = [
  {
    name: 'Galaxolide',
    formula: 'C18H26O',
    cas_number: '1222-05-5',
    family: 'Muscs synthétiques',
    odor_description: 'Musc blanc propre, poudré, légèrement boisé, très diffusif',
    therapeutic_properties: 'Fixateur olfactif ; perturbateur endocrinien potentiel (REACH) ; IFRA limite 0.1% en catégorie 1',
    olfactive_profile: JSON.stringify({
      intensity: 85, persistence: 95, diffusion: 90,
      warmth: 60, freshness: 50, sweetness: 65
    }),
    notes: 'INCI: GALAXOLIDE. Musk polycyclique. Réglementé IFRA cat.1: 0.1%. Biodégradation lente. Alternatives: Ambroxan, Habanolide. Source: IFRA 2023 Standard #76'
  },
  {
    name: 'Habanolide',
    formula: 'C16H28O2',
    cas_number: '34902-57-3',
    family: 'Muscs synthétiques',
    odor_description: 'Musc doux, lactonique, légèrement fruité, très propre',
    therapeutic_properties: 'Fixateur olfactif ; musc macrocyclique biodégradable ; profil sécuritaire favorable vs muscs nitrés',
    olfactive_profile: JSON.stringify({
      intensity: 75, persistence: 90, diffusion: 85,
      warmth: 55, freshness: 60, sweetness: 70
    }),
    notes: 'INCI: HABANOLIDE. Macrolide 16C. Biodégradable. Profil IFRA favorable. Utilisé en remplacement des muscs nitrés. Source: Firmenich patent EP0263429'
  },
  {
    name: 'Iso E Super',
    formula: 'C13H20O',
    cas_number: '54464-57-2',
    family: 'Cétones terpéniques',
    odor_description: 'Boisé, cèdre, ambré, légèrement fruité, effet "skin" remarquable',
    therapeutic_properties: 'Amplificateur olfactif (booster) ; effet peau documenté ; peut provoquer sensibilisation cutanée à haute dose',
    olfactive_profile: JSON.stringify({
      intensity: 70, persistence: 88, diffusion: 95,
      warmth: 75, freshness: 40, sweetness: 45
    }),
    notes: 'INCI: CYCLOHEXYL METHYL PROPIONATE. Mélange de 4 isomères. Inventé par IFF 1973. Utilisé dans Terre d\'Hermès, Fahrenheit. Booster unique. Source: Kraft et al. Helv.Chim.Acta 1967'
  },
  {
    name: 'Ambroxan',
    formula: 'C16H28O',
    cas_number: '6790-58-5',
    family: 'Muscs synthétiques',
    odor_description: 'Ambre, musc chaud, boisé, animal doux, effet peau exceptionnel',
    therapeutic_properties: 'Alternative synthétique à l\'Ambre Gris (Physeter macrocephalus, CITES) ; activateur du récepteur olfactif OR51E2 ; effet aphrodisiaque documenté',
    olfactive_profile: JSON.stringify({
      intensity: 80, persistence: 98, diffusion: 92,
      warmth: 90, freshness: 20, sweetness: 40
    }),
    notes: 'INCI: AMBROXAN. Dérivé de l\'Ambroxide. Synthèse à partir de Sclareol (Salvia sclarea). Alternative CITES à l\'Ambre Gris. Utilisé dans Molecule 02 (Escentric Molecules). Source: Ohloff 1994'
  },
  {
    name: 'Ethylene Brassylate',
    formula: 'C15H26O4',
    cas_number: '105-95-3',
    family: 'Muscs synthétiques',
    odor_description: 'Musc doux, propre, légèrement fruité, lactonique, très diffusif',
    therapeutic_properties: 'Musc macrocyclique biodégradable ; profil sécuritaire excellent ; IFRA unrestricted ; utilisé en cosmétique et parfumerie',
    olfactive_profile: JSON.stringify({
      intensity: 70, persistence: 92, diffusion: 88,
      warmth: 50, freshness: 65, sweetness: 75
    }),
    notes: 'INCI: ETHYLENE BRASSYLATE. Macrolide 15C. Biodégradable. Pas de restriction IFRA. Utilisé comme alternative aux muscs nitrés. Source: Arctander 1969 #1847'
  },
  {
    name: 'Muscone',
    formula: 'C16H30O',
    cas_number: '541-91-3',
    family: 'Muscs synthétiques',
    odor_description: 'Musc animal profond, chaud, légèrement terreux, très persistant',
    therapeutic_properties: 'Musc macrocyclique naturel (Moschus moschiferus, CITES Annexe I) ; synthèse chimique obligatoire ; aphrodisiaque documenté en aromathérapie',
    olfactive_profile: JSON.stringify({
      intensity: 90, persistence: 99, diffusion: 80,
      warmth: 95, freshness: 10, sweetness: 30
    }),
    notes: 'INCI: CYCLOPENTADECANONE. Musc naturel du chevrotain musqué (espèce protégée CITES I). Synthèse: Ruzicka 1926. Utilisé en parfumerie de luxe. Source: Ruzicka L. Helv.Chim.Acta 1926:9:230'
  },
  {
    name: 'Exaltolide',
    formula: 'C16H30O2',
    cas_number: '106-02-5',
    family: 'Muscs synthétiques',
    odor_description: 'Musc doux, lactonique, légèrement sucré, propre',
    therapeutic_properties: 'Macrolide 16C ; biodégradable ; profil sécuritaire favorable ; utilisé comme fixateur doux',
    olfactive_profile: JSON.stringify({
      intensity: 65, persistence: 88, diffusion: 82,
      warmth: 55, freshness: 60, sweetness: 72
    }),
    notes: 'INCI: CYCLOPENTADECANOLIDE. Macrolide. Synthèse Ruzicka. Utilisé dans les compositions florales et poudrées. Source: Arctander 1969'
  },
  {
    name: 'Civettone',
    formula: 'C17H30O',
    cas_number: '542-46-1',
    family: 'Muscs synthétiques',
    odor_description: 'Musc animal intense, civet, légèrement fécal à haute concentration, doux et propre dilué',
    therapeutic_properties: 'Musc naturel de la civette africaine (Civettictis civetta) ; synthèse obligatoire (bien-être animal) ; aphrodisiaque documenté',
    olfactive_profile: JSON.stringify({
      intensity: 95, persistence: 99, diffusion: 75,
      warmth: 98, freshness: 5, sweetness: 20
    }),
    notes: 'INCI: CYCLOHEPTADECENONE. Musc de civette (espèce protégée). Synthèse: Ruzicka 1926. Utilisé dilué à 1-5% en parfumerie animale. Source: Ruzicka L. Helv.Chim.Acta 1926'
  },

  // ─── MOLÉCULES MANQUANTES DES RECETTES ────────────────────────────────────
  {
    name: 'Perillaldéhyde',
    formula: 'C10H14O',
    cas_number: '2111-75-3',
    family: 'Aldéhydes terpéniques',
    odor_description: 'Herbal, cumin, carvi, légèrement citronné, caractéristique du Shiso',
    therapeutic_properties: 'Antibactérien documenté (Perilla frutescens) ; antifongique ; antioxydant ; inhibiteur de NF-κB',
    olfactive_profile: JSON.stringify({
      intensity: 80, persistence: 70, diffusion: 75,
      warmth: 55, freshness: 65, sweetness: 30
    }),
    notes: 'Composé majoritaire de l\'HE de Shiso (Perilla frutescens). CAS: 2111-75-3. Source: J.Agric.Food.Chem. 2004:52:2346'
  },
  {
    name: 'Méthyl Chavicol',
    formula: 'C10H12O',
    cas_number: '140-67-0',
    family: 'Phénylpropanoïdes',
    odor_description: 'Anis, basilic, légèrement épicé, herbal',
    therapeutic_properties: 'Antispasmodique ; antibactérien ; composant majeur de l\'HE de basilic et d\'estragon ; potentiellement génotoxique à haute dose',
    olfactive_profile: JSON.stringify({
      intensity: 75, persistence: 65, diffusion: 80,
      warmth: 60, freshness: 55, sweetness: 50
    }),
    notes: 'Synonyme: Estragole. Composant majeur Piper auritum (Acuyo) et Ocimum basilicum. Source: EFSA 2001 opinion on estragole'
  },
  {
    name: 'Nardol',
    formula: 'C15H26O',
    cas_number: '4756-19-8',
    family: 'Alcools sesquiterpéniques',
    odor_description: 'Terreux, boisé, racine, légèrement animal, persistant',
    therapeutic_properties: 'Sédatif documenté (Nardostachys jatamansi) ; anxiolytique ; anti-inflammatoire ; utilisé en médecine ayurvédique',
    olfactive_profile: JSON.stringify({
      intensity: 70, persistence: 85, diffusion: 60,
      warmth: 80, freshness: 20, sweetness: 25
    }),
    notes: 'Composant de l\'HE de Nard (Nardostachys jatamansi). Source: Phytochemistry 2008:69:1882'
  },
  {
    name: 'Benzyl Benzoate',
    formula: 'C14H12O2',
    cas_number: '120-51-4',
    family: 'Esters aromatiques',
    odor_description: 'Balsamique doux, légèrement floral, fixateur',
    therapeutic_properties: 'Fixateur olfactif ; antiparasitaire (gale, poux) ; IFRA cat.1 limite 0.03% ; allergène déclaré INCI',
    olfactive_profile: JSON.stringify({
      intensity: 55, persistence: 90, diffusion: 65,
      warmth: 65, freshness: 30, sweetness: 60
    }),
    notes: 'INCI: BENZYL BENZOATE. Présent dans absolue de Jasmin, Ylang-ylang, fève Tonka. Allergène INCI. IFRA Standard. Source: Arctander 1969 #0472'
  },
  {
    name: 'Galbanum',
    formula: 'C10H16',
    cas_number: '8023-91-4',
    family: 'Terpènes verts',
    odor_description: 'Vert intense, feuille froissée, résine, légèrement épicé, caractéristique',
    therapeutic_properties: 'Antibactérien ; anti-inflammatoire ; expectorant traditionnel ; composant majeur: β-Pinène, δ-3-Carène, Pyrazines vertes',
    olfactive_profile: JSON.stringify({
      intensity: 90, persistence: 75, diffusion: 85,
      warmth: 40, freshness: 90, sweetness: 10
    }),
    notes: 'Résine de Ferula galbaniflua. Composant vert emblématique (Chanel No.19). Source: Arctander 1969 #1289'
  },
  {
    name: 'Cis-3-Hexénol',
    formula: 'C6H12O',
    cas_number: '928-96-1',
    family: 'Alcools verts',
    odor_description: 'Herbe fraîchement coupée, vert intense, légèrement fruité',
    therapeutic_properties: 'Composé naturel des plantes fraîches (voie des lipoxygénases) ; utilisé en aromathérapie pour effets anxiolytiques ; stimulant olfactif',
    olfactive_profile: JSON.stringify({
      intensity: 85, persistence: 55, diffusion: 90,
      warmth: 20, freshness: 98, sweetness: 30
    }),
    notes: 'Synonyme: Leaf Alcohol. Présent dans toutes les plantes vertes fraîches. Seuil olfactif: 0.07 ppb. Source: Hatanaka 1993 Phytochemistry'
  },
  {
    name: 'CBN (Cannabinol)',
    formula: 'C21H26O2',
    cas_number: '521-35-7',
    family: 'Cannabinoïdes',
    odor_description: 'Légèrement herbacé, terreux, moins prononcé que le THC',
    therapeutic_properties: 'Sédatif documenté ; antibactérien (MRSA) ; anti-inflammatoire ; produit de dégradation du THC par oxydation',
    olfactive_profile: JSON.stringify({
      intensity: 30, persistence: 70, diffusion: 40,
      warmth: 45, freshness: 30, sweetness: 20
    }),
    notes: 'Cannabinoïde mineur. Produit de dégradation du THC. Statut légal variable. Source: Russo 2011 Br.J.Pharmacol. 163:1344'
  },
];

// ─── Insertion ───────────────────────────────────────────────────────────────
console.log('=== BATCH 14 — MUSCS SYNTHÉTIQUES + MOLÉCULES MANQUANTES ===\n');
for (const mol of molecules) {
  const id = await upsertMolecule(mol);
  console.log(`${created > 0 || updated > 0 ? '✓' : '~'} ${mol.name} (id:${id})`);
}

// ─── Liaisons recettes pour les nouvelles molécules ──────────────────────────
// Parfum Chrono-Évolution (510012) — molécules maintenant créées
const chronoLinks = [
  { molName: 'Perillaldéhyde', pct: 12, note: 'Phase 2 — HE Shiso (Perilla frutescens)' },
  { molName: 'Méthyl Chavicol', pct: 6, note: 'Phase 2 — Acuyo (Piper auritum)' },
  { molName: 'Nardol', pct: 10, note: 'Phase 3 — Absolue Nardo (Nardostachys jatamansi)' },
  { molName: 'Benzyl Benzoate', pct: 5, note: 'Phase 4 — Absolue fève Tonka' },
];

console.log('\n=== LIAISONS RECETTE 510012 (Parfum Chrono-Évolution) ===');
for (const lnk of chronoLinks) {
  const [mol] = await conn.execute('SELECT id FROM molecules WHERE name = ?', [lnk.molName]);
  if (mol.length > 0) {
    try {
      await conn.execute(
        'INSERT IGNORE INTO recette_molecules (recette_id, molecule_id, proportion, role) VALUES (?, ?, ?, ?)',
        [510012, mol[0].id, lnk.pct, lnk.note]
      );
      linked++;
      console.log(`✓ ${lnk.molName} (${lnk.pct}%)`);
    } catch (e) {
      console.log(`✗ ${lnk.molName}: ${e.message}`);
    }
  }
}

// Leaf Economies (420008) — Galbanum + Cis-3-Hexénol
const leafLinks = [
  { molName: 'Galbanum', pct: 25, note: 'Accord Leaf Economies — résine verte' },
  { molName: 'Cis-3-Hexénol', pct: 20, note: 'Accord Leaf Economies — alcool vert' },
];
console.log('\n=== LIAISONS RECETTE 420008 (Leaf Economies) ===');
for (const lnk of leafLinks) {
  const [mol] = await conn.execute('SELECT id FROM molecules WHERE name = ?', [lnk.molName]);
  if (mol.length > 0) {
    try {
      await conn.execute(
        'INSERT IGNORE INTO recette_molecules (recette_id, molecule_id, proportion, role) VALUES (?, ?, ?, ?)',
        [420008, mol[0].id, lnk.pct, lnk.note]
      );
      linked++;
      console.log(`✓ ${lnk.molName} (${lnk.pct}%)`);
    } catch (e) {
      console.log(`✗ ${lnk.molName}: ${e.message}`);
    }
  }
}

// ─── Résumé ──────────────────────────────────────────────────────────────────
const [totalMols] = await conn.execute('SELECT COUNT(*) as n FROM molecules');
const [linkedRecettes] = await conn.execute(`
  SELECT COUNT(DISTINCT r.id) as n FROM recettes r
  WHERE r.id IN (
    SELECT DISTINCT recette_id FROM molecules_recettes
    UNION
    SELECT DISTINCT recette_id FROM recette_molecules
  )
`);
const [totalRecettes] = await conn.execute('SELECT COUNT(*) as n FROM recettes');

console.log('\n=== RÉSUMÉ BATCH 14 ===');
console.log(`Molécules créées : ${created}`);
console.log(`Molécules mises à jour : ${updated}`);
console.log(`Liaisons recettes créées : ${linked}`);
console.log(`Total molécules en base : ${totalMols[0].n}`);
console.log(`Couverture recettes : ${linkedRecettes[0].n}/${totalRecettes[0].n} = ${Math.round(linkedRecettes[0].n / totalRecettes[0].n * 100)}%`);

await conn.end();
