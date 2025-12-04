import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trees, Building, Landmark } from "lucide-react";

export default function Terrains() {
  const terrains = [
    {
      icon: Trees,
      name: "Forêt",
      subtitle: "Terrain naturel",
      description: "Exploration olfactive des écosystèmes forestiers : humus, bois mouillé, résines, champignons, décomposition organique.",
      keywords: ["géosmine", "vétiver", "bois", "terre", "humidité"],
      color: "from-green-900/20 to-amber-900/20",
      borderColor: "border-l-green-700",
    },
    {
      icon: Building,
      name: "Ville",
      subtitle: "Terrain urbain",
      description: "Cartographie des odeurs urbaines : asphalte, béton, métaux, pollution, pluie sur bitume, espaces abandonnés.",
      keywords: ["ozone", "aldéhydes", "bitume", "pierre", "métal"],
      color: "from-slate-500/20 to-blue-900/20",
      borderColor: "border-l-slate-600",
    },
    {
      icon: Landmark,
      name: "Musée",
      subtitle: "Terrain institutionnel",
      description: "Analyse des atmosphères muséales : poussière, papier ancien, bois verni, pierre froide, silence olfactif.",
      keywords: ["papier", "bois verni", "pierre", "poussière", "cire"],
      color: "from-amber-100/20 to-stone-300/20",
      borderColor: "border-l-amber-600",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero */}
        <section className="section-spacing bg-gradient-to-b from-muted/30 to-background">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
                Terrains
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Espaces d'exploration et de collecte olfactive
              </p>
              <div className="flex gap-2 mb-6">
                <Badge variant="secondary">3 terrains</Badge>
                <Badge variant="outline">Recherche 2020-2025</Badge>
              </div>
              <div className="prose prose-lg max-w-none">
                <p className="text-base text-muted-foreground leading-relaxed">
                  Les <strong>terrains</strong> sont des espaces physiques où s'effectue la collecte d'informations olfactives. 
                  Chaque terrain possède ses propres caractéristiques atmosphériques, ses matières dominantes, et ses protocoles d'observation.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Trois Terrains */}
        <section className="py-16">
          <div className="container">
            <div className="max-w-5xl mx-auto">
              <div className="grid grid-cols-1 gap-8">
                {terrains.map((terrain, index) => {
                  const IconComponent = terrain.icon;
                  return (
                    <Card key={index} className={`shadow-sm hover:shadow-md transition-shadow border-l-4 ${terrain.borderColor} bg-gradient-to-br ${terrain.color}`}>
                      <CardHeader>
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <CardTitle className="text-3xl uppercase tracking-wide">
                                {terrain.name}
                              </CardTitle>
                            </div>
                            <CardDescription className="text-base">
                              {terrain.subtitle}
                            </CardDescription>
                          </div>
                          <IconComponent className="h-10 w-10 text-muted-foreground flex-shrink-0" />
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div>
                          <p className="text-base text-foreground leading-relaxed">
                            {terrain.description}
                          </p>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide">
                            Mots-clés olfactifs
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {terrain.keywords.map((keyword, idx) => (
                              <Badge key={idx} variant="outline" className="font-mono text-xs">
                                {keyword}
                              </Badge>
                            ))}
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

        {/* Méthodologie */}
        <section className="py-16 bg-muted/30">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-6">
                Protocole de Terrain
              </h2>
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="font-mono">1</Badge>
                      <CardTitle className="text-lg">Observation</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Identifier les sources olfactives dominantes, les variations temporelles (jour/nuit, saisons), 
                      et les interactions matérielles (pluie, chaleur, humidité).
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="font-mono">2</Badge>
                      <CardTitle className="text-lg">Documentation</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Noter les impressions sensorielles, photographier les lieux, enregistrer les conditions atmosphériques. 
                      Archiver dans la base de données PERFUMUM.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="font-mono">3</Badge>
                      <CardTitle className="text-lg">Transposition</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Traduire les observations en formules olfactives. Tester les accords en laboratoire. 
                      Comparer avec l'atmosphère d'origine.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
