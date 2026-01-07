import 'dotenv/config';
import mysql from 'mysql2/promise';

/**
 * PERFUMUM — Heritage Chemotypes Timeline Population Script
 * 
 * Ce script peuple la timeline historique avec des données réelles sur l'évolution
 * des chémotypes patrimoniaux à travers les périodes antiques, médiévales, modernes
 * et contemporaines.
 * 
 * Sources principales:
 * - Données archéologiques (résidus de parfums, encens)
 * - Textes anciens (Égypte, Mésopotamie, Grèce, Rome)
 * - Manuscrits arabes médiévaux
 * - Archives de parfumerie européenne
 * - Recherches contemporaines sur les chémotypes
 */

const connection = await mysql.createConnection(process.env.DATABASE_URL);

// Données historiques sur les chémotypes patrimoniaux
const heritageTimelineData = [
  // ============================================================================
  // PÉRIODE ANTIQUE (-3000 à 500 CE)
  // ============================================================================
  
  // Égypte ancienne
  {
    periodCode: "EGYPT-ANCIENT",
    periodName: "Égypte ancienne",
    startYear: -3000,
    endYear: -30,
    regionCode: "EGYPT",
    regionName: "Égypte",
    chemotypeClass: "terpene",
    description: "Les Égyptiens utilisaient des résines aromatiques (myrrhe, oliban) et des huiles parfumées pour les rituels religieux, l'embaumement et la cosmétique. Le Kyphi, parfum sacré composé de 16 ingrédients, représente l'apogée de leur art olfactif.",
    historicalContext: "L'Égypte ancienne est considérée comme le berceau de la parfumerie. Les temples possédaient des laboratoires de parfums et les prêtres étaient les premiers parfumeurs. Les résines importées de Punt (myrrhe, encens) étaient plus précieuses que l'or.",
    evidenceCount: 12,
    primarySources: JSON.stringify([
      { referenceId: "HER-001", title: "Archaeometric Identification of a Perfume from Roman Times", confidence: "high" },
      { referenceId: "perfumum_classen1994", title: "Aroma: The Cultural History of Smell", confidence: "medium" }
    ]),
    linkedMoleculeIds: JSON.stringify([]), // Limonène, Pinène, Myrcène (résines)
    analyticalMethods: JSON.stringify(["GC-MS", "LC-HRMS"]),
    color: "#d4a574",
    displayOrder: 1,
    latitude: 26.8206,
    longitude: 30.8025
  },
  
  // Mésopotamie
  {
    periodCode: "MESOPOTAMIA",
    periodName: "Mésopotamie",
    startYear: -3500,
    endYear: -539,
    regionCode: "MESOPOTAMIA",
    regionName: "Mésopotamie (Irak actuel)",
    chemotypeClass: "sesquiterpene",
    description: "Les Sumériens et Babyloniens développèrent la distillation primitive et utilisaient des parfums à base de cèdre, cyprès et résines. Les tablettes cunéiformes mentionnent plus de 200 plantes aromatiques.",
    historicalContext: "La Mésopotamie a développé les premières techniques de distillation (alambic primitif) vers 3500 BCE. Les parfums étaient utilisés dans les rituels religieux et la médecine. Le commerce des aromates reliait la région à l'Inde et l'Arabie.",
    evidenceCount: 8,
    primarySources: JSON.stringify([
      { referenceId: "perfumum_guenther1948", title: "The Essential Oils (6 volumes)", confidence: "medium" }
    ]),
    linkedMoleculeIds: JSON.stringify([]),
    analyticalMethods: JSON.stringify(["GC-MS"]),
    color: "#8b7355",
    displayOrder: 2,
    latitude: 33.3152,
    longitude: 44.3661
  },
  
  // Grèce antique
  {
    periodCode: "GREECE-ANCIENT",
    periodName: "Grèce antique",
    startYear: -800,
    endYear: -146,
    regionCode: "GREECE",
    regionName: "Grèce",
    chemotypeClass: "monoterpene",
    description: "Les Grecs ont systématisé la parfumerie avec Théophraste qui écrivit le premier traité sur les odeurs. Ils utilisaient des huiles parfumées (rhodinon à la rose, susinum au lys) et développèrent l'enfleurage.",
    historicalContext: "Théophraste (372-287 BCE) écrivit 'De Odoribus', premier traité scientifique sur les parfums. Les Grecs associaient les parfums aux dieux et les utilisaient dans les gymnases, banquets et rituels. Corinthe et Rhodes étaient des centres de production.",
    evidenceCount: 15,
    primarySources: JSON.stringify([
      { referenceId: "perfumum_classen1994", title: "Aroma: The Cultural History of Smell", confidence: "high" },
      { referenceId: "perfumum_arctander1969", title: "Perfume and Flavor Materials of Natural Origin", confidence: "medium" }
    ]),
    linkedMoleculeIds: JSON.stringify([]),
    analyticalMethods: JSON.stringify(["GC-MS", "HS-SPME"]),
    color: "#4a90d9",
    displayOrder: 3,
    latitude: 37.9838,
    longitude: 23.7275
  },
  
  // Rome antique
  {
    periodCode: "ROME-ANCIENT",
    periodName: "Rome antique",
    startYear: -753,
    endYear: 476,
    regionCode: "ROME",
    regionName: "Empire romain",
    chemotypeClass: "phenolic",
    description: "Rome importait massivement des aromates d'Orient (encens, myrrhe, nard, cannelle). Les thermes romains consommaient d'énormes quantités de parfums. Pline l'Ancien documenta plus de 100 parfums dans son Histoire Naturelle.",
    historicalContext: "L'Empire romain était le plus grand consommateur de parfums de l'Antiquité. Les routes commerciales (Route de l'Encens, Route de la Soie) approvisionnaient Rome. L'empereur Néron aurait dépensé l'équivalent de millions d'euros en parfums pour les funérailles de Poppée.",
    evidenceCount: 20,
    primarySources: JSON.stringify([
      { referenceId: "HER-001", title: "Archaeometric Identification of a Perfume from Roman Times", confidence: "high" },
      { referenceId: "perfumum_classen1994", title: "Aroma: The Cultural History of Smell", confidence: "high" }
    ]),
    linkedMoleculeIds: JSON.stringify([]),
    analyticalMethods: JSON.stringify(["GC-MS", "LC-HRMS", "HS-SPME"]),
    color: "#c41e3a",
    displayOrder: 4,
    latitude: 41.9028,
    longitude: 12.4964
  },
  
  // Inde ancienne
  {
    periodCode: "INDIA-ANCIENT",
    periodName: "Inde ancienne",
    startYear: -2500,
    endYear: 500,
    regionCode: "INDIA",
    regionName: "Sous-continent indien",
    chemotypeClass: "sesquiterpene",
    description: "L'Inde développa l'Ayurveda qui intègre les parfums thérapeutiques. Le santal, le vétiver, le patchouli et le jasmin sont des contributions majeures. L'attar (parfum à base d'huile) est une invention indienne.",
    historicalContext: "Les textes védiques (1500-500 BCE) mentionnent de nombreuses plantes aromatiques. L'Inde était un carrefour commercial majeur exportant vers Rome, la Perse et la Chine. La technique de l'attar (distillation dans l'huile de santal) est unique à l'Inde.",
    evidenceCount: 10,
    primarySources: JSON.stringify([
      { referenceId: "perfumum_arctander1969", title: "Perfume and Flavor Materials of Natural Origin", confidence: "high" }
    ]),
    linkedMoleculeIds: JSON.stringify([]),
    analyticalMethods: JSON.stringify(["GC-MS"]),
    color: "#ff9933",
    displayOrder: 5,
    latitude: 20.5937,
    longitude: 78.9629
  },
  
  // Chine ancienne
  {
    periodCode: "CHINA-ANCIENT",
    periodName: "Chine ancienne",
    startYear: -2000,
    endYear: 500,
    regionCode: "CHINA",
    regionName: "Chine",
    chemotypeClass: "monoterpene",
    description: "La Chine développa l'encens comme art spirituel et médical. Le musc, l'ambre gris et le camphre étaient très prisés. Les brûle-parfums en bronze témoignent de l'importance des aromates dans la culture chinoise.",
    historicalContext: "L'encens était utilisé dans le taoïsme et le bouddhisme pour la méditation. La Route de la Soie facilitait les échanges d'aromates avec l'Occident. Le Pen Ts'ao (pharmacopée) liste des centaines de plantes aromatiques médicinales.",
    evidenceCount: 8,
    primarySources: JSON.stringify([
      { referenceId: "perfumum_classen1994", title: "Aroma: The Cultural History of Smell", confidence: "medium" }
    ]),
    linkedMoleculeIds: JSON.stringify([]),
    analyticalMethods: JSON.stringify(["GC-MS"]),
    color: "#de2910",
    displayOrder: 6,
    latitude: 35.8617,
    longitude: 104.1954
  },
  
  // ============================================================================
  // PÉRIODE MÉDIÉVALE (500 - 1500 CE)
  // ============================================================================
  
  // Monde arabe médiéval
  {
    periodCode: "ARAB-MEDIEVAL",
    periodName: "Monde arabe médiéval",
    startYear: 700,
    endYear: 1500,
    regionCode: "ARAB_WORLD",
    regionName: "Monde arabe (Perse, Arabie, Al-Andalus)",
    chemotypeClass: "terpene",
    description: "L'âge d'or de la parfumerie arabe. Avicenne perfectionna l'alambic et la distillation. L'eau de rose devint un produit de luxe mondial. Les parfumeurs arabes créèrent les premiers parfums alcooliques.",
    historicalContext: "Avicenne (980-1037) révolutionna la distillation avec l'alambic à serpentin refroidi. Bagdad, Damas et Cordoue étaient des centres de production. Les Arabes introduisirent de nouvelles matières : musc, ambre gris, civette. L'eau de rose de Shiraz était exportée jusqu'en Chine.",
    evidenceCount: 25,
    primarySources: JSON.stringify([
      { referenceId: "perfumum_roudnitska1991", title: "L'Art de la Parfumerie", confidence: "high" },
      { referenceId: "perfumum_guenther1948", title: "The Essential Oils (6 volumes)", confidence: "high" }
    ]),
    linkedMoleculeIds: JSON.stringify([]),
    analyticalMethods: JSON.stringify(["GC-MS", "LC-HRMS"]),
    color: "#006400",
    displayOrder: 7,
    latitude: 33.3128,
    longitude: 44.3615
  },
  
  // Europe médiévale
  {
    periodCode: "EUROPE-MEDIEVAL",
    periodName: "Europe médiévale",
    startYear: 500,
    endYear: 1400,
    regionCode: "EUROPE_MEDIEVAL",
    regionName: "Europe occidentale",
    chemotypeClass: "phenolic",
    description: "Les monastères préservèrent les connaissances sur les plantes aromatiques. Les herbes locales (lavande, romarin, thym) remplacèrent les aromates orientaux coûteux. Les 'eaux de la reine de Hongrie' marquèrent le début de la parfumerie européenne.",
    historicalContext: "Après la chute de Rome, les monastères devinrent les gardiens du savoir botanique. Les Croisades (1095-1291) réintroduisirent les parfums orientaux en Europe. Venise et Gênes contrôlaient le commerce des épices et aromates.",
    evidenceCount: 12,
    primarySources: JSON.stringify([
      { referenceId: "perfumum_classen1994", title: "Aroma: The Cultural History of Smell", confidence: "medium" }
    ]),
    linkedMoleculeIds: JSON.stringify([]),
    analyticalMethods: JSON.stringify(["GC-MS"]),
    color: "#4169e1",
    displayOrder: 8,
    latitude: 48.8566,
    longitude: 2.3522
  },
  
  // ============================================================================
  // PÉRIODE MODERNE (1500 - 1900)
  // ============================================================================
  
  // Renaissance italienne
  {
    periodCode: "RENAISSANCE-ITALY",
    periodName: "Renaissance italienne",
    startYear: 1400,
    endYear: 1600,
    regionCode: "ITALY_RENAISSANCE",
    regionName: "Italie (Florence, Venise)",
    chemotypeClass: "other",
    description: "Catherine de Médicis introduisit la parfumerie italienne en France. Les gantiers-parfumeurs de Grasse commencèrent à développer leur expertise. Les premières eaux de toilette modernes apparurent.",
    historicalContext: "Florence était le centre de la parfumerie de luxe. René le Florentin, parfumeur de Catherine de Médicis, s'installa à Paris en 1533. Les techniques italiennes (enfleurage, macération) se répandirent en Europe.",
    evidenceCount: 15,
    primarySources: JSON.stringify([
      { referenceId: "perfumum_ellena2007", title: "Journal d'un Parfumeur", confidence: "high" },
      { referenceId: "perfumum_roudnitska1991", title: "L'Art de la Parfumerie", confidence: "high" }
    ]),
    linkedMoleculeIds: JSON.stringify([]),
    analyticalMethods: JSON.stringify(["GC-MS"]),
    color: "#228b22",
    displayOrder: 9,
    latitude: 43.7696,
    longitude: 11.2558
  },
  
  // Grasse et la parfumerie française
  {
    periodCode: "GRASSE-CLASSICAL",
    periodName: "Grasse - Capitale mondiale du parfum",
    startYear: 1600,
    endYear: 1900,
    regionCode: "GRASSE",
    regionName: "Grasse, France",
    chemotypeClass: "terpene",
    description: "Grasse devint la capitale mondiale de la parfumerie. Les champs de roses, jasmin, tubéreuse et lavande fournirent les matières premières. Les techniques d'extraction (enfleurage, extraction au solvant) furent perfectionnées.",
    historicalContext: "Les gantiers de Grasse se reconvertirent en parfumeurs au XVIIe siècle. La ville développa une expertise unique dans la culture et l'extraction des fleurs. Les grandes maisons (Chiris, Roure, Lautier) exportaient dans le monde entier.",
    evidenceCount: 30,
    primarySources: JSON.stringify([
      { referenceId: "perfumum_arctander1969", title: "Perfume and Flavor Materials of Natural Origin", confidence: "high" },
      { referenceId: "perfumum_ellena2007", title: "Journal d'un Parfumeur", confidence: "high" }
    ]),
    linkedMoleculeIds: JSON.stringify([]),
    analyticalMethods: JSON.stringify(["GC-MS", "HS-SPME"]),
    color: "#9370db",
    displayOrder: 10,
    latitude: 43.6590,
    longitude: 6.9230
  },
  
  // Révolution chimique du XIXe siècle
  {
    periodCode: "CHEMISTRY-19TH",
    periodName: "Révolution chimique du XIXe siècle",
    startYear: 1800,
    endYear: 1900,
    regionCode: "EUROPE_INDUSTRIAL",
    regionName: "Europe industrielle (France, Allemagne)",
    chemotypeClass: "other",
    description: "La chimie organique permit la synthèse des premières molécules odorantes : coumarine (1868), vanilline (1874), musc artificiel (1888). La parfumerie moderne naquit avec ces innovations.",
    historicalContext: "La synthèse de la coumarine par Perkin (1868) ouvrit l'ère de la parfumerie de synthèse. Les laboratoires allemands (Haarmann & Reimer, Schimmel) dominèrent l'industrie. Jicky de Guerlain (1889) fut le premier parfum utilisant des synthétiques.",
    evidenceCount: 20,
    primarySources: JSON.stringify([
      { referenceId: "perfumum_sell2006", title: "The Chemistry of Fragrances: From Perfumer to Consumer", confidence: "high" },
      { referenceId: "perfumum_ohloff1994", title: "Scent and Chemistry: The Molecular World of Odors", confidence: "high" }
    ]),
    linkedMoleculeIds: JSON.stringify([]),
    analyticalMethods: JSON.stringify(["GC-MS", "LC-HRMS", "NMR"]),
    color: "#ff6347",
    displayOrder: 11,
    latitude: 48.8566,
    longitude: 2.3522
  },
  
  // ============================================================================
  // PÉRIODE CONTEMPORAINE (1900 - présent)
  // ============================================================================
  
  // Âge d'or de la parfumerie française
  {
    periodCode: "GOLDEN-AGE-FRANCE",
    periodName: "Âge d'or de la parfumerie française",
    startYear: 1900,
    endYear: 1970,
    regionCode: "FRANCE_MODERN",
    regionName: "France (Paris, Grasse)",
    chemotypeClass: "other",
    description: "Les grandes créations : N°5 de Chanel (1921) avec les aldéhydes, Shalimar de Guerlain (1925), L'Air du Temps de Nina Ricci (1948). La parfumerie française domina le marché mondial du luxe.",
    historicalContext: "Ernest Beaux créa N°5 avec des aldéhydes synthétiques, révolutionnant la parfumerie. Les maisons de couture (Chanel, Dior, Lanvin) lancèrent leurs parfums. L'ISIPCA forma les parfumeurs modernes.",
    evidenceCount: 35,
    primarySources: JSON.stringify([
      { referenceId: "perfumum_edwards2019", title: "Fragrances of the World", confidence: "high" },
      { referenceId: "perfumum_roudnitska1991", title: "L'Art de la Parfumerie", confidence: "high" }
    ]),
    linkedMoleculeIds: JSON.stringify([]),
    analyticalMethods: JSON.stringify(["GC-MS", "LC-HRMS", "GC×GC-TOFMS"]),
    color: "#ffd700",
    displayOrder: 12,
    latitude: 48.8566,
    longitude: 2.3522
  },
  
  // Ère des muscs synthétiques
  {
    periodCode: "SYNTHETIC-MUSKS",
    periodName: "Ère des muscs synthétiques",
    startYear: 1950,
    endYear: 2000,
    regionCode: "GLOBAL",
    regionName: "Mondial",
    chemotypeClass: "other",
    description: "Développement des muscs macrocycliques (Exaltolide, Habanolide) et polycycliques (Galaxolide, Tonalide). Ces molécules remplacèrent le musc naturel (protection animale) et révolutionnèrent la parfumerie fonctionnelle.",
    historicalContext: "Les muscs nitrés (premiers synthétiques) furent abandonnés pour toxicité. Les muscs macrocycliques reproduisent mieux l'odeur du musc naturel. Les muscs polycycliques dominent les lessives et cosmétiques.",
    evidenceCount: 18,
    primarySources: JSON.stringify([
      { referenceId: "perfumum_sell2006", title: "The Chemistry of Fragrances: From Perfumer to Consumer", confidence: "high" },
      { referenceId: "perfumum_tisserand2014", title: "Essential Oil Safety", confidence: "medium" }
    ]),
    linkedMoleculeIds: JSON.stringify([]),
    analyticalMethods: JSON.stringify(["GC-MS", "LC-HRMS"]),
    color: "#dda0dd",
    displayOrder: 13,
    latitude: 0,
    longitude: 0
  },
  
  // Parfumerie de niche et naturelle
  {
    periodCode: "NICHE-NATURAL",
    periodName: "Parfumerie de niche et retour au naturel",
    startYear: 1990,
    endYear: 2026,
    regionCode: "GLOBAL",
    regionName: "Mondial",
    chemotypeClass: "terpene",
    description: "Émergence des maisons de niche (Serge Lutens, L'Artisan Parfumeur, Byredo). Retour aux matières naturelles et aux terroirs. Développement de la parfumerie durable et de la biotechnologie (ambrox biosynthétique).",
    historicalContext: "La parfumerie de niche offre une alternative aux blockbusters. Le mouvement 'clean beauty' favorise les ingrédients naturels. La biotechnologie permet de produire des molécules rares de façon durable (santal, vétiver, ambre).",
    evidenceCount: 25,
    primarySources: JSON.stringify([
      { referenceId: "BIO-001", title: "Efforts toward Ambergris Biosynthesis", confidence: "high" },
      { referenceId: "BIO-002", title: "Engineering yeast for high-level production of diterpenoid sclareol", confidence: "high" }
    ]),
    linkedMoleculeIds: JSON.stringify([]),
    analyticalMethods: JSON.stringify(["GC-MS", "LC-HRMS", "GC×GC-TOFMS", "NMR"]),
    color: "#32cd32",
    displayOrder: 14,
    latitude: 0,
    longitude: 0
  },
  
  // Olfaction digitale et IA
  {
    periodCode: "DIGITAL-OLFACTION",
    periodName: "Olfaction digitale et intelligence artificielle",
    startYear: 2015,
    endYear: 2026,
    regionCode: "GLOBAL",
    regionName: "Mondial",
    chemotypeClass: "other",
    description: "Développement des capteurs olfactifs électroniques, de la VR olfactive et de l'IA pour la prédiction des odeurs. Les bases de données moléculaires (Pyrfume, GNPS) permettent de nouvelles approches computationnelles.",
    historicalContext: "Les réseaux de neurones prédisent les descripteurs olfactifs à partir des structures moléculaires. La VR olfactive permet des expériences immersives. Les capteurs électroniques détectent les composés volatils pour le contrôle qualité.",
    evidenceCount: 15,
    primarySources: JSON.stringify([
      { referenceId: "DIG-001", title: "Digital smell technologies for the built environment", confidence: "high" },
      { referenceId: "OLF-001", title: "Pyrfume: A window to the world's olfactory data", confidence: "high" },
      { referenceId: "OLF-004", title: "Predicting natural language descriptions of mono-molecular odorants", confidence: "high" }
    ]),
    linkedMoleculeIds: JSON.stringify([]),
    analyticalMethods: JSON.stringify(["GC-MS", "E-nose", "ML/AI"]),
    color: "#00ced1",
    displayOrder: 15,
    latitude: 0,
    longitude: 0
  },
  
  // ============================================================================
  // RÉGIONS SPÉCIFIQUES - CHÉMOTYPES PATRIMONIAUX
  // ============================================================================
  
  // Cannabis - Asie centrale ancienne
  {
    periodCode: "CANNABIS-CENTRAL-ASIA",
    periodName: "Cannabis - Origines en Asie centrale",
    startYear: -3000,
    endYear: 500,
    regionCode: "CENTRAL_ASIA",
    regionName: "Asie centrale (Kazakhstan, Xinjiang)",
    chemotypeClass: "cannabinoid",
    description: "Les plus anciennes traces de cannabis psychoactif proviennent d'Asie centrale. Les résidus archéologiques de Jirzankal (Chine) montrent une utilisation rituelle du cannabis à haute teneur en THC dès 500 BCE.",
    historicalContext: "Le cannabis était utilisé dans les rituels funéraires scythes (Hérodote). Les analyses GC-MS des résidus de Jirzankal révèlent des chémotypes à dominante THC, suggérant une sélection intentionnelle pour les effets psychoactifs.",
    evidenceCount: 8,
    primarySources: JSON.stringify([
      { referenceId: "CAN-006", title: "Archaeological cannabis residues (1st millennium BCE)", confidence: "high" },
      { referenceId: "CAN-007", title: "Ancient cannabis material (Central Asia)", confidence: "high" }
    ]),
    linkedMoleculeIds: JSON.stringify([]),
    analyticalMethods: JSON.stringify(["GC-MS", "LC-HRMS"]),
    color: "#228b22",
    displayOrder: 16,
    latitude: 43.2551,
    longitude: 76.9126
  },
  
  // Tabac - Amériques
  {
    periodCode: "TOBACCO-AMERICAS",
    periodName: "Tabac - Origines américaines",
    startYear: -5000,
    endYear: 1500,
    regionCode: "AMERICAS",
    regionName: "Amériques (Andes, Mésoamérique)",
    chemotypeClass: "alkaloid",
    description: "Le tabac (Nicotiana) était cultivé et utilisé rituellement par les peuples autochtones des Amériques depuis des millénaires. Les chémotypes variaient selon les espèces et les régions.",
    historicalContext: "Les Mayas et Aztèques utilisaient le tabac dans les cérémonies religieuses. Les différentes espèces (N. tabacum, N. rustica) présentent des profils alcaloïdiques distincts. La nicotine et les nornicotines sont les marqueurs principaux.",
    evidenceCount: 10,
    primarySources: JSON.stringify([
      { referenceId: "HBT-001", title: "Hundred Fifty Years of Herbarium Collections", confidence: "medium" }
    ]),
    linkedMoleculeIds: JSON.stringify([]),
    analyticalMethods: JSON.stringify(["GC-MS", "LC-HRMS"]),
    color: "#8b4513",
    displayOrder: 17,
    latitude: -13.5319,
    longitude: -71.9675
  },
  
  // Encens - Arabie du Sud
  {
    periodCode: "FRANKINCENSE-ARABIA",
    periodName: "Encens - Route de l'encens",
    startYear: -1500,
    endYear: 500,
    regionCode: "SOUTH_ARABIA",
    regionName: "Arabie du Sud (Yémen, Oman)",
    chemotypeClass: "terpene",
    description: "L'oliban (Boswellia) et la myrrhe (Commiphora) étaient les aromates les plus précieux de l'Antiquité. Les chémotypes varient selon les espèces et les terroirs (Dhofar, Hadramaout).",
    historicalContext: "La Route de l'Encens reliait l'Arabie du Sud à la Méditerranée. Les royaumes de Saba, Qataban et Hadramaout contrôlaient ce commerce lucratif. Les acides boswelliques et les sesquiterpènes sont les marqueurs chimiques.",
    evidenceCount: 12,
    primarySources: JSON.stringify([
      { referenceId: "perfumum_arctander1969", title: "Perfume and Flavor Materials of Natural Origin", confidence: "high" }
    ]),
    linkedMoleculeIds: JSON.stringify([]),
    analyticalMethods: JSON.stringify(["GC-MS", "LC-HRMS"]),
    color: "#daa520",
    displayOrder: 18,
    latitude: 17.0151,
    longitude: 54.0924
  },
  
  // Santal - Inde et Pacifique
  {
    periodCode: "SANDALWOOD-INDIA",
    periodName: "Santal - Inde et Pacifique",
    startYear: -1000,
    endYear: 2026,
    regionCode: "INDIA_PACIFIC",
    regionName: "Inde (Mysore), Australie, Pacifique",
    chemotypeClass: "sesquiterpene",
    description: "Le santal (Santalum album) est l'un des bois les plus précieux de la parfumerie. Les chémotypes varient selon l'origine : le santal de Mysore est considéré comme le plus fin, avec une teneur élevée en α- et β-santalol.",
    historicalContext: "Le santal est sacré dans l'hindouisme et le bouddhisme. La surexploitation a rendu le santal indien rare et cher. L'Australie (S. spicatum, S. album cultivé) est devenue un producteur majeur. La biotechnologie produit maintenant du santalol.",
    evidenceCount: 15,
    primarySources: JSON.stringify([
      { referenceId: "perfumum_arctander1969", title: "Perfume and Flavor Materials of Natural Origin", confidence: "high" },
      { referenceId: "BIO-002", title: "Engineering yeast for high-level production", confidence: "medium" }
    ]),
    linkedMoleculeIds: JSON.stringify([]),
    analyticalMethods: JSON.stringify(["GC-MS", "GC×GC-TOFMS"]),
    color: "#d2691e",
    displayOrder: 19,
    latitude: 12.2958,
    longitude: 76.6394
  },
  
  // Vétiver - Haïti et Réunion
  {
    periodCode: "VETIVER-HAITI",
    periodName: "Vétiver - Haïti et îles de l'océan Indien",
    startYear: 1800,
    endYear: 2026,
    regionCode: "HAITI_REUNION",
    regionName: "Haïti, Réunion, Java",
    chemotypeClass: "sesquiterpene",
    description: "Le vétiver (Chrysopogon zizanioides) présente des chémotypes distincts selon les terroirs. Le vétiver d'Haïti est réputé pour ses notes terreuses et fumées, celui de la Réunion (Bourbon) pour sa finesse.",
    historicalContext: "Le vétiver fut introduit dans les Caraïbes au XIXe siècle. Haïti est devenu le premier producteur mondial. Les khusimol, vétivénol et vétivone sont les marqueurs chimiques. Le vétiver est aussi utilisé pour lutter contre l'érosion.",
    evidenceCount: 10,
    primarySources: JSON.stringify([
      { referenceId: "perfumum_arctander1969", title: "Perfume and Flavor Materials of Natural Origin", confidence: "high" }
    ]),
    linkedMoleculeIds: JSON.stringify([]),
    analyticalMethods: JSON.stringify(["GC-MS", "GC×GC-TOFMS"]),
    color: "#556b2f",
    displayOrder: 20,
    latitude: 18.9712,
    longitude: -72.2852
  }
];

console.log('=== PERFUMUM Heritage Timeline Population ===\n');
console.log(`Preparing to insert ${heritageTimelineData.length} timeline entries...\n`);

// Vérifier si des données existent déjà
const [existingRows] = await connection.execute('SELECT COUNT(*) as count FROM heritage_chemotypes_timeline');
console.log(`Existing entries: ${existingRows[0].count}`);

// Supprimer les données existantes si nécessaire
if (existingRows[0].count > 0) {
  console.log('Clearing existing timeline data...');
  await connection.execute('DELETE FROM heritage_chemotypes_timeline');
}

// Insérer les nouvelles données
let insertedCount = 0;
for (const entry of heritageTimelineData) {
  try {
    await connection.execute(`
      INSERT INTO heritage_chemotypes_timeline (
        period_code, period_name, start_year, end_year,
        region_code, region_name, chemotype_class,
        description, historical_context, evidence_count,
        primary_sources, linked_molecule_ids, analytical_methods,
        color, display_order
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      entry.periodCode,
      entry.periodName,
      entry.startYear,
      entry.endYear,
      entry.regionCode,
      entry.regionName,
      entry.chemotypeClass,
      entry.description,
      entry.historicalContext,
      entry.evidenceCount,
      entry.primarySources,
      entry.linkedMoleculeIds,
      entry.analyticalMethods,
      entry.color,
      entry.displayOrder
    ]);
    insertedCount++;
    console.log(`✓ Inserted: ${entry.periodName} (${entry.startYear} - ${entry.endYear})`);
  } catch (error) {
    console.error(`✗ Error inserting ${entry.periodName}:`, error.message);
  }
}

console.log(`\n=== Summary ===`);
console.log(`Total entries inserted: ${insertedCount}/${heritageTimelineData.length}`);

// Vérifier les données insérées
const [finalCount] = await connection.execute('SELECT COUNT(*) as count FROM heritage_chemotypes_timeline');
console.log(`Final count in database: ${finalCount[0].count}`);

// Afficher un aperçu par période
const [periodSummary] = await connection.execute(`
  SELECT 
    CASE 
      WHEN start_year < 0 THEN 'Antique'
      WHEN start_year < 500 THEN 'Antique tardif'
      WHEN start_year < 1500 THEN 'Médiéval'
      WHEN start_year < 1900 THEN 'Moderne'
      ELSE 'Contemporain'
    END as era,
    COUNT(*) as count
  FROM heritage_chemotypes_timeline
  GROUP BY era
  ORDER BY MIN(start_year)
`);

console.log('\n=== Entries by Era ===');
periodSummary.forEach(row => {
  console.log(`- ${row.era}: ${row.count} entries`);
});

await connection.end();
console.log('\n✓ Timeline population complete!');
