import { useState, useEffect, useRef, useMemo } from 'react';
import { trpc } from '@/lib/trpc';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Zap, Search, Target, BarChart3, Info, Plus, X, Trash2, Upload, CheckCircle2, FileUp, AlertTriangle, FileText } from 'lucide-react';
import { parseSpectrumFile, validateSpectrum, formatMetadata, type ParsedSpectrum } from '@/lib/spectrumParsers';
import { Link } from 'wouter';
import * as d3 from 'd3';

interface Peak {
  mz: number;
  intensity: number;
}

interface MatchResult {
  compound_name: string;
  cas_number: string;
  molecular_formula: string;
  molecular_weight: string;
  similarity: number;
  matchedPeaks: number;
  totalPeaks: number;
  source: string;
}

// Composant de visualisation du spectre inconnu
function UnknownSpectrumChart({ peaks }: { peaks: Peak[] }) {
  const svgRef = useRef<SVGSVGElement>(null);
  
  useEffect(() => {
    if (!svgRef.current || peaks.length === 0) return;
    
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();
    
    const margin = { top: 20, right: 30, bottom: 50, left: 60 };
    const width = 600 - margin.left - margin.right;
    const height = 250 - margin.top - margin.bottom;
    
    const g = svg
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);
    
    // Échelles
    const maxMz = Math.max(...peaks.map(p => p.mz)) + 20;
    const xScale = d3.scaleLinear().domain([0, maxMz]).range([0, width]);
    const yScale = d3.scaleLinear().domain([0, 110]).range([height, 0]);
    
    // Grille
    g.append('g')
      .attr('class', 'grid')
      .call(d3.axisLeft(yScale).tickSize(-width).tickFormat(() => ''))
      .selectAll('line')
      .attr('stroke', 'hsl(var(--border))')
      .attr('stroke-opacity', 0.2);
    
    // Ligne de base
    g.append('line')
      .attr('x1', 0).attr('y1', height)
      .attr('x2', width).attr('y2', height)
      .attr('stroke', 'hsl(var(--muted-foreground))')
      .attr('stroke-width', 1);
    
    // Dessiner les pics
    peaks.forEach((peak) => {
      const isBasePeak = peak.intensity === 100;
      
      g.append('line')
        .attr('x1', xScale(peak.mz))
        .attr('y1', height)
        .attr('x2', xScale(peak.mz))
        .attr('y2', yScale(peak.intensity))
        .attr('stroke', isBasePeak ? 'hsl(142, 76%, 36%)' : 'hsl(var(--primary))')
        .attr('stroke-width', isBasePeak ? 3 : 2);
      
      // Label m/z
      if (peak.intensity >= 30 || isBasePeak) {
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
    
    // Labels
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
      .text('Intensité (%)');
    
  }, [peaks]);
  
  return <svg ref={svgRef} className="w-full" />;
}

// Calcul de similarité spectrale pondérée
function calculateWeightedSimilarity(unknownPeaks: Peak[], referencePeaks: Peak[], tolerance: number = 1): { similarity: number; matchedPeaks: number } {
  if (unknownPeaks.length === 0 || referencePeaks.length === 0) {
    return { similarity: 0, matchedPeaks: 0 };
  }
  
  let matchedPeaks = 0;
  let weightedScore = 0;
  let totalWeight = 0;
  
  // Pour chaque pic inconnu, chercher une correspondance dans la référence
  unknownPeaks.forEach(unknownPeak => {
    const match = referencePeaks.find(refPeak => 
      Math.abs(refPeak.mz - unknownPeak.mz) <= tolerance
    );
    
    if (match) {
      matchedPeaks++;
      // Pondération par l'intensité du pic de référence
      const weight = match.intensity / 100;
      const intensityMatch = 1 - Math.abs(unknownPeak.intensity - match.intensity) / 100;
      weightedScore += weight * intensityMatch;
      totalWeight += weight;
    }
  });
  
  // Pénaliser les pics non matchés
  const unmatchedPenalty = (unknownPeaks.length - matchedPeaks) / unknownPeaks.length * 0.3;
  
  const baseSimilarity = totalWeight > 0 ? (weightedScore / totalWeight) * 100 : 0;
  const similarity = Math.max(0, baseSimilarity - unmatchedPenalty * 100);
  
  return { similarity, matchedPeaks };
}

export default function SpectraIdentification() {
  const [inputMode, setInputMode] = useState<'manual' | 'text' | 'file'>('manual');
  const [manualPeaks, setManualPeaks] = useState<Peak[]>([]);
  const [newMz, setNewMz] = useState('');
  const [newIntensity, setNewIntensity] = useState('');
  const [textInput, setTextInput] = useState('');
  const [tolerance, setTolerance] = useState(1);
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<MatchResult[]>([]);
  
  // États pour l'upload de fichiers
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [parsedSpectrum, setParsedSpectrum] = useState<ParsedSpectrum | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);
  const [parseWarnings, setParseWarnings] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Récupérer tous les spectres de référence
  const { data: referenceSpectra, isLoading } = trpc.tobacco.getMsSpectra.useQuery();
  
  // Ajouter un pic manuellement
  const addPeak = () => {
    const mz = parseFloat(newMz);
    const intensity = parseFloat(newIntensity);
    
    if (isNaN(mz) || isNaN(intensity) || mz <= 0 || intensity <= 0 || intensity > 100) {
      return;
    }
    
    // Vérifier si le pic existe déjà
    if (manualPeaks.some(p => p.mz === mz)) {
      return;
    }
    
    setManualPeaks([...manualPeaks, { mz, intensity }].sort((a, b) => a.mz - b.mz));
    setNewMz('');
    setNewIntensity('');
  };
  
  // Supprimer un pic
  const removePeak = (mz: number) => {
    setManualPeaks(manualPeaks.filter(p => p.mz !== mz));
  };
  
  // Parser le texte en pics
  const parseTextInput = () => {
    const lines = textInput.split('\n').filter(l => l.trim());
    const peaks: Peak[] = [];
    
    lines.forEach(line => {
      // Formats supportés: "mz intensity", "mz,intensity", "mz\tintensity"
      const parts = line.split(/[\s,\t]+/).map(p => parseFloat(p.trim()));
      if (parts.length >= 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
        peaks.push({ mz: parts[0], intensity: Math.min(100, parts[1]) });
      }
    });
    
    if (peaks.length > 0) {
      // Normaliser les intensités si nécessaire
      const maxIntensity = Math.max(...peaks.map(p => p.intensity));
      if (maxIntensity > 100) {
        peaks.forEach(p => p.intensity = (p.intensity / maxIntensity) * 100);
      }
      
      setManualPeaks(peaks.sort((a, b) => a.mz - b.mz));
    }
  };
  
  // Gérer l'upload de fichier
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    setUploadedFile(file);
    setParseError(null);
    setParseWarnings([]);
    setParsedSpectrum(null);
    
    try {
      const content = await file.text();
      const result = parseSpectrumFile(content, file.name);
      
      if (result.success && result.spectrum) {
        setParsedSpectrum(result.spectrum);
        setManualPeaks(result.spectrum.peaks);
        
        // Valider le spectre
        const validation = validateSpectrum(result.spectrum);
        setParseWarnings(validation.warnings);
      } else {
        setParseError(result.error || 'Erreur de parsing inconnue');
      }
    } catch (error) {
      setParseError(`Erreur de lecture du fichier: ${error}`);
    }
  };
  
  // Lancer l'identification
  const runIdentification = () => {
    if (manualPeaks.length === 0 || !referenceSpectra) return;
    
    setIsSearching(true);
    
    // Calculer la similarité avec chaque spectre de référence
    const matches: MatchResult[] = referenceSpectra.map((ref: any) => {
      const refPeaks = ref.spectrum_data?.peaks || [];
      const { similarity, matchedPeaks } = calculateWeightedSimilarity(manualPeaks, refPeaks, tolerance);
      
      return {
        compound_name: ref.compound_name,
        cas_number: ref.cas_number,
        molecular_formula: ref.molecular_formula,
        molecular_weight: ref.molecular_weight,
        similarity,
        matchedPeaks,
        totalPeaks: refPeaks.length,
        source: ref.source
      };
    });
    
    // Trier par similarité décroissante et garder les meilleurs
    const sortedMatches = matches
      .filter(m => m.similarity > 30)
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 10);
    
    setResults(sortedMatches);
    setIsSearching(false);
  };
  
  // Effacer tout
  const clearAll = () => {
    setManualPeaks([]);
    setTextInput('');
    setResults([]);
    setUploadedFile(null);
    setParsedSpectrum(null);
    setParseError(null);
    setParseWarnings([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-900/20 via-blue-900/20 to-purple-900/20 border-b">
        <div className="container py-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20">
              <Target className="h-8 w-8 text-cyan-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Identification de spectres</h1>
              <p className="text-muted-foreground">
                Comparez un spectre inconnu avec la base de données pour identifier le composé
              </p>
            </div>
          </div>
          
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-primary">Accueil</Link>
            <span>/</span>
            <Link href="/ms-spectra" className="hover:text-primary">Spectres MS</Link>
            <span>/</span>
            <span className="text-foreground">Identification</span>
          </div>
        </div>
      </div>
      
      <div className="container py-8 space-y-8">
        {/* Entrée des données */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-cyan-500" />
              Spectre inconnu
            </CardTitle>
            <CardDescription>
              Entrez les pics m/z et leurs intensités relatives
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Sélection du mode d'entrée */}
            <div className="flex flex-wrap gap-2">
              <Button
                variant={inputMode === 'manual' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setInputMode('manual')}
              >
                Entrée manuelle
              </Button>
              <Button
                variant={inputMode === 'text' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setInputMode('text')}
              >
                Coller des données
              </Button>
              <Button
                variant={inputMode === 'file' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setInputMode('file')}
              >
                <FileUp className="h-4 w-4 mr-1" />
                Importer un fichier
              </Button>
            </div>
            
            {inputMode === 'file' ? (
              <div className="space-y-4">
                {/* Zone d'upload */}
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".msp,.jdx,.dx,.jcamp,.csv,.txt"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="spectrum-file-input"
                  />
                  <label htmlFor="spectrum-file-input" className="cursor-pointer">
                    <FileUp className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-lg font-medium mb-2">Cliquez pour sélectionner un fichier</p>
                    <p className="text-sm text-muted-foreground mb-4">
                      Formats supportés: .msp (NIST), .jdx (JCAMP-DX), .csv, .txt
                    </p>
                    {uploadedFile && (
                      <Badge variant="outline" className="bg-primary/10">
                        <FileText className="h-3 w-3 mr-1" />
                        {uploadedFile.name}
                      </Badge>
                    )}
                  </label>
                </div>
                
                {/* Erreur de parsing */}
                {parseError && (
                  <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="h-5 w-5 mt-0.5" />
                      <div>
                        <p className="font-medium">Erreur de lecture</p>
                        <p className="text-sm">{parseError}</p>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Avertissements */}
                {parseWarnings.length > 0 && (
                  <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
                      <div>
                        <p className="font-medium text-yellow-500">Avertissements</p>
                        <ul className="text-sm text-muted-foreground mt-1 space-y-1">
                          {parseWarnings.map((w, i) => <li key={i}>• {w}</li>)}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Métadonnées extraites */}
                {parsedSpectrum && (
                  <Card className="bg-muted/50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Info className="h-4 w-4" />
                        Métadonnées extraites
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                        {formatMetadata(parsedSpectrum.metadata).map((line, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <span className="text-muted-foreground">{line.split(':')[0]}:</span>
                            <span className="font-medium">{line.split(':').slice(1).join(':')}</span>
                          </div>
                        ))}
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">Format:</span>
                          <Badge variant="outline">{parsedSpectrum.format.toUpperCase()}</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            ) : inputMode === 'manual' ? (
              <div className="space-y-4">
                {/* Formulaire d'ajout de pic */}
                <div className="flex gap-2 items-end">
                  <div className="flex-1">
                    <label className="text-sm text-muted-foreground mb-1 block">m/z</label>
                    <Input
                      type="number"
                      placeholder="ex: 93"
                      value={newMz}
                      onChange={(e) => setNewMz(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && addPeak()}
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-sm text-muted-foreground mb-1 block">Intensité (%)</label>
                    <Input
                      type="number"
                      placeholder="ex: 100"
                      value={newIntensity}
                      onChange={(e) => setNewIntensity(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && addPeak()}
                      max={100}
                    />
                  </div>
                  <Button onClick={addPeak}>
                    <Plus className="h-4 w-4 mr-1" />
                    Ajouter
                  </Button>
                </div>
                
                {/* Liste des pics */}
                {manualPeaks.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {manualPeaks.map((peak) => (
                      <div
                        key={peak.mz}
                        className="flex items-center gap-1 px-2 py-1 rounded bg-muted text-sm"
                      >
                        <span className="font-mono">{peak.mz}</span>
                        <span className="text-muted-foreground">({peak.intensity}%)</span>
                        <button
                          onClick={() => removePeak(peak.mz)}
                          className="ml-1 p-0.5 hover:bg-destructive/20 rounded"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <Textarea
                  placeholder="Collez vos données ici (format: m/z intensité, une paire par ligne)&#10;Exemple:&#10;41 45&#10;93 100&#10;136 25"
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  rows={8}
                  className="font-mono text-sm"
                />
                <Button onClick={parseTextInput} variant="outline">
                  <Upload className="h-4 w-4 mr-2" />
                  Parser les données
                </Button>
              </div>
            )}
            
            {/* Visualisation du spectre */}
            {manualPeaks.length > 0 && (
              <div className="border rounded-lg p-4 bg-card">
                <UnknownSpectrumChart peaks={manualPeaks} />
              </div>
            )}
            
            {/* Paramètres et actions */}
            <div className="flex items-center justify-between pt-4 border-t">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <label className="text-sm text-muted-foreground">Tolérance m/z:</label>
                  <Input
                    type="number"
                    value={tolerance}
                    onChange={(e) => setTolerance(parseFloat(e.target.value) || 1)}
                    className="w-20"
                    min={0.1}
                    max={5}
                    step={0.1}
                  />
                </div>
                <span className="text-sm text-muted-foreground">
                  {manualPeaks.length} pics
                </span>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={clearAll}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Effacer
                </Button>
                <Button
                  onClick={runIdentification}
                  disabled={manualPeaks.length === 0 || isLoading}
                >
                  {isSearching ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Search className="h-4 w-4 mr-2" />
                  )}
                  Identifier
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Résultats */}
        {results.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                Résultats de l'identification
              </CardTitle>
              <CardDescription>
                {results.length} correspondance(s) trouvée(s) dans la base de données ({referenceSpectra?.length || 0} spectres)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {results.map((result, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-lg border ${
                      idx === 0 ? 'bg-green-500/10 border-green-500/30' : 'bg-muted/50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          {idx === 0 && (
                            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                              Meilleure correspondance
                            </Badge>
                          )}
                          <h4 className="font-semibold text-lg">{result.compound_name}</h4>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="font-mono">{result.molecular_formula}</span>
                          <span>MW: {parseFloat(result.molecular_weight).toFixed(2)}</span>
                          <span>CAS: {result.cas_number}</span>
                          <Badge variant="outline" className="text-xs">{result.source}</Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold" style={{
                          color: result.similarity > 80 ? 'hsl(142, 76%, 36%)' : 
                                 result.similarity > 60 ? 'hsl(45, 93%, 47%)' : 
                                 'hsl(var(--muted-foreground))'
                        }}>
                          {result.similarity.toFixed(1)}%
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {result.matchedPeaks}/{manualPeaks.length} pics matchés
                        </div>
                      </div>
                    </div>
                    
                    {/* Barre de progression */}
                    <div className="mt-3">
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${result.similarity}%`,
                            backgroundColor: result.similarity > 80 ? 'hsl(142, 76%, 36%)' : 
                                           result.similarity > 60 ? 'hsl(45, 93%, 47%)' : 
                                           'hsl(0, 84%, 60%)'
                          }}
                        />
                      </div>
                    </div>
                    
                    {/* Lien vers le spectre */}
                    <div className="mt-3 flex gap-2">
                      <Link href={`/ms-spectra?compound=${encodeURIComponent(result.compound_name)}`}>
                        <Button variant="outline" size="sm">
                          Voir le spectre de référence
                        </Button>
                      </Link>
                      <Link href={`/compare-spectra`}>
                        <Button variant="outline" size="sm">
                          Comparer
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Interprétation */}
              <div className="mt-6 p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <div className="flex items-start gap-2">
                  <Info className="h-4 w-4 text-blue-500 mt-0.5" />
                  <div className="text-sm text-muted-foreground">
                    <p className="font-medium text-blue-400 mb-1">Guide d'interprétation</p>
                    <p>
                      <strong>&gt;80%</strong>: Identification probable — le composé correspond très bien au spectre de référence<br/>
                      <strong>60-80%</strong>: Identification possible — vérifier avec d'autres critères (temps de rétention, formule)<br/>
                      <strong>&lt;60%</strong>: Faible correspondance — le composé est probablement différent ou absent de la base
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* État vide */}
        {results.length === 0 && manualPeaks.length === 0 && (
          <Card className="bg-muted/50">
            <CardContent className="py-12 text-center">
              <Target className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
              <h3 className="text-lg font-semibold mb-2">Aucun spectre à identifier</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Entrez les pics m/z et leurs intensités pour identifier un composé inconnu 
                par comparaison avec notre base de données de {referenceSpectra?.length || 0} spectres de référence.
              </p>
            </CardContent>
          </Card>
        )}
        
        {/* Info sur la base de données */}
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Chargement de la base de données...
                  </span>
                ) : (
                  `${referenceSpectra?.length || 0} spectres de référence disponibles (NIST + données expérimentales)`
                )}
              </span>
              <div className="flex gap-2">
                <Link href="/ms-spectra" className="text-primary hover:underline">
                  Voir tous les spectres →
                </Link>
              </div>
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
              <Link href="/compare-spectra">
                <Button variant="outline" className="w-full justify-start">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Comparer des spectres
                </Button>
              </Link>
              <Link href="/gcms-chromatograms">
                <Button variant="outline" className="w-full justify-start">
                  <Target className="h-4 w-4 mr-2" />
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
