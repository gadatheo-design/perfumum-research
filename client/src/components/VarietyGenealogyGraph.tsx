/**
 * VarietyGenealogyGraph.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Composant React pour visualiser et interagir avec les arbres généalogiques
 * des variétés (parents, soeurs, hybrides) avec React Flow.
 *
 * Fonctionnalités :
 * - Visualisation interactive de l'arbre généalogique
 * - Zoom et pan
 * - Affichage des relations (parent, soeur, hybride)
 * - Tooltips au survol
 * - Clic pour voir les détails
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React, { useCallback, useMemo } from 'react';
import {
  ReactFlow,
  Node,
  Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  MiniMap,
  Panel,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import type { VarietyGenealogy, VarietyNode, RelationType } from '@/lib/varietyGenealogy';

interface VarietyGenealogyGraphProps {
  genealogy: VarietyGenealogy;
  onNodeClick?: (variety: VarietyNode) => void;
  height?: number;
}

// ── Couleurs par type de relation ─────────────────────────────────────────────

const relationColors: Record<RelationType, string> = {
  parent: '#3b82f6',      // Bleu
  sibling: '#8b5cf6',     // Violet
  hybrid: '#ec4899',      // Rose
  cultivar: '#10b981',    // Vert
  cross: '#f59e0b',       // Orange
  mutation: '#ef4444',    // Rouge
};

const relationLabels: Record<RelationType, string> = {
  parent: 'Parent',
  sibling: 'Frère/Sœur',
  hybrid: 'Hybride',
  cultivar: 'Cultivar',
  cross: 'Croisement',
  mutation: 'Mutation',
};

// ── Composant personnalisé pour les nœuds ────────────────────────────────────

interface CustomNodeProps {
  data: {
    label: string;
    variety: VarietyNode;
    isRoot?: boolean;
  };
  selected?: boolean;
}

function CustomNode({ data, selected }: CustomNodeProps) {
  const { variety, isRoot } = data;
  const conservationColor = {
    extinct: 'bg-gray-600',
    endangered: 'bg-red-600',
    vulnerable: 'bg-orange-600',
    stable: 'bg-green-600',
    cultivated: 'bg-blue-600',
  }[variety.conservationStatus || 'stable'];

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={`
              px-4 py-3 rounded-lg border-2 shadow-lg cursor-pointer
              transition-all duration-200 hover:shadow-xl
              ${isRoot ? 'bg-yellow-100 border-yellow-400' : 'bg-white border-gray-300'}
              ${selected ? 'ring-2 ring-blue-500' : ''}
            `}
          >
            <div className="font-semibold text-sm text-gray-800">{variety.name}</div>
            <div className="text-xs text-gray-600 mt-1">{variety.species}</div>
            {variety.year && (
              <div className="text-xs text-gray-500 mt-1">
                Année: {variety.year}
              </div>
            )}
            {variety.conservationStatus && (
              <Badge className={`${conservationColor} text-white text-xs mt-2`}>
                {variety.conservationStatus}
              </Badge>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent side="right" className="max-w-xs">
          <div className="text-sm">
            <p className="font-semibold">{variety.name}</p>
            {variety.description && <p className="mt-1">{variety.description}</p>}
            {variety.origin && <p className="mt-1 text-xs">Origine: {variety.origin}</p>}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

// ── Fonction pour calculer la disposition des nœuds ──────────────────────────

function calculateLayout(genealogy: VarietyGenealogy): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  const nodePositions = new Map<string, { x: number; y: number }>();

  // Placer le nœud racine au centre
  const rootId = genealogy.rootVariety.id;
  nodePositions.set(rootId, { x: 0, y: 0 });

  // Créer les nœuds
  genealogy.nodes.forEach((variety) => {
    const position = nodePositions.get(variety.id) || { x: Math.random() * 500, y: Math.random() * 500 };
    nodePositions.set(variety.id, position);

    nodes.push({
      id: variety.id,
      data: {
        label: variety.name,
        variety,
        isRoot: variety.id === rootId,
      },
      position,
      type: 'default',
    });
  });

  // Créer les arêtes
  genealogy.relations.forEach((relation, index) => {
    const edgeColor = relationColors[relation.type];
    edges.push({
      id: relation.id,
      source: relation.sourceId,
      target: relation.targetId,
      label: relationLabels[relation.type],
      style: {
        stroke: edgeColor,
        strokeWidth: 2,
      },
      animated: false,
      markerEnd: {
        type: 'arrowclosed',
        color: edgeColor,
      },
    });
  });

  return { nodes, edges };
}

// ── Composant principal ───────────────────────────────────────────────────────

export function VarietyGenealogyGraph({
  genealogy,
  onNodeClick,
  height = 600,
}: VarietyGenealogyGraphProps) {
  const { nodes: initialNodes, edges: initialEdges } = useMemo(
    () => calculateLayout(genealogy),
    [genealogy]
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const handleNodeClick = useCallback(
    (event: React.MouseEvent, node: Node) => {
      const variety = genealogy.nodes.find((v) => v.id === node.id);
      if (variety && onNodeClick) {
        onNodeClick(variety);
      }
    },
    [genealogy.nodes, onNodeClick]
  );

  return (
    <div className="w-full rounded-lg border border-gray-200 overflow-hidden" style={{ height }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={handleNodeClick}
        fitView
      >
        <Background />
        <Controls />
        <MiniMap />
        <Panel position="top-left" className="bg-white p-4 rounded-lg shadow-lg">
          <div className="text-sm font-semibold mb-2">Légende</div>
          <div className="space-y-1">
            {Object.entries(relationLabels).map(([type, label]) => (
              <div key={type} className="flex items-center gap-2 text-xs">
                <div
                  className="w-3 h-0.5"
                  style={{ backgroundColor: relationColors[type as RelationType] }}
                />
                <span>{label}</span>
              </div>
            ))}
          </div>
        </Panel>
      </ReactFlow>
    </div>
  );
}

// ── Composant wrapper avec affichage des détails ──────────────────────────────

interface VarietyGenealogyViewerProps {
  genealogy: VarietyGenealogy;
  height?: number;
}

export function VarietyGenealogyViewer({
  genealogy,
  height = 600,
}: VarietyGenealogyViewerProps) {
  const [selectedVariety, setSelectedVariety] = React.useState<VarietyNode | null>(null);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2">
        <VarietyGenealogyGraph
          genealogy={genealogy}
          onNodeClick={setSelectedVariety}
          height={height}
        />
      </div>

      {selectedVariety && (
        <div className="lg:col-span-1">
          <Card className="p-4 sticky top-4">
            <h3 className="font-bold text-lg mb-2">{selectedVariety.name}</h3>
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-semibold">Espèce:</span>
                <p className="text-gray-600">{selectedVariety.species}</p>
              </div>

              {selectedVariety.year && (
                <div>
                  <span className="font-semibold">Année:</span>
                  <p className="text-gray-600">{selectedVariety.year}</p>
                </div>
              )}

              {selectedVariety.origin && (
                <div>
                  <span className="font-semibold">Origine:</span>
                  <p className="text-gray-600">{selectedVariety.origin}</p>
                </div>
              )}

              {selectedVariety.conservationStatus && (
                <div>
                  <span className="font-semibold">Statut:</span>
                  <Badge className="mt-1">
                    {selectedVariety.conservationStatus}
                  </Badge>
                </div>
              )}

              {selectedVariety.description && (
                <div>
                  <span className="font-semibold">Description:</span>
                  <p className="text-gray-600 mt-1">{selectedVariety.description}</p>
                </div>
              )}

              {selectedVariety.molecularProfile && (
                <div>
                  <span className="font-semibold">Profil moléculaire:</span>
                  <div className="mt-2 space-y-1">
                    {Object.entries(selectedVariety.molecularProfile).map(
                      ([compound, value]) => (
                        <div key={compound} className="flex justify-between text-xs">
                          <span>{compound}</span>
                          <span className="font-mono">{value.toFixed(2)}</span>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
