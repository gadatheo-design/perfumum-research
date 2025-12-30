import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GammeBadge, type GammeType } from "@/components/GammeBadge";

interface ActiveFilter {
  type: "search" | "family" | "profile" | "concentration" | "gamme";
  label: string;
  value: string;
  onRemove: () => void;
}

interface ActiveFiltersChipsProps {
  filters: ActiveFilter[];
  onResetAll: () => void;
}

export function ActiveFiltersChips({ filters, onResetAll }: ActiveFiltersChipsProps) {
  if (filters.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 p-4 border border-border/40 rounded-lg bg-muted/10">
      <span className="text-sm font-medium text-muted-foreground">
        Filtres actifs :
      </span>
      
      {filters.map((filter, index) => (
        <Badge
          key={`${filter.type}-${index}`}
          variant="secondary"
          className="cursor-pointer hover:bg-secondary/80 transition-colors gap-1 pr-1"
          onClick={filter.onRemove}
        >
          <span className="text-xs font-medium opacity-70">{filter.label}:</span>
          <span>{filter.value}</span>
          <X className="h-3 w-3 ml-1" />
        </Badge>
      ))}

      <Button
        variant="ghost"
        size="sm"
        onClick={onResetAll}
        className="ml-auto h-7 text-xs"
      >
        <X className="h-3 w-3 mr-1" />
        Réinitialiser tout
      </Button>
    </div>
  );
}
