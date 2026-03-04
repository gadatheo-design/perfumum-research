/**
 * Import des références bibliographiques et nettoyage des doublons de molécules
 */
import mysql from 'mysql2/promise';
import fs from 'fs';
import { parse as csvParse } from 'csv-parse/sync';

const url = process.env.DATABASE_URL;
const conn = await mysql.createConnection(url);

console.log('=== IMPORT BIBLIOGRAPHIE ET NETTOYAGE ===\n');

// 1. Importer les références bibliographiques
console.log('📚 Importation des références bibliographiques...\n');

const bibContent = fs.readFileSync('/home/ubuntu/perfumum-research/data-import/Bibliographie2a4dbb3d5e6c809fbf76f9101842e4c7.csv', 'utf-8');
const records = csvParse(bibContent, {
  columns: ['author', 'title', 'type', 'description', 'chapter', 'status'],
  skip_empty_lines: true,
  from_line: 2,
});

let bibCreated = 0;
for (const record of records) {
  try {
    await conn.execute(
      `INSERT INTO bibliography_entries (author, title, type, description, chapter, status, createdAt)
       VALUES (?, ?, ?, ?, ?, ?, NOW())`,
      [
        record.author || null,
        record.title || null,
        record.type || 'other',
        record.description || null,
        record.chapter || null,
        record.status || '📘',
      ]
    );
    console.log(`✅ ${record.author} - ${record.title}`);
    bibCreated++;
  } catch (err) {
    console.log(`⏭️  ${record.author} - ${record.title} (déjà existant ou erreur)`);
  }
}

console.log(`\n📊 Références importées : ${bibCreated}\n`);

// 2. Identifier les doublons de molécules
console.log('🧪 Identification des doublons de molécules...\n');

const [duplicates] = await conn.execute(`
  SELECT 
    LOWER(TRIM(name)) as normalized_name,
    COUNT(*) as count,
    GROUP_CONCAT(id ORDER BY id) as ids,
    GROUP_CONCAT(DISTINCT name) as names
  FROM molecules
  GROUP BY normalized_name
  HAVING count > 1
  ORDER BY count DESC
`);

console.log(`Doublons trouvés : ${duplicates.length}\n`);

let merged = 0;
for (const dup of duplicates) {
  const ids = dup.ids.split(',').map(Number);
  const mainId = ids[0];
  const otherIds = ids.slice(1);
  
  console.log(`\n🔀 Fusion : ${dup.names}`);
  console.log(`   IDs : ${dup.ids}`);
  
  // Transférer toutes les liaisons vers la molécule principale
  for (const otherId of otherIds) {
    try {
      // Transférer les liaisons plante-molécule
      await conn.execute(
        `UPDATE plant_molecules SET molecule_id = ? WHERE molecule_id = ?`,
        [mainId, otherId]
      );
      
      // Transférer les liaisons recette-molécule
      await conn.execute(
        `UPDATE molecules_recettes SET molecule_id = ? WHERE molecule_id = ?`,
        [mainId, otherId]
      );
      
      // Supprimer la molécule dupliquée
      await conn.execute(
        `DELETE FROM molecules WHERE id = ?`,
        [otherId]
      );
      
      console.log(`   ✅ ID ${otherId} fusionné vers ${mainId}`);
      merged++;
    } catch (err) {
      console.log(`   ⚠️  Erreur lors de la fusion de ${otherId} : ${err.message}`);
    }
  }
}

console.log(`\n📊 Molécules fusionnées : ${merged}\n`);

// 3. Statistiques finales
console.log('📊 STATISTIQUES FINALES\n');

const [stats] = await conn.execute(`
  SELECT 
    (SELECT COUNT(*) FROM molecules) as total_molecules,
    (SELECT COUNT(*) FROM plants) as total_plants,
    (SELECT COUNT(*) FROM plant_molecules) as total_links,
    (SELECT COUNT(DISTINCT plant_id) FROM plant_molecules) as plants_with_links,
    (SELECT COUNT(DISTINCT molecule_id) FROM plant_molecules) as molecules_with_links,
    (SELECT COUNT(*) FROM bibliography_entries) as total_bibliography
  FROM DUAL
`);

const s = stats[0];
console.log(`  Molécules : ${s.total_molecules}`);
console.log(`  Plantes : ${s.total_plants}`);
console.log(`  Liaisons plante-molécule : ${s.total_links}`);
console.log(`  Plantes avec liaisons : ${s.plants_with_links} (${Math.round(s.plants_with_links/s.total_plants*100)}%)`);
console.log(`  Molécules avec liaisons : ${s.molecules_with_links}`);
console.log(`  Références bibliographiques : ${s.total_bibliography}`);

await conn.end();
console.log('\n✅ Import et nettoyage terminés');
