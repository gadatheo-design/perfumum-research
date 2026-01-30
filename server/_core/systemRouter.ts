import { z } from "zod";
import { notifyOwner } from "./notification";
import { adminProcedure, publicProcedure, router } from "./trpc";
import { cache } from "../cache";

export const systemRouter = router({
  health: publicProcedure
    .input(
      z.object({
        timestamp: z.number().min(0, "timestamp cannot be negative"),
      })
    )
    .query(() => ({
      ok: true,
    })),

  notifyOwner: adminProcedure
    .input(
      z.object({
        title: z.string().min(1, "title is required"),
        content: z.string().min(1, "content is required"),
      })
    )
    .mutation(async ({ input }) => {
      const delivered = await notifyOwner(input);
      return {
        success: delivered,
      } as const;
    }),

  // Endpoint de monitoring du cache (admin seulement)
  cacheStats: adminProcedure.query(() => {
    const stats = cache.getStats();
    return {
      ...stats,
      timestamp: new Date().toISOString(),
      description: {
        hits: "Nombre de requêtes servies depuis le cache",
        misses: "Nombre de requêtes ayant nécessité un accès DB",
        size: "Nombre d'entrées actuellement en cache",
        maxSize: "Capacité maximale du cache",
        hitRate: "Pourcentage de requêtes servies depuis le cache",
      },
    };
  }),

  // Vider le cache (admin seulement)
  clearCache: adminProcedure.mutation(() => {
    cache.clear();
    return {
      success: true,
      message: "Cache vidé avec succès",
      timestamp: new Date().toISOString(),
    };
  }),
});
