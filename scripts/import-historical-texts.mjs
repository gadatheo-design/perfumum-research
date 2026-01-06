/**
 * Script d'import des textes historiques pour PERFUMUM
 * Sources : Papyrus égyptiens, textes chinois, manuscrits arabes
 */

import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('DATABASE_URL non définie');
  process.exit(1);
}

// Données des manuscrits historiques
const manuscripts = [
  // Sources égyptiennes
  {
    manuscriptId: 'MS-EGY-001',
    title: 'Papyrus Ebers',
    region: 'Égypte - Thèbes',
    dateRange: '-1550',
    language: 'Égyptien hiératique',
    license: 'CC0',
    ocrStatus: 'completed',
    tags: JSON.stringify(['parfum', 'encens', 'kyphi', 'médecine', 'rituel']),
    notes: 'Plus ancien traité médical égyptien contenant des recettes d\'encens et de préparations aromatiques. Contient la première recette connue du Kyphi.',
    axisId: 'AX2_ETHNOBOTANY_COMP'
  },
  {
    manuscriptId: 'MS-EGY-002',
    title: 'Papyrus Harris I',
    region: 'Égypte - Thèbes',
    dateRange: '-1150',
    language: 'Égyptien hiératique',
    license: 'CC0',
    ocrStatus: 'completed',
    tags: JSON.stringify(['offrandes', 'temple', 'aromates', 'commerce']),
    notes: 'Liste des offrandes aux temples sous Ramsès III, incluant aromates et encens. Documentation du commerce égyptien des matières aromatiques.',
    axisId: 'AX2_ETHNOBOTANY_COMP'
  },
  {
    manuscriptId: 'MS-EGY-003',
    title: 'Papyrus Edwin Smith',
    region: 'Égypte',
    dateRange: '-1600',
    language: 'Égyptien hiératique',
    license: 'CC0',
    ocrStatus: 'completed',
    tags: JSON.stringify(['chirurgie', 'cosmétique', 'aromates', 'soins']),
    notes: 'Traité chirurgical mentionnant des préparations aromatiques à base de natron, sel et miel pour les soins corporels.',
    axisId: 'AX2_ETHNOBOTANY_COMP'
  },
  {
    manuscriptId: 'MS-EGY-004',
    title: 'Inscriptions du Temple d\'Edfou',
    region: 'Égypte - Edfou',
    dateRange: '-237',
    language: 'Égyptien hiéroglyphique',
    license: 'CC0',
    ocrStatus: 'completed',
    tags: JSON.stringify(['encens', 'rituel', 'temple', 'Horus', 'fumigation']),
    notes: 'Recettes secrètes d\'encens gravées sur les murs du temple d\'Horus. Documentation des rituels de fumigation.',
    axisId: 'AX2_ETHNOBOTANY_COMP'
  },
  
  // Sources chinoises
  {
    manuscriptId: 'MS-CHN-001',
    title: 'Shennong Bencao Jing (神農本草經)',
    region: 'Chine',
    dateRange: '-200 à 200',
    language: 'Chinois classique',
    license: 'CC0',
    ocrStatus: 'completed',
    tags: JSON.stringify(['pharmacopée', 'herbes', 'aromates', 'médecine', 'Han']),
    notes: 'Premier traité de pharmacopée chinoise classant les herbes médicinales et aromatiques en trois classes. Fondement de la médecine traditionnelle chinoise.',
    axisId: 'AX2_ETHNOBOTANY_COMP'
  },
  {
    manuscriptId: 'MS-CHN-002',
    title: 'Ben Cao Gang Mu (本草綱目)',
    region: 'Chine - Ming',
    dateRange: '1578',
    language: 'Chinois classique',
    license: 'CC0',
    ocrStatus: 'completed',
    tags: JSON.stringify(['encyclopédie', 'herbes', 'bois parfumés', 'Li Shizhen']),
    notes: 'Encyclopédie médicale monumentale de Li Shizhen en 52 volumes. Volumes III et VII consacrés aux herbes parfumées et bois aromatiques.',
    axisId: 'AX2_ETHNOBOTANY_COMP'
  },
  {
    manuscriptId: 'MS-CHN-003',
    title: 'Xiangpu (香譜) - Traité des Parfums',
    region: 'Chine - Song',
    dateRange: '1073',
    language: 'Chinois classique',
    license: 'Unknown',
    ocrStatus: 'queued',
    tags: JSON.stringify(['encens', 'parfum', 'Song', 'recettes']),
    notes: 'Traité sur l\'encens et les parfums de la dynastie Song. Documentation des pratiques de fumigation et des recettes d\'encens composé.',
    axisId: 'AX2_ETHNOBOTANY_COMP'
  },
  
  // Sources arabes
  {
    manuscriptId: 'MS-ARB-001',
    title: 'Kitāb Kīmiyāʾ al-ʿIṭr wa-l-Taṣʿīdāt',
    region: 'Irak - Bagdad',
    dateRange: '850',
    language: 'Arabe classique',
    license: 'CC0',
    ocrStatus: 'completed',
    tags: JSON.stringify(['parfum', 'distillation', 'Al-Kindi', 'eau de rose', 'recettes']),
    notes: 'Premier manuel systématique de parfumerie par Al-Kindi. Contient 107 recettes, instructions de distillation et techniques de production d\'eau de rose.',
    axisId: 'AX2_ETHNOBOTANY_COMP'
  },
  {
    manuscriptId: 'MS-ARB-002',
    title: 'Al-Qānūn fī al-Ṭibb (Canon de la Médecine)',
    region: 'Perse - Hamadan',
    dateRange: '1025',
    language: 'Arabe classique',
    license: 'CC0',
    ocrStatus: 'completed',
    tags: JSON.stringify(['médecine', 'aromates', 'Avicenne', 'distillation', 'rose']),
    notes: 'Encyclopédie médicale d\'Ibn Sina (Avicenne) incluant l\'usage des aromates et le perfectionnement de la distillation à la vapeur.',
    axisId: 'AX2_ETHNOBOTANY_COMP'
  },
  {
    manuscriptId: 'MS-ARB-003',
    title: 'Kitab al-Tasrif - Livre XIX',
    region: 'Al-Andalus - Cordoue',
    dateRange: '1000',
    language: 'Arabe classique',
    license: 'CC0',
    ocrStatus: 'completed',
    tags: JSON.stringify(['cosmétique', 'parfum', 'Al-Zahrawi', 'soins']),
    notes: 'Traité de cosmétique et médecine esthétique d\'Al-Zahrawi (Albucasis). Manuel de parfums, remèdes aromatiques et soins du corps.',
    axisId: 'AX2_ETHNOBOTANY_COMP'
  }
];

// Fragments de texte historiques
const textFragments = [
  // Fragments égyptiens
  {
    fragmentId: 'TF-EGY-001',
    manuscriptId: 'MS-EGY-001',
    language: 'Égyptien hiératique',
    originalText: 'Recette du Kyphi sacré pour les offrandes au dieu Râ',
    translationFr: 'Prendre de la myrrhe, de l\'encens, de l\'écorce de bois, des herbes moulues, de la résine de mastic, du pin, de l\'herbe de chameau, de la menthe, de l\'acore odorant et de la cannelle. Mélanger avec du vin et du miel. Laisser macérer pendant neuf jours.',
    translationEn: 'Take myrrh, frankincense, wood bark, ground herbs, mastic resin, pine, camel grass, mint, sweet flag, and cinnamon. Mix with wine and honey. Let macerate for nine days.',
    entities: JSON.stringify(['myrrhe', 'encens', 'cannelle', 'mastic', 'acore', 'menthe']),
    evidenceLevel: 'confirmed',
    notes: 'Recette du Kyphi du Papyrus Ebers - la plus ancienne recette d\'encens composé connue.',
    axisId: 'AX2_ETHNOBOTANY_COMP'
  },
  {
    fragmentId: 'TF-EGY-002',
    manuscriptId: 'MS-EGY-004',
    language: 'Égyptien hiéroglyphique',
    originalText: 'snṯr n Rꜥ - Encens pour Râ',
    translationFr: 'Faire de l\'encens de différentes sortes d\'herbes douces pour Râ. L\'encens purifie le temple et réjouit les dieux.',
    translationEn: 'Make incense of different kinds of sweet herbs for Ra. The incense purifies the temple and pleases the gods.',
    entities: JSON.stringify(['encens', 'herbes', 'temple', 'Râ']),
    evidenceLevel: 'confirmed',
    notes: 'Inscription du temple d\'Edfou décrivant l\'usage rituel de l\'encens.',
    axisId: 'AX2_ETHNOBOTANY_COMP'
  },
  
  // Fragments chinois
  {
    fragmentId: 'TF-CHN-001',
    manuscriptId: 'MS-CHN-001',
    language: 'Chinois classique',
    originalText: '木香，味辛，溫。主邪氣，辟毒疫溫鬼',
    translationFr: 'Mu Xiang (Costus), saveur piquante, nature tiède. Traite les énergies perverses, éloigne les poisons, les épidémies et les esprits malfaisants.',
    translationEn: 'Mu Xiang (Costus), pungent flavor, warm nature. Treats perverse energies, repels poisons, epidemics and malevolent spirits.',
    entities: JSON.stringify(['Mu Xiang', 'costus', 'aromate', 'médecine']),
    evidenceLevel: 'confirmed',
    notes: 'Classification du Mu Xiang dans le Shennong Bencao Jing comme herbe de classe supérieure.',
    axisId: 'AX2_ETHNOBOTANY_COMP'
  },
  {
    fragmentId: 'TF-CHN-002',
    manuscriptId: 'MS-CHN-002',
    language: 'Chinois classique',
    originalText: '沉香，氣味辛，微溫，無毒',
    translationFr: 'Bois d\'agar (Chenxiang), saveur piquante, légèrement tiède, non toxique. Le meilleur provient des régions du sud. Il coule dans l\'eau, d\'où son nom "bois qui coule".',
    translationEn: 'Agarwood (Chenxiang), pungent flavor, slightly warm, non-toxic. The best comes from southern regions. It sinks in water, hence its name "sinking wood".',
    entities: JSON.stringify(['bois d\'agar', 'chenxiang', 'aromate', 'bois parfumé']),
    evidenceLevel: 'confirmed',
    notes: 'Description du bois d\'agar dans le Ben Cao Gang Mu de Li Shizhen.',
    axisId: 'AX2_ETHNOBOTANY_COMP'
  },
  {
    fragmentId: 'TF-CHN-003',
    manuscriptId: 'MS-CHN-003',
    language: 'Chinois classique',
    originalText: '每香皆藥',
    translationFr: 'Chaque parfum est un médicament.',
    translationEn: 'Every perfume is a medicine.',
    entities: JSON.stringify(['parfum', 'médecine', 'philosophie']),
    evidenceLevel: 'confirmed',
    notes: 'Principe fondamental de la tradition chinoise de l\'encens, unissant parfumerie et médecine.',
    axisId: 'AX2_ETHNOBOTANY_COMP'
  },
  
  // Fragments arabes
  {
    fragmentId: 'TF-ARB-001',
    manuscriptId: 'MS-ARB-001',
    language: 'Arabe classique',
    originalText: 'كتاب كيمياء العطر والتصعيدات',
    translationFr: 'Livre de la chimie du parfum et des distillations. Ce traité contient 107 recettes pour les huiles parfumées, les onguents, les eaux aromatiques et les substituts pour les ingrédients coûteux.',
    translationEn: 'Book of the Chemistry of Perfume and Distillations. This treatise contains 107 recipes for fragrant oils, unguents, aromatic waters, and substitutes for costly ingredients.',
    entities: JSON.stringify(['parfum', 'distillation', 'huiles', 'eaux aromatiques']),
    evidenceLevel: 'confirmed',
    notes: 'Introduction du Kitab Kimiya al-Itr d\'Al-Kindi, premier manuel systématique de parfumerie.',
    axisId: 'AX2_ETHNOBOTANY_COMP'
  },
  {
    fragmentId: 'TF-ARB-002',
    manuscriptId: 'MS-ARB-001',
    language: 'Arabe classique',
    originalText: 'ماء الورد بالتقطير',
    translationFr: 'Eau de rose par distillation : Prendre des pétales de rose fraîche, les placer dans l\'alambic avec de l\'eau pure. Chauffer doucement jusqu\'à ce que la vapeur s\'élève et se condense. L\'eau qui en résulte est l\'eau de rose.',
    translationEn: 'Rose water by distillation: Take fresh rose petals, place them in the alembic with pure water. Heat gently until the vapor rises and condenses. The resulting water is rose water.',
    entities: JSON.stringify(['eau de rose', 'distillation', 'alambic', 'rose']),
    evidenceLevel: 'confirmed',
    notes: 'Méthode de production d\'eau de rose décrite par Al-Kindi, l\'une des premières documentations de la distillation des fleurs.',
    axisId: 'AX2_ETHNOBOTANY_COMP'
  },
  {
    fragmentId: 'TF-ARB-003',
    manuscriptId: 'MS-ARB-002',
    language: 'Arabe classique',
    originalText: 'تقطير الزهور بالبخار',
    translationFr: 'Distillation des fleurs à la vapeur : La méthode perfectionnée consiste à faire passer la vapeur d\'eau à travers les pétales de rose de Damas, capturant ainsi leur essence sans les brûler.',
    translationEn: 'Steam distillation of flowers: The perfected method consists of passing steam through Damascus rose petals, thus capturing their essence without burning them.',
    entities: JSON.stringify(['distillation', 'vapeur', 'rose de Damas', 'essence']),
    evidenceLevel: 'confirmed',
    notes: 'Perfectionnement de la distillation à la vapeur par Ibn Sina (Avicenne), innovation majeure pour la parfumerie.',
    axisId: 'AX2_ETHNOBOTANY_COMP'
  },
  {
    fragmentId: 'TF-ARB-004',
    manuscriptId: 'MS-ARB-003',
    language: 'Arabe classique',
    originalText: 'في الطيب والعطور',
    translationFr: 'Sur les parfums et les aromates : Les parfums sont composés de substances aromatiques mélangées selon des proportions précises. Ils servent à embellir le corps, à purifier l\'air et à soigner certaines maladies.',
    translationEn: 'On perfumes and aromatics: Perfumes are composed of aromatic substances mixed in precise proportions. They serve to beautify the body, purify the air, and treat certain diseases.',
    entities: JSON.stringify(['parfum', 'aromates', 'cosmétique', 'médecine']),
    evidenceLevel: 'confirmed',
    notes: 'Extrait du Livre XIX du Kitab al-Tasrif d\'Al-Zahrawi sur la cosmétique.',
    axisId: 'AX2_ETHNOBOTANY_COMP'
  }
];

// Routes commerciales historiques
const tradeRoutes = [
  {
    routeId: 'TR-001',
    name: 'Route de l\'Encens',
    timeStart: -1000,
    timeEnd: 200,
    nodes: JSON.stringify([
      { place: 'Dhofar (Oman)', lat: 17.0, lon: 54.0, type: 'origin' },
      { place: 'Hadramaout (Yémen)', lat: 15.5, lon: 48.5, type: 'hub' },
      { place: 'Shabwa', lat: 15.4, lon: 47.0, type: 'hub' },
      { place: 'Ma\'rib', lat: 15.4, lon: 45.3, type: 'hub' },
      { place: 'Pétra', lat: 30.3, lon: 35.4, type: 'hub' },
      { place: 'Gaza', lat: 31.5, lon: 34.5, type: 'destination' },
      { place: 'Alexandrie', lat: 31.2, lon: 29.9, type: 'destination' }
    ]),
    materials: JSON.stringify(['encens (oliban)', 'myrrhe', 'cannelle', 'cassia']),
    notes: 'Route terrestre principale pour le commerce de l\'encens entre l\'Arabie du Sud et la Méditerranée. Contrôlée successivement par les Sabéens, les Nabatéens et les Romains.',
    sources: JSON.stringify(['Pline l\'Ancien, Historia Naturalis', 'Strabon, Géographie']),
    axisId: 'AX2_ETHNOBOTANY_COMP'
  },
  {
    routeId: 'TR-002',
    name: 'Route de la Soie - Branche des Aromates',
    timeStart: -130,
    timeEnd: 1450,
    nodes: JSON.stringify([
      { place: 'Xi\'an (Chang\'an)', lat: 34.3, lon: 108.9, type: 'origin' },
      { place: 'Dunhuang', lat: 40.1, lon: 94.7, type: 'hub' },
      { place: 'Kashgar', lat: 39.5, lon: 76.0, type: 'hub' },
      { place: 'Samarcande', lat: 39.7, lon: 66.9, type: 'hub' },
      { place: 'Bagdad', lat: 33.3, lon: 44.4, type: 'hub' },
      { place: 'Constantinople', lat: 41.0, lon: 28.9, type: 'destination' },
      { place: 'Venise', lat: 45.4, lon: 12.3, type: 'destination' }
    ]),
    materials: JSON.stringify(['musc', 'camphre', 'bois de santal', 'bois d\'agar', 'épices']),
    notes: 'Route terrestre reliant la Chine à la Méditerranée. Le musc et le camphre chinois étaient particulièrement prisés dans le monde arabe et européen.',
    sources: JSON.stringify(['Marco Polo, Il Milione', 'Ibn Battuta, Rihla']),
    axisId: 'AX2_ETHNOBOTANY_COMP'
  },
  {
    routeId: 'TR-003',
    name: 'Route Maritime des Épices',
    timeStart: 100,
    timeEnd: 1500,
    nodes: JSON.stringify([
      { place: 'Malacca', lat: 2.2, lon: 102.2, type: 'origin' },
      { place: 'Sumatra', lat: 0.5, lon: 101.4, type: 'hub' },
      { place: 'Ceylan (Sri Lanka)', lat: 7.9, lon: 80.6, type: 'hub' },
      { place: 'Calicut', lat: 11.3, lon: 75.8, type: 'hub' },
      { place: 'Aden', lat: 12.8, lon: 45.0, type: 'hub' },
      { place: 'Alexandrie', lat: 31.2, lon: 29.9, type: 'destination' },
      { place: 'Venise', lat: 45.4, lon: 12.3, type: 'destination' }
    ]),
    materials: JSON.stringify(['poivre', 'clou de girofle', 'muscade', 'bois d\'agar', 'benjoin']),
    notes: 'Route maritime reliant l\'Asie du Sud-Est à la Méditerranée via l\'océan Indien. Les marchands arabes dominaient ce commerce avant l\'arrivée des Portugais.',
    sources: JSON.stringify(['Périple de la mer Érythrée', 'Al-Idrisi, Nuzhat al-Mushtaq']),
    axisId: 'AX2_ETHNOBOTANY_COMP'
  },
  {
    routeId: 'TR-004',
    name: 'Route du Nil - Commerce Égyptien',
    timeStart: -3000,
    timeEnd: -30,
    nodes: JSON.stringify([
      { place: 'Pount (Somalie/Érythrée)', lat: 11.5, lon: 43.0, type: 'origin' },
      { place: 'Mer Rouge', lat: 20.0, lon: 38.0, type: 'transit' },
      { place: 'Coptos', lat: 26.0, lon: 32.8, type: 'hub' },
      { place: 'Thèbes', lat: 25.7, lon: 32.6, type: 'hub' },
      { place: 'Memphis', lat: 29.8, lon: 31.3, type: 'destination' }
    ]),
    materials: JSON.stringify(['encens', 'myrrhe', 'ébène', 'ivoire', 'or']),
    notes: 'Route commerciale égyptienne vers le pays de Pount, source d\'encens et de myrrhe pour les temples. Expéditions documentées dès la Ve dynastie.',
    sources: JSON.stringify(['Temple de Deir el-Bahari', 'Papyrus Harris I']),
    axisId: 'AX2_ETHNOBOTANY_COMP'
  }
];

// Connexions pour le graphe (research_edges)
const researchEdges = [
  // Connexions plantes-routes
  { fromType: 'plant', fromId: 'boswellia', toType: 'route', toId: 'TR-001', edgeType: 'traded_on', weight: 1.0, confidence: 0.95, notes: 'L\'encens (Boswellia) était le principal produit de la Route de l\'Encens' },
  { fromType: 'plant', fromId: 'commiphora', toType: 'route', toId: 'TR-001', edgeType: 'traded_on', weight: 0.9, confidence: 0.95, notes: 'La myrrhe (Commiphora) accompagnait l\'encens sur cette route' },
  { fromType: 'plant', fromId: 'santalum', toType: 'route', toId: 'TR-002', edgeType: 'traded_on', weight: 0.85, confidence: 0.9, notes: 'Le bois de santal était transporté via la Route de la Soie' },
  { fromType: 'plant', fromId: 'aquilaria', toType: 'route', toId: 'TR-003', edgeType: 'traded_on', weight: 0.95, confidence: 0.9, notes: 'Le bois d\'agar était un produit majeur de la Route Maritime des Épices' },
  
  // Connexions manuscrits-plantes
  { fromType: 'manuscript', fromId: 'MS-EGY-001', toType: 'plant', toId: 'boswellia', edgeType: 'mentions', weight: 1.0, confidence: 0.95, notes: 'Le Papyrus Ebers mentionne l\'encens dans la recette du Kyphi' },
  { fromType: 'manuscript', fromId: 'MS-ARB-001', toType: 'plant', toId: 'rosa', edgeType: 'mentions', weight: 1.0, confidence: 0.95, notes: 'Al-Kindi décrit la distillation de l\'eau de rose' },
  { fromType: 'manuscript', fromId: 'MS-CHN-002', toType: 'plant', toId: 'aquilaria', edgeType: 'mentions', weight: 1.0, confidence: 0.95, notes: 'Le Ben Cao Gang Mu documente le bois d\'agar (chenxiang)' },
  
  // Connexions techniques
  { fromType: 'manuscript', fromId: 'MS-ARB-001', toType: 'technique', toId: 'distillation', edgeType: 'describes', weight: 1.0, confidence: 0.95, notes: 'Premier manuel documentant la distillation des parfums' },
  { fromType: 'manuscript', fromId: 'MS-ARB-002', toType: 'technique', toId: 'steam_distillation', edgeType: 'describes', weight: 1.0, confidence: 0.95, notes: 'Avicenne perfectionne la distillation à la vapeur' },
  
  // Connexions civilisations-routes
  { fromType: 'civilization', fromId: 'egypt', toType: 'route', toId: 'TR-004', edgeType: 'controlled', weight: 1.0, confidence: 0.95, notes: 'L\'Égypte contrôlait la route du Nil vers Pount' },
  { fromType: 'civilization', fromId: 'nabateans', toType: 'route', toId: 'TR-001', edgeType: 'controlled', weight: 0.9, confidence: 0.9, notes: 'Les Nabatéens contrôlaient Pétra, carrefour de la Route de l\'Encens' },
  { fromType: 'civilization', fromId: 'arabs', toType: 'route', toId: 'TR-003', edgeType: 'controlled', weight: 0.85, confidence: 0.9, notes: 'Les marchands arabes dominaient la Route Maritime des Épices' }
];

async function importData() {
  const connection = await mysql.createConnection(DATABASE_URL);
  
  try {
    console.log('🔗 Connexion à la base de données...');
    
    // Import des manuscrits
    console.log('\\n📜 Import des manuscrits historiques...');
    for (const ms of manuscripts) {
      const existing = await connection.execute(
        'SELECT id FROM perfumum_manuscripts WHERE manuscript_id = ?',
        [ms.manuscriptId]
      );
      
      if (existing[0].length === 0) {
        await connection.execute(
          `INSERT INTO perfumum_manuscripts 
           (manuscript_id, title, region, date_range, language, license, ocr_status, tags, notes, axis_id)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [ms.manuscriptId, ms.title, ms.region, ms.dateRange, ms.language, 
           ms.license, ms.ocrStatus, ms.tags, ms.notes, ms.axisId]
        );
        console.log(`  ✅ ${ms.title}`);
      } else {
        console.log(`  ⏭️  ${ms.title} (existe déjà)`);
      }
    }
    
    // Import des fragments de texte
    console.log('\\n📝 Import des fragments de texte...');
    for (const tf of textFragments) {
      const existing = await connection.execute(
        'SELECT id FROM text_fragments WHERE fragment_id = ?',
        [tf.fragmentId]
      );
      
      if (existing[0].length === 0) {
        await connection.execute(
          `INSERT INTO text_fragments 
           (fragment_id, manuscript_id, language, original_text, translation_fr, translation_en, entities, evidence_level, notes, axis_id)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [tf.fragmentId, tf.manuscriptId, tf.language, tf.originalText, 
           tf.translationFr, tf.translationEn, tf.entities, tf.evidenceLevel, tf.notes, tf.axisId]
        );
        console.log(`  ✅ ${tf.fragmentId}`);
      } else {
        console.log(`  ⏭️  ${tf.fragmentId} (existe déjà)`);
      }
    }
    
    // Import des routes commerciales
    console.log('\\n🛤️  Import des routes commerciales...');
    for (const tr of tradeRoutes) {
      const existing = await connection.execute(
        'SELECT id FROM trade_routes WHERE route_id = ?',
        [tr.routeId]
      );
      
      if (existing[0].length === 0) {
        await connection.execute(
          `INSERT INTO trade_routes 
           (route_id, name, time_start, time_end, nodes, materials, notes, sources, axis_id)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [tr.routeId, tr.name, tr.timeStart, tr.timeEnd, tr.nodes, 
           tr.materials, tr.notes, tr.sources, tr.axisId]
        );
        console.log(`  ✅ ${tr.name}`);
      } else {
        console.log(`  ⏭️  ${tr.name} (existe déjà)`);
      }
    }
    
    // Import des connexions (research_edges)
    console.log('\\n🔗 Import des connexions du graphe...');
    for (const edge of researchEdges) {
      const existing = await connection.execute(
        'SELECT id FROM research_edges WHERE from_type = ? AND from_id = ? AND to_type = ? AND to_id = ?',
        [edge.fromType, edge.fromId, edge.toType, edge.toId]
      );
      
      if (existing[0].length === 0) {
        await connection.execute(
          `INSERT INTO research_edges 
           (from_type, from_id, to_type, to_id, edge_type, weight, confidence, notes)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [edge.fromType, edge.fromId, edge.toType, edge.toId, 
           edge.edgeType, edge.weight, edge.confidence, edge.notes]
        );
        console.log(`  ✅ ${edge.fromId} → ${edge.toId}`);
      } else {
        console.log(`  ⏭️  ${edge.fromId} → ${edge.toId} (existe déjà)`);
      }
    }
    
    console.log('\\n✅ Import terminé avec succès!');
    
    // Afficher les statistiques
    const [msCount] = await connection.execute('SELECT COUNT(*) as count FROM perfumum_manuscripts');
    const [tfCount] = await connection.execute('SELECT COUNT(*) as count FROM text_fragments');
    const [trCount] = await connection.execute('SELECT COUNT(*) as count FROM trade_routes');
    const [edgeCount] = await connection.execute('SELECT COUNT(*) as count FROM research_edges');
    
    console.log('\\n📊 Statistiques:');
    console.log(`  - Manuscrits: ${msCount[0].count}`);
    console.log(`  - Fragments de texte: ${tfCount[0].count}`);
    console.log(`  - Routes commerciales: ${trCount[0].count}`);
    console.log(`  - Connexions du graphe: ${edgeCount[0].count}`);
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'import:', error);
    throw error;
  } finally {
    await connection.end();
  }
}

importData();
