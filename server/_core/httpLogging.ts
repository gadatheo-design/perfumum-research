/**
 * Journalisation des requêtes et gestion centralisée des erreurs HTTP.
 */

import type { Express, NextFunction, Request, Response } from "express";
import crypto from "crypto";
import { logger } from "./logger";

/** En-tête portant l'identifiant de corrélation, réutilisable côté client. */
export const REQUEST_ID_HEADER = "x-request-id";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      requestId?: string;
    }
  }
}

/**
 * Le chemin d'une requête tRPC contient le nom de la procédure, ce qui est
 * précisément ce qu'on veut voir dans un journal. En revanche la chaîne de
 * requête contient les ENTRÉES sérialisées : identifiants, termes de
 * recherche, parfois davantage. On ne journalise donc que le chemin.
 */
function safePath(req: Request): string {
  return req.path;
}

export function registerHttpLogging(app: Express) {
  app.use((req: Request, res: Response, next: NextFunction) => {
    const incoming = req.headers[REQUEST_ID_HEADER];
    req.requestId =
      (typeof incoming === "string" && incoming.slice(0, 64)) ||
      crypto.randomUUID();
    res.setHeader(REQUEST_ID_HEADER, req.requestId);

    const startedAt = process.hrtime.bigint();

    res.on("finish", () => {
      const durationMs = Number(process.hrtime.bigint() - startedAt) / 1e6;

      // Les fichiers statiques représentent l'essentiel du trafic et
      // n'apprennent rien : on ne les journalise qu'en cas d'erreur.
      const isAsset = req.path.startsWith("/assets/") || req.path.startsWith("/files/");
      if (isAsset && res.statusCode < 400) return;

      const context = {
        requestId: req.requestId,
        method: req.method,
        path: safePath(req),
        status: res.statusCode,
        durationMs: Math.round(durationMs),
      };

      if (res.statusCode >= 500) logger.error("requête en échec", context);
      else if (res.statusCode >= 400) logger.warn("requête refusée", context);
      else if (durationMs > 2000) {
        // Utile pour repérer les imports et enrichissements synchrones.
        logger.warn("requête lente", context);
      } else logger.info("requête", context);
    });

    next();
  });
}

/**
 * Gestionnaire d'erreurs terminal.
 *
 * Sans lui, Express utilise son gestionnaire par défaut, qui renvoie la pile
 * d'appels au client dès que NODE_ENV n'est pas "production" — et, en toute
 * circonstance, ne journalise rien d'exploitable. On journalise ici avec le
 * contexte complet, et le client ne reçoit qu'un identifiant de corrélation.
 */
export function registerErrorHandler(app: Express) {
  app.use((err: unknown, req: Request, res: Response, _next: NextFunction) => {
    logger.error("exception non gérée", {
      requestId: req.requestId,
      method: req.method,
      path: safePath(req),
      error: err,
    });

    if (res.headersSent) return;

    res.status(500).json({
      error: "Erreur interne du serveur.",
      // Permet de relier le message affiché à la ligne de journal exacte.
      requestId: req.requestId,
    });
  });
}

/**
 * Filets de sécurité au niveau du processus.
 *
 * Une promesse rejetée sans gestionnaire termine le processus Node en silence
 * depuis Node 15. Sur un serveur redémarré automatiquement par Docker, cela
 * se traduit par des redémarrages inexpliqués : on veut au moins la trace.
 */
export function registerProcessHandlers() {
  process.on("unhandledRejection", reason => {
    logger.error("promesse rejetée sans gestionnaire", { error: reason });
  });

  process.on("uncaughtException", error => {
    logger.error("exception non capturée", { error });
    // On laisse le processus mourir : après une exception non capturée,
    // l'état de l'application n'est plus fiable. Docker le relancera.
    process.exit(1);
  });
}
