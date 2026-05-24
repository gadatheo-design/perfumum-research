import { useState } from "react";
import { trpc } from "@/lib/trpc";
// DashboardLayout removed — public page, no auth required
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { PlantMoleculeGraph } from "@/components/PlantMoleculeGraph";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { 
  Network, 
  Leaf, 
  FlaskConical, 
  BarChart3, 
  Info,
  RefreshCw
} from "lucide-react";

interface PlantMoleculeLink {
  plantId: number;
  moleculeId: number;
  plantName: string;
  plantLatinName: string | null;
  plantFamily: string | null;
  moleculeName: string;
  moleculeFamily: string | null;
  percentageMin: string | null;
  percentageMax: string | null;
  percentageTypical: string | null;
  isSignature: number | null;
  role: string | null;
  moleculeOlfactiveProfile?: string | null;
  [key: string]: unknown;
}

export default function GraphePlanteMolecule() {
  const [activeTab, setActiveTab] = useState("graph");
  
  // Récupérer toutes les liaisons plante-molécule
  const { data: links, isLoading, refetch } = trpc.plantMoleculeLinks.getAll.useQuery();
  
  // Statistiques de couverture
  const { data: stats } = trpc.linkingCoverage.getPlantMoleculeAuditStats.useQuery();
  
  // Calculer les statistiques à partir des données
  const typedLinks = links as PlantMoleculeLink[] | undefined;
  const graphStats = typedLinks ? {
    totalLinks: typedLinks.length,
    uniquePlants: new Set(typedLinks.map((l) => l.plantId)).size,
    uniqueMolecules: new Set(typedLinks.map((l) => l.moleculeId)).size,
    signatureLinks: typedLinks.filter((l) => l.isSignature === 1).length,
    majorLinks: typedLinks.filter((l) => l.role === "majeur").length,
    secondaryLinks: typedLinks.filter((l) => l.role === "secondaire").length,
    traceLinks: typedLinks.filter((l) => l.role === "trace").length,
  } : null;
  
  // Familles de molécules uniques
  const moleculeFamilies = typedLinks 
    ? Array.from(new Set(typedLinks.map((l) => l.moleculeFamily).filter(Boolean)))
    : [];
  
  // Familles de plantes uniques
  const plantFamilies = typedLinks 
    ? Array.from(new Set(typedLinks.map((l) => l.plantFamily).filter(Boolean)))
    : [];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Network className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">Graphe Plante-Molécule</h1>
              <p className="text-muted-foreground">
                Visualisation interactive des relations entre plantes et molécules
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Actualiser
            </Button>
          </div>
        </div>

        {/* Statistiques rapides */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2">
                <Network className="h-4 w-4 text-primary" />
                <span className="text-sm text-muted-foreground">Liaisons</span>
              </div>
              <p className="text-2xl font-bold mt-1">
                {isLoading ? <Skeleton className="h-8 w-16" /> : graphStats?.totalLinks || 0}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2">
                <Leaf className="h-4 w-4 text-green-500" />
                <span className="text-sm text-muted-foreground">Plantes</span>
              </div>
              <p className="text-2xl font-bold mt-1">
                {isLoading ? <Skeleton className="h-8 w-16" /> : graphStats?.uniquePlants || 0}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2">
                <FlaskConical className="h-4 w-4 text-blue-500" />
                <span className="text-sm text-muted-foreground">Molécules</span>
              </div>
              <p className="text-2xl font-bold mt-1">
                {isLoading ? <Skeleton className="h-8 w-16" /> : graphStats?.uniqueMolecules || 0}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2">
                <span className="text-purple-500">★</span>
                <span className="text-sm text-muted-foreground">Signatures</span>
              </div>
              <p className="text-2xl font-bold mt-1">
                {isLoading ? <Skeleton className="h-8 w-16" /> : graphStats?.signatureLinks || 0}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-amber-500" />
                <span className="text-sm text-muted-foreground">Majeurs</span>
              </div>
              <p className="text-2xl font-bold mt-1">
                {isLoading ? <Skeleton className="h-8 w-16" /> : graphStats?.majorLinks || 0}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">○</span>
                <span className="text-sm text-muted-foreground">Traces</span>
              </div>
              <p className="text-2xl font-bold mt-1">
                {isLoading ? <Skeleton className="h-8 w-16" /> : graphStats?.traceLinks || 0}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Onglets */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="graph">
              <Network className="h-4 w-4 mr-2" />
              Graphe interactif
            </TabsTrigger>
            <TabsTrigger value="stats">
              <BarChart3 className="h-4 w-4 mr-2" />
              Statistiques
            </TabsTrigger>
            <TabsTrigger value="info">
              <Info className="h-4 w-4 mr-2" />
              Légende
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="graph" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Réseau de relations plante-molécule</CardTitle>
                <CardDescription>
                  Cliquez et faites glisser les nœuds pour explorer. Utilisez la molette pour zoomer.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="h-[600px] flex items-center justify-center">
                    <div className="text-center">
                      <RefreshCw className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
                      <p className="mt-2 text-muted-foreground">Chargement du graphe...</p>
                    </div>
                  </div>
                ) : links && links?.length > 0 ? (
                  <PlantMoleculeGraph links={links as PlantMoleculeLink[]} height={600} />
                ) : (
                  <div className="h-[600px] flex items-center justify-center">
                    <div className="text-center">
                      <Network className="h-12 w-12 mx-auto text-muted-foreground" />
                      <p className="mt-2 text-muted-foreground">Aucune liaison trouvée</p>
                      <p className="text-sm text-muted-foreground">
                        Ajoutez des liaisons plante-molécule pour voir le graphe
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="stats" className="mt-4">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Familles de molécules */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FlaskConical className="h-5 w-5" />
                    Familles de molécules
                  </CardTitle>
                  <CardDescription>
                    Distribution des molécules par famille chimique
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {moleculeFamilies.length > 0 ? (
                      moleculeFamilies.map((family) => {
                        const count = links?.filter((l) => (l as PlantMoleculeLink).moleculeFamily === family).length || 0;
                        return (
                          <Badge key={family as string} variant="secondary">
                            {family as string} ({count})
                          </Badge>
                        );
                      })
                    ) : (
                      <p className="text-muted-foreground">Aucune donnée</p>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              {/* Familles de plantes */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Leaf className="h-5 w-5" />
                    Familles botaniques
                  </CardTitle>
                  <CardDescription>
                    Distribution des plantes par famille botanique
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {plantFamilies.length > 0 ? (
                      plantFamilies.map((family) => {
                        const count = links?.filter((l) => (l as PlantMoleculeLink).plantFamily === family).length || 0;
                        return (
                          <Badge key={family as string} variant="outline">
                            {family as string} ({count})
                          </Badge>
                        );
                      })
                    ) : (
                      <p className="text-muted-foreground">Aucune donnée</p>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              {/* Couverture */}
              {stats && (
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle>Couverture des liaisons</CardTitle>
                    <CardDescription>
                      Progression vers les objectifs de liaison
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Total liaisons</p>
                        <p className="text-xl font-bold">{stats?.totalRelations}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Plantes liées</p>
                        <p className="text-xl font-bold">
                          {stats?.plantsWithMolecule}/{stats?.totalPlants}
                          <span className="text-sm text-muted-foreground ml-1">
                            ({Math.round((stats?.plantsWithMolecule / stats?.totalPlants) * 100)}%)
                          </span>
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Molécules liées</p>
                        <p className="text-xl font-bold">
                          {stats?.moleculesWithPlant}/{stats?.totalMolecules}
                          <span className="text-sm text-muted-foreground ml-1">
                            ({Math.round((stats?.moleculesWithPlant / stats?.totalMolecules) * 100)}%)
                          </span>
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Plantes orphelines</p>
                        <p className="text-xl font-bold text-amber-500">{stats?.plantsWithoutMolecule}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="info" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Guide d'utilisation</CardTitle>
                <CardDescription>
                  Comment lire et interagir avec le graphe
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Nœuds */}
                <div>
                  <h3 className="font-semibold mb-2">Types de nœuds</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                      <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white">
                        🌿
                      </div>
                      <div>
                        <p className="font-medium">Plantes</p>
                        <p className="text-sm text-muted-foreground">
                          Cercles verts, taille proportionnelle au nombre de connexions
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                      <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm">
                        ⚗️
                      </div>
                      <div>
                        <p className="font-medium">Molécules</p>
                        <p className="text-sm text-muted-foreground">
                          Cercles bleus, couleur selon la famille chimique
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Liens */}
                <div>
                  <h3 className="font-semibold mb-2">Types de liens</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-1 bg-purple-500 rounded"></div>
                      <span>Molécule signature (lien violet, plus court)</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-0.5 bg-slate-400 rounded"></div>
                      <span>Liaison standard (épaisseur selon le pourcentage)</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-0.5 bg-slate-400 rounded border-dashed border-b-2 border-slate-400"></div>
                      <span>Molécule trace (lien pointillé)</span>
                    </div>
                  </div>
                </div>
                
                {/* Interactions */}
                <div>
                  <h3 className="font-semibold mb-2">Interactions</h3>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• <strong>Glisser-déposer</strong> : Déplacez les nœuds pour réorganiser le graphe</li>
                    <li>• <strong>Molette</strong> : Zoomez et dézoomez</li>
                    <li>• <strong>Survol</strong> : Affichez les détails et mettez en évidence les connexions</li>
                    <li>• <strong>Clic</strong> : Sélectionnez un nœud pour voir ses détails</li>
                    <li>• <strong>Recherche</strong> : Filtrez par nom de plante ou molécule</li>
                    <li>• <strong>Filtres</strong> : Affichez par rôle ou famille de molécule</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      </main>
      <Footer />
    </div>
  );
}
