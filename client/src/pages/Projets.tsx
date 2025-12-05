import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar } from "lucide-react";

export default function Projets() {
  const terrains = [
    {
      title: "Forêt Alpine",
      location: "Oberland Bernois, Suisse",
      period: "2023-2024",
      status: "En cours",
      description: "Captation olfactive en forêt mixte (épicéa, hêtre, mousses). Étude des variations saisonnières de l'atmosphère forestière. Prélèvements d'humus, écorces, résines.",
      atmospheres: ["Pétrichor Souterrain", "Résine Froide", "Bois Humide"],
      molecules: ["α-Pinène", "Géosmine", "Vétiver"]
    },
    {
      title: "Musée / Salle Blanche",
      location: "Berne, Suisse",
      period: "2024",
      status: "Planifié",
      description: "Installation olfactive dans un espace muséal neutre. Diffusion contrôlée d'atmosphères Pétrichor et Volcanique. Protocole de restitution sensorielle en environnement aseptisé.",
      atmospheres: ["Pétrichor Urbain", "Volcanique Cendres", "Glaciaire Minéral"],
      molecules: ["Calone", "Cade", "Ambroxan"]
    },
    {
      title: "Ville / Friche Industrielle",
      location: "Zone urbaine, Suisse",
      period: "2025",
      status: "Planifié",
      description: "Exploration olfactive de friches industrielles et espaces urbains abandonnés. Captation des odeurs de béton mouillé, rouille, végétation sauvage. Pyrolyse de matériaux urbains.",
      atmospheres: ["Pétrichor Urbain", "Volcanique Bitume", "Fantôme Industriel"],
      molecules: ["Géosmine", "Birch Tar", "Iso E Super"]
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
                Projets & Terrains
              </h1>
              <p className="text-xl text-muted-foreground">
                Recherche olfactive in situ. Captation, analyse et restitution d'atmosphères sensorielles dans des environnements naturels et urbains.
              </p>
            </div>
          </div>
        </section>

        {/* Terrains */}
        <section className="py-16">
          <div className="container">
            <div className="max-w-5xl mx-auto space-y-8">
              {terrains.map((terrain, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div>
                        <CardTitle className="text-2xl mb-2">{terrain.title}</CardTitle>
                        <CardDescription className="flex items-center gap-4 text-base">
                          <span className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            {terrain.location}
                          </span>
                          <span className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            {terrain.period}
                          </span>
                        </CardDescription>
                      </div>
                      <Badge variant={terrain.status === "En cours" ? "default" : "outline"}>
                        {terrain.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed mb-6">
                      {terrain.description}
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-semibold mb-2">Atmosphères étudiées</h4>
                        <div className="flex flex-wrap gap-2">
                          {terrain.atmospheres.map((atm, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              {atm}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-semibold mb-2">Molécules-clés</h4>
                        <div className="flex flex-wrap gap-2">
                          {terrain.molecules.map((mol, i) => (
                            <Badge key={i} variant="outline" className="text-xs font-mono">
                              {mol}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Galerie Photos Terrain */}
        <section className="py-16 bg-muted/20">
          <div className="container">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold mb-8 text-center">
                Galerie Terrain
              </h2>
              <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
                Documentation visuelle des sites de captation ABSORBE. Chaque image témoigne de l'atmosphère sensorielle et des matériaux prélevés sur le terrain.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Forêt Alpine 1 */}
                <div className="group relative overflow-hidden rounded-lg border border-border hover:shadow-xl transition-all duration-300">
                  <img
                    src="/terrain-foret-alpine-1.webp"
                    alt="Forêt alpine - Sol forestier avec mousse, racines et brume matinale. Carnet de terrain et équipement de prélèvement."
                    loading="lazy"
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="p-4 bg-background">
                    <h3 className="font-semibold text-sm mb-1">Forêt Alpine — Sol Forestier</h3>
                    <p className="text-xs text-muted-foreground">Oberland Bernois, 2023</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Prélèvement humus, mousses, racines. Notes : géosmine, α-pinène, vétiver.
                    </p>
                  </div>
                </div>

                {/* Forêt Alpine 2 */}
                <div className="group relative overflow-hidden rounded-lg border border-border hover:shadow-xl transition-all duration-300">
                  <img
                    src="/terrain-foret-alpine-2.webp"
                    alt="Forêt alpine - Écorce de pin avec gouttes de résine ambre et lichen. Macro détail."
                    loading="lazy"
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="p-4 bg-background">
                    <h3 className="font-semibold text-sm mb-1">Forêt Alpine — Résine & Lichen</h3>
                    <p className="text-xs text-muted-foreground">Oberland Bernois, 2023</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Écorce Pinus cembra. Exsudation résineuse. Notes : pin, térébenthine, bois.
                    </p>
                  </div>
                </div>

                {/* Musée 1 */}
                <div className="group relative overflow-hidden rounded-lg border border-border hover:shadow-xl transition-all duration-300">
                  <img
                    src="/terrain-musee-1.webp"
                    alt="Musée - Galerie blanche minimaliste avec béton ciré. Atmosphère stérile et neutre."
                    loading="lazy"
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="p-4 bg-background">
                    <h3 className="font-semibold text-sm mb-1">Musée — Salle Blanche</h3>
                    <p className="text-xs text-muted-foreground">Berne, 2024</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Espace aseptisé. Diffusion contrôlée Pétrichor Urbain. Notes : calone, béton, ozone.
                    </p>
                  </div>
                </div>

                {/* Musée 2 */}
                <div className="group relative overflow-hidden rounded-lg border border-border hover:shadow-xl transition-all duration-300">
                  <img
                    src="/terrain-musee-2.webp"
                    alt="Musée - Archives avec documents anciens, étagères en bois, poussière en suspension."
                    loading="lazy"
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="p-4 bg-background">
                    <h3 className="font-semibold text-sm mb-1">Musée — Archives</h3>
                    <p className="text-xs text-muted-foreground">Berne, 2024</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Documents 1880-1910. Papier jauni, bois vieilli. Notes : vanilline, lignine, poussière.
                    </p>
                  </div>
                </div>

                {/* Friche 1 */}
                <div className="group relative overflow-hidden rounded-lg border border-border hover:shadow-xl transition-all duration-300">
                  <img
                    src="/terrain-friche-1.webp"
                    alt="Friche industrielle - Site abandonné avec structures métalliques rouillées et végétation envahissante."
                    loading="lazy"
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="p-4 bg-background">
                    <h3 className="font-semibold text-sm mb-1">Friche Industrielle — Site Abandonné</h3>
                    <p className="text-xs text-muted-foreground">Zone urbaine, 2025</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Acier rouillé, béton mouillé, végétation. Notes : birch tar, géosmine, métal.
                    </p>
                  </div>
                </div>

                {/* Friche 2 */}
                <div className="group relative overflow-hidden rounded-lg border border-border hover:shadow-xl transition-all duration-300">
                  <img
                    src="/terrain-friche-2.webp"
                    alt="Friche industrielle - Mur en béton avec peinture écaillée, traces de rouille et mousse verte."
                    loading="lazy"
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="p-4 bg-background">
                    <h3 className="font-semibold text-sm mb-1">Friche Industrielle — Mur Dégradé</h3>
                    <p className="text-xs text-muted-foreground">Zone urbaine, 2025</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Peinture écaillée, oxydation, colonisation végétale. Notes : rouille, mousse, bitume.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16">
          <div className="container">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-2xl font-bold mb-4">
                Méthodologie de Terrain
              </h2>
              <p className="text-muted-foreground mb-6">
                Chaque projet suit le protocole ABSORBE : captation d'air, documentation du lieu, évaluation sensorielle, pyrolyse, enregistrement sonore et visuel, rédaction de notes.
              </p>
              <a
                href="/methode"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
              >
                Découvrir la méthode ABSORBE →
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
