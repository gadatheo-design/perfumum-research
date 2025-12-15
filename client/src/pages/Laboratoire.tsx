import { Link } from "wouter";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Beaker, Droplet, Layers, BookOpen, ArrowRight, Thermometer, Wind, TestTube, FlaskConical } from "lucide-react";

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
      href: "/recettes",
      stats: "160+ recettes",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: "R&D Recettes",
      description: "Espace de recherche avec versioning, notes de dégustation, calculateur de dosages et export PDF",
      icon: FlaskConical,
      href: "/laboratoire/recettes",
      stats: "Outils R&D",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Inventaire",
      description: "Gestion du stock de matières premières : huiles essentielles, absolus, résinoïdes et molécules",
      icon: Thermometer,
      href: "/inventaire",
      stats: "Stock & Commandes",
      color: "text-amber-600",
      bgColor: "bg-amber-50",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Breadcrumbs />
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

        {/* Protocols & Methodology */}
        <section className="py-16 bg-muted/30">
          <div className="container">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl font-bold mb-8 text-center">
                Protocoles & Méthodologie
              </h2>
              <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
                Méthodes d'extraction, techniques de formulation et dispositifs de diffusion utilisés dans la recherche PERFUMUM
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                {/* Extraction Methods */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                        <Beaker className="h-5 w-5 text-blue-600" />
                      </div>
                      <CardTitle className="text-xl">Méthodes d'Extraction</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2 text-sm">Hydrodistillation</h4>
                      <p className="text-sm text-muted-foreground">Extraction par vapeur d'eau (100-120°C) pour plantes aromatiques délicates</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2 text-sm">CO₂ Supercritique</h4>
                      <p className="text-sm text-muted-foreground">Extraction moderne sans résidus ({'>'}73 bar, {'>'}31°C) préservant l'intégrité moléculaire</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2 text-sm">Enfleurage</h4>
                      <p className="text-sm text-muted-foreground">Technique traditionnelle à froid pour fleurs fragiles (jasmin, tubéreuse)</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2 text-sm">Fractionnement</h4>
                      <p className="text-sm text-muted-foreground">Séparation en fractions distinctes selon volatilité et polarité</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Thermal Reactions */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center">
                        <Thermometer className="h-5 w-5 text-orange-600" />
                      </div>
                      <CardTitle className="text-xl">Réactions Thermiques</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2 text-sm">50-90°C : Transformations réversibles</h4>
                      <p className="text-sm text-muted-foreground">Oxydation légère, évaporation sélective des notes volatiles</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2 text-sm">120-160°C : Polymérisation partielle</h4>
                      <p className="text-sm text-muted-foreground">Décarboxylation, condensation, formation de nouvelles molécules</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2 text-sm">{'>'}180°C : Destruction olfactive</h4>
                      <p className="text-sm text-muted-foreground">Carbonisation, perte irréversible des profils olfactifs</p>
                    </div>
                    <div className="pt-2 border-t">
                      <p className="text-xs text-muted-foreground italic">Paliers critiques pour la combustion contrôlée et la diffusion thermique</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Diffusion Devices */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                        <Wind className="h-5 w-5 text-green-600" />
                      </div>
                      <CardTitle className="text-xl">Dispositifs de Diffusion</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2 text-sm">Résine CBD</h4>
                      <p className="text-sm text-muted-foreground">Support cannabinoïde (0.5-1 ml/5g), maturation 48-72h</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2 text-sm">Patch olfactif</h4>
                      <p className="text-sm text-muted-foreground">Textile/papier imprégné, diffusion lente et contrôlée sur plusieurs jours</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2 text-sm">Diffusion spatiale</h4>
                      <p className="text-sm text-muted-foreground">Installations immersives, calcul de charge olfactive (0.1 ml/m³)</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2 text-sm">Spray alcoolique</h4>
                      <p className="text-sm text-muted-foreground">Éthanol 95°, volatilité élevée, macération minimum 48h</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Formulation Protocols */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
                        <TestTube className="h-5 w-5 text-purple-600" />
                      </div>
                      <CardTitle className="text-xl">Protocoles de Formulation</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2 text-sm">Macération</h4>
                      <p className="text-sm text-muted-foreground">Repos 48h (alcool), 5-7 jours (huile), 72h (résine) pour harmonisation</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2 text-sm">Maturation</h4>
                      <p className="text-sm text-muted-foreground">Évolution lente (1 mois à plusieurs années), oxydation contrôlée</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2 text-sm">Test mouillette</h4>
                      <p className="text-sm text-muted-foreground">Tremper 1cm, sécher 30s, évaluer à 5min/30min/2h/6h/24h</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2 text-sm">Test peau</h4>
                      <p className="text-sm text-muted-foreground">1 goutte sans frotter, évaluer à 15min/1h/4h/8h pour pH et chaleur corporelle</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="text-center">
                <Link href="/glossaire">
                  <Button variant="outline" size="lg" className="gap-2">
                    <BookOpen className="h-4 w-4" />
                    Consulter le glossaire complet
                  </Button>
                </Link>
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
    <Footer />

    </div>
  );
}
