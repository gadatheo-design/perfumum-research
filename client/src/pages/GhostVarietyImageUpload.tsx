import { useState, useCallback, useRef } from "react";
import { Link, useParams, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import {
  ChevronRight,
  Ghost,
  Image as ImageIcon,
  Upload,
  X,
  ChevronLeft,
  Loader2,
  Check,
  AlertCircle,
} from "lucide-react";

const IMAGE_TYPE_LABELS: Record<string, string> = {
  botanical_illustration: "Illustration botanique",
  photograph: "Photographie",
  herbarium: "Spécimen d'herbier",
  reconstruction: "Image de reconstruction",
  artistic: "Représentation artistique",
  microscopy: "Image microscopique",
  other: "Autre",
};

const LICENSE_OPTIONS = [
  { value: "public_domain", label: "Domaine public" },
  { value: "cc0", label: "CC0 (Aucun droit réservé)" },
  { value: "cc_by", label: "CC BY (Attribution)" },
  { value: "cc_by_sa", label: "CC BY-SA (Attribution - Partage)" },
  { value: "cc_by_nc", label: "CC BY-NC (Non commercial)" },
  { value: "fair_use", label: "Usage équitable (Fair Use)" },
  { value: "permission", label: "Avec permission" },
  { value: "unknown", label: "Inconnue" },
];

export default function GhostVarietyImageUpload() {
  const params = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const varietyId = parseInt(params.id || "0");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageType: "botanical_illustration",
    source: "",
    attribution: "",
    year: "",
    license: "unknown",
    isPrimary: false,
  });

  // Fetch variety data
  const { data: variety, isLoading } = trpc.ghostVarieties.getById.useQuery(varietyId, {
    enabled: varietyId > 0,
  });

  // Upload mutation
  const uploadImage = trpc.ghostVarietyLinks.images.upload.useMutation({
    onSuccess: () => {
      toast({ title: "Image ajoutée", description: "L'image a été téléchargée avec succès." });
      navigate(`/ghost-variety/${varietyId}`);
    },
    onError: (error) => {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
      setIsUploading(false);
    },
  });

  // Handle file selection
  const handleFileSelect = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) {
      toast({ title: "Erreur", description: "Veuillez sélectionner un fichier image.", variant: "destructive" });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast({ title: "Erreur", description: "L'image ne doit pas dépasser 10 Mo.", variant: "destructive" });
      return;
    }

    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    // Auto-fill title from filename
    if (!formData.title) {
      const nameWithoutExt = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
      setFormData(prev => ({ ...prev, title: nameWithoutExt }));
    }
  }, [formData.title, toast]);

  // Handle drag and drop
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  }, [handleFileSelect]);

  // Handle file input change
  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  }, [handleFileSelect]);

  // Clear selected file
  const clearFile = useCallback(() => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [previewUrl]);

  // Handle upload
  const handleUpload = async () => {
    if (!selectedFile || !user) return;

    setIsUploading(true);

    try {
      // Convert file to base64
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = reader.result as string;
        
        // Upload via tRPC
        uploadImage.mutate({
          ghostVarietyId: varietyId,
          imageData: base64,
          contentType: selectedFile.type,
          filename: selectedFile.name,
          title: formData.title || undefined,
          description: formData.description || undefined,
          imageType: formData.imageType as any,
          source: formData.source || undefined,
          attribution: formData.attribution || undefined,
          year: formData.year ? parseInt(formData.year) : undefined,
          license: formData.license || undefined,
          isPrimary: formData.isPrimary,
        });
      };

      reader.onerror = () => {
        toast({ title: "Erreur", description: "Impossible de lire le fichier.", variant: "destructive" });
        setIsUploading(false);
      };

      reader.readAsDataURL(selectedFile);
    } catch (error) {
      console.error("Error:", error);
      toast({ title: "Erreur", description: "Une erreur est survenue.", variant: "destructive" });
      setIsUploading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-gray-900 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-16 w-16 mx-auto mb-4 text-orange-500" />
            <h2 className="text-xl font-semibold mb-2">Connexion requise</h2>
            <p className="text-muted-foreground mb-4">Vous devez être connecté pour ajouter des images.</p>
            <Button asChild>
              <Link href="/ghost-varieties-explorer">Retour à l'explorateur</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-gray-900 p-8">
        <div className="container max-w-2xl">
          <Skeleton className="h-12 w-64 mb-4" />
          <Skeleton className="h-6 w-96 mb-8" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (!variety) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-gray-900 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <Ghost className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-semibold mb-2">Variété non trouvée</h2>
            <p className="text-muted-foreground mb-4">Cette variété fantôme n'existe pas.</p>
            <Button asChild>
              <Link href="/ghost-varieties-explorer">Retour à l'explorateur</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 text-white py-8 px-4">
        <div className="container max-w-2xl">
          <div className="flex items-center gap-2 text-slate-400 text-sm mb-4">
            <Link href="/" className="hover:text-white transition-colors">Accueil</Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/ghost-varieties-explorer" className="hover:text-white transition-colors">Variétés fantômes</Link>
            <ChevronRight className="h-4 w-4" />
            <Link href={`/ghost-variety/${varietyId}`} className="hover:text-white transition-colors">{variety.name}</Link>
            <ChevronRight className="h-4 w-4" />
            <span>Ajouter une image</span>
          </div>

          <h1 className="text-3xl font-bold flex items-center gap-3">
            <ImageIcon className="h-8 w-8" />
            Ajouter une image
          </h1>
          <p className="text-slate-300 mt-2">
            Téléchargez une illustration pour <span className="font-semibold">{variety.name}</span>
          </p>
        </div>
      </div>

      {/* Main content */}
      <div className="container max-w-2xl py-8 px-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Télécharger une image
            </CardTitle>
            <CardDescription>
              Formats acceptés: JPG, PNG, GIF, WebP. Taille maximale: 10 Mo.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Drop zone */}
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                isDragging
                  ? "border-primary bg-primary/5"
                  : selectedFile
                  ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                  : "border-muted-foreground/25 hover:border-muted-foreground/50"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {selectedFile ? (
                <div className="space-y-4">
                  {previewUrl && (
                    <div className="relative inline-block">
                      <img
                        src={previewUrl}
                        alt="Aperçu"
                        className="max-h-48 max-w-full rounded-lg mx-auto"
                      />
                      <Button
                        variant="destructive"
                        size="sm"
                        className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full"
                        onClick={clearFile}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                  <div className="flex items-center justify-center gap-2 text-green-600">
                    <Check className="h-5 w-5" />
                    <span className="font-medium">{selectedFile.name}</span>
                    <Badge variant="secondary">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} Mo
                    </Badge>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground" />
                  <div>
                    <p className="text-lg font-medium">
                      Glissez-déposez une image ici
                    </p>
                    <p className="text-sm text-muted-foreground">
                      ou cliquez pour sélectionner un fichier
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Parcourir
                  </Button>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileInputChange}
              />
            </div>

            {/* Metadata form */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Titre</Label>
                  <Input
                    id="title"
                    placeholder="ex: Illustration de 1892"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="imageType">Type d'image</Label>
                  <Select
                    value={formData.imageType}
                    onValueChange={(v) => setFormData({ ...formData, imageType: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(IMAGE_TYPE_LABELS).map(([key, label]) => (
                        <SelectItem key={key} value={key}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Description de l'image..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="source">Source</Label>
                  <Input
                    id="source"
                    placeholder="ex: Bibliothèque nationale"
                    value={formData.source}
                    onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="year">Année</Label>
                  <Input
                    id="year"
                    type="number"
                    placeholder="ex: 1892"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="attribution">Attribution / Crédit</Label>
                <Input
                  id="attribution"
                  placeholder="ex: Pierre-Joseph Redouté"
                  value={formData.attribution}
                  onChange={(e) => setFormData({ ...formData, attribution: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="license">Licence</Label>
                <Select
                  value={formData.license}
                  onValueChange={(v) => setFormData({ ...formData, license: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LICENSE_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isPrimary"
                  checked={formData.isPrimary}
                  onCheckedChange={(checked) => setFormData({ ...formData, isPrimary: checked as boolean })}
                />
                <Label htmlFor="isPrimary" className="text-sm font-normal">
                  Définir comme image principale de la variété
                </Label>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                asChild
                className="flex-1"
              >
                <Link href={`/ghost-variety/${varietyId}`}>
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Annuler
                </Link>
              </Button>
              <Button
                className="flex-1"
                onClick={handleUpload}
                disabled={!selectedFile || isUploading}
              >
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
