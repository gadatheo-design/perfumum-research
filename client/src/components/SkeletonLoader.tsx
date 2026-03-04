// @ts-nocheck
import React from "react";
import { cn } from "@/lib/utils";

interface SkeletonLoaderProps {
  variant?: "card" | "list" | "detail" | "grid" | "table";
  count?: number;
  className?: string;
}

/**
 * Composant SkeletonLoader réutilisable pour améliorer l'expérience de chargement
 * Affiche des placeholders animés pendant le chargement des données
 */
export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  variant = "card",
  count = 1,
  className,
}) => {
  const baseClasses = "animate-pulse bg-gray-200 dark:bg-gray-700 rounded";

  const renderSkeleton = () => {
    switch (variant) {
      case "card":
        return (
          <div className={cn("border rounded-lg p-6 space-y-4", className)}>
            <div className={cn(baseClasses, "h-6 w-3/4")} />
            <div className={cn(baseClasses, "h-4 w-full")} />
            <div className={cn(baseClasses, "h-4 w-5/6")} />
            <div className="flex gap-2 mt-4">
              <div className={cn(baseClasses, "h-8 w-20")} />
              <div className={cn(baseClasses, "h-8 w-20")} />
            </div>
          </div>
        );

      case "list":
        return (
          <div className={cn("border-b py-4 space-y-2", className)}>
            <div className={cn(baseClasses, "h-5 w-2/3")} />
            <div className={cn(baseClasses, "h-4 w-full")} />
          </div>
        );

      case "detail":
        return (
          <div className={cn("space-y-6", className)}>
            <div className={cn(baseClasses, "h-10 w-1/2")} />
            <div className="grid grid-cols-2 gap-4">
              <div className={cn(baseClasses, "h-32")} />
              <div className={cn(baseClasses, "h-32")} />
            </div>
            <div className="space-y-3">
              <div className={cn(baseClasses, "h-4 w-full")} />
              <div className={cn(baseClasses, "h-4 w-full")} />
              <div className={cn(baseClasses, "h-4 w-4/5")} />
            </div>
          </div>
        );

      case "grid":
        return (
          <div className={cn("border rounded-lg p-4 space-y-3", className)}>
            <div className={cn(baseClasses, "h-40 w-full")} />
            <div className={cn(baseClasses, "h-5 w-3/4")} />
            <div className={cn(baseClasses, "h-4 w-full")} />
          </div>
        );

      case "table":
        return (
          <div className={cn("border-b py-3", className)}>
            <div className="flex gap-4">
              <div className={cn(baseClasses, "h-4 w-1/4")} />
              <div className={cn(baseClasses, "h-4 w-1/3")} />
              <div className={cn(baseClasses, "h-4 w-1/4")} />
              <div className={cn(baseClasses, "h-4 w-1/6")} />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <React.Fragment key={index}>{renderSkeleton()}</React.Fragment>
      ))}
    </>
  );
};

/**
 * Skeleton spécifique pour les pages de molécules
 */
export const MoleculeDetailSkeleton: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="animate-pulse space-y-6">
        {/* Header */}
        <div className="bg-gray-200 dark:bg-gray-700 h-12 w-2/3 rounded" />
        
        {/* Badges */}
        <div className="flex gap-2">
          <div className="bg-gray-200 dark:bg-gray-700 h-6 w-24 rounded-full" />
          <div className="bg-gray-200 dark:bg-gray-700 h-6 w-24 rounded-full" />
          <div className="bg-gray-200 dark:bg-gray-700 h-6 w-24 rounded-full" />
        </div>

        {/* Profil olfactif */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-gray-200 dark:bg-gray-700 h-64 rounded-lg" />
          <div className="space-y-4">
            <div className="bg-gray-200 dark:bg-gray-700 h-4 w-full rounded" />
            <div className="bg-gray-200 dark:bg-gray-700 h-4 w-full rounded" />
            <div className="bg-gray-200 dark:bg-gray-700 h-4 w-5/6 rounded" />
          </div>
        </div>

        {/* Propriétés */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-gray-200 dark:bg-gray-700 h-20 rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  );
};

/**
 * Skeleton spécifique pour les pages de recettes
 */
export const RecetteDetailSkeleton: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="animate-pulse space-y-6">
        {/* Header */}
        <div className="bg-gray-200 dark:bg-gray-700 h-12 w-3/4 rounded" />
        
        {/* Metadata */}
        <div className="flex gap-4">
          <div className="bg-gray-200 dark:bg-gray-700 h-8 w-32 rounded" />
          <div className="bg-gray-200 dark:bg-gray-700 h-8 w-32 rounded" />
        </div>

        {/* Description */}
        <div className="space-y-3">
          <div className="bg-gray-200 dark:bg-gray-700 h-4 w-full rounded" />
          <div className="bg-gray-200 dark:bg-gray-700 h-4 w-full rounded" />
          <div className="bg-gray-200 dark:bg-gray-700 h-4 w-3/4 rounded" />
        </div>

        {/* Composition */}
        <div className="bg-gray-200 dark:bg-gray-700 h-96 rounded-lg" />
      </div>
    </div>
  );
};

export default SkeletonLoader;
