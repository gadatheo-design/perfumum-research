import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { getDb } from "../db/core";
import { molecules, plants } from "../../drizzle/schema";
import { like, or, eq } from "drizzle-orm";

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

  // ── OUD (AGARWOOD) ──────────────────────────────────────────────
  {
    id: "oud",
    name: "Oud (Agarwood)",
    latinName: "Aquilaria malaccensis / sinensis / crassna",
    category: "resine_brute",
    origin: ["Inde","Cambodge","Malaisie","Indonésie","Laos"],
    description: "Résine pathologique formée dans le bois d'Aquilaria en réponse à une infection fongique (Phialophora parasitica). L'une des matières premières les plus rares et coûteuses au monde, le oud développe une chimie extraordinairement complexe au fil du vieillissement.",
    keyMolecules: ["Agarofuran","Agarospirane","Guaiol","2-(2-Phényléthyl)chromone","Jinkohol","α-Agarofuran"],
    maturationType: "Oxydation sesquiterpénique + cyclisation + formation de chromones",
    timelineMonths: 120,
    olfactoryEvolution: {
      fresh: "Boisé vert, légèrement terreux, résineux",
      aged: "Animal, cuiré, boisé profond, encensé, notes de tabac",
      burned: "Fumé sacré, boisé intense, phénolique, notes de cuir et d'ambre",
    },
    color: { fresh: "Brun-noir", aged: "Noir profond" },
    transformations: [
      {
        id: "oud-t1",
        process: "oxidation",
        processLabel: "Oxydation",
        precursor: {
          name: "Guaiol",
          casNumber: "489-86-1",
          formula: "C₁₅H₂₆O",
          class: "Sesquiterpène alcool",
        },
        product: {
          name: "Bulnesol",
          casNumber: "22451-73-6",
          formula: "C₁₅H₂₆O",
          class: "Sesquiterpène alcool isomère",
        },
        conditions: "Vieillissement naturel, 12–60 mois, contact air",
        olfactoryImpact: "Transition du boisé frais vers des notes plus profondes, animales et cuirées",
        notes: "L'isomérisation du guaiol en bulnesol est caractéristique du oud vieilli",
        references: ["Yang et al., Molecules 2021","Gao et al., PMC 2019"],
      },
      {
        id: "oud-t2",
        process: "cyclization",
        processLabel: "Cyclisation",
        precursor: {
          name: "Sesquiterpène acyclique",
          formula: "C₁₅H₂₄",
          class: "Sesquiterpène",
        },
        product: {
          name: "Agarofuran",
          casNumber: "1460-97-5",
          formula: "C₁₅H₂₆O",
          class: "Sesquiterpène furanoisé",
        },
        conditions: "Infection fongique, vieillissement 5–10 ans",
        olfactoryImpact: "Apparition des notes animales, cuirées et boisées profondes caractéristiques du oud",
        notes: "La formation d'agarofuran est le marqueur chimique du oud authentique",
        references: ["Gao et al., PMC 2019","Chen et al., 2022"],
      },
      {
        id: "oud-t3",
        process: "pyrolysis",
        processLabel: "Pyrolyse",
        precursor: {
          name: "2-(2-Phényléthyl)chromone",
          formula: "C₁₇H₁₄O₂",
          class: "Chromone",
        },
        product: {
          name: "Phényléthanol",
          casNumber: "60-12-8",
          formula: "C₈H₁₀O",
          class: "Alcool aromatique",
        },
        conditions: "Combustion partielle (300–500°C)",
        olfactoryImpact: "Notes rosées, mielleuses et florales dans la fumée de oud",
        references: ["Ahmed & Kulkarni, 2017","Wang et al., PMC 2018"],
      },
    ],
  },

  // ── RÉSINE DE PIN (COLOPHANE) ───────────────────────────────────
  {
    id: "pin",
    name: "Résine de Pin (Colophane)",
    latinName: "Pinus sylvestris / pinaster / palustris",
    category: "oleoresine",
    origin: ["Europe","Amérique du Nord","Asie"],
    description: "L'oléorésine de pin est composée de térébenthine (fraction volatile) et de colophane (fraction fixe). L'acide abiétique, principal composant de la colophane, subit une oxydation progressive qui modifie profondément le profil olfactif.",
    keyMolecules: ["α-Pinène","β-Pinène","Acide abiétique","Acide déhydroabiétique","3-Carène"],
    maturationType: "Oxydation de l'acide abiétique + isomérisation des monoterpènes",
    timelineMonths: 18,
    olfactoryEvolution: {
      fresh: "Pin frais, térébenthine, boisé vif, légèrement camphré",
      aged: "Boisé sec, moins frais, notes de résine sèche, légèrement rance",
      burned: "Fumé boisé, phénolique, notes de goudron, encens de forêt",
    },
    color: { fresh: "Jaune pâle à ambre clair", aged: "Ambre foncé à brun" },
    transformations: [
      {
        id: "pin-t1",
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
        conditions: "Stockage à température ambiante, 3–18 mois",
        olfactoryImpact: "Apparition de notes citronnées dans la térébenthine vieillie",
        notes: "Réaction de Wagner-Meerwein, catalysée par les acides résiduels",
        references: ["Beltran Sanchidrian, 2016","Sarria-Villa et al., PMC 2021"],
      },
      {
        id: "pin-t2",
        process: "oxidation",
        processLabel: "Oxydation",
        precursor: {
          name: "Acide abiétique",
          casNumber: "514-10-3",
          formula: "C₂₀H₃₀O₂",
          class: "Acide diterpénique",
        },
        product: {
          name: "Acide déhydroabiétique",
          casNumber: "1740-19-8",
          formula: "C₂₀H₂₈O₂",
          class: "Acide diterpénique oxydé",
        },
        conditions: "Oxydation atmosphérique, 6–18 mois, lumière UV",
        olfactoryImpact: "Perte de la fraîcheur résineuse, gain de notes sèches et légèrement rances",
        notes: "Marqueur du vieillissement de la colophane, utilisé en restauration d'art",
        references: ["Beltran Sanchidrian, 2016","ACS Anal. Chem. 2017"],
      },
      {
        id: "pin-t3",
        process: "pyrolysis",
        processLabel: "Pyrolyse",
        precursor: {
          name: "Acide abiétique",
          casNumber: "514-10-3",
          formula: "C₂₀H₃₀O₂",
          class: "Acide diterpénique",
        },
        product: {
          name: "Phénol",
          casNumber: "108-95-2",
          formula: "C₆H₆O",
          class: "Phénol",
        },
        conditions: "Pyrolyse (300–600°C), combustion de résine de pin",
        olfactoryImpact: "Notes de goudron, fumé de forêt, phénolique",
        references: ["Kim et al., 2019","Mo et al., 2024"],
      },
    ],
  },

  // ── MASTIC (PISTACHIER LENTISQUE) ───────────────────────────────
  {
    id: "mastic",
    name: "Mastic (Pistachier lentisque)",
    latinName: "Pistacia lentiscus var. Chia",
    category: "resine_brute",
    origin: ["Grèce (île de Chios)","Méditerranée"],
    description: "Résine cristalline produite exclusivement par le pistachier lentisque de l'île de Chios. Composée à 65–70% de triterpènes (acide masticadiènoïque, acide isomasticadiènoïque), elle vieillit en développant des notes balsamiques et boisées profondes.",
    keyMolecules: ["Acide masticadiènoïque","Acide isomasticadiènoïque","α-Pinène","Myrcène","Linalol"],
    maturationType: "Oxydation triterpénique + polymérisation",
    timelineMonths: 24,
    olfactoryEvolution: {
      fresh: "Frais, légèrement citronné, résineux, herbacé",
      aged: "Balsamique, boisé, légèrement sucré, notes de cèdre",
      burned: "Encensé doux, balsamique chaud, légèrement fumé",
    },
    color: { fresh: "Blanc cristallin translucide", aged: "Jaune-ambre" },
    transformations: [
      {
        id: "mastic-t1",
        process: "oxidation",
        processLabel: "Oxydation",
        precursor: {
          name: "Acide masticadiènoïque",
          casNumber: "471-77-2",
          formula: "C₃₀H₄₆O₂",
          class: "Acide triterpénique",
        },
        product: {
          name: "Acide masticadiènoïque oxydé",
          formula: "C₃₀H₄₆O₃",
          class: "Acide triterpénique hydroxylé",
        },
        conditions: "Vieillissement naturel, 6–24 mois, lumière et air",
        olfactoryImpact: "Évolution vers des notes plus douces, balsamiques et boisées",
        notes: "L'oxydation des triterpènes est le principal mécanisme de vieillissement du mastic de Chios",
        references: ["Pachi et al., Processes 2021","EMA Assessment Report 2015"],
      },
      {
        id: "mastic-t2",
        process: "polymerization",
        processLabel: "Polymérisation",
        precursor: {
          name: "Poly-β-myrcène (fraction polymère)",
          formula: "(C₁₀H₁₆)ₙ",
          class: "Polyterpène",
        },
        product: {
          name: "Polymère réticulé",
          formula: "(C₁₀H₁₆)ₙ réticulé",
          class: "Résine durcie",
        },
        conditions: "Vieillissement naturel, 12–36 mois",
        olfactoryImpact: "Durcissement de la résine, fixation des notes balsamiques",
        notes: "La fraction polymère du mastic (poly-β-myrcène) se réticulé progressivement",
        references: ["Pachi et al., Processes 2021"],
      },
      {
        id: "mastic-t3",
        process: "pyrolysis",
        processLabel: "Pyrolyse",
        precursor: {
          name: "α-Pinène",
          casNumber: "80-56-8",
          formula: "C₁₀H₁₆",
          class: "Monoterpène",
        },
        product: {
          name: "p-Cymène",
          casNumber: "99-87-6",
          formula: "C₁₀H₁₄",
          class: "Monoterpène aromatique",
        },
        conditions: "Combustion (200–400°C)",
        olfactoryImpact: "Notes herbacées-épicées dans la fumée de mastic",
        references: ["Pachi et al., Processes 2021"],
      },
    ],
  },

  // ── DAMMAR ──────────────────────────────────────────────────────
  {
    id: "dammar",
    name: "Dammar",
    latinName: "Shorea javanica / Hopea spp.",
    category: "resine_brute",
    origin: ["Indonésie","Malaisie","Inde"],
    description: "Résine triterpénique produite par les diptérocarpes d'Asie du Sud-Est. Très utilisée en restauration d'art comme vernis, le dammar vieillit en jaunissant et en développant des composés polaires par oxydation des triterpènes.",
    keyMolecules: ["Acide dammarolique","Dammaradienol","Dammarenediol","Ursolol","Oléanolol"],
    maturationType: "Oxydation triterpénique + jaunissement (photo-oxydation)",
    timelineMonths: 36,
    olfactoryEvolution: {
      fresh: "Légèrement boisé, doux, presque inodore",
      aged: "Boisé sec, légèrement musqué, notes de vieux papier",
      burned: "Encensé doux, boisé, légèrement sucré",
    },
    color: { fresh: "Blanc à jaune pâle", aged: "Jaune-ambre à brun" },
    transformations: [
      {
        id: "dammar-t1",
        process: "oxidation",
        processLabel: "Photo-oxydation",
        precursor: {
          name: "Dammaradienol",
          casNumber: "560-03-2",
          formula: "C₃₀H₅₀O",
          class: "Triterpène alcool",
        },
        product: {
          name: "Dammaradienone",
          casNumber: "2239-96-5",
          formula: "C₃₀H₄₈O",
          class: "Triterpène cétone",
        },
        conditions: "Exposition UV, 6–36 mois",
        olfactoryImpact: "Jaunissement et apparition de notes légèrement rances et musquées",
        notes: "Mécanisme principal du jaunissement des vernis dammar en restauration d'art",
        references: ["van der Doelen, 1999","Pubs ACS, 2016"],
      },
      {
        id: "dammar-t2",
        process: "polymerization",
        processLabel: "Polymérisation",
        precursor: {
          name: "Fraction triterpénique monomère",
          formula: "C₃₀H₄₈O₂",
          class: "Triterpène",
        },
        product: {
          name: "Oligomères triterpéniques",
          formula: "(C₃₀H₄₈O₂)ₙ",
          class: "Oligomère résineux",
        },
        conditions: "Vieillissement naturel, 12–60 mois",
        olfactoryImpact: "Fixation des notes boisées, réduction de la volatilité",
        references: ["Pubs ACS, 2016","MFA Cameo, 2022"],
      },
    ],
  },

  // ── SANDARAQUE ──────────────────────────────────────────────────
  {
    id: "sandaraque",
    name: "Sandaraque",
    latinName: "Tetraclinis articulata",
    category: "resine_brute",
    origin: ["Maroc","Algérie","Tunisie","Malte"],
    description: "Résine diterpénique du thuya de Berbérie (Tetraclinis articulata), arbre endémique du Maghreb. Composée à ~80% d'acide sandaracopimarique, elle est utilisée depuis l'Antiquité comme vernis et encens. Son vieillissement produit des diterpènes oxydés aux notes balsamiques.",
    keyMolecules: ["Acide sandaracopimarique","Acide communique","Acide callitrique","Acide pimarique"],
    maturationType: "Oxydation diterpénique + décarboxylation partielle",
    timelineMonths: 24,
    olfactoryEvolution: {
      fresh: "Légèrement citronné, résineux frais, notes de cèdre",
      aged: "Balsamique, boisé sec, légèrement phénolique",
      burned: "Encensé doux, boisé, légèrement fumé, notes de résine sèche",
    },
    color: { fresh: "Jaune pâle translucide", aged: "Ambre doré" },
    transformations: [
      {
        id: "sandaraque-t1",
        process: "oxidation",
        processLabel: "Oxydation",
        precursor: {
          name: "Acide sandaracopimarique",
          casNumber: "471-74-9",
          formula: "C₂₀H₃₀O₂",
          class: "Acide diterpénique",
        },
        product: {
          name: "Acide sandaracopimarique oxydé",
          formula: "C₂₀H₃₀O₃",
          class: "Acide diterpénique hydroxylé",
        },
        conditions: "Vieillissement naturel, 6–24 mois",
        olfactoryImpact: "Évolution vers des notes balsamiques et boisées plus profondes",
        notes: "L'acide sandaracopimarique représente ~80% de la composition de la sandaraque",
        references: ["HAL Science, 2018","PMC 2016"],
      },
      {
        id: "sandaraque-t2",
        process: "decarboxylation",
        processLabel: "Décarboxylation",
        precursor: {
          name: "Acide communique",
          casNumber: "2752-65-0",
          formula: "C₂₀H₃₀O₂",
          class: "Acide diterpénique",
        },
        product: {
          name: "Communol",
          formula: "C₂₀H₃₂O",
          class: "Diterpène alcool",
        },
        conditions: "Chaleur (>150°C) ou vieillissement prolongé",
        olfactoryImpact: "Apparition de notes boisées plus sèches et moins acides",
        references: ["HAL Science, 2018"],
      },
      {
        id: "sandaraque-t3",
        process: "pyrolysis",
        processLabel: "Pyrolyse",
        precursor: {
          name: "Acide sandaracopimarique",
          casNumber: "471-74-9",
          formula: "C₂₀H₃₀O₂",
          class: "Acide diterpénique",
        },
        product: {
          name: "Guaïacol",
          casNumber: "90-05-1",
          formula: "C₇H₈O₂",
          class: "Phénol méthoxylé",
        },
        conditions: "Combustion (200–500°C)",
        olfactoryImpact: "Notes fumées, phénoliques, légèrement médicinales dans l'encens de sandaraque",
        references: ["HAL Science, 2018","Frontiers Pharmacol. 2022"],
      },
    ],
  },

  // ── OLIBAN DE SOMALIE (BOSWELLIA CARTERII) ──────────────────────
  {
    id: "encens_somalilande",
    name: "Oliban de Somalie (Boswellia carterii)",
    latinName: "Boswellia carterii",
    category: "gomme_resine",
    origin: ["Somalie","Éthiopie","Érythrée"],
    description: "Variété d'oliban somalien, distincte de l'oliban sacré (B. sacra). Riche en acides boswelliques et en incensole acétate, elle présente une composition légèrement différente avec davantage de monoterpènes. Très utilisée dans la parfumerie contemporaine.",
    keyMolecules: ["Acide boswellique α","Acide boswellique β","Incensole acétate","α-Pinène","Limonène","p-Cymène"],
    maturationType: "Oxydation des acides boswelliques + hydrolyse de l'incensole acétate",
    timelineMonths: 18,
    olfactoryEvolution: {
      fresh: "Citronné, légèrement camphré, résineux frais, notes vertes",
      aged: "Balsamique, boisé, encensé, notes de citrus atténuées",
      burned: "Encensé profond, légèrement citronné, boisé, notes de miel",
    },
    color: { fresh: "Blanc laiteux à jaune pâle", aged: "Ambre doré" },
    transformations: [
      {
        id: "enc_som-t1",
        process: "hydrolysis",
        processLabel: "Hydrolyse",
        precursor: {
          name: "Incensole acétate",
          casNumber: "25312-20-3",
          formula: "C₂₂H₃₄O₃",
          class: "Diterpène ester",
        },
        product: {
          name: "Incensole",
          casNumber: "25312-19-0",
          formula: "C₂₀H₃₂O₂",
          class: "Diterpène alcool",
        },
        conditions: "Hydrolyse enzymatique ou humidité, 6–18 mois",
        olfactoryImpact: "Évolution vers des notes plus douces, moins camphrées",
        notes: "L'incensole acétate est le marqueur psychoactif de l'oliban, son hydrolyse modifie les propriétés",
        references: ["Moussaieff et al., 2008","PMC 2022"],
      },
      {
        id: "enc_som-t2",
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
        conditions: "Oxydation atmosphérique, 3–12 mois",
        olfactoryImpact: "Atténuation des notes citronnées, gain de notes florales-herbacées",
        references: ["PMC 2022"],
      },
    ],
  },

  // ── KYARA (OUD DE QUALITÉ SUPRÊME) ──────────────────────────────
  {
    id: "agarwood_kyara",
    name: "Kyara (Oud de qualité suprême)",
    latinName: "Aquilaria sinensis — grade Kyara",
    category: "resine_brute",
    origin: ["Vietnam","Cambodge"],
    description: "Le kyara est le grade le plus rare et le plus précieux du oud, caractérisé par une concentration exceptionnelle en chromones et en sesquiterpènes oxygénés. Formé après des décennies de vieillissement naturel, il représente l'aboutissement chimique du processus de maturation de l'agarwood.",
    keyMolecules: ["2-(2-Phényléthyl)chromone","Agarofuran","Jinkohol II","Kusunol","Agarospirane"],
    maturationType: "Accumulation de chromones + oxydation sesquiterpénique avancée",
    timelineMonths: 240,
    olfactoryEvolution: {
      fresh: "N/A (le kyara n'existe qu'à l'état vieilli)",
      aged: "Doux, crémeux, boisé profond, légèrement sucré, notes de lait et de bois de santal",
      burned: "Sacré, doux-fumé, crémeux, notes de miel et de bois précieux",
    },
    color: { fresh: "N/A", aged: "Noir profond, presque métallique" },
    transformations: [
      {
        id: "kyara-t1",
        process: "cyclization",
        processLabel: "Cyclisation avancée",
        precursor: {
          name: "Sesquiterpène linéaire",
          formula: "C₁₅H₂₄",
          class: "Sesquiterpène",
        },
        product: {
          name: "Kusunol",
          casNumber: "473-08-5",
          formula: "C₁₅H₂₄O",
          class: "Sesquiterpène alcool bicyclique",
        },
        conditions: "Vieillissement 10–50 ans, conditions anaérobies partielles",
        olfactoryImpact: "Développement des notes crémeuses et douces caractéristiques du kyara",
        notes: "Le kusunol est un marqueur chimique du kyara, absent dans les grades inférieurs",
        references: ["Ouddict Discussion, 2024","Wang et al., PMC 2018"],
      },
      {
        id: "kyara-t2",
        process: "oxidation",
        processLabel: "Accumulation de chromones",
        precursor: {
          name: "Précurseur phénylpropanoïde",
          formula: "C₉H₁₀O₂",
          class: "Phénylpropanoïde",
        },
        product: {
          name: "2-(2-Phényléthyl)chromone",
          formula: "C₁₇H₁₄O₂",
          class: "Chromone",
        },
        conditions: "Biosynthèse enzymatique + vieillissement 20–50 ans",
        olfactoryImpact: "Développement de la douceur et de la complexité caractéristiques du kyara",
        notes: "Les chromones augmentent continuellement pendant les 6 premiers mois de formation, puis se stabilisent",
        references: ["Sun et al., Frontiers Plant Science 2024"],
      },
    ],
  },

  // ── COPAL BLANC (MEXIQUE) ───────────────────────────────────────
  {
    id: "copal_blanc",
    name: "Copal Blanc (Mexique)",
    latinName: "Bursera bipinnata / B. copallifera",
    category: "resine_brute",
    origin: ["Mexique","Guatemala","Honduras"],
    description: "Résine sacrée des civilisations mésoaméricaines, le copal blanc est produit par diverses espèces de Bursera. Riche en triterpènes et en monoterpènes, il est utilisé depuis des millénaires dans les rituels aztèques et mayas. Sa combustion produit une fumée blanche dense aux notes citronnées et balsamiques.",
    keyMolecules: ["α-Pinène","Limonène","Acide briarélique","Incensol","β-Caryophyllène"],
    maturationType: "Oxydation monoterpénique + polymérisation",
    timelineMonths: 12,
    olfactoryEvolution: {
      fresh: "Citronné, légèrement sucré, résineux frais, notes de pin",
      aged: "Balsamique, boisé, légèrement vanillé",
      burned: "Encensé doux, citronné, fumé blanc, notes de miel",
    },
    color: { fresh: "Blanc laiteux à translucide", aged: "Jaune pâle" },
    transformations: [
      {
        id: "copal_blanc-t1",
        process: "oxidation",
        processLabel: "Oxydation",
        precursor: {
          name: "α-Pinène",
          casNumber: "80-56-8",
          formula: "C₁₀H₁₆",
          class: "Monoterpène",
        },
        product: {
          name: "Verbenone",
          casNumber: "80-57-9",
          formula: "C₁₀H₁₄O",
          class: "Cétone monoterpénique",
        },
        conditions: "Oxydation atmosphérique, 3–12 mois",
        olfactoryImpact: "Apparition de notes camphrées-herbacées sur fond résineux",
        references: ["Bio-oxidation of terpenes, 2009"],
      },
      {
        id: "copal_blanc-t2",
        process: "pyrolysis",
        processLabel: "Pyrolyse",
        precursor: {
          name: "Limonène",
          casNumber: "5989-27-5",
          formula: "C₁₀H₁₆",
          class: "Monoterpène",
        },
        product: {
          name: "p-Cymène",
          casNumber: "99-87-6",
          formula: "C₁₀H₁₄",
          class: "Monoterpène aromatique",
        },
        conditions: "Combustion (200–400°C)",
        olfactoryImpact: "Notes herbacées-épicées dans la fumée de copal",
        references: ["Bio-oxidation of terpenes, 2009"],
      },
    ],
  },

  // ─── Styrax (Liquidambar orientalis / Styrax benzoin var. paralleloneurum) ───
  {
    id: "styrax",
    name: "Styrax / Liquidambar",
    latinName: "Liquidambar orientalis / Styrax benzoin var. paralleloneurum",
    category: "baume",
    origin: ["Turquie", "Sumatra (Indonésie)"],
    description: "Le styrax désigne deux matières distinctes : la résine liquide de Liquidambar orientalis (styrax liquide, baume de storax) et le benjoin de Sumatra var. paralleloneurum. Riche en cinnamates et en phénylpropanoïdes, il développe des notes balsamiques profondes, fumées et légèrement phénoliques au vieillissement.",
    keyMolecules: ["Acide cinnamique", "Cinnamaldéhyde", "Styrène", "Phénylpropanol", "Guaïacol", "Créosol", "Vanilline", "Acide benzoïque"],
    maturationType: "Hydrolyse estérique + pyrolyse phénolique",
    timelineMonths: 24,
    olfactoryEvolution: {
      fresh: "Balsamique doux, légèrement phénolique, notes de cannelle",
      aged: "Fumé, balsamique profond, notes de cuir et de vanille",
      burned: "Phénolique intense, créosol, guaïacol, fumée douce",
    },
    color: { fresh: "Blanc laiteux à jaune pâle", aged: "Ambre brun" },
    transformations: [
      {
        id: "styrax-hydrolysis-1",
        process: "hydrolysis",
        processLabel: "Hydrolyse estérique",
        precursor: { name: "Cinnamyl cinnamate", class: "Ester cinnamique" },
        product: { name: "Acide cinnamique + Alcool cinnamique", class: "Acide phénylpropanoïde" },
        conditions: "Humidité, chaleur, 6–12 mois",
        olfactoryImpact: "Libération des notes balsamiques-épicées de cannelle",
        references: ["Composition of Liquidambar orientalis resin, Phytochem. 2003"],
      },
      {
        id: "styrax-pyrolysis-1",
        process: "pyrolysis",
        processLabel: "Pyrolyse décarboxylante",
        precursor: { name: "Acide cinnamique", casNumber: "140-10-3", formula: "C₉H₈O₂" },
        product: { name: "Styrène", casNumber: "100-42-5", formula: "C₈H₈" },
        conditions: "Combustion > 250°C",
        olfactoryImpact: "Apparition du styrène — note balsamique-plastique caractéristique",
        references: ["Pyrolysis of cinnamic acid, J. Anal. Appl. Pyrolysis 2001"],
      },
      {
        id: "styrax-pyrolysis-2",
        process: "pyrolysis",
        processLabel: "Pyrolyse phénolique",
        precursor: { name: "Phénylpropanoïdes", class: "Phénylpropanoïde" },
        product: { name: "Guaïacol + Créosol", class: "Phénol méthoxyé" },
        conditions: "Combustion 300–450°C",
        olfactoryImpact: "Notes fumées-phénoliques, rappelant le goudron de bois",
        references: ["Phenolic pyrolysis products, J. Chromatogr. 2008"],
      },
      {
        id: "styrax-oxidation-1",
        process: "oxidation",
        processLabel: "Oxydation aldéhydique",
        precursor: { name: "Cinnamaldéhyde", casNumber: "104-55-2", formula: "C₉H₈O" },
        product: { name: "Acide cinnamique", casNumber: "140-10-3", formula: "C₉H₈O₂" },
        conditions: "Exposition à l'air, 3–8 mois",
        olfactoryImpact: "Transition du piquant épicé vers le balsamique doux",
        references: ["Oxidation of cinnamaldehyde, Food Chem. 2005"],
      },
    ],
  },

  // ─── Oud de Papouasie (Aquilaria filaria) ────────────────────────────────────
  {
    id: "oud-papouasie",
    name: "Oud de Papouasie",
    latinName: "Aquilaria filaria",
    dbPlantId: 1950002,
    category: "resine_brute",
    origin: ["Papouasie-Nouvelle-Guinée", "Moluques (Indonésie)"],
    description: "Aquilaria filaria produit un oud aux caractéristiques distinctives par rapport à A. malaccensis : profil plus terreux, notes animales plus prononcées, et une concentration plus élevée en chromones de type 2-(2-phényléthyl). La formation de la résine est déclenchée par une infection fongique (Phialophora parasitica) qui provoque une réponse de défense de l'arbre. Le vieillissement sur plusieurs décennies développe des notes de cuir, de tabac et d'encens.",
    keyMolecules: ["Agarofuran", "2-(2-Phényléthyl)chromone", "Guaiol", "Bulnesol", "Jinkohol", "Aquilarone", "Selina-3,11-dien-9-one", "Kusunol"],
    maturationType: "Cyclisation enzymatique (défense fongique) + accumulation de chromones",
    timelineMonths: 120,
    olfactoryEvolution: {
      fresh: "Terreux, boisé vert, légèrement animal",
      aged: "Cuiré, animal, notes de tabac et de sous-bois",
      burned: "Encensé profond, fumé, notes de cuir et d'ambre",
    },
    color: { fresh: "Bois brun clair", aged: "Brun profond à noir" },
    transformations: [
      {
        id: "oud-pap-cyclization-1",
        process: "cyclization",
        processLabel: "Cyclisation enzymatique (défense fongique)",
        precursor: { name: "Sesquiterpène acyclique", class: "Sesquiterpène" },
        product: { name: "Agarofuran", class: "Sesquiterpène bicyclique" },
        conditions: "Infection par Phialophora parasitica, 12–36 mois",
        olfactoryImpact: "Formation des notes animales et terreuses caractéristiques du oud",
        references: ["Agarwood formation in Aquilaria filaria, Phytochem. 2012"],
      },
      {
        id: "oud-pap-oxidation-1",
        process: "oxidation",
        processLabel: "Oxydation sesquiterpénique",
        precursor: { name: "Guaiol", casNumber: "489-86-1", formula: "C₁₅H₂₆O" },
        product: { name: "Bulnesol", casNumber: "22451-73-6", formula: "C₁₅H₂₆O" },
        conditions: "Vieillissement aérobie, 24–60 mois",
        olfactoryImpact: "Transition vers les notes cuirées et boisées profondes",
        references: ["Sesquiterpene oxidation in Aquilaria, Nat. Prod. Res. 2015"],
      },
      {
        id: "oud-pap-chromone-1",
        process: "cyclization",
        processLabel: "Biosynthèse des chromones",
        precursor: { name: "Phénylpropanoïde (voie shikimate)", class: "Phénylpropanoïde" },
        product: { name: "2-(2-Phényléthyl)chromone", class: "Chromone" },
        conditions: "Accumulation progressive, 36–120 mois",
        olfactoryImpact: "Développement de la douceur et de la complexité du oud de Papouasie",
        references: ["2-Phenylethylchromones in Aquilaria filaria, J. Nat. Prod. 2018"],
      },
      {
        id: "oud-pap-pyrolysis-1",
        process: "pyrolysis",
        processLabel: "Pyrolyse à la combustion",
        precursor: { name: "Chromones + sesquiterpènes", class: "Composés résineux" },
        product: { name: "Composés phénoliques volatils + furanones", class: "Phénol + Lactone" },
        conditions: "Combustion 200–400°C (encens traditionnel)",
        olfactoryImpact: "Libération de l'encensé profond, notes de cuir fumé et de tabac",
        references: ["Pyrolysis of agarwood, J. Anal. Appl. Pyrolysis 2016"],
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

      // Chercher la plante dans la DB — priorité au dbPlantId si défini
      let dbPlants;
      if (profile.dbPlantId) {
        // Lien direct via ID
        dbPlants = await db
          .select({ id: plants.id, name: plants.name, latinName: plants.latinName })
          .from(plants)
          .where(eq(plants.id, profile.dbPlantId))
          .limit(1);
      } else {
        // Fallback : recherche par nom latin ou nom commun
        dbPlants = await db
          .select({ id: plants.id, name: plants.name, latinName: plants.latinName })
          .from(plants)
          .where(
            or(
              like(plants.latinName, `%${profile.latinName.split("/")[0].trim()}%`),
              like(plants.name, `%${profile.name.split(" ")[0]}%`)
            )
          )
          .limit(3);
      }

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
