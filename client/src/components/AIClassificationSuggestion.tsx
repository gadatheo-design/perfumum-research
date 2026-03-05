// @ts-nocheck
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Sparkles, Check, X, AlertCircle, Brain, Beaker, Flower2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Types pour les classes chimiques et familles olfactives
const CHEMICAL_CLASSES: Record<string, { label: string; color: string }> = {
  terpene: { label: "Terpène", color: "bg-green-500/20 text-green-700 dark:text-green-400" },
  monoterpene: { label: "Monoterpène", color: "bg-green-600/20 text-green-800 dark:text-green-300" },
  sesquiterpene: { label: "Sesquiterpène", color: "bg-emerald-500/20 text-emerald-700 dark:text-emerald-400" },
  diterpene: { label: "Diterpène", color: "bg-teal-500/20 text-teal-700 dark:text-teal-400" },
  aldehyde: { label: "Aldéhyde", color: "bg-amber-500/20 text-amber-700 dark:text-amber-400" },
  ketone: { label: "Cétone", color: "bg-orange-500/20 text-orange-700 dark:text-orange-400" },
  alcohol: { label: "Alcool", color: "bg-blue-500/20 text-blue-700 dark:text-blue-400" },
  ester: { label: "Ester", color: "bg-purple-500/20 text-purple-700 dark:text-purple-400" },
  ether: { label: "Éther", color: "bg-indigo-500/20 text-indigo-700 dark:text-indigo-400" },
  phenol: { label: "Phénol", color: "bg-rose-500/20 text-rose-700 dark:text-rose-400" },
  lactone: { label: "Lactone", color: "bg-pink-500/20 text-pink-700 dark:text-pink-400" },
  coumarin: { label: "Coumarine", color: "bg-fuchsia-500/20 text-fuchsia-700 dark:text-fuchsia-400" },
  musk: { label: "Musc", color: "bg-violet-500/20 text-violet-700 dark:text-violet-400" },
  nitrile: { label: "Nitrile", color: "bg-cyan-500/20 text-cyan-700 dark:text-cyan-400" },
  sulfur_compound: { label: "Composé soufré", color: "bg-yellow-500/20 text-yellow-700 dark:text-yellow-400" },
  heterocyclic: { label: "Hétérocyclique", color: "bg-lime-500/20 text-lime-700 dark:text-lime-400" },
  aromatic: { label: "Aromatique", color: "bg-red-500/20 text-red-700 dark:text-red-400" },
  aliphatic: { label: "Aliphatique", color: "bg-slate-500/20 text-slate-700 dark:text-slate-400" },
  other: { label: "Autre", color: "bg-gray-500/20 text-gray-700 dark:text-gray-400" },
};

const OLFACTIVE_FAMILIES: Record<string, { label: string; color: string; emoji: string }> = {
  floral: { label: "Floral", color: "bg-pink-500/20 text-pink-700 dark:text-pink-400", emoji: "🌸" },
  boise: { label: "Boisé", color: "bg-amber-700/20 text-amber-800 dark:text-amber-400", emoji: "🪵" },
  agrume: { label: "Agrume", color: "bg-yellow-500/20 text-yellow-700 dark:text-yellow-400", emoji: "🍋" },
  epice: { label: "Épicé", color: "bg-orange-600/20 text-orange-800 dark:text-orange-400", emoji: "🌶️" },
  herbace: { label: "Herbacé", color: "bg-green-500/20 text-green-700 dark:text-green-400", emoji: "🌿" },
  balsamique: { label: "Balsamique", color: "bg-amber-500/20 text-amber-700 dark:text-amber-400", emoji: "🍯" },
  musque: { label: "Musqué", color: "bg-purple-500/20 text-purple-700 dark:text-purple-400", emoji: "💜" },
  animal: { label: "Animal", color: "bg-stone-500/20 text-stone-700 dark:text-stone-400", emoji: "🦌" },
  vert: { label: "Vert", color: "bg-emerald-500/20 text-emerald-700 dark:text-emerald-400", emoji: "🍃" },
  fruite: { label: "Fruité", color: "bg-red-500/20 text-red-700 dark:text-red-400", emoji: "🍎" },
  marin: { label: "Marin", color: "bg-cyan-500/20 text-cyan-700 dark:text-cyan-400", emoji: "🌊" },
  terreux: { label: "Terreux", color: "bg-stone-600/20 text-stone-800 dark:text-stone-400", emoji: "🍄" },
  fume: { label: "Fumé", color: "bg-gray-600/20 text-gray-800 dark:text-gray-400", emoji: "🔥" },
  gourmand: { label: "Gourmand", color: "bg-rose-500/20 text-rose-700 dark:text-rose-400", emoji: "🍫" },
  aromatique: { label: "Aromatique", color: "bg-teal-500/20 text-teal-700 dark:text-teal-400", emoji: "🌱" },
  autre: { label: "Autre", color: "bg-gray-500/20 text-gray-700 dark:text-gray-400", emoji: "❓" },
};

interface MoleculeInput {
  name: string;
  iupacName?: string | null;
  casNumber?: string | null;
  chemicalFormula?: string | null;
  olfactiveProfile?: string | null;
  botanicalSources?: string | null;
}

interface ClassificationResult {
  chemicalClass: string;
  chemicalClassConfidence: number;
  chemicalClassReasoning: string;
  olfactiveFamily: string;
  olfactiveFamilyConfidence: number;
  olfactiveFamilyReasoning: string;
  suggestedOlfactiveProfile: string;
  additionalNotes: string;
}

interface AIClassificationSuggestionProps {
  molecule: MoleculeInput;
  currentChemicalClass?: string | null;
  currentOlfactiveFamily?: string | null;
  onAcceptChemicalClass?: (value: string) => void;
  onAcceptOlfactiveFamily?: (value: string) => void;
  onAcceptOlfactiveProfile?: (value: string) => void;
  onAcceptResearcherNotes?: (value: string, appendMode: boolean) => void;
  currentNotes?: string | null;
  compact?: boolean;
  autoClassify?: boolean;
}

export function AIClassificationSuggestion({
  molecule,
  currentChemicalClass,
  currentOlfactiveFamily,
  onAcceptChemicalClass,
  onAcceptOlfactiveFamily,
  onAcceptOlfactiveProfile,
  onAcceptResearcherNotes,
  currentNotes,
  compact = false,
  autoClassify = false,
}: AIClassificationSuggestionProps) {
  const [result, setResult] = useState<ClassificationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [acceptedFields, setAcceptedFields] = useState<Set<string>>(new Set());

  const classifyMutation = trpc.ai.classifyMolecule.useMutation({
    onSuccess: (data) => {
      if (data.success && data.classification) {
        setResult(data.classification);
        setError(null);
      } else {
        setError(data.error || "Erreur lors de la classification");
      }
    },
    onError: (err) => {
      setError(err.message);
    },
  });

  const handleClassify = () => {
    setResult(null);
    setError(null);
    setAcceptedFields(new Set());
    classifyMutation.mutate({
      name: molecule.name,
      iupacName: molecule.iupacName || undefined,
      casNumber: molecule.casNumber || undefined,
      chemicalFormula: molecule.chemicalFormula || undefined,
      olfactiveProfile: molecule.olfactiveProfile || undefined,
      botanicalSources: molecule.botanicalSources || undefined,
    });
  };

  const handleAccept = (field: string, value: string) => {
    setAcceptedFields((prev) => new Set(Array.from(prev).concat(field)));
    switch (field) {
      case "chemicalClass":
        onAcceptChemicalClass?.(value);
        break;
      case "olfactiveFamily":
        onAcceptOlfactiveFamily?.(value);
        break;
      case "olfactiveProfile":
        onAcceptOlfactiveProfile?.(value);
        break;
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return "text-green-600 dark:text-green-400";
    if (confidence >= 60) return "text-yellow-600 dark:text-yellow-400";
    return "text-orange-600 dark:text-orange-400";
  };

  const getConfidenceLabel = (confidence: number) => {
    if (confidence >= 80) return "Haute confiance";
    if (confidence >= 60) return "Confiance moyenne";
    return "Faible confiance";
  };

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={handleClassify}
                disabled={classifyMutation.isPending}
                className="gap-1.5"
              >
                {classifyMutation.isPending ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Sparkles className="h-3.5 w-3.5" />
                )}
                IA
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Classification assistée par IA</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {result && (
          <div className="flex items-center gap-1.5">
            {!acceptedFields.has("chemicalClass") && (
              <Badge
                variant="outline"
                className={cn(
                  "cursor-pointer hover:opacity-80 transition-opacity",
                  CHEMICAL_CLASSES[result.chemicalClass]?.color
                )}
                onClick={() => handleAccept("chemicalClass", result.chemicalClass)}
              >
                <Beaker className="h-3 w-3 mr-1" />
                {CHEMICAL_CLASSES[result.chemicalClass]?.label || result.chemicalClass}
              </Badge>
            )}
            {!acceptedFields.has("olfactiveFamily") && (
              <Badge
                variant="outline"
                className={cn(
                  "cursor-pointer hover:opacity-80 transition-opacity",
                  OLFACTIVE_FAMILIES[result.olfactiveFamily]?.color
                )}
                onClick={() => handleAccept("olfactiveFamily", result.olfactiveFamily)}
              >
                {OLFACTIVE_FAMILIES[result.olfactiveFamily]?.emoji}{" "}
                {OLFACTIVE_FAMILIES[result.olfactiveFamily]?.label || result.olfactiveFamily}
              </Badge>
            )}
          </div>
        )}

        {error && (
          <span className="text-xs text-destructive flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            Erreur
          </span>
        )}
      </div>
    );
  }

  return (
    <Card className="border-dashed border-primary/30 bg-primary/5">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <Brain className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base">Classification IA</CardTitle>
              <CardDescription className="text-xs">
                Suggestions automatiques basées sur l'analyse de la molécule
              </CardDescription>
            </div>
          </div>
          <Button
            variant="default"
            size="sm"
            onClick={handleClassify}
            disabled={classifyMutation.isPending}
            className="gap-1.5"
          >
            {classifyMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Analyse...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Analyser
              </>
            )}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {error && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {result && (
          <div className="space-y-4">
            {/* Classe chimique */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Beaker className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Classe chimique</span>
                </div>
                <span className={cn("text-xs", getConfidenceColor(result.chemicalClassConfidence))}>
                  {getConfidenceLabel(result.chemicalClassConfidence)} ({result.chemicalClassConfidence}%)
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className={cn(
                    "text-sm py-1 px-3",
                    CHEMICAL_CLASSES[result.chemicalClass]?.color
                  )}
                >
                  {CHEMICAL_CLASSES[result.chemicalClass]?.label || result.chemicalClass}
                </Badge>
                
                {currentChemicalClass && currentChemicalClass !== result.chemicalClass && (
                  <span className="text-xs text-muted-foreground">
                    (actuel: {CHEMICAL_CLASSES[currentChemicalClass]?.label || currentChemicalClass})
                  </span>
                )}

                {!acceptedFields.has("chemicalClass") && onAcceptChemicalClass && (
                  <div className="flex gap-1 ml-auto">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2 text-green-600 hover:text-green-700 hover:bg-green-100"
                      onClick={() => handleAccept("chemicalClass", result.chemicalClass)}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                  </div>
                )}

                {acceptedFields.has("chemicalClass") && (
                  <Badge variant="outline" className="ml-auto bg-green-100 text-green-700 border-green-300">
                    <Check className="h-3 w-3 mr-1" />
                    Accepté
                  </Badge>
                )}
              </div>

              <Progress value={result.chemicalClassConfidence} className="h-1.5" />
              
              <p className="text-xs text-muted-foreground italic">
                {result.chemicalClassReasoning}
              </p>
            </div>

            {/* Famille olfactive */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Flower2 className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Famille olfactive</span>
                </div>
                <span className={cn("text-xs", getConfidenceColor(result.olfactiveFamilyConfidence))}>
                  {getConfidenceLabel(result.olfactiveFamilyConfidence)} ({result.olfactiveFamilyConfidence}%)
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className={cn(
                    "text-sm py-1 px-3",
                    OLFACTIVE_FAMILIES[result.olfactiveFamily]?.color
                  )}
                >
                  {OLFACTIVE_FAMILIES[result.olfactiveFamily]?.emoji}{" "}
                  {OLFACTIVE_FAMILIES[result.olfactiveFamily]?.label || result.olfactiveFamily}
                </Badge>
                
                {currentOlfactiveFamily && currentOlfactiveFamily !== result.olfactiveFamily && (
                  <span className="text-xs text-muted-foreground">
                    (actuel: {OLFACTIVE_FAMILIES[currentOlfactiveFamily]?.label || currentOlfactiveFamily})
                  </span>
                )}

                {!acceptedFields.has("olfactiveFamily") && onAcceptOlfactiveFamily && (
                  <div className="flex gap-1 ml-auto">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2 text-green-600 hover:text-green-700 hover:bg-green-100"
                      onClick={() => handleAccept("olfactiveFamily", result.olfactiveFamily)}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                  </div>
                )}

                {acceptedFields.has("olfactiveFamily") && (
                  <Badge variant="outline" className="ml-auto bg-green-100 text-green-700 border-green-300">
                    <Check className="h-3 w-3 mr-1" />
                    Accepté
                  </Badge>
                )}
              </div>

              <Progress value={result.olfactiveFamilyConfidence} className="h-1.5" />
              
              <p className="text-xs text-muted-foreground italic">
                {result.olfactiveFamilyReasoning}
              </p>
            </div>

            {/* Profil olfactif suggéré */}
            {result.suggestedOlfactiveProfile && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Profil olfactif suggéré</span>
                  {!acceptedFields.has("olfactiveProfile") && onAcceptOlfactiveProfile && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2 text-green-600 hover:text-green-700 hover:bg-green-100"
                      onClick={() => handleAccept("olfactiveProfile", result.suggestedOlfactiveProfile)}
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Utiliser
                    </Button>
                  )}
                  {acceptedFields.has("olfactiveProfile") && (
                    <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">
                      <Check className="h-3 w-3 mr-1" />
                      Accepté
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                  {result.suggestedOlfactiveProfile}
                </p>
              </div>
            )}

            {/* Notes additionnelles */}
            {result.additionalNotes && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Notes du chercheur IA</span>
                  {onAcceptResearcherNotes && (
                    <div className="flex gap-1">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-6 text-xs px-2 border-primary/40 text-primary hover:bg-primary/10"
                              onClick={() => onAcceptResearcherNotes(result.additionalNotes!, false)}
                            >
                              <Check className="h-3 w-3 mr-1" />
                              Remplacer
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-xs">Remplace les notes actuelles par celles de l'IA</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      {currentNotes && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-6 text-xs px-2 border-emerald-500/40 text-emerald-600 hover:bg-emerald-500/10"
                                onClick={() => onAcceptResearcherNotes(result.additionalNotes!, true)}
                              >
                                <Check className="h-3 w-3 mr-1" />
                                Ajouter
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="text-xs">Ajoute les notes IA à la suite des notes existantes</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                  )}
                </div>
                {/* Diff visuel si notes existantes */}
                {currentNotes && (
                  <div className="text-xs bg-muted/20 rounded-md p-2 border border-muted space-y-1">
                    <p className="text-muted-foreground font-medium">Actuellement :</p>
                    <p className="text-muted-foreground italic line-clamp-3">{currentNotes}</p>
                  </div>
                )}
                <p className="text-xs text-muted-foreground bg-muted/30 p-3 rounded-lg border-l-2 border-primary/30">
                  {result.additionalNotes}
                </p>
              </div>
            )}
          </div>
        )}

        {!result && !error && !classifyMutation.isPending && (
          <div className="text-center py-6 text-muted-foreground">
            <Sparkles className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">
              Cliquez sur "Analyser" pour obtenir des suggestions de classification
            </p>
            <p className="text-xs mt-1">
              L'IA analysera le nom, la formule et les propriétés de la molécule
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default AIClassificationSuggestion;
