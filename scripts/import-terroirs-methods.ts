/**
 * Script d'import des terroirs et méthodes d'extraction
 * Point 3 étendu - PERFUMUM Research
 */

import { getDb } from "../server/db";
import { terroirs, extractionMethods } from "../drizzle/schema";

const db = getDb();

// Données des terroirs principaux pour la recherche PERFUMUM
const terroirsData = [
  {
    terroirId: "TER-COL-SAN",
    name: "San Andrés y Providencia",
    country: "Colombie",
    region: "Archipel des Caraïbes",
    climateType: "tropical" as const,
    soilType: "Calcaire corallien, sable volcanique",
    altitude: "0-100m",
    annualRainfall: "1800-2000mm",
    temperatureRange: "26-32°C",
    humidity: "80-90%",
    mainCrops: JSON.stringify(["Pimenta racemosa", "Coco", "Fruits tropicaux"]),
    reputation: "Terroir unique des Caraïbes colombiennes, influence maritime forte",
    qualityRating: "excellent" as const,
    certifications: JSON.stringify(["Réserve de biosphère UNESCO"]),
    notes: "Zone de recherche principale ABSORBE - Bay rum et plantes aromatiques caribéennes",
  },
  {
    terroirId: "TER-COL-SAN-HUI",
    name: "Santander & Huila",
    country: "Colombie",
    region: "Andes colombiennes",
    climateType: "subtropical" as const,
    soilType: "Volcanique, riche en minéraux",
    altitude: "800-1800m",
    annualRainfall: "1500-2500mm",
    temperatureRange: "18-28°C",
    humidity: "70-85%",
    mainCrops: JSON.stringify(["Tabac Virginia", "Café", "Cacao"]),
    reputation: "Terroir d'excellence pour le tabac flue-cured et les cultures d'altitude",
    qualityRating: "exceptional" as const,
    certifications: JSON.stringify(["Denominación de Origen Tabaco"]),
    notes: "Tabac Virginia de haute qualité - séchage contrôlé traditionnel",
  },
  {
    terroirId: "TER-COL-CAU",
    name: "Cauca Valley",
    country: "Colombie",
    region: "Valle del Cauca",
    climateType: "tropical" as const,
    soilType: "Alluvial fertile",
    altitude: "900-1100m",
    annualRainfall: "1000-1500mm",
    temperatureRange: "23-30°C",
    humidity: "65-75%",
    mainCrops: JSON.stringify(["Lippia alba", "Cymbopogon citratus", "Canne à sucre"]),
    reputation: "Vallée fertile pour plantes aromatiques et médicinales",
    qualityRating: "excellent" as const,
    notes: "Zone de culture de Lippia alba - deux chémotypes distincts",
  },
  {
    terroirId: "TER-MAD-NOS",
    name: "Nossi-Bé",
    country: "Madagascar",
    region: "Nord-Ouest",
    climateType: "tropical" as const,
    soilType: "Volcanique basaltique",
    altitude: "0-450m",
    annualRainfall: "2000-2500mm",
    temperatureRange: "24-32°C",
    humidity: "80-90%",
    mainCrops: JSON.stringify(["Ylang-ylang", "Vanille", "Poivre"]),
    reputation: "Capitale mondiale de l'ylang-ylang, terroir d'exception",
    qualityRating: "exceptional" as const,
    certifications: JSON.stringify(["IGP Ylang-ylang de Nossi-Bé"]),
    notes: "Ylang-ylang extra supérieur - distillation fractionnée traditionnelle",
  },
  {
    terroirId: "TER-FRA-GRA",
    name: "Grasse",
    country: "France",
    region: "Provence-Alpes-Côte d'Azur",
    climateType: "mediterranean" as const,
    soilType: "Calcaire, argilo-calcaire",
    altitude: "300-800m",
    annualRainfall: "800-1000mm",
    temperatureRange: "8-28°C",
    humidity: "50-70%",
    mainCrops: JSON.stringify(["Rose de mai", "Jasmin", "Tubéreuse", "Lavande"]),
    reputation: "Capitale mondiale de la parfumerie, savoir-faire ancestral",
    qualityRating: "exceptional" as const,
    certifications: JSON.stringify(["IGP Fleurs de Grasse", "Patrimoine UNESCO"]),
    notes: "Référence mondiale pour les absolus et concrètes de fleurs",
  },
  {
    terroirId: "TER-IND-KAN",
    name: "Karnataka",
    country: "Inde",
    region: "Sud de l'Inde",
    climateType: "tropical" as const,
    soilType: "Latérite rouge",
    altitude: "600-1200m",
    annualRainfall: "1500-3000mm",
    temperatureRange: "20-35°C",
    humidity: "60-85%",
    mainCrops: JSON.stringify(["Santal", "Jasmin sambac", "Vétiver"]),
    reputation: "Terroir historique du santal Mysore et du jasmin sambac",
    qualityRating: "excellent" as const,
    certifications: JSON.stringify(["GI Mysore Sandalwood"]),
    notes: "Santal album de Mysore - espèce protégée, qualité exceptionnelle",
  },
  {
    terroirId: "TER-SOM-BOS",
    name: "Bosaso & Puntland",
    country: "Somalie",
    region: "Corne de l'Afrique",
    climateType: "arid" as const,
    soilType: "Calcaire désertique",
    altitude: "0-500m",
    annualRainfall: "50-200mm",
    temperatureRange: "25-40°C",
    humidity: "30-50%",
    mainCrops: JSON.stringify(["Encens oliban", "Myrrhe"]),
    reputation: "Terroir ancestral de l'encens, qualité Hojari",
    qualityRating: "exceptional" as const,
    notes: "Boswellia sacra - récolte traditionnelle, grades Hojari supérieurs",
  },
];

// Données des méthodes d'extraction
const extractionMethodsData = [
  {
    methodId: "EXT-DIST-VAP",
    name: "Distillation à la vapeur d'eau",
    shortName: "Steam distillation",
    category: "distillation" as const,
    description: "Méthode classique d'extraction des huiles essentielles par entraînement à la vapeur",
    principle: "La vapeur d'eau traverse la matière végétale, entraîne les composés volatils, puis le mélange est condensé et séparé",
    equipmentRequired: JSON.stringify(["Alambic", "Chaudière", "Condenseur", "Essencier (vase florentin)"]),
    temperatureRange: "100°C (vapeur)",
    pressureRange: "Pression atmosphérique ou légère surpression",
    duration: "1-6 heures selon la matière",
    yieldRange: "0.1% - 3% selon la plante",
    advantages: JSON.stringify([
      "Méthode douce respectant les molécules",
      "Pas de solvant chimique",
      "Équipement relativement simple",
      "Produit des hydrolats en sous-produit"
    ]),
    disadvantages: JSON.stringify([
      "Rendement parfois faible",
      "Certaines molécules thermosensibles peuvent être altérées",
      "Temps de distillation long"
    ]),
    bestFor: JSON.stringify(["Plantes aromatiques", "Feuilles", "Fleurs robustes", "Bois", "Racines"]),
    notSuitableFor: JSON.stringify(["Fleurs délicates (jasmin, tubéreuse)", "Agrumes (zeste)"]),
    costLevel: "medium" as const,
    complexityLevel: "moderate" as const,
    notes: "Méthode de référence ABSORBE pour les huiles essentielles",
  },
  {
    methodId: "EXT-HYDRO",
    name: "Hydrodistillation",
    shortName: "Hydrodistillation",
    category: "hydrodistillation" as const,
    description: "Variante où la matière végétale est immergée directement dans l'eau bouillante",
    principle: "La matière végétale baigne dans l'eau portée à ébullition, les vapeurs sont condensées",
    equipmentRequired: JSON.stringify(["Alambic traditionnel", "Source de chaleur", "Condenseur"]),
    temperatureRange: "100°C",
    duration: "2-8 heures",
    yieldRange: "0.1% - 2%",
    advantages: JSON.stringify([
      "Méthode traditionnelle ancestrale",
      "Équipement simple",
      "Adaptée aux petites quantités"
    ]),
    disadvantages: JSON.stringify([
      "Risque d'hydrolyse de certaines molécules",
      "Contact prolongé avec l'eau chaude",
      "Rendement souvent inférieur à la vapeur"
    ]),
    bestFor: JSON.stringify(["Fleurs", "Pétales", "Matières délicates"]),
    costLevel: "low" as const,
    complexityLevel: "simple" as const,
    notes: "Méthode traditionnelle pour rose et fleur d'oranger",
  },
  {
    methodId: "EXT-CO2-SC",
    name: "Extraction au CO₂ supercritique",
    shortName: "CO₂ supercritique",
    category: "co2_supercritique" as const,
    description: "Extraction utilisant le CO₂ à l'état supercritique comme solvant",
    principle: "Le CO₂ à haute pression (>74 bar) et température (>31°C) devient supercritique et dissout les composés aromatiques",
    equipmentRequired: JSON.stringify(["Extracteur haute pression", "Compresseur CO₂", "Séparateurs", "Système de recyclage"]),
    temperatureRange: "35-60°C",
    pressureRange: "100-300 bar",
    duration: "1-4 heures",
    yieldRange: "2% - 15%",
    advantages: JSON.stringify([
      "Extraction à basse température",
      "Pas de résidu de solvant",
      "Profil olfactif très fidèle à la plante",
      "Extraction sélective possible",
      "CO₂ recyclable"
    ]),
    disadvantages: JSON.stringify([
      "Équipement très coûteux",
      "Haute technicité requise",
      "Investissement initial important"
    ]),
    bestFor: JSON.stringify(["Épices", "Houblon", "Vanille", "Cannabis", "Matières thermosensibles"]),
    costLevel: "very_high" as const,
    complexityLevel: "expert" as const,
    notes: "Méthode de choix pour extraits haute fidélité - utilisée pour profils terpéniques cannabis",
  },
  {
    methodId: "EXT-SOLV-HEX",
    name: "Extraction aux solvants volatils",
    shortName: "Extraction solvant",
    category: "extraction_solvant" as const,
    description: "Extraction utilisant des solvants organiques volatils (hexane, éthanol)",
    principle: "Le solvant dissout les composés aromatiques, puis est évaporé pour obtenir une concrète ou un résinoïde",
    equipmentRequired: JSON.stringify(["Extracteur", "Évaporateur rotatif", "Système de récupération solvant"]),
    temperatureRange: "Température ambiante à 60°C",
    duration: "4-24 heures",
    yieldRange: "5% - 30%",
    advantages: JSON.stringify([
      "Rendement élevé",
      "Extraction complète des cires et absolus",
      "Adapté aux fleurs délicates"
    ]),
    disadvantages: JSON.stringify([
      "Traces de solvant possibles",
      "Nécessite une étape d'absolue",
      "Solvants inflammables"
    ]),
    bestFor: JSON.stringify(["Jasmin", "Tubéreuse", "Rose", "Fleurs délicates", "Résines"]),
    costLevel: "high" as const,
    complexityLevel: "complex" as const,
    notes: "Méthode standard pour concrètes et absolus de Grasse",
  },
  {
    methodId: "EXT-EXPR",
    name: "Expression à froid",
    shortName: "Cold pressing",
    category: "expression" as const,
    description: "Extraction mécanique par pression des zestes d'agrumes",
    principle: "Les poches à essence des zestes sont rompues mécaniquement, l'huile est récupérée par centrifugation",
    equipmentRequired: JSON.stringify(["Presse", "Centrifugeuse", "Râpe ou sfumatrice"]),
    temperatureRange: "Température ambiante",
    duration: "Instantané",
    yieldRange: "0.3% - 0.8%",
    advantages: JSON.stringify([
      "Aucune altération thermique",
      "Profil olfactif naturel préservé",
      "Méthode simple et rapide"
    ]),
    disadvantages: JSON.stringify([
      "Réservé aux agrumes",
      "Huiles photosensibilisantes (bergaptène)",
      "Conservation limitée"
    ]),
    bestFor: JSON.stringify(["Citron", "Orange", "Bergamote", "Pamplemousse", "Tous agrumes"]),
    notSuitableFor: JSON.stringify(["Autres matières végétales"]),
    costLevel: "low" as const,
    complexityLevel: "simple" as const,
    notes: "Seule méthode pour les huiles essentielles d'agrumes de qualité",
  },
  {
    methodId: "EXT-ENFL",
    name: "Enfleurage",
    shortName: "Enfleurage",
    category: "enfleurage" as const,
    description: "Méthode traditionnelle d'absorption des parfums floraux par les corps gras",
    principle: "Les fleurs fraîches sont déposées sur une couche de graisse qui absorbe les composés odorants",
    equipmentRequired: JSON.stringify(["Châssis en verre", "Graisse purifiée", "Spatules", "Alcool pour lavage"]),
    temperatureRange: "15-25°C",
    duration: "24-72 heures par charge, répété 20-30 fois",
    yieldRange: "0.01% - 0.1%",
    advantages: JSON.stringify([
      "Extraction très douce",
      "Capture des notes les plus subtiles",
      "Méthode artisanale prestigieuse"
    ]),
    disadvantages: JSON.stringify([
      "Extrêmement long et coûteux",
      "Rendement très faible",
      "Main d'œuvre intensive"
    ]),
    bestFor: JSON.stringify(["Jasmin", "Tubéreuse", "Fleurs à parfum continu"]),
    costLevel: "very_high" as const,
    complexityLevel: "expert" as const,
    notes: "Méthode historique de Grasse - quasi abandonnée, intérêt patrimonial",
  },
  {
    methodId: "EXT-MAC",
    name: "Macération",
    shortName: "Macération",
    category: "maceration" as const,
    description: "Extraction par trempage prolongé dans un solvant (huile, alcool)",
    principle: "La matière végétale est immergée dans le solvant qui extrait progressivement les composés",
    equipmentRequired: JSON.stringify(["Récipients en verre ou inox", "Filtres", "Agitateur"]),
    temperatureRange: "Température ambiante",
    duration: "2-8 semaines",
    yieldRange: "Variable selon concentration",
    advantages: JSON.stringify([
      "Méthode simple et accessible",
      "Pas de chaleur",
      "Adaptée aux teintures et macérats"
    ]),
    disadvantages: JSON.stringify([
      "Temps très long",
      "Extraction incomplète",
      "Risque de fermentation"
    ]),
    bestFor: JSON.stringify(["Vanille", "Tonka", "Résines", "Racines", "Teintures"]),
    costLevel: "low" as const,
    complexityLevel: "simple" as const,
    notes: "Méthode de base pour teintures et alcoolats ABSORBE",
  },
];

async function importData() {
  console.log("🌍 Import des terroirs...");
  
  for (const terroir of terroirsData) {
    try {
      await db.insert(terroirs).values(terroir);
      console.log(`  ✓ Terroir: ${terroir.name}`);
    } catch (error: any) {
      if (error.message?.includes("Duplicate")) {
        console.log(`  ⏭ Terroir déjà existant: ${terroir.name}`);
      } else {
        console.error(`  ✗ Erreur terroir ${terroir.name}:`, error.message);
      }
    }
  }
  
  console.log("\n🧪 Import des méthodes d'extraction...");
  
  for (const method of extractionMethodsData) {
    try {
      await db.insert(extractionMethods).values(method);
      console.log(`  ✓ Méthode: ${method.name}`);
    } catch (error: any) {
      if (error.message?.includes("Duplicate")) {
        console.log(`  ⏭ Méthode déjà existante: ${method.name}`);
      } else {
        console.error(`  ✗ Erreur méthode ${method.name}:`, error.message);
      }
    }
  }
  
  console.log("\n✅ Import terminé!");
  process.exit(0);
}

importData().catch(console.error);
