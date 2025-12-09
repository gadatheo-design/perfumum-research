import { Link, useParams } from "wouter";
import { trpc } from "@/lib/trpc";
import { useEffect } from "react";
import { ArrowLeft, Loader2, Atom, Droplet, Thermometer, Zap, Sparkles, Leaf } from "lucide-react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";

export default function MoleculeDetail() {
  const params = useParams();
  const id = params.id ? parseInt(params.id) : 0;

  const { data: molecule, isLoading } = trpc.molecules.getById.useQuery(id);
  const trackEvent = trpc.analytics.trackEvent.useMutation();

  // Track page view
  useEffect(() => {
    if (molecule) {
      trackEvent.mutate({
        eventType: "molecule_view",
        entityId: molecule.id,
        entityType: "molecule",
        metadata: JSON.stringify({
          moleculeName: molecule.name,
          family: molecule.family,
          source: "molecule_detail",
        }),
      });
    }
  }, [molecule?.id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!molecule) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="container max-w-6xl">
          <Link href="/molecules">
            <a className="inline-flex items-center gap-2 text-primary hover:underline mb-4">
              <ArrowLeft className="h-4 w-4" />
              Retour aux molécules
            </a>
          </Link>
          <h1 className="text-2xl font-bold mb-4">Molécule introuvable</h1>
          <p className="text-muted-foreground">
            La molécule demandée n'existe pas ou a été supprimée.
          </p>
        </div>
      </div>
    );
  }

  // Préparer les données pour le radar chart
  const radarData = [
    { axis: "Intensité", value: molecule.radarIntensity || 50 },
    { axis: "Fraîcheur", value: molecule.radarFreshness || 50 },
    { axis: "Chaleur", value: molecule.radarWarmth || 50 },
    { axis: "Douceur", value: molecule.radarSweetness || 50 },
    { axis: "Épices", value: molecule.radarSpiciness || 50 },
    { axis: "Terreux", value: molecule.radarEarthiness || 50 },
  ];

  const hasRadarData = radarData.some(d => d.value !== 50);

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="container max-w-6xl">
        <Link href="/molecules">
          <a className="inline-flex items-center gap-2 text-primary hover:underline mb-6">
            <ArrowLeft className="h-4 w-4" />
            Retour aux molécules
          </a>
        </Link>

        <div className="space-y-8">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-8 rounded-lg border">
            <h1 className="text-4xl font-bold mb-2">{molecule.name}</h1>
            {molecule.chemicalFormula && (
              <p className="text-xl text-muted-foreground font-mono mb-4">
                {molecule.chemicalFormula}
              </p>
            )}
            {molecule.family && (
              <div className="inline-block bg-primary/20 text-primary px-4 py-2 rounded-full text-sm font-semibold">
                {molecule.family}
              </div>
            )}
          </div>

          {/* Profil Olfactif Section */}
          <div className="grid md:grid-cols-2 gap-6">
            {molecule.olfactiveProfile && (
              <div className="bg-card p-6 rounded-lg border shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <h2 className="text-lg font-semibold">Profil Olfactif</h2>
                </div>
                <p className="whitespace-pre-wrap text-muted-foreground">{molecule.olfactiveProfile}</p>
              </div>
            )}

            {molecule.emotionalResonance && (
              <div className="bg-card p-6 rounded-lg border shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <Zap className="h-5 w-5 text-primary" />
                  <h2 className="text-lg font-semibold">Résonance Émotionnelle</h2>
                </div>
                <p className="whitespace-pre-wrap text-muted-foreground">{molecule.emotionalResonance}</p>
              </div>
            )}

            {molecule.functionalEffect && (
              <div className="bg-card p-6 rounded-lg border shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <Atom className="h-5 w-5 text-primary" />
                  <h2 className="text-lg font-semibold">Effet Fonctionnel</h2>
                </div>
                <p className="whitespace-pre-wrap text-muted-foreground">{molecule.functionalEffect}</p>
              </div>
            )}

            {molecule.sourceOrigin && (
              <div className="bg-card p-6 rounded-lg border shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <Leaf className="h-5 w-5 text-primary" />
                  <h2 className="text-lg font-semibold">Origine</h2>
                </div>
                <p className="text-muted-foreground">{molecule.sourceOrigin}</p>
              </div>
            )}
          </div>

          {/* Propriétés Scientifiques */}
          {(molecule.molecularWeight || molecule.boilingPoint || molecule.logP || molecule.volatility || molecule.intensity || molecule.complexity) && (
            <div className="bg-card p-6 rounded-lg border shadow-sm">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Thermometer className="h-5 w-5 text-primary" />
                Propriétés Scientifiques
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {molecule.molecularWeight && (
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Masse Moléculaire</p>
                    <p className="text-2xl font-bold">{molecule.molecularWeight} <span className="text-sm font-normal">g/mol</span></p>
                  </div>
                )}
                {molecule.boilingPoint && (
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Point d'Ébullition</p>
                    <p className="text-2xl font-bold">{molecule.boilingPoint} <span className="text-sm font-normal">°C</span></p>
                  </div>
                )}
                {molecule.logP && (
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">LogP</p>
                    <p className="text-2xl font-bold">{(molecule.logP / 100).toFixed(2)}</p>
                  </div>
                )}
                {molecule.volatility && (
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Volatilité</p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-background rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: `${molecule.volatility}%` }}></div>
                      </div>
                      <span className="text-sm font-semibold">{molecule.volatility}%</span>
                    </div>
                  </div>
                )}
                {molecule.intensity && (
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Intensité Olfactive</p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-background rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: `${molecule.intensity}%` }}></div>
                      </div>
                      <span className="text-sm font-semibold">{molecule.intensity}%</span>
                    </div>
                  </div>
                )}
                {molecule.complexity && (
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Complexité</p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-background rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: `${molecule.complexity}%` }}></div>
                      </div>
                      <span className="text-sm font-semibold">{molecule.complexity}%</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Profil Radar Olfactif */}
          {hasRadarData && (
            <div className="bg-card p-6 rounded-lg border shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Profil Radar Olfactif</h2>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="hsl(var(--border))" />
                    <PolarAngleAxis dataKey="axis" tick={{ fill: "hsl(var(--foreground))", fontSize: 14 }} />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: "hsl(var(--muted-foreground))" }} />
                    <Radar
                      name={molecule.name}
                      dataKey="value"
                      stroke="hsl(var(--primary))"
                      fill="hsl(var(--primary))"
                      fillOpacity={0.3}
                      strokeWidth={2}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Informations Botaniques et Extraction */}
          <div className="grid md:grid-cols-2 gap-6">
            {molecule.botanicalSources && (
              <div className="bg-card p-6 rounded-lg border shadow-sm">
                <h2 className="text-lg font-semibold mb-3">Sources Botaniques</h2>
                <p className="whitespace-pre-wrap text-muted-foreground">{molecule.botanicalSources}</p>
              </div>
            )}

            {molecule.extractionMethod && (
              <div className="bg-card p-6 rounded-lg border shadow-sm">
                <h2 className="text-lg font-semibold mb-3">Méthode d'Extraction</h2>
                <p className="whitespace-pre-wrap text-muted-foreground">{molecule.extractionMethod}</p>
              </div>
            )}

            {molecule.therapeuticProperties && (
              <div className="bg-card p-6 rounded-lg border shadow-sm">
                <h2 className="text-lg font-semibold mb-3">Propriétés Thérapeutiques</h2>
                <p className="whitespace-pre-wrap text-muted-foreground">{molecule.therapeuticProperties}</p>
              </div>
            )}

            {molecule.concentration && (
              <div className="bg-card p-6 rounded-lg border shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <Droplet className="h-5 w-5 text-primary" />
                  <h2 className="text-lg font-semibold">Concentration Recommandée</h2>
                </div>
                <p className="text-2xl font-bold text-primary">{molecule.concentration}</p>
              </div>
            )}
          </div>

          {/* Notes de Recherche */}
          {molecule.notes && (
            <div className="bg-card p-6 rounded-lg border shadow-sm">
              <h2 className="text-lg font-semibold mb-3">Notes de Recherche</h2>
              <p className="whitespace-pre-wrap text-muted-foreground">{molecule.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
