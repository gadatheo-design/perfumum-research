/**
 * VarietyImagesAdmin.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Admin page for managing morphological images of plant varieties
 * Design: Swiss Modern — sidebar filters, masonry grid, rich lightbox
 * v2: + pagination, batch actions, sort, mobile drawer, iNaturalist tab, plant links
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Textarea } from '@/components/ui/textarea';
import { trpc } from '@/lib/trpc';
import { useToast } from '@/hooks/use-toast';
import { iNaturalistImportModal as INaturalistImportModal } from '@/components/iNaturalistImportModal';
import {
  Upload, CheckCircle2, AlertCircle, Trash2, Eye, Download, Search,
  ExternalLink, ImageIcon, Loader2, X, ChevronLeft, ChevronRight,
  Leaf, Flower2, Apple, TreePine, MoreHorizontal, Link2, Filter,
  SlidersHorizontal, Grid3X3, LayoutGrid, Maximize2, Info, Camera,
  Tag, Globe, BookOpen, ZoomIn, ArrowUpDown, ArrowUp, ArrowDown,
  CheckSquare, Square, ChevronDown, Sprout,
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const IMAGE_TYPE_CONFIG: Record<string, {
  label: string;
  icon: React.ReactNode;
  color: string;
  dot: string;
}> = {
  leaf:        { label: 'Feuille',        icon: <Leaf className="w-3 h-3" />,           color: 'bg-emerald-50 text-emerald-700 border-emerald-200',  dot: 'bg-emerald-500' },
  flower:      { label: 'Fleur',          icon: <Flower2 className="w-3 h-3" />,         color: 'bg-rose-50 text-rose-700 border-rose-200',           dot: 'bg-rose-500' },
  fruit:       { label: 'Fruit',          icon: <Apple className="w-3 h-3" />,           color: 'bg-amber-50 text-amber-700 border-amber-200',        dot: 'bg-amber-500' },
  bark:        { label: 'Écorce',         icon: <TreePine className="w-3 h-3" />,        color: 'bg-amber-50 text-amber-700 border-amber-200',        dot: 'bg-amber-600' },
  whole_plant: { label: 'Plante entière', icon: <TreePine className="w-3 h-3" />,        color: 'bg-teal-50 text-teal-700 border-teal-200',           dot: 'bg-teal-500' },
  other:       { label: 'Autre',          icon: <MoreHorizontal className="w-3 h-3" />,  color: 'bg-slate-50 text-slate-600 border-slate-200',        dot: 'bg-slate-400' },
};

const PAGE_SIZE = 48;
type GridSize = 'compact' | 'normal' | 'large';
type SortKey = 'date_desc' | 'date_asc' | 'genus_asc' | 'genus_desc' | 'type';

// ──────────// ─────────────────────────────────────────────────────────────────
// BULK LINK BUTTON
// ─────────────────────────────────────────────────────────────────

function BulkLinkButton({
  selectedIds, onSuccess,
}: {
  selectedIds: Set<number>;
  onSuccess: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [selectedPlant, setSelectedPlant] = useState<{ id: number; label: string } | null>(null);
  const { toast } = useToast();
  const bulkLinkMutation = trpc.varietyImages.bulkLinkPlants.useMutation();

  const handleBulkLink = async () => {
    if (!selectedPlant || selectedIds.size === 0) return;
    try {
      const result = await bulkLinkMutation.mutateAsync({
        imageIds: Array.from(selectedIds),
        plantId: selectedPlant.id,
      });
      toast({
        title: 'Succès',
        description: `${result.succeeded} image(s) liée(s) à la plante${result.failed > 0 ? `, ${result.failed} erreur(s)` : ''}`,
      });
      setOpen(false);
      setSelectedPlant(null);
      onSuccess();
    } catch (err) {
      toast({
        title: 'Erreur',
        description: err instanceof Error ? err.message : 'Erreur inconnue',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="h-8 text-xs text-blue-600 border-blue-200 hover:bg-blue-50">
          <Link2 className="w-3.5 h-3.5 mr-1.5" /> Lier en lot ({selectedIds.size})
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Lier {selectedIds.size} image(s) à une plante</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <PlantAutocomplete
            value={selectedPlant}
            onChange={setSelectedPlant}
          />
          <Button
            onClick={handleBulkLink}
            disabled={!selectedPlant || bulkLinkMutation.isPending}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            {bulkLinkMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Link2 className="w-4 h-4 mr-2" />}
            Lier {selectedIds.size} image(s)
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─────────────────────────────────────────────────────────────────
// PLANT LINK BUTTON
// ─────────────────────────────────────────────────────────────────

function PlantLinkButton({
  imageId, currentPlantId, onSuccess,
}: {
  imageId: number;
  currentPlantId: number | null | undefined;
  onSuccess: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [selectedPlant, setSelectedPlant] = useState<{ id: number; label: string } | null>(
    currentPlantId ? { id: currentPlantId, label: 'Plante liée' } : null
  );
  const { toast } = useToast();
  const updatePlantMutation = trpc.varietyImages.updateImagePlant.useMutation();

  const handleLink = async () => {
    if (!selectedPlant) return;
    try {
      await updatePlantMutation.mutateAsync({ imageId, plantId: selectedPlant.id });
      toast({ title: 'Succès', description: 'Image liée à la plante' });
      setOpen(false);
      onSuccess();
    } catch (err) {
      toast({ title: 'Erreur', description: err instanceof Error ? err.message : 'Erreur inconnue', variant: 'destructive' });
    }
  };

  const handleUnlink = async () => {
    try {
      await updatePlantMutation.mutateAsync({ imageId, plantId: null });
      toast({ title: 'Succès', description: 'Image déliée de la plante' });
      setSelectedPlant(null);
      onSuccess();
    } catch (err) {
      toast({ title: 'Erreur', description: err instanceof Error ? err.message : 'Erreur inconnue', variant: 'destructive' });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="w-full text-blue-600 border-blue-200 hover:bg-blue-50">
          <Link2 className="w-4 h-4 mr-2" />
          {currentPlantId ? 'Changer la plante' : 'Lier à une plante'}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Lier l'image à une plante</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <PlantAutocomplete
            value={selectedPlant}
            onChange={setSelectedPlant}
          />
          <div className="flex gap-2">
            <Button
              onClick={handleLink}
              disabled={!selectedPlant || updatePlantMutation.isPending}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              {updatePlantMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Link2 className="w-4 h-4 mr-2" />}
              Lier
            </Button>
            {currentPlantId && (
              <Button
                onClick={handleUnlink}
                disabled={updatePlantMutation.isPending}
                variant="outline"
                className="flex-1 text-red-600 border-red-200 hover:bg-red-50"
              >
                {updatePlantMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <X className="w-4 h-4 mr-2" />}
                Délier
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─────────────────────────────────────────────────────────────────
// PLANT AUTOCOMPLETE
// ────────────────────────────────────────────────────────────────────────────

function PlantAutocomplete({
  value, onChange, disabled,
}: {
  value: { id: number; label: string } | null;
  onChange: (v: { id: number; label: string } | null) => void;
  disabled?: boolean;
}) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setQuery(v);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setDebouncedQuery(v), 300);
    if (!v) { onChange(null); setOpen(false); }
    else setOpen(true);
  };

  const searchResults = trpc.varietyImages.searchPlants.useQuery(
    { query: debouncedQuery, limit: 15 },
    { enabled: debouncedQuery.length >= 2 }
  );

  const handleSelect = (plant: any) => {
    const label = plant.latinName ? `${plant.name} (${plant.latinName})` : plant.name;
    onChange({ id: plant.id, label });
    setQuery(label);
    setOpen(false);
  };

  const handleClear = () => { onChange(null); setQuery(''); setOpen(false); };

  return (
    <div className="relative">
      <div className="relative">
        <Sprout className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
        <Input
          value={value ? value.label : query}
          onChange={handleInput}
          onFocus={() => query.length >= 2 && setOpen(true)}
          placeholder="Rechercher une plante…"
          className="pl-8 pr-8"
          disabled={disabled}
        />
        {(value || query) && (
          <button type="button" onClick={handleClear}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600">
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
      {open && searchResults.data && searchResults.data.length > 0 && (
        <div className="absolute z-50 top-full mt-1 w-full bg-white border border-zinc-200 rounded-xl shadow-lg max-h-52 overflow-y-auto">
          {searchResults.data.map((plant: any) => (
            <button
              key={plant.id}
              type="button"
              className="w-full text-left px-3 py-2 hover:bg-zinc-50 flex items-center gap-2 text-sm"
              onClick={() => handleSelect(plant)}
            >
              <Leaf className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span className="font-medium text-zinc-800">{plant.name}</span>
              {plant.latinName && <span className="text-zinc-400 text-xs italic truncate">{plant.latinName}</span>}
            </button>
          ))}
        </div>
      )}
      {open && debouncedQuery.length >= 2 && searchResults.data?.length === 0 && !searchResults.isLoading && (
        <div className="absolute z-50 top-full mt-1 w-full bg-white border border-zinc-200 rounded-xl shadow-sm px-3 py-2 text-xs text-zinc-400">
          Aucune plante trouvée
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TERROIR AUTOCOMPLETE
// ─────────────────────────────────────────────────────────────────────────────

function TerroirAutocomplete({
  value, onChange, disabled,
}: {
  value: { id: number; label: string } | null;
  onChange: (v: { id: number; label: string } | null) => void;
  disabled?: boolean;
}) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setQuery(v);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setDebouncedQuery(v), 300);
    if (!v) { onChange(null); setOpen(false); }
    else setOpen(true);
  };

  const searchResults = trpc.varietyImages.searchTerroirs.useQuery(
    { query: debouncedQuery, limit: 20 },
    { enabled: true }
  );

  const handleSelect = (terroir: any) => {
    const label = [terroir.name, terroir.region, terroir.country].filter(Boolean).join(', ');
    onChange({ id: terroir.id, label });
    setQuery(label);
    setOpen(false);
  };

  const handleClear = () => { onChange(null); setQuery(''); setOpen(false); };

  const displayedResults = debouncedQuery.length >= 1
    ? (searchResults.data || []).filter((t: any) =>
        `${t.name} ${t.region || ''} ${t.country || ''}`.toLowerCase().includes(debouncedQuery.toLowerCase())
      )
    : (searchResults.data || []).slice(0, 10);

  return (
    <div className="relative">
      <div className="relative">
        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
        <Input
          value={value ? value.label : query}
          onChange={handleInput}
          onFocus={() => setOpen(true)}
          placeholder="Rechercher un terroir…"
          className="pl-8 pr-8"
          disabled={disabled}
        />
        {(value || query) && (
          <button type="button" onClick={handleClear}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600">
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
      {open && displayedResults.length > 0 && (
        <div className="absolute z-50 top-full mt-1 w-full bg-white border border-zinc-200 rounded-xl shadow-lg max-h-52 overflow-y-auto">
          {displayedResults.map((terroir: any) => (
            <button
              key={terroir.id}
              type="button"
              className="w-full text-left px-3 py-2 hover:bg-zinc-50 flex items-center gap-2 text-sm"
              onClick={() => handleSelect(terroir)}
            >
              <Globe className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span className="text-zinc-800 font-medium">{terroir.name}</span>
              {(terroir.region || terroir.country) && (
                <span className="text-zinc-400 text-xs truncate">{[terroir.region, terroir.country].filter(Boolean).join(', ')}</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// LIGHTBOX
// ─────────────────────────────────────────────────────────────────────────────

function Lightbox({
  images, currentIndex, onClose, onPrev, onNext, onVerify, onDelete,
}: {
  images: any[]; currentIndex: number;
  onClose: () => void; onPrev: () => void; onNext: () => void;
  onVerify: (id: number, v: boolean) => void; onDelete: (id: number) => void;
}) {
  const image = images[currentIndex];
  if (!image) return null;
  const typeConfig = IMAGE_TYPE_CONFIG[image.imageType] || IMAGE_TYPE_CONFIG.other;

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onPrev, onNext, onClose]);

  const handleDownload = async () => {
    try {
      const resp = await fetch(image.fileUrl);
      const blob = await resp.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${image.genus}_${image.species}_${image.imageType}.jpg`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      window.open(image.fileUrl, '_blank');
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-5xl p-0 overflow-hidden bg-white border-0 shadow-2xl">
        <div className="flex flex-col md:flex-row h-full max-h-[90vh]">

          {/* ── Image panel ── */}
          <div className="relative flex-1 bg-zinc-950 flex items-center justify-center min-h-[280px] md:min-h-[560px]">
            <img
              src={image.fileUrl}
              alt={`${image.genus} ${image.species}`}
              className="max-h-[560px] max-w-full object-contain select-none"
              draggable={false}
            />

            {/* Nav arrows */}
            {images.length > 1 && (
              <>
                <button onClick={onPrev}
                  className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/25 backdrop-blur-sm text-white rounded-full p-2.5 transition-all hover:scale-110">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button onClick={onNext}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/25 backdrop-blur-sm text-white rounded-full p-2.5 transition-all hover:scale-110">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}

            {/* Counter pill */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full font-mono tracking-wider">
              {currentIndex + 1} / {images.length}
            </div>

            {/* Top actions */}
            <div className="absolute top-3 right-3 flex items-center gap-1.5">
              <button onClick={handleDownload}
                className="bg-white/10 hover:bg-white/25 backdrop-blur-sm text-white rounded-full p-2 transition-all"
                title="Télécharger">
                <Download className="w-4 h-4" />
              </button>
              <a href={image.fileUrl} target="_blank" rel="noopener noreferrer"
                className="bg-white/10 hover:bg-white/25 backdrop-blur-sm text-white rounded-full p-2 transition-all"
                title="Ouvrir en plein écran">
                <Maximize2 className="w-4 h-4" />
              </a>
            </div>

            {/* Verified pill */}
            <div className={`absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-sm ${
              image.isVerified ? 'bg-emerald-500/90 text-white' : 'bg-amber-500/90 text-white'
            }`}>
              {image.isVerified ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
              {image.isVerified ? 'Vérifié' : 'En attente'}
            </div>
          </div>

          {/* ── Info panel ── */}
          <div className="w-full md:w-80 flex flex-col border-l border-zinc-100">
            {/* Header */}
            <div className="p-5 border-b border-zinc-100 bg-zinc-50">
              <p className="text-lg font-semibold italic text-zinc-800 leading-tight">
                {image.genus} {image.species}
              </p>
              {image.cultivar && (
                <p className="text-sm text-zinc-500 mt-0.5 not-italic">cv. {image.cultivar}</p>
              )}
              <div className="flex items-center gap-2 mt-3">
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded border text-xs font-medium ${typeConfig.color}`}>
                  {typeConfig.icon} {typeConfig.label}
                </span>
              </div>
              {/* Link to plant sheet */}
              {image.plantId && (
                <Link href={`/plants/${image.plantId}`}
                  className="inline-flex items-center gap-1.5 mt-3 text-xs text-primary hover:underline font-medium">
                  <Sprout className="w-3.5 h-3.5" />
                  Voir la fiche plante
                </Link>
              )}
            </div>

            {/* Metadata */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 text-sm">
              {image.description && (
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
                    <Info className="w-3 h-3" /> Description
                  </p>
                  <p className="text-zinc-600 leading-relaxed">{image.description}</p>
                </div>
              )}

              {image.source && (
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
                    <BookOpen className="w-3 h-3" /> Source
                  </p>
                  <p className="text-zinc-600">{image.source}</p>
                  {image.sourceUrl && (
                    <a href={image.sourceUrl} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 hover:underline mt-0.5">
                      <ExternalLink className="w-3 h-3" /> Voir la source
                    </a>
                  )}
                </div>
              )}

              {image.attribution && (
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
                    <Camera className="w-3 h-3" /> Attribution
                  </p>
                  <p className="text-zinc-600">{image.attribution}</p>
                </div>
              )}

              {/* Terroir */}
              {image.terroirName && (
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
                    <Globe className="w-3 h-3" /> Terroir
                  </p>
                  <p className="text-zinc-600 flex items-center gap-1.5">
                    <span>{image.terroirName}</span>
                  </p>
                </div>
              )}

              <div className="space-y-1">
                <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">Ajoutée le</p>
                <p className="text-zinc-600">
                  {image.createdAt ? new Date(image.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="p-4 border-t border-zinc-100 space-y-2">
              <PlantLinkButton imageId={image.id} currentPlantId={image.plantId} onSuccess={() => onClose()} />
              {!image.isVerified && (
                <Button size="sm" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                  onClick={() => { onVerify(image.id, true); onClose(); }}>
                  <CheckCircle2 className="w-4 h-4 mr-2" /> Marquer comme vérifié
                </Button>
              )}
              {image.isVerified && (
                <Button size="sm" variant="outline" className="w-full text-amber-600 border-amber-200 hover:bg-amber-50"
                  onClick={() => { onVerify(image.id, false); onClose(); }}>
                  <AlertCircle className="w-4 h-4 mr-2" /> Retirer la vérification
                </Button>
              )}
              <Button size="sm" variant="outline" className="w-full text-red-600 border-red-200 hover:bg-red-50"
                onClick={() => { if (confirm('Supprimer cette image ?')) { onDelete(image.id); onClose(); } }}>
                <Trash2 className="w-4 h-4 mr-2" /> Supprimer
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// IMAGE CARD
// ─────────────────────────────────────────────────────────────────────────────

function ImageCard({
  image, onClick, gridSize, selected, onSelect, selectionMode,
}: {
  image: any; onClick: () => void; gridSize: GridSize;
  selected: boolean; onSelect: (id: number) => void; selectionMode: boolean;
}) {
  const typeConfig = IMAGE_TYPE_CONFIG[image.imageType] || IMAGE_TYPE_CONFIG.other;
  const [imgError, setImgError] = useState(false);
  const heightClass = gridSize === 'compact' ? 'h-28' : gridSize === 'large' ? 'h-52' : 'h-40';

  return (
    <div
      className={`group relative rounded-xl overflow-hidden border transition-all duration-200 cursor-pointer bg-card ${
        selected
          ? 'border-primary ring-2 ring-primary/30 shadow-md'
          : 'border-border hover:border-primary/50 hover:shadow-lg'
      }`}
      onClick={() => selectionMode ? onSelect(image.id) : onClick()}
    >
      {/* Selection checkbox */}
      {selectionMode && (
        <div className="absolute top-2 left-2 z-10" onClick={e => { e.stopPropagation(); onSelect(image.id); }}>
          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
            selected ? 'bg-primary border-primary' : 'bg-white/80 border-zinc-300 backdrop-blur-sm'
          }`}>
            {selected && <CheckCircle2 className="w-3 h-3 text-white" />}
          </div>
        </div>
      )}

      {/* Image */}
      <div className={`relative ${heightClass} overflow-hidden`}>
        {imgError ? (
          <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-100 text-zinc-400">
            <ImageIcon className="w-8 h-8 mb-1" />
          </div>
        ) : (
          <img
            src={image.fileUrl}
            alt={`${image.genus} ${image.species}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImgError(true)}
          />
        )}

        {/* Hover overlay */}
        {!selectionMode && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-2.5">
              <ZoomIn className="w-5 h-5 text-white" />
            </div>
          </div>
        )}

        {/* Status dot */}
        <div className={`absolute top-2 right-2 w-2.5 h-2.5 rounded-full border-2 border-white shadow ${
          image.isVerified ? 'bg-emerald-500' : 'bg-amber-400'
        }`} title={image.isVerified ? 'Vérifié' : 'En attente'} />

        {/* Type badge */}
        <div className={`absolute bottom-2 left-2 inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-semibold border backdrop-blur-sm ${typeConfig.color}`}>
          {typeConfig.icon} {typeConfig.label}
        </div>
      </div>

      {/* Caption */}
      <div className="px-2.5 py-2">
        <p className="text-xs font-semibold italic text-foreground truncate leading-tight">
          {image.genus} {image.species}
        </p>
        {image.cultivar && (
          <p className="text-[10px] text-muted-foreground truncate mt-0.5">cv. {image.cultivar}</p>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// IMAGE GALLERY
// ─────────────────────────────────────────────────────────────────────────────

function ImageGallery({
  images, onVerify, onDelete, isLoading, gridSize,
  selectedIds, onSelect, selectionMode,
}: {
  images: any[]; onVerify: (id: number, v: boolean) => void;
  onDelete: (id: number) => void; isLoading: boolean; gridSize: GridSize;
  selectedIds: Set<number>; onSelect: (id: number) => void; selectionMode: boolean;
}) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
      <Loader2 className="w-8 h-8 animate-spin mb-3" />
      <p className="text-sm">Chargement des images…</p>
    </div>
  );

  if (images.length === 0) return (
    <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
      <ImageIcon className="w-14 h-14 mb-4 opacity-20" />
      <p className="text-sm font-medium">Aucune image correspondante</p>
      <p className="text-xs mt-1">Modifiez les filtres ou uploadez une nouvelle image</p>
    </div>
  );

  const colsClass = gridSize === 'compact'
    ? 'grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8'
    : gridSize === 'large'
    ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
    : 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6';

  return (
    <>
      <div className={`grid ${colsClass} gap-2.5`}>
        {images.map((image, idx) => (
          <ImageCard
            key={image.id}
            image={image}
            onClick={() => setLightboxIndex(idx)}
            gridSize={gridSize}
            selected={selectedIds.has(image.id)}
            onSelect={onSelect}
            selectionMode={selectionMode}
          />
        ))}
      </div>

      {lightboxIndex !== null && (
        <Lightbox
          images={images}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onPrev={() => setLightboxIndex(i => (i! - 1 + images.length) % images.length)}
          onNext={() => setLightboxIndex(i => (i! + 1) % images.length)}
          onVerify={onVerify}
          onDelete={onDelete}
        />
      )}
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TROPICOS IMAGE BROWSER
// ─────────────────────────────────────────────────────────────────────────────

function TropicosImageBrowser() {
  const { toast } = useToast();
  const [searchName, setSearchName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNameId, setSelectedNameId] = useState<number | null>(null);
  const [selectedPlantName, setSelectedPlantName] = useState('');

  const searchResults = trpc.tropicosEnrichment.searchName.useQuery(
    { name: searchQuery, limit: 10 },
    { enabled: searchQuery.length >= 3 }
  );

  const imagesQuery = trpc.tropicosEnrichment.getImages.useQuery(
    { nameId: selectedNameId!, limit: 20 },
    { enabled: selectedNameId !== null }
  );

  const handleSearch = () => {
    if (searchName.trim().length < 3) {
      toast({ title: 'Erreur', description: 'Entrez au moins 3 caractères', variant: 'destructive' });
      return;
    }
    setSearchQuery(searchName.trim());
    setSelectedNameId(null);
  };

  return (
    <div className="space-y-5">
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3">
        <Globe className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" />
        <div className="text-sm text-blue-800">
          <p className="font-semibold mb-0.5">Tropicos — Missouri Botanical Garden</p>
          <p className="text-blue-600 text-xs">685 000+ images botaniques de référence. Sélectionnez une espèce pour parcourir ses images.</p>
        </div>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <Input
            placeholder="ex: Nicotiana tabacum, Cannabis sativa, Rosa damascena"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="pl-9"
          />
        </div>
        <Button onClick={handleSearch} disabled={searchResults.isFetching}>
          {searchResults.isFetching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
          <span className="ml-2">Rechercher</span>
        </Button>
      </div>

      {searchResults.data && searchResults.data.results.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-xs text-zinc-400 font-semibold uppercase tracking-widest">{searchResults.data.total} résultats</p>
          {searchResults.data.results.map((r: any) => (
            <div
              key={String(r.nameId)}
              className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${
                selectedNameId === Number(r.nameId)
                  ? 'bg-primary/5 border-primary shadow-sm'
                  : 'hover:bg-zinc-50 border-zinc-200'
              }`}
              onClick={() => { setSelectedNameId(Number(r.nameId)); setSelectedPlantName(String(r.scientificName || '')); }}
            >
              <div>
                <p className="font-medium italic text-sm text-zinc-800">{String(r.scientificName || '')}</p>
                {r.author && <p className="text-xs text-zinc-400">{String(r.author)}</p>}
              </div>
              <Badge variant="outline" className="text-xs shrink-0">{String(r.nameId)}</Badge>
            </div>
          ))}
        </div>
      )}

      {searchResults.data?.results.length === 0 && searchQuery && (
        <p className="text-center text-zinc-400 py-8 text-sm">Aucun résultat pour « {searchQuery} » dans Tropicos</p>
      )}

      {selectedNameId !== null && (
        <div>
          <p className="text-sm font-semibold italic mb-3 text-zinc-700">
            {selectedPlantName}
            <span className="not-italic font-normal text-zinc-400 ml-2">— {imagesQuery.data?.total || 0} images</span>
          </p>
          {imagesQuery.isLoading && (
            <div className="flex justify-center py-10"><Loader2 className="w-7 h-7 animate-spin text-primary" /></div>
          )}
          {imagesQuery.data?.results.length === 0 && (
            <p className="text-center text-zinc-400 py-8 text-sm">Aucune image disponible pour cette espèce dans Tropicos</p>
          )}
          {imagesQuery.data && imagesQuery.data.results.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {imagesQuery.data.results.map((img: any, idx: number) => (
                <div key={idx} className="group relative rounded-xl overflow-hidden border border-zinc-200 hover:border-zinc-400 hover:shadow-md transition-all bg-zinc-50">
                  {img.thumbnailUrl ? (
                    <img src={String(img.thumbnailUrl)} alt={String(img.caption || selectedPlantName)}
                      className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                  ) : (
                    <div className="w-full h-36 flex items-center justify-center bg-zinc-100">
                      <ImageIcon className="w-8 h-8 text-zinc-300" />
                    </div>
                  )}
                  {img.caption && <p className="text-xs text-zinc-500 truncate px-2.5 py-1.5">{String(img.caption)}</p>}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    {img.largeUrl && (
                      <Button size="sm" variant="secondary" onClick={() => window.open(String(img.largeUrl), '_blank')}>
                        <Eye className="w-3 h-3 mr-1" /> Voir
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// WIKIDATA IMAGE BROWSER
// ─────────────────────────────────────────────────────────────────────────────

function WikidataImageBrowser({ onImportUrl }: { onImportUrl: (url: string, name: string) => void }) {
  const { toast } = useToast();
  const [searchName, setSearchName] = useState('');
  const detailsMutation = trpc.wikidataSync.getTaxonDetails.useMutation();
  const [entity, setEntity] = useState<any | null>(null);

  const handleSearch = async () => {
    if (!searchName.trim()) return;
    try {
      const result = await detailsMutation.mutateAsync({ scientificName: searchName.trim() });
      setEntity(result);
    } catch {
      toast({ title: 'Taxon non trouvé', description: 'Aucune entrée Wikidata pour ce nom', variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-5">
      <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 flex gap-3">
        <Link2 className="w-5 h-5 text-indigo-500 mt-0.5 shrink-0" />
        <div className="text-sm text-indigo-800">
          <p className="font-semibold mb-0.5">Images Wikidata (P18)</p>
          <p className="text-indigo-600 text-xs">Récupérez l'image officielle d'un taxon via Wikidata et importez-la directement dans la galerie locale.</p>
        </div>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <Input
            placeholder="ex: Rosa damascena, Lavandula angustifolia"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="pl-9"
          />
        </div>
        <Button onClick={handleSearch} disabled={detailsMutation.isPending}>
          {detailsMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
          <span className="ml-2">Chercher</span>
        </Button>
      </div>

      {entity && (
        <div className="rounded-xl border border-zinc-200 overflow-hidden">
          <div className="p-4 bg-zinc-50 border-b border-zinc-100 flex items-start justify-between gap-4">
            <div>
              <p className="font-semibold text-lg italic text-zinc-800">{entity.scientificName || entity.label}</p>
              <p className="text-sm text-zinc-500 mt-0.5">{entity.description}</p>
              {entity.id && (
                <a href={`https://www.wikidata.org/wiki/${entity.id}`} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline mt-1.5">
                  <ExternalLink className="w-3 h-3" /> {entity.id}
                </a>
              )}
            </div>
            {entity.conservationStatus && (
              <Badge variant="outline" className="shrink-0">{entity.conservationStatus}</Badge>
            )}
          </div>

          <div className="p-4">
            {entity.imageUrl ? (
              <div className="space-y-3">
                <img src={entity.imageUrl} alt={entity.label}
                  className="max-h-72 w-full object-contain rounded-lg border border-zinc-100 bg-zinc-50" />
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => window.open(entity.imageUrl, '_blank')}>
                    <ExternalLink className="w-4 h-4 mr-2" /> Plein écran
                  </Button>
                  <Button size="sm" onClick={() => {
                    onImportUrl(entity.imageUrl, entity.scientificName || entity.label);
                    toast({ title: 'URL copiée', description: 'Basculez sur l\'onglet "Galerie locale" → "Uploader" pour finaliser.' });
                  }}>
                    <Download className="w-4 h-4 mr-2" /> Utiliser cette image
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-10 text-zinc-400 bg-zinc-50 rounded-lg">
                <ImageIcon className="w-10 h-10 mx-auto mb-2 opacity-30" />
                <p className="text-sm">Aucune image disponible sur Wikidata</p>
                <p className="text-xs mt-1 text-zinc-300">Essayez l'onglet Tropicos pour des alternatives</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// iNATURALIST IMAGE BROWSER
// ─────────────────────────────────────────────────────────────────────────────

function INaturalistImageBrowser() {
  const { toast } = useToast();
  const [searchName, setSearchName] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTaxon, setSelectedTaxon] = useState<any | null>(null);
  const [observations, setObservations] = useState<any[]>([]);
  const [loadingObs, setLoadingObs] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [selectedObservation, setSelectedObservation] = useState<any | null>(null);
  const [selectedPlantId, setSelectedPlantId] = useState<number | null>(null);
  const [selectedPlantName, setSelectedPlantName] = useState<string>('');
  const [plantSearchQuery, setPlantSearchQuery] = useState<string>('');
  const [plantSearchResults, setPlantSearchResults] = useState<Array<{id: number; name: string; latinName: string | null}>>([]);
  const [showPlantDropdown, setShowPlantDropdown] = useState(false);

  const searchPlantsQuery = trpc.varietyImages.searchPlants.useQuery(
    { query: plantSearchQuery, limit: 10 },
    { enabled: plantSearchQuery.length >= 2 }
  );

  // Auto-select first plant result if it matches the iNaturalist taxon name
  const [autoSelectPending, setAutoSelectPending] = useState(false);

  useEffect(() => {
    if (searchPlantsQuery.data) {
      setPlantSearchResults(searchPlantsQuery.data);
      if (autoSelectPending && searchPlantsQuery.data.length > 0 && !selectedPlantId) {
        // Auto-select first result when triggered by taxon selection
        const best = searchPlantsQuery.data[0];
        setSelectedPlantId(best.id);
        setSelectedPlantName(best.name || best.latinName || '');
        setPlantSearchQuery(best.name || best.latinName || '');
        setShowPlantDropdown(false);
        setAutoSelectPending(false);
        toast({ title: '🌿 Plante pré-sélectionnée', description: `${best.name || best.latinName} liée automatiquement` });
      } else {
        setShowPlantDropdown(searchPlantsQuery.data.length > 0);
      }
    }
  }, [searchPlantsQuery.data]);

  const handleSearch = async () => {
    if (!searchName.trim() || searchName.trim().length < 3) {
      toast({ title: 'Erreur', description: 'Entrez au moins 3 caractères', variant: 'destructive' });
      return;
    }
    setIsLoading(true);
    setResults([]);
    setSelectedTaxon(null);
    setObservations([]);
    try {
      const resp = await fetch(
        `https://api.inaturalist.org/v1/taxa?q=${encodeURIComponent(searchName.trim())}&rank=species,subspecies,variety&per_page=10&locale=fr`
      );
      const data = await resp.json();
      setResults(data.results || []);
    } catch {
      toast({ title: 'Erreur', description: 'Impossible de contacter iNaturalist', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectTaxon = async (taxon: any) => {
    setSelectedTaxon(taxon);
    setLoadingObs(true);
    setObservations([]);

    // Auto-search matching PERFUMUM plant by latin name
    const latinName = taxon.name || '';
    if (latinName && !selectedPlantId) {
      setPlantSearchQuery(latinName);
      setAutoSelectPending(true);
    }

    try {
      const resp = await fetch(
        `https://api.inaturalist.org/v1/observations?taxon_id=${taxon.id}&photos=true&per_page=24&order_by=votes&quality_grade=research`
      );
      const data = await resp.json();
      setObservations(data.results || []);
    } catch {
      toast({ title: 'Erreur', description: 'Impossible de charger les observations', variant: 'destructive' });
    } finally {
      setLoadingObs(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* PERFUMUM Plant selector — required before import */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-2">
        <div className="flex items-center gap-2 mb-1">
          <Leaf className="w-4 h-4 text-amber-600" />
          <p className="text-sm font-semibold text-amber-800">Plante PERFUMUM cible <span className="text-red-500">*</span></p>
        </div>
        <p className="text-xs text-amber-600">Sélectionnez la plante PERFUMUM à laquelle lier les images importées</p>
        <div className="relative">
          <Input
            placeholder="Rechercher une plante PERFUMUM (ex: Cannabis, Lavande)..."
            value={plantSearchQuery}
            onChange={(e) => { setPlantSearchQuery(e.target.value); setShowPlantDropdown(true); }}
            onFocus={() => setShowPlantDropdown(plantSearchResults.length > 0)}
            className="bg-white"
          />
          {showPlantDropdown && plantSearchResults.length > 0 && (
            <div className="absolute z-50 w-full mt-1 bg-white border border-zinc-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
              {plantSearchResults.map((p) => (
                <div key={p.id}
                  className="px-3 py-2 hover:bg-zinc-50 cursor-pointer text-sm flex items-center justify-between"
                  onClick={() => {
                    setSelectedPlantId(p.id);
                    setSelectedPlantName(p.name || p.latinName || '');
                    setPlantSearchQuery(p.name || p.latinName || '');
                    setShowPlantDropdown(false);
                  }}>
                  <span className="font-medium">{p.name}</span>
                  {p.latinName && <span className="text-xs text-zinc-400 italic">{p.latinName}</span>}
                </div>
              ))}
            </div>
          )}
        </div>
        {selectedPlantId && (
          <div className="flex items-center gap-2 text-xs text-green-700 bg-green-50 border border-green-200 rounded px-2 py-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Plante sélectionnée : <strong>{selectedPlantName}</strong> (ID: {selectedPlantId})
            <button className="ml-auto text-zinc-400 hover:text-zinc-600" onClick={() => { setSelectedPlantId(null); setSelectedPlantName(''); setPlantSearchQuery(''); }}>✕</button>
          </div>
        )}
      </div>

      <div className="bg-green-50 border border-green-100 rounded-xl p-4 flex gap-3">
        <Sprout className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
        <div className="text-sm text-green-800">
          <p className="font-semibold mb-0.5">iNaturalist — Observations citoyennes</p>
          <p className="text-green-600 text-xs">Millions d'observations photographiques vérifiées par la communauté scientifique. Qualité "Research Grade" uniquement.</p>
        </div>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <Input
            placeholder="ex: Nicotiana tabacum, Cannabis sativa, Lavandula angustifolia"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="pl-9"
          />
        </div>
        <Button onClick={handleSearch} disabled={isLoading}>
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
          <span className="ml-2">Rechercher</span>
        </Button>
      </div>

      {results.length > 0 && !selectedTaxon && (
        <div className="space-y-1.5">
          <p className="text-xs text-zinc-400 font-semibold uppercase tracking-widest">{results.length} taxons trouvés</p>
          {results.map((taxon: any) => (
            <div
              key={taxon.id}
              className="flex items-center gap-3 p-3 rounded-lg border border-zinc-200 hover:bg-zinc-50 hover:border-zinc-300 cursor-pointer transition-all"
              onClick={() => handleSelectTaxon(taxon)}
            >
              {taxon.default_photo?.square_url ? (
                <img src={taxon.default_photo.square_url} alt={taxon.name}
                  className="w-10 h-10 rounded-lg object-cover shrink-0 border border-zinc-100" />
              ) : (
                <div className="w-10 h-10 rounded-lg bg-zinc-100 flex items-center justify-center shrink-0">
                  <Leaf className="w-5 h-5 text-zinc-300" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-medium italic text-sm text-zinc-800 truncate">{taxon.name}</p>
                {taxon.preferred_common_name && (
                  <p className="text-xs text-zinc-500 truncate">{taxon.preferred_common_name}</p>
                )}
              </div>
              <div className="text-right shrink-0">
                <Badge variant="outline" className="text-xs">{taxon.rank}</Badge>
                {taxon.observations_count && (
                  <p className="text-[10px] text-zinc-400 mt-1">{taxon.observations_count.toLocaleString()} obs.</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {results.length === 0 && searchName && !isLoading && (
        <p className="text-center text-zinc-400 py-8 text-sm">Aucun résultat pour « {searchName} » dans iNaturalist</p>
      )}

      {selectedTaxon && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <button onClick={() => { setSelectedTaxon(null); setObservations([]); }}
              className="text-xs text-zinc-500 hover:text-zinc-700 flex items-center gap-1">
              <ChevronLeft className="w-3.5 h-3.5" /> Retour
            </button>
            <p className="text-sm font-semibold italic text-zinc-700">
              {selectedTaxon.name}
              <span className="not-italic font-normal text-zinc-400 ml-2">
                — {selectedTaxon.observations_count?.toLocaleString() || 0} observations
              </span>
            </p>
            <a href={`https://www.inaturalist.org/taxa/${selectedTaxon.id}`}
              target="_blank" rel="noopener noreferrer"
              className="ml-auto text-xs text-blue-600 hover:underline flex items-center gap-1">
              <ExternalLink className="w-3 h-3" /> Voir sur iNaturalist
            </a>
          </div>

          {loadingObs && (
            <div className="flex justify-center py-10"><Loader2 className="w-7 h-7 animate-spin text-primary" /></div>
          )}

          {!loadingObs && observations.length === 0 && (
            <p className="text-center text-zinc-400 py-8 text-sm">Aucune observation avec photo pour ce taxon</p>
          )}

          {!loadingObs && observations.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {observations.map((obs: any) => {
                const photo = obs.photos?.[0];
                if (!photo) return null;
                const medUrl = photo.url?.replace('square', 'medium');
                const largeUrl = photo.url?.replace('square', 'large');
                return (
                  <div key={obs.id} className="group relative rounded-xl overflow-hidden border border-zinc-200 hover:border-green-400 hover:shadow-md transition-all bg-zinc-50">
                    <img src={medUrl} alt={obs.species_guess || selectedTaxon.name}
                      className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                    {obs.place_guess && (
                      <p className="text-[10px] text-zinc-500 truncate px-2 py-1">{obs.place_guess}</p>
                    )}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                      <Button size="sm" variant="secondary" className="text-xs h-7 px-2"
                        onClick={() => window.open(largeUrl, '_blank')}>
                        <Eye className="w-3 h-3 mr-1" /> Voir
                      </Button>
                      <Button size="sm" className="text-xs h-7 px-2 bg-green-600 hover:bg-green-700"
                        onClick={() => {
                          setSelectedObservation(obs);
                          setImportModalOpen(true);
                        }}>
                        <Download className="w-3 h-3 mr-1" /> Importer
                      </Button>
                      <Button size="sm" variant="secondary" className="text-xs h-7 px-2"
                        onClick={() => window.open(`https://www.inaturalist.org/observations/${obs.id}`, '_blank')}>
                        <ExternalLink className="w-3 h-3 mr-1" /> iNat
                      </Button>
                    </div>
                    {/* CC license badge */}
                    {photo.license_code && (
                      <div className="absolute bottom-1 right-1 bg-black/50 text-white text-[9px] px-1 rounded">
                        {photo.license_code}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {selectedObservation && (
        <INaturalistImportModal
          open={importModalOpen}
          onOpenChange={setImportModalOpen}
          photo={{
            id: selectedObservation.id,
            url: selectedObservation.photos?.[0]?.url?.replace('square', 'large') || '',
            attribution: selectedObservation.user?.name || 'Anonyme',
            license: selectedObservation.photos?.[0]?.license_code || 'CC-BY-NC',
            observationId: selectedObservation.id,
            observerName: selectedObservation.user?.name || 'Anonyme',
            latitude: (() => { const loc = selectedObservation.location; if (loc && typeof loc === 'string') { const [lat] = loc.split(','); return parseFloat(lat) || 0; } return selectedObservation.geojson?.coordinates?.[1] || 0; })(),
            longitude: (() => { const loc = selectedObservation.location; if (loc && typeof loc === 'string') { const [, lng] = loc.split(','); return parseFloat(lng) || 0; } return selectedObservation.geojson?.coordinates?.[0] || 0; })(),
            placeGuess: selectedObservation.place_guess || selectedObservation.place_ids?.[0] || undefined,
          }}
          plantId={selectedPlantId || 0}
          onSuccess={() => {
            setImportModalOpen(false);
            setSelectedObservation(null);
            toast({ title: '✅ Image importée', description: `Image liée à ${selectedPlantName || 'la plante sélectionnée'}` });
          }}
        />
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// UPLOAD FORM
// ─────────────────────────────────────────────────────────────────────────────

type ImageTypeValue = 'leaf' | 'flower' | 'fruit' | 'whole_plant' | 'other';
interface BatchFile {
  file: File;
  preview: string;
  status: 'pending' | 'uploading' | 'done' | 'error';
  progress: number;
  error?: string;
  imageType: ImageTypeValue;
}
interface BatchFormState {
  genus: string; species: string; cultivar: string;
  defaultImageType: ImageTypeValue;
  source: string; attribution: string;
  autoVerify: boolean;
  plantId?: number;
  plantLabel?: string;
  terroirId?: number;
  terroirLabel?: string;
}

function UploadForm({ onSuccess }: { onSuccess: () => void; prefillUrl?: string }) {
  const { toast } = useToast();
  const batchUploadMutation = trpc.varietyImages.batchUpload.useMutation();
  const [isOpen, setIsOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<BatchFile[]>([]);
  const [formData, setFormData] = useState<BatchFormState>({
    genus: 'Nicotiana', species: 'tabacum', cultivar: '',
    defaultImageType: 'leaf', source: '', attribution: '',
    autoVerify: false,
  });
  const [selectedPlant, setSelectedPlant] = useState<{ id: number; label: string } | null>(null);
  const [selectedTerroir, setSelectedTerroir] = useState<{ id: number; label: string } | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadDone, setUploadDone] = useState(false);

  const addFiles = useCallback((newFiles: FileList | File[]) => {
    const arr = Array.from(newFiles);
    const valid = arr.filter(f => f.type.startsWith('image/') && f.size <= 10 * 1024 * 1024);
    const invalid = arr.length - valid.length;
    if (invalid > 0) toast({ title: `${invalid} fichier(s) ignoré(s)`, description: 'Format non supporté ou > 10 MB', variant: 'destructive' });
    if (files.length + valid.length > 20) {
      toast({ title: 'Maximum 20 images', description: 'Réduisez la sélection', variant: 'destructive' }); return;
    }
    const newBatch: BatchFile[] = valid.map(f => ({
      file: f, preview: URL.createObjectURL(f), status: 'pending', progress: 0,
      imageType: formData.defaultImageType,
    }));
    setFiles(prev => [...prev, ...newBatch]);
  }, [files.length, toast, formData.defaultImageType]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setIsDragging(false);
    addFiles(e.dataTransfer.files);
  }, [addFiles]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) addFiles(e.target.files);
    e.target.value = '';
  };

  const removeFile = (idx: number) => {
    setFiles(prev => { URL.revokeObjectURL(prev[idx].preview); return prev.filter((_, i) => i !== idx); });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (files.length === 0) { toast({ title: 'Aucun fichier', description: 'Ajoutez au moins une image', variant: 'destructive' }); return; }
    setIsUploading(true);
    setFiles(prev => prev.map(f => ({ ...f, status: 'uploading' as const, progress: 10 })));
    try {
      const filePayloads = await Promise.all(files.map(bf => new Promise<{ fileData: string; fileName: string; mimeType: string; imageType: ImageTypeValue }>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve({
          fileData: (reader.result as string).split(',')[1],
          fileName: bf.file.name,
          mimeType: bf.file.type,
          imageType: bf.imageType,
        });
        reader.onerror = reject;
        reader.readAsDataURL(bf.file);
      })));
      const progressInterval = setInterval(() => {
        setFiles(prev => prev.map(f => f.status === 'uploading' ? { ...f, progress: Math.min(f.progress + 15, 85) } : f));
      }, 400);
      const result = await batchUploadMutation.mutateAsync({
        genus: formData.genus, species: formData.species,
        cultivar: formData.cultivar || undefined,
        source: formData.source || undefined, attribution: formData.attribution || undefined,
        autoVerify: formData.autoVerify,
        plantId: selectedPlant?.id,
        terroirId: selectedTerroir?.id,
        terroirName: selectedTerroir?.label,
        files: filePayloads,
      });
      clearInterval(progressInterval);
      setFiles(prev => prev.map((f, i) => {
        const r = result.results.find(r => r.index === i);
        return r?.success ? { ...f, status: 'done' as const, progress: 100 } : { ...f, status: 'error' as const, progress: 0, error: r?.error };
      }));
      setUploadDone(true);
      toast({ title: `✓ ${result.succeeded}/${result.total} images uploadées`, description: result.failed > 0 ? `${result.failed} erreur(s)` : 'En attente de vérification.' });
      onSuccess();
    } catch {
      setFiles(prev => prev.map(f => ({ ...f, status: 'error' as const, progress: 0, error: 'Erreur serveur' })));
      toast({ title: 'Erreur', description: 'Erreur lors du batch upload', variant: 'destructive' });
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    if (!isUploading) {
      files.forEach(f => URL.revokeObjectURL(f.preview));
      setFiles([]); setUploadDone(false); setIsOpen(false);
      setSelectedPlant(null); setSelectedTerroir(null);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={v => { if (!v) handleClose(); else setIsOpen(true); }}>
      <DialogTrigger asChild>
        <Button className="gap-2 shrink-0">
          <Upload className="w-4 h-4" /> Uploader des images
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-primary" /> Batch upload — images morphologiques
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">Genre *</label>
              <Input value={formData.genus} onChange={e => setFormData(p => ({ ...p, genus: e.target.value }))} placeholder="ex: Nicotiana" required className="mt-1" disabled={isUploading} />
            </div>
            <div>
              <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">Espèce *</label>
              <Input value={formData.species} onChange={e => setFormData(p => ({ ...p, species: e.target.value }))} placeholder="ex: tabacum" required className="mt-1" disabled={isUploading} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">Cultivar</label>
              <Input value={formData.cultivar} onChange={e => setFormData(p => ({ ...p, cultivar: e.target.value }))} placeholder="ex: Basma" className="mt-1" disabled={isUploading} />
            </div>
            <div>
              <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">Type par défaut</label>
              <Select value={formData.defaultImageType} onValueChange={v => setFormData(p => ({ ...p, defaultImageType: v as ImageTypeValue }))} disabled={isUploading}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="leaf">🌿 Feuille</SelectItem>
                  <SelectItem value="flower">🌸 Fleur</SelectItem>
                  <SelectItem value="fruit">🍎 Fruit</SelectItem>
                  <SelectItem value="whole_plant">🌳 Plante entière</SelectItem>
                  <SelectItem value="other">— Autre</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-[10px] text-zinc-400 mt-1">Modifiable par image ci-dessous</p>
            </div>
          </div>
          {/* Plant + Terroir linking */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wide flex items-center gap-1.5">
                <Sprout className="w-3 h-3 text-emerald-500" /> Lier à une plante
              </label>
              <div className="mt-1">
                <PlantAutocomplete value={selectedPlant} onChange={setSelectedPlant} disabled={isUploading} />
              </div>
              <p className="text-[10px] text-zinc-400 mt-1">Active le lien vers la fiche plante</p>
            </div>
            <div>
              <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wide flex items-center gap-1.5">
                <Globe className="w-3 h-3 text-blue-400" /> Terroir / Région
              </label>
              <div className="mt-1">
                <TerroirAutocomplete value={selectedTerroir} onChange={setSelectedTerroir} disabled={isUploading} />
              </div>
              <p className="text-[10px] text-zinc-400 mt-1">Filtre géographique dans la galerie</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">Source</label>
              <Input value={formData.source} onChange={e => setFormData(p => ({ ...p, source: e.target.value }))} placeholder="ex: Wikimedia Commons" className="mt-1" disabled={isUploading} />
            </div>
            <div>
              <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">Attribution / Crédit</label>
              <Input value={formData.attribution} onChange={e => setFormData(p => ({ ...p, attribution: e.target.value }))} placeholder="© Auteur" className="mt-1" disabled={isUploading} />
            </div>
          </div>

          {!isUploading && !uploadDone && (
            <div
              onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                isDragging ? 'border-primary bg-primary/5 scale-[1.01]' : 'border-zinc-200 hover:border-zinc-300'
              }`}
            >
              <input type="file" accept="image/*" multiple className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleInputChange} />
              <Upload className="w-8 h-8 mx-auto mb-2 text-zinc-300" />
              <p className="text-sm text-zinc-500">Glissez des images ici ou <span className="text-primary underline cursor-pointer">parcourez</span></p>
              <p className="text-xs text-zinc-400 mt-1">PNG, JPG, WebP — max 10 MB par fichier — max 20 fichiers</p>
            </div>
          )}

          {files.length > 0 && (
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {files.map((bf, idx) => (
                <div key={idx} className="flex items-center gap-3 p-2.5 rounded-lg border border-zinc-100 bg-zinc-50">
                  <img src={bf.preview} alt="" className="w-10 h-10 object-cover rounded-md shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-zinc-700 truncate">{bf.file.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Select value={bf.imageType} onValueChange={v => setFiles(prev => prev.map((f, i) => i === idx ? { ...f, imageType: v as ImageTypeValue } : f))} disabled={isUploading}>
                        <SelectTrigger className="h-6 text-[10px] w-28 px-2"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="leaf">🌿 Feuille</SelectItem>
                          <SelectItem value="flower">🌸 Fleur</SelectItem>
                          <SelectItem value="fruit">🍎 Fruit</SelectItem>
                          <SelectItem value="whole_plant">🌳 Plante entière</SelectItem>
                          <SelectItem value="other">— Autre</SelectItem>
                        </SelectContent>
                      </Select>
                      {bf.status === 'uploading' && (
                        <div className="flex-1 bg-zinc-200 rounded-full h-1.5">
                          <div className="bg-primary h-1.5 rounded-full transition-all" style={{ width: `${bf.progress}%` }} />
                        </div>
                      )}
                      {bf.status === 'done' && <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />}
                      {bf.status === 'error' && <AlertCircle className="w-4 h-4 text-red-500 shrink-0" title={bf.error} />}
                    </div>
                  </div>
                  {!isUploading && bf.status === 'pending' && (
                    <button type="button" onClick={() => removeFile(idx)} className="text-zinc-400 hover:text-red-500 transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center gap-2">
            <Checkbox
              id="autoVerify"
              checked={formData.autoVerify}
              onCheckedChange={v => setFormData(p => ({ ...p, autoVerify: !!v }))}
              disabled={isUploading}
            />
            <label htmlFor="autoVerify" className="text-sm text-zinc-600 cursor-pointer">
              Marquer automatiquement comme vérifié
            </label>
          </div>

          <div className="flex gap-2 pt-1">
            {!uploadDone ? (
              <Button type="submit" className="flex-1" disabled={isUploading || files.length === 0}>
                {isUploading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Upload en cours…</> : <><Upload className="w-4 h-4 mr-2" /> Uploader {files.length > 0 ? `(${files.length})` : ''}</>}
              </Button>
            ) : (
              <Button type="button" onClick={handleClose} className="bg-emerald-600 hover:bg-emerald-700">
                <CheckCircle2 className="w-4 h-4 mr-2" /> Terminé
              </Button>
            )}
            {!isUploading && (
              <Button type="button" variant="outline" onClick={handleClose}>Annuler</Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STATS BAR
// ─────────────────────────────────────────────────────────────────────────────

function StatsBar({ stats }: { stats: any }) {
  if (!stats) return null;
  const items = [
    { label: 'Total', value: stats.total, color: 'text-foreground', bg: 'bg-muted' },
    { label: 'Vérifiées', value: stats.verified, color: 'text-emerald-700 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800' },
    { label: 'En attente', value: stats.unverified, color: 'text-amber-700 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800' },
    { label: 'Genres', value: Object.keys(stats.byGenus || {}).length, color: 'text-blue-700 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800' },
  ];
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {items.map(s => (
        <div key={s.label} className={`${s.bg} rounded-xl px-4 py-4 text-center`}>
          <div className={`text-3xl font-bold tabular-nums ${s.color}`}>{s.value ?? 0}</div>
          <div className="text-xs text-muted-foreground mt-1 font-medium uppercase tracking-wide">{s.label}</div>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FILTER SIDEBAR (desktop) / DRAWER (mobile)
// ─────────────────────────────────────────────────────────────────────────────

function FilterContent({
  searchText, setSearchText,
  filterGenus, setFilterGenus,
  filterType, setFilterType,
  filterVerified, setFilterVerified,
  filterTerroir, setFilterTerroir,
  sortKey, setSortKey,
  genusOptions, terroirOptions, stats,
  onReset, resultCount,
}: {
  searchText: string; setSearchText: (v: string) => void;
  filterGenus: string; setFilterGenus: (v: string) => void;
  filterType: string; setFilterType: (v: string) => void;
  filterVerified: string; setFilterVerified: (v: any) => void;
  filterTerroir: number | null; setFilterTerroir: (v: number | null) => void;
  sortKey: SortKey; setSortKey: (v: SortKey) => void;
  genusOptions: string[]; terroirOptions: { id: number; name: string }[]; stats: any;
  onReset: () => void; resultCount: number;
}) {
  const hasFilters = searchText || filterGenus || filterType !== 'all' || filterVerified !== 'all' || filterTerroir !== null;

  return (
    <div className="space-y-5">
      {/* Search */}
      <div>
        <label className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-2 block">Recherche</label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
          <Input
            placeholder="Genre, espèce, cultivar…"
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            className="pl-8 text-sm h-9"
          />
          {searchText && (
            <button onClick={() => setSearchText('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Sort */}
      <div>
        <label className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-2 block">Tri</label>
        <Select value={sortKey} onValueChange={v => setSortKey(v as SortKey)}>
          <SelectTrigger className="h-9 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date_desc">
              <span className="flex items-center gap-2"><ArrowDown className="w-3 h-3" /> Plus récentes</span>
            </SelectItem>
            <SelectItem value="date_asc">
              <span className="flex items-center gap-2"><ArrowUp className="w-3 h-3" /> Plus anciennes</span>
            </SelectItem>
            <SelectItem value="genus_asc">
              <span className="flex items-center gap-2"><ArrowUpDown className="w-3 h-3" /> Genre A→Z</span>
            </SelectItem>
            <SelectItem value="genus_desc">
              <span className="flex items-center gap-2"><ArrowUpDown className="w-3 h-3" /> Genre Z→A</span>
            </SelectItem>
            <SelectItem value="type">
              <span className="flex items-center gap-2"><Tag className="w-3 h-3" /> Par type</span>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Type filter */}
      <div>
        <label className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-2 block">Type</label>
        <div className="space-y-1">
          {[{ k: 'all', label: 'Tous', icon: null as React.ReactNode, count: stats?.total }].concat(
            Object.entries(IMAGE_TYPE_CONFIG).map(([k, v]) => ({
              k, label: v.label, icon: v.icon, count: stats?.byType?.[k] ?? 0,
            }))
          ).map(item => (
            <button
              key={item.k}
              onClick={() => setFilterType(item.k)}
              className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-sm transition-colors ${
                filterType === item.k
                  ? 'bg-primary text-primary-foreground font-medium'
                  : 'hover:bg-zinc-100 text-zinc-600'
              }`}
            >
              <span className="flex items-center gap-2">
                {item.icon && <span className="opacity-70">{item.icon}</span>}
                {item.label}
              </span>
              {item.count !== undefined && (
                <span className={`text-xs tabular-nums ${filterType === item.k ? 'text-primary-foreground/70' : 'text-zinc-400'}`}>
                  {item.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Verification filter */}
      <div>
        <label className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-2 block">Statut</label>
        <div className="space-y-1">
          {[
            { v: 'all', label: 'Tous', count: stats?.total },
            { v: 'verified', label: 'Vérifiées', count: stats?.verified },
            { v: 'unverified', label: 'En attente', count: stats?.unverified },
          ].map(item => (
            <button
              key={item.v}
              onClick={() => setFilterVerified(item.v)}
              className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-sm transition-colors ${
                filterVerified === item.v
                  ? 'bg-primary text-primary-foreground font-medium'
                  : 'hover:bg-zinc-100 text-zinc-600'
              }`}
            >
              <span className="flex items-center gap-2">
                {item.v === 'verified' && <span className="w-2 h-2 rounded-full bg-emerald-500" />}
                {item.v === 'unverified' && <span className="w-2 h-2 rounded-full bg-amber-400" />}
                {item.v === 'all' && <span className="w-2 h-2 rounded-full bg-zinc-300" />}
                {item.label}
              </span>
              {item.count !== undefined && (
                <span className={`text-xs tabular-nums ${filterVerified === item.v ? 'text-primary-foreground/70' : 'text-zinc-400'}`}>
                  {item.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Genus filter */}
      {genusOptions.length > 0 && (
        <div>
          <label className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-2 block">Genre</label>
          <Select value={filterGenus || 'all'} onValueChange={v => setFilterGenus(v === 'all' ? '' : v)}>
            <SelectTrigger className="h-9 text-sm">
              <SelectValue placeholder="Tous les genres" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les genres</SelectItem>
              {genusOptions.map(g => (
                <SelectItem key={g} value={g}>
                  <span className="italic">{g}</span>
                  <span className="text-zinc-400 ml-2 text-xs not-italic">({stats?.byGenus?.[g] ?? 0})</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Terroir filter */}
      {terroirOptions.length > 0 && (
        <div>
          <label className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-2 block flex items-center gap-1.5">
            <Globe className="w-3 h-3" /> Terroir / Région
          </label>
          <Select
            value={filterTerroir !== null ? String(filterTerroir) : 'all'}
            onValueChange={v => setFilterTerroir(v === 'all' ? null : Number(v))}
          >
            <SelectTrigger className="h-9 text-sm">
              <SelectValue placeholder="Tous les terroirs" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les terroirs</SelectItem>
              {terroirOptions.map(t => (
                <SelectItem key={t.id} value={String(t.id)}>
                  {t.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Result count + reset */}
      <div className="pt-2 border-t border-zinc-100 space-y-2">
        <p className="text-xs text-zinc-400 text-center">
          <span className="font-semibold text-zinc-600">{resultCount}</span> image{resultCount !== 1 ? 's' : ''}
        </p>
        {hasFilters && (
          <Button variant="ghost" size="sm" className="w-full text-xs text-zinc-500" onClick={onReset}>
            <X className="w-3 h-3 mr-1" /> Réinitialiser les filtres
          </Button>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// BATCH ACTIONS BAR
// ─────────────────────────────────────────────────────────────────────────────

function BatchActionsBar({
  selectedCount, totalCount,
  onSelectAll, onDeselectAll,
  onVerifyAll, onDeleteAll,
  onExitSelection,
}: {
  selectedCount: number; totalCount: number;
  onSelectAll: () => void; onDeselectAll: () => void;
  onVerifyAll: () => void; onDeleteAll: () => void;
  onExitSelection: () => void;
}) {
  return (
    <div className="flex items-center gap-3 px-4 py-2.5 bg-primary/5 border border-primary/20 rounded-xl">
      <div className="flex items-center gap-2">
        <button onClick={selectedCount === totalCount ? onDeselectAll : onSelectAll}
          className="text-primary hover:text-primary/80 transition-colors">
          {selectedCount === totalCount
            ? <CheckSquare className="w-4 h-4" />
            : <Square className="w-4 h-4" />
          }
        </button>
        <span className="text-sm font-medium text-primary">
          {selectedCount} sélectionné{selectedCount > 1 ? 's' : ''}
        </span>
      </div>

      <div className="flex items-center gap-2 ml-auto">
        {selectedCount > 0 && (
          <>
            <BulkLinkButton selectedIds={selectedIds} onSuccess={onExitSelection} />
            <Button size="sm" variant="outline" className="h-8 text-xs text-emerald-700 border-emerald-200 hover:bg-emerald-50"
              onClick={onVerifyAll}>
              <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" /> Vérifier ({selectedCount})
            </Button>
            <Button size="sm" variant="outline" className="h-8 text-xs text-red-600 border-red-200 hover:bg-red-50"
              onClick={onDeleteAll}>
              <Trash2 className="w-3.5 h-3.5 mr-1.5" /> Supprimer ({selectedCount})
            </Button>
          </>
        )}
        <Button size="sm" variant="ghost" className="h-8 text-xs text-zinc-500" onClick={onExitSelection}>
          <X className="w-3.5 h-3.5 mr-1" /> Quitter la sélection
        </Button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGINATION
// ─────────────────────────────────────────────────────────────────────────────

function Pagination({
  currentPage, totalPages, totalItems, pageSize,
  onPageChange,
}: {
  currentPage: number; totalPages: number; totalItems: number; pageSize: number;
  onPageChange: (p: number) => void;
}) {
  if (totalPages <= 1) return null;
  const start = (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, totalItems);

  const pages: (number | '...')[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (currentPage > 3) pages.push('...');
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) pages.push(i);
    if (currentPage < totalPages - 2) pages.push('...');
    pages.push(totalPages);
  }

  return (
    <div className="flex items-center justify-between pt-4 border-t border-zinc-100">
      <p className="text-xs text-zinc-400">
        {start}–{end} sur <span className="font-semibold text-zinc-600">{totalItems}</span> images
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-1.5 rounded-lg hover:bg-zinc-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        {pages.map((p, i) => (
          p === '...'
            ? <span key={`dots-${i}`} className="px-1 text-zinc-400 text-sm">…</span>
            : <button
                key={p}
                onClick={() => onPageChange(p as number)}
                className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                  p === currentPage
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-zinc-100 text-zinc-600'
                }`}
              >
                {p}
              </button>
        ))}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-1.5 rounded-lg hover:bg-zinc-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────

export default function VarietyImagesAdmin() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('gallery');
  const [searchText, setSearchText] = useState('');
  const [filterGenus, setFilterGenus] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterVerified, setFilterVerified] = useState<'all' | 'verified' | 'unverified'>('all');
  const [sortKey, setSortKey] = useState<SortKey>('date_desc');
  const [prefillUrl, setPrefillUrl] = useState<string | undefined>();
  const [gridSize, setGridSize] = useState<GridSize>('normal');
  const [currentPage, setCurrentPage] = useState(1);

  // Batch selection
  const [filterTerroir, setFilterTerroir] = useState<number | null>(null);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  const allImagesQuery = trpc.varietyImages.getAll.useQuery({
    isVerified: filterVerified === 'all' ? undefined : filterVerified === 'verified',
    genus: filterGenus || undefined,
    terroirId: filterTerroir ?? undefined,
    limit: 500, // Fetch all, paginate client-side
  });

  const terroirsWithImagesQuery = trpc.varietyImages.getTerroirsWithImages.useQuery();

  const statsQuery = trpc.varietyImages.getStats.useQuery();

  const verifyMutation = trpc.varietyImages.verify.useMutation({
    onSuccess: () => { toast({ title: '✓ Image vérifiée' }); allImagesQuery.refetch(); statsQuery.refetch(); },
  });

  const deleteMutation = trpc.varietyImages.delete.useMutation({
    onSuccess: () => { toast({ title: 'Image supprimée' }); allImagesQuery.refetch(); statsQuery.refetch(); },
  });

  // Filter + sort
  const filteredImages = useMemo(() => {
    let imgs = allImagesQuery.data || [];
    if (searchText.trim()) {
      const q = searchText.toLowerCase();
      imgs = imgs.filter(i => `${i.genus} ${i.species} ${i.cultivar || ''}`.toLowerCase().includes(q));
    }
    if (filterType !== 'all') {
      imgs = imgs.filter(i => i.imageType === filterType);
    }
    // Sort
    imgs = [...imgs].sort((a, b) => {
      switch (sortKey) {
        case 'date_desc': return (b.createdAt || 0) - (a.createdAt || 0);
        case 'date_asc': return (a.createdAt || 0) - (b.createdAt || 0);
        case 'genus_asc': return `${a.genus} ${a.species}`.localeCompare(`${b.genus} ${b.species}`);
        case 'genus_desc': return `${b.genus} ${b.species}`.localeCompare(`${a.genus} ${a.species}`);
        case 'type': return (a.imageType || '').localeCompare(b.imageType || '');
        default: return 0;
      }
    });
    return imgs;
  }, [allImagesQuery.data, searchText, filterType, sortKey]);

  // Reset page when filters change
  useEffect(() => { setCurrentPage(1); }, [searchText, filterType, filterVerified, filterGenus, sortKey, filterTerroir]);

  // Pagination
  const totalPages = Math.ceil(filteredImages.length / PAGE_SIZE);
  const pagedImages = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredImages.slice(start, start + PAGE_SIZE);
  }, [filteredImages, currentPage]);

  const stats = statsQuery.data;
  const genusOptions = useMemo(() => {
    if (!stats?.byGenus) return [];
    return Object.keys(stats.byGenus).sort();
  }, [stats]);

  const handleReset = useCallback(() => {
    setSearchText(''); setFilterGenus(''); setFilterType('all'); setFilterVerified('all'); setSortKey('date_desc'); setFilterTerroir(null);
  }, []);

  // Selection handlers
  const handleSelect = useCallback((id: number) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }, []);

  const handleSelectAll = useCallback(() => {
    setSelectedIds(new Set(pagedImages.map(i => i.id)));
  }, [pagedImages]);

  const handleDeselectAll = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  const handleExitSelection = useCallback(() => {
    setSelectionMode(false);
    setSelectedIds(new Set());
  }, []);

  const handleBatchVerify = useCallback(async () => {
    if (selectedIds.size === 0) return;
    if (!confirm(`Vérifier ${selectedIds.size} image(s) ?`)) return;
    for (const id of selectedIds) {
      await verifyMutation.mutateAsync({ id, isVerified: true });
    }
    toast({ title: `✓ ${selectedIds.size} image(s) vérifiée(s)` });
    setSelectedIds(new Set());
    setSelectionMode(false);
  }, [selectedIds, verifyMutation, toast]);

  const handleBatchDelete = useCallback(async () => {
    if (selectedIds.size === 0) return;
    if (!confirm(`Supprimer ${selectedIds.size} image(s) définitivement ?`)) return;
    for (const id of selectedIds) {
      await deleteMutation.mutateAsync({ id });
    }
    toast({ title: `${selectedIds.size} image(s) supprimée(s)` });
    setSelectedIds(new Set());
    setSelectionMode(false);
  }, [selectedIds, deleteMutation, toast]);

  const terroirOptions = useMemo(() => terroirsWithImagesQuery.data || [], [terroirsWithImagesQuery.data]);

  const filterProps = {
    searchText, setSearchText,
    filterGenus, setFilterGenus,
    filterType, setFilterType,
    filterVerified, setFilterVerified,
    filterTerroir, setFilterTerroir,
    sortKey, setSortKey,
    genusOptions, terroirOptions, stats,
    onReset: handleReset,
    resultCount: filteredImages.length,
  };

  return (
    <div className="min-h-screen bg-background">
      {/* ── Page header ── */}
      <div className="bg-card border-b border-border px-4 sm:px-6 py-4 sm:py-5">
        <div className="max-w-screen-xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-primary" />
              Images morphologiques
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">Galerie botanique — feuilles, fleurs, fruits, plantes entières</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {/* Grid size toggle */}
            <div className="flex items-center border border-border rounded-lg p-0.5 bg-muted/50">
              {([
                { size: 'compact' as GridSize, icon: <Grid3X3 className="w-3.5 h-3.5" />, title: 'Compact' },
                { size: 'normal' as GridSize, icon: <LayoutGrid className="w-3.5 h-3.5" />, title: 'Normal' },
                { size: 'large' as GridSize, icon: <Maximize2 className="w-3.5 h-3.5" />, title: 'Large' },
              ]).map(({ size, icon, title }) => (
                <button
                  key={size}
                  title={title}
                  onClick={() => setGridSize(size)}
                  className={`p-1.5 rounded-md transition-colors ${
                    gridSize === size ? 'bg-white shadow-sm text-primary' : 'text-zinc-400 hover:text-zinc-600'
                  }`}
                >
                  {icon}
                </button>
              ))}
            </div>

            {/* Selection mode toggle */}
            <Button
              variant={selectionMode ? 'default' : 'outline'}
              size="sm"
              onClick={() => { setSelectionMode(!selectionMode); if (selectionMode) setSelectedIds(new Set()); }}
              className="gap-1.5"
            >
              <CheckSquare className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sélection</span>
            </Button>

            {/* Mobile filter drawer */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1.5 lg:hidden">
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Filtres</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 overflow-y-auto">
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-2">
                    <Filter className="w-4 h-4" /> Filtres
                  </SheetTitle>
                </SheetHeader>
                <div className="mt-5">
                  <FilterContent {...filterProps} />
                </div>
              </SheetContent>
            </Sheet>

            <UploadForm onSuccess={() => allImagesQuery.refetch()} prefillUrl={prefillUrl} />
          </div>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-5 space-y-4">
        {/* Stats */}
        <StatsBar stats={stats} />

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-white border border-zinc-200 p-1 h-auto rounded-xl flex-wrap gap-1">
            <TabsTrigger value="gallery" className="rounded-lg text-sm px-3 py-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <ImageIcon className="w-3.5 h-3.5 mr-1.5" /> Galerie locale
            </TabsTrigger>
            <TabsTrigger value="tropicos" className="rounded-lg text-sm px-3 py-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Globe className="w-3.5 h-3.5 mr-1.5" /> Tropicos
            </TabsTrigger>
            <TabsTrigger value="wikidata" className="rounded-lg text-sm px-3 py-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Link2 className="w-3.5 h-3.5 mr-1.5" /> Wikidata
            </TabsTrigger>
            <TabsTrigger value="inaturalist" className="rounded-lg text-sm px-3 py-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Sprout className="w-3.5 h-3.5 mr-1.5" /> iNaturalist
            </TabsTrigger>
          </TabsList>

          {/* ── GALLERY TAB ── */}
          <TabsContent value="gallery" className="mt-4">
            <div className="flex gap-5">
              {/* Sidebar — desktop only */}
              <aside className="w-56 shrink-0 space-y-5 hidden lg:block">
                <FilterContent {...filterProps} />
              </aside>

              {/* Main content */}
              <div className="flex-1 min-w-0 space-y-3">
                {/* Batch actions bar */}
                {selectionMode && (
                  <BatchActionsBar
                    selectedCount={selectedIds.size}
                    totalCount={pagedImages.length}
                    onSelectAll={handleSelectAll}
                    onDeselectAll={handleDeselectAll}
                    onVerifyAll={handleBatchVerify}
                    onDeleteAll={handleBatchDelete}
                    onExitSelection={handleExitSelection}
                  />
                )}

                <ImageGallery
                  images={pagedImages}
                  onVerify={(id, v) => verifyMutation.mutate({ id, isVerified: v })}
                  onDelete={(id) => { if (confirm('Supprimer cette image ?')) deleteMutation.mutate({ id }); }}
                  isLoading={allImagesQuery.isLoading}
                  gridSize={gridSize}
                  selectedIds={selectedIds}
                  onSelect={handleSelect}
                  selectionMode={selectionMode}
                />

                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={filteredImages.length}
                  pageSize={PAGE_SIZE}
                  onPageChange={setCurrentPage}
                />
              </div>
            </div>
          </TabsContent>

          {/* ── TROPICOS TAB ── */}
          <TabsContent value="tropicos" className="mt-4">
            <TropicosImageBrowser />
          </TabsContent>

          {/* ── WIKIDATA TAB ── */}
          <TabsContent value="wikidata" className="mt-4">
            <WikidataImageBrowser
              onImportUrl={(url, name) => {
                setPrefillUrl(url);
                setActiveTab('gallery');
              }}
            />
          </TabsContent>

          {/* ── iNATURALIST TAB ── */}
          <TabsContent value="inaturalist" className="mt-4">
            <INaturalistImageBrowser />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
