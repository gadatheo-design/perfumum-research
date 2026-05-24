// @ts-nocheck
import { useState, useEffect } from "react";
import { useLocation, useParams } from "wouter";
import { trpc } from "@/lib/trpc";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Leaf, Save, ArrowLeft, Loader2, Beaker, MapPin, 
  TreeDeciduous, Sparkles, Wind, Info
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const CATEGORIES = [
  { value: "aromatique", label: "Aromatique" },
  { value: "tabac", label: "Tabac" },
  { value: "cannabis", label: "Cannabis" },
  { value: "resine", label: "Résine" },
  { value: "fleur", label: "Fleur" },
  { value: "bois", label: "Bois" },
  { value: "agrume", label: "Agrume" },
  { value: "epice", label: "Épice" },
  { value: "autre", label: "Autre" },
];

const CLIMATIC_AXES = [
  { value: "vent", label: "Vent", description: "Fraîcheur, mouvement, volatilité" },
  { value: "bois", label: "Bois", description: "Structure, profondeur, tenue" },
  { value: "disparition", label: "Disparition", description: "Évanescence, subtilité, mémoire" },
  { value: "vent_bois", label: "Vent + Bois", description: "Fraîcheur structurée" },
  { value: "bois_disparition", label: "Bois + Disparition", description: "Structure évanescente" },
  { value: "vent_disparition", label: "Vent + Disparition", description: "Fraîcheur évanescente" },
  { value: "vent_bois_disparition", label: "Équilibre complet", description: "Les trois axes" },
];

const LIFE_CYCLES = [
  { value: "annual", label: "Annuelle" },
  { value: "biennial", label: "Bisannuelle" },
  { value: "perennial", label: "Vivace" },
  { value: "variable", label: "Variable" },
];

export default function PlantForm() {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const params = useParams<{ id?: string }>();
  const isEdit = !!params.id;

  // État du formulaire
  const [formData, setFormData] = useState({
    name: "",
    latinName: "",
    family: "",
    category: "aromatique",
    plantPart: "",
    origin: "",
    habitat: "",
    olfactiveSignature: "",
    dominantMolecules: "",
    climaticAxis: "",
    traditionalUse: "",
    absorbeUse: "",
    notes: "",
    // Taxonomie
    kingdom: "Plantae",
    division: "",
    className: "",
    orderName: "",
    genus: "",
    species: "",
    subspecies: "",
    // Culture
    lifeCycle: "perennial",
    harvestPeriod: "",
    optimalHarvestStage: "",
    yieldPerHectare: "",
    essentialOilYield: "",
    storageDuration: "",
    storageConditions: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Charger les données existantes si édition
  const { data: existingPlant, isLoading } = trpc.plants.getById.useQuery(
    parseInt(params.id || "0"),
    { enabled: isEdit }
  );

  // Mutation pour créer/modifier
  const createMutation = trpc.plants.create.useMutation({
    onSuccess: (data) => {
      toast({
        title: "Plante créée",
        description: `${formData.name} a été ajoutée avec succès.`,
      });
      navigate(`/plants/${data.id}`);
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateMutation = trpc.plants.update.useMutation({
    onSuccess: () => {
      toast({
        title: "Plante mise à jour",
        description: `${formData.name} a été modifiée avec succès.`,
      });
      navigate(`/plants/${params.id}`);
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Remplir le formulaire avec les données existantes
  useEffect(() => {
    if (existingPlant) {
      setFormData({
        name: existingPlant?.name || "",
        latinName: existingPlant?.latinName || "",
        family: existingPlant?.family || "",
        category: existingPlant?.category || "aromatique",
        plantPart: existingPlant?.plantPart || "",
        origin: existingPlant?.origin || "",
        habitat: existingPlant?.habitat || "",
        olfactiveSignature: existingPlant?.olfactiveSignature || "",
        dominantMolecules: existingPlant?.dominantMolecules || "",
        climaticAxis: existingPlant?.climaticAxis || "",
        traditionalUse: existingPlant?.traditionalUse || "",
        absorbeUse: existingPlant?.absorbeUse || "",
        notes: existingPlant?.notes || "",
        kingdom: "Plantae",
        division: "",
        className: "",
        orderName: "",
        genus: "",
        species: "",
        subspecies: "",
        lifeCycle: "perennial",
        harvestPeriod: "",
        optimalHarvestStage: "",
        yieldPerHectare: "",
        essentialOilYield: "",
        storageDuration: "",
        storageConditions: "",
      });
    }
  }, [existingPlant]);

  // Gérer les changements de champs
  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Soumettre le formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast({
        title: "Champ requis",
        description: "Le nom de la plante est obligatoire.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      if (isEdit) {
        await updateMutation.mutateAsync({
          id: parseInt(params.id!),
          data: formData as any,
        });
      } else {
        await createMutation.mutateAsync(formData as any);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isEdit && isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="container max-w-4xl">
        <Breadcrumbs customItems={[
          { label: "Plantes", path: "/plants" },
          { label: isEdit ? "Modifier" : "Nouvelle plante" }
        ]} />

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Leaf className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">
              {isEdit ? "Modifier la plante" : "Nouvelle plante"}
            </h1>
          </div>
          <Button variant="outline" onClick={() => navigate("/plants")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
        </div>

        <form onSubmit={handleSubmit}>
          <Tabs defaultValue="general" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="general">Général</TabsTrigger>
              <TabsTrigger value="taxonomy">Taxonomie</TabsTrigger>
              <TabsTrigger value="olfactive">Olfactif</TabsTrigger>
              <TabsTrigger value="culture">Culture</TabsTrigger>
            </TabsList>

            {/* Onglet Général */}
            <TabsContent value="general" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Info className="h-5 w-5" />
                    Informations générales
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nom commun *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                        placeholder="Ex: Lavande fine"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="latinName">Nom latin</Label>
                      <Input
                        id="latinName"
                        value={formData.latinName}
                        onChange={(e) => handleChange("latinName", e.target.value)}
                        placeholder="Ex: Lavandula angustifolia"
                        className="italic"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="family">Famille botanique</Label>
                      <Input
                        id="family"
                        value={formData.family}
                        onChange={(e) => handleChange("family", e.target.value)}
                        placeholder="Ex: Lamiaceae"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">Catégorie ABSORBE</Label>
                      <Select 
                        value={formData.category} 
                        onValueChange={(v) => handleChange("category", v)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {CATEGORIES.map((cat) => (
                            <SelectItem key={cat.value} value={cat.value}>
                              {cat.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="plantPart">Organe végétal</Label>
                      <Select 
                        value={formData.plantPart || ""} 
                        onValueChange={(v) => handleChange("plantPart", v)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Organe source..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="fleur">🌸 Fleur</SelectItem>
                          <SelectItem value="feuille">🌿 Feuille</SelectItem>
                          <SelectItem value="fruit">🍊 Fruit</SelectItem>
                          <SelectItem value="zeste">🍋 Zeste / Écorce de fruit</SelectItem>
                          <SelectItem value="graine">🌰 Graine</SelectItem>
                          <SelectItem value="arille">🌱 Arille (ex: Macis)</SelectItem>
                          <SelectItem value="ecorce">🌳 Écorce de tige</SelectItem>
                          <SelectItem value="bois">🪵 Bois / Copeaux</SelectItem>
                          <SelectItem value="racine">🪴 Racine</SelectItem>
                          <SelectItem value="rhizome">🪴 Rhizome</SelectItem>
                          <SelectItem value="bulbe">🪴 Bulbe</SelectItem>
                          <SelectItem value="resine">🪵 Résine / Exsudat</SelectItem>
                          <SelectItem value="feuille_tige">🌿 Feuille + Tige</SelectItem>
                          <SelectItem value="plante_entiere">🌾 Plante entière</SelectItem>
                          <SelectItem value="thalle">🪴 Thalle (lichen/algue)</SelectItem>
                          <SelectItem value="champignon">🍄 Corps fructifère</SelectItem>
                          <SelectItem value="autre">• Autre</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="origin">Origine géographique</Label>
                      <Input
                        id="origin"
                        value={formData.origin}
                        onChange={(e) => handleChange("origin", e.target.value)}
                        placeholder="Ex: Provence, France"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="habitat">Habitat naturel</Label>
                      <Input
                        id="habitat"
                        value={formData.habitat}
                        onChange={(e) => handleChange("habitat", e.target.value)}
                        placeholder="Ex: Zones méditerranéennes, sols calcaires"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => handleChange("notes", e.target.value)}
                      placeholder="Notes et observations..."
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Onglet Taxonomie */}
            <TabsContent value="taxonomy" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TreeDeciduous className="h-5 w-5" />
                    Classification taxonomique
                  </CardTitle>
                  <CardDescription>
                    Hiérarchie botanique complète de la plante
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="kingdom">Règne (Kingdom)</Label>
                      <Input
                        id="kingdom"
                        value={formData.kingdom}
                        onChange={(e) => handleChange("kingdom", e.target.value)}
                        placeholder="Plantae"
                        disabled
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="division">Division (Phylum)</Label>
                      <Input
                        id="division"
                        value={formData.division}
                        onChange={(e) => handleChange("division", e.target.value)}
                        placeholder="Ex: Magnoliophyta"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="className">Classe (Class)</Label>
                      <Input
                        id="className"
                        value={formData.className}
                        onChange={(e) => handleChange("className", e.target.value)}
                        placeholder="Ex: Magnoliopsida"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="orderName">Ordre (Order)</Label>
                      <Input
                        id="orderName"
                        value={formData.orderName}
                        onChange={(e) => handleChange("orderName", e.target.value)}
                        placeholder="Ex: Lamiales"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="genus">Genre (Genus)</Label>
                      <Input
                        id="genus"
                        value={formData.genus}
                        onChange={(e) => handleChange("genus", e.target.value)}
                        placeholder="Ex: Lavandula"
                        className="italic"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="species">Espèce (Species)</Label>
                      <Input
                        id="species"
                        value={formData.species}
                        onChange={(e) => handleChange("species", e.target.value)}
                        placeholder="Ex: angustifolia"
                        className="italic"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subspecies">Sous-espèce</Label>
                      <Input
                        id="subspecies"
                        value={formData.subspecies}
                        onChange={(e) => handleChange("subspecies", e.target.value)}
                        placeholder="Ex: var. delphinensis"
                        className="italic"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Onglet Olfactif */}
            <TabsContent value="olfactive" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Beaker className="h-5 w-5" />
                    Profil olfactif et moléculaire
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="olfactiveSignature">Signature olfactive</Label>
                    <Textarea
                      id="olfactiveSignature"
                      value={formData.olfactiveSignature}
                      onChange={(e) => handleChange("olfactiveSignature", e.target.value)}
                      placeholder="Décrivez les notes de tête, cœur et fond..."
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dominantMolecules">Molécules dominantes</Label>
                    <Textarea
                      id="dominantMolecules"
                      value={formData.dominantMolecules}
                      onChange={(e) => handleChange("dominantMolecules", e.target.value)}
                      placeholder="Ex: Linalol (25-38%), Acétate de linalyle (25-45%)..."
                      rows={2}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="climaticAxis">Axe climatique ABSORBE</Label>
                    <Select 
                      value={formData.climaticAxis} 
                      onValueChange={(v) => handleChange("climaticAxis", v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un axe..." />
                      </SelectTrigger>
                      <SelectContent>
                        {CLIMATIC_AXES.map((axis) => (
                          <SelectItem key={axis.value} value={axis.value}>
                            <div>
                              <span className="font-medium">{axis.label}</span>
                              <span className="text-muted-foreground ml-2 text-sm">
                                — {axis.description}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="traditionalUse">Usage traditionnel</Label>
                    <Textarea
                      id="traditionalUse"
                      value={formData.traditionalUse}
                      onChange={(e) => handleChange("traditionalUse", e.target.value)}
                      placeholder="Aromathérapie, parfumerie, médecine traditionnelle..."
                      rows={2}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="absorbeUse">Usage ABSORBE</Label>
                    <Textarea
                      id="absorbeUse"
                      value={formData.absorbeUse}
                      onChange={(e) => handleChange("absorbeUse", e.target.value)}
                      placeholder="Application dans le système ABSORBE..."
                      rows={2}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Onglet Culture */}
            <TabsContent value="culture" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Culture et récolte
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="lifeCycle">Cycle de vie</Label>
                      <Select 
                        value={formData.lifeCycle} 
                        onValueChange={(v) => handleChange("lifeCycle", v)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {LIFE_CYCLES.map((cycle) => (
                            <SelectItem key={cycle.value} value={cycle.value}>
                              {cycle.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="harvestPeriod">Période de récolte</Label>
                      <Input
                        id="harvestPeriod"
                        value={formData.harvestPeriod}
                        onChange={(e) => handleChange("harvestPeriod", e.target.value)}
                        placeholder="Ex: Juin-Août"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="optimalHarvestStage">Stade optimal de récolte</Label>
                      <Input
                        id="optimalHarvestStage"
                        value={formData.optimalHarvestStage}
                        onChange={(e) => handleChange("optimalHarvestStage", e.target.value)}
                        placeholder="Ex: Début floraison"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="yieldPerHectare">Rendement (kg/ha)</Label>
                      <Input
                        id="yieldPerHectare"
                        value={formData.yieldPerHectare}
                        onChange={(e) => handleChange("yieldPerHectare", e.target.value)}
                        placeholder="Ex: 2000-3000"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="essentialOilYield">Rendement HE (%)</Label>
                      <Input
                        id="essentialOilYield"
                        value={formData.essentialOilYield}
                        onChange={(e) => handleChange("essentialOilYield", e.target.value)}
                        placeholder="Ex: 1.5-3%"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="storageDuration">Durée de conservation</Label>
                      <Input
                        id="storageDuration"
                        value={formData.storageDuration}
                        onChange={(e) => handleChange("storageDuration", e.target.value)}
                        placeholder="Ex: 2-3 ans"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="storageConditions">Conditions de stockage</Label>
                    <Textarea
                      id="storageConditions"
                      value={formData.storageConditions}
                      onChange={(e) => handleChange("storageConditions", e.target.value)}
                      placeholder="Température, humidité, lumière..."
                      rows={2}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Boutons d'action */}
          <div className="flex justify-end gap-4 mt-8">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate("/plants")}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Enregistrement...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {isEdit ? "Mettre à jour" : "Créer la plante"}
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
