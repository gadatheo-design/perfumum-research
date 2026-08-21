/**
 * Page Graphe des Références par Axe Thématique
 * Visualise les connexions entre références bibliographiques et axes H2/H3
 * avec un graphe de force D3.js interactif
 */

import { useMemo, useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  Network, 
  BookOpen, 
  Layers, 
  ArrowLeft,
  Info,
  Sparkles,
  Filter,
  ZoomIn,
  ZoomOut,
  Maximize2,
  RefreshCw,
  Download,
  Search,
  ExternalLink,
  Link2,
  X,
  ChevronRight
} from "lucide-react";
import { toast } from "sonner";
import * as d3 from "d3";

// Types pour le graphe
interface GraphNode {
  id: string;
  name: string;
  type: 'axis' | 'reference';
  group: string;
  color: string;
  size: number;
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
  // Métadonnées
  year?: number | null;
  entryType?: string;
  axisPrimaryCode?: string | null;
  entityLinkCount?: number;
  metaAxis?: string;
  referenceCount?: number;
}

interface GraphLink {
  source: string | GraphNode;
  target: string | GraphNode;
  type: 'primary' | 'secondary';
  value: number;
}

// Couleurs par meta-axe
const META_AXIS_COLORS: Record<string, string> = {
  'meta_a': '#10b981', // Vert - Heritage & Archives
  'meta_b': '#8b5cf6', // Violet - Arts & Chimie
  'meta_c': '#f59e0b', // Orange - Digital & Datasets
  'other': '#6b7280',  // Gris
};

// Noms des meta-axes
const META_AXIS_NAMES: Record<string, string> = {
  'meta_a': 'Heritage & Archives',
  'meta_b': 'Arts & Chimie de l\'espace',
  'meta_c': 'Digital Olfaction & Datasets',
  'other': 'Autres',
};

export default function ReferencesGraph() {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // États
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [filterMetaAxis, setFilterMetaAxis] = useState<string>('all');
  const [showSecondaryLinks, setShowSecondaryLinks] = useState(true);
  const [minEntityLinks, setMinEntityLinks] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [zoomLevel, setZoomLevel] = useState(1);
  
  // Charger les données
  const { data: graphData, isLoading: loadingGraph } = trpc.graphVisualization.getGraphData.useQuery();
  const { data: stats, isLoading: loadingStats } = trpc.graphVisualization.getStats.useQuery();
  
  // Détails de la référence sélectionnée
  const { data: referenceDetails, isLoading: loadingDetails } = trpc.graphVisualization.getReferenceDetails.useQuery(
    selectedNode?.type === 'reference' ? parseInt(selectedNode.id.replace('ref-', '')) : 0,
    { enabled: selectedNode?.type === 'reference' }
  );
  
  const isLoading = loadingGraph || loadingStats;

  // Construire les données du graphe filtrées
  const filteredGraphData = useMemo(() => {
    if (!graphData) return { nodes: [], links: [] };
    
    const { axes, references, links } = graphData;
    
    // Filtrer les axes par meta-axe
    const filteredAxes = filterMetaAxis === 'all' 
      ? axes 
      : axes.filter(a => a.metaAxis === filterMetaAxis);
    
    const axisCodeSet = new Set(filteredAxes.map(a => a.code));
    
    // Filtrer les références
    let filteredRefs = references.filter(r => {
      // Filtre par axe
      if (filterMetaAxis !== 'all') {
        const hasMatchingAxis = r.axisPrimaryCode && axisCodeSet.has(r.axisPrimaryCode);
        const hasMatchingSecondary = r.axesSecondary?.some(code => axisCodeSet.has(code));
        if (!hasMatchingAxis && !hasMatchingSecondary) return false;
      }
      
      // Filtre par nombre de liaisons entités
      if (r.entityLinkCount < minEntityLinks) return false;
      
      // Filtre par recherche
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (!r.title.toLowerCase().includes(query)) return false;
      }
      
      return true;
    });
    
    // Créer les nœuds
    const nodes: GraphNode[] = [];
    
    // Ajouter les axes
    filteredAxes.forEach(axis => {
      nodes.push({
        id: axis.code,
        name: axis.name,
        type: 'axis',
        group: axis.metaAxis,
        color: META_AXIS_COLORS[axis.metaAxis] || META_AXIS_COLORS.other,
        size: Math.max(20, Math.min(50, 15 + axis.referenceCount * 2)),
        metaAxis: axis.metaAxis,
        referenceCount: axis.referenceCount,
      });
    });
    
    // Ajouter les références
    const refIdSet = new Set(filteredRefs.map(r => r.id));
    filteredRefs.forEach(ref => {
      const primaryAxis = axes.find(a => a.code === ref.axisPrimaryCode);
      nodes.push({
        id: `ref-${ref.id}`,
        name: ref.title,
        type: 'reference',
        group: ref.axisPrimaryCode || 'none',
        color: primaryAxis ? META_AXIS_COLORS[primaryAxis.metaAxis] || '#6b7280' : '#6b7280',
        size: 8 + (ref.entityLinkCount || 0) * 2,
        year: ref.year,
        entryType: ref.entryType,
        axisPrimaryCode: ref.axisPrimaryCode,
        entityLinkCount: ref.entityLinkCount,
      });
    });
    
    // Filtrer les liens
    const filteredLinks: GraphLink[] = links
      .filter(link => {
        // Vérifier que la source (axe) existe
        if (!axisCodeSet.has(link.source)) return false;
        
        // Vérifier que la cible (référence) existe
        const refId = parseInt(link.target.replace('ref-', ''));
        if (!refIdSet.has(refId)) return false;
        
        // Filtre liens secondaires
        if (!showSecondaryLinks && link.type === 'secondary') return false;
        
        return true;
      })
      .map(link => ({
        source: link.source,
        target: link.target,
        type: link.type,
        value: link.type === 'primary' ? 2 : 1,
      }));
    
    return { nodes, links: filteredLinks };
  }, [graphData, filterMetaAxis, showSecondaryLinks, minEntityLinks, searchQuery]);

  // Initialiser et mettre à jour le graphe D3
  useEffect(() => {
    if (!svgRef.current || !containerRef.current || filteredGraphData.nodes.length === 0) return;
    
    const svg = d3.select(svgRef.current);
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = 600;
    
    // Nettoyer
    svg.selectAll("*").remove();
    
    // Créer le groupe principal avec zoom
    const g = svg.append("g");
    
    // Zoom
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 4])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
        setZoomLevel(event.transform.k);
      });
    
    svg.call(zoom);
    
    // Créer les données de simulation
    const nodes = filteredGraphData.nodes.map(d => ({ ...d }));
    const links = filteredGraphData.links.map(d => ({ ...d }));
    
    // Simulation de force
    const simulation = d3.forceSimulation(nodes as d3.SimulationNodeDatum[])
      .force("link", d3.forceLink(links)
        .id((d: any) => d.id)
        .distance(100)
        .strength(0.5))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius((d: any) => d.size + 5));
    
    // Définir les marqueurs de flèche
    svg.append("defs").selectAll("marker")
      .data(["primary", "secondary"])
      .join("marker")
      .attr("id", d => `arrow-${d}`)
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 20)
      .attr("refY", 0)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("path")
      .attr("fill", d => d === "primary" ? "#6366f1" : "#94a3b8")
      .attr("d", "M0,-5L10,0L0,5");
    
    // Créer les liens
    const link = g.append("g")
      .attr("class", "links")
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke", (d: any) => d.type === 'primary' ? "#6366f1" : "#94a3b8")
      .attr("stroke-opacity", (d: any) => d.type === 'primary' ? 0.6 : 0.3)
      .attr("stroke-width", (d: any) => d.type === 'primary' ? 2 : 1)
      .attr("stroke-dasharray", (d: any) => d.type === 'secondary' ? "4,4" : "none");
    
    // Créer les nœuds
    const node = g.append("g")
      .attr("class", "nodes")
      .selectAll("g")
      .data(nodes)
      .join("g")
      .attr("cursor", "pointer")
      .call(d3.drag<SVGGElement, any>()
        .on("start", (event, d) => {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        })
        .on("drag", (event, d) => {
          d.fx = event.x;
          d.fy = event.y;
        })
        .on("end", (event, d) => {
          if (!event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        }) as any);
    
    // Cercles pour les nœuds
    node.append("circle")
      .attr("r", (d: any) => d.size)
      .attr("fill", (d: any) => d.color)
      .attr("stroke", "#fff")
      .attr("stroke-width", (d: any) => d.type === 'axis' ? 3 : 1.5)
      .attr("opacity", (d: any) => d.type === 'axis' ? 1 : 0.8);
    
    // Labels pour les axes
    node.filter((d: any) => d.type === 'axis')
      .append("text")
      .attr("dy", (d: any) => d.size + 14)
      .attr("text-anchor", "middle")
      .attr("font-size", "11px")
      .attr("font-weight", "600")
      .attr("fill", "#374151")
      .text((d: any) => d.id);
    
    // Tooltip
    node.append("title")
      .text((d: any) => {
        if (d.type === 'axis') {
          return `${d.id}: ${d.name}\n${d.referenceCount} références`;
        }
        return `${d.name}\n${d.year || 'N/A'} • ${d.entityLinkCount || 0} liaisons`;
      });
    
    // Événements de clic
    node.on("click", (event, d: any) => {
      event.stopPropagation();
      setSelectedNode(d);
    });
    
    // Clic sur le fond pour désélectionner
    svg.on("click", () => {
      setSelectedNode(null);
    });
    
    // Mise à jour de la simulation
    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);
      
      node.attr("transform", (d: any) => `translate(${d.x},${d.y})`);
    });
    
    // Centrer la vue
    svg.call(zoom.transform, d3.zoomIdentity.translate(0, 0).scale(0.8));
    
    return () => {
      simulation.stop();
    };
  }, [filteredGraphData]);

  // Fonctions de contrôle du zoom
  const handleZoomIn = useCallback(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    svg.transition().call(
      d3.zoom<SVGSVGElement, unknown>().scaleBy as any,
      1.5
    );
  }, []);

  const handleZoomOut = useCallback(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    svg.transition().call(
      d3.zoom<SVGSVGElement, unknown>().scaleBy as any,
      0.67
    );
  }, []);

  const handleResetZoom = useCallback(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    svg.transition().call(
      d3.zoom<SVGSVGElement, unknown>().transform as any,
      d3.zoomIdentity.translate(0, 0).scale(0.8)
    );
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Breadcrumbs />
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-12 md:py-16 overflow-hidden border-b border-border/50">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background" />
          
          <div className="container relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl mx-auto text-center"
            >
              <Link href="/graphe-relations">
                <Button variant="ghost" size="sm" className="mb-4 gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Retour aux visualisations
                </Button>
              </Link>
              
              <Badge variant="outline" className="mb-4 px-4 py-1.5 text-sm font-medium border-primary/20 bg-primary/5 text-primary">
                <Network className="w-4 h-4 mr-2" />
                Graphe de Force D3.js
              </Badge>
              
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3 text-foreground">
                Références par Axe Thématique
              </h1>
              
              <p className="text-muted-foreground">
                Explorez les connexions entre les références bibliographiques et les axes de recherche H2/H3.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Stats Cards */}
        <section className="py-6 border-b border-border/30">
          <div className="container">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="bg-card/50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Layers className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{stats?.totalAxes || 0}</p>
                      <p className="text-xs text-muted-foreground">Axes thématiques</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-card/50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-emerald-500/10">
                      <BookOpen className="w-5 h-5 text-emerald-500" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{stats?.totalReferences || 0}</p>
                      <p className="text-xs text-muted-foreground">Références</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-card/50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-violet-500/10">
                      <Link2 className="w-5 h-5 text-violet-500" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{stats?.totalLinks || 0}</p>
                      <p className="text-xs text-muted-foreground">Liaisons entités</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-card/50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-amber-500/10">
                      <Sparkles className="w-5 h-5 text-amber-500" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{stats?.referencesWithLinks || 0}</p>
                      <p className="text-xs text-muted-foreground">Avec liaisons</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-8">
          <div className="container">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Sidebar - Filtres */}
              <div className="lg:col-span-1 space-y-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <Filter className="w-4 h-4" />
                      Filtres
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Recherche */}
                    <div className="space-y-2">
                      <Label className="text-xs">Rechercher</Label>
                      <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Titre de référence..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-8 h-9"
                        />
                      </div>
                    </div>
                    
                    {/* Meta-axe */}
                    <div className="space-y-2">
                      <Label className="text-xs">Meta-axe</Label>
                      <Select value={filterMetaAxis} onValueChange={setFilterMetaAxis}>
                        <SelectTrigger className="h-9">
                          <SelectValue placeholder="Tous les axes" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Tous les axes</SelectItem>
                          <SelectItem value="meta_a">
                            <span className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-emerald-500" />
                              Heritage & Archives
                            </span>
                          </SelectItem>
                          <SelectItem value="meta_b">
                            <span className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-violet-500" />
                              Arts & Chimie
                            </span>
                          </SelectItem>
                          <SelectItem value="meta_c">
                            <span className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-amber-500" />
                              Digital & Datasets
                            </span>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {/* Liaisons secondaires */}
                    <div className="flex items-center justify-between">
                      <Label className="text-xs">Liens secondaires</Label>
                      <Switch
                        checked={showSecondaryLinks}
                        onCheckedChange={setShowSecondaryLinks}
                      />
                    </div>
                    
                    {/* Min liaisons entités */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-xs">Min. liaisons entités</Label>
                        <span className="text-xs text-muted-foreground">{minEntityLinks}</span>
                      </div>
                      <Slider
                        value={[minEntityLinks]}
                        onValueChange={([v]) => setMinEntityLinks(v)}
                        min={0}
                        max={10}
                        step={1}
                        className="w-full"
                      />
                    </div>
                    
                    <Separator />
                    
                    {/* Statistiques filtrées */}
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">Affichés</Label>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="p-2 rounded bg-muted/50">
                          <p className="font-medium">{filteredGraphData.nodes.filter(n => n.type === 'axis').length}</p>
                          <p className="text-xs text-muted-foreground">Axes</p>
                        </div>
                        <div className="p-2 rounded bg-muted/50">
                          <p className="font-medium">{filteredGraphData.nodes.filter(n => n.type === 'reference').length}</p>
                          <p className="text-xs text-muted-foreground">Références</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Légende */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <Info className="w-4 h-4" />
                      Légende
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-muted-foreground">Meta-axes</p>
                      {Object.entries(META_AXIS_NAMES).map(([key, name]) => (
                        <div key={key} className="flex items-center gap-2 text-xs">
                          <span 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: META_AXIS_COLORS[key] }}
                          />
                          <span>{name}</span>
                        </div>
                      ))}
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-muted-foreground">Liens</p>
                      <div className="flex items-center gap-2 text-xs">
                        <div className="w-8 h-0.5 bg-indigo-500" />
                        <span>Lien primaire</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <div className="w-8 h-0.5 border-t-2 border-dashed border-slate-400" />
                        <span>Lien secondaire</span>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-muted-foreground">Taille des nœuds</p>
                      <p className="text-xs text-muted-foreground">
                        Proportionnelle au nombre de références (axes) ou liaisons entités (références)
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Graph Area */}
              <div className="lg:col-span-3 space-y-4">
                <Card className="overflow-hidden">
                  <CardHeader className="pb-2 flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="text-base">Graphe des Références</CardTitle>
                      <CardDescription>
                        Cliquez sur un nœud pour voir les détails
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button variant="outline" size="icon" className="h-8 w-8" onClick={handleZoomOut}>
                        <ZoomOut className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" className="h-8 w-8" onClick={handleZoomIn}>
                        <ZoomIn className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" className="h-8 w-8" onClick={handleResetZoom}>
                        <Maximize2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div ref={containerRef} className="relative w-full h-[600px] bg-muted/20">
                      {isLoading ? (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center space-y-3">
                            <RefreshCw className="w-8 h-8 animate-spin mx-auto text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">Chargement du graphe...</p>
                          </div>
                        </div>
                      ) : filteredGraphData.nodes.length === 0 ? (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center space-y-3">
                            <Network className="w-12 h-12 mx-auto text-muted-foreground/50" />
                            <p className="text-sm text-muted-foreground">Aucune donnée à afficher</p>
                            <p className="text-xs text-muted-foreground">Essayez de modifier les filtres</p>
                          </div>
                        </div>
                      ) : (
                        <svg
                          ref={svgRef}
                          width="100%"
                          height="100%"
                          className="cursor-grab active:cursor-grabbing"
                        />
                      )}
                      
                      {/* Zoom indicator */}
                      <div className="absolute bottom-4 left-4 px-2 py-1 rounded bg-background/80 text-xs text-muted-foreground">
                        Zoom: {Math.round(zoomLevel * 100)}%
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Selected Node Details */}
                <AnimatePresence>
                  {selectedNode && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                    >
                      <Card>
                        <CardHeader className="pb-3 flex flex-row items-start justify-between">
                          <div className="flex items-start gap-3">
                            <div 
                              className="w-4 h-4 rounded-full mt-1"
                              style={{ backgroundColor: selectedNode.color }}
                            />
                            <div>
                              <CardTitle className="text-base">
                                {selectedNode.type === 'axis' ? selectedNode.id : selectedNode.name}
                              </CardTitle>
                              <CardDescription>
                                {selectedNode.type === 'axis' 
                                  ? selectedNode.name 
                                  : `${selectedNode.year || 'N/A'} • ${selectedNode.entryType || 'Article'}`
                                }
                              </CardDescription>
                            </div>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => setSelectedNode(null)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </CardHeader>
                        <CardContent>
                          {selectedNode.type === 'axis' ? (
                            <div className="space-y-3">
                              <div className="flex items-center gap-2">
                                <Badge variant="outline">
                                  {META_AXIS_NAMES[selectedNode.metaAxis || 'other']}
                                </Badge>
                                <Badge variant="secondary">
                                  {selectedNode.referenceCount} références
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                Cet axe thématique regroupe les références liées à {selectedNode.name.toLowerCase()}.
                              </p>
                            </div>
                          ) : (
                            <div className="space-y-3">
                              <div className="flex flex-wrap gap-2">
                                {selectedNode.axisPrimaryCode && (
                                  <Badge variant="outline">
                                    Axe: {selectedNode.axisPrimaryCode}
                                  </Badge>
                                )}
                                <Badge variant="secondary">
                                  {selectedNode.entityLinkCount || 0} liaisons entités
                                </Badge>
                              </div>
                              
                              {loadingDetails ? (
                                <div className="space-y-2">
                                  <Skeleton className="h-4 w-full" />
                                  <Skeleton className="h-4 w-3/4" />
                                </div>
                              ) : referenceDetails?.linkedEntities && referenceDetails?.linkedEntities.length > 0 ? (
                                <div className="space-y-2">
                                  <p className="text-xs font-medium text-muted-foreground">Entités liées</p>
                                  <ScrollArea className="h-32">
                                    <div className="space-y-1">
                                      {referenceDetails?.linkedEntities.map((entity, idx) => (
                                        <div 
                                          key={idx}
                                          className="flex items-center justify-between p-2 rounded bg-muted/50 text-sm"
                                        >
                                          <div className="flex items-center gap-2">
                                            <Badge variant="outline" className="text-xs">
                                              {entity.entityType}
                                            </Badge>
                                            <span>{entity.entityName}</span>
                                          </div>
                                          <span className="text-xs text-muted-foreground">
                                            {entity.relevanceScore}%
                                          </span>
                                        </div>
                                      ))}
                                    </div>
                                  </ScrollArea>
                                </div>
                              ) : (
                                <p className="text-sm text-muted-foreground">
                                  Aucune entité liée à cette référence.
                                </p>
                              )}
                              
                              <div className="pt-2">
                                <Link href={`/references/${selectedNode.id.replace('ref-', '')}`}>
                                  <Button variant="outline" size="sm" className="gap-2">
                                    Voir la fiche complète
                                    <ChevronRight className="w-4 h-4" />
                                  </Button>
                                </Link>
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                {/* Top Axes */}
                {stats?.topAxesByReferences && stats?.topAxesByReferences.length > 0 && (
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium">Top Axes par Références</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                        {stats?.topAxesByReferences.slice(0, 5).map((axis, idx) => (
                          <div 
                            key={axis.code}
                            className="p-3 rounded-lg bg-muted/50 text-center cursor-pointer hover:bg-muted transition-colors"
                            onClick={() => {
                              const node = filteredGraphData.nodes.find(n => n.id === axis.code);
                              if (node) setSelectedNode(node);
                            }}
                          >
                            <p className="text-lg font-bold">{axis.count}</p>
                            <p className="text-xs text-muted-foreground truncate">{axis.code}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
