import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { getDb } from "../db/core";
import { molecules, plants } from "../../drizzle/schema";
import { like, or } from "drizzle-orm";

// ─── Types ───────────────────────────────────────────────────────────────────

export type TransformationProcess =
  | "isomerization"
  | "oxidation"
  | "pyrolysis"
  | "fermentation"
  | "hydrolysis"
  | "distillation"
  | "polymerization"
  | "decarboxylation"
  | "cyclization";

export interface ChemicalTransformation {
  id: string;
  process: TransformationProcess;
  processLabel: string;
  precursor: {
    name: string;
    casNumber?: string;
    dbMoleculeId?: number;
    formula?: string;
    class?: string;
  };
  product: {
    name: string;
    casNumber?: string;
    dbMoleculeId?: number;
    formula?: string;
    class?: string;
  };
  conditions: string; // ex: "lumière UV, 25°C, 6 mois"
  olfactoryImpact: string; // ex: "perte de fraîcheur, gain de profondeur terreuse"
  notes?: string;
  references?: string[];
}

export interface ResinProfile {
  id: string;
  name: string;
  latinName: string;
  dbPlantId?: number;
  category: "resine_brute" | "baume" | "gomme_resine" | "oleoresine" | "absolue" | "cannabis";
  origin: string[];
  description: string;
  keyMolecules: string[]; // noms des molécules clés
  transformations: ChemicalTransformation[];
  maturationType: string; // ex: "Vieillissement oxydatif lent"
  timelineMonths?: number; // durée typique de maturation en mois
  olfactoryEvolution: {
    fresh: string;
    aged: string;
    burned?: string;
  };
  color?: { fresh: string; aged: string };
}

// ─── Données scientifiques encodées ──────────────────────────────────────────

const RESIN_PROFILES: ResinProfile[] = [
  // ── OLIBAN / FRANKINCENSE ──────────────────────────────────────────────────
  {
    id: "oliban",
    name: "Oliban (Frankincense)",
    latinName: "Boswellia sacra / serrata / carterii",
    category: "resine_brute",
    origin: ["Oman", "Somalie", "Éthiopie", "Inde"],
    description:
      "Résine sacrée par excellence, l'oliban est produit par incision de l'écorce des Boswellia. Sa composition évolue radicalement selon l'âge, l'espèce et le mode de traitement.",
    keyMolecules: ["α-Pinène", "Limonène", "Acétate d'incensole", "Incensole", "Acide β-boswellique"],
    maturationType: "Vieillissement oxydatif + isomérisation terpénique",
    timelineMonths: 24,
    olfactoryEvolution: {
      fresh: "Citronné, résineux, légèrement camphré, vert",
      aged: "Boisé profond, encensé, ambré, notes de myrrhe",
      burned: "Guaïacol, créosol, furfural — fumé, médicinal, sacré",
    },
    color: { fresh: "Blanc laiteux à jaune pâle", aged: "Ambre doré à brun" },
    transformations: [
      {
        id: "oliban-t1",
        process: "isomerization",
        processLabel: "Isomérisation",
        precursor: {
          name: "α-Pinène",
          casNumber: "80-56-8",
          formula: "C₁₀H₁₆",
          class: "Monoterpène bicyclique",
        },
        product: {
          name: "Camphène",
          casNumber: "79-92-5",
          formula: "C₁₀H₁₆",
          class: "Monoterpène bicyclique",
        },
        conditions: "Chaleur douce (30–50°C), acides résiduels, lumière",
        olfactoryImpact: "Perte de fraîcheur camphrée-résineuse, gain de notes boisées-camphre plus lourdes",
        notes: "Réaction de Wagner-Meerwein catalysée par les acides boswelliques résiduels",
        references: ["Hamm et al., Phytochemistry 2005", "Steigenberger, 2013"],
      },
      {
        id: "oliban-t2",
        process: "isomerization",
        processLabel: "Isomérisation",
        precursor: {
          name: "α-Pinène",
          casNumber: "80-56-8",
          formula: "C₁₀H₁₆",
          class: "Monoterpène bicyclique",
        },
        product: {
          name: "Limonène",
          casNumber: "5989-27-5",
          formula: "C₁₀H₁₆",
          class: "Monoterpène monocyclique",
        },
        conditions: "Températures élevées (>60°C), pyrolyse partielle",
        olfactoryImpact: "Apparition de notes citronnées dans les résines chauffées",
        references: ["Khan & Rashan, 2025"],
      },
      {
        id: "oliban-t3",
        process: "oxidation",
        processLabel: "Oxydation",
        precursor: {
          name: "Incensole",
          casNumber: "469-97-6",
          formula: "C₂₀H₃₄O",
          class: "Diterpène",
        },
        product: {
          name: "Acétate d'incensole",
          casNumber: "77658-08-3",
          formula: "C₂₂H₃₆O₂",
          class: "Ester diterpénique",
        },
        conditions: "Vieillissement naturel, contact avec l'air, 12–36 mois",
        olfactoryImpact: "Gain de douceur, notes boisées-laiteuses plus prononcées, fixation accrue",
        notes: "L'acétate d'incensole est le composé psychoactif étudié pour ses effets anxiolytiques",
        references: ["Moussaieff et al., 2008", "Huang et al., 2022"],
      },
      {
        id: "oliban-t4",
        process: "pyrolysis",
        processLabel: "Pyrolyse",
        precursor: {
          name: "Acide β-boswellique",
          casNumber: "631-69-6",
          formula: "C₃₀H₄₈O₃",
          class: "Acide triterpénique",
        },
        product: {
          name: "Guaïacol",
          casNumber: "90-05-1",
          formula: "C₇H₈O₂",
          class: "Phénol méthoxylé",
        },
        conditions: "Combustion partielle (300–500°C), atmosphère limitée en oxygène",
        olfactoryImpact: "Notes fumées, médicinales, phénoliques — caractère 'encens brûlé'",
        references: ["Rivera et al., 2024", "Niebler, 2017"],
      },
      {
        id: "oliban-t5",
        process: "decarboxylation",
        processLabel: "Décarboxylation",
        precursor: {
          name: "Acide β-boswellique",
          casNumber: "631-69-6",
          formula: "C₃₀H₄₈O₃",
          class: "Acide triterpénique",
        },
        product: {
          name: "β-Boswellène",
          formula: "C₃₀H₄₈",
          class: "Triterpène",
        },
        conditions: "Chaleur prolongée (>80°C), vieillissement accéléré",
        olfactoryImpact: "Réduction de l'acidité, gain de profondeur boisée",
        references: ["Steigenberger, 2013"],
      },
    ],
  },

  // ── MYRRHE ────────────────────────────────────────────────────────────────
  {
    id: "myrrhe",
    name: "Myrrhe",
    latinName: "Commiphora myrrha / molmol",
    category: "resine_brute",
    origin: ["Somalie", "Éthiopie", "Yémen", "Oman"],
    description:
      "Gomme-résine amère aux notes balsamiques profondes. Sa composition unique en sesquiterpènes furanoïdes évolue lentement par oxydation et cyclisation.",
    keyMolecules: ["Myrrhone", "Incensole", "β-Caryophyllène", "α-Pinène", "Limonène"],
    maturationType: "Oxydation sesquiterpénique + cyclisation furanoïde",
    timelineMonths: 36,
    olfactoryEvolution: {
      fresh: "Amer, balsamique, légèrement phénolique, terreux",
      aged: "Profondément balsamique, ambré, notes de cuir, douceur accrue",
      burned: "Phénolique intense, fumé, médicinal, résine chaude",
    },
    color: { fresh: "Brun rougeâtre", aged: "Brun foncé, presque noir" },
    transformations: [
      {
        id: "myrrhe-t1",
        process: "oxidation",
        processLabel: "Oxydation",
        precursor: {
          name: "β-Caryophyllène",
          casNumber: "87-44-5",
          formula: "C₁₅H₂₄",
          class: "Sesquiterpène bicyclique",
        },
        product: {
          name: "Oxyde de caryophyllène",
          casNumber: "1139-30-6",
          formula: "C₁₅H₂₄O",
          class: "Époxyde sesquiterpénique",
        },
        conditions: "Contact avec l'air, lumière, 6–18 mois",
        olfactoryImpact: "Gain de notes terreuses, boisées-épicées, légèrement poivrées",
        references: ["Cao et al., 2019"],
      },
      {
        id: "myrrhe-t2",
        process: "cyclization",
        processLabel: "Cyclisation",
        precursor: {
          name: "Sesquiterpènes furanoïdes ouverts",
          formula: "C₁₅H₂₂O",
          class: "Sesquiterpène",
        },
        product: {
          name: "Myrrhone",
          formula: "C₁₅H₂₀O₂",
          class: "Sesquiterpène furanoïde cyclique",
        },
        conditions: "Vieillissement naturel, pH acide de la résine, 12–48 mois",
        olfactoryImpact: "Développement du caractère amer-balsamique caractéristique de la myrrhe vieillie",
        notes: "Les furanoïdes cycliques sont les marqueurs chimiques de la myrrhe authentique",
        references: ["Abdelwahab et al., 2024"],
      },
      {
        id: "myrrhe-t3",
        process: "pyrolysis",
        processLabel: "Pyrolyse",
        precursor: {
          name: "Résine phénolique",
          class: "Composés phénoliques",
        },
        product: {
          name: "p-Crésol",
          casNumber: "106-44-5",
          formula: "C₇H₈O",
          class: "Phénol",
        },
        conditions: "Combustion (250–400°C)",
        olfactoryImpact: "Notes animales, médicinales, phénoliques — 'fumée de myrrhe'",
        references: ["Rivera et al., 2024"],
      },
    ],
  },

  // ── BENJOIN ───────────────────────────────────────────────────────────────
  {
    id: "benjoin",
    name: "Benjoin",
    latinName: "Styrax benzoin / tonkinensis",
    category: "resine_brute",
    origin: ["Sumatra", "Laos", "Vietnam", "Thaïlande"],
    description:
      "Baume résineux à dominante vanillée-balsamique. Riche en esters d'acide cinnamique et benzoïque, il évolue vers des notes de plus en plus vanillées et chocolatées avec l'âge.",
    keyMolecules: ["Coniferyl benzoate", "Acide Cinnamique", "Vanilline", "Benzyl cinnamate", "Acide benzoïque"],
    maturationType: "Hydrolyse enzymatique + oxydation aromatique",
    timelineMonths: 18,
    olfactoryEvolution: {
      fresh: "Balsamique doux, vanillé léger, légèrement citronné",
      aged: "Vanillé intense, chocolaté, balsamique profond, notes de caramel",
      burned: "Vanilline libre, notes de fumée douce, caramel brûlé",
    },
    color: { fresh: "Blanc laiteux à jaune", aged: "Brun ambré" },
    transformations: [
      {
        id: "benjoin-t1",
        process: "hydrolysis",
        processLabel: "Hydrolyse",
        precursor: {
          name: "Coniferyl benzoate",
          casNumber: "4046-02-0",
          formula: "C₁₇H₁₆O₃",
          class: "Ester phénylpropanoïde",
        },
        product: {
          name: "Vanilline",
          casNumber: "121-33-5",
          formula: "C₈H₈O₃",
          class: "Aldéhyde aromatique",
        },
        conditions: "Hydrolyse alcaline ou enzymatique, humidité, 6–24 mois",
        olfactoryImpact: "Libération progressive de la note vanillée — transformation majeure du profil olfactif",
        notes: "La vanilline est le produit de dégradation du coniferyl benzoate via l'acide férulique",
        references: ["He et al., 2023", "New insights in benzoin balsams, 2016"],
      },
      {
        id: "benjoin-t2",
        process: "hydrolysis",
        processLabel: "Hydrolyse",
        precursor: {
          name: "Benzyl cinnamate",
          casNumber: "103-41-3",
          formula: "C₁₆H₁₄O₂",
          class: "Ester cinnamique",
        },
        product: {
          name: "Acide Cinnamique",
          casNumber: "621-82-9",
          formula: "C₉H₈O₂",
          class: "Acide phénylpropanoïque",
        },
        conditions: "Humidité, chaleur modérée, 3–12 mois",
        olfactoryImpact: "Libération de notes balsamiques-épicées, légèrement piquantes",
        references: ["He et al., 2023"],
      },
      {
        id: "benjoin-t3",
        process: "pyrolysis",
        processLabel: "Pyrolyse",
        precursor: {
          name: "Acide Cinnamique",
          casNumber: "621-82-9",
          formula: "C₉H₈O₂",
          class: "Acide phénylpropanoïque",
        },
        product: {
          name: "Styrène",
          casNumber: "100-42-5",
          formula: "C₈H₈",
          class: "Hydrocarbure aromatique",
        },
        conditions: "Combustion (200–350°C), décarboxylation thermique",
        olfactoryImpact: "Notes plastiques légères, balsamiques-fumées caractéristiques du benjoin brûlé",
        references: ["Niebler, 2017"],
      },
      {
        id: "benjoin-t4",
        process: "oxidation",
        processLabel: "Oxydation",
        precursor: {
          name: "Cinnamaldéhyde",
          casNumber: "104-55-2",
          formula: "C₉H₈O",
          class: "Aldéhyde aromatique",
        },
        product: {
          name: "Acide Cinnamique",
          casNumber: "621-82-9",
          formula: "C₉H₈O₂",
          class: "Acide phénylpropanoïque",
        },
        conditions: "Oxydation atmosphérique, lumière, 3–12 mois",
        olfactoryImpact: "Perte de la note épicée-cannelle, gain de fixité balsamique",
        references: ["He et al., 2023"],
      },
    ],
  },

  // ── LABDANUM ──────────────────────────────────────────────────────────────
  {
    id: "labdanum",
    name: "Labdanum",
    latinName: "Cistus ladanifer",
    category: "resine_brute",
    origin: ["Espagne", "Portugal", "Maroc", "Grèce", "Crète"],
    description:
      "Résine collante sécrétée par les feuilles et tiges de Cistus. Précurseur chimique de l'ambre gris de synthèse, elle contient des diterpènes labdanoïdes qui évoluent vers des notes ambrées profondes.",
    keyMolecules: ["α-Pinène", "Camphène", "Labdanolic acid", "Sclareol", "Ambroxide"],
    maturationType: "Oxydation diterpénique + cyclisation labdanoïde",
    timelineMonths: 48,
    olfactoryEvolution: {
      fresh: "Résineuse, boisée, légèrement camphrée, herbacée",
      aged: "Ambrée profonde, cuirée, animale, notes de mousse et de sous-bois",
      burned: "Fumé boisé, ambre chaud, notes de cuir",
    },
    color: { fresh: "Brun verdâtre", aged: "Brun foncé, très collant" },
    transformations: [
      {
        id: "labdanum-t1",
        process: "oxidation",
        processLabel: "Oxydation",
        precursor: {
          name: "Sclareol",
          casNumber: "515-03-7",
          formula: "C₂₀H₃₆O₂",
          class: "Diterpène labdanoïde",
        },
        product: {
          name: "Ambroxide (Ambroxan)",
          casNumber: "6790-58-5",
          formula: "C₁₆H₂₈O",
          class: "Oxyde diterpénique",
        },
        conditions: "Oxydation en milieu acide, vieillissement prolongé (2–5 ans)",
        olfactoryImpact: "Apparition de la note ambrée-musquée caractéristique — transformation olfactive majeure",
        notes: "Cette transformation est la base de la synthèse industrielle de l'Ambroxan® (Firmenich)",
        references: ["Frazão et al., 2022", "Frija et al., 2011"],
      },
      {
        id: "labdanum-t2",
        process: "cyclization",
        processLabel: "Cyclisation",
        precursor: {
          name: "Acide labdanolique",
          formula: "C₂₀H₃₄O₃",
          class: "Acide diterpénique",
        },
        product: {
          name: "Labdanol",
          formula: "C₂₀H₃₄O",
          class: "Alcool diterpénique",
        },
        conditions: "Décarboxylation thermique, vieillissement",
        olfactoryImpact: "Gain de douceur boisée, réduction de l'acidité",
        references: ["Frazão et al., 2024"],
      },
      {
        id: "labdanum-t3",
        process: "isomerization",
        processLabel: "Isomérisation",
        precursor: {
          name: "α-Pinène",
          casNumber: "80-56-8",
          formula: "C₁₀H₁₆",
          class: "Monoterpène",
        },
        product: {
          name: "Camphène",
          casNumber: "79-92-5",
          formula: "C₁₀H₁₆",
          class: "Monoterpène",
        },
        conditions: "Chaleur, acides résiduels",
        olfactoryImpact: "Évolution de la tête résineuse vers des notes camphrées-boisées",
        references: ["Steigenberger, 2013"],
      },
    ],
  },

  // ── OPOPONAX ──────────────────────────────────────────────────────────────
  {
    id: "opoponax",
    name: "Opoponax (Myrrhe douce)",
    latinName: "Commiphora guidottii / erythraea",
    category: "gomme_resine",
    origin: ["Somalie", "Kenya", "Éthiopie"],
    description:
      "Gomme-résine douce, cousine de la myrrhe. Plus sucrée et balsamique, elle évolue vers des notes de vanille et de foin coupé par fermentation et oxydation.",
    keyMolecules: ["Incensole", "β-Caryophyllène", "Myrcène", "Limonène"],
    maturationType: "Fermentation + oxydation sesquiterpénique",
    timelineMonths: 24,
    olfactoryEvolution: {
      fresh: "Doux, balsamique, légèrement citronné, herbacé",
      aged: "Vanillé, foin coupé, balsamique profond, légèrement animal",
      burned: "Encensé doux, fumé balsamique, notes de miel",
    },
    color: { fresh: "Jaune-brun", aged: "Brun ambré" },
    transformations: [
      {
        id: "opoponax-t1",
        process: "fermentation",
        processLabel: "Fermentation",
        precursor: {
          name: "Glucosides terpéniques",
          class: "Hétérosides",
        },
        product: {
          name: "Alcools terpéniques libres",
          class: "Monoterpènes oxygénés",
        },
        conditions: "Humidité résiduelle, microflore endogène, 6–18 mois",
        olfactoryImpact: "Libération de notes florales-herbacées, gain de douceur",
        notes: "Processus analogue à la fermentation du tabac (curing)",
      },
      {
        id: "opoponax-t2",
        process: "oxidation",
        processLabel: "Oxydation",
        precursor: {
          name: "Incensole",
          casNumber: "469-97-6",
          formula: "C₂₀H₃₄O",
          class: "Diterpène",
        },
        product: {
          name: "Acétate d'incensole",
          casNumber: "77658-08-3",
          formula: "C₂₂H₃₆O₂",
          class: "Ester diterpénique",
        },
        conditions: "Oxydation atmosphérique, 12–36 mois",
        olfactoryImpact: "Gain de notes boisées-laiteuses, fixation accrue",
      },
    ],
  },

  // ── CANNABIS / HASHISH ────────────────────────────────────────────────────
  {
    id: "cannabis_resin",
    name: "Résine de Cannabis (Hashish)",
    latinName: "Cannabis sativa / indica",
    category: "cannabis",
    origin: ["Maroc", "Afghanistan", "Liban", "Inde", "Népal"],
    description:
      "La résine de cannabis (hashish) est un concentré de trichomes. Son profil terpénique évolue radicalement pendant le vieillissement par isomérisation, oxydation et formation de nouveaux composés comme le hashishène.",
    keyMolecules: ["β-Myrcène", "α-Pinène", "Limonène", "β-Caryophyllène", "Hashishène", "Linalol"],
    maturationType: "Isomérisation photo-induite + oxydation + décarboxylation cannabinoïde",
    timelineMonths: 60,
    olfactoryEvolution: {
      fresh: "Herbacé, citronné, légèrement épicé, vert",
      aged: "Terreux profond, épicé-boisé, notes de sous-bois, complexité accrue",
      burned: "Fumé complexe, épicé, notes de bois brûlé, phénolique",
    },
    color: { fresh: "Vert-brun", aged: "Brun foncé à noir" },
    transformations: [
      {
        id: "cannabis-t1",
        process: "isomerization",
        processLabel: "Isomérisation photo-induite",
        precursor: {
          name: "β-Myrcène",
          casNumber: "123-35-3",
          formula: "C₁₀H₁₆",
          class: "Monoterpène acyclique",
        },
        product: {
          name: "Hashishène",
          casNumber: "16626-39-4",
          formula: "C₁₀H₁₆",
          class: "Monoterpène cyclique (cyclopropane)",
        },
        conditions: "Exposition à la lumière UV, température ambiante, 3–12 mois",
        olfactoryImpact: "Apparition de la note 'hash' caractéristique — terreux, épicé, profond",
        notes:
          "Le hashishène est formé par réarrangement photo-induit du myrcène. C'est le marqueur chimique du hashish vieilli. Découvert par Marchini (2014).",
        references: ["Marchini, 2014", "EarthWolf Farms / Trichome Research Institute, 2021"],
      },
      {
        id: "cannabis-t2",
        process: "isomerization",
        processLabel: "Isomérisation thermique",
        precursor: {
          name: "α-Pinène",
          casNumber: "80-56-8",
          formula: "C₁₀H₁₆",
          class: "Monoterpène bicyclique",
        },
        product: {
          name: "Camphène",
          casNumber: "79-92-5",
          formula: "C₁₀H₁₆",
          class: "Monoterpène bicyclique",
        },
        conditions: "Températures élevées lors du pressage ou stockage chaud",
        olfactoryImpact: "Perte de fraîcheur résineuse, gain de notes camphrées",
        references: ["Terpenebelt Farms, 2025"],
      },
      {
        id: "cannabis-t3",
        process: "oxidation",
        processLabel: "Oxydation",
        precursor: {
          name: "Limonène",
          casNumber: "5989-27-5",
          formula: "C₁₀H₁₆",
          class: "Monoterpène monocyclique",
        },
        product: {
          name: "Limonène diépoxyde",
          casNumber: "96-08-2",
          formula: "C₁₀H₁₆O₂",
          class: "Époxyde terpénique",
        },
        conditions: "Contact avec l'air, lumière, 6–24 mois",
        olfactoryImpact: "Perte de fraîcheur citronnée, gain de notes terreuses-oxydées",
        references: ["Terpene Degradation in Cannabis, Encore Labs 2025"],
      },
      {
        id: "cannabis-t4",
        process: "decarboxylation",
        processLabel: "Décarboxylation",
        precursor: {
          name: "THCA (Δ9-tétrahydrocannabinolique)",
          formula: "C₂₂H₃₀O₄",
          class: "Cannabinoïde acide",
        },
        product: {
          name: "THC (Δ9-tétrahydrocannabinol)",
          formula: "C₂₁H₃₀O₂",
          class: "Cannabinoïde neutre",
        },
        conditions: "Chaleur (>100°C) ou vieillissement très lent (années)",
        olfactoryImpact: "Pas d'impact olfactif direct, mais modification du profil pharmacologique",
        notes: "La décarboxylation est la transformation principale lors de la combustion ou vaporisation",
        references: ["Razdan et al., 1970", "Lindholst, 2010"],
      },
      {
        id: "cannabis-t5",
        process: "oxidation",
        processLabel: "Oxydation cannabinoïde",
        precursor: {
          name: "THC (Δ9-tétrahydrocannabinol)",
          formula: "C₂₁H₃₀O₂",
          class: "Cannabinoïde",
        },
        product: {
          name: "CBN (Cannabinol)",
          formula: "C₂₁H₂₆O₂",
          class: "Cannabinoïde oxydé",
        },
        conditions: "Exposition à l'air et à la lumière, 6–36 mois",
        olfactoryImpact: "Légère modification des notes — le CBN contribue aux notes 'hash vieilli'",
        notes: "Le ratio THC/CBN est utilisé comme indicateur d'âge forensique du cannabis",
        references: ["Elsohly et al., 1992", "EarthWolf Farms, 2021"],
      },
      {
        id: "cannabis-t6",
        process: "cyclization",
        processLabel: "Cyclisation",
        precursor: {
          name: "β-Caryophyllène",
          casNumber: "87-44-5",
          formula: "C₁₅H₂₄",
          class: "Sesquiterpène",
        },
        product: {
          name: "Oxyde de caryophyllène",
          casNumber: "1139-30-6",
          formula: "C₁₅H₂₄O",
          class: "Époxyde sesquiterpénique",
        },
        conditions: "Oxydation atmosphérique, 3–18 mois",
        olfactoryImpact: "Gain de notes terreuses-boisées, légèrement épicées",
        notes: "L'oxyde de caryophyllène est le composé détecté par les chiens renifleurs",
        references: ["Comprehensive analysis, 2024"],
      },
    ],
  },

  // ── COPAL ─────────────────────────────────────────────────────────────────
  {
    id: "copal",
    name: "Copal",
    latinName: "Bursera / Protium spp.",
    category: "resine_brute",
    origin: ["Mexique", "Guatemala", "Colombie", "Brésil"],
    description:
      "Résine sacrée mésoaméricaine, équivalent amérindien de l'encens. Riche en monoterpènes, elle évolue vers des notes plus boisées et ambrées avec le vieillissement.",
    keyMolecules: ["α-Pinène", "Limonène", "Sabinène", "β-Caryophyllène", "p-Cymène"],
    maturationType: "Polymérisation résineuse + oxydation monoterpénique",
    timelineMonths: 36,
    olfactoryEvolution: {
      fresh: "Citronné, résineux frais, légèrement herbacé",
      aged: "Boisé profond, ambré, légèrement vanillé",
      burned: "Fumé citronné, résineux chaud, notes de pin brûlé",
    },
    color: { fresh: "Blanc à jaune pâle", aged: "Jaune ambré" },
    transformations: [
      {
        id: "copal-t1",
        process: "polymerization",
        processLabel: "Polymérisation",
        precursor: {
          name: "Monoterpènes (α-Pinène, Limonène)",
          class: "Monoterpènes",
        },
        product: {
          name: "Polymères résineux",
          class: "Résine polymère",
        },
        conditions: "Vieillissement prolongé, chaleur, pression",
        olfactoryImpact: "Réduction des notes volatiles fraîches, gain de profondeur et de fixité",
        notes: "La polymérisation est responsable du durcissement progressif du copal",
        references: ["Steigenberger, 2013"],
      },
      {
        id: "copal-t2",
        process: "oxidation",
        processLabel: "Oxydation",
        precursor: {
          name: "α-Pinène",
          casNumber: "80-56-8",
          formula: "C₁₀H₁₆",
          class: "Monoterpène",
        },
        product: {
          name: "Verbénol",
          casNumber: "473-67-6",
          formula: "C₁₀H₁₆O",
          class: "Alcool monoterpénique",
        },
        conditions: "Oxydation atmosphérique, 6–24 mois",
        olfactoryImpact: "Apparition de notes florales-herbacées sur fond résineux",
        references: ["Bio-oxidation of terpenes, 2009"],
      },
    ],
  },

  // ── ÉLEMI ─────────────────────────────────────────────────────────────────
  {
    id: "elemi",
    name: "Élemi",
    latinName: "Canarium luzonicum",
    category: "oleoresine",
    origin: ["Philippines", "Indonésie"],
    description:
      "Oléorésine fraîche et citronnée des Philippines. Très riche en limonène et myrcène, elle évolue rapidement vers des notes plus boisées et épicées.",
    keyMolecules: ["Limonène", "Myrcène", "Linalol", "Camphène", "β-Caryophyllène"],
    maturationType: "Oxydation rapide des monoterpènes",
    timelineMonths: 12,
    olfactoryEvolution: {
      fresh: "Citronné vif, légèrement épicé, résineux frais",
      aged: "Boisé-épicé, moins citronné, plus profond",
      burned: "Encensé citronné, fumé léger",
    },
    color: { fresh: "Blanc laiteux", aged: "Jaune pâle" },
    transformations: [
      {
        id: "elemi-t1",
        process: "oxidation",
        processLabel: "Oxydation",
        precursor: {
          name: "Limonène",
          casNumber: "5989-27-5",
          formula: "C₁₀H₁₆",
          class: "Monoterpène monocyclique",
        },
        product: {
          name: "Carvone",
          casNumber: "99-49-0",
          formula: "C₁₀H₁₄O",
          class: "Cétone monoterpénique",
        },
        conditions: "Oxydation atmosphérique, 3–12 mois",
        olfactoryImpact: "Apparition de notes de menthe-carvi sur fond citronné",
        references: ["Bio-oxidation of terpenes, 2009"],
      },
    ],
  },

  // ── GALBANUM ──────────────────────────────────────────────────────────────
  {
    id: "galbanum",
    name: "Galbanum",
    latinName: "Ferula galbaniflua",
    category: "gomme_resine",
    origin: ["Iran", "Afghanistan", "Turquie"],
    description:
      "Gomme-résine verte et piquante de la famille des Apiacées. Très riche en α-pinène et monoterpènes, elle est l'une des résines les plus volatiles et évolue rapidement.",
    keyMolecules: ["α-Pinène", "Myrcène", "Carvone", "β-Pinène", "Umbelliferone"],
    maturationType: "Oxydation rapide + polymérisation",
    timelineMonths: 12,
    olfactoryEvolution: {
      fresh: "Vert intense, piquant, résineux frais, légèrement citronné",
      aged: "Moins vert, plus boisé-résineux, légèrement musqué",
      burned: "Fumé vert, résineux, légèrement phénolique",
    },
    color: { fresh: "Vert-brun", aged: "Brun foncé" },
    transformations: [
      {
        id: "galbanum-t1",
        process: "oxidation",
        processLabel: "Oxydation",
        precursor: {
          name: "α-Pinène",
          casNumber: "80-56-8",
          formula: "C₁₀H₁₆",
          class: "Monoterpène",
        },
        product: {
          name: "Myrtenol",
          casNumber: "515-00-4",
          formula: "C₁₀H₁₆O",
          class: "Alcool monoterpénique",
        },
        conditions: "Oxydation atmosphérique, 3–9 mois",
        olfactoryImpact: "Gain de notes florales-herbacées, perte de la note verte piquante",
        references: ["Bio-oxidation of terpenes, 2009"],
      },
    ],
  },
];

// ─── Procédures tRPC ─────────────────────────────────────────────────────────

export const resinMaturationRouter = router({
  // Retourne tous les profils de résines
  getResinProfiles: publicProcedure.query(async () => {
    return RESIN_PROFILES;
  }),

  // Retourne un profil de résine par ID
  getResinById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const profile = RESIN_PROFILES.find((r) => r.id === input.id);
      if (!profile) throw new Error(`Résine non trouvée: ${input.id}`);
      return profile;
    }),

  // Retourne les transformations filtrées par processus
  getTransformationsByProcess: publicProcedure
    .input(z.object({ process: z.string() }))
    .query(async ({ input }) => {
      const results: Array<{ resin: string; transformation: ChemicalTransformation }> = [];
      for (const profile of RESIN_PROFILES) {
        for (const t of profile.transformations) {
          if (t.process === input.process) {
            results.push({ resin: profile.name, transformation: t });
          }
        }
      }
      return results;
    }),

  // Résout les IDs de molécules depuis la base PERFUMUM
  resolveMoleculeIds: publicProcedure
    .input(z.object({ resinId: z.string() }))
    .query(async ({ input }) => {
      const profile = RESIN_PROFILES.find((r) => r.id === input.resinId);
      if (!profile) return { molecules: [], plants: [] };

      const db = await getDb();
      if (!db) return { molecules: [], plants: [] };

      // Chercher la plante dans la DB
      const dbPlants = await db
        .select({ id: plants.id, name: plants.name, latinName: plants.latinName })
        .from(plants)
        .where(
          or(
            like(plants.latinName, `%${profile.latinName.split("/")[0].trim()}%`),
            like(plants.name, `%${profile.name.split(" ")[0]}%`)
          )
        )
        .limit(3);

      // Chercher les molécules clés dans la DB
      const molNames = [
        ...profile.keyMolecules,
        ...profile.transformations.map((t) => t.precursor.name),
        ...profile.transformations.map((t) => t.product.name),
      ].filter((n) => n && n.length > 3);

      const uniqueNames = [...new Set(molNames)];

      const dbMolecules = await db
        .select({
          id: molecules.id,
          name: molecules.name,
          casNumber: molecules.casNumber,
          chemicalClass: molecules.chemicalClass,
        })
        .from(molecules)
        .where(
          or(...uniqueNames.slice(0, 20).map((n) => like(molecules.name, `%${n.split(" ")[0]}%`)))
        )
        .limit(30);

      return {
        molecules: dbMolecules,
        plants: dbPlants,
      };
    }),

  // Tableau comparatif : toutes les résines × tous les processus
  getComparisonMatrix: publicProcedure.query(async () => {
    const processes: TransformationProcess[] = [
      "isomerization",
      "oxidation",
      "pyrolysis",
      "fermentation",
      "hydrolysis",
      "distillation",
      "polymerization",
      "decarboxylation",
      "cyclization",
    ];

      return RESIN_PROFILES.map((profile) => {
      const row: Record<string, boolean | string | number> = {
        resinId: profile.id,
        resinName: profile.name,
        category: profile.category,
        timelineMonths: profile.timelineMonths ?? 0,
      };
      for (const p of processes) {
        row[p] = profile.transformations.some((t) => t.process === p);
      }
      return row;
    });
  }),
});
