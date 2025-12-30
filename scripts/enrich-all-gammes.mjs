// Script pour enrichir les associations molécules-recettes pour toutes les gammes
import { createClient } from '@libsql/client';

const client = createClient({
  url: 'file:.data/local.db',
});

// Molécules par profil olfactif (ID dans la base)
const MOLECULES_BY_PROFILE = {
  // Volcanique / Fumé / Pyrolyse
  volcanique: [
    { name: 'Guaiacol', keywords: ['fumé', 'boisé', 'phénolique'] },
    { name: 'Pyrazine', keywords: ['torréfié', 'grillé', 'noisette'] },
    { name: 'Furfural', keywords: ['caramel', 'brûlé', 'pain grillé'] },
    { name: 'Cresol', keywords: ['fumé', 'goudron', 'cuir'] },
    { name: 'Skatole', keywords: ['animal', 'fécal', 'indolique'] },
  ],
  // Glaciaire / Frais / Ozone
  glaciaire: [
    { name: 'Calone', keywords: ['marin', 'ozone', 'melon'] },
    { name: 'Linalool', keywords: ['floral', 'frais', 'lavande'] },
    { name: 'Limonene', keywords: ['agrume', 'citron', 'frais'] },
    { name: 'α-Pinene', keywords: ['pin', 'conifère', 'frais'] },
    { name: 'Menthol', keywords: ['menthe', 'frais', 'glacé'] },
  ],
  // Bio-Lab / CBD / Résine
  biolab: [
    { name: 'Myrcene', keywords: ['herbacé', 'terreux', 'houblon'] },
    { name: 'β-Caryophyllene', keywords: ['épicé', 'boisé', 'poivre'] },
    { name: 'Humulene', keywords: ['houblon', 'boisé', 'terreux'] },
    { name: 'Linalool', keywords: ['floral', 'lavande', 'relaxant'] },
    { name: 'Limonene', keywords: ['agrume', 'énergisant', 'citron'] },
  ],
  // Pétrichor / Terre / Minéral
  petrichor: [
    { name: 'Geosmin', keywords: ['terre', 'pluie', 'betterave'] },
    { name: 'Vetiver', keywords: ['terreux', 'boisé', 'racine'] },
    { name: 'Ambrox', keywords: ['ambre', 'minéral', 'boisé'] },
    { name: 'Iso E Super', keywords: ['boisé', 'cèdre', 'velouté'] },
  ],
};

async function getMoleculeIdByName(name) {
  const result = await client.execute({
    sql: `SELECT id FROM molecules WHERE name LIKE ? OR name LIKE ? LIMIT 1`,
    args: [`%${name}%`, `${name}%`],
  });
  return result.rows.length > 0 ? result.rows[0].id : null;
}

async function getRecettesWithoutMolecules(gammeCondition) {
  const result = await client.execute({
    sql: `
      SELECT r.id, r.name, r.category
      FROM recettes r
      LEFT JOIN molecules_recettes mr ON r.id = mr.recette_id
      WHERE ${gammeCondition}
      GROUP BY r.id
      HAVING COUNT(mr.molecule_id) = 0
    `,
    args: [],
  });
  return result.rows;
}

async function insertAssociation(recetteId, moleculeId, proportion) {
  try {
    await client.execute({
      sql: `INSERT OR IGNORE INTO molecules_recettes (recette_id, molecule_id, proportion, notes) VALUES (?, ?, ?, ?)`,
      args: [recetteId, moleculeId, proportion, 'Auto-généré'],
    });
    return true;
  } catch (e) {
    console.error(`Erreur insertion ${recetteId}-${moleculeId}:`, e.message);
    return false;
  }
}

async function enrichGamme(gamme, condition, molecules) {
  console.log(`\n=== Enrichissement gamme ${gamme} ===`);
  
  // Récupérer les IDs des molécules
  const moleculeIds = [];
  for (const mol of molecules) {
    const id = await getMoleculeIdByName(mol.name);
    if (id) {
      moleculeIds.push({ id, name: mol.name });
      console.log(`  ✓ Molécule trouvée: ${mol.name} (ID: ${id})`);
    } else {
      console.log(`  ✗ Molécule non trouvée: ${mol.name}`);
    }
  }
  
  if (moleculeIds.length === 0) {
    console.log(`  Aucune molécule trouvée pour ${gamme}`);
    return 0;
  }
  
  // Récupérer les recettes sans associations
  const recettes = await getRecettesWithoutMolecules(condition);
  console.log(`  ${recettes.length} recettes sans associations`);
  
  let count = 0;
  for (const recette of recettes) {
    // Associer 3-5 molécules par recette avec des proportions variées
    const numMolecules = Math.min(moleculeIds.length, 3 + Math.floor(Math.random() * 3));
    const shuffled = [...moleculeIds].sort(() => Math.random() - 0.5);
    
    for (let i = 0; i < numMolecules; i++) {
      const mol = shuffled[i];
      const proportion = 15 + Math.floor(Math.random() * 30); // 15-45%
      const success = await insertAssociation(recette.id, mol.id, proportion);
      if (success) count++;
    }
  }
  
  console.log(`  ${count} associations créées pour ${gamme}`);
  return count;
}

async function main() {
  console.log('=== ENRICHISSEMENT DES ASSOCIATIONS MOLÉCULES-RECETTES ===\n');
  
  let totalAssociations = 0;
  
  // Volcanique
  totalAssociations += await enrichGamme(
    'Volcanique',
    `(r.name LIKE '%Volcanique%' OR r.name LIKE '%Fumé%' OR r.name LIKE '%Pyrolyse%' OR r.category = 'tabac')`,
    MOLECULES_BY_PROFILE.volcanique
  );
  
  // Glaciaire
  totalAssociations += await enrichGamme(
    'Glaciaire',
    `(r.name LIKE '%Glaciaire%' OR r.name LIKE '%Frais%' OR r.name LIKE '%Ozone%' OR r.name LIKE '%Menthe%')`,
    MOLECULES_BY_PROFILE.glaciaire
  );
  
  // Bio-Lab
  totalAssociations += await enrichGamme(
    'Bio-Lab',
    `(r.name LIKE '%Bio%' OR r.name LIKE '%CBD%' OR r.name LIKE '%Résine%' OR r.category = 'resine_cbd')`,
    MOLECULES_BY_PROFILE.biolab
  );
  
  console.log(`\n=== TOTAL: ${totalAssociations} associations créées ===`);
}

main().catch(console.error);
