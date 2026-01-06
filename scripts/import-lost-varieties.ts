/**
 * PERFUMUM Phase 2 - Import des variétés disparues
 * Ce script importe les données des variétés de plantes aromatiques disparues ou menacées
 */

import { sql } from "drizzle-orm";

// Données des variétés disparues à importer
export const lostVarietiesData = [
  // ============================================================================
  // PLANTES ANTIQUES DISPARUES
  // ============================================================================
  {
    name: "Silphium de Cyrène",
    latinName: "Ferula drudeana (probable)",
    historicalNames: ["Silphion", "Laser", "Laserpitium"],
    extinctionStatus: "extinct",
    lastKnownDate: 68, // Règne de Néron
    extinctionDate: 100,
    extinctionCause: "overexploitation",
    extinctionDetails: "Surexploitation par les Romains pour ses propriétés médicinales, culinaires et contraceptives. La dernière tige connue fut envoyée à l'empereur Néron comme curiosité. La plante ne pouvait pas être cultivée et ne poussait que dans une zone étroite de Cyrénaïque (Libye actuelle).",
    historicalRange: {
      regions: ["Cyrénaïque", "Libye"],
      coordinates: { lat: 32.8, lng: 21.8 },
      extent: "125 miles x 35 miles"
    },
    morphologicalDescription: "Plante à racines épaisses couvertes d'écorce noire, tige creuse semblable au fenouil, feuilles dorées ressemblant au céleri, fleurs jaunes en ombelles.",
    olfactiveDescription: "Sève odoriférante séchée (laser) avec notes soufrées, aillées, résineuses. Comparé à l'asafoetida mais plus délicat et précieux.",
    therapeuticUses: "Contraceptif, aphrodisiaque, traitement des morsures de chien, fumigations médicinales, conservateur alimentaire.",
    culturalSignificance: "Valait son poids en or. Représenté sur les monnaies de Cyrène. Stocké dans le trésor impérial romain par Jules César (680 kg). Symbole du cœur possiblement dérivé de ses graines.",
    hypotheticalMolecularProfile: {
      family: "Apiaceae (Ferula)",
      probableMolecules: ["Ferulique acide", "Composés soufrés", "Sesquiterpènes"],
      relatedTo: "Asafoetida (Ferula assa-foetida)"
    },
    reconstructionPossibility: "partial",
    reconstructionNotes: "Ferula drudeana découverte en Turquie en 2021 pourrait être un proche parent. Analyses génétiques en cours.",
    closestLivingRelatives: ["Ferula assa-foetida", "Ferula communis", "Ferula drudeana"],
    primarySources: [
      "Pline l'Ancien, Histoire Naturelle",
      "Théophraste, Historia Plantarum",
      "BBC Future - The mystery of the lost Roman herb (2017)"
    ]
  },
  
  // ============================================================================
  // ROSES ANCIENNES DISPARUES
  // ============================================================================
  {
    name: "Rose de Paestum",
    latinName: "Rosa × damascena var. paestana",
    historicalNames: ["Rosa Paestana", "Rose de Campanie", "Rosa bifera paestana"],
    extinctionStatus: "presumed_extinct",
    lastKnownDate: 500,
    extinctionCause: "war_conflict",
    extinctionDetails: "Cultivée dans l'ancienne Paestum (Italie du Sud) pour sa double floraison annuelle. Disparue après les invasions barbares et l'abandon de la région.",
    historicalRange: {
      regions: ["Campanie", "Paestum", "Italie du Sud"],
      coordinates: { lat: 40.42, lng: 15.0 }
    },
    morphologicalDescription: "Rose à floraison double (printemps et automne), pétales nombreux, couleur rose intense.",
    olfactiveDescription: "Parfum intense de rose damascène avec notes miellées et fruitées. Réputée pour sa puissance olfactive exceptionnelle.",
    therapeuticUses: "Parfumerie, médecine, rituels religieux romains.",
    culturalSignificance: "Célébrée par Virgile et Ovide. Symbole de luxe romain. Utilisée pour les banquets et les thermes.",
    hypotheticalMolecularProfile: {
      family: "Rosaceae",
      probableMolecules: ["Citronellol", "Géraniol", "Nérol", "Phényléthanol"],
      relatedTo: "Rosa damascena moderne"
    },
    reconstructionPossibility: "possible",
    reconstructionNotes: "Certaines roses anciennes cultivées en Bulgarie pourraient descendre de cette variété.",
    closestLivingRelatives: ["Rosa damascena", "Rosa centifolia", "Rosa gallica"],
    primarySources: [
      "Virgile, Géorgiques",
      "Pline l'Ancien, Histoire Naturelle",
      "Ovide, Fastes"
    ]
  },
  
  {
    name: "Rose de Cyrène",
    latinName: "Rosa cyrenaica",
    historicalNames: ["Rosa Libyca"],
    extinctionStatus: "extinct",
    lastKnownDate: 200,
    extinctionCause: "climate_change",
    extinctionDetails: "Rose sauvage de Cyrénaïque, disparue avec la désertification progressive de la région.",
    historicalRange: {
      regions: ["Cyrénaïque", "Libye"],
      coordinates: { lat: 32.9, lng: 21.9 }
    },
    olfactiveDescription: "Parfum délicat de rose sauvage avec notes herbacées méditerranéennes.",
    reconstructionPossibility: "unlikely",
    closestLivingRelatives: ["Rosa canina", "Rosa sempervirens"],
    primarySources: ["Théophraste, Historia Plantarum"]
  },

  // ============================================================================
  // PLANTES HAWAIIENNES DISPARUES (Future Society / Arcaea)
  // ============================================================================
  {
    name: "Hibiscadelphus wilderianus",
    latinName: "Hibiscadelphus wilderianus",
    historicalNames: ["Hau kuahiwi de Maui"],
    extinctionStatus: "extinct",
    lastKnownDate: 1912,
    extinctionDate: 1912,
    extinctionCause: "habitat_loss",
    extinctionDetails: "Endémique de Maui, Hawaii. Dernier spécimen observé en 1912. Disparue suite à la déforestation et l'introduction d'espèces invasives.",
    historicalRange: {
      regions: ["Maui", "Hawaii"],
      coordinates: { lat: 20.8, lng: -156.3 }
    },
    morphologicalDescription: "Petit arbre de 4-6m, fleurs jaune-verdâtre courbées.",
    olfactiveDescription: "Parfum décrit comme 'éthéré', 'léger', avec notes florales subtiles. Reconstruit par Ginkgo Bioworks à partir d'ADN ancien.",
    culturalSignificance: "Espèce endémique hawaïenne, importante pour l'écosystème local.",
    hypotheticalMolecularProfile: {
      family: "Malvaceae",
      reconstructedBy: "Ginkgo Bioworks / Future Society",
      method: "Séquençage ADN ancien + biologie synthétique"
    },
    reconstructionPossibility: "possible",
    reconstructionNotes: "ADN extrait de spécimens d'herbarium de Harvard. Parfum reconstruit par Ginkgo Bioworks pour Future Society (2019).",
    primarySources: [
      "Scientific American - Fragrant Genes of Extinct Flowers (2019)",
      "Future Society Perfumes"
    ]
  },
  
  {
    name: "Wendlandia angustifolia",
    latinName: "Wendlandia angustifolia",
    historicalNames: [],
    extinctionStatus: "extinct",
    extinctionCause: "habitat_loss",
    extinctionDetails: "Plante tropicale disparue, parfum reconstruit par biologie synthétique.",
    olfactiveDescription: "Parfum 'propre et rafraîchissant' selon Future Society. Notes fraîches et boisées.",
    hypotheticalMolecularProfile: {
      family: "Rubiaceae",
      reconstructedBy: "Arcaea / Future Society"
    },
    reconstructionPossibility: "possible",
    reconstructionNotes: "Parfum 'Invisible Woods' créé par Future Society à partir d'ADN ancien.",
    primarySources: [
      "PLOS DNA Science (2023)",
      "Future Society - Invisible Woods"
    ]
  },

  {
    name: "Leucadendron grandiflorum",
    latinName: "Leucadendron grandiflorum",
    historicalNames: ["Grand Leucadendron du Cap"],
    extinctionStatus: "extinct",
    lastKnownDate: 1960,
    extinctionDate: 1960,
    extinctionCause: "habitat_loss",
    extinctionDetails: "Dernière floraison observée en 1960 en Afrique du Sud. Disparue suite à l'urbanisation de la région du Cap.",
    historicalRange: {
      regions: ["Cap-Occidental", "Afrique du Sud"],
      coordinates: { lat: -33.9, lng: 18.4 }
    },
    morphologicalDescription: "Arbuste du fynbos sud-africain, grandes fleurs.",
    olfactiveDescription: "Parfum reconstruit pour 'Reclaimed Flame' de Future Society.",
    hypotheticalMolecularProfile: {
      family: "Proteaceae",
      reconstructedBy: "Future Society"
    },
    reconstructionPossibility: "possible",
    reconstructionNotes: "Parfum 'Reclaimed Flame' créé par Future Society (2025).",
    primarySources: [
      "CNN Style - Future Society fragrance (2025)",
      "Future Society - Reclaimed Flame"
    ]
  },

  // ============================================================================
  // PLANTES AROMATIQUES MENACÉES (PROCHES DE L'EXTINCTION)
  // ============================================================================
  {
    name: "Bois de Santal indien sauvage",
    latinName: "Santalum album (populations sauvages)",
    historicalNames: ["Chandana", "Santal blanc"],
    extinctionStatus: "extinct_in_wild",
    extinctionCause: "overexploitation",
    extinctionDetails: "Populations sauvages pratiquement éteintes en Inde due à l'exploitation illégale intensive. Seules les plantations subsistent.",
    historicalRange: {
      regions: ["Karnataka", "Tamil Nadu", "Kerala", "Inde"],
      coordinates: { lat: 12.9, lng: 77.6 }
    },
    olfactiveDescription: "Boisé crémeux, lacté, doux, persistant. Notes de cèdre, de lait et de miel. L'un des bois les plus précieux en parfumerie.",
    therapeuticUses: "Médecine ayurvédique, rituels religieux, parfumerie de luxe.",
    culturalSignificance: "Sacré dans l'hindouisme et le bouddhisme. Utilisé depuis plus de 4000 ans.",
    hypotheticalMolecularProfile: {
      family: "Santalaceae",
      mainMolecules: ["α-santalol (45-55%)", "β-santalol (20-25%)", "Santalènes"]
    },
    reconstructionPossibility: "possible",
    reconstructionNotes: "Plantations en Australie et Inde. Qualité variable selon terroir.",
    closestLivingRelatives: ["Santalum spicatum (Australie)", "Santalum austrocaledonicum"],
    primarySources: [
      "IUCN Red List - Santalum album (VU)",
      "CITES Appendix II"
    ]
  },

  {
    name: "Bois d'Agar sauvage",
    latinName: "Aquilaria malaccensis (populations sauvages)",
    historicalNames: ["Oud", "Agarwood", "Bois d'aigle", "Jinkō"],
    extinctionStatus: "extinct_in_wild",
    extinctionCause: "overexploitation",
    extinctionDetails: "Arbres sauvages pratiquement disparus d'Asie du Sud-Est. Seuls les arbres infectés par un champignon produisent la résine précieuse.",
    historicalRange: {
      regions: ["Malaisie", "Indonésie", "Vietnam", "Cambodge", "Laos"],
      coordinates: { lat: 4.2, lng: 103.4 }
    },
    olfactiveDescription: "Boisé profond, fumé, animal, mystique. Notes de cuir, d'encens et de miel fermenté. Extrêmement complexe et persistant.",
    therapeuticUses: "Médecine traditionnelle chinoise et arabe, encens religieux.",
    culturalSignificance: "L'un des ingrédients les plus chers au monde. Sacré dans l'Islam, le Bouddhisme et l'Hindouisme.",
    hypotheticalMolecularProfile: {
      family: "Thymelaeaceae",
      mainMolecules: ["Agarospirol", "Jinkohol", "Sesquiterpènes oxygénés"]
    },
    reconstructionPossibility: "partial",
    reconstructionNotes: "Plantations avec inoculation artificielle du champignon. Qualité inférieure au sauvage.",
    closestLivingRelatives: ["Aquilaria crassna", "Aquilaria sinensis"],
    primarySources: [
      "IUCN Red List - Aquilaria malaccensis (CR)",
      "CITES Appendix II"
    ]
  },

  // ============================================================================
  // VARIÉTÉS HISTORIQUES DE GRASSE DISPARUES
  // ============================================================================
  {
    name: "Rose de Mai de Grasse (variété originale)",
    latinName: "Rosa centifolia var. grassensis",
    historicalNames: ["Rose de Mai", "Rose cent-feuilles de Grasse"],
    extinctionStatus: "possibly_extinct",
    lastKnownDate: 1950,
    extinctionCause: "hybridization",
    extinctionDetails: "La variété originale cultivée à Grasse depuis le XVIIe siècle a été progressivement remplacée par des cultivars plus productifs. Les caractéristiques olfactives originales se sont diluées.",
    historicalRange: {
      regions: ["Grasse", "Provence", "France"],
      coordinates: { lat: 43.66, lng: 6.92 }
    },
    olfactiveDescription: "Rose miellée, poudrée, avec notes de thé et de fruits rouges. Plus complexe et subtile que les variétés modernes.",
    culturalSignificance: "Fondement de l'industrie de la parfumerie grassoise. Utilisée par les plus grandes maisons.",
    hypotheticalMolecularProfile: {
      family: "Rosaceae",
      probableMolecules: ["Phényléthanol", "Citronellol", "Géraniol", "Nérol", "Damascénone"]
    },
    reconstructionPossibility: "partial",
    reconstructionNotes: "Certains cultivateurs tentent de retrouver les caractéristiques originales par sélection.",
    closestLivingRelatives: ["Rosa centifolia moderne", "Rosa damascena"],
    primarySources: [
      "Musée International de la Parfumerie, Grasse",
      "Archives de la parfumerie grassoise"
    ]
  },

  {
    name: "Jasmin de Grasse (variété ancestrale)",
    latinName: "Jasminum grandiflorum var. grassensis",
    historicalNames: ["Jasmin d'Espagne de Grasse"],
    extinctionStatus: "possibly_extinct",
    lastKnownDate: 1960,
    extinctionCause: "hybridization",
    extinctionDetails: "Variété originale importée d'Espagne au XVIe siècle, progressivement remplacée par des cultivars égyptiens et indiens plus productifs.",
    historicalRange: {
      regions: ["Grasse", "Provence", "France"],
      coordinates: { lat: 43.66, lng: 6.92 }
    },
    olfactiveDescription: "Jasmin floral intense avec notes fruitées, animales et légèrement indoliques. Plus complexe que le jasmin moderne.",
    culturalSignificance: "Pilier de la parfumerie de luxe française.",
    hypotheticalMolecularProfile: {
      family: "Oleaceae",
      probableMolecules: ["Benzyl acétate", "Linalol", "Indole", "Jasmone", "Méthyl anthranilate"]
    },
    reconstructionPossibility: "partial",
    closestLivingRelatives: ["Jasminum grandiflorum (Égypte)", "Jasminum sambac"],
    primarySources: [
      "Musée International de la Parfumerie, Grasse"
    ]
  },

  // ============================================================================
  // PLANTES OUBLIÉES DE LA PARFUMERIE
  // ============================================================================
  {
    name: "Musk Monkeyflower",
    latinName: "Erythranthe moschata",
    historicalNames: ["Mimulus moschatus", "Musc végétal"],
    extinctionStatus: "rediscovered",
    lastKnownDate: 1914,
    extinctionCause: "unknown",
    extinctionDetails: "Au début du XXe siècle, toutes les populations mondiales (sauvages et cultivées) ont mystérieusement perdu leur parfum musqué simultanément. Cause inconnue.",
    historicalRange: {
      regions: ["Amérique du Nord", "Europe (naturalisé)"],
      coordinates: { lat: 45.5, lng: -122.7 }
    },
    olfactiveDescription: "Parfum musqué intense (historique). Aujourd'hui inodore.",
    culturalSignificance: "Populaire dans les jardins victoriens pour son parfum. Mystère botanique non résolu.",
    hypotheticalMolecularProfile: {
      family: "Phrymaceae",
      lostMolecules: ["Composés musqués non identifiés"]
    },
    reconstructionPossibility: "unlikely",
    reconstructionNotes: "La cause de la perte du parfum reste inconnue. Possiblement une mutation génétique mondiale.",
    primarySources: [
      "Facebook Botany Groups - Plausible explanation for musk monkeyflower scent loss"
    ]
  },

  {
    name: "Nard de l'Himalaya",
    latinName: "Nardostachys jatamansi",
    historicalNames: ["Spikenard", "Nard indien", "Jatamansi"],
    extinctionStatus: "extinct_in_wild",
    extinctionCause: "overexploitation",
    extinctionDetails: "Populations sauvages décimées par la récolte excessive. Mentionné dans la Bible (onguent de Marie-Madeleine).",
    historicalRange: {
      regions: ["Himalaya", "Népal", "Inde", "Chine"],
      coordinates: { lat: 28.4, lng: 84.1 }
    },
    olfactiveDescription: "Terreux, boisé, animal, avec notes de valériane et de patchouli. Profond et méditatif.",
    therapeuticUses: "Médecine ayurvédique, parfumerie biblique, encens religieux.",
    culturalSignificance: "Mentionné dans le Cantique des Cantiques et les Évangiles. Valait son poids en or dans l'Antiquité.",
    hypotheticalMolecularProfile: {
      family: "Caprifoliaceae",
      mainMolecules: ["Jatamansone", "Nardostachone", "Valéranone", "Patchoulol"]
    },
    reconstructionPossibility: "partial",
    reconstructionNotes: "Cultures en cours au Népal. CITES Appendix II.",
    primarySources: [
      "IUCN Red List - Nardostachys jatamansi (CR)",
      "Bible - Jean 12:3"
    ]
  },

  {
    name: "Costus arabique",
    latinName: "Saussurea costus",
    historicalNames: ["Costus", "Kust", "Qust"],
    extinctionStatus: "extinct_in_wild",
    extinctionCause: "overexploitation",
    extinctionDetails: "Racine aromatique de l'Himalaya, surexploitée pour la médecine traditionnelle et la parfumerie.",
    historicalRange: {
      regions: ["Cachemire", "Himalaya"],
      coordinates: { lat: 34.1, lng: 74.8 }
    },
    olfactiveDescription: "Boisé, animal, légèrement violet, avec notes de cuir et d'iris.",
    therapeuticUses: "Médecine traditionnelle chinoise et arabe, parfumerie orientale.",
    culturalSignificance: "Mentionné dans les hadiths islamiques comme remède.",
    hypotheticalMolecularProfile: {
      family: "Asteraceae",
      mainMolecules: ["Costunolide", "Dehydrocostus lactone", "Aplotaxène"]
    },
    reconstructionPossibility: "partial",
    closestLivingRelatives: ["Saussurea lappa (cultivé)"],
    primarySources: [
      "IUCN Red List - Saussurea costus (CR)",
      "CITES Appendix I"
    ]
  },

  // ============================================================================
  // ENCENS ET RÉSINES MENACÉS
  // ============================================================================
  {
    name: "Encens de Somalie (populations anciennes)",
    latinName: "Boswellia sacra var. somalensis",
    historicalNames: ["Oliban de Somalie", "Frankincense"],
    extinctionStatus: "possibly_extinct",
    extinctionCause: "overexploitation",
    extinctionDetails: "Les arbres à encens de Somalie sont surexploités et ne se régénèrent plus. Population en déclin de 90% en 50 ans.",
    historicalRange: {
      regions: ["Somalie", "Yémen", "Oman"],
      coordinates: { lat: 10.4, lng: 45.0 }
    },
    olfactiveDescription: "Résineux, citronné, balsamique, avec notes de pin et de miel. Plus frais que l'encens omanais.",
    therapeuticUses: "Encens religieux, médecine traditionnelle, parfumerie.",
    culturalSignificance: "Un des trois présents des Rois Mages. Commerce depuis 5000 ans.",
    hypotheticalMolecularProfile: {
      family: "Burseraceae",
      mainMolecules: ["α-pinène", "Limonène", "Incensole", "Acides boswelliques"]
    },
    reconstructionPossibility: "partial",
    reconstructionNotes: "Programmes de replantation en cours mais arbres mettent 8-10 ans avant production.",
    closestLivingRelatives: ["Boswellia sacra (Oman)", "Boswellia carterii"],
    primarySources: [
      "IUCN - Boswellia sacra (NT)",
      "Nature - Frankincense trees in peril"
    ]
  },

  {
    name: "Myrrhe de Punt",
    latinName: "Commiphora myrrha var. punt",
    historicalNames: ["Myrrhe d'Égypte", "Stacte"],
    extinctionStatus: "presumed_extinct",
    lastKnownDate: -1500,
    extinctionCause: "unknown",
    extinctionDetails: "La myrrhe importée du mystérieux pays de Punt par les Égyptiens anciens. Localisation exacte de Punt inconnue (probablement Corne de l'Afrique ou Yémen).",
    historicalRange: {
      regions: ["Punt", "Corne de l'Afrique", "Yémen"],
      coordinates: { lat: 12.0, lng: 44.0 }
    },
    olfactiveDescription: "Myrrhe de qualité supérieure selon les textes égyptiens. Balsamique, amère, médicinale.",
    culturalSignificance: "Importée par la reine Hatchepsout. Utilisée pour l'embaumement et les rituels.",
    hypotheticalMolecularProfile: {
      family: "Burseraceae",
      probableMolecules: ["Furanodiène", "Curzerène", "Lindestrène"]
    },
    reconstructionPossibility: "unlikely",
    closestLivingRelatives: ["Commiphora myrrha", "Commiphora guidottii"],
    primarySources: [
      "Temple de Deir el-Bahari, inscriptions",
      "Papyrus Ebers"
    ]
  }
];

// Fonction pour générer un ID unique
function generateLostVarietyId(): string {
  return `LV-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
}

// Export pour utilisation dans les tests ou l'import direct
export { generateLostVarietyId };

console.log(`📊 ${lostVarietiesData.length} variétés disparues prêtes à être importées`);
