import { useEffect, useRef, useState, useMemo } from "react";
import * as d3 from "d3";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Network,
  ZoomIn,
  ZoomOut,
  Maximize2,
  RefreshCw,
  Leaf,
  FlaskConical,
  BookOpen,
  Dna,
  MapPin,
  Filter,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Types pour les nœuds et liens
interface GraphNode {
  id: string;
  label: string;
  type: "plant" | "molecule" | "reference" | "chemotype" | "variety" | "region";
  category?: string;
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
}

interface GraphLink {
  source: string | GraphNode;
  target: string | GraphNode;
  type: string;
  weight?: number;
}

interface RelationGraphProps {
  focusType?: "plant" | "molecule" | "reference" | "chemotype";
  focusId?: number;
  height?: number;
}

// Couleurs par type d'entité
const nodeColors: Record<string, string> = {
  plant: "#22c55e",      // green-500
  molecule: "#8b5cf6",   // violet-500
  reference: "#3b82f6",  // blue-500
  chemotype: "#f59e0b",  // amber-500
  variety: "#10b981",    // emerald-500
  region: "#ef4444",     // red-500
};

// Icônes par type
const nodeIcons: Record<string, string> = {
  plant: "🌿",
  molecule: "🧪",
  reference: "📚",
  chemotype: "🧬",
  variety: "🌱",
  region: "📍",
};

export function RelationGraph({ focusType, focusId, height = 600 }: RelationGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height });
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [filters, setFilters] = useState({
    showPlants: true,
    showMolecules: true,
    showReferences: true,
    showChemotypes: true,
    showVarieties: false,
    showRegions: false,
    minConnections: 1,
  });
  
  // Récupérer les données
  const { data: plants } = trpc.plants.list.useQuery();
  const { data: molecules } = trpc.molecules.list.useQuery();
  const { data: references } = trpc.bibliography.list.useQuery({});
  const { data: chemotypes } = trpc.chemotypes.getAll.useQuery();
  const { data: plantMoleculeLinks } = trpc.plantMoleculeLinks.getAll.useQuery();
  
  // Construire le graphe
  const graphData = useMemo(() => {
    const nodes: GraphNode[] = [];
    const links: GraphLink[] = [];
    const nodeMap = new Map<string, GraphNode>();
    
    // Ajouter les plantes
    if (filters.showPlants && plants) {
      plants.forEach(plant => {
        const node: GraphNode = {
          id: `plant-${plant.id}`,
          label: plant.name,
          type: "plant",
          category: plant.category || undefined,
        };
        nodes.push(node);
        nodeMap.set(node.id, node);
      });
    }
    
    // Ajouter les molécules
    if (filters.showMolecules && molecules) {
      molecules.forEach(mol => {
        const node: GraphNode = {
          id: `molecule-${mol.id}`,
          label: mol.name,
          type: "molecule",
          category: mol.chemicalClass || undefined,
        };
        nodes.push(node);
        nodeMap.set(node.id, node);
      });
    }
    
    // Ajouter les références
    if (filters.showReferences && references) {
      const refs = Array.isArray(references) ? references : (references as any).entries || [];
      refs.slice(0, 50).forEach((ref: any) => { // Limiter à 50 pour la performance
        const node: GraphNode = {
          id: `reference-${ref.id}`,
          label: ref.title?.slice(0, 40) + (ref.title?.length > 40 ? "..." : "") || ref.entryKey,
          type: "reference",
          category: ref.researchDomain || undefined,
        };
        nodes.push(node);
        nodeMap.set(node.id, node);
        
        // Liens vers les plantes
        if (ref.linkedPlantIds && Array.isArray(ref.linkedPlantIds)) {
          ref.linkedPlantIds.forEach((plantId: number) => {
            const targetId = `plant-${plantId}`;
            if (nodeMap.has(targetId)) {
              links.push({
                source: node.id,
                target: targetId,
                type: "reference-plant",
                weight: 2,
              });
            }
          });
        }
      });
    }
    
    // Ajouter les chémotypes
    if (filters.showChemotypes && chemotypes) {
      chemotypes.forEach((chem: any) => {
        const node: GraphNode = {
          id: `chemotype-${chem.id}`,
          label: chem.name,
          type: "chemotype",
        };
        nodes.push(node);
        nodeMap.set(node.id, node);
        
        // Lien vers la plante parente
        if (chem.plantId) {
          const targetId = `plant-${chem.plantId}`;
          if (nodeMap.has(targetId)) {
            links.push({
              source: node.id,
              target: targetId,
              type: "chemotype-plant",
              weight: 3,
            });
          }
        }
        
        // Lien vers la molécule dominante
        if (chem.dominantMoleculeId) {
          const targetId = `molecule-${chem.dominantMoleculeId}`;
          if (nodeMap.has(targetId)) {
            links.push({
              source: node.id,
              target: targetId,
              type: "chemotype-molecule",
              weight: 4,
            });
          }
        }
      });
    }
    
    // Ajouter les liens plantes-molécules
    if (plantMoleculeLinks && filters.showPlants && filters.showMolecules) {
      plantMoleculeLinks.forEach(link => {
        const sourceId = `plant-${link.plantId}`;
        const targetId = `molecule-${link.moleculeId}`;
        if (nodeMap.has(sourceId) && nodeMap.has(targetId)) {
          links.push({
            source: sourceId,
            target: targetId,
            type: "plant-molecule",
            weight: link.isSignature ? 5 : 2,
          });
        }
      });
    }
    
    // Filtrer les nœuds avec peu de connexions
    if (filters.minConnections > 1) {
      const connectionCount = new Map<string, number>();
      links.forEach(link => {
        const sourceId = typeof link.source === "string" ? link.source : link.source.id;
        const targetId = typeof link.target === "string" ? link.target : link.target.id;
        connectionCount.set(sourceId, (connectionCount.get(sourceId) || 0) + 1);
        connectionCount.set(targetId, (connectionCount.get(targetId) || 0) + 1);
      });
      
      const filteredNodes = nodes.filter(node => 
        (connectionCount.get(node.id) || 0) >= filters.minConnections
      );
      const filteredNodeIds = new Set(filteredNodes.map(n => n.id));
      const filteredLinks = links.filter(link => {
        const sourceId = typeof link.source === "string" ? link.source : link.source.id;
        const targetId = typeof link.target === "string" ? link.target : link.target.id;
        return filteredNodeIds.has(sourceId) && filteredNodeIds.has(targetId);
      });
      
      return { nodes: filteredNodes, links: filteredLinks };
    }
    
    return { nodes, links };
  }, [plants, molecules, references, chemotypes, plantMoleculeLinks, filters]);
  
  // Mettre à jour les dimensions
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setDimensions({ width: rect.width, height });
      }
    };
    
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, [height]);
  
  // Créer la visualisation D3
  useEffect(() => {
    if (!svgRef.current || graphData.nodes.length === 0) return;
    
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();
    
    const { width, height } = dimensions;
    
    // Créer le groupe principal avec zoom
    const g = svg.append("g");
    
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 4])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });
    
    svg.call(zoom);
    
    // Créer la simulation de force
    const simulation = d3.forceSimulation(graphData.nodes as d3.SimulationNodeDatum[])
      .force("link", d3.forceLink(graphData.links)
        .id((d: any) => d.id)
        .distance(100)
        .strength(0.5))
      .force("charge", d3.forceManyBody().strength(-200))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(30));
    
    // Créer les liens
    const link = g.append("g")
      .attr("class", "links")
      .selectAll("line")
      .data(graphData.links)
      .enter()
      .append("line")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.4)
      .attr("stroke-width", (d) => Math.sqrt(d.weight || 1));
    
    // Créer les nœuds
    const node = g.append("g")
      .attr("class", "nodes")
      .selectAll("g")
      .data(graphData.nodes)
      .enter()
      .append("g")
      .attr("class", "node")
      .style("cursor", "pointer")
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
      .attr("r", 12)
      .attr("fill", (d) => nodeColors[d.type] || "#666")
      .attr("stroke", "#fff")
      .attr("stroke-width", 2)
      .on("click", (event, d) => {
        event.stopPropagation();
        setSelectedNode(d);
      })
      .on("mouseover", function() {
        d3.select(this).attr("r", 16);
      })
      .on("mouseout", function() {
        d3.select(this).attr("r", 12);
      });
    
    // Labels des nœuds
    node.append("text")
      .attr("dx", 16)
      .attr("dy", 4)
      .attr("font-size", "10px")
      .attr("fill", "#666")
      .text((d) => d.label.slice(0, 20) + (d.label.length > 20 ? "..." : ""));
    
    // Mettre à jour les positions
    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);
      
      node.attr("transform", (d: any) => `translate(${d.x},${d.y})`);
    });
    
    // Centrer la vue initiale
    svg.call(zoom.transform, d3.zoomIdentity.translate(0, 0).scale(0.8));
    
    return () => {
      simulation.stop();
    };
  }, [graphData, dimensions]);
  
  const isLoading = !plants || !molecules;
  
  return (
    <div className="space-y-4">
      {/* Contrôles */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Filter className="h-5 w-5" />
            Filtres du graphe
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="show-plants"
                checked={filters.showPlants}
                onCheckedChange={(checked) => setFilters(f => ({ ...f, showPlants: checked }))}
              />
              <Label htmlFor="show-plants" className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: nodeColors.plant }} />
                Plantes
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="show-molecules"
                checked={filters.showMolecules}
                onCheckedChange={(checked) => setFilters(f => ({ ...f, showMolecules: checked }))}
              />
              <Label htmlFor="show-molecules" className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: nodeColors.molecule }} />
                Molécules
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="show-references"
                checked={filters.showReferences}
                onCheckedChange={(checked) => setFilters(f => ({ ...f, showReferences: checked }))}
              />
              <Label htmlFor="show-references" className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: nodeColors.reference }} />
                Références
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="show-chemotypes"
                checked={filters.showChemotypes}
                onCheckedChange={(checked) => setFilters(f => ({ ...f, showChemotypes: checked }))}
              />
              <Label htmlFor="show-chemotypes" className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: nodeColors.chemotype }} />
                Chémotypes
              </Label>
            </div>
            <div className="col-span-2 flex items-center gap-4">
              <Label className="whitespace-nowrap">Min. connexions:</Label>
              <Slider
                value={[filters.minConnections]}
                onValueChange={([value]) => setFilters(f => ({ ...f, minConnections: value }))}
                min={1}
                max={10}
                step={1}
                className="flex-1"
              />
              <span className="text-sm font-mono w-6">{filters.minConnections}</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Graphe */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Network className="h-5 w-5" />
              Graphe de relations
            </CardTitle>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Badge variant="outline">{graphData.nodes.length} nœuds</Badge>
              <Badge variant="outline">{graphData.links.length} liens</Badge>
            </div>
          </div>
          <CardDescription>
            Visualisation interactive des connexions entre plantes, molécules, références et chémotypes.
            Glissez les nœuds pour explorer, utilisez la molette pour zoomer.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div 
            ref={containerRef} 
            className="relative border rounded-lg bg-muted/20 overflow-hidden"
            style={{ height }}
          >
            {isLoading ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : graphData.nodes.length === 0 ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
                <Network className="h-12 w-12 mb-4 opacity-30" />
                <p>Aucune donnée à afficher</p>
                <p className="text-sm">Ajustez les filtres pour voir le graphe</p>
              </div>
            ) : (
              <svg
                ref={svgRef}
                width={dimensions.width}
                height={dimensions.height}
                className="w-full h-full"
              />
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Détails du nœud sélectionné */}
      {selectedNode && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">{nodeIcons[selectedNode.type]}</span>
              {selectedNode.label}
            </CardTitle>
            <CardDescription>
              Type: {selectedNode.type} {selectedNode.category && `• ${selectedNode.category}`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Badge style={{ backgroundColor: nodeColors[selectedNode.type], color: "white" }}>
                {selectedNode.type}
              </Badge>
              {selectedNode.category && (
                <Badge variant="outline">{selectedNode.category}</Badge>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="mt-4"
              onClick={() => setSelectedNode(null)}
            >
              Fermer
            </Button>
          </CardContent>
        </Card>
      )}
      
      {/* Légende */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex flex-wrap gap-4 justify-center">
            {Object.entries(nodeColors).map(([type, color]) => (
              <div key={type} className="flex items-center gap-2">
                <span 
                  className="w-4 h-4 rounded-full" 
                  style={{ backgroundColor: color }}
                />
                <span className="text-sm capitalize">{type}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
