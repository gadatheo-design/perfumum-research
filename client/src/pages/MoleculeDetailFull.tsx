import { useParams, Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, Beaker, Droplets, Flame, Snowflake, Wind, Activity, Target, Leaf, Factory, Zap } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function MoleculeDetailFull() {
  const { id } = useParams();
  const moleculeId = parseInt(id || "0");

  const { data, isLoading, error } = trpc.molecule.getById.useQuery(moleculeId);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">Erreur lors du chargement de la molécule</p>
          <Button asChild>
            <Link href="/molecules">Retour aux molécules</Link>
          </Button>
        </div>
      </div>
    );
  }

  const molecule = data;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container py-6">
          <Button variant="ghost" size="sm" asChild className="mb-4">
            <Link href="/molecules">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour aux molécules
            </Link>
          </Button>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">{molecule.name}</h1>
              {molecule.chemicalFormula && (
                <p className="text-xl text-muted-foreground font-mono">{molecule.chemicalFormula}</p>
              )}
            </div>
            <Badge variant="outline" className="text-lg px-4 py-2">
              {molecule.chemicalFamily || "Non classé"}
            </Badge>
          </div>
        </div>
      </div>

      <div className="container py-8 space-y-6">
        {/* Profil Olfactif */}
        {molecule.olfactiveProfile && (
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Droplets className="h-5 w-5 text-primary" />
              <h2 className="text-2xl font-semibold">Profil Olfactif</h2>
            </div>
            <p className="text-lg leading-relaxed">{molecule.olfactiveProfile}</p>
          </Card>
        )}

        {/* Propriétés Scientifiques */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Beaker className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-semibold">Propriétés Scientifiques</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {molecule.molecularWeight && (
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Poids Moléculaire</p>
                <p className="text-lg font-semibold">{molecule.molecularWeight} g/mol</p>
              </div>
            )}
            {molecule.boilingPoint && (
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Point d'Ébullition</p>
                <p className="text-lg font-semibold">{molecule.boilingPoint}°C</p>
              </div>
            )}
            {molecule.logP !== null && molecule.logP !== undefined && (
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">LogP (Lipophilie)</p>
                <p className="text-lg font-semibold">{molecule.logP}</p>
              </div>
            )}
            {molecule.volatility && (
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Volatilité</p>
                <div className="flex items-center gap-2">
                  <Wind className="h-4 w-4 text-cyan-500" />
                  <p className="text-lg font-semibold">{molecule.volatility}</p>
                </div>
              </div>
            )}
            {molecule.intensity && (
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Intensité Olfactive</p>
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-yellow-500" />
                  <p className="text-lg font-semibold">{molecule.intensity}/10</p>
                </div>
              </div>
            )}
            {molecule.complexity && (
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Complexité</p>
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-purple-500" />
                  <p className="text-lg font-semibold">{molecule.complexity}/10</p>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Profil Radar Olfactif */}
        {(molecule.radarIntensity || molecule.radarFreshness || molecule.radarWarmth || 
          molecule.radarSweetness || molecule.radarSpiciness || molecule.radarEarthiness) && (
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="h-5 w-5 text-primary" />
              <h2 className="text-2xl font-semibold">Profil Radar Olfactif</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {molecule.radarIntensity !== null && (
                <div className="p-4 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-lg border border-yellow-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="h-4 w-4 text-yellow-600" />
                    <p className="text-sm font-medium">Intensité</p>
                  </div>
                  <p className="text-2xl font-bold">{molecule.radarIntensity}/100</p>
                </div>
              )}
              {molecule.radarFreshness !== null && (
                <div className="p-4 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-lg border border-cyan-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Snowflake className="h-4 w-4 text-cyan-600" />
                    <p className="text-sm font-medium">Fraîcheur</p>
                  </div>
                  <p className="text-2xl font-bold">{molecule.radarFreshness}/100</p>
                </div>
              )}
              {molecule.radarWarmth !== null && (
                <div className="p-4 bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-lg border border-orange-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Flame className="h-4 w-4 text-orange-600" />
                    <p className="text-sm font-medium">Chaleur</p>
                  </div>
                  <p className="text-2xl font-bold">{molecule.radarWarmth}/100</p>
                </div>
              )}
              {molecule.radarSweetness !== null && (
                <div className="p-4 bg-gradient-to-br from-pink-500/10 to-purple-500/10 rounded-lg border border-pink-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Droplets className="h-4 w-4 text-pink-600" />
                    <p className="text-sm font-medium">Douceur</p>
                  </div>
                  <p className="text-2xl font-bold">{molecule.radarSweetness}/100</p>
                </div>
              )}
              {molecule.radarSpiciness !== null && (
                <div className="p-4 bg-gradient-to-br from-red-500/10 to-rose-500/10 rounded-lg border border-red-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="h-4 w-4 text-red-600" />
                    <p className="text-sm font-medium">Piquant</p>
                  </div>
                  <p className="text-2xl font-bold">{molecule.radarSpiciness}/100</p>
                </div>
              )}
              {molecule.radarEarthiness !== null && (
                <div className="p-4 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-lg border border-green-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Leaf className="h-4 w-4 text-green-600" />
                    <p className="text-sm font-medium">Terreux</p>
                  </div>
                  <p className="text-2xl font-bold">{molecule.radarEarthiness}/100</p>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Sources Botaniques */}
        {molecule.botanicalSources && (
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Leaf className="h-5 w-5 text-green-600" />
              <h2 className="text-2xl font-semibold">Sources Botaniques</h2>
            </div>
            <p className="text-lg leading-relaxed">{molecule.botanicalSources}</p>
          </Card>
        )}

        {/* Méthode d'Extraction */}
        {molecule.extractionMethod && (
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Factory className="h-5 w-5 text-blue-600" />
              <h2 className="text-2xl font-semibold">Méthode d'Extraction</h2>
            </div>
            <p className="text-lg leading-relaxed">{molecule.extractionMethod}</p>
          </Card>
        )}

        {/* Propriétés Thérapeutiques */}
        {molecule.therapeuticProperties && (
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Target className="h-5 w-5 text-purple-600" />
              <h2 className="text-2xl font-semibold">Propriétés Thérapeutiques</h2>
            </div>
            <p className="text-lg leading-relaxed">{molecule.therapeuticProperties}</p>
          </Card>
        )}

        {/* Informations Complémentaires */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {molecule.emotionalResonance && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-3">Résonance Émotionnelle</h3>
              <p className="text-muted-foreground leading-relaxed">{molecule.emotionalResonance}</p>
            </Card>
          )}
          {molecule.functionalEffect && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-3">Effet Fonctionnel</h3>
              <p className="text-muted-foreground leading-relaxed">{molecule.functionalEffect}</p>
            </Card>
          )}
          {molecule.origin && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-3">Origine</h3>
              <p className="text-muted-foreground leading-relaxed">{molecule.origin}</p>
            </Card>
          )}
          {molecule.concentration && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-3">Concentration Recommandée</h3>
              <p className="text-muted-foreground leading-relaxed">{molecule.concentration}</p>
            </Card>
          )}
        </div>

        {/* Notes Internes */}
        {molecule.internalNotes && (
          <Card className="p-6 bg-muted/30">
            <h3 className="text-lg font-semibold mb-3">Notes Internes</h3>
            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {molecule.internalNotes}
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
