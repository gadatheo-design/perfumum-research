import { useState, useMemo } from 'react';
import { trpc } from '@/lib/trpc';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
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
  Tag, 
  Calendar,
  Network,
  List,
  Grid,
  Leaf,
  TreeDeciduous,
  Scroll,
  Building2,
  Globe2,
  Users,
  FileText,
  ChevronRight,
  ArrowLeft,
  Link2,
  Filter,
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
  readStatus: string;
  relevanceScore: number | null;
  packVersion?: string | null;
  [key: string]: any;
};

// Définition des axes Heritage & Conservation
const HERITAGE_AXES = {
  H1: {
    code: 'H1',
    name: 'Patrimoine Olfactif & Archives',
    description: 'Documentation et préservation des parfums historiques, archives olfactives, musées du parfum',
    color: '#8B4513',
    icon: Building2,
    keywords: ['archives', 'musée', 'patrimoine', 'conservation', 'documentation', 'collection']
  },
  H2: {
    code: 'H2',
    name: 'Durabilité & Biodiversité',
    description: 'Conservation des espèces aromatiques, durabilité des filières, biodiversité olfactive, plantes menacées',
    color: '#228B22',
    icon: Leaf,
    keywords: ['durabilité', 'biodiversité', 'conservation', 'espèces', 'menacées', 'écologie']
  },
  H3: {
    code: 'H3',
    name: 'Reconstruction de Parfums Antiques',
    description: 'Reconstitution de parfums historiques, traditions olfactives antiques, archéologie des odeurs',
    color: '#DAA520',
    icon: Scroll,
    keywords: ['antique', 'reconstruction', 'historique', 'tradition', 'archéologie', 'ancien']
  }
};

// Statistiques par axe
function AxisStatsCard({ 
  axis, 
  count, 
  isSelected, 
  onClick 
}: { 
  axis: typeof HERITAGE_AXES.H1; 
  count: number; 
  isSelected: boolean;
  onClick: () => void;
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
      </CardContent>
    </Card>
  );
}

// Carte de référence
function ReferenceCard({ 
  reference, 
  onClick 
}: { 
  reference: Reference; 
  onClick: () => void;
}) {
  const axisInfo = reference.axisPrimaryCode ? HERITAGE_AXES[reference.axisPrimaryCode as keyof typeof HERITAGE_AXES] : null;
  
  const parseTags = (tagsInput: string | string[] | null): string[] => {
    if (!tagsInput) return [];
    if (Array.isArray(tagsInput)) return tagsInput;
    try {
      const parsed = JSON.parse(tagsInput);
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
                {tags.slice(0, 3).map((tag, i) => (
                  <Badge 
                    key={i} 
                    variant="secondary" 
                    className="text-xs bg-slate-800 text-slate-300"
                  >
                    {tag}
                  </Badge>
                ))}
                {tags.length > 3 && (
                  <Badge variant="secondary" className="text-xs bg-slate-800 text-slate-400">
                    +{tags.length - 3}
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
  
  const axisInfo = reference.axisPrimaryCode ? HERITAGE_AXES[reference.axisPrimaryCode as keyof typeof HERITAGE_AXES] : null;
  
  const parseTags = (tagsInput: string | string[] | null): string[] => {
    if (!tagsInput) return [];
    if (Array.isArray(tagsInput)) return tagsInput;
    try {
      const parsed = JSON.parse(tagsInput);
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
            
            {tags.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-slate-300 mb-2">Tags</h4>
                <div className="flex flex-wrap gap-1">
                  {tags.map((tag, i) => (
                    <Badge key={i} variant="secondary" className="bg-slate-800 text-slate-300">
                      <Tag className="w-3 h-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            {(reference.doi || reference.url) && (
              <div>
                <h4 className="text-sm font-medium text-slate-300 mb-2">Liens</h4>
                <div className="flex flex-wrap gap-2">
                  {reference.doi && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs"
                      onClick={() => window.open(`https://doi.org/${reference.doi}`, '_blank')}
                    >
                      <ExternalLink className="w-3 h-3 mr-1" />
                      DOI: {reference.doi}
                    </Button>
                  )}
                  {reference.url && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs"
                      onClick={() => window.open(reference.url!, '_blank')}
                    >
                      <ExternalLink className="w-3 h-3 mr-1" />
                      Lien externe
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Fermer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function HeritageConservation() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAxis, setSelectedAxis] = useState<string>('all');
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedReference, setSelectedReference] = useState<Reference | null>(null);

  // Fetch all v3 references
  const { data: allReferences, isLoading } = trpc.v3References.list.useQuery();

  // Filter only Heritage & Conservation references (H1, H2, H3)
  const heritageReferences = useMemo(() => {
    if (!allReferences) return [];
    return (allReferences as Reference[]).filter(ref => 
      ref.axisPrimaryCode && ['H1', 'H2', 'H3'].includes(ref.axisPrimaryCode)
    );
  }, [allReferences]);

  // Calculate stats per axis
  const axisStats = useMemo(() => {
    const stats: Record<string, number> = { H1: 0, H2: 0, H3: 0 };
    heritageReferences.forEach(ref => {
      if (ref.axisPrimaryCode && stats[ref.axisPrimaryCode] !== undefined) {
        stats[ref.axisPrimaryCode]++;
      }
    });
    return stats;
  }, [heritageReferences]);

  // Get unique years for filter
  const years = useMemo(() => {
    const uniqueYears = new Set<number>();
    heritageReferences.forEach(ref => {
      if (ref.year) uniqueYears.add(ref.year);
    });
    return Array.from(uniqueYears).sort((a, b) => b - a);
  }, [heritageReferences]);

  // Filter references
  const filteredReferences = useMemo(() => {
    return heritageReferences.filter(ref => {
      const matchesSearch = searchQuery === '' || 
        ref.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ref.authors?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ref.notes?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesAxis = selectedAxis === 'all' || ref.axisPrimaryCode === selectedAxis;
      const matchesYear = selectedYear === 'all' || ref.year?.toString() === selectedYear;
      
      return matchesSearch && matchesAxis && matchesYear;
    });
  }, [heritageReferences, searchQuery, selectedAxis, selectedYear]);

  // Get main authors
  const mainAuthors = useMemo(() => {
    const authorCounts: Record<string, number> = {};
    filteredReferences.forEach(ref => {
      if (ref.authors) {
        const firstAuthor = ref.authors.split(',')[0].trim();
        authorCounts[firstAuthor] = (authorCounts[firstAuthor] || 0) + 1;
      }
    });
    return Object.entries(authorCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  }, [filteredReferences]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <Header />
      
      <main className="container py-8">
        <Breadcrumbs 
          customItems={[
            { label: "Accueil", path: "/" },
            { label: "Bibliographie", path: "/bibliographie-globale" },
            { label: "Heritage & Conservation" }
          ]}
        />
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Link href="/bibliographie-globale">
              <Button variant="ghost" size="sm" className="text-slate-400 hover:text-slate-200">
                <ArrowLeft className="w-4 h-4 mr-1" />
                Retour
              </Button>
            </Link>
          </div>
          
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500/20 to-emerald-500/20 border border-amber-500/30">
              <TreeDeciduous className="w-8 h-8 text-amber-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-100">
                Heritage & Conservation
              </h1>
              <p className="text-slate-400">
                {heritageReferences.length} références sur le patrimoine olfactif et la conservation
              </p>
            </div>
          </div>
        </div>

        {/* Axis Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {Object.entries(HERITAGE_AXES).map(([code, axis]) => (
            <AxisStatsCard
              key={code}
              axis={axis}
              count={axisStats[code] || 0}
              isSelected={selectedAxis === code}
              onClick={() => setSelectedAxis(selectedAxis === code ? 'all' : code)}
            />
          ))}
        </div>

        {/* Info Banner */}
        {selectedAxis !== 'all' && (
          <Card className="mb-6 bg-slate-900/50 border-slate-700">
            <CardContent className="py-4">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium text-slate-200 mb-1">
                    {HERITAGE_AXES[selectedAxis as keyof typeof HERITAGE_AXES]?.name}
                  </h3>
                  <p className="text-sm text-slate-400">
                    {HERITAGE_AXES[selectedAxis as keyof typeof HERITAGE_AXES]?.description}
                  </p>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="shrink-0"
                  onClick={() => setSelectedAxis('all')}
                >
                  Voir tous
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Rechercher par titre, auteur, notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-slate-900/50 border-slate-700"
            />
          </div>

          {/* Year Filter */}
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-[140px] bg-slate-900/50 border-slate-700">
              <SelectValue placeholder="Année" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes années</SelectItem>
              {years.map(year => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* View Toggle */}
          <div className="flex gap-1 bg-slate-900/50 rounded-lg p-1 border border-slate-700">
            <Button
              variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Results count */}
        <p className="text-sm text-slate-400 mb-4">
          {filteredReferences.length} référence{filteredReferences.length > 1 ? 's' : ''} trouvée{filteredReferences.length > 1 ? 's' : ''}
        </p>

        {/* Content */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-40 w-full" />
            ))}
          </div>
        ) : filteredReferences.length === 0 ? (
          <Card className="bg-slate-900/50 border-slate-700">
            <CardContent className="py-12 text-center">
              <BookOpen className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-300 mb-2">
                Aucune référence trouvée
              </h3>
              <p className="text-sm text-slate-400">
                Essayez de modifier vos critères de recherche
              </p>
            </CardContent>
          </Card>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredReferences.map(ref => (
              <ReferenceCard
                key={ref.id}
                reference={ref}
                onClick={() => setSelectedReference(ref)}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredReferences.map(ref => (
              <ReferenceCard
                key={ref.id}
                reference={ref}
                onClick={() => setSelectedReference(ref)}
              />
            ))}
          </div>
        )}

        {/* Main Authors Sidebar */}
        {mainAuthors.length > 0 && (
          <Card className="mt-8 bg-slate-900/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="w-5 h-5 text-slate-400" />
                Auteurs principaux
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {mainAuthors.map(([author, count]) => (
                  <Badge 
                    key={author} 
                    variant="secondary" 
                    className="bg-slate-800 text-slate-300 cursor-pointer hover:bg-slate-700"
                    onClick={() => setSearchQuery(author)}
                  >
                    {author} ({count})
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Reference Detail Dialog */}
        <ReferenceDetailDialog
          reference={selectedReference}
          open={!!selectedReference}
          onClose={() => setSelectedReference(null)}
        />
      </main>
      
      <Footer />
    </div>
  );
}
