import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Beaker, Wind, Eye, Layers } from "lucide-react";
import { Link } from "wouter";

export default function MethodeAbsorbe() {
  const principes = [
    {
      icon: Wind,
      title: "Atmosphère",
      description: "Travailler l'odeur comme un environnement habitable, pas comme un objet fini. L'atmosphère précède la forme.",
    },
    {
      icon: Layers,
      title: "Matière",
      description: "Privilégier les matières premières brutes : résines, bois, terres, minéraux. La transformation chimique comme processus créatif.",
    },
    {
      icon: Eye,
      title: "Perception",
      description: "Documenter l'expérience sensorielle avec rigueur scientifique. Chaque accord est une hypothèse testable.",
    },
    {
      icon: Beaker,
      title: "Protocole",
      description: "Méthode expérimentale itérative : formulation → test → documentation → variation. Pas de formule définitive.",
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
                Méthode ABSORBE
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Approche expérimentale de la création olfactive atmosphérique
              </p>
              <div className="flex gap-2 mb-6">
                <Badge variant="secondary">Recherche-création</Badge>
                <Badge variant="outline">2020-2035</Badge>
              </div>
            </div>
          </div>
        </section>

        {/* Introduction */}
        <section className="py-16">
          <div className="container">
            <div className="max-w-4xl mx-auto prose prose-lg">
              <p className="text-lg text-foreground leading-relaxed">
                <strong>ABSORBE</strong> est une méthode de recherche-création olfactive développée depuis 2020 à Berne. 
                Elle articule parfumerie d'auteur, chimie organique, et anthropologie du sensible dans une approche expérimentale.
              </p>
              <p className="text-base text-muted-foreground leading-relaxed mt-4">
                Contrairement aux méthodes classiques de parfumerie, ABSORBE ne vise pas la création de produits finis, 
                mais l'exploration d'<strong>atmosphères olfactives</strong> : des environnements sensoriels habitables, 
                documentés avec rigueur scientifique.
              </p>
            </div>
          </div>
        </section>

        {/* Quatre Principes */}
        <section className="py-16 bg-muted/30">
          <div className="container">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl font-bold mb-8">
                Quatre Principes Fondamentaux
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {principes.map((principe, index) => {
                  const IconComponent = principe.icon;
                  return (
                    <Card key={index} className="shadow-sm hover:shadow-md transition-shadow">
                      <CardHeader>
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <IconComponent className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <CardTitle className="text-xl mb-2">{principe.title}</CardTitle>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground leading-relaxed">
                          {principe.description}
                        </p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Processus */}
        <section className="py-16">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-8">
                Processus de Recherche
              </h2>
              
              {/* Diagramme Processus */}
              <div className="mb-12">
                <Card className="overflow-hidden">
                  <CardHeader>
                    <CardTitle>Cycle de Recherche ABSORBE</CardTitle>
                    <CardDescription>
                      Méthodologie itérative : Terrain → Captation → Analyse → Accord → Installation
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <img 
                      src="/absorbe-processus.webp" 
                      alt="Diagramme processus ABSORBE" 
                      loading="lazy"
                      className="w-full h-auto rounded-lg border border-border"
                    />
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card className="border-l-4 border-l-primary">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="font-mono">1</Badge>
                      <CardTitle>Hypothèse Atmosphérique</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Définir une atmosphère cible (ex : "pluie sur béton", "fumée de résine", "cave humide"). 
                      Identifier les composés chimiques et matières premières potentiels.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-primary">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="font-mono">2</Badge>
                      <CardTitle>Formulation Expérimentale</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Créer des accords olfactifs par dilution progressive (0.02% à 0.25%). 
                      Tester les synergies moléculaires. Documenter chaque variation.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-primary">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="font-mono">3</Badge>
                      <CardTitle>Test Sensoriel</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Évaluer l'accord dans différents contextes (fumée, diffusion, application). 
                      Comparer avec l'hypothèse initiale. Noter les écarts et découvertes.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-primary">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="font-mono">4</Badge>
                      <CardTitle>Documentation & Itération</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Archiver formules, observations, et résultats dans la base de données PERFUMUM. 
                      Identifier nouvelles pistes de recherche. Recommencer le cycle.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Relations Gammes */}
        <section className="py-16 bg-muted/30">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-8">
                Relations entre Gammes Atmosphériques
              </h2>
              
              <Card className="overflow-hidden mb-12">
                <CardHeader>
                  <CardTitle>Cartographie Olfactive ABSORBE</CardTitle>
                  <CardDescription>
                    5 gammes atmosphériques interconnectées : Pétrichor, Volcanique, Civilisations, Glaciaire, Bio-Lab
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <img 
                    src="/absorbe-gammes.webp" 
                    alt="Diagramme relations gammes ABSORBE" 
                    loading="lazy"
                    className="w-full h-auto rounded-lg border border-border"
                  />
                </CardContent>
              </Card>

              <div className="prose prose-lg max-w-none mb-12">
                <p className="text-base text-muted-foreground leading-relaxed">
                  Les <strong>5 gammes atmosphériques</strong> d'ABSORBE ne sont pas des catégories isolées mais un <strong>réseau de relations</strong> : 
                  Pétrichor (terre/pluie) se connecte à Glaciaire (humidité froide) et Volcanique (terre fumée). 
                  Volcanique (cendre/résine) dialogue avec Civilisations (fumée rituelle). 
                  Civilisations (encens/sacré) rejoint Bio-Lab (extraction traditionnelle). 
                  Bio-Lab (molécule/biotechnologie) boucle vers Glaciaire (pureté moléculaire). 
                  Cette <strong>circularité</strong> permet des transitions fluides entre atmosphères.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Exemples Concrets */}
        <section className="py-16 bg-muted/20">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-8">
                Exemples Concrets
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Badge variant="outline" className="font-mono">S.1</Badge>
                      Pétrichor Souterrain
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Atmosphère : Humus, racines, terre noire gorgée d'eau. 
                      Notes : géosmine, vétiver humide, bois mouillé.
                    </p>
                    <Link href="/gammes/petrichor">
                      <a className="text-sm text-primary hover:underline">
                        Voir l'étude complète →
                      </a>
                    </Link>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Badge variant="outline" className="font-mono">V.1</Badge>
                      Volcanique Cendres
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Atmosphère : Terre brûlée, minéralité volcanique. 
                      Notes : cade, birch tar, vétiver fumé.
                    </p>
                    <Link href="/gammes/volcanique">
                      <a className="text-sm text-primary hover:underline">
                        Voir l'étude complète →
                      </a>
                    </Link>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Badge variant="outline" className="font-mono">T.1</Badge>
                      Terrain Forêt
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Environnement : Forêt mixte, sol humide, sous-bois. 
                      Captation : Mousse, écorce, humus.
                    </p>
                    <Link href="/terrains">
                      <a className="text-sm text-primary hover:underline">
                        Voir les terrains d'étude →
                      </a>
                    </Link>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Badge variant="outline" className="font-mono">P.1</Badge>
                      Projet Bambino47
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Collaboration artistique : Installation olfactive immersive. 
                      Atmosphères : Pétrichor urbain + Volcanique.
                    </p>
                    <Link href="/projets">
                      <a className="text-sm text-primary hover:underline">
                        Voir les projets →
                      </a>
                    </Link>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Applications */}
        <section className="py-16">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-6">
                Champs d'Application
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Recherche Académique</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Master, Doctorat, publications scientifiques
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Création Artistique</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Installations, performances, collaborations
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Design Olfactif</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Résines CBD, tabacs rares, parfums d'auteur
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
