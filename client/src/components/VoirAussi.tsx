// @ts-nocheck
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export interface VoirAussiItem {
  title: string;
  description: string;
  href: string;
  badge?: string;
  badgeVariant?: "default" | "secondary" | "outline" | "destructive";
  icon?: React.ReactNode;
}

interface VoirAussiProps {
  title?: string;
  items: VoirAussiItem[];
  className?: string;
  variant?: "default" | "compact" | "cards";
}

export function VoirAussi({ 
  title = "Voir aussi", 
  items, 
  className,
  variant = "default" 
}: VoirAussiProps) {
  if (items.length === 0) return null;

  if (variant === "compact") {
    return (
      <div className={cn("border-t pt-8 mt-12", className)}>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          {title}
        </h3>
        <div className="flex flex-wrap gap-3">
          {items.map((item, index) => (
            <Link key={index} href={item.href}>
              <a className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors group">
                {item.icon}
                <span className="font-medium">{item.title}</span>
                <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            </Link>
          ))}
        </div>
      </div>
    );
  }

  if (variant === "cards") {
    return (
      <section className={cn("border-t pt-12 mt-16", className)}>
        <div className="container">
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
            <Sparkles className="h-6 w-6 text-primary" />
            {title}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item, index) => (
              <Link key={index} href={item.href}>
                <Card className="h-full hover:border-primary/50 transition-colors cursor-pointer group">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg group-hover:text-primary transition-colors">
                        {item.title}
                      </CardTitle>
                      {item.badge && (
                        <Badge variant={item.badgeVariant || "secondary"}>
                          {item.badge}
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                    <div className="mt-4 flex items-center gap-2 text-sm text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                      Explorer <ArrowRight className="h-4 w-4" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Default variant
  return (
    <section className={cn("border-t pt-12 mt-16 bg-muted/30", className)}>
      <div className="container py-8">
        <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
          <Sparkles className="h-6 w-6 text-primary" />
          {title}
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {items.map((item, index) => (
            <Link key={index} href={item.href}>
              <a className="block p-4 rounded-lg bg-background border hover:border-primary/50 transition-all group">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  {item.badge && (
                    <Badge variant={item.badgeVariant || "outline"} className="text-xs">
                      {item.badge}
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {item.description}
                </p>
              </a>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// Suggestions prédéfinies par contexte
export const suggestionsMolecules: VoirAussiItem[] = [
  {
    title: "Familles chimiques",
    description: "Explorer les molécules par famille chimique",
    href: "/chemical-families",
    badge: "176",
  },
  {
    title: "Comparer molécules",
    description: "Outil de comparaison avancé",
    href: "/compare-molecules-advanced",
  },
  {
    title: "Matrice synergies",
    description: "Visualiser les interactions moléculaires",
    href: "/matrice-synergies",
  },
  {
    title: "Graphe interactif",
    description: "Réseau molécules-recettes",
    href: "/graphe-molecules-recettes",
  },
];

export const suggestionsRecettes: VoirAussiItem[] = [
  {
    title: "Gammes olfactives",
    description: "Découvrir les 7 gammes du projet",
    href: "/gammes",
    badge: "7 gammes",
  },
  {
    title: "Protocoles maturation",
    description: "Temps de cure et conditions optimales",
    href: "/protocoles-maturation",
  },
  {
    title: "Laboratoire",
    description: "Outils de formulation et R&D",
    href: "/laboratoire",
  },
  {
    title: "Fournisseurs",
    description: "12 fournisseurs référencés",
    href: "/fournisseurs",
    badge: "12",
  },
];

export const suggestionsGammes: VoirAussiItem[] = [
  {
    title: "Toutes les recettes",
    description: "Base de données complète des 195 recettes",
    href: "/recettes",
    badge: "195",
  },
  {
    title: "Prototypes CBD",
    description: "4 prototypes de résines aromatisées",
    href: "/prototypes",
    badge: "4",
  },
  {
    title: "Résines CBD",
    description: "Programme de recherche principal",
    href: "/resines-cbd",
  },
  {
    title: "Signatures",
    description: "3 profils d'exception",
    href: "/gammes/signatures",
    badge: "NEW",
  },
];

export const suggestionsRecherche: VoirAussiItem[] = [
  {
    title: "Synergies moléculaires",
    description: "Interactions et potentialisation",
    href: "/recherche-scientifique/synergies-moleculaires",
  },
  {
    title: "Chimie du tabac",
    description: "Esters aromatiques et acides gras",
    href: "/chimie-tabac",
  },
  {
    title: "Pyrolyse & combustion",
    description: "Dégradation thermique des terpènes",
    href: "/recherche-scientifique/pyrolyse-combustion",
  },
  {
    title: "Modèles GC-MS",
    description: "Analyse chromatographique",
    href: "/recherche-scientifique/modeles-analytiques-gcms",
  },
];
