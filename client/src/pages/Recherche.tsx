import { useState } from "react";
import { Link } from "wouter";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { VoirAussi } from "@/components/VoirAussi";
import { 
  Search, 
  FlaskConical, 
  Beaker, 
  Microscope,
  BookOpen,
  FileText,
  Database,
  ArrowRight,
  Sparkles
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";

export default function Recherche() {
  const [searchQuery, setSearchQuery] = useState("");
  
  // Récupérer les statistiques
  const { data: molecules } = trpc.molecules.list.useQuery();
  const { data: recettes } = trpc.recettes.list.useQuery();

  return (
    <div className="container py-8">
      <Breadcrumbs />
      
      {/* Header */}
      <div className="mb-8">
        <Badge className="mb-4" variant="secondary">
          <Search className="h-3 w-3 mr-1" />
          Recherche
        </Badge>
        <h1 className="text-4xl font-bold tracking-tight mb-2">
          Recherche PERFUMUM
        </h1>
        <p className="text-muted-foreground">
          Explorez les axes de recherche du projet PERFUMUM (2025-2035).
        </p>
      </div>

      {/* Barre de recherche */}
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher une molécule, recette, tradition..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button>Rechercher</Button>
          </div>
        </CardContent>
      </Card>

      {/* Axes de recherche */}
      <h2 className="text-2xl font-bold mb-6">Axes de Recherche</h2>
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900">
                <FlaskConical className="h-6 w-6 text-green-700 dark:text-green-300" />
              </div>
              <div>
                <CardTitle>Design Terpénique</CardTitle>
                <CardDescription>155 molécules documentées</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Étude des profils terpéniques et de leurs interactions synergiques dans les formulations olfactives.
            </p>
            <Link href="/molecules">
              <Button variant="outline" size="sm">
                Explorer <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900">
                <Beaker className="h-6 w-6 text-blue-700 dark:text-blue-300" />
              </div>
              <div>
                <CardTitle>Résines CBD</CardTitle>
                <CardDescription>10 formulations validées</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Développement de résines aromatisées combinant cannabinoïdes et terpènes naturels.
            </p>
            <Link href="/resines-cbd">
              <Button variant="outline" size="sm">
                Explorer <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900">
                <Microscope className="h-6 w-6 text-amber-700 dark:text-amber-300" />
              </div>
              <div>
                <CardTitle>Tabacs Rares</CardTitle>
                <CardDescription>26 traditions documentées</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Exploration des variétés de tabacs d'exception et de leurs profils aromatiques uniques.
            </p>
            <Link href="/chimie-tabac">
              <Button variant="outline" size="sm">
                Explorer <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900">
                <BookOpen className="h-6 w-6 text-purple-700 dark:text-purple-300" />
              </div>
              <div>
                <CardTitle>Anthropologie Olfactive</CardTitle>
                <CardDescription>26 civilisations étudiées</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Documentation des pratiques olfactives rituelles à travers les cultures et les époques.
            </p>
            <Link href="/civilisations">
              <Button variant="outline" size="sm">
                Explorer <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Statistiques */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Base de données
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 rounded-lg bg-muted">
              <div className="text-2xl font-bold">{molecules?.length || 155}</div>
              <div className="text-sm text-muted-foreground">Molécules</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted">
              <div className="text-2xl font-bold">{recettes?.length || 150}</div>
              <div className="text-sm text-muted-foreground">Recettes</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted">
              <div className="text-2xl font-bold">26</div>
              <div className="text-sm text-muted-foreground">Traditions</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted">
              <div className="text-2xl font-bold">5</div>
              <div className="text-sm text-muted-foreground">Gammes</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Accès rapide */}
      <div className="flex flex-wrap gap-4 mb-8">
        <Link href="/molecules">
          <Button variant="outline" className="btn-enhanced">
            <FlaskConical className="h-4 w-4 mr-2" />
            Molécules
          </Button>
        </Link>
        <Link href="/recettes">
          <Button variant="outline" className="btn-enhanced">
            <Beaker className="h-4 w-4 mr-2" />
            Recettes
          </Button>
        </Link>
        <Link href="/civilisations">
          <Button variant="outline" className="btn-enhanced">
            <BookOpen className="h-4 w-4 mr-2" />
            Civilisations
          </Button>
        </Link>
        <Link href="/gammes">
          <Button variant="outline" className="btn-enhanced">
            <Sparkles className="h-4 w-4 mr-2" />
            Gammes
          </Button>
        </Link>
      </div>

      {/* Voir aussi */}
      <VoirAussi 
        title="Explorer davantage"
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
            title: "Gammes",
            description: "5 univers olfactifs",
            href: "/gammes",
          },
          {
            title: "Recherche scientifique",
            description: "Publications et méthodologie",
            href: "/recherche-scientifique",
          },
        ]}
      />
    </div>
  );
}
