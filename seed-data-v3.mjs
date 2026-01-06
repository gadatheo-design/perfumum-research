/**
 * Script pour ajouter des données de test pour la bibliographie et les entrées de recherche
 * PERFUMUM Research Project - Version 3 (structure corrigée)
 */

import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;

function slugify(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function main() {
  console.log('🔬 Ajout des données de test pour PERFUMUM v3...\n');
  
  const connection = await mysql.createConnection(DATABASE_URL);
  
  // ============================================================================
  // ENTRÉES BIBLIOGRAPHIQUES
  // ============================================================================
  
  console.log('📖 Création des entrées bibliographiques...');
  
  const bibliographyEntries = [
    {
      entry_key: 'perfumum_arctander1969',
      entry_type: 'book',
      title: 'Perfume and Flavor Materials of Natural Origin',
      authors: 'Steffen Arctander',
      year: 1969,
      publisher: 'Allured Publishing',
      abstract: 'Ouvrage de référence exhaustif sur les matières premières naturelles utilisées en parfumerie et aromatique.',
      keywords: JSON.stringify(['matières premières', 'naturel', 'huiles essentielles', 'absolues']),
      language: 'en',
      research_domain: 'chimie_olfactive',
      relevance_score: 95,
      read_status: 'read'
    },
    {
      entry_key: 'perfumum_sell2006',
      entry_type: 'book',
      title: 'The Chemistry of Fragrances: From Perfumer to Consumer',
      authors: 'Charles Sell',
      year: 2006,
      publisher: 'Royal Society of Chemistry',
      edition: '2nd',
      isbn: '978-0854048243',
      abstract: 'Guide complet sur la chimie des parfums, couvrant la synthèse des molécules odorantes.',
      keywords: JSON.stringify(['chimie', 'synthèse', 'molécules', 'perception']),
      language: 'en',
      research_domain: 'chimie_olfactive',
      relevance_score: 90,
      read_status: 'read'
    },
    {
      entry_key: 'perfumum_tisserand2014',
      entry_type: 'book',
      title: 'Essential Oil Safety: A Guide for Health Care Professionals',
      authors: 'Robert Tisserand, Rodney Young',
      year: 2014,
      publisher: 'Churchill Livingstone',
      edition: '2nd',
      isbn: '978-0443062414',
      abstract: 'Référence majeure sur la sécurité des huiles essentielles.',
      keywords: JSON.stringify(['sécurité', 'toxicologie', 'huiles essentielles', 'IFRA']),
      language: 'en',
      research_domain: 'reglementation',
      relevance_score: 92,
      read_status: 'read'
    },
    {
      entry_key: 'perfumum_buck2004',
      entry_type: 'article',
      title: 'Odorant Receptors and the Organization of the Olfactory System',
      authors: 'Linda Buck',
      year: 2004,
      journal: 'Cell',
      volume: '116',
      pages: '117-119',
      doi: '10.1016/S0092-8674(04)00044-8',
      abstract: 'Article fondateur sur les récepteurs olfactifs (Prix Nobel 2004).',
      keywords: JSON.stringify(['récepteurs olfactifs', 'Nobel', 'neurobiologie']),
      language: 'en',
      research_domain: 'neurologie_olfactive',
      relevance_score: 98,
      read_status: 'read'
    },
    {
      entry_key: 'perfumum_classen1994',
      entry_type: 'book',
      title: 'Aroma: The Cultural History of Smell',
      authors: 'Constance Classen, David Howes, Anthony Synnott',
      year: 1994,
      publisher: 'Routledge',
      isbn: '978-0415114721',
      abstract: 'Étude anthropologique et historique du rôle de l\'odorat dans différentes cultures.',
      keywords: JSON.stringify(['anthropologie', 'histoire', 'culture', 'symbolisme']),
      language: 'en',
      research_domain: 'histoire_parfumerie',
      relevance_score: 85,
      read_status: 'read'
    },
    {
      entry_key: 'perfumum_guenther1948',
      entry_type: 'book',
      title: 'The Essential Oils (6 volumes)',
      authors: 'Ernest Guenther',
      year: 1948,
      publisher: 'Van Nostrand',
      abstract: 'Encyclopédie monumentale en six volumes sur les huiles essentielles.',
      keywords: JSON.stringify(['huiles essentielles', 'encyclopédie', 'botanique', 'extraction']),
      language: 'en',
      research_domain: 'extraction',
      relevance_score: 88,
      read_status: 'reading'
    },
    {
      entry_key: 'perfumum_roudnitska1991',
      entry_type: 'book',
      title: 'L\'Art de la Parfumerie',
      authors: 'Edmond Roudnitska',
      year: 1991,
      publisher: 'Fayard',
      isbn: '978-2213026954',
      abstract: 'Réflexions d\'un maître parfumeur sur l\'art de la création olfactive.',
      keywords: JSON.stringify(['création', 'esthétique', 'art', 'parfumeur']),
      language: 'fr',
      research_domain: 'formulation',
      relevance_score: 90,
      read_status: 'read'
    },
    {
      entry_key: 'perfumum_ellena2007',
      entry_type: 'book',
      title: 'Journal d\'un Parfumeur',
      authors: 'Jean-Claude Ellena',
      year: 2007,
      publisher: 'Sabine Wespieser',
      isbn: '978-2848050829',
      abstract: 'Carnet intime d\'un parfumeur contemporain majeur.',
      keywords: JSON.stringify(['création', 'processus créatif', 'parfumeur', 'Hermès']),
      language: 'fr',
      research_domain: 'formulation',
      relevance_score: 82,
      read_status: 'read'
    },
    {
      entry_key: 'perfumum_edwards2019',
      entry_type: 'book',
      title: 'Fragrances of the World',
      authors: 'Michael Edwards',
      year: 2019,
      publisher: 'Fragrances of the World',
      edition: '33rd',
      abstract: 'Guide de référence classifiant des milliers de parfums selon la Fragrance Wheel.',
      keywords: JSON.stringify(['classification', 'Fragrance Wheel', 'familles olfactives']),
      language: 'en',
      research_domain: 'formulation',
      relevance_score: 78,
      read_status: 'reading'
    },
    {
      entry_key: 'perfumum_ohloff1994',
      entry_type: 'book',
      title: 'Scent and Chemistry: The Molecular World of Odors',
      authors: 'Günther Ohloff, Wilhelm Pickenhagen, Philip Kraft',
      year: 1994,
      publisher: 'Wiley-VCH',
      abstract: 'Exploration des relations structure-odeur des molécules parfumantes.',
      keywords: JSON.stringify(['structure-odeur', 'chimie', 'molécules']),
      language: 'en',
      research_domain: 'chimie_olfactive',
      relevance_score: 88,
      read_status: 'read'
    },
    {
      entry_key: 'perfumum_aftel2001',
      entry_type: 'book',
      title: 'Essence and Alchemy: A Natural History of Perfume',
      authors: 'Mandy Aftel',
      year: 2001,
      publisher: 'North Point Press',
      isbn: '978-0865476387',
      abstract: 'Exploration poétique et pratique de la parfumerie naturelle.',
      keywords: JSON.stringify(['parfumerie naturelle', 'artisanat', 'histoire']),
      language: 'en',
      research_domain: 'histoire_parfumerie',
      relevance_score: 75,
      read_status: 'read'
    },
    {
      entry_key: 'perfumum_burr2003',
      entry_type: 'book',
      title: 'The Emperor of Scent: A True Story of Perfume and Obsession',
      authors: 'Chandler Burr',
      year: 2003,
      publisher: 'Random House',
      isbn: '978-0375759819',
      abstract: 'Récit sur Luca Turin et sa théorie vibratoire de l\'olfaction.',
      keywords: JSON.stringify(['olfaction', 'théorie vibratoire', 'Luca Turin']),
      language: 'en',
      research_domain: 'neurologie_olfactive',
      relevance_score: 70,
      read_status: 'read'
    }
  ];
  
  for (const entry of bibliographyEntries) {
    try {
      const columns = Object.keys(entry).join(', ');
      const placeholders = Object.keys(entry).map(() => '?').join(', ');
      const values = Object.values(entry);
      
      await connection.execute(
        `INSERT INTO bibliography_entries (${columns}) VALUES (${placeholders})
         ON DUPLICATE KEY UPDATE title = VALUES(title), abstract = VALUES(abstract)`,
        values
      );
      console.log(`  ✓ ${entry.entry_key}: ${entry.title.substring(0, 50)}...`);
    } catch (error) {
      console.log(`  ⚠ ${entry.entry_key}:`, error.message.substring(0, 80));
    }
  }
  
  // ============================================================================
  // ENTRÉES DE RECHERCHE
  // ============================================================================
  
  console.log('\n📝 Création des entrées de recherche...');
  
  // Récupérer les IDs des axes existants
  const [axes] = await connection.execute('SELECT id, axis_code FROM research_axes');
  const axisMap = {};
  for (const axis of axes) {
    axisMap[axis.axis_code] = axis.id;
  }
  console.log('  Axes disponibles:', Object.keys(axisMap));
  
  const researchEntries = [
    {
      entry_code: 'AX1-PERF-001',
      axis_code: 'AX1',
      title: 'Mécanismes de la mémoire olfactive',
      slug: 'mecanismes-memoire-olfactive',
      summary: 'Étude des mécanismes neurologiques de la mémoire olfactive',
      content: '## Mémoire olfactive et émotions\n\nLa mémoire olfactive est unique dans sa capacité à évoquer des souvenirs émotionnels intenses et détaillés.\n\n### Observations clés\n- Les odeurs sont traitées par le système limbique\n- Connexion directe avec l\'hippocampe (mémoire) et l\'amygdale (émotions)\n- Phénomène de "madeleine de Proust" scientifiquement documenté\n\n### Implications pour PERFUMUM\nComprendre ces mécanismes permet de créer des parfums plus évocateurs.',
      entry_type: 'note',
      status: 'completed',
      importance: 'high',
      is_public: true,
      is_pinned: true
    },
    {
      entry_code: 'AX1-PERF-002',
      axis_code: 'AX1',
      title: 'Récepteurs olfactifs et perception',
      slug: 'recepteurs-olfactifs-perception',
      summary: 'Synthèse sur les récepteurs olfactifs et leur rôle dans la perception',
      content: '## Les récepteurs olfactifs humains\n\nL\'humain possède environ 400 types de récepteurs olfactifs fonctionnels.\n\n### Données clés\n- ~400 récepteurs olfactifs codés par le génome\n- Capacité de distinguer >1 trillion d\'odeurs différentes\n- Variation génétique significative entre individus\n\n### Références\n- Buck & Axel (Prix Nobel 2004)\n- Études récentes sur l\'anosmie spécifique',
      entry_type: 'synthesis',
      status: 'completed',
      importance: 'medium',
      is_public: true,
      is_pinned: false
    },
    {
      entry_code: 'AX2-PERF-001',
      axis_code: 'AX2',
      title: 'Biotechnologie et production de molécules odorantes',
      slug: 'biotechnologie-molecules-odorantes',
      summary: 'Panorama des technologies biotechnologiques pour la parfumerie durable',
      content: '## Production biotechnologique de parfums\n\nLa biotechnologie offre des alternatives durables à l\'extraction traditionnelle.\n\n### Technologies émergentes\n1. **Fermentation de précision**: Production de molécules identiques aux naturelles\n2. **Biologie synthétique**: Création de nouvelles voies métaboliques\n3. **Culture cellulaire végétale**: Production sans agriculture\n\n### Exemples concrets\n- Vanilline par fermentation (Evolva)\n- Santal par levures modifiées\n- Patchoulol biosynthétique',
      entry_type: 'analysis',
      status: 'completed',
      importance: 'high',
      is_public: true,
      is_pinned: true
    },
    {
      entry_code: 'AX2-PERF-002',
      axis_code: 'AX2',
      title: 'Alternatives au musc naturel',
      slug: 'alternatives-musc-naturel',
      summary: 'Évolution des alternatives au musc naturel et enjeux environnementaux',
      content: '## Muscs synthétiques et durabilité\n\nLe musc naturel (Moschus moschiferus) est interdit depuis 1979.\n\n### Alternatives développées\n- **Muscs nitro** (historiques, maintenant restreints)\n- **Muscs polycycliques** (Galaxolide, Tonalide)\n- **Muscs macrocycliques** (Muscone synthétique, Habanolide)\n\n### Enjeux actuels\n- Biodégradabilité des muscs synthétiques\n- Bioaccumulation dans l\'environnement\n- Recherche de muscs "verts"',
      entry_type: 'observation',
      status: 'in_progress',
      importance: 'medium',
      is_public: false,
      is_pinned: false
    },
    {
      entry_code: 'AX3-PERF-001',
      axis_code: 'AX3',
      title: 'Aromathérapie et régulation émotionnelle',
      slug: 'aromatherapie-regulation-emotionnelle',
      summary: 'Revue des effets émotionnels des odeurs et limites des études',
      content: '## Effets des odeurs sur les émotions\n\nCertaines odeurs ont des effets documentés sur l\'état émotionnel.\n\n### Études cliniques\n- **Lavande**: Effet anxiolytique démontré\n- **Agrumes**: Amélioration de l\'humeur\n- **Encens**: Effet méditatif (acide incensole)\n\n### Limites méthodologiques\n- Difficulté de standardisation\n- Effets placebo significatifs\n- Variations culturelles importantes',
      entry_type: 'review',
      status: 'completed',
      importance: 'high',
      is_public: true,
      is_pinned: false
    },
    {
      entry_code: 'AX4-PERF-001',
      axis_code: 'AX4',
      title: 'Préservation des savoir-faire traditionnels',
      slug: 'preservation-savoir-faire-traditionnels',
      summary: 'État des lieux de la préservation du patrimoine olfactif mondial',
      content: '## Patrimoine olfactif menacé\n\nDe nombreux savoir-faire traditionnels risquent de disparaître.\n\n### Cas documentés\n1. **Enfleurage à Grasse**: Technique quasi-abandonnée\n2. **Distillation de rose en Bulgarie**: Transmission familiale menacée\n3. **Encens d\'Oman**: Savoirs ancestraux en déclin\n\n### Actions de préservation\n- Documentation vidéo et écrite\n- Programmes de formation\n- Labellisation UNESCO (parfumerie de Grasse)',
      entry_type: 'observation',
      status: 'completed',
      importance: 'critical',
      is_public: true,
      is_pinned: true
    },
    {
      entry_code: 'AX5-PERF-001',
      axis_code: 'AX5',
      title: 'IA et création parfumée',
      slug: 'ia-creation-parfumee',
      summary: 'Panorama de l\'utilisation de l\'IA dans la création de parfums',
      content: '## Intelligence artificielle en parfumerie\n\nL\'IA commence à être utilisée dans la création de parfums.\n\n### Applications actuelles\n- **Symrise/IBM**: Philyra, premier parfum créé par IA (2019)\n- **Givaudan**: Carto, outil d\'aide à la formulation\n- **Firmenich**: Analyse prédictive des tendances\n\n### Limites et débats\n- Créativité vs optimisation\n- Rôle du parfumeur humain\n- Questions éthiques sur l\'originalité',
      entry_type: 'analysis',
      status: 'in_progress',
      importance: 'medium',
      is_public: false,
      is_pinned: false
    }
  ];
  
  for (const entry of researchEntries) {
    const axisId = axisMap[entry.axis_code];
    if (!axisId) {
      console.log(`  ⚠ Axe ${entry.axis_code} non trouvé pour ${entry.entry_code}`);
      continue;
    }
    
    try {
      await connection.execute(
        `INSERT INTO research_entries 
         (entry_code, axis_id, primary_axis_id, title, slug, summary, content, entry_type, status, importance, is_public, is_pinned)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE title = VALUES(title), content = VALUES(content), summary = VALUES(summary)`,
        [entry.entry_code, axisId, axisId, entry.title, entry.slug, entry.summary, entry.content, 
         entry.entry_type, entry.status, entry.importance, entry.is_public ? 1 : 0, entry.is_pinned ? 1 : 0]
      );
      console.log(`  ✓ ${entry.entry_code}: ${entry.title}`);
    } catch (error) {
      console.log(`  ⚠ ${entry.entry_code}:`, error.message.substring(0, 100));
    }
  }
  
  // ============================================================================
  // LIENS BIBLIOGRAPHIE-AXES
  // ============================================================================
  
  console.log('\n🔗 Création des liens bibliographie-axes...');
  
  // Récupérer les IDs des entrées bibliographiques
  const [bibEntries] = await connection.execute(
    "SELECT id, entry_key FROM bibliography_entries WHERE entry_key LIKE 'perfumum_%'"
  );
  const bibMap = {};
  for (const bib of bibEntries) {
    bibMap[bib.entry_key] = bib.id;
  }
  console.log('  Entrées bibliographiques PERFUMUM:', Object.keys(bibMap).length);
  
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
      await connection.execute(
        `INSERT INTO bibliography_axis_links (bibliography_id, axis_id, relevance)
         VALUES (?, ?, ?)
         ON DUPLICATE KEY UPDATE relevance = VALUES(relevance)`,
        [bibId, axisId, link.relevance]
      );
      console.log(`  ✓ ${link.bibKey} -> ${link.axisCode} (${link.relevance})`);
    } catch (error) {
      console.log(`  ⚠ Lien:`, error.message.substring(0, 80));
    }
  }
  
  // ============================================================================
  // RÉSUMÉ
  // ============================================================================
  
  console.log('\n✅ Import terminé!');
  
  const [[axesCount]] = await connection.execute('SELECT COUNT(*) as count FROM research_axes');
  const [[bibCount]] = await connection.execute('SELECT COUNT(*) as count FROM bibliography_entries');
  const [[perfumumBibCount]] = await connection.execute("SELECT COUNT(*) as count FROM bibliography_entries WHERE entry_key LIKE 'perfumum_%'");
  const [[entriesCount]] = await connection.execute('SELECT COUNT(*) as count FROM research_entries');
  const [[linksCount]] = await connection.execute('SELECT COUNT(*) as count FROM bibliography_axis_links');
  
  console.log(`\n📊 Statistiques:`);
  console.log(`  - Axes de recherche: ${axesCount.count}`);
  console.log(`  - Entrées bibliographiques (total): ${bibCount.count}`);
  console.log(`  - Entrées bibliographiques (PERFUMUM): ${perfumumBibCount.count}`);
  console.log(`  - Entrées de recherche: ${entriesCount.count}`);
  console.log(`  - Liens bibliographie-axes: ${linksCount.count}`);
  
  await connection.end();
}

main().catch(console.error);
