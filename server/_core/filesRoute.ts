/**
 * Sert les fichiers stockés sous une URL stable : `/files/<clé>`.
 *
 * Cette indirection existe pour que l'URL enregistrée en base survive à un
 * changement de fournisseur de stockage comme de domaine — voir l'explication
 * détaillée en tête de server/storage.ts.
 *
 * Selon le fournisseur :
 *   - local : le fichier est servi depuis le disque;
 *   - s3    : redirection vers une URL présignée régénérée à chaque requête,
 *             ce qui permet de garder le bucket privé;
 *   - manus : redirection vers l'URL de téléchargement du proxy;
 *   - disabled : 404.
 */

import type { Express, Request, Response } from "express";
import fs from "fs";
import {
  FILES_ROUTE_PREFIX,
  getStorageProvider,
  localPathFor,
  manusDownloadUrl,
  normalizeKey,
  s3SignedUrl,
} from "../storage";

/** Extrait la clé demandée, en refusant tout ce qui sort du dossier. */
function keyFromRequest(req: Request): string | null {
  // Express place le reste du chemin dans req.params[0] pour un motif `/*`.
  const raw = (req.params as Record<string, string>)[0] ?? "";
  try {
    return normalizeKey(decodeURIComponent(raw));
  } catch {
    return null;
  }
}

export function registerFilesRoute(app: Express) {
  const provider = getStorageProvider();
  if (provider === "disabled") return;

  app.get(`${FILES_ROUTE_PREFIX}/*`, async (req: Request, res: Response) => {
    const key = keyFromRequest(req);
    if (!key) {
      res.status(400).json({ error: "Clé de fichier invalide." });
      return;
    }

    try {
      if (provider === "local") {
        const filePath = localPathFor(key);
        if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
          res.status(404).json({ error: "Fichier introuvable." });
          return;
        }
        // Les clés contiennent un horodatage et un suffixe aléatoire : le
        // contenu d'une clé donnée ne change jamais, on peut donc mettre en
        // cache agressivement.
        res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
        res.sendFile(filePath);
        return;
      }

      if (provider === "s3") {
        res.setHeader("Cache-Control", "private, max-age=60");
        res.redirect(302, await s3SignedUrl(key));
        return;
      }

      // manus
      res.redirect(302, await manusDownloadUrl(key));
    } catch (error) {
      console.error(`[Files] Échec de résolution pour ${key}`, error);
      res.status(404).json({ error: "Fichier introuvable." });
    }
  });

  console.log(`[Files] /files/* servi par le fournisseur « ${provider} »`);
}
