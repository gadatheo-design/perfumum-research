/**
 * MorphologyGallery.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Component to display morphological images (leaf, flower, fruit) for plant varieties
 * Used in variety detail pages and genealogy explorer
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Leaf, Flower2, Apple, Maximize2 } from 'lucide-react';
import { trpc } from '@/lib/trpc';

interface MorphologyGalleryProps {
  genus: string;
  species: string;
  cultivar?: string;
  className?: string;
}

const imageTypeIcons: Record<string, React.ReactNode> = {
  leaf: <Leaf className="w-4 h-4" />,
  flower: <Flower2 className="w-4 h-4" />,
  fruit: <Apple className="w-4 h-4" />,
  whole_plant: <Maximize2 className="w-4 h-4" />,
};

const imageTypeLabels: Record<string, string> = {
  leaf: 'Feuille',
  flower: 'Fleur',
  fruit: 'Fruit',
  whole_plant: 'Plante entière',
  other: 'Autre',
};

export function MorphologyGallery({
  genus,
  species,
  cultivar,
  className = '',
}: MorphologyGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<any | null>(null);
  const [selectedTab, setSelectedTab] = useState('all');

  // Fetch images for this variety
  const imagesQuery = trpc.varietyImages.getByVariety.useQuery({
    genus,
    species,
    cultivar,
  });

  const images = imagesQuery.data || [];

  // Group images by type
  const imagesByType = {
    leaf: images.filter((img) => img.imageType === 'leaf'),
    flower: images.filter((img) => img.imageType === 'flower'),
    fruit: images.filter((img) => img.imageType === 'fruit'),
    whole_plant: images.filter((img) => img.imageType === 'whole_plant'),
    other: images.filter((img) => img.imageType === 'other'),
  };

  // Get images for current tab
  const currentImages =
    selectedTab === 'all'
      ? images
      : imagesByType[selectedTab as keyof typeof imagesByType] || [];

  if (imagesQuery.isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Morphologie</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">Chargement des images...</div>
        </CardContent>
      </Card>
    );
  }

  if (images.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Morphologie</CardTitle>
          <CardDescription>
            Aucune image morphologique disponible pour cette variété
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <p>Les images de feuilles, fleurs et fruits seront bientôt disponibles</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className={className}>
        <CardHeader>
          <CardTitle>Morphologie</CardTitle>
          <CardDescription>
            {images.length} image{images.length > 1 ? 's' : ''} disponible{images.length > 1 ? 's' : ''}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all">Tous ({images.length})</TabsTrigger>
              <TabsTrigger value="leaf" disabled={imagesByType.leaf.length === 0}>
                Feuille ({imagesByType.leaf.length})
              </TabsTrigger>
              <TabsTrigger value="flower" disabled={imagesByType.flower.length === 0}>
                Fleur ({imagesByType.flower.length})
              </TabsTrigger>
              <TabsTrigger value="fruit" disabled={imagesByType.fruit.length === 0}>
                Fruit ({imagesByType.fruit.length})
              </TabsTrigger>
              <TabsTrigger value="whole_plant" disabled={imagesByType.whole_plant.length === 0}>
                Plante ({imagesByType.whole_plant.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value={selectedTab} className="space-y-4">
              {currentImages.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Aucune image de ce type
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {currentImages.map((image) => (
                    <div
                      key={image.id}
                      className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer group"
                      onClick={() => setSelectedImage(image)}
                    >
                      <img
                        src={image.fileUrl}
                        alt={`${imageTypeLabels[image.imageType]} - ${genus} ${species}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                        <Maximize2 className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <div className="absolute bottom-2 left-2">
                        <Badge variant="secondary" className="gap-1">
                          {imageTypeIcons[image.imageType]}
                          {imageTypeLabels[image.imageType]}
                        </Badge>
                      </div>
                      {image.description && (
                        <div className="absolute top-2 right-2 bg-blue-500 rounded-full w-6 h-6 flex items-center justify-center text-white text-xs font-bold cursor-help"
                          title={image.description}
                        >
                          ℹ
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Image Detail Modal */}
      {selectedImage && (
        <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>
                {imageTypeLabels[selectedImage.imageType]} - {genus} {species}
                {cultivar && ` (${cultivar})`}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <img
                src={selectedImage.fileUrl}
                alt={imageTypeLabels[selectedImage.imageType]}
                className="w-full max-h-96 object-contain rounded-lg"
              />

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-semibold text-gray-700">Type</p>
                  <p className="flex items-center gap-2">
                    {imageTypeIcons[selectedImage.imageType]}
                    {imageTypeLabels[selectedImage.imageType]}
                  </p>
                </div>

                {selectedImage.quality && (
                  <div>
                    <p className="font-semibold text-gray-700">Qualité</p>
                    <Badge
                      variant={
                        selectedImage.quality === 'excellent'
                          ? 'default'
                          : selectedImage.quality === 'high'
                            ? 'secondary'
                            : 'outline'
                      }
                    >
                      {selectedImage.quality.charAt(0).toUpperCase() + selectedImage.quality.slice(1)}
                    </Badge>
                  </div>
                )}

                {selectedImage.description && (
                  <div className="col-span-2">
                    <p className="font-semibold text-gray-700">Description</p>
                    <p className="text-gray-600">{selectedImage.description}</p>
                  </div>
                )}

                {selectedImage.source && (
                  <div>
                    <p className="font-semibold text-gray-700">Source</p>
                    <p className="text-gray-600">{selectedImage.source}</p>
                  </div>
                )}

                {selectedImage.sourceUrl && (
                  <div>
                    <p className="font-semibold text-gray-700">Lien</p>
                    <a
                      href={selectedImage.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-xs"
                    >
                      Voir la source
                    </a>
                  </div>
                )}

                {selectedImage.attribution && (
                  <div className="col-span-2">
                    <p className="font-semibold text-gray-700">Attribution</p>
                    <p className="text-gray-600 text-xs">{selectedImage.attribution}</p>
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
