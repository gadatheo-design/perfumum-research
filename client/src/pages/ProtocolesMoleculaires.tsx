import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Header } from "@/components/layout/Header";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { FlaskConical, ArrowRight, Layers, Beaker, Target } from "lucide-react";

export default function ProtocolesMoleculaires() {
  const { data: protocols, isLoading } = trpc.molecularProtocols.list.useQuery();

  return (
    <div className="min-h-screen flex flex-col">
      <Breadcrumbs />
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="section-spacing bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-50">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-100 text-violet-900 text-sm font-medium mb-6">
                <FlaskConical className="h-4 w-4" />
                Protocoles Moléculaires
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-violet-900 via-purple-800 to-indigo-900 bg-clip-text text-transparent">
                Protocoles de Reconstruction Olfactive
              </h1>
              <p className="text-lg text-stone-600 leading-relaxed">
                Architectures moléculaires détaillées pour la reconstruction en laboratoire des odeurs captées sur le terrain. 
                Chaque protocole documente la palette moléculaire, les proportions et le processus de formulation.
              </p>
            </div>
          </div>
        </section>

        {/* Liste des protocoles */}
        <section className="section-spacing">
          <div className="container">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Skeleton key={i} className="h-72" />
                ))}
              </div>
            ) : protocols && protocols?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {protocols?.map((protocol) => (
                  <Link key={protocol.id} href={`/protocoles-moleculaires/${protocol.id}`}>
                    <Card className="h-full hover:shadow-xl transition-all duration-300 cursor-pointer group border-l-4 border-l-violet-500">
                      <CardHeader className="bg-gradient-to-br from-violet-50 to-purple-50 group-hover:from-violet-100 group-hover:to-purple-100 transition-colors">
                        <div className="flex items-start justify-between mb-2">
                          <CardTitle className="text-lg group-hover:text-violet-900 transition-colors">
                            {protocol.name}
                          </CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-4 space-y-4">
                        {protocol.objective && (
                          <div className="flex items-start gap-2 text-sm">
                            <Target className="h-4 w-4 text-violet-600 mt-0.5 flex-shrink-0" />
                            <p className="text-stone-600 line-clamp-2">{protocol.objective}</p>
                          </div>
                        )}
                        {protocol.olfactiveArchitecture && (
                          <div className="flex items-start gap-2 text-sm">
                            <Layers className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                            <span className="text-stone-600">{protocol.olfactiveArchitecture}</span>
                          </div>
                        )}
                        
                        {/* Ratios */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-stone-500">Tête</span>
                            <Badge variant="outline" className="text-amber-700 border-amber-300">
                              {protocol.headRatio}%
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-stone-500">Cœur</span>
                            <Badge variant="outline" className="text-rose-700 border-rose-300">
                              {protocol.heartRatio}%
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-stone-500">Fond</span>
                            <Badge variant="outline" className="text-stone-700 border-stone-300">
                              {protocol.baseRatio}%
                            </Badge>
                          </div>
                        </div>

                        <Button
                          variant="ghost"
                          className="w-full mt-4 group-hover:bg-violet-100 group-hover:text-violet-900 transition-colors"
                        >
                          Voir le protocole
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Beaker className="h-16 w-16 mx-auto mb-4 text-stone-300" />
                <h3 className="text-xl font-semibold text-stone-700 mb-2">
                  Aucun protocole moléculaire disponible
                </h3>
                <p className="text-stone-500">
                  Les protocoles seront ajoutés au fur et à mesure des reconstructions olfactives.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
