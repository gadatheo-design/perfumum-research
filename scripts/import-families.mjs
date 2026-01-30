import { drizzle } from "drizzle-orm/mysql2";
import { families } from "../drizzle/schema.ts";
import dotenv from "dotenv";

dotenv.config();

const db = drizzle(process.env.DATABASE_URL);

// Familles olfactives principales du projet PERFUMUM
const familiesData = [
  // Série Perfumeum 12
  {
    name: "Perfumeum 12 — Série Atmosphérique",
    type: "perfumeum12",
    description: "Collection de 12 compositions atmosphériques explorant différentes dimensions sensibles et conceptuelles. Chaque composition articule recherche théorique, pratique de laboratoire et expérimentation artistique.",
    variationCount: 12,
  },
  
  // Bio-Mineralis (6 accords)
  {
    name: "Bio-Mineralis",
    type: "biomineralis",
    description: "Famille explorant l'intersection entre le vivant et le minéral. Six accords principaux : Os + Pluie, Cuir Fossilisé, Os Carbonisé, Pétrichor Anthropique, Sève/Chair/Roche, Nécro-Géo Sacré.",
    variationCount: 6,
  },
  
  // Pétrichor (60 variations)
  {
    name: "Pétrichor — Terre Humide",
    type: "petrichor",
    description: "Famille dédiée à l'odeur de la pluie sur la terre. 60 variations explorant différentes facettes : clair, noir, argile, bois humide, racine, mousse, désert, marin, glaciaire, urbain, sacré.",
    variationCount: 60,
  },
  
  // Volcanique (36 variations)
  {
    name: "Volcanique — Pierre et Feu",
    type: "volcanique",
    description: "Famille explorant les dimensions minérales et ignées. 36 variations : basalte chaud, basalte froid, vapeur, soufre, poussière tectonique, magma blanc, pierre poreuse.",
    variationCount: 36,
  },
  
  // Solar-Mineralis
  {
    name: "Solar-Mineralis",
    type: "solarmineralis",
    description: "Famille articulant lumière solaire et minéralité. Compositions lactoniques et chaleureuses évoquant la pierre chaude, le lait solaire et l'amande.",
    variationCount: 8,
  },
  
  // Nécro-Géo Sacré
  {
    name: "Nécro-Géo Sacré",
    type: "necrogeo",
    description: "Famille explorant la dimension sacrée de la matière fossile et géologique. Articulation entre temporalité profonde, gravité atmosphérique et rituel.",
    variationCount: 12,
  },
  
  // Royal Mossi
  {
    name: "Royal Mossi",
    type: "other",
    description: "Système olfactif inspiré de la culture Mossi. Articulation entre beurre de karité, tabac fermenté, terre rouge et résines sacrées.",
    variationCount: 4,
  },
  
  // Fermentaire
  {
    name: "Fermentaire — Matière Vivante",
    type: "other",
    description: "Famille explorant les processus de fermentation et de transformation organique. Notes lactoniques, humides et charnelles évoquant le tabac fermenté, la terre mouillée et les résines sombres.",
    variationCount: 15,
  },
  
  // Vert / Résine
  {
    name: "Vert / Résine — Clarté Végétale",
    type: "other",
    description: "Famille articulant transparence végétale et verticalité résineuse. Compositions tranchantes et cristallines évoquant la feuille verte, la sève et la rosée matinale.",
    variationCount: 10,
  },
  
  // Bois / Résine / Terre Sacrée
  {
    name: "Bois / Résine / Terre Sacrée",
    type: "other",
    description: "Famille explorant la dimension méditative et sacrée des matières boisées et résineuses. Compositions lentes et chaleureuses évoquant l'argile, la résine fossile et le bois sec.",
    variationCount: 18,
  },
];

async function importFamilies() {
  console.log("🚀 Début de l'import des familles olfactives...\n");

  try {
    for (const family of familiesData) {
      console.log(`📝 Import de la famille: ${family.name}...`);
      
      await db.insert(families).values(family);
      
      console.log(`✅ ${family.name} importée avec succès`);
      console.log(`   Type: ${family.type} | Variations: ${family.variationCount}\n`);
    }

    console.log("🎉 Import terminé avec succès !");
    console.log(`📊 Total: ${familiesData.length} familles importées`);
    console.log(`📊 Total variations: ${familiesData.reduce((sum, f) => sum + (f.variationCount || 0), 0)}`);
    
  } catch (error) {
    console.error("❌ Erreur lors de l'import:", error);
    process.exit(1);
  }
  
  process.exit(0);
}

importFamilies();
