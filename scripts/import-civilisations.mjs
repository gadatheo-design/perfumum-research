import "dotenv/config";
import { drizzle } from "drizzle-orm/mysql2";
import { civilisations } from "../drizzle/schema.ts";

const db = drizzle(process.env.DATABASE_URL);

const civilisationsData = [
  {
    name: "Égypte — Akhet",
    region: "Égypte antique",
    symbolicMaterials: JSON.stringify(["pierre blanche", "kaolin", "myrrhe claire", "résine dorée"]),
    longDescription: "Climat solaire sec. Sol de pierre blanche et kaolin. Molécules dominantes: myrrhe claire, résine dorée. Tabacs compatibles: Virginia Gold, Bright. Atmosphère lumineuse et minérale, évoquant les temples de pierre blanche sous le soleil égyptien.",
    temporality: "antique",
    bibliographicReferences: "Sources archéologiques égyptiennes, textes sur l'encens et la myrrhe dans l'Égypte ancienne",
  },
  {
    name: "Mésopotamie — Shuruppak",
    region: "Mésopotamie antique",
    symbolicMaterials: JSON.stringify(["argile rouge", "terre ocre", "bitume", "argile brûlée"]),
    longDescription: "Climat de poussière chaude. Sol d'argile rouge et terre ocre. Molécules: bitume, argile brûlée, poterie brûlée. Tabacs: Burley, Krumovgrad. Atmosphère tellurique et sombre, évoquant les ziggourats et les tablettes d'argile de Sumer.",
    temporality: "antique",
    bibliographicReferences: "Textes cunéiformes sumériens, archéologie de la Mésopotamie",
  },
  {
    name: "Mycène",
    region: "Grèce mycénienne",
    symbolicMaterials: JSON.stringify(["figue sèche", "ambre sec", "pierre calcaire"]),
    longDescription: "Climat méditerranéen sec. Molécules: ionone, lactones. Tabacs: Italia, Samsoun. Atmosphère de figue sèche et d'ambre, évoquant les palais mycéniens et les tablettes linéaires B.",
    temporality: "antique",
    bibliographicReferences: "Archéologie mycénienne, Linear B texts",
  },
  {
    name: "Tell Halaf",
    region: "Syrie du Nord",
    symbolicMaterials: JSON.stringify(["argile humide", "fumée", "terre sombre"]),
    longDescription: "Sol d'argile humide. Tabacs: Krumovgrad, Italia. Atmosphère de terre archéologique et humus profond. Site néolithique de Syrie du Nord.",
    temporality: "archaic",
    bibliographicReferences: "Fouilles archéologiques de Tell Halaf",
  },
  {
    name: "Meroe",
    region: "Nubie / Soudan",
    symbolicMaterials: JSON.stringify(["sable ocre", "myrrhe noire", "résine solaire"]),
    longDescription: "Climat sec et résineux. Sol de sable ocre. Molécules: myrrhe noire, résine solaire. Tabac: Burley. Royaume nubien au sud de l'Égypte, connu pour ses pyramides et son commerce de résines.",
    temporality: "antique",
    bibliographicReferences: "Archéologie du royaume de Koush, Meroe",
  },
  {
    name: "Lyonesse",
    region: "Atlantide celtique (légendaire)",
    symbolicMaterials: JSON.stringify(["pierre blanche immergée", "aldéhydes givrés", "minéral blanc"]),
    longDescription: "Climat humide avec aldéhydes. Sol de pierre blanche immergée. Molécules: aldéhydes givrés, minéral blanc. Tabac: Bright. Terre légendaire engloutie au large de la Cornouailles, atmosphère marine et aldéhydique.",
    temporality: "abyssal",
    bibliographicReferences: "Légendes arthuriennes, mythologie celtique",
  },
  {
    name: "Atlantide Lumineuse",
    region: "Océan Atlantique (mythologique)",
    symbolicMaterials: JSON.stringify(["calcite", "sel blanc", "ambrox", "ozone", "eau minérale", "ionics"]),
    longDescription: "Climat froid et océanique profond. Sol de calcite et sel blanc. Molécules: ambrox, ozone, aldéhydes propres. Tabacs: Bright, Italia. Civilisation immergée lumineuse, atmosphère minérale et aquatique.",
    temporality: "abyssal",
    bibliographicReferences: "Platon - Timée et Critias",
  },
  {
    name: "Atlantide Abyssale",
    region: "Océan Atlantique profond (mythologique)",
    symbolicMaterials: JSON.stringify(["algues minérales", "terre sombre", "ambrette", "kelp", "corail"]),
    longDescription: "Version sombre et profonde d'Atlantide. Notes marines, kelp, sel, corail, calone naturelle, ambergris. Royaume des civilisations englouties dans les abysses océaniques.",
    temporality: "abyssal",
    bibliographicReferences: "Mythologie atlantéenne, océanographie profonde",
  },
  {
    name: "Akkad",
    region: "Mésopotamie (Empire akkadien)",
    symbolicMaterials: JSON.stringify(["bitume sacré", "huile sombre"]),
    longDescription: "Atmosphère de bitume sacré. Tabac: Burley. Empire de Sargon d'Akkad, première entité politique unifiée de Mésopotamie.",
    temporality: "antique",
    bibliographicReferences: "Histoire de l'Empire akkadien, inscriptions de Sargon",
  },
  {
    name: "Nubie",
    region: "Nubie / Haute-Égypte",
    symbolicMaterials: JSON.stringify(["encens solaire", "ambre", "terre ocre chaude"]),
    longDescription: "Climat chaud et résineux. Sol de terre ocre chaude solaire. Molécules: ambre, encens solaire. Tabacs: Gold, Orange. Royaume nubien au sud de l'Égypte.",
    temporality: "antique",
    bibliographicReferences: "Royaume de Koush, civilisation nubienne",
  },
  {
    name: "Dilmun",
    region: "Golfe Persique (Bahreïn)",
    symbolicMaterials: JSON.stringify(["encens", "myrrhe", "dattes", "eau douce"]),
    longDescription: "Civilisation du commerce des résines dans le Golfe Persique. Mentionnée dans les textes sumériens comme terre d'immortalité et de commerce.",
    temporality: "antique",
    bibliographicReferences: "Textes sumériens, archéologie de Bahreïn",
  },
  {
    name: "Umbria Arcana",
    region: "Dimension ombrale (conceptuelle)",
    symbolicMaterials: JSON.stringify(["ombre", "obscurité", "voile", "matière noire"]),
    longDescription: "Civilisation conceptuelle de l'ombre et de l'obscurité. Atmosphère de voile et d'obscurité, exploration des matières impossibles.",
    temporality: "abyssal",
    bibliographicReferences: "Concept original PERFUMUM",
  },
  {
    name: "Cryo-Atlas",
    region: "Régions glaciaires (conceptuelle)",
    symbolicMaterials: JSON.stringify(["glace", "minéral froid", "aldéhydes glaciaires"]),
    longDescription: "Civilisation des régions glaciaires. Molécules: minéral froid, aldéhydes. Tabac: Deutscher. Atmosphère de pierre froide et d'aldéhydes givrés.",
    temporality: "futuristic",
    bibliographicReferences: "Concept original PERFUMUM",
  },
  {
    name: "November Humid",
    region: "Climat novembre humide (conceptuelle)",
    symbolicMaterials: JSON.stringify(["humidité", "terre mouillée", "feuilles mortes", "brume"]),
    longDescription: "Civilisation atmosphérique du mois de novembre. Climat humide, terre mouillée, atmosphère de brume et de décomposition végétale.",
    temporality: "futuristic",
    bibliographicReferences: "Concept original PERFUMUM",
  },
  {
    name: "Sogdiane",
    region: "Asie Centrale (Route de la Soie)",
    symbolicMaterials: JSON.stringify(["soie", "épices", "résines orientales", "musc"]),
    longDescription: "Civilisation de la Route de la Soie. Commerce des épices, résines et parfums entre Orient et Occident. Atmosphère de caravansérails et de marchés aux épices.",
    temporality: "medieval",
    bibliographicReferences: "Histoire de la Route de la Soie, Sogdiane antique",
  },
  {
    name: "Grèce Sombre",
    region: "Grèce antique (aspect chthonien)",
    symbolicMaterials: JSON.stringify(["terre sombre", "résine de pin", "myrte", "asphodèle"]),
    longDescription: "Aspect chthonien et mystérique de la Grèce antique. Cultes à mystères, descente aux enfers, atmosphère de cavernes et de rituels nocturnes.",
    temporality: "antique",
    bibliographicReferences: "Mystères d'Éleusis, cultes chthoniens grecs",
  },
  {
    name: "Lemuria",
    region: "Océan Indien / Pacifique (légendaire)",
    symbolicMaterials: JSON.stringify(["végétation tropicale", "pierre volcanique", "fleurs exotiques"]),
    longDescription: "Continent légendaire englouti dans l'océan Indien ou Pacifique. Hypothèse du XIXe siècle pour expliquer la distribution des lémuriens.",
    temporality: "abyssal",
    bibliographicReferences: "Théorie de Lemuria (Philip Sclater), ésotérisme",
  },
  {
    name: "Mu",
    region: "Océan Pacifique (légendaire)",
    symbolicMaterials: JSON.stringify(["pierre volcanique", "corail", "coquillages", "sel marin"]),
    longDescription: "Continent légendaire du Pacifique. Civilisation avancée engloutie, mentionnée dans les théories ésotériques du XXe siècle.",
    temporality: "abyssal",
    bibliographicReferences: "James Churchward - Le Continent perdu de Mu",
  },
  {
    name: "Thulé",
    region: "Extrême Nord (légendaire)",
    symbolicMaterials: JSON.stringify(["glace", "pierre nordique", "lichen", "mousse arctique"]),
    longDescription: "Terre légendaire de l'extrême nord mentionnée par les Grecs anciens. Ultima Thule, limite du monde connu.",
    temporality: "archaic",
    bibliographicReferences: "Pythéas de Marseille, géographie antique",
  },
  {
    name: "Ophir",
    region: "Localisation incertaine (biblique)",
    symbolicMaterials: JSON.stringify(["or", "encens", "bois précieux", "pierres précieuses"]),
    longDescription: "Terre biblique riche en or et en matières précieuses. Destination des expéditions du roi Salomon.",
    temporality: "antique",
    bibliographicReferences: "Bible - Livre des Rois, géographie biblique",
  },
  {
    name: "Malabar",
    region: "Côte sud-ouest de l'Inde",
    symbolicMaterials: JSON.stringify(["poivre", "cardamome", "bois de santal", "épices"]),
    longDescription: "Région historique du commerce des épices en Inde. Route maritime vers l'Occident, centre du commerce du poivre et des épices.",
    temporality: "medieval",
    bibliographicReferences: "Histoire du commerce des épices, Malabar",
  },
  {
    name: "Nag Hammadi",
    region: "Haute-Égypte",
    symbolicMaterials: JSON.stringify(["papyrus", "encre", "terre sèche", "résine de copte"]),
    longDescription: "Site de découverte des manuscrits gnostiques. Atmosphère de bibliothèque enfouie, de textes cachés et de sagesse ésotérique.",
    temporality: "antique",
    bibliographicReferences: "Codex de Nag Hammadi, gnosticisme",
  },
  {
    name: "Akrotiri",
    region: "Santorin / Théra (Grèce)",
    symbolicMaterials: JSON.stringify(["cendre volcanique", "pierre ponce", "fresque", "safran"]),
    longDescription: "Cité minoenne engloutie par l'éruption du volcan de Santorin. Pompéi de la Méditerranée, préservée sous les cendres volcaniques.",
    temporality: "antique",
    bibliographicReferences: "Archéologie d'Akrotiri, civilisation minoenne",
  },
  {
    name: "Sahara Antique",
    region: "Sahara (période humide)",
    symbolicMaterials: JSON.stringify(["sable", "terre rouge", "acacia", "myrrhe du désert"]),
    longDescription: "Sahara durant sa période humide (Sahara vert). Lacs, végétation, civilisations pastorales avant la désertification.",
    temporality: "archaic",
    bibliographicReferences: "Paléoclimatologie du Sahara, art rupestre",
  },
  {
    name: "Himalaya Rituel",
    region: "Chaîne himalayenne",
    symbolicMaterials: JSON.stringify(["encens tibétain", "juniper", "rhododendron", "pierre de montagne"]),
    longDescription: "Traditions rituelles himalayennes. Encens tibétains, juniper, atmosphère de monastères et de hautes altitudes.",
    temporality: "medieval",
    bibliographicReferences: "Bouddhisme tibétain, rituels himalayens",
  },
  {
    name: "Anthropocène",
    region: "Ère géologique actuelle",
    symbolicMaterials: JSON.stringify(["plastique", "béton", "pétrole", "pollution", "synthétique"]),
    longDescription: "Époque géologique de l'impact humain sur la Terre. Matières synthétiques, pollution, transformation radicale des écosystèmes.",
    temporality: "futuristic",
    bibliographicReferences: "Concept d'Anthropocène (Paul Crutzen)",
  },
];

console.log("🚀 Début de l'import des civilisations...\n");

for (const civ of civilisationsData) {
  try {
    console.log(`📝 Import de: ${civ.name}...`);
    
    await db.insert(civilisations).values(civ);
    
    console.log(`✅ ${civ.name} importée avec succès`);
    console.log(`   Région: ${civ.region} | Temporalité: ${civ.temporality}\n`);
  } catch (error) {
    console.error(`❌ Erreur lors de l'import de ${civ.name}:`, error.message);
  }
}

console.log("🎉 Import terminé avec succès !");
console.log(`📊 Total: ${civilisationsData.length} civilisations importées`);

process.exit(0);
