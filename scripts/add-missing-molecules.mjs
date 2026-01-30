import mysql from 'mysql2/promise';

const connection = await mysql.createConnection(process.env.DATABASE_URL);

try {
  console.log('=== AJOUT DES MOLÉCULES MANQUANTES ===\n');
  
    // Définir toutes les molécules manquantes avec leurs familles
  const missingMolecules = [
    // Phénols et aromatiques
    { name: 'Eugénol', family: 'Phénol aromatique', olfactiveProfile: 'Note clou de girofle, épicée, chaude' },
    { name: 'Guaïacol', family: 'Phénol aromatique', olfactiveProfile: 'Note fumée, boisée, balsamique' },
    { name: 'Carvacrol', family: 'Phénol monoterpénique', olfactiveProfile: 'Note herbe aromatique, origan, thym' },
    { name: 'Thymol', family: 'Phénol monoterpénique', olfactiveProfile: 'Note thym, médicinale, herbacée' },
    
    // Aldéhydes
    { name: 'Cinnamaldéhyde', family: 'Aldéhyde aromatique', olfactiveProfile: 'Note cannelle, épicée, sucrée' },
    { name: 'β-Damascénone', family: 'Cétone', olfactiveProfile: 'Note rose, fruitée, miel' },
    { name: 'Aldéhyde C-10', family: 'Aldéhyde aliphatique', olfactiveProfile: 'Note agrume, métallique, fraîche' },
    { name: 'Aldéhyde C-11', family: 'Aldéhyde aliphatique', olfactiveProfile: 'Note cireuse, aldéhydée, fraîche' },
    { name: 'Aldéhyde C-12', family: 'Aldéhyde aliphatique', olfactiveProfile: 'Note savonneuse, cireuse, florale' },
    { name: 'Citral', family: 'Aldéhyde terpénique', olfactiveProfile: 'Note citron, verte, fraîche' },
    
    // Alcools monoterpéniques
    { name: 'Menthol', family: 'Monoterpénol', olfactiveProfile: 'Note menthe, fraîche, camphrée' },
    { name: 'Camphre', family: 'Cétone monoterpénique', olfactiveProfile: 'Note camphrée, médicinale, fraîche' },
    { name: 'Eucalyptol', family: 'Oxyde terpénique', olfactiveProfile: 'Note eucalyptus, fraîche, médicinale' },
    { name: 'Bornéol', family: 'Monoterpénol', olfactiveProfile: 'Note camphrée, boisée, fraîche' },
    { name: 'Géraniol', family: 'Monoterpénol', olfactiveProfile: 'Note rose, florale, sucrée' },
    { name: 'Citronellol', family: 'Monoterpénol', olfactiveProfile: 'Note rose, citronnée, fraîche' },
    { name: 'Nérol', family: 'Monoterpénol', olfactiveProfile: 'Note rose, verte, fraîche' },
    { name: 'α-Terpinéol', family: 'Monoterpénol', olfactiveProfile: 'Note lilas, pin, fraîche' },
    { name: 'Terpinène-4-ol', family: 'Monoterpénol', olfactiveProfile: 'Note boisée, terreuse, épicée' },
    { name: 'Menthone', family: 'Cétone monoterpénique', olfactiveProfile: 'Note menthe, herbacée, fraîche' },
    
    // Alcools aromatiques
    { name: 'Alcool phényléthylique', family: 'Alcool aromatique', olfactiveProfile: 'Note rose, miel, pain' },
    { name: 'Alcool cinnamique', family: 'Alcool aromatique', olfactiveProfile: 'Note balsamique, jacinthe, sucrée' },
    
    // Esters
    { name: 'Acétate de linalyle', family: 'Ester terpénique', olfactiveProfile: 'Note lavande, bergamote, fraîche' },
    { name: 'Acétate de géranyle', family: 'Ester terpénique', olfactiveProfile: 'Note fruitée, rose, verte' },
    { name: 'Acétate de phényléthyle', family: 'Ester aromatique', olfactiveProfile: 'Note rose, miel, fruitée' },
    { name: 'Acétate de benzyle', family: 'Ester aromatique', olfactiveProfile: 'Note jasmin, fruitée, florale' },
    { name: 'Benzoate de benzyle', family: 'Ester aromatique', olfactiveProfile: 'Note balsamique, amande, sucrée' },
    { name: 'Acétate d\'isoeugenol', family: 'Ester phénolique', olfactiveProfile: 'Note clou de girofle, épicée, florale' },
    
    // Sesquiterpènes et alcools sesquiterpéniques
    { name: 'Vétivérol', family: 'Sesquiterpénol', olfactiveProfile: 'Note vétiver, boisée, terreuse' },
    { name: 'α-Cédrène', family: 'Sesquiterpène', olfactiveProfile: 'Note cèdre, boisée, sèche' },
    { name: 'β-Cédrène', family: 'Sesquiterpène', olfactiveProfile: 'Note cèdre, boisée, douce' },
    { name: 'Thujopsène', family: 'Sesquiterpène', olfactiveProfile: 'Note cèdre, boisée, épicée' },
    { name: 'α-Humulène', family: 'Sesquiterpène', olfactiveProfile: 'Note boisée, terreuse, houblon' },
    
    // Molécules synthétiques marines et ozones
    { name: 'Calone', family: 'Synthétique marin', olfactiveProfile: 'Note marine, pastèque, fraîche' },
    { name: 'Hélional', family: 'Aldéhyde synthétique', olfactiveProfile: 'Note marine, ozonnée, métallique' },
    { name: 'Ozonal', family: 'Aldéhyde synthétique', olfactiveProfile: 'Note ozone, métallique, fraîche' },
    
    // Lactones et cétones
    { name: 'Jasmine lactone', family: 'Lactone', olfactiveProfile: 'Note jasmin, crémeuse, fruitée' },
    
    // Résines et baumes
    { name: 'Styrax', family: 'Résine balsamique', olfactiveProfile: 'Note balsamique, vanillée, ambrée' },
    { name: 'Cade', family: 'Huile empyreumatique', olfactiveProfile: 'Note fumée, cuir, goudron' },
    
    // Monoterpènes
    { name: 'p-Cymène', family: 'Monoterpène', olfactiveProfile: 'Note cumin, épicée, citronnée' },
    { name: 'Sabinène', family: 'Monoterpène', olfactiveProfile: 'Note poivrée, épicée, boisée' },
    
    // Alcaloïdes
    { name: 'Pipérine', family: 'Alcaloïde', olfactiveProfile: 'Note poivre noir, piquante, épicée' },
    
    // Phéromones
    { name: 'Androsténone', family: 'Stéroïde', olfactiveProfile: 'Note musquée, animale, urinée' },
    { name: 'α-Androsténol', family: 'Stéroïde', olfactiveProfile: 'Note musquée, boisée, sucrée' }
  ];
  
  let addedCount = 0;
  let skippedCount = 0;
  
  for (const mol of missingMolecules) {
    // Vérifier si la molécule existe déjà
    const [existing] = await connection.execute(
      'SELECT id FROM molecules WHERE name = ?',
      [mol.name]
    );
    
    if (existing.length > 0) {
      console.log(`⏭️  ${mol.name} existe déjà`);
      skippedCount++;
      continue;
    }
    
    // Ajouter la molécule
    await connection.execute(
      'INSERT INTO molecules (name, family, olfactiveProfile) VALUES (?, ?, ?)',
      [mol.name, mol.family, mol.olfactiveProfile]
    );
    
    console.log(`✅ ${mol.name} (${mol.family})`);
    addedCount++;
  }
  
  console.log(`\n\n=== RÉSUMÉ ===`);
  console.log(`Molécules ajoutées : ${addedCount}`);
  console.log(`Molécules déjà présentes : ${skippedCount}`);
  console.log(`Total traité : ${missingMolecules.length}`);
  
  // Afficher le nombre total de molécules
  const [totalCount] = await connection.execute('SELECT COUNT(*) as count FROM molecules');
  console.log(`\nTotal molécules dans la base : ${totalCount[0].count}`);
  
} finally {
  await connection.end();
}
