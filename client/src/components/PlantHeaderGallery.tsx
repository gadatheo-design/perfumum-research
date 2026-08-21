/**
 * PlantHeaderGallery.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Galerie hero pour le header de la fiche plante.
 * Combine : image principale (plants.imageUrl) + images morphologiques (varietyImages)
 * Carousel défilant avec miniatures, légendes et lightbox.
 * ─────────────────────────────────────────────────────────────────────────────
 */
import { useState, useEffect, useCallback, useRef } from "react";
import { trpc } from "@/lib/trpc";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  X,
  Leaf,
  Flower2,
  Apple,
  TreePine,
  MoreHorizontal,
  Image as ImageIcon,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface GalleryImage {
  id: string;
  url: string;
  title?: string | null;
  partLabel?: string | null;
  partColor?: string;
  source: "main" | "morphology";
}

const PART_CONFIG: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  leaf:        { label: "Feuille",        icon: <Leaf className="w-3 h-3" />,       color: "bg-emerald-500/80" },
  flower:      { label: "Fleur",          icon: <Flower2 className="w-3 h-3" />,    color: "bg-rose-500/80" },
  fruit:       { label: "Fruit",          icon: <Apple className="w-3 h-3" />,      color: "bg-amber-500/80" },
  whole_plant: { label: "Plante entière", icon: <TreePine className="w-3 h-3" />,   color: "bg-teal-500/80" },
  other:       { label: "Autre",          icon: <MoreHorizontal className="w-3 h-3" />, color: "bg-slate-500/80" },
};

// ─── Props ────────────────────────────────────────────────────────────────────
interface PlantHeaderGalleryProps {
  plantId: number;
  plantName: string;
  latinName?: string | null;
  mainImageUrl?: string | null;
}

// ─── Composant principal ──────────────────────────────────────────────────────
export function PlantHeaderGallery({
  plantId,
  plantName,
  latinName,
  mainImageUrl,
}: PlantHeaderGalleryProps) {
  const [current, setCurrent] = useState(0);
  const [lightbox, setLightbox] = useState<GalleryImage | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Parser genus/species depuis latinName
  const parts = (latinName || "").trim().split(/\s+/);
  const genus = parts[0] || "";
  const species = parts[1] || "";

  // Charger les images morphologiques (varietyImages)
  const { data: morphImages } = trpc.varietyImages.getByVariety.useQuery(
    { genus, species },
    { enabled: !!genus }
  );

  // Construire la liste unifiée
  const images: GalleryImage[] = [
    // Image principale en premier
    ...(mainImageUrl
      ? [{ id: "main", url: mainImageUrl, title: plantName, source: "main" as const }]
      : []),
    // Images morphologiques
    ...(morphImages || []).map((img) => {
      const part = PART_CONFIG[img.imageType] || PART_CONFIG.other;
      return {
        id: `morph-${img.id}`,
        url: img.fileUrl,
        title: img.description || `${img.genus} ${img.species}`,
        partLabel: part.label,
        partColor: part.color,
        source: "morphology" as const,
      };
    }),
  ];

  const total = images.length;

  const goTo = useCallback(
    (idx: number) => setCurrent(((idx % total) + total) % total),
    [total]
  );
  const prev = useCallback(() => goTo(current - 1), [current, goTo]);
  const next = useCallback(() => goTo(current + 1), [current, goTo]);

  // Défilement automatique (pause au survol)
  useEffect(() => {
    if (total <= 1 || isHovered) return;
    intervalRef.current = setInterval(() => {
      setCurrent((c) => (c + 1) % total);
    }, 4500);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [total, isHovered]);

  // Pas d'image du tout
  if (total === 0) {
    return (
      <div className="w-full md:w-72 lg:w-80 shrink-0 flex items-center justify-center rounded-xl border border-dashed border-border bg-muted/30 aspect-[4/3]">
        <div className="text-center text-muted-foreground/50 p-4">
          <ImageIcon className="h-10 w-10 mx-auto mb-2 opacity-40" />
          <p className="text-xs">Aucune image</p>
        </div>
      </div>
    );
  }

  const img = images[current];

  return (
    <>
      <div
        className="w-full md:w-72 lg:w-80 xl:w-96 shrink-0 relative rounded-xl overflow-hidden bg-zinc-950 shadow-lg group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image principale */}
        <div className="aspect-[4/3] relative">
          <img
            key={img.id}
            src={img.url}
            alt={img.title || plantName}
            className="w-full h-full object-cover transition-opacity duration-700"
          />
          {/* Overlay gradient bas */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

          {/* Badge partie de plante */}
          {img.partLabel && (
            <div className={`absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-full text-white text-[10px] font-medium ${img.partColor}`}>
              {PART_CONFIG[Object.keys(PART_CONFIG).find(k => PART_CONFIG[k].label === img.partLabel) || "other"]?.icon}
              {img.partLabel}
            </div>
          )}
          {img.source === "main" && (
            <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-violet-600/80 text-white text-[10px] font-medium">
              <ImageIcon className="w-3 h-3" />
              Photo principale
            </div>
          )}

          {/* Bouton zoom */}
          <button
            onClick={() => setLightbox(img)}
            className="absolute top-2 right-2 p-1.5 rounded-full bg-black/40 hover:bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>

          {/* Compteur */}
          {total > 1 && (
            <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-full bg-black/50 text-white text-[10px]">
              {current + 1} / {total}
            </div>
          )}

          {/* Légende */}
          {img.title && img.source !== "main" && (
            <div className="absolute bottom-0 left-0 right-0 px-3 py-2">
              <p className="text-white text-xs line-clamp-1 opacity-90">{img.title}</p>
            </div>
          )}

          {/* Flèches navigation */}
          {total > 1 && (
            <>
              <button
                onClick={prev}
                className="absolute left-1.5 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/40 hover:bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={next}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/40 hover:bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </>
          )}
        </div>

        {/* Miniatures défilantes (si > 1 image) */}
        {total > 1 && (
          <div className="flex gap-1 p-2 bg-zinc-900/80 overflow-x-auto scrollbar-none">
            {images.map((im, idx) => (
              <button
                key={im.id}
                onClick={() => setCurrent(idx)}
                className={`shrink-0 w-10 h-10 rounded overflow-hidden border-2 transition-all ${
                  idx === current
                    ? "border-white/80 opacity-100 scale-105"
                    : "border-transparent opacity-50 hover:opacity-80"
                }`}
              >
                <img src={im.url} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      <Dialog open={!!lightbox} onOpenChange={() => setLightbox(null)}>
        <DialogContent className="max-w-5xl p-0 bg-zinc-950 border-zinc-800">
          {lightbox && (
            <div className="relative">
              <img
                src={lightbox.url}
                alt={lightbox.title || plantName}
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
                  {lightbox.partLabel && (
                    <p className="text-white/60 text-sm mt-0.5">{lightbox.partLabel}</p>
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
