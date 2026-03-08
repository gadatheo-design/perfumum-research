/**
 * Import Notion MCP Session 2 — 8 mars 2026
 * - 97 matières premières (base Notion Matières Premières)
 * - 64 molécules supplémentaires (recherche par famille)
 * - 36 plantes enrichissement (base Notion Plantes)
 * - 3 références bibliographiques
 */

import mysql from 'mysql2/promise';
import { readFileSync } from 'fs';

const conn = await mysql.createConnection(process.env.DATABASE_URL);

// ─── UTILITAIRES ────────────────────────────────────────────────────────────
function slugify(str) {
  return str.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

async function upsertMolecule(name, family = null, description = null) {
  const canonical = name.trim();
  const [existing] = await conn.execute(
    'SELECT id FROM molecules WHERE LOWER(name) = LOWER(?)',
    [canonical]
  );
  if (existing.length > 0) return { id: existing[0].id, created: false };
  
  const [result] = await conn.execute(
    `INSERT INTO molecules (name, family, createdAt, updatedAt)
     VALUES (?, ?, NOW(), NOW())`,
    [canonical, family]
  );
  return { id: result.insertId, created: true };
}

async function upsertRawMaterial(name, family = null, category = null, origin = null, latinName = null) {
  const [existing] = await conn.execute(
    'SELECT id FROM raw_materials WHERE LOWER(name) = LOWER(?)',
    [name.trim()]
  );
  if (existing.length > 0) return { id: existing[0].id, created: false };
  
  // Mapper la catégorie vers l'enum valide
  const validCategories = ['huile_essentielle','absolue','concrete','resinoid','teinture','co2_extract','hydrolat','beurre','cire','oleoresine','infusion','maceration','distillat','accord_olfactif','molecule_isolee','matiere_animale','autre'];
  const catMapped = category === 'Absolu' ? 'absolue' 
    : category === 'Huile essentielle' ? 'huile_essentielle'
    : category === 'Résinoïde' ? 'resinoid'
    : category === 'Extrait' ? 'co2_extract'
    : 'autre';
  
  // Mapper la famille olfactive vers l'enum valide
  const validFamilies = ['floral','boise','agrume','epice','herbace','balsamique','musque','animal','vert','fruité','marin','terreux','fumé','gourmand','aromatique','autre'];
  const famMap = { 'Florale': 'floral', 'Boisée': 'boise', 'Citrus': 'agrume', 'Résineux': 'balsamique', 'Musquée': 'musque', 'Tabac': 'fumé', 'Cannabis': 'herbace' };
  const famMapped = famMap[family] || 'autre';
  
  // Générer un material_id unique basé sur la catégorie et le nom
  const prefix = catMapped === 'absolue' ? 'ABS' : catMapped === 'huile_essentielle' ? 'HE' : catMapped === 'resinoid' ? 'RES' : 'MAT';
  const shortName = name.trim().toUpperCase().replace(/[^A-Z0-9]/g, '').substring(0, 4);
  const [countRows] = await conn.execute('SELECT COUNT(*) as cnt FROM raw_materials');
  const nextId = String(countRows[0].cnt + 1).padStart(3, '0');
  const materialId = `${prefix}-${shortName}-${nextId}`;
  
  const [result] = await conn.execute(
    `INSERT INTO raw_materials (material_id, name, latin_name, olfactive_family, category, origin_country, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`,
    [materialId, name.trim(), latinName, famMapped, catMapped, origin]
  );
  return { id: result.insertId, created: true };
}

async function upsertPlant(name) {
  const [existing] = await conn.execute(
    'SELECT id FROM plants WHERE LOWER(name) = LOWER(?)',
    [name.trim()]
  );
  if (existing.length > 0) return { id: existing[0].id, created: false };
  
  const [result] = await conn.execute(
    `INSERT INTO plants (name, created_at, updated_at) VALUES (?, NOW(), NOW())`,
    [name.trim()]
  );
  return { id: result.insertId, created: true };
}

// ─── 1. MATIÈRES PREMIÈRES NOTION ───────────────────────────────────────────
console.log('\n=== IMPORT MATIÈRES PREMIÈRES NOTION ===');
const mpData = JSON.parse(readFileSync('/tmp/notion_mp_all.json', 'utf8'));
let mpCreated = 0, mpSkipped = 0;

for (const mp of mpData) {
  const name = mp.name?.trim();
  if (!name || name.length < 2) continue;
  
  // Déduire la famille olfactive du nom
  let family = null;
  const nameLower = name.toLowerCase();
  if (nameLower.includes('tabac') || nameLower.includes('tobacco')) family = 'Tabac';
  else if (nameLower.includes('cannabis') || nameLower.includes('cbd') || nameLower.includes('charas')) family = 'Cannabis';
  else if (nameLower.includes('rose')) family = 'Florale';
  else if (nameLower.includes('jasmin')) family = 'Florale';
  else if (nameLower.includes('bois') || nameLower.includes('cedar') || nameLower.includes('santal') || nameLower.includes('oud')) family = 'Boisée';
  else if (nameLower.includes('encens') || nameLower.includes('frankincense') || nameLower.includes('myrrhe') || nameLower.includes('résine')) family = 'Résineux';
  else if (nameLower.includes('musc') || nameLower.includes('musk')) family = 'Musquée';
  else if (nameLower.includes('citrus') || nameLower.includes('bergamote') || nameLower.includes('lemon') || nameLower.includes('orange')) family = 'Citrus';
  
  // Déduire le type
  let type = 'Autre';
  if (nameLower.includes('absolute') || nameLower.includes('absolu')) type = 'Absolu';
  else if (nameLower.includes('oil') || nameLower.includes('huile')) type = 'Huile essentielle';
  else if (nameLower.includes('résine') || nameLower.includes('resin')) type = 'Résinoïde';
  else if (nameLower.includes('absolute') || nameLower.includes('extrait')) type = 'Extrait';
  
  const { created } = await upsertRawMaterial(name, family, type);
  if (created) mpCreated++;
  else mpSkipped++;
}

console.log(`Matières premières: +${mpCreated} créées, ${mpSkipped} déjà en base`);

// ─── 2. MOLÉCULES SUPPLÉMENTAIRES ───────────────────────────────────────────
console.log('\n=== IMPORT MOLÉCULES SUPPLÉMENTAIRES ===');
const molData = JSON.parse(readFileSync('/tmp/notion_molecules_all.json', 'utf8'));
let molCreated = 0, molSkipped = 0;

for (const mol of molData) {
  const name = mol.name?.trim();
  if (!name || name.length < 2) continue;
  
  const { created } = await upsertMolecule(name, mol.family || null);
  if (created) molCreated++;
  else molSkipped++;
}

console.log(`Molécules: +${molCreated} créées, ${molSkipped} déjà en base`);

// ─── 3. PLANTES ENRICHISSEMENT ───────────────────────────────────────────────
console.log('\n=== IMPORT PLANTES ENRICHISSEMENT ===');
const plantesData = JSON.parse(readFileSync('/tmp/notion_biblio_plantes.json', 'utf8'));
let plantCreated = 0, plantSkipped = 0;

for (const plante of (plantesData.plantes || [])) {
  const name = plante.title?.trim();
  if (!name || name.length < 2) continue;
  
  const { created } = await upsertPlant(name);
  if (created) plantCreated++;
  else plantSkipped++;
}

console.log(`Plantes: +${plantCreated} créées, ${plantSkipped} déjà en base`);

// ─── 4. BIBLIOGRAPHIE ────────────────────────────────────────────────────────
console.log('\n=== IMPORT BIBLIOGRAPHIE NOTION ===');
let biblioCreated = 0, biblioSkipped = 0;

const allBiblio = [...(plantesData.biblio_1 || []), ...(plantesData.biblio_2 || [])];
const seen = new Set();

for (const ref of allBiblio) {
  const title = ref.title?.trim();
  if (!title || seen.has(title)) continue;
  seen.add(title);
  
  const [existing] = await conn.execute(
    'SELECT id FROM bibliography_entries WHERE LOWER(title) = LOWER(?)',
    [title]
  );
  if (existing.length > 0) { biblioSkipped++; continue; }
  
  // Générer un entry_key unique
  const entryKey = title.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '_').substring(0, 80) + '_' + Date.now();
  await conn.execute(
    `INSERT INTO bibliography_entries (entry_key, title, url, entry_type, created_at, updated_at)
     VALUES (?, ?, ?, 'misc', NOW(), NOW())`,
    [entryKey, title, ref.url || null]
  );
  biblioCreated++;
}

console.log(`Bibliographie: +${biblioCreated} créées, ${biblioSkipped} déjà en base`);

// ─── RÉSUMÉ FINAL ────────────────────────────────────────────────────────────
const [totals] = await conn.execute(`
  SELECT 
    (SELECT COUNT(*) FROM molecules) as molecules,
    (SELECT COUNT(*) FROM raw_materials) as raw_materials,
    (SELECT COUNT(*) FROM plants) as plants,
    (SELECT COUNT(*) FROM bibliography_entries) as bibliography
`);

console.log('\n=== TOTAUX FINAUX ===');
console.log('Molécules:', totals[0].molecules);
console.log('Matières premières:', totals[0].raw_materials);
console.log('Plantes:', totals[0].plants);
console.log('Bibliographie:', totals[0].bibliography);

await conn.end();
