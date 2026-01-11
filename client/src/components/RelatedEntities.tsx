import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronRight, Beaker, Leaf, MapPin, FlaskConical, Sparkles } from "lucide-react";

type EntityType = "molecule" | "plant" | "terroir" | "recette" | "accord";

interface RelatedEntity {
  id: number;
  name: string;
  type: EntityType;
  subtitle?: string;
  badge?: string;
}

interface RelatedEntitiesProps {
  title: string;
  entities: RelatedEntity[];
  emptyMessage?: string;
  maxItems?: number;
  showViewAll?: boolean;
  viewAllHref?: string;
}

const entityConfig: Record<EntityType, { 
  icon: typeof Beaker; 
  href: (id: number) => string;
  color: string;
  bgColor: string;
}> = {
  molecule: {
    icon: Beaker,
    href: (id) => `/molecules/${id}`,
    color: "text-purple-600 dark:text-purple-400",
    bgColor: "bg-purple-100 dark:bg-purple-900/30"
  },
  plant: {
    icon: Leaf,
    href: (id) => `/plants/${id}`,
    color: "text-green-600 dark:text-green-400",
    bgColor: "bg-green-100 dark:bg-green-900/30"
  },
  terroir: {
    icon: MapPin,
    href: (id) => `/terroirs/${id}`,
    color: "text-amber-600 dark:text-amber-400",
    bgColor: "bg-amber-100 dark:bg-amber-900/30"
  },
  recette: {
    icon: FlaskConical,
    href: (id) => `/recettes/${id}`,
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-100 dark:bg-blue-900/30"
  },
  accord: {
    icon: Sparkles,
    href: (id) => `/accords/${id}`,
    color: "text-rose-600 dark:text-rose-400",
    bgColor: "bg-rose-100 dark:bg-rose-900/30"
  }
};

export function RelatedEntities({
  title,
  entities,
  emptyMessage = "Aucune entité liée",
  maxItems = 10,
  showViewAll = false,
  viewAllHref
}: RelatedEntitiesProps) {
  const displayedEntities = entities.slice(0, maxItems);
  const hasMore = entities.length > maxItems;

  if (entities.length === 0) {
    return (
      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{emptyMessage}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
          <Badge variant="secondary" className="text-xs">
            {entities.length}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {displayedEntities.map((entity) => {
          const config = entityConfig[entity.type];
          const Icon = config.icon;
          
          return (
            <Link key={`${entity.type}-${entity.id}`} href={config.href(entity.id)}>
              <div className="group flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                <div className={`w-8 h-8 rounded-lg ${config.bgColor} flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`w-4 h-4 ${config.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate group-hover:text-primary transition-colors">
                    {entity.name}
                  </p>
                  {entity.subtitle && (
                    <p className="text-xs text-muted-foreground truncate">
                      {entity.subtitle}
                    </p>
                  )}
                </div>
                {entity.badge && (
                  <Badge variant="outline" className="text-xs flex-shrink-0">
                    {entity.badge}
                  </Badge>
                )}
                <ChevronRight className="w-4 h-4 text-muted-foreground/50 group-hover:text-primary group-hover:translate-x-0.5 transition-all flex-shrink-0" />
              </div>
            </Link>
          );
        })}
        
        {(hasMore || showViewAll) && viewAllHref && (
          <Link href={viewAllHref}>
            <div className="flex items-center justify-center gap-2 p-2 mt-2 rounded-lg border border-dashed border-border/50 hover:border-primary/50 hover:bg-muted/30 transition-colors cursor-pointer">
              <span className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Voir tout ({entities.length})
              </span>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </div>
          </Link>
        )}
      </CardContent>
    </Card>
  );
}

// Composant simplifié pour une liste inline de liens
interface InlineLinksProps {
  entities: RelatedEntity[];
  separator?: string;
}

export function InlineLinks({ entities, separator = ", " }: InlineLinksProps) {
  if (entities.length === 0) return null;

  return (
    <span className="inline">
      {entities.map((entity, index) => {
        const config = entityConfig[entity.type];
        return (
          <span key={`${entity.type}-${entity.id}`}>
            <Link href={config.href(entity.id)}>
              <span className={`${config.color} hover:underline cursor-pointer`}>
                {entity.name}
              </span>
            </Link>
            {index < entities.length - 1 && separator}
          </span>
        );
      })}
    </span>
  );
}

export default RelatedEntities;
