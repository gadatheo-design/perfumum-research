import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Beaker, Info } from "lucide-react";
import { useState } from "react";

interface MoleculeNode {
  id: string;
  name: string;
  formula: string;
  profile: string;
  enzyme?: string;
  color: string;
}

const molecules: MoleculeNode[] = [
  {
    id: "androstadienol",
    name: "Androstadienol",
    formula: "C₁₉H₂₈O",
    profile: "Précurseur initial",
    enzyme: "3β-HSD",
    color: "bg-blue-100 border-blue-400",
  },
  {
    id: "androstadienone",
    name: "Androstadienone",
    formula: "C₁₉H₂₆O",
    profile: "Musqué subtil, effets sur l'humeur",
    enzyme: "5α-réductase",
    color: "bg-purple-100 border-purple-400",
  },
  {
    id: "androstenone",
    name: "Androsténone",
    formula: "C₁₉H₂₈O",
    profile: "Boisé/urineux (variable selon OR7D4)",
    enzyme: "3-cétostéroïde réductase",
    color: "bg-amber-100 border-amber-400",
  },
  {
    id: "androstenol",
    name: "Androsténol",
    formula: "C₁₉H₃₀O",
    profile: "Truffe, musc terreux, attraction",
    color: "bg-rose-100 border-rose-400",
  },
];

export function CascadeBiosynthetique() {
  const [selectedMolecule, setSelectedMolecule] = useState<string | null>(null);

  return (
    <Card className="border-rose-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Beaker className="h-5 w-5 text-rose-600" />
          Cascade Biosynthétique des Phéromones
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Graphique de la cascade */}
        <div className="relative">
          {/* Version desktop */}
          <div className="hidden md:flex items-center justify-between gap-2 mb-8">
            {molecules.map((mol, index) => (
              <div key={mol.id} className="flex items-center">
                {/* Molécule */}
                <div
                  className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all ${mol.color} ${
                    selectedMolecule === mol.id ? "ring-2 ring-rose-500 scale-105" : "hover:scale-102"
                  }`}
                  onClick={() => setSelectedMolecule(selectedMolecule === mol.id ? null : mol.id)}
                >
                  <div className="text-center">
                    <p className="font-semibold text-sm">{mol.name}</p>
                    <p className="text-xs text-muted-foreground font-mono">{mol.formula}</p>
                  </div>
                </div>
                
                {/* Flèche et enzyme */}
                {index < molecules.length - 1 && (
                  <div className="flex flex-col items-center mx-2">
                    <ArrowRight className="h-6 w-6 text-rose-400" />
                    <span className="text-[10px] text-muted-foreground mt-1 text-center max-w-[80px]">
                      {mol.enzyme}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Version mobile - verticale */}
          <div className="md:hidden space-y-4 mb-8">
            {molecules.map((mol, index) => (
              <div key={mol.id} className="flex flex-col items-center">
                {/* Molécule */}
                <div
                  className={`w-full p-4 rounded-lg border-2 cursor-pointer transition-all ${mol.color} ${
                    selectedMolecule === mol.id ? "ring-2 ring-rose-500" : ""
                  }`}
                  onClick={() => setSelectedMolecule(selectedMolecule === mol.id ? null : mol.id)}
                >
                  <div className="text-center">
                    <p className="font-semibold">{mol.name}</p>
                    <p className="text-sm text-muted-foreground font-mono">{mol.formula}</p>
                  </div>
                </div>
                
                {/* Flèche et enzyme */}
                {index < molecules.length - 1 && (
                  <div className="flex flex-col items-center my-2">
                    <ArrowRight className="h-6 w-6 text-rose-400 rotate-90" />
                    <span className="text-xs text-muted-foreground mt-1">
                      {mol.enzyme}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Détails de la molécule sélectionnée */}
          {selectedMolecule && (
            <div className="bg-muted/50 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-2">
                <Info className="h-4 w-4 text-rose-600 mt-0.5" />
                <div>
                  <p className="font-medium">
                    {molecules.find(m => m.id === selectedMolecule)?.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {molecules.find(m => m.id === selectedMolecule)?.profile}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Légende */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-blue-100 border border-blue-400"></div>
              <span>Précurseur</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-purple-100 border border-purple-400"></div>
              <span>Intermédiaire 1</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-amber-100 border border-amber-400"></div>
              <span>Intermédiaire 2</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-rose-100 border border-rose-400"></div>
              <span>Produit final</span>
            </div>
          </div>
        </div>

        {/* Notes scientifiques */}
        <div className="mt-6 pt-6 border-t">
          <h4 className="font-medium mb-3 text-sm">Notes sur la cascade</h4>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>
              <strong>3β-HSD</strong> (3β-hydroxystéroïde déshydrogénase) : Convertit l'Androstadienol 
              en Androstadienone par oxydation du groupe hydroxyle.
            </p>
            <p>
              <strong>5α-réductase</strong> : Réduit la double liaison en position 5 de l'Androstadienone 
              pour former l'Androsténone.
            </p>
            <p>
              <strong>3-cétostéroïde réductase</strong> : Réduit le groupe cétone de l'Androsténone 
              en groupe hydroxyle pour former l'Androsténol.
            </p>
          </div>
        </div>

        {/* Badges d'utilisation */}
        <div className="mt-4 flex flex-wrap gap-2">
          <Badge variant="outline" className="text-xs">Biosynthèse stéroïdienne</Badge>
          <Badge variant="outline" className="text-xs">16-androstènes</Badge>
          <Badge variant="outline" className="text-xs">Communication chimique</Badge>
        </div>
      </CardContent>
    </Card>
  );
}
