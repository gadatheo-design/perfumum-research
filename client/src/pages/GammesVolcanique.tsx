import { Header } from "@/components/layout/Header";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Flame, Skull, Zap } from "lucide-react";
import { GammesConnexes } from "@/components/GammesConnexes";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { linkifyMoleculeNames } from "@/lib/linkifyMolecules";

export default function GammesVolcanique() {
  const { data: molecules } = trpc.molecules.list.useQuery();

  const axes = [
    {
      code: "V.1",
      name: "VOLCANIQUE CENDRES",
      icon: Skull,
      atmosphere: "Cendre tiède. Poussière volcanique. Fumée noire résiduelle.",
      notes: "frankincense noir, vétiver haiti, palo santo, oud tea, spikenard, mitti attar",
      image: "cendre volcanique, poussière suspendue",
      sensation: "poussiéreuse, sombre, résiduelle",
      color: "from-stone-700/20 to-slate-900/20",
      borderColor: "border-l-stone-600",
    },
    {
      code: "V.2",
      name: "VOLCANIQUE RÉSINE BRÛLÉE",
      icon: Flame,
      atmosphere: "Résine pyrolysée, fumée épaisse, chaleur intense.",
      notes: "frankincense noir, oud tea, palo santo, vétiver assam, makrut, ambergris",
      image: "résine incandescente, fumée dense",
      sensation: "chaude, épaisse, pyrolysée",
      color: "from-orange-800/20 to-red-900/20",
      borderColor: "border-l-orange-700",
    },
    {
      code: "V.3",
      name: "VOLCANIQUE FUMÉE SPECTRALE",
      icon: Zap,
      atmosphere: "Fumée froide, soufre léger, vapeur acide fantôme.",
      notes: "juniper, makrut, spikenard, frankincense, vétiver, ambergris",
      image: "vapeur acide, fumée pâle",
      sensation: "spectrale, acide, volatile",
      color: "from-cyan-500/20 to-blue-700/20",
      borderColor: "border-l-cyan-600",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col theme-volcanique">
      <Breadcrumbs />
      <Header />
      
      <main className="flex-1">
        {/* Hero */}
        <section className="section-spacing bg-gradient-to-b from-orange-50/30 to-background">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <Link href="/gammes">
                <a className="text-sm text-muted-foreground hover:text-foreground mb-4 inline-block">
                  ← Retour aux Gammes
                </a>
              </Link>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-lg bg-orange-50 flex items-center justify-center">
                  <Flame className="h-8 w-8 text-orange-600" />
                </div>
                <div>
                  <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
                    VOLCANIQUE
                  </h1>
                  <p className="text-xl text-muted-foreground mt-2">
                    Étude atmosphérique — ABSORBE / Perfumeum
                  </p>
                </div>
              </div>
              <div className="flex gap-2 mb-6">
                <Badge variant="secondary">3 axes</Badge>
                <Badge variant="outline">Recherche 2023-2025</Badge>
              </div>
              <div className="prose prose-lg max-w-none">
                <p className="text-lg text-foreground leading-relaxed">
                  <strong>Volcanique est l'odeur de la matière en transformation thermique.</strong>
                </p>
                <p className="text-base text-muted-foreground leading-relaxed mt-4">
                  C'est la rencontre entre la chaleur extrême, la combustion et le refroidissement : ce qui brûle, ce qui se consume, ce qui demeure en suspension.
                  Cette étude se compose de trois axes : <strong>Cendres</strong>, <strong>Résine Brûlée</strong>, <strong>Fumée Spectrale</strong>.
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
                  <p className="text-lg"><strong>Cendres</strong> — résidu</p>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant="outline" className="font-mono">2</Badge>
                  <p className="text-lg"><strong>Résine Brûlée</strong> — combustion</p>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant="outline" className="font-mono">3</Badge>
                  <p className="text-lg"><strong>Fumée Spectrale</strong> — évaporation</p>
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
                <Badge variant="secondary" className="text-sm px-4 py-2">Résines sombres</Badge>
                <Badge variant="secondary" className="text-sm px-4 py-2">Hash noir</Badge>
                <Badge variant="secondary" className="text-sm px-4 py-2">Installation immersive</Badge>
                <Badge variant="secondary" className="text-sm px-4 py-2">Fumée rituelle</Badge>
                <Badge variant="secondary" className="text-sm px-4 py-2">Pyrolyse olfactive</Badge>
              </div>
            </div>
          </div>
        </section>

        {/* Gammes Connexes */}
        <section className="py-16 bg-muted/20">
          <div className="container">
            <GammesConnexes 
              currentGamme="volcanique"
              relatedGammes={["petrichor", "civilisations", "biolab"]}
            />
          </div>
        </section>
      </main>
    <Footer />

    </div>
  );
}
