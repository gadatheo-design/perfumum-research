/**
 * Composant GenealogyTree
 * Visualisation interactive de l'arbre généalogique d'une variété
 * Utilise React Flow pour l'affichage et la navigation
 */

import React, { useCallback, useEffect, useState } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  MiniMap,
  useReactFlow,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { trpc } from '@/lib/trpc';
import { Loader2, AlertCircle } from 'lucide-react';

interface GenealogyTreeProps {
  varietyId: number;
  varietyName: string;
}

// Nœud personnalisé pour afficher les variétés
const VarietyNode = ({ data }: any) => {
  const bgColor = {
    root: 'bg-blue-100 border-blue-500',
    ancestor: 'bg-purple-100 border-purple-500',
    descendant: 'bg-green-100 border-green-500',
  }[data.type] || 'bg-gray-100 border-gray-500';

  return (
    <div className={`px-3 py-2 rounded border-2 ${bgColor} shadow-md min-w-max`}>
      <div className="font-semibold text-sm">{data.label}</div>
      {data.type !== 'root' && (
        <div className="text-xs text-gray-600 mt-1">
          {data.type === 'ancestor' ? '↑ Ancêtre' : '↓ Descendant'}
        </div>
      )}
    </div>
  );
};

// Lien personnalisé avec label
const GenealogyEdge = ({ data }: any) => {
  return (
    <div className="text-xs bg-white px-2 py-1 rounded border border-gray-300 shadow-sm">
      {data.type === 'hybrid' && '🔀 Hybride'}
      {data.type === 'clone' && '📋 Clone'}
      {data.type === 'parent' && '👨 Parent'}
      {data.type === 'mutation' && '🧬 Mutation'}
    </div>
  );
};

const nodeTypes = {
  variety: VarietyNode,
};

export const GenealogyTree: React.FC<GenealogyTreeProps> = ({ varietyId, varietyName }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [relationshipFilter, setRelationshipFilter] = useState<string | null>(null);
  const { fitView } = useReactFlow();

  // Récupérer les données généalogiques
  const { data: genealogyData, isLoading } = trpc.moleculeManager.getVarietyGenealogy.useQuery(
    { varietyId },
    { enabled: !!varietyId }
  );

  // Transformer les données pour React Flow
  useEffect(() => {
    if (!genealogyData) return;

    setLoading(true);
    try {
      // Créer les nœuds avec positions calculées
      const flowNodes: Node[] = genealogyData.nodes.map((node: any, idx: number) => {
        // Calculer la position en fonction du type et de la profondeur
        let x = 0;
        let y = 0;

        if (node.type === 'root') {
          x = 0;
          y = 0;
        } else if (node.type === 'ancestor') {
          x = -300 * (node.depth || 1);
          y = -150 * ((idx % 3) - 1);
        } else if (node.type === 'descendant') {
          x = 300 * (node.depth || 1);
          y = -150 * ((idx % 3) - 1);
        }

        return {
          id: node.id,
          data: { label: node.label, type: node.type, depth: node.depth || 0 },
          position: { x, y },
          type: 'variety',
          style: {
            background: node.type === 'root' ? '#dbeafe' : node.type === 'ancestor' ? '#e9d5ff' : '#dcfce7',
            border: node.type === 'root' ? '2px solid #3b82f6' : node.type === 'ancestor' ? '2px solid #a855f7' : '2px solid #22c55e',
            borderRadius: '8px',
            padding: '10px',
            fontWeight: node.type === 'root' ? 'bold' : 'normal',
            fontSize: '12px',
            minWidth: '120px',
            textAlign: 'center',
          },
        };
      });

      // Créer les liens
      const flowEdges: Edge[] = genealogyData.links.map((link: any, idx: number) => ({
        id: `edge-${idx}`,
        source: link.source,
        target: link.target,
        label: link.type,
        animated: true,
        style: {
          stroke: link.type === 'hybrid' ? '#f59e0b' : link.type === 'clone' ? '#8b5cf6' : '#3b82f6',
          strokeWidth: 2,
        },
        labelStyle: {
          background: 'white',
          fontSize: '10px',
          padding: '2px 4px',
          borderRadius: '4px',
          border: '1px solid #e5e7eb',
        },
      }));

      setNodes(flowNodes);
      setEdges(flowEdges);
      setError(null);

      // Adapter la vue après un délai pour que les nœuds soient rendus
      setTimeout(() => {
        fitView({ padding: 0.2, duration: 500 });
      }, 100);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  }, [genealogyData, setNodes, setEdges, fitView]);

  // Filtrer les nœuds et liens selon les critères
  const filteredNodes = nodes.filter(node => {
    if (!relationshipFilter) return true;
    if (relationshipFilter === 'root') return node.data.type === 'root';
    if (relationshipFilter === 'ancestors') return node.data.type === 'ancestor' || node.data.type === 'root';
    if (relationshipFilter === 'descendants') return node.data.type === 'descendant' || node.data.type === 'root';
    return true;
  });

  const filteredEdges = edges.filter(edge => {
    const sourceNode = nodes.find(n => n.id === edge.source);
    const targetNode = nodes.find(n => n.id === edge.target);
    if (!sourceNode || !targetNode) return false;
    if (!relationshipFilter) return true;
    if (relationshipFilter === 'ancestors') return filteredNodes.some(n => n.id === sourceNode.id) && filteredNodes.some(n => n.id === targetNode.id);
    if (relationshipFilter === 'descendants') return filteredNodes.some(n => n.id === sourceNode.id) && filteredNodes.some(n => n.id === targetNode.id);
    return true;
  });

  if (isLoading || loading) {
    return (
      <div className="w-full h-96 flex items-center justify-center bg-gray-50 rounded border border-gray-200">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
          <p className="text-sm text-gray-600">Chargement de l'arbre généalogique...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-96 flex items-center justify-center bg-red-50 rounded border border-red-200">
        <div className="flex flex-col items-center gap-2">
          <AlertCircle className="w-6 h-6 text-red-500" />
          <p className="text-sm text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!genealogyData || genealogyData.nodes.length === 0) {
    return (
      <div className="w-full h-96 flex items-center justify-center bg-gray-50 rounded border border-gray-200">
        <p className="text-sm text-gray-600">Aucune généalogie documentée pour cette variété</p>
      </div>
    );
  }

  const maxDepth = Math.max(...nodes.map(n => n.data.depth || 0), 0);

  return (
    <div className="w-full space-y-3">
      {/* Filtres */}
      <div className="bg-gray-50 p-3 rounded border border-gray-200 space-y-2">
        <div className="text-xs font-semibold text-gray-700">Filtres généalogiques</div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setRelationshipFilter(null)}
            className={`px-3 py-1 rounded text-xs font-medium transition ${
              relationshipFilter === null
                ? 'bg-blue-500 text-white'
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            Tous
          </button>
          <button
            onClick={() => setRelationshipFilter('ancestors')}
            className={`px-3 py-1 rounded text-xs font-medium transition ${
              relationshipFilter === 'ancestors'
                ? 'bg-purple-500 text-white'
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            ↑ Ancêtres
          </button>
          <button
            onClick={() => setRelationshipFilter('descendants')}
            className={`px-3 py-1 rounded text-xs font-medium transition ${
              relationshipFilter === 'descendants'
                ? 'bg-green-500 text-white'
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            ↓ Descendants
          </button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="bg-blue-50 p-3 rounded border border-blue-200 text-xs text-blue-800">
        <div className="font-semibold mb-1">Statistiques</div>
        <div className="grid grid-cols-3 gap-2">
          <div>Nœuds : <span className="font-bold">{filteredNodes.length}</span></div>
          <div>Liens : <span className="font-bold">{filteredEdges.length}</span></div>
          <div>Générations : <span className="font-bold">{maxDepth + 1}</span></div>
        </div>
      </div>

      {/* Arbre généalogique */}
      <div className="w-full h-96 bg-white rounded border border-gray-200 overflow-hidden">
        <ReactFlow
          nodes={filteredNodes}
          edges={filteredEdges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          fitView
        >
          <Background color="#aaa" gap={16} />
          <Controls />
          <MiniMap />

          {/* Légende */}
          <div className="absolute bottom-4 left-4 bg-white rounded border border-gray-200 shadow-md p-3 text-xs">
            <div className="font-semibold mb-2">Légende</div>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-100 border border-blue-500 rounded"></div>
                <span>Variété actuelle</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-purple-100 border border-purple-500 rounded"></div>
                <span>Ancêtre</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-100 border border-green-500 rounded"></div>
                <span>Descendant</span>
              </div>
            </div>
          </div>
        </ReactFlow>
      </div>
    </div>
  );
}
