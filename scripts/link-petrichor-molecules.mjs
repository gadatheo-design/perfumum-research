/**
 * PERFUMUM — Liaison recettes Petrichor ↔ molécules caractéristiques
 * Lie chaque recette Petrichor aux molécules clés de ses ingrédients
 * via la table recette_molecules.
 */

import mysql from 'mysql2/promise';

// Molécules caractéristiques par ingrédient (IDs confirmés en base)
// Format: { moleculeId, role, proportion }
const INGREDIENT_MOLECULES = {
  // Mitti Attar / Petrichor
  'Mitti Attar': [
    // Geosmin non trouvé — on utilisera Nardol comme proxy terreux
    { search: 'Nardol', role: 'note terreux', proportion: 10 },
  ],
  // Juniper
  'Juniper': [
    { search: 'Borneol', role: 'note ozone-boisé', proportion: 15 },
  ],
  // Makrut Lime
  'Makrut': [
    { search: 'Limonene', role: 'note agrume-acide', proportion: 7 },
  ],
  // Frankincense / Frankincense Noir
  'Frankincense': [
    { search: 'Borneol', role: 'note résineuse', proportion: 12 },
    { search: 'Guaiol', role: 'note boisée-fumée', proportion: 5 },
  ],
  'Frankincense Noir': [
    { search: 'Borneol', role: 'note résineuse fumée', proportion: 15 },
    { search: 'Guaiol', role: 'note boisée-noire', proportion: 8 },
  ],
  // Ambergris
  'Ambergris': [
    // Ambroxide non trouvé — on utilise Agarospirol comme proxy ambre
    { search: 'Agarospirol', role: 'note ambrée-ionique', proportion: 3 },
  ],
  // Spikenard
  'Spikenard': [
    { search: 'Nardol', role: 'note terre-racine', proportion: 8 },
  ],
  // Vetiver (toutes variantes)
  'Vetiver Haiti': [
    { search: 'Khusimol', role: 'note vétiver-minéral', proportion: 18 },
  ],
  'Vétiver Assam pyrolysé': [
    { search: 'Khusimol', role: 'note vétiver-fumé', proportion: 2 },
  ],
  'Vetiver Assam': [
    { search: 'Khusimol', role: 'note vétiver-sec', proportion: 15 },
  ],
  // Palo Santo
  'Palo Santo': [
    { search: 'Guaiol', role: 'note boisée-sacrée', proportion: 5 },
  ],
  // Oud Tea
  'Oud Tea': [
    { search: 'Agarospirol', role: 'note oud-thé', proportion: 5 },
  ],
  // Santal
  'Santal': [
    { search: 'Santalol', role: 'note santalée', proportion: 10 },
  ],
};

// Recettes Petrichor avec leurs ingrédients
const PETRICHOR_RECETTES = [
  {
    nom: 'Pétrichor Radioactif',
    ingredients: ['Mitti Attar', 'Juniper', 'Makrut', 'Frankincense Noir', 'Ambergris', 'Spikenard', 'Vétiver Assam pyrolysé'],
  },
  {
    nom: 'Pétrichor sur Béton Humain',
    ingredients: ['Mitti Attar', 'Vetiver Haiti', 'Frankincense', 'Palo Santo', 'Makrut', 'Ambergris'],
  },
  {
    nom: 'Pétrichor sur Cendres Humaines',
    ingredients: ['Mitti Attar', 'Frankincense Noir', 'Oud Tea', 'Santal', 'Ambergris', 'Spikenard'],
  },
  {
    nom: 'Pétrichor sur Fer Rouge',
    ingredients: ['Juniper', 'Makrut', 'Mitti Attar', 'Vetiver Assam', 'Frankincense', 'Ambergris'],
  },
];

async function main() {
  const conn = await mysql.createConnection(process.env.DATABASE_URL);
  
  let stats = { linked: 0, skipped: 0, notFound: [] };
  
  for (const recette of PETRICHOR_RECETTES) {
    // Trouver l'ID de la recette
    const [recetteRows] = await conn.execute(
      'SELECT id FROM recettes WHERE name = ? LIMIT 1',
      [recette.nom]
    );
    
    if (recetteRows.length === 0) {
      console.log('Recette non trouvée : ' + recette.nom);
      continue;
    }
    
    const recetteId = recetteRows[0].id;
    console.log('\n📋 ' + recette.nom + ' (ID: ' + recetteId + ')');
    
    // Collecter les molécules uniques pour cette recette
    const moleculesAdded = new Set();
    
    for (const ingName of recette.ingredients) {
      const molDefs = INGREDIENT_MOLECULES[ingName] || [];
      
      for (const molDef of molDefs) {
        // Trouver la molécule en base
        const [molRows] = await conn.execute(
          'SELECT id, name FROM molecules WHERE name LIKE ? LIMIT 1',
          ['%' + molDef.search + '%']
        );
        
        if (molRows.length === 0) {
          stats.notFound.push(molDef.search);
          console.log('  XX ' + molDef.search + ' -> non trouvé');
          continue;
        }
        
        const mol = molRows[0];
        const key = recetteId + '-' + mol.id;
        
        if (moleculesAdded.has(key)) continue;
        
        // Vérifier si la liaison existe déjà
        const [existing] = await conn.execute(
          'SELECT id FROM recette_molecules WHERE recette_id = ? AND molecule_id = ? LIMIT 1',
          [recetteId, mol.id]
        );
        
        if (existing.length > 0) {
          stats.skipped++;
          moleculesAdded.add(key);
          continue;
        }
        
        await conn.execute(
          'INSERT INTO recette_molecules (recette_id, molecule_id, proportion, role) VALUES (?, ?, ?, ?)',
          [recetteId, mol.id, molDef.proportion, molDef.role]
        );
        
        console.log('  OK ' + ingName + ' -> ' + mol.name + ' (' + molDef.role + ')');
        stats.linked++;
        moleculesAdded.add(key);
      }
    }
  }
  
  await conn.end();
  
  console.log('\n═══════════════════════════════════════════════');
  console.log('RÉSUMÉ LIAISON PETRICHOR <-> MOLÉCULES');
  console.log('═══════════════════════════════════════════════');
  console.log('Liaisons créées  : ' + stats.linked);
  console.log('Déjà existantes  : ' + stats.skipped);
  if (stats.notFound.length > 0) {
    console.log('Non trouvées     : ' + [...new Set(stats.notFound)].join(', '));
  }
  console.log('═══════════════════════════════════════════════');
}

main().catch(e => {
  console.error('Erreur fatale :', e.message);
  process.exit(1);
});
