import { useMemo, useCallback } from "react";
import {
  ReactFlow,
  Node,
  Edge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  Position,
  MarkerType,
  Handle,
  NodeProps,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { GitBranch, AlertCircle } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface GenealogyRelation {
  id: number;
  variety_id: number;
  parent_variety_id: number;
  relationship_type: "parent" | "hybrid" | "clone" | "mutation";
  cross_date?: number | null;
  breeder?: string | null;
  notes?: string | null;
  // For parents
  parent_name?: string;
  parent_latin_name?: string;
  parent_category?: string;
  // For children
  child_name?: string;
  child_latin_name?: string;
  child_category?: string;
}

// ─── Couleurs par type de relation ────────────────────────────────────────────

const RELATION_COLORS: Record<string, { bg: string; border: string; edge: string; label: string }> = {
  parent:   { bg: "#dbeafe", border: "#3b82f6", edge: "#3b82f6", label: "Parent direct" },
  hybrid:   { bg: "#fef3c7", border: "#f59e0b", edge: "#f59e0b", label: "Hybride" },
  clone:    { bg: "#dcfce7", border: "#22c55e", edge: "#22c55e", label: "Clone" },
  mutation: { bg: "#fce7f3", border: "#ec4899", edge: "#ec4899", label: "Mutation" },
};

// ─── Nœud personnalisé ────────────────────────────────────────────────────────

interface NodeData {
  label: string;
  latinName?: string;
  plantId: number;
  isCurrent: boolean;
  relationType?: string;
  role: "parent" | "current" | "child";
  [key: string]: unknown;
}

function VarietyNode({ data }: NodeProps) {
  const nodeData = data as NodeData;
  const colors = nodeData.relationType ? RELATION_COLORS[nodeData.relationType] : null;

  const bg = nodeData.isCurrent
    ? "linear-gradient(135deg, #1e293b 0%, #334155 100%)"
    : (colors?.bg ?? "#f8fafc");
  const border = nodeData.isCurrent ? "#6366f1" : (colors?.border ?? "#cbd5e1");
  const textColor = nodeData.isCurrent ? "#f8fafc" : "#1e293b";
  const latinColor = nodeData.isCurrent ? "#94a3b8" : "#64748b";

  return (
    <div
      className="rounded-xl shadow-lg transition-transform hover:scale-105"
      style={{
        background: bg,
        border: `2px solid ${border}`,
        color: textColor,
        minWidth: 150,
        maxWidth: 220,
        padding: "10px 14px",
        textAlign: "center",
        cursor: "pointer",
      }}
    >
      {/* Handle haut (entrée depuis parents) */}
      {nodeData.role !== "parent" && (
        <Handle
          type="target"
          position={Position.Top}
          style={{ background: border, width: 8, height: 8 }}
        />
      )}

      <Link href={`/varieties/${nodeData.plantId}`}>
        <div className="font-semibold text-sm leading-tight hover:underline">
          {nodeData.label}
        </div>
        {nodeData.latinName && (
          <div className="text-xs italic mt-0.5" style={{ color: latinColor }}>
            {nodeData.latinName}
          </div>
        )}
      </Link>

      {nodeData.isCurrent && (
        <div
          className="text-xs mt-1.5 px-2 py-0.5 rounded-full inline-block"
          style={{ background: "#6366f1", color: "#fff" }}
        >
          variété actuelle
        </div>
      )}

      {/* Handle bas (sortie vers enfants) */}
      {nodeData.role !== "child" && (
        <Handle
          type="source"
          position={Position.Bottom}
          style={{ background: border, width: 8, height: 8 }}
        />
      )}
    </div>
  );
}

const nodeTypes = { variety: VarietyNode };

// ─── Composant principal ──────────────────────────────────────────────────────

interface Props {
  varietyId: number;
  varietyName: string;
  latinName?: string;
}

export function VarietyGenealogyTree({ varietyId, varietyName, latinName }: Props) {
  const { data, isLoading, error } = trpc.genealogy.getTreeWithNames.useQuery({ varietyId });

  const { initialNodes, initialEdges } = useMemo(() => {
    if (!data) return { initialNodes: [], initialEdges: [] };

    const parents = (data.parents ?? []) as unknown as GenealogyRelation[];
    const children = (data.children ?? []) as unknown as GenealogyRelation[];

    const nodes: Node[] = [];
    const edges: Edge[] = [];

    // ── Nœud central ──
    const centerX = Math.max(300, parents.length * 180);
    const centerY = 220;

    nodes.push({
      id: `v-${varietyId}`,
      type: "variety",
      position: { x: centerX - 90, y: centerY },
      data: {
        label: varietyName,
        latinName,
        plantId: varietyId,
        isCurrent: true,
        role: "current",
      } as NodeData,
    });

    // ── Parents (au-dessus) ──
    parents.forEach((rel, i) => {
      const parentNodeId = `v-${rel.parent_variety_id}`;
      const totalParents = parents.length;
      const spacing = Math.max(200, 360 / totalParents);
      const startX = centerX - ((totalParents - 1) * spacing) / 2;
      const x = startX + i * spacing - 90;

      nodes.push({
        id: parentNodeId,
        type: "variety",
        position: { x, y: 40 },
        data: {
          label: rel.parent_name ?? `Parent ${i + 1}`,
          latinName: rel.parent_latin_name,
          plantId: rel.parent_variety_id,
          isCurrent: false,
          relationType: rel.relationship_type,
          role: "parent",
        } as NodeData,
      });

      const edgeColor = RELATION_COLORS[rel.relationship_type]?.edge ?? "#94a3b8";

      edges.push({
        id: `e-parent-${rel.id}`,
        source: parentNodeId,
        target: `v-${varietyId}`,
        label: RELATION_COLORS[rel.relationship_type]?.label ?? rel.relationship_type,
        labelStyle: { fontSize: 10, fill: edgeColor, fontWeight: 600 },
        labelBgStyle: { fill: "#fff", fillOpacity: 0.85 },
        style: { stroke: edgeColor, strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: edgeColor },
        animated: rel.relationship_type === "hybrid",
      });
    });

    // ── Enfants (en-dessous) ──
    children.forEach((rel, i) => {
      const childNodeId = `v-${rel.variety_id}`;
      const totalChildren = children.length;
      const spacing = Math.max(200, 360 / totalChildren);
      const startX = centerX - ((totalChildren - 1) * spacing) / 2;
      const x = startX + i * spacing - 90;

      nodes.push({
        id: childNodeId,
        type: "variety",
        position: { x, y: 400 },
        data: {
          label: rel.child_name ?? `Enfant ${i + 1}`,
          latinName: rel.child_latin_name,
          plantId: rel.variety_id,
          isCurrent: false,
          relationType: rel.relationship_type,
          role: "child",
        } as NodeData,
      });

      const edgeColor = RELATION_COLORS[rel.relationship_type]?.edge ?? "#94a3b8";

      edges.push({
        id: `e-child-${rel.id}`,
        source: `v-${varietyId}`,
        target: childNodeId,
        label: RELATION_COLORS[rel.relationship_type]?.label ?? rel.relationship_type,
        labelStyle: { fontSize: 10, fill: edgeColor, fontWeight: 600 },
        labelBgStyle: { fill: "#fff", fillOpacity: 0.85 },
        style: { stroke: edgeColor, strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: edgeColor },
        animated: rel.relationship_type === "hybrid",
      });
    });

    return { initialNodes: nodes, initialEdges: edges };
  }, [data, varietyId, varietyName, latinName]);

  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-[400px] w-full rounded-lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-2 text-destructive p-4 bg-destructive/10 rounded-lg">
        <AlertCircle className="h-5 w-5 shrink-0" />
        <span className="text-sm">Impossible de charger l'arbre généalogique.</span>
      </div>
    );
  }

  const parents = (data?.parents ?? []) as unknown as GenealogyRelation[];
  const children = (data?.children ?? []) as unknown as GenealogyRelation[];
  const hasData = parents.length > 0 || children.length > 0;

  if (!hasData) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <GitBranch className="h-12 w-12 mx-auto mb-3 opacity-40" />
        <p className="font-medium">Aucune généalogie documentée</p>
        <p className="text-sm mt-1">Les données généalogiques seront ajoutées progressivement.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Légende */}
      <div className="flex flex-wrap gap-2">
        {Object.entries(RELATION_COLORS).map(([type, colors]) => (
          <Badge
            key={type}
            variant="outline"
            className="text-xs"
            style={{ borderColor: colors.border, color: colors.border, background: colors.bg }}
          >
            {colors.label}
          </Badge>
        ))}
      </div>

      {/* Stats */}
      <div className="flex gap-4 text-sm text-muted-foreground">
        {parents.length > 0 && (
          <span><strong className="text-foreground">{parents.length}</strong> parent{parents.length > 1 ? "s" : ""}</span>
        )}
        {children.length > 0 && (
          <span><strong className="text-foreground">{children.length}</strong> descendant{children.length > 1 ? "s" : ""}</span>
        )}
      </div>

      {/* Graphe React Flow */}
      <div
        className="rounded-xl border border-border overflow-hidden"
        style={{ height: 480 }}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.3 }}
          minZoom={0.3}
          maxZoom={2}
          attributionPosition="bottom-right"
        >
          <Background color="#e2e8f0" gap={16} />
          <Controls showInteractive={false} />
          <MiniMap
            nodeColor={(n) => {
              const d = n.data as NodeData;
              if (d.isCurrent) return "#6366f1";
              const rel = d.relationType as string;
              return RELATION_COLORS[rel]?.border ?? "#94a3b8";
            }}
            maskColor="rgba(248,250,252,0.7)"
          />
        </ReactFlow>
      </div>

      {/* Détails des relations */}
      {parents.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
            Origines parentales
          </h4>
          {parents.map((rel) => (
            <div
              key={rel.id}
              className="p-3 rounded-lg border"
              style={{
                borderColor: RELATION_COLORS[rel.relationship_type]?.border ?? "#cbd5e1",
                background: RELATION_COLORS[rel.relationship_type]?.bg ?? "#f8fafc",
              }}
            >
              <div className="flex items-center gap-2 mb-1">
                <Badge
                  variant="outline"
                  className="text-xs"
                  style={{
                    borderColor: RELATION_COLORS[rel.relationship_type]?.border,
                    color: RELATION_COLORS[rel.relationship_type]?.border,
                  }}
                >
                  {RELATION_COLORS[rel.relationship_type]?.label ?? rel.relationship_type}
                </Badge>
                <Link href={`/varieties/${rel.parent_variety_id}`}>
                  <span className="font-medium text-sm hover:underline">
                    {rel.parent_name}
                  </span>
                </Link>
                {rel.parent_latin_name && (
                  <span className="text-xs text-muted-foreground italic">
                    {rel.parent_latin_name}
                  </span>
                )}
              </div>
              {rel.breeder && (
                <p className="text-xs text-muted-foreground">
                  <strong>Croiseur :</strong> {rel.breeder}
                  {rel.cross_date && ` (${rel.cross_date})`}
                </p>
              )}
              {rel.notes && (
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{rel.notes}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
