import { Header } from "@/components/layout/Header";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { StatCard } from "@/components/StatCard";
import { GammeDistributionChart } from "@/components/charts/GammeDistributionChart";
import { FamilyRankingChart } from "@/components/charts/FamilyRankingChart";
import { trpc } from "@/lib/trpc";
import { Loader2, Beaker, FlaskConical, Layers, Users } from "lucide-react";

export default function Statistics() {
  const { data: stats, isLoading } = trpc.molecules.getGlobalStats.useQuery();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Breadcrumbs />

      <main className="flex-1 pb-16">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-b from-muted/50 to-background">
          <div className="container">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Statistiques Globales
              </h1>
              <p className="text-lg text-muted-foreground">
                Vue d'ensemble analytique du projet PERFUMUM
              </p>
            </div>
          </div>
        </section>

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : stats ? (
          <>
            {/* KPI Cards */}
            <section className="py-8">
              <div className="container">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <StatCard
                    title="Molécules"
                    value={stats.totalMolecules}
                    icon={Beaker}
                    description="Total molécules documentées"
                  />
                  <StatCard
                    title="Recettes"
                    value={stats.totalRecettes}
                    icon={FlaskConical}
                    description="Formulations créées"
                  />
                  <StatCard
                    title="Familles Chimiques"
                    value={stats.totalFamilies}
                    icon={Layers}
                    description="Catégories uniques"
                  />
                  <StatCard
                    title="Prototypes"
                    value={stats.totalPrototypes}
                    icon={Users}
                    description="Prototypes développés"
                  />
                </div>
              </div>
            </section>

            {/* Charts Section */}
            <section className="py-8">
              <div className="container">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Gamme Distribution */}
                  <div className="bg-background rounded-lg p-6 border border-border shadow-sm">
                    <h2 className="text-xl font-bold mb-6">Répartition par Gamme</h2>
                    <GammeDistributionChart data={stats.gammeDistribution} />
                  </div>

                  {/* Family Ranking */}
                  <div className="bg-background rounded-lg p-6 border border-border shadow-sm">
                    <h2 className="text-xl font-bold mb-6">Top 10 Familles Chimiques</h2>
                    <FamilyRankingChart data={stats.familyDistribution} topN={10} />
                  </div>
                </div>
              </div>
            </section>

            {/* Insights Section */}
            <section className="py-8">
              <div className="container">
                <div className="max-w-4xl mx-auto bg-muted/30 rounded-lg p-8 border border-border">
                  <h2 className="text-2xl font-bold mb-4">Insights Clés</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold mb-2">Gamme Dominante</h3>
                      <p className="text-sm text-muted-foreground">
                        {stats.gammeDistribution.length > 0
                          ? `${stats.gammeDistribution.sort((a, b) => b.count - a.count)[0].gamme.charAt(0).toUpperCase() + stats.gammeDistribution.sort((a, b) => b.count - a.count)[0].gamme.slice(1)} avec ${stats.gammeDistribution.sort((a, b) => b.count - a.count)[0].count} molécules`
                          : 'Aucune donnée'}
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Famille la Plus Représentée</h3>
                      <p className="text-sm text-muted-foreground">
                        {stats.familyDistribution.length > 0
                          ? `${stats.familyDistribution.sort((a, b) => b.count - a.count)[0].family} avec ${stats.familyDistribution.sort((a, b) => b.count - a.count)[0].count} molécules`
                          : 'Aucune donnée'}
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Diversité Chimique</h3>
                      <p className="text-sm text-muted-foreground">
                        {stats.totalFamilies} familles chimiques différentes répertoriées
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Ratio Recettes/Molécules</h3>
                      <p className="text-sm text-muted-foreground">
                        {stats.totalMolecules > 0
                          ? `${(stats.totalRecettes / stats.totalMolecules).toFixed(2)} recettes par molécule en moyenne`
                          : 'Aucune donnée'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </>
        ) : (
          <div className="text-center py-16">
            <p className="text-muted-foreground">Aucune donnée disponible</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 py-8">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <p>© 2025 PERFUMUM — Recherche Olfactive</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
