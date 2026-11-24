import { useState, useEffect, useRef } from 'react';
import { trpc } from '@/lib/trpc';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import * as d3 from 'd3';
import { 
  Atom, Beaker, ChevronLeft, ChevronRight, Info, 
  Zap, Scale, FlaskConical, Activity
} from 'lucide-react';
import { Link } from 'wouter';

interface MsSpectrum {
  id: number;
  compound_name: string;
  cas_number: string;
  molecular_formula: string;
  molecular_weight: number;
  ionization_mode: string;
  base_peak_mz: number;
  spectrum_data: {
    peaks: Array<{ mz: number; intensity: number }>;
  };
  fragmentation_pattern: string;
  source: string;
}

// Composant pour le graphique du spectre MS
function MsSpectrumChart({ spectrum }: { spectrum: MsSpectrum }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!svgRef.current || !spectrum?.spectrum_data?.peaks) return;
    
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();
    
    const containerWidth = containerRef.current?.clientWidth || 800;
    const width = containerWidth;
    const height = 400;
    const margin = { top: 30, right: 30, bottom: 60, left: 60 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    
    svg.attr('width', width).attr('height', height);
    
    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);
    
    const peaks = spectrum.spectrum_data.peaks;
    const maxMz = Math.max(...peaks.map(p => p.mz)) * 1.1;
    
    // Échelles
    const xScale = d3.scaleLinear()
      .domain([0, maxMz])
      .range([0, innerWidth]);
    
    const yScale = d3.scaleLinear()
      .domain([0, 100])
      .range([innerHeight, 0]);
    
    // Grille
    g.append('g')
      .attr('class', 'grid')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale).tickSize(-innerHeight).tickFormat(() => ''))
      .selectAll('line')
      .attr('stroke', '#333')
      .attr('stroke-opacity', 0.3);
    
    g.append('g')
      .attr('class', 'grid')
      .call(d3.axisLeft(yScale).tickSize(-innerWidth).tickFormat(() => ''))
      .selectAll('line')
      .attr('stroke', '#333')
      .attr('stroke-opacity', 0.3);
    
    // Axes
    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale))
      .selectAll('text')
      .attr('fill', '#888');
    
    g.append('g')
      .call(d3.axisLeft(yScale))
      .selectAll('text')
      .attr('fill', '#888');
    
    // Labels des axes
    g.append('text')
      .attr('x', innerWidth / 2)
      .attr('y', innerHeight + 45)
      .attr('text-anchor', 'middle')
      .attr('fill', '#888')
      .text('m/z');
    
    g.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -innerHeight / 2)
      .attr('y', -45)
      .attr('text-anchor', 'middle')
      .attr('fill', '#888')
      .text('Intensité relative (%)');
    
    // Barres du spectre
    g.selectAll('.peak')
      .data(peaks)
      .enter()
      .append('line')
      .attr('class', 'peak')
      .attr('x1', d => xScale(d.mz))
      .attr('x2', d => xScale(d.mz))
      .attr('y1', innerHeight)
      .attr('y2', d => yScale(d.intensity))
      .attr('stroke', d => d.mz === spectrum.base_peak_mz ? '#22c55e' : '#3b82f6')
      .attr('stroke-width', 2);
    
    // Labels des pics principaux
    peaks.filter(p => p.intensity >= 30).forEach(peak => {
      g.append('text')
        .attr('x', xScale(peak.mz))
        .attr('y', yScale(peak.intensity) - 8)
        .attr('text-anchor', 'middle')
        .attr('font-size', '11px')
        .attr('fill', peak.mz === spectrum.base_peak_mz ? '#22c55e' : '#888')
        .text(peak.mz);
    });
    
    // Titre
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', 20)
      .attr('text-anchor', 'middle')
      .attr('font-size', '14px')
      .attr('font-weight', 'bold')
      .attr('fill', '#fff')
      .text(`Spectre de masse EI de ${spectrum.compound_name}`);
    
  }, [spectrum]);
  
  return (
    <div ref={containerRef} className="w-full">
      <svg ref={svgRef} className="w-full" />
    </div>
  );
}

export default function MSSpectraViewer() {
  const [selectedCompound, setSelectedCompound] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Récupérer tous les spectres MS
  const { data: spectra, isLoading } = trpc.tobacco.getMsSpectra.useQuery();
  
  const currentSpectrum = spectra?.[currentIndex] as MsSpectrum | undefined;
  
  const handlePrevious = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };
  
  const handleNext = () => {
    if (spectra && currentIndex < spectra?.length - 1) setCurrentIndex(currentIndex + 1);
  };
  
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900/20 via-pink-900/20 to-red-900/20 border-b">
        <div className="container py-8">
          <div className="flex items-start gap-4">
            <div className="p-4 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20">
              <Atom className="h-10 w-10 text-purple-400" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">Spectres de Masse</h1>
              <p className="text-muted-foreground">
                Visualisez les spectres de masse (MS) des composés aromatiques identifiés par GC-MS.
                Les spectres sont basés sur les références NIST.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Liste des composés */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Beaker className="h-5 w-5 text-purple-500" />
                  Composés ({spectra?.length || 0})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-2">
                    {[1, 2, 3, 4, 5].map(i => (
                      <div key={i} className="h-10 bg-muted rounded animate-pulse" />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-1 max-h-[500px] overflow-y-auto">
                    {spectra?.map((spectrum: any, idx: number) => (
                      <Button
                        key={spectrum.id}
                        variant={idx === currentIndex ? 'default' : 'ghost'}
                        className="w-full justify-start text-left"
                        onClick={() => setCurrentIndex(idx)}
                      >
                        <FlaskConical className="h-4 w-4 mr-2 shrink-0" />
                        <span className="truncate">{spectrum.compound_name}</span>
                      </Button>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Légende */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Info className="h-5 w-5 text-blue-500" />
                  Légende
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 rounded" />
                  <span className="text-sm">Pic de base (100%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-500 rounded" />
                  <span className="text-sm">Autres fragments</span>
                </div>
                <p className="text-xs text-muted-foreground mt-4">
                  Les spectres sont obtenus par ionisation électronique (EI) à 70 eV.
                  Les intensités sont normalisées au pic de base.
                </p>
              </CardContent>
            </Card>
            
            {/* Outils connexes */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Outils connexes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link href="/compare-spectra">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Scale className="h-4 w-4 mr-2" />
                    Comparer des spectres
                  </Button>
                </Link>
                <Link href="/identify-spectrum">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Zap className="h-4 w-4 mr-2" />
                    Identifier un spectre
                  </Button>
                </Link>
                <Link href="/gcms-chromatograms">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Activity className="h-4 w-4 mr-2" />
                    Chromatogrammes GC-MS
                  </Button>
                </Link>
                <Link href="/search-compound">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Beaker className="h-4 w-4 mr-2" />
                    Recherche par composé
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
          
          {/* Contenu principal */}
          <div className="lg:col-span-3 space-y-6">
            {currentSpectrum ? (
              <>
                {/* Navigation */}
                <div className="flex items-center justify-between">
                  <Button
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={currentIndex === 0}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Précédent
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    {currentIndex + 1} / {spectra?.length}
                  </span>
                  <Button
                    variant="outline"
                    onClick={handleNext}
                    disabled={!spectra || currentIndex >= spectra?.length - 1}
                  >
                    Suivant
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
                
                {/* Informations du composé */}
                <Card>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-2xl flex items-center gap-3">
                          {currentSpectrum.compound_name}
                          <Badge variant="outline" className="font-mono">
                            {currentSpectrum.ionization_mode}
                          </Badge>
                        </CardTitle>
                        <CardDescription className="mt-1">
                          Source: {currentSpectrum.source}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      <div className="p-3 rounded-lg bg-muted/50">
                        <div className="text-xs text-muted-foreground mb-1">CAS Number</div>
                        <div className="font-mono font-semibold">{currentSpectrum.cas_number}</div>
                      </div>
                      <div className="p-3 rounded-lg bg-muted/50">
                        <div className="text-xs text-muted-foreground mb-1">Formule</div>
                        <div className="font-mono font-semibold">{currentSpectrum.molecular_formula}</div>
                      </div>
                      <div className="p-3 rounded-lg bg-muted/50">
                        <div className="text-xs text-muted-foreground mb-1">Masse moléculaire</div>
                        <div className="font-semibold">{currentSpectrum.molecular_weight} g/mol</div>
                      </div>
                      <div className="p-3 rounded-lg bg-green-500/10">
                        <div className="text-xs text-muted-foreground mb-1">Pic de base</div>
                        <div className="font-semibold text-green-400">m/z {currentSpectrum.base_peak_mz}</div>
                      </div>
                    </div>
                    
                    {/* Graphique du spectre */}
                    <div className="bg-black/30 rounded-lg p-4 mb-6">
                      <MsSpectrumChart spectrum={currentSpectrum} />
                    </div>
                    
                    {/* Pattern de fragmentation */}
                    <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/20">
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <Zap className="h-4 w-4 text-purple-400" />
                        Pattern de fragmentation
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {currentSpectrum.fragmentation_pattern}
                      </p>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Tableau des pics */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Activity className="h-5 w-5 text-blue-500" />
                      Pics du spectre
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b bg-muted/50">
                            <th className="text-left py-2 px-3 font-semibold">m/z</th>
                            <th className="text-right py-2 px-3 font-semibold">Intensité (%)</th>
                            <th className="text-left py-2 px-3 font-semibold">Type</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentSpectrum.spectrum_data.peaks
                            .sort((a, b) => b.intensity - a.intensity)
                            .map((peak, idx) => (
                              <tr key={idx} className="border-b border-border/50">
                                <td className="py-2 px-3 font-mono">{peak.mz}</td>
                                <td className="py-2 px-3 text-right">
                                  <div className="flex items-center justify-end gap-2">
                                    <div 
                                      className="h-2 bg-blue-500 rounded"
                                      style={{ width: `${peak.intensity}%`, maxWidth: '100px' }}
                                    />
                                    <span className="w-12 text-right">{peak.intensity}%</span>
                                  </div>
                                </td>
                                <td className="py-2 px-3">
                                  {peak.mz === currentSpectrum.base_peak_mz ? (
                                    <Badge className="bg-green-500/20 text-green-400">Pic de base</Badge>
                                  ) : peak.mz === currentSpectrum.molecular_weight ? (
                                    <Badge variant="outline">Ion moléculaire [M]+</Badge>
                                  ) : peak.intensity >= 50 ? (
                                    <Badge variant="secondary">Fragment majeur</Badge>
                                  ) : (
                                    <span className="text-muted-foreground text-sm">Fragment</span>
                                  )}
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="bg-muted/50">
                <CardContent className="py-12 text-center">
                  <Atom className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                  <h3 className="text-lg font-semibold mb-2">Sélectionnez un composé</h3>
                  <p className="text-muted-foreground">
                    Choisissez un composé dans la liste pour visualiser son spectre de masse.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
