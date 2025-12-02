import { Link } from "wouter";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Beaker, Droplet, Layers, BookOpen, ArrowRight } from "lucide-react";

export default function Laboratoire() {
  const sections = [
    {
      title: "Matières Premières",
      description: "Base de données complète des huiles essentielles, absolus, résinoïdes et autres matières utilisées",
      icon: Droplet,
      href: "/laboratoire/matieres",
      stats: "100+ matières",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Molécules",
      description: "Catalogue des molécules isolées avec leurs profils olfactifs et effets fonctionnels",
      icon: Beaker,
      href: "/molecules",
      stats: "100+ molécules",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Accords",
      description: "Combinaisons olfactives structurées formant des unités sensibles cohérentes",
      icon: Layers,
      href: "/accords",
      stats: "120+ accords",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Recettes",
      description: "Formulations complètes avec protocoles de fabrication et notes de développement",
      icon: BookOpen,
      href: "/laboratoire/recettes",
      stats: "160+ recettes",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero */}
        <section className="section-spacing bg-gradient-to-b from-background to-muted/30">
          <div className="container">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
                <Beaker className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
                Laboratoire
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Base de données complète pour la recherche et la formulation olfactive
              </p>
            </div>
          </div>
        </section>

        {/* Introduction */}
        <section className="py-16">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <p className="text-lg text-muted-foreground leading-relaxed">
                Le laboratoire constitue le <strong>cœur opérationnel</strong> du projet Perfumum. Il rassemble l'ensemble des ressources matérielles et conceptuelles nécessaires à la recherche-création olfactive : matières premières, analyses moléculaires, accords structurés et recettes documentées. Cette base de données est à la fois un outil de travail quotidien et une archive systématique de la recherche.
              </p>
            </div>

            {/* Sections Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {sections.map((section, index) => {
                const Icon = section.icon;
                return (
                  <Link key={index} href={section.href}>
                    <a className="block h-full">
                      <Card className="h-full transition-all hover:shadow-lg hover:-translate-y-1 duration-300 group">
                        <CardHeader>
                          <div className={`w-12 h-12 rounded-lg ${section.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                            <Icon className={`h-6 w-6 ${section.color}`} />
                          </div>
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <CardTitle className="text-2xl mb-2 group-hover:text-primary transition-colors">
                                {section.title}
                              </CardTitle>
                              <CardDescription className="text-sm font-medium">
                                {section.stats}
                              </CardDescription>
                            </div>
                            <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-muted-foreground">
                            {section.description}
                          </p>
                        </CardContent>
                      </Card>
                    </a>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* Methodology */}
        <section className="py-16 bg-muted/30">
          <div className="container">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold mb-8 text-center">
                Approche de Documentation
              </h2>
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Systématicité</CardTitle>
                  </CardHeader>
                  <CardContent className="text-muted-foreground">
                    Chaque matière, molécule, accord et recette est documenté selon un <strong>protocole standardisé</strong> : origine, profil olfactif, caractéristiques techniques, notes de manipulation, références bibliographiques. Cette systématicité permet la comparaison, l'analyse et la traçabilité.
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Interconnexions</CardTitle>
                  </CardHeader>
                  <CardContent className="text-muted-foreground">
                    La base de données n'est pas une simple liste mais un <strong>réseau de relations</strong>. Chaque élément est lié aux autres : quelles molécules composent cette matière ? Quels accords utilisent cette molécule ? Quelles recettes intègrent cet accord ? Ces connexions révèlent des patterns et suggèrent de nouvelles explorations.
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Évolutivité</CardTitle>
                  </CardHeader>
                  <CardContent className="text-muted-foreground">
                    La structure de la base de données est conçue pour <strong>évoluer sur 10 ans</strong>. De nouvelles matières peuvent être ajoutées, de nouvelles familles moléculaires identifiées, de nouveaux accords formulés. Cette flexibilité est essentielle pour un projet de recherche au long cours.
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Accessibilité</CardTitle>
                  </CardHeader>
                  <CardContent className="text-muted-foreground">
                    L'interface web permet un <strong>accès rapide et structuré</strong> à l'ensemble des données. Filtres, recherche et navigation intuitive facilitent l'exploration et la consultation quotidienne. La base de données devient un outil de travail fluide et efficace.
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Statistics */}
        <section className="py-16">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-8 text-center">
                Données Actuelles
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                <div>
                  <div className="text-4xl font-bold text-primary mb-2">100+</div>
                  <div className="text-sm text-muted-foreground">Matières Premières</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-primary mb-2">100+</div>
                  <div className="text-sm text-muted-foreground">Molécules</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-primary mb-2">120+</div>
                  <div className="text-sm text-muted-foreground">Accords</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-primary mb-2">160+</div>
                  <div className="text-sm text-muted-foreground">Recettes</div>
                </div>
              </div>
              <div className="mt-12 text-center">
                <p className="text-sm text-muted-foreground mb-4">
                  La base de données continue de s'enrichir au fil de la recherche
                </p>
                <Button variant="outline" size="lg">
                  Voir toutes les données
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 py-8 mt-16">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <p>© 2025 PERFUMUM — Recherche Olfactive</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
