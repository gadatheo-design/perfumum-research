/**
 * Import des recettes Archives Vivantes (15 recettes) et PF-15 Pétrichor (5 variations)
 * + Création de la table bibliography_entity_links et liaisons
 */
import { createConnection } from 'mysql2/promise';
import { readFileSync } from 'fs';
import { randomBytes } from 'crypto';

const db = await createConnection(process.env.DATABASE_URL);

// Colonnes recettes: id(int), name, category(enum), familyId, formula, protocol, description, ingredients, notes, status(enum)
// category ENUM: tabac, resine, resine_cbd, cone, parfum, encens, extrait
// status ENUM: experimental, testing, validated, production

// ============================================================
// 1. IMPORT RECETTES ARCHIVES VIVANTES
// ============================================================
const archivesVivantes = JSON.parse(readFileSync('/tmp/archives_vivantes_recettes.json', 'utf8'));

console.log('\n=== IMPORT RECETTES ARCHIVES VIVANTES ===');
let recettesAdded = 0;
let recettesSkipped = 0;

for (const recette of archivesVivantes) {
  const nameMatch = recette.title.match(/"([^"]+)"/);
  const name = nameMatch ? nameMatch[1] : recette.title;
  
  const [existing] = await db.execute('SELECT id FROM recettes WHERE name = ? LIMIT 1', [name]);
  if (existing.length > 0) {
    recettesSkipped++;
    continue;
  }
  
  const description = [
    recette.concept ? `Concept : ${recette.concept}` : null,
    recette.inspiration ? `Inspiration : ${recette.inspiration}` : null,
    recette.profil ? `Profil aromatique : ${recette.profil}` : null,
    recette.gcms?.length > 0 ? `GC-MS : ${recette.gcms.map(g => `${g[0]} ${g[1]}`).join(', ')}` : null,
  ].filter(Boolean).join('\n');
  
  // Formater les ingrédients comme JSON texte
  const ingredientsText = recette.ingredients.map(i => `${i.pct} ${i.name}`).join('\n');
  
  // Gamme = Archives Vivantes
  await db.execute(
    `INSERT INTO recettes (name, description, category, ingredients, notes, status, gamme, createdAt, updatedAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
    [name, description, 'tabac', ingredientsText, `Série Archives Vivantes — ${recette.title}`, 'experimental', 'Archives Vivantes']
  );
  
  const [inserted] = await db.execute('SELECT id FROM recettes WHERE name = ? LIMIT 1', [name]);
  const recetteId = inserted[0].id;
  
  // Lier les ingrédients aux matières premières
  for (const ing of recette.ingredients) {
    const searchName = ing.name.split(' ')[0];
    const [mps] = await db.execute(
      'SELECT id FROM raw_materials WHERE name LIKE ? LIMIT 1',
      [`%${searchName}%`]
    );
    if (mps.length > 0) {
      const pct = parseFloat(ing.pct) || null;
      await db.execute(
        `INSERT IGNORE INTO recette_raw_materials (id, recette_id, raw_material_id, percentage, role, created_at)
         VALUES (?, ?, ?, ?, ?, NOW())`,
        [randomBytes(8).toString('hex'), recetteId, mps[0].id, pct, 'ingredient']
      );
    }
  }
  
  recettesAdded++;
  console.log(`  ✓ ${name} — ${recette.ingredients.length} ingrédients | ${recette.profil?.substring(0, 40) || ''}`);
}

console.log(`\nArchives Vivantes: ${recettesAdded} ajoutées, ${recettesSkipped} déjà en base`);

// ============================================================
// 2. IMPORT RECETTES PF-15 PÉTRICHOR
// ============================================================
console.log('\n=== IMPORT RECETTES PF-15 PÉTRICHOR ===');

const pf15Recettes = [
  {
    name: 'Pétrichor Ancestral',
    description: "L'odeur de la première pluie sur un temple ancien, mêlant terre sacrée et encens millénaire.\nProfil : Terre sacrée, encens\nGC-MS : Géosmine signature, Boswellic acids, Nardol",
    ingredients: [
      { name: 'Mitti Attar', pct: 18 }, { name: 'Frankincense', pct: 15 },
      { name: 'Géosmine', pct: 2 }, { name: 'Spikenard', pct: 8 },
      { name: 'Vetiver', pct: 10 }, { name: 'Palo Santo', pct: 6 },
    ]
  },
  {
    name: 'Pétrichor Forestier',
    description: "Sous-bois humide après la pluie, mousse et terre fraîche.\nProfil : Sous-bois humide, mousse",
    ingredients: [
      { name: 'Géosmine', pct: 3 }, { name: 'Vetiver', pct: 15 },
      { name: 'Mousse de Chêne', pct: 8 }, { name: 'Cèdre', pct: 12 },
    ]
  },
  {
    name: 'Pétrichor Minéral',
    description: "Pierre mouillée, ozone et minéralité brute.\nProfil : Pierre mouillée, ozone",
    ingredients: [
      { name: 'Géosmine', pct: 2 }, { name: 'Ambergris', pct: 10 },
      { name: 'Frankincense', pct: 12 },
    ]
  },
  {
    name: 'Pétrichor Tropical',
    description: "Mousson tropicale, terre rouge et végétation dense.\nProfil : Mousson, terre rouge",
    ingredients: [
      { name: 'Mitti Attar', pct: 20 }, { name: 'Vetiver', pct: 12 },
      { name: 'Patchouli', pct: 8 },
    ]
  },
  {
    name: 'Pétrichor Nocturne',
    description: "Nuit après l'orage, mystère et profondeur.\nProfil : Nuit après l'orage, mystère",
    ingredients: [
      { name: 'Géosmine', pct: 1 }, { name: 'Oud', pct: 8 },
      { name: 'Frankincense', pct: 10 }, { name: 'Ambergris', pct: 6 },
      { name: 'Vetiver', pct: 12 },
    ]
  }
];

let pf15Added = 0;
for (const r of pf15Recettes) {
  const [existing] = await db.execute('SELECT id FROM recettes WHERE name = ? LIMIT 1', [r.name]);
  if (existing.length > 0) {
    console.log(`  ⏭ ${r.name} déjà en base`);
    continue;
  }
  
  const ingredientsText = r.ingredients.map(i => `${i.pct}% ${i.name}`).join('\n');
  
  await db.execute(
    `INSERT INTO recettes (name, description, category, ingredients, notes, status, gamme, createdAt, updatedAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
    [r.name, r.description, 'resine_cbd', ingredientsText, 'Série PF-15 — Résines Pétrichor', 'experimental', 'PF-15 Pétrichor']
  );
  
  const [inserted] = await db.execute('SELECT id FROM recettes WHERE name = ? LIMIT 1', [r.name]);
  const recetteId = inserted[0].id;
  
  for (const ing of r.ingredients) {
    const searchName = ing.name.split(' ')[0];
    const [mps] = await db.execute(
      'SELECT id FROM raw_materials WHERE name LIKE ? LIMIT 1',
      [`%${searchName}%`]
    );
    if (mps.length > 0) {
      await db.execute(
        `INSERT IGNORE INTO recette_raw_materials (id, recette_id, raw_material_id, percentage, role, created_at)
         VALUES (?, ?, ?, ?, ?, NOW())`,
        [randomBytes(8).toString('hex'), recetteId, mps[0].id, ing.pct, 'ingredient']
      );
    }
  }
  
  pf15Added++;
  console.log(`  ✓ ${r.name} — ${r.ingredients.length} ingrédients`);
}

console.log(`\nPF-15: ${pf15Added} ajoutées`);

// ============================================================
// 3. TABLE BIBLIOGRAPHY_ENTITY_LINKS
// ============================================================
console.log('\n=== LIAISONS BIBLIOGRAPHIQUES ===');

const [tables] = await db.execute(
  "SELECT TABLE_NAME FROM information_schema.TABLES WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'bibliography_entity_links'"
);

if (tables.length === 0) {
  await db.execute(`
    CREATE TABLE bibliography_entity_links (
      id VARCHAR(32) PRIMARY KEY,
      entry_id INT NOT NULL,
      entity_type ENUM('molecule','plant','raw_material','recette','terroir','variety') NOT NULL,
      entity_id VARCHAR(64) NOT NULL,
      relevance_note TEXT,
      created_at DATETIME DEFAULT NOW(),
      UNIQUE KEY unique_link (entry_id, entity_type, entity_id)
    )
  `);
  console.log('  ✓ Table bibliography_entity_links créée');
}

// Liaisons manuelles basées sur les auteurs et les entités correspondantes
const liaisonRules = [
  { author: 'Bembibre', entityType: 'plant', names: ['Silphium', 'Styrax', 'Commiphora', 'Myrrhe'] },
  { author: 'Kaiser', entityType: 'plant', names: ['Ambrette', 'Orris', 'Labdanum', 'Iris'] },
  { author: 'Clarke', entityType: 'plant', names: ['Cannabis', 'Hemp'] },
  { author: 'Russo', entityType: 'molecule', names: ['Myrcene', 'Limonene', 'Linalool', 'Caryophyllene', 'Pinene'] },
  { author: 'Ren', entityType: 'plant', names: ['Cannabis', 'Hemp'] },
  { author: 'Dioscoride', entityType: 'plant', names: ['Iris', 'Myrrhe', 'Encens', 'Nard', 'Rose'] },
  { author: 'Avicenne', entityType: 'plant', names: ['Rose', 'Jasmin', 'Safran', 'Oud'] },
  { author: 'Monardes', entityType: 'plant', names: ['Tabac', 'Vanille', 'Cacao'] },
  { author: 'Odeuropa', entityType: 'plant', names: ['Lavande', 'Rose', 'Jasmin'] },
];

let liaisonsCreated = 0;

for (const rule of liaisonRules) {
  const [entries] = await db.execute(
    'SELECT id FROM bibliography_entries WHERE authors LIKE ? LIMIT 3',
    [`%${rule.author}%`]
  );
  
  if (entries.length === 0) {
    console.log(`  ⚠ Auteur "${rule.author}" non trouvé en bibliographie`);
    continue;
  }
  
  const table = rule.entityType === 'molecule' ? 'molecules' : 'plants';
  
  for (const entry of entries) {
    for (const name of rule.names) {
      const [entities] = await db.execute(
        `SELECT id FROM ${table} WHERE name LIKE ? LIMIT 1`,
        [`%${name}%`]
      );
      
      if (entities.length > 0) {
        try {
          await db.execute(
            `INSERT IGNORE INTO bibliography_entity_links (id, entry_id, entity_type, entity_id, relevance_note, created_at)
             VALUES (?, ?, ?, ?, ?, NOW())`,
            [randomBytes(8).toString('hex'), entry.id, rule.entityType, entities[0].id, `Référence scientifique pour ${name}`]
          );
          liaisonsCreated++;
          console.log(`  ✓ ${rule.author} → ${rule.entityType}:${name}`);
        } catch (e) {
          // Doublon ignoré
        }
      }
    }
  }
}

console.log(`\nLiaisons bibliographiques: ${liaisonsCreated} créées`);

// ============================================================
// 4. RÉSUMÉ FINAL
// ============================================================
const [totalRecettes] = await db.execute('SELECT COUNT(*) as n FROM recettes');
const [totalBiblio] = await db.execute('SELECT COUNT(*) as n FROM bibliography_entries');
const [totalLiaisons] = await db.execute('SELECT COUNT(*) as n FROM bibliography_entity_links');

console.log('\n=== RÉSUMÉ FINAL ===');
console.log(`Recettes totales: ${totalRecettes[0].n}`);
console.log(`Bibliographie totale: ${totalBiblio[0].n}`);
console.log(`Liaisons bibliographiques: ${totalLiaisons[0].n}`);

await db.end();
