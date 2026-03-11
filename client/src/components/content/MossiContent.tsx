import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sun, Wheat, Drum, Flame } from "lucide-react";
import { GammesConnexes } from "@/components/GammesConnexes";
import { trpc } from "@/lib/trpc";
import { linkifyMoleculeNames } from "@/lib/linkifyMolecules";

export default function MossiContent() {
  const { data: molecules } = trpc.molecules.list.useQuery();

  const axes = [
    {
      code: "M.1",
      name: "MOSSI SAHÉLIEN",
      icon: Sun,
      atmosphere: "Terre sèche du Burkina Faso, soleil brûlant, poussière ocre. Chaleur ancestrale.",
      notes: "terre sèche, karité brut, néré, baobab, poussière, bois sec",
      sensation: "chaude, sèche, ancestrale, tellurique",
      color: "from-orange-700/20 to-amber-800/20",
      borderColor: "border-l-orange-700",
      molecules: "Composés terreux, Beurre de karité, Aldéhydes, Bois sec, Vétiver",
      accords: "Terre + Karité + Soleil",
    },
    {
      code: "M.2",
      name: "MOSSI CÉRÉALIER",
      icon: Wheat,
      atmosphere: "Champs de mil et sorgho, récolte dorée, grain torréfié. Abondance nourricière.",
      notes: "mil grillé, sorgho, fonio, arachide, sésame, miel de brousse",
      sensation: "nourricière, dorée, chaude, généreuse",
      color: "from-yellow-600/20 to-amber-700/20",
      borderColor: "border-l-yellow-600",
      molecules: "Maltol, Furfural, Pyrazines, Lactones, Aldéhydes",
      accords: "Céréale + Miel + Torréfaction",
    },
    {
      code: "M.3",
      name: "MOSSI RITUEL",
      icon: Drum,
      atmosphere: "Encens africain, résines sacrées, fumée cérémonielle. Spiritualité animiste.",
      notes: "encens oliban, myrrhe, benjoin, bois de santal, copal africain, fumée",
      sensation: "sacrée, fumée, méditative, ancestrale",
      color: "from-purple-700/20 to-indigo-800/20",
      borderColor: "border-l-purple-700",
      molecules: "Oliban, Myrrhe, Benjoin, Santal, Copal",
      accords: "Encens + Fumée + Sacré",
    },
    {
      code: "M.4",
      name: "MOSSI FORGE",
      icon: Flame,
      atmosphere: "Forge traditionnelle, fer chaud, charbon de bois, sueur du forgeron. Transformation.",
      notes: "métal chaud, charbon, cuir brûlé, sueur, terre cuite, fumée de bois",
      sensation: "chaude, métallique, transformative, puissante",
      color: "from-red-800/20 to-stone-800/20",
      borderColor: "border-l-red-800",
      molecules: "Composés métalliques, Cuir, Fumée, Castoreum, Labdanum",
      accords: "Métal + Feu + Transformation",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Introduction */}
      <div className="prose prose-invert max-w-none">
        <p className="text-lg text-muted-foreground leading-relaxed">
          La gamme <strong>Mossi</strong> rend hommage aux traditions olfactives du peuple Mossi 
          du Burkina Faso. Ces accords explorent les odeurs de la terre sahélienne, 
          des céréales ancestrales, des rituels sacrés et de l'artisanat traditionnel.
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
      <GammesConnexes currentGamme="civilisations" relatedGammes={["petrichor", "volcanique", "traditions", "signatures"]} />
    </div>
  );
}
