import express, { type Express } from "express";
import fs from "fs";
import path from "path";

/**
 * Sert le client compilé (dist/public) en production.
 *
 * Volontairement séparé de `./vite` : ce module ne doit dépendre d'aucun
 * paquet de développement, pour qu'une image de production installée avec
 * `pnpm install --prod` (donc sans Vite) puisse démarrer. `./vite` n'est
 * chargé qu'en mode développement, par import dynamique.
 */
export function serveStatic(app: Express) {
  const distPath =
    process.env.NODE_ENV === "development"
      ? path.resolve(import.meta.dirname, "../..", "dist", "public")
      : path.resolve(import.meta.dirname, "public");

  if (!fs.existsSync(distPath)) {
    console.error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }

  app.use(express.static(distPath));

  // fall through to index.html if the file doesn't exist
  app.use("*", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
