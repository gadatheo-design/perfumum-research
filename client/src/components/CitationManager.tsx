import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { 
  Plus, 
  Loader2, 
  Link2, 
  ArrowRight, 
  Search,
  BookOpen,
  Trash2,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { toast } from 'sonner';

interface CitationManagerProps {
  bibliographyId: number;
  bibliographyTitle: string;
  onUpdate?: () => void;
}

const citationTypeLabels: Record<string, { label: string; color: string; description: string }> = {
  direct: { label: 'Direct', color: 'bg-blue-500', description: 'Citation directe dans le texte' },
  indirect: { label: 'Indirect', color: 'bg-violet-500', description: 'Référence indirecte/paraphrase' },
  methodological: { label: 'Méthodologique', color: 'bg-emerald-500', description: 'Citation méthodologique' },
  theoretical: { label: 'Théorique', color: 'bg-amber-500', description: 'Citation théorique/conceptuelle' },
  data: { label: 'Données', color: 'bg-cyan-500', description: 'Citation de données' },
  critique: { label: 'Critique', color: 'bg-red-500', description: 'Citation critique' },
  support: { label: 'Support', color: 'bg-green-500', description: 'Citation de soutien' },
  comparison: { label: 'Comparaison', color: 'bg-pink-500', description: 'Citation comparative' },
};

export function CitationManager({ bibliographyId, bibliographyTitle, onUpdate }: CitationManagerProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRefId, setSelectedRefId] = useState<number | null>(null);
  const [citationType, setCitationType] = useState<string>('direct');
  const [weight, setWeight] = useState<number>(1);
  const [context, setContext] = useState('');
  const [pageNumber, setPageNumber] = useState('');
  const [notes, setNotes] = useState('');
  const [direction, setDirection] = useState<'citing' | 'cited'>('citing');

  // Récupérer toutes les références pour la sélection
  const { data: allRefs, isLoading: refsLoading } = trpc.bibliography.list.useQuery({
    search: searchQuery || undefined,
    limit: 50,
  });

  // Récupérer les citations existantes pour cette référence
  const { data: citingList, refetch: refetchCiting } = trpc.referenceCitations.list.useQuery({
    citingId: bibliographyId,
  });
  const { data: citedList, refetch: refetchCited } = trpc.referenceCitations.list.useQuery({
    citedId: bibliographyId,
  });

  // Mutations
  const createMutation = trpc.referenceCitations.create.useMutation({
    onSuccess: () => {
      toast.success('Citation ajoutée avec succès');
      refetchCiting();
      refetchCited();
      onUpdate?.();
      resetForm();
      setIsAddDialogOpen(false);
    },
    onError: (error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });

  const deleteMutation = trpc.referenceCitations.delete.useMutation({
    onSuccess: () => {
      toast.success('Citation supprimée');
      refetchCiting();
      refetchCited();
      onUpdate?.();
    },
    onError: (error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });

  const verifyMutation = trpc.referenceCitations.verify.useMutation({
    onSuccess: () => {
      toast.success('Citation vérifiée');
      refetchCiting();
      refetchCited();
    },
    onError: (error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });

  const resetForm = () => {
    setSelectedRefId(null);
    setCitationType('direct');
    setWeight(1);
    setContext('');
    setPageNumber('');
    setNotes('');
    setSearchQuery('');
  };

  const handleCreate = () => {
    if (!selectedRefId) {
      toast.error('Veuillez sélectionner une référence');
      return;
    }

    const data = direction === 'citing'
      ? { citingId: bibliographyId, citedId: selectedRefId }
      : { citingId: selectedRefId, citedId: bibliographyId };

    createMutation.mutate({
      ...data,
      citationType: citationType as any,
      weight,
      context: context || undefined,
      pageNumber: pageNumber || undefined,
      notes: notes || undefined,
    });
  };

  // Filtrer les références disponibles (exclure la référence actuelle et les déjà liées)
  const existingCitingIds = new Set(citingList?.citations?.map((c: any) => c.citedId) || []);
  const existingCitedIds = new Set(citedList?.citations?.map((c: any) => c.citingId) || []);
  
  const availableRefs = allRefs?.entries?.filter((ref: any) => {
    if (ref.id === bibliographyId) return false;
    if (direction === 'citing' && existingCitingIds.has(ref.id)) return false;
    if (direction === 'cited' && existingCitedIds.has(ref.id)) return false;
    return true;
  }) || [];

  return (
    <div className="space-y-6">
      {/* Section: Cette référence cite... */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <ArrowRight className="h-4 w-4 text-blue-500" />
            Cette référence cite ({citingList?.citations?.length || 0})
          </CardTitle>
          <CardDescription>
            Références citées par "{bibliographyTitle}"
          </CardDescription>
        </CardHeader>
        <CardContent>
          {citingList?.citations && citingList.citations.length > 0 ? (
            <div className="space-y-2">
              {citingList.citations.map((citation: any) => (
                <div
                  key={citation.id}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className={`${citationTypeLabels[citation.citationType]?.color || 'bg-gray-500'} text-white text-xs`}>
                        {citationTypeLabels[citation.citationType]?.label || citation.citationType}
                      </Badge>
                      {citation.verified ? (
                        <CheckCircle className="h-3 w-3 text-green-500" />
                      ) : (
                        <XCircle className="h-3 w-3 text-muted-foreground" />
                      )}
                      <span className="text-xs text-muted-foreground">Poids: {citation.weight}</span>
                    </div>
                    <p className="text-sm font-medium truncate">
                      {citation.cited?.title || 'Titre inconnu'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {citation.cited?.authors?.split(',')[0]} ({citation.cited?.year || '?'})
                    </p>
                  </div>
                  <div className="flex gap-1">
                    {!citation.verified && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => verifyMutation.mutate(citation.id)}
                      >
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive"
                      onClick={() => {
                        if (confirm('Supprimer cette citation ?')) {
                          deleteMutation.mutate(citation.id);
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              Cette référence ne cite aucune autre référence enregistrée.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Section: Citée par... */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <ArrowRight className="h-4 w-4 text-emerald-500 rotate-180" />
            Citée par ({citedList?.citations?.length || 0})
          </CardTitle>
          <CardDescription>
            Références qui citent "{bibliographyTitle}"
          </CardDescription>
        </CardHeader>
        <CardContent>
          {citedList?.citations && citedList.citations.length > 0 ? (
            <div className="space-y-2">
              {citedList.citations.map((citation: any) => (
                <div
                  key={citation.id}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className={`${citationTypeLabels[citation.citationType]?.color || 'bg-gray-500'} text-white text-xs`}>
                        {citationTypeLabels[citation.citationType]?.label || citation.citationType}
                      </Badge>
                      {citation.verified ? (
                        <CheckCircle className="h-3 w-3 text-green-500" />
                      ) : (
                        <XCircle className="h-3 w-3 text-muted-foreground" />
                      )}
                    </div>
                    <p className="text-sm font-medium truncate">
                      {citation.citing?.title || 'Titre inconnu'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {citation.citing?.authors?.split(',')[0]} ({citation.citing?.year || '?'})
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive"
                      onClick={() => {
                        if (confirm('Supprimer cette citation ?')) {
                          deleteMutation.mutate(citation.id);
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              Aucune référence enregistrée ne cite cette source.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Bouton pour ajouter une citation */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogTrigger asChild>
          <Button className="w-full gap-2">
            <Plus className="h-4 w-4" />
            Ajouter une citation croisée
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Ajouter une citation croisée</DialogTitle>
            <DialogDescription>
              Créez un lien de citation entre cette référence et une autre.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Direction de la citation */}
            <div className="space-y-2">
              <Label>Direction de la citation</Label>
              <div className="flex gap-2">
                <Button
                  variant={direction === 'citing' ? 'default' : 'outline'}
                  className="flex-1"
                  onClick={() => setDirection('citing')}
                >
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Cette référence cite...
                </Button>
                <Button
                  variant={direction === 'cited' ? 'default' : 'outline'}
                  className="flex-1"
                  onClick={() => setDirection('cited')}
                >
                  <ArrowRight className="h-4 w-4 mr-2 rotate-180" />
                  Citée par...
                </Button>
              </div>
            </div>

            {/* Recherche de référence */}
            <div className="space-y-2">
              <Label>Rechercher une référence</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Titre, auteur ou clé..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Liste des références disponibles */}
            <div className="space-y-2">
              <Label>Sélectionner une référence</Label>
              <ScrollArea className="h-[200px] border rounded-md p-2">
                {refsLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : availableRefs.length > 0 ? (
                  <div className="space-y-1">
                    {availableRefs.map((ref: any) => (
                      <div
                        key={ref.id}
                        className={`p-2 rounded cursor-pointer transition-colors ${
                          selectedRefId === ref.id
                            ? 'bg-primary/10 border border-primary'
                            : 'hover:bg-muted'
                        }`}
                        onClick={() => setSelectedRefId(ref.id)}
                      >
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          <div className="min-w-0">
                            <p className="text-sm font-medium truncate">{ref.title}</p>
                            <p className="text-xs text-muted-foreground">
                              {ref.authors?.split(',')[0]} ({ref.year || '?'}) — {ref.entryKey}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    {searchQuery ? 'Aucune référence trouvée' : 'Aucune référence disponible'}
                  </p>
                )}
              </ScrollArea>
            </div>

            {/* Type de citation */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Type de citation</Label>
                <Select value={citationType} onValueChange={setCitationType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(citationTypeLabels).map(([key, { label, description }]) => (
                      <SelectItem key={key} value={key}>
                        <div>
                          <span className="font-medium">{label}</span>
                          <span className="text-xs text-muted-foreground ml-2">— {description}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Poids (importance): {weight}</Label>
                <Slider
                  value={[weight]}
                  onValueChange={([v]) => setWeight(v)}
                  min={1}
                  max={5}
                  step={1}
                  className="mt-2"
                />
              </div>
            </div>

            {/* Contexte et notes */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Page(s)</Label>
                <Input
                  placeholder="ex: 123-145"
                  value={pageNumber}
                  onChange={(e) => setPageNumber(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Contexte</Label>
                <Input
                  placeholder="Contexte de la citation..."
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea
                placeholder="Notes additionnelles..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Annuler
            </Button>
            <Button
              onClick={handleCreate}
              disabled={!selectedRefId || createMutation.isPending}
            >
              {createMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Création...
                </>
              ) : (
                <>
                  <Link2 className="h-4 w-4 mr-2" />
                  Créer la citation
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default CitationManager;
