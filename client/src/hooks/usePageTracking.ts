import { useEffect } from "react";
import { trackPageView } from "@/lib/analytics";

/**
 * Hook pour tracker automatiquement les pages vues
 * Utilisation : usePageTracking("/molecules", "Molécules")
 */
export const usePageTracking = (path: string, title?: string) => {
  useEffect(() => {
    trackPageView(path, title);
  }, [path, title]);
};
