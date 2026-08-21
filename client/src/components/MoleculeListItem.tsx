import { PrefetchLink } from "@/components/PrefetchLink";
import { Badge } from "@/components/ui/badge";
import { Check, Beaker, Droplets, Zap, FlaskConical, ChevronRight, ShieldCheck, Clock, FileText, XCircle } from "lucide-react";
import { GammeBadge, type GammeType } from "@/components/GammeBadge";
import { getGammeFromOlfactiveProfile } from "@/lib/gammeMapping";
import { FavoriteButton } from "@/components/FavoriteButton";
import { cn, normalizeOlfactiveProfile } from "@/lib/utils";

interface MoleculeListItemProps {
  molecule: {
    id: number;
    name: string;
    chemicalFormula: string | null;
    family: string | null;
    olfactiveProfile: string | null;
    concentration: string | null;
    molecularWeight: number | null;
    boilingPoint: number | null;
    volatility: string | number | null;
    intensity: number | null;
    radarIntensity: number | null;
    radarFreshness: number | null;
    radarWarmth: number | null;
    radarSweetness: number | null;
    radarSpiciness: number | null;
    radarEarthiness: number | null;
    pubchemCid?: number | null;
    chebiId?: string | null;
    validationStatus?: string | null;
  };
  isSelected: boolean;
  onToggleSelection: (id: number) => void;
  onTrackEvent?: () => void;
}

// Mini indicateur d'intensité
function IntensityIndicator({ value }: { value: number }) {
  const normalizedValue = value > 10 ? Math.round(value / 10) : value;
  const percentage = normalizedValue * 10;
  
  return (
    <div className="flex items-center gap-2 w-24">
      <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-primary/60 to-primary rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="text-xs font-medium tabular-nums w-6">{normalizedValue}</span>
    </div>
  );
}

export function MoleculeListItem({ 
  molecule, 
  isSelected, 
  onToggleSelection,
  onTrackEvent 
}: MoleculeListItemProps) {
  const gamme = getGammeFromOlfactiveProfile(molecule.olfactiveProfile);
  
  return (
    <PrefetchLink 
      to={`/molecule/${molecule.id}`}
      prefetchType="molecule"
      prefetchId={molecule.id}
      className="block group"
    >
      <div className={cn(
        "flex items-center gap-4 p-4 bg-card border border-border/50 rounded-lg transition-all duration-300",
        "hover:bg-muted/50 hover:border-primary/30 hover:shadow-md hover:shadow-primary/5",
        "hover:-translate-y-0.5",
        isSelected && "ring-2 ring-primary bg-primary/5"
      )}>
        {/* Selection checkbox with animation */}
        <div 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggleSelection(molecule.id);
          }}
          className={cn(
            "w-5 h-5 rounded border-2 flex items-center justify-center cursor-pointer transition-all duration-200 shrink-0",
            isSelected
              ? "bg-primary border-primary scale-110"
              : "border-muted-foreground/40 hover:border-primary hover:scale-105"
          )}
        >
          {isSelected && <Check className="h-3 w-3 text-primary-foreground animate-scaleIn" />}
        </div>
        
        {/* Main info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors duration-200">
              {molecule.name}
            </h3>
            {gamme && <GammeBadge gamme={gamme} size="sm" showIcon={false} />}
            {molecule.family && (
              <Badge variant="outline" className="shrink-0 text-xs font-medium">
                {molecule.family}
              </Badge>
            )}
            {/* Indicateurs de source d'enrichissement */}
            {molecule.pubchemCid && (
              <Badge variant="outline" className="shrink-0 text-xs bg-green-50 text-green-700 border-green-200 dark:bg-green-950/50 dark:text-green-400 dark:border-green-800">
                PubChem
              </Badge>
            )}
            {molecule.chebiId && !molecule.pubchemCid && (
              <Badge variant="outline" className="shrink-0 text-xs bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/50 dark:text-blue-400 dark:border-blue-800">
                ChEBI
              </Badge>
            )}
            {/* Validation status badge */}
            {molecule.validationStatus === "brouillon" && (
              <Badge variant="outline" className="shrink-0 text-xs bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-400 dark:border-amber-800" title="Brouillon">
                <FileText className="h-2.5 w-2.5 mr-1" />
                Brouillon
              </Badge>
            )}
            {molecule.validationStatus === "en_revision" && (
              <Badge variant="outline" className="shrink-0 text-xs bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/50 dark:text-blue-400 dark:border-blue-800" title="En révision">
                <Clock className="h-2.5 w-2.5 mr-1" />
                Révision
              </Badge>
            )}
            {molecule.validationStatus === "rejete" && (
              <Badge variant="outline" className="shrink-0 text-xs bg-red-50 text-red-700 border-red-200 dark:bg-red-950/50 dark:text-red-400 dark:border-red-800" title="Rejeté">
                <XCircle className="h-2.5 w-2.5 mr-1" />
                Rejeté
              </Badge>
            )}
          </div>
          <p className="text-sm font-mono text-muted-foreground truncate">
            {molecule.chemicalFormula || "Formule non disponible"}
          </p>
        </div>
        
        {/* Properties - hidden on mobile, visible on larger screens */}
        <div className="hidden md:flex items-center gap-6 text-xs text-muted-foreground shrink-0">
          {molecule.molecularWeight && (
            <div className="flex items-center gap-1.5 w-24 group/prop">
              <Beaker className="h-3.5 w-3.5 group-hover/prop:text-primary transition-colors" />
              <span className="tabular-nums">{molecule.molecularWeight} g/mol</span>
            </div>
          )}
          {molecule.boilingPoint && (
            <div className="flex items-center gap-1.5 w-20 group/prop">
              <FlaskConical className="h-3.5 w-3.5 group-hover/prop:text-primary transition-colors" />
              <span className="tabular-nums">{molecule.boilingPoint}°C</span>
            </div>
          )}
          {molecule.volatility && (
            <div className="flex items-center gap-1.5 w-24 group/prop">
              <Droplets className="h-3.5 w-3.5 group-hover/prop:text-primary transition-colors" />
              <span className="truncate">{molecule.volatility}</span>
            </div>
          )}
          {molecule.intensity !== null && molecule.intensity !== undefined && (
            <div className="flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5 text-amber-500" />
              <IntensityIndicator value={molecule.intensity} />
            </div>
          )}
        </div>
        
        {/* Olfactive profile - truncated */}
        <div className="hidden lg:block w-48 shrink-0">
          {normalizeOlfactiveProfile(molecule.olfactiveProfile) && (
            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
              {normalizeOlfactiveProfile(molecule.olfactiveProfile)}
            </p>
          )}
        </div>
        
        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Favorite button */}
          <div onClick={(e) => e.preventDefault()}>
            <FavoriteButton page={{ id: String(molecule.id), title: molecule.name || '', href: `/molecules/${molecule.id}` }} variant="ghost" />
          </div>
          
          {/* Arrow indicator */}
          <ChevronRight className="h-4 w-4 text-muted-foreground/50 group-hover:text-primary group-hover:translate-x-0.5 transition-all duration-200" />
        </div>
      </div>
    </PrefetchLink>
  );
}
