import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Link } from "wouter";
import { 
  Download, Wind, MapPin, Sparkles, Flame, 
  Volume2, Camera, FileText, ArrowRight, Layers,
  FlaskConical, Microscope, BookOpen, Lightbulb,
  Target, ChevronRight, Play, Pause, RotateCcw,
  CheckCircle2, Circle, AlertCircle, Info, Beaker,
  Thermometer, Clock, Scale, Eye, Ear, Hand
} from "lucide-react";
import { exportMethodologyPDF } from "@/lib/pdfExport";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Données des 7 dimensions ABSORBE
const dimensions = [
  {
    id: "air",
    letter: "A",
    title: "Air",
    subtitle: "Captation atmosphérique",
    icon: Wind,
    color: "sky",
    gradient: "from-sky-500 to-blue-600",
    bgColor: "bg-sky-100 dark:bg-sky-900/30",
    textColor: "text-sky-600 dark:text-sky-400",
    borderColor: "border-sky-500/30",
    description: "Captation et analyse de l'atmosphère olfactive d'un lieu. Prélèvement sur tubes Tenax TA, analyse GC-MS pour identifier les molécules volatiles présentes dans l'air ambiant.",
    protocol: [
      "Préparation des tubes Tenax TA (désorption thermique préalable)",
      "Positionnement à 1.5m du sol, orientation face au vent dominant",
      "Pompage à débit constant (100ml/min) pendant 30 minutes",
      "Conservation à 4°C dans tubes hermétiques",
      "Analyse GC-MS dans les 48h suivant le prélèvement"
    ],
    equipment: ["Tubes Tenax TA", "Pompe portable", "Débitmètre", "Glacière", "GPS"],
    molecules: ["Terpènes", "Aldéhydes", "Cétones", "Esters", "Composés soufrés"],
    tips: "Éviter les prélèvements par temps de pluie ou vent fort (>30km/h). Privilégier les créneaux 10h-12h et 16h-18h."
  },
  {
    id: "lieu",
    letter: "B",
    title: "Lieu",
    subtitle: "Documentation contextuelle",
    icon: MapPin,
    color: "emerald",
    gradient: "from-emerald-500 to-green-600",
    bgColor: "bg-emerald-100 dark:bg-emerald-900/30",
    textColor: "text-emerald-600 dark:text-emerald-400",
    borderColor: "border-emerald-500/30",
    description: "Documentation du contexte spatial et temporel. Cartographie sensorielle, relevés météorologiques, analyse de la géologie et de la végétation pour comprendre l'identité olfactive d'un territoire.",
    protocol: [
      "Relevé GPS précis (coordonnées, altitude, orientation)",
      "Documentation météorologique (T°, humidité, pression, vent)",
      "Cartographie de la végétation dans un rayon de 50m",
      "Analyse pédologique (type de sol, pH, humidité)",
      "Identification des sources d'odeurs potentielles"
    ],
    equipment: ["GPS haute précision", "Station météo portable", "pH-mètre", "Cartes IGN", "Boussole"],
    molecules: ["Géosmine", "2-MIB", "Terpènes de sol", "Composés humiques"],
    tips: "Documenter les variations saisonnières. Un même lieu peut avoir des signatures olfactives très différentes selon la saison."
  },
  {
    id: "odeur",
    letter: "S",
    title: "Odeur",
    subtitle: "Évaluation sensorielle",
    icon: Sparkles,
    color: "purple",
    gradient: "from-purple-500 to-violet-600",
    bgColor: "bg-purple-100 dark:bg-purple-900/30",
    textColor: "text-purple-600 dark:text-purple-400",
    borderColor: "border-purple-500/30",
    description: "Évaluation sensorielle selon les 7 axes ABSORBE (Atmosphérique, Brut, Solaire, Organique, Résineux, Balsamique, Épicé). Création de profils olfactifs détaillés pour chaque site étudié.",
    protocol: [
      "Acclimatation olfactive de 5 minutes sur site",
      "Évaluation des 7 axes sur échelle 0-10",
      "Description libre des impressions sensorielles",
      "Identification des notes dominantes et secondaires",
      "Comparaison avec références olfactives connues"
    ],
    equipment: ["Fiches d'évaluation ABSORBE", "Références olfactives", "Chronomètre", "Carnet de terrain"],
    molecules: ["Toutes familles chimiques"],
    tips: "Éviter le café et les parfums avant l'évaluation. Prévoir des pauses olfactives régulières pour éviter la fatigue sensorielle."
  },
  {
    id: "fume",
    letter: "O",
    title: "Fumé",
    subtitle: "Pyrolyse contrôlée",
    icon: Flame,
    color: "orange",
    gradient: "from-orange-500 to-red-600",
    bgColor: "bg-orange-100 dark:bg-orange-900/30",
    textColor: "text-orange-600 dark:text-orange-400",
    borderColor: "border-orange-500/30",
    description: "Pyrolyse contrôlée des matériaux organiques prélevés. Analyse des composés volatils générés par combustion à différentes températures (120°C, 160°C, 200°C) pour révéler les notes fumées latentes.",
    protocol: [
      "Séchage préalable des échantillons (24h à 40°C)",
      "Pesée précise (1g ± 0.01g)",
      "Pyrolyse à 120°C pendant 5 minutes",
      "Pyrolyse à 160°C pendant 5 minutes",
      "Pyrolyse à 200°C pendant 5 minutes",
      "Collecte des volatils sur tubes Tenax"
    ],
    equipment: ["Four de pyrolyse", "Balance de précision", "Tubes Tenax", "Thermomètre IR", "Chronomètre"],
    molecules: ["Guaiacol", "Syringol", "Créosol", "Furfural", "Maltol"],
    tips: "La température de pyrolyse influence fortement le profil aromatique. 120°C révèle les notes douces, 200°C les notes plus âcres."
  },
  {
    id: "son",
    letter: "R",
    title: "Son",
    subtitle: "Archive sonore",
    icon: Volume2,
    color: "pink",
    gradient: "from-pink-500 to-rose-600",
    bgColor: "bg-pink-100 dark:bg-pink-900/30",
    textColor: "text-pink-600 dark:text-pink-400",
    borderColor: "border-pink-500/30",
    description: "Enregistrement de l'environnement sonore du lieu. Création d'une archive audio contextuelle permettant de restituer l'atmosphère globale lors de la captation olfactive.",
    protocol: [
      "Configuration du matériel (48kHz, 24bit, stéréo)",
      "Test de niveau et ajustement du gain",
      "Enregistrement ambiant de 10 minutes minimum",
      "Captation des sons caractéristiques isolés",
      "Annotation temporelle des événements sonores"
    ],
    equipment: ["Enregistreur portable", "Microphones stéréo", "Bonnette anti-vent", "Casque monitoring", "Carte SD"],
    molecules: [],
    tips: "Les sons participent à la mémoire olfactive. Un enregistrement de qualité permet de 'revivre' l'expérience sensorielle complète."
  },
  {
    id: "image",
    letter: "B",
    title: "Image",
    subtitle: "Documentation visuelle",
    icon: Camera,
    color: "amber",
    gradient: "from-amber-500 to-yellow-600",
    bgColor: "bg-amber-100 dark:bg-amber-900/30",
    textColor: "text-amber-600 dark:text-amber-400",
    borderColor: "border-amber-500/30",
    description: "Documentation visuelle du terrain (photographie, vidéo). Archivage des textures, matériaux, lumières et ambiances visuelles qui accompagnent l'expérience olfactive du lieu.",
    protocol: [
      "Vue panoramique 360° du site",
      "Photos des sources d'odeurs identifiées",
      "Macrophotographie des textures et matériaux",
      "Documentation de la végétation",
      "Vidéo d'ambiance (1-2 minutes)"
    ],
    equipment: ["Appareil photo", "Objectif macro", "Trépied", "Drone (optionnel)", "Carte mémoire"],
    molecules: [],
    tips: "La lumière influence la perception. Documenter les variations lumineuses au cours de la journée."
  },
  {
    id: "texte",
    letter: "E",
    title: "Texte",
    subtitle: "Notes de terrain",
    icon: FileText,
    color: "indigo",
    gradient: "from-indigo-500 to-blue-600",
    bgColor: "bg-indigo-100 dark:bg-indigo-900/30",
    textColor: "text-indigo-600 dark:text-indigo-400",
    borderColor: "border-indigo-500/30",
    description: "Rédaction de notes de terrain, descriptions sensorielles et analyses critiques. Documentation écrite des impressions, hypothèses et découvertes tout au long du processus de recherche.",
    protocol: [
      "Description libre des premières impressions",
      "Notation structurée selon grille ABSORBE",
      "Hypothèses sur les sources olfactives",
      "Comparaisons avec expériences précédentes",
      "Questions et pistes de recherche"
    ],
    equipment: ["Carnet de terrain", "Stylos", "Fiches ABSORBE", "Dictaphone (backup)"],
    molecules: [],
    tips: "Écrire immédiatement après l'expérience. La mémoire olfactive est volatile et les détails s'estompent rapidement."
  }
];

// Échelle ABSORBE (7 axes)
const absorbeAxes = [
  { id: "A", name: "Atmosphérique", description: "Aérien, éthéré, diffus, spatial", color: "sky", examples: ["Encens", "Calone", "Aldéhydes", "Iso E Super"] },
  { id: "B", name: "Brut", description: "Minéral, pierreux, métallique, sec", color: "stone", examples: ["Géosmine", "Vétiver", "Cuir", "Encre"] },
  { id: "S", name: "Solaire", description: "Chaud, lumineux, radiant, doré", color: "amber", examples: ["Héliotropine", "Benzaldéhyde", "Vanilline"] },
  { id: "O", name: "Organique", description: "Vivant, animal, corporel, charnel", color: "rose", examples: ["Muscone", "Civettone", "Indole", "Skatole"] },
  { id: "R", name: "Résineux", description: "Collant, visqueux, ambré, baumé", color: "orange", examples: ["Benjoin", "Styrax", "Labdanum", "Opoponax"] },
  { id: "B2", name: "Balsamique", description: "Doux, enveloppant, onctueux, velouté", color: "purple", examples: ["Vanille", "Tolu", "Pérou", "Coumarine"] },
  { id: "E", name: "Épicé", description: "Piquant, chaud, aromatique, vibrant", color: "red", examples: ["Eugénol", "Cinnamaldéhyde", "Poivre", "Gingembre"] }
];

// Composant de radar interactif simplifié
function AbsorbeRadar({ values, onChange }: { values: number[]; onChange?: (index: number, value: number) => void }) {
  const size = 280;
  const center = size / 2;
  const maxRadius = size / 2 - 40;
  const levels = 5;

  const getPoint = (index: number, value: number) => {
    const angle = (Math.PI * 2 * index) / 7 - Math.PI / 2;
    const radius = (value / 10) * maxRadius;
    return {
      x: center + radius * Math.cos(angle),
      y: center + radius * Math.sin(angle)
    };
  };

  const points = values.map((v, i) => getPoint(i, v));
  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="w-full max-w-[280px] mx-auto">
      {/* Grille */}
      {Array.from({ length: levels }).map((_, level) => {
        const radius = ((level + 1) / levels) * maxRadius;
        const gridPoints = Array.from({ length: 7 }).map((_, i) => {
          const angle = (Math.PI * 2 * i) / 7 - Math.PI / 2;
          return `${center + radius * Math.cos(angle)},${center + radius * Math.sin(angle)}`;
        });
        return (
          <polygon
            key={level}
            points={gridPoints.join(' ')}
            fill="none"
            stroke="currentColor"
            strokeOpacity={0.1}
            strokeWidth={1}
          />
        );
      })}

      {/* Axes */}
      {absorbeAxes.map((axis, i) => {
        const angle = (Math.PI * 2 * i) / 7 - Math.PI / 2;
        const endX = center + maxRadius * Math.cos(angle);
        const endY = center + maxRadius * Math.sin(angle);
        const labelX = center + (maxRadius + 25) * Math.cos(angle);
        const labelY = center + (maxRadius + 25) * Math.sin(angle);
        
        return (
          <g key={axis.id}>
            <line
              x1={center}
              y1={center}
              x2={endX}
              y2={endY}
              stroke="currentColor"
              strokeOpacity={0.2}
              strokeWidth={1}
            />
            <text
              x={labelX}
              y={labelY}
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-[10px] fill-muted-foreground font-medium"
            >
              {axis.id === "B2" ? "B" : axis.id}
            </text>
          </g>
        );
      })}

      {/* Zone remplie */}
      <path
        d={pathD}
        fill="hsl(var(--primary))"
        fillOpacity={0.2}
        stroke="hsl(var(--primary))"
        strokeWidth={2}
      />

      {/* Points */}
      {points.map((p, i) => (
        <circle
          key={i}
          cx={p.x}
          cy={p.y}
          r={6}
          fill="hsl(var(--primary))"
          stroke="white"
          strokeWidth={2}
          className="cursor-pointer hover:r-8 transition-all"
          onClick={() => onChange?.(i, (values[i] + 1) % 11)}
        />
      ))}
    </svg>
  );
}

export default function MethodeAbsorbe() {
  const [selectedDimension, setSelectedDimension] = useState<string | null>(null);
  const [radarValues, setRadarValues] = useState([5, 3, 7, 4, 6, 8, 5]);
  const [activeTab, setActiveTab] = useState("overview");

  const handleExportPDF = () => {
    exportMethodologyPDF("absorbe");
  };

  const handleRadarChange = (index: number, value: number) => {
    const newValues = [...radarValues];
    newValues[index] = value;
    setRadarValues(newValues);
  };

  const selectedDim = dimensions.find(d => d.id === selectedDimension);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Breadcrumbs />
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-16 md:py-20 border-b border-border/50 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background" />
          
          <div className="container relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl mx-auto text-center"
            >
              <Badge variant="outline" className="mb-6 px-4 py-1.5 text-sm font-medium border-primary/20 bg-primary/5 text-primary">
                <Layers className="w-4 h-4 mr-2" />
                Méthodologie de Recherche
              </Badge>
              
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-foreground">
                Méthode ABSORBE
              </h1>
              
              <p className="text-lg text-muted-foreground mb-8">
                Protocole de recherche olfactive développé par PERFUMUM pour la captation, 
                l'analyse et la restitution des atmosphères sensorielles d'un lieu.
              </p>
              
              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-2xl mx-auto mb-8">
                <div className="bg-muted/50 rounded-lg p-3 border border-border/50">
                  <div className="text-2xl font-bold text-foreground">7</div>
                  <div className="text-xs text-muted-foreground">Dimensions</div>
                </div>
                <div className="bg-muted/50 rounded-lg p-3 border border-border/50">
                  <div className="text-2xl font-bold text-foreground">7</div>
                  <div className="text-xs text-muted-foreground">Axes olfactifs</div>
                </div>
                <div className="bg-muted/50 rounded-lg p-3 border border-border/50">
                  <div className="text-2xl font-bold text-foreground">3</div>
                  <div className="text-xs text-muted-foreground">Températures</div>
                </div>
                <div className="bg-muted/50 rounded-lg p-3 border border-border/50">
                  <div className="text-2xl font-bold text-foreground">∞</div>
                  <div className="text-xs text-muted-foreground">Terrains</div>
                </div>
              </div>

              <div className="flex flex-wrap justify-center gap-3">
                <Button onClick={handleExportPDF} className="gap-2">
                  <Download className="w-4 h-4" />
                  Exporter en PDF
                </Button>
                <Link href="/methodologie/echelle-absorbe">
                  <Button variant="outline" className="gap-2">
                    <BookOpen className="w-4 h-4" />
                    Échelle ABSORBE
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Navigation par onglets */}
        <section className="py-8 border-b border-border/50">
          <div className="container">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-4">
                <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
                <TabsTrigger value="dimensions">7 Dimensions</TabsTrigger>
                <TabsTrigger value="scale">Échelle</TabsTrigger>
                <TabsTrigger value="protocols">Protocoles</TabsTrigger>
              </TabsList>

              {/* Vue d'ensemble */}
              <TabsContent value="overview" className="mt-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="max-w-4xl mx-auto space-y-8"
                >
                  {/* Introduction */}
                  <Card className="border-border/50">
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Lightbulb className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold mb-2">Qu'est-ce que ABSORBE ?</h3>
                          <p className="text-muted-foreground leading-relaxed mb-4">
                            <strong className="text-foreground">ABSORBE</strong> est une méthodologie de recherche-création qui articule sept dimensions complémentaires 
                            (Air, Lieu, Odeur, Fumé, Son, Image, Texte) pour documenter et analyser l'identité olfactive d'un territoire.
                          </p>
                          <p className="text-muted-foreground leading-relaxed">
                            Cette approche transdisciplinaire combine chimie analytique, géographie sensorielle et pratiques artistiques 
                            pour produire des accords olfactifs fidèles aux atmosphères captées. PERFUMUM applique cette méthodologie 
                            sur l'ensemble de ses terrains de recherche.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Acronyme visuel */}
                  <Card className="border-border/50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Target className="w-5 h-5 text-primary" />
                        L'acronyme ABSORBE
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-7 gap-2">
                        {dimensions.map((dim, index) => {
                          const Icon = dim.icon;
                          return (
                            <motion.div
                              key={dim.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className={`text-center p-4 rounded-lg border ${dim.borderColor} ${dim.bgColor} cursor-pointer hover:shadow-md transition-all`}
                              onClick={() => setSelectedDimension(dim.id)}
                            >
                              <div className={`text-3xl font-bold ${dim.textColor} mb-2`}>{dim.letter}</div>
                              <Icon className={`w-6 h-6 ${dim.textColor} mx-auto mb-1`} />
                              <div className="text-xs font-medium">{dim.title}</div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Flux de travail */}
                  <Card className="border-border/50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <ArrowRight className="w-5 h-5 text-primary" />
                        Flux de travail
                      </CardTitle>
                      <CardDescription>
                        Les 7 dimensions s'articulent dans un processus itératif
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap items-center justify-center gap-2">
                        {dimensions.map((dim, index) => {
                          const Icon = dim.icon;
                          return (
                            <div key={dim.id} className="flex items-center">
                              <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${dim.bgColor} ${dim.borderColor} border`}>
                                <Icon className={`w-4 h-4 ${dim.textColor}`} />
                                <span className={`text-sm font-medium ${dim.textColor}`}>{dim.title}</span>
                              </div>
                              {index < dimensions.length - 1 && (
                                <ChevronRight className="w-4 h-4 text-muted-foreground mx-1" />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>

              {/* 7 Dimensions */}
              <TabsContent value="dimensions" className="mt-8">
                <div className="max-w-4xl mx-auto space-y-6">
                  {dimensions.map((dim, index) => {
                    const Icon = dim.icon;
                    return (
                      <motion.div
                        key={dim.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Card className={`hover:shadow-lg transition-all duration-300 border-border/50 hover:${dim.borderColor} overflow-hidden`}>
                          <div className={`h-1 bg-gradient-to-r ${dim.gradient}`} />
                          <CardContent className="pt-6">
                            <div className="flex items-start gap-6">
                              <div className={`w-14 h-14 rounded-xl ${dim.bgColor} flex items-center justify-center flex-shrink-0`}>
                                <Icon className={`w-7 h-7 ${dim.textColor}`} />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-3">
                                  <Badge variant="outline" className="text-xs font-mono">
                                    {String(index + 1).padStart(2, '0')}
                                  </Badge>
                                  <h2 className="text-2xl font-bold">{dim.title}</h2>
                                  <span className="text-sm text-muted-foreground">— {dim.subtitle}</span>
                                </div>
                                <p className="text-muted-foreground leading-relaxed mb-4">
                                  {dim.description}
                                </p>
                                
                                <Accordion type="single" collapsible className="w-full">
                                  <AccordionItem value="protocol" className="border-none">
                                    <AccordionTrigger className="text-sm font-medium py-2 hover:no-underline">
                                      <span className="flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-primary" />
                                        Protocole ({dim.protocol.length} étapes)
                                      </span>
                                    </AccordionTrigger>
                                    <AccordionContent>
                                      <ol className="space-y-2 pl-6">
                                        {dim.protocol.map((step, i) => (
                                          <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                                            <span className={`w-5 h-5 rounded-full ${dim.bgColor} ${dim.textColor} flex items-center justify-center text-xs font-medium flex-shrink-0 mt-0.5`}>
                                              {i + 1}
                                            </span>
                                            {step}
                                          </li>
                                        ))}
                                      </ol>
                                    </AccordionContent>
                                  </AccordionItem>
                                  
                                  <AccordionItem value="equipment" className="border-none">
                                    <AccordionTrigger className="text-sm font-medium py-2 hover:no-underline">
                                      <span className="flex items-center gap-2">
                                        <Beaker className="w-4 h-4 text-primary" />
                                        Équipement ({dim.equipment.length} éléments)
                                      </span>
                                    </AccordionTrigger>
                                    <AccordionContent>
                                      <div className="flex flex-wrap gap-2">
                                        {dim.equipment.map((eq, i) => (
                                          <Badge key={i} variant="secondary" className="text-xs">
                                            {eq}
                                          </Badge>
                                        ))}
                                      </div>
                                    </AccordionContent>
                                  </AccordionItem>

                                  {dim.molecules.length > 0 && (
                                    <AccordionItem value="molecules" className="border-none">
                                      <AccordionTrigger className="text-sm font-medium py-2 hover:no-underline">
                                        <span className="flex items-center gap-2">
                                          <FlaskConical className="w-4 h-4 text-primary" />
                                          Molécules cibles ({dim.molecules.length})
                                        </span>
                                      </AccordionTrigger>
                                      <AccordionContent>
                                        <div className="flex flex-wrap gap-2">
                                          {dim.molecules.map((mol, i) => (
                                            <Badge key={i} variant="outline" className={dim.borderColor}>
                                              {mol}
                                            </Badge>
                                          ))}
                                        </div>
                                      </AccordionContent>
                                    </AccordionItem>
                                  )}
                                </Accordion>

                                {dim.tips && (
                                  <div className={`mt-4 p-3 rounded-lg ${dim.bgColor} border ${dim.borderColor}`}>
                                    <div className="flex items-start gap-2">
                                      <Lightbulb className={`w-4 h-4 ${dim.textColor} flex-shrink-0 mt-0.5`} />
                                      <p className="text-sm text-muted-foreground">{dim.tips}</p>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              </TabsContent>

              {/* Échelle ABSORBE */}
              <TabsContent value="scale" className="mt-8">
                <div className="max-w-4xl mx-auto space-y-8">
                  <Card className="border-border/50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Scale className="w-5 h-5 text-primary" />
                        Échelle ABSORBE
                      </CardTitle>
                      <CardDescription>
                        Système de classification olfactive en 7 axes (0-10)
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-8">
                        {/* Radar interactif */}
                        <div className="flex flex-col items-center">
                          <AbsorbeRadar values={radarValues} onChange={handleRadarChange} />
                          <p className="text-xs text-muted-foreground mt-4 text-center">
                            Cliquez sur les points pour modifier les valeurs
                          </p>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => setRadarValues([5, 5, 5, 5, 5, 5, 5])}
                            className="mt-2"
                          >
                            <RotateCcw className="w-4 h-4 mr-2" />
                            Réinitialiser
                          </Button>
                        </div>

                        {/* Liste des axes */}
                        <div className="space-y-3">
                          {absorbeAxes.map((axis, index) => (
                            <div key={axis.id} className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-lg bg-${axis.color}-500/10 flex items-center justify-center`}>
                                <span className={`text-sm font-bold text-${axis.color}-500`}>
                                  {axis.id === "B2" ? "B" : axis.id}
                                </span>
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <span className="font-medium text-sm">{axis.name}</span>
                                  <span className="text-sm font-mono text-primary">{radarValues[index]}/10</span>
                                </div>
                                <Progress value={radarValues[index] * 10} className="h-1.5 mt-1" />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Détail des axes */}
                  <div className="grid md:grid-cols-2 gap-4">
                    {absorbeAxes.map((axis) => (
                      <Card key={axis.id} className={`border-${axis.color}-500/30`}>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base flex items-center gap-2">
                            <span className={`w-6 h-6 rounded bg-${axis.color}-500/10 flex items-center justify-center text-xs font-bold text-${axis.color}-500`}>
                              {axis.id === "B2" ? "B" : axis.id}
                            </span>
                            {axis.name}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground mb-3">{axis.description}</p>
                          <div className="flex flex-wrap gap-1">
                            {axis.examples.map((ex, i) => (
                              <Badge key={i} variant="secondary" className="text-xs">
                                {ex}
                              </Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>

              {/* Protocoles techniques */}
              <TabsContent value="protocols" className="mt-8">
                <div className="max-w-4xl mx-auto space-y-6">
                  {/* Pyrolyse */}
                  <Card className="border-2 border-orange-500/30 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                          <Flame className="w-6 h-6 text-orange-600" />
                        </div>
                        <div>
                          <CardTitle>Pyrolyse Contrôlée</CardTitle>
                          <CardDescription>Protocole de dégradation thermique</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-muted-foreground">
                        La pyrolyse permet de révéler les composés volatils latents des matériaux organiques. 
                        Trois températures sont utilisées pour obtenir des profils aromatiques distincts.
                      </p>
                      
                      <div className="grid md:grid-cols-3 gap-4">
                        {[
                          { temp: 120, label: "Douce", notes: "Notes douces, miellées, caramélisées", color: "amber" },
                          { temp: 160, label: "Moyenne", notes: "Notes boisées, fumées légères", color: "orange" },
                          { temp: 200, label: "Intense", notes: "Notes âcres, goudronnées, empyreumatiques", color: "red" }
                        ].map((level) => (
                          <div key={level.temp} className={`p-4 rounded-lg border border-${level.color}-500/30 bg-${level.color}-500/5`}>
                            <div className="flex items-center gap-2 mb-2">
                              <Thermometer className={`w-5 h-5 text-${level.color}-500`} />
                              <span className="text-2xl font-bold">{level.temp}°C</span>
                            </div>
                            <div className="font-medium text-sm mb-1">{level.label}</div>
                            <p className="text-xs text-muted-foreground">{level.notes}</p>
                          </div>
                        ))}
                      </div>

                      <Link href="/methodologie/pyrolyse">
                        <Button variant="outline" className="w-full mt-4 gap-2 border-orange-500/30 text-orange-600 hover:bg-orange-500/10">
                          <ArrowRight className="w-4 h-4" />
                          Lire le protocole complet
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>

                  {/* GC-MS */}
                  <Card className="border-2 border-blue-500/30 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                          <Microscope className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <CardTitle>Chromatographie GC-MS</CardTitle>
                          <CardDescription>Analyse et identification moléculaire</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-muted-foreground">
                        La chromatographie en phase gazeuse couplée à la spectrométrie de masse permet 
                        d'identifier et de quantifier les composés volatils présents dans les échantillons.
                      </p>
                      
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="p-4 rounded-lg border border-blue-500/30 bg-blue-500/5">
                          <h4 className="font-medium mb-2 flex items-center gap-2">
                            <Clock className="w-4 h-4 text-blue-500" />
                            Paramètres d'analyse
                          </h4>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            <li>• Colonne: DB-5ms (30m × 0.25mm)</li>
                            <li>• Gaz vecteur: Hélium (1ml/min)</li>
                            <li>• Programme: 40°C → 280°C (5°C/min)</li>
                            <li>• Ionisation: EI 70eV</li>
                          </ul>
                        </div>
                        <div className="p-4 rounded-lg border border-blue-500/30 bg-blue-500/5">
                          <h4 className="font-medium mb-2 flex items-center gap-2">
                            <Target className="w-4 h-4 text-blue-500" />
                            Standards internes
                          </h4>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            <li>• n-Alcanes (C8-C30)</li>
                            <li>• Toluène-d8</li>
                            <li>• Naphtalène-d8</li>
                            <li>• Phénanthrène-d10</li>
                          </ul>
                        </div>
                      </div>

                      <Link href="/methodologie/gc-ms">
                        <Button variant="outline" className="w-full mt-4 gap-2 border-blue-500/30 text-blue-600 hover:bg-blue-500/10">
                          <ArrowRight className="w-4 h-4" />
                          Lire le protocole complet
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* Navigation vers pages connexes */}
        <section className="py-12 bg-muted/20">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <h3 className="font-semibold mb-6 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                Pages connexes
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link href="/projets">
                  <div className="block p-4 bg-background rounded-lg border border-border/50 hover:border-primary/50 transition-colors cursor-pointer">
                    <div className="font-medium flex items-center gap-2">
                      <ArrowRight className="w-4 h-4 text-primary" />
                      Projets terrain
                    </div>
                    <div className="text-sm text-muted-foreground">Découvrir les terrains de recherche</div>
                  </div>
                </Link>
                <Link href="/archives-terrain">
                  <div className="block p-4 bg-background rounded-lg border border-border/50 hover:border-primary/50 transition-colors cursor-pointer">
                    <div className="font-medium flex items-center gap-2">
                      <ArrowRight className="w-4 h-4 text-primary" />
                      Archives de terrain
                    </div>
                    <div className="text-sm text-muted-foreground">Explorer les captations documentées</div>
                  </div>
                </Link>
                <Link href="/methodologie/echelle-absorbe">
                  <div className="block p-4 bg-background rounded-lg border border-border/50 hover:border-primary/50 transition-colors cursor-pointer">
                    <div className="font-medium flex items-center gap-2">
                      <ArrowRight className="w-4 h-4 text-primary" />
                      Échelle ABSORBE
                    </div>
                    <div className="text-sm text-muted-foreground">Classification olfactive détaillée</div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
