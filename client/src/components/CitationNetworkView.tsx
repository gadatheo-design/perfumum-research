// @ts-nocheck
import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import {
  Network,
  Filter,
  Search,
  Calendar,
  User,
  BookOpen,
  Link2,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Info,
  BarChart3,
  GitBranch,
  Target,
} from "lucide-react";
import { CitationGraph } from "./CitationGraph";
import { DateRangeFilter } from "./DateRangeFilter";

interface CitationNetworkViewProps {
  onReferenceClick?: (referenceId: number) => void;
}

export function CitationNetworkView({ onReferenceClick }: CitationNetworkViewProps) {
  const [activeView, setActiveView] = useState<"graph" | "list" | "stats">("graph");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedYearRange, setSelectedYearRange] = useState<[number, number] | null>(null);
  const [selectedAuthor, setSelectedAuthor] = useState<string>("all");
  const [selectedAxis, setSelectedAxis] = useState<string>("all");
  const [graphFilters, setGraphFilters] = useState<{
    citationType?: string;
    researchDomain?: string;
    minWeight?: number;
    verified?: boolean;
  }>({});

  // Fetch citation graph data
  const { data: citationGraph, isLoading: isGraphLoading } = trpc.referenceCitations.getGraph.useQuery(graphFilters);
  const { data: citationStats } = trpc.referenceCitations.getStats.useQuery();
  const { data: bibliographyStats } = trpc.bibliography.getStats.useQuery();
  const { data: thematicAxes } = trpc.thematicAxes.list.useQuery();

  // Filter nodes based on search and filters
  const filteredData = useMemo(() => {
    if (!citationGraph) return { nodes: [], links: [] };

    let filteredNodes = citationGraph.nodes;
    let filteredLinks = citationGraph.links;

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filteredNodes = filteredNodes.filter(
        (node: any) =>
          node.title.toLowerCase().includes(query) ||
          node.authors?.toLowerCase().includes(query) ||
          node.entryKey.toLowerCase().includes(query)
      );
    }

    // Filter by year range
    if (selectedYearRange) {
      filteredNodes = filteredNodes.filter(
        (node: any) =>
          node.year &&
          node.year >= selectedYearRange[0] &&
          node.year <= selectedYearRange[1]
      );
    }

    // Filter by author
    if (selectedAuthor !== "all") {
      filteredNodes = filteredNodes.filter(
        (node: any) => node.authors?.toLowerCase().includes(selectedAuthor.toLowerCase())
      );
    }

    // Filter links to only include those between filtered nodes
    const nodeIds = new Set(filteredNodes.map((n: any) => n.id));
    filteredLinks = filteredLinks.filter((link: any) => {
      const sourceId = typeof link.source === "number" ? link.source : link.source.id;
      const targetId = typeof link.target === "number" ? link.target : link.target.id;
      return nodeIds.has(sourceId) && nodeIds.has(targetId);
    });

    return { nodes: filteredNodes, links: filteredLinks };
  }, [citationGraph, searchQuery, selectedYearRange, selectedAuthor]);

  // Extract unique authors for filter
  const uniqueAuthors = useMemo(() => {
    if (!citationGraph?.nodes) return [];
    const authors = new Set<string>();
    citationGraph.nodes.forEach((node: any) => {
      if (node.authors) {
        // Extract first author
        const firstAuthor = node.authors.split(",")[0].trim();
        if (firstAuthor) authors.add(firstAuthor);
      }
    });
    return Array.from(authors).sort();
  }, [citationGraph]);

  // Citation type distribution
  const citationTypeDistribution = useMemo(() => {
    if (!citationStats?.byType) return [];
    return citationStats.byType;
  }, [citationStats]);

  return (
    <div className="space-y-6">
      {/* Header with stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{citationStats?.totalCitations || 0}</CardTitle>
            <CardDescription className="flex items-center gap-1">
              <Link2 className="h-3 w-3" />
              Citations totales
            </CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{citationStats?.totalCitingReferences || 0}</CardTitle>
            <CardDescription className="flex items-center gap-1">
              <ArrowRight className="h-3 w-3" />
              Références citantes
            </CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{citationStats?.totalCitedReferences || 0}</CardTitle>
            <CardDescription className="flex items-center gap-1">
              <ArrowLeft className="h-3 w-3" />
              Références citées
            </CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{citationStats?.verifiedCount || 0}</CardTitle>
            <CardDescription className="flex items-center gap-1">
              <Target className="h-3 w-3" />
              Citations vérifiées
            </CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{filteredData.nodes.length}</CardTitle>
            <CardDescription className="flex items-center gap-1">
              <Network className="h-3 w-3" />
              Nœuds affichés
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtres du réseau
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchQuery("");
                setSelectedYearRange(null);
                setSelectedAuthor("all");
                setSelectedAxis("all");
                setGraphFilters({});
              }}
            >
              Réinitialiser
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="space-y-2">
              <Label className="text-sm">Recherche</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Titre, auteur, clé..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Year range */}
            <div className="space-y-2">
              <Label className="text-sm">Période</Label>
              {bibliographyStats?.yearRange && (
                <DateRangeFilter
                  minYear={bibliographyStats.yearRange.min}
                  maxYear={bibliographyStats.yearRange.max}
                  selectedRange={selectedYearRange}
                  onRangeChange={setSelectedYearRange}
                  yearDistribution={bibliographyStats.byYear}
                />
              )}
            </div>

            {/* Author filter */}
            <div className="space-y-2">
              <Label className="text-sm">Auteur principal</Label>
              <Select value={selectedAuthor} onValueChange={setSelectedAuthor}>
                <SelectTrigger>
                  <SelectValue placeholder="Tous les auteurs" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les auteurs</SelectItem>
                  {uniqueAuthors.slice(0, 50).map((author) => (
                    <SelectItem key={author} value={author}>
                      {author}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Thematic axis filter */}
            <div className="space-y-2">
              <Label className="text-sm">Axe thématique</Label>
              <Select value={selectedAxis} onValueChange={setSelectedAxis}>
                <SelectTrigger>
                  <SelectValue placeholder="Tous les axes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les axes</SelectItem>
                  {thematicAxes?.map((axis: any) => (
                    <SelectItem key={axis.id} value={axis.axisCode}>
                      {axis.axisCode} - {axis.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Additional filters row */}
          <div className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t">
            <div className="flex items-center gap-2">
              <Switch
                checked={graphFilters.verified || false}
                onCheckedChange={(v) => setGraphFilters({ ...graphFilters, verified: v || undefined })}
              />
              <Label className="text-sm">Vérifiées uniquement</Label>
            </div>

            <Select
              value={graphFilters.citationType || "all"}
              onValueChange={(v) => setGraphFilters({ ...graphFilters, citationType: v === "all" ? undefined : v })}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Type de citation" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                <SelectItem value="direct">Direct</SelectItem>
                <SelectItem value="indirect">Indirect</SelectItem>
                <SelectItem value="methodological">Méthodologique</SelectItem>
                <SelectItem value="theoretical">Théorique</SelectItem>
                <SelectItem value="data">Données</SelectItem>
                <SelectItem value="critique">Critique</SelectItem>
                <SelectItem value="support">Support</SelectItem>
                <SelectItem value="comparison">Comparaison</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center gap-2">
              <Label className="text-sm whitespace-nowrap">Poids min:</Label>
              <Slider
                value={[graphFilters.minWeight || 1]}
                min={1}
                max={5}
                step={1}
                onValueChange={([v]) => setGraphFilters({ ...graphFilters, minWeight: v > 1 ? v : undefined })}
                className="w-24"
              />
              <span className="text-sm text-muted-foreground">{graphFilters.minWeight || 1}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main content tabs */}
      <Tabs value={activeView} onValueChange={(v) => setActiveView(v as any)}>
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="graph" className="flex items-center gap-2">
            <Network className="h-4 w-4" />
            Graphe
          </TabsTrigger>
          <TabsTrigger value="list" className="flex items-center gap-2">
            <GitBranch className="h-4 w-4" />
            Relations
          </TabsTrigger>
          <TabsTrigger value="stats" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Statistiques
          </TabsTrigger>
        </TabsList>

        <TabsContent value="graph" className="mt-6">
          {isGraphLoading ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                <p className="mt-4 text-muted-foreground">Chargement du graphe...</p>
              </CardContent>
            </Card>
          ) : filteredData.nodes.length > 0 ? (
            <CitationGraph
              nodes={filteredData.nodes}
              links={filteredData.links}
              isLoading={isGraphLoading}
              filters={graphFilters}
              onFiltersChange={setGraphFilters}
              onNodeClick={(node) => {
                onReferenceClick?.(node.id);
                toast.info(`Référence: ${node.title}`);
              }}
            />
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <Network className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Aucune citation trouvée</h3>
                <p className="text-muted-foreground">
                  Ajustez vos filtres ou ajoutez des relations de citation entre vos références
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="list" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GitBranch className="h-5 w-5" />
                Relations de citations
              </CardTitle>
              <CardDescription>
                Liste des citations entre références bibliographiques
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredData.links.length > 0 ? (
                <div className="space-y-3 max-h-[500px] overflow-y-auto">
                  {filteredData.links.slice(0, 50).map((link: any, index: number) => {
                    const sourceNode = filteredData.nodes.find(
                      (n: any) => n.id === (typeof link.source === "number" ? link.source : link.source.id)
                    );
                    const targetNode = filteredData.nodes.find(
                      (n: any) => n.id === (typeof link.target === "number" ? link.target : link.target.id)
                    );
                    
                    return (
                      <div
                        key={link.id || index}
                        className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 text-sm">
                            <span className="font-medium truncate max-w-[200px]">
                              {sourceNode?.title || "?"}
                            </span>
                            <Badge variant="outline" className="shrink-0">
                              {sourceNode?.year || "?"}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground truncate">
                            {sourceNode?.authors?.split(",")[0] || "Auteur inconnu"}
                          </p>
                        </div>
                        
                        <div className="flex flex-col items-center shrink-0">
                          <ArrowRight className="h-4 w-4 text-primary" />
                          <Badge variant="secondary" className="text-xs mt-1">
                            {link.citationType || "direct"}
                          </Badge>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 text-sm">
                            <span className="font-medium truncate max-w-[200px]">
                              {targetNode?.title || "?"}
                            </span>
                            <Badge variant="outline" className="shrink-0">
                              {targetNode?.year || "?"}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground truncate">
                            {targetNode?.authors?.split(",")[0] || "Auteur inconnu"}
                          </p>
                        </div>
                        
                        <div className="flex items-center gap-1 shrink-0">
                          {link.verified && (
                            <Badge className="bg-green-500/20 text-green-400 text-xs">
                              Vérifié
                            </Badge>
                          )}
                          <Badge variant="outline" className="text-xs">
                            Poids: {link.weight || 1}
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                  {filteredData.links.length > 50 && (
                    <p className="text-center text-sm text-muted-foreground py-2">
                      ... et {filteredData.links.length - 50} autres relations
                    </p>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <GitBranch className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>Aucune relation de citation trouvée</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Citation type distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Distribution par type</CardTitle>
              </CardHeader>
              <CardContent>
                {citationTypeDistribution.length > 0 ? (
                  <div className="space-y-3">
                    {citationTypeDistribution.map((item: any) => (
                      <div key={item.type} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{
                              backgroundColor:
                                item.type === "direct" ? "#3b82f6" :
                                item.type === "indirect" ? "#8b5cf6" :
                                item.type === "methodological" ? "#10b981" :
                                item.type === "theoretical" ? "#f59e0b" :
                                "#6b7280"
                            }}
                          />
                          <span className="text-sm capitalize">{item.type || "Non classé"}</span>
                        </div>
                        <Badge variant="secondary">{item.count}</Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">Aucune donnée disponible</p>
                )}
              </CardContent>
            </Card>

            {/* Most cited references */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Références les plus citées</CardTitle>
              </CardHeader>
              <CardContent>
                {citationStats?.mostCited && citationStats.mostCited.length > 0 ? (
                  <div className="space-y-3">
                    {citationStats.mostCited.slice(0, 10).map((item: any, index: number) => (
                      <div
                        key={item.citedId}
                        className="flex items-center gap-3 cursor-pointer hover:bg-muted/50 p-2 rounded-lg transition-colors"
                        onClick={() => onReferenceClick?.(item.citedId)}
                      >
                        <span className="text-lg font-bold text-muted-foreground w-6">
                          #{index + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">
                            {item.reference?.title || "Titre inconnu"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {item.reference?.authors?.split(",")[0] || "?"} ({item.reference?.year || "?"})
                          </p>
                        </div>
                        <Badge className="bg-primary/20 text-primary">
                          {item.count} citations
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">Aucune donnée disponible</p>
                )}
              </CardContent>
            </Card>

            {/* Most citing references */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Références les plus citantes</CardTitle>
              </CardHeader>
              <CardContent>
                {citationStats?.mostCiting && citationStats.mostCiting.length > 0 ? (
                  <div className="space-y-3">
                    {citationStats.mostCiting.slice(0, 10).map((item: any, index: number) => (
                      <div
                        key={item.citingId}
                        className="flex items-center gap-3 cursor-pointer hover:bg-muted/50 p-2 rounded-lg transition-colors"
                        onClick={() => onReferenceClick?.(item.citingId)}
                      >
                        <span className="text-lg font-bold text-muted-foreground w-6">
                          #{index + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">
                            {item.reference?.title || "Titre inconnu"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {item.reference?.authors?.split(",")[0] || "?"} ({item.reference?.year || "?"})
                          </p>
                        </div>
                        <Badge className="bg-blue-500/20 text-blue-400">
                          {item.count} refs citées
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">Aucune donnée disponible</p>
                )}
              </CardContent>
            </Card>

            {/* Network metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Métriques du réseau</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Densité du graphe</span>
                    <span className="font-medium">
                      {filteredData.nodes.length > 1
                        ? ((filteredData.links.length * 2) / (filteredData.nodes.length * (filteredData.nodes.length - 1)) * 100).toFixed(2)
                        : 0}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Degré moyen</span>
                    <span className="font-medium">
                      {filteredData.nodes.length > 0
                        ? ((filteredData.links.length * 2) / filteredData.nodes.length).toFixed(2)
                        : 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Nœuds isolés</span>
                    <span className="font-medium">
                      {citationGraph?.nodes
                        ? citationGraph.nodes.filter((n: any) => n.inDegree === 0 && n.outDegree === 0).length
                        : 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Taux de vérification</span>
                    <span className="font-medium">
                      {citationStats?.totalCitations
                        ? ((citationStats.verifiedCount / citationStats.totalCitations) * 100).toFixed(1)
                        : 0}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
