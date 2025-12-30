import mysql from 'mysql2/promise';

const connection = await mysql.createConnection(process.env.DATABASE_URL);

try {
  // Stats globales
  const [totalRecettes] = await connection.execute('SELECT COUNT(*) as total FROM recettes');
  const [totalMolecules] = await connection.execute('SELECT COUNT(*) as total FROM molecules');
  const [totalLiaisons] = await connection.execute('SELECT COUNT(*) as total FROM recettes_formules_reference');
  
  // Top 5 formules
  const [topFormules] = await connection.execute(`
    SELECT formule_reference_name, formule_reference_family, COUNT(*) as count
    FROM recettes_formules_reference
    GROUP BY formule_reference_name, formule_reference_family
    ORDER BY count DESC
    LIMIT 5
  `);
  
  // Distribution des scores
  const [scoreDistribution] = await connection.execute(`
    SELECT 
      CASE 
        WHEN similarity_score >= 50 THEN '50-100%'
        WHEN similarity_score >= 35 THEN '35-50%'
        WHEN similarity_score >= 25 THEN '25-35%'
        ELSE '15-25%'
      END as score_range,
      COUNT(*) as count
    FROM recettes_formules_reference
    GROUP BY score_range
    ORDER BY MIN(similarity_score) DESC
  `);
  
  console.log('=== STATISTIQUES FINALES ===\n');
  console.log(`📊 Recettes totales: ${totalRecettes[0].total}`);
  console.log(`🧪 Molécules totales: ${totalMolecules[0].total}`);
  console.log(`🔗 Liaisons recettes-formules: ${totalLiaisons[0].total}`);
  console.log(`📈 Taux de couverture: ${((totalLiaisons[0].total / totalRecettes[0].total) * 100).toFixed(1)}%\n`);
  
  console.log('Top 5 formules de référence:');
  topFormules.forEach((f, i) => {
    console.log(`  ${i+1}. ${f.formule_reference_name} (${f.formule_reference_family}): ${f.count} recettes`);
  });
  
  console.log('\nDistribution des scores de similarité:');
  scoreDistribution.forEach(s => {
    console.log(`  ${s.score_range}: ${s.count} recettes`);
  });
  
} finally {
  await connection.end();
}
