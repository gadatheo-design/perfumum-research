/**
 * Lot 3 — Détection de la plateforme d'exécution (Manus vs standalone).
 *
 * Contrôlé par la variable d'environnement `PERFUMUM_PLATFORM` :
 *   - "manus"      (défaut) — comportement actuel inchangé : runtime Manus
 *     injecté au build/dev (vite-plugin-manus-runtime, patch HMR).
 *   - "standalone" — aucune dépendance Manus injectée ; `pnpm build` (ou
 *     `pnpm build:standalone`) produit un bundle sans aucun script Manus.
 *
 * Le défaut reste "manus" volontairement : tant que personne ne positionne
 * explicitement la variable, rien ne change pour le déploiement de prod
 * existant. C'est un point d'entrée additif, pas une bascule qui casse
 * l'existant.
 *
 * Fichier lu à la fois par `vite.config.ts` (contexte Node au build) et,
 * potentiellement, par le serveur — pas de dépendance externe, uniquement
 * `process.env`.
 */

export type Platform = "manus" | "standalone";

function resolvePlatform(): Platform {
  const raw = (process.env.PERFUMUM_PLATFORM ?? "manus").trim().toLowerCase();
  return raw === "standalone" ? "standalone" : "manus";
}

export const PLATFORM: Platform = resolvePlatform();
export const isManusPlatform = PLATFORM === "manus";
export const isStandalonePlatform = PLATFORM === "standalone";
