/**
 * Système de métriques pour surveiller les performances des endpoints
 * Collecte les temps de réponse et calcule les statistiques
 */

interface MetricEntry {
  endpoint: string;
  duration: number; // en ms
  timestamp: number;
  success: boolean;
}

interface EndpointStats {
  endpoint: string;
  count: number;
  avgDuration: number;
  minDuration: number;
  maxDuration: number;
  p50: number;
  p95: number;
  p99: number;
  successRate: number;
  lastCalled: string;
}

class MetricsCollector {
  private metrics: MetricEntry[] = [];
  private readonly maxEntries = 10000; // Garder les 10000 dernières entrées
  private readonly retentionMs = 24 * 60 * 60 * 1000; // 24 heures

  /**
   * Enregistrer une métrique pour un endpoint
   */
  record(endpoint: string, duration: number, success: boolean = true): void {
    const entry: MetricEntry = {
      endpoint,
      duration,
      timestamp: Date.now(),
      success,
    };

    this.metrics.push(entry);

    // Nettoyer les anciennes entrées si nécessaire
    if (this.metrics.length > this.maxEntries) {
      this.cleanup();
    }
  }

  /**
   * Wrapper pour mesurer automatiquement le temps d'exécution
   */
  async measure<T>(endpoint: string, fn: () => Promise<T>): Promise<T> {
    const start = performance.now();
    let success = true;

    try {
      const result = await fn();
      return result;
    } catch (error) {
      success = false;
      throw error;
    } finally {
      const duration = performance.now() - start;
      this.record(endpoint, duration, success);
    }
  }

  /**
   * Obtenir les statistiques pour tous les endpoints
   */
  getStats(): EndpointStats[] {
    this.cleanup();

    // Grouper par endpoint
    const byEndpoint = new Map<string, MetricEntry[]>();
    for (const entry of this.metrics) {
      const existing = byEndpoint.get(entry.endpoint) || [];
      existing.push(entry);
      byEndpoint.set(entry.endpoint, existing);
    }

    // Calculer les stats pour chaque endpoint
    const stats: EndpointStats[] = [];
    for (const [endpoint, entries] of Array.from(byEndpoint.entries())) {
      const durations = entries.map((e: MetricEntry) => e.duration).sort((a: number, b: number) => a - b);
      const successCount = entries.filter((e: MetricEntry) => e.success).length;

      stats.push({
        endpoint,
        count: entries.length,
        avgDuration: Math.round(durations.reduce((a, b) => a + b, 0) / durations.length),
        minDuration: Math.round(durations[0]),
        maxDuration: Math.round(durations[durations.length - 1]),
        p50: Math.round(this.percentile(durations, 50)),
        p95: Math.round(this.percentile(durations, 95)),
        p99: Math.round(this.percentile(durations, 99)),
        successRate: Math.round((successCount / entries.length) * 100),
        lastCalled: new Date(Math.max(...entries.map((e) => e.timestamp))).toISOString(),
      });
    }

    // Trier par nombre d'appels décroissant
    return stats.sort((a, b) => b.count - a.count);
  }

  /**
   * Obtenir un résumé global des métriques
   */
  getSummary(): {
    totalRequests: number;
    avgResponseTime: number;
    successRate: number;
    topEndpoints: { endpoint: string; count: number }[];
    slowestEndpoints: { endpoint: string; avgDuration: number }[];
    timestamp: string;
  } {
    const stats = this.getStats();
    const allDurations = this.metrics.map((m: MetricEntry) => m.duration);
    const successCount = this.metrics.filter((m: MetricEntry) => m.success).length;

    return {
      totalRequests: this.metrics.length,
      avgResponseTime: allDurations.length > 0
        ? Math.round(allDurations.reduce((a, b) => a + b, 0) / allDurations.length)
        : 0,
      successRate: this.metrics.length > 0
        ? Math.round((successCount / this.metrics.length) * 100)
        : 100,
      topEndpoints: stats.slice(0, 5).map((s) => ({
        endpoint: s.endpoint,
        count: s.count,
      })),
      slowestEndpoints: [...stats]
        .sort((a, b) => b.avgDuration - a.avgDuration)
        .slice(0, 5)
        .map((s) => ({
          endpoint: s.endpoint,
          avgDuration: s.avgDuration,
        })),
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Vider toutes les métriques
   */
  clear(): void {
    this.metrics = [];
  }

  /**
   * Calculer un percentile
   */
  private percentile(sortedArr: number[], p: number): number {
    if (sortedArr.length === 0) return 0;
    const index = Math.ceil((p / 100) * sortedArr.length) - 1;
    return sortedArr[Math.max(0, index)];
  }

  /**
   * Nettoyer les entrées anciennes
   */
  private cleanup(): void {
    const cutoff = Date.now() - this.retentionMs;
    this.metrics = this.metrics.filter((m) => m.timestamp > cutoff);

    // Si toujours trop d'entrées, garder les plus récentes
    if (this.metrics.length > this.maxEntries) {
      this.metrics = this.metrics.slice(-this.maxEntries);
    }
  }
}

// Instance singleton
export const metrics = new MetricsCollector();

// Helper pour wrapper les procédures tRPC
export function withMetrics<T>(endpoint: string, fn: () => Promise<T>): Promise<T> {
  return metrics.measure(endpoint, fn);
}
