// @ts-nocheck
import ReactGA from "react-ga4";

const isDev = import.meta.env.DEV;

/**
 * Initialize Google Analytics
 * Call this function once on app startup
 */
export const initializeAnalytics = (measurementId: string) => {
  if (!measurementId) {
    console.warn("[Analytics] No measurement ID provided. Analytics disabled.");
    return;
  }

  try {
    ReactGA.initialize(measurementId);
    if (isDev) console.debug("[Analytics] Google Analytics initialized with ID:", measurementId);
  } catch (error) {
    console.error("[Analytics] Failed to initialize Google Analytics:", error);
  }
};

/**
 * Track page view
 * Call this when the route changes
 */
export const trackPageView = (path: string, title?: string) => {
  try {
    ReactGA.send({
      hitType: "pageview",
      page: path,
      title: title || document.title,
    });
    if (isDev) console.debug("[Analytics] Page view tracked:", path);
  } catch (error) {
    console.error("[Analytics] Failed to track page view:", error);
  }
};

/**
 * Track URL redirects
 * Useful for monitoring URL migrations
 */
export const trackRedirect = (fromUrl: string, toUrl: string, reason?: string) => {
  try {
    ReactGA.event({
      category: "redirect",
      action: "url_redirect",
      label: `${fromUrl} → ${toUrl}`,
      value: reason ? `reason: ${reason}` : undefined,
    });
    if (isDev) console.debug("[Analytics] Redirect tracked:", { fromUrl, toUrl, reason });
  } catch (error) {
    console.error("[Analytics] Failed to track redirect:", error);
  }
};

/**
 * Track custom events
 */
export const trackEvent = (
  category: string,
  action: string,
  label?: string,
  value?: number
) => {
  try {
    ReactGA.event({
      category,
      action,
      label,
      value,
    });
    if (isDev) console.debug("[Analytics] Event tracked:", { category, action, label, value });
  } catch (error) {
    console.error("[Analytics] Failed to track event:", error);
  }
};

/**
 * Track molecule search
 */
export const trackMoleculeSearch = (query: string, resultsCount: number) => {
  trackEvent("search", "molecule_search", query, resultsCount);
};

/**
 * Track recipe search
 */
export const trackRecipeSearch = (query: string, resultsCount: number) => {
  trackEvent("search", "recipe_search", query, resultsCount);
};

/**
 * Track plant search
 */
export const trackPlantSearch = (query: string, resultsCount: number) => {
  trackEvent("search", "plant_search", query, resultsCount);
};

/**
 * Track tool usage
 */
export const trackToolUsage = (toolName: string) => {
  trackEvent("tool", "tool_usage", toolName);
};

/**
 * Track visualization view
 */
export const trackVisualizationView = (visualizationType: string) => {
  trackEvent("visualization", "view", visualizationType);
};

/**
 * Track data export
 */
export const trackDataExport = (format: string, entityType: string) => {
  trackEvent("export", "data_export", `${entityType}_${format}`);
};
