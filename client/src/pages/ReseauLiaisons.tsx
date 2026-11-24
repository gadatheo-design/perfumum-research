import { useState, useCallback, useMemo } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Network, FlaskConical, Package, Leaf, Loader2, Info, ZoomIn, ZoomOut, Maximize2 } from "lucide-react";
import { DynamicBreadcrumb } from "@/components/DynamicBreadcrumb";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Node,
  Edge,
  useNodesState,
  useEdgesState,
  MarkerType,
  BackgroundVariant,
} from "reactflow";
import "reactflow/dist/style.css";

// Couleurs par type de nœud
const NODE_COLORS = {
  recette: { bg: "#7c3aed", border: "#5b21b6", text: "#fff" },
  rawMaterial: { bg: "#d97706", border: "#92400e", text: "#fff" },
  molecule: { bg: "#059669", border: "#065f46", text: "#fff" },
};

// Composant nœud personnalisé
function CustomNode({ data }: { data: any }) {
  const colors = NODE_COLORS[data.type as keyof typeof NODE_COLORS] || NODE_COLORS.molecule;
  return (
    <div
      style={{
        background: colors.bg,
        border: `2px solid ${colors.border}`,
        borderRadius: "8px",
        padding: "6px 10px",
        color: colors.text,
        fontSize: "11px",
        fontWeight: 600,
        maxWidth: "140px",
        textAlign: "center",
        cursor: "pointer",
        boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
        lineHeight: 1.3,
      }}
    >
      <div style={{ fontSize: "9px", opacity: 0.8, marginBottom: "2px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
        {data.type === "recette" ? "Recette" : data.type === "rawMaterial" ? "Matière" : "Molécule"}
      </div>
      <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        {data.label}
      </div>
    </div>
  );
}

const nodeTypes = { custom: CustomNode };

// Disposition en force-directed simplifiée (cercles concentriques par type)
function layoutNodes(
  recettes: any[],
  rawMaterials: any[],
  molecules: any[]
): Node[] {
  const nodes: Node[] = [];
  const centerX = 600;
  const centerY = 400;

  // Recettes : cercle intérieur
  recettes.forEach((r, i) => {
    const angle = (i / Math.max(recettes.length, 1)) * 2 * Math.PI;
    const radius = Math.min(180 + recettes.length * 5, 280);
    nodes.push({
      id: `recette-${r.id}`,
      type: "custom",
      position: {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
      },
      data: { label: r.name, type: "recette", id: r.id },
    });
  });

  // Matières premières : cercle intermédiaire
  rawMaterials.forEach((rm, i) => {
    const angle = (i / Math.max(rawMaterials.length, 1)) * 2 * Math.PI;
    const radius = Math.min(350 + rawMaterials.length * 3, 480);
    nodes.push({
      id: `rm-${rm.id}`,
      type: "custom",
      position: {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
      },
      data: { label: rm.name, type: "rawMaterial", id: rm.id },
    });
  });

  // Molécules : cercle extérieur
  molecules.forEach((m, i) => {
    const angle = (i / Math.max(molecules.length, 1)) * 2 * Math.PI;
    const radius = Math.min(550 + molecules.length * 2, 700);
    nodes.push({
      id: `mol-${m.id}`,
      type: "custom",
      position: {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
      },
      data: { label: m.name, type: "molecule", id: m.id },
    });
  });

  return nodes;
}

function buildEdges(networkData: any): Edge[] {
  const edges: Edge[] = [];

  // Liaisons recette ↔ matière première
  networkData?.edges.recetteRawMaterials?.forEach((link: any, i: number) => {
    edges.push({
      id: `rm-link-${i}`,
      source: `recette-${link.recetteId}`,
      target: `rm-${link.rawMaterialId}`,
      style: { stroke: "#d97706", strokeWidth: 1.5, opacity: 0.6 },
      markerEnd: { type: MarkerType.ArrowClosed, color: "#d97706" },
      animated: false,
    });
  });

  // Liaisons recette ↔ molécule
  networkData?.edges.recetteMolecules?.forEach((link: any, i: number) => {
    edges.push({
      id: `mol-link-${i}`,
      source: `recette-${link.recetteId}`,
      target: `mol-${link.moleculeId}`,
      style: { stroke: "#059669", strokeWidth: 1, opacity: 0.4 },
      markerEnd: { type: MarkerType.ArrowClosed, color: "#059669" },
      animated: false,
    });
  });

  return edges;
}

export default function ReseauLiaisons() {
  const [limit, setLimit] = useState(30);
  const [includeRecettes, setIncludeRecettes] = useState(true);
  const [includeRawMaterials, setIncludeRawMaterials] = useState(true);
  const [includeMolecules, setIncludeMolecules] = useState(false);
  const [selectedNode, setSelectedNode] = useState<any>(null);

  const { data: networkData, isLoading } = trpc.completude.getNetworkData.useQuery({
    limit,
    includeRecettes,
    includeRawMaterials,
    includeMolecules,
  });

  const initialNodes = useMemo(() => {
    if (!networkData) return [];
    return layoutNodes(
      networkData?.nodes.recettes,
      networkData?.nodes.rawMaterials,
      networkData?.nodes.molecules
    );
  }, [networkData]);

  const initialEdges = useMemo(() => {
    if (!networkData) return [];
    return buildEdges(networkData);
  }, [networkData]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Mettre à jour les nœuds quand les données changent
  useMemo(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [initialNodes, initialEdges]);

  const onNodeClick = useCallback((_: any, node: Node) => {
    setSelectedNode(node.data);
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 container py-6 max-w-[1600px]">
        {/* Header */}
        <div className="mb-6">
          <DynamicBreadcrumb className="mb-2" />
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                <Network className="h-8 w-8 text-violet-600" />
                Réseau de Liaisons
              </h1>
              <p className="text-muted-foreground mt-1">
                Visualisation interactive des connexions entre recettes, matières premières et molécules.
              </p>
            </div>
            {networkData && (
              <div className="flex gap-3 shrink-0">
                <Badge variant="outline" className="text-violet-700 border-violet-300">
                  <FlaskConical className="h-3 w-3 mr-1" />
                  {networkData?.stats.totalRecettes} recettes
                </Badge>
                <Badge variant="outline" className="text-amber-700 border-amber-300">
                  <Package className="h-3 w-3 mr-1" />
                  {networkData?.stats.totalRawMaterials} matières
                </Badge>
                <Badge variant="outline" className="text-emerald-700 border-emerald-300">
                  <Leaf className="h-3 w-3 mr-1" />
                  {networkData?.stats.totalMolecules} molécules
                </Badge>
                <Badge variant="outline" className="text-slate-600 border-slate-300">
                  {networkData?.stats.totalEdges} liaisons
                </Badge>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-4">
          {/* Panneau de contrôle */}
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold">Filtres du réseau</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Limite */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs">Nœuds par type</Label>
                    <span className="text-xs font-mono text-muted-foreground">{limit}</span>
                  </div>
                  <Slider
                    value={[limit]}
                    onValueChange={([v]) => setLimit(v)}
                    min={10}
                    max={100}
                    step={10}
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground">Plus de nœuds = graphe plus dense</p>
                </div>

                {/* Toggles */}
                <div className="space-y-3 pt-2 border-t">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-violet-600" />
                      <Label className="text-xs cursor-pointer">Recettes</Label>
                    </div>
                    <Switch
                      checked={includeRecettes}
                      onCheckedChange={setIncludeRecettes}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-amber-600" />
                      <Label className="text-xs cursor-pointer">Matières premières</Label>
                    </div>
                    <Switch
                      checked={includeRawMaterials}
                      onCheckedChange={setIncludeRawMaterials}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-emerald-600" />
                      <Label className="text-xs cursor-pointer">Molécules</Label>
                    </div>
                    <Switch
                      checked={includeMolecules}
                      onCheckedChange={setIncludeMolecules}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Légende */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold">Légende</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-4 rounded bg-violet-600" />
                  <span className="text-xs">Recette</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-4 rounded bg-amber-600" />
                  <span className="text-xs">Matière première</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-4 rounded bg-emerald-600" />
                  <span className="text-xs">Molécule</span>
                </div>
                <div className="pt-2 border-t space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-0.5 bg-amber-500" />
                    <span className="text-xs text-muted-foreground">Liaison recette → matière</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-0.5 bg-emerald-500" />
                    <span className="text-xs text-muted-foreground">Liaison recette → molécule</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Nœud sélectionné */}
            {selectedNode && (
              <Card className="border-violet-200 dark:border-violet-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <Info className="h-4 w-4 text-violet-600" />
                    Nœud sélectionné
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm font-medium">{selectedNode.label}</p>
                  <Badge variant="outline" className="text-xs">
                    {selectedNode.type === "recette" ? "Recette" : selectedNode.type === "rawMaterial" ? "Matière première" : "Molécule"}
                  </Badge>
                  <div className="pt-2">
                    {selectedNode.type === "recette" && (
                      <Link href={`/recette/${selectedNode.id}`}>
                        <Button size="sm" variant="outline" className="w-full text-xs">
                          Voir la recette →
                        </Button>
                      </Link>
                    )}
                    {selectedNode.type === "rawMaterial" && (
                      <Link href={`/matieres-premieres/${selectedNode.id}`}>
                        <Button size="sm" variant="outline" className="w-full text-xs">
                          Voir la fiche →
                        </Button>
                      </Link>
                    )}
                    {selectedNode.type === "molecule" && (
                      <Link href={`/molecule/${selectedNode.id}`}>
                        <Button size="sm" variant="outline" className="w-full text-xs">
                          Voir la molécule →
                        </Button>
                      </Link>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Info */}
            <Card className="bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800">
              <CardContent className="pt-4">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  <strong>Astuce :</strong> Cliquez sur un nœud pour voir ses détails et accéder à sa fiche. 
                  Utilisez la molette pour zoomer, et faites glisser pour naviguer dans le graphe.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Graphe */}
          <div className="relative">
            <Card className="overflow-hidden" style={{ height: "calc(100vh - 280px)", minHeight: "500px" }}>
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-violet-600 mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground">Chargement du réseau...</p>
                  </div>
                </div>
              ) : nodes.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center text-muted-foreground">
                    <Network className="h-12 w-12 mx-auto mb-3 opacity-30" />
                    <p className="text-sm">Aucune donnée à afficher.</p>
                    <p className="text-xs mt-1">Activez au moins un type de nœud.</p>
                  </div>
                </div>
              ) : (
                <ReactFlow
                  nodes={nodes}
                  edges={edges}
                  onNodesChange={onNodesChange}
                  onEdgesChange={onEdgesChange}
                  onNodeClick={onNodeClick}
                  nodeTypes={nodeTypes}
                  fitView
                  fitViewOptions={{ padding: 0.15 }}
                  minZoom={0.1}
                  maxZoom={3}
                  attributionPosition="bottom-right"
                >
                  <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#e2e8f0" />
                  <Controls />
                  <MiniMap
                    nodeColor={(node) => {
                      if (node.data?.type === "recette") return "#7c3aed";
                      if (node.data?.type === "rawMaterial") return "#d97706";
                      return "#059669";
                    }}
                    style={{ background: "rgba(255,255,255,0.9)", border: "1px solid #e2e8f0" }}
                  />
                </ReactFlow>
              )}
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
