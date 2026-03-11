import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Snowflake, Wind, Mountain, Waves } from "lucide-react";
import { GammesConnexes } from "@/components/GammesConnexes";
import { trpc } from "@/lib/trpc";
import { linkifyMoleculeNames } from "@/lib/linkifyMolecules";

export default function GlaciaireContent() {
  const { data: molecules } = trpc.molecules.list.useQuery();

  const axes = [
    {
      code: "G.1",
      name: "GLACIAIRE ARCTIQUE",
      icon: Snowflake,
      atmosphere: "Glace éternelle, air cristallin, silence polaire. Pureté absolue.",
      notes: "menthe glaciale, eucalyptus, aldéhydes froids, musc blanc, iris poudré",
      sensation: "pure, cristalline, silencieuse, immobile",
      color: "from-cyan-500/20 to-blue-600/20",
      borderColor: "border-l-cyan-500",
      molecules: "Menthol, Eucalyptol, Aldéhydes C11-C12, Musc blanc, Iris",
      accords: "Glace + Air pur + Silence",
    },
    {
      code: "G.2",
      name: "GLACIAIRE ALPIN",
      icon: Mountain,
      atmosphere: "Neige fraîche, pin givré, air de haute altitude. Respiration pure.",
      notes: "pin sylvestre, sapin, neige fraîche, air froid, mousse alpine, lichen",
      sensation: "fraîche, vivifiante, pure, élevée",
      color: "from-emerald-600/20 to-teal-700/20",
      borderColor: "border-l-emerald-600",
      molecules: "Alpha-pinène, Bornéol, Camphre, Mousse de chêne, Cèdre",
      accords: "Pin + Neige + Altitude",
    },
    {
      code: "G.3",
      name: "GLACIAIRE OCÉANIQUE",
      icon: Waves,
      atmosphere: "Iceberg flottant, sel marin gelé, brume arctique. Immensité froide.",
      notes: "sel marin, algues froides, calone, ambre gris, musc marin, ozone",
      sensation: "vaste, froide, saline, mystérieuse",
      color: "from-blue-700/20 to-indigo-800/20",
      borderColor: "border-l-blue-600",
      molecules: "Calone, Ambre gris, Muscs marins, Aldéhydes, Hélional",
      accords: "Sel + Glace + Océan",
    },
    {
      code: "G.4",
      name: "GLACIAIRE MINÉRAL",
      icon: Wind,
      atmosphere: "Roche gelée, cristaux de glace, minéralité froide. Structure cristalline.",
      notes: "pierre froide, quartz, aldéhydes métalliques, encens blanc, vétiver glacé",
      sensation: "dure, cristalline, géométrique, intemporelle",
      color: "from-slate-500/20 to-gray-600/20",
      borderColor: "border-l-slate-500",
      molecules: "Aldéhydes, Encens blanc, Vétiver, Ambrox, Iso E Super",
      accords: "Pierre + Cristal + Froid",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Introduction */}
      <div className="prose prose-invert max-w-none">
        <p className="text-lg text-muted-foreground leading-relaxed">
          La gamme <strong>Glaciaire</strong> explore les odeurs du froid extrême : 
          glace, neige, air arctique et minéralité gelée. Ces accords évoquent 
          la pureté, le silence et l'immensité des paysages polaires.
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
      <GammesConnexes currentGamme="glaciaire" relatedGammes={["petrichor", "volcanique", "biolab", "pheromones"]} />
    </div>
  );
}
