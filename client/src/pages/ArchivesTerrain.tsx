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
import { MapPin, Calendar, Mountain, TestTube, ArrowRight, Leaf } from "lucide-react";

export default function ArchivesTerrain() {
  const { data: archives, isLoading } = trpc.fieldArchives.list.useQuery();

  const getStatusBadge = (status: string | null) => {
    if (!status) return null;
    const variants: Record<string, { label: string; variant: "default" | "secondary" | "outline" | "destructive" }> = {
      draft: { label: "Brouillon", variant: "outline" },
      in_progress: { label: "En cours", variant: "secondary" },
      completed: { label: "Complété", variant: "default" },
      archived: { label: "Archivé", variant: "destructive" },
    };
    const config = variants[status] || { label: status, variant: "outline" };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getTestBadge = (test: string | null) => {
    if (!test) return null;
    const variants: Record<string, { label: string; variant: "default" | "secondary" | "outline" }> = {
      yes: { label: "✓ Testé", variant: "default" },
      no: { label: "Non testé", variant: "outline" },
      planned: { label: "Test planifié", variant: "secondary" },
    };
    const config = variants[test] || { label: test, variant: "outline" };
    return <Badge variant={config.variant} className="text-xs">{config.label}</Badge>;
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Breadcrumbs />
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative py-16 md:py-20 border-b border-border/50 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background" />
          
          <div className="container relative">
            <div className="max-w-3xl mx-auto text-center">
              <Badge variant="outline" className="mb-6 px-4 py-1.5 text-sm font-medium border-primary/20 bg-primary/5 text-primary">
                <Leaf className="w-4 h-4 mr-2" />
                Archives de Terrain
              </Badge>
              
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-foreground">
                Archives de Terrain PERFUMUM
              </h1>
              
              <p className="text-lg text-muted-foreground">
                Documentation complète des captations olfactives réalisées sur le terrain : contextes géographiques, 
                descriptions sensorielles, hypothèses de traduction et tests effectués.
              </p>
            </div>
          </div>
        </section>

        {/* Liste des archives */}
        <section className="section-spacing">
          <div className="container">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Skeleton key={i} className="h-64" />
                ))}
              </div>
            ) : archives && archives.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {archives.map((archive) => (
                  <Link key={archive.id} href={`/archives-terrain/${archive.id}`}>
                    <Card className="h-full hover:shadow-lg transition-all duration-200 cursor-pointer group border-border/50 hover:border-primary/40">
                      <CardHeader className="bg-gradient-to-br from-amber-50 to-stone-50 group-hover:from-amber-100 group-hover:to-stone-100 transition-colors">
                        <div className="flex items-start justify-between mb-2">
                          <CardTitle className="text-lg group-hover:text-amber-900 transition-colors">
                            {archive.provisionalName}
                          </CardTitle>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {getStatusBadge(archive.status)}
                          {getTestBadge(archive.testPerformed)}
                        </div>
                      </CardHeader>
                      <CardContent className="pt-4 space-y-3">
                        {archive.zone && (
                          <div className="flex items-start gap-2 text-sm">
                            <MapPin className="h-4 w-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                            <span className="text-stone-600">{archive.zone}</span>
                          </div>
                        )}
                        {archive.altitude && (
                          <div className="flex items-start gap-2 text-sm">
                            <Mountain className="h-4 w-4 text-stone-600 mt-0.5 flex-shrink-0" />
                            <span className="text-stone-600">{archive.altitude}m</span>
                          </div>
                        )}
                        {archive.date && (
                          <div className="flex items-start gap-2 text-sm">
                            <Calendar className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                            <span className="text-stone-600">
                              {new Date(archive.date).toLocaleDateString("fr-FR")}
                            </span>
                          </div>
                        )}
                        {archive.dominantSmell && (
                          <p className="text-sm text-stone-600 line-clamp-2 mt-3">
                            {archive.dominantSmell}
                          </p>
                        )}
                        <Button
                          variant="ghost"
                          className="w-full mt-4 group-hover:bg-amber-100 group-hover:text-amber-900 transition-colors"
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
                <Leaf className="h-16 w-16 mx-auto mb-4 text-stone-300" />
                <h3 className="text-xl font-semibold text-stone-700 mb-2">
                  Aucune archive de terrain disponible
                </h3>
                <p className="text-stone-500">
                  Les archives de terrain seront ajoutées au fur et à mesure des captations.
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
