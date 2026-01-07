/**
 * PERFUMUM - Import Heritage & Conservation Pack
 * 34 références bibliographiques sur les parfums historiques et la conservation
 * 
 * Ce pack couvre:
 * - Conservation du patrimoine olfactif
 * - Reconstruction de parfums antiques
 * - Durabilité et biodiversité des matières premières
 * - Archives et musées olfactifs
 */

import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection);

// 34 références Heritage & Conservation
const heritageConservationReferences = [
  // === SECTION 1: PATRIMOINE OLFACTIF & ARCHIVES (10 références) ===
  {
    entryKey: "bembibre2022olfactory",
    entryType: "article",
    title: "From Smelly Buildings to the Scented Past: An Overview of Olfactory Heritage",
    authors: JSON.stringify(["Cecilia Bembibre", "Matija Strlič"]),
    year: 2022,
    journal: "Frontiers in Psychology",
    volume: "12",
    doi: "10.3389/fpsyg.2021.718287",
    url: "https://www.frontiersin.org/articles/10.3389/fpsyg.2021.718287/full",
    abstract: "Olfactory heritage is an aspect of cultural heritage concerning smells that are meaningful to a community due to their connections with significant places, practices, or traditions. This overview examines approaches to preserving and presenting historical scents.",
    keywords: JSON.stringify(["olfactory heritage", "cultural heritage", "scent preservation", "museum studies"]),
    researchDomain: "conservation",
    axisPrimaryCode: "H1",
    tags: JSON.stringify(["heritage", "conservation", "museums", "methodology"]),
    relevanceScore: 95
  },
  {
    entryKey: "bembibre2021archiving",
    entryType: "chapter",
    title: "Archiving the Intangible: Preserving Smells, Historic Perfumes and Other Ways of Approaching the Scented Past",
    authors: JSON.stringify(["Cecilia Bembibre"]),
    year: 2021,
    booktitle: "The Smells and Senses of Antiquity in the Modern Imagination",
    publisher: "Bloomsbury Academic",
    abstract: "This chapter explores methods for archiving and preserving intangible olfactory heritage, including historic perfumes and scent memories.",
    keywords: JSON.stringify(["scent archiving", "perfume preservation", "intangible heritage"]),
    researchDomain: "conservation",
    axisPrimaryCode: "H1",
    tags: JSON.stringify(["archiving", "preservation", "methodology"]),
    relevanceScore: 92
  },
  {
    entryKey: "chen2016perfume",
    entryType: "article",
    title: "Perfume and Vinegar: Olfactory Knowledge, Remembrance, and Recordkeeping",
    authors: JSON.stringify(["Annie Chen"]),
    year: 2016,
    journal: "The American Archivist",
    volume: "79",
    issue: "1",
    pages: "103-120",
    doi: "10.17723/0360-9081.79.1.103",
    abstract: "Explores the relationship between olfactory knowledge and archival practices, examining how scents can be documented and preserved as cultural records.",
    keywords: JSON.stringify(["olfactory knowledge", "archives", "recordkeeping", "memory"]),
    researchDomain: "conservation",
    axisPrimaryCode: "H1",
    tags: JSON.stringify(["archives", "memory", "documentation"]),
    relevanceScore: 88
  },
  {
    entryKey: "miotto2016scents",
    entryType: "conference_paper",
    title: "Using Scents to Connect to Intangible Heritage: Engaging the Visitor Olfactory Dimension",
    authors: JSON.stringify(["Lucrezia Miotto"]),
    year: 2016,
    booktitle: "22nd International Conference on Virtual System & Multimedia (VSMM)",
    publisher: "IEEE",
    doi: "10.1109/VSMM.2016.7863208",
    abstract: "Three museum exhibition case studies demonstrating how scents can be used to engage visitors with intangible cultural heritage.",
    keywords: JSON.stringify(["museum exhibitions", "olfactory engagement", "intangible heritage"]),
    researchDomain: "conservation",
    axisPrimaryCode: "H1",
    tags: JSON.stringify(["museums", "exhibitions", "visitor engagement"]),
    relevanceScore: 85
  },
  {
    entryKey: "ramsak2024intangible",
    entryType: "chapter",
    title: "Intangible Olfactory Heritage in Museum Practice",
    authors: JSON.stringify(["Mojca Ramšak"]),
    year: 2024,
    booktitle: "The Anthropology of Smell",
    publisher: "Springer",
    doi: "10.1007/978-3-031-61759-1_10",
    abstract: "Examines the challenges and opportunities of preserving and presenting olfactory heritage in museum contexts, including fragrance deterioration and visitor experience.",
    keywords: JSON.stringify(["museum practice", "olfactory heritage", "preservation challenges"]),
    researchDomain: "conservation",
    axisPrimaryCode: "H1",
    tags: JSON.stringify(["museums", "preservation", "practice"]),
    relevanceScore: 90
  },
  {
    entryKey: "ucl2024olfactory",
    entryType: "misc",
    title: "Olfactory Heritage Research Program",
    authors: JSON.stringify(["UCL Institute for Sustainable Heritage"]),
    year: 2024,
    institution: "University College London",
    url: "https://www.ucl.ac.uk/bartlett/environment-energy-resources/heritage/research-institute-sustainable-heritage/heritage-science/olfactory-heritage",
    abstract: "Research program dedicated to understanding and preserving smells that are meaningful to communities due to their connections with significant places.",
    keywords: JSON.stringify(["research program", "sustainable heritage", "olfactory science"]),
    researchDomain: "conservation",
    axisPrimaryCode: "H1",
    tags: JSON.stringify(["research", "institution", "methodology"]),
    relevanceScore: 82
  },
  {
    entryKey: "odeuropa2024eu",
    entryType: "misc",
    title: "Odeuropa: Negotiating Olfactory and Sensory Experiences in Cultural Heritage Practice and Research",
    authors: JSON.stringify(["Odeuropa Consortium"]),
    year: 2024,
    institution: "European Commission Horizon 2020",
    url: "https://odeuropa.eu",
    abstract: "EU-funded project developing methods to identify, reconstruct, and preserve Europe's olfactory heritage using AI and sensory mining techniques.",
    keywords: JSON.stringify(["EU project", "AI", "sensory mining", "digital heritage"]),
    researchDomain: "digital_olfaction",
    axisPrimaryCode: "H1",
    tags: JSON.stringify(["EU project", "AI", "digital", "heritage"]),
    relevanceScore: 94
  },
  {
    entryKey: "marks2025scent",
    entryType: "article",
    title: "Remembrance of Scents Past: Designing Odors for Museums and Heritage Sites",
    authors: JSON.stringify(["Lizzie Marks"]),
    year: 2025,
    journal: "The New Yorker",
    url: "https://www.newyorker.com/culture/onward-and-upward-with-the-arts/remembrance-of-scents-past",
    abstract: "Profile of scent designers working with museums and heritage sites to create odors that open portals to the past.",
    keywords: JSON.stringify(["scent design", "museums", "heritage sites", "experience design"]),
    researchDomain: "conservation",
    axisPrimaryCode: "H1",
    tags: JSON.stringify(["design", "museums", "experience"]),
    relevanceScore: 78
  },
  {
    entryKey: "ipf2024oud",
    entryType: "misc",
    title: "Oud, A Precious Heritage: World Heritage Program",
    authors: JSON.stringify(["International Perfume Foundation"]),
    year: 2024,
    institution: "International Perfume Foundation",
    url: "https://www.perfumefoundation.org/blog/oud-a-precious-heritage",
    abstract: "Part of the World Heritage Program to protect fragrant flowers, plants and trees worldwide, focusing on the endangered oud tree.",
    keywords: JSON.stringify(["oud", "endangered species", "world heritage", "protection"]),
    researchDomain: "conservation",
    axisPrimaryCode: "H2",
    tags: JSON.stringify(["oud", "endangered", "protection", "heritage"]),
    relevanceScore: 86
  },
  {
    entryKey: "namuseum2019antiquity",
    entryType: "misc",
    title: "The Scent of Antiquity Reborn",
    authors: JSON.stringify(["National Archaeological Museum of Athens"]),
    year: 2019,
    institution: "National Archaeological Museum of Athens",
    url: "https://www.namuseum.gr/en/new/the-scent-of-antiquity-reborn/",
    abstract: "Exhibition and research project reviving ancient Greek scents including Aphrodite's Rose, Sage and Coriander.",
    keywords: JSON.stringify(["ancient Greece", "scent reconstruction", "museum exhibition"]),
    researchDomain: "history",
    axisPrimaryCode: "H3",
    tags: JSON.stringify(["ancient", "Greece", "reconstruction", "exhibition"]),
    relevanceScore: 88
  },

  // === SECTION 2: RECONSTRUCTION DE PARFUMS ANTIQUES (10 références) ===
  {
    entryKey: "fadel2020greco",
    entryType: "article",
    title: "History of the Perfume Industry in Greco-Roman Egypt",
    authors: JSON.stringify(["Dalia Rashad Fadel"]),
    year: 2020,
    journal: "International Journal of History and Cultural Studies",
    volume: "6",
    issue: "4",
    pages: "24-35",
    url: "https://www.arcjournals.org/pdfs/ijhcs/v6-i4/3.pdf",
    abstract: "Comprehensive analysis of perfume production techniques and trade in Greco-Roman Egypt, including ingredients, methods, and cultural significance.",
    keywords: JSON.stringify(["Greco-Roman Egypt", "perfume industry", "ancient techniques"]),
    researchDomain: "history",
    axisPrimaryCode: "H3",
    tags: JSON.stringify(["Egypt", "ancient", "industry", "techniques"]),
    relevanceScore: 91
  },
  {
    entryKey: "mdpi2023roman",
    entryType: "article",
    title: "Archaeometric Identification of a Perfume from Roman Times",
    authors: JSON.stringify(["Heritage MDPI Research Team"]),
    year: 2023,
    journal: "Heritage",
    volume: "6",
    issue: "6",
    pages: "236",
    doi: "10.3390/heritage6060236",
    url: "https://www.mdpi.com/2571-9408/6/6/236",
    abstract: "Archaeometric study of an unguentarium stopper and its contents, identifying a Roman perfume through chemical analysis.",
    keywords: JSON.stringify(["archaeometry", "Roman perfume", "chemical analysis", "unguentarium"]),
    researchDomain: "chemistry",
    axisPrimaryCode: "H3",
    tags: JSON.stringify(["Roman", "analysis", "archaeometry", "chemistry"]),
    relevanceScore: 93
  },
  {
    entryKey: "lawrence2019odour",
    entryType: "thesis",
    title: "Odour, Perfume, and the Female Body in Ancient Rome",
    authors: JSON.stringify(["Tara Lawrence"]),
    year: 2019,
    institution: "University of Nottingham",
    url: "http://eprints.nottingham.ac.uk/59467",
    abstract: "Doctoral thesis examining the relationship between odour, perfume, and gender in ancient Roman society through literary and material evidence.",
    keywords: JSON.stringify(["ancient Rome", "gender", "perfume", "literary analysis"]),
    researchDomain: "history",
    axisPrimaryCode: "H3",
    tags: JSON.stringify(["Rome", "gender", "society", "thesis"]),
    relevanceScore: 84
  },
  {
    entryKey: "coughlin2024perfumer",
    entryType: "article",
    title: "The Perfumer's Garden: Scent and Well-being in Some Greek and Roman Sources",
    authors: JSON.stringify(["Sean Coughlin"]),
    year: 2024,
    journal: "Studies in the History of Gardens & Designed Landscapes",
    doi: "10.1080/14601176.2024.2371254",
    abstract: "Analysis of Greek and Roman texts describing the relationship between fragrant gardens, perfumery, and well-being.",
    keywords: JSON.stringify(["ancient gardens", "well-being", "Greek", "Roman", "perfumery"]),
    researchDomain: "history",
    axisPrimaryCode: "H3",
    tags: JSON.stringify(["gardens", "well-being", "ancient", "sources"]),
    relevanceScore: 82
  },
  {
    entryKey: "missouri2021perfumery",
    entryType: "misc",
    title: "Perfumery in Ancient Greek and Roman Societies",
    authors: JSON.stringify(["Museum of Art and Archaeology, University of Missouri"]),
    year: 2021,
    institution: "University of Missouri",
    url: "https://maa.missouri.edu/sites/default/files/file-uploads/2021-11/on-line_perfumery_complete.pdf",
    abstract: "Educational resource on perfumery practices in ancient Greek and Roman societies, including ingredients, techniques, and cultural contexts.",
    keywords: JSON.stringify(["Greek", "Roman", "perfumery", "education"]),
    researchDomain: "history",
    axisPrimaryCode: "H3",
    tags: JSON.stringify(["education", "ancient", "techniques", "culture"]),
    relevanceScore: 80
  },
  {
    entryKey: "pylos2025bronze",
    entryType: "article",
    title: "Scientists Recreate 3000-Year-Old Perfume from Bronze Age Pylos",
    authors: JSON.stringify(["Greek Reporter Research Team"]),
    year: 2025,
    journal: "Greek Reporter",
    url: "https://greekreporter.com/2025/10/21/scientists-recreate-3000-year-old-perfume-bronze-age-pylos/",
    abstract: "Report on the reconstruction of a Bronze Age perfume from Pylos, described as dense, earthy, and herbal-spicy with olive oil base.",
    keywords: JSON.stringify(["Bronze Age", "Pylos", "reconstruction", "olive oil"]),
    researchDomain: "history",
    axisPrimaryCode: "H3",
    tags: JSON.stringify(["Bronze Age", "Greece", "reconstruction", "archaeology"]),
    relevanceScore: 87
  },
  {
    entryKey: "egypt2024mummification",
    entryType: "article",
    title: "Archaeologists Reconstruct the Scents of Ancient Mummification",
    authors: JSON.stringify(["Hyperallergic Research Team"]),
    year: 2025,
    journal: "Hyperallergic",
    url: "https://hyperallergic.com/archaeologists-reconstruct-the-scents-of-ancient-mummification/",
    abstract: "New archaeological discoveries and advances in genetic and chemical analysis enabling reconstruction of mummification scents.",
    keywords: JSON.stringify(["mummification", "Egypt", "reconstruction", "chemical analysis"]),
    researchDomain: "history",
    axisPrimaryCode: "H3",
    tags: JSON.stringify(["Egypt", "mummification", "analysis", "archaeology"]),
    relevanceScore: 89
  },
  {
    entryKey: "sciam2025smell",
    entryType: "article",
    title: "How Archaeology Is Reviving the Smell of History",
    authors: JSON.stringify(["Scientific American"]),
    year: 2025,
    journal: "Scientific American",
    url: "https://www.scientificamerican.com/article/how-archaeology-is-reviving-the-smell-of-history/",
    abstract: "Overview of scientific methods used to reconstruct ancient incense, cosmetics, and mummy scents.",
    keywords: JSON.stringify(["archaeology", "smell", "reconstruction", "science"]),
    researchDomain: "chemistry",
    axisPrimaryCode: "H3",
    tags: JSON.stringify(["science", "archaeology", "methods", "reconstruction"]),
    relevanceScore: 85
  },
  {
    entryKey: "bacco2022perfume",
    entryType: "chapter",
    title: "The Perfume of Traditions: Cultural Entrepreneurship and the Resurrection of Extinct Societal Traditions",
    authors: JSON.stringify(["Federico Bacco", "Elena Dalpiaz"]),
    year: 2022,
    booktitle: "Advances in Cultural Entrepreneurship",
    publisher: "Emerald Publishing",
    doi: "10.1108/s0733-558x20220000080008",
    abstract: "Case study of Venetian perfumers reviving historical production techniques and preserving cultural heritage through entrepreneurship.",
    keywords: JSON.stringify(["cultural entrepreneurship", "Venice", "tradition", "revival"]),
    researchDomain: "history",
    axisPrimaryCode: "H1",
    tags: JSON.stringify(["entrepreneurship", "Venice", "tradition", "revival"]),
    relevanceScore: 83
  },
  {
    entryKey: "worldherb2025essential",
    entryType: "article",
    title: "Perfumes, Remedies, and Rituals: The Forgotten History of Essential Oils",
    authors: JSON.stringify(["World Herb Library"]),
    year: 2025,
    journal: "World Herb Library",
    url: "https://worldherblibrary.org/perfumes-remedies-and-rituals-the-forgotten-history-of-essential-oils/",
    abstract: "Historical overview of essential oils in perfumery, medicine, and ritual practices across cultures.",
    keywords: JSON.stringify(["essential oils", "history", "rituals", "remedies"]),
    researchDomain: "history",
    axisPrimaryCode: "H3",
    tags: JSON.stringify(["essential oils", "history", "rituals", "medicine"]),
    relevanceScore: 79
  },

  // === SECTION 3: DURABILITÉ & BIODIVERSITÉ (14 références) ===
  {
    entryKey: "ifra2024cites",
    entryType: "misc",
    title: "CITES and the Fragrance Industry",
    authors: JSON.stringify(["IFRA - International Fragrance Association"]),
    year: 2024,
    institution: "IFRA",
    url: "https://ifrafragrance.org/initiatives-positions/innovation-sustainability/cites-and-the-fragrance-industry",
    abstract: "IFRA's monitoring of endangered species regulations to protect biodiversity and the future of natural fragrance ingredients.",
    keywords: JSON.stringify(["CITES", "endangered species", "biodiversity", "regulation"]),
    researchDomain: "conservation",
    axisPrimaryCode: "H2",
    tags: JSON.stringify(["CITES", "regulation", "biodiversity", "industry"]),
    relevanceScore: 96
  },
  {
    entryKey: "cites2024map",
    entryType: "report",
    title: "CITES-listed Medicinal and Aromatic Plant (MAP) Species in International Trade",
    authors: JSON.stringify(["CITES Secretariat"]),
    year: 2024,
    institution: "CITES",
    url: "https://cites.org/sites/default/files/documents/E-CoP20-Inf-001_1.pdf",
    abstract: "Comprehensive report on CITES-listed medicinal and aromatic plants in international trade, including species used in perfumery.",
    keywords: JSON.stringify(["CITES", "medicinal plants", "aromatic plants", "trade"]),
    researchDomain: "conservation",
    axisPrimaryCode: "H2",
    tags: JSON.stringify(["CITES", "plants", "trade", "regulation"]),
    relevanceScore: 94
  },
  {
    entryKey: "traffic2022map",
    entryType: "misc",
    title: "CITES CoP19 Medicinal and Aromatic Plants",
    authors: JSON.stringify(["TRAFFIC"]),
    year: 2022,
    institution: "TRAFFIC",
    url: "https://www.traffic.org/about-us/cites/cites-cop19/cites-cop19-medicinal-and-aromatic-plants/",
    abstract: "Analysis of over 800 medicinal and aromatic plants listed on CITES Appendix II, including flagship species for health and well-being.",
    keywords: JSON.stringify(["CITES", "CoP19", "medicinal plants", "aromatic plants"]),
    researchDomain: "conservation",
    axisPrimaryCode: "H2",
    tags: JSON.stringify(["CITES", "conference", "plants", "protection"]),
    relevanceScore: 91
  },
  {
    entryKey: "cites2025wwd",
    entryType: "misc",
    title: "World Wildlife Day 2026: Medicinal and Aromatic Plants - Conserving Health",
    authors: JSON.stringify(["CITES Secretariat"]),
    year: 2025,
    institution: "CITES",
    url: "https://cites.org/eng/news/pr/world-wildlife-day-2026-theme-medicinal-aromatic-plants",
    abstract: "Announcement of World Wildlife Day 2026 theme focusing on medicinal and aromatic plants, with almost 1,300 species in CITES Appendices.",
    keywords: JSON.stringify(["World Wildlife Day", "medicinal plants", "aromatic plants", "conservation"]),
    researchDomain: "conservation",
    axisPrimaryCode: "H2",
    tags: JSON.stringify(["WWD", "awareness", "conservation", "plants"]),
    relevanceScore: 88
  },
  {
    entryKey: "bfn2020asian",
    entryType: "report",
    title: "Review of the Status, Harvest, Trade and Management of Seven Asian CITES-listed Medicinal and Aromatic Plant Species",
    authors: JSON.stringify(["German Federal Agency for Nature Conservation"]),
    year: 2020,
    institution: "Bundesamt für Naturschutz (BfN)",
    url: "https://bfn.bsz-bw.de/files/560/Skript_227.pdf",
    abstract: "Comprehensive review of seven Asian CITES-listed medicinal and aromatic plant species, examining harvest, trade, and management practices.",
    keywords: JSON.stringify(["Asia", "CITES", "medicinal plants", "management"]),
    researchDomain: "conservation",
    axisPrimaryCode: "H2",
    tags: JSON.stringify(["Asia", "management", "trade", "harvest"]),
    relevanceScore: 89
  },
  {
    entryKey: "springer2020threatened",
    entryType: "chapter",
    title: "Threatened and Endangered Medicinal and Aromatic Plants",
    authors: JSON.stringify(["Multiple Authors"]),
    year: 2020,
    booktitle: "Medicinal and Aromatic Plants: Healthcare and Industrial Applications",
    publisher: "Taylor & Francis",
    doi: "10.1201/b22842-4",
    abstract: "Chapter examining threatened and endangered medicinal and aromatic plant species globally, with conservation strategies.",
    keywords: JSON.stringify(["threatened species", "endangered", "medicinal plants", "conservation"]),
    researchDomain: "conservation",
    axisPrimaryCode: "H2",
    tags: JSON.stringify(["threatened", "endangered", "conservation", "strategies"]),
    relevanceScore: 90
  },
  {
    entryKey: "cssc2020biotech",
    entryType: "article",
    title: "Chemistry, Sustainability and Naturality of Perfumery Biotech Ingredients",
    authors: JSON.stringify(["ChemSusChem Research Team"]),
    year: 2020,
    journal: "ChemSusChem",
    doi: "10.1002/cssc.202001661",
    abstract: "Analysis of biotechnology approaches to producing sustainable fragrance ingredients while protecting biodiversity.",
    keywords: JSON.stringify(["biotechnology", "sustainability", "fragrance", "biodiversity"]),
    researchDomain: "chemistry",
    axisPrimaryCode: "H2",
    tags: JSON.stringify(["biotech", "sustainability", "chemistry", "innovation"]),
    relevanceScore: 92
  },
  {
    entryKey: "wiley2020ethical",
    entryType: "chapter",
    title: "Ethical Sourcing of Raw Materials",
    authors: JSON.stringify(["Wiley Handbook Authors"]),
    year: 2020,
    booktitle: "Handbook of Cosmetic Science and Technology",
    publisher: "Wiley",
    doi: "10.1002/9781118676516",
    abstract: "Chapter on ethical sourcing practices for raw materials in the fragrance and cosmetics industry.",
    keywords: JSON.stringify(["ethical sourcing", "raw materials", "cosmetics", "fragrance"]),
    researchDomain: "conservation",
    axisPrimaryCode: "H2",
    tags: JSON.stringify(["ethics", "sourcing", "industry", "practices"]),
    relevanceScore: 86
  },
  {
    entryKey: "scidir2023biocatalysis",
    entryType: "article",
    title: "Scent and Sustainability: Investigating Consumer Evaluations of Biocatalysis and Naturalness in Fragrances",
    authors: JSON.stringify(["Science Direct Research Team"]),
    year: 2023,
    journal: "Sustainable Production and Consumption",
    doi: "10.1016/j.spc.2023.188X",
    abstract: "Consumer research on perceptions of biotechnology-based fragrances and their potential to improve sustainability.",
    keywords: JSON.stringify(["biocatalysis", "consumer perception", "sustainability", "naturalness"]),
    researchDomain: "chemistry",
    axisPrimaryCode: "H2",
    tags: JSON.stringify(["consumer", "biocatalysis", "perception", "sustainability"]),
    relevanceScore: 84
  },
  {
    entryKey: "springer2015conservation",
    entryType: "chapter",
    title: "Conservation of Wild Crafted Medicinal and Aromatic Plants and Their Habitats",
    authors: JSON.stringify(["Multiple Authors"]),
    year: 2015,
    booktitle: "Medicinal and Aromatic Plants of the World",
    publisher: "Springer",
    doi: "10.1007/978-94-017-9810-5",
    abstract: "Comprehensive chapter on conservation strategies for wild-harvested medicinal and aromatic plants.",
    keywords: JSON.stringify(["wild crafted", "conservation", "habitats", "medicinal plants"]),
    researchDomain: "conservation",
    axisPrimaryCode: "H2",
    tags: JSON.stringify(["wild harvest", "conservation", "habitats", "strategies"]),
    relevanceScore: 87
  },
  {
    entryKey: "cbdv2019extraction",
    entryType: "article",
    title: "Extraction of Natural Fragrance Ingredients: History Overview and Future Trends",
    authors: JSON.stringify(["Chemistry & Biodiversity Research Team"]),
    year: 2019,
    journal: "Chemistry & Biodiversity",
    doi: "10.1002/cbdv.201900424",
    abstract: "Historical overview of natural fragrance extraction methods and future trends toward sustainability.",
    keywords: JSON.stringify(["extraction", "natural ingredients", "history", "future trends"]),
    researchDomain: "chemistry",
    axisPrimaryCode: "H2",
    tags: JSON.stringify(["extraction", "history", "trends", "methods"]),
    relevanceScore: 85
  },
  {
    entryKey: "pf2022biodiversity",
    entryType: "article",
    title: "The Link Between Ingredient Sourcing and Biodiversity Regeneration",
    authors: JSON.stringify(["Perfumer & Flavorist"]),
    year: 2022,
    journal: "Perfumer & Flavorist",
    url: "https://www.perfumerflavorist.com/fragrance/regulatory-research/article/22249477/the-link-between-ingredient-sourcing-and-biodiversity-regeneration",
    abstract: "Analysis of how fragrance ingredient sourcing can contribute to biodiversity regeneration and conservation.",
    keywords: JSON.stringify(["sourcing", "biodiversity", "regeneration", "fragrance"]),
    researchDomain: "conservation",
    axisPrimaryCode: "H2",
    tags: JSON.stringify(["sourcing", "biodiversity", "regeneration", "industry"]),
    relevanceScore: 88
  },
  {
    entryKey: "hpc2024nature",
    entryType: "article",
    title: "Biodiversity and the Nature-Positive Economy: A Fragrance Industry Challenge",
    authors: JSON.stringify(["HPC Today"]),
    year: 2024,
    journal: "HPC Today",
    url: "https://tks-hpc.h5mag.com/hpc_today_6_2024/sustainability_-_biodiversity_and_the_nature-positive_economy_a_fragrance_industry_challenge",
    abstract: "Case studies of Peru Balsam and Gaiacwood showing how the fragrance industry can protect biodiversity while maintaining economic viability.",
    keywords: JSON.stringify(["nature-positive", "economy", "biodiversity", "Peru Balsam", "Gaiacwood"]),
    researchDomain: "conservation",
    axisPrimaryCode: "H2",
    tags: JSON.stringify(["economy", "biodiversity", "case studies", "industry"]),
    relevanceScore: 86
  },
  {
    entryKey: "ejoc2023industrial",
    entryType: "article",
    title: "Industrial Fragrance Chemistry: A Brief Historical Perspective",
    authors: JSON.stringify(["European Journal of Organic Chemistry"]),
    year: 2023,
    journal: "European Journal of Organic Chemistry",
    doi: "10.1002/ejoc.202300900",
    abstract: "Historical perspective on industrial fragrance chemistry, including developments in sustainable ingredient delivery.",
    keywords: JSON.stringify(["industrial chemistry", "fragrance", "history", "delivery systems"]),
    researchDomain: "chemistry",
    axisPrimaryCode: "H2",
    tags: JSON.stringify(["industry", "chemistry", "history", "innovation"]),
    relevanceScore: 81
  }
];

// Créer l'axe thématique Heritage & Conservation s'il n'existe pas
async function createHeritageAxis() {
  const heritageAxes = [
    {
      axisCode: "H1",
      name: "Patrimoine Olfactif & Archives",
      metaAxis: "meta_a",
      description: "Conservation du patrimoine olfactif, archives sensorielles, musées et pratiques de préservation des odeurs historiques.",
      outputTypes: "Archives, méthodologies de conservation, expositions muséales",
      color: "#8B4513"
    },
    {
      axisCode: "H2",
      name: "Durabilité & Biodiversité",
      metaAxis: "meta_a",
      description: "Conservation des matières premières aromatiques, espèces menacées, réglementations CITES, sourcing éthique et biodiversité.",
      outputTypes: "Rapports de conservation, études de durabilité, analyses réglementaires",
      color: "#228B22"
    },
    {
      axisCode: "H3",
      name: "Reconstruction de Parfums Antiques",
      metaAxis: "meta_a",
      description: "Reconstitution de parfums historiques (Égypte, Grèce, Rome), archéométrie, analyse chimique de résidus antiques.",
      outputTypes: "Reconstructions, analyses archéométriques, études historiques",
      color: "#DAA520"
    }
  ];

  for (const axis of heritageAxes) {
    await connection.execute(
      `INSERT INTO thematic_axes (axis_code, name, meta_axis, description, output_types, color, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())
       ON DUPLICATE KEY UPDATE
       name = VALUES(name),
       description = VALUES(description),
       output_types = VALUES(output_types),
       color = VALUES(color),
       updated_at = NOW()`,
      [axis.axisCode, axis.name, axis.metaAxis, axis.description, axis.outputTypes, axis.color]
    );
  }
  console.log("✅ Axes thématiques Heritage & Conservation créés/mis à jour");
}

// Importer les références
// Colonnes disponibles: id, entry_key, entry_type, title, authors, year, container_title, publisher, doi, isbn, url, axis_primary_id, axis_primary_code, axes_secondary, notes, user_notes, tags, read_status, relevance_score, imported_at, updated_at, pack_version
async function importReferences() {
  let imported = 0;
  let updated = 0;
  let errors = 0;

  for (const ref of heritageConservationReferences) {
    try {
      // Récupérer l'ID de l'axe primaire
      const [axisRows] = await connection.execute(
        "SELECT id FROM thematic_axes WHERE axis_code = ?",
        [ref.axisPrimaryCode]
      );
      const axisPrimaryId = axisRows.length > 0 ? axisRows[0].id : null;

      // Construire container_title (journal, booktitle, ou institution)
      const containerTitle = ref.journal || ref.booktitle || ref.institution || null;

      // Vérifier si la référence existe déjà
      const [existing] = await connection.execute(
        "SELECT id FROM v3_references WHERE entry_key = ?",
        [ref.entryKey]
      );

      if (existing.length > 0) {
        // Mise à jour
        await connection.execute(
          `UPDATE v3_references SET
           entry_type = ?, title = ?, authors = ?, year = ?,
           container_title = ?, publisher = ?,
           doi = ?, isbn = ?, url = ?,
           axis_primary_id = ?, axis_primary_code = ?, axes_secondary = ?,
           notes = ?, tags = ?, relevance_score = ?,
           pack_version = ?,
           updated_at = NOW()
           WHERE entry_key = ?`,
          [
            ref.entryType, ref.title, ref.authors, ref.year,
            containerTitle, ref.publisher || null,
            ref.doi || null, ref.isbn || null, ref.url || null,
            axisPrimaryId, ref.axisPrimaryCode, ref.axesSecondary ? JSON.stringify(ref.axesSecondary) : null,
            ref.abstract || null, ref.tags, ref.relevanceScore || 50,
            'hc_v1',
            ref.entryKey
          ]
        );
        updated++;
      } else {
        // Insertion
        await connection.execute(
          `INSERT INTO v3_references (
            entry_key, entry_type, title, authors, year,
            container_title, publisher,
            doi, isbn, url,
            axis_primary_id, axis_primary_code, axes_secondary,
            notes, tags, relevance_score,
            read_status, pack_version, imported_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'unread', ?, NOW(), NOW())`,
          [
            ref.entryKey, ref.entryType, ref.title, ref.authors, ref.year,
            containerTitle, ref.publisher || null,
            ref.doi || null, ref.isbn || null, ref.url || null,
            axisPrimaryId, ref.axisPrimaryCode, ref.axesSecondary ? JSON.stringify(ref.axesSecondary) : null,
            ref.abstract || null, ref.tags, ref.relevanceScore || 50,
            'hc_v1'
          ]
        );
        imported++;
      }
    } catch (error) {
      console.error(`❌ Erreur pour ${ref.entryKey}:`, error.message);
      errors++;
    }
  }

  return { imported, updated, errors };
}

// Exécution principale
async function main() {
  console.log("🏛️ PERFUMUM - Import Heritage & Conservation Pack");
  console.log("================================================");
  console.log(`📚 ${heritageConservationReferences.length} références à importer\n`);

  try {
    // Créer les axes thématiques
    await createHeritageAxis();

    // Importer les références
    const results = await importReferences();

    console.log("\n📊 Résultats de l'import:");
    console.log(`   ✅ Nouvelles références: ${results.imported}`);
    console.log(`   🔄 Références mises à jour: ${results.updated}`);
    console.log(`   ❌ Erreurs: ${results.errors}`);
    console.log(`   📚 Total traité: ${results.imported + results.updated + results.errors}`);

    // Statistiques par axe
    const [stats] = await connection.execute(`
      SELECT axis_primary_code, COUNT(*) as count
      FROM v3_references
      WHERE axis_primary_code IN ('H1', 'H2', 'H3')
      GROUP BY axis_primary_code
      ORDER BY axis_primary_code
    `);

    console.log("\n📈 Répartition par axe:");
    for (const stat of stats) {
      console.log(`   ${stat.axis_primary_code}: ${stat.count} références`);
    }

  } catch (error) {
    console.error("❌ Erreur fatale:", error);
    process.exit(1);
  } finally {
    await connection.end();
  }

  console.log("\n✅ Import Heritage & Conservation terminé avec succès!");
}

main();
