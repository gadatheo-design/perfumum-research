import { Header } from "@/components/layout/Header";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Archive, FileText, Image, Music, Calendar } from "lucide-react";

// Cette page est conçue pour être extensible : ajoutez de nouvelles catégories d'archives
// en ajoutant des entrées dans le tableau archiveCategories ci-dessous

export default function Archives() {
  const archiveCategories = [
    {
      icon: FileText,
      title: "Notes de terrain",
      count: 0,
      description: "Documentation écrite des captations ABSORBE (forêts, musées, friches industrielles)",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      items: []
    },
    {
      icon: Image,
      title: "Photographies",
      count: 0,
      description: "Archive visuelle des sites de recherche et matériaux prélevés",
      color: "text-green-600",
      bgColor: "bg-green-50",
      items: []
    },
    {
      icon: Music,
      title: "Enregistrements sonores",
      count: 0,
      description: "Environnements sonores des terrains de captation",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      items: []
    },
    {
      icon: Calendar,
      title: "Chronologie du projet",
      count: 0,
      description: "Historique des développements, prototypes et découvertes",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      items: []
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Breadcrumbs />
      <Header />
      
      <main className="flex-1">
        {/* Hero */}
        <section className="py-16 bg-gradient-to-b from-muted/30 to-background">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
                Archives PERFUMUM
              </h1>
              <p className="text-xl text-muted-foreground mb-4">
                Documentation systématique de la recherche olfactive (2025-2035). Notes de terrain, photographies, enregistrements sonores et chronologie du projet.
              </p>
              <div className="prose prose-lg max-w-none">
                <p className="text-muted-foreground">
                  Les archives constituent la mémoire du projet Perfumum. Chaque terrain de recherche, chaque prototype développé, chaque découverte moléculaire est documenté et archivé pour garantir la traçabilité et la reproductibilité de la recherche.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Archive Categories */}
        <section className="py-16">
          <div className="container">
            <div className="max-w-5xl mx-auto space-y-8">
              {archiveCategories.map((category, index) => {
                const Icon = category.icon;
                return (
                  <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <div className={`w-12 h-12 rounded-lg ${category.bgColor} flex items-center justify-center`}>
                            <Icon className={`h-6 w-6 ${category.color}`} />
                          </div>
                          <div>
                            <CardTitle className="text-2xl mb-2">{category.title}</CardTitle>
                            <CardDescription className="text-base">
                              {category.description}
                            </CardDescription>
                          </div>
                        </div>
                        <Badge variant="secondary" className="text-lg px-4 py-2">
                          {category.count} éléments
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {category.items.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                          <p className="mb-2">Cette section sera enrichie au fil de la recherche</p>
                          <p className="text-sm">Les archives seront ajoutées progressivement entre 2025 et 2035</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {/* Ici, afficher les éléments d'archive quand ils seront ajoutés */}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Méthodologie d'archivage */}
        <section className="py-16 bg-muted/20">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-6">Méthodologie d'archivage</h2>
              <div className="prose prose-lg max-w-none">
                <p className="text-muted-foreground mb-4">
                  Chaque document archivé suit un protocole standardisé : date de captation, localisation GPS, conditions météorologiques, matériel utilisé, observations sensorielles, et références croisées avec les molécules identifiées.
                </p>
                <p className="text-muted-foreground">
                  Cette rigueur documentaire garantit que les archives constituent une ressource scientifique exploitable pour la recherche future et la transmission des connaissances accumulées.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
