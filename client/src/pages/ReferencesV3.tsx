import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Search, 
  BookOpen, 
  ExternalLink, 
  Tag, 
  Calendar,
  Network,
  List,
  Grid,
  Filter,
  FileText,
  Database,
  Beaker,
  Leaf,
  Dna,
  Loader2,
  Link2,
  AlertCircle
} from 'lucide-react';
import { AxisForceGraph } from '@/components/AxisForceGraph';
import { Textarea } from '@/components/ui/textarea';

// Types - utiliser any pour éviter les conflits de typage avec tRPC
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

type ThematicAxis = {
  id: number;
  axisCode: string;
  name: string;
  description: string | null;
  metaAxis: string;
  color: string | null;
  [key: string]: any;
};

// Couleurs par méta-axe
const META_AXIS_COLORS: Record<string, string> = {
  meta_a: '#F59E0B',
  meta_b: '#EC4899',
  meta_c: '#06B6D4',
  other: '#22C55E',
};

const META_AXIS_LABELS: Record<string, string> = {
  meta_a: 'Olfactory Heritage',
  meta_b: 'Olfactory Arts',
  meta_c: 'Digital Olfaction',
  other: 'Génomique',
};

// Icônes par type de référence
const TYPE_ICONS: Record<string, React.ReactNode> = {
  article: <FileText className="w-4 h-4" />,
  book: <BookOpen className="w-4 h-4" />,
  website: <Database className="w-4 h-4" />,
  thesis: <Beaker className="w-4 h-4" />,
  chapter: <BookOpen className="w-4 h-4" />,
};

// Icônes par pack
const PACK_ICONS: Record<string, React.ReactNode> = {
  v3: <Leaf className="w-4 h-4" />,
  v4: <Dna className="w-4 h-4" />,
};

export default function ReferencesV3() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAxis, setSelectedAxis] = useState<string>('all');
  const [selectedPack, setSelectedPack] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'list' | 'grid' | 'graph'>('list');
  const [selectedReference, setSelectedReference] = useState<Reference | null>(null);
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [selectedMoleculeId, setSelectedMoleculeId] = useState<number | null>(null);
  const [selectedLinkType, setSelectedLinkType] = useState<string>('documents');
  const [linkNotes, setLinkNotes] = useState('');
  const [relevanceScore, setRelevanceScore] = useState(50);
  const [isLinking, setIsLinking] = useState(false);
  const [linkError, setLinkError] = useState<string | null>(null);
  const [linkSuccess, setLinkSuccess] = useState(false);

  // Fetch data
  const { data: references, isLoading: loadingRefs } = trpc.v3References.getAll.useQuery();
  const { data: axes, isLoading: loadingAxes } = trpc.thematicAxes.getAll.useQuery();
  const { data: graphData, isLoading: loadingGraph } = trpc.axisGraph.getData.useQuery();
  const { data: molecules } = trpc.molecules.getAll.useQuery();
  const createLinkMutation = trpc.referenceEntityLinks.create.useMutation();

  // Filter references
  const filteredReferences = (references as any[] | undefined)?.filter((ref: any) => {
    const matchesSearch = searchQuery === '' || 
      ref.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ref.authors?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ref.entryKey?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesAxis = selectedAxis === 'all' || ref.axisPrimaryCode === selectedAxis;
    const matchesPack = selectedPack === 'all' || ref.packVersion === selectedPack;
    const matchesType = selectedType === 'all' || ref.entryType === selectedType;
    
    return matchesSearch && matchesAxis && matchesPack && matchesType;
  }) || [];

  // Stats
  const stats = {
    total: references?.length || 0,
    v3: (references as any[] | undefined)?.filter((r: any) => r.packVersion === 'v3').length || 0,
    v4: (references as any[] | undefined)?.filter((r: any) => r.packVersion === 'v4').length || 0,
    axes: axes?.length || 0,
  };

  // Parse tags
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

  // Get axis info
  const getAxisInfo = (code: string | null) => {
    if (!code || !axes) return null;
    return axes.find((a: ThematicAxis) => a.axisCode === code);
  };

  // Handle node click in graph
  const handleNodeClick = (node: any) => {
    setSelectedAxis(node.code);
    setViewMode('list');
  };

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-100 mb-2">
          Références Bibliographiques
        </h1>
        <p className="text-slate-400">
          Base de données des références scientifiques PERFUMUM — {stats.total} entrées
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card className="bg-slate-900/50 border-slate-700">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-indigo-500/20">
                <BookOpen className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-100">{stats.total}</p>
                <p className="text-sm text-slate-400">Références</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-700">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/20">
                <Leaf className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-100">{stats.v3}</p>
                <p className="text-sm text-slate-400">Pack v3</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-700">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-cyan-500/20">
                <Dna className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-100">{stats.v4}</p>
                <p className="text-sm text-slate-400">Pack v4</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-700">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-500/20">
                <Network className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-100">{stats.axes}</p>
                <p className="text-sm text-slate-400">Axes thématiques</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters & View Toggle */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Rechercher par titre, auteur, clé..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-slate-900/50 border-slate-700"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          <Select value={selectedAxis} onValueChange={setSelectedAxis}>
            <SelectTrigger className="w-[140px] bg-slate-900/50 border-slate-700">
              <SelectValue placeholder="Axe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les axes</SelectItem>
              {axes?.map((axis: ThematicAxis) => (
                <SelectItem key={axis.axisCode} value={axis.axisCode}>
                  {axis.axisCode}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedPack} onValueChange={setSelectedPack}>
            <SelectTrigger className="w-[120px] bg-slate-900/50 border-slate-700">
              <SelectValue placeholder="Pack" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous</SelectItem>
              <SelectItem value="v3">Pack v3</SelectItem>
              <SelectItem value="v4">Pack v4</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-[130px] bg-slate-900/50 border-slate-700">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous types</SelectItem>
              <SelectItem value="article">Article</SelectItem>
              <SelectItem value="book">Livre</SelectItem>
              <SelectItem value="website">Site web</SelectItem>
              <SelectItem value="thesis">Thèse</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* View Toggle */}
        <div className="flex gap-1 bg-slate-900/50 rounded-lg p-1 border border-slate-700">
          <Button
            variant={viewMode === 'list' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <List className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <Grid className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === 'graph' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('graph')}
          >
            <Network className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Results count */}
      <p className="text-sm text-slate-400 mb-4">
        {filteredReferences.length} référence{filteredReferences.length > 1 ? 's' : ''} trouvée{filteredReferences.length > 1 ? 's' : ''}
      </p>

      {/* Content */}
      {loadingRefs || loadingAxes ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      ) : viewMode === 'graph' ? (
        /* Graph View */
        <Card className="bg-slate-900/50 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Network className="w-5 h-5 text-indigo-400" />
              Graphe des Axes Thématiques
            </CardTitle>
            <CardDescription>
              Cliquez sur un nœud pour filtrer les références par axe
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[600px]">
            {loadingGraph ? (
              <Skeleton className="w-full h-full" />
            ) : graphData ? (
              <AxisForceGraph
                nodes={graphData.nodes.map((n: any) => ({ ...n, color: n.color || META_AXIS_COLORS[n.metaAxis] || '#6366f1' }))}
                links={graphData.links as any}
                onNodeClick={handleNodeClick}
              />
            ) : (
              <p className="text-slate-400">Aucune donnée de graphe disponible</p>
            )}
          </CardContent>
        </Card>
      ) : viewMode === 'grid' ? (
        /* Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredReferences.map((ref: Reference) => {
            const axisInfo = getAxisInfo(ref.axisPrimaryCode);
            const tags = parseTags(ref.tags);
            
            return (
              <Card 
                key={ref.id} 
                className="bg-slate-900/50 border-slate-700 hover:border-slate-600 transition-colors cursor-pointer"
                onClick={() => setSelectedReference(ref)}
              >
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="p-2 rounded-lg bg-slate-800">
                      {TYPE_ICONS[ref.entryType] || <FileText className="w-4 h-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-slate-100 line-clamp-2 text-sm">
                        {ref.title}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1 truncate">
                        {ref.authors}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {ref.axisPrimaryCode && (
                      <Badge 
                        variant="outline" 
                        className="text-xs"
                        style={{ 
                          borderColor: axisInfo?.color || META_AXIS_COLORS[axisInfo?.metaAxis || 'other'],
                          color: axisInfo?.color || META_AXIS_COLORS[axisInfo?.metaAxis || 'other']
                        }}
                      >
                        {ref.axisPrimaryCode}
                      </Badge>
                    )}
                    {ref.packVersion && (
                      <Badge variant="secondary" className="text-xs">
                        {PACK_ICONS[ref.packVersion]} {ref.packVersion}
                      </Badge>
                    )}
                    {ref.year && (
                      <Badge variant="outline" className="text-xs text-slate-400">
                        {ref.year}
                      </Badge>
                    )}
                  </div>

                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {tags.slice(0, 3).map((tag, i) => (
                        <span key={i} className="text-xs text-slate-500 bg-slate-800 px-2 py-0.5 rounded">
                          {tag}
                        </span>
                      ))}
                      {tags.length > 3 && (
                        <span className="text-xs text-slate-500">+{tags.length - 3}</span>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        /* List View */
        <div className="space-y-3">
          {filteredReferences.map((ref: Reference) => {
            const axisInfo = getAxisInfo(ref.axisPrimaryCode);
            const tags = parseTags(ref.tags);
            
            return (
              <Card 
                key={ref.id} 
                className="bg-slate-900/50 border-slate-700 hover:border-slate-600 transition-colors cursor-pointer"
                onClick={() => setSelectedReference(ref)}
              >
                <CardContent className="py-4">
                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-lg bg-slate-800 shrink-0">
                      {TYPE_ICONS[ref.entryType] || <FileText className="w-4 h-4" />}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-medium text-slate-100 mb-1">
                            {ref.title}
                          </h3>
                          <p className="text-sm text-slate-400">
                            {ref.authors}
                            {ref.year && <span className="ml-2">({ref.year})</span>}
                            {ref.containerTitle && <span className="ml-2">— {ref.containerTitle}</span>}
                          </p>
                        </div>
                        
                        <div className="flex gap-2 shrink-0">
                          {ref.axisPrimaryCode && (
                            <Badge 
                              variant="outline"
                              style={{ 
                                borderColor: axisInfo?.color || META_AXIS_COLORS[axisInfo?.metaAxis || 'other'],
                                color: axisInfo?.color || META_AXIS_COLORS[axisInfo?.metaAxis || 'other']
                              }}
                            >
                              {ref.axisPrimaryCode}
                            </Badge>
                          )}
                          {ref.packVersion && (
                            <Badge variant="secondary" className="flex items-center gap-1">
                              {PACK_ICONS[ref.packVersion]} {ref.packVersion}
                            </Badge>
                          )}
                        </div>
                      </div>

                      {ref.notes && (
                        <p className="text-sm text-slate-500 mt-2 line-clamp-2">
                          {ref.notes}
                        </p>
                      )}

                      {tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {tags.map((tag, i) => (
                            <span key={i} className="text-xs text-slate-500 bg-slate-800 px-2 py-0.5 rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Reference Detail Dialog */}
      <Dialog open={!!selectedReference} onOpenChange={() => setSelectedReference(null)}>
        <DialogContent className="max-w-2xl bg-slate-900 border-slate-700">
          {selectedReference && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl text-slate-100">
                  {selectedReference.title}
                </DialogTitle>
                <DialogDescription className="text-slate-400">
                  {selectedReference.authors}
                  {selectedReference.year && ` (${selectedReference.year})`}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 mt-4">
                {/* Metadata */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Type</p>
                    <p className="text-slate-200 capitalize">{selectedReference.entryType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Clé</p>
                    <p className="text-slate-200 font-mono text-sm">{selectedReference.entryKey}</p>
                  </div>
                  {selectedReference.containerTitle && (
                    <div>
                      <p className="text-sm text-slate-500 mb-1">Publication</p>
                      <p className="text-slate-200">{selectedReference.containerTitle}</p>
                    </div>
                  )}
                  {selectedReference.doi && (
                    <div>
                      <p className="text-sm text-slate-500 mb-1">DOI</p>
                      <a 
                        href={`https://doi.org/${selectedReference.doi}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-400 hover:text-indigo-300 text-sm"
                      >
                        {selectedReference.doi}
                      </a>
                    </div>
                  )}
                </div>

                {/* Axis */}
                {selectedReference.axisPrimaryCode && (
                  <div>
                    <p className="text-sm text-slate-500 mb-2">Axe thématique</p>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant="outline"
                        style={{ 
                          borderColor: getAxisInfo(selectedReference.axisPrimaryCode)?.color || '#6366f1',
                          color: getAxisInfo(selectedReference.axisPrimaryCode)?.color || '#6366f1'
                        }}
                      >
                        {selectedReference.axisPrimaryCode}
                      </Badge>
                      <span className="text-slate-300">
                        {getAxisInfo(selectedReference.axisPrimaryCode)?.name}
                      </span>
                    </div>
                  </div>
                )}

                {/* Notes */}
                {selectedReference.notes && (
                  <div>
                    <p className="text-sm text-slate-500 mb-2">Notes</p>
                    <p className="text-slate-300 bg-slate-800/50 p-3 rounded-lg">
                      {selectedReference.notes}
                    </p>
                  </div>
                )}

                {/* Tags */}
                {selectedReference.tags && (
                  <div>
                    <p className="text-sm text-slate-500 mb-2">Tags</p>
                    <div className="flex flex-wrap gap-2">
                      {parseTags(selectedReference.tags).map((tag, i) => (
                        <Badge key={i} variant="secondary">
                          <Tag className="w-3 h-3 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t border-slate-700">
                  {selectedReference.url && (
                    <Button asChild variant="outline">
                      <a 
                        href={selectedReference.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Ouvrir la source
                      </a>
                    </Button>
                  )}
                  {selectedReference.doi && (
                    <Button asChild variant="outline">
                      <a 
                        href={`https://doi.org/${selectedReference.doi}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        Voir sur DOI
                      </a>
                    </Button>
                  )}
                  <Button 
                    variant="default"
                    onClick={() => {
                      setShowLinkDialog(true);
                      setLinkError(null);
                      setLinkSuccess(false);
                    }}
                  >
                    <Link2 className="w-4 h-4 mr-2" />
                    Lier à une molécule
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Link to Molecule Dialog */}
      <Dialog open={showLinkDialog} onOpenChange={setShowLinkDialog}>
        <DialogContent className="max-w-2xl bg-slate-900 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-xl text-slate-100 flex items-center gap-2">
              <Link2 className="w-5 h-5" />
              Lier la reference a une molecule
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              {selectedReference?.title}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            {/* Molecule Selection */}
            <div>
              <label className="text-sm text-slate-300 mb-2 block">Molecule</label>
              <Select value={selectedMoleculeId?.toString() || ''} onValueChange={(val) => setSelectedMoleculeId(parseInt(val))}>
                <SelectTrigger className="bg-slate-800 border-slate-700">
                  <SelectValue placeholder="Selectionner une molecule..." />
                </SelectTrigger>
                <SelectContent>
                  {molecules?.map((mol: any) => (
                    <SelectItem key={mol.id} value={mol.id.toString()}>
                      {mol.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Link Type */}
            <div>
              <label className="text-sm text-slate-300 mb-2 block">Type de liaison</label>
              <Select value={selectedLinkType} onValueChange={setSelectedLinkType}>
                <SelectTrigger className="bg-slate-800 border-slate-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="documents">Documente</SelectItem>
                  <SelectItem value="mentions">Mentionne</SelectItem>
                  <SelectItem value="analyzes">Analyse</SelectItem>
                  <SelectItem value="conserves">Conserve</SelectItem>
                  <SelectItem value="reconstructs">Reconstruit</SelectItem>
                  <SelectItem value="sources">Source</SelectItem>
                  <SelectItem value="validates">Valide</SelectItem>
                  <SelectItem value="contextualizes">Contextualise</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Relevance Score */}
            <div>
              <label className="text-sm text-slate-300 mb-2 block">
                Pertinence: {relevanceScore}%
              </label>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={relevanceScore}
                onChange={(e) => setRelevanceScore(parseInt(e.target.value))}
                className="w-full"
              />
            </div>

            {/* Notes */}
            <div>
              <label className="text-sm text-slate-300 mb-2 block">Notes (optionnel)</label>
              <Textarea 
                placeholder="Ajouter des notes sur cette liaison..."
                value={linkNotes}
                onChange={(e) => setLinkNotes(e.target.value)}
                className="bg-slate-800 border-slate-700"
                rows={3}
              />
            </div>

            {/* Error Message */}
            {linkError && (
              <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-300">{linkError}</p>
              </div>
            )}

            {/* Success Message */}
            {linkSuccess && (
              <div className="p-3 bg-green-500/20 border border-green-500/50 rounded-lg">
                <p className="text-sm text-green-300">Liaison creee avec succes!</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2 pt-4 border-t border-slate-700">
              <Button 
                variant="outline"
                onClick={() => setShowLinkDialog(false)}
              >
                Annuler
              </Button>
              <Button 
                variant="default"
                onClick={async () => {
                  if (!selectedMoleculeId || !selectedReference) {
                    setLinkError('Veuillez selectionner une molecule');
                    return;
                  }
                  
                  setIsLinking(true);
                  setLinkError(null);
                  
                  try {
                    await createLinkMutation.mutateAsync({
                      referenceId: selectedReference.id,
                      entityType: 'molecule',
                      entityId: selectedMoleculeId,
                      linkType: selectedLinkType as any,
                      relevanceScore,
                      notes: linkNotes || undefined,
                    });
                    
                    setLinkSuccess(true);
                    setTimeout(() => {
                      setShowLinkDialog(false);
                      setSelectedMoleculeId(null);
                      setLinkNotes('');
                      setRelevanceScore(50);
                      setLinkSuccess(false);
                    }, 1500);
                  } catch (error: any) {
                    setLinkError(error.message || 'Erreur lors de la creation de la liaison');
                  } finally {
                    setIsLinking(false);
                  }
                }}
                disabled={isLinking || !selectedMoleculeId}
              >
                {isLinking ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creation...
                  </>
                ) : (
                  <>
                    <Link2 className="w-4 h-4 mr-2" />
                    Creer la liaison
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
