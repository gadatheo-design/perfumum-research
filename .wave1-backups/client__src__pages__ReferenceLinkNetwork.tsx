// @ts-nocheck
import { useEffect, useRef, useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Loader2, Download, Filter } from 'lucide-react';

interface Node {
  id: string;
  label: string;
  type: string;
  group: string;
}

interface Link {
  source: string;
  target: string;
  linkType: string;
  relevanceScore: number;
}

export default function ReferenceLinkNetwork() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedEntityType, setSelectedEntityType] = useState<string>('all');
  const [selectedLinkType, setSelectedLinkType] = useState<string>('all');
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const { data: graphData, isLoading } = trpc.referenceEntityLinks.getGraphData.useQuery();

  useEffect(() => {
    if (!graphData || !svgRef.current) return;

    // Filter data based on selections
    let filteredNodes = graphData.nodes;
    let filteredLinks = graphData.links;

    if (selectedEntityType !== 'all') {
      filteredNodes = graphData.nodes.filter(
        n => n.type === selectedEntityType || n.type === 'reference'
      );
      const nodeIds = new Set(filteredNodes.map(n => n.id));
      filteredLinks = graphData.links.filter(
        l => nodeIds.has(l.source) && nodeIds.has(l.target)
      );
    }

    if (selectedLinkType !== 'all') {
      filteredLinks = filteredLinks.filter(l => l.linkType === selectedLinkType);
      const linkedNodeIds = new Set<string>();
      filteredLinks.forEach(l => {
        linkedNodeIds.add(l.source);
        linkedNodeIds.add(l.target);
      });
      filteredNodes = filteredNodes.filter(n => linkedNodeIds.has(n.id));
    }

    // Simple force-directed graph visualization
    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;

    // Clear previous content
    while (svgRef.current.firstChild) {
      svgRef.current.removeChild(svgRef.current.firstChild);
    }

    // Create SVG elements
    const svg = svgRef.current;
    
    // Add defs for markers
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    const marker = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
    marker.setAttribute('id', 'arrowhead');
    marker.setAttribute('markerWidth', '10');
    marker.setAttribute('markerHeight', '10');
    marker.setAttribute('refX', '9');
    marker.setAttribute('refY', '3');
    marker.setAttribute('orient', 'auto');
    const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    polygon.setAttribute('points', '0 0, 10 3, 0 6');
    polygon.setAttribute('fill', '#999');
    marker.appendChild(polygon);
    defs.appendChild(marker);
    svg.appendChild(defs);

    // Create links
    const linkGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    filteredLinks.forEach(link => {
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', '100');
      line.setAttribute('y1', '100');
      line.setAttribute('x2', '200');
      line.setAttribute('y2', '200');
      line.setAttribute('stroke', '#ccc');
      line.setAttribute('stroke-width', String(Math.max(1, link.relevanceScore / 50)));
      line.setAttribute('marker-end', 'url(#arrowhead)');
      line.setAttribute('opacity', '0.6');
      linkGroup.appendChild(line);
    });
    svg.appendChild(linkGroup);

    // Create nodes
    const nodeGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    
    const colorMap: Record<string, string> = {
      reference: '#3b82f6',
      molecule: '#ef4444',
      plant: '#10b981',
      recette: '#f59e0b',
      prototype: '#8b5cf6',
      tradition: '#ec4899',
      terroir: '#14b8a6',
      supplier: '#6366f1',
      leaf_economy: '#84cc16',
    };

    filteredNodes.forEach((node, idx) => {
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      const x = (idx % 10) * (width / 10) + 50;
      const y = Math.floor(idx / 10) * (height / 5) + 50;
      
      circle.setAttribute('cx', String(x));
      circle.setAttribute('cy', String(y));
      circle.setAttribute('r', node.type === 'reference' ? '8' : '6');
      circle.setAttribute('fill', colorMap[node.type] || '#999');
      circle.setAttribute('opacity', hoveredNode === null || hoveredNode === node.id ? '1' : '0.3');
      circle.setAttribute('cursor', 'pointer');
      
      circle.addEventListener('mouseenter', () => setHoveredNode(node.id));
      circle.addEventListener('mouseleave', () => setHoveredNode(null));
      
      const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
      title.textContent = node.label;
      circle.appendChild(title);
      
      nodeGroup.appendChild(circle);

      // Add label
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', String(x));
      text.setAttribute('y', String(y + 15));
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('font-size', '10');
      text.setAttribute('fill', '#333');
      text.setAttribute('pointer-events', 'none');
      text.textContent = node.label.substring(0, 10);
      nodeGroup.appendChild(text);
    });
    
    svg.appendChild(nodeGroup);

  }, [graphData, selectedEntityType, selectedLinkType, hoveredNode]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  const entityTypes = ['all', ...new Set(graphData?.nodes.map(n => n.type).filter(t => t !== 'reference') || [])];
  const linkTypes = ['all', ...new Set(graphData?.links.map(l => l.linkType) || [])];

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        <Breadcrumbs
          items={[
            { label: 'Accueil', href: '/' },
            { label: 'Références', href: '/references-v3' },
            { label: 'Réseau de liaisons' }
          ]}
        />

        <div className="mt-8 space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Réseau de liaisons références-entités</h1>
            <p className="text-muted-foreground mt-2">
              Visualisation interactive des connexions entre références et entités
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Filtres
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Type d'entité</label>
                <Select value={selectedEntityType} onValueChange={setSelectedEntityType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {entityTypes.map(type => (
                      <SelectItem key={type} value={type}>
                        {type === 'all' ? 'Tous les types' : type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Type de liaison</label>
                <Select value={selectedLinkType} onValueChange={setSelectedLinkType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {linkTypes.map(type => (
                      <SelectItem key={type} value={type}>
                        {type === 'all' ? 'Tous les types' : type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card className="h-96">
            <CardContent className="p-0 h-full">
              <svg
                ref={svgRef}
                className="w-full h-full bg-white rounded-b-lg"
                style={{ border: '1px solid #e5e7eb' }}
              />
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="font-semibold text-sm">Légende</h3>
              <div className="space-y-1 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-blue-500" />
                  <span>Références</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-red-500" />
                  <span>Molécules</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-green-500" />
                  <span>Plantes</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-amber-500" />
                  <span>Recettes</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-sm">Statistiques</h3>
              <div className="text-sm space-y-1">
                <div>Nœuds: {graphData?.nodes.length || 0}</div>
                <div>Liaisons: {graphData?.links.length || 0}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
