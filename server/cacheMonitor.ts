/**
 * PERFUMUM Cache Monitor
 * 
 * Système de surveillance du cache avec notifications automatiques
 * lorsque le hit rate descend sous un seuil critique.
 */

import { cache } from "./cache";
import { notifyOwner } from "./_core/notification";

interface MonitorConfig {
  hitRateThreshold: number;      // Seuil d'alerte (en %)
  checkIntervalMs: number;       // Intervalle de vérification (en ms)
  minRequestsBeforeAlert: number; // Nombre minimum de requêtes avant d'alerter
  cooldownMs: number;            // Délai entre deux alertes
}

interface MonitorState {
  lastAlertTime: number;
  isRunning: boolean;
  intervalId: NodeJS.Timeout | null;
  alertCount: number;
}

const defaultConfig: MonitorConfig = {
  hitRateThreshold: 50,           // Alerte si hit rate < 50%
  checkIntervalMs: 5 * 60 * 1000, // Vérifier toutes les 5 minutes
  minRequestsBeforeAlert: 100,    // Au moins 100 requêtes avant d'alerter
  cooldownMs: 60 * 60 * 1000,     // 1 heure entre deux alertes
};

class CacheMonitor {
  private config: MonitorConfig;
  private state: MonitorState;

  constructor(config: Partial<MonitorConfig> = {}) {
    this.config = { ...defaultConfig, ...config };
    this.state = {
      lastAlertTime: 0,
      isRunning: false,
      intervalId: null,
      alertCount: 0,
    };
  }

  /**
   * Démarrer la surveillance automatique
   */
  start(): void {
    if (this.state.isRunning) {
      console.log("[CacheMonitor] Déjà en cours d'exécution");
      return;
    }

    this.state.isRunning = true;
    this.state.intervalId = setInterval(() => {
      this.check();
    }, this.config.checkIntervalMs);

    console.log(`[CacheMonitor] Démarré - Vérification toutes les ${this.config.checkIntervalMs / 1000}s`);
  }

  /**
   * Arrêter la surveillance
   */
  stop(): void {
    if (this.state.intervalId) {
      clearInterval(this.state.intervalId);
      this.state.intervalId = null;
    }
    this.state.isRunning = false;
    console.log("[CacheMonitor] Arrêté");
  }

  /**
   * Vérifier le hit rate et envoyer une alerte si nécessaire
   */
  async check(): Promise<{
    hitRate: number;
    threshold: number;
    alertSent: boolean;
    reason?: string;
  }> {
    const stats = cache.getStats();
    const totalRequests = stats.hits + stats.misses;
    const hitRate = totalRequests > 0 ? (stats.hits / totalRequests) * 100 : 100;

    const result = {
      hitRate: Math.round(hitRate * 100) / 100,
      threshold: this.config.hitRateThreshold,
      alertSent: false,
      reason: undefined as string | undefined,
    };

    // Vérifier si on a assez de données
    if (totalRequests < this.config.minRequestsBeforeAlert) {
      result.reason = `Pas assez de requêtes (${totalRequests}/${this.config.minRequestsBeforeAlert})`;
      return result;
    }

    // Vérifier si le hit rate est sous le seuil
    if (hitRate >= this.config.hitRateThreshold) {
      result.reason = "Hit rate acceptable";
      return result;
    }

    // Vérifier le cooldown
    const now = Date.now();
    if (now - this.state.lastAlertTime < this.config.cooldownMs) {
      result.reason = "En période de cooldown";
      return result;
    }

    // Envoyer l'alerte
    try {
      const alertSent = await this.sendAlert(hitRate, stats);
      if (alertSent) {
        this.state.lastAlertTime = now;
        this.state.alertCount++;
        result.alertSent = true;
        result.reason = "Alerte envoyée";
      } else {
        result.reason = "Échec de l'envoi de l'alerte";
      }
    } catch (error) {
      result.reason = `Erreur: ${error}`;
    }

    return result;
  }

  /**
   * Envoyer une notification d'alerte
   */
  private async sendAlert(
    hitRate: number,
    stats: ReturnType<typeof cache.getStats>
  ): Promise<boolean> {
    const title = `⚠️ PERFUMUM - Hit Rate Cache Critique`;
    const content = `
Le taux de succès du cache est descendu sous le seuil critique.

**Statistiques actuelles:**
- Hit Rate: ${hitRate.toFixed(2)}% (seuil: ${this.config.hitRateThreshold}%)
- Hits: ${stats.hits}
- Misses: ${stats.misses}
- Taille du cache: ${stats.size}/${stats.maxSize}

**Actions recommandées:**
1. Vérifier si les TTL sont appropriés
2. Analyser les patterns de requêtes
3. Considérer l'augmentation de la taille du cache
4. Vérifier les invalidations excessives

Alerte #${this.state.alertCount + 1}
    `.trim();

    console.log(`[CacheMonitor] Envoi d'alerte - Hit Rate: ${hitRate.toFixed(2)}%`);
    return await notifyOwner({ title, content });
  }

  /**
   * Obtenir l'état actuel du moniteur
   */
  getStatus(): {
    isRunning: boolean;
    config: MonitorConfig;
    alertCount: number;
    lastAlertTime: string | null;
    currentHitRate: number;
  } {
    const stats = cache.getStats();
    const totalRequests = stats.hits + stats.misses;
    const hitRate = totalRequests > 0 ? (stats.hits / totalRequests) * 100 : 100;

    return {
      isRunning: this.state.isRunning,
      config: this.config,
      alertCount: this.state.alertCount,
      lastAlertTime: this.state.lastAlertTime > 0
        ? new Date(this.state.lastAlertTime).toISOString()
        : null,
      currentHitRate: Math.round(hitRate * 100) / 100,
    };
  }

  /**
   * Mettre à jour la configuration
   */
  updateConfig(newConfig: Partial<MonitorConfig>): void {
    this.config = { ...this.config, ...newConfig };
    console.log("[CacheMonitor] Configuration mise à jour:", this.config);
  }

  /**
   * Réinitialiser le compteur d'alertes
   */
  resetAlertCount(): void {
    this.state.alertCount = 0;
    this.state.lastAlertTime = 0;
    console.log("[CacheMonitor] Compteur d'alertes réinitialisé");
  }
}

// Instance singleton
export const cacheMonitor = new CacheMonitor();

// Démarrer automatiquement en production
if (process.env.NODE_ENV === "production") {
  cacheMonitor.start();
}
