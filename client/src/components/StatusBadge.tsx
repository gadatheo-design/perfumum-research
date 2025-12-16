import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Sparkles, Clock, CheckCircle, AlertCircle, Beaker, Star } from "lucide-react";

type StatusType = "new" | "updated" | "beta" | "stable" | "experimental" | "featured" | "count";

interface StatusBadgeProps {
  type: StatusType;
  label?: string;
  count?: number;
  className?: string;
  size?: "sm" | "md";
}

const statusConfig: Record<StatusType, {
  icon: React.ReactNode;
  defaultLabel: string;
  className: string;
}> = {
  new: {
    icon: <Sparkles className="h-3 w-3" />,
    defaultLabel: "NEW",
    className: "bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 animate-pulse",
  },
  updated: {
    icon: <Clock className="h-3 w-3" />,
    defaultLabel: "MÀJ",
    className: "bg-blue-100 text-blue-700 border-blue-200",
  },
  beta: {
    icon: <Beaker className="h-3 w-3" />,
    defaultLabel: "BETA",
    className: "bg-purple-100 text-purple-700 border-purple-200",
  },
  stable: {
    icon: <CheckCircle className="h-3 w-3" />,
    defaultLabel: "STABLE",
    className: "bg-green-100 text-green-700 border-green-200",
  },
  experimental: {
    icon: <AlertCircle className="h-3 w-3" />,
    defaultLabel: "EXPÉRIMENTAL",
    className: "bg-orange-100 text-orange-700 border-orange-200",
  },
  featured: {
    icon: <Star className="h-3 w-3" />,
    defaultLabel: "VEDETTE",
    className: "bg-gradient-to-r from-yellow-400 to-amber-500 text-white border-0",
  },
  count: {
    icon: null,
    defaultLabel: "",
    className: "bg-muted text-muted-foreground",
  },
};

export function StatusBadge({ type, label, count, className, size = "sm" }: StatusBadgeProps) {
  const config = statusConfig[type];
  const displayLabel = type === "count" && count !== undefined 
    ? count.toString() 
    : label || config.defaultLabel;

  return (
    <Badge 
      variant="outline"
      className={cn(
        "font-medium gap-1",
        size === "sm" ? "text-xs px-2 py-0.5" : "text-sm px-3 py-1",
        config.className,
        className
      )}
    >
      {config.icon}
      {displayLabel}
    </Badge>
  );
}

// Composant pour afficher un compteur de données
export function CountBadge({ count, label, className }: { count: number; label?: string; className?: string }) {
  return (
    <Badge 
      variant="secondary"
      className={cn("font-mono tabular-nums", className)}
    >
      {count}{label && ` ${label}`}
    </Badge>
  );
}

// Composant pour afficher un badge de gamme avec couleur
export function GammeStatusBadge({ 
  gamme, 
  count, 
  className 
}: { 
  gamme: string; 
  count?: number; 
  className?: string 
}) {
  const gammeColors: Record<string, string> = {
    petrichor: "bg-blue-100 text-blue-700 border-blue-200",
    volcanique: "bg-orange-100 text-orange-700 border-orange-200",
    glaciaire: "bg-cyan-100 text-cyan-700 border-cyan-200",
    biolab: "bg-pink-100 text-pink-700 border-pink-200",
    mossi: "bg-amber-100 text-amber-700 border-amber-200",
    signatures: "bg-gradient-to-r from-amber-400 to-yellow-500 text-white border-0",
  };

  return (
    <Badge 
      variant="outline"
      className={cn(
        "font-medium",
        gammeColors[gamme.toLowerCase()] || "bg-muted text-muted-foreground",
        className
      )}
    >
      {gamme}
      {count !== undefined && <span className="ml-1 opacity-75">({count})</span>}
    </Badge>
  );
}
