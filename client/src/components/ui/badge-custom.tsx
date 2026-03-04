// @ts-nocheck
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface CustomBadgeProps {
  children: React.ReactNode;
  variant?: "default" | "secondary" | "outline" | "destructive";
  className?: string;
  color?: "c1" | "c2" | "c3" | "c4" | "biomineralis" | "petrichor" | "volcanique" | "solarmineralis";
}

export function CustomBadge({ children, variant = "secondary", className, color }: CustomBadgeProps) {
  const colorClasses = {
    c1: "bg-c1 text-white border-c1",
    c2: "bg-c2 text-foreground border-c2",
    c3: "bg-c3 text-foreground border-c3",
    c4: "bg-c4 text-foreground border-c4",
    biomineralis: "bg-bio-mineralis text-foreground border-bio-mineralis",
    petrichor: "bg-petrichor text-white border-petrichor",
    volcanique: "bg-volcanique text-white border-volcanique",
    solarmineralis: "bg-solar-mineralis text-foreground border-solar-mineralis",
  };

  return (
    <Badge
      variant={variant}
      className={cn(
        "font-medium",
        color && colorClasses[color],
        className
      )}
    >
      {children}
    </Badge>
  );
}

// Specific badge components for common use cases
export function NoteBadge({ note }: { note: string }) {
  const noteColors: Record<string, string> = {
    tete: "bg-yellow-100 text-yellow-800 border-yellow-200",
    coeur: "bg-pink-100 text-pink-800 border-pink-200",
    fond: "bg-purple-100 text-purple-800 border-purple-200",
    tete_coeur: "bg-orange-100 text-orange-800 border-orange-200",
    coeur_fond: "bg-indigo-100 text-indigo-800 border-indigo-200",
  };

  const noteLabels: Record<string, string> = {
    tete: "Tête",
    coeur: "Cœur",
    fond: "Fond",
    tete_coeur: "Tête/Cœur",
    coeur_fond: "Cœur/Fond",
  };

  return (
    <Badge variant="outline" className={cn("text-xs", noteColors[note])}>
      {noteLabels[note] || note}
    </Badge>
  );
}

export function FamilyBadge({ family }: { family: string }) {
  return (
    <Badge variant="secondary" className="text-xs">
      {family}
    </Badge>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const statusColors: Record<string, string> = {
    en_stock: "bg-green-100 text-green-800 border-green-200",
    a_commander: "bg-orange-100 text-orange-800 border-orange-200",
    epuise: "bg-red-100 text-red-800 border-red-200",
  };

  const statusLabels: Record<string, string> = {
    en_stock: "En stock",
    a_commander: "À commander",
    epuise: "Épuisé",
  };

  return (
    <Badge variant="outline" className={cn("text-xs", statusColors[status])}>
      {statusLabels[status] || status}
    </Badge>
  );
}
