/**
 * Vérification de santé : `GET /healthz`.
 *
 * Répond 200 dès que le processus HTTP tourne, avec la version et le commit
 * de l'image. La route ne touche PAS à la base de données, volontairement :
 * l'hébergeur s'en sert pour décider de redémarrer le conteneur, et une base
 * momentanément injoignable ne se répare pas en relançant l'application.
 *
 * - version : `APP_VERSION`, sinon le champ `version` du package.json présent
 *   dans le répertoire de travail (c'est le cas dans l'image Docker) ;
 * - commit  : `GIT_COMMIT`, renseigné par le Dockerfile (`--build-arg`).
 *
 * La route doit rester ouverte même quand une porte d'accès protège le site :
 * elle est enregistrée avant tout autre middleware (voir ./index.ts).
 */

import fs from "fs";
import path from "path";
import type { Express, Request, Response } from "express";

export interface HealthInfo {
  status: "ok";
  version: string;
  commit: string;
}

function readPackageVersion(): string | undefined {
  try {
    const raw = fs.readFileSync(path.resolve(process.cwd(), "package.json"), "utf8");
    const version = (JSON.parse(raw) as { version?: unknown }).version;
    return typeof version === "string" && version ? version : undefined;
  } catch {
    return undefined;
  }
}

export function resolveHealthInfo(env: NodeJS.ProcessEnv = process.env): HealthInfo {
  return {
    status: "ok",
    version: env.APP_VERSION?.trim() || readPackageVersion() || "inconnue",
    commit: env.GIT_COMMIT?.trim() || "inconnu",
  };
}

export function registerHealthRoute(app: Express): void {
  // Calculé une fois : ni lecture de fichier ni autre travail par requête.
  const info = resolveHealthInfo();
  app.get("/healthz", (_req: Request, res: Response) => {
    res.set("Cache-Control", "no-store");
    res.status(200).json(info);
  });
}
