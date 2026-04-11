import { useEffect, useRef, useState, useMemo } from "react";
import * as d3 from "d3";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ZoomIn, ZoomOut, Maximize2, Leaf, MapPin, Beaker, FlaskConical } from "lucide-react";

export interface NetworkNode {
  id: string;
  name: string;
  type: 'plant' | 'terroir' | 'molecule' | 'rawMaterial';
  data?: {
    latinName?: string;
    category?: string;
    country?: string;
    region?: string;
    climateType?: string;
    family?: string;
    chemicalClass?: string;
    plantPart?: string;
  };
}

export interface NetworkLink {
  source: string;
  target: string;
  type: 'plant-terroir' | 'plant-molecule' | 'rawMaterial-terroir' | 'rawMaterial-molecule';
  value?: number;
}

interface PlantTerroirNetworkGraphProps {
  nodes: NetworkNode[];
  links: NetworkLink[];
  width?: number;
  height?: number;
}

// Couleurs par type de nœud
const nodeColors: Record<string, string> = {
  plant: "oklch(0.65 0.18 142)", // Vert
  terroir: "oklch(0.60 0.15 45)", // Orange/Terre
  molecule: "oklch(0.60 0.15 250)", // Bleu
  rawMaterial: "oklch(0.65 0.15 320)", // Violet
};

// Couleurs par type de lien
const linkColors: Record<string, string> = {
  'plant-terroir': "oklch(0.55 0.10 80)",
  'plant-molecule': "oklch(0.55 0.10 200)",
  'rawMaterial-terroir': "oklch(0.55 0.10 40)",
  'rawMaterial-molecule': "oklch(0.55 0.10 280)",
};

export function PlantTerroirNetworkGraph({
  nodes,
  links,
  width = 1200,
  height = 800,
}: PlantTerroirNetworkGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [zoom, setZoom] = useState(1);
  const [showLabels, setShowLabels] = useState(true);
  const [selectedNode, setSelectedNode] = useState<NetworkNode | null>(null);

  // Statistiques du graphe
  const stats = useMemo(() => {
    const plantCount = nodes.filter(n => n.type === 'plant').length;
    const terroirCount = nodes.filter(n => n.type === 'terroir').length;
    const moleculeCount = nodes.filter(n => n.type === 'molecule').length;
    const rawMaterialCount = nodes.filter(n => n.type === 'rawMaterial').length;
    const plantTerroirLinks = links.filter(l => l.type === 'plant-terroir').length;
    
    return {
      plantCount,
      terroirCount,
      moleculeCount,
      rawMaterialCount,
      plantTerroirLinks,
      totalNodes: nodes.length,
      totalLinks: links.length,
    };
  }, [nodes, links]);

  useEffect(() => {
    if (!svgRef.current || nodes.length === 0) return;

    // Clear previous content
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3.select(svgRef.current);
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

    // Force simulation
    const simulation = d3
      .forceSimulation<NetworkNode>(nodes)
      .force(
        "link",
        d3
          .forceLink(links)
          .id((d) => d.id)
          .distance((d) => {
            // Distance plus grande pour les liens plante-terroir
            if (d.type === 'plant-terroir') return 150;
            return 80;
          })
      )
      .force("charge", d3.forceManyBody().strength(-400))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(40))
      .force("x", d3.forceX(width / 2).strength(0.05))
      .force("y", d3.forceY(height / 2).strength(0.05));

    // Links
    const link = g
      .append("g")
      .attr("class", "links")
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke", (d) => linkColors[d.type] || "oklch(0.5 0 0)")
      .attr("stroke-opacity", 0.4)
      .attr("stroke-width", (d) => d.value ? Math.sqrt(d.value) + 1 : 2)
      .attr("stroke-dasharray", (d) => d.type === 'plant-terroir' ? "none" : "4,2");

    // Nodes
    const node = g
      .append("g")
      .attr("class", "nodes")
      .selectAll("g")
      .data(nodes)
      .join("g");
    
    node.call(
      d3
        .drag<SVGGElement, NetworkNode>()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended)
    );

    // Node circles avec taille variable selon le type
    node
      .append("circle")
      .attr("r", (d: NetworkNode) => {
        switch (d.type) {
          case 'terroir': return 16;
          case 'plant': return 12;
          case 'molecule': return 8;
          case 'rawMaterial': return 10;
          default: return 10;
        }
      })
      .attr("fill", (d: NetworkNode) => nodeColors[d.type])
      .attr("stroke", "oklch(0.95 0 0)")
      .attr("stroke-width", 2)
      .style("cursor", "pointer");

    // Icônes dans les nœuds (pour les plus grands)
    node
      .filter((d: NetworkNode) => d.type === 'terroir' || d.type === 'plant')
      .append("text")
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "central")
      .attr("font-size", (d: NetworkNode) => d.type === 'terroir' ? "12px" : "10px")
      .attr("fill", "white")
      .text((d: NetworkNode) => d.type === 'terroir' ? '📍' : '🌿');

    // Node labels
    if (showLabels) {
      node
        .append("text")
        .text((d: NetworkNode) => {
          const maxLength = 12;
          return d.name.length > maxLength
            ? d.name.slice(0, maxLength) + "…"
            : d.name;
        })
        .attr("x", 0)
        .attr("y", (d: NetworkNode) => {
          switch (d.type) {
            case 'terroir': return -22;
            case 'plant': return -18;
            default: return -14;
          }
        })
        .attr("text-anchor", "middle")
        .attr("font-size", "9px")
        .attr("fill", "currentColor")
        .attr("font-weight", (d: NetworkNode) => d.type === 'terroir' ? "600" : "400")
        .style("pointer-events", "none");
    }

    // Tooltip
    const tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "d3-tooltip")
      .style("position", "absolute")
      .style("visibility", "hidden")
      .style("background-color", "oklch(0.15 0 0)")
      .style("color", "oklch(0.95 0 0)")
      .style("padding", "10px 14px")
      .style("border-radius", "8px")
      .style("font-size", "12px")
      .style("pointer-events", "none")
      .style("z-index", "1000")
      .style("box-shadow", "0 4px 12px rgba(0,0,0,0.4)")
      .style("max-width", "250px");

    node
      .on("mouseover", function (this: SVGGElement, event: MouseEvent, d: NetworkNode) {
        tooltip.style("visibility", "visible");
        
        let html = `<strong style="font-size: 13px;">${d.name}</strong><br/>`;
        html += `<span style="opacity: 0.7;">Type: ${getTypeLabel(d.type)}</span>`;
        
        if (d.data) {
          if (d.data.latinName) html += `<br/><em style="opacity: 0.8;">${d.data.latinName}</em>`;
          if (d.data.country) html += `<br/>Pays: ${d.data.country}`;
          if (d.data.region) html += `<br/>Région: ${d.data.region}`;
          if (d.data.climateType) html += `<br/>Climat: ${d.data.climateType}`;
          if (d.data.category) html += `<br/>Catégorie: ${d.data.category}`;
          if (d.data.family) html += `<br/>Famille: ${d.data.family}`;
        }
        
        // Compter les connexions
        const connectionCount = links.filter(l => 
          l.source === d.id || l.target === d.id ||
          (typeof l.source === 'object' && l.source.id === d.id) ||
          (typeof l.target === 'object' && l.target.id === d.id)
        ).length;
        html += `<br/><span style="color: oklch(0.7 0.1 200);">${connectionCount} connexion(s)</span>`;
        
        tooltip.html(html);
        
        // Highlight node
        d3.select(this).select("circle")
          .transition()
          .duration(200)
          .attr("r", (d: NetworkNode) => {
            switch (d.type) {
              case 'terroir': return 20;
              case 'plant': return 16;
              case 'molecule': return 12;
              case 'rawMaterial': return 14;
              default: return 14;
            }
          });
          
        // Highlight connected links
        link
          .attr("stroke-opacity", (l: NetworkLink) => {
            const sourceId = typeof l.source === 'object' ? l.source.id : l.source;
            const targetId = typeof l.target === 'object' ? l.target.id : l.target;
            return sourceId === d.id || targetId === d.id ? 0.8 : 0.1;
          })
          .attr("stroke-width", (l: NetworkLink) => {
            const sourceId = typeof l.source === 'object' ? l.source.id : l.source;
            const targetId = typeof l.target === 'object' ? l.target.id : l.target;
            return sourceId === d.id || targetId === d.id ? 4 : 1;
          });
      })
      .on("mousemove", function (this: SVGGElement, event: MouseEvent) {
        tooltip
          .style("top", event.pageY - 10 + "px")
          .style("left", event.pageX + 15 + "px");
      })
      .on("mouseout", function (this: SVGGElement, event: MouseEvent, d: NetworkNode) {
        tooltip.style("visibility", "hidden");
        
        d3.select(this).select("circle")
          .transition()
          .duration(200)
          .attr("r", (d: NetworkNode) => {
            switch (d.type) {
              case 'terroir': return 16;
              case 'plant': return 12;
              case 'molecule': return 8;
              case 'rawMaterial': return 10;
              default: return 10;
            }
          });
          
        // Reset links
        link
          .attr("stroke-opacity", 0.4)
          .attr("stroke-width", (d: NetworkLink) => d.value ? Math.sqrt(d.value) + 1 : 2);
      })
      .on("click", function (this: SVGGElement, event: MouseEvent, d: NetworkNode) {
        setSelectedNode(d);
      });

    // Update positions on tick
    simulation.on("tick", () => {
      link
        .attr("x1", (d: NetworkLink) => (typeof d.source === 'object' ? d.source.x ?? 0 : 0))
        .attr("y1", (d: NetworkLink) => (typeof d.source === 'object' ? d.source.y ?? 0 : 0))
        .attr("x2", (d: NetworkLink) => (typeof d.target === 'object' ? d.target.x ?? 0 : 0))
        .attr("y2", (d: NetworkLink) => (typeof d.target === 'object' ? d.target.y ?? 0 : 0));

      node.attr("transform", (d: NetworkNode) => `translate(${d.x ?? 0},${d.y ?? 0})`);
    });

    // Drag functions
    function dragstarted(event: d3.D3DragEvent<SVGGElement, NetworkNode, NetworkNode>, d: NetworkNode) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event: d3.D3DragEvent<SVGGElement, NetworkNode, NetworkNode>, d: NetworkNode) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event: d3.D3DragEvent<SVGGElement, NetworkNode, NetworkNode>, d: NetworkNode) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    // Cleanup
    return () => {
      simulation.stop();
      tooltip.remove();
    };
  }, [nodes, links, width, height, showLabels]);

  const handleZoomIn = () => {
    const svg = d3.select(svgRef.current);
    svg.transition().call(
      (t: d3.Transition<SVGSVGElement, unknown, null, undefined>) =>
        d3.zoom<SVGSVGElement, unknown>().scaleBy(t, 1.3)
    );
  };

  const handleZoomOut = () => {
    const svg = d3.select(svgRef.current);
    svg.transition().call(
      (t: d3.Transition<SVGSVGElement, unknown, null, undefined>) =>
        d3.zoom<SVGSVGElement, unknown>().scaleBy(t, 0.7)
    );
  };

  const handleReset = () => {
    const svg = d3.select(svgRef.current);
    svg
      .transition()
      .duration(750)
      .call(
        (t: d3.Transition<SVGSVGElement, unknown, null, undefined>) =>
          d3.zoom<SVGSVGElement, unknown>().transform(t, d3.zoomIdentity)
      );
  };

  if (nodes.length === 0) {
    return (
      <Card className="p-6">
        <p className="text-muted-foreground text-center">
          Aucune donnée disponible pour le graphe de réseau
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Statistiques */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <Card className="p-3 text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Leaf className="h-4 w-4 text-green-500" />
            <span className="text-lg font-bold">{stats.plantCount}</span>
          </div>
          <p className="text-xs text-muted-foreground">Plantes</p>
        </Card>
        <Card className="p-3 text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <MapPin className="h-4 w-4 text-orange-500" />
            <span className="text-lg font-bold">{stats.terroirCount}</span>
          </div>
          <p className="text-xs text-muted-foreground">Terroirs</p>
        </Card>
        <Card className="p-3 text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Beaker className="h-4 w-4 text-blue-500" />
            <span className="text-lg font-bold">{stats.moleculeCount}</span>
          </div>
          <p className="text-xs text-muted-foreground">Molécules</p>
        </Card>
        <Card className="p-3 text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <FlaskConical className="h-4 w-4 text-purple-500" />
            <span className="text-lg font-bold">{stats.rawMaterialCount}</span>
          </div>
          <p className="text-xs text-muted-foreground">Matières</p>
        </Card>
        <Card className="p-3 text-center">
          <div className="text-lg font-bold mb-1">{stats.plantTerroirLinks}</div>
          <p className="text-xs text-muted-foreground">Liens Plante-Terroir</p>
        </Card>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleZoomIn}>
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleZoomOut}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleReset}>
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          <Switch
            id="show-labels"
            checked={showLabels}
            onCheckedChange={setShowLabels}
          />
          <Label htmlFor="show-labels" className="text-sm">Afficher les noms</Label>
        </div>
        
        <div className="text-sm text-muted-foreground">
          Zoom: {(zoom * 100).toFixed(0)}%
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 items-center justify-center">
        <Badge
          variant="outline"
          className="flex items-center gap-1"
          style={{
            backgroundColor: nodeColors.plant,
            color: "white",
            borderColor: nodeColors.plant,
          }}
        >
          <Leaf className="h-3 w-3" />
          Plantes
        </Badge>
        <Badge
          variant="outline"
          className="flex items-center gap-1"
          style={{
            backgroundColor: nodeColors.terroir,
            color: "white",
            borderColor: nodeColors.terroir,
          }}
        >
          <MapPin className="h-3 w-3" />
          Terroirs
        </Badge>
        <Badge
          variant="outline"
          className="flex items-center gap-1"
          style={{
            backgroundColor: nodeColors.molecule,
            color: "white",
            borderColor: nodeColors.molecule,
          }}
        >
          <Beaker className="h-3 w-3" />
          Molécules
        </Badge>
        <Badge
          variant="outline"
          className="flex items-center gap-1"
          style={{
            backgroundColor: nodeColors.rawMaterial,
            color: "white",
            borderColor: nodeColors.rawMaterial,
          }}
        >
          <FlaskConical className="h-3 w-3" />
          Matières Premières
        </Badge>
      </div>

      {/* Graph */}
      <Card className="overflow-hidden">
        <svg
          ref={svgRef}
          width={width}
          height={height}
          style={{
            maxWidth: "100%",
            height: "auto",
            cursor: "grab",
          }}
        />
      </Card>

      {/* Selected node info */}
      {selectedNode && (
        <Card className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-lg">{selectedNode.name}</h3>
              <p className="text-sm text-muted-foreground">{getTypeLabel(selectedNode.type)}</p>
              {selectedNode.data && (
                <div className="mt-2 text-sm space-y-1">
                  {selectedNode.data.latinName && <p><em>{selectedNode.data.latinName}</em></p>}
                  {selectedNode.data.country && <p>Pays: {selectedNode.data.country}</p>}
                  {selectedNode.data.region && <p>Région: {selectedNode.data.region}</p>}
                  {selectedNode.data.category && <p>Catégorie: {selectedNode.data.category}</p>}
                  {selectedNode.data.family && <p>Famille: {selectedNode.data.family}</p>}
                </div>
              )}
            </div>
            <Button variant="ghost" size="sm" onClick={() => setSelectedNode(null)}>
              ✕
            </Button>
          </div>
        </Card>
      )}

      {/* Instructions */}
      <p className="text-xs text-muted-foreground text-center">
        Glissez les nœuds pour réorganiser • Scroll pour zoomer • Cliquez pour voir les détails • Survolez pour mettre en évidence les connexions
      </p>
    </div>
  );
}

function getTypeLabel(type: string): string {
  switch (type) {
    case 'plant': return 'Plante';
    case 'terroir': return 'Terroir';
    case 'molecule': return 'Molécule';
    case 'rawMaterial': return 'Matière Première';
    default: return type;
  }
}
