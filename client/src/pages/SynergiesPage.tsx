import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { trpc } from '../lib/trpc';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { 
  Sparkles, Search, Zap, Atom, 
  FlaskConical, TrendingUp, ArrowRight, Layers, Grid3X3, BarChart3,
  Network, Filter, Eye, Info, ChevronDown, ChevronUp,
  Maximize2, Minimize2, Download, RefreshCw, Target, Link2, Ban
} from 'lucide-react';
import { Link } from 'wouter';
import { AnimatedCard, HoverScale, FadeInSection } from '@/components/PageTransition';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import * as d3 from 'd3';

// Types pour le graphe
interface GraphNode {
  id: string;
  name: string;
  type: 'molecule' | 'tabac' | 'famille' | 'synergie';
  group: number;
  size: number;
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
}

interface GraphLink {
  source: string | GraphNode;
  target: string | GraphNode;
  type: string;
  strength: number;
}

// Composant de graphe D3
function SynergyGraph({ 
  synergies, 
  moleculeSynergies,
  width = 800, 
  height = 600,
  onNodeClick
}: { 
  synergies: any[];
  moleculeSynergies: any[];
  width?: number;
  height?: number;
  onNodeClick?: (node: GraphNode) => void;
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);

  useEffect(() => {
    if (!svgRef.current || (!synergies?.length && !moleculeSynergies?.length)) return;

    // Nettoyer le SVG
    d3.select(svgRef.current).selectAll("*").remove();

    // Créer les nœuds et liens
    const nodesMap = new Map<string, GraphNode>();
    const links: GraphLink[] = [];

    // Ajouter les synergies générales
    synergies?.forEach((synergy: any, index: number) => {
      // Nœud de synergie
      const synergyId = `syn-${synergy.id}`;
      nodesMap.set(synergyId, {
        id: synergyId,
        name: synergy.name,
        type: 'synergie',
        group: 0,
        size: 12
      });

      // Nœud molécule
      if (synergy.moleculeId && synergy.moleculeName) {
        const molId = `mol-${synergy.moleculeId}`;
        if (!nodesMap.has(molId)) {
          nodesMap.set(molId, {
            id: molId,
            name: synergy.moleculeName,
            type: 'molecule',
            group: 1,
            size: 8
          });
        }
        links.push({
          source: synergyId,
          target: molId,
          type: synergy.type || 'synergie',
          strength: 0.5
        });
      }

      // Nœud tabac
      if (synergy.tabacId && synergy.tabacName) {
        const tabId = `tab-${synergy.tabacId}`;
        if (!nodesMap.has(tabId)) {
          nodesMap.set(tabId, {
            id: tabId,
            name: synergy.tabacName,
            type: 'tabac',
            group: 2,
            size: 8
          });
        }
        links.push({
          source: synergyId,
          target: tabId,
          type: synergy.type || 'synergie',
          strength: 0.5
        });
      }

      // Nœud famille
      if (synergy.familleId && synergy.familleName) {
        const famId = `fam-${synergy.familleId}`;
        if (!nodesMap.has(famId)) {
          nodesMap.set(famId, {
            id: famId,
            name: synergy.familleName,
            type: 'famille',
            group: 3,
            size: 10
          });
        }
        links.push({
          source: synergyId,
          target: famId,
          type: synergy.type || 'synergie',
          strength: 0.5
        });
      }
    });

    // Ajouter les synergies moléculaires
    moleculeSynergies?.forEach((ms: any) => {
      const mol1Id = `mol-${ms.molecule1Id}`;
      const mol2Id = `mol-${ms.molecule2Id}`;

      if (!nodesMap.has(mol1Id)) {
        nodesMap.set(mol1Id, {
          id: mol1Id,
          name: ms.molecule1Name || `Molécule ${ms.molecule1Id}`,
          type: 'molecule',
          group: 1,
          size: 8
        });
      }

      if (!nodesMap.has(mol2Id)) {
        nodesMap.set(mol2Id, {
          id: mol2Id,
          name: ms.molecule2Name || `Molécule ${ms.molecule2Id}`,
          type: 'molecule',
          group: 1,
          size: 8
        });
      }

      links.push({
        source: mol1Id,
        target: mol2Id,
        type: ms.type || 'synergie',
        strength: 0.7
      });
    });

    const nodes = Array.from(nodesMap.values());

    // Configuration du SVG
    const svg = d3.select(svgRef.current)
      .attr("viewBox", [0, 0, width, height])
      .attr("style", "max-width: 100%; height: auto;");

    // Groupe principal pour le zoom
    const g = svg.append("g");

    // Zoom
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.2, 4])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
        setZoomLevel(event.transform.k);
      });

    svg.call(zoom);

    // Couleurs par type
    const colorScale = d3.scaleOrdinal<string>()
      .domain(['synergie', 'molecule', 'tabac', 'famille'])
      .range(['#8b5cf6', '#3b82f6', '#f59e0b', '#10b981']);

    // Couleurs des liens par type
    const linkColorScale = d3.scaleOrdinal<string>()
      .domain(['potentialisation', 'stabilisation', 'transformation', 'masquage', 'synergie'])
      .range(['#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#6b7280']);

    // Simulation de force
    const simulation = d3.forceSimulation(nodes as d3.SimulationNodeDatum[])
      .force("link", d3.forceLink(links)
        .id((d: any) => d.id)
        .distance(80)
        .strength((d: any) => d.strength))
      .force("charge", d3.forceManyBody().strength(-200))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(30));

    // Liens
    const link = g.append("g")
      .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke", (d: any) => linkColorScale(d.type))
      .attr("stroke-width", 2)
      .attr("stroke-dasharray", (d: any) => d.type === 'masquage' ? "4,4" : "none");

    // Nœuds
    const node = g.append("g")
      .selectAll("g")
      .data(nodes)
      .join("g")
      .attr("cursor", "pointer")
      .call(d3.drag<SVGGElement, GraphNode>()
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

    // Cercles des nœuds
    node.append("circle")
      .attr("r", (d: GraphNode) => d.size)
      .attr("fill", (d: GraphNode) => colorScale(d.type))
      .attr("stroke", "#fff")
      .attr("stroke-width", 2)
      .on("click", (event, d: GraphNode) => {
        setSelectedNode(d);
        onNodeClick?.(d);
      })
      .on("mouseover", function(event, d: GraphNode) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr("r", d.size * 1.3);
      })
      .on("mouseout", function(event, d: GraphNode) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr("r", d.size);
      });

    // Labels des nœuds
    node.append("text")
      .text((d: GraphNode) => d.name.length > 15 ? d.name.substring(0, 15) + '...' : d.name)
      .attr("x", 0)
      .attr("y", (d: GraphNode) => d.size + 12)
      .attr("text-anchor", "middle")
      .attr("font-size", "10px")
      .attr("fill", "currentColor")
      .attr("class", "text-foreground");

    // Mise à jour de la simulation
    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      node.attr("transform", (d: any) => `translate(${d.x},${d.y})`);
    });

    // Cleanup
    return () => {
      simulation.stop();
    };
  }, [synergies, moleculeSynergies, width, height, onNodeClick]);

  return (
    <div className="relative">
      <svg ref={svgRef} className="w-full h-full bg-muted/20 rounded-lg" />
      
      {/* Légende */}
      <div className="absolute bottom-4 left-4 p-3 bg-background/90 backdrop-blur-sm rounded-lg border border-border/50 text-xs">
        <div className="font-medium mb-2">Légende</div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-violet-500" />
            <span>Synergie</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <span>Molécule</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-500" />
            <span>Tabac</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500" />
            <span>Famille</span>
          </div>
        </div>
      </div>

      {/* Contrôles de zoom */}
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <Badge variant="outline" className="bg-background/90 backdrop-blur-sm">
          Zoom: {(zoomLevel * 100).toFixed(0)}%
        </Badge>
      </div>

      {/* Info nœud sélectionné */}
      {selectedNode && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-4 left-4 p-3 bg-background/90 backdrop-blur-sm rounded-lg border border-border/50 max-w-xs"
        >
          <div className="flex items-center gap-2 mb-1">
            <div className={`w-3 h-3 rounded-full ${
              selectedNode.type === 'synergie' ? 'bg-violet-500' :
              selectedNode.type === 'molecule' ? 'bg-blue-500' :
              selectedNode.type === 'tabac' ? 'bg-amber-500' : 'bg-emerald-500'
            }`} />
            <span className="font-medium text-sm">{selectedNode.name}</span>
          </div>
          <Badge variant="outline" className="text-xs capitalize">{selectedNode.type}</Badge>
        </motion.div>
      )}
    </div>
  );
}

export default function Synergies() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'cards' | 'graph' | 'table'>('cards');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedSynergy, setSelectedSynergy] = useState<any>(null);
  const [graphFullscreen, setGraphFullscreen] = useState(false);
  
  const { data: synergies, isLoading, error } = trpc.synergies?.list.useQuery();
  const { data: moleculeSynergies } = trpc.synergies?.getAllMoleculeSynergies.useQuery();
  const { data: stats } = trpc.synergies?.getStats.useQuery();

  const types = useMemo(() => {
    if (!synergies) return [];
    const uniqueTypes = new Set(synergies?.map((s: any) => s.type).filter(Boolean));
    return Array.from(uniqueTypes) as string[];
  }, [synergies]);

  const filteredSynergies = useMemo(() => {
    if (!synergies) return [];
    return synergies?.filter((synergy: any) => {
      const matchesSearch = !searchQuery || 
        synergy.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        synergy.effet?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        synergy.moleculeName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        synergy.tabacName?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = selectedType === 'all' || synergy.type === selectedType;
      return matchesSearch && matchesType;
    });
  }, [synergies, searchQuery, selectedType]);

  const statsData = useMemo(() => {
    if (!synergies) return { total: 0, byType: {} as Record<string, number> };
    const byType: Record<string, number> = {};
    synergies?.forEach((s: any) => {
      if (s.type) {
        byType[s.type] = (byType[s.type] || 0) + 1;
      }
    });
    return { total: synergies?.length, byType };
  }, [synergies]);

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'potentialisation': 'bg-violet-500/10 text-violet-700 dark:text-violet-400 border-violet-500/30',
      'stabilisation': 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30',
      'transformation': 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30',
      'masquage': 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/30',
      'neutralisation': 'bg-slate-500/10 text-slate-700 dark:text-slate-400 border-slate-500/30',
    };
    return colors[type?.toLowerCase()] || 'bg-muted text-muted-foreground border-border';
  };

  const getTypeIcon = (type: string) => {
    const icons: Record<string, React.ReactNode> = {
      'potentialisation': <Zap className="w-4 h-4" />,
      'stabilisation': <Target className="w-4 h-4" />,
      'transformation': <TrendingUp className="w-4 h-4" />,
      'masquage': <Eye className="w-4 h-4" />,
      'neutralisation': <Ban className="w-4 h-4" />,
    };
    return icons[type?.toLowerCase()] || <Sparkles className="w-4 h-4" />;
  };

  const getTypeDescription = (type: string) => {
    const descriptions: Record<string, string> = {
      'potentialisation': 'Amplification mutuelle des effets olfactifs',
      'stabilisation': 'Fixation et prolongation de la tenue',
      'transformation': 'Modification du profil olfactif',
      'masquage': 'Atténuation ou dissimulation de notes',
      'neutralisation': 'Annulation mutuelle des perceptions olfactives',
    };
    return descriptions[type?.toLowerCase()] || 'Interaction moléculaire';
  };

  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Breadcrumbs />
        <Header />
        <main className="flex-1 container py-8">
          <Card className="border-destructive/50 bg-destructive/5">
            <CardContent className="py-8 text-center">
              <p className="text-destructive">Erreur: {error.message}</p>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Breadcrumbs />
        <Header />
        <main className="flex-1 container py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-40 bg-muted rounded-lg"></div>
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Breadcrumbs />
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-16 md:py-20 border-b border-border/50 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background" />
          
          <div className="container relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl mx-auto text-center"
            >
              <Badge variant="outline" className="mb-6 px-4 py-1.5 text-sm font-medium border-primary/20 bg-primary/5 text-primary">
                <Sparkles className="w-4 h-4 mr-2" />
                Interactions Moléculaires
              </Badge>
              
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-foreground">
                Synergies Moléculaires
              </h1>
              
              <p className="text-lg text-muted-foreground mb-8">
                Explorez les interactions entre molécules olfactives. Découvrez comment les terpènes 
                et autres composés se potentialisent, se modulent ou se complètent.
              </p>
              
              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-2xl mx-auto">
                <div className="bg-muted/50 rounded-lg p-3 border border-border/50">
                  <div className="text-2xl font-bold text-foreground">{statsData.total}</div>
                  <div className="text-xs text-muted-foreground">Synergies</div>
                </div>
                <div className="bg-muted/50 rounded-lg p-3 border border-border/50">
                  <div className="text-2xl font-bold text-foreground">{moleculeSynergies?.length || 0}</div>
                  <div className="text-xs text-muted-foreground">Mol. Synergies</div>
                </div>
                <div className="bg-muted/50 rounded-lg p-3 border border-border/50">
                  <div className="text-2xl font-bold text-foreground">{types.length}</div>
                  <div className="text-xs text-muted-foreground">Types</div>
                </div>
                <div className="bg-muted/50 rounded-lg p-3 border border-border/50">
                  <div className="text-2xl font-bold text-foreground">{filteredSynergies.length}</div>
                  <div className="text-xs text-muted-foreground">Affichées</div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <div className="container py-8">
          {/* Types de synergies */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Layers className="w-5 h-5 text-primary" />
              Types de Synergies
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {[
                { type: 'potentialisation', icon: Zap, color: 'violet', count: statsData.byType['potentialisation'] || 0 },
                { type: 'stabilisation', icon: Target, color: 'emerald', count: statsData.byType['stabilisation'] || 0 },
                { type: 'transformation', icon: TrendingUp, color: 'amber', count: statsData.byType['transformation'] || 0 },
                { type: 'masquage', icon: Eye, color: 'rose', count: statsData.byType['masquage'] || 0 },
                { type: 'neutralisation', icon: Ban, color: 'slate', count: statsData.byType['neutralisation'] || 0 },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <Card 
                    key={item.type}
                    className={`border-${item.color}-500/30 bg-${item.color}-500/5 cursor-pointer hover:shadow-md transition-all ${selectedType === item.type ? 'ring-2 ring-primary' : ''}`}
                    onClick={() => setSelectedType(selectedType === item.type ? 'all' : item.type)}
                  >
                    <CardContent className="pt-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg bg-${item.color}-500/10 flex items-center justify-center`}>
                          <Icon className={`w-5 h-5 text-${item.color}-500`} />
                        </div>
                        <div>
                          <div className="font-medium capitalize">{item.type}</div>
                          <div className="text-sm text-muted-foreground">{item.count} synergies</div>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-3">
                        {getTypeDescription(item.type)}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </motion.div>

          {/* Filtres et contrôles */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col md:flex-row gap-4 mb-6"
          >
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher une synergie, molécule, tabac..."
                className="pl-9 bg-background"
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              {/* Sélecteur de type */}
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-[180px] bg-background">
                  <SelectValue placeholder="Type de synergie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les types</SelectItem>
                  {types.map((type) => (
                    <SelectItem key={type} value={type} className="capitalize">
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Mode de vue */}
              <div className="flex rounded-lg border border-border/50 overflow-hidden">
                <Button
                  variant={viewMode === 'cards' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('cards')}
                  className="rounded-none"
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'graph' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('graph')}
                  className="rounded-none"
                >
                  <Network className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'table' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('table')}
                  className="rounded-none"
                >
                  <BarChart3 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Results count */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mb-6 text-sm text-muted-foreground"
          >
            {filteredSynergies.length} {filteredSynergies.length === 1 ? 'synergie trouvée' : 'synergies trouvées'}
            {selectedType !== 'all' && ` (filtre: ${selectedType})`}
          </motion.div>

          {/* Contenu principal */}
          <AnimatePresence mode="wait">
            {viewMode === 'cards' && (
              <motion.div
                key="cards"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              >
                {filteredSynergies.length === 0 ? (
                  <Card className="col-span-full border-border/50">
                    <CardContent className="py-12 text-center">
                      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                        <Sparkles className="w-8 h-8 text-muted-foreground" />
                      </div>
                      <p className="text-foreground font-medium">Aucune synergie trouvée</p>
                      <p className="text-sm text-muted-foreground mt-1">Essayez de modifier vos critères de recherche</p>
                    </CardContent>
                  </Card>
                ) : (
                  filteredSynergies.map((synergy: any, index: number) => (
                    <motion.div
                      key={synergy.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.02 }}
                    >
                      <Dialog>
                        <DialogTrigger asChild>
                          <Card className="h-full border-border/50 hover:border-primary/40 hover:shadow-lg transition-all duration-200 cursor-pointer">
                            <CardHeader className="pb-3">
                              <div className="flex items-start justify-between gap-2">
                                <CardTitle className="text-base flex items-center gap-2">
                                  {getTypeIcon(synergy.type)}
                                  {synergy.name}
                                </CardTitle>
                                {synergy.type && (
                                  <Badge variant="outline" className={`text-xs ${getTypeColor(synergy.type)}`}>
                                    {synergy.type}
                                  </Badge>
                                )}
                              </div>
                            </CardHeader>
                            <CardContent>
                              {synergy.effet && (
                                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                                  {synergy.effet}
                                </p>
                              )}
                              
                              {/* Entités liées */}
                              <div className="mt-3 pt-3 border-t border-border/50 space-y-2">
                                {synergy.moleculeName && (
                                  <div className="flex items-center gap-2 text-xs">
                                    <Atom className="w-3 h-3 text-blue-500" />
                                    <span className="text-muted-foreground">Molécule:</span>
                                    <Badge variant="secondary" className="text-xs font-normal">
                                      {synergy.moleculeName}
                                    </Badge>
                                  </div>
                                )}
                                {synergy.tabacName && (
                                  <div className="flex items-center gap-2 text-xs">
                                    <FlaskConical className="w-3 h-3 text-amber-500" />
                                    <span className="text-muted-foreground">Tabac:</span>
                                    <Badge variant="secondary" className="text-xs font-normal">
                                      {synergy.tabacName}
                                    </Badge>
                                  </div>
                                )}
                                {synergy.familleName && (
                                  <div className="flex items-center gap-2 text-xs">
                                    <Layers className="w-3 h-3 text-emerald-500" />
                                    <span className="text-muted-foreground">Famille:</span>
                                    <Badge variant="secondary" className="text-xs font-normal">
                                      {synergy.familleName}
                                    </Badge>
                                  </div>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                              {getTypeIcon(synergy.type)}
                              {synergy.name}
                            </DialogTitle>
                            <DialogDescription>
                              <Badge variant="outline" className={`${getTypeColor(synergy.type)}`}>
                                {synergy.type}
                              </Badge>
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            {synergy.effet && (
                              <div>
                                <h4 className="font-medium mb-2">Effet</h4>
                                <p className="text-muted-foreground">{synergy.effet}</p>
                              </div>
                            )}
                            {synergy.notes && (
                              <div>
                                <h4 className="font-medium mb-2">Notes techniques</h4>
                                <p className="text-muted-foreground">{synergy.notes}</p>
                              </div>
                            )}
                            <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                              {synergy.moleculeName && (
                                <div className="text-center p-3 bg-blue-500/5 rounded-lg border border-blue-500/20">
                                  <Atom className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                                  <div className="text-sm font-medium">{synergy.moleculeName}</div>
                                  <div className="text-xs text-muted-foreground">Molécule</div>
                                </div>
                              )}
                              {synergy.tabacName && (
                                <Link href={synergy.tabacId ? `/tabac/${synergy.tabacId}` : '/tabacotheque'}>
                                  <div className="text-center p-3 bg-amber-500/5 rounded-lg border border-amber-500/20 hover:border-amber-500/50 hover:bg-amber-500/10 transition-colors cursor-pointer">
                                    <FlaskConical className="w-6 h-6 text-amber-500 mx-auto mb-2" />
                                    <div className="text-sm font-medium">{synergy.tabacName}</div>
                                    <div className="text-xs text-muted-foreground">Tabac → fiche</div>
                                  </div>
                                </Link>
                              )}
                              {synergy.familleName && (
                                <div className="text-center p-3 bg-emerald-500/5 rounded-lg border border-emerald-500/20">
                                  <Layers className="w-6 h-6 text-emerald-500 mx-auto mb-2" />
                                  <div className="text-sm font-medium">{synergy.familleName}</div>
                                  <div className="text-xs text-muted-foreground">Famille</div>
                                </div>
                              )}
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </motion.div>
                  ))
                )}
              </motion.div>
            )}

            {viewMode === 'graph' && (
              <motion.div
                key="graph"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Card className="border-border/50">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Network className="w-5 h-5 text-primary" />
                        Graphe des Synergies
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon" onClick={() => setGraphFullscreen(!graphFullscreen)}>
                                {graphFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>{graphFullscreen ? 'Réduire' : 'Agrandir'}</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>
                    <CardDescription>
                      Visualisation interactive des relations entre molécules, tabacs et familles olfactives
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className={graphFullscreen ? "h-[80vh]" : "h-[500px]"}>
                      <SynergyGraph 
                        synergies={filteredSynergies} 
                        moleculeSynergies={moleculeSynergies || []}
                        width={graphFullscreen ? 1200 : 800}
                        height={graphFullscreen ? 800 : 500}
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {viewMode === 'table' && (
              <motion.div
                key="table"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Card className="border-border/50">
                  <CardContent className="pt-6">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-border/50">
                            <th className="text-left p-3 font-medium">Nom</th>
                            <th className="text-left p-3 font-medium">Type</th>
                            <th className="text-left p-3 font-medium">Molécule</th>
                            <th className="text-left p-3 font-medium">Tabac</th>
                            <th className="text-left p-3 font-medium">Famille</th>
                            <th className="text-left p-3 font-medium">Effet</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredSynergies.map((synergy: any) => (
                            <tr key={synergy.id} className="border-b border-border/30 hover:bg-muted/50">
                              <td className="p-3 font-medium">{synergy.name}</td>
                              <td className="p-3">
                                <Badge variant="outline" className={`text-xs ${getTypeColor(synergy.type)}`}>
                                  {synergy.type}
                                </Badge>
                              </td>
                              <td className="p-3 text-muted-foreground">{synergy.moleculeName || '-'}</td>
                              <td className="p-3 text-muted-foreground">{synergy.tabacName || '-'}</td>
                              <td className="p-3 text-muted-foreground">{synergy.familleName || '-'}</td>
                              <td className="p-3 text-muted-foreground max-w-xs truncate">{synergy.effet || '-'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation vers pages connexes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-12"
          >
            <Card className="border-border/50 bg-muted/30">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Layers className="w-5 h-5 text-primary" />
                  Outils de visualisation
                </CardTitle>
                <CardDescription>Explorez les synergies sous différents angles</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Link href="/synergies-heatmap">
                    <HoverScale scale={1.03}>
                      <div className="group p-4 bg-background rounded-lg border border-border/50 hover:border-primary/40 hover:shadow-md transition-all cursor-pointer">
                        <div className="font-medium flex items-center gap-2 mb-1">
                          <BarChart3 className="w-4 h-4 text-primary" />
                          Heatmap Synergies
                          <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all ml-auto" />
                        </div>
                        <div className="text-sm text-muted-foreground">Matrice visuelle des interactions</div>
                      </div>
                    </HoverScale>
                  </Link>
                  <Link href="/matrice-synergies">
                    <HoverScale scale={1.03}>
                      <div className="group p-4 bg-background rounded-lg border border-border/50 hover:border-primary/40 hover:shadow-md transition-all cursor-pointer">
                        <div className="font-medium flex items-center gap-2 mb-1">
                          <Grid3X3 className="w-4 h-4 text-primary" />
                          Matrice Interactive
                          <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all ml-auto" />
                        </div>
                        <div className="text-sm text-muted-foreground">Explorer les combinaisons</div>
                      </div>
                    </HoverScale>
                  </Link>
                  <Link href="/suggestions-synergies">
                    <HoverScale scale={1.03}>
                      <div className="group p-4 bg-background rounded-lg border border-border/50 hover:border-primary/40 hover:shadow-md transition-all cursor-pointer">
                        <div className="font-medium flex items-center gap-2 mb-1">
                          <Sparkles className="w-4 h-4 text-primary" />
                          Suggestions
                          <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all ml-auto" />
                        </div>
                        <div className="text-sm text-muted-foreground">Recommandations de synergies</div>
                      </div>
                    </HoverScale>
                  </Link>
                  <Link href="/molecules">
                    <HoverScale scale={1.03}>
                      <div className="group p-4 bg-background rounded-lg border border-border/50 hover:border-primary/40 hover:shadow-md transition-all cursor-pointer">
                        <div className="font-medium flex items-center gap-2 mb-1">
                          <Atom className="w-4 h-4 text-primary" />
                          Molécules
                          <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all ml-auto" />
                        </div>
                        <div className="text-sm text-muted-foreground">Base de données moléculaire</div>
                      </div>
                    </HoverScale>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
