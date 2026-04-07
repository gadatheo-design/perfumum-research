// @ts-nocheck
import { useState, useEffect, useRef, useMemo } from 'react';
import { trpc } from '@/lib/trpc';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Loader2, Zap, Search, X, Plus, Layers, BarChart3, Info, Download } from 'lucide-react';
import { Link } from 'wouter';
import * as d3 from 'd3';

// Couleurs distinctes pour les spectres superposés
const SPECTRUM_COLORS = [
  { main: 'hsl(220, 70%, 50%)', light: 'hsl(220, 70%, 70%)' },  // Bleu
  { main: 'hsl(340, 70%, 50%)', light: 'hsl(340, 70%, 70%)' },  // Rose
  { main: 'hsl(160, 70%, 40%)', light: 'hsl(160, 70%, 60%)' },  // Vert
];

interface SelectedSpectrum {
  id: number;
  compound_name: string;
  cas_number: string;
  molecular_formula: string;
  molecular_weight: string;
  base_peak_mz: string;
  spectrum_data: { peaks: { mz: number; intensity: number }[] };
}

// Composant de visualisation des spectres superposés
function OverlaySpectraChart({ spectra }: { spectra: SelectedSpectrum[] }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hoveredPeak, setHoveredPeak] = useState<{ mz: number; intensity: number; compound: string; color: string } | null>(null);
  
  useEffect(() => {
    if (!svgRef.current || spectra.length === 0) return;
    
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
    
    // Trouver le m/z max parmi tous les spectres
    const allPeaks = spectra.flatMap(s => s.spectrum_data?.peaks || []);
    const maxMz = Math.max(...allPeaks.map(p => p.mz)) + 30;
    
    // Échelles
    const xScale = d3.scaleLinear()
      .domain([0, maxMz])
      .range([0, width]);
    
    const yScale = d3.scaleLinear()
      .domain([0, 110])
      .range([height, 0]);
    
    // Grille
    g.append('g')
      .attr('class', 'grid')
      .call(d3.axisLeft(yScale).tickSize(-width).tickFormat(() => ''))
      .selectAll('line')
      .attr('stroke', 'hsl(var(--border))')
      .attr('stroke-opacity', 0.2);
    
    g.append('g')
      .attr('class', 'grid')
      .attr('transform', `translate(0, ${height})`)
      .call(d3.axisBottom(xScale).tickSize(-height).tickFormat(() => ''))
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
    
    // Dessiner les spectres avec décalage pour visibilité
    spectra.forEach((spectrum, spectrumIdx) => {
      const color = SPECTRUM_COLORS[spectrumIdx % SPECTRUM_COLORS.length];
      const peaks = spectrum.spectrum_data?.peaks || [];
      const basePeakMz = parseFloat(spectrum.base_peak_mz);
      
      // Décalage horizontal léger pour distinguer les pics proches
      const offset = spectrumIdx * 1.5;
      
      peaks.forEach((peak) => {
        const isBasePeak = peak.mz === basePeakMz || peak.intensity === 100;
        
        // Barre du pic
        g.append('line')
          .attr('x1', xScale(peak.mz + offset))
          .attr('y1', height)
          .attr('x2', xScale(peak.mz + offset))
          .attr('y2', yScale(peak.intensity))
          .attr('stroke', color.main)
          .attr('stroke-width', isBasePeak ? 3 : 2)
          .attr('stroke-opacity', 0.8)
          .attr('cursor', 'pointer')
          .on('mouseenter', function() {
            setHoveredPeak({ ...peak, compound: spectrum.compound_name, color: color.main });
            d3.select(this).attr('stroke-width', isBasePeak ? 5 : 4);
          })
          .on('mouseleave', function() {
            setHoveredPeak(null);
            d3.select(this).attr('stroke-width', isBasePeak ? 3 : 2);
          });
        
        // Label m/z pour les pics importants (seulement pour le premier spectre pour éviter l'encombrement)
        if (spectrumIdx === 0 && (peak.intensity >= 60 || isBasePeak)) {
          g.append('text')
            .attr('x', xScale(peak.mz + offset))
            .attr('y', yScale(peak.intensity) - 5)
            .attr('text-anchor', 'middle')
            .attr('fill', color.main)
            .attr('font-size', '9px')
            .attr('font-weight', isBasePeak ? 'bold' : 'normal')
            .text(peak.mz);
        }
      });
    });
    
    // Axes
    g.append('g')
      .attr('transform', `translate(0, ${height})`)
      .call(d3.axisBottom(xScale).ticks(15))
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
      .attr('y', height + 45)
      .attr('text-anchor', 'middle')
      .attr('fill', 'hsl(var(--foreground))')
      .attr('font-size', '12px')
      .text('m/z');
    
    g.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -height / 2)
      .attr('y', -55)
      .attr('text-anchor', 'middle')
      .attr('fill', 'hsl(var(--foreground))')
      .attr('font-size', '12px')
      .text('Intensité relative (%)');
    
    // Titre
    g.append('text')
      .attr('x', width / 2)
      .attr('y', -10)
      .attr('text-anchor', 'middle')
      .attr('fill', 'hsl(var(--foreground))')
      .attr('font-size', '14px')
      .attr('font-weight', 'bold')
      .text('Comparaison des spectres de masse');
    
  }, [spectra]);
  
  return (
    <div className="relative">
      <svg ref={svgRef} className="w-full" />
      
      {/* Tooltip */}
      {hoveredPeak && (
        <div className="absolute top-4 right-4 bg-popover border rounded-lg p-3 shadow-lg text-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: hoveredPeak.color }} />
            <span className="font-semibold">{hoveredPeak.compound}</span>
          </div>
          <p><span className="text-muted-foreground">m/z:</span> {hoveredPeak.mz}</p>
          <p><span className="text-muted-foreground">Intensité:</span> {hoveredPeak.intensity}%</p>
        </div>
      )}
    </div>
  );
}

// Calcul de similarité spectrale (cosinus)
function calculateSimilarity(spectrum1: SelectedSpectrum, spectrum2: SelectedSpectrum): number {
  const peaks1 = spectrum1.spectrum_data?.peaks || [];
  const peaks2 = spectrum2.spectrum_data?.peaks || [];
  
  // Créer des vecteurs d'intensité alignés sur m/z
  const allMz = new Set([...peaks1.map(p => p.mz), ...peaks2.map(p => p.mz)]);
  
  const vec1: number[] = [];
  const vec2: number[] = [];
  
  allMz.forEach(mz => {
    const p1 = peaks1.find(p => p.mz === mz);
    const p2 = peaks2.find(p => p.mz === mz);
    vec1.push(p1?.intensity || 0);
    vec2.push(p2?.intensity || 0);
  });
  
  // Similarité cosinus
  const dotProduct = vec1.reduce((sum, v, i) => sum + v * vec2[i], 0);
  const norm1 = Math.sqrt(vec1.reduce((sum, v) => sum + v * v, 0));
  const norm2 = Math.sqrt(vec2.reduce((sum, v) => sum + v * v, 0));
  
  if (norm1 === 0 || norm2 === 0) return 0;
  
  return (dotProduct / (norm1 * norm2)) * 100;
}

export default function SpectraComparison() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpectra, setSelectedSpectra] = useState<SelectedSpectrum[]>([]);
  
  // Récupérer tous les spectres disponibles
  const { data: allSpectra, isLoading } = trpc.tobacco.getMsSpectra.useQuery();
  
  // Filtrer les spectres selon la recherche
  const filteredSpectra = useMemo(() => {
    if (!allSpectra || !searchQuery) return [];
    const query = searchQuery.toLowerCase();
    return allSpectra.filter((s: any) => 
      s.compound_name.toLowerCase().includes(query) ||
      s.cas_number?.includes(query) ||
      s.molecular_formula?.toLowerCase().includes(query)
    ).slice(0, 10);
  }, [allSpectra, searchQuery]);
  
  // Ajouter un spectre à la comparaison
  const addSpectrum = (spectrum: any) => {
    if (selectedSpectra.length >= 3) {
      alert('Maximum 3 spectres pour la comparaison');
      return;
    }
    if (selectedSpectra.find(s => s.id === spectrum.id)) {
      return; // Déjà sélectionné
    }
    setSelectedSpectra([...selectedSpectra, spectrum]);
    setSearchQuery('');
  };
  
  // Retirer un spectre
  const removeSpectrum = (id: number) => {
    setSelectedSpectra(selectedSpectra.filter(s => s.id !== id));
  };
  
  // Calculer les similarités
  const similarities = useMemo(() => {
    if (selectedSpectra.length < 2) return [];
    
    const results: { pair: string; similarity: number }[] = [];
    for (let i = 0; i < selectedSpectra.length; i++) {
      for (let j = i + 1; j < selectedSpectra.length; j++) {
        results.push({
          pair: `${selectedSpectra[i].compound_name} ↔ ${selectedSpectra[j].compound_name}`,
          similarity: calculateSimilarity(selectedSpectra[i], selectedSpectra[j])
        });
      }
    }
    return results;
  }, [selectedSpectra]);
  
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900/20 via-pink-900/20 to-cyan-900/20 border-b">
        <div className="container py-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20">
              <Layers className="h-8 w-8 text-purple-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Comparaison de spectres MS</h1>
              <p className="text-muted-foreground">
                Superposez jusqu'à 3 spectres pour identifier des composés inconnus
              </p>
            </div>
          </div>
          
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-primary">Accueil</Link>
            <span>/</span>
            <Link href="/ms-spectra" className="hover:text-primary">Spectres MS</Link>
            <span>/</span>
            <span className="text-foreground">Comparaison</span>
          </div>
        </div>
      </div>
      
      <div className="container py-8 space-y-8">
        {/* Sélection des spectres */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5 text-purple-500" />
              Sélectionner les spectres à comparer
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Barre de recherche */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un composé (nom, CAS, formule)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
              
              {/* Résultats de recherche */}
              {filteredSpectra.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-popover border rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {filteredSpectra.map((spectrum: any) => (
                    <button
                      key={spectrum.id}
                      onClick={() => addSpectrum(spectrum)}
                      className="w-full px-4 py-3 text-left hover:bg-muted/50 flex items-center justify-between border-b last:border-0"
                    >
                      <div>
                        <p className="font-medium">{spectrum.compound_name}</p>
                        <p className="text-sm text-muted-foreground">
                          {spectrum.molecular_formula} • CAS: {spectrum.cas_number}
                        </p>
                      </div>
                      <Plus className="h-4 w-4 text-primary" />
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {/* Spectres sélectionnés */}
            <div className="flex flex-wrap gap-3">
              {selectedSpectra.map((spectrum, idx) => (
                <div
                  key={spectrum.id}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg border"
                  style={{ borderColor: SPECTRUM_COLORS[idx % SPECTRUM_COLORS.length].main }}
                >
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: SPECTRUM_COLORS[idx % SPECTRUM_COLORS.length].main }}
                  />
                  <span className="font-medium">{spectrum.compound_name}</span>
                  <span className="text-sm text-muted-foreground">({spectrum.molecular_formula})</span>
                  <button
                    onClick={() => removeSpectrum(spectrum.id)}
                    className="ml-2 p-1 hover:bg-muted rounded"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
              
              {selectedSpectra.length === 0 && (
                <p className="text-muted-foreground text-sm">
                  Aucun spectre sélectionné. Utilisez la recherche ci-dessus pour ajouter des spectres.
                </p>
              )}
            </div>
            
            {/* Compteur */}
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                {selectedSpectra.length}/3 spectres sélectionnés
              </span>
              {selectedSpectra.length > 0 && (
                <Button variant="outline" size="sm" onClick={() => setSelectedSpectra([])}>
                  Tout effacer
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
        
        {/* Graphique de comparaison */}
        {selectedSpectra.length > 0 && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-cyan-500" />
                  Spectres superposés
                </CardTitle>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Exporter
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <OverlaySpectraChart spectra={selectedSpectra} />
              
              {/* Légende */}
              <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t">
                {selectedSpectra.map((spectrum, idx) => safeToFixed(
                  <div key={spectrum.id} className="flex items-center gap-2">
                    <div 
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: SPECTRUM_COLORS[idx % SPECTRUM_COLORS.length].main }}
                    />
                    <span className="text-sm">
                      {spectrum.compound_name} (M+ {parseFloat(spectrum.molecular_weight, 0)})
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* Similarités */}
        {similarities.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-500" />
                Indice de similarité spectrale
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {similarities.map((sim, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <span className="font-medium">{sim.pair}</span>
                    <div className="flex items-center gap-3">
                      <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all"
                          style={{ 
                            width: `${sim.similarity}%`,
                            backgroundColor: sim.similarity > 80 ? 'hsl(142, 76%, 36%)' : 
                                           sim.similarity > 50 ? 'hsl(45, 93%, 47%)' : 
                                           'hsl(0, 84%, 60%)'
                          }}
                        />
                      </div>
                      <Badge 
                        variant={sim.similarity > 80 ? 'default' : 'secondary'}
                        className={sim.similarity > 80 ? 'bg-green-500/20 text-green-400' : ''}
                      >
                        {safeToFixed(sim, 1)}%
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                <div className="flex items-start gap-2">
                  <Info className="h-4 w-4 text-yellow-500 mt-0.5" />
                  <div className="text-sm text-muted-foreground">
                    <p className="font-medium text-yellow-400 mb-1">Interprétation</p>
                    <p>
                      <strong>&gt;80%</strong>: Composés très similaires ou isomères<br/>
                      <strong>50-80%</strong>: Même famille chimique probable<br/>
                      <strong>&lt;50%</strong>: Composés différents
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* Tableau comparatif */}
        {selectedSpectra.length > 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5 text-blue-500" />
                Tableau comparatif
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-semibold">Propriété</th>
                      {selectedSpectra.map((spectrum, idx) => (
                        <th key={spectrum.id} className="text-left py-3 px-4 font-semibold">
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: SPECTRUM_COLORS[idx % SPECTRUM_COLORS.length].main }}
                            />
                            {spectrum.compound_name}
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-border/50">
                      <td className="py-3 px-4 text-muted-foreground">Formule</td>
                      {selectedSpectra.map(s => (
                        <td key={s.id} className="py-3 px-4 font-mono">{s.molecular_formula}</td>
                      ))}
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 px-4 text-muted-foreground">Masse moléculaire</td>
                      {selectedSpectra.mapsafeToFixed(s => (
                        <td key={s.id} className="py-3 px-4">{parseFloat(s.molecular_weight, 2)} Da</td>
                      ))}
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 px-4 text-muted-foreground">Pic de base (m/z)</td>
                      {selectedSpectra.mapsafeToFixed(s => (
                        <td key={s.id} className="py-3 px-4 text-green-500 font-semibold">
                          {parseFloat(s.base_peak_mz, 0)}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 px-4 text-muted-foreground">CAS</td>
                      {selectedSpectra.map(s => (
                        <td key={s.id} className="py-3 px-4 font-mono text-sm">{s.cas_number}</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-3 px-4 text-muted-foreground">Nombre de pics</td>
                      {selectedSpectra.map(s => (
                        <td key={s.id} className="py-3 px-4">{s.spectrum_data?.peaks?.length || 0}</td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* État vide */}
        {selectedSpectra.length === 0 && (
          <Card className="bg-muted/50">
            <CardContent className="py-12 text-center">
              <Layers className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
              <h3 className="text-lg font-semibold mb-2">Aucun spectre sélectionné</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Utilisez la barre de recherche ci-dessus pour sélectionner jusqu'à 3 spectres 
                et les comparer visuellement.
              </p>
            </CardContent>
          </Card>
        )}
        
        {/* Info sur les spectres disponibles */}
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Chargement des spectres...
                  </span>
                ) : (
                  `${allSpectra?.length || 0} spectres disponibles dans la base de données`
                )}
              </span>
              <Link href="/ms-spectra" className="text-primary hover:underline">
                Voir tous les spectres →
              </Link>
            </div>
          </CardContent>
        </Card>
        
        {/* Outils connexes */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Outils connexes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Link href="/identify-spectrum">
                <Button variant="outline" className="w-full justify-start">
                  <Zap className="h-4 w-4 mr-2" />
                  Identifier un spectre inconnu
                </Button>
              </Link>
              <Link href="/gcms-chromatograms">
                <Button variant="outline" className="w-full justify-start">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Chromatogrammes GC-MS
                </Button>
              </Link>
              <Link href="/search-compound">
                <Button variant="outline" className="w-full justify-start">
                  <Search className="h-4 w-4 mr-2" />
                  Recherche par composé
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
