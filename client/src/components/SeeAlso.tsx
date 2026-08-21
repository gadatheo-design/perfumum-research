import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, ArrowRight, Atom, FlaskConical, Leaf, MapPin, Package, Eye } from "lucide-react";

// Types pour les différents éléments liés
type ItemType = "molecule" | "recette" | "plant" | "terroir" | "rawMaterial";

interface SeeAlsoItem {
  id: number;
  name: string;
  type: ItemType;
  subtitle?: string;
  badge?: string;
}

// Configuration des types d'éléments
const typeConfig: Record<ItemType, { 
  icon: React.ReactNode; 
  path: string; 
  color: string;
  label: string;
}> = {
  molecule: { 
    icon: <Atom className="h-4 w-4" />, 
    path: "/molecules", 
    color: "text-purple-500",
    label: "Molécule"
  },
  recette: { 
    icon: <FlaskConical className="h-4 w-4" />, 
    path: "/recettes", 
    color: "text-green-500",
    label: "Recette"
  },
  plant: { 
    icon: <Leaf className="h-4 w-4" />, 
    path: "/plants", 
    color: "text-emerald-500",
    label: "Plante"
  },
  terroir: { 
    icon: <MapPin className="h-4 w-4" />, 
    path: "/terroirs", 
    color: "text-amber-500",
    label: "Terroir"
  },
  rawMaterial: { 
    icon: <Package className="h-4 w-4" />, 
    path: "/raw-materials", 
    color: "text-blue-500",
    label: "Matière première"
  },
};

// Composant principal SeeAlso
interface SeeAlsoProps {
  title: string;
  items: SeeAlsoItem[];
  isLoading?: boolean;
  emptyMessage?: string;
  maxItems?: number;
}

export function SeeAlso({ 
  title, 
  items, 
  isLoading, 
  emptyMessage = "Aucun élément lié",
  maxItems = 5 
}: SeeAlsoProps) {
  const displayItems = items.slice(0, maxItems);
  
  return (
    <Card className="bg-card border shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Eye className="h-5 w-5 text-primary" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-6">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : displayItems.length > 0 ? (
          <div className="space-y-2">
            {displayItems.map((item) => {
              const config = typeConfig[item.type];
              return (
                <Link key={`${item.type}-${item.id}`} href={`${config.path}/${item.id}`}>
                  <div className="group flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`${config.color} shrink-0`}>
                        {config.icon}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-sm truncate group-hover:text-primary transition-colors">
                          {item.name}
                        </p>
                        {item.subtitle && (
                          <p className="text-xs text-muted-foreground truncate">
                            {item.subtitle}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {item.badge && (
                        <Badge variant="outline" className="text-xs">
                          {item.badge}
                        </Badge>
                      )}
                      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </div>
                </Link>
              );
            })}
            {items.length > maxItems && (
              <p className="text-xs text-muted-foreground text-center pt-2">
                + {items.length - maxItems} autres éléments
              </p>
            )}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">
            {emptyMessage}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

// Composant pour afficher les liens croisés vers les recettes
interface LinkedRecettesProps {
  recettes: Array<{
    id: number;
    name: string;
    category?: string | null;
    description?: string | null;
    proportion?: number | string | null;
    role?: string | null;
    [key: string]: any;
  }>;
  isLoading?: boolean;
  title?: string;
}

export function LinkedRecettes({ recettes, isLoading, title = "Recettes utilisant cette molécule" }: LinkedRecettesProps) {
  const items: SeeAlsoItem[] = recettes.map(r => ({
    id: r.id,
    name: r.name,
    type: "recette" as const,
    subtitle: r.category || r.description?.slice(0, 50) || undefined,
    badge: r.proportion ? `${r.proportion}%` : undefined,
  }));

  return (
    <SeeAlso 
      title={title} 
      items={items} 
      isLoading={isLoading}
      emptyMessage="Aucune recette liée"
    />
  );
}

// Composant pour afficher les liens croisés vers les molécules
interface LinkedMoleculesProps {
  molecules: Array<{
    id?: number;
    name?: string;
    family?: string | null;
    proportion?: number | string | null;
    role?: string | null;
    molecule?: {
      id: number;
      name: string;
      family?: string | null;
      chemicalClass?: string | null;
    };
    percentage?: string | null;
    [key: string]: any;
  }>;
  isLoading?: boolean;
  title?: string;
}

export function LinkedMolecules({ molecules, isLoading, title = "Molécules liées" }: LinkedMoleculesProps) {
  const items: SeeAlsoItem[] = molecules.map(m => {
    // Gérer le cas où la molécule est imbriquée ou directe
    const mol = m.molecule || m;
    const id = mol.id || m.id || 0;
    const name = mol.name || m.name || "Molécule inconnue";
    const family = mol.family || m.family;
    const chemicalClass = mol.chemicalClass || m.chemicalClass;
    const proportion = m.proportion || m.percentage;
    
    return {
      id,
      name,
      type: "molecule" as const,
      subtitle: family || chemicalClass || undefined,
      badge: proportion ? `${proportion}%` : (m.percentageTypical ? `${m.percentageTypical}%` : undefined),
    };
  });

  return (
    <SeeAlso 
      title={title} 
      items={items} 
      isLoading={isLoading}
      emptyMessage="Aucune molécule liée"
    />
  );
}

// Composant pour afficher les liens croisés vers les plantes
interface LinkedPlantsProps {
  plants: Array<{
    id: number;
    name: string;
    latinName?: string | null;
    family?: string | null;
    category?: string | null;
  }>;
  isLoading?: boolean;
  title?: string;
}

export function LinkedPlants({ plants, isLoading, title = "Plantes liées" }: LinkedPlantsProps) {
  const items: SeeAlsoItem[] = plants.map(p => ({
    id: p.id,
    name: p.name,
    type: "plant" as const,
    subtitle: p.latinName || p.family || undefined,
    badge: p.category || undefined,
  }));

  return (
    <SeeAlso 
      title={title} 
      items={items} 
      isLoading={isLoading}
      emptyMessage="Aucune plante liée"
    />
  );
}

// Composant pour afficher les liens croisés vers les terroirs
interface LinkedTerroirsProps {
  terroirs: Array<{
    id: number;
    name: string;
    country?: string | null;
    region?: string | null;
    climateType?: string | null;
  }>;
  isLoading?: boolean;
  title?: string;
}

export function LinkedTerroirs({ terroirs, isLoading, title = "Terroirs liés" }: LinkedTerroirsProps) {
  const items: SeeAlsoItem[] = terroirs.map(t => ({
    id: t.id,
    name: t.name,
    type: "terroir" as const,
    subtitle: [t.region, t.country].filter(Boolean).join(", ") || undefined,
    badge: t.climateType || undefined,
  }));

  return (
    <SeeAlso 
      title={title} 
      items={items} 
      isLoading={isLoading}
      emptyMessage="Aucun terroir lié"
    />
  );
}

// Composant générique pour afficher du contenu similaire
interface SimilarContentProps<T extends { id: number; name: string }> {
  items: T[];
  type: ItemType;
  isLoading?: boolean;
  getSubtitle?: (item: T) => string | undefined;
  getBadge?: (item: T) => string | undefined;
  title?: string;
}

export function SimilarContent<T extends { id: number; name: string; [key: string]: any }>({ 
  items, 
  type, 
  isLoading,
  getSubtitle,
  getBadge,
  title = "Voir aussi"
}: SimilarContentProps<T>) {
  const seeAlsoItems: SeeAlsoItem[] = items.map(item => ({
    id: item.id,
    name: item.name,
    type,
    subtitle: getSubtitle?.(item),
    badge: getBadge?.(item),
  }));

  return (
    <SeeAlso 
      title={title} 
      items={seeAlsoItems} 
      isLoading={isLoading}
      emptyMessage="Aucun élément similaire"
    />
  );
}
