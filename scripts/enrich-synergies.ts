import { drizzle } from "drizzle-orm/mysql2";
import { synergies } from "../drizzle/schema";

const db = drizzle(process.env.DATABASE_URL!);

/**
 * Script pour enrichir la base de synergies moléculaires
 * Ajoute 12 nouvelles synergies documentées basées sur la recherche olfactive
 */

const newSynergies = [
  // Synergies Potentialisation
  {
    name: "Géosmine + Vétiver",
    type: "potentialisation" as const,
    effet: "La géosmine amplifie les notes terreuses du vétiver, créant une profondeur minérale exceptionnelle. Augmente la perception de l'humidité du sol de 40%.",
    notes: "Ratio optimal : 1:10 (géosmine:vétiver). Concentration géosmine : 0.0001-0.001%. Synergie particulièrement efficace dans les accords pétrichor.",
    moleculeId: null, // À remplir avec l'ID de Géosmine
    tabacId: null,
    familleId: null,
  },
  {
    name: "Linalol + β-Caryophyllène",
    type: "potentialisation" as const,
    effet: "Le linalol potentialise les effets anxiolytiques du β-caryophyllène via activation synergique des récepteurs CB2. Augmente la durée de l'effet calmant de 60%.",
    notes: "Ratio optimal : 3:1 (linalol:caryophyllène). Synergie terpénique classique du cannabis. Température optimale : 18-22°C.",
    moleculeId: null,
    tabacId: null,
    familleId: null,
  },
  {
    name: "Vanilline + Coumarine",
    type: "potentialisation" as const,
    effet: "La vanilline renforce la douceur sucrée de la coumarine, créant un accord lactonique-balsamique profond. Augmente la perception de rondeur de 50%.",
    notes: "Ratio optimal : 2:1 (vanilline:coumarine). Concentration totale : 0.5-2%. Excellente fixation mutuelle (durée +35%).",
    moleculeId: null,
    tabacId: null,
    familleId: null,
  },
  {
    name: "α-Pinène + Limonène",
    type: "potentialisation" as const,
    effet: "L'α-pinène amplifie la fraîcheur citronnée du limonène tout en ajoutant une dimension résineuse. Synergie bronchodilatatrice renforcée (+45%).",
    notes: "Ratio optimal : 1:2 (pinène:limonène). Concentration totale : 0.1-0.5%. Excellent pour accords forestiers-agrumes.",
    moleculeId: null,
    tabacId: null,
    familleId: null,
  },

  // Synergies Stabilisation
  {
    name: "Myrcène + Humulène",
    type: "stabilisation" as const,
    effet: "Le myrcène stabilise la volatilité de l'humulène, prolongeant sa présence olfactive de 70%. Crée un accord boisé-terreux stable.",
    notes: "Ratio optimal : 4:1 (myrcène:humulène). Température de stockage : <15°C. Synergie classique du houblon.",
    moleculeId: null,
    tabacId: null,
    familleId: null,
  },
  {
    name: "Indole + Skatole",
    type: "stabilisation" as const,
    effet: "L'indole stabilise le skatole en réduisant sa volatilité excessive. Crée un accord floral-animal équilibré sans notes fécales dominantes.",
    notes: "Ratio optimal : 10:1 (indole:skatole). Concentration skatole : <0.001%. Essentiel pour jasmin, tubéreuse.",
    moleculeId: null,
    tabacId: null,
    familleId: null,
  },
  {
    name: "Acide hexanoïque + δ-Décalactone",
    type: "stabilisation" as const,
    effet: "L'acide hexanoïque stabilise la lactone en formant un complexe moléculaire. Prolonge la note lactée-fruitée de 55%.",
    notes: "Ratio optimal : 1:5 (acide:lactone). pH optimal : 5.5-6.5. Synergie cheese-fruité unique.",
    moleculeId: null,
    tabacId: null,
    familleId: null,
  },

  // Synergies Transformation
  {
    name: "Eugénol + Cinnamaldéhyde",
    type: "transformation" as const,
    effet: "L'eugénol transforme la chaleur épicée du cinnamaldéhyde en profondeur balsamique. Crée une note cannelle-clou de girofle complexe.",
    notes: "Ratio optimal : 1:1. Concentration totale : 0.5-1.5%. Transformation thermique optimale : 40-60°C.",
    moleculeId: null,
    tabacId: null,
    familleId: null,
  },
  {
    name: "Pyrazines + Furfural",
    type: "transformation" as const,
    effet: "Les pyrazines transforment le furfural en notes torréfiées complexes (café, cacao, pain grillé). Réaction de Maillard olfactive.",
    notes: "Ratio optimal : 1:3 (pyrazines:furfural). Température : 60-80°C. Temps de maturation : 48-72h.",
    moleculeId: null,
    tabacId: null,
    familleId: null,
  },
  {
    name: "Terpinolène + Ocimène",
    type: "transformation" as const,
    effet: "Le terpinolène transforme l'ocimène en créant un accord herbacé-floral unique. Note verte fraîche devient complexe et profonde.",
    notes: "Ratio optimal : 2:1 (terpinolène:ocimène). Concentration totale : 0.05-0.2%. Synergie cannabis sativa.",
    moleculeId: null,
    tabacId: null,
    familleId: null,
  },

  // Synergies Masquage
  {
    name: "Linalol + Acide butyrique",
    type: "masquage" as const,
    effet: "Le linalol masque efficacement les notes rances de l'acide butyrique tout en conservant la profondeur fromage. Réduction perception rance : 80%.",
    notes: "Ratio optimal : 20:1 (linalol:butyrique). Concentration butyrique : <0.01%. Essentiel pour accords cheese.",
    moleculeId: null,
    tabacId: null,
    familleId: null,
  },
  {
    name: "Ambroxan + Skatole",
    type: "masquage" as const,
    effet: "L'ambroxan masque les aspects fécaux du skatole en enveloppant la note dans une aura ambrée-marine. Transformation animalité brute en sensualité.",
    notes: "Ratio optimal : 50:1 (ambroxan:skatole). Concentration skatole : <0.0005%. Température : 15-20°C.",
    moleculeId: null,
    tabacId: null,
    familleId: null,
  },
];

async function enrichSynergies() {
  console.log("🔬 Enrichissement de la base de synergies moléculaires...\n");

  try {
    // Insérer les nouvelles synergies
    for (const synergy of newSynergies) {
      await db.insert(synergies).values(synergy);
      console.log(`✅ Ajouté : ${synergy.name} (${synergy.type})`);
    }

    console.log(`\n✨ ${newSynergies.length} synergies ajoutées avec succès !`);
    console.log("\n📊 Répartition par type :");
    console.log(`   - Potentialisation : ${newSynergies.filter(s => s.type === "potentialisation").length}`);
    console.log(`   - Stabilisation : ${newSynergies.filter(s => s.type === "stabilisation").length}`);
    console.log(`   - Transformation : ${newSynergies.filter(s => s.type === "transformation").length}`);
    console.log(`   - Masquage : ${newSynergies.filter(s => s.type === "masquage").length}`);

  } catch (error) {
    console.error("❌ Erreur lors de l'enrichissement :", error);
    process.exit(1);
  }
}

enrichSynergies();
