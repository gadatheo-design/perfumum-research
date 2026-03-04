// @ts-nocheck
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { 
  Radar, FlaskConical, BarChart3, Network, Calculator, Database, 
  ArrowRight, Beaker, MapPin, FileText, Scale
} from "lucide-react";

export default function OutilsOverviewContent() {
  const tools = [
    {
      icon: Radar,
      title: "Compare-Radar",
      description: "Superposition de profils olfactifs pour comparer jusqu'à 4 molécules sur 6 axes perceptifs",
      href: "/compare-radar",
      status: "Actif",
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-50 dark:bg-purple-950/40",
      category: "visualisations"
    },
    {
      icon: Calculator,
      title: "Calculateur de Dilution",
      description: "Calcul des dilutions et concentrations pour la formulation de parfums",
      href: "/outils/dilution",
      status: "Actif",
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-50 dark:bg-blue-950/40",
      category: "calculateurs"
    },
    {
      icon: Scale,
      title: "Calculateur IFRA",
      description: "Vérification de la conformité aux normes IFRA pour vos formulations",
      href: "/calculateur-ifra",
      status: "Actif",
      color: "text-red-600 dark:text-red-400",
      bgColor: "bg-red-50 dark:bg-red-950/40",
      category: "calculateurs"
    },
    {
      icon: FlaskConical,
      title: "Éditeur de Formulation",
      description: "Créez et modifiez vos formules olfactives avec un éditeur visuel complet",
      href: "/outils/editeur-formulation",
      status: "Actif",
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-50 dark:bg-green-950/40",
      category: "formulation"
    },
    {
      icon: Network,
      title: "Suggestions Synergies IA",
      description: "Algorithme de similarité radar pour identifier des paires de molécules compatibles",
      href: "/suggestions-synergies",
      status: "Actif",
      color: "text-orange-600 dark:text-orange-400",
      bgColor: "bg-orange-50 dark:bg-orange-950/40",
      category: "synergies"
    },
    {
      icon: BarChart3,
      title: "Matrice de Synergies",
      description: "Visualisation matricielle des compatibilités entre molécules",
      href: "/matrice-synergies",
      status: "Actif",
      color: "text-amber-600 dark:text-amber-400",
      bgColor: "bg-amber-50 dark:bg-amber-950/40",
      category: "synergies"
    },
    {
      icon: Calculator,
      title: "Calculateur de Coût",
      description: "Estimation du coût de production pour les formules (matières premières + fournisseurs)",
      href: "/outils/calculateur-cout",
      status: "Actif",
      color: "text-cyan-600 dark:text-cyan-400",
      bgColor: "bg-cyan-50 dark:bg-cyan-950/40",
      category: "calculateurs"
    },
    {
      icon: Beaker,
      title: "Enrichissement PubChem",
      description: "Enrichir automatiquement les molécules avec les données scientifiques depuis PubChem",
      href: "/outils/enrichissement-pubchem",
      status: "Actif",
      color: "text-emerald-600 dark:text-emerald-400",
      bgColor: "bg-emerald-50 dark:bg-emerald-950/40",
      category: "formulation"
    },
    {
      icon: MapPin,
      title: "Carte des Origines",
      description: "Carte géographique interactive des terroirs de production des ingrédients parfumés",
      href: "/outils/carte-origines",
      status: "Actif",
      color: "text-rose-600 dark:text-rose-400",
      bgColor: "bg-rose-50 dark:bg-rose-950/40",
      category: "visualisations"
    },
    {
      icon: FileText,
      title: "Générateur de Formules",
      description: "Génération automatique de formules basées sur des critères olfactifs",
      href: "/outils/generateur-formules",
      status: "Actif",
      color: "text-indigo-600 dark:text-indigo-400",
      bgColor: "bg-indigo-50 dark:bg-indigo-950/40",
      category: "formulation"
    },
  ];

  const categories = [
    { id: "calculateurs", label: "Calculateurs", count: tools.filter(t => t.category === "calculateurs").length },
    { id: "formulation", label: "Formulation", count: tools.filter(t => t.category === "formulation").length },
    { id: "synergies", label: "Synergies", count: tools.filter(t => t.category === "synergies").length },
    { id: "visualisations", label: "Visualisations", count: tools.filter(t => t.category === "visualisations").length },
  ];

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {categories.map((cat) => (
          <Card key={cat.id} className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-primary">{cat.count}</div>
              <div className="text-sm text-muted-foreground">{cat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <Card 
              key={tool.title} 
              className={`${tool.bgColor} border-border/50 hover:shadow-lg transition-all duration-300`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl bg-background/50`}>
                    <Icon className={`h-6 w-6 ${tool.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <CardTitle className="text-lg">{tool.title}</CardTitle>
                      <Badge variant="secondary" className="text-xs">{tool.status}</Badge>
                    </div>
                    <Badge variant="outline" className="text-xs capitalize">{tool.category}</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <CardDescription className="text-sm">
                  {tool.description}
                </CardDescription>
                
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

      {/* Future Tools */}
      <Card className="border-dashed border-2 border-muted-foreground/20">
        <CardHeader>
          <CardTitle className="text-lg text-muted-foreground">Outils en développement</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-muted/50">
              <h4 className="font-medium mb-1">Générateur d'Accords IA</h4>
              <p className="text-sm text-muted-foreground">Proposition automatique d'accords basés sur les profils radar</p>
            </div>
            <div className="p-4 rounded-lg bg-muted/50">
              <h4 className="font-medium mb-1">Simulateur de Maturation</h4>
              <p className="text-sm text-muted-foreground">Prédiction de l'évolution olfactive selon le temps de cure</p>
            </div>
            <div className="p-4 rounded-lg bg-muted/50">
              <h4 className="font-medium mb-1">Comparateur Multi-Recettes</h4>
              <p className="text-sm text-muted-foreground">Analyse comparative avec visualisation radar superposée</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
