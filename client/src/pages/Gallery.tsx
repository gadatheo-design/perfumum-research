import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { 
  Image as ImageIcon, 
  Upload, 
  Search, 
  Filter, 
  Grid3X3, 
  List, 
  X, 
  ZoomIn,
  Calendar,
  MapPin,
  Tag,
  Trash2,
  Edit,
  Plus,
  Camera,
  Beaker,
  Mountain,
  Settings,
  Loader2,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import ImageUpload from "@/components/ImageUpload";

const CATEGORY_OPTIONS = [
  { value: "echantillon", label: "Échantillon", icon: Camera },
  { value: "extraction", label: "Extraction", icon: Beaker },
  { value: "analyse", label: "Analyse", icon: Settings },
  { value: "terrain", label: "Terrain", icon: Mountain },
  { value: "equipement", label: "Équipement", icon: Settings },
  { value: "autre", label: "Autre", icon: ImageIcon },
];

export default function Gallery() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  
  // Form state for upload
  const [uploadForm, setUploadForm] = useState({
    title: "",
    description: "",
    category: "echantillon" as const,
    tags: "",
    location: "",
    capturedAt: "",
    imageData: "",
    fileName: "",
    contentType: "",
  });

  // Queries
  const { data: images, isLoading, refetch } = trpc.gallery.list.useQuery(
    selectedCategory ? { category: selectedCategory } : undefined
  );
  const { data: stats } = trpc.gallery.getStats.useQuery();
  
  // Mutations
  const uploadMutation = trpc.upload.galleryImage.useMutation({
    onSuccess: () => {
      toast.success("Image uploadée avec succès");
      setIsUploadOpen(false);
      setUploadForm({
        title: "",
        description: "",
        category: "echantillon",
        tags: "",
        location: "",
        capturedAt: "",
        imageData: "",
        fileName: "",
        contentType: "",
      });
      refetch();
    },
    onError: (error) => {
      toast.error(`Erreur lors de l'upload: ${error.message}`);
    },
  });
  
  const deleteMutation = trpc.gallery.delete.useMutation({
    onSuccess: () => {
      toast.success("Image supprimée");
      setSelectedImage(null);
      refetch();
    },
    onError: (error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });

  // Filtered images
  const filteredImages = useMemo(() => {
    if (!images) return [];
    
    let filtered = images;
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(img => 
        img.title?.toLowerCase().includes(term) ||
        img.description?.toLowerCase().includes(term) ||
        img.location?.toLowerCase().includes(term) ||
        (img.tags as string[] | null)?.some(tag => tag.toLowerCase().includes(term))
      );
    }
    
    return filtered;
  }, [images, searchTerm]);

  // Handle file selection for upload
  const handleFileSelect = async (file: File) => {
    return new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        setUploadForm(prev => ({
          ...prev,
          imageData: dataUrl,
          fileName: file.name,
          contentType: file.type,
        }));
        resolve(dataUrl);
      };
      reader.readAsDataURL(file);
    });
  };

  // Handle upload submission
  const handleUpload = () => {
    if (!uploadForm.imageData) {
      toast.error("Veuillez sélectionner une image");
      return;
    }
    
    uploadMutation.mutate({
      imageData: uploadForm.imageData,
      fileName: uploadForm.fileName,
      contentType: uploadForm.contentType,
      title: uploadForm.title || undefined,
      description: uploadForm.description || undefined,
      category: uploadForm.category,
      tags: uploadForm.tags ? uploadForm.tags.split(",").map(t => t.trim()) : undefined,
      location: uploadForm.location || undefined,
      capturedAt: uploadForm.capturedAt || undefined,
    });
  };

  // Lightbox navigation
  const handleLightboxPrev = () => {
    if (lightboxIndex !== null && lightboxIndex > 0) {
      setLightboxIndex(lightboxIndex - 1);
    }
  };

  const handleLightboxNext = () => {
    if (lightboxIndex !== null && filteredImages && lightboxIndex < filteredImages.length - 1) {
      setLightboxIndex(lightboxIndex + 1);
    }
  };

  const getCategoryIcon = (category: string) => {
    const cat = CATEGORY_OPTIONS.find(c => c.value === category);
    return cat ? cat.icon : ImageIcon;
  };

  const getCategoryLabel = (category: string) => {
    const cat = CATEGORY_OPTIONS.find(c => c.value === category);
    return cat ? cat.label : category;
  };

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <ImageIcon className="h-8 w-8 text-primary" />
            Galerie d'images
          </h1>
          <p className="text-muted-foreground">
            Visualisez et gérez les photographies de vos échantillons et recherches
          </p>
        </div>
        
        {user && (
          <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Upload className="h-4 w-4" />
                Ajouter une image
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Ajouter une nouvelle image</DialogTitle>
                <DialogDescription>
                  Uploadez une image vers la galerie avec ses métadonnées
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <ImageUpload
                  value={uploadForm.imageData}
                  onChange={(url) => {
                    if (!url) {
                      setUploadForm(prev => ({
                        ...prev,
                        imageData: "",
                        fileName: "",
                        contentType: "",
                      }));
                    }
                  }}
                  onUpload={handleFileSelect}
                  placeholder="Glissez une image ou cliquez pour sélectionner"
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Titre</Label>
                    <Input
                      id="title"
                      value={uploadForm.title}
                      onChange={(e) => setUploadForm(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Titre de l'image"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="category">Catégorie</Label>
                    <Select
                      value={uploadForm.category}
                      onValueChange={(v: any) => setUploadForm(prev => ({ ...prev, category: v }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORY_OPTIONS.map(opt => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={uploadForm.description}
                    onChange={(e) => setUploadForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Description de l'image..."
                    rows={3}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="location">Lieu</Label>
                    <Input
                      id="location"
                      value={uploadForm.location}
                      onChange={(e) => setUploadForm(prev => ({ ...prev, location: e.target.value }))}
                      placeholder="Lieu de prise de vue"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="capturedAt">Date de capture</Label>
                    <Input
                      id="capturedAt"
                      type="date"
                      value={uploadForm.capturedAt}
                      onChange={(e) => setUploadForm(prev => ({ ...prev, capturedAt: e.target.value }))}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="tags">Tags (séparés par des virgules)</Label>
                  <Input
                    id="tags"
                    value={uploadForm.tags}
                    onChange={(e) => setUploadForm(prev => ({ ...prev, tags: e.target.value }))}
                    placeholder="tabac, san-andres, extraction..."
                  />
                </div>
                
                <Button 
                  onClick={handleUpload} 
                  disabled={uploadMutation.isPending || !uploadForm.imageData}
                  className="w-full"
                >
                  {uploadMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Upload en cours...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Uploader l'image
                    </>
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
          <Card>
            <CardContent className="pt-4 pb-3">
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">Total</p>
            </CardContent>
          </Card>
          {CATEGORY_OPTIONS.map(cat => {
            const count = stats.byCategory[cat.value] || 0;
            const Icon = cat.icon;
            return (
              <Card 
                key={cat.value}
                className={`cursor-pointer transition-colors ${selectedCategory === cat.value ? 'border-primary' : ''}`}
                onClick={() => setSelectedCategory(selectedCategory === cat.value ? "" : cat.value)}
              >
                <CardContent className="pt-4 pb-3">
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-2xl font-bold">{count}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{cat.label}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher par titre, description, lieu ou tag..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-[180px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Toutes catégories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Toutes catégories</SelectItem>
            {CATEGORY_OPTIONS.map(opt => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <div className="flex gap-1 border rounded-md p-1">
          <Button
            variant={viewMode === "grid" ? "secondary" : "ghost"}
            size="icon"
            onClick={() => setViewMode("grid")}
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "secondary" : "ghost"}
            size="icon"
            onClick={() => setViewMode("list")}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className={viewMode === "grid" 
          ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
          : "space-y-4"
        }>
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i}>
              <Skeleton className="aspect-square" />
              <CardContent className="pt-3">
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-3 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && filteredImages.length === 0 && (
        <Card className="py-16">
          <CardContent className="flex flex-col items-center justify-center text-center">
            <ImageIcon className="h-16 w-16 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Aucune image</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || selectedCategory 
                ? "Aucune image ne correspond à vos critères de recherche"
                : "La galerie est vide. Commencez par ajouter des images."}
            </p>
            {user && !searchTerm && !selectedCategory && (
              <Button onClick={() => setIsUploadOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Ajouter une image
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Grid view */}
      {!isLoading && filteredImages.length > 0 && viewMode === "grid" && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredImages.map((image, index) => {
            const CategoryIcon = getCategoryIcon(image.category || "autre");
            return (
              <Card 
                key={image.id} 
                className="overflow-hidden cursor-pointer group hover:ring-2 hover:ring-primary transition-all"
                onClick={() => setLightboxIndex(index)}
              >
                <div className="aspect-square relative bg-muted">
                  <img
                    src={image.url}
                    alt={image.title || "Image"}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                    <ZoomIn className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <Badge className="absolute top-2 right-2" variant="secondary">
                    <CategoryIcon className="h-3 w-3 mr-1" />
                    {getCategoryLabel(image.category || "autre")}
                  </Badge>
                </div>
                <CardContent className="pt-3">
                  <h3 className="font-medium truncate">{image.title || "Sans titre"}</h3>
                  {image.location && (
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                      <MapPin className="h-3 w-3" />
                      {image.location}
                    </p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* List view */}
      {!isLoading && filteredImages.length > 0 && viewMode === "list" && (
        <div className="space-y-4">
          {filteredImages.map((image, index) => {
            const CategoryIcon = getCategoryIcon(image.category || "autre");
            return (
              <Card 
                key={image.id}
                className="overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary transition-all"
                onClick={() => setLightboxIndex(index)}
              >
                <div className="flex">
                  <div className="w-32 h-32 md:w-48 md:h-48 flex-shrink-0 bg-muted">
                    <img
                      src={image.url}
                      alt={image.title || "Image"}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <CardContent className="flex-1 py-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">{image.title || "Sans titre"}</h3>
                        <Badge variant="outline" className="mt-1">
                          <CategoryIcon className="h-3 w-3 mr-1" />
                          {getCategoryLabel(image.category || "autre")}
                        </Badge>
                      </div>
                      {user && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm("Supprimer cette image ?")) {
                              deleteMutation.mutate(image.id);
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      )}
                    </div>
                    {image.description && (
                      <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                        {image.description}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-4 mt-3 text-xs text-muted-foreground">
                      {image.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {image.location}
                        </span>
                      )}
                      {image.capturedAt && (
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(image.capturedAt).toLocaleDateString("fr-FR")}
                        </span>
                      )}
                    </div>
                    {((image.tags as string[] | null)?.length ?? 0) > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {(image.tags as string[]).map((tag, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            <Tag className="h-2 w-2 mr-1" />
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Lightbox */}
      {lightboxIndex !== null && filteredImages[lightboxIndex] && (
        <Dialog open={true} onOpenChange={() => setLightboxIndex(null)}>
          <DialogContent className="max-w-5xl p-0 bg-black/95">
            <div className="relative">
              {/* Close button */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 z-10 text-white hover:bg-white/20"
                onClick={() => setLightboxIndex(null)}
              >
                <X className="h-6 w-6" />
              </Button>
              
              {/* Navigation */}
              {lightboxIndex > 0 && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-white hover:bg-white/20"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLightboxPrev();
                  }}
                >
                  <ChevronLeft className="h-8 w-8" />
                </Button>
              )}
              {lightboxIndex < filteredImages.length - 1 && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-10 text-white hover:bg-white/20"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLightboxNext();
                  }}
                >
                  <ChevronRight className="h-8 w-8" />
                </Button>
              )}
              
              {/* Image */}
              <div className="flex items-center justify-center min-h-[60vh] p-8">
                <img
                  src={filteredImages[lightboxIndex].url}
                  alt={filteredImages[lightboxIndex].title || "Image"}
                  className="max-w-full max-h-[70vh] object-contain"
                />
              </div>
              
              {/* Info */}
              <div className="bg-background p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-xl font-semibold">
                      {filteredImages[lightboxIndex].title || "Sans titre"}
                    </h2>
                    {filteredImages[lightboxIndex].description && (
                      <p className="text-muted-foreground mt-2">
                        {filteredImages[lightboxIndex].description}
                      </p>
                    )}
                  </div>
                  {user && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        if (confirm("Supprimer cette image ?")) {
                          deleteMutation.mutate(filteredImages[lightboxIndex].id);
                          setLightboxIndex(null);
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Supprimer
                    </Button>
                  )}
                </div>
                <div className="flex flex-wrap gap-4 mt-4 text-sm text-muted-foreground">
                  <Badge variant="outline">
                    {getCategoryLabel(filteredImages[lightboxIndex].category || "autre")}
                  </Badge>
                  {filteredImages[lightboxIndex].location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {filteredImages[lightboxIndex].location}
                    </span>
                  )}
                  {filteredImages[lightboxIndex].capturedAt && (
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(filteredImages[lightboxIndex].capturedAt).toLocaleDateString("fr-FR")}
                    </span>
                  )}
                </div>
                {((filteredImages[lightboxIndex].tags as string[] | null)?.length ?? 0) > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {(filteredImages[lightboxIndex].tags as string[]).map((tag, i) => (
                      <Badge key={i} variant="secondary">
                        <Tag className="h-3 w-3 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
                <p className="text-xs text-muted-foreground mt-4">
                  Image {lightboxIndex + 1} sur {filteredImages.length}
                </p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
