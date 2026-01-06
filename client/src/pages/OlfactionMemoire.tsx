import { useState } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { 
  Brain, 
  History, 
  BookOpen, 
  Lightbulb, 
  Search,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Heart,
  Zap,
  Globe,
  FlaskConical,
  ScrollText
} from "lucide-react";

// Catégories d'articles avec leurs icônes et descriptions
const CATEGORIES = [
  { 
    id: "neurological", 
    label: "Neurologique", 
    icon: Brain, 
    color: "bg-purple-500/10 text-purple-600 border-purple-200",
    description: "Mécanismes cérébraux du lien olfaction-mémoire"
  },
  { 
    id: "historical", 
    label: "Historique", 
    icon: History, 
    color: "bg-amber-500/10 text-amber-600 border-amber-200",
    description: "Rituels et pratiques olfactives à travers les âges"
  },
  { 
    id: "psychological", 
    label: "Psychologique", 
    icon: Heart, 
    color: "bg-rose-500/10 text-rose-600 border-rose-200",
    description: "Émotions et bien-être liés aux odeurs"
  },
  { 
    id: "cultural", 
    label: "Culturel", 
    icon: Globe, 
    color: "bg-blue-500/10 text-blue-600 border-blue-200",
    description: "Transmission et patrimoine olfactif"
  },
  { 
    id: "scientific_study", 
    label: "Études scientifiques", 
    icon: FlaskConical, 
    color: "bg-emerald-500/10 text-emerald-600 border-emerald-200",
    description: "Recherches et publications académiques"
  },
  { 
    id: "therapeutic", 
    label: "Thérapeutique", 
    icon: Zap, 
    color: "bg-cyan-500/10 text-cyan-600 border-cyan-200",
    description: "Applications médicales et bien-être"
  },
];

// Types de concepts
const CONCEPT_TYPES = [
  { id: "phenomenon", label: "Phénomènes", icon: Sparkles },
  { id: "brain_structure", label: "Structures cérébrales", icon: Brain },
  { id: "memory_type", label: "Types de mémoire", icon: BookOpen },
  { id: "mechanism", label: "Mécanismes", icon: Zap },
  { id: "disorder", label: "Troubles", icon: Heart },
  { id: "therapy", label: "Thérapies", icon: FlaskConical },
  { id: "ritual", label: "Rituels", icon: History },
];

// Données statiques pour l'introduction (à remplacer par données dynamiques)
const INTRO_CONTENT = {
  title: "Olfaction & Mémoire",
  subtitle: "Explorer les liens profonds entre les odeurs et nos souvenirs",
  description: `
    L'odorat est le sens le plus directement connecté à notre mémoire et à nos émotions. 
    Cette section explore les mécanismes neurologiques de cette connexion unique, 
    ainsi que l'histoire de l'utilisation des parfums dans les rituels de mémoire 
    à travers les civilisations.
  `,
  keyFacts: [
    {
      title: "Effet Proust",
      description: "Une odeur peut déclencher instantanément des souvenirs autobiographiques vivaces et émotionnellement chargés.",
      icon: Sparkles,
    },
    {
      title: "Connexion directe",
      description: "Le bulbe olfactif est directement connecté à l'hippocampe et l'amygdale, centres de la mémoire et des émotions.",
      icon: Brain,
    },
    {
      title: "Mémoire rituelle",
      description: "Depuis l'Antiquité, les parfums sont utilisés dans les rituels religieux pour créer des ancrages mémoriels collectifs.",
      icon: History,
    },
    {
      title: "Applications thérapeutiques",
      description: "L'aromathérapie et les techniques OSTMR utilisent les odeurs pour traiter certains troubles de la mémoire.",
      icon: Heart,
    },
  ],
};

// Sources de référence (données statiques pour l'instant)
const REFERENCE_SOURCES = [
  {
    title: "How scent, emotion, and memory are intertwined",
    source: "Harvard Gazette",
    year: 2020,
    url: "https://news.harvard.edu/gazette/story/2020/02/how-scent-emotion-and-memory-are-intertwined-and-exploited/",
    type: "article",
  },
  {
    title: "Why odors trigger powerful memories",
    source: "Northwestern University",
    year: 2021,
    url: "https://news.northwestern.edu/stories/2021/03/why-odors-trigger-powerful-memories",
    type: "scientific_paper",
  },
  {
    title: "L'émergence des arts olfactifs",
    source: "Nez Magazine - Clara Muller",
    year: 2025,
    url: "https://mag.bynez.com/podcastsbynez-parfum/smell-talks-lemergence-des-arts-olfactifs-histoire-et-conceptions-occidentales/",
    type: "podcast",
  },
  {
    title: "Les monothéismes à travers la fumée",
    source: "Nez Magazine",
    year: 2025,
    url: "https://mag.bynez.com/histoire-parfum-olfaction/les-monotheismes-a-travers-la-fumee/",
    type: "article",
  },
  {
    title: "Nez à nez : neurosciences et spectacle vivant",
    source: "GDR O3 / CNRS",
    year: 2025,
    url: "https://mag.bynez.com/nez-x-gdr-o3/nez-x-gdr-o3-nez-a-nez-quand-la-recherche-en-neurosciences-sinvite-dans-le-spectacle-vivant/",
    type: "scientific_paper",
  },
];

// Concepts clés (données statiques pour l'instant)
const KEY_CONCEPTS = [
  {
    name: "Effet Proust",
    type: "phenomenon",
    definition: "Phénomène par lequel une odeur déclenche involontairement un souvenir autobiographique vivace et émotionnellement chargé.",
    scientificBasis: "Nommé d'après Marcel Proust et l'épisode de la madeleine dans 'À la recherche du temps perdu'. Scientifiquement lié à la connexion directe entre le bulbe olfactif et l'hippocampe.",
  },
  {
    name: "Hippocampe",
    type: "brain_structure",
    definition: "Structure cérébrale essentielle pour la formation et la consolidation des souvenirs, particulièrement les souvenirs épisodiques.",
    scientificBasis: "Reçoit des projections directes du cortex piriforme (olfactif), contrairement aux autres sens qui passent par le thalamus.",
  },
  {
    name: "Amygdale",
    type: "brain_structure",
    definition: "Centre cérébral du traitement des émotions, particulièrement la peur et le plaisir.",
    scientificBasis: "Étroitement connectée au système olfactif, expliquant pourquoi les odeurs déclenchent des réponses émotionnelles si intenses.",
  },
  {
    name: "Mémoire épisodique",
    type: "memory_type",
    definition: "Type de mémoire à long terme impliquant le rappel d'événements spécifiques vécus personnellement.",
    scientificBasis: "Les odeurs sont particulièrement efficaces pour déclencher des souvenirs épisodiques, souvent avec une précision contextuelle remarquable.",
  },
  {
    name: "Encensement rituel",
    type: "ritual",
    definition: "Pratique d'utilisation de l'encens dans les cérémonies religieuses pour créer un état de conscience modifié et ancrer des souvenirs collectifs.",
    historicalContext: "Pratiqué depuis l'Âge du Bronze au Proche-Orient, l'encensement est présent dans le judaïsme, le christianisme et l'islam.",
  },
  {
    name: "OSTMR",
    type: "therapy",
    definition: "Olfactory Stimulation Therapy for Memory Rehabilitation - Thérapie utilisant des stimulations olfactives pour la rééducation de la mémoire.",
    scientificBasis: "Développée par des neuropsychiatres et parfumeurs, cette méthode utilise des compositions olfactives spécifiques pour traiter certains dysfonctionnements mnésiques.",
  },
];

export default function OlfactionMemoire() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Requêtes tRPC (à activer une fois les procédures créées)
  // const { data: articles } = trpc.olfactionMemory.list.useQuery({ category: selectedCategory || undefined });
  // const { data: concepts } = trpc.olfactionMemory.concepts.useQuery();
  // const { data: stats } = trpc.olfactionMemory.stats.useQuery();

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* En-tête avec introduction */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-900/20 via-indigo-900/20 to-blue-900/20 border border-purple-500/20 p-8">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-purple-500/20 border border-purple-500/30">
                <Brain className="h-8 w-8 text-purple-400" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">{INTRO_CONTENT.title}</h1>
                <p className="text-muted-foreground">{INTRO_CONTENT.subtitle}</p>
              </div>
            </div>
            <p className="text-muted-foreground max-w-3xl leading-relaxed">
              {INTRO_CONTENT.description}
            </p>
          </div>
        </div>

        {/* Faits clés */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {INTRO_CONTENT.keyFacts.map((fact, index) => (
            <Card key={index} className="bg-card/50 border-border/50 hover:border-purple-500/30 transition-colors">
              <CardContent className="p-5">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-purple-500/10">
                    <fact.icon className="h-5 w-5 text-purple-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">{fact.title}</h3>
                    <p className="text-sm text-muted-foreground">{fact.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Onglets principaux */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-muted/50">
            <TabsTrigger value="overview" className="gap-2">
              <Lightbulb className="h-4 w-4" />
              Vue d'ensemble
            </TabsTrigger>
            <TabsTrigger value="concepts" className="gap-2">
              <Brain className="h-4 w-4" />
              Concepts clés
            </TabsTrigger>
            <TabsTrigger value="sources" className="gap-2">
              <BookOpen className="h-4 w-4" />
              Sources
            </TabsTrigger>
          </TabsList>

          {/* Vue d'ensemble */}
          <TabsContent value="overview" className="space-y-6">
            {/* Catégories */}
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <ScrollText className="h-5 w-5 text-purple-500" />
                Explorer par catégorie
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {CATEGORIES.map((category) => (
                  <Card 
                    key={category.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedCategory === category.id ? 'ring-2 ring-purple-500' : ''
                    }`}
                    onClick={() => setSelectedCategory(
                      selectedCategory === category.id ? null : category.id
                    )}
                  >
                    <CardContent className="p-5">
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-xl ${category.color}`}>
                          <category.icon className="h-6 w-6" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground">{category.label}</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {category.description}
                          </p>
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Section neurologique */}
            <Card className="border-purple-500/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-purple-500" />
                  Aspects neurologiques
                </CardTitle>
                <CardDescription>
                  Comment le cerveau traite les odeurs et les lie à la mémoire
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <p>
                    L'odorat est unique parmi nos sens car il est le seul à avoir une connexion directe 
                    avec l'hippocampe et l'amygdale, les centres cérébraux de la mémoire et des émotions. 
                    Cette connexion explique pourquoi les odeurs peuvent déclencher des souvenirs si 
                    vivaces et émotionnellement chargés.
                  </p>
                  <h4>Structures cérébrales impliquées</h4>
                  <ul>
                    <li><strong>Bulbe olfactif</strong> : Premier relais du traitement olfactif</li>
                    <li><strong>Cortex piriforme</strong> : Cortex olfactif primaire</li>
                    <li><strong>Hippocampe</strong> : Formation et consolidation des souvenirs</li>
                    <li><strong>Amygdale</strong> : Traitement émotionnel</li>
                    <li><strong>Cortex orbitofrontal</strong> : Intégration et conscience olfactive</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Section historique */}
            <Card className="border-amber-500/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5 text-amber-500" />
                  Aspects historiques
                </CardTitle>
                <CardDescription>
                  L'utilisation des parfums dans les rituels de mémoire à travers les civilisations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <p>
                    Depuis l'Antiquité, les civilisations ont compris intuitivement le pouvoir des 
                    odeurs sur la mémoire et les ont utilisées dans leurs rituels religieux et 
                    commémoratifs. L'encens, en particulier, a joué un rôle central dans les 
                    pratiques des trois religions monothéistes.
                  </p>
                  <h4>Chronologie des usages rituels</h4>
                  <ul>
                    <li><strong>3200-1200 av. J.-C.</strong> : Premiers usages attestés de l'oliban au Proche-Orient</li>
                    <li><strong>1100-600 av. J.-C.</strong> : Diffusion dans le monde méditerranéen</li>
                    <li><strong>Antiquité</strong> : Grecs, Perses, Égyptiens, Phéniciens utilisent l'encens</li>
                    <li><strong>Ère chrétienne</strong> : Intégration dans les liturgies catholiques et orthodoxes</li>
                    <li><strong>Islam</strong> : Usage du bakhoor et de l'oud dans les pratiques spirituelles</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Concepts clés */}
          <TabsContent value="concepts" className="space-y-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher un concept..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Types de concepts */}
            <div className="flex flex-wrap gap-2 mb-6">
              {CONCEPT_TYPES.map((type) => (
                <Badge 
                  key={type.id} 
                  variant="outline" 
                  className="cursor-pointer hover:bg-purple-500/10"
                >
                  <type.icon className="h-3 w-3 mr-1" />
                  {type.label}
                </Badge>
              ))}
            </div>

            {/* Liste des concepts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {KEY_CONCEPTS.filter(concept => 
                concept.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                concept.definition.toLowerCase().includes(searchQuery.toLowerCase())
              ).map((concept, index) => {
                const typeInfo = CONCEPT_TYPES.find(t => t.id === concept.type);
                return (
                  <Card key={index} className="hover:border-purple-500/30 transition-colors">
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg">{concept.name}</CardTitle>
                        {typeInfo && (
                          <Badge variant="outline" className="text-xs">
                            <typeInfo.icon className="h-3 w-3 mr-1" />
                            {typeInfo.label}
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-muted-foreground">{concept.definition}</p>
                      {concept.scientificBasis && (
                        <div className="p-3 rounded-lg bg-muted/50 text-xs">
                          <span className="font-medium text-purple-500">Base scientifique : </span>
                          {concept.scientificBasis}
                        </div>
                      )}
                      {concept.historicalContext && (
                        <div className="p-3 rounded-lg bg-amber-500/10 text-xs">
                          <span className="font-medium text-amber-500">Contexte historique : </span>
                          {concept.historicalContext}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Sources */}
          <TabsContent value="sources" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-purple-500" />
                  Sources de référence
                </CardTitle>
                <CardDescription>
                  Articles, études et ressources sur le lien olfaction-mémoire
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {REFERENCE_SOURCES.map((source, index) => (
                    <div 
                      key={index}
                      className="flex items-start justify-between p-4 rounded-lg border border-border/50 hover:border-purple-500/30 transition-colors"
                    >
                      <div className="space-y-1">
                        <h4 className="font-medium text-foreground">{source.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {source.source} • {source.year}
                        </p>
                        <Badge variant="outline" className="text-xs">
                          {source.type === "scientific_paper" ? "Étude scientifique" : 
                           source.type === "podcast" ? "Podcast" : "Article"}
                        </Badge>
                      </div>
                      <Button variant="ghost" size="sm" asChild>
                        <a href={source.url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Ressources additionnelles */}
            <Card>
              <CardHeader>
                <CardTitle>Ressources additionnelles</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <a 
                    href="https://www.gdr-o3.cnrs.fr/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-4 rounded-lg border border-border/50 hover:border-purple-500/30 transition-colors"
                  >
                    <div className="p-2 rounded-lg bg-emerald-500/10">
                      <FlaskConical className="h-5 w-5 text-emerald-500" />
                    </div>
                    <div>
                      <h4 className="font-medium">GDR O3 - CNRS</h4>
                      <p className="text-sm text-muted-foreground">Groupement de Recherche en Olfaction</p>
                    </div>
                    <ExternalLink className="h-4 w-4 text-muted-foreground ml-auto" />
                  </a>
                  <a 
                    href="https://mag.bynez.com/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-4 rounded-lg border border-border/50 hover:border-purple-500/30 transition-colors"
                  >
                    <div className="p-2 rounded-lg bg-purple-500/10">
                      <BookOpen className="h-5 w-5 text-purple-500" />
                    </div>
                    <div>
                      <h4 className="font-medium">Nez Magazine</h4>
                      <p className="text-sm text-muted-foreground">Le mouvement culturel olfactif</p>
                    </div>
                    <ExternalLink className="h-4 w-4 text-muted-foreground ml-auto" />
                  </a>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
