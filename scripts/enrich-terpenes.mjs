import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { molecules } from "../drizzle/schema.js";
import { eq } from "drizzle-orm";

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection);

const terpeneData = [
  {
    name: "Myrcène",
    botanicalSources: "Houblon (Humulus lupulus), Mangue (Mangifera indica), Citronnelle (Cymbopogon citratus), Cannabis sativa, Thym (Thymus vulgaris), Laurier (Laurus nobilis)",
    extractionMethod: "Hydrodistillation des parties aériennes, Extraction par CO₂ supercritique, Distillation fractionnée des huiles essentielles",
    therapeuticProperties: "Analgésique, Anti-inflammatoire, Sédatif, Relaxant musculaire, Anxiolytique, Potentialise les effets des cannabinoïdes (effet d'entourage)"
  },
  {
    name: "Limonène",
    botanicalSources: "Citron (Citrus limon), Orange (Citrus sinensis), Pamplemousse (Citrus paradisi), Menthe poivrée (Mentha piperita), Genévrier (Juniperus communis), Pin (Pinus spp.)",
    extractionMethod: "Expression à froid des zestes d'agrumes, Hydrodistillation, Extraction par solvant (hexane), Distillation sous vide pour préserver la fraîcheur",
    therapeuticProperties: "Antidépresseur, Anxiolytique, Anti-stress, Stimulant immunitaire, Antioxydant, Favorise l'absorption transdermique d'autres molécules"
  },
  {
    name: "α-Pinène",
    botanicalSources: "Pin sylvestre (Pinus sylvestris), Romarin (Rosmarinus officinalis), Sauge (Salvia officinalis), Eucalyptus (Eucalyptus globulus), Cannabis sativa, Basilic (Ocimum basilicum)",
    extractionMethod: "Distillation de la résine de conifères (térébenthine), Hydrodistillation des aiguilles de pin, Extraction par CO₂ supercritique des plantes aromatiques",
    therapeuticProperties: "Bronchodilatateur, Expectorant, Anti-inflammatoire, Améliore la mémoire et la concentration, Antimicrobien, Neuroprotecteur"
  },
  {
    name: "β-Pinène",
    botanicalSources: "Pin (Pinus spp.), Houblon (Humulus lupulus), Cumin (Cuminum cyminum), Persil (Petroselinum crispum), Cannabis sativa, Basilic (Ocimum basilicum)",
    extractionMethod: "Co-distillation avec α-Pinène à partir de résine de pin, Hydrodistillation des parties aériennes, Fractionnement chromatographique pour isoler le β-Pinène",
    therapeuticProperties: "Bronchodilatateur, Expectorant, Anti-inflammatoire, Antioxydant, Améliore la biodisponibilité d'autres composés"
  },
  {
    name: "β-Caryophyllène",
    botanicalSources: "Poivre noir (Piper nigrum), Clou de girofle (Syzygium aromaticum), Cannabis sativa, Houblon (Humulus lupulus), Basilic (Ocimum basilicum), Origan (Origanum vulgare)",
    extractionMethod: "Hydrodistillation des épices, Extraction par CO₂ supercritique (préserve les sesquiterpènes lourds), Distillation sous vide pour éviter la dégradation thermique",
    therapeuticProperties: "Anti-inflammatoire puissant (agoniste CB2), Analgésique, Gastroprotecteur, Neuroprotecteur, Anxiolytique, Antioxydant"
  },
  {
    name: "Linalool",
    botanicalSources: "Lavande (Lavandula angustifolia), Coriandre (Coriandrum sativum), Bois de rose (Aniba rosaeodora), Basilic (Ocimum basilicum), Menthe (Mentha spp.), Cannabis sativa",
    extractionMethod: "Hydrodistillation de la lavande, Extraction par CO₂ supercritique du bois de rose, Distillation fractionnée pour obtenir un linalool pur (>95%)",
    therapeuticProperties: "Anxiolytique, Sédatif, Anticonvulsivant, Analgésique, Anti-inflammatoire, Améliore le sommeil, Neuroprotecteur"
  },
  {
    name: "Humulène",
    botanicalSources: "Houblon (Humulus lupulus), Cannabis sativa, Gingembre (Zingiber officinale), Sauge (Salvia officinalis), Ginseng (Panax ginseng), Clou de girofle (Syzygium aromaticum)",
    extractionMethod: "Extraction par CO₂ supercritique du houblon (préserve les sesquiterpènes), Hydrodistillation des cônes de houblon, Distillation sous vide pour éviter l'oxydation",
    therapeuticProperties: "Anti-inflammatoire, Antibactérien, Coupe-faim (anorexigène), Analgésique, Antitumoral (études préliminaires), Antioxydant"
  }
];

console.log("🌿 Enrichissement des 7 terpènes avec données botaniques...\n");

let successCount = 0;
let errorCount = 0;

for (const terpene of terpeneData) {
  try {
    const result = await db.update(molecules)
      .set({
        botanicalSources: terpene.botanicalSources,
        extractionMethod: terpene.extractionMethod,
        therapeuticProperties: terpene.therapeuticProperties
      })
      .where(eq(molecules.name, terpene.name));
    
    console.log(`✅ ${terpene.name} enrichi`);
    successCount++;
  } catch (error) {
    console.error(`❌ Erreur pour ${terpene.name}:`, error.message);
    errorCount++;
  }
}

console.log(`\n📊 Résultat : ${successCount} terpènes enrichis, ${errorCount} erreurs`);

await connection.end();
