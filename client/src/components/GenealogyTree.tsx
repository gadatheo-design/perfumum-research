/**
 * PERFUMUM - Arbre Généalogique Interactif
 * Visualisation D3.js des relations généalogiques entre variétés de plantes
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import * as d3 from 'd3';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Download, 
  RefreshCw,
  GitBranch,
  Leaf,
  Skull,
  AlertTriangle,
  Info
} from 'lucide-react';

// Types pour les données de l'arbre
interface TreeNode {
  id: number;
  name: string;
  latinName?: string;
  type: 'variety' | 'lost' | 'ancestor' | 'descendant' | 'sibling';
  conservationStatus?: string;
  extinctionStatus?: string;
  relationshipType?: string;
  depth?: number;
  children?: TreeNode[];
  parent?: TreeNode;
  x?: number;
  y?: number;
}

interface GenealogyData {
  variety: {
    id: number;
    name: string;
    latinName?: string;
    conservationStatus?: string;
  } | null;
  ancestors: Array<{
    id: number;
    varietyId: number;
    parentVarietyId: number;
    relationshipType: string;
  }>;
  descendants: Array<{
    id: number;
    varietyId: number;
    parentVarietyId: number;
    relationshipType: string;
  }>;
  siblings: Array<{
    id: number;
    name: string;
    latinName?: string;
  }>;
}

interface GenealogyTreeProps {
  data: GenealogyData | null;
  varietyId: number;
  onNodeClick?: (node: TreeNode) => void;
  width?: number;
  height?: number;
}

// Couleurs par type de nœud
const nodeColors: Record<string, string> = {
  variety: '#10b981', // Vert émeraude - variété principale
  ancestor: '#6366f1', // Indigo - ancêtres
  descendant: '#f59e0b', // Ambre - descendants
  sibling: '#8b5cf6', // Violet - frères/sœurs
  lost: '#ef4444', // Rouge - variétés disparues
};

// Couleurs par statut de conservation
const conservationColors: Record<string, string> = {
  EX: '#7f1d1d', // Rouge foncé - Éteint
  EW: '#991b1b', // Rouge - Éteint à l'état sauvage
  CR: '#dc2626', // Rouge vif - En danger critique
  EN: '#ea580c', // Orange foncé - En danger
  VU: '#f59e0b', // Ambre - Vulnérable
  NT: '#84cc16', // Vert lime - Quasi menacé
  LC: '#22c55e', // Vert - Préoccupation mineure
  DD: '#6b7280', // Gris - Données insuffisantes
  NE: '#9ca3af', // Gris clair - Non évalué
};

export function GenealogyTree({ 
  data, 
  varietyId, 
  onNodeClick,
  width = 900,
  height = 600 
}: GenealogyTreeProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const [viewMode, setViewMode] = useState<'tree' | 'radial' | 'force'>('tree');
  const [selectedNode, setSelectedNode] = useState<TreeNode | null>(null);

  // Transformer les données en structure d'arbre
  const buildTree = useCallback((): TreeNode | null => {
    if (!data?.variety) return null;

    const rootNode: TreeNode = {
      id: data.variety.id,
      name: data.variety.name,
      latinName: data.variety.latinName,
      type: 'variety',
      conservationStatus: data.variety.conservationStatus,
      children: []
    };

    // Ajouter les ancêtres (simplifiés pour la démo)
    if (data.ancestors.length > 0) {
      const ancestorBranch: TreeNode = {
        id: -1,
        name: 'Ancêtres',
        type: 'ancestor',
        children: data.ancestors.slice(0, 5).map((a, i) => ({
          id: a.parentVarietyId,
          name: `Ancêtre ${i + 1}`,
          type: 'ancestor' as const,
          relationshipType: a.relationshipType
        }))
      };
      rootNode.children?.push(ancestorBranch);
    }

    // Ajouter les descendants
    if (data.descendants.length > 0) {
      const descendantBranch: TreeNode = {
        id: -2,
        name: 'Descendants',
        type: 'descendant',
        children: data.descendants.slice(0, 5).map((d, i) => ({
          id: d.varietyId,
          name: `Descendant ${i + 1}`,
          type: 'descendant' as const,
          relationshipType: d.relationshipType
        }))
      };
      rootNode.children?.push(descendantBranch);
    }

    // Ajouter les frères/sœurs
    if (data.siblings.length > 0) {
      const siblingBranch: TreeNode = {
        id: -3,
        name: 'Variétés apparentées',
        type: 'sibling',
        children: data.siblings.slice(0, 5).map(s => ({
          id: s.id,
          name: s.name,
          latinName: s.latinName,
          type: 'sibling' as const
        }))
      };
      rootNode.children?.push(siblingBranch);
    }

    return rootNode;
  }, [data]);

  // Rendu de l'arbre avec D3
  useEffect(() => {
    if (!svgRef.current || !data?.variety) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const treeData = buildTree();
    if (!treeData) return;

    const margin = { top: 40, right: 120, bottom: 40, left: 120 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Créer le groupe principal avec zoom
    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Créer la hiérarchie D3
    const root = d3.hierarchy(treeData);
    
    // Créer le layout de l'arbre
    const treeLayout = d3.tree<TreeNode>()
      .size([innerHeight, innerWidth]);

    const treeRoot = treeLayout(root);

    // Dessiner les liens
    const link = g.selectAll('.link')
      .data(treeRoot.links())
      .enter()
      .append('path')
      .attr('class', 'link')
      .attr('fill', 'none')
      .attr('stroke', '#374151')
      .attr('stroke-opacity', 0.4)
      .attr('stroke-width', 2)
      .attr('d', d3.linkHorizontal<d3.HierarchyPointLink<TreeNode>, d3.HierarchyPointNode<TreeNode>>()
        .x(d => d.y)
        .y(d => d.x)
      );

    // Dessiner les nœuds
    const node = g.selectAll('.node')
      .data(treeRoot.descendants())
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr('transform', d => `translate(${d.y},${d.x})`)
      .style('cursor', 'pointer')
      .on('click', (event, d) => {
        setSelectedNode(d.data);
        onNodeClick?.(d.data);
      });

    // Cercles des nœuds
    node.append('circle')
      .attr('r', d => d.depth === 0 ? 20 : 12)
      .attr('fill', d => {
        if (d.data.conservationStatus && conservationColors[d.data.conservationStatus]) {
          return conservationColors[d.data.conservationStatus];
        }
        return nodeColors[d.data.type] || '#6b7280';
      })
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)
      .on('mouseover', function() {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('r', d => (d as any).depth === 0 ? 24 : 16);
      })
      .on('mouseout', function() {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('r', d => (d as any).depth === 0 ? 20 : 12);
      });

    // Icônes dans les nœuds
    node.append('text')
      .attr('dy', 4)
      .attr('text-anchor', 'middle')
      .attr('fill', '#fff')
      .attr('font-size', d => d.depth === 0 ? '14px' : '10px')
      .text(d => {
        if (d.data.type === 'lost') return '†';
        if (d.data.type === 'ancestor') return '↑';
        if (d.data.type === 'descendant') return '↓';
        if (d.data.type === 'sibling') return '↔';
        return '●';
      });

    // Labels des nœuds
    node.append('text')
      .attr('dy', 4)
      .attr('x', d => d.children ? -25 : 25)
      .attr('text-anchor', d => d.children ? 'end' : 'start')
      .attr('fill', '#e5e7eb')
      .attr('font-size', '12px')
      .attr('font-weight', d => d.depth === 0 ? 'bold' : 'normal')
      .text(d => d.data.name);

    // Sous-labels (nom latin)
    node.filter(d => d.data.latinName)
      .append('text')
      .attr('dy', 18)
      .attr('x', d => d.children ? -25 : 25)
      .attr('text-anchor', d => d.children ? 'end' : 'start')
      .attr('fill', '#9ca3af')
      .attr('font-size', '10px')
      .attr('font-style', 'italic')
      .text(d => d.data.latinName || '');

    // Zoom behavior
    const zoomBehavior = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 3])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
        setZoom(event.transform.k);
      });

    svg.call(zoomBehavior);

  }, [data, width, height, viewMode, buildTree, onNodeClick]);

  // Fonctions de contrôle du zoom
  const handleZoomIn = () => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    svg.transition().call(
      d3.zoom<SVGSVGElement, unknown>().scaleBy as any,
      1.3
    );
  };

  const handleZoomOut = () => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    svg.transition().call(
      d3.zoom<SVGSVGElement, unknown>().scaleBy as any,
      0.7
    );
  };

  const handleReset = () => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    svg.transition().call(
      d3.zoom<SVGSVGElement, unknown>().transform as any,
      d3.zoomIdentity
    );
    setZoom(1);
  };

  // Export SVG
  const handleExport = () => {
    if (!svgRef.current) return;
    const svgData = new XMLSerializer().serializeToString(svgRef.current);
    const blob = new Blob([svgData], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `genealogy-tree-${varietyId}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!data?.variety) {
    return (
      <Card className="bg-zinc-900 border-zinc-800">
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center text-zinc-500">
            <GitBranch className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Sélectionnez une variété pour afficher son arbre généalogique</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-emerald-400">
              <GitBranch className="h-5 w-5" />
              Arbre Généalogique
            </CardTitle>
            <CardDescription>
              {data.variety.name}
              {data.variety.latinName && (
                <span className="italic ml-2">({data.variety.latinName})</span>
              )}
            </CardDescription>
          </div>
          
          {/* Contrôles */}
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={handleZoomOut} className="h-8 w-8">
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-xs text-zinc-500 w-12 text-center">{Math.round(zoom * 100)}%</span>
            <Button variant="outline" size="icon" onClick={handleZoomIn} className="h-8 w-8">
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={handleReset} className="h-8 w-8">
              <Maximize2 className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={handleExport} className="h-8 w-8">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Légende */}
        <div className="flex flex-wrap gap-4 mb-4 p-3 bg-zinc-800/50 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: nodeColors.variety }} />
            <span className="text-xs text-zinc-400">Variété principale</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: nodeColors.ancestor }} />
            <span className="text-xs text-zinc-400">Ancêtres</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: nodeColors.descendant }} />
            <span className="text-xs text-zinc-400">Descendants</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: nodeColors.sibling }} />
            <span className="text-xs text-zinc-400">Apparentées</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: nodeColors.lost }} />
            <span className="text-xs text-zinc-400">Disparues</span>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="p-3 bg-indigo-500/10 rounded-lg border border-indigo-500/20">
            <div className="text-2xl font-bold text-indigo-400">{data.ancestors.length}</div>
            <div className="text-xs text-zinc-500">Ancêtres</div>
          </div>
          <div className="p-3 bg-amber-500/10 rounded-lg border border-amber-500/20">
            <div className="text-2xl font-bold text-amber-400">{data.descendants.length}</div>
            <div className="text-xs text-zinc-500">Descendants</div>
          </div>
          <div className="p-3 bg-violet-500/10 rounded-lg border border-violet-500/20">
            <div className="text-2xl font-bold text-violet-400">{data.siblings.length}</div>
            <div className="text-xs text-zinc-500">Apparentées</div>
          </div>
        </div>

        {/* Visualisation SVG */}
        <div 
          ref={containerRef}
          className="relative bg-zinc-950 rounded-lg border border-zinc-800 overflow-hidden"
          style={{ height: `${height}px` }}
        >
          <svg
            ref={svgRef}
            width={width}
            height={height}
            className="w-full h-full"
          />
        </div>

        {/* Détails du nœud sélectionné */}
        {selectedNode && (
          <div className="mt-4 p-4 bg-zinc-800/50 rounded-lg border border-zinc-700">
            <h4 className="font-semibold text-emerald-400 mb-2">{selectedNode.name}</h4>
            {selectedNode.latinName && (
              <p className="text-sm text-zinc-400 italic mb-2">{selectedNode.latinName}</p>
            )}
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="text-xs">
                Type: {selectedNode.type}
              </Badge>
              {selectedNode.relationshipType && (
                <Badge variant="outline" className="text-xs">
                  Relation: {selectedNode.relationshipType}
                </Badge>
              )}
              {selectedNode.conservationStatus && (
                <Badge 
                  className="text-xs"
                  style={{ 
                    backgroundColor: conservationColors[selectedNode.conservationStatus] || '#6b7280',
                    color: '#fff'
                  }}
                >
                  {selectedNode.conservationStatus}
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default GenealogyTree;
