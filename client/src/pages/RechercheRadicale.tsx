// @ts-nocheck
import { safeJsonParse } from "@/lib/utils";
import { trpc } from '@/lib/trpc';
import { AlertTriangle, Beaker, Sparkles } from 'lucide-react';

export default function RechercheRadicale() {
  const { data: accords, isLoading } = trpc.rechercheRadicale.list.useQuery();

  if (isLoading) {
    return (
      <div className="container py-12">
        <div className="animate-pulse space-y-8">
          <div className="h-32 bg-muted rounded-lg" />
          <div className="h-64 bg-muted rounded-lg" />
        </div>
      </div>
    );
  }

  if (!accords || accords.length === 0) {
    return (
      <div className="container py-12">
        <div className="text-center text-muted-foreground">
          Aucun accord radical trouvé
        </div>
      </div>
    );
  }

  // Parse themes conceptuels from first accord
  const themesConceptuels = accords[0]?.themesConceptuels 
    ? safeJsonParse(accords[0].themesConceptuels, []) 
    : [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background/95 to-muted/20">
      {/* Header avec avertissement */}
      <div className="border-b border-destructive/20 bg-destructive/5">
        <div className="container py-12">
          <div className="flex items-start gap-4 mb-6">
            <div className="p-3 bg-destructive/10 rounded-lg">
              <AlertTriangle className="w-8 h-8 text-destructive" />
            </div>
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-2 text-foreground">
                Recherche Radicale
              </h1>
              <p className="text-lg text-muted-foreground">
                {accords[0]?.serie}
              </p>
            </div>
          </div>

          <div className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-destructive mb-2">
                  Avertissement — Œuvres Olfactives Uniquement
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {accords[0]?.avertissement}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Liste des accords */}
      <div className="container py-12">
        <div className="grid gap-8 max-w-5xl mx-auto">
          {accords.map((accord) => {
            const architecture = safeJsonParse(accord.architecture, null);
            
            return (
              <div
                key={accord.id}
                className="group bg-card border border-border rounded-xl overflow-hidden hover:border-primary/50 transition-all duration-300 hover:shadow-lg"
              >
                {/* En-tête de l'accord */}
                <div className="bg-gradient-to-r from-muted/50 to-muted/20 p-6 border-b border-border">
                  <div className="flex items-start gap-4">
                    <div className="text-5xl" aria-label={`Symbole ${accord.nom}`}>
                      {accord.symbole}
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold mb-2 text-foreground group-hover:text-primary transition-colors">
                        {accord.nom}
                      </h2>
                      <p className="text-muted-foreground italic">
                        {accord.concept}
                      </p>
                      {accord.noteSpeciale && (
                        <div className="mt-3 flex items-start gap-2 text-sm">
                          <Sparkles className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                          <p className="text-amber-600 dark:text-amber-400">
                            {accord.noteSpeciale}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Contenu de l'accord */}
                <div className="p-6 space-y-6">
                  {/* Architecture */}
                  <div>
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3 flex items-center gap-2">
                      <Beaker className="w-4 h-4" />
                      Architecture
                    </h3>
                    <div className="space-y-2">
                      {architecture.map((ingredient: any, idx: number) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between py-2 px-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex-1">
                            <span className="font-medium text-foreground">
                              {ingredient.ingredient}
                            </span>
                            {ingredient.note && (
                              <span className="text-sm text-muted-foreground ml-2">
                                — {ingredient.note}
                              </span>
                            )}
                          </div>
                          <span className="text-sm font-mono text-primary font-semibold">
                            {safeToFixed(ingredient.concentration * 100, 1)}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Effet */}
                  <div>
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                      Effet
                    </h3>
                    <p className="text-foreground leading-relaxed">
                      {accord.effet}
                    </p>
                  </div>

                  {/* Usage artistique */}
                  <div>
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                      Usage Artistique
                    </h3>
                    <p className="text-foreground leading-relaxed">
                      {accord.usageArtistique}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Thèmes conceptuels */}
        {themesConceptuels.length > 0 && (
          <div className="mt-12 max-w-5xl mx-auto">
            <div className="bg-card border border-border rounded-xl p-6">
              <h2 className="text-xl font-bold mb-4 text-foreground">
                Thèmes Conceptuels
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {themesConceptuels.map((theme: string, idx: number) => (
                  <div
                    key={idx}
                    className="text-sm text-muted-foreground bg-muted/30 rounded-lg px-3 py-2 text-center hover:bg-muted/50 transition-colors"
                  >
                    {theme}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
