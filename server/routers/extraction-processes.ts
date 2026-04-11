import { publicProcedure, router } from "../_core/trpc";
import { getDb } from "../db/core";
import { molecules } from "../../drizzle/schema";
import { inArray } from "drizzle-orm";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface MolecularTransformation {
  precursor: string;
  product: string;
  mechanism: string;
  conditions: string;
  olfactoryImpact: string;
  references?: string;
}

export interface ExtractionMethod {
  id: string;
  name: string;
  nameEn: string;
  category: "thermal" | "mechanical" | "solvent" | "biological" | "supercritical";
  temperature: { min: number; max: number; unit: "°C" | "°K" };
  pressure: string;
  duration: string;
  yieldRange: string;
  description: string;
  principle: string;
  advantages: string[];
  disadvantages: string[];
  idealFor: string[];
  notSuitableFor: string[];
  transformations: MolecularTransformation[];
  keyMolecules: {
    preserved: string[];
    created: string[];
    destroyed: string[];
  };
  examplePlants: string[];
  dbMoleculeNames?: string[];
  historicalNote?: string;
  modernUse: string;
  qualityIndicators: string[];
}

// ─── Données scientifiques ────────────────────────────────────────────────────

const EXTRACTION_METHODS: ExtractionMethod[] = [
  {
    id: "hydrodistillation",
    name: "Hydrodistillation",
    nameEn: "Hydrodistillation",
    category: "thermal",
    temperature: { min: 95, max: 105, unit: "°C" },
    pressure: "Pression atmosphérique (1 atm)",
    duration: "1–8 heures selon la matière",
    yieldRange: "0,1–5% (matière sèche)",
    description: "La matière végétale est immergée directement dans l'eau bouillante. La vapeur entraîne les composés volatils, qui sont condensés et séparés par décantation.",
    principle: "Co-distillation eau-huile essentielle. La vapeur d'eau abaisse le point d'ébullition des composés aromatiques (loi de Raoult), permettant leur entraînement à 100°C au lieu de leurs températures d'ébullition respectives.",
    advantages: [
      "Équipement simple et peu coûteux",
      "Adapté aux matières dures (racines, bois, graines)",
      "Procédé traditionnel bien maîtrisé",
      "Pas de résidus de solvant",
    ],
    disadvantages: [
      "Hydrolyse des esters à haute température",
      "Dégradation thermique des composés sensibles",
      "Perte des composés très volatils",
      "Eau florale chargée en composés hydrosolubles",
    ],
    idealFor: ["Racines (vétiver, iris)", "Bois (santal, cèdre)", "Graines (coriandre, fenouil)", "Herbes robustes (romarin, thym)"],
    notSuitableFor: ["Fleurs délicates (jasmin, rose)", "Agrumes (zestes)", "Résines fragiles"],
    transformations: [
      {
        precursor: "Esters terpéniques (acétate de linalyle)",
        product: "Alcools terpéniques (linalol) + Acides",
        mechanism: "Hydrolyse acide thermique",
        conditions: "100°C, pH légèrement acide, contact prolongé avec l'eau",
        olfactoryImpact: "Perte des notes fruitées-florales, gain de notes alcooliques plus rondes",
        references: "Ohloff, G. (1994). Scent and Fragrances. Springer.",
      },
      {
        precursor: "α-Terpinyl acétate",
        product: "α-Terpinéol",
        mechanism: "Hydrolyse estérique",
        conditions: "Température > 90°C, présence d'eau",
        olfactoryImpact: "Transition du fruité vers le lilas-floral",
      },
      {
        precursor: "Citral (géranial + néral)",
        product: "p-Cymène + Thymol",
        mechanism: "Cyclisation thermique acido-catalysée",
        conditions: "100°C, traces d'acide, longue durée",
        olfactoryImpact: "Perte du citronné vif, apparition de notes épicées-phénoliques",
        references: "Baser, K.H.C. & Buchbauer, G. (2010). Handbook of Essential Oils.",
      },
      {
        precursor: "Sabinène",
        product: "Terpinèn-4-ol",
        mechanism: "Réarrangement thermique",
        conditions: "Chaleur prolongée, présence d'eau",
        olfactoryImpact: "Gain de notes terreuses-poivrées",
      },
    ],
    keyMolecules: {
      preserved: ["Linalol", "Géraniol", "Eugénol", "β-Caryophyllène", "Camphre"],
      created: ["α-Terpinéol", "Terpinèn-4-ol", "p-Cymène", "Thymol"],
      destroyed: ["Acétate de linalyle", "Acétate de géranyle", "Citral (partiellement)"],
    },
    examplePlants: ["Lavandula angustifolia", "Vetiveria zizanoides", "Santalum album", "Rosmarinus officinalis"],
    dbMoleculeNames: ["Linalol", "Géraniol", "α-Terpinéol", "β-Caryophyllène", "Camphre"],
    historicalNote: "Procédé décrit par Avicenne (Ibn Sina) au XIe siècle dans le Canon de la Médecine. Utilisé depuis l'Antiquité en Perse et en Égypte.",
    modernUse: "Huiles essentielles industrielles, aromathérapie, parfumerie de masse.",
    qualityIndicators: ["Indice de réfraction", "Densité relative", "Chromatographie GC-MS", "Teneur en esters"],
  },

  {
    id: "entrainement_vapeur",
    name: "Entraînement à la vapeur",
    nameEn: "Steam Distillation",
    category: "thermal",
    temperature: { min: 100, max: 130, unit: "°C" },
    pressure: "1–3 bar (vapeur sèche)",
    duration: "30 min–4 heures",
    yieldRange: "0,05–3%",
    description: "La vapeur d'eau est générée séparément et injectée à travers la matière végétale. Contrairement à l'hydrodistillation, la plante n'est pas en contact direct avec l'eau liquide.",
    principle: "La vapeur sèche traverse la matière végétale, arrache les molécules aromatiques par diffusion à travers les parois cellulaires, puis est condensée. Moins d'hydrolyse qu'en hydrodistillation.",
    advantages: [
      "Moins d'hydrolyse des esters qu'en hydrodistillation",
      "Contrôle précis de la pression et température",
      "Procédé industriel standard",
      "Meilleure préservation des esters",
    ],
    disadvantages: [
      "Équipement plus coûteux",
      "Toujours des dégradations thermiques possibles",
      "Inadapté aux matières très fragiles",
    ],
    idealFor: ["Lavande", "Menthe", "Eucalyptus", "Géranium", "Ylang-ylang"],
    notSuitableFor: ["Jasmin", "Tubéreuse", "Violette (fleurs)"],
    transformations: [
      {
        precursor: "Acétate de linalyle",
        product: "Linalol + Acide acétique",
        mechanism: "Hydrolyse partielle (moins qu'en hydrodistillation)",
        conditions: "Vapeur à 100–110°C, durée contrôlée",
        olfactoryImpact: "Légère perte de fraîcheur fruitée, gain de rondeur florale",
      },
      {
        precursor: "Méthyl anthranilate (jasmin)",
        product: "Acide anthranilique + Méthanol",
        mechanism: "Hydrolyse thermique",
        conditions: "Vapeur prolongée > 100°C",
        olfactoryImpact: "Perte des notes fruitées-indolées caractéristiques du jasmin",
      },
      {
        precursor: "Nérol",
        product: "α-Terpinéol",
        mechanism: "Cyclisation acido-catalysée par la vapeur",
        conditions: "Chaleur et humidité",
        olfactoryImpact: "Transition du rose-citronné vers le lilas",
      },
    ],
    keyMolecules: {
      preserved: ["Linalol", "Menthol", "Eucalyptol", "Géraniol", "Acétate de linalyle (partiellement)"],
      created: ["α-Terpinéol", "Terpinèn-4-ol"],
      destroyed: ["Composés très volatils (perdus en début de distillation)"],
    },
    examplePlants: ["Lavandula angustifolia", "Mentha piperita", "Eucalyptus globulus", "Pelargonium graveolens"],
    dbMoleculeNames: ["Linalol", "Menthol", "Eucalyptol", "Géraniol", "Acétate de linalyle"],
    modernUse: "Standard industriel pour la majorité des huiles essentielles commerciales.",
    qualityIndicators: ["Teneur en acétate de linalyle (lavande)", "Teneur en menthol (menthe)", "GC-MS profil"],
  },

  {
    id: "expression_a_froid",
    name: "Expression à froid",
    nameEn: "Cold Pressing / Scarification",
    category: "mechanical",
    temperature: { min: 20, max: 40, unit: "°C" },
    pressure: "Pression mécanique (scarification + centrifugation)",
    duration: "30 min–2 heures",
    yieldRange: "0,3–0,6% (zeste frais)",
    description: "Les zestes d'agrumes sont scarifiés mécaniquement pour libérer les essences contenues dans les glandes à huile. Le jus et l'huile sont ensuite séparés par centrifugation.",
    principle: "Rupture mécanique des poches à huile (sacs oléifères) dans le mésocarpe des zestes. Aucune chaleur — profil aromatique le plus proche de la plante vivante.",
    advantages: [
      "Profil aromatique le plus naturel et frais",
      "Aucune transformation thermique",
      "Préservation totale des composés volatils",
      "Procédé rapide",
    ],
    disadvantages: [
      "Applicable uniquement aux agrumes",
      "Présence de cires et pigments (chlorophylle, caroténoïdes)",
      "Stabilité réduite (oxydation rapide)",
      "Phototoxicité possible (furanocoumarines)",
    ],
    idealFor: ["Bergamote", "Citron", "Orange douce", "Pamplemousse", "Mandarine", "Yuzu"],
    notSuitableFor: ["Toute matière non-agrume"],
    transformations: [
      {
        precursor: "Limonène (dominant dans les agrumes)",
        product: "Oxyde de limonène + Carvone",
        mechanism: "Oxydation spontanée à l'air (post-extraction)",
        conditions: "Contact avec O₂ ambiant, lumière, chaleur",
        olfactoryImpact: "Perte du citronné vif, apparition de notes térébinthées-résineuses",
        references: "Flamini, G. et al. (2007). Limonene oxidation in citrus essential oils.",
      },
      {
        precursor: "Furanocoumarines (bergaptène)",
        product: "Produits de photolyse",
        mechanism: "Photolyse UV",
        conditions: "Exposition à la lumière UV",
        olfactoryImpact: "Pas d'impact olfactif direct, mais phototoxicité",
      },
    ],
    keyMolecules: {
      preserved: ["Limonène", "Linalol", "Acétate de linalyle (bergamote)", "β-Pinène", "γ-Terpinène", "Bergaptène"],
      created: [],
      destroyed: [],
    },
    examplePlants: ["Citrus bergamia", "Citrus limon", "Citrus sinensis", "Citrus paradisi"],
    dbMoleculeNames: ["Limonène", "Linalol", "Acétate de linalyle", "β-Pinène", "Bergaptène"],
    historicalNote: "Technique ancestrale sicilienne (éponge) remplacée par la scarification mécanique industrielle au XXe siècle.",
    modernUse: "Parfumerie fine (bergamote de Calabre IGP), arômes alimentaires, cosmétique.",
    qualityIndicators: ["Teneur en limonène (> 90% pour citron)", "Absence de résidus pesticides", "Teneur en bergaptène (bergamote)"],
  },

  {
    id: "enfleurage",
    name: "Enfleurage",
    nameEn: "Enfleurage",
    category: "biological",
    temperature: { min: 15, max: 25, unit: "°C" },
    pressure: "Pression atmosphérique",
    duration: "24–72 heures par cycle, 30–60 cycles",
    yieldRange: "Très faible (< 0,1%)",
    description: "Les fleurs fraîches sont posées sur des châssis enduits de graisse animale (saindoux, suif) qui absorbe les molécules aromatiques. La graisse saturée est ensuite lavée à l'alcool pour obtenir l'absolue.",
    principle: "Absorption passive des molécules volatiles par la graisse. Les fleurs continuent à produire des arômes après la cueillette (jasmin, tubéreuse) — l'enfleurage capture cette production continue.",
    advantages: [
      "Profil aromatique exceptionnel — capture les notes vivantes",
      "Adapté aux fleurs qui continuent à produire des arômes post-cueillette",
      "Aucune dégradation thermique",
      "Absolues d'une complexité inégalée",
    ],
    disadvantages: [
      "Extrêmement laborieux et coûteux",
      "Quasi-abandonné industriellement",
      "Rendement très faible",
      "Utilisation de graisses animales (éthique)",
    ],
    idealFor: ["Jasmin (Jasminum grandiflorum)", "Tubéreuse (Polianthes tuberosa)", "Violette (Viola odorata)", "Rose (Centifolia)"],
    notSuitableFor: ["Toute matière ne produisant pas d'arômes post-cueillette"],
    transformations: [
      {
        precursor: "Acétate de benzyle (jasmin)",
        product: "Alcool benzylique + Acide acétique",
        mechanism: "Hydrolyse enzymatique lente (enzymes florales résiduelles)",
        conditions: "Température ambiante, enzymes actives dans les pétales",
        olfactoryImpact: "Légère évolution du fruité vers le floral-alcoolique",
      },
      {
        precursor: "Indole (jasmin)",
        product: "Indole oxydé",
        mechanism: "Oxydation enzymatique",
        conditions: "Enzymes florales, O₂ ambiant",
        olfactoryImpact: "Évolution de l'indolé animal vers des notes plus douces",
      },
    ],
    keyMolecules: {
      preserved: ["Acétate de benzyle", "Linalol", "Indole", "Méthyl jasmonate", "Benzyl benzoate", "Phytol"],
      created: ["Alcool benzylique (traces)"],
      destroyed: [],
    },
    examplePlants: ["Jasminum grandiflorum", "Polianthes tuberosa", "Viola odorata", "Rosa centifolia"],
    dbMoleculeNames: ["Acétate de benzyle", "Linalol", "Indole", "Benzyl benzoate"],
    historicalNote: "Technique phare de Grasse (XVIIe–XIXe siècle). Décrite par Piesse (1857) et Rimmel (1865). Quasi-abandonnée dans les années 1950 avec l'arrivée de l'extraction par solvant.",
    modernUse: "Parfumerie artisanale de luxe, reconstitutions historiques. Quelques maisons (Chanel, Dior) maintiennent des productions symboliques à Grasse.",
    qualityIndicators: ["Teneur en acétate de benzyle (jasmin)", "Ratio indole/linalol", "Absence de résidus de solvant"],
  },

  {
    id: "extraction_solvant",
    name: "Extraction par solvant",
    nameEn: "Solvent Extraction",
    category: "solvent",
    temperature: { min: 20, max: 50, unit: "°C" },
    pressure: "Pression atmosphérique",
    duration: "2–12 heures",
    yieldRange: "0,2–3% (concrète), 0,1–1,5% (absolue)",
    description: "La matière végétale est mise en contact avec un solvant organique (hexane, éthanol) qui dissout les composés aromatiques. Après filtration, le solvant est évaporé pour obtenir une concrète (avec cires), puis lavé à l'alcool pour obtenir l'absolue.",
    principle: "Solubilisation des composés aromatiques dans un solvant organique apolaire (hexane) ou polaire (éthanol). Deux étapes : concrète (solvant + cires + arômes) → absolue (alcool élimine les cires).",
    advantages: [
      "Rendement supérieur à la distillation",
      "Préservation des molécules non-volatiles (cires, pigments)",
      "Adapté aux fleurs délicates",
      "Profil aromatique riche et complexe",
    ],
    disadvantages: [
      "Résidus de solvant possibles",
      "Coût élevé de l'hexane",
      "Impact environnemental des solvants",
      "Réglementation stricte (IFRA, EU)",
    ],
    idealFor: ["Jasmin absolu", "Rose absolue", "Iris (beurre d'iris)", "Mimosa", "Cassie", "Fève tonka"],
    notSuitableFor: ["Matières très aqueuses", "Racines et bois (distillation préférable)"],
    transformations: [
      {
        precursor: "Alcools terpéniques (géraniol, nérol)",
        product: "Esters (acétate de géranyle)",
        mechanism: "Estérification partielle en présence d'acides organiques",
        conditions: "Solvant légèrement acide, température ambiante",
        olfactoryImpact: "Gain de notes fruitées légères",
      },
      {
        precursor: "Chlorophylle",
        product: "Phéophytine (dégradation)",
        mechanism: "Dégradation chimique par le solvant",
        conditions: "Contact prolongé avec hexane",
        olfactoryImpact: "Légère note herbacée-verte dans la concrète",
      },
      {
        precursor: "Composés phénoliques (eugenol)",
        product: "Polymères phénoliques",
        mechanism: "Oxydation en présence de traces d'O₂",
        conditions: "Stockage post-extraction",
        olfactoryImpact: "Évolution vers des notes boisées-épicées plus profondes",
      },
    ],
    keyMolecules: {
      preserved: ["Acétate de benzyle", "Linalol", "Indole", "Benzyl benzoate", "Géraniol", "Phytol", "Squalène"],
      created: ["Acétate de géranyle (traces)"],
      destroyed: ["Composés très volatils (perdus lors de l'évaporation du solvant)"],
    },
    examplePlants: ["Jasminum grandiflorum", "Rosa damascena", "Iris pallida", "Acacia farnesiana"],
    dbMoleculeNames: ["Acétate de benzyle", "Linalol", "Indole", "Benzyl benzoate", "Géraniol"],
    historicalNote: "Développée à Grasse dans les années 1880 pour remplacer l'enfleurage. L'hexane a remplacé le benzène (cancérigène) dans les années 1970.",
    modernUse: "Standard pour jasmin, rose, iris absolus. Utilisé dans la parfumerie fine mondiale.",
    qualityIndicators: ["Résidus d'hexane < 1 ppm (IFRA)", "Teneur en acétate de benzyle", "Ratio cires/arômes"],
  },

  {
    id: "co2_supercritique",
    name: "Extraction CO₂ supercritique",
    nameEn: "Supercritical CO₂ Extraction",
    category: "supercritical",
    temperature: { min: 31, max: 60, unit: "°C" },
    pressure: "74–300 bar",
    duration: "30 min–3 heures",
    yieldRange: "0,5–8% (variable selon pression)",
    description: "Le CO₂ est porté au-delà de son point critique (31,1°C, 73,8 bar) où il acquiert des propriétés intermédiaires entre gaz et liquide. Ce fluide supercritique dissout les composés aromatiques avec une sélectivité ajustable par la pression.",
    principle: "Le CO₂ supercritique a une densité proche d'un liquide (bonne solubilisation) mais une viscosité proche d'un gaz (bonne pénétration). En abaissant la pression, le CO₂ redevient gaz et libère l'extrait sans résidu de solvant.",
    advantages: [
      "Aucun résidu de solvant",
      "Température basse — préservation des composés thermosensibles",
      "Sélectivité ajustable par la pression",
      "Profil aromatique très proche du naturel",
      "Procédé 'vert'",
    ],
    disadvantages: [
      "Investissement initial très élevé",
      "Expertise technique requise",
      "Moins adapté aux matières très aqueuses",
      "Coût opérationnel élevé",
    ],
    idealFor: ["Vanille", "Poivre noir", "Gingembre", "Houblon", "Café", "Camomille", "Calendula"],
    notSuitableFor: ["Matières très aqueuses sans prétraitement"],
    transformations: [
      {
        precursor: "Vanilline glucoside (glucovanilline)",
        product: "Vanilline libre",
        mechanism: "Hydrolyse enzymatique (non thermique)",
        conditions: "Basse température, enzymes actives préservées",
        olfactoryImpact: "Libération maximale de la note vanillée pure",
      },
      {
        precursor: "Pipérine (poivre)",
        product: "Pipéridine + Acide pipérique",
        mechanism: "Hydrolyse partielle à haute pression",
        conditions: "CO₂ supercritique > 200 bar",
        olfactoryImpact: "Gain de notes poivrées-piquantes plus intenses",
      },
      {
        precursor: "Acides gras (huiles fixes)",
        product: "Esters d'acides gras",
        mechanism: "Co-extraction avec les arômes",
        conditions: "Haute pression (> 200 bar)",
        olfactoryImpact: "Notes grasses-crémeuses dans l'extrait total",
      },
    ],
    keyMolecules: {
      preserved: ["Vanilline", "Pipérine", "Curcumine", "Humulone (houblon)", "Bisabolol", "Farnésol"],
      created: ["Pipéridine (traces)"],
      destroyed: [],
    },
    examplePlants: ["Vanilla planifolia", "Piper nigrum", "Zingiber officinale", "Humulus lupulus", "Matricaria chamomilla"],
    dbMoleculeNames: ["Vanilline", "Pipérine", "Bisabolol", "Farnésol"],
    historicalNote: "Développée dans les années 1980. Première application industrielle en 1986 pour le déhoublonnage de la bière (Natex, Autriche).",
    modernUse: "Parfumerie de niche, nutraceutique, arômes alimentaires premium, cosmétique bio.",
    qualityIndicators: ["Absence totale de résidus", "Profil GC-MS vs distillation", "Teneur en composés thermosensibles"],
  },

  {
    id: "maceration",
    name: "Macération / Infusion",
    nameEn: "Maceration / Infusion",
    category: "solvent",
    temperature: { min: 40, max: 80, unit: "°C" },
    pressure: "Pression atmosphérique",
    duration: "2 semaines–6 mois",
    yieldRange: "Variable (huile aromatisée)",
    description: "La matière végétale est immergée dans une huile végétale (jojoba, amande douce) ou de l'alcool pendant une période prolongée. Les composés aromatiques migrent progressivement dans le solvant.",
    principle: "Diffusion passive des molécules aromatiques par gradient de concentration. Processus lent permettant l'extraction de composés peu volatils et la transformation enzymatique progressive.",
    advantages: [
      "Procédé simple et accessible",
      "Extraction des composés non-volatils",
      "Transformations enzymatiques bénéfiques",
      "Produit directement utilisable (huile aromatisée)",
    ],
    disadvantages: [
      "Durée très longue",
      "Risque de rancissement",
      "Profil moins concentré",
      "Difficile à standardiser",
    ],
    idealFor: ["Vanille (macération alcoolique)", "Fève tonka", "Labdanum", "Calamus", "Iris (macération pour beurre)"],
    notSuitableFor: ["Matières à haute volatilité (terpènes légers perdus)"],
    transformations: [
      {
        precursor: "Glucovanilline",
        product: "Vanilline",
        mechanism: "Hydrolyse enzymatique (β-glucosidase)",
        conditions: "Alcool 40–60%, température ambiante, longue durée",
        olfactoryImpact: "Développement progressif de la note vanillée",
        references: "Dignum, M.J.W. et al. (2001). Vanilla production. Food Reviews International.",
      },
      {
        precursor: "Irone (iris)",
        product: "Irones maturées",
        mechanism: "Oxydation enzymatique lente",
        conditions: "Macération à froid, mois à années",
        olfactoryImpact: "Développement de la note iris-violette caractéristique",
      },
      {
        precursor: "Coumarines (fève tonka)",
        product: "Coumarines libres",
        mechanism: "Hydrolyse des glucosides",
        conditions: "Alcool, longue durée",
        olfactoryImpact: "Intensification de la note foin-vanillée",
      },
    ],
    keyMolecules: {
      preserved: ["Vanilline", "Coumarines", "Irones", "Benzyl benzoate"],
      created: ["Vanilline (depuis glucovanilline)", "Irones maturées"],
      destroyed: ["Composés très volatils (terpènes légers)"],
    },
    examplePlants: ["Vanilla planifolia", "Dipteryx odorata", "Iris pallida", "Cistus ladaniferus"],
    dbMoleculeNames: ["Vanilline", "Coumarine", "Benzyl benzoate"],
    historicalNote: "Technique la plus ancienne connue — macérations aromatiques retrouvées dans les tombes égyptiennes (3000 av. J.-C.). Base de la parfumerie orientale traditionnelle.",
    modernUse: "Parfumerie artisanale, préparations cosmétiques, teintures mères en phytothérapie.",
    qualityIndicators: ["Teneur en vanilline", "Absence de moisissures", "Profil organoleptique"],
  },

  {
    id: "distillation_fractionnee",
    name: "Distillation fractionnée",
    nameEn: "Fractional Distillation",
    category: "thermal",
    temperature: { min: 50, max: 200, unit: "°C" },
    pressure: "Variable (atmosphérique à sous-vide)",
    duration: "2–8 heures",
    yieldRange: "Variable selon la fraction",
    description: "Séparation des composants d'une huile essentielle brute selon leurs points d'ébullition respectifs. Permet d'isoler des fractions spécifiques ou de déterpeniser une huile.",
    principle: "Utilisation d'une colonne de distillation à plateaux ou à garnissage. Les composés se séparent selon leur volatilité relative. Sous vide, les températures sont abaissées pour protéger les composés thermosensibles.",
    advantages: [
      "Isolation de composés purs",
      "Déterpenisation (élimination des monoterpènes)",
      "Concentration des composés d'intérêt",
      "Amélioration de la stabilité des huiles",
    ],
    disadvantages: [
      "Perte de la complexité naturelle",
      "Coût élevé",
      "Risque de dégradation thermique",
      "Produit 'reconstruit' — moins naturel",
    ],
    idealFor: ["Déterpenisation d'agrumes", "Isolation de linalol pur", "Concentration de géraniol", "Purification de menthol"],
    notSuitableFor: ["Matières premières brutes (utiliser d'abord distillation simple)"],
    transformations: [
      {
        precursor: "Limonène (fraction légère)",
        product: "Éliminé dans la fraction terpénique",
        mechanism: "Séparation par volatilité",
        conditions: "Distillation sous vide, colonne à plateaux",
        olfactoryImpact: "Élimination du citronné terpénique, concentration des notes florales",
      },
      {
        precursor: "Sesquiterpènes (fraction lourde)",
        product: "Concentrés dans la fraction résiduelle",
        mechanism: "Séparation par point d'ébullition élevé",
        conditions: "Distillation sous vide poussé",
        olfactoryImpact: "Concentration des notes boisées-animales profondes",
      },
    ],
    keyMolecules: {
      preserved: ["Linalol (fraction médiane)", "Géraniol", "Menthol"],
      created: [],
      destroyed: ["Composés thermosensibles si température trop haute"],
    },
    examplePlants: ["Citrus bergamia (déterpenisation)", "Lavandula angustifolia", "Mentha piperita"],
    dbMoleculeNames: ["Linalol", "Géraniol", "Menthol", "Limonène"],
    historicalNote: "Technique développée au XIXe siècle dans l'industrie chimique. Appliquée à la parfumerie dans les années 1920 pour la déterpenisation des agrumes.",
    modernUse: "Production de linalol pur (synthèse), déterpenisation d'agrumes pour parfumerie fine, purification de menthol.",
    qualityIndicators: ["Pureté GC > 95%", "Point d'ébullition", "Indice de réfraction"],
  },
  {
    id: "co2_sous_critique",
    name: "Extraction CO₂ Sous-critique",
    nameEn: "Subcritical CO₂ Extraction",
    category: "supercritical",
    temperature: { min: 10, max: 35, unit: "°C" },
    pressure: "50–70 bar (liquide dense)",
    duration: "30 min – 4 heures",
    yieldRange: "0,5–8% (matière sèche)",
    description: "Le CO₂ est maintenu à l'état liquide dense (sous son point critique de 31,1°C/73,8 bar). Il dissout sélectivement les composés lipophiles et thermosensibles sans les dénaturer, préservant les molécules les plus fragiles.",
    principle: "Le CO₂ liquide dense à basse température agit comme solvant sélectif. Sa polarité intermédiaire extrait préférentiellement les composés de faible poids moléculaire et les esters fragiles, sans hydrolyse ni dégradation thermique.",
    advantages: [
      "Température très basse — idéal pour composés thermosensibles",
      "Préservation maximale des esters et aldéhydes fragiles",
      "Profil olfactif très proche de la matière fraîche",
      "Pas de résidus de solvant organique",
      "Sélectivité modulable par la pression",
    ],
    disadvantages: [
      "Équipement haute pression coûteux",
      "Rendement inférieur au CO₂ supercritique",
      "Moins efficace sur les composés de haut poids moléculaire",
      "Temps d'extraction plus long",
    ],
    idealFor: ["Fleurs fraîches (jasmin, tubéreuse)", "Agrumes (zestes frais)", "Herbes fraîches (basilic, menthe)", "Épices délicates (cardamome, vanille)"],
    notSuitableFor: ["Bois durs", "Racines ligneuses", "Résines épaisses"],
    transformations: [
      {
        precursor: "Esters floraux (acétate de benzyle, acétate de linalyle)",
        product: "Esters intacts — aucune hydrolyse",
        mechanism: "Absence de réaction — extraction physique pure",
        conditions: "10–35°C, 50–70 bar, CO₂ liquide",
        olfactoryImpact: "Conservation parfaite des notes florales fraîches et fruitées",
        references: "Reverchon, E. & De Marco, I. (2006). Supercritical fluid extraction and fractionation of natural matter. J. Supercrit. Fluids, 38(2), 146–166.",
      },
      {
        precursor: "Aldéhydes terpéniques (citral, citronellal)",
        product: "Aldéhydes intacts",
        mechanism: "Pas de dégradation thermique à basse température",
        conditions: "<35°C, absence d'eau",
        olfactoryImpact: "Notes citronnées vives et fraîches conservées intégralement",
        references: "Pourmortazavi, S.M. & Hajimirsadeghi, S.S. (2007). Supercritical fluid extraction in plant essential and volatile oil analysis. J. Chromatogr. A, 1163(1–2), 2–24.",
      },
    ],
    keyMolecules: {
      preserved: ["Acétate de linalyle", "Acétate de benzyle", "Citral", "Citronellal", "Linalol", "Géraniol"],
      created: [],
      destroyed: [],
    },
    examplePlants: ["Jasminum grandiflorum", "Citrus limon", "Ocimum basilicum", "Elettaria cardamomum"],
    dbMoleculeNames: ["Acétate de linalyle", "Acétate de benzyle", "Citral", "Linalol", "Géraniol"],
    historicalNote: "Développée dans les années 1990 comme alternative douce au CO₂ supercritique pour les matières les plus fragiles. Adoptée progressivement par la parfumerie naturelle haut de gamme.",
    modernUse: "Extraction de jasmin et tubéreuse pour parfumerie de niche, production d'extraits d'agrumes pour cosmétique, huiles essentielles de qualité supérieure.",
    qualityIndicators: ["Profil GC-MS proche de la matière fraîche", "Absence de marqueurs de dégradation thermique", "Teneur en esters > 80% pour floraux"],
  },
  {
    id: "percolation_froide",
    name: "Percolation à Froid",
    nameEn: "Cold Percolation / Cold Pressing Extraction",
    category: "mechanical",
    temperature: { min: 4, max: 20, unit: "°C" },
    pressure: "Pression atmosphérique (circulation gravitaire)",
    duration: "12–72 heures",
    yieldRange: "0,3–3% (matière fraîche)",
    description: "Un solvant froid (éthanol, hexane ou CO₂ liquide) percolate lentement à travers la matière végétale par gravité ou légère pression, à température ambiante ou réfrigérée. Extrait les composés sans aucune chaleur.",
    principle: "Diffusion passive des composés lipophiles dans le solvant froid. La basse température ralentit les réactions enzymatiques et oxydatives, préservant les composés les plus instables. La percolation lente maximise le contact solvant-matière.",
    advantages: [
      "Température minimale — zéro dégradation thermique",
      "Préservation des composés enzymatiquement actifs",
      "Profil olfactif très fidèle à la matière brute",
      "Adapté aux matières très fragiles",
      "Équipement simple (pas de pression)",
    ],
    disadvantages: [
      "Temps d'extraction très long (12–72h)",
      "Résidus de solvant possibles (éthanol, hexane)",
      "Rendement faible",
      "Risque de fermentation si durée trop longue",
      "Sélectivité limitée — extraction de chlorophylles et cires",
    ],
    idealFor: ["Fleurs ultra-fragiles (violette, mimosa)", "Plantes à enzymes actives", "Matières à profil olfactif complexe", "Recherche et développement"],
    notSuitableFor: ["Production industrielle", "Matières dures ou ligneuses", "Résines"],
    transformations: [
      {
        precursor: "Composés enzymatiques précurseurs (glucosides terpéniques)",
        product: "Alcools terpéniques libres (linalol, géraniol) par hydrolyse enzymatique naturelle",
        mechanism: "Hydrolyse enzymatique à froid — les enzymes végétales restent actives",
        conditions: "4–20°C, absence de chaleur dénaturante",
        olfactoryImpact: "Développement progressif de notes florales complexes absentes dans les extraits thermiques",
        references: "Bauer, K., Garbe, D. & Surburg, H. (2001). Common Fragrance and Flavor Materials. Wiley-VCH.",
      },
      {
        precursor: "Aldéhydes instables (cis-3-hexénal, feuille verte)",
        product: "Aldéhydes intacts — pas d'oxydation",
        mechanism: "Absence d'oxydation à basse température",
        conditions: "<20°C, atmosphère inerte recommandée",
        olfactoryImpact: "Conservation des notes 'feuille verte' et 'herbe fraîche' très volatiles",
        references: "Arctander, S. (1960). Perfume and Flavor Materials of Natural Origin. Self-published.",
      },
    ],
    keyMolecules: {
      preserved: ["cis-3-Hexénal", "Linalol", "Géraniol", "Acétate de benzyle", "Indole"],
      created: ["Linalol (par hydrolyse enzymatique de glucosides)"],
      destroyed: [],
    },
    examplePlants: ["Viola odorata (violette)", "Mimosa pudica", "Cannabis sativa (extraction à froid)", "Humulus lupulus (houblon)"],
    dbMoleculeNames: ["Linalol", "Géraniol", "Acétate de benzyle", "Indole"],
    historicalNote: "Technique ancestrale utilisée par les apothicaires médiévaux pour extraire les principes actifs des plantes sans les dénaturer. Redécouverte dans les années 2000 par la parfumerie naturelle artisanale.",
    modernUse: "Extraits de violette et mimosa pour parfumerie de niche, teintures botaniques, extraits médicinaux, recherche sur les précurseurs glucosidiques.",
    qualityIndicators: ["Présence de composés enzymatiques actifs", "Absence de marqueurs de dégradation", "Profil GC-MS riche en esters et aldéhydes fragiles"],
  },
];

// ─── Routeur ──────────────────────────────────────────────────────────────────

export const extractionProcessesRouter = router({
  getAll: publicProcedure.query(async () => {
    return EXTRACTION_METHODS;
  }),

  getById: publicProcedure
    .input((val: unknown) => {
      if (typeof val !== "string") throw new Error("Expected string");
      return val;
    })
    .query(async ({ input }) => {
      return EXTRACTION_METHODS.find((m) => m.id === input) ?? null;
    }),

  getWithMolecules: publicProcedure.query(async () => {
    const db = await getDb();
    const allMoleculeNames = [
      ...new Set(EXTRACTION_METHODS.flatMap((m) => m.dbMoleculeNames ?? [])),
    ];

    let moleculeMap = new Map<string, number>();
    if (db) {
      const dbMolecules = await db
        .select({ id: molecules.id, name: molecules.name })
        .from(molecules)
        .where(inArray(molecules.name, allMoleculeNames));
      moleculeMap = new Map(dbMolecules.map((m: { id: number; name: string }) => [m.name.toLowerCase(), m.id]));
    }

    return EXTRACTION_METHODS.map((method) => ({
      ...method,
      resolvedMolecules: (method.dbMoleculeNames ?? []).map((name: string) => ({
        name,
        dbId: moleculeMap.get(name.toLowerCase()) ?? null,
      })),
    }));
  }),

  getComparison: publicProcedure.query(async () => {
    return EXTRACTION_METHODS.map((m) => ({
      id: m.id,
      name: m.name,
      category: m.category,
      temperature: m.temperature,
      yieldRange: m.yieldRange,
      preservedCount: m.keyMolecules.preserved.length,
      createdCount: m.keyMolecules.created.length,
      destroyedCount: m.keyMolecules.destroyed.length,
      transformationsCount: m.transformations.length,
      idealForCount: m.idealFor.length,
    }));
  }),
});
