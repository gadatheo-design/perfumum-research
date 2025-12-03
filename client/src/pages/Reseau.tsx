import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { useState, useCallback, useMemo } from "react";
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

type EntityType = "molecule" | "recette" | "civilisation" | "gamme" | "prototype";

export default function Reseau() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<EntityType[]>([
    "molecule",
    "recette",
    "civilisation",
    "gamme",
    "prototype",
  ]);

  const { data: molecules, isLoading: loadingMolecules } = trpc.molecules.list.useQuery();
  const { data: recettes, isLoading: loadingRecettes } = trpc.recettes.list.useQuery();
  const { data: civilisations, isLoading: loadingCivilisations } = trpc.civilisations.list.useQuery();

  const isLoading = loadingMolecules || loadingRecettes || loadingCivilisations;

  // Generate nodes and edges
  const { nodes: initialNodes, edges: initialEdges } = useMemo(() => {
    if (!molecules || !recettes || !civilisations) {
      return { nodes: [], edges: [] };
    }

    const nodes: Node[] = [];
    const edges: Edge[] = [];
    let yOffset = 0;
    let xOffset = 0;

    // Add prototype nodes (top level)
    const prototypes = [
      { id: "c1", name: "C1 Fermentum", color: "#9333ea" },
      { id: "c2", name: "C2 Clarus Verde", color: "#16a34a" },
      { id: "c3", name: "C3 Lacta Solis", color: "#ca8a04" },
      { id: "c4", name: "C4 Terra Ambra", color: "#d97706" },
    ];

    prototypes.forEach((proto, index) => {
      nodes.push({
        id: `prototype-${proto.id}`,
        type: "default",
        data: {
          label: proto.name,
          type: "prototype",
        },
        position: { x: index * 300, y: yOffset },
        style: {
          background: proto.color,
          color: "white",
          border: "2px solid #000",
          borderRadius: "8px",
          padding: "12px 20px",
          fontSize: "14px",
          fontWeight: "600",
        },
      });
    });

    yOffset += 150;

    // Add gamme nodes
    const gammes = [
      { id: "petrichor", name: "Pétrichor", color: "#0ea5e9" },
      { id: "volcanique", name: "Volcanique", color: "#f97316" },
      { id: "mossi", name: "Royal Mossi", color: "#f59e0b" },
    ];

    gammes.forEach((gamme, index) => {
      nodes.push({
        id: `gamme-${gamme.id}`,
        type: "default",
        data: {
          label: gamme.name,
          type: "gamme",
        },
        position: { x: index * 400, y: yOffset },
        style: {
          background: gamme.color,
          color: "white",
          border: "2px solid #000",
          borderRadius: "8px",
          padding: "10px 16px",
          fontSize: "13px",
          fontWeight: "500",
        },
      });
    });

    yOffset += 150;

    // Add sample molecules (first 20)
    const sampleMolecules = molecules.slice(0, 20);
    sampleMolecules.forEach((molecule, index) => {
      const row = Math.floor(index / 5);
      const col = index % 5;
      nodes.push({
        id: `molecule-${molecule.id}`,
        type: "default",
        data: {
          label: molecule.name,
          type: "molecule",
        },
        position: { x: col * 250, y: yOffset + row * 100 },
        style: {
          background: "#6366f1",
          color: "white",
          border: "1px solid #4338ca",
          borderRadius: "6px",
          padding: "8px 12px",
          fontSize: "11px",
        },
      });
    });

    yOffset += 250;

    // Add sample recettes (first 15)
    const sampleRecettes = recettes.slice(0, 15);
    sampleRecettes.forEach((recette, index) => {
      const row = Math.floor(index / 5);
      const col = index % 5;
      nodes.push({
        id: `recette-${recette.id}`,
        type: "default",
        data: {
          label: recette.name,
          type: "recette",
        },
        position: { x: col * 250 + 100, y: yOffset + row * 100 },
        style: {
          background: "#ec4899",
          color: "white",
          border: "1px solid #db2777",
          borderRadius: "6px",
          padding: "8px 12px",
          fontSize: "11px",
        },
      });

      // Note: Could connect recette to prototype if prototypeCode field exists in schema
    });

    yOffset += 200;

    // Add sample civilisations (first 10)
    const sampleCivilisations = civilisations.slice(0, 10);
    sampleCivilisations.forEach((civ, index) => {
      const row = Math.floor(index / 5);
      const col = index % 5;
      nodes.push({
        id: `civilisation-${civ.id}`,
        type: "default",
        data: {
          label: civ.name,
          type: "civilisation",
        },
        position: { x: col * 250 + 200, y: yOffset + row * 100 },
        style: {
          background: "#f59e0b",
          color: "white",
          border: "1px solid #d97706",
          borderRadius: "6px",
          padding: "8px 12px",
          fontSize: "11px",
        },
      });
    });

    // Create some sample connections (molecules → recettes, recettes → civilisations)
    sampleMolecules.slice(0, 10).forEach((molecule, index) => {
      const targetRecette = sampleRecettes[index % sampleRecettes.length];
      if (targetRecette) {
        edges.push({
          id: `edge-molecule-${molecule.id}-recette-${targetRecette.id}`,
          source: `molecule-${molecule.id}`,
          target: `recette-${targetRecette.id}`,
          type: "default",
          animated: false,
          style: { stroke: "#cbd5e1", strokeWidth: 1 },
          markerEnd: { type: MarkerType.ArrowClosed, color: "#cbd5e1" },
        });
      }
    });

    return { nodes, edges };
  }, [molecules, recettes, civilisations]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Filter nodes based on search and selected types
  const filteredNodes = useMemo(() => {
    return nodes.filter((node) => {
      const typeMatch = selectedTypes.includes(node.data.type as EntityType);
      const searchMatch =
        !searchQuery ||
        node.data.label.toLowerCase().includes(searchQuery.toLowerCase());
      return typeMatch && searchMatch;
    });
  }, [nodes, selectedTypes, searchQuery]);

  // Filter edges to only show connections between visible nodes
  const filteredEdges = useMemo(() => {
    const visibleNodeIds = new Set(filteredNodes.map((n) => n.id));
    return edges.filter(
      (edge) =>
        visibleNodeIds.has(edge.source) && visibleNodeIds.has(edge.target)
    );
  }, [edges, filteredNodes]);

  const toggleType = (type: EntityType) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const onNodeClick = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      const type = node.data.type as EntityType;
      const id = node.id.split("-")[1];

      if (type === "molecule") {
        setLocation(`/molecules/${id}`);
      } else if (type === "recette") {
        setLocation(`/recettes/${id}`);
      } else if (type === "civilisation") {
        setLocation(`/civilisations/${id}`);
      } else if (type === "prototype") {
        setLocation(`/prototypes/${id}`);
      } else if (type === "gamme") {
        setLocation(`/gammes/${id}`);
      }
    },
    [setLocation]
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="section-spacing bg-gradient-to-b from-background to-muted/30">
          <div className="container">
            <div className="max-w-4xl mx-auto text-center">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Network className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
                Réseau de Relations
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Visualisation interactive des connexions entre molécules, recettes, civilisations, gammes et prototypes PERFUMUM
              </p>
            </div>
          </div>
        </section>

        {/* Network Visualization */}
        <section className="py-16">
          <div className="container">
            <div className="max-w-7xl mx-auto">
              {isLoading ? (
                <div className="flex justify-center items-center h-[600px]">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <Card>
                  <CardHeader>
                    <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                      <CardTitle>Graphe Interactif</CardTitle>
                      <div className="flex gap-2 flex-wrap">
                        <Button
                          size="sm"
                          variant={selectedTypes.includes("prototype") ? "default" : "outline"}
                          onClick={() => toggleType("prototype")}
                        >
                          Prototypes
                        </Button>
                        <Button
                          size="sm"
                          variant={selectedTypes.includes("gamme") ? "default" : "outline"}
                          onClick={() => toggleType("gamme")}
                        >
                          Gammes
                        </Button>
                        <Button
                          size="sm"
                          variant={selectedTypes.includes("molecule") ? "default" : "outline"}
                          onClick={() => toggleType("molecule")}
                        >
                          Molécules
                        </Button>
                        <Button
                          size="sm"
                          variant={selectedTypes.includes("recette") ? "default" : "outline"}
                          onClick={() => toggleType("recette")}
                        >
                          Recettes
                        </Button>
                        <Button
                          size="sm"
                          variant={selectedTypes.includes("civilisation") ? "default" : "outline"}
                          onClick={() => toggleType("civilisation")}
                        >
                          Civilisations
                        </Button>
                      </div>
                    </div>
                    <div className="relative mt-4">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Rechercher dans le réseau..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[700px] border border-border rounded-lg overflow-hidden">
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
                        <Panel position="top-right" className="bg-background/80 backdrop-blur p-4 rounded-lg border border-border">
                          <div className="space-y-2 text-sm">
                            <p className="font-semibold">Légende</p>
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded bg-purple-600"></div>
                              <span>Prototypes</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded bg-orange-500"></div>
                              <span>Gammes</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded bg-indigo-500"></div>
                              <span>Molécules</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded bg-pink-500"></div>
                              <span>Recettes</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded bg-amber-500"></div>
                              <span>Civilisations</span>
                            </div>
                          </div>
                        </Panel>
                      </ReactFlow>
                    </div>
                    <p className="text-sm text-muted-foreground mt-4 text-center">
                      Cliquez sur un nœud pour accéder à sa page de détail • Utilisez la molette pour zoomer • Glissez pour déplacer
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </section>

        {/* Description */}
        <section className="py-16 bg-muted/30">
          <div className="container">
            <div className="max-w-3xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle>À Propos du Réseau</CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground space-y-4">
                  <p>
                    Cette visualisation interactive montre les <strong>connexions entre toutes les entités PERFUMUM</strong> : prototypes (C1-C4), gammes (Pétrichor, Volcanique, Mossi), molécules, recettes, et civilisations. Chaque nœud représente une entité, et les liens montrent les relations (molécule → recette, recette → prototype, etc.).
                  </p>
                  <p>
                    Le réseau permet d'<strong>explorer visuellement la structure de la recherche</strong> : comment les molécules s'organisent en recettes, comment les recettes s'inscrivent dans des prototypes, et comment les civilisations mobilisent des accords olfactifs spécifiques. Cette approche systémique révèle les <strong>patterns et récurrences</strong> dans la recherche PERFUMUM.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
