import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import {
  FlaskConical, Leaf, MapPin, Package, Atom, BookOpen,
  ArrowRight, Network
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

// ─── Types ───────────────────────────────────────────────────────────────────

interface EntityNode {
  id: string;
  label: string;
  sublabel: string;
  icon: React.ReactNode;
  href: string;
  color: string;
  bgColor: string;
  borderColor: string;
  count?: number | string;
}

// ─── Connexions entre entités ─────────────────────────────────────────────────

const CONNECTIONS: Array<{ from: string; to: string; label: string }> = [
  { from: "molecules",       to: "plants",          label: "contenues dans" },
  { from: "plants",          to: "terroirs",        label: "cultivées sur" },
  { from: "plants",          to: "rawMaterials",    label: "donnent" },
  { from: "rawMaterials",    to: "recettes",        label: "composent" },
  { from: "molecules",       to: "recettes",        label: "caractérisent" },
  { from: "terroirs",        to: "rawMaterials",    label: "influencent" },
];

// ─── Composant principal ──────────────────────────────────────────────────────

export function EntityConnectionMap() {
  const { data: stats } = trpc.dashboard.getStats.useQuery();

  const entities: EntityNode[] = [
    {
      id: "molecules",
      label: "Molécules",
      sublabel: "Composés volatils",
      icon: <Atom className="h-5 w-5" />,
      href: "/molecules",
      color: "text-violet-400",
      bgColor: "bg-violet-950/60",
      borderColor: "border-violet-700/50",
      count: stats?.molecules,
    },
    {
      id: "plants",
      label: "Plantes",
      sublabel: "Espèces & variétés",
      icon: <Leaf className="h-5 w-5" />,
      href: "/plants",
      color: "text-emerald-400",
      bgColor: "bg-emerald-950/60",
      borderColor: "border-emerald-700/50",
      count: stats?.plants,
    },
    {
      id: "terroirs",
      label: "Terroirs",
      sublabel: "Origines géographiques",
      icon: <MapPin className="h-5 w-5" />,
      href: "/terroirs",
      color: "text-amber-400",
      bgColor: "bg-amber-950/60",
      borderColor: "border-amber-700/50",
      count: stats?.terroirs,
    },
    {
      id: "rawMaterials",
      label: "Matières premières",
      sublabel: "Extraits & essences",
      icon: <Package className="h-5 w-5" />,
      href: "/matieres-premieres",
      color: "text-orange-400",
      bgColor: "bg-orange-950/60",
      borderColor: "border-orange-700/50",
      count: stats?.rawMaterials,
    },
    {
      id: "recettes",
      label: "Recettes",
      sublabel: "Formulations olfactives",
      icon: <FlaskConical className="h-5 w-5" />,
      href: "/recettes",
      color: "text-rose-400",
      bgColor: "bg-rose-950/60",
      borderColor: "border-rose-700/50",
      count: stats?.recettes,
    },
    {
      id: "accords",
      label: "Accords",
      sublabel: "Associations olfactives",
      icon: <BookOpen className="h-5 w-5" />,
      href: "/accords",
      color: "text-sky-400",
      bgColor: "bg-sky-950/60",
      borderColor: "border-sky-700/50",
      count: stats?.accords,
    },
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-background to-muted/20">
      <div className="container">
        <div className="max-w-5xl mx-auto">
          {/* Titre */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-4">
              <Network className="h-4 w-4" />
              Architecture du projet
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">
              Six entités, un réseau vivant
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              PERFUMUM s'organise autour de six entités interconnectées.
              Chaque molécule, plante, terroir, matière première, recette et accord enrichit le réseau.
            </p>
          </div>

          {/* Grille des entités */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
            {entities.map((entity, i) => (
              <Link key={entity.id} href={entity.href}>
                <div
                  className={`entity-node reveal-up reveal-up-delay-${i + 1} group relative p-4 rounded-xl border ${entity.bgColor} ${entity.borderColor} cursor-pointer transition-all duration-300 hover:scale-[1.03] hover:shadow-lg`}
                  style={{ animationDelay: `${i * 0.08}s` }}
                >
                  {/* Icône + count */}
                  <div className="flex items-start justify-between mb-3">
                    <div className={`p-2 rounded-lg bg-background/40 ${entity.color}`}>
                      {entity.icon}
                    </div>
                    {entity.count !== undefined && (
                      <Badge variant="outline" className={`text-xs ${entity.color} border-current/30 bg-background/30`}>
                        {entity.count}
                      </Badge>
                    )}
                  </div>

                  {/* Labels */}
                  <div>
                    <div className={`font-semibold text-sm ${entity.color} group-hover:text-current transition-colors`}>
                      {entity.label}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {entity.sublabel}
                    </div>
                  </div>

                  {/* Flèche hover */}
                  <ArrowRight className={`absolute bottom-3 right-3 h-3.5 w-3.5 ${entity.color} opacity-0 group-hover:opacity-100 transition-all duration-200 group-hover:translate-x-0.5`} />
                </div>
              </Link>
            ))}
          </div>

          {/* Connexions narratives */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 mb-8">
            {CONNECTIONS.map((conn) => {
              const from = entities.find(e => e.id === conn.from);
              const to = entities.find(e => e.id === conn.to);
              if (!from || !to) return null;
              return (
                <div
                  key={`${conn.from}-${conn.to}`}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/30 border border-border/50 text-xs text-muted-foreground"
                >
                  <span className={`font-medium ${from.color}`}>{from.label}</span>
                  <span className="opacity-50">→</span>
                  <span className="italic opacity-70">{conn.label}</span>
                  <span className="opacity-50">→</span>
                  <span className={`font-medium ${to.color}`}>{to.label}</span>
                </div>
              );
            })}
          </div>

          {/* CTA réseau */}
          <div className="text-center">
            <Link href="/reseau-liaisons">
              <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary/10 border border-primary/30 text-primary text-sm font-medium hover:bg-primary/20 transition-all duration-200 hover:gap-3">
                <Network className="h-4 w-4" />
                Explorer le réseau de liaisons
                <ArrowRight className="h-4 w-4" />
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
