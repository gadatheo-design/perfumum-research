// @ts-nocheck
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PrototypeCard } from "@/components/cards/PrototypeCard";
import { trpc } from "@/lib/trpc";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { GammeBadge, type GammeType } from "@/components/GammeBadge";
import { getGammeFromPrototype } from "@/lib/gammeMapping";

export default function Prototypes() {
  const { data: prototypes, isLoading } = trpc.prototypes.list.useQuery();
  const [selectedGamme, setSelectedGamme] = useState<GammeType | null>(null);

  const getColorFromCode = (code: string): "c1" | "c2" | "c3" | "c4" => {
    const colorMap: Record<string, "c1" | "c2" | "c3" | "c4"> = {
      "C1": "c1",
      "C2": "c2",
      "C3": "c3",
      "C4": "c4",
    };
    return colorMap[code] || "c1";
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Breadcrumbs />
      <Header />
      
      <main className="flex-1">
        {/* Hero */}
        <section className="section-spacing bg-gradient-to-b from-background to-muted/30">
          <div className="container">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
                Prototypes C1-C4
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Quatre chapitres atmosphériques explorant des axes existentiels et phénoménologiques à travers l'odeur
              </p>
            </div>
          </div>
        </section>

        {/* Introduction */}
        <section className="py-16">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center mb-8">
              <p className="text-lg text-muted-foreground leading-relaxed">
                Les prototypes C1 à C4 constituent les <strong>compositions fondamentales</strong> du projet Perfumum. Chacun explore un axe conceptuel spécifique à travers une forme sensible distincte, articulant recherche théorique, pratique de laboratoire et expérimentation artistique.
              </p>
            </div>

            {/* Gamme Filters */}
            <div className="flex flex-wrap gap-2 items-center justify-center mb-12">
              <span className="text-sm font-medium text-muted-foreground">Filtrer par gamme :</span>
              <GammeBadge 
                gamme="petrichor" 
                size="sm" 
                className={selectedGamme === 'petrichor' ? 'ring-2 ring-offset-2 ring-gamme-petrichor' : 'opacity-60 hover:opacity-100'}
                onClick={() => setSelectedGamme(selectedGamme === 'petrichor' ? null : 'petrichor')}
              />
              <GammeBadge 
                gamme="volcanique" 
                size="sm" 
                className={selectedGamme === 'volcanique' ? 'ring-2 ring-offset-2 ring-gamme-volcanique' : 'opacity-60 hover:opacity-100'}
                onClick={() => setSelectedGamme(selectedGamme === 'volcanique' ? null : 'volcanique')}
              />
              <GammeBadge 
                gamme="civilisations" 
                size="sm" 
                className={selectedGamme === 'civilisations' ? 'ring-2 ring-offset-2 ring-gamme-civilisations' : 'opacity-60 hover:opacity-100'}
                onClick={() => setSelectedGamme(selectedGamme === 'civilisations' ? null : 'civilisations')}
              />
              <GammeBadge 
                gamme="glaciaire" 
                size="sm" 
                className={selectedGamme === 'glaciaire' ? 'ring-2 ring-offset-2 ring-gamme-glaciaire' : 'opacity-60 hover:opacity-100'}
                onClick={() => setSelectedGamme(selectedGamme === 'glaciaire' ? null : 'glaciaire')}
              />
              <GammeBadge 
                gamme="biolab" 
                size="sm" 
                className={selectedGamme === 'biolab' ? 'ring-2 ring-offset-2 ring-gamme-biolab' : 'opacity-60 hover:opacity-100'}
                onClick={() => setSelectedGamme(selectedGamme === 'biolab' ? null : 'biolab')}
              />
            </div>

            {/* Prototypes Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {isLoading ? (
                <div className="col-span-2 flex justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                prototypes
                  ?.filter(prototype => !selectedGamme || getGammeFromPrototype(prototype.code) === selectedGamme)
                  .map((prototype) => (
                  <PrototypeCard
                    key={prototype.code}
                    code={prototype.code}
                    name={prototype.name}
                    emoji={prototype.emoji || "🍂"}
                    conceptualAxis={prototype.conceptualAxis || ""}
                    sensoryForm={prototype.sensoryForm || ""}
                    color={getColorFromCode(prototype.code)}
                    href={`/prototypes/${prototype.code.toLowerCase()}`}
                  />
                ))
              )}
            </div>
          </div>
        </section>

        {/* Methodology Section */}
        <section className="py-16 bg-muted/30">
          <div className="container">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold mb-8 text-center">
                Approche Méthodologique
              </h2>
              <div className="grid gap-6">
                <div className="bg-card p-6 rounded-lg border border-border">
                  <h3 className="text-xl font-semibold mb-3">Axe Conceptuel</h3>
                  <p className="text-muted-foreground">
                    Chaque prototype articule un concept philosophique ou phénoménologique (fermentation, clarté, lumière, terre) qui guide la recherche de matières et la construction de la composition.
                  </p>
                </div>

                <div className="bg-card p-6 rounded-lg border border-border">
                  <h3 className="text-xl font-semibold mb-3">Forme Sensible</h3>
                  <p className="text-muted-foreground">
                    La composition olfactive traduit l'axe conceptuel en expérience sensible immédiate. Elle ne représente pas le concept, elle l'incarne dans une texture atmosphérique.
                  </p>
                </div>

                <div className="bg-card p-6 rounded-lg border border-border">
                  <h3 className="text-xl font-semibold mb-3">Support de Diffusion</h3>
                  <p className="text-muted-foreground">
                    Chaque prototype privilégie un mode de diffusion spécifique (cônes, brume, plaque chauffée) qui influence la temporalité et la spatialité de l'expérience olfactive.
                  </p>
                </div>

                <div className="bg-card p-6 rounded-lg border border-border">
                  <h3 className="text-xl font-semibold mb-3">Développement Technique</h3>
                  <p className="text-muted-foreground">
                    Documentation systématique des formulations, tests de stabilité, ajustements de proportions et analyse des interactions moléculaires.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Interconnections */}
        <section className="py-16">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-6">
                Un Système Interconnecté
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                Les quatre prototypes ne sont pas des compositions isolées mais forment un <strong>système atmosphérique cohérent</strong>. Ils partagent des molécules communes, dialoguent entre eux et peuvent être combinés pour créer des compositions hybrides. Cette approche systémique permet d'explorer les relations entre différentes qualités sensibles et de construire progressivement un vocabulaire olfactif original.
              </p>
              
              {/* Liens vers les pages détaillées */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                <a href="/prototypes/c1" className="block p-4 bg-card border border-border rounded-lg hover:shadow-md hover:scale-[1.02] transition-all">
                  <h3 className="text-lg font-semibold mb-2">C1 — FERMENTUM</h3>
                  <p className="text-sm text-muted-foreground">Organique, intime, vivant</p>
                </a>
                <a href="/prototypes/c2" className="block p-4 bg-card border border-border rounded-lg hover:shadow-md hover:scale-[1.02] transition-all">
                  <h3 className="text-lg font-semibold mb-2">C2 — CLARUS VERDE</h3>
                  <p className="text-sm text-muted-foreground">Verticalité, transparence, lumière verte</p>
                </a>
                <a href="/prototypes/c3" className="block p-4 bg-card border border-border rounded-lg hover:shadow-md hover:scale-[1.02] transition-all">
                  <h3 className="text-lg font-semibold mb-2">C3 — LACTA SOLIS</h3>
                  <p className="text-sm text-muted-foreground">Douceur solaire, peau, tendresse</p>
                </a>
                <a href="/prototypes/c4" className="block p-4 bg-card border border-border rounded-lg hover:shadow-md hover:scale-[1.02] transition-all">
                  <h3 className="text-lg font-semibold mb-2">C4 — TERRA AMBRA</h3>
                  <p className="text-sm text-muted-foreground">Terre, résine, profondeur</p>
                </a>
              </div>
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
