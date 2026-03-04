// @ts-nocheck
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  FlaskConical, 
  Search,
  Plus,
  Thermometer,
  Gauge,
  Clock,
  DollarSign,
  Zap,
  CheckCircle,
  XCircle
} from "lucide-react";

// Mapping des catégories vers des couleurs
const categoryColors: Record<string, string> = {
  distillation: "bg-blue-500/10 text-blue-600 border-blue-500/30",
  expression: "bg-yellow-500/10 text-yellow-600 border-yellow-500/30",
  extraction_solvant: "bg-purple-500/10 text-purple-600 border-purple-500/30",
  co2_supercritique: "bg-green-500/10 text-green-600 border-green-500/30",
  enfleurage: "bg-pink-500/10 text-pink-600 border-pink-500/30",
  maceration: "bg-amber-500/10 text-amber-600 border-amber-500/30",
  hydrodistillation: "bg-cyan-500/10 text-cyan-600 border-cyan-500/30",
  percolation: "bg-orange-500/10 text-orange-600 border-orange-500/30",
  other: "bg-gray-500/10 text-gray-600 border-gray-500/30",
};

// Mapping des niveaux de coût
const costLevelLabels: Record<string, { label: string; color: string }> = {
  low: { label: "Faible", color: "text-green-600" },
  medium: { label: "Moyen", color: "text-yellow-600" },
  high: { label: "Élevé", color: "text-orange-600" },
  very_high: { label: "Très élevé", color: "text-red-600" },
};

// Mapping des niveaux de complexité
const complexityLevelLabels: Record<string, { label: string; color: string }> = {
  simple: { label: "Simple", color: "text-green-600" },
  moderate: { label: "Modéré", color: "text-yellow-600" },
  complex: { label: "Complexe", color: "text-orange-600" },
  expert: { label: "Expert", color: "text-red-600" },
};

export default function ExtractionMethods() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedCost, setSelectedCost] = useState<string>("all");
  
  const { data: methods, isLoading } = trpc.extractionMethods.getAll.useQuery();
  
  // Filtrer les méthodes
  const filteredMethods = methods?.filter((method: any) => {
    const matchesSearch = searchQuery === "" || 
      method.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      method.shortName?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || method.category === selectedCategory;
    const matchesCost = selectedCost === "all" || method.costLevel === selectedCost;
    return matchesSearch && matchesCategory && matchesCost;
  }) || [];
  
  return (
    <div className="container py-8 max-w-7xl">
      {/* En-tête */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3 mb-2">
            <FlaskConical className="h-8 w-8 text-primary" />
            Méthodes d'extraction
          </h1>
          <p className="text-muted-foreground">
            Techniques d'extraction des matières premières aromatiques
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Ajouter une méthode
        </Button>
      </div>
      
      {/* Statistiques */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <FlaskConical className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{methods?.length || 0}</p>
                <p className="text-sm text-muted-foreground">Méthodes</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <Thermometer className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {methods?.filter((m: any) => m.category === "distillation" || m.category === "hydrodistillation").length || 0}
                </p>
                <p className="text-sm text-muted-foreground">Distillations</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/10">
                <Zap className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {methods?.filter((m: any) => m.complexityLevel === "simple" || m.complexityLevel === "moderate").length || 0}
                </p>
                <p className="text-sm text-muted-foreground">Accessibles</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-500/10">
                <Gauge className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {methods?.filter((m: any) => m.category === "co2_supercritique").length || 0}
                </p>
                <p className="text-sm text-muted-foreground">CO₂ supercritique</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Filtres */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher une méthode..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Catégorie" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les catégories</SelectItem>
            <SelectItem value="distillation">Distillation</SelectItem>
            <SelectItem value="hydrodistillation">Hydrodistillation</SelectItem>
            <SelectItem value="expression">Expression</SelectItem>
            <SelectItem value="extraction_solvant">Extraction solvant</SelectItem>
            <SelectItem value="co2_supercritique">CO₂ supercritique</SelectItem>
            <SelectItem value="enfleurage">Enfleurage</SelectItem>
            <SelectItem value="maceration">Macération</SelectItem>
            <SelectItem value="percolation">Percolation</SelectItem>
          </SelectContent>
        </Select>
        <Select value={selectedCost} onValueChange={setSelectedCost}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Coût" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les coûts</SelectItem>
            <SelectItem value="low">Faible</SelectItem>
            <SelectItem value="medium">Moyen</SelectItem>
            <SelectItem value="high">Élevé</SelectItem>
            <SelectItem value="very_high">Très élevé</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {/* Contenu */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 w-3/4 bg-muted rounded" />
                <div className="h-4 w-1/2 bg-muted rounded" />
              </CardHeader>
              <CardContent>
                <div className="h-32 bg-muted rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredMethods.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <FlaskConical className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Aucune méthode trouvée</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery || selectedCategory !== "all" || selectedCost !== "all"
                ? "Aucune méthode ne correspond à vos critères de recherche."
                : "Commencez par ajouter des méthodes d'extraction."}
            </p>
            <Button variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Ajouter une méthode
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredMethods.map((method: any) => (
            <Card key={method.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <FlaskConical className="h-5 w-5" />
                      {method.name}
                    </CardTitle>
                    {method.shortName && (
                      <CardDescription>{method.shortName}</CardDescription>
                    )}
                  </div>
                  <Badge className={categoryColors[method.category] || categoryColors.other}>
                    {method.category?.replace(/_/g, " ")}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {method.description && (
                  <p className="text-sm text-muted-foreground">
                    {method.description}
                  </p>
                )}
                
                {method.principle && (
                  <div>
                    <h4 className="text-sm font-medium mb-1">Principe</h4>
                    <p className="text-sm text-muted-foreground">{method.principle}</p>
                  </div>
                )}
                
                {/* Indicateurs */}
                <div className="flex flex-wrap gap-4 pt-2 border-t">
                  {method.costLevel && (
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span className={`text-sm font-medium ${costLevelLabels[method.costLevel]?.color}`}>
                        {costLevelLabels[method.costLevel]?.label}
                      </span>
                    </div>
                  )}
                  {method.complexityLevel && (
                    <div className="flex items-center gap-2">
                      <Gauge className="h-4 w-4 text-muted-foreground" />
                      <span className={`text-sm font-medium ${complexityLevelLabels[method.complexityLevel]?.color}`}>
                        {complexityLevelLabels[method.complexityLevel]?.label}
                      </span>
                    </div>
                  )}
                </div>
                
                {/* Avantages et inconvénients */}
                <div className="grid grid-cols-2 gap-4 pt-2">
                  {method.advantages && (
                    <div>
                      <h4 className="text-sm font-medium flex items-center gap-1 mb-2 text-green-600">
                        <CheckCircle className="h-4 w-4" />
                        Avantages
                      </h4>
                      <ul className="text-xs text-muted-foreground space-y-1">
                        {(typeof method.advantages === 'string' 
                          ? JSON.parse(method.advantages) 
                          : method.advantages
                        ).slice(0, 3).map((adv: string, idx: number) => (
                          <li key={idx}>• {adv}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {method.disadvantages && (
                    <div>
                      <h4 className="text-sm font-medium flex items-center gap-1 mb-2 text-red-600">
                        <XCircle className="h-4 w-4" />
                        Inconvénients
                      </h4>
                      <ul className="text-xs text-muted-foreground space-y-1">
                        {(typeof method.disadvantages === 'string' 
                          ? JSON.parse(method.disadvantages) 
                          : method.disadvantages
                        ).slice(0, 3).map((dis: string, idx: number) => (
                          <li key={idx}>• {dis}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                
                {/* Best for */}
                {method.bestFor && (
                  <div className="pt-2 border-t">
                    <h4 className="text-sm font-medium mb-2">Recommandé pour</h4>
                    <div className="flex flex-wrap gap-1">
                      {(typeof method.bestFor === 'string' 
                        ? JSON.parse(method.bestFor) 
                        : method.bestFor
                      ).map((item: string, idx: number) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {item}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
