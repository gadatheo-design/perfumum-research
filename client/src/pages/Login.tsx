import { useEffect, useState } from "react";

/**
 * Page de connexion du mode standalone.
 *
 * En mode « manus », `getLoginUrl()` redirige vers le portail OAuth externe et
 * cette page n'est jamais atteinte. Elle ne s'affiche donc que lorsque le
 * serveur expose /api/auth/login.
 */
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [available, setAvailable] = useState<boolean | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/auth/config")
      .then(r => (r.ok ? r.json() : { mode: "disabled" }))
      .then(d => {
        if (!cancelled) setAvailable(d?.mode === "local");
      })
      .catch(() => {
        if (!cancelled) setAvailable(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setPending(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data?.error ?? "La connexion a échoué.");
        setPending(false);
        return;
      }

      // Rechargement complet plutôt que navigation cliente : le cookie vient
      // d'être posé et tous les caches de requêtes doivent repartir de zéro.
      const next = new URLSearchParams(window.location.search).get("next");
      window.location.href = next && next.startsWith("/") ? next : "/";
    } catch {
      setError("Serveur injoignable. Réessayez.");
      setPending(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <h1 className="mb-1 text-2xl font-semibold tracking-tight">PERFUMUM</h1>
        <p className="mb-6 text-sm text-muted-foreground">
          Espace de recherche — accès réservé
        </p>

        {available === false && (
          <div className="mb-4 rounded border border-destructive/40 bg-destructive/10 p-3 text-sm">
            La connexion locale n'est pas configurée sur ce serveur. Renseignez{" "}
            <code className="font-mono text-xs">ADMIN_PASSWORD_HASH</code> puis
            redémarrez.
          </div>
        )}

        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-sm font-medium">
              Adresse e-mail
            </label>
            <input
              id="email"
              type="email"
              autoComplete="username"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="rounded border border-input bg-transparent px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-sm font-medium">
              Mot de passe
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="rounded border border-input bg-transparent px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>

          {error && (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={pending || available === false}
            className="rounded bg-primary px-3 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
          >
            {pending ? "Connexion…" : "Se connecter"}
          </button>
        </form>
      </div>
    </div>
  );
}
