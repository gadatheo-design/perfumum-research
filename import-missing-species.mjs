import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "./drizzle/schema.js";

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection, { schema, mode: "default" });

const missingSpecies = [
  {
    name: "Sandalwood australien",
    latinName: "Santalum spicatum",
    family: "Santalaceae",
    category: "bois",
    origin: "Australie occidentale",
    habitat: "Régions semi-arides d'Australie occidentale, sols sablonneux",
    latitude: "-30.5000000",
    longitude: "121.5000000",
    olfactiveSignature: "Boisé crémeux, doux et lacté, moins intense que le santal indien mais plus durable",
    dominantMolecules: JSON.stringify(["α-santalol", "β-santalol", "α-bergamotol"]),
    climaticAxis: "bois",
    usage: "Parfumerie fine, cosmétique, méditation",
    conservationStatus: "VU",
    iucnCategory: "Vulnérable",
    threats: "Surexploitation historique, parasitisme naturel, changement climatique",
    protectionMeasures: "Plantations durables, certification FairWild, quotas d'exportation",
    sustainableAlternatives: "Santal de plantation certifié, Amyris balsamifera (bois d'amyris)",
    description: "Le santal australien est une alternative durable au santal indien (Santalum album) gravement menacé. Son bois produit une huile essentielle précieuse utilisée en parfumerie de luxe.",
    historicalMarkers: JSON.stringify([
      {
        period: "Préhistoire aborigène",
        civilization: "Peuples aborigènes d'Australie",
        usage: "Médecine traditionnelle, cérémonies sacrées",
        significance: "Arbre sacré utilisé pour ses propriétés médicinales et spirituelles"
      },
      {
        period: "1840-1920",
        civilization: "Empire britannique",
        usage: "Commerce colonial du bois de santal",
        significance: "Exploitation intensive pour l'export vers l'Europe et l'Asie"
      },
      {
        period: "1990-présent",
        civilization: "Industrie moderne",
        usage: "Parfumerie durable, certification FairWild",
        significance: "Alternative durable au santal indien menacé d'extinction"
      }
    ])
  },
  {
    name: "Bois d'agar",
    latinName: "Aquilaria crassna",
    family: "Thymelaeaceae",
    category: "bois",
    origin: "Cambodge, Laos, Vietnam",
    habitat: "Forêts tropicales humides d'Asie du Sud-Est, 0-850m d'altitude",
    latitude: "12.5657000",
    longitude: "104.9910000",
    olfactiveSignature: "Boisé profond, résineux, animalique, fumé, notes de cuir et de miel",
    dominantMolecules: JSON.stringify(["β-agarofuran", "α-agarofuran", "jinkoh-eremol", "agarospirol"]),
    climaticAxis: "bois",
    usage: "Parfumerie de luxe, encens traditionnel, médecine",
    conservationStatus: "CR",
    iucnCategory: "En danger critique",
    threats: "Surexploitation massive, trafic illégal, perte d'habitat, faible taux de formation naturelle de résine",
    protectionMeasures: "CITES Annexe II, plantations contrôlées, inoculation artificielle de champignons, traçabilité ADN",
    sustainableAlternatives: "Agar de plantation certifié, Cypriol (Cyperus scariosus), synthèse de molécules clés",
    description: "Le bois d'agar (ou oud) est l'une des matières premières les plus précieuses au monde. La résine se forme uniquement lorsque l'arbre est infecté par un champignon spécifique, ce qui rend la production naturelle très rare.",
    historicalMarkers: JSON.stringify([
      {
        period: "3000 av. J.-C.",
        civilization: "Civilisations védiques",
        usage: "Encens sacré, médecine ayurvédique",
        significance: "Mentionné dans les textes sanskrits comme substance divine"
      },
      {
        period: "VIIe-XIIIe siècle",
        civilization: "Empire khmer",
        usage: "Commerce royal, cérémonies bouddhistes",
        significance: "Exporté vers la Chine et le Moyen-Orient, source de richesse"
      },
      {
        period: "XXe siècle",
        civilization: "Parfumerie moderne",
        usage: "Note de fond en haute parfumerie",
        significance: "Matière première la plus chère au monde (jusqu'à 100 000$/kg)"
      },
      {
        period: "2000-présent",
        civilization: "Conservation internationale",
        usage: "Plantations durables, CITES",
        significance: "Espèce en danger critique, efforts de sauvegarde et culture contrôlée"
      }
    ])
  },
  {
    name: "Cannelier de Ceylan",
    latinName: "Cinnamomum verum",
    family: "Lauraceae",
    category: "bois",
    origin: "Sri Lanka",
    habitat: "Forêts tropicales humides du Sri Lanka, sols riches et bien drainés",
    latitude: "7.8731000",
    longitude: "80.7718000",
    olfactiveSignature: "Épicé doux, chaud, légèrement sucré, notes de clou de girofle",
    dominantMolecules: JSON.stringify(["cinnamaldéhyde", "eugénol", "linalol", "β-caryophyllène"]),
    climaticAxis: "bois",
    usage: "Parfumerie, alimentation, médecine traditionnelle",
    conservationStatus: "LC",
    iucnCategory: "Préoccupation mineure",
    threats: "Déforestation, monoculture intensive, maladies fongiques",
    protectionMeasures: "Certification IGP Sri Lanka, agroforesterie durable, diversification des cultures",
    sustainableAlternatives: "Cannelle de plantation certifiée, Cinnamomum cassia (cannelle de Chine, moins fine)",
    description: "La vraie cannelle de Ceylan est considérée comme la meilleure qualité au monde. L'écorce interne est récoltée sur de jeunes pousses et séchée en bâtons caractéristiques.",
    historicalMarkers: JSON.stringify([
      {
        period: "2800 av. J.-C.",
        civilization: "Égypte ancienne",
        usage: "Embaumement, parfumerie sacrée",
        significance: "Importée à prix d'or, réservée aux pharaons et aux temples"
      },
      {
        period: "Ier siècle ap. J.-C.",
        civilization: "Empire romain",
        usage: "Épice de luxe, parfumerie",
        significance: "Plus précieuse que l'or, monopole commercial jalousement gardé"
      },
      {
        period: "1505-1658",
        civilization: "Empire portugais",
        usage: "Monopole colonial du commerce de cannelle",
        significance: "Contrôle militaire du Sri Lanka pour la cannelle"
      },
      {
        period: "1658-1796",
        civilization: "Compagnie néerlandaise des Indes orientales",
        usage: "Commerce monopolistique",
        significance: "Destruction des canneliers sauvages pour contrôler les prix"
      },
      {
        period: "XXe siècle-présent",
        civilization: "Commerce mondial",
        usage: "IGP Sri Lanka, certification de qualité",
        significance: "Protection de l'appellation 'Cannelle de Ceylan'"
      }
    ])
  },
  {
    name: "Giroflier",
    latinName: "Syzygium aromaticum",
    family: "Myrtaceae",
    category: "fleur",
    origin: "Zanzibar, Madagascar, Indonésie",
    habitat: "Régions tropicales humides, sols volcaniques riches, 0-900m d'altitude",
    latitude: "-6.1659000",
    longitude: "39.2026000",
    olfactiveSignature: "Épicé puissant, chaud, légèrement anesthésiant, notes médicinales",
    dominantMolecules: JSON.stringify(["eugénol", "acétate d'eugényle", "β-caryophyllène", "α-humulène"]),
    climaticAxis: "bois",
    usage: "Parfumerie, alimentation, médecine dentaire, encens",
    conservationStatus: "LC",
    iucnCategory: "Préoccupation mineure",
    threats: "Monoculture intensive, maladies (sudden death disease), fluctuations climatiques",
    protectionMeasures: "Agroforesterie, diversification des cultures, recherche sur les résistances aux maladies",
    sustainableAlternatives: "Clou de girofle de commerce équitable, synthèse d'eugénol",
    description: "Les clous de girofle sont les boutons floraux séchés du giroflier. L'arbre ne produit qu'après 6-8 ans et peut vivre plus de 100 ans. Zanzibar produit 80% de la production mondiale.",
    historicalMarkers: JSON.stringify([
      {
        period: "IIIe siècle av. J.-C.",
        civilization: "Chine ancienne (dynastie Han)",
        usage: "Parfum d'haleine pour les audiences impériales",
        significance: "Obligatoire de mâcher un clou avant de parler à l'empereur"
      },
      {
        period: "VIIe-XVe siècle",
        civilization: "Sultanat de Zanzibar",
        usage: "Commerce arabe des épices",
        significance: "Route maritime vers l'Inde et le Moyen-Orient"
      },
      {
        period: "1511",
        civilization: "Empire portugais",
        usage: "Monopole colonial",
        significance: "Prise de Malacca et contrôle du commerce du clou de girofle"
      },
      {
        period: "1770-1818",
        civilization: "France coloniale",
        usage: "Contrebande et plantation à Madagascar et Zanzibar",
        significance: "Briser le monopole néerlandais des Moluques"
      },
      {
        period: "XIXe-XXe siècle",
        civilization: "Sultanat de Zanzibar",
        usage: "Production mondiale dominante",
        significance: "Zanzibar devient le premier producteur mondial (80% aujourd'hui)"
      }
    ])
  },
  {
    name: "Styrax liquide",
    latinName: "Liquidambar orientalis",
    family: "Altingiaceae",
    category: "resine",
    origin: "Turquie (région de Marmaris)",
    habitat: "Forêts côtières du sud-ouest de la Turquie, sols humides",
    latitude: "36.8500000",
    longitude: "28.2667000",
    olfactiveSignature: "Balsamique doux, vanillé, légèrement fumé, notes de cannelle et d'ambre",
    dominantMolecules: JSON.stringify(["styracine", "cinnamate de cinnamyle", "vanilline", "alcool cinnamique"]),
    climaticAxis: "bois",
    usage: "Parfumerie (note de fond), encens, fixateur",
    conservationStatus: "VU",
    iucnCategory: "Vulnérable",
    threats: "Surexploitation de la résine, incendies de forêt, urbanisation côtière, vieillissement des peuplements",
    protectionMeasures: "Zones protégées en Turquie, quotas de récolte, replantation, certification durable",
    sustainableAlternatives: "Styrax benzoin (benjoin de Sumatra), synthèse de vanilline et cinnamates",
    description: "Le styrax liquide est une résine balsamique obtenue par incision de l'écorce. La récolte traditionnelle est un savoir-faire ancestral pratiqué dans quelques villages turcs.",
    historicalMarkers: JSON.stringify([
      {
        period: "Antiquité",
        civilization: "Grèce et Rome antiques",
        usage: "Parfumerie, médecine, encens religieux",
        significance: "Mentionné par Pline l'Ancien et Dioscoride comme parfum précieux"
      },
      {
        period: "Moyen Âge",
        civilization: "Empire ottoman",
        usage: "Commerce vers l'Europe et le Moyen-Orient",
        significance: "Exporté depuis les ports de Méditerranée orientale"
      },
      {
        period: "XIXe siècle",
        civilization: "Parfumerie européenne",
        usage: "Note de fond balsamique",
        significance: "Ingrédient clé des parfums orientaux et ambrés"
      },
      {
        period: "1990-présent",
        civilization: "Conservation moderne",
        usage: "Protection des forêts reliques",
        significance: "Espèce vulnérable, efforts de gestion durable et replantation"
      }
    ])
  },
  {
    name: "Benjoin",
    latinName: "Styrax benzoin",
    family: "Styracaceae",
    category: "resine",
    origin: "Sumatra, Java (Indonésie)",
    habitat: "Forêts tropicales de montagne, 600-1200m d'altitude",
    latitude: "-0.5897000",
    longitude: "101.3431000",
    olfactiveSignature: "Balsamique sucré, vanillé, poudreux, notes de caramel et d'amande",
    dominantMolecules: JSON.stringify(["acide benzoïque", "acide cinnamique", "vanilline", "benzoate de coniféryle"]),
    climaticAxis: "bois",
    usage: "Parfumerie (fixateur), encens, médecine traditionnelle",
    conservationStatus: "VU",
    iucnCategory: "Vulnérable",
    threats: "Surexploitation, déforestation pour l'huile de palme, pratiques de récolte non durables",
    protectionMeasures: "Agroforesterie, certification FairWild, coopératives de récoltants, zones protégées",
    sustainableAlternatives: "Benjoin de plantation durable, Liquidambar orientalis (styrax liquide), synthèse de vanilline",
    description: "Le benjoin est une résine aromatique obtenue par incision de l'écorce. Il existe deux types principaux : benjoin de Sumatra (plus fin) et benjoin de Siam (Thaïlande). La résine est utilisée depuis des millénaires comme encens et fixateur en parfumerie.",
    historicalMarkers: JSON.stringify([
      {
        period: "Antiquité",
        civilization: "Commerce arabe",
        usage: "Encens, médecine",
        significance: "Importé en Méditerranée via les routes de l'encens"
      },
      {
        period: "Moyen Âge",
        civilization: "Europe médiévale",
        usage: "Encens d'église, médecine",
        significance: "Ingrédient du 'baume du commandeur' et autres préparations médicinales"
      },
      {
        period: "XVIe-XIXe siècle",
        civilization: "Empires coloniaux",
        usage: "Commerce des épices et résines",
        significance: "Exporté massivement depuis Sumatra vers l'Europe"
      },
      {
        period: "XIXe-XXe siècle",
        civilization: "Parfumerie moderne",
        usage: "Fixateur balsamique",
        significance: "Note de fond classique dans les parfums orientaux et poudrés"
      },
      {
        period: "2000-présent",
        civilization: "Conservation",
        usage: "Certification FairWild, agroforesterie",
        significance: "Espèce vulnérable, efforts de récolte durable"
      }
    ])
  }
];

console.log(`🌿 Import de ${missingSpecies.length} espèces manquantes...`);

for (const species of missingSpecies) {
  try {
    const [result] = await db.insert(schema.plants).values(species);
    console.log(`✅ ${species.name} (${species.latinName}) importé avec succès (ID: ${result.insertId})`);
  } catch (error) {
    console.error(`❌ Erreur lors de l'import de ${species.name}:`, error.message);
  }
}

console.log(`\n✨ Import terminé !`);

await connection.end();
