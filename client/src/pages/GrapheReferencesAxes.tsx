// @ts-nocheck
/**
 * Page Graphe Références-Axes Thématiques
 * Visualise les connexions entre références bibliographiques et axes de recherche
 * avec un graphe de force D3.js interactif
 */

// DashboardLayout removed — public page, no auth required
import { ForceGraphAxes } from "@/components/ForceGraphAxes";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trpc } from "@/lib/trpc";
import { Network, BookOpen, Layers, TrendingUp, Info } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function GrapheReferencesAxes() {
  const { data: graphData } = trpc.forceGraph.getReferencesAxesData.useQuery({});
  const { data: axes } = trpc.thematicAxes.list.useQuery();
  const { data: references } = trpc.v3References.list.useQuery();

  const stats = graphData?.stats;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-purple-500/20 to-cyan-500/20 rounded-lg">
              <Network className="h-6 w-6 text-purple-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-100">
                Graphe Références — Axes Thématiques
              </h1>
              <p className="text-slate-400">
                Visualisation interactive des connexions entre références bibliographiques et axes de recherche
              </p>
            </div>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-slate-900/50 border-slate-800">
              <CardContent className="pt-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-500/10 rounded-lg">
                    <Layers className="h-5 w-5 text-amber-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-100">{axes?.length || 0}</p>
                    <p className="text-xs text-slate-400">Axes thématiques</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-slate-800">
              <CardContent className="pt-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-cyan-500/10 rounded-lg">
                    <BookOpen className="h-5 w-5 text-cyan-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-100">{references?.length || 0}</p>
                    <p className="text-xs text-slate-400">Références</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-slate-800">
              <CardContent className="pt-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-500/10 rounded-lg">
                    <Network className="h-5 w-5 text-purple-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-100">{stats && 'totalLinks' in stats ? stats.totalLinks : 0}</p>
                    <p className="text-xs text-slate-400">Connexions</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-slate-800">
              <CardContent className="pt-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-500/10 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-100">
                      {stats && 'totalReferences' in stats ? Math.round((stats.totalLinks / Math.max(stats.totalReferences, 1)) * 100) : 0}%
                    </p>
                    <p className="text-xs text-slate-400">Couverture</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main content */}
        <Tabs defaultValue="graph" className="space-y-4">
          <TabsList className="bg-slate-900/50">
            <TabsTrigger value="graph">Graphe interactif</TabsTrigger>
            <TabsTrigger value="axes">Liste des axes</TabsTrigger>
            <TabsTrigger value="help">Guide d'utilisation</TabsTrigger>
          </TabsList>

          <TabsContent value="graph">
            <ForceGraphAxes className="min-h-[600px]" />
          </TabsContent>

          <TabsContent value="axes">
            <Card className="bg-slate-900/50 border-slate-800">
              <CardHeader>
                <CardTitle>Axes thématiques par méta-catégorie</CardTitle>
                <CardDescription>
                  Organisation hiérarchique des axes de recherche
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  {/* Meta-A: Heritage */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-amber-500" />
                      <h3 className="font-semibold text-amber-500">Heritage & Archives</h3>
                    </div>
                    <div className="space-y-2">
                      {axes?.filter((a: any) => a.metaAxis === 'meta_a').map((axis: any) => (
                        <div key={axis.id} className="p-3 bg-slate-800/50 rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="text-amber-500 border-amber-500/30">
                              {axis.axisCode}
                            </Badge>
                          </div>
                          <p className="text-sm text-slate-300">{axis.name}</p>
                        </div>
                      ))}
                      {axes?.filter((a: any) => a.metaAxis === 'meta_a').length === 0 && (
                        <p className="text-sm text-slate-500 italic">Aucun axe dans cette catégorie</p>
                      )}
                    </div>
                  </div>

                  {/* Meta-B: Arts */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-purple-500" />
                      <h3 className="font-semibold text-purple-500">Arts & Chimie</h3>
                    </div>
                    <div className="space-y-2">
                      {axes?.filter((a: any) => a.metaAxis === 'meta_b').map((axis: any) => (
                        <div key={axis.id} className="p-3 bg-slate-800/50 rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="text-purple-500 border-purple-500/30">
                              {axis.axisCode}
                            </Badge>
                          </div>
                          <p className="text-sm text-slate-300">{axis.name}</p>
                        </div>
                      ))}
                      {axes?.filter((a: any) => a.metaAxis === 'meta_b').length === 0 && (
                        <p className="text-sm text-slate-500 italic">Aucun axe dans cette catégorie</p>
                      )}
                    </div>
                  </div>

                  {/* Meta-C: Digital */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-cyan-500" />
                      <h3 className="font-semibold text-cyan-500">Digital & Datasets</h3>
                    </div>
                    <div className="space-y-2">
                      {axes?.filter((a: any) => a.metaAxis === 'meta_c').map((axis: any) => (
                        <div key={axis.id} className="p-3 bg-slate-800/50 rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="text-cyan-500 border-cyan-500/30">
                              {axis.axisCode}
                            </Badge>
                          </div>
                          <p className="text-sm text-slate-300">{axis.name}</p>
                        </div>
                      ))}
                      {axes?.filter((a: any) => a.metaAxis === 'meta_c').length === 0 && (
                        <p className="text-sm text-slate-500 italic">Aucun axe dans cette catégorie</p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="help">
            <Card className="bg-slate-900/50 border-slate-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5" />
                  Guide d'utilisation du graphe
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-slate-200 font-semibold mb-3">Navigation</h4>
                    <ul className="text-slate-400 space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <span className="text-purple-400">•</span>
                        <span><strong>Zoom:</strong> Utilisez la molette de souris ou les boutons +/-</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-purple-400">•</span>
                        <span><strong>Pan:</strong> Cliquez-glissez sur le fond du graphe</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-purple-400">•</span>
                        <span><strong>Déplacer un nœud:</strong> Cliquez-glissez sur le nœud</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-purple-400">•</span>
                        <span><strong>Sélectionner:</strong> Cliquez sur un nœud pour voir ses détails</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-purple-400">•</span>
                        <span><strong>Réinitialiser:</strong> Cliquez sur le bouton de reset</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-slate-200 font-semibold mb-3">Légende visuelle</h4>
                    <ul className="text-slate-400 space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <span className="text-cyan-400">•</span>
                        <span><strong>Grands cercles colorés:</strong> Axes thématiques (couleur = méta-catégorie)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-cyan-400">•</span>
                        <span><strong>Petits cercles:</strong> Références bibliographiques</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-cyan-400">•</span>
                        <span><strong>Lignes épaisses:</strong> Liens primaires (axe principal)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-cyan-400">•</span>
                        <span><strong>Lignes fines:</strong> Liens secondaires</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-cyan-400">•</span>
                        <span><strong>Taille des références:</strong> Proportionnelle au score de pertinence</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-slate-200 font-semibold mb-3">Filtres disponibles</h4>
                    <ul className="text-slate-400 space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <span className="text-amber-400">•</span>
                        <span><strong>Méta-axe:</strong> Filtrer par catégorie principale (Heritage, Arts, Digital)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-amber-400">•</span>
                        <span><strong>Références:</strong> Afficher ou masquer les nœuds de références</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-slate-200 font-semibold mb-3">Interprétation</h4>
                    <ul className="text-slate-400 space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <span className="text-green-400">•</span>
                        <span>Les nœuds proches partagent des connexions thématiques</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-400">•</span>
                        <span>Les clusters révèlent les groupes de références liées</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-400">•</span>
                        <span>Les axes centraux sont les plus connectés</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-400">•</span>
                        <span>Les références isolées peuvent nécessiter une révision</span>
                      </li>
                    </ul>
                  </div>
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
