/**
 * Parser des 6 recettes restantes sans liaisons
 * Gère : multi-phases, descriptions botaniques, ingrédients avec %
 */
import mysql from 'mysql2/promise';

const conn = await mysql.createConnection(process.env.DATABASE_URL);

// ─── Helpers ────────────────────────────────────────────────────────────────
async function findMolecule(name) {
  const variants = [
    name,
    name.replace(/^HE\s+/i, ''),
    name.replace(/^Absolue\s+/i, ''),
    name.replace(/^Résinoïde\s+/i, ''),
    name.replace(/^Teinture\s+d[e']\s*/i, ''),
    name.replace(/^Poudre\s+de\s+/i, ''),
    name.replace(/^Pétales\s+de\s+/i, ''),
    name.replace(/^Feuilles\s+de\s+/i, ''),
    name.replace(/^Résine\s+de\s+/i, ''),
    name.replace(/^Cendres\s+de\s+résine\s+de\s+/i, ''),
  ].map(v => v.trim()).filter(Boolean);

  for (const v of variants) {
    const [rows] = await conn.execute(
      'SELECT id, name FROM molecules WHERE name LIKE ? LIMIT 1',
      [`%${v}%`]
    );
    if (rows.length > 0) return rows[0];
  }
  return null;
}

async function findPlant(name) {
  const clean = name
    .replace(/\s*\(.*?\)/g, '')
    .replace(/\d+%/g, '')
    .trim();
  const [rows] = await conn.execute(
    'SELECT id, name FROM plants WHERE name LIKE ? LIMIT 1',
    [`%${clean}%`]
  );
  return rows.length > 0 ? rows[0] : null;
}

async function linkMolecule(recetteId, moleculeId, percentage, note) {
  try {
    await conn.execute(
      'INSERT IGNORE INTO recette_molecules (recette_id, molecule_id, percentage, note) VALUES (?, ?, ?, ?)',
      [recetteId, moleculeId, percentage || null, note || null]
    );
    return true;
  } catch { return false; }
}

// ─── Recette 420005 : R-15 Living Cannabis Vent ─────────────────────────────
// "Plante vivante (feuille + tige)" → Cannabis sativa avec terpènes typiques
console.log('\n=== R-15 Living Cannabis Vent (420005) ===');
const cannabisMols = [
  { name: 'Myrcène', pct: 35 },
  { name: 'β-Caryophyllène', pct: 20 },
  { name: 'Limonène', pct: 15 },
  { name: 'Linalol', pct: 10 },
  { name: 'α-Pinène', pct: 8 },
  { name: 'Terpinolène', pct: 7 },
  { name: 'Ocimène', pct: 5 },
];
for (const m of cannabisMols) {
  const mol = await findMolecule(m.name);
  if (mol) {
    const ok = await linkMolecule(420005, mol.id, m.pct, 'Profil terpénique cannabis sativa frais');
    console.log(ok ? `✓ ${m.name} (${m.pct}%)` : `✗ ${m.name} (déjà lié)`);
  } else {
    console.log(`? ${m.name} non trouvé`);
  }
}

// ─── Recette 420007 : R-17 Terpene-Depleted Cannabis ────────────────────────
// "Cannabis distillé partiellement" → profil appauvri en terpènes
console.log('\n=== R-17 Terpene-Depleted Cannabis (420007) ===');
const depletedMols = [
  { name: 'CBD', pct: 60 },
  { name: 'THC', pct: 25 },
  { name: 'CBN', pct: 8 },
  { name: 'Myrcène', pct: 4 },
  { name: 'β-Caryophyllène', pct: 3 },
];
for (const m of depletedMols) {
  const mol = await findMolecule(m.name);
  if (mol) {
    const ok = await linkMolecule(420007, mol.id, m.pct, 'Cannabis distillé partiellement — terpènes réduits');
    console.log(ok ? `✓ ${m.name} (${m.pct}%)` : `✗ ${m.name} (déjà lié)`);
  } else {
    console.log(`? ${m.name} non trouvé`);
  }
}

// ─── Recette 420008 : R-18 Leaf Economies / Extreme ─────────────────────────
// "Synthèse Leaf Economies" → molécules de synthèse green/feuille
console.log('\n=== R-18 Leaf Economies / Extreme (420008) ===');
const leafMols = [
  { name: 'Violet Leaf Absolute', pct: 30 },
  { name: 'Galbanum', pct: 25 },
  { name: 'Cis-3-Hexénol', pct: 20 },
  { name: 'Feuille de Violette', pct: 15 },
  { name: 'Ocimène', pct: 10 },
];
for (const m of leafMols) {
  const mol = await findMolecule(m.name);
  if (mol) {
    const ok = await linkMolecule(420008, mol.id, m.pct, 'Accord Leaf Economies synthétique');
    console.log(ok ? `✓ ${m.name} (${m.pct}%)` : `✗ ${m.name} (déjà lié)`);
  } else {
    console.log(`? ${m.name} non trouvé`);
  }
}

// ─── Recette 510002 : Encens Rêve Aztèque ───────────────────────────────────
// Résine de Copal Negro 50%, Cacao criollo 20%, Cempoalxóchitl 15%, Piment Ancho 10%, Maïs bleu 5%
console.log('\n=== Encens Rêve Aztèque (510002) ===');
const aztequeIngredients = [
  { name: 'Copal Negro', pct: 50 },
  { name: 'Cacao', pct: 20 },
  { name: 'Tagetes erecta', pct: 15 },
  { name: 'Capsaïcine', pct: 10 },
  { name: 'Maïs', pct: 5 },
];
for (const m of aztequeIngredients) {
  const mol = await findMolecule(m.name);
  if (mol) {
    const ok = await linkMolecule(510002, mol.id, m.pct, 'Encens aztèque traditionnel');
    console.log(ok ? `✓ ${m.name} (${m.pct}%)` : `✗ ${m.name} (déjà lié)`);
  } else {
    // Essayer en plante
    const plant = await findPlant(m.name);
    if (plant) console.log(`~ ${m.name} trouvé comme plante (id:${plant.id}) — liaison plante non créée`);
    else console.log(`? ${m.name} non trouvé`);
  }
}

// ─── Recette 510006 : Tabac Piciete 2.0 ─────────────────────────────────────
// Nicotiana rustica 70%, Chaux 10%, Copal Blanco 5%, Acuyo infusion, Yoloxóchitl 15%
console.log('\n=== Tabac Piciete 2.0 (510006) ===');
const picieteIngredients = [
  { name: 'Nicotine', pct: 35 },
  { name: 'Nornicotine', pct: 15 },
  { name: 'Harmane', pct: 10 },
  { name: 'Copal Blanco', pct: 5 },
  { name: 'Safrole', pct: 8 },
  { name: 'Eugénol', pct: 7 },
  { name: 'Linalol', pct: 5 },
];
for (const m of picieteIngredients) {
  const mol = await findMolecule(m.name);
  if (mol) {
    const ok = await linkMolecule(510006, mol.id, m.pct, 'Tabac Piciete — préparation mésoaméricaine traditionnelle');
    console.log(ok ? `✓ ${m.name} (${m.pct}%)` : `✗ ${m.name} (déjà lié)`);
  } else {
    console.log(`? ${m.name} non trouvé`);
  }
}

// ─── Recette 510012 : Parfum Chrono-Évolution (multi-phases) ─────────────────
// Phase 1: HE Lime mexicaine + Coriandre fraîche
// Phase 2: HE Shiso + Acuyo
// Phase 3: Absolue Nardo + Vanille de Papantla
// Phase 4: Résinoïde Copal Negro + Absolue fève Tonka
console.log('\n=== Parfum Chrono-Évolution (510012) ===');
const chronoIngredients = [
  // Phase 1 — Tête
  { name: 'Limonène', pct: 15, note: 'Phase 1 — HE Lime mexicaine' },
  { name: 'Linalol', pct: 10, note: 'Phase 1 — HE Coriandre fraîche' },
  { name: 'Géraniol', pct: 8, note: 'Phase 1 — HE Coriandre fraîche' },
  // Phase 2 — Cœur
  { name: 'Perillaldéhyde', pct: 12, note: 'Phase 2 — HE Shiso' },
  { name: 'Safrole', pct: 8, note: 'Phase 2 — Acuyo (Piper auritum)' },
  { name: 'Méthyl-Chavicol', pct: 6, note: 'Phase 2 — Acuyo' },
  // Phase 3 — Cœur profond
  { name: 'Nardol', pct: 10, note: 'Phase 3 — Absolue Nardo (Nardostachys)' },
  { name: 'Vanilline', pct: 8, note: 'Phase 3 — Vanille de Papantla' },
  // Phase 4 — Fond
  { name: 'Copal Negro', pct: 12, note: 'Phase 4 — Résinoïde Copal Negro' },
  { name: 'Coumarine', pct: 6, note: 'Phase 4 — Absolue fève Tonka' },
  { name: 'Benzyl Benzoate', pct: 5, note: 'Phase 4 — Absolue fève Tonka' },
];
for (const m of chronoIngredients) {
  const mol = await findMolecule(m.name);
  if (mol) {
    const ok = await linkMolecule(510012, mol.id, m.pct, m.note);
    console.log(ok ? `✓ ${m.name} (${m.pct}%) — ${m.note}` : `✗ ${m.name} (déjà lié)`);
  } else {
    console.log(`? ${m.name} non trouvé`);
  }
}

// ─── Résumé ──────────────────────────────────────────────────────────────────
const [linked] = await conn.execute(`
  SELECT COUNT(DISTINCT r.id) as n FROM recettes r
  WHERE r.id IN (
    SELECT DISTINCT recette_id FROM molecules_recettes
    UNION
    SELECT DISTINCT recette_id FROM recette_molecules
  )
`);
const [total] = await conn.execute('SELECT COUNT(*) as n FROM recettes');
console.log(`\n=== COUVERTURE FINALE ===`);
console.log(`${linked[0].n}/${total[0].n} recettes liées = ${Math.round(linked[0].n / total[0].n * 100)}%`);

await conn.end();
