import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRecipeHistory } from "@/hooks/useRecipeHistory";
import { Clock, Trash2, ExternalLink } from "lucide-react";
import { Link } from "wouter";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

export function RecentlyViewed() {
  const { history, clearHistory, removeFromHistory } = useRecipeHistory();

  if (history.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Récemment consultées
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Aucune recette consultée récemment. Votre historique de navigation apparaîtra ici.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base flex items-center gap-2">
          <Clock className="h-4 w-4" />
          Récemment consultées ({history.length})
        </CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={clearHistory}
          className="text-destructive hover:text-destructive"
        >
          <Trash2 className="h-3.5 w-3.5 mr-1" />
          Effacer
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {history.slice(0, 10).map((item) => (
            <div
              key={`${item.id}-${item.timestamp}`}
              className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <Link href={`/recette/${item.id}`}>
                  <h4 className="font-medium text-sm hover:text-primary transition-colors cursor-pointer truncate">
                    {item.name}
                  </h4>
                </Link>
                <div className="flex items-center gap-2 mt-1">
                  {item.category && (
                    <Badge variant="outline" className="text-xs">
                      {item.category}
                    </Badge>
                  )}
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(item.timestamp, { addSuffix: true, locale: fr })}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Link href={`/recette/${item.id}`}>
                  <Button variant="ghost" size="sm">
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFromHistory(item.id)}
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
