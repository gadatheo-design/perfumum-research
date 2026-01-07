import { Link } from "wouter";
import { useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  Beaker,
  Leaf,
  FlaskConical,
  BookOpen,
  MapPin,
  Network,
  Sparkles,
  ArrowRight,
  Compass,
  GitBranch,
} from "lucide-react";

// Types de contexte pour les suggestions
export type ContextType = "molecule" | "plant" | "recette" | "reference" | "general";

interface ExplorerAussiProps {
  /** Type de contexte actuel */
  context: ContextType;
  /** ID de l'entité actuelle (pour les suggestions liées) */
  entityId?: number;
  /** Famille olfactive pour filtrer les suggestions */
  family?: string;
  /** Catégorie pour filtrer les suggestions */
  category?: string;
  /** Classes CSS additionnelles */
  className?: string;
  /** Titre personnalisé */
  title?: string;
  /** Nombre maximum de suggestions */
  maxItems?: number;
}

interface Suggestion {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  badge?: string;
  badgeVariant?: "default" | "secondary" | "outline";
  priority: number;
}

// Suggestions statiques par contexte
const staticSuggestions: Record<ContextType, Suggestion[]> = {
  molecule: [
    {
      title: "Graphe de Relations",
      description: "Visualiser les connexions entre molécules et plantes",
      href: "/graphe-relations",
      icon: <Network className="h-4 w-4" />,
      badge: "Interactif",
      priority: 1,
    },
    {
      title: "Matrice Synergies",
      description: "Explorer les interactions moléculaires",
      href: "/matrice-synergies",
      icon: <GitBranch className="h-4 w-4" />,
      priority: 2,
    },
    {
      title: "Familles Chimiques",
      description: "Classification par structure",
      href: "/chemical-families",
      icon: <Beaker className="h-4 w-4" />,
      priority: 3,
    },
    {
      title: "Plantes Sources",
      description: "Origines botaniques des molécules",
      href: "/plants",
      icon: <Leaf className="h-4 w-4" />,
      priority: 4,
    },
  ],
  plant: [
    {
      title: "Graphe de Relations",
      description: "Réseau plantes-molécules-recettes",
      href: "/graphe-relations",
      icon: <Network className="h-4 w-4" />,
      badge: "Interactif",
      priority: 1,
    },
    {
      title: "Terroirs",
      description: "Origines géographiques",
      href: "/terroirs",
      icon: <MapPin className="h-4 w-4" />,
      priority: 2,
    },
    {
      title: "Carte GPS",
      description: "Localisation des plantes",
      href: "/carte-plantes-gps",
      icon: <Compass className="h-4 w-4" />,
      priority: 3,
    },
    {
      title: "Molécules",
      description: "Composés aromatiques",
      href: "/molecules",
      icon: <Beaker className="h-4 w-4" />,
      priority: 4,
    },
  ],
  recette: [
    {
      title: "Graphe Réseau",
      description: "Connexions entre recettes",
      href: "/recipe-network",
      icon: <Network className="h-4 w-4" />,
      priority: 1,
    },
    {
      title: "Comparateur",
      description: "Comparer les profils olfactifs",
      href: "/compare",
      icon: <GitBranch className="h-4 w-4" />,
      priority: 2,
    },
    {
      title: "Gammes",
      description: "Collections thématiques",
      href: "/gammes",
      icon: <Sparkles className="h-4 w-4" />,
      priority: 3,
    },
    {
      title: "Molécules",
      description: "Ingrédients disponibles",
      href: "/molecules",
      icon: <Beaker className="h-4 w-4" />,
      priority: 4,
    },
  ],
  reference: [
    {
      title: "Bibliographie",
      description: "Toutes les références",
      href: "/bibliographie",
      icon: <BookOpen className="h-4 w-4" />,
      priority: 1,
    },
    {
      title: "Export BibTeX",
      description: "Exporter les citations",
      href: "/export-bibliographique",
      icon: <BookOpen className="h-4 w-4" />,
      priority: 2,
    },
    {
      title: "Plantes Documentées",
      description: "Sources botaniques",
      href: "/plants",
      icon: <Leaf className="h-4 w-4" />,
      priority: 3,
    },
  ],
  general: [
    {
      title: "Recherche Avancée",
      description: "Filtres multi-critères",
      href: "/recherche-avancee",
      icon: <Compass className="h-4 w-4" />,
      priority: 1,
    },
    {
      title: "Graphe de Relations",
      description: "Explorer les connexions",
      href: "/graphe-relations",
      icon: <Network className="h-4 w-4" />,
      badge: "NEW",
      priority: 2,
    },
    {
      title: "Molécules",
      description: "Base moléculaire complète",
      href: "/molecules",
      icon: <Beaker className="h-4 w-4" />,
      priority: 3,
    },
    {
      title: "Recettes",
      description: "Formules olfactives",
      href: "/recettes",
      icon: <FlaskConical className="h-4 w-4" />,
      priority: 4,
    },
  ],
};

export function ExplorerAussi({
  context,
  entityId,
  family,
  category,
  className,
  title = "Explorer aussi",
  maxItems = 4,
}: ExplorerAussiProps) {
  // Récupérer des suggestions dynamiques basées sur le contexte
  const { data: similarMolecules, isLoading: isLoadingSimilar } = trpc.molecules.getSimilar.useQuery(
    { id: entityId || 0, limit: 3 },
    { enabled: context === "molecule" && !!entityId }
  );
  
  const { data: recommendations } = trpc.recommendations.similarRecettes.useQuery(
    { recetteId: entityId || 0, limit: 3 },
    { enabled: context === "recette" && !!entityId }
  );

  // Construire la liste finale de suggestions
  const suggestions = useMemo(() => {
    const result: Suggestion[] = [...staticSuggestions[context]];
    
    // Ajouter des suggestions dynamiques pour les molécules similaires
    if (context === "molecule" && similarMolecules && similarMolecules.length > 0) {
      similarMolecules.slice(0, 2).forEach((mol, index) => {
        result.push({
          title: mol.name,
          description: mol.family || "Molécule similaire",
          href: `/molecule/${mol.id}`,
          icon: <Beaker className="h-4 w-4" />,
          badge: "Similaire",
          badgeVariant: "outline",
          priority: 10 + index,
        });
      });
    }
    
    // Ajouter des suggestions dynamiques pour les recettes similaires
    if (context === "recette" && recommendations && recommendations.length > 0) {
      recommendations.slice(0, 2).forEach((rec: any, index: number) => {
        result.push({
          title: rec.name,
          description: rec.category || "Recette similaire",
          href: `/recette/${rec.id}`,
          icon: <FlaskConical className="h-4 w-4" />,
          badge: "Similaire",
          badgeVariant: "outline",
          priority: 10 + index,
        });
      });
    }
    
    // Trier par priorité et limiter
    return result
      .sort((a, b) => a.priority - b.priority)
      .slice(0, maxItems);
  }, [context, similarMolecules, recommendations, maxItems]);

  if (isLoadingSimilar) {
    return (
      <Card className={cn("mt-8", className)}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Sparkles className="h-5 w-5 text-primary" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-24 rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("mt-8 border-dashed", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Sparkles className="h-5 w-5 text-primary" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {suggestions.map((suggestion, index) => (
            <Link key={index} href={suggestion.href}>
              <div className="group p-3 rounded-lg border bg-card hover:bg-muted/50 hover:border-primary/30 transition-all cursor-pointer h-full">
                <div className="flex items-start justify-between mb-2">
                  <div className="p-1.5 rounded-md bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    {suggestion.icon}
                  </div>
                  {suggestion.badge && (
                    <Badge variant={suggestion.badgeVariant || "secondary"} className="text-[10px]">
                      {suggestion.badge}
                    </Badge>
                  )}
                </div>
                <h4 className="font-medium text-sm group-hover:text-primary transition-colors line-clamp-1">
                  {suggestion.title}
                </h4>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                  {suggestion.description}
                </p>
                <div className="flex items-center gap-1 text-xs text-primary mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>Explorer</span>
                  <ArrowRight className="h-3 w-3" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Composant compact pour les sidebars
export function ExplorerAussiCompact({
  context,
  entityId,
  className,
  maxItems = 3,
}: Omit<ExplorerAussiProps, "title">) {
  const suggestions = staticSuggestions[context].slice(0, maxItems);

  return (
    <div className={cn("space-y-2", className)}>
      <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
        <Compass className="h-4 w-4" />
        Explorer aussi
      </h4>
      <div className="space-y-1">
        {suggestions.map((suggestion, index) => (
          <Link key={index} href={suggestion.href}>
            <div className="flex items-center gap-2 p-2 rounded-md hover:bg-muted transition-colors cursor-pointer group">
              <div className="text-muted-foreground group-hover:text-primary transition-colors">
                {suggestion.icon}
              </div>
              <span className="text-sm group-hover:text-primary transition-colors">
                {suggestion.title}
              </span>
              <ArrowRight className="h-3 w-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
