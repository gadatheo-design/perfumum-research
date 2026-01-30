import { useState } from 'react';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { trpc } from '../lib/trpc';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Slider } from '../components/ui/slider';
import { Sparkles, TrendingUp, Beaker } from 'lucide-react';
import { Link } from 'wouter';

export default function SuggestionsSynergies() {
  const [minSimilarity, setMinSimilarity] = useState(70);
  const [limit, setLimit] = useState(10);
  
  const { data: suggestions, isLoading, refetch } = trpc.synergies.getSuggestions.useQuery({
    minSimilarity,
    limit
  });

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <p>Chargement des suggestions...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <Breadcrumbs />
      <div>
        <h1 className="text-3xl font-bold mb-2">Suggestions de Synergies Moléculaires</h1>
        <p className="text-muted-foreground">
          Découvrez des paires de molécules prometteuses basées sur la similarité de leurs profils radar
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Paramètres de Recherche
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Similarité Minimum</label>
              <span className="text-sm text-muted-foreground">{minSimilarity}%</span>
            </div>
            <Slider
              value={[minSimilarity]}
              onValueChange={(value) => setMinSimilarity(value[0])}
              min={50}
              max={95}
              step={5}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              Plus le seuil est élevé, plus les molécules suggérées seront similaires
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Nombre de Suggestions</label>
              <span className="text-sm text-muted-foreground">{limit}</span>
            </div>
            <Slider
              value={[limit]}
              onValueChange={(value) => setLimit(value[0])}
              min={5}
              max={30}
              step={5}
              className="w-full"
            />
          </div>

          <Button onClick={() => refetch()} className="w-full">
            <TrendingUp className="h-4 w-4 mr-2" />
            Actualiser les Suggestions
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            {suggestions?.length || 0} Suggestions Trouvées
          </h2>
          {suggestions && suggestions.length > 0 && (
            <p className="text-sm text-muted-foreground">
              Triées par similarité décroissante
            </p>
          )}
        </div>

        {suggestions && suggestions.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <Beaker className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">
                Aucune suggestion trouvée avec ces paramètres.
                <br />
                Essayez de réduire le seuil de similarité.
              </p>
            </CardContent>
          </Card>
        )}

        {suggestions?.map((suggestion, index) => (
          <Card key={`${suggestion.molecule1Id}-${suggestion.molecule2Id}`} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <span className="text-primary font-bold">#{index + 1}</span>
                    <Link href={`/molecule/${suggestion.molecule1Id}`} className="hover:underline">
                      {suggestion.molecule1Name}
                    </Link>
                    <span className="text-muted-foreground">+</span>
                    <Link href={`/molecule/${suggestion.molecule2Id}`} className="hover:underline">
                      {suggestion.molecule2Name}
                    </Link>
                  </CardTitle>
                  <CardDescription>{suggestion.explanation}</CardDescription>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">
                    {suggestion.similarity}%
                  </div>
                  <p className="text-xs text-muted-foreground">Similarité</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">{suggestion.molecule1Name}</h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-muted-foreground">Intensité:</span> {suggestion.radarProfile1.intensity}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Fraîcheur:</span> {suggestion.radarProfile1.freshness}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Chaleur:</span> {suggestion.radarProfile1.warmth}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Douceur:</span> {suggestion.radarProfile1.sweetness}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Épices:</span> {suggestion.radarProfile1.spiciness}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Terreux:</span> {suggestion.radarProfile1.earthiness}
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">{suggestion.molecule2Name}</h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-muted-foreground">Intensité:</span> {suggestion.radarProfile2.intensity}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Fraîcheur:</span> {suggestion.radarProfile2.freshness}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Chaleur:</span> {suggestion.radarProfile2.warmth}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Douceur:</span> {suggestion.radarProfile2.sweetness}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Épices:</span> {suggestion.radarProfile2.spiciness}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Terreux:</span> {suggestion.radarProfile2.earthiness}
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t">
                <p className="text-xs text-muted-foreground">
                  Distance euclidienne : {suggestion.distance} | 
                  Axes similaires identifiés automatiquement
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
