import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, ArrowRight } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export function ResearchNews() {
  const { data: milestones, isLoading } = trpc.milestones.listResearch.useQuery();

  if (isLoading) {
    return (
      <Card className="brutal-border">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            <CardTitle>Actualités de la recherche</CardTitle>
          </div>
          <CardDescription>Les dernières avancées du projet PERFUMUM</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-24 bg-muted animate-pulse rounded-md"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!milestones || milestones.length === 0) {
    return null;
  }

  // Trier par date de création (les plus récentes en premier) et prendre les 3 premières
  const recentMilestones = [...milestones]
    .sort((a, b) => {
      const dateA = new Date(a.createdAt || 0).getTime();
      const dateB = new Date(b.createdAt || 0).getTime();
      return dateB - dateA;
    })
    .slice(0, 3);

  return (
    <Card className="brutal-border">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          <CardTitle>Actualités de la recherche</CardTitle>
        </div>
        <CardDescription>Les dernières avancées du projet PERFUMUM</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          {recentMilestones.map((milestone) => {
            const phaseLabels: Record<string, string> = {
              foundation: "Fondation",
              development: "Développement",
              expansion: "Expansion",
              consolidation: "Consolidation",
              innovation: "Innovation",
            };

            const categoryLabels: Record<string, string> = {
              research: "Recherche",
              documentation: "Documentation",
              development: "Développement",
              collaboration: "Collaboration",
              publication: "Publication",
            };

            return (
              <div
                key={milestone.id}
                className="p-4 rounded-lg border border-border hover:border-primary/50 transition-all group"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">
                    {milestone.title}
                  </h3>
                  <Badge variant="outline" className="text-xs flex-shrink-0">
                    {milestone.quarter}
                  </Badge>
                </div>
                
                {milestone.description && (
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {milestone.description}
                  </p>
                )}

                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="secondary" className="text-xs">
                    {phaseLabels[milestone.phase] || milestone.phase}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {categoryLabels[(milestone as Record<string, string>).category ?? ""] || (milestone as Record<string, string>).category}
                  </Badge>
                  {(milestone as unknown as { progress?: number }).progress !== undefined && (milestone as unknown as { progress?: number }).progress! > 0 && (
                    <Badge variant="outline" className="text-xs">
                      {(milestone as unknown as { progress?: number }).progress}% complété
                    </Badge>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-2 border-t border-border">
          <Button variant="outline" size="sm" className="w-full group" asChild>
            <Link href="/timeline">
              Voir toutes les archives
              <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
