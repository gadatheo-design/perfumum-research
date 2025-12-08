import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { BarChart3, Eye, FileDown, Search, Star } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function AnalyticsDashboard() {
  const [days, setDays] = useState(30);
  
  const { data: stats, isLoading: statsLoading } = trpc.analytics.getDashboardStats.useQuery({ days });
  const { data: topMolecules } = trpc.analytics.getMostViewedMolecules.useQuery({ days, limit: 10 });
  const { data: topRecipes } = trpc.analytics.getMostViewedRecipes.useQuery({ days, limit: 10 });
  const { data: timeline } = trpc.analytics.getActivityTimeline.useQuery({ days });
  const { data: searches } = trpc.analytics.getPopularSearches.useQuery({ days, limit: 10 });

  if (statsLoading) {
    return (
      <div className="container py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <BarChart3 className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold">Tableau de Bord Analytique</h1>
        </div>
        
        {/* Period Selector */}
        <div className="flex gap-2">
          <Button 
            variant={days === 7 ? "default" : "outline"} 
            onClick={() => setDays(7)}
            size="sm"
          >
            7 jours
          </Button>
          <Button 
            variant={days === 30 ? "default" : "outline"} 
            onClick={() => setDays(30)}
            size="sm"
          >
            30 jours
          </Button>
          <Button 
            variant={days === 90 ? "default" : "outline"} 
            onClick={() => setDays(90)}
            size="sm"
          >
            90 jours
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vues Totales</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalViews || 0}</div>
            <p className="text-xs text-muted-foreground">
              Consultations de molécules et recettes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Exports PDF</CardTitle>
            <FileDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalExports || 0}</div>
            <p className="text-xs text-muted-foreground">
              Documents téléchargés
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recherches</CardTitle>
            <Search className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalSearches || 0}</div>
            <p className="text-xs text-muted-foreground">
              Requêtes effectuées
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Favoris</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalFavorites || 0}</div>
            <p className="text-xs text-muted-foreground">
              Éléments ajoutés aux favoris
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Top Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Molecules */}
        <Card>
          <CardHeader>
            <CardTitle>Top 10 Molécules</CardTitle>
          </CardHeader>
          <CardContent>
            {topMolecules && topMolecules.length > 0 ? (
              <div className="space-y-2">
                {topMolecules.map((mol, idx) => (
                  <div key={mol.id} className="flex items-center justify-between p-2 hover:bg-muted rounded">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-muted-foreground w-6">#{idx + 1}</span>
                      <span className="font-medium">{mol.name}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">{mol.viewCount} vues</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Aucune donnée disponible</p>
            )}
          </CardContent>
        </Card>

        {/* Top Recipes */}
        <Card>
          <CardHeader>
            <CardTitle>Top 10 Recettes</CardTitle>
          </CardHeader>
          <CardContent>
            {topRecipes && topRecipes.length > 0 ? (
              <div className="space-y-2">
                {topRecipes.map((recipe, idx) => (
                  <div key={recipe.id} className="flex items-center justify-between p-2 hover:bg-muted rounded">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-muted-foreground w-6">#{idx + 1}</span>
                      <span className="font-medium">{recipe.name}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">{recipe.viewCount} vues</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Aucune donnée disponible</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Popular Searches */}
      <Card>
        <CardHeader>
          <CardTitle>Recherches Populaires</CardTitle>
        </CardHeader>
        <CardContent>
          {searches && searches.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
              {searches.map((search, idx) => (
                <div key={idx} className="p-2 bg-muted rounded text-sm">
                  <div className="font-medium truncate">{search.query}</div>
                  <div className="text-xs text-muted-foreground">{search.count}×</div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Aucune recherche enregistrée</p>
          )}
        </CardContent>
      </Card>

      {/* Activity Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Activité Quotidienne</CardTitle>
        </CardHeader>
        <CardContent>
          {timeline && timeline.length > 0 ? (
            <div className="space-y-1">
              {timeline.map((day) => (
                <div key={day.date} className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground w-24">{day.date}</span>
                  <div className="flex-1 bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all" 
                      style={{ width: `${Math.min(100, (day.eventCount / Math.max(...timeline.map(t => t.eventCount))) * 100)}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium w-12 text-right">{day.eventCount}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Aucune activité enregistrée</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
