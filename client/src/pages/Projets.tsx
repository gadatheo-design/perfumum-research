import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, FileText, Palette } from "lucide-react";

export default function Projets() {
  const projets = [
    {
      title: "Bambino47",
      type: "Collaboration artistique",
      status: "En cours",
      description: "Collaboration olfactive avec l'artiste Bambino47. Création d'atmosphères pour installations et performances.",
      year: "2024-2025",
    },
    {
      title: "Master Recherche",
      type: "Académique",
      status: "Planifié",
      description: "Recherche académique sur les pratiques olfactives contemporaines et design terpénique.",
      year: "2026-2028",
    },
    {
      title: "Doctorat",
      type: "Académique",
      status: "Planifié",
      description: "Thèse sur l'anthropologie du sensible et les atmosphères olfactives expérimentales.",
      year: "2028-2032",
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
                Projets
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Collaborations artistiques et recherches académiques en cours
              </p>
              <div className="flex gap-2 mb-6">
                <Badge variant="secondary">3 projets actifs</Badge>
                <Badge variant="outline">2024-2035</Badge>
              </div>
            </div>
          </div>
        </section>

        {/* Liste Projets */}
        <section className="py-16">
          <div className="container">
            <div className="max-w-5xl mx-auto">
              <div className="grid grid-cols-1 gap-6">
                {projets.map((projet, index) => (
                  <Card key={index} className="shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <CardTitle className="text-2xl">{projet.title}</CardTitle>
                            <Badge variant={projet.status === "En cours" ? "default" : "outline"}>
                              {projet.status}
                            </Badge>
                          </div>
                          <CardDescription className="text-base">
                            {projet.type} • {projet.year}
                          </CardDescription>
                        </div>
                        {projet.type === "Collaboration artistique" ? (
                          <Users className="h-6 w-6 text-primary flex-shrink-0" />
                        ) : (
                          <FileText className="h-6 w-6 text-primary flex-shrink-0" />
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground leading-relaxed">
                        {projet.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Note */}
        <section className="py-16 bg-muted/30">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <Card className="border-l-4 border-l-primary">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Palette className="h-6 w-6 text-primary" />
                    <CardTitle>Collaborations Ouvertes</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    ABSORBE / PERFUMUM est ouvert aux collaborations artistiques, scientifiques et institutionnelles. 
                    Les projets peuvent prendre la forme d'installations, de performances, de recherches académiques, 
                    ou de créations olfactives sur mesure.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
