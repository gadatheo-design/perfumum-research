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
import { TestTube, Calendar, Beaker, Clock, FileText, CheckCircle, XCircle, HelpCircle, ArrowLeft, Link as LinkIcon } from "lucide-react";

export default function TestExtractionDetail() {
  const [, params] = useRoute("/tests-extraction/:id");
  const id = params?.id ? parseInt(params.id) : 0;

  const { data: test, isLoading } = trpc.extractionTests.getById.useQuery(id, {
    enabled: id > 0,
  });

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
      mct: "MCT (Triglycérides à chaîne moyenne)",
      alcohol_95: "Alcool 95%",
      alcohol_70: "Alcool 70%",
      water: "Eau",
      other: "Autre solvant",
    };
    return labels[solvent] || solvent;
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

  if (!test) {
    return (
      <div className="min-h-screen flex flex-col">
        <Breadcrumbs />
        <Header />
        <main className="flex-1 section-spacing">
          <div className="container text-center py-12">
            <TestTube className="h-16 w-16 mx-auto mb-4 text-stone-300" />
            <h2 className="text-2xl font-semibold text-stone-700 mb-2">
              Test d'extraction introuvable
            </h2>
            <Link href="/tests-extraction">
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
        <section className="section-spacing bg-gradient-to-br from-blue-50 via-indigo-50 to-violet-50">
          <div className="container">
            <Link href="/tests-extraction">
              <Button variant="ghost" className="mb-6">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour aux tests
              </Button>
            </Link>
            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-900 text-sm font-medium mb-4">
                <TestTube className="h-4 w-4" />
                Test d'Extraction
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-900 via-indigo-800 to-violet-900 bg-clip-text text-transparent">
                {test?.testName}
              </h1>
              <div className="flex flex-wrap gap-3">
                {getViableBadge(test?.viable)}
                {test?.date && (
                  <Badge variant="outline" className="gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(test?.date).toLocaleDateString("fr-FR")}
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
                {/* Protocole d'extraction */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Beaker className="h-5 w-5 text-blue-600" />
                      Protocole d'Extraction
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-stone-700 mb-2">Solvant</h3>
                      <p className="text-stone-600">{getSolventLabel(test?.solvent)}</p>
                    </div>
                    {test?.ratio && (
                      <div>
                        <h3 className="font-semibold text-stone-700 mb-2">Ratio</h3>
                        <p className="text-stone-600">{test?.ratio}</p>
                      </div>
                    )}
                    {test?.duration && (
                      <div>
                        <h3 className="font-semibold text-stone-700 mb-2">Durée</h3>
                        <p className="text-stone-600">{test?.duration} heures</p>
                      </div>
                    )}
                    {test?.material && (
                      <div>
                        <h3 className="font-semibold text-stone-700 mb-2">Matière testée</h3>
                        <p className="text-stone-600">{test?.material}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Résultat olfactif */}
                {test?.resultSmell && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TestTube className="h-5 w-5 text-indigo-600" />
                        Résultat Olfactif
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-stone-600 leading-relaxed whitespace-pre-wrap">
                        {test?.resultSmell}
                      </p>
                    </CardContent>
                  </Card>
                )}

                {/* Observations temporelles */}
                {(test?.observationDay1 || test?.observationDay7) && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Clock className="h-5 w-5 text-violet-600" />
                        Observations Temporelles
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {test?.observationDay1 && (
                        <div>
                          <h3 className="font-semibold text-stone-700 mb-2">Jour +1</h3>
                          <p className="text-stone-600 leading-relaxed whitespace-pre-wrap">
                            {test?.observationDay1}
                          </p>
                        </div>
                      )}
                      {test?.observationDay7 && (
                        <div>
                          <h3 className="font-semibold text-stone-700 mb-2">Jour +7</h3>
                          <p className="text-stone-600 leading-relaxed whitespace-pre-wrap">
                            {test?.observationDay7}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Notes */}
                {test?.notes && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-stone-600" />
                        Notes de Recherche
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-stone-600 leading-relaxed whitespace-pre-wrap">
                        {test?.notes}
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Viabilité */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Viabilité</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {getViableBadge(test?.viable)}
                  </CardContent>
                </Card>

                {/* Lien vers archive terrain */}
                {test?.fieldArchiveId && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <LinkIcon className="h-4 w-4" />
                        Archive Liée
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Link href={`/archives-terrain/${test?.fieldArchiveId}`}>
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
                    {test?.createdAt && (
                      <div>
                        <span className="text-stone-500">Créé le :</span>
                        <p className="text-stone-700">
                          {new Date(test?.createdAt).toLocaleDateString("fr-FR")}
                        </p>
                      </div>
                    )}
                    {test?.updatedAt && (
                      <div>
                        <span className="text-stone-500">Modifié le :</span>
                        <p className="text-stone-700">
                          {new Date(test?.updatedAt).toLocaleDateString("fr-FR")}
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
