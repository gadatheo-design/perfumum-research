import mysql from 'mysql2/promise';

const connection = await mysql.createConnection(process.env.DATABASE_URL);

try {
  console.log('=== CRÉATION DE 5 NOUVELLES FORMULES DE RÉFÉRENCE ===\n');
  
  // Analyser les 10 recettes atypiques pour identifier les patterns
  console.log('📊 Analyse des 10 recettes atypiques...\n');
  
  const atypicalRecettes = [60001, 60002, 60003, 60004, 60005, 60006, 60007, 60008, 60009, 60010];
  
  // Récupérer les molécules de chaque recette atypique
  for (const recetteId of atypicalRecettes) {
    const [recetteInfo] = await connection.execute(
      'SELECT name FROM recettes WHERE id = ?',
      [recetteId]
    );
    
    const [molecules] = await connection.execute(`
      SELECT m.name, m.family, mr.proportion
      FROM molecules_recettes mr
      JOIN molecules m ON mr.molecule_id = m.id
      WHERE mr.recette_id = ?
      ORDER BY mr.proportion DESC
    `, [recetteId]);
    
    console.log(`[${recetteId}] ${recetteInfo[0].name}`);
    molecules.forEach(m => {
      console.log(`  - ${m.name} (${m.family || 'N/A'}): ${m.proportion}%`);
    });
    console.log('');
  }
  
  // Définir 5 nouvelles formules de référence modernes
  // Basées sur les tendances actuelles de la parfumerie de niche
  const newFormulas = [
    {
      name: 'MODERNE I — Minéral Aquatique',
      description: 'Formule contemporaine explorant les notes marines, métalliques et terreuses. Inspirée par les parfums aquatiques modernes comme Escentric Molecules et Comme des Garçons.',
      category: 'parfum',
      gamme: 'Moderne',
      molecules: [
        { name: 'Géosmine', proportion: 28.5 },
        { name: 'Calone', proportion: 22.3 },
        { name: 'Ambroxan', proportion: 18.7 },
        { name: 'Iso E Super', proportion: 14.2 },
        { name: 'Aldéhyde C-11', proportion: 9.8 },
        { name: 'Hélional', proportion: 6.5 }
      ]
    },
    {
      name: 'MODERNE II — Boisé Minimaliste',
      description: 'Formule épurée centrée sur les notes boisées sèches et les molécules synthétiques. Approche minimaliste inspirée par Aesop et Le Labo.',
      category: 'parfum',
      gamme: 'Moderne',
      molecules: [
        { name: 'Iso E Super', proportion: 32.4 },
        { name: 'Vétivérol', proportion: 24.6 },
        { name: 'α-Cédrène', proportion: 18.3 },
        { name: 'Ambroxan', proportion: 13.7 },
        { name: 'Patchoulol', proportion: 7.8 },
        { name: 'Géosmine', proportion: 3.2 }
      ]
    },
    {
      name: 'MODERNE III — Acide Signature',
      description: 'Formule audacieuse utilisant l\'acide hexanoïque comme signature olfactive. Note fromagère, lactée et animale pour parfums de niche radicaux.',
      category: 'parfum',
      gamme: 'Moderne',
      molecules: [
        { name: 'Hexanoic acid', proportion: 35.8 },
        { name: 'Linalol', proportion: 22.4 },
        { name: 'Ambroxan', proportion: 16.9 },
        { name: 'Iso E Super', proportion: 12.3 },
        { name: 'β-Caryophyllène', proportion: 8.7 },
        { name: 'Vanilline', proportion: 3.9 }
      ]
    },
    {
      name: 'MODERNE IV — Floral Synthétique',
      description: 'Formule florale moderne utilisant des molécules synthétiques pour créer une rose abstraite et contemporaine. Inspirée par Juliette Has A Gun et Byredo.',
      category: 'parfum',
      gamme: 'Moderne',
      molecules: [
        { name: 'Alcool phényléthylique', proportion: 28.6 },
        { name: 'Géraniol', proportion: 21.4 },
        { name: 'Iso E Super', proportion: 17.8 },
        { name: 'Linalol', proportion: 14.2 },
        { name: 'Citronellol', proportion: 10.5 },
        { name: 'Ambroxan', proportion: 7.5 }
      ]
    },
    {
      name: 'MODERNE V — Fumé Balsamique',
      description: 'Formule contemporaine combinant notes fumées, résineuses et balsamiques. Approche moderne des parfums orientaux par Serge Lutens et Diptyque.',
      category: 'parfum',
      gamme: 'Moderne',
      molecules: [
        { name: 'Guaïacol', proportion: 26.7 },
        { name: 'Vanilline', proportion: 22.3 },
        { name: 'Styrax', proportion: 18.5 },
        { name: 'Eugénol', proportion: 14.8 },
        { name: 'Ambroxan', proportion: 10.2 },
        { name: 'Iso E Super', proportion: 7.5 }
      ]
    }
  ];
  
  // Récupérer toutes les molécules
  const [allMolecules] = await connection.execute('SELECT id, name FROM molecules');
  const moleculeMap = new Map(allMolecules.map(m => [m.name, m.id]));
  
  console.log('\n📝 Création des formules...\n');
  
  let createdCount = 0;
  
  for (const formula of newFormulas) {
    // Insérer la formule de référence
    const [result] = await connection.execute(
      'INSERT INTO formules_reference (name, description, category, gamme) VALUES (?, ?, ?, ?)',
      [formula.name, formula.description, formula.category, formula.gamme]
    );
    
    const formulaId = result.insertId;
    console.log(`✅ ${formula.name} (ID: ${formulaId})`);
    
    // Ajouter les molécules
    for (const mol of formula.molecules) {
      const moleculeId = moleculeMap.get(mol.name);
      
      if (!moleculeId) {
        console.log(`  ⚠️  Molécule "${mol.name}" introuvable`);
        continue;
      }
      
      await connection.execute(
        'INSERT INTO molecules_formules_reference (formule_id, molecule_id, proportion) VALUES (?, ?, ?)',
        [formulaId, moleculeId, mol.proportion]
      );
    }
    
    console.log(`  → ${formula.molecules.length} molécules ajoutées\n`);
    createdCount++;
  }
  
  // Afficher le résumé
  const [totalFormulas] = await connection.execute('SELECT COUNT(*) as count FROM formules_reference');
  
  console.log('\n=== RÉSUMÉ ===');
  console.log(`Nouvelles formules créées : ${createdCount}`);
  console.log(`Total formules de référence : ${totalFormulas[0].count}`);
  console.log('\n✅ Création terminée !');
  
} finally {
  await connection.end();
}
