// @ts-nocheck
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Skeleton loader pour RecetteDetail
 * 
 * Affiche un placeholder animé pendant le chargement d'une recette
 * Reproduit la structure visuelle de la page de détail
 */
export function RecetteDetailSkeleton() {
  return (
    <div className="container py-8 space-y-6">
      {/* Header avec boutons */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-10 w-32" />
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-8 w-24 rounded-full" />
        </div>
      </div>

      {/* Main Info Card */}
      <Card className="shadow-sm">
        <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5">
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-8 rounded" />
            <Skeleton className="h-8 w-64" />
          </div>
          <Skeleton className="h-6 w-32 mt-2 rounded-full" />
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          {/* Description */}
          <div className="bg-muted/50 p-4 rounded-lg space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/6" />
          </div>

          {/* Propriétés */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-card p-4 rounded-lg border space-y-2">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-6 w-full rounded-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Profil Radar */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full rounded-lg" />
        </CardContent>
      </Card>

      {/* Molécules */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full rounded-md" />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
