import { drizzle } from "drizzle-orm/mysql2";
import { laboratoire } from "../drizzle/schema.ts";
import dotenv from "dotenv";

dotenv.config();

const db = drizzle(process.env.DATABASE_URL);

// Matières premières représentatives du projet PERFUMUM
const matieresData = [
  // Huiles essentielles
  {
    name: "Vétiver (Vetiveria zizanioides)",
    type: "huile_essentielle",
    origin: "Haïti / Java",
    olfactiveProfile: "Terre humide, racine, boisé profond, fumé",
    notes: "Base essentielle pour les accords pétrichor et terre. Note de fond puissante et tenace.",
    temperatureMax: 180,
  },
  {
    name: "Géranium Bourbon (Pelargonium graveolens)",
    type: "huile_essentielle",
    origin: "La Réunion",
    olfactiveProfile: "Rose verte, menthe, légèrement terreux",
    notes: "Utilisé pour les accords verts et floraux. Apporte de la fraîcheur.",
    temperatureMax: 160,
  },
  {
    name: "Cèdre Atlas (Cedrus atlantica)",
    type: "huile_essentielle",
    origin: "Maroc",
    olfactiveProfile: "Bois sec, crayon, légèrement camphré",
    notes: "Base boisée pour les accords secs et minéraux.",
    temperatureMax: 200,
  },
  {
    name: "Encens / Oliban (Boswellia carterii)",
    type: "huile_essentielle",
    origin: "Somalie / Oman",
    olfactiveProfile: "Résine claire, citronné, sacré, fumée douce",
    notes: "Matière centrale pour les accords sacrés et rituels. Utilisé depuis l'Antiquité.",
    temperatureMax: 180,
  },
  {
    name: "Myrrhe (Commiphora myrrha)",
    type: "resinoid",
    origin: "Somalie / Yémen",
    olfactiveProfile: "Résine sombre, médicinale, amère, chaude",
    notes: "Complément de l'oliban. Dimension funéraire et sacrée.",
    temperatureMax: 170,
  },
  
  // Absolus
  {
    name: "Absolu de Tabac",
    type: "absolu",
    origin: "France / Turquie",
    olfactiveProfile: "Tabac fermenté, miel sombre, foin, cuir",
    notes: "Base du prototype C1 FERMENTUM. Matière centrale du projet.",
    temperatureMax: 150,
  },
  {
    name: "Absolu de Foin",
    type: "absolu",
    origin: "France",
    olfactiveProfile: "Herbe sèche, coumarine, miel, paille",
    notes: "Dimension agricole et pastorale. Évoque les champs après la fauche.",
    temperatureMax: 140,
  },
  {
    name: "Absolu de Mousse de Chêne",
    type: "absolu",
    origin: "France / Balkans",
    olfactiveProfile: "Terre humide, forêt, champignon, bois moisi",
    notes: "Essentiel pour les accords pétrichor et sous-bois.",
    temperatureMax: 130,
  },
  
  // Résinoïdes
  {
    name: "Résinoïde de Labdanum",
    type: "resinoid",
    origin: "Espagne / Crète",
    olfactiveProfile: "Ambre sombre, cuir, miel, animal",
    notes: "Base ambré-cuir. Utilisé dans les accords chauds et enveloppants.",
    temperatureMax: 160,
  },
  {
    name: "Résinoïde de Benjoin",
    type: "resinoid",
    origin: "Laos / Sumatra",
    olfactiveProfile: "Vanille, caramel, balsamique, doux",
    notes: "Fixateur naturel. Apporte rondeur et douceur.",
    temperatureMax: 150,
  },
  
  // Matières minérales et spéciales
  {
    name: "Kaolin (Argile blanche)",
    type: "poudre",
    origin: "France / Chine",
    olfactiveProfile: "Minéral neutre, craie, pierre sèche",
    notes: "Utilisé pour les accords minéraux et osseux. Support de diffusion.",
    temperatureMax: 800,
  },
  {
    name: "Mitti Attar (Terre distillée)",
    type: "huile_essentielle",
    origin: "Inde (Kannauj)",
    olfactiveProfile: "Terre humide pure, pétrichor concentré, argile mouillée",
    notes: "Distillation traditionnelle de terre d'argile. Essence même du pétrichor.",
    temperatureMax: 120,
  },
  {
    name: "Géosmine (synthétique)",
    type: "autre",
    origin: "Synthèse",
    olfactiveProfile: "Terre mouillée, betterave, cave humide",
    notes: "Molécule responsable de l'odeur de pétrichor. Utilisée en trace.",
    temperatureMax: 100,
  },
  
  // Huiles essentielles complémentaires
  {
    name: "Pin Sylvestre (Pinus sylvestris)",
    type: "huile_essentielle",
    origin: "France / Russie",
    olfactiveProfile: "Résine de pin, térébenthine, forêt, frais",
    notes: "Base du prototype C2 CLARUS VERDE. Dimension verticale et claire.",
    temperatureMax: 170,
  },
  {
    name: "Patchouli (Pogostemon cablin)",
    type: "huile_essentielle",
    origin: "Indonésie",
    olfactiveProfile: "Terre sombre, bois humide, champignon, camphré",
    notes: "Note de fond terreuse. Complément du vétiver pour les accords sombres.",
    temperatureMax: 180,
  },
  {
    name: "Santal Blanc (Santalum album)",
    type: "huile_essentielle",
    origin: "Inde / Australie",
    olfactiveProfile: "Bois crémeux, lacté, doux, méditation",
    notes: "Dimension lactée et méditative. Utilisé dans les accords solar-mineralis.",
    temperatureMax: 160,
  },
  {
    name: "Ciste Labdanum (Cistus ladaniferus)",
    type: "huile_essentielle",
    origin: "Espagne",
    olfactiveProfile: "Ambre, cuir, miel sombre, animal",
    notes: "Version distillée du labdanum. Plus claire que le résinoïde.",
    temperatureMax: 170,
  },
  {
    name: "Cyprès (Cupressus sempervirens)",
    type: "huile_essentielle",
    origin: "France / Maroc",
    olfactiveProfile: "Bois sec, résine verte, fumée légère",
    notes: "Dimension funéraire et sacrée. Arbre des cimetières méditerranéens.",
    temperatureMax: 180,
  },
];

async function importMatieres() {
  console.log("🚀 Début de l'import des matières premières...\n");

  try {
    for (const matiere of matieresData) {
      console.log(`📝 Import de: ${matiere.name}...`);
      
      await db.insert(laboratoire).values({
        name: matiere.name,
        type: matiere.type,
        origin: matiere.origin,
        olfactiveProfile: matiere.olfactiveProfile,
        notes: matiere.notes,
        temperatureMax: matiere.temperatureMax,
      });
      
      console.log(`✅ ${matiere.name} importée avec succès`);
      console.log(`   Type: ${matiere.type} | Origine: ${matiere.origin}\n`);
    }

    console.log("🎉 Import terminé avec succès !");
    console.log(`📊 Total: ${matieresData.length} matières premières importées`);
    
  } catch (error) {
    console.error("❌ Erreur lors de l'import:", error);
    process.exit(1);
  }
  
  process.exit(0);
}

importMatieres();
