import mysql from 'mysql2/promise';

const connection = await mysql.createConnection(process.env.DATABASE_URL);

try {
  console.log('=== ENRICHISSEMENT DES RECETTES SANS MOLÉCULES ===\n');
  
  // Définir les compositions moléculaires pour chaque recette
  // Basé sur les profils olfactifs typiques de chaque catégorie
  
  const enrichmentData = {
    // Colombie I-VIII (série tabac)
    300001: { // Origan Sacré
      molecules: [
        { name: 'Carvacrol', proportion: 28.5 },
        { name: 'Thymol', proportion: 18.2 },
        { name: 'Linalol', proportion: 15.3 },
        { name: 'β-Caryophyllène', proportion: 12.8 },
        { name: 'p-Cymène', proportion: 10.4 },
        { name: 'Terpinène-4-ol', proportion: 8.6 },
        { name: 'Myrcène', proportion: 6.2 }
      ]
    },
    300002: { // Damiana Tropicale
      molecules: [
        { name: 'α-Pinène', proportion: 22.4 },
        { name: 'β-Pinène', proportion: 18.7 },
        { name: 'Eucalyptol', proportion: 16.3 },
        { name: 'Camphre', proportion: 14.2 },
        { name: 'Linalol', proportion: 11.8 },
        { name: 'Thymol', proportion: 9.5 },
        { name: 'Limonène', proportion: 7.1 }
      ]
    },
    300003: { // Guayabita Citrus
      molecules: [
        { name: 'Limonène', proportion: 32.6 },
        { name: 'β-Pinène', proportion: 18.4 },
        { name: 'Linalol', proportion: 15.7 },
        { name: 'Acétate de linalyle', proportion: 12.3 },
        { name: 'Myrcène', proportion: 9.8 },
        { name: 'α-Terpinéol', proportion: 6.9 },
        { name: 'Citral', proportion: 4.3 }
      ]
    },
    300004: { // Café Floral
      molecules: [
        { name: 'Linalol', proportion: 26.8 },
        { name: 'Acétate de linalyle', proportion: 19.5 },
        { name: 'Géraniol', proportion: 14.2 },
        { name: 'β-Damascénone', proportion: 11.7 },
        { name: 'Nérol', proportion: 9.3 },
        { name: 'Alcool phényléthylique', proportion: 10.6 },
        { name: 'Eugénol', proportion: 7.9 }
      ]
    },
    300005: { // Poivre Sauvage
      molecules: [
        { name: 'β-Caryophyllène', proportion: 35.2 },
        { name: 'Limonène', proportion: 18.6 },
        { name: 'α-Pinène', proportion: 14.8 },
        { name: 'β-Pinène', proportion: 11.3 },
        { name: 'Sabinène', proportion: 8.7 },
        { name: 'Myrcène', proportion: 6.9 },
        { name: 'Pipérine', proportion: 4.5 }
      ]
    },
    300006: { // Cacao Sacré
      molecules: [
        { name: 'Acétate de phényléthyle', proportion: 24.3 },
        { name: 'Alcool phényléthylique', proportion: 19.8 },
        { name: 'Linalol', proportion: 16.2 },
        { name: 'Vanilline', proportion: 13.5 },
        { name: 'Eugénol', proportion: 10.7 },
        { name: 'Acétate de benzyle', proportion: 8.9 },
        { name: 'Cinnamaldéhyde', proportion: 6.6 }
      ]
    },
    300007: { // Endémique Rare
      molecules: [
        { name: 'α-Pinène', proportion: 28.4 },
        { name: 'β-Caryophyllène', proportion: 22.1 },
        { name: 'Limonène', proportion: 16.8 },
        { name: 'Linalol', proportion: 12.5 },
        { name: 'Camphre', proportion: 9.7 },
        { name: 'Eucalyptol', proportion: 6.8 },
        { name: 'Myrcène', proportion: 3.7 }
      ]
    },
    300008: { // Harmonie Complète
      molecules: [
        { name: 'Linalol', proportion: 21.5 },
        { name: 'β-Caryophyllène', proportion: 17.8 },
        { name: 'Limonène', proportion: 14.6 },
        { name: 'Acétate de linalyle', proportion: 12.3 },
        { name: 'α-Pinène', proportion: 10.9 },
        { name: 'Géraniol', proportion: 9.4 },
        { name: 'Eugénol', proportion: 7.2 },
        { name: 'Vanilline', proportion: 6.3 }
      ]
    },
    
    // Gamme Colombie (330017-330024)
    330017: { // CAFÉ DE LOS ANDES
      molecules: [
        { name: 'β-Damascénone', proportion: 26.3 },
        { name: 'Linalol', proportion: 19.7 },
        { name: 'Eugénol', proportion: 15.4 },
        { name: 'Vanilline', proportion: 13.8 },
        { name: 'Acétate de linalyle', proportion: 11.2 },
        { name: 'Alcool phényléthylique', proportion: 8.9 },
        { name: 'Guaïacol', proportion: 4.7 }
      ]
    },
    330018: { // SELVA SAGRADA
      molecules: [
        { name: 'α-Pinène', proportion: 32.1 },
        { name: 'β-Caryophyllène', proportion: 24.5 },
        { name: 'Limonène', proportion: 16.8 },
        { name: 'Camphre', proportion: 11.3 },
        { name: 'Eucalyptol', proportion: 8.7 },
        { name: 'Linalol', proportion: 6.6 }
      ]
    },
    330019: { // FRUTAS ANDINAS
      molecules: [
        { name: 'Limonène', proportion: 34.8 },
        { name: 'Linalol', proportion: 22.4 },
        { name: 'Acétate de linalyle', proportion: 16.9 },
        { name: 'Myrcène', proportion: 11.5 },
        { name: 'β-Pinène', proportion: 8.3 },
        { name: 'Citral', proportion: 6.1 }
      ]
    },
    330020: { // CHAMÁN NOCTURNO
      molecules: [
        { name: 'β-Caryophyllène', proportion: 29.6 },
        { name: 'α-Humulène', proportion: 18.7 },
        { name: 'Linalol', proportion: 15.2 },
        { name: 'Camphre', proportion: 12.8 },
        { name: 'Carvacrol', proportion: 10.4 },
        { name: 'Myrcène', proportion: 7.9 },
        { name: 'Eugénol', proportion: 5.4 }
      ]
    },
    330021: { // VERDE MEDICINA
      molecules: [
        { name: 'Eucalyptol', proportion: 31.2 },
        { name: 'α-Pinène', proportion: 23.8 },
        { name: 'Camphre', proportion: 16.5 },
        { name: 'Limonène', proportion: 12.7 },
        { name: 'Linalol', proportion: 9.3 },
        { name: 'β-Pinène', proportion: 6.5 }
      ]
    },
    330022: { // BOSQUE DE CEDRO
      molecules: [
        { name: 'α-Cédrène', proportion: 28.4 },
        { name: 'β-Cédrène', proportion: 21.6 },
        { name: 'Thujopsène', proportion: 16.8 },
        { name: 'α-Pinène', proportion: 13.2 },
        { name: 'β-Caryophyllène', proportion: 10.5 },
        { name: 'Limonène', proportion: 6.9 },
        { name: 'Camphre', proportion: 2.6 }
      ]
    },
    330023: { // DULCE TRÓPICO
      molecules: [
        { name: 'Vanilline', proportion: 26.7 },
        { name: 'Linalol', proportion: 19.8 },
        { name: 'Acétate de linalyle', proportion: 15.4 },
        { name: 'Eugénol', proportion: 12.6 },
        { name: 'Limonène', proportion: 10.3 },
        { name: 'Alcool phényléthylique', proportion: 8.9 },
        { name: 'Cinnamaldéhyde', proportion: 6.3 }
      ]
    },
    330024: { // OFRENDA ANCESTRAL
      molecules: [
        { name: 'β-Caryophyllène', proportion: 24.8 },
        { name: 'Linalol', proportion: 18.5 },
        { name: 'Eugénol', proportion: 16.2 },
        { name: 'Camphre', proportion: 13.7 },
        { name: 'Carvacrol', proportion: 11.3 },
        { name: 'α-Pinène', proportion: 9.1 },
        { name: 'Myrcène', proportion: 6.4 }
      ]
    },
    
    // Gamme Pétrichor (360001-360003)
    360001: { // BRUME MARINE MÉTALLIQUE
      molecules: [
        { name: 'Géosmine', proportion: 32.5 },
        { name: 'Calone', proportion: 24.8 },
        { name: 'Aldéhyde C-11', proportion: 16.3 },
        { name: 'Hélional', proportion: 12.7 },
        { name: 'Ambroxan', proportion: 8.9 },
        { name: 'Iso E Super', proportion: 4.8 }
      ]
    },
    360002: { // PIERRE DE LUNE HUMIDE
      molecules: [
        { name: 'Géosmine', proportion: 38.2 },
        { name: 'Aldéhyde C-12', proportion: 21.6 },
        { name: 'Vétivérol', proportion: 15.8 },
        { name: 'Patchoulol', proportion: 11.4 },
        { name: 'Calone', proportion: 8.7 },
        { name: 'Ambroxan', proportion: 4.3 }
      ]
    },
    360003: { // ORAGE FERREUX
      molecules: [
        { name: 'Géosmine', proportion: 29.4 },
        { name: 'Aldéhyde C-10', proportion: 23.7 },
        { name: 'Ozonal', proportion: 18.5 },
        { name: 'Calone', proportion: 13.2 },
        { name: 'Hélional', proportion: 9.6 },
        { name: 'Iso E Super', proportion: 5.6 }
      ]
    },
    
    // Gamme Volcanique (360004-360006)
    360004: { // FUMÉE DE TEMPLE ANCIEN
      molecules: [
        { name: 'Guaïacol', proportion: 31.8 },
        { name: 'Eugénol', proportion: 22.4 },
        { name: 'Vanilline', proportion: 16.7 },
        { name: 'Acétate d\'isoeugenol', proportion: 12.3 },
        { name: 'Cinnamaldéhyde', proportion: 9.5 },
        { name: 'Styrax', proportion: 7.3 }
      ]
    },
    360005: { // LAVE BALSAMIQUE
      molecules: [
        { name: 'Vanilline', proportion: 28.6 },
        { name: 'Eugénol', proportion: 21.3 },
        { name: 'Benzoate de benzyle', proportion: 17.9 },
        { name: 'Cinnamaldéhyde', proportion: 14.2 },
        { name: 'Alcool cinnamique', proportion: 10.7 },
        { name: 'Styrax', proportion: 7.3 }
      ]
    },
    360006: { // CENDRES SACRÉES
      molecules: [
        { name: 'Guaïacol', proportion: 34.2 },
        { name: 'Vétivérol', proportion: 23.8 },
        { name: 'Patchoulol', proportion: 16.5 },
        { name: 'Eugénol', proportion: 12.7 },
        { name: 'Cade', proportion: 8.4 },
        { name: 'Styrax', proportion: 4.4 }
      ]
    },
    
    // Gamme Civilisations (360007-360009)
    360007: { // JARDIN DE ROSES PERSANES
      molecules: [
        { name: 'Alcool phényléthylique', proportion: 32.4 },
        { name: 'Géraniol', proportion: 24.8 },
        { name: 'Citronellol', proportion: 18.6 },
        { name: 'Nérol', proportion: 12.3 },
        { name: 'Acétate de géranyle', proportion: 7.9 },
        { name: 'Eugénol', proportion: 4.0 }
      ]
    },
    360008: { // SOIE ET ÉPICES
      molecules: [
        { name: 'Eugénol', proportion: 28.7 },
        { name: 'Cinnamaldéhyde', proportion: 22.4 },
        { name: 'Linalol', proportion: 16.8 },
        { name: 'β-Caryophyllène', proportion: 13.5 },
        { name: 'Vanilline', proportion: 10.2 },
        { name: 'Alcool phényléthylique', proportion: 8.4 }
      ]
    },
    360009: { // BIBLIOTHÈQUE D'ALEXANDRIE
      molecules: [
        { name: 'Vanilline', proportion: 26.3 },
        { name: 'Eugénol', proportion: 19.7 },
        { name: 'Alcool phényléthylique', proportion: 16.2 },
        { name: 'Benzoate de benzyle', proportion: 13.8 },
        { name: 'Linalol', proportion: 11.4 },
        { name: 'Acétate de benzyle', proportion: 8.9 },
        { name: 'Cinnamaldéhyde', proportion: 3.7 }
      ]
    },
    
    // Gamme Glaciaire (360010-360012)
    360010: { // GLACIER DE MENTHE
      molecules: [
        { name: 'Menthol', proportion: 42.3 },
        { name: 'Menthone', proportion: 24.7 },
        { name: 'Eucalyptol', proportion: 15.8 },
        { name: 'Camphre', proportion: 9.6 },
        { name: 'Limonène', proportion: 5.2 },
        { name: 'α-Pinène', proportion: 2.4 }
      ]
    },
    360011: { // TOUNDRA CAMPHRÉE
      molecules: [
        { name: 'Camphre', proportion: 38.5 },
        { name: 'Eucalyptol', proportion: 27.3 },
        { name: 'α-Pinène', proportion: 16.8 },
        { name: 'β-Pinène', proportion: 10.2 },
        { name: 'Bornéol', proportion: 5.7 },
        { name: 'Limonène', proportion: 1.5 }
      ]
    },
    360012: { // CRISTAL DE GLACE
      molecules: [
        { name: 'Eucalyptol', proportion: 34.6 },
        { name: 'Menthol', proportion: 26.8 },
        { name: 'Camphre', proportion: 18.4 },
        { name: 'α-Pinène', proportion: 11.7 },
        { name: 'Limonène', proportion: 6.3 },
        { name: 'β-Pinène', proportion: 2.2 }
      ]
    },
    
    // Gamme Colombie parfums (360013-360016)
    360013: { // CAFÉ COLOMBIEN FUMÉ
      molecules: [
        { name: 'β-Damascénone', proportion: 29.4 },
        { name: 'Guaïacol', proportion: 23.7 },
        { name: 'Vanilline', proportion: 18.2 },
        { name: 'Eugénol', proportion: 13.8 },
        { name: 'Linalol', proportion: 9.5 },
        { name: 'Alcool phényléthylique', proportion: 5.4 }
      ]
    },
    360014: { // FLEUR DE CAFÉ
      molecules: [
        { name: 'Linalol', proportion: 32.6 },
        { name: 'Acétate de linalyle', proportion: 24.3 },
        { name: 'Alcool phényléthylique', proportion: 17.8 },
        { name: 'Géraniol', proportion: 12.4 },
        { name: 'β-Damascénone', proportion: 8.7 },
        { name: 'Jasmine lactone', proportion: 4.2 }
      ]
    },
    360015: { // CACAO SACRÉ MAYA
      molecules: [
        { name: 'Vanilline', proportion: 34.8 },
        { name: 'Acétate de phényléthyle', proportion: 22.6 },
        { name: 'Eugénol', proportion: 16.4 },
        { name: 'Alcool phényléthylique', proportion: 13.2 },
        { name: 'Linalol', proportion: 8.7 },
        { name: 'Cinnamaldéhyde', proportion: 4.3 }
      ]
    },
    360016: { // TABAC VERT COLOMBIEN
      molecules: [
        { name: 'β-Caryophyllène', proportion: 28.9 },
        { name: 'Linalol', proportion: 21.4 },
        { name: 'α-Pinène', proportion: 16.7 },
        { name: 'Limonène', proportion: 13.2 },
        { name: 'Eugénol', proportion: 10.5 },
        { name: 'Camphre', proportion: 6.8 },
        { name: 'Myrcène', proportion: 2.5 }
      ]
    },
    
    // Gamme Mossi (360017-360018)
    360017: { // KARITÉ SACRÉ
      molecules: [
        { name: 'Alcool phényléthylique', proportion: 26.8 },
        { name: 'Linalol', proportion: 21.3 },
        { name: 'Vanilline', proportion: 17.6 },
        { name: 'Acétate de linalyle', proportion: 14.2 },
        { name: 'Géraniol', proportion: 10.7 },
        { name: 'Eugénol', proportion: 6.9 },
        { name: 'Cinnamaldéhyde', proportion: 2.5 }
      ]
    },
    360018: { // TERRE ROUGE MOSSI
      molecules: [
        { name: 'Géosmine', proportion: 32.4 },
        { name: 'Vétivérol', proportion: 24.7 },
        { name: 'Patchoulol', proportion: 18.3 },
        { name: 'α-Cédrène', proportion: 12.6 },
        { name: 'β-Caryophyllène', proportion: 8.4 },
        { name: 'Eugénol', proportion: 3.6 }
      ]
    },
    
    // Recettes avec 1 molécule à compléter
    101: { // R'LYEH SUBMERGED
      molecules: [
        { name: 'Calone', proportion: 38.5 }, // Déjà existante, on ajoute
        { name: 'Géosmine', proportion: 24.3 },
        { name: 'Ambroxan', proportion: 16.7 },
        { name: 'Aldéhyde C-11', proportion: 11.2 },
        { name: 'Vétivérol', proportion: 6.8 },
        { name: 'Iso E Super', proportion: 2.5 }
      ]
    },
    180001: { // Pheromona Truffle
      molecules: [
        { name: 'Androsténone', proportion: 42.3 }, // Déjà existante probablement
        { name: 'α-Androsténol', proportion: 21.8 },
        { name: 'Géosmine', proportion: 15.4 },
        { name: 'Patchoulol', proportion: 10.7 },
        { name: 'Vétivérol', proportion: 6.9 },
        { name: 'Eugénol', proportion: 2.9 }
      ]
    }
  };
  
  // Récupérer toutes les molécules existantes
  const [allMolecules] = await connection.execute('SELECT id, name FROM molecules');
  const moleculeMap = new Map(allMolecules.map(m => [m.name, m.id]));
  
  let enrichedCount = 0;
  let moleculesAddedCount = 0;
  
  for (const [recetteId, data] of Object.entries(enrichmentData)) {
    console.log(`\nTraitement recette ID ${recetteId}...`);
    
    // Vérifier si la recette existe
    const [recetteCheck] = await connection.execute(
      'SELECT id, name FROM recettes WHERE id = ?',
      [recetteId]
    );
    
    if (recetteCheck.length === 0) {
      console.log(`  ⚠️  Recette ${recetteId} introuvable, ignorée`);
      continue;
    }
    
    const recetteName = recetteCheck[0].name;
    console.log(`  📝 ${recetteName}`);
    
    // Supprimer les anciennes liaisons (pour les recettes avec 1 molécule)
    await connection.execute(
      'DELETE FROM molecules_recettes WHERE recette_id = ?',
      [recetteId]
    );
    
    // Ajouter les nouvelles molécules
    for (const mol of data.molecules) {
      const moleculeId = moleculeMap.get(mol.name);
      
      if (!moleculeId) {
        console.log(`  ⚠️  Molécule "${mol.name}" introuvable, ignorée`);
        continue;
      }
      
      await connection.execute(
        'INSERT INTO molecules_recettes (recette_id, molecule_id, proportion) VALUES (?, ?, ?)',
        [recetteId, moleculeId, mol.proportion]
      );
      
      moleculesAddedCount++;
    }
    
    console.log(`  ✅ ${data.molecules.length} molécules ajoutées`);
    enrichedCount++;
  }
  
  console.log(`\n\n=== RÉSUMÉ ===`);
  console.log(`Recettes enrichies : ${enrichedCount}`);
  console.log(`Molécules ajoutées : ${moleculesAddedCount}`);
  console.log(`\n✅ Enrichissement terminé !`);
  
} finally {
  await connection.end();
}
