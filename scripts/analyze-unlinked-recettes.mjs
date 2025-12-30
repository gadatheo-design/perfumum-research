import mysql from 'mysql2/promise';

const connection = await mysql.createConnection(process.env.DATABASE_URL);

try {
  console.log('=== ANALYSE DES 46 RECETTES NON LIÉES ===\n');
  
  // Récupérer toutes les recettes non liées
  const [unlinkedRecettes] = await connection.execute(`
    SELECT r.id, r.name, r.category, r.gamme
    FROM recettes r
    LEFT JOIN recettes_formules_reference rfr ON r.id = rfr.recette_id
    WHERE rfr.recette_id IS NULL
    ORDER BY r.id
  `);
  
  console.log(`Total recettes non liées : ${unlinkedRecettes.length}\n`);
  
  // Analyser chaque recette
  const analysis = {
    noMolecules: [],
    fewMolecules: [],
    atypical: []
  };
  
  for (const recette of unlinkedRecettes) {
    // Compter les molécules
    const [moleculeCount] = await connection.execute(`
      SELECT COUNT(*) as count
      FROM molecules_recettes
      WHERE recette_id = ?
    `, [recette.id]);
    
    const count = moleculeCount[0].count;
    
    if (count === 0) {
      analysis.noMolecules.push({
        id: recette.id,
        name: recette.name,
        category: recette.category,
        gamme: recette.gamme
      });
    } else if (count < 3) {
      analysis.fewMolecules.push({
        id: recette.id,
        name: recette.name,
        category: recette.category,
        gamme: recette.gamme,
        moleculeCount: count
      });
    } else {
      // Récupérer les molécules pour analyse
      const [molecules] = await connection.execute(`
        SELECT m.name, m.family, mr.proportion
        FROM molecules_recettes mr
        JOIN molecules m ON mr.molecule_id = m.id
        WHERE mr.recette_id = ?
        ORDER BY mr.proportion DESC
      `, [recette.id]);
      
      analysis.atypical.push({
        id: recette.id,
        name: recette.name,
        category: recette.category,
        gamme: recette.gamme,
        moleculeCount: count,
        topMolecules: molecules.slice(0, 5).map(m => ({
          name: m.name,
          family: m.family,
          proportion: m.proportion
        }))
      });
    }
  }
  
  // Afficher les résultats
  console.log('📊 RÉPARTITION PAR CATÉGORIE :\n');
  console.log(`1. Sans molécules : ${analysis.noMolecules.length} recettes`);
  console.log(`2. Moins de 3 molécules : ${analysis.fewMolecules.length} recettes`);
  console.log(`3. Profils atypiques (≥3 molécules) : ${analysis.atypical.length} recettes\n`);
  
  // Détails sans molécules
  if (analysis.noMolecules.length > 0) {
    console.log('🔴 RECETTES SANS MOLÉCULES (à enrichir en priorité) :\n');
    analysis.noMolecules.forEach((r, i) => {
      console.log(`  ${i+1}. [ID ${r.id}] ${r.name}`);
      console.log(`     Catégorie: ${r.category || 'N/A'} | Gamme: ${r.gamme || 'N/A'}\n`);
    });
  }
  
  // Détails moins de 3 molécules
  if (analysis.fewMolecules.length > 0) {
    console.log('🟡 RECETTES AVEC MOINS DE 3 MOLÉCULES :\n');
    analysis.fewMolecules.forEach((r, i) => {
      console.log(`  ${i+1}. [ID ${r.id}] ${r.name}`);
      console.log(`     Molécules: ${r.moleculeCount} | Catégorie: ${r.category || 'N/A'}\n`);
    });
  }
  
  // Détails profils atypiques
  if (analysis.atypical.length > 0) {
    console.log('🟢 PROFILS ATYPIQUES (≥3 molécules, pas de match) :\n');
    analysis.atypical.forEach((r, i) => {
      console.log(`  ${i+1}. [ID ${r.id}] ${r.name}`);
      console.log(`     Molécules: ${r.moleculeCount} | Gamme: ${r.gamme || 'N/A'}`);
      console.log(`     Top molécules:`);
      r.topMolecules.forEach(m => {
        console.log(`       - ${m.name} (${m.family || 'N/A'}): ${m.proportion}%`);
      });
      console.log('');
    });
  }
  
  // Sauvegarder l'analyse en JSON
  const fs = await import('fs/promises');
  await fs.writeFile(
    '/home/ubuntu/perfumum-research/data/unlinked-recettes-analysis.json',
    JSON.stringify(analysis, null, 2)
  );
  
  console.log('\n✅ Analyse sauvegardée dans data/unlinked-recettes-analysis.json');
  
} finally {
  await connection.end();
}
