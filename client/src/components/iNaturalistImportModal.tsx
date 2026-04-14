import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { trpc } from '@/lib/trpc';
import { Loader2, AlertCircle, CheckCircle2, Globe } from 'lucide-react';

export interface iNaturalistPhoto {
  id: number;
  url: string;
  attribution: string;
  license: string;
  observationId: number;
  observerName: string;
  latitude: number;
  longitude: number;
  placeGuess?: string;
}

interface iNaturalistImportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  photo: iNaturalistPhoto | null;
  plantId: number;
  onSuccess: () => void;
}

const IMAGE_TYPE_OPTIONS = [
  { value: 'leaf', label: '🍃 Feuille' },
  { value: 'flower', label: '🌸 Fleur' },
  { value: 'fruit', label: '🍎 Fruit' },
  { value: 'bark', label: '🌳 Écorce' },
  { value: 'whole_plant', label: '🌿 Plante entière' },
  { value: 'other', label: '📷 Autre' },
];

export function iNaturalistImportModal({
  open,
  onOpenChange,
  photo,
  plantId,
  onSuccess,
}: iNaturalistImportModalProps) {
  const [imageType, setImageType] = useState('leaf');
  const [selectedTerroir, setSelectedTerroir] = useState<{ id: number; name: string } | null>(null);
  const [terroirs, setTerroirs] = useState<Array<{ id: number; name: string; distanceKm: number }>>([]);
  const [isLoadingTerroirs, setIsLoadingTerroirs] = useState(false);
  const { toast } = useToast();
  
  const importMutation = trpc.varietyImages.importInatImage.useMutation();
  const findTerroirMutation = trpc.varietyImages.findTerroirByCoordinates.useMutation();

  // Load terroirs when modal opens
  useEffect(() => {
    if (open && photo && photo.latitude && photo.longitude) {
      setIsLoadingTerroirs(true);
      findTerroirMutation.mutate(
        {
          latitude: photo.latitude,
          longitude: photo.longitude,
          maxDistanceKm: 100,
        },
        {
          onSuccess: (data) => {
            setTerroirs(data.map(t => ({
              id: t.id,
              name: t.name,
              distanceKm: (t as any).distanceKm || 0,
            })));
            if (data.length > 0) {
              setSelectedTerroir({ id: data[0].id, name: data[0].name });
            }
            setIsLoadingTerroirs(false);
          },
          onError: () => {
            setIsLoadingTerroirs(false);
            toast({
              title: 'Erreur',
              description: 'Impossible de charger les terroirs',
              variant: 'destructive',
            });
          },
        }
      );
    }
  }, [open, photo]);

  const handleImport = async () => {
    if (!photo) return;
    
    try {
      await importMutation.mutateAsync({
        inatPhotoUrl: photo.url,
        inatObservationId: photo.observationId,
        inatObserverName: photo.observerName,
        inatLicense: photo.license,
        latitude: photo.latitude,
        longitude: photo.longitude,
        plantId,
        terroirId: selectedTerroir?.id || null,
        imageType: imageType as any,
      });
      
      toast({
        title: 'Succès',
        description: `Image importée de iNaturalist observation #${photo.observationId}`,
      });
      
      setImageType('leaf');
      setSelectedTerroir(null);
      onOpenChange(false);
      onSuccess();
    } catch (err) {
      toast({
        title: 'Erreur',
        description: err instanceof Error ? err.message : 'Erreur lors de l\'import',
        variant: 'destructive',
      });
    }
  };

  if (!photo) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Importer une image iNaturalist</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Image preview */}
          <div className="relative w-full h-48 bg-zinc-100 rounded-lg overflow-hidden">
            <img
              src={photo.url}
              alt="iNaturalist observation"
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
              {photo.license}
            </div>
          </div>

          {/* Metadata */}
          <div className="bg-zinc-50 p-3 rounded-lg space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-zinc-600">Observation iNaturalist</span>
              <a
                href={`https://www.inaturalist.org/observations/${photo.observationId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline font-medium"
              >
                #{photo.observationId}
              </a>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-600">Observateur</span>
              <span className="font-medium">{photo.observerName}</span>
            </div>
            {photo.placeGuess && (
              <div className="flex items-center justify-between">
                <span className="text-zinc-600 flex items-center gap-1">
                  <Globe className="w-3 h-3" /> Lieu
                </span>
                <span className="font-medium text-xs text-right max-w-[60%] truncate" title={photo.placeGuess}>
                  {photo.placeGuess}
                </span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="text-zinc-600 flex items-center gap-1">
                <Globe className="w-3 h-3" /> Coordonnées GPS
              </span>
              <span className="font-medium text-xs font-mono">
                {photo.latitude !== 0 || photo.longitude !== 0
                  ? `${photo.latitude.toFixed(4)}°, ${photo.longitude.toFixed(4)}°`
                  : <span className="text-zinc-400 italic">Non disponible</span>}
              </span>
            </div>
          </div>

          {/* Image type selector */}
          <div>
            <Label htmlFor="image-type" className="text-sm font-medium mb-2 block">
              Partie de la plante
            </Label>
            <Select value={imageType} onValueChange={setImageType}>
              <SelectTrigger id="image-type" className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {IMAGE_TYPE_OPTIONS.map(opt => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Terroir selector */}
          <div>
            <Label htmlFor="terroir" className="text-sm font-medium mb-2 block">
              Terroir (basé sur la localisation)
            </Label>
            {isLoadingTerroirs ? (
              <div className="flex items-center justify-center py-2 text-sm text-zinc-500">
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Recherche des terroirs...
              </div>
            ) : terroirs.length > 0 ? (
              <Select
                value={selectedTerroir?.id.toString() || ''}
                onValueChange={(val) => {
                  const t = terroirs.find(x => x.id.toString() === val);
                  if (t) setSelectedTerroir({ id: t.id, name: t.name });
                }}
              >
                <SelectTrigger id="terroir" className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {terroirs.map(t => (
                    <SelectItem key={t.id} value={t.id.toString()}>
                      {t.name} ({t.distanceKm.toFixed(1)} km)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <div className="flex items-center gap-2 p-2 bg-amber-50 border border-amber-200 rounded text-sm text-amber-700">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                Aucun terroir trouvé à proximité
              </div>
            )}
          </div>

          {/* Import button */}
          {!plantId && (
            <div className="flex items-center gap-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              Veuillez d'abord sélectionner une plante PERFUMUM cible
            </div>
          )}

          <Button
            onClick={handleImport}
            disabled={importMutation.isPending || !plantId}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            {importMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Import en cours...
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Importer l'image
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
