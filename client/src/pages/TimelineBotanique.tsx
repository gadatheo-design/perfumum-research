// @ts-nocheck
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Wind, 
  TreeDeciduous, 
  Sparkles, 
  ChevronRight,
  Leaf,
  Clock,
  Droplets,
  Sun,
  CloudRain
} from "lucide-react";

const timelineStages = [
  {
    id: "T0",
    title: "Plante vivante",
    subtitle: "Exposition",
    axis: "vent",
    axisLabel: "Vent",
    icon: <Leaf className="h-6 w-6" />,
    color: "from-sky-500 to-cyan-500",
    bgColor: "bg-sky-50 dark:bg-sky-950",
    borderColor: "border-sky-300 dark:border-sky-700",
    tabac: {
      state: "Feuille verte",
      odor: "Aqueuse, amère",
      molecules: ["cis-3-hexenol", "hexenals"],
      recipe: "R-11 Green Tobacco Headspace"
    },
    cannabis: {
      state: "Feuille + tige vivantes",
      odor: "Pinée, claire",
      molecules: ["α-pinène", "β-pinène", "terpinolène"],
      recipe: "R-15 Living Cannabis Vent"
    },
    climate: "Air ouvert. Présence instable. Impossible à fixer."
  },
  {
    id: "T1",
    title: "Transition",
    subtitle: "Jaunissement / Pré-séchage",
    axis: "vent-bois",
    axisLabel: "Vent → Bois",
    icon: <Sun className="h-6 w-6" />,
    color: "from-amber-400 to-yellow-500",
    bgColor: "bg-amber-50 dark:bg-amber-950",
    borderColor: "border-amber-300 dark:border-amber-700",
    tabac: {
      state: "Feuille jaunissante",
      odor: "Foin / fruit sec",
      molecules: ["β-damascenone (naissante)"],
      recipe: "R-12 Yellowing Leaf"
    },
    cannabis: {
      state: "Fleur fraîche",
      odor: "Expansion aromatique rapide",
      molecules: ["myrcène", "linalool"],
      recipe: "(Phase peu exploitée : trop narrative)"
    },
    climate: "Moment critique. Très court. Souvent absent des archives."
  },
  {
    id: "T2",
    title: "Séchage aéré",
    subtitle: "Structure",
    axis: "bois",
    axisLabel: "Bois",
    icon: <TreeDeciduous className="h-6 w-6" />,
    color: "from-amber-600 to-orange-600",
    bgColor: "bg-orange-50 dark:bg-orange-950",
    borderColor: "border-orange-300 dark:border-orange-700",
    tabac: {
      state: "Air-cured, ventilé",
      odor: "Feuille claire, sèche",
      molecules: ["megastigmatrienones", "solanone"],
      recipe: "R-13 Salted Air-Cured / PF-03 Architecture du Temps"
    },
    cannabis: {
      state: "Fleur sèche aérée",
      odor: "Non collante",
      molecules: ["β-caryophyllène", "limonène"],
      recipe: "R-05 Cannabis Clair / R-16 Dry Cannabis Leaf Incense"
    },
    climate: "Stabilité sèche. Temporalité lisible. Base de la plupart des traductions."
  },
  {
    id: "T3",
    title: "Réhydratation",
    subtitle: "Réactivation",
    axis: "bois-disparition",
    axisLabel: "Bois → Disparition",
    icon: <CloudRain className="h-6 w-6" />,
    color: "from-purple-500 to-violet-600",
    bgColor: "bg-purple-50 dark:bg-purple-950",
    borderColor: "border-purple-300 dark:border-purple-700",
    tabac: {
      state: "Feuille sèche réhydratée",
      odor: "Retour partiel du vivant",
      molecules: ["notes vertes réactivées"],
      recipe: "R-14 Rehydrated Tobacco Leaf"
    },
    cannabis: {
      state: "Feuille sèche exposée à humidité",
      odor: "Activation fugace des terpènes",
      molecules: ["terpènes réactivés"],
      recipe: "(Zone de recherche)"
    },
    climate: "Temps suspendu. Instable. Très peu documenté → zone de recherche."
  },
  {
    id: "T4",
    title: "Dissipation",
    subtitle: "Absence",
    axis: "disparition",
    axisLabel: "Disparition",
    icon: <Sparkles className="h-6 w-6" />,
    color: "from-slate-400 to-gray-500",
    bgColor: "bg-slate-50 dark:bg-slate-950",
    borderColor: "border-slate-300 dark:border-slate-700",
    tabac: {
      state: "Trace sans matière",
      odor: "Molécules résiduelles très faibles",
      molecules: ["traces"],
      recipe: "R-17 Terpene-Depleted Cannabis (logique miroir)"
    },
    cannabis: {
      state: "Profil appauvri volontairement",
      odor: "Présence fantôme",
      molecules: ["traces minimales"],
      recipe: "R-17 Terpene-Depleted Cannabis"
    },
    climate: "Sortie nette. L'archive devient absence."
  }
];

export default function TimelineBotanique() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white dark:from-emerald-950 dark:to-gray-900">
      {/* Header */}
      <div className="bg-emerald-900 text-white py-12 px-4">
        <div className="container max-w-6xl">
          <div className="flex items-center gap-2 text-emerald-300 text-sm mb-4">
            <Link href="/" className="hover:text-white transition-colors">Accueil</Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/leaf-economies" className="hover:text-white transition-colors">San Andrés</Link>
            <ChevronRight className="h-4 w-4" />
            <span>Timeline</span>
          </div>
          <h1 className="text-4xl font-bold mb-4">Ligne temporelle botanique</h1>
          <p className="text-emerald-200 text-lg max-w-2xl">
            Tabac & Cannabis comme processus vivants — de la plante à la disparition.
            Chaque état produit un climat distinct.
          </p>
        </div>
      </div>

      <div className="container max-w-6xl py-8 px-4">
        {/* Introduction */}
        <Card className="mb-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur">
          <CardContent className="p-6">
            <p className="text-muted-foreground">
              Cette cartographie ne classe pas par variétés commerciales, mais par <strong>états botaniques successifs</strong>. 
              Chaque état produit un <strong>climat distinct</strong>.
            </p>
          </CardContent>
        </Card>

        {/* Timeline horizontal scroll */}
        <div className="overflow-x-auto pb-4 -mx-4 px-4">
          <div className="flex gap-6 min-w-max">
            {timelineStages.map((stage, index) => (
              <div key={stage.id} className="flex items-start gap-4">
                {/* Stage card */}
                <Card className={`w-80 ${stage.bgColor} ${stage.borderColor} border-2`}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between mb-2">
                      <Badge className={`bg-gradient-to-r ${stage.color} text-white border-0`}>
                        {stage.id}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {stage.axisLabel}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`p-2 rounded-full bg-gradient-to-r ${stage.color} text-white`}>
                        {stage.icon}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{stage.title}</CardTitle>
                        <CardDescription>{stage.subtitle}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Tabac */}
                    <div className="space-y-2">
                      <h4 className="font-semibold text-amber-700 dark:text-amber-400 flex items-center gap-2">
                        <Leaf className="h-4 w-4" /> Tabac
                      </h4>
                      <div className="text-sm space-y-1 pl-6">
                        <p><span className="text-muted-foreground">État:</span> {stage.tabac.state}</p>
                        <p><span className="text-muted-foreground">Odeur:</span> {stage.tabac.odor}</p>
                        <p><span className="text-muted-foreground">Molécules:</span> {stage.tabac.molecules.join(", ")}</p>
                        <p className="text-xs text-emerald-600 dark:text-emerald-400">→ {stage.tabac.recipe}</p>
                      </div>
                    </div>

                    {/* Cannabis */}
                    <div className="space-y-2">
                      <h4 className="font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
                        <Leaf className="h-4 w-4" /> Cannabis
                      </h4>
                      <div className="text-sm space-y-1 pl-6">
                        <p><span className="text-muted-foreground">État:</span> {stage.cannabis.state}</p>
                        <p><span className="text-muted-foreground">Odeur:</span> {stage.cannabis.odor}</p>
                        <p><span className="text-muted-foreground">Molécules:</span> {stage.cannabis.molecules.join(", ")}</p>
                        <p className="text-xs text-emerald-600 dark:text-emerald-400">→ {stage.cannabis.recipe}</p>
                      </div>
                    </div>

                    {/* Climate */}
                    <div className="pt-2 border-t">
                      <p className="text-sm italic text-muted-foreground">
                        <Clock className="h-3 w-3 inline mr-1" />
                        {stage.climate}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Arrow connector */}
                {index < timelineStages.length - 1 && (
                  <div className="flex items-center self-center">
                    <ChevronRight className="h-8 w-8 text-muted-foreground" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-lg">Axes climatiques</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-gradient-to-r from-sky-500 to-cyan-500" />
                <span className="text-sm">Vent — ouverture, extérieur</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-gradient-to-r from-amber-600 to-orange-600" />
                <span className="text-sm">Bois — structure, durée</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-gradient-to-r from-purple-500 to-violet-600" />
                <span className="text-sm">Disparition — sortie, absence</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Links */}
        <div className="mt-8 flex flex-wrap gap-4">
          <Link href="/botanique-critique">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-4 flex items-center gap-3">
                <Leaf className="h-5 w-5 text-emerald-600" />
                <span>Lire le chapitre Botanique critique</span>
                <ChevronRight className="h-4 w-4" />
              </CardContent>
            </Card>
          </Link>
          <Link href="/leaf-economies">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-4 flex items-center gap-3">
                <Droplets className="h-5 w-5 text-emerald-600" />
                <span>Voir les échantillons Leaf Economies</span>
                <ChevronRight className="h-4 w-4" />
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
