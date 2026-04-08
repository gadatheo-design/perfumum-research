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
import { Upload, CheckCircle2, AlertCircle, Trash2, Eye, Download } from 'lucide-react';

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
  const [activeTab, setActiveTab] = useState('all');
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
    </div>
  );
}
