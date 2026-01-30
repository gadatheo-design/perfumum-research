import Database from 'better-sqlite3';

const db = new Database('./drizzle/sqlite.db');

// Récupérer toutes les recettes orphelines
const orphanRecipes = db.prepare(`
  SELECT 
    r.id,
    r.name,
    r.gamme,
    r.category,
    r.description,
    r.ingredients,
    r.notes_tete,
    r.notes_coeur,
    r.notes_fond,
    r.texture,
    r.intensity
  FROM recettes r
  LEFT JOIN molecules_recettes mr ON r.id = mr.recette_id
  WHERE mr.recette_id IS NULL
  ORDER BY r.gamme, r.name
`).all();

// Récupérer toutes les molécules
const allMolecules = db.prepare(`
  SELECT 
    id,
    name,
    family,
    olfactiveProfile,
    volatility,
    intensity,
    radar_freshness,
    radar_warmth,
    radar_sweetness,
    radar_spiciness,
    radar_earthiness
  FROM molecules
  ORDER BY family, name
`).all();

console.log(`\n🔍 Trouvé ${orphanRecipes.length} recettes orphelines`);
console.log(`📦 ${allMolecules.length} molécules disponibles\n`);

// Fonction pour calculer un score de pertinence molécule-recette
function calculateRelevanceScore(molecule, recipe) {
  let score = 0;
  
  // Correspondance par gamme
  const gammeKeywords = {
    'Pétrichor': ['terre', 'pluie', 'humide', 'minéral', 'géosmine', 'mousse'],
    'Volcanique': ['fumée', 'soufre', 'cendre', 'pierre', 'minéral', 'chaud'],
    'Glaciaire': ['froid', 'menthe', 'eucalyptus', 'pin', 'frais', 'cristal'],
    'Colombie': ['café', 'cacao', 'tabac', 'terre', 'bois', 'épice'],
    'Civilisations': ['encens', 'résine', 'myrrhe', 'oliban', 'bois', 'sacré'],
    'Mossi': ['karité', 'beurre', 'doux', 'crémeux', 'lactone']
  };
  
  const recipeGamme = recipe.gamme || '';
  const keywords = gammeKeywords[recipeGamme] || [];
  const molProfile = (molecule.olfactiveProfile || '').toLowerCase();
  const molName = (molecule.name || '').toLowerCase();
  
  keywords.forEach(kw => {
    if (molProfile.includes(kw) || molName.includes(kw)) {
      score += 15;
    }
  });
  
  // Correspondance par catégorie
  if (recipe.category === 'tabac' && (molName.includes('tabac') || molProfile.includes('tabac'))) {
    score += 20;
  }
  if (recipe.category === 'resine' && (molProfile.includes('résine') || molProfile.includes('bois'))) {
    score += 15;
  }
  if (recipe.category === 'encens' && (molProfile.includes('encens') || molProfile.includes('sacré'))) {
    score += 15;
  }
  
  // Correspondance par texture
  if (recipe.texture && molProfile.includes(recipe.texture.toLowerCase())) {
    score += 10;
  }
  
  // Correspondance par notes (tête/cœur/fond)
  const allNotes = [recipe.notes_tete, recipe.notes_coeur, recipe.notes_fond].join(' ').toLowerCase();
  if (allNotes) {
    const noteWords = allNotes.split(/\s+/);
    noteWords.forEach(word => {
      if (word.length > 3 && (molProfile.includes(word) || molName.includes(word))) {
        score += 5;
      }
    });
  }
  
  // Bonus pour molécules communes
  const commonMolecules = ['linalol', 'géraniol', 'limonène', 'pinène', 'caryophyllène'];
  if (commonMolecules.some(cm => molName.includes(cm))) {
    score += 5;
  }
  
  return score;
}

// Fonction pour déterminer le rôle olfactif basé sur la volatilité
function determineRole(molecule) {
  const vol = molecule.volatility || 50;
  if (vol >= 70) return 'tête';
  if (vol >= 40) return 'cœur';
  return 'fond';
}

// Préparer l'insertion
const insertStmt = db.prepare(`
  INSERT INTO molecules_recettes (molecule_id, recette_id, proportion, role, notes)
  VALUES (?, ?, ?, ?, ?)
`);

let totalInserted = 0;
const insertMany = db.transaction((recipe, selectedMolecules) => {
  selectedMolecules.forEach(({ molecule, proportion, role }) => {
    try {
      insertStmt.run(
        molecule.id,
        recipe.id,
        proportion,
        role,
        `Auto-généré basé sur profil olfactif`
      );
      totalInserted++;
    } catch (err) {
      // Ignorer les doublons
    }
  });
});

// Enrichir chaque recette
orphanRecipes.forEach((recipe, idx) => {
  console.log(`[${idx + 1}/${orphanRecipes.length}] Enrichissement: ${recipe.name} (${recipe.gamme || 'N/A'})`);
  
  // Calculer les scores pour toutes les molécules
  const scoredMolecules = allMolecules.map(mol => ({
    molecule: mol,
    score: calculateRelevanceScore(mol, recipe)
  }));
  
  // Trier par score décroissant
  scoredMolecules.sort((a, b) => b.score - a.score);
  
  // Sélectionner les 6-8 meilleures molécules
  const numMolecules = 6 + Math.floor(Math.random() * 3); // 6-8 molécules
  const topMolecules = scoredMolecules.slice(0, numMolecules);
  
  // Répartir les proportions de façon réaliste
  // Notes de tête: 15-30%, Cœur: 30-50%, Fond: 20-40%
  const roles = topMolecules.map(tm => determineRole(tm.molecule));
  const teteCount = roles.filter(r => r === 'tête').length || 1;
  const coeurCount = roles.filter(r => r === 'cœur').length || 1;
  const fondCount = roles.filter(r => r === 'fond').length || 1;
  
  const teteTotal = 20 + Math.floor(Math.random() * 15); // 20-35%
  const coeurTotal = 35 + Math.floor(Math.random() * 15); // 35-50%
  const fondTotal = 100 - teteTotal - coeurTotal; // Reste
  
  const selectedMolecules = topMolecules.map((tm, i) => {
    const role = roles[i];
    let proportion;
    
    if (role === 'tête') {
      proportion = Math.round(teteTotal / teteCount);
    } else if (role === 'cœur') {
      proportion = Math.round(coeurTotal / coeurCount);
    } else {
      proportion = Math.round(fondTotal / fondCount);
    }
    
    return {
      molecule: tm.molecule,
      proportion: Math.max(5, Math.min(40, proportion)), // Entre 5% et 40%
      role
    };
  });
  
  // Normaliser pour que la somme = 100%
  const totalProp = selectedMolecules.reduce((sum, sm) => sum + sm.proportion, 0);
  if (totalProp !== 100) {
    const factor = 100 / totalProp;
    selectedMolecules.forEach(sm => {
      sm.proportion = Math.round(sm.proportion * factor);
    });
    
    // Ajuster le dernier pour atteindre exactement 100%
    const newTotal = selectedMolecules.reduce((sum, sm) => sum + sm.proportion, 0);
    selectedMolecules[selectedMolecules.length - 1].proportion += (100 - newTotal);
  }
  
  console.log(`   → ${selectedMolecules.length} molécules sélectionnées:`);
  selectedMolecules.forEach(sm => {
    console.log(`      • ${sm.molecule.name} (${sm.proportion}%, ${sm.role})`);
  });
  
  // Insérer dans la base de données
  insertMany(recipe, selectedMolecules);
  console.log(`   ✅ Liaisons créées\n`);
});

db.close();

console.log(`\n✨ Enrichissement terminé !`);
console.log(`📊 ${totalInserted} liaisons créées pour ${orphanRecipes.length} recettes`);
console.log(`📈 Moyenne: ${Math.round(totalInserted / orphanRecipes.length)} molécules par recette\n`);
