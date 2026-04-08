// @ts-nocheck
import { useState, useMemo } from 'react';
import { trpc } from '@/lib/trpc';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Link } from 'wouter';
import { 
  Search, Beaker, Leaf, ChevronRight, Filter, X, 
  FlaskConical, Activity, ArrowUpDown, Info
} from 'lucide-react';

interface CompoundResult {
  compound_name: string;
  cas_number: string;
  landrace_name: string;
  concentration_ppm: number;
  retention_time: number;
  match_quality: number;
}

// Composés populaires pour la recherche rapide
const popularCompounds = [
  { name: 'β-Caryophyllène', cas: '87-44-5' },
  { name: 'Limonène', cas: '138-86-3' },
  { name: 'Myrcène', cas: '123-35-3' },
  { name: 'α-Pinène', cas: '80-56-8' },
  { name: 'Linalol', cas: '78-70-6' },
  { name: 'Géraniol', cas: '106-24-1' },
  { name: 'Eucalyptol', cas: '470-82-6' },
  { name: 'Terpinéol', cas: '98-55-5' },
];

export default function CompoundSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCompound, setSelectedCompound] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'concentration' | 'match' | 'landrace'>('concentration');
  
  // Récupérer tous les pics GC-MS
  const { data: allPeaks, isLoading } = trpc.tobacco.getAllChromatogramPeaks.useQuery();
  
  // Filtrer et grouper les résultats
  const searchResults = useMemo(() => {
    if (!allPeaks) return [];
    
    let filtered = allPeaks;
    
    // Filtrer par recherche
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = allPeaks.filter((peak: any) => 
        peak.compound_name.toLowerCase().includes(query) ||
        peak.cas_number?.toLowerCase().includes(query)
      );
    }
    
    // Filtrer par composé sélectionné
    if (selectedCompound) {
      filtered = filtered.filter((peak: any) => 
        peak.compound_name === selectedCompound || peak.cas_number === selectedCompound
      );
    }
    
    // Trier
    return filtered.sort((a: any, b: any) => {
      if (sortBy === 'concentration') return b.concentration_ppm - a.concentration_ppm;
      if (sortBy === 'match') return b.match_quality - a.match_quality;
      return a.landrace_name.localeCompare(b.landrace_name);
    });
  }, [allPeaks, searchQuery, selectedCompound, sortBy]);
  
  // Grouper par composé pour les statistiques
  const compoundStats = useMemo(() => {
    if (!allPeaks) return [];
    
    const grouped = allPeaks.reduce((acc: any, peak: any) => {
      const key = peak.compound_name;
      if (!acc[key]) {
        acc[key] = {
          name: peak.compound_name,
          cas: peak.cas_number,
          count: 0,
          totalConcentration: 0,
          maxConcentration: 0,
          landraces: new Set(),
        };
      }
      acc[key].count++;
      acc[key].totalConcentration += peak.concentration_ppm;
      acc[key].maxConcentration = Math.max(acc[key].maxConcentration, peak.concentration_ppm);
      acc[key].landraces.add(peak.landrace_name);
      return acc;
    }, {});
    
    return Object.values(grouped)
      .map((c: any) => ({
        ...c,
        avgConcentration: c.totalConcentration / c.count,
        landraceCount: c.landraces.size,
        landraces: Array.from(c.landraces),
      }))
      .sort((a: any, b: any) => b.landraceCount - a.landraceCount);
  }, [allPeaks]);
  
  // Grouper les résultats par landrace pour l'affichage
  const resultsByLandrace = useMemo(() => {
    const grouped = searchResults.reduce((acc: any, peak: any) => {
      if (!acc[peak.landrace_name]) {
        acc[peak.landrace_name] = [];
      }
      acc[peak.landrace_name].push(peak);
      return acc;
    }, {});
    
    return Object.entries(grouped).map(([name, peaks]) => ({
      name,
      peaks: peaks as CompoundResult[],
      totalConcentration: (peaks as CompoundResult[]).reduce((sum, p) => sum + p.concentration_ppm, 0),
    })).sort((a, b) => b.totalConcentration - a.totalConcentration);
  }, [searchResults]);
  
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-900/20 via-blue-900/20 to-purple-900/20 border-b">
        <div className="container py-8">
          <div className="flex items-start gap-4">
            <div className="p-4 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20">
              <Search className="h-10 w-10 text-cyan-400" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">Recherche par Composé</h1>
              <p className="text-muted-foreground">
                Trouvez toutes les landraces contenant un composé chimique spécifique et comparez leurs concentrations.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Filtres et composés populaires */}
          <div className="lg:col-span-1 space-y-6">
            {/* Barre de recherche */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Recherche
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Nom ou CAS..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                {selectedCompound && (
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="flex items-center gap-1">
                      {selectedCompound}
                      <X 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => setSelectedCompound(null)}
                      />
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Composés populaires */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Beaker className="h-5 w-5 text-purple-500" />
                  Composés populaires
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {popularCompounds.map((compound) => (
                    <Button
                      key={compound.cas}
                      variant={selectedCompound === compound.name ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedCompound(
                        selectedCompound === compound.name ? null : compound.name
                      )}
                    >
                      {compound.name}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Statistiques */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Activity className="h-5 w-5 text-green-500" />
                  Statistiques
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Composés uniques</span>
                  <span className="font-semibold">{compoundStats.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Pics analysés</span>
                  <span className="font-semibold">{allPeaks?.length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Résultats filtrés</span>
                  <span className="font-semibold">{searchResults.length}</span>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Contenu principal */}
          <div className="lg:col-span-3 space-y-6">
            <Tabs defaultValue="by-landrace" className="space-y-6">
              <div className="flex items-center justify-between">
                <TabsList>
                  <TabsTrigger value="by-landrace">Par Landrace</TabsTrigger>
                  <TabsTrigger value="by-compound">Par Composé</TabsTrigger>
                  <TabsTrigger value="all-results">Tous les résultats</TabsTrigger>
                </TabsList>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSortBy(sortBy === 'concentration' ? 'match' : 
                      sortBy === 'match' ? 'landrace' : 'concentration')}
                  >
                    <ArrowUpDown className="h-4 w-4 mr-1" />
                    {sortBy === 'concentration' ? 'Concentration' : 
                      sortBy === 'match' ? 'Match' : 'Landrace'}
                  </Button>
                </div>
              </div>
              
              {/* Par Landrace */}
              <TabsContent value="by-landrace" className="space-y-4">
                {isLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="h-48 bg-muted rounded animate-pulse" />
                    ))}
                  </div>
                ) : resultsByLandrace.length === 0 ? (
                  <Card className="bg-muted/50">
                    <CardContent className="py-12 text-center">
                      <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                      <h3 className="text-lg font-semibold mb-2">Aucun résultat</h3>
                      <p className="text-muted-foreground">
                        Essayez une autre recherche ou sélectionnez un composé populaire.
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {resultsByLandrace.map((landrace) => (
                      <Card key={landrace.name} className="hover:shadow-lg transition-shadow">
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <CardTitle className="text-lg flex items-center gap-2">
                                <Leaf className="h-5 w-5 text-green-500" />
                                {landrace.name}
                              </CardTitle>
                              <CardDescription>
                                {landrace.peaks.length} composé(s) trouvé(s)
                              </CardDescription>
                            </div>
                            <Link href={`/tobacco-landrace/${encodeURIComponent(landrace.name)}`}>
                              <Button variant="ghost" size="sm">
                                <ChevronRight className="h-4 w-4" />
                              </Button>
                            </Link>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            {landrace.peaks.slice(0, 5).map((peak, idx) => (
                              <div key={idx} className="flex items-center justify-between text-sm">
                                <span className="font-medium truncate flex-1">{peak.compound_name}</span>
                                <Badge variant="outline" className="ml-2">
                                  {peak.concentration_ppm} ppm
                                </Badge>
                              </div>
                            ))}
                            {landrace.peaks.length > 5 && (
                              <p className="text-xs text-muted-foreground">
                                + {landrace.peaks.length - 5} autres composés
                              </p>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
              
              {/* Par Composé */}
              <TabsContent value="by-compound" className="space-y-4">
                {isLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="h-24 bg-muted rounded animate-pulse" />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {compoundStats.slice(0, 20).map((compound: any) => (
                      <Card key={compound.name} className="hover:shadow-lg transition-shadow">
                        <CardContent className="py-4">
                          <div className="flex items-center gap-4">
                            <div className="p-3 rounded-lg bg-purple-500/10">
                              <FlaskConical className="h-6 w-6 text-purple-500" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold">{compound.name}</h3>
                                {compound.cas && (
                                  <Badge variant="outline" className="font-mono text-xs">
                                    {compound.cas}
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <span>Présent dans {compound.landraceCount} landrace(s)</span>
                                <span>•</span>
                                <span>Max: {(compound).toFixed(1)} ppm</span>
                                <span>•</span>
                                <span>Moy: {(compound).toFixed(1)} ppm</span>
                              </div>
                              <div className="flex flex-wrap gap-1 mt-2">
                                {compound.landraces.slice(0, 5).map((l: string) => (
                                  <Link key={l} href={`/tobacco-landrace/${encodeURIComponent(l)}`}>
                                    <Badge variant="secondary" className="text-xs cursor-pointer hover:bg-secondary/80">
                                      {l}
                                    </Badge>
                                  </Link>
                                ))}
                                {compound.landraces.length > 5 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{compound.landraces.length - 5}
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedCompound(compound.name)}
                            >
                              Filtrer
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
              
              {/* Tous les résultats */}
              <TabsContent value="all-results" className="space-y-4">
                <Card>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b bg-muted/50">
                            <th className="text-left py-3 px-4 font-semibold">Composé</th>
                            <th className="text-left py-3 px-4 font-semibold">CAS</th>
                            <th className="text-left py-3 px-4 font-semibold">Landrace</th>
                            <th className="text-right py-3 px-4 font-semibold">Concentration</th>
                            <th className="text-right py-3 px-4 font-semibold">RT</th>
                            <th className="text-right py-3 px-4 font-semibold">Match</th>
                          </tr>
                        </thead>
                        <tbody>
                          {searchResults.slice(0, 50).map((peak: any, idx: number) => (
                            <tr key={idx} className="border-b border-border/50 hover:bg-muted/50">
                              <td className="py-3 px-4 font-medium">{peak.compound_name}</td>
                              <td className="py-3 px-4 text-muted-foreground font-mono text-sm">
                                {peak.cas_number}
                              </td>
                              <td className="py-3 px-4">
                                <Link href={`/tobacco-landrace/${encodeURIComponent(peak.landrace_name)}`}>
                                  <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80">
                                    {peak.landrace_name}
                                  </Badge>
                                </Link>
                              </td>
                              <td className="py-3 px-4 text-right">
                                <Badge variant="outline">{peak.concentration_ppm} ppm</Badge>
                              </td>
                              <td className="py-3 px-4 text-right text-muted-foreground">
                                {peak.retention_time} min
                              </td>
                              <td className="py-3 px-4 text-right">
                                <Badge 
                                  variant={peak.match_quality >= 90 ? 'default' : 'secondary'}
                                  className={peak.match_quality >= 90 ? 'bg-green-500/20 text-green-400' : ''}
                                >
                                  {peak.match_quality}%
                                </Badge>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {searchResults.length > 50 && (
                      <div className="p-4 text-center text-sm text-muted-foreground border-t">
                        Affichage des 50 premiers résultats sur {searchResults.length}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
