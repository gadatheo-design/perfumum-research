/**
 * Script d'import des TerpProfiles San Andrés
 * Source: Point 1 - Fiches interactives TerpProfiles
 */

import { getDb } from "../server/db";
import { terpProfiles } from "../drizzle/schema";

const terpProfilesData = [
  {
    profileId: "SA-TP-01",
    name: "Wind Cut / Citral Structure",
    collection: "San Andrés · Leaf Economies",
    type: "Formule analytique",
    climaticAxis: "vent" as const,
    secondaryAxis: "none" as const,
    function: "Coupe aérienne. Ouverture perceptive. Référence 'air clair'.",
    usage: "parfum_espace" as const,
    level: "Recherche",
    plantSources: JSON.stringify(["Lippia alba (chémotype citral)", "Cymbopogon citratus"]),
    keyMolecules: JSON.stringify(["Geranial", "Neral", "Limonene", "β-Caryophyllene"]),
    concentrate: [
      { ingredient: "Geranial", percentage: 22 },
      { ingredient: "Neral", percentage: 18 },
      { ingredient: "Limonene", percentage: 12 },
      { ingredient: "Iso E Super", percentage: 18 },
      { ingredient: "Aldéhyde C10 (10 %)", percentage: 4 },
      { ingredient: "β-Caryophyllene", percentage: 8 },
      { ingredient: "Linalool", percentage: 6 },
      { ingredient: "Support neutre", percentage: 12 }
    ],
    olfactiveReading: "Air clair, sec. Agrume non alimentaire. Aucune chaleur.",
    temporality: "rapide" as const,
    temporalityDescription: "Entrée rapide. Plateau court. Sortie nette.",
    recommendedUsage: "Parfum ≤ 8 %, Espace ≤ 2 %",
    criticalNotes: "Si la formule devient citronnée → excès de citral. Si elle 'tient' trop → réduire Iso E / muscs.",
    connections: [
      { type: "compare" as const, profileId: "SA-TP-02", name: "Vent Vert / Lippia Alba" },
      { type: "complete" as const, profileId: "SA-TP-09", name: "Disparition / Trace Finale" }
    ],
    intensity: "moyenne" as const,
    readability: "lisible" as const,
    nonIdentifiable: 0,
    radarVent: 90,
    radarBois: 20,
    radarDisparition: 40,
    radarStructure: 60,
    radarDiffusion: 80
  },
  {
    profileId: "SA-TP-02",
    name: "Vent Vert / Lippia Alba",
    collection: "San Andrés · Leaf Economies",
    type: "Formule analytique",
    climaticAxis: "vent" as const,
    secondaryAxis: "none" as const,
    function: "Vent végétal habité, non citronné. Plus feuille que lumière.",
    usage: "parfum" as const,
    level: "Recherche",
    plantSources: JSON.stringify(["Lippia alba (citral)"]),
    keyMolecules: JSON.stringify(["citral", "myrcène", "β-caryophyllène"]),
    concentrate: [
      { ingredient: "Citral", percentage: 25 },
      { ingredient: "Myrcène", percentage: 15 },
      { ingredient: "β-Caryophyllène", percentage: 12 },
      { ingredient: "Linalool", percentage: 8 },
      { ingredient: "Support neutre", percentage: 40 }
    ],
    olfactiveReading: "Vent végétal habité. Feuille verte sans acidité.",
    temporality: "moyenne" as const,
    temporalityDescription: "Développement progressif. Tenue moyenne.",
    recommendedUsage: "Parfum ≤ 10 %",
    criticalNotes: "Éviter excès citral pour ne pas basculer citronné.",
    connections: [
      { type: "compare" as const, profileId: "SA-TP-01", name: "Wind Cut / Citral Structure" }
    ],
    intensity: "moyenne" as const,
    readability: "lisible" as const,
    nonIdentifiable: 0,
    radarVent: 85,
    radarBois: 30,
    radarDisparition: 25,
    radarStructure: 45,
    radarDiffusion: 70
  },
  {
    profileId: "SA-TP-03",
    name: "Bois Épicé Sec / Pimenta racemosa",
    collection: "San Andrés · Leaf Economies",
    type: "Formule analytique",
    climaticAxis: "bois" as const,
    secondaryAxis: "none" as const,
    function: "Structure sèche. Support non gourmand.",
    usage: "parfum_encens" as const,
    level: "Recherche",
    plantSources: JSON.stringify(["Pimenta racemosa"]),
    keyMolecules: JSON.stringify(["eugenol", "β-caryophyllène"]),
    concentrate: [
      { ingredient: "Eugénol", percentage: 30 },
      { ingredient: "β-Caryophyllène", percentage: 20 },
      { ingredient: "Chavicol", percentage: 10 },
      { ingredient: "Myrcène", percentage: 8 },
      { ingredient: "Support neutre", percentage: 32 }
    ],
    olfactiveReading: "Bois épicé sans sucre. Structure sèche et chaude.",
    temporality: "longue" as const,
    temporalityDescription: "Entrée épicée. Plateau boisé long. Sortie sèche.",
    recommendedUsage: "Parfum ≤ 12 %, Encens base",
    criticalNotes: "Attention à l'eugénol: peut devenir dentiste si trop dosé.",
    connections: [
      { type: "complete" as const, profileId: "SA-TP-08", name: "Bois Chauffé / Soleil sur Planches" }
    ],
    intensity: "structurelle" as const,
    readability: "lisible" as const,
    nonIdentifiable: 0,
    radarVent: 25,
    radarBois: 95,
    radarDisparition: 20,
    radarStructure: 85,
    radarDiffusion: 50
  },
  {
    profileId: "SA-TP-04",
    name: "Tabac Clair / Architecture du Temps",
    collection: "San Andrés · Leaf Economies",
    type: "Formule analytique",
    climaticAxis: "bois_disparition" as const,
    secondaryAxis: "disparition" as const,
    function: "Tenue temporelle sans fumée.",
    usage: "parfum" as const,
    level: "Recherche",
    plantSources: JSON.stringify(["Nicotiana tabacum (air-cured)"]),
    keyMolecules: JSON.stringify(["β-damascenone", "megastigmatrienones"]),
    concentrate: [
      { ingredient: "β-Damascenone (1%)", percentage: 15 },
      { ingredient: "Megastigmatrienone", percentage: 10 },
      { ingredient: "Solanone", percentage: 8 },
      { ingredient: "Iso E Super", percentage: 25 },
      { ingredient: "Support neutre", percentage: 42 }
    ],
    olfactiveReading: "Tabac sans fumée. Architecture temporelle. Halo fruité-sec.",
    temporality: "longue" as const,
    temporalityDescription: "Développement lent. Tenue exceptionnelle. Sortie progressive.",
    recommendedUsage: "Parfum ≤ 15 %",
    criticalNotes: "β-damascenone très puissant: doser avec précision.",
    connections: [
      { type: "compare" as const, profileId: "SA-TP-06", name: "Leaf Economy / Tabac + Cannabis" }
    ],
    intensity: "moyenne" as const,
    readability: "abstrait" as const,
    nonIdentifiable: 1,
    radarVent: 30,
    radarBois: 70,
    radarDisparition: 65,
    radarStructure: 75,
    radarDiffusion: 55
  },
  {
    profileId: "SA-TP-05",
    name: "Cannabis Clair / Modulation",
    collection: "San Andrés · Leaf Economies",
    type: "Formule analytique",
    climaticAxis: "vent_disparition" as const,
    secondaryAxis: "disparition" as const,
    function: "Ajustement perceptif non identifiable.",
    usage: "espace" as const,
    level: "Recherche",
    plantSources: JSON.stringify(["Cannabis sativa (profil terpénique clair)"]),
    keyMolecules: JSON.stringify(["myrcène", "limonène", "pinènes"]),
    concentrate: [
      { ingredient: "Myrcène", percentage: 20 },
      { ingredient: "Limonène", percentage: 15 },
      { ingredient: "α-Pinène", percentage: 12 },
      { ingredient: "β-Pinène", percentage: 8 },
      { ingredient: "Linalool", percentage: 5 },
      { ingredient: "Support neutre", percentage: 40 }
    ],
    olfactiveReading: "Modulation perceptive. Non identifiable comme cannabis.",
    temporality: "variable" as const,
    temporalityDescription: "Entrée fraîche. Modulation continue. Sortie imperceptible.",
    recommendedUsage: "Espace ≤ 1 %",
    criticalNotes: "Objectif: non-identification. Si ça sent le cannabis, c'est raté.",
    connections: [
      { type: "complete" as const, profileId: "SA-TP-06", name: "Leaf Economy / Tabac + Cannabis" }
    ],
    intensity: "faible" as const,
    readability: "abstrait" as const,
    nonIdentifiable: 1,
    radarVent: 75,
    radarBois: 25,
    radarDisparition: 80,
    radarStructure: 30,
    radarDiffusion: 60
  },
  {
    profileId: "SA-TP-06",
    name: "Leaf Economy / Tabac + Cannabis",
    collection: "San Andrés · Leaf Economies",
    type: "Formule analytique",
    climaticAxis: "bois_disparition" as const,
    secondaryAxis: "disparition" as const,
    function: "Régulation sociale. Rythme relationnel.",
    usage: "espace" as const,
    level: "Recherche",
    plantSources: JSON.stringify(["Nicotiana tabacum", "Cannabis sativa"]),
    keyMolecules: JSON.stringify(["β-damascenone", "myrcène", "β-caryophyllène"]),
    concentrate: [
      { ingredient: "β-Damascenone (1%)", percentage: 10 },
      { ingredient: "Myrcène", percentage: 15 },
      { ingredient: "β-Caryophyllène", percentage: 12 },
      { ingredient: "Megastigmatrienone", percentage: 8 },
      { ingredient: "Limonène", percentage: 10 },
      { ingredient: "Support neutre", percentage: 45 }
    ],
    olfactiveReading: "Économie de la feuille. Régulation sociale invisible.",
    temporality: "longue" as const,
    temporalityDescription: "Installation progressive. Présence continue. Sortie douce.",
    recommendedUsage: "Espace ≤ 0.5 %",
    criticalNotes: "Formule conceptuelle. Usage recherche uniquement.",
    connections: [
      { type: "compare" as const, profileId: "SA-TP-04", name: "Tabac Clair / Architecture du Temps" },
      { type: "compare" as const, profileId: "SA-TP-05", name: "Cannabis Clair / Modulation" }
    ],
    intensity: "faible" as const,
    readability: "abstrait" as const,
    nonIdentifiable: 1,
    radarVent: 40,
    radarBois: 60,
    radarDisparition: 85,
    radarStructure: 50,
    radarDiffusion: 45
  },
  {
    profileId: "SA-TP-07",
    name: "Encens Base / Wind Purge",
    collection: "San Andrés · Leaf Economies",
    type: "Formule analytique",
    climaticAxis: "vent" as const,
    secondaryAxis: "none" as const,
    function: "Désaturation de l'air. Ouverture de seuil.",
    usage: "encens" as const,
    level: "Recherche",
    plantSources: JSON.stringify(["Mentha spicata", "Cymbopogon citratus"]),
    keyMolecules: JSON.stringify(["carvone", "citral", "limonène"]),
    concentrate: [
      { ingredient: "Carvone", percentage: 25 },
      { ingredient: "Citral", percentage: 20 },
      { ingredient: "Limonène", percentage: 15 },
      { ingredient: "1,8-Cinéole", percentage: 10 },
      { ingredient: "Support combustible", percentage: 30 }
    ],
    olfactiveReading: "Purge aérienne. Désaturation. Air plus nu.",
    temporality: "rapide" as const,
    temporalityDescription: "Combustion rapide. Effet immédiat. Sortie nette.",
    recommendedUsage: "Encens pastille ≤ 5 min",
    criticalNotes: "Formule encens uniquement. Ne pas utiliser en parfum.",
    connections: [
      { type: "complete" as const, profileId: "SA-TP-09", name: "Disparition / Trace Finale" }
    ],
    intensity: "moyenne" as const,
    readability: "lisible" as const,
    nonIdentifiable: 0,
    radarVent: 95,
    radarBois: 15,
    radarDisparition: 70,
    radarStructure: 35,
    radarDiffusion: 90
  },
  {
    profileId: "SA-TP-08",
    name: "Bois Chauffé / Soleil sur Planches",
    collection: "San Andrés · Leaf Economies",
    type: "Formule analytique",
    climaticAxis: "bois" as const,
    secondaryAxis: "none" as const,
    function: "Matière exposée. Chaleur non enveloppante.",
    usage: "parfum_espace" as const,
    level: "Recherche",
    plantSources: JSON.stringify(["Pimenta racemosa", "Origanum vulgare"]),
    keyMolecules: JSON.stringify(["eugénol", "carvacrol", "β-caryophyllène"]),
    concentrate: [
      { ingredient: "Eugénol", percentage: 20 },
      { ingredient: "β-Caryophyllène", percentage: 18 },
      { ingredient: "Carvacrol (micro)", percentage: 3 },
      { ingredient: "Iso E Super", percentage: 25 },
      { ingredient: "Ambroxan", percentage: 10 },
      { ingredient: "Support neutre", percentage: 24 }
    ],
    olfactiveReading: "Bois au soleil. Chaleur sèche. Matière exposée.",
    temporality: "longue" as const,
    temporalityDescription: "Montée progressive. Plateau solaire. Sortie boisée.",
    recommendedUsage: "Parfum ≤ 10 %, Espace ≤ 2 %",
    criticalNotes: "Carvacrol en micro-dose uniquement.",
    connections: [
      { type: "compare" as const, profileId: "SA-TP-03", name: "Bois Épicé Sec / Pimenta racemosa" }
    ],
    intensity: "structurelle" as const,
    readability: "lisible" as const,
    nonIdentifiable: 0,
    radarVent: 35,
    radarBois: 90,
    radarDisparition: 30,
    radarStructure: 80,
    radarDiffusion: 55
  },
  {
    profileId: "SA-TP-09",
    name: "Disparition / Trace Finale",
    collection: "San Andrés · Leaf Economies",
    type: "Formule analytique",
    climaticAxis: "disparition" as const,
    secondaryAxis: "none" as const,
    function: "Extinction nette. Sortie perceptive.",
    usage: "tous" as const,
    level: "Recherche",
    plantSources: JSON.stringify(["Mentha spicata", "Lippia alba"]),
    keyMolecules: JSON.stringify(["linalool", "carvone", "traces terpéniques"]),
    concentrate: [
      { ingredient: "Linalool", percentage: 15 },
      { ingredient: "Carvone", percentage: 10 },
      { ingredient: "Hedione", percentage: 20 },
      { ingredient: "Iso E Super (faible)", percentage: 10 },
      { ingredient: "Support neutre", percentage: 45 }
    ],
    olfactiveReading: "Trace finale. Extinction perceptive. Sortie nette.",
    temporality: "tres_courte" as const,
    temporalityDescription: "Présence minimale. Disparition programmée.",
    recommendedUsage: "Complément toutes formules",
    criticalNotes: "Formule de sortie. À utiliser en fin de composition.",
    connections: [
      { type: "complete" as const, profileId: "SA-TP-01", name: "Wind Cut / Citral Structure" },
      { type: "complete" as const, profileId: "SA-TP-07", name: "Encens Base / Wind Purge" }
    ],
    intensity: "faible" as const,
    readability: "abstrait" as const,
    nonIdentifiable: 1,
    radarVent: 50,
    radarBois: 20,
    radarDisparition: 95,
    radarStructure: 25,
    radarDiffusion: 40
  },
  {
    profileId: "SA-TP-10",
    name: "San Andrés / Climat Total",
    collection: "San Andrés · Leaf Economies",
    type: "Formule analytique",
    climaticAxis: "vent_bois_disparition" as const,
    secondaryAxis: "none" as const,
    function: "Synthèse climatique. Climat lisible, non signature.",
    usage: "tous" as const,
    level: "Recherche",
    plantSources: JSON.stringify(["Lippia alba", "Pimenta racemosa", "Nicotiana tabacum", "Cannabis sativa"]),
    keyMolecules: JSON.stringify(["citral", "eugénol", "β-damascenone", "myrcène", "linalool"]),
    concentrate: [
      { ingredient: "Citral", percentage: 12 },
      { ingredient: "Eugénol", percentage: 10 },
      { ingredient: "β-Damascenone (1%)", percentage: 8 },
      { ingredient: "Myrcène", percentage: 10 },
      { ingredient: "β-Caryophyllène", percentage: 8 },
      { ingredient: "Linalool", percentage: 6 },
      { ingredient: "Iso E Super", percentage: 15 },
      { ingredient: "Hedione", percentage: 10 },
      { ingredient: "Support neutre", percentage: 21 }
    ],
    olfactiveReading: "Climat total San Andrés. Synthèse des trois axes. Non-signature.",
    temporality: "variable" as const,
    temporalityDescription: "Évolution complète: Vent → Bois → Disparition",
    recommendedUsage: "Parfum ≤ 12 %, Encens, Espace",
    criticalNotes: "Formule de synthèse. Équilibre délicat entre les trois axes.",
    connections: [
      { type: "compare" as const, profileId: "SA-TP-01", name: "Wind Cut / Citral Structure" },
      { type: "compare" as const, profileId: "SA-TP-03", name: "Bois Épicé Sec / Pimenta racemosa" },
      { type: "compare" as const, profileId: "SA-TP-09", name: "Disparition / Trace Finale" }
    ],
    intensity: "moyenne" as const,
    readability: "structure" as const,
    nonIdentifiable: 0,
    radarVent: 65,
    radarBois: 65,
    radarDisparition: 65,
    radarStructure: 70,
    radarDiffusion: 65
  }
];

async function importTerpProfiles() {
  const db = await getDb();
  if (!db) {
    console.error("Database connection failed");
    return;
  }

  console.log("Importing TerpProfiles data...");
  
  for (const profile of terpProfilesData) {
    try {
      await db.insert(terpProfiles).values({
        profileId: profile.profileId,
        name: profile.name,
        collection: profile.collection,
        type: profile.type,
        climaticAxis: profile.climaticAxis,
        secondaryAxis: profile.secondaryAxis,
        function: profile.function,
        usage: profile.usage,
        level: profile.level,
        plantSources: profile.plantSources,
        keyMolecules: profile.keyMolecules,
        concentrate: profile.concentrate,
        olfactiveReading: profile.olfactiveReading,
        temporality: profile.temporality,
        temporalityDescription: profile.temporalityDescription,
        recommendedUsage: profile.recommendedUsage,
        criticalNotes: profile.criticalNotes,
        connections: profile.connections,
        intensity: profile.intensity,
        readability: profile.readability,
        nonIdentifiable: profile.nonIdentifiable,
        radarVent: profile.radarVent,
        radarBois: profile.radarBois,
        radarDisparition: profile.radarDisparition,
        radarStructure: profile.radarStructure,
        radarDiffusion: profile.radarDiffusion,
      });
      console.log(`✓ Imported: ${profile.profileId} - ${profile.name}`);
    } catch (error: any) {
      if (error.code === 'ER_DUP_ENTRY') {
        console.log(`- Skipped (exists): ${profile.profileId}`);
      } else {
        console.error(`✗ Error importing ${profile.profileId}:`, error.message);
      }
    }
  }

  console.log("\\nTerpProfiles import completed!");
}

importTerpProfiles().catch(console.error);
