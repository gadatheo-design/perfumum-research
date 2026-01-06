import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from 'wouter';
import { 
  ArrowLeft, 
  GitCompare, 
  Beaker, 
  Clock, 
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Minus,
  Info,
  ExternalLink,
  Dna,
  Leaf,
  History
} from 'lucide-react';

interface MolecularProfile {
  id: number;
  variety_id: number;
  profile_type: string;
  era: string;
  year_estimate?: number;
  source_type: string;
  terpene_profile?: Record<string, number>;
  major_compounds?: string[];
  minor_compounds?: string[];
  trace_compounds?: string[];
  total_terpene_content?: number;
  dominant_terpene?: string;
  olfactive_notes?: string[];
  analysis_method?: string;
  confidence_score?: number;
  source_reference?: string;
  notes?: string;
}

interface Comparison {
  id: number;
  ancient_profile_id: number;
  modern_profile_id: number;
  comparison_type: string;
  overall_similarity?: number;
  terpene_profile_similarity?: number;
  olfactive_profile_similarity?: number;
  molecular_differences?: Record<string, any>;
  lost_molecules?: string[];
  gained_molecules?: string[];
  analysis_notes?: string;
  evolution_hypothesis?: string;
  selection_pressures?: string[];
  reconstruction_relevance?: string;
  reconstruction_notes?: string;
  analyst?: string;
}

export default function MolecularComparison() {
  const [selectedComparison, setSelectedComparison] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'detail'>('list');

  // Fetch comparisons
  const { data: comparisons, isLoading: comparisonsLoading } = trpc.molecularComparisons.list.useQuery();
  
  // Fetch molecular profiles
  const { data: profiles, isLoading: profilesLoading } = trpc.molecularProfiles.list.useQuery();

  const isLoading = comparisonsLoading || profilesLoading;

  const getProfileById = (id: number) => {
    return profiles?.find((p: MolecularProfile) => p.id === id);
  };

  const getSimilarityColor = (similarity: number) => {
    if (similarity >= 80) return 'text-green-600 bg-green-100';
    if (similarity >= 60) return 'text-yellow-600 bg-yellow-100';
    if (similarity >= 40) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  const getRelevanceBadge = (relevance: string) => {
    const colors: Record<string, string> = {
      critical: 'bg-red-100 text-red-800 border-red-200',
      important: 'bg-orange-100 text-orange-800 border-orange-200',
      useful: 'bg-blue-100 text-blue-800 border-blue-200',
      marginal: 'bg-gray-100 text-gray-800 border-gray-200',
    };
    return colors[relevance] || colors.useful;
  };

  const renderTerpeneComparison = (ancient: MolecularProfile, modern: MolecularProfile) => {
    const ancientTerpenes = ancient.terpene_profile || {};
    const modernTerpenes = modern.terpene_profile || {};
    
    const allTerpenes = new Set([
      ...Object.keys(ancientTerpenes),
      ...Object.keys(modernTerpenes)
    ]);

    return (
      <div className="space-y-3">
        {Array.from(allTerpenes).map((terpene) => {
          const ancientValue = ancientTerpenes[terpene] || 0;
          const modernValue = modernTerpenes[terpene] || 0;
          const diff = modernValue - ancientValue;
          const percentChange = ancientValue > 0 ? ((diff / ancientValue) * 100).toFixed(1) : 'N/A';

          return (
            <div key={terpene} className="border rounded-lg p-3 bg-white">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-sm">{terpene}</span>
                <div className="flex items-center gap-2">
                  {diff > 0 ? (
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  ) : diff < 0 ? (
                    <TrendingDown className="h-4 w-4 text-red-600" />
                  ) : (
                    <Minus className="h-4 w-4 text-gray-400" />
                  )}
                  <span className={`text-xs font-medium ${diff > 0 ? 'text-green-600' : diff < 0 ? 'text-red-600' : 'text-gray-500'}`}>
                    {percentChange !== 'N/A' ? `${diff > 0 ? '+' : ''}${percentChange}%` : 'Nouveau'}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Ancien ({ancient.era})</div>
                  <Progress value={ancientValue} className="h-2" />
                  <div className="text-xs mt-1">{ancientValue.toFixed(1)}%</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Moderne ({modern.era})</div>
                  <Progress value={modernValue} className="h-2" />
                  <div className="text-xs mt-1">{modernValue.toFixed(1)}%</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderComparisonDetail = (comparison: Comparison) => {
    const ancientProfile = getProfileById(comparison.ancient_profile_id);
    const modernProfile = getProfileById(comparison.modern_profile_id);

    if (!ancientProfile || !modernProfile) {
      return (
        <Card>
          <CardContent className="p-6">
            <p className="text-muted-foreground">Profils non trouvés</p>
          </CardContent>
        </Card>
      );
    }

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => setViewMode('list')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          <h2 className="text-xl font-semibold">Comparaison moléculaire</h2>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <History className="h-4 w-4" />
                Profil ancien
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{ancientProfile.era}</div>
              <p className="text-sm text-muted-foreground">
                {ancientProfile.year_estimate ? `~${ancientProfile.year_estimate}` : 'Date inconnue'}
              </p>
              <Badge variant="outline" className="mt-2">{ancientProfile.source_type}</Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <GitCompare className="h-4 w-4" />
                Similarité globale
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${getSimilarityColor(comparison.overall_similarity || 0).split(' ')[0]}`}>
                {comparison.overall_similarity?.toFixed(1) || 'N/A'}%
              </div>
              <Progress value={comparison.overall_similarity || 0} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Leaf className="h-4 w-4" />
                Profil moderne
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{modernProfile.era}</div>
              <p className="text-sm text-muted-foreground">
                {modernProfile.year_estimate ? `~${modernProfile.year_estimate}` : 'Date inconnue'}
              </p>
              <Badge variant="outline" className="mt-2">{modernProfile.source_type}</Badge>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Analysis */}
        <Tabs defaultValue="terpenes" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="terpenes">Terpènes</TabsTrigger>
            <TabsTrigger value="molecules">Molécules</TabsTrigger>
            <TabsTrigger value="evolution">Évolution</TabsTrigger>
            <TabsTrigger value="reconstruction">Reconstitution</TabsTrigger>
          </TabsList>

          <TabsContent value="terpenes" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Beaker className="h-5 w-5" />
                  Comparaison des profils terpéniques
                </CardTitle>
                <CardDescription>
                  Évolution des concentrations de terpènes entre les deux époques
                </CardDescription>
              </CardHeader>
              <CardContent>
                {renderTerpeneComparison(ancientProfile, modernProfile)}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="molecules" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2 text-red-600">
                    <TrendingDown className="h-4 w-4" />
                    Molécules perdues
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {comparison.lost_molecules && comparison.lost_molecules.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {comparison.lost_molecules.map((mol, idx) => (
                        <Badge key={idx} variant="outline" className="bg-red-50 text-red-700 border-red-200">
                          {mol}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">Aucune molécule perdue identifiée</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2 text-green-600">
                    <TrendingUp className="h-4 w-4" />
                    Molécules gagnées
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {comparison.gained_molecules && comparison.gained_molecules.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {comparison.gained_molecules.map((mol, idx) => (
                        <Badge key={idx} variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          {mol}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">Aucune nouvelle molécule identifiée</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="evolution" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Dna className="h-5 w-5" />
                  Hypothèse d'évolution
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {comparison.evolution_hypothesis && (
                  <div>
                    <h4 className="font-medium mb-2">Hypothèse</h4>
                    <p className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">
                      {comparison.evolution_hypothesis}
                    </p>
                  </div>
                )}

                {comparison.selection_pressures && comparison.selection_pressures.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Pressions de sélection identifiées</h4>
                    <div className="flex flex-wrap gap-2">
                      {comparison.selection_pressures.map((pressure, idx) => (
                        <Badge key={idx} variant="secondary">
                          {pressure}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {comparison.analysis_notes && (
                  <div>
                    <h4 className="font-medium mb-2">Notes d'analyse</h4>
                    <p className="text-sm text-muted-foreground">{comparison.analysis_notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reconstruction" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Pertinence pour la reconstitution
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium">Niveau de pertinence :</span>
                  <Badge className={getRelevanceBadge(comparison.reconstruction_relevance || 'useful')}>
                    {comparison.reconstruction_relevance || 'Non évalué'}
                  </Badge>
                </div>

                {comparison.reconstruction_notes && (
                  <div>
                    <h4 className="font-medium mb-2">Notes de reconstitution</h4>
                    <p className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">
                      {comparison.reconstruction_notes}
                    </p>
                  </div>
                )}

                {comparison.analyst && (
                  <div className="text-xs text-muted-foreground">
                    Analysé par : {comparison.analyst}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="space-y-6">
          <Skeleton className="h-10 w-64" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-48" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Link href="/genealogie-avancee">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Généalogie
            </Button>
          </Link>
        </div>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <GitCompare className="h-8 w-8 text-primary" />
          Comparaison moléculaire ancien/moderne
        </h1>
        <p className="text-muted-foreground mt-2">
          Analyse comparative des profils moléculaires entre variétés historiques et contemporaines
        </p>
      </div>

      {viewMode === 'list' ? (
        <>
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold">{comparisons?.length || 0}</div>
                <div className="text-sm text-muted-foreground">Comparaisons</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold">{profiles?.length || 0}</div>
                <div className="text-sm text-muted-foreground">Profils moléculaires</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold">
                  {comparisons?.filter((c: Comparison) => c.reconstruction_relevance === 'critical').length || 0}
                </div>
                <div className="text-sm text-muted-foreground">Critiques</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold">
                  {comparisons?.length ? 
                    (comparisons.reduce((acc: number, c: Comparison) => acc + (c.overall_similarity || 0), 0) / comparisons.length).toFixed(1) 
                    : 0}%
                </div>
                <div className="text-sm text-muted-foreground">Similarité moyenne</div>
              </CardContent>
            </Card>
          </div>

          {/* Comparisons List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {comparisons && comparisons.length > 0 ? (
              comparisons.map((comparison: Comparison) => {
                const ancientProfile = getProfileById(comparison.ancient_profile_id);
                const modernProfile = getProfileById(comparison.modern_profile_id);

                return (
                  <Card 
                    key={comparison.id} 
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => {
                      setSelectedComparison(comparison.id);
                      setViewMode('detail');
                    }}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <Badge className={getRelevanceBadge(comparison.reconstruction_relevance || 'useful')}>
                          {comparison.reconstruction_relevance || 'Non évalué'}
                        </Badge>
                        <Badge variant="outline">{comparison.comparison_type}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between mb-4">
                        <div className="text-center">
                          <Clock className="h-5 w-5 mx-auto text-amber-600 mb-1" />
                          <div className="text-sm font-medium">{ancientProfile?.era || 'Ancien'}</div>
                          <div className="text-xs text-muted-foreground">
                            {ancientProfile?.year_estimate ? `~${ancientProfile.year_estimate}` : ''}
                          </div>
                        </div>
                        <div className="flex-1 mx-4">
                          <div className="h-0.5 bg-gradient-to-r from-amber-400 to-green-400 relative">
                            <div 
                              className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-white px-2 text-xs font-medium"
                              style={{ color: comparison.overall_similarity && comparison.overall_similarity >= 60 ? '#16a34a' : '#dc2626' }}
                            >
                              {comparison.overall_similarity?.toFixed(0) || '?'}%
                            </div>
                          </div>
                        </div>
                        <div className="text-center">
                          <Leaf className="h-5 w-5 mx-auto text-green-600 mb-1" />
                          <div className="text-sm font-medium">{modernProfile?.era || 'Moderne'}</div>
                          <div className="text-xs text-muted-foreground">
                            {modernProfile?.year_estimate ? `~${modernProfile.year_estimate}` : ''}
                          </div>
                        </div>
                      </div>

                      {comparison.lost_molecules && comparison.lost_molecules.length > 0 && (
                        <div className="text-xs text-red-600 mb-1">
                          {comparison.lost_molecules.length} molécule(s) perdue(s)
                        </div>
                      )}
                      {comparison.gained_molecules && comparison.gained_molecules.length > 0 && (
                        <div className="text-xs text-green-600">
                          {comparison.gained_molecules.length} molécule(s) gagnée(s)
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })
            ) : (
              <Card className="col-span-full">
                <CardContent className="p-8 text-center">
                  <Info className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Aucune comparaison disponible</h3>
                  <p className="text-muted-foreground">
                    Les comparaisons moléculaires seront ajoutées au fur et à mesure de la recherche.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </>
      ) : (
        selectedComparison && comparisons && (
          renderComparisonDetail(comparisons.find((c: Comparison) => c.id === selectedComparison)!)
        )
      )}
    </div>
  );
}
