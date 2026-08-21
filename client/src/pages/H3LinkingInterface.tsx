import { useState, useMemo } from 'react';
import { trpc } from '@/lib/trpc';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Slider } from '@/components/ui/slider';
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Link } from 'wouter';
import { useToast } from '@/hooks/use-toast';
import { 
  Search, 
  BookOpen, 
  ExternalLink, 
  Scroll, 
  Link2,
  Plus,
  Trash2,
  Check,
  X,
  ArrowRight,
  Filter,
  AlertTriangle,
  MapPin,
  Calendar,
  ChevronRight,
  Loader2,
  Globe2,
  History,
  Sparkles
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
  [key: string]: any;
};

type OlfactoryTradition = {
  id: number;
  name: string;
  region: string | null;
  symbolicMaterials: string | null;
  longDescription: string | null;
  temporality: string | null;
  bibliographicReferences: string | null;
  [key: string]: any;
};

type EntityLink = {
  id: number;
  referenceId: number;
  entityType: string;
  entityId: number;
  linkType: string;
  relevanceScore: number | null;
  notes: string | null;
  context: string | null;
};

// Constantes
const LINK_TYPES = [
  { value: 'documents', label: 'Documente', description: 'La référence documente cette tradition' },
  { value: 'mentions', label: 'Mentionne', description: 'La référence mentionne cette tradition' },
  { value: 'analyzes', label: 'Analyse', description: 'La référence analyse cette tradition' },
  { value: 'reconstructs', label: 'Reconstruit', description: 'La référence traite de la reconstruction' },
  { value: 'sources', label: 'Source', description: 'La référence est une source primaire' },
  { value: 'validates', label: 'Valide', description: 'La référence valide les données' },
  { value: 'contextualizes', label: 'Contextualise', description: 'La référence contextualise cette tradition' },
];

const RECONSTRUCTION_STATUS_COLORS: Record<string, string> = {
  documented: 'bg-blue-900/30 text-blue-400 border-blue-600',
  partial: 'bg-amber-900/30 text-amber-400 border-amber-600',
  complete: 'bg-green-900/30 text-green-400 border-green-600',
  probable: 'bg-purple-900/30 text-purple-400 border-purple-600',
  hypothetical: 'bg-slate-700/30 text-slate-400 border-slate-600',
};

// Composant pour afficher une référence H3
function H3ReferenceCard({ 
  reference, 
  isSelected, 
  onClick,
  linkedCount
}: { 
  reference: Reference; 
  isSelected: boolean;
  onClick: () => void;
  linkedCount: number;
}) {
  return (
    <Card 
      className={`cursor-pointer transition-all duration-200 ${
        isSelected 
          ? 'ring-2 ring-amber-500 bg-slate-800/80' 
          : 'bg-slate-900/50 hover:bg-slate-800/50'
      } border-slate-700`}
      onClick={onClick}
    >
      <CardContent className="pt-4 pb-3">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-amber-900/30 shrink-0">
            <Scroll className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="outline" className="font-mono text-xs border-amber-600 text-amber-500">
                H3
              </Badge>
              {reference.year && (
                <span className="text-xs text-slate-500">{reference.year}</span>
              )}
              {linkedCount > 0 && (
                <Badge variant="secondary" className="text-xs bg-amber-900/50 text-amber-400">
                  <Link2 className="w-3 h-3 mr-1" />
                  {linkedCount}
                </Badge>
              )}
            </div>
            <h3 className="text-sm font-medium text-slate-200 line-clamp-2">
              {reference.title}
            </h3>
            {reference.authors && (
              <p className="text-xs text-slate-400 mt-1 line-clamp-1">
                {reference.authors}
              </p>
            )}
          </div>
          {isSelected && (
            <Check className="w-5 h-5 text-amber-500 shrink-0" />
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Composant pour afficher une tradition olfactive (civilisation)
function TraditionCard({ 
  tradition, 
  isLinked, 
  onLink,
  onUnlink,
  isLoading
}: { 
  tradition: OlfactoryTradition; 
  isLinked: boolean;
  onLink: () => void;
  onUnlink: () => void;
  isLoading: boolean;
}) {
  const temporalityColors: Record<string, string> = {
    archaic: 'bg-amber-900/30 text-amber-400 border-amber-600',
    classical: 'bg-blue-900/30 text-blue-400 border-blue-600',
    medieval: 'bg-purple-900/30 text-purple-400 border-purple-600',
    modern: 'bg-green-900/30 text-green-400 border-green-600',
    contemporary: 'bg-slate-700/30 text-slate-400 border-slate-600',
  };

  const temporalityColor = tradition.temporality 
    ? temporalityColors[tradition.temporality] || 'border-slate-600'
    : 'border-slate-600';

  const temporalityLabels: Record<string, string> = {
    archaic: 'Archaïque',
    classical: 'Classique',
    medieval: 'Médiéval',
    modern: 'Moderne',
    contemporary: 'Contemporain',
  };

  return (
    <Card className={`transition-all duration-200 ${
      isLinked 
        ? 'border-amber-600 bg-amber-900/10' 
        : 'border-slate-700 bg-slate-900/50 hover:bg-slate-800/50'
    }`}>
      <CardContent className="pt-4 pb-3">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-slate-800 shrink-0">
            <History className="w-4 h-4 text-slate-400" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <Badge variant="outline" className="font-mono text-xs">
                #{tradition.id}
              </Badge>
              {tradition.temporality && (
                <Badge 
                  variant="outline" 
                  className={`text-xs ${temporalityColor}`}
                >
                  {temporalityLabels[tradition.temporality] || tradition.temporality}
                </Badge>
              )}
            </div>
            <h3 className="text-sm font-medium text-slate-200">
              {tradition.name}
            </h3>
            <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
              {tradition.region && (
                <span className="flex items-center gap-1">
                  <Globe2 className="w-3 h-3" />
                  {tradition.region}
                </span>
              )}
            </div>
            {tradition.symbolicMaterials && (
              <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                {tradition.symbolicMaterials}
              </p>
            )}
          </div>
          <Button
            size="sm"
            variant={isLinked ? "destructive" : "default"}
            onClick={(e) => {
              e.stopPropagation();
              isLinked ? onUnlink() : onLink();
            }}
            disabled={isLoading}
            className="shrink-0"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : isLinked ? (
              <>
                <X className="w-4 h-4 mr-1" />
                Délier
              </>
            ) : (
              <>
                <Link2 className="w-4 h-4 mr-1" />
                Lier
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Dialog pour configurer la liaison
function LinkConfigDialog({
  open,
  onClose,
  onConfirm,
  reference,
  tradition,
  isLoading
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: (config: { linkType: string; relevanceScore: number; notes: string; context: string }) => void;
  reference: Reference | null;
  tradition: OlfactoryTradition | null;
  isLoading: boolean;
}) {
  const [linkType, setLinkType] = useState('documents');
  const [relevanceScore, setRelevanceScore] = useState([70]);
  const [notes, setNotes] = useState('');
  const [context, setContext] = useState('');

  if (!reference || !tradition) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg bg-slate-900 border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-slate-100">Configurer la liaison H3</DialogTitle>
          <DialogDescription className="text-slate-400">
            Définissez les paramètres de la liaison entre la référence et la tradition olfactive.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {/* Résumé */}
          <div className="flex items-center gap-2 p-3 bg-slate-800/50 rounded-lg">
            <div className="flex-1">
              <p className="text-xs text-slate-400">Référence</p>
              <p className="text-sm text-slate-200 line-clamp-1">{reference.title}</p>
            </div>
            <ArrowRight className="w-4 h-4 text-amber-500 shrink-0" />
            <div className="flex-1">
              <p className="text-xs text-slate-400">Tradition</p>
              <p className="text-sm text-slate-200">{tradition.name}</p>
            </div>
          </div>

          {/* Type de liaison */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Type de liaison</label>
            <Select value={linkType} onValueChange={setLinkType}>
              <SelectTrigger className="bg-slate-800 border-slate-700">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                {LINK_TYPES.map(type => (
                  <SelectItem key={type.value} value={type.value}>
                    <div>
                      <span className="font-medium">{type.label}</span>
                      <span className="text-xs text-slate-400 ml-2">{type.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Score de pertinence */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-sm font-medium text-slate-300">Score de pertinence</label>
              <span className="text-sm text-amber-400">{relevanceScore[0]}%</span>
            </div>
            <Slider
              value={relevanceScore}
              onValueChange={setRelevanceScore}
              max={100}
              step={5}
              className="py-2"
            />
            <p className="text-xs text-slate-500">
              Indique la pertinence de la liaison (0-100%)
            </p>
          </div>

          {/* Contexte */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Contexte (extrait pertinent)</label>
            <Textarea
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="Extrait de la référence qui justifie cette liaison..."
              className="bg-slate-800 border-slate-700 min-h-[80px]"
            />
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Notes additionnelles</label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Notes sur cette liaison..."
              className="bg-slate-800 border-slate-700"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Annuler
          </Button>
          <Button 
            onClick={() => onConfirm({ linkType, relevanceScore: relevanceScore[0], notes, context })}
            disabled={isLoading}
            className="bg-amber-600 hover:bg-amber-700"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <Link2 className="w-4 h-4 mr-2" />
            )}
            Créer la liaison
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function H3LinkingInterface() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [traditionSearch, setTraditionSearch] = useState('');
  const [selectedReference, setSelectedReference] = useState<Reference | null>(null);
  const [selectedTradition, setSelectedTradition] = useState<OlfactoryTradition | null>(null);
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [linkingTraditionId, setLinkingTraditionId] = useState<number | null>(null);

  // Fetch all v3 references
  const { data: allReferences, isLoading: loadingRefs } = trpc.v3References.list.useQuery();

  // Fetch all olfactory traditions (civilisations)
  const { data: traditions, isLoading: loadingTraditions } = trpc.civilisations.list.useQuery();

  // Fetch existing links for the selected reference
  const { data: existingLinks, refetch: refetchLinks } = trpc.referenceEntityLinks.getForReference.useQuery(
    selectedReference?.id ?? 0,
    { enabled: !!selectedReference }
  );

  // Create link mutation
  const createLinkMutation = trpc.referenceEntityLinks.create.useMutation({
    onSuccess: () => {
      toast({
        title: "Liaison créée",
        description: "La référence a été liée à la tradition olfactive.",
      });
      refetchLinks();
      setShowLinkDialog(false);
      setSelectedTradition(null);
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Delete link mutation
  const deleteLinkMutation = trpc.referenceEntityLinks.delete.useMutation({
    onSuccess: () => {
      toast({
        title: "Liaison supprimée",
        description: "La liaison a été supprimée.",
      });
      refetchLinks();
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Filter only H3 references
  const h3References = useMemo(() => {
    if (!allReferences) return [];
    return (allReferences as Reference[]).filter(ref => 
      ref.axisPrimaryCode === 'H3'
    );
  }, [allReferences]);

  // Filter references by search
  const filteredReferences = useMemo(() => {
    if (!searchQuery) return h3References;
    const query = searchQuery.toLowerCase();
    return h3References.filter(ref =>
      ref.title?.toLowerCase().includes(query) ||
      ref.authors?.toLowerCase().includes(query) ||
      ref.notes?.toLowerCase().includes(query)
    );
  }, [h3References, searchQuery]);

  // Filter traditions by search
  const filteredTraditions = useMemo(() => {
    if (!traditions) return [];
    if (!traditionSearch) return traditions as OlfactoryTradition[];
    const query = traditionSearch.toLowerCase();
    return (traditions as OlfactoryTradition[]).filter(t =>
      t.name?.toLowerCase().includes(query) ||
      t.region?.toLowerCase().includes(query) ||
      t.temporality?.toLowerCase().includes(query) ||
      t.symbolicMaterials?.toLowerCase().includes(query)
    );
  }, [traditions, traditionSearch]);

  // Get link counts per reference
  const linkCountsByRef = useMemo(() => {
    const counts: Record<number, number> = {};
    if (existingLinks) {
      existingLinks?.forEach((item: any) => {
        const refId = item.referenceId;
        if (refId) {
          counts[refId] = (counts[refId] || 0) + 1;
        }
      });
    }
    return counts;
  }, [existingLinks]);

  // Check if a tradition is linked to the selected reference
  const isLinked = (traditionId: number): boolean => {
    if (!selectedReference || !existingLinks) return false;
    return existingLinks?.some((item: any) => 
      item.referenceId === selectedReference.id && 
      item.entityId === traditionId &&
      item.entityType === 'tradition'
    );
  };

  // Get link ID for a tradition
  const getLinkId = (traditionId: number): number | null => {
    if (!selectedReference || !existingLinks) return null;
    const link = existingLinks?.find((item: any) => 
      item.referenceId === selectedReference.id && 
      item.entityId === traditionId &&
      item.entityType === 'tradition'
    );
    return link?.id || null;
  };

  // Handle link creation
  const handleLink = (tradition: OlfactoryTradition) => {
    setSelectedTradition(tradition);
    setShowLinkDialog(true);
  };

  // Handle link deletion
  const handleUnlink = (traditionId: number) => {
    const linkId = getLinkId(traditionId);
    if (linkId) {
      setLinkingTraditionId(traditionId);
      deleteLinkMutation.mutate(linkId, {
        onSettled: () => setLinkingTraditionId(null),
      });
    }
  };

  // Confirm link creation
  const confirmLink = (config: { linkType: string; relevanceScore: number; notes: string; context: string }) => {
    if (!selectedReference || !selectedTradition) return;
    
    createLinkMutation.mutate({
      referenceId: selectedReference.id,
      entityType: 'tradition',
      entityId: selectedTradition.id,
      linkType: config.linkType as any,
      relevanceScore: config.relevanceScore,
      notes: config.notes || undefined,
      context: config.context || undefined,
    });
  };

  // Stats
  const stats = useMemo(() => {
    const totalRefs = h3References.length;
    const linkedRefs = Object.keys(linkCountsByRef).length;
    const totalLinks = existingLinks?.length || 0;
    const totalTraditions = traditions?.length || 0;
    
    return { totalRefs, linkedRefs, totalLinks, totalTraditions };
  }, [h3References, linkCountsByRef, existingLinks, traditions]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <Header />
      
      <main className="container py-8">
        <Breadcrumbs 
          customItems={[
            { label: "Accueil", path: "/" },
            { label: "Heritage & Conservation", path: "/heritage-conservation" },
            { label: "Liaisons H3 — Traditions" }
          ]}
        />
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30">
              <Scroll className="w-8 h-8 text-amber-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-100">
                Liaisons H3 — Traditions Olfactives
              </h1>
              <p className="text-slate-400">
                Connecter les références sur les parfums antiques aux traditions olfactives documentées
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-slate-900/50 border-slate-700">
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <BookOpen className="w-5 h-5 text-amber-500" />
                <div>
                  <p className="text-2xl font-bold text-slate-100">{stats.totalRefs}</p>
                  <p className="text-xs text-slate-400">Références H3</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-900/50 border-slate-700">
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <Link2 className="w-5 h-5 text-green-500" />
                <div>
                  <p className="text-2xl font-bold text-slate-100">{stats.linkedRefs}</p>
                  <p className="text-xs text-slate-400">Références liées</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-900/50 border-slate-700">
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-purple-500" />
                <div>
                  <p className="text-2xl font-bold text-slate-100">{stats.totalLinks}</p>
                  <p className="text-xs text-slate-400">Liaisons créées</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-900/50 border-slate-700">
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <History className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold text-slate-100">{stats.totalTraditions}</p>
                  <p className="text-xs text-slate-400">Traditions</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Panel: H3 References */}
          <div>
            <Card className="bg-slate-900/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Scroll className="w-5 h-5 text-amber-500" />
                  Références H3 — Parfums Antiques
                </CardTitle>
                <CardDescription>
                  Sélectionnez une référence pour créer des liaisons
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Search */}
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    placeholder="Rechercher par titre, auteur..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-slate-800 border-slate-700"
                  />
                </div>

                {/* References List */}
                <ScrollArea className="h-[500px]">
                  <div className="space-y-2 pr-4">
                    {loadingRefs ? (
                      [...Array(5)].map((_, i) => (
                        <Skeleton key={i} className="h-20 w-full" />
                      ))
                    ) : filteredReferences.length === 0 ? (
                      <div className="text-center py-8">
                        <BookOpen className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                        <p className="text-sm text-slate-400">Aucune référence H3 trouvée</p>
                      </div>
                    ) : (
                      filteredReferences.map(ref => (
                        <H3ReferenceCard
                          key={ref.id}
                          reference={ref}
                          isSelected={selectedReference?.id === ref.id}
                          onClick={() => setSelectedReference(ref)}
                          linkedCount={linkCountsByRef[ref.id] || 0}
                        />
                      ))
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Right Panel: Traditions */}
          <div>
            <Card className="bg-slate-900/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <History className="w-5 h-5 text-blue-500" />
                  Traditions Olfactives
                </CardTitle>
                <CardDescription>
                  {selectedReference 
                    ? `Liez la référence sélectionnée aux traditions`
                    : `Sélectionnez d'abord une référence H3`
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Search */}
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    placeholder="Rechercher par nom, région, période..."
                    value={traditionSearch}
                    onChange={(e) => setTraditionSearch(e.target.value)}
                    className="pl-10 bg-slate-800 border-slate-700"
                    disabled={!selectedReference}
                  />
                </div>

                {/* Traditions List */}
                <ScrollArea className="h-[500px]">
                  <div className="space-y-2 pr-4">
                    {!selectedReference ? (
                      <div className="text-center py-12">
                        <AlertTriangle className="w-10 h-10 text-amber-500/50 mx-auto mb-2" />
                        <p className="text-sm text-slate-400">
                          Sélectionnez une référence H3 pour voir les traditions à lier
                        </p>
                      </div>
                    ) : loadingTraditions ? (
                      [...Array(5)].map((_, i) => (
                        <Skeleton key={i} className="h-20 w-full" />
                      ))
                    ) : filteredTraditions.length === 0 ? (
                      <div className="text-center py-8">
                        <History className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                        <p className="text-sm text-slate-400">Aucune tradition trouvée</p>
                        <Link href="/civilisations">
                          <Button variant="link" size="sm" className="mt-2">
                            Créer une tradition
                          </Button>
                        </Link>
                      </div>
                    ) : (
                      filteredTraditions.map(tradition => (
                        <TraditionCard
                          key={tradition.id}
                          tradition={tradition}
                          isLinked={isLinked(tradition.id)}
                          onLink={() => handleLink(tradition)}
                          onUnlink={() => handleUnlink(tradition.id)}
                          isLoading={
                            linkingTraditionId === tradition.id || 
                            (createLinkMutation.isPending && selectedTradition?.id === tradition.id)
                          }
                        />
                      ))
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="/heritage-conservation">
            <Card className="bg-slate-900/50 border-slate-700 hover:border-amber-600 transition-colors cursor-pointer group">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-amber-900/30">
                    <BookOpen className="w-6 h-6 text-amber-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-slate-200 group-hover:text-slate-100">
                      Heritage & Conservation
                    </h3>
                    <p className="text-sm text-slate-400">
                      Retour à la vue d'ensemble des références H1/H2/H3
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-slate-300" />
                </div>
              </CardContent>
            </Card>
          </Link>
          
          <Link href="/h2-linking">
            <Card className="bg-slate-900/50 border-slate-700 hover:border-green-600 transition-colors cursor-pointer group">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-green-900/30">
                    <Link2 className="w-6 h-6 text-green-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-slate-200 group-hover:text-slate-100">
                      Liaisons H2 — Plantes Menacées
                    </h3>
                    <p className="text-sm text-slate-400">
                      Connecter les références durabilité aux échantillons botaniques
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-slate-300" />
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Link Configuration Dialog */}
        <LinkConfigDialog
          open={showLinkDialog}
          onClose={() => {
            setShowLinkDialog(false);
            setSelectedTradition(null);
          }}
          onConfirm={confirmLink}
          reference={selectedReference}
          tradition={selectedTradition}
          isLoading={createLinkMutation.isPending}
        />
      </main>
      
      <Footer />
    </div>
  );
}
