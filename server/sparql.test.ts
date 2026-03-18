/**
 * Tests vitest — Service SPARQL (NOSE Phase 5)
 * ================================================
 * Tests unitaires pour le service de requêtes croisées Wikidata/Europeana
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  executeSparqlQuery,
  findArtworksForMolecule,
  findPapersForMolecule,
  findCollectionsForPlant,
  findArtworksForMoleculesBatch,
  executeFreeSparqlQuery,
  getNoseStats,
  type SparqlResults,
} from "./sparql";

// ─── Mock fetch global ────────────────────────────────────────────────────────
const mockFetch = vi.fn();
global.fetch = mockFetch;

const MOCK_SPARQL_RESULTS: SparqlResults = {
  head: { vars: ["artwork", "artworkLabel", "image"] },
  results: {
    bindings: [
      {
        artwork: { type: "uri", value: "https://www.wikidata.org/entity/Q12345" },
        artworkLabel: { type: "literal", value: "La Fleur de Jasmin" },
        image: { type: "uri", value: "https://commons.wikimedia.org/wiki/File:Jasmin.jpg" },
      },
      {
        artwork: { type: "uri", value: "https://www.wikidata.org/entity/Q67890" },
        artworkLabel: { type: "literal", value: "Nature morte aux roses" },
      },
    ],
  },
};

const MOCK_PAPERS_RESULTS: SparqlResults = {
  head: { vars: ["paper", "paperLabel", "doi", "date", "journalLabel"] },
  results: {
    bindings: [
      {
        paper: { type: "uri", value: "https://www.wikidata.org/entity/Q99999" },
        paperLabel: { type: "literal", value: "Linalool in aromatherapy: a systematic review" },
        doi: { type: "literal", value: "10.1234/example.2023" },
        date: { type: "literal", value: "2023-06-15T00:00:00Z" },
        journalLabel: { type: "literal", value: "Journal of Essential Oil Research" },
      },
    ],
  },
};

const MOCK_EMPTY_RESULTS: SparqlResults = {
  head: { vars: ["item"] },
  results: { bindings: [] },
};

// ─── Tests executeSparqlQuery ─────────────────────────────────────────────────
describe("executeSparqlQuery", () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  it("retourne les résultats SPARQL correctement", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => MOCK_SPARQL_RESULTS,
    });

    const result = await executeSparqlQuery("SELECT * WHERE { ?s ?p ?o } LIMIT 1");
    expect(result.head.vars).toEqual(["artwork", "artworkLabel", "image"]);
    expect(result.results.bindings).toHaveLength(2);
  });

  it("lance une erreur si HTTP non-OK", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      text: async () => "Bad Request",
    });

    await expect(
      executeSparqlQuery("INVALID SPARQL")
    ).rejects.toThrow("SPARQL HTTP 400");
  });

  it("inclut les bons headers User-Agent", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => MOCK_EMPTY_RESULTS,
    });

    await executeSparqlQuery("SELECT * WHERE { ?s ?p ?o } LIMIT 1");

    const callArgs = mockFetch.mock.calls[0];
    expect(callArgs[1].headers["User-Agent"]).toContain("PERFUMUM-Research");
    expect(callArgs[1].headers["Accept"]).toBe("application/sparql-results+json");
  });

  it("encode correctement la requête dans l'URL", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => MOCK_EMPTY_RESULTS,
    });

    const sparql = "SELECT ?s WHERE { ?s ?p ?o }";
    await executeSparqlQuery(sparql);

    const url = mockFetch.mock.calls[0][0] as string;
    expect(url).toContain("query=");
    expect(url).toContain("format=json");
  });
});

// ─── Tests findArtworksForMolecule ────────────────────────────────────────────
describe("findArtworksForMolecule", () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  it("retourne les œuvres d'art correctement formatées", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => MOCK_SPARQL_RESULTS,
    });

    const artworks = await findArtworksForMolecule("Q407418", "Linalol", 20);

    expect(artworks).toHaveLength(2);
    expect(artworks[0]).toMatchObject({
      qid: "Q12345",
      label: "La Fleur de Jasmin",
      image: "https://commons.wikimedia.org/wiki/File:Jasmin.jpg",
      moleculeName: "Linalol",
      moleculeQid: "Q407418",
    });
    expect(artworks[0].wikidataUrl).toContain("wikidata.org");
  });

  it("retourne un tableau vide en cas d'erreur réseau", async () => {
    mockFetch.mockRejectedValueOnce(new Error("Network error"));

    const artworks = await findArtworksForMolecule("Q407418", "Linalol", 20);
    expect(artworks).toEqual([]);
  });

  it("gère les résultats sans image", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => MOCK_SPARQL_RESULTS,
    });

    const artworks = await findArtworksForMolecule("Q407418", "Linalol", 20);
    expect(artworks[1].image).toBeUndefined();
  });

  it("extrait correctement le QID de l'URL Wikidata", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => MOCK_SPARQL_RESULTS,
    });

    const artworks = await findArtworksForMolecule("Q407418", "Linalol", 20);
    expect(artworks[0].qid).toBe("Q12345");
    expect(artworks[1].qid).toBe("Q67890");
  });
});

// ─── Tests findPapersForMolecule ──────────────────────────────────────────────
describe("findPapersForMolecule", () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  it("retourne les publications correctement formatées", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => MOCK_PAPERS_RESULTS,
    });

    const papers = await findPapersForMolecule("Q407418", "Linalol", 20);

    expect(papers).toHaveLength(1);
    expect(papers[0]).toMatchObject({
      qid: "Q99999",
      title: "Linalool in aromatherapy: a systematic review",
      doi: "10.1234/example.2023",
      journal: "Journal of Essential Oil Research",
      moleculeName: "Linalol",
      moleculeQid: "Q407418",
    });
  });

  it("tronque la date à 10 caractères", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => MOCK_PAPERS_RESULTS,
    });

    const papers = await findPapersForMolecule("Q407418", "Linalol", 20);
    expect(papers[0].date).toBe("2023-06-15");
  });

  it("retourne un tableau vide en cas d'erreur", async () => {
    mockFetch.mockRejectedValueOnce(new Error("Timeout"));
    const papers = await findPapersForMolecule("Q407418", "Linalol", 20);
    expect(papers).toEqual([]);
  });
});

// ─── Tests findCollectionsForPlant ────────────────────────────────────────────
describe("findCollectionsForPlant", () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  it("retourne les collections correctement formatées", async () => {
    const mockCollections: SparqlResults = {
      head: { vars: ["item", "itemLabel", "collectionLabel", "countryLabel"] },
      results: {
        bindings: [
          {
            item: { type: "uri", value: "https://www.wikidata.org/entity/Q11111" },
            itemLabel: { type: "literal", value: "Herbier de Paris — Vetiveria zizanioides" },
            collectionLabel: { type: "literal", value: "Muséum National d'Histoire Naturelle" },
            countryLabel: { type: "literal", value: "France" },
          },
        ],
      },
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockCollections,
    });

    const collections = await findCollectionsForPlant("Q163939", "Vétiver", 20);

    expect(collections).toHaveLength(1);
    expect(collections[0]).toMatchObject({
      qid: "Q11111",
      label: "Herbier de Paris — Vetiveria zizanioides",
      collection: "Muséum National d'Histoire Naturelle",
      country: "France",
      plantName: "Vétiver",
      plantQid: "Q163939",
    });
  });
});

// ─── Tests findArtworksForMoleculesBatch ─────────────────────────────────────
describe("findArtworksForMoleculesBatch", () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  it("retourne un tableau vide pour une liste vide de QIDs", async () => {
    const artworks = await findArtworksForMoleculesBatch([]);
    expect(artworks).toEqual([]);
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("construit correctement la clause VALUES pour plusieurs QIDs", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => MOCK_EMPTY_RESULTS,
    });

    await findArtworksForMoleculesBatch(["Q407418", "Q163939", "Q207414"]);

    const url = mockFetch.mock.calls[0][0] as string;
    expect(decodeURIComponent(url)).toContain("wd:Q407418");
    expect(decodeURIComponent(url)).toContain("wd:Q163939");
    expect(decodeURIComponent(url)).toContain("wd:Q207414");
  });
});

// ─── Tests executeFreeSparqlQuery ─────────────────────────────────────────────
describe("executeFreeSparqlQuery", () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  it("bloque les requêtes INSERT", async () => {
    const result = await executeFreeSparqlQuery("INSERT DATA { <s> <p> <o> }");
    expect(result.error).toBeDefined();
    expect(result.error).toContain("SELECT");
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("bloque les requêtes DELETE", async () => {
    const result = await executeFreeSparqlQuery("DELETE WHERE { ?s ?p ?o }");
    expect(result.error).toBeDefined();
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("bloque les requêtes UPDATE", async () => {
    const result = await executeFreeSparqlQuery("UPDATE <graph> SET ?s ?p ?o");
    expect(result.error).toBeDefined();
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("bloque les requêtes DROP", async () => {
    const result = await executeFreeSparqlQuery("DROP GRAPH <g>");
    expect(result.error).toBeDefined();
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("autorise les requêtes SELECT", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => MOCK_SPARQL_RESULTS,
    });

    const result = await executeFreeSparqlQuery(
      "SELECT ?s WHERE { ?s ?p ?o } LIMIT 1"
    );
    expect(result.error).toBeUndefined();
    expect(result.vars).toEqual(["artwork", "artworkLabel", "image"]);
    expect(result.bindings).toHaveLength(2);
  });

  it("retourne une erreur formatée en cas d'exception", async () => {
    mockFetch.mockRejectedValueOnce(new Error("SPARQL timeout"));

    const result = await executeFreeSparqlQuery(
      "SELECT ?s WHERE { ?s ?p ?o } LIMIT 1"
    );
    expect(result.error).toBe("SPARQL timeout");
    expect(result.bindings).toEqual([]);
  });

  it("est insensible à la casse pour la validation", async () => {
    const result = await executeFreeSparqlQuery("insert data { <s> <p> <o> }");
    expect(result.error).toBeDefined();
    expect(mockFetch).not.toHaveBeenCalled();
  });
});

// ─── Tests getNoseStats ───────────────────────────────────────────────────────
describe("getNoseStats", () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  it("retourne des zéros pour une liste vide de QIDs", async () => {
    const stats = await getNoseStats([]);
    expect(stats.totalWithArtworks).toBe(0);
    expect(stats.totalWithPapers).toBe(0);
    expect(stats.sampleArtworks).toEqual([]);
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("retourne des zéros en cas d'erreur réseau", async () => {
    mockFetch.mockRejectedValue(new Error("Network error"));

    const stats = await getNoseStats(["Q407418", "Q163939"]);
    expect(stats.totalWithArtworks).toBe(0);
    expect(stats.totalWithPapers).toBe(0);
  });

  it("parse correctement les comptages SPARQL", async () => {
    const mockCountResults: SparqlResults = {
      head: { vars: ["count"] },
      results: {
        bindings: [
          { count: { type: "literal", value: "7" } },
        ],
      },
    };

    // Premier appel = artworks count, deuxième = papers count, troisième = sample artworks
    mockFetch
      .mockResolvedValueOnce({ ok: true, json: async () => mockCountResults })
      .mockResolvedValueOnce({ ok: true, json: async () => mockCountResults })
      .mockResolvedValueOnce({ ok: true, json: async () => MOCK_EMPTY_RESULTS });

    const stats = await getNoseStats(["Q407418", "Q163939"]);
    expect(stats.totalWithArtworks).toBe(7);
    expect(stats.totalWithPapers).toBe(7);
  });
});
