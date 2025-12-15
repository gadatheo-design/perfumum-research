import { useRoute } from "wouter";
import { Header } from "@/components/layout/Header";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { Loader2, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function PrototypeDetail() {
  const [, params] = useRoute("/prototypes/:code");
  const code = params?.code?.toUpperCase() || "";

  const { data: prototype, isLoading, error } = trpc.prototypes.getByCode.useQuery(code);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Breadcrumbs />
      <Header />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </main>
      </div>
    );
  }

  if (error || !prototype) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Prototype non trouvé</h2>
            <Link href="/prototypes">
              <Button variant="outline">Retour aux prototypes</Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const composition = prototype.composition ? JSON.parse(prototype.composition) : null;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero */}
        <section className="section-spacing bg-gradient-to-b from-background to-muted/30">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <Link href="/prototypes">
                <Button variant="ghost" className="mb-6 gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Retour aux prototypes
                </Button>
              </Link>
              
              <div className="text-center">
                <div className="text-6xl mb-4">{prototype.emoji}</div>
                <div className="flex items-center justify-center gap-3 mb-4">
                  <Badge variant="outline" className="text-lg px-4 py-1">
                    {prototype.code}
                  </Badge>
                  <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
                    {prototype.name}
                  </h1>
                </div>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  {prototype.sensoryForm}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Overview */}
        <section className="py-16">
          <div className="container">
            <div className="max-w-3xl mx-auto">
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                {prototype.overview}
              </p>

              {/* Key Info Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Axe Conceptuel</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{prototype.conceptualAxis}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Famille Olfactive</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{prototype.olfactiveFamily}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Support Privilégié</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{prototype.preferredSupport}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Émotion Clé</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{prototype.keyEmotion}</p>
                  </CardContent>
                </Card>
              </div>

              {/* Composition */}
              {composition && (
                <Card className="mb-12">
                  <CardHeader>
                    <CardTitle className="text-2xl">Composition</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h4 className="font-semibold mb-3">Base</h4>
                      <p className="text-muted-foreground">{composition.base}</p>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3">Ingrédients</h4>
                      <div className="space-y-2">
                        {composition.ingredients?.map((ingredient: any, idx: number) => (
                          <div key={idx} className="flex justify-between items-center py-2 border-b border-border/40 last:border-0">
                            <span className="text-muted-foreground">{ingredient.name}</span>
                            <span className="font-mono text-sm">{ingredient.quantity}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {composition.protocol && (
                      <div>
                        <h4 className="font-semibold mb-3">Protocole</h4>
                        <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                          {composition.protocol.map((step: string, idx: number) => (
                            <li key={idx}>{step}</li>
                          ))}
                        </ol>
                      </div>
                    )}

                    {composition.characteristics && (
                      <div>
                        <h4 className="font-semibold mb-3">Caractéristiques</h4>
                        <div className="grid gap-3">
                          <div className="flex gap-2">
                            <span className="font-medium min-w-[120px]">Effet tactile :</span>
                            <span className="text-muted-foreground">{composition.characteristics.tactile}</span>
                          </div>
                          <div className="flex gap-2">
                            <span className="font-medium min-w-[120px]">Stabilité :</span>
                            <span className="text-muted-foreground">{composition.characteristics.stability}</span>
                          </div>
                          <div className="flex gap-2">
                            <span className="font-medium min-w-[120px]">Résonance :</span>
                            <span className="text-muted-foreground">{composition.characteristics.emotional}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Conceptual Reflection */}
              {prototype.conceptualReflection && (
                <Card className="mb-12">
                  <CardHeader>
                    <CardTitle className="text-2xl">Réflexion Conceptuelle</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      {prototype.conceptualReflection}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Installation */}
              {prototype.installation && (
                <Card className="mb-12">
                  <CardHeader>
                    <CardTitle className="text-2xl">Installation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      {prototype.installation}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Technical Development */}
              {prototype.technicalDevelopment && (
                <Card className="mb-12">
                  <CardHeader>
                    <CardTitle className="text-2xl">Développement Technique</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      {prototype.technicalDevelopment}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Theoretical Scope */}
              {prototype.theoreticalScope && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl">Portée Théorique</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      {prototype.theoreticalScope}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 py-8 mt-16">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <p>© 2025 PERFUMUM — Recherche Olfactive</p>
          </div>
        </div>
      </footer>
    <Footer />

    </div>
  );
}
