/**
 * ContributeButton — Bouton universel de contribution
 * Peut être utilisé dans n'importe quelle fiche (plante, molécule, terroir, recette)
 * pour ouvrir un modal de contribution contextuel.
 */
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { PlantContributionModal } from "./PlantContributionModal";
import { MoleculeContributionModal } from "./MoleculeContributionModal";
import { TerroirContributionModal } from "./TerroirContributionModal";
import { RecipeContributionModal } from "./RecipeContributionModal";

type EntityType = "plant" | "molecule" | "terroir" | "recipe";

type ContributeButtonProps = {
  entityType: EntityType;
  entityId: number;
  entityName?: string;
  /** Type de contribution pré-sélectionné (optionnel) */
  defaultType?: string;
  /** Variante du bouton */
  variant?: "default" | "outline" | "ghost" | "secondary";
  size?: "sm" | "default" | "lg" | "icon";
  className?: string;
  label?: string;
};

export function ContributeButton({
  entityType,
  entityId,
  entityName,
  defaultType,
  variant = "outline",
  size = "sm",
  className = "",
  label = "Contribuer",
}: ContributeButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant={variant}
        size={size}
        className={`gap-1.5 ${className}`}
        onClick={() => setOpen(true)}
      >
        <PlusCircle className="w-3.5 h-3.5" />
        {label}
      </Button>

      {entityType === "plant" && (
        <PlantContributionModal
          open={open}
          onClose={() => setOpen(false)}
          plantId={entityId}
          plantName={entityName || ""}
          defaultType={defaultType as any}
        />
      )}
      {entityType === "molecule" && (
        <MoleculeContributionModal
          open={open}
          onClose={() => setOpen(false)}
          moleculeId={entityId}
          moleculeName={entityName || ""}
          defaultType={defaultType as any}
        />
      )}
      {entityType === "terroir" && (
        <TerroirContributionModal
          open={open}
          onClose={() => setOpen(false)}
          terroirId={entityId}
          terroirName={entityName || ""}
          defaultType={defaultType as any}
        />
      )}
      {entityType === "recipe" && (
        <RecipeContributionModal
          open={open}
          onClose={() => setOpen(false)}
          recipeId={entityId}
          recipeName={entityName || ""}
          defaultType={defaultType as any}
        />
      )}
    </>
  );
}
