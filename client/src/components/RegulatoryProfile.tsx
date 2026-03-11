import { Shield, AlertTriangle, ExternalLink, CheckCircle, XCircle, AlertCircle, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Link } from "wouter";

// Types
interface IfraRestriction {
  id: number;
  moleculeId: number;
  ifraAmendment?: string | null;
  effectiveDate?: Date | null;
  restrictionType?: "prohibited" | "restricted" | "specification" | "no_restriction" | null;
  reasonForRestriction?: string | null;
  alternativeSuggestions?: string | null;
  notes?: string | null;
  sourceUrl?: string | null;
  category1?: string | null;
  category2?: string | null;
  category3?: string | null;
  category4?: string | null;
  category5a?: string | null;
  category5b?: string | null;
  category5c?: string | null;
  category5d?: string | null;
  category6?: string | null;
  category7a?: string | null;
  category7b?: string | null;
  category8?: string | null;
  category9?: string | null;
  category10a?: string | null;
  category10b?: string | null;
  category11a?: string | null;
  category11b?: string | null;
}

interface RegulatoryProfileProps {
  restrictions: IfraRestriction[];
  moleculeName?: string;
  compact?: boolean;
  showLink?: boolean;
  moleculeId?: number;
}

// Mapping des types de restriction IFRA
const restrictionTypeConfig: Record<string, { label: string; color: string; bgColor: string; icon: typeof Shield }> = {
  prohibited: { 
    label: "Interdit", 
    color: "text-red-600 dark:text-red-400",
    bgColor: "bg-red-100 dark:bg-red-950/50 border-red-200 dark:border-red-800",
    icon: XCircle 
  },
  restricted: { 
    label: "Restreint", 
    color: "text-orange-600 dark:text-orange-400",
    bgColor: "bg-orange-100 dark:bg-orange-950/50 border-orange-200 dark:border-orange-800",
    icon: AlertTriangle 
  },
  specification: { 
    label: "Spécification", 
    color: "text-yellow-600 dark:text-yellow-400",
    bgColor: "bg-yellow-100 dark:bg-yellow-950/50 border-yellow-200 dark:border-yellow-800",
    icon: AlertCircle 
  },
  no_restriction: { 
    label: "Sans restriction", 
    color: "text-green-600 dark:text-green-400",
    bgColor: "bg-green-100 dark:bg-green-950/50 border-green-200 dark:border-green-800",
    icon: CheckCircle 
  },
};

// Catégories IFRA avec descriptions courtes
const ifraCategoryLabels: Record<string, { short: string; full: string }> = {
  category1: { short: "Cat. 1", full: "Produits à appliquer sur les lèvres" },
  category2: { short: "Cat. 2", full: "Déodorants/antiperspirants" },
  category3: { short: "Cat. 3", full: "Produits pour les yeux" },
  category4: { short: "Cat. 4", full: "Parfums fins" },
  category5a: { short: "Cat. 5A", full: "Produits corporels (application large)" },
  category5b: { short: "Cat. 5B", full: "Produits corporels (application localisée)" },
  category5c: { short: "Cat. 5C", full: "Produits pour les pieds" },
  category5d: { short: "Cat. 5D", full: "Produits intimes" },
  category6: { short: "Cat. 6", full: "Produits buccaux" },
  category7a: { short: "Cat. 7A", full: "Produits capillaires (rinçage)" },
  category7b: { short: "Cat. 7B", full: "Produits capillaires (sans rinçage)" },
  category8: { short: "Cat. 8", full: "Produits pour bébés" },
  category9: { short: "Cat. 9", full: "Produits ménagers" },
  category10a: { short: "Cat. 10A", full: "Détergents (contact direct)" },
  category10b: { short: "Cat. 10B", full: "Détergents (contact indirect)" },
  category11a: { short: "Cat. 11A", full: "Bougies/diffuseurs (intérieur)" },
  category11b: { short: "Cat. 11B", full: "Bougies/diffuseurs (extérieur)" },
};

/**
 * Composant RegulatoryProfile
 * 
 * Affiche le profil réglementaire IFRA d'une molécule de manière claire et visuelle.
 * Peut être utilisé en mode compact (badge + résumé) ou complet (toutes les catégories).
 */
export function RegulatoryProfile({ 
  restrictions, 
  moleculeName, 
  compact = false,
  showLink = true,
  moleculeId
}: RegulatoryProfileProps) {
  if (!restrictions || restrictions.length === 0) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Shield className="h-4 w-4" />
        <span>Aucune restriction IFRA documentée</span>
      </div>
    );
  }

  const primaryRestriction = restrictions[0];
  const config = primaryRestriction.restrictionType 
    ? restrictionTypeConfig[primaryRestriction.restrictionType] 
    : restrictionTypeConfig.no_restriction;
  const IconComponent = config.icon;

  // Mode compact : juste un badge avec tooltip
  if (compact) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md border ${config.bgColor} cursor-help`}>
              <IconComponent className={`h-3.5 w-3.5 ${config.color}`} />
              <span className={`text-xs font-medium ${config.color}`}>
                IFRA: {config.label}
              </span>
            </div>
          </TooltipTrigger>
          <TooltipContent className="max-w-xs">
            <div className="space-y-1">
              <p className="font-medium">{moleculeName || "Molécule"}</p>
              <p className="text-sm">{primaryRestriction.reasonForRestriction || "Voir les détails pour plus d'informations"}</p>
              {primaryRestriction.ifraAmendment && (
                <p className="text-xs text-muted-foreground">Amendement {primaryRestriction.ifraAmendment}</p>
              )}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  // Mode complet : affichage détaillé
  return (
    <div className={`rounded-lg border p-4 ${config.bgColor}`}>
      {/* En-tête */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <IconComponent className={`h-5 w-5 ${config.color}`} />
          <div>
            <h4 className={`font-semibold ${config.color}`}>
              Profil Réglementaire IFRA
            </h4>
            {primaryRestriction.ifraAmendment && (
              <p className="text-xs text-muted-foreground">
                {primaryRestriction.ifraAmendment} Amendment
              </p>
            )}
          </div>
        </div>
        <Badge variant="outline" className={config.color}>
          {config.label}
        </Badge>
      </div>

      {/* Raison de la restriction */}
      {primaryRestriction.reasonForRestriction && (
        <div className="mb-3 p-2 bg-background/50 rounded text-sm">
          <p className="text-muted-foreground">{primaryRestriction.reasonForRestriction}</p>
        </div>
      )}

      {/* Limites par catégorie (si restriction ou spécification) */}
      {(primaryRestriction.restrictionType === "restricted" || primaryRestriction.restrictionType === "specification") && (
        <div className="mb-3">
          <p className="text-xs font-medium text-muted-foreground mb-2">Limites de concentration (%)</p>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-1">
            {Object.entries(ifraCategoryLabels).map(([key, labels]) => {
              const value = primaryRestriction[key as keyof IfraRestriction];
              if (!value) return null;
              
              return (
                <TooltipProvider key={key}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="bg-background/70 px-2 py-1 rounded text-center cursor-help">
                        <p className="text-[10px] text-muted-foreground">{labels.short}</p>
                        <p className="text-xs font-mono font-semibold">{String(value)}%</p>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{labels.full}</p>
                      <p className="text-xs text-muted-foreground">Limite: {String(value)}%</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              );
            })}
          </div>
        </div>
      )}

      {/* Alternatives suggérées */}
      {primaryRestriction.alternativeSuggestions && (
        <div className="mb-3 p-2 bg-green-50 dark:bg-green-950/30 rounded text-sm border border-green-200 dark:border-green-800">
          <p className="text-xs font-medium text-green-700 dark:text-green-300 mb-1">Alternatives suggérées</p>
          <p className="text-green-600 dark:text-green-400">{primaryRestriction.alternativeSuggestions}</p>
        </div>
      )}

      {/* Notes */}
      {primaryRestriction.notes && (
        <div className="mb-3 flex items-start gap-2 text-sm">
          <Info className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
          <p className="text-muted-foreground">{primaryRestriction.notes}</p>
        </div>
      )}

      {/* Liens */}
      <div className="flex flex-wrap items-center gap-3 text-xs">
        {primaryRestriction.sourceUrl && (
          <a 
            href={primaryRestriction.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline flex items-center gap-1"
          >
            Source IFRA <ExternalLink className="h-3 w-3" />
          </a>
        )}
        {showLink && moleculeId && (
          <Link 
            href={`/molecule/${moleculeId}`}
            className="text-primary hover:underline flex items-center gap-1"
          >
            Voir la fiche complète <ExternalLink className="h-3 w-3" />
          </Link>
        )}
        <Link 
          href="/ifra"
          className="text-primary hover:underline flex items-center gap-1"
        >
          Consulter toutes les restrictions IFRA <ExternalLink className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
}

/**
 * Composant RegulatoryBadge
 * 
 * Badge compact pour afficher le statut IFRA d'une molécule.
 * Idéal pour les listes et tableaux.
 */
export function RegulatoryBadge({ 
  restrictionType 
}: { 
  restrictionType?: "prohibited" | "restricted" | "specification" | "no_restriction" | null 
}) {
  if (!restrictionType) return null;
  
  const config = restrictionTypeConfig[restrictionType];
  const IconComponent = config.icon;
  
  return (
    <Badge variant="outline" className={`${config.color} gap-1`}>
      <IconComponent className="h-3 w-3" />
      {config.label}
    </Badge>
  );
}

/**
 * Composant RegulatoryAlert
 * 
 * Alerte visuelle pour les molécules à restriction importante.
 * À utiliser dans les formulaires de création de recettes.
 */
export function RegulatoryAlert({ 
  restrictions,
  moleculeName,
  concentration
}: { 
  restrictions: IfraRestriction[];
  moleculeName: string;
  concentration?: number;
}) {
  if (!restrictions || restrictions.length === 0) return null;
  
  const primaryRestriction = restrictions[0];
  
  // Pas d'alerte pour les molécules sans restriction
  if (primaryRestriction.restrictionType === "no_restriction") return null;
  
  const config = restrictionTypeConfig[primaryRestriction.restrictionType || "specification"];
  const IconComponent = config.icon;
  
  // Vérifier si la concentration dépasse une limite
  let exceedsLimit = false;
  let limitCategory = "";
  let limitValue = 0;
  
  if (concentration && primaryRestriction.category4) {
    const cat4Limit = parseFloat(primaryRestriction.category4);
    if (concentration > cat4Limit) {
      exceedsLimit = true;
      limitCategory = "Parfums fins (Cat. 4)";
      limitValue = cat4Limit;
    }
  }
  
  return (
    <div className={`rounded-lg border p-3 ${config.bgColor}`}>
      <div className="flex items-start gap-2">
        <IconComponent className={`h-5 w-5 ${config.color} mt-0.5 shrink-0`} />
        <div className="flex-1">
          <p className={`font-medium ${config.color}`}>
            {moleculeName} - {config.label}
          </p>
          {primaryRestriction.reasonForRestriction && (
            <p className="text-sm text-muted-foreground mt-1">
              {primaryRestriction.reasonForRestriction}
            </p>
          )}
          {exceedsLimit && (
            <p className="text-sm text-red-600 dark:text-red-400 font-medium mt-2">
              ⚠️ Concentration ({concentration}%) dépasse la limite {limitCategory} ({limitValue}%)
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default RegulatoryProfile;
