import { useEffect, useRef, useState, useMemo } from "react";
import * as d3 from "d3";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Leaf, 
  MapPin, 
  FlaskConical, 
  Search,
  Filter,
  RotateCcw
} from "lucide-react";

// Types pour le graphe
export interface TerrainNode {
  id: string;
  name: string;
  type: 'terroir' | 'plant' | 'molecule';
  data?: {
    // Terroir
    country?: string;
    region?: string;
    climateType?: string;
    altitude?: string;
    // Plant
    latinName?: string;
    family?: string;
    category?: string;
    // Molecule
    chemicalClass?: string;
    olfactiveProfile?: string;
    casNumber?: string;
  };
  // Pour la simulation D3
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
}

export interface TerrainLink {
  source: string | TerrainNode;
  target: string | TerrainNode;
  type: 'terroir-plant' | 'plant-molecule';
  value?: number;
  isSignature?: boolean;
  role?: string;
  percentage?: number;
}

interface TerrainPlantMoleculeGraphProps {
  nodes: TerrainNode[];
  links: TerrainLink[];
  width?: number;
  height?: number;
}

// Couleurs par type de nœud
const nodeColors: Record<string, string> = {
  terroir: "oklch(0.60 0.18 45)",    // Orange terre
  plant: "oklch(0.65 0.20 142)",     // Vert végétal
  molecule: "oklch(0.60 0.18 250)",  // Bleu scientifique
};

// Couleurs secondaires pour les bordures
const nodeBorderColors: Record<string, string> = {
  terroir: "oklch(0.45 0.15 45)",
  plant: "oklch(0.50 0.18 142)",
  molecule: "oklch(0.45 0.15 250)",
};

// Couleurs par type de lien
const linkColors: Record<string, string> = {
  'terroir-plant': "oklch(0.55 0.12 90)",
  'plant-molecule': "oklch(0.55 0.12 200)",
};

// Couleurs par climat pour les terroirs
const climateColors: Record<string, string> = {
  tropical: "#22c55e",
  subtropical: "#84cc16",
  mediterranean: "#f59e0b",
  oceanic: "#3b82f6",
  continental: "#8b5cf6",
  arid: "#ef4444",
  semi_arid: "#f97316",
  alpine: "#06b6d4",
  equatorial: "#10b981",
};

// Couleurs par famille chimique pour les molécules
const chemicalClassColors: Record<string, string> = {
  terpene: "#22c55e",
  sesquiterpene: "#3b82f6",
  monoterpene: "#84cc16",
  aldehyde: "#f59e0b",
  ketone: "#ef4444",
  alcohol: "#8b5cf6",
  ester: "#06b6d4",
  phenol: "#f97316",
  oxide: "#10b981",
};

export function TerrainPlantMoleculeGraph({
  nodes,
  links,
  width = 1200,
  height = 800,
}: TerrainPlantMoleculeGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const [showLabels, setShowLabels] = useState(true);
  const [selectedNode, setSelectedNode] = useState<TerrainNode | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [highlightConnected, setHighlightConnected] = useState(true);
  const [dimensions, setDimensions] = useState({ width, height });

  // Observer les changements de taille du conteneur
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setDimensions({ 
          width: Math.max(rect.width - 32, 600), 
          height: Math.max(height, 600) 
        });
      }
    };
    
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, [height]);

  // Statistiques du graphe
  const stats = useMemo(() => {
    const terroirCount = nodes.filter(n => n.type === 'terroir').length;
    const plantCount = nodes.filter(n => n.type === 'plant').length;
    const moleculeCount = nodes.filter(n => n.type === 'molecule').length;
    const terroirPlantLinks = links.filter(l => l.type === 'terroir-plant').length;
    const plantMoleculeLinks = links.filter(l => l.type === 'plant-molecule').length;
    
    return {
      terroirCount,
      plantCount,
      moleculeCount,
      terroirPlantLinks,
      plantMoleculeLinks,
      totalNodes: nodes.length,
      totalLinks: links.length,
    };
  }, [nodes, links]);

  // Filtrer les nœuds selon la recherche et le type
  const filteredData = useMemo(() => {
    let filteredNodes = [...nodes];
    
    // Filtre par type
    if (filterType !== "all") {
      filteredNodes = filteredNodes.filter(n => n.type === filterType);
    }
    
    // Filtre par recherche
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filteredNodes = filteredNodes.filter(n => 
        n.name.toLowerCase().includes(search) ||
        n.data?.country?.toLowerCase().includes(search) ||
        n.data?.latinName?.toLowerCase().includes(search) ||
        n.data?.family?.toLowerCase().includes(search)
      );
    }
    
    // Filtrer les liens pour ne garder que ceux entre nœuds filtrés
    const nodeIds = new Set(filteredNodes.map(n => n.id));
    const filteredLinks = links.filter(l => {
      const sourceId = typeof l.source === 'string' ? l.source : l.source.id;
      const targetId = typeof l.target === 'string' ? l.target : l.target.id;
      return nodeIds.has(sourceId) && nodeIds.has(targetId);
    });
    
    return { nodes: filteredNodes, links: filteredLinks };
  }, [nodes, links, filterType, searchTerm]);

  // Dessiner le graphe avec D3
  useEffect(() => {
    if (!svgRef.current || filteredData.nodes.length === 0) return;

    const { width: w, height: h } = dimensions;
    const svg = d3.select(svgRef.current);
    
    // Clear previous content
    svg.selectAll("*").remove();

    const g = svg.append("g");

    // Zoom behavior
    const zoomBehavior = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 4])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
        setZoom(event.transform.k);
      });

    svg.call(zoomBehavior);

    // Créer des copies des données pour D3
    const nodesCopy = filteredData.nodes.map(n => ({ ...n }));
    const linksCopy = filteredData.links.map(l => ({ ...l }));

    // Force simulation avec disposition hiérarchique
    const simulation = d3
      .forceSimulation(nodesCopy as any)
      .force(
        "link",
        d3
          .forceLink(linksCopy)
          .id((d: any) => d.id)
          .distance((d: any) => {
            // Distance plus grande pour les liens terroir-plante
            if (d.type === 'terroir-plant') return 180;
            // Distance basée sur le pourcentage pour plant-molecule
            return d.isSignature ? 100 : 140;
          })
          .strength((d: any) => {
            // Force plus forte pour les molécules signatures
            return d.isSignature ? 0.8 : 0.4;
          })
      )
      .force("charge", d3.forceManyBody().strength((d: any) => {
        // Répulsion plus forte pour les terroirs (nœuds centraux)
        if (d.type === 'terroir') return -600;
        if (d.type === 'plant') return -400;
        return -200;
      }))
      .force("center", d3.forceCenter(w / 2, h / 2))
      .force("collision", d3.forceCollide().radius((d: any) => {
        if (d.type === 'terroir') return 50;
        if (d.type === 'plant') return 35;
        return 25;
      }))
      // Force pour séparer les types verticalement
      .force("y", d3.forceY((d: any) => {
        if (d.type === 'terroir') return h * 0.2;
        if (d.type === 'plant') return h * 0.5;
        return h * 0.8;
      }).strength(0.1));

    // Gradient pour les liens
    const defs = svg.append("defs");
    
    // Gradient terroir-plant
    const gradientTP = defs.append("linearGradient")
      .attr("id", "gradient-terroir-plant")
      .attr("gradientUnits", "userSpaceOnUse");
    gradientTP.append("stop").attr("offset", "0%").attr("stop-color", nodeColors.terroir);
    gradientTP.append("stop").attr("offset", "100%").attr("stop-color", nodeColors.plant);
    
    // Gradient plant-molecule
    const gradientPM = defs.append("linearGradient")
      .attr("id", "gradient-plant-molecule")
      .attr("gradientUnits", "userSpaceOnUse");
    gradientPM.append("stop").attr("offset", "0%").attr("stop-color", nodeColors.plant);
    gradientPM.append("stop").attr("offset", "100%").attr("stop-color", nodeColors.molecule);

    // Dessiner les liens
    const link = g
      .append("g")
      .attr("class", "links")
      .selectAll("line")
      .data(linksCopy)
      .join("line")
      .attr("stroke", (d: any) => {
        if (d.type === 'terroir-plant') return "url(#gradient-terroir-plant)";
        return "url(#gradient-plant-molecule)";
      })
      .attr("stroke-opacity", (d: any) => d.isSignature ? 0.7 : 0.4)
      .attr("stroke-width", (d: any) => {
        if (d.isSignature) return 3;
        if (d.percentage) return 1 + (d.percentage / 30);
        return 1.5;
      })
      .attr("stroke-dasharray", (d: any) => d.role === 'trace' ? "4,4" : "none");

    // Dessiner les nœuds
    const node = g
      .append("g")
      .attr("class", "nodes")
      .selectAll("g")
      .data(nodesCopy)
      .join("g")
      .attr("cursor", "pointer") as any;
    
    node.call(
      d3
        .drag<SVGGElement, TerrainNode>()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended)
    );

    // Cercles pour les nœuds avec taille variable
    node
      .append("circle")
      .attr("r", (d: TerrainNode) => {
        switch (d.type) {
          case 'terroir': return 24;
          case 'plant': return 16;
          case 'molecule': return 10;
          default: return 12;
        }
      })
      .attr("fill", (d: TerrainNode) => {
        // Couleur spéciale pour les terroirs selon le climat
        if (d.type === 'terroir' && d.data?.climateType) {
          return climateColors[d.data.climateType] || nodeColors.terroir;
        }
        // Couleur spéciale pour les molécules selon la classe chimique
        if (d.type === 'molecule' && d.data?.chemicalClass) {
          return chemicalClassColors[d.data.chemicalClass] || nodeColors.molecule;
        }
        return nodeColors[d.type];
      })
      .attr("stroke", (d: TerrainNode) => nodeBorderColors[d.type])
      .attr("stroke-width", 2.5)
      .style("filter", "drop-shadow(0 2px 4px rgba(0,0,0,0.2))");

    // Icônes dans les nœuds
    node
      .filter((d: TerrainNode) => d.type === 'terroir' || d.type === 'plant')
      .append("text")
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "central")
      .attr("font-size", (d: TerrainNode) => d.type === 'terroir' ? "14px" : "11px")
      .attr("fill", "white")
      .style("pointer-events", "none")
      .text((d: TerrainNode) => d.type === 'terroir' ? '📍' : '🌿');

    // Labels
    if (showLabels) {
      node
        .append("text")
        .text((d: TerrainNode) => {
          const maxLength = d.type === 'terroir' ? 20 : 15;
          return d.name.length > maxLength
            ? d.name.slice(0, maxLength) + "…"
            : d.name;
        })
        .attr("x", 0)
        .attr("y", (d: TerrainNode) => {
          switch (d.type) {
            case 'terroir': return -32;
            case 'plant': return -24;
            default: return -16;
          }
        })
        .attr("text-anchor", "middle")
        .attr("font-size", (d: TerrainNode) => d.type === 'terroir' ? "11px" : "9px")
        .attr("fill", "currentColor")
        .attr("font-weight", (d: TerrainNode) => d.type === 'terroir' ? "600" : "400")
        .style("pointer-events", "none");
    }

    // Tooltip
    const tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "d3-tooltip-terrain")
      .style("position", "absolute")
      .style("visibility", "hidden")
      .style("background-color", "oklch(0.15 0 0)")
      .style("color", "oklch(0.95 0 0)")
      .style("padding", "12px 16px")
      .style("border-radius", "10px")
      .style("font-size", "12px")
      .style("pointer-events", "none")
      .style("z-index", "1000")
      .style("box-shadow", "0 4px 16px rgba(0,0,0,0.4)")
      .style("max-width", "280px")
      .style("line-height", "1.5");

    node
      .on("mouseover", function (this: SVGGElement, event: any, d: TerrainNode) {
        tooltip.style("visibility", "visible");
        
        let html = `<strong style="font-size: 14px; display: block; margin-bottom: 6px;">${d.name}</strong>`;
        html += `<span style="opacity: 0.7; display: inline-block; padding: 2px 8px; background: ${nodeColors[d.type]}40; border-radius: 4px; margin-bottom: 8px;">${getTypeLabel(d.type)}</span>`;
        
        if (d.data) {
          html += '<div style="border-top: 1px solid rgba(255,255,255,0.1); padding-top: 8px; margin-top: 4px;">';
          if (d.data.latinName) html += `<div style="font-style: italic; opacity: 0.8; margin-bottom: 4px;">${d.data.latinName}</div>`;
          if (d.data.country) html += `<div>🌍 ${d.data.country}${d.data.region ? `, ${d.data.region}` : ''}</div>`;
          if (d.data.climateType) html += `<div>🌡️ ${d.data.climateType}</div>`;
          if (d.data.altitude) html += `<div>⛰️ ${d.data.altitude}</div>`;
          if (d.data.family) html += `<div>🏷️ ${d.data.family}</div>`;
          if (d.data.chemicalClass) html += `<div>🧪 ${d.data.chemicalClass}</div>`;
          if (d.data.olfactiveProfile) html += `<div style="margin-top: 4px; opacity: 0.8;">👃 ${d.data.olfactiveProfile.substring(0, 80)}${d.data.olfactiveProfile.length > 80 ? '...' : ''}</div>`;
          html += '</div>';
        }
        
        // Compter les connexions
        const connectionCount = linksCopy.filter(l => {
          const sourceId = typeof l.source === 'object' ? (l.source as any).id : l.source;
          const targetId = typeof l.target === 'object' ? (l.target as any).id : l.target;
          return sourceId === d.id || targetId === d.id;
        }).length;
        html += `<div style="margin-top: 8px; color: oklch(0.7 0.15 200);">🔗 ${connectionCount} connexion${connectionCount > 1 ? 's' : ''}</div>`;
        
        tooltip.html(html);
        
        // Highlight node
        d3.select(this).select("circle")
          .transition()
          .duration(200)
          .attr("r", (d: any) => {
            switch (d.type) {
              case 'terroir': return 30;
              case 'plant': return 22;
              case 'molecule': return 14;
              default: return 16;
            }
          })
          .attr("stroke-width", 4);
          
        // Highlight connected links si activé
        if (highlightConnected) {
          link
            .attr("stroke-opacity", (l: any) => {
              const sourceId = typeof l.source === 'object' ? l.source.id : l.source;
              const targetId = typeof l.target === 'object' ? l.target.id : l.target;
              return sourceId === d.id || targetId === d.id ? 0.9 : 0.1;
            })
            .attr("stroke-width", (l: any) => {
              const sourceId = typeof l.source === 'object' ? l.source.id : l.source;
              const targetId = typeof l.target === 'object' ? l.target.id : l.target;
              return sourceId === d.id || targetId === d.id ? 4 : 1;
            });
            
          // Dim non-connected nodes
          node.select("circle")
            .attr("opacity", (n: any) => {
              if (n.id === d.id) return 1;
              const isConnected = linksCopy.some(l => {
                const sourceId = typeof l.source === 'object' ? (l.source as any).id : l.source;
                const targetId = typeof l.target === 'object' ? (l.target as any).id : l.target;
                return (sourceId === d.id && targetId === n.id) || (targetId === d.id && sourceId === n.id);
              });
              return isConnected ? 1 : 0.3;
            });
        }
      })
      .on("mousemove", function (this: SVGGElement, event: any) {
        tooltip
          .style("top", event.pageY - 10 + "px")
          .style("left", event.pageX + 15 + "px");
      })
      .on("mouseout", function (this: SVGGElement, event: any, d: TerrainNode) {
        tooltip.style("visibility", "hidden");
        
        d3.select(this).select("circle")
          .transition()
          .duration(200)
          .attr("r", (d: any) => {
            switch (d.type) {
              case 'terroir': return 24;
              case 'plant': return 16;
              case 'molecule': return 10;
              default: return 12;
            }
          })
          .attr("stroke-width", 2.5);
          
        // Reset links and nodes
        link
          .attr("stroke-opacity", (d: any) => d.isSignature ? 0.7 : 0.4)
          .attr("stroke-width", (d: any) => {
            if (d.isSignature) return 3;
            if (d.percentage) return 1 + (d.percentage / 30);
            return 1.5;
          });
          
        node.select("circle").attr("opacity", 1);
      })
      .on("click", function (this: SVGGElement, event: any, d: TerrainNode) {
        setSelectedNode(d);
      });

    // Drag functions
    function dragstarted(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event: any, d: any) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    // Update positions on tick
    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      node.attr("transform", (d: any) => `translate(${d.x},${d.y})`);
      
      // Update gradients
      defs.select("#gradient-terroir-plant")
        .attr("x1", linksCopy.find(l => l.type === 'terroir-plant')?.source as any)
        .attr("y1", linksCopy.find(l => l.type === 'terroir-plant')?.source as any)
        .attr("x2", linksCopy.find(l => l.type === 'terroir-plant')?.target as any)
        .attr("y2", linksCopy.find(l => l.type === 'terroir-plant')?.target as any);
    });

    // Cleanup
    return () => {
      tooltip.remove();
      simulation.stop();
    };
  }, [filteredData, dimensions, showLabels, highlightConnected]);

  // Helper pour les labels de type
  function getTypeLabel(type: string): string {
    switch (type) {
      case 'terroir': return '📍 Terroir';
      case 'plant': return '🌿 Plante';
      case 'molecule': return '⚗️ Molécule';
      default: return type;
    }
  }

  // Fonctions de zoom
  const handleZoomIn = () => {
    if (svgRef.current) {
      const svg = d3.select(svgRef.current);
      svg.transition().duration(300).call(
        (d3.zoom() as any).scaleBy, 1.3
      );
    }
  };

  const handleZoomOut = () => {
    if (svgRef.current) {
      const svg = d3.select(svgRef.current);
      svg.transition().duration(300).call(
        (d3.zoom() as any).scaleBy, 0.7
      );
    }
  };

  const handleReset = () => {
    if (svgRef.current) {
      const svg = d3.select(svgRef.current);
      svg.transition().duration(500).call(
        (d3.zoom() as any).transform,
        d3.zoomIdentity
      );
    }
    setSearchTerm("");
    setFilterType("all");
    setSelectedNode(null);
  };

  return (
    <div className="space-y-4" ref={containerRef}>
      {/* Contrôles */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex flex-wrap items-center gap-4">
            {/* Recherche */}
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un terroir, plante ou molécule..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            
            {/* Filtre par type */}
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[160px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                <SelectItem value="terroir">📍 Terroirs</SelectItem>
                <SelectItem value="plant">🌿 Plantes</SelectItem>
                <SelectItem value="molecule">⚗️ Molécules</SelectItem>
              </SelectContent>
            </Select>
            
            {/* Options */}
            <div className="flex items-center gap-4">
              <div className="flex items-center space-x-2">
                <Switch 
                  id="show-labels" 
                  checked={showLabels}
                  onCheckedChange={setShowLabels}
                />
                <Label htmlFor="show-labels" className="text-sm">Labels</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch 
                  id="highlight-connected" 
                  checked={highlightConnected}
                  onCheckedChange={setHighlightConnected}
                />
                <Label htmlFor="highlight-connected" className="text-sm">Surbrillance</Label>
              </div>
            </div>
            
            {/* Boutons de zoom */}
            <div className="flex items-center gap-1">
              <Button variant="outline" size="icon" onClick={handleZoomIn} title="Zoom avant">
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={handleZoomOut} title="Zoom arrière">
                <ZoomOut className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={handleReset} title="Réinitialiser">
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistiques */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <Card className="bg-gradient-to-br from-orange-500/10 to-orange-600/5 border-orange-500/20">
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-orange-500" />
              <span className="text-sm text-muted-foreground">Terroirs</span>
            </div>
            <p className="text-2xl font-bold text-orange-600">{stats.terroirCount}</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/20">
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center gap-2">
              <Leaf className="h-4 w-4 text-green-500" />
              <span className="text-sm text-muted-foreground">Plantes</span>
            </div>
            <p className="text-2xl font-bold text-green-600">{stats.plantCount}</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20">
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center gap-2">
              <FlaskConical className="h-4 w-4 text-blue-500" />
              <span className="text-sm text-muted-foreground">Molécules</span>
            </div>
            <p className="text-2xl font-bold text-blue-600">{stats.moleculeCount}</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 border-amber-500/20">
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center gap-2">
              <span className="text-amber-500">🔗</span>
              <span className="text-sm text-muted-foreground">Terroir→Plante</span>
            </div>
            <p className="text-2xl font-bold text-amber-600">{stats.terroirPlantLinks}</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20">
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center gap-2">
              <span className="text-purple-500">🔗</span>
              <span className="text-sm text-muted-foreground">Plante→Molécule</span>
            </div>
            <p className="text-2xl font-bold text-purple-600">{stats.plantMoleculeLinks}</p>
          </CardContent>
        </Card>
      </div>

      {/* Graphe SVG */}
      <Card>
        <CardContent className="p-0 overflow-hidden">
          {filteredData.nodes.length > 0 ? (
            <svg
              ref={svgRef}
              width={dimensions.width}
              height={dimensions.height}
              className="bg-gradient-to-br from-background to-muted/30"
              style={{ display: "block" }}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-[600px] text-muted-foreground">
              <Search className="h-12 w-12 mb-4 opacity-50" />
              <p className="text-lg font-medium">Aucun résultat</p>
              <p className="text-sm">
                {searchTerm 
                  ? `Aucun élément ne correspond à "${searchTerm}"`
                  : "Aucune donnée disponible pour les filtres sélectionnés"}
              </p>
              <Button variant="outline" className="mt-4" onClick={handleReset}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Réinitialiser les filtres
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Détails du nœud sélectionné */}
      {selectedNode && (
        <Card className="border-primary/30">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                {selectedNode.type === 'terroir' && <MapPin className="h-5 w-5 text-orange-500" />}
                {selectedNode.type === 'plant' && <Leaf className="h-5 w-5 text-green-500" />}
                {selectedNode.type === 'molecule' && <FlaskConical className="h-5 w-5 text-blue-500" />}
                {selectedNode.name}
              </CardTitle>
              <Badge variant="outline">{getTypeLabel(selectedNode.type)}</Badge>
            </div>
            {selectedNode.data?.latinName && (
              <CardDescription className="italic">{selectedNode.data.latinName}</CardDescription>
            )}
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              {selectedNode.data?.country && (
                <div>
                  <span className="text-muted-foreground">Pays</span>
                  <p className="font-medium">{selectedNode.data.country}</p>
                </div>
              )}
              {selectedNode.data?.region && (
                <div>
                  <span className="text-muted-foreground">Région</span>
                  <p className="font-medium">{selectedNode.data.region}</p>
                </div>
              )}
              {selectedNode.data?.climateType && (
                <div>
                  <span className="text-muted-foreground">Climat</span>
                  <p className="font-medium">{selectedNode.data.climateType}</p>
                </div>
              )}
              {selectedNode.data?.altitude && (
                <div>
                  <span className="text-muted-foreground">Altitude</span>
                  <p className="font-medium">{selectedNode.data.altitude}</p>
                </div>
              )}
              {selectedNode.data?.family && (
                <div>
                  <span className="text-muted-foreground">Famille</span>
                  <p className="font-medium">{selectedNode.data.family}</p>
                </div>
              )}
              {selectedNode.data?.chemicalClass && (
                <div>
                  <span className="text-muted-foreground">Classe chimique</span>
                  <p className="font-medium">{selectedNode.data.chemicalClass}</p>
                </div>
              )}
              {selectedNode.data?.casNumber && (
                <div>
                  <span className="text-muted-foreground">CAS</span>
                  <p className="font-medium font-mono">{selectedNode.data.casNumber}</p>
                </div>
              )}
            </div>
            {selectedNode.data?.olfactiveProfile && (
              <div className="mt-4">
                <span className="text-muted-foreground text-sm">Profil olfactif</span>
                <p className="text-sm mt-1">{selectedNode.data.olfactiveProfile}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Légende */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Légende</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs" style={{ backgroundColor: nodeColors.terroir }}>📍</div>
              <span>Terroir (zone de production)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full flex items-center justify-center text-white text-xs" style={{ backgroundColor: nodeColors.plant }}>🌿</div>
              <span>Plante aromatique</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: nodeColors.molecule }}></div>
              <span>Molécule</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-1 rounded" style={{ background: `linear-gradient(90deg, ${nodeColors.terroir}, ${nodeColors.plant})` }}></div>
              <span>Terroir → Plante</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-1 rounded" style={{ background: `linear-gradient(90deg, ${nodeColors.plant}, ${nodeColors.molecule})` }}></div>
              <span>Plante → Molécule</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default TerrainPlantMoleculeGraph;
