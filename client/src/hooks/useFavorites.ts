import { useState, useEffect } from "react";

const FAVORITES_KEY = "perfumum_favorites";

/**
 * Hook personnalisé pour gérer les favoris avec localStorage
 * 
 * Fonctionnalités :
 * - Persiste les favoris dans localStorage
 * - Synchronise entre onglets
 * - Toggle favori (ajouter/retirer)
 * - Vérifier si un item est favori
 * - Obtenir tous les favoris
 */
export function useFavorites() {
  const [favorites, setFavorites] = useState<number[]>(() => {
    try {
      const stored = localStorage.getItem(FAVORITES_KEY);
      return stored ? JSON.parse(stored) : [];
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
          setFavorites(JSON.parse(e.newValue));
        } catch {
          // Ignorer les erreurs de parsing
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const toggleFavorite = (id: number) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]
    );
  };

  const isFavorite = (id: number) => favorites.includes(id);

  const clearFavorites = () => setFavorites([]);

  return {
    favorites,
    toggleFavorite,
    isFavorite,
    clearFavorites,
    count: favorites.length,
  };
}
