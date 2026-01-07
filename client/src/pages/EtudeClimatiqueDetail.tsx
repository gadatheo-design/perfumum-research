import { useParams, Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { MapPin, Calendar, Cloud, Wind, Droplets, ArrowLeft, Leaf, Layers, FlaskConical } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export default function EtudeClimatiqueDetail() {
  const params = useParams();
  const studyId = parseInt(params.id || "0");

  const { data: study, isLoading } = trpc.climateStudies.getById.useQuery(studyId);

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

  if (!study) {
    return (
      <div className="container py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Étude non trouvée</h1>
        <Link href="/etudes-climatiques">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour aux études
          </Button>
        </Link>
      </div>
    );
  }

  const getTypeBadge = (type: string | null) => {
    if (!type) return null;
    const variants: Record<string, { label: string; variant: "default" | "secondary" | "outline" }> = {
      petrichor: { label: "Pétrichor", variant: "default" },
      rain_vegetation: { label: "Végétation après pluie", variant: "secondary" },
      volcanic: { label: "Volcanique", variant: "outline" },
      glacial: { label: "Glaciaire", variant: "outline" },
    };
    const config = variants[type] || { label: type, variant: "outline" };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50/30 to-cyan-50/20">
      {/* Breadcrumbs */}
      <div className="container pt-4">
        <Breadcrumbs currentLabel={study.name || "Étude"} />
      </div>
      
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 via-cyan-800 to-sky-900 text-white py-12">
        <div className="container">
          <Link href="/etudes-climatiques">
            <Button variant="ghost" className="text-white hover:bg-white/10 mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour aux études
            </Button>
          </Link>
          <h1 className="text-4xl font-bold mb-2">{study.name}</h1>
          <div className="flex flex-wrap gap-2 mt-4">
            {getTypeBadge(study.axis)}
          </div>
        </div>
      </div>

      <div className="container py-8">
        {/* Contexte géographique et climatique */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Informations géographiques */}
          <Card className="lg:col-span-1">
            <CardHeader className="bg-gradient-to-br from-sky-50 to-blue-50">
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-sky-600" />
                Géographie
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              {study.zone && (
                <div>
                  <p className="text-sm font-medium text-stone-600 mb-1">Zone</p>
                  <p className="text-sm text-stone-700">{study.zone}</p>
                </div>
              )}
              {study.altitude && (
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-sky-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-stone-600">Altitude</p>
                    <p className="text-sm">{study.altitude}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Conditions climatiques */}
          <Card className="lg:col-span-2">
            <CardHeader className="bg-gradient-to-br from-cyan-50 to-sky-50">
              <CardTitle className="flex items-center gap-2">
                <Cloud className="h-5 w-5 text-cyan-600" />
                Conditions Climatiques
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              {study.climate && (
                <div>
                  <p className="text-sm text-stone-600 leading-relaxed">{study.climate}</p>
                </div>
              )}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                {study.keyMoment && (
                  <div className="flex items-center gap-2">
                    <Wind className="h-4 w-4 text-orange-500" />
                    <div>
                      <p className="text-xs text-stone-500">Moment clé</p>
                      <p className="text-sm font-medium">{study.keyMoment}</p>
                    </div>
                  </div>
                )}

              </div>
            </CardContent>
          </Card>
        </div>

        {/* Description sensorielle */}
        <Card className="mb-6">
          <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50">
            <CardTitle className="flex items-center gap-2">
              <Leaf className="h-5 w-5 text-emerald-600" />
              Description Sensorielle
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {study.attackDescription && (
                <div>
                  <h3 className="font-semibold text-stone-700 mb-2 flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-amber-500"></div>
                    Notes d'attaque
                  </h3>
                  <p className="text-sm text-stone-600 leading-relaxed">{study.attackDescription}</p>
                </div>
              )}
              {study.heartDescription && (
                <div>
                  <h3 className="font-semibold text-stone-700 mb-2 flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-rose-500"></div>
                    Notes de cœur
                  </h3>
                  <p className="text-sm text-stone-600 leading-relaxed">{study.heartDescription}</p>
                </div>
              )}
              {study.baseDescription && (
                <div>
                  <h3 className="font-semibold text-stone-700 mb-2 flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-stone-600"></div>
                    Notes de fond
                  </h3>
                  <p className="text-sm text-stone-600 leading-relaxed">{study.baseDescription}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Supports observés */}
        {study.observedSupports && (
          <Card className="mb-6">
            <CardHeader className="bg-gradient-to-r from-violet-50 to-purple-50">
              <CardTitle className="flex items-center gap-2">
                <Layers className="h-5 w-5 text-violet-600" />
                Supports Observés
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-sm text-stone-600 leading-relaxed">{study.observedSupports}</p>
            </CardContent>
          </Card>
        )}

        {/* Traduction laboratoire */}
        {(study.headTranslation || study.heartTranslation || study.baseTranslation) && (
          <Card>
            <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50">
              <CardTitle className="flex items-center gap-2">
                <FlaskConical className="h-5 w-5 text-amber-600" />
                Hypothèse de Traduction Laboratoire
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {study.headTranslation && (
                  <div>
                    <h3 className="font-semibold text-stone-700 mb-2 flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-amber-500"></div>
                      Tête
                    </h3>
                    <p className="text-sm text-stone-600 leading-relaxed">{study.headTranslation}</p>
                  </div>
                )}
                {study.heartTranslation && (
                  <div>
                    <h3 className="font-semibold text-stone-700 mb-2 flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-rose-500"></div>
                      Cœur
                    </h3>
                    <p className="text-sm text-stone-600 leading-relaxed">{study.heartTranslation}</p>
                  </div>
                )}
                {study.baseTranslation && (
                  <div>
                    <h3 className="font-semibold text-stone-700 mb-2 flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-stone-600"></div>
                      Fond
                    </h3>
                    <p className="text-sm text-stone-600 leading-relaxed">{study.baseTranslation}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
