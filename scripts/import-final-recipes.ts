/**
 * Script d'import des Recettes Finales San Andrés
 * Source: Point 3 - Déclinaison en recettes finales
 */

import { getDb } from "../server/db";
import { finalRecipes } from "../drizzle/schema";

const finalRecipesData = [
  // PARFUMS
  {
    recipeId: "PF-01",
    name: "Salted Exposure / Leaf Edition",
    recipeType: "parfum" as const,
    function: "climat portable",
    climaticAxis: "vent_bois_disparition" as const,
    base: "alcool neutre",
    concentrate: [
      { ingredient: "Wind Cut / Citral Structure", percentage: 22 },
      { ingredient: "Vent Vert / Lippia Alba", percentage: 18 },
      { ingredient: "Tabac Clair / Architecture du Temps", percentage: 14 },
      { ingredient: "Cannabis Clair / Modulation", percentage: 12 },
      { ingredient: "Bois Chauffé / Soleil sur Planches", percentage: 10 },
      { ingredient: "Disparition / Trace Finale", percentage: 24 }
    ],
    dilution: "8 % dans alcool",
    restPeriod: "repos 7 jours max",
    expectedResult: "Air clair → peau salée abstraite → sortie sèche. Le tabac tient, le cannabis ouvre, aucun n'est lisible.",
    successCriteria: "Aucune note identifiable individuellement. Climat perceptible, non signature.",
    risks: "Si tabac ou cannabis identifiables → échec de la formule.",
    terpProfileIds: JSON.stringify(["SA-TP-01", "SA-TP-02", "SA-TP-04", "SA-TP-05", "SA-TP-08", "SA-TP-09"]),
    isRadical: 0
  },
  {
    recipeId: "PF-02",
    name: "Vent Social",
    recipeType: "parfum" as const,
    function: "interaction, conversation",
    climaticAxis: "vent" as const,
    base: "alcool neutre",
    concentrate: [
      { ingredient: "Wind Cut / Citral Structure", percentage: 35 },
      { ingredient: "Vent Vert / Lippia Alba", percentage: 30 },
      { ingredient: "Cannabis Clair / Modulation", percentage: 15 },
      { ingredient: "Disparition / Trace Finale", percentage: 20 }
    ],
    dilution: "7 %",
    restPeriod: "repos 5 jours",
    expectedResult: "Ouverture sociale. Air partagé. Aucune présence individuelle marquée.",
    successCriteria: "Facilite l'interaction sans être remarqué.",
    risks: "Si l'odeur 's'installe' → réduire Cannabis Clair.",
    usage: "moments collectifs, ateliers, médiation",
    terpProfileIds: JSON.stringify(["SA-TP-01", "SA-TP-02", "SA-TP-05", "SA-TP-09"]),
    isRadical: 0
  },
  {
    recipeId: "PF-03",
    name: "Architecture du Temps",
    recipeType: "parfum" as const,
    function: "durée sèche",
    climaticAxis: "bois_disparition" as const,
    base: "alcool neutre",
    concentrate: [
      { ingredient: "Tabac Clair / Architecture du Temps", percentage: 40 },
      { ingredient: "Leaf Economy / Tabac + Cannabis", percentage: 25 },
      { ingredient: "Bois Chauffé / Soleil sur Planches", percentage: 15 },
      { ingredient: "Disparition / Trace Finale", percentage: 20 }
    ],
    dilution: "6-7 %",
    restPeriod: "repos 7 jours",
    expectedResult: "Parfum presque immobile. Durée sans évolution perceptible.",
    successCriteria: "À porter comme outil de concentration, pas comme odeur.",
    risks: "Si trop présent → réduire concentration.",
    terpProfileIds: JSON.stringify(["SA-TP-04", "SA-TP-06", "SA-TP-08", "SA-TP-09"]),
    isRadical: 0
  },
  // ENCENS
  {
    recipeId: "EN-01",
    name: "Wind Purge / Leaf",
    recipeType: "encens" as const,
    function: "désaturation",
    climaticAxis: "vent" as const,
    base: "bois sec + fibres + terre claire + makko léger",
    concentrate: [
      { ingredient: "Bois sec neutre", percentage: 38 },
      { ingredient: "Fibres végétales", percentage: 22 },
      { ingredient: "Terre minérale claire", percentage: 20 },
      { ingredient: "Makko léger", percentage: 10 },
      { ingredient: "Poudre feuilles tabac sec", percentage: 6 },
      { ingredient: "Poudre feuilles chanvre", percentage: 4 }
    ],
    form: "pastilles plates fines",
    combustionTime: "≤ 5 min",
    expectedResult: "L'air semble plus vide après.",
    successCriteria: "Désaturation perceptible. Aucune odeur résiduelle identifiable.",
    risks: "Si odeur de fumée persistante → échec.",
    terpProfileIds: JSON.stringify(["SA-TP-07"]),
    isRadical: 0
  },
  {
    recipeId: "EN-02",
    name: "Bois Social",
    recipeType: "encens" as const,
    function: "seuil collectif",
    climaticAxis: "bois" as const,
    base: "bois sec + fibres + terre + makko",
    concentrate: [
      { ingredient: "Bois sec", percentage: 32 },
      { ingredient: "Fibres végétales", percentage: 20 },
      { ingredient: "Terre minérale", percentage: 18 },
      { ingredient: "Makko", percentage: 10 },
      { ingredient: "Tabac sec broyé", percentage: 12 },
      { ingredient: "Aromatiques sèches (bay)", percentage: 8 }
    ],
    form: "pastilles ou cônes",
    combustionTime: "≤ 8 min",
    expectedResult: "Seuil collectif. Transition d'espace.",
    successCriteria: "Pas de douceur. Si 'encens' est reconnaissable → échec.",
    risks: "Éviter toute note sucrée ou résineuse traditionnelle.",
    terpProfileIds: JSON.stringify(["SA-TP-03", "SA-TP-08"]),
    isRadical: 0
  },
  {
    recipeId: "EN-03",
    name: "Disappearance",
    recipeType: "encens" as const,
    function: "clôture",
    climaticAxis: "disparition" as const,
    base: "fibres + bois très sec + terre + makko",
    concentrate: [
      { ingredient: "Fibres végétales", percentage: 35 },
      { ingredient: "Bois très sec", percentage: 25 },
      { ingredient: "Terre minérale", percentage: 25 },
      { ingredient: "Makko", percentage: 10 },
      { ingredient: "Chanvre sec", percentage: 5 }
    ],
    form: "pastilles fines",
    combustionTime: "≤ 3 min",
    expectedResult: "Clôture. Fin de séquence.",
    successCriteria: "Fin d'exposition, fin de séance. Jamais en continu.",
    risks: "Ne pas utiliser comme encens d'ambiance.",
    usage: "fin d'exposition, fin de séance, jamais en continu",
    terpProfileIds: JSON.stringify(["SA-TP-09"]),
    isRadical: 0
  },
  // ESPACE
  {
    recipeId: "ES-01",
    name: "Circulating Climate",
    recipeType: "espace" as const,
    function: "conditionnement du lieu",
    climaticAxis: "vent_bois_disparition" as const,
    base: "Parfum PF-01 dilué à 2 %",
    protocol: "micro-imprégnation (tampon), aucun diffuseur actif, repos > diffusion",
    supports: "bois clair exposé, pierre / béton, textile sec",
    expectedResult: "On ne 'sent' pas une odeur. On sent que l'espace respire autrement.",
    successCriteria: "Perception atmosphérique, non olfactive directe.",
    risks: "Si odeur identifiable → trop concentré.",
    terpProfileIds: JSON.stringify(["SA-TP-10"]),
    isRadical: 0
  },
  {
    recipeId: "ES-02",
    name: "Leaf Presence",
    recipeType: "espace" as const,
    function: "référence végétale silencieuse",
    climaticAxis: "bois" as const,
    base: "matières végétales sèches",
    protocol: "exposition à l'air, jamais centrales, non brûlées",
    supports: "feuilles tabac sèches, feuilles chanvre sèches",
    expectedResult: "Les plantes sont là, sans usage.",
    successCriteria: "Présence silencieuse. Référence sans fonction apparente.",
    risks: "Ne pas mettre en valeur. Présence périphérique uniquement.",
    notes: "Les plantes sont là, sans usage.",
    terpProfileIds: JSON.stringify(["SA-TP-06"]),
    isRadical: 0
  },
  {
    recipeId: "ES-03",
    name: "Temporal Layer",
    recipeType: "espace" as const,
    function: "durée / mémoire",
    climaticAxis: "bois_disparition" as const,
    base: "PF-03 dilué à 1 %",
    protocol: "sol uniquement, un seul point, pas de réactivation",
    supports: "sol",
    expectedResult: "Perception fugace, non répétable.",
    successCriteria: "Mémoire olfactive. Trace temporelle.",
    risks: "Ne pas réactiver. Une seule application.",
    terpProfileIds: JSON.stringify(["SA-TP-04"]),
    isRadical: 0
  }
];

async function importFinalRecipes() {
  const db = await getDb();
  if (!db) {
    console.error("Database connection failed");
    return;
  }

  console.log("Importing Final Recipes data...");
  
  for (const recipe of finalRecipesData) {
    try {
      await db.insert(finalRecipes).values({
        recipeId: recipe.recipeId,
        name: recipe.name,
        recipeType: recipe.recipeType,
        function: recipe.function,
        climaticAxis: recipe.climaticAxis,
        base: recipe.base,
        concentrate: recipe.concentrate,
        dilution: recipe.dilution || null,
        restPeriod: recipe.restPeriod || null,
        form: recipe.form || null,
        combustionTime: recipe.combustionTime || null,
        protocol: recipe.protocol || null,
        supports: recipe.supports || null,
        expectedResult: recipe.expectedResult,
        successCriteria: recipe.successCriteria,
        risks: recipe.risks,
        notes: recipe.notes || null,
        usage: recipe.usage || null,
        terpProfileIds: recipe.terpProfileIds,
        isRadical: recipe.isRadical,
      });
      console.log(`✓ Imported: ${recipe.recipeId} - ${recipe.name}`);
    } catch (error: any) {
      if (error.code === 'ER_DUP_ENTRY') {
        console.log(`- Skipped (exists): ${recipe.recipeId}`);
      } else {
        console.error(`✗ Error importing ${recipe.recipeId}:`, error.message);
      }
    }
  }

  console.log("\nFinal Recipes import completed!");
}

importFinalRecipes().catch(console.error);
