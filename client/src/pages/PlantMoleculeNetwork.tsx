import { motion } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trpc } from "@/lib/trpc";
import { PlantMoleculeGraph } from "@/components/PlantMoleculeGraph";
import { 
  Network, 
  Leaf, 
  FlaskConical, 
  BarChart3, 
  Info,
  Download,
  Share2
} from "lucide-react";

export default function PlantMoleculeNetwork() {
  const { data: links, isLoading } = trpc.plantMoleculeLinks.getAll.useQuery();
  
  // Statistiques
  const stats = {
    totalLinks: links?.length || 0,
    uniquePlants: new Set(links?.map(l => l.plantId)).size,
    uniqueMolecules: new Set(links?.map(l => l.moleculeId)).size,
    signatureLinks: links?.filter(l => l.isSignature === 1).length || 0,
    majorLinks: links?.filter(l => l.role === "majeur").length || 0,
  };
  
  // Top plantes par nombre de molécules
  const plantStats = links?.reduce((acc, link) => {
    const key = link.plantName;
    if (!acc[key]) {
      acc[key] = { name: key, count: 0, signatures: 0 };
    }
    acc[key].count++;
    if (link.isSignature === 1) acc[key].signatures++;
    return acc;
  }, {} as Record<string, { name: string; count: number; signatures: number }>);
  
  const topPlants = Object.values(plantStats || {})
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
  
  // Top molécules par nombre de plantes
  const moleculeStats = links?.reduce((acc, link) => {
    const key = link.moleculeName;
    if (!acc[key]) {
      acc[key] = { name: key, family: link.moleculeFamily, count: 0 };
    }
    acc[key].count++;
    return acc;
  }, {} as Record<string, { name: string; family: string | null; count: number }>);
  
  const topMolecules = Object.values(moleculeStats || {})
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-16 bg-gradient-to-br from-green-950 via-emerald-900 to-teal-900 overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://d2xsxph8kpxj0f.cloudfront.net/310519663081881090/H2pjHHJbH276XmnbNcJhCp/grid_02c43ba1.svg')] opacity-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
          
          <div className="container relative z-10">
            <Breadcrumbs
              currentLabel="Réseau Plantes-Molécules"
            />
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-xl bg-green-500/20 backdrop-blur-sm">
                  <Network className="h-8 w-8 text-green-400" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-white">
                  Réseau Plantes-Molécules
                </h1>
              </div>
              
              <p className="text-lg text-white/80 mb-8">
                Visualisation interactive des relations entre les plantes aromatiques et leurs 
                composés moléculaires. Explorez les signatures olfactives et les compositions 
                chimiques de chaque espèce.
              </p>
              
              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-white">{stats.totalLinks}</div>
                  <div className="text-xs text-white/70">Connexions</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-green-400">{stats.uniquePlants}</div>
                  <div className="text-xs text-white/70">Plantes</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-blue-400">{stats.uniqueMolecules}</div>
                  <div className="text-xs text-white/70">Molécules</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-purple-400">{stats.signatureLinks}</div>
                  <div className="text-xs text-white/70">Signatures</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-amber-400">{stats.majorLinks}</div>
                  <div className="text-xs text-white/70">Majeurs</div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
        
        {/* Main Content */}
        <section className="py-12">
          <div className="container">
            <Tabs defaultValue="graph" className="space-y-6">
              <TabsList className="grid w-full max-w-md grid-cols-3">
                <TabsTrigger value="graph" className="flex items-center gap-2">
                  <Network className="h-4 w-4" />
                  Graphe
                </TabsTrigger>
                <TabsTrigger value="plants" className="flex items-center gap-2">
                  <Leaf className="h-4 w-4" />
                  Plantes
                </TabsTrigger>
                <TabsTrigger value="molecules" className="flex items-center gap-2">
                  <FlaskConical className="h-4 w-4" />
                  Molécules
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="graph">
                <PlantMoleculeGraph 
                  links={(links || []).map(l => ({ ...l, percentageMin: l.percentageMin != null ? String(l.percentageMin) : null, percentageMax: l.percentageMax != null ? String(l.percentageMax) : null, percentageTypical: l.percentageTypical != null ? String(l.percentageTypical) : null }))} 
                  isLoading={isLoading}
                  height={700}
                />
                
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Info className="h-5 w-5" />
                      Guide d'utilisation
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="prose prose-sm dark:prose-invert max-w-none">
                    <ul>
                      <li><strong>Zoom</strong> : Utilisez la molette de la souris ou le pincement sur mobile</li>
                      <li><strong>Déplacement</strong> : Cliquez et faites glisser sur le fond pour naviguer</li>
                      <li><strong>Sélection</strong> : Cliquez sur un nœud pour le sélectionner et voir ses détails</li>
                      <li><strong>Survol</strong> : Survolez un nœud pour mettre en évidence ses connexions</li>
                      <li><strong>Réorganisation</strong> : Faites glisser les nœuds pour les repositionner</li>
                    </ul>
                    <p className="text-muted-foreground">
                      Les lignes violettes indiquent des molécules signatures (caractéristiques de la plante).
                      L'épaisseur des liens représente le pourcentage de la molécule dans la plante.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="plants">
                <div className="grid gap-6 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5 text-green-600" />
                        Top 10 Plantes
                      </CardTitle>
                      <CardDescription>
                        Plantes avec le plus de molécules documentées
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {topPlants.map((plant, index) => (
                          <div key={plant.name} className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center text-xs font-medium text-green-700 dark:text-green-300">
                              {index + 1}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <span className="font-medium">{plant.name}</span>
                                <div className="flex items-center gap-2">
                                  {plant.signatures > 0 && (
                                    <Badge variant="secondary" className="text-xs">
                                      {plant.signatures} sig.
                                    </Badge>
                                  )}
                                  <Badge>{plant.count} mol.</Badge>
                                </div>
                              </div>
                              <div className="w-full bg-muted rounded-full h-1.5 mt-1">
                                <div 
                                  className="bg-green-500 h-1.5 rounded-full transition-all"
                                  style={{ width: `${(plant.count / topPlants[0].count) * 100}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Leaf className="h-5 w-5 text-green-600" />
                        Plantes par Famille
                      </CardTitle>
                      <CardDescription>
                        Distribution des plantes par famille botanique
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {(() => {
                        const familyStats = links?.reduce((acc, link) => {
                          const family = link.plantFamily || "Non classée";
                          if (!acc[family]) acc[family] = new Set();
                          acc[family].add(link.plantId);
                          return acc;
                        }, {} as Record<string, Set<number>>);
                        
                        const familyData = Object.entries(familyStats || {})
                          .map(([family, plants]) => ({ family, count: plants.size }))
                          .sort((a, b) => b.count - a.count)
                          .slice(0, 8);
                        
                        return (
                          <div className="space-y-3">
                            {familyData.map((item) => (
                              <div key={item.family} className="flex items-center justify-between">
                                <span className="text-sm">{item.family}</span>
                                <Badge variant="outline">{item.count}</Badge>
                              </div>
                            ))}
                          </div>
                        );
                      })()}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="molecules">
                <div className="grid gap-6 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5 text-blue-600" />
                        Top 10 Molécules
                      </CardTitle>
                      <CardDescription>
                        Molécules présentes dans le plus de plantes
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {topMolecules.map((mol, index) => (
                          <div key={mol.name} className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-xs font-medium text-blue-700 dark:text-blue-300">
                              {index + 1}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <span className="font-medium">{mol.name}</span>
                                <div className="flex items-center gap-2">
                                  {mol.family && (
                                    <Badge variant="secondary" className="text-xs">
                                      {mol.family}
                                    </Badge>
                                  )}
                                  <Badge>{mol.count} pl.</Badge>
                                </div>
                              </div>
                              <div className="w-full bg-muted rounded-full h-1.5 mt-1">
                                <div 
                                  className="bg-blue-500 h-1.5 rounded-full transition-all"
                                  style={{ width: `${(mol.count / topMolecules[0].count) * 100}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FlaskConical className="h-5 w-5 text-blue-600" />
                        Molécules par Famille
                      </CardTitle>
                      <CardDescription>
                        Distribution des molécules par famille chimique
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {(() => {
                        const familyStats = links?.reduce((acc, link) => {
                          const family = link.moleculeFamily || "Non classée";
                          if (!acc[family]) acc[family] = new Set();
                          acc[family].add(link.moleculeId);
                          return acc;
                        }, {} as Record<string, Set<number>>);
                        
                        const familyData = Object.entries(familyStats || {})
                          .map(([family, mols]) => ({ family, count: mols.size }))
                          .sort((a, b) => b.count - a.count)
                          .slice(0, 8);
                        
                        return (
                          <div className="space-y-3">
                            {familyData.map((item) => (
                              <div key={item.family} className="flex items-center justify-between">
                                <span className="text-sm">{item.family}</span>
                                <Badge variant="outline">{item.count}</Badge>
                              </div>
                            ))}
                          </div>
                        );
                      })()}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
