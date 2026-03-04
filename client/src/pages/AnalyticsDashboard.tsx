// @ts-nocheck
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { VoirAussi } from "@/components/VoirAussi";
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  Database,
  FlaskConical,
  Beaker,
  BookOpen,
  Sparkles,
  Activity,
  Calendar
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";

export default function AnalyticsDashboard() {
  // Récupérer les statistiques
  const { data: molecules, isLoading: loadingMolecules } = trpc.molecules.list.useQuery();
  const { data: recettes, isLoading: loadingRecettes } = trpc.recettes.list.useQuery();

  // Calculer les statistiques par famille
  const familleStats = molecules?.reduce((acc, mol) => {
    const famille = mol.family || "Non classé";
    acc[famille] = (acc[famille] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  // Top 5 familles
  const topFamilles = Object.entries(familleStats)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  // Statistiques des recettes par catégorie
  const recetteStats = recettes?.reduce((acc, rec) => {
    const cat = rec.category || "Autre";
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  const topCategories = Object.entries(recetteStats)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  // Statistiques des profils radar
  const radarStats = molecules?.reduce((acc, mol) => {
    if (mol.radarIntensity && mol.radarIntensity > 0) {
      acc.complete++;
    } else {
      acc.incomplete++;
    }
    return acc;
  }, { complete: 0, incomplete: 0 }) || { complete: 0, incomplete: 0 };

  const isLoading = loadingMolecules || loadingRecettes;

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container">
        <Breadcrumbs />
        
        {/* Header */}
        <div className="mb-8">
          <Badge className="mb-4" variant="secondary">
            <Activity className="h-3 w-3 mr-1" />
            Analytics
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight mb-2">
            Tableau de Bord Analytique
          </h1>
          <p className="text-muted-foreground">
            Vue d'ensemble des données du projet PERFUMUM et statistiques en temps réel.
          </p>
        </div>

        {/* Statistiques principales */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900">
                  <FlaskConical className="h-6 w-6 text-green-700 dark:text-green-300" />
                </div>
                <div>
                  <div className="text-2xl font-bold">
                    {isLoading ? "..." : molecules?.length || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">Molécules</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900">
                  <Beaker className="h-6 w-6 text-blue-700 dark:text-blue-300" />
                </div>
                <div>
                  <div className="text-2xl font-bold">
                    {isLoading ? "..." : recettes?.length || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">Recettes</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900">
                  <BookOpen className="h-6 w-6 text-purple-700 dark:text-purple-300" />
                </div>
                <div>
                  <div className="text-2xl font-bold">26</div>
                  <div className="text-sm text-muted-foreground">Traditions</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-amber-100 dark:bg-amber-900">
                  <Sparkles className="h-6 w-6 text-amber-700 dark:text-amber-300" />
                </div>
                <div>
                  <div className="text-2xl font-bold">5</div>
                  <div className="text-sm text-muted-foreground">Gammes</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Graphiques */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Top familles chimiques */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                Répartition par Famille Chimique
              </CardTitle>
              <CardDescription>
                Top 5 des familles les plus représentées
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-48 flex items-center justify-center">
                  <div className="animate-pulse text-muted-foreground">Chargement...</div>
                </div>
              ) : (
                <div className="space-y-4">
                  {topFamilles.map(([famille, count], index) => {
                    const percentage = Math.round((count / (molecules?.length || 1)) * 100);
                    const colors = [
                      "bg-green-500",
                      "bg-blue-500",
                      "bg-purple-500",
                      "bg-amber-500",
                      "bg-red-500"
                    ];
                    return (
                      <div key={famille} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">{famille}</span>
                          <span className="text-muted-foreground">{count} ({percentage}%)</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${colors[index]} transition-all`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Top catégories recettes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Recettes par Catégorie
              </CardTitle>
              <CardDescription>
                Distribution des recettes par type
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-48 flex items-center justify-center">
                  <div className="animate-pulse text-muted-foreground">Chargement...</div>
                </div>
              ) : (
                <div className="space-y-4">
                  {topCategories.map(([categorie, count], index) => {
                    const percentage = Math.round((count / (recettes?.length || 1)) * 100);
                    const colors = [
                      "bg-blue-500",
                      "bg-green-500",
                      "bg-amber-500",
                      "bg-purple-500",
                      "bg-red-500"
                    ];
                    return (
                      <div key={categorie} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">{categorie}</span>
                          <span className="text-muted-foreground">{count} ({percentage}%)</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${colors[index]} transition-all`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Profils radar */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Complétude des Profils Radar
            </CardTitle>
            <CardDescription>
              Suivi de la documentation des profils olfactifs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-4 rounded-lg bg-green-50 dark:bg-green-950">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                  {radarStats.complete}
                </div>
                <div className="text-sm text-muted-foreground">Profils complets</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-amber-50 dark:bg-amber-950">
                <div className="text-3xl font-bold text-amber-600 dark:text-amber-400">
                  {radarStats.incomplete}
                </div>
                <div className="text-sm text-muted-foreground">À compléter</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-blue-50 dark:bg-blue-950">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {molecules?.length ? Math.round((radarStats.complete / molecules.length) * 100) : 0}%
                </div>
                <div className="text-sm text-muted-foreground">Taux de complétion</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Activité récente */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Projet PERFUMUM
            </CardTitle>
            <CardDescription>
              Programme de recherche 2025-2035
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Objectifs du projet</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                    Design terpénique et formulation olfactive
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-blue-500" />
                    Développement de résines CBD aromatisées
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-purple-500" />
                    Documentation des variétés de tabacs rares
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-amber-500" />
                    Anthropologie olfactive et traditions rituelles
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Prochaines étapes</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <Database className="h-4 w-4" />
                    Enrichir les profils radar des molécules
                  </li>
                  <li className="flex items-center gap-2">
                    <FlaskConical className="h-4 w-4" />
                    Documenter les synergies moléculaires
                  </li>
                  <li className="flex items-center gap-2">
                    <Beaker className="h-4 w-4" />
                    Développer de nouvelles formulations
                  </li>
                  <li className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    Compléter les fiches civilisations
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Voir aussi */}
        <VoirAussi 
          title="Explorer les données"
          variant="compact"
          items={[
            {
              title: "Molécules",
              description: "Base de données complète",
              href: "/molecules",
              badge: String(molecules?.length || 155),
            },
            {
              title: "Recettes",
              description: "Formulations expérimentales",
              href: "/recettes",
              badge: String(recettes?.length || 150),
            },
            {
              title: "Suggestions IA",
              description: "Synergies moléculaires suggérées",
              href: "/suggestions-synergies",
            },
            {
              title: "Administration",
              description: "Gérer les données",
              href: "/admin",
            },
          ]}
        />
      </div>
    </div>
  );
}
