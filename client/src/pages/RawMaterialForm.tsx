// @ts-nocheck
import { useState } from "react";
import { Link, useLocation } from "wouter";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { 
  ArrowLeft, 
  Save, 
  Droplets,
  Flower2,
  TreeDeciduous,
  Leaf,
  Beaker,
  MapPin,
  FlaskConical,
  Sparkles,
  Wind,
  Sun,
  Thermometer,
  AlertCircle
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

// Category options
const categoryOptions = [
  { value: "huile_essentielle", label: "Huile essentielle", icon: <Droplets className="w-4 h-4" /> },
  { value: "absolue", label: "Absolue", icon: <Flower2 className="w-4 h-4" /> },
  { value: "concrete", label: "Concrète", icon: <Sparkles className="w-4 h-4" /> },
  { value: "resinoid", label: "Résinoïde", icon: <TreeDeciduous className="w-4 h-4" /> },
  { value: "teinture", label: "Teinture", icon: <FlaskConical className="w-4 h-4" /> },
  { value: "co2_extract", label: "Extrait CO₂", icon: <Wind className="w-4 h-4" /> },
  { value: "hydrolat", label: "Hydrolat", icon: <Droplets className="w-4 h-4" /> },
  { value: "beurre", label: "Beurre", icon: <Sun className="w-4 h-4" /> },
  { value: "cire", label: "Cire", icon: <Thermometer className="w-4 h-4" /> },
  { value: "oleoresine", label: "Oléorésine", icon: <Droplets className="w-4 h-4" /> },
  { value: "infusion", label: "Infusion", icon: <Leaf className="w-4 h-4" /> },
  { value: "maceration", label: "Macération", icon: <Beaker className="w-4 h-4" /> },
  { value: "distillat", label: "Distillat", icon: <FlaskConical className="w-4 h-4" /> },
  { value: "autre", label: "Autre", icon: <Beaker className="w-4 h-4" /> },
];

// Plant part options
const plantPartOptions = [
  { value: "fleur", label: "Fleur" },
  { value: "feuille", label: "Feuille" },
  { value: "tige", label: "Tige" },
  { value: "racine", label: "Racine" },
  { value: "ecorce", label: "Écorce" },
  { value: "bois", label: "Bois" },
  { value: "resine", label: "Résine" },
  { value: "graine", label: "Graine" },
  { value: "fruit", label: "Fruit" },
  { value: "zeste", label: "Zeste" },
  { value: "plante_entiere", label: "Plante entière" },
  { value: "bourgeon", label: "Bourgeon" },
  { value: "autre", label: "Autre" },
];

// Olfactive family options
const olfactiveFamilyOptions = [
  { value: "floral", label: "Floral" },
  { value: "boise", label: "Boisé" },
  { value: "agrume", label: "Agrume" },
  { value: "epice", label: "Épicé" },
  { value: "herbace", label: "Herbacé" },
  { value: "balsamique", label: "Balsamique" },
  { value: "musque", label: "Musqué" },
  { value: "animal", label: "Animal" },
  { value: "vert", label: "Vert" },
  { value: "fruité", label: "Fruité" },
  { value: "marin", label: "Marin" },
  { value: "terreux", label: "Terreux" },
  { value: "fumé", label: "Fumé" },
  { value: "gourmand", label: "Gourmand" },
  { value: "aromatique", label: "Aromatique" },
  { value: "autre", label: "Autre" },
];

// Quality options
const qualityOptions = [
  { value: "conventionnel", label: "Conventionnel" },
  { value: "bio", label: "Bio" },
  { value: "sauvage", label: "Sauvage" },
  { value: "biodynamique", label: "Biodynamique" },
  { value: "aop", label: "AOP" },
  { value: "igp", label: "IGP" },
  { value: "fair_trade", label: "Fair Trade" },
];

// Price range options
const priceRangeOptions = [
  { value: "economique", label: "Économique" },
  { value: "standard", label: "Standard" },
  { value: "premium", label: "Premium" },
  { value: "luxe", label: "Luxe" },
  { value: "rare", label: "Rare" },
];

// Availability options
const availabilityOptions = [
  { value: "disponible", label: "Disponible" },
  { value: "saisonnier", label: "Saisonnier" },
  { value: "rare", label: "Rare" },
  { value: "en_rupture", label: "En rupture" },
  { value: "discontinue", label: "Discontinué" },
];

export default function RawMaterialForm() {
  const [, navigate] = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    latinName: "",
    category: "" as string,
    plantPart: "" as string,
    originCountry: "",
    originRegion: "",
    olfactiveFamily: "" as string,
    olfactiveProfile: "",
    topNotes: "",
    heartNotes: "",
    baseNotes: "",
    intensity: 5,
    tenacity: 4,
    quality: "" as string,
    priceRange: "" as string,
    availability: "" as string,
    usageNotes: "",
    blendingTips: "",
    extractionNotes: "",
    restrictions: "",
  });

  // Queries for related data
  const { data: plants } = trpc.plants?.list.useQuery();
  // @ts-ignore - Ces procédures seront ajoutées ultérieurement
  const { data: terroirs } = trpc.terroirs?.getAll?.useQuery?.() || { data: [] };
  // @ts-ignore
  const { data: extractionMethods } = trpc.extractionMethods?.getAll?.useQuery?.() || { data: [] };

  // Create mutation
  const createMutation = trpc.rawMaterials.create.useMutation({
    onSuccess: (result) => {
      toast.success("Matière première créée", {
        description: `${formData.name} a été ajoutée avec succès.`
      });
      navigate(`/matieres-premieres/${result.id}`);
    },
    onError: (error) => {
      toast.error("Erreur lors de la création", {
        description: error.message
      });
      setIsSubmitting(false);
    }
  });

  // Generate material ID
  const generateMaterialId = () => {
    const prefix = "RM";
    const timestamp = Date.now().toString(36).toUpperCase();
    return `${prefix}-${timestamp}`;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.category) {
      toast.error("Champs requis manquants", {
        description: "Le nom et la catégorie sont obligatoires."
      });
      return;
    }

    setIsSubmitting(true);

    const materialId = generateMaterialId();
    
    createMutation.mutate({
      materialId,
      name: formData.name,
      latinName: formData.latinName || undefined,
      category: formData.category as any,
      plantPart: formData.plantPart as any || undefined,
      originCountry: formData.originCountry || undefined,
      originRegion: formData.originRegion || undefined,
      olfactiveFamily: formData.olfactiveFamily as any || undefined,
      olfactiveProfile: formData.olfactiveProfile || undefined,
      topNotes: formData.topNotes || undefined,
      heartNotes: formData.heartNotes || undefined,
      baseNotes: formData.baseNotes || undefined,
      intensity: formData.intensity,
      tenacity: formData.tenacity,
      quality: formData.quality as any || undefined,
      priceRange: formData.priceRange as any || undefined,
      availability: formData.availability as any || undefined,
      usageNotes: formData.usageNotes || undefined,
      blendingTips: formData.blendingTips || undefined,
      extractionNotes: formData.extractionNotes || undefined,
      notes: formData.restrictions || undefined,
    });
  };

  // Update form field
  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8">
        {/* Back Navigation */}
        <div className="mb-6">
          <Link href="/matieres-premieres">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Retour aux matières premières
            </Button>
          </Link>
        </div>

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Nouvelle Matière Première</h1>
          <p className="text-muted-foreground text-lg">
            Ajoutez une nouvelle matière première à votre base de données de recherche.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <Tabs defaultValue="general" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-flex">
              <TabsTrigger value="general">Général</TabsTrigger>
              <TabsTrigger value="olfactive">Profil Olfactif</TabsTrigger>
              <TabsTrigger value="origin">Origine</TabsTrigger>
              <TabsTrigger value="commercial">Commercial</TabsTrigger>
            </TabsList>

            {/* General Tab */}
            <TabsContent value="general">
              <Card>
                <CardHeader>
                  <CardTitle>Informations générales</CardTitle>
                  <CardDescription>
                    Identifiez la matière première et sa classification.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name */}
                    <div className="space-y-2">
                      <Label htmlFor="name">
                        Nom <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="name"
                        placeholder="Ex: Huile essentielle de lavande"
                        value={formData.name}
                        onChange={(e) => updateField("name", e.target.value)}
                        required
                      />
                    </div>

                    {/* Latin Name */}
                    <div className="space-y-2">
                      <Label htmlFor="latinName">Nom latin</Label>
                      <Input
                        id="latinName"
                        placeholder="Ex: Lavandula angustifolia"
                        value={formData.latinName}
                        onChange={(e) => updateField("latinName", e.target.value)}
                      />
                    </div>

                    {/* Category */}
                    <div className="space-y-2">
                      <Label htmlFor="category">
                        Catégorie <span className="text-destructive">*</span>
                      </Label>
                      <Select 
                        value={formData.category} 
                        onValueChange={(value) => updateField("category", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez une catégorie" />
                        </SelectTrigger>
                        <SelectContent>
                          {categoryOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              <span className="flex items-center gap-2">
                                {option.icon}
                                {option.label}
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Plant Part */}
                    <div className="space-y-2">
                      <Label htmlFor="plantPart">Partie de la plante</Label>
                      <Select 
                        value={formData.plantPart} 
                        onValueChange={(value) => updateField("plantPart", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez une partie" />
                        </SelectTrigger>
                        <SelectContent>
                          {plantPartOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Extraction Notes */}
                  <div className="space-y-2">
                    <Label htmlFor="extractionNotes">Notes d'extraction</Label>
                    <Textarea
                      id="extractionNotes"
                      placeholder="Décrivez le processus d'extraction, le rendement, les conditions..."
                      value={formData.extractionNotes}
                      onChange={(e) => updateField("extractionNotes", e.target.value)}
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Olfactive Tab */}
            <TabsContent value="olfactive">
              <Card>
                <CardHeader>
                  <CardTitle>Profil olfactif</CardTitle>
                  <CardDescription>
                    Décrivez les caractéristiques olfactives de cette matière première.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Olfactive Family */}
                    <div className="space-y-2">
                      <Label htmlFor="olfactiveFamily">Famille olfactive</Label>
                      <Select 
                        value={formData.olfactiveFamily} 
                        onValueChange={(value) => updateField("olfactiveFamily", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez une famille" />
                        </SelectTrigger>
                        <SelectContent>
                          {olfactiveFamilyOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Intensity */}
                    <div className="space-y-2">
                      <Label>Intensité: {formData.intensity}/10</Label>
                      <Slider
                        value={[formData.intensity]}
                        onValueChange={([value]) => updateField("intensity", value)}
                        max={10}
                        min={1}
                        step={1}
                        className="py-4"
                      />
                    </div>

                    {/* Tenacity */}
                    <div className="space-y-2">
                      <Label>Tenue: {formData.tenacity}h</Label>
                      <Slider
                        value={[formData.tenacity]}
                        onValueChange={([value]) => updateField("tenacity", value)}
                        max={24}
                        min={1}
                        step={1}
                        className="py-4"
                      />
                    </div>
                  </div>

                  {/* Olfactive Profile */}
                  <div className="space-y-2">
                    <Label htmlFor="olfactiveProfile">Description olfactive</Label>
                    <Textarea
                      id="olfactiveProfile"
                      placeholder="Décrivez l'odeur de cette matière première..."
                      value={formData.olfactiveProfile}
                      onChange={(e) => updateField("olfactiveProfile", e.target.value)}
                      rows={3}
                    />
                  </div>

                  {/* Notes */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="topNotes" className="text-sky-400">Notes de tête</Label>
                      <Textarea
                        id="topNotes"
                        placeholder="Premières impressions..."
                        value={formData.topNotes}
                        onChange={(e) => updateField("topNotes", e.target.value)}
                        rows={2}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="heartNotes" className="text-rose-400">Notes de cœur</Label>
                      <Textarea
                        id="heartNotes"
                        placeholder="Corps du parfum..."
                        value={formData.heartNotes}
                        onChange={(e) => updateField("heartNotes", e.target.value)}
                        rows={2}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="baseNotes" className="text-amber-400">Notes de fond</Label>
                      <Textarea
                        id="baseNotes"
                        placeholder="Sillage final..."
                        value={formData.baseNotes}
                        onChange={(e) => updateField("baseNotes", e.target.value)}
                        rows={2}
                      />
                    </div>
                  </div>

                  {/* Usage & Blending */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="usageNotes">Notes d'utilisation</Label>
                      <Textarea
                        id="usageNotes"
                        placeholder="Conseils d'utilisation en parfumerie..."
                        value={formData.usageNotes}
                        onChange={(e) => updateField("usageNotes", e.target.value)}
                        rows={3}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="blendingTips">Conseils d'assemblage</Label>
                      <Textarea
                        id="blendingTips"
                        placeholder="Matières qui se marient bien..."
                        value={formData.blendingTips}
                        onChange={(e) => updateField("blendingTips", e.target.value)}
                        rows={3}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Origin Tab */}
            <TabsContent value="origin">
              <Card>
                <CardHeader>
                  <CardTitle>Origine géographique</CardTitle>
                  <CardDescription>
                    Précisez l'origine de cette matière première.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Country */}
                    <div className="space-y-2">
                      <Label htmlFor="originCountry">Pays d'origine</Label>
                      <Input
                        id="originCountry"
                        placeholder="Ex: France"
                        value={formData.originCountry}
                        onChange={(e) => updateField("originCountry", e.target.value)}
                      />
                    </div>

                    {/* Region */}
                    <div className="space-y-2">
                      <Label htmlFor="originRegion">Région</Label>
                      <Input
                        id="originRegion"
                        placeholder="Ex: Provence"
                        value={formData.originRegion}
                        onChange={(e) => updateField("originRegion", e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Map placeholder */}
                  <div className="border rounded-lg p-8 text-center text-muted-foreground bg-muted/30">
                    <MapPin className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>La carte interactive sera disponible dans une prochaine version.</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Commercial Tab */}
            <TabsContent value="commercial">
              <Card>
                <CardHeader>
                  <CardTitle>Informations commerciales</CardTitle>
                  <CardDescription>
                    Qualité, prix et disponibilité de la matière première.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Quality */}
                    <div className="space-y-2">
                      <Label htmlFor="quality">Qualité</Label>
                      <Select 
                        value={formData.quality} 
                        onValueChange={(value) => updateField("quality", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez" />
                        </SelectTrigger>
                        <SelectContent>
                          {qualityOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Price Range */}
                    <div className="space-y-2">
                      <Label htmlFor="priceRange">Gamme de prix</Label>
                      <Select 
                        value={formData.priceRange} 
                        onValueChange={(value) => updateField("priceRange", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez" />
                        </SelectTrigger>
                        <SelectContent>
                          {priceRangeOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Availability */}
                    <div className="space-y-2">
                      <Label htmlFor="availability">Disponibilité</Label>
                      <Select 
                        value={formData.availability} 
                        onValueChange={(value) => updateField("availability", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez" />
                        </SelectTrigger>
                        <SelectContent>
                          {availabilityOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Restrictions */}
                  <div className="space-y-2">
                    <Label htmlFor="restrictions" className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-500" />
                      Restrictions réglementaires
                    </Label>
                    <Textarea
                      id="restrictions"
                      placeholder="Restrictions IFRA, allergènes déclarés, limitations d'usage..."
                      value={formData.restrictions}
                      onChange={(e) => updateField("restrictions", e.target.value)}
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Submit Button */}
          <div className="flex justify-end gap-4 mt-8">
            <Link href="/matieres-premieres">
              <Button variant="outline" type="button">
                Annuler
              </Button>
            </Link>
            <Button type="submit" disabled={isSubmitting} className="gap-2">
              <Save className="w-4 h-4" />
              {isSubmitting ? "Création en cours..." : "Créer la matière première"}
            </Button>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
}
