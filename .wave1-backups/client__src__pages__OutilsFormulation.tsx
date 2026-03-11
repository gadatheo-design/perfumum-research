// @ts-nocheck
import { Link } from "wouter";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Calculator, 
  TrendingUp, 
  Sparkles, 
  BarChart3, 
  ArrowRight,
  Beaker,
  Network
} from "lucide-react";

interface Tool {
  id: string;
  title: string;
  description: string;
  path: string;
  icon: React.ReactNode;
  color: string;
  features: string[];
  badge?: string;
}

export default function OutilsFormulation() {
  const tools: Tool[] = [
    {
      id: "calculateur",
      title: "Calculateur de Proportions",
      description: "Créez et optimisez vos formules terpéniques avec un outil interactif complet",
      path: "/calculateur",
      icon: <Calculator className="w-6 h-6" />,
      color: "violet",
      badge: "Nouveau",
      features: [
        "7 sliders terpènes (0-100%)",
        "Validation automatique total = 100%",
        "Calcul grammes pour batch personnalisé",
        "Prévisualisation profil radar",
        "Sauvegarde formules favorites",
        "Export CSV"
      ]
    },
    {
      id: "analyses",
      title: "Analyses de Corrélations",
      description: "Découvrez quels terpènes apparaissent ensemble dans vos recettes",
      path: "/analyses",
      icon: <TrendingUp className="w-6 h-6" />,
      color: "green",
      badge: "Nouveau",
      features: [
        "Matrice 7×7 co-occurrences",
        "Heatmap interactive",
        "Top 5 combinaisons fréquentes",
        "Suggestions optimales",
        "Statistiques détaillées",
        "Export CSV"
      ]
    },
    {
      id: "matrice",
      title: "Matrice de Synergies",
      description: "Explorez les interactions entre terpènes avec une matrice interactive",
      path: "/matrice-synergies",
      icon: <Sparkles className="w-6 h-6" />,
      color: "orange",
      features: [
        "21 combinaisons terpéniques",
        "Effets synergiques documentés",
        "Visualisation interactive",
        "Filtres par terpène",
        "Notes de recherche"
      ]
    },
    {
      id: "comparateur",
      title: "Comparateur Radar",
      description: "Comparez visuellement les profils olfactifs de plusieurs formules",
      path: "/compare-radar",
      icon: <BarChart3 className="w-6 h-6" />,
      color: "blue",
      features: [
        "Superposition de profils",
        "Jusqu'à 4 formules simultanées",
        "Diagrammes radar interactifs",
        "Analyse comparative",
        "Export visualisations"
      ]
    },
    {
      id: "comparateur-terpenes",
      title: "Comparateur de Terpènes",
      description: "Analysez et comparez les propriétés de 2 à 4 terpènes côte à côte",
      path: "/compare-terpenes",
      icon: <Beaker className="w-6 h-6" />,
      color: "pink",
      features: [
        "Comparaison 2-4 terpènes",
        "Propriétés détaillées",
        "Profils olfactifs",
        "Points d'ébullition",
        "Effets thérapeutiques"
      ]
    },
    {
      id: "graphe",
      title: "Graphe Molécules-Recettes",
      description: "Visualisez les relations entre molécules et recettes avec D3.js",
      path: "/graphe-molecules-recettes",
      icon: <Network className="w-6 h-6" />,
      color: "cyan",
      features: [
        "Graphe interactif D3.js",
        "Relations molécules-recettes",
        "Navigation visuelle",
        "Filtres dynamiques",
        "Zoom et pan"
      ]
    }
  ];

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; text: string; border: string; hover: string }> = {
      violet: {
        bg: "bg-violet-50 dark:bg-violet-950/20",
        text: "text-violet-600 dark:text-violet-400",
        border: "border-violet-200 dark:border-violet-800",
        hover: "hover:border-violet-400 dark:hover:border-violet-600"
      },
      green: {
        bg: "bg-green-50 dark:bg-green-950/20",
        text: "text-green-600 dark:text-green-400",
        border: "border-green-200 dark:border-green-800",
        hover: "hover:border-green-400 dark:hover:border-green-600"
      },
      orange: {
        bg: "bg-orange-50 dark:bg-orange-950/20",
        text: "text-orange-600 dark:text-orange-400",
        border: "border-orange-200 dark:border-orange-800",
        hover: "hover:border-orange-400 dark:hover:border-orange-600"
      },
      blue: {
        bg: "bg-blue-50 dark:bg-blue-950/20",
        text: "text-blue-600 dark:text-blue-400",
        border: "border-blue-200 dark:border-blue-800",
        hover: "hover:border-blue-400 dark:hover:border-blue-600"
      },
      pink: {
        bg: "bg-pink-50 dark:bg-pink-950/20",
        text: "text-pink-600 dark:text-pink-400",
        border: "border-pink-200 dark:border-pink-800",
        hover: "hover:border-pink-400 dark:hover:border-pink-600"
      },
      cyan: {
        bg: "bg-cyan-50 dark:bg-cyan-950/20",
        text: "text-cyan-600 dark:text-cyan-400",
        border: "border-cyan-200 dark:border-cyan-800",
        hover: "hover:border-cyan-400 dark:hover:border-cyan-600"
      }
    };
    return colors[color] || colors.violet;
  };

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container max-w-7xl mx-auto px-4">
        <Breadcrumbs />
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-3 mb-4">
            <Beaker className="w-10 h-10 text-primary" />
            <h1 className="text-5xl font-bold">Outils de Formulation</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Une suite complète d'outils pour créer, analyser et optimiser vos formules terpéniques
          </p>
        </div>

        {/* Tools Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => {
            const colorClasses = getColorClasses(tool.color);
            return (
              <Card
                key={tool.id}
                className={`border-2 ${colorClasses.border} ${colorClasses.hover} transition-all duration-300 hover:shadow-lg`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between mb-3">
                    <div className={`p-3 rounded-lg ${colorClasses.bg}`}>
                      <div className={colorClasses.text}>{tool.icon}</div>
                    </div>
                    {tool.badge && (
                      <Badge variant="secondary" className="text-xs">
                        {tool.badge}
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-xl">{tool.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{tool.description}</p>

                  {/* Features */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Fonctionnalités
                    </h4>
                    <ul className="space-y-1">
                      {tool.features.map((feature, idx) => (
                        <li key={idx} className="text-sm flex items-start gap-2">
                          <span className={`mt-1 ${colorClasses.text}`}>•</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* CTA */}
                  <Link href={tool.path}>
                    <Button className="w-full group" variant="outline">
                      Utiliser l'outil
                      <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Footer Info */}
        <div className="mt-12 p-6 bg-muted/50 rounded-lg">
          <h3 className="font-semibold mb-2">💡 Conseil d'utilisation</h3>
          <p className="text-sm text-muted-foreground">
            Commencez par le <strong>Calculateur de Proportions</strong> pour créer votre formule, puis utilisez les{" "}
            <strong>Analyses de Corrélations</strong> pour découvrir les combinaisons éprouvées. Enfin, visualisez
            votre profil avec le <strong>Comparateur Radar</strong> pour l'affiner.
          </p>
        </div>
      </div>
    </div>
  );
}
