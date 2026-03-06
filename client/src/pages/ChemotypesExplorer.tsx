// @ts-nocheck
import { safeJsonParse } from "@/lib/utils";
import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { 
  Search, 
  MapPin, 
  Leaf, 
  FlaskConical, 
  Heart, 
  Globe,
  ChevronRight,
  Filter,
  Info
} from "lucide-react";

interface Chemotype {
  name: string;
  origin: string;
  mainMolecules: string[];
  properties: string;
  usage: string;
}

interface PlantWithChemotypes {
  id: number;
  name: string;
  latinName: string | null;
  family: string | null;
  chemotypes: Chemotype[];
}

export default function ChemotypesExplorer() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrigin, setSelectedOrigin] = useState<string>("all");
  const [selectedFamily, setSelectedFamily] = useState<string>("all");
  const [expandedPlant, setExpandedPlant] = useState<number | null>(null);

  // Récupérer les plantes avec chémotypes
  const { data: plantsData, isLoading } = trpc.plants.list.useQuery({});

  // Filtrer et transformer les données
  const plantsWithChemotypes = useMemo(() => {
    if (!plantsData?.plants) return [];
    
    return plantsData.plants
      .filter((plant: any) => plant.chemotypes && plant.chemotypes.length > 2)
      .map((plant: any) => {
        let chemotypes: Chemotype[] = [];
        try {
          chemotypes = typeof plant.chemotypes === 'string' 
            ? safeJsonParse(plant.chemotypes, []) 
            : plant.chemotypes;
        } catch {
          chemotypes = [];
        }
        return {
          id: plant.id,
          name: plant.name,
          latinName: plant.latinName,
          family: plant.family,
          chemotypes
        } as PlantWithChemotypes;
      })
      .filter((p: PlantWithChemotypes) => p.chemotypes.length > 0);
  }, [plantsData]);

  // Extraire les origines et familles uniques
  const { origins, families } = useMemo(() => {
    const originsSet = new Set<string>();
    const familiesSet = new Set<string>();
    
    plantsWithChemotypes.forEach((plant: PlantWithChemotypes) => {
      if (plant.family) familiesSet.add(plant.family);
      plant.chemotypes.forEach((ct: Chemotype) => {
        if (ct.origin) originsSet.add(ct.origin);
      });
    });
    
    return {
      origins: Array.from(originsSet).sort(),
      families: Array.from(familiesSet).sort()
    };
  }, [plantsWithChemotypes]);

  // Filtrer les plantes
  const filteredPlants = useMemo(() => {
    return plantsWithChemotypes.filter((plant: PlantWithChemotypes) => {
      // Filtre par recherche
      const matchesSearch = searchTerm === "" || 
        plant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (plant.latinName && plant.latinName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        plant.chemotypes.some((ct: Chemotype) => 
          ct.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          ct.mainMolecules.some((m: string) => m.toLowerCase().includes(searchTerm.toLowerCase()))
        );
      
      // Filtre par origine
      const matchesOrigin = selectedOrigin === "all" || 
        plant.chemotypes.some((ct: Chemotype) => ct.origin.includes(selectedOrigin));
      
      // Filtre par famille
      const matchesFamily = selectedFamily === "all" || plant.family === selectedFamily;
      
      return matchesSearch && matchesOrigin && matchesFamily;
    });
  }, [plantsWithChemotypes, searchTerm, selectedOrigin, selectedFamily]);

  // Statistiques
  const stats = useMemo(() => {
    let totalChemotypes = 0;
    plantsWithChemotypes.forEach((p: PlantWithChemotypes) => {
      totalChemotypes += p.chemotypes.length;
    });
    return {
      plants: plantsWithChemotypes.length,
      chemotypes: totalChemotypes,
      origins: origins.length
    };
  }, [plantsWithChemotypes, origins]);

  if (isLoading) {
    return (
      <div className="container py-8">
      <Breadcrumbs />
        <Skeleton className="h-12 w-64 mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-24" />)}
        </div>
        <div className="space-y-4">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-48" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      {/* En-tête */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <FlaskConical className="h-8 w-8 text-primary" />
          Explorateur de Chémotypes
        </h1>
        <p className="text-muted-foreground max-w-3xl">
          Les chémotypes représentent les variations chimiques naturelles d'une même espèce végétale 
          selon son origine géographique, son terroir et ses conditions de culture. 
          Cette diversité chimique influence directement les propriétés thérapeutiques et olfactives.
        </p>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-500/10 rounded-full">
                <Leaf className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.plants}</p>
                <p className="text-sm text-muted-foreground">Plantes documentées</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-500/10 rounded-full">
                <FlaskConical className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.chemotypes}</p>
                <p className="text-sm text-muted-foreground">Chémotypes identifiés</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-amber-500/10 rounded-full">
                <Globe className="h-6 w-6 text-amber-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.origins}</p>
                <p className="text-sm text-muted-foreground">Origines géographiques</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtres */}
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher une plante, un chémotype ou une molécule..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedOrigin} onValueChange={setSelectedOrigin}>
              <SelectTrigger className="w-full md:w-[200px]">
                <MapPin className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Origine" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les origines</SelectItem>
                {origins.map((origin: string) => (
                  <SelectItem key={origin} value={origin}>{origin}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedFamily} onValueChange={setSelectedFamily}>
              <SelectTrigger className="w-full md:w-[200px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Famille" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les familles</SelectItem>
                {families.map((family: string) => (
                  <SelectItem key={family} value={family}>{family}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Liste des plantes */}
      <div className="space-y-6">
        {filteredPlants.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Info className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Aucune plante ne correspond à vos critères de recherche.</p>
            </CardContent>
          </Card>
        ) : (
          filteredPlants.map((plant: PlantWithChemotypes) => (
            <Card key={plant.id} className="overflow-hidden">
              <CardHeader 
                className="cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => setExpandedPlant(expandedPlant === plant.id ? null : plant.id)}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Leaf className="h-5 w-5 text-green-500" />
                      {plant.name}
                      <Badge variant="outline" className="ml-2">
                        {plant.chemotypes.length} chémotype{plant.chemotypes.length > 1 ? 's' : ''}
                      </Badge>
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {plant.latinName && <span className="italic">{plant.latinName}</span>}
                      {plant.family && <span className="ml-2">• {plant.family}</span>}
                    </CardDescription>
                  </div>
                  <ChevronRight 
                    className={`h-5 w-5 text-muted-foreground transition-transform ${
                      expandedPlant === plant.id ? 'rotate-90' : ''
                    }`} 
                  />
                </div>
              </CardHeader>
              
              {expandedPlant === plant.id && (
                <CardContent className="border-t">
                  <Tabs defaultValue={plant.chemotypes[0]?.name} className="mt-4">
                    <TabsList className="flex flex-wrap h-auto gap-2 bg-transparent">
                      {plant.chemotypes.map((ct: Chemotype, idx: number) => (
                        <TabsTrigger 
                          key={idx} 
                          value={ct.name}
                          className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                        >
                          {ct.name}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                    
                    {plant.chemotypes.map((ct: Chemotype, idx: number) => (
                      <TabsContent key={idx} value={ct.name} className="mt-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Origine */}
                          <div className="space-y-2">
                            <h4 className="font-semibold flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-amber-500" />
                              Origine géographique
                            </h4>
                            <p className="text-muted-foreground">{ct.origin}</p>
                          </div>
                          
                          {/* Molécules principales */}
                          <div className="space-y-2">
                            <h4 className="font-semibold flex items-center gap-2">
                              <FlaskConical className="h-4 w-4 text-blue-500" />
                              Molécules principales
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {ct.mainMolecules.map((mol: string, midx: number) => (
                                <Badge key={midx} variant="secondary">
                                  {mol}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          
                          {/* Propriétés */}
                          <div className="space-y-2">
                            <h4 className="font-semibold flex items-center gap-2">
                              <Heart className="h-4 w-4 text-red-500" />
                              Propriétés thérapeutiques
                            </h4>
                            <p className="text-muted-foreground">{ct.properties}</p>
                          </div>
                          
                          {/* Usage */}
                          <div className="space-y-2">
                            <h4 className="font-semibold flex items-center gap-2">
                              <Info className="h-4 w-4 text-green-500" />
                              Indications d'usage
                            </h4>
                            <p className="text-muted-foreground">{ct.usage}</p>
                          </div>
                        </div>
                      </TabsContent>
                    ))}
                  </Tabs>
                  
                  <div className="mt-6 pt-4 border-t">
                    <Link href={`/plantes/${plant.id}`}>
                      <Button variant="outline" size="sm">
                        Voir la fiche complète
                        <ChevronRight className="h-4 w-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              )}
            </Card>
          ))
        )}
      </div>

      {/* Note pédagogique */}
      <Card className="mt-8 bg-muted/50">
        <CardContent className="pt-6">
          <h3 className="font-semibold mb-2 flex items-center gap-2">
            <Info className="h-5 w-5 text-primary" />
            Qu'est-ce qu'un chémotype ?
          </h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Un <strong>chémotype</strong> (ou chimiotype) désigne une variation chimique au sein d'une même espèce végétale. 
            Deux plantes de la même espèce, cultivées dans des régions différentes, peuvent produire des huiles essentielles 
            aux compositions très distinctes. Cette variation est influencée par le climat, l'altitude, la nature du sol, 
            l'ensoleillement et d'autres facteurs environnementaux. En aromathérapie, il est crucial de connaître le chémotype 
            d'une huile essentielle car il détermine ses propriétés thérapeutiques et ses précautions d'emploi.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
