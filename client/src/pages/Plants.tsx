import { useState } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
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
  Leaf,
  TreeDeciduous,
  Flower2,
  Cigarette,
  Cannabis,
  Droplets,
  Mountain,
  ArrowLeft,
  MapPin,
  Beaker,
  Wind
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

// Category Icon Component
function CategoryIcon({ category }: { category: string }) {
  const icons: Record<string, React.ReactNode> = {
    aromatique: <Leaf className="w-4 h-4" />,
    tabac: <Cigarette className="w-4 h-4" />,
    cannabis: <Cannabis className="w-4 h-4" />,
    resine: <Droplets className="w-4 h-4" />,
    bois: <TreeDeciduous className="w-4 h-4" />,
    fleur: <Flower2 className="w-4 h-4" />,
    racine: <Mountain className="w-4 h-4" />,
    autre: <Beaker className="w-4 h-4" />,
  };
  return icons[category] || icons.autre;
}

// Category Badge Component
function CategoryBadge({ category }: { category: string }) {
  const categoryConfig: Record<string, { label: string; color: string }> = {
    aromatique: { label: "Aromatique", color: "bg-green-500/20 text-green-400 border-green-500/30" },
    tabac: { label: "Tabac", color: "bg-amber-500/20 text-amber-400 border-amber-500/30" },
    cannabis: { label: "Cannabis", color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
    resine: { label: "Résine", color: "bg-orange-500/20 text-orange-400 border-orange-500/30" },
    bois: { label: "Bois", color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" },
    fleur: { label: "Fleur", color: "bg-pink-500/20 text-pink-400 border-pink-500/30" },
    racine: { label: "Racine", color: "bg-stone-500/20 text-stone-400 border-stone-500/30" },
    autre: { label: "Autre", color: "bg-gray-500/20 text-gray-400 border-gray-500/30" },
  };

  const config = categoryConfig[category] || categoryConfig.autre;

  return (
    <Badge variant="outline" className={`${config.color} flex items-center gap-1`}>
      <CategoryIcon category={category} />
      {config.label}
    </Badge>
  );
}

// Climatic Axis Badge Component
function ClimaticAxisBadge({ axis }: { axis: string | null }) {
  if (!axis) return null;
  
  const axisConfig: Record<string, { icon: React.ReactNode; color: string; label: string }> = {
    vent: { icon: <Wind className="w-3 h-3" />, color: "bg-sky-500/20 text-sky-400", label: "Vent" },
    bois: { icon: <TreeDeciduous className="w-3 h-3" />, color: "bg-amber-500/20 text-amber-400", label: "Bois" },
    disparition: { icon: <Droplets className="w-3 h-3" />, color: "bg-violet-500/20 text-violet-400", label: "Disparition" },
    vent_bois: { icon: <Wind className="w-3 h-3" />, color: "bg-emerald-500/20 text-emerald-400", label: "Vent + Bois" },
    bois_disparition: { icon: <TreeDeciduous className="w-3 h-3" />, color: "bg-orange-500/20 text-orange-400", label: "Bois + Disparition" },
    vent_disparition: { icon: <Wind className="w-3 h-3" />, color: "bg-indigo-500/20 text-indigo-400", label: "Vent + Disparition" },
  };

  const config = axisConfig[axis] || axisConfig.vent;

  return (
    <Badge variant="secondary" className={`${config.color} flex items-center gap-1`}>
      {config.icon}
      {config.label}
    </Badge>
  );
}

// Plant Card Component
function PlantCard({ plant }: { plant: any }) {
  const botanicalStates = plant.botanicalStates ? 
    (typeof plant.botanicalStates === 'string' ? JSON.parse(plant.botanicalStates) : plant.botanicalStates) 
    : [];

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-border/50 hover:border-primary/30 bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors">
              {plant.name}
            </CardTitle>
            {plant.latinName && (
              <CardDescription className="italic text-xs mt-1">
                {plant.latinName}
              </CardDescription>
            )}
          </div>
          {plant.imageUrl && (
            <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted">
              <img 
                src={plant.imageUrl} 
                alt={plant.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-wrap gap-2">
          <CategoryBadge category={plant.category} />
          <ClimaticAxisBadge axis={plant.climaticAxis} />
        </div>

        {plant.family && (
          <div className="text-xs text-muted-foreground">
            <span className="font-medium">Famille:</span> {plant.family}
          </div>
        )}

        {plant.origin && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="w-3 h-3" />
            {plant.origin}
          </div>
        )}

        {plant.olfactiveSignature && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {plant.olfactiveSignature}
          </p>
        )}

        {botanicalStates.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {botanicalStates.slice(0, 4).map((state: any, index: number) => (
              <Badge key={index} variant="outline" className="text-xs">
                État {state.state}
              </Badge>
            ))}
            {botanicalStates.length > 4 && (
              <Badge variant="outline" className="text-xs">
                +{botanicalStates.length - 4}
              </Badge>
            )}
          </div>
        )}

        {plant.chemotypes && (
          <p className="text-xs text-muted-foreground italic border-l-2 border-primary/30 pl-2 line-clamp-1">
            Chémotypes: {plant.chemotypes}
          </p>
        )}

        <div className="pt-2 flex justify-end">
          <Link href={`/plants/${plant.id}`}>
            <Button variant="ghost" size="sm" className="text-xs">
              Voir la fiche →
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Plants() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedAxis, setSelectedAxis] = useState<string>("all");

  const { data: plants, isLoading } = trpc.plants.list.useQuery();

  // Filter plants
  const filteredPlants = plants?.filter((plant: any) => {
    const matchesSearch = 
      plant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (plant.latinName && plant.latinName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (plant.family && plant.family.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (plant.origin && plant.origin.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === "all" || plant.category === selectedCategory;
    const matchesAxis = selectedAxis === "all" || plant.climaticAxis === selectedAxis;

    return matchesSearch && matchesCategory && matchesAxis;
  }) || [];

  // Group by category
  const groupedByCategory = filteredPlants.reduce((acc: any, plant: any) => {
    const category = plant.category || "autre";
    if (!acc[category]) acc[category] = [];
    acc[category].push(plant);
    return acc;
  }, {});

  // Count by category
  const categoryCounts = plants?.reduce((acc: any, plant: any) => {
    const category = plant.category || "autre";
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {}) || {};

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
              Plantes Aromatiques
            </h1>
            <p className="text-muted-foreground mt-1">
              Variétés, chémotypes et états botaniques — Base de données ABSORBE
            </p>
          </div>
          <Link href="/plants/new">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nouvelle plante
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <Card className="bg-card/50 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par nom, famille, origine..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Catégorie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes catégories</SelectItem>
                  <SelectItem value="aromatique">Aromatique</SelectItem>
                  <SelectItem value="tabac">Tabac</SelectItem>
                  <SelectItem value="cannabis">Cannabis</SelectItem>
                  <SelectItem value="resine">Résine</SelectItem>
                  <SelectItem value="bois">Bois</SelectItem>
                  <SelectItem value="fleur">Fleur</SelectItem>
                  <SelectItem value="racine">Racine</SelectItem>
                  <SelectItem value="autre">Autre</SelectItem>
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
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
          {[
            { key: "aromatique", icon: <Leaf className="w-4 h-4" />, color: "text-green-400" },
            { key: "tabac", icon: <Cigarette className="w-4 h-4" />, color: "text-amber-400" },
            { key: "cannabis", icon: <Cannabis className="w-4 h-4" />, color: "text-emerald-400" },
            { key: "resine", icon: <Droplets className="w-4 h-4" />, color: "text-orange-400" },
            { key: "bois", icon: <TreeDeciduous className="w-4 h-4" />, color: "text-yellow-400" },
            { key: "fleur", icon: <Flower2 className="w-4 h-4" />, color: "text-pink-400" },
            { key: "racine", icon: <Mountain className="w-4 h-4" />, color: "text-stone-400" },
            { key: "autre", icon: <Beaker className="w-4 h-4" />, color: "text-gray-400" },
          ].map(({ key, icon, color }) => (
            <Card 
              key={key} 
              className={`cursor-pointer transition-all ${selectedCategory === key ? 'ring-2 ring-primary' : ''}`}
              onClick={() => setSelectedCategory(selectedCategory === key ? "all" : key)}
            >
              <CardContent className="pt-3 pb-3 text-center">
                <div className={`${color} mx-auto mb-1`}>{icon}</div>
                <div className="text-lg font-bold">{categoryCounts[key] || 0}</div>
                <div className="text-[10px] text-muted-foreground capitalize">{key}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-6 bg-muted rounded w-3/4" />
                  <div className="h-4 bg-muted rounded w-1/2 mt-2" />
                </CardHeader>
                <CardContent>
                  <div className="h-20 bg-muted rounded" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredPlants.length === 0 ? (
          <Card className="bg-card/50">
            <CardContent className="py-12 text-center">
              <Leaf className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Aucune plante trouvée</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery || selectedCategory !== "all" || selectedAxis !== "all"
                  ? "Essayez de modifier vos filtres de recherche."
                  : "Commencez par ajouter votre première plante."}
              </p>
              <Link href="/plants/new">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter une plante
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <Tabs defaultValue="grid" className="space-y-6">
            <TabsList>
              <TabsTrigger value="grid">Grille</TabsTrigger>
              <TabsTrigger value="by-category">Par catégorie</TabsTrigger>
            </TabsList>

            <TabsContent value="grid">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPlants.map((plant: any) => (
                  <PlantCard key={plant.id} plant={plant} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="by-category" className="space-y-8">
              {Object.entries(groupedByCategory).map(([category, categoryPlants]: [string, any]) => (
                <div key={category}>
                  <div className="flex items-center gap-2 mb-4">
                    <CategoryBadge category={category} />
                    <span className="text-sm text-muted-foreground">
                      ({categoryPlants.length} plante{categoryPlants.length > 1 ? "s" : ""})
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categoryPlants.map((plant: any) => (
                      <PlantCard key={plant.id} plant={plant} />
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
