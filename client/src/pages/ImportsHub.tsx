import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import {
  Upload,
  FileSpreadsheet,
  FileText,
  Database,
  Image,
  BookOpen,
  Leaf,
  Microscope,
  FlaskConical,
  ArrowRight,
  AlertCircle,
  Download,
  Users,
  GitBranch,
} from "lucide-react";

interface ImportEntry {
  category: string;
  title: string;
  description: string;
  icon: React.ElementType;
  href: string;
  color: string;
  bgColor: string;
  badge?: string;
  formats?: string[];
  audience?: "admin" | "collaborateur" | "tous";
}

const imports: ImportEntry[] = [
  // ── Import / Export général ────────────────────────────────────────────────
  {
    category: "Import / Export général",
    title: "Import / Export des Données",
    description: "Interface bidirectionnelle complète : importer ou exporter des molécules, recettes, plantes, terroirs et traditions via des fichiers JSON/CSV standardisés. Inclut un guide collaborateur pas-à-pas.",
    icon: Database,
    href: "/admin/import-export",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    formats: ["JSON", "CSV"],
    audience: "collaborateur",
    badge: "Principal",
  },
  {
    category: "Import / Export général",
    title: "Import CSV — Validation & Prévisualisation",
    description: "Importer des données CSV avec validation en temps réel, prévisualisation des lignes, détection des erreurs et confirmation avant intégration. Idéal pour les imports de masse sécurisés.",
    icon: FileSpreadsheet,
    href: "/csv-validation-import",
    color: "text-green-600",
    bgColor: "bg-green-50",
    formats: ["CSV"],
    audience: "collaborateur",
  },
  {
    category: "Import / Export général",
    title: "Import par Lots (Galerie)",
    description: "Importer en lot des images, fichiers PDF et documents de référence dans la galerie PERFUMUM. Supporte le glisser-déposer et les archives ZIP.",
    icon: Image,
    href: "/batch-import",
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    formats: ["ZIP", "PNG", "JPG", "PDF"],
    audience: "collaborateur",
  },
  // ── Références bibliographiques ────────────────────────────────────────────
  {
    category: "Références bibliographiques",
    title: "Import Références en Masse",
    description: "Importer en masse les liens entre références bibliographiques et entités PERFUMUM (molécules, plantes, recettes, terroirs) via un fichier CSV. Supporte 8 types d'entités et 8 types de liens.",
    icon: BookOpen,
    href: "/bulk-import-references",
    color: "text-amber-600",
    bgColor: "bg-amber-50",
    formats: ["CSV"],
    audience: "collaborateur",
  },
  // ── Molécules & Recettes ───────────────────────────────────────────────────
  {
    category: "Molécules & Recettes",
    title: "Import CSV — Molécules & Recettes",
    description: "Importer des molécules et des recettes olfactives depuis un fichier CSV. Détection automatique des doublons, validation des champs obligatoires et aperçu avant import.",
    icon: FlaskConical,
    href: "/molecule-recette-import-csv",
    color: "text-rose-600",
    bgColor: "bg-rose-50",
    formats: ["CSV"],
    audience: "collaborateur",
  },
  // ── Plantes & Terroirs ─────────────────────────────────────────────────────
  {
    category: "Plantes & Terroirs",
    title: "Import CSV — Plantes & Terroirs",
    description: "Importer des plantes et des terroirs depuis un fichier CSV. Validation des coordonnées GPS, des noms botaniques et des relations plante-terroir.",
    icon: Leaf,
    href: "/plant-terroir-import-csv",
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
    formats: ["CSV"],
    audience: "collaborateur",
  },
  {
    category: "Plantes & Terroirs",
    title: "Import / Export Plantes",
    description: "Interface dédiée à l'import et l'export des fiches plantes avec leurs variétés, origines géographiques et données botaniques.",
    icon: Leaf,
    href: "/admin/import-export-plants",
    color: "text-teal-600",
    bgColor: "bg-teal-50",
    formats: ["JSON", "CSV"],
    audience: "admin",
  },
  {
    category: "Plantes & Terroirs",
    title: "Import Généalogie des Variétés",
    description: "Importer les relations de généalogie entre variétés botaniques (parenté, hybridation, sélection) pour alimenter l'arbre phylogénétique.",
    icon: GitBranch,
    href: "/admin/variety-genealogy-import",
    color: "text-lime-600",
    bgColor: "bg-lime-50",
    formats: ["CSV", "JSON"],
    audience: "admin",
  },
  // ── Analyses & Spectres ────────────────────────────────────────────────────
  {
    category: "Analyses & Spectres",
    title: "Import GC/MS",
    description: "Importer des fichiers d'analyse chromatographique GC/MS (format .txt, .csv ou .mzML) pour alimenter la base de spectres PERFUMUM.",
    icon: Microscope,
    href: "/admin/gcms-import",
    color: "text-indigo-600",
    bgColor: "bg-indigo-50",
    formats: ["TXT", "CSV", "mzML"],
    audience: "admin",
  },
  // ── Import CSV Admin ───────────────────────────────────────────────────────
  {
    category: "Import CSV Admin",
    title: "Import CSV (Admin)",
    description: "Interface d'import CSV avancée réservée aux administrateurs, avec accès à tous les types d'entités et options de configuration avancées.",
    icon: FileText,
    href: "/admin/import-csv",
    color: "text-slate-600",
    bgColor: "bg-slate-50",
    formats: ["CSV"],
    audience: "admin",
    badge: "Admin",
  },
  {
    category: "Import CSV Admin",
    title: "Prévisualisation Import CSV",
    description: "Prévisualiser et valider un fichier CSV avant import définitif. Affiche les erreurs ligne par ligne et permet de corriger avant intégration.",
    icon: FileSpreadsheet,
    href: "/admin/import-csv-preview",
    color: "text-slate-600",
    bgColor: "bg-slate-50",
    formats: ["CSV"],
    audience: "admin",
  },
];

// Grouper par catégorie
const categories = imports.reduce((acc, item) => {
  if (!acc[item.category]) acc[item.category] = [];
  acc[item.category].push(item);
  return acc;
}, {} as Record<string, ImportEntry[]>);

const audienceColors: Record<string, string> = {
  collaborateur: "bg-green-100 text-green-700",
  admin: "bg-red-100 text-red-700",
  tous: "bg-blue-100 text-blue-700",
};

const audienceLabels: Record<string, string> = {
  collaborateur: "Collaborateur",
  admin: "Admin",
  tous: "Tous",
};

const categoryColors: Record<string, string> = {
  "Import / Export général": "border-blue-200 bg-blue-50/30",
  "Références bibliographiques": "border-amber-200 bg-amber-50/30",
  "Molécules & Recettes": "border-rose-200 bg-rose-50/30",
  "Plantes & Terroirs": "border-emerald-200 bg-emerald-50/30",
  "Analyses & Spectres": "border-indigo-200 bg-indigo-50/30",
  "Import CSV Admin": "border-slate-200 bg-slate-50/30",
};

export default function ImportsHub() {
  return (
    <div className="min-h-screen flex flex-col">
      <Breadcrumbs />
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="py-16 bg-gradient-to-br from-green-50 via-teal-50 to-blue-50 dark:from-green-950/20 dark:via-teal-950/20 dark:to-blue-950/20">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Upload className="w-8 h-8 text-green-600" />
                <h1 className="text-4xl font-bold">Hub Imports</h1>
              </div>
              <p className="text-lg text-muted-foreground">
                Tous les outils d'import et d'export PERFUMUM — molécules, plantes, recettes, terroirs,
                références bibliographiques et spectres GC/MS — réunis en un seul endroit.
              </p>
              <div className="flex items-center justify-center gap-2 mt-4 flex-wrap text-sm text-muted-foreground">
                <span className="px-2 py-1 bg-background rounded-full border">{imports.length} outils</span>
                <span className="px-2 py-1 bg-background rounded-full border">{Object.keys(categories).length} catégories</span>
                <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full border border-green-200">Collaborateur</span>
                <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full border border-red-200">Admin</span>
              </div>
            </div>
          </div>
        </section>

        {/* Guide rapide */}
        <section className="py-8 border-b bg-muted/30">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-amber-800 dark:text-amber-200 text-sm">Guide collaborateur</p>
                  <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                    Pour importer des données, utilisez en priorité <strong>Import / Export des Données</strong> (interface principale avec guide pas-à-pas).
                    Téléchargez d'abord le modèle CSV/JSON correspondant au type de données, remplissez-le, puis importez-le.
                    Les entrées marquées <span className="px-1 py-0.5 bg-red-100 text-red-700 rounded text-xs">Admin</span> nécessitent des droits d'administration.
                  </p>
                </div>
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
                                <div className="flex gap-1 flex-wrap justify-end">
                                  {item.badge && (
                                    <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full font-medium">
                                      {item.badge}
                                    </span>
                                  )}
                                  {item.audience && (
                                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${audienceColors[item.audience]}`}>
                                      {audienceLabels[item.audience]}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <CardTitle className="text-base mt-3">{item.title}</CardTitle>
                              <CardDescription className="text-sm">{item.description}</CardDescription>
                            </CardHeader>
                            <CardContent className="pt-0">
                              {item.formats && (
                                <div className="flex gap-1 flex-wrap mb-3">
                                  {item.formats.map((fmt) => (
                                    <span key={fmt} className="text-xs px-1.5 py-0.5 bg-muted text-muted-foreground rounded font-mono">
                                      {fmt}
                                    </span>
                                  ))}
                                </div>
                              )}
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
