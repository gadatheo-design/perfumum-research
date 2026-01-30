import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;

// Données de pyrolyse pour les terpènes supplémentaires
// Sources: Littérature scientifique sur la dégradation thermique des terpènes
const additionalPyrolysisData = [
  // α-Pinène
  {
    source_molecule: 'α-Pinène',
    product_molecule: 'Limonène',
    temperature_min: 300,
    temperature_max: 400,
    zone_name: 'Pyrolyse',
    mechanism: 'Réarrangement thermique du squelette bicyclique en monocyclique',
    olfactory_before: 'Pin, résine, forêt de conifères',
    olfactory_after: 'Agrumes, citron, orange',
    toxicity_level: 'low',
    yield_percentage: 15.0
  },
  {
    source_molecule: 'α-Pinène',
    product_molecule: 'p-Cymène',
    temperature_min: 350,
    temperature_max: 450,
    zone_name: 'Pyrolyse',
    mechanism: 'Aromatisation par déshydrogénation et ouverture du cycle',
    olfactory_before: 'Pin, résine, forêt de conifères',
    olfactory_after: 'Cumin, thym, notes aromatiques',
    toxicity_level: 'low',
    yield_percentage: 12.0
  },
  {
    source_molecule: 'α-Pinène',
    product_molecule: 'Camphène',
    temperature_min: 250,
    temperature_max: 350,
    zone_name: 'Pyrolyse',
    mechanism: 'Isomérisation thermique du squelette pinane',
    olfactory_before: 'Pin, résine, forêt de conifères',
    olfactory_after: 'Camphre, menthol, frais',
    toxicity_level: 'low',
    yield_percentage: 8.0
  },
  {
    source_molecule: 'α-Pinène',
    product_molecule: 'Isoprène',
    temperature_min: 500,
    temperature_max: 700,
    zone_name: 'Combustion',
    mechanism: 'Fragmentation thermique complète en unités C5',
    olfactory_before: 'Pin, résine, forêt de conifères',
    olfactory_after: 'Caoutchouc, pétrochimique',
    toxicity_level: 'moderate',
    yield_percentage: 25.0
  },
  
  // β-Pinène
  {
    source_molecule: 'β-Pinène',
    product_molecule: 'Myrcène',
    temperature_min: 280,
    temperature_max: 380,
    zone_name: 'Pyrolyse',
    mechanism: 'Ouverture du cycle cyclobutane et réarrangement',
    olfactory_before: 'Pin, boisé, balsamique',
    olfactory_after: 'Houblon, terreux, herbacé',
    toxicity_level: 'low',
    yield_percentage: 18.0
  },
  {
    source_molecule: 'β-Pinène',
    product_molecule: 'α-Terpinène',
    temperature_min: 300,
    temperature_max: 400,
    zone_name: 'Pyrolyse',
    mechanism: 'Isomérisation et formation de cycle p-menthane',
    olfactory_before: 'Pin, boisé, balsamique',
    olfactory_after: 'Citron, herbacé, frais',
    toxicity_level: 'low',
    yield_percentage: 10.0
  },
  
  // Humulène
  {
    source_molecule: 'Humulène',
    product_molecule: 'Caryophyllène oxide',
    temperature_min: 200,
    temperature_max: 300,
    zone_name: 'Vaporisation',
    mechanism: 'Époxydation thermique du macrocycle',
    olfactory_before: 'Houblon, boisé, terreux',
    olfactory_after: 'Boisé sec, épicé, légèrement sucré',
    toxicity_level: 'low',
    yield_percentage: 12.0
  },
  {
    source_molecule: 'Humulène',
    product_molecule: 'Isocaryophyllène',
    temperature_min: 250,
    temperature_max: 350,
    zone_name: 'Pyrolyse',
    mechanism: 'Isomérisation du macrocycle sesquiterpénique',
    olfactory_before: 'Houblon, boisé, terreux',
    olfactory_after: 'Boisé, épicé, clou de girofle',
    toxicity_level: 'low',
    yield_percentage: 8.0
  },
  {
    source_molecule: 'Humulène',
    product_molecule: 'Benzène',
    temperature_min: 600,
    temperature_max: 800,
    zone_name: 'Combustion',
    mechanism: 'Aromatisation complète par cyclisation et déshydrogénation',
    olfactory_before: 'Houblon, boisé, terreux',
    olfactory_after: 'Solvant, pétrochimique',
    toxicity_level: 'high',
    yield_percentage: 5.0
  },
  
  // Linalol
  {
    source_molecule: 'Linalol',
    product_molecule: 'Géraniol',
    temperature_min: 180,
    temperature_max: 250,
    zone_name: 'Vaporisation',
    mechanism: 'Isomérisation de la double liaison et migration du groupe hydroxyle',
    olfactory_before: 'Lavande, floral, frais',
    olfactory_after: 'Rose, géranium, floral doux',
    toxicity_level: 'low',
    yield_percentage: 15.0
  },
  {
    source_molecule: 'Linalol',
    product_molecule: 'Myrcène',
    temperature_min: 250,
    temperature_max: 350,
    zone_name: 'Pyrolyse',
    mechanism: 'Déshydratation et réarrangement de la chaîne carbonée',
    olfactory_before: 'Lavande, floral, frais',
    olfactory_after: 'Houblon, terreux, herbacé',
    toxicity_level: 'low',
    yield_percentage: 20.0
  },
  {
    source_molecule: 'Linalol',
    product_molecule: 'Ocimène',
    temperature_min: 200,
    temperature_max: 300,
    zone_name: 'Pyrolyse',
    mechanism: 'Déshydratation et formation de triène conjugué',
    olfactory_before: 'Lavande, floral, frais',
    olfactory_after: 'Herbacé, doux, tropical',
    toxicity_level: 'low',
    yield_percentage: 12.0
  },
  {
    source_molecule: 'Linalol',
    product_molecule: 'Acétaldéhyde',
    temperature_min: 400,
    temperature_max: 550,
    zone_name: 'Pyrolyse',
    mechanism: 'Clivage oxydatif de la chaîne carbonée',
    olfactory_before: 'Lavande, floral, frais',
    olfactory_after: 'Pomme verte, éthéré, piquant',
    toxicity_level: 'moderate',
    yield_percentage: 8.0
  },
  
  // Terpinéol
  {
    source_molecule: 'α-Terpinéol',
    product_molecule: 'Terpinolène',
    temperature_min: 200,
    temperature_max: 300,
    zone_name: 'Vaporisation',
    mechanism: 'Déshydratation du groupe hydroxyle tertiaire',
    olfactory_before: 'Lilas, muguet, floral frais',
    olfactory_after: 'Pin, herbacé, légèrement floral',
    toxicity_level: 'low',
    yield_percentage: 25.0
  },
  {
    source_molecule: 'α-Terpinéol',
    product_molecule: 'p-Cymène',
    temperature_min: 350,
    temperature_max: 450,
    zone_name: 'Pyrolyse',
    mechanism: 'Aromatisation par déshydrogénation du cycle p-menthane',
    olfactory_before: 'Lilas, muguet, floral frais',
    olfactory_after: 'Cumin, thym, aromatique',
    toxicity_level: 'low',
    yield_percentage: 15.0
  },
  
  // Géraniol
  {
    source_molecule: 'Géraniol',
    product_molecule: 'Citral',
    temperature_min: 180,
    temperature_max: 280,
    zone_name: 'Vaporisation',
    mechanism: 'Oxydation de l\'alcool primaire en aldéhyde',
    olfactory_before: 'Rose, géranium, floral doux',
    olfactory_after: 'Citron, citronnelle, frais intense',
    toxicity_level: 'low',
    yield_percentage: 20.0
  },
  {
    source_molecule: 'Géraniol',
    product_molecule: 'Linalol',
    temperature_min: 200,
    temperature_max: 300,
    zone_name: 'Pyrolyse',
    mechanism: 'Isomérisation de la chaîne et migration du groupe hydroxyle',
    olfactory_before: 'Rose, géranium, floral doux',
    olfactory_after: 'Lavande, floral, frais',
    toxicity_level: 'low',
    yield_percentage: 12.0
  },
  {
    source_molecule: 'Géraniol',
    product_molecule: 'Myrcène',
    temperature_min: 280,
    temperature_max: 380,
    zone_name: 'Pyrolyse',
    mechanism: 'Déshydratation et cyclisation partielle',
    olfactory_before: 'Rose, géranium, floral doux',
    olfactory_after: 'Houblon, terreux, herbacé',
    toxicity_level: 'low',
    yield_percentage: 18.0
  },
  
  // Nérol
  {
    source_molecule: 'Nérol',
    product_molecule: 'Citral',
    temperature_min: 180,
    temperature_max: 280,
    zone_name: 'Vaporisation',
    mechanism: 'Oxydation de l\'alcool primaire en aldéhyde (isomère Z)',
    olfactory_before: 'Rose douce, floral, légèrement citronné',
    olfactory_after: 'Citron, citronnelle, frais intense',
    toxicity_level: 'low',
    yield_percentage: 18.0
  },
  {
    source_molecule: 'Nérol',
    product_molecule: 'Géraniol',
    temperature_min: 150,
    temperature_max: 250,
    zone_name: 'Vaporisation',
    mechanism: 'Isomérisation cis-trans de la double liaison',
    olfactory_before: 'Rose douce, floral, légèrement citronné',
    olfactory_after: 'Rose, géranium, floral doux',
    toxicity_level: 'low',
    yield_percentage: 15.0
  },
  
  // Citronellol
  {
    source_molecule: 'Citronellol',
    product_molecule: 'Citronellal',
    temperature_min: 200,
    temperature_max: 300,
    zone_name: 'Vaporisation',
    mechanism: 'Oxydation de l\'alcool primaire en aldéhyde',
    olfactory_before: 'Rose, citronnelle, floral frais',
    olfactory_after: 'Citronnelle intense, herbacé, frais',
    toxicity_level: 'low',
    yield_percentage: 22.0
  },
  {
    source_molecule: 'Citronellol',
    product_molecule: 'Isopulégol',
    temperature_min: 250,
    temperature_max: 350,
    zone_name: 'Pyrolyse',
    mechanism: 'Cyclisation intramoléculaire et formation de menthane',
    olfactory_before: 'Rose, citronnelle, floral frais',
    olfactory_after: 'Menthe, frais, herbacé',
    toxicity_level: 'low',
    yield_percentage: 10.0
  },
  
  // Farnésène
  {
    source_molecule: 'α-Farnésène',
    product_molecule: 'Bisabolène',
    temperature_min: 250,
    temperature_max: 350,
    zone_name: 'Pyrolyse',
    mechanism: 'Cyclisation du squelette farnésane en bisabolane',
    olfactory_before: 'Pomme verte, boisé doux',
    olfactory_after: 'Boisé, balsamique, légèrement épicé',
    toxicity_level: 'low',
    yield_percentage: 15.0
  },
  {
    source_molecule: 'α-Farnésène',
    product_molecule: 'Nérolidol',
    temperature_min: 200,
    temperature_max: 300,
    zone_name: 'Vaporisation',
    mechanism: 'Hydratation de la double liaison terminale',
    olfactory_before: 'Pomme verte, boisé doux',
    olfactory_after: 'Rose, boisé, floral doux',
    toxicity_level: 'low',
    yield_percentage: 8.0
  },
  {
    source_molecule: 'α-Farnésène',
    product_molecule: 'Isoprène',
    temperature_min: 500,
    temperature_max: 700,
    zone_name: 'Combustion',
    mechanism: 'Fragmentation complète en unités isoprène',
    olfactory_before: 'Pomme verte, boisé doux',
    olfactory_after: 'Caoutchouc, pétrochimique',
    toxicity_level: 'moderate',
    yield_percentage: 30.0
  },
  
  // Bisabolol
  {
    source_molecule: 'α-Bisabolol',
    product_molecule: 'Bisabolène',
    temperature_min: 200,
    temperature_max: 300,
    zone_name: 'Vaporisation',
    mechanism: 'Déshydratation du groupe hydroxyle tertiaire',
    olfactory_before: 'Camomille, floral doux, légèrement épicé',
    olfactory_after: 'Boisé, balsamique, légèrement épicé',
    toxicity_level: 'low',
    yield_percentage: 25.0
  },
  {
    source_molecule: 'α-Bisabolol',
    product_molecule: 'Farnésène',
    temperature_min: 280,
    temperature_max: 380,
    zone_name: 'Pyrolyse',
    mechanism: 'Ouverture du cycle et réarrangement en chaîne linéaire',
    olfactory_before: 'Camomille, floral doux, légèrement épicé',
    olfactory_after: 'Pomme verte, boisé doux',
    toxicity_level: 'low',
    yield_percentage: 12.0
  },
  {
    source_molecule: 'α-Bisabolol',
    product_molecule: 'Chamazulène',
    temperature_min: 350,
    temperature_max: 450,
    zone_name: 'Pyrolyse',
    mechanism: 'Aromatisation et formation d\'azulène par déshydrogénation',
    olfactory_before: 'Camomille, floral doux, légèrement épicé',
    olfactory_after: 'Camomille intense, herbacé, légèrement fumé',
    toxicity_level: 'low',
    yield_percentage: 8.0
  },
  
  // Ocimène
  {
    source_molecule: 'β-Ocimène',
    product_molecule: 'Myrcène',
    temperature_min: 250,
    temperature_max: 350,
    zone_name: 'Pyrolyse',
    mechanism: 'Isomérisation des doubles liaisons conjuguées',
    olfactory_before: 'Herbacé, doux, tropical, basilic',
    olfactory_after: 'Houblon, terreux, herbacé',
    toxicity_level: 'low',
    yield_percentage: 20.0
  },
  {
    source_molecule: 'β-Ocimène',
    product_molecule: 'Allo-ocimène',
    temperature_min: 180,
    temperature_max: 280,
    zone_name: 'Vaporisation',
    mechanism: 'Isomérisation thermique des doubles liaisons',
    olfactory_before: 'Herbacé, doux, tropical, basilic',
    olfactory_after: 'Floral, herbacé, légèrement boisé',
    toxicity_level: 'low',
    yield_percentage: 15.0
  },
  
  // Terpinolène
  {
    source_molecule: 'Terpinolène',
    product_molecule: 'p-Cymène',
    temperature_min: 300,
    temperature_max: 400,
    zone_name: 'Pyrolyse',
    mechanism: 'Aromatisation par déshydrogénation du cycle',
    olfactory_before: 'Pin, herbacé, légèrement floral, agrumes',
    olfactory_after: 'Cumin, thym, aromatique',
    toxicity_level: 'low',
    yield_percentage: 18.0
  },
  {
    source_molecule: 'Terpinolène',
    product_molecule: 'α-Terpinène',
    temperature_min: 200,
    temperature_max: 300,
    zone_name: 'Vaporisation',
    mechanism: 'Migration de la double liaison endocyclique',
    olfactory_before: 'Pin, herbacé, légèrement floral, agrumes',
    olfactory_after: 'Citron, herbacé, frais',
    toxicity_level: 'low',
    yield_percentage: 12.0
  },
  
  // Eucalyptol (1,8-Cinéole)
  {
    source_molecule: 'Eucalyptol',
    product_molecule: 'Limonène',
    temperature_min: 350,
    temperature_max: 450,
    zone_name: 'Pyrolyse',
    mechanism: 'Ouverture de l\'éther cyclique et élimination d\'eau',
    olfactory_before: 'Eucalyptus, camphré, frais mentholé',
    olfactory_after: 'Agrumes, citron, orange',
    toxicity_level: 'low',
    yield_percentage: 15.0
  },
  {
    source_molecule: 'Eucalyptol',
    product_molecule: 'p-Cymène',
    temperature_min: 400,
    temperature_max: 500,
    zone_name: 'Pyrolyse',
    mechanism: 'Aromatisation après ouverture du cycle éther',
    olfactory_before: 'Eucalyptus, camphré, frais mentholé',
    olfactory_after: 'Cumin, thym, aromatique',
    toxicity_level: 'low',
    yield_percentage: 10.0
  },
  
  // Camphre
  {
    source_molecule: 'Camphre',
    product_molecule: 'Bornéol',
    temperature_min: 180,
    temperature_max: 280,
    zone_name: 'Vaporisation',
    mechanism: 'Réduction de la cétone en alcool secondaire',
    olfactory_before: 'Camphré, mentholé, pénétrant',
    olfactory_after: 'Pin, camphré, terreux',
    toxicity_level: 'low',
    yield_percentage: 8.0
  },
  {
    source_molecule: 'Camphre',
    product_molecule: 'Camphène',
    temperature_min: 300,
    temperature_max: 400,
    zone_name: 'Pyrolyse',
    mechanism: 'Décarbonylation et réarrangement du squelette bornane',
    olfactory_before: 'Camphré, mentholé, pénétrant',
    olfactory_after: 'Camphre doux, menthol, frais',
    toxicity_level: 'low',
    yield_percentage: 12.0
  }
];

async function enrichPyrolysisData() {
  const connection = await mysql.createConnection(DATABASE_URL);
  
  console.log('🔬 Enrichissement des données de pyrolyse...\n');
  
  let inserted = 0;
  let skipped = 0;
  
  for (const transformation of additionalPyrolysisData) {
    try {
      // Construire la plage de température
      const temperatureRange = `${transformation.temperature_min}-${transformation.temperature_max}°C (${transformation.zone_name})`;
      
      // Construire les notes avec les infos olfactives et le rendement
      const notes = `Avant: ${transformation.olfactory_before} | Après: ${transformation.olfactory_after} | Rendement: ${transformation.yield_percentage}%`;
      
      // Vérifier si la transformation existe déjà
      const [existing] = await connection.execute(
        `SELECT id FROM pyrolysis_transformations 
         WHERE source_molecule = ? AND product_molecule = ?`,
        [transformation.source_molecule, transformation.product_molecule]
      );
      
      if (existing.length > 0) {
        console.log(`⏭️  Existe déjà: ${transformation.source_molecule} → ${transformation.product_molecule}`);
        skipped++;
        continue;
      }
      
      // Insérer la nouvelle transformation
      await connection.execute(
        `INSERT INTO pyrolysis_transformations 
         (source_molecule, product_molecule, temperature_range, mechanism, toxicity_level, notes)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          transformation.source_molecule,
          transformation.product_molecule,
          temperatureRange,
          transformation.mechanism,
          transformation.toxicity_level,
          notes
        ]
      );
      
      console.log(`✅ Ajouté: ${transformation.source_molecule} → ${transformation.product_molecule} (${transformation.temperature_min}-${transformation.temperature_max}°C)`);
      inserted++;
    } catch (error) {
      console.error(`❌ Erreur pour ${transformation.source_molecule} → ${transformation.product_molecule}:`, error.message);
    }
  }
  
  console.log(`\n📊 Résumé:`);
  console.log(`   - Transformations ajoutées: ${inserted}`);
  console.log(`   - Transformations existantes (ignorées): ${skipped}`);
  console.log(`   - Total dans le fichier: ${additionalPyrolysisData.length}`);
  
  // Compter le total dans la base
  const [countResult] = await connection.execute('SELECT COUNT(*) as total FROM pyrolysis_transformations');
  console.log(`   - Total en base: ${countResult[0].total}`);
  
  await connection.end();
  console.log('\n✅ Enrichissement terminé!');
}

enrichPyrolysisData().catch(console.error);
