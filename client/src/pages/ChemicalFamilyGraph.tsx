// @ts-nocheck
import { useState, useEffect, useRef, useMemo } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  FlaskConical, 
  Beaker, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Search,
  Filter,
  ChevronDown,
  Network,
  TreePine,
  Loader2
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link } from "wouter";

// Types for the graph
interface GraphNode {
  id: string;
  type: "family" | "molecule";
  name: string;
  x: number;
  y: number;
  radius: number;
  color: string;
  moleculeCount?: number;
  familyType?: string;
}

interface GraphLink {
  source: string;
  target: string;
}

// Color palette for family types
const familyColors: Record<string, string> = {
  monoterpene: "#22c55e",
  sesquiterpene: "#10b981",
  diterpene: "#14b8a6",
  triterpene: "#06b6d4",
  monoterpenoid: "#0ea5e9",
  sesquiterpenoid: "#3b82f6",
  alcohol_aliphatic: "#6366f1",
  alcohol_aromatic: "#8b5cf6",
  alcohol_terpenic: "#a855f7",
  aldehyde_aliphatic: "#d946ef",
  aldehyde_aromatic: "#ec4899",
  aldehyde_terpenic: "#f43f5e",
  ketone_aliphatic: "#ef4444",
  ketone_aromatic: "#f97316",
  ketone_terpenic: "#f59e0b",
  ketone_macrocyclic: "#eab308",
  ester_aliphatic: "#84cc16",
  ester_aromatic: "#22c55e",
  ester_terpenic: "#10b981",
  ether_aliphatic: "#14b8a6",
  default: "#6b7280",
};

export default function ChemicalFamilyGraph() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // State
  const [viewMode, setViewMode] = useState<"tree" | "network">("network");
  const [selectedFamily, setSelectedFamily] = useState<string | null>(null);
  const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  // Queries
  const { data: chemicalFamilies, isLoading: loadingFamilies } = 
    trpc.chemicalFamilies.listWithCount.useQuery();
  const { data: networkData, isLoading: loadingNetwork } = 
    trpc.network.getRelationships.useQuery();

  // Process data for visualization
  const graphData = useMemo(() => {
    if (!chemicalFamilies || !networkData) return { nodes: [], links: [] };
    
    const nodes: GraphNode[] = [];
    const links: GraphLink[] = [];
    const addedMolecules = new Set<number>();
    
    // Add family nodes
    chemicalFamilies.forEach((family, index) => {
      const angle = (index / chemicalFamilies.length) * 2 * Math.PI;
      const radius = 250;
      
      nodes.push({
        id: `family-${family.id}`,
        type: "family",
        name: family.name,
        x: 400 + Math.cos(angle) * radius,
        y: 300 + Math.sin(angle) * radius,
        radius: Math.max(20, Math.min(50, 20 + (family.moleculeCount || 0) * 2)),
        color: familyColors[family.type] || familyColors.default,
        moleculeCount: family.moleculeCount || 0,
        familyType: family.type,
      });
    });
    
    // Add molecule nodes from network data
    if (networkData.relationships?.moleculeFamilies) {
      networkData.relationships.moleculeFamilies.forEach((relation: any) => {
        // Add molecule node if not already added
        if (!addedMolecules.has(relation.moleculeId)) {
          const familyNode = nodes.find(n => n.id === `family-${relation.familyId}`);
          if (familyNode) {
            // Position molecule near its family
            const offsetAngle = Math.random() * 2 * Math.PI;
            const offsetRadius = 80 + Math.random() * 40;
            
            nodes.push({
              id: `molecule-${relation.moleculeId}`,
              type: "molecule",
              name: relation.moleculeName,
              x: familyNode.x + Math.cos(offsetAngle) * offsetRadius,
              y: familyNode.y + Math.sin(offsetAngle) * offsetRadius,
              radius: 8,
              color: familyNode.color,
            });
            addedMolecules.add(relation.moleculeId);
          }
        }
        
        // Add link
        links.push({
          source: `family-${relation.familyId}`,
          target: `molecule-${relation.moleculeId}`,
        });
      });
    }
    
    return { nodes, links };
  }, [chemicalFamilies, networkData]);

  // Filter nodes based on search and selection
  const filteredData = useMemo(() => {
    let { nodes, links } = graphData;
    
    // Filter by selected family
    if (selectedFamily) {
      const familyId = `family-${selectedFamily}`;
      const connectedMolecules = new Set(
        links.filter(l => l.source === familyId).map(l => l.target)
      );
      nodes = nodes.filter(n => n.id === familyId || connectedMolecules.has(n.id));
      links = links.filter(l => l.source === familyId);
    }
    
    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchingNodes = new Set(
        nodes.filter(n => n.name.toLowerCase().includes(query)).map(n => n.id)
      );
      // Include families of matching molecules
      links.forEach(l => {
        if (matchingNodes.has(l.target)) matchingNodes.add(l.source);
        if (matchingNodes.has(l.source)) matchingNodes.add(l.target);
      });
      nodes = nodes.filter(n => matchingNodes.has(n.id));
      links = links.filter(l => matchingNodes.has(l.source) && matchingNodes.has(l.target));
    }
    
    return { nodes, links };
  }, [graphData, selectedFamily, searchQuery]);

  // Draw the graph
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    // Set canvas size
    const container = containerRef.current;
    if (container) {
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
    }
    
    // Clear canvas
    ctx.fillStyle = "oklch(0.15 0.01 260)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Apply transformations
    ctx.save();
    ctx.translate(pan.x + canvas.width / 2, pan.y + canvas.height / 2);
    ctx.scale(zoom, zoom);
    ctx.translate(-canvas.width / 2, -canvas.height / 2);
    
    // Draw links
    ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
    ctx.lineWidth = 1;
    filteredData.links.forEach(link => {
      const source = filteredData.nodes.find(n => n.id === link.source);
      const target = filteredData.nodes.find(n => n.id === link.target);
      if (source && target) {
        ctx.beginPath();
        ctx.moveTo(source.x, source.y);
        ctx.lineTo(target.x, target.y);
        ctx.stroke();
      }
    });
    
    // Draw nodes
    filteredData.nodes.forEach(node => {
      const isHovered = hoveredNode?.id === node.id;
      const isFamily = node.type === "family";
      
      // Node circle
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius * (isHovered ? 1.2 : 1), 0, 2 * Math.PI);
      ctx.fillStyle = node.color;
      ctx.fill();
      
      // Border for families
      if (isFamily) {
        ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
        ctx.lineWidth = 2;
        ctx.stroke();
      }
      
      // Label for families or hovered molecules
      if (isFamily || isHovered) {
        ctx.fillStyle = "white";
        ctx.font = isFamily ? "bold 12px Inter, sans-serif" : "11px Inter, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        
        const label = node.name.length > 20 ? node.name.substring(0, 18) + "..." : node.name;
        const labelY = node.y + node.radius + 15;
        
        // Background for label
        const metrics = ctx.measureText(label);
        ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
        ctx.fillRect(
          node.x - metrics.width / 2 - 4,
          labelY - 8,
          metrics.width + 8,
          16
        );
        
        ctx.fillStyle = "white";
        ctx.fillText(label, node.x, labelY);
        
        // Show count for families
        if (isFamily && node.moleculeCount) {
          ctx.font = "10px Inter, sans-serif";
          ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
          ctx.fillText(`${node.moleculeCount} molécules`, node.x, labelY + 14);
        }
      }
    });
    
    ctx.restore();
  }, [filteredData, hoveredNode, zoom, pan]);

  // Handle mouse events
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left - pan.x - canvas.width / 2) / zoom + canvas.width / 2;
    const y = (e.clientY - rect.top - pan.y - canvas.height / 2) / zoom + canvas.height / 2;
    
    // Check if hovering over a node
    const hovered = filteredData.nodes.find(node => {
      const dx = node.x - x;
      const dy = node.y - y;
      return Math.sqrt(dx * dx + dy * dy) < node.radius;
    });
    
    setHoveredNode(hovered || null);
    
    // Handle panning
    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - pan.x,
      y: e.clientY - pan.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setZoom(z => Math.max(0.2, Math.min(3, z * delta)));
  };

  // Stats
  const stats = useMemo(() => {
    if (!chemicalFamilies) return { totalFamilies: 0, familiesWithMolecules: 0, totalLinks: 0 };
    return {
      totalFamilies: chemicalFamilies.length,
      familiesWithMolecules: chemicalFamilies.filter(f => (f.moleculeCount || 0) > 0).length,
      totalLinks: graphData.links.length,
    };
  }, [chemicalFamilies, graphData]);

  const isLoading = loadingFamilies || loadingNetwork;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <Breadcrumbs />
      
      <main className="flex-1">
        {/* Hero */}
        <section className="section-spacing bg-gradient-to-b from-background to-muted/30">
          <div className="container">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
                <Network className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
                Graphe des Familles Chimiques
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Visualisation interactive des relations entre les familles chimiques et les molécules.
                Explorez les connexions et découvrez les groupements moléculaires.
              </p>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-8 border-b border-border/40">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-full bg-primary/10">
                      <FlaskConical className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{stats.totalFamilies}</p>
                      <p className="text-sm text-muted-foreground">Familles chimiques</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-full bg-green-500/10">
                      <Beaker className="h-6 w-6 text-green-500" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{stats.familiesWithMolecules}</p>
                      <p className="text-sm text-muted-foreground">Avec molécules liées</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-full bg-blue-500/10">
                      <Network className="h-6 w-6 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{stats.totalLinks}</p>
                      <p className="text-sm text-muted-foreground">Liaisons totales</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Controls */}
        <section className="py-6 border-b border-border/40">
          <div className="container">
            <div className="flex flex-wrap items-center gap-4 max-w-5xl mx-auto">
              {/* Search */}
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher une famille ou molécule..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              {/* Family Filter */}
              <Select 
                value={selectedFamily || "all"} 
                onValueChange={(v) => setSelectedFamily(v === "all" ? null : v)}
              >
                <SelectTrigger className="w-[200px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filtrer par famille" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les familles</SelectItem>
                  {chemicalFamilies?.map((family) => (
                    <SelectItem key={family.id} value={String(family.id)}>
                      {family.name} ({family.moleculeCount || 0})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {/* Zoom Controls */}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setZoom(z => Math.min(3, z * 1.2))}
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setZoom(z => Math.max(0.2, z * 0.8))}
                >
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }}
                >
                  <Maximize2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Graph */}
        <section className="py-8">
          <div className="container">
            <div className="max-w-6xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle>Visualisation du réseau</CardTitle>
                  <CardDescription>
                    Glissez pour naviguer, utilisez la molette pour zoomer. 
                    Survolez un nœud pour voir les détails.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div 
                    ref={containerRef}
                    className="relative w-full h-[600px] rounded-lg overflow-hidden border border-border"
                  >
                    {isLoading ? (
                      <div className="absolute inset-0 flex items-center justify-center bg-muted/50">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      </div>
                    ) : (
                      <canvas
                        ref={canvasRef}
                        className="w-full h-full cursor-grab active:cursor-grabbing"
                        onMouseMove={handleMouseMove}
                        onMouseDown={handleMouseDown}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseUp}
                        onWheel={handleWheel}
                      />
                    )}
                    
                    {/* Hover tooltip */}
                    {hoveredNode && (
                      <div className="absolute bottom-4 left-4 bg-card border border-border rounded-lg p-4 shadow-lg max-w-xs">
                        <div className="flex items-center gap-2 mb-2">
                          {hoveredNode.type === "family" ? (
                            <FlaskConical className="h-5 w-5" style={{ color: hoveredNode.color }} />
                          ) : (
                            <Beaker className="h-5 w-5" style={{ color: hoveredNode.color }} />
                          )}
                          <span className="font-semibold">{hoveredNode.name}</span>
                        </div>
                        {hoveredNode.type === "family" && (
                          <>
                            <Badge variant="outline" className="mb-2">
                              {hoveredNode.familyType}
                            </Badge>
                            <p className="text-sm text-muted-foreground">
                              {hoveredNode.moleculeCount} molécule(s) liée(s)
                            </p>
                          </>
                        )}
                        {hoveredNode.type === "molecule" && (
                          <Link href={`/molecule/${hoveredNode.id.replace("molecule-", "")}`}>
                            <Button variant="link" size="sm" className="p-0 h-auto">
                              Voir la fiche →
                            </Button>
                          </Link>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Legend */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Légende</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {Object.entries(familyColors).slice(0, 12).map(([type, color]) => (
                      <div key={type} className="flex items-center gap-2">
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: color }}
                        />
                        <span className="text-sm text-muted-foreground capitalize">
                          {type.replace(/_/g, " ")}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
