import { useParams, Link } from "wouter";
import { Header } from "@/components/layout/Header";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DynamicBreadcrumb } from "@/components/DynamicBreadcrumb";
import { ArrowLeft, Beaker, Droplets, Flame, Clock, DollarSign, Activity } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { TimelineAromatic } from "@/components/TimelineAromatic";
import { RecipeOlfactiveProfile } from "@/components/RecipeRadarChart";
import { NotesEditor } from "@/components/NotesEditor";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

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
        <Breadcrumbs />
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
        <Breadcrumbs 
          customItems={[
            { label: "Résines CBD", path: "/resines-cbd" },
            { label: recette.name }
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

        {/* Profil Olfactif Radar */}
        {molecules && molecules.length > 0 && (
          <RecipeOlfactiveProfile 
            molecules={molecules.map((item: any) => ({
              id: item.molecule.id,
              name: item.molecule.name,
              chemicalFormula: item.molecule.chemicalFormula,
              radarIntensity: item.molecule.radarIntensity,
              radarFreshness: item.molecule.radarFreshness,
              radarWarmth: item.molecule.radarWarmth,
              radarSweetness: item.molecule.radarSweetness,
              radarSpiciness: item.molecule.radarSpiciness,
              radarEarthiness: item.molecule.radarEarthiness,
              proportion: parseFloat(item.proportion) || 1,
            }))}
            recipeName={recette.name}
            color="#10b981"
          />
        )}

        {/* Composition moléculaire */}
        {molecules && molecules.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Composition Terpénique</CardTitle>
            </CardHeader>
            <CardContent>
              {moleculesLoading ? (
                <div className="text-muted-foreground">Chargement des terpènes...</div>
              ) : (
                <div className="grid lg:grid-cols-2 gap-6">
                  {/* Tableau détaillé */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Détails par Terpène</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-2 px-3">Terpène</th>
                            <th className="text-right py-2 px-3">%</th>
                            <th className="text-right py-2 px-3">g/100g</th>
                            <th className="text-left py-2 px-3">Rôle</th>
                          </tr>
                        </thead>
                        <tbody>
                          {molecules.map((item: any) => {
                            const proportion = parseFloat(item.proportion) || 0;
                            const gramsFor100g = (proportion).toFixed(2);
                            return (
                              <tr key={item.molecule.id} className="border-b hover:bg-accent/50">
                                <td className="py-3 px-3">
                                  <Link href={`/terpene/${item.molecule.id}`} className="hover:text-primary font-medium">
                                    {item.molecule.name}
                                  </Link>
                                </td>
                                <td className="text-right py-3 px-3 font-semibold">{proportion.toFixed(1)}%</td>
                                <td className="text-right py-3 px-3 text-muted-foreground">{gramsFor100g}g</td>
                                <td className="py-3 px-3">
                                  <Badge variant="outline" className="text-xs">
                                    {item.role === 'base' ? 'Base' : item.role === 'accent' ? 'Accent' : 'Fixatif'}
                                  </Badge>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                        <tfoot>
                          <tr className="font-semibold">
                            <td className="py-3 px-3">Total</td>
                            <td className="text-right py-3 px-3">
                              {molecules.reduce((sum: number, item: any) => sum + (parseFloat(item.proportion) || 0), 0).toFixed(1)}%
                            </td>
                            <td className="text-right py-3 px-3">
                              {molecules.reduce((sum: number, item: any) => sum + (parseFloat(item.proportion) || 0), 0).toFixed(2)}g
                            </td>
                            <td></td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>

                    {/* Propriétés thérapeutiques */}
                    <div className="mt-4 space-y-2">
                      <h4 className="font-semibold">Propriétés Thérapeutiques</h4>
                      <div className="grid grid-cols-1 gap-2">
                        {molecules.map((item: any) => (
                          <div key={item.molecule.id} className="text-sm">
                            <span className="font-medium">{item.molecule.name}:</span>{" "}
                            <span className="text-muted-foreground">
                              {item.molecule.therapeuticProperties || "Propriétés non documentées"}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Pie Chart */}
                  <div className="flex flex-col items-center justify-center">
                    <h3 className="font-semibold text-lg mb-4">Répartition</h3>
                    <div className="w-full max-w-[300px]">
                      <Pie
                        data={{
                          labels: molecules.map((item: any) => item.molecule.name),
                          datasets: [
                            {
                              data: molecules.map((item: any) => parseFloat(item.proportion) || 0),
                              backgroundColor: [
                                "rgba(139, 92, 246, 0.6)",
                                "rgba(16, 185, 129, 0.6)",
                                "rgba(251, 146, 60, 0.6)",
                                "rgba(59, 130, 246, 0.6)",
                                "rgba(236, 72, 153, 0.6)",
                                "rgba(234, 179, 8, 0.6)",
                                "rgba(239, 68, 68, 0.6)",
                              ],
                              borderColor: [
                                "rgba(139, 92, 246, 1)",
                                "rgba(16, 185, 129, 1)",
                                "rgba(251, 146, 60, 1)",
                                "rgba(59, 130, 246, 1)",
                                "rgba(236, 72, 153, 1)",
                                "rgba(234, 179, 8, 1)",
                                "rgba(239, 68, 68, 1)",
                              ],
                              borderWidth: 2,
                            },
                          ],
                        }}
                        options={{
                          responsive: true,
                          plugins: {
                            legend: {
                              position: "bottom",
                              labels: {
                                padding: 15,
                                font: {
                                  size: 12,
                                },
                              },
                            },
                            tooltip: {
                              callbacks: {
                                label: (context) => {
                                  const label = context.label || "";
                                  const value = context.parsed || 0;
                                  return `${label}: ${value.toFixed(1)}%`;
                                },
                              },
                            },
                          },
                        }}
                      />
                    </div>
                  </div>
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
