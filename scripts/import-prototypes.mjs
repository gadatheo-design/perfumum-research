import { drizzle } from "drizzle-orm/mysql2";
import { prototypes } from "../drizzle/schema.ts";
import dotenv from "dotenv";

dotenv.config();

const db = drizzle(process.env.DATABASE_URL);

const prototypesData = [
  {
    code: "C1",
    name: "FERMENTUM",
    emoji: "🍂",
    conceptualAxis: "Fermentation, Temps, Transformation — Matière vivante, organicité du monde",
    sensoryForm: "Terre humide, tabac fermenté, résine sombre",
    olfactiveFamily: "Fermentaire / Organique / Animalité noble",
    preferredSupport: "Cônes",
    keyEmotion: "Intime, troublante, enveloppante",
    overview: "C1 — FERMENTUM explore la dimension fermentaire de l'olfaction, articulant matière vivante et organicité du monde. Cette composition lactonique et humide évoque la terre mouillée, le tabac fermenté et les résines sombres.",
    composition: JSON.stringify({
      base: "Alcool (5 ml)",
      ingredients: [
        { name: "Vetiver Assam", quantity: "0.10 ml" },
        { name: "Ambergris", quantity: "0.05 ml" },
        { name: "Makrut", quantity: "0.08 ml" },
        { name: "Mitti Attar", quantity: "0.05 ml" },
        { name: "Éthanol 95°", quantity: "qsp 5 ml" }
      ],
      protocol: [
        "Mélanger les matières premières dans 0.5 ml d'alcool",
        "Ajouter progressivement le reste d'alcool",
        "Laisser maturer 72h minimum",
        "Réévaluer après maturation"
      ],
      characteristics: {
        tactile: "lactonique, humide, charnel",
        stability: "Élevée (animalité + terre + acide)",
        emotional: "intime, troublante, enveloppante"
      }
    }),
    conceptualReflection: "FERMENTUM interroge la fermentation comme processus de transformation matérielle et temporelle. La composition articule animalité noble (ambergris), terre humide (mitti), acidité végétale (makrut) et profondeur racinaire (vetiver) pour créer une atmosphère organique et charnelle.",
    installation: "Installation immersive avec diffusion par cônes. L'odeur se déploie lentement dans l'espace, créant une atmosphère enveloppante qui transforme la perception du lieu.",
    technicalDevelopment: "Stabilité élevée grâce à l'équilibre entre notes animales, terreuses et acides. Maturation minimale de 72h nécessaire pour l'harmonisation complète des composants.",
    theoreticalScope: "Phénoménologie de la fermentation, temporalité de la transformation, organicité du vivant, mémoire matérielle.",
    color: "#4A3F35",
  },
  {
    code: "C2",
    name: "CLARUS VERDE",
    emoji: "🌿",
    conceptualAxis: "Clarté, Végétal, Fraîcheur — Transparence, matière-lumière",
    sensoryForm: "Feuille verte, sève, rosée matinale",
    olfactiveFamily: "Vert / Résine / Agrume acide",
    preferredSupport: "Brume",
    keyEmotion: "Clarté mentale, verticalité",
    overview: "C2 — CLARUS VERDE explore la dimension de la clarté végétale, articulant transparence et matière-lumière. Cette composition tranchante et cristalline évoque la feuille verte, la sève fraîche et la rosée matinale.",
    composition: JSON.stringify({
      base: "Alcool (5 ml)",
      ingredients: [
        { name: "Juniper", quantity: "0.15 ml" },
        { name: "Makrut Lime", quantity: "0.10 ml" },
        { name: "Haitian Vetiver", quantity: "0.20 ml" },
        { name: "Éthanol 95°", quantity: "qsp 5 ml" }
      ],
      protocol: [
        "Mélanger Juniper + Makrut dans 1 ml d'alcool",
        "Ajouter le Vetiver",
        "Compléter avec l'alcool restant",
        "Repos 48h minimum"
      ],
      characteristics: {
        tactile: "tranchant, cristallin, mentholé vert",
        stability: "Moyenne (volatilité du Makrut)",
        emotional: "clarté mentale, verticalité"
      }
    }),
    conceptualReflection: "CLARUS VERDE interroge la clarté comme qualité sensible et conceptuelle. La composition articule verticalité résineuse (juniper), acidité citronnée (makrut) et ancrage terreux (vetiver) pour créer une atmosphère de transparence végétale.",
    installation: "Diffusion spatiale par brume ultrasonique. L'odeur se propage de manière homogène, créant une atmosphère légère et enveloppante qui transforme la perception de l'espace.",
    technicalDevelopment: "Stabilité moyenne due à la volatilité du makrut. Nécessite une diffusion continue pour maintenir l'intensité. Maturation de 48h recommandée.",
    theoreticalScope: "Phénoménologie de la clarté, verticalité végétale, transparence atmosphérique, lumière verte.",
    color: "#A8B5A0",
  },
  {
    code: "C3",
    name: "LACTA SOLIS",
    emoji: "☀️",
    conceptualAxis: "Lumière, Lactone, Chaleur — Lumière, douceur, mémoire",
    sensoryForm: "Lait solaire, pierre chaude, amande",
    olfactiveFamily: "Floral solaire / Lactonique / Peau chaude",
    preferredSupport: "Friction",
    keyEmotion: "Apaisante, intime, solaire",
    overview: "C3 — LACTA SOLIS explore la dimension lactonique et solaire de l'olfaction, articulant lumière, douceur et mémoire. Cette composition crémeuse et enveloppante évoque le lait solaire, la pierre chaude et l'amande.",
    composition: JSON.stringify({
      base: "Huile (10 ml)",
      ingredients: [
        { name: "Plumeria (Frangipani)", quantity: "0.6 ml" },
        { name: "Neroli Bouquetier", quantity: "0.08 ml" },
        { name: "Base MCT", quantity: "qsp 10 ml" }
      ],
      protocol: [
        "Mélanger les deux floraux dans 1 ml de MCT",
        "Homogénéiser pendant 2 minutes",
        "Ajouter le reste de MCT",
        "Laisser maturer 5-7 jours — transformation florale"
      ],
      characteristics: {
        tactile: "crémeux, enveloppant, chaleureux",
        stability: "Très élevée (huile + floraux)",
        emotional: "apaisante, intime, solaire"
      }
    }),
    conceptualReflection: "LACTA SOLIS interroge la lumière comme qualité sensible corporelle. La composition articule douceur florale (frangipani), éclat citronné (neroli) et texture huileuse pour créer une atmosphère de chaleur solaire et de mémoire tactile.",
    installation: "Application par friction sur textile ou peau. L'odeur se libère progressivement par contact, créant une expérience intime et corporelle.",
    technicalDevelopment: "Stabilité très élevée grâce à la base huileuse. Maturation de 5-7 jours nécessaire pour l'épanouissement complet des notes florales.",
    theoreticalScope: "Phénoménologie de la lumière, corporalité solaire, mémoire tactile, douceur lactonique.",
    color: "#F5E6D3",
  },
  {
    code: "C4",
    name: "TERRA AMBRA",
    emoji: "🪨",
    conceptualAxis: "Terre, Ambre, Minéralité — Temps, gravité, sacré",
    sensoryForm: "Argile, résine fossile, bois sec",
    olfactiveFamily: "Bois / Résine / Terre sacrée",
    preferredSupport: "Plaque chauffée",
    keyEmotion: "Méditative, enveloppante, sacrée",
    overview: "C4 — TERRA AMBRA explore la dimension minérale et sacrée de l'olfaction, articulant temps, gravité et sacré. Cette composition lente et chaleureuse évoque l'argile, la résine fossile et le bois sec.",
    composition: JSON.stringify({
      base: "Résine CBD (5 g) ou Huile (10 ml)",
      concentre: [
        { name: "Omani Frankincense", quantity: "0.2 ml" },
        { name: "Palo Santo", quantity: "0.15 ml" },
        { name: "Sandalwood", quantity: "0.10 ml" },
        { name: "MCT", quantity: "0.55 ml" }
      ],
      protocol: [
        "Préparer le concentré ci-dessus",
        "Appliquer 1 ml sur 5 g de résine",
        "Malaxer pendant 15 minutes",
        "Repos hermétique 48-72h",
        "Réévaluer et ajuster si nécessaire"
      ],
      characteristics: {
        tactile: "lent, chaud, ancré",
        stability: "Très élevée",
        emotional: "méditative, enveloppante, sacrée"
      }
    }),
    conceptualReflection: "TERRA AMBRA interroge la terre comme archive temporelle et espace sacré. La composition articule résine sacrée (frankincense), bois fumé (palo santo) et profondeur boisée (sandalwood) pour créer une atmosphère de gravité méditative.",
    installation: "Diffusion par plaque chauffée. L'évaporation lente crée une atmosphère dense et enveloppante qui transforme l'espace en lieu de méditation.",
    technicalDevelopment: "Stabilité très élevée. Maturation de 48-72h nécessaire pour l'intégration complète des résines. Contrôle précis de la température de diffusion.",
    theoreticalScope: "Phénoménologie de la terre, temporalité géologique, sacré matériel, gravité atmosphérique.",
    color: "#D4A574",
  },
];

async function importPrototypes() {
  console.log("🚀 Début de l'import des prototypes...\n");

  try {
    for (const prototype of prototypesData) {
      console.log(`📝 Import du prototype ${prototype.code} — ${prototype.name}...`);
      
      await db.insert(prototypes).values(prototype);
      
      console.log(`✅ ${prototype.code} importé avec succès\n`);
    }

    console.log("🎉 Import terminé avec succès !");
    console.log(`📊 Total: ${prototypesData.length} prototypes importés`);
    
  } catch (error) {
    console.error("❌ Erreur lors de l'import:", error);
    process.exit(1);
  }
  
  process.exit(0);
}

importPrototypes();
