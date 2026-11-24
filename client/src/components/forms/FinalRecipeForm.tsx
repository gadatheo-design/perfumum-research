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
import { Switch } from "@/components/ui/switch";
import { Plus, Trash2, Droplets, Flame, Wind, TreeDeciduous, Sparkles, Zap } from "lucide-react";

interface ConcentrateItem {
  ingredient: string;
  percentage: number;
}

interface FinalRecipeFormProps {
  onSuccess?: () => void;
  trigger?: React.ReactNode;
}

export function FinalRecipeForm({ onSuccess, trigger }: FinalRecipeFormProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [recipeId, setRecipeId] = useState("");
  const [name, setName] = useState("");
  const [recipeType, setRecipeType] = useState<string>("");
  const [functionText, setFunctionText] = useState("");
  const [climaticAxis, setClimaticAxis] = useState<string>("");
  const [base, setBase] = useState("");
  const [concentrate, setConcentrate] = useState<ConcentrateItem[]>([{ ingredient: "", percentage: 0 }]);
  const [dilution, setDilution] = useState("");
  const [restPeriod, setRestPeriod] = useState("");
  const [form, setForm] = useState("");
  const [combustionTime, setCombustionTime] = useState("");
  const [protocol, setProtocol] = useState("");
  const [supports, setSupports] = useState("");
  const [expectedResult, setExpectedResult] = useState("");
  const [successCriteria, setSuccessCriteria] = useState("");
  const [risks, setRisks] = useState("");
  const [notes, setNotes] = useState("");
  const [usage, setUsage] = useState("");
  const [terpProfileIds, setTerpProfileIds] = useState("");
  const [isRadical, setIsRadical] = useState(false);

  const utils = trpc.useUtils();
  const createMutation = trpc.finalRecipes.create.useMutation({
    onSuccess: () => {
      toast.success("Recette finale créée avec succès");
      utils.finalRecipes.list.invalidate();
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
    setRecipeId("");
    setName("");
    setRecipeType("");
    setFunctionText("");
    setClimaticAxis("");
    setBase("");
    setConcentrate([{ ingredient: "", percentage: 0 }]);
    setDilution("");
    setRestPeriod("");
    setForm("");
    setCombustionTime("");
    setProtocol("");
    setSupports("");
    setExpectedResult("");
    setSuccessCriteria("");
    setRisks("");
    setNotes("");
    setUsage("");
    setTerpProfileIds("");
    setIsRadical(false);
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
    if (!recipeId.trim()) {
      toast.error("L'ID de la recette est requis");
      return;
    }
    if (!name.trim()) {
      toast.error("Le nom est requis");
      return;
    }
    if (!recipeType) {
      toast.error("Le type de recette est requis");
      return;
    }
    if (!climaticAxis) {
      toast.error("L'axe climatique est requis");
      return;
    }

    setIsSubmitting(true);

    const validConcentrate = concentrate.filter(c => c.ingredient.trim() !== "");
    const parsedTerpProfileIds = terpProfileIds.trim() 
      ? terpProfileIds.split(",").map(s => s.trim()).filter(Boolean)
      : undefined;

    createMutation.mutate({
      recipeId: recipeId.trim(),
      name: name.trim(),
      recipeType: recipeType as any,
      function: functionText || undefined,
      climaticAxis: climaticAxis as any,
      base: base || undefined,
      concentrate: validConcentrate.length > 0 ? validConcentrate : undefined,
      dilution: dilution || undefined,
      restPeriod: restPeriod || undefined,
      form: form || undefined,
      combustionTime: combustionTime || undefined,
      protocol: protocol || undefined,
      supports: supports || undefined,
      expectedResult: expectedResult || undefined,
      successCriteria: successCriteria || undefined,
      risks: risks || undefined,
      notes: notes || undefined,
      usage: usage || undefined,
      terpProfileIds: parsedTerpProfileIds,
      isRadical: isRadical ? 1 : 0,
    });
  };

  // Dynamic fields based on recipe type
  const showParfumFields = recipeType === "parfum";
  const showEncensFields = recipeType === "encens";
  const showEspaceFields = recipeType === "espace";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Nouvelle recette
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Créer une nouvelle recette finale</DialogTitle>
          <DialogDescription>
            Formulation complète : Parfum, Encens ou Espace
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-6 py-4">
            {/* Identification */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Identification</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="recipeId">ID de la recette *</Label>
                  <Input
                    id="recipeId"
                    placeholder="PF-XX, EN-XX, ES-XX"
                    value={recipeId}
                    onChange={(e) => setRecipeId(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Nom *</Label>
                  <Input
                    id="name"
                    placeholder="Salted Exposure / Leaf Edition"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Type de recette *</Label>
                  <Select value={recipeType} onValueChange={setRecipeType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="parfum">
                        <span className="flex items-center gap-2"><Droplets className="w-4 h-4" /> Parfum</span>
                      </SelectItem>
                      <SelectItem value="encens">
                        <span className="flex items-center gap-2"><Flame className="w-4 h-4" /> Encens</span>
                      </SelectItem>
                      <SelectItem value="espace">
                        <span className="flex items-center gap-2"><Wind className="w-4 h-4" /> Espace</span>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Axe climatique *</Label>
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
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="isRadical"
                  checked={isRadical}
                  onCheckedChange={setIsRadical}
                />
                <Label htmlFor="isRadical" className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-500" />
                  Recette radicale (R-XX)
                </Label>
              </div>
            </div>

            {/* Fonction */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Fonction</h3>
              <div className="space-y-2">
                <Label htmlFor="function">Description fonctionnelle</Label>
                <Textarea
                  id="function"
                  placeholder="Climat portable, désaturation..."
                  value={functionText}
                  onChange={(e) => setFunctionText(e.target.value)}
                  rows={2}
                />
              </div>
            </div>

            {/* Base et concentré */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Formulation</h3>
              <div className="space-y-2">
                <Label htmlFor="base">Base / Support</Label>
                <Input
                  id="base"
                  placeholder="Alcool neutre, bois sec + fibres..."
                  value={base}
                  onChange={(e) => setBase(e.target.value)}
                />
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Concentré (formule)</Label>
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
            </div>

            {/* Champs spécifiques Parfum */}
            {showParfumFields && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Paramètres Parfum</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dilution">Dilution</Label>
                    <Input
                      id="dilution"
                      placeholder="8% dans alcool"
                      value={dilution}
                      onChange={(e) => setDilution(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="restPeriod">Période de repos</Label>
                    <Input
                      id="restPeriod"
                      placeholder="repos 7 jours max"
                      value={restPeriod}
                      onChange={(e) => setRestPeriod(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Champs spécifiques Encens */}
            {showEncensFields && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Paramètres Encens</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="form">Forme</Label>
                    <Input
                      id="form"
                      placeholder="Pastilles plates fines"
                      value={form}
                      onChange={(e) => setForm(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="combustionTime">Temps de combustion</Label>
                    <Input
                      id="combustionTime"
                      placeholder="≤ 5 min"
                      value={combustionTime}
                      onChange={(e) => setCombustionTime(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Champs spécifiques Espace */}
            {showEspaceFields && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Paramètres Espace</h3>
                <div className="space-y-2">
                  <Label htmlFor="protocol">Protocole</Label>
                  <Textarea
                    id="protocol"
                    placeholder="Description du protocole d'application..."
                    value={protocol}
                    onChange={(e) => setProtocol(e.target.value)}
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="supports">Supports</Label>
                  <Input
                    id="supports"
                    placeholder="Bois clair exposé, pierre / béton, textile sec"
                    value={supports}
                    onChange={(e) => setSupports(e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Résultats et critères */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Résultats attendus</h3>
              <div className="space-y-2">
                <Label htmlFor="expectedResult">Résultat attendu</Label>
                <Textarea
                  id="expectedResult"
                  placeholder="Description du résultat olfactif attendu..."
                  value={expectedResult}
                  onChange={(e) => setExpectedResult(e.target.value)}
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="successCriteria">Critères de réussite</Label>
                <Textarea
                  id="successCriteria"
                  placeholder="Comment évaluer le succès de la formulation..."
                  value={successCriteria}
                  onChange={(e) => setSuccessCriteria(e.target.value)}
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="risks">Risques</Label>
                <Textarea
                  id="risks"
                  placeholder="Risques potentiels et précautions..."
                  value={risks}
                  onChange={(e) => setRisks(e.target.value)}
                  rows={2}
                />
              </div>
            </div>

            {/* Métadonnées */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Métadonnées</h3>
              <div className="space-y-2">
                <Label htmlFor="usage">Usage recommandé</Label>
                <Input
                  id="usage"
                  placeholder="Moments collectifs, ateliers, médiation"
                  value={usage}
                  onChange={(e) => setUsage(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="terpProfileIds">TerpProfiles liés (IDs séparés par virgule)</Label>
                <Input
                  id="terpProfileIds"
                  placeholder="SA-TP-01, SA-TP-02"
                  value={terpProfileIds}
                  onChange={(e) => setTerpProfileIds(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Notes additionnelles..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
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
            {isSubmitting ? "Création..." : "Créer la recette"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
