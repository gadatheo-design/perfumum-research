import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function main() {
  const conn = await mysql.createConnection(process.env.DATABASE_URL);
  
  console.log('=== Import des données de pyrolyse et transformations moléculaires ===\n');
  
  // Données de transformation par terpène
  const pyrolysisTransformations = [
    // Myrcène → Méthacroléine + Benzène + Isoprène
    {
      source_molecule: 'Myrcène',
      products: ['Méthacroléine', 'Benzène', 'Isoprène'],
      temperature_range: '340-482°C',
      mechanism: 'Pyrolyse thermique',
      toxicity_level: 'high',
      notes: 'Méthacroléine hautement irritant pour les voies respiratoires'
    },
    // Limonène → Isoprène + Composés aromatiques
    {
      source_molecule: 'Limonène',
      products: ['Isoprène', 'Composés aromatiques cycliques'],
      temperature_range: '340-482°C',
      mechanism: 'Pyrolyse thermique',
      toxicity_level: 'moderate',
      notes: 'Contribue aux notes citriques fumées'
    },
    // β-Caryophyllène → HAP
    {
      source_molecule: 'β-Caryophyllène',
      products: ['HAP (Hydrocarbures Aromatiques Polycycliques)', 'Composés aromatiques'],
      temperature_range: '>600°C',
      mechanism: 'Combustion haute température',
      toxicity_level: 'very_high',
      notes: 'HAP sont cancérigènes (benzo[a]pyrène)'
    },
    // α-Humulène → HAP
    {
      source_molecule: 'α-Humulène',
      products: ['HAP', 'Composés sesquiterpéniques oxydés'],
      temperature_range: '>600°C',
      mechanism: 'Combustion haute température',
      toxicity_level: 'very_high',
      notes: 'Précurseur majeur de HAP'
    },
    // Terpinolène → Composés aromatiques cycliques
    {
      source_molecule: 'Terpinolène',
      products: ['Composés aromatiques cycliques', 'Aldéhydes floraux'],
      temperature_range: '340-482°C',
      mechanism: 'Pyrolyse thermique',
      toxicity_level: 'moderate',
      notes: 'Contribue aux notes florales fumées'
    },
    // Ocimène → Composés aromatiques cycliques
    {
      source_molecule: 'Ocimène',
      products: ['Composés aromatiques cycliques', 'Aldéhydes'],
      temperature_range: '340-482°C',
      mechanism: 'Pyrolyse thermique',
      toxicity_level: 'moderate',
      notes: 'Notes florales fumées'
    },
    // α-Pinène → Composés terpéniques oxydés
    {
      source_molecule: 'α-Pinène',
      products: ['Composés terpéniques oxydés', 'Verbenone'],
      temperature_range: '340-482°C',
      mechanism: 'Pyrolyse thermique',
      toxicity_level: 'low',
      notes: 'Notes de pin fumé'
    },
    // β-Pinène → Composés terpéniques oxydés
    {
      source_molecule: 'β-Pinène',
      products: ['Composés terpéniques oxydés', 'Myrténol'],
      temperature_range: '340-482°C',
      mechanism: 'Pyrolyse thermique',
      toxicity_level: 'low',
      notes: 'Notes de pin fumé'
    },
    // Linalol → Aldéhydes floraux
    {
      source_molecule: 'Linalol',
      products: ['Aldéhydes floraux', 'Citral'],
      temperature_range: '340-482°C',
      mechanism: 'Pyrolyse thermique',
      toxicity_level: 'low',
      notes: 'Notes florales douces'
    },
    // Géraniol → Aldéhydes floraux
    {
      source_molecule: 'Géraniol',
      products: ['Citral', 'Aldéhydes floraux'],
      temperature_range: '340-482°C',
      mechanism: 'Pyrolyse thermique',
      toxicity_level: 'low',
      notes: 'Notes florales roses'
    }
  ];
  
  // Données de transformation par landrace
  const landraceTransformations = [
    // Asie Centrale (Indica)
    {
      landrace: 'Afghan Kush',
      region: 'Asie Centrale',
      type: 'Indica',
      dominant_terpene: 'Myrcène',
      terpene_percentage: '40-55%',
      main_pyrolysis_products: ['Méthacroléine', 'HAP modérés', 'Composés terpéniques oxydés'],
      smoke_signature: 'Terreuse intense, épicée, résineuse, notes de pin fumé',
      toxicity_level: 'high'
    },
    {
      landrace: 'Hindu Kush',
      region: 'Asie Centrale',
      type: 'Indica',
      dominant_terpene: 'Myrcène',
      terpene_percentage: '35-50%',
      main_pyrolysis_products: ['Méthacroléine', 'HAP modérés'],
      smoke_signature: 'Terreuse, épicée, résineuse',
      toxicity_level: 'high'
    },
    // Asie du Sud-Est (Sativa)
    {
      landrace: 'Thai Stick',
      region: 'Asie du Sud-Est',
      type: 'Sativa',
      dominant_terpene: 'Limonène',
      terpene_percentage: '20-35%',
      main_pyrolysis_products: ['Isoprène', 'Composés aromatiques cycliques', 'Aldéhydes floraux'],
      smoke_signature: 'Citrique brûlée, florale fumée, tropicale, épicée douce',
      toxicity_level: 'moderate'
    },
    // Afrique Est (Sativa)
    {
      landrace: 'Malawi Gold',
      region: 'Afrique Est',
      type: 'Sativa',
      dominant_terpene: 'Terpinolène',
      terpene_percentage: '25-40%',
      main_pyrolysis_products: ['Composés aromatiques cycliques', 'Aldéhydes floraux'],
      smoke_signature: 'Florale intense, pin brûlé',
      toxicity_level: 'moderate'
    },
    {
      landrace: 'Durban Poison',
      region: 'Afrique Est',
      type: 'Sativa',
      dominant_terpene: 'Terpinolène',
      terpene_percentage: '20-35%',
      main_pyrolysis_products: ['Composés aromatiques cycliques', 'Aldéhydes'],
      smoke_signature: 'Florale, anis/réglisse',
      toxicity_level: 'moderate'
    },
    // Afrique Centrale
    {
      landrace: 'Angola Red',
      region: 'Afrique Centrale',
      type: 'Sativa',
      dominant_terpene: 'β-Caryophyllène',
      terpene_percentage: '20-30%',
      main_pyrolysis_products: ['HAP élevés', 'Composés sesquiterpéniques oxydés'],
      smoke_signature: 'Épicée intense, boisée fumée, poivrée',
      toxicity_level: 'very_high'
    },
    // Amériques
    {
      landrace: 'Colombian Gold',
      region: 'Amérique du Sud',
      type: 'Sativa',
      dominant_terpene: 'Limonène',
      terpene_percentage: '25-35%',
      main_pyrolysis_products: ['Isoprène', 'Composés aromatiques'],
      smoke_signature: 'Citrique intense',
      toxicity_level: 'moderate'
    },
    {
      landrace: 'Oaxacan',
      region: 'Amérique Centrale',
      type: 'Sativa',
      dominant_terpene: 'Limonène',
      terpene_percentage: '20-30%',
      main_pyrolysis_products: ['Isoprène', 'Composés aromatiques'],
      smoke_signature: 'Citrique/douce',
      toxicity_level: 'moderate'
    },
    {
      landrace: 'Panama Red',
      region: 'Amérique Centrale',
      type: 'Sativa',
      dominant_terpene: 'β-Caryophyllène',
      terpene_percentage: '25-35%',
      main_pyrolysis_products: ['HAP élevés', 'Composés sesquiterpéniques oxydés'],
      smoke_signature: 'Épicée intense, boisée',
      toxicity_level: 'very_high'
    },
    {
      landrace: 'Acapulco Gold',
      region: 'Amérique Centrale',
      type: 'Sativa',
      dominant_terpene: 'β-Caryophyllène',
      terpene_percentage: '20-30%',
      main_pyrolysis_products: ['HAP', 'Composés aromatiques'],
      smoke_signature: 'Épicée/caramel',
      toxicity_level: 'high'
    },
    // Moyen-Orient
    {
      landrace: 'Lebanese Red',
      region: 'Moyen-Orient',
      type: 'Hybride naturel',
      dominant_terpene: 'Myrcène',
      terpene_percentage: '25-35%',
      main_pyrolysis_products: ['Méthacroléine modérée', 'HAP modérés', 'Composés terpéniques oxydés'],
      smoke_signature: 'Cèdre fumé, épicée, résineuse intense',
      toxicity_level: 'moderate_high'
    }
  ];
  
  // Zones de température
  const temperatureZones = [
    { zone: 'Vaporisation', temp_min: 157, temp_max: 220, description: 'Libération des terpènes intacts' },
    { zone: 'Pyrolyse', temp_min: 340, temp_max: 482, description: 'Dégradation thermique sans oxygène' },
    { zone: 'Combustion', temp_min: 600, temp_max: 900, description: 'Oxydation complète' }
  ];
  
  // Créer la table pyrolysis_transformations si elle n'existe pas
  await conn.execute(`
    CREATE TABLE IF NOT EXISTS pyrolysis_transformations (
      id INT AUTO_INCREMENT PRIMARY KEY,
      source_molecule VARCHAR(255) NOT NULL,
      product_molecule VARCHAR(255) NOT NULL,
      temperature_range VARCHAR(50),
      mechanism VARCHAR(100),
      toxicity_level ENUM('low', 'moderate', 'high', 'very_high'),
      notes TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  
  // Créer la table landrace_pyrolysis_profiles si elle n'existe pas
  await conn.execute(`
    CREATE TABLE IF NOT EXISTS landrace_pyrolysis_profiles (
      id INT AUTO_INCREMENT PRIMARY KEY,
      landrace_name VARCHAR(255) NOT NULL,
      region VARCHAR(100),
      cannabis_type VARCHAR(50),
      dominant_terpene VARCHAR(100),
      terpene_percentage VARCHAR(20),
      pyrolysis_products TEXT,
      smoke_signature TEXT,
      toxicity_level ENUM('low', 'moderate', 'moderate_high', 'high', 'very_high'),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  
  // Créer la table temperature_zones si elle n'existe pas
  await conn.execute(`
    CREATE TABLE IF NOT EXISTS temperature_zones (
      id INT AUTO_INCREMENT PRIMARY KEY,
      zone_name VARCHAR(50) NOT NULL,
      temp_min INT,
      temp_max INT,
      description TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  
  console.log('Tables créées ou vérifiées.\n');
  
  // Insérer les transformations de pyrolyse
  let pyrolysisCount = 0;
  for (const trans of pyrolysisTransformations) {
    for (const product of trans.products) {
      await conn.execute(`
        INSERT INTO pyrolysis_transformations 
        (source_molecule, product_molecule, temperature_range, mechanism, toxicity_level, notes)
        VALUES (?, ?, ?, ?, ?, ?)
      `, [trans.source_molecule, product, trans.temperature_range, trans.mechanism, trans.toxicity_level, trans.notes]);
      pyrolysisCount++;
    }
  }
  console.log(`Transformations de pyrolyse insérées: ${pyrolysisCount}`);
  
  // Insérer les profils de pyrolyse par landrace
  let landraceCount = 0;
  for (const landrace of landraceTransformations) {
    await conn.execute(`
      INSERT INTO landrace_pyrolysis_profiles 
      (landrace_name, region, cannabis_type, dominant_terpene, terpene_percentage, pyrolysis_products, smoke_signature, toxicity_level)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      landrace.landrace, 
      landrace.region, 
      landrace.type, 
      landrace.dominant_terpene, 
      landrace.terpene_percentage,
      JSON.stringify(landrace.main_pyrolysis_products),
      landrace.smoke_signature,
      landrace.toxicity_level
    ]);
    landraceCount++;
  }
  console.log(`Profils de pyrolyse par landrace insérés: ${landraceCount}`);
  
  // Insérer les zones de température
  for (const zone of temperatureZones) {
    await conn.execute(`
      INSERT INTO temperature_zones (zone_name, temp_min, temp_max, description)
      VALUES (?, ?, ?, ?)
    `, [zone.zone, zone.temp_min, zone.temp_max, zone.description]);
  }
  console.log(`Zones de température insérées: ${temperatureZones.length}`);
  
  // Lier aux molécules existantes dans molecular_transformations
  console.log('\nLiaison avec les molécules existantes...');
  
  // Chercher les molécules sources et créer les liens
  const moleculeMapping = {
    'Myrcène': ['myrcene', 'β-myrcène', 'beta-myrcene'],
    'Limonène': ['limonene', 'd-limonene', 'l-limonene'],
    'β-Caryophyllène': ['caryophyllene', 'β-caryophyllène', 'beta-caryophyllene'],
    'α-Humulène': ['humulene', 'α-humulène', 'alpha-humulene'],
    'Terpinolène': ['terpinolene'],
    'Ocimène': ['ocimene', 'β-ocimène', 'beta-ocimene'],
    'α-Pinène': ['pinene', 'α-pinène', 'alpha-pinene'],
    'β-Pinène': ['β-pinène', 'beta-pinene'],
    'Linalol': ['linalool', 'linalol'],
    'Géraniol': ['geraniol', 'géraniol']
  };
  
  let linkedCount = 0;
  for (const [sourceName, aliases] of Object.entries(moleculeMapping)) {
    // Chercher la molécule source
    const aliasConditions = aliases.map(a => `LOWER(name) LIKE '%${a}%'`).join(' OR ');
    const [sourceMols] = await conn.execute(`
      SELECT id, name FROM molecules WHERE ${aliasConditions} LIMIT 1
    `);
    
    if (sourceMols.length > 0) {
      const sourceId = sourceMols[0].id;
      
      // Récupérer les produits de pyrolyse pour cette molécule
      const [products] = await conn.execute(`
        SELECT product_molecule FROM pyrolysis_transformations WHERE source_molecule = ?
      `, [sourceName]);
      
      for (const prod of products) {
        // Chercher si le produit existe dans les molécules
        const [prodMols] = await conn.execute(`
          SELECT id FROM molecules WHERE LOWER(name) LIKE ? LIMIT 1
        `, [`%${prod.product_molecule.toLowerCase()}%`]);
        
        if (prodMols.length > 0) {
          // Vérifier si la transformation existe déjà
          const [existing] = await conn.execute(`
            SELECT id FROM molecular_transformations 
            WHERE source_molecule_id = ? AND product_molecule_id = ?
          `, [sourceId, prodMols[0].id]);
          
          if (existing.length === 0) {
            await conn.execute(`
              INSERT INTO molecular_transformations 
              (source_molecule_id, source_molecule_name, product_molecule_id, product_molecule_name, transformation_type, temperature_min, temperature_max, notes)
              VALUES (?, ?, ?, ?, 'pyrolysis', 340, 900, 'Transformation thermique par combustion')
            `, [sourceId, sourceName, prodMols[0].id, prod.product_molecule]);
            linkedCount++;
          }
        }
      }
    }
  }
  console.log(`Liaisons molecular_transformations créées: ${linkedCount}`);
  
  await conn.end();
  console.log('\n✅ Import des données de pyrolyse terminé!');
}

main().catch(console.error);
