// @ts-nocheck
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Radar, MapPin, BarChart3, Network, GitBranch, ArrowRight } from "lucide-react";

export default function VisualisationsContent() {
  const tools = [
    {
      icon: Radar,
      title: "Compare-Radar",
      description: "Superposition de profils olfactifs pour comparer jusqu'à 4 molécules sur 6 axes perceptifs. Visualisez les différences et similitudes en un coup d'œil.",
      href: "/compare-radar",
      features: ["Jusqu'à 4 molécules", "6 axes perceptifs", "Export image"],
      color: "text-purple-600 dark:text-purple-400",
      bgGradient: "from-purple-500/10 to-violet-500/10"
    },
    {
      icon: MapPin,
      title: "Carte des Origines",
      description: "Carte géographique interactive des terroirs de production des ingrédients parfumés à travers le monde. Explorez les origines de vos matières premières.",
      href: "/outils/carte-origines",
      features: ["Carte interactive", "Filtres par région", "Données terroirs"],
      color: "text-rose-600 dark:text-rose-400",
      bgGradient: "from-rose-500/10 to-pink-500/10"
    },
    {
      icon: Network,
      title: "Graphe Molécules-Recettes",
      description: "Visualisation en réseau des relations entre molécules et recettes. Découvrez comment les ingrédients sont utilisés dans vos formulations.",
      href: "/graphe-molecules-recettes",
      features: ["Graphe interactif", "Zoom et pan", "Filtres dynamiques"],
      color: "text-blue-600 dark:text-blue-400",
      bgGradient: "from-blue-500/10 to-cyan-500/10"
    },
    {
      icon: GitBranch,
      title: "Graphe Plante-Molécule",
      description: "Exploration des liens entre plantes aromatiques et leurs molécules constitutives. Comprenez la composition chimique des sources naturelles.",
      href: "/graphe-plante-molecule",
      features: ["Relations botaniques", "Composition chimique", "Navigation intuitive"],
      color: "text-green-600 dark:text-green-400",
      bgGradient: "from-green-500/10 to-emerald-500/10"
    },
    {
      icon: BarChart3,
      title: "Dashboard Statistiques",
      description: "Vue d'ensemble analytique de la base de données : distribution des familles, top molécules, évolution des recettes dans le temps.",
      href: "/dashboard",
      features: ["Graphiques interactifs", "Métriques clés", "Tendances"],
      color: "text-amber-600 dark:text-amber-400",
      bgGradient: "from-amber-500/10 to-yellow-500/10"
    },
    {
      icon: Radar,
      title: "Sankey Flow",
      description: "Diagramme de flux Sankey pour visualiser les relations quantitatives entre familles olfactives, molécules et recettes.",
      href: "/sankey-flow",
      features: ["Flux quantitatifs", "Relations multiples", "Vue d'ensemble"],
      color: "text-indigo-600 dark:text-indigo-400",
      bgGradient: "from-indigo-500/10 to-purple-500/10"
    },
  ];

  return (
    <div className="space-y-8">
      {/* Introduction */}
      <div className="prose prose-invert max-w-none">
        <p className="text-lg text-muted-foreground leading-relaxed">
          Les outils de visualisation PERFUMUM transforment vos données en insights visuels : 
          graphes, cartes, radars et diagrammes pour explorer la base de données sous tous les angles.
        </p>
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <Card 
              key={tool.title} 
              className={`bg-gradient-to-br ${tool.bgGradient} border-border/50 hover:shadow-lg transition-all duration-300`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-background/50">
                    <Icon className={`h-6 w-6 ${tool.color}`} />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg">{tool.title}</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <CardDescription className="text-sm">
                  {tool.description}
                </CardDescription>
                
                {/* Features */}
                <div className="flex flex-wrap gap-1.5">
                  {tool.features.map((feature) => (
                    <span 
                      key={feature} 
                      className="px-2 py-0.5 text-xs rounded-full bg-background/50 text-foreground/80"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
                
                <Link href={tool.href}>
                  <Button variant="ghost" className="w-full group">
                    Ouvrir
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Visualization Tips */}
      <Card className="bg-muted/30">
        <CardHeader>
          <CardTitle className="text-lg">Conseils de visualisation</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-sm prose-invert max-w-none">
          <ul className="space-y-2 text-muted-foreground">
            <li>Utilisez le <strong>Compare-Radar</strong> pour identifier rapidement les différences entre molécules similaires</li>
            <li>La <strong>Carte des Origines</strong> est idéale pour planifier un sourcing géographiquement diversifié</li>
            <li>Les <strong>graphes de réseau</strong> révèlent des connexions inattendues entre ingrédients</li>
            <li>Le <strong>Dashboard</strong> offre une vue d'ensemble pour suivre l'évolution de votre base de données</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
