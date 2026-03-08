#!/usr/bin/env node
/**
 * Import AS-04 Protocoles Application Terpènes (18 protocoles)
 * + Recettes Pétrichor Radicaux (5 accords)
 * + Recettes Pétrichor Hash/Tabac (6 accords)
 * + Accords Mossi Burkina Faso (5 accords)
 * + Accords Expérimentaux (10 accords)
 * 
 * Table recettes: id, name, category (enum tabac/resine/resine_cbd/cone/parfum/encens/extrait),
 * formula, protocol, intensity, maturationTime, description, ingredients, notes,
 * notes_tete, notes_coeur, notes_fond, gamme, status (experimental/testing/validated/production)
 */
const mysql = require('mysql2/promise');
require('dotenv').config();

const DB_URL = process.env.DATABASE_URL;

async function getConn() {
  const url = new URL(DB_URL);
  return mysql.createConnection({
    host: url.hostname, port: parseInt(url.port)||3306,
    user: url.username, password: url.password,
    database: url.pathname.slice(1), ssl: {rejectUnauthorized: false}
  });
}

async function findRecipe(conn, name) {
  const [rows] = await conn.execute('SELECT id FROM recettes WHERE name = ? LIMIT 1', [name]);
  return rows.length > 0 ? rows[0].id : null;
}

async function createRecipe(conn, data) {
  const existing = await findRecipe(conn, data.name);
  if (existing) return { id: existing, created: false };
  
  const [result] = await conn.execute(
    `INSERT INTO recettes (name, category, description, formula, protocol, ingredients, notes,
     notes_tete, notes_coeur, notes_fond, maturationTime, gamme, status, createdAt, updatedAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
    [
      data.name,
      data.category || 'tabac',
      data.description || null,
      data.formula || null,
      data.protocol || null,
      data.ingredients ? JSON.stringify(data.ingredients) : null,
      data.notes || null,
      data.notes_tete || null,
      data.notes_coeur || null,
      data.notes_fond || null,
      data.maturationTime || null,
      data.gamme || null,
      data.status || 'experimental'
    ]
  );
  return { id: result.insertId, created: true };
}

async function main() {
  const conn = await getConn();
  let created = 0, skipped = 0, errors = 0;

  // ===== AS-04 : 18 Protocoles Application Terpènes =====
  console.log('\n=== AS-04 Protocoles Application Terpènes ===');
  
  const as04Protocols = [
    // Yenidje × Nerolidol
    { name: 'AS-04 — Yenidje × Nerolidol Whisper 0.5%', category: 'tabac',
      description: 'Oriental Mystique — curry-coconut-rose-woody. Gamme Whisper 0.5% par vaporisation. Marge 2482-6192%.',
      formula: 'Yenidje 99.5% + Nerolidol 0.5%',
      protocol: 'Vaporisation fine sur tabac. Laisser reposer 2 semaines en boîte hermétique.',
      notes_tete: 'Nerolidol (floral-rose)', notes_coeur: 'Yenidje (curry-coconut)', notes_fond: 'Yenidje (woody-oriental)',
      maturationTime: 14, gamme: 'Whisper', status: 'validated',
      ingredients: [{ name: 'Yenidje', pct: 99.5 }, { name: 'Nerolidol', pct: 0.5 }] },
    { name: 'AS-04 — Yenidje × Nerolidol Classic 1.5%', category: 'tabac',
      description: 'Oriental Mystique — curry-coconut-rose-woody. Gamme Classic 1.5% par pipette. Marge 2393-6122%.',
      formula: 'Yenidje 98.5% + Nerolidol 1.5%',
      protocol: 'Application pipette, mélange homogène. Maturation 4 semaines.',
      notes_tete: 'Nerolidol (floral-rose)', notes_coeur: 'Yenidje (curry-coconut)', notes_fond: 'Yenidje (woody-oriental)',
      maturationTime: 28, gamme: 'Classic', status: 'validated',
      ingredients: [{ name: 'Yenidje', pct: 98.5 }, { name: 'Nerolidol', pct: 1.5 }] },
    { name: 'AS-04 — Yenidje × Nerolidol Bold 3%', category: 'tabac',
      description: 'Oriental Mystique — curry-coconut-rose-woody. Gamme Bold 3% par macération. Marge 2290-6582%.',
      formula: 'Yenidje 97% + Nerolidol 3%',
      protocol: 'Macération 48h dans solution alcoolique, séchage lent. Maturation 6-8 semaines.',
      notes_tete: 'Nerolidol (floral-rose)', notes_coeur: 'Yenidje (curry-coconut)', notes_fond: 'Yenidje (woody-oriental)',
      maturationTime: 49, gamme: 'Bold', status: 'validated',
      ingredients: [{ name: 'Yenidje', pct: 97 }, { name: 'Nerolidol', pct: 3 }] },
    // Xanthi × Nerolidol
    { name: 'AS-04 — Xanthi × Nerolidol Whisper 0.5%', category: 'tabac',
      description: 'Terre de Rose — earthy-floral-rose. Gamme Whisper 0.5%. Marge 4211-9393%.',
      formula: 'Xanthi 99.5% + Nerolidol 0.5%',
      protocol: 'Vaporisation fine. Maturation 2 semaines.',
      notes_tete: 'Nerolidol (rose-floral)', notes_coeur: 'Xanthi (earthy-terreux)', notes_fond: 'Xanthi (oriental)',
      maturationTime: 14, gamme: 'Whisper', status: 'validated',
      ingredients: [{ name: 'Xanthi', pct: 99.5 }, { name: 'Nerolidol', pct: 0.5 }] },
    { name: 'AS-04 — Xanthi × Nerolidol Classic 1.5%', category: 'tabac',
      description: 'Terre de Rose — earthy-floral-rose. Gamme Classic 1.5%. Marge 3415-7905%.',
      formula: 'Xanthi 98.5% + Nerolidol 1.5%',
      protocol: 'Application pipette. Maturation 4 semaines.',
      notes_tete: 'Nerolidol (rose-floral)', notes_coeur: 'Xanthi (earthy)', notes_fond: 'Xanthi (oriental)',
      maturationTime: 28, gamme: 'Classic', status: 'validated',
      ingredients: [{ name: 'Xanthi', pct: 98.5 }, { name: 'Nerolidol', pct: 1.5 }] },
    { name: 'AS-04 — Xanthi × Nerolidol Bold 3%', category: 'tabac',
      description: 'Terre de Rose — earthy-floral-rose. Gamme Bold 3%. Marge 2828-7637%.',
      formula: 'Xanthi 97% + Nerolidol 3%',
      protocol: 'Macération. Maturation 6-8 semaines.',
      notes_tete: 'Nerolidol (rose-floral)', notes_coeur: 'Xanthi (earthy)', notes_fond: 'Xanthi (oriental)',
      maturationTime: 49, gamme: 'Bold', status: 'validated',
      ingredients: [{ name: 'Xanthi', pct: 97 }, { name: 'Nerolidol', pct: 3 }] },
    // Xanthi × Bisabolol
    { name: 'AS-04 — Xanthi × Bisabolol Whisper 0.5%', category: 'tabac',
      description: 'Terre de Camomille — earthy-camomille-doux. Gamme Whisper 0.5%. Marge 2051-3214%.',
      formula: 'Xanthi 99.5% + Bisabolol 0.5%',
      protocol: 'Vaporisation fine. Maturation 2 semaines.',
      notes_tete: 'Bisabolol (camomille-doux)', notes_coeur: 'Xanthi (earthy)', notes_fond: 'Xanthi (oriental)',
      maturationTime: 14, gamme: 'Whisper', status: 'validated',
      ingredients: [{ name: 'Xanthi', pct: 99.5 }, { name: 'Bisabolol', pct: 0.5 }] },
    { name: 'AS-04 — Xanthi × Bisabolol Classic 1.5%', category: 'tabac',
      description: 'Terre de Camomille — earthy-camomille-doux. Gamme Classic 1.5%.',
      formula: 'Xanthi 98.5% + Bisabolol 1.5%',
      protocol: 'Application pipette. Maturation 4 semaines.',
      notes_tete: 'Bisabolol (camomille)', notes_coeur: 'Xanthi (earthy)', notes_fond: 'Xanthi (oriental)',
      maturationTime: 28, gamme: 'Classic', status: 'validated',
      ingredients: [{ name: 'Xanthi', pct: 98.5 }, { name: 'Bisabolol', pct: 1.5 }] },
    { name: 'AS-04 — Xanthi × Bisabolol Bold 3%', category: 'tabac',
      description: 'Terre de Camomille — earthy-camomille-doux. Gamme Bold 3%.',
      formula: 'Xanthi 97% + Bisabolol 3%',
      protocol: 'Macération. Maturation 6-8 semaines.',
      notes_tete: 'Bisabolol (camomille)', notes_coeur: 'Xanthi (earthy)', notes_fond: 'Xanthi (oriental)',
      maturationTime: 49, gamme: 'Bold', status: 'validated',
      ingredients: [{ name: 'Xanthi', pct: 97 }, { name: 'Bisabolol', pct: 3 }] },
    // Yenidje × Bisabolol
    { name: 'AS-04 — Yenidje × Bisabolol Whisper 0.5%', category: 'tabac',
      description: 'Crème de Curry — curry-cream-camomille. Gamme Whisper 0.5%.',
      formula: 'Yenidje 99.5% + Bisabolol 0.5%',
      protocol: 'Vaporisation fine. Maturation 2 semaines.',
      notes_tete: 'Bisabolol (camomille-cream)', notes_coeur: 'Yenidje (curry)', notes_fond: 'Yenidje (oriental)',
      maturationTime: 14, gamme: 'Whisper', status: 'validated',
      ingredients: [{ name: 'Yenidje', pct: 99.5 }, { name: 'Bisabolol', pct: 0.5 }] },
    { name: 'AS-04 — Yenidje × Bisabolol Classic 1.5%', category: 'tabac',
      description: 'Crème de Curry — curry-cream-camomille. Gamme Classic 1.5%.',
      formula: 'Yenidje 98.5% + Bisabolol 1.5%',
      protocol: 'Application pipette. Maturation 4 semaines.',
      notes_tete: 'Bisabolol (camomille-cream)', notes_coeur: 'Yenidje (curry)', notes_fond: 'Yenidje (oriental)',
      maturationTime: 28, gamme: 'Classic', status: 'validated',
      ingredients: [{ name: 'Yenidje', pct: 98.5 }, { name: 'Bisabolol', pct: 1.5 }] },
    { name: 'AS-04 — Yenidje × Bisabolol Bold 3%', category: 'tabac',
      description: 'Crème de Curry — curry-cream-camomille. Gamme Bold 3%.',
      formula: 'Yenidje 97% + Bisabolol 3%',
      protocol: 'Macération. Maturation 6-8 semaines.',
      notes_tete: 'Bisabolol (camomille-cream)', notes_coeur: 'Yenidje (curry)', notes_fond: 'Yenidje (oriental)',
      maturationTime: 49, gamme: 'Bold', status: 'validated',
      ingredients: [{ name: 'Yenidje', pct: 97 }, { name: 'Bisabolol', pct: 3 }] },
    // Xanthi × Valencene
    { name: 'AS-04 — Xanthi × Valencene Whisper 0.5%', category: 'tabac',
      description: 'Terre d\'Orange — earthy-agrumes-orange. Gamme Whisper 0.5%. Marge ~3900%.',
      formula: 'Xanthi 99.5% + Valencene 0.5%',
      protocol: 'Vaporisation fine. Maturation 2 semaines.',
      notes_tete: 'Valencene (orange-agrumes)', notes_coeur: 'Xanthi (earthy)', notes_fond: 'Xanthi (oriental)',
      maturationTime: 14, gamme: 'Whisper', status: 'validated',
      ingredients: [{ name: 'Xanthi', pct: 99.5 }, { name: 'Valencene', pct: 0.5 }] },
    { name: 'AS-04 — Xanthi × Valencene Classic 1.5%', category: 'tabac',
      description: 'Terre d\'Orange — earthy-agrumes-orange. Gamme Classic 1.5%.',
      formula: 'Xanthi 98.5% + Valencene 1.5%',
      protocol: 'Application pipette. Maturation 4 semaines.',
      notes_tete: 'Valencene (orange-agrumes)', notes_coeur: 'Xanthi (earthy)', notes_fond: 'Xanthi (oriental)',
      maturationTime: 28, gamme: 'Classic', status: 'validated',
      ingredients: [{ name: 'Xanthi', pct: 98.5 }, { name: 'Valencene', pct: 1.5 }] },
    { name: 'AS-04 — Xanthi × Valencene Bold 3%', category: 'tabac',
      description: 'Terre d\'Orange — earthy-agrumes-orange. Gamme Bold 3%.',
      formula: 'Xanthi 97% + Valencene 3%',
      protocol: 'Macération. Maturation 6-8 semaines.',
      notes_tete: 'Valencene (orange-agrumes)', notes_coeur: 'Xanthi (earthy)', notes_fond: 'Xanthi (oriental)',
      maturationTime: 49, gamme: 'Bold', status: 'validated',
      ingredients: [{ name: 'Xanthi', pct: 97 }, { name: 'Valencene', pct: 3 }] },
    // Yenidje × Valencene
    { name: 'AS-04 — Yenidje × Valencene Whisper 0.5%', category: 'tabac',
      description: 'Coconut Sunrise — coconut-agrumes-frais. Gamme Whisper 0.5%.',
      formula: 'Yenidje 99.5% + Valencene 0.5%',
      protocol: 'Vaporisation fine. Maturation 2 semaines.',
      notes_tete: 'Valencene (agrumes-frais)', notes_coeur: 'Yenidje (coconut)', notes_fond: 'Yenidje (oriental)',
      maturationTime: 14, gamme: 'Whisper', status: 'validated',
      ingredients: [{ name: 'Yenidje', pct: 99.5 }, { name: 'Valencene', pct: 0.5 }] },
    { name: 'AS-04 — Yenidje × Valencene Classic 1.5%', category: 'tabac',
      description: 'Coconut Sunrise — coconut-agrumes-frais. Gamme Classic 1.5%.',
      formula: 'Yenidje 98.5% + Valencene 1.5%',
      protocol: 'Application pipette. Maturation 4 semaines.',
      notes_tete: 'Valencene (agrumes-frais)', notes_coeur: 'Yenidje (coconut)', notes_fond: 'Yenidje (oriental)',
      maturationTime: 28, gamme: 'Classic', status: 'validated',
      ingredients: [{ name: 'Yenidje', pct: 98.5 }, { name: 'Valencene', pct: 1.5 }] },
    { name: 'AS-04 — Yenidje × Valencene Bold 3%', category: 'tabac',
      description: 'Coconut Sunrise — coconut-agrumes-frais. Gamme Bold 3%.',
      formula: 'Yenidje 97% + Valencene 3%',
      protocol: 'Macération. Maturation 6-8 semaines.',
      notes_tete: 'Valencene (agrumes-frais)', notes_coeur: 'Yenidje (coconut)', notes_fond: 'Yenidje (oriental)',
      maturationTime: 49, gamme: 'Bold', status: 'validated',
      ingredients: [{ name: 'Yenidje', pct: 97 }, { name: 'Valencene', pct: 3 }] },
  ];

  for (const recipe of as04Protocols) {
    try {
      const { created: c } = await createRecipe(conn, recipe);
      if (c) { created++; process.stdout.write(`  + ${recipe.name}\n`); }
      else { skipped++; }
    } catch(e) { errors++; console.error(`  ✗ ${recipe.name}: ${e.message}`); }
  }

  // ===== Pétrichor Radicaux (5 accords) =====
  console.log('\n=== Pétrichor Radicaux (5 accords artistiques) ===');
  
  const petrichorRadicaux = [
    { name: 'Pétrichor Radioactif', category: 'parfum',
      description: 'Pluie sur sol irradié, métal brûlant, ozone déchiré, pierre calcinée. Accord conceptuel non commercial. Installation immersive zone contaminée.',
      formula: 'Mitti Attar 0.10 + Juniper 0.15 + Makrut 0.07 + Frankincense Noir 0.12 + Ambergris 0.03 + Spikenard 0.08 + Vétiver Assam pyrolysé 0.02',
      notes_tete: 'Juniper (ozone vert-chaud), Makrut (acide métallique)',
      notes_coeur: 'Mitti Attar, Frankincense Noir (fumée noire)',
      notes_fond: 'Ambergris (ionique), Spikenard (terre brûlée), Vétiver Assam pyrolysé',
      notes: 'Poussière jaune soufflée, pluie sale, sol qui ne vit plus. Usage : installation immersive, réflexion post-catastrophe.',
      status: 'experimental',
      ingredients: [
        { name: 'Mitti Attar', pct: 0.10 }, { name: 'Juniper', pct: 0.15 },
        { name: 'Makrut', pct: 0.07 }, { name: 'Frankincense Noir', pct: 0.12 },
        { name: 'Ambergris', pct: 0.03 }, { name: 'Spikenard', pct: 0.08 },
        { name: 'Vétiver Assam pyrolysé', pct: 0.02 }
      ] },
    { name: 'Pétrichor sur Béton Humain', category: 'parfum',
      description: 'Pluie sur béton, poussière de ciment, eau stagnante urbaine. Le petrichor d\'une ville vide.',
      formula: 'Mitti Attar 0.12 + Vetiver Haiti 0.18 + Frankincense 0.15 + Palo Santo 0.05 + Makrut 0.03 + Ambergris 0.02',
      notes_tete: 'Makrut, Palo Santo',
      notes_coeur: 'Mitti Attar, Frankincense (plâtre, poussière blanche)',
      notes_fond: 'Vetiver Haiti (minéral), Ambergris',
      notes: 'Béton mouillé + solvant léger. Usage : installation ville après la pluie.',
      status: 'experimental',
      ingredients: [
        { name: 'Mitti Attar', pct: 0.12 }, { name: 'Vetiver Haiti', pct: 0.18 },
        { name: 'Frankincense', pct: 0.15 }, { name: 'Palo Santo', pct: 0.05 },
        { name: 'Makrut', pct: 0.03 }, { name: 'Ambergris', pct: 0.02 }
      ] },
    { name: 'Pétrichor sur Cendres Humaines', category: 'parfum',
      description: 'Pluie sur cendre tiède, minéral post-incinération. Accord conceptuel et sensible. Performance (mémoire, deuil, rite).',
      formula: 'Mitti Attar 0.20 + Frankincense Noir 0.10 + Oud Tea 0.05 + Santal 0.06 + Ambergris 0.03 + Spikenard 0.05',
      notes_tete: 'Oud Tea (fumée froide)',
      notes_coeur: 'Mitti Attar, Frankincense Noir (minéral-noir, sacré profané)',
      notes_fond: 'Santal (os sec), Ambergris, Spikenard',
      notes: 'Pluie sur des cendres encore chaudes : minéral blanc, trace animale, humidité froide.',
      status: 'experimental',
      ingredients: [
        { name: 'Mitti Attar', pct: 0.20 }, { name: 'Frankincense Noir', pct: 0.10 },
        { name: 'Oud Tea', pct: 0.05 }, { name: 'Santal', pct: 0.06 },
        { name: 'Ambergris', pct: 0.03 }, { name: 'Spikenard', pct: 0.05 }
      ] },
    { name: 'Pétrichor sur Fer Rouge', category: 'parfum',
      description: 'Pluie hurlante sur fer incandescent. Explosion vapeur, eau sur métal brûlant. Deux phases : chaude puis froide.',
      formula: 'Juniper 0.15 + Makrut 0.08 + Mitti Attar 0.10 + Vetiver Assam 0.12 + Frankincense 0.07 + Ambergris 0.02',
      notes_tete: 'Juniper, Makrut',
      notes_coeur: 'Mitti Attar, Frankincense',
      notes_fond: 'Vetiver Assam, Ambergris',
      notes: 'Explosion vapeur / eau sur métal brûlant. Usage : installation avec éléments métalliques chauffés.',
      status: 'experimental',
      ingredients: [
        { name: 'Juniper', pct: 0.15 }, { name: 'Makrut', pct: 0.08 },
        { name: 'Mitti Attar', pct: 0.10 }, { name: 'Vetiver Assam', pct: 0.12 },
        { name: 'Frankincense', pct: 0.07 }, { name: 'Ambergris', pct: 0.02 }
      ] },
    { name: 'Pétrichor Sépulcral', category: 'parfum',
      description: 'Pluie sur pierre tombale, mousse humide, terre froide. L\'odeur du silence permanent. Sculpture olfactive funéraire.',
      formula: 'Mitti Attar 0.22 + Vetiver Assam 0.18 + Frankincense Noir 0.12 + Spikenard 0.08 + Makrut 0.04 + Ambergris 0.02',
      notes_tete: 'Makrut, Juniper',
      notes_coeur: 'Mitti Attar, Frankincense Noir',
      notes_fond: 'Vetiver Assam, Spikenard, Ambergris',
      notes: 'Pierre mouillée, mousse, terre froide. Méditation sur la permanence.',
      status: 'experimental',
      ingredients: [
        { name: 'Mitti Attar', pct: 0.22 }, { name: 'Vetiver Assam', pct: 0.18 },
        { name: 'Frankincense Noir', pct: 0.12 }, { name: 'Spikenard', pct: 0.08 },
        { name: 'Makrut', pct: 0.04 }, { name: 'Ambergris', pct: 0.02 }
      ] },
  ];

  for (const recipe of petrichorRadicaux) {
    try {
      const { created: c } = await createRecipe(conn, recipe);
      if (c) { created++; console.log(`  + Pétrichor Radical: ${recipe.name}`); }
      else { skipped++; }
    } catch(e) { errors++; console.error(`  ✗ ${recipe.name}: ${e.message}`); }
  }

  // ===== Pétrichor Hash/Tabac (6 accords) =====
  console.log('\n=== Pétrichor Hash/Tabac (6 accords maîtres) ===');
  
  const petrichorHashTabac = [
    { name: 'Hash Prima — Pétrichor', category: 'resine_cbd',
      description: 'Terre vive + pluie chaude + hash vert. Formule mère pour hash moelleux, pollen, résines grasses CBD.',
      formula: 'Mitti Attar 0.25% + Vetiver Assam 0.20% + Frankincense Noir 0.10% + Juniper 0.08% + Palo Santo 0.05% + Ambergris 0.03%',
      notes_tete: 'Juniper, Palo Santo', notes_coeur: 'Mitti Attar, Frankincense Noir', notes_fond: 'Vetiver Assam, Ambergris',
      notes: 'Variations : Prima-Verte (+Makrut 0.03), Prima-Fumée (+Frankincense 0.05), Prima-Humide (+Mitti 0.05). Usage : hash moelleux, pollen, résines grasses CBD.',
      status: 'validated',
      ingredients: [
        { name: 'Mitti Attar', pct: 0.25 }, { name: 'Vetiver Assam', pct: 0.20 },
        { name: 'Frankincense Noir', pct: 0.10 }, { name: 'Juniper', pct: 0.08 },
        { name: 'Palo Santo', pct: 0.05 }, { name: 'Ambergris', pct: 0.03 }
      ] },
    { name: 'Tabac Fermenté — Pétrichor', category: 'resine_cbd',
      description: 'Tabac brun + cave humide. Pour résines brunes, hash à texture terre.',
      formula: 'Mitti Attar 0.20% + Vetiver Haiti 0.15% + Oud Tea 0.10% + Santal 0.08% + Black Frankincense 0.07% + Spikenard 0.05% + Neroli Réserve 0.02%',
      notes_tete: 'Neroli Réserve', notes_coeur: 'Mitti Attar, Oud Tea, Spikenard', notes_fond: 'Vetiver Haiti, Santal, Black Frankincense',
      notes: 'Variations : Fermenté-Fort (+Spikenard 0.03), Fermenté-Léger (Oud Tea à 0.05). Usage : résines brunes, hash à texture terre.',
      status: 'validated',
      ingredients: [
        { name: 'Mitti Attar', pct: 0.20 }, { name: 'Vetiver Haiti', pct: 0.15 },
        { name: 'Oud Tea', pct: 0.10 }, { name: 'Santal', pct: 0.08 },
        { name: 'Black Frankincense', pct: 0.07 }, { name: 'Spikenard', pct: 0.05 },
        { name: 'Neroli Réserve', pct: 0.02 }
      ] },
    { name: 'Minéral Hash — Pétrichor', category: 'resine_cbd',
      description: 'Pierre + poussière + pluie froide. Pour Ice-O-Lator, Frozen Sift, résines filtrées.',
      formula: 'Mitti Attar 0.18% + Vetiver Assam 0.18% + Frankincense 0.10% + Makrut 0.05% + Juniper 0.06% + Oud Tea 0.05% + Ambergris 0.02%',
      notes_tete: 'Makrut, Juniper', notes_coeur: 'Mitti Attar, Frankincense, Oud Tea', notes_fond: 'Vetiver Assam, Ambergris',
      notes: 'Variations : Minéral-Chaud (+Palo 0.03), Minéral-Froid (+Juniper 0.04). Usage : Ice-O-Lator, Frozen Sift, résines filtrées.',
      status: 'validated',
      ingredients: [
        { name: 'Mitti Attar', pct: 0.18 }, { name: 'Vetiver Assam', pct: 0.18 },
        { name: 'Frankincense', pct: 0.10 }, { name: 'Makrut', pct: 0.05 },
        { name: 'Juniper', pct: 0.06 }, { name: 'Oud Tea', pct: 0.05 },
        { name: 'Ambergris', pct: 0.02 }
      ] },
    { name: 'Floral Salé — Pétrichor', category: 'resine_cbd',
      description: 'Fleur blanche humide + pluie + sel + poussière. Pour Libanais rouge, résines fraîches.',
      formula: 'Mitti Attar 0.22% + Neroli 0.05% + Frangipani 0.05% + Vetiver Haiti 0.12% + Black Frankincense 0.06% + Ambergris 0.03%',
      notes_tete: 'Neroli, Frangipani', notes_coeur: 'Mitti Attar, Black Frankincense', notes_fond: 'Vetiver Haiti, Ambergris',
      notes: 'Variations : Floral-Salé fort (+Ambergris 0.02), Floral-Sec (Mitti à 0.18). Usage : Libanais rouge, résines fraîches.',
      status: 'validated',
      ingredients: [
        { name: 'Mitti Attar', pct: 0.22 }, { name: 'Neroli', pct: 0.05 },
        { name: 'Frangipani', pct: 0.05 }, { name: 'Vetiver Haiti', pct: 0.12 },
        { name: 'Black Frankincense', pct: 0.06 }, { name: 'Ambergris', pct: 0.03 }
      ] },
    { name: 'Animal Fumé — Pétrichor', category: 'resine_cbd',
      description: 'Sol humide + cendre + panse animale + pluie. Pour CBN/CBG, hash noir, résines grasses.',
      formula: 'Mitti Attar 0.25% + Vetiver Assam 0.20% + Palo Santo 0.10% + Frankincense Noir 0.10% + Spikenard 0.07% + Oud Tea 0.05% + Ambergris 0.03%',
      notes_tete: 'Palo Santo', notes_coeur: 'Mitti Attar, Frankincense Noir, Spikenard', notes_fond: 'Vetiver Assam, Oud Tea, Ambergris',
      notes: 'Variations : Animal Noir (+Spikenard 0.03), Animal Noble (+Santal 0.05). Usage : CBN/CBG, hash noir, résines grasses.',
      status: 'validated',
      ingredients: [
        { name: 'Mitti Attar', pct: 0.25 }, { name: 'Vetiver Assam', pct: 0.20 },
        { name: 'Palo Santo', pct: 0.10 }, { name: 'Frankincense Noir', pct: 0.10 },
        { name: 'Spikenard', pct: 0.07 }, { name: 'Oud Tea', pct: 0.05 },
        { name: 'Ambergris', pct: 0.03 }
      ] },
    { name: 'Métallique Humide — Pétrichor', category: 'resine_cbd',
      description: 'Pluie sur fer / poussière minérale / vapeur. Barre métallique mouillée + pluie d\'été + poussière chaude.',
      formula: 'Mitti Attar 0.15% + Vetiver Haiti 0.15% + Frankincense Noir 0.10% + Makrut 0.07% + Juniper 0.10% + Ambergris 0.02%',
      notes_tete: 'Makrut (acidité métallique), Juniper', notes_coeur: 'Mitti Attar, Frankincense Noir', notes_fond: 'Vetiver Haiti, Ambergris',
      notes: 'Usage : tabac blond + hash semi-sec. Option Palo Santo 0.03 pour note boisée.',
      status: 'validated',
      ingredients: [
        { name: 'Mitti Attar', pct: 0.15 }, { name: 'Vetiver Haiti', pct: 0.15 },
        { name: 'Frankincense Noir', pct: 0.10 }, { name: 'Makrut', pct: 0.07 },
        { name: 'Juniper', pct: 0.10 }, { name: 'Ambergris', pct: 0.02 }
      ] },
  ];

  for (const recipe of petrichorHashTabac) {
    try {
      const { created: c } = await createRecipe(conn, recipe);
      if (c) { created++; console.log(`  + Hash/Tabac: ${recipe.name}`); }
      else { skipped++; }
    } catch(e) { errors++; console.error(`  ✗ ${recipe.name}: ${e.message}`); }
  }

  // ===== Accords Mossi Burkina Faso (5 accords) =====
  console.log('\n=== Accords Mossi Burkina Faso ===');
  
  const accordsMossi = [
    { name: 'Mossi Clair', category: 'parfum',
      description: 'Accord inspiré de la tradition olfactive Mossi du Burkina Faso. Notes claires et lumineuses de savane.',
      formula: 'Karité 0.20 + Vétiver local 0.15 + Fleurs de savane 0.10 + Terre rouge 0.08',
      notes_tete: 'Agrumes locaux, herbes fraîches', notes_coeur: 'Fleurs de savane, Karité', notes_fond: 'Terre rouge, Vétiver local',
      notes: 'Tradition Mossi, parfumerie africaine. Savane lumineuse.',
      status: 'experimental' },
    { name: 'Mossi Sombre', category: 'parfum',
      description: 'Accord Mossi aux notes profondes et résinées. Nuit de savane, rituels nocturnes.',
      formula: 'Boswellia dalzielii 0.15 + Vétiver 0.20 + Copal local 0.12 + Karité 0.10',
      notes_tete: 'Encens local (Boswellia dalzielii)', notes_coeur: 'Bois de vène, Karité', notes_fond: 'Vétiver, Copal local',
      notes: 'Tradition Mossi, rituels nocturnes. Boisé-résine.',
      status: 'experimental' },
    { name: 'Mossi du Feu', category: 'parfum',
      description: 'Accord Mossi évoquant les feux de savane et les rituels de purification.',
      formula: 'Boswellia dalzielii 0.18 + Vétiver brûlé 0.15 + Karité chauffé 0.12 + Terre noire 0.08',
      notes_tete: 'Fumée de bois local', notes_coeur: 'Encens Boswellia, Karité chauffé', notes_fond: 'Vétiver brûlé, Terre noire',
      notes: 'Rituels de purification, tradition Mossi. Fumé-terreux.',
      status: 'experimental' },
    { name: 'Mossi Verger Sacré', category: 'parfum',
      description: 'Accord Mossi inspiré des vergers sacrés — Karité, Néré, Baobab.',
      formula: 'Karité 0.25 + Néré 0.15 + Baobab 0.10 + Tamarin 0.08',
      notes_tete: 'Fleurs de Karité, Néré', notes_coeur: 'Baobab, Tamarin', notes_fond: 'Bois de Karité, Terre rouge',
      notes: 'Tradition Mossi, vergers sacrés. Fruité-boisé.',
      status: 'experimental' },
    { name: 'Mossi Solaire', category: 'parfum',
      description: 'Accord Mossi lumineux et chaud, évoquant la savane sous le soleil de midi.',
      formula: 'Karité 0.20 + Vétiver 0.15 + Gingembre local 0.08 + Terre rouge chaude 0.10',
      notes_tete: 'Agrumes sauvages, Gingembre local', notes_coeur: 'Karité, Fleurs de savane', notes_fond: 'Vétiver, Terre rouge chaude',
      notes: 'Tradition Mossi, savane solaire. Chaud-épicé.',
      status: 'experimental' },
  ];

  for (const recipe of accordsMossi) {
    try {
      const { created: c } = await createRecipe(conn, recipe);
      if (c) { created++; console.log(`  + Mossi: ${recipe.name}`); }
      else { skipped++; }
    } catch(e) { errors++; console.error(`  ✗ ${recipe.name}: ${e.message}`); }
  }

  // ===== Accords Expérimentaux (10 accords) =====
  console.log('\n=== Accords Expérimentaux & Extrêmes ===');
  
  const accordsExperimentaux = [
    { name: 'Cendres de Mer', category: 'parfum',
      description: 'Minéral salin. Virginia blond + feuille de figuier. Souffle d\'iode et de pierre chaude.',
      formula: 'Virginia blond 0.30 + Mastiha 0.15 + Ambrette 0.08 + Algue sèche 0.05 + Fleur de sel + Hydrolat yuzu',
      notes_tete: 'Fleur de sel, hydrolat de yuzu', notes_coeur: 'Virginia blond, feuille de figuier, Mastiha', notes_fond: 'Ambrette, algue sèche',
      status: 'experimental' },
    { name: 'Peau d\'Encre', category: 'parfum',
      description: 'Animal cuiré. Kentucky + Latakia. Cuir chaud, bibliothèque interdite.',
      formula: 'Kentucky 0.25 + Latakia 0.20 + Labdanum 0.15 + Tonka 0.08',
      notes_tete: 'Gousse de tonka râpée', notes_coeur: 'Kentucky, Latakia', notes_fond: 'Labdanum, castoréum végétal',
      status: 'experimental' },
    { name: 'Orchidée d\'Ombre', category: 'parfum',
      description: 'Floral sombre. Burley + pétales de rose noire. Fleur morte sous voile de poudre.',
      formula: 'Burley 0.25 + Rose noire 0.10 + Vanille 0.12 + Myrrhe 0.08 + Iris 0.05',
      notes_tete: 'Iris, trace de patchouli', notes_coeur: 'Burley, pétales de rose noire', notes_fond: 'Vanille, myrrhe, benjoin',
      status: 'experimental' },
    { name: 'Figue Spectrale', category: 'parfum',
      description: 'Boisé lactonique. Feuille de vigne + Burley clair. Souvenir de figue au soleil froid.',
      formula: 'Burley clair 0.20 + Santal blanc 0.15 + Mastiha 0.10 + Lait d\'avoine 0.08',
      notes_tete: 'Poudre de lait d\'avoine', notes_coeur: 'Feuille de vigne, Burley clair', notes_fond: 'Santal blanc, mastiha',
      status: 'experimental' },
    { name: 'Fossile Liquide', category: 'parfum',
      description: 'Résine ambrée. Oriental Izmir + cèdre râpé. Fumée d\'ambre et d\'église.',
      formula: 'Izmir 0.20 + Labdanum 0.15 + Encens 0.12 + Opoponax 0.08 + Gomme arabique + Miel de datte',
      notes_tete: 'Gomme arabique, miel de datte', notes_coeur: 'Izmir, cèdre râpé', notes_fond: 'Labdanum, encens, opoponax',
      status: 'experimental' },
    { name: 'Feuille de Cuivre', category: 'parfum',
      description: 'Vert métallique. Virginia + thé vert fumé. Fraîcheur industrielle, chlorophylle oxydée.',
      formula: 'Virginia 0.25 + Thé vert fumé 0.15 + Galbanum 0.10 + Vétiver 0.08 + Spiruline séchée',
      notes_tete: 'Poudre de spiruline séchée', notes_coeur: 'Virginia, thé vert fumé', notes_fond: 'Galbanum, vétiver',
      status: 'experimental' },
    { name: 'Mécanique de la Cardamome', category: 'parfum',
      description: 'Épicé froid. Turkish oriental + feuille de menthe. Tension entre feu et glace.',
      formula: 'Turkish oriental 0.25 + Cardamome 0.12 + Poivre rose 0.08 + Menthe 0.05 + Infusion eucalyptus',
      notes_tete: 'Infusion froide d\'eucalyptus', notes_coeur: 'Turkish oriental, feuille de menthe', notes_fond: 'Cardamome, poivre rose',
      status: 'experimental' },
    { name: 'Miel de Cendre', category: 'parfum',
      description: 'Fumée sucrée. Latakia + Burley brun. Douceur brûlée, souvenir d\'hiver.',
      formula: 'Latakia 0.25 + Burley brun 0.20 + Benjoin 0.12 + Résine de pin 0.08 + Sirop sucre inverti',
      notes_tete: 'Sirop de sucre inverti, charbon végétal', notes_coeur: 'Latakia, Burley brun', notes_fond: 'Benjoin, résine de pin',
      status: 'experimental' },
    { name: 'Absynthe Verte', category: 'parfum',
      description: 'Herbacé narcotique. Feuille de mûrier + Burley clair. Herbe sainte et trouble lucide.',
      formula: 'Burley clair 0.20 + Myrrhe 0.10 + Angélique 0.08 + Armoise 0.06 + Hydrolat anis + Miel',
      notes_tete: 'Hydrolat d\'anis, miel', notes_coeur: 'Feuille de mûrier, Burley clair', notes_fond: 'Myrrhe, angélique, armoise',
      status: 'experimental' },
    { name: 'Bois de Plomb', category: 'parfum',
      description: 'Boisé froid. Kentucky + tabac séché à la tourbe. Fumée minérale et silence polaire.',
      formula: 'Kentucky 0.25 + Cèdre 0.15 + Oliban 0.10 + Vétiver 0.08 + Infusion genévrier',
      notes_tete: 'Infusion de genévrier', notes_coeur: 'Kentucky, tabac séché à la tourbe', notes_fond: 'Cèdre, oliban, vétiver',
      status: 'experimental' },
  ];

  for (const recipe of accordsExperimentaux) {
    try {
      const { created: c } = await createRecipe(conn, recipe);
      if (c) { created++; console.log(`  + Expérimental: ${recipe.name}`); }
      else { skipped++; }
    } catch(e) { errors++; console.error(`  ✗ ${recipe.name}: ${e.message}`); }
  }

  // ===== Résumé =====
  const [[totalRecettes]] = await conn.execute('SELECT COUNT(*) as n FROM recettes');
  console.log('\n=== Résumé Final ===');
  console.log(`Recettes créées: ${created} | Existantes: ${skipped} | Erreurs: ${errors}`);
  console.log(`Total recettes en base: ${totalRecettes.n}`);
  
  await conn.end();
}

main().catch(console.error);
