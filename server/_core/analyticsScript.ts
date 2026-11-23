/**
 * Script d'analyse d'audience (umami) dans client/index.html.
 *
 * Le gabarit charge `%VITE_ANALYTICS_ENDPOINT%/umami`. Chez Manus, la
 * variable est fournie au moment de la construction. Ailleurs elle est vide :
 * Vite laissait alors la balise telle quelle, et chaque page demandait
 * `/%VITE_ANALYTICS_ENDPOINT%/umami` — une requête en échec à chaque visite.
 *
 * Le gabarit n'est pas modifié (Manus peut continuer à s'en servir tel
 * quel) : c'est à la construction que la balise est retirée si la variable
 * n'est pas définie. Si elle l'est, rien ne change.
 *
 * Fichier sans dépendance, lu par vite.config.ts comme ./platform.ts.
 */

const UMAMI_SCRIPT = /[ \t]*<script\b[^>]*%VITE_ANALYTICS_ENDPOINT%[^>]*>\s*<\/script>[ \t]*\r?\n?/g;

export function stripAnalyticsScript(html: string, endpoint: string | undefined): string {
  if (endpoint && endpoint.trim()) return html;
  return html.replace(UMAMI_SCRIPT, "");
}

/** Plugin Vite : applique `stripAnalyticsScript` au gabarit, en dev comme au build. */
export function analyticsScriptPlugin() {
  let endpoint: string | undefined;
  return {
    name: "perfumum-analytics-script",
    configResolved(config: { env: Record<string, unknown> }) {
      const value = config.env.VITE_ANALYTICS_ENDPOINT;
      endpoint = typeof value === "string" ? value : undefined;
    },
    transformIndexHtml: {
      // Avant le remplacement des %VARIABLES% par Vite.
      order: "pre" as const,
      handler(html: string) {
        return stripAnalyticsScript(html, endpoint);
      },
    },
  };
}
