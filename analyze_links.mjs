import Database from 'better-sqlite3';

const db = new Database('./drizzle/sqlite.db', { readonly: true });

// Statistiques globales
const totalRecettes = db.prepare('SELECT COUNT(*) as count FROM recettes').get().count;
const totalMolecules = db.prepare('SELECT COUNT(*) as count FROM molecules').get().count;
const totalLiaisons = db.prepare('SELECT COUNT(*) as count FROM molecules_recettes').get().count;

// Recettes avec molécules
const recettesAvecMolecules = db.prepare(`
  SELECT COUNT(DISTINCT recette_id) as count 
  FROM molecules_recettes
`).get().count;

// Recettes sans molécules (orphelines)
const recettesOrphelines = totalRecettes - recettesAvecMolecules;

// Distribution par gamme
const distributionGamme = db.prepare(`
  SELECT 
    r.gamme,
    COUNT(DISTINCT r.id) as total_recettes,
    COUNT(DISTINCT mr.recette_id) as recettes_avec_molecules,
    COUNT(DISTINCT r.id) - COUNT(DISTINCT mr.recette_id) as recettes_orphelines
  FROM recettes r
  LEFT JOIN molecules_recettes mr ON r.id = mr.recette_id
  GROUP BY r.gamme
  ORDER BY r.gamme
`).all();

// Statistiques détaillées par recette
const statsParRecette = db.prepare(`
  SELECT 
    r.id,
    r.nom,
    r.gamme,
    COUNT(mr.molecule_id) as nb_molecules,
    COALESCE(SUM(mr.proportion), 0) as total_proportion
  FROM recettes r
  LEFT JOIN molecules_recettes mr ON r.id = mr.recette_id
  GROUP BY r.id
  ORDER BY nb_molecules DESC, r.nom
`).all();

console.log('=== ANALYSE DES LIAISONS MOLÉCULES-RECETTES ===\n');
console.log(`📊 Statistiques globales:`);
console.log(`   - Total recettes: ${totalRecettes}`);
console.log(`   - Total molécules: ${totalMolecules}`);
console.log(`   - Total liaisons: ${totalLiaisons}`);
console.log(`   - Recettes avec molécules: ${recettesAvecMolecules} (${Math.round(recettesAvecMolecules/totalRecettes*100)}%)`);
console.log(`   - Recettes orphelines: ${recettesOrphelines} (${Math.round(recettesOrphelines/totalRecettes*100)}%)\n`);

console.log(`📈 Distribution par gamme:`);
distributionGamme.forEach(g => {
  console.log(`   ${g.gamme || 'Sans gamme'}:`);
  console.log(`      - Total: ${g.total_recettes}`);
  console.log(`      - Avec molécules: ${g.recettes_avec_molecules}`);
  console.log(`      - Orphelines: ${g.recettes_orphelines}`);
});

console.log(`\n🔍 Top 10 recettes avec le plus de molécules:`);
statsParRecette.slice(0, 10).forEach((r, i) => {
  console.log(`   ${i+1}. ${r.nom} (${r.gamme || 'N/A'}) - ${r.nb_molecules} molécules (${r.total_proportion}%)`);
});

console.log(`\n⚠️  Recettes orphelines (sans molécules): ${recettesOrphelines}`);
const orphelins = statsParRecette.filter(r => r.nb_molecules === 0);
if (orphelins.length > 0 && orphelins.length <= 20) {
  orphelins.forEach((r, i) => {
    console.log(`   ${i+1}. ${r.nom} (${r.gamme || 'N/A'})`);
  });
} else if (orphelins.length > 20) {
  console.log(`   (Trop nombreux pour afficher, ${orphelins.length} au total)`);
}

db.close();
