// @ts-nocheck
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Header } from "@/components/layout/Header";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { TestTube, Calendar, Beaker, CheckCircle, XCircle, HelpCircle, ArrowRight } from "lucide-react";

export default function TestsExtraction() {
  const { data: tests, isLoading } = trpc.extractionTests.list.useQuery();

  const getViableBadge = (viable: string | null) => {
    if (!viable) return null;
    const config: Record<string, { label: string; icon: any; variant: "default" | "secondary" | "outline" | "destructive" }> = {
      yes: { label: "Viable", icon: CheckCircle, variant: "default" },
      no: { label: "Non viable", icon: XCircle, variant: "destructive" },
      maybe: { label: "À confirmer", icon: HelpCircle, variant: "secondary" },
    };
    const item = config[viable] || { label: viable, icon: HelpCircle, variant: "outline" };
    const Icon = item.icon;
    return (
      <Badge variant={item.variant} className="gap-1">
        <Icon className="h-3 w-3" />
        {item.label}
      </Badge>
    );
  };

  const getSolventLabel = (solvent: string | null) => {
    if (!solvent) return "—";
    const labels: Record<string, string> = {
      mct: "MCT",
      alcohol_95: "Alcool 95%",
      alcohol_70: "Alcool 70%",
      water: "Eau",
      other: "Autre",
    };
    return labels[solvent] || solvent;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Breadcrumbs />
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="section-spacing bg-gradient-to-br from-blue-50 via-indigo-50 to-violet-50">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-900 text-sm font-medium mb-6">
                <TestTube className="h-4 w-4" />
                Tests d'Extraction
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-900 via-indigo-800 to-violet-900 bg-clip-text text-transparent">
                Tests d'Extraction Terrain
              </h1>
              <p className="text-lg text-stone-600 leading-relaxed">
                Documentation des micro-extractions réalisées sur le terrain : solvants utilisés, ratios, durées, 
                résultats olfactifs et viabilité des extraits obtenus.
              </p>
            </div>
          </div>
        </section>

        {/* Liste des tests */}
        <section className="section-spacing">
          <div className="container">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Skeleton key={i} className="h-64" />
                ))}
              </div>
            ) : tests && tests.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tests.map((test) => (
                  <Link key={test.id} href={`/tests-extraction/${test.id}`}>
                    <Card className="h-full hover:shadow-xl transition-all duration-300 cursor-pointer group border-l-4 border-l-blue-500">
                      <CardHeader className="bg-gradient-to-br from-blue-50 to-indigo-50 group-hover:from-blue-100 group-hover:to-indigo-100 transition-colors">
                        <div className="flex items-start justify-between mb-2">
                          <CardTitle className="text-lg group-hover:text-blue-900 transition-colors">
                            {test.testName}
                          </CardTitle>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {getViableBadge(test.viable)}
                        </div>
                      </CardHeader>
                      <CardContent className="pt-4 space-y-3">
                        {test.date && (
                          <div className="flex items-start gap-2 text-sm">
                            <Calendar className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                            <span className="text-stone-600">
                              {new Date(test.date).toLocaleDateString("fr-FR")}
                            </span>
                          </div>
                        )}
                        {test.solvent && (
                          <div className="flex items-start gap-2 text-sm">
                            <Beaker className="h-4 w-4 text-indigo-600 mt-0.5 flex-shrink-0" />
                            <span className="text-stone-600">
                              {getSolventLabel(test.solvent)}
                              {test.ratio && ` • ${test.ratio}`}
                            </span>
                          </div>
                        )}
                        {test.duration && (
                          <div className="flex items-start gap-2 text-sm">
                            <TestTube className="h-4 w-4 text-violet-600 mt-0.5 flex-shrink-0" />
                            <span className="text-stone-600">{test.duration}h</span>
                          </div>
                        )}
                        {test.resultSmell && (
                          <p className="text-sm text-stone-600 line-clamp-2 mt-3">
                            {test.resultSmell}
                          </p>
                        )}
                        <Button
                          variant="ghost"
                          className="w-full mt-4 group-hover:bg-blue-100 group-hover:text-blue-900 transition-colors"
                        >
                          Voir les détails
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <TestTube className="h-16 w-16 mx-auto mb-4 text-stone-300" />
                <h3 className="text-xl font-semibold text-stone-700 mb-2">
                  Aucun test d'extraction disponible
                </h3>
                <p className="text-stone-500">
                  Les tests d'extraction seront ajoutés au fur et à mesure des expérimentations.
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
