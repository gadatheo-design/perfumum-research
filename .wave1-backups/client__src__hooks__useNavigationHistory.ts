// @ts-nocheck
import { safeJsonParse } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";

interface HistoryEntry {
  path: string;
  title: string;
  timestamp: number;
}

const MAX_HISTORY = 10;
const STORAGE_KEY = "perfumum_navigation_history";

export function useNavigationHistory() {
  const [location] = useLocation();
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  // Charger l'historique depuis localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setHistory(safeJsonParse(stored, []));
      } catch (e) {
        console.error("Failed to parse navigation history", e);
      }
    }
  }, []);

  // Ajouter la page actuelle à l'historique
  useEffect(() => {
    const title = getPageTitle(location);
    
    // Ne pas ajouter si c'est la même page que la dernière
    if (history.length > 0 && history[0].path === location) {
      return;
    }

    const newEntry: HistoryEntry = {
      path: location,
      title,
      timestamp: Date.now(),
    };

    const newHistory = [newEntry, ...history].slice(0, MAX_HISTORY);
    setHistory(newHistory);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
  }, [location]);

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  return {
    history,
    clearHistory,
  };
}

// Helper pour obtenir le titre de la page depuis le path
function getPageTitle(path: string): string {
  if (path === "/") return "Accueil";
  if (path === "/terpenes") return "Terpènes";
  if (path === "/resines-cbd") return "Résines CBD";
  if (path === "/graphe-molecules-recettes") return "Graphe Molécules-Recettes";
  if (path === "/matrice-synergies") return "Matrice Synergies";
  if (path === "/compare-terpenes") return "Comparaison Terpènes";
  if (path === "/compare-radar") return "Comparaison Radar";
  if (path === "/galerie-botaniques") return "Galerie Botaniques";
  if (path === "/admin") return "Administration";
  if (path === "/admin/import-export") return "Import/Export CSV";
  if (path.startsWith("/terpene/")) return "Détail Terpène";
  if (path.startsWith("/recette/")) return "Détail Recette";
  if (path.startsWith("/molecule/")) return "Détail Molécule";
  if (path.startsWith("/civilisation/")) return "Détail Tradition Olfactive";
  
  // Fallback : capitaliser le path
  return path
    .split("/")
    .filter(Boolean)
    .map(segment => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" > ");
}
