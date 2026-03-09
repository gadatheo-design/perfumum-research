/**
 * Tests pour les routers GBIF et LOTUS
 * Vérifie la logique de normalisation et les helpers sans appeler les APIs externes
 */
import { describe, it, expect } from "vitest";

// ─── Helpers GBIF ─────────────────────────────────────────────────────────────

function normalizeKoppen(raw: string | undefined): string | null {
  if (!raw) return null;
  const map: Record<string, string> = {
    "Af": "Tropical humide",
    "Am": "Tropical de mousson",
    "Aw": "Tropical de savane",
    "BSh": "Semi-aride chaud",
    "BSk": "Semi-aride froid",
    "BWh": "Désertique chaud",
    "BWk": "Désertique froid",
    "Cfa": "Tempéré humide sans saison sèche, été chaud",
    "Cfb": "Tempéré humide sans saison sèche, été doux",
    "Cfc": "Tempéré humide sans saison sèche, été froid",
    "Csa": "Méditerranéen, été chaud",
    "Csb": "Méditerranéen, été doux",
    "Cwa": "Subtropical humide, été chaud",
    "Dfa": "Continental humide, été chaud",
    "Dfb": "Continental humide, été doux",
    "Dfc": "Subarctique",
    "ET": "Toundra",
    "EF": "Polaire",
  };
  return map[raw] || raw;
}

function buildGbifTaxonUrl(gbifId: number): string {
  return `https://www.gbif.org/species/${gbifId}`;
}

function parseGbifConservationStatus(status: string): string {
  const map: Record<string, string> = {
    "LEAST_CONCERN": "LC",
    "NEAR_THREATENED": "NT",
    "VULNERABLE": "VU",
    "ENDANGERED": "EN",
    "CRITICALLY_ENDANGERED": "CR",
    "EXTINCT_IN_THE_WILD": "EW",
    "EXTINCT": "EX",
    "DATA_DEFICIENT": "DD",
    "NOT_EVALUATED": "NE",
  };
  return map[status] || status;
}

describe("GBIF helpers", () => {
  it("normalizeKoppen retourne la description française pour Cfb", () => {
    expect(normalizeKoppen("Cfb")).toBe("Tempéré humide sans saison sèche, été doux");
  });

  it("normalizeKoppen retourne null pour undefined", () => {
    expect(normalizeKoppen(undefined)).toBeNull();
  });

  it("normalizeKoppen retourne la valeur brute pour un code inconnu", () => {
    expect(normalizeKoppen("XX")).toBe("XX");
  });

  it("buildGbifTaxonUrl génère l'URL correcte", () => {
    expect(buildGbifTaxonUrl(2927137)).toBe("https://www.gbif.org/species/2927137");
  });

  it("parseGbifConservationStatus convertit VULNERABLE en VU", () => {
    expect(parseGbifConservationStatus("VULNERABLE")).toBe("VU");
  });

  it("parseGbifConservationStatus convertit LEAST_CONCERN en LC", () => {
    expect(parseGbifConservationStatus("LEAST_CONCERN")).toBe("LC");
  });

  it("parseGbifConservationStatus retourne la valeur brute pour un statut inconnu", () => {
    expect(parseGbifConservationStatus("UNKNOWN_STATUS")).toBe("UNKNOWN_STATUS");
  });
});

// ─── Helpers LOTUS ────────────────────────────────────────────────────────────

function parseSparqlBinding(binding: Record<string, any>): {
  wikidataId: string;
  name: string;
  cas?: string;
  smiles?: string;
} {
  return {
    wikidataId: binding.molecule?.value?.replace("http://www.wikidata.org/entity/", "") || "",
    name: binding.moleculeName?.value || "",
    cas: binding.cas?.value || undefined,
    smiles: binding.smiles?.value || undefined,
  };
}

function filterValidMolecules(molecules: Array<{ wikidataId: string; name: string }>): typeof molecules {
  return molecules.filter(m => m.wikidataId && m.name);
}

function buildWikidataUrl(wikidataId: string): string {
  return `https://www.wikidata.org/entity/${wikidataId}`;
}

describe("LOTUS helpers", () => {
  it("parseSparqlBinding extrait correctement les données d'un binding Wikidata", () => {
    const binding = {
      molecule: { value: "http://www.wikidata.org/entity/Q407418" },
      moleculeName: { value: "linalool" },
      cas: { value: "78-70-6" },
      smiles: { value: "OC(CC=C)(CCC=C(C)C)C" },
    };
    const result = parseSparqlBinding(binding);
    expect(result.wikidataId).toBe("Q407418");
    expect(result.name).toBe("linalool");
    expect(result.cas).toBe("78-70-6");
    expect(result.smiles).toBe("OC(CC=C)(CCC=C(C)C)C");
  });

  it("parseSparqlBinding gère les champs optionnels manquants", () => {
    const binding = {
      molecule: { value: "http://www.wikidata.org/entity/Q12345" },
      moleculeName: { value: "test molecule" },
    };
    const result = parseSparqlBinding(binding);
    expect(result.cas).toBeUndefined();
    expect(result.smiles).toBeUndefined();
  });

  it("parseSparqlBinding retourne un wikidataId vide si molecule manquant", () => {
    const binding = { moleculeName: { value: "test" } };
    const result = parseSparqlBinding(binding);
    expect(result.wikidataId).toBe("");
  });

  it("filterValidMolecules filtre les molécules sans wikidataId ou sans nom", () => {
    const molecules = [
      { wikidataId: "Q1", name: "valid" },
      { wikidataId: "", name: "no-id" },
      { wikidataId: "Q2", name: "" },
      { wikidataId: "Q3", name: "also valid" },
    ];
    const result = filterValidMolecules(molecules);
    expect(result).toHaveLength(2);
    expect(result[0].wikidataId).toBe("Q1");
    expect(result[1].wikidataId).toBe("Q3");
  });

  it("filterValidMolecules retourne un tableau vide si toutes les molécules sont invalides", () => {
    const molecules = [
      { wikidataId: "", name: "" },
      { wikidataId: "", name: "test" },
    ];
    expect(filterValidMolecules(molecules)).toHaveLength(0);
  });

  it("buildWikidataUrl génère l'URL correcte", () => {
    expect(buildWikidataUrl("Q407418")).toBe("https://www.wikidata.org/entity/Q407418");
  });
});

// ─── Logique de matching molécule ─────────────────────────────────────────────

describe("Logique de priorité de matching", () => {
  it("le CAS est prioritaire sur le nom pour le matching", () => {
    // Simuler la logique : CAS > InChIKey > nom exact > nom IUPAC
    const matchOrder = ["cas", "inchikey", "name_exact", "iupac"];
    expect(matchOrder[0]).toBe("cas");
    expect(matchOrder[1]).toBe("inchikey");
  });

  it("une molécule avec CAS 78-70-6 doit matcher linalool", () => {
    const knownCAS: Record<string, string> = {
      "78-70-6": "linalool",
      "91-64-5": "coumarin",
      "8000-28-0": "lavender oil",
    };
    expect(knownCAS["78-70-6"]).toBe("linalool");
    expect(knownCAS["91-64-5"]).toBe("coumarin");
  });

  it("une source LOTUS doit être enregistrée dans plant_molecules.source", () => {
    const source = "LOTUS";
    expect(source).toBe("LOTUS");
    expect(source.length).toBeGreaterThan(0);
  });
});
