// @ts-nocheck
import { useState } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { FinalRecipeForm } from "@/components/forms/FinalRecipeForm";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Search, 
  Plus, 
  Filter,
  Sparkles,
  Flame,
  Wind,
  TreeDeciduous,
  ArrowLeft,
  FlaskConical,
  Droplets,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Zap
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

// Recipe Type Icon Component
function RecipeTypeIcon({ type }: { type: string }) {
  const icons: Record<string, React.ReactNode> = {
    parfum: <Droplets className="w-4 h-4" />,
    encens: <Flame className="w-4 h-4" />,
    espace: <Wind className="w-4 h-4" />,
  };
  return icons[type] || icons.parfum;
}

// Recipe Type Badge Component
function RecipeTypeBadge({ type }: { type: string }) {
  const typeConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
    parfum: { 
      label: "Parfum", 
      color: "bg-pink-500/20 text-pink-400 border-pink-500/30",
      icon: <Droplets className="w-3 h-3" />
    },
    encens: { 
      label: "Encens", 
      color: "bg-amber-500/20 text-amber-400 border-amber-500/30",
      icon: <Flame className="w-3 h-3" />
    },
    espace: { 
      label: "Espace", 
      color: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
      icon: <Wind className="w-3 h-3" />
    },
  };

  const config = typeConfig[type] || typeConfig.parfum;

  return (
    <Badge variant="outline" className={`${config.color} flex items-center gap-1`}>
      {config.icon}
      {config.label}
    </Badge>
  );
}

// Climatic Axis Badge Component
function ClimaticAxisBadge({ axis }: { axis: string }) {
  const axisConfig: Record<string, { icon: React.ReactNode; color: string; label: string }> = {
    vent: { icon: <Wind className="w-3 h-3" />, color: "bg-sky-500/20 text-sky-400", label: "Vent" },
    bois: { icon: <TreeDeciduous className="w-3 h-3" />, color: "bg-amber-500/20 text-amber-400", label: "Bois" },
    disparition: { icon: <Sparkles className="w-3 h-3" />, color: "bg-violet-500/20 text-violet-400", label: "Disparition" },
    vent_bois: { icon: <Wind className="w-3 h-3" />, color: "bg-emerald-500/20 text-emerald-400", label: "Vent + Bois" },
    bois_disparition: { icon: <TreeDeciduous className="w-3 h-3" />, color: "bg-orange-500/20 text-orange-400", label: "Bois + Disparition" },
    vent_disparition: { icon: <Wind className="w-3 h-3" />, color: "bg-indigo-500/20 text-indigo-400", label: "Vent + Disparition" },
    vent_bois_disparition: { icon: <Sparkles className="w-3 h-3" />, color: "bg-rose-500/20 text-rose-400", label: "Triple Axe" },
  };

  const config = axisConfig[axis] || axisConfig.vent;

  return (
    <Badge variant="secondary" className={`${config.color} flex items-center gap-1`}>
      {config.icon}
      {config.label}
    </Badge>
  );
}

// Concentrate Display Component
function ConcentrateDisplay({ concentrate }: { concentrate: any }) {
  if (!concentrate) return null;
  
  const items = typeof concentrate === 'string' ? JSON.parse(concentrate) : concentrate;
  if (!Array.isArray(items) || items.length === 0) return null;

  return (
    <div className="space-y-1">
      {items.slice(0, 3).map((item: any, index: number) => (
        <div key={index} className="flex justify-between text-xs">
          <span className="text-muted-foreground truncate mr-2">{item.ingredient}</span>
          <span className="font-mono text-primary">{item.percentage}%</span>
        </div>
      ))}
      {items.length > 3 && (
        <div className="text-xs text-muted-foreground">
          +{items.length - 3} ingrédients
        </div>
      )}
    </div>
  );
}

// Final Recipe Card Component
function FinalRecipeCard({ recipe }: { recipe: any }) {
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-border/50 hover:border-primary/30 bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <RecipeTypeIcon type={recipe.recipeType} />
              <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors">
                {recipe.name}
              </CardTitle>
              {recipe.isRadical === 1 && (
                <Badge variant="destructive" className="text-xs">
                  <Zap className="w-3 h-3 mr-1" />
                  Radical
                </Badge>
              )}
            </div>
            <CardDescription className="font-mono text-xs">
              {recipe.recipeId}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-wrap gap-2">
          <RecipeTypeBadge type={recipe.recipeType} />
          <ClimaticAxisBadge axis={recipe.climaticAxis} />
        </div>

        {recipe.function && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {recipe.function}
          </p>
        )}

        {recipe.base && (
          <div className="text-xs">
            <span className="font-medium text-muted-foreground">Base:</span>{" "}
            <span>{recipe.base}</span>
          </div>
        )}

        <ConcentrateDisplay concentrate={recipe.concentrate} />

        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
          {recipe.dilution && (
            <div className="flex items-center gap-1">
              <FlaskConical className="w-3 h-3" />
              {recipe.dilution}
            </div>
          )}
          {recipe.restPeriod && (
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {recipe.restPeriod}
            </div>
          )}
          {recipe.combustionTime && (
            <div className="flex items-center gap-1">
              <Flame className="w-3 h-3" />
              {recipe.combustionTime}
            </div>
          )}
        </div>

        {recipe.expectedResult && (
          <div className="flex items-start gap-2 text-xs bg-emerald-500/10 text-emerald-400 p-2 rounded">
            <CheckCircle2 className="w-3 h-3 mt-0.5 flex-shrink-0" />
            <span className="line-clamp-2">{recipe.expectedResult}</span>
          </div>
        )}

        {recipe.risks && (
          <div className="flex items-start gap-2 text-xs bg-amber-500/10 text-amber-400 p-2 rounded">
            <AlertTriangle className="w-3 h-3 mt-0.5 flex-shrink-0" />
            <span className="line-clamp-2">{recipe.risks}</span>
          </div>
        )}

        <div className="pt-2 flex justify-end">
          <Link href={`/final-recipes/${recipe.id}`}>
            <Button variant="ghost" size="sm" className="text-xs">
              Voir la recette →
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export default function FinalRecipes() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedAxis, setSelectedAxis] = useState<string>("all");
  const [showRadicalOnly, setShowRadicalOnly] = useState(false);

  const { data: recipes, isLoading } = trpc.finalRecipes.list.useQuery();

  // Filter recipes
  const filteredRecipes = recipes?.filter((recipe: any) => {
    const matchesSearch = 
      recipe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.recipeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (recipe.function && recipe.function.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesType = selectedType === "all" || recipe.recipeType === selectedType;
    const matchesAxis = selectedAxis === "all" || recipe.climaticAxis === selectedAxis;
    const matchesRadical = !showRadicalOnly || recipe.isRadical === 1;

    return matchesSearch && matchesType && matchesAxis && matchesRadical;
  }) || [];

  // Group by type
  const groupedByType = filteredRecipes.reduce((acc: any, recipe: any) => {
    const type = recipe.recipeType || "autre";
    if (!acc[type]) acc[type] = [];
    acc[type].push(recipe);
    return acc;
  }, {});

  // Count by type
  const typeCounts = recipes?.reduce((acc: any, recipe: any) => {
    const type = recipe.recipeType || "autre";
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {}) || {};

  const radicalCount = recipes?.filter((r: any) => r.isRadical === 1).length || 0;

  return (
    <>
      <Header />
      <div className="container py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <Link href="/leaf-economies">
              <Button variant="ghost" size="sm" className="mb-2">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Leaf Economies
              </Button>
            </Link>
            <h1 className="text-3xl font-bold tracking-tight">
              Recettes Finales
            </h1>
            <p className="text-muted-foreground mt-1">
              Parfum, Encens, Espace — Formulations complètes et protocoles
            </p>
          </div>
          <FinalRecipeForm />
        </div>

        {/* Filters */}
        <Card className="bg-card/50 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par nom, ID ou fonction..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-full md:w-[160px]">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous types</SelectItem>
                  <SelectItem value="parfum">Parfum</SelectItem>
                  <SelectItem value="encens">Encens</SelectItem>
                  <SelectItem value="espace">Espace</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedAxis} onValueChange={setSelectedAxis}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <Wind className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Axe climatique" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les axes</SelectItem>
                  <SelectItem value="vent">Vent</SelectItem>
                  <SelectItem value="bois">Bois</SelectItem>
                  <SelectItem value="disparition">Disparition</SelectItem>
                </SelectContent>
              </Select>
              <Button 
                variant={showRadicalOnly ? "default" : "outline"}
                onClick={() => setShowRadicalOnly(!showRadicalOnly)}
                className="whitespace-nowrap"
              >
                <Zap className="w-4 h-4 mr-2" />
                Radicales ({radicalCount})
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card 
            className={`cursor-pointer transition-all ${selectedType === 'parfum' ? 'ring-2 ring-pink-500' : ''} bg-pink-500/10 border-pink-500/20`}
            onClick={() => setSelectedType(selectedType === 'parfum' ? 'all' : 'parfum')}
          >
            <CardContent className="pt-4 text-center">
              <Droplets className="w-6 h-6 mx-auto text-pink-400 mb-2" />
              <div className="text-2xl font-bold text-pink-400">
                {typeCounts.parfum || 0}
              </div>
              <div className="text-xs text-muted-foreground">Parfums</div>
            </CardContent>
          </Card>
          <Card 
            className={`cursor-pointer transition-all ${selectedType === 'encens' ? 'ring-2 ring-amber-500' : ''} bg-amber-500/10 border-amber-500/20`}
            onClick={() => setSelectedType(selectedType === 'encens' ? 'all' : 'encens')}
          >
            <CardContent className="pt-4 text-center">
              <Flame className="w-6 h-6 mx-auto text-amber-400 mb-2" />
              <div className="text-2xl font-bold text-amber-400">
                {typeCounts.encens || 0}
              </div>
              <div className="text-xs text-muted-foreground">Encens</div>
            </CardContent>
          </Card>
          <Card 
            className={`cursor-pointer transition-all ${selectedType === 'espace' ? 'ring-2 ring-cyan-500' : ''} bg-cyan-500/10 border-cyan-500/20`}
            onClick={() => setSelectedType(selectedType === 'espace' ? 'all' : 'espace')}
          >
            <CardContent className="pt-4 text-center">
              <Wind className="w-6 h-6 mx-auto text-cyan-400 mb-2" />
              <div className="text-2xl font-bold text-cyan-400">
                {typeCounts.espace || 0}
              </div>
              <div className="text-xs text-muted-foreground">Espace</div>
            </CardContent>
          </Card>
          <Card 
            className={`cursor-pointer transition-all ${showRadicalOnly ? 'ring-2 ring-red-500' : ''} bg-red-500/10 border-red-500/20`}
            onClick={() => setShowRadicalOnly(!showRadicalOnly)}
          >
            <CardContent className="pt-4 text-center">
              <Zap className="w-6 h-6 mx-auto text-red-400 mb-2" />
              <div className="text-2xl font-bold text-red-400">
                {radicalCount}
              </div>
              <div className="text-xs text-muted-foreground">Radicales</div>
            </CardContent>
          </Card>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-6 bg-muted rounded w-3/4" />
                  <div className="h-4 bg-muted rounded w-1/4 mt-2" />
                </CardHeader>
                <CardContent>
                  <div className="h-24 bg-muted rounded" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredRecipes.length === 0 ? (
          <Card className="bg-card/50">
            <CardContent className="py-12 text-center">
              <FlaskConical className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Aucune recette trouvée</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery || selectedType !== "all" || selectedAxis !== "all" || showRadicalOnly
                  ? "Essayez de modifier vos filtres de recherche."
                  : "Commencez par créer votre première recette finale."}
              </p>
              <Button onClick={() => toast({ title: "Information", description: "Fonctionnalité en cours de développement" })}>
                  <Plus className="w-4 h-4 mr-2" />
                  Créer une recette
                </Button>
            </CardContent>
          </Card>
        ) : (
          <Tabs defaultValue="grid" className="space-y-6">
            <TabsList>
              <TabsTrigger value="grid">Grille</TabsTrigger>
              <TabsTrigger value="by-type">Par type</TabsTrigger>
            </TabsList>

            <TabsContent value="grid">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRecipes.map((recipe: any) => (
                  <FinalRecipeCard key={recipe.id} recipe={recipe} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="by-type" className="space-y-8">
              {Object.entries(groupedByType).map(([type, typeRecipes]: [string, any]) => (
                <div key={type}>
                  <div className="flex items-center gap-2 mb-4">
                    <RecipeTypeBadge type={type} />
                    <span className="text-sm text-muted-foreground">
                      ({typeRecipes.length} recette{typeRecipes.length > 1 ? "s" : ""})
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {typeRecipes.map((recipe: any) => (
                      <FinalRecipeCard key={recipe.id} recipe={recipe} />
                    ))}
                  </div>
                </div>
              ))}
            </TabsContent>
          </Tabs>
        )}
      </div>
      <Footer />
    </>
  );
}
