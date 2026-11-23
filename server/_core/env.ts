/**
 * URL publique canonique du site.
 *
 * Sert à deux usages qui ne doivent surtout pas diverger :
 *  - les URLs des citations académiques générées (server/db/users.ts) —
 *    ce sont des références destinées à être copiées dans des publications,
 *    donc censées rester stables ;
 *  - le champ de contact des en-têtes User-Agent envoyés aux API externes
 *    (GBIF, Wikidata, Europeana), qui demandent une URL identifiant l'appelant.
 *
 * Le défaut reprend le domaine Manus actuellement en production pour ne rien
 * changer au déploiement existant ; en standalone, positionner
 * `PUBLIC_BASE_URL` sur le vrai domaine AVANT d'émettre de nouvelles
 * citations.
 */
const publicBaseUrl = (
  process.env.PUBLIC_BASE_URL || "https://perfumum.manus.space"
).replace(/\/$/, "");

export const ENV = {
  appId: process.env.VITE_APP_ID ?? "",
  cookieSecret: process.env.JWT_SECRET ?? "",
  databaseUrl: process.env.DATABASE_URL ?? "",
  oAuthServerUrl: process.env.OAUTH_SERVER_URL ?? "",
  ownerOpenId: process.env.OWNER_OPEN_ID ?? "",
  isProduction: process.env.NODE_ENV === "production",
  forgeApiUrl: process.env.BUILT_IN_FORGE_API_URL ?? "",
  forgeApiKey: process.env.BUILT_IN_FORGE_API_KEY ?? "",
  publicBaseUrl,
  /** Adresse de contact exposée aux API externes via le User-Agent. */
  contactEmail: process.env.PUBLIC_CONTACT_EMAIL ?? "research@perfumum.art",
};

/**
 * En-tête User-Agent unique pour tous les appels sortants vers les API
 * scientifiques. Plusieurs variantes coexistaient dans le dépôt, avec deux
 * domaines Manus différents — un seul point de vérité désormais.
 */
export const OUTBOUND_USER_AGENT = `PERFUMUM-Research/1.0 (${publicBaseUrl}; ${ENV.contactEmail}) Node.js/fetch`;
