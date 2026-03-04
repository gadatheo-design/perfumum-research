// @ts-nocheck
import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar, X, BarChart3 } from "lucide-react";

interface DateRangeFilterProps {
  minYear: number;
  maxYear: number;
  selectedRange: [number, number] | null;
  onRangeChange: (range: [number, number] | null) => void;
  yearDistribution?: { year: number | null; count: number }[];
}

export function DateRangeFilter({
  minYear,
  maxYear,
  selectedRange,
  onRangeChange,
  yearDistribution = [],
}: DateRangeFilterProps) {
  const [localRange, setLocalRange] = useState<[number, number]>([minYear, maxYear]);
  const [isOpen, setIsOpen] = useState(false);

  // Sync local range with selected range
  useEffect(() => {
    if (selectedRange) {
      setLocalRange(selectedRange);
    } else {
      setLocalRange([minYear, maxYear]);
    }
  }, [selectedRange, minYear, maxYear]);

  // Calculate histogram data for visualization
  const histogram = useMemo(() => {
    if (!yearDistribution.length) return [];
    
    // Group by decades for better visualization
    const decades: Record<number, number> = {};
    yearDistribution.forEach(({ year, count }) => {
      if (year) {
        const decade = Math.floor(year / 10) * 10;
        decades[decade] = (decades[decade] || 0) + count;
      }
    });
    
    const maxCount = Math.max(...Object.values(decades), 1);
    return Object.entries(decades)
      .map(([decade, count]) => ({
        decade: parseInt(decade),
        count,
        height: (count / maxCount) * 100,
      }))
      .sort((a, b) => a.decade - b.decade);
  }, [yearDistribution]);

  const handleApply = () => {
    if (localRange[0] === minYear && localRange[1] === maxYear) {
      onRangeChange(null);
    } else {
      onRangeChange(localRange);
    }
    setIsOpen(false);
  };

  const handleReset = () => {
    setLocalRange([minYear, maxYear]);
    onRangeChange(null);
    setIsOpen(false);
  };

  const isFiltered = selectedRange !== null;

  // Predefined periods for quick selection
  const quickPeriods = [
    { label: "Antiquité", range: [-3000, 500] as [number, number] },
    { label: "Moyen Âge", range: [500, 1500] as [number, number] },
    { label: "Renaissance", range: [1500, 1700] as [number, number] },
    { label: "XVIIIe siècle", range: [1700, 1800] as [number, number] },
    { label: "XIXe siècle", range: [1800, 1900] as [number, number] },
    { label: "XXe siècle", range: [1900, 2000] as [number, number] },
    { label: "XXIe siècle", range: [2000, 2100] as [number, number] },
    { label: "10 dernières années", range: [new Date().getFullYear() - 10, new Date().getFullYear()] as [number, number] },
    { label: "5 dernières années", range: [new Date().getFullYear() - 5, new Date().getFullYear()] as [number, number] },
  ];

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={isFiltered ? "default" : "outline"}
          className="gap-2"
        >
          <Calendar className="h-4 w-4" />
          {isFiltered ? (
            <>
              {selectedRange[0]} - {selectedRange[1]}
              <X
                className="h-3 w-3 ml-1 hover:text-destructive"
                onClick={(e) => {
                  e.stopPropagation();
                  handleReset();
                }}
              />
            </>
          ) : (
            "Période"
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-4" align="start">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-base font-semibold">Filtrer par période</Label>
            {isFiltered && (
              <Button variant="ghost" size="sm" onClick={handleReset}>
                Réinitialiser
              </Button>
            )}
          </div>

          {/* Distribution histogram */}
          {histogram.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <BarChart3 className="h-3 w-3" />
                Distribution temporelle
              </div>
              <div className="flex items-end gap-0.5 h-16 bg-muted/30 rounded p-1">
                {histogram.map(({ decade, count, height }) => (
                  <div
                    key={decade}
                    className={`flex-1 rounded-t transition-colors ${
                      decade >= localRange[0] && decade <= localRange[1]
                        ? "bg-primary"
                        : "bg-muted-foreground/30"
                    }`}
                    style={{ height: `${Math.max(height, 5)}%` }}
                    title={`${decade}s: ${count} références`}
                  />
                ))}
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{histogram[0]?.decade || minYear}</span>
                <span>{histogram[histogram.length - 1]?.decade || maxYear}</span>
              </div>
            </div>
          )}

          {/* Year range slider */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{localRange[0]}</span>
              <span className="text-sm text-muted-foreground">à</span>
              <span className="text-sm font-medium">{localRange[1]}</span>
            </div>
            <Slider
              value={localRange}
              min={minYear}
              max={maxYear}
              step={1}
              onValueChange={(value) => setLocalRange(value as [number, number])}
              className="py-2"
            />
          </div>

          {/* Quick period selection */}
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Périodes prédéfinies</Label>
            <div className="flex flex-wrap gap-1">
              {quickPeriods
                .filter(p => p.range[0] >= minYear - 100 && p.range[1] <= maxYear + 100)
                .map((period) => (
                  <Badge
                    key={period.label}
                    variant={
                      localRange[0] === Math.max(period.range[0], minYear) &&
                      localRange[1] === Math.min(period.range[1], maxYear)
                        ? "default"
                        : "outline"
                    }
                    className="cursor-pointer hover:bg-primary/20 transition-colors"
                    onClick={() => {
                      setLocalRange([
                        Math.max(period.range[0], minYear),
                        Math.min(period.range[1], maxYear),
                      ]);
                    }}
                  >
                    {period.label}
                  </Badge>
                ))}
            </div>
          </div>

          {/* Apply button */}
          <div className="flex justify-end gap-2 pt-2 border-t">
            <Button variant="outline" size="sm" onClick={() => setIsOpen(false)}>
              Annuler
            </Button>
            <Button size="sm" onClick={handleApply}>
              Appliquer
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
