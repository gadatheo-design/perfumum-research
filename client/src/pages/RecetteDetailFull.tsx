import { useParams, Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, Flame, Clock, DollarSign, Droplets, Wind, Zap, Beaker, Package, FileText } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function RecetteDetailFull() {
  const { id } = useParams();
  const recetteId = parseInt(id || "0");

  const { data, isLoading, error } = trpc.recette.getById.useQuery(recetteId);

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
          <p className="text-red-500 mb-4">Erreur lors du chargement de la recette</p>
          <Button asChild>
            <Link href="/recettes">Retour aux recettes</Link>
          </Button>
        </div>
      </div>
    );
  }

  const recette = data;

  // Déterminer la couleur du badge de statut
  const getStatusColor = (status: string | null) => {
    switch (status) {
      case "production": return "bg-green-500/20 text-green-700 border-green-500/30";
      case "validated": return "bg-blue-500/20 text-blue-700 border-blue-500/30";
      case "testing": return "bg-yellow-500/20 text-yellow-700 border-yellow-500/30";
      case "experimental": return "bg-purple-500/20 text-purple-700 border-purple-500/30";
      default: return "bg-gray-500/20 text-gray-700 border-gray-500/30";
    }
  };

  const getStatusLabel = (status: string | null) => {
    switch (status) {
      case "production": return "Production";
      case "validated": return "Validé";
      case "testing": return "En test";
      case "experimental": return "Expérimental";
      default: return "Non défini";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container py-6">
          <Button variant="ghost" size="sm" asChild className="mb-4">
            <Link href="/recettes">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour aux recettes
            </Link>
          </Button>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">{recette.name}</h1>
              {recette.category && (
                <p className="text-xl text-muted-foreground">{recette.category}</p>
              )}
            </div>
            {recette.status && (
              <Badge className={getStatusColor(recette.status)}>
                {getStatusLabel(recette.status)}
              </Badge>
            )}
          </div>
        </div>
      </div>

      <div className="container py-8 space-y-6">
        {/* Description */}
        {recette.description && (
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Description</h2>
            <p className="text-lg leading-relaxed">{recette.description}</p>
          </Card>
        )}

        {/* Propriétés Techniques */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Beaker className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-semibold">Propriétés Techniques</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recette.intensity && (
              <div className="p-4 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-lg border border-yellow-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="h-4 w-4 text-yellow-600" />
                  <p className="text-sm font-medium">Intensité</p>
                </div>
                <p className="text-2xl font-bold">{recette.intensity}/10</p>
              </div>
            )}
            {recette.stability && (
              <div className="p-4 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-lg border border-blue-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <Package className="h-4 w-4 text-blue-600" />
                  <p className="text-sm font-medium">Stabilité</p>
                </div>
                <p className="text-2xl font-bold">{recette.stability}/10</p>
              </div>
            )}
            {recette.texture && (
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Droplets className="h-4 w-4 text-primary" />
                  <p className="text-sm font-medium">Texture</p>
                </div>
                <p className="text-lg font-semibold">{recette.texture}</p>
              </div>
            )}
            {recette.combustionTemperature && (
              <div className="p-4 bg-gradient-to-br from-red-500/10 to-orange-500/10 rounded-lg border border-red-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <Flame className="h-4 w-4 text-red-600" />
                  <p className="text-sm font-medium">Température de Combustion</p>
                </div>
                <p className="text-2xl font-bold">{recette.combustionTemperature}°C</p>
              </div>
            )}
            {recette.maturationTime && (
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4 text-primary" />
                  <p className="text-sm font-medium">Temps de Maturation</p>
                </div>
                <p className="text-lg font-semibold">{recette.maturationTime}</p>
              </div>
            )}
            {recette.productionTime && (
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4 text-primary" />
                  <p className="text-sm font-medium">Temps de Production</p>
                </div>
                <p className="text-lg font-semibold">{recette.productionTime}</p>
              </div>
            )}
            {recette.costEstimate && (
              <div className="p-4 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-lg border border-green-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="h-4 w-4 text-green-600" />
                  <p className="text-sm font-medium">Coût Estimé</p>
                </div>
                <p className="text-2xl font-bold">{recette.costEstimate}</p>
              </div>
            )}
          </div>
        </Card>

        {/* Évolution Aromatique */}
        {(recette.notesTete || recette.notesCoeur || recette.notesFond) && (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Évolution Aromatique</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {recette.notesTete && (
                <Card className="p-6 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border-cyan-500/20">
                  <div className="flex items-center gap-2 mb-3">
                    <Wind className="h-5 w-5 text-cyan-600" />
                    <h3 className="text-lg font-semibold">Notes de Tête</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">0-15 minutes</p>
                  <p className="leading-relaxed">{recette.notesTete}</p>
                </Card>
              )}
              {recette.notesCoeur && (
                <Card className="p-6 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20">
                  <div className="flex items-center gap-2 mb-3">
                    <Droplets className="h-5 w-5 text-purple-600" />
                    <h3 className="text-lg font-semibold">Notes de Cœur</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">15-60 minutes</p>
                  <p className="leading-relaxed">{recette.notesCoeur}</p>
                </Card>
              )}
              {recette.notesFond && (
                <Card className="p-6 bg-gradient-to-br from-orange-500/10 to-amber-500/10 border-orange-500/20">
                  <div className="flex items-center gap-2 mb-3">
                    <Flame className="h-5 w-5 text-orange-600" />
                    <h3 className="text-lg font-semibold">Notes de Fond</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">60+ minutes</p>
                  <p className="leading-relaxed">{recette.notesFond}</p>
                </Card>
              )}
            </div>
          </div>
        )}

        {/* Ingrédients et Protocole */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {recette.ingredients && (
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Package className="h-5 w-5 text-primary" />
                <h3 className="text-xl font-semibold">Ingrédients</h3>
              </div>
              <p className="leading-relaxed whitespace-pre-wrap">{recette.ingredients}</p>
            </Card>
          )}
          {recette.protocol && (
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="h-5 w-5 text-primary" />
                <h3 className="text-xl font-semibold">Protocole</h3>
              </div>
              <p className="leading-relaxed whitespace-pre-wrap">{recette.protocol}</p>
            </Card>
          )}
        </div>

        {/* Notes */}
        {recette.notes && (
          <Card className="p-6 bg-muted/30">
            <h3 className="text-lg font-semibold mb-3">Notes</h3>
            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {recette.notes}
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
