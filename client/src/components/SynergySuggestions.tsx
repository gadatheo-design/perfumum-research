/**
 * SynergySuggestions Component
 * Affiche les suggestions de synergies moléculaires documentées pour le générateur de formules
 */

import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  Sparkles, 
  Link2, 
  ChevronDown, 
  ChevronUp, 
  Zap, 
  Shield, 
  RefreshCw, 
  Eye,
  Info,
  ArrowRight
} from "lucide-react";
import { Link } from "wouter";

interface SynergySuggestionsProps {
  selectedMoleculeIds: number[];
  onAddMolecule?: (moleculeId: number) => void;
  className?: string;
}

const SYNERGY_TYPE_CONFIG: Record<string, { label: string; color: string; icon: typeof Zap; description: string }> = {
  potentialisation: {
    label: "Potentialisation",
    color: "text-green-500 bg-green-500/10 border-green-500/30",
    icon: Zap,
    description: "Ces molécules amplifient mutuellement leurs effets olfactifs",
  },
  stabilisation: {
    label: "Stabilisation",
    color: "text-blue-500 bg-blue-500/10 border-blue-500/30",
    icon: Shield,
    description: "Ces molécules se stabilisent mutuellement dans le temps",
  },
  transformation: {
    label: "Transformation",
    color: "text-purple-500 bg-purple-500/10 border-purple-500/30",
    icon: RefreshCw,
    description: "Ces molécules créent ensemble de nouvelles notes olfactives",
  },
  masquage: {
    label: "Masquage",
    color: "text-amber-500 bg-amber-500/10 border-amber-500/30",
    icon: Eye,
    description: "Une molécule peut masquer ou atténuer l'autre",
  },
};

export function SynergySuggestions({ selectedMoleculeIds, onAddMolecule, className }: SynergySuggestionsProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showAllSuggestions, setShowAllSuggestions] = useState(false);

  // Charger les synergies pour toutes les molécules sélectionnées
  const { data: allSynergies, isLoading: loadingSynergies } = trpc.synergies.getAllForGenerator.useQuery();

  // Calculer les suggestions de synergies basées sur les molécules sélectionnées
  const synergySuggestions = (() => {
    if (!allSynergies || selectedMoleculeIds.length === 0) return [];

    const suggestions: Array<{
      moleculeId: number;
      moleculeName: string;
      synergyType: string;
      compatibilityScore: number;
      description: string;
      partnerMoleculeId: number;
      partnerMoleculeName: string;
      source: 'terpene' | 'molecule';
    }> = [];

    // Parcourir les synergies de terpènes
    allSynergies.terpeneSynergies?.forEach((syn: any) => {
      const isPartner1Selected = selectedMoleculeIds.includes(syn.terpene1Id);
      const isPartner2Selected = selectedMoleculeIds.includes(syn.terpene2Id);

      if (isPartner1Selected && !isPartner2Selected) {
        suggestions.push({
          moleculeId: syn.terpene2Id,
          moleculeName: syn.terpene2Name || `Molécule #${syn.terpene2Id}`,
          synergyType: syn.synergyType || 'potentialisation',
          compatibilityScore: syn.compatibilityScore || 70,
          description: syn.synergyNotes || 'Synergie documentée',
          partnerMoleculeId: syn.terpene1Id,
          partnerMoleculeName: syn.terpene1Name || `Molécule #${syn.terpene1Id}`,
          source: 'terpene',
        });
      } else if (isPartner2Selected && !isPartner1Selected) {
        suggestions.push({
          moleculeId: syn.terpene1Id,
          moleculeName: syn.terpene1Name || `Molécule #${syn.terpene1Id}`,
          synergyType: syn.synergyType || 'potentialisation',
          compatibilityScore: syn.compatibilityScore || 70,
          description: syn.synergyNotes || 'Synergie documentée',
          partnerMoleculeId: syn.terpene2Id,
          partnerMoleculeName: syn.terpene2Name || `Molécule #${syn.terpene2Id}`,
          source: 'terpene',
        });
      }
    });

    // Parcourir les synergies de molécules
    allSynergies.moleculeSynergies?.forEach((syn: any) => {
      const isPartner1Selected = selectedMoleculeIds.includes(syn.molecule1Id);
      const isPartner2Selected = selectedMoleculeIds.includes(syn.molecule2Id);

      if (isPartner1Selected && !isPartner2Selected) {
        suggestions.push({
          moleculeId: syn.molecule2Id,
          moleculeName: syn.molecule2Name || `Molécule #${syn.molecule2Id}`,
          synergyType: syn.type || 'potentialisation',
          compatibilityScore: 80,
          description: syn.description || 'Synergie moléculaire documentée',
          partnerMoleculeId: syn.molecule1Id,
          partnerMoleculeName: syn.molecule1Name || `Molécule #${syn.molecule1Id}`,
          source: 'molecule',
        });
      } else if (isPartner2Selected && !isPartner1Selected) {
        suggestions.push({
          moleculeId: syn.molecule1Id,
          moleculeName: syn.molecule1Name || `Molécule #${syn.molecule1Id}`,
          synergyType: syn.type || 'potentialisation',
          compatibilityScore: 80,
          description: syn.description || 'Synergie moléculaire documentée',
          partnerMoleculeId: syn.molecule2Id,
          partnerMoleculeName: syn.molecule2Name || `Molécule #${syn.molecule2Id}`,
          source: 'molecule',
        });
      }
    });

    // Dédupliquer et trier par score de compatibilité
    const uniqueSuggestions = suggestions.reduce((acc, curr) => {
      const existing = acc.find(s => s.moleculeId === curr.moleculeId);
      if (!existing || existing.compatibilityScore < curr.compatibilityScore) {
        return [...acc.filter(s => s.moleculeId !== curr.moleculeId), curr];
      }
      return acc;
    }, [] as typeof suggestions);

    return uniqueSuggestions.sort((a, b) => b.compatibilityScore - a.compatibilityScore);
  })();

  const displayedSuggestions = showAllSuggestions ? synergySuggestions : synergySuggestions.slice(0, 5);

  if (selectedMoleculeIds.length === 0) {
    return null;
  }

  return (
    <Card className={`border-primary/20 bg-primary/5 ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-primary/10 rounded-lg">
              <Link2 className="h-4 w-4 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base">Synergies Documentées</CardTitle>
              <CardDescription className="text-xs">
                Suggestions basées sur les synergies moléculaires de la base de données
              </CardDescription>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="pt-0">
          {loadingSynergies ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : synergySuggestions.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              <Info className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Aucune synergie documentée trouvée</p>
              <p className="text-xs mt-1">Ajoutez des molécules pour voir les suggestions</p>
            </div>
          ) : (
            <div className="space-y-3">
              {displayedSuggestions.map((suggestion, index) => {
                const typeConfig = SYNERGY_TYPE_CONFIG[suggestion.synergyType] || SYNERGY_TYPE_CONFIG.potentialisation;
                const TypeIcon = typeConfig.icon;

                return (
                  <div
                    key={`${suggestion.moleculeId}-${suggestion.partnerMoleculeId}`}
                    className="group p-3 rounded-lg bg-background border border-border/50 hover:border-primary/30 hover:shadow-sm transition-all"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Link href={`/molecules/${suggestion.moleculeId}`}>
                            <span className="font-medium text-sm hover:text-primary transition-colors cursor-pointer">
                              {suggestion.moleculeName}
                            </span>
                          </Link>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <Badge variant="outline" className={`text-xs ${typeConfig.color}`}>
                                  <TypeIcon className="h-3 w-3 mr-1" />
                                  {typeConfig.label}
                                </Badge>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="text-xs max-w-xs">{typeConfig.description}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {suggestion.description}
                        </p>
                        <div className="flex items-center gap-1 mt-1.5 text-xs text-muted-foreground">
                          <span>Synergie avec</span>
                          <Link href={`/molecules/${suggestion.partnerMoleculeId}`}>
                            <span className="text-primary hover:underline cursor-pointer">
                              {suggestion.partnerMoleculeName}
                            </span>
                          </Link>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <div className="text-right">
                          <span className="text-lg font-bold text-primary">
                            {suggestion.compatibilityScore}%
                          </span>
                        </div>
                        {onAddMolecule && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 px-2 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => onAddMolecule(suggestion.moleculeId)}
                          >
                            <ArrowRight className="h-3 w-3 mr-1" />
                            Ajouter
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {synergySuggestions.length > 5 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full"
                  onClick={() => setShowAllSuggestions(!showAllSuggestions)}
                >
                  {showAllSuggestions ? (
                    <>
                      <ChevronUp className="h-4 w-4 mr-2" />
                      Voir moins
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-4 w-4 mr-2" />
                      Voir {synergySuggestions.length - 5} autres suggestions
                    </>
                  )}
                </Button>
              )}
            </div>
          )}

          {/* Info sur les synergies */}
          <div className="mt-4 pt-3 border-t border-border/50">
            <div className="flex items-start gap-2 text-xs text-muted-foreground">
              <Sparkles className="h-4 w-4 flex-shrink-0 mt-0.5" />
              <p>
                Ces suggestions sont basées sur les synergies moléculaires documentées dans la base de données PERFUMUM.
                Elles indiquent des combinaisons qui ont été étudiées et validées.
              </p>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}

export default SynergySuggestions;
