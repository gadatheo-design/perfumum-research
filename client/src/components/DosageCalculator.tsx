import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Calculator, Plus, Trash2, AlertCircle, CheckCircle2, Lightbulb, ChevronDown, ChevronUp } from "lucide-react";
import { trpc } from "@/lib/trpc";

interface Ingredient {
  id: string;
  name: string;
  grams: number;
  percentage: number;
}

export function DosageCalculator() {
  const [totalBatch, setTotalBatch] = useState<number>(100); // Total batch in grams
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { id: "1", name: "", grams: 0, percentage: 0 }
  ]);
  const [selectedProfile, setSelectedProfile] = useState<string>("");
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);

  const { data: suggestions, isLoading: loadingSuggestions } = trpc.tabacs.getSuggestions.useQuery(
    { olfactiveProfile: selectedProfile },
    { enabled: selectedProfile.length > 0 }
  );

  const totalGrams = useMemo(() => {
    return ingredients.reduce((sum, ing) => sum + ing.grams, 0);
  }, [ingredients]);

  const totalPercentage = useMemo(() => {
    return ingredients.reduce((sum, ing) => sum + ing.percentage, 0);
  }, [ingredients]);

  const isValid = useMemo(() => {
    return Math.abs(totalPercentage - 100) < 0.01 && totalGrams <= totalBatch;
  }, [totalPercentage, totalGrams, totalBatch]);

  const addIngredient = () => {
    setIngredients([
      ...ingredients,
      { id: Date.now().toString(), name: "", grams: 0, percentage: 0 }
    ]);
  };

  const removeIngredient = (id: string) => {
    setIngredients(ingredients.filter(ing => ing.id !== id));
  };

  const updateIngredientGrams = (id: string, grams: number) => {
    setIngredients(ingredients.map(ing => {
      if (ing.id === id) {
        const percentage = totalBatch > 0 ? (grams / totalBatch) * 100 : 0;
        return { ...ing, grams, percentage };
      }
      return ing;
    }));
  };

  const updateIngredientPercentage = (id: string, percentage: number) => {
    setIngredients(ingredients.map(ing => {
      if (ing.id === id) {
        const grams = (percentage / 100) * totalBatch;
        return { ...ing, grams, percentage };
      }
      return ing;
    }));
  };

  const updateIngredientName = (id: string, name: string) => {
    setIngredients(ingredients.map(ing => 
      ing.id === id ? { ...ing, name } : ing
    ));
  };

  const addSuggestedIngredient = (name: string, suggestedPercentage: number = 5) => {
    const grams = (suggestedPercentage / 100) * totalBatch;
    setIngredients([
      ...ingredients,
      { id: Date.now().toString(), name, grams, percentage: suggestedPercentage }
    ]);
  };

  const normalizeToTotal = () => {
    const currentTotal = totalPercentage;
    if (currentTotal === 0) return;

    setIngredients(ingredients.map(ing => {
      const normalizedPercentage = (ing.percentage / currentTotal) * 100;
      const normalizedGrams = (normalizedPercentage / 100) * totalBatch;
      return {
        ...ing,
        percentage: normalizedPercentage,
        grams: normalizedGrams
      };
    }));
  };

  const resetCalculator = () => {
    setIngredients([{ id: Date.now().toString(), name: "", grams: 0, percentage: 0 }]);
    setTotalBatch(100);
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-lg bg-purple-50 flex items-center justify-center">
          <Calculator className="w-6 h-6 text-purple-600" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-stone-900">Calculateur de Dosages</h3>
          <p className="text-sm text-stone-600">Conversion automatique grammes ↔ pourcentages</p>
        </div>
      </div>

      {/* Total Batch */}
      <div className="mb-6 p-4 bg-stone-50 rounded-lg">
        <Label htmlFor="totalBatch" className="text-sm font-medium mb-2 block">
          Quantité totale du batch (grammes)
        </Label>
        <Input
          id="totalBatch"
          type="number"
          value={totalBatch}
          onChange={(e) => setTotalBatch(Number(e.target.value))}
          className="max-w-xs"
          min="0"
          step="0.1"
        />
      </div>

      {/* Ingredients List */}
      <div className="space-y-4 mb-6">
        {ingredients.map((ingredient, index) => (
          <div key={ingredient.id} className="grid grid-cols-12 gap-3 items-end">
            <div className="col-span-4">
              <Label className="text-xs text-stone-600 mb-1 block">
                Ingrédient {index + 1}
              </Label>
              <Input
                type="text"
                placeholder="Nom de l'ingrédient"
                value={ingredient.name}
                onChange={(e) => updateIngredientName(ingredient.id, e.target.value)}
              />
            </div>
            
            <div className="col-span-3">
              <Label className="text-xs text-stone-600 mb-1 block">
                Grammes
              </Label>
              <Input
                type="number"
                value={ingredient.grams || ""}
                onChange={(e) => updateIngredientGrams(ingredient.id, Number(e.target.value))}
                min="0"
                step="0.01"
              />
            </div>

            <div className="col-span-3">
              <Label className="text-xs text-stone-600 mb-1 block">
                Pourcentage
              </Label>
              <Input
                type="number"
                value={ingredient.percentage || ""}
                onChange={(e) => updateIngredientPercentage(ingredient.id, Number(e.target.value))}
                min="0"
                max="100"
                step="0.01"
              />
            </div>

            <div className="col-span-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => removeIngredient(ingredient.id)}
                disabled={ingredients.length === 1}
                className="w-full"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Ingredient Button */}
      <Button
        variant="outline"
        onClick={addIngredient}
        className="w-full mb-6"
      >
        <Plus className="w-4 h-4 mr-2" />
        Ajouter un ingrédient
      </Button>

      {/* Suggestions Section */}
      <div className="mt-8 mb-6">
        <button
          onClick={() => setShowSuggestions(!showSuggestions)}
          className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium mb-4"
        >
          <Lightbulb className="w-5 h-5" />
          Suggestions intelligentes
          {showSuggestions ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showSuggestions && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {["terreux", "fumé", "résine", "floral", "boisé", "animalité", "métallique", "lactone"].map(profile => (
                <button
                  key={profile}
                  onClick={() => setSelectedProfile(profile)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedProfile === profile
                      ? "bg-purple-600 text-white"
                      : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                  }`}
                >
                  {profile.charAt(0).toUpperCase() + profile.slice(1)}
                </button>
              ))}
            </div>

            {selectedProfile && (
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <div className="text-sm font-medium text-purple-900 mb-3">
                  Tabacs recommandés pour profil "{selectedProfile}" :
                </div>
                {loadingSuggestions ? (
                  <div className="text-sm text-purple-600">Chargement...</div>
                ) : suggestions && suggestions.length > 0 ? (
                  <div className="space-y-2">
                    {suggestions.map((tabac) => (
                      <div key={tabac.id} className="flex items-center justify-between bg-white rounded-lg p-3 border border-purple-100">
                        <div className="flex-1">
                          <div className="font-medium text-stone-900">{tabac.name}</div>
                          <div className="text-xs text-stone-600">{tabac.type} • Intensité: {tabac.intensity}/10</div>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => addSuggestedIngredient(tabac.name, 5)}
                          className="bg-purple-600 hover:bg-purple-700"
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          Ajouter
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-purple-600">Aucun tabac trouvé pour ce profil.</div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Summary */}
      <div className="border-t pt-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-stone-50 rounded-lg">
            <div className="text-sm text-stone-600 mb-1">Total grammes</div>
            <div className="text-2xl font-bold text-stone-900">
              {safeToFixed(totalGrams, 2)}g
            </div>
            <div className="text-xs text-stone-500 mt-1">
              sur {totalBatch}g ({((totalGrams / totalBatch) * 100).toFixed(1)}%)
            </div>
          </div>

          <div className="p-4 bg-stone-50 rounded-lg">
            <div className="text-sm text-stone-600 mb-1">Total pourcentage</div>
            <div className="text-2xl font-bold text-stone-900">
              {safeToFixed(totalPercentage, 2)}%
            </div>
            <div className="text-xs text-stone-500 mt-1">
              {isValid ? "✓ Formule valide" : "⚠ Ajuster les dosages"}
            </div>
          </div>
        </div>

        {/* Validation Status */}
        <div className={`p-4 rounded-lg flex items-start gap-3 ${
          isValid 
            ? "bg-green-50 border border-green-200" 
            : "bg-amber-50 border border-amber-200"
        }`}>
          {isValid ? (
            <>
              <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <div className="font-medium text-green-900">Formule valide</div>
                <div className="text-sm text-green-700">
                  La somme des pourcentages est de 100% et le total ne dépasse pas le batch.
                </div>
              </div>
            </>
          ) : (
            <>
              <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
              <div>
                <div className="font-medium text-amber-900">Formule à ajuster</div>
                <div className="text-sm text-amber-700">
                  {totalPercentage > 100 && "La somme des pourcentages dépasse 100%. "}
                  {totalPercentage < 100 && "La somme des pourcentages est inférieure à 100%. "}
                  {totalGrams > totalBatch && "Le total en grammes dépasse le batch."}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={normalizeToTotal}
            variant="outline"
            className="flex-1"
            disabled={totalPercentage === 0}
          >
            Normaliser à 100%
          </Button>
          <Button
            onClick={resetCalculator}
            variant="outline"
            className="flex-1"
          >
            Réinitialiser
          </Button>
        </div>
      </div>
    </Card>
  );
}
