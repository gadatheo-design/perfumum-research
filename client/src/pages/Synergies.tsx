import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { trpc } from '../lib/trpc';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Network, Filter, RefreshCw } from 'lucide-react';

type NodeType = 'molecule' | 'tabac' | 'famille';
type SynergyType = 'potentialisation' | 'stabilisation' | 'transformation' | 'masquage';

interface GraphNode {
  id: string;
  name: string;
  type: NodeType;
}

interface GraphEdge {
  source: string;
  target: string;
  synergyType: SynergyType;
  synergyName: string;
  effet: string | null;
}

export default function Synergies() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedType, setSelectedType] = useState<SynergyType | 'all'>('all');
  const { data: graphData, isLoading } = trpc.synergies.getGraphData.useQuery();
  const { data: allSynergies } = trpc.synergies.list.useQuery();

  useEffect(() => {
    if (!graphData || !svgRef.current) return;

    // Filtrer les données selon le type sélectionné
    const filteredEdges = selectedType === 'all' 
      ? graphData.edges 
      : graphData.edges.filter(e => e.synergyType === selectedType);

    // Extraire les nœuds utilisés dans les arêtes filtrées
    const usedNodeIds = new Set<string>();
    filteredEdges.forEach(edge => {
      usedNodeIds.add(edge.source);
      usedNodeIds.add(edge.target);
    });
    const filteredNodes = graphData.nodes.filter(n => usedNodeIds.has(n.id));

    // Dimensions
    const width = 1000;
    const height = 700;

    // Nettoyer le SVG
    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('class', 'border rounded-lg bg-background');

    // Créer un groupe pour le zoom
    const g = svg.append('g');

    // Simulation de force
    const simulation = d3.forceSimulation(filteredNodes as any)
      .force('link', d3.forceLink(filteredEdges)
        .id((d: any) => d.id)
        .distance(150))
      .force('charge', d3.forceManyBody().strength(-400))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(50));

    // Couleurs selon le type de synergie
    const synergyColors: Record<SynergyType, string> = {
      potentialisation: '#8b5cf6', // violet
      stabilisation: '#22c55e',    // vert
      transformation: '#f97316',   // orange
      masquage: '#ef4444'          // rouge
    };

    // Couleurs selon le type de nœud
    const nodeColors: Record<NodeType, string> = {
      molecule: '#3b82f6',  // bleu
      tabac: '#eab308',     // jaune
      famille: '#ec4899'    // rose
    };

    // Dessiner les arêtes
    const link = g.append('g')
      .selectAll('line')
      .data(filteredEdges)
      .join('line')
      .attr('stroke', d => synergyColors[d.synergyType])
      .attr('stroke-width', 2)
      .attr('stroke-opacity', 0.6);

    // Dessiner les nœuds
    const node = g.append('g')
      .selectAll('g')
      .data(filteredNodes)
      .join('g')
      .call(d3.drag<any, any>()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended) as any);

    node.append('circle')
      .attr('r', 20)
      .attr('fill', d => nodeColors[d.type])
      .attr('stroke', '#fff')
      .attr('stroke-width', 2);

    node.append('text')
      .text(d => d.name)
      .attr('x', 25)
      .attr('y', 5)
      .attr('class', 'text-xs font-medium fill-foreground')
      .attr('pointer-events', 'none');

    // Tooltips
    node.append('title')
      .text(d => `${d.name} (${d.type})`);

    link.append('title')
      .text(d => `${d.synergyName}\n${d.synergyType}\n${d.effet || ''}`);

    // Mise à jour des positions
    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      node.attr('transform', (d: any) => `translate(${d.x},${d.y})`);
    });

    // Fonctions de drag
    function dragstarted(event: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event: any) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event: any) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    // Zoom
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 3])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoom as any);

  }, [graphData, selectedType]);

  const resetView = () => {
    setSelectedType('all');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Chargement des synergies...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Network className="w-10 h-10 text-primary" />
            <h1 className="text-4xl font-bold">SYNERGIES MOLÉCULAIRES</h1>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Visualisation interactive des synergies entre molécules, tabacs et familles olfactives. 
            Explorez les interactions de potentialisation, stabilisation, transformation et masquage.
          </p>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-4 text-center">
            <div className="text-3xl font-bold text-primary">{graphData?.nodes.length || 0}</div>
            <div className="text-sm text-muted-foreground">Nœuds</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-3xl font-bold text-primary">{graphData?.edges.length || 0}</div>
            <div className="text-sm text-muted-foreground">Synergies</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-3xl font-bold text-blue-500">
              {graphData?.nodes.filter(n => n.type === 'molecule').length || 0}
            </div>
            <div className="text-sm text-muted-foreground">Molécules</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-3xl font-bold text-yellow-500">
              {graphData?.nodes.filter(n => n.type === 'tabac').length || 0}
            </div>
            <div className="text-sm text-muted-foreground">Tabacs</div>
          </Card>
        </div>

        {/* Filtres */}
        <Card className="p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              <h2 className="text-xl font-bold">FILTRES</h2>
            </div>
            <Button variant="outline" size="sm" onClick={resetView}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Réinitialiser
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Type de Synergie</label>
              <Select value={selectedType} onValueChange={(v) => setSelectedType(v as any)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les synergies</SelectItem>
                  <SelectItem value="potentialisation">🟣 Potentialisation</SelectItem>
                  <SelectItem value="stabilisation">🟢 Stabilisation</SelectItem>
                  <SelectItem value="transformation">🟠 Transformation</SelectItem>
                  <SelectItem value="masquage">🔴 Masquage</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {/* Graphe */}
        <Card className="p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">GRAPHE INTERACTIF</h2>
          <div className="flex justify-center">
            <svg ref={svgRef}></svg>
          </div>
          <div className="mt-4 text-sm text-muted-foreground text-center">
            💡 Glissez les nœuds pour réorganiser • Utilisez la molette pour zoomer • Survolez pour plus d'infos
          </div>
        </Card>

        {/* Légende */}
        <Card className="p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">LÉGENDE</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-bold mb-3">Types de Nœuds</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-500 border-2 border-white"></div>
                  <span>Molécule</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-yellow-500 border-2 border-white"></div>
                  <span>Tabac</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-pink-500 border-2 border-white"></div>
                  <span>Famille Olfactive</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-bold mb-3">Types de Synergies</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-1 bg-violet-500"></div>
                  <span>Potentialisation (renforce l'effet)</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-1 bg-green-500"></div>
                  <span>Stabilisation (prolonge la durée)</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-1 bg-orange-500"></div>
                  <span>Transformation (modifie le profil)</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-1 bg-red-500"></div>
                  <span>Masquage (atténue certaines notes)</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Liste des synergies */}
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">LISTE DES SYNERGIES ({allSynergies?.length || 0})</h2>
          <div className="space-y-3">
            {allSynergies?.map(synergy => (
              <div key={synergy.id} className="border rounded-lg p-4 hover:bg-accent/50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{synergy.name}</h3>
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      {synergy.moleculeName && (
                        <span className="flex items-center gap-1">
                          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                          {synergy.moleculeName}
                        </span>
                      )}
                      {synergy.tabacName && (
                        <span className="flex items-center gap-1">
                          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                          {synergy.tabacName}
                        </span>
                      )}
                      {synergy.familleName && (
                        <span className="flex items-center gap-1">
                          <div className="w-3 h-3 rounded-full bg-pink-500"></div>
                          {synergy.familleName}
                        </span>
                      )}
                    </div>
                    {synergy.effet && (
                      <p className="mt-2 text-sm">{synergy.effet}</p>
                    )}
                  </div>
                  <div className="ml-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      synergy.type === 'potentialisation' ? 'bg-violet-500/20 text-violet-700 dark:text-violet-300' :
                      synergy.type === 'stabilisation' ? 'bg-green-500/20 text-green-700 dark:text-green-300' :
                      synergy.type === 'transformation' ? 'bg-orange-500/20 text-orange-700 dark:text-orange-300' :
                      'bg-red-500/20 text-red-700 dark:text-red-300'
                    }`}>
                      {synergy.type}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
