import { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Loader2, ZoomIn, ZoomOut, Maximize2, Filter, Info, X, Target, ExternalLink } from 'lucide-react';
import { trpc } from '@/lib/trpc';

// Types pour le graphe
interface GraphNode {
  id: number;
  entryKey: string;
  title: string;
  authors: string | null;
  year: number | null;
  entryType: string | null;
  researchDomain: string | null;
  inDegree: number;
  outDegree: number;
  // Propriétés pour la visualisation
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  fx?: number | null;
  fy?: number | null;
}

interface GraphLink {
  id: number;
  source: number | GraphNode;
  target: number | GraphNode;
  citationType: string | null;
  weight: number;
  verified: boolean | null;
}

interface CitationGraphProps {
  nodes: GraphNode[];
  links: GraphLink[];
  isLoading?: boolean;
  onNodeClick?: (node: GraphNode) => void;
  onLinkClick?: (link: GraphLink) => void;
  filters?: {
    citationType?: string;
    researchDomain?: string;
    minWeight?: number;
    verified?: boolean;
  };
  onFiltersChange?: (filters: any) => void;
}

// Couleurs par type de citation
const CITATION_TYPE_COLORS: Record<string, string> = {
  direct: '#3b82f6',       // blue
  indirect: '#8b5cf6',     // violet
  methodological: '#10b981', // emerald
  theoretical: '#f59e0b',  // amber
  data: '#06b6d4',         // cyan
  critique: '#ef4444',     // red
  support: '#22c55e',      // green
  comparison: '#ec4899',   // pink
};

// Couleurs par domaine de recherche
const DOMAIN_COLORS: Record<string, string> = {
  chimie_parfum: '#f97316',
  botanique: '#22c55e',
  ethnobotanique: '#8b5cf6',
  histoire_parfumerie: '#eab308',
  methodologie: '#3b82f6',
  extraction: '#06b6d4',
  formulation: '#ec4899',
  reglementation: '#ef4444',
  autre: '#6b7280',
};

// Couleurs par type d'entrée
const ENTRY_TYPE_COLORS: Record<string, string> = {
  article: '#3b82f6',
  book: '#8b5cf6',
  thesis: '#f59e0b',
  conference: '#10b981',
  online: '#06b6d4',
  patent: '#ef4444',
  misc: '#6b7280',
};

export function CitationGraph({
  nodes,
  links,
  isLoading = false,
  onNodeClick,
  onLinkClick,
  filters,
  onFiltersChange,
}: CitationGraphProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [colorBy, setColorBy] = useState<'domain' | 'type' | 'degree'>('domain');
  const [nodePositions, setNodePositions] = useState<Map<number, { x: number; y: number }>>(new Map());
  
  // Initialiser les positions des nœuds avec une disposition en force
  useEffect(() => {
    if (nodes.length === 0) return;
    
    const positions = new Map<number, { x: number; y: number }>();
    const centerX = dimensions.width / 2;
    const centerY = dimensions.height / 2;
    
    // Disposition initiale en cercle
    nodes.forEach((node, i) => {
      const angle = (2 * Math.PI * i) / nodes.length;
      const radius = Math.min(dimensions.width, dimensions.height) * 0.35;
      positions.set(node.id, {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
      });
    });
    
    // Simulation de force simple
    const iterations = 100;
    const repulsion = 5000;
    const attraction = 0.01;
    const damping = 0.9;
    
    const velocities = new Map<number, { vx: number; vy: number }>();
    nodes.forEach(node => velocities.set(node.id, { vx: 0, vy: 0 }));
    
    for (let iter = 0; iter < iterations; iter++) {
      // Répulsion entre tous les nœuds
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const pos1 = positions.get(nodes[i].id)!;
          const pos2 = positions.get(nodes[j].id)!;
          const dx = pos2.x - pos1.x;
          const dy = pos2.y - pos1.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const force = repulsion / (dist * dist);
          const fx = (dx / dist) * force;
          const fy = (dy / dist) * force;
          
          const vel1 = velocities.get(nodes[i].id)!;
          const vel2 = velocities.get(nodes[j].id)!;
          vel1.vx -= fx;
          vel1.vy -= fy;
          vel2.vx += fx;
          vel2.vy += fy;
        }
      }
      
      // Attraction le long des liens
      links.forEach(link => {
        const sourceId = typeof link.source === 'number' ? link.source : link.source.id;
        const targetId = typeof link.target === 'number' ? link.target : link.target.id;
        const pos1 = positions.get(sourceId);
        const pos2 = positions.get(targetId);
        if (!pos1 || !pos2) return;
        
        const dx = pos2.x - pos1.x;
        const dy = pos2.y - pos1.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const force = dist * attraction * (link.weight || 1);
        const fx = (dx / dist) * force;
        const fy = (dy / dist) * force;
        
        const vel1 = velocities.get(sourceId);
        const vel2 = velocities.get(targetId);
        if (vel1 && vel2) {
          vel1.vx += fx;
          vel1.vy += fy;
          vel2.vx -= fx;
          vel2.vy -= fy;
        }
      });
      
      // Appliquer les vélocités
      nodes.forEach(node => {
        const pos = positions.get(node.id)!;
        const vel = velocities.get(node.id)!;
        pos.x += vel.vx;
        pos.y += vel.vy;
        vel.vx *= damping;
        vel.vy *= damping;
        
        // Garder dans les limites
        pos.x = Math.max(50, Math.min(dimensions.width - 50, pos.x));
        pos.y = Math.max(50, Math.min(dimensions.height - 50, pos.y));
      });
    }
    
    setNodePositions(positions);
  }, [nodes, links, dimensions]);
  
  // Redimensionner le canvas
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setDimensions({ width: rect.width, height: Math.max(500, rect.height) });
      }
    };
    
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);
  
  // Dessiner le graphe
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, dimensions.width, dimensions.height);
    
    // Appliquer le zoom et l'offset
    ctx.save();
    ctx.translate(offset.x, offset.y);
    ctx.scale(zoom, zoom);
    
    // Dessiner les liens
    links.forEach(link => {
      const sourceId = typeof link.source === 'number' ? link.source : link.source.id;
      const targetId = typeof link.target === 'number' ? link.target : link.target.id;
      const sourcePos = nodePositions.get(sourceId);
      const targetPos = nodePositions.get(targetId);
      
      if (!sourcePos || !targetPos) return;
      
      ctx.beginPath();
      ctx.moveTo(sourcePos.x, sourcePos.y);
      ctx.lineTo(targetPos.x, targetPos.y);
      
      const color = CITATION_TYPE_COLORS[link.citationType || 'direct'] || '#6b7280';
      ctx.strokeStyle = link.verified ? color : `${color}66`;
      ctx.lineWidth = Math.max(1, (link.weight || 1) * 0.5);
      ctx.stroke();
      
      // Flèche
      const angle = Math.atan2(targetPos.y - sourcePos.y, targetPos.x - sourcePos.x);
      const arrowLength = 10;
      const arrowX = targetPos.x - 15 * Math.cos(angle);
      const arrowY = targetPos.y - 15 * Math.sin(angle);
      
      ctx.beginPath();
      ctx.moveTo(arrowX, arrowY);
      ctx.lineTo(
        arrowX - arrowLength * Math.cos(angle - Math.PI / 6),
        arrowY - arrowLength * Math.sin(angle - Math.PI / 6)
      );
      ctx.lineTo(
        arrowX - arrowLength * Math.cos(angle + Math.PI / 6),
        arrowY - arrowLength * Math.sin(angle + Math.PI / 6)
      );
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.fill();
    });
    
    // Dessiner les nœuds
    nodes.forEach(node => {
      const pos = nodePositions.get(node.id);
      if (!pos) return;
      
      const isSelected = selectedNode?.id === node.id;
      const isHovered = hoveredNode?.id === node.id;
      const degree = node.inDegree + node.outDegree;
      const radius = Math.max(8, Math.min(25, 8 + degree * 2));
      
      // Couleur selon le mode
      let color: string;
      if (colorBy === 'domain') {
        color = DOMAIN_COLORS[node.researchDomain || 'autre'] || '#6b7280';
      } else if (colorBy === 'type') {
        color = ENTRY_TYPE_COLORS[node.entryType || 'misc'] || '#6b7280';
      } else {
        // Gradient selon le degré
        const maxDegree = Math.max(...nodes.map(n => n.inDegree + n.outDegree), 1);
        const intensity = degree / maxDegree;
        color = `hsl(${200 + intensity * 60}, 70%, ${50 + intensity * 20}%)`;
      }
      
      // Cercle extérieur (highlight)
      if (isSelected || isHovered) {
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, radius + 4, 0, 2 * Math.PI);
        ctx.fillStyle = isSelected ? '#ffffff33' : '#ffffff22';
        ctx.fill();
      }
      
      // Cercle principal
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, radius, 0, 2 * Math.PI);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.strokeStyle = isSelected ? '#ffffff' : '#ffffff44';
      ctx.lineWidth = isSelected ? 2 : 1;
      ctx.stroke();
      
      // Label (année)
      if (node.year && (zoom > 0.8 || isHovered || isSelected)) {
        ctx.fillStyle = '#ffffff';
        ctx.font = `${Math.max(10, 12 / zoom)}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(String(node.year), pos.x, pos.y);
      }
    });
    
    ctx.restore();
    
    // Tooltip pour le nœud survolé
    if (hoveredNode) {
      const pos = nodePositions.get(hoveredNode.id);
      if (pos) {
        const tooltipX = pos.x * zoom + offset.x + 20;
        const tooltipY = pos.y * zoom + offset.y - 10;
        
        ctx.fillStyle = '#1f1f1f';
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 1;
        
        const title = hoveredNode.title.substring(0, 50) + (hoveredNode.title.length > 50 ? '...' : '');
        const author = hoveredNode.authors?.split(',')[0] || 'Auteur inconnu';
        const text = `${author} (${hoveredNode.year || '?'})`;
        
        ctx.font = '12px sans-serif';
        const titleWidth = ctx.measureText(title).width;
        const textWidth = ctx.measureText(text).width;
        const boxWidth = Math.max(titleWidth, textWidth) + 20;
        
        ctx.beginPath();
        ctx.roundRect(tooltipX, tooltipY, boxWidth, 50, 5);
        ctx.fill();
        ctx.stroke();
        
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 12px sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(title, tooltipX + 10, tooltipY + 18);
        
        ctx.font = '11px sans-serif';
        ctx.fillStyle = '#a0a0a0';
        ctx.fillText(text, tooltipX + 10, tooltipY + 36);
      }
    }
  }, [nodes, links, nodePositions, dimensions, zoom, offset, selectedNode, hoveredNode, colorBy]);
  
  // Gestion des événements souris
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const x = (e.clientX - rect.left - offset.x) / zoom;
    const y = (e.clientY - rect.top - offset.y) / zoom;
    
    // Vérifier si on clique sur un nœud
    for (const node of nodes) {
      const pos = nodePositions.get(node.id);
      if (!pos) continue;
      
      const dist = Math.sqrt((x - pos.x) ** 2 + (y - pos.y) ** 2);
      const radius = Math.max(8, Math.min(25, 8 + (node.inDegree + node.outDegree) * 2));
      
      if (dist <= radius) {
        setSelectedNode(node);
        onNodeClick?.(node);
        return;
      }
    }
    
    // Sinon, commencer le drag
    setIsDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  }, [nodes, nodePositions, zoom, offset, onNodeClick]);
  
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    if (isDragging) {
      setOffset({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
      return;
    }
    
    const x = (e.clientX - rect.left - offset.x) / zoom;
    const y = (e.clientY - rect.top - offset.y) / zoom;
    
    // Vérifier le survol
    let found = false;
    for (const node of nodes) {
      const pos = nodePositions.get(node.id);
      if (!pos) continue;
      
      const dist = Math.sqrt((x - pos.x) ** 2 + (y - pos.y) ** 2);
      const radius = Math.max(8, Math.min(25, 8 + (node.inDegree + node.outDegree) * 2));
      
      if (dist <= radius) {
        setHoveredNode(node);
        found = true;
        break;
      }
    }
    
    if (!found) {
      setHoveredNode(null);
    }
  }, [nodes, nodePositions, zoom, offset, isDragging, dragStart]);
  
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);
  
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setZoom(z => Math.max(0.2, Math.min(3, z * delta)));
  }, []);
  
  const resetView = useCallback(() => {
    setZoom(1);
    setOffset({ x: 0, y: 0 });
    setSelectedNode(null);
  }, []);
  
  if (isLoading) {
    return (
      <Card className="bg-zinc-900 border-zinc-800">
        <CardContent className="flex items-center justify-center h-[500px]">
          <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
          <span className="ml-3 text-zinc-400">Chargement du graphe...</span>
        </CardContent>
      </Card>
    );
  }
  
  if (nodes.length === 0) {
    return (
      <Card className="bg-zinc-900 border-zinc-800">
        <CardContent className="flex flex-col items-center justify-center h-[500px] text-center">
          <Info className="w-12 h-12 text-zinc-600 mb-4" />
          <p className="text-zinc-400">Aucune citation à afficher.</p>
          <p className="text-zinc-500 text-sm mt-2">
            Ajoutez des citations entre références pour visualiser le graphe.
          </p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg text-zinc-100">
            Graphe de Citations
            <Badge variant="outline" className="ml-2 text-xs">
              {nodes.length} références • {links.length} citations
            </Badge>
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="border-zinc-700"
            >
              <Filter className="w-4 h-4 mr-1" />
              Filtres
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setZoom(z => Math.min(3, z * 1.2))}
              className="border-zinc-700"
            >
              <ZoomIn className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setZoom(z => Math.max(0.2, z * 0.8))}
              className="border-zinc-700"
            >
              <ZoomOut className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={resetView}
              className="border-zinc-700"
            >
              <Maximize2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        {showFilters && (
          <div className="mt-4 p-4 bg-zinc-800/50 rounded-lg space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label className="text-zinc-400 text-sm">Colorer par</Label>
                <Select value={colorBy} onValueChange={(v: any) => setColorBy(v)}>
                  <SelectTrigger className="mt-1 bg-zinc-800 border-zinc-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="domain">Domaine de recherche</SelectItem>
                    <SelectItem value="type">Type de source</SelectItem>
                    <SelectItem value="degree">Nombre de citations</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {onFiltersChange && (
                <>
                  <div>
                    <Label className="text-zinc-400 text-sm">Type de citation</Label>
                    <Select
                      value={filters?.citationType || 'all'}
                      onValueChange={(v) => onFiltersChange({ ...filters, citationType: v === 'all' ? undefined : v })}
                    >
                      <SelectTrigger className="mt-1 bg-zinc-800 border-zinc-700">
                        <SelectValue />
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
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={filters?.verified || false}
                      onCheckedChange={(v) => onFiltersChange({ ...filters, verified: v || undefined })}
                    />
                    <Label className="text-zinc-400 text-sm">Vérifiées uniquement</Label>
                  </div>
                </>
              )}
            </div>
            
            {/* Légende */}
            <div className="pt-3 border-t border-zinc-700">
              <Label className="text-zinc-400 text-sm mb-2 block">Légende</Label>
              <div className="flex flex-wrap gap-3">
                {colorBy === 'domain' && Object.entries(DOMAIN_COLORS).map(([key, color]) => (
                  <div key={key} className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                    <span className="text-xs text-zinc-400">{key.replace(/_/g, ' ')}</span>
                  </div>
                ))}
                {colorBy === 'type' && Object.entries(ENTRY_TYPE_COLORS).map(([key, color]) => (
                  <div key={key} className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                    <span className="text-xs text-zinc-400">{key}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardHeader>
      
      <CardContent className="p-0">
        <div ref={containerRef} className="relative w-full" style={{ height: '500px' }}>
          <canvas
            ref={canvasRef}
            width={dimensions.width}
            height={dimensions.height}
            className="cursor-grab active:cursor-grabbing"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onWheel={handleWheel}
          />
          
          {/* Panneau de détail du nœud sélectionné */}
          {selectedNode && (
            <div className="absolute top-4 right-4 w-80 bg-zinc-800/95 backdrop-blur rounded-lg border border-zinc-700 p-4">
              <div className="flex items-start justify-between mb-3">
                <h4 className="font-medium text-zinc-100 text-sm line-clamp-2">
                  {selectedNode.title}
                </h4>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 -mt-1 -mr-1"
                  onClick={() => setSelectedNode(null)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-zinc-500">Auteur(s)</span>
                  <span className="text-zinc-300 text-right max-w-[60%] truncate">
                    {selectedNode.authors || 'Non spécifié'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Année</span>
                  <span className="text-zinc-300">{selectedNode.year || '?'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Type</span>
                  <Badge variant="outline" className="text-xs">
                    {selectedNode.entryType || 'misc'}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Domaine</span>
                  <span className="text-zinc-300 text-xs">
                    {selectedNode.researchDomain?.replace(/_/g, ' ') || 'Non classé'}
                  </span>
                </div>
                <div className="pt-2 border-t border-zinc-700 flex justify-between">
                  <span className="text-zinc-500">Citations reçues</span>
                  <Badge className="bg-emerald-500/20 text-emerald-400">
                    {selectedNode.inDegree}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Références citées</span>
                  <Badge className="bg-blue-500/20 text-blue-400">
                    {selectedNode.outDegree}
                  </Badge>
                </div>
              </div>
              
              {/* Axes de recherche liés */}
              <LinkedAxesDisplay bibliographyId={selectedNode.id} />
              
              <div className="mt-3 pt-3 border-t border-zinc-700">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full border-zinc-600"
                  onClick={() => onNodeClick?.(selectedNode)}
                >
                  <ExternalLink className="w-3 h-3 mr-2" />
                  Voir la fiche complète
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Composant pour afficher les axes liés dans le panneau de détail
function LinkedAxesDisplay({ bibliographyId }: { bibliographyId: number }) {
  const { data: linkedAxes, isLoading } = trpc.bibliography.getLinkedAxes.useQuery(bibliographyId);
  
  if (isLoading) {
    return (
      <div className="mt-3 pt-3 border-t border-zinc-700">
        <div className="flex items-center gap-2 text-zinc-500 text-sm">
          <Loader2 className="w-3 h-3 animate-spin" />
          Chargement des axes...
        </div>
      </div>
    );
  }
  
  if (!linkedAxes || linkedAxes.length === 0) {
    return null;
  }
  
  return (
    <div className="mt-3 pt-3 border-t border-zinc-700">
      <div className="flex items-center gap-2 mb-2">
        <Target className="w-3 h-3 text-zinc-500" />
        <span className="text-zinc-500 text-sm">Axes de recherche</span>
      </div>
      <div className="flex flex-wrap gap-1">
        {linkedAxes.map((axis: any) => (
          <Badge
            key={axis.id}
            variant="outline"
            className="text-xs"
            style={{ 
              borderColor: axis.color || '#6b7280',
              backgroundColor: `${axis.color || '#6b7280'}20`
            }}
          >
            {axis.axisCode}
            {axis.relevance && (
              <span className="ml-1 opacity-60">
                ({axis.relevance === 'primaire' ? 'P' : axis.relevance === 'secondaire' ? 'S' : 'C'})
              </span>
            )}
          </Badge>
        ))}
      </div>
    </div>
  );
}

export default CitationGraph;
