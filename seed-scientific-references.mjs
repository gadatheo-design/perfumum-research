/**
 * Script pour enrichir la bibliographie PERFUMUM avec les références scientifiques principales
 * Couvre: Chimie des terpènes, Ethnobotanique, Neurologie olfactive, Extraction, Formulation
 */

import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;

async function main() {
  console.log('📚 Enrichissement de la bibliographie PERFUMUM...\n');
  
  const connection = await mysql.createConnection(DATABASE_URL);
  
  // D'abord, supprimer les entrées de test
  console.log('🧹 Nettoyage des entrées de test...');
  await connection.execute(`DELETE FROM bibliography_entries WHERE entry_key LIKE 'test_import_%'`);
  console.log('  ✓ Entrées de test supprimées\n');
  
  // Références scientifiques principales à ajouter
  // Colonnes disponibles: entry_key, entry_type, title, authors, year, journal, booktitle, publisher,
  // volume, number, pages, edition, chapter, doi, isbn, issn, pmid, arxiv_id, url, abstract,
  // keywords (JSON), language, research_domain, relevance_score, tags (JSON), notes, annotation,
  // pdf_url, read_status, linked_molecule_ids, linked_plant_ids, linked_recette_ids
  
  const references = [
    // ============================================================================
    // CHIMIE DES TERPÈNES
    // ============================================================================
    {
      entry_key: 'perfumum_breitmaier2006',
      entry_type: 'book',
      title: 'Terpenes: Flavors, Fragrances, Pharmaca, Pheromones',
      authors: 'Eberhard Breitmaier',
      year: 2006,
      publisher: 'Wiley-VCH',
      isbn: '978-3527317868',
      abstract: 'Ouvrage de référence sur la chimie des terpènes couvrant leur biosynthèse, leurs propriétés et leurs applications en parfumerie, pharmacologie et communication chimique.',
      keywords: JSON.stringify(['terpènes', 'biosynthèse', 'chimie', 'parfumerie', 'pharmacologie']),
      language: 'en',
      research_domain: 'chimie_olfactive',
      relevance_score: 95,
      read_status: 'read'
    },
    {
      entry_key: 'perfumum_dewick2009',
      entry_type: 'book',
      title: 'Medicinal Natural Products: A Biosynthetic Approach',
      authors: 'Paul M. Dewick',
      year: 2009,
      publisher: 'Wiley',
      edition: '3rd',
      isbn: '978-0470741689',
      abstract: 'Manuel de référence sur la biosynthèse des produits naturels incluant les terpénoïdes, alcaloïdes et composés phénoliques. Essentiel pour comprendre l\'origine des molécules odorantes.',
      keywords: JSON.stringify(['biosynthèse', 'terpénoïdes', 'alcaloïdes', 'produits naturels']),
      language: 'en',
      research_domain: 'chimie_olfactive',
      relevance_score: 90,
      read_status: 'read'
    },
    {
      entry_key: 'perfumum_gershenzon2007',
      entry_type: 'article',
      title: 'The function of terpene natural products in the natural world',
      authors: 'Jonathan Gershenzon, Natalia Dudareva',
      year: 2007,
      journal: 'Nature Chemical Biology',
      volume: '3',
      number: '7',
      pages: '408-414',
      doi: '10.1038/nchembio.2007.5',
      abstract: 'Revue fondamentale sur les fonctions écologiques des terpènes dans la nature : défense, attraction des pollinisateurs, communication inter-espèces.',
      keywords: JSON.stringify(['terpènes', 'écologie chimique', 'défense', 'pollinisation']),
      language: 'en',
      research_domain: 'chimie_olfactive',
      relevance_score: 92,
      read_status: 'read'
    },
    {
      entry_key: 'perfumum_croteau2000',
      entry_type: 'inbook',
      title: 'Natural Products (Secondary Metabolites)',
      authors: 'Rodney Croteau, Toni M. Kutchan, Norman G. Lewis',
      year: 2000,
      booktitle: 'Biochemistry & Molecular Biology of Plants',
      publisher: 'American Society of Plant Physiologists',
      pages: '1250-1318',
      abstract: 'Chapitre de référence sur les métabolites secondaires des plantes incluant terpènes, phénylpropanoïdes et alcaloïdes.',
      keywords: JSON.stringify(['métabolites secondaires', 'terpènes', 'phénylpropanoïdes', 'biosynthèse']),
      language: 'en',
      research_domain: 'chimie_olfactive',
      relevance_score: 88,
      read_status: 'read'
    },
    {
      entry_key: 'perfumum_russo2011',
      entry_type: 'article',
      title: 'Taming THC: potential cannabis synergy and phytocannabinoid-terpenoid entourage effects',
      authors: 'Ethan B. Russo',
      year: 2011,
      journal: 'British Journal of Pharmacology',
      volume: '163',
      number: '7',
      pages: '1344-1364',
      doi: '10.1111/j.1476-5381.2011.01238.x',
      abstract: 'Article fondateur sur l\'effet entourage entre cannabinoïdes et terpènes. Essentiel pour comprendre les synergies moléculaires dans les formulations.',
      keywords: JSON.stringify(['effet entourage', 'cannabis', 'terpènes', 'synergies', 'pharmacologie']),
      language: 'en',
      research_domain: 'tabac_cannabis',
      relevance_score: 95,
      read_status: 'read'
    },
    
    // ============================================================================
    // NEUROLOGIE OLFACTIVE
    // ============================================================================
    {
      entry_key: 'perfumum_axel1991',
      entry_type: 'article',
      title: 'A novel multigene family may encode odorant receptors: a molecular basis for odor recognition',
      authors: 'Linda Buck, Richard Axel',
      year: 1991,
      journal: 'Cell',
      volume: '65',
      number: '1',
      pages: '175-187',
      doi: '10.1016/0092-8674(91)90418-X',
      abstract: 'Article fondateur identifiant la famille des récepteurs olfactifs. Travaux récompensés par le Prix Nobel 2004.',
      keywords: JSON.stringify(['récepteurs olfactifs', 'gènes', 'reconnaissance odeurs', 'Nobel']),
      language: 'en',
      research_domain: 'neurologie_olfactive',
      relevance_score: 100,
      read_status: 'read'
    },
    {
      entry_key: 'perfumum_firestein2001',
      entry_type: 'article',
      title: 'How the olfactory system makes sense of scents',
      authors: 'Stuart Firestein',
      year: 2001,
      journal: 'Nature',
      volume: '413',
      pages: '211-218',
      doi: '10.1038/35093026',
      abstract: 'Revue complète sur le fonctionnement du système olfactif, de la détection moléculaire à la perception consciente.',
      keywords: JSON.stringify(['système olfactif', 'perception', 'transduction', 'neurosciences']),
      language: 'en',
      research_domain: 'neurologie_olfactive',
      relevance_score: 90,
      read_status: 'read'
    },
    {
      entry_key: 'perfumum_mainland2014',
      entry_type: 'article',
      title: 'The missense of smell: functional variability in the human odorant receptor repertoire',
      authors: 'Joel D. Mainland, Andreas Keller, Yun R. Li, et al.',
      year: 2014,
      journal: 'Nature Neuroscience',
      volume: '17',
      pages: '114-120',
      doi: '10.1038/nn.3598',
      abstract: 'Étude démontrant la variabilité génétique des récepteurs olfactifs humains et son impact sur la perception des odeurs.',
      keywords: JSON.stringify(['variabilité génétique', 'récepteurs olfactifs', 'perception individuelle']),
      language: 'en',
      research_domain: 'neurologie_olfactive',
      relevance_score: 85,
      read_status: 'read'
    },
    {
      entry_key: 'perfumum_herz2004',
      entry_type: 'article',
      title: 'Neuroimaging evidence for the emotional potency of odor-evoked memory',
      authors: 'Rachel S. Herz, Jonathan Eliassen, Sophia Beland, Timothy Souza',
      year: 2004,
      journal: 'Neuropsychologia',
      volume: '42',
      number: '3',
      pages: '371-378',
      doi: '10.1016/j.neuropsychologia.2003.08.009',
      abstract: 'Étude en neuroimagerie démontrant le lien unique entre mémoire olfactive et émotions via l\'amygdale et l\'hippocampe.',
      keywords: JSON.stringify(['mémoire olfactive', 'émotions', 'neuroimagerie', 'amygdale']),
      language: 'en',
      research_domain: 'neurologie_olfactive',
      relevance_score: 88,
      read_status: 'read'
    },
    {
      entry_key: 'perfumum_keller2016',
      entry_type: 'article',
      title: 'Olfactory perception of chemically diverse molecules',
      authors: 'Andreas Keller, Leslie B. Vosshall',
      year: 2016,
      journal: 'BMC Neuroscience',
      volume: '17',
      pages: '55',
      doi: '10.1186/s12868-016-0287-2',
      abstract: 'Analyse systématique de la perception olfactive de molécules chimiquement diverses, établissant des corrélations structure-odeur.',
      keywords: JSON.stringify(['perception olfactive', 'structure-odeur', 'psychophysique']),
      language: 'en',
      research_domain: 'neurologie_olfactive',
      relevance_score: 82,
      read_status: 'read'
    },
    
    // ============================================================================
    // EXTRACTION ET MATIÈRES PREMIÈRES
    // ============================================================================
    {
      entry_key: 'perfumum_baser2010',
      entry_type: 'book',
      title: 'Handbook of Essential Oils: Science, Technology, and Applications',
      authors: 'K. Hüsnü Can Başer, Gerhard Buchbauer',
      year: 2010,
      publisher: 'CRC Press',
      isbn: '978-1420063158',
      abstract: 'Manuel complet sur les huiles essentielles couvrant extraction, analyse, applications et réglementation.',
      keywords: JSON.stringify(['huiles essentielles', 'extraction', 'analyse', 'applications']),
      language: 'en',
      research_domain: 'extraction',
      relevance_score: 95,
      read_status: 'read'
    },
    {
      entry_key: 'perfumum_reverchon1997',
      entry_type: 'article',
      title: 'Supercritical fluid extraction and fractionation of essential oils and related products',
      authors: 'Ernesto Reverchon',
      year: 1997,
      journal: 'The Journal of Supercritical Fluids',
      volume: '10',
      number: '1',
      pages: '1-37',
      doi: '10.1016/S0896-8446(97)00014-4',
      abstract: 'Revue exhaustive sur l\'extraction au CO2 supercritique des huiles essentielles et produits aromatiques.',
      keywords: JSON.stringify(['CO2 supercritique', 'extraction', 'huiles essentielles', 'fractionnement']),
      language: 'en',
      research_domain: 'extraction',
      relevance_score: 88,
      read_status: 'read'
    },
    {
      entry_key: 'perfumum_bicchi2004',
      entry_type: 'article',
      title: 'Headspace sampling of the volatile fraction of vegetable matrices',
      authors: 'Carlo Bicchi, Chiara Cordero, Patrizia Rubiolo',
      year: 2004,
      journal: 'Journal of Chromatography A',
      volume: '1024',
      pages: '217-226',
      doi: '10.1016/j.chroma.2003.10.012',
      abstract: 'Méthodologie de référence pour l\'analyse headspace des composés volatils végétaux.',
      keywords: JSON.stringify(['headspace', 'analyse', 'composés volatils', 'chromatographie']),
      language: 'en',
      research_domain: 'extraction',
      relevance_score: 85,
      read_status: 'read'
    },
    {
      entry_key: 'perfumum_marriott2001',
      entry_type: 'article',
      title: 'Principles and applications of headspace analysis',
      authors: 'Philip J. Marriott, Robin Shellie, Charles Cornwell',
      year: 2001,
      journal: 'Journal of Chromatography A',
      volume: '936',
      pages: '1-22',
      doi: '10.1016/S0021-9673(01)01314-0',
      abstract: 'Revue des principes et applications de l\'analyse headspace pour les composés volatils.',
      keywords: JSON.stringify(['headspace', 'analyse', 'volatils', 'méthodologie']),
      language: 'en',
      research_domain: 'extraction',
      relevance_score: 82,
      read_status: 'read'
    },
    
    // ============================================================================
    // ETHNOBOTANIQUE ET HISTOIRE
    // ============================================================================
    {
      entry_key: 'perfumum_le_guerer1988',
      entry_type: 'book',
      title: 'Les Pouvoirs de l\'Odeur',
      authors: 'Annick Le Guérer',
      year: 1988,
      publisher: 'François Bourin',
      isbn: '978-2876860339',
      abstract: 'Étude anthropologique et historique du rôle de l\'odorat dans les sociétés humaines, de l\'Antiquité à nos jours.',
      keywords: JSON.stringify(['anthropologie', 'histoire', 'odorat', 'société', 'culture']),
      language: 'fr',
      research_domain: 'histoire_parfumerie',
      relevance_score: 90,
      read_status: 'read'
    },
    {
      entry_key: 'perfumum_corbin1982',
      entry_type: 'book',
      title: 'Le Miasme et la Jonquille: L\'odorat et l\'imaginaire social XVIIIe-XIXe siècles',
      authors: 'Alain Corbin',
      year: 1982,
      publisher: 'Aubier Montaigne',
      isbn: '978-2080812315',
      abstract: 'Étude historique fondamentale sur l\'évolution de la perception des odeurs et de l\'hygiène en France aux XVIIIe et XIXe siècles.',
      keywords: JSON.stringify(['histoire', 'hygiène', 'odeurs', 'société', 'France']),
      language: 'fr',
      research_domain: 'histoire_parfumerie',
      relevance_score: 92,
      read_status: 'read'
    },
    {
      entry_key: 'perfumum_balick1996',
      entry_type: 'book',
      title: 'Plants, People, and Culture: The Science of Ethnobotany',
      authors: 'Michael J. Balick, Paul Alan Cox',
      year: 1996,
      publisher: 'Scientific American Library',
      isbn: '978-0716750611',
      abstract: 'Introduction à l\'ethnobotanique couvrant les usages traditionnels des plantes dans différentes cultures.',
      keywords: JSON.stringify(['ethnobotanique', 'plantes', 'culture', 'usages traditionnels']),
      language: 'en',
      research_domain: 'ethnobotanique',
      relevance_score: 88,
      read_status: 'read'
    },
    {
      entry_key: 'perfumum_cunningham2001',
      entry_type: 'book',
      title: 'Applied Ethnobotany: People, Wild Plant Use and Conservation',
      authors: 'Anthony B. Cunningham',
      year: 2001,
      publisher: 'Earthscan',
      isbn: '978-1853837852',
      abstract: 'Guide pratique sur l\'ethnobotanique appliquée à la conservation et l\'utilisation durable des plantes.',
      keywords: JSON.stringify(['ethnobotanique', 'conservation', 'durabilité', 'plantes sauvages']),
      language: 'en',
      research_domain: 'ethnobotanique',
      relevance_score: 85,
      read_status: 'read'
    },
    {
      entry_key: 'perfumum_stoddart1990',
      entry_type: 'book',
      title: 'The Scented Ape: The Biology and Culture of Human Odour',
      authors: 'David Michael Stoddart',
      year: 1990,
      publisher: 'Cambridge University Press',
      isbn: '978-0521395618',
      abstract: 'Étude interdisciplinaire sur le rôle biologique et culturel des odeurs chez l\'humain.',
      keywords: JSON.stringify(['biologie', 'culture', 'odeurs', 'évolution', 'comportement']),
      language: 'en',
      research_domain: 'ethnobotanique',
      relevance_score: 82,
      read_status: 'read'
    },
    
    // ============================================================================
    // FORMULATION ET CRÉATION
    // ============================================================================
    {
      entry_key: 'perfumum_calkin1994',
      entry_type: 'book',
      title: 'Perfumery: Practice and Principles',
      authors: 'Robert R. Calkin, J. Stephan Jellinek',
      year: 1994,
      publisher: 'Wiley',
      isbn: '978-0471589341',
      abstract: 'Manuel pratique de parfumerie couvrant les principes de formulation, les familles olfactives et les techniques de création.',
      keywords: JSON.stringify(['parfumerie', 'formulation', 'création', 'familles olfactives']),
      language: 'en',
      research_domain: 'formulation',
      relevance_score: 92,
      read_status: 'read'
    },
    {
      entry_key: 'perfumum_kraft2000',
      entry_type: 'inbook',
      title: 'Aroma Chemicals IV: Musks',
      authors: 'Philip Kraft',
      year: 2000,
      booktitle: 'Chemistry of Fragrances',
      publisher: 'Wiley-VCH',
      pages: '143-168',
      abstract: 'Revue complète sur la chimie des muscs synthétiques et leurs applications en parfumerie.',
      keywords: JSON.stringify(['muscs', 'synthèse', 'parfumerie', 'chimie']),
      language: 'en',
      research_domain: 'formulation',
      relevance_score: 85,
      read_status: 'read'
    },
    {
      entry_key: 'perfumum_surburg2006',
      entry_type: 'book',
      title: 'Common Fragrance and Flavor Materials: Preparation, Properties and Uses',
      authors: 'Horst Surburg, Johannes Panten',
      year: 2006,
      publisher: 'Wiley-VCH',
      edition: '5th',
      isbn: '978-3527315154',
      abstract: 'Encyclopédie des matières premières de parfumerie et aromatique avec propriétés physico-chimiques et applications.',
      keywords: JSON.stringify(['matières premières', 'parfumerie', 'aromatique', 'propriétés']),
      language: 'en',
      research_domain: 'formulation',
      relevance_score: 95,
      read_status: 'read'
    },
    {
      entry_key: 'perfumum_poucher2000',
      entry_type: 'book',
      title: 'Poucher\'s Perfumes, Cosmetics and Soaps',
      authors: 'Hilda Butler',
      year: 2000,
      publisher: 'Springer',
      edition: '10th',
      isbn: '978-0751404791',
      abstract: 'Ouvrage de référence sur la formulation des parfums, cosmétiques et savons. Couvre matières premières, techniques et réglementation.',
      keywords: JSON.stringify(['formulation', 'cosmétiques', 'parfums', 'savons', 'réglementation']),
      language: 'en',
      research_domain: 'formulation',
      relevance_score: 90,
      read_status: 'read'
    },
    
    // ============================================================================
    // RÉGLEMENTATION ET SÉCURITÉ
    // ============================================================================
    {
      entry_key: 'perfumum_ifra2020',
      entry_type: 'techreport',
      title: 'IFRA Standards Library - 49th Amendment',
      authors: 'International Fragrance Association',
      year: 2020,
      publisher: 'IFRA',
      url: 'https://ifrafragrance.org/standards/IFRA_Standards_Library',
      abstract: 'Standards de l\'industrie de la parfumerie définissant les limites d\'utilisation des ingrédients parfumants.',
      keywords: JSON.stringify(['IFRA', 'réglementation', 'sécurité', 'standards', 'parfumerie']),
      language: 'en',
      research_domain: 'reglementation',
      relevance_score: 100,
      read_status: 'read'
    },
    {
      entry_key: 'perfumum_api2008',
      entry_type: 'article',
      title: 'Dermal sensitization quantitative risk assessment (QRA) for fragrance ingredients',
      authors: 'Anne Marie Api, David A. Basketter, et al.',
      year: 2008,
      journal: 'Regulatory Toxicology and Pharmacology',
      volume: '52',
      number: '1',
      pages: '3-23',
      doi: '10.1016/j.yrtph.2008.01.006',
      abstract: 'Méthodologie d\'évaluation quantitative des risques de sensibilisation cutanée pour les ingrédients parfumants.',
      keywords: JSON.stringify(['QRA', 'sensibilisation', 'dermatologie', 'sécurité', 'parfumerie']),
      language: 'en',
      research_domain: 'reglementation',
      relevance_score: 88,
      read_status: 'read'
    },
    
    // ============================================================================
    // BASES DE DONNÉES ET RESSOURCES
    // ============================================================================
    {
      entry_key: 'perfumum_pubchem2023',
      entry_type: 'online',
      title: 'PubChem Compound Database',
      authors: 'National Center for Biotechnology Information',
      year: 2023,
      publisher: 'NCBI/NIH',
      url: 'https://pubchem.ncbi.nlm.nih.gov/',
      abstract: 'Base de données publique de structures chimiques et propriétés biologiques. Ressource essentielle pour les données moléculaires.',
      keywords: JSON.stringify(['base de données', 'chimie', 'structures', 'propriétés']),
      language: 'en',
      research_domain: 'chimie_olfactive',
      relevance_score: 95,
      read_status: 'read'
    },
    {
      entry_key: 'perfumum_thegoodscents2023',
      entry_type: 'online',
      title: 'The Good Scents Company Information System',
      authors: 'The Good Scents Company',
      year: 2023,
      url: 'http://www.thegoodscentscompany.com/',
      abstract: 'Base de données commerciale sur les matières premières de parfumerie et aromatique avec descriptions olfactives.',
      keywords: JSON.stringify(['base de données', 'parfumerie', 'aromatique', 'descriptions olfactives']),
      language: 'en',
      research_domain: 'formulation',
      relevance_score: 90,
      read_status: 'read'
    },
    {
      entry_key: 'perfumum_flavornet2004',
      entry_type: 'online',
      title: 'Flavornet and Human Odor Space',
      authors: 'Terry E. Acree, Heinrich Arn',
      year: 2004,
      url: 'http://www.flavornet.org/',
      abstract: 'Base de données des composés volatils détectés par GC-O avec descripteurs olfactifs et seuils de détection.',
      keywords: JSON.stringify(['GC-O', 'composés volatils', 'seuils', 'descripteurs']),
      language: 'en',
      research_domain: 'chimie_olfactive',
      relevance_score: 88,
      read_status: 'read'
    },
    
    // ============================================================================
    // CANNABIS ET TERPÈNES (Recherche PERFUMUM spécifique)
    // ============================================================================
    {
      entry_key: 'perfumum_booth2017',
      entry_type: 'article',
      title: 'Terpene synthases from Cannabis sativa',
      authors: 'Judith K. Booth, Jonathan E. Page, Jörg Bohlmann',
      year: 2017,
      journal: 'PLOS ONE',
      volume: '12',
      number: '3',
      pages: 'e0173911',
      doi: '10.1371/journal.pone.0173911',
      abstract: 'Identification et caractérisation des terpène synthases du cannabis. Fondamental pour comprendre la biosynthèse des terpènes.',
      keywords: JSON.stringify(['cannabis', 'terpène synthases', 'biosynthèse', 'enzymes']),
      language: 'en',
      research_domain: 'tabac_cannabis',
      relevance_score: 90,
      read_status: 'read'
    },
    {
      entry_key: 'perfumum_andre2016',
      entry_type: 'article',
      title: 'Cannabis sativa: The Plant of the Thousand and One Molecules',
      authors: 'Christelle M. Andre, Jean-François Hausman, Gea Guerriero',
      year: 2016,
      journal: 'Frontiers in Plant Science',
      volume: '7',
      pages: '19',
      doi: '10.3389/fpls.2016.00019',
      abstract: 'Revue complète sur la phytochimie du cannabis incluant cannabinoïdes, terpènes et flavonoïdes.',
      keywords: JSON.stringify(['cannabis', 'phytochimie', 'cannabinoïdes', 'terpènes', 'flavonoïdes']),
      language: 'en',
      research_domain: 'tabac_cannabis',
      relevance_score: 92,
      read_status: 'read'
    },
    
    // ============================================================================
    // TABAC ET ARÔMES (Recherche PERFUMUM spécifique)
    // ============================================================================
    {
      entry_key: 'perfumum_layten1999',
      entry_type: 'book',
      title: 'Tobacco: Production, Chemistry and Technology',
      authors: 'Davis D. Layten, Mark T. Nielsen',
      year: 1999,
      publisher: 'Blackwell Science',
      isbn: '978-0632047918',
      abstract: 'Ouvrage de référence sur la production, la chimie et la technologie du tabac incluant les composés aromatiques.',
      keywords: JSON.stringify(['tabac', 'chimie', 'arômes', 'production', 'technologie']),
      language: 'en',
      research_domain: 'tabac_cannabis',
      relevance_score: 88,
      read_status: 'read'
    },
    {
      entry_key: 'perfumum_rodgman2013',
      entry_type: 'book',
      title: 'The Chemical Components of Tobacco and Tobacco Smoke',
      authors: 'Alan Rodgman, Thomas A. Perfetti',
      year: 2013,
      publisher: 'CRC Press',
      edition: '2nd',
      isbn: '978-1466515482',
      abstract: 'Encyclopédie des composés chimiques du tabac et de la fumée. Plus de 8400 composés identifiés.',
      keywords: JSON.stringify(['tabac', 'fumée', 'composés chimiques', 'encyclopédie']),
      language: 'en',
      research_domain: 'tabac_cannabis',
      relevance_score: 90,
      read_status: 'read'
    },
    
    // ============================================================================
    // COLOMBIE ET AMÉRIQUE LATINE (Recherche terrain PERFUMUM)
    // ============================================================================
    {
      entry_key: 'perfumum_schultes1992',
      entry_type: 'book',
      title: 'Plants of the Gods: Their Sacred, Healing, and Hallucinogenic Powers',
      authors: 'Richard Evans Schultes, Albert Hofmann',
      year: 1992,
      publisher: 'Healing Arts Press',
      edition: '2nd',
      isbn: '978-0892819799',
      abstract: 'Étude ethnobotanique des plantes psychoactives et sacrées des Amériques. Référence pour les usages traditionnels.',
      keywords: JSON.stringify(['ethnobotanique', 'plantes sacrées', 'Amériques', 'usages traditionnels']),
      language: 'en',
      research_domain: 'ethnobotanique',
      relevance_score: 92,
      read_status: 'read'
    },
    {
      entry_key: 'perfumum_plotkin1993',
      entry_type: 'book',
      title: 'Tales of a Shaman\'s Apprentice',
      authors: 'Mark J. Plotkin',
      year: 1993,
      publisher: 'Viking',
      isbn: '978-0140129915',
      abstract: 'Récit ethnobotanique sur les savoirs traditionnels des chamans amazoniens et leurs plantes médicinales.',
      keywords: JSON.stringify(['ethnobotanique', 'Amazonie', 'chamanisme', 'plantes médicinales']),
      language: 'en',
      research_domain: 'ethnobotanique',
      relevance_score: 85,
      read_status: 'read'
    },
    
    // ============================================================================
    // AFRIQUE DE L'OUEST (Recherche terrain PERFUMUM - Burkina Faso)
    // ============================================================================
    {
      entry_key: 'perfumum_neuwinger1996',
      entry_type: 'book',
      title: 'African Ethnobotany: Poisons and Drugs',
      authors: 'Hans Dieter Neuwinger',
      year: 1996,
      publisher: 'Chapman & Hall',
      isbn: '978-3826100772',
      abstract: 'Encyclopédie des plantes utilisées en médecine traditionnelle africaine avec données chimiques et pharmacologiques.',
      keywords: JSON.stringify(['ethnobotanique', 'Afrique', 'médecine traditionnelle', 'pharmacologie']),
      language: 'en',
      research_domain: 'ethnobotanique',
      relevance_score: 90,
      read_status: 'read'
    },
    {
      entry_key: 'perfumum_burkill1985',
      entry_type: 'book',
      title: 'The Useful Plants of West Tropical Africa',
      authors: 'H.M. Burkill',
      year: 1985,
      publisher: 'Royal Botanic Gardens, Kew',
      volume: '1-6',
      abstract: 'Encyclopédie en 6 volumes des plantes utiles d\'Afrique de l\'Ouest tropicale. Référence majeure pour l\'ethnobotanique régionale.',
      keywords: JSON.stringify(['Afrique de l\'Ouest', 'plantes utiles', 'ethnobotanique', 'encyclopédie']),
      language: 'en',
      research_domain: 'ethnobotanique',
      relevance_score: 95,
      read_status: 'read'
    }
  ];
  
  console.log(`📖 Ajout de ${references.length} références scientifiques...\n`);
  
  let added = 0;
  let skipped = 0;
  
  for (const ref of references) {
    try {
      // Construire la requête d'insertion dynamiquement
      const columns = Object.keys(ref).join(', ');
      const placeholders = Object.keys(ref).map(() => '?').join(', ');
      const values = Object.values(ref);
      
      await connection.execute(
        `INSERT INTO bibliography_entries (${columns}) VALUES (${placeholders})
         ON DUPLICATE KEY UPDATE title = VALUES(title), abstract = VALUES(abstract)`,
        values
      );
      console.log(`  ✓ ${ref.entry_key}: ${ref.title.substring(0, 50)}...`);
      added++;
    } catch (error) {
      console.log(`  ⚠ ${ref.entry_key}: ${error.message}`);
      skipped++;
    }
  }
  
  console.log(`\n✅ Terminé: ${added} références ajoutées, ${skipped} ignorées`);
  
  // Afficher le total
  const [rows] = await connection.execute('SELECT COUNT(*) as total FROM bibliography_entries');
  console.log(`📊 Total dans la base: ${rows[0].total} références bibliographiques`);
  
  // Afficher la répartition par domaine
  console.log('\n📊 Répartition par domaine de recherche:');
  const [domains] = await connection.execute(`
    SELECT research_domain, COUNT(*) as count 
    FROM bibliography_entries 
    WHERE research_domain IS NOT NULL 
    GROUP BY research_domain 
    ORDER BY count DESC
  `);
  for (const domain of domains) {
    console.log(`  • ${domain.research_domain}: ${domain.count} références`);
  }
  
  await connection.end();
}

main().catch(console.error);
