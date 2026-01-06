/**
 * CorpusAdvancedFilters - Filtres avancés pour croiser les données du corpus
 * Permet de filtrer par axe de recherche, période historique et région géographique
 */

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { trpc } from "@/lib/trpc";
import { 
  Filter, X, Leaf, FlaskConical, ScrollText, Route, BookOpen,
  Calendar, Globe, Dna, Search, RotateCcw, ChevronDown, ChevronUp
} from "lucide-react";

// Définition des axes de recherche
const RESEARCH_AXES = [
  { id: 'AX1_GENOMIC_CONSERVATION', label: 'AX1 - Conservation Génomique', color: 'emerald' },
  { id: 'AX2_ETHNOBOTANY_COMP', label: 'AX2 - Ethnobotanique Comparée', color: 'amber' },
  { id: 'AX3_ANALYTICAL_TRANS_EPOCH', label: 'AX3 - Analyse Trans-Époque', color: 'blue' },
  { id: 'AX4_CONSERVATION_BIOTECH', label: 'AX4 - Conservation Biotechnologique', color: 'purple' },
  { id: 'AX5_IMMERSIVE_DEMOCRAT', label: 'AX5 - Immersion Démocratique', color: 'pink' },
  { id: 'AX6_OLFACTIVE_DIPLOMACY', label: 'AX6 - Diplomatie Olfactive', color: 'cyan' },
];

// Régions géographiques principales
const REGIONS = [
  'Arabia', 'Mediterranean', 'India', 'China', 'Southeast Asia', 'Africa',
  'Europe', 'Americas', 'Middle East', 'Central Asia', 'Japan', 'Indonesia'
];

interface CorpusAdvancedFiltersProps {
  onFiltersChange?: (filters: FilterState) => void;
  showResults?: boolean;
}

interface FilterState {
  axisId: string;
  period: { start: number; end: number };
  region: string;
  searchQuery: string;
}

export function CorpusAdvancedFilters({ 
  onFiltersChange,
  showResults = true 
}: CorpusAdvancedFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    axisId: '',
    period: { start: -2000, end: 2000 },
    region: '',
    searchQuery: '',
  });
  
  const [isExpanded, setIsExpanded] = useState(true);
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);
  
  // Requête avec filtres avancés
  const { data: results, isLoading, refetch } = trpc.corpusAdvanced.filter.useQuery(
    {
      axisId: filters.axisId || undefined,
      period: {
        start: filters.period.start,
        end: filters.period.end,
      },
      region: filters.region || undefined,
    },
    { enabled: showResults }
  );
  
  // Compter les filtres actifs
  useEffect(() => {
    let count = 0;
    if (filters.axisId) count++;
    if (filters.region) count++;
    if (filters.period.start !== -2000 || filters.period.end !== 2000) count++;
    if (filters.searchQuery) count++;
    setActiveFiltersCount(count);
    
    if (onFiltersChange) {
      onFiltersChange(filters);
    }
  }, [filters, onFiltersChange]);
  
  // Réinitialiser les filtres
  const resetFilters = () => {
    setFilters({
      axisId: '',
      period: { start: -2000, end: 2000 },
      region: '',
      searchQuery: '',
    });
  };
  
  // Formater l'année
  const formatYear = (year: number) => {
    if (year < 0) return `${Math.abs(year)} av. J.-C.`;
    return `${year} ap. J.-C.`;
  };
  
  // Filtrer les résultats par recherche textuelle
  const filterBySearch = (items: any[], query: string) => {
    if (!query) return items;
    const lowerQuery = query.toLowerCase();
    return items.filter(item => {
      const searchableFields = [
        item.name, item.latin_name, item.molecule_name, item.original_text,
        item.translation_fr, item.title, item.notes
      ].filter(Boolean);
      return searchableFields.some(field => 
        field.toLowerCase().includes(lowerQuery)
      );
    });
  };
  
  // Résultats filtrés
  const filteredResults = results ? {
    plants: filterBySearch(results.plants || [], filters.searchQuery),
    molecules: filterBySearch(results.molecules || [], filters.searchQuery),
    fragments: filterBySearch(results.fragments || [], filters.searchQuery),
    routes: filterBySearch(results.routes || [], filters.searchQuery),
    manuscripts: filterBySearch(results.manuscripts || [], filters.searchQuery),
  } : null;
  
  const totalResults = filteredResults 
    ? (filteredResults.plants?.length || 0) + 
      (filteredResults.molecules?.length || 0) + 
      (filteredResults.fragments?.length || 0) + 
      (filteredResults.routes?.length || 0) +
      (filteredResults.manuscripts?.length || 0)
    : 0;
  
  return (
    <div className="space-y-6">
      {/* Panneau de filtres */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Filtres avancés</CardTitle>
              {activeFiltersCount > 0 && (
                <Badge variant="secondary">{activeFiltersCount} actif{activeFiltersCount > 1 ? 's' : ''}</Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              {activeFiltersCount > 0 && (
                <Button variant="ghost" size="sm" onClick={resetFilters}>
                  <RotateCcw className="h-4 w-4 mr-1" />
                  Réinitialiser
                </Button>
              )}
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          <CardDescription>
            Croisez les données par axe de recherche, période historique et région géographique
          </CardDescription>
        </CardHeader>
        
        {isExpanded && (
          <CardContent className="space-y-6">
            {/* Recherche textuelle */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Search className="h-4 w-4" />
                Recherche textuelle
              </Label>
              <Input
                placeholder="Rechercher dans les résultats..."
                value={filters.searchQuery}
                onChange={(e) => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
              />
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              {/* Filtre par axe */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Dna className="h-4 w-4" />
                  Axe de recherche
                </Label>
                <Select 
                  value={filters.axisId} 
                  onValueChange={(value) => setFilters(prev => ({ ...prev, axisId: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Tous les axes" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Tous les axes</SelectItem>
                    {RESEARCH_AXES.map(axis => (
                      <SelectItem key={axis.id} value={axis.id}>
                        {axis.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Filtre par région */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  Région géographique
                </Label>
                <Select 
                  value={filters.region} 
                  onValueChange={(value) => setFilters(prev => ({ ...prev, region: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Toutes les régions" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Toutes les régions</SelectItem>
                    {REGIONS.map(region => (
                      <SelectItem key={region} value={region}>
                        {region}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Filtre par période */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Période historique
                </Label>
                <div className="px-2 pt-2">
                  <Slider
                    value={[filters.period.start, filters.period.end]}
                    onValueChange={(value) => setFilters(prev => ({ 
                      ...prev, 
                      period: { start: value[0], end: value[1] } 
                    }))}
                    min={-2000}
                    max={2000}
                    step={100}
                    className="mb-2"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{formatYear(filters.period.start)}</span>
                    <span>{formatYear(filters.period.end)}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Tags des filtres actifs */}
            {activeFiltersCount > 0 && (
              <div className="flex flex-wrap gap-2 pt-2 border-t">
                {filters.axisId && (
                  <Badge variant="secondary" className="gap-1">
                    {RESEARCH_AXES.find(a => a.id === filters.axisId)?.label || filters.axisId}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => setFilters(prev => ({ ...prev, axisId: '' }))}
                    />
                  </Badge>
                )}
                {filters.region && (
                  <Badge variant="secondary" className="gap-1">
                    {filters.region}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => setFilters(prev => ({ ...prev, region: '' }))}
                    />
                  </Badge>
                )}
                {(filters.period.start !== -2000 || filters.period.end !== 2000) && (
                  <Badge variant="secondary" className="gap-1">
                    {formatYear(filters.period.start)} — {formatYear(filters.period.end)}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => setFilters(prev => ({ ...prev, period: { start: -2000, end: 2000 } }))}
                    />
                  </Badge>
                )}
                {filters.searchQuery && (
                  <Badge variant="secondary" className="gap-1">
                    "{filters.searchQuery}"
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => setFilters(prev => ({ ...prev, searchQuery: '' }))}
                    />
                  </Badge>
                )}
              </div>
            )}
          </CardContent>
        )}
      </Card>
      
      {/* Résultats */}
      {showResults && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">
                Résultats ({isLoading ? '...' : totalResults})
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-20 bg-muted animate-pulse rounded" />
                ))}
              </div>
            ) : (
              <Tabs defaultValue="all" className="space-y-4">
                <TabsList className="flex flex-wrap h-auto gap-1">
                  <TabsTrigger value="all" className="gap-1 text-xs">
                    Tout ({totalResults})
                  </TabsTrigger>
                  <TabsTrigger value="plants" className="gap-1 text-xs">
                    <Leaf className="h-3 w-3" />
                    Plantes ({filteredResults?.plants?.length || 0})
                  </TabsTrigger>
                  <TabsTrigger value="molecules" className="gap-1 text-xs">
                    <FlaskConical className="h-3 w-3" />
                    Molécules ({filteredResults?.molecules?.length || 0})
                  </TabsTrigger>
                  <TabsTrigger value="fragments" className="gap-1 text-xs">
                    <ScrollText className="h-3 w-3" />
                    Textes ({filteredResults?.fragments?.length || 0})
                  </TabsTrigger>
                  <TabsTrigger value="routes" className="gap-1 text-xs">
                    <Route className="h-3 w-3" />
                    Routes ({filteredResults?.routes?.length || 0})
                  </TabsTrigger>
                  <TabsTrigger value="manuscripts" className="gap-1 text-xs">
                    <BookOpen className="h-3 w-3" />
                    Manuscrits ({filteredResults?.manuscripts?.length || 0})
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="all">
                  <ScrollArea className="h-[400px]">
                    <div className="space-y-4">
                      {/* Plantes */}
                      {filteredResults?.plants && filteredResults.plants.length > 0 && (
                        <div>
                          <h4 className="font-medium flex items-center gap-2 mb-2">
                            <Leaf className="h-4 w-4 text-green-500" />
                            Plantes ({filteredResults.plants.length})
                          </h4>
                          <div className="grid gap-2">
                            {filteredResults.plants.slice(0, 5).map((plant: any) => (
                              <div key={plant.id} className="p-3 border rounded-lg hover:bg-muted/50">
                                <div className="font-medium">{plant.name}</div>
                                <div className="text-sm text-muted-foreground italic">{plant.latin_name}</div>
                                {plant.family && <Badge variant="outline" className="text-xs mt-1">{plant.family}</Badge>}
                              </div>
                            ))}
                            {filteredResults.plants.length > 5 && (
                              <p className="text-sm text-muted-foreground">
                                + {filteredResults.plants.length - 5} autres plantes
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                      
                      <Separator />
                      
                      {/* Molécules */}
                      {filteredResults?.molecules && filteredResults.molecules.length > 0 && (
                        <div>
                          <h4 className="font-medium flex items-center gap-2 mb-2">
                            <FlaskConical className="h-4 w-4 text-purple-500" />
                            Molécules ({filteredResults.molecules.length})
                          </h4>
                          <div className="grid gap-2">
                            {filteredResults.molecules.slice(0, 5).map((mol: any) => (
                              <div key={mol.id} className="p-3 border rounded-lg hover:bg-muted/50">
                                <div className="font-medium">{mol.molecule_name}</div>
                                {mol.family && <Badge variant="outline" className="text-xs mt-1">{mol.family}</Badge>}
                                {mol.role && <Badge variant="secondary" className="text-xs mt-1 ml-1">{mol.role}</Badge>}
                              </div>
                            ))}
                            {filteredResults.molecules.length > 5 && (
                              <p className="text-sm text-muted-foreground">
                                + {filteredResults.molecules.length - 5} autres molécules
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                      
                      <Separator />
                      
                      {/* Fragments textuels */}
                      {filteredResults?.fragments && filteredResults.fragments.length > 0 && (
                        <div>
                          <h4 className="font-medium flex items-center gap-2 mb-2">
                            <ScrollText className="h-4 w-4 text-amber-500" />
                            Fragments textuels ({filteredResults.fragments.length})
                          </h4>
                          <div className="grid gap-2">
                            {filteredResults.fragments.slice(0, 5).map((frag: any) => (
                              <div key={frag.id} className="p-3 border rounded-lg hover:bg-muted/50">
                                <div className="flex items-center gap-2 mb-1">
                                  <Badge variant="outline" className="text-xs">{frag.manuscript_id}</Badge>
                                  <Badge variant="secondary" className="text-xs">{frag.language}</Badge>
                                </div>
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                  {frag.translation_fr || frag.original_text}
                                </p>
                              </div>
                            ))}
                            {filteredResults.fragments.length > 5 && (
                              <p className="text-sm text-muted-foreground">
                                + {filteredResults.fragments.length - 5} autres fragments
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                      
                      <Separator />
                      
                      {/* Routes */}
                      {filteredResults?.routes && filteredResults.routes.length > 0 && (
                        <div>
                          <h4 className="font-medium flex items-center gap-2 mb-2">
                            <Route className="h-4 w-4 text-cyan-500" />
                            Routes commerciales ({filteredResults.routes.length})
                          </h4>
                          <div className="grid gap-2">
                            {filteredResults.routes.slice(0, 5).map((route: any) => (
                              <div key={route.id} className="p-3 border rounded-lg hover:bg-muted/50">
                                <div className="font-medium">{route.name}</div>
                                <div className="text-sm text-muted-foreground">
                                  {route.time_start && route.time_start < 0 
                                    ? `${Math.abs(route.time_start)} av. J.-C.` 
                                    : route.time_start || '?'} 
                                  {' — '}
                                  {route.time_end && route.time_end < 0 
                                    ? `${Math.abs(route.time_end)} av. J.-C.` 
                                    : route.time_end || '?'}
                                </div>
                                {route.materials?.length > 0 && (
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {route.materials.slice(0, 3).map((mat: string, i: number) => (
                                      <Badge key={i} variant="outline" className="text-xs">
                                        {mat.replace(/_/g, ' ')}
                                      </Badge>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ))}
                            {filteredResults.routes.length > 5 && (
                              <p className="text-sm text-muted-foreground">
                                + {filteredResults.routes.length - 5} autres routes
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </TabsContent>
                
                {/* Onglets individuels */}
                <TabsContent value="plants">
                  <ScrollArea className="h-[400px]">
                    <div className="grid gap-2">
                      {filteredResults?.plants?.map((plant: any) => (
                        <div key={plant.id} className="p-3 border rounded-lg hover:bg-muted/50">
                          <div className="font-medium">{plant.name}</div>
                          <div className="text-sm text-muted-foreground italic">{plant.latin_name}</div>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {plant.family && <Badge variant="outline" className="text-xs">{plant.family}</Badge>}
                            {plant.climatic_axis && <Badge variant="secondary" className="text-xs">{plant.climatic_axis}</Badge>}
                          </div>
                          {plant.olfactive_signature && (
                            <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{plant.olfactive_signature}</p>
                          )}
                        </div>
                      ))}
                      {(!filteredResults?.plants || filteredResults.plants.length === 0) && (
                        <p className="text-center text-muted-foreground py-8">Aucune plante trouvée</p>
                      )}
                    </div>
                  </ScrollArea>
                </TabsContent>
                
                <TabsContent value="molecules">
                  <ScrollArea className="h-[400px]">
                    <div className="grid gap-2">
                      {filteredResults?.molecules?.map((mol: any) => (
                        <div key={mol.id} className="p-3 border rounded-lg hover:bg-muted/50">
                          <div className="font-medium">{mol.molecule_name}</div>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {mol.family && <Badge variant="outline" className="text-xs">{mol.family}</Badge>}
                            {mol.role && <Badge variant="secondary" className="text-xs">{mol.role}</Badge>}
                          </div>
                          {mol.odor_key && (
                            <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{mol.odor_key}</p>
                          )}
                        </div>
                      ))}
                      {(!filteredResults?.molecules || filteredResults.molecules.length === 0) && (
                        <p className="text-center text-muted-foreground py-8">Aucune molécule trouvée</p>
                      )}
                    </div>
                  </ScrollArea>
                </TabsContent>
                
                <TabsContent value="fragments">
                  <ScrollArea className="h-[400px]">
                    <div className="grid gap-2">
                      {filteredResults?.fragments?.map((frag: any) => (
                        <div key={frag.id} className="p-3 border rounded-lg hover:bg-muted/50">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline" className="text-xs">{frag.fragment_id}</Badge>
                            <Badge variant="secondary" className="text-xs">{frag.language}</Badge>
                            <Badge 
                              variant={frag.evidence_level === 'confirmed' ? 'default' : 'outline'} 
                              className="text-xs"
                            >
                              {frag.evidence_level}
                            </Badge>
                          </div>
                          {frag.original_text && (
                            <div className="mb-2">
                              <p className="text-xs font-medium text-muted-foreground mb-1">Texte original:</p>
                              <p className="text-sm italic line-clamp-2">{frag.original_text}</p>
                            </div>
                          )}
                          {frag.translation_fr && (
                            <div>
                              <p className="text-xs font-medium text-muted-foreground mb-1">Traduction:</p>
                              <p className="text-sm line-clamp-2">{frag.translation_fr}</p>
                            </div>
                          )}
                          {frag.notes && (
                            <p className="text-xs text-muted-foreground mt-2 border-t pt-2">{frag.notes}</p>
                          )}
                        </div>
                      ))}
                      {(!filteredResults?.fragments || filteredResults.fragments.length === 0) && (
                        <p className="text-center text-muted-foreground py-8">Aucun fragment trouvé</p>
                      )}
                    </div>
                  </ScrollArea>
                </TabsContent>
                
                <TabsContent value="routes">
                  <ScrollArea className="h-[400px]">
                    <div className="grid gap-2">
                      {filteredResults?.routes?.map((route: any) => (
                        <div key={route.id} className="p-3 border rounded-lg hover:bg-muted/50">
                          <div className="font-medium">{route.name}</div>
                          <div className="text-sm text-muted-foreground mb-2">
                            {route.time_start && route.time_start < 0 
                              ? `${Math.abs(route.time_start)} av. J.-C.` 
                              : route.time_start || '?'} 
                            {' — '}
                            {route.time_end && route.time_end < 0 
                              ? `${Math.abs(route.time_end)} av. J.-C.` 
                              : route.time_end || '?'}
                          </div>
                          {route.nodes?.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-2">
                              {route.nodes.map((node: any, i: number) => (
                                <Badge key={i} variant="outline" className="text-xs">
                                  {node.place}
                                </Badge>
                              ))}
                            </div>
                          )}
                          {route.materials?.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {route.materials.map((mat: string, i: number) => (
                                <Badge key={i} variant="secondary" className="text-xs">
                                  {mat.replace(/_/g, ' ')}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                      {(!filteredResults?.routes || filteredResults.routes.length === 0) && (
                        <p className="text-center text-muted-foreground py-8">Aucune route trouvée</p>
                      )}
                    </div>
                  </ScrollArea>
                </TabsContent>
                
                <TabsContent value="manuscripts">
                  <ScrollArea className="h-[400px]">
                    <div className="grid gap-2">
                      {filteredResults?.manuscripts?.map((ms: any) => (
                        <div key={ms.id} className="p-3 border rounded-lg hover:bg-muted/50">
                          <div className="font-medium">{ms.title}</div>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {ms.language && <Badge variant="outline" className="text-xs">{ms.language}</Badge>}
                            {ms.region && <Badge variant="secondary" className="text-xs">{ms.region}</Badge>}
                            {ms.ocr_status && <Badge variant="outline" className="text-xs">{ms.ocr_status}</Badge>}
                          </div>
                          {ms.notes && (
                            <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{ms.notes}</p>
                          )}
                        </div>
                      ))}
                      {(!filteredResults?.manuscripts || filteredResults.manuscripts.length === 0) && (
                        <p className="text-center text-muted-foreground py-8">Aucun manuscrit trouvé</p>
                      )}
                    </div>
                  </ScrollArea>
                </TabsContent>
              </Tabs>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default CorpusAdvancedFilters;
