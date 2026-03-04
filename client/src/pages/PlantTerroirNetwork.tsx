// @ts-nocheck
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { PlantTerroirNetworkGraph, NetworkNode, NetworkLink } from "@/components/charts/PlantTerroirNetworkGraph";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, Network, Leaf, MapPin, Beaker, FlaskConical, RefreshCw } from "lucide-react";

export function PlantTerroirNetwork() {
  const [showPlants, setShowPlants] = useState(true);
  const [showTerroirs, setShowTerroirs] = useState(true);
  const [showMolecules, setShowMolecules] = useState(false);
  const [showRawMaterials, setShowRawMaterials] = useState(false);
  const [countryFilter, setCountryFilter] = useState<string>("");

  // Query pour les données du graphe
  const { data: networkData, isLoading, refetch, isFetching } = trpc.networkGraph.getFilteredNetworkData.useQuery({
    showPlants,
    showTerroirs,
    showMolecules,
    showRawMaterials,
    countryFilter: countryFilter || undefined,
  });

  // Query pour les statistiques
  const { data: stats } = trpc.plantTerroirs.getNetworkStats.useQuery();

  // Query pour les terroirs (pour le filtre par pays)
  const { data: terroirs } = trpc.terroirs.getAll.useQuery();

  // Extraire les pays uniques
  const countries: string[] = terroirs 
    ? Array.from(new Set(terroirs.map((t: any) => t.country).filter((c: string | null | undefined): c is string => Boolean(c))))
    : [];

  if (isLoading) {
    return (
      <div className="container py-8">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-96 mt-2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[800px] w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-8 space-y-6">
      {/* En-tête */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Network className="h-8 w-8 text-primary" />
            Réseau Plantes-Terroirs
          </h1>
          <p className="text-muted-foreground mt-2">
            Visualisation interactive des connexions entre plantes, terroirs, molécules et matières premières.
          </p>
        </div>
        <Button 
          variant="outline" 
          onClick={() => refetch()}
          disabled={isFetching}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isFetching ? 'animate-spin' : ''}`} />
          Actualiser
        </Button>
      </div>

      {/* Statistiques globales */}
      {stats && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Statistiques des connexions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary">{stats.totalRelations}</div>
                <p className="text-xs text-muted-foreground">Relations plante-terroir</p>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">{stats.plantsWithTerroirs}</div>
                <p className="text-xs text-muted-foreground">Plantes avec terroirs</p>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">{stats.terroirsWithPlants}</div>
                <p className="text-xs text-muted-foreground">Terroirs avec plantes</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="graph" className="space-y-6">
        <TabsList>
          <TabsTrigger value="graph">Graphe de réseau</TabsTrigger>
          <TabsTrigger value="help">Guide d'utilisation</TabsTrigger>
        </TabsList>

        <TabsContent value="graph" className="space-y-6">
          {/* Filtres */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Filtres et options</CardTitle>
              <CardDescription>
                Personnalisez l'affichage du graphe en sélectionnant les types de nœuds à afficher
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-6">
                {/* Switches pour les types de nœuds */}
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="show-plants" 
                    checked={showPlants}
                    onCheckedChange={setShowPlants}
                  />
                  <Label htmlFor="show-plants" className="flex items-center gap-2">
                    <Leaf className="h-4 w-4 text-green-600" />
                    Plantes
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="show-terroirs" 
                    checked={showTerroirs}
                    onCheckedChange={setShowTerroirs}
                  />
                  <Label htmlFor="show-terroirs" className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-orange-600" />
                    Terroirs
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="show-molecules" 
                    checked={showMolecules}
                    onCheckedChange={setShowMolecules}
                  />
                  <Label htmlFor="show-molecules" className="flex items-center gap-2">
                    <Beaker className="h-4 w-4 text-blue-600" />
                    Molécules
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="show-raw-materials" 
                    checked={showRawMaterials}
                    onCheckedChange={setShowRawMaterials}
                  />
                  <Label htmlFor="show-raw-materials" className="flex items-center gap-2">
                    <FlaskConical className="h-4 w-4 text-purple-600" />
                    Matières premières
                  </Label>
                </div>

                {/* Filtre par pays */}
                <div className="flex items-center gap-2">
                  <Label>Pays :</Label>
                  <Select value={countryFilter} onValueChange={setCountryFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Tous les pays" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Tous les pays</SelectItem>
                      {countries.map(country => (
                        <SelectItem key={country} value={country || ""}>
                          {country}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Graphe */}
          <Card>
            <CardContent className="pt-6">
              {networkData && networkData.nodes.length > 0 ? (
                <PlantTerroirNetworkGraph 
                  nodes={networkData.nodes as NetworkNode[]} 
                  links={networkData.links as NetworkLink[]}
                  width={1200}
                  height={700}
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-[400px] text-muted-foreground">
                  <AlertCircle className="h-12 w-12 mb-4" />
                  <p className="text-lg font-medium">Aucune donnée à afficher</p>
                  <p className="text-sm">
                    {!showPlants && !showTerroirs && !showMolecules && !showRawMaterials 
                      ? "Activez au moins un type de nœud pour voir le graphe"
                      : "Aucune connexion trouvée avec les filtres actuels"}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="help">
          <Card>
            <CardHeader>
              <CardTitle>Guide d'utilisation du graphe de réseau</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none dark:prose-invert">
              <h4 className="font-semibold">Types de nœuds</h4>
              <ul className="space-y-2">
                <li>
                  <strong className="text-green-600">Plantes (vert)</strong> : Les espèces végétales de la base de données. 
                  Chaque plante peut être connectée à plusieurs terroirs d'origine.
                </li>
                <li>
                  <strong className="text-orange-600">Terroirs (orange)</strong> : Les régions géographiques de production. 
                  Un terroir peut accueillir plusieurs plantes.
                </li>
                <li>
                  <strong className="text-blue-600">Molécules (bleu)</strong> : Les composés chimiques présents dans les plantes.
                  Les connexions indiquent la présence de la molécule dans une plante.
                </li>
                <li>
                  <strong className="text-purple-600">Matières premières (violet)</strong> : Les extraits et huiles essentielles.
                  Connectées aux plantes sources et aux terroirs de production.
                </li>
              </ul>

              <h4 className="font-semibold mt-6">Types de connexions</h4>
              <ul className="space-y-2">
                <li>
                  <strong>Plante → Terroir</strong> : Indique qu'une plante est cultivée ou récoltée dans ce terroir.
                  Ces connexions sont les plus importantes pour comprendre l'origine géographique des matières.
                </li>
                <li>
                  <strong>Plante → Molécule</strong> : Montre la composition chimique d'une plante.
                  L'épaisseur du lien peut indiquer la concentration.
                </li>
                <li>
                  <strong>Matière première → Terroir</strong> : Origine géographique d'un extrait spécifique.
                </li>
              </ul>

              <h4 className="font-semibold mt-6">Interactions</h4>
              <ul className="space-y-2">
                <li>
                  <strong>Glisser-déposer</strong> : Cliquez et faites glisser un nœud pour le repositionner.
                </li>
                <li>
                  <strong>Zoom</strong> : Utilisez la molette ou les boutons pour zoomer.
                </li>
                <li>
                  <strong>Survol</strong> : Passez la souris sur un nœud pour voir ses détails et mettre en évidence ses connexions.
                </li>
                <li>
                  <strong>Clic</strong> : Cliquez sur un nœud pour afficher ses informations détaillées.
                </li>
              </ul>

              <h4 className="font-semibold mt-6">Conseils d'analyse</h4>
              <ul className="space-y-2">
                <li>
                  Les <strong>nœuds centraux</strong> avec beaucoup de connexions sont des éléments clés du réseau.
                </li>
                <li>
                  Les <strong>clusters</strong> (groupes de nœuds proches) révèlent des familles de plantes 
                  ou des régions de production similaires.
                </li>
                <li>
                  Utilisez le filtre par pays pour explorer les spécificités régionales.
                </li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default PlantTerroirNetwork;
