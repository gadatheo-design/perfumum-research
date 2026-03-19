// @ts-nocheck
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { useState, useCallback, useMemo } from "react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  MarkerType,
  Panel,
} from "reactflow";
import "reactflow/dist/style.css";
import { Search, Network, Loader2 } from "lucide-react";
import { useLocation } from "wouter";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

type EntityType = "molecule" | "recette" | "civilisation" | "accord" | "prototype";

export default function Reseau() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<EntityType[]>([
    "molecule",
    "recette",
    "civilisation",
    "accord",
    "prototype",
  ]);

  const { data: networkData, isLoading } = trpc.network.getRelationships.useQuery();

  // Generate nodes and edges from real database
  const { nodes: initialNodes, edges: initialEdges } = useMemo(() => {
    if (!networkData) {
      return { nodes: [], edges: [] };
    }

    const nodes: Node[] = [];
    const edges: Edge[] = [];
    let yOffset = 0;

    // 1. Add prototype nodes (top level)
    if (selectedTypes.includes("prototype")) {
      networkData.entities.prototypes.forEach((proto, index) => {
        nodes.push({
          id: `prototype-${proto.id}`,
          type: "default",
          data: {
            label: proto.name,
            type: "prototype",
            entityId: proto.id,
          },
          position: { x: index * 300, y: yOffset },
          style: {
            background: proto.color || "#9333ea",
            color: "white",
            border: "2px solid #000",
            borderRadius: "8px",
            padding: "12px 20px",
            fontSize: "14px",
            fontWeight: "600",
            cursor: "pointer",
          },
        });
      });
      yOffset += 150;
    }

    // 2. Add accord nodes
    if (selectedTypes.includes("accord")) {
      networkData.entities.accords.slice(0, 20).forEach((accord, index) => {
        nodes.push({
          id: `accord-${accord.id}`,
          type: "default",
          data: {
            label: accord.name,
            type: "accord",
            entityId: accord.id,
          },
          position: { x: (index % 5) * 300, y: yOffset + Math.floor(index / 5) * 100 },
          style: {
            background: "#0ea5e9",
            color: "white",
            border: "2px solid #000",
            borderRadius: "8px",
            padding: "10px 16px",
            fontSize: "12px",
            fontWeight: "500",
            cursor: "pointer",
          },
        });
      });
      yOffset += 250;
    }

    // 3. Add molecule nodes
    if (selectedTypes.includes("molecule")) {
      networkData.entities.molecules.slice(0, 30).forEach((molecule, index) => {
        nodes.push({
          id: `molecule-${molecule.id}`,
          type: "default",
          data: {
            label: molecule.name,
            type: "molecule",
            entityId: molecule.id,
          },
          position: { x: (index % 6) * 250, y: yOffset + Math.floor(index / 6) * 100 },
          style: {
            background: "#16a34a",
            color: "white",
            border: "2px solid #000",
            borderRadius: "8px",
            padding: "8px 14px",
            fontSize: "11px",
            fontWeight: "500",
            cursor: "pointer",
          },
        });
      });
      yOffset += 300;
    }

    // 4. Add recette nodes
    if (selectedTypes.includes("recette")) {
      networkData.entities.recettes.slice(0, 30).forEach((recette, index) => {
        nodes.push({
          id: `recette-${recette.id}`,
          type: "default",
          data: {
            label: recette.name,
            type: "recette",
            entityId: recette.id,
          },
          position: { x: (index % 6) * 250, y: yOffset + Math.floor(index / 6) * 100 },
          style: {
            background: "#ca8a04",
            color: "white",
            border: "2px solid #000",
            borderRadius: "8px",
            padding: "8px 14px",
            fontSize: "11px",
            fontWeight: "500",
            cursor: "pointer",
          },
        });
      });
      yOffset += 300;
    }

    // 5. Add civilisation nodes
    if (selectedTypes.includes("civilisation")) {
      networkData.entities.civilisations.forEach((civ, index) => {
        nodes.push({
          id: `civilisation-${civ.id}`,
          type: "default",
          data: {
            label: civ.name,
            type: "civilisation",
            entityId: civ.id,
          },
          position: { x: index * 300, y: yOffset },
          style: {
            background: "#d97706",
            color: "white",
            border: "2px solid #000",
            borderRadius: "8px",
            padding: "10px 16px",
            fontSize: "12px",
            fontWeight: "500",
            cursor: "pointer",
          },
        });
      });
    }

    // Create edges from relationships
    // 1. Recettes → Accords
    networkData.relationships.recetteAccords.forEach((rel) => {
      if (
        nodes.find((n) => n.id === `recette-${rel.recetteId}`) &&
        nodes.find((n) => n.id === `accord-${rel.accordId}`)
      ) {
        edges.push({
          id: `recette-${rel.recetteId}-accord-${rel.accordId}`,
          source: `recette-${rel.recetteId}`,
          target: `accord-${rel.accordId}`,
          type: "smoothstep",
          animated: false,
          style: { stroke: "#94a3b8", strokeWidth: 1 },
          markerEnd: { type: MarkerType.ArrowClosed, color: "#94a3b8" },
        });
      }
    });

    // 2. Civilisations → Accords
    networkData.relationships.civilisationAccords.forEach((rel) => {
      if (
        nodes.find((n) => n.id === `civilisation-${rel.civilisationId}`) &&
        nodes.find((n) => n.id === `accord-${rel.accordId}`)
      ) {
        edges.push({
          id: `civilisation-${rel.civilisationId}-accord-${rel.accordId}`,
          source: `civilisation-${rel.civilisationId}`,
          target: `accord-${rel.accordId}`,
          type: "smoothstep",
          animated: false,
          style: { stroke: "#cbd5e1", strokeWidth: 1 },
          markerEnd: { type: MarkerType.ArrowClosed, color: "#cbd5e1" },
        });
      }
    });

    // 3. Recettes → Civilisations
    networkData.relationships.recetteCivilisations.forEach((rel) => {
      if (
        nodes.find((n) => n.id === `recette-${rel.recetteId}`) &&
        nodes.find((n) => n.id === `civilisation-${rel.civilisationId}`)
      ) {
        edges.push({
          id: `recette-${rel.recetteId}-civilisation-${rel.civilisationId}`,
          source: `recette-${rel.recetteId}`,
          target: `civilisation-${rel.civilisationId}`,
          type: "smoothstep",
          animated: false,
          style: { stroke: "#e2e8f0", strokeWidth: 1 },
          markerEnd: { type: MarkerType.ArrowClosed, color: "#e2e8f0" },
        });
      }
    });

    return { nodes, edges };
  }, [networkData, selectedTypes]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Update nodes when filters change
  useMemo(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [initialNodes, initialEdges, setNodes, setEdges]);

  // Filter nodes by search query
  const filteredNodes = useMemo(() => {
    if (!searchQuery) return nodes;
    return nodes.filter((node) =>
      node.data.label.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [nodes, searchQuery]);

  const filteredEdges = useMemo(() => {
    if (!searchQuery) return edges;
    const filteredNodeIds = new Set(filteredNodes.map((n) => n.id));
    return edges.filter(
      (edge) => filteredNodeIds.has(edge.source) && filteredNodeIds.has(edge.target)
    );
  }, [edges, filteredNodes, searchQuery]);

  const toggleType = (type: EntityType) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const onNodeClick = useCallback(
    (_: any, node: Node) => {
      const { type, entityId } = node.data;
      if (type === "molecule") {
        setLocation(`/molecule/${entityId}`);
      } else if (type === "recette") {
        setLocation(`/recette/${entityId}`);
      } else if (type === "civilisation") {
        setLocation(`/civilisation/${entityId}`);
      } else if (type === "prototype") {
        setLocation(`/prototype/${entityId}`);
      }
    },
    [setLocation]
  );

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  const stats = networkData
    ? {
        prototypes: networkData.entities.prototypes.length,
        molecules: networkData.entities.molecules.length,
        recettes: networkData.entities.recettes.length,
        civilisations: networkData.entities.civilisations.length,
        accords: networkData.entities.accords.length,
        totalConnections: filteredEdges.length,
      }
    : null;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto py-8 space-y-6">
      <Breadcrumbs />
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Network className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold tracking-tight">Réseau de Relations</h1>
        </div>
        <p className="text-lg text-muted-foreground max-w-3xl">
          Visualisation interactive des connexions entre prototypes, molécules, recettes,
          accords et civilisations. Explorez les relations olfactives et anthropologiques
          de PERFUMUM.
        </p>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Filtres et Recherche</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher une entité..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Type filters */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedTypes.includes("prototype") ? "default" : "outline"}
              size="sm"
              onClick={() => toggleType("prototype")}
            >
              Prototypes ({stats?.prototypes || 0})
            </Button>
            <Button
              variant={selectedTypes.includes("accord") ? "default" : "outline"}
              size="sm"
              onClick={() => toggleType("accord")}
            >
              Accords ({stats?.accords || 0})
            </Button>
            <Button
              variant={selectedTypes.includes("molecule") ? "default" : "outline"}
              size="sm"
              onClick={() => toggleType("molecule")}
            >
              Molécules ({stats?.molecules || 0})
            </Button>
            <Button
              variant={selectedTypes.includes("recette") ? "default" : "outline"}
              size="sm"
              onClick={() => toggleType("recette")}
            >
              Recettes ({stats?.recettes || 0})
            </Button>
            <Button
              variant={selectedTypes.includes("civilisation") ? "default" : "outline"}
              size="sm"
              onClick={() => toggleType("civilisation")}
            >
              Civilisations ({stats?.civilisations || 0})
            </Button>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>
              {filteredNodes.length} nœuds affichés
            </span>
            <span>•</span>
            <span>{stats?.totalConnections || 0} connexions</span>
          </div>
        </CardContent>
      </Card>

      {/* Network Graph */}
      <Card>
        <CardContent className="p-0">
          <div style={{ height: "800px" }}>
            <ReactFlow
              nodes={filteredNodes}
              edges={filteredEdges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onNodeClick={onNodeClick}
              fitView
              attributionPosition="bottom-left"
            >
              <Background />
              <Controls />
              <Panel position="top-right" className="bg-background/95 backdrop-blur-sm p-4 rounded-lg border space-y-2">
                <h3 className="font-semibold text-sm">Légende</h3>
                <div className="space-y-1 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded" style={{ background: "#9333ea" }} />
                    <span>Prototypes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded" style={{ background: "#0ea5e9" }} />
                    <span>Accords</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded" style={{ background: "#16a34a" }} />
                    <span>Molécules</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded" style={{ background: "#ca8a04" }} />
                    <span>Recettes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded" style={{ background: "#d97706" }} />
                    <span>Civilisations</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Cliquez sur un nœud pour accéder à sa page de détail
                </p>
              </Panel>
            </ReactFlow>
          </div>
        </CardContent>
      </Card>
      </main>
      <Footer />
    </div>
  );
}
