// @ts-nocheck
import { Badge } from "@/components/ui/badge";
import { Droplets, Flame, Globe2, Snowflake, FlaskConical, Coffee } from "lucide-react";
import { cn } from "@/lib/utils";

export type GammeType = "petrichor" | "volcanique" | "civilisations" | "glaciaire" | "biolab" | "colombie";

interface GammeBadgeProps {
  gamme: GammeType;
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
  className?: string;
  onClick?: () => void;
}

const gammeConfig = {
  petrichor: {
    label: "Pétrichor",
    icon: Droplets,
    colorClass: "bg-gamme-petrichor/10 text-gamme-petrichor border-gamme-petrichor/30 hover:bg-gamme-petrichor/20",
    description: "Terre • Minéral • Pluie"
  },
  volcanique: {
    label: "Volcanique",
    icon: Flame,
    colorClass: "bg-gamme-volcanique/10 text-gamme-volcanique border-gamme-volcanique/30 hover:bg-gamme-volcanique/20",
    description: "Fumée • Pyrolyse • Intensité"
  },
  civilisations: {
    label: "Traditions Olfactives",
    icon: Globe2,
    colorClass: "bg-gamme-civilisations/10 text-gamme-civilisations border-gamme-civilisations/30 hover:bg-gamme-civilisations/20",
    description: "Sacré • Culturel • Rituel"
  },
  glaciaire: {
    label: "Glaciaire",
    icon: Snowflake,
    colorClass: "bg-gamme-glaciaire/10 text-gamme-glaciaire border-gamme-glaciaire/30 hover:bg-gamme-glaciaire/20",
    description: "Fraîcheur • Ozone • Altitude"
  },
  biolab: {
    label: "Bio-Lab",
    icon: FlaskConical,
    colorClass: "bg-gamme-biolab/10 text-gamme-biolab border-gamme-biolab/30 hover:bg-gamme-biolab/20",
    description: "Expérimental • Biotechnologie"
  },
  colombie: {
    label: "Colombie",
    icon: Coffee,
    colorClass: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30 hover:bg-amber-500/20",
    description: "Café • Cacao • Andes"
  }
};

const sizeClasses = {
  sm: "text-xs px-2 py-0.5",
  md: "text-sm px-3 py-1",
  lg: "text-base px-4 py-1.5"
};

const iconSizes = {
  sm: "h-3 w-3",
  md: "h-4 w-4",
  lg: "h-5 w-5"
};

export function GammeBadge({ gamme, size = "md", showIcon = true, className, onClick }: GammeBadgeProps) {
  const config = gammeConfig[gamme];
  const Icon = config.icon;

  return (
    <Badge 
      variant="outline" 
      className={cn(
        config.colorClass,
        sizeClasses[size],
        "font-medium transition-colors duration-200",
        onClick && "cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      {showIcon && <Icon className={cn(iconSizes[size], "mr-1.5")} />}
      {config.label}
    </Badge>
  );
}

export function getGammeConfig(gamme: GammeType) {
  return gammeConfig[gamme];
}
