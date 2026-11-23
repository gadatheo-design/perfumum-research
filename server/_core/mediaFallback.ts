/**
 * Images de l'interface : `/media/<fichier>`.
 *
 * Dix-neuf images (icônes, illustrations de gammes) étaient chargées depuis
 * le stockage Manus par des adresses écrites en dur dans le client. Elles
 * sont désormais attendues dans `client/public/media/` et servies par
 * l'application elle-même, comme n'importe quel fichier statique.
 *
 * Ce module n'est qu'un filet de sécurité pour la transition : tant qu'un de
 * ces fichiers n'a pas été ajouté au dépôt, sa demande est redirigée vers
 * son adresse d'origine, de sorte qu'aucune image ne disparaît. Dès que le
 * fichier est présent, la route ne fait rien et le serveur statique répond.
 *
 * La liste et l'adresse d'origine viennent de `media/origines.json`. Seuls
 * les noms de cette liste sont redirigés : ce n'est pas une redirection
 * ouverte. Une fois les 19 fichiers ajoutés (`node deploy/fetch-media.mjs`),
 * ce module et le champ « origine » peuvent être supprimés.
 */

import type { Express, NextFunction, Request, Response } from "express";
import fs from "fs";
import path from "path";
import { logger } from "./logger";

interface MediaOrigins {
  origine: string;
  fichiers: string[];
}

/** Dossier public servi : `client/public` en développement, `dist/public` sinon. */
export function resolvePublicDir(): string {
  return process.env.NODE_ENV === "development"
    ? path.resolve(import.meta.dirname, "../..", "client", "public")
    : path.resolve(import.meta.dirname, "public");
}

export function readMediaOrigins(publicDir: string): MediaOrigins | null {
  try {
    const parsed = JSON.parse(
      fs.readFileSync(path.join(publicDir, "media", "origines.json"), "utf8")
    ) as Partial<MediaOrigins>;
    if (typeof parsed.origine !== "string" || !Array.isArray(parsed.fichiers)) return null;
    if (!/^https:\/\/[^/]+\/.*\/$/.test(parsed.origine)) return null;
    // Noms simples uniquement : ni sous-dossier ni remontée.
    const fichiers = parsed.fichiers.filter(
      (name): name is string => typeof name === "string" && /^[A-Za-z0-9][A-Za-z0-9._-]*$/.test(name)
    );
    return { origine: parsed.origine, fichiers };
  } catch {
    return null;
  }
}

export function registerMediaFallback(app: Express, publicDir: string = resolvePublicDir()): void {
  const origins = readMediaOrigins(publicDir);
  if (!origins) return;

  const known = new Set(origins.fichiers);
  const missing = origins.fichiers.filter(name => !fs.existsSync(path.join(publicDir, "media", name)));
  if (missing.length > 0) {
    logger.warn("images de l'interface absentes de /media, redirigées vers leur origine", {
      absentes: missing.length,
      attendues: origins.fichiers.length,
    });
  }

  app.get("/media/:name", (req: Request, res: Response, next: NextFunction) => {
    const name = req.params.name;
    if (!known.has(name)) return next();
    if (fs.existsSync(path.join(publicDir, "media", name))) return next();
    res.setHeader("Cache-Control", "public, max-age=3600");
    res.redirect(302, origins.origine + name);
  });
}
