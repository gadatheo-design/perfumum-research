import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Check, Beaker, Droplets, Zap, FlaskConical } from "lucide-react";
import { GammeBadge, type GammeType } from "@/components/GammeBadge";
import { getGammeFromOlfactiveProfile } from "@/lib/gammeMapping";
import { FavoriteButton } from "@/components/FavoriteButton";
import { cn } from "@/lib/utils";

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
  };
  isSelected: boolean;
  onToggleSelection: (id: number) => void;
  onTrackEvent?: () => void;
}

export function MoleculeListItem({ 
  molecule, 
  isSelected, 
  onToggleSelection,
  onTrackEvent 
}: MoleculeListItemProps) {
  const gamme = getGammeFromOlfactiveProfile(molecule.olfactiveProfile);
  
  return (
    <Link 
      href={`/molecule/${molecule.id}`}
      onClick={onTrackEvent}
      className="block"
    >
      <div className={cn(
        "flex items-center gap-4 p-4 bg-card border rounded-lg hover:bg-muted/50 transition-colors",
        isSelected && "ring-2 ring-primary"
      )}>
        {/* Selection checkbox */}
        <div 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggleSelection(molecule.id);
          }}
          className={cn(
            "w-5 h-5 rounded border-2 flex items-center justify-center cursor-pointer transition-colors shrink-0",
            isSelected
              ? "bg-primary border-primary"
              : "border-muted-foreground/40 hover:border-primary"
          )}
        >
          {isSelected && <Check className="h-3 w-3 text-primary-foreground" />}
        </div>
        
        {/* Main info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-foreground truncate hover:text-primary transition-colors">
              {molecule.name}
            </h3>
            {gamme && <GammeBadge gamme={gamme} size="sm" showIcon={false} />}
            {molecule.family && (
              <Badge variant="outline" className="shrink-0 text-xs">
                {molecule.family}
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
            <div className="flex items-center gap-1.5 w-20">
              <Beaker className="h-3.5 w-3.5" />
              <span>{molecule.molecularWeight} g/mol</span>
            </div>
          )}
          {molecule.boilingPoint && (
            <div className="flex items-center gap-1.5 w-16">
              <FlaskConical className="h-3.5 w-3.5" />
              <span>{molecule.boilingPoint}°C</span>
            </div>
          )}
          {molecule.volatility && (
            <div className="flex items-center gap-1.5 w-20">
              <Droplets className="h-3.5 w-3.5" />
              <span className="truncate">{molecule.volatility}</span>
            </div>
          )}
          {molecule.intensity !== null && molecule.intensity !== undefined && (
            <div className="flex items-center gap-1.5 w-20">
              <Zap className="h-3.5 w-3.5" />
              <span>
                Intensité {molecule.intensity > 10 ? Math.round(molecule.intensity / 10) : molecule.intensity}/10
              </span>
            </div>
          )}
        </div>
        
        {/* Olfactive profile - truncated */}
        <div className="hidden lg:block w-48 shrink-0">
          {molecule.olfactiveProfile && (
            <p className="text-xs text-muted-foreground line-clamp-2">
              {molecule.olfactiveProfile}
            </p>
          )}
        </div>
        
        {/* Favorite button */}
        <div onClick={(e) => e.preventDefault()} className="shrink-0">
          <FavoriteButton moleculeId={molecule.id} moleculeName={molecule.name} variant="icon" />
        </div>
      </div>
    </Link>
  );
}
