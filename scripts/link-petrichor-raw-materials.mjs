/**
 * PERFUMUM — Liaison recettes Petrichor Radicalis Extremis ↔ matières premières
 * Lie les 4 recettes Petrichor importées à leurs matières premières en base
 * via la table recette_raw_materials.
 */

import mysql from 'mysql2/promise';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT = join(__dirname, '..');

// Données des recettes Petrichor Radicalis Extremis
// (extraites de notion_recettes_radicales.json)
const PETRICHOR_RECETTES = [
  {
    nom: 'Pétrichor Radioactif',
    ingredients: [
      { ingredient: 'Mitti Attar', concentration: 0.1, note: '' },
      { ingredient: 'Juniper', concentration: 0.15, note: 'ozone vert-chaud' },
      { ingredient: 'Makrut', concentration: 0.07, note: 'acide métallique' },
      { ingredient: 'Frankincense Noir', concentration: 0.12, note: 'fumée noire' },
      { ingredient: 'Ambergris', concentration: 0.03, note: 'ionique, humide jaune' },
      { ingredient: 'Spikenard', concentration: 0.08, note: 'terre brûlée' },
      { ingredient: 'Vétiver Assam pyrolysé', concentration: 0.02, note: 'trace, effet cendre carbonique' },
    ],
  },
  {
    nom: 'Pétrichor sur Béton Humain',
    ingredients: [
      { ingredient: 'Mitti Attar', concentration: 0.12, note: '' },
      { ingredient: 'Vetiver Haiti', concentration: 0.18, note: 'minéral' },
      { ingredient: 'Frankincense', concentration: 0.15, note: 'plâtre, poussière blanche' },
      { ingredient: 'Palo Santo', concentration: 0.05, note: '' },
      { ingredient: 'Makrut', concentration: 0.03, note: '' },
      { ingredient: 'Ambergris', concentration: 0.02, note: '' },
    ],
  },
  {
    nom: 'Pétrichor sur Cendres Humaines',
    ingredients: [
      { ingredient: 'Mitti Attar', concentration: 0.1, note: '' },
      { ingredient: 'Frankincense Noir', concentration: 0.2, note: 'fumée blanche froide' },
      { ingredient: 'Oud Tea', concentration: 0.05, note: 'bois humide, thé froid' },
      { ingredient: 'Santal', concentration: 0.1, note: 'douceur cendreuse' },
      { ingredient: 'Ambergris', concentration: 0.02, note: 'humidité minérale' },
      { ingredient: 'Spikenard', concentration: 0.06, note: 'terre froide' },
    ],
  },
  {
    nom: 'Pétrichor sur Fer Rouge',
    ingredients: [
      { ingredient: 'Juniper', concentration: 0.2, note: 'ozone chaud, métal brûlant' },
      { ingredient: 'Makrut', concentration: 0.1, note: 'acide métallique' },
      { ingredient: 'Mitti Attar', concentration: 0.08, note: '' },
      { ingredient: 'Vetiver Assam', concentration: 0.15, note: 'fumée sèche' },
      { ingredient: 'Frankincense', concentration: 0.1, note: 'résine brûlée' },
      { ingredient: 'Ambergris', concentration: 0.02, note: 'ionique' },
    ],
  },
];

// Mapping des noms d'ingrédients vers des termes de recherche en base
const SEARCH_ALIASES = {
  'Mitti Attar': ['Mitti Attar', 'Petrichor Origin'],
  'Juniper': ['Juniper', 'Genièvre', 'Wild Juniper'],
  'Makrut': ['Makrut', 'Kaffir'],
  'Frankincense Noir': ['Black Frankincense', 'Frankincense Noir', 'Boswellia'],
  'Frankincense': ['Frankincense', 'Oliban', 'Boswellia'],
  'Ambergris': ['Ambergris', 'Ambre Gris', 'Gris d\'Ambre'],
  'Spikenard': ['Spikenard', 'Nard', 'Jatamansi'],
  'Vétiver Assam pyrolysé': ['Assam', 'Vetiver Assam', 'Black Emerald'],
  'Vetiver Haiti': ['Haitian Vetiver', 'Vetiver Haiti', 'Vétiver Haïti'],
  'Vetiver Assam': ['Assam', 'Vetiver Assam', 'Black Emerald'],
  'Palo Santo': ['Palo Santo'],
  'Oud Tea': ['Oud Tea', 'Aquilaria Malaccensis Leaves'],
  'Santal': ['Santal', 'Sandalwood', 'Santalum'],
};

async function findRawMaterial(conn, ingredientName) {
  const aliases = SEARCH_ALIASES[ingredientName] || [ingredientName];
  
  for (const alias of aliases) {
    const [rows] = await conn.execute(
      'SELECT id, name FROM raw_materials WHERE name LIKE ? ORDER BY id LIMIT 1',
      ['%' + alias + '%']
    );
    if (rows.length > 0) return rows[0];
  }
  return null;
}

function inferRole(concentration) {
  if (concentration >= 0.15) return 'base';
  if (concentration >= 0.08) return 'coeur';
  if (concentration >= 0.03) return 'tete';
  return 'modificateur';
}

async function main() {
  const conn = await mysql.createConnection(process.env.DATABASE_URL);
  
  let stats = { linked: 0, skipped: 0, notFound: [] };
  
  for (const recette of PETRICHOR_RECETTES) {
    // Trouver l'ID de la recette en base
    const [recetteRows] = await conn.execute(
      'SELECT id FROM recettes WHERE name = ? LIMIT 1',
      [recette.nom]
    );
    
    if (recetteRows.length === 0) {
      console.log('⚠️  Recette non trouvée en base : ' + recette.nom);
      continue;
    }
    
    const recetteId = recetteRows[0].id;
    console.log('\n📋 ' + recette.nom + ' (ID: ' + recetteId + ')');
    
    for (let i = 0; i < recette.ingredients.length; i++) {
      const ing = recette.ingredients[i];
      
      // Vérifier si la liaison existe déjà
      const [existing] = await conn.execute(
        'SELECT id FROM recette_raw_materials WHERE recette_id = ? AND raw_material_id IN (SELECT id FROM raw_materials WHERE name LIKE ? LIMIT 1)',
        [recetteId, '%' + ing.ingredient.split(' ')[0] + '%']
      );
      
      if (existing.length > 0) {
        console.log('  ↩️  ' + ing.ingredient + ' — liaison existante');
        stats.skipped++;
        continue;
      }
      
      // Trouver la matière première
      const rawMaterial = await findRawMaterial(conn, ing.ingredient);
      
      if (!rawMaterial) {
        console.log('  ❌ ' + ing.ingredient + ' — non trouvé en base');
        stats.notFound.push(ing.ingredient);
        continue;
      }
      
      const role = inferRole(ing.concentration);
      const percentage = Math.round(ing.concentration * 100 * 100) / 100;
      
      await conn.execute(
        `INSERT INTO recette_raw_materials 
          (recette_id, raw_material_id, role, dosage, dosage_unit, percentage, notes, sort_order)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          recetteId,
          rawMaterial.id,
          role,
          ing.concentration,
          'fraction',
          percentage,
          ing.note || null,
          i + 1,
        ]
      );
      
      console.log('  ✅ ' + ing.ingredient + ' → ' + rawMaterial.name + ' (' + role + ', ' + percentage + '%)');
      stats.linked++;
    }
  }
  
  await conn.end();
  
  console.log('\n═══════════════════════════════════════════════');
  console.log('📊 RÉSUMÉ LIAISON PETRICHOR ↔ MATIÈRES PREMIÈRES');
  console.log('═══════════════════════════════════════════════');
  console.log('✅ Liaisons créées  : ' + stats.linked);
  console.log('↩️  Déjà existantes : ' + stats.skipped);
  if (stats.notFound.length > 0) {
    console.log('❌ Non trouvées    : ' + stats.notFound.join(', '));
  }
  console.log('═══════════════════════════════════════════════');
}

main().catch(e => {
  console.error('❌ Erreur fatale :', e.message);
  process.exit(1);
});
