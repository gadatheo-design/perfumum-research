/**
 * Script pour peupler les liaisons H2/H3 et les traditions olfactives
 * 
 * H2 = Durabilité → Lie les références aux leaf_economies (échantillons botaniques)
 * H3 = Traditions antiques → Lie les références aux traditions olfactives
 */

import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL || 'mysql://root:root@127.0.0.1:4000/perfumum_research';

async function main() {
  const connection = await mysql.createConnection(DATABASE_URL);
  
  console.log('🔗 Peuplement des liaisons H2/H3...\n');
  
  // ============================================================================
  // 1. Récupérer les références H2 et H3
  // ============================================================================
  
  const [h2Refs] = await connection.execute(`
    SELECT id, entry_key, title, notes 
    FROM v3_references 
    WHERE axis_primary_code = 'H2'
  `);
  
  const [h3Refs] = await connection.execute(`
    SELECT id, entry_key, title, notes 
    FROM v3_references 
    WHERE axis_primary_code = 'H3'
  `);
  
  console.log(`📚 Références H2 (Durabilité): ${h2Refs.length}`);
  console.log(`📚 Références H3 (Traditions): ${h3Refs.length}\n`);
  
  // ============================================================================
  // 2. Récupérer les leaf_economies et traditions_olfactives
  // ============================================================================
  
  const [leafEconomies] = await connection.execute(`
    SELECT id, sample_id, species, claimed_variety, category, island, odor_notes 
    FROM leaf_economies
  `);
  
  const [traditions] = await connection.execute(`
    SELECT id, name, region, temporality, symbolicMaterials 
    FROM traditions_olfactives
  `);
  
  console.log(`🌿 Leaf Economies: ${leafEconomies.length}`);
  console.log(`🏛️ Traditions Olfactives: ${traditions.length}\n`);
  
  // ============================================================================
  // 3. Créer les liaisons H2 → leaf_economies
  // ============================================================================
  
  console.log('--- Création des liaisons H2 → Leaf Economies ---\n');
  
  // Mapping thématique H2 → leaf_economies basé sur le contenu
  const h2LinkMappings = [
    // Références sur la durabilité et conservation des plantes aromatiques
    { refKeywords: ['sustainability', 'conservation', 'biodiversity', 'endangered', 'threatened', 'CITES'], 
      entityFilter: (le) => true, // Toutes les leaf_economies sont pertinentes pour la durabilité
      linkType: 'contextualizes',
      relevance: 70 },
    // Références sur les économies locales et pratiques traditionnelles
    { refKeywords: ['local', 'traditional', 'indigenous', 'community', 'economy', 'livelihood'],
      entityFilter: (le) => le.island === 'san_andres' || le.island === 'providencia',
      linkType: 'documents',
      relevance: 80 },
    // Références sur le tabac et cannabis
    { refKeywords: ['tobacco', 'cannabis', 'nicotiana', 'hemp'],
      entityFilter: (le) => le.category === 'tabac' || le.category === 'cannabis',
      linkType: 'analyzes',
      relevance: 85 },
    // Références sur les plantes aromatiques
    { refKeywords: ['aromatic', 'essential oil', 'fragrance', 'perfume', 'scent'],
      entityFilter: (le) => le.category === 'aromatique',
      linkType: 'analyzes',
      relevance: 75 },
  ];
  
  let h2LinksCreated = 0;
  
  for (const ref of h2Refs) {
    const refText = `${ref.title} ${ref.notes || ''}`.toLowerCase();
    
    for (const le of leafEconomies) {
      // Déterminer le type de lien et la pertinence
      let bestLinkType = 'documents';
      let bestRelevance = 50;
      
      for (const mapping of h2LinkMappings) {
        const hasKeyword = mapping.refKeywords.some(kw => refText.includes(kw.toLowerCase()));
        const matchesEntity = mapping.entityFilter(le);
        
        if (hasKeyword && matchesEntity && mapping.relevance > bestRelevance) {
          bestLinkType = mapping.linkType;
          bestRelevance = mapping.relevance;
        }
      }
      
      // Créer la liaison si pertinente (relevance > 50)
      if (bestRelevance > 50) {
        try {
          await connection.execute(`
            INSERT INTO reference_entity_links 
            (reference_id, entity_type, entity_id, link_type, relevance_score, notes, created_at, updated_at)
            VALUES (?, 'leaf_economy', ?, ?, ?, ?, NOW(), NOW())
          `, [ref.id, le.id, bestLinkType, bestRelevance, 
              `Liaison automatique H2 (durabilité) - ${le.species || le.claimed_variety || le.sample_id}`]);
          h2LinksCreated++;
          console.log(`  ✅ H2: "${ref.title.substring(0, 50)}..." → ${le.sample_id} (${bestLinkType}, ${bestRelevance}%)`);
        } catch (err) {
          if (!err.message.includes('Duplicate')) {
            console.error(`  ❌ Erreur: ${err.message}`);
          }
        }
      }
    }
  }
  
  console.log(`\n📊 Liaisons H2 créées: ${h2LinksCreated}\n`);
  
  // ============================================================================
  // 4. Créer les liaisons H3 → traditions_olfactives
  // ============================================================================
  
  console.log('--- Création des liaisons H3 → Traditions Olfactives ---\n');
  
  // Mapping thématique H3 → traditions basé sur les régions et temporalités
  const h3LinkMappings = [
    // Références sur l'Égypte ancienne
    { refKeywords: ['egypt', 'egyptian', 'pharaoh', 'kyphi', 'nile'],
      entityFilter: (t) => t.name?.toLowerCase().includes('égypt') || t.region?.toLowerCase().includes('égypt'),
      linkType: 'documents',
      relevance: 90 },
    // Références sur la Mésopotamie
    { refKeywords: ['mesopotamia', 'babylon', 'assyria', 'sumerian', 'akkadian'],
      entityFilter: (t) => t.name?.toLowerCase().includes('mésopotam') || t.region?.toLowerCase().includes('mésopotam'),
      linkType: 'documents',
      relevance: 90 },
    // Références sur Rome/Grèce antique
    { refKeywords: ['roman', 'rome', 'greek', 'greece', 'hellenistic', 'mediterranean'],
      entityFilter: (t) => t.name?.toLowerCase().includes('rom') || t.name?.toLowerCase().includes('grec') || t.region?.toLowerCase().includes('méditerran'),
      linkType: 'documents',
      relevance: 85 },
    // Références sur l'Inde
    { refKeywords: ['india', 'indian', 'ayurveda', 'vedic', 'sanskrit'],
      entityFilter: (t) => t.name?.toLowerCase().includes('ind') || t.region?.toLowerCase().includes('ind'),
      linkType: 'documents',
      relevance: 85 },
    // Références sur la Chine
    { refKeywords: ['china', 'chinese', 'tang', 'ming', 'incense'],
      entityFilter: (t) => t.name?.toLowerCase().includes('chin') || t.region?.toLowerCase().includes('chin'),
      linkType: 'documents',
      relevance: 85 },
    // Références sur l'Arabie
    { refKeywords: ['arab', 'arabian', 'frankincense', 'myrrh', 'oud', 'middle east'],
      entityFilter: (t) => t.name?.toLowerCase().includes('arab') || t.region?.toLowerCase().includes('arab') || t.region?.toLowerCase().includes('moyen'),
      linkType: 'documents',
      relevance: 85 },
    // Références sur les traditions antiques en général
    { refKeywords: ['ancient', 'antique', 'historical', 'tradition', 'ritual', 'sacred'],
      entityFilter: (t) => t.temporality === 'antique' || t.temporality === 'archaic',
      linkType: 'contextualizes',
      relevance: 70 },
    // Références sur les encens et rituels
    { refKeywords: ['incense', 'ritual', 'ceremony', 'religious', 'sacred', 'temple'],
      entityFilter: (t) => t.symbolicMaterials?.toLowerCase().includes('encens') || t.symbolicMaterials?.toLowerCase().includes('résine'),
      linkType: 'analyzes',
      relevance: 75 },
  ];
  
  let h3LinksCreated = 0;
  
  for (const ref of h3Refs) {
    const refText = `${ref.title} ${ref.notes || ''}`.toLowerCase();
    
    for (const trad of traditions) {
      // Déterminer le type de lien et la pertinence
      let bestLinkType = 'documents';
      let bestRelevance = 50;
      
      for (const mapping of h3LinkMappings) {
        const hasKeyword = mapping.refKeywords.some(kw => refText.includes(kw.toLowerCase()));
        const matchesEntity = mapping.entityFilter(trad);
        
        if (hasKeyword && matchesEntity && mapping.relevance > bestRelevance) {
          bestLinkType = mapping.linkType;
          bestRelevance = mapping.relevance;
        }
      }
      
      // Créer la liaison si pertinente (relevance > 50)
      if (bestRelevance > 50) {
        try {
          await connection.execute(`
            INSERT INTO reference_entity_links 
            (reference_id, entity_type, entity_id, link_type, relevance_score, notes, created_at, updated_at)
            VALUES (?, 'tradition', ?, ?, ?, ?, NOW(), NOW())
          `, [ref.id, trad.id, bestLinkType, bestRelevance, 
              `Liaison automatique H3 (traditions) - ${trad.name}`]);
          h3LinksCreated++;
          console.log(`  ✅ H3: "${ref.title.substring(0, 50)}..." → ${trad.name} (${bestLinkType}, ${bestRelevance}%)`);
        } catch (err) {
          if (!err.message.includes('Duplicate')) {
            console.error(`  ❌ Erreur: ${err.message}`);
          }
        }
      }
    }
  }
  
  console.log(`\n📊 Liaisons H3 créées: ${h3LinksCreated}\n`);
  
  // ============================================================================
  // 5. Résumé
  // ============================================================================
  
  const [totalLinks] = await connection.execute(`SELECT COUNT(*) as count FROM reference_entity_links`);
  
  console.log('='.repeat(60));
  console.log('📊 RÉSUMÉ DU PEUPLEMENT');
  console.log('='.repeat(60));
  console.log(`Liaisons H2 créées: ${h2LinksCreated}`);
  console.log(`Liaisons H3 créées: ${h3LinksCreated}`);
  console.log(`Total liaisons dans la base: ${totalLinks[0].count}`);
  
  await connection.end();
  console.log('\n✅ Peuplement terminé!');
}

main().catch(console.error);
