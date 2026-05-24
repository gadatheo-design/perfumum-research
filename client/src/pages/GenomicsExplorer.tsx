// @ts-nocheck
import { safeJsonParse } from "@/lib/utils";
import { useState, useMemo } from 'react';
import { trpc } from '@/lib/trpc';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Link } from 'wouter';
import { 
  Search, 
  BookOpen, 
  ExternalLink, 
  Dna,
  Leaf,
  Database,
  Cigarette,
  Cannabis,
  FlaskConical,
  Network,
  ChevronRight,
  Calendar,
  FileText,
  ArrowRight,
  Zap,
  GitBranch,
  Boxes,
  Filter,
  Grid,
  List,
  Info
} from 'lucide-react';

// Types
type Reference = {
  id: number;
  entryKey: string;
  entryType: string;
  title: string;
  authors: string | null;
  year: number | null;
  containerTitle: string | null;
  doi: string | null;
  url: string | null;
  notes: string | null;
  tags: string[] | string | null;
  axisPrimaryCode: string | null;
  axesSecondary: string[] | string | null;
  [key: string]: any;
};

// Définition des axes Genomics
const GENOMICS_AXES = {
  G1: {
    code: 'G1',
    name: 'Cannabis Genomics',
    description: 'Génomique du cannabis, voies biosynthétiques des cannabinoïdes et terpènes, sélection variétale',
    color: '#22c55e',
    icon: Cannabis,
    keywords: ['cannabis', 'cannabinoid', 'thc', 'cbd', 'terpene', 'synthase', 'genome'],
    pathways: [
      { name: 'Cannabinoïdes', molecules: ['THC', 'CBD', 'CBG', 'CBC', 'CBN'], color: '#22c55e' },
      { name: 'Terpènes', molecules: ['Myrcène', 'Limonène', 'Pinène', 'Linalol', 'Caryophyllène'], color: '#84cc16' },
      { name: 'Flavonoïdes', molecules: ['Cannflavine A', 'Cannflavine B', 'Quercétine'], color: '#eab308' },
    ]
  },
  G2: {
    code: 'G2',
    name: 'Tobacco Genomics',
    description: 'Génomique du tabac, biosynthèse de la nicotine et alcaloïdes, amélioration variétale',
    color: '#f59e0b',
    icon: Cigarette,
    keywords: ['tobacco', 'nicotine', 'alkaloid', 'nicotiana', 'genome', 'biosynthesis'],
    pathways: [
      { name: 'Alcaloïdes', molecules: ['Nicotine', 'Nornicotine', 'Anabasine', 'Anatabine'], color: '#f59e0b' },
      { name: 'Terpènes', molecules: ['Solanésol', 'Cembratriénols', 'Labdanols'], color: '#fb923c' },
      { name: 'Composés aromatiques', molecules: ['Eugénol', 'Vanilline', 'Benzaldéhyde'], color: '#fbbf24' },
    ]
  },
  G3: {
    code: 'G3',
    name: 'Genomic Databases',
    description: 'Bases de données génomiques, outils bioinformatiques, ressources pour la recherche',
    color: '#8b5cf6',
    icon: Database,
    keywords: ['database', 'bioinformatics', 'ncbi', 'ensembl', 'genome', 'sequence'],
    pathways: [
      { name: 'Séquençage', molecules: ['NGS', 'RNA-seq', 'WGS', 'Assemblage'], color: '#8b5cf6' },
      { name: 'Annotation', molecules: ['BLAST', 'InterPro', 'GO Terms', 'KEGG'], color: '#a78bfa' },
      { name: 'Phylogénie', molecules: ['Alignement', 'Arbres', 'Évolution', 'Orthologues'], color: '#c4b5fd' },
    ]
  }
};

// Composant pour les voies biosynthétiques
function BiosynthesisPathway({ 
  axis, 
  isExpanded 
}: { 
  axis: typeof GENOMICS_AXES.G1;
  isExpanded: boolean;
}) {
  if (!isExpanded) return null;

  return (
    <div className="mt-4 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
      <h4 className="text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
        <GitBranch className="w-4 h-4" style={{ color: axis.color }} />
        Voies biosynthétiques
      </h4>
      <div className="space-y-3">
        {axis.pathways.map((pathway, idx) => (
          <div key={idx} className="flex items-start gap-3">
            <div 
              className="w-2 h-2 rounded-full mt-2 shrink-0"
              style={{ backgroundColor: pathway.color }}
            />
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-200">{pathway.name}</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {pathway.molecules.map((mol, i) => (
                  <Badge 
                    key={i} 
                    variant="outline" 
                    className="text-xs"
                    style={{ borderColor: pathway.color, color: pathway.color }}
                  >
                    {mol}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Carte d'axe génomique
function GenomicsAxisCard({ 
  axis, 
  count, 
  isSelected, 
  onClick,
  showPathways
}: { 
  axis: typeof GENOMICS_AXES.G1; 
  count: number; 
  isSelected: boolean;
  onClick: () => void;
  showPathways: boolean;
}) {
  const Icon = axis.icon;
  
  return (
    <Card 
      className={`cursor-pointer transition-all duration-200 ${
        isSelected 
          ? 'ring-2 ring-offset-2 ring-offset-slate-950 bg-slate-800/80' 
          : 'bg-slate-900/50 hover:bg-slate-800/50'
      } border-slate-700`}
      style={{ 
        borderLeftColor: axis.color, 
        borderLeftWidth: '4px',
        ...(isSelected && { ringColor: axis.color })
      }}
      onClick={onClick}
    >
      <CardContent className="pt-6">
        <div className="flex items-start gap-4">
          <div 
            className="p-3 rounded-lg"
            style={{ backgroundColor: `${axis.color}20` }}
          >
            <Icon className="w-6 h-6" style={{ color: axis.color }} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Badge 
                variant="outline" 
                className="font-mono text-xs"
                style={{ borderColor: axis.color, color: axis.color }}
              >
                {axis.code}
              </Badge>
              <span className="text-2xl font-bold text-slate-100">{count}</span>
            </div>
            <h3 className="text-sm font-medium text-slate-200 mb-1">{axis.name}</h3>
            <p className="text-xs text-slate-400 line-clamp-2">{axis.description}</p>
          </div>
        </div>
        <BiosynthesisPathway axis={axis} isExpanded={showPathways && isSelected} />
      </CardContent>
    </Card>
  );
}

// Carte de référence génomique
function GenomicsReferenceCard({ 
  reference, 
  onClick 
}: { 
  reference: Reference; 
  onClick: () => void;
}) {
  const axisInfo = reference.axisPrimaryCode ? GENOMICS_AXES[reference.axisPrimaryCode as keyof typeof GENOMICS_AXES] : null;
  
  const parseTags = (tagsInput: string | string[] | null): string[] => {
    if (!tagsInput) return [];
    if (Array.isArray(tagsInput)) return tagsInput;
    try {
      const parsed = safeJsonParse(tagsInput, null);
      return Array.isArray(parsed) ? parsed : [tagsInput];
    } catch {
      return tagsInput.split(',').map(t => t.trim());
    }
  };
  
  const tags = parseTags(reference.tags);
  
  return (
    <Card 
      className="bg-slate-900/50 border-slate-700 hover:border-slate-600 transition-colors cursor-pointer group"
      onClick={onClick}
    >
      <CardContent className="pt-6">
        <div className="flex items-start gap-3">
          {axisInfo && (
            <div 
              className="p-2 rounded-lg shrink-0"
              style={{ backgroundColor: `${axisInfo.color}20` }}
            >
              <axisInfo.icon className="w-5 h-5" style={{ color: axisInfo.color }} />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              {axisInfo && (
                <Badge 
                  variant="outline" 
                  className="font-mono text-xs shrink-0"
                  style={{ borderColor: axisInfo.color, color: axisInfo.color }}
                >
                  {axisInfo.code}
                </Badge>
              )}
              {reference.year && (
                <span className="text-xs text-slate-500">{reference.year}</span>
              )}
              {reference.entryType && (
                <Badge variant="secondary" className="text-xs bg-slate-800">
                  {reference.entryType}
                </Badge>
              )}
            </div>
            
            <h3 className="text-sm font-medium text-slate-200 mb-1 line-clamp-2 group-hover:text-slate-100">
              {reference.title}
            </h3>
            
            {reference.authors && (
              <p className="text-xs text-slate-400 mb-2 line-clamp-1">
                {reference.authors}
              </p>
            )}
            
            {reference.containerTitle && (
              <p className="text-xs text-slate-500 italic mb-2 line-clamp-1">
                {reference.containerTitle}
              </p>
            )}
            
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {tags.slice(0, 4).map((tag, i) => (
                  <Badge 
                    key={i} 
                    variant="secondary" 
                    className="text-xs bg-slate-800 text-slate-300"
                  >
                    {tag}
                  </Badge>
                ))}
                {tags.length > 4 && (
                  <Badge variant="secondary" className="text-xs bg-slate-800 text-slate-400">
                    +{tags.length - 4}
                  </Badge>
                )}
              </div>
            )}
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-slate-300 shrink-0" />
        </div>
      </CardContent>
    </Card>
  );
}

// Dialog de détail
function ReferenceDetailDialog({ 
  reference, 
  open, 
  onClose 
}: { 
  reference: Reference | null; 
  open: boolean; 
  onClose: () => void;
}) {
  if (!reference) return null;
  
  const axisInfo = reference.axisPrimaryCode ? GENOMICS_AXES[reference.axisPrimaryCode as keyof typeof GENOMICS_AXES] : null;
  
  const parseTags = (tagsInput: string | string[] | null): string[] => {
    if (!tagsInput) return [];
    if (Array.isArray(tagsInput)) return tagsInput;
    try {
      const parsed = safeJsonParse(tagsInput, null);
      return Array.isArray(parsed) ? parsed : [tagsInput];
    } catch {
      return tagsInput.split(',').map(t => t.trim());
    }
  };
  
  const tags = parseTags(reference.tags);
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-slate-900 border-slate-700">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            {axisInfo && (
              <Badge 
                variant="outline"
                style={{ borderColor: axisInfo.color, color: axisInfo.color }}
              >
                {axisInfo.code} — {axisInfo.name}
              </Badge>
            )}
            {reference.year && (
              <Badge variant="secondary" className="bg-slate-800">
                <Calendar className="w-3 h-3 mr-1" />
                {reference.year}
              </Badge>
            )}
          </div>
          <DialogTitle className="text-xl text-slate-100 leading-tight">
            {reference.title}
          </DialogTitle>
          {reference.authors && (
            <DialogDescription className="text-slate-400">
              {reference.authors}
            </DialogDescription>
          )}
        </DialogHeader>
        
        <ScrollArea className="max-h-[60vh]">
          <div className="space-y-4 pr-4">
            {reference.containerTitle && (
              <div>
                <h4 className="text-sm font-medium text-slate-300 mb-1">Publication</h4>
                <p className="text-sm text-slate-400 italic">{reference.containerTitle}</p>
              </div>
            )}
            
            {reference.notes && (
              <div>
                <h4 className="text-sm font-medium text-slate-300 mb-1">Notes</h4>
                <p className="text-sm text-slate-400 whitespace-pre-wrap">{reference.notes}</p>
              </div>
            )}
            
            {/* Voies biosynthétiques associées */}
            {axisInfo && (
              <div>
                <h4 className="text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                  <GitBranch className="w-4 h-4" style={{ color: axisInfo.color }} />
                  Voies biosynthétiques associées
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {axisInfo.pathways.map((pathway, idx) => (
                    <div 
                      key={idx}
                      className="p-3 rounded-lg bg-slate-800/50 border border-slate-700"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div 
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: pathway.color }}
                        />
                        <span className="text-sm font-medium text-slate-200">{pathway.name}</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {pathway.molecules.slice(0, 3).map((mol, i) => (
                          <Badge 
                            key={i} 
                            variant="outline" 
                            className="text-xs"
                            style={{ borderColor: pathway.color, color: pathway.color }}
                          >
                            {mol}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {tags.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-slate-300 mb-2">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag, i) => (
                    <Badge key={i} variant="secondary" className="bg-slate-800">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            {/* Liens externes */}
            <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-700">
              {reference.doi && (
                <Button
                  variant="outline"
                  size="sm"
                  className="border-slate-600"
                  onClick={() => window.open(`https://doi.org/${reference.doi}`, '_blank')}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  DOI
                </Button>
              )}
              {reference.url && (
                <Button
                  variant="outline"
                  size="sm"
                  className="border-slate-600"
                  onClick={() => window.open(reference.url!, '_blank')}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Lien
                </Button>
              )}
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

// Visualisation des voies métaboliques
function MetabolicPathwaysVisualization({ selectedAxis }: { selectedAxis: string | null }) {
  const axis = selectedAxis ? GENOMICS_AXES[selectedAxis as keyof typeof GENOMICS_AXES] : null;
  
  if (!axis) {
    return (
      <Card className="bg-slate-900/50 border-slate-700">
        <CardContent className="py-12 text-center">
          <Network className="w-12 h-12 mx-auto mb-4 text-slate-600" />
          <p className="text-slate-400">Sélectionnez un axe génomique pour voir les voies métaboliques</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-900/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-lg text-slate-100 flex items-center gap-2">
          <Network className="w-5 h-5" style={{ color: axis.color }} />
          Voies Métaboliques — {axis.name}
        </CardTitle>
        <CardDescription className="text-slate-400">
          Visualisation des principales voies biosynthétiques
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {/* Schéma simplifié des voies */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {axis.pathways.map((pathway, idx) => (
              <div 
                key={idx}
                className="relative p-4 rounded-lg border-2 transition-all hover:scale-[1.02]"
                style={{ 
                  borderColor: pathway.color,
                  backgroundColor: `${pathway.color}10`
                }}
              >
                {/* Flèche de connexion */}
                {idx < axis.pathways.length - 1 && (
                  <div className="hidden md:block absolute -right-6 top-1/2 -translate-y-1/2 z-10">
                    <ArrowRight className="w-4 h-4 text-slate-500" />
                  </div>
                )}
                
                <div className="flex items-center gap-2 mb-3">
                  <Boxes className="w-5 h-5" style={{ color: pathway.color }} />
                  <h4 className="font-medium text-slate-200">{pathway.name}</h4>
                </div>
                
                <div className="space-y-2">
                  {pathway.molecules.map((mol, i) => (
                    <div 
                      key={i}
                      className="flex items-center gap-2 p-2 rounded bg-slate-800/50"
                    >
                      <div 
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: pathway.color }}
                      />
                      <span className="text-sm text-slate-300">{mol}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Légende */}
          <div className="mt-6 pt-4 border-t border-slate-700">
            <p className="text-xs text-slate-500 flex items-center gap-2">
              <Info className="w-4 h-4" />
              Les voies biosynthétiques représentent les principales classes de composés produits par l'organisme.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Page principale
export default function GenomicsExplorer() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAxis, setSelectedAxis] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedReference, setSelectedReference] = useState<Reference | null>(null);
  const [showPathways, setShowPathways] = useState(true);

  // Query
  const { data: allReferences, isLoading } = trpc.v3References.getAll.useQuery();

  // Filtrer les références génomiques (G1, G2, G3)
  const genomicsReferences = useMemo(() => {
    if (!allReferences) return [];
    return allReferences?.filter(ref => 
      ref.axisPrimaryCode === 'G1' || 
      ref.axisPrimaryCode === 'G2' || 
      ref.axisPrimaryCode === 'G3'
    );
  }, [allReferences]);

  // Compter par axe
  const countsByAxis = useMemo(() => {
    const counts: Record<string, number> = { G1: 0, G2: 0, G3: 0 };
    genomicsReferences.forEach(ref => {
      if (ref.axisPrimaryCode && counts[ref.axisPrimaryCode] !== undefined) {
        counts[ref.axisPrimaryCode]++;
      }
    });
    return counts;
  }, [genomicsReferences]);

  // Filtrer par recherche et axe
  const filteredReferences = useMemo(() => {
    let refs = genomicsReferences;
    
    if (selectedAxis) {
      refs = refs.filter(ref => ref.axisPrimaryCode === selectedAxis);
    }
    
    if (searchQuery.trim()) {
      const search = searchQuery.toLowerCase();
      refs = refs.filter(ref => 
        ref.title.toLowerCase().includes(search) ||
        ref.authors?.toLowerCase().includes(search) ||
        ref.entryKey.toLowerCase().includes(search) ||
        ref.notes?.toLowerCase().includes(search)
      );
    }
    
    return refs;
  }, [genomicsReferences, selectedAxis, searchQuery]);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <Header />
      
      <main className="flex-1">
        <div className="container py-8">
          <Breadcrumbs 
            customItems={[
              { label: "Accueil", path: "/" },
              { label: "Bibliographie", path: "/bibliographie" },
              { label: "Genomics Explorer" },
            ]} 
          />
          
          {/* En-tête */}
          <div className="mt-6 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-green-900/50 via-amber-900/50 to-purple-900/50">
                <Dna className="w-8 h-8 text-slate-100" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-100">
                  Genomics Explorer
                </h1>
                <p className="text-slate-400 mt-1">
                  Explorez les références génomiques sur le cannabis, le tabac et les bases de données
                </p>
              </div>
            </div>
            
            {/* Stats globales */}
            <div className="flex flex-wrap gap-4">
              <Badge variant="outline" className="text-sm border-slate-600 text-slate-300">
                <BookOpen className="w-4 h-4 mr-2" />
                {genomicsReferences.length} références génomiques
              </Badge>
              <Badge variant="outline" className="text-sm border-green-600 text-green-400">
                <Cannabis className="w-4 h-4 mr-2" />
                {countsByAxis.G1} Cannabis (G1)
              </Badge>
              <Badge variant="outline" className="text-sm border-amber-600 text-amber-400">
                <Cigarette className="w-4 h-4 mr-2" />
                {countsByAxis.G2} Tobacco (G2)
              </Badge>
              <Badge variant="outline" className="text-sm border-purple-600 text-purple-400">
                <Database className="w-4 h-4 mr-2" />
                {countsByAxis.G3} Databases (G3)
              </Badge>
            </div>
          </div>

          {/* Cartes des axes */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {Object.entries(GENOMICS_AXES).map(([code, axis]) => (
              <GenomicsAxisCard
                key={code}
                axis={axis}
                count={countsByAxis[code] || 0}
                isSelected={selectedAxis === code}
                onClick={() => setSelectedAxis(selectedAxis === code ? null : code)}
                showPathways={showPathways}
              />
            ))}
          </div>

          {/* Visualisation des voies métaboliques */}
          <div className="mb-8">
            <MetabolicPathwaysVisualization selectedAxis={selectedAxis} />
          </div>

          {/* Barre de recherche et filtres */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <Input
                placeholder="Rechercher dans les références génomiques..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-slate-900 border-slate-700"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={showPathways ? "default" : "outline"}
                size="sm"
                onClick={() => setShowPathways(!showPathways)}
                className="border-slate-700"
              >
                <GitBranch className="w-4 h-4 mr-2" />
                Voies
              </Button>
              <Button
                variant={viewMode === 'grid' ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode('grid')}
                className="border-slate-700"
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode('list')}
                className="border-slate-700"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Liste des références */}
          <Card className="bg-slate-900/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-lg text-slate-100 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-slate-400" />
                  Références
                  {selectedAxis && (
                    <Badge 
                      variant="outline"
                      style={{ 
                        borderColor: GENOMICS_AXES[selectedAxis as keyof typeof GENOMICS_AXES]?.color,
                        color: GENOMICS_AXES[selectedAxis as keyof typeof GENOMICS_AXES]?.color
                      }}
                    >
                      {selectedAxis}
                    </Badge>
                  )}
                </span>
                <span className="text-sm text-slate-400 font-normal">
                  {filteredReferences.length} résultats
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
                  {[1, 2, 3, 4, 5, 6].map(i => (
                    <Skeleton key={i} className="h-32 bg-slate-800" />
                  ))}
                </div>
              ) : filteredReferences.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <Dna className="w-12 h-12 mx-auto mb-4 opacity-30" />
                  <p className="text-lg font-medium">Aucune référence trouvée</p>
                  <p className="text-sm mt-1">
                    Essayez de modifier vos critères de recherche ou de sélectionner un autre axe.
                  </p>
                </div>
              ) : (
                <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
                  {filteredReferences.map(ref => (
                    <GenomicsReferenceCard
                      key={ref.id}
                      reference={ref}
                      onClick={() => setSelectedReference(ref)}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Liens vers d'autres sections */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/heritage-conservation">
              <Card className="bg-slate-900/50 border-slate-700 hover:border-slate-600 transition-colors cursor-pointer group">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-amber-900/30">
                      <Leaf className="w-6 h-6 text-amber-500" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-slate-200 group-hover:text-slate-100">
                        Heritage & Conservation
                      </h3>
                      <p className="text-sm text-slate-400">
                        Références sur le patrimoine olfactif et la durabilité
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-slate-300" />
                  </div>
                </CardContent>
              </Card>
            </Link>
            
            <Link href="/h2-linking">
              <Card className="bg-slate-900/50 border-slate-700 hover:border-slate-600 transition-colors cursor-pointer group">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-green-900/30">
                      <Network className="w-6 h-6 text-green-500" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-slate-200 group-hover:text-slate-100">
                        Liaisons H2 — Plantes Menacées
                      </h3>
                      <p className="text-sm text-slate-400">
                        Connecter les références aux échantillons botaniques
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-slate-300" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </main>

      <Footer />

      {/* Dialog de détail */}
      <ReferenceDetailDialog
        reference={selectedReference}
        open={!!selectedReference}
        onClose={() => setSelectedReference(null)}
      />
    </div>
  );
}
