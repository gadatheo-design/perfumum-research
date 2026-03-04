// @ts-nocheck
import { LayoutGrid, List, LayoutList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export type ViewMode = "grid" | "list" | "compact";

interface ViewToggleProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  className?: string;
  showCompact?: boolean;
}

export function ViewToggle({ viewMode, onViewModeChange, className, showCompact = false }: ViewToggleProps) {
  const views = [
    { mode: "grid" as ViewMode, icon: LayoutGrid, label: "Vue grille", description: "Affichage en cartes" },
    { mode: "list" as ViewMode, icon: List, label: "Vue liste", description: "Affichage détaillé" },
    ...(showCompact ? [{ mode: "compact" as ViewMode, icon: LayoutList, label: "Vue compacte", description: "Affichage minimal" }] : []),
  ];

  return (
    <TooltipProvider>
      <div className={cn(
        "flex items-center gap-0.5 p-1 bg-muted/50 rounded-lg border border-border/50",
        className
      )}>
        {views.map(({ mode, icon: Icon, label, description }) => (
          <Tooltip key={mode}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "h-8 w-8 p-0 transition-all duration-200",
                  viewMode === mode 
                    ? "bg-background shadow-sm text-primary" 
                    : "text-muted-foreground hover:text-foreground"
                )}
                onClick={() => onViewModeChange(mode)}
                aria-label={label}
                aria-pressed={viewMode === mode}
              >
                <Icon className={cn(
                  "h-4 w-4 transition-transform duration-200",
                  viewMode === mode && "scale-110"
                )} />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="text-xs">
              <p className="font-medium">{label}</p>
              <p className="text-muted-foreground">{description}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  );
}

// Hook pour persister la préférence de vue dans localStorage
export function useViewMode(storageKey: string, defaultMode: ViewMode = "grid"): [ViewMode, (mode: ViewMode) => void] {
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(storageKey);
      if (stored === "grid" || stored === "list" || stored === "compact") {
        return stored;
      }
    }
    return defaultMode;
  });

  useEffect(() => {
    localStorage.setItem(storageKey, viewMode);
  }, [viewMode, storageKey]);

  return [viewMode, setViewMode];
}

// Composant de compteur de résultats avec animation
interface ResultsCounterProps {
  count: number;
  total?: number;
  label?: string;
  className?: string;
}

export function ResultsCounter({ count, total, label = "résultats", className }: ResultsCounterProps) {
  return (
    <div className={cn("flex items-center gap-2 text-sm text-muted-foreground", className)}>
      <span className="font-semibold text-foreground tabular-nums">{count}</span>
      {total && total !== count && (
        <>
          <span>/</span>
          <span className="tabular-nums">{total}</span>
        </>
      )}
      <span>{label}</span>
    </div>
  );
}
