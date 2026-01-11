/**
 * Script pour créer des liaisons entre les références H3 et les nouvelles traditions olfactives
 */

import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL || 'mysql://root:root@127.0.0.1:4000/perfumum_research';

// Mapping des mots-clés pour les nouvelles traditions
const traditionKeywords = {
  "Perse Sassanide": ["persia", "persian", "iran", "sassanid", "zoroastrian", "rose", "damascus"],
  "Empire Ottoman": ["ottoman", "turkish", "turkey", "istanbul", "hammam", "oud"],
  "Royaume d'Ayutthaya": ["thai", "thailand", "siam", "ayutthaya", "southeast asia"],
  "Empire Majapahit": ["indonesia", "java", "majapahit", "spice", "clove", "nutmeg", "malay"],
  "Empire Songhaï": ["songhai", "mali", "timbuktu", "sahara", "west africa", "trans-saharan"],
  "Empire Aztèque": ["aztec", "mexico", "mesoamerica", "copal", "cacao", "vanilla", "nahuatl"],
  "Empire Inca": ["inca", "peru", "andes", "andean", "coca", "south america"],
  "Polynésie Traditionnelle": ["polynesia", "pacific", "tahiti", "hawaii", "tiare", "sandalwood"],
  "Vikings et Scandinaves": ["viking", "norse", "scandinavia", "nordic", "amber"],
  "Celtes Insulaires": ["celtic", "druid", "ireland", "britain", "oak", "mistletoe"],
  "Royaume de Saba": ["saba", "sheba", "yemen", "frankincense", "incense route", "arabian"],
  "Phénicie": ["phoenicia", "lebanon", "cedar", "tyre", "purple", "mediterranean"],
  "Éthiopie Axoumite": ["ethiopia", "axum", "aksum", "coffee", "horn of africa"],
  "Japon Heian": ["heian", "japan", "kodo", "incense ceremony", "agarwood", "jinko"],
  "Inde Moghole": ["mughal", "moghul", "india", "attar", "kannauj", "vetiver"]
};

async function main() {
  const connection = await mysql.createConnection(DATABASE_URL);
  
  console.log('🔗 Création des liaisons H3 → Nouvelles traditions...\n');
  
  // Récupérer les références H3
  const [h3Refs] = await connection.execute(`
    SELECT id, entry_key, title, notes 
    FROM v3_references 
    WHERE axis_primary_code = 'H3'
  `);
  
  // Récupérer les nouvelles traditions
  const [traditions] = await connection.execute(`
    SELECT id, name 
    FROM traditions_olfactives 
    WHERE name IN (${Object.keys(traditionKeywords).map(() => '?').join(',')})
  `, Object.keys(traditionKeywords));
  
  console.log(`📚 Références H3: ${h3Refs.length}`);
  console.log(`🏛️ Nouvelles traditions: ${traditions.length}\n`);
  
  let linksCreated = 0;
  
  for (const ref of h3Refs) {
    const refText = `${ref.title} ${ref.notes || ''}`.toLowerCase();
    
    for (const trad of traditions) {
      const keywords = traditionKeywords[trad.name] || [];
      const hasMatch = keywords.some(kw => refText.includes(kw.toLowerCase()));
      
      if (hasMatch) {
        // Vérifier si la liaison existe déjà
        const [existing] = await connection.execute(`
          SELECT id FROM reference_entity_links 
          WHERE reference_id = ? AND entity_type = 'tradition' AND entity_id = ?
        `, [ref.id, trad.id]);
        
        if (existing.length > 0) {
          continue;
        }
        
        try {
          await connection.execute(`
            INSERT INTO reference_entity_links 
            (reference_id, entity_type, entity_id, link_type, relevance_score, notes, created_at, updated_at)
            VALUES (?, 'tradition', ?, 'documents', 75, ?, NOW(), NOW())
          `, [ref.id, trad.id, `Liaison automatique H3 - ${trad.name}`]);
          
          console.log(`  ✅ "${ref.title.substring(0, 50)}..." → ${trad.name}`);
          linksCreated++;
        } catch (err) {
          if (!err.message.includes('Duplicate')) {
            console.error(`  ❌ Erreur: ${err.message}`);
          }
        }
      }
    }
  }
  
  // Statistiques finales
  const [totalLinks] = await connection.execute(`
    SELECT COUNT(*) as count FROM reference_entity_links WHERE entity_type = 'tradition'
  `);
  
  console.log('\n' + '='.repeat(60));
  console.log('📊 RÉSUMÉ');
  console.log('='.repeat(60));
  console.log(`Nouvelles liaisons H3 créées: ${linksCreated}`);
  console.log(`Total liaisons traditions: ${totalLinks[0].count}`);
  
  await connection.end();
  console.log('\n✅ Liaisons terminées!');
}

main().catch(console.error);
