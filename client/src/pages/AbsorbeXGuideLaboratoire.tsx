import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Beaker,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  Zap,
  Download,
  ChevronDown,
  Shield,
  Microscope,
  Droplet,
  Flame,
  Wind,
  Eye
} from "lucide-react";
import { DynamicBreadcrumb } from "@/components/DynamicBreadcrumb";
import { useState } from "react";

interface Equipment {
  name: string;
  category: string;
  quantity: number;
  unit: string;
  supplier?: string;
  estimatedCost?: string;
  critical: boolean;
}

interface Protocol {
  id: string;
  name: string;
  frenchName: string;
  description: string;
  difficulty: "Débutant" | "Intermédiaire" | "Avancé" | "Expert";
  duration: string;
  team: number;
  safetyLevel: "Bas" | "Modéré" | "Élevé" | "Critique";
  equipment: Equipment[];
  chemicals: Array<{
    name: string;
    quantity: string;
    hazard: string;
    storage: string;
  }>;
  steps: Array<{
    number: number;
    title: string;
    description: string;
    duration: string;
    notes: string[];
    warnings?: string[];
  }>;
  expectedResults: string;
  troubleshooting: Array<{
    problem: string;
    cause: string;
    solution: string;
  }>;
  dataCollection: string[];
  references: string[];
}

const protocols: Protocol[] = [
  {
    id: "protocol-001",
    name: "H/D Exchange Protocol",
    frenchName: "Protocole d'Échange Hydrogène-Deutérium",
    description: "Technique fondamentale pour l'analyse isotopique des molécules olfactives. Permet de distinguer les fréquences vibratoires subtiles et d'identifier les signatures quantiques des odeurs.",
    difficulty: "Avancé",
    duration: "8-10 heures",
    team: 3,
    safetyLevel: "Élevé",
    equipment: [
      { name: "Spectromètre de masse haute résolution", category: "Analyse", quantity: 1, unit: "unité", supplier: "Thermo Fisher", estimatedCost: "€150,000-200,000", critical: true },
      { name: "Chromatographe en phase gazeuse (GC-FID)", category: "Analyse", quantity: 1, unit: "unité", supplier: "Agilent", estimatedCost: "€80,000-120,000", critical: true },
      { name: "Réacteur deutérium haute pression", category: "Réaction", quantity: 1, unit: "unité", estimatedCost: "€40,000-60,000", critical: true },
      { name: "Chambre climatisée (±0.1°C)", category: "Contrôle", quantity: 1, unit: "unité", estimatedCost: "€15,000-25,000", critical: true },
      { name: "Micropipettes de précision", category: "Mesure", quantity: 5, unit: "unité", estimatedCost: "€2,000-3,000", critical: false },
      { name: "Seringues Hamilton 100µL", category: "Injection", quantity: 10, unit: "unité", estimatedCost: "€500-800", critical: false },
      { name: "Flacons de verre ambré 2mL", category: "Stockage", quantity: 100, unit: "unité", estimatedCost: "€200-300", critical: false },
      { name: "Gants nitrile stériles", category: "Sécurité", quantity: 1000, unit: "paire", estimatedCost: "€50-100", critical: false },
    ],
    chemicals: [
      { name: "Deutérium (D2O)", quantity: "500 mL", hazard: "Toxique, radioactif léger", storage: "Conteneur scellé à 4°C" },
      { name: "Molécule olfactive cible", quantity: "10-50 mg", hazard: "Variable selon la molécule", storage: "Flacon ambré, -20°C" },
      { name: "Acétone deutérée (CD3COCD3)", quantity: "200 mL", hazard: "Inflammable, toxique", storage: "Conteneur scellé, température ambiante" },
      { name: "Acide trifluoroacétique (TFA)", quantity: "50 mL", hazard: "Corrosif", storage: "Flacon en PTFE, température ambiante" },
      { name: "Catalyseur Pd/C 5%", quantity: "1 g", hazard: "Irritant", storage: "Conteneur scellé, température ambiante" },
    ],
    steps: [
      {
        number: 1,
        title: "Préparation du laboratoire et des équipements",
        description: "Vérifier tous les équipements, calibrer les instruments, préparer l'espace de travail stérile.",
        duration: "1 heure",
        notes: [
          "Vérifier la pression du réacteur deutérium",
          "Calibrer le spectromètre de masse avec des étalons de référence",
          "Préparer la chambre climatisée à 20°C ± 0.1°C",
          "Nettoyer tous les équipements avec de l'éthanol 70%"
        ],
        warnings: [
          "Ne pas toucher les surfaces chaudes du réacteur",
          "Porter l'équipement de protection complet (blouse, gants, lunettes)"
        ]
      },
      {
        number: 2,
        title: "Préparation de la solution mère",
        description: "Dissoudre la molécule olfactive cible dans le solvant deutéré à concentration précise.",
        duration: "1.5 heures",
        notes: [
          "Peser la molécule cible avec une balance analytique (précision ±0.1 mg)",
          "Dissoudre dans 10 mL d'acétone deutérée",
          "Agiter doucement pendant 30 minutes",
          "Laisser reposer 1 heure à température ambiante"
        ],
        warnings: [
          "L'acétone deutérée est inflammable - éloigner de toute source de chaleur",
          "Utiliser une hotte aspirante pour éviter l'inhalation"
        ]
      },
      {
        number: 3,
        title: "Réaction d'échange H/D",
        description: "Transférer la solution dans le réacteur deutérium et initier la réaction catalytique.",
        duration: "3-4 heures",
        notes: [
          "Transférer la solution mère dans le réacteur avec une seringue Hamilton",
          "Ajouter le catalyseur Pd/C (10 mg)",
          "Augmenter la pression progressivement jusqu'à 50 bar",
          "Maintenir la température à 40°C ± 1°C",
          "Laisser réagir pendant 3 heures avec agitation magnétique"
        ],
        warnings: [
          "Vérifier régulièrement la pression du réacteur (toutes les 30 minutes)",
          "Ne pas dépasser 60 bar - risque d'explosion",
          "Garder le réacteur dans une enceinte de sécurité"
        ]
      },
      {
        number: 4,
        title: "Récupération et purification",
        description: "Refroidir la réaction, récupérer le produit et le purifier.",
        duration: "2 heures",
        notes: [
          "Diminuer la pression progressivement sur 30 minutes",
          "Refroidir le réacteur à température ambiante",
          "Récupérer la solution avec une seringue",
          "Filtrer sur papier filtre Whatman (0.2 µm)",
          "Concentrer sous vide à 30°C (rotavapeur)"
        ],
        warnings: [
          "Ne pas refroidir rapidement - risque de choc thermique",
          "Porter des gants de protection lors de la manipulation"
        ]
      },
      {
        number: 5,
        title: "Analyse par GC-MS",
        description: "Analyser le produit par chromatographie gazeuse couplée à la spectrométrie de masse.",
        duration: "1-2 heures",
        notes: [
          "Préparer une dilution 1:100 dans l'acétone deutérée",
          "Injecter 1 µL dans le GC-MS",
          "Utiliser un gradient de température : 50°C (2 min) → 250°C (20°C/min)",
          "Acquérir les spectres de masse (m/z 50-500)",
          "Comparer avec les spectres de référence"
        ]
      },
      {
        number: 6,
        title: "Analyse des résultats et documentation",
        description: "Analyser les données, calculer le taux d'échange H/D et documenter les résultats.",
        duration: "1-2 heures",
        notes: [
          "Calculer le décalage de masse (Δm) pour chaque pic",
          "Déterminer le pourcentage d'échange H/D",
          "Comparer les fréquences vibratoires avec les données théoriques",
          "Générer un rapport détaillé avec graphiques et tableaux"
        ]
      }
    ],
    expectedResults: "Identification des fréquences vibratoires quantiques caractéristiques de la molécule olfactive. Taux d'échange H/D typiquement entre 60-95% selon la structure moléculaire. Signature spectrale unique permettant l'identification et la classification olfactive.",
    troubleshooting: [
      {
        problem: "Pas de pics détectés au GC-MS",
        cause: "Molécule trop volatile ou dégradée pendant la réaction",
        solution: "Réduire la température de réaction à 30°C, diminuer le temps de réaction à 1.5 heures"
      },
      {
        problem: "Taux d'échange H/D très faible (<20%)",
        cause: "Catalyseur inactif ou concentration insuffisante",
        solution: "Remplacer le catalyseur Pd/C, augmenter la quantité à 20 mg, augmenter la pression à 60 bar"
      },
      {
        problem: "Pics multiples ou impuretés",
        cause: "Contamination ou dégradation partielle",
        solution: "Purifier davantage la solution mère, utiliser une nouvelle batch de solvant deutéré"
      }
    ],
    dataCollection: [
      "Masse initiale de la molécule cible (mg)",
      "Pression et température du réacteur (enregistrement continu)",
      "Temps de réaction (heures)",
      "Spectres de masse GC-MS (fichiers .raw)",
      "Taux d'échange H/D calculé (%)",
      "Fréquences vibratoires identifiées (cm⁻¹)"
    ],
    references: [
      "Evershed, R. P., et al. (2008). 'Volatile compounds from archaeological samples'",
      "Manniche, L. (1999). 'Sacred Luxuries: Fragrance, Aromatherapy, and Cosmetics in Ancient Egypt'",
      "Thermo Fisher Scientific. (2020). 'GC-MS Operating Manual and Best Practices'"
    ]
  },
  {
    id: "protocol-002",
    name: "MOF HKUST-1 Synthesis",
    frenchName: "Synthèse du Cadre Organique Métallique (MOF) HKUST-1",
    description: "Protocole de synthèse d'un cadre organique métallique pour le stockage et la libération contrôlée de molécules olfactives. Permet de créer des 'capsules olfactives' avec libération temporisée.",
    difficulty: "Intermédiaire",
    duration: "48-72 heures (incluant temps de cristallisation)",
    team: 2,
    safetyLevel: "Modéré",
    equipment: [
      { name: "Réacteur hydrothermique 100 mL", category: "Synthèse", quantity: 2, unit: "unité", estimatedCost: "€3,000-5,000", critical: true },
      { name: "Four programmable 0-250°C", category: "Chauffage", quantity: 1, unit: "unité", estimatedCost: "€2,000-3,000", critical: true },
      { name: "Centrifugeuse haute vitesse", category: "Séparation", quantity: 1, unit: "unité", estimatedCost: "€5,000-8,000", critical: true },
      { name: "Microscope électronique à balayage (SEM)", category: "Caractérisation", quantity: 1, unit: "unité", estimatedCost: "€50,000-100,000", critical: false },
      { name: "Diffractomètre de rayons X (XRD)", category: "Caractérisation", quantity: 1, unit: "unité", estimatedCost: "€80,000-150,000", critical: false },
      { name: "Étuve à vide", category: "Séchage", quantity: 1, unit: "unité", estimatedCost: "€3,000-5,000", critical: true },
    ],
    chemicals: [
      { name: "Cuivre(II) nitrate trihydraté Cu(NO3)2·3H2O", quantity: "1.5 g", hazard: "Oxydant, toxique", storage: "Conteneur sec, température ambiante" },
      { name: "Acide benzène-1,3,5-tricarboxylique (BTC)", quantity: "0.5 g", hazard: "Irritant", storage: "Conteneur sec, température ambiante" },
      { name: "N,N-diméthylformamide (DMF)", quantity: "50 mL", hazard: "Toxique, inflammable", storage: "Flacon ambré, température ambiante" },
      { name: "Éthanol absolu", quantity: "200 mL", hazard: "Inflammable", storage: "Flacon ambré, température ambiante" },
      { name: "Eau déionisée", quantity: "100 mL", hazard: "Aucun", storage: "Bouteille plastique" },
    ],
    steps: [
      {
        number: 1,
        title: "Préparation des réactifs",
        description: "Peser et préparer tous les réactifs dans les proportions exactes.",
        duration: "30 minutes",
        notes: [
          "Peser Cu(NO3)2·3H2O (1.5 g) avec balance analytique",
          "Peser BTC (0.5 g) avec balance analytique",
          "Préparer 50 mL de DMF dans une seringue",
          "Préparer 100 mL d'eau déionisée"
        ]
      },
      {
        number: 2,
        title: "Dissolution des réactifs",
        description: "Dissoudre les réactifs dans les solvants appropriés.",
        duration: "1 heure",
        notes: [
          "Dissoudre Cu(NO3)2·3H2O dans 25 mL d'eau déionisée (solution bleue)",
          "Dissoudre BTC dans 25 mL de DMF (solution incolore)",
          "Agiter chaque solution séparément pendant 30 minutes"
        ]
      },
      {
        number: 3,
        title: "Mélange et transfert au réacteur",
        description: "Mélanger les solutions et transférer au réacteur hydrothermique.",
        duration: "30 minutes",
        notes: [
          "Verser la solution de BTC dans le réacteur",
          "Ajouter lentement la solution de Cu(NO3)2 en agitant",
          "Sceller le réacteur hermétiquement",
          "Vérifier l'absence de fuites"
        ]
      },
      {
        number: 4,
        title: "Réaction hydrothermique",
        description: "Chauffer le réacteur à température contrôlée pour cristalliser le MOF.",
        duration: "24-48 heures",
        notes: [
          "Programmer le four : 120°C pendant 24 heures",
          "Augmenter progressivement la température (5°C/min)",
          "Maintenir 120°C pendant 24 heures",
          "Refroidir progressivement à température ambiante (2°C/min)"
        ]
      },
      {
        number: 5,
        title: "Récupération et lavage des cristaux",
        description: "Récupérer les cristaux de MOF et les laver pour éliminer les impuretés.",
        duration: "2 heures",
        notes: [
          "Ouvrir le réacteur après refroidissement complet",
          "Récupérer les cristaux bleus avec une spatule",
          "Laver avec 50 mL d'éthanol absolu (3 fois)",
          "Centrifuger à 5000 rpm pendant 5 minutes après chaque lavage"
        ]
      },
      {
        number: 6,
        title: "Séchage et caractérisation",
        description: "Sécher les cristaux et caractériser la structure du MOF.",
        duration: "24 heures + 2 heures d'analyse",
        notes: [
          "Placer les cristaux dans l'étuve à vide à 150°C pendant 24 heures",
          "Analyser par diffraction de rayons X (XRD)",
          "Imager par microscope électronique à balayage (SEM)",
          "Mesurer la surface spécifique par adsorption de N2"
        ]
      }
    ],
    expectedResults: "Cristaux bleus cubiques de HKUST-1 de 50-200 µm. Surface spécifique typiquement 1200-1500 m²/g. Capacité de stockage de molécules olfactives : 20-40% en poids. Structure cristalline confirmée par XRD avec paramètre de maille a = 26.7 Å.",
    troubleshooting: [
      {
        problem: "Pas de cristallisation ou poudre amorphe",
        cause: "Température insuffisante ou rapport molaire incorrect",
        solution: "Augmenter la température à 140°C, vérifier les proportions des réactifs"
      },
      {
        problem: "Cristaux très petits (<10 µm)",
        cause: "Refroidissement trop rapide",
        solution: "Réduire la vitesse de refroidissement à 1°C/min"
      }
    ],
    dataCollection: [
      "Masse des cristaux récupérés (mg)",
      "Rendement de synthèse (%)",
      "Paramètres XRD (a, b, c, angles)",
      "Surface spécifique BET (m²/g)",
      "Morphologie SEM (images)"
    ],
    references: [
      "Chui, S. S. Y., et al. (1999). 'A Chemically Functionalizable Nanoporous Material'",
      "Rowsell, J. L. C., & Yaghi, O. M. (2006). 'Metal-organic frameworks: a new class of porous materials'"
    ]
  },
  {
    id: "protocol-003",
    name: "Biocatalysis Protocol",
    frenchName: "Protocole de Biosynthèse Olfactive Programmée",
    description: "Utilisation d'enzymes et de microorganismes génétiquement modifiés pour synthétiser des molécules olfactives complexes. Permet la production durable de molécules rares ou disparues.",
    difficulty: "Expert",
    duration: "7-14 jours",
    team: 4,
    safetyLevel: "Critique",
    equipment: [
      { name: "Bioréacteur 5L avec contrôle pH/température", category: "Biologie", quantity: 1, unit: "unité", estimatedCost: "€15,000-25,000", critical: true },
      { name: "Incubateur shaker 37°C", category: "Biologie", quantity: 2, unit: "unité", estimatedCost: "€3,000-5,000", critical: true },
      { name: "Centrifugeuse réfrigérée", category: "Séparation", quantity: 1, unit: "unité", estimatedCost: "€8,000-12,000", critical: true },
      { name: "HPLC préparative", category: "Purification", quantity: 1, unit: "unité", estimatedCost: "€30,000-50,000", critical: true },
      { name: "Spectromètre UV-Vis", category: "Analyse", quantity: 1, unit: "unité", estimatedCost: "€5,000-8,000", critical: false },
    ],
    chemicals: [
      { name: "Souche bactérienne Escherichia coli BL21(DE3)", quantity: "1 vial", hazard: "Modéré (biosécurité niveau 1)", storage: "Azote liquide (-196°C)" },
      { name: "Plasmide pET28a-[Enzyme]", quantity: "1 µg", hazard: "Modéré", storage: "Congélateur -20°C" },
      { name: "Milieu LB (Luria-Bertani)", quantity: "10 L", hazard: "Aucun", storage: "Température ambiante" },
      { name: "Substrat précurseur", quantity: "100 mg", hazard: "Variable", storage: "Selon la molécule" },
      { name: "IPTG (isopropyl β-D-1-thiogalactopyranoside)", quantity: "1 g", hazard: "Irritant", storage: "Congélateur -20°C" },
    ],
    steps: [
      {
        number: 1,
        title: "Préparation et transformation bactérienne",
        description: "Préparer les cellules compétentes et transformer avec le plasmide contenant le gène de l'enzyme.",
        duration: "2 heures",
        notes: [
          "Décongeler les cellules E. coli BL21(DE3) sur glace",
          "Ajouter le plasmide pET28a-[Enzyme] (50 ng)",
          "Incuber 30 minutes sur glace",
          "Effectuer un choc thermique : 42°C pendant 90 secondes",
          "Incuber 2 minutes sur glace",
          "Ajouter 1 mL de milieu LB sans antibiotique",
          "Récupérer les cellules par centrifugation"
        ]
      },
      {
        number: 2,
        title: "Culture de pré-inoculum",
        description: "Cultiver les cellules transformées dans un petit volume pour générer un inoculum.",
        duration: "16-18 heures",
        notes: [
          "Ensemencer 50 mL de milieu LB + kanamycine (50 µg/mL)",
          "Cultiver à 37°C avec agitation (200 rpm) pendant 16-18 heures",
          "Mesurer la densité optique (OD600) : devrait être 0.8-1.2"
        ]
      },
      {
        number: 3,
        title: "Culture principale en bioréacteur",
        description: "Cultiver les cellules dans le bioréacteur avec contrôle automatisé des paramètres.",
        duration: "24-36 heures",
        notes: [
          "Remplir le bioréacteur avec 4 L de milieu LB + kanamycine",
          "Stériliser par autoclave (121°C, 20 minutes)",
          "Inoculer avec 50 mL de pré-inoculum",
          "Maintenir : température 37°C, pH 7.0, aération 1 vvm",
          "Agitation : 400 rpm",
          "Surveiller OD600 toutes les heures"
        ]
      },
      {
        number: 4,
        title: "Induction de l'expression protéique",
        description: "Induire l'expression de l'enzyme avec l'IPTG quand OD600 atteint 0.6-0.8.",
        duration: "4-6 heures",
        notes: [
          "Ajouter IPTG à concentration finale 0.5 mM",
          "Réduire la température à 20°C",
          "Maintenir l'agitation et l'aération",
          "Cultiver pendant 4-6 heures (expression lente pour meilleure solubilité)"
        ]
      },
      {
        number: 5,
        title: "Récolte et lyse cellulaire",
        description: "Récolter les cellules et extraire l'enzyme.",
        duration: "2-3 heures",
        notes: [
          "Centrifuger à 6000 g pendant 20 minutes à 4°C",
          "Récupérer le culot cellulaire",
          "Resuspendre dans 50 mL de tampon de lyse (pH 7.5)",
          "Lyser par sonication (10 cycles 30 sec on / 30 sec off)",
          "Centrifuger à 12000 g pendant 30 minutes à 4°C",
          "Récupérer le surnageant contenant l'enzyme soluble"
        ]
      },
      {
        number: 6,
        title: "Réaction biocatalytique",
        description: "Utiliser l'enzyme pour catalyser la synthèse de la molécule olfactive.",
        duration: "24-48 heures",
        notes: [
          "Ajouter le substrat précurseur (100 mg) à la solution enzymatique",
          "Maintenir à 30°C avec agitation douce",
          "Prélever des échantillons toutes les 6 heures",
          "Analyser par HPLC pour suivre la conversion",
          "Arrêter quand conversion > 90%"
        ]
      },
      {
        number: 7,
        title: "Purification du produit",
        description: "Purifier la molécule olfactive produite.",
        duration: "4-6 heures",
        notes: [
          "Filtrer la solution de réaction (0.2 µm)",
          "Concentrer par évaporation sous vide",
          "Purifier par HPLC préparative",
          "Collecter les fractions contenant le produit",
          "Concentrer et sécher"
        ]
      }
    ],
    expectedResults: "Production de 10-50 mg de molécule olfactive avec pureté >95% (HPLC). Rendement typiquement 30-60% du substrat. Activité enzymatique confirmée par spectroscopie UV-Vis. Identité du produit confirmée par GC-MS et RMN.",
    troubleshooting: [
      {
        problem: "Expression protéique faible ou protéine insoluble",
        cause: "Température d'induction trop élevée ou temps insuffisant",
        solution: "Réduire à 16°C, augmenter le temps d'induction à 12-16 heures"
      },
      {
        problem: "Faible conversion du substrat",
        cause: "Enzyme inactive ou conditions de réaction non optimales",
        solution: "Vérifier la concentration enzymatique, augmenter le pH à 8.0, augmenter la température à 37°C"
      }
    ],
    dataCollection: [
      "OD600 et croissance cellulaire (courbe)",
      "Concentration enzymatique (mg/mL)",
      "Conversion du substrat (%)",
      "Rendement du produit final (mg, %)",
      "Pureté HPLC (%)",
      "Spectre GC-MS du produit"
    ],
    references: [
      "Bornscheuer, U. T., et al. (2012). 'Engineered proteins as catalysts'",
      "Turner, N. J. (2009). 'Directed evolution of enzymes for biocatalysis'"
    ]
  }
];

const difficultyColors: Record<Protocol["difficulty"], string> = {
  "Débutant": "bg-green-100 text-green-800",
  "Intermédiaire": "bg-yellow-100 text-yellow-800",
  "Avancé": "bg-orange-100 text-orange-800",
  "Expert": "bg-red-100 text-red-800"
};

const safetyColors: Record<Protocol["safetyLevel"], string> = {
  "Bas": "bg-green-500",
  "Modéré": "bg-yellow-500",
  "Élevé": "bg-orange-500",
  "Critique": "bg-red-500"
};

export function AbsorbeXGuideLaboratoire() {
  const [expandedProtocol, setExpandedProtocol] = useState<string | null>(protocols[0].id);

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <div className="border-b bg-muted/30">
        <div className="container mx-auto px-4 py-4">
          <DynamicBreadcrumb />
        </div>
      </div>

      {/* Hero Section */}
      <div className="border-b bg-gradient-to-r from-background via-orange-50/50 to-background dark:via-orange-950/20">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-lg bg-orange-500/10">
                <Beaker className="h-8 w-8 text-orange-600 dark:text-orange-400" />
              </div>
              <h1 className="text-4xl font-bold">Guide de Laboratoire</h1>
            </div>
            <p className="text-xl text-muted-foreground mb-4">
              Protocoles Opérationnels ABSORBE X
            </p>
            <p className="text-lg text-foreground/80">
              Protocoles détaillés et validés pour les expériences de recherche olfactive avancée. 
              Incluent équipement requis, chimie, étapes détaillées et dépannage.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        {/* Safety Notice */}
        <Card className="mb-8 p-6 border-l-4 border-l-red-500 bg-red-50/50 dark:bg-red-950/20">
          <div className="flex items-start gap-4">
            <AlertTriangle className="h-6 w-6 text-red-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-lg mb-2">⚠️ Avertissement de Sécurité</h3>
              <p className="text-sm text-foreground/80 mb-3">
                Ces protocoles impliquent l'utilisation de produits chimiques dangereux, d'équipements haute pression et de microorganismes. 
                Seul le personnel formé et autorisé doit exécuter ces expériences.
              </p>
              <ul className="text-sm space-y-1 text-foreground/80">
                <li>✓ Suivre toutes les réglementations de biosécurité locales</li>
                <li>✓ Porter l'équipement de protection complet (EPI)</li>
                <li>✓ Travailler dans une enceinte de sécurité biologique agréée</li>
                <li>✓ Avoir accès à des équipements d'urgence (douche, lavage oculaire)</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Protocol Overview */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Protocoles Disponibles</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {protocols.map(protocol => (
              <Card key={protocol.id} className="p-4 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setExpandedProtocol(protocol.id)}>
                <div className="flex items-start justify-between mb-3">
                  <Microscope className="h-6 w-6 text-orange-600" />
                  <Badge className={difficultyColors[protocol.difficulty]}>
                    {protocol.difficulty}
                  </Badge>
                </div>
                <h3 className="font-bold mb-2">{protocol.frenchName}</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{protocol.duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>{protocol.team} personne(s)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    <span>{protocol.safetyLevel}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Detailed Protocols */}
        <div className="space-y-6">
          {protocols.map(protocol => (
            <Card key={protocol.id} className="overflow-hidden">
              <div
                className="p-6 bg-gradient-to-r from-orange-50/50 to-transparent dark:from-orange-950/20 cursor-pointer hover:bg-orange-50/70 dark:hover:from-orange-950/30 transition-colors"
                onClick={() => setExpandedProtocol(expandedProtocol === protocol.id ? null : protocol.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-2xl font-bold">{protocol.frenchName}</h3>
                      <Badge className={difficultyColors[protocol.difficulty]}>
                        {protocol.difficulty}
                      </Badge>
                      <div className={`w-4 h-4 rounded-full ${safetyColors[protocol.safetyLevel]}`} title={`Sécurité: ${protocol.safetyLevel}`} />
                    </div>
                    <p className="text-muted-foreground mb-3">{protocol.description}</p>
                    <div className="flex gap-6 text-sm">
                      <span className="flex items-center gap-2"><Clock className="h-4 w-4" /> {protocol.duration}</span>
                      <span className="flex items-center gap-2"><Users className="h-4 w-4" /> {protocol.team} personne(s)</span>
                      <span className="flex items-center gap-2"><Shield className="h-4 w-4" /> {protocol.safetyLevel}</span>
                    </div>
                  </div>
                  <ChevronDown className={`h-6 w-6 transition-transform ${expandedProtocol === protocol.id ? "rotate-180" : ""}`} />
                </div>
              </div>

              {expandedProtocol === protocol.id && (
                <div className="border-t p-6 space-y-8">
                  <Tabs defaultValue="equipment" className="w-full">
                    <TabsList className="grid w-full grid-cols-5">
                      <TabsTrigger value="equipment">Équipement</TabsTrigger>
                      <TabsTrigger value="chemicals">Chimie</TabsTrigger>
                      <TabsTrigger value="steps">Étapes</TabsTrigger>
                      <TabsTrigger value="results">Résultats</TabsTrigger>
                      <TabsTrigger value="troubleshooting">Dépannage</TabsTrigger>
                    </TabsList>

                    {/* Equipment Tab */}
                    <TabsContent value="equipment" className="space-y-4 pt-4">
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead className="border-b">
                            <tr>
                              <th className="text-left py-2 px-3">Équipement</th>
                              <th className="text-left py-2 px-3">Catégorie</th>
                              <th className="text-center py-2 px-3">Quantité</th>
                              <th className="text-left py-2 px-3">Fournisseur</th>
                              <th className="text-left py-2 px-3">Coût</th>
                              <th className="text-center py-2 px-3">Critique</th>
                            </tr>
                          </thead>
                          <tbody>
                            {protocol.equipment.map((eq, idx) => (
                              <tr key={idx} className="border-b hover:bg-muted/50">
                                <td className="py-2 px-3 font-medium">{eq.name}</td>
                                <td className="py-2 px-3 text-muted-foreground">{eq.category}</td>
                                <td className="py-2 px-3 text-center">{eq.quantity} {eq.unit}</td>
                                <td className="py-2 px-3 text-muted-foreground">{eq.supplier || "-"}</td>
                                <td className="py-2 px-3 text-muted-foreground">{eq.estimatedCost || "-"}</td>
                                <td className="py-2 px-3 text-center">
                                  {eq.critical ? (
                                    <CheckCircle className="h-4 w-4 text-red-600 mx-auto" />
                                  ) : (
                                    <span className="text-muted-foreground">-</span>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </TabsContent>

                    {/* Chemicals Tab */}
                    <TabsContent value="chemicals" className="space-y-4 pt-4">
                      <div className="space-y-3">
                        {protocol.chemicals.map((chem, idx) => (
                          <Card key={idx} className="p-4 bg-muted/30">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <p className="font-semibold">{chem.name}</p>
                                <p className="text-sm text-muted-foreground">Quantité: {chem.quantity}</p>
                              </div>
                              <Badge variant="outline">{chem.hazard}</Badge>
                            </div>
                            <p className="text-sm text-foreground/80">
                              <span className="font-semibold">Stockage:</span> {chem.storage}
                            </p>
                          </Card>
                        ))}
                      </div>
                    </TabsContent>

                    {/* Steps Tab */}
                    <TabsContent value="steps" className="space-y-4 pt-4">
                      <div className="space-y-6">
                        {protocol.steps.map((step) => (
                          <Card key={step.number} className="p-4 border-l-4 border-l-orange-500">
                            <div className="flex items-start gap-4 mb-3">
                              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold">
                                {step.number}
                              </div>
                              <div className="flex-1">
                                <h4 className="font-bold text-lg mb-1">{step.title}</h4>
                                <p className="text-muted-foreground mb-2">{step.description}</p>
                                <p className="text-sm text-foreground/70 font-semibold mb-3">⏱️ Durée: {step.duration}</p>
                              </div>
                            </div>

                            <div className="ml-12 space-y-3">
                              {step.notes.length > 0 && (
                                <div>
                                  <p className="font-semibold text-sm mb-2">📋 Notes:</p>
                                  <ul className="space-y-1">
                                    {step.notes.map((note, idx) => (
                                      <li key={idx} className="text-sm text-foreground/80 flex gap-2">
                                        <span className="text-orange-600">•</span>
                                        <span>{note}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              {step.warnings && step.warnings.length > 0 && (
                                <div className="p-3 bg-red-50/50 dark:bg-red-950/20 rounded border-l-2 border-l-red-500">
                                  <p className="font-semibold text-sm text-red-700 dark:text-red-400 mb-2">⚠️ Avertissements:</p>
                                  <ul className="space-y-1">
                                    {step.warnings.map((warning, idx) => (
                                      <li key={idx} className="text-sm text-red-600 dark:text-red-300 flex gap-2">
                                        <span>•</span>
                                        <span>{warning}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          </Card>
                        ))}
                      </div>
                    </TabsContent>

                    {/* Results Tab */}
                    <TabsContent value="results" className="space-y-4 pt-4">
                      <Card className="p-4 bg-green-50/50 dark:bg-green-950/20 border-l-4 border-l-green-500">
                        <h4 className="font-bold mb-2">✓ Résultats Attendus</h4>
                        <p className="text-foreground/80">{protocol.expectedResults}</p>
                      </Card>

                      <div>
                        <h4 className="font-bold mb-3">📊 Données à Collecter</h4>
                        <ul className="space-y-2">
                          {protocol.dataCollection.map((data, idx) => (
                            <li key={idx} className="flex gap-2 text-foreground/80 text-sm">
                              <span className="text-orange-600 font-bold">→</span>
                              <span>{data}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </TabsContent>

                    {/* Troubleshooting Tab */}
                    <TabsContent value="troubleshooting" className="space-y-4 pt-4">
                      <div className="space-y-3">
                        {protocol.troubleshooting.map((item, idx) => (
                          <Card key={idx} className="p-4 bg-yellow-50/50 dark:bg-yellow-950/20">
                            <p className="font-semibold text-red-700 dark:text-red-400 mb-2">❌ {item.problem}</p>
                            <p className="text-sm text-foreground/80 mb-2">
                              <span className="font-semibold">Cause:</span> {item.cause}
                            </p>
                            <p className="text-sm text-green-700 dark:text-green-400">
                              <span className="font-semibold">✓ Solution:</span> {item.solution}
                            </p>
                          </Card>
                        ))}
                      </div>
                    </TabsContent>
                  </Tabs>

                  {/* References */}
                  <div className="border-t pt-6">
                    <h4 className="font-bold mb-3">📚 Références</h4>
                    <ul className="space-y-2">
                      {protocol.references.map((ref, idx) => (
                        <li key={idx} className="text-sm text-foreground/80 flex gap-2">
                          <span className="text-orange-600 font-bold">[{idx + 1}]</span>
                          <span>{ref}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>

        {/* Download Section */}
        <Card className="mt-12 p-8 bg-gradient-to-r from-orange-50/50 to-yellow-50/50 dark:from-orange-950/20 dark:to-yellow-950/20">
          <div className="flex items-center gap-4 mb-4">
            <Download className="h-8 w-8 text-orange-600" />
            <h3 className="text-2xl font-bold">Ressources Téléchargeables</h3>
          </div>
          <p className="text-foreground/80 mb-6">
            Téléchargez les protocoles au format PDF avec fiches de sécurité et checklists.
          </p>
          <div className="flex gap-4 flex-wrap">
            <Button className="gap-2">
              <Download className="h-4 w-4" />
              Tous les protocoles (PDF)
            </Button>
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Fiches de sécurité (SDS)
            </Button>
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Checklists de laboratoire
            </Button>
          </div>
        </Card>

        {/* Navigation */}
        <div className="flex gap-4 mt-12 justify-center flex-wrap">
          <Link href="/absorbe-x">
            <Button variant="outline">Dashboard ABSORBE X</Button>
          </Link>
          <Link href="/absorbe-x/odeurs-perdues">
            <Button variant="outline">Odeurs Perdues</Button>
          </Link>
          <Link href="/absorbe-x/neuro-olfaction">
            <Button variant="outline">Neuro-Olfaction</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
