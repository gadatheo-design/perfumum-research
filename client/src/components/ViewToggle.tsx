import { LayoutGrid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type ViewMode = "grid" | "list";

interface ViewToggleProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  className?: string;
}

export function ViewToggle({ viewMode, onViewModeChange, className }: ViewToggleProps) {
  return (
    <div className={cn("flex items-center gap-1 p-1 bg-muted rounded-lg", className)}>
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "h-8 w-8 p-0 transition-all",
          viewMode === "grid" && "bg-background shadow-sm"
        )}
        onClick={() => onViewModeChange("grid")}
        aria-label="Vue grille"
        aria-pressed={viewMode === "grid"}
      >
        <LayoutGrid className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "h-8 w-8 p-0 transition-all",
          viewMode === "list" && "bg-background shadow-sm"
        )}
        onClick={() => onViewModeChange("list")}
        aria-label="Vue liste"
        aria-pressed={viewMode === "list"}
      >
        <List className="h-4 w-4" />
      </Button>
    </div>
  );
}

// Hook pour persister la préférence de vue dans localStorage
import { useState, useEffect } from "react";

export function useViewMode(storageKey: string, defaultMode: ViewMode = "grid"): [ViewMode, (mode: ViewMode) => void] {
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(storageKey);
      if (stored === "grid" || stored === "list") {
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
