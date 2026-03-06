import { useParams, Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Droplets,
  Flame,
  Wind,
  TreeDeciduous,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Clock,
  FlaskConical,
  Target,
  FileText,
  Zap,
  Loader2,
} from "lucide-react";

// ─── Helpers ─────────────────────────────────────────────────────────────────

const RECIPE_TYPE_CONFIG: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  parfum: {
    label: "Parfum",
    color: "bg-pink-500/20 text-pink-400 border-pink-500/30",
    icon: <Droplets className="w-4 h-4" />,
  },
  encens: {
    label: "Encens",
    color: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    icon: <Flame className="w-4 h-4" />,
  },
  espace: {
    label: "Espace",
    color: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
    icon: <Wind className="w-4 h-4" />,
  },
};

const CLIMATIC_AXIS_CONFIG: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  vent: { label: "Vent", color: "bg-sky-500/20 text-sky-400", icon: <Wind className="w-4 h-4" /> },
  bois: { label: "Bois", color: "bg-amber-500/20 text-amber-400", icon: <TreeDeciduous className="w-4 h-4" /> },
  disparition: { label: "Disparition", color: "bg-violet-500/20 text-violet-400", icon: <Sparkles className="w-4 h-4" /> },
  vent_bois: { label: "Vent + Bois", color: "bg-emerald-500/20 text-emerald-400", icon: <Wind className="w-4 h-4" /> },
  bois_disparition: { label: "Bois + Disparition", color: "bg-orange-500/20 text-orange-400", icon: <TreeDeciduous className="w-4 h-4" /> },
  vent_disparition: { label: "Vent + Disparition", color: "bg-indigo-500/20 text-indigo-400", icon: <Wind className="w-4 h-4" /> },
  vent_bois_disparition: { label: "Vent + Bois + Disparition", color: "bg-rose-500/20 text-rose-400", icon: <Sparkles className="w-4 h-4" /> },
};

function InfoRow({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4 py-2">
      <span className="text-sm font-medium text-muted-foreground min-w-[160px] shrink-0">{label}</span>
      <span className="text-sm text-foreground/90">{value}</span>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function FinalRecipeDetail() {
  const { id } = useParams<{ id: string }>();
  const numericId = parseInt(id ?? "0", 10);

  const { data: recipe, isLoading, error } = trpc.finalRecipes.getById.useQuery(numericId, {
    enabled: !isNaN(numericId) && numericId > 0,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <Breadcrumbs />
        <main className="flex-1 container py-12 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <Breadcrumbs />
        <main className="flex-1 container py-12">
          <div className="max-w-2xl mx-auto text-center space-y-4">
            <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto" />
            <h1 className="text-2xl font-bold">Recette introuvable</h1>
            <p className="text-muted-foreground">
              La recette finale n°{id} n'existe pas ou a été supprimée.
            </p>
            <Link href="/final-recipes">
              <Button variant="outline" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Retour aux recettes finales
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const typeConfig = RECIPE_TYPE_CONFIG[recipe.recipeType] ?? RECIPE_TYPE_CONFIG.parfum;
  const axisConfig = CLIMATIC_AXIS_CONFIG[recipe.climaticAxis ?? "vent"] ?? CLIMATIC_AXIS_CONFIG.vent;
  const concentrate = recipe.concentrate as { ingredient: string; percentage: number }[] | null;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Breadcrumbs />

      <main className="flex-1">
        {/* ── Hero ── */}
        <section className="py-10 bg-gradient-to-br from-background via-muted/20 to-background border-b">
          <div className="container max-w-4xl">
            <Link href="/final-recipes">
              <Button variant="ghost" size="sm" className="gap-2 mb-6 -ml-2 text-muted-foreground hover:text-foreground">
                <ArrowLeft className="h-4 w-4" />
                Recettes finales
              </Button>
            </Link>

            <div className="flex flex-wrap items-start gap-3 mb-4">
              <Badge variant="outline" className="font-mono text-base px-3 py-1">
                {recipe.recipeId}
              </Badge>
              <Badge variant="outline" className={`${typeConfig.color} flex items-center gap-1.5`}>
                {typeConfig.icon}
                {typeConfig.label}
              </Badge>
              <Badge variant="outline" className={`${axisConfig.color} flex items-center gap-1.5`}>
                {axisConfig.icon}
                {axisConfig.label}
              </Badge>
              {recipe.isRadical === 1 && (
                <Badge variant="outline" className="bg-red-500/20 text-red-400 border-red-500/30 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5" />
                  Recette radicale
                </Badge>
              )}
            </div>

            <h1 className="text-3xl md:text-4xl font-bold mb-3">{recipe.name}</h1>

            {recipe.function && (
              <p className="text-lg text-muted-foreground">{recipe.function}</p>
            )}
          </div>
        </section>

        {/* ── Contenu ── */}
        <section className="py-10">
          <div className="container max-w-4xl space-y-8">

            {/* Formule / Concentré */}
            {concentrate && concentrate.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <FlaskConical className="h-5 w-5 text-primary" />
                    Formule — Concentré
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {concentrate.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between py-1.5 border-b border-border/50 last:border-0">
                        <span className="text-sm font-medium">{item.ingredient}</span>
                        <Badge variant="secondary" className="font-mono text-xs">
                          {item.percentage}%
                        </Badge>
                      </div>
                    ))}
                  </div>

                  {/* Barre de proportions */}
                  <div className="mt-4 flex rounded-full overflow-hidden h-3">
                    {concentrate.map((item, idx) => (
                      <div
                        key={idx}
                        className="h-full transition-all"
                        style={{
                          width: `${item.percentage}%`,
                          backgroundColor: `oklch(0.65 0.2 ${(idx * 47) % 360})`,
                        }}
                        title={`${item.ingredient}: ${item.percentage}%`}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Paramètres techniques */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <FileText className="h-5 w-5 text-primary" />
                  Paramètres techniques
                </CardTitle>
              </CardHeader>
              <CardContent className="divide-y divide-border/50">
                <InfoRow label="Base / Support" value={recipe.base} />
                <InfoRow label="Dilution" value={recipe.dilution} />
                <InfoRow label="Repos" value={recipe.restPeriod} />
                <InfoRow label="Forme" value={recipe.form} />
                <InfoRow label="Temps de combustion" value={recipe.combustionTime} />
                <InfoRow label="Supports" value={recipe.supports} />
                <InfoRow label="Protocole" value={recipe.protocol} />
                <InfoRow label="Usage" value={recipe.usage} />
              </CardContent>
            </Card>

            {/* Résultat attendu & Critères */}
            {(recipe.expectedResult || recipe.successCriteria) && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Target className="h-5 w-5 text-primary" />
                    Objectifs & Critères
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recipe.expectedResult && (
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1.5">Résultat attendu</h4>
                      <p className="text-sm leading-relaxed">{recipe.expectedResult}</p>
                    </div>
                  )}
                  {recipe.successCriteria && (
                    <>
                      {recipe.expectedResult && <Separator />}
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1.5 flex items-center gap-1.5">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          Critères de réussite
                        </h4>
                        <p className="text-sm leading-relaxed">{recipe.successCriteria}</p>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Risques */}
            {recipe.risks && (
              <Card className="border-amber-200 dark:border-amber-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base text-amber-600 dark:text-amber-400">
                    <AlertTriangle className="h-5 w-5" />
                    Risques & Précautions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed text-amber-700 dark:text-amber-300">{recipe.risks}</p>
                </CardContent>
              </Card>
            )}

            {/* Notes */}
            {recipe.notes && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Clock className="h-5 w-5 text-primary" />
                    Notes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed text-foreground/80 whitespace-pre-line">{recipe.notes}</p>
                </CardContent>
              </Card>
            )}

            {/* Navigation */}
            <div className="flex justify-between pt-4">
              <Link href="/final-recipes">
                <Button variant="outline" className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Toutes les recettes finales
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
