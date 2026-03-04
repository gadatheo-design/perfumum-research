// @ts-nocheck
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { BookOpen, FileText, GraduationCap, Database, ExternalLink, Loader2, BookMarked, Link2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface LinkedReferencesProps {
  entityType: 'molecule' | 'recette' | 'plant' | 'prototype' | 'leaf_economy' | 'tradition' | 'terroir' | 'supplier';
  entityId: number;
  title?: string;
  maxItems?: number;
}

const linkTypeLabels: Record<string, { label: string; color: string }> = {
  documents: { label: "Documente", color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200" },
  mentions: { label: "Mentionne", color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" },
  analyzes: { label: "Analyse", color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200" },
  conserves: { label: "Conserve", color: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200" },
  reconstructs: { label: "Reconstruit", color: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200" },
  sources: { label: "Source", color: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200" },
  validates: { label: "Valide", color: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200" },
  contextualizes: { label: "Contextualise", color: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200" },
};

const entryTypeIcons: Record<string, typeof BookOpen> = {
  article: GraduationCap,
  book: BookOpen,
  inbook: BookMarked,
  thesis: GraduationCap,
  report: FileText,
  dataset: Database,
  online: ExternalLink,
  default: FileText,
};

export function LinkedReferences({ entityType, entityId, title = "Références associées", maxItems = 5 }: LinkedReferencesProps) {
  const { data: links, isLoading } = trpc.referenceEntityLinks.getForEntity.useQuery({
    entityType,
    entityId,
  });

  if (isLoading) {
    return (
      <div className="bg-card p-6 rounded-lg border shadow-sm">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Link2 className="h-5 w-5 text-primary" />
          {title}
        </h2>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!links || links.length === 0) {
    return (
      <div className="bg-card p-6 rounded-lg border shadow-sm">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Link2 className="h-5 w-5 text-primary" />
          {title}
        </h2>
        <p className="text-sm text-muted-foreground italic">
          Aucune référence bibliographique associée pour le moment.
        </p>
        <p className="text-xs text-muted-foreground mt-2">
          Les références peuvent être liées depuis la{" "}
          <Link href="/bibliographie-hub" className="text-primary hover:underline">
            bibliothèque de références
          </Link>.
        </p>
      </div>
    );
  }

  const displayedLinks = links.slice(0, maxItems);
  const hasMore = links.length > maxItems;

  return (
    <div className="bg-card p-6 rounded-lg border shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Link2 className="h-5 w-5 text-primary" />
          {title}
        </h2>
        <Badge variant="secondary">{links.length} référence{links.length > 1 ? 's' : ''}</Badge>
      </div>
      
      <div className="space-y-3">
        {displayedLinks.map((link: any) => {
          const ref = link.reference;
          if (!ref) return null;
          
          const IconComponent = entryTypeIcons[ref.entryType] || entryTypeIcons.default;
          const linkTypeInfo = link.linkType ? linkTypeLabels[link.linkType] : null;
          
          return (
            <div key={link.id} className="p-3 bg-muted/50 rounded-lg border hover:border-primary/30 transition-colors">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
                  <IconComponent className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <h3 className="font-medium text-sm line-clamp-2">
                        {ref.title}
                      </h3>
                      {ref.author && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {ref.author}{ref.year ? ` (${ref.year})` : ''}
                        </p>
                      )}
                    </div>
                    {linkTypeInfo && (
                      <Badge className={`${linkTypeInfo.color} text-xs flex-shrink-0`}>
                        {linkTypeInfo.label}
                      </Badge>
                    )}
                  </div>
                  
                  {link.notes && (
                    <p className="text-xs text-muted-foreground mt-2 italic line-clamp-2">
                      "{link.notes}"
                    </p>
                  )}
                  
                  <div className="flex items-center gap-2 mt-2">
                    {ref.doi && (
                      <a 
                        href={`https://doi.org/${ref.doi}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:underline flex items-center gap-1"
                      >
                        DOI <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                    {ref.url && !ref.doi && (
                      <a 
                        href={ref.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:underline flex items-center gap-1"
                      >
                        Lien <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                    {link.relevanceScore && (
                      <Badge variant="outline" className="text-xs">
                        Pertinence: {link.relevanceScore}%
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {hasMore && (
        <div className="mt-4 pt-4 border-t">
          <Button variant="outline" size="sm" className="w-full" asChild>
            <Link href="/bibliographie-hub">
              Voir toutes les références ({links.length})
            </Link>
          </Button>
        </div>
      )}
      
      <div className="mt-4 pt-4 border-t">
        <p className="text-xs text-muted-foreground">
          💡 Vous pouvez lier de nouvelles références depuis la{" "}
          <Link href="/bibliographie-hub" className="text-primary hover:underline">
            bibliothèque de références
          </Link>{" "}
          ou la page{" "}
          <Link href="/references-v3" className="text-primary hover:underline">
            Références V3
          </Link>.
        </p>
      </div>
    </div>
  );
}
