/**
 * Script d'import complet de toutes les sources bibliographiques
 * À exécuter via: npx tsx scripts/import-all-sources.ts
 */

import { getDb } from "../server/db";
import { bibliographyEntries, InsertBibliographyEntry } from "../drizzle/schema";

// Toutes les sources à importer
const allSources: InsertBibliographyEntry[] = [
  // ============================================================================
  // PHÉNOMÉNOLOGIE ET PHILOSOPHIE
  // ============================================================================
  {
    entryKey: "merleau-ponty-1945",
    entryType: "book",
    title: "Phénoménologie de la perception",
    authors: "Maurice Merleau-Ponty",
    year: 1945,
    publisher: "Gallimard",
    researchDomain: "neurologie_olfactive",
    abstract: "Ouvrage fondateur de la phénoménologie de la perception, explorant comment le corps propre constitue notre accès au monde sensible. Référence majeure pour comprendre l'expérience olfactive comme événement partagé entre le monde et le corps.",
    keywords: ["phénoménologie", "perception", "corps", "sensorialité", "expérience"],
    language: "fr",
    readStatus: "to_review",
    relevanceScore: 95,
  },
  {
    entryKey: "bohme-2016",
    entryType: "book",
    title: "The Aesthetics of Atmospheres",
    authors: "Gernot Böhme",
    year: 2016,
    publisher: "Routledge",
    isbn: "978-1138688315",
    researchDomain: "neurologie_olfactive",
    abstract: "Théorie des atmosphères comme qualités sensibles produites par la présence des objets dans l'espace. Concept fondamental pour PERFUMUM : l'odeur comme matériau sculptural atmosphérique.",
    keywords: ["atmosphères", "esthétique", "espace", "perception", "ambiance"],
    language: "en",
    readStatus: "to_review",
    relevanceScore: 95,
  },
  {
    entryKey: "bohme-2017",
    entryType: "book",
    title: "Atmospheric Architectures: The Aesthetics of Felt Spaces",
    authors: "Gernot Böhme",
    year: 2017,
    publisher: "Bloomsbury Academic",
    isbn: "978-1474258043",
    researchDomain: "neurologie_olfactive",
    abstract: "Application de la théorie des atmosphères à l'architecture et aux espaces vécus. Pertinent pour les installations olfactives et la conception d'espaces sensoriels.",
    keywords: ["architecture", "atmosphères", "espaces", "design", "sensorialité"],
    language: "en",
    readStatus: "to_review",
    relevanceScore: 85,
  },

  // ============================================================================
  // CHIMIE ET PARFUMERIE - OUVRAGES DE RÉFÉRENCE
  // ============================================================================
  {
    entryKey: "arctander-1969",
    entryType: "book",
    title: "Perfume and Flavor Chemicals (Aroma Chemicals)",
    authors: "Steffen Arctander",
    year: 1969,
    publisher: "Allured Publishing",
    researchDomain: "chimie_olfactive",
    abstract: "Encyclopédie de référence sur les matériaux aromatiques, décrivant plus de 3000 substances avec leurs propriétés olfactives, chimiques et applications. Bible du parfumeur.",
    keywords: ["parfumerie", "chimie", "arômes", "encyclopédie", "matières premières"],
    language: "en",
    readStatus: "to_review",
    relevanceScore: 100,
  },
  {
    entryKey: "guenther-1948",
    entryType: "book",
    title: "The Essential Oils (6 volumes)",
    authors: "Ernest Guenther",
    year: 1948,
    publisher: "Van Nostrand",
    researchDomain: "chimie_olfactive",
    abstract: "Encyclopédie exhaustive des huiles essentielles en 6 volumes, couvrant leur chimie, extraction, propriétés et applications. Référence historique majeure.",
    keywords: ["huiles essentielles", "chimie", "extraction", "encyclopédie", "botanique"],
    language: "en",
    readStatus: "to_review",
    relevanceScore: 90,
  },
  {
    entryKey: "bauer-2001",
    entryType: "book",
    title: "Common Fragrance and Flavor Materials: Preparation, Properties and Uses",
    authors: "Kurt Bauer, Dorothea Garbe, Horst Surburg",
    year: 2001,
    publisher: "Wiley-VCH",
    isbn: "978-3527303649",
    researchDomain: "chimie_olfactive",
    abstract: "Manuel de référence sur les matériaux de parfumerie et d'aromatique alimentaire. Couvre la préparation, les propriétés et les utilisations des ingrédients courants.",
    keywords: ["parfumerie", "arômes", "chimie", "matières premières", "synthèse"],
    language: "en",
    readStatus: "to_review",
    relevanceScore: 90,
  },

  // ============================================================================
  // MÉTHODOLOGIE PARFUMERIE
  // ============================================================================
  {
    entryKey: "carles-1961",
    entryType: "article",
    title: "A Method of Creation in Perfumery",
    authors: "Jean Carles",
    year: 1961,
    journal: "Soap, Perfumery & Cosmetics",
    researchDomain: "formulation",
    abstract: "Présentation de la méthode systématique de formation olfactive et de création parfumée. Méthode fondatrice utilisée dans PERFUMUM pour l'entraînement olfactif quotidien.",
    keywords: ["méthode", "formation", "création", "parfumerie", "éducation olfactive"],
    language: "en",
    readStatus: "read",
    relevanceScore: 100,
  },
  {
    entryKey: "roudnitska-1991",
    entryType: "book",
    title: "Le Parfum",
    authors: "Edmond Roudnitska",
    year: 1991,
    publisher: "Presses Universitaires de France",
    isbn: "978-2130435204",
    researchDomain: "formulation",
    abstract: "Réflexion philosophique et technique sur l'art de la parfumerie par un maître parfumeur. Explore la dimension artistique et esthétique de la création olfactive.",
    keywords: ["parfumerie", "art", "esthétique", "création", "philosophie"],
    language: "fr",
    readStatus: "to_review",
    relevanceScore: 90,
  },
  {
    entryKey: "ellena-2007",
    entryType: "book",
    title: "Le Parfum",
    authors: "Jean-Claude Ellena",
    year: 2007,
    publisher: "Presses Universitaires de France",
    isbn: "978-2130561637",
    researchDomain: "formulation",
    abstract: "Témoignage et réflexions d'un parfumeur contemporain sur son art. Vision personnelle de la création olfactive et du métier de parfumeur.",
    keywords: ["parfumerie", "création", "art", "témoignage", "métier"],
    language: "fr",
    readStatus: "to_review",
    relevanceScore: 85,
  },
  {
    entryKey: "ellena-2012",
    entryType: "book",
    title: "Journal d'un parfumeur",
    authors: "Jean-Claude Ellena",
    year: 2012,
    publisher: "Sabine Wespieser",
    isbn: "978-2848051680",
    researchDomain: "formulation",
    abstract: "Journal intime d'un parfumeur, offrant un regard unique sur le processus créatif et la vie quotidienne d'un créateur olfactif.",
    keywords: ["parfumerie", "journal", "création", "processus", "quotidien"],
    language: "fr",
    readStatus: "to_review",
    relevanceScore: 80,
  },

  // ============================================================================
  // ART OLFACTIF
  // ============================================================================
  {
    entryKey: "tolaas-2006",
    entryType: "article",
    title: "The City and the Smell",
    authors: "Sissel Tolaas",
    year: 2006,
    journal: "Urban Studies",
    researchDomain: "histoire_parfumerie",
    abstract: "Exploration artistique des odeurs urbaines et leur rôle dans l'identité des villes. Travail pionnier sur l'art olfactif et la cartographie sensorielle.",
    keywords: ["art olfactif", "ville", "odeurs", "installation", "cartographie"],
    language: "en",
    readStatus: "to_review",
    relevanceScore: 85,
  },
  {
    entryKey: "verbeek-2020",
    entryType: "article",
    title: "Inhaling History: Olfactory Heritage and Museums",
    authors: "Caro Verbeek",
    year: 2020,
    journal: "Museum Management and Curatorship",
    doi: "10.1080/09647775.2020.1803114",
    researchDomain: "histoire_parfumerie",
    abstract: "Étude sur l'intégration des odeurs dans les pratiques muséales et la préservation du patrimoine olfactif. Référence pour les installations muséales de PERFUMUM.",
    keywords: ["muséologie", "patrimoine olfactif", "histoire", "conservation", "exposition"],
    language: "en",
    readStatus: "to_review",
    relevanceScore: 90,
  },

  // ============================================================================
  // ANTHROPOLOGIE SENSORIELLE
  // ============================================================================
  {
    entryKey: "howes-2003",
    entryType: "book",
    title: "Sensual Relations: Engaging the Senses in Culture and Social Theory",
    authors: "David Howes",
    year: 2003,
    publisher: "University of Michigan Press",
    isbn: "978-0472068463",
    researchDomain: "ethnobotanique",
    abstract: "Étude anthropologique des sens et de leur rôle dans les cultures humaines. Fondement théorique pour l'approche interculturelle de PERFUMUM.",
    keywords: ["anthropologie", "sens", "culture", "perception", "société"],
    language: "en",
    readStatus: "to_review",
    relevanceScore: 85,
  },
  {
    entryKey: "classen-1994",
    entryType: "book",
    title: "Aroma: The Cultural History of Smell",
    authors: "Constance Classen, David Howes, Anthony Synnott",
    year: 1994,
    publisher: "Routledge",
    isbn: "978-0415114721",
    researchDomain: "histoire_parfumerie",
    abstract: "Histoire culturelle de l'odorat à travers les civilisations. Exploration des significations sociales et symboliques des odeurs.",
    keywords: ["histoire", "odorat", "culture", "anthropologie", "symbolisme"],
    language: "en",
    readStatus: "to_review",
    relevanceScore: 90,
  },
  {
    entryKey: "corbin-1982",
    entryType: "book",
    title: "Le Miasme et la Jonquille: L'odorat et l'imaginaire social XVIIIe-XIXe siècles",
    authors: "Alain Corbin",
    year: 1982,
    publisher: "Aubier Montaigne",
    isbn: "978-2080812643",
    researchDomain: "histoire_parfumerie",
    abstract: "Étude historique de l'évolution de la perception des odeurs en France aux XVIIIe et XIXe siècles. Analyse de l'imaginaire social lié à l'olfaction.",
    keywords: ["histoire", "odorat", "société", "hygiène", "France"],
    language: "fr",
    readStatus: "to_review",
    relevanceScore: 90,
  },

  // ============================================================================
  // BASES DE DONNÉES ET RESSOURCES EN LIGNE
  // ============================================================================
  {
    entryKey: "aromadb-2018",
    entryType: "online",
    title: "AromaDb: A Database of Plant's Aroma Molecules",
    authors: "Kumar Y., Prakash O., Tripathi H., Tandon S., Gupta M.M., Rahman L.U., Lal R.K., Semwal M., Darokar M.P., Khan F.",
    year: 2018,
    journal: "Frontiers in Plant Science",
    doi: "10.3389/fpls.2018.01081",
    url: "https://aromadb.cimapbioinfo.in/",
    researchDomain: "chimie_olfactive",
    abstract: "Base de données de 1523 molécules aromatiques issues de 233 plantes médicinales et aromatiques. Inclut structures 3D, propriétés physico-chimiques et classifications.",
    keywords: ["base de données", "molécules", "plantes", "arômes", "chimie"],
    language: "en",
    readStatus: "read",
    relevanceScore: 95,
  },
  {
    entryKey: "m2or-database",
    entryType: "online",
    title: "M2OR: Molecule to Olfactory Receptor Database",
    authors: "ChemSensim Lab",
    year: 2020,
    url: "https://m2or.chemsensim.fr/",
    researchDomain: "neurologie_olfactive",
    abstract: "Base de données de paires récepteur olfactif-molécule. 771 molécules, 1402 séquences de récepteurs, 77611 expériences de bioassay.",
    keywords: ["récepteurs olfactifs", "molécules", "base de données", "neurosciences"],
    language: "en",
    readStatus: "to_review",
    relevanceScore: 80,
  },
  {
    entryKey: "pred-o3-database",
    entryType: "online",
    title: "Pred-O3: Odor Prediction Database",
    authors: "RPBS - Université Paris Diderot",
    year: 2019,
    url: "https://odor.rpbs.univ-paris-diderot.fr/",
    researchDomain: "neurologie_olfactive",
    abstract: "Base de données de 5802 composés chimiques avec odeurs connues et 385 récepteurs olfactifs. Outil de prédiction des odeurs basé sur la structure moléculaire.",
    keywords: ["prédiction", "odeurs", "chimie", "structure", "récepteurs"],
    language: "en",
    readStatus: "to_review",
    relevanceScore: 75,
  },
  {
    entryKey: "rifm-database",
    entryType: "online",
    title: "RIFM Database: Research Institute for Fragrance Materials",
    authors: "RIFM",
    year: 2024,
    url: "https://rifm.org/rifm-database/",
    researchDomain: "reglementation",
    abstract: "Base de données de plus de 7000 matériaux avec 80000+ références toxicologiques. Référence pour la sécurité des ingrédients de parfumerie.",
    keywords: ["sécurité", "toxicologie", "réglementation", "ingrédients", "parfumerie"],
    language: "en",
    readStatus: "to_review",
    relevanceScore: 90,
  },
  {
    entryKey: "ifra-transparency",
    entryType: "online",
    title: "IFRA Transparency List",
    authors: "International Fragrance Association",
    year: 2024,
    url: "https://ifrafragrance.org/transparency-list",
    researchDomain: "reglementation",
    abstract: "Liste de transparence IFRA - 'Palette du parfumeur' avec vue d'ensemble des ingrédients utilisés et réglementés dans l'industrie.",
    keywords: ["IFRA", "réglementation", "ingrédients", "transparence", "parfumerie"],
    language: "en",
    readStatus: "read",
    relevanceScore: 95,
  },
  {
    entryKey: "pubchem-database",
    entryType: "online",
    title: "PubChem: Open Chemistry Database",
    authors: "National Center for Biotechnology Information (NCBI)",
    year: 2024,
    url: "https://pubchem.ncbi.nlm.nih.gov/",
    researchDomain: "chimie_olfactive",
    abstract: "Base de données chimiques ouverte du NIH. Contient des informations sur les structures chimiques, propriétés, activités biologiques et références.",
    keywords: ["chimie", "base de données", "molécules", "structures", "propriétés"],
    language: "en",
    readStatus: "read",
    relevanceScore: 95,
  },
  {
    entryKey: "good-scents-company",
    entryType: "online",
    title: "The Good Scents Company Information System",
    authors: "The Good Scents Company",
    year: 2024,
    url: "https://www.thegoodscentscompany.com/",
    researchDomain: "chimie_olfactive",
    abstract: "Système d'information pour l'industrie des arômes et parfums. Données commerciales, applications et propriétés olfactives des ingrédients.",
    keywords: ["parfumerie", "arômes", "industrie", "applications", "commerce"],
    language: "en",
    readStatus: "read",
    relevanceScore: 85,
  },
  {
    entryKey: "fragrantica-database",
    entryType: "online",
    title: "Fragrantica: Perfume Encyclopedia",
    authors: "Fragrantica",
    year: 2024,
    url: "https://www.fragrantica.com/",
    researchDomain: "formulation",
    abstract: "Encyclopédie collaborative des parfums avec plus de 80000 parfums documentés, notes olfactives, accords et avis utilisateurs.",
    keywords: ["parfums", "encyclopédie", "notes", "accords", "communauté"],
    language: "en",
    readStatus: "read",
    relevanceScore: 80,
  },
  {
    entryKey: "basenotes-database",
    entryType: "online",
    title: "Basenotes: Fragrance Community",
    authors: "Basenotes",
    year: 2024,
    url: "https://www.basenotes.net/",
    researchDomain: "formulation",
    abstract: "Communauté et base de données de parfums. Forum de discussion, critiques et informations sur les parfums et ingrédients.",
    keywords: ["parfums", "communauté", "forum", "critiques", "discussion"],
    language: "en",
    readStatus: "to_review",
    relevanceScore: 70,
  },

  // ============================================================================
  // CLASSIFICATION OLFACTIVE
  // ============================================================================
  {
    entryKey: "edwards-fragrance-wheel",
    entryType: "book",
    title: "Fragrances of the World",
    authors: "Michael Edwards",
    year: 2024,
    publisher: "Fragrances of the World",
    isbn: "978-0980860061",
    url: "https://www.fragrancesoftheworld.com/",
    researchDomain: "formulation",
    abstract: "Guide annuel de classification des parfums selon le Fragrance Wheel. 4 familles principales (Floral, Oriental, Woody, Fresh) et 14 sous-familles.",
    keywords: ["classification", "familles olfactives", "Fragrance Wheel", "parfums", "taxonomie"],
    language: "en",
    readStatus: "read",
    relevanceScore: 90,
  },

  // ============================================================================
  // ETHNOBOTANIQUE
  // ============================================================================
  {
    entryKey: "el-mernissi-2023",
    entryType: "article",
    title: "Indigenous Knowledge of Traditional Aromatic Plants",
    authors: "El-Mernissi Y., et al.",
    year: 2023,
    journal: "Journal of Ethnobiology and Ethnomedicine",
    researchDomain: "ethnobotanique",
    abstract: "Étude des connaissances indigènes sur les plantes aromatiques traditionnelles. Documentation des usages rituels et médicinaux.",
    keywords: ["ethnobotanique", "plantes aromatiques", "savoirs traditionnels", "rituels"],
    language: "en",
    readStatus: "to_review",
    relevanceScore: 80,
  },
  {
    entryKey: "chaachouay-2023",
    entryType: "article",
    title: "Ethnobotany, Ethnopharmacology and Traditional Uses of Aromatic Plants",
    authors: "Chaachouay N., et al.",
    year: 2023,
    journal: "Journal of Ethnopharmacology",
    researchDomain: "ethnobotanique",
    abstract: "Revue des usages ethnobotaniques et ethnopharmacologiques des plantes aromatiques. Liens entre traditions et applications modernes.",
    keywords: ["ethnobotanique", "ethnopharmacologie", "plantes", "traditions", "médecine"],
    language: "en",
    readStatus: "to_review",
    relevanceScore: 80,
  },

  // ============================================================================
  // DURABILITÉ ET SOURCING
  // ============================================================================
  {
    entryKey: "uebt-sourcing",
    entryType: "online",
    title: "Union for Ethical BioTrade: Sourcing with Respect",
    authors: "UEBT",
    year: 2024,
    url: "https://www.uebt.org/",
    researchDomain: "durabilite",
    abstract: "Organisation promouvant le sourcing éthique des ingrédients naturels. Standards et certifications pour le commerce équitable.",
    keywords: ["durabilité", "éthique", "sourcing", "certification", "biodiversité"],
    language: "en",
    readStatus: "to_review",
    relevanceScore: 75,
  },

  // ============================================================================
  // PUBLICATIONS ACADÉMIQUES RÉCENTES
  // ============================================================================
  {
    entryKey: "sharma-2022",
    entryType: "article",
    title: "OlfactionBase: A Comprehensive Database for Olfaction Knowledge",
    authors: "Sharma A., et al.",
    year: 2022,
    journal: "Nucleic Acids Research",
    doi: "10.1093/nar/gkab1030",
    researchDomain: "neurologie_olfactive",
    abstract: "Base de données complète sur les mécanismes de l'olfaction. Intègre données moléculaires, récepteurs et voies de signalisation.",
    keywords: ["olfaction", "base de données", "récepteurs", "neurosciences", "signalisation"],
    language: "en",
    readStatus: "to_review",
    relevanceScore: 80,
  },
  {
    entryKey: "dunkel-2008",
    entryType: "article",
    title: "SuperScent: A Database of Flavors and Scents",
    authors: "Dunkel M., et al.",
    year: 2008,
    journal: "Nucleic Acids Research",
    doi: "10.1093/nar/gkn695",
    pmid: "18931377",
    researchDomain: "chimie_olfactive",
    abstract: "Base de données de molécules odorantes et aromatiques. Inclut structures, propriétés et descripteurs olfactifs.",
    keywords: ["base de données", "odeurs", "arômes", "molécules", "descripteurs"],
    language: "en",
    readStatus: "to_review",
    relevanceScore: 75,
  },
];

async function importAllSources() {
  console.log("🚀 Démarrage de l'import des sources bibliographiques...\n");
  
  const db = await getDb();
  if (!db) {
    console.error("❌ Impossible de se connecter à la base de données");
    return;
  }

  let imported = 0;
  let skipped = 0;
  let errors: string[] = [];

  for (const source of allSources) {
    try {
      // Vérifier si la source existe déjà
      const existing = await db
        .select({ id: bibliographyEntries.id })
        .from(bibliographyEntries)
        .where(eq(bibliographyEntries.entryKey, source.entryKey))
        .limit(1);

      if (existing.length > 0) {
        console.log(`⏭️  Existant: ${source.entryKey}`);
        skipped++;
        continue;
      }

      // Insérer la nouvelle source
      await db.insert(bibliographyEntries).values(source);
      console.log(`✅ Importé: ${source.title} (${source.authors?.split(",")[0]}, ${source.year})`);
      imported++;
    } catch (error: any) {
      console.error(`❌ Erreur pour ${source.entryKey}:`, error.message);
      errors.push(`${source.entryKey}: ${error.message}`);
    }
  }

  console.log(`\n📊 Résumé:`);
  console.log(`   - ${imported} sources importées`);
  console.log(`   - ${skipped} sources déjà existantes`);
  if (errors.length > 0) {
    console.log(`   - ${errors.length} erreurs`);
  }
}

// Import de eq depuis drizzle-orm
import { eq } from "drizzle-orm";

// Exécution
importAllSources()
  .then(() => {
    console.log("\n✨ Import terminé");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Erreur fatale:", err);
    process.exit(1);
  });
