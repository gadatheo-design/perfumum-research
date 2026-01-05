import { useRef, useEffect, useState, useMemo } from "react";
import * as d3 from "d3";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Leaf, 
  FlaskConical, 
  Search, 
  ZoomIn, 
  ZoomOut, 
  Maximize2,
  Filter,
  Info
} from "lucide-react";

interface PlantMoleculeLink {
  plantId: number;
  moleculeId: number;
  plantName: string;
  plantLatinName: string | null;
  plantFamily: string | null;
  moleculeName: string;
  moleculeFamily: string | null;
  percentageMin: string | null;
  percentageMax: string | null;
  percentageTypical: string | null;
  isSignature: number | null;
  role: string | null;
}

interface PlantMoleculeGraphProps {
  links: PlantMoleculeLink[];
  isLoading?: boolean;
  height?: number;
}

interface GraphNode {
  id: string;
  name: string;
  type: "plant" | "molecule";
  family?: string;
  latinName?: string;
  linkCount: number;
}

interface GraphLink {
  source: string;
  target: string;
  percentageTypical: number;
  isSignature: boolean;
  role: string;
}

// Couleurs par famille de molécules
const moleculeFamilyColors: Record<string, string> = {
  "Monoterpène": "#22c55e",
  "Sesquiterpène": "#3b82f6",
  "Monoterpénol": "#8b5cf6",
  "Sesquiterpénol": "#ec4899",
  "Aldéhyde": "#f59e0b",
  "Cétone": "#ef4444",
  "Ester": "#06b6d4",
  "Oxyde": "#84cc16",
  "Phénol": "#f97316",
  "default": "#64748b",
};

// Couleurs par famille de plantes
const plantFamilyColors: Record<string, string> = {
  "Lamiaceae": "#22c55e",
  "Rutaceae": "#f59e0b",
  "Lauraceae": "#8b5cf6",
  "Myrtaceae": "#3b82f6",
  "Asteraceae": "#ec4899",
  "Poaceae": "#84cc16",
  "Pinaceae": "#0ea5e9",
  "Cupressaceae": "#14b8a6",
  "default": "#64748b",
};

export function PlantMoleculeGraph({ links, isLoading, height = 600 }: PlantMoleculeGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  
  const [dimensions, setDimensions] = useState({ width: 800, height });
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState<string>("all");
  const [filterFamily, setFilterFamily] = useState<string>("all");
  const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  
  // Observer les changements de taille du conteneur
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width } = containerRef.current.getBoundingClientRect();
        setDimensions({ width: Math.max(width - 32, 300), height });
      }
    };
    
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, [height]);
  
  // Transformer les données en format de graphe
  const graphData = useMemo(() => {
    if (!links || links.length === 0) return { nodes: [], links: [] };
    
    const nodesMap = new Map<string, GraphNode>();
    const graphLinks: GraphLink[] = [];
    
    // Filtrer les liens
    const filteredLinks = links.filter(link => {
      // Filtre par recherche
      if (searchTerm) {
        const search = searchTerm.toLowerCase();
        if (!link.plantName.toLowerCase().includes(search) && 
            !link.moleculeName.toLowerCase().includes(search)) {
          return false;
        }
      }
      
      // Filtre par rôle
      if (filterRole !== "all" && link.role !== filterRole) {
        return false;
      }
      
      // Filtre par famille de molécule
      if (filterFamily !== "all" && link.moleculeFamily !== filterFamily) {
        return false;
      }
      
      return true;
    });
    
    // Construire les nœuds et liens
    filteredLinks.forEach(link => {
      const plantId = `plant-${link.plantId}`;
      const moleculeId = `molecule-${link.moleculeId}`;
      
      // Ajouter le nœud plante
      if (!nodesMap.has(plantId)) {
        nodesMap.set(plantId, {
          id: plantId,
          name: link.plantName,
          type: "plant",
          family: link.plantFamily || undefined,
          latinName: link.plantLatinName || undefined,
          linkCount: 0,
        });
      }
      nodesMap.get(plantId)!.linkCount++;
      
      // Ajouter le nœud molécule
      if (!nodesMap.has(moleculeId)) {
        nodesMap.set(moleculeId, {
          id: moleculeId,
          name: link.moleculeName,
          type: "molecule",
          family: link.moleculeFamily || undefined,
          linkCount: 0,
        });
      }
      nodesMap.get(moleculeId)!.linkCount++;
      
      // Ajouter le lien
      graphLinks.push({
        source: plantId,
        target: moleculeId,
        percentageTypical: parseFloat(link.percentageTypical || "0"),
        isSignature: link.isSignature === 1,
        role: link.role || "secondaire",
      });
    });
    
    return {
      nodes: Array.from(nodesMap.values()),
      links: graphLinks,
    };
  }, [links, searchTerm, filterRole, filterFamily]);
  
  // Extraire les familles uniques pour les filtres
  const moleculeFamilies = useMemo(() => {
    if (!links) return [];
    const families = new Set(links.map(l => l.moleculeFamily).filter(Boolean));
    return Array.from(families).sort();
  }, [links]);
  
  // Dessiner le graphe avec D3
  useEffect(() => {
    if (!svgRef.current || graphData.nodes.length === 0) return;
    
    const { width, height } = dimensions;
    const svg = d3.select(svgRef.current);
    
    // Clear previous content
    svg.selectAll("*").remove();
    
    // Créer les groupes
    const g = svg.append("g");
    
    // Ajouter le zoom
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.2, 4])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });
    
    svg.call(zoom);
    
    // Créer la simulation de force
    const simulation = d3.forceSimulation(graphData.nodes as any)
      .force("link", d3.forceLink(graphData.links as any)
        .id((d: any) => d.id)
        .distance((d: any) => {
          // Distance plus courte pour les molécules signatures
          return d.isSignature ? 80 : 120;
        })
        .strength((d: any) => {
          // Force plus forte pour les pourcentages élevés
          return 0.3 + (d.percentageTypical / 100) * 0.5;
        })
      )
      .force("charge", d3.forceManyBody()
        .strength((d: any) => {
          // Répulsion plus forte pour les nœuds avec beaucoup de connexions
          return -200 - d.linkCount * 20;
        })
      )
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius((d: any) => {
        return d.type === "plant" ? 40 : 30;
      }));
    
    // Dessiner les liens
    const link = g.append("g")
      .attr("class", "links")
      .selectAll("line")
      .data(graphData.links)
      .join("line")
      .attr("stroke", (d: any) => d.isSignature ? "#8b5cf6" : "#94a3b8")
      .attr("stroke-opacity", (d: any) => 0.3 + (d.percentageTypical / 100) * 0.5)
      .attr("stroke-width", (d: any) => {
        // Épaisseur basée sur le pourcentage
        return 1 + (d.percentageTypical / 20);
      })
      .attr("stroke-dasharray", (d: any) => d.role === "trace" ? "4,4" : "none");
    
    // Dessiner les nœuds
    const node = g.append("g")
      .attr("class", "nodes")
      .selectAll("g")
      .data(graphData.nodes)
      .join("g")
      .attr("cursor", "pointer")
      .call(d3.drag<any, any>()
        .on("start", (event, d: any) => {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        })
        .on("drag", (event, d: any) => {
          d.fx = event.x;
          d.fy = event.y;
        })
        .on("end", (event, d: any) => {
          if (!event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        })
      );
    
    // Cercles pour les nœuds
    node.append("circle")
      .attr("r", (d: any) => d.type === "plant" ? 20 + d.linkCount * 2 : 12 + d.linkCount)
      .attr("fill", (d: any) => {
        if (d.type === "plant") {
          return plantFamilyColors[d.family || ""] || plantFamilyColors.default;
        }
        return moleculeFamilyColors[d.family || ""] || moleculeFamilyColors.default;
      })
      .attr("stroke", (d: any) => d.type === "plant" ? "#166534" : "#1e40af")
      .attr("stroke-width", 2)
      .attr("opacity", 0.9);
    
    // Icônes pour les nœuds
    node.append("text")
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "central")
      .attr("font-size", (d: any) => d.type === "plant" ? "14px" : "10px")
      .attr("fill", "white")
      .text((d: any) => d.type === "plant" ? "🌿" : "⚗️");
    
    // Labels
    node.append("text")
      .attr("x", 0)
      .attr("y", (d: any) => (d.type === "plant" ? 20 + d.linkCount * 2 : 12 + d.linkCount) + 12)
      .attr("text-anchor", "middle")
      .attr("font-size", "11px")
      .attr("font-weight", (d: any) => d.type === "plant" ? "600" : "400")
      .attr("fill", "currentColor")
      .text((d: any) => d.name.length > 15 ? d.name.substring(0, 15) + "..." : d.name);
    
    // Tooltip on hover
    node.on("mouseenter", (event, d: any) => {
      setHoveredNode(d);
      
      // Highlight connected links
      link.attr("stroke-opacity", (l: any) => {
        return l.source.id === d.id || l.target.id === d.id ? 1 : 0.1;
      });
      
      // Highlight connected nodes
      node.attr("opacity", (n: any) => {
        if (n.id === d.id) return 1;
        const isConnected = graphData.links.some(
          (l: any) => (l.source.id === d.id && l.target.id === n.id) ||
                      (l.target.id === d.id && l.source.id === n.id)
        );
        return isConnected ? 1 : 0.3;
      });
    })
    .on("mouseleave", () => {
      setHoveredNode(null);
      link.attr("stroke-opacity", (d: any) => 0.3 + (d.percentageTypical / 100) * 0.5);
      node.attr("opacity", 1);
    })
    .on("click", (event, d: any) => {
      setSelectedNode(selectedNode?.id === d.id ? null : d);
    });
    
    // Update positions on tick
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
  }, [graphData, dimensions]);
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-72 mt-2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="w-full" style={{ height }} />
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Leaf className="h-5 w-5 text-green-600" />
              Réseau Plantes-Molécules
            </CardTitle>
            <CardDescription>
              {graphData.nodes.length} nœuds • {graphData.links.length} connexions
            </CardDescription>
          </div>
          
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 w-40"
              />
            </div>
            
            <Select value={filterRole} onValueChange={setFilterRole}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Rôle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous rôles</SelectItem>
                <SelectItem value="majeur">Majeur</SelectItem>
                <SelectItem value="secondaire">Secondaire</SelectItem>
                <SelectItem value="trace">Trace</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={filterFamily} onValueChange={setFilterFamily}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Famille" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes familles</SelectItem>
                {moleculeFamilies.map((family) => (
                  <SelectItem key={family} value={family!}>
                    {family}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <div ref={containerRef} className="relative">
          <svg
            ref={svgRef}
            width={dimensions.width}
            height={dimensions.height}
            className="bg-muted/20"
          />
          
          {/* Légende */}
          <div className="absolute bottom-4 left-4 bg-background/90 backdrop-blur-sm rounded-lg p-3 shadow-lg border">
            <div className="text-xs font-medium mb-2">Légende</div>
            <div className="flex flex-col gap-1.5 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-green-600" />
                <span>Plante</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-600" />
                <span>Molécule</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-0.5 bg-purple-500" />
                <span>Signature</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-0.5 bg-slate-400 border-dashed border-t-2" />
                <span>Trace</span>
              </div>
            </div>
          </div>
          
          {/* Info panel */}
          {(hoveredNode || selectedNode) && (
            <div className="absolute top-4 right-4 bg-background/95 backdrop-blur-sm rounded-lg p-4 shadow-lg border max-w-xs">
              <div className="flex items-center gap-2 mb-2">
                {(hoveredNode || selectedNode)?.type === "plant" ? (
                  <Leaf className="h-4 w-4 text-green-600" />
                ) : (
                  <FlaskConical className="h-4 w-4 text-blue-600" />
                )}
                <span className="font-semibold">{(hoveredNode || selectedNode)?.name}</span>
              </div>
              {(hoveredNode || selectedNode)?.latinName && (
                <div className="text-xs text-muted-foreground italic mb-1">
                  {(hoveredNode || selectedNode)?.latinName}
                </div>
              )}
              {(hoveredNode || selectedNode)?.family && (
                <Badge variant="secondary" className="text-xs">
                  {(hoveredNode || selectedNode)?.family}
                </Badge>
              )}
              <div className="text-xs text-muted-foreground mt-2">
                {(hoveredNode || selectedNode)?.linkCount} connexion(s)
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default PlantMoleculeGraph;
