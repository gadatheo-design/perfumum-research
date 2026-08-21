/**
 * Stockage de fichiers — abstraction du fournisseur.
 *
 * Contrôlé par `STORAGE_PROVIDER` :
 *   - "manus"    (défaut) — comportement historique inchangé : proxy Forge.
 *   - "local"    — disque du serveur (`STORAGE_LOCAL_DIR`). Attention : sur un
 *     hébergement à système de fichiers éphémère, les fichiers disparaissent
 *     au redéploiement. Prévoir un volume persistant.
 *   - "s3"       — S3 ou compatible (R2, Backblaze, MinIO, Infomaniak Swiss
 *     Object Storage). Le SDK AWS était déjà présent dans package.json.
 *   - "disabled" — toute écriture lève une erreur explicite.
 *
 * ── Décision importante : la forme des URLs ──────────────────────────────
 *
 * L'URL renvoyée par `storagePut()` est ENREGISTRÉE EN BASE par les
 * appelants (`imageUrl`, `ghost_variety_images.url`…). Elle doit donc rester
 * valide indéfiniment.
 *
 * Cela exclut de renvoyer une URL présignée : celles-ci expirent, et les
 * images deviendraient irrécupérables sans réécrire la base. Cela exclut
 * aussi une URL absolue vers un domaine donné, puisque le projet est
 * précisément en train d'en changer.
 *
 * On renvoie donc un chemin relatif stable — `/files/<clé>` — que le serveur
 * résout à chaque requête vers le fournisseur courant (lecture disque,
 * redirection présignée…). L'URL stockée survit ainsi à un changement de
 * domaine ET à un changement de fournisseur de stockage.
 *
 * Le mode "manus" conserve son comportement d'origine (URL absolue renvoyée
 * par le proxy) pour ne rien modifier au déploiement existant.
 */

import fs from "fs";
import path from "path";
import { ENV } from "./_core/env";

export type StorageProviderName = "manus" | "local" | "s3" | "disabled";

export type StoredObject = { key: string; url: string };

/** Préfixe de résolution servi par server/_core/filesRoute.ts. */
export const FILES_ROUTE_PREFIX = "/files";

export function getStorageProvider(): StorageProviderName {
  const raw = (process.env.STORAGE_PROVIDER ?? "manus").trim().toLowerCase();
  if (raw === "local" || raw === "s3" || raw === "disabled") return raw;
  return "manus";
}

// ---------------------------------------------------------------------------
// Normalisation des clés
// ---------------------------------------------------------------------------

/**
 * Nettoie une clé d'objet et refuse toute tentative de sortie du dossier.
 *
 * Les clés sont construites à partir d'entrées utilisateur (noms de fichiers,
 * extensions). En stockage local, une clé du type `../../etc/passwd`
 * écrirait — ou lirait — hors du dossier prévu.
 */
export function normalizeKey(relKey: string): string {
  const raw = String(relKey ?? "");

  if (raw.includes("\0")) {
    throw new Error("Clé de stockage invalide : caractère nul.");
  }

  // POSIX comme Windows, puis suppression des slashes de tête.
  const unified = raw.replace(/\\/g, "/").replace(/^\/+/, "");

  const segments: string[] = [];
  for (const segment of unified.split("/")) {
    if (segment === "" || segment === ".") continue;
    if (segment === "..") {
      throw new Error("Clé de stockage invalide : remontée de répertoire.");
    }
    segments.push(segment);
  }

  if (segments.length === 0) {
    throw new Error("Clé de stockage invalide : clé vide.");
  }

  return segments.join("/");
}

/** URL stable, indépendante du fournisseur et du domaine. */
function publicUrlFor(key: string): string {
  return `${FILES_ROUTE_PREFIX}/${key.split("/").map(encodeURIComponent).join("/")}`;
}

// ---------------------------------------------------------------------------
// Fournisseur : manus (historique)
// ---------------------------------------------------------------------------

function ensureTrailingSlash(value: string): string {
  return value.endsWith("/") ? value : `${value}/`;
}

function manusConfig(): { baseUrl: string; apiKey: string } {
  const baseUrl = ENV.forgeApiUrl;
  const apiKey = ENV.forgeApiKey;
  if (!baseUrl || !apiKey) {
    throw new Error(
      "Storage proxy credentials missing: set BUILT_IN_FORGE_API_URL and BUILT_IN_FORGE_API_KEY"
    );
  }
  return { baseUrl: baseUrl.replace(/\/+$/, ""), apiKey };
}

async function manusPut(
  key: string,
  data: Buffer | Uint8Array | string,
  contentType: string
): Promise<StoredObject> {
  const { baseUrl, apiKey } = manusConfig();
  const uploadUrl = new URL("v1/storage/upload", ensureTrailingSlash(baseUrl));
  uploadUrl.searchParams.set("path", key);

  const blob =
    typeof data === "string"
      ? new Blob([data], { type: contentType })
      : new Blob([data as any], { type: contentType });
  const form = new FormData();
  form.append("file", blob, key.split("/").pop() ?? key);

  const response = await fetch(uploadUrl, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}` },
    body: form,
  });

  if (!response.ok) {
    const message = await response.text().catch(() => response.statusText);
    throw new Error(
      `Storage upload failed (${response.status} ${response.statusText}): ${message}`
    );
  }

  const url = ((await response.json()) as { url: string }).url;
  return { key, url };
}

export async function manusDownloadUrl(key: string): Promise<string> {
  const { baseUrl, apiKey } = manusConfig();
  const api = new URL("v1/storage/downloadUrl", ensureTrailingSlash(baseUrl));
  api.searchParams.set("path", key);
  const response = await fetch(api, {
    method: "GET",
    headers: { Authorization: `Bearer ${apiKey}` },
  });
  const result = (await response.json()) as { url: string };
  return result.url;
}

// ---------------------------------------------------------------------------
// Fournisseur : local
// ---------------------------------------------------------------------------

export function localRoot(): string {
  return path.resolve(process.env.STORAGE_LOCAL_DIR || "/app/uploads");
}

/**
 * Résout une clé en chemin absolu, en vérifiant que le résultat reste bien
 * sous la racine — ceinture et bretelles par-dessus `normalizeKey()`.
 */
export function localPathFor(key: string): string {
  const root = localRoot();
  const resolved = path.resolve(root, key);
  const rootWithSep = root.endsWith(path.sep) ? root : root + path.sep;
  if (resolved !== root && !resolved.startsWith(rootWithSep)) {
    throw new Error("Clé de stockage invalide : chemin hors du dossier.");
  }
  return resolved;
}

async function localPut(
  key: string,
  data: Buffer | Uint8Array | string,
  _contentType: string
): Promise<StoredObject> {
  const target = localPathFor(key);
  await fs.promises.mkdir(path.dirname(target), { recursive: true });
  const buffer =
    typeof data === "string" ? Buffer.from(data, "utf8") : Buffer.from(data);
  await fs.promises.writeFile(target, buffer);
  return { key, url: publicUrlFor(key) };
}

// ---------------------------------------------------------------------------
// Fournisseur : s3 (et compatibles)
// ---------------------------------------------------------------------------

type S3Config = {
  bucket: string;
  region: string;
  endpoint?: string;
  forcePathStyle: boolean;
  accessKeyId?: string;
  secretAccessKey?: string;
};

export function s3Config(): S3Config {
  const bucket = process.env.S3_BUCKET;
  if (!bucket) {
    throw new Error("STORAGE_PROVIDER=s3 mais S3_BUCKET n'est pas défini.");
  }
  return {
    bucket,
    region: process.env.S3_REGION || "us-east-1",
    endpoint: process.env.S3_ENDPOINT || undefined,
    // Indispensable pour MinIO et la plupart des stockages compatibles.
    forcePathStyle: (process.env.S3_FORCE_PATH_STYLE ?? "true") !== "false",
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  };
}

// Import différé : n'embarque le SDK AWS que si le fournisseur s3 est utilisé.
async function s3Client() {
  const { S3Client } = await import("@aws-sdk/client-s3");
  const cfg = s3Config();
  return {
    client: new S3Client({
      region: cfg.region,
      endpoint: cfg.endpoint,
      forcePathStyle: cfg.forcePathStyle,
      credentials:
        cfg.accessKeyId && cfg.secretAccessKey
          ? { accessKeyId: cfg.accessKeyId, secretAccessKey: cfg.secretAccessKey }
          : undefined,
    }),
    cfg,
  };
}

async function s3Put(
  key: string,
  data: Buffer | Uint8Array | string,
  contentType: string
): Promise<StoredObject> {
  const { PutObjectCommand } = await import("@aws-sdk/client-s3");
  const { client, cfg } = await s3Client();
  const body = typeof data === "string" ? Buffer.from(data, "utf8") : Buffer.from(data);

  await client.send(
    new PutObjectCommand({
      Bucket: cfg.bucket,
      Key: key,
      Body: body,
      ContentType: contentType,
    })
  );

  return { key, url: publicUrlFor(key) };
}

/** URL présignée de courte durée, régénérée à chaque requête entrante. */
export async function s3SignedUrl(key: string, expiresIn = 300): Promise<string> {
  const { GetObjectCommand } = await import("@aws-sdk/client-s3");
  const { getSignedUrl } = await import("@aws-sdk/s3-request-presigner");
  const { client, cfg } = await s3Client();
  return getSignedUrl(
    client,
    new GetObjectCommand({ Bucket: cfg.bucket, Key: key }),
    { expiresIn }
  );
}

// ---------------------------------------------------------------------------
// API publique — signature inchangée pour les 21 points d'appel existants
// ---------------------------------------------------------------------------

export async function storagePut(
  relKey: string,
  data: Buffer | Uint8Array | string,
  contentType = "application/octet-stream"
): Promise<StoredObject> {
  const key = normalizeKey(relKey);
  const provider = getStorageProvider();

  switch (provider) {
    case "manus":
      return manusPut(key, data, contentType);
    case "local":
      return localPut(key, data, contentType);
    case "s3":
      return s3Put(key, data, contentType);
    case "disabled":
      throw new Error(
        "Le stockage de fichiers est désactivé (STORAGE_PROVIDER=disabled)."
      );
  }
}

export async function storageGet(relKey: string): Promise<StoredObject> {
  const key = normalizeKey(relKey);
  const provider = getStorageProvider();

  if (provider === "manus") {
    return { key, url: await manusDownloadUrl(key) };
  }
  if (provider === "disabled") {
    throw new Error(
      "Le stockage de fichiers est désactivé (STORAGE_PROVIDER=disabled)."
    );
  }
  // local et s3 : URL stable, résolue par /files/<clé>.
  return { key, url: publicUrlFor(key) };
}
