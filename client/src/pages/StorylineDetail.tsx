import { useParams, Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, BookOpen, MapPin, Calendar, Layers, AlertCircle } from "lucide-react";

const AXIS_LABELS: Record<string, string> = {
  combustion: "Combustion & Pyrolyse",
  fermentation: "Fermentation & Transformation",
  extraction: "Extraction & Distillation",
  terroir: "Terroir & Géographie",
  heritage: "Patrimoine & Mémoire",
  experimentation: "Expérimentation",
};

const ROLE_LABELS: Record<string, { label: string; color: string }> = {
  protagonist: { label: "Protagoniste", color: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300" },
  context: { label: "Contexte", color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300" },
  transformation: { label: "Transformation", color: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300" },
  symbol: { label: "Symbole", color: "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300" },
  source: { label: "Source", color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" },
  destination: { label: "Destination", color: "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300" },
  contrast: { label: "Contraste", color: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300" },
};

const ENTITY_ICONS: Record<string, string> = {
  plant: "🌿",
  molecule: "⚗️",
  recipe: "📋",
  raw_material: "🧪",
  terroir: "🗺️",
  reference: "📚",
  experience: "🎯",
};

export default function StorylineDetail() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;

  const { data: storyline, isLoading, error } = trpc.storylines.getBySlug.useQuery(
    { slug: slug ?? "" },
    { enabled: !!slug }
  );

  if (isLoading) {
    return (
      <div className="container max-w-4xl py-16">
        <div className="flex flex-col gap-6 animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3" />
          <div className="h-4 bg-muted rounded w-2/3" />
          <div className="h-4 bg-muted rounded w-1/2" />
          <div className="h-48 bg-muted rounded" />
        </div>
      </div>
    );
  }

  if (error || !storyline) {
    return (
      <div className="container max-w-4xl py-16">
        <div className="flex flex-col items-center gap-6 text-center py-24">
          <AlertCircle className="w-16 h-16 text-muted-foreground opacity-40" />
          <div>
            <h1 className="text-2xl font-bold mb-2">Fil narratif introuvable</h1>
            <p className="text-muted-foreground max-w-md">
              Le storyline <code className="text-sm bg-muted px-1 py-0.5 rounded">{slug}</code> n'existe pas encore dans la base de données PERFUMUM.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Les fils narratifs peuvent être créés depuis l'interface d'administration.
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" asChild>
              <Link href="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Accueil
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/admin/storylines">
                <BookOpen className="w-4 h-4 mr-2" />
                Gérer les Storylines
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const elements = (storyline as any).elements ?? [];
  const axisLabel = AXIS_LABELS[(storyline as any).narrative_axis] ?? (storyline as any).narrative_axis;

  return (
    <div className="container max-w-4xl py-8">
      {/* Navigation retour */}
      <Button variant="ghost" size="sm" asChild className="mb-6 -ml-2">
        <Link href="/admin/storylines">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Tous les fils narratifs
        </Link>
      </Button>

      {/* En-tête */}
      <div className="mb-8">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <Badge variant="outline" className="text-xs">
            <BookOpen className="w-3 h-3 mr-1" />
            {axisLabel}
          </Badge>
          {(storyline as any).status === "active" && (
            <Badge className="text-xs bg-emerald-600 text-white">Actif</Badge>
          )}
          {(storyline as any).status === "draft" && (
            <Badge variant="secondary" className="text-xs">Brouillon</Badge>
          )}
          {(storyline as any).status === "archived" && (
            <Badge variant="outline" className="text-xs text-muted-foreground">Archivé</Badge>
          )}
        </div>

        <h1 className="text-3xl font-bold tracking-tight mb-2">{(storyline as any).title}</h1>
        {(storyline as any).subtitle && (
          <p className="text-lg text-muted-foreground italic mb-4">{(storyline as any).subtitle}</p>
        )}

        {/* Métadonnées */}
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          {(storyline as any).geographic_scope && (
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              {(storyline as any).geographic_scope}
            </span>
          )}
          {(storyline as any).period_label && (
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {(storyline as any).period_label}
              {(storyline as any).period_start_year && (
                <span className="ml-1">
                  ({(storyline as any).period_start_year}
                  {(storyline as any).period_end_year && `–${(storyline as any).period_end_year}`})
                </span>
              )}
            </span>
          )}
          {elements.length > 0 && (
            <span className="flex items-center gap-1">
              <Layers className="w-3.5 h-3.5" />
              {elements.length} élément{elements.length > 1 ? "s" : ""}
            </span>
          )}
        </div>
      </div>

      <Separator className="mb-8" />

      {/* Description */}
      {(storyline as any).description && (
        <div className="mb-10">
          <h2 className="text-lg font-semibold mb-3">Description</h2>
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {(storyline as any).description}
            </p>
          </div>
        </div>
      )}

      {/* Éléments du fil narratif */}
      {elements.length > 0 ? (
        <div>
          <h2 className="text-lg font-semibold mb-4">Éléments du fil narratif</h2>
          <div className="flex flex-col gap-3">
            {elements
              .sort((a: any, b: any) => (a.sequence_order ?? 0) - (b.sequence_order ?? 0))
              .map((element: any, index: number) => {
                const roleInfo = ROLE_LABELS[element.role_in_story] ?? { label: element.role_in_story, color: "bg-muted text-muted-foreground" };
                const entityIcon = ENTITY_ICONS[element.entity_type] ?? "📌";

                return (
                  <Card key={element.id} className="border-l-4 border-l-primary/30">
                    <CardHeader className="pb-2 pt-4 px-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{entityIcon}</span>
                          <div>
                            <CardTitle className="text-sm font-medium">
                              {element.entity_name ?? `${element.entity_type} #${element.entity_id}`}
                            </CardTitle>
                            <p className="text-xs text-muted-foreground capitalize">{element.entity_type}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-xs text-muted-foreground">#{index + 1}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${roleInfo.color}`}>
                            {roleInfo.label}
                          </span>
                        </div>
                      </div>
                    </CardHeader>
                    {element.narrative_note && (
                      <CardContent className="pb-4 px-4 pt-0">
                        <p className="text-sm text-muted-foreground italic">
                          "{element.narrative_note}"
                        </p>
                      </CardContent>
                    )}
                  </Card>
                );
              })}
          </div>
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          <Layers className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm">Aucun élément narratif pour ce fil.</p>
          <p className="text-xs mt-1">Les éléments peuvent être ajoutés depuis l'interface d'administration.</p>
        </div>
      )}
    </div>
  );
}
