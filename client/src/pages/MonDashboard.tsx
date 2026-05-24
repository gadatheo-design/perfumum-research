// @ts-nocheck
import { safeJsonParse } from "@/lib/utils";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { Heart, TrendingUp, Clock, BarChart3, Sparkles, ArrowRight, Shield, Leaf } from "lucide-react";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend } from "recharts";
import { useMemo, useEffect } from "react";
import { Breadcrumbs } from "@/components/Breadcrumbs";

// ── Certification Radar Widget ───────────────────────────────────────────────
const CERT_COLORS: Record<string, string> = {
  FairWild: "#16a34a",
  UEBT: "#2563eb",
  "Rainforest Alliance": "#15803d",
  FSC: "#166534",
  COSMOS: "#7c3aed",
  CITES: "#dc2626",
  AOC: "#d97706",
  IGP: "#b45309",
  IFRA: "#9f1239",
  UICN: "#0e7490",
  TRAFFIC: "#6b7280",
  "Slow Food Ark of Taste": "#ea580c",
  "Patrimoine vivant": "#8b5cf6",
  "Banque de semences": "#0891b2",
};

function CertificationRadarWidget() {
  const { data: certStats, isLoading } = trpc.plants.getCertificationStats.useQuery();

  const pieData = useMemo(() => {
    if (!certStats?.byType) return [];
    return Object.entries(certStats?.byType)
      .map(([type, count]) => ({ name: type, value: count as number }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);
  }, [certStats]);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="h-48 bg-muted animate-pulse rounded-lg" />
        </CardContent>
      </Card>
    );
  }

  if (!certStats || certStats?.totalCertified === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-green-600" />
          Durabilité du Corpus PERFUMUM
        </CardTitle>
        <CardDescription>
          {certStats?.totalCertified} plantes certifiées sur {certStats?.totalPlants} ({Math.round((certStats?.totalCertified / certStats?.totalPlants) * 100)}%)
          · {certStats?.totalCertifications} certifications actives
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Donut chart */}
          <div className="flex flex-col items-center">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {pieData.map((entry) => (
                    <Cell key={entry.name} fill={CERT_COLORS[entry.name] || "#94a3b8"} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: number, n: string) => [`${v} plante${v > 1 ? 's' : ''}`, n]} />
              </PieChart>
            </ResponsiveContainer>
            <p className="text-xs text-muted-foreground text-center mt-1">Répartition par type de certification</p>
          </div>

          {/* Légende + statuts IUCN */}
          <div className="space-y-3">
            <div className="space-y-1.5">
              {pieData.map((entry) => (
                <div key={entry.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: CERT_COLORS[entry.name] || "#94a3b8" }} />
                    <span className="text-muted-foreground">{entry.name}</span>
                  </div>
                  <Badge variant="outline" className="text-xs">{entry.value}</Badge>
                </div>
              ))}
            </div>

            {certStats?.byIucn && (
              <div className="pt-3 border-t">
                <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1">
                  <Leaf className="h-3 w-3" /> Plantes certifiées par statut IUCN
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {Object.entries(certStats?.byIucn).map(([status, count]) => (
                    <Badge
                      key={status}
                      className="text-xs"
                      style={{
                        backgroundColor:
                          status === 'CR' ? '#dc2626' :
                          status === 'EN' ? '#ea580c' :
                          status === 'VU' ? '#d97706' :
                          status === 'NT' ? '#65a30d' :
                          '#16a34a',
                        color: 'white',
                      }}
                    >
                      {status}: {count as number}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <Link href="/patrimoine-menace">
              <div className="flex items-center gap-1 text-xs text-primary hover:underline cursor-pointer mt-2">
                <ArrowRight className="h-3 w-3" />
                Voir le Patrimoine Menacé
              </div>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function MonDashboard() {
  const trackEvent = trpc.analytics.trackEvent.useMutation();

  // Track page view
  useEffect(() => {
    trackEvent.mutate({
      eventType: "search_query",
      entityType: "dashboard",
      metadata: JSON.stringify({
        page: "mon-dashboard",
        source: "navigation",
      }),
    });
  }, []);

  // Récupérer les favoris depuis localStorage
  const favoriteMolecules = useMemo(() => {
    if (typeof window === "undefined") return [];
    const stored = localStorage.getItem("favoriteMolecules");
    return stored ? safeJsonParse(stored, []) : [];
  }, []);

  const favoriteRecettes = useMemo(() => {
    if (typeof window === "undefined") return [];
    const stored = localStorage.getItem("favoriteRecettes");
    return stored ? safeJsonParse(stored, []) : [];
  }, []);

  // Récupérer l'historique de consultation
  const recentlyViewed = useMemo(() => {
    if (typeof window === "undefined") return [];
    const stored = localStorage.getItem("recentlyViewedRecipes");
    return stored ? safeJsonParse<any[]>(stored, []).slice(0, 5) : [];
  }, []);

  // Récupérer les recommandations basées sur les favoris
  const { data: recommendedRecettes, isLoading: isLoadingRecettes } = trpc.recommendations.fromFavorites.useQuery(
    {
      favoriteMoleculeIds: favoriteMolecules,
      limit: 6,
    },
    { enabled: favoriteMolecules.length > 0 }
  );

  // Récupérer les détails des molécules favorites pour calculer le profil radar moyen
  const { data: allMolecules } = trpc.molecules.list.useQuery();
  const moleculesDetails = useMemo(() => {
    if (!allMolecules || favoriteMolecules.length === 0) return [];
    return allMolecules?.filter((m: any) => favoriteMolecules.includes(m.id));
  }, [allMolecules, favoriteMolecules]);

  // Calculer le profil radar moyen des molécules favorites
  const averageRadarProfile = useMemo(() => {
    if (!moleculesDetails || moleculesDetails.length === 0) return null;

    const avg = {
      intensity: Math.round(moleculesDetails.reduce((sum: number, m: any) => sum + (m.radarIntensity || 50), 0) / moleculesDetails.length),
      freshness: Math.round(moleculesDetails.reduce((sum: number, m: any) => sum + (m.radarFreshness || 50), 0) / moleculesDetails.length),
      warmth: Math.round(moleculesDetails.reduce((sum: number, m: any) => sum + (m.radarWarmth || 50), 0) / moleculesDetails.length),
      sweetness: Math.round(moleculesDetails.reduce((sum: number, m: any) => sum + (m.radarSweetness || 50), 0) / moleculesDetails.length),
      spiciness: Math.round(moleculesDetails.reduce((sum: number, m: any) => sum + (m.radarSpiciness || 50), 0) / moleculesDetails.length),
      earthiness: Math.round(moleculesDetails.reduce((sum: number, m: any) => sum + (m.radarEarthiness || 50), 0) / moleculesDetails.length),
    };

    return [
      { axis: "Intensité", value: avg.intensity },
      { axis: "Fraîcheur", value: avg.freshness },
      { axis: "Chaleur", value: avg.warmth },
      { axis: "Douceur", value: avg.sweetness },
      { axis: "Épices", value: avg.spiciness },
      { axis: "Terreux", value: avg.earthiness },
    ];
  }, [moleculesDetails]);

  return (
    <div className="container mx-auto py-8 space-y-6">
      <Breadcrumbs
        customItems={[
          { label: "Mon Dashboard" }
        ]}
      />

      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight flex items-center gap-3">
          <Sparkles className="h-8 w-8 text-primary" />
          Mon Dashboard Personnalisé
        </h1>
        <p className="text-muted-foreground text-lg">
          Découvrez vos recommandations personnalisées basées sur vos favoris et votre historique
        </p>
      </div>

      {/* Statistiques personnelles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Heart className="h-4 w-4 text-rose-500" />
              Molécules Favorites
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{favoriteMolecules.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {favoriteMolecules.length === 0 ? "Aucune molécule favorite" : "Molécules enregistrées"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Heart className="h-4 w-4 text-amber-500" />
              Recettes Favorites
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{favoriteRecettes.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {favoriteRecettes.length === 0 ? "Aucune recette favorite" : "Recettes enregistrées"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-500" />
              Historique
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{recentlyViewed.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {recentlyViewed.length === 0 ? "Aucune consultation récente" : "Recettes consultées"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Profil radar moyen des molécules favorites */}
      {averageRadarProfile && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Profil Olfactif Moyen de Vos Favoris
            </CardTitle>
            <CardDescription>
              Ce radar représente la moyenne des profils olfactifs de vos {moleculesDetails?.length} molécules favorites
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <RadarChart data={averageRadarProfile}>
                <PolarGrid stroke="#e5e7eb" />
                <PolarAngleAxis dataKey="axis" tick={{ fill: "#6b7280", fontSize: 12 }} />
                <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: "#9ca3af", fontSize: 10 }} />
                <Radar
                  name="Profil Moyen"
                  dataKey="value"
                  stroke="#7c3aed"
                  fill="#7c3aed"
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Recommandations basées sur les favoris */}
      {favoriteMolecules.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Recettes Recommandées pour Vous
            </CardTitle>
            <CardDescription>
              Basées sur vos {favoriteMolecules.length} molécules favorites
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingRecettes ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-20 bg-muted animate-pulse rounded-lg" />
                ))}
              </div>
            ) : recommendedRecettes && recommendedRecettes?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recommendedRecettes?.map((rec) => (
                  <Link key={rec.recette.id} href={`/recette/${rec.recette.id}`}>
                    <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-base">{rec.recette.name}</h3>
                          <Badge variant="outline" className="shrink-0 ml-2">
                            {Math.round(rec.matchScore)}% match
                          </Badge>
                        </div>
                        {rec.recette.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                            {rec.recette.description}
                          </p>
                        )}
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>{rec.recette.moleculeCount} molécules</span>
                          {rec.recette.category && (
                            <Badge variant="secondary" className="text-xs">
                              {rec.recette.category}
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>Aucune recommandation disponible pour le moment.</p>
                <p className="text-sm mt-2">Ajoutez plus de molécules à vos favoris pour obtenir des recommandations personnalisées.</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Activité récente */}
      {recentlyViewed.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Consultations Récentes
            </CardTitle>
            <CardDescription>
              Vos {recentlyViewed.length} dernières recettes consultées
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentlyViewed.map((recipe: any) => (
                <Link key={recipe.id} href={`/recette/${recipe.id}`}>
                  <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors cursor-pointer">
                    <div>
                      <h4 className="font-medium">{recipe.name}</h4>
                      {recipe.category && (
                        <p className="text-sm text-muted-foreground">{recipe.category}</p>
                      )}
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Widget Certification Radar — durabilité du corpus PERFUMUM */}
      <CertificationRadarWidget />

      {/* Message si aucune donnée */}
      {favoriteMolecules.length === 0 && favoriteRecettes.length === 0 && recentlyViewed.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center">
            <Sparkles className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Commencez votre exploration</h3>
            <p className="text-muted-foreground mb-4">
              Ajoutez des molécules et recettes à vos favoris pour obtenir des recommandations personnalisées
            </p>
            <div className="flex gap-3 justify-center">
              <Link href="/molecules">
                <Badge variant="outline" className="cursor-pointer hover:bg-muted px-4 py-2">
                  Explorer les Molécules
                </Badge>
              </Link>
              <Link href="/recettes">
                <Badge variant="outline" className="cursor-pointer hover:bg-muted px-4 py-2">
                  Explorer les Recettes
                </Badge>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
