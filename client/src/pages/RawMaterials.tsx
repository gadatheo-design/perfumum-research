import { useState } from "react";
import { Link } from "wouter";
import { toast } from "sonner";
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
  Droplets,
  Flower2,
  TreeDeciduous,
  Leaf,
  Beaker,
  MapPin,
  ArrowLeft,
  FlaskConical,
  Sparkles,
  Wind,
  Sun,
  Thermometer
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

// Category configuration for raw materials
const categoryConfig: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  huile_essentielle: { 
    label: "Huile essentielle", 
    icon: <Droplets className="w-4 h-4" />, 
    color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" 
  },
  absolue: { 
    label: "Absolue", 
    icon: <Flower2 className="w-4 h-4" />, 
    color: "bg-pink-500/20 text-pink-400 border-pink-500/30" 
  },
  concrete: { 
    label: "Concrète", 
    icon: <Sparkles className="w-4 h-4" />, 
    color: "bg-amber-500/20 text-amber-400 border-amber-500/30" 
  },
  resinoid: { 
    label: "Résinoïde", 
    icon: <TreeDeciduous className="w-4 h-4" />, 
    color: "bg-orange-500/20 text-orange-400 border-orange-500/30" 
  },
  teinture: { 
    label: "Teinture", 
    icon: <FlaskConical className="w-4 h-4" />, 
    color: "bg-violet-500/20 text-violet-400 border-violet-500/30" 
  },
  co2_extract: { 
    label: "Extrait CO₂", 
    icon: <Wind className="w-4 h-4" />, 
    color: "bg-sky-500/20 text-sky-400 border-sky-500/30" 
  },
  hydrolat: { 
    label: "Hydrolat", 
    icon: <Droplets className="w-4 h-4" />, 
    color: "bg-blue-500/20 text-blue-400 border-blue-500/30" 
  },
  beurre: { 
    label: "Beurre", 
    icon: <Sun className="w-4 h-4" />, 
    color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" 
  },
  cire: { 
    label: "Cire", 
    icon: <Thermometer className="w-4 h-4" />, 
    color: "bg-stone-500/20 text-stone-400 border-stone-500/30" 
  },
  oleoresine: { 
    label: "Oléorésine", 
    icon: <Droplets className="w-4 h-4" />, 
    color: "bg-red-500/20 text-red-400 border-red-500/30" 
  },
  infusion: { 
    label: "Infusion", 
    icon: <Leaf className="w-4 h-4" />, 
    color: "bg-green-500/20 text-green-400 border-green-500/30" 
  },
  maceration: { 
    label: "Macération", 
    icon: <Beaker className="w-4 h-4" />, 
    color: "bg-indigo-500/20 text-indigo-400 border-indigo-500/30" 
  },
  distillat: { 
    label: "Distillat", 
    icon: <FlaskConical className="w-4 h-4" />, 
    color: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30" 
  },
  autre: { 
    label: "Autre", 
    icon: <Beaker className="w-4 h-4" />, 
    color: "bg-gray-500/20 text-gray-400 border-gray-500/30" 
  },
};

// Olfactive family configuration
const olfactiveFamilyConfig: Record<string, { label: string; color: string }> = {
  floral: { label: "Floral", color: "bg-pink-500/20 text-pink-400" },
  boise: { label: "Boisé", color: "bg-amber-500/20 text-amber-400" },
  agrume: { label: "Agrume", color: "bg-yellow-500/20 text-yellow-400" },
  epice: { label: "Épicé", color: "bg-red-500/20 text-red-400" },
  herbace: { label: "Herbacé", color: "bg-green-500/20 text-green-400" },
  balsamique: { label: "Balsamique", color: "bg-orange-500/20 text-orange-400" },
  musque: { label: "Musqué", color: "bg-purple-500/20 text-purple-400" },
  animal: { label: "Animal", color: "bg-stone-500/20 text-stone-400" },
  vert: { label: "Vert", color: "bg-emerald-500/20 text-emerald-400" },
  fruité: { label: "Fruité", color: "bg-rose-500/20 text-rose-400" },
  marin: { label: "Marin", color: "bg-blue-500/20 text-blue-400" },
  terreux: { label: "Terreux", color: "bg-brown-500/20 text-brown-400" },
  fumé: { label: "Fumé", color: "bg-gray-500/20 text-gray-400" },
  gourmand: { label: "Gourmand", color: "bg-amber-500/20 text-amber-400" },
  aromatique: { label: "Aromatique", color: "bg-teal-500/20 text-teal-400" },
  autre: { label: "Autre", color: "bg-slate-500/20 text-slate-400" },
};

// Category Badge Component
function CategoryBadge({ category }: { category: string }) {
  const config = categoryConfig[category] || categoryConfig.autre;
  return (
    <Badge variant="outline" className={`${config.color} flex items-center gap-1`}>
      {config.icon}
      {config.label}
    </Badge>
  );
}

// Olfactive Family Badge
function OlfactiveFamilyBadge({ family }: { family: string | null }) {
  if (!family) return null;
  const config = olfactiveFamilyConfig[family] || olfactiveFamilyConfig.autre;
  return (
    <Badge variant="secondary" className={config.color}>
      {config.label}
    </Badge>
  );
}

// Raw Material Card Component
function RawMaterialCard({ material }: { material: any }) {
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-border/50 hover:border-primary/30 bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors">
              <Link href={`/matieres-premieres/${material.id}`} className="hover:underline">
                {material.name}
              </Link>
            </CardTitle>
            {material.latinName && (
              <CardDescription className="italic text-muted-foreground/80">
                {material.latinName}
              </CardDescription>
            )}
          </div>
          <CategoryBadge category={material.category} />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Origin */}
        {(material.originCountry || material.originRegion) && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span>
              {material.originRegion && `${material.originRegion}, `}
              {material.originCountry}
            </span>
          </div>
        )}

        {/* Olfactive Profile */}
        {material.olfactiveFamily && (
          <div className="flex items-center gap-2">
            <OlfactiveFamilyBadge family={material.olfactiveFamily} />
          </div>
        )}

        {/* Olfactive Description */}
        {material.olfactiveProfile && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {material.olfactiveProfile}
          </p>
        )}

        {/* Notes */}
        <div className="flex flex-wrap gap-2">
          {material.topNotes && (
            <Badge variant="outline" className="text-xs bg-sky-500/10 text-sky-400 border-sky-500/30">
              Tête: {material.topNotes.substring(0, 30)}...
            </Badge>
          )}
          {material.heartNotes && (
            <Badge variant="outline" className="text-xs bg-rose-500/10 text-rose-400 border-rose-500/30">
              Cœur: {material.heartNotes.substring(0, 30)}...
            </Badge>
          )}
          {material.baseNotes && (
            <Badge variant="outline" className="text-xs bg-amber-500/10 text-amber-400 border-amber-500/30">
              Fond: {material.baseNotes.substring(0, 30)}...
            </Badge>
          )}
        </div>

        {/* Intensity & Tenacity */}
        {(material.intensity || material.tenacity) && (
          <div className="flex gap-4 text-xs text-muted-foreground">
            {material.intensity && (
              <span>Intensité: {material.intensity}/10</span>
            )}
            {material.tenacity && (
              <span>Tenue: {material.tenacity}h</span>
            )}
          </div>
        )}

        {/* Quality & Price */}
        <div className="flex gap-2">
          {material.quality && (
            <Badge variant="outline" className="text-xs">
              {material.quality.replace('_', ' ')}
            </Badge>
          )}
          {material.priceRange && (
            <Badge variant="outline" className="text-xs">
              {material.priceRange}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function RawMaterials() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedOlfactiveFamily, setSelectedOlfactiveFamily] = useState<string>("all");

  const { data: rawMaterials, isLoading } = trpc.rawMaterials?.getAll.useQuery();
  const { data: contentStats } = trpc.contentStats?.getAll.useQuery();

  // Filter materials
  const filteredMaterials = rawMaterials?.filter((material: any) => {
    const matchesSearch = 
      material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (material.latinName?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (material.originCountry?.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === "all" || material.category === selectedCategory;
    const matchesFamily = selectedOlfactiveFamily === "all" || material.olfactiveFamily === selectedOlfactiveFamily;
    
    return matchesSearch && matchesCategory && matchesFamily;
  }) || [];

  // Group by category
  const materialsByCategory = filteredMaterials.reduce((acc: Record<string, any[]>, material: any) => {
    const cat = material.category || "autre";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(material);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8">
        {/* Back Navigation */}
        <div className="mb-6">
          <Link href="/recherche">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Retour à la recherche
            </Button>
          </Link>
        </div>

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Matières Premières</h1>
          <p className="text-muted-foreground text-lg">
            Explorez les matières premières naturelles utilisées en parfumerie, leurs origines botaniques et leurs profils olfactifs.
          </p>
          {contentStats && (
            <div className="flex gap-4 mt-4 text-sm text-muted-foreground">
              <span>{contentStats?.rawMaterials || 0} matières premières</span>
              <span>•</span>
              <span>{contentStats?.rawMaterialMoleculeLinks || 0} liaisons moléculaires</span>
            </div>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher une matière première..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Catégorie" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les catégories</SelectItem>
              {Object.entries(categoryConfig).map(([key, config]) => (
                <SelectItem key={key} value={key}>
                  <span className="flex items-center gap-2">
                    {config.icon}
                    {config.label}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedOlfactiveFamily} onValueChange={setSelectedOlfactiveFamily}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Famille olfactive" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les familles</SelectItem>
              {Object.entries(olfactiveFamilyConfig).map(([key, config]) => (
                <SelectItem key={key} value={key}>{config.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredMaterials.length === 0 && (
          <Card className="p-12 text-center">
            <Droplets className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">Aucune matière première trouvée</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || selectedCategory !== "all" || selectedOlfactiveFamily !== "all"
                ? "Essayez de modifier vos critères de recherche."
                : "Commencez par ajouter des matières premières à votre base de données."}
            </p>
            <Link href="/matieres-premieres/nouvelle">
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Ajouter une matière première
              </Button>
            </Link>
          </Card>
        )}

        {/* Materials Grid */}
        {!isLoading && filteredMaterials.length > 0 && (
          <Tabs defaultValue="grid" className="space-y-6">
            <div className="flex items-center justify-between">
              <TabsList>
                <TabsTrigger value="grid">Grille</TabsTrigger>
                <TabsTrigger value="category">Par catégorie</TabsTrigger>
              </TabsList>
              <span className="text-sm text-muted-foreground">
                {filteredMaterials.length} résultat{filteredMaterials.length > 1 ? 's' : ''}
              </span>
            </div>

            <TabsContent value="grid">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMaterials.map((material: any) => (
                  <RawMaterialCard key={material.id} material={material} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="category">
              <div className="space-y-8">
                {Object.entries(materialsByCategory).map(([category, materials]) => (
                  <div key={category}>
                    <div className="flex items-center gap-2 mb-4">
                      <CategoryBadge category={category} />
                      <span className="text-sm text-muted-foreground">
                        ({(materials as any[]).length})
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {(materials as any[]).map((material: any) => (
                        <RawMaterialCard key={material.id} material={material} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        )}
      </main>

      <Footer />
    </div>
  );
}
