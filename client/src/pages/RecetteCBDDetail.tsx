import { useParams, Link } from "wouter";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DynamicBreadcrumb } from "@/components/DynamicBreadcrumb";
import { ArrowLeft, Beaker, Droplets, Flame, Clock, DollarSign, Activity } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { TimelineAromatic } from "@/components/TimelineAromatic";
import { NotesEditor } from "@/components/NotesEditor";

export default function RecetteCBDDetail() {
  const params = useParams();
  const recetteId = params.id ? parseInt(params.id) : undefined;

  const { data, isLoading, error } = trpc.recettes.getById.useQuery(
    recetteId!,
    { enabled: !!recetteId }
  );

  const { data: molecules, isLoading: moleculesLoading } = trpc.recettes.getMolecules.useQuery(
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
        <DynamicBreadcrumb />

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

            {/* Timeline Aromatique */}
            {(recette.notesTete || recette.notesCoeur || recette.notesFond) && (
              <div className="pt-6 border-t">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Évolution Aromatique
                </h3>
                <TimelineAromatic
                  data={{
                    notesTete: recette.notesTete || undefined,
                    notesCoeur: recette.notesCoeur || undefined,
                    notesFond: recette.notesFond || undefined,
                    dureeTeteMin: recette.dureeTeteMin || undefined,
                    dureeCoeurMin: recette.dureeCoeurMin || undefined,
                    dureeFondMin: recette.dureeFondMin || undefined,
                  }}
                  height={350}
                />
                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                  {recette.notesTete && (
                    <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                        <span className="font-semibold text-sm">Notes de tête</span>
                        <span className="text-xs text-muted-foreground ml-auto">
                          0-{recette.dureeTeteMin || 15}min
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{recette.notesTete}</p>
                    </div>
                  )}
                  {recette.notesCoeur && (
                    <div className="p-3 bg-violet-500/10 rounded-lg border border-violet-500/20">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-3 h-3 rounded-full bg-violet-500"></div>
                        <span className="font-semibold text-sm">Notes de cœur</span>
                        <span className="text-xs text-muted-foreground ml-auto">
                          {recette.dureeTeteMin || 15}-{(recette.dureeTeteMin || 15) + (recette.dureeCoeurMin || 45)}min
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{recette.notesCoeur}</p>
                    </div>
                  )}
                  {recette.notesFond && (
                    <div className="p-3 bg-orange-500/10 rounded-lg border border-orange-500/20">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                        <span className="font-semibold text-sm">Notes de fond</span>
                        <span className="text-xs text-muted-foreground ml-auto">
                          {(recette.dureeTeteMin || 15) + (recette.dureeCoeurMin || 45)}min+
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{recette.notesFond}</p>
                    </div>
                  )}
                </div>
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

        {/* Composition moléculaire */}
        {molecules && molecules.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Composition Moléculaire</CardTitle>
            </CardHeader>
            <CardContent>
              {moleculesLoading ? (
                <div className="text-muted-foreground">Chargement des molécules...</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {molecules.map((item: any) => (
                    <Link key={item.molecule.id} href={`/terpene/${item.molecule.id}`}>
                      <Card className="hover:border-primary transition-colors cursor-pointer">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-semibold">{item.molecule.name}</h4>
                            <Badge variant="outline">{item.proportion}%</Badge>
                          </div>
                          <div className="text-sm text-muted-foreground mb-2">
                            Rôle : <span className="font-medium">
                              {item.role === 'base' ? 'Base' : item.role === 'accent' ? 'Accent' : 'Fixatif'}
                            </span>
                          </div>
                          {item.molecule.formula && (
                            <div className="text-xs font-mono text-muted-foreground">
                              {item.molecule.formula}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Notes personnelles */}
        <div className="mb-8">
          <NotesEditor
            entityType="recette"
            entityId={recetteId!}
            title="Notes de dégustation & observations"
            placeholder="Notez vos impressions : combustion, arômes, effets, temps de maturation optimal, idées d'amélioration..."
          />
        </div>

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
