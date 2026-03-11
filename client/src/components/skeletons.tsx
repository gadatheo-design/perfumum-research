/**
 * Fichier d'export centralisé pour tous les composants skeleton
 * 
 * Ce fichier réexporte les skeletons depuis leurs emplacements respectifs
 * pour faciliter les imports dans les pages.
 */

// Skeletons de base depuis LoadingSpinner
export { 
  Skeleton,
  CardSkeleton,
  ListSkeleton,
  FilterBarSkeleton,
  GridSkeleton,
  StatsSkeleton,
  TableSkeleton,
  PageHeaderSkeleton,
  ListPageSkeleton,
} from './LoadingSpinner';

// Skeletons spécialisés depuis card-skeleton
export {
  MoleculeCardSkeleton,
  RecetteCardSkeleton as RecetteCardSkeletonUI,
  CivilisationCardSkeleton,
  PlantCardSkeleton,
  GammeCardSkeleton,
  TerroirCardSkeleton,
  TableRowSkeleton,
  MoleculeGridSkeleton,
  RecetteGridSkeleton,
  PlantGridSkeleton,
  DetailPageSkeleton,
  StatCardSkeleton,
  ChartSkeleton,
  FormSkeleton,
  FiltersSkeleton,
} from './ui/card-skeleton';

// Skeletons spécifiques pour les recettes
export { RecetteCardSkeleton, RecetteCardSkeletonGrid } from './RecetteCardSkeleton';

// Skeleton pour le dashboard
export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="border border-border rounded-lg p-4 space-y-2">
            <div className="shimmer h-4 w-20 rounded bg-muted" />
            <div className="shimmer h-8 w-16 rounded bg-muted" />
          </div>
        ))}
      </div>
      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="border border-border rounded-lg p-6 space-y-4">
            <div className="shimmer h-6 w-1/3 rounded bg-muted" />
            <div className="shimmer h-48 w-full rounded bg-muted" />
          </div>
        ))}
      </div>
    </div>
  );
}

// Skeleton pour les détails de molécule
export function MoleculeDetailSkeleton() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="shimmer h-10 w-2/3 rounded bg-muted" />
        <div className="shimmer h-6 w-1/3 rounded bg-muted" />
        <div className="flex gap-2">
          <div className="shimmer h-6 w-20 rounded-full bg-muted" />
          <div className="shimmer h-6 w-24 rounded-full bg-muted" />
          <div className="shimmer h-6 w-16 rounded-full bg-muted" />
        </div>
      </div>
      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="border border-border rounded-lg p-6 space-y-4">
            <div className="shimmer h-6 w-1/3 rounded bg-muted" />
            <div className="shimmer h-4 w-full rounded bg-muted" />
            <div className="shimmer h-4 w-full rounded bg-muted" />
            <div className="shimmer h-4 w-4/5 rounded bg-muted" />
          </div>
        </div>
        <div className="space-y-6">
          <div className="border border-border rounded-lg p-6 space-y-4">
            <div className="shimmer h-6 w-1/2 rounded bg-muted" />
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex justify-between">
                <div className="shimmer h-4 w-1/3 rounded bg-muted" />
                <div className="shimmer h-4 w-1/4 rounded bg-muted" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
