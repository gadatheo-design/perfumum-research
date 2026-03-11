import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Zap, Leaf } from 'lucide-react';

interface Material {
  id: string;
  name: string;
  rarity: string;
  category: string;
  relatedAccords?: string[];
}

interface Heritage {
  id: string;
  name: string;
  type: 'accord';
  rarity: string;
}

interface GraphNode extends d3.SimulationNodeDatum {
  id: string;
  name: string;
  type: 'material' | 'accord';
  rarity: string;
  category?: string;
}

interface GraphLink extends d3.SimulationLinkDatum<GraphNode> {
  source: string | GraphNode;
  target: string | GraphNode;
  strength?: number;
}

interface Props {
  materials: Material[];
  heritages: Heritage[];
}

export function AromaticRaritiesGraph({ materials, heritages }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  useEffect(() => {
    if (!svgRef.current || !materials.length || !heritages.length) return;

    // Créer les nœuds
    const nodes: GraphNode[] = [
      ...materials.map(m => ({
        id: `material-${m.id}`,
        name: m.name,
        type: 'material' as const,
        rarity: m.rarity,
        category: m.category,
        x: Math.random() * 800,
        y: Math.random() * 600
      })),
      ...heritages.map(h => ({
        id: `accord-${h.id}`,
        name: h.name,
        type: 'accord' as const,
        rarity: h.rarity,
        x: Math.random() * 800,
        y: Math.random() * 600
      }))
    ];

    // Créer les liens basés sur les catégories et rareté
    const links: GraphLink[] = [];
    materials.forEach(material => {
      heritages.forEach(heritage => {
        // Créer des liens basés sur la rareté commune ou la catégorie
        const rarityMatch = material.rarity === heritage.rarity;
        const categoryMatch = material.category?.toLowerCase().includes('patrimonial');
        
        if (rarityMatch || categoryMatch) {
          links.push({
            source: `material-${material.id}`,
            target: `accord-${heritage.id}`,
            strength: rarityMatch ? 1 : 0.5
          });
        }
      });
    });

    // Dimensions
    const width = 1000;
    const height = 700;
    const margin = { top: 20, right: 20, bottom: 20, left: 20 };

    // Nettoyer le SVG
    d3.select(svgRef.current).selectAll("*").remove();

    // Créer le SVG
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', [0, 0, width, height]);

    // Ajouter le zoom
    const g = svg.append('g');
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });
    svg.call(zoom);

    // Créer la simulation de force
    const simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink<GraphNode, GraphLink>(links)
        .id(d => d.id)
        .distance(d => (d.strength || 1) === 1 ? 80 : 120)
        .strength(d => (d.strength || 1) * 0.5))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(40));

    // Ajouter les liens
    const link = g.append('g')
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke', '#cbd5e1')
      .attr('stroke-width', d => (d.strength || 1) === 1 ? 2 : 1)
      .attr('stroke-opacity', 0.6)
      .attr('stroke-dasharray', d => (d.strength || 1) === 1 ? '0' : '5,5');

    // Ajouter les nœuds
    const node = g.append('g')
      .selectAll('g')
      .data(nodes)
      .join('g')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .call(d3.drag<SVGGElement, GraphNode>().on('start', dragstarted).on('drag', dragged).on('end', dragended) as any);

    // Cercles des nœuds
    node.append('circle')
      .attr('r', d => d.type === 'accord' ? 25 : 20)
      .attr('fill', d => {
        if (d.type === 'accord') return '#8b5cf6';
        if (d.rarity === 'Critique') return '#dc2626';
        if (d.rarity === 'Menacé') return '#ea580c';
        if (d.rarity === 'Vulnérable') return '#eab308';
        if (d.rarity === 'Traces') return '#3b82f6';
        return '#6b7280';
      })
      .attr('stroke', d => {
        if (hoveredNode === d.id || selectedNode === d.id) return '#000';
        return '#fff';
      })
      .attr('stroke-width', d => {
        if (hoveredNode === d.id || selectedNode === d.id) return 3;
        return 2;
      })
      .on('mouseenter', function(event, d) {
        setHoveredNode(d.id);
        d3.select(this).attr('stroke', '#000').attr('stroke-width', 3);
      })
      .on('mouseleave', function(event, d) {
        if (selectedNode !== d.id) {
          setHoveredNode(null);
          d3.select(this).attr('stroke', '#fff').attr('stroke-width', 2);
        }
      })
      .on('click', (event, d) => {
        setSelectedNode(selectedNode === d.id ? null : d.id);
      });

    // Icônes/texte
    node.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '0.3em')
      .attr('font-size', d => d.type === 'accord' ? '12px' : '10px')
      .attr('font-weight', 'bold')
      .attr('fill', '#fff')
      .attr('pointer-events', 'none')
      .text(d => d.type === 'accord' ? '♦' : '●');

    // Labels
    const labels = g.append('g')
      .selectAll('text')
      .data(nodes)
      .join('text')
      .attr('font-size', '11px')
      .attr('text-anchor', 'middle')
      .attr('dy', d => d.type === 'accord' ? '35px' : '30px')
      .attr('fill', '#475569')
      .attr('pointer-events', 'none')
      .attr('opacity', d => {
        if (!hoveredNode && !selectedNode) return 0.7;
        if (hoveredNode === d.id || selectedNode === d.id) return 1;
        return 0.3;
      })
      .text(d => {
        const text = d.name;
        return text.length > 15 ? text.substring(0, 12) + '...' : text;
      });

    // Mettre à jour les positions à chaque tick
    simulation.on('tick', () => {
      link
        .attr('x1', d => (d.source as GraphNode).x || 0)
        .attr('y1', d => (d.source as GraphNode).y || 0)
        .attr('x2', d => (d.target as GraphNode).x || 0)
        .attr('y2', d => (d.target as GraphNode).y || 0);

      node.attr('transform', d => `translate(${d.x || 0},${d.y || 0})`);
      labels.attr('transform', d => `translate(${d.x || 0},${d.y || 0})`);
    });

    // Fonctions de drag
    function dragstarted(event: d3.D3DragEvent<SVGGElement, GraphNode, GraphNode>) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event: d3.D3DragEvent<SVGGElement, GraphNode, GraphNode>) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event: d3.D3DragEvent<SVGGElement, GraphNode, GraphNode>) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    return () => {
      simulation.stop();
    };
  }, [materials, heritages, hoveredNode, selectedNode]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="w-5 h-5" />
          Graphe des relations
        </CardTitle>
        <CardDescription>
          Relations entre les 39 matières premières rares et les 4 accords patrimoniaux
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Légende */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 bg-slate-50 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-red-600"></div>
              <span className="text-xs text-slate-600">Critique</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-orange-600"></div>
              <span className="text-xs text-slate-600">Menacé</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
              <span className="text-xs text-slate-600">Vulnérable</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-blue-500"></div>
              <span className="text-xs text-slate-600">Traces</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-purple-600 flex items-center justify-center text-white text-xs">◆</div>
              <span className="text-xs text-slate-600">Accord</span>
            </div>
          </div>

          {/* Graphe */}
          <svg
            ref={svgRef}
            className="w-full border border-slate-200 rounded-lg bg-white"
            style={{ minHeight: '700px' }}
          />

          {/* Info sélection */}
          {selectedNode && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-900">
              Nœud sélectionné : <strong>{selectedNode}</strong>
            </div>
          )}

          {/* Instructions */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600 space-y-1">
            <p><strong>Interactions :</strong></p>
            <ul className="list-disc list-inside space-y-1">
              <li>Survolez un nœud pour le mettre en surbrillance</li>
              <li>Cliquez pour sélectionner/désélectionner</li>
              <li>Glissez pour repositionner les nœuds</li>
              <li>Utilisez la molette pour zoomer</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
