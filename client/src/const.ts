export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

// Generate login URL at runtime so redirect URI reflects the current origin.
export const getLoginUrl = () => {
  const oauthPortalUrl = import.meta.env.VITE_OAUTH_PORTAL_URL;
  const appId = import.meta.env.VITE_APP_ID;

  // Mode standalone : aucun portail OAuth externe n'est configuré, on renvoie
  // vers la page de connexion locale. La détection porte sur l'absence de
  // configuration OAuth plutôt que sur une variable dédiée, pour qu'un
  // déploiement standalone fonctionne sans réglage supplémentaire.
  if (!oauthPortalUrl || !appId) {
    const next = window.location.pathname + window.location.search;
    return next && next !== "/"
      ? `/login?next=${encodeURIComponent(next)}`
      : "/login";
  }

  const redirectUri = `${window.location.origin}/api/oauth/callback`;
  const state = btoa(redirectUri);

  const url = new URL(`${oauthPortalUrl}/app-auth`);
  url.searchParams.set("appId", appId);
  url.searchParams.set("redirectUri", redirectUri);
  url.searchParams.set("state", state);
  url.searchParams.set("type", "signIn");

  return url.toString();
};
