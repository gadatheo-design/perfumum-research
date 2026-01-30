import { useCallback, useRef } from "react";
import { trpc } from "@/lib/trpc";

/**
 * Hook pour précharger les données lors du survol des liens
 * Améliore la perception de performance en anticipant les navigations
 */

// Délai avant de déclencher le prefetch (évite les prefetch accidentels)
const PREFETCH_DELAY = 150; // ms

// Cache des prefetch déjà effectués pour éviter les doublons
const prefetchedCache = new Set<string>();

export function usePrefetch() {
  const utils = trpc.useUtils();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Prefetch une molécule par ID
  const prefetchMolecule = useCallback(
    (id: number) => {
      const key = `molecule:${id}`;
      if (prefetchedCache.has(key)) return;

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        prefetchedCache.add(key);
        // Le prefetch remplit le cache tRPC
        utils.molecules.list.prefetch();
      }, PREFETCH_DELAY);
    },
    [utils]
  );

  // Prefetch une plante par ID
  const prefetchPlant = useCallback(
    (id: number) => {
      const key = `plant:${id}`;
      if (prefetchedCache.has(key)) return;

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        prefetchedCache.add(key);
        utils.plants.list.prefetch();
      }, PREFETCH_DELAY);
    },
    [utils]
  );

  // Prefetch une recette par ID
  const prefetchRecette = useCallback(
    (id: number) => {
      const key = `recette:${id}`;
      if (prefetchedCache.has(key)) return;

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        prefetchedCache.add(key);
        utils.recettes.list.prefetch();
      }, PREFETCH_DELAY);
    },
    [utils]
  );

  // Prefetch la liste des molécules
  const prefetchMoleculesList = useCallback(() => {
    const key = "molecules:list";
    if (prefetchedCache.has(key)) return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      prefetchedCache.add(key);
      utils.molecules.list.prefetch();
    }, PREFETCH_DELAY);
  }, [utils]);

  // Prefetch la liste des plantes
  const prefetchPlantsList = useCallback(() => {
    const key = "plants:list";
    if (prefetchedCache.has(key)) return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      prefetchedCache.add(key);
      utils.plants.list.prefetch();
    }, PREFETCH_DELAY);
  }, [utils]);

  // Prefetch la liste des recettes
  const prefetchRecettesList = useCallback(() => {
    const key = "recettes:list";
    if (prefetchedCache.has(key)) return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      prefetchedCache.add(key);
      utils.recettes.list.prefetch();
    }, PREFETCH_DELAY);
  }, [utils]);

  // Annuler le prefetch en cours (utile pour onMouseLeave)
  const cancelPrefetch = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  // Vider le cache de prefetch (utile après une mutation)
  const clearPrefetchCache = useCallback(() => {
    prefetchedCache.clear();
  }, []);

  return {
    // Prefetch par entité
    prefetchMolecule,
    prefetchPlant,
    prefetchRecette,
    // Prefetch des listes
    prefetchMoleculesList,
    prefetchPlantsList,
    prefetchRecettesList,
    // Utilitaires
    cancelPrefetch,
    clearPrefetchCache,
  };
}

/**
 * Composant wrapper pour ajouter le prefetch aux liens
 * Usage: <PrefetchLink to="/molecules/42" prefetchType="molecule" prefetchId={42}>...</PrefetchLink>
 */
export function usePrefetchHandlers(
  type: "molecule" | "plant" | "recette" | "molecules" | "plants" | "recettes",
  id?: number
) {
  const {
    prefetchMolecule,
    prefetchPlant,
    prefetchRecette,
    prefetchMoleculesList,
    prefetchPlantsList,
    prefetchRecettesList,
    cancelPrefetch,
  } = usePrefetch();

  const onMouseEnter = useCallback(() => {
    switch (type) {
      case "molecule":
        if (id) prefetchMolecule(id);
        break;
      case "plant":
        if (id) prefetchPlant(id);
        break;
      case "recette":
        if (id) prefetchRecette(id);
        break;
      case "molecules":
        prefetchMoleculesList();
        break;
      case "plants":
        prefetchPlantsList();
        break;
      case "recettes":
        prefetchRecettesList();
        break;
    }
  }, [
    type,
    id,
    prefetchMolecule,
    prefetchPlant,
    prefetchRecette,
    prefetchMoleculesList,
    prefetchPlantsList,
    prefetchRecettesList,
  ]);

  const onMouseLeave = cancelPrefetch;

  return { onMouseEnter, onMouseLeave };
}
