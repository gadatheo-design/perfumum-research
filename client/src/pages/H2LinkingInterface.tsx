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
  Leaf, 
  Link2,
  Plus,
  Trash2,
  Check,
  X,
  ArrowRight,
  Filter,
  AlertTriangle,
  TreeDeciduous,
  FileText,
  Calendar,
  ChevronRight,
  Loader2
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

type LeafEconomy = {
  id: number;
  sampleId: string;
  species: string | null;
  claimedVariety: string | null;
  category: string;
  island: string | null;
  preciseLocation: string | null;
  odorNotes: string | null;
  status: string | null;
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
  { value: 'documents', label: 'Documente', description: 'La référence documente cette plante' },
  { value: 'mentions', label: 'Mentionne', description: 'La référence mentionne cette plante' },
  { value: 'analyzes', label: 'Analyse', description: 'La référence analyse cette plante' },
  { value: 'conserves', label: 'Conservation', description: 'La référence traite de la conservation' },
  { value: 'sources', label: 'Source', description: 'La référence est une source pour cette plante' },
  { value: 'validates', label: 'Valide', description: 'La référence valide les données' },
  { value: 'contextualizes', label: 'Contextualise', description: 'La référence contextualise cette plante' },
];

// Composant pour afficher une référence H2
function H2ReferenceCard({ 
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
          ? 'ring-2 ring-green-500 bg-slate-800/80' 
          : 'bg-slate-900/50 hover:bg-slate-800/50'
      } border-slate-700`}
      onClick={onClick}
    >
      <CardContent className="pt-4 pb-3">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-green-900/30 shrink-0">
            <Leaf className="w-4 h-4 text-green-500" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="outline" className="font-mono text-xs border-green-600 text-green-500">
                H2
              </Badge>
              {reference.year && (
                <span className="text-xs text-slate-500">{reference.year}</span>
              )}
              {linkedCount > 0 && (
                <Badge variant="secondary" className="text-xs bg-green-900/50 text-green-400">
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
            <Check className="w-5 h-5 text-green-500 shrink-0" />
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Composant pour afficher une plante menacée
function LeafEconomyCard({ 
  plant, 
  isLinked, 
  onLink,
  onUnlink,
  isLoading
}: { 
  plant: LeafEconomy; 
  isLinked: boolean;
  onLink: () => void;
  onUnlink: () => void;
  isLoading: boolean;
}) {
  const categoryColors: Record<string, string> = {
    aromatique: 'bg-purple-900/30 text-purple-400 border-purple-600',
    tabac: 'bg-amber-900/30 text-amber-400 border-amber-600',
    cannabis: 'bg-green-900/30 text-green-400 border-green-600',
  };

  return (
    <Card className={`transition-all duration-200 ${
      isLinked 
        ? 'border-green-600 bg-green-900/10' 
        : 'border-slate-700 bg-slate-900/50 hover:bg-slate-800/50'
    }`}>
      <CardContent className="pt-4 pb-3">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-slate-800 shrink-0">
            <TreeDeciduous className="w-4 h-4 text-slate-400" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="outline" className="font-mono text-xs">
                {plant.sampleId}
              </Badge>
              <Badge 
                variant="outline" 
                className={`text-xs ${categoryColors[plant.category] || 'border-slate-600'}`}
              >
                {plant.category}
              </Badge>
            </div>
            <h3 className="text-sm font-medium text-slate-200">
              {plant.species || plant.claimedVariety || 'Espèce non identifiée'}
            </h3>
            {plant.island && (
              <p className="text-xs text-slate-400 mt-1">
                📍 {plant.island === 'san_andres' ? 'San Andrés' : plant.island}
                {plant.preciseLocation && ` — ${plant.preciseLocation}`}
              </p>
            )}
            {plant.odorNotes && (
              <p className="text-xs text-slate-500 mt-1 line-clamp-1 italic">
                {plant.odorNotes}
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
  plant,
  isLoading
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: (config: { linkType: string; relevanceScore: number; notes: string; context: string }) => void;
  reference: Reference | null;
  plant: LeafEconomy | null;
  isLoading: boolean;
}) {
  const [linkType, setLinkType] = useState('documents');
  const [relevanceScore, setRelevanceScore] = useState([70]);
  const [notes, setNotes] = useState('');
  const [context, setContext] = useState('');

  if (!reference || !plant) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg bg-slate-900 border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-slate-100">Configurer la liaison</DialogTitle>
          <DialogDescription className="text-slate-400">
            Définissez les paramètres de la liaison entre la référence et la plante.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {/* Résumé */}
          <div className="flex items-center gap-2 p-3 bg-slate-800/50 rounded-lg">
            <div className="flex-1">
              <p className="text-xs text-slate-400">Référence</p>
              <p className="text-sm text-slate-200 line-clamp-1">{reference.title}</p>
            </div>
            <ArrowRight className="w-4 h-4 text-green-500 shrink-0" />
            <div className="flex-1">
              <p className="text-xs text-slate-400">Plante</p>
              <p className="text-sm text-slate-200">{plant.species || plant.sampleId}</p>
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
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-slate-300">Pertinence</label>
              <span className="text-sm text-green-500 font-mono">{relevanceScore[0]}%</span>
            </div>
            <Slider
              value={relevanceScore}
              onValueChange={setRelevanceScore}
              max={100}
              step={5}
              className="w-full"
            />
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Notes (optionnel)</label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ajoutez des notes sur cette liaison..."
              className="bg-slate-800 border-slate-700 resize-none"
              rows={2}
            />
          </div>

          {/* Contexte */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Contexte / Citation (optionnel)</label>
            <Textarea
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="Extrait pertinent de la référence..."
              className="bg-slate-800 border-slate-700 resize-none"
              rows={2}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Annuler
          </Button>
          <Button 
            onClick={() => onConfirm({ 
              linkType, 
              relevanceScore: relevanceScore[0], 
              notes, 
              context 
            })}
            disabled={isLoading}
            className="bg-green-600 hover:bg-green-700"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Création...
              </>
            ) : (
              <>
                <Link2 className="w-4 h-4 mr-2" />
                Créer la liaison
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Page principale
export default function H2LinkingInterface() {
  const { toast } = useToast();
  const [searchRef, setSearchRef] = useState('');
  const [searchPlant, setSearchPlant] = useState('');
  const [selectedReference, setSelectedReference] = useState<Reference | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [plantToLink, setPlantToLink] = useState<LeafEconomy | null>(null);
  const [linkingPlantId, setLinkingPlantId] = useState<number | null>(null);

  // Queries
  const { data: allReferences, isLoading: loadingRefs } = trpc.v3References.getAll.useQuery();
  const { data: leafEconomies, isLoading: loadingPlants } = trpc.leafEconomies?.list.useQuery();
  const { data: linkStats } = trpc.referenceEntityLinks.getStats.useQuery();
  
  // Query pour les liaisons de la référence sélectionnée
  const { data: selectedRefLinks, refetch: refetchLinks } = trpc.referenceEntityLinks.getForReference.useQuery(
    selectedReference?.id ?? 0,
    { enabled: !!selectedReference }
  );

  // Mutations
  const createLinkMutation = trpc.referenceEntityLinks.create.useMutation({
    onSuccess: () => {
      toast({
        title: "Liaison créée",
        description: "La référence a été liée à la plante avec succès.",
      });
      refetchLinks();
      setLinkDialogOpen(false);
      setPlantToLink(null);
      setLinkingPlantId(null);
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
      setLinkingPlantId(null);
    },
  });

  const deleteLinkMutation = trpc.referenceEntityLinks.delete.useMutation({
    onSuccess: () => {
      toast({
        title: "Liaison supprimée",
        description: "La liaison a été supprimée avec succès.",
      });
      refetchLinks();
      setLinkingPlantId(null);
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
      setLinkingPlantId(null);
    },
  });

  // Filtrer les références H2 uniquement
  const h2References = useMemo(() => {
    if (!allReferences) return [];
    return allReferences?.filter(ref => ref.axisPrimaryCode === 'H2');
  }, [allReferences]);

  // Filtrer les références par recherche
  const filteredReferences = useMemo(() => {
    if (!searchRef.trim()) return h2References;
    const search = searchRef.toLowerCase();
    return h2References.filter(ref => 
      ref.title.toLowerCase().includes(search) ||
      ref.authors?.toLowerCase().includes(search) ||
      ref.entryKey.toLowerCase().includes(search)
    );
  }, [h2References, searchRef]);

  // Filtrer les plantes par recherche et catégorie
  const filteredPlants = useMemo(() => {
    if (!leafEconomies) return [];
    let plants = leafEconomies;
    
    if (categoryFilter !== 'all') {
      plants = plants.filter(p => p.category === categoryFilter);
    }
    
    if (searchPlant.trim()) {
      const search = searchPlant.toLowerCase();
      plants = plants.filter(p => 
        p.sampleId.toLowerCase().includes(search) ||
        p.species?.toLowerCase().includes(search) ||
        p.claimedVariety?.toLowerCase().includes(search) ||
        p.odorNotes?.toLowerCase().includes(search)
      );
    }
    
    return plants;
  }, [leafEconomies, searchPlant, categoryFilter]);

  // Compter les liaisons par référence
  const linkCountByReference = useMemo(() => {
    const counts: Record<number, number> = {};
    // On utiliserait les stats ici si disponibles
    return counts;
  }, []);

  // Vérifier si une plante est liée à la référence sélectionnée
  const isPlantLinked = (plantId: number) => {
    if (!selectedRefLinks) return false;
    return selectedRefLinks?.some(link => 
      link.entityType === 'leaf_economy' && link.entityId === plantId
    );
  };

  // Obtenir l'ID de la liaison pour une plante
  const getLinkId = (plantId: number) => {
    if (!selectedRefLinks) return null;
    const link = selectedRefLinks?.find(l => 
      l.entityType === 'leaf_economy' && l.entityId === plantId
    );
    return link?.id ?? null;
  };

  // Handlers
  const handleOpenLinkDialog = (plant: LeafEconomy) => {
    setPlantToLink(plant);
    setLinkDialogOpen(true);
  };

  const handleCreateLink = (config: { linkType: string; relevanceScore: number; notes: string; context: string }) => {
    if (!selectedReference || !plantToLink) return;
    setLinkingPlantId(plantToLink.id);
    createLinkMutation.mutate({
      referenceId: selectedReference.id,
      entityType: 'leaf_economy',
      entityId: plantToLink.id,
      linkType: config.linkType as any,
      relevanceScore: config.relevanceScore,
      notes: config.notes || undefined,
      context: config.context || undefined,
    });
  };

  const handleDeleteLink = (plantId: number) => {
    const linkId = getLinkId(plantId);
    if (!linkId) return;
    setLinkingPlantId(plantId);
    deleteLinkMutation.mutate(linkId);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <Header />
      
      <main className="flex-1">
        <div className="container py-8">
          <Breadcrumbs 
            customItems={[
              { label: "Accueil", path: "/" },
              { label: "Bibliographie", path: "/bibliographie" },
              { label: "Heritage & Conservation", path: "/heritage-conservation" },
              { label: "Liaisons H2" },
            ]} 
          />
          
          {/* En-tête */}
          <div className="mt-6 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-green-900/30">
                <Link2 className="w-8 h-8 text-green-500" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-100">
                  Liaisons H2 — Plantes Menacées
                </h1>
                <p className="text-slate-400 mt-1">
                  Connectez les références sur la durabilité aux échantillons botaniques
                </p>
              </div>
            </div>
            
            {/* Stats */}
            <div className="flex flex-wrap gap-4">
              <Badge variant="outline" className="text-sm border-green-600 text-green-400">
                <BookOpen className="w-4 h-4 mr-2" />
                {h2References.length} références H2
              </Badge>
              <Badge variant="outline" className="text-sm border-slate-600 text-slate-300">
                <TreeDeciduous className="w-4 h-4 mr-2" />
                {leafEconomies?.length || 0} échantillons
              </Badge>
              {linkStats && (
                <Badge variant="outline" className="text-sm border-amber-600 text-amber-400">
                  <Link2 className="w-4 h-4 mr-2" />
                  {linkStats?.total} liaisons totales
                </Badge>
              )}
            </div>
          </div>

          {/* Interface principale en deux colonnes */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Colonne gauche : Références H2 */}
            <div className="space-y-4">
              <Card className="bg-slate-900/50 border-slate-700">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-slate-100 flex items-center gap-2">
                    <Leaf className="w-5 h-5 text-green-500" />
                    Références H2 — Durabilité
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    Sélectionnez une référence pour la lier aux plantes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <Input
                      placeholder="Rechercher une référence..."
                      value={searchRef}
                      onChange={(e) => setSearchRef(e.target.value)}
                      className="pl-10 bg-slate-800 border-slate-700"
                    />
                  </div>
                  
                  <ScrollArea className="h-[500px] pr-4">
                    {loadingRefs ? (
                      <div className="space-y-3">
                        {[1, 2, 3, 4, 5].map(i => (
                          <Skeleton key={i} className="h-24 bg-slate-800" />
                        ))}
                      </div>
                    ) : filteredReferences.length === 0 ? (
                      <div className="text-center py-8 text-slate-400">
                        <AlertTriangle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p>Aucune référence H2 trouvée</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {filteredReferences.map(ref => (
                          <H2ReferenceCard
                            key={ref.id}
                            reference={ref}
                            isSelected={selectedReference?.id === ref.id}
                            onClick={() => setSelectedReference(ref)}
                            linkedCount={linkCountByReference[ref.id] || 0}
                          />
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>

            {/* Colonne droite : Plantes menacées */}
            <div className="space-y-4">
              <Card className="bg-slate-900/50 border-slate-700">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-slate-100 flex items-center gap-2">
                    <TreeDeciduous className="w-5 h-5 text-slate-400" />
                    Échantillons Botaniques
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    {selectedReference 
                      ? `Liez des plantes à "${selectedReference.title.substring(0, 50)}..."`
                      : 'Sélectionnez d\'abord une référence à gauche'
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2 mb-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <Input
                        placeholder="Rechercher une plante..."
                        value={searchPlant}
                        onChange={(e) => setSearchPlant(e.target.value)}
                        className="pl-10 bg-slate-800 border-slate-700"
                        disabled={!selectedReference}
                      />
                    </div>
                    <Select 
                      value={categoryFilter} 
                      onValueChange={setCategoryFilter}
                      disabled={!selectedReference}
                    >
                      <SelectTrigger className="w-40 bg-slate-800 border-slate-700">
                        <Filter className="w-4 h-4 mr-2" />
                        <SelectValue placeholder="Catégorie" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        <SelectItem value="all">Toutes</SelectItem>
                        <SelectItem value="aromatique">Aromatique</SelectItem>
                        <SelectItem value="tabac">Tabac</SelectItem>
                        <SelectItem value="cannabis">Cannabis</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <ScrollArea className="h-[500px] pr-4">
                    {!selectedReference ? (
                      <div className="text-center py-12 text-slate-400">
                        <Link2 className="w-12 h-12 mx-auto mb-4 opacity-30" />
                        <p className="text-lg font-medium">Sélectionnez une référence</p>
                        <p className="text-sm mt-1">
                          Choisissez une référence H2 dans la colonne de gauche pour commencer à créer des liaisons.
                        </p>
                      </div>
                    ) : loadingPlants ? (
                      <div className="space-y-3">
                        {[1, 2, 3, 4, 5].map(i => (
                          <Skeleton key={i} className="h-24 bg-slate-800" />
                        ))}
                      </div>
                    ) : filteredPlants.length === 0 ? (
                      <div className="text-center py-8 text-slate-400">
                        <AlertTriangle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p>Aucun échantillon trouvé</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {filteredPlants.map(plant => (
                          <LeafEconomyCard
                            key={plant.id}
                            plant={plant}
                            isLinked={isPlantLinked(plant.id)}
                            onLink={() => handleOpenLinkDialog(plant)}
                            onUnlink={() => handleDeleteLink(plant.id)}
                            isLoading={linkingPlantId === plant.id}
                          />
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Liaisons existantes pour la référence sélectionnée */}
          {selectedReference && selectedRefLinks && selectedRefLinks?.length > 0 && (
            <Card className="mt-6 bg-slate-900/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-lg text-slate-100 flex items-center gap-2">
                  <Link2 className="w-5 h-5 text-green-500" />
                  Liaisons existantes ({selectedRefLinks?.filter(l => l.entityType === 'leaf_economy').length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {selectedRefLinks
                    .filter(link => link.entityType === 'leaf_economy')
                    .map(link => {
                      const plant = leafEconomies?.find(p => p.id === link.entityId);
                      if (!plant) return null;
                      return (
                        <div 
                          key={link.id}
                          className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg border border-green-900/50"
                        >
                          <TreeDeciduous className="w-4 h-4 text-green-500 shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-slate-200 truncate">
                              {plant.species || plant.sampleId}
                            </p>
                            <p className="text-xs text-slate-400">
                              {link.linkType} • {link.relevanceScore}%
                            </p>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteLink(plant.id)}
                            disabled={linkingPlantId === plant.id}
                            className="shrink-0 text-red-400 hover:text-red-300 hover:bg-red-900/20"
                          >
                            {linkingPlantId === plant.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      );
                    })}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <Footer />

      {/* Dialog de configuration de liaison */}
      <LinkConfigDialog
        open={linkDialogOpen}
        onClose={() => {
          setLinkDialogOpen(false);
          setPlantToLink(null);
        }}
        onConfirm={handleCreateLink}
        reference={selectedReference}
        plant={plantToLink}
        isLoading={createLinkMutation.isPending}
      />
    </div>
  );
}
