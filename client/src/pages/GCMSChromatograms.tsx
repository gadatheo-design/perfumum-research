// @ts-nocheck
import { useState, useEffect, useRef } from 'react';
import { trpc } from '@/lib/trpc';
import MSSpectrumPopup from '@/components/MSSpectrumPopup';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Activity, Beaker, Info, Download, Maximize2 } from 'lucide-react';
import { Link } from 'wouter';
import * as d3 from 'd3';

// Composant de visualisation du chromatogramme D3.js
function ChromatogramChart({ peaks, landraceName }: { peaks: any[]; landraceName: string }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hoveredPeak, setHoveredPeak] = useState<any>(null);
  const [selectedPeakForMS, setSelectedPeakForMS] = useState<any>(null);
  
  useEffect(() => {
    if (!svgRef.current || peaks?.length === 0) return;
    
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();
    
    const margin = { top: 30, right: 30, bottom: 60, left: 70 };
    const width = 800 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;
    
    const g = svg
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);
    
    // Échelles
    const xScale = d3.scaleLinear()
      .domain([0, d3.max(peaks, (d: any) => d.retention_time) as number + 2])
      .range([0, width]);
    
    const yScale = d3.scaleLinear()
      .domain([0, d3.max(peaks, (d: any) => d.peak_area) as number * 1.1])
      .range([height, 0]);
    
    // Grille
    g.append('g')
      .attr('class', 'grid')
      .attr('transform', `translate(0, ${height})`)
      .call(d3.axisBottom(xScale).tickSize(-height).tickFormat(() => ''))
      .selectAll('line')
      .attr('stroke', 'hsl(var(--border))')
      .attr('stroke-opacity', 0.3);
    
    g.append('g')
      .attr('class', 'grid')
      .call(d3.axisLeft(yScale).tickSize(-width).tickFormat(() => ''))
      .selectAll('line')
      .attr('stroke', 'hsl(var(--border))')
      .attr('stroke-opacity', 0.3);
    
    // Ligne de base
    g.append('line')
      .attr('x1', 0)
      .attr('y1', height)
      .attr('x2', width)
      .attr('y2', height)
      .attr('stroke', 'hsl(var(--muted-foreground))')
      .attr('stroke-width', 1);
    
    // Générer les pics gaussiens
    const generateGaussian = (center: number, height: number, sigma: number = 0.3) => {
      const points = [];
      for (let x = center - 1.5; x <= center + 1.5; x += 0.05) {
        const y = height * Math.exp(-Math.pow(x - center, 2) / (2 * sigma * sigma));
        points.push({ x, y });
      }
      return points;
    };
    
    // Dessiner les pics
    peaks?.forEach((peak: any, idx: number) => {
      const gaussianPoints = generateGaussian(
        peak.retention_time, 
        peak.peak_area,
        0.2 + (peak.peak_area / 1000000) * 0.3
      );
      
      const area = d3.area<{x: number, y: number}>()
        .x(d => xScale(d.x))
        .y0(height)
        .y1(d => yScale(d.y))
        .curve(d3.curveBasis);
      
      const line = d3.line<{x: number, y: number}>()
        .x(d => xScale(d.x))
        .y(d => yScale(d.y))
        .curve(d3.curveBasis);
      
      // Zone remplie
      g.append('path')
        .datum(gaussianPoints)
        .attr('d', area)
        .attr('fill', `hsl(${(idx * 30) % 360}, 70%, 50%)`)
        .attr('fill-opacity', 0.3);
      
      // Ligne du pic
      g.append('path')
        .datum(gaussianPoints)
        .attr('d', line)
        .attr('fill', 'none')
        .attr('stroke', `hsl(${(idx * 30) % 360}, 70%, 50%)`)
        .attr('stroke-width', 2);
      
      // Point interactif au sommet
      g.append('circle')
        .attr('cx', xScale(peak.retention_time))
        .attr('cy', yScale(peak.peak_area))
        .attr('r', 5)
        .attr('fill', `hsl(${(idx * 30) % 360}, 70%, 50%)`)
        .attr('cursor', 'pointer')
        .on('mouseenter', () => setHoveredPeak(peak))
        .on('mouseleave', () => setHoveredPeak(null))
        .on('click', () => setSelectedPeakForMS(peak));
      
      // Label du composé
      if (peak.peak_area > 200000) {
        g.append('text')
          .attr('x', xScale(peak.retention_time))
          .attr('y', yScale(peak.peak_area) - 15)
          .attr('text-anchor', 'middle')
          .attr('fill', 'hsl(var(--foreground))')
          .attr('font-size', '10px')
          .text(peak.compound_name.length > 12 ? peak.compound_name.substring(0, 12) + '...' : peak.compound_name);
      }
    });
    
    // Axes
    g.append('g')
      .attr('transform', `translate(0, ${height})`)
      .call(d3.axisBottom(xScale))
      .selectAll('text')
      .attr('fill', 'hsl(var(--foreground))');
    
    g.append('g')
      .call(d3.axisLeft(yScale).tickFormat(d => d3.format('.2s')(d as number)))
      .selectAll('text')
      .attr('fill', 'hsl(var(--foreground))');
    
    // Labels des axes
    g.append('text')
      .attr('x', width / 2)
      .attr('y', height + 45)
      .attr('text-anchor', 'middle')
      .attr('fill', 'hsl(var(--foreground))')
      .attr('font-size', '12px')
      .text('Temps de rétention (min)');
    
    g.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -height / 2)
      .attr('y', -50)
      .attr('text-anchor', 'middle')
      .attr('fill', 'hsl(var(--foreground))')
      .attr('font-size', '12px')
      .text('Aire du pic (unités arbitraires)');
    
    // Titre
    g.append('text')
      .attr('x', width / 2)
      .attr('y', -10)
      .attr('text-anchor', 'middle')
      .attr('fill', 'hsl(var(--foreground))')
      .attr('font-size', '14px')
      .attr('font-weight', 'bold')
      .text(`Chromatogramme GC-MS — ${landraceName}`);
    
  }, [peaks, landraceName]);
  
  return (
    <div className="relative">
      <svg ref={svgRef} className="w-full" />
      
      {/* Tooltip */}
      {hoveredPeak && (
        <div className="absolute top-4 right-4 bg-card border rounded-lg p-4 shadow-lg max-w-xs">
          <h4 className="font-semibold text-sm mb-2">{hoveredPeak.compound_name}</h4>
          <div className="space-y-1 text-xs text-muted-foreground">
            <p><span className="font-medium">CAS:</span> {hoveredPeak.cas_number}</p>
            <p><span className="font-medium">Temps de rétention:</span> {hoveredPeak.retention_time} min</p>
            <p><span className="font-medium">Concentration:</span> {hoveredPeak.concentration_ppm} ppm</p>
            <p><span className="font-medium">Qualité match:</span> {hoveredPeak.match_quality}%</p>
          </div>
          <p className="text-xs text-primary mt-2 font-medium">Cliquez pour voir le spectre MS</p>
        </div>
      )}
      
      {/* Popup du spectre MS */}
      <MSSpectrumPopup
        compoundName={selectedPeakForMS?.compound_name}
        casNumber={selectedPeakForMS?.cas_number}
        onClose={() => setSelectedPeakForMS(null)}
      />
    </div>
  );
}

export default function GCMSChromatograms() {
  const [selectedLandrace, setSelectedLandrace] = useState<string>('');
  
  // Récupérer les chromatogrammes via SQL direct (à remplacer par tRPC)
  const { data: chromatograms, isLoading } = trpc.tobacco.getChromatograms.useQuery();
  const { data: peaks } = trpc.tobacco.getChromatogramPeaks.useQuery(
    { landraceName: selectedLandrace },
    { enabled: !!selectedLandrace }
  );
  
  const selectedChromatogram = chromatograms?.find((c: any) => c.landrace_name === selectedLandrace);
  
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-900/20 via-blue-900/20 to-purple-900/20 border-b">
        <div className="container py-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20">
              <Activity className="h-8 w-8 text-cyan-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Chromatogrammes GC-MS</h1>
              <p className="text-muted-foreground">
                Analyse chromatographique des profils terpéniques des landraces
              </p>
            </div>
          </div>
          
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-primary">Accueil</Link>
            <span>/</span>
            <Link href="/tobacco-landraces" className="hover:text-primary">Landraces</Link>
            <span>/</span>
            <span className="text-foreground">Chromatogrammes GC-MS</span>
          </div>
        </div>
      </div>
      
      <div className="container py-8 space-y-8">
        {/* Sélecteur de landrace */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Beaker className="h-5 w-5 text-cyan-500" />
              Sélection de l'échantillon
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : (
              <div className="flex flex-wrap gap-4 items-center">
                <Select value={selectedLandrace} onValueChange={setSelectedLandrace}>
                  <SelectTrigger className="w-64">
                    <SelectValue placeholder="Choisir une landrace" />
                  </SelectTrigger>
                  <SelectContent>
                    {chromatograms?.map((c: any) => (
                      <SelectItem key={c.id} value={c.landrace_name}>
                        {c.landrace_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                {selectedChromatogram && (
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>Analysé le: {new Date(selectedChromatogram.analysis_date).toLocaleDateString('fr-FR')}</span>
                    <Badge variant="outline">{selectedChromatogram.identified_peaks}/{selectedChromatogram.total_peaks} pics identifiés</Badge>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Chromatogramme */}
        {selectedLandrace && peaks && peaks?.length > 0 && (
          <>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-blue-500" />
                    Chromatogramme
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Exporter
                    </Button>
                    <Button variant="outline" size="sm">
                      <Maximize2 className="h-4 w-4 mr-2" />
                      Plein écran
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ChromatogramChart peaks={peaks} landraceName={selectedLandrace} />
              </CardContent>
            </Card>
            
            {/* Paramètres d'analyse */}
            {selectedChromatogram && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Info className="h-5 w-5 text-purple-500" />
                    Paramètres d'analyse
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="p-4 rounded-lg bg-muted/50">
                      <p className="text-sm text-muted-foreground mb-1">Instrument</p>
                      <p className="font-medium">{selectedChromatogram.instrument}</p>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/50">
                      <p className="text-sm text-muted-foreground mb-1">Colonne</p>
                      <p className="font-medium">{selectedChromatogram.column_type}</p>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/50">
                      <p className="text-sm text-muted-foreground mb-1">Gaz vecteur</p>
                      <p className="font-medium">{selectedChromatogram.carrier_gas} ({selectedChromatogram.flow_rate} mL/min)</p>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/50">
                      <p className="text-sm text-muted-foreground mb-1">Volume d'injection</p>
                      <p className="font-medium">{selectedChromatogram.injection_volume} µL</p>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/50">
                      <p className="text-sm text-muted-foreground mb-1">Ratio de split</p>
                      <p className="font-medium">{selectedChromatogram.split_ratio}</p>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/50">
                      <p className="text-sm text-muted-foreground mb-1">Programme four</p>
                      <p className="font-medium">{selectedChromatogram.oven_program}</p>
                    </div>
                  </div>
                  
                  {selectedChromatogram.notes && (
                    <div className="mt-4 p-4 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                      <p className="text-sm text-cyan-400">{selectedChromatogram.notes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
            
            {/* Tableau des pics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Beaker className="h-5 w-5 text-green-500" />
                  Composés identifiés
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-semibold">Composé</th>
                        <th className="text-left py-3 px-4 font-semibold">CAS</th>
                        <th className="text-right py-3 px-4 font-semibold">RT (min)</th>
                        <th className="text-right py-3 px-4 font-semibold">Concentration</th>
                        <th className="text-right py-3 px-4 font-semibold">Match</th>
                      </tr>
                    </thead>
                    <tbody>
                      {peaks?.sort((a: any, b: any) => b.concentration_ppm - a.concentration_ppm).map((peak: any, idx: number) => (
                        <tr key={idx} className="border-b border-border/50 hover:bg-muted/50">
                          <td className="py-3 px-4 font-medium">{peak.compound_name}</td>
                          <td className="py-3 px-4 text-muted-foreground font-mono text-sm">{peak.cas_number}</td>
                          <td className="py-3 px-4 text-right">{peak.retention_time}</td>
                          <td className="py-3 px-4 text-right">
                            <Badge variant="outline">{peak.concentration_ppm} ppm</Badge>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <Badge 
                              variant={peak.match_quality >= 90 ? 'default' : 'secondary'}
                              className={peak.match_quality >= 90 ? 'bg-green-500/20 text-green-400' : ''}
                            >
                              {peak.match_quality}%
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </>
        )}
        
        {!selectedLandrace && (
          <Card className="bg-muted/50">
            <CardContent className="py-12 text-center">
              <Activity className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
              <h3 className="text-lg font-semibold mb-2">Aucun échantillon sélectionné</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Sélectionnez une landrace ci-dessus pour visualiser son chromatogramme GC-MS 
                et la liste des composés identifiés.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
