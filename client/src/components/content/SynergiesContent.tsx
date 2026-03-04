// @ts-nocheck
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Network, BarChart3, Sparkles, GitBranch, ArrowRight } from "lucide-react";

export default function SynergiesContent() {
  const tools = [
    {
      icon: Sparkles,
      title: "Suggestions Synergies IA",
      description: "Algorithme de similarité radar pour identifier des paires de molécules compatibles. Basé sur l'analyse des profils olfactifs et des interactions connues.",
      href: "/suggestions-synergies",
      features: ["Analyse IA", "Score de compatibilité", "Suggestions personnalisées"],
      color: "text-orange-600 dark:text-orange-400",
      bgGradient: "from-orange-500/10 to-amber-500/10"
    },
    {
      icon: BarChart3,
      title: "Matrice de Synergies",
      description: "Visualisation matricielle des compatibilités entre molécules. Identifiez rapidement les meilleures combinaisons pour vos formulations.",
      href: "/matrice-synergies",
      features: ["Matrice interactive", "Filtres avancés", "Export données"],
      color: "text-amber-600 dark:text-amber-400",
      bgGradient: "from-amber-500/10 to-yellow-500/10"
    },
    {
      icon: Network,
      title: "Graphe de Synergies",
      description: "Visualisation en réseau des relations entre molécules. Explorez les connexions et découvrez des combinaisons inattendues.",
      href: "/synergies",
      features: ["Graphe interactif", "Clusters", "Navigation visuelle"],
      color: "text-purple-600 dark:text-purple-400",
      bgGradient: "from-purple-500/10 to-violet-500/10"
    },
    {
      icon: GitBranch,
      title: "Heatmap de Corrélation",
      description: "Carte de chaleur des corrélations entre profils radar. Identifiez les patterns et les groupes de molécules similaires.",
      href: "/radar-correlation-heatmap",
      features: ["Heatmap", "Clustering", "Analyse statistique"],
      color: "text-rose-600 dark:text-rose-400",
      bgGradient: "from-rose-500/10 to-pink-500/10"
    },
  ];

  return (
    <div className="space-y-8">
      {/* Introduction */}
      <div className="prose prose-invert max-w-none">
        <p className="text-lg text-muted-foreground leading-relaxed">
          Les outils de synergies PERFUMUM vous aident à identifier les meilleures 
          combinaisons de molécules pour créer des accords harmonieux et innovants.
        </p>
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <Card 
              key={tool.title} 
              className={`bg-gradient-to-br ${tool.bgGradient} border-border/50 hover:shadow-lg transition-all duration-300`}
            >
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-background/50">
                    <Icon className={`h-8 w-8 ${tool.color}`} />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-2">{tool.title}</CardTitle>
                    <CardDescription className="text-sm">
                      {tool.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Features */}
                <div className="flex flex-wrap gap-2">
                  {tool.features.map((feature) => (
                    <span 
                      key={feature} 
                      className="px-2 py-1 text-xs rounded-full bg-background/50 text-foreground/80"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
                
                <Link href={tool.href}>
                  <Button className="w-full group">
                    Explorer
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Synergy Concepts */}
      <Card className="bg-muted/30">
        <CardHeader>
          <CardTitle className="text-lg">Comprendre les synergies olfactives</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-sm prose-invert max-w-none">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-medium text-foreground mb-2">Synergie additive</h4>
              <p className="text-sm text-muted-foreground">
                L'effet combiné est égal à la somme des effets individuels. 
                Les molécules se renforcent mutuellement.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-foreground mb-2">Synergie potentialisante</h4>
              <p className="text-sm text-muted-foreground">
                L'effet combiné est supérieur à la somme. 
                Certaines molécules amplifient l'effet des autres.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-foreground mb-2">Effet d'entourage</h4>
              <p className="text-sm text-muted-foreground">
                Les composés mineurs modulent l'effet des composés majeurs, 
                créant une complexité olfactive unique.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
