import { useState, useEffect, useRef, ComponentType } from "react";

/**
 * Hook personnalisé pour charger des composants lourds uniquement quand ils sont visibles
 * Améliore les performances en réduisant le bundle initial
 */
export function useLazyComponent<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  options: {
    rootMargin?: string;
    threshold?: number;
    eager?: boolean;
  } = {}
) {
  const { rootMargin = "100px", threshold = 0.1, eager = false } = options;
  const [Component, setComponent] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const loadComponent = async () => {
    if (Component || isLoading) return;

    setIsLoading(true);
    try {
      const module = await importFn();
      setComponent(() => module.default);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to load component"));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (eager) {
      loadComponent();
    }
  }, [eager]);

  const ref = (node: HTMLElement | null) => {
    if (eager || Component) return;

    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    if (node) {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            loadComponent();
            observerRef.current?.disconnect();
          }
        },
        { rootMargin, threshold }
      );

      observerRef.current.observe(node);
    }
  };

  return { Component, isLoading, error, ref };
}

/**
 * Hook pour précharger des composants avant qu'ils soient nécessaires
 */
export function usePrefetchComponent<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  delay: number = 0
) {
  useEffect(() => {
    const timer = setTimeout(() => {
      importFn().catch((err) => {
        console.warn("Failed to prefetch component:", err);
      });
    }, delay);

    return () => clearTimeout(timer);
  }, [importFn, delay]);
}

/**
 * Hook pour charger des données de manière lazy avec Intersection Observer
 */
export function useLazyData<T>(
  fetchFn: () => Promise<T>,
  options: {
    rootMargin?: string;
    threshold?: number;
    eager?: boolean;
  } = {}
) {
  const { rootMargin = "100px", threshold = 0.1, eager = false } = options;
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const hasFetched = useRef(false);

  const fetchData = async () => {
    if (hasFetched.current || isLoading) return;

    hasFetched.current = true;
    setIsLoading(true);
    try {
      const result = await fetchFn();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch data"));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (eager) {
      fetchData();
    }
  }, [eager]);

  const ref = (node: HTMLElement | null) => {
    if (eager || hasFetched.current) return;

    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    if (node) {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            fetchData();
            observerRef.current?.disconnect();
          }
        },
        { rootMargin, threshold }
      );

      observerRef.current.observe(node);
    }
  };

  return { data, isLoading, error, ref, refetch: fetchData };
}

export default useLazyComponent;
