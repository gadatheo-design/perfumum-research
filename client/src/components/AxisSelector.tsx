import { useState, useEffect } from 'react';
import { trpc } from '@/lib/trpc';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X, Link2, Plus, Loader2, Target } from 'lucide-react';
import { toast } from 'sonner';

interface AxisSelectorProps {
  bibliographyId: number;
  onUpdate?: () => void;
  compact?: boolean;
}

interface LinkedAxis {
  id: number;
  axisCode: string;
  name: string;
  color?: string | null;
  relevance?: string | null;
  linkNotes?: string | null;
}

const relevanceLabels: Record<string, { label: string; color: string }> = {
  primaire: { label: 'Primaire', color: 'bg-emerald-500' },
  secondaire: { label: 'Secondaire', color: 'bg-blue-500' },
  contextuelle: { label: 'Contextuelle', color: 'bg-gray-500' },
};

export function AxisSelector({ bibliographyId, onUpdate, compact = false }: AxisSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedAxisId, setSelectedAxisId] = useState<number | null>(null);
  const [selectedRelevance, setSelectedRelevance] = useState<string>('secondaire');

  // Récupérer tous les axes disponibles
  const { data: allAxes, isLoading: axesLoading } = trpc.researchAxes.list.useQuery({});
  
  // Récupérer les axes liés à cette référence
  const { data: linkedAxes, isLoading: linkedLoading, refetch: refetchLinked } = trpc.bibliography.getLinkedAxes.useQuery(bibliographyId);

  // Mutations
  const linkMutation = trpc.bibliography.linkToAxis.useMutation({
    onSuccess: () => {
      toast.success('Axe lié avec succès');
      refetchLinked();
      onUpdate?.();
      setSelectedAxisId(null);
    },
    onError: (error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });

  const unlinkMutation = trpc.bibliography.unlinkFromAxis.useMutation({
    onSuccess: () => {
      toast.success('Lien supprimé');
      refetchLinked();
      onUpdate?.();
    },
    onError: (error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });

  const handleLink = () => {
    if (!selectedAxisId) return;
    linkMutation.mutate({
      bibliographyId,
      axisId: selectedAxisId,
      relevance: selectedRelevance as 'primaire' | 'secondaire' | 'contextuelle',
    });
  };

  const handleUnlink = (axisId: number) => {
    unlinkMutation.mutate({ bibliographyId, axisId });
  };

  // Filtrer les axes non encore liés
  const availableAxes = allAxes?.filter(
    (axis: any) => !linkedAxes?.some((linked: any) => linked.id === axis.id)
  ) || [];

  if (compact) {
    // Mode compact : affiche juste les badges des axes liés
    return (
      <div className="flex flex-wrap items-center gap-1">
        {linkedLoading ? (
          <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
        ) : linkedAxes && linkedAxes.length > 0 ? (
          <>
            {linkedAxes.map((axis: LinkedAxis) => (
              <Badge
                key={axis.id}
                variant="outline"
                className="text-xs flex items-center gap-1"
                style={{ borderColor: axis.color || '#6b7280' }}
              >
                <Target className="h-2 w-2" style={{ color: axis.color || '#6b7280' }} />
                {axis.axisCode}
              </Badge>
            ))}
          </>
        ) : (
          <span className="text-xs text-muted-foreground">Aucun axe</span>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <Label className="flex items-center gap-2">
        <Link2 className="h-4 w-4" />
        Axes de recherche liés
      </Label>

      {/* Liste des axes liés */}
      <div className="flex flex-wrap gap-2">
        {linkedLoading ? (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Chargement...
          </div>
        ) : linkedAxes && linkedAxes.length > 0 ? (
          linkedAxes.map((axis: LinkedAxis) => (
            <Badge
              key={axis.id}
              variant="secondary"
              className="flex items-center gap-2 pr-1"
              style={{ 
                backgroundColor: `${axis.color}20` || '#6b728020',
                borderColor: axis.color || '#6b7280',
                borderWidth: '1px',
              }}
            >
              <Target className="h-3 w-3" style={{ color: axis.color || '#6b7280' }} />
              <span className="font-medium">{axis.axisCode}</span>
              <span className="text-xs opacity-75">— {axis.name}</span>
              {axis.relevance && (
                <span className={`text-xs px-1.5 py-0.5 rounded ${relevanceLabels[axis.relevance]?.color || 'bg-gray-500'} text-white`}>
                  {relevanceLabels[axis.relevance]?.label || axis.relevance}
                </span>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5 hover:bg-destructive/20"
                onClick={() => handleUnlink(axis.id)}
                disabled={unlinkMutation.isPending}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">
            Aucun axe de recherche lié à cette référence.
          </p>
        )}
      </div>

      {/* Ajouter un nouvel axe */}
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            Lier à un axe
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80" align="start">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Axe de recherche</Label>
              <Select
                value={selectedAxisId?.toString() || ''}
                onValueChange={(v) => setSelectedAxisId(parseInt(v))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un axe..." />
                </SelectTrigger>
                <SelectContent>
                  <ScrollArea className="h-[200px]">
                    {axesLoading ? (
                      <div className="p-2 text-center text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin mx-auto" />
                      </div>
                    ) : availableAxes.length > 0 ? (
                      availableAxes.map((axis: any) => (
                        <SelectItem key={axis.id} value={axis.id.toString()}>
                          <div className="flex items-center gap-2">
                            <div
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: axis.color || '#6b7280' }}
                            />
                            <span className="font-medium">{axis.axisCode}</span>
                            <span className="text-muted-foreground">— {axis.name}</span>
                          </div>
                        </SelectItem>
                      ))
                    ) : (
                      <div className="p-2 text-center text-muted-foreground text-sm">
                        Tous les axes sont déjà liés
                      </div>
                    )}
                  </ScrollArea>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Pertinence</Label>
              <Select value={selectedRelevance} onValueChange={setSelectedRelevance}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="primaire">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                      Primaire — Source principale
                    </div>
                  </SelectItem>
                  <SelectItem value="secondaire">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-500" />
                      Secondaire — Source complémentaire
                    </div>
                  </SelectItem>
                  <SelectItem value="contextuelle">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-gray-500" />
                      Contextuelle — Contexte/background
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              className="w-full"
              onClick={handleLink}
              disabled={!selectedAxisId || linkMutation.isPending}
            >
              {linkMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Liaison en cours...
                </>
              ) : (
                <>
                  <Link2 className="h-4 w-4 mr-2" />
                  Lier à cet axe
                </>
              )}
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default AxisSelector;
