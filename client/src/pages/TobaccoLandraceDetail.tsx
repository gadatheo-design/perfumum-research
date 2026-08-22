// @ts-nocheck
import { useState, useEffect, useRef } from 'react';
import { useRoute, Link } from 'wouter';
import { trpc } from '@/lib/trpc';
import MSSpectrumPopup from '@/components/MSSpectrumPopup';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Leaf, MapPin, Beaker, Star, AlertTriangle, Sparkles, 
  Activity, ArrowLeft, Globe, Thermometer, Droplets,
  FlaskConical, Microscope, ChevronRight, Zap, Layers
} from 'lucide-react';
import * as d3 from 'd3';
import { TabErrorBoundary } from "@/components/TabErrorBoundary";

// Composant de visualisation du chromatogramme D3.js
function ChromatogramChart({ peaks, landraceName }: { peaks: any[]; landraceName: string }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hoveredPeak, setHoveredPeak] = useState<any>(null);
  
  useEffect(() => {
    if (!svgRef.current || peaks?.length === 0) return;
    
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();
    
    const margin = { top: 30, right: 30, bottom: 60, left: 70 };
    const width = 700 - margin.left - margin.right;
    const height = 350 - margin.top - margin.bottom;
    
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
    
    // Générer les pics gaussiens
    const generateGaussian = (center: number, peakHeight: number, sigma: number = 0.3) => {
      const points = [];
      for (let x = center - 1.5; x <= center + 1.5; x += 0.05) {
        const y = peakHeight * Math.exp(-Math.pow(x - center, 2) / (2 * sigma * sigma));
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
        .on('mouseleave', () => setHoveredPeak(null));
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
      .attr('font-size', '11px')
      .text('Temps de rétention (min)');
    
    g.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -height / 2)
      .attr('y', -50)
      .attr('text-anchor', 'middle')
      .attr('fill', 'hsl(var(--foreground))')
      .attr('font-size', '11px')
      .text('Aire du pic');
    
  }, [peaks, landraceName]);
  
  return (
    <div className="relative">
      <svg ref={svgRef} className="w-full" />
      
      {/* Tooltip */}
      {hoveredPeak && (
        <div className="absolute top-4 right-4 bg-card border rounded-lg p-3 shadow-lg max-w-xs">
          <h4 className="font-semibold text-sm mb-2">{hoveredPeak.compound_name}</h4>
          <div className="space-y-1 text-xs text-muted-foreground">
            <p><span className="font-medium">CAS:</span> {hoveredPeak.cas_number}</p>
            <p><span className="font-medium">RT:</span> {hoveredPeak.retention_time} min</p>
            <p><span className="font-medium">Conc:</span> {hoveredPeak.concentration_ppm} ppm</p>
          </div>
        </div>
      )}
    </div>
  );
}

// Composant pour l'onglet Spectres MS
function MSSpectraTab({ peaks, landraceName }: { peaks: any[]; landraceName: string }) {
  const [selectedCompound, setSelectedCompound] = useState<{ name: string; cas: string } | null>(null);
  
  // Récupérer les spectres MS disponibles
  const { data: msSpectra, isLoading } = trpc.tobacco.getMsSpectra.useQuery();
  
  // Trouver les spectres correspondant aux pics de cette landrace
  const matchedSpectra = peaks?.map((peak: any) => {
    const spectrum = msSpectra?.find((s: any) => 
      s.compound_name === peak.compound_name || s.cas_number === peak.cas_number
    );
    return {
      ...peak,
      hasSpectrum: !!spectrum,
      spectrum
    };
  }) || [];
  
  const spectraAvailable = matchedSpectra.filter((p: any) => p.hasSpectrum);
  const spectraMissing = matchedSpectra.filter((p: any) => !p.hasSpectrum);
  
  if (!peaks || peaks?.length === 0) {
    return (
      <Card className="bg-muted/50">
        <CardContent className="py-12 text-center">
          <Zap className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
          <h3 className="text-lg font-semibold mb-2">Aucune donnée chromatographique</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            Les spectres de masse ne sont disponibles que pour les landraces ayant des données GC-MS.
          </p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Résumé */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-cyan-500" />
            Spectres de masse disponibles
          </CardTitle>
          <CardDescription>
            Spectres MS des composés identifiés dans {landraceName}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 text-sm">
            <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/30">
              {spectraAvailable.length} spectres disponibles
            </Badge>
            {spectraMissing.length > 0 && (
              <Badge variant="outline" className="bg-yellow-500/10 text-yellow-400 border-yellow-500/30">
                {spectraMissing.length} spectres manquants
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Liste des composés avec spectres */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-purple-500" />
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
                  <th className="text-right py-3 px-4 font-semibold">Concentration</th>
                  <th className="text-center py-3 px-4 font-semibold">Spectre MS</th>
                </tr>
              </thead>
              <tbody>
                {matchedSpectra.sort((a: any, b: any) => b.concentration_ppm - a.concentration_ppm).map((compound: any, idx: number) => (
                  <tr key={idx} className="border-b border-border/50 hover:bg-muted/50">
                    <td className="py-3 px-4 font-medium">{compound.compound_name}</td>
                    <td className="py-3 px-4 text-muted-foreground font-mono text-sm">{compound.cas_number}</td>
                    <td className="py-3 px-4 text-right">
                      <Badge variant="outline">{compound.concentration_ppm} ppm</Badge>
                    </td>
                    <td className="py-3 px-4 text-center">
                      {compound.hasSpectrum ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedCompound({ name: compound.compound_name, cas: compound.cas_number })}
                          className="bg-cyan-500/10 text-cyan-400 border-cyan-500/30 hover:bg-cyan-500/20"
                        >
                          <Zap className="h-3 w-3 mr-1" />
                          Voir spectre
                        </Button>
                      ) : (
                        <span className="text-muted-foreground text-sm">Non disponible</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      
      {/* Liens vers outils avancés */}
      <Card>
        <CardContent className="py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              {msSpectra?.length || 0} spectres de référence dans la base de données
            </p>
            <div className="flex gap-2">
              <Link href="/ms-spectra">
                <Button variant="outline" size="sm">
                  Tous les spectres
                </Button>
              </Link>
              <Link href="/compare-spectra">
                <Button variant="outline" size="sm">
                  <Layers className="h-4 w-4 mr-1" />
                  Comparer
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Popup du spectre MS */}
      <MSSpectrumPopup
        compoundName={selectedCompound?.name || null}
        casNumber={selectedCompound?.cas}
        onClose={() => setSelectedCompound(null)}
      />
    </div>
  );
}

// Couleurs par profil moléculaire
const profileColors: Record<string, string> = {
  "cuir-animal": "bg-amber-900 text-amber-100",
  "floral-mielle": "bg-pink-500 text-white",
  "cremeux-gourmand": "bg-orange-400 text-orange-900",
  "mixte": "bg-purple-500 text-white",
  "unknown": "bg-gray-500 text-white",
};

// Couleurs par statut
const statusColors: Record<string, string> = {
  "active": "bg-green-500/20 text-green-400 border-green-500/30",
  "rare": "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  "endangered": "bg-orange-500/20 text-orange-400 border-orange-500/30",
  "extinct": "bg-red-500/20 text-red-400 border-red-500/30",
  "unknown": "bg-gray-500/20 text-gray-400 border-gray-500/30",
};

export default function TobaccoLandraceDetail() {
  const [, params] = useRoute('/tobacco-landrace/:name');
  const landraceName = params?.name ? decodeURIComponent(params.name) : '';
  
  // Récupérer les données de la landrace
  // `getLandraces` renvoie une enveloppe { success, data } : le `.find(...)`
  // plus bas s'appliquait à l'enveloppe et levait un TypeError.
  const { data: landracesResponse } = trpc.tobacco.getLandraces.useQuery();
  const landraces = landracesResponse?.data;
  const { data: chromatograms } = trpc.tobacco.getChromatograms.useQuery();
  const { data: peaks } = trpc.tobacco.getChromatogramPeaks.useQuery(
    { landraceName },
    { enabled: !!landraceName }
  );
  const { data: terpeneProfiles } = trpc.tobacco.getTerpeneProfilesByLandrace.useQuery(
    { landraceName },
    { enabled: !!landraceName }
  );
  
  const landrace = landraces?.find((l: any) => l.name === landraceName);
  const chromatogram = chromatograms?.find((c: any) => c.landrace_name === landraceName);
  
  if (!landrace) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container py-8">
          <Link href="/tobacco-landraces">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour aux landraces
            </Button>
          </Link>
          <Card className="bg-muted/50">
            <CardContent className="py-12 text-center">
              <Leaf className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
              <h3 className="text-lg font-semibold mb-2">Landrace non trouvée</h3>
              <p className="text-muted-foreground">
                La landrace "{landraceName}" n'existe pas dans la base de données.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-900/20 via-emerald-900/20 to-teal-900/20 border-b">
        <div className="container py-8">
          <Link href="/tobacco-landraces">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour aux landraces
            </Button>
          </Link>
          
          <div className="flex items-start gap-4">
            <div className="p-4 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20">
              <Leaf className="h-10 w-10 text-green-400" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold">{landrace.name}</h1>
                <Badge className={statusColors[landrace.status] || statusColors.unknown}>
                  {landrace.status}
                </Badge>
                <Badge className={profileColors[landrace.molecular_profile_type] || profileColors.unknown}>
                  {landrace.molecular_profile_type}
                </Badge>
              </div>
              <p className="text-muted-foreground flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {landrace.region}, {landrace.country}
                <span className="mx-2">•</span>
                <span className="italic">{landrace.species}</span>
              </p>
              {landrace.alternate_names && (
                <p className="text-sm text-muted-foreground mt-1">
                  Aussi connu sous: {landrace.alternate_names}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="container py-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="flex-wrap h-auto">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="molecular">Profil moléculaire</TabsTrigger>
            <TabsTrigger value="terpenes">Terpènes</TabsTrigger>
            <TabsTrigger value="chromatography">
              <Activity className="h-4 w-4 mr-1" />
              Chromatographie
            </TabsTrigger>
            <TabsTrigger value="ms-spectra">
              <Zap className="h-4 w-4 mr-1" />
              Spectres MS
            </TabsTrigger>
            <TabsTrigger value="perfumery">Applications</TabsTrigger>
          </TabsList>
          
          {/* Vue d'ensemble */}
          <TabErrorBoundary>
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Profil aromatique */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-amber-500" />
                    Profil aromatique
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Description</p>
                    <p className="font-medium">{landrace.aromatic_profile}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Intensité</p>
                    <Progress value={landrace.aromatic_intensity * 10} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-1">{landrace.aromatic_intensity}/10</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Notes dominantes</p>
                      <p className="font-medium text-sm">{landrace.dominant_notes}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Notes secondaires</p>
                      <p className="font-medium text-sm">{landrace.secondary_notes}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Informations techniques */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Beaker className="h-5 w-5 text-blue-500" />
                    Informations techniques
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Méthode de séchage</p>
                      <p className="font-medium">{landrace.curing_method}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Score de rareté</p>
                      <div className="flex items-center gap-2">
                        <Progress value={landrace.rarity_score * 10} className="h-2 flex-1" />
                        <span className="text-sm font-medium">{landrace.rarity_score}/10</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Certitude des données</p>
                    <Badge variant="outline">{landrace.data_certainty}</Badge>
                  </div>
                  {landrace.historical_notes && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Notes historiques</p>
                      <p className="text-sm">{landrace.historical_notes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          </TabErrorBoundary>
          
          {/* Profil moléculaire */}
          <TabErrorBoundary>
          <TabsContent value="molecular" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FlaskConical className="h-5 w-5 text-purple-500" />
                  Concentrations moléculaires
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-4 rounded-lg bg-pink-500/10 border border-pink-500/20">
                    <p className="text-sm text-pink-400 mb-1">Indoles</p>
                    <p className="text-2xl font-bold">{landrace.indoles_ppm} ppm</p>
                  </div>
                  <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/20">
                    <p className="text-sm text-purple-400 mb-1">Terpènes floraux</p>
                    <p className="text-2xl font-bold">{landrace.terpenes_floraux_ppm} ppm</p>
                  </div>
                  <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
                    <p className="text-sm text-amber-400 mb-1">Lactones</p>
                    <p className="text-2xl font-bold">{landrace.lactones_ppm} ppm</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          </TabErrorBoundary>
          
          {/* Terpènes */}
          <TabErrorBoundary>
          <TabsContent value="terpenes" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Beaker className="h-5 w-5 text-green-500" />
                  Profil terpénique
                </CardTitle>
              </CardHeader>
              <CardContent>
                {terpeneProfiles && terpeneProfiles?.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4 font-semibold">Terpène</th>
                          <th className="text-right py-3 px-4 font-semibold">Concentration</th>
                          <th className="text-right py-3 px-4 font-semibold">Abondance</th>
                          <th className="text-left py-3 px-4 font-semibold">Contribution olfactive</th>
                        </tr>
                      </thead>
                      <tbody>
                        {terpeneProfiles?.map((profile: any, idx: number) => (
                          <tr key={idx} className="border-b border-border/50 hover:bg-muted/50">
                            <td className="py-3 px-4 font-medium">{profile.terpene_name}</td>
                            <td className="py-3 px-4 text-right">
                              <Badge variant="outline">{profile.concentration_ppm} ppm</Badge>
                            </td>
                            <td className="py-3 px-4 text-right">{profile.relative_abundance}%</td>
                            <td className="py-3 px-4 text-sm text-muted-foreground">{profile.olfactory_contribution}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Beaker className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>Aucun profil terpénique disponible pour cette landrace.</p>
                    <Link href="/terpene-profiles">
                      <Button variant="link" className="mt-2">
                        Voir tous les profils terpéniques
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          </TabErrorBoundary>
          
          {/* Chromatographie */}
          <TabErrorBoundary>
          <TabsContent value="chromatography" className="space-y-6">
            {chromatogram && peaks && peaks?.length > 0 ? (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="h-5 w-5 text-cyan-500" />
                      Chromatogramme GC-MS
                    </CardTitle>
                    <CardDescription>
                      Analysé le {new Date(chromatogram.analysis_date).toLocaleDateString('fr-FR')} — 
                      {chromatogram.identified_peaks}/{chromatogram.total_peaks} pics identifiés
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ChromatogramChart peaks={peaks} landraceName={landraceName} />
                  </CardContent>
                </Card>
                
                {/* Paramètres d'analyse */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Microscope className="h-5 w-5 text-purple-500" />
                      Paramètres d'analyse
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="p-3 rounded-lg bg-muted/50">
                        <p className="text-xs text-muted-foreground mb-1">Instrument</p>
                        <p className="font-medium text-sm">{chromatogram.instrument}</p>
                      </div>
                      <div className="p-3 rounded-lg bg-muted/50">
                        <p className="text-xs text-muted-foreground mb-1">Colonne</p>
                        <p className="font-medium text-sm">{chromatogram.column_type}</p>
                      </div>
                      <div className="p-3 rounded-lg bg-muted/50">
                        <p className="text-xs text-muted-foreground mb-1">Programme four</p>
                        <p className="font-medium text-sm">{chromatogram.oven_program}</p>
                      </div>
                    </div>
                    {chromatogram.notes && (
                      <div className="mt-4 p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                        <p className="text-sm text-cyan-400">{chromatogram.notes}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                {/* Composés identifiés */}
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
            ) : (
              <Card className="bg-muted/50">
                <CardContent className="py-12 text-center">
                  <Activity className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
                  <h3 className="text-lg font-semibold mb-2">Aucun chromatogramme disponible</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Les données de chromatographie GC-MS ne sont pas encore disponibles pour cette landrace.
                  </p>
                  <Link href="/gcms-chromatograms">
                    <Button variant="link" className="mt-4">
                      Voir tous les chromatogrammes
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          </TabErrorBoundary>
          
          {/* Spectres de masse */}
          <TabErrorBoundary>
          <TabsContent value="ms-spectra" className="space-y-6">
            <MSSpectraTab peaks={peaks} landraceName={landrace.name} />
          </TabsContent>
          </TabErrorBoundary>
          
          {/* Applications en parfumerie */}
          <TabErrorBoundary>
          <TabsContent value="perfumery" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-amber-500" />
                  Potentiel en parfumerie
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Score de potentiel</p>
                  <div className="flex items-center gap-3">
                    <Progress value={landrace.perfumery_potential_score * 10} className="h-3 flex-1" />
                    <span className="text-lg font-bold">{landrace.perfumery_potential_score}/10</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Applications recommandées</p>
                  <p className="font-medium">{landrace.perfumery_applications}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          </TabErrorBoundary>
        </Tabs>
      </div>
    </div>
  );
}
