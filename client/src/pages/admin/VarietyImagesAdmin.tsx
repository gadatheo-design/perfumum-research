/**
 * VarietyImagesAdmin.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Admin page for managing morphological images of plant varieties
 * Improved UI: denser grid, real-time search, lightbox, Wikidata images tab
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React, { useState, useCallback, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
  ExternalLink, ImageIcon, Loader2, Filter, X, ChevronLeft, ChevronRight,
  Leaf, Flower2, Apple, TreePine, MoreHorizontal, Link2,
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const IMAGE_TYPE_CONFIG: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  leaf:        { label: 'Feuille',        icon: <Leaf className="w-3 h-3" />,      color: 'bg-green-100 text-green-700 border-green-200' },
  flower:      { label: 'Fleur',          icon: <Flower2 className="w-3 h-3" />,   color: 'bg-pink-100 text-pink-700 border-pink-200' },
  fruit:       { label: 'Fruit',          icon: <Apple className="w-3 h-3" />,     color: 'bg-orange-100 text-orange-700 border-orange-200' },
  whole_plant: { label: 'Plante entière', icon: <TreePine className="w-3 h-3" />,  color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  other:       { label: 'Autre',          icon: <MoreHorizontal className="w-3 h-3" />, color: 'bg-gray-100 text-gray-700 border-gray-200' },
};

// ─────────────────────────────────────────────────────────────────────────────
// LIGHTBOX COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

function Lightbox({
  images,
  currentIndex,
  onClose,
  onPrev,
  onNext,
  onVerify,
  onDelete,
}: {
  images: any[];
  currentIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  onVerify: (id: number, verified: boolean) => void;
  onDelete: (id: number) => void;
}) {
  const image = images[currentIndex];
  if (!image) return null;
  const typeConfig = IMAGE_TYPE_CONFIG[image.imageType] || IMAGE_TYPE_CONFIG.other;

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden">
        <div className="flex flex-col md:flex-row h-full">
          {/* Image panel */}
          <div className="relative flex-1 bg-black flex items-center justify-center min-h-[300px] md:min-h-[500px]">
            <img
              src={image.fileUrl}
              alt={`${image.genus} ${image.species}`}
              className="max-h-[500px] max-w-full object-contain"
            />
            {/* Nav arrows */}
            {images.length > 1 && (
              <>
                <button
                  onClick={onPrev}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={onNext}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}
            {/* Counter */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
              {currentIndex + 1} / {images.length}
            </div>
          </div>

          {/* Info panel */}
          <div className="w-full md:w-72 p-5 space-y-4 border-l overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-base italic">
                {image.genus} {image.species}
                {image.cultivar && <span className="not-italic font-normal text-gray-500"> — {image.cultivar}</span>}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs font-medium ${typeConfig.color}`}>
                  {typeConfig.icon}{typeConfig.label}
                </span>
                <Badge variant={image.isVerified ? 'default' : 'secondary'} className="text-xs">
                  {image.isVerified ? '✓ Vérifié' : '⏳ En attente'}
                </Badge>
              </div>

              {image.description && (
                <div>
                  <p className="font-semibold text-gray-700 mb-1">Description</p>
                  <p className="text-gray-600 text-xs leading-relaxed">{image.description}</p>
                </div>
              )}

              {image.source && (
                <div>
                  <p className="font-semibold text-gray-700 mb-1">Source</p>
                  <p className="text-gray-600 text-xs">{image.source}</p>
                  {image.sourceUrl && (
                    <a href={image.sourceUrl} target="_blank" rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-xs flex items-center gap-1 mt-0.5">
                      <ExternalLink className="w-3 h-3" /> Voir la source
                    </a>
                  )}
                </div>
              )}

              {image.attribution && (
                <div>
                  <p className="font-semibold text-gray-700 mb-1">Attribution</p>
                  <p className="text-gray-600 text-xs">{image.attribution}</p>
                </div>
              )}

              <div>
                <p className="font-semibold text-gray-700 mb-1">Ajoutée le</p>
                <p className="text-gray-600 text-xs">
                  {image.createdAt ? new Date(image.createdAt).toLocaleDateString('fr-FR') : '—'}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-2 border-t">
              {!image.isVerified && (
                <Button size="sm" variant="outline" className="w-full text-green-700 border-green-300 hover:bg-green-50"
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
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
        <ImageIcon className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
        <div className="text-sm text-blue-800">
          <p className="font-semibold mb-1">Tropicos — Missouri Botanical Garden</p>
          <p>685 000+ images botaniques. Sélectionnez une image pour l'ouvrir en haute résolution, puis uploadez-la via l'onglet "Galerie locale".</p>
        </div>
      </div>

      <div className="flex gap-2">
        <Input
          placeholder="ex: Nicotiana tabacum, Cannabis sativa, Rosa damascena"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          className="flex-1"
        />
        <Button onClick={handleSearch} disabled={searchResults.isFetching}>
          {searchResults.isFetching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
          <span className="ml-2">Rechercher</span>
        </Button>
      </div>

      {searchResults.data && searchResults.data.results.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{searchResults.data.total} résultats</p>
          {searchResults.data.results.map((r: any) => (
            <div
              key={String(r.nameId)}
              className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                selectedNameId === Number(r.nameId) ? 'bg-primary/10 border-primary' : 'hover:bg-gray-50 border-gray-200'
              }`}
              onClick={() => { setSelectedNameId(Number(r.nameId)); setSelectedPlantName(String(r.scientificName || '')); }}
            >
              <div>
                <p className="font-medium italic text-sm">{String(r.scientificName || '')}</p>
                <p className="text-xs text-gray-500">{String(r.author || '')} {r.year ? `(${r.year})` : ''} — {String(r.family || '')}</p>
              </div>
              <div className="flex items-center gap-2">
                {r.url && (
                  <a href={String(r.url)} target="_blank" rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()} className="text-blue-600 hover:text-blue-800">
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
                <Button size="sm" variant={selectedNameId === Number(r.nameId) ? 'default' : 'outline'}
                  onClick={(e) => { e.stopPropagation(); setSelectedNameId(Number(r.nameId)); setSelectedPlantName(String(r.scientificName || '')); }}>
                  Voir images
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {searchResults.data?.results.length === 0 && searchQuery && (
        <p className="text-center text-gray-500 py-6">Aucun résultat pour "{searchQuery}" dans Tropicos</p>
      )}

      {selectedNameId !== null && (
        <div>
          <p className="text-sm font-medium mb-3 italic">{selectedPlantName} — {imagesQuery.data?.total || 0} images</p>
          {imagesQuery.isLoading && (
            <div className="flex justify-center py-8"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
          )}
          {imagesQuery.data?.results.length === 0 && (
            <p className="text-center text-gray-500 py-6">Aucune image disponible pour cette espèce dans Tropicos</p>
          )}
          {imagesQuery.data && imagesQuery.data.results.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {imagesQuery.data.results.map((img: any, idx: number) => (
                <div key={idx} className="group relative rounded-lg overflow-hidden border border-gray-200 hover:border-primary transition-colors bg-gray-50">
                  {img.thumbnailUrl ? (
                    <img src={String(img.thumbnailUrl)} alt={String(img.caption || selectedPlantName)}
                      className="w-full h-32 object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder-plant.svg'; }} />
                  ) : (
                    <div className="w-full h-32 flex items-center justify-center"><ImageIcon className="w-8 h-8 text-gray-400" /></div>
                  )}
                  {img.caption && <p className="text-xs text-gray-600 truncate px-2 py-1">{String(img.caption)}</p>}
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
  const searchMutation = trpc.wikidataSync.searchTaxon.useMutation();
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
      <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 flex gap-3">
        <Link2 className="w-5 h-5 text-indigo-600 mt-0.5 shrink-0" />
        <div className="text-sm text-indigo-800">
          <p className="font-semibold mb-1">Images Wikidata</p>
          <p>Recherchez une plante pour récupérer son image officielle Wikidata (propriété P18) et l'importer directement dans la galerie locale.</p>
        </div>
      </div>

      <div className="flex gap-2">
        <Input
          placeholder="ex: Rosa damascena, Lavandula angustifolia"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          className="flex-1"
        />
        <Button onClick={handleSearch} disabled={detailsMutation.isPending}>
          {detailsMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
          <span className="ml-2">Chercher</span>
        </Button>
      </div>

      {entity && (
        <Card>
          <CardContent className="pt-4 space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-semibold text-lg italic">{entity.scientificName || entity.label}</p>
                <p className="text-sm text-gray-500">{entity.description}</p>
                {entity.id && (
                  <a href={`https://www.wikidata.org/wiki/${entity.id}`} target="_blank" rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:underline flex items-center gap-1 mt-1">
                    <ExternalLink className="w-3 h-3" /> {entity.id}
                  </a>
                )}
              </div>
              {entity.conservationStatus && (
                <Badge variant="outline">{entity.conservationStatus}</Badge>
              )}
            </div>

            {entity.imageUrl ? (
              <div className="space-y-3">
                <img src={entity.imageUrl} alt={entity.label}
                  className="max-h-64 w-full object-contain rounded-lg border bg-gray-50" />
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => window.open(entity.imageUrl, '_blank')}>
                    <ExternalLink className="w-4 h-4 mr-2" /> Ouvrir en plein écran
                  </Button>
                  <Button size="sm" onClick={() => {
                    onImportUrl(entity.imageUrl, entity.scientificName || entity.label);
                    toast({ title: 'URL copiée', description: 'Utilisez l\'onglet "Galerie locale" → "Uploader" pour finaliser l\'import.' });
                  }}>
                    <Download className="w-4 h-4 mr-2" /> Utiliser cette image
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                <ImageIcon className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">Aucune image disponible sur Wikidata pour cette espèce</p>
                <p className="text-xs text-gray-400 mt-1">Essayez Tropicos pour des images botaniques alternatives</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// UPLOAD FORM
// ─────────────────────────────────────────────────────────────────────────────

interface UploadFormState {
  genus: string;
  species: string;
  cultivar: string;
  imageType: 'leaf' | 'flower' | 'fruit' | 'whole_plant' | 'other';
  description: string;
  source: string;
  sourceUrl: string;
  attribution: string;
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
        toast({ title: 'Succès', description: 'Image uploadée. En attente de vérification.' });
        setIsOpen(false);
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
        <Button className="gap-2"><Upload className="w-4 h-4" /> Uploader une image</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Uploader une image morphologique</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Genre *</label>
              <Input value={formData.genus} onChange={e => setFormData(p => ({ ...p, genus: e.target.value }))} placeholder="ex: Nicotiana" required />
            </div>
            <div>
              <label className="text-sm font-medium">Espèce *</label>
              <Input value={formData.species} onChange={e => setFormData(p => ({ ...p, species: e.target.value }))} placeholder="ex: tabacum" required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Cultivar (optionnel)</label>
              <Input value={formData.cultivar} onChange={e => setFormData(p => ({ ...p, cultivar: e.target.value }))} placeholder="ex: Basma" />
            </div>
            <div>
              <label className="text-sm font-medium">Type d'image *</label>
              <Select value={formData.imageType} onValueChange={v => setFormData(p => ({ ...p, imageType: v as UploadFormState['imageType'] }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="leaf">Feuille</SelectItem>
                  <SelectItem value="flower">Fleur</SelectItem>
                  <SelectItem value="fruit">Fruit</SelectItem>
                  <SelectItem value="whole_plant">Plante entière</SelectItem>
                  <SelectItem value="other">Autre</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Fichier image *</label>
            <Input type="file" accept="image/*" onChange={handleFileChange} required />
            {formData.file && <p className="text-xs text-gray-500 mt-1">{formData.file.name} ({(formData.file.size / 1024).toFixed(0)} KB)</p>}
          </div>
          <div>
            <label className="text-sm font-medium">Description</label>
            <Textarea value={formData.description} onChange={e => setFormData(p => ({ ...p, description: e.target.value }))} placeholder="Description détaillée..." rows={2} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Source</label>
              <Input value={formData.source} onChange={e => setFormData(p => ({ ...p, source: e.target.value }))} placeholder="ex: Wikimedia Commons" />
            </div>
            <div>
              <label className="text-sm font-medium">URL source</label>
              <Input type="url" value={formData.sourceUrl} onChange={e => setFormData(p => ({ ...p, sourceUrl: e.target.value }))} placeholder="https://..." />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Attribution / Crédit</label>
            <Input value={formData.attribution} onChange={e => setFormData(p => ({ ...p, attribution: e.target.value }))} placeholder="© Auteur/Photographe" />
          </div>
          <div className="flex gap-2 justify-end pt-2 border-t">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Annuler</Button>
            <Button type="submit" disabled={uploadMutation.isPending}>
              {uploadMutation.isPending ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Upload...</> : 'Uploader'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// IMAGE GALLERY
// ─────────────────────────────────────────────────────────────────────────────

function ImageGallery({
  images, onVerify, onDelete, isLoading,
}: {
  images: any[]; onVerify: (id: number, v: boolean) => void; onDelete: (id: number) => void; isLoading: boolean;
}) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (isLoading) return (
    <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
  );

  if (images.length === 0) return (
    <div className="text-center py-12 text-gray-400">
      <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-30" />
      <p>Aucune image trouvée</p>
    </div>
  );

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
        {images.map((image, idx) => {
          const typeConfig = IMAGE_TYPE_CONFIG[image.imageType] || IMAGE_TYPE_CONFIG.other;
          return (
            <div key={image.id} className="group relative rounded-lg overflow-hidden border border-gray-200 hover:border-primary hover:shadow-md transition-all cursor-pointer bg-gray-50"
              onClick={() => setLightboxIndex(idx)}>
              <div className="relative aspect-square">
                <img src={image.fileUrl} alt={`${image.genus} ${image.species}`}
                  className="w-full h-full object-cover" />
                {/* Verified badge */}
                <div className={`absolute top-1.5 right-1.5 rounded-full p-0.5 ${image.isVerified ? 'bg-green-500' : 'bg-yellow-500'}`}>
                  {image.isVerified
                    ? <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                    : <AlertCircle className="w-3.5 h-3.5 text-white" />
                  }
                </div>
                {/* Type badge */}
                <div className={`absolute bottom-1.5 left-1.5 inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-medium border ${typeConfig.color}`}>
                  {typeConfig.icon}{typeConfig.label}
                </div>
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Eye className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="px-2 py-1.5">
                <p className="text-xs font-medium italic truncate">{image.genus} {image.species}</p>
                {image.cultivar && <p className="text-[10px] text-gray-500 truncate">{image.cultivar}</p>}
              </div>
            </div>
          );
        })}
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

  const allImagesQuery = trpc.varietyImages.getAll.useQuery({
    isVerified: filterVerified === 'all' ? undefined : filterVerified === 'verified',
    genus: filterGenus || undefined,
  });

  const statsQuery = trpc.varietyImages.getStats.useQuery();

  const verifyMutation = trpc.varietyImages.verify.useMutation({
    onSuccess: () => { toast({ title: 'Image vérifiée' }); allImagesQuery.refetch(); statsQuery.refetch(); },
  });

  const deleteMutation = trpc.varietyImages.delete.useMutation({
    onSuccess: () => { toast({ title: 'Image supprimée' }); allImagesQuery.refetch(); statsQuery.refetch(); },
  });

  // Client-side text search
  const filteredImages = useMemo(() => {
    let imgs = allImagesQuery.data || [];
    if (searchText.trim()) {
      const q = searchText.toLowerCase();
      imgs = imgs.filter(i =>
        `${i.genus} ${i.species} ${i.cultivar || ''}`.toLowerCase().includes(q)
      );
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

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Images morphologiques</h1>
          <p className="text-gray-500 text-sm mt-0.5">Gérez les images botaniques des variétés — feuilles, fleurs, fruits, plantes entières</p>
        </div>
        <UploadForm onSuccess={() => allImagesQuery.refetch()} prefillUrl={prefillUrl} />
      </div>

      {/* Statistics */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Total', value: stats.total, color: 'text-gray-800' },
            { label: 'Vérifiées', value: stats.verified, color: 'text-green-600' },
            { label: 'En attente', value: stats.unverified, color: 'text-yellow-600' },
            { label: 'Genres', value: Object.keys(stats.byGenus).length, color: 'text-blue-600' },
          ].map(s => (
            <Card key={s.label} className="text-center py-3">
              <div className={`text-3xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
            </Card>
          ))}
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="gallery">Galerie locale</TabsTrigger>
          <TabsTrigger value="tropicos">Tropicos</TabsTrigger>
          <TabsTrigger value="wikidata">Wikidata</TabsTrigger>
        </TabsList>

        {/* GALLERY TAB */}
        <TabsContent value="gallery" className="space-y-4">
          {/* Filters bar */}
          <div className="flex flex-wrap gap-2 items-center">
            <div className="relative flex-1 min-w-[180px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Rechercher genre, espèce, cultivar..."
                value={searchText}
                onChange={e => setSearchText(e.target.value)}
                className="pl-9"
              />
              {searchText && (
                <button onClick={() => setSearchText('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <Select value={filterGenus || 'all'} onValueChange={v => setFilterGenus(v === 'all' ? '' : v)}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Genre" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les genres</SelectItem>
                {genusOptions.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                {Object.entries(IMAGE_TYPE_CONFIG).map(([k, v]) => (
                  <SelectItem key={k} value={k}>{v.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterVerified} onValueChange={v => setFilterVerified(v as any)}>
              <SelectTrigger className="w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous</SelectItem>
                <SelectItem value="verified">Vérifiées</SelectItem>
                <SelectItem value="unverified">En attente</SelectItem>
              </SelectContent>
            </Select>
            {(searchText || filterGenus || filterType !== 'all' || filterVerified !== 'all') && (
              <Button variant="ghost" size="sm" onClick={() => { setSearchText(''); setFilterGenus(''); setFilterType('all'); setFilterVerified('all'); }}>
                <X className="w-4 h-4 mr-1" /> Réinitialiser
              </Button>
            )}
          </div>

          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>{filteredImages.length} image{filteredImages.length !== 1 ? 's' : ''} affichée{filteredImages.length !== 1 ? 's' : ''}</span>
          </div>

          <ImageGallery
            images={filteredImages}
            onVerify={(id, v) => verifyMutation.mutate({ id, isVerified: v })}
            onDelete={(id) => { if (confirm('Supprimer cette image ?')) deleteMutation.mutate({ id }); }}
            isLoading={allImagesQuery.isLoading}
          />
        </TabsContent>

        {/* TROPICOS TAB */}
        <TabsContent value="tropicos">
          <TropicosImageBrowser />
        </TabsContent>

        {/* WIKIDATA TAB */}
        <TabsContent value="wikidata">
          <WikidataImageBrowser
            onImportUrl={(url, name) => {
              setPrefillUrl(url);
              setActiveTab('gallery');
            }}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
