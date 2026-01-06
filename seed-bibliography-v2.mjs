/**
 * Script pour ajouter des données de test pour la bibliographie et les entrées de recherche
 * PERFUMUM Research Project - Version 2
 */

import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import { sql } from 'drizzle-orm';

const DATABASE_URL = process.env.DATABASE_URL;

async function main() {
  console.log('🔬 Ajout des données de test pour PERFUMUM v2...\n');
  
  const connection = await mysql.createConnection(DATABASE_URL);
  const db = drizzle(connection);
  
  // ============================================================================
  // ENTRÉES BIBLIOGRAPHIQUES (avec clés uniques)
  // ============================================================================
  
  console.log('📖 Création des entrées bibliographiques...');
  
  const bibliographyEntries = [
    {
      entryKey: 'perfumum_arctander1969',
      entryType: 'book',
      title: 'Perfume and Flavor Materials of Natural Origin',
      authors: 'Steffen Arctander',
      year: 1969,
      publisher: 'Allured Publishing',
      abstract: 'Ouvrage de référence exhaustif sur les matières premières naturelles utilisées en parfumerie et aromatique. Décrit plus de 400 matières avec leurs propriétés olfactives, origines et utilisations.',
      keywords: 'matières premières,naturel,huiles essentielles,absolues,référence',
      language: 'en',
      citationCount: 1500,
      status: 'verifie'
    },
    {
      entryKey: 'perfumum_sell2006',
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
      status: 'verifie'
    },
    {
      entryKey: 'perfumum_tisserand2014',
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
      status: 'verifie'
    },
    {
      entryKey: 'perfumum_buck2004',
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
      status: 'verifie'
    },
    {
      entryKey: 'perfumum_classen1994',
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
      status: 'verifie'
    },
    {
      entryKey: 'perfumum_guenther1948',
      entryType: 'book',
      title: 'The Essential Oils (6 volumes)',
      authors: 'Ernest Guenther',
      year: 1948,
      publisher: 'Van Nostrand',
      abstract: 'Encyclopédie monumentale en six volumes sur les huiles essentielles. Couvre la botanique, la chimie, les méthodes d\'extraction et les applications industrielles.',
      keywords: 'huiles essentielles,encyclopédie,botanique,extraction,industrie',
      language: 'en',
      citationCount: 3200,
      status: 'verifie'
    },
    {
      entryKey: 'perfumum_roudnitska1991',
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
      status: 'verifie'
    },
    {
      entryKey: 'perfumum_ellena2007',
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
      status: 'verifie'
    },
    {
      entryKey: 'perfumum_edwards2019',
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
      status: 'verifie'
    },
    {
      entryKey: 'perfumum_ohloff1994',
      entryType: 'book',
      title: 'Scent and Chemistry: The Molecular World of Odors',
      authors: 'Günther Ohloff, Wilhelm Pickenhagen, Philip Kraft',
      year: 1994,
      publisher: 'Wiley-VCH',
      abstract: 'Exploration approfondie des relations structure-odeur des molécules parfumantes. Couvre les principales familles chimiques et leurs caractéristiques olfactives.',
      keywords: 'structure-odeur,chimie,molécules,familles olfactives',
      language: 'en',
      citationCount: 680,
      status: 'verifie'
    },
    {
      entryKey: 'perfumum_aftel2001',
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
      status: 'verifie'
    },
    {
      entryKey: 'perfumum_burr2003',
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
      status: 'verifie'
    }
  ];
  
  for (const entry of bibliographyEntries) {
    try {
      await db.execute(sql`
        INSERT INTO bibliography_entries 
        (entry_key, entry_type, title, authors, year, publisher, edition, isbn, journal, volume, pages, doi, abstract, keywords, language, citation_count, status)
        VALUES 
        (${entry.entryKey}, ${entry.entryType}, ${entry.title}, ${entry.authors}, ${entry.year}, 
         ${entry.publisher || null}, ${entry.edition || null}, ${entry.isbn || null}, 
         ${entry.journal || null}, ${entry.volume || null}, ${entry.pages || null}, ${entry.doi || null},
         ${entry.abstract}, ${entry.keywords}, ${entry.language}, ${entry.citationCount || null}, ${entry.status})
        ON DUPLICATE KEY UPDATE
        title = VALUES(title),
        abstract = VALUES(abstract),
        authors = VALUES(authors)
      `);
      console.log(`  ✓ ${entry.entryKey}: ${entry.title.substring(0, 50)}...`);
    } catch (error) {
      console.log(`  ⚠ ${entry.entryKey}:`, error.message.substring(0, 100));
    }
  }
  
  // ============================================================================
  // ENTRÉES DE RECHERCHE (liées aux axes existants)
  // ============================================================================
  
  console.log('\n📝 Création des entrées de recherche...');
  
  // Récupérer les IDs des axes existants
  const [axes] = await db.execute(sql`SELECT id, axis_code FROM research_axes`);
  const axisMap = {};
  for (const axis of axes) {
    axisMap[axis.axis_code] = axis.id;
  }
  console.log('  Axes disponibles:', Object.keys(axisMap));
  
  const researchEntries = [
    {
      entryCode: 'AX1-PERF-001',
      axisCode: 'AX1',
      title: 'Mécanismes de la mémoire olfactive',
      content: '## Mémoire olfactive et émotions\n\nLa mémoire olfactive est unique dans sa capacité à évoquer des souvenirs émotionnels intenses et détaillés.\n\n### Observations clés\n- Les odeurs sont traitées par le système limbique\n- Connexion directe avec l\'hippocampe (mémoire) et l\'amygdale (émotions)\n- Phénomène de "madeleine de Proust" scientifiquement documenté\n\n### Implications pour PERFUMUM\nComprendre ces mécanismes permet de créer des parfums plus évocateurs.',
      summary: 'Étude des mécanismes neurologiques de la mémoire olfactive',
      entryType: 'note',
      status: 'publie',
      priority: 1
    },
    {
      entryCode: 'AX1-PERF-002',
      axisCode: 'AX1',
      title: 'Récepteurs olfactifs et perception',
      content: '## Les récepteurs olfactifs humains\n\nL\'humain possède environ 400 types de récepteurs olfactifs fonctionnels.\n\n### Données clés\n- ~400 récepteurs olfactifs codés par le génome\n- Capacité de distinguer >1 trillion d\'odeurs différentes\n- Variation génétique significative entre individus\n\n### Références\n- Buck & Axel (Prix Nobel 2004)\n- Études récentes sur l\'anosmie spécifique',
      summary: 'Synthèse sur les récepteurs olfactifs et leur rôle dans la perception',
      entryType: 'reference',
      status: 'publie',
      priority: 2
    },
    {
      entryCode: 'AX2-PERF-001',
      axisCode: 'AX2',
      title: 'Biotechnologie et production de molécules odorantes',
      content: '## Production biotechnologique de parfums\n\nLa biotechnologie offre des alternatives durables à l\'extraction traditionnelle.\n\n### Technologies émergentes\n1. **Fermentation de précision**: Production de molécules identiques aux naturelles\n2. **Biologie synthétique**: Création de nouvelles voies métaboliques\n3. **Culture cellulaire végétale**: Production sans agriculture\n\n### Exemples concrets\n- Vanilline par fermentation (Evolva)\n- Santal par levures modifiées\n- Patchoulol biosynthétique',
      summary: 'Panorama des technologies biotechnologiques pour la parfumerie durable',
      entryType: 'analyse',
      status: 'publie',
      priority: 1
    },
    {
      entryCode: 'AX2-PERF-002',
      axisCode: 'AX2',
      title: 'Alternatives au musc naturel',
      content: '## Muscs synthétiques et durabilité\n\nLe musc naturel (Moschus moschiferus) est interdit depuis 1979.\n\n### Alternatives développées\n- **Muscs nitro** (historiques, maintenant restreints)\n- **Muscs polycycliques** (Galaxolide, Tonalide)\n- **Muscs macrocycliques** (Muscone synthétique, Habanolide)\n\n### Enjeux actuels\n- Biodégradabilité des muscs synthétiques\n- Bioaccumulation dans l\'environnement\n- Recherche de muscs "verts"',
      summary: 'Évolution des alternatives au musc naturel et enjeux environnementaux',
      entryType: 'observation',
      status: 'brouillon',
      priority: 2
    },
    {
      entryCode: 'AX3-PERF-001',
      axisCode: 'AX3',
      title: 'Aromathérapie et régulation émotionnelle',
      content: '## Effets des odeurs sur les émotions\n\nCertaines odeurs ont des effets documentés sur l\'état émotionnel.\n\n### Études cliniques\n- **Lavande**: Effet anxiolytique démontré\n- **Agrumes**: Amélioration de l\'humeur\n- **Encens**: Effet méditatif (acide incensole)\n\n### Limites méthodologiques\n- Difficulté de standardisation\n- Effets placebo significatifs\n- Variations culturelles importantes',
      summary: 'Revue des effets émotionnels des odeurs et limites des études',
      entryType: 'resultat',
      status: 'publie',
      priority: 1
    },
    {
      entryCode: 'AX4-PERF-001',
      axisCode: 'AX4',
      title: 'Préservation des savoir-faire traditionnels',
      content: '## Patrimoine olfactif menacé\n\nDe nombreux savoir-faire traditionnels risquent de disparaître.\n\n### Cas documentés\n1. **Enfleurage à Grasse**: Technique quasi-abandonnée\n2. **Distillation de rose en Bulgarie**: Transmission familiale menacée\n3. **Encens d\'Oman**: Savoirs ancestraux en déclin\n\n### Actions de préservation\n- Documentation vidéo et écrite\n- Programmes de formation\n- Labellisation UNESCO (parfumerie de Grasse)',
      summary: 'État des lieux de la préservation du patrimoine olfactif mondial',
      entryType: 'observation',
      status: 'publie',
      priority: 1
    },
    {
      entryCode: 'AX5-PERF-001',
      axisCode: 'AX5',
      title: 'IA et création parfumée',
      content: '## Intelligence artificielle en parfumerie\n\nL\'IA commence à être utilisée dans la création de parfums.\n\n### Applications actuelles\n- **Symrise/IBM**: Philyra, premier parfum créé par IA (2019)\n- **Givaudan**: Carto, outil d\'aide à la formulation\n- **Firmenich**: Analyse prédictive des tendances\n\n### Limites et débats\n- Créativité vs optimisation\n- Rôle du parfumeur humain\n- Questions éthiques sur l\'originalité',
      summary: 'Panorama de l\'utilisation de l\'IA dans la création de parfums',
      entryType: 'analyse',
      status: 'brouillon',
      priority: 2
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
        content = VALUES(content),
        summary = VALUES(summary)
      `);
      console.log(`  ✓ ${entry.entryCode}: ${entry.title}`);
    } catch (error) {
      console.log(`  ⚠ ${entry.entryCode}:`, error.message.substring(0, 100));
    }
  }
  
  // ============================================================================
  // LIENS BIBLIOGRAPHIE-AXES
  // ============================================================================
  
  console.log('\n🔗 Création des liens bibliographie-axes...');
  
  // Récupérer les IDs des entrées bibliographiques
  const [bibEntries] = await db.execute(sql`SELECT id, entry_key FROM bibliography_entries WHERE entry_key LIKE 'perfumum_%'`);
  const bibMap = {};
  for (const bib of bibEntries) {
    bibMap[bib.entry_key] = bib.id;
  }
  console.log('  Entrées bibliographiques:', Object.keys(bibMap).length);
  
  const links = [
    { bibKey: 'perfumum_buck2004', axisCode: 'AX1', relevance: 'primaire' },
    { bibKey: 'perfumum_sell2006', axisCode: 'AX1', relevance: 'secondaire' },
    { bibKey: 'perfumum_tisserand2014', axisCode: 'AX2', relevance: 'primaire' },
    { bibKey: 'perfumum_arctander1969', axisCode: 'AX2', relevance: 'secondaire' },
    { bibKey: 'perfumum_classen1994', axisCode: 'AX3', relevance: 'primaire' },
    { bibKey: 'perfumum_aftel2001', axisCode: 'AX3', relevance: 'secondaire' },
    { bibKey: 'perfumum_roudnitska1991', axisCode: 'AX4', relevance: 'primaire' },
    { bibKey: 'perfumum_ellena2007', axisCode: 'AX4', relevance: 'primaire' },
    { bibKey: 'perfumum_guenther1948', axisCode: 'AX4', relevance: 'contextuelle' },
    { bibKey: 'perfumum_ohloff1994', axisCode: 'AX5', relevance: 'secondaire' },
    { bibKey: 'perfumum_edwards2019', axisCode: 'AX5', relevance: 'contextuelle' }
  ];
  
  for (const link of links) {
    const bibId = bibMap[link.bibKey];
    const axisId = axisMap[link.axisCode];
    
    if (!bibId) {
      console.log(`  ⚠ Bibliographie ${link.bibKey} non trouvée`);
      continue;
    }
    if (!axisId) {
      console.log(`  ⚠ Axe ${link.axisCode} non trouvé`);
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
      console.log(`  ⚠ Lien:`, error.message.substring(0, 80));
    }
  }
  
  // ============================================================================
  // RÉSUMÉ
  // ============================================================================
  
  console.log('\n✅ Import terminé!');
  
  const [axesCount] = await db.execute(sql`SELECT COUNT(*) as count FROM research_axes`);
  const [bibCount] = await db.execute(sql`SELECT COUNT(*) as count FROM bibliography_entries`);
  const [perfumumBibCount] = await db.execute(sql`SELECT COUNT(*) as count FROM bibliography_entries WHERE entry_key LIKE 'perfumum_%'`);
  const [entriesCount] = await db.execute(sql`SELECT COUNT(*) as count FROM research_entries`);
  const [linksCount] = await db.execute(sql`SELECT COUNT(*) as count FROM bibliography_axis_links`);
  
  console.log(`\n📊 Statistiques:`);
  console.log(`  - Axes de recherche: ${axesCount[0].count}`);
  console.log(`  - Entrées bibliographiques (total): ${bibCount[0].count}`);
  console.log(`  - Entrées bibliographiques (PERFUMUM): ${perfumumBibCount[0].count}`);
  console.log(`  - Entrées de recherche: ${entriesCount[0].count}`);
  console.log(`  - Liens bibliographie-axes: ${linksCount[0].count}`);
  
  await connection.end();
}

main().catch(console.error);
