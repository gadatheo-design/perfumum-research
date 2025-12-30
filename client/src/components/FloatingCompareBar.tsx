import { Button } from "@/components/ui/button";
import { X, GitCompare } from "lucide-react";
import { useLocation } from "wouter";

interface FloatingCompareBarProps {
  selectedCount: number;
  maxCount: number;
  onClear: () => void;
  onCompare: () => void;
}

export function FloatingCompareBar({
  selectedCount,
  maxCount,
  onClear,
  onCompare,
}: FloatingCompareBarProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-20 lg:bottom-8 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-4 w-[calc(100%-2rem)] max-w-2xl">
      <div className="bg-primary text-primary-foreground shadow-2xl rounded-full px-4 md:px-6 py-3 md:py-4 flex items-center justify-between gap-3 md:gap-4 border-2 border-primary-foreground/20">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <div className="w-8 h-8 rounded-full bg-primary-foreground/20 flex items-center justify-center font-bold flex-shrink-0">
            {selectedCount}
          </div>
          <span className="font-semibold text-sm md:text-base truncate">
            <span className="hidden sm:inline">{selectedCount} recette{selectedCount > 1 ? "s" : ""} sélectionnée{selectedCount > 1 ? "s" : ""}</span>
            <span className="sm:hidden">{selectedCount} sélect.</span>
          </span>
          {selectedCount >= maxCount && (
            <span className="text-xs opacity-80 hidden md:inline">(max atteint)</span>
          )}
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <Button
            variant="secondary"
            size="sm"
            onClick={onCompare}
            disabled={selectedCount < 2}
            className="gap-1 md:gap-2"
          >
            <GitCompare className="h-4 w-4" />
            <span className="hidden sm:inline">Comparer</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={onClear}
            className="hover:bg-primary-foreground/20"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
