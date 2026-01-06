/**
 * RoutesCommerciales - Page dédiée aux routes commerciales historiques des aromates
 */

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { TradeRoutesMap } from "@/components/TradeRoutesMap";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trpc } from "@/lib/trpc";
import { Route, Map, History, Package, BookOpen, Globe } from "lucide-react";

export default function RoutesCommerciales() {
  const { data: stats } = trpc.tradeRoutes.getStats.useQuery();
  const { data: routes } = trpc.tradeRoutes.list.useQuery();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="section-spacing bg-gradient-to-b from-amber-50/50 to-background dark:from-amber-950/20">
          <div className="container">
            <div className="max-w-4xl mx-auto text-center space-y-6">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Route className="h-10 w-10 text-amber-600" />
                <h1 className="text-4xl md:text-5xl font-bold">Routes Commerciales</h1>
              </div>
              <p className="text-xl text-muted-foreground">
                Explorez les routes historiques du commerce des aromates, parfums et résines 
                à travers les civilisations et les époques.
              </p>
              
              {/* Statistiques rapides */}
              <div className="flex flex-wrap justify-center gap-4 pt-4">
                <Badge variant="secondary" className="text-sm py-1 px-3">
                  <Route className="h-4 w-4 mr-1" />
                  {stats?.total || 0} routes documentées
                </Badge>
                <Badge variant="secondary" className="text-sm py-1 px-3">
                  <Globe className="h-4 w-4 mr-1" />
                  {stats?.regions?.length || 0} régions
                </Badge>
                <Badge variant="secondary" className="text-sm py-1 px-3">
                  <Package className="h-4 w-4 mr-1" />
                  {stats?.materials?.length || 0} marchandises
                </Badge>
              </div>
            </div>
          </div>
        </section>
        
        {/* Carte interactive */}
        <section className="section-spacing">
          <div className="container">
            <Tabs defaultValue="map" className="space-y-6">
              <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
                <TabsTrigger value="map" className="gap-2">
                  <Map className="h-4 w-4" /> Carte interactive
                </TabsTrigger>
                <TabsTrigger value="list" className="gap-2">
                  <BookOpen className="h-4 w-4" /> Vue détaillée
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="map">
                <TradeRoutesMap showFilters={true} />
              </TabsContent>
              
              <TabsContent value="list" className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {routes?.map((route: any) => (
                    <Card key={route.route_id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg">{route.name}</CardTitle>
                            <CardDescription className="flex items-center gap-2 mt-1">
                              <History className="h-4 w-4" />
                              {route.time_start && route.time_start < 0 
                                ? `${Math.abs(route.time_start)} av. J.-C.` 
                                : route.time_start || '?'} 
                              {' — '}
                              {route.time_end && route.time_end < 0 
                                ? `${Math.abs(route.time_end)} av. J.-C.` 
                                : route.time_end || '?'}
                            </CardDescription>
                          </div>
                          <Badge variant="outline">{route.route_id}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* Points de passage */}
                        <div>
                          <h4 className="text-sm font-medium mb-2">Points de passage</h4>
                          <div className="flex flex-wrap gap-1">
                            {route.nodes?.map((node: any, i: number) => (
                              <Badge 
                                key={i} 
                                variant={
                                  node.role === 'source' ? 'default' :
                                  node.role === 'destination' ? 'destructive' :
                                  'secondary'
                                }
                                className="text-xs"
                              >
                                {node.place}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        {/* Marchandises */}
                        {route.materials?.length > 0 && (
                          <div>
                            <h4 className="text-sm font-medium mb-2">Marchandises</h4>
                            <div className="flex flex-wrap gap-1">
                              {route.materials.map((mat: string, i: number) => (
                                <Badge key={i} variant="outline" className="text-xs">
                                  {mat.replace(/_/g, ' ')}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {/* Notes */}
                        {route.notes && (
                          <p className="text-sm text-muted-foreground">{route.notes}</p>
                        )}
                        
                        {/* Sources */}
                        {route.sources?.length > 0 && (
                          <div className="pt-2 border-t">
                            <p className="text-xs text-muted-foreground">
                              <span className="font-medium">Sources:</span> {route.sources.join(', ')}
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>
        
        {/* Section contextuelle */}
        <section className="section-spacing bg-muted/30">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold mb-6 text-center">Le commerce des aromates dans l'histoire</h2>
              
              <div className="prose prose-neutral dark:prose-invert max-w-none">
                <p>
                  Le commerce des aromates, parfums et résines constitue l'un des plus anciens réseaux 
                  d'échanges internationaux de l'histoire humaine. Dès l'Antiquité, des routes terrestres 
                  et maritimes reliaient les régions productrices aux grands centres de consommation.
                </p>
                
                <h3>Les grandes routes historiques</h3>
                <p>
                  <strong>La Route de l'Encens</strong> (c. 1500 av. J.-C. - 400 ap. J.-C.) reliait le Dhofar 
                  (actuel Oman) à la Méditerranée via Pétra et Gaza. Elle transportait principalement 
                  l'oliban (frankincense) et la myrrhe, essentiels aux rituels religieux antiques.
                </p>
                <p>
                  <strong>La Route de la Soie</strong> servait également au transport des aromates précieux 
                  comme le musc, le bois de santal et le camphre entre l'Asie et l'Europe.
                </p>
                <p>
                  <strong>Les Routes Maritimes des Épices</strong> développées à partir du XIIe siècle 
                  connectaient les îles aux épices (Moluques) aux ports méditerranéens via l'océan Indien.
                </p>
                
                <h3>Impact sur la parfumerie moderne</h3>
                <p>
                  Ces routes commerciales ont façonné la palette olfactive mondiale. Les ingrédients 
                  transportés — encens, myrrhe, benjoin, bois de oud, musc — restent aujourd'hui 
                  des piliers de la parfumerie de luxe, témoignant de cette longue histoire d'échanges.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
