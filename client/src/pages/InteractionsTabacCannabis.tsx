import { useState, useMemo } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  ArrowLeft, 
  Flame, 
  Leaf, 
  FlaskConical, 
  Network, 
  Sparkles,
  Filter,
  Info,
  ChevronRight,
  Zap,
  Shield,
  Shuffle,
  Eye
} from "lucide-react";

// Types pour les synergies
type SynergyType = 'entourage' | 'potentiation' | 'bridge' | 'stabilization' | 'transformation' | 'masking';
type SourceCategory = 'tabac_cannabis' | 'tabac_parfum' | 'cannabis_parfum' | 'tabac_cannabis_parfum';

const synergyTypeLabels: Record<SynergyType, { label: string; icon: React.ReactNode; color: string }> = {
  entourage: { label: "Effet Entourage", icon: <Sparkles className="h-4 w-4" />, color: "bg-purple-500/10 text-purple-600 border-purple-500/30" },
  potentiation: { label: "Potentialisation", icon: <Zap className="h-4 w-4" />, color: "bg-amber-500/10 text-amber-600 border-amber-500/30" },
  bridge: { label: "Pont Aromatique", icon: <Network className="h-4 w-4" />, color: "bg-blue-500/10 text-blue-600 border-blue-500/30" },
  stabilization: { label: "Stabilisation", icon: <Shield className="h-4 w-4" />, color: "bg-green-500/10 text-green-600 border-green-500/30" },
  transformation: { label: "Transformation", icon: <Shuffle className="h-4 w-4" />, color: "bg-orange-500/10 text-orange-600 border-orange-500/30" },
  masking: { label: "Masquage", icon: <Eye className="h-4 w-4" />, color: "bg-gray-500/10 text-gray-600 border-gray-500/30" },
};

const categoryLabels: Record<SourceCategory, { label: string; description: string }> = {
  tabac_cannabis: { label: "Tabac ↔ Cannabis", description: "Synergies entre composés du tabac et du cannabis" },
  tabac_parfum: { label: "Tabac ↔ Parfum", description: "Interactions tabac et molécules de parfumerie" },
  cannabis_parfum: { label: "Cannabis ↔ Parfum", description: "Ponts aromatiques cannabis et parfumerie" },
  tabac_cannabis_parfum: { label: "Tripartite", description: "Synergies impliquant les trois sources" },
};

export default function InteractionsTabacCannabis() {
  const [activeTab, setActiveTab] = useState<string>("interactions");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [synergyFilter, setSynergyFilter] = useState<string>("all");

  // Fetch data
  const { data: interactions, isLoading: loadingInteractions } = trpc.molecularInteractions.list.useQuery();
  const { data: accords, isLoading: loadingAccords } = trpc.aromaticAccords.list.useQuery();
  const { data: entourageRules, isLoading: loadingRules } = trpc.entourageRules?.list.useQuery();

  // Filter interactions
  const filteredInteractions = useMemo(() => {
    if (!interactions) return [];
    return interactions?.filter(int => {
      if (categoryFilter !== "all" && int.sourceCategory !== categoryFilter) return false;
      if (synergyFilter !== "all" && int.synergyType !== synergyFilter) return false;
      return true;
    });
  }, [interactions, categoryFilter, synergyFilter]);

  // Group accords by category
  const accordsByCategory = useMemo(() => {
    if (!accords) return {};
    return accords?.reduce((acc, accord) => {
      const cat = accord.category;
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(accord);
      return acc;
    }, {} as Record<string, typeof accords>);
  }, [accords]);

  const getCompatibilityColor = (score: number) => {
    if (score >= 70) return "bg-green-500";
    if (score >= 40) return "bg-amber-500";
    return "bg-red-500";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 to-stone-100 dark:from-stone-950 dark:to-stone-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-900 via-green-900 to-purple-900 text-white">
        <div className="container py-8">
          <Link href="/">
            <Button variant="ghost" size="sm" className="text-white/80 hover:text-white hover:bg-white/10 mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
          </Link>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-white/10 rounded-xl">
              <div className="flex gap-2">
                <Flame className="h-8 w-8 text-amber-400" />
                <Leaf className="h-8 w-8 text-green-400" />
                <FlaskConical className="h-8 w-8 text-purple-400" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold">Interactions Tabac-Cannabis-Parfum</h1>
              <p className="text-white/70 mt-1">
                Synergies moléculaires et accords proposés
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-white/10 rounded-lg p-4">
              <div className="text-2xl font-bold">{interactions?.length || 0}</div>
              <div className="text-sm text-white/70">Interactions</div>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="text-2xl font-bold">{accords?.length || 0}</div>
              <div className="text-sm text-white/70">Accords</div>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="text-2xl font-bold">{entourageRules?.length || 0}</div>
              <div className="text-sm text-white/70">Règles</div>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="text-2xl font-bold">4</div>
              <div className="text-sm text-white/70">Catégories</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
            <TabsTrigger value="interactions" className="gap-2">
              <Network className="h-4 w-4" />
              <span className="hidden sm:inline">Synergies</span>
            </TabsTrigger>
            <TabsTrigger value="accords" className="gap-2">
              <FlaskConical className="h-4 w-4" />
              <span className="hidden sm:inline">Accords</span>
            </TabsTrigger>
            <TabsTrigger value="rules" className="gap-2">
              <Info className="h-4 w-4" />
              <span className="hidden sm:inline">Règles</span>
            </TabsTrigger>
          </TabsList>

          {/* Interactions Tab */}
          <TabsContent value="interactions" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Filtres
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4">
                  <div className="flex-1 min-w-[200px]">
                    <label className="text-sm font-medium mb-2 block">Catégorie</label>
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Toutes les catégories" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Toutes les catégories</SelectItem>
                        {Object.entries(categoryLabels).map(([key, { label }]) => (
                          <SelectItem key={key} value={key}>{label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex-1 min-w-[200px]">
                    <label className="text-sm font-medium mb-2 block">Type de synergie</label>
                    <Select value={synergyFilter} onValueChange={setSynergyFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Tous les types" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous les types</SelectItem>
                        {Object.entries(synergyTypeLabels).map(([key, { label }]) => (
                          <SelectItem key={key} value={key}>{label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Interactions Grid */}
            {loadingInteractions ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <Card key={i}>
                    <CardHeader>
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-20 w-full" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredInteractions.length === 0 ? (
              <Card className="p-12 text-center">
                <Network className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Aucune interaction trouvée</h3>
                <p className="text-muted-foreground">
                  {interactions?.length === 0 
                    ? "Les données d'interactions seront bientôt disponibles."
                    : "Modifiez vos filtres pour voir plus de résultats."}
                </p>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredInteractions.map(interaction => {
                  const synergyInfo = synergyTypeLabels[interaction.synergyType as SynergyType];
                  const categoryInfo = categoryLabels[interaction.sourceCategory as SourceCategory];
                  
                  return (
                    <Card key={interaction.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg">{interaction.name}</CardTitle>
                            <CardDescription>{interaction.interactionId}</CardDescription>
                          </div>
                          <Badge variant="outline" className={synergyInfo?.color}>
                            {synergyInfo?.icon}
                            <span className="ml-1">{synergyInfo?.label}</span>
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">{categoryInfo?.label}</Badge>
                          <div className="flex items-center gap-1 ml-auto">
                            <div className={`w-2 h-2 rounded-full ${getCompatibilityColor(interaction.compatibilityScore)}`} />
                            <span className="text-sm font-medium">{interaction.compatibilityScore}%</span>
                          </div>
                        </div>
                        
                        {interaction.description && (
                          <p className="text-sm text-muted-foreground line-clamp-3">
                            {interaction.description}
                          </p>
                        )}
                        
                        {interaction.olfactiveResult && (
                          <div className="bg-muted/50 rounded-lg p-3">
                            <div className="text-xs font-medium text-muted-foreground mb-1">Résultat olfactif</div>
                            <p className="text-sm">{interaction.olfactiveResult}</p>
                          </div>
                        )}
                        
                        {interaction.terpeneProfile && Array.isArray(interaction.terpeneProfile) && interaction.terpeneProfile.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {(interaction.terpeneProfile as Array<{name: string; percentage: number; source: string}>).slice(0, 4).map((t, i) => (
                              <Badge key={i} variant="outline" className="text-xs">
                                {t.name} ({t.percentage}%)
                              </Badge>
                            ))}
                            {(interaction.terpeneProfile as Array<{name: string}>).length > 4 && (
                              <Badge variant="outline" className="text-xs">
                                +{(interaction.terpeneProfile as Array<{name: string}>).length - 4}
                              </Badge>
                            )}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>

          {/* Accords Tab */}
          <TabsContent value="accords" className="space-y-6">
            {loadingAccords ? (
              <div className="grid md:grid-cols-2 gap-6">
                {[1, 2, 3].map(i => (
                  <Card key={i}>
                    <CardHeader>
                      <Skeleton className="h-8 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-32 w-full" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : accords?.length === 0 ? (
              <Card className="p-12 text-center">
                <FlaskConical className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Accords à venir</h3>
                <p className="text-muted-foreground">
                  Les accords proposés (Fumoir Oriental, Hash Marocain, Cannabis Vert) seront bientôt disponibles.
                </p>
              </Card>
            ) : (
              <div className="space-y-8">
                {Object.entries(accordsByCategory).map(([category, categoryAccords]) => (
                  <div key={category}>
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                      {category === 'fumoir' && <Flame className="h-5 w-5 text-amber-500" />}
                      {category === 'hash' && <Leaf className="h-5 w-5 text-green-600" />}
                      {category === 'herbal' && <Leaf className="h-5 w-5 text-green-400" />}
                      {category === 'hybrid' && <FlaskConical className="h-5 w-5 text-purple-500" />}
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                      <Badge variant="secondary">{categoryAccords.length}</Badge>
                    </h3>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      {categoryAccords.map(accord => (
                        <Card key={accord.id} className="overflow-hidden">
                          <div className={`h-2 ${
                            accord.category === 'fumoir' ? 'bg-gradient-to-r from-amber-500 to-orange-500' :
                            accord.category === 'hash' ? 'bg-gradient-to-r from-green-600 to-emerald-500' :
                            accord.category === 'herbal' ? 'bg-gradient-to-r from-green-400 to-lime-400' :
                            'bg-gradient-to-r from-purple-500 to-pink-500'
                          }`} />
                          <CardHeader>
                            <div className="flex items-start justify-between">
                              <div>
                                <CardTitle className="text-xl">{accord.name}</CardTitle>
                                <CardDescription>{accord.accordId}</CardDescription>
                              </div>
                              <div className="flex gap-1">
                                {accord.diffusion && (
                                  <Badge variant="outline" className="text-xs">
                                    Diffusion: {accord.diffusion}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            {accord.description && (
                              <p className="text-muted-foreground">{accord.description}</p>
                            )}
                            
                            {/* Pyramide olfactive */}
                            <div className="space-y-3">
                              {accord.topNotes && Array.isArray(accord.topNotes) && accord.topNotes.length > 0 && (
                                <div>
                                  <div className="text-xs font-medium text-muted-foreground mb-1">Notes de tête</div>
                                  <div className="flex flex-wrap gap-1">
                                    {(accord.topNotes as Array<{molecule: string; percentage: number; source: string}>).map((note, i) => (
                                      <Badge key={i} variant="secondary" className="text-xs">
                                        {note.molecule} ({note.percentage}%)
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              )}
                              
                              {accord.heartNotes && Array.isArray(accord.heartNotes) && accord.heartNotes.length > 0 && (
                                <div>
                                  <div className="text-xs font-medium text-muted-foreground mb-1">Notes de cœur</div>
                                  <div className="flex flex-wrap gap-1">
                                    {(accord.heartNotes as Array<{molecule: string; percentage: number; source: string}>).map((note, i) => (
                                      <Badge key={i} variant="secondary" className="text-xs">
                                        {note.molecule} ({note.percentage}%)
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              )}
                              
                              {accord.baseNotes && Array.isArray(accord.baseNotes) && accord.baseNotes.length > 0 && (
                                <div>
                                  <div className="text-xs font-medium text-muted-foreground mb-1">Notes de fond</div>
                                  <div className="flex flex-wrap gap-1">
                                    {(accord.baseNotes as Array<{molecule: string; percentage: number; source: string}>).map((note, i) => (
                                      <Badge key={i} variant="secondary" className="text-xs">
                                        {note.molecule} ({note.percentage}%)
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                            
                            {accord.targetEffect && (
                              <div className="bg-muted/50 rounded-lg p-3">
                                <div className="text-xs font-medium text-muted-foreground mb-1">Effet recherché</div>
                                <p className="text-sm">{accord.targetEffect}</p>
                              </div>
                            )}
                            
                            <div className="flex items-center justify-between pt-2 border-t">
                              <div className="flex gap-2">
                                {accord.tenacity && <Badge variant="outline" className="text-xs">Tenue: {accord.tenacity}</Badge>}
                                {accord.sillage && <Badge variant="outline" className="text-xs">Sillage: {accord.sillage}</Badge>}
                              </div>
                              <Button variant="ghost" size="sm" className="gap-1">
                                Détails <ChevronRight className="h-4 w-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Rules Tab */}
          <TabsContent value="rules" className="space-y-6">
            {loadingRules ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <Card key={i}>
                    <CardHeader>
                      <Skeleton className="h-6 w-1/2" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-24 w-full" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : entourageRules?.length === 0 ? (
              <Card className="p-12 text-center">
                <Info className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Règles de synergie</h3>
                <p className="text-muted-foreground">
                  Les règles d'effet entourage et de compatibilités seront documentées ici.
                </p>
              </Card>
            ) : (
              <div className="space-y-4">
                {entourageRules?.map(rule => (
                  <Card key={rule.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{rule.name}</CardTitle>
                          <CardDescription>{rule.ruleId}</CardDescription>
                        </div>
                        <Badge variant="outline">
                          {rule.ruleType}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-muted-foreground">{rule.description}</p>
                      
                      {rule.mechanism && (
                        <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-4">
                          <div className="text-sm font-medium text-blue-700 dark:text-blue-300 mb-1">Mécanisme</div>
                          <p className="text-sm">{rule.mechanism}</p>
                        </div>
                      )}
                      
                      {rule.olfactiveResult && (
                        <div className="bg-purple-50 dark:bg-purple-950/30 rounded-lg p-4">
                          <div className="text-sm font-medium text-purple-700 dark:text-purple-300 mb-1">Résultat olfactif</div>
                          <p className="text-sm">{rule.olfactiveResult}</p>
                        </div>
                      )}
                      
                      <div className="grid md:grid-cols-2 gap-4">
                        {rule.primaryMolecules && Array.isArray(rule.primaryMolecules) && rule.primaryMolecules.length > 0 && (
                          <div>
                            <div className="text-sm font-medium mb-2">Molécules primaires</div>
                            <div className="flex flex-wrap gap-1">
                              {(rule.primaryMolecules as Array<{name: string; role: string}>).map((mol, i) => (
                                <Badge key={i} variant="secondary" className="text-xs">
                                  {mol.name}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {rule.secondaryMolecules && Array.isArray(rule.secondaryMolecules) && rule.secondaryMolecules.length > 0 && (
                          <div>
                            <div className="text-sm font-medium mb-2">Molécules secondaires</div>
                            <div className="flex flex-wrap gap-1">
                              {(rule.secondaryMolecules as Array<{name: string; role: string}>).map((mol, i) => (
                                <Badge key={i} variant="outline" className="text-xs">
                                  {mol.name}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {rule.applicableTo && Array.isArray(rule.applicableTo) && rule.applicableTo.length > 0 && (
                        <div className="flex items-center gap-2 pt-2 border-t">
                          <span className="text-sm text-muted-foreground">Applicable à:</span>
                          {(rule.applicableTo as string[]).map((app, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {app}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Navigation Links */}
        <div className="mt-12 grid md:grid-cols-3 gap-4">
          <Link href="/comparaison-terpenes">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Network className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Comparaison Terpénique</h3>
                  <p className="text-sm text-muted-foreground">Graphique radar des profils</p>
                </div>
                <ChevronRight className="h-5 w-5 ml-auto text-muted-foreground" />
              </CardContent>
            </Card>
          </Link>
          
          <Link href="/outil-formulation">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <FlaskConical className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Outil de Formulation</h3>
                  <p className="text-sm text-muted-foreground">Suggestions basées sur les synergies</p>
                </div>
                <ChevronRight className="h-5 w-5 ml-auto text-muted-foreground" />
              </CardContent>
            </Card>
          </Link>
          
          <Link href="/recherche-scientifique/synergies-moleculaires">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <Sparkles className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Synergies Moléculaires</h3>
                  <p className="text-sm text-muted-foreground">Base de données complète</p>
                </div>
                <ChevronRight className="h-5 w-5 ml-auto text-muted-foreground" />
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
