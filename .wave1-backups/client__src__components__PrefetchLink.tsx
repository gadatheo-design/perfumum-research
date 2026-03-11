// @ts-nocheck
import { Link } from "wouter";
import { usePrefetchHandlers } from "@/hooks/usePrefetch";
import { ReactNode } from "react";

interface PrefetchLinkProps {
  to: string;
  prefetchType: "molecule" | "plant" | "recette" | "molecules" | "plants" | "recettes";
  prefetchId?: number;
  children: ReactNode;
  className?: string;
}

/**
 * Composant Link avec prefetching automatique au survol
 * 
 * Usage:
 * <PrefetchLink to="/molecules/42" prefetchType="molecule" prefetchId={42}>
 *   Voir la molécule
 * </PrefetchLink>
 * 
 * <PrefetchLink to="/molecules" prefetchType="molecules">
 *   Liste des molécules
 * </PrefetchLink>
 */
export function PrefetchLink({
  to,
  prefetchType,
  prefetchId,
  children,
  className,
}: PrefetchLinkProps) {
  const { onMouseEnter, onMouseLeave } = usePrefetchHandlers(prefetchType, prefetchId);

  return (
    <Link
      to={to}
      className={className}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </Link>
  );
}

export default PrefetchLink;
