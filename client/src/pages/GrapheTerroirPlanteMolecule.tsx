// @ts-nocheck
import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import DashboardLayout from "@/components/DashboardLayout";
import { TerrainPlantMoleculeGraph, TerrainNode, TerrainLink } from "@/components/charts/TerrainPlantMoleculeGraph";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  Network, 
  MapPin, 
  Leaf, 
  FlaskConical, 
  RefreshCw,
  Info,
  AlertCircle,
  TrendingUp,
  Globe,
  Layers
} from "lucide-react";
import { Link } from "wouter";

export default function GrapheTerroirPlanteMolecule() {
  const [activeTab, setActiveTab] = useState("graph");
  
  // Récupérer les données du réseau
  const { data: networkData, isLoading: isLoadingNetwork, refetch, isFetching } = trpc.network.getMoleculePlantTerroirNetwork.useQuery();
  
  // Récupérer les statistiques des liaisons
  const { data: plantTerroirStats } = trpc.plantTerroirs.getNetworkStats.useQuery();
  const { data: plantMoleculeStats } = trpc.linkingCoverage.getPlantMoleculeAuditStats.useQuery();

  // Transformer les données pour le graphe
  const graphData = useMemo(() => {
    if (!networkData) return { nodes: [], links: [] };
    
    const nodes: TerrainNode[] = [];
    const links: TerrainLink[] = [];
    const nodeIds = new Set<string>();
    
    // Ajouter les terroirs
    if (networkData.entities?.terroirs) {
      networkData.entities.terroirs.forEach((terroir: any) => {
        const id = `terroir-${terroir.id}`;
        if (!nodeIds.has(id)) {
          nodeIds.add(id);
          nodes.push({
            id,
            name: terroir.name,
            type: 'terroir',
            data: {
              country: terroir.country,
              region: terroir.region,
              climateType: terroir.climateType,
              altitude: terroir.altitude,
            },
          });
        }
      });
    }
    
    // Ajouter les plantes
    if (networkData.entities?.plants) {
      networkData.entities.plants.forEach((plant: any) => {
        const id = `plant-${plant.id}`;
        if (!nodeIds.has(id)) {
          nodeIds.add(id);
          nodes.push({
            id,
            name: plant.name,
            type: 'plant',
            data: {
              latinName: plant.latinName,
              family: plant.family,
              category: plant.category,
            },
          });
        }
      });
    }
    
    // Ajouter les molécules (limiter aux 100 premières pour la performance)
    if (networkData.entities?.molecules) {
      const moleculesWithLinks = new Set<number>();
      
      // Identifier les molécules qui ont des liens
      if (networkData.relationships?.plantMolecules) {
        networkData.relationships.plantMolecules.forEach((rel: any) => {
          moleculesWithLinks.add(rel.moleculeId);
        });
      }
      
      networkData.entities.molecules
        .filter((m: any) => moleculesWithLinks.has(m.id))
        .slice(0, 150)
        .forEach((molecule: any) => {
          const id = `molecule-${molecule.id}`;
          if (!nodeIds.has(id)) {
            nodeIds.add(id);
            nodes.push({
              id,
              name: molecule.name,
              type: 'molecule',
              data: {
                chemicalClass: molecule.chemicalClass,
                olfactiveProfile: molecule.olfactiveProfile,
                casNumber: molecule.casNumber,
              },
            });
          }
        });
    }
    
    // Ajouter les liens terroir-plante
    if (networkData.relationships?.terroirPlants) {
      networkData.relationships.terroirPlants.forEach((rel: any) => {
        const sourceId = `terroir-${rel.terroirId}`;
        const targetId = `plant-${rel.plantId}`;
        
        if (nodeIds.has(sourceId) && nodeIds.has(targetId)) {
          links.push({
            source: sourceId,
            target: targetId,
            type: 'terroir-plant',
            isSignature: rel.isSignature === 1,
            value: rel.importance === 'majeure' ? 3 : rel.importance === 'significative' ? 2 : 1,
          });
        }
      });
    }
    
    // Ajouter les liens plante-molécule
    if (networkData.relationships?.plantMolecules) {
      networkData.relationships.plantMolecules.forEach((rel: any) => {
        const sourceId = `plant-${rel.plantId}`;
        const targetId = `molecule-${rel.moleculeId}`;
        
        if (nodeIds.has(sourceId) && nodeIds.has(targetId)) {
          links.push({
            source: sourceId,
            target: targetId,
            type: 'plant-molecule',
            isSignature: rel.isSignature === 1,
            role: rel.role,
            percentage: rel.percentageTypical ? parseFloat(rel.percentageTypical) : undefined,
          });
        }
      });
    }
    
    return { nodes, links };
  }, [networkData]);

  // Statistiques calculées
  const stats = useMemo(() => {
    const terroirCount = graphData.nodes.filter(n => n.type === 'terroir').length;
    const plantCount = graphData.nodes.filter(n => n.type === 'plant').length;
    const moleculeCount = graphData.nodes.filter(n => n.type === 'molecule').length;
    const terroirPlantLinks = graphData.links.filter(l => l.type === 'terroir-plant').length;
    const plantMoleculeLinks = graphData.links.filter(l => l.type === 'plant-molecule').length;
    
    // Plantes avec les deux types de connexions
    const plantsWithTerroirs = new Set(
      graphData.links
        .filter(l => l.type === 'terroir-plant')
        .map(l => typeof l.target === 'string' ? l.target : l.target.id)
    );
    const plantsWithMolecules = new Set(
      graphData.links
        .filter(l => l.type === 'plant-molecule')
        .map(l => typeof l.source === 'string' ? l.source : l.source.id)
    );
    const fullyConnectedPlants = Array.from(plantsWithTerroirs).filter(p => plantsWithMolecules.has(p)).length;
    
    return {
      terroirCount,
      plantCount,
      moleculeCount,
      terroirPlantLinks,
      plantMoleculeLinks,
      fullyConnectedPlants,
      totalNodes: graphData.nodes.length,
      totalLinks: graphData.links.length,
    };
  }, [graphData]);

  if (isLoadingNetwork) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <Skeleton className="h-10 w-96" />
          <div className="grid grid-cols-5 gap-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-24" />
            ))}
          </div>
          <Skeleton className="h-[700px]" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500/20 via-green-500/20 to-blue-500/20">
              <Network className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-500 via-green-500 to-blue-500 bg-clip-text text-transparent">
                Graphe Terroir-Plante-Molécule
              </h1>
              <p className="text-muted-foreground">
                Visualisation des connexions entre zones de production, plantes aromatiques et molécules
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching}>
              <RefreshCw className={`h-4 w-4 mr-2 ${isFetching ? 'animate-spin' : ''}`} />
              Actualiser
            </Button>
            <Link href="/carte-terroirs-plantes">
              <Button variant="outline" size="sm">
                <Globe className="h-4 w-4 mr-2" />
                Voir la carte
              </Button>
            </Link>
          </div>
        </div>

        {/* Alerte si peu de données */}
        {stats.terroirPlantLinks < 5 && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Données limitées</AlertTitle>
            <AlertDescription>
              Le graphe contient peu de connexions terroir-plante ({stats.terroirPlantLinks}).
              Pour enrichir la visualisation, ajoutez des liaisons via la page{" "}
              <Link href="/plant-terroir-linking" className="underline font-medium">
                Liaison Plantes-Terroirs
              </Link>.
            </AlertDescription>
          </Alert>
        )}

        {/* Onglets */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full md:w-auto grid-cols-3">
            <TabsTrigger value="graph" className="gap-2">
              <Network className="h-4 w-4" />
              <span className="hidden sm:inline">Graphe</span>
            </TabsTrigger>
            <TabsTrigger value="stats" className="gap-2">
              <TrendingUp className="h-4 w-4" />
              <span className="hidden sm:inline">Statistiques</span>
            </TabsTrigger>
            <TabsTrigger value="help" className="gap-2">
              <Info className="h-4 w-4" />
              <span className="hidden sm:inline">Guide</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="graph" className="mt-6">
            {graphData.nodes.length > 0 ? (
              <TerrainPlantMoleculeGraph
                nodes={graphData.nodes}
                links={graphData.links}
                height={700}
              />
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center h-[500px]">
                  <Layers className="h-16 w-16 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Aucune donnée disponible</h3>
                  <p className="text-muted-foreground text-center max-w-md mb-4">
                    Le graphe nécessite des connexions entre terroirs, plantes et molécules.
                    Commencez par créer des liaisons dans les pages d'administration.
                  </p>
                  <div className="flex gap-2">
                    <Link href="/plant-terroir-linking">
                      <Button variant="outline">
                        <MapPin className="h-4 w-4 mr-2" />
                        Lier Plantes-Terroirs
                      </Button>
                    </Link>
                    <Link href="/plant-molecule-linking">
                      <Button variant="outline">
                        <FlaskConical className="h-4 w-4 mr-2" />
                        Lier Plantes-Molécules
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="stats" className="mt-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Statistiques des entités */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Layers className="h-5 w-5" />
                    Entités du graphe
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-orange-500" />
                        <span>Terroirs</span>
                      </div>
                      <Badge variant="secondary">{stats.terroirCount}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Leaf className="h-4 w-4 text-green-500" />
                        <span>Plantes</span>
                      </div>
                      <Badge variant="secondary">{stats.plantCount}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FlaskConical className="h-4 w-4 text-blue-500" />
                        <span>Molécules</span>
                      </div>
                      <Badge variant="secondary">{stats.moleculeCount}</Badge>
                    </div>
                    <div className="pt-2 border-t">
                      <div className="flex items-center justify-between font-medium">
                        <span>Total nœuds</span>
                        <Badge>{stats.totalNodes}</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Statistiques des connexions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Network className="h-5 w-5" />
                    Connexions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Terroir → Plante</span>
                      <Badge variant="outline" className="bg-orange-500/10 text-orange-600">
                        {stats.terroirPlantLinks}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Plante → Molécule</span>
                      <Badge variant="outline" className="bg-blue-500/10 text-blue-600">
                        {stats.plantMoleculeLinks}
                      </Badge>
                    </div>
                    <div className="pt-2 border-t">
                      <div className="flex items-center justify-between font-medium">
                        <span>Total liens</span>
                        <Badge>{stats.totalLinks}</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Couverture */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Couverture
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {plantTerroirStats && (
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm">Plantes avec terroirs</span>
                          <span className="text-sm font-medium">{plantTerroirStats.plantsWithTerroirs}</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-orange-500 rounded-full"
                            style={{ width: `${Math.min((plantTerroirStats.plantsWithTerroirs / stats.plantCount) * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                    )}
                    {plantMoleculeStats && (
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm">Plantes avec molécules</span>
                          <span className="text-sm font-medium">{plantMoleculeStats.plantsWithMolecule}</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-blue-500 rounded-full"
                            style={{ width: `${Math.min((plantMoleculeStats.plantsWithMolecule / stats.plantCount) * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                    )}
                    <div className="pt-2 border-t">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Plantes complètes</span>
                        <Badge className="bg-green-500">{stats.fullyConnectedPlants}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Plantes connectées à la fois à un terroir et à des molécules
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="help" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Guide d'utilisation du graphe tripartite</CardTitle>
                <CardDescription>
                  Comprendre et naviguer dans la visualisation terroir-plante-molécule
                </CardDescription>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none dark:prose-invert">
                <h4 className="font-semibold flex items-center gap-2">
                  <Layers className="h-4 w-4" />
                  Structure du graphe
                </h4>
                <p>
                  Ce graphe représente les relations tripartites entre trois types d'entités :
                </p>
                <ul className="space-y-2">
                  <li>
                    <strong className="text-orange-600">Terroirs (📍)</strong> — Les zones géographiques de production, 
                    caractérisées par leur climat, sol et altitude. Ils sont positionnés en haut du graphe.
                  </li>
                  <li>
                    <strong className="text-green-600">Plantes (🌿)</strong> — Les espèces végétales aromatiques 
                    cultivées dans ces terroirs. Elles occupent la zone centrale.
                  </li>
                  <li>
                    <strong className="text-blue-600">Molécules (⚗️)</strong> — Les composés chimiques présents 
                    dans les plantes. Elles sont positionnées en bas du graphe.
                  </li>
                </ul>

                <h4 className="font-semibold mt-6 flex items-center gap-2">
                  <Network className="h-4 w-4" />
                  Types de connexions
                </h4>
                <ul className="space-y-2">
                  <li>
                    <strong>Terroir → Plante</strong> — Indique qu'une plante est cultivée ou récoltée 
                    dans un terroir spécifique. L'épaisseur du lien peut refléter l'importance de la production.
                  </li>
                  <li>
                    <strong>Plante → Molécule</strong> — Montre la composition chimique d'une plante. 
                    Les liens plus épais indiquent des pourcentages plus élevés. Les liens en pointillés 
                    représentent des molécules présentes à l'état de traces.
                  </li>
                </ul>

                <h4 className="font-semibold mt-6">Interactions</h4>
                <ul className="space-y-2">
                  <li><strong>Glisser-déposer</strong> — Cliquez et faites glisser un nœud pour le repositionner.</li>
                  <li><strong>Zoom</strong> — Utilisez la molette de la souris ou les boutons +/- pour zoomer.</li>
                  <li><strong>Survol</strong> — Passez la souris sur un nœud pour voir ses détails et mettre en évidence ses connexions.</li>
                  <li><strong>Recherche</strong> — Utilisez la barre de recherche pour filtrer les nœuds par nom.</li>
                  <li><strong>Filtres</strong> — Sélectionnez un type spécifique pour n'afficher que ces nœuds.</li>
                </ul>

                <h4 className="font-semibold mt-6">Conseils d'analyse</h4>
                <ul className="space-y-2">
                  <li>
                    Les <strong>terroirs avec beaucoup de connexions</strong> sont des zones de production majeures 
                    avec une grande diversité de plantes.
                  </li>
                  <li>
                    Les <strong>plantes centrales</strong> (avec des connexions vers terroirs ET molécules) 
                    sont les mieux documentées dans la base de données.
                  </li>
                  <li>
                    Les <strong>molécules partagées</strong> entre plusieurs plantes révèlent des similarités 
                    olfactives potentielles.
                  </li>
                  <li>
                    Utilisez le mode <strong>surbrillance</strong> pour isoler les connexions d'un nœud spécifique.
                  </li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
