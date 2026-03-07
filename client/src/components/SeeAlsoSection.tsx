import { Link } from "wouter";
import { motion } from "framer-motion";
import { 
  ArrowRight, Atom, Leaf, MapPin, Package, FlaskConical, 
  BookOpen, Dna, Beaker, Network, Sparkles
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

export type SeeAlsoEntityType = 
  | "molecule" | "plant" | "terroir" | "rawMaterial" 
  | "recette" | "accord" | "variety" | "glossaire";

/** Interface originale (rétrocompatible) */
export interface SeeAlsoItem {
  id: number | string;
  label: string;
  sublabel?: string;
  href: string;
  type: SeeAlsoEntityType;
}

/** Interface enrichie pour les groupes */
export interface SeeAlsoGroup {
  label: string;
  type: SeeAlsoEntityType;
  items: SeeAlsoItem[];
  viewAllHref?: string;
  viewAllLabel?: string;
}

interface SeeAlsoSectionProps {
  /** Mode liste plate (rétrocompatible) */
  items?: SeeAlsoItem[];
  /** Mode groupes par type */
  groups?: SeeAlsoGroup[];
  title?: string;
  className?: string;
}

// ─── Config par type ──────────────────────────────────────────────────────────

const TYPE_CONFIG: Record<SeeAlsoEntityType, {
  icon: React.ReactNode;
  color: string;
  bg: string;
  border: string;
  hoverBorder: string;
  hoverBg: string;
  dotColor: string;
}> = {
  molecule: {
    icon: <Atom className="h-4 w-4" />,
    color: "text-violet-400",
    bg: "bg-violet-950/40",
    border: "border-violet-700/40",
    hoverBorder: "hover:border-violet-500/60",
    hoverBg: "hover:bg-violet-950/60",
    dotColor: "bg-violet-400",
  },
  plant: {
    icon: <Leaf className="h-4 w-4" />,
    color: "text-emerald-400",
    bg: "bg-emerald-950/40",
    border: "border-emerald-700/40",
    hoverBorder: "hover:border-emerald-500/60",
    hoverBg: "hover:bg-emerald-950/60",
    dotColor: "bg-emerald-400",
  },
  terroir: {
    icon: <MapPin className="h-4 w-4" />,
    color: "text-amber-400",
    bg: "bg-amber-950/40",
    border: "border-amber-700/40",
    hoverBorder: "hover:border-amber-500/60",
    hoverBg: "hover:bg-amber-950/60",
    dotColor: "bg-amber-400",
  },
  rawMaterial: {
    icon: <Package className="h-4 w-4" />,
    color: "text-orange-400",
    bg: "bg-orange-950/40",
    border: "border-orange-700/40",
    hoverBorder: "hover:border-orange-500/60",
    hoverBg: "hover:bg-orange-950/60",
    dotColor: "bg-orange-400",
  },
  recette: {
    icon: <FlaskConical className="h-4 w-4" />,
    color: "text-rose-400",
    bg: "bg-rose-950/40",
    border: "border-rose-700/40",
    hoverBorder: "hover:border-rose-500/60",
    hoverBg: "hover:bg-rose-950/60",
    dotColor: "bg-rose-400",
  },
  accord: {
    icon: <BookOpen className="h-4 w-4" />,
    color: "text-sky-400",
    bg: "bg-sky-950/40",
    border: "border-sky-700/40",
    hoverBorder: "hover:border-sky-500/60",
    hoverBg: "hover:bg-sky-950/60",
    dotColor: "bg-sky-400",
  },
  variety: {
    icon: <Dna className="h-4 w-4" />,
    color: "text-teal-400",
    bg: "bg-teal-950/40",
    border: "border-teal-700/40",
    hoverBorder: "hover:border-teal-500/60",
    hoverBg: "hover:bg-teal-950/60",
    dotColor: "bg-teal-400",
  },
  glossaire: {
    icon: <Beaker className="h-4 w-4" />,
    color: "text-indigo-400",
    bg: "bg-indigo-950/40",
    border: "border-indigo-700/40",
    hoverBorder: "hover:border-indigo-500/60",
    hoverBg: "hover:bg-indigo-950/60",
    dotColor: "bg-indigo-400",
  },
};

// ─── Carte individuelle ───────────────────────────────────────────────────────

function SeeAlsoCard({ item }: { item: SeeAlsoItem }) {
  const config = TYPE_CONFIG[item.type] || TYPE_CONFIG.molecule;
  return (
    <Link href={item.href}>
      <motion.div
        whileHover={{ y: -2, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.15 }}
        className={`
          group relative flex items-start gap-2.5 p-3 rounded-xl border cursor-pointer
          transition-all duration-200
          ${config.bg} ${config.border} ${config.hoverBorder} ${config.hoverBg}
          hover:shadow-lg hover:shadow-black/20
        `}
      >
        <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${config.dotColor} opacity-60 group-hover:opacity-100 transition-opacity`} />
        <div className="flex-1 min-w-0">
          <div className={`text-sm font-medium ${config.color} group-hover:brightness-125 transition-all truncate`}>
            {item.label}
          </div>
          {item.sublabel && (
            <div className="text-xs text-zinc-500 mt-0.5 truncate">{item.sublabel}</div>
          )}
        </div>
        <ArrowRight className={`h-3.5 w-3.5 flex-shrink-0 mt-0.5 ${config.color} opacity-0 group-hover:opacity-100 transition-all duration-200 group-hover:translate-x-0.5`} />
      </motion.div>
    </Link>
  );
}

// ─── Bloc de groupe ───────────────────────────────────────────────────────────

function SeeAlsoGroupBlock({ group, index }: { group: SeeAlsoGroup; index: number }) {
  const config = TYPE_CONFIG[group.type] || TYPE_CONFIG.molecule;
  const displayItems = group.items.slice(0, 8);
  const hasMore = group.items.length > 8;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="space-y-3"
    >
      {/* En-tête du groupe */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`${config.color} opacity-80`}>{config.icon}</span>
          <h4 className={`text-sm font-semibold ${config.color}`}>{group.label}</h4>
          <span className="text-xs text-zinc-600 font-mono">{group.items.length}</span>
        </div>
        {group.viewAllHref && (
          <Link href={group.viewAllHref}>
            <span className={`text-xs ${config.color} hover:underline flex items-center gap-1 opacity-60 hover:opacity-100 transition-opacity`}>
              {group.viewAllLabel || "Voir tout"}
              <ArrowRight className="w-3 h-3" />
            </span>
          </Link>
        )}
      </div>

      {/* Grille de cartes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {displayItems.map((item) => (
          <SeeAlsoCard key={`${item.type}-${item.id}`} item={item} />
        ))}
      </div>

      {hasMore && group.viewAllHref && (
        <Link href={group.viewAllHref}>
          <span className={`text-xs ${config.color} hover:underline opacity-50 hover:opacity-80 transition-opacity`}>
            + {group.items.length - 8} autres…
          </span>
        </Link>
      )}
    </motion.div>
  );
}

// ─── Composant principal ──────────────────────────────────────────────────────

export function SeeAlsoSection({ items, groups, title = "Voir aussi", className = "" }: SeeAlsoSectionProps) {
  // Mode groupes
  if (groups && groups.length > 0) {
    const nonEmptyGroups = groups.filter((g) => g.items.length > 0);
    if (nonEmptyGroups.length === 0) return null;

    return (
      <section className={`border-t border-zinc-800/60 pt-10 pb-6 ${className}`}>
        <div className="max-w-5xl mx-auto px-4">
          {/* En-tête de section */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-3 mb-8"
          >
            <Network className="w-4 h-4 text-zinc-600" />
            <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">
              {title}
            </h3>
            <div className="flex-1 h-px bg-zinc-800/60" />
            <Sparkles className="w-3.5 h-3.5 text-zinc-700" />
          </motion.div>

          {/* Grille de groupes */}
          <div className={`grid gap-8 ${
            nonEmptyGroups.length === 1
              ? "grid-cols-1 max-w-lg"
              : nonEmptyGroups.length === 2
                ? "grid-cols-1 md:grid-cols-2"
                : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
          }`}>
            {nonEmptyGroups.map((group, i) => (
              <SeeAlsoGroupBlock key={group.type} group={group} index={i} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Mode liste plate (rétrocompatible)
  if (!items || items.length === 0) return null;

  return (
    <section className={`mt-12 pt-8 border-t border-zinc-800 ${className}`}>
      <div className="max-w-5xl mx-auto px-4">
        <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-widest mb-4">
          {title}
        </h3>
        <div className="flex flex-wrap gap-2">
          {items.map((item) => {
            const config = TYPE_CONFIG[item.type] || TYPE_CONFIG.molecule;
            return (
              <Link key={`${item.type}-${item.id}`} href={item.href}>
                <div
                  className={`
                    inline-flex items-center gap-2 px-3 py-2 rounded-lg border
                    ${config.bg} ${config.border} ${config.hoverBorder} ${config.hoverBg}
                    transition-all duration-200 cursor-pointer
                    hover:scale-[1.02] hover:-translate-y-0.5 hover:shadow-md
                    group
                  `}
                >
                  <span className={config.color}>{config.icon}</span>
                  <div>
                    <div className={`text-sm font-medium ${config.color} group-hover:brightness-125 transition-all`}>
                      {item.label}
                    </div>
                    {item.sublabel && (
                      <div className="text-xs text-zinc-500 mt-0.5">{item.sublabel}</div>
                    )}
                  </div>
                  <ArrowRight className={`h-3.5 w-3.5 ${config.color} opacity-0 group-hover:opacity-100 transition-all duration-200 group-hover:translate-x-0.5`} />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
