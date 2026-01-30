/**
 * Script d'import des données de tabac pour PERFUMUM v2
 * - Landraces de tabac du monde entier (nouvelles tables)
 * - Cigarettes historiques (soviétiques, orientales, chinoises)
 * - Composés moléculaires du Perique
 * - Analyses pédologiques
 */

import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;

async function importData() {
  const connection = await mysql.createConnection(DATABASE_URL);
  
  console.log('🚬 Import des données de tabac PERFUMUM v2...\n');

  // ============================================================================
  // 1. LANDRACES DE TABAC (13 variétés clés)
  // ============================================================================
  console.log('📍 Import des landraces de tabac...');
  
  const landraces = [
    // Méditerranée et Proche-Orient
    {
      name: 'Basma',
      country: 'Grèce',
      region: 'Macédoine',
      species: 'Nicotiana tabacum',
      status: 'active',
      rarity_score: 7,
      aromatic_profile: 'Floral, Épicé, Miel, Foin',
      aromatic_intensity: 8,
      dominant_notes: 'Floral, Miel',
      secondary_notes: 'Épicé, Foin',
      indoles_ppm: 10,
      terpenes_floraux_ppm: 300,
      lactones_ppm: 10,
      molecular_profile_type: 'floral-mielle',
      data_certainty: 'confirmed',
      perfumery_potential_score: 9.5,
      perfumery_applications: 'Accords floraux-miellés, tabacs orientaux raffinés',
      curing_method: 'Sun-cured',
      source_references: 'Kurt (2021) - HPLC analysis'
    },
    {
      name: 'Yenidje',
      country: 'Grèce',
      region: 'Macédoine (historiquement Turquie)',
      species: 'Nicotiana tabacum',
      status: 'rare',
      rarity_score: 9,
      aromatic_profile: 'Encens, Floral, Éthéré',
      aromatic_intensity: 9,
      dominant_notes: 'Encens, Floral',
      secondary_notes: 'Éthéré, Mystique',
      indoles_ppm: 20,
      terpenes_floraux_ppm: 250,
      lactones_ppm: 5,
      molecular_profile_type: 'floral-mielle',
      data_certainty: 'hypothetical',
      perfumery_potential_score: 9.8,
      perfumery_applications: 'Accords orientaux, encens, parfums mystiques',
      curing_method: 'Sun-cured',
      source_references: 'Extrapolation basée sur profils organoleptiques'
    },
    {
      name: 'Izmir (Smyrna)',
      country: 'Turquie',
      region: 'Égée',
      species: 'Nicotiana tabacum',
      status: 'active',
      rarity_score: 6,
      aromatic_profile: 'Crémeux, Doux, Sucré',
      aromatic_intensity: 7,
      dominant_notes: 'Crémeux, Sucré',
      secondary_notes: 'Doux, Fruité',
      indoles_ppm: 5,
      terpenes_floraux_ppm: 150,
      lactones_ppm: 100,
      molecular_profile_type: 'cremeux-gourmand',
      data_certainty: 'hypothetical',
      perfumery_potential_score: 9.0,
      perfumery_applications: 'Accords gourmands, tabacs doux, notes crémeuses',
      curing_method: 'Sun-cured',
      source_references: 'Extrapolation basée sur profils organoleptiques'
    },
    {
      name: 'Latakia',
      country: 'Chypre',
      region: 'Latakia (historiquement Syrie)',
      species: 'Nicotiana tabacum',
      status: 'active',
      rarity_score: 7,
      aromatic_profile: 'Fumé, Boisé, Cuir',
      aromatic_intensity: 10,
      dominant_notes: 'Fumé, Cuir',
      secondary_notes: 'Boisé, Terreux',
      indoles_ppm: 200,
      terpenes_floraux_ppm: 50,
      lactones_ppm: 30,
      molecular_profile_type: 'cuir-animal',
      data_certainty: 'confirmed',
      perfumery_potential_score: 9.5,
      perfumery_applications: 'Accords cuir-fumé, tabacs anglais, notes animales',
      curing_method: 'Fire-cured (fumé au bois aromatique)',
      source_references: 'Leffingwell et al. (2013) - 500+ composés identifiés'
    },
    {
      name: 'Djebel (Dubec)',
      country: 'Bulgarie',
      region: 'Balkans',
      species: 'Nicotiana tabacum',
      status: 'rare',
      rarity_score: 7,
      aromatic_profile: 'Très aromatique, Doux, Floral',
      aromatic_intensity: 8,
      dominant_notes: 'Floral, Aromatique',
      secondary_notes: 'Doux, Herbacé',
      indoles_ppm: 15,
      terpenes_floraux_ppm: 200,
      lactones_ppm: 15,
      molecular_profile_type: 'floral-mielle',
      data_certainty: 'hypothetical',
      perfumery_potential_score: 8.5,
      perfumery_applications: 'Accords floraux balkans, tabacs orientaux',
      curing_method: 'Sun-cured',
      source_references: 'Documentation traditionnelle bulgare'
    },
    // Amériques
    {
      name: 'Criollo Original',
      country: 'Cuba',
      region: 'Vuelta Abajo',
      species: 'Nicotiana tabacum',
      status: 'extinct',
      rarity_score: 10,
      aromatic_profile: 'Terreux, Épicé, Doux, Floral',
      aromatic_intensity: 9,
      dominant_notes: 'Terreux, Floral',
      secondary_notes: 'Épicé, Doux',
      indoles_ppm: 30,
      terpenes_floraux_ppm: 200,
      lactones_ppm: 20,
      molecular_profile_type: 'floral-mielle',
      data_certainty: 'hypothetical',
      perfumery_potential_score: 10.0,
      perfumery_applications: 'Reconstruction moléculaire, tabacs cubains ancestraux',
      historical_notes: 'Variété ancestrale cubaine (1500s-1900s), base génétique des cigares cubains',
      curing_method: 'Air-cured',
      source_references: 'Archives historiques cubaines, extrapolations génétiques'
    },
    {
      name: 'Corojo Original',
      country: 'Cuba',
      region: 'Vuelta Abajo',
      species: 'Nicotiana tabacum',
      status: 'extinct',
      rarity_score: 9,
      aromatic_profile: 'Cuir, Épicé, Terreux',
      aromatic_intensity: 9,
      dominant_notes: 'Cuir, Épicé',
      secondary_notes: 'Terreux, Animal',
      indoles_ppm: 150,
      terpenes_floraux_ppm: 50,
      lactones_ppm: 10,
      molecular_profile_type: 'cuir-animal',
      data_certainty: 'hypothetical',
      perfumery_potential_score: 9.8,
      perfumery_applications: 'Reconstruction moléculaire, accords cuir-tabac cubain',
      historical_notes: 'Variété wrapper cubaine (1930s-1997), retirée pour vulnérabilité aux maladies',
      curing_method: 'Air-cured',
      source_references: 'Archives historiques cubaines, extrapolations génétiques'
    },
    {
      name: 'Perique',
      country: 'USA',
      region: 'Louisiane (St. James Parish)',
      species: 'Nicotiana tabacum',
      status: 'rare',
      rarity_score: 10,
      aromatic_profile: 'Cuir, Terreux, Fruité, Épicé',
      aromatic_intensity: 10,
      dominant_notes: 'Fruité fermenté, Épicé',
      secondary_notes: 'Cuir, Terreux, Crémeux',
      indoles_ppm: 50,
      terpenes_floraux_ppm: 100,
      lactones_ppm: 50,
      molecular_profile_type: 'cremeux-gourmand',
      data_certainty: 'confirmed',
      perfumery_potential_score: 10.0,
      perfumery_applications: 'Collection Perique 334, accords fruités-fermentés uniques',
      historical_notes: '334 composés volatils identifiés, 48 nouveaux isolats du tabac',
      curing_method: 'Pressure-fermented (fermentation sous pression)',
      source_references: 'Leffingwell & Alford (2005) - 334 composés'
    },
    {
      name: 'Estelí',
      country: 'Nicaragua',
      region: 'Estelí',
      species: 'Nicotiana tabacum',
      status: 'active',
      rarity_score: 4,
      aromatic_profile: 'Poivre noir, Épicé, Terreux',
      aromatic_intensity: 9,
      dominant_notes: 'Poivre noir, Épicé',
      secondary_notes: 'Terreux, Boisé',
      indoles_ppm: 80,
      terpenes_floraux_ppm: 60,
      lactones_ppm: 15,
      molecular_profile_type: 'cuir-animal',
      data_certainty: 'estimated',
      perfumery_potential_score: 9.0,
      perfumery_applications: 'Accords poivrés, tabacs nicaraguayens, notes épicées',
      curing_method: 'Air-cured',
      source_references: 'Analyses terrain PERFUMUM'
    },
    {
      name: 'Virginia',
      country: 'USA',
      region: 'Virginie, Caroline du Nord',
      species: 'Nicotiana tabacum',
      status: 'active',
      rarity_score: 2,
      aromatic_profile: 'Sucré, Acidulé, Miel',
      aromatic_intensity: 6,
      dominant_notes: 'Sucré, Miel',
      secondary_notes: 'Acidulé, Fruité',
      indoles_ppm: 5,
      terpenes_floraux_ppm: 80,
      lactones_ppm: 30,
      molecular_profile_type: 'cremeux-gourmand',
      data_certainty: 'confirmed',
      perfumery_potential_score: 7.0,
      perfumery_applications: 'Base tabacs blonds, accords sucrés-miellés',
      curing_method: 'Flue-cured',
      source_references: 'Littérature scientifique abondante'
    },
    // Asie
    {
      name: 'Deli (Sumatra)',
      country: 'Indonésie',
      region: 'Sumatra Nord',
      species: 'Nicotiana tabacum',
      status: 'active',
      rarity_score: 5,
      aromatic_profile: 'Doux, Aromatique, Subtil',
      aromatic_intensity: 5,
      dominant_notes: 'Doux, Subtil',
      secondary_notes: 'Aromatique, Végétal',
      indoles_ppm: 10,
      terpenes_floraux_ppm: 100,
      lactones_ppm: 20,
      molecular_profile_type: 'floral-mielle',
      data_certainty: 'estimated',
      perfumery_potential_score: 7.5,
      perfumery_applications: 'Wrappers premium, accords subtils',
      curing_method: 'Air-cured',
      source_references: 'Documentation industrie cigare'
    },
    // Espèces distinctes
    {
      name: 'Nicotiana rustica',
      alternate_names: 'Mapacho, Thuốc lào',
      country: 'Amérique du Sud',
      region: 'Andes, Amazonie',
      species: 'Nicotiana rustica',
      status: 'active',
      rarity_score: 9,
      aromatic_profile: 'Puissant, Terreux, Cuir, Fumé',
      aromatic_intensity: 10,
      dominant_notes: 'Puissant, Terreux',
      secondary_notes: 'Cuir, Fumé, Sacré',
      indoles_ppm: 300,
      terpenes_floraux_ppm: 30,
      lactones_ppm: 5,
      molecular_profile_type: 'cuir-animal',
      data_certainty: 'estimated',
      perfumery_potential_score: 9.5,
      perfumery_applications: 'Collection Spirituelle, tabacs sacrés, notes chamaniques',
      historical_notes: 'Espèce ancestrale, usage cérémoniel et spirituel',
      curing_method: 'Traditional (variable)',
      source_references: 'Ethnobotanique, traditions autochtones'
    },
    {
      name: 'Cameroun',
      country: 'Cameroun',
      region: 'Afrique Centrale',
      species: 'Nicotiana tabacum',
      status: 'active',
      rarity_score: 6,
      aromatic_profile: 'Doux, Épicé, Boisé',
      aromatic_intensity: 7,
      dominant_notes: 'Doux, Épicé',
      secondary_notes: 'Boisé, Terreux',
      indoles_ppm: 25,
      terpenes_floraux_ppm: 120,
      lactones_ppm: 25,
      molecular_profile_type: 'mixte',
      data_certainty: 'estimated',
      perfumery_potential_score: 8.0,
      perfumery_applications: 'Wrappers africains, accords doux-épicés',
      curing_method: 'Air-cured',
      source_references: 'Documentation industrie cigare'
    }
  ];

  for (const landrace of landraces) {
    try {
      await connection.execute(
        `INSERT INTO tobacco_landraces 
         (name, alternate_names, country, region, species, status, rarity_score,
          aromatic_profile, aromatic_intensity, dominant_notes, secondary_notes,
          indoles_ppm, terpenes_floraux_ppm, lactones_ppm, molecular_profile_type,
          data_certainty, perfumery_potential_score, perfumery_applications,
          curing_method, historical_notes, source_references)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          landrace.name,
          landrace.alternate_names || null,
          landrace.country,
          landrace.region,
          landrace.species,
          landrace.status,
          landrace.rarity_score,
          landrace.aromatic_profile,
          landrace.aromatic_intensity,
          landrace.dominant_notes,
          landrace.secondary_notes,
          landrace.indoles_ppm,
          landrace.terpenes_floraux_ppm,
          landrace.lactones_ppm,
          landrace.molecular_profile_type,
          landrace.data_certainty,
          landrace.perfumery_potential_score,
          landrace.perfumery_applications,
          landrace.curing_method,
          landrace.historical_notes || null,
          landrace.source_references
        ]
      );
      console.log(`  ✓ ${landrace.name} (${landrace.country})`);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        console.log(`  ⚠ ${landrace.name} existe déjà`);
      } else {
        console.error(`  ✗ Erreur ${landrace.name}:`, error.message);
      }
    }
  }

  // ============================================================================
  // 2. CIGARETTES HISTORIQUES
  // ============================================================================
  console.log('\n🚬 Import des cigarettes historiques...');

  const cigarettes = [
    // Soviétiques
    {
      brand_name: 'Belomorkanal',
      alternate_names: 'Беломорканал',
      origin_country: 'URSS',
      origin_city: 'Leningrad',
      manufacturer: 'Fabrique de tabac Klara Zetkin',
      creation_year: 1932,
      status: 'active',
      format: 'Papirosi (embout carton creux)',
      has_filter: false,
      tobacco_blend: 'Mélanges de tabacs soviétiques : Crimée, Caucase, Asie centrale',
      aromatic_intensity: 9,
      aromatic_character: 'Fort, brut, terreux, peu raffiné',
      dominant_notes: 'Terre, fumée, bois, minéral',
      perfumery_potential_score: 9.5,
      perfumery_applications: 'Tabac brut, cuir, notes minérales froides, bouleau',
      perfumery_approach: 'Authenticité maximale, pas de raffinement',
      historical_price: '21 kopecks (1940-1980)',
      region_category: 'soviet'
    },
    {
      brand_name: 'Laika',
      alternate_names: 'Лайка',
      origin_country: 'URSS',
      manufacturer: 'Tabachnaya Fabrika (diverses usines)',
      creation_year: 1960,
      status: 'discontinued',
      format: 'Cigarettes classiques',
      has_filter: true,
      tobacco_blend: 'Mélanges soviétiques standard',
      aromatic_intensity: 6,
      aromatic_character: 'Moyen, fumé, métallique',
      dominant_notes: 'Fumée, métal, aldéhydes',
      perfumery_potential_score: 9.0,
      perfumery_applications: 'Tabac doux, aldéhydes spatiaux, notes métalliques froides, cuir',
      perfumery_approach: 'Contraste chaud-froid, effet cosmique',
      region_category: 'soviet'
    },
    {
      brand_name: 'Prima',
      alternate_names: 'Прима',
      origin_country: 'URSS',
      origin_city: 'Kiev',
      manufacturer: 'Kiev Tobacco Factory',
      creation_year: 1970,
      status: 'active',
      format: 'Cigarettes classiques',
      has_filter: true,
      tobacco_blend: 'Mélanges ukrainiens',
      aromatic_intensity: 5,
      aromatic_character: 'Moyen, équilibré',
      dominant_notes: 'Tabac équilibré, légèrement terreux',
      perfumery_potential_score: 7.5,
      perfumery_applications: 'Base tabac neutre, accords équilibrés',
      region_category: 'soviet'
    },
    // Orientales
    {
      brand_name: 'Samsun',
      origin_country: 'Turquie',
      origin_city: 'Samsun',
      creation_year: 1950,
      status: 'active',
      format: 'Cigarettes classiques',
      has_filter: true,
      tobacco_blend: 'Tabac oriental Samsun',
      aromatic_intensity: 7,
      aromatic_character: 'Oriental, aromatique, doux',
      dominant_notes: 'Floral, épicé, miel',
      perfumery_potential_score: 8.5,
      perfumery_applications: 'Accords orientaux, tabacs turcs',
      region_category: 'oriental'
    },
    // Chinoises
    {
      brand_name: 'Chunghwa',
      alternate_names: '中华',
      origin_country: 'Chine',
      origin_city: 'Shanghai',
      manufacturer: 'Shanghai Tobacco Group',
      creation_year: 1951,
      status: 'active',
      format: 'Cigarettes premium',
      has_filter: true,
      tobacco_blend: 'Mélanges premium chinois',
      aromatic_intensity: 6,
      aromatic_character: 'Raffiné, doux, légèrement sucré',
      dominant_notes: 'Doux, sucré, légèrement floral',
      perfumery_potential_score: 7.0,
      perfumery_applications: 'Tabacs asiatiques raffinés',
      historical_notes: 'Cigarette de prestige chinoise, offerte aux dignitaires',
      region_category: 'chinese'
    }
  ];

  for (const cig of cigarettes) {
    try {
      await connection.execute(
        `INSERT INTO tobacco_cigarettes 
         (brand_name, alternate_names, origin_country, origin_city, manufacturer,
          creation_year, status, format, has_filter, tobacco_blend,
          aromatic_intensity, aromatic_character, dominant_notes,
          perfumery_potential_score, perfumery_applications, perfumery_approach,
          historical_price, historical_notes, region_category)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          cig.brand_name,
          cig.alternate_names || null,
          cig.origin_country,
          cig.origin_city || null,
          cig.manufacturer || null,
          cig.creation_year || null,
          cig.status,
          cig.format,
          cig.has_filter,
          cig.tobacco_blend,
          cig.aromatic_intensity,
          cig.aromatic_character,
          cig.dominant_notes,
          cig.perfumery_potential_score,
          cig.perfumery_applications,
          cig.perfumery_approach || null,
          cig.historical_price || null,
          cig.historical_notes || null,
          cig.region_category
        ]
      );
      console.log(`  ✓ ${cig.brand_name} (${cig.origin_country})`);
    } catch (error) {
      console.error(`  ✗ Erreur ${cig.brand_name}:`, error.message);
    }
  }

  // ============================================================================
  // 3. COMPOSÉS DU PERIQUE (sélection des plus importants)
  // ============================================================================
  console.log('\n🧪 Import des composés clés du Perique...');

  const periqueCompounds = [
    // Nouveaux isolats du tabac
    { compound_name: 'Whiskey lactone', chemical_class: 'Lactone', category: 'Lactones crémeuses', is_new_tobacco_isolate: true, aromatic_notes: 'Crémeux, boisé, whiskey', perfumery_relevance: 'Note gourmande unique' },
    { compound_name: 'γ-Undecalactone', chemical_class: 'Lactone', category: 'Lactones crémeuses', is_new_tobacco_isolate: true, aromatic_notes: 'Pêche, crémeux', perfumery_relevance: 'Accord fruité-crémeux' },
    { compound_name: 'β-Ionone', chemical_class: 'Norisoprénoïde', category: 'Caroténoïdes dégradés', is_new_tobacco_isolate: false, aromatic_notes: 'Violette, boisé', perfumery_relevance: 'Note florale classique' },
    { compound_name: 'α-Ionone', chemical_class: 'Norisoprénoïde', category: 'Caroténoïdes dégradés', is_new_tobacco_isolate: false, aromatic_notes: 'Violette, fruité', perfumery_relevance: 'Accord floral-fruité' },
    { compound_name: 'Damascenone', chemical_class: 'Norisoprénoïde', category: 'Caroténoïdes dégradés', is_new_tobacco_isolate: false, aromatic_notes: 'Rose, fruité, miel', perfumery_relevance: 'Amplificateur floral puissant' },
    { compound_name: 'Ethyl lactate', chemical_class: 'Ester', category: 'Alcools et esters de fermentation', is_new_tobacco_isolate: true, aromatic_notes: 'Fruité, fermenté', perfumery_relevance: 'Note fermentation unique' },
    { compound_name: 'Isoamyl alcohol', chemical_class: 'Alcool', category: 'Alcools et esters de fermentation', is_new_tobacco_isolate: true, aromatic_notes: 'Fruité, banane', perfumery_relevance: 'Accord fruité fermenté' },
    { compound_name: 'Linalol', chemical_class: 'Monoterpène', category: 'Terpènes floraux', is_new_tobacco_isolate: false, aromatic_notes: 'Lavande, floral, frais', perfumery_relevance: 'Base florale classique' },
    { compound_name: 'Géraniol', chemical_class: 'Monoterpène', category: 'Terpènes floraux', is_new_tobacco_isolate: false, aromatic_notes: 'Rose, géranium', perfumery_relevance: 'Accord floral rosé' },
    { compound_name: 'Nérolidol', chemical_class: 'Sesquiterpène', category: 'Terpènes floraux', is_new_tobacco_isolate: false, aromatic_notes: 'Floral, boisé', perfumery_relevance: 'Profondeur florale' },
    { compound_name: 'Indole', chemical_class: 'Indole', category: 'Indoles', is_new_tobacco_isolate: false, aromatic_notes: 'Animal, floral, fécal', perfumery_relevance: 'Note animale, jasmin' },
    { compound_name: 'Skatole', chemical_class: 'Indole', category: 'Indoles', is_new_tobacco_isolate: false, aromatic_notes: 'Animal, fécal, terreux', perfumery_relevance: 'Note cuir-animal' }
  ];

  for (const compound of periqueCompounds) {
    try {
      await connection.execute(
        `INSERT INTO tobacco_compounds 
         (compound_name, chemical_class, category, landrace_source,
          is_new_tobacco_isolate, aromatic_notes, perfumery_relevance,
          source_reference, data_certainty)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          compound.compound_name,
          compound.chemical_class,
          compound.category,
          'Perique',
          compound.is_new_tobacco_isolate,
          compound.aromatic_notes,
          compound.perfumery_relevance,
          'Leffingwell & Alford (2005)',
          'confirmed'
        ]
      );
      console.log(`  ✓ ${compound.compound_name}`);
    } catch (error) {
      console.error(`  ✗ Erreur ${compound.compound_name}:`, error.message);
    }
  }

  // ============================================================================
  // 4. ANALYSES PÉDOLOGIQUES
  // ============================================================================
  console.log('\n🌍 Import des analyses pédologiques...');

  const soilAnalyses = [
    {
      terroir_name: 'Vuelta Abajo',
      country: 'Cuba',
      region: 'Pinar del Río',
      soil_type: 'Argileux-sableux',
      soil_classification: 'Ferralitique rouge',
      ph_level: 6.5,
      organic_matter_percent: 3.5,
      drainage_quality: 'Excellent',
      altitude_meters: 100,
      climate_type: 'Tropical humide',
      annual_rainfall_mm: 1600,
      impact_on_tobacco: 'Profil aromatique complexe, équilibré, notes florales et terreuses',
      aromatic_influence: 'Terroir mythique pour cigares premium, complexité aromatique maximale',
      source_references: 'Analyse pédologique PERFUMUM'
    },
    {
      terroir_name: 'Estelí',
      country: 'Nicaragua',
      region: 'Estelí',
      soil_type: 'Volcanique',
      soil_classification: 'Andosol',
      ph_level: 6.8,
      organic_matter_percent: 4.2,
      drainage_quality: 'Très bon',
      altitude_meters: 850,
      climate_type: 'Tropical de montagne',
      annual_rainfall_mm: 1200,
      impact_on_tobacco: 'Profil épicé intense, notes de poivre noir, puissance',
      aromatic_influence: 'Terroir volcanique unique, minéralité et épices',
      comparison_notes: 'Plus épicé et puissant que Vuelta Abajo, moins floral',
      source_references: 'Analyse pédologique PERFUMUM'
    }
  ];

  for (const soil of soilAnalyses) {
    try {
      await connection.execute(
        `INSERT INTO soil_analyses 
         (terroir_name, country, region, soil_type, soil_classification,
          ph_level, organic_matter_percent, drainage_quality, altitude_meters,
          climate_type, annual_rainfall_mm, impact_on_tobacco, aromatic_influence,
          comparison_notes, source_references)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          soil.terroir_name,
          soil.country,
          soil.region,
          soil.soil_type,
          soil.soil_classification,
          soil.ph_level,
          soil.organic_matter_percent,
          soil.drainage_quality,
          soil.altitude_meters,
          soil.climate_type,
          soil.annual_rainfall_mm,
          soil.impact_on_tobacco,
          soil.aromatic_influence,
          soil.comparison_notes || null,
          soil.source_references
        ]
      );
      console.log(`  ✓ ${soil.terroir_name} (${soil.country})`);
    } catch (error) {
      console.error(`  ✗ Erreur ${soil.terroir_name}:`, error.message);
    }
  }

  // ============================================================================
  // RÉSUMÉ
  // ============================================================================
  console.log('\n✅ Import terminé!');
  
  const [landracesCount] = await connection.execute('SELECT COUNT(*) as count FROM tobacco_landraces');
  const [cigarettesCount] = await connection.execute('SELECT COUNT(*) as count FROM tobacco_cigarettes');
  const [compoundsCount] = await connection.execute('SELECT COUNT(*) as count FROM tobacco_compounds');
  const [soilsCount] = await connection.execute('SELECT COUNT(*) as count FROM soil_analyses');

  console.log(`\n📊 Statistiques:`);
  console.log(`  - Landraces de tabac: ${landracesCount[0].count}`);
  console.log(`  - Cigarettes historiques: ${cigarettesCount[0].count}`);
  console.log(`  - Composés moléculaires: ${compoundsCount[0].count}`);
  console.log(`  - Analyses pédologiques: ${soilsCount[0].count}`);

  await connection.end();
}

importData().catch(console.error);
