import React from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { FlaskConical, Leaf, ExternalLink, Loader2, Wind, Shield } from "lucide-react";

interface DominantMoleculeBadgeProps {
  moleculeName: string;
  currentPlantId?: number;
  variant?: "default" | "secondary" | "outline";
  size?: "sm" | "md";
  interactive?: boolean;
}

export function DominantMoleculeBadge({
  moleculeName,
  currentPlantId,
  variant = "secondary",
  size = "md",
  interactive = true,
}: DominantMoleculeBadgeProps) {
  const [open, setOpen] = React.useState(false);

  const { data: moleculeData, isLoading } = trpc.molecules.getByName.useQuery(
    { name: moleculeName },
    { enabled: open && interactive }
  );

  const { data: plantsWithMolecule, isLoading: isLoadingPlants } =
    trpc.plants.getByDominantMolecule.useQuery(
      { moleculeName, excludePlantId: currentPlantId },
      { enabled: open && interactive }
    );

  const badgeClasses =
    size === "sm"
      ? "text-xs px-2 py-0.5 cursor-pointer hover:opacity-80 transition-opacity"
      : "text-sm px-3 py-1 cursor-pointer hover:opacity-80 transition-opacity";

  if (!interactive) {
    return (
      <Badge variant={variant} className={badgeClasses}>
        {moleculeName}
      </Badge>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Badge
          variant={variant}
          className={`${badgeClasses} select-none`}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") setOpen(true);
          }}
        >
          <FlaskConical className="h-3 w-3 mr-1 inline-block opacity-60" />
          {moleculeName}
        </Badge>
      </PopoverTrigger>

      <PopoverContent className="w-80 p-0 shadow-lg" side="bottom" align="start">
        {/* En-tête */}
        <div className="p-4 pb-3 bg-muted/40 rounded-t-md">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-semibold text-sm leading-tight">{moleculeName}</h3>
              {moleculeData?.chemicalFormula && (
                <p className="text-xs text-muted-foreground mt-0.5 font-mono">
                  {moleculeData.chemicalFormula}
                </p>
              )}
            </div>
            {isLoading && (
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground shrink-0 mt-0.5" />
            )}
          </div>

          {moleculeData && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {moleculeData.family && (
                <Badge variant="outline" className="text-xs">
                  {moleculeData.family}
                </Badge>
              )}
              {moleculeData.olfactiveProfile && (
                <Badge
                  variant="outline"
                  className="text-xs bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-950/30 dark:border-amber-800 dark:text-amber-400"
                >
                  <Wind className="h-2.5 w-2.5 mr-1" />
                  {moleculeData.olfactiveProfile.length > 40
                    ? moleculeData.olfactiveProfile.substring(0, 40) + "…"
                    : moleculeData.olfactiveProfile}
                </Badge>
              )}
            </div>
          )}
        </div>

        <div className="p-4 space-y-3">
          {moleculeData?.therapeuticProperties && (
            <div>
              <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5 flex items-center gap-1">
                <Shield className="h-3 w-3" />
                Propriétés
              </h4>
              <p className="text-xs leading-relaxed text-foreground/80">
                {moleculeData.therapeuticProperties.length > 180
                  ? moleculeData.therapeuticProperties.substring(0, 180) + "…"
                  : moleculeData.therapeuticProperties}
              </p>
            </div>
          )}

          <div>
            <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5 flex items-center gap-1">
              <Leaf className="h-3 w-3" />
              Autres plantes
              {plantsWithMolecule && plantsWithMolecule.length > 0 && (
                <span className="ml-1 text-muted-foreground/60">
                  ({plantsWithMolecule.length})
                </span>
              )}
            </h4>

            {isLoadingPlants ? (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Loader2 className="h-3 w-3 animate-spin" />
                Chargement…
              </div>
            ) : plantsWithMolecule && plantsWithMolecule.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {plantsWithMolecule.slice(0, 8).map((plant: any) => (
                  <Link key={plant.id} href={`/plantes/${plant.id}`}>
                    <Badge
                      variant="outline"
                      className="text-xs cursor-pointer hover:bg-primary/10 hover:border-primary/50 transition-colors"
                      onClick={() => setOpen(false)}
                    >
                      {plant.name}
                    </Badge>
                  </Link>
                ))}
                {plantsWithMolecule.length > 8 && (
                  <Badge variant="outline" className="text-xs text-muted-foreground">
                    +{plantsWithMolecule.length - 8} autres
                  </Badge>
                )}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground italic">
                Aucune autre plante répertoriée
              </p>
            )}
          </div>

          {moleculeData?.id && (
            <>
              <Separator />
              <Link href={`/molecules/${moleculeData.id}`}>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-xs h-7"
                  onClick={() => setOpen(false)}
                >
                  <ExternalLink className="h-3 w-3 mr-1.5" />
                  Voir la fiche complète
                </Button>
              </Link>
            </>
          )}

          <Link href={`/plantes/par-molecule?q=${encodeURIComponent(moleculeName)}`}>
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-xs h-7 text-muted-foreground hover:text-foreground"
              onClick={() => setOpen(false)}
            >
              <Leaf className="h-3 w-3 mr-1.5" />
              Filtrer les plantes par cette molécule
            </Button>
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export function DominantMoleculeBadgeList({
  molecules,
  currentPlantId,
  maxVisible = 10,
  size = "md",
}: {
  molecules: string[] | null | undefined;
  currentPlantId?: number;
  maxVisible?: number;
  size?: "sm" | "md";
}) {
  const [showAll, setShowAll] = React.useState(false);

  if (!molecules || molecules.length === 0) {
    return (
      <p className="text-sm text-muted-foreground italic">
        Aucune molécule dominante répertoriée
      </p>
    );
  }

  const visible = showAll ? molecules : molecules.slice(0, maxVisible);
  const hidden = molecules.length - maxVisible;

  return (
    <div className="flex flex-wrap gap-2">
      {visible.map((mol, idx) => (
        <DominantMoleculeBadge
          key={idx}
          moleculeName={mol}
          currentPlantId={currentPlantId}
          size={size}
        />
      ))}
      {!showAll && hidden > 0 && (
        <button
          onClick={() => setShowAll(true)}
          className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-2 transition-colors"
        >
          +{hidden} autres
        </button>
      )}
    </div>
  );
}
