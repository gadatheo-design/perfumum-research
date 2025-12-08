import { Link } from "wouter";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Plus, 
  Beaker, 
  Layers, 
  FlaskConical, 
  BookOpen, 
  Palette,
  Database,
  BarChart3,
  Eye,
  FileDown,
  Search,
  Star
} from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function Admin() {
  // Charger les statistiques
  const { data: stats } = trpc.admin.getStats.useQuery();
  
  // Charger les analytics (30 derniers jours)
  const { data: analyticsStats } = trpc.analytics.getDashboardStats.useQuery({ days: 30 });
  const { data: topMolecules } = trpc.analytics.getMostViewedMolecules.useQuery({ days: 30, limit: 5 });
  const { data: topRecipes } = trpc.analytics.getMostViewedRecipes.useQuery({ days: 30, limit: 5 });

  const adminSections = [
    {
      title: "Molécules",
      description: "Gérer le catalogue des molécules olfactives",
      icon: Beaker,
      href: "/admin/molecules",
      count: stats?.molecules || 0,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Accords",
      description: "Créer et modifier les accords olfactifs",
      icon: Layers,
      href: "/admin/accords",
      count: stats?.accords || 0,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Familles",
      description: "Organiser les familles olfactives",
      icon: Palette,
      href: "/admin/familles",
      count: stats?.families || 0,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Matières Premières",
      description: "Gérer l'inventaire du laboratoire",
      icon: FlaskConical,
      href: "/admin/matieres",
      count: stats?.matieres || 0,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
    },
    {
      title: "Recettes",
      description: "Documenter les formulations complètes",
      icon: BookOpen,
      href: "/admin/recettes",
      count: stats?.recettes || 0,
      color: "text-rose-600",
      bgColor: "bg-rose-50",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero */}
        <section className="section-spacing bg-gradient-to-b from-background to-muted/30">
          <div className="container">
            <div className="max-w-4xl mx-auto text-center">
              <Database className="w-16 h-16 mx-auto mb-6 text-primary" />
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
                Administration
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Interface de gestion des données PERFUMUM
              </p>
            </div>
          </div>
        </section>

        {/* Statistics Overview */}
        {stats && (
          <section className="py-12 bg-muted/30">
            <div className="container">
              <div className="max-w-5xl mx-auto">
                <div className="flex items-center gap-3 mb-8">
                  <BarChart3 className="w-6 h-6 text-primary" />
                  <h2 className="text-2xl font-bold">Vue d'ensemble</h2>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-3xl font-bold text-primary">
                        {stats.prototypes}
                      </CardTitle>
                      <CardDescription>Prototypes</CardDescription>
                    </CardHeader>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-3xl font-bold text-purple-600">
                        {stats.molecules}
                      </CardTitle>
                      <CardDescription>Molécules</CardDescription>
                    </CardHeader>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-3xl font-bold text-green-600">
                        {stats.accords}
                      </CardTitle>
                      <CardDescription>Accords</CardDescription>
                    </CardHeader>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-3xl font-bold text-blue-600">
                        {stats.families}
                      </CardTitle>
                      <CardDescription>Familles</CardDescription>
                    </CardHeader>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-3xl font-bold text-rose-600">
                        {stats.recettes}
                      </CardTitle>
                      <CardDescription>Recettes</CardDescription>
                    </CardHeader>
                  </Card>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Analytics Section */}
        <section className="py-16 bg-muted/30">
          <div className="container">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center gap-3 mb-8">
                <BarChart3 className="h-8 w-8 text-primary" />
                <h2 className="text-3xl font-bold">Analytics (30 derniers jours)</h2>
              </div>
              
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Vues Totales</CardTitle>
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{analyticsStats?.totalViews || 0}</div>
                    <p className="text-xs text-muted-foreground">Consultations</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Exports PDF</CardTitle>
                    <FileDown className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{analyticsStats?.totalExports || 0}</div>
                    <p className="text-xs text-muted-foreground">Téléchargements</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Recherches</CardTitle>
                    <Search className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{analyticsStats?.totalSearches || 0}</div>
                    <p className="text-xs text-muted-foreground">Requêtes</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Favoris</CardTitle>
                    <Star className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{analyticsStats?.totalFavorites || 0}</div>
                    <p className="text-xs text-muted-foreground">Ajouts</p>
                  </CardContent>
                </Card>
              </div>

              {/* Top Content */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Top 5 Molécules</CardTitle>
                    <CardDescription>Les plus consultées</CardDescription>
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

                <Card>
                  <CardHeader>
                    <CardTitle>Top 5 Recettes</CardTitle>
                    <CardDescription>Les plus consultées</CardDescription>
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
            </div>
          </div>
        </section>

        {/* Admin Sections */}
        <section className="py-16">
          <div className="container">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl font-bold mb-8">Gestion des données</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {adminSections.map((section, index) => {
                  const Icon = section.icon;
                  return (
                    <Card key={index} className="transition-all hover:shadow-lg hover:-translate-y-1 duration-300">
                      <CardHeader>
                        <div className="flex items-start justify-between gap-4">
                          <div className={`p-3 rounded-lg ${section.bgColor}`}>
                            <Icon className={`w-6 h-6 ${section.color}`} />
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-primary">
                              {section.count}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              entrées
                            </div>
                          </div>
                        </div>
                        <CardTitle className="text-xl mt-4">{section.title}</CardTitle>
                        <CardDescription>{section.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Link href={section.href}>
                          <Button className="w-full" variant="outline">
                            <Plus className="w-4 h-4 mr-2" />
                            Gérer
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="py-16 bg-muted/30">
          <div className="container">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold mb-6 text-center">Actions rapides</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link href="/admin/molecules/new">
                  <Button className="w-full" size="lg">
                    <Plus className="w-5 h-5 mr-2" />
                    Nouvelle Molécule
                  </Button>
                </Link>
                <Link href="/admin/accords/new">
                  <Button className="w-full" size="lg" variant="outline">
                    <Plus className="w-5 h-5 mr-2" />
                    Nouvel Accord
                  </Button>
                </Link>
                <Link href="/admin/matieres/new">
                  <Button className="w-full" size="lg" variant="outline">
                    <Plus className="w-5 h-5 mr-2" />
                    Nouvelle Matière
                  </Button>
                </Link>
                <Link href="/admin/recettes/new">
                  <Button className="w-full" size="lg" variant="outline">
                    <Plus className="w-5 h-5 mr-2" />
                    Nouvelle Recette
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 py-8 mt-16">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <p>© 2025 PERFUMUM — Recherche Olfactive</p>
            <Link href="/">
              <Button variant="ghost" size="sm">
                Retour au site
              </Button>
            </Link>
          </div>
        </div>
      </footer>
    <Footer />

    </div>
  );
}
