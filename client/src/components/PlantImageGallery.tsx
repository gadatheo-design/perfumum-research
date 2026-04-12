// @ts-nocheck
/**
 * PlantImageGallery.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Galerie d'images enrichie pour la fiche plante :
 *  - Carrousel hero avec défilement automatique (images de recherche + morphologie)
 *  - Onglets par partie de plante (Feuille / Fleur / Fruit / Plante entière / Autre)
 *  - Indicateurs de catégorie visuels
 *  - Lightbox plein écran
 * ─────────────────────────────────────────────────────────────────────────────
 */
import { useState, useEffect, useCallback, useRef } from "react";
import { trpc } from "@/lib/trpc";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  ChevronLeft,
  ChevronRight,
  Leaf,
  Flower2,
  Apple,
  TreePine,
  MoreHorizontal,
  ZoomIn,
  X,
  Loader2,
  Image as ImageIcon,
  Play,
  Pause,
  Camera,
  MapPin,
  Calendar,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface UnifiedImage {
  id: number;
  url: string;
  title?: string | null;
  description?: string | null;
  category: string;
  source: "research" | "morphology";
  location?: string | null;
  capturedAt?: Date | null;
  tags?: string[];
}

// ─── Config des catégories morphologiques ─────────────────────────────────────

const MORPH_CATEGORIES = [
  {
    key: "leaf",
    label: "Feuille",
    icon: <Leaf className="w-3.5 h-3.5" />,
    color: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dot: "bg-emerald-500",
  },
  {
    key: "flower",
    label: "Fleur",
    icon: <Flower2 className="w-3.5 h-3.5" />,
    color: "bg-rose-50 text-rose-700 border-rose-200",
    dot: "bg-rose-500",
  },
  {
    key: "fruit",
    label: "Fruit",
    icon: <Apple className="w-3.5 h-3.5" />,
    color: "bg-amber-50 text-amber-700 border-amber-200",
    dot: "bg-amber-500",
  },
  {
    key: "whole_plant",
    label: "Plante entière",
    icon: <TreePine className="w-3.5 h-3.5" />,
    color: "bg-teal-50 text-teal-700 border-teal-200",
    dot: "bg-teal-500",
  },
  {
    key: "other",
    label: "Autre",
    icon: <MoreHorizontal className="w-3.5 h-3.5" />,
    color: "bg-slate-50 text-slate-600 border-slate-200",
    dot: "bg-slate-400",
  },
] as const;

const RESEARCH_CATEGORIES: Record<string, { label: string; color: string }> = {
  echantillon: { label: "Échantillon", color: "bg-violet-50 text-violet-700 border-violet-200" },
  terrain: { label: "Terrain", color: "bg-lime-50 text-lime-700 border-lime-200" },
  extraction: { label: "Extraction", color: "bg-cyan-50 text-cyan-700 border-cyan-200" },
  analyse: { label: "Analyse", color: "bg-blue-50 text-blue-700 border-blue-200" },
  equipement: { label: "Équipement", color: "bg-orange-50 text-orange-700 border-orange-200" },
  autre: { label: "Autre", color: "bg-slate-50 text-slate-600 border-slate-200" },
};

// ─── Composant Hero Carrousel ─────────────────────────────────────────────────

function HeroCarousel({ images }: { images: UnifiedImage[] }) {
  const [current, setCurrent] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [lightbox, setLightbox] = useState<UnifiedImage | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = useCallback(
    (idx: number) => {
      setCurrent(((idx % images.length) + images.length) % images.length);
    },
    [images.length]
  );

  const prev = useCallback(() => goTo(current - 1), [current, goTo]);
  const next = useCallback(() => goTo(current + 1), [current, goTo]);

  useEffect(() => {
    if (!isPlaying || images.length <= 1) return;
    intervalRef.current = setInterval(() => {
      setCurrent((c) => (c + 1) % images.length);
    }, 4000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, images.length]);

  if (images.length === 0) return null;

  const img = images[current];
  const morphCat = MORPH_CATEGORIES.find((c) => c.key === img.category);
  const researchCat = RESEARCH_CATEGORIES[img.category];

  return (
    <>
      <div className="relative w-full overflow-hidden rounded-xl bg-zinc-950 group">
        {/* Image principale */}
        <div className="relative aspect-[16/7] md:aspect-[21/9]">
          <img
            key={img.id}
            src={img.url}
            alt={img.title || "Image botanique"}
            className="w-full h-full object-cover transition-opacity duration-700"
            style={{ opacity: 1 }}
          />
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Infos bas */}
          <div className="absolute bottom-0 left-0 right-0 p-4 flex items-end justify-between">
            <div className="space-y-1">
              {img.title && (
                <p className="text-white font-semibold text-sm drop-shadow">{img.title}</p>
              )}
              <div className="flex items-center gap-2 flex-wrap">
                {morphCat && (
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs font-medium ${morphCat.color}`}
                  >
                    {morphCat.icon}
                    {morphCat.label}
                  </span>
                )}
                {!morphCat && researchCat && (
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs font-medium ${researchCat.color}`}
                  >
                    <Camera className="w-3 h-3" />
                    {researchCat.label}
                  </span>
                )}
                {img.location && (
                  <span className="inline-flex items-center gap-1 text-white/70 text-xs">
                    <MapPin className="w-3 h-3" />
                    {img.location}
                  </span>
                )}
                {img.capturedAt && (
                  <span className="inline-flex items-center gap-1 text-white/70 text-xs">
                    <Calendar className="w-3 h-3" />
                    {new Date(img.capturedAt).toLocaleDateString("fr-FR")}
                  </span>
                )}
              </div>
            </div>
            {/* Bouton zoom */}
            <button
              onClick={() => setLightbox(img)}
              className="p-2 rounded-full bg-white/10 hover:bg-white/25 backdrop-blur-sm text-white transition-all opacity-0 group-hover:opacity-100"
              title="Agrandir"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>

          {/* Contrôles navigation */}
          {images.length > 1 && (
            <>
              <button
                onClick={prev}
                className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 hover:bg-white/25 backdrop-blur-sm text-white transition-all opacity-0 group-hover:opacity-100"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={next}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 hover:bg-white/25 backdrop-blur-sm text-white transition-all opacity-0 group-hover:opacity-100"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Bouton play/pause */}
          {images.length > 1 && (
            <button
              onClick={() => setIsPlaying((p) => !p)}
              className="absolute top-3 right-3 p-1.5 rounded-full bg-white/10 hover:bg-white/25 backdrop-blur-sm text-white transition-all opacity-0 group-hover:opacity-100"
              title={isPlaying ? "Pause" : "Lecture automatique"}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>
          )}
        </div>

        {/* Indicateurs (dots) */}
        {images.length > 1 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
            {images.map((_, i) => {
              const cat = MORPH_CATEGORIES.find((c) => c.key === images[i].category);
              return (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className={`rounded-full transition-all ${
                    i === current
                      ? `w-5 h-2 ${cat?.dot || "bg-white"}`
                      : "w-2 h-2 bg-white/40 hover:bg-white/70"
                  }`}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* Miniatures */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1 mt-2 scrollbar-thin">
          {images.map((img, i) => {
            const cat = MORPH_CATEGORIES.find((c) => c.key === img.category);
            return (
              <button
                key={img.id}
                onClick={() => goTo(i)}
                className={`relative shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                  i === current
                    ? "border-primary shadow-md scale-105"
                    : "border-transparent opacity-60 hover:opacity-90"
                }`}
              >
                <img
                  src={img.url}
                  alt={img.title || ""}
                  className="w-full h-full object-cover"
                />
                {cat && (
                  <span
                    className={`absolute bottom-0.5 right-0.5 w-2.5 h-2.5 rounded-full border border-white ${cat.dot}`}
                  />
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Lightbox */}
      <Dialog open={!!lightbox} onOpenChange={() => setLightbox(null)}>
        <DialogContent className="max-w-5xl p-0 bg-zinc-950 border-zinc-800">
          {lightbox && (
            <div className="relative">
              <img
                src={lightbox.url}
                alt={lightbox.title || "Image botanique"}
                className="w-full max-h-[85vh] object-contain"
              />
              <button
                onClick={() => setLightbox(null)}
                className="absolute top-3 right-3 p-2 rounded-full bg-white/10 hover:bg-white/25 text-white"
              >
                <X className="w-4 h-4" />
              </button>
              {lightbox.title && (
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                  <p className="text-white font-medium">{lightbox.title}</p>
                  {lightbox.description && (
                    <p className="text-white/70 text-sm mt-1">{lightbox.description}</p>
                  )}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

// ─── Grille d'images par catégorie ────────────────────────────────────────────

function ImageGrid({
  images,
  onSelect,
}: {
  images: UnifiedImage[];
  onSelect: (img: UnifiedImage) => void;
}) {
  if (images.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        <ImageIcon className="h-10 w-10 mx-auto mb-3 opacity-30" />
        <p className="text-sm">Aucune image dans cette catégorie</p>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
      {images.map((img) => {
        const cat = MORPH_CATEGORIES.find((c) => c.key === img.category);
        const resCat = RESEARCH_CATEGORIES[img.category];
        return (
          <button
            key={img.id}
            onClick={() => onSelect(img)}
            className="group relative aspect-square rounded-lg overflow-hidden border border-border hover:border-primary/50 hover:shadow-md transition-all"
          >
            <img
              src={img.url}
              alt={img.title || ""}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
            <div className="absolute bottom-1.5 left-1.5">
              {cat && (
                <span
                  className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded border text-[10px] font-medium ${cat.color}`}
                >
                  {cat.icon}
                  {cat.label}
                </span>
              )}
              {!cat && resCat && (
                <span
                  className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded border text-[10px] font-medium ${resCat.color}`}
                >
                  {resCat.label}
                </span>
              )}
            </div>
            <div className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
              <ZoomIn className="w-4 h-4 text-white drop-shadow" />
            </div>
          </button>
        );
      })}
    </div>
  );
}

// ─── Composant principal PlantImageGallery ────────────────────────────────────

interface PlantImageGalleryProps {
  plantId: number;
  latinName?: string | null;
}

export function PlantImageGallery({ plantId, latinName }: PlantImageGalleryProps) {
  const [lightbox, setLightbox] = useState<UnifiedImage | null>(null);
  const [activeTab, setActiveTab] = useState<string>("all");

  // Extraire genre et espèce depuis le nom latin
  const parts = (latinName || "").trim().split(/\s+/);
  const genus = parts[0] || "";
  const species = parts[1] || "";

  // Requête images de recherche (sampleImages)
  const { data: researchImages, isLoading: loadingResearch } = trpc.gallery.list.useQuery(
    { plantId },
    { enabled: !!plantId }
  );

  // Requête images morphologiques (varietyImages) — si nom latin disponible
  const { data: morphImages, isLoading: loadingMorph } = trpc.varietyImages.getByVariety.useQuery(
    { genus, species },
    { enabled: !!genus }
  );

  const isLoading = loadingResearch || loadingMorph;

  // Unifier les deux sources
  const allImages: UnifiedImage[] = [
    ...(morphImages || []).map((img) => ({
      id: img.id,
      url: img.fileUrl,
      title: img.description || `${img.genus} ${img.species}${img.cultivar ? ` cv. ${img.cultivar}` : ""}`,
      description: img.description,
      category: img.imageType,
      source: "morphology" as const,
      location: null,
      capturedAt: null,
    })),
    ...(researchImages || []).map((img) => ({
      id: img.id + 100000,
      url: img.url,
      title: img.title,
      description: img.description,
      category: img.category || "echantillon",
      source: "research" as const,
      location: img.location,
      capturedAt: img.capturedAt,
      tags: img.tags || [],
    })),
  ];

  // Compter par catégorie morphologique
  const countByCategory = (cat: string) =>
    allImages.filter((img) => img.category === cat).length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (allImages.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        <ImageIcon className="h-12 w-12 mx-auto mb-4 opacity-30" />
        <p className="font-medium">Aucune image pour cette plante</p>
        <p className="text-sm mt-1">
          Utilisez le bouton "Ajouter une image" pour enrichir la fiche.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Hero carrousel */}
      <HeroCarousel images={allImages} />

      {/* Onglets par partie de plante */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="flex flex-wrap h-auto gap-1 bg-muted/50 p-1 rounded-lg">
          <TabsTrigger value="all" className="text-xs px-3 py-1.5 rounded-md">
            Toutes ({allImages.length})
          </TabsTrigger>
          {MORPH_CATEGORIES.map((cat) => {
            const count = countByCategory(cat.key);
            if (count === 0) return null;
            return (
              <TabsTrigger
                key={cat.key}
                value={cat.key}
                className="text-xs px-3 py-1.5 rounded-md flex items-center gap-1"
              >
                {cat.icon}
                {cat.label}
                <span className="ml-1 text-[10px] opacity-70">({count})</span>
              </TabsTrigger>
            );
          })}
          {/* Onglet recherche si images de recherche */}
          {(researchImages || []).length > 0 && (
            <TabsTrigger value="research" className="text-xs px-3 py-1.5 rounded-md flex items-center gap-1">
              <Camera className="w-3 h-3" />
              Recherche
              <span className="ml-1 text-[10px] opacity-70">({researchImages?.length || 0})</span>
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="all" className="mt-3">
          <ImageGrid images={allImages} onSelect={setLightbox} />
        </TabsContent>

        {MORPH_CATEGORIES.map((cat) => (
          <TabsContent key={cat.key} value={cat.key} className="mt-3">
            <ImageGrid
              images={allImages.filter((img) => img.category === cat.key)}
              onSelect={setLightbox}
            />
          </TabsContent>
        ))}

        <TabsContent value="research" className="mt-3">
          <ImageGrid
            images={allImages.filter((img) => img.source === "research")}
            onSelect={setLightbox}
          />
        </TabsContent>
      </Tabs>

      {/* Lightbox depuis la grille */}
      <Dialog open={!!lightbox} onOpenChange={() => setLightbox(null)}>
        <DialogContent className="max-w-5xl p-0 bg-zinc-950 border-zinc-800">
          {lightbox && (
            <div className="relative">
              <img
                src={lightbox.url}
                alt={lightbox.title || "Image botanique"}
                className="w-full max-h-[85vh] object-contain"
              />
              <button
                onClick={() => setLightbox(null)}
                className="absolute top-3 right-3 p-2 rounded-full bg-white/10 hover:bg-white/25 text-white"
              >
                <X className="w-4 h-4" />
              </button>
              {(lightbox.title || lightbox.description) && (
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                  {lightbox.title && (
                    <p className="text-white font-medium">{lightbox.title}</p>
                  )}
                  {lightbox.description && (
                    <p className="text-white/70 text-sm mt-1">{lightbox.description}</p>
                  )}
                  <div className="flex items-center gap-3 mt-2">
                    {lightbox.location && (
                      <span className="text-white/60 text-xs flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {lightbox.location}
                      </span>
                    )}
                    {lightbox.capturedAt && (
                      <span className="text-white/60 text-xs flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(lightbox.capturedAt).toLocaleDateString("fr-FR")}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
