import { Link } from "wouter";
import { Header } from "@/components/layout/Header";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Footer } from "@/components/layout/Footer";
import { ExportCSVButton } from "@/components/ExportCSVButton";
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
  Sparkles,
  Lightbulb,
  Loader2,
  Flame,
  Snowflake,
  Leaf,
  Droplets
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

export default function Admin() {
  // Charger les statistiques
  const { data: stats } = trpc.admin.getStats.useQuery();
  const [isEnriching, setIsEnriching] = useState(false);
  
  const [enrichingGamme, setEnrichingGamme] = useState<string | null>(null);
  
  const enrichGammeMutation = trpc.recettes.enrichGamme.useMutation({
    onSuccess: (data) => {
      toast.success(`${data.recettesProcessed} recettes enrichies avec ${data.associationsCreated} associations !`);
      setEnrichingGamme(null);
    },
    onError: (error) => {
      toast.error(`Erreur: ${error.message}`);
      setEnrichingGamme(null);
    },
  });
  
  const handleEnrichGamme = (gamme: 'volcanique' | 'glaciaire' | 'biolab' | 'petrichor') => {
    setEnrichingGamme(gamme);
    enrichGammeMutation.mutate({ gamme });
  };
  
  const enrichMutation = trpc.admin.enrichMoleculeData.useMutation({
    onSuccess: (data) => {
      toast.success(`${data.updated} molécules enrichies avec succès !`);
      setIsEnriching(false);
    },
    onError: (error) => {
      toast.error(`Erreur: ${error.message}`);
      setIsEnriching(false);
    },
  });
  
  const handleEnrichData = () => {
    setIsEnriching(true);
    enrichMutation.mutate();
  };

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
      <Breadcrumbs />
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
                          <Button className="w-full btn-enhanced" variant="outline">
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

        {/* Outils IA */}
        <section className="py-16 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/20">
          <div className="container">
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center gap-3 mb-6">
                <Sparkles className="w-6 h-6 text-purple-600" />
                <h2 className="text-2xl font-bold">Outils Intelligence Artificielle</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border-purple-200 dark:border-purple-800">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Database className="w-5 h-5 text-purple-600" />
                      Enrichir les données
                    </CardTitle>
                    <CardDescription>
                      Génère automatiquement les propriétés manquantes (masse moléculaire, point d'ébullition, famille chimique) basées sur les profils olfactifs
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      onClick={handleEnrichData}
                      disabled={isEnriching}
                      className="w-full bg-purple-600 hover:bg-purple-700"
                    >
                      {isEnriching ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Enrichissement en cours...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 mr-2" />
                          Enrichir les molécules
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
                
                <Card className="border-indigo-200 dark:border-indigo-800">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lightbulb className="w-5 h-5 text-indigo-600" />
                      Suggestions de synergies
                    </CardTitle>
                    <CardDescription>
                      Découvrez des paires de molécules prometteuses basées sur la similarité de leurs profils radar olfactifs
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link href="/suggestions-synergies">
                      <Button variant="outline" className="w-full border-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-950">
                        <Lightbulb className="w-4 h-4 mr-2" />
                        Voir les suggestions
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>
              
              {/* Section Enrichissement des Gammes */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-orange-600" />
                  Enrichir les associations molécules-recettes par gamme
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Génère automatiquement des associations entre les recettes et les molécules correspondantes pour chaque gamme olfactive.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <Button
                    onClick={() => handleEnrichGamme('volcanique')}
                    disabled={enrichingGamme !== null}
                    variant="outline"
                    className="border-orange-300 hover:bg-orange-50 dark:hover:bg-orange-950"
                  >
                    {enrichingGamme === 'volcanique' ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Flame className="w-4 h-4 mr-2 text-orange-600" />
                    )}
                    Volcanique
                  </Button>
                  <Button
                    onClick={() => handleEnrichGamme('glaciaire')}
                    disabled={enrichingGamme !== null}
                    variant="outline"
                    className="border-cyan-300 hover:bg-cyan-50 dark:hover:bg-cyan-950"
                  >
                    {enrichingGamme === 'glaciaire' ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Snowflake className="w-4 h-4 mr-2 text-cyan-600" />
                    )}
                    Glaciaire
                  </Button>
                  <Button
                    onClick={() => handleEnrichGamme('biolab')}
                    disabled={enrichingGamme !== null}
                    variant="outline"
                    className="border-green-300 hover:bg-green-50 dark:hover:bg-green-950"
                  >
                    {enrichingGamme === 'biolab' ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Leaf className="w-4 h-4 mr-2 text-green-600" />
                    )}
                    Bio-Lab
                  </Button>
                  <Button
                    onClick={() => handleEnrichGamme('petrichor')}
                    disabled={enrichingGamme !== null}
                    variant="outline"
                    className="border-stone-400 hover:bg-stone-50 dark:hover:bg-stone-950"
                  >
                    {enrichingGamme === 'petrichor' ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Droplets className="w-4 h-4 mr-2 text-stone-600" />
                    )}
                    Pétrichor
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Export CSV */}
        <section className="py-16 bg-muted/30">
          <div className="container">
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center gap-3 mb-6">
                <Database className="w-6 h-6 text-emerald-600" />
                <h2 className="text-2xl font-bold">Export des données</h2>
              </div>
              <p className="text-muted-foreground mb-6">
                Exportez vos données de recherche au format CSV pour les sauvegarder, les analyser ou les partager.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border-emerald-200 dark:border-emerald-800">
                  <CardHeader>
                    <CardTitle className="text-lg">Molécules</CardTitle>
                    <CardDescription>
                      Exporter le catalogue complet des molécules olfactives
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ExportCSVButton 
                      entityType="molecules" 
                      variant="outline"
                      className="w-full border-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950"
                    />
                  </CardContent>
                </Card>
                
                <Card className="border-emerald-200 dark:border-emerald-800">
                  <CardHeader>
                    <CardTitle className="text-lg">Recettes</CardTitle>
                    <CardDescription>
                      Exporter toutes les formulations complètes
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ExportCSVButton 
                      entityType="recettes" 
                      variant="outline"
                      className="w-full border-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950"
                    />
                  </CardContent>
                </Card>
                
                <Card className="border-emerald-200 dark:border-emerald-800">
                  <CardHeader>
                    <CardTitle className="text-lg">Accords</CardTitle>
                    <CardDescription>
                      Exporter les accords olfactifs créés
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ExportCSVButton 
                      entityType="accords" 
                      variant="outline"
                      className="w-full border-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950"
                    />
                  </CardContent>
                </Card>
                
                <Card className="border-emerald-200 dark:border-emerald-800">
                  <CardHeader>
                    <CardTitle className="text-lg">Familles</CardTitle>
                    <CardDescription>
                      Exporter les familles olfactives
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ExportCSVButton 
                      entityType="familles" 
                      variant="outline"
                      className="w-full border-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950"
                    />
                  </CardContent>
                </Card>
                
                <Card className="border-emerald-200 dark:border-emerald-800 md:col-span-2">
                  <CardHeader>
                    <CardTitle className="text-lg">Matières Premières</CardTitle>
                    <CardDescription>
                      Exporter l'inventaire complet du laboratoire
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ExportCSVButton 
                      entityType="matieres" 
                      variant="outline"
                      className="w-full border-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950"
                    />
                  </CardContent>
                </Card>
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
                  <Button className="w-full btn-enhanced" size="lg">
                    <Plus className="w-5 h-5 mr-2" />
                    Nouvelle Molécule
                  </Button>
                </Link>
                <Link href="/admin/accords/new">
                  <Button className="w-full btn-enhanced" size="lg" variant="outline">
                    <Plus className="w-5 h-5 mr-2" />
                    Nouvel Accord
                  </Button>
                </Link>
                <Link href="/admin/matieres/new">
                  <Button className="w-full btn-enhanced" size="lg" variant="outline">
                    <Plus className="w-5 h-5 mr-2" />
                    Nouvelle Matière
                  </Button>
                </Link>
                <Link href="/admin/recettes/new">
                  <Button className="w-full btn-enhanced" size="lg" variant="outline">
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
              <Button variant="ghost" size="sm" className="btn-enhanced">
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
