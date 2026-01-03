/**
 * Script d'import des plantes aromatiques San Andrés
 * Source: Recettes 3 - Plantes aromatiques + Tabac + Cannabis
 */

import { getDb } from "../server/db";
import { plants } from "../drizzle/schema";

const plantsData = [
  {
    name: "West Indian Bay / Bay rum tree",
    latinName: "Pimenta racemosa",
    family: "Myrtaceae",
    category: "aromatique" as const,
    origin: "Caraïbes, San Andrés",
    habitat: "Jardins domestiques, zones tropicales",
    olfactiveSignature: "Épicé-clou de girofle / baie / feuille chaude",
    dominantMolecules: JSON.stringify(["eugénol", "myrcène", "chavicol", "limonène"]),
    chemotypes: "Eugénol dominant",
    climaticAxis: "vent_bois" as const,
    traditionalUse: "Bay rum (lotion capillaire), cuisine caribéenne",
    absorbeUse: "Axe BOIS (support) + VENT (diffusion sèche), sans sucré",
    botanicalStates: [
      { state: "A", name: "Feuille verte fraîche", odor: "Épicé vif, clou de girofle", molecules: ["eugénol", "myrcène"], usage: "Extraction directe" },
      { state: "B", name: "Feuille séchée", odor: "Épicé plus doux, boisé", molecules: ["eugénol", "chavicol"], usage: "Infusion, macération" }
    ],
    notes: "Source: études GC-MS sur P. racemosa (Nature 2025)"
  },
  {
    name: "Lemongrass / Citronnelle",
    latinName: "Cymbopogon citratus",
    family: "Poaceae",
    category: "aromatique" as const,
    origin: "Asie tropicale, cultivé Caraïbes",
    habitat: "Jardins, zones humides tropicales",
    olfactiveSignature: "Coupe citronnée, aérienne, fraîche",
    dominantMolecules: JSON.stringify(["citral", "géranial", "néral", "β-caryophyllène", "myrcène"]),
    chemotypes: "Citral (géranial + néral) majoritaire",
    climaticAxis: "vent" as const,
    traditionalUse: "Cuisine asiatique, tisanes, répulsif insectes",
    absorbeUse: "Coupe aérienne très 'climat' ; attention à ne pas basculer 'savon'",
    botanicalStates: [
      { state: "A", name: "Feuille verte vivante", odor: "Citronné vif, frais", molecules: ["citral", "géranial"], usage: "Extraction fraîche" },
      { state: "B", name: "Feuille séchée", odor: "Citronné doux, herbacé", molecules: ["néral", "myrcène"], usage: "Infusion" }
    ],
    notes: "Source: revue PMC 2023 composition EO"
  },
  {
    name: "Lippia alba",
    latinName: "Lippia alba",
    family: "Verbenaceae",
    category: "aromatique" as const,
    origin: "Colombie, Amérique tropicale",
    habitat: "Zones tropicales colombiennes",
    olfactiveSignature: "Variable selon chémotype: citral ou carvone",
    dominantMolecules: JSON.stringify(["géranial", "néral", "carvone", "limonène", "β-caryophyllène", "géraniol"]),
    chemotypes: "Chémotype citral (géranial + néral) OU Chémotype carvone (carvone + limonène)",
    climaticAxis: "vent" as const,
    traditionalUse: "Médecine traditionnelle colombienne",
    absorbeUse: "Choix du chémotype: citral → vent/coupe, carvone → feuille/menthé-sec",
    botanicalStates: [
      { state: "A", name: "Chémotype citral", odor: "Citronné, frais, aérien", molecules: ["géranial", "néral"], usage: "Coupe vent" },
      { state: "B", name: "Chémotype carvone", odor: "Menthé sec, feuille", molecules: ["carvone", "limonène"], usage: "Structure sèche" }
    ],
    notes: "Source: articles PMC Colombie 2011"
  },
  {
    name: "Basilic",
    latinName: "Ocimum basilicum",
    family: "Lamiaceae",
    category: "aromatique" as const,
    origin: "Asie, Méditerranée",
    habitat: "Jardins domestiques, culture facile",
    olfactiveSignature: "Vert aromatique modulable selon chémotype",
    dominantMolecules: JSON.stringify(["linalool", "1,8-cinéole", "estragole", "eugénol"]),
    chemotypes: "Variable: linalool, estragole (anisé), eugénol",
    climaticAxis: "vent" as const,
    traditionalUse: "Cuisine méditerranéenne, tisanes",
    absorbeUse: "Liant vert discret ; attention à estragole (anisé) si on veut rester sec",
    botanicalStates: [
      { state: "A", name: "Feuille fraîche", odor: "Vert vif, aromatique", molecules: ["linalool", "estragole"], usage: "Extraction fraîche" },
      { state: "B", name: "Feuille séchée", odor: "Vert sec, épicé", molecules: ["eugénol", "1,8-cinéole"], usage: "Infusion" }
    ],
    notes: "Source: synthèse PMC 2023 basil"
  },
  {
    name: "Menthe verte",
    latinName: "Mentha spicata",
    family: "Lamiaceae",
    category: "aromatique" as const,
    origin: "Europe, Méditerranée",
    habitat: "Jardins, zones tempérées à tropicales",
    olfactiveSignature: "Menthé sec, carvone dominant",
    dominantMolecules: JSON.stringify(["carvone", "limonène", "menthone", "1,8-cinéole"]),
    chemotypes: "Carvone majoritaire",
    climaticAxis: "disparition" as const,
    traditionalUse: "Cuisine, tisanes, médecine",
    absorbeUse: "Excellent pour désaturation/purge (encens): sensation d'air plus 'nu'",
    botanicalStates: [
      { state: "A", name: "Feuille fraîche", odor: "Menthé vif, frais", molecules: ["carvone", "limonène"], usage: "Extraction fraîche" },
      { state: "B", name: "Feuille séchée", odor: "Menthé sec, doux", molecules: ["carvone", "menthone"], usage: "Encens, purge" }
    ],
    notes: "Source: review PMC 2019"
  },
  {
    name: "Origan",
    latinName: "Origanum vulgare",
    family: "Lamiaceae",
    category: "aromatique" as const,
    origin: "Méditerranée",
    habitat: "Zones sèches, méditerranéennes",
    olfactiveSignature: "Sec, phénolique, puissant",
    dominantMolecules: JSON.stringify(["carvacrol", "thymol", "p-cymène", "γ-terpinène"]),
    chemotypes: "Carvacrol + thymol (phénols majeurs)",
    climaticAxis: "bois" as const,
    traditionalUse: "Cuisine méditerranéenne, médecine",
    absorbeUse: "Micro-dose uniquement: peut vite devenir médicinal/culinaire",
    botanicalStates: [
      { state: "A", name: "Feuille fraîche", odor: "Phénolique vif, épicé", molecules: ["carvacrol", "thymol"], usage: "Micro-dose" },
      { state: "B", name: "Feuille séchée", odor: "Sec, herbacé, médicinal", molecules: ["p-cymène", "γ-terpinène"], usage: "Infusion contrôlée" }
    ],
    notes: "Source: revue PMC + Frontiers 2017"
  }
];

// Tabacs
const tabacsData = [
  {
    name: "Virginia (flue-cured)",
    latinName: "Nicotiana tabacum var. Virginia",
    family: "Solanaceae",
    category: "tabac" as const,
    origin: "Colombie (Santander, Huila)",
    habitat: "Zones agricoles colombiennes",
    olfactiveSignature: "Clair, miel-sec, foin, fruit",
    dominantMolecules: JSON.stringify(["β-damascenone", "megastigmatrienone", "solanone", "neophytadiene"]),
    chemotypes: "Flue-cured: séchage à chaud contrôlé",
    climaticAxis: "vent" as const,
    traditionalUse: "Cigarettes blondes, tabac à pipe",
    absorbeUse: "β-damascenone → halo fruité-sec (attention: trop = parfum)",
    botanicalStates: [
      { state: "A", name: "Feuille verte", odor: "Vert, herbacé", molecules: ["neophytadiene"], usage: "Matière première" },
      { state: "B", name: "Feuille jaunie (curing)", odor: "Miel, foin, fruit", molecules: ["β-damascenone", "megastigmatrienone"], usage: "Extraction principale" },
      { state: "C", name: "Feuille fermentée", odor: "Tabac mature, boisé", molecules: ["solanone"], usage: "Notes de fond" }
    ],
    notes: "Curing flue-cured: plus clair, miel-sec/foin/fruit"
  },
  {
    name: "Burley (air-cured)",
    latinName: "Nicotiana tabacum var. Burley",
    family: "Solanaceae",
    category: "tabac" as const,
    origin: "Colombie",
    habitat: "Zones agricoles",
    olfactiveSignature: "Sec, noisette, bois, moins sucré",
    dominantMolecules: JSON.stringify(["megastigmatrienone", "solanone", "neophytadiene"]),
    chemotypes: "Air-cured: séchage à l'air libre",
    climaticAxis: "bois" as const,
    traditionalUse: "Mélanges cigarettes, tabac à chiquer",
    absorbeUse: "megastigmatrienones → structure tabac sans fumée",
    botanicalStates: [
      { state: "A", name: "Feuille verte", odor: "Vert, terreux", molecules: ["neophytadiene"], usage: "Matière première" },
      { state: "B", name: "Feuille séchée air", odor: "Noisette, bois sec", molecules: ["megastigmatrienone"], usage: "Extraction principale" },
      { state: "C", name: "Feuille vieillie", odor: "Structure tabac profonde", molecules: ["solanone"], usage: "Notes de fond" }
    ],
    notes: "Curing air-cured: plus sec, noisette/bois, moins sucré"
  },
  {
    name: "Criollo (sun-cured)",
    latinName: "Nicotiana tabacum var. Criollo",
    family: "Solanaceae",
    category: "tabac" as const,
    origin: "Colombie, Cuba",
    habitat: "Zones tropicales",
    olfactiveSignature: "Structure, feuille, matière",
    dominantMolecules: JSON.stringify(["megastigmatrienone", "solanone", "neophytadiene", "β-damascenone"]),
    chemotypes: "Sun-cured: séchage au soleil",
    climaticAxis: "bois" as const,
    traditionalUse: "Cigares, tabac premium",
    absorbeUse: "solanone/neophytadiene → corps feuille, chaleur contrôlée",
    botanicalStates: [
      { state: "A", name: "Feuille verte", odor: "Vert intense, terreux", molecules: ["neophytadiene"], usage: "Matière première" },
      { state: "B", name: "Feuille séchée soleil", odor: "Feuille chaude, structure", molecules: ["megastigmatrienone", "solanone"], usage: "Extraction principale" },
      { state: "C", name: "Cape cigare", odor: "Complexe, boisé-fruité", molecules: ["β-damascenone"], usage: "Finition" }
    ],
    notes: "Curing sun-cured: plus structure/feuille, plus matière (cigares)"
  }
];

// Cannabis profiles
const cannabisData = [
  {
    name: "Profil VENT / clair",
    latinName: "Cannabis sativa (profil terpénique)",
    family: "Cannabaceae",
    category: "cannabis" as const,
    origin: "Colombie",
    habitat: "Variable",
    olfactiveSignature: "Aéré, frais, pin, citrus",
    dominantMolecules: JSON.stringify(["α-pinène", "β-pinène", "limonène"]),
    chemotypes: "Pinènes + limonène dominants",
    climaticAxis: "vent" as const,
    traditionalUse: "Variétés sativa énergisantes",
    absorbeUse: "Profil aéré, coupe fraîche",
    botanicalStates: [
      { state: "A", name: "Fleur fraîche", odor: "Pin vif, citrus", molecules: ["α-pinène", "limonène"], usage: "Extraction terpènes" }
    ],
    notes: "Classification par profil olfactif, pas par nom marketing"
  },
  {
    name: "Profil BOIS / structure",
    latinName: "Cannabis sativa (profil terpénique)",
    family: "Cannabaceae",
    category: "cannabis" as const,
    origin: "Colombie",
    habitat: "Variable",
    olfactiveSignature: "Sec, boisé, épicé",
    dominantMolecules: JSON.stringify(["β-caryophyllène", "humulène"]),
    chemotypes: "β-caryophyllène + humulène dominants",
    climaticAxis: "bois" as const,
    traditionalUse: "Variétés indica relaxantes",
    absorbeUse: "Structure sèche, boisé-épicé",
    botanicalStates: [
      { state: "A", name: "Fleur fraîche", odor: "Boisé, poivré", molecules: ["β-caryophyllène", "humulène"], usage: "Extraction terpènes" }
    ],
    notes: "Classification par profil olfactif"
  },
  {
    name: "Profil FEUILLE / vert",
    latinName: "Cannabis sativa (profil terpénique)",
    family: "Cannabaceae",
    category: "cannabis" as const,
    origin: "Colombie",
    habitat: "Variable",
    olfactiveSignature: "Vert, herbacé, mangue, terre",
    dominantMolecules: JSON.stringify(["terpinolène", "myrcène"]),
    chemotypes: "Terpinolène + myrcène dominants",
    climaticAxis: "bois" as const,
    traditionalUse: "Variétés hybrides",
    absorbeUse: "Vert, herbacé, parfois mangue/terre",
    botanicalStates: [
      { state: "A", name: "Fleur fraîche", odor: "Vert herbacé, fruité", molecules: ["terpinolène", "myrcène"], usage: "Extraction terpènes" }
    ],
    notes: "Classification par profil olfactif"
  },
  {
    name: "Profil DISPARITION / trace",
    latinName: "Cannabis sativa (profil terpénique)",
    family: "Cannabaceae",
    category: "cannabis" as const,
    origin: "Colombie",
    habitat: "Variable",
    olfactiveSignature: "Doux, floral, présence légère",
    dominantMolecules: JSON.stringify(["linalool"]),
    chemotypes: "Linalool faible + équilibre terpénique",
    climaticAxis: "disparition" as const,
    traditionalUse: "Variétés CBD, relaxantes",
    absorbeUse: "Présence douce, non collante",
    botanicalStates: [
      { state: "A", name: "Fleur fraîche", odor: "Floral doux, lavande", molecules: ["linalool"], usage: "Extraction terpènes" }
    ],
    notes: "Classification par profil olfactif - présence minimale"
  }
];

async function importPlants() {
  const db = await getDb();
  if (!db) {
    console.error("Database connection failed");
    return;
  }

  console.log("Importing plants data...");
  
  const allPlants = [...plantsData, ...tabacsData, ...cannabisData];
  
  for (const plant of allPlants) {
    try {
      await db.insert(plants).values({
        name: plant.name,
        latinName: plant.latinName,
        family: plant.family,
        category: plant.category,
        origin: plant.origin,
        habitat: plant.habitat,
        olfactiveSignature: plant.olfactiveSignature,
        dominantMolecules: plant.dominantMolecules,
        chemotypes: plant.chemotypes,
        climaticAxis: plant.climaticAxis,
        traditionalUse: plant.traditionalUse,
        absorbeUse: plant.absorbeUse,
        botanicalStates: plant.botanicalStates,
        notes: plant.notes,
      });
      console.log(`✓ Imported: ${plant.name}`);
    } catch (error: any) {
      if (error.code === 'ER_DUP_ENTRY') {
        console.log(`- Skipped (exists): ${plant.name}`);
      } else {
        console.error(`✗ Error importing ${plant.name}:`, error.message);
      }
    }
  }

  console.log("\\nImport completed!");
}

importPlants().catch(console.error);
