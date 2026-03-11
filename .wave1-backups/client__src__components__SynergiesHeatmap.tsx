// @ts-nocheck
import { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Synergy {
  id: number;
  name: string;
  type: string;
  effet: string | null;
  notes: string | null;
  tabacId: number | null;
  tabacName: string | null;
  moleculeId: number | null;
  createdAt: Date;
  updatedAt?: Date;
}

interface Molecule {
  id: number;
  name: string;
  family: string | null;
  olfactiveProfile: string | null;
}

interface Tabac {
  id: number;
  name: string;
}

interface SynergiesHeatmapProps {
  molecules: Molecule[];
  tabacs: Tabac[];
  synergies: Synergy[];
  selectedTabac?: string;
  selectedFamily?: string;
}

export function SynergiesHeatmap({
  molecules,
  tabacs,
  synergies,
  selectedTabac,
  selectedFamily
}: SynergiesHeatmapProps) {
  // Filter molecules based on selected family
  const filteredMolecules = useMemo(() => {
    if (!selectedFamily || selectedFamily === "all") return molecules;
    return molecules.filter(m => m.family === selectedFamily);
  }, [molecules, selectedFamily]);

  // Filter tabacs based on selection
  const filteredTabacs = useMemo(() => {
    if (!selectedTabac || selectedTabac === "all") return tabacs;
    return tabacs.filter(t => t.name === selectedTabac);
  }, [tabacs, selectedTabac]);

  // Create synergy matrix: tabac × molecule → synergy data
  const synergyMatrix = useMemo(() => {
    const matrix: Record<string, Record<number, Synergy | null>> = {};
    
    filteredTabacs.forEach(tabac => {
      matrix[tabac.name] = {};
      filteredMolecules.forEach(molecule => {
        const synergy = synergies.find(
          s => (s.tabacName === tabac.name || s.tabacId === tabac.id) && s.moleculeId === molecule.id
        );
        matrix[tabac.name][molecule.id] = synergy || null;
      });
    });
    
    return matrix;
  }, [filteredTabacs, filteredMolecules, synergies]);

  // Get color based on synergy type
  const getSynergyColor = (synergy: Synergy | null): string => {
    if (!synergy) return "bg-muted/20";
    
    const typeColors: Record<string, string> = {
      potentialisation: "bg-green-500/60",
      stabilisation: "bg-blue-500/60",
      transformation: "bg-purple-500/60",
      masquage: "bg-orange-500/60"
    };
    
    return typeColors[synergy.type] || "bg-primary/60";
  };

  // Get intensity opacity (using effet field as proxy for intensity)
  const getIntensityOpacity = (synergy: Synergy | null): string => {
    if (!synergy) return "opacity-100";
    // Default to full opacity since intensity field doesn't exist
    return "opacity-80";
  };

  // Limit display to first 20 molecules for readability
  const displayMolecules = filteredMolecules.slice(0, 20);
  const hasMore = filteredMolecules.length > 20;

  if (filteredTabacs.length === 0 || displayMolecules.length === 0) {
    return (
      <Card className="brutal-border">
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">
            Aucune donnée à afficher. Sélectionnez un tabac ou une famille chimique.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="brutal-border">
      <CardHeader>
        <CardTitle>Heatmap des Synergies</CardTitle>
        <CardDescription>
          Visualisation des synergies entre {filteredTabacs.length} tabac{filteredTabacs.length > 1 ? 's' : ''} et {displayMolecules.length} molécule{displayMolecules.length > 1 ? 's' : ''}
          {hasMore && ` (${filteredMolecules.length - 20} molécules supplémentaires masquées)`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Legend */}
        <div className="mb-6 flex flex-wrap gap-3">
          <Badge className="bg-green-500/60">Potentialisation</Badge>
          <Badge className="bg-blue-500/60">Stabilisation</Badge>
          <Badge className="bg-purple-500/60">Transformation</Badge>
          <Badge className="bg-orange-500/60">Masquage</Badge>
          <Badge variant="outline" className="bg-muted/20">Pas de synergie</Badge>
        </div>

        {/* Heatmap Grid */}
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full">
            {/* Header row with molecule names */}
            <div className="flex gap-1 mb-1">
              <div className="w-32 shrink-0" /> {/* Empty corner */}
              {displayMolecules.map(molecule => (
                <div
                  key={molecule.id}
                  className="w-24 shrink-0 text-xs font-medium text-muted-foreground truncate"
                  title={molecule.name}
                >
                  <div className="transform -rotate-45 origin-bottom-left whitespace-nowrap">
                    {molecule.name}
                  </div>
                </div>
              ))}
            </div>

            {/* Data rows */}
            {filteredTabacs.map(tabac => (
              <div key={tabac.name} className="flex gap-1 mb-1">
                {/* Tabac name */}
                <div className="w-32 shrink-0 text-sm font-medium flex items-center truncate" title={tabac.name}>
                  {tabac.name}
                </div>
                
                {/* Synergy cells */}
                {displayMolecules.map(molecule => {
                  const synergy = synergyMatrix[tabac.name]?.[molecule.id];
                  return (
                    <div
                      key={molecule.id}
                      className={`w-24 h-12 shrink-0 rounded border border-border ${getSynergyColor(synergy)} ${getIntensityOpacity(synergy)} transition-all hover:scale-110 hover:z-10 cursor-pointer`}
                      title={
                        synergy
                          ? `${tabac.name} × ${molecule.name}\nType: ${synergy.type}\nEffet: ${synergy.effet || 'N/A'}\n${synergy.notes || ''}`
                          : `${tabac.name} × ${molecule.name}\nPas de synergie documentée`
                      }
                    >
                      {synergy && (
                        <div className="w-full h-full flex items-center justify-center text-xs font-bold text-white">
                          {synergy.type.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Info text */}
        <p className="text-xs text-muted-foreground mt-4">
          💡 Survolez les cellules pour voir les détails. Les lettres indiquent le type : P (Potentialisation), S (Stabilisation), T (Transformation), M (Masquage).
        </p>
      </CardContent>
    </Card>
  );
}
