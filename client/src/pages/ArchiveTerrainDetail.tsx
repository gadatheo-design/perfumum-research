import { useParams, Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { MapPin, Calendar, Mountain, Thermometer, TestTube, ArrowLeft, Leaf, Eye, Clock, Flame } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function ArchiveTerrainDetail() {
  const params = useParams();
  const archiveId = parseInt(params.id || "0");

  const { data: archive, isLoading } = trpc.fieldArchives.getById.useQuery(archiveId);

  if (isLoading) {
    return (
      <div className="container py-8">
        <Skeleton className="h-8 w-64 mb-4" />
        <Skeleton className="h-96 w-full mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  if (!archive) {
    return (
      <div className="container py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Archive non trouvée</h1>
        <Link href="/archives-terrain">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour aux archives
          </Button>
        </Link>
      </div>
    );
  }

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
      yes: { label: "Test effectué", variant: "default" },
      no: { label: "Pas de test", variant: "outline" },
      planned: { label: "Test planifié", variant: "secondary" },
    };
    const config = variants[test] || { label: test, variant: "outline" };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-amber-50/30 to-emerald-50/20">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-900 via-stone-800 to-emerald-900 text-white py-12">
        <div className="container">
          <Link href="/archives-terrain">
            <Button variant="ghost" className="text-white hover:bg-white/10 mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour aux archives
            </Button>
          </Link>
          <h1 className="text-4xl font-bold mb-2">{archive.provisionalName}</h1>
          <div className="flex flex-wrap gap-2 mt-4">
            {getStatusBadge(archive.status)}
            {getTestBadge(archive.testPerformed)}
          </div>
        </div>
      </div>

      <div className="container py-8">
        {/* Carte géographique */}
        {archive.preciseLocation && (
          <Card className="mb-6 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-emerald-50 to-amber-50">
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-emerald-600" />
                Localisation
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="h-96 bg-stone-100 flex items-center justify-center text-stone-500">
                {/* TODO: Intégrer Google Maps ou Leaflet */}
                <div className="text-center">
                  <MapPin className="h-12 w-12 mx-auto mb-2 text-stone-400" />
                  <p className="font-semibold">{archive.preciseLocation}</p>
                  {archive.zone && <p className="text-sm">{archive.zone}</p>}
                  {archive.altitude && <p className="text-sm">{archive.altitude}m d'altitude</p>}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Contexte de la rencontre */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Informations générales */}
          <Card className="lg:col-span-1">
            <CardHeader className="bg-gradient-to-br from-amber-50 to-stone-50">
              <CardTitle className="flex items-center gap-2">
                <Leaf className="h-5 w-5 text-amber-600" />
                Contexte
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              {archive.date && (
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-amber-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-stone-600">Date</p>
                    <p className="text-sm">{new Date(archive.date).toLocaleDateString("fr-FR")}</p>
                  </div>
                </div>
              )}
              {archive.altitude && (
                <div className="flex items-start gap-3">
                  <Mountain className="h-5 w-5 text-stone-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-stone-600">Altitude</p>
                    <p className="text-sm">{archive.altitude} mètres</p>
                  </div>
                </div>
              )}
              {archive.climate && (
                <div className="flex items-start gap-3">
                  <Thermometer className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-stone-600">Climat</p>
                    <p className="text-sm">{archive.climate}</p>
                  </div>
                </div>
              )}
              {archive.testPerformed !== "no" && archive.testType && (
                <div className="flex items-start gap-3">
                  <TestTube className="h-5 w-5 text-emerald-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-stone-600">Type de test</p>
                    <p className="text-sm">{archive.testType}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Description sensorielle */}
          <Card className="lg:col-span-2">
            <CardHeader className="bg-gradient-to-br from-emerald-50 to-amber-50">
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-emerald-600" />
                Expérience Sensorielle
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              {archive.encounterContext && (
                <div>
                  <h3 className="font-semibold text-stone-700 mb-2">Contexte de la rencontre</h3>
                  <p className="text-sm text-stone-600 leading-relaxed">{archive.encounterContext}</p>
                </div>
              )}
              {archive.material && (
                <div>
                  <h3 className="font-semibold text-stone-700 mb-2">Matière rencontrée</h3>
                  <p className="text-sm text-stone-600 leading-relaxed">{archive.material}</p>
                  {archive.materialState && (
                    <Badge variant="outline" className="mt-2">
                      État : {archive.materialState}
                    </Badge>
                  )}
                </div>
              )}
              {archive.dominantSmell && (
                <div>
                  <h3 className="font-semibold text-stone-700 mb-2">Odeur dominante</h3>
                  <p className="text-sm text-stone-600 leading-relaxed">{archive.dominantSmell}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Évolution temporelle */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {archive.firstImpression && (
            <Card>
              <CardHeader className="bg-gradient-to-br from-amber-50 to-yellow-50">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Flame className="h-4 w-4 text-amber-600" />
                  Première impression
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-sm text-stone-600 leading-relaxed">{archive.firstImpression}</p>
              </CardContent>
            </Card>
          )}
          {archive.evolution && (
            <Card>
              <CardHeader className="bg-gradient-to-br from-emerald-50 to-teal-50">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Clock className="h-4 w-4 text-emerald-600" />
                  Évolution
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-sm text-stone-600 leading-relaxed">{archive.evolution}</p>
              </CardContent>
            </Card>
          )}
          {archive.persistence && (
            <Card>
              <CardHeader className="bg-gradient-to-br from-stone-50 to-slate-50">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Mountain className="h-4 w-4 text-stone-600" />
                  Persistance
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-sm text-stone-600 leading-relaxed">{archive.persistence}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Analyse et hypothèses */}
        <Card className="mb-6">
          <CardHeader className="bg-gradient-to-r from-violet-50 to-purple-50">
            <CardTitle>Analyse & Hypothèses</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            {archive.olfactiveHypothesis && (
              <div>
                <h3 className="font-semibold text-stone-700 mb-2">Hypothèse olfactive</h3>
                <p className="text-sm text-stone-600 leading-relaxed">{archive.olfactiveHypothesis}</p>
              </div>
            )}
            {archive.translationHypothesis && (
              <div>
                <h3 className="font-semibold text-stone-700 mb-2">Hypothèse de traduction</h3>
                <p className="text-sm text-stone-600 leading-relaxed">{archive.translationHypothesis}</p>
              </div>
            )}
            {archive.localUsage && (
              <div>
                <h3 className="font-semibold text-stone-700 mb-2">Usage local observé</h3>
                <p className="text-sm text-stone-600 leading-relaxed">{archive.localUsage}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Notes personnelles */}
        {(archive.personalFeeling || archive.whatToKeep || archive.whatToLeave || archive.personalNote) && (
          <Card>
            <CardHeader className="bg-gradient-to-r from-rose-50 to-pink-50">
              <CardTitle>Notes Personnelles</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              {archive.personalFeeling && (
                <div>
                  <h3 className="font-semibold text-stone-700 mb-2">Ressenti personnel</h3>
                  <p className="text-sm text-stone-600 leading-relaxed">{archive.personalFeeling}</p>
                </div>
              )}
              {archive.whatToKeep && (
                <div>
                  <h3 className="font-semibold text-stone-700 mb-2">Ce que je garde</h3>
                  <p className="text-sm text-stone-600 leading-relaxed">{archive.whatToKeep}</p>
                </div>
              )}
              {archive.whatToLeave && (
                <div>
                  <h3 className="font-semibold text-stone-700 mb-2">Ce que je laisse</h3>
                  <p className="text-sm text-stone-600 leading-relaxed">{archive.whatToLeave}</p>
                </div>
              )}
              {archive.personalNote && (
                <div>
                  <h3 className="font-semibold text-stone-700 mb-2">Archive subjective</h3>
                  <p className="text-sm text-stone-600 leading-relaxed italic">{archive.personalNote}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
