import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";

export default function Etudes() {
  const etudes = [
    {
      title: "Pétrichor",
      subtitle: "Terre, Pluie, Humus",
      description: "Étude des atmosphères olfactives liées à la pluie sur terre sèche. Exploration des notes de géosmine, vétiver humide, et bois mouillé à travers 3 axes : Souterrain, Urbain, Fantôme.",
      href: "/gammes/petrichor",
      status: "En cours",
      molecules: ["Géosmine", "Vétiver", "Calone"]
    },
    {
      title: "Volcanique",
      subtitle: "Cendres, Résine, Fumée",
      description: "Exploration des atmosphères volcaniques et fumées. Pyrolyse de résines, bois, et matériaux organiques. Notes de cade, birch tar, et vétiver fumé.",
      href: "/gammes/volcanique",
      status: "En cours",
      molecules: ["Cade", "Birch Tar", "Guaiacol"]
    },
    {
      title: "Glaciaire",
      subtitle: "Minéral, Froid, Pureté",
      description: "Atmosphères froides et minérales. Exploration des notes ozones, métalliques, et cristallines. Étude de la perception olfactive du froid.",
      href: "/gammes/glaciaire",
      status: "Planifié",
      molecules: ["Ambroxan", "Iso E Super", "Calone"]
    },
    {
      title: "Bio-Lab",
      subtitle: "Molécule, Biotechnologie, Synthèse",
      description: "Recherche sur les molécules synthétiques et biotechnologiques. Exploration des limites de la parfumerie moléculaire et des nouvelles technologies olfactives.",
      href: "/gammes/biolab",
      status: "Planifié",
      molecules: ["Ambroxan", "Hedione", "Iso E Super"]
    },
    {
      title: "Civilisations",
      subtitle: "Encens, Rituel, Mémoire",
      description: "Étude des pratiques olfactives traditionnelles à travers 26 civilisations. Documentation des résines sacrées, fumigations rituelles, et parfums ancestraux.",
      href: "/civilisations",
      status: "En cours",
      molecules: ["Olibanum", "Myrrhe", "Benjoin"]
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero */}
        <section className="py-16 bg-gradient-to-b from-muted/30 to-background">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
                Études
              </h1>
              <p className="text-xl text-muted-foreground">
                5 gammes atmosphériques explorées par PERFUMUM. Recherche olfactive expérimentale sur 10 ans (2025-2035).
              </p>
            </div>
          </div>
        </section>

        {/* Études Grid */}
        <section className="py-16">
          <div className="container">
            <div className="max-w-5xl mx-auto space-y-8">
              {etudes.map((etude, index) => (
                <Link key={index} href={etude.href}>
                  <Card className="hover:shadow-lg transition-shadow duration-300 cursor-pointer">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div>
                          <CardTitle className="text-2xl mb-2">{etude.title}</CardTitle>
                          <CardDescription className="text-base font-medium">
                            {etude.subtitle}
                          </CardDescription>
                        </div>
                        <Badge variant={etude.status === "En cours" ? "default" : "outline"}>
                          {etude.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground leading-relaxed mb-4">
                        {etude.description}
                      </p>
                      
                      <div>
                        <h4 className="text-sm font-semibold mb-2">Molécules-clés</h4>
                        <div className="flex flex-wrap gap-2">
                          {etude.molecules.map((mol, i) => (
                            <Badge key={i} variant="outline" className="text-xs font-mono">
                              {mol}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-muted/20">
          <div className="container">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-2xl font-bold mb-4">
                Méthodologie
              </h2>
              <p className="text-muted-foreground mb-6">
                Chaque étude suit le protocole ABSORBE : captation d'air, documentation du lieu, évaluation sensorielle, pyrolyse, enregistrement sonore et visuel, rédaction de notes.
              </p>
              <Link href="/methode">
                <a className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity">
                  Découvrir la méthode ABSORBE →
                </a>
              </Link>
            </div>
          </div>
        </section>
      </main>
    <Footer />

    </div>
  );
}
