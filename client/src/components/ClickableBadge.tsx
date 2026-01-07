import { Link } from "wouter";
import { Badge, badgeVariants } from "@/components/ui/badge";
import { VariantProps } from "class-variance-authority";

type BadgeProps = React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>;
import { cn } from "@/lib/utils";

// Types de filtres supportés
export type FilterType = 
  | "family" 
  | "category" 
  | "chemicalClass" 
  | "origin" 
  | "climaticAxis"
  | "tag"
  | "status";

interface ClickableBadgeProps extends Omit<BadgeProps, "onClick"> {
  /** Type de filtre */
  filterType: FilterType;
  /** Valeur du filtre */
  filterValue: string;
  /** Texte à afficher (optionnel, sinon utilise filterValue) */
  children?: React.ReactNode;
  /** Page de destination pour le filtre */
  targetPage?: string;
  /** Désactiver le comportement cliquable */
  disabled?: boolean;
}

// Configuration des pages de destination par type de filtre
const filterConfig: Record<FilterType, { 
  defaultPage: string; 
  paramName: string;
  label: string;
}> = {
  family: {
    defaultPage: "/molecules",
    paramName: "family",
    label: "Famille olfactive",
  },
  category: {
    defaultPage: "/recettes",
    paramName: "category",
    label: "Catégorie",
  },
  chemicalClass: {
    defaultPage: "/molecules",
    paramName: "chemicalClass",
    label: "Classe chimique",
  },
  origin: {
    defaultPage: "/terroirs",
    paramName: "origin",
    label: "Origine",
  },
  climaticAxis: {
    defaultPage: "/leaf-economies",
    paramName: "axis",
    label: "Axe climatique",
  },
  tag: {
    defaultPage: "/recherche-avancee",
    paramName: "tag",
    label: "Tag",
  },
  status: {
    defaultPage: "/recherche-avancee",
    paramName: "status",
    label: "Statut",
  },
};

/**
 * Badge cliquable qui redirige vers une page avec un filtre pré-appliqué.
 * Favorise la navigation par exploration et la découverte de contenu similaire.
 */
export function ClickableBadge({
  filterType,
  filterValue,
  children,
  targetPage,
  disabled = false,
  className,
  variant = "secondary",
  ...props
}: ClickableBadgeProps) {
  const config = filterConfig[filterType];
  const page = targetPage || config.defaultPage;
  const href = `${page}?${config.paramName}=${encodeURIComponent(filterValue)}`;
  
  const displayText = children || filterValue;
  
  if (disabled) {
    return (
      <Badge variant={variant} className={className} {...props}>
        {displayText}
      </Badge>
    );
  }
  
  return (
    <Link href={href}>
      <Badge
        variant={variant}
        className={cn(
          "cursor-pointer transition-all",
          "hover:ring-2 hover:ring-primary/30 hover:ring-offset-1",
          "active:scale-95",
          className
        )}
        title={`Filtrer par ${config.label}: ${filterValue}`}
        {...props}
      >
        {displayText}
      </Badge>
    </Link>
  );
}

// Variantes pré-stylisées pour les cas d'usage courants

export function FamilyBadge({ family, ...props }: Omit<ClickableBadgeProps, "filterType" | "filterValue"> & { family: string }) {
  return (
    <ClickableBadge
      filterType="family"
      filterValue={family}
      variant="secondary"
      {...props}
    >
      {family}
    </ClickableBadge>
  );
}

export function CategoryBadge({ category, ...props }: Omit<ClickableBadgeProps, "filterType" | "filterValue"> & { category: string }) {
  return (
    <ClickableBadge
      filterType="category"
      filterValue={category}
      variant="outline"
      className="capitalize"
      {...props}
    >
      {category}
    </ClickableBadge>
  );
}

export function ChemicalClassBadge({ chemicalClass, ...props }: Omit<ClickableBadgeProps, "filterType" | "filterValue"> & { chemicalClass: string }) {
  const labels: Record<string, string> = {
    terpene: "Terpène",
    sesquiterpene: "Sesquiterpène",
    monoterpene: "Monoterpène",
    diterpene: "Diterpène",
    aldehyde: "Aldéhyde",
    ketone: "Cétone",
    alcohol: "Alcool",
    ester: "Ester",
    ether: "Éther",
    phenol: "Phénol",
    lactone: "Lactone",
    coumarin: "Coumarine",
    musk: "Musc",
    nitrile: "Nitrile",
    sulfur_compound: "Composé soufré",
    heterocyclic: "Hétérocyclique",
    aromatic: "Aromatique",
    aliphatic: "Aliphatique",
  };
  
  return (
    <ClickableBadge
      filterType="chemicalClass"
      filterValue={chemicalClass}
      variant="outline"
      {...props}
    >
      {labels[chemicalClass] || chemicalClass}
    </ClickableBadge>
  );
}

export function OriginBadge({ origin, ...props }: Omit<ClickableBadgeProps, "filterType" | "filterValue"> & { origin: string }) {
  return (
    <ClickableBadge
      filterType="origin"
      filterValue={origin}
      variant="outline"
      {...props}
    >
      {origin}
    </ClickableBadge>
  );
}

export function ClimaticAxisBadge({ axis, ...props }: Omit<ClickableBadgeProps, "filterType" | "filterValue"> & { axis: string }) {
  const axisColors: Record<string, string> = {
    vent: "bg-sky-500/10 text-sky-600 border-sky-500/30 hover:bg-sky-500/20",
    bois: "bg-amber-500/10 text-amber-600 border-amber-500/30 hover:bg-amber-500/20",
    disparition: "bg-violet-500/10 text-violet-600 border-violet-500/30 hover:bg-violet-500/20",
  };
  
  return (
    <ClickableBadge
      filterType="climaticAxis"
      filterValue={axis}
      variant="outline"
      className={axisColors[axis.toLowerCase()] || ""}
      {...props}
    >
      Axe {axis}
    </ClickableBadge>
  );
}

// Composant pour afficher plusieurs badges cliquables
interface BadgeGroupProps {
  items: Array<{
    type: FilterType;
    value: string;
    label?: string;
  }>;
  className?: string;
}

export function ClickableBadgeGroup({ items, className }: BadgeGroupProps) {
  return (
    <div className={cn("flex flex-wrap gap-1.5", className)}>
      {items.map((item, index) => (
        <ClickableBadge
          key={`${item.type}-${item.value}-${index}`}
          filterType={item.type}
          filterValue={item.value}
        >
          {item.label || item.value}
        </ClickableBadge>
      ))}
    </div>
  );
}
