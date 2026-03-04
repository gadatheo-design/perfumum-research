// @ts-nocheck
import { useState, useEffect, useRef } from 'react';
import { trpc } from '@/lib/trpc';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Leaf, X, Plus, BarChart3, Flame, Wind, MapPin, Dna } from 'lucide-react';
import { Link } from 'wouter';
import * as d3 from 'd3';

// Composant Radar Chart D3.js pour comparer les profils terpéniques
function ComparisonRadarChart({ 
  landraces, 
  profiles 
}: { 
  landraces: any[]; 
  profiles: Map<number, any[]>;
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  
  useEffect(() => {
    if (!svgRef.current || landraces.length === 0) return;
    
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();
    
    const width = 400;
    const height = 400;
    const margin = 60;
    const radius = Math.min(width, height) / 2 - margin;
    
    // Collecter tous les terpènes uniques
    const allTerpenes = new Set<string>();
    landraces.forEach(l => {
      const lProfiles = profiles.get(l.id) || [];
      lProfiles.forEach((p: any) => allTerpenes.add(p.terpene_name));
    });
    const terpeneList = Array.from(allTerpenes).slice(0, 8); // Max 8 axes
    
    if (terpeneList.length === 0) return;
    
    const g = svg
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width/2}, ${height/2})`);
    
    // Échelle angulaire
    const angleSlice = (Math.PI * 2) / terpeneList.length;
    
    // Échelle radiale
    const rScale = d3.scaleLinear()
      .domain([0, 100])
      .range([0, radius]);
    
    // Grille circulaire
    const levels = 5;
    for (let level = 1; level <= levels; level++) {
      g.append('circle')
        .attr('r', radius * level / levels)
        .attr('fill', 'none')
        .attr('stroke', 'hsl(var(--border))')
        .attr('stroke-opacity', 0.3);
    }
    
    // Axes
    terpeneList.forEach((terpene, i) => {
      const angle = angleSlice * i - Math.PI / 2;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      
      g.append('line')
        .attr('x1', 0)
        .attr('y1', 0)
        .attr('x2', x)
        .attr('y2', y)
        .attr('stroke', 'hsl(var(--border))')
        .attr('stroke-opacity', 0.5);
      
      // Labels
      const labelX = Math.cos(angle) * (radius + 20);
      const labelY = Math.sin(angle) * (radius + 20);
      
      g.append('text')
        .attr('x', labelX)
        .attr('y', labelY)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .attr('fill', 'hsl(var(--foreground))')
        .attr('font-size', '10px')
        .text(terpene.length > 10 ? terpene.substring(0, 10) + '...' : terpene);
    });
    
    // Couleurs pour chaque landrace
    const colors = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444'];
    
    // Tracer les polygones pour chaque landrace
    landraces.forEach((landrace, idx) => {
      const lProfiles = profiles.get(landrace.id) || [];
      const profileMap = new Map(lProfiles.map((p: any) => [p.terpene_name, p.relative_abundance || 0]));
      
      const points = terpeneList.map((terpene, i) => {
        const value = profileMap.get(terpene) || 0;
        const angle = angleSlice * i - Math.PI / 2;
        return {
          x: Math.cos(angle) * rScale(value),
          y: Math.sin(angle) * rScale(value)
        };
      });
      
      // Ligne du polygone
      const lineGenerator = d3.line<{x: number, y: number}>()
        .x(d => d.x)
        .y(d => d.y)
        .curve(d3.curveLinearClosed);
      
      // Zone remplie
      g.append('path')
        .datum(points)
        .attr('d', lineGenerator)
        .attr('fill', colors[idx % colors.length])
        .attr('fill-opacity', 0.2)
        .attr('stroke', colors[idx % colors.length])
        .attr('stroke-width', 2);
      
      // Points
      points.forEach(point => {
        g.append('circle')
          .attr('cx', point.x)
          .attr('cy', point.y)
          .attr('r', 4)
          .attr('fill', colors[idx % colors.length]);
      });
    });
    
  }, [landraces, profiles]);
  
  return <svg ref={svgRef} className="mx-auto" />;
}

// Composant de sélection de landrace
function LandraceSelector({ 
  selectedIds, 
  onSelect, 
  onRemove,
  maxSelections = 3
}: { 
  selectedIds: number[];
  onSelect: (id: number) => void;
  onRemove: (id: number) => void;
  maxSelections?: number;
}) {
  const { data: landraces, isLoading } = trpc.tobacco.getLandraces.useQuery();
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }
  
  const availableLandraces = landraces?.filter(l => !selectedIds.includes(l.id)) || [];
  const selectedLandraces = landraces?.filter(l => selectedIds.includes(l.id)) || [];
  
  return (
    <div className="space-y-4">
      {/* Landraces sélectionnées */}
      <div className="flex flex-wrap gap-2">
        {selectedLandraces.map((landrace, idx) => {
          const colors = ['bg-green-500/20 text-green-400 border-green-500/30', 
                         'bg-blue-500/20 text-blue-400 border-blue-500/30',
                         'bg-amber-500/20 text-amber-400 border-amber-500/30'];
          return (
            <Badge 
              key={landrace.id} 
              variant="outline"
              className={`${colors[idx % colors.length]} px-3 py-1.5 text-sm flex items-center gap-2`}
            >
              <Leaf className="h-3 w-3" />
              {landrace.name}
              <button 
                onClick={() => onRemove(landrace.id)}
                className="ml-1 hover:bg-white/20 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          );
        })}
      </div>
      
      {/* Sélecteur pour ajouter */}
      {selectedIds.length < maxSelections && (
        <div className="flex flex-wrap gap-2">
          {availableLandraces.map(landrace => (
            <Button
              key={landrace.id}
              variant="outline"
              size="sm"
              onClick={() => onSelect(landrace.id)}
              className="text-xs"
            >
              <Plus className="h-3 w-3 mr-1" />
              {landrace.name}
            </Button>
          ))}
        </div>
      )}
      
      {selectedIds.length === 0 && (
        <p className="text-sm text-muted-foreground">
          Sélectionnez jusqu'à {maxSelections} landraces à comparer
        </p>
      )}
    </div>
  );
}

export default function LandraceComparator() {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const { data: landraces } = trpc.tobacco.getLandraces.useQuery();
  const { data: allProfiles } = trpc.tobacco.getTerpeneProfiles.useQuery();
  
  // Organiser les profils par landrace
  const profilesByLandrace = new Map<number, any[]>();
  if (allProfiles && landraces) {
    landraces.forEach(landrace => {
      const profiles = allProfiles.filter((p: any) => 
        p.landrace_name?.toLowerCase() === landrace.name?.toLowerCase()
      );
      profilesByLandrace.set(landrace.id, profiles);
    });
  }
  
  const selectedLandraces = landraces?.filter(l => selectedIds.includes(l.id)) || [];
  
  const handleSelect = (id: number) => {
    if (selectedIds.length < 3) {
      setSelectedIds([...selectedIds, id]);
    }
  };
  
  const handleRemove = (id: number) => {
    setSelectedIds(selectedIds.filter(i => i !== id));
  };
  
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-900/20 via-blue-900/20 to-amber-900/20 border-b">
        <div className="container py-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-green-500/20 to-blue-500/20">
              <BarChart3 className="h-8 w-8 text-green-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Comparateur de Landraces</h1>
              <p className="text-muted-foreground">
                Comparez les profils terpéniques, pyrolytiques et olfactifs
              </p>
            </div>
          </div>
          
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-primary">Accueil</Link>
            <span>/</span>
            <Link href="/tobacco-landraces" className="hover:text-primary">Landraces</Link>
            <span>/</span>
            <span className="text-foreground">Comparateur</span>
          </div>
        </div>
      </div>
      
      <div className="container py-8 space-y-8">
        {/* Sélecteur de landraces */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Leaf className="h-5 w-5 text-green-500" />
              Sélection des Landraces
            </CardTitle>
          </CardHeader>
          <CardContent>
            <LandraceSelector
              selectedIds={selectedIds}
              onSelect={handleSelect}
              onRemove={handleRemove}
              maxSelections={3}
            />
          </CardContent>
        </Card>
        
        {selectedLandraces.length > 0 && (
          <>
            {/* Radar Chart Comparatif */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-blue-500" />
                  Profils Terpéniques Comparatifs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center">
                  <ComparisonRadarChart 
                    landraces={selectedLandraces}
                    profiles={profilesByLandrace}
                  />
                </div>
                
                {/* Légende */}
                <div className="flex justify-center gap-4 mt-4">
                  {selectedLandraces.map((landrace, idx) => {
                    const colors = ['#22c55e', '#3b82f6', '#f59e0b'];
                    return (
                      <div key={landrace.id} className="flex items-center gap-2">
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: colors[idx % colors.length] }}
                        />
                        <span className="text-sm">{landrace.name}</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
            
            {/* Tableau Comparatif */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Leaf className="h-5 w-5 text-green-500" />
                  Comparaison Détaillée
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-semibold">Caractéristique</th>
                        {selectedLandraces.map((landrace, idx) => {
                          const colors = ['text-green-400', 'text-blue-400', 'text-amber-400'];
                          return (
                            <th key={landrace.id} className={`text-left py-3 px-4 font-semibold ${colors[idx % colors.length]}`}>
                              {landrace.name}
                            </th>
                          );
                        })}
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-border/50">
                        <td className="py-3 px-4 flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          Région d'origine
                        </td>
                        {selectedLandraces.map(landrace => (
                          <td key={landrace.id} className="py-3 px-4">
                            {landrace.region || 'Non documentée'}
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b border-border/50">
                        <td className="py-3 px-4 flex items-center gap-2">
                          <Dna className="h-4 w-4 text-muted-foreground" />
                          Type génétique
                        </td>
                        {selectedLandraces.map(landrace => (
                          <td key={landrace.id} className="py-3 px-4">
                            <Badge variant="outline" className="text-xs">
                              {landrace.genetic_type || 'Non documenté'}
                            </Badge>
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b border-border/50">
                        <td className="py-3 px-4 flex items-center gap-2">
                          <Wind className="h-4 w-4 text-muted-foreground" />
                          Profil olfactif
                        </td>
                        {selectedLandraces.map(landrace => (
                          <td key={landrace.id} className="py-3 px-4 text-sm italic">
                            {landrace.olfactory_profile || 'Non documenté'}
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b border-border/50">
                        <td className="py-3 px-4 flex items-center gap-2">
                          <Flame className="h-4 w-4 text-muted-foreground" />
                          Profil de combustion
                        </td>
                        {selectedLandraces.map(landrace => (
                          <td key={landrace.id} className="py-3 px-4 text-sm">
                            {landrace.combustion_profile || 'Non documenté'}
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b border-border/50">
                        <td className="py-3 px-4 flex items-center gap-2">
                          <Leaf className="h-4 w-4 text-muted-foreground" />
                          Terpènes dominants
                        </td>
                        {selectedLandraces.map(landrace => {
                          const profiles = profilesByLandrace.get(landrace.id) || [];
                          const topTerpenes = profiles
                            .sort((a: any, b: any) => (b.relative_abundance || 0) - (a.relative_abundance || 0))
                            .slice(0, 3)
                            .map((p: any) => p.terpene_name);
                          return (
                            <td key={landrace.id} className="py-3 px-4">
                              <div className="flex flex-wrap gap-1">
                                {topTerpenes.length > 0 ? topTerpenes.map((t: string) => (
                                  <Badge key={t} variant="secondary" className="text-xs">
                                    {t}
                                  </Badge>
                                )) : (
                                  <span className="text-muted-foreground text-sm">Non documenté</span>
                                )}
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
            
            {/* Liens vers les fiches détaillées */}
            <div className="flex flex-wrap gap-4 justify-center">
              {selectedLandraces.map(landrace => (
                <Link key={landrace.id} href={`/tobacco-landraces/${landrace.id}`}>
                  <Button variant="outline">
                    <Leaf className="h-4 w-4 mr-2" />
                    Voir la fiche {landrace.name}
                  </Button>
                </Link>
              ))}
            </div>
          </>
        )}
        
        {selectedLandraces.length === 0 && (
          <Card className="bg-muted/50">
            <CardContent className="py-12 text-center">
              <BarChart3 className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
              <h3 className="text-lg font-semibold mb-2">Aucune landrace sélectionnée</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Sélectionnez jusqu'à 3 landraces ci-dessus pour comparer leurs profils 
                terpéniques, pyrolytiques et olfactifs côte à côte.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
