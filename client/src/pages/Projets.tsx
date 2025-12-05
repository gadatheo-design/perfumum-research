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

        {/* CTA */}
        <section className="py-16 bg-muted/20">
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
