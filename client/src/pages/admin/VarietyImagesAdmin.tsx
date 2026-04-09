/**
 * VarietyImagesAdmin.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Admin page for managing morphological images of plant varieties
 * Allows uploading, verifying, and managing images for Nicotiana, Cannabis, Citrus, etc.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { trpc } from '@/lib/trpc';
import { useToast } from '@/hooks/use-toast';
import { Upload, CheckCircle2, AlertCircle, Trash2, Eye, Download, Search, ExternalLink, ImageIcon, Loader2 } from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// TROPICOS IMAGE BROWSER COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

function TropicosImageBrowser() {
  const { toast } = useToast();
  const [searchName, setSearchName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNameId, setSelectedNameId] = useState<number | null>(null);
  const [selectedPlantName, setSelectedPlantName] = useState('');

  // Search for plant names in Tropicos
  const searchResults = trpc.tropicosEnrichment.searchName.useQuery(
    { name: searchQuery, limit: 10 },
    { enabled: searchQuery.length >= 3 }
  );

  // Get images for selected NameId
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

  const handleSelectPlant = (nameId: number, name: string) => {
    setSelectedNameId(nameId);
    setSelectedPlantName(name);
  };

  const handleImportImage = (img: { largeUrl?: string; thumbnailUrl?: string; copyright?: string; caption?: string }) => {
    const url = img.largeUrl || img.thumbnailUrl;
    if (!url) return;
    window.open(url, '_blank');
    toast({
      title: 'Image Tropicos',
      description: 'Image ouverte dans un nouvel onglet. Téléchargez-la puis uploadez-la via le bouton "Uploader une image".',
    });
  };

  return (
    <div className="space-y-6">
      {/* Info banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
        <ImageIcon className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
        <div className="text-sm text-blue-800">
          <p className="font-semibold mb-1">Tropicos — Missouri Botanical Garden</p>
          <p>Recherchez une plante par son nom scientifique pour accéder aux images botaniques de la base Tropicos (685 000+ images). Sélectionnez une image pour l'ouvrir en haute résolution, puis uploadez-la via l'onglet "Galerie locale".</p>
        </div>
      </div>

      {/* Search bar */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Rechercher dans Tropicos</CardTitle>
          <CardDescription>Entrez un nom scientifique (genre + espèce)</CardDescription>
        </CardHeader>
        <CardContent>
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
              Rechercher
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Search results */}
      {searchResults.data && searchResults.data.results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Résultats ({searchResults.data.total})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {searchResults.data.results.map((r: any) => (
                <div
                  key={String(r.nameId)}
                  className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedNameId === Number(r.nameId)
                      ? 'bg-primary/10 border-primary'
                      : 'hover:bg-gray-50 border-gray-200'
                  }`}
                  onClick={() => handleSelectPlant(Number(r.nameId), String(r.scientificName || ''))}
                >
                  <div>
                    <p className="font-medium italic">{String(r.scientificName || '')}</p>
                    <p className="text-sm text-gray-500">
                      {String(r.author || '')} {r.year ? `(${String(r.year)})` : ''} — {String(r.family || '')} — {String(r.rank || '')}
                    </p>
                    {r.nomenclatureStatus && (
                      <Badge variant="outline" className="text-xs mt-1">{String(r.nomenclatureStatus)}</Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {r.url && (
                      <a
                        href={String(r.url)}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                    <Button
                      size="sm"
                      variant={selectedNameId === Number(r.nameId) ? 'default' : 'outline'}
                      onClick={(e) => { e.stopPropagation(); handleSelectPlant(Number(r.nameId), String(r.scientificName || '')); }}
                    >
                      Voir images
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {searchResults.data && searchResults.data.results.length === 0 && searchQuery && (
        <Card>
          <CardContent className="py-8 text-center text-gray-500">
            Aucun résultat pour "{searchQuery}" dans Tropicos
          </CardContent>
        </Card>
      )}

      {/* Images grid */}
      {selectedNameId !== null && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Images botaniques — <span className="italic">{selectedPlantName}</span>
            </CardTitle>
            <CardDescription>
              {imagesQuery.isLoading ? 'Chargement...' : `${imagesQuery.data?.total || 0} images disponibles`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {imagesQuery.isLoading && (
              <div className="flex justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            )}
            {imagesQuery.data && imagesQuery.data.results.length === 0 && (
              <p className="text-center text-gray-500 py-8">Aucune image disponible pour cette espèce dans Tropicos</p>
            )}
            {imagesQuery.data && imagesQuery.data.results.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {imagesQuery.data.results.map((img: any, idx: number) => (
                  <div key={idx} className="group relative rounded-lg overflow-hidden border border-gray-200 hover:border-primary transition-colors">
                    {img.thumbnailUrl ? (
                      <img
                        src={String(img.thumbnailUrl)}
                        alt={String(img.caption || selectedPlantName)}
                        className="w-full h-40 object-cover"
                        onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder-plant.svg'; }}
                      />
                    ) : (
                      <div className="w-full h-40 bg-gray-100 flex items-center justify-center">
                        <ImageIcon className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                    <div className="p-2">
                      {img.caption && <p className="text-xs text-gray-600 truncate">{String(img.caption)}</p>}
                      {img.copyright && <p className="text-xs text-gray-400 truncate">© {String(img.copyright)}</p>}
                    </div>
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      {img.largeUrl && (
                        <Button size="sm" variant="secondary" onClick={() => window.open(String(img.largeUrl), '_blank')}>
                          <Eye className="w-4 h-4 mr-1" /> Voir
                        </Button>
                      )}
                      <Button size="sm" onClick={() => handleImportImage(img as any)}>
                        <Download className="w-4 h-4 mr-1" /> Importer
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// UPLOAD FORM COMPONENT
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

function UploadForm({ onSuccess }: { onSuccess: () => void }) {
  const { toast } = useToast();
  const uploadMutation = trpc.varietyImages.upload.useMutation();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<UploadFormState>({
    genus: 'Nicotiana',
    species: 'tabacum',
    cultivar: '',
    imageType: 'leaf',
    description: '',
    source: '',
    sourceUrl: '',
    attribution: '',
    file: null,
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: 'Erreur',
          description: 'Veuillez sélectionner un fichier image',
          variant: 'destructive',
        });
        return;
      }
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: 'Erreur',
          description: 'La taille du fichier ne doit pas dépasser 10 MB',
          variant: 'destructive',
        });
        return;
      }
      setFormData((prev) => ({ ...prev, file }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.file) {
      toast({
        title: 'Erreur',
        description: 'Veuillez sélectionner un fichier',
        variant: 'destructive',
      });
      return;
    }

    try {
      // Convert file to base64
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = reader.result as string;
        const base64Data = base64.split(',')[1];

        await uploadMutation.mutateAsync({
          genus: formData.genus,
          species: formData.species,
          cultivar: formData.cultivar || undefined,
          imageType: formData.imageType,
          fileData: base64Data,
          fileName: formData.file!.name,
          mimeType: formData.file!.type,
          description: formData.description || undefined,
          source: formData.source || undefined,
          sourceUrl: formData.sourceUrl || undefined,
          attribution: formData.attribution || undefined,
        });

        toast({
          title: 'Succès',
          description: 'Image uploadée avec succès. En attente de vérification admin.',
        });

        setIsOpen(false);
        setFormData({
          genus: 'Nicotiana',
          species: 'tabacum',
          cultivar: '',
          imageType: 'leaf',
          description: '',
          source: '',
          sourceUrl: '',
          attribution: '',
          file: null,
        });
        onSuccess();
      };
      reader.readAsDataURL(formData.file);
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: 'Erreur',
        description: 'Erreur lors de l\'upload de l\'image',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Upload className="w-4 h-4" />
          Uploader une image
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Uploader une image morphologique</DialogTitle>
          <DialogDescription>
            Ajoutez une image de feuille, fleur, fruit ou plante entière pour une variété
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Genus and Species */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Genre *</label>
              <Input
                value={formData.genus}
                onChange={(e) => setFormData((prev) => ({ ...prev, genus: e.target.value }))}
                placeholder="e.g., Nicotiana"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium">Espèce *</label>
              <Input
                value={formData.species}
                onChange={(e) => setFormData((prev) => ({ ...prev, species: e.target.value }))}
                placeholder="e.g., tabacum"
                required
              />
            </div>
          </div>

          {/* Cultivar and Image Type */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Cultivar (optionnel)</label>
              <Input
                value={formData.cultivar}
                onChange={(e) => setFormData((prev) => ({ ...prev, cultivar: e.target.value }))}
                placeholder="e.g., Basma"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Type d'image *</label>
              <Select
                value={formData.imageType}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    imageType: value as UploadFormState['imageType'],
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
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

          {/* File Upload */}
          <div>
            <label className="text-sm font-medium">Fichier image *</label>
            <Input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              required
            />
            {formData.file && (
              <p className="text-sm text-gray-600 mt-2">
                Fichier sélectionné: {formData.file.name} ({(formData.file.size / 1024).toFixed(2)} KB)
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium">Description</label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Description détaillée de l'image..."
              rows={3}
            />
          </div>

          {/* Source and Attribution */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Source</label>
              <Input
                value={formData.source}
                onChange={(e) => setFormData((prev) => ({ ...prev, source: e.target.value }))}
                placeholder="e.g., Wikimedia Commons"
              />
            </div>
            <div>
              <label className="text-sm font-medium">URL source</label>
              <Input
                type="url"
                value={formData.sourceUrl}
                onChange={(e) => setFormData((prev) => ({ ...prev, sourceUrl: e.target.value }))}
                placeholder="https://..."
              />
            </div>
          </div>

          {/* Attribution */}
          <div>
            <label className="text-sm font-medium">Attribution/Crédit</label>
            <Input
              value={formData.attribution}
              onChange={(e) => setFormData((prev) => ({ ...prev, attribution: e.target.value }))}
              placeholder="© Auteur/Photographe"
            />
          </div>

          {/* Submit Button */}
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={uploadMutation.isPending}>
              {uploadMutation.isPending ? 'Upload en cours...' : 'Uploader'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// IMAGE GALLERY COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

interface ImageGalleryProps {
  images: any[];
  onVerify: (id: number, isVerified: boolean) => void;
  onDelete: (id: number) => void;
  isLoading: boolean;
}

function ImageGallery({ images, onVerify, onDelete, isLoading }: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<any | null>(null);

  if (isLoading) {
    return <div className="text-center py-8">Chargement des images...</div>;
  }

  if (images.length === 0) {
    return <div className="text-center py-8 text-gray-500">Aucune image trouvée</div>;
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {images.map((image) => (
          <Card key={image.id} className="overflow-hidden">
            <div className="relative aspect-square bg-gray-100 cursor-pointer" onClick={() => setSelectedImage(image)}>
              <img
                src={image.fileUrl}
                alt={`${image.genus} ${image.species}`}
                className="w-full h-full object-cover"
              />
              {image.isVerified && (
                <div className="absolute top-2 right-2 bg-green-500 rounded-full p-1">
                  <CheckCircle2 className="w-5 h-5 text-white" />
                </div>
              )}
              {!image.isVerified && (
                <div className="absolute top-2 right-2 bg-yellow-500 rounded-full p-1">
                  <AlertCircle className="w-5 h-5 text-white" />
                </div>
              )}
            </div>
            <CardContent className="p-4">
              <p className="font-semibold text-sm">
                {image.genus} {image.species}
                {image.cultivar && ` - ${image.cultivar}`}
              </p>
              <p className="text-xs text-gray-600 capitalize">{image.imageType}</p>
              <div className="flex gap-2 mt-3">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setSelectedImage(image)}
                  className="flex-1"
                >
                  <Eye className="w-4 h-4" />
                </Button>
                {!image.isVerified && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onVerify(image.id, true)}
                  >
                    Vérifier
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onDelete(image.id)}
                  className="text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Image Detail Modal */}
      {selectedImage && (
        <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>
                {selectedImage.genus} {selectedImage.species}
                {selectedImage.cultivar && ` - ${selectedImage.cultivar}`}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <img
                src={selectedImage.fileUrl}
                alt={`${selectedImage.genus} ${selectedImage.species}`}
                className="w-full max-h-96 object-contain"
              />
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-semibold">Type</p>
                  <p className="capitalize">{selectedImage.imageType}</p>
                </div>
                <div>
                  <p className="font-semibold">Statut</p>
                  <Badge variant={selectedImage.isVerified ? 'default' : 'secondary'}>
                    {selectedImage.isVerified ? 'Vérifié' : 'En attente'}
                  </Badge>
                </div>
                {selectedImage.description && (
                  <div className="col-span-2">
                    <p className="font-semibold">Description</p>
                    <p>{selectedImage.description}</p>
                  </div>
                )}
                {selectedImage.source && (
                  <div>
                    <p className="font-semibold">Source</p>
                    <p>{selectedImage.source}</p>
                  </div>
                )}
                {selectedImage.attribution && (
                  <div>
                    <p className="font-semibold">Attribution</p>
                    <p>{selectedImage.attribution}</p>
                  </div>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────

export function VarietyImagesAdmin() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('gallery');
  const [filterGenus, setFilterGenus] = useState('');
  const [filterVerified, setFilterVerified] = useState<'all' | 'verified' | 'unverified'>('all');

  // Queries
  const allImagesQuery = trpc.varietyImages.getAll.useQuery({
    isVerified: filterVerified === 'all' ? undefined : filterVerified === 'verified',
    genus: filterGenus || undefined,
  });

  const statsQuery = trpc.varietyImages.getStats.useQuery();

  // Mutations
  const verifyMutation = trpc.varietyImages.verify.useMutation({
    onSuccess: () => {
      toast({
        title: 'Succès',
        description: 'Image vérifiée avec succès',
      });
      allImagesQuery.refetch();
      statsQuery.refetch();
    },
  });

  const deleteMutation = trpc.varietyImages.delete.useMutation({
    onSuccess: () => {
      toast({
        title: 'Succès',
        description: 'Image supprimée avec succès',
      });
      allImagesQuery.refetch();
      statsQuery.refetch();
    },
  });

  const handleVerify = (id: number, isVerified: boolean) => {
    verifyMutation.mutate({ id, isVerified });
  };

  const handleDelete = (id: number) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette image ?')) {
      deleteMutation.mutate({ id });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Images morphologiques</h1>
          <p className="text-gray-600">Gérez les images de feuilles, fleurs et fruits des variétés</p>
        </div>
        <UploadForm onSuccess={() => allImagesQuery.refetch()} />
      </div>

      {/* Statistics */}
      {statsQuery.data && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statsQuery.data.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Vérifiées</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{statsQuery.data.verified}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">En attente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{statsQuery.data.unverified}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Genres</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Object.keys(statsQuery.data.byGenus).length}</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="gallery">Galerie locale</TabsTrigger>
          <TabsTrigger value="tropicos">Images Tropicos</TabsTrigger>
        </TabsList>

        <TabsContent value="tropicos">
          <TropicosImageBrowser />
        </TabsContent>

        <TabsContent value="gallery">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filtres</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Genre</label>
              <Input
                placeholder="Filtrer par genre (e.g., Nicotiana)"
                value={filterGenus}
                onChange={(e) => setFilterGenus(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Statut</label>
              <Select
                value={filterVerified}
                onValueChange={(value) =>
                  setFilterVerified(value as 'all' | 'verified' | 'unverified')
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous</SelectItem>
                  <SelectItem value="verified">Vérifiées</SelectItem>
                  <SelectItem value="unverified">En attente</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Image Gallery */}
      <Card>
        <CardHeader>
          <CardTitle>Images ({allImagesQuery.data?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          <ImageGallery
            images={allImagesQuery.data || []}
            onVerify={handleVerify}
            onDelete={handleDelete}
            isLoading={allImagesQuery.isLoading}
          />
        </CardContent>
      </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
