import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import {
  Atom,
  Leaf,
  FlaskConical,
  Layers,
  BarChart3,
  Waves,
  GitCompare,
  Microscope,
  Dna,
  ArrowRight,
  Scale,
  Beaker,
} from "lucide-react";

interface ComparatorEntry {
  category: string;
  title: string;
  description: string;
  icon: React.ElementType;
  href: string;
  color: string;
  bgColor: string;
  badge?: string;
}

const comparators: ComparatorEntry[] = [
  // ── Molécules ──────────────────────────────────────────────────────────────
  {
    category: "Molécules",
    title: "Comparaison Molécules",
    description: "Comparer côte à côte les profils olfactifs, propriétés chimiques et usages de plusieurs molécules.",
    icon: Atom,
    href: "/comparaison-molecules",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    category: "Molécules",
    title: "Comparaison Avancée",
    description: "Outil avancé de comparaison moléculaire avec filtres, scores de similarité et export.",
    icon: Atom,
    href: "/compare-molecules-advanced",
    color: "text-blue-700",
    bgColor: "bg-blue-50",
    badge: "Avancé",
  },
  {
    category: "Molécules",
    title: "Comparaison Radar",
    description: "Superposer les profils radar olfactifs de plusieurs molécules sur un même graphe.",
    icon: GitCompare,
    href: "/compare-radar",
    color: "text-indigo-600",
    bgColor: "bg-indigo-50",
  },
  {
    category: "Molécules",
    title: "Comparateur Avancé",
    description: "Interface de comparaison multi-critères avec visualisations interactives.",
    icon: Scale,
    href: "/comparateur-avance",
    color: "text-violet-600",
    bgColor: "bg-violet-50",
  },
  {
    category: "Molécules",
    title: "Comparaison Générale",
    description: "Vue d'ensemble comparative des molécules de la base PERFUMUM.",
    icon: Layers,
    href: "/compare",
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
  // ── Terpènes ───────────────────────────────────────────────────────────────
  {
    category: "Terpènes",
    title: "Comparaison Terpènes",
    description: "Comparer les profils terpéniques de plusieurs plantes ou extraits.",
    icon: BarChart3,
    href: "/compare-terpenes",
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
  {
    category: "Terpènes",
    title: "Comparaison Terpènes (détail)",
    description: "Analyse détaillée des terpènes avec données quantitatives et graphes comparatifs.",
    icon: BarChart3,
    href: "/comparaison-terpenes",
    color: "text-green-700",
    bgColor: "bg-green-50",
  },
  {
    category: "Terpènes",
    title: "Comparaison Profils Terpéniques",
    description: "Radar comparatif des profils terpéniques issus de la base analytique.",
    icon: Waves,
    href: "/terp-profiles/compare",
    color: "text-teal-600",
    bgColor: "bg-teal-50",
  },
  // ── Plantes ────────────────────────────────────────────────────────────────
  {
    category: "Plantes",
    title: "Comparaison Plantes",
    description: "Comparer les caractéristiques botaniques, chimiques et olfactives de plusieurs plantes.",
    icon: Leaf,
    href: "/compare-plants",
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
  },
  {
    category: "Plantes",
    title: "Comparateur Landraces",
    description: "Comparer les variétés locales (landraces) par profil terpénique et origine géographique.",
    icon: Dna,
    href: "/landrace-comparator",
    color: "text-lime-600",
    bgColor: "bg-lime-50",
  },
  // ── Recettes ───────────────────────────────────────────────────────────────
  {
    category: "Recettes",
    title: "Comparaison Recettes",
    description: "Comparer les formulations olfactives : composition, gamme, notes de tête/cœur/fond.",
    icon: FlaskConical,
    href: "/compare-recettes",
    color: "text-orange-600",
    bgColor: "bg-orange-50",
  },
  // ── Extractions & Spectres ─────────────────────────────────────────────────
  {
    category: "Extractions & Spectres",
    title: "Comparaison Extractions",
    description: "Comparer les méthodes d'extraction (HE, absolue, CO₂) et leurs profils chimiques.",
    icon: Beaker,
    href: "/comparaison-extractions",
    color: "text-amber-600",
    bgColor: "bg-amber-50",
  },
  {
    category: "Extractions & Spectres",
    title: "Comparaison Spectres",
    description: "Superposer jusqu'à 3 spectres GC/MS pour analyse comparative.",
    icon: Microscope,
    href: "/compare-spectra",
    color: "text-rose-600",
    bgColor: "bg-rose-50",
  },
  // ── Muscs ──────────────────────────────────────────────────────────────────
  {
    category: "Muscs",
    title: "Muscs — Guide Comparatif",
    description: "Tableau comparatif des muscs synthétiques et naturels : odeur, persistance, réglementation.",
    icon: Layers,
    href: "/muscs-comparatif",
    color: "text-pink-600",
    bgColor: "bg-pink-50",
  },
  // ── Comparaison Avancée ────────────────────────────────────────────────────
  {
    category: "Comparaison Avancée",
    title: "Comparaison Avancée Multi-entités",
    description: "Outil de comparaison multi-entités avec filtres avancés, scores et visualisations.",
    icon: GitCompare,
    href: "/comparaison",
    color: "text-slate-600",
    bgColor: "bg-slate-50",
    badge: "Avancé",
  },
];

// Grouper par catégorie
const categories = comparators.reduce((acc, item) => {
  if (!acc[item.category]) acc[item.category] = [];
  acc[item.category].push(item);
  return acc;
}, {} as Record<string, ComparatorEntry[]>);

const categoryColors: Record<string, string> = {
  "Molécules": "border-blue-200 bg-blue-50/30",
  "Terpènes": "border-green-200 bg-green-50/30",
  "Plantes": "border-emerald-200 bg-emerald-50/30",
  "Recettes": "border-orange-200 bg-orange-50/30",
  "Extractions & Spectres": "border-amber-200 bg-amber-50/30",
  "Muscs": "border-pink-200 bg-pink-50/30",
  "Comparaison Avancée": "border-slate-200 bg-slate-50/30",
};

export default function ComparateurHub() {
  return (
    <div className="min-h-screen flex flex-col">
      <Breadcrumbs />
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="py-16 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/20 dark:via-indigo-950/20 dark:to-purple-950/20">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <GitCompare className="w-8 h-8 text-blue-600" />
                <h1 className="text-4xl font-bold">Hub Comparateur</h1>
              </div>
              <p className="text-lg text-muted-foreground">
                Tous les outils de comparaison PERFUMUM — molécules, terpènes, plantes, recettes,
                extractions et spectres — réunis en un seul endroit.
              </p>
              <div className="flex items-center justify-center gap-2 mt-4 text-sm text-muted-foreground">
                <span className="px-2 py-1 bg-background rounded-full border">{comparators.length} outils</span>
                <span className="px-2 py-1 bg-background rounded-full border">{Object.keys(categories).length} catégories</span>
              </div>
            </div>
          </div>
        </section>

        {/* Grille par catégorie */}
        <section className="py-16">
          <div className="container">
            <div className="max-w-6xl mx-auto space-y-12">
              {Object.entries(categories).map(([category, items]) => (
                <div key={category}>
                  <div className={`rounded-xl border p-6 ${categoryColors[category] || "border-border bg-muted/20"}`}>
                    <h2 className="text-xl font-bold mb-6">{category}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {items.map((item, index) => {
                        const Icon = item.icon;
                        return (
                          <Card
                            key={index}
                            className="bg-background transition-all hover:shadow-md hover:-translate-y-0.5 duration-200"
                          >
                            <CardHeader className="pb-2">
                              <div className="flex items-start justify-between">
                                <div className={`p-2 rounded-lg ${item.bgColor}`}>
                                  <Icon className={`w-5 h-5 ${item.color}`} />
                                </div>
                                {item.badge && (
                                  <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full font-medium">
                                    {item.badge}
                                  </span>
                                )}
                              </div>
                              <CardTitle className="text-base mt-3">{item.title}</CardTitle>
                              <CardDescription className="text-sm">{item.description}</CardDescription>
                            </CardHeader>
                            <CardContent className="pt-0">
                              <Link href={item.href}>
                                <Button variant="outline" size="sm" className="w-full">
                                  <ArrowRight className="w-3 h-3 mr-2" />
                                  Ouvrir
                                </Button>
                              </Link>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
