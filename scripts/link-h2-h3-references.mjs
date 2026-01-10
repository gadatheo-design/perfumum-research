import mysql from 'mysql2/promise';

async function linkH2H3References() {
  const conn = await mysql.createConnection(process.env.DATABASE_URL);
  
  console.log("=== Liaison des references H2 (Durabilite) aux plantes ===");
  
  // 1. Identifier les références liées à la durabilité/conservation
  const [durabiliteRefs] = await conn.execute(`
    SELECT id, title, keywords, research_domain
    FROM bibliography_entries 
    WHERE title LIKE '%sustain%' 
       OR title LIKE '%conserv%' 
       OR title LIKE '%biodiv%' 
       OR title LIKE '%endanger%'
       OR title LIKE '%extinct%'
       OR title LIKE '%threaten%'
       OR keywords LIKE '%sustain%'
       OR keywords LIKE '%conserv%'
       OR keywords LIKE '%biodiv%'
  `);
  
  console.log("References durabilite trouvees: " + durabiliteRefs.length);
  
  // 2. Lier ces références à l'axe H2 si pas déjà fait
  let h2LinksCreated = 0;
  for (const ref of durabiliteRefs) {
    try {
      // Vérifier si le lien existe déjà
      const [existing] = await conn.execute(
        "SELECT id FROM bibliography_axis_links WHERE bibliography_id = ? AND axis_id = 30002",
        [ref.id]
      );
      
      if (existing.length === 0) {
        await conn.execute(
          "INSERT INTO bibliography_axis_links (bibliography_id, axis_id, relevance) VALUES (?, 30002, 'primaire')",
          [ref.id]
        );
        h2LinksCreated++;
        console.log("  + Lie a H2: " + (ref.title || "").substring(0, 50));
      }
    } catch (err) {
      // Ignorer les erreurs de duplication
    }
  }
  
  console.log("\\nLiaisons H2 creees: " + h2LinksCreated);
  
  // 3. Identifier les références liées aux traditions antiques
  console.log("\\n=== Liaison des references H3 (Traditions antiques) ===");
  
  const [traditionsRefs] = await conn.execute(`
    SELECT id, title, keywords, research_domain
    FROM bibliography_entries 
    WHERE title LIKE '%ancient%' 
       OR title LIKE '%antique%'
       OR title LIKE '%historical%'
       OR title LIKE '%tradition%'
       OR title LIKE '%ritual%'
       OR title LIKE '%ethnobotany%'
       OR title LIKE '%indigenous%'
       OR title LIKE '%reconstruct%'
       OR keywords LIKE '%ancient%'
       OR keywords LIKE '%tradition%'
       OR keywords LIKE '%ritual%'
  `);
  
  console.log("References traditions trouvees: " + traditionsRefs.length);
  
  // 4. Lier ces références à l'axe H3
  let h3LinksCreated = 0;
  for (const ref of traditionsRefs) {
    try {
      const [existing] = await conn.execute(
        "SELECT id FROM bibliography_axis_links WHERE bibliography_id = ? AND axis_id = 30003",
        [ref.id]
      );
      
      if (existing.length === 0) {
        await conn.execute(
          "INSERT INTO bibliography_axis_links (bibliography_id, axis_id, relevance) VALUES (?, 30003, 'primaire')",
          [ref.id]
        );
        h3LinksCreated++;
        console.log("  + Lie a H3: " + (ref.title || "").substring(0, 50));
      }
    } catch (err) {
      // Ignorer les erreurs
    }
  }
  
  console.log("\\nLiaisons H3 creees: " + h3LinksCreated);
  
  // 5. Créer des liaisons bibliography_entity_links pour les plantes menacées
  console.log("\\n=== Liaison des references aux plantes (leaf_economies) ===");
  
  // Récupérer les plantes uniques de leaf_economies
  const [plants] = await conn.execute(`
    SELECT DISTINCT species FROM leaf_economies WHERE species IS NOT NULL
  `);
  
  console.log("Especes dans leaf_economies: " + plants.length);
  
  let entityLinksCreated = 0;
  for (const plant of plants) {
    const speciesName = plant.species;
    
    // Chercher des références mentionnant cette espèce
    const [relatedRefs] = await conn.execute(`
      SELECT id FROM bibliography_entries 
      WHERE title LIKE ? OR abstract LIKE ? OR keywords LIKE ?
      LIMIT 5
    `, [`%${speciesName}%`, `%${speciesName}%`, `%${speciesName}%`]);
    
    for (const ref of relatedRefs) {
      try {
        // Récupérer l'ID de la plante dans leaf_economies
        const [plantRows] = await conn.execute(
          "SELECT id FROM leaf_economies WHERE species = ? LIMIT 1",
          [speciesName]
        );
        
        if (plantRows.length > 0) {
          // Vérifier si le lien existe déjà
          const [existing] = await conn.execute(
            "SELECT id FROM bibliography_entity_links WHERE bibliography_id = ? AND entity_type = 'leaf_economy' AND entity_id = ?",
            [ref.id, plantRows[0].id]
          );
          
          if (existing.length === 0) {
            await conn.execute(`
              INSERT INTO bibliography_entity_links 
              (bibliography_id, entity_type, entity_id, link_type, relevance_score, notes)
              VALUES (?, 'leaf_economy', ?, 'supporting', 70, 'Liaison automatique basee sur le nom d espece')
            `, [ref.id, plantRows[0].id]);
            entityLinksCreated++;
            console.log("  + " + speciesName + " <-> ref " + ref.id);
          }
        }
      } catch (err) {
        // Ignorer les erreurs
      }
    }
  }
  
  console.log("\\nLiaisons entite creees: " + entityLinksCreated);
  
  // Résumé final
  console.log("\\n=== RESUME ===");
  const [h2Final] = await conn.execute("SELECT COUNT(*) as cnt FROM bibliography_axis_links WHERE axis_id = 30002");
  const [h3Final] = await conn.execute("SELECT COUNT(*) as cnt FROM bibliography_axis_links WHERE axis_id = 30003");
  const [entityFinal] = await conn.execute("SELECT COUNT(*) as cnt FROM bibliography_entity_links");
  
  console.log("Total liaisons H2: " + h2Final[0].cnt);
  console.log("Total liaisons H3: " + h3Final[0].cnt);
  console.log("Total liaisons entites: " + entityFinal[0].cnt);
  
  await conn.end();
}

linkH2H3References().catch(console.error);
