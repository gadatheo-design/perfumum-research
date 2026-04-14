/**
 * PlantVarietyImageGallery.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Scrollable gallery of morphological images linked to a plant via plantId
 * Displays leaf, flower, fruit, whole_plant images with lightbox and metadata
 * Features: badges terroir, grouping by type, lightbox with full metadata
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React, { useState, useMemo } from 'react';
import { trpc } from '@/lib/trpc';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Leaf, Flower2, Apple, TreePine, ChevronLeft, ChevronRight, X,
  Download, ExternalLink, Globe, Info, Camera, BookOpen,
} from 'lucide-react';

const IMAGE_TYPE_CONFIG: Record<string, {
  label: string;
  icon: React.ReactNode;
  color: string;
}> = {
  leaf: { label: 'Feuille', icon: <Leaf className="w-3.5 h-3.5" />, color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  flower: { label: 'Fleur', icon: <Flower2 className="w-3.5 h-3.5" />, color: 'bg-rose-50 text-rose-700 border-rose-200' },
  fruit: { label: 'Fruit', icon: <Apple className="w-3.5 h-3.5" />, color: 'bg-amber-50 text-amber-700 border-amber-200' },
  whole_plant: { label: 'Plante entière', icon: <TreePine className="w-3.5 h-3.5" />, color: 'bg-teal-50 text-teal-700 border-teal-200' },
  other: { label: 'Autre', icon: <Leaf className="w-3.5 h-3.5" />, color: 'bg-zinc-50 text-zinc-700 border-zinc-200' },
};

interface PlantVarietyImageGalleryProps {
  plantId: number;
  showVerifiedOnly?: boolean;
}

export function PlantVarietyImageGallery({ plantId, showVerifiedOnly = true }: PlantVarietyImageGalleryProps) {
  const [selectedImageId, setSelectedImageId] = useState<number | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  // Fetch images linked to this plant
  const { data: images, isLoading } = trpc.varietyImages.getByPlantId.useQuery(
    { plantId },
    { enabled: plantId > 0 }
  );

  // Filter verified images if needed
  const filteredImages = useMemo(() => {
    if (!images) return [];
    return showVerifiedOnly ? images.filter(img => img.isVerified) : images;
  }, [images, showVerifiedOnly]);

  // Group images by type
  const imagesByType = useMemo(() => {
    const grouped: Record<string, typeof filteredImages> = {};
    filteredImages.forEach(img => {
      const type = img.imageType || 'other';
      if (!grouped[type]) grouped[type] = [];
      grouped[type].push(img);
    });
    return grouped;
  }, [filteredImages]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-24 bg-muted animate-pulse rounded-lg" />
      </div>
    );
  }

  if (!filteredImages || filteredImages.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Leaf className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">Aucune image morphologique liée à cette plante</p>
        <p className="text-xs mt-1">Les images peuvent être ajoutées depuis la galerie d'administration</p>
      </div>
    );
  }

  const selectedImage = filteredImages.find(img => img.id === selectedImageId);

  return (
    <>
      {/* Gallery by image type */}
      <div className="space-y-6">
        {Object.entries(imagesByType).map(([type, typeImages]) => {
          const typeConfig = IMAGE_TYPE_CONFIG[type] || IMAGE_TYPE_CONFIG.other;
          return (
            <div key={type}>
              <div className="flex items-center gap-2 mb-3">
                {typeConfig.icon}
                <h3 className="text-sm font-semibold text-foreground">
                  {typeConfig.label}
                </h3>
                <Badge variant="secondary" className="text-xs">
                  {typeImages.length}
                </Badge>
              </div>

              {/* Horizontal scroll gallery */}
              <div className="overflow-x-auto pb-2 -mx-4 px-4">
                <div className="flex gap-3 min-w-min">
                  {typeImages.map(img => (
                    <button
                      key={img.id}
                      onClick={() => {
                        setSelectedImageId(img.id);
                        setLightboxOpen(true);
                      }}
                      className="group relative flex-shrink-0 w-32 h-32 rounded-lg overflow-hidden border border-border hover:border-primary/50 transition-all hover:shadow-md"
                    >
                      <img
                        src={img.fileUrl}
                        alt={`${img.genus} ${img.species}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                      
                      {/* Badge terroir */}
                      {img.terroirName && (
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-1.5">
                          <p className="text-xs font-medium text-white truncate flex items-center gap-1">
                            <Globe className="w-2.5 h-2.5 flex-shrink-0" />
                            {img.terroirName}
                          </p>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Lightbox */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="max-w-4xl">
          {selectedImage && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-h-[80vh] overflow-y-auto">
              {/* Image */}
              <div className="md:col-span-2 flex items-center justify-center bg-muted rounded-lg overflow-hidden">
                <img
                  src={selectedImage.fileUrl}
                  alt={`${selectedImage.genus} ${selectedImage.species}`}
                  className="max-w-full max-h-[60vh] object-contain"
                />
              </div>

              {/* Info panel */}
              <div className="space-y-4">
                {/* Type badge */}
                <div>
                  <Badge className={IMAGE_TYPE_CONFIG[selectedImage.imageType || 'other'].color}>
                    {IMAGE_TYPE_CONFIG[selectedImage.imageType || 'other'].label}
                  </Badge>
                </div>

                {/* Variety info */}
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">Variété</p>
                  <p className="text-sm font-medium italic text-foreground">
                    {selectedImage.genus} {selectedImage.species}
                  </p>
                  {selectedImage.cultivar && (
                    <p className="text-xs text-muted-foreground">cv. {selectedImage.cultivar}</p>
                  )}
                </div>

                {/* Terroir */}
                {selectedImage.terroirName && (
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
                      <Globe className="w-3 h-3" /> Terroir
                    </p>
                    <p className="text-sm text-foreground">{selectedImage.terroirName}</p>
                  </div>
                )}

                {/* Description */}
                {selectedImage.description && (
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
                      <Info className="w-3 h-3" /> Description
                    </p>
                    <p className="text-xs text-foreground leading-relaxed">{selectedImage.description}</p>
                  </div>
                )}

                {/* Source */}
                {selectedImage.source && (
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
                      <BookOpen className="w-3 h-3" /> Source
                    </p>
                    <p className="text-xs text-foreground">{selectedImage.source}</p>
                    {selectedImage.sourceUrl && (
                      <a href={selectedImage.sourceUrl} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 hover:underline mt-1">
                        <ExternalLink className="w-3 h-3" /> Voir la source
                      </a>
                    )}
                  </div>
                )}

                {/* Attribution */}
                {selectedImage.attribution && (
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
                      <Camera className="w-3 h-3" /> Attribution
                    </p>
                    <p className="text-xs text-foreground">{selectedImage.attribution}</p>
                  </div>
                )}

                {/* Download button */}
                <div className="pt-2 border-t border-border">
                  <a href={selectedImage.fileUrl} download
                    className="inline-flex items-center justify-center gap-2 w-full px-3 py-2 rounded-lg border border-border hover:bg-muted text-sm font-medium transition-colors">
                    <Download className="w-3.5 h-3.5" />
                    Télécharger
                  </a>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
