import { Header } from "@/components/layout/Header";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trees, Building2, Landmark, Droplets, Wind, Camera } from "lucide-react";

export default function Terrains() {
  const terrains = [
    {
      name: "FORÊT",
      icon: Trees,
      subtitle: "Humus, décomposition, silence végétal",
      atmosphere: "Sol forestier humide, feuilles mortes, mousse sur écorce, champignons en décomposition. Odeur de terre noire, de bois pourrissant, de résine froide. Silence dense, ponctué par le bruit de l'eau qui ruisselle.",
      methodologie: [
        "Captation olfactive in situ (notes terrain, photographies, échantillons)",
        "Analyse des composés volatils dominants (géosmine, terpènes, phénols)",
        "Reconstruction en laboratoire avec molécules naturelles et synthétiques",
        "Test en installation immersive pour validation atmosphérique",
      ],
      accordsCrees: [
        "Pétrichor Souterrain (S.1) — géosmine, vétiver, bois mouillé",
        "Pétrichor Fantôme (F.1) — violette poussière, encens éteint",
        "Volcanique Cendre Chaude (V.1) — frankincense noir, palo santo",
      ],
      color: "from-green-900/20 to-emerald-800/20",
      borderColor: "border-l-green-700",
      stats: { accords: 12, captations: 8, molecules: 45 },
    },
    {
      name: "VILLE",
      icon: Building2,
      subtitle: "Asphalte, ozone, tension électrique",
      atmosphere: "Bitume mouillé après la pluie, pierre froide, métal oxydé, fumée de diesel. Odeur d'aldéhydes froids, d'ozone post-orage, de poussière urbaine. Tension électrique dans l'air, halo bleu autour des lampadaires.",
      methodologie: [
        "Cartographie olfactive urbaine (rues, places, parkings, tunnels)",
        "Captation après pluie pour maximiser les odeurs de pétrichor urbain",
        "Analyse des composés volatils anthropiques (aldéhydes, ozone, hydrocarbures)",
        "Création d'accords urbains minimalistes (3-5 molécules)",
      ],
      accordsCrees: [
        "Pétrichor Urbain (U.1) — aldéhydes froids, ozone, bitume propre",
        "Volcanique Fumée Spectrale (V.3) — juniper, makrut, vapeur acide",
        "Civilisations Mémoire Olfactive (C.3) — aldéhydes métalliques, poussière dorée",
      ],
      color: "from-slate-600/20 to-blue-800/20",
      borderColor: "border-l-slate-600",
      stats: { accords: 9, captations: 15, molecules: 32 },
    },
    {
      name: "MUSÉE",
      icon: Landmark,
      subtitle: "Poussière ancienne, papier, cire",
      atmosphere: "Papier ancien, poussière en suspension, cire d'abeille, bois verni, textile poussiéreux. Odeur de mémoire figée, de temps suspendu, de silence institutionnel. Lumière pâle filtrée par les vitrines.",
      methodologie: [
        "Captation discrète dans espaces muséaux (salles, réserves, archives)",
        "Analyse des odeurs de conservation (papier, cire, textile, bois)",
        "Reconstruction d'atmosphères mémorielles avec molécules douces",
        "Collaboration avec institutions pour installations olfactives in situ",
      ],
      accordsCrees: [
        "Pétrichor Fantôme (F.1) — violette poussière, encens éteint, pierre poreuse",
        "Civilisations Encens Sacré (C.1) — frankincense, myrrhe, labdanum",
        "Civilisations Mémoire Olfactive (C.3) — cuir royal, poussière chaude",
      ],
      color: "from-amber-600/20 to-yellow-700/20",
      borderColor: "border-l-amber-600",
      stats: { accords: 7, captations: 5, molecules: 28 },
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Breadcrumbs />
      <Header />
      
      <main className="flex-1">
        {/* Hero */}
        <section className="section-spacing bg-gradient-to-b from-muted/30 to-background">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
                Terrains d'Étude
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Trois environnements atmosphériques explorés par ABSORBE
              </p>
              <div className="flex gap-2 mb-6">
                <Badge variant="secondary">3 terrains actifs</Badge>
                <Badge variant="outline">28 accords créés</Badge>
                <Badge variant="outline">28 captations</Badge>
              </div>
              <div className="prose prose-lg max-w-none">
                <p className="text-base text-muted-foreground leading-relaxed">
                  Les <strong>terrains d'étude</strong> sont les environnements dans lesquels ABSORBE capte, analyse et reconstruit des atmosphères olfactives. 
                  Chaque terrain possède une signature atmosphérique propre : la <strong>forêt</strong> (humus, décomposition), 
                  la <strong>ville</strong> (asphalte, ozone), le <strong>musée</strong> (poussière ancienne, mémoire). 
                  Ces terrains ne sont pas des lieux fixes mais des <strong>typologies atmosphériques</strong> qui peuvent être retrouvées dans différents contextes géographiques.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Trois Terrains */}
        <section className="py-16">
          <div className="container">
            <div className="max-w-6xl mx-auto space-y-12">
              {terrains.map((terrain, index) => {
                const IconComponent = terrain.icon;
                return (
                  <Card key={index} className={`shadow-md hover:shadow-lg transition-shadow border-l-4 ${terrain.borderColor} bg-gradient-to-br ${terrain.color}`}>
                    <CardHeader>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <CardTitle className="text-3xl uppercase tracking-wide">
                              {terrain.name}
                            </CardTitle>
                            <IconComponent className="h-8 w-8 text-muted-foreground" />
                          </div>
                          <CardDescription className="text-lg">
                            {terrain.subtitle}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-8">
                      {/* Atmosphère */}
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <Droplets className="h-5 w-5 text-muted-foreground" />
                          <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                            Atmosphère
                          </h4>
                        </div>
                        <p className="text-base text-foreground leading-relaxed">
                          {terrain.atmosphere}
                        </p>
                      </div>

                      {/* Méthodologie */}
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <Camera className="h-5 w-5 text-muted-foreground" />
                          <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                            Méthodologie de Captation
                          </h4>
                        </div>
                        <div className="space-y-2">
                          {terrain.methodologie.map((etape, idx) => (
                            <div key={idx} className="flex items-start gap-3">
                              <Badge variant="outline" className="font-mono text-xs mt-0.5">
                                {idx + 1}
                              </Badge>
                              <p className="text-sm text-muted-foreground flex-1">
                                {etape}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Accords Créés */}
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <Wind className="h-5 w-5 text-muted-foreground" />
                          <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                            Accords Créés sur ce Terrain
                          </h4>
                        </div>
                        <div className="space-y-2">
                          {terrain.accordsCrees.map((accord, idx) => (
                            <div key={idx} className="text-sm text-muted-foreground">
                              • {accord}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Statistiques */}
                      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-foreground">
                            {terrain.stats.accords}
                          </div>
                          <div className="text-xs text-muted-foreground uppercase tracking-wide">
                            Accords
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-foreground">
                            {terrain.stats.captations}
                          </div>
                          <div className="text-xs text-muted-foreground uppercase tracking-wide">
                            Captations
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-foreground">
                            {terrain.stats.molecules}
                          </div>
                          <div className="text-xs text-muted-foreground uppercase tracking-wide">
                            Molécules
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Note Méthodologique */}
        <section className="py-16 bg-muted/30">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <Card className="border-l-4 border-l-primary">
                <CardHeader>
                  <CardTitle>Approche Terrain</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground leading-relaxed">
                    La méthodologie de terrain d'ABSORBE repose sur trois principes : 
                    <strong> captation in situ</strong> (notes, photographies, échantillons), 
                    <strong> analyse moléculaire</strong> (identification des composés volatils dominants), 
                    et <strong> reconstruction en laboratoire</strong> (création d'accords atmosphériques avec molécules naturelles et synthétiques).
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    Les terrains ne sont pas des lieux géographiques fixes mais des <strong>typologies atmosphériques</strong> : 
                    une forêt à Berne et une forêt à Tokyo partagent des signatures olfactives communes (humus, décomposition, silence végétal). 
                    Cette approche permet de créer des accords <strong>transposables</strong> qui fonctionnent dans différents contextes culturels et géographiques.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
    <Footer />

    </div>
  );
}
