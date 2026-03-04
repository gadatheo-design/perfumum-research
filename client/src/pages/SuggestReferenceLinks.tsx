// @ts-nocheck
import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, CheckCircle, AlertCircle, Zap, TrendingUp } from 'lucide-react';

type EntityType = 'molecule' | 'recette' | 'plant' | 'prototype' | 'tradition' | 'terroir' | 'supplier' | 'leaf_economy';

interface Suggestion {
  referenceId: number;
  entityType: string;
  entityId: number;
  entityName: string;
  score: number;
  matchedKeywords: string[];
}

export default function SuggestReferenceLinks() {
  const [minScore, setMinScore] = useState(60);
  const [selectedEntityType, setSelectedEntityType] = useState<string>('all');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [selectedSuggestions, setSelectedSuggestions] = useState<Set<number>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [applyResult, setApplyResult] = useState<any>(null);
  const [showResultDialog, setShowResultDialog] = useState(false);

  const suggestMutation = trpc.referenceEntityLinks.suggestLinks.useMutation();
  const applyMutation = trpc.referenceEntityLinks.applySuggestions.useMutation();

  const handleSuggest = async () => {
    setIsLoading(true);
    try {
      const result = await suggestMutation.mutateAsync({
        entityType: selectedEntityType === 'all' ? undefined : (selectedEntityType as EntityType),
        minScore,
        limit: 100,
      });
      setSuggestions(result);
      setSelectedSuggestions(new Set());
    } catch (error) {
      console.error('Error suggesting links:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectAll = () => {
    if (selectedSuggestions.size === suggestions.length) {
      setSelectedSuggestions(new Set());
    } else {
      setSelectedSuggestions(new Set(suggestions.map((_, idx) => idx)));
    }
  };

  const handleToggleSuggestion = (idx: number) => {
    const newSet = new Set(selectedSuggestions);
    if (newSet.has(idx)) {
      newSet.delete(idx);
    } else {
      newSet.add(idx);
    }
    setSelectedSuggestions(newSet);
  };

  const handleApply = async () => {
    const toApply = Array.from(selectedSuggestions).map(idx => ({
      referenceId: suggestions[idx].referenceId,
      entityType: suggestions[idx].entityType as EntityType,
      entityId: suggestions[idx].entityId,
      score: suggestions[idx].score,
    }));

    try {
      const result = await applyMutation.mutateAsync(toApply);
      setApplyResult(result);
      setShowResultDialog(true);
      setSuggestions([]);
      setSelectedSuggestions(new Set());
    } catch (error) {
      console.error('Error applying suggestions:', error);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-800';
    if (score >= 60) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        <Breadcrumbs
          items={[
            { label: 'Accueil', href: '/' },
            { label: 'Références', href: '/references-v3' },
            { label: 'Suggestions automatiques' }
          ]}
        />

        <div className="mt-8 space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Suggestions automatiques de liaisons</h1>
            <p className="text-muted-foreground mt-2">
              Découvrez automatiquement les liaisons potentielles basées sur les mots-clés
            </p>
          </div>

          {/* Configuration Panel */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Configuration
              </CardTitle>
              <CardDescription>
                Ajustez les paramètres de suggestion
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Type d'entité</label>
                <Select value={selectedEntityType} onValueChange={setSelectedEntityType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les types</SelectItem>
                    <SelectItem value="molecule">Molécules</SelectItem>
                    <SelectItem value="plant">Plantes</SelectItem>
                    <SelectItem value="recette">Recettes</SelectItem>
                    <SelectItem value="prototype">Prototypes</SelectItem>
                    <SelectItem value="tradition">Traditions</SelectItem>
                    <SelectItem value="terroir">Terroirs</SelectItem>
                    <SelectItem value="supplier">Fournisseurs</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Score minimum: {minScore}%</label>
                <Slider
                  value={[minScore]}
                  onValueChange={(value) => setMinScore(value[0])}
                  min={0}
                  max={100}
                  step={5}
                  className="w-full"
                />
              </div>

              <Button onClick={handleSuggest} disabled={isLoading} size="lg" className="w-full">
                {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Générer des suggestions
              </Button>
            </CardContent>
          </Card>

          {/* Suggestions List */}
          {suggestions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    {suggestions.length} suggestion(s) trouvée(s)
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSelectAll}
                  >
                    {selectedSuggestions.size === suggestions.length ? 'Désélectionner tout' : 'Sélectionner tout'}
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 max-h-96 overflow-y-auto">
                {suggestions.map((suggestion, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <Checkbox
                      checked={selectedSuggestions.has(idx)}
                      onCheckedChange={() => handleToggleSuggestion(idx)}
                      className="mt-1"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-sm">
                          Ref {suggestion.referenceId} → {suggestion.entityType} {suggestion.entityId}
                        </span>
                        <Badge className={getScoreColor(suggestion.score)}>
                          {suggestion.score}%
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {suggestion.entityName}
                      </div>
                      {suggestion.matchedKeywords.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {suggestion.matchedKeywords.map((keyword, kidx) => (
                            <Badge key={kidx} variant="secondary" className="text-xs">
                              {keyword}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Apply Button */}
          {suggestions.length > 0 && selectedSuggestions.size > 0 && (
            <Button
              onClick={handleApply}
              size="lg"
              className="w-full"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Appliquer {selectedSuggestions.size} suggestion(s)
            </Button>
          )}

          {/* Empty State */}
          {suggestions.length === 0 && !isLoading && (
            <Card className="border-dashed">
              <CardContent className="py-12 text-center">
                <Zap className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-semibold mb-2">Aucune suggestion</h3>
                <p className="text-sm text-muted-foreground">
                  Cliquez sur "Générer des suggestions" pour commencer
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Result Dialog */}
      <Dialog open={showResultDialog} onOpenChange={setShowResultDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {applyResult?.success ? (
                <>
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  Suggestions appliquées
                </>
              ) : (
                <>
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  Résultat partiel
                </>
              )}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">
                {applyResult?.created} liaison(s) créée(s) avec succès
              </p>
            </div>
            {applyResult?.errors && applyResult.errors.length > 0 && (
              <div className="bg-red-50 p-4 rounded-lg">
                <h3 className="font-semibold text-sm text-red-900 mb-2">
                  {applyResult.errors.length} erreur(s)
                </h3>
                <div className="space-y-1 max-h-48 overflow-y-auto">
                  {applyResult.errors.slice(0, 5).map((error: any, idx: number) => (
                    <div key={idx} className="text-xs text-red-800">
                      {error.error}
                    </div>
                  ))}
                </div>
              </div>
            )}
            <Button onClick={() => setShowResultDialog(false)} className="w-full">
              Fermer
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
