/**
 * Tests Sprint 3 bis — Annotation API dans EuropeanaExplorer
 * =============================================================
 * Valide les fonctions getAnnotations et searchAnnotations du service Europeana
 * ainsi que les procédures tRPC associées.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";

// ─── Mock fetch global ────────────────────────────────────────────────────────

const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

// ─── Helpers ─────────────────────────────────────────────────────────────────

function makeAnnotationItem(overrides: Record<string, any> = {}) {
  return {
    "@id": "https://annotation.europeana.eu/annotation/123/456",
    motivation: "tagging",
    body: {
      value: "Rosa damascena",
      "@language": "la",
    },
    target: {
      source: "https://www.europeana.eu/item/9200338/test",
    },
    creator: {
      "@id": "https://www.europeana.eu/user/abc",
    },
    created: "2023-06-15T10:00:00Z",
    ...overrides,
  };
}

function makeAnnotationResponse(items: any[], total = items.length) {
  return {
    items,
    partOf: { total },
  };
}

// ─── Tests getAnnotations ─────────────────────────────────────────────────────

describe("getAnnotations", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    process.env.EUROPEANA_API_KEY = "test-key-annotations";
  });

  it("retourne apiAvailable: false si pas de clé API", async () => {
    delete process.env.EUROPEANA_API_KEY;
    const { getAnnotations } = await import("./europeana");
    const result = await getAnnotations("/9200338/test");
    expect(result.apiAvailable).toBe(false);
    expect(result.annotations).toHaveLength(0);
    expect(result.error).toContain("EUROPEANA_API_KEY");
  });

  it("parse correctement une annotation de type tagging", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => makeAnnotationResponse([makeAnnotationItem()]),
    });
    const { getAnnotations } = await import("./europeana");
    const result = await getAnnotations("/9200338/test");
    expect(result.apiAvailable).toBe(true);
    expect(result.annotations).toHaveLength(1);
    const ann = result.annotations[0];
    expect(ann.type).toBe("tagging");
    expect(ann.body.value).toBe("Rosa damascena");
    expect(ann.body.language).toBe("la");
  });

  it("parse correctement une annotation de type transcribing", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => makeAnnotationResponse([
        makeAnnotationItem({ motivation: "transcribing", body: { value: "Oleum rosae" } }),
      ]),
    });
    const { getAnnotations } = await import("./europeana");
    const result = await getAnnotations("/9200338/test");
    expect(result.annotations[0].type).toBe("transcribing");
    expect(result.annotations[0].body.value).toBe("Oleum rosae");
  });

  it("parse correctement une annotation de type linking avec prefLabel", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => makeAnnotationResponse([
        makeAnnotationItem({
          motivation: "linking",
          body: {
            "@id": "http://data.europeana.eu/concept/1234",
            type: "skos:Concept",
            prefLabel: { fr: "Rose de Damas", en: "Damascus Rose" },
          },
        }),
      ]),
    });
    const { getAnnotations } = await import("./europeana");
    const result = await getAnnotations("/9200338/test");
    const ann = result.annotations[0];
    expect(ann.type).toBe("linking");
    expect(ann.body.source).toBe("http://data.europeana.eu/concept/1234");
    expect(ann.body.prefLabel).toBe("Rose de Damas"); // fr prioritaire
  });

  it("gère le total depuis partOf.total", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => makeAnnotationResponse([makeAnnotationItem()], 42),
    });
    const { getAnnotations } = await import("./europeana");
    const result = await getAnnotations("/9200338/test");
    expect(result.total).toBe(42);
  });

  it("retourne apiAvailable: false en cas d'erreur réseau", async () => {
    mockFetch.mockRejectedValueOnce(new Error("Network error"));
    const { getAnnotations } = await import("./europeana");
    const result = await getAnnotations("/9200338/test");
    expect(result.apiAvailable).toBe(false);
    expect(result.error).toContain("Network error");
  });

  it("retourne apiAvailable: false en cas d'erreur HTTP", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      statusText: "Unauthorized",
    });
    const { getAnnotations } = await import("./europeana");
    const result = await getAnnotations("/9200338/test");
    expect(result.apiAvailable).toBe(false);
  });

  it("gère les items vides correctement", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ items: [], partOf: { total: 0 } }),
    });
    const { getAnnotations } = await import("./europeana");
    const result = await getAnnotations("/9200338/test");
    expect(result.apiAvailable).toBe(true);
    expect(result.annotations).toHaveLength(0);
    expect(result.total).toBe(0);
  });
});

// ─── Tests searchAnnotations ──────────────────────────────────────────────────

describe("searchAnnotations", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    process.env.EUROPEANA_API_KEY = "test-key-annotations";
  });

  it("retourne apiAvailable: false si pas de clé API", async () => {
    delete process.env.EUROPEANA_API_KEY;
    const { searchAnnotations } = await import("./europeana");
    const result = await searchAnnotations("olibanum");
    expect(result.apiAvailable).toBe(false);
    expect(result.query).toBe("olibanum");
  });

  it("retourne les annotations correspondant au terme de recherche", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => makeAnnotationResponse([
        makeAnnotationItem({ body: { value: "olibanum" } }),
        makeAnnotationItem({ body: { value: "Boswellia sacra olibanum" } }),
      ], 2),
    });
    const { searchAnnotations } = await import("./europeana");
    const result = await searchAnnotations("olibanum");
    expect(result.apiAvailable).toBe(true);
    expect(result.annotations).toHaveLength(2);
    expect(result.total).toBe(2);
    expect(result.query).toBe("olibanum");
  });

  it("filtre par type d'annotation", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => makeAnnotationResponse([
        makeAnnotationItem({ motivation: "transcribing", body: { value: "nardus spikenard" } }),
      ]),
    });
    const { searchAnnotations } = await import("./europeana");
    const result = await searchAnnotations("nardus", "transcribing");
    expect(result.annotations[0].type).toBe("transcribing");
    // Vérifier que le paramètre qf a été passé dans l'URL
    const callUrl = mockFetch.mock.calls[0][0].toString();
    expect(callUrl).toContain("qf=motivation%3Atranscribing");
  });

  it("gère les erreurs réseau gracieusement", async () => {
    mockFetch.mockRejectedValueOnce(new Error("Connection refused"));
    const { searchAnnotations } = await import("./europeana");
    const result = await searchAnnotations("myrrha");
    expect(result.apiAvailable).toBe(false);
    expect(result.error).toBeDefined();
  });
});

// ─── Tests de l'interface AnnotationSheet ─────────────────────────────────────

describe("AnnotationSheet — extraction du recordId", () => {
  it("extrait correctement le recordId depuis un id commençant par /", () => {
    const id = "/9200338/BibliographicResource_3000126015840";
    const recordId = id.startsWith("/") ? id : `/${id.split("/").slice(-2).join("/")}`;
    expect(recordId).toBe("/9200338/BibliographicResource_3000126015840");
  });

  it("extrait correctement le recordId depuis un id sans /", () => {
    const id = "9200338/BibliographicResource_3000126015840";
    const recordId = id.startsWith("/") ? id : `/${id.split("/").slice(-2).join("/")}`;
    expect(recordId).toBe("/9200338/BibliographicResource_3000126015840");
  });

  it("gère un id vide", () => {
    const id = "";
    const recordId = id.startsWith("/") ? id : `/${id.split("/").slice(-2).join("/")}`;
    expect(recordId).toBe("/");
  });
});
