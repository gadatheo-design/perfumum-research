import { safeJsonParse } from "@/lib/utils";
import { useState, useEffect } from 'react';

const HISTORY_KEY = 'perfumum_recipe_history';
const MAX_HISTORY_ITEMS = 20;

export interface RecipeHistoryItem {
  id: number;
  name: string;
  category: string | null;
  timestamp: number;
}

export function useRecipeHistory() {
  const [history, setHistory] = useState<RecipeHistoryItem[]>([]);

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(HISTORY_KEY);
      if (stored) {
        const parsed = safeJsonParse(stored, null);
        setHistory(parsed);
      }
    } catch (error) {
      console.error('[useRecipeHistory] Failed to load history:', error);
    }
  }, []);

  // Add recipe to history
  const addToHistory = (recipe: Omit<RecipeHistoryItem, 'timestamp'>) => {
    setHistory((prev) => {
      // Remove existing entry if present
      const filtered = prev.filter((item) => item.id !== recipe.id);
      
      // Add new entry at the beginning
      const updated = [
        { ...recipe, timestamp: Date.now() },
        ...filtered,
      ].slice(0, MAX_HISTORY_ITEMS);

      // Save to localStorage
      try {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
      } catch (error) {
        console.error('[useRecipeHistory] Failed to save history:', error);
      }

      return updated;
    });
  };

  // Clear history
  const clearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem(HISTORY_KEY);
    } catch (error) {
      console.error('[useRecipeHistory] Failed to clear history:', error);
    }
  };

  // Remove specific item
  const removeFromHistory = (id: number) => {
    setHistory((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      try {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
      } catch (error) {
        console.error('[useRecipeHistory] Failed to update history:', error);
      }
      return updated;
    });
  };

  return {
    history,
    addToHistory,
    clearHistory,
    removeFromHistory,
  };
}
