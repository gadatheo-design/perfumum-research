import "dotenv/config";
import { drizzle } from "drizzle-orm/mysql2";
import { volcanique } from "../drizzle/schema.ts";

const db = drizzle(process.env.DATABASE_URL);

// 12 familles Volcanique x 3 variations = 36 variations
const volcaniqueData = [
  // 1. BASALTE HUMIDE (3 variations)
  {
    variation: "Basalte Humide — Black Stone Rain",
    familyType: "Basalte Humide",
    dominantMolecules: JSON.stringify(["basalte humide", "soufre minimal", "pierre noire"]),
    thermalActivity: "post-éruptif",
    geologicalContext: "champ de lave refroidi",
    olfactiveProfile: "Pierre volcanique noire après la pluie. Minéralité brute et soufre discret.",
    associatedCivilizations: JSON.stringify(["Akrotiri"]),
    intensity: 5,
  },
  {
    variation: "Basalte Humide — Lava Field Morning",
    familyType: "Basalte Humide",
    dominantMolecules: JSON.stringify(["basalte", "rosée", "minéral noir"]),
    thermalActivity: "dormant",
    geologicalContext: "champ de lave ancien",
    olfactiveProfile: "Rosée matinale sur champ de lave. Fraîcheur minérale sur pierre brûlée.",
    intensity: 4,
  },
  {
    variation: "Basalte Humide — Volcanic Shore",
    familyType: "Basalte Humide",
    dominantMolecules: JSON.stringify(["basalte", "sel marin", "soufre"]),
    thermalActivity: "éteint",
    geologicalContext: "côte volcanique",
    olfactiveProfile: "Rivage de pierre volcanique. Rencontre entre lave et océan.",
    intensity: 4,
  },

  // 2. CENDRE FROIDE (3 variations)
  {
    variation: "Cendre Froide — Ash Field",
    familyType: "Cendre Froide",
    dominantMolecules: JSON.stringify(["cendre volcanique", "pierre ponce", "poussière minérale"]),
    thermalActivity: "éteint",
    geologicalContext: "plaine de cendres",
    olfactiveProfile: "Champ de cendres volcaniques refroidies. Poussière minérale et mémoire du feu.",
    associatedCivilizations: JSON.stringify(["Akrotiri"]),
    intensity: 3,
  },
  {
    variation: "Cendre Froide — Pumice Dust",
    familyType: "Cendre Froide",
    dominantMolecules: JSON.stringify(["pierre ponce", "cendre", "minéral léger"]),
    thermalActivity: "éteint",
    geologicalContext: "dépôt de pierre ponce",
    olfactiveProfile: "Poussière de pierre ponce. Légèreté minérale et texture poreuse.",
    intensity: 2,
  },
  {
    variation: "Cendre Froide — Volcanic Winter",
    familyType: "Cendre Froide",
    dominantMolecules: JSON.stringify(["cendre", "glace", "atmosphère froide"]),
    thermalActivity: "post-catastrophique",
    geologicalContext: "hiver volcanique",
    olfactiveProfile: "Cendres dans atmosphère glacée. Apocalypse minérale.",
    intensity: 4,
  },

  // 3. SOUFRE ACTIF (3 variations)
  {
    variation: "Soufre Actif — Sulfur Vent",
    familyType: "Soufre Actif",
    dominantMolecules: JSON.stringify(["soufre pur", "vapeur acide", "minéraux chauds"]),
    thermalActivity: "actif",
    geologicalContext: "fumerolles",
    olfactiveProfile: "Évent de soufre actif. Vapeurs acides et chaleur géothermique.",
    intensity: 5,
  },
  {
    variation: "Soufre Actif — Yellow Crater",
    familyType: "Soufre Actif",
    dominantMolecules: JSON.stringify(["soufre cristallisé", "vapeur", "acide"]),
    thermalActivity: "actif",
    geologicalContext: "cratère soufré",
    olfactiveProfile: "Cratère aux dépôts de soufre jaune. Acidité et chaleur.",
    intensity: 5,
  },
  {
    variation: "Soufre Actif — Thermal Pool",
    familyType: "Soufre Actif",
    dominantMolecules: JSON.stringify(["soufre doux", "eau thermale", "minéraux"]),
    thermalActivity: "géothermique",
    geologicalContext: "source thermale",
    olfactiveProfile: "Bassin thermal soufré. Soufre adouci par l'eau chaude.",
    intensity: 4,
  },

  // 4. FUMÉE NOIRE (3 variations)
  {
    variation: "Fumée Noire — Black Smoke",
    familyType: "Fumée Noire",
    dominantMolecules: JSON.stringify(["fumée volcanique", "carbone", "minéraux brûlés"]),
    thermalActivity: "éruptif",
    geologicalContext: "éruption active",
    olfactiveProfile: "Fumée noire d'éruption. Carbone et minéraux incandescents.",
    intensity: 5,
  },
  {
    variation: "Fumée Noire — Pyroclastic Flow",
    familyType: "Fumée Noire",
    dominantMolecules: JSON.stringify(["nuée ardente", "cendre chaude", "gaz"]),
    thermalActivity: "éruptif violent",
    geologicalContext: "coulée pyroclastique",
    olfactiveProfile: "Nuée ardente. Destruction et chaleur extrême.",
    intensity: 5,
  },
  {
    variation: "Fumée Noire — Volcanic Fog",
    familyType: "Fumée Noire",
    dominantMolecules: JSON.stringify(["brouillard volcanique", "soufre", "cendre fine"]),
    thermalActivity: "post-éruptif",
    geologicalContext: "brume volcanique",
    olfactiveProfile: "Brouillard volcanique persistant. Soufre et cendre en suspension.",
    intensity: 4,
  },

  // 5. OBSIDIENNE (3 variations)
  {
    variation: "Obsidienne — Black Glass",
    familyType: "Obsidienne",
    dominantMolecules: JSON.stringify(["obsidienne", "verre volcanique", "minéral noir"]),
    thermalActivity: "refroidi rapidement",
    geologicalContext: "coulée d'obsidienne",
    olfactiveProfile: "Verre volcanique noir. Refroidissement instantané de la lave.",
    intensity: 3,
  },
  {
    variation: "Obsidienne — Mirror Stone",
    familyType: "Obsidienne",
    dominantMolecules: JSON.stringify(["obsidienne polie", "verre", "silence minéral"]),
    thermalActivity: "ancien",
    geologicalContext: "obsidienne taillée",
    olfactiveProfile: "Obsidienne polie comme miroir. Perfection minérale.",
    intensity: 2,
  },
  {
    variation: "Obsidienne — Volcanic Blade",
    familyType: "Obsidienne",
    dominantMolecules: JSON.stringify(["obsidienne tranchante", "verre", "pierre noire"]),
    thermalActivity: "ancien",
    geologicalContext: "lame d'obsidienne",
    olfactiveProfile: "Lame d'obsidienne. Tranchant et noirceur absolue.",
    intensity: 3,
  },

  // 6. LAVE INCANDESCENTE (3 variations)
  {
    variation: "Lave Incandescente — Molten Flow",
    familyType: "Lave Incandescente",
    dominantMolecules: JSON.stringify(["lave liquide", "chaleur extrême", "minéraux fondus"]),
    thermalActivity: "actif",
    geologicalContext: "coulée de lave",
    olfactiveProfile: "Lave en fusion. Chaleur extrême et matière liquide.",
    intensity: 5,
  },
  {
    variation: "Lave Incandescente — Lava Lake",
    familyType: "Lave Incandescente",
    dominantMolecules: JSON.stringify(["lac de lave", "gaz", "chaleur radiante"]),
    thermalActivity: "actif permanent",
    geologicalContext: "lac de lave",
    olfactiveProfile: "Lac de lave permanent. Chaleur radiante et gaz volcaniques.",
    intensity: 5,
  },
  {
    variation: "Lave Incandescente — Fire Fountain",
    familyType: "Lave Incandescente",
    dominantMolecules: JSON.stringify(["fontaine de lave", "gouttelettes incandescentes", "vapeur"]),
    thermalActivity: "éruptif",
    geologicalContext: "fontaine de lave",
    olfactiveProfile: "Fontaine de lave. Projection de matière incandescente.",
    intensity: 5,
  },

  // 7. PIERRE PONCE (3 variations)
  {
    variation: "Pierre Ponce — Pumice Field",
    familyType: "Pierre Ponce",
    dominantMolecules: JSON.stringify(["pierre ponce", "air emprisonné", "minéral léger"]),
    thermalActivity: "éteint",
    geologicalContext: "champ de pierre ponce",
    olfactiveProfile: "Champ de pierre ponce. Légèreté minérale et porosité.",
    intensity: 2,
  },
  {
    variation: "Pierre Ponce — Floating Stone",
    familyType: "Pierre Ponce",
    dominantMolecules: JSON.stringify(["pierre ponce flottante", "eau", "minéral"]),
    thermalActivity: "éteint",
    geologicalContext: "pierre ponce en mer",
    olfactiveProfile: "Pierre ponce flottant sur l'océan. Paradoxe minéral.",
    intensity: 2,
  },
  {
    variation: "Pierre Ponce — Volcanic Foam",
    familyType: "Pierre Ponce",
    dominantMolecules: JSON.stringify(["mousse volcanique", "bulles minérales", "légèreté"]),
    thermalActivity: "refroidi",
    geologicalContext: "écume volcanique",
    olfactiveProfile: "Écume volcanique solidifiée. Bulles de pierre.",
    intensity: 2,
  },

  // 8. CALDEIRA (3 variations)
  {
    variation: "Caldeira — Collapsed Crater",
    familyType: "Caldeira",
    dominantMolecules: JSON.stringify(["caldeira", "lac acide", "vapeurs"]),
    thermalActivity: "post-effondrement",
    geologicalContext: "caldeira effondrée",
    olfactiveProfile: "Caldeira après effondrement. Lac acide et vapeurs résiduelles.",
    intensity: 4,
  },
  {
    variation: "Caldeira — Acid Lake",
    familyType: "Caldeira",
    dominantMolecules: JSON.stringify(["lac acide", "soufre", "minéraux dissous"]),
    thermalActivity: "actif",
    geologicalContext: "lac de caldeira",
    olfactiveProfile: "Lac acide dans caldeira. Acidité extrême et couleurs minérales.",
    intensity: 5,
  },
  {
    variation: "Caldeira — Ancient Collapse",
    familyType: "Caldeira",
    dominantMolecules: JSON.stringify(["caldeira ancienne", "végétation", "mémoire géologique"]),
    thermalActivity: "éteint",
    geologicalContext: "caldeira végétalisée",
    olfactiveProfile: "Caldeira ancienne colonisée par la végétation. Vie sur destruction.",
    intensity: 3,
  },

  // 9. GEYSER (3 variations)
  {
    variation: "Geyser — Boiling Fountain",
    familyType: "Geyser",
    dominantMolecules: JSON.stringify(["eau bouillante", "vapeur", "minéraux"]),
    thermalActivity: "actif cyclique",
    geologicalContext: "geyser",
    olfactiveProfile: "Geyser en éruption. Eau bouillante et vapeur minérale.",
    intensity: 4,
  },
  {
    variation: "Geyser — Silica Deposit",
    familyType: "Geyser",
    dominantMolecules: JSON.stringify(["silice", "dépôts minéraux", "eau thermale"]),
    thermalActivity: "actif",
    geologicalContext: "dépôts de geyser",
    olfactiveProfile: "Dépôts de silice autour du geyser. Minéraux cristallisés.",
    intensity: 3,
  },
  {
    variation: "Geyser — Steam Vent",
    familyType: "Geyser",
    dominantMolecules: JSON.stringify(["vapeur pure", "chaleur", "pression"]),
    thermalActivity: "actif",
    geologicalContext: "évent de vapeur",
    olfactiveProfile: "Évent de vapeur géothermique. Pression et chaleur.",
    intensity: 4,
  },

  // 10. CRATÈRE SOMMITAL (3 variations)
  {
    variation: "Cratère Sommital — Summit Crater",
    familyType: "Cratère Sommital",
    dominantMolecules: JSON.stringify(["cratère", "gaz volcaniques", "altitude"]),
    thermalActivity: "actif",
    geologicalContext: "sommet volcanique",
    olfactiveProfile: "Cratère au sommet. Gaz volcaniques et altitude.",
    intensity: 5,
  },
  {
    variation: "Cratère Sommital — Frozen Rim",
    familyType: "Cratère Sommital",
    dominantMolecules: JSON.stringify(["cratère glacé", "glace", "vapeur"]),
    thermalActivity: "actif sous glace",
    geologicalContext: "volcan glacé",
    olfactiveProfile: "Cratère sommital glacé. Contraste entre feu et glace.",
    intensity: 4,
  },
  {
    variation: "Cratère Sommital — Dormant Peak",
    familyType: "Cratère Sommital",
    dominantMolecules: JSON.stringify(["cratère dormant", "pierre", "silence"]),
    thermalActivity: "dormant",
    geologicalContext: "sommet endormi",
    olfactiveProfile: "Cratère dormant. Silence et attente géologique.",
    intensity: 3,
  },

  // 11. VOLCAN SOUS-MARIN (3 variations)
  {
    variation: "Volcan Sous-Marin — Black Smoker",
    familyType: "Volcan Sous-Marin",
    dominantMolecules: JSON.stringify(["fumeur noir", "minéraux sulfurés", "eau profonde"]),
    thermalActivity: "actif",
    geologicalContext: "dorsale océanique",
    olfactiveProfile: "Fumeur noir des abysses. Minéraux et chaleur sous-marine.",
    intensity: 5,
  },
  {
    variation: "Volcan Sous-Marin — Pillow Lava",
    familyType: "Volcan Sous-Marin",
    dominantMolecules: JSON.stringify(["lave en coussins", "eau", "basalte"]),
    thermalActivity: "actif",
    geologicalContext: "éruption sous-marine",
    olfactiveProfile: "Lave en coussins sous l'eau. Formation de basalte sous-marin.",
    intensity: 4,
  },
  {
    variation: "Volcan Sous-Marin — Hydrothermal Vent",
    familyType: "Volcan Sous-Marin",
    dominantMolecules: JSON.stringify(["évent hydrothermal", "minéraux", "vie chimiosynthétique"]),
    thermalActivity: "actif",
    geologicalContext: "cheminée hydrothermale",
    olfactiveProfile: "Évent hydrothermal. Chimie et vie dans les abysses.",
    intensity: 4,
  },

  // 12. VOLCAN BOUCLIER (3 variations)
  {
    variation: "Volcan Bouclier — Shield Flow",
    familyType: "Volcan Bouclier",
    dominantMolecules: JSON.stringify(["lave fluide", "basalte", "coulée lente"]),
    thermalActivity: "actif effusif",
    geologicalContext: "volcan bouclier",
    olfactiveProfile: "Coulée de lave fluide. Éruption calme et continue.",
    intensity: 4,
  },
  {
    variation: "Volcan Bouclier — Hawaiian Flow",
    familyType: "Volcan Bouclier",
    dominantMolecules: JSON.stringify(["lave pahoehoe", "basalte lisse", "chaleur"]),
    thermalActivity: "actif",
    geologicalContext: "Hawaii",
    olfactiveProfile: "Lave pahoehoe lisse. Surface ondulée et fluide.",
    intensity: 4,
  },
  {
    variation: "Volcan Bouclier — Lava Tube",
    familyType: "Volcan Bouclier",
    dominantMolecules: JSON.stringify(["tunnel de lave", "basalte", "chaleur résiduelle"]),
    thermalActivity: "refroidi",
    geologicalContext: "tube de lave",
    olfactiveProfile: "Tunnel de lave refroidi. Cathédrale de basalte.",
    intensity: 3,
  },
];

console.log("🚀 Début de l'import des 36 variations Volcanique...\n");

let successCount = 0;
let errorCount = 0;

for (const variation of volcaniqueData) {
  try {
    console.log(`📝 Import de: ${variation.variation}...`);
    
    await db.insert(volcanique).values(variation);
    
    successCount++;
    console.log(`✅ ${variation.variation} importée avec succès`);
    console.log(`   Famille: ${variation.familyType} | Intensité: ${variation.intensity}/5\n`);
  } catch (error) {
    errorCount++;
    console.error(`❌ Erreur lors de l'import de ${variation.variation}:`, error.message);
  }
}

console.log("🎉 Import terminé !");
console.log(`📊 Succès: ${successCount} | Erreurs: ${errorCount}`);
console.log(`📊 Total: ${volcaniqueData.length} variations Volcanique`);

process.exit(0);
