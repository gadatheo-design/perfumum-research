import { Header } from "@/components/layout/Header";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Droplets, Mountain, Building2, Ghost } from "lucide-react";
import { GammesConnexes } from "@/components/GammesConnexes";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { linkifyMoleculeNames } from "@/lib/linkifyMolecules";

export default function GammesPetrichor() {
  // Fetch all molecules to linkify names
  const { data: molecules } = trpc.molecules.list.useQuery();

  const axes = [
    {
      code: "S.1",
      name: "PÉTRICHOR SOUTERRAIN",
      icon: Mountain,
      atmosphere: "Humus. Racines. Terre noire gorgée d'eau.",
      notes: "géosmine, spikenard, vétiver humide, bois mouillé, angélique, mitti attar",
      imageUrl: "/petrichor-souterrain.webp",
      image: "sol fracturé, condensation basse",
      sensation: "profonde, lente, organique",
      color: "from-amber-900/20 to-stone-900/20",
      borderColor: "border-l-amber-700",
    },
    {
      code: "U.1",
      name: "PÉTRICHOR URBAIN",
      icon: Building2,
      atmosphere: "Asphalte sous la pluie, pierre froide, tension électrique.",
      notes: "aldéhydes froids, ozone, bitume propre, pierre humide, encens froid",
      imageUrl: "/petrichor-urbain.webp",
      image: "bitume mouillé, halo bleu",
      sensation: "électrique, nette, rapide",
      color: "from-slate-500/20 to-blue-900/20",
      borderColor: "border-l-slate-600",
    },
    {
      code: "F.1",
      name: "PÉTRICHOR FANTÔME",
      icon: Ghost,
      atmosphere: "Papier humide, poussière en suspension, silence après la pluie.",
      notes: "violette poussière, encens éteint, pierre poreuse",
      imageUrl: "/petrichor-fantome.webp",
      image: "mur poreux, lumière pâle",
      sensation: "spectrale, résiduelle",
      color: "from-violet-300/20 to-gray-400/20",
      borderColor: "border-l-violet-400",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col theme-petrichor">
      <Breadcrumbs />
      <Header />
      
      <main className="flex-1">
        {/* Hero */}
        <section className="section-spacing bg-gradient-to-b from-blue-50/30 to-background">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <Link href="/gammes">
                <a className="text-sm text-muted-foreground hover:text-foreground mb-4 inline-block">
                  ← Retour aux Gammes
                </a>
              </Link>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-lg bg-blue-50 flex items-center justify-center">
                  <Droplets className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
                    PÉTRICHOR
                  </h1>
                  <p className="text-xl text-muted-foreground mt-2">
                    Étude atmosphérique — ABSORBE / Perfumeum
                  </p>
                </div>
              </div>
              <div className="flex gap-2 mb-6">
                <Badge variant="secondary">3 axes</Badge>
                <Badge variant="outline">Recherche 2020-2025</Badge>
              </div>
              <div className="prose prose-lg max-w-none">
                <p className="text-lg text-foreground leading-relaxed">
                  <strong>Pétrichor est l'odeur d'un monde qui change d'état.</strong>
                </p>
                <p className="text-base text-muted-foreground leading-relaxed mt-4">
                  C'est la rencontre entre la pluie, la matière et la mémoire : ce qui remonte du sol, ce qui s'échappe de la ville, ce qui demeure dans les murs.
                  Cette étude se compose de trois axes : <strong>Souterrain</strong>, <strong>Urbain</strong>, <strong>Fantôme</strong>.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Trois Axes */}
        <section className="py-16">
          <div className="container">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl font-bold mb-8">
                Trois Axes Atmosphériques
              </h2>
              
              <div className="grid grid-cols-1 gap-8">
                {axes.map((axe, index) => {
                  const IconComponent = axe.icon;
                  return (
                    <Card key={index} className={`shadow-sm hover:shadow-md transition-shadow border-l-4 ${axe.borderColor} bg-gradient-to-br ${axe.color}`}>
                      <CardHeader>
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <Badge variant="outline" className="font-mono text-xs">
                                {axe.code}
                              </Badge>
                              <CardTitle className="text-2xl uppercase tracking-wide">
                                {axe.name}
                              </CardTitle>
                            </div>
                          </div>
                          <IconComponent className="h-8 w-8 text-muted-foreground flex-shrink-0" />
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {axe.imageUrl && (
                          <div className="w-full h-64 rounded-lg overflow-hidden">
                            <img 
                              src={axe.imageUrl} 
                              alt={`${axe.name} - ${axe.atmosphere}`}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          </div>
                        )}
                        <div>
                          <h4 className="text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
                            Atmosphère
                          </h4>
                          <p className="text-base text-foreground leading-relaxed">
                            {axe.atmosphere}
                          </p>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
                            Notes
                          </h4>
                          <p className="text-sm font-mono text-muted-foreground leading-relaxed">
                            {linkifyMoleculeNames(axe.notes, molecules)}
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h4 className="text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
                              Image
                            </h4>
                            <p className="text-sm text-muted-foreground italic">
                              {axe.image}
                            </p>
                          </div>

                          <div>
                            <h4 className="text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
                              Sensation
                            </h4>
                            <p className="text-sm text-muted-foreground italic">
                              {axe.sensation}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Structure Temporelle */}
        <section className="py-16 bg-muted/30">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-6">
                Structure Temporelle
              </h2>
              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <Badge variant="outline" className="font-mono">1</Badge>
                  <p className="text-lg"><strong>Souterrain</strong> — profondeur</p>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant="outline" className="font-mono">2</Badge>
                  <p className="text-lg"><strong>Urbain</strong> — impact</p>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant="outline" className="font-mono">3</Badge>
                  <p className="text-lg"><strong>Fantôme</strong> — résidu</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Applications */}
        <section className="py-16">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-6">
                Applications
              </h2>
              <div className="flex flex-wrap gap-3">
                <Badge variant="secondary" className="text-sm px-4 py-2">Accord olfactif</Badge>
                <Badge variant="secondary" className="text-sm px-4 py-2">Fumée</Badge>
                <Badge variant="secondary" className="text-sm px-4 py-2">Installation</Badge>
                <Badge variant="secondary" className="text-sm px-4 py-2">Objet atmosphérique</Badge>
                <Badge variant="secondary" className="text-sm px-4 py-2">Étude sensorielle</Badge>
              </div>
            </div>
          </div>
        </section>

        {/* Méthode ABSORBE */}
        <section className="py-16 bg-muted/30">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl font-bold mb-4">
                Méthodologie de Recherche
              </h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Cette étude suit le protocole ABSORBE : captation d'air, documentation du lieu, évaluation sensorielle, pyrolyse, enregistrement sonore et visuel, rédaction de notes.
              </p>
              <Link href="/methode">
                <a className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity">
                  Découvrir la méthode ABSORBE →
                </a>
              </Link>
            </div>
          </div>
        </section>

        {/* Gammes Connexes */}
        <section className="py-16 bg-muted/20">
          <div className="container">
            <GammesConnexes 
              currentGamme="petrichor"
              relatedGammes={["glaciaire", "volcanique", "biolab"]}
            />
          </div>
        </section>
      </main>
    <Footer />

    </div>
  );
}
