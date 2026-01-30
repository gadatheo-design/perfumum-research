import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL || 'mysql://root:root@127.0.0.1:4000/perfumum_research';

async function main() {
  const connection = await mysql.createConnection(DATABASE_URL);
  
  console.log('=== AXES THÉMATIQUES (v3 References) ===\n');
  const [thematicAxes] = await connection.execute(`
    SELECT id, axis_code, name, meta_axis, description 
    FROM thematic_axes 
    ORDER BY meta_axis, axis_code
  `);
  
  // Grouper par meta_axis
  const byMetaAxis = {};
  for (const ax of thematicAxes) {
    if (!byMetaAxis[ax.meta_axis]) byMetaAxis[ax.meta_axis] = [];
    byMetaAxis[ax.meta_axis].push(ax);
  }
  
  for (const [meta, axes] of Object.entries(byMetaAxis)) {
    console.log(`\n--- ${meta.toUpperCase()} ---`);
    for (const ax of axes) {
      console.log(`  ${ax.axis_code}: ${ax.name}`);
      if (ax.description) console.log(`     → ${ax.description.substring(0, 100)}...`);
    }
  }
  
  console.log('\n\n=== AXES DE RECHERCHE PERSONNALISÉS ===\n');
  const [researchAxes] = await connection.execute(`
    SELECT id, axis_code, name, category, status, priority, progress_percent, description
    FROM research_axes 
    ORDER BY priority DESC, axis_code
  `);
  
  for (const ax of researchAxes) {
    console.log(`${ax.axis_code}: ${ax.name}`);
    console.log(`   Catégorie: ${ax.category} | Statut: ${ax.status} | Priorité: ${ax.priority} | Progression: ${ax.progress_percent}%`);
    if (ax.description) console.log(`   → ${ax.description.substring(0, 100)}...`);
    console.log('');
  }
  
  console.log('\n=== RÉFÉRENCES PAR AXE ===\n');
  const [refsByAxis] = await connection.execute(`
    SELECT axis_primary_code, COUNT(*) as count 
    FROM v3_references 
    WHERE axis_primary_code IS NOT NULL
    GROUP BY axis_primary_code 
    ORDER BY axis_primary_code
  `);
  
  for (const r of refsByAxis) {
    console.log(`  ${r.axis_primary_code}: ${r.count} références`);
  }
  
  console.log('\n=== LIAISONS PAR TYPE D\'ENTITÉ ===\n');
  const [linksByType] = await connection.execute(`
    SELECT entity_type, COUNT(*) as count 
    FROM reference_entity_links 
    GROUP BY entity_type 
    ORDER BY count DESC
  `);
  
  for (const l of linksByType) {
    console.log(`  ${l.entity_type}: ${l.count} liaisons`);
  }
  
  await connection.end();
}

main().catch(console.error);
