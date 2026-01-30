import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface SynergyData {
  id: number;
  molecule1Name: string | null;
  molecule2Name: string | null;
  type: "potentialisation" | "stabilisation" | "transformation" | "masquage";
  description: string;
  applications?: string | null;
}

interface MolecularSynergiesHeatmapProps {
  synergies: SynergyData[];
  maxMolecules?: number;
}

const TYPE_COLORS = {
  potentialisation: "oklch(0.65 0.15 142)", // Vert
  stabilisation: "oklch(0.60 0.15 250)", // Bleu
  transformation: "oklch(0.65 0.15 300)", // Violet
  masquage: "oklch(0.65 0.15 30)", // Orange
};

const TYPE_LABELS = {
  potentialisation: "P",
  stabilisation: "S",
  transformation: "T",
  masquage: "M",
};

export function MolecularSynergiesHeatmap({ 
  synergies, 
  maxMolecules = 20 
}: MolecularSynergiesHeatmapProps) {
  // Extraire toutes les molécules uniques
  const allMolecules = useMemo(() => {
    const moleculeSet = new Set<string>();
    synergies.forEach((s) => {
      if (s.molecule1Name) moleculeSet.add(s.molecule1Name);
      if (s.molecule2Name) moleculeSet.add(s.molecule2Name);
    });
    return Array.from(moleculeSet).slice(0, maxMolecules);
  }, [synergies, maxMolecules]);

  // Créer une matrice de synergies
  const synergyMatrix = useMemo(() => {
    const matrix: Record<string, Record<string, SynergyData | null>> = {};
    
    allMolecules.forEach((mol1) => {
      matrix[mol1] = {};
      allMolecules.forEach((mol2) => {
        matrix[mol1][mol2] = null;
      });
    });

    synergies.forEach((synergy) => {
      if (
        synergy.molecule1Name &&
        synergy.molecule2Name &&
        allMolecules.includes(synergy.molecule1Name) &&
        allMolecules.includes(synergy.molecule2Name)
      ) {
        matrix[synergy.molecule1Name][synergy.molecule2Name] = synergy;
        // Bidirectional
        matrix[synergy.molecule2Name][synergy.molecule1Name] = synergy;
      }
    });

    return matrix;
  }, [synergies, allMolecules]);

  if (allMolecules.length === 0) {
    return (
      <Card className="p-6">
        <p className="text-muted-foreground text-center">
          Aucune synergie moléculaire disponible
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Légende */}
      <div className="flex flex-wrap gap-3 items-center justify-center">
        <span className="text-sm font-medium">Types de synergies :</span>
        {Object.entries(TYPE_LABELS).map(([type, label]) => (
          <Badge
            key={type}
            variant="outline"
            style={{
              backgroundColor: TYPE_COLORS[type as keyof typeof TYPE_COLORS],
              color: "white",
              borderColor: TYPE_COLORS[type as keyof typeof TYPE_COLORS],
            }}
          >
            {label} — {type.charAt(0).toUpperCase() + type.slice(1)}
          </Badge>
        ))}
      </div>

      {/* Info */}
      <p className="text-sm text-muted-foreground text-center">
        Les lettres indiquent le type : P (Potentialisation), S (Stabilisation), 
        T (Transformation), M (Masquage)
      </p>

      {/* Heatmap */}
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full">
          <table className="border-collapse">
            <thead>
              <tr>
                <th className="border border-border p-2 bg-muted/20 sticky left-0 z-10">
                  <span className="text-xs font-medium">Molécule</span>
                </th>
                {allMolecules.map((mol) => (
                  <th
                    key={mol}
                    className="border border-border p-2 bg-muted/20 min-w-[60px]"
                  >
                    <div className="text-xs font-medium transform -rotate-45 origin-bottom-left whitespace-nowrap">
                      {mol.length > 15 ? mol.slice(0, 12) + "..." : mol}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {allMolecules.map((mol1, i) => (
                <tr key={mol1}>
                  <td className="border border-border p-2 bg-muted/20 sticky left-0 z-10">
                    <span className="text-xs font-medium whitespace-nowrap">
                      {mol1.length > 20 ? mol1.slice(0, 17) + "..." : mol1}
                    </span>
                  </td>
                  {allMolecules.map((mol2, j) => {
                    const synergy = synergyMatrix[mol1]?.[mol2];
                    
                    // Diagonal (même molécule)
                    if (i === j) {
                      return (
                        <td
                          key={mol2}
                          className="border border-border p-2 bg-muted/10"
                        >
                          <div className="w-full h-10 flex items-center justify-center">
                            <span className="text-xs text-muted-foreground">—</span>
                          </div>
                        </td>
                      );
                    }

                    // Pas de synergie
                    if (!synergy) {
                      return (
                        <td
                          key={mol2}
                          className="border border-border p-2 bg-background"
                        >
                          <div className="w-full h-10" />
                        </td>
                      );
                    }

                    // Synergie existante
                    return (
                      <td
                        key={mol2}
                        className="border border-border p-2 cursor-pointer hover:scale-110 hover:z-20 transition-transform relative group"
                        style={{
                          backgroundColor: TYPE_COLORS[synergy.type],
                        }}
                      >
                        <div className="w-full h-10 flex items-center justify-center">
                          <span className="text-white font-bold text-sm">
                            {TYPE_LABELS[synergy.type]}
                          </span>
                        </div>

                        {/* Tooltip au hover */}
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block z-30 w-64">
                          <Card className="p-3 shadow-lg">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <Badge
                                  style={{
                                    backgroundColor: TYPE_COLORS[synergy.type],
                                    color: "white",
                                  }}
                                >
                                  {synergy.type}
                                </Badge>
                              </div>
                              <p className="text-xs font-medium">
                                {synergy.molecule1Name} × {synergy.molecule2Name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {synergy.description}
                              </p>
                              {synergy.applications && (
                                <p className="text-xs text-muted-foreground italic">
                                  Applications : {synergy.applications}
                                </p>
                              )}
                            </div>
                          </Card>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Message si trop de molécules */}
      {synergies.length > 0 && (
        <p className="text-xs text-muted-foreground text-center">
          {allMolecules.length < synergies.length * 2
            ? `Affichage des ${allMolecules.length} premières molécules pour une meilleure lisibilité`
            : `${allMolecules.length} molécules affichées`}
        </p>
      )}
    </div>
  );
}
