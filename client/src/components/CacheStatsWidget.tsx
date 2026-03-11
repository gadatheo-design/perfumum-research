import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { trpc } from "@/lib/trpc";
import { Database, Trash2, RefreshCw, TrendingUp, HardDrive, Zap } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

/**
 * Widget de statistiques du cache pour le dashboard admin
 * Affiche les métriques de performance et permet de vider le cache
 */
export function CacheStatsWidget() {
  const [isClearing, setIsClearing] = useState(false);
  
  const { data: stats, isLoading, refetch } = trpc.system.cacheStats.useQuery(undefined, {
    refetchInterval: 30000, // Rafraîchir toutes les 30 secondes
  });
  
  const clearCache = trpc.system.clearCache.useMutation({
    onMutate: () => {
      setIsClearing(true);
    },
    onSuccess: () => {
      toast.success("Cache vidé avec succès");
      refetch();
    },
    onError: (error) => {
      toast.error(`Erreur: ${error.message}`);
    },
    onSettled: () => {
      setIsClearing(false);
    },
  });

  if (isLoading) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Cache Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-32 bg-muted rounded" />
        </CardContent>
      </Card>
    );
  }

  if (!stats) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Cache Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            Statistiques non disponibles
          </p>
        </CardContent>
      </Card>
    );
  }

  const hitRateValue = parseFloat(stats.hitRate.replace('%', ''));
  const usagePercentage = (stats.size / stats.maxSize) * 100;
  
  // Déterminer la couleur du hit rate
  const getHitRateColor = (rate: number) => {
    if (rate >= 80) return "text-green-500";
    if (rate >= 50) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Database className="h-5 w-5 text-primary" />
            Cache Performance
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => refetch()}
              className="h-8 w-8 p-0"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => clearCache.mutate()}
              disabled={isClearing}
              className="h-8"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Vider
            </Button>
          </div>
        </div>
        <CardDescription>
          Dernière mise à jour: {new Date(stats.timestamp).toLocaleTimeString()}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Hit Rate - Métrique principale */}
        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-full">
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">Taux de succès</p>
              <p className="text-xs text-muted-foreground">
                {stats.hits} hits / {stats.misses} misses
              </p>
            </div>
          </div>
          <div className={`text-2xl font-bold ${getHitRateColor(hitRateValue)}`}>
            {stats.hitRate}
          </div>
        </div>

        {/* Utilisation du cache */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <HardDrive className="h-4 w-4 text-muted-foreground" />
              <span>Utilisation</span>
            </div>
            <span className="font-medium">
              {stats.size} / {stats.maxSize} entrées
            </span>
          </div>
          <Progress value={usagePercentage} className="h-2" />
        </div>

        {/* Statistiques détaillées */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-green-500/10 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Zap className="h-4 w-4 text-green-500" />
              <span className="text-xs text-muted-foreground">Cache Hits</span>
            </div>
            <p className="text-xl font-bold text-green-500">{stats.hits}</p>
          </div>
          <div className="p-3 bg-red-500/10 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Database className="h-4 w-4 text-red-500" />
              <span className="text-xs text-muted-foreground">Cache Misses</span>
            </div>
            <p className="text-xl font-bold text-red-500">{stats.misses}</p>
          </div>
        </div>

        {/* Badge de statut */}
        <div className="flex items-center justify-center pt-2">
          <Badge 
            variant={hitRateValue >= 50 ? "default" : "destructive"}
            className="text-xs"
          >
            {hitRateValue >= 80 ? "Excellent" : hitRateValue >= 50 ? "Bon" : "À optimiser"}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}

export default CacheStatsWidget;
