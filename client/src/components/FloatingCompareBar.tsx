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
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-4">
      <div className="bg-primary text-primary-foreground shadow-2xl rounded-full px-6 py-4 flex items-center gap-4 border-2 border-primary-foreground/20">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary-foreground/20 flex items-center justify-center font-bold">
            {selectedCount}
          </div>
          <span className="font-semibold">
            {selectedCount} molécule{selectedCount > 1 ? "s" : ""} sélectionnée{selectedCount > 1 ? "s" : ""}
          </span>
          {selectedCount >= maxCount && (
            <span className="text-xs opacity-80">(max atteint)</span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={onCompare}
            disabled={selectedCount < 2}
            className="gap-2"
          >
            <GitCompare className="h-4 w-4" />
            Comparer
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
