/**
 * Import Research Data Script
 * 
 * Imports analytical methods, researchers, institutions, and publications
 * from the research data files into the PERFUMUM database.
 */

import mysql from 'mysql2/promise';

// Database connection
const DATABASE_URL = process.env.DATABASE_URL;

async function importData() {
  console.log('🔬 Starting research data import...\n');
  
  const connection = await mysql.createConnection(DATABASE_URL);
  
  try {
    // =====================================================
    // 1. IMPORT ANALYTICAL METHODS
    // =====================================================
    console.log('📊 Importing analytical methods...');
    
    const analyticalMethods = [
      {
        code: 'GC-MS',
        name: 'Gas Chromatography-Mass Spectrometry',
        fullName: 'Gas Chromatography-Mass Spectrometry',
        category: 'chromatography',
        performanceScore: 7,
        resolutionScore: 7,
        sensitivityScore: 7,
        detectionLimit: 'ppm level',
        capabilities: JSON.stringify(['Identification précise des produits de dégradation', 'Mécanismes réactionnels', 'Analyse qualitative et quantitative']),
        limitations: JSON.stringify(['Résolution limitée pour composés co-élués']),
        bestSuitedFor: JSON.stringify(['Profilage terpénique', 'Identification de composés', 'Analyse de fumée']),
        description: 'Méthode analytique standard pour l\'identification et la quantification des composés volatils dans la fumée de cannabis et de tabac.',
        publicationCount: 5
      },
      {
        code: 'PTR-MS',
        name: 'Proton Transfer Reaction-Mass Spectrometry',
        fullName: 'Proton Transfer Reaction-Mass Spectrometry',
        category: 'spectrometry',
        performanceScore: 9,
        resolutionScore: 8,
        sensitivityScore: 9,
        detectionLimit: 'ppb level',
        capabilities: JSON.stringify(['Mesure en temps réel', 'Haute sensibilité', 'Analyse rapide']),
        limitations: JSON.stringify(['Coût élevé', 'Expertise requise']),
        bestSuitedFor: JSON.stringify(['Détection de VOCs', 'Mesures en temps réel', 'Qualité de l\'air']),
        description: 'Technique de spectrométrie de masse permettant la détection en temps réel des composés organiques volatils à des concentrations très faibles.',
        publicationCount: 1
      },
      {
        code: 'SMPS',
        name: 'Scanning Mobility Particle Sizer',
        fullName: 'Scanning Mobility Particle Sizer',
        category: 'particle_analysis',
        performanceScore: 5,
        resolutionScore: 6,
        sensitivityScore: 5,
        detectionLimit: 'particle count',
        capabilities: JSON.stringify(['Caractérisation des particules', 'Distribution granulométrique']),
        limitations: JSON.stringify(['Ne mesure pas la composition chimique']),
        bestSuitedFor: JSON.stringify(['Analyse des nanoparticules', 'Caractérisation de la fumée']),
        description: 'Instrument pour mesurer la distribution de taille des particules dans les aérosols et la fumée.',
        publicationCount: 2
      },
      {
        code: 'HS-SPME',
        name: 'Headspace Solid-Phase Microextraction',
        fullName: 'Headspace Solid-Phase Microextraction',
        category: 'chromatography',
        performanceScore: 6,
        resolutionScore: 6,
        sensitivityScore: 7,
        detectionLimit: 'ppm level',
        capabilities: JSON.stringify(['Extraction sans solvant', 'Préparation d\'échantillon simple', 'Mesure de la nicotine en phase gazeuse']),
        limitations: JSON.stringify(['Sélectivité dépendante de la fibre']),
        bestSuitedFor: JSON.stringify(['Analyse de composés volatils', 'Profilage aromatique', 'Mesure de la fraction base libre de la nicotine']),
        description: 'Technique d\'extraction des composés volatils de l\'espace de tête d\'un échantillon pour analyse GC. Utilisée par Pankow pour mesurer la nicotine base libre.',
        publicationCount: 2
      },
      {
        code: 'GCxGC-TOFMS',
        name: 'Two-Dimensional GC Time-of-Flight MS',
        fullName: 'Two-Dimensional Gas Chromatography Time-of-Flight Mass Spectrometry',
        category: 'chromatography',
        performanceScore: 10,
        resolutionScore: 10,
        sensitivityScore: 9,
        detectionLimit: 'ppb level',
        capabilities: JSON.stringify(['Résolution chromatographique exceptionnelle', 'Séparation de composés co-élués', 'Identification de terpènes mineurs']),
        limitations: JSON.stringify(['Coût très élevé', 'Expertise spécialisée requise', 'Analyse de données complexe']),
        bestSuitedFor: JSON.stringify(['Profilage complet des terpènes', 'Analyse de mélanges complexes']),
        description: 'Technique analytique de pointe offrant la meilleure résolution pour l\'analyse des profils terpéniques complexes.',
        publicationCount: 1
      },
      {
        code: 'FTIR',
        name: 'Fourier Transform Infrared Spectroscopy',
        fullName: 'Fourier Transform Infrared Spectroscopy',
        category: 'spectroscopy',
        performanceScore: 6,
        resolutionScore: 5,
        sensitivityScore: 6,
        detectionLimit: 'ppm level',
        capabilities: JSON.stringify(['Identification de groupes fonctionnels', 'Analyse non destructive']),
        limitations: JSON.stringify(['Résolution limitée pour mélanges complexes']),
        bestSuitedFor: JSON.stringify(['Identification de composés', 'Analyse structurale']),
        description: 'Technique spectroscopique pour l\'identification des groupes fonctionnels dans les molécules.',
        publicationCount: 1
      },
      {
        code: 'NMR',
        name: 'Nuclear Magnetic Resonance',
        fullName: 'Nuclear Magnetic Resonance Spectroscopy',
        category: 'spectroscopy',
        performanceScore: 8,
        resolutionScore: 9,
        sensitivityScore: 5,
        detectionLimit: 'ppm level',
        capabilities: JSON.stringify(['Détermination structurale précise', 'Analyse quantitative', 'Mesure des formes protonées vs base libre']),
        limitations: JSON.stringify(['Sensibilité limitée', 'Coût élevé']),
        bestSuitedFor: JSON.stringify(['Élucidation structurale', 'Confirmation d\'identité', 'Chimie acide-base']),
        description: 'Technique spectroscopique pour la détermination de la structure moléculaire. Utilisée par Pankow pour mesurer les formes protonées vs base libre de la nicotine.',
        publicationCount: 2
      },
      {
        code: 'TGA',
        name: 'Thermogravimetric Analysis',
        fullName: 'Thermogravimetric Analysis',
        category: 'thermal_analysis',
        performanceScore: 5,
        resolutionScore: 5,
        sensitivityScore: 5,
        detectionLimit: 'mg level',
        capabilities: JSON.stringify(['Analyse thermique complète', 'Identification des températures critiques']),
        limitations: JSON.stringify(['Ne fournit pas d\'information structurale']),
        bestSuitedFor: JSON.stringify(['Étude de la dégradation thermique', 'Stabilité thermique']),
        description: 'Technique d\'analyse thermique mesurant les changements de masse en fonction de la température.',
        publicationCount: 1
      },
      {
        code: 'DSC',
        name: 'Differential Scanning Calorimetry',
        fullName: 'Differential Scanning Calorimetry',
        category: 'thermal_analysis',
        performanceScore: 5,
        resolutionScore: 5,
        sensitivityScore: 5,
        detectionLimit: 'mg level',
        capabilities: JSON.stringify(['Mesure des transitions thermiques', 'Analyse calorimétrique']),
        limitations: JSON.stringify(['Ne fournit pas d\'information structurale']),
        bestSuitedFor: JSON.stringify(['Étude des transitions de phase', 'Stabilité thermique']),
        description: 'Technique d\'analyse thermique mesurant les flux de chaleur lors des transitions thermiques.',
        publicationCount: 1
      },
      {
        code: 'HPLC',
        name: 'High-Performance Liquid Chromatography',
        fullName: 'High-Performance Liquid Chromatography',
        category: 'chromatography',
        performanceScore: 7,
        resolutionScore: 7,
        sensitivityScore: 7,
        detectionLimit: 'ppm level',
        capabilities: JSON.stringify(['Séparation de composés non volatils', 'Analyse quantitative']),
        limitations: JSON.stringify(['Moins adapté aux composés volatils']),
        bestSuitedFor: JSON.stringify(['Analyse de cannabinoïdes', 'Composés non volatils']),
        description: 'Technique chromatographique pour la séparation et l\'analyse de composés non volatils.',
        publicationCount: 1
      },
      {
        code: 'UV-Vis',
        name: 'UV-Visible Spectroscopy',
        fullName: 'Ultraviolet-Visible Spectroscopy',
        category: 'spectroscopy',
        performanceScore: 4,
        resolutionScore: 4,
        sensitivityScore: 5,
        detectionLimit: 'ppm level',
        capabilities: JSON.stringify(['Mesure du pH', 'Distribution des espèces']),
        limitations: JSON.stringify(['Résolution limitée']),
        bestSuitedFor: JSON.stringify(['Mesure du pH', 'Chimie acide-base']),
        description: 'Technique spectroscopique utilisée par Pankow pour mesurer le pH et la distribution des espèces acide-base.',
        publicationCount: 1
      }
    ];
    
    for (const method of analyticalMethods) {
      await connection.execute(
        `INSERT INTO analytical_methods (method_id, code, name, full_name, category, performance_score, resolution_score, sensitivity_score, detection_limit, capabilities, limitations, best_suited_for, description, publication_count)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE name = VALUES(name), description = VALUES(description), code = VALUES(code)`,
        [method.code, method.code, method.name, method.fullName, method.category, method.performanceScore, method.resolutionScore, method.sensitivityScore, method.detectionLimit, method.capabilities, method.limitations, method.bestSuitedFor, method.description, method.publicationCount]
      );
    }
    console.log(`  ✓ ${analyticalMethods.length} analytical methods imported\n`);
    
    // =====================================================
    // 2. IMPORT RESEARCH INSTITUTIONS
    // =====================================================
    console.log('🏛️ Importing research institutions...');
    
    const institutions = [
      {
        name: 'Portland State University',
        shortName: 'PSU',
        city: 'Portland',
        state: 'Oregon',
        country: 'USA',
        institutionType: 'university',
        department: 'Department of Chemistry',
        researchGroup: 'Strongin Lab',
        researchFocus: JSON.stringify(['Pyrolyse des terpènes', 'Chimie du vapotage', 'Dégradation thermique des cannabinoïdes', 'Chimie acide-base de la nicotine']),
        totalCitations: 400,
        publicationCount: 10,
        description: 'Institution la plus productive dans le domaine de la pyrolyse des terpènes du cannabis ET de la chimie de la nicotine. Hub transversal unique avec expertise sur les deux domaines.',
        keyContributions: 'Formation de méthacroléine et benzène lors de la pyrolyse du myrcène. Modèle de partitionnement gaz/particules de Pankow. Chimie acide-base de la nicotine.'
      },
      {
        name: 'University of Cambridge',
        shortName: 'Cambridge',
        city: 'Cambridge',
        state: null,
        country: 'UK',
        institutionType: 'university',
        department: 'Department of Engineering',
        researchGroup: null,
        researchFocus: JSON.stringify(['Caractérisation de la fumée', 'Comparaison cannabis/tabac', 'Nanoparticules']),
        totalCitations: 136,
        publicationCount: 1,
        description: 'Publication la plus citée du domaine (136 citations). Première caractérisation complète et comparative de la fumée de marijuana et de tabac.',
        keyContributions: 'Découverte que NOₓ, HCN, amines aromatiques sont 3-5× plus concentrés dans la fumée de cannabis que dans celle du tabac.'
      },
      {
        name: 'University of Alberta',
        shortName: 'Alberta',
        city: 'Edmonton',
        state: 'Alberta',
        country: 'Canada',
        institutionType: 'university',
        department: 'Mechanical Engineering, Chemistry',
        researchGroup: null,
        researchFocus: JSON.stringify(['Génie mécanique', 'Chimie analytique', 'Caractérisation de la fumée']),
        totalCitations: 136,
        publicationCount: 1,
        description: 'Approche multidisciplinaire combinant génie mécanique (aérodynamique des particules) et chimie analytique.',
        keyContributions: 'Co-auteurs de la publication Nature 2020 avec University of Cambridge.'
      },
      {
        name: 'Lawrence Berkeley National Laboratory',
        shortName: 'LBNL',
        city: 'Berkeley',
        state: 'California',
        country: 'USA',
        institutionType: 'national_lab',
        department: 'Indoor Environment Group',
        researchGroup: 'Indoor Environment Group',
        researchFocus: JSON.stringify(['Qualité de l\'air intérieur', 'Émissions de terpénoïdes', 'Exposition secondaire']),
        totalCitations: 16,
        publicationCount: 1,
        description: 'Approche de santé publique et environnementale. Équipe de 8 chercheurs avec approche multidisciplinaire.',
        keyContributions: 'Caractérisation des émissions de terpénoïdes chauffés. Impact sur la qualité de l\'air intérieur.'
      },
      {
        name: 'University of British Columbia',
        shortName: 'UBC',
        city: 'Vancouver',
        state: 'British Columbia',
        country: 'Canada',
        institutionType: 'university',
        department: 'Chemistry / Food Science',
        researchGroup: null,
        researchFocus: JSON.stringify(['Profilage terpénique avancé', 'GC×GC-TOFMS', 'Chimie analytique']),
        totalCitations: 13,
        publicationCount: 1,
        description: 'Expertise en chimie analytique avancée pour la caractérisation des profils terpéniques.',
        keyContributions: 'Profilage complet des terpènes et terpénoïdes dans différentes variétés de cannabis avec GC×GC-TOFMS.'
      }
    ];
    
    for (const inst of institutions) {
      await connection.execute(
        `INSERT INTO research_institutions (name, short_name, city, state, country, institution_type, department, research_group, research_focus, total_citations, publication_count, description, key_contributions)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE name = VALUES(name)`,
        [inst.name, inst.shortName, inst.city, inst.state, inst.country, inst.institutionType, inst.department, inst.researchGroup, inst.researchFocus, inst.totalCitations, inst.publicationCount, inst.description, inst.keyContributions]
      );
    }
    console.log(`  ✓ ${institutions.length} research institutions imported\n`);
    
    // =====================================================
    // 3. IMPORT RESEARCHERS
    // =====================================================
    console.log('👨‍🔬 Importing researchers...');
    
    const researchers = [
      {
        name: 'Meehan-Atrash, Jiries',
        firstName: 'Jiries',
        lastName: 'Meehan-Atrash',
        status: 'industry',
        statusDetails: 'Actuellement chez Bausch + Lomb',
        researchFocus: JSON.stringify(['Pyrolyse des terpènes', 'Formation de toxines', 'Dabbing', 'Aérosols de cannabis']),
        expertiseDomains: JSON.stringify(['Cannabis', 'Terpènes', 'Chimie analytique']),
        totalCitations: 200,
        publicationCount: 5,
        awards: JSON.stringify([{ name: 'ElSohly Award', year: 2020, organization: 'ICRS' }]),
        bio: 'Pionnier de la recherche sur la pyrolyse des terpènes du cannabis. Premier à identifier la formation de méthacroléine et benzène lors du dabbing. Doctorat à Portland State University sous la direction de Robert Strongin.'
      },
      {
        name: 'Strongin, Robert M.',
        firstName: 'Robert',
        lastName: 'Strongin',
        status: 'active',
        statusDetails: 'Actif (vapotage)',
        researchFocus: JSON.stringify(['Chimie du vapotage', 'Pyrolyse des terpènes', 'Dégradation thermique', 'Cannabinoïdes acétates']),
        expertiseDomains: JSON.stringify(['Cannabis', 'Tabac', 'E-cigarettes', 'Nicotine']),
        totalCitations: 300,
        publicationCount: 8,
        awards: null,
        bio: 'Professeur à Portland State University, directeur du Strongin Lab. Pionnier de la recherche sur la chimie du vapotage depuis 2013. Expert transversal nicotine-cannabinoïdes.'
      },
      {
        name: 'Pankow, James F.',
        firstName: 'James',
        lastName: 'Pankow',
        status: 'active',
        statusDetails: 'Actif (nicotine)',
        researchFocus: JSON.stringify(['Chimie acide-base de la nicotine', 'Partitionnement gaz/particules', 'E-liquides']),
        expertiseDomains: JSON.stringify(['Nicotine', 'Tabac', 'Chimie physique']),
        totalCitations: 200,
        publicationCount: 5,
        awards: null,
        bio: 'Expert mondial de la chimie acide-base de la nicotine. Développeur du modèle de partitionnement absorptif. Portland State University, Department of Chemistry & Civil Engineering.'
      },
      {
        name: 'Graves, Brian M.',
        firstName: 'Brian',
        lastName: 'Graves',
        status: 'inactive',
        statusDetails: 'Inactif (nano)',
        researchFocus: JSON.stringify(['Caractérisation de la fumée', 'Nanoparticules']),
        expertiseDomains: JSON.stringify(['Cannabis', 'Tabac', 'Ingénierie']),
        totalCitations: 136,
        publicationCount: 1,
        awards: null,
        bio: 'Co-premier auteur de la publication Nature 2020 sur la caractérisation complète de la fumée de marijuana et de tabac. University of Cambridge.'
      },
      {
        name: 'Boies, Adam M.',
        firstName: 'Adam',
        lastName: 'Boies',
        status: 'inactive',
        statusDetails: 'Inactif (nano)',
        researchFocus: JSON.stringify(['Caractérisation de la fumée', 'Ingénierie des particules']),
        expertiseDomains: JSON.stringify(['Ingénierie', 'Aérosols']),
        totalCitations: 136,
        publicationCount: 1,
        awards: null,
        bio: 'Auteur correspondant de la publication Nature 2020. Department of Engineering, University of Cambridge.'
      },
      {
        name: 'Tang, Xiaochen',
        firstName: 'Xiaochen',
        lastName: 'Tang',
        status: 'active',
        statusDetails: 'Actif (expo)',
        researchFocus: JSON.stringify(['Qualité de l\'air intérieur', 'Émissions de terpénoïdes', 'Exposition secondaire']),
        expertiseDomains: JSON.stringify(['Environnement', 'Santé publique']),
        totalCitations: 16,
        publicationCount: 1,
        awards: null,
        bio: 'Chercheur au Lawrence Berkeley National Laboratory, Indoor Environment Group. Recherche appliquée sur l\'exposition secondaire et la santé publique.'
      },
      {
        name: 'McPartland, John M.',
        firstName: 'John',
        lastName: 'McPartland',
        status: 'active',
        statusDetails: 'Actif (taxonomie)',
        researchFocus: JSON.stringify(['Taxonomie du cannabis', 'Conservation génétique', 'Landraces']),
        expertiseDomains: JSON.stringify(['Botanique', 'Taxonomie', 'Génétique']),
        totalCitations: 105,
        publicationCount: 1,
        awards: null,
        bio: 'Chercheur indépendant. Publication de référence (105 citations) pour la conservation des landraces et la compréhension de la diversité génétique du cannabis.'
      },
      {
        name: 'Kaur, Jasmeen',
        firstName: 'Jasmeen',
        lastName: 'Kaur',
        status: 'active',
        statusDetails: 'Actif (analytique)',
        researchFocus: JSON.stringify(['Profilage terpénique', 'GC×GC-TOFMS', 'Chimie analytique']),
        expertiseDomains: JSON.stringify(['Chimie analytique', 'Cannabis']),
        totalCitations: 13,
        publicationCount: 1,
        awards: null,
        bio: 'Chercheur à University of British Columbia. Expertise en profilage terpénique avancé avec GC×GC-TOFMS.'
      },
      {
        name: 'Munger, Kevin R.',
        firstName: 'Kevin',
        lastName: 'Munger',
        status: 'active',
        statusDetails: 'Actif (acétates)',
        researchFocus: JSON.stringify(['Cannabinoïdes acétates', 'Formation de cétène', 'EVALI']),
        expertiseDomains: JSON.stringify(['Cannabis', 'Chimie organique']),
        totalCitations: 7,
        publicationCount: 1,
        awards: null,
        bio: 'Chercheur au Strongin Lab, Portland State University. Découverte de la formation de cétène lors du vapotage de cannabinoïdes acétates.'
      },
      {
        name: 'McWhirter, Kevin J.',
        firstName: 'Kevin',
        lastName: 'McWhirter',
        status: 'active',
        statusDetails: 'Actif (collaborateur)',
        researchFocus: JSON.stringify(['Chimie du vapotage', 'Partitionnement gaz/particules']),
        expertiseDomains: JSON.stringify(['Cannabis', 'Nicotine', 'Chimie analytique']),
        totalCitations: 100,
        publicationCount: 4,
        awards: null,
        bio: 'Collaborateur commun entre Pankow et Strongin à Portland State University. Pont entre la recherche sur la nicotine et les cannabinoïdes.'
      },
      {
        name: 'Luo, Wentai',
        firstName: 'Wentai',
        lastName: 'Luo',
        status: 'active',
        statusDetails: 'Actif (collaborateur)',
        researchFocus: JSON.stringify(['Chimie du vapotage', 'Pyrolyse des terpènes']),
        expertiseDomains: JSON.stringify(['Cannabis', 'Nicotine', 'Chimie analytique']),
        totalCitations: 100,
        publicationCount: 5,
        awards: null,
        bio: 'Collaborateur commun entre Pankow et Strongin à Portland State University. Expertise en chimie analytique du vapotage.'
      }
    ];
    
    for (const researcher of researchers) {
      await connection.execute(
        `INSERT INTO researchers (name, first_name, last_name, status, status_details, research_focus, expertise_domains, total_citations, publication_count, awards, bio)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE name = VALUES(name)`,
        [researcher.name, researcher.firstName, researcher.lastName, researcher.status, researcher.statusDetails, researcher.researchFocus, researcher.expertiseDomains, researcher.totalCitations, researcher.publicationCount, researcher.awards, researcher.bio]
      );
    }
    console.log(`  ✓ ${researchers.length} researchers imported\n`);
    
    // =====================================================
    // 4. IMPORT RESEARCH PUBLICATIONS
    // =====================================================
    console.log('📚 Importing research publications...');
    
    const publications = [
      // Cannabis publications
      {
        refCode: 'Ref-1',
        title: 'Toxicant Formation in Dabbing: The Terpene Story',
        authors: 'Meehan-Atrash J, Luo W, Strongin RM',
        leadAuthor: 'Meehan-Atrash J',
        year: 2017,
        journal: 'ACS Omega',
        volume: '2(9)',
        pages: '6112-6117',
        doi: '10.1021/acsomega.7b01130',
        pmcId: 'PMC5623941',
        citations: 85,
        researchFocus: 'terpene_degradation',
        subjectMatter: 'cannabis',
        temperatureMin: 340,
        temperatureMax: 482,
        temperatureRange: '340-482°C',
        analytes: JSON.stringify(['Méthacroléine', 'Benzène', 'Produits de dégradation du myrcène']),
        sampleTypes: JSON.stringify(['Terpènes purs (myrcène, limonène)']),
        keyFindings: 'Premier à identifier la formation de méthacroléine et benzène lors de la pyrolyse des terpènes du cannabis.',
        advantages: JSON.stringify(['Identification précise des produits de dégradation', 'Mécanismes réactionnels']),
        limitations: JSON.stringify(['Terpènes isolés (pas de matrice cannabis complète)'])
      },
      {
        refCode: 'Ref-2',
        title: 'Aerosol Gas-Phase Components from Cannabis E-Cigarettes and Dabbing',
        authors: 'Meehan-Atrash J, Luo W, McWhirter KJ, Dennis DG, Strongin RM',
        leadAuthor: 'Meehan-Atrash J',
        year: 2019,
        journal: 'ACS Omega',
        volume: '4',
        pages: '16111-16120',
        doi: null,
        pmcId: null,
        citations: 64,
        researchFocus: 'vaporization',
        subjectMatter: 'both',
        temperatureMin: 200,
        temperatureMax: 400,
        temperatureRange: '200-400°C',
        analytes: JSON.stringify(['THC', 'Nicotine', 'VOCs', 'Terpènes']),
        sampleTypes: JSON.stringify(['Aérosols de cannabis', 'Aérosols de nicotine']),
        keyFindings: 'Comparaison directe THC vs nicotine. Les terpènes produisent plus de toxines que le THC.',
        advantages: JSON.stringify(['Comparaison directe THC vs nicotine', 'Conditions réalistes']),
        limitations: JSON.stringify(['Focus sur vapotage'])
      },
      {
        refCode: 'Ref-3',
        title: 'The influence of terpenes on the release of volatile organic compounds and active ingredients to cannabis vaping aerosols',
        authors: 'Meehan-Atrash J, Luo W, McWhirter KJ, Dennis DG, Sarlah D, Jensen RP, Afreh I, Jiang J, Barsanti KC, Ortega J, Strongin RM',
        leadAuthor: 'Meehan-Atrash J',
        year: 2021,
        journal: 'RSC Advances',
        volume: '11',
        pages: '11714-11723',
        doi: null,
        pmcId: null,
        citations: 34,
        researchFocus: 'vaporization',
        subjectMatter: 'cannabis',
        temperatureMin: 200,
        temperatureMax: 350,
        temperatureRange: '200-350°C',
        analytes: JSON.stringify(['VOCs', 'Terpènes', 'Cannabinoïdes']),
        sampleTypes: JSON.stringify(['Concentrés de cannabis', 'E-liquides']),
        keyFindings: 'Le ratio THC:terpènes affecte la libération de VOCs. Ratio 9:1 = moins de toxines.',
        advantages: JSON.stringify(['Analyse des interactions terpènes-cannabinoïdes', 'Conditions réalistes de vapotage']),
        limitations: JSON.stringify(['Focus sur vapotage (pas combustion directe)'])
      },
      {
        refCode: 'Ref-4',
        title: 'Thermal degradation of cannabinoids and cannabis terpenes',
        authors: 'Meehan-Atrash J, Luo W, Strongin RM',
        leadAuthor: 'Meehan-Atrash J',
        year: 2021,
        journal: 'Taylor & Francis',
        volume: null,
        pages: null,
        doi: null,
        pmcId: null,
        citations: 8,
        researchFocus: 'terpene_degradation',
        subjectMatter: 'cannabis',
        temperatureMin: 25,
        temperatureMax: 600,
        temperatureRange: '25-600°C',
        analytes: JSON.stringify(['THC', 'CBD', 'Terpènes majeurs', 'Produits de dégradation']),
        sampleTypes: JSON.stringify(['Cannabinoïdes purs', 'Terpènes purs']),
        keyFindings: 'Analyse thermique complète et identification des températures critiques de dégradation.',
        advantages: JSON.stringify(['Analyse thermique complète', 'Identification des températures critiques']),
        limitations: JSON.stringify(['Composés isolés'])
      },
      {
        refCode: 'Ref-5',
        title: 'Emissions from heated terpenoids present in vaporizable cannabis concentrates',
        authors: 'Tang X, Cancelada L, Rapp VH, Russell ML, Destaillats H, Lunden MM, Apte MG, Gundel LA',
        leadAuthor: 'Tang X',
        year: 2021,
        journal: 'Environmental Science & Technology',
        volume: '55(8)',
        pages: '5251-5260',
        doi: null,
        pmcId: null,
        citations: 16,
        researchFocus: 'vaporization',
        subjectMatter: 'cannabis',
        temperatureMin: 157,
        temperatureMax: 220,
        temperatureRange: '157-220°C',
        analytes: JSON.stringify(['Terpénoïdes volatils', 'Particules ultrafines', 'Émissions secondaires']),
        sampleTypes: JSON.stringify(['Concentrés de cannabis vaporisables']),
        keyFindings: 'Caractérisation des émissions de terpénoïdes chauffés et impact sur la qualité de l\'air intérieur.',
        advantages: JSON.stringify(['Mesure en temps réel (PTR-MS)', 'Caractérisation des particules', 'Qualité de l\'air']),
        limitations: JSON.stringify(['Température de vaporisation uniquement (pas de combustion)'])
      },
      {
        refCode: 'Ref-6',
        title: 'Comprehensive characterization of mainstream marijuana and tobacco smoke',
        authors: 'Graves BM, Johnson TJ, Nishida RT, Kazemimanesh M, Olfert JS, Dias RP, Savareear B, Harynuk JJ, Boies AM',
        leadAuthor: 'Graves BM',
        year: 2020,
        journal: 'Nature Scientific Reports',
        volume: '10',
        pages: '7160',
        doi: null,
        pmcId: null,
        citations: 136,
        researchFocus: 'smoke_characterization',
        subjectMatter: 'both',
        temperatureMin: 600,
        temperatureMax: 900,
        temperatureRange: '600-900°C (combustion naturelle)',
        analytes: JSON.stringify(['Composés organiques volatils', 'Particules', 'NOₓ', 'HCN', 'Amines aromatiques', 'CO', 'CO₂']),
        sampleTypes: JSON.stringify(['Fumée de marijuana (joints ACES)', 'Fumée de tabac (3R4F)']),
        keyFindings: 'NOₓ, HCN, amines aromatiques sont 3-5× plus concentrés dans la fumée de cannabis que dans celle du tabac.',
        advantages: JSON.stringify(['Caractérisation la plus complète', 'Comparaison directe marijuana/tabac', 'Multiples techniques analytiques']),
        limitations: JSON.stringify(['Une seule variété de cannabis testée (ACES sativa)'])
      },
      {
        refCode: 'Ref-7',
        title: 'A classification of endangered high-THC cannabis domesticates and their wild relatives',
        authors: 'McPartland JM et al.',
        leadAuthor: 'McPartland JM',
        year: 2020,
        journal: 'PhytoKeys',
        volume: null,
        pages: null,
        doi: null,
        pmcId: null,
        citations: 105,
        researchFocus: 'taxonomy',
        subjectMatter: 'cannabis',
        temperatureMin: null,
        temperatureMax: null,
        temperatureRange: 'N/A (taxonomie)',
        analytes: JSON.stringify(['Séquences ADN', 'Caractères morphologiques', 'Profils cannabinoïdes']),
        sampleTypes: JSON.stringify(['Échantillons de cannabis (herbier, vivants)']),
        keyFindings: 'Classification taxonomique rigoureuse des variétés de cannabis à haut THC en danger critique d\'extinction.',
        advantages: JSON.stringify(['Classification taxonomique rigoureuse', 'Conservation des germplasmes']),
        limitations: JSON.stringify(['Pas d\'analyse de combustion'])
      },
      {
        refCode: 'Ref-8',
        title: 'Comprehensive profiling of terpenes and terpenoids in different cannabis strains using GC×GC-TOFMS',
        authors: 'Kaur J, Sun N, Hill JE',
        leadAuthor: 'Kaur J',
        year: 2023,
        journal: 'Separations',
        volume: null,
        pages: null,
        doi: null,
        pmcId: null,
        citations: 13,
        researchFocus: 'analytical_methods',
        subjectMatter: 'cannabis',
        temperatureMin: null,
        temperatureMax: null,
        temperatureRange: 'Température ambiante (profilage pré-combustion)',
        analytes: JSON.stringify(['Terpènes', 'Terpénoïdes', 'Profils complets de variétés']),
        sampleTypes: JSON.stringify(['Fleurs de cannabis (différentes variétés)']),
        keyFindings: 'Profilage complet des terpènes et terpénoïdes avec résolution chromatographique exceptionnelle.',
        advantages: JSON.stringify(['Résolution chromatographique exceptionnelle', 'Séparation de composés co-élués', 'Identification de terpènes mineurs']),
        limitations: JSON.stringify(['Pas d\'analyse de combustion (profils pré-combustion uniquement)'])
      },
      // Nicotine publications (Pankow)
      {
        refCode: 'Ref-N1',
        title: 'Percent Free Base Nicotine in Tobacco Smoke',
        authors: 'Pankow JF',
        leadAuthor: 'Pankow JF',
        year: 2003,
        journal: 'Chemical Research in Toxicology',
        volume: null,
        pages: null,
        doi: null,
        pmcId: null,
        citations: 139,
        researchFocus: 'analytical_methods',
        subjectMatter: 'tobacco',
        temperatureMin: null,
        temperatureMax: null,
        temperatureRange: 'N/A',
        analytes: JSON.stringify(['Nicotine base libre', 'Nicotine protonée']),
        sampleTypes: JSON.stringify(['Fumée de tabac']),
        keyFindings: 'La nicotine existe sous deux formes dans la fumée : base libre (volatile, biodisponible) et protonée (ionisée). Le pH contrôle la biodisponibilité.',
        advantages: JSON.stringify(['Méthodologie acide-base applicable aux cannabinoïdes', 'Fondamental pour comprendre la biodisponibilité']),
        limitations: JSON.stringify(['Focus sur nicotine uniquement'])
      },
      {
        refCode: 'Ref-N2',
        title: 'Gas/Particle Partitioning of Nicotine in E-Cigarettes',
        authors: 'Pankow JF, Kim K, Luo W, McWhirter KJ, Peyton DH',
        leadAuthor: 'Pankow JF',
        year: 2018,
        journal: 'Chemical Research in Toxicology',
        volume: null,
        pages: null,
        doi: null,
        pmcId: null,
        citations: 43,
        researchFocus: 'vaporization',
        subjectMatter: 'tobacco',
        temperatureMin: null,
        temperatureMax: null,
        temperatureRange: 'Conditions de vapotage',
        analytes: JSON.stringify(['Nicotine', 'Constantes de partitionnement']),
        sampleTypes: JSON.stringify(['E-liquides 50/50 PG/glycérol']),
        keyFindings: 'Modèle de partitionnement gaz/particules applicable aux cannabinoïdes. La répartition dépend de la température, du TPM et du pH.',
        advantages: JSON.stringify(['Modèle de partitionnement applicable aux cannabinoïdes', 'Prédiction de la biodisponibilité']),
        limitations: JSON.stringify(['Focus sur nicotine'])
      },
      {
        refCode: 'Ref-N3',
        title: 'Free-Base Nicotine Fraction in E-Cigarettes: Non-Aqueous vs Aqueous',
        authors: 'Pankow JF, Luo W, McWhirter KJ, Motti V, Tavakoli AD, Peyton DH',
        leadAuthor: 'Pankow JF',
        year: 2020,
        journal: 'Chemical Research in Toxicology',
        volume: null,
        pages: null,
        doi: null,
        pmcId: null,
        citations: 19,
        researchFocus: 'vaporization',
        subjectMatter: 'tobacco',
        temperatureMin: null,
        temperatureMax: null,
        temperatureRange: 'Conditions de vapotage',
        analytes: JSON.stringify(['Nicotine base libre', 'Nicotine protonée']),
        sampleTypes: JSON.stringify(['E-liquides non-aqueux', 'E-liquides aqueux']),
        keyFindings: 'L\'ajout d\'eau aux e-liquides modifie radicalement la chimie acide-base de la nicotine, affectant la biodisponibilité.',
        advantages: JSON.stringify(['Chimie des e-liquides commune nicotine/cannabinoïdes']),
        limitations: JSON.stringify(['Focus sur nicotine'])
      },
      // Cannabinoid acetates (EVALI)
      {
        refCode: 'Ref-A1',
        title: 'Vaping Cannabinoid Acetates Leads to Ketene Formation',
        authors: 'Munger KR, Jensen RP, Strongin RM',
        leadAuthor: 'Munger KR',
        year: 2022,
        journal: 'Chemical Research in Toxicology',
        volume: null,
        pages: null,
        doi: null,
        pmcId: null,
        citations: 7,
        researchFocus: 'vaporization',
        subjectMatter: 'cannabis',
        temperatureMin: 200,
        temperatureMax: 400,
        temperatureRange: '200-400°C',
        analytes: JSON.stringify(['Δ8-THC acétate', 'CBN acétate', 'CBD acétate', 'Cétène']),
        sampleTypes: JSON.stringify(['Cannabinoïdes acétates']),
        keyFindings: 'Le vapotage de cannabinoïdes acétates produit du cétène, un gaz toxique hautement réactif. Lien avec l\'épidémie EVALI.',
        advantages: JSON.stringify(['Découverte majeure pour la santé publique', 'Lien avec EVALI']),
        limitations: JSON.stringify(['Composés isolés'])
      }
    ];
    
    for (const pub of publications) {
      await connection.execute(
        `INSERT INTO research_publications (ref_code, title, authors, lead_author, year, journal, volume, pages, doi, pmc_id, citations, research_focus, subject_matter, temperature_min, temperature_max, temperature_range, analytes, sample_types, key_findings, advantages, limitations)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE title = VALUES(title)`,
        [pub.refCode, pub.title, pub.authors, pub.leadAuthor, pub.year, pub.journal, pub.volume, pub.pages, pub.doi, pub.pmcId, pub.citations, pub.researchFocus, pub.subjectMatter, pub.temperatureMin, pub.temperatureMax, pub.temperatureRange, pub.analytes, pub.sampleTypes, pub.keyFindings, pub.advantages, pub.limitations]
      );
    }
    console.log(`  ✓ ${publications.length} research publications imported\n`);
    
    console.log('✅ Research data import completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - ${analyticalMethods.length} analytical methods`);
    console.log(`   - ${institutions.length} research institutions`);
    console.log(`   - ${researchers.length} researchers`);
    console.log(`   - ${publications.length} publications (cannabis + nicotine + transversal)`);
    
  } catch (error) {
    console.error('❌ Error during import:', error);
    throw error;
  } finally {
    await connection.end();
  }
}

importData().catch(console.error);
