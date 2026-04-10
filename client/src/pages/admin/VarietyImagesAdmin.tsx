/**
 * VarietyImagesAdmin.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Admin page for managing morphological images of plant varieties
 * Design: Swiss Modern — sidebar filters, masonry grid, rich lightbox
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { trpc } from '@/lib/trpc';
import { useToast } from '@/hooks/use-toast';
import {
  Upload, CheckCircle2, AlertCircle, Trash2, Eye, Download, Search,
  ExternalLink, ImageIcon, Loader2, X, ChevronLeft, ChevronRight,
  Leaf, Flower2, Apple, TreePine, MoreHorizontal, Link2, Filter,
  SlidersHorizontal, Grid3X3, LayoutGrid, Maximize2, Info, Camera,
  Tag, Globe, BookOpen, ZoomIn,
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
  whole_plant: { label: 'Plante entière', icon: <TreePine className="w-3 h-3" />,        color: 'bg-teal-50 text-teal-700 border-teal-200',           dot: 'bg-teal-500' },
  other:       { label: 'Autre',          icon: <MoreHorizontal className="w-3 h-3" />,  color: 'bg-slate-50 text-slate-600 border-slate-200',        dot: 'bg-slate-400' },
};

type GridSize = 'compact' | 'normal' | 'large';

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

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onPrev, onNext, onClose]);

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

            {/* Open full size */}
            <a href={image.fileUrl} target="_blank" rel="noopener noreferrer"
              className="absolute top-3 right-3 bg-white/10 hover:bg-white/25 backdrop-blur-sm text-white rounded-full p-2 transition-all">
              <Maximize2 className="w-4 h-4" />
            </a>

            {/* Verified / unverified pill */}
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

              <div className="space-y-1">
                <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">Ajoutée le</p>
                <p className="text-zinc-600">
                  {image.createdAt ? new Date(image.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="p-4 border-t border-zinc-100 space-y-2">
              {!image.isVerified && (
                <Button size="sm" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                  onClick={() => { onVerify(image.id, true); onClose(); }}>
                  <CheckCircle2 className="w-4 h-4 mr-2" /> Marquer comme vérifié
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

function ImageCard({ image, onClick, gridSize }: { image: any; onClick: () => void; gridSize: GridSize }) {
  const typeConfig = IMAGE_TYPE_CONFIG[image.imageType] || IMAGE_TYPE_CONFIG.other;
  const [imgError, setImgError] = useState(false);

  const heightClass = gridSize === 'compact' ? 'h-28' : gridSize === 'large' ? 'h-52' : 'h-40';

  return (
    <div
      className="group relative rounded-xl overflow-hidden border border-zinc-200 hover:border-zinc-400 hover:shadow-lg transition-all duration-200 cursor-pointer bg-zinc-50"
      onClick={onClick}
    >
      {/* Image */}
      <div className={`relative ${heightClass} overflow-hidden`}>
        {imgError ? (
          <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-100 text-zinc-400">
            <ImageIcon className="w-8 h-8 mb-1" />
            <span className="text-xs">Indisponible</span>
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
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
          <div className="bg-white/20 backdrop-blur-sm rounded-full p-2.5">
            <ZoomIn className="w-5 h-5 text-white" />
          </div>
        </div>

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
        <p className="text-xs font-semibold italic text-zinc-700 truncate leading-tight">
          {image.genus} {image.species}
        </p>
        {image.cultivar && (
          <p className="text-[10px] text-zinc-400 truncate mt-0.5">cv. {image.cultivar}</p>
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
}: {
  images: any[]; onVerify: (id: number, v: boolean) => void;
  onDelete: (id: number) => void; isLoading: boolean; gridSize: GridSize;
}) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center py-20 text-zinc-400">
      <Loader2 className="w-8 h-8 animate-spin mb-3" />
      <p className="text-sm">Chargement des images…</p>
    </div>
  );

  if (images.length === 0) return (
    <div className="flex flex-col items-center justify-center py-20 text-zinc-400">
      <ImageIcon className="w-14 h-14 mb-4 opacity-20" />
      <p className="text-sm font-medium">Aucune image correspondante</p>
      <p className="text-xs mt-1 text-zinc-300">Modifiez les filtres ou uploadez une nouvelle image</p>
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
          {/* Entity header */}
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

          {/* Image */}
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
// UPLOAD FORM
// ─────────────────────────────────────────────────────────────────────────────

interface UploadFormState {
  genus: string; species: string; cultivar: string;
  imageType: 'leaf' | 'flower' | 'fruit' | 'whole_plant' | 'other';
  description: string; source: string; sourceUrl: string; attribution: string;
  file: File | null;
}

function UploadForm({ onSuccess, prefillUrl }: { onSuccess: () => void; prefillUrl?: string }) {
  const { toast } = useToast();
  const uploadMutation = trpc.varietyImages.upload.useMutation();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<UploadFormState>({
    genus: 'Nicotiana', species: 'tabacum', cultivar: '',
    imageType: 'leaf', description: '', source: '', sourceUrl: prefillUrl || '', attribution: '', file: null,
  });
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast({ title: 'Erreur', description: 'Fichier image requis', variant: 'destructive' }); return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast({ title: 'Erreur', description: 'Taille max : 10 MB', variant: 'destructive' }); return;
    }
    setFormData(prev => ({ ...prev, file }));
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.file) {
      toast({ title: 'Erreur', description: 'Sélectionnez un fichier', variant: 'destructive' }); return;
    }
    const reader = new FileReader();
    reader.onload = async () => {
      const base64Data = (reader.result as string).split(',')[1];
      try {
        await uploadMutation.mutateAsync({
          genus: formData.genus, species: formData.species,
          cultivar: formData.cultivar || undefined, imageType: formData.imageType,
          fileData: base64Data, fileName: formData.file!.name, mimeType: formData.file!.type,
          description: formData.description || undefined, source: formData.source || undefined,
          sourceUrl: formData.sourceUrl || undefined, attribution: formData.attribution || undefined,
        });
        toast({ title: '✓ Image uploadée', description: 'En attente de vérification.' });
        setIsOpen(false);
        setPreview(null);
        setFormData({ genus: 'Nicotiana', species: 'tabacum', cultivar: '', imageType: 'leaf', description: '', source: '', sourceUrl: '', attribution: '', file: null });
        onSuccess();
      } catch {
        toast({ title: 'Erreur', description: 'Erreur lors de l\'upload', variant: 'destructive' });
      }
    };
    reader.readAsDataURL(formData.file);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 shrink-0">
          <Upload className="w-4 h-4" /> Uploader une image
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-primary" /> Uploader une image morphologique
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">Genre *</label>
              <Input value={formData.genus} onChange={e => setFormData(p => ({ ...p, genus: e.target.value }))} placeholder="ex: Nicotiana" required className="mt-1" />
            </div>
            <div>
              <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">Espèce *</label>
              <Input value={formData.species} onChange={e => setFormData(p => ({ ...p, species: e.target.value }))} placeholder="ex: tabacum" required className="mt-1" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">Cultivar</label>
              <Input value={formData.cultivar} onChange={e => setFormData(p => ({ ...p, cultivar: e.target.value }))} placeholder="ex: Basma" className="mt-1" />
            </div>
            <div>
              <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">Type d'image *</label>
              <Select value={formData.imageType} onValueChange={v => setFormData(p => ({ ...p, imageType: v as UploadFormState['imageType'] }))}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="leaf">🌿 Feuille</SelectItem>
                  <SelectItem value="flower">🌸 Fleur</SelectItem>
                  <SelectItem value="fruit">🍎 Fruit</SelectItem>
                  <SelectItem value="whole_plant">🌳 Plante entière</SelectItem>
                  <SelectItem value="other">— Autre</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* File drop zone */}
          <div>
            <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">Fichier image *</label>
            <div className="mt-1 relative">
              <input type="file" accept="image/*" onChange={handleFileChange} required
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
              <div className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors ${
                formData.file ? 'border-primary bg-primary/5' : 'border-zinc-200 hover:border-zinc-300'
              }`}>
                {preview ? (
                  <div className="space-y-2">
                    <img src={preview} alt="Aperçu" className="max-h-32 mx-auto rounded-lg object-contain" />
                    <p className="text-xs text-zinc-500">{formData.file?.name} ({formData.file ? (formData.file.size / 1024).toFixed(0) : 0} KB)</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <Upload className="w-8 h-8 mx-auto text-zinc-300" />
                    <p className="text-sm text-zinc-500">Glissez une image ou cliquez pour sélectionner</p>
                    <p className="text-xs text-zinc-400">JPG, PNG, WebP — max 10 MB</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">Description</label>
            <Textarea value={formData.description} onChange={e => setFormData(p => ({ ...p, description: e.target.value }))}
              placeholder="Description détaillée de l'image..." rows={2} className="mt-1" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">Source</label>
              <Input value={formData.source} onChange={e => setFormData(p => ({ ...p, source: e.target.value }))} placeholder="ex: Wikimedia Commons" className="mt-1" />
            </div>
            <div>
              <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">URL source</label>
              <Input type="url" value={formData.sourceUrl} onChange={e => setFormData(p => ({ ...p, sourceUrl: e.target.value }))} placeholder="https://..." className="mt-1" />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">Attribution / Crédit</label>
            <Input value={formData.attribution} onChange={e => setFormData(p => ({ ...p, attribution: e.target.value }))} placeholder="© Auteur / Photographe" className="mt-1" />
          </div>
          <div className="flex gap-2 justify-end pt-2 border-t border-zinc-100">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Annuler</Button>
            <Button type="submit" disabled={uploadMutation.isPending}>
              {uploadMutation.isPending ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Upload…</> : 'Uploader'}
            </Button>
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
    { label: 'Total', value: stats.total, color: 'text-zinc-800', bg: 'bg-zinc-100' },
    { label: 'Vérifiées', value: stats.verified, color: 'text-emerald-700', bg: 'bg-emerald-50' },
    { label: 'En attente', value: stats.unverified, color: 'text-amber-700', bg: 'bg-amber-50' },
    { label: 'Genres', value: Object.keys(stats.byGenus || {}).length, color: 'text-blue-700', bg: 'bg-blue-50' },
  ];

  return (
    <div className="grid grid-cols-4 gap-2">
      {items.map(s => (
        <div key={s.label} className={`${s.bg} rounded-xl px-4 py-3 text-center`}>
          <div className={`text-2xl font-bold tabular-nums ${s.color}`}>{s.value}</div>
          <div className="text-xs text-zinc-500 mt-0.5 font-medium">{s.label}</div>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FILTER SIDEBAR
// ─────────────────────────────────────────────────────────────────────────────

function FilterSidebar({
  searchText, setSearchText,
  filterGenus, setFilterGenus,
  filterType, setFilterType,
  filterVerified, setFilterVerified,
  genusOptions, stats,
  onReset, resultCount,
}: {
  searchText: string; setSearchText: (v: string) => void;
  filterGenus: string; setFilterGenus: (v: string) => void;
  filterType: string; setFilterType: (v: string) => void;
  filterVerified: string; setFilterVerified: (v: any) => void;
  genusOptions: string[]; stats: any;
  onReset: () => void; resultCount: number;
}) {
  const hasFilters = searchText || filterGenus || filterType !== 'all' || filterVerified !== 'all';

  return (
    <aside className="w-56 shrink-0 space-y-5">
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

      {/* Type filter */}
      <div>
        <label className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-2 block">Type</label>
        <div className="space-y-1">
          {[{ k: 'all', label: 'Tous', icon: null, count: stats?.total }].concat(
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
    </aside>
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
  const [prefillUrl, setPrefillUrl] = useState<string | undefined>();
  const [gridSize, setGridSize] = useState<GridSize>('normal');

  const allImagesQuery = trpc.varietyImages.getAll.useQuery({
    isVerified: filterVerified === 'all' ? undefined : filterVerified === 'verified',
    genus: filterGenus || undefined,
    limit: 100,
  });

  const statsQuery = trpc.varietyImages.getStats.useQuery();

  const verifyMutation = trpc.varietyImages.verify.useMutation({
    onSuccess: () => { toast({ title: '✓ Image vérifiée' }); allImagesQuery.refetch(); statsQuery.refetch(); },
  });

  const deleteMutation = trpc.varietyImages.delete.useMutation({
    onSuccess: () => { toast({ title: 'Image supprimée' }); allImagesQuery.refetch(); statsQuery.refetch(); },
  });

  const filteredImages = useMemo(() => {
    let imgs = allImagesQuery.data || [];
    if (searchText.trim()) {
      const q = searchText.toLowerCase();
      imgs = imgs.filter(i => `${i.genus} ${i.species} ${i.cultivar || ''}`.toLowerCase().includes(q));
    }
    if (filterType !== 'all') {
      imgs = imgs.filter(i => i.imageType === filterType);
    }
    return imgs;
  }, [allImagesQuery.data, searchText, filterType]);

  const stats = statsQuery.data;
  const genusOptions = useMemo(() => {
    if (!stats?.byGenus) return [];
    return Object.keys(stats.byGenus).sort();
  }, [stats]);

  const handleReset = useCallback(() => {
    setSearchText(''); setFilterGenus(''); setFilterType('all'); setFilterVerified('all');
  }, []);

  return (
    <div className="min-h-screen bg-zinc-50/50">
      {/* ── Page header ── */}
      <div className="bg-white border-b border-zinc-200 px-6 py-5">
        <div className="max-w-screen-xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-zinc-900 flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-primary" />
              Images morphologiques
            </h1>
            <p className="text-sm text-zinc-500 mt-0.5">Galerie botanique — feuilles, fleurs, fruits, plantes entières</p>
          </div>
          <div className="flex items-center gap-2">
            {/* Grid size toggle */}
            <div className="flex items-center border border-zinc-200 rounded-lg p-0.5 bg-zinc-50">
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
            <UploadForm onSuccess={() => allImagesQuery.refetch()} prefillUrl={prefillUrl} />
          </div>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-6 py-6 space-y-5">
        {/* Stats */}
        <StatsBar stats={stats} />

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-white border border-zinc-200 p-1 h-auto rounded-xl">
            <TabsTrigger value="gallery" className="rounded-lg text-sm px-4 py-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <ImageIcon className="w-3.5 h-3.5 mr-1.5" /> Galerie locale
            </TabsTrigger>
            <TabsTrigger value="tropicos" className="rounded-lg text-sm px-4 py-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Globe className="w-3.5 h-3.5 mr-1.5" /> Tropicos
            </TabsTrigger>
            <TabsTrigger value="wikidata" className="rounded-lg text-sm px-4 py-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Link2 className="w-3.5 h-3.5 mr-1.5" /> Wikidata
            </TabsTrigger>
          </TabsList>

          {/* ── GALLERY TAB ── */}
          <TabsContent value="gallery" className="mt-5">
            <div className="flex gap-6">
              {/* Sidebar */}
              <FilterSidebar
                searchText={searchText} setSearchText={setSearchText}
                filterGenus={filterGenus} setFilterGenus={setFilterGenus}
                filterType={filterType} setFilterType={setFilterType}
                filterVerified={filterVerified} setFilterVerified={setFilterVerified}
                genusOptions={genusOptions} stats={stats}
                onReset={handleReset} resultCount={filteredImages.length}
              />

              {/* Gallery */}
              <div className="flex-1 min-w-0">
                <ImageGallery
                  images={filteredImages}
                  onVerify={(id, v) => verifyMutation.mutate({ id, isVerified: v })}
                  onDelete={(id) => { if (confirm('Supprimer cette image ?')) deleteMutation.mutate({ id }); }}
                  isLoading={allImagesQuery.isLoading}
                  gridSize={gridSize}
                />
              </div>
            </div>
          </TabsContent>

          {/* ── TROPICOS TAB ── */}
          <TabsContent value="tropicos" className="mt-5">
            <TropicosImageBrowser />
          </TabsContent>

          {/* ── WIKIDATA TAB ── */}
          <TabsContent value="wikidata" className="mt-5">
            <WikidataImageBrowser
              onImportUrl={(url, name) => {
                setPrefillUrl(url);
                setActiveTab('gallery');
              }}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
