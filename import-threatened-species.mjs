/**
 * PERFUMUM - Import des espèces menacées
 * Jour 4 de la roadmap : 19 espèces avec statuts IUCN/CITES
 * 
 * Sources :
 * - IUCN Red List (iucnredlist.org)
 * - CITES Appendices (cites.org)
 * - TRAFFIC reports on agarwood and sandalwood
 * - IFRA sustainability reports
 */

import mysql from "mysql2/promise";

const DATABASE_URL = process.env.DATABASE_URL;

async function main() {
  const connection = await mysql.createConnection(DATABASE_URL);

  console.log("🚨 Import des espèces menacées - PERFUMUM");
  console.log("=".repeat(60));

  // ============================================================================
  // ESPÈCES MENACÉES AVEC STATUTS IUCN/CITES
  // ============================================================================
  const threatenedSpecies = [
    // AGARWOOD / OUD
    {
      name: "Bois d'agar (Oud)",
      latin_name: "Aquilaria malaccensis",
      family: "Thymelaeaceae",
      category: "bois",
      origin: "Asie du Sud-Est (Malaisie, Indonésie, Inde)",
      habitat: "Forêts tropicales humides de basse altitude",
      olfactive_signature: "Boisé profond, animal, cuiré, fumé, notes de miel et de tabac. L'un des parfums les plus précieux au monde.",
      dominant_molecules: JSON.stringify(["Agarospirol", "Jinkohol", "Kusunol", "α-Agarofuran", "β-Agarofuran"]),
      traditional_use: "Parfumerie de luxe (oud), médecine traditionnelle asiatique, encens religieux (bouddhisme, islam), rituels funéraires",
      conservation_status: "CR", // Critically Endangered
      cites_appendix: "II",
      conservation_notes: "Population réduite de plus de 80% en trois générations. Exploitation illégale massive pour le marché du parfum de luxe.",
      threat_factors: JSON.stringify({ overharvesting: true, illegal_trade: true, habitat_loss: true }),
      sustainable_alternatives: "Oud de plantation, inoculation artificielle, alternatives synthétiques (Iso E Super, Cashmeran)",
      last_assessment_year: 2018,
      historical_status: "Antiquité",
      notes: "Le bois d'agar ne produit sa résine parfumée qu'en réponse à une infection fongique. Moins de 2% des arbres sauvages produisent de l'oud.",
    },
    // SANTAL BLANC
    {
      name: "Santal blanc",
      latin_name: "Santalum album",
      family: "Santalaceae",
      category: "bois",
      origin: "Inde (Karnataka, Tamil Nadu), Indonésie",
      habitat: "Forêts sèches décidues tropicales",
      olfactive_signature: "Boisé crémeux, lacté, doux, légèrement sucré avec des notes de rose et de musc",
      dominant_molecules: JSON.stringify(["α-Santalol", "β-Santalol", "Santalène", "Bergamotol"]),
      traditional_use: "Parfumerie (note de fond classique), médecine ayurvédique, rituels hindous, cosmétiques, sculpture",
      conservation_status: "VU", // Vulnerable
      cites_appendix: "II",
      conservation_notes: "Surexploitation historique en Inde. Plantations en développement en Australie et Nouvelle-Calédonie.",
      threat_factors: JSON.stringify({ overharvesting: true, illegal_trade: true, habitat_loss: true }),
      sustainable_alternatives: "Santal australien (S. spicatum), santal de Nouvelle-Calédonie, Javanol (synthétique)",
      last_assessment_year: 2019,
      historical_status: "4000 ans",
      notes: "L'arbre doit avoir au moins 15-20 ans pour produire un bois de qualité. Le cœur du bois est le plus précieux.",
    },
    // GUGGUL
    {
      name: "Guggul",
      latin_name: "Commiphora wightii",
      family: "Burseraceae",
      category: "resine",
      origin: "Inde (Rajasthan, Gujarat), Pakistan",
      habitat: "Zones arides et semi-arides rocheuses",
      olfactive_signature: "Balsamique, légèrement amer, notes de myrrhe avec une touche médicinale",
      dominant_molecules: JSON.stringify(["Guggulstérones", "Myrcène", "Caryophyllène", "Eugénol"]),
      traditional_use: "Médecine ayurvédique (cholestérol, arthrite), encens, parfumerie traditionnelle indienne",
      conservation_status: "CR", // Critically Endangered
      cites_appendix: "II",
      conservation_notes: "Déclin de plus de 80% en 20 ans. Récolte non durable et perte d'habitat.",
      threat_factors: JSON.stringify({ overharvesting: true, habitat_loss: true, climate_change: true }),
      sustainable_alternatives: "Extraits de culture, alternatives synthétiques pour usage pharmaceutique",
      last_assessment_year: 2017,
      historical_status: "3000 ans",
      notes: "Utilisé depuis l'Antiquité en Ayurveda. La résine est récoltée par incision de l'écorce.",
    },
    // NARD (SPIKENARD)
    {
      name: "Nard (Spikenard)",
      latin_name: "Nardostachys jatamansi",
      family: "Caprifoliaceae",
      category: "racine",
      origin: "Himalaya (Népal, Inde, Chine, Bhoutan)",
      habitat: "Prairies alpines entre 3000 et 5000m d'altitude",
      olfactive_signature: "Terreux, animal, musqué, notes de valériane et de patchouli avec une touche verte",
      dominant_molecules: JSON.stringify(["Jatamansone", "Nardol", "Calarène", "Valéranone", "Patchoulol"]),
      traditional_use: "Parfumerie biblique (onguent précieux), médecine ayurvédique et tibétaine, encens religieux",
      conservation_status: "CR", // Critically Endangered
      cites_appendix: "II",
      conservation_notes: "Récolte excessive pour le marché des huiles essentielles et de la médecine traditionnelle.",
      threat_factors: JSON.stringify({ overharvesting: true, habitat_loss: true, climate_change: true }),
      sustainable_alternatives: "Culture en altitude, substituts synthétiques partiels",
      last_assessment_year: 2020,
      historical_status: "Antiquité",
      notes: "Mentionné dans la Bible comme parfum précieux utilisé pour oindre Jésus. Récolte des rhizomes.",
    },
    // BOIS DE ROSE
    {
      name: "Bois de rose",
      latin_name: "Aniba rosaeodora",
      family: "Lauraceae",
      category: "bois",
      origin: "Amazonie (Brésil, Pérou, Guyane française)",
      habitat: "Forêt amazonienne de terre ferme",
      olfactive_signature: "Floral-boisé, notes de rose et de linalol, frais et légèrement épicé",
      dominant_molecules: JSON.stringify(["Linalol (80-90%)", "α-Terpinéol", "Géraniol", "Nérol"]),
      traditional_use: "Parfumerie de luxe (Chanel N°5), cosmétiques, aromathérapie",
      conservation_status: "EN", // Endangered
      cites_appendix: "II",
      conservation_notes: "Exploitation historique destructrice (abattage de l'arbre entier). Plantations en développement.",
      threat_factors: JSON.stringify({ overharvesting: true, habitat_loss: true }),
      sustainable_alternatives: "Ho wood (Cinnamomum camphora ct. linalol), linalol synthétique, plantations durables",
      last_assessment_year: 2018,
      historical_status: "19e siècle",
      notes: "L'huile essentielle était traditionnellement extraite de l'arbre entier abattu. Nouvelles méthodes utilisent les feuilles.",
    },
    // CÈDRE DE L'ATLAS
    {
      name: "Cèdre de l'Atlas",
      latin_name: "Cedrus atlantica",
      family: "Pinaceae",
      category: "bois",
      origin: "Maroc, Algérie (Atlas)",
      habitat: "Forêts de montagne méditerranéennes (1500-2500m)",
      olfactive_signature: "Boisé sec, légèrement fumé, notes de crayon et de résine",
      dominant_molecules: JSON.stringify(["α-Cédrène", "β-Cédrène", "Cédrol", "Atlantone"]),
      traditional_use: "Parfumerie (note de fond), construction, ébénisterie, médecine traditionnelle",
      conservation_status: "EN", // Endangered
      cites_appendix: "NONE",
      conservation_notes: "Déclin dû au changement climatique et aux maladies. Forêts fragmentées.",
      threat_factors: JSON.stringify({ climate_change: true, habitat_loss: true }),
      sustainable_alternatives: "Cèdre de Virginie, cèdre de l'Himalaya, Iso E Super",
      last_assessment_year: 2013,
      historical_status: "Antiquité",
      notes: "Arbre emblématique du Maroc. Les forêts de cèdres sont des écosystèmes uniques menacés.",
    },
    // COSTUS
    {
      name: "Costus",
      latin_name: "Saussurea costus",
      family: "Asteraceae",
      category: "racine",
      origin: "Himalaya (Inde, Pakistan, Chine)",
      habitat: "Prairies alpines entre 2500 et 4000m",
      olfactive_signature: "Animal, cuiré, notes de violette et d'iris avec une facette terreuse",
      dominant_molecules: JSON.stringify(["Costunolide", "Déhydrocostus lactone", "α-Costol", "β-Costol"]),
      traditional_use: "Parfumerie orientale, médecine traditionnelle chinoise et ayurvédique, encens",
      conservation_status: "CR", // Critically Endangered
      cites_appendix: "I", // Commerce international interdit
      conservation_notes: "Récolte excessive. Commerce international interdit depuis 1985.",
      threat_factors: JSON.stringify({ overharvesting: true, illegal_trade: true, habitat_loss: true }),
      sustainable_alternatives: "Costus de culture (rare), alternatives synthétiques",
      last_assessment_year: 2019,
      historical_status: "Antiquité",
      notes: "L'un des parfums les plus anciens. Inscrit à l'Annexe I de la CITES (commerce interdit).",
    },
    // IRIS PALLIDA
    {
      name: "Iris de Florence",
      latin_name: "Iris pallida",
      family: "Iridaceae",
      category: "racine",
      origin: "Italie (Toscane), Maroc",
      habitat: "Collines méditerranéennes calcaires",
      olfactive_signature: "Poudré, floral, notes de violette et de carotte avec une facette terreuse",
      dominant_molecules: JSON.stringify(["Irones (α, β, γ)", "Myristic acid", "Iridals"]),
      traditional_use: "Parfumerie de luxe (orris butter), cosmétiques, médecine traditionnelle",
      conservation_status: "NT", // Near Threatened
      cites_appendix: "NONE",
      conservation_notes: "Culture intensive en Toscane et au Maroc. Populations sauvages en déclin.",
      threat_factors: JSON.stringify({ habitat_loss: true, climate_change: true }),
      sustainable_alternatives: "Culture intensive, irones synthétiques",
      last_assessment_year: 2015,
      historical_status: "Renaissance",
      notes: "Les rhizomes doivent sécher 3-5 ans avant distillation. L'un des ingrédients les plus chers en parfumerie.",
    },
    // VÉTIVER HAÏTIEN
    {
      name: "Vétiver d'Haïti",
      latin_name: "Chrysopogon zizanioides",
      family: "Poaceae",
      category: "racine",
      origin: "Haïti, Java, Réunion",
      habitat: "Zones tropicales humides",
      olfactive_signature: "Terreux, fumé, boisé, notes de noisette et de chocolat",
      dominant_molecules: JSON.stringify(["Vétivérol", "Khusimol", "Isovalencénol", "β-Vétivone"]),
      traditional_use: "Parfumerie (note de fond), aromathérapie, lutte contre l'érosion",
      conservation_status: "LC", // Least Concern (cultivé)
      cites_appendix: "NONE",
      conservation_notes: "Cultivé intensivement. Préoccupations sociales (conditions de travail en Haïti).",
      threat_factors: JSON.stringify({ climate_change: true }),
      sustainable_alternatives: "Vétiver de Java, vétiver de Réunion, Vetiver Acetate",
      last_assessment_year: 2020,
      historical_status: "Traditionnel",
      notes: "Haïti produit 50% du vétiver mondial. Importance économique majeure pour les communautés locales.",
    },
    // SILPHIUM (ÉTEINT)
    {
      name: "Silphium",
      latin_name: "Ferula drudeana (probable)",
      family: "Apiaceae",
      category: "resine",
      origin: "Cyrénaïque (Libye antique)",
      habitat: "Zones côtières méditerranéennes (disparu)",
      olfactive_signature: "Inconnu - décrit comme aromatique, résineux, avec des notes d'ail et de fenouil",
      dominant_molecules: JSON.stringify(["Inconnu - probablement terpènes et composés soufrés"]),
      traditional_use: "Médecine antique (contraception, digestion), cuisine romaine, parfumerie",
      conservation_status: "EX", // Extinct
      cites_appendix: "NONE",
      conservation_notes: "Éteint depuis le 1er siècle ap. J.-C. Surexploitation et impossibilité de culture.",
      threat_factors: JSON.stringify({ overharvesting: true }),
      sustainable_alternatives: "Asa-foetida (Ferula assa-foetida) comme substitut partiel",
      last_assessment_year: null,
      historical_status: "Antiquité",
      notes: "Première extinction documentée d'une plante due à la surexploitation humaine. Valait son poids en or.",
    },
    // PALO SANTO
    {
      name: "Palo Santo",
      latin_name: "Bursera graveolens",
      family: "Burseraceae",
      category: "bois",
      origin: "Amérique du Sud (Équateur, Pérou)",
      habitat: "Forêts sèches tropicales",
      olfactive_signature: "Boisé doux, notes de citron, menthe et encens avec une facette sucrée",
      dominant_molecules: JSON.stringify(["Limonène", "α-Terpinéol", "Menthofuran", "Carvone"]),
      traditional_use: "Rituels chamaniques, purification, aromathérapie, médecine traditionnelle",
      conservation_status: "LC", // Least Concern mais préoccupant
      cites_appendix: "NONE",
      conservation_notes: "Demande croissante pour le marché du bien-être. Réglementation en Équateur et Pérou.",
      threat_factors: JSON.stringify({ overharvesting: true, habitat_loss: true }),
      sustainable_alternatives: "Récolte de bois mort uniquement (tradition), plantations",
      last_assessment_year: 2019,
      historical_status: "Précolombien",
      notes: "Traditionnellement, seul le bois mort naturellement est récolté. La demande moderne menace cette pratique.",
    },
    // ROSE DE DAMAS
    {
      name: "Rose de Damas",
      latin_name: "Rosa × damascena",
      family: "Rosaceae",
      category: "fleur",
      origin: "Bulgarie, Turquie, Iran, Maroc",
      habitat: "Vallées tempérées (Vallée des Roses, Bulgarie)",
      olfactive_signature: "Floral riche, miellé, notes de litchi et de thé avec une facette épicée",
      dominant_molecules: JSON.stringify(["Citronellol", "Géraniol", "Nérol", "Damascénone", "Rose oxide"]),
      traditional_use: "Parfumerie de luxe, cosmétiques, cuisine (eau de rose), médecine traditionnelle",
      conservation_status: "NE", // Not Evaluated (cultivé)
      cites_appendix: "NONE",
      conservation_notes: "Cultivé intensivement. Variétés anciennes menacées par l'uniformisation génétique.",
      threat_factors: JSON.stringify({ climate_change: true }),
      sustainable_alternatives: "Rose de mai (R. centifolia), rose absolue, phényléthanol",
      last_assessment_year: null,
      historical_status: "Antiquité",
      notes: "Il faut 3-5 tonnes de pétales pour produire 1 kg d'huile essentielle. Récolte à l'aube.",
    },
    // JASMIN GRANDIFLORUM
    {
      name: "Jasmin de Grasse",
      latin_name: "Jasminum grandiflorum",
      family: "Oleaceae",
      category: "fleur",
      origin: "Grasse (France), Égypte, Inde, Maroc",
      habitat: "Zones méditerranéennes et subtropicales",
      olfactive_signature: "Floral intense, sensuel, notes de miel, d'orange et d'indole",
      dominant_molecules: JSON.stringify(["Benzyl acétate", "Linalol", "Indole", "Jasmone", "Méthyl anthranilate"]),
      traditional_use: "Parfumerie de luxe, cosmétiques, thé au jasmin",
      conservation_status: "NE", // Not Evaluated (cultivé)
      cites_appendix: "NONE",
      conservation_notes: "Culture en déclin à Grasse. Production délocalisée vers l'Égypte et l'Inde.",
      threat_factors: JSON.stringify({ habitat_loss: true, climate_change: true }),
      sustainable_alternatives: "Jasmin sambac, hedione (synthétique)",
      last_assessment_year: null,
      historical_status: "16e siècle",
      notes: "Récolte nocturne des fleurs. L'absolue de jasmin est l'un des ingrédients les plus précieux.",
    },
    // YLANG-YLANG
    {
      name: "Ylang-ylang",
      latin_name: "Cananga odorata",
      family: "Annonaceae",
      category: "fleur",
      origin: "Comores, Madagascar, Philippines",
      habitat: "Forêts tropicales humides",
      olfactive_signature: "Floral exotique, crémeux, notes de banane, jasmin et clou de girofle",
      dominant_molecules: JSON.stringify(["Linalol", "Germacrène D", "β-Caryophyllène", "Benzyl acétate", "p-Crésyl méthyl éther"]),
      traditional_use: "Parfumerie (Chanel N°5), cosmétiques, aromathérapie, huile capillaire traditionnelle",
      conservation_status: "LC", // Least Concern (cultivé)
      cites_appendix: "NONE",
      conservation_notes: "Cultivé intensivement aux Comores. Préoccupations sociales et économiques.",
      threat_factors: JSON.stringify({ climate_change: true }),
      sustainable_alternatives: "Fractions synthétiques, autres variétés",
      last_assessment_year: 2018,
      historical_status: "19e siècle",
      notes: "Les Comores produisent 70% de l'ylang-ylang mondial. Distillation fractionnée (Extra, I, II, III).",
    },
    // BENJOIN DE SUMATRA
    {
      name: "Benjoin de Sumatra",
      latin_name: "Styrax benzoin",
      family: "Styracaceae",
      category: "resine",
      origin: "Sumatra (Indonésie), Thaïlande, Laos",
      habitat: "Forêts tropicales humides de montagne",
      olfactive_signature: "Balsamique doux, vanillé, notes de chocolat et d'amande",
      dominant_molecules: JSON.stringify(["Acide benzoïque", "Acide cinnamique", "Vanilline", "Styrène"]),
      traditional_use: "Parfumerie, encens religieux, médecine traditionnelle, fixateur",
      conservation_status: "VU", // Vulnerable
      cites_appendix: "NONE",
      conservation_notes: "Populations sauvages en déclin. Culture traditionnelle en agroforesterie.",
      threat_factors: JSON.stringify({ overharvesting: true, habitat_loss: true }),
      sustainable_alternatives: "Benjoin du Siam, tolu balsam, vanilline synthétique",
      last_assessment_year: 2019,
      historical_status: "Antiquité",
      notes: "Résine récoltée par incision. Utilisé comme fixateur dans les parfums orientaux.",
    },
    // LABDANUM
    {
      name: "Labdanum (Ciste)",
      latin_name: "Cistus ladanifer",
      family: "Cistaceae",
      category: "resine",
      origin: "Méditerranée (Espagne, Portugal, Maroc)",
      habitat: "Maquis méditerranéen",
      olfactive_signature: "Ambré, animal, notes de cuir, miel et tabac",
      dominant_molecules: JSON.stringify(["Labdanolide", "Sclareol", "Ambrox", "Acide labdanique"]),
      traditional_use: "Parfumerie (substitut de l'ambre gris), encens, médecine traditionnelle",
      conservation_status: "LC", // Least Concern
      cites_appendix: "NONE",
      conservation_notes: "Populations stables. Récolte traditionnelle par les chèvres (résine sur leur pelage).",
      threat_factors: JSON.stringify({ habitat_loss: true, climate_change: true }),
      sustainable_alternatives: "Ambroxan (synthétique), autres résines",
      last_assessment_year: 2015,
      historical_status: "Antiquité",
      notes: "Substitut historique de l'ambre gris. Récolte traditionnelle en Crète avec des chèvres.",
    },
    // OPOPONAX
    {
      name: "Opoponax (Myrrhe douce)",
      latin_name: "Commiphora guidottii",
      family: "Burseraceae",
      category: "resine",
      origin: "Somalie, Éthiopie, Kenya",
      habitat: "Zones arides et semi-arides d'Afrique de l'Est",
      olfactive_signature: "Balsamique doux, notes de lavande, miel et encens avec une facette anisée",
      dominant_molecules: JSON.stringify(["β-Bisabolène", "α-Santalène", "Cis-α-Bergamotène"]),
      traditional_use: "Parfumerie, encens, médecine traditionnelle somalienne",
      conservation_status: "DD", // Data Deficient
      cites_appendix: "NONE",
      conservation_notes: "Données insuffisantes. Exploitation commerciale croissante.",
      threat_factors: JSON.stringify({ overharvesting: true, climate_change: true }),
      sustainable_alternatives: "Myrrhe, benjoin",
      last_assessment_year: 2018,
      historical_status: "Antiquité",
      notes: "Souvent confondu avec la myrrhe. Plus doux et moins amer que la myrrhe vraie.",
    },
    // GALBANUM
    {
      name: "Galbanum",
      latin_name: "Ferula gummosa",
      family: "Apiaceae",
      category: "resine",
      origin: "Iran, Afghanistan, Turkménistan",
      habitat: "Steppes et zones montagneuses semi-arides",
      olfactive_signature: "Vert intense, résineux, notes de feuille de tomate et de pin",
      dominant_molecules: JSON.stringify(["β-Pinène", "α-Pinène", "Myrcène", "Cadinène", "Guaiol"]),
      traditional_use: "Parfumerie (note verte), encens biblique, médecine traditionnelle persane",
      conservation_status: "VU", // Vulnerable
      cites_appendix: "NONE",
      conservation_notes: "Surexploitation en Iran. Populations sauvages en déclin.",
      threat_factors: JSON.stringify({ overharvesting: true, habitat_loss: true }),
      sustainable_alternatives: "Galbanum de culture, notes vertes synthétiques",
      last_assessment_year: 2017,
      historical_status: "Antiquité",
      notes: "Mentionné dans la Bible comme composant de l'encens sacré. Récolte des racines.",
    },
    // ELEMI
    {
      name: "Élémi",
      latin_name: "Canarium luzonicum",
      family: "Burseraceae",
      category: "resine",
      origin: "Philippines",
      habitat: "Forêts tropicales humides",
      olfactive_signature: "Frais, citronné, notes de pin et d'encens avec une facette épicée",
      dominant_molecules: JSON.stringify(["Limonène", "α-Phellandrène", "Élémol", "Élémicine"]),
      traditional_use: "Parfumerie, vernis, médecine traditionnelle philippine",
      conservation_status: "VU", // Vulnerable
      cites_appendix: "NONE",
      conservation_notes: "Déforestation aux Philippines. Récolte traditionnelle durable menacée.",
      threat_factors: JSON.stringify({ habitat_loss: true, overharvesting: true }),
      sustainable_alternatives: "Élémi de culture, limonène synthétique",
      last_assessment_year: 2019,
      historical_status: "16e siècle",
      notes: "Résine utilisée dans les vernis et la parfumerie. Récolte par incision de l'écorce.",
    },
  ];

  // ============================================================================
  // IMPORT DES ESPÈCES MENACÉES
  // ============================================================================
  console.log("\n🌳 Import des espèces menacées...");
  
  let imported = 0;
  let updated = 0;
  let errors = 0;

  for (const plant of threatenedSpecies) {
    try {
      const [existing] = await connection.execute(
        "SELECT id FROM plants WHERE latin_name = ? LIMIT 1",
        [plant.latin_name]
      );
      
      if (existing.length > 0) {
        // Mettre à jour les données de conservation
        await connection.execute(
          `UPDATE plants SET 
           conservation_status = ?, cites_appendix = ?, conservation_notes = ?,
           threat_factors = ?, sustainable_alternatives = ?, last_assessment_year = ?,
           historical_status = ?, olfactive_signature = ?, dominant_molecules = ?,
           traditional_use = ?, notes = ?
           WHERE id = ?`,
          [plant.conservation_status, plant.cites_appendix, plant.conservation_notes,
           plant.threat_factors, plant.sustainable_alternatives, plant.last_assessment_year,
           plant.historical_status, plant.olfactive_signature, plant.dominant_molecules,
           plant.traditional_use, plant.notes, existing[0].id]
        );
        console.log(`  🔄 ${plant.latin_name} mis à jour (ID: ${existing[0].id})`);
        updated++;
        continue;
      }
      
      await connection.execute(
        `INSERT INTO plants (name, latin_name, family, category, origin, habitat, 
         olfactive_signature, dominant_molecules, traditional_use, conservation_status,
         cites_appendix, conservation_notes, threat_factors, sustainable_alternatives,
         last_assessment_year, historical_status, notes)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [plant.name, plant.latin_name, plant.family, plant.category, plant.origin, plant.habitat,
         plant.olfactive_signature, plant.dominant_molecules, plant.traditional_use, plant.conservation_status,
         plant.cites_appendix, plant.conservation_notes, plant.threat_factors, plant.sustainable_alternatives,
         plant.last_assessment_year, plant.historical_status, plant.notes]
      );
      console.log(`  ✅ ${plant.latin_name} importé`);
      imported++;
    } catch (error) {
      console.error(`  ❌ Erreur pour ${plant.latin_name}:`, error.message);
      errors++;
    }
  }

  // ============================================================================
  // RÉSUMÉ
  // ============================================================================
  console.log("\n" + "=".repeat(60));
  console.log("📊 RÉSUMÉ DE L'IMPORT DES ESPÈCES MENACÉES");
  console.log("=".repeat(60));
  console.log(`  Total espèces traitées : ${threatenedSpecies.length}`);
  console.log(`  Nouvelles importées : ${imported}`);
  console.log(`  Mises à jour : ${updated}`);
  console.log(`  Erreurs : ${errors}`);
  console.log("");
  console.log("  📈 Répartition par statut IUCN :");
  const statusCounts = {};
  threatenedSpecies.forEach(p => {
    statusCounts[p.conservation_status] = (statusCounts[p.conservation_status] || 0) + 1;
  });
  Object.entries(statusCounts).sort().forEach(([status, count]) => {
    const labels = {
      'CR': 'En danger critique',
      'EN': 'En danger',
      'VU': 'Vulnérable',
      'NT': 'Quasi menacé',
      'LC': 'Préoccupation mineure',
      'DD': 'Données insuffisantes',
      'EX': 'Éteint',
      'NE': 'Non évalué'
    };
    console.log(`    ${status} (${labels[status] || status}): ${count}`);
  });
  console.log("");
  console.log("  📋 Répartition par annexe CITES :");
  const citesCounts = {};
  threatenedSpecies.forEach(p => {
    citesCounts[p.cites_appendix] = (citesCounts[p.cites_appendix] || 0) + 1;
  });
  Object.entries(citesCounts).sort().forEach(([appendix, count]) => {
    console.log(`    Annexe ${appendix}: ${count}`);
  });
  console.log("=".repeat(60));

  await connection.end();
  console.log("\n✅ Import terminé avec succès !");
}

main().catch(console.error);
