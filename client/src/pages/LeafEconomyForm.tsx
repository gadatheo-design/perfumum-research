// @ts-nocheck
import { useState, useEffect, useCallback } from "react";
import { useRoute, useLocation, Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { LeafEconomyImageUpload } from "@/components/LeafEconomyImageUpload";
import { 
  Leaf, 
  ChevronRight,
  ChevronLeft,
  Save,
  AlertCircle,
  Plus,
  Image as ImageIcon
} from "lucide-react";

const climaticAxes = [
  { value: "vent", label: "Vent" },
  { value: "bois", label: "Bois" },
  { value: "disparition", label: "Disparition" },
  { value: "sel", label: "Sel" },
];

const usageOptions = [
  { value: "parfum", label: "Parfum" },
  { value: "encens", label: "Encens" },
  { value: "espace", label: "Espace" },
];

interface FormData {
  sampleId: string;
  date: string;
  island: string;
  preciseLocation: string;
  sourceContact: string;
  category: string;
  species: string;
  claimedVariety: string;
  usedPart: string;
  state: string;
  curingTreatment: string;
  extraction: string;
  ratioParameters: string;
  duration: string;
  odorNotes: string;
  climaticAxis: string[];
  usage: string[];
  analysisAvailable: boolean;
  analysisMethod: string;
  topMoleculesList: string;
  topMolecule1: string;
  topMolecule2: string;
  topMolecule3: string;
  relativePercentages: string;
  absorbeInterpretation: string;
  status: string;
  mediaLinks: string;
  imageUrl: string;
  ethicalNotes: string;
}

const defaultFormData: FormData = {
  sampleId: "",
  date: "",
  island: "san_andres",
  preciseLocation: "",
  sourceContact: "",
  category: "aromatique",
  species: "",
  claimedVariety: "",
  usedPart: "feuille",
  state: "frais",
  curingTreatment: "aucun",
  extraction: "aucune",
  ratioParameters: "",
  duration: "",
  odorNotes: "",
  climaticAxis: [],
  usage: [],
  analysisAvailable: false,
  analysisMethod: "",
  topMoleculesList: "",
  topMolecule1: "",
  topMolecule2: "",
  topMolecule3: "",
  relativePercentages: "",
  absorbeInterpretation: "",
  status: "brut",
  mediaLinks: "",
  imageUrl: "",
  ethicalNotes: "",
};

export default function LeafEconomyForm() {
  const [, params] = useRoute("/san-andres/echantillon/:id/edit");
  const [, newParams] = useRoute("/san-andres/echantillon/new");
  const isNew = newParams !== null;
  const id = params?.id ? parseInt(params.id, 10) : null;
  const [, navigate] = useLocation();
  const { toast } = useToast();

  const [formData, setFormData] = useState<FormData>(defaultFormData);
  const [isSaving, setIsSaving] = useState(false);

  const { data: existingSample, isLoading } = trpc.leafEconomies.getById.useQuery(
    id!,
    { enabled: id !== null && !isNew }
  );

  const createMutation = trpc.leafEconomies.create.useMutation({
    onSuccess: (data) => {
      toast({
        title: "Échantillon créé",
        description: `L'échantillon ${formData.sampleId} a été créé avec succès.`,
      });
      navigate(`/san-andres/echantillon/${data.id}`);
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
      setIsSaving(false);
    },
  });

  const updateMutation = trpc.leafEconomies.update.useMutation({
    onSuccess: () => {
      toast({
        title: "Échantillon mis à jour",
        description: `L'échantillon ${formData.sampleId} a été mis à jour avec succès.`,
      });
      navigate(`/san-andres/echantillon/${id}`);
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
      setIsSaving(false);
    },
  });

  useEffect(() => {
    if (existingSample && !isNew) {
      const axes = existingSample.climaticAxis 
        ? (typeof existingSample.climaticAxis === 'string' 
            ? JSON.parse(existingSample.climaticAxis) 
            : existingSample.climaticAxis)
        : [];
      const usages = existingSample.usage 
        ? (typeof existingSample.usage === 'string' 
            ? JSON.parse(existingSample.usage) 
            : existingSample.usage)
        : [];

      setFormData({
        sampleId: existingSample.sampleId || "",
        date: existingSample.date ? new Date(existingSample.date).toISOString().split('T')[0] : "",
        island: existingSample.island || "san_andres",
        preciseLocation: existingSample.preciseLocation || "",
        sourceContact: existingSample.sourceContact || "",
        category: existingSample.category || "aromatique",
        species: existingSample.species || "",
        claimedVariety: existingSample.claimedVariety || "",
        usedPart: existingSample.usedPart || "feuille",
        state: existingSample.state || "frais",
        curingTreatment: existingSample.curingTreatment || "aucun",
        extraction: existingSample.extraction || "aucune",
        ratioParameters: existingSample.ratioParameters || "",
        duration: existingSample.duration || "",
        odorNotes: existingSample.odorNotes || "",
        climaticAxis: axes,
        usage: usages,
        analysisAvailable: existingSample.analysisAvailable === 1,
        analysisMethod: existingSample.analysisMethod || "",
        topMoleculesList: existingSample.topMoleculesList || "",
        topMolecule1: existingSample.topMolecule1 || "",
        topMolecule2: existingSample.topMolecule2 || "",
        topMolecule3: existingSample.topMolecule3 || "",
        relativePercentages: existingSample.relativePercentages || "",
        absorbeInterpretation: existingSample.absorbeInterpretation || "",
        status: existingSample.status || "brut",
        mediaLinks: existingSample.mediaLinks || "",
        imageUrl: existingSample.imageUrl || "",
        ethicalNotes: existingSample.ethicalNotes || "",
      });
    }
  }, [existingSample, isNew]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const payload = {
      sampleId: formData.sampleId,
      date: formData.date ? new Date(formData.date) : null,
      island: formData.island as "san_andres" | "providencia" | "autre",
      preciseLocation: formData.preciseLocation || null,
      sourceContact: formData.sourceContact || null,
      category: formData.category as "aromatique" | "tabac" | "cannabis",
      species: formData.species || null,
      claimedVariety: formData.claimedVariety || null,
      usedPart: formData.usedPart as "feuille" | "fleur" | "resine" | "tige" | "autre" | null,
      state: formData.state as "frais" | "sec" | "rehydrate" | null,
      curingTreatment: formData.curingTreatment as "aucun" | "air_cured" | "flue_cured" | "sun_cured" | "autre" | null,
      extraction: formData.extraction as "aucune" | "maceration_alcool" | "maceration_mct" | "distillation" | "headspace" | null,
      ratioParameters: formData.ratioParameters || null,
      duration: formData.duration || null,
      odorNotes: formData.odorNotes || null,
      climaticAxis: JSON.stringify(formData.climaticAxis),
      usage: JSON.stringify(formData.usage),
      analysisAvailable: formData.analysisAvailable ? 1 : 0,
      analysisMethod: formData.analysisMethod as "gc_ms" | "hplc" | "autre" | null,
      topMoleculesList: formData.topMoleculesList || null,
      topMolecule1: formData.topMolecule1 || null,
      topMolecule2: formData.topMolecule2 || null,
      topMolecule3: formData.topMolecule3 || null,
      relativePercentages: formData.relativePercentages || null,
      absorbeInterpretation: formData.absorbeInterpretation || null,
      status: formData.status as "brut" | "a_analyser" | "analyse" | "traduction" | "archive",
      mediaLinks: formData.mediaLinks || null,
      imageUrl: formData.imageUrl || null,
      ethicalNotes: formData.ethicalNotes || null,
    };

    if (isNew) {
      createMutation.mutate(payload as any);
    } else if (id) {
      updateMutation.mutate({ id, data: payload as any });
    }
  };

  const handleAxisToggle = (axis: string) => {
    setFormData(prev => ({
      ...prev,
      climaticAxis: prev.climaticAxis.includes(axis)
        ? prev.climaticAxis.filter(a => a !== axis)
        : [...prev.climaticAxis, axis]
    }));
  };

  const handleUsageToggle = (usage: string) => {
    setFormData(prev => ({
      ...prev,
      usage: prev.usage.includes(usage)
        ? prev.usage.filter(u => u !== usage)
        : [...prev.usage, usage]
    }));
  };

  if (isLoading && !isNew) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white dark:from-emerald-950 dark:to-gray-900">
        <div className="bg-emerald-900 text-white py-12 px-4">
          <div className="container max-w-4xl">
            <Skeleton className="h-6 w-48 mb-4 bg-emerald-800" />
            <Skeleton className="h-10 w-64 bg-emerald-800" />
          </div>
        </div>
        <div className="container max-w-4xl py-8 px-4">
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white dark:from-emerald-950 dark:to-gray-900">
      {/* Header */}
      <div className="bg-emerald-900 text-white py-12 px-4">
        <div className="container max-w-4xl">
          <div className="flex items-center gap-2 text-emerald-300 text-sm mb-4">
            <Link href="/" className="hover:text-white transition-colors">Accueil</Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/san-andres/leaf-economies" className="hover:text-white transition-colors">Leaf Economies</Link>
            <ChevronRight className="h-4 w-4" />
            <span>{isNew ? "Nouvel échantillon" : "Modifier"}</span>
          </div>
          
          <div className="flex items-center gap-3">
            {isNew ? (
              <Plus className="h-8 w-8" />
            ) : (
              <Leaf className="h-8 w-8" />
            )}
            <h1 className="text-3xl font-bold">
              {isNew ? "Nouvel échantillon" : `Modifier ${formData.sampleId}`}
            </h1>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="container max-w-4xl py-8 px-4">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Identification */}
          <Card>
            <CardHeader>
              <CardTitle>Identification</CardTitle>
              <CardDescription>Informations de base de l'échantillon</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="sampleId">ID Échantillon *</Label>
                  <Input
                    id="sampleId"
                    value={formData.sampleId}
                    onChange={(e) => setFormData(prev => ({ ...prev, sampleId: e.target.value }))}
                    placeholder="SA-LE-007"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date">Date de collecte</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="island">Île</Label>
                  <Select value={formData.island} onValueChange={(v) => setFormData(prev => ({ ...prev, island: v }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="san_andres">San Andrés</SelectItem>
                      <SelectItem value="providencia">Providencia</SelectItem>
                      <SelectItem value="autre">Autre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Statut</Label>
                  <Select value={formData.status} onValueChange={(v) => setFormData(prev => ({ ...prev, status: v }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="brut">Brut</SelectItem>
                      <SelectItem value="a_analyser">À analyser</SelectItem>
                      <SelectItem value="analyse">Analysé</SelectItem>
                      <SelectItem value="traduction">Traduction</SelectItem>
                      <SelectItem value="archive">Archivé</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="preciseLocation">Localisation précise</Label>
                <Input
                  id="preciseLocation"
                  value={formData.preciseLocation}
                  onChange={(e) => setFormData(prev => ({ ...prev, preciseLocation: e.target.value }))}
                  placeholder="Quartier, coordonnées GPS..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sourceContact">Contact source</Label>
                <Textarea
                  id="sourceContact"
                  value={formData.sourceContact}
                  onChange={(e) => setFormData(prev => ({ ...prev, sourceContact: e.target.value }))}
                  placeholder="Informations sur la source de l'échantillon"
                />
              </div>
            </CardContent>
          </Card>

          {/* Classification botanique */}
          <Card>
            <CardHeader>
              <CardTitle>Classification botanique</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="category">Catégorie *</Label>
                  <Select value={formData.category} onValueChange={(v) => setFormData(prev => ({ ...prev, category: v }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="aromatique">Aromatique</SelectItem>
                      <SelectItem value="tabac">Tabac</SelectItem>
                      <SelectItem value="cannabis">Cannabis</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="species">Espèce (nom scientifique)</Label>
                  <Input
                    id="species"
                    value={formData.species}
                    onChange={(e) => setFormData(prev => ({ ...prev, species: e.target.value }))}
                    placeholder="Nicotiana tabacum"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="claimedVariety">Variété revendiquée</Label>
                  <Input
                    id="claimedVariety"
                    value={formData.claimedVariety}
                    onChange={(e) => setFormData(prev => ({ ...prev, claimedVariety: e.target.value }))}
                    placeholder="Virginia, Criollo..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="usedPart">Partie utilisée</Label>
                  <Select value={formData.usedPart} onValueChange={(v) => setFormData(prev => ({ ...prev, usedPart: v }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="feuille">Feuille</SelectItem>
                      <SelectItem value="fleur">Fleur</SelectItem>
                      <SelectItem value="resine">Résine</SelectItem>
                      <SelectItem value="tige">Tige</SelectItem>
                      <SelectItem value="autre">Autre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">État</Label>
                  <Select value={formData.state} onValueChange={(v) => setFormData(prev => ({ ...prev, state: v }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="frais">Frais</SelectItem>
                      <SelectItem value="sec">Sec</SelectItem>
                      <SelectItem value="rehydrate">Réhydraté</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Traitement et extraction */}
          <Card>
            <CardHeader>
              <CardTitle>Traitement et extraction</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="curingTreatment">Méthode de séchage</Label>
                  <Select value={formData.curingTreatment} onValueChange={(v) => setFormData(prev => ({ ...prev, curingTreatment: v }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="aucun">Aucun</SelectItem>
                      <SelectItem value="air_cured">Air-cured</SelectItem>
                      <SelectItem value="flue_cured">Flue-cured</SelectItem>
                      <SelectItem value="sun_cured">Sun-cured</SelectItem>
                      <SelectItem value="autre">Autre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="extraction">Méthode d'extraction</Label>
                  <Select value={formData.extraction} onValueChange={(v) => setFormData(prev => ({ ...prev, extraction: v }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="aucune">Aucune</SelectItem>
                      <SelectItem value="maceration_alcool">Macération alcool</SelectItem>
                      <SelectItem value="maceration_mct">Macération MCT</SelectItem>
                      <SelectItem value="distillation">Distillation</SelectItem>
                      <SelectItem value="headspace">Headspace</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ratioParameters">Ratio/Paramètres</Label>
                  <Input
                    id="ratioParameters"
                    value={formData.ratioParameters}
                    onChange={(e) => setFormData(prev => ({ ...prev, ratioParameters: e.target.value }))}
                    placeholder="1:5 (m/v)"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Durée</Label>
                  <Input
                    id="duration"
                    value={formData.duration}
                    onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                    placeholder="24h, 30m..."
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Axes climatiques et usage */}
          <Card>
            <CardHeader>
              <CardTitle>Classification Absorbe</CardTitle>
              <CardDescription>Axes climatiques et usages recommandés</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label>Axes climatiques</Label>
                <div className="flex flex-wrap gap-3">
                  {climaticAxes.map((axis) => (
                    <div key={axis.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={`axis-${axis.value}`}
                        checked={formData.climaticAxis.includes(axis.value)}
                        onCheckedChange={() => handleAxisToggle(axis.value)}
                      />
                      <Label htmlFor={`axis-${axis.value}`} className="cursor-pointer">
                        {axis.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-3">
                <Label>Usages recommandés</Label>
                <div className="flex flex-wrap gap-3">
                  {usageOptions.map((usage) => (
                    <div key={usage.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={`usage-${usage.value}`}
                        checked={formData.usage.includes(usage.value)}
                        onCheckedChange={() => handleUsageToggle(usage.value)}
                      />
                      <Label htmlFor={`usage-${usage.value}`} className="cursor-pointer">
                        {usage.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="odorNotes">Notes olfactives</Label>
                <Textarea
                  id="odorNotes"
                  value={formData.odorNotes}
                  onChange={(e) => setFormData(prev => ({ ...prev, odorNotes: e.target.value }))}
                  placeholder="Description des notes olfactives perçues..."
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="absorbeInterpretation">Interprétation Absorbe</Label>
                <Textarea
                  id="absorbeInterpretation"
                  value={formData.absorbeInterpretation}
                  onChange={(e) => setFormData(prev => ({ ...prev, absorbeInterpretation: e.target.value }))}
                  placeholder="Lecture critique selon la méthodologie Absorbe..."
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          {/* Analyse chimique */}
          <Card>
            <CardHeader>
              <CardTitle>Analyse chimique</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="analysisAvailable"
                  checked={formData.analysisAvailable}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, analysisAvailable: !!checked }))}
                />
                <Label htmlFor="analysisAvailable" className="cursor-pointer">
                  Analyse disponible
                </Label>
              </div>
              
              {formData.analysisAvailable && (
                <div className="space-y-4 pt-4 border-t">
                  <div className="space-y-2">
                    <Label htmlFor="analysisMethod">Méthode d'analyse</Label>
                    <Select value={formData.analysisMethod} onValueChange={(v) => setFormData(prev => ({ ...prev, analysisMethod: v }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gc_ms">GC-MS</SelectItem>
                        <SelectItem value="hplc">HPLC</SelectItem>
                        <SelectItem value="autre">Autre</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="topMolecule1">Molécule #1</Label>
                      <Input
                        id="topMolecule1"
                        value={formData.topMolecule1}
                        onChange={(e) => setFormData(prev => ({ ...prev, topMolecule1: e.target.value }))}
                        placeholder="Limonène"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="topMolecule2">Molécule #2</Label>
                      <Input
                        id="topMolecule2"
                        value={formData.topMolecule2}
                        onChange={(e) => setFormData(prev => ({ ...prev, topMolecule2: e.target.value }))}
                        placeholder="Linalol"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="topMolecule3">Molécule #3</Label>
                      <Input
                        id="topMolecule3"
                        value={formData.topMolecule3}
                        onChange={(e) => setFormData(prev => ({ ...prev, topMolecule3: e.target.value }))}
                        placeholder="Myrcène"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="topMoleculesList">Liste complète des molécules</Label>
                    <Textarea
                      id="topMoleculesList"
                      value={formData.topMoleculesList}
                      onChange={(e) => setFormData(prev => ({ ...prev, topMoleculesList: e.target.value }))}
                      placeholder="Limonène, Linalol, Myrcène, β-Caryophyllène..."
                      rows={2}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="relativePercentages">Pourcentages relatifs</Label>
                    <Textarea
                      id="relativePercentages"
                      value={formData.relativePercentages}
                      onChange={(e) => setFormData(prev => ({ ...prev, relativePercentages: e.target.value }))}
                      placeholder="Limonène: 35%, Linalol: 22%, Myrcène: 18%..."
                      rows={2}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Image de l'échantillon */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                Image de l'échantillon
              </CardTitle>
              <CardDescription>
                Ajoutez une photo de l'échantillon botanique (upload vers S3)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {id ? (
                <LeafEconomyImageUpload
                  leafEconomyId={id}
                  currentImageUrl={formData.imageUrl || null}
                  onImageUploaded={(url) => setFormData(prev => ({ ...prev, imageUrl: url }))}
                  disabled={isNew}
                />
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <ImageIcon className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">L'upload d'images sera disponible après la création de l'échantillon</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Métadonnées */}
          <Card>
            <CardHeader>
              <CardTitle>Métadonnées</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="mediaLinks">Liens médias</Label>
                <Textarea
                  id="mediaLinks"
                  value={formData.mediaLinks}
                  onChange={(e) => setFormData(prev => ({ ...prev, mediaLinks: e.target.value }))}
                  placeholder="URLs des photos, vidéos, documents..."
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ethicalNotes">Notes éthiques</Label>
                <Textarea
                  id="ethicalNotes"
                  value={formData.ethicalNotes}
                  onChange={(e) => setFormData(prev => ({ ...prev, ethicalNotes: e.target.value }))}
                  placeholder="Consentement, provenance, considérations éthiques..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-between items-center pt-6 border-t">
            <Link href={isNew ? "/san-andres/leaf-economies" : `/san-andres/echantillon/${id}`}>
              <Button variant="outline" type="button">
                <ChevronLeft className="h-4 w-4 mr-2" />
                Annuler
              </Button>
            </Link>
            <Button type="submit" disabled={isSaving}>
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? "Enregistrement..." : (isNew ? "Créer l'échantillon" : "Enregistrer les modifications")}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
