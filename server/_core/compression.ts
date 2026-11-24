/**
 * Compression des réponses HTTP (gzip, ou deflate selon le navigateur).
 *
 * Le client compilé et les réponses JSON de l'API sont du texte, qui se
 * compresse très bien : sans cela, chaque visite transférait plusieurs fois
 * plus d'octets que nécessaire.
 *
 * Réglages du paquet `compression`, gardés par défaut :
 *   - seuls les types compressibles le sont (texte, JSON, JavaScript, SVG…) ;
 *     les images déjà compressées (WebP, PNG, JPEG) passent telles quelles ;
 *   - rien en dessous de 1 Ko : le gain ne paierait pas le coût ;
 *   - rien si le navigateur ne l'annonce pas (`Accept-Encoding`).
 *
 * Enregistré après /healthz (réponse minuscule, appelée par l'hébergeur) et
 * avant la porte d'accès et toutes les routes. Le WebSocket n'est pas
 * concerné : il ne passe pas par les middlewares Express.
 */

import compression from "compression";
import type { Express } from "express";

export function registerCompression(app: Express): void {
  app.use(compression());
}
