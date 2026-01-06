/**
 * Script pour ajouter des données de test pour la bibliographie et les axes de recherche
 * PERFUMUM Research Project
 */

import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import { sql } from 'drizzle-orm';

const DATABASE_URL = process.env.DATABASE_URL;

async function main() {
  console.log('🔬 Ajout des données de test pour PERFUMUM...\n');
  
  const connection = await mysql.createConnection(DATABASE_URL);
  const db = drizzle(connection);
  
  // ============================================================================
  // AXES DE RECHERCHE
  // ============================================================================
  
  console.log('📚 Création des axes de recherche...');
  
  const researchAxes = [
    {
      axisCode: 'AX1',
      name: 'Chimie des Terpènes',
      subtitle: 'Étude des composés terpéniques dans les matières premières naturelles',
      description: 'Cet axe explore la diversité chimique des terpènes présents dans les huiles essentielles et absolues. Les terpènes constituent la base de nombreux parfums naturels et leur compréhension est essentielle pour la création olfactive.',
      objectives: '1. Cartographier les profils terpéniques des principales matières premières\n2. Identifier les synergies entre terpènes\n3. Comprendre les variations chémotypiques',
      methodology: 'Analyse GC-MS, chromatographie, études comparatives',
      category: 'fondamental',
      status: 'actif',
      priority: 1,
      color: '#4CAF50',
      icon: '🧪'
    },
    {
      axisCode: 'AX2',
      name: 'Ethnobotanique Olfactive',
      subtitle: 'Usages traditionnels des plantes aromatiques à travers les cultures',
      description: 'Recherche sur les pratiques traditionnelles d\'utilisation des plantes odorantes dans différentes civilisations. Cet axe documente les savoirs ancestraux et leur pertinence pour la parfumerie contemporaine.',
      objectives: '1. Documenter les usages traditionnels des plantes aromatiques\n2. Identifier les correspondances entre cultures\n3. Préserver les savoirs menacés',
      methodology: 'Recherche de terrain, entretiens, analyse documentaire historique',
      category: 'ethnographique',
      status: 'actif',
      priority: 2,
      color: '#8B4513',
      icon: '🌿'
    },
    {
      axisCode: 'AX3',
      name: 'Durabilité & Alternatives',
      subtitle: 'Recherche de solutions durables pour la parfumerie',
      description: 'Face aux enjeux environnementaux, cet axe explore les alternatives durables aux matières premières menacées ou controversées. Il inclut la recherche sur la biotechnologie, les substituts végétaux et les pratiques de culture responsable.',
      objectives: '1. Identifier les matières premières à risque\n2. Développer des alternatives durables\n3. Évaluer l\'impact environnemental',
      methodology: 'Analyse de cycle de vie, recherche de substituts, partenariats avec producteurs',
      category: 'applique',
      status: 'actif',
      priority: 1,
      color: '#2196F3',
      icon: '♻️'
    },
    {
      axisCode: 'AX4',
      name: 'Perception Olfactive',
      subtitle: 'Mécanismes de la perception et de la mémoire olfactive',
      description: 'Étude des mécanismes neurologiques et psychologiques de la perception des odeurs. Cet axe explore comment les odeurs sont perçues, mémorisées et associées à des émotions.',
      objectives: '1. Comprendre les mécanismes de perception\n2. Étudier la mémoire olfactive\n3. Explorer les liens odeur-émotion',
      methodology: 'Tests sensoriels, études psychophysiques, revue de littérature neuroscientifique',
      category: 'theorique',
      status: 'planifie',
      priority: 3,
      color: '#9C27B0',
      icon: '🧠'
    },
    {
      axisCode: 'AX5',
      name: 'Histoire de la Parfumerie',
      subtitle: 'Évolution des pratiques parfumées à travers les âges',
      description: 'Recherche historique sur l\'évolution de la parfumerie depuis l\'Antiquité jusqu\'à nos jours. Cet axe documente les techniques, les matières premières et les usages à travers les époques.',
      objectives: '1. Documenter l\'histoire des techniques\n2. Retracer l\'évolution des goûts\n3. Identifier les innovations majeures',
      methodology: 'Recherche archivistique, analyse de textes anciens, reconstitution historique',
      category: 'historique',
      status: 'actif',
      priority: 2,
      color: '#FF9800',
      icon: '📜'
    }
  ];
  
  for (const axis of researchAxes) {
    try {
      await db.execute(sql`
        INSERT INTO research_axes 
        (axis_code, name, subtitle, description, objectives, methodology, category, status, priority, color, icon)
        VALUES 
        (${axis.axisCode}, ${axis.name}, ${axis.subtitle}, ${axis.description}, 
         ${axis.objectives}, ${axis.methodology}, ${axis.category}, ${axis.status}, 
         ${axis.priority}, ${axis.color}, ${axis.icon})
        ON DUPLICATE KEY UPDATE
        name = VALUES(name),
        subtitle = VALUES(subtitle),
        description = VALUES(description)
      `);
      console.log(`  ✓ Axe ${axis.axisCode}: ${axis.name}`);
    } catch (error) {
      console.log(`  ⚠ Axe ${axis.axisCode} existe déjà ou erreur:`, error.message);
    }
  }
  
  // ============================================================================
  // ENTRÉES BIBLIOGRAPHIQUES
  // ============================================================================
  
  console.log('\n📖 Création des entrées bibliographiques...');
  
  const bibliographyEntries = [
    {
      entryKey: 'arctander1969perfume',
      entryType: 'book',
      title: 'Perfume and Flavor Materials of Natural Origin',
      authors: 'Steffen Arctander',
      year: 1969,
      publisher: 'Allured Publishing',
      abstract: 'Ouvrage de référence exhaustif sur les matières premières naturelles utilisées en parfumerie et aromatique. Décrit plus de 400 matières avec leurs propriétés olfactives, origines et utilisations.',
      keywords: 'matières premières,naturel,huiles essentielles,absolues,référence',
      language: 'en',
      citationCount: 1500,
      impactFactor: null,
      isOpenAccess: false,
      status: 'verifie'
    },
    {
      entryKey: 'sell2006chemistry',
      entryType: 'book',
      title: 'The Chemistry of Fragrances: From Perfumer to Consumer',
      authors: 'Charles Sell',
      year: 2006,
      publisher: 'Royal Society of Chemistry',
      edition: '2nd',
      isbn: '978-0854048243',
      abstract: 'Guide complet sur la chimie des parfums, couvrant la synthèse des molécules odorantes, les mécanismes de perception et les aspects industriels de la parfumerie.',
      keywords: 'chimie,synthèse,molécules,perception,industrie',
      language: 'en',
      citationCount: 850,
      isOpenAccess: false,
      status: 'verifie'
    },
    {
      entryKey: 'tisserand2014essential',
      entryType: 'book',
      title: 'Essential Oil Safety: A Guide for Health Care Professionals',
      authors: 'Robert Tisserand, Rodney Young',
      year: 2014,
      publisher: 'Churchill Livingstone',
      edition: '2nd',
      isbn: '978-0443062414',
      abstract: 'Référence majeure sur la sécurité des huiles essentielles, incluant les données toxicologiques, les interactions médicamenteuses et les recommandations d\'usage.',
      keywords: 'sécurité,toxicologie,huiles essentielles,IFRA,réglementation',
      language: 'en',
      citationCount: 2100,
      isOpenAccess: false,
      status: 'verifie'
    },
    {
      entryKey: 'burr2003emperor',
      entryType: 'book',
      title: 'The Emperor of Scent: A True Story of Perfume and Obsession',
      authors: 'Chandler Burr',
      year: 2003,
      publisher: 'Random House',
      isbn: '978-0375759819',
      abstract: 'Récit captivant sur Luca Turin et sa théorie vibratoire de l\'olfaction. Explore les controverses scientifiques autour de la perception des odeurs.',
      keywords: 'olfaction,théorie vibratoire,Luca Turin,perception,science',
      language: 'en',
      citationCount: 320,
      isOpenAccess: false,
      status: 'verifie'
    },
    {
      entryKey: 'ohloff1994scent',
      entryType: 'book',
      title: 'Scent and Chemistry: The Molecular World of Odors',
      authors: 'Günther Ohloff, Wilhelm Pickenhagen, Philip Kraft',
      year: 1994,
      publisher: 'Wiley-VCH',
      abstract: 'Exploration approfondie des relations structure-odeur des molécules parfumantes. Couvre les principales familles chimiques et leurs caractéristiques olfactives.',
      keywords: 'structure-odeur,chimie,molécules,familles olfactives',
      language: 'en',
      citationCount: 680,
      isOpenAccess: false,
      status: 'verifie'
    },
    {
      entryKey: 'buck2004odorant',
      entryType: 'article',
      title: 'Odorant Receptors and the Organization of the Olfactory System',
      authors: 'Linda Buck',
      year: 2004,
      journal: 'Cell',
      volume: '116',
      pages: '117-119',
      doi: '10.1016/S0092-8674(04)00044-8',
      abstract: 'Article fondateur sur les récepteurs olfactifs et l\'organisation du système olfactif, travaux récompensés par le Prix Nobel de Physiologie ou Médecine 2004.',
      keywords: 'récepteurs olfactifs,Nobel,neurobiologie,perception',
      language: 'en',
      citationCount: 4500,
      impactFactor: 66.85,
      isOpenAccess: false,
      status: 'verifie'
    },
    {
      entryKey: 'classen1994aroma',
      entryType: 'book',
      title: 'Aroma: The Cultural History of Smell',
      authors: 'Constance Classen, David Howes, Anthony Synnott',
      year: 1994,
      publisher: 'Routledge',
      isbn: '978-0415114721',
      abstract: 'Étude anthropologique et historique du rôle de l\'odorat dans différentes cultures et époques. Explore les significations sociales et symboliques des odeurs.',
      keywords: 'anthropologie,histoire,culture,symbolisme,odorat',
      language: 'en',
      citationCount: 890,
      isOpenAccess: false,
      status: 'verifie'
    },
    {
      entryKey: 'aftel2001essence',
      entryType: 'book',
      title: 'Essence and Alchemy: A Natural History of Perfume',
      authors: 'Mandy Aftel',
      year: 2001,
      publisher: 'North Point Press',
      isbn: '978-0865476387',
      abstract: 'Exploration poétique et pratique de la parfumerie naturelle. Combine histoire, botanique et techniques de création avec une approche artisanale.',
      keywords: 'parfumerie naturelle,artisanat,histoire,botanique',
      language: 'en',
      citationCount: 210,
      isOpenAccess: false,
      status: 'verifie'
    },
    {
      entryKey: 'edwards2019fragrances',
      entryType: 'book',
      title: 'Fragrances of the World',
      authors: 'Michael Edwards',
      year: 2019,
      publisher: 'Fragrances of the World',
      edition: '33rd',
      abstract: 'Guide annuel de référence classifiant des milliers de parfums selon le système de la Fragrance Wheel. Outil essentiel pour comprendre les familles olfactives.',
      keywords: 'classification,Fragrance Wheel,familles olfactives,parfums',
      language: 'en',
      citationCount: 450,
      isOpenAccess: false,
      status: 'verifie'
    },
    {
      entryKey: 'guenther1948essential',
      entryType: 'book',
      title: 'The Essential Oils',
      authors: 'Ernest Guenther',
      year: 1948,
      publisher: 'Van Nostrand',
      volume: '1-6',
      abstract: 'Encyclopédie monumentale en six volumes sur les huiles essentielles. Couvre la botanique, la chimie, les méthodes d\'extraction et les applications industrielles.',
      keywords: 'huiles essentielles,encyclopédie,botanique,extraction,industrie',
      language: 'en',
      citationCount: 3200,
      isOpenAccess: true,
      status: 'verifie'
    },
    {
      entryKey: 'roudnitska1991art',
      entryType: 'book',
      title: 'L\'Art de la Parfumerie',
      authors: 'Edmond Roudnitska',
      year: 1991,
      publisher: 'Fayard',
      isbn: '978-2213026954',
      abstract: 'Réflexions d\'un maître parfumeur sur l\'art de la création olfactive. Explore les dimensions esthétiques, techniques et philosophiques de la parfumerie.',
      keywords: 'création,esthétique,art,parfumeur,philosophie',
      language: 'fr',
      citationCount: 180,
      isOpenAccess: false,
      status: 'verifie'
    },
    {
      entryKey: 'ellena2007journal',
      entryType: 'book',
      title: 'Journal d\'un Parfumeur',
      authors: 'Jean-Claude Ellena',
      year: 2007,
      publisher: 'Sabine Wespieser',
      isbn: '978-2848050829',
      abstract: 'Carnet intime d\'un parfumeur contemporain majeur. Offre un regard unique sur le processus créatif et les réflexions d\'un artiste de l\'olfaction.',
      keywords: 'création,processus créatif,parfumeur,Hermès',
      language: 'fr',
      citationCount: 95,
      isOpenAccess: false,
      status: 'verifie'
    }
  ];
  
  for (const entry of bibliographyEntries) {
    try {
      await db.execute(sql`
        INSERT INTO bibliography_entries 
        (entry_key, entry_type, title, authors, year, publisher, edition, isbn, journal, volume, pages, doi, abstract, keywords, language, citation_count, impact_factor, is_open_access, status)
        VALUES 
        (${entry.entryKey}, ${entry.entryType}, ${entry.title}, ${entry.authors}, ${entry.year}, 
         ${entry.publisher || null}, ${entry.edition || null}, ${entry.isbn || null}, 
         ${entry.journal || null}, ${entry.volume || null}, ${entry.pages || null}, ${entry.doi || null},
         ${entry.abstract}, ${entry.keywords}, ${entry.language}, ${entry.citationCount || null}, 
         ${entry.impactFactor || null}, ${entry.isOpenAccess ? 1 : 0}, ${entry.status})
        ON DUPLICATE KEY UPDATE
        title = VALUES(title),
        abstract = VALUES(abstract)
      `);
      console.log(`  ✓ ${entry.entryKey}: ${entry.title.substring(0, 50)}...`);
    } catch (error) {
      console.log(`  ⚠ ${entry.entryKey} existe déjà ou erreur:`, error.message);
    }
  }
  
  // ============================================================================
  // ENTRÉES DE RECHERCHE (liées aux axes)
  // ============================================================================
  
  console.log('\n📝 Création des entrées de recherche...');
  
  // Récupérer les IDs des axes
  const [axes] = await db.execute(sql`SELECT id, axis_code FROM research_axes`);
  const axisMap = {};
  for (const axis of axes) {
    axisMap[axis.axis_code] = axis.id;
  }
  
  const researchEntries = [
    {
      entryCode: 'AX1-001',
      axisCode: 'AX1',
      title: 'Profil terpénique de la lavande vraie',
      content: '## Analyse du profil terpénique\n\nLa lavande vraie (Lavandula angustifolia) présente un profil terpénique dominé par le linalol (25-45%) et l\'acétate de linalyle (25-45%). Ces deux composés constituent la signature olfactive caractéristique.\n\n### Composés majeurs\n- Linalol: 25-45%\n- Acétate de linalyle: 25-45%\n- Terpinène-4-ol: 2-6%\n- Lavandulol: 0.5-1.5%\n\n### Variations chémotypiques\nLes variations géographiques influencent significativement le ratio linalol/acétate de linalyle.',
      summary: 'Analyse détaillée du profil terpénique de Lavandula angustifolia',
      entryType: 'donnees',
      status: 'publie',
      priority: 1
    },
    {
      entryCode: 'AX1-002',
      axisCode: 'AX1',
      title: 'Synergies terpéniques dans les agrumes',
      content: '## Synergies dans les huiles d\'agrumes\n\nLes huiles essentielles d\'agrumes présentent des synergies complexes entre monoterpènes et aldéhydes.\n\n### Observations clés\n- Le limonène (>90%) sert de "véhicule" aux composés traces\n- Les aldéhydes (citral, citronellal) apportent la fraîcheur caractéristique\n- Les coumarines (bergaptène) modifient la perception globale\n\n### Implications pour la formulation\nLa compréhension de ces synergies permet d\'optimiser les accords hespéridés.',
      summary: 'Étude des interactions synergiques dans les huiles d\'agrumes',
      entryType: 'observation',
      status: 'brouillon',
      priority: 2
    },
    {
      entryCode: 'AX2-001',
      axisCode: 'AX2',
      title: 'Usages traditionnels de l\'encens en Oman',
      content: '## L\'encens dans la culture omanaise\n\nL\'encens (Boswellia sacra) occupe une place centrale dans la culture omanaise depuis des millénaires.\n\n### Usages documentés\n1. **Rituels religieux**: Fumigation lors des prières et cérémonies\n2. **Médecine traditionnelle**: Traitement des affections respiratoires\n3. **Parfumerie personnelle**: Imprégnation des vêtements\n4. **Hospitalité**: Accueil des invités\n\n### Méthodes de récolte\nLa récolte traditionnelle suit un calendrier précis lié aux saisons.',
      summary: 'Documentation des usages traditionnels de l\'encens au Sultanat d\'Oman',
      entryType: 'observation',
      status: 'publie',
      priority: 1
    },
    {
      entryCode: 'AX2-002',
      axisCode: 'AX2',
      title: 'Le vétiver dans les rituels hindous',
      content: '## Vétiver et spiritualité hindoue\n\nLe vétiver (Vetiveria zizanioides) est profondément ancré dans les traditions hindoues.\n\n### Significations symboliques\n- Associé à la terre et à l\'enracinement\n- Utilisé pour la purification des espaces sacrés\n- Présent dans les rituels de mariage\n\n### Préparations traditionnelles\n- Khus water: eau parfumée rafraîchissante\n- Huile de massage ayurvédique\n- Encens et dhoop',
      summary: 'Exploration du rôle du vétiver dans les traditions spirituelles hindoues',
      entryType: 'note',
      status: 'brouillon',
      priority: 2
    },
    {
      entryCode: 'AX3-001',
      axisCode: 'AX3',
      title: 'Alternatives au bois de santal',
      content: '## Recherche d\'alternatives durables au santal\n\nFace à la raréfaction du Santalum album, plusieurs alternatives sont explorées.\n\n### Alternatives naturelles\n1. **Santalum spicatum** (santal australien): Profil similaire, culture durable\n2. **Amyris balsamifera**: Note boisée douce, prix accessible\n3. **Santalum austrocaledonicum**: Qualité proche du S. album\n\n### Molécules de synthèse\n- Sandalore®: Reproduction fidèle de l\'aspect crémeux\n- Javanol®: Note boisée lactée\n\n### Recommandations\nPrivilégier les sources certifiées et les alternatives durables.',
      summary: 'Évaluation des alternatives au bois de santal indien menacé',
      entryType: 'analyse',
      status: 'publie',
      priority: 1
    },
    {
      entryCode: 'AX5-001',
      axisCode: 'AX5',
      title: 'L\'eau de Hongrie: premier parfum alcoolique',
      content: '## Histoire de l\'Eau de Hongrie\n\nL\'Eau de Hongrie (XIVe siècle) est considérée comme le premier parfum à base d\'alcool de l\'histoire occidentale.\n\n### Origines\n- Attribuée à la reine Élisabeth de Hongrie (1305-1380)\n- Probablement inspirée des techniques arabes de distillation\n\n### Composition historique\n- Romarin (ingrédient principal)\n- Lavande\n- Menthe\n- Distillat dans de l\'alcool de vin\n\n### Impact historique\nMarque la transition des parfums huileux vers les parfums alcooliques.',
      summary: 'Étude historique sur l\'Eau de Hongrie et son impact sur la parfumerie',
      entryType: 'reference',
      status: 'publie',
      priority: 1
    }
  ];
  
  for (const entry of researchEntries) {
    const axisId = axisMap[entry.axisCode];
    if (!axisId) {
      console.log(`  ⚠ Axe ${entry.axisCode} non trouvé pour ${entry.entryCode}`);
      continue;
    }
    
    try {
      await db.execute(sql`
        INSERT INTO research_entries 
        (entry_code, axis_id, title, content, summary, entry_type, status, priority)
        VALUES 
        (${entry.entryCode}, ${axisId}, ${entry.title}, ${entry.content}, 
         ${entry.summary}, ${entry.entryType}, ${entry.status}, ${entry.priority})
        ON DUPLICATE KEY UPDATE
        title = VALUES(title),
        content = VALUES(content)
      `);
      console.log(`  ✓ ${entry.entryCode}: ${entry.title}`);
    } catch (error) {
      console.log(`  ⚠ ${entry.entryCode} existe déjà ou erreur:`, error.message);
    }
  }
  
  // ============================================================================
  // LIENS BIBLIOGRAPHIE-AXES
  // ============================================================================
  
  console.log('\n🔗 Création des liens bibliographie-axes...');
  
  // Récupérer les IDs des entrées bibliographiques
  const [bibEntries] = await db.execute(sql`SELECT id, entry_key FROM bibliography_entries`);
  const bibMap = {};
  for (const bib of bibEntries) {
    bibMap[bib.entry_key] = bib.id;
  }
  
  const links = [
    { bibKey: 'arctander1969perfume', axisCode: 'AX1', relevance: 'primaire' },
    { bibKey: 'arctander1969perfume', axisCode: 'AX2', relevance: 'secondaire' },
    { bibKey: 'sell2006chemistry', axisCode: 'AX1', relevance: 'primaire' },
    { bibKey: 'tisserand2014essential', axisCode: 'AX3', relevance: 'primaire' },
    { bibKey: 'buck2004odorant', axisCode: 'AX4', relevance: 'primaire' },
    { bibKey: 'classen1994aroma', axisCode: 'AX2', relevance: 'primaire' },
    { bibKey: 'classen1994aroma', axisCode: 'AX5', relevance: 'secondaire' },
    { bibKey: 'edwards2019fragrances', axisCode: 'AX1', relevance: 'secondaire' },
    { bibKey: 'guenther1948essential', axisCode: 'AX1', relevance: 'primaire' },
    { bibKey: 'guenther1948essential', axisCode: 'AX2', relevance: 'contextuelle' },
    { bibKey: 'roudnitska1991art', axisCode: 'AX5', relevance: 'primaire' },
    { bibKey: 'ellena2007journal', axisCode: 'AX5', relevance: 'secondaire' }
  ];
  
  for (const link of links) {
    const bibId = bibMap[link.bibKey];
    const axisId = axisMap[link.axisCode];
    
    if (!bibId || !axisId) {
      console.log(`  ⚠ Lien ignoré: ${link.bibKey} -> ${link.axisCode}`);
      continue;
    }
    
    try {
      await db.execute(sql`
        INSERT INTO bibliography_axis_links 
        (bibliography_id, axis_id, relevance)
        VALUES 
        (${bibId}, ${axisId}, ${link.relevance})
        ON DUPLICATE KEY UPDATE
        relevance = VALUES(relevance)
      `);
      console.log(`  ✓ ${link.bibKey} -> ${link.axisCode} (${link.relevance})`);
    } catch (error) {
      console.log(`  ⚠ Lien existe déjà:`, error.message);
    }
  }
  
  // ============================================================================
  // RÉSUMÉ
  // ============================================================================
  
  console.log('\n✅ Import terminé!');
  
  const [axesCount] = await db.execute(sql`SELECT COUNT(*) as count FROM research_axes`);
  const [bibCount] = await db.execute(sql`SELECT COUNT(*) as count FROM bibliography_entries`);
  const [entriesCount] = await db.execute(sql`SELECT COUNT(*) as count FROM research_entries`);
  const [linksCount] = await db.execute(sql`SELECT COUNT(*) as count FROM bibliography_axis_links`);
  
  console.log(`\n📊 Statistiques:`);
  console.log(`  - Axes de recherche: ${axesCount[0].count}`);
  console.log(`  - Entrées bibliographiques: ${bibCount[0].count}`);
  console.log(`  - Entrées de recherche: ${entriesCount[0].count}`);
  console.log(`  - Liens bibliographie-axes: ${linksCount[0].count}`);
  
  await connection.end();
}

main().catch(console.error);
