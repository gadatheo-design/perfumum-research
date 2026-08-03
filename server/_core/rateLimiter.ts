/**
 * Lot 2 — Rate limiting minimal, sans dépendance externe.
 *
 * Volontairement simple : compteur en mémoire par IP, fenêtre fixe (pas de
 * fenêtre glissante, pas de store partagé type Redis). C'est suffisant pour
 * une seule instance de serveur et un trafic modeste ; à remplacer par un
 * store partagé si l'app tourne un jour derrière plusieurs instances/replicas.
 *
 * Deux profils de limite :
 *  - `generalLimiter` : plafond large, pour l'ensemble de l'API tRPC.
 *  - `heavyLimiter` : plafond strict, réservé aux routes d'import,
 *    d'enrichissement, de synchronisation ou de traitement par lot, qui
 *    déclenchent des appels externes coûteux (Wikidata, GBIF, Europeana...)
 *    et/ou des écritures en masse.
 *
 * tRPC encode le nom des procédures dans l'URL même en mode batch
 * (ex: /api/trpc/lotusEnrichment.batchImportByGenus), donc un simple test
 * de sous-chaîne sur req.path suffit à distinguer les deux profils.
 */

import type { NextFunction, Request, Response } from "express";

type Bucket = { count: number; resetAt: number };

const HEAVY_KEYWORDS = [
  "enrich",
  "import",
  "sync",
  "batch",
  "bulk",
  "migrate",
  "reclassify",
];

function createLimiter(options: {
  windowMs: number;
  max: number;
  message: string;
}) {
  const buckets = new Map<string, Bucket>();

  // Nettoyage périodique pour éviter une croissance illimitée de la Map.
  setInterval(() => {
    const now = Date.now();
    for (const [key, bucket] of buckets) {
      if (bucket.resetAt <= now) buckets.delete(key);
    }
  }, options.windowMs).unref();

  return (req: Request, res: Response, next: NextFunction) => {
    const key = req.ip ?? req.socket.remoteAddress ?? "unknown";
    const now = Date.now();
    const existing = buckets.get(key);

    if (!existing || existing.resetAt <= now) {
      buckets.set(key, { count: 1, resetAt: now + options.windowMs });
      return next();
    }

    existing.count += 1;

    if (existing.count > options.max) {
      const retryAfterSec = Math.ceil((existing.resetAt - now) / 1000);
      res.setHeader("Retry-After", String(retryAfterSec));
      return res.status(429).json({ error: options.message });
    }

    return next();
  };
}

const generalLimiter = createLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // généreux pour un usage normal de lecture
  message: "Trop de requêtes, réessayez dans quelques minutes.",
});

const heavyLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  max: 20, // bien plus strict : imports / enrichissements / synchronisations
  message:
    "Limite atteinte pour les opérations d'import/enrichissement. Réessayez plus tard.",
});

export function trpcRateLimiter(req: Request, res: Response, next: NextFunction) {
  const path = req.path.toLowerCase();
  const isHeavy = HEAVY_KEYWORDS.some(kw => path.includes(kw));
  return (isHeavy ? heavyLimiter : generalLimiter)(req, res, next);
}
