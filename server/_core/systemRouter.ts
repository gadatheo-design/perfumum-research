import { z } from "zod";
import { notifyOwner } from "./notification";
import { adminProcedure, publicProcedure, router } from "./trpc";
import { cache } from "../cache";
import { metrics } from "../metrics";
import { cacheMonitor } from "../cacheMonitor";

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

  // Endpoint de métriques de performance (admin seulement)
  metrics: adminProcedure.query(() => {
    const summary = metrics.getSummary();
    const detailed = metrics.getStats();
    return {
      summary,
      detailed: detailed.slice(0, 20), // Top 20 endpoints
      description: {
        totalRequests: "Nombre total de requêtes enregistrées",
        avgResponseTime: "Temps de réponse moyen en ms",
        successRate: "Pourcentage de requêtes réussies",
        p50: "Temps de réponse médian (50e percentile)",
        p95: "Temps de réponse au 95e percentile",
        p99: "Temps de réponse au 99e percentile",
      },
    };
  }),

  // Statistiques détaillées par endpoint (admin seulement)
  metricsDetailed: adminProcedure
    .input(
      z.object({
        endpoint: z.string().optional(),
      })
    )
    .query(({ input }) => {
      const allStats = metrics.getStats();
      if (input.endpoint) {
        return allStats.filter((s) => s.endpoint.includes(input.endpoint!));
      }
      return allStats;
    }),

  // Vider les métriques (admin seulement)
  clearMetrics: adminProcedure.mutation(() => {
    metrics.clear();
    return {
      success: true,
      message: "Métriques vidées avec succès",
      timestamp: new Date().toISOString(),
    };
  }),

  // Statut du moniteur de cache (admin seulement)
  cacheMonitorStatus: adminProcedure.query(() => {
    return cacheMonitor.getStatus();
  }),

  // Vérifier manuellement le hit rate (admin seulement)
  checkCacheHitRate: adminProcedure.mutation(async () => {
    const result = await cacheMonitor.check();
    return result;
  }),

  // Démarrer/arrêter le moniteur de cache (admin seulement)
  toggleCacheMonitor: adminProcedure
    .input(
      z.object({
        action: z.enum(["start", "stop"]),
      })
    )
    .mutation(({ input }) => {
      if (input.action === "start") {
        cacheMonitor.start();
      } else {
        cacheMonitor.stop();
      }
      return {
        success: true,
        status: cacheMonitor.getStatus(),
      };
    }),
});
