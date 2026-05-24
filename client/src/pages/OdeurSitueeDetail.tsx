// @ts-nocheck
import { useRoute, Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Header } from "@/components/layout/Header";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Sparkles, Calendar, MapPin, Cloud, FileText, CheckCircle, XCircle, HelpCircle, ArrowLeft, Link as LinkIcon, Brain } from "lucide-react";

export default function OdeurSitueeDetail() {
  const [, params] = useRoute("/odeurs-situees/:id");
  const id = params?.id ? parseInt(params.id) : 0;

  const { data: smell, isLoading } = trpc.situatedSmells.getById.useQuery(id, {
    enabled: id > 0,
  });

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

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Breadcrumbs />
        <Header />
        <main className="flex-1 section-spacing">
          <div className="container">
            <Skeleton className="h-96" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!smell) {
    return (
      <div className="min-h-screen flex flex-col">
        <Breadcrumbs />
        <Header />
        <main className="flex-1 section-spacing">
          <div className="container text-center py-12">
            <Sparkles className="h-16 w-16 mx-auto mb-4 text-stone-300" />
            <h2 className="text-2xl font-semibold text-stone-700 mb-2">
              Odeur située introuvable
            </h2>
            <Link href="/odeurs-situees">
              <Button variant="outline" className="mt-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour à la liste
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Breadcrumbs />
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="section-spacing bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50">
          <div className="container">
            <Link href="/odeurs-situees">
              <Button variant="ghost" className="mb-6">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour aux odeurs situées
              </Button>
            </Link>
            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 text-purple-900 text-sm font-medium mb-4">
                <Sparkles className="h-4 w-4" />
                Odeur Située
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-900 via-pink-800 to-rose-900 bg-clip-text text-transparent">
                {smell?.poeticName}
              </h1>
              <div className="flex flex-wrap gap-3">
                {getRecreatableBadge(smell?.recreatable)}
                {smell?.date && (
                  <Badge variant="outline" className="gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(smell?.date).toLocaleDateString("fr-FR")}
                  </Badge>
                )}
                {smell?.location && (
                  <Badge variant="outline" className="gap-1">
                    <MapPin className="h-3 w-3" />
                    {smell?.location}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Contenu */}
        <section className="section-spacing">
          <div className="container">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Colonne principale */}
              <div className="lg:col-span-2 space-y-6">
                {/* Contexte */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-purple-600" />
                      Contexte de Rencontre
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-stone-700 mb-2">Lieu</h3>
                      <p className="text-stone-600">{smell?.location}</p>
                    </div>
                    {smell?.weather && (
                      <div>
                        <h3 className="font-semibold text-stone-700 mb-2">Météo</h3>
                        <p className="text-stone-600">{smell?.weather}</p>
                      </div>
                    )}
                    {smell?.support && (
                      <div>
                        <h3 className="font-semibold text-stone-700 mb-2">Support</h3>
                        <p className="text-stone-600 whitespace-pre-wrap">{smell?.support}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Impression immédiate */}
                {smell?.immediateImpression && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-pink-600" />
                        Impression Immédiate
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-stone-600 leading-relaxed whitespace-pre-wrap italic text-lg">
                        "{smell?.immediateImpression}"
                      </p>
                    </CardContent>
                  </Card>
                )}

                {/* Souvenir déclenché */}
                {smell?.triggeredMemory && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Brain className="h-5 w-5 text-rose-600" />
                        Souvenir Déclenché
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-stone-600 leading-relaxed whitespace-pre-wrap">
                        {smell?.triggeredMemory}
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Recréabilité */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Recréabilité</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {getRecreatableBadge(smell?.recreatable)}
                    <p className="text-sm text-stone-500 mt-3">
                      Potentiel de recréation en laboratoire
                    </p>
                  </CardContent>
                </Card>

                {/* Lien vers archive terrain */}
                {smell?.linkedFieldArchiveId && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <LinkIcon className="h-4 w-4" />
                        Archive Liée
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Link href={`/archives-terrain/${smell?.linkedFieldArchiveId}`}>
                        <Button variant="outline" className="w-full">
                          Voir l'archive terrain
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                )}

                {/* Métadonnées */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Métadonnées</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    {smell?.date && (
                      <div>
                        <span className="text-stone-500">Date :</span>
                        <p className="text-stone-700">
                          {new Date(smell?.date).toLocaleDateString("fr-FR", {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    )}
                    {smell?.createdAt && (
                      <div>
                        <span className="text-stone-500">Créé le :</span>
                        <p className="text-stone-700">
                          {new Date(smell?.createdAt).toLocaleDateString("fr-FR")}
                        </p>
                      </div>
                    )}
                    {smell?.updatedAt && (
                      <div>
                        <span className="text-stone-500">Modifié le :</span>
                        <p className="text-stone-700">
                          {new Date(smell?.updatedAt).toLocaleDateString("fr-FR")}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
