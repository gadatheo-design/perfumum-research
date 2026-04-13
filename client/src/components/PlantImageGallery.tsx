/**
 * PlantImageGallery.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Galerie d'images enrichie pour la fiche plante :
 *  - Carrousel hero avec défilement automatique
 *  - Grille réorganisable par glisser-déposer (@dnd-kit)
 *  - Onglets par partie de plante
 *  - Lightbox plein écran
 * ─────────────────────────────────────────────────────────────────────────────
 */
import { useState, useEffect, useCallback, useRef } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
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
  GripVertical,
  Save,
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
  sortOrder?: number;
}

// ─── Config des catégories morphologiques ─────────────────────────────────────

const MORPH_CATEGORIES = [
  { key: "leaf", label: "Feuille", icon: <Leaf className="w-3.5 h-3.5" />, color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  { key: "flower", label: "Fleur", icon: <Flower2 className="w-3.5 h-3.5" />, color: "bg-rose-50 text-rose-700 border-rose-200" },
  { key: "fruit", label: "Fruit", icon: <Apple className="w-3.5 h-3.5" />, color: "bg-amber-50 text-amber-700 border-amber-200" },
  { key: "whole_plant", label: "Plante entière", icon: <TreePine className="w-3.5 h-3.5" />, color: "bg-teal-50 text-teal-700 border-teal-200" },
  { key: "other", label: "Autre", icon: <MoreHorizontal className="w-3.5 h-3.5" />, color: "bg-slate-50 text-slate-600 border-slate-200" },
] as const;

const RESEARCH_CATEGORIES: Record<string, { label: string; color: string }> = {
  echantillon: { label: "Échantillon", color: "bg-violet-50 text-violet-700 border-violet-200" },
  terrain: { label: "Terrain", color: "bg-lime-50 text-lime-700 border-lime-200" },
  extraction: { label: "Extraction", color: "bg-cyan-50 text-cyan-700 border-cyan-200" },
  analyse: { label: "Analyse", color: "bg-blue-50 text-blue-700 border-blue-200" },
  equipement: { label: "Équipement", color: "bg-orange-50 text-orange-700 border-orange-200" },
  autre: { label: "Autre", color: "bg-slate-50 text-slate-600 border-slate-200" },
};

// ─── Hero Carrousel ───────────────────────────────────────────────────────────

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

  useEffect(() => {
    if (!isPlaying || images.length <= 1) return;
    intervalRef.current = setInterval(() => {
      setCurrent((c) => (c + 1) % images.length);
    }, 4500);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, images.length]);

  if (images.length === 0) return null;
  const img = images[current];

  return (
    <>
      <div className="relative rounded-xl overflow-hidden bg-zinc-100 aspect-[4/3] group">
        {/* Image principale */}
        <img
          key={img.id}
          src={img.url}
          alt={img.title || "Image botanique"}
          className="w-full h-full object-cover transition-opacity duration-500"
        />

        {/* Overlay gradient bas */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

        {/* Badge catégorie */}
        <div className="absolute top-3 left-3">
          {(() => {
            const cat = MORPH_CATEGORIES.find((c) => c.key === img.category);
            const resCat = RESEARCH_CATEGORIES[img.category];
            if (cat)
              return (
                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full border text-xs font-medium backdrop-blur-sm ${cat.color}`}>
                  {cat.icon} {cat.label}
                </span>
              );
            if (resCat)
              return (
                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full border text-xs font-medium backdrop-blur-sm ${resCat.color}`}>
                  {resCat.label}
                </span>
              );
            return null;
          })()}
        </div>

        {/* Bouton zoom */}
        <button
          onClick={() => setLightbox(img)}
          className="absolute top-3 right-3 p-2 rounded-full bg-black/30 hover:bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ZoomIn className="w-4 h-4" />
        </button>

        {/* Contrôles navigation */}
        {images.length > 1 && (
          <>
            <button
              onClick={() => goTo(current - 1)}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 hover:bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => goTo(current + 1)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 hover:bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Légende */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          {img.title && (
            <p className="text-white text-sm font-medium drop-shadow">{img.title}</p>
          )}
          {img.description && img.description !== img.title && (
            <p className="text-white/70 text-xs mt-0.5 drop-shadow">{img.description}</p>
          )}
        </div>

        {/* Contrôle play/pause + compteur */}
        {images.length > 1 && (
          <div className="absolute bottom-3 right-3 flex items-center gap-2">
            <span className="text-white/60 text-xs">
              {current + 1}/{images.length}
            </span>
            <button
              onClick={() => setIsPlaying((p) => !p)}
              className="p-1.5 rounded-full bg-black/30 hover:bg-black/50 text-white"
            >
              {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
            </button>
          </div>
        )}
      </div>

      {/* Miniatures */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-border">
          {images.map((thumb, i) => (
            <button
              key={thumb.id}
              onClick={() => goTo(i)}
              className={`flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                i === current
                  ? "border-primary shadow-sm scale-105"
                  : "border-transparent opacity-60 hover:opacity-100"
              }`}
            >
              <img src={thumb.url} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
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
              {(lightbox.title || lightbox.description) && (
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                  {lightbox.title && <p className="text-white font-medium">{lightbox.title}</p>}
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

// ─── Composant Carte Sortable ─────────────────────────────────────────────────

function SortableImageCard({
  image,
  onSelect,
  isDragMode,
}: {
  image: UnifiedImage;
  onSelect: (img: UnifiedImage) => void;
  isDragMode: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: image.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : undefined,
  };

  const cat = MORPH_CATEGORIES.find((c) => c.key === image.category);
  const resCat = RESEARCH_CATEGORIES[image.category];

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative aspect-square rounded-lg overflow-hidden border border-border transition-all ${
        isDragMode ? "cursor-grab active:cursor-grabbing" : "cursor-pointer"
      } ${isDragging ? "shadow-2xl ring-2 ring-primary" : "hover:border-primary/50 hover:shadow-md"}`}
    >
      {/* Poignée de drag */}
      {isDragMode && (
        <div
          {...attributes}
          {...listeners}
          className="absolute top-2 left-2 z-10 p-1 rounded bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <GripVertical className="w-3.5 h-3.5" />
        </div>
      )}

      <img
        src={image.url}
        alt={image.title || ""}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        onClick={() => !isDragMode && onSelect(image)}
      />
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors pointer-events-none" />

      {/* Badge catégorie */}
      <div className="absolute bottom-1.5 left-1.5 pointer-events-none">
        {cat && (
          <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded border text-[10px] font-medium ${cat.color}`}>
            {cat.icon} {cat.label}
          </span>
        )}
        {!cat && resCat && (
          <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded border text-[10px] font-medium ${resCat.color}`}>
            {resCat.label}
          </span>
        )}
      </div>

      {/* Icône zoom (mode normal) */}
      {!isDragMode && (
        <div className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <ZoomIn className="w-4 h-4 text-white drop-shadow" />
        </div>
      )}
    </div>
  );
}

// ─── Grille réorganisable ─────────────────────────────────────────────────────

function SortableImageGrid({
  images,
  onSelect,
  onReorder,
  canReorder,
}: {
  images: UnifiedImage[];
  onSelect: (img: UnifiedImage) => void;
  onReorder: (newOrder: UnifiedImage[]) => void;
  canReorder: boolean;
}) {
  const [isDragMode, setIsDragMode] = useState(false);
  const [localImages, setLocalImages] = useState<UnifiedImage[]>(images);
  const [hasChanges, setHasChanges] = useState(false);

  // Sync when parent images change
  useEffect(() => {
    setLocalImages(images);
    setHasChanges(false);
  }, [images]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setLocalImages((items) => {
      const oldIndex = items.findIndex((i) => i.id === active.id);
      const newIndex = items.findIndex((i) => i.id === over.id);
      const newOrder = arrayMove(items, oldIndex, newIndex);
      setHasChanges(true);
      return newOrder;
    });
  }

  function handleSave() {
    onReorder(localImages);
    setHasChanges(false);
    setIsDragMode(false);
  }

  if (images.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        <ImageIcon className="h-10 w-10 mx-auto mb-3 opacity-30" />
        <p className="text-sm">Aucune image dans cette catégorie</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Barre d'outils drag-and-drop */}
      {canReorder && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            {isDragMode
              ? "Glissez les images pour les réorganiser"
              : `${localImages.length} image${localImages.length > 1 ? "s" : ""}`}
          </p>
          <div className="flex items-center gap-2">
            {isDragMode && hasChanges && (
              <Button size="sm" variant="default" onClick={handleSave} className="h-7 text-xs gap-1">
                <Save className="w-3 h-3" />
                Sauvegarder l'ordre
              </Button>
            )}
            <Button
              size="sm"
              variant={isDragMode ? "secondary" : "outline"}
              onClick={() => {
                if (isDragMode && hasChanges) handleSave();
                else setIsDragMode((d) => !d);
              }}
              className="h-7 text-xs gap-1"
            >
              <GripVertical className="w-3 h-3" />
              {isDragMode ? "Terminer" : "Réorganiser"}
            </Button>
          </div>
        </div>
      )}

      {/* Grille */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={localImages.map((i) => i.id)} strategy={rectSortingStrategy}>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {localImages.map((img) => (
              <SortableImageCard
                key={img.id}
                image={img}
                onSelect={onSelect}
                isDragMode={isDragMode}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}

// ─── Composant principal ──────────────────────────────────────────────────────

interface PlantImageGalleryProps {
  plantId: number;
  latinName?: string | null;
  isAdmin?: boolean;
}

export function PlantImageGallery({ plantId, latinName, isAdmin = false }: PlantImageGalleryProps) {
  const [lightbox, setLightbox] = useState<UnifiedImage | null>(null);
  const [activeTab, setActiveTab] = useState<string>("all");
  const { toast } = useToast();
  const utils = trpc.useUtils();

  const parts = (latinName || "").trim().split(/\s+/);
  const genus = parts[0] || "";
  const species = parts[1] || "";

  const { data: researchImages, isLoading: loadingResearch } = trpc.gallery.list.useQuery({ plantId }, { enabled: !!plantId });
  const { data: morphImages, isLoading: loadingMorph } = trpc.varietyImages.getByVariety.useQuery({ genus, species }, { enabled: !!genus });

  // Requête images morphologiques (varietyImages)
  const { data: morphImages, isLoading: loadingMorph } = trpc.varietyImages.getByVariety.useQuery(
    { genus, species },
    { enabled: !!genus }
  );

  // Mutations reorder
  const reorderMorphMutation = trpc.varietyImages.reorderImages.useMutation({
    onSuccess: () => {
      utils.varietyImages.getByVariety.invalidate({ genus, species });
      toast({ title: "Ordre sauvegardé", description: "L'ordre des images morphologiques a été mis à jour." });
    },
    onError: (err) => {
      toast({ title: "Erreur", description: err.message, variant: "destructive" });
    },
  });

  const reorderGalleryMutation = trpc.gallery.reorder.useMutation({
    onSuccess: () => {
      utils.gallery.list.invalidate({ plantId });
      toast({ title: "Ordre sauvegardé", description: "L'ordre des images de recherche a été mis à jour." });
    },
    onError: (err) => {
      toast({ title: "Erreur", description: err.message, variant: "destructive" });
    },
  });

  const isLoading = loadingResearch || loadingMorph;

  // Handlers reorder
  function handleReorderMorph(newOrder: UnifiedImage[]) {
    const items = newOrder.map((img, idx) => ({ id: img.id, sortOrder: idx }));
    reorderMorphMutation.mutate({ items });
  }

  function handleReorderResearch(newOrder: UnifiedImage[]) {
    const items = newOrder.map((img, idx) => ({
      id: img.id - 100000, // remove offset
      sortOrder: idx,
    }));
    reorderGalleryMutation.mutate({ items });
  }

  function handleReorderAll(newOrder: UnifiedImage[]) {
    const morphItems = newOrder
      .filter((img) => img.source === "morphology")
      .map((img, idx) => ({ id: img.id, sortOrder: idx }));
    const researchItems = newOrder
      .filter((img) => img.source === "research")
      .map((img, idx) => ({ id: img.id - 100000, sortOrder: idx }));
    if (morphItems.length > 0) reorderMorphMutation.mutate({ items: morphItems });
    if (researchItems.length > 0) reorderGalleryMutation.mutate({ items: researchItems });
  }

  const countByCategory = (cat: string) => allImages.filter((img) => img.category === cat).length;

  if (isLoading) {
    return <div className="flex items-center justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>;
  }

  if (allImages.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        <ImageIcon className="h-12 w-12 mx-auto mb-4 opacity-30" />
        <p className="font-medium">Aucune image pour cette plante</p>
        <p className="text-sm mt-1">Utilisez le bouton "Ajouter une image" pour enrichir la fiche.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <HeroCarousel images={allImages} />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="flex flex-wrap h-auto gap-1 bg-muted/50 p-1 rounded-lg">
          <TabsTrigger value="all" className="text-xs px-3 py-1.5 rounded-md">Toutes ({allImages.length})</TabsTrigger>
          {MORPH_CATEGORIES.map((cat) => {
            const count = countByCategory(cat.key);
            if (count === 0) return null;
            return (
              <TabsTrigger key={cat.key} value={cat.key} className="text-xs px-3 py-1.5 rounded-md flex items-center gap-1">
                {cat.icon} {cat.label} <span className="ml-1 text-[10px] opacity-70">({count})</span>
              </TabsTrigger>
            );
          })}
          {researchUnified.length > 0 && (
            <TabsTrigger value="research" className="text-xs px-3 py-1.5 rounded-md flex items-center gap-1">
              <Camera className="w-3 h-3" />
              Recherche
              <span className="ml-1 text-[10px] opacity-70">({researchUnified.length})</span>
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="all" className="mt-3">
          <SortableImageGrid
            images={allImages}
            onSelect={setLightbox}
            onReorder={handleReorderAll}
            canReorder={isAdmin}
          />
        </TabsContent>

        {MORPH_CATEGORIES.map((cat) => (
          <TabsContent key={cat.key} value={cat.key} className="mt-3">
            <SortableImageGrid
              images={morphUnified.filter((img) => img.category === cat.key)}
              onSelect={setLightbox}
              onReorder={handleReorderMorph}
              canReorder={isAdmin}
            />
          </TabsContent>
        ))}

        <TabsContent value="research" className="mt-3">
          <SortableImageGrid
            images={researchUnified}
            onSelect={setLightbox}
            onReorder={handleReorderResearch}
            canReorder={isAdmin}
          />
        </TabsContent>
      </Tabs>

      {/* Lightbox depuis la grille */}
      <Dialog open={!!lightbox} onOpenChange={() => setLightbox(null)}>
        <DialogContent className="max-w-5xl p-0 bg-zinc-950 border-zinc-800">
          {lightbox && (
            <div className="relative">
              <img src={lightbox.url} alt={lightbox.title || "Image botanique"} className="w-full max-h-[85vh] object-contain" />
              <button onClick={() => setLightbox(null)} className="absolute top-3 right-3 p-2 rounded-full bg-white/10 hover:bg-white/25 text-white"><X className="w-4 h-4" /></button>
              {(lightbox.title || lightbox.description) && (
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                  {lightbox.title && <p className="text-white font-medium">{lightbox.title}</p>}
                  {lightbox.description && <p className="text-white/70 text-sm mt-1">{lightbox.description}</p>}
                  <div className="flex items-center gap-3 mt-2">
                    {lightbox.location && <span className="text-white/60 text-xs flex items-center gap-1"><MapPin className="w-3 h-3" />{lightbox.location}</span>}
                    {lightbox.capturedAt && <span className="text-white/60 text-xs flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(lightbox.capturedAt).toLocaleDateString("fr-FR")}</span>}
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
