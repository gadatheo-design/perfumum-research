// @ts-nocheck
import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ZoomIn, ZoomOut, RotateCcw, Maximize2, Filter } from 'lucide-react';

interface GraphNode {
  id: number;
  code: string;
  name: string;
  metaAxis: string;
  color: string;
  referenceCount: number;
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
}

interface GraphLink {
  source: number | GraphNode;
  target: number | GraphNode;
  strength: number;
  type: string;
}

interface AxisForceGraphProps {
  nodes: GraphNode[];
  links: GraphLink[];
  onNodeClick?: (node: GraphNode) => void;
  width?: number;
  height?: number;
}

const META_AXIS_LABELS: Record<string, string> = {
  meta_a: 'Olfactory Heritage & Archives',
  meta_b: 'Olfactory Arts & Chimie de l\'espace',
  meta_c: 'Digital Olfaction (IA/VR/Capteurs)',
  other: 'Autres (Cannabis, Tabac, etc.)',
};

const META_AXIS_COLORS: Record<string, string> = {
  meta_a: '#F59E0B',
  meta_b: '#EC4899',
  meta_c: '#06B6D4',
  other: '#22C55E',
};

export function AxisForceGraph({ 
  nodes, 
  links, 
  onNodeClick,
  width = 800,
  height = 600 
}: AxisForceGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [filterMetaAxis, setFilterMetaAxis] = useState<string>('all');
  const [linkStrengthMin, setLinkStrengthMin] = useState<number>(1);
  const [dimensions, setDimensions] = useState({ width, height });

  // Responsive dimensions
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setDimensions({
          width: Math.max(rect.width - 32, 400),
          height: Math.max(rect.height - 100, 400),
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // D3 Force Simulation
  useEffect(() => {
    if (!svgRef.current || nodes.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    // Filter nodes and links based on meta-axis
    const filteredNodes = filterMetaAxis === 'all' 
      ? [...nodes] 
      : nodes.filter(n => n.metaAxis === filterMetaAxis);
    
    const filteredNodeIds = new Set(filteredNodes.map(n => n.id));
    
    const filteredLinks = links.filter(l => {
      const sourceId = typeof l.source === 'object' ? l.source.id : l.source;
      const targetId = typeof l.target === 'object' ? l.target.id : l.target;
      return filteredNodeIds.has(sourceId) && 
             filteredNodeIds.has(targetId) && 
             l.strength >= linkStrengthMin;
    });

    // Create node map for links
    const nodeMap = new Map(filteredNodes.map(n => [n.id, n]));

    // Process links to use node objects
    const processedLinks = filteredLinks.map(l => ({
      ...l,
      source: nodeMap.get(typeof l.source === 'object' ? l.source.id : l.source)!,
      target: nodeMap.get(typeof l.target === 'object' ? l.target.id : l.target)!,
    })).filter(l => l.source && l.target);

    // Set up zoom
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.3, 4])
      .on('zoom', (event) => {
        container.attr('transform', event.transform);
      });

    svg.call(zoom);

    // Container for all elements
    const container = svg.append('g');

    // Create force simulation
    const simulation = d3.forceSimulation<GraphNode>(filteredNodes)
      .force('link', d3.forceLink<GraphNode, any>(processedLinks)
        .id(d => d.id)
        .distance(d => 150 - (d.strength * 10))
        .strength(d => d.strength / 10))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(dimensions.width / 2, dimensions.height / 2))
      .force('collision', d3.forceCollide().radius(d => 30 + (d as GraphNode).referenceCount * 2));

    // Draw links
    const link = container.append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(processedLinks)
      .enter()
      .append('line')
      .attr('stroke', '#94a3b8')
      .attr('stroke-opacity', d => 0.3 + (d.strength / 10) * 0.5)
      .attr('stroke-width', d => 1 + d.strength / 3);

    // Draw nodes
    const node = container.append('g')
      .attr('class', 'nodes')
      .selectAll('g')
      .data(filteredNodes)
      .enter()
      .append('g')
      .attr('cursor', 'pointer')
      .call(d3.drag<SVGGElement, GraphNode>()
        .on('start', (event, d) => {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        })
        .on('drag', (event, d) => {
          d.fx = event.x;
          d.fy = event.y;
        })
        .on('end', (event, d) => {
          if (!event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        }));

    // Node circles
    node.append('circle')
      .attr('r', d => 20 + Math.sqrt(d.referenceCount) * 3)
      .attr('fill', d => d.color || META_AXIS_COLORS[d.metaAxis] || '#6366f1')
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)
      .attr('opacity', 0.9);

    // Node labels (code)
    node.append('text')
      .text(d => d.code)
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em')
      .attr('fill', '#fff')
      .attr('font-size', '12px')
      .attr('font-weight', 'bold')
      .attr('pointer-events', 'none');

    // Reference count badge
    node.append('circle')
      .attr('cx', d => 15 + Math.sqrt(d.referenceCount) * 2)
      .attr('cy', -15)
      .attr('r', 10)
      .attr('fill', '#1e293b')
      .attr('stroke', '#fff')
      .attr('stroke-width', 1);

    node.append('text')
      .text(d => d.referenceCount)
      .attr('x', d => 15 + Math.sqrt(d.referenceCount) * 2)
      .attr('y', -15)
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em')
      .attr('fill', '#fff')
      .attr('font-size', '9px')
      .attr('font-weight', 'bold')
      .attr('pointer-events', 'none');

    // Tooltip
    const tooltip = d3.select('body').append('div')
      .attr('class', 'axis-graph-tooltip')
      .style('position', 'absolute')
      .style('visibility', 'hidden')
      .style('background', 'rgba(15, 23, 42, 0.95)')
      .style('color', '#fff')
      .style('padding', '12px 16px')
      .style('border-radius', '8px')
      .style('font-size', '13px')
      .style('max-width', '300px')
      .style('box-shadow', '0 4px 20px rgba(0,0,0,0.3)')
      .style('z-index', '1000')
      .style('pointer-events', 'none');

    // Node interactions
    node
      .on('mouseover', (event, d) => {
        tooltip
          .style('visibility', 'visible')
          .html(`
            <div style="font-weight: bold; font-size: 14px; margin-bottom: 4px;">${d.code}: ${d.name}</div>
            <div style="color: #94a3b8; margin-bottom: 8px;">${META_AXIS_LABELS[d.metaAxis] || d.metaAxis}</div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="background: ${d.color}; width: 12px; height: 12px; border-radius: 50%; display: inline-block;"></span>
              <span>${d.referenceCount} référence${d.referenceCount > 1 ? 's' : ''}</span>
            </div>
          `);
        
        d3.select(event.currentTarget).select('circle')
          .transition()
          .duration(200)
          .attr('stroke-width', 4)
          .attr('opacity', 1);
      })
      .on('mousemove', (event) => {
        tooltip
          .style('top', (event.pageY - 10) + 'px')
          .style('left', (event.pageX + 15) + 'px');
      })
      .on('mouseout', (event) => {
        tooltip.style('visibility', 'hidden');
        
        d3.select(event.currentTarget).select('circle')
          .transition()
          .duration(200)
          .attr('stroke-width', 2)
          .attr('opacity', 0.9);
      })
      .on('click', (event, d) => {
        setSelectedNode(d);
        onNodeClick?.(d);
      });

    // Update positions on tick
    simulation.on('tick', () => {
      link
        .attr('x1', d => (d.source as GraphNode).x!)
        .attr('y1', d => (d.source as GraphNode).y!)
        .attr('x2', d => (d.target as GraphNode).x!)
        .attr('y2', d => (d.target as GraphNode).y!);

      node.attr('transform', d => `translate(${d.x},${d.y})`);
    });

    // Cleanup
    return () => {
      simulation.stop();
      tooltip.remove();
    };
  }, [nodes, links, dimensions, filterMetaAxis, linkStrengthMin, onNodeClick]);

  // Zoom controls
  const handleZoom = (factor: number) => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    svg.transition().duration(300).call(
      d3.zoom<SVGSVGElement, unknown>().scaleBy as any,
      factor
    );
  };

  const handleReset = () => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    svg.transition().duration(500).call(
      d3.zoom<SVGSVGElement, unknown>().transform as any,
      d3.zoomIdentity
    );
  };

  return (
    <div ref={containerRef} className="w-full h-full flex flex-col">
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-4 mb-4 p-4 bg-slate-900/50 rounded-lg">
        {/* Meta-axis filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <Select value={filterMetaAxis} onValueChange={setFilterMetaAxis}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filtrer par méta-axe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les axes</SelectItem>
              <SelectItem value="meta_a">Heritage & Archives</SelectItem>
              <SelectItem value="meta_b">Arts & Espace</SelectItem>
              <SelectItem value="meta_c">Digital Olfaction</SelectItem>
              <SelectItem value="other">Autres</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Link strength filter */}
        <div className="flex items-center gap-2 min-w-[200px]">
          <span className="text-sm text-slate-400">Force min:</span>
          <Slider
            value={[linkStrengthMin]}
            onValueChange={([v]) => setLinkStrengthMin(v)}
            min={1}
            max={10}
            step={1}
            className="w-24"
          />
          <span className="text-sm text-slate-300">{linkStrengthMin}</span>
        </div>

        {/* Zoom controls */}
        <div className="flex items-center gap-1 ml-auto">
          <Button variant="outline" size="icon" onClick={() => handleZoom(1.5)}>
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => handleZoom(0.67)}>
            <ZoomOut className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleReset}>
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mb-4">
        {Object.entries(META_AXIS_LABELS).map(([key, label]) => (
          <Badge 
            key={key} 
            variant="outline" 
            className="flex items-center gap-2"
            style={{ borderColor: META_AXIS_COLORS[key] }}
          >
            <span 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: META_AXIS_COLORS[key] }}
            />
            {label}
          </Badge>
        ))}
      </div>

      {/* Graph */}
      <div className="flex-1 bg-slate-950 rounded-lg overflow-hidden border border-slate-800">
        <svg
          ref={svgRef}
          width={dimensions.width}
          height={dimensions.height}
          className="w-full h-full"
        />
      </div>

      {/* Selected node info */}
      {selectedNode && (
        <Card className="mt-4 bg-slate-900/50 border-slate-700">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-3">
              <span 
                className="w-4 h-4 rounded-full" 
                style={{ backgroundColor: selectedNode.color }}
              />
              {selectedNode.code}: {selectedNode.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4 text-sm">
              <div>
                <span className="text-slate-400">Méta-axe:</span>{' '}
                <span className="text-slate-200">{META_AXIS_LABELS[selectedNode.metaAxis]}</span>
              </div>
              <div>
                <span className="text-slate-400">Références:</span>{' '}
                <span className="text-slate-200">{selectedNode.referenceCount}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default AxisForceGraph;
