// @ts-nocheck
import { safeJsonParse } from "@/lib/utils";
import { useState, useEffect } from 'react';

const SEARCHES_KEY = 'perfumum_saved_searches';
const MAX_SAVED_SEARCHES = 10;

export interface SavedSearch {
  id: string;
  name: string;
  filters: {
    searchTerm?: string;
    gamme?: string | null;
    family?: string | null;
    prototype?: string | null;
    ingredient?: string | null;
    radarFilters?: {
      intensity?: [number, number];
      freshness?: [number, number];
      warmth?: [number, number];
      sweetness?: [number, number];
      spiciness?: [number, number];
      earthiness?: [number, number];
    };
  };
  timestamp: number;
}

export function useSavedSearches() {
  const [searches, setSearches] = useState<SavedSearch[]>([]);

  // Load searches from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(SEARCHES_KEY);
      if (stored) {
        const parsed = safeJsonParse(stored, null);
        setSearches(parsed);
      }
    } catch (error) {
      console.error('[useSavedSearches] Failed to load searches:', error);
    }
  }, []);

  // Save search
  const saveSearch = (name: string, filters: SavedSearch['filters']) => {
    const newSearch: SavedSearch = {
      id: `search_${Date.now()}`,
      name,
      filters,
      timestamp: Date.now(),
    };

    setSearches((prev) => {
      const updated = [newSearch, ...prev].slice(0, MAX_SAVED_SEARCHES);
      
      try {
        localStorage.setItem(SEARCHES_KEY, JSON.stringify(updated));
      } catch (error) {
        console.error('[useSavedSearches] Failed to save search:', error);
      }

      return updated;
    });

    return newSearch;
  };

  // Delete search
  const deleteSearch = (id: string) => {
    setSearches((prev) => {
      const updated = prev.filter((search) => search.id !== id);
      
      try {
        localStorage.setItem(SEARCHES_KEY, JSON.stringify(updated));
      } catch (error) {
        console.error('[useSavedSearches] Failed to delete search:', error);
      }

      return updated;
    });
  };

  // Clear all searches
  const clearSearches = () => {
    setSearches([]);
    try {
      localStorage.removeItem(SEARCHES_KEY);
    } catch (error) {
      console.error('[useSavedSearches] Failed to clear searches:', error);
    }
  };

  return {
    searches,
    saveSearch,
    deleteSearch,
    clearSearches,
  };
}
