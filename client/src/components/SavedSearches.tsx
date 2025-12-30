import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useSavedSearches, type SavedSearch } from "@/hooks/useSavedSearches";
import { Bookmark, Trash2, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

interface SavedSearchesProps {
  onLoadSearch: (search: SavedSearch) => void;
}

export function SavedSearches({ onLoadSearch }: SavedSearchesProps) {
  const { searches, deleteSearch, clearSearches } = useSavedSearches();

  if (searches.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Bookmark className="h-4 w-4" />
            Recherches sauvegardées
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Aucune recherche sauvegardée. Utilisez le bouton "Sauvegarder cette recherche" pour enregistrer vos filtres favoris.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base flex items-center gap-2">
          <Bookmark className="h-4 w-4" />
          Recherches sauvegardées ({searches.length})
        </CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={clearSearches}
          className="text-destructive hover:text-destructive"
        >
          <Trash2 className="h-3.5 w-3.5 mr-1" />
          Tout effacer
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {searches.map((search) => (
            <div
              key={search.id}
              className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-sm truncate">{search.name}</h4>
                  <Badge variant="outline" className="text-xs">
                    {getFilterCount(search)} filtres
                  </Badge>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {formatDistanceToNow(search.timestamp, { addSuffix: true, locale: fr })}
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onLoadSearch(search)}
                >
                  Charger
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteSearch(search.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function getFilterCount(search: SavedSearch): number {
  let count = 0;
  const { filters } = search;

  if (filters.searchTerm) count++;
  if (filters.gamme) count++;
  if (filters.family) count++;
  if (filters.prototype) count++;
  if (filters.ingredient) count++;
  if (filters.radarFilters) {
    const radar = filters.radarFilters;
    if (radar.intensity && (radar.intensity[0] > 0 || radar.intensity[1] < 100)) count++;
    if (radar.freshness && (radar.freshness[0] > 0 || radar.freshness[1] < 100)) count++;
    if (radar.warmth && (radar.warmth[0] > 0 || radar.warmth[1] < 100)) count++;
    if (radar.sweetness && (radar.sweetness[0] > 0 || radar.sweetness[1] < 100)) count++;
    if (radar.spiciness && (radar.spiciness[0] > 0 || radar.spiciness[1] < 100)) count++;
    if (radar.earthiness && (radar.earthiness[0] > 0 || radar.earthiness[1] < 100)) count++;
  }

  return count;
}
