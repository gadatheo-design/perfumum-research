import { Header } from "@/components/layout/Header";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { Radar, FlaskConical, BarChart3, Network, Calculator, Database, ArrowRight } from "lucide-react";

// Cette page est conçue pour être extensible : ajoutez de nouveaux outils
// en ajoutant des entrées dans le tableau tools ci-dessous

export default function Outils() {
  const tools = [
    {
      icon: Radar,
      title: "Compare-Radar",
      description: "Superposition de profils olfactifs pour comparer jusqu'à 4 molécules sur 6 axes perceptifs",
      href: "/compare-radar",
      status: "Actif",
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      icon: FlaskConical,
      title: "Recherche Molécules",
      description: "Filtres avancés : profil olfactif, 6 axes radar, propriétés chimiques (13 critères combinés)",
      href: "/molecules",
      status: "Actif",
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      icon: BarChart3,
      title: "Dashboard Statistiques",
      description: "Vue d'ensemble analytique : distribution familles, top 10 molécules, évolution recettes",
      href: "/dashboard",
      status: "Actif",
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      icon: Network,
      title: "Suggestions Synergies IA",
      description: "Algorithme de similarité radar pour identifier des paires de molécules compatibles",
      href: "/suggestions-synergies",
      status: "Actif",
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    },
    {
      icon: Calculator,
      title: "Calculateur de Coût",
      description: "Estimation du coût de production pour les formules (matières premières + fournisseurs)",
      href: "/calculateur-cout",
      status: "Actif",
      color: "text-cyan-600",
      bgColor: "bg-cyan-50"
    },
    {
      icon: Database,
      title: "Base de Données Complète",
      description: "Accès centralisé : 138 molécules, 142 recettes, 25 accords, 4 prototypes, 26 traditions",
      href: "/laboratoire",
      status: "Actif",
      color: "text-pink-600",
      bgColor: "bg-pink-50"
    }
  ];

  const futureTools = [
    {
      title: "Générateur d'Accords IA",
      description: "Proposition automatique d'accords basés sur les profils radar et synergies moléculaires"
    },
    {
      title: "Simulateur de Maturation",
      description: "Prédiction de l'évolution olfactive d'une formule selon le temps de cure"
    },
    {
      title: "Comparateur Multi-Recettes",
      description: "Analyse comparative de plusieurs recettes avec visualisation radar superposée"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Breadcrumbs />
      <Header />
      
      <main className="flex-1">
        {/* Hero */}
        <section className="py-16 bg-gradient-to-b from-muted/30 to-background">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
                Outils de Recherche
              </h1>
              <p className="text-xl text-muted-foreground mb-4">
                Suite d'outils analytiques pour explorer, comparer et analyser les données olfactives de Perfumum.
              </p>
              <div className="prose prose-lg max-w-none">
                <p className="text-muted-foreground">
                  Ces outils ont été développés pour faciliter la recherche olfactive : comparaison de profils radar, filtres multi-critères, suggestions de synergies, calculs de coût. Chaque outil est conçu pour être extensible et s'enrichir au fil du projet.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Outils Actifs */}
        <section className="py-16">
          <div className="container">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl font-bold mb-8">Outils Disponibles</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {tools.map((tool, index) => {
                  const Icon = tool.icon;
                  return (
                    <Link key={index} href={tool.href}>
                      <Card className="hover:shadow-lg transition-shadow duration-300 cursor-pointer h-full">
                        <CardHeader>
                          <div className="flex items-start gap-4 mb-2">
                            <div className={`w-12 h-12 rounded-lg ${tool.bgColor} flex items-center justify-center flex-shrink-0`}>
                              <Icon className={`h-6 w-6 ${tool.color}`} />
                            </div>
                            <div className="flex-1">
                              <CardTitle className="text-xl mb-2">{tool.title}</CardTitle>
                              <Badge variant="secondary">{tool.status}</Badge>
                            </div>
                          </div>
                          <CardDescription className="text-base">
                            {tool.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center gap-2 text-primary font-semibold">
                            Accéder à l'outil
                            <ArrowRight className="h-4 w-4" />
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Outils Futurs */}
        <section className="py-16 bg-muted/20">
          <div className="container">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl font-bold mb-8">En Développement</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {futureTools.map((tool, index) => (
                  <Card key={index} className="border-dashed">
                    <CardHeader>
                      <CardTitle className="text-lg">{tool.title}</CardTitle>
                      <CardDescription className="text-sm">
                        {tool.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Badge variant="outline">Planifié 2025-2026</Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Méthodologie */}
        <section className="py-16">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-6">Approche Méthodologique</h2>
              <div className="prose prose-lg max-w-none">
                <p className="text-muted-foreground mb-4">
                  Chaque outil est conçu selon une approche scientifique : algorithmes documentés, sources de données traçables, résultats reproductibles. Les suggestions de synergies utilisent la distance euclidienne sur 6 axes radar. Les filtres multi-critères combinent profil olfactif, propriétés chimiques et valeurs radar.
                </p>
                <p className="text-muted-foreground">
                  Ces outils ne remplacent pas l'expertise humaine mais la complètent en révélant des patterns et des connexions qui pourraient passer inaperçus dans une base de données de 138 molécules et 142 recettes.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
