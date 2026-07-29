import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";

// Données d'exemple Pred-O3 (25 descripteurs olfactifs)
const PRED_O3_DESCRIPTORS = [
  { id: "fruity", name: "Fruity", description: "Fruity odor", category: "fruity", frequency: 156 },
  { id: "floral", name: "Floral", description: "Floral odor", category: "floral", frequency: 203 },
  { id: "woody", name: "Woody", description: "Woody odor", category: "woody", frequency: 178 },
  { id: "minty", name: "Minty", description: "Minty odor", category: "spicy", frequency: 142 },
  { id: "sweet", name: "Sweet", description: "Sweet odor", category: "fruity", frequency: 189 },
  { id: "spicy", name: "Spicy", description: "Spicy odor", category: "spicy", frequency: 134 },
  { id: "herbal", name: "Herbal", description: "Herbal odor", category: "herbal", frequency: 127 },
  { id: "earthy", name: "Earthy", description: "Earthy odor", category: "earthy", frequency: 156 },
  { id: "fresh", name: "Fresh", description: "Fresh odor", category: "fresh", frequency: 198 },
  { id: "citrus", name: "Citrus", description: "Citrus odor", category: "fruity", frequency: 167 },
  { id: "musky", name: "Musky", description: "Musky odor", category: "musky", frequency: 89 },
  { id: "sour", name: "Sour", description: "Sour odor", category: "sour", frequency: 76 },
  { id: "bitter", name: "Bitter", description: "Bitter odor", category: "bitter", frequency: 68 },
  { id: "pungent", name: "Pungent", description: "Pungent odor", category: "pungent", frequency: 92 },
  { id: "warm", name: "Warm", description: "Warm odor", category: "warm", frequency: 145 },
  { id: "cool", name: "Cool", description: "Cool odor", category: "cool", frequency: 123 },
  { id: "creamy", name: "Creamy", description: "Creamy odor", category: "creamy", frequency: 98 },
  { id: "powdery", name: "Powdery", description: "Powdery odor", category: "powdery", frequency: 87 },
  { id: "chemical", name: "Chemical", description: "Chemical odor", category: "chemical", frequency: 76 },
  { id: "burnt", name: "Burnt", description: "Burnt odor", category: "burnt", frequency: 64 },
  { id: "smoky", name: "Smoky", description: "Smoky odor", category: "smoky", frequency: 81 },
  { id: "animalic", name: "Animalic", description: "Animalic odor", category: "animalic", frequency: 73 },
  { id: "fishy", name: "Fishy", description: "Fishy odor", category: "fishy", frequency: 54 },
  { id: "fecal", name: "Fecal", description: "Fecal odor", category: "fecal", frequency: 42 },
  { id: "urinous", name: "Urinous", description: "Urinous odor", category: "urinous", frequency: 38 },
];

export const predO3Router = router({
  /**
   * Récupérer les descripteurs olfactifs Pred-O3
   */
  getDescriptors: publicProcedure
    .input(
      z.object({
        limit: z.number().default(100),
        offset: z.number().default(0),
        category: z.string().optional(),
      })
    )
    .query(({ input }) => {
      try {
        // Filtrer par catégorie si spécifiée
        let filtered = PRED_O3_DESCRIPTORS;
        if (input.category) {
          filtered = filtered.filter(d => d.category === input.category);
        }

        // Trier par fréquence décroissante
        filtered.sort((a, b) => (b.frequency || 0) - (a.frequency || 0));

        // Appliquer la pagination
        const paginated = filtered.slice(input.offset, input.offset + input.limit);

        return paginated;
      } catch (err) {
        console.error("Error in getDescriptors:", err);
        return [];
      }
    }),

  /**
   * Récupérer les statistiques des descripteurs
   */
  getStats: publicProcedure.query(() => {
    try {
      const total = PRED_O3_DESCRIPTORS.length;
      const categories = new Set(PRED_O3_DESCRIPTORS.map(d => d.category).filter(Boolean));
      const frequencies = PRED_O3_DESCRIPTORS.map(d => d.frequency || 0);
      const totalFrequency = frequencies.reduce((a, b) => a + b, 0);
      const maxFrequency = Math.max(...frequencies);
      const minFrequency = Math.min(...frequencies);

      return {
        total,
        categories: categories.size,
        totalFrequency,
        maxFrequency,
        minFrequency,
      };
    } catch (err) {
      console.error("Error in getStats:", err);
      return {
        total: 0,
        categories: 0,
        totalFrequency: 0,
        maxFrequency: 0,
        minFrequency: 0,
      };
    }
  }),

  /**
   * Rechercher des descripteurs par terme
   */
  searchDescriptors: publicProcedure
    .input(z.object({ query: z.string() }))
    .query(({ input }) => {
      try {
        const term = input.query.toLowerCase();
        return PRED_O3_DESCRIPTORS.filter(
          d =>
            d.name.toLowerCase().includes(term) ||
            d.description?.toLowerCase().includes(term) ||
            d.id.toLowerCase().includes(term)
        );
      } catch (err) {
        console.error("Error in searchDescriptors:", err);
        return [];
      }
    }),

  /**
   * Récupérer les catégories disponibles
   */
  getCategories: publicProcedure.query(() => {
    try {
      const categories = new Set(PRED_O3_DESCRIPTORS.map(d => d.category).filter(Boolean));
      return Array.from(categories).sort();
    } catch (err) {
      console.error("Error in getCategories:", err);
      return [];
    }
  }),
});
