/**
 * Tests Sprint 2 — IIIF Full-Text Search + Distribution géographique
 * ===================================================================
 * Valide les nouvelles fonctions ajoutées dans server/europeana.ts :
 * - searchIiifFullText
 * - getCountryDistribution
 * - COUNTRY_COORDS (via getCountryDistribution en mode démo)
 * - extractSnippet (indirectement via searchIiifFullText)
 */

import { describe, it, expect, vi, beforeEach } from "vitest";

// ─── Mocks ────────────────────────────────────────────────────────────────────

// Mock fetch pour éviter les appels réseau réels
vi.stubGlobal("fetch", vi.fn());

// Réinitialiser les mocks avant chaque test
beforeEach(() => {
  vi.clearAllMocks();
  // Supprimer la clé API pour forcer le mode dégradé dans certains tests
  delete process.env.EUROPEANA_API_KEY;
});

// ─── Tests searchIiifFullText ─────────────────────────────────────────────────

describe("searchIiifFullText", () => {
  it("retourne une erreur si EUROPEANA_API_KEY est absent", async () => {
    const { searchIiifFullText } = await import("./europeana");
    const result = await searchIiifFullText("olibanum");

    expect(result.apiAvailable).toBe(false);
    expect(result.hits).toHaveLength(0);
    expect(result.total).toBe(0);
    expect(result.error).toContain("EUROPEANA_API_KEY");
  });

  it("retourne le query passé en paramètre", async () => {
    const { searchIiifFullText } = await import("./europeana");
    const result = await searchIiifFullText("rosa damascena");

    expect(result.query).toBe("rosa damascena");
  });

  it("retourne des hits vides si aucun document trouvé (API active)", async () => {
    process.env.EUROPEANA_API_KEY = "test-key-123";

    // Mock : Europeana Search retourne 0 items
    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ items: [], totalResults: 0 }),
    });

    const { searchIiifFullText } = await import("./europeana");
    const result = await searchIiifFullText("xyznonexistent");

    expect(result.apiAvailable).toBe(true);
    expect(result.hits).toHaveLength(0);
    expect(result.total).toBe(0);
  });

  it("gère une erreur HTTP de l'API Europeana", async () => {
    process.env.EUROPEANA_API_KEY = "test-key-123";

    (fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 503,
    });

    const { searchIiifFullText } = await import("./europeana");
    const result = await searchIiifFullText("olibanum");

    expect(result.apiAvailable).toBe(false);
    expect(result.error).toBeDefined();
  });

  it("extrait les hits depuis une réponse IIIF valide", async () => {
    process.env.EUROPEANA_API_KEY = "test-key-123";

    // Mock étape 1 : Europeana Search retourne 1 document
    (fetch as any)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          items: [{
            id: "/9200365/BibliographicResource_3000126284840",
            title: ["Herbarius Latinus"],
            dataProvider: ["Bibliothèque nationale de France"],
            country: ["France"],
            year: ["1484"],
          }],
          totalResults: 1,
        }),
      })
      // Mock étape 2 : IIIF Content Search retourne 1 annotation
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          resources: [{
            resource: {
              chars: "De olibano et eius proprietatibus. Olibanum est resina arboris...",
            },
            on: "https://iiif.europeana.eu/presentation/9200365/BibliographicResource_3000126284840/canvas/p1",
          }],
        }),
      });

    const { searchIiifFullText } = await import("./europeana");
    const result = await searchIiifFullText("olibanum", 5);

    expect(result.apiAvailable).toBe(true);
    expect(result.hits.length).toBeGreaterThanOrEqual(1);

    const hit = result.hits[0];
    expect(hit.recordId).toBe("/9200365/BibliographicResource_3000126284840");
    expect(hit.title).toBe("Herbarius Latinus");
    expect(hit.institution).toBe("Bibliothèque nationale de France");
    expect(hit.country).toBe("France");
    expect(hit.date).toBe("1484");
    // Le snippet peut contenir la version latine "Olibanum" (majuscule) ou "olibanum"
    expect(hit.snippet.toLowerCase()).toContain("olibanum");
    expect(hit.europeanaUrl).toContain("europeana.eu");
    expect(hit.iiifManifestUrl).toContain("iiif.europeana.eu");
  });

  it("utilise le filtre thématique si themeFilter est spécifié", async () => {
    process.env.EUROPEANA_API_KEY = "test-key-123";

    let capturedUrl = "";
    (fetch as any).mockImplementation((url: string) => {
      capturedUrl = url;
      return Promise.resolve({
        ok: true,
        json: async () => ({ items: [], totalResults: 0 }),
      });
    });

    const { searchIiifFullText } = await import("./europeana");
    await searchIiifFullText("myrrha", 5, "distillation_alchimie");

    // Le thème distillation_alchimie a europeanaTheme = "manuscript"
    expect(capturedUrl).toContain("theme=manuscript");
  });
});

// ─── Tests getCountryDistribution ────────────────────────────────────────────

describe("getCountryDistribution", () => {
  it("retourne les données de démonstration si EUROPEANA_API_KEY est absent", async () => {
    const { getCountryDistribution } = await import("./europeana");
    const result = await getCountryDistribution("rose_damas");

    expect(result.apiAvailable).toBe(false);
    expect(result.countries.length).toBeGreaterThan(0);
    // Les données démo doivent avoir des coordonnées
    const france = result.countries.find((c) => c.code === "France");
    expect(france).toBeDefined();
    expect(france?.lat).toBeDefined();
    expect(france?.lng).toBeDefined();
    expect(france?.count).toBeGreaterThan(0);
  });

  it("retourne une erreur si le thème est inconnu (avec clé API)", async () => {
    process.env.EUROPEANA_API_KEY = "test-key-123";
    const { getCountryDistribution } = await import("./europeana");
    const result = await getCountryDistribution("theme_inexistant");

    expect(result.apiAvailable).toBe(false);
    expect(result.error).toContain("theme_inexistant");
    expect(result.countries).toHaveLength(0);
  });

  it("retourne les pays avec coordonnées depuis l'API Europeana", async () => {
    process.env.EUROPEANA_API_KEY = "test-key-123";

    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        totalResults: 5432,
        facets: [
          {
            name: "COUNTRY",
            fields: [
              { label: "France", count: 1842 },
              { label: "Germany", count: 1534 },
              { label: "Netherlands", count: 1287 },
              { label: "Italy", count: 1156 },
            ],
          },
          {
            name: "DATA_PROVIDER",
            fields: [
              { label: "Rijksmuseum", count: 890 },
              { label: "Bibliothèque nationale de France", count: 756 },
            ],
          },
        ],
      }),
    });

    const { getCountryDistribution } = await import("./europeana");
    const result = await getCountryDistribution("rose_damas", 10);

    expect(result.apiAvailable).toBe(true);
    expect(result.total).toBe(5432);
    expect(result.theme).toBe("rose_damas");
    expect(result.countries.length).toBe(4);

    const france = result.countries.find((c) => c.code === "France");
    expect(france).toBeDefined();
    expect(france?.count).toBe(1842);
    // France doit avoir des coordonnées depuis COUNTRY_COORDS
    expect(france?.lat).toBeCloseTo(46.22, 0);
    expect(france?.lng).toBeCloseTo(2.21, 0);
  });

  it("gère une erreur HTTP de l'API Europeana", async () => {
    process.env.EUROPEANA_API_KEY = "test-key-123";

    (fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 429,
    });

    const { getCountryDistribution } = await import("./europeana");
    const result = await getCountryDistribution("encens");

    // Doit retourner les données démo en fallback
    expect(result.apiAvailable).toBe(false);
    expect(result.countries.length).toBeGreaterThan(0);
    expect(result.error).toBeDefined();
  });

  it("utilise le filtre europeanaTheme si configuré pour le thème", async () => {
    process.env.EUROPEANA_API_KEY = "test-key-123";

    let capturedUrl = "";
    (fetch as any).mockImplementation((url: string) => {
      capturedUrl = url;
      return Promise.resolve({
        ok: true,
        json: async () => ({
          totalResults: 0,
          facets: [{ name: "COUNTRY", fields: [] }],
        }),
      });
    });

    const { getCountryDistribution } = await import("./europeana");
    await getCountryDistribution("illustrations_botaniques");

    // illustrations_botaniques a europeanaTheme = "nature"
    expect(capturedUrl).toContain("theme=nature");
  });

  it("utilise rows=0 pour ne récupérer que les facettes", async () => {
    process.env.EUROPEANA_API_KEY = "test-key-123";

    let capturedUrl = "";
    (fetch as any).mockImplementation((url: string) => {
      capturedUrl = url;
      return Promise.resolve({
        ok: true,
        json: async () => ({
          totalResults: 0,
          facets: [{ name: "COUNTRY", fields: [] }],
        }),
      });
    });

    const { getCountryDistribution } = await import("./europeana");
    await getCountryDistribution("rose_damas");

    expect(capturedUrl).toContain("rows=0");
    expect(capturedUrl).toContain("facet=COUNTRY");
    expect(capturedUrl).toContain("facet=DATA_PROVIDER");
  });
});
