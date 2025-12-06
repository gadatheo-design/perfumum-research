import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { BarChart3, Beaker, BookOpen, FlaskConical, Globe, Layers } from "lucide-react";

export function Dashboard() {
  const { data: stats, isLoading: statsLoading } = trpc.dashboard.getStats.useQuery();
  const { data: recipesByStatus, isLoading: statusLoading } = trpc.dashboard.getRecipesByStatus.useQuery();
  const { data: recipesByCategory, isLoading: categoryLoading } = trpc.dashboard.getRecipesByCategory.useQuery();
  const { data: moleculesByFamily, isLoading: familyLoading } = trpc.dashboard.getMoleculesByFamily.useQuery();
  const { data: recentActivity, isLoading: activityLoading } = trpc.dashboard.getRecentActivity.useQuery({ limit: 8 });

  if (statsLoading) {
    return (
      <div className="container py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const statusColors: Record<string, string> = {
    experimental: "bg-yellow-100 text-yellow-800",
    testing: "bg-blue-100 text-blue-800",
    validated: "bg-green-100 text-green-800",
    production: "bg-purple-100 text-purple-800",
  };

  const statusLabels: Record<string, string> = {
    experimental: "Expérimental",
    testing: "En test",
    validated: "Validé",
    production: "Production",
  };

  return (
    <div className="container py-8 space-y-8">
      <Breadcrumbs />
      
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <BarChart3 className="h-8 w-8 text-purple-600" />
          <h1 className="text-4xl font-bold">Dashboard Analytics</h1>
        </div>
        <p className="text-lg text-gray-600">
          Vue d'ensemble du projet PERFUMUM — Statistiques, progression R&D et activité récente
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Beaker className="h-4 w-4" />
              Molécules
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">{stats?.molecules || 0}</div>
            <p className="text-xs text-gray-500 mt-1">Composés chimiques</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <FlaskConical className="h-4 w-4" />
              Recettes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{stats?.recettes || 0}</div>
            <p className="text-xs text-gray-500 mt-1">Formulations</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Layers className="h-4 w-4" />
              Accords
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{stats?.accords || 0}</div>
            <p className="text-xs text-gray-500 mt-1">Synergies olfactives</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Prototypes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">{stats?.prototypes || 0}</div>
            <p className="text-xs text-gray-500 mt-1">Créations</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Traditions Olfactives
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">{stats?.civilisations || 0}</div>
            <p className="text-xs text-gray-500 mt-1">Contextes culturels</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recipes by Status */}
        <Card>
          <CardHeader>
            <CardTitle>Progression R&D</CardTitle>
            <CardDescription>Répartition des recettes par statut</CardDescription>
          </CardHeader>
          <CardContent>
            {statusLoading ? (
              <div className="h-48 bg-gray-100 animate-pulse rounded"></div>
            ) : (
              <div className="space-y-3">
                {recipesByStatus && recipesByStatus.length > 0 ? (
                  recipesByStatus.map((item) => {
                    const total = recipesByStatus.reduce((sum, r) => sum + Number(r.count), 0);
                    const percentage = total > 0 ? (Number(item.count) / total) * 100 : 0;
                    
                    return (
                      <div key={item.status} className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium">
                            {statusLabels[item.status || ""] || item.status}
                          </span>
                          <span className="text-gray-600">{item.count} recettes</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              item.status === "experimental"
                                ? "bg-yellow-500"
                                : item.status === "testing"
                                ? "bg-blue-500"
                                : item.status === "validated"
                                ? "bg-green-500"
                                : "bg-purple-500"
                            }`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-gray-500 text-center py-8">Aucune donnée disponible</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recipes by Category */}
        <Card>
          <CardHeader>
            <CardTitle>Catégories de Recettes</CardTitle>
            <CardDescription>Répartition par type de formulation</CardDescription>
          </CardHeader>
          <CardContent>
            {categoryLoading ? (
              <div className="h-48 bg-gray-100 animate-pulse rounded"></div>
            ) : (
              <div className="space-y-3">
                {recipesByCategory && recipesByCategory.length > 0 ? (
                  recipesByCategory.slice(0, 6).map((item) => {
                    const total = recipesByCategory.reduce((sum, r) => sum + Number(r.count), 0);
                    const percentage = total > 0 ? (Number(item.count) / total) * 100 : 0;
                    
                    return (
                      <div key={item.category} className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium capitalize">{item.category}</span>
                          <span className="text-gray-600">{item.count}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-purple-500 h-2 rounded-full"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-gray-500 text-center py-8">Aucune donnée disponible</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity & Molecules by Family */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Activité Récente</CardTitle>
            <CardDescription>Dernières recettes créées ou modifiées</CardDescription>
          </CardHeader>
          <CardContent>
            {activityLoading ? (
              <div className="space-y-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-16 bg-gray-100 animate-pulse rounded"></div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {recentActivity && recentActivity.length > 0 ? (
                  recentActivity.map((recipe) => (
                    <div
                      key={recipe.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-sm">{recipe.name}</p>
                        <p className="text-xs text-gray-500 capitalize">{recipe.category}</p>
                      </div>
                      {recipe.status && (
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            statusColors[recipe.status] || "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {statusLabels[recipe.status] || recipe.status}
                        </span>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-8">Aucune activité récente</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Molecules by Family */}
        <Card>
          <CardHeader>
            <CardTitle>Familles Moléculaires</CardTitle>
            <CardDescription>Répartition des molécules par famille chimique</CardDescription>
          </CardHeader>
          <CardContent>
            {familyLoading ? (
              <div className="h-64 bg-gray-100 animate-pulse rounded"></div>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {moleculesByFamily && moleculesByFamily.length > 0 ? (
                  moleculesByFamily.map((item) => (
                    <div
                      key={item.family}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded hover:bg-gray-100 transition-colors"
                    >
                      <span className="text-sm font-medium">{item.family}</span>
                      <span className="text-sm text-gray-600 font-semibold">{item.count}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-8">Aucune donnée disponible</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
