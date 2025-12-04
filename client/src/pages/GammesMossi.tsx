import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Crown, Flame, Sparkles } from "lucide-react";
import { GammesConnexes } from "@/components/GammesConnexes";
import { Link } from "wouter";

export default function GammesMossi() {
  const axes = [
    {
      code: "C.1",
      name: "CIVILISATIONS ENCENS SACRÉ",
      icon: Crown,
      atmosphere: "Résine liturgique. Fumée rituelle. Encens royal Mandé/Mossi.",
      notes: "frankincense, myrrhe, labdanum, vétiver, oud, ambergris",
      image: "fumée d'encens, autel royal",
      sensation: "sacrée, dense, cérémonielle",
      color: "from-amber-600/20 to-yellow-700/20",
      borderColor: "border-l-amber-600",
    },
    {
      code: "C.2",
      name: "CIVILISATIONS RITUEL FUMÉ",
      icon: Flame,
      atmosphere: "Bois brûlé, tambour fumé, terre rouge sahélienne.",
      notes: "guaiacol, vétivénol, oxydes de fer, aldéhydes secs, phénols boisés",
      image: "tambour brûlé, poussière rouge",
      sensation: "fumée, terrestre, ancestrale",
      color: "from-red-800/20 to-orange-900/20",
      borderColor: "border-l-red-700",
    },
    {
      code: "C.3",
      name: "CIVILISATIONS MÉMOIRE OLFACTIVE",
      icon: Sparkles,
      atmosphere: "Cuir royal, ambre noir, poussière chaude, vent sahélien.",
      notes: "quinoléine, labdanum, aldéhydes métalliques, vétiver sec, encens éteint",
      image: "cuir royal, poussière dorée",
      sensation: "mémorielle, poussiéreuse, spectrale",
      color: "from-stone-500/20 to-amber-400/20",
      borderColor: "border-l-stone-600",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero */}
        <section className="section-spacing bg-gradient-to-b from-amber-50/30 to-background">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <Link href="/gammes">
                <a className="text-sm text-muted-foreground hover:text-foreground mb-4 inline-block">
                  ← Retour aux Gammes
                </a>
              </Link>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-lg bg-amber-50 flex items-center justify-center">
                  <Crown className="h-8 w-8 text-amber-600" />
                </div>
                <div>
                  <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
                    CIVILISATIONS
                  </h1>
                  <p className="text-xl text-muted-foreground mt-2">
                    Étude atmosphérique — ABSORBE / Perfumeum
                  </p>
                </div>
              </div>
              <div className="flex gap-2 mb-6">
                <Badge variant="secondary">3 axes</Badge>
                <Badge variant="outline">Recherche 2024-2025</Badge>
                <Badge variant="outline">Mossi / Mandé</Badge>
              </div>
              <div className="prose prose-lg max-w-none">
                <p className="text-lg text-foreground leading-relaxed">
                  <strong>Civilisations est l'odeur de la mémoire culturelle et du rituel.</strong>
                </p>
                <p className="text-base text-muted-foreground leading-relaxed mt-4">
                  C'est la rencontre entre le sacré, la fumée et la poussière : ce qui brûle dans les cérémonies, ce qui demeure dans les objets royaux, ce qui flotte dans le vent sahélien.
                  Cette étude se compose de trois axes : <strong>Encens Sacré</strong>, <strong>Rituel Fumé</strong>, <strong>Mémoire Olfactive</strong>.
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
                            {axe.notes}
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
                  <p className="text-lg"><strong>Encens Sacré</strong> — liturgie</p>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant="outline" className="font-mono">2</Badge>
                  <p className="text-lg"><strong>Rituel Fumé</strong> — cérémonie</p>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant="outline" className="font-mono">3</Badge>
                  <p className="text-lg"><strong>Mémoire Olfactive</strong> — trace</p>
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
                <Badge variant="secondary" className="text-sm px-4 py-2">Encens rituel</Badge>
                <Badge variant="secondary" className="text-sm px-4 py-2">Installation culturelle</Badge>
                <Badge variant="secondary" className="text-sm px-4 py-2">Fumée cérémonielle</Badge>
                <Badge variant="secondary" className="text-sm px-4 py-2">Accord royal</Badge>
                <Badge variant="secondary" className="text-sm px-4 py-2">Étude anthropologique</Badge>
              </div>
            </div>
          </div>
        </section>

        {/* Gammes Connexes */}
        <section className="py-16 bg-muted/20">
          <div className="container">
            <GammesConnexes 
              currentGamme="civilisations"
              relatedGammes={["petrichor", "volcanique", "biolab"]}
            />
          </div>
        </section>
      </main>
    </div>
  );
}
