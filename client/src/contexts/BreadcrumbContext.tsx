import React, { createContext, useContext, useState, useCallback } from "react";

interface BreadcrumbSegment {
  label: string;
  path: string;
  dropdown?: Array<{ label: string; path: string }>;
}

interface BreadcrumbContextValue {
  segments: BreadcrumbSegment[] | null;
  setSegments: (segments: BreadcrumbSegment[] | null) => void;
}

const BreadcrumbContext = createContext<BreadcrumbContextValue>({
  segments: null,
  setSegments: () => {},
});

export function BreadcrumbProvider({ children }: { children: React.ReactNode }) {
  const [segments, setSegmentsState] = useState<BreadcrumbSegment[] | null>(null);

  const setSegments = useCallback((segs: BreadcrumbSegment[] | null) => {
    setSegmentsState(segs);
  }, []);

  return (
    <BreadcrumbContext.Provider value={{ segments, setSegments }}>
      {children}
    </BreadcrumbContext.Provider>
  );
}

export function useBreadcrumb() {
  return useContext(BreadcrumbContext);
}

/**
 * Hook utilitaire pour définir les segments du breadcrumb depuis une page de détail.
 * Appeler dans un useEffect après le chargement des données.
 */
export function useBreadcrumbSegments(segments: BreadcrumbSegment[] | null, deps: React.DependencyList) {
  const { setSegments } = useBreadcrumb();
  React.useEffect(() => {
    if (segments) {
      setSegments(segments);
    }
    return () => {
      // Réinitialiser quand on quitte la page
      setSegments(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
