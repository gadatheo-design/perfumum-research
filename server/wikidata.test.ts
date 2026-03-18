/**
 * Tests vitest — NOSE Phase 4 : Service Wikidata
 * Couvre : searchMoleculeQid, searchPlantQid, generateJsonLd, getWikidataProperties
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { searchMoleculeQid, searchPlantQid, generateJsonLd, getWikidataProperties } from "./wikidata";

// Mock global fetch pour éviter les appels réseau réels
const mockFetch = vi.fn();
global.fetch = mockFetch;

beforeEach(() => {
  mockFetch.mockReset();
});

// ─── Tests searchMoleculeQid ──────────────────────────────────────────────────

describe("searchMoleculeQid", () => {
  it("retourne null si l'API ne trouve rien", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ search: [] }),
    });

    const result = await searchMoleculeQid("molécule_inexistante_xyz");
    expect(result).toBeNull();
  });

  it("retourne null si l'API échoue (ok: false)", async () => {
    mockFetch.mockResolvedValueOnce({ ok: false });

    const result = await searchMoleculeQid("linalool");
    expect(result).toBeNull();
  });

  it("retourne le premier résultat chimique correspondant", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        search: [
          {
            id: "Q193178",
            label: "linalool",
            description: "chemical compound, terpene alcohol",
          },
        ],
      }),
    });

    const result = await searchMoleculeQid("linalool");
    expect(result).not.toBeNull();
    expect(result?.qid).toBe("Q193178");
    expect(result?.label).toBe("linalool");
  });

  it("filtre les résultats non-chimiques (ex: lieu géographique)", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        search: [
          {
            id: "Q12345",
            label: "Linalool",
            description: "city in France",
          },
        ],
      }),
    });

    // Avec un seul résultat non-chimique, doit quand même retourner le best fallback
    const result = await searchMoleculeQid("Linalool");
    // Le fallback retourne le premier résultat même sans correspondance de type
    expect(result).not.toBeNull();
    expect(result?.qid).toBe("Q12345");
  });

  it("gère les erreurs réseau gracieusement", async () => {
    mockFetch.mockRejectedValueOnce(new Error("Network error"));

    const result = await searchMoleculeQid("linalool");
    expect(result).toBeNull();
  });

  it("normalise les noms avec caractères spéciaux (β-caryophyllène)", async () => {
    // Premier appel : nom original
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ search: [] }),
    });
    // Deuxième appel : nom normalisé
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        search: [
          {
            id: "Q2707619",
            label: "beta-caryophyllene",
            description: "chemical compound, sesquiterpene",
          },
        ],
      }),
    });

    const result = await searchMoleculeQid("β-caryophyllène");
    expect(result).not.toBeNull();
    expect(result?.qid).toBe("Q2707619");
  });
});

// ─── Tests searchPlantQid ─────────────────────────────────────────────────────

describe("searchPlantQid", () => {
  it("retourne null si l'API ne trouve rien", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ search: [] }),
    });

    const result = await searchPlantQid("Planta_inexistens_xyz");
    expect(result).toBeNull();
  });

  it("retourne le QID pour une plante connue", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        search: [
          {
            id: "Q158082",
            label: "Rosa damascena",
            description: "species of plant, rose used in perfumery",
          },
        ],
      }),
    });

    const result = await searchPlantQid("Rosa damascena");
    expect(result).not.toBeNull();
    expect(result?.qid).toBe("Q158082");
    expect(result?.label).toBe("Rosa damascena");
  });

  it("gère les erreurs réseau gracieusement", async () => {
    mockFetch.mockRejectedValueOnce(new Error("Network error"));

    const result = await searchPlantQid("Lavandula angustifolia");
    expect(result).toBeNull();
  });
});

// ─── Tests getWikidataProperties ─────────────────────────────────────────────

describe("getWikidataProperties", () => {
  it("retourne un objet vide si l'API SPARQL échoue", async () => {
    mockFetch.mockResolvedValueOnce({ ok: false });

    const props = await getWikidataProperties("Q193178");
    expect(props).toEqual({});
  });

  it("retourne les propriétés CAS et InChIKey si disponibles", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        results: {
          bindings: [
            {
              cas: { value: "78-70-6" },
              inchikey: { value: "UWKQSSZGPQMRHT-UHFFFAOYSA-N" },
              pubchem: { value: "6549" },
              chebi: { value: "17580" },
            },
          ],
        },
      }),
    });

    const props = await getWikidataProperties("Q193178");
    expect(props.casNumber).toBe("78-70-6");
    expect(props.inchiKey).toBe("UWKQSSZGPQMRHT-UHFFFAOYSA-N");
    expect(props.pubchemCid).toBe("6549");
    expect(props.chebiId).toBe("CHEBI:17580");
  });

  it("retourne un objet vide si aucun binding n'est trouvé", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        results: { bindings: [] },
      }),
    });

    const props = await getWikidataProperties("Q9999999");
    expect(props).toEqual({});
  });

  it("gère les erreurs réseau gracieusement", async () => {
    mockFetch.mockRejectedValueOnce(new Error("SPARQL timeout"));

    const props = await getWikidataProperties("Q193178");
    expect(props).toEqual({});
  });
});

// ─── Tests generateJsonLd ─────────────────────────────────────────────────────

describe("generateJsonLd", () => {
  it("génère un JSON-LD valide pour une molécule avec QID", () => {
    const jsonLd = generateJsonLd({
      id: 42,
      name: "Linalool",
      wikidataQid: "Q193178",
      casNumber: "78-70-6",
      smiles: "CC(C)=CCCC(C)(O)C=C",
      inchiKey: "UWKQSSZGPQMRHT-UHFFFAOYSA-N",
      olfactiveProfile: "floral, lavender, woody",
      type: "molecule",
    });

    expect(jsonLd["@type"]).toBe("schema:ChemicalSubstance");
    expect(jsonLd["@id"]).toBe("wd:Q193178");
    expect(jsonLd["schema:name"]).toBe("Linalool");
    expect(jsonLd["owl:sameAs"]).toBe("https://www.wikidata.org/entity/Q193178");
    expect(jsonLd["perfumum:id"]).toBe(42);
    expect(jsonLd["schema:inChIKey"]).toBe("UWKQSSZGPQMRHT-UHFFFAOYSA-N");
    expect(jsonLd["schema:hasRepresentation"]).toBe("CC(C)=CCCC(C)(O)C=C");
  });

  it("génère un JSON-LD valide pour une molécule SANS QID", () => {
    const jsonLd = generateJsonLd({
      id: 99,
      name: "Molécule inconnue",
      wikidataQid: null,
      type: "molecule",
    });

    expect(jsonLd["@id"]).toBe("https://perfumum.org/molecule/99");
    expect(jsonLd["owl:sameAs"]).toBeUndefined();
    expect(jsonLd["schema:name"]).toBe("Molécule inconnue");
  });

  it("génère un JSON-LD valide pour une plante avec QID", () => {
    const jsonLd = generateJsonLd({
      id: 7,
      name: "Rosa damascena",
      wikidataQid: "Q158082",
      type: "plant",
    });

    expect(jsonLd["@type"]).toBe("schema:Taxon");
    expect(jsonLd["@id"]).toBe("wd:Q158082");
    expect(jsonLd["owl:sameAs"]).toBe("https://www.wikidata.org/entity/Q158082");
    expect(jsonLd["perfumum:id"]).toBe(7);
  });

  it("inclut le contexte JSON-LD avec les namespaces NOSE/Odeuropa", () => {
    const jsonLd = generateJsonLd({
      id: 1,
      name: "Test",
      type: "molecule",
    });

    const ctx = jsonLd["@context"] as Record<string, string>;
    expect(ctx["schema"]).toBe("https://schema.org/");
    expect(ctx["wd"]).toBe("https://www.wikidata.org/entity/");
    expect(ctx["od"]).toBe("https://odeuropa.eu/ontology/");
    expect(ctx["skos"]).toBe("http://www.w3.org/2004/02/skos/core#");
  });

  it("inclut le CAS number comme PropertyValue si disponible", () => {
    const jsonLd = generateJsonLd({
      id: 1,
      name: "Linalool",
      casNumber: "78-70-6",
      type: "molecule",
    });

    const identifier = jsonLd["schema:identifier"] as Record<string, string>;
    expect(identifier["@type"]).toBe("schema:PropertyValue");
    expect(identifier["schema:propertyID"]).toBe("CAS");
    expect(identifier["schema:value"]).toBe("78-70-6");
  });

  it("inclut le profil olfactif pour les molécules", () => {
    const jsonLd = generateJsonLd({
      id: 1,
      name: "Linalool",
      olfactiveProfile: "floral, lavender",
      type: "molecule",
    });

    expect(jsonLd["od:hasOlfactiveProfile"]).toBe("floral, lavender");
  });
});
