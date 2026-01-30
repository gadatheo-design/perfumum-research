/**
 * Script de seed pour importer les sources bibliographiques dans PERFUMUM
 * À exécuter via: npx tsx scripts/seed-bibliography.ts
 */

import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { bibliographyEntries } from "../drizzle/schema";
import { eq } from "drizzle-orm";

// Sources extraites des fichiers MD du projet
const sourcesToImport = [
  // === interactions-tabac-cannabis-parfum.md ===
  {
    entryKey: "russo2011",
    entryType: "article" as const,
    title: "Taming THC: potential cannabis synergy and phytocannabinoid-terpenoid entourage effects",
    authors: "Russo, E.B.",
    year: 2011,
    journal: "British Journal of Pharmacology",
    volume: "163",
    number: "7",
    pages: "1344-1364",
    doi: "10.1111/j.1476-5381.2011.01238.x",
    researchDomain: "pharmacologie" as const,
    abstract: "Étude fondamentale sur l'effet entourage entre cannabinoïdes et terpénoïdes du cannabis.",
    keywords: ["cannabis", "terpènes", "effet entourage", "THC", "CBD", "synergie"],
    readStatus: "lu" as const
  },
  {
    entryKey: "marchini2014",
    entryType: "article" as const,
    title: "Multidimensional analysis of cannabis volatile constituents: Identification of 5,5-dimethyl-1-vinylbicyclo[2.1.1]hexane as a volatile marker of hashish",
    authors: "Marchini, M. et al.",
    year: 2014,
    journal: "Journal of Chromatography A",
    volume: "1370",
    pages: "200-215",
    doi: "10.1016/j.chroma.2014.10.037",
    researchDomain: "chimie_analytique" as const,
    abstract: "Découverte du hashishene comme marqueur volatil unique du hashish marocain.",
    keywords: ["hashishene", "cannabis", "hash", "terpènes", "chromatographie"],
    readStatus: "lu" as const
  },
  {
    entryKey: "mookherjee1990",
    entryType: "article" as const,
    title: "Tobacco Constituents: Their Importance in Flavor and Fragrance Chemistry",
    authors: "Mookherjee, B.D. & Wilson, R.A.",
    year: 1990,
    journal: "Perfumer & Flavorist",
    volume: "15",
    pages: "27-49",
    researchDomain: "parfumerie" as const,
    abstract: "Étude exhaustive des constituants aromatiques du tabac et leur importance en parfumerie.",
    keywords: ["tabac", "parfumerie", "arômes", "terpènes", "damascones"],
    readStatus: "lu" as const
  },
  {
    entryKey: "booth2019",
    entryType: "article" as const,
    title: "Terpenes in Cannabis sativa – From plant genome to humans",
    authors: "Booth, J.K. et al.",
    year: 2019,
    journal: "Plant Science",
    volume: "284",
    pages: "67-72",
    doi: "10.1016/j.plantsci.2019.03.022",
    researchDomain: "botanique" as const,
    abstract: "Revue complète des terpènes du cannabis, de la génomique végétale aux effets humains.",
    keywords: ["cannabis", "terpènes", "génomique", "biosynthèse"],
    readStatus: "lu" as const
  },
  {
    entryKey: "raz2023",
    entryType: "article" as const,
    title: "Selected cannabis terpenes synergize with THC to produce increased CB1 receptor activation",
    authors: "Raz, N. et al.",
    year: 2023,
    journal: "Biochemical Pharmacology",
    doi: "10.1016/j.bcp.2023.115548",
    researchDomain: "pharmacologie" as const,
    abstract: "Démonstration de la synergie entre terpènes du cannabis et THC sur les récepteurs CB1.",
    keywords: ["cannabis", "terpènes", "THC", "CB1", "synergie"],
    readStatus: "lu" as const
  },
  
  // === plantes-aromatiques-recherche.md ===
  {
    entryKey: "vicuna2010",
    entryType: "article" as const,
    title: "Chemical composition of the essential oil of Lippia origanoides from Colombia",
    authors: "Vicuña, G.C. et al.",
    year: 2010,
    journal: "Journal of Ethnopharmacology",
    doi: "10.1016/j.jep.2009.10.004",
    pmid: "19837152",
    researchDomain: "phytochimie" as const,
    abstract: "Analyse de la composition chimique de l'huile essentielle de Lippia origanoides de Colombie.",
    keywords: ["Lippia origanoides", "Colombie", "huile essentielle", "thymol", "carvacrol"],
    readStatus: "lu" as const
  },
  {
    entryKey: "escobar2010",
    entryType: "article" as const,
    title: "Chemical composition and antiprotozoal activities of Colombian Lippia spp essential oils",
    authors: "Escobar, P. et al.",
    year: 2010,
    journal: "Memórias do Instituto Oswaldo Cruz",
    pmid: "20428679",
    researchDomain: "phytochimie" as const,
    abstract: "Composition chimique et activités antiprotozoaires des huiles essentielles de Lippia colombiennes.",
    keywords: ["Lippia", "Colombie", "huile essentielle", "antiprotozoaire"],
    readStatus: "lu" as const
  },
  {
    entryKey: "oliveira2007",
    entryType: "article" as const,
    title: "Chemical composition of Lippia origanoides essential oil",
    authors: "Oliveira, D.R. et al.",
    year: 2007,
    journal: "Food Chemistry",
    doi: "10.1016/j.foodchem.2006.01.017",
    researchDomain: "phytochimie" as const,
    abstract: "Étude de la composition de l'huile essentielle de Lippia origanoides.",
    keywords: ["Lippia origanoides", "huile essentielle", "composition chimique"],
    readStatus: "lu" as const
  },
  {
    entryKey: "regalado2011",
    entryType: "article" as const,
    title: "Chemical composition of Tagetes lucida essential oil",
    authors: "Regalado, E.L. et al.",
    year: 2011,
    journal: "Journal of Essential Oil Research",
    doi: "10.1080/10412905.2011.9700485",
    researchDomain: "phytochimie" as const,
    abstract: "Composition chimique de l'huile essentielle de Tagetes lucida.",
    keywords: ["Tagetes lucida", "huile essentielle", "estragole", "anéthole"],
    readStatus: "lu" as const
  },
  {
    entryKey: "bicchi1997",
    entryType: "article" as const,
    title: "Essential oil composition of Tagetes lucida",
    authors: "Bicchi, C. et al.",
    year: 1997,
    journal: "Flavour and Fragrance Journal",
    doi: "10.1002/(SICI)1099-1026",
    researchDomain: "phytochimie" as const,
    abstract: "Analyse de la composition de l'huile essentielle de Tagetes lucida.",
    keywords: ["Tagetes lucida", "huile essentielle", "composition"],
    readStatus: "lu" as const
  },
  {
    entryKey: "caballero2022",
    entryType: "article" as const,
    title: "Chemical composition and biological activities of Tagetes lucida",
    authors: "Caballero-Gallardo, K. et al.",
    year: 2022,
    journal: "Molecules",
    pmid: "35807352",
    researchDomain: "phytochimie" as const,
    abstract: "Composition chimique et activités biologiques de Tagetes lucida.",
    keywords: ["Tagetes lucida", "activités biologiques", "composition chimique"],
    readStatus: "lu" as const
  },
  {
    entryKey: "bassole2003",
    entryType: "article" as const,
    title: "Essential oil composition of Lippia multiflora from Burkina Faso",
    authors: "Bassolé, I.H.N. et al.",
    year: 2003,
    journal: "Phytochemistry",
    doi: "10.1016/S0031-9422(02)00477-6",
    researchDomain: "phytochimie" as const,
    abstract: "Composition de l'huile essentielle de Lippia multiflora du Burkina Faso.",
    keywords: ["Lippia multiflora", "Burkina Faso", "huile essentielle", "thymol"],
    readStatus: "lu" as const
  },
  {
    entryKey: "bassole2010",
    entryType: "article" as const,
    title: "Essential oils in combination and their antimicrobial properties",
    authors: "Bassolé, I.H.N. et al.",
    year: 2010,
    journal: "Molecules",
    doi: "10.3390/molecules15117825",
    researchDomain: "phytochimie" as const,
    abstract: "Propriétés antimicrobiennes des huiles essentielles en combinaison.",
    keywords: ["huiles essentielles", "antimicrobien", "synergie"],
    readStatus: "lu" as const
  },
  {
    entryKey: "bayala2014",
    entryType: "article" as const,
    title: "Chemical composition and antimicrobial activity of essential oils from Lippia multiflora",
    authors: "Bayala, B. et al.",
    year: 2014,
    journal: "PLoS ONE",
    doi: "10.1371/journal.pone.0092122",
    researchDomain: "phytochimie" as const,
    abstract: "Composition chimique et activité antimicrobienne de Lippia multiflora.",
    keywords: ["Lippia multiflora", "antimicrobien", "huile essentielle"],
    readStatus: "lu" as const
  },
  {
    entryKey: "bassole2020",
    entryType: "article" as const,
    title: "Chemical composition of Ocimum canum essential oil from Burkina Faso",
    authors: "Bassolé, I.H.N. et al.",
    year: 2020,
    journal: "Global Journal of Food and Agricultural Sciences",
    researchDomain: "phytochimie" as const,
    abstract: "Composition de l'huile essentielle d'Ocimum canum du Burkina Faso.",
    keywords: ["Ocimum canum", "Burkina Faso", "huile essentielle", "1,8-cinéole"],
    readStatus: "lu" as const
  },
  {
    entryKey: "tchoumbougnang2006",
    entryType: "article" as const,
    title: "Essential oil composition of Ocimum canum from Cameroon",
    authors: "Tchoumbougnang, F. et al.",
    year: 2006,
    journal: "Journal of Essential Oil Research",
    researchDomain: "phytochimie" as const,
    abstract: "Composition de l'huile essentielle d'Ocimum canum du Cameroun.",
    keywords: ["Ocimum canum", "Cameroun", "huile essentielle"],
    readStatus: "lu" as const
  },
  {
    entryKey: "dasilva2018",
    entryType: "article" as const,
    title: "Chemical composition of Ocimum canum essential oil from Brazil",
    authors: "da Silva, V.D. et al.",
    year: 2018,
    journal: "Industrial Crops and Products",
    doi: "10.1016/j.indcrop.2018.04.025",
    researchDomain: "phytochimie" as const,
    abstract: "Composition de l'huile essentielle d'Ocimum canum du Brésil.",
    keywords: ["Ocimum canum", "Brésil", "huile essentielle"],
    readStatus: "lu" as const
  },
  
  // === recherche-elargie-sources.md ===
  {
    entryKey: "kumar2018",
    entryType: "article" as const,
    title: "AromaDb: A Database of Medicinal and Aromatic Plant's Aroma Molecules With Phytochemistry and Therapeutic Potentials",
    authors: "Kumar, Y. et al.",
    year: 2018,
    journal: "Frontiers in Plant Science",
    doi: "10.3389/fpls.2018.01081",
    researchDomain: "bioinformatique" as const,
    abstract: "Base de données de 1523 molécules aromatiques de 233 plantes médicinales.",
    keywords: ["AromaDb", "base de données", "molécules aromatiques", "plantes médicinales"],
    url: "https://aromadb.cimapbioinfo.in/",
    readStatus: "lu" as const
  },
  {
    entryKey: "sharma2022",
    entryType: "article" as const,
    title: "OlfactionBase: a repository to explore odors, odorants, olfactory receptors and odorant-receptor interactions",
    authors: "Sharma, A. et al.",
    year: 2022,
    journal: "Nucleic Acids Research",
    doi: "10.1093/nar/gkab763",
    researchDomain: "bioinformatique" as const,
    abstract: "Base de données sur les mécanismes moléculaires de l'olfaction.",
    keywords: ["OlfactionBase", "récepteurs olfactifs", "odorants", "base de données"],
    readStatus: "lu" as const
  },
  {
    entryKey: "dunkel2008",
    entryType: "article" as const,
    title: "SuperScent—a database of flavors and scents",
    authors: "Dunkel, M. et al.",
    year: 2008,
    journal: "Nucleic Acids Research",
    doi: "10.1093/nar/gkn695",
    pmid: "18931377",
    researchDomain: "bioinformatique" as const,
    abstract: "Base de données de composés aromatiques et leurs propriétés olfactives.",
    keywords: ["SuperScent", "base de données", "arômes", "parfums"],
    readStatus: "lu" as const
  },
  {
    entryKey: "elmernissi2023",
    entryType: "article" as const,
    title: "Indigenous knowledge of traditional aromatic plants",
    authors: "El-Mernissi, Y. et al.",
    year: 2023,
    journal: "Journal of Ethnobiology and Ethnomedicine",
    researchDomain: "ethnobotanique" as const,
    abstract: "Documentation des connaissances indigènes sur les plantes aromatiques traditionnelles.",
    keywords: ["ethnobotanique", "plantes aromatiques", "savoirs traditionnels"],
    readStatus: "a_lire" as const
  },
  {
    entryKey: "zouraris2025",
    entryType: "article" as const,
    title: "EthnoHERBS: A multidisciplinary initiative integrating traditional knowledge and chemistry",
    authors: "Zouraris, D. et al.",
    year: 2025,
    journal: "Journal of Ethnopharmacology",
    researchDomain: "ethnobotanique" as const,
    abstract: "Initiative multidisciplinaire intégrant savoirs traditionnels et chimie des plantes aromatiques.",
    keywords: ["EthnoHERBS", "ethnobotanique", "chimie", "savoirs traditionnels"],
    readStatus: "a_lire" as const
  },
  {
    entryKey: "chaachouay2023",
    entryType: "article" as const,
    title: "Ethnobotany, ethnopharmacology and traditional uses of aromatic plants",
    authors: "Chaachouay, N. et al.",
    year: 2023,
    journal: "Journal of Ethnopharmacology",
    researchDomain: "ethnobotanique" as const,
    abstract: "Revue sur l'ethnobotanique et les usages traditionnels des plantes aromatiques.",
    keywords: ["ethnobotanique", "ethnopharmacologie", "usages traditionnels"],
    readStatus: "a_lire" as const
  },
  
  // === Bases de données en ligne (online) ===
  {
    entryKey: "aromadb_database",
    entryType: "online" as const,
    title: "AromaDb - Database of Medicinal and Aromatic Plant's Aroma Molecules",
    authors: "CSIR-CIMAP",
    year: 2018,
    url: "https://aromadb.cimapbioinfo.in/",
    researchDomain: "bioinformatique" as const,
    abstract: "Base de données de 1523 molécules aromatiques, 233 plantes, 510 types de fragrances.",
    keywords: ["base de données", "molécules aromatiques", "IUPAC", "structures 3D"],
    readStatus: "consulte" as const
  },
  {
    entryKey: "m2or_database",
    entryType: "online" as const,
    title: "M2OR - Molecule to Olfactory Receptor Database",
    authors: "ChemSensim",
    year: 2023,
    url: "https://m2or.chemsensim.fr/",
    researchDomain: "bioinformatique" as const,
    abstract: "Base de données de 771 molécules, 1402 récepteurs olfactifs, 77611 expériences.",
    keywords: ["récepteurs olfactifs", "molécules", "bioassay", "olfaction"],
    readStatus: "consulte" as const
  },
  {
    entryKey: "predo3_database",
    entryType: "online" as const,
    title: "Pred-O3 - Odor Prediction Database",
    authors: "Université Paris Diderot",
    year: 2020,
    url: "https://odor.rpbs.univ-paris-diderot.fr/",
    researchDomain: "bioinformatique" as const,
    abstract: "Base de données de 5802 composés chimiques avec odeurs connues, 385 récepteurs.",
    keywords: ["prédiction odeurs", "structure moléculaire", "récepteurs olfactifs"],
    readStatus: "consulte" as const
  },
  {
    entryKey: "rifm_database",
    entryType: "online" as const,
    title: "RIFM Database - Research Institute for Fragrance Materials",
    authors: "RIFM",
    year: 2024,
    url: "https://rifm.org/rifm-database/",
    researchDomain: "toxicologie" as const,
    abstract: "Base de données de plus de 7000 matériaux avec 80000+ références toxicologiques.",
    keywords: ["toxicologie", "sécurité", "parfumerie", "RIFM"],
    readStatus: "consulte" as const
  },
  {
    entryKey: "ifra_transparency",
    entryType: "online" as const,
    title: "IFRA Transparency List",
    authors: "IFRA",
    year: 2024,
    url: "https://ifrafragrance.org/transparency-list",
    researchDomain: "reglementation" as const,
    abstract: "Liste de transparence des ingrédients utilisés en parfumerie.",
    keywords: ["IFRA", "réglementation", "ingrédients", "parfumerie"],
    readStatus: "consulte" as const
  },
  {
    entryKey: "goodscents_database",
    entryType: "online" as const,
    title: "The Good Scents Company Information System",
    authors: "The Good Scents Company",
    year: 2024,
    url: "https://www.thegoodscentscompany.com/",
    researchDomain: "parfumerie" as const,
    abstract: "Base de données commerciale pour l'industrie des arômes et parfums.",
    keywords: ["arômes", "parfums", "industrie", "données commerciales"],
    readStatus: "consulte" as const
  },
  {
    entryKey: "fragrance_wheel",
    entryType: "online" as const,
    title: "Fragrance Wheel - Michael Edwards Classification",
    authors: "Edwards, Michael",
    year: 2020,
    url: "https://www.fragrancesoftheworld.com/",
    researchDomain: "parfumerie" as const,
    abstract: "Classification des familles olfactives en 4 familles principales et 14 sous-familles.",
    keywords: ["classification", "familles olfactives", "fragrance wheel"],
    readStatus: "consulte" as const
  },
];

async function main() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error("❌ DATABASE_URL non définie");
    process.exit(1);
  }

  console.log("🔌 Connexion à la base de données...");
  
  const connection = await mysql.createConnection(databaseUrl);
  const db = drizzle(connection);

  console.log("✅ Connexion établie\n");

  let imported = 0;
  let updated = 0;
  let errors = 0;

  for (const source of sourcesToImport) {
    try {
      // Vérifier si la source existe déjà
      const existing = await db.select()
        .from(bibliographyEntries)
        .where(eq(bibliographyEntries.entryKey, source.entryKey))
        .limit(1);

      if (existing.length > 0) {
        // Mettre à jour la source existante
        await db.update(bibliographyEntries)
          .set({
            title: source.title,
            authors: source.authors,
            year: source.year,
            journal: source.journal,
            volume: source.volume,
            pages: source.pages,
            doi: source.doi,
            pmid: source.pmid,
            url: source.url,
            abstract: source.abstract,
            keywords: source.keywords,
            researchDomain: source.researchDomain,
            readStatus: source.readStatus,
          })
          .where(eq(bibliographyEntries.entryKey, source.entryKey));
        
        console.log(`🔄 Mise à jour: ${source.entryKey}`);
        updated++;
      } else {
        // Insérer la nouvelle source
        await db.insert(bibliographyEntries).values(source as any);
        console.log(`✅ Importé: ${source.entryKey}`);
        imported++;
      }
    } catch (error: any) {
      console.error(`❌ Erreur pour ${source.entryKey}:`, error.message);
      errors++;
    }
  }

  await connection.end();

  console.log("\n📊 Résumé de l'import:");
  console.log(`  - Nouvelles sources: ${imported}`);
  console.log(`  - Sources mises à jour: ${updated}`);
  console.log(`  - Erreurs: ${errors}`);
  console.log(`  - Total traité: ${sourcesToImport.length}`);
}

main().catch(console.error);
