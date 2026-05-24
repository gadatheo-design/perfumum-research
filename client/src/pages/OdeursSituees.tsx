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
import { Sparkles, Calendar, MapPin, Cloud, CheckCircle, XCircle, HelpCircle, ArrowRight } from "lucide-react";

export default function OdeursSituees() {
  const { data: smells, isLoading } = trpc.situatedSmells.list.useQuery();

  const getRecreatableBadge = (recreatable: string | null) => {
    if (!recreatable) return null;
    const config: Record<string, { label: string; icon: any; variant: "default" | "secondary" | "outline" | "destructive" }> = {
      yes: { label: "Recréable", icon: CheckCircle, variant: "default" },
      no: { label: "Non recréable", icon: XCircle, variant: "outline" },
      maybe: { label: "Peut-être", icon: HelpCircle, variant: "secondary" },
    };
    const item = config[recreatable] || { label: recreatable, icon: HelpCircle, variant: "outline" };
    const Icon = item.icon;
    return (
      <Badge variant={item.variant} className="gap-1">
        <Icon className="h-3 w-3" />
        {item.label}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Breadcrumbs />
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="section-spacing bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 text-purple-900 text-sm font-medium mb-6">
                <Sparkles className="h-4 w-4" />
                Odeurs Situées
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-900 via-pink-800 to-rose-900 bg-clip-text text-transparent">
                Odeurs Situées & Mémoires Olfactives
              </h1>
              <p className="text-lg text-stone-600 leading-relaxed">
                Archive poétique des odeurs rencontrées in situ : impressions immédiates, souvenirs déclenchés, 
                et potentiel de recréation en laboratoire.
              </p>
            </div>
          </div>
        </section>

        {/* Liste des odeurs */}
        <section className="section-spacing">
          <div className="container">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Skeleton key={i} className="h-64" />
                ))}
              </div>
            ) : smells && smells?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {smells?.map((smell) => (
                  <Link key={smell.id} href={`/odeurs-situees/${smell.id}`}>
                    <Card className="h-full hover:shadow-xl transition-all duration-300 cursor-pointer group border-l-4 border-l-purple-500">
                      <CardHeader className="bg-gradient-to-br from-purple-50 to-pink-50 group-hover:from-purple-100 group-hover:to-pink-100 transition-colors">
                        <div className="flex items-start justify-between mb-2">
                          <CardTitle className="text-lg group-hover:text-purple-900 transition-colors">
                            {smell.poeticName}
                          </CardTitle>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {getRecreatableBadge(smell.recreatable)}
                        </div>
                      </CardHeader>
                      <CardContent className="pt-4 space-y-3">
                        {smell.location && (
                          <div className="flex items-start gap-2 text-sm">
                            <MapPin className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                            <span className="text-stone-600">{smell.location}</span>
                          </div>
                        )}
                        {smell.date && (
                          <div className="flex items-start gap-2 text-sm">
                            <Calendar className="h-4 w-4 text-pink-600 mt-0.5 flex-shrink-0" />
                            <span className="text-stone-600">
                              {new Date(smell.date).toLocaleDateString("fr-FR")}
                            </span>
                          </div>
                        )}
                        {smell.weather && (
                          <div className="flex items-start gap-2 text-sm">
                            <Cloud className="h-4 w-4 text-rose-600 mt-0.5 flex-shrink-0" />
                            <span className="text-stone-600">{smell.weather}</span>
                          </div>
                        )}
                        {smell.immediateImpression && (
                          <p className="text-sm text-stone-600 line-clamp-2 mt-3 italic">
                            "{smell.immediateImpression}"
                          </p>
                        )}
                        <Button
                          variant="ghost"
                          className="w-full mt-4 group-hover:bg-purple-100 group-hover:text-purple-900 transition-colors"
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
                <Sparkles className="h-16 w-16 mx-auto mb-4 text-stone-300" />
                <h3 className="text-xl font-semibold text-stone-700 mb-2">
                  Aucune odeur située disponible
                </h3>
                <p className="text-stone-500">
                  Les odeurs situées seront ajoutées au fur et à mesure des rencontres olfactives.
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
