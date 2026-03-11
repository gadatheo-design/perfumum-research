// @ts-nocheck
import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import { DynamicBreadcrumb } from "@/components/DynamicBreadcrumb";

interface ResearchNote {
  id: number;
  title: string;
  concept: string;
  innovation: string;
  application: string;
  color: string;
}

const researchNotes: ResearchNote[] = [
  {
    id: 1,
    title: "Olfaction Quantique & Résonance Vibratoire",
    concept: "Dépasser la théorie 'clé-serrure' (forme) pour explorer la théorie vibratoire de Luca Turin. L'odorat détecterait les fréquences de vibration infrarouge des liaisons moléculaires par effet tunnel électronique quantique.",
    innovation: "Créer des 'isomères vibratoires' (molécules de même forme mais aux isotopes différents, ex: deutérium) pour modifier l'odeur sans changer la structure chimique.",
    application: "'Accord Quantique' où l'on ajuste la signature vibratoire pour simuler des molécules rares ou inexistantes.",
    color: "from-purple-500 to-indigo-600"
  },
  {
    id: 2,
    title: "Optogénétique Olfactive & 'Odeurs Fantômes'",
    concept: "Utiliser la lumière pour stimuler directement les neurones olfactifs (via des opsines).",
    innovation: "Créer des expériences sensorielles hybrides où une substance chimique (résine) est couplée à une stimulation lumineuse spécifique pour 'débloquer' des notes olfactives inaccessibles chimiquement.",
    application: "Dispositifs de consommation (vaporisateurs) intégrant des LED à fréquences spécifiques pour moduler la perception des terpènes en temps réel.",
    color: "from-pink-500 to-rose-600"
  },
  {
    id: 3,
    title: "Biosynthèse de Terpènes 'Extraterrestres'",
    concept: "Utiliser la biologie synthétique (levures/bactéries éditées) pour produire des terpénoïdes qui n'existent pas dans la nature terrestre ou qui sont produits par des voies métaboliques théoriques.",
    innovation: "Ingénierie de voies métaboliques pour créer des molécules 'miroirs' (chirales) ou des hybrides terpène-alcaloïde ultra-stables.",
    application: "Création de la gamme 'Absorbe Bio-Synth' avec des profils olfactifs impossibles à extraire du végétal classique.",
    color: "from-green-500 to-emerald-600"
  },
  {
    id: 4,
    title: "Neuro-Ingénierie & Olfaction Augmentée",
    concept: "Interface Cerveau-Machine (BCI) pour décoder et amplifier les signaux olfactifs.",
    innovation: "'Nez Numérique' capable de traduire une signature moléculaire complexe en une émotion ou une image mentale précise, puis de la réinjecter via stimulation neuronale.",
    application: "Le 'Curing Digital' - simuler des années de vieillissement olfactif en quelques secondes par manipulation de la perception temporelle du système olfactif.",
    color: "from-blue-500 to-cyan-600"
  },
  {
    id: 5,
    title: "Matériaux Olfactifs Intelligents & Nanotechnologie",
    concept: "Utiliser des nanomatériaux (MOF - Metal-Organic Frameworks) pour encapsuler et libérer des terpènes de manière programmée.",
    innovation: "Création de 'Résines à Libération Séquentielle' où les molécules sont libérées non pas par la chaleur, mais par des stimuli spécifiques (pH de la salive, humidité, ou même fréquences sonores via piézoélectricité).",
    application: "Des supports de consommation qui changent de profil olfactif toutes les 5 minutes de manière autonome, créant une narration olfactive dynamique.",
    color: "from-cyan-500 to-blue-600"
  },
  {
    id: 6,
    title: "Olfaction & États Modifiés de Conscience (ASC)",
    concept: "Étudier l'impact de la stimulation mécanique et chimique de l'épithélium olfactif sur les ondes cérébrales (Alpha/Thêta).",
    innovation: "'Accords de Synchronisation' conçus pour induire des états de transe ou de relaxation profonde en synchronisant la libération de molécules avec des cycles de respiration guidée (Pranayama olfactif).",
    application: "Protocoles de 'Curing Mental' où l'utilisateur utilise des profils olfactifs pour ancrer ou déclencher des états de conscience spécifiques.",
    color: "from-orange-500 to-amber-600"
  },
  {
    id: 7,
    title: "Consolidation de la Mémoire par l'Odeur (Targeted Memory Reactivation)",
    concept: "Utiliser des odeurs spécifiques pendant le sommeil pour réactiver et consolider des souvenirs ou des apprentissages.",
    innovation: "Création de 'Blends de Rêve' (Dream Blends) conçus pour être diffusés pendant les phases de sommeil lent (Slow-Wave Sleep) afin de manipuler le contenu onirique ou d'améliorer la rétention d'informations techniques.",
    application: "Un système de 'Learning Olfactif' où l'étude du livret technique Absorbe est couplée à une signature olfactive unique, réactivée la nuit pour une mémorisation parfaite.",
    color: "from-red-500 to-pink-600"
  }
];

export function AbsorbeXNotesRecherche() {
  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <div className="border-b bg-muted/30">
        <div className="container mx-auto px-4 py-4">
          <DynamicBreadcrumb />
        </div>
      </div>

      {/* Hero */}
      <div className="border-b bg-gradient-to-r from-background via-indigo-50/50 to-background dark:via-indigo-950/20">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold mb-4">Notes de Recherche</h1>
            <p className="text-xl text-muted-foreground">
              Frontières de l'Olfaction — 7 Axes Conceptuels
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <p className="text-lg text-foreground/80 mb-12">
            Explorez les sept axes conceptuels qui redéfinissent les frontières de l'olfaction, 
            transformant la recherche en une exploration des possibles chimiques, biologiques et neurologiques.
          </p>

          {/* Research Notes */}
          <div className="space-y-8">
            {researchNotes.map((note) => (
              <Card key={note.id} className="p-8 border-l-4 border-l-transparent hover:border-l-purple-500 transition-colors">
                <div className="flex items-start gap-4 mb-4">
                  <Badge className={`bg-gradient-to-r ${note.color} text-white flex-shrink-0`}>
                    {note.id}
                  </Badge>
                  <h2 className="text-2xl font-bold">{note.title}</h2>
                </div>

                <div className="space-y-4 text-foreground/80">
                  <div>
                    <p className="font-semibold text-foreground mb-2">Concept</p>
                    <p className="leading-relaxed">{note.concept}</p>
                  </div>

                  <div>
                    <p className="font-semibold text-foreground mb-2">Innovation</p>
                    <p className="leading-relaxed">{note.innovation}</p>
                  </div>

                  <div>
                    <p className="font-semibold text-foreground mb-2">Application</p>
                    <p className="leading-relaxed">{note.application}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Key Insights */}
          <Card className="mt-12 p-8 bg-muted/50">
            <h3 className="text-2xl font-bold mb-6">Insights Clés</h3>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-1 bg-purple-500 flex-shrink-0 rounded-full"></div>
                <div>
                  <p className="font-semibold mb-1">Dépassement des Limites Chimiques</p>
                  <p className="text-foreground/70">
                    Les axes quantique et biosynthétique permettent de créer des molécules et des expériences olfactives 
                    impossibles par la chimie organique classique.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-1 bg-pink-500 flex-shrink-0 rounded-full"></div>
                <div>
                  <p className="font-semibold mb-1">Manipulation de la Perception</p>
                  <p className="text-foreground/70">
                    L'optogénétique et la neuro-ingénierie ouvrent des possibilités de contrôle direct de la perception 
                    olfactive, transformant le rôle du formulateur.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-1 bg-cyan-500 flex-shrink-0 rounded-full"></div>
                <div>
                  <p className="font-semibold mb-1">Narration Olfactive Dynamique</p>
                  <p className="text-foreground/70">
                    Les matériaux intelligents et les workflows programmés permettent de créer des expériences olfactives 
                    non-linéaires et évolutives.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-1 bg-green-500 flex-shrink-0 rounded-full"></div>
                <div>
                  <p className="font-semibold mb-1">Intégration Neurocognitive</p>
                  <p className="text-foreground/70">
                    L'olfaction devient un outil de manipulation cognitive, de consolidation de mémoire et d'induction 
                    d'états de conscience spécifiques.
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Navigation */}
          <div className="flex gap-4 mt-12 flex-wrap">
            <Link href="/absorbe-x">
              <Button variant="outline">Retour au Dashboard</Button>
            </Link>
            <Link href="/absorbe-x/manifeste">
              <Button variant="outline">Manifeste de Recherche</Button>
            </Link>
            <Link href="/absorbe-x/guide-laboratoire">
              <Button className="gap-2">
                Guide de Laboratoire
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
