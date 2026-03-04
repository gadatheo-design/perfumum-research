// @ts-nocheck
import { useState, useRef } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { 
  Upload, 
  Image as ImageIcon, 
  X, 
  Loader2, 
  Camera,
  MapPin,
  Calendar,
  Tag,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";

interface PlantImageUploadProps {
  plantId: number;
  plantName: string;
  onUploadComplete?: () => void;
}

const IMAGE_CATEGORIES = [
  { value: "echantillon", label: "Échantillon", description: "Photo de l'échantillon botanique" },
  { value: "terrain", label: "Terrain", description: "Photo prise sur le terrain" },
  { value: "extraction", label: "Extraction", description: "Processus d'extraction" },
  { value: "analyse", label: "Analyse", description: "Résultats d'analyse (GC-MS, etc.)" },
  { value: "equipement", label: "Équipement", description: "Matériel utilisé" },
  { value: "autre", label: "Autre", description: "Autre type d'image" },
] as const;

export function PlantImageUpload({ plantId, plantName, onUploadComplete }: PlantImageUploadProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<string>("echantillon");
  const [location, setLocation] = useState("");
  const [capturedAt, setCapturedAt] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const utils = trpc.useUtils();
  
  const uploadMutation = trpc.upload.galleryImage.useMutation({
    onSuccess: () => {
      toast.success("Image téléchargée avec succès");
      utils.gallery.list.invalidate();
      resetForm();
      setIsOpen(false);
      onUploadComplete?.();
    },
    onError: (error) => {
      setUploadError(error.message);
      toast.error("Erreur lors du téléchargement");
    },
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Vérifier le type de fichier
    if (!file.type.startsWith("image/")) {
      toast.error("Veuillez sélectionner une image");
      return;
    }

    // Vérifier la taille (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("L'image ne doit pas dépasser 10 Mo");
      return;
    }

    setSelectedFile(file);
    setUploadError(null);

    // Créer une preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Pré-remplir le titre avec le nom du fichier
    if (!title) {
      const nameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
      setTitle(nameWithoutExt);
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const handleUpload = async () => {
    if (!selectedFile || !previewUrl) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      // Convertir le fichier en base64
      const base64Data = previewUrl;

      await uploadMutation.mutateAsync({
        imageData: base64Data,
        fileName: selectedFile.name,
        contentType: selectedFile.type,
        title: title || selectedFile.name,
        description: description || undefined,
        plantId,
        category: category as any,
        tags: tags.length > 0 ? tags : undefined,
        location: location || undefined,
        capturedAt: capturedAt || undefined,
      });
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const resetForm = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setTitle("");
    setDescription("");
    setCategory("echantillon");
    setLocation("");
    setCapturedAt("");
    setTags([]);
    setTagInput("");
    setUploadError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Upload className="h-4 w-4" />
          Ajouter une image
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Ajouter une image pour {plantName}
          </DialogTitle>
          <DialogDescription>
            Téléchargez une photo d'échantillon, de terrain ou d'analyse pour enrichir la fiche botanique.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Zone de sélection de fichier */}
          <div className="space-y-2">
            <Label>Image</Label>
            {!previewUrl ? (
              <div
                className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-sm text-muted-foreground mb-2">
                  Cliquez ou glissez-déposez une image
                </p>
                <p className="text-xs text-muted-foreground">
                  PNG, JPG, WEBP jusqu'à 10 Mo
                </p>
              </div>
            ) : (
              <div className="relative">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-64 object-contain rounded-lg border bg-muted"
                />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    resetForm();
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>

          {/* Métadonnées */}
          {selectedFile && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Titre</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Titre de l'image"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Catégorie</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {IMAGE_CATEGORIES.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
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
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Description détaillée de l'image..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location" className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Lieu de prise de vue
                  </Label>
                  <Input
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Ex: San Andrés, Colombie"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="capturedAt" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Date de prise de vue
                  </Label>
                  <Input
                    id="capturedAt"
                    type="date"
                    value={capturedAt}
                    onChange={(e) => setCapturedAt(e.target.value)}
                  />
                </div>
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  Tags
                </Label>
                <div className="flex gap-2">
                  <Input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="Ajouter un tag..."
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                  />
                  <Button type="button" variant="secondary" onClick={handleAddTag}>
                    Ajouter
                  </Button>
                </div>
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="gap-1">
                        {tag}
                        <X
                          className="h-3 w-3 cursor-pointer"
                          onClick={() => handleRemoveTag(tag)}
                        />
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Erreur */}
              {uploadError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{uploadError}</AlertDescription>
                </Alert>
              )}

              {/* Boutons d'action */}
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsOpen(false)}>
                  Annuler
                </Button>
                <Button onClick={handleUpload} disabled={isUploading}>
                  {isUploading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Téléchargement...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Télécharger
                    </>
                  )}
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Composant pour afficher la galerie d'images d'une plante
interface PlantImageGalleryProps {
  plantId: number;
}

export function PlantImageGallery({ plantId }: PlantImageGalleryProps) {
  const { data: images, isLoading } = trpc.gallery.list.useQuery({ plantId });
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const utils = trpc.useUtils();
  
  const deleteMutation = trpc.gallery.delete.useMutation({
    onSuccess: () => {
      toast.success("Image supprimée");
      utils.gallery.list.invalidate();
      setSelectedImage(null);
    },
    onError: () => {
      toast.error("Erreur lors de la suppression");
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!images || images.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <ImageIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>Aucune image pour cette plante</p>
        <p className="text-sm">Utilisez le bouton "Ajouter une image" pour enrichir la fiche.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image) => (
          <Card
            key={image.id}
            className="overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all"
            onClick={() => setSelectedImage(image)}
          >
            <div className="aspect-square relative">
              <img
                src={image.url}
                alt={image.title || "Image botanique"}
                className="w-full h-full object-cover"
              />
              <Badge
                variant="secondary"
                className="absolute bottom-2 left-2 text-xs"
              >
                {IMAGE_CATEGORIES.find(c => c.value === image.category)?.label || image.category}
              </Badge>
            </div>
            {image.title && (
              <CardContent className="p-2">
                <p className="text-sm font-medium truncate">{image.title}</p>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      {/* Modal de détail */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl">
          {selectedImage && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedImage.title || "Image botanique"}</DialogTitle>
                {selectedImage.description && (
                  <DialogDescription>{selectedImage.description}</DialogDescription>
                )}
              </DialogHeader>
              <div className="space-y-4">
                <img
                  src={selectedImage.url}
                  alt={selectedImage.title || "Image"}
                  className="w-full max-h-[60vh] object-contain rounded-lg"
                />
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  {selectedImage.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {selectedImage.location}
                    </span>
                  )}
                  {selectedImage.capturedAt && (
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(selectedImage.capturedAt).toLocaleDateString("fr-FR")}
                    </span>
                  )}
                </div>
                {selectedImage.tags && selectedImage.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {selectedImage.tags.map((tag: string) => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
                <div className="flex justify-end gap-2">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteMutation.mutate(selectedImage.id)}
                    disabled={deleteMutation.isPending}
                  >
                    {deleteMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Supprimer"
                    )}
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
