/**
 * sparql.ts — Shared Wikidata SPARQL helper with exponential backoff retry
 * ─────────────────────────────────────────────────────────────────────────────
 * Handles 429 (Too Many Requests) and transient network errors automatically.
 * All SPARQL calls in the project should use this helper instead of raw fetch.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export const SPARQL_ENDPOINT = "https://query.wikidata.org/sparql";

const WIKIDATA_USER_AGENT =
  "PERFUMUM-Research/1.0 (https://perfumum.manus.space; olfactory-research-project) Node.js/fetch";

// ─────────────────────────────────────────────────────────────────────────────
// CONFIG
// ─────────────────────────────────────────────────────────────────────────────

interface SparqlOptions {
  /** Maximum number of attempts (default: 4) */
  maxRetries?: number;
  /** Initial delay in ms before first retry (default: 1000) */
  initialDelayMs?: number;
  /** Multiplier for each subsequent delay (default: 2) */
  backoffFactor?: number;
  /** Maximum delay cap in ms (default: 30000) */
  maxDelayMs?: number;
  /** Request timeout in ms (default: 25000) */
  timeoutMs?: number;
}

const DEFAULTS: Required<SparqlOptions> = {
  maxRetries: 4,
  initialDelayMs: 1000,
  backoffFactor: 2,
  maxDelayMs: 30_000,
  timeoutMs: 25_000,
};

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Adds ±20% jitter to a delay to avoid thundering-herd when multiple requests
 * retry simultaneously after a 429.
 */
function jitter(ms: number): number {
  const factor = 0.8 + Math.random() * 0.4; // 0.8 – 1.2
  return Math.round(ms * factor);
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN EXPORT
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Execute a SPARQL query against the Wikidata endpoint with automatic retry
 * and exponential backoff on 429 / 503 / network errors.
 *
 * @param query  SPARQL SELECT query string
 * @param opts   Optional retry/timeout configuration
 * @returns      Array of result bindings (empty array if no results)
 * @throws       Error after all retries are exhausted
 */
export async function sparqlQuery(
  query: string,
  opts: SparqlOptions = {}
): Promise<any[]> {
  const cfg = { ...DEFAULTS, ...opts };

  let attempt = 0;
  let delayMs = cfg.initialDelayMs;

  while (attempt <= cfg.maxRetries) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), cfg.timeoutMs);

    try {
      const url = new URL(SPARQL_ENDPOINT);
      url.searchParams.set("query", query.trim());
      url.searchParams.set("format", "json");

      const response = await fetch(url.toString(), {
        method: "GET",
        headers: {
          Accept: "application/sparql-results+json",
          "User-Agent": WIKIDATA_USER_AGENT,
          "Accept-Language": "en",
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // ── Retryable HTTP errors ──────────────────────────────────────────────
      if (response.status === 429 || response.status === 503) {
        // Respect Retry-After header if present
        const retryAfter = response.headers.get("Retry-After");
        const serverDelay = retryAfter
          ? parseInt(retryAfter, 10) * 1000
          : null;

        if (attempt >= cfg.maxRetries) {
          throw new Error(
            `Wikidata SPARQL rate limited (HTTP ${response.status}) after ${attempt + 1} attempts`
          );
        }

        const waitMs = jitter(serverDelay ?? delayMs);
        console.warn(
          `[sparql] HTTP ${response.status} — retry ${attempt + 1}/${cfg.maxRetries} in ${waitMs}ms`
        );
        await sleep(waitMs);
        delayMs = Math.min(delayMs * cfg.backoffFactor, cfg.maxDelayMs);
        attempt++;
        continue;
      }

      // ── Non-retryable HTTP errors ──────────────────────────────────────────
      if (!response.ok) {
        throw new Error(
          `SPARQL HTTP ${response.status}: ${response.statusText}`
        );
      }

      const data = await response.json();
      return data?.results?.bindings ?? [];
    } catch (err: any) {
      clearTimeout(timeoutId);

      // Timeout (AbortError) — retry
      if (err.name === "AbortError") {
        if (attempt >= cfg.maxRetries) {
          throw new Error(
            `Wikidata SPARQL timed out after ${cfg.timeoutMs}ms (${attempt + 1} attempts)`
          );
        }
        const waitMs = jitter(delayMs);
        console.warn(
          `[sparql] Timeout — retry ${attempt + 1}/${cfg.maxRetries} in ${waitMs}ms`
        );
        await sleep(waitMs);
        delayMs = Math.min(delayMs * cfg.backoffFactor, cfg.maxDelayMs);
        attempt++;
        continue;
      }

      // Network errors (ECONNRESET, ENOTFOUND, etc.) — retry
      const isNetworkError =
        err.code === "ECONNRESET" ||
        err.code === "ENOTFOUND" ||
        err.code === "ECONNREFUSED" ||
        err.message?.includes("fetch failed");

      if (isNetworkError && attempt < cfg.maxRetries) {
        const waitMs = jitter(delayMs);
        console.warn(
          `[sparql] Network error (${err.code ?? err.message}) — retry ${attempt + 1}/${cfg.maxRetries} in ${waitMs}ms`
        );
        await sleep(waitMs);
        delayMs = Math.min(delayMs * cfg.backoffFactor, cfg.maxDelayMs);
        attempt++;
        continue;
      }

      // Already a formatted error (from 429/503 branch) — rethrow
      throw err;
    }
  }

  // Should never reach here
  throw new Error("sparqlQuery: exhausted all retries");
}
