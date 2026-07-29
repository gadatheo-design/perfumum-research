/**
 * timeline.ts — Rapport 10
 * Routeur tRPC pour la frise chronologique multi-sources PERFUMUM
 * Sources : bibliography_entries (PERFUMUM), OpenAlex, Wikidata
 * Conserve les procédures legacy (list, getByPhase, getByYear, stats)
 */

import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import * as dbModule from "../db";

// ─── Types ────────────────────────────────────────────────────────────────────

interface TimelineEvent {
  id: string;
  year: number;
  title: string;
  source: "perfumum" | "openalex" | "wikidata" | "manual";
  type: "publication" | "discovery" | "patent" | "event" | "artwork";
  entityType?: "molecule" | "plant" | "family" | "recipe" | "general";
  entityId?: number;
  entityName?: string;
  doi?: string;
  authors?: string;
  journal?: string;
  url?: string;
  description?: string;
  citedByCount?: number;
}

interface TimelineStats {
  totalEvents: number;
  bySource: Record<string, number>;
  byType: Record<string, number>;
  byDecade: Record<string, number>;
  yearRange: { min: number; max: number };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function mapEntryType(entryType: string): TimelineEvent["type"] {
  const t = entryType.toLowerCase();
  if (t.includes("patent")) return "patent";
  if (t.includes("art") || t.includes("exhibit")) return "artwork";
  if (t.includes("event") || t.includes("conference")) return "event";
  if (t.includes("discover")) return "discovery";
  return "publication";
}

async function getDbTimelineEvents(filters: {
  yearFrom?: number;
  yearTo?: number;
  entityType?: string;
  entityId?: number;
  limit: number;
}): Promise<TimelineEvent[]> {
  const dbPromise = dbModule.getDb();
  const db = await Promise.resolve(dbPromise);
  if (!db) return [];

  let sql = `
    SELECT be.id, be.year, be.title, be.doi, be.journal, be.authors,
           be.abstract, be.cited_by_count, be.url, be.entry_type
    FROM bibliography_entries be
    WHERE be.year IS NOT NULL AND be.year > 1600 AND be.year <= YEAR(NOW()) + 1
  `;
  const params: (string | number)[] = [];

  if (filters.yearFrom) { sql += ` AND be.year >= ?`; params.push(filters.yearFrom); }
  if (filters.yearTo)   { sql += ` AND be.year <= ?`; params.push(filters.yearTo); }

  if (filters.entityType === "molecule" && filters.entityId) {
    sql += ` AND EXISTS (SELECT 1 FROM bibliography_molecule_links bml WHERE bml.bibliography_entry_id = be.id AND bml.molecule_id = ?)`;
    params.push(filters.entityId);
  } else if (filters.entityType === "plant" && filters.entityId) {
    sql += ` AND EXISTS (SELECT 1 FROM bibliography_plant_links bpl WHERE bpl.bibliography_entry_id = be.id AND bpl.plant_id = ?)`;
    params.push(filters.entityId);
  }

  sql += ` ORDER BY be.year DESC LIMIT ?`;
  params.push(filters.limit);

  const rows = await (db as any).execute(sql, params) as [Record<string, unknown>[], unknown];
  const data = Array.isArray(rows[0]) ? rows[0] : [];

  return data.map((row) => ({
    id: `perfumum-${row.id}`,
    year: Number(row.year),
    title: String(row.title || "Sans titre"),
    source: "perfumum" as const,
    type: mapEntryType(String(row.entry_type || "")),
    doi: row.doi ? String(row.doi) : undefined,
    journal: row.journal ? String(row.journal) : undefined,
    authors: row.authors ? String(row.authors) : undefined,
    url: row.url ? String(row.url) : undefined,
    description: row.abstract ? String(row.abstract).slice(0, 200) : undefined,
    citedByCount: row.cited_by_count ? Number(row.cited_by_count) : undefined,
  }));
}

async function getOpenAlexTimelineEvents(filters: {
  query: string;
  yearFrom?: number;
  yearTo?: number;
  limit: number;
}): Promise<TimelineEvent[]> {
  try {
    const params = new URLSearchParams({
      search: filters.query,
      "per-page": String(Math.min(filters.limit, 50)),
      select: "id,title,publication_year,doi,primary_location,authorships,cited_by_count",
      sort: "publication_year:desc",
    });
    if (filters.yearFrom || filters.yearTo) {
      const from = filters.yearFrom || 1600;
      const to = filters.yearTo || new Date().getFullYear();
      params.set("filter", `publication_year:${from}-${to}`);
    }
    const url = `https://api.openalex.org/works?${params.toString()}&mailto=perfumum@research.fr`;
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) return [];
    const json = await res.json() as { results?: Record<string, unknown>[] };
    return (json.results || []).map((w) => {
      const authorships = Array.isArray(w.authorships) ? w.authorships as Record<string, unknown>[] : [];
      const authors = authorships.slice(0, 3)
        .map((a) => { const au = a.author as Record<string, unknown> | undefined; return au?.display_name ? String(au.display_name) : ""; })
        .filter(Boolean).join(", ");
      const loc = w.primary_location as Record<string, unknown> | undefined;
      const src = loc?.source as Record<string, unknown> | undefined;
      return {
        id: `openalex-${String(w.id || "").split("/").pop()}`,
        year: Number(w.publication_year || 0),
        title: String(w.title || "Sans titre"),
        source: "openalex" as const,
        type: "publication" as const,
        doi: w.doi ? String(w.doi).replace("https://doi.org/", "") : undefined,
        journal: src?.display_name ? String(src.display_name) : undefined,
        authors: authors || undefined,
        url: w.doi ? String(w.doi) : undefined,
        citedByCount: w.cited_by_count ? Number(w.cited_by_count) : undefined,
      };
    }).filter((e) => e.year > 1600);
  } catch { return []; }
}

async function getWikidataTimelineEvents(filters: {
  query: string;
  yearFrom?: number;
  yearTo?: number;
  limit: number;
}): Promise<TimelineEvent[]> {
  try {
    const yearFilter = (filters.yearFrom || filters.yearTo)
      ? `FILTER(YEAR(?date) >= ${filters.yearFrom || 1600} && YEAR(?date) <= ${filters.yearTo || new Date().getFullYear()})`
      : "";
    const sparql = `
      SELECT DISTINCT ?item ?itemLabel ?date ?description WHERE {
        ?item wdt:P31 wd:Q13442814 .
        ?item rdfs:label ?label .
        FILTER(LANG(?label) = "fr" || LANG(?label) = "en")
        FILTER(CONTAINS(LCASE(?label), LCASE("${filters.query.replace(/"/g, "")}")))
        OPTIONAL { ?item wdt:P577 ?date }
        OPTIONAL { ?item schema:description ?description . FILTER(LANG(?description) = "fr") }
        ${yearFilter}
        SERVICE wikibase:label { bd:serviceParam wikibase:language "fr,en". }
      }
      ORDER BY DESC(?date) LIMIT ${Math.min(filters.limit, 20)}
    `;
    const url = `https://query.wikidata.org/sparql?query=${encodeURIComponent(sparql)}&format=json`;
    const res = await fetch(url, {
      headers: { "User-Agent": "PERFUMUM-Research/1.0 (perfumum@research.fr)" },
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) return [];
    const json = await res.json() as { results?: { bindings?: Record<string, { value: string }>[] } };
    return (json.results?.bindings || [])
      .map((b) => {
        const year = b.date?.value ? new Date(b.date.value).getFullYear() : 0;
        if (!year || year < 1600) return null;
        const qid = b.item?.value?.split("/").pop() || "";
        return {
          id: `wikidata-${qid}`,
          year,
          title: b.itemLabel?.value || "Sans titre",
          source: "wikidata" as const,
          type: "publication" as const,
          url: `https://www.wikidata.org/wiki/${qid}`,
          description: b.description?.value,
        };
      })
      .filter((e): e is NonNullable<typeof e> => e !== null) as TimelineEvent[];
  } catch { return []; }
}

// ─── Routeur ──────────────────────────────────────────────────────────────────

export const timelineRouter = router({

  // ── Procédures legacy (conservées) ──────────────────────────────────────────
  list: publicProcedure.query(async () => {
    return await dbModule.getAllMilestones?.() ?? [];
  }),
  getByPhase: publicProcedure
    .input((val: unknown) => { if (typeof val !== "string") throw new Error("Expected string"); return val; })
    .query(async ({ input }) => {
      return await dbModule.getMilestonesByPhase?.(input) ?? [];
    }),
  getByYear: publicProcedure
    .input((val: unknown) => { if (typeof val !== "number") throw new Error("Expected number"); return val; })
    .query(async ({ input }) => {
      return await dbModule.getMilestonesByYear?.(input) ?? [];
    }),
  stats: publicProcedure.query(async () => {
    return await dbModule.getTimelineStats?.() ?? {};
  }),

  // ── Nouvelles procédures Rapport 10 ─────────────────────────────────────────

  /**
   * Données principales de la frise chronologique multi-sources
   */
  getTimelineData: publicProcedure
    .input(z.object({
      query: z.string().optional().default("parfum olfactif"),
      yearFrom: z.number().int().min(1600).max(2100).optional(),
      yearTo: z.number().int().min(1600).max(2100).optional(),
      sources: z.array(z.enum(["perfumum", "openalex", "wikidata"])).optional().default(["perfumum", "openalex"]),
      entityType: z.enum(["molecule", "plant", "family", "general"]).optional(),
      entityId: z.number().int().optional(),
      limit: z.number().int().min(10).max(500).optional().default(200),
    }))
    .query(async ({ input }) => {
      const { query, yearFrom, yearTo, sources, entityType, entityId, limit } = input;
      const perSource = Math.ceil(limit / sources.length);

      const [perfumumRes, oaRes, wdRes] = await Promise.allSettled([
        sources.includes("perfumum")
          ? getDbTimelineEvents({ yearFrom, yearTo, entityType, entityId, limit: perSource })
          : Promise.resolve([]),
        sources.includes("openalex")
          ? getOpenAlexTimelineEvents({ query, yearFrom, yearTo, limit: perSource })
          : Promise.resolve([]),
        sources.includes("wikidata")
          ? getWikidataTimelineEvents({ query, yearFrom, yearTo, limit: Math.min(perSource, 20) })
          : Promise.resolve([]),
      ]);

      const allEvents: TimelineEvent[] = [
        ...(perfumumRes.status === "fulfilled" ? perfumumRes.value : []),
        ...(oaRes.status === "fulfilled" ? oaRes.value : []),
        ...(wdRes.status === "fulfilled" ? wdRes.value : []),
      ];

      // Dédupliquer par DOI
      const seen = new Set<string>();
      const deduped = allEvents.filter((e) => {
        const key = e.doi || e.id;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      }).sort((a, b) => b.year - a.year);

      const stats: TimelineStats = {
        totalEvents: deduped.length,
        bySource: {},
        byType: {},
        byDecade: {},
        yearRange: {
          min: deduped.length ? Math.min(...deduped.map((e) => e.year)) : (yearFrom || 1900),
          max: deduped.length ? Math.max(...deduped.map((e) => e.year)) : (yearTo || new Date().getFullYear()),
        },
      };
      for (const e of deduped) {
        stats.bySource[e.source] = (stats.bySource[e.source] || 0) + 1;
        stats.byType[e.type] = (stats.byType[e.type] || 0) + 1;
        const decade = `${Math.floor(e.year / 10) * 10}s`;
        stats.byDecade[decade] = (stats.byDecade[decade] || 0) + 1;
      }

      return { events: deduped.slice(0, limit), stats };
    }),

  /**
   * Données chronologiques pour une entité spécifique
   */
  getEntityTimeline: publicProcedure
    .input(z.object({
      entityType: z.enum(["molecule", "plant"]),
      entityId: z.number().int(),
      limit: z.number().int().min(5).max(100).optional().default(50),
    }))
    .query(async ({ input }) => {
      const db = dbModule.getDb();
      if (!db) return { events: [], entityName: "" };

      const table = input.entityType === "molecule" ? "molecules" : "plants";
      const rows = await (db as any).execute(`SELECT name FROM ${table} WHERE id = ? LIMIT 1`, [input.entityId]) as [Record<string, unknown>[], unknown];
      const entityName = Array.isArray(rows[0]) && rows[0][0] ? String((rows[0][0] as Record<string, unknown>).name || "") : "";

      const [dbEvents, oaEvents] = await Promise.allSettled([
        getDbTimelineEvents({ entityType: input.entityType, entityId: input.entityId, limit: input.limit }),
        entityName ? getOpenAlexTimelineEvents({ query: entityName, limit: Math.min(input.limit, 30) }) : Promise.resolve([]),
      ]);

      const events = [
        ...(dbEvents.status === "fulfilled" ? dbEvents.value : []),
        ...(oaEvents.status === "fulfilled" ? oaEvents.value : []),
      ].sort((a, b) => b.year - a.year);

      return { events: events.slice(0, input.limit), entityName };
    }),

  /**
   * Statistiques globales pour la page timeline
   */
  getTimelineStats: publicProcedure
    .query(async () => {
      const db = dbModule.getDb();
      if (!db) return { totalBiblio: 0, yearRange: { min: 1900, max: 2025 }, topDecades: [] };

      const dbAny = db as any;
      const [totalRows, decadeRows] = await Promise.all([
        dbAny.execute("SELECT COUNT(*) AS total, MIN(year) AS min_year, MAX(year) AS max_year FROM bibliography_entries WHERE year IS NOT NULL AND year > 1600") as Promise<[Record<string, unknown>[], unknown]>,
        dbAny.execute("SELECT FLOOR(year/10)*10 AS decade, COUNT(*) AS cnt FROM bibliography_entries WHERE year IS NOT NULL AND year > 1600 GROUP BY decade ORDER BY cnt DESC LIMIT 10") as Promise<[Record<string, unknown>[], unknown]>,
      ]);

      const totals = Array.isArray(totalRows[0]) && totalRows[0][0] ? totalRows[0][0] as Record<string, unknown> : {};
      const decades = Array.isArray(decadeRows[0]) ? decadeRows[0] as Record<string, unknown>[] : [];

      return {
        totalBiblio: Number(totals.total || 0),
        yearRange: { min: Number(totals.min_year || 1900), max: Number(totals.max_year || 2025) },
        topDecades: decades.map((r) => ({ decade: Number(r.decade || 0), count: Number(r.cnt || 0) })),
      };
    }),

  /**
   * getMoleculeDiscoveries — Frise des découvertes moléculaires aromatiques via Wikidata SPARQL
   * Implémente le template temporal_molecule_discovery du Rapport 7
   */
  getMoleculeDiscoveries: publicProcedure
    .input(z.object({
      yearFrom: z.number().int().min(1700).max(2100).optional().default(1800),
      yearTo: z.number().int().min(1700).max(2100).optional().default(new Date().getFullYear()),
      limit: z.number().int().min(10).max(100).optional().default(50),
    }))
    .query(async ({ input }) => {
      try {
        const sparql = `SELECT DISTINCT ?molecule ?moleculeLabel ?discoveryDate ?discovererLabel ?formulaLabel WHERE {
  ?molecule wdt:P31/wdt:P279* wd:Q11173 .
  ?molecule wdt:P575 ?discoveryDate .
  FILTER(YEAR(?discoveryDate) >= ${input.yearFrom} && YEAR(?discoveryDate) <= ${input.yearTo})
  OPTIONAL { ?molecule wdt:P61 ?discoverer . }
  OPTIONAL { ?molecule wdt:P274 ?formula . }
  FILTER EXISTS {
    { ?molecule wdt:P366 wd:Q81513 . }
    UNION { ?molecule wdt:P366 wd:Q12140 . }
    UNION { ?molecule wdt:P31 wd:Q2832070 . }
    UNION { ?molecule wdt:P31 wd:Q59199015 . }
  }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "fr,en" . }
}
ORDER BY ?discoveryDate
LIMIT ${Math.min(input.limit, 100)}`;

        const url = `https://query.wikidata.org/sparql?query=${encodeURIComponent(sparql)}&format=json`;
        const res = await fetch(url, {
          headers: { "User-Agent": "PERFUMUM-Research/1.0 (perfumum@research.fr)" },
          signal: AbortSignal.timeout(15000),
        });
        if (!res.ok) return { events: [], error: `Wikidata HTTP ${res.status}` };
        const json = await res.json() as { results?: { bindings?: Record<string, { value: string }>[] } };
        const events = (json.results?.bindings || [])
          .map((b) => {
            const year = b.discoveryDate?.value ? new Date(b.discoveryDate.value).getFullYear() : 0;
            if (!year || year < 1700) return null;
            const qid = b.molecule?.value?.split("/").pop() || "";
            return {
              id: `mol-${qid}`,
              year,
              label: b.moleculeLabel?.value || "Molécule inconnue",
              formula: b.formulaLabel?.value || null,
              discoverer: b.discovererLabel?.value || null,
              wikidataUrl: `https://www.wikidata.org/wiki/${qid}`,
            };
          })
          .filter((e): e is NonNullable<typeof e> => e !== null);
        return { events, error: null };
      } catch (err) {
        console.error("getMoleculeDiscoveries error:", err);
        return { events: [], error: String(err) };
      }
    }),
});
