import { useCallback, useEffect, useRef, useState, useMemo } from 'react';
import ForceGraph2D, { ForceGraphMethods, NodeObject, LinkObject } from 'react-force-graph-2d';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Filter, 
  Download,
  Info,
  X,
  MapPin,
  BookOpen,
  Leaf,
  FlaskConical,
  Route
} from 'lucide-react';

// Types pour le graphe
interface GraphNode extends NodeObject {
  id: string;
  name: string;
  type: 'plant' | 'molecule' | 'route' | 'manuscript' | 'civilization' | 'technique';
  group: number;
  val: number;
  color?: string;
  description?: string;
  metadata?: Record<string, unknown>;
}

interface GraphLink extends LinkObject {
  source: string | GraphNode;
  target: string | GraphNode;
  type: string;
  weight: number;
  confidence: number;
  notes?: string;
}

interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

// Couleurs par type de nœud
const NODE_COLORS: Record<string, string> = {
  plant: '#22c55e',       // Vert
  molecule: '#3b82f6',    // Bleu
  route: '#f59e0b',       // Orange
  manuscript: '#8b5cf6',  // Violet
  civilization: '#ef4444', // Rouge
  technique: '#06b6d4',   // Cyan
};

// Icônes par type
const NODE_ICONS: Record<string, React.ReactNode> = {
  plant: <Leaf className="h-4 w-4" />,
  molecule: <FlaskConical className="h-4 w-4" />,
  route: <Route className="h-4 w-4" />,
  manuscript: <BookOpen className="h-4 w-4" />,
  civilization: <MapPin className="h-4 w-4" />,
  technique: <FlaskConical className="h-4 w-4" />,
};

// Labels en français
const TYPE_LABELS: Record<string, string> = {
  plant: 'Plante',
  molecule: 'Molécule',
  route: 'Route commerciale',
  manuscript: 'Manuscrit',
  civilization: 'Civilisation',
  technique: 'Technique',
};

interface ResearchGraphProps {
  data: GraphData;
  width?: number;
  height?: number;
  onNodeClick?: (node: GraphNode) => void;
  className?: string;
}

export function ResearchGraph({ 
  data, 
  width = 800, 
  height = 600,
  onNodeClick,
  className = ''
}: ResearchGraphProps) {
  const graphRef = useRef<ForceGraphMethods<GraphNode, GraphLink>>();
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null);
  const [activeFilters, setActiveFilters] = useState<Set<string>>(new Set());
  const [showFilters, setShowFilters] = useState(false);
  const [dimensions, setDimensions] = useState({ width, height });
  const containerRef = useRef<HTMLDivElement>(null);

  // Filtrer les données selon les filtres actifs
  const filteredData = useMemo(() => {
    if (activeFilters.size === 0) return data;
    
    const filteredNodes = data.nodes.filter(node => activeFilters.has(node.type));
    const nodeIds = new Set(filteredNodes.map(n => n.id));
    const filteredLinks = data.links.filter(link => {
      const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
      const targetId = typeof link.target === 'object' ? link.target.id : link.target;
      return nodeIds.has(sourceId as string) && nodeIds.has(targetId as string);
    });
    
    return { nodes: filteredNodes, links: filteredLinks };
  }, [data, activeFilters]);

  // Gérer le redimensionnement
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setDimensions({ width: rect.width, height: Math.max(400, rect.height) });
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Dessiner les nœuds personnalisés
  const nodeCanvasObject = useCallback((node: GraphNode, ctx: CanvasRenderingContext2D, globalScale: number) => {
    const label = node.name;
    const fontSize = 12 / globalScale;
    ctx.font = `${fontSize}px Inter, sans-serif`;
    
    const nodeSize = Math.sqrt(node.val || 5) * 4;
    const color = NODE_COLORS[node.type] || '#888';
    
    // Dessiner le cercle du nœud
    ctx.beginPath();
    ctx.arc(node.x!, node.y!, nodeSize, 0, 2 * Math.PI);
    ctx.fillStyle = hoveredNode?.id === node.id || selectedNode?.id === node.id 
      ? color 
      : `${color}cc`;
    ctx.fill();
    
    // Bordure pour le nœud sélectionné
    if (selectedNode?.id === node.id) {
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2 / globalScale;
      ctx.stroke();
    }
    
    // Dessiner le label
    if (globalScale > 0.5) {
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#fff';
      
      // Fond du texte
      const textWidth = ctx.measureText(label).width;
      const padding = 4 / globalScale;
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(
        node.x! - textWidth / 2 - padding,
        node.y! + nodeSize + 2,
        textWidth + padding * 2,
        fontSize + padding
      );
      
      ctx.fillStyle = '#fff';
      ctx.fillText(label, node.x!, node.y! + nodeSize + fontSize / 2 + 4);
    }
  }, [hoveredNode, selectedNode]);

  // Dessiner les liens personnalisés
  const linkCanvasObject = useCallback((link: GraphLink, ctx: CanvasRenderingContext2D, globalScale: number) => {
    const source = link.source as GraphNode;
    const target = link.target as GraphNode;
    
    if (!source.x || !source.y || !target.x || !target.y) return;
    
    const lineWidth = Math.max(0.5, (link.weight || 1) * 2) / globalScale;
    const opacity = link.confidence || 0.5;
    
    ctx.beginPath();
    ctx.moveTo(source.x, source.y);
    ctx.lineTo(target.x, target.y);
    ctx.strokeStyle = `rgba(156, 163, 175, ${opacity})`;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
  }, []);

  // Gérer le clic sur un nœud
  const handleNodeClick = useCallback((node: GraphNode) => {
    setSelectedNode(node);
    onNodeClick?.(node);
    
    // Centrer la vue sur le nœud
    graphRef.current?.centerAt(node.x!, node.y!, 500);
    graphRef.current?.zoom(2, 500);
  }, [onNodeClick]);

  // Contrôles de zoom
  const handleZoomIn = () => graphRef.current?.zoom(graphRef.current.zoom() * 1.5, 300);
  const handleZoomOut = () => graphRef.current?.zoom(graphRef.current.zoom() / 1.5, 300);
  const handleFit = () => graphRef.current?.zoomToFit(400);

  // Toggle filtre
  const toggleFilter = (type: string) => {
    const newFilters = new Set(activeFilters);
    if (newFilters.has(type)) {
      newFilters.delete(type);
    } else {
      newFilters.add(type);
    }
    setActiveFilters(newFilters);
  };

  // Exporter le graphe en image
  const handleExport = () => {
    const canvas = document.querySelector('canvas');
    if (canvas) {
      const link = document.createElement('a');
      link.download = 'perfumum-research-graph.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    }
  };

  // Statistiques du graphe
  const stats = useMemo(() => {
    const typeCount: Record<string, number> = {};
    filteredData.nodes.forEach(node => {
      typeCount[node.type] = (typeCount[node.type] || 0) + 1;
    });
    return {
      nodes: filteredData.nodes.length,
      links: filteredData.links.length,
      byType: typeCount,
    };
  }, [filteredData]);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Barre d'outils */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        <div className="flex gap-1 bg-background/90 backdrop-blur rounded-lg p-1 shadow-lg border">
          <Button variant="ghost" size="icon" onClick={handleZoomIn} title="Zoom avant">
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleZoomOut} title="Zoom arrière">
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleFit} title="Ajuster à la vue">
            <Maximize2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setShowFilters(!showFilters)} title="Filtres">
            <Filter className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleExport} title="Exporter en image">
            <Download className="h-4 w-4" />
          </Button>
        </div>

        {/* Panneau de filtres */}
        {showFilters && (
          <Card className="w-64 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Filtrer par type</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {Object.entries(TYPE_LABELS).map(([type, label]) => (
                <Button
                  key={type}
                  variant={activeFilters.size === 0 || activeFilters.has(type) ? 'default' : 'outline'}
                  size="sm"
                  className="w-full justify-start gap-2"
                  style={{ 
                    backgroundColor: activeFilters.size === 0 || activeFilters.has(type) 
                      ? NODE_COLORS[type] 
                      : undefined 
                  }}
                  onClick={() => toggleFilter(type)}
                >
                  {NODE_ICONS[type]}
                  {label}
                  <Badge variant="secondary" className="ml-auto">
                    {stats.byType[type] || 0}
                  </Badge>
                </Button>
              ))}
              {activeFilters.size > 0 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full"
                  onClick={() => setActiveFilters(new Set())}
                >
                  Réinitialiser les filtres
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Statistiques */}
      <div className="absolute top-4 right-4 z-10">
        <Card className="bg-background/90 backdrop-blur shadow-lg">
          <CardContent className="p-3">
            <div className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">{stats.nodes}</span> nœuds · 
              <span className="font-medium text-foreground ml-1">{stats.links}</span> connexions
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Panneau d'information du nœud sélectionné */}
      {selectedNode && (
        <div className="absolute bottom-4 left-4 right-4 z-10">
          <Card className="bg-background/95 backdrop-blur shadow-lg max-w-md">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: NODE_COLORS[selectedNode.type] }}
                  />
                  <CardTitle className="text-base">{selectedNode.name}</CardTitle>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6"
                  onClick={() => setSelectedNode(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <CardDescription className="flex items-center gap-1">
                {NODE_ICONS[selectedNode.type]}
                {TYPE_LABELS[selectedNode.type]}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedNode.description && (
                <p className="text-sm text-muted-foreground mb-2">{selectedNode.description}</p>
              )}
              {selectedNode.metadata && (
                <div className="text-xs space-y-1">
                  {Object.entries(selectedNode.metadata).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-muted-foreground">{key}:</span>
                      <span>{String(value)}</span>
                    </div>
                  ))}
                </div>
              )}
              {/* Connexions du nœud */}
              <div className="mt-3 pt-3 border-t">
                <p className="text-xs text-muted-foreground mb-2">Connexions:</p>
                <div className="flex flex-wrap gap-1">
                  {filteredData.links
                    .filter(link => {
                      const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
                      const targetId = typeof link.target === 'object' ? link.target.id : link.target;
                      return sourceId === selectedNode.id || targetId === selectedNode.id;
                    })
                    .slice(0, 5)
                    .map((link, i) => {
                      const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
                      const targetId = typeof link.target === 'object' ? link.target.id : link.target;
                      const connectedId = sourceId === selectedNode.id ? targetId : sourceId;
                      const connectedNode = filteredData.nodes.find(n => n.id === connectedId);
                      return connectedNode ? (
                        <Badge 
                          key={i} 
                          variant="outline" 
                          className="text-xs cursor-pointer hover:bg-accent"
                          style={{ borderColor: NODE_COLORS[connectedNode.type] }}
                          onClick={() => handleNodeClick(connectedNode)}
                        >
                          {connectedNode.name}
                        </Badge>
                      ) : null;
                    })}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Légende */}
      <div className="absolute bottom-4 right-4 z-10">
        <Card className="bg-background/90 backdrop-blur shadow-lg">
          <CardContent className="p-3">
            <p className="text-xs font-medium mb-2">Légende</p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1">
              {Object.entries(TYPE_LABELS).map(([type, label]) => (
                <div key={type} className="flex items-center gap-1.5 text-xs">
                  <div 
                    className="w-2.5 h-2.5 rounded-full" 
                    style={{ backgroundColor: NODE_COLORS[type] }}
                  />
                  <span className="text-muted-foreground">{label}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Graphe */}
      <ForceGraph2D
        ref={graphRef}
        graphData={filteredData}
        width={dimensions.width}
        height={dimensions.height}
        nodeCanvasObject={nodeCanvasObject}
        linkCanvasObject={linkCanvasObject}
        nodeRelSize={6}
        linkDirectionalParticles={2}
        linkDirectionalParticleWidth={2}
        onNodeClick={handleNodeClick}
        onNodeHover={setHoveredNode}
        cooldownTicks={100}
        d3AlphaDecay={0.02}
        d3VelocityDecay={0.3}
        backgroundColor="transparent"
      />
    </div>
  );
}

export default ResearchGraph;
