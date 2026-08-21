import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { 
  BookOpen, 
  FlaskConical, 
  Network, 
  Filter, 
  Download, 
  ZoomIn, 
  ZoomOut, 
  Maximize2,
  Search,
  ExternalLink
} from "lucide-react";
import * as d3 from "d3";

interface GraphNode {
  id: string;
  type: "publication" | "molecule";
  label: string;
  year?: number;
  formula?: string;
  chemicalClass?: string;
  journal?: string;
}

interface GraphLink {
  source: string;
  target: string;
  relationshipType: string;
  notes?: string;
}

export default function PublicationMoleculeGraph() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [filterType, setFilterType] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [zoom, setZoom] = useState(1);

  const { data, isLoading } = trpc.research.getPublicationMoleculeLinks.useQuery({});

  // Build graph data
  const graphData = {
    nodes: [] as GraphNode[],
    links: [] as GraphLink[],
  };

  if (data?.success) {
    // Add publication nodes
    data.publications?.forEach((pub: any) => {
      graphData.nodes.push({
        id: `pub-${pub.id}`,
        type: "publication",
        label: pub.title?.substring(0, 40) + (pub.title?.length > 40 ? "..." : ""),
        year: pub.year,
        journal: pub.journal,
      });
    });

    // Add molecule nodes
    data.molecules?.forEach((mol: any) => {
      graphData.nodes.push({
        id: `mol-${mol.id}`,
        type: "molecule",
        label: mol.name,
        formula: mol.formula,
        chemicalClass: mol.chemical_class,
      });
    });

    // Add links
    data.links?.forEach((link: any) => {
      graphData.links.push({
        source: `pub-${link.publication_id}`,
        target: `mol-${link.molecule_id}`,
        relationshipType: link.relationship_type,
        notes: link.notes,
      });
    });
  }

  // Filter nodes and links
  const filteredData = {
    nodes: graphData.nodes.filter((node) => {
      if (searchTerm) {
        return node.label.toLowerCase().includes(searchTerm.toLowerCase());
      }
      return true;
    }),
    links: graphData.links.filter((link) => {
      if (filterType !== "all") {
        return link.relationshipType === filterType;
      }
      return true;
    }),
  };

  // D3 visualization
  useEffect(() => {
    if (!svgRef.current || filteredData.nodes.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = svgRef.current.clientWidth;
    const height = 600;

    // Create zoom behavior
    const zoomBehavior = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 4])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
        setZoom(event.transform.k);
      });

    svg.call(zoomBehavior);

    const g = svg.append("g");

    // Create simulation
    const simulation = d3.forceSimulation(filteredData.nodes as any)
      .force("link", d3.forceLink(filteredData.links as any)
        .id((d: any) => d.id)
        .distance(100))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(40));

    // Create links
    const link = g.append("g")
      .attr("class", "links")
      .selectAll("line")
      .data(filteredData.links)
      .enter()
      .append("line")
      .attr("stroke", (d) => {
        switch (d.relationshipType) {
          case "studies": return "#10b981";
          case "analyzes": return "#3b82f6";
          case "mentions": return "#8b5cf6";
          case "synthesizes": return "#f59e0b";
          default: return "#6b7280";
        }
      })
      .attr("stroke-width", 2)
      .attr("stroke-opacity", 0.6);

    // Create nodes
    const node = g.append("g")
      .attr("class", "nodes")
      .selectAll("g")
      .data(filteredData.nodes)
      .enter()
      .append("g")
      .attr("cursor", "pointer")
      .call(d3.drag<SVGGElement, GraphNode>()
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
        }) as any)
      .on("click", (event, d) => {
        setSelectedNode(d);
      });

    // Add circles for nodes
    node.append("circle")
      .attr("r", (d) => d.type === "publication" ? 20 : 15)
      .attr("fill", (d) => d.type === "publication" ? "#3b82f6" : "#10b981")
      .attr("stroke", "#fff")
      .attr("stroke-width", 2);

    // Add icons
    node.append("text")
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "central")
      .attr("fill", "white")
      .attr("font-size", (d) => d.type === "publication" ? "12px" : "10px")
      .text((d) => d.type === "publication" ? "📄" : "🧪");

    // Add labels
    node.append("text")
      .attr("dy", (d) => d.type === "publication" ? 35 : 28)
      .attr("text-anchor", "middle")
      .attr("fill", "#374151")
      .attr("font-size", "10px")
      .attr("font-weight", "500")
      .text((d) => d.label.length > 20 ? d.label.substring(0, 20) + "..." : d.label);

    // Update positions
    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      node.attr("transform", (d: any) => `translate(${d.x},${d.y})`);
    });

    return () => {
      simulation.stop();
    };
  }, [filteredData.nodes.length, filteredData.links.length, filterType, searchTerm]);

  // Export as PNG
  const exportPNG = () => {
    if (!svgRef.current) return;
    const svgData = new XMLSerializer().serializeToString(svgRef.current);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const link = document.createElement("a");
      link.download = "publication-molecule-graph.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    };
    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
  };

  return (
    <div className="container py-8">
      <Breadcrumbs />
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
          <Network className="h-8 w-8 text-blue-600" />
          Graphe Publications ↔ Molécules
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Visualisation des relations entre les publications scientifiques et les molécules étudiées
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{data?.stats?.totalPublications || 0}</p>
                <p className="text-sm text-gray-500">Publications</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 dark:bg-emerald-900 rounded-lg">
                <FlaskConical className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{data?.stats?.totalMolecules || 0}</p>
                <p className="text-sm text-gray-500">Molécules</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <Network className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{data?.stats?.totalLinks || 0}</p>
                <p className="text-sm text-gray-500">Liaisons</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 dark:bg-amber-900 rounded-lg">
                <Filter className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{filteredData.links.length}</p>
                <p className="text-sm text-gray-500">Liaisons filtrées</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <Card className="mb-6">
        <CardContent className="pt-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-48"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Type de relation" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes</SelectItem>
                <SelectItem value="studies">Étudie</SelectItem>
                <SelectItem value="analyzes">Analyse</SelectItem>
                <SelectItem value="mentions">Mentionne</SelectItem>
                <SelectItem value="synthesizes">Synthétise</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setZoom(Math.min(zoom * 1.2, 4))}>
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => setZoom(Math.max(zoom / 1.2, 0.1))}>
                <ZoomOut className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={exportPNG}>
                <Download className="h-4 w-4 mr-1" />
                PNG
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      <Card className="mb-6">
        <CardContent className="pt-4">
          <div className="flex flex-wrap gap-6 items-center">
            <span className="text-sm font-medium">Légende :</span>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-blue-500" />
              <span className="text-sm">Publication</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-emerald-500" />
              <span className="text-sm">Molécule</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-1 bg-emerald-500" />
              <span className="text-sm">Étudie</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-1 bg-blue-500" />
              <span className="text-sm">Analyse</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-1 bg-purple-500" />
              <span className="text-sm">Mentionne</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-1 bg-amber-500" />
              <span className="text-sm">Synthétise</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Graph */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Graphe de relations</CardTitle>
          <CardDescription>
            Cliquez sur un nœud pour voir les détails. Glissez pour déplacer les nœuds.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="h-[600px] flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
            </div>
          ) : (
            <svg
              ref={svgRef}
              width="100%"
              height="600"
              className="bg-gray-50 dark:bg-gray-900 rounded-lg"
            />
          )}
        </CardContent>
      </Card>

      {/* Selected node details */}
      {selectedNode && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {selectedNode.type === "publication" ? (
                <BookOpen className="h-5 w-5 text-blue-600" />
              ) : (
                <FlaskConical className="h-5 w-5 text-emerald-600" />
              )}
              {selectedNode.label}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p><strong>Type :</strong> {selectedNode.type === "publication" ? "Publication" : "Molécule"}</p>
              {selectedNode.year && <p><strong>Année :</strong> {selectedNode.year}</p>}
              {selectedNode.journal && <p><strong>Journal :</strong> {selectedNode.journal}</p>}
              {selectedNode.formula && <p><strong>Formule :</strong> {selectedNode.formula}</p>}
              {selectedNode.chemicalClass && <p><strong>Classe chimique :</strong> {selectedNode.chemicalClass}</p>}
              <div className="pt-4">
                {selectedNode.type === "molecule" && (
                  <Link href={`/molecules/${selectedNode.id.replace("mol-", "")}`}>
                    <Button size="sm">
                      <ExternalLink className="h-4 w-4 mr-1" />
                      Voir la fiche molécule
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Related tools */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Outils connexes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Link href="/bibliographie">
              <Button variant="outline" size="sm">
                <BookOpen className="h-4 w-4 mr-1" />
                Publications scientifiques
              </Button>
            </Link>
            <Link href="/molecules">
              <Button variant="outline" size="sm">
                <FlaskConical className="h-4 w-4 mr-1" />
                Base de molécules
              </Button>
            </Link>
            <Link href="/molecular-transformations">
              <Button variant="outline" size="sm">
                <Network className="h-4 w-4 mr-1" />
                Transformations moléculaires
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
