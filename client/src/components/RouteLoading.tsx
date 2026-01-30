import { Skeleton } from "@/components/ui/skeleton";

/**
 * Loading component for lazy-loaded routes
 * Displays skeleton placeholders while route component is loading
 */
export function RouteLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="space-y-4 w-full max-w-2xl px-4">
        <Skeleton className="h-12 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-64 w-full mt-6" />
        <div className="grid grid-cols-2 gap-4 mt-6">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
      </div>
    </div>
  );
}
