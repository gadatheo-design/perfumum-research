import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Droplets, Mountain, Building2, Ghost } from "lucide-react";
import { GammesConnexes } from "@/components/GammesConnexes";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { linkifyMoleculeNames } from "@/lib/linkifyMolecules";

export default function PetrichorContent() {
  const { data: molecules } = trpc.molecules.list.useQuery();

  const axes = [
    {
      code: "P.1",
      name: "PÉTRICHOR SOUTERRAIN",
      icon: Mountain,
      atmosphere: "Humus. Racines. Terre noire gorgée d'eau. Profondeur tellurique.",
      notes: "géosmine, spikenard, vétiver humide, bois mouillé, angélique, mitti attar, patchouli terre, mousse chêne",
      sensation: "profonde, lente, organique, enveloppante",
      color: "from-amber-900/20 to-stone-900/20",
      borderColor: "border-l-amber-700",
      molecules: "Géosmine (marqueur principal), Spikenard, Vétiver, Patchouli, Angélique racine",
      accords: "Terre humide + Bois mouillé + Racines",
    },
    {
      code: "P.2",
      name: "PÉTRICHOR URBAIN",
      icon: Building2,
      atmosphere: "Asphalte sous la pluie, pierre froide, tension électrique. Ozone métallique.",
      notes: "aldéhydes froids, ozone, bitume propre, pierre humide, encens froid, cèdre Atlas, calone",
      sensation: "électrique, nette, rapide, minérale",
      color: "from-slate-500/20 to-blue-900/20",
      borderColor: "border-l-slate-600",
      molecules: "Calone (note ozone), Aldéhydes C10-C12, Encens, Cèdre Atlas, Galbanum",
      accords: "Ozone + Pierre humide + Métal froid",
    },
    {
      code: "P.3",
      name: "PÉTRICHOR FANTÔME",
      icon: Ghost,
      atmosphere: "Papier humide, poussière en suspension, silence après la pluie. Mémoire résiduelle.",
      notes: "violette poussière, encens éteint, pierre poreuse, iris poudre, héliotropine, muscs blancs",
      sensation: "spectrale, résiduelle, évanescente",
      color: "from-violet-300/20 to-gray-400/20",
      borderColor: "border-l-violet-400",
      molecules: "Ionones (violette), Iris, Héliotropine, Muscs blancs, Encens Oliban",
      accords: "Violette poudre + Papier ancien + Silence",
    },
    {
      code: "P.4",
      name: "PÉTRICHOR FORESTIER",
      icon: Droplets,
      atmosphere: "Forêt après l'orage. Feuilles mouillées, écorce gorgée, champignons.",
      notes: "cis-3-hexénol, feuille violette, mousse chêne, cèdre, pin humide, champignon, sous-bois",
      sensation: "vivante, fraîche, verte, humide",
      color: "from-green-800/20 to-emerald-900/20",
      borderColor: "border-l-green-700",
      molecules: "Cis-3-Hexénol (feuille coupée), Pin, Cèdre, Mousse chêne, Vétiver",
      accords: "Feuille mouillée + Écorce + Champignon",
    },
    {
      code: "P.5",
      name: "PÉTRICHOR MINÉRAL",
      icon: Mountain,
      atmosphere: "Pierre calcaire, craie mouillée, carrière après la pluie. Silence minéral.",
      notes: "pierre humide, craie, silex, encens froid, ambrox, cèdre Atlas, vétiver sec",
      sensation: "froide, sèche, austère, contemplative",
      color: "from-stone-400/20 to-gray-600/20",
      borderColor: "border-l-stone-500",
      molecules: "Ambrox, Encens Oliban, Cèdre Atlas, Vétiver, Galbanum",
      accords: "Pierre + Craie + Silence",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Introduction */}
      <div className="prose prose-invert max-w-none">
        <p className="text-lg text-muted-foreground leading-relaxed">
          La gamme <strong>Pétrichor</strong> explore l'odeur de la terre après la pluie, 
          cette fragrance unique née de la rencontre entre l'eau et les surfaces minérales ou organiques.
          Cinq axes explorent différentes facettes de ce phénomène olfactif universel.
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
      <GammesConnexes currentGamme="petrichor" />
    </div>
  );
}
