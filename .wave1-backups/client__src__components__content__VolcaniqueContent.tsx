// @ts-nocheck
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Flame, Mountain, Zap, Skull } from "lucide-react";
import { GammesConnexes } from "@/components/GammesConnexes";
import { trpc } from "@/lib/trpc";
import { linkifyMoleculeNames } from "@/lib/linkifyMolecules";

export default function VolcaniqueContent() {
  const { data: molecules } = trpc.molecules.list.useQuery();

  const axes = [
    {
      code: "V.1",
      name: "VOLCANIQUE INCANDESCENT",
      icon: Flame,
      atmosphere: "Lave en fusion, soufre brûlant, chaleur extrême. Création primordiale.",
      notes: "soufre, ambre brûlé, cuir fumé, encens noir, oud brûlé, castoreum",
      sensation: "brûlante, intense, primordiale, destructrice",
      color: "from-red-900/20 to-orange-900/20",
      borderColor: "border-l-red-700",
      molecules: "Composés soufrés, Oud, Encens, Castoreum, Labdanum",
      accords: "Soufre + Cuir brûlé + Ambre noir",
    },
    {
      code: "V.2",
      name: "VOLCANIQUE CENDRÉ",
      icon: Mountain,
      atmosphere: "Cendres refroidies, basalte noir, silence après l'éruption. Désolation fertile.",
      notes: "cendre froide, pierre volcanique, vétiver fumé, encens éteint, mousse sèche",
      sensation: "froide, austère, silencieuse, régénératrice",
      color: "from-gray-700/20 to-slate-800/20",
      borderColor: "border-l-gray-600",
      molecules: "Vétiver, Encens, Mousse de chêne, Cèdre brûlé, Cyprès",
      accords: "Cendre + Pierre noire + Silence",
    },
    {
      code: "V.3",
      name: "VOLCANIQUE ÉLECTRIQUE",
      icon: Zap,
      atmosphere: "Orage volcanique, éclairs dans les cendres, tension atmosphérique. Énergie brute.",
      notes: "ozone, métal chaud, aldéhydes, galbanum, encens électrique, poivre noir",
      sensation: "électrique, tendue, vibrante, instable",
      color: "from-purple-800/20 to-blue-900/20",
      borderColor: "border-l-purple-600",
      molecules: "Aldéhydes, Galbanum, Poivre noir, Encens, Ozone synthétique",
      accords: "Ozone + Métal + Électricité",
    },
    {
      code: "V.4",
      name: "VOLCANIQUE TELLURIQUE",
      icon: Skull,
      atmosphere: "Profondeurs de la terre, magma dormant, pression géologique. Force souterraine.",
      notes: "terre profonde, racines brûlées, vétiver noir, patchouli fumé, oud tellurique",
      sensation: "profonde, lourde, menaçante, ancestrale",
      color: "from-stone-900/20 to-amber-950/20",
      borderColor: "border-l-stone-700",
      molecules: "Vétiver, Patchouli, Oud, Costus, Angélique racine",
      accords: "Terre profonde + Racines + Magma",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Introduction */}
      <div className="prose prose-invert max-w-none">
        <p className="text-lg text-muted-foreground leading-relaxed">
          La gamme <strong>Volcanique</strong> explore les odeurs nées du feu terrestre : 
          lave, cendres, soufre et pierre fondue. Ces accords évoquent la puissance 
          créatrice et destructrice des forces géologiques.
        </p>
      </div>

      {/* Axes Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1">
        {axes.map((axe) => {
          const Icon = axe.icon;
          return (
            <Card 
              key={axe.code} 
              className={`border-l-4 ${axe.borderColor} bg-gradient-to-r ${axe.color} hover:shadow-lg transition-all duration-300`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-background/50">
                    <Icon className="h-5 w-5 text-foreground" />
                  </div>
                  <div>
                    <Badge variant="outline" className="mb-1">{axe.code}</Badge>
                    <CardTitle className="text-lg">{axe.name}</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <CardDescription className="text-base italic">
                  "{axe.atmosphere}"
                </CardDescription>
                
                <div className="grid gap-3 text-sm">
                  <div>
                    <span className="font-medium text-foreground">Notes : </span>
                    <span className="text-muted-foreground">
                      {molecules ? linkifyMoleculeNames(axe.notes, molecules) : axe.notes}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-foreground">Molécules clés : </span>
                    <span className="text-muted-foreground">{axe.molecules}</span>
                  </div>
                  <div>
                    <span className="font-medium text-foreground">Accords : </span>
                    <span className="text-muted-foreground">{axe.accords}</span>
                  </div>
                  <div>
                    <span className="font-medium text-foreground">Sensation : </span>
                    <span className="text-muted-foreground">{axe.sensation}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Connexions */}
      <GammesConnexes currentGamme="volcanique" />
    </div>
  );
}
