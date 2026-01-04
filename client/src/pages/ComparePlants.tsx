import { useState, useMemo } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Loader2, Leaf, Plus, X, GitCompare, BarChart3, 
  MapPin, Beaker, FlaskConical, Thermometer, Droplets
} from "lucide-react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

const COLORS = ["#8b5cf6", "#10b981", "#f59e0b", "#ef4444", "#3b82f6"];

export default function ComparePlants() {
  const [selectedPlantIds, setSelectedPlantIds] = useState<number[]>([]);
  
  const { data: plants, isLoading } = trpc.plants.list.useQuery();

  // Plantes sélectionnées
  const selectedPlants = useMemo(() => {
    if (!plants) return [];
    return selectedPlantIds
      .map(id => plants.find((p: any) => p.id === id))
      .filter(Boolean);
  }, [plants, selectedPlantIds]);

  // Ajouter une plante
  const addPlant = (plantId: string) => {
    const id = parseInt(plantId);
    if (!selectedPlantIds.includes(id) && selectedPlantIds.length < 5) {
      setSelectedPlantIds([...selectedPlantIds, id]);
    }
  };

  // Retirer une plante
  const removePlant = (plantId: number) => {
    setSelectedPlantIds(selectedPlantIds.filter(id => id !== plantId));
  };

  // Plantes disponibles (non sélectionnées)
  const availablePlants = useMemo(() => {
    if (!plants) return [];
    return plants.filter((p: any) => !selectedPlantIds.includes(p.id));
  }, [plants, selectedPlantIds]);

  // Données pour le radar des axes climatiques
  const radarData = useMemo(() => {
    const axes = ["Vent", "Bois", "Disparition"];
    return axes.map(axis => {
      const dataPoint: any = { axis };
      selectedPlants.forEach((plant: any, index) => {
        // Calculer un score basé sur l'axe climatique
        let score = 0;
        const climaticAxis = plant.climaticAxis || "";
        if (axis === "Vent" && climaticAxis.includes("vent")) score = 80;
        if (axis === "Bois" && climaticAxis.includes("bois")) score = 80;
        if (axis === "Disparition" && climaticAxis.includes("disparition")) score = 80;
        if (!climaticAxis) score = 30; // Score par défaut
        dataPoint[plant.name] = score;
      });
      return dataPoint;
    });
  }, [selectedPlants]);

  // Données pour le graphique des catégories
  const categoryData = useMemo(() => {
    const categories: Record<string, number> = {};
    selectedPlants.forEach((plant: any) => {
      const cat = plant.category || "autre";
      categories[cat] = (categories[cat] || 0) + 1;
    });
    return Object.entries(categories).map(([name, count]) => ({ name, count }));
  }, [selectedPlants]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="container max-w-7xl">
        <Breadcrumbs customItems={[
          { label: "Plantes", path: "/plants" },
          { label: "Comparaison" }
        ]} />

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <GitCompare className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Comparaison de Plantes</h1>
          </div>
          <p className="text-muted-foreground">
            Comparez jusqu'à 5 plantes pour analyser leurs profils moléculaires et caractéristiques.
          </p>
        </div>

        {/* Sélecteur de plantes */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Leaf className="h-5 w-5" />
              Sélectionner les plantes
            </CardTitle>
            <CardDescription>
              Choisissez jusqu'à 5 plantes à comparer
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedPlants.map((plant: any, index) => (
                <Badge 
                  key={plant.id} 
                  variant="secondary"
                  className="text-sm py-1 px-3 flex items-center gap-2"
                  style={{ borderColor: COLORS[index], borderWidth: 2 }}
                >
                  <span 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: COLORS[index] }}
                  />
                  {plant.name}
                  <button 
                    onClick={() => removePlant(plant.id)}
                    className="hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
            
            {selectedPlantIds.length < 5 && (
              <div className="flex gap-2">
                <Select onValueChange={addPlant}>
                  <SelectTrigger className="w-full md:w-[300px]">
                    <Plus className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Ajouter une plante..." />
                  </SelectTrigger>
                  <SelectContent>
                    {availablePlants.map((plant: any) => (
                      <SelectItem key={plant.id} value={plant.id.toString()}>
                        {plant.name} {plant.latinName && `(${plant.latinName})`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Contenu de comparaison */}
        {selectedPlants.length >= 2 ? (
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList>
              <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
              <TabsTrigger value="molecules">Profils moléculaires</TabsTrigger>
              <TabsTrigger value="terroirs">Terroirs</TabsTrigger>
              <TabsTrigger value="usage">Usage ABSORBE</TabsTrigger>
            </TabsList>

            {/* Vue d'ensemble */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Radar des axes climatiques */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Axes Climatiques ABSORBE
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart data={radarData}>
                          <PolarGrid />
                          <PolarAngleAxis dataKey="axis" />
                          <PolarRadiusAxis angle={30} domain={[0, 100]} />
                          {selectedPlants.map((plant: any, index) => (
                            <Radar
                              key={plant.id}
                              name={plant.name}
                              dataKey={plant.name}
                              stroke={COLORS[index]}
                              fill={COLORS[index]}
                              fillOpacity={0.3}
                            />
                          ))}
                          <Legend />
                          <Tooltip />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* Tableau comparatif */}
                <Card>
                  <CardHeader>
                    <CardTitle>Caractéristiques</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-2 px-2">Propriété</th>
                            {selectedPlants.map((plant: any, index) => (
                              <th 
                                key={plant.id} 
                                className="text-left py-2 px-2"
                                style={{ color: COLORS[index] }}
                              >
                                {plant.name}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b">
                            <td className="py-2 px-2 font-medium">Famille</td>
                            {selectedPlants.map((plant: any) => (
                              <td key={plant.id} className="py-2 px-2">
                                {plant.family || "-"}
                              </td>
                            ))}
                          </tr>
                          <tr className="border-b">
                            <td className="py-2 px-2 font-medium">Catégorie</td>
                            {selectedPlants.map((plant: any) => (
                              <td key={plant.id} className="py-2 px-2">
                                <Badge variant="outline">{plant.category || "-"}</Badge>
                              </td>
                            ))}
                          </tr>
                          <tr className="border-b">
                            <td className="py-2 px-2 font-medium">Axe climatique</td>
                            {selectedPlants.map((plant: any) => (
                              <td key={plant.id} className="py-2 px-2">
                                {plant.climaticAxis || "-"}
                              </td>
                            ))}
                          </tr>
                          <tr className="border-b">
                            <td className="py-2 px-2 font-medium">Origine</td>
                            {selectedPlants.map((plant: any) => (
                              <td key={plant.id} className="py-2 px-2">
                                {plant.origin || "-"}
                              </td>
                            ))}
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Cartes détaillées */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {selectedPlants.map((plant: any, index) => (
                  <Card key={plant.id} style={{ borderColor: COLORS[index], borderWidth: 2 }}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <span 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: COLORS[index] }}
                        />
                        {plant.name}
                      </CardTitle>
                      {plant.latinName && (
                        <CardDescription className="italic">
                          {plant.latinName}
                        </CardDescription>
                      )}
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      {plant.olfactiveSignature && (
                        <p className="text-muted-foreground">
                          {plant.olfactiveSignature}
                        </p>
                      )}
                      {plant.dominantMolecules && (
                        <div className="flex items-center gap-2">
                          <Beaker className="h-4 w-4 text-primary" />
                          <span>{plant.dominantMolecules}</span>
                        </div>
                      )}
                      <Link href={`/plants/${plant.id}`}>
                        <Button variant="ghost" size="sm" className="w-full mt-2">
                          Voir la fiche complète
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Profils moléculaires */}
            <TabsContent value="molecules" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FlaskConical className="h-5 w-5" />
                    Molécules Dominantes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {selectedPlants.map((plant: any, index) => (
                      <div 
                        key={plant.id}
                        className="p-4 rounded-lg border"
                        style={{ borderColor: COLORS[index] }}
                      >
                        <h4 className="font-medium mb-2" style={{ color: COLORS[index] }}>
                          {plant.name}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {plant.dominantMolecules || "Données moléculaires non disponibles"}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Terroirs */}
            <TabsContent value="terroirs" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Origines et Terroirs
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {selectedPlants.map((plant: any, index) => (
                      <div 
                        key={plant.id}
                        className="p-4 rounded-lg border"
                        style={{ borderColor: COLORS[index] }}
                      >
                        <h4 className="font-medium mb-2" style={{ color: COLORS[index] }}>
                          {plant.name}
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            <span>{plant.origin || "Origine non spécifiée"}</span>
                          </div>
                          {plant.habitat && (
                            <p className="text-muted-foreground">{plant.habitat}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Usage ABSORBE */}
            <TabsContent value="usage" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Usage dans le Système ABSORBE</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {selectedPlants.map((plant: any, index) => (
                      <div 
                        key={plant.id}
                        className="p-4 rounded-lg border"
                        style={{ borderColor: COLORS[index] }}
                      >
                        <h4 className="font-medium mb-2" style={{ color: COLORS[index] }}>
                          {plant.name}
                        </h4>
                        <div className="space-y-2 text-sm">
                          {plant.climaticAxis && (
                            <Badge variant="outline">
                              Axe: {plant.climaticAxis}
                            </Badge>
                          )}
                          {plant.absorbeUse && (
                            <p className="text-muted-foreground mt-2">{plant.absorbeUse}</p>
                          )}
                          {plant.traditionalUse && (
                            <p className="text-muted-foreground">
                              <span className="font-medium">Usage traditionnel:</span> {plant.traditionalUse}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        ) : (
          <Card className="text-center py-12">
            <CardContent>
              <GitCompare className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-medium mb-2">
                Sélectionnez au moins 2 plantes
              </h3>
              <p className="text-muted-foreground">
                Utilisez le sélecteur ci-dessus pour choisir les plantes à comparer.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
