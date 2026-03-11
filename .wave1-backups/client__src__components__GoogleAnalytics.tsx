// @ts-nocheck
import { useEffect } from "react";
import { useLocation } from "wouter";

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[];
  }
}

const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

/**
 * Initialize Google Analytics 4 (gtag.js)
 * This component should be placed once at the root of your app
 */
export function GoogleAnalytics() {
  const [location] = useLocation();

  // Load GA script on mount
  useEffect(() => {
    if (!GA_MEASUREMENT_ID || GA_MEASUREMENT_ID === "") {
      console.warn("Google Analytics: VITE_GA_MEASUREMENT_ID not configured");
      return;
    }

    // Check if script is already loaded
    if (document.querySelector(`script[src*="googletagmanager.com/gtag/js"]`)) {
      return;
    }

    // Create and append the gtag.js script
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    document.head.appendChild(script);

    // Initialize dataLayer and gtag function
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag(...args: unknown[]) {
      window.dataLayer.push(args);
    };

    window.gtag("js", new Date());
    window.gtag("config", GA_MEASUREMENT_ID, {
      send_page_view: false, // We'll send page views manually for SPA
    });
  }, []);

  // Track page views on route change
  useEffect(() => {
    if (!GA_MEASUREMENT_ID || !window.gtag) return;

    window.gtag("event", "page_view", {
      page_path: location,
      page_title: document.title,
    });
  }, [location]);

  return null;
}

/**
 * Track custom events in Google Analytics
 * @param eventName - The name of the event
 * @param eventParams - Additional parameters for the event
 */
export function trackEvent(
  eventName: string,
  eventParams?: Record<string, unknown>
) {
  if (!GA_MEASUREMENT_ID || !window.gtag) {
    console.warn("Google Analytics: Cannot track event, GA not initialized");
    return;
  }

  window.gtag("event", eventName, eventParams);
}

/**
 * Pre-defined event tracking functions for common actions
 */
export const gaEvents = {
  // Search events
  search: (searchTerm: string, category?: string) =>
    trackEvent("search", { search_term: searchTerm, category }),

  // Content interaction
  viewMolecule: (moleculeId: number, moleculeName: string) =>
    trackEvent("view_molecule", { molecule_id: moleculeId, molecule_name: moleculeName }),

  viewPlant: (plantId: number, plantName: string) =>
    trackEvent("view_plant", { plant_id: plantId, plant_name: plantName }),

  viewRecipe: (recipeId: number, recipeName: string) =>
    trackEvent("view_recipe", { recipe_id: recipeId, recipe_name: recipeName }),

  viewSpectrum: (spectrumId: number, compoundName: string) =>
    trackEvent("view_spectrum", { spectrum_id: spectrumId, compound_name: compoundName }),

  // Tool usage
  useSpectrumComparison: (spectraCount: number) =>
    trackEvent("use_spectrum_comparison", { spectra_count: spectraCount }),

  useSpectrumIdentification: (peaksCount: number) =>
    trackEvent("use_spectrum_identification", { peaks_count: peaksCount }),

  useChromatogramViewer: (chromatogramId: number) =>
    trackEvent("use_chromatogram_viewer", { chromatogram_id: chromatogramId }),

  useFormulaGenerator: (ingredientCount: number) =>
    trackEvent("use_formula_generator", { ingredient_count: ingredientCount }),

  // Data export
  exportData: (format: string, entityType: string, count: number) =>
    trackEvent("export_data", { format, entity_type: entityType, count }),

  // File upload
  uploadFile: (fileType: string, fileSize: number) =>
    trackEvent("upload_file", { file_type: fileType, file_size: fileSize }),

  // User actions
  createEntry: (entityType: string) =>
    trackEvent("create_entry", { entity_type: entityType }),

  updateEntry: (entityType: string) =>
    trackEvent("update_entry", { entity_type: entityType }),

  deleteEntry: (entityType: string) =>
    trackEvent("delete_entry", { entity_type: entityType }),

  // Navigation
  clickMegaMenu: (section: string) =>
    trackEvent("click_mega_menu", { section }),

  clickQuickAction: (action: string) =>
    trackEvent("click_quick_action", { action }),
};

export default GoogleAnalytics;
