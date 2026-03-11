// @ts-nocheck
import { useState } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Network,
  GitCompare,
  Sparkles,
  BarChart3,
} from "lucide-react";

interface NavigationItem {
  id: number;
  label: string;
  path: string;
}

interface QuickLink {
  label: string;
  path: string;
  icon: React.ReactNode;
}

interface Statistic {
  label: string;
  value: string | number;
  path?: string;
}

interface DetailSidebarProps {
  // Navigation séquentielle
  currentId: number;
  items: NavigationItem[];
  basePath: string; // ex: "/terpene"
  
  // Liens rapides
  quickLinks?: QuickLink[];
  
  // Statistiques
  statistics?: Statistic[];
  
  // Contrôle affichage
  className?: string;
}

export function DetailSidebar({
  currentId,
  items,
  basePath,
  quickLinks = [],
  statistics = [],
  className = "",
}: DetailSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  // Trouver l'index actuel
  const currentIndex = items.findIndex(item => item.id === currentId);
  const previousItem = currentIndex > 0 ? items[currentIndex - 1] : null;
  const nextItem = currentIndex < items.length - 1 ? items[currentIndex + 1] : null;
  
  if (isCollapsed) {
    return (
      <div className={`fixed right-4 top-1/2 -translate-y-1/2 z-40 ${className}`}>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsCollapsed(false)}
          className="shadow-lg"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </div>
    );
  }
  
  return (
    <div className={`fixed right-4 top-24 w-64 z-40 space-y-4 ${className}`}>
      {/* Navigation Séquentielle */}
      <Card className="shadow-lg">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold">Navigation</CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsCollapsed(true)}
              className="h-6 w-6"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          {/* Précédent */}
          {previousItem ? (
            <Link href={`${basePath}/${previousItem.id}`}>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <ChevronUp className="mr-2 h-4 w-4" />
                <span className="truncate">{previousItem.label}</span>
              </Button>
            </Link>
          ) : (
            <Button variant="outline" size="sm" className="w-full justify-start" disabled>
              <ChevronUp className="mr-2 h-4 w-4" />
              <span className="text-muted-foreground">Début</span>
            </Button>
          )}
          
          {/* Actuel */}
          <div className="px-3 py-2 bg-primary/10 rounded-md text-sm font-medium text-center">
            {items[currentIndex]?.label || "Actuel"}
          </div>
          
          {/* Suivant */}
          {nextItem ? (
            <Link href={`${basePath}/${nextItem.id}`}>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <ChevronDown className="mr-2 h-4 w-4" />
                <span className="truncate">{nextItem.label}</span>
              </Button>
            </Link>
          ) : (
            <Button variant="outline" size="sm" className="w-full justify-start" disabled>
              <ChevronDown className="mr-2 h-4 w-4" />
              <span className="text-muted-foreground">Fin</span>
            </Button>
          )}
          
          <div className="text-xs text-muted-foreground text-center pt-2">
            {currentIndex + 1} / {items.length}
          </div>
        </CardContent>
      </Card>
      
      {/* Liens Rapides */}
      {quickLinks.length > 0 && (
        <Card className="shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Liens rapides</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            {quickLinks.map((link, index) => (
              <Link key={index} href={link.path}>
                <Button variant="ghost" size="sm" className="w-full justify-start">
                  {link.icon}
                  <span className="ml-2 truncate">{link.label}</span>
                </Button>
              </Link>
            ))}
          </CardContent>
        </Card>
      )}
      
      {/* Statistiques */}
      {statistics.length > 0 && (
        <Card className="shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Statistiques</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {statistics.map((stat, index) => (
              <div key={index}>
                {stat.path ? (
                  <Link href={stat.path}>
                    <div className="flex items-center justify-between hover:bg-muted/50 p-2 rounded cursor-pointer transition-colors">
                      <span className="text-sm text-muted-foreground">{stat.label}</span>
                      <Badge variant="secondary">{stat.value}</Badge>
                    </div>
                  </Link>
                ) : (
                  <div className="flex items-center justify-between p-2">
                    <span className="text-sm text-muted-foreground">{stat.label}</span>
                    <Badge variant="secondary">{stat.value}</Badge>
                  </div>
                )}
                {index < statistics.length - 1 && <Separator className="mt-3" />}
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Helper pour générer les liens rapides par défaut pour terpènes
export function getTerpeneQuickLinks(terpeneId: number): QuickLink[] {
  return [
    {
      label: "Voir dans graphe",
      path: "/graphe-molecules-recettes",
      icon: <Network className="h-4 w-4" />,
    },
    {
      label: "Comparer",
      path: "/compare-terpenes",
      icon: <GitCompare className="h-4 w-4" />,
    },
    {
      label: "Synergies",
      path: "/matrice-synergies",
      icon: <Sparkles className="h-4 w-4" />,
    },
    {
      label: "Profil radar",
      path: "/compare-radar",
      icon: <BarChart3 className="h-4 w-4" />,
    },
  ];
}

// Helper pour générer les liens rapides par défaut pour recettes
export function getRecetteQuickLinks(recetteId: number): QuickLink[] {
  return [
    {
      label: "Voir dans graphe",
      path: "/graphe-molecules-recettes",
      icon: <Network className="h-4 w-4" />,
    },
    {
      label: "Toutes les recettes",
      path: "/resines-cbd",
      icon: <BarChart3 className="h-4 w-4" />,
    },
  ];
}
