// @ts-nocheck
import { ExternalLink, BookOpen, Database, FileText, GraduationCap } from "lucide-react";

interface Reference {
  author?: string;
  year?: number;
  title: string;
  journal?: string;
  doi?: string;
  url?: string;
  type: 'pubchem' | 'academic' | 'book' | 'database' | 'other';
}

interface ReferencesListProps {
  references?: Reference[] | null;
}

const typeIcons = {
  pubchem: Database,
  academic: GraduationCap,
  book: BookOpen,
  database: Database,
  other: FileText,
};

const typeLabels = {
  pubchem: 'PubChem',
  academic: 'Article académique',
  book: 'Livre',
  database: 'Base de données',
  other: 'Autre',
};

export function ReferencesList({ references }: ReferencesListProps) {
  if (!references || references.length === 0) {
    return (
      <div className="text-sm text-muted-foreground italic">
        Aucune référence bibliographique disponible pour cette molécule.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {references.map((ref, index) => {
        const Icon = typeIcons[ref.type] || FileText;
        
        return (
          <div key={index} className="border border-border rounded-lg p-4 hover:bg-muted/30 transition-colors">
            <div className="flex items-start gap-3">
              <div className="mt-1">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              
              <div className="flex-1 space-y-2">
                {/* Type badge */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-medium px-2 py-1 rounded-full bg-primary/10 text-primary">
                    {typeLabels[ref.type]}
                  </span>
                  {ref.year && (
                    <span className="text-xs text-muted-foreground">
                      {ref.year}
                    </span>
                  )}
                </div>

                {/* Title */}
                <h4 className="font-semibold text-sm leading-tight">
                  {ref.title}
                </h4>

                {/* Author & Journal */}
                <div className="text-sm text-muted-foreground space-y-1">
                  {ref.author && (
                    <p className="italic">{ref.author}</p>
                  )}
                  {ref.journal && (
                    <p className="font-medium">{ref.journal}</p>
                  )}
                </div>

                {/* DOI & URL */}
                <div className="flex items-center gap-4 flex-wrap">
                  {ref.doi && (
                    <a
                      href={`https://doi.org/${ref.doi}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary hover:underline flex items-center gap-1"
                    >
                      <span>DOI: {ref.doi}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                  {ref.url && (
                    <a
                      href={ref.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary hover:underline flex items-center gap-1"
                    >
                      <span>Lien externe</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
