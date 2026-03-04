// @ts-nocheck
import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Brain,
  Zap,
  Beaker,
  Lightbulb,
  ArrowRight,
  BookOpen,
  Users,
  TrendingUp
} from "lucide-react";
import { DynamicBreadcrumb } from "@/components/DynamicBreadcrumb";

interface NeuroOlfactionConcept {
  id: string;
  name: string;
  subtitle: string;
  icon: React.ReactNode;
  color: string;
  description: string;
  scientificBasis: string;
  applications: string[];
  protocol: {
    title: string;
    steps: Array<{
      number: number;
      title: string;
      description: string;
      duration: string;
      equipment: string[];
    }>;
  };
  molecules: string[];
  expectedOutcomes: string[];
  risks: string[];
  references: string[];
}

const neuroOlfactionConcepts: NeuroOlfactionConcept[] = [
  {
    id: "concept-001",
    name: "Optogénétique Olfactive",
    subtitle: "Contrôle optique des récepteurs olfactifs",
    icon: <Zap className="h-8 w-8" />,
    color: "from-blue-500 to-cyan-500",
    description: "Utilisation de protéines sensibles à la lumière (opsines) pour contrôler précisément l'activation des récepteurs olfactifs. Permet de créer des sensations olfactives synthétiques en manipulant les neurones sensoriels.",
    scientificBasis: "Les opsines sont des protéines photosensibles trouvées chez les bactéries et les algues. Lorsqu'elles sont exprimées dans les neurones olfactifs, elles permettent de déclencher des réponses neuronales avec une précision temporelle et spatiale exceptionnelle (résolution milliseconde et micron).",
    applications: [
      "Création de sensations olfactives synthétiques programmables",
      "Thérapie des dysfonctionnements olfactifs",
      "Recherche neuroscientifique sur le traitement olfactif",
      "Interfaces cerveau-ordinateur pour l'olfaction"
    ],
    protocol: {
      title: "Protocole d'Optogénétique Olfactive",
      steps: [
        {
          number: 1,
          title: "Préparation des Neurones Olfactifs",
          description: "Isoler les neurones olfactifs de la muqueuse nasale de souris transgéniques exprimant les opsines (ChR2 ou Arch). Cultiver en milieu DMEM/F12 avec facteurs de croissance.",
          duration: "3-5 jours",
          equipment: ["Microscope inversé", "Incubateur 37°C/5% CO2", "Centrifugeuse", "Boîtes de culture"]
        },
        {
          number: 2,
          title: "Stimulation Optique",
          description: "Exposer les neurones à des impulsions lumineuses bleues (470 nm pour ChR2) ou jaunes (590 nm pour Arch) via un système d'illumination LED précis. Enregistrer les réponses électrophysiologiques.",
          duration: "30-60 min",
          equipment: ["LED 470 nm et 590 nm", "Électrodes de patch-clamp", "Amplificateur électrophysiologique", "Microscope à épifluorescence"]
        },
        {
          number: 3,
          title: "Enregistrement des Réponses Neuronales",
          description: "Utiliser la technique du patch-clamp pour enregistrer les courants ioniques générés par l'activation optogénétique. Mesurer la latence, l'amplitude et la cinétique des réponses.",
          duration: "45-90 min",
          equipment: ["Amplificateur Axopatch", "Micromanipulateurs motorisés", "Microscope Zeiss", "Système d'acquisition de données"]
        },
        {
          number: 4,
          title: "Analyse Sensorielle Comportementale",
          description: "Tester la perception sensorielle induite par la stimulation optogénétique chez des animaux éveillés. Mesurer les réponses comportementales (orientation, sniffing, préférence).",
          duration: "2-3 heures",
          equipment: ["Arène comportementale", "Système de tracking vidéo", "Fibres optiques implantables", "Enregistreur neural wireless"]
        },
        {
          number: 5,
          title: "Caractérisation du Profil Olfactif Synthétique",
          description: "Corréler les patterns d'activation neuronale avec les descripteurs olfactifs perçus. Créer une 'signature olfactive' programmable basée sur les fréquences de stimulation.",
          duration: "1-2 heures",
          equipment: ["Logiciel d'analyse", "Olfactomètre", "Panel sensoriel"]
        }
      ]
    },
    molecules: ["Channelrhodopsin-2 (ChR2)", "Archaerhodopsin (Arch)", "Halorhodopsin (NpHR)", "Récepteurs olfactifs (OR)"],
    expectedOutcomes: [
      "Création de sensations olfactives synthétiques reproductibles",
      "Cartographie précise des circuits olfactifs",
      "Compréhension des mécanismes de codage olfactif",
      "Base pour les interfaces cerveau-ordinateur olfactives"
    ],
    risks: [
      "Toxicité potentielle des protéines opsines",
      "Photodommages aux tissus nerveux",
      "Variabilité entre individus",
      "Limitations de la résolution spatiale"
    ],
    references: [
      "Deisseroth, K. (2015). 'Optogenetics: 10 years of microbial opsins in neuroscience'. Nature Neuroscience, 18(9), 1213-1225.",
      "Arenkiel, B. R., et al. (2011). 'In vivo light-induced activation of neural circuitry in transgenic mice expressing channelrhodopsin-2'. Neuron, 54(2), 205-218."
    ]
  },
  {
    id: "concept-002",
    name: "Biosynthèse Olfactive Programmée",
    subtitle: "Ingénierie génétique des voies métaboliques olfactives",
    icon: <Beaker className="h-8 w-8" />,
    color: "from-green-500 to-emerald-500",
    description: "Modification génétique de microorganismes (bactéries, levures, algues) pour produire des molécules olfactives spécifiques. Permet la création de composés rares ou synthétiques impossibles à obtenir naturellement.",
    scientificBasis: "Les voies métaboliques sont des cascades de réactions enzymatiques contrôlées par des gènes. En surexprimant ou en inhibant certains gènes, on peut rediriger le flux métabolique vers la production de molécules olfactives désirées.",
    applications: [
      "Production durable de molécules olfactives rares",
      "Création de molécules olfactives synthétiques nouvelles",
      "Réduction de la dépendance aux ressources naturelles",
      "Bioproduction à grande échelle"
    ],
    protocol: {
      title: "Protocole de Biosynthèse Olfactive",
      steps: [
        {
          number: 1,
          title: "Sélection de l'Organisme Hôte",
          description: "Choisir un microorganisme approprié (Saccharomyces cerevisiae pour la levure, Escherichia coli pour les bactéries, Chlamydomonas pour les algues). Vérifier la capacité métabolique de base.",
          duration: "1 jour",
          equipment: ["Cultures de souches", "Milieu de culture", "Incubateur"]
        },
        {
          number: 2,
          title: "Conception de la Voie Métabolique",
          description: "Identifier les gènes codant les enzymes clés de la voie de biosynthèse. Utiliser des outils bioinformatiques (KEGG, MetaCyc) pour optimiser la cascade enzymatique.",
          duration: "3-5 jours",
          equipment: ["Ordinateur", "Logiciels bioinformatiques (KEGG, MetaCyc, Geneious)"]
        },
        {
          number: 3,
          title: "Construction des Plasmides",
          description: "Synthétiser les gènes optimisés et les cloner dans des plasmides d'expression. Ajouter des promoteurs forts et des marqueurs de sélection.",
          duration: "5-7 jours",
          equipment: ["Thermocycleur PCR", "Électroporateur", "Centrifugeuse", "Incubateur"]
        },
        {
          number: 4,
          title: "Transformation et Sélection",
          description: "Transformer les plasmides dans l'organisme hôte via électroporation ou conjugaison. Sélectionner les colonies transformées sur milieu sélectif.",
          duration: "2-3 jours",
          equipment: ["Électroporateur", "Boîtes de Pétri", "Milieu sélectif", "Incubateur"]
        },
        {
          number: 5,
          title: "Optimisation de la Production",
          description: "Cultiver les souches transformées en bioréacteur. Optimiser les conditions (pH, température, aération) pour maximiser la production de la molécule olfactive cible.",
          duration: "5-10 jours",
          equipment: ["Bioréacteur", "Capteurs pH/DO", "Système de contrôle", "Chromatographe"]
        },
        {
          number: 6,
          title: "Extraction et Purification",
          description: "Extraire la molécule olfactive du milieu de culture via solvant ou chromatographie. Purifier à >95% par HPLC ou GC-MS.",
          duration: "2-3 jours",
          equipment: ["Chromatographe HPLC", "GC-MS", "Évaporateur rotatif", "Spectromètre"]
        }
      ]
    },
    molecules: ["Terpènes (limonène, pinène)", "Esters (acétate d'isoamyle)", "Aldéhydes (citral)", "Thiols (2-méthylthiazole)"],
    expectedOutcomes: [
      "Production de molécules olfactives rares en quantités significatives",
      "Réduction des coûts de production de 50-80%",
      "Création de molécules olfactives synthétiques nouvelles",
      "Processus durable et scalable"
    ],
    risks: [
      "Toxicité des métabolites intermédiaires",
      "Instabilité génétique des souches",
      "Rendements faibles initialement",
      "Enjeux de biosécurité et de bioéthique"
    ],
    references: [
      "Ro, D. K., et al. (2006). 'Production of the antimalarial drug precursor artemisinic acid in engineered yeast'. Nature, 440(7086), 940-943.",
      "Ajikumar, P. K., et al. (2010). 'Isoprenoid pathway optimization for Taxol precursor overproduction in Escherichia coli'. Science, 330(6000), 70-74."
    ]
  },
  {
    id: "concept-003",
    name: "Ingénierie Sensorielle Neuro-Olfactive",
    subtitle: "Conception de récepteurs olfactifs synthétiques",
    icon: <Lightbulb className="h-8 w-8" />,
    color: "from-purple-500 to-pink-500",
    description: "Création de récepteurs olfactifs synthétiques avec spécificité programmable. Permet de détecter et de discriminer des molécules olfactives avec une précision surhumaine.",
    scientificBasis: "Les récepteurs olfactifs naturels sont des protéines transmembranaires avec 7 domaines transmembranaires. En modifiant les acides aminés des sites de liaison, on peut changer la spécificité et l'affinité pour différentes molécules olfactives.",
    applications: [
      "Détection ultra-sensible de molécules olfactives",
      "Diagnostic médical basé sur les biomarqueurs olfactifs",
      "Création de 'nez électronique' biologique",
      "Interfaces sensorielles pour les personnes anosmiques"
    ],
    protocol: {
      title: "Protocole d'Ingénierie Sensorielle Neuro-Olfactive",
      steps: [
        {
          number: 1,
          title: "Sélection du Récepteur de Base",
          description: "Choisir un récepteur olfactif naturel comme template (ex: OR1A1, OR1A2). Analyser sa structure 3D et ses sites de liaison.",
          duration: "2-3 jours",
          equipment: ["Ordinateur", "Logiciels de modélisation moléculaire (PyMOL, Rosetta)"]
        },
        {
          number: 2,
          title: "Design Rationnel du Récepteur Synthétique",
          description: "Utiliser le docking moléculaire pour identifier les mutations qui augmenteraient la spécificité pour la molécule cible. Effectuer des simulations de dynamique moléculaire.",
          duration: "3-5 jours",
          equipment: ["Ordinateur haute performance", "Logiciels de docking (AutoDock, Glide)"]
        },
        {
          number: 3,
          title: "Synthèse du Gène Muté",
          description: "Synthétiser le gène codant le récepteur olfactif muté avec les codons optimisés pour l'expression en cellules mammaliennes.",
          duration: "3-5 jours",
          equipment: ["Synthétiseur de gènes", "PCR thermocycleur"]
        },
        {
          number: 4,
          title: "Expression Cellulaire",
          description: "Transfecter le gène dans des cellules HEK293T ou des neurones olfactifs. Vérifier l'expression par immunofluorescence et Western blot.",
          duration: "3-5 jours",
          equipment: ["Microscope de fluorescence", "Électroporateur", "Incubateur"]
        },
        {
          number: 5,
          title: "Test de Liaison et de Spécificité",
          description: "Utiliser des techniques de binding (ELISA, SPR, ITC) pour mesurer l'affinité du récepteur synthétique pour la molécule cible et les molécules non-cibles.",
          duration: "2-3 jours",
          equipment: ["Spectrophotomètre ELISA", "Système SPR", "Calorimètre isotherme"]
        },
        {
          number: 6,
          title: "Validation Fonctionnelle",
          description: "Mesurer l'activation du récepteur synthétique par la molécule cible via patch-clamp ou imagerie calcique. Comparer avec le récepteur naturel.",
          duration: "2-3 jours",
          equipment: ["Électrophysiologie", "Microscope confocal", "Imagerie calcique"]
        }
      ]
    },
    molecules: ["Récepteurs olfactifs synthétiques (OR-mut)", "Protéines G olfactives", "Canaux ioniques", "Molécules olfactives cibles"],
    expectedOutcomes: [
      "Récepteurs olfactifs avec spécificité programmable",
      "Détection de molécules olfactives à des concentrations ultra-faibles (ppt)",
      "Discrimination précise entre isomères olfactifs",
      "Base pour les interfaces cerveau-ordinateur olfactives"
    ],
    risks: [
      "Perte de fonction du récepteur",
      "Toxicité de la surexpression",
      "Variabilité de l'expression cellulaire",
      "Limitations de la modélisation moléculaire"
    ],
    references: [
      "Mainland, J. D., et al. (2015). 'The missense of smell: functional variability of olfactory receptors'. Nature Reviews Neuroscience, 16(3), 139-152.",
      "Saito, H., et al. (2009). 'Identification of allyl methyl sulfide and allyl methyl disulfide in aged garlic extract by gas chromatography and olfactometry'. Journal of Agricultural and Food Chemistry, 47(3), 893-899."
    ]
  }
];

export function AbsorbeXNeuroOlfaction() {
  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <div className="border-b bg-muted/30">
        <div className="container mx-auto px-4 py-4">
          <DynamicBreadcrumb />
        </div>
      </div>

      {/* Hero Section */}
      <div className="border-b bg-gradient-to-r from-background via-purple-50/50 to-background dark:via-purple-950/20">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-lg bg-purple-500/10">
                <Brain className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h1 className="text-4xl font-bold">Neuro-Olfaction</h1>
            </div>
            <p className="text-xl text-muted-foreground mb-4">
              Ingénierie Neurobiologique de l'Olfaction
            </p>
            <p className="text-lg text-foreground/80">
              Trois approches révolutionnaires pour comprendre, contrôler et recréer 
              les sensations olfactives au niveau neurobiologique.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        {/* Overview */}
        <Card className="mb-12 p-8 bg-gradient-to-r from-purple-50/50 to-pink-50/50 dark:from-purple-950/20 dark:to-pink-950/20 border-l-4 border-l-purple-500">
          <h2 className="text-2xl font-bold mb-4">Vue d'ensemble</h2>
          <p className="text-foreground/80 leading-relaxed mb-4">
            La Neuro-Olfaction combine trois disciplines majeures pour révolutionner notre compréhension 
            et notre capacité à manipuler les sensations olfactives au niveau neurobiologique. Ces approches 
            ouvrent des perspectives sans précédent en recherche, thérapie et création olfactive.
          </p>
          <div className="grid md:grid-cols-3 gap-4 mt-6">
            <div className="p-4 bg-background rounded-lg">
              <p className="font-semibold mb-2">🧬 Optogénétique</p>
              <p className="text-sm text-foreground/80">Contrôle optique précis des neurones olfactifs</p>
            </div>
            <div className="p-4 bg-background rounded-lg">
              <p className="font-semibold mb-2">🧪 Biosynthèse</p>
              <p className="text-sm text-foreground/80">Production programmée de molécules olfactives</p>
            </div>
            <div className="p-4 bg-background rounded-lg">
              <p className="font-semibold mb-2">🔧 Ingénierie Sensorielle</p>
              <p className="text-sm text-foreground/80">Récepteurs olfactifs synthétiques personnalisés</p>
            </div>
          </div>
        </Card>

        {/* Concepts */}
        <div className="space-y-12">
          {neuroOlfactionConcepts.map((concept) => (
            <Card key={concept.id} className="overflow-hidden border-l-4 border-l-purple-500">
              <div className="p-8">
                {/* Header */}
                <div className="flex items-start gap-4 mb-6">
                  <div className={`p-4 rounded-lg bg-gradient-to-br ${concept.color} text-white flex-shrink-0`}>
                    {concept.icon}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-3xl font-bold mb-1">{concept.name}</h2>
                    <p className="text-muted-foreground text-lg">{concept.subtitle}</p>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-6 p-4 bg-muted/30 rounded-lg">
                  <p className="text-foreground/80 leading-relaxed">{concept.description}</p>
                </div>

                {/* Tabs */}
                <Tabs defaultValue="basis" className="w-full">
                  <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="basis">Fondements</TabsTrigger>
                    <TabsTrigger value="applications">Applications</TabsTrigger>
                    <TabsTrigger value="protocol">Protocole</TabsTrigger>
                    <TabsTrigger value="molecules">Molécules</TabsTrigger>
                    <TabsTrigger value="references">Références</TabsTrigger>
                  </TabsList>

                  {/* Fondements Tab */}
                  <TabsContent value="basis" className="space-y-4 pt-4">
                    <p className="text-foreground/80 leading-relaxed">{concept.scientificBasis}</p>
                  </TabsContent>

                  {/* Applications Tab */}
                  <TabsContent value="applications" className="space-y-3 pt-4">
                    {concept.applications.map((app, idx) => (
                      <div key={idx} className="flex gap-3">
                        <span className="text-purple-600 font-bold flex-shrink-0">✓</span>
                        <span className="text-foreground/80">{app}</span>
                      </div>
                    ))}
                  </TabsContent>

                  {/* Protocole Tab */}
                  <TabsContent value="protocol" className="space-y-4 pt-4">
                    <h3 className="font-semibold text-lg">{concept.protocol.title}</h3>
                    <div className="space-y-4">
                      {concept.protocol.steps.map((step) => (
                        <div key={step.number} className="border-l-4 border-l-purple-500 pl-4 py-2">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-semibold">
                              Étape {step.number}: {step.title}
                            </h4>
                            <Badge variant="outline" className="text-xs">{step.duration}</Badge>
                          </div>
                          <p className="text-sm text-foreground/80 mb-2">{step.description}</p>
                          <p className="text-xs text-muted-foreground">
                            <strong>Équipement:</strong> {step.equipment.join(", ")}
                          </p>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  {/* Molécules Tab */}
                  <TabsContent value="molecules" className="space-y-4 pt-4">
                    <div className="flex flex-wrap gap-2">
                      {concept.molecules.map((mol, idx) => (
                        <Badge key={idx} variant="secondary" className="text-sm">{mol}</Badge>
                      ))}
                    </div>
                    <div className="mt-6 space-y-3">
                      <p className="font-semibold">Résultats Attendus</p>
                      {concept.expectedOutcomes.map((outcome, idx) => (
                        <div key={idx} className="flex gap-2 text-sm text-foreground/80">
                          <span className="text-green-600 font-bold">→</span>
                          <span>{outcome}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 space-y-3 p-4 bg-red-50/50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-900">
                      <p className="font-semibold text-red-700 dark:text-red-400">Risques Identifiés</p>
                      {concept.risks.map((risk, idx) => (
                        <div key={idx} className="flex gap-2 text-sm text-red-700 dark:text-red-400">
                          <span className="font-bold">⚠</span>
                          <span>{risk}</span>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  {/* Références Tab */}
                  <TabsContent value="references" className="space-y-3 pt-4">
                    {concept.references.map((ref, idx) => (
                      <div key={idx} className="text-sm text-foreground/80 leading-relaxed">
                        <span className="font-semibold">[{idx + 1}]</span> {ref}
                      </div>
                    ))}
                  </TabsContent>
                </Tabs>
              </div>
            </Card>
          ))}
        </div>

        {/* Integration Section */}
        <Card className="mt-16 p-8 border-l-4 border-l-purple-500">
          <div className="flex items-start gap-4 mb-4">
            <TrendingUp className="h-8 w-8 text-purple-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-2xl font-bold mb-2">Intégration Synergique</h3>
              <p className="text-muted-foreground">Convergence des trois approches neuro-olfactives</p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div className="p-4 bg-muted/30 rounded-lg">
              <p className="font-semibold mb-2">1. Biosynthèse → Optogénétique</p>
              <p className="text-sm text-foreground/80">
                Molécules olfactives produites par biosynthèse → Activation optogénétique des neurones 
                olfactifs → Sensation olfactive synthétique programmable
              </p>
            </div>
            <div className="p-4 bg-muted/30 rounded-lg">
              <p className="font-semibold mb-2">2. Ingénierie Sensorielle → Optogénétique</p>
              <p className="text-sm text-foreground/80">
                Récepteurs olfactifs synthétiques → Couplage avec opsines → Détection et activation 
                ultra-précises de molécules olfactives spécifiques
              </p>
            </div>
            <div className="p-4 bg-muted/30 rounded-lg">
              <p className="font-semibold mb-2">3. Biosynthèse + Ingénierie → Diagnostic</p>
              <p className="text-sm text-foreground/80">
                Production de biomarqueurs olfactifs rares + Récepteurs synthétiques spécifiques 
                → Diagnostic médical ultra-sensible et précis
              </p>
            </div>
          </div>
        </Card>

        {/* Navigation */}
        <div className="flex gap-4 mt-12 justify-center flex-wrap">
          <Link href="/absorbe-x">
            <Button variant="outline">Dashboard ABSORBE X</Button>
          </Link>
          <Link href="/absorbe-x/quantique">
            <Button variant="outline">Olfaction Quantique</Button>
          </Link>
          <Link href="/absorbe-x/patrimoine">
            <Button variant="outline">Patrimoine Olfactif</Button>
          </Link>
          <Link href="/absorbe-x/manifeste">
            <Button variant="outline">Manifeste</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
