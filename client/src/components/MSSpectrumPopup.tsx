import { useState, useEffect, useRef } from 'react';
import { trpc } from '@/lib/trpc';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, X, Zap, Atom, Download, ExternalLink } from 'lucide-react';
import { Link } from 'wouter';
import * as d3 from 'd3';

interface MSSpectrumPopupProps {
  compoundName: string | null;
  casNumber?: string;
  onClose: () => void;
}

// Composant de visualisation du spectre MS avec D3.js
function MSSpectrumChart({ spectrumData, compoundName, basePeakMz }: { 
  spectrumData: { peaks: { mz: number; intensity: number }[] }; 
  compoundName: string;
  basePeakMz: number;
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hoveredPeak, setHoveredPeak] = useState<{ mz: number; intensity: number } | null>(null);
  
  useEffect(() => {
    if (!svgRef.current || !spectrumData?.peaks?.length) return;
    
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();
    
    const margin = { top: 20, right: 30, bottom: 50, left: 60 };
    const width = 500 - margin.left - margin.right;
    const height = 280 - margin.top - margin.bottom;
    
    const g = svg
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);
    
    const peaks = spectrumData.peaks;
    
    // Échelles
    const xScale = d3.scaleLinear()
      .domain([0, Math.max(...peaks.map(p => p.mz)) + 20])
      .range([0, width]);
    
    const yScale = d3.scaleLinear()
      .domain([0, 110])
      .range([height, 0]);
    
    // Grille horizontale
    g.append('g')
      .attr('class', 'grid')
      .call(d3.axisLeft(yScale).tickSize(-width).tickFormat(() => ''))
      .selectAll('line')
      .attr('stroke', 'hsl(var(--border))')
      .attr('stroke-opacity', 0.2);
    
    // Ligne de base
    g.append('line')
      .attr('x1', 0)
      .attr('y1', height)
      .attr('x2', width)
      .attr('y2', height)
      .attr('stroke', 'hsl(var(--muted-foreground))')
      .attr('stroke-width', 1);
    
    // Dessiner les pics (barres verticales)
    peaks.forEach((peak) => {
      const isBasePeak = peak.mz === basePeakMz || peak.intensity === 100;
      
      // Barre du pic
      g.append('line')
        .attr('x1', xScale(peak.mz))
        .attr('y1', height)
        .attr('x2', xScale(peak.mz))
        .attr('y2', yScale(peak.intensity))
        .attr('stroke', isBasePeak ? 'hsl(142, 76%, 36%)' : 'hsl(var(--primary))')
        .attr('stroke-width', isBasePeak ? 3 : 2)
        .attr('cursor', 'pointer')
        .on('mouseenter', function() {
          setHoveredPeak(peak);
          d3.select(this).attr('stroke-width', isBasePeak ? 5 : 4);
        })
        .on('mouseleave', function() {
          setHoveredPeak(null);
          d3.select(this).attr('stroke-width', isBasePeak ? 3 : 2);
        });
      
      // Label m/z pour les pics importants
      if (peak.intensity >= 40 || isBasePeak) {
        g.append('text')
          .attr('x', xScale(peak.mz))
          .attr('y', yScale(peak.intensity) - 5)
          .attr('text-anchor', 'middle')
          .attr('fill', isBasePeak ? 'hsl(142, 76%, 36%)' : 'hsl(var(--foreground))')
          .attr('font-size', '9px')
          .attr('font-weight', isBasePeak ? 'bold' : 'normal')
          .text(peak.mz);
      }
    });
    
    // Axes
    g.append('g')
      .attr('transform', `translate(0, ${height})`)
      .call(d3.axisBottom(xScale).ticks(10))
      .selectAll('text')
      .attr('fill', 'hsl(var(--foreground))')
      .attr('font-size', '10px');
    
    g.append('g')
      .call(d3.axisLeft(yScale).ticks(5))
      .selectAll('text')
      .attr('fill', 'hsl(var(--foreground))')
      .attr('font-size', '10px');
    
    // Labels des axes
    g.append('text')
      .attr('x', width / 2)
      .attr('y', height + 40)
      .attr('text-anchor', 'middle')
      .attr('fill', 'hsl(var(--foreground))')
      .attr('font-size', '11px')
      .text('m/z');
    
    g.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -height / 2)
      .attr('y', -45)
      .attr('text-anchor', 'middle')
      .attr('fill', 'hsl(var(--foreground))')
      .attr('font-size', '11px')
      .text('Intensité relative (%)');
    
  }, [spectrumData, compoundName, basePeakMz]);
  
  return (
    <div className="relative">
      <svg ref={svgRef} className="w-full" />
      
      {/* Tooltip */}
      {hoveredPeak && (
        <div className="absolute top-2 right-2 bg-popover border rounded-lg p-2 shadow-lg text-xs">
          <p><span className="font-semibold">m/z:</span> {hoveredPeak.mz}</p>
          <p><span className="font-semibold">Intensité:</span> {hoveredPeak.intensity}%</p>
        </div>
      )}
    </div>
  );
}

export default function MSSpectrumPopup({ compoundName, casNumber, onClose }: MSSpectrumPopupProps) {
  const { data: spectrumRaw, isLoading, error } = trpc.tobacco.getMsSpectrumByCompound.useQuery(
    { compoundName: compoundName || '' },
    { enabled: !!compoundName }
  );
  const spectrum = spectrumRaw as any;
  
  if (!compoundName) return null;
  
  return (
    <Dialog open={!!compoundName} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-cyan-500" />
            Spectre de masse — {compoundName}
          </DialogTitle>
        </DialogHeader>
        
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}
        
        {error && (
          <div className="text-center py-8">
            <Atom className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
            <p className="text-muted-foreground">Spectre MS non disponible pour ce composé</p>
            <p className="text-sm text-muted-foreground/70 mt-2">
              CAS: {casNumber || 'Non spécifié'}
            </p>
          </div>
        )}
        
        {spectrum && (
          <div className="space-y-4">
            {/* Informations du composé */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-xs text-muted-foreground mb-1">Formule</p>
                <p className="font-mono font-semibold">{spectrum.molecular_formula}</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-xs text-muted-foreground mb-1">Masse moléculaire</p>
                <p className="font-semibold">{parseFloat(spectrum.molecular_weight).toFixed(2)} Da</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-xs text-muted-foreground mb-1">Pic de base</p>
                <p className="font-semibold text-green-500">m/z {parseFloat(spectrum.base_peak_mz).toFixed(0)}</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-xs text-muted-foreground mb-1">CAS</p>
                <p className="font-mono text-sm">{spectrum.cas_number}</p>
              </div>
            </div>
            
            {/* Graphique du spectre */}
            <div className="border rounded-lg p-4 bg-card">
              <MSSpectrumChart 
                spectrumData={spectrum.spectrum_data} 
                compoundName={spectrum.compound_name}
                basePeakMz={parseFloat(spectrum.base_peak_mz)}
              />
            </div>
            
            {/* Pattern de fragmentation */}
            {spectrum.fragmentation_pattern && (
              <div className="p-4 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                <p className="text-sm font-medium text-cyan-400 mb-1">Pattern de fragmentation</p>
                <p className="text-sm text-muted-foreground">{spectrum.fragmentation_pattern}</p>
              </div>
            )}
            
            {/* Actions */}
            <div className="flex items-center justify-between pt-2">
              <Badge variant="outline" className="text-xs">
                Source: {spectrum.source}
              </Badge>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/ms-spectra?compound=${encodeURIComponent(spectrum.compound_name)}`}>
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Voir détails
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
