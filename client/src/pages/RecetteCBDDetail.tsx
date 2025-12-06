import { useParams, Link } from "wouter";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { ArrowLeft, Beaker, Droplets, Flame, Clock, DollarSign } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function RecetteCBDDetail() {
  const params = useParams();
  const recetteId = params.id ? parseInt(params.id) : undefined;

  const { data, isLoading, error } = trpc.recettes.getById.useQuery(
    recetteId!,
    { enabled: !!recetteId }
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto py-8">
          <div className="text-center text-muted-foreground">Chargement...</div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto py-8">
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-600">Recette non trouvée</p>
              <Link href="/resines-cbd">
                <Button variant="outline" className="mt-4">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Retour aux Résines CBD
                </Button>
              </Link>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  const recette = data;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto py-8 space-y-6">
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: "Résines CBD", href: "/resines-cbd" },
            { label: recette.name },
          ]}
        />

        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/resines-cbd">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour
            </Button>
          </Link>
          <Badge variant="secondary" className="text-lg px-4 py-2">
            <Beaker className="mr-2 h-5 w-5" />
            Résine CBD
          </Badge>
        </div>

        {/* Main Info */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-3xl mb-2">{recette.name}</CardTitle>
                {recette.description && (
                  <p className="text-muted-foreground">{recette.description}</p>
                )}
              </div>
              <div className="flex gap-2">
                {recette.intensity && (
                  <Badge variant="outline">
                    <Flame className="mr-1 h-3 w-3" />
                    Intensité {recette.intensity}/10
                  </Badge>
                )}
                {recette.stability && (
                  <Badge variant="outline">
                    Stabilité {recette.stability === 'high' ? 'Haute' : recette.stability === 'medium' ? 'Moyenne' : 'Faible'}
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Texture */}
            {recette.texture && (
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Droplets className="h-4 w-4" />
                  Texture
                </h3>
                <p className="text-muted-foreground">{recette.texture}</p>
              </div>
            )}

            {/* Ingredients */}
            {recette.ingredients && (
              <div>
                <h3 className="font-semibold mb-2">Ingrédients</h3>
                <p className="text-muted-foreground whitespace-pre-wrap">{recette.ingredients}</p>
              </div>
            )}

            {/* Formula */}
            {recette.formula && (
              <div>
                <h3 className="font-semibold mb-2">Formule & Proportions</h3>
                <div className="bg-muted/30 p-4 rounded-md">
                  <pre className="text-sm whitespace-pre-wrap font-mono">{recette.formula}</pre>
                </div>
              </div>
            )}

            {/* Protocol */}
            {recette.protocol && (
              <div>
                <h3 className="font-semibold mb-2">Protocole de Fabrication</h3>
                <p className="text-muted-foreground whitespace-pre-wrap">{recette.protocol}</p>
              </div>
            )}

            {/* Technical Details */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
              {recette.maturationTime && (
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Maturation</div>
                  <div className="font-semibold flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {recette.maturationTime} jours
                  </div>
                </div>
              )}
              {recette.productionTime && (
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Production</div>
                  <div className="font-semibold flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {recette.productionTime} min
                  </div>
                </div>
              )}
              {recette.combustionTemperature && (
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Combustion</div>
                  <div className="font-semibold flex items-center gap-1">
                    <Flame className="h-4 w-4" />
                    {recette.combustionTemperature}°C
                  </div>
                </div>
              )}
              {recette.costEstimate && (
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Coût estimé</div>
                  <div className="font-semibold flex items-center gap-1">
                    <DollarSign className="h-4 w-4" />
                    {(recette.costEstimate / 100).toFixed(2)} CHF
                  </div>
                </div>
              )}
            </div>

            {/* Notes */}
            {recette.notes && (
              <div className="pt-4 border-t">
                <h3 className="font-semibold mb-2">Notes</h3>
                <p className="text-muted-foreground whitespace-pre-wrap">{recette.notes}</p>
              </div>
            )}

            {/* Status */}
            {recette.status && (
              <div className="pt-4 border-t">
                <Badge variant={recette.status === 'production' ? 'default' : 'secondary'}>
                  Statut : {recette.status === 'experimental' ? 'Expérimental' : recette.status === 'testing' ? 'En test' : recette.status === 'validated' ? 'Validé' : 'Production'}
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Procédé Technique */}
        <Card>
          <CardHeader>
            <CardTitle>Procédé Technique</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Extraction Éthanol → MCT</h4>
              <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                <li>Extraction des cannabinoïdes et terpènes à l'éthanol 96%</li>
                <li>Filtration et évaporation sous vide (40°C max)</li>
                <li>Dissolution de l'extrait dans MCT (Medium Chain Triglycerides)</li>
                <li>Ajout de terpènes naturels pour profil olfactif ciblé</li>
                <li>Maturation 7-14 jours pour stabilisation moléculaire</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
