import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CacheStatsWidget } from "@/components/CacheStatsWidget";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { 
  Database, 
  FlaskConical, 
  Leaf, 
  BookOpen, 
  Users, 
  Calendar,
  TrendingUp,
  Shield,
  AlertCircle
} from "lucide-react";

export default function GestionPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  // Statistiques globales
  const { data: molecules } = trpc.molecules.list.useQuery();
  const { data: plants } = trpc.plants.list.useQuery();
  const { data: recettes } = trpc.recettes.list.useQuery();

  const stats = {
    molecules: molecules?.length || 0,
    plants: plants?.length || 0,
    recettes: recettes?.length || 0,
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Breadcrumbs />
      <Header />
      
      <main className="flex-1 py-16">
        <div className="container">
          <div className="max-w-6xl mx-auto">
            {/* En-tête */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <h1 className="text-4xl font-bold">Gestion du Projet</h1>
                {isAdmin && (
                  <Badge variant="default" className="text-xs">
                    <Shield className="h-3 w-3 mr-1" />
                    Admin
                  </Badge>
                )}
              </div>
              <p className="text-lg text-muted-foreground">
                Dashboard de gestion : statistiques, performance et administration
              </p>
            </div>

            {/* Grille de statistiques */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <FlaskConical className="h-4 w-4 text-blue-500" />
                    Molécules
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{stats.molecules}</p>
                  <p className="text-xs text-muted-foreground">entrées dans la base</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Leaf className="h-4 w-4 text-green-500" />
                    Plantes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{stats.plants}</p>
                  <p className="text-xs text-muted-foreground">espèces documentées</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <BookOpen className="h-4 w-4 text-amber-500" />
                    Recettes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{stats.recettes}</p>
                  <p className="text-xs text-muted-foreground">formulations enregistrées</p>
                </CardContent>
              </Card>
            </div>

            {/* Section Admin - Cache et Performance */}
            {isAdmin ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Widget Cache */}
                <CacheStatsWidget />

                {/* Informations système */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Database className="h-5 w-5 text-primary" />
                      Informations Système
                    </CardTitle>
                    <CardDescription>
                      État de la base de données et du serveur
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Statut serveur</span>
                      </div>
                      <Badge variant="default" className="bg-green-500">
                        En ligne
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Database className="h-4 w-4 text-blue-500" />
                        <span className="text-sm">Base de données</span>
                      </div>
                      <Badge variant="default" className="bg-blue-500">
                        Connectée
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-purple-500" />
                        <span className="text-sm">Utilisateur</span>
                      </div>
                      <span className="text-sm font-medium">{user?.name || "Anonyme"}</span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-amber-500" />
                        <span className="text-sm">Session</span>
                      </div>
                      <span className="text-sm font-medium">
                        {new Date().toLocaleDateString("fr-FR")}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-amber-500" />
                    Accès restreint
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Les outils d'administration sont réservés aux utilisateurs avec le rôle admin.
                    Connectez-vous avec un compte administrateur pour accéder aux statistiques de cache
                    et aux outils de gestion avancés.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
