import { safeJsonParse } from "@/lib/utils";
import { useState, useEffect, useCallback } from "react";

const FAVORITES_KEY = "perfumum_favorites";

export interface FavoritePage {
  id: string;
  title: string;
  href: string;
  icon?: string;
  description?: string;
  addedAt: number;
}

/**
 * Hook personnalisé pour gérer les favoris avec localStorage
 * 
 * Fonctionnalités :
 * - Persiste les favoris dans localStorage
 * - Synchronise entre onglets
 * - Support pour pages complètes (titre, description, icône)
 * - Toggle favori (ajouter/retirer)
 * - Vérifier si un item est favori
 * - Réorganiser les favoris
 */
export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoritePage[]>(() => {
    try {
      const stored = localStorage.getItem(FAVORITES_KEY);
      return stored ? safeJsonParse(stored, []) : [];
    } catch {
      return [];
    }
  });

  // Synchroniser avec localStorage à chaque changement
  useEffect(() => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }, [favorites]);

  // Écouter les changements de localStorage (synchronisation entre onglets)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === FAVORITES_KEY && e.newValue) {
        try {
          setFavorites(safeJsonParse(e.newValue, []));
        } catch {
          // Ignorer les erreurs de parsing
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const toggleFavorite = useCallback((page: Omit<FavoritePage, "addedAt">) => {
    setFavorites((prev) => {
      const exists = prev.some((fav) => fav.href === page.href);
      if (exists) {
        return prev.filter((fav) => fav.href !== page.href);
      } else {
        return [...prev, { ...page, addedAt: Date.now() }];
      }
    });
  }, []);

  const isFavorite = useCallback((href: string) => {
    return favorites.some((fav) => fav.href === href);
  }, [favorites]);

  const addFavorite = useCallback((page: Omit<FavoritePage, "addedAt">) => {
    if (!isFavorite(page.href)) {
      toggleFavorite(page);
    }
  }, [isFavorite, toggleFavorite]);

  const removeFavorite = useCallback((href: string) => {
    setFavorites((prev) => prev.filter((fav) => fav.href !== href));
  }, []);

  const reorderFavorites = useCallback((newOrder: FavoritePage[]) => {
    setFavorites(newOrder);
  }, []);

  const clearFavorites = () => setFavorites([]);

  return {
    favorites,
    toggleFavorite,
    isFavorite,
    addFavorite,
    removeFavorite,
    reorderFavorites,
    clearFavorites,
    count: favorites.length,
  };
}
