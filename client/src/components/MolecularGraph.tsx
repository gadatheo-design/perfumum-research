// @ts-nocheck
import { useCallback, useMemo } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  MarkerType,
  BackgroundVariant,
  ConnectionMode,
} from 'reactflow';
import 'reactflow/dist/style.css';

export interface MoleculeNode {
  id: string;
  label: string;
  type?: 'molecule' | 'family' | 'accord' | 'process';
  formula?: string;
  description?: string;
  color?: string;
}

export interface MoleculeSynergy {
  source: string;
  target: string;
  label?: string;
  type?: 'synergy' | 'transformation' | 'composition';
  strength?: 'weak' | 'medium' | 'strong';
}

interface MolecularGraphProps {
  molecules: MoleculeNode[];
  synergies: MoleculeSynergy[];
  height?: string;
  title?: string;
}

// Custom node styles based on type
const getNodeStyle = (type?: string, color?: string) => {
  const baseStyle = {
    padding: '12px 16px',
    borderRadius: '8px',
    border: '2px solid',
    fontSize: '13px',
    fontWeight: 500,
    minWidth: '140px',
    textAlign: 'center' as const,
  };

  switch (type) {
    case 'family':
      return {
        ...baseStyle,
        background: color || 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
        borderColor: '#d97706',
        color: '#78350f',
        fontSize: '14px',
        fontWeight: 600,
        minWidth: '180px',
      };
    case 'accord':
      return {
        ...baseStyle,
        background: color || 'linear-gradient(135deg, #a78bfa 0%, #8b5cf6 100%)',
        borderColor: '#7c3aed',
        color: '#ffffff',
        fontSize: '14px',
        fontWeight: 600,
        minWidth: '160px',
      };
    case 'process':
      return {
        ...baseStyle,
        background: color || 'linear-gradient(135deg, #fca5a5 0%, #ef4444 100%)',
        borderColor: '#dc2626',
        color: '#ffffff',
        fontSize: '13px',
        fontWeight: 600,
        borderStyle: 'dashed',
      };
    case 'molecule':
    default:
      return {
        ...baseStyle,
        background: color || 'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)',
        borderColor: '#0ea5e9',
        color: '#075985',
      };
  }
};

// Custom edge styles based on type and strength
const getEdgeStyle = (type?: string, strength?: string) => {
  const baseStyle = {
    strokeWidth: 2,
    stroke: '#94a3b8',
  };

  let strokeWidth = 2;
  if (strength === 'strong') strokeWidth = 4;
  if (strength === 'medium') strokeWidth = 3;
  if (strength === 'weak') strokeWidth = 1.5;

  switch (type) {
    case 'transformation':
      return {
        ...baseStyle,
        stroke: '#ef4444',
        strokeWidth,
        strokeDasharray: '5,5',
      };
    case 'composition':
      return {
        ...baseStyle,
        stroke: '#8b5cf6',
        strokeWidth,
      };
    case 'synergy':
    default:
      return {
        ...baseStyle,
        stroke: '#0ea5e9',
        strokeWidth,
      };
  }
};

export function MolecularGraph({ molecules, synergies, height = '600px', title }: MolecularGraphProps) {
  // Convert molecules to React Flow nodes
  const initialNodes: Node[] = useMemo(() => {
    return molecules.map((mol, index) => {
      const style = getNodeStyle(mol.type, mol.color);
      
      return {
        id: mol.id,
        type: 'default',
        position: { x: 0, y: 0 }, // Will be auto-laid out
        data: {
          label: (
            <div className="text-center">
              <div className="font-semibold">{mol.label}</div>
              {mol.formula && (
                <div className="text-xs opacity-80 mt-1 font-mono">{mol.formula}</div>
              )}
              {mol.description && (
                <div className="text-xs opacity-70 mt-1">{mol.description}</div>
              )}
            </div>
          ),
        },
        style,
      };
    });
  }, [molecules]);

  // Convert synergies to React Flow edges
  const initialEdges: Edge[] = useMemo(() => {
    return synergies.map((syn, index) => {
      const style = getEdgeStyle(syn.type, syn.strength);
      
      return {
        id: `e-${syn.source}-${syn.target}-${index}`,
        source: syn.source,
        target: syn.target,
        label: syn.label,
        type: 'smoothstep',
        animated: syn.strength === 'strong',
        style,
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: style.stroke,
        },
        labelStyle: {
          fontSize: 11,
          fontWeight: 500,
          fill: '#64748b',
        },
        labelBgStyle: {
          fill: '#ffffff',
          fillOpacity: 0.9,
        },
      };
    });
  }, [synergies]);

  // Auto-layout nodes in a hierarchical structure
  const layoutedNodes = useMemo(() => {
    const familyNodes = initialNodes.filter(n => molecules.find(m => m.id === n.id)?.type === 'family');
    const accordNodes = initialNodes.filter(n => molecules.find(m => m.id === n.id)?.type === 'accord');
    const processNodes = initialNodes.filter(n => molecules.find(m => m.id === n.id)?.type === 'process');
    const moleculeNodes = initialNodes.filter(n => {
      const type = molecules.find(m => m.id === n.id)?.type;
      return !type || type === 'molecule';
    });

    const layouted: Node[] = [];
    let yOffset = 50;

    // Layout families at top
    familyNodes.forEach((node, i) => {
      layouted.push({
        ...node,
        position: { x: 100 + i * 250, y: yOffset },
      });
    });
    if (familyNodes.length > 0) yOffset += 150;

    // Layout accords in middle
    accordNodes.forEach((node, i) => {
      layouted.push({
        ...node,
        position: { x: 150 + i * 280, y: yOffset },
      });
    });
    if (accordNodes.length > 0) yOffset += 150;

    // Layout processes
    processNodes.forEach((node, i) => {
      layouted.push({
        ...node,
        position: { x: 120 + i * 260, y: yOffset },
      });
    });
    if (processNodes.length > 0) yOffset += 130;

    // Layout molecules in grid
    const cols = Math.ceil(Math.sqrt(moleculeNodes.length));
    moleculeNodes.forEach((node, i) => {
      const row = Math.floor(i / cols);
      const col = i % cols;
      layouted.push({
        ...node,
        position: { x: 80 + col * 220, y: yOffset + row * 120 },
      });
    });

    return layouted;
  }, [initialNodes, molecules]);

  const [nodes, setNodes, onNodesChange] = useNodesState(layoutedNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  return (
    <div className="w-full rounded-xl border border-border bg-background overflow-hidden shadow-lg">
      {title && (
        <div className="px-6 py-4 border-b border-border bg-muted/30">
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
      )}
      <div style={{ height }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          connectionMode={ConnectionMode.Loose}
          fitView
          attributionPosition="bottom-left"
          minZoom={0.2}
          maxZoom={2}
          defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
        >
          <Background variant={BackgroundVariant.Dots} gap={16} size={1} color="#e2e8f0" />
          <Controls showInteractive={false} />
        </ReactFlow>
      </div>
      
      {/* Legend */}
      <div className="px-6 py-4 border-t border-border bg-muted/20">
        <div className="flex flex-wrap gap-6 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded border-2 border-sky-500 bg-gradient-to-br from-sky-100 to-sky-200" />
            <span className="text-muted-foreground">Molécule</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded border-2 border-amber-600 bg-gradient-to-br from-amber-300 to-amber-400" />
            <span className="text-muted-foreground">Famille chimique</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded border-2 border-purple-600 bg-gradient-to-br from-purple-400 to-purple-500" />
            <span className="text-muted-foreground">Accord</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded border-2 border-red-600 border-dashed bg-gradient-to-br from-red-300 to-red-400" />
            <span className="text-muted-foreground">Processus</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-12 h-0.5 bg-sky-500" />
            <span className="text-muted-foreground">Synergie</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-12 h-1 bg-sky-500" />
            <span className="text-muted-foreground">Synergie forte</span>
          </div>
        </div>
      </div>
    </div>
  );
}
