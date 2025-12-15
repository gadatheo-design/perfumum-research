import { LucideIcon, Search, FileQuestion, Inbox, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  variant?: "default" | "search" | "error" | "inbox";
  className?: string;
}

const variantIcons: Record<string, LucideIcon> = {
  default: FileQuestion,
  search: Search,
  error: AlertCircle,
  inbox: Inbox,
};

export function EmptyState({
  icon,
  title,
  description,
  action,
  variant = "default",
  className,
}: EmptyStateProps) {
  const Icon = icon || variantIcons[variant];

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-12 px-4 text-center",
        className
      )}
      role="status"
      aria-label={title}
    >
      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-6">
        <Icon className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
      </div>
      
      <h3 className="text-xl font-semibold mb-2 normal-case">{title}</h3>
      
      {description && (
        <p className="text-muted-foreground max-w-md mb-6">{description}</p>
      )}
      
      {action && (
        <Button
          onClick={action.onClick}
          variant="outline"
          className="btn-enhanced"
        >
          {action.label}
        </Button>
      )}
    </div>
  );
}

// Preset empty states for common scenarios
export function NoResultsState({
  searchTerm,
  onClear,
}: {
  searchTerm?: string;
  onClear?: () => void;
}) {
  return (
    <EmptyState
      variant="search"
      title="Aucun résultat trouvé"
      description={
        searchTerm
          ? `Aucun élément ne correspond à "${searchTerm}". Essayez de modifier votre recherche.`
          : "Essayez de modifier vos filtres ou votre recherche."
      }
      action={
        onClear
          ? {
              label: "Effacer les filtres",
              onClick: onClear,
            }
          : undefined
      }
    />
  );
}

export function NoDataState({ entityName }: { entityName: string }) {
  return (
    <EmptyState
      variant="inbox"
      title={`Aucune ${entityName}`}
      description={`Il n'y a pas encore de ${entityName} dans la base de données.`}
    />
  );
}

export function ErrorState({
  message,
  onRetry,
}: {
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <EmptyState
      variant="error"
      title="Une erreur est survenue"
      description={message || "Impossible de charger les données. Veuillez réessayer."}
      action={
        onRetry
          ? {
              label: "Réessayer",
              onClick: onRetry,
            }
          : undefined
      }
    />
  );
}
