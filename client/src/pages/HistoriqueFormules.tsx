import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Trash2, FileText, Calendar, TrendingUp } from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";

export default function HistoriqueFormules() {
  const { toast } = useToast();
  const { data: formulas, isLoading, refetch } = trpc.formulas.getHistory.useQuery();
  const deleteFormula = trpc.formulas.delete.useMutation({
    onSuccess: () => {
      toast({ title: "✅ Formule supprimée", variant: "default" });
      refetch();
    },
    onError: (error) => {
      toast({ title: "❌ Erreur", description: error.message, variant: "destructive" });
    }
  });

  const [selectedFormulas, setSelectedFormulas] = useState<number[]>([]);

  const toggleSelection = (id: number) => {
    setSelectedFormulas(prev => 
      prev.includes(id) ? prev.filter(fid => fid !== id) : [...prev, id]
    );
  };

  const getRadarAverage = (formula: any) => {
    const profile = formula.radarProfile;
    const avg = (
      profile.intensity +
      profile.freshness +
      profile.warmth +
      profile.sweetness +
      profile.spiciness +
      profile.earthiness
    ) / 6;
    return Math.round(avg);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container py-8 space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">Historique des Formules</h1>
        <p className="text-muted-foreground">
          Retrouvez toutes les formules que vous avez générées et sauvegardées
        </p>
      </div>

      {/* Statistiques */}
      {formulas && formulas.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-3xl font-bold text-primary">
                {formulas.length}
              </CardTitle>
              <CardDescription>Formules sauvegardées</CardDescription>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-3xl font-bold text-primary">
                {Math.round(formulas.reduce((sum, f) => sum + f.suggestions.length, 0) / formulas.length)}
              </CardTitle>
              <CardDescription>Molécules moyennes / formule</CardDescription>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-3xl font-bold text-primary">
                {selectedFormulas.length}
              </CardTitle>
              <CardDescription>Formules sélectionnées</CardDescription>
            </CardHeader>
          </Card>
        </div>
      )}

      {/* Comparaison */}
      {selectedFormulas.length >= 2 && (
        <Card className="border-primary">
          <CardHeader>
            <CardTitle>Comparaison des formules sélectionnées</CardTitle>
            <CardDescription>
              Analysez l'évolution de vos profils radar au fil du temps
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {selectedFormulas.map(id => {
                const formula = formulas?.find(f => f.id === id);
                if (!formula) return null;
                
                return (
                  <div key={id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">
                          {new Date(formula.createdAt).toLocaleDateString("fr-FR")}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">
                          Moyenne: {getRadarAverage(formula)}/100
                        </span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-6 gap-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Intensité:</span>
                        <span className="ml-1 font-medium">{formula.radarProfile.intensity}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Fraîcheur:</span>
                        <span className="ml-1 font-medium">{formula.radarProfile.freshness}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Chaleur:</span>
                        <span className="ml-1 font-medium">{formula.radarProfile.warmth}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Douceur:</span>
                        <span className="ml-1 font-medium">{formula.radarProfile.sweetness}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Épicé:</span>
                        <span className="ml-1 font-medium">{formula.radarProfile.spiciness}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Terreux:</span>
                        <span className="ml-1 font-medium">{formula.radarProfile.earthiness}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Liste des formules */}
      <div className="space-y-4">
        {!formulas || formulas.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground mb-4">
                Aucune formule sauvegardée pour le moment
              </p>
              <Link href="/outils/generateur-formules">
                <Button>Générer une formule</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          formulas.map(formula => (
            <Card key={formula.id} className={selectedFormulas.includes(formula.id) ? "border-primary" : ""}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <input
                        type="checkbox"
                        checked={selectedFormulas.includes(formula.id)}
                        onChange={() => toggleSelection(formula.id)}
                        className="h-5 w-5 rounded border-gray-300"
                      />
                      <div>
                        <CardTitle className="text-xl">
                          Formule du {new Date(formula.createdAt).toLocaleDateString("fr-FR")}
                        </CardTitle>
                        <CardDescription>
                          {formula.suggestions.length} molécules suggérées
                        </CardDescription>
                      </div>
                    </div>
                    
                    {formula.notes && (
                      <p className="text-sm text-muted-foreground mt-2 italic">
                        "{formula.notes}"
                      </p>
                    )}
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteFormula.mutate(formula.id)}
                    disabled={deleteFormula.isPending}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent>
                {/* Profil radar */}
                <div className="mb-4 p-4 bg-muted/30 rounded-lg">
                  <h4 className="font-semibold mb-3 text-sm">Profil Radar</h4>
                  <div className="grid grid-cols-2 md:grid-cols-6 gap-3 text-sm">
                    <div>
                      <div className="text-muted-foreground mb-1">Intensité</div>
                      <div className="font-mono font-bold text-primary">{formula.radarProfile.intensity}/100</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground mb-1">Fraîcheur</div>
                      <div className="font-mono font-bold text-primary">{formula.radarProfile.freshness}/100</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground mb-1">Chaleur</div>
                      <div className="font-mono font-bold text-primary">{formula.radarProfile.warmth}/100</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground mb-1">Douceur</div>
                      <div className="font-mono font-bold text-primary">{formula.radarProfile.sweetness}/100</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground mb-1">Épicé</div>
                      <div className="font-mono font-bold text-primary">{formula.radarProfile.spiciness}/100</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground mb-1">Terreux</div>
                      <div className="font-mono font-bold text-primary">{formula.radarProfile.earthiness}/100</div>
                    </div>
                  </div>
                </div>
                
                {/* Top 5 molécules */}
                <div>
                  <h4 className="font-semibold mb-3 text-sm">Top 5 Molécules</h4>
                  <div className="space-y-2">
                    {formula.suggestions.slice(0, 5).map((molecule, idx) => (
                      <Link key={molecule.id} href={`/molecules/${molecule.id}`}>
                        <div className="flex items-center justify-between p-2 hover:bg-muted/30 rounded transition-colors">
                          <div className="flex items-center gap-3">
                            <span className="text-lg font-bold text-primary">#{idx + 1}</span>
                            <span className="font-medium">{molecule.name}</span>
                          </div>
                          <span className="text-sm font-mono text-muted-foreground">
                            {molecule.compatibilityScore}%
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
