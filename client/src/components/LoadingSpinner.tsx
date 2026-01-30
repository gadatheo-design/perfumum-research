import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  text?: string;
  className?: string;
  fullScreen?: boolean;
}

const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-8 w-8',
  lg: 'h-12 w-12',
  xl: 'h-16 w-16',
};

/**
 * Composant de chargement élégant avec spinner animé
 * 
 * @example
 * <LoadingSpinner size="lg" text="Chargement des données..." />
 * <LoadingSpinner fullScreen text="Initialisation..." />
 */
export function LoadingSpinner({
  size = 'md',
  text,
  className,
  fullScreen = false,
}: LoadingSpinnerProps) {
  const spinner = (
    <div className={cn('flex flex-col items-center justify-center gap-4', className)}>
      <Loader2 
        className={cn(
          sizeClasses[size],
          'animate-spin text-primary'
        )}
        aria-label="Chargement en cours"
      />
      {text && (
        <p className="text-sm text-muted-foreground animate-pulse">
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
        {spinner}
      </div>
    );
  }

  return spinner;
}

/**
 * Composant de skeleton pour le chargement de contenu
 * Utilise l'effet shimmer défini dans index.css
 */
export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'shimmer rounded-md bg-muted',
        className
      )}
      aria-label="Chargement..."
    />
  );
}

/**
 * Skeleton pour une carte
 */
export function CardSkeleton() {
  return (
    <div className="border border-border rounded-lg p-6 space-y-4">
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <div className="flex gap-2 mt-4">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-8 w-20" />
      </div>
    </div>
  );
}

/**
 * Skeleton pour une liste
 */
export function ListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Skeleton pour la barre de filtres
 */
export function FilterBarSkeleton() {
  return (
    <div className="flex flex-wrap gap-3 mb-6">
      <Skeleton className="h-10 w-48 rounded-md" />
      <Skeleton className="h-10 w-32 rounded-md" />
      <Skeleton className="h-10 w-32 rounded-md" />
      <Skeleton className="h-10 w-24 rounded-md" />
    </div>
  );
}

/**
 * Skeleton pour une grille de cartes
 */
export function GridSkeleton({ count = 9, columns = 3 }: { count?: number; columns?: number }) {
  const gridClass = columns === 2 
    ? 'grid-cols-1 sm:grid-cols-2' 
    : columns === 4 
      ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
      : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
  
  return (
    <div className={`grid ${gridClass} gap-4 md:gap-6`}>
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

/**
 * Skeleton pour les statistiques
 */
export function StatsSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="border border-border rounded-lg p-4 space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-8 w-16" />
        </div>
      ))}
    </div>
  );
}

/**
 * Skeleton pour les tableaux
 */
export function TableSkeleton({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <div className="border border-border rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-muted/50 border-b border-border p-3 flex gap-4">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} className="h-4 flex-1" />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <div key={rowIdx} className="border-b border-border/50 p-3 flex gap-4">
          {Array.from({ length: columns }).map((_, colIdx) => (
            <Skeleton key={colIdx} className="h-4 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}

/**
 * Skeleton pour le header de page
 */
export function PageHeaderSkeleton() {
  return (
    <div className="space-y-4 mb-8">
      <Skeleton className="h-4 w-48" />
      <Skeleton className="h-10 w-2/3" />
      <Skeleton className="h-5 w-1/2" />
    </div>
  );
}

/**
 * Skeleton complet pour une page de liste
 */
export function ListPageSkeleton({ cardCount = 9 }: { cardCount?: number }) {
  return (
    <div className="space-y-6">
      <PageHeaderSkeleton />
      <FilterBarSkeleton />
      <GridSkeleton count={cardCount} />
    </div>
  );
}
