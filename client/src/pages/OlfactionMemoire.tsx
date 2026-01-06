import { useState } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import DashboardLayout from "@/components/DashboardLayout";
import BrainDiagram from "@/components/BrainDiagram";
import OlfactoryRitualsTimeline from "@/components/OlfactoryRitualsTimeline";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
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
  ScrollText,
  Eye,
  FileText,
  Clock
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

// Données statiques pour l'introduction
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

export default function OlfactionMemoire() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedConceptType, setSelectedConceptType] = useState<string | null>(null);

  // Requêtes tRPC pour les données dynamiques
  const { data: concepts, isLoading: conceptsLoading } = trpc.olfactionMemory.listConcepts.useQuery();
  const { data: articles, isLoading: articlesLoading } = trpc.olfactionMemory.listArticles.useQuery({ 
    category: selectedCategory || undefined 
  });
  const { data: sources, isLoading: sourcesLoading } = trpc.olfactionMemory.listSources.useQuery();

  // Filtrer les concepts par type
  const filteredConcepts = concepts?.filter(concept => 
    !selectedConceptType || concept.type === selectedConceptType
  );

  // Filtrer les articles par recherche
  const filteredArticles = articles?.filter(article =>
    !searchQuery || 
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.summary?.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            
            {/* Statistiques */}
            <div className="flex flex-wrap gap-4 mt-6">
              <Badge variant="outline" className="bg-purple-500/10 border-purple-500/30">
                <Brain className="h-3 w-3 mr-1" />
                {concepts?.length || 0} concepts documentés
              </Badge>
              <Badge variant="outline" className="bg-amber-500/10 border-amber-500/30">
                <FileText className="h-3 w-3 mr-1" />
                {articles?.length || 0} articles de recherche
              </Badge>
              <Badge variant="outline" className="bg-emerald-500/10 border-emerald-500/30">
                <BookOpen className="h-3 w-3 mr-1" />
                {sources?.length || 0} sources bibliographiques
              </Badge>
            </div>
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
          <TabsList className="bg-muted/50 flex-wrap h-auto gap-1 p-1">
            <TabsTrigger value="overview" className="gap-2">
              <Lightbulb className="h-4 w-4" />
              Vue d'ensemble
            </TabsTrigger>
            <TabsTrigger value="brain" className="gap-2">
              <Brain className="h-4 w-4" />
              Cerveau olfactif
            </TabsTrigger>
            <TabsTrigger value="timeline" className="gap-2">
              <Clock className="h-4 w-4" />
              Chronologie
            </TabsTrigger>
            <TabsTrigger value="concepts" className="gap-2">
              <Sparkles className="h-4 w-4" />
              Concepts clés
            </TabsTrigger>
            <TabsTrigger value="articles" className="gap-2">
              <FileText className="h-4 w-4" />
              Articles
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
                    onClick={() => {
                      setSelectedCategory(selectedCategory === category.id ? null : category.id);
                      setActiveTab("articles");
                    }}
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

            {/* Aperçu du schéma cérébral */}
            <Card className="border-purple-500/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-purple-500" />
                  Le cerveau olfactif
                </CardTitle>
                <CardDescription>
                  Découvrez les structures cérébrales impliquées dans le lien olfaction-mémoire
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  L'odorat est unique parmi nos sens car il est le seul à avoir une connexion directe 
                  avec l'hippocampe et l'amygdale, les centres cérébraux de la mémoire et des émotions.
                </p>
                <Button onClick={() => setActiveTab("brain")} className="gap-2">
                  <Eye className="h-4 w-4" />
                  Explorer le schéma interactif
                </Button>
              </CardContent>
            </Card>

            {/* Aperçu de la chronologie */}
            <Card className="border-amber-500/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5 text-amber-500" />
                  5000 ans de rituels olfactifs
                </CardTitle>
                <CardDescription>
                  L'utilisation des parfums dans les rituels de mémoire à travers les civilisations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Depuis l'Antiquité, les civilisations ont compris intuitivement le pouvoir des 
                  odeurs sur la mémoire et les ont utilisées dans leurs rituels religieux et commémoratifs.
                </p>
                <Button onClick={() => setActiveTab("timeline")} variant="outline" className="gap-2">
                  <Clock className="h-4 w-4" />
                  Parcourir la chronologie
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Schéma cérébral interactif */}
          <TabsContent value="brain" className="space-y-6">
            <BrainDiagram />
          </TabsContent>

          {/* Chronologie des rituels */}
          <TabsContent value="timeline" className="space-y-6">
            <OlfactoryRitualsTimeline />
          </TabsContent>

          {/* Concepts clés */}
          <TabsContent value="concepts" className="space-y-6">
            {/* Filtres par type */}
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedConceptType === null ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedConceptType(null)}
              >
                Tous
              </Button>
              {CONCEPT_TYPES.map((type) => (
                <Button
                  key={type.id}
                  variant={selectedConceptType === type.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedConceptType(type.id)}
                  className="gap-1"
                >
                  <type.icon className="h-3 w-3" />
                  {type.label}
                </Button>
              ))}
            </div>

            {/* Liste des concepts */}
            {conceptsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <Card key={i}>
                    <CardHeader>
                      <Skeleton className="h-6 w-3/4" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-20 w-full" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredConcepts?.map((concept) => {
                  const typeInfo = CONCEPT_TYPES.find(t => t.id === concept.type);
                  return (
                    <Card key={concept.id} className="hover:border-purple-500/30 transition-colors">
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
            )}
          </TabsContent>

          {/* Articles de recherche */}
          <TabsContent value="articles" className="space-y-6">
            {/* Barre de recherche et filtres */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher un article..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={selectedCategory === null ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(null)}
                >
                  Tous
                </Button>
                {CATEGORIES.slice(0, 4).map((cat) => (
                  <Button
                    key={cat.id}
                    variant={selectedCategory === cat.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(cat.id)}
                  >
                    {cat.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Liste des articles */}
            {articlesLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i}>
                    <CardHeader>
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-16 w-full" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredArticles?.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <FileText className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                  <p className="text-muted-foreground">Aucun article trouvé</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredArticles?.map((article) => {
                  const categoryInfo = CATEGORIES.find(c => c.id === article.category);
                  return (
                    <Card key={article.id} className="hover:border-purple-500/30 transition-colors">
                      <CardHeader>
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <CardTitle className="text-lg">{article.title}</CardTitle>
                            <CardDescription className="mt-1">
                              {article.summary}
                            </CardDescription>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            {categoryInfo && (
                              <Badge className={categoryInfo.color}>
                                <categoryInfo.icon className="h-3 w-3 mr-1" />
                                {categoryInfo.label}
                              </Badge>
                            )}
                            {article.featured && (
                              <Badge variant="secondary">
                                <Sparkles className="h-3 w-3 mr-1" />
                                À la une
                              </Badge>
                            )}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <div className="flex flex-wrap gap-1">
                            {article.tags && JSON.parse(article.tags as string).slice(0, 4).map((tag: string, idx: number) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          <Button variant="ghost" size="sm" className="gap-1">
                            <Eye className="h-4 w-4" />
                            Lire
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>

          {/* Sources */}
          <TabsContent value="sources" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-purple-500" />
                  Sources bibliographiques
                </CardTitle>
                <CardDescription>
                  Articles scientifiques, livres et ressources sur le lien olfaction-mémoire
                </CardDescription>
              </CardHeader>
              <CardContent>
                {sourcesLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="p-4 rounded-lg border">
                        <Skeleton className="h-5 w-3/4 mb-2" />
                        <Skeleton className="h-4 w-1/2" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {sources?.map((source) => (
                      <div 
                        key={source.id}
                        className="flex items-start justify-between p-4 rounded-lg border border-border/50 hover:border-purple-500/30 transition-colors"
                      >
                        <div className="space-y-1 flex-1">
                          <h4 className="font-medium text-foreground">{source.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {source.authors && JSON.parse(source.authors as string).join(", ")} 
                            {source.publicationYear && ` • ${source.publicationYear}`}
                            {source.journal && ` • ${source.journal}`}
                          </p>
                          {source.abstract && (
                            <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                              {source.abstract}
                            </p>
                          )}
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="outline" className="text-xs">
                              {source.sourceType === "scientific_paper" ? "Article scientifique" : 
                               source.sourceType === "book" ? "Livre" :
                               source.sourceType === "podcast" ? "Podcast" : 
                               source.sourceType === "article" ? "Article" : source.sourceType}
                            </Badge>
                            {source.relevanceScore && source.relevanceScore >= 90 && (
                              <Badge variant="secondary" className="text-xs">
                                <Sparkles className="h-3 w-3 mr-1" />
                                Référence clé
                              </Badge>
                            )}
                          </div>
                        </div>
                        {source.url && (
                          <Button variant="ghost" size="sm" asChild>
                            <a href={source.url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </Button>
                        )}
                        {source.doi && (
                          <Button variant="ghost" size="sm" asChild>
                            <a href={`https://doi.org/${source.doi}`} target="_blank" rel="noopener noreferrer">
                              DOI
                            </a>
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
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
