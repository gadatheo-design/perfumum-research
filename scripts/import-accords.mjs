import { drizzle } from "drizzle-orm/mysql2";
import { accords, families } from "../drizzle/schema.ts";
import { eq } from "drizzle-orm";
import dotenv from "dotenv";

dotenv.config();

const db = drizzle(process.env.DATABASE_URL);

// Accords représentatifs des différentes familles
const accordsData = [
  // Bio-Mineralis
  {
    name: "Os + Pluie",
    familyName: "Bio-Mineralis",
    olfactiveProfile: "Minéral humide, calcaire mouillé, pierre poreuse après l'averse",
    texture: "humide",
    emotionalResonance: "Mémoire géologique, temps suspendu",
    notes: "Premier accord de la série Bio-Mineralis. Articule minéralité osseuse et fraîcheur pluviale.",
  },
  {
    name: "Cuir Fossilisé",
    familyName: "Bio-Mineralis",
    olfactiveProfile: "Cuir ancien, terre compactée, résine durcie",
    texture: "sec",
    emotionalResonance: "Archive matérielle, profondeur temporelle",
    notes: "Deuxième accord Bio-Mineralis. Évoque la transformation du vivant en minéral.",
  },
  {
    name: "Pétrichor Anthropique",
    familyName: "Bio-Mineralis",
    olfactiveProfile: "Terre humaine, argile habitée, poussière domestique après la pluie",
    texture: "humide",
    emotionalResonance: "Mémoire habitée, trace humaine",
    notes: "Quatrième accord Bio-Mineralis. Dimension anthropologique du pétrichor.",
  },
  
  // Pétrichor
  {
    name: "Pétrichor Clair",
    familyName: "Pétrichor — Terre Humide",
    olfactiveProfile: "Terre légère, pluie fraîche, géosmine pure",
    texture: "humide",
    emotionalResonance: "Éveil, renouveau, clarté",
    notes: "Variation claire du pétrichor. Géosmine dominante avec notes vertes.",
  },
  {
    name: "Pétrichor Noir",
    familyName: "Pétrichor — Terre Humide",
    olfactiveProfile: "Terre noire, humus profond, sous-bois humide",
    texture: "humide",
    emotionalResonance: "Ancrage, profondeur, mystère",
    notes: "Variation sombre du pétrichor. Notes de terre noire et champignon.",
  },
  {
    name: "Pétrichor Argile",
    familyName: "Pétrichor — Terre Humide",
    olfactiveProfile: "Argile rouge mouillée, terre glaise, poterie humide",
    texture: "humide",
    emotionalResonance: "Matérialité, création, ancrage",
    notes: "Variation argileuse. Évoque la terre de potier après la pluie.",
  },
  {
    name: "Pétrichor Désert",
    familyName: "Pétrichor — Terre Humide",
    olfactiveProfile: "Sable mouillé, pierre chaude refroidie, ozone minéral",
    texture: "sec",
    emotionalResonance: "Contraste, rareté, intensité",
    notes: "Pétrichor des zones arides. Contraste maximal entre sec et humide.",
  },
  
  // Volcanique
  {
    name: "Basalte Chaud",
    familyName: "Volcanique — Pierre et Feu",
    olfactiveProfile: "Pierre volcanique chauffée, soufre léger, minéral fumé",
    texture: "pierre",
    emotionalResonance: "Puissance, transformation, énergie",
    notes: "Accord volcanique principal. Évoque la pierre en fusion.",
  },
  {
    name: "Vapeur Tectonique",
    familyName: "Volcanique — Pierre et Feu",
    olfactiveProfile: "Vapeur minérale, eau chaude sur roche, ozone sulfuré",
    texture: "air",
    emotionalResonance: "Tension, libération, purification",
    notes: "Dimension vaporeuse du volcanique. Sources thermales et geysers.",
  },
  {
    name: "Poussière Tectonique",
    familyName: "Volcanique — Pierre et Feu",
    olfactiveProfile: "Poussière de pierre, cendre fine, minéral pulvérisé",
    texture: "sec",
    emotionalResonance: "Légèreté minérale, suspension",
    notes: "Accord de cendre volcanique. Texture poudreuse et aérienne.",
  },
  
  // Fermentaire
  {
    name: "Tabac Fermenté",
    familyName: "Fermentaire — Matière Vivante",
    olfactiveProfile: "Tabac brun, cave humide, fermentation lactique",
    texture: "humide",
    emotionalResonance: "Profondeur, transformation, mémoire",
    notes: "Accord fermentaire principal. Base du prototype C1 FERMENTUM.",
  },
  {
    name: "Terre Vivante",
    familyName: "Fermentaire — Matière Vivante",
    olfactiveProfile: "Humus actif, compost, matière en décomposition noble",
    texture: "humide",
    emotionalResonance: "Cycle, régénération, vitalité",
    notes: "Dimension organique de la fermentation. Terre habitée par les micro-organismes.",
  },
  
  // Vert / Résine
  {
    name: "Sève Verte",
    familyName: "Vert / Résine — Clarté Végétale",
    olfactiveProfile: "Sève fraîche, feuille coupée, chlorophylle",
    texture: "humide",
    emotionalResonance: "Vitalité, fraîcheur, clarté",
    notes: "Accord vert principal. Dimension végétale pure.",
  },
  {
    name: "Résine Transparente",
    familyName: "Vert / Résine — Clarté Végétale",
    olfactiveProfile: "Résine de pin, térébenthine, cristal végétal",
    texture: "resine",
    emotionalResonance: "Verticalité, clarté, structure",
    notes: "Dimension résineuse claire. Base du prototype C2 CLARUS VERDE.",
  },
  
  // Bois / Résine / Terre Sacrée
  {
    name: "Encens Sacré",
    familyName: "Bois / Résine / Terre Sacrée",
    olfactiveProfile: "Oliban, myrrhe, fumée sacrée",
    texture: "resine",
    emotionalResonance: "Méditation, sacré, élévation",
    notes: "Accord sacré principal. Frankincense et résines nobles.",
  },
  {
    name: "Bois Fumé",
    familyName: "Bois / Résine / Terre Sacrée",
    olfactiveProfile: "Palo Santo, bois brûlé, fumée douce",
    texture: "sec",
    emotionalResonance: "Ancrage, purification, chaleur",
    notes: "Dimension fumée du bois sacré. Base du prototype C4 TERRA AMBRA.",
  },
  {
    name: "Terre Sacrée",
    familyName: "Bois / Résine / Terre Sacrée",
    olfactiveProfile: "Argile rituelle, terre de temple, poussière sacrée",
    texture: "sec",
    emotionalResonance: "Gravité, mémoire, rituel",
    notes: "Dimension tellurique du sacré. Terre des lieux de culte.",
  },
  
  // Solar-Mineralis
  {
    name: "Lait Solaire",
    familyName: "Solar-Mineralis",
    olfactiveProfile: "Lactone, amande, pierre chaude",
    texture: "lactone",
    emotionalResonance: "Douceur, chaleur, intimité",
    notes: "Accord lactonique principal. Base du prototype C3 LACTA SOLIS.",
  },
  {
    name: "Pierre Chaude",
    familyName: "Solar-Mineralis",
    olfactiveProfile: "Calcaire au soleil, minéral chaud, air vibrant",
    texture: "pierre",
    emotionalResonance: "Chaleur minérale, temps suspendu",
    notes: "Dimension minérale solaire. Pierre méditerranéenne chauffée.",
  },
];

async function importAccords() {
  console.log("🚀 Début de l'import des accords...\n");

  try {
    // Récupérer toutes les familles pour les relations
    const allFamilies = await db.select().from(families);
    const familyMap = new Map(allFamilies.map(f => [f.name, f.id]));

    for (const accord of accordsData) {
      console.log(`📝 Import de l'accord: ${accord.name}...`);
      
      const familyId = familyMap.get(accord.familyName);
      
      if (!familyId) {
        console.warn(`⚠️  Famille "${accord.familyName}" non trouvée pour l'accord "${accord.name}"`);
        continue;
      }
      
      await db.insert(accords).values({
        name: accord.name,
        familyId: familyId,
        olfactiveProfile: accord.olfactiveProfile,
        texture: accord.texture,
        emotionalResonance: accord.emotionalResonance,
        notes: accord.notes,
      });
      
      console.log(`✅ ${accord.name} importé avec succès`);
      console.log(`   Famille: ${accord.familyName} | Texture: ${accord.texture}\n`);
    }

    console.log("🎉 Import terminé avec succès !");
    console.log(`📊 Total: ${accordsData.length} accords importés`);
    
  } catch (error) {
    console.error("❌ Erreur lors de l'import:", error);
    process.exit(1);
  }
  
  process.exit(0);
}

importAccords();
