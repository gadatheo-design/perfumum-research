import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Beaker, Dna, Microscope, Leaf } from "lucide-react";
import { GammesConnexes } from "@/components/GammesConnexes";
import { trpc } from "@/lib/trpc";
import { linkifyMoleculeNames } from "@/lib/linkifyMolecules";

export default function BioLabContent() {
  const { data: molecules } = trpc.molecules.list.useQuery();

  const axes = [
    {
      code: "B.1",
      name: "BIO-LAB FERMENTATION",
      icon: Beaker,
      atmosphere: "Levures actives, fermentation lactique, transformation organique. Vie microscopique.",
      notes: "levure, pain chaud, miel fermenté, acide lactique, kombucha, vinaigre doux",
      sensation: "vivante, chaude, transformative, nourricière",
      color: "from-amber-600/20 to-yellow-700/20",
      borderColor: "border-l-amber-600",
      molecules: "Acétaldéhyde, Acide lactique, Esters fruités, Diacétyle, Furfural",
      accords: "Levure + Miel + Fermentation",
    },
    {
      code: "B.2",
      name: "BIO-LAB MYCÉLIUM",
      icon: Dna,
      atmosphere: "Réseau fongique, spores en suspension, communication souterraine. Intelligence distribuée.",
      notes: "champignon frais, truffe, terre humide, mousse, bois en décomposition",
      sensation: "mystérieuse, connectée, souterraine, ancienne",
      color: "from-stone-600/20 to-amber-800/20",
      borderColor: "border-l-stone-600",
      molecules: "1-Octen-3-ol (champignon), Géosmine, Bis(méthylthio)méthane, Vétiver",
      accords: "Champignon + Terre + Réseau",
    },
    {
      code: "B.3",
      name: "BIO-LAB CHLOROPHYLLE",
      icon: Leaf,
      atmosphere: "Photosynthèse active, sève montante, croissance végétale. Énergie verte.",
      notes: "feuille verte, sève, herbe coupée, chlorophylle, galbanum, violette feuille",
      sensation: "fraîche, vivante, énergique, printanière",
      color: "from-green-600/20 to-emerald-700/20",
      borderColor: "border-l-green-600",
      molecules: "Cis-3-Hexénol, Galbanum, Feuille de violette, Chlorophylle, Lierre",
      accords: "Feuille + Sève + Photosynthèse",
    },
    {
      code: "B.4",
      name: "BIO-LAB MICROBIOME",
      icon: Microscope,
      atmosphere: "Cultures bactériennes, peau vivante, écosystème corporel. Intimité biologique.",
      notes: "peau chaude, musc animal, sueur propre, lait, ambre gris, civette",
      sensation: "intime, animale, vivante, authentique",
      color: "from-rose-600/20 to-pink-700/20",
      borderColor: "border-l-rose-600",
      molecules: "Muscs, Ambre gris, Civette, Castoreum, Lactones",
      accords: "Peau + Musc + Vie",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Introduction */}
      <div className="prose prose-invert max-w-none">
        <p className="text-lg text-muted-foreground leading-relaxed">
          La gamme <strong>Bio-Lab</strong> explore les odeurs de la vie microscopique : 
          fermentation, mycélium, chlorophylle et microbiome. Ces accords célèbrent 
          les processus biologiques invisibles qui façonnent notre monde olfactif.
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
      <GammesConnexes currentGamme="bio-lab" />
    </div>
  );
}
