import { useRef, useEffect, useState, useMemo } from "react";
import * as d3 from "d3";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FlaskConical, 
  Search, 
  ZoomIn, 
  ZoomOut, 
  Maximize2,
  Network,
  GitBranch,
  Download
} from "lucide-react";

interface ChemicalFamily {
  id: number;
  name: string;
  type: string;
  subcategory?: string | null;
  description?: string | null;
  olfactiveRole?: string | null;
}

interface MoleculeChemicalFamilyLink {
  moleculeId: number;
  moleculeName: string;
  moleculeFamily?: string | null;
  chemicalFamilyId: number;
  chemicalFamilyName: string;
  chemicalFamilyType: string;
}

interface ChemicalFamilyHierarchyGraphProps {
  links: MoleculeChemicalFamilyLink[];
  chemicalFamilies: ChemicalFamily[];
  isLoading?: boolean;
  height?: number;
}

interface TreeNode {
  id: string;
  name: string;
  type: "root" | "category" | "family" | "molecule";
  children?: TreeNode[];
  data?: any;
}

interface GraphNode {
  id: string;
  name: string;
  type: "family" | "molecule";
  family?: string | null;
  linkCount: number;
}

interface GraphLink {
  source: string;
  target: string;
}

// Couleurs par catégorie de famille chimique
const categoryColors: Record<string, string> = {
  // Terpènes
  monoterpene: "#22c55e",
  sesquiterpene: "#16a34a",
  diterpene: "#15803d",
  triterpene: "#166534",
  monoterpenoid: "#4ade80",
  sesquiterpenoid: "#86efac",
  // Alcools
  alcohol_aliphatic: "#3b82f6",
  alcohol_aromatic: "#2563eb",
  alcohol_terpenic: "#1d4ed8",
  // Aldéhydes
  aldehyde_aliphatic: "#f59e0b",
  aldehyde_aromatic: "#d97706",
  aldehyde_terpenic: "#b45309",
  // Cétones
  ketone_aliphatic: "#ef4444",
  ketone_aromatic: "#dc2626",
  ketone_terpenic: "#b91c1c",
  ketone_macrocyclic: "#991b1b",
  // Esters
  ester_aliphatic: "#06b6d4",
  ester_aromatic: "#0891b2",
  ester_terpenic: "#0e7490",
  // Éthers
  ether_aliphatic: "#8b5cf6",
  ether_aromatic: "#7c3aed",
  // Phénols
  phenol: "#ec4899",
  phenol_ether: "#db2777",
  // Lactones & Coumarines
  lactone: "#f97316",
  lactone_macrocyclic: "#ea580c",
  coumarin: "#c2410c",
  // Muscs
  musk_nitro: "#a855f7",
  musk_polycyclic: "#9333ea",
  musk_macrocyclic: "#7e22ce",
  musk_linear: "#6b21a8",
  // Composés azotés
  nitrile: "#14b8a6",
  indole: "#0d9488",
  pyrazine: "#0f766e",
  pyridine: "#115e59",
  amine: "#134e4a",
  // Composés soufrés
  sulfur_compound: "#eab308",
  thiophene: "#ca8a04",
  // Autres
  default: "#64748b",
};

// Groupes de catégories pour l'arbre hiérarchique
const categoryGroups: Record<string, string[]> = {
  "Terpènes": ["monoterpene", "sesquiterpene", "diterpene", "triterpene", "monoterpenoid", "sesquiterpenoid"],
  "Alcools": ["alcohol_aliphatic", "alcohol_aromatic", "alcohol_terpenic"],
  "Aldéhydes": ["aldehyde_aliphatic", "aldehyde_aromatic", "aldehyde_terpenic"],
  "Cétones": ["ketone_aliphatic", "ketone_aromatic", "ketone_terpenic", "ketone_macrocyclic"],
  "Esters": ["ester_aliphatic", "ester_aromatic", "ester_terpenic"],
  "Éthers": ["ether_aliphatic", "ether_aromatic"],
  "Phénols": ["phenol", "phenol_ether"],
  "Lactones & Coumarines": ["lactone", "lactone_macrocyclic", "coumarin"],
  "Muscs": ["musk_nitro", "musk_polycyclic", "musk_macrocyclic", "musk_linear"],
  "Composés azotés": ["nitrile", "indole", "pyrazine", "pyridine", "amine"],
  "Composés soufrés": ["sulfur_compound", "thiophene"],
  "Autres": ["acid_carboxylic", "acid_fatty", "furan", "heterocyclic_oxygen", "heterocyclic_nitrogen", "hydrocarbon_aromatic", "hydrocarbon_aliphatic", "oxide", "acetals", "anhydride", "other"],
};

export function ChemicalFamilyHierarchyGraph({ 
  links, 
  chemicalFamilies,
  isLoading, 
  height = 700 
}: ChemicalFamilyHierarchyGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [dimensions, setDimensions] = useState({ width: 900, height });
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"network" | "tree">("network");
  const [hoveredNode, setHoveredNode] = useState<any>(null);
  const [selectedNode, setSelectedNode] = useState<any>(null);
  
  // Observer les changements de taille du conteneur
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width } = containerRef.current.getBoundingClientRect();
        setDimensions({ width: Math.max(width - 32, 400), height });
      }
    };
    
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, [height]);
  
  // Filtrer les données par recherche
  const filteredLinks = useMemo(() => {
    if (!links || !searchTerm) return links || [];
    const search = searchTerm.toLowerCase();
    return links.filter(link => 
      link.moleculeName.toLowerCase().includes(search) ||
      link.chemicalFamilyName.toLowerCase().includes(search)
    );
  }, [links, searchTerm]);
  
  // Construire les données pour le graphe réseau
  const networkData = useMemo(() => {
    if (!filteredLinks || filteredLinks.length === 0) return { nodes: [], links: [] };
    
    const nodesMap = new Map<string, GraphNode>();
    const graphLinks: GraphLink[] = [];
    
    filteredLinks.forEach(link => {
      const familyId = `family-${link.chemicalFamilyId}`;
      const moleculeId = `molecule-${link.moleculeId}`;
      
      // Ajouter le nœud famille
      if (!nodesMap.has(familyId)) {
        nodesMap.set(familyId, {
          id: familyId,
          name: link.chemicalFamilyName,
          type: "family",
          family: link.chemicalFamilyType,
          linkCount: 0,
        });
      }
      nodesMap.get(familyId)!.linkCount++;
      
      // Ajouter le nœud molécule
      if (!nodesMap.has(moleculeId)) {
        nodesMap.set(moleculeId, {
          id: moleculeId,
          name: link.moleculeName,
          type: "molecule",
          family: link.moleculeFamily ?? undefined,
          linkCount: 0,
        });
      }
      nodesMap.get(moleculeId)!.linkCount++;
      
      // Ajouter le lien
      graphLinks.push({
        source: familyId,
        target: moleculeId,
      });
    });
    
    return {
      nodes: Array.from(nodesMap.values()),
      links: graphLinks,
    };
  }, [filteredLinks]);
  
  // Construire les données pour l'arbre hiérarchique
  const treeData = useMemo((): TreeNode => {
    if (!filteredLinks || filteredLinks.length === 0) {
      return { id: "root", name: "Familles Chimiques", type: "root", children: [] };
    }
    
    // Grouper les molécules par catégorie puis par famille
    const groupedData: Record<string, Record<string, Set<{ id: number; name: string }>>> = {};
    
    filteredLinks.forEach(link => {
      // Trouver le groupe de catégorie
      let categoryGroup = "Autres";
      for (const [group, types] of Object.entries(categoryGroups)) {
        if (types.includes(link.chemicalFamilyType)) {
          categoryGroup = group;
          break;
        }
      }
      
      if (!groupedData[categoryGroup]) {
        groupedData[categoryGroup] = {};
      }
      
      if (!groupedData[categoryGroup][link.chemicalFamilyName]) {
        groupedData[categoryGroup][link.chemicalFamilyName] = new Set();
      }
      
      groupedData[categoryGroup][link.chemicalFamilyName].add({
        id: link.moleculeId,
        name: link.moleculeName,
      });
    });
    
    // Construire l'arbre
    const children: TreeNode[] = Object.entries(groupedData)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([category, families]) => ({
        id: `category-${category}`,
        name: category,
        type: "category" as const,
        children: Object.entries(families)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([familyName, molecules]) => ({
            id: `family-${familyName}`,
            name: familyName,
            type: "family" as const,
            children: Array.from(molecules)
              .sort((a, b) => a.name.localeCompare(b.name))
              .map(mol => ({
                id: `molecule-${mol.id}`,
                name: mol.name,
                type: "molecule" as const,
              })),
          })),
      }));
    
    return {
      id: "root",
      name: "Familles Chimiques",
      type: "root",
      children,
    };
  }, [filteredLinks]);
  
  // Dessiner le graphe réseau avec D3
  useEffect(() => {
    if (!svgRef.current || viewMode !== "network" || networkData.nodes.length === 0) return;
    
    const { width, height } = dimensions;
    const svg = d3.select(svgRef.current);
    
    svg.selectAll("*").remove();
    
    const g = svg.append("g");
    
    // Zoom
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.2, 4])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });
    
    svg.call(zoom);
    
    // Simulation de force
    const simulation = d3.forceSimulation(networkData.nodes as any)
      .force("link", d3.forceLink(networkData.links as any)
        .id((d: any) => d.id)
        .distance(100)
        .strength(0.5)
      )
      .force("charge", d3.forceManyBody()
        .strength((d: any) => -150 - d.linkCount * 15)
      )
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius((d: any) => {
        return d.type === "family" ? 35 : 25;
      }));
    
    // Liens
    const link = g.append("g")
      .attr("class", "links")
      .selectAll("line")
      .data(networkData.links)
      .join("line")
      .attr("stroke", "#94a3b8")
      .attr("stroke-opacity", 0.4)
      .attr("stroke-width", 1.5);
    
    // Nœuds
    const node = g.append("g")
      .attr("class", "nodes")
      .selectAll("g")
      .data(networkData.nodes)
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
    
    // Cercles
    node.append("circle")
      .attr("r", (d: any) => d.type === "family" ? 22 + d.linkCount * 1.5 : 10 + d.linkCount * 0.5)
      .attr("fill", (d: any) => {
        if (d.type === "family") {
          return categoryColors[d.family || ""] || categoryColors.default;
        }
        return "#64748b";
      })
      .attr("stroke", (d: any) => d.type === "family" ? "#1e293b" : "#475569")
      .attr("stroke-width", 2)
      .attr("opacity", 0.9);
    
    // Icônes
    node.append("text")
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "central")
      .attr("font-size", (d: any) => d.type === "family" ? "12px" : "8px")
      .attr("fill", "white")
      .text((d: any) => d.type === "family" ? "🧪" : "⚗️");
    
    // Labels
    node.append("text")
      .attr("x", 0)
      .attr("y", (d: any) => (d.type === "family" ? 22 + d.linkCount * 1.5 : 10 + d.linkCount * 0.5) + 12)
      .attr("text-anchor", "middle")
      .attr("font-size", "10px")
      .attr("font-weight", (d: any) => d.type === "family" ? "600" : "400")
      .attr("fill", "currentColor")
      .text((d: any) => d.name.length > 12 ? d.name.substring(0, 12) + "..." : d.name);
    
    // Interactions
    node.on("mouseenter", (event, d: any) => {
      setHoveredNode(d);
      link.attr("stroke-opacity", (l: any) => {
        return l.source.id === d.id || l.target.id === d.id ? 1 : 0.1;
      });
      node.attr("opacity", (n: any) => {
        if (n.id === d.id) return 1;
        const isConnected = networkData.links.some(
          (l: any) => (l.source.id === d.id && l.target.id === n.id) ||
                      (l.target.id === d.id && l.source.id === n.id)
        );
        return isConnected ? 1 : 0.3;
      });
    })
    .on("mouseleave", () => {
      setHoveredNode(null);
      link.attr("stroke-opacity", 0.4);
      node.attr("opacity", 1);
    })
    .on("click", (event, d: any) => {
      setSelectedNode(selectedNode?.id === d.id ? null : d);
    });
    
    // Tick
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
  }, [networkData, dimensions, viewMode]);
  
  // Dessiner l'arbre hiérarchique avec D3
  useEffect(() => {
    if (!svgRef.current || viewMode !== "tree" || !treeData.children?.length) return;
    
    const { width, height } = dimensions;
    const svg = d3.select(svgRef.current);
    
    svg.selectAll("*").remove();
    
    const margin = { top: 40, right: 120, bottom: 40, left: 120 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    
    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);
    
    // Zoom
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.3, 3])
      .on("zoom", (event) => {
        g.attr("transform", `translate(${margin.left + event.transform.x},${margin.top + event.transform.y}) scale(${event.transform.k})`);
      });
    
    svg.call(zoom);
    
    // Créer la hiérarchie
    const root = d3.hierarchy(treeData);
    
    // Layout en arbre
    const treeLayout = d3.tree<TreeNode>()
      .size([innerHeight, innerWidth])
      .separation((a, b) => (a.parent === b.parent ? 1 : 1.5));
    
    treeLayout(root);
    
    // Liens
    g.append("g")
      .attr("fill", "none")
      .attr("stroke", "#94a3b8")
      .attr("stroke-opacity", 0.5)
      .attr("stroke-width", 1.5)
      .selectAll("path")
      .data(root.links())
      .join("path")
      .attr("d", d3.linkHorizontal<any, any>()
        .x((d: any) => d.y)
        .y((d: any) => d.x)
      );
    
    // Nœuds
    const node = g.append("g")
      .selectAll("g")
      .data(root.descendants())
      .join("g")
      .attr("transform", (d: any) => `translate(${d.y},${d.x})`)
      .attr("cursor", "pointer");
    
    // Cercles
    node.append("circle")
      .attr("r", (d: any) => {
        switch (d.data.type) {
          case "root": return 16;
          case "category": return 12;
          case "family": return 10;
          case "molecule": return 6;
          default: return 8;
        }
      })
      .attr("fill", (d: any) => {
        switch (d.data.type) {
          case "root": return "#6366f1";
          case "category": return "#8b5cf6";
          case "family": return "#22c55e";
          case "molecule": return "#64748b";
          default: return "#94a3b8";
        }
      })
      .attr("stroke", "#1e293b")
      .attr("stroke-width", 1.5);
    
    // Labels
    node.append("text")
      .attr("dy", "0.32em")
      .attr("x", (d: any) => d.children ? -12 : 12)
      .attr("text-anchor", (d: any) => d.children ? "end" : "start")
      .attr("font-size", (d: any) => {
        switch (d.data.type) {
          case "root": return "14px";
          case "category": return "12px";
          case "family": return "11px";
          case "molecule": return "9px";
          default: return "10px";
        }
      })
      .attr("font-weight", (d: any) => d.data.type === "root" || d.data.type === "category" ? "600" : "400")
      .attr("fill", "currentColor")
      .text((d: any) => {
        const name = d.data.name;
        const maxLen = d.data.type === "molecule" ? 20 : 25;
        return name.length > maxLen ? name.substring(0, maxLen) + "..." : name;
      });
    
    // Interactions
    node.on("mouseenter", (event, d: any) => {
      setHoveredNode({ id: d.data.id, name: d.data.name, type: d.data.type });
    })
    .on("mouseleave", () => {
      setHoveredNode(null);
    })
    .on("click", (event, d: any) => {
      const nodeData = { id: d.data.id, name: d.data.name, type: d.data.type };
      setSelectedNode(selectedNode?.id === nodeData.id ? null : nodeData);
    });
    
  }, [treeData, dimensions, viewMode]);
  
  // Statistiques
  const stats = useMemo(() => {
    if (!links) return { families: 0, molecules: 0, links: 0 };
    return {
      families: new Set(links.map(l => l.chemicalFamilyId)).size,
      molecules: new Set(links.map(l => l.moleculeId)).size,
      links: links.length,
    };
  }, [links]);
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="h-6 w-48 bg-muted animate-pulse rounded" />
          <div className="h-4 w-72 mt-2 bg-muted animate-pulse rounded" />
        </CardHeader>
        <CardContent>
          <div className="w-full bg-muted animate-pulse rounded" style={{ height }} />
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
              <FlaskConical className="h-5 w-5 text-primary" />
              Graphe Molécules-Familles Chimiques
            </CardTitle>
            <CardDescription>
              {stats.families} familles • {stats.molecules} molécules • {stats.links} liaisons
            </CardDescription>
          </div>
          
          <div className="flex flex-wrap items-center gap-2">
            {/* Mode de vue */}
            <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as "network" | "tree")}>
              <TabsList className="h-9">
                <TabsTrigger value="network" className="flex items-center gap-1.5 px-3">
                  <Network className="h-4 w-4" />
                  <span className="hidden sm:inline">Réseau</span>
                </TabsTrigger>
                <TabsTrigger value="tree" className="flex items-center gap-1.5 px-3">
                  <GitBranch className="h-4 w-4" />
                  <span className="hidden sm:inline">Arbre</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
            
            {/* Recherche */}
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 w-40"
              />
            </div>
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
              {viewMode === "network" ? (
                <>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-green-600" />
                    <span>Famille chimique</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-slate-500" />
                    <span>Molécule</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-indigo-500" />
                    <span>Racine</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-purple-500" />
                    <span>Catégorie</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                    <span>Famille</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-slate-500" />
                    <span>Molécule</span>
                  </div>
                </>
              )}
            </div>
          </div>
          
          {/* Info panel */}
          {(hoveredNode || selectedNode) && (
            <div className="absolute top-4 right-4 bg-background/95 backdrop-blur-sm rounded-lg p-4 shadow-lg border max-w-xs">
              <div className="flex items-center gap-2 mb-2">
                <FlaskConical className="h-4 w-4 text-primary" />
                <span className="font-semibold">{(hoveredNode || selectedNode)?.name}</span>
              </div>
              <Badge variant="secondary" className="text-xs capitalize">
                {(hoveredNode || selectedNode)?.type}
              </Badge>
              {(hoveredNode || selectedNode)?.linkCount && (
                <div className="text-xs text-muted-foreground mt-2">
                  {(hoveredNode || selectedNode)?.linkCount} connexion(s)
                </div>
              )}
            </div>
          )}
          
          {/* Message si pas de données */}
          {(!links || links.length === 0) && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <FlaskConical className="h-12 w-12 mx-auto text-muted-foreground" />
                <p className="mt-2 text-muted-foreground">Aucune liaison trouvée</p>
                <p className="text-sm text-muted-foreground">
                  Ajoutez des liaisons molécule-famille pour voir le graphe
                </p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default ChemicalFamilyHierarchyGraph;
