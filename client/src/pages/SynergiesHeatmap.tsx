import { trpc } from "@/lib/trpc";
import { MolecularSynergiesHeatmap } from "@/components/charts/MolecularSynergiesHeatmap";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";

export function SynergiesHeatmap() {
  const { data: synergies, isLoading, error } = trpc.synergies.getAllMoleculeSynergies.useQuery();

  if (isLoading) {
    return (
      <div className="container py-8">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-96 mt-2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[600px] w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-8">
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              Erreur de chargement
            </CardTitle>
            <CardDescription>
              Impossible de charger les synergies moléculaires
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{error.message}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">Heatmap des Synergies Moléculaires</CardTitle>
          <CardDescription>
            Matrice interactive visualisant les interactions entre molécules olfactives. 
            Survolez les cellules colorées pour voir les détails des synergies.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {synergies && synergies.length > 0 ? (
            <MolecularSynergiesHeatmap synergies={synergies} maxMolecules={25} />
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                Aucune synergie moléculaire enregistrée pour le moment.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Informations complémentaires */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-xl">À propos des synergies moléculaires</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-sm max-w-none dark:prose-invert">
          <p>
            Les synergies moléculaires représentent les interactions complexes entre différentes 
            molécules olfactives. Ces interactions peuvent modifier significativement le profil 
            olfactif final d'une composition.
          </p>
          
          <h4 className="font-semibold mt-4">Types de synergies :</h4>
          <ul className="space-y-2">
            <li>
              <strong>Potentialisation (P)</strong> : Une molécule amplifie l'intensité ou la 
              perception d'une autre molécule.
            </li>
            <li>
              <strong>Stabilisation (S)</strong> : Une molécule aide à fixer ou prolonger la 
              présence d'une autre molécule volatile.
            </li>
            <li>
              <strong>Transformation (T)</strong> : L'association de deux molécules crée une 
              nouvelle perception olfactive distincte.
            </li>
            <li>
              <strong>Masquage (M)</strong> : Une molécule atténue ou cache certaines facettes 
              d'une autre molécule.
            </li>
          </ul>

          <p className="mt-4">
            Cette heatmap permet d'identifier rapidement les paires de molécules présentant 
            des interactions documentées, facilitant ainsi la formulation de compositions 
            olfactives harmonieuses et équilibrées.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
