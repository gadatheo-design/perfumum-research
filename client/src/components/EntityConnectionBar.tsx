// @ts-nocheck
/**
 * EntityConnectionBar — Barre de navigation contextuelle inter-entités
 * 
 * Affiche toutes les entités liées à l'entité courante sous forme de chips cliquables,
 * groupées par type. Conçue pour être placée en bas de chaque page de détail.
 * La navigation elle-même raconte les connexions du projet PERFUMUM.
 */
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { 
  Beaker, Leaf, MapPin, FlaskConical, Sparkles, 
  Package, GitBranch, ArrowRight, Network, ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";

export type ConnectionEntityType = 
  | "molecule" 
  | "plant" 
  | "terroir" 
  | "recette" 
  | "accord" 
  | "rawMaterial" 
  | "variety";

export interface ConnectionEntity {
  id: number;
  name: string;
  type: ConnectionEntityType;
  subtitle?: string;
  badge?: string;
  count?: number;
}

export interface EntityConnectionBarProps {
  /** Entités liées, groupées automatiquement par type */
  connections: ConnectionEntity[];
  /** Classe CSS additionnelle pour le wrapper */
  className?: string;
  /** Titre de la section (défaut : "Connexions") */
  title?: string;
  /** Afficher le titre */
  showTitle?: boolean;
  /** Variante d'affichage */
  variant?: "chips" | "list" | "compact";
}

const entityConfig: Record<ConnectionEntityType, {
  icon: any;
  label: string;
  href: (id: number) => string;
  color: string;
  bgColor: string;
  borderColor: string;
  hoverBg: string;
}> = {
  molecule: {
    icon: Beaker,
    label: "Molécule",
    href: (id) => `/molecules/${id}`,
    color: "text-violet-700 dark:text-violet-300",
    bgColor: "bg-violet-50 dark:bg-violet-950/40",
    borderColor: "border-violet-200 dark:border-violet-800/50",
    hoverBg: "hover:bg-violet-100 dark:hover:bg-violet-900/40",
  },
  plant: {
    icon: Leaf,
    label: "Plante",
    href: (id) => `/plants/${id}`,
    color: "text-emerald-700 dark:text-emerald-300",
    bgColor: "bg-emerald-50 dark:bg-emerald-950/40",
    borderColor: "border-emerald-200 dark:border-emerald-800/50",
    hoverBg: "hover:bg-emerald-100 dark:hover:bg-emerald-900/40",
  },
  terroir: {
    icon: MapPin,
    label: "Terroir",
    href: (id) => `/terroirs/${id}`,
    color: "text-amber-700 dark:text-amber-300",
    bgColor: "bg-amber-50 dark:bg-amber-950/40",
    borderColor: "border-amber-200 dark:border-amber-800/50",
    hoverBg: "hover:bg-amber-100 dark:hover:bg-amber-900/40",
  },
  recette: {
    icon: FlaskConical,
    label: "Recette",
    href: (id) => `/recettes/${id}`,
    color: "text-sky-700 dark:text-sky-300",
    bgColor: "bg-sky-50 dark:bg-sky-950/40",
    borderColor: "border-sky-200 dark:border-sky-800/50",
    hoverBg: "hover:bg-sky-100 dark:hover:bg-sky-900/40",
  },
  accord: {
    icon: Sparkles,
    label: "Accord",
    href: (id) => `/accords/${id}`,
    color: "text-rose-700 dark:text-rose-300",
    bgColor: "bg-rose-50 dark:bg-rose-950/40",
    borderColor: "border-rose-200 dark:border-rose-800/50",
    hoverBg: "hover:bg-rose-100 dark:hover:bg-rose-900/40",
  },
  rawMaterial: {
    icon: Package,
    label: "Matière première",
    href: (id) => `/matieres-premieres/${id}`,
    color: "text-orange-700 dark:text-orange-300",
    bgColor: "bg-orange-50 dark:bg-orange-950/40",
    borderColor: "border-orange-200 dark:border-orange-800/50",
    hoverBg: "hover:bg-orange-100 dark:hover:bg-orange-900/40",
  },
  variety: {
    icon: GitBranch,
    label: "Variété",
    href: (id) => `/varietes/${id}`,
    color: "text-teal-700 dark:text-teal-300",
    bgColor: "bg-teal-50 dark:bg-teal-950/40",
    borderColor: "border-teal-200 dark:border-teal-800/50",
    hoverBg: "hover:bg-teal-100 dark:hover:bg-teal-900/40",
  },
};

const TYPE_ORDER: ConnectionEntityType[] = [
  "molecule", "plant", "terroir", "recette", "accord", "rawMaterial", "variety"
];

function groupByType(connections: ConnectionEntity[]): Map<ConnectionEntityType, ConnectionEntity[]> {
  const map = new Map<ConnectionEntityType, ConnectionEntity[]>();
  for (const c of connections) {
    if (!map.has(c.type)) map.set(c.type, []);
    map.get(c.type)!.push(c);
  }
  return map;
}

/** Chips variant — affichage horizontal compact */
function ChipsVariant({ connections }: { connections: ConnectionEntity[] }) {
  const grouped = groupByType(connections);
  const orderedTypes = TYPE_ORDER.filter(t => grouped.has(t));

  if (orderedTypes.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-3">
      {orderedTypes.map(type => {
        const items = grouped.get(type)!;
        const config = entityConfig[type];
        const Icon = config.icon;
        const MAX_CHIPS = 5;
        const displayed = items.slice(0, MAX_CHIPS);
        const remaining = items.length - MAX_CHIPS;

        return (
          <div key={type} className="flex flex-col gap-1.5">
            {/* Type label */}
            <div className="flex items-center gap-1.5">
              <Icon className={cn("w-3.5 h-3.5", config.color)} />
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                {config.label}{items.length > 1 ? "s" : ""}
              </span>
              <Badge variant="secondary" className="h-4 px-1.5 text-[10px]">
                {items.length}
              </Badge>
            </div>
            {/* Chips */}
            <div className="flex flex-wrap gap-1.5">
              {displayed.map(entity => (
                <Link key={entity.id} href={config.href(entity.id)}>
                  <span className={cn(
                    "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border cursor-pointer transition-all duration-150",
                    config.bgColor, config.borderColor, config.hoverBg, config.color,
                    "hover:shadow-sm hover:-translate-y-px"
                  )}>
                    {entity.name}
                    {entity.badge && (
                      <span className="opacity-60 text-[10px]">{entity.badge}</span>
                    )}
                  </span>
                </Link>
              ))}
              {remaining > 0 && (
                <span className={cn(
                  "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border cursor-default",
                  config.bgColor, config.borderColor, "opacity-60", config.color
                )}>
                  +{remaining} autres
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/** List variant — affichage vertical avec sous-titres */
function ListVariant({ connections }: { connections: ConnectionEntity[] }) {
  const grouped = groupByType(connections);
  const orderedTypes = TYPE_ORDER.filter(t => grouped.has(t));

  return (
    <div className="space-y-4">
      {orderedTypes.map(type => {
        const items = grouped.get(type)!;
        const config = entityConfig[type];
        const Icon = config.icon;

        return (
          <div key={type}>
            <div className="flex items-center gap-2 mb-2">
              <div className={cn("w-6 h-6 rounded-md flex items-center justify-center", config.bgColor)}>
                <Icon className={cn("w-3.5 h-3.5", config.color)} />
              </div>
              <span className="text-sm font-semibold text-foreground">
                {config.label}{items.length > 1 ? "s" : ""}
              </span>
              <Badge variant="secondary" className="text-xs">{items.length}</Badge>
            </div>
            <div className="space-y-1 pl-8">
              {items.map(entity => (
                <Link key={entity.id} href={config.href(entity.id)}>
                  <div className={cn(
                    "group flex items-center justify-between p-2 rounded-lg border cursor-pointer transition-all duration-150",
                    config.bgColor, config.borderColor, config.hoverBg
                  )}>
                    <div className="flex-1 min-w-0">
                      <span className={cn("text-sm font-medium group-hover:underline", config.color)}>
                        {entity.name}
                      </span>
                      {entity.subtitle && (
                        <span className="ml-2 text-xs text-muted-foreground">{entity.subtitle}</span>
                      )}
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/50 group-hover:text-current group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/** Compact variant — une seule ligne de chips sans groupement */
function CompactVariant({ connections }: { connections: ConnectionEntity[] }) {
  const MAX = 8;
  const displayed = connections.slice(0, MAX);
  const remaining = connections.length - MAX;

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {displayed.map(entity => {
        const config = entityConfig[entity.type];
        const Icon = config.icon;
        return (
          <Link key={`${entity.type}-${entity.id}`} href={config.href(entity.id)}>
            <span className={cn(
              "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border cursor-pointer transition-all",
              config.bgColor, config.borderColor, config.hoverBg, config.color
            )}>
              <Icon className="w-3 h-3" />
              {entity.name}
            </span>
          </Link>
        );
      })}
      {remaining > 0 && (
        <span className="text-xs text-muted-foreground">+{remaining}</span>
      )}
    </div>
  );
}

export function EntityConnectionBar({
  connections,
  className,
  title = "Connexions",
  showTitle = true,
  variant = "chips",
}: EntityConnectionBarProps) {
  if (!connections || connections.length === 0) return null;

  return (
    <section className={cn("border-t border-border/50 pt-6 mt-8", className)}>
      {showTitle && (
        <div className="flex items-center gap-2 mb-4">
          <Network className="w-4 h-4 text-muted-foreground" />
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            {title}
          </h3>
          <Badge variant="outline" className="text-xs">{connections.length}</Badge>
        </div>
      )}
      {variant === "chips" && <ChipsVariant connections={connections} />}
      {variant === "list" && <ListVariant connections={connections} />}
      {variant === "compact" && <CompactVariant connections={connections} />}
    </section>
  );
}

export default EntityConnectionBar;
