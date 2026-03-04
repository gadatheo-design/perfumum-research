// @ts-nocheck
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";
import { Plus, Trash2, Wind, TreeDeciduous, Sparkles } from "lucide-react";

interface ConcentrateItem {
  ingredient: string;
  percentage: number;
}

interface TerpProfileFormProps {
  onSuccess?: () => void;
  trigger?: React.ReactNode;
}

export function TerpProfileForm({ onSuccess, trigger }: TerpProfileFormProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [profileId, setProfileId] = useState("");
  const [name, setName] = useState("");
  const [collection, setCollection] = useState("San Andrés · Leaf Economies");
  const [type, setType] = useState("Formule analytique");
  const [climaticAxis, setClimaticAxis] = useState<string>("");
  const [secondaryAxis, setSecondaryAxis] = useState<string>("none");
  const [functionText, setFunctionText] = useState("");
  const [usage, setUsage] = useState<string>("parfum");
  const [level, setLevel] = useState("Recherche");
  const [plantSources, setPlantSources] = useState("");
  const [keyMolecules, setKeyMolecules] = useState("");
  const [concentrate, setConcentrate] = useState<ConcentrateItem[]>([{ ingredient: "", percentage: 0 }]);
  const [olfactiveReading, setOlfactiveReading] = useState("");
  const [temporality, setTemporality] = useState<string>("moyenne");
  const [temporalityDescription, setTemporalityDescription] = useState("");
  const [recommendedUsage, setRecommendedUsage] = useState("");
  const [criticalNotes, setCriticalNotes] = useState("");
  const [intensity, setIntensity] = useState<string>("moyenne");
  const [readability, setReadability] = useState<string>("lisible");
  const [nonIdentifiable, setNonIdentifiable] = useState(0);
  
  // Radar values
  const [radarVent, setRadarVent] = useState(50);
  const [radarBois, setRadarBois] = useState(50);
  const [radarDisparition, setRadarDisparition] = useState(50);
  const [radarStructure, setRadarStructure] = useState(50);
  const [radarDiffusion, setRadarDiffusion] = useState(50);

  const utils = trpc.useUtils();
  const createMutation = trpc.terpProfiles.create.useMutation({
    onSuccess: () => {
      toast.success("TerpProfile créé avec succès");
      utils.terpProfiles.list.invalidate();
      setOpen(false);
      resetForm();
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(`Erreur: ${error.message}`);
      setIsSubmitting(false);
    },
  });

  const resetForm = () => {
    setProfileId("");
    setName("");
    setCollection("San Andrés · Leaf Economies");
    setType("Formule analytique");
    setClimaticAxis("");
    setSecondaryAxis("none");
    setFunctionText("");
    setUsage("parfum");
    setLevel("Recherche");
    setPlantSources("");
    setKeyMolecules("");
    setConcentrate([{ ingredient: "", percentage: 0 }]);
    setOlfactiveReading("");
    setTemporality("moyenne");
    setTemporalityDescription("");
    setRecommendedUsage("");
    setCriticalNotes("");
    setIntensity("moyenne");
    setReadability("lisible");
    setNonIdentifiable(0);
    setRadarVent(50);
    setRadarBois(50);
    setRadarDisparition(50);
    setRadarStructure(50);
    setRadarDiffusion(50);
    setIsSubmitting(false);
  };

  const addConcentrateItem = () => {
    setConcentrate([...concentrate, { ingredient: "", percentage: 0 }]);
  };

  const removeConcentrateItem = (index: number) => {
    setConcentrate(concentrate.filter((_, i) => i !== index));
  };

  const updateConcentrateItem = (index: number, field: keyof ConcentrateItem, value: string | number) => {
    const updated = [...concentrate];
    updated[index] = { ...updated[index], [field]: value };
    setConcentrate(updated);
  };

  const handleSubmit = () => {
    if (!profileId.trim()) {
      toast.error("L'ID du profil est requis");
      return;
    }
    if (!name.trim()) {
      toast.error("Le nom est requis");
      return;
    }
    if (!climaticAxis) {
      toast.error("L'axe climatique est requis");
      return;
    }

    setIsSubmitting(true);

    const validConcentrate = concentrate.filter(c => c.ingredient.trim() !== "");

    createMutation.mutate({
      profileId: profileId.trim(),
      name: name.trim(),
      collection: collection || undefined,
      type: type || undefined,
      climaticAxis: climaticAxis as any,
      secondaryAxis: secondaryAxis as any,
      function: functionText || undefined,
      usage: usage as any,
      level: level || undefined,
      plantSources: plantSources || undefined,
      keyMolecules: keyMolecules || undefined,
      concentrate: validConcentrate.length > 0 ? validConcentrate : undefined,
      olfactiveReading: olfactiveReading || undefined,
      temporality: temporality as any,
      temporalityDescription: temporalityDescription || undefined,
      recommendedUsage: recommendedUsage || undefined,
      criticalNotes: criticalNotes || undefined,
      intensity: intensity as any,
      readability: readability as any,
      nonIdentifiable: nonIdentifiable,
      radarVent,
      radarBois,
      radarDisparition,
      radarStructure,
      radarDiffusion,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Nouvelle fiche
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Créer un nouveau TerpProfile</DialogTitle>
          <DialogDescription>
            Fiche analytique pour le projet San Andrés · Leaf Economies
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-6 py-4">
            {/* Identification */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Identification</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="profileId">ID du profil *</Label>
                  <Input
                    id="profileId"
                    placeholder="SA-TP-XX"
                    value={profileId}
                    onChange={(e) => setProfileId(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Nom *</Label>
                  <Input
                    id="name"
                    placeholder="Wind Cut / Citral Structure"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="collection">Collection</Label>
                  <Input
                    id="collection"
                    value={collection}
                    onChange={(e) => setCollection(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Type</Label>
                  <Input
                    id="type"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Axes climatiques */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Axes climatiques</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Axe principal *</Label>
                  <Select value={climaticAxis} onValueChange={setClimaticAxis}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un axe" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vent">
                        <span className="flex items-center gap-2"><Wind className="w-4 h-4" /> Vent</span>
                      </SelectItem>
                      <SelectItem value="bois">
                        <span className="flex items-center gap-2"><TreeDeciduous className="w-4 h-4" /> Bois</span>
                      </SelectItem>
                      <SelectItem value="disparition">
                        <span className="flex items-center gap-2"><Sparkles className="w-4 h-4" /> Disparition</span>
                      </SelectItem>
                      <SelectItem value="vent_bois">Vent + Bois</SelectItem>
                      <SelectItem value="bois_disparition">Bois + Disparition</SelectItem>
                      <SelectItem value="vent_disparition">Vent + Disparition</SelectItem>
                      <SelectItem value="vent_bois_disparition">Triple Axe</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Axe secondaire</Label>
                  <Select value={secondaryAxis} onValueChange={setSecondaryAxis}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Aucun</SelectItem>
                      <SelectItem value="vent">Vent</SelectItem>
                      <SelectItem value="bois">Bois</SelectItem>
                      <SelectItem value="disparition">Disparition</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Fonction et usage */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Fonction et usage</h3>
              <div className="space-y-2">
                <Label htmlFor="function">Fonction</Label>
                <Textarea
                  id="function"
                  placeholder="Coupe aérienne, structure sèche..."
                  value={functionText}
                  onChange={(e) => setFunctionText(e.target.value)}
                  rows={2}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Usage</Label>
                  <Select value={usage} onValueChange={setUsage}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="parfum">Parfum</SelectItem>
                      <SelectItem value="encens">Encens</SelectItem>
                      <SelectItem value="espace">Espace</SelectItem>
                      <SelectItem value="parfum_encens">Parfum + Encens</SelectItem>
                      <SelectItem value="parfum_espace">Parfum + Espace</SelectItem>
                      <SelectItem value="encens_espace">Encens + Espace</SelectItem>
                      <SelectItem value="tous">Tous usages</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="level">Niveau</Label>
                  <Input
                    id="level"
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Sources */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Sources</h3>
              <div className="space-y-2">
                <Label htmlFor="plantSources">Plantes sources (JSON)</Label>
                <Textarea
                  id="plantSources"
                  placeholder='["Citronnier", "Basilic"]'
                  value={plantSources}
                  onChange={(e) => setPlantSources(e.target.value)}
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="keyMolecules">Molécules clés (JSON)</Label>
                <Textarea
                  id="keyMolecules"
                  placeholder='["Citral", "Limonène"]'
                  value={keyMolecules}
                  onChange={(e) => setKeyMolecules(e.target.value)}
                  rows={2}
                />
              </div>
            </div>

            {/* Concentré */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Concentré (formule)</h3>
                <Button type="button" variant="outline" size="sm" onClick={addConcentrateItem}>
                  <Plus className="w-4 h-4 mr-1" /> Ajouter
                </Button>
              </div>
              {concentrate.map((item, index) => (
                <div key={index} className="flex gap-2 items-end">
                  <div className="flex-1 space-y-1">
                    <Label className="text-xs">Ingrédient</Label>
                    <Input
                      placeholder="Nom de l'ingrédient"
                      value={item.ingredient}
                      onChange={(e) => updateConcentrateItem(index, "ingredient", e.target.value)}
                    />
                  </div>
                  <div className="w-24 space-y-1">
                    <Label className="text-xs">%</Label>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      value={item.percentage}
                      onChange={(e) => updateConcentrateItem(index, "percentage", parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  {concentrate.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeConcentrateItem(index)}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            {/* Lecture olfactive */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Lecture olfactive</h3>
              <div className="space-y-2">
                <Label htmlFor="olfactiveReading">Description olfactive</Label>
                <Textarea
                  id="olfactiveReading"
                  placeholder="Notes de tête fraîches, évolution vers..."
                  value={olfactiveReading}
                  onChange={(e) => setOlfactiveReading(e.target.value)}
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Temporalité</Label>
                  <Select value={temporality} onValueChange={setTemporality}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tres_courte">Très courte</SelectItem>
                      <SelectItem value="rapide">Rapide</SelectItem>
                      <SelectItem value="moyenne">Moyenne</SelectItem>
                      <SelectItem value="longue">Longue</SelectItem>
                      <SelectItem value="variable">Variable</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Intensité</Label>
                  <Select value={intensity} onValueChange={setIntensity}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="faible">Faible</SelectItem>
                      <SelectItem value="moyenne">Moyenne</SelectItem>
                      <SelectItem value="structurelle">Structurelle</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Lisibilité</Label>
                  <Select value={readability} onValueChange={setReadability}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="abstrait">Abstrait</SelectItem>
                      <SelectItem value="lisible">Lisible</SelectItem>
                      <SelectItem value="structure">Structure</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Non-identifiable (%)</Label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={nonIdentifiable}
                    onChange={(e) => setNonIdentifiable(parseInt(e.target.value) || 0)}
                  />
                </div>
              </div>
            </div>

            {/* Radar climatique */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Radar climatique</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Vent</Label>
                    <span className="text-sm text-muted-foreground">{radarVent}</span>
                  </div>
                  <Slider
                    value={[radarVent]}
                    onValueChange={([v]) => setRadarVent(v)}
                    max={100}
                    step={1}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Bois</Label>
                    <span className="text-sm text-muted-foreground">{radarBois}</span>
                  </div>
                  <Slider
                    value={[radarBois]}
                    onValueChange={([v]) => setRadarBois(v)}
                    max={100}
                    step={1}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Disparition</Label>
                    <span className="text-sm text-muted-foreground">{radarDisparition}</span>
                  </div>
                  <Slider
                    value={[radarDisparition]}
                    onValueChange={([v]) => setRadarDisparition(v)}
                    max={100}
                    step={1}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Structure</Label>
                    <span className="text-sm text-muted-foreground">{radarStructure}</span>
                  </div>
                  <Slider
                    value={[radarStructure]}
                    onValueChange={([v]) => setRadarStructure(v)}
                    max={100}
                    step={1}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Diffusion</Label>
                    <span className="text-sm text-muted-foreground">{radarDiffusion}</span>
                  </div>
                  <Slider
                    value={[radarDiffusion]}
                    onValueChange={([v]) => setRadarDiffusion(v)}
                    max={100}
                    step={1}
                  />
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Notes additionnelles</h3>
              <div className="space-y-2">
                <Label htmlFor="temporalityDescription">Description temporalité</Label>
                <Textarea
                  id="temporalityDescription"
                  value={temporalityDescription}
                  onChange={(e) => setTemporalityDescription(e.target.value)}
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="recommendedUsage">Usage recommandé</Label>
                <Textarea
                  id="recommendedUsage"
                  value={recommendedUsage}
                  onChange={(e) => setRecommendedUsage(e.target.value)}
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="criticalNotes">Notes critiques</Label>
                <Textarea
                  id="criticalNotes"
                  value={criticalNotes}
                  onChange={(e) => setCriticalNotes(e.target.value)}
                  rows={2}
                />
              </div>
            </div>
          </div>
        </ScrollArea>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Annuler
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Création..." : "Créer le TerpProfile"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
