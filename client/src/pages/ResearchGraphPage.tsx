import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { ResearchGraph } from '@/components/ResearchGraph';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Network, 
  Leaf, 
  FlaskConical, 
  Route, 
  BookOpen, 
  MapPin,
  TrendingUp,
  Link2,
  Info
} from 'lucide-react';

export default function ResearchGraphPage() {
  const [activeTab, setActiveTab] = useState('graph');
  
  // Récupérer les données du graphe
  const { data: graphData, isLoading: graphLoading } = trpc.researchGraph.getData.useQuery({
    includeEdges: true,
  });
  
  // Récupérer les statistiques
  const { data: stats, isLoading: statsLoading } = trpc.researchGraph.getStats.useQuery();

  // Gérer le clic sur un nœud
  const handleNodeClick = (node: any) => {
    console.log('Node clicked:', node);
    // Possibilité d'ouvrir un panneau de détails ou de naviguer vers une page dédiée
  };

  return (
    <div className="min-h-screen bg-background">
      {/* En-tête */}
      <div className="border-b bg-card">
        <div className="container py-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <Network className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Graphe de Recherche</h1>
              <p className="text-muted-foreground">
                Visualisation interactive des connexions entre plantes, molécules, routes commerciales et sources historiques
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="graph" className="gap-2">
              <Network className="h-4 w-4" />
              Graphe interactif
            </TabsTrigger>
            <TabsTrigger value="stats" className="gap-2">
              <TrendingUp className="h-4 w-4" />
              Statistiques
            </TabsTrigger>
            <TabsTrigger value="about" className="gap-2">
              <Info className="h-4 w-4" />
              À propos
            </TabsTrigger>
          </TabsList>

          {/* Onglet Graphe */}
          <TabsContent value="graph" className="space-y-4">
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                {graphLoading ? (
                  <div className="h-[600px] flex items-center justify-center">
                    <div className="text-center space-y-4">
                      <Skeleton className="h-12 w-12 rounded-full mx-auto" />
                      <Skeleton className="h-4 w-48 mx-auto" />
                      <p className="text-sm text-muted-foreground">Chargement du graphe...</p>
                    </div>
                  </div>
                ) : graphData ? (
                  <div className="h-[600px] bg-slate-950">
                    <ResearchGraph
                      data={graphData}
                      onNodeClick={handleNodeClick}
                      className="w-full h-full"
                    />
                  </div>
                ) : (
                  <div className="h-[600px] flex items-center justify-center">
                    <p className="text-muted-foreground">Aucune donnée disponible</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Instructions */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Comment utiliser le graphe</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-start gap-2">
                    <div className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-medium">1</span>
                    </div>
                    <p className="text-muted-foreground">
                      <strong className="text-foreground">Navigation :</strong> Cliquez et faites glisser pour déplacer la vue. Utilisez la molette pour zoomer.
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-medium">2</span>
                    </div>
                    <p className="text-muted-foreground">
                      <strong className="text-foreground">Sélection :</strong> Cliquez sur un nœud pour voir ses détails et ses connexions.
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-medium">3</span>
                    </div>
                    <p className="text-muted-foreground">
                      <strong className="text-foreground">Filtres :</strong> Utilisez le bouton filtre pour afficher uniquement certains types d'entités.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Statistiques */}
          <TabsContent value="stats" className="space-y-6">
            {statsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <Card key={i}>
                    <CardContent className="p-6">
                      <Skeleton className="h-8 w-16 mb-2" />
                      <Skeleton className="h-4 w-24" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : stats ? (
              <>
                {/* Statistiques des nœuds */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Entités dans le graphe</h3>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-green-500/10">
                            <Leaf className="h-5 w-5 text-green-500" />
                          </div>
                          <div>
                            <p className="text-2xl font-bold">{stats.nodes.plants}</p>
                            <p className="text-sm text-muted-foreground">Plantes</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-blue-500/10">
                            <FlaskConical className="h-5 w-5 text-blue-500" />
                          </div>
                          <div>
                            <p className="text-2xl font-bold">{stats.nodes.molecules}</p>
                            <p className="text-sm text-muted-foreground">Molécules</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-orange-500/10">
                            <Route className="h-5 w-5 text-orange-500" />
                          </div>
                          <div>
                            <p className="text-2xl font-bold">{stats.nodes.routes}</p>
                            <p className="text-sm text-muted-foreground">Routes</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-purple-500/10">
                            <BookOpen className="h-5 w-5 text-purple-500" />
                          </div>
                          <div>
                            <p className="text-2xl font-bold">{stats.nodes.manuscripts}</p>
                            <p className="text-sm text-muted-foreground">Manuscrits</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-cyan-500/10">
                            <MapPin className="h-5 w-5 text-cyan-500" />
                          </div>
                          <div>
                            <p className="text-2xl font-bold">{stats.nodes.fragments}</p>
                            <p className="text-sm text-muted-foreground">Fragments</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Statistiques des connexions */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Connexions</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="p-2 rounded-lg bg-primary/10">
                            <Link2 className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="text-2xl font-bold">{stats.edges.total}</p>
                            <p className="text-sm text-muted-foreground">Connexions totales</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Types de connexions</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {Object.entries(stats.edges.byType || {}).map(([type, count]) => (
                            <Badge key={type} variant="secondary" className="gap-1">
                              {formatEdgeType(type)}
                              <span className="text-muted-foreground">({count as number})</span>
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </>
            ) : (
              <p className="text-muted-foreground">Aucune statistique disponible</p>
            )}
          </TabsContent>

          {/* Onglet À propos */}
          <TabsContent value="about">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Qu'est-ce que le graphe de recherche ?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-muted-foreground">
                  <p>
                    Le graphe de recherche PERFUMUM est une visualisation interactive qui représente 
                    les connexions entre les différentes entités de notre base de connaissances sur 
                    l'histoire de la parfumerie.
                  </p>
                  <p>
                    Chaque nœud représente une entité (plante, molécule, route commerciale, manuscrit, 
                    civilisation ou technique), et chaque lien représente une relation documentée 
                    entre ces entités.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Types d'entités</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-green-500" />
                      <span className="font-medium">Plantes</span>
                      <span className="text-sm text-muted-foreground">— Sources botaniques des aromates</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-blue-500" />
                      <span className="font-medium">Molécules</span>
                      <span className="text-sm text-muted-foreground">— Composés odorants identifiés</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-orange-500" />
                      <span className="font-medium">Routes commerciales</span>
                      <span className="text-sm text-muted-foreground">— Voies d'échange historiques</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-purple-500" />
                      <span className="font-medium">Manuscrits</span>
                      <span className="text-sm text-muted-foreground">— Sources textuelles anciennes</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-red-500" />
                      <span className="font-medium">Civilisations</span>
                      <span className="text-sm text-muted-foreground">— Cultures historiques</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-cyan-500" />
                      <span className="font-medium">Techniques</span>
                      <span className="text-sm text-muted-foreground">— Méthodes d'extraction et de préparation</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Sources historiques intégrées</CardTitle>
                  <CardDescription>
                    Le graphe inclut des données provenant de sources historiques majeures
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-amber-500" />
                        Sources égyptiennes
                      </h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Papyrus Ebers (c. 1550 BCE)</li>
                        <li>• Papyrus Harris I (c. 1150 BCE)</li>
                        <li>• Papyrus Edwin Smith (c. 1600 BCE)</li>
                        <li>• Inscriptions du Temple d'Edfou</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-red-500" />
                        Sources chinoises
                      </h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Shennong Bencao Jing (c. 200 BCE)</li>
                        <li>• Ben Cao Gang Mu (1578)</li>
                        <li>• Xiangpu - Traité des Parfums (1073)</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        Sources arabes
                      </h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Kitāb Kīmiyāʾ al-ʿIṭr - Al-Kindi (c. 850)</li>
                        <li>• Canon de la Médecine - Avicenne (1025)</li>
                        <li>• Kitab al-Tasrif - Al-Zahrawi (c. 1000)</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// Fonction utilitaire pour formater les types de connexions
function formatEdgeType(type: string): string {
  const labels: Record<string, string> = {
    'contains': 'Contient',
    'traded_on': 'Commercé sur',
    'mentions': 'Mentionne',
    'describes': 'Décrit',
    'controlled': 'Contrôlé par',
    'derived_from': 'Dérivé de',
    'related_to': 'Lié à',
  };
  return labels[type] || type;
}
