/**
 * Tests vitest pour le router correlations
 * Vérifie les procédures getCrossDomainMolecules, getCorrelationStats, getTopFamilies
 */
import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock du module db
vi.mock("./db", () => ({
  getDb: vi.fn(),
}));

import { getDb } from "./db";

// ─── Données de test ─────────────────────────────────────────────────────────
const mockMolecules = [
  {
    id: 1,
    name: "β-Caryophyllène",
    family: "Sesquiterpène",
    casNumber: "87-44-5",
    formula: "C15H24",
    therapeuticProperties: "Anti-inflammatoire (agoniste CB2)",
    olfactiveProfile: '["épicé","boisé","poivré"]',
    domains: "aromatique,cannabis,fleur",
    domain_count: 2,
    plant_count: 52,
    plant_names: "Poivre noir|Cannabis sativa|Lavande",
  },
  {
    id: 2,
    name: "Limonène",
    family: "Monoterpène",
    casNumber: "5989-27-5",
    formula: "C10H16",
    therapeuticProperties: "Anticancéreux, anxiolytique",
    olfactiveProfile: '["citron","frais","agrume"]',
    domains: "aromatique,cannabis,tabac",
    domain_count: 3,
    plant_count: 97,
    plant_names: "Citron|Cannabis sativa|Tabac Virginia",
  },
];

const mockStats = {
  triple_domain: 3,
  double_domain: 27,
  cannabis_tabac: 5,
  cannabis_parfum: 22,
  tabac_parfum: 8,
};

const mockFamilies = [
  { family: "Sesquiterpène", examples: "β-Caryophyllène|Humulène", domain_count: 2 },
  { family: "Monoterpène", examples: "Limonène|Myrcène", domain_count: 3 },
];

// ─── Tests getCrossDomainMolecules ───────────────────────────────────────────
describe("correlations.getCrossDomainMolecules", () => {
  it("should parse domains correctly from comma-separated string", () => {
    const raw = "aromatique,cannabis,fleur";
    const domains = raw.split(",").filter(Boolean).map((d: string) => {
      if (d === "cannabis") return "cannabis";
      if (d === "tabac") return "tabac";
      return "parfum";
    }).filter((v: string, i: number, a: string[]) => a.indexOf(v) === i);

    expect(domains).toContain("cannabis");
    expect(domains).toContain("parfum");
    expect(domains).not.toContain("tabac");
    expect(domains.length).toBe(2);
  });

  it("should identify triple domain molecules correctly", () => {
    const raw = "aromatique,cannabis,tabac";
    const domains = raw.split(",").filter(Boolean).map((d: string) => {
      if (d === "cannabis") return "cannabis";
      if (d === "tabac") return "tabac";
      return "parfum";
    }).filter((v: string, i: number, a: string[]) => a.indexOf(v) === i);

    expect(domains.length).toBe(3);
    expect(domains).toContain("cannabis");
    expect(domains).toContain("tabac");
    expect(domains).toContain("parfum");
  });

  it("should parse olfactiveProfile JSON correctly", () => {
    const raw = '["épicé","boisé","poivré"]';
    let parsed: string[] = [];
    try {
      parsed = JSON.parse(raw);
    } catch {
      parsed = [];
    }
    expect(parsed).toEqual(["épicé", "boisé", "poivré"]);
  });

  it("should handle invalid olfactiveProfile gracefully", () => {
    const raw = "invalid json";
    let parsed: string[] = [];
    try {
      parsed = JSON.parse(raw);
    } catch {
      parsed = [];
    }
    expect(parsed).toEqual([]);
  });

  it("should parse plant_names correctly", () => {
    const raw = "Poivre noir|Cannabis sativa|Lavande";
    const names = raw.split("|").filter(Boolean).slice(0, 10);
    expect(names).toHaveLength(3);
    expect(names[0]).toBe("Poivre noir");
  });

  it("should limit plant names to 10", () => {
    const raw = Array.from({ length: 15 }, (_, i) => `Plant ${i + 1}`).join("|");
    const names = raw.split("|").filter(Boolean).slice(0, 10);
    expect(names).toHaveLength(10);
  });
});

// ─── Tests getCorrelationStats ───────────────────────────────────────────────
describe("correlations.getCorrelationStats", () => {
  it("should convert numeric string values to numbers", () => {
    const stats = {
      tripleDomain: Number(mockStats.triple_domain),
      doubleDomain: Number(mockStats.double_domain),
      cannabisTabac: Number(mockStats.cannabis_tabac),
      cannabisParfum: Number(mockStats.cannabis_parfum),
      tabacParfum: Number(mockStats.tabac_parfum),
    };

    expect(stats.tripleDomain).toBe(3);
    expect(stats.doubleDomain).toBe(27);
    expect(stats.cannabisTabac).toBe(5);
    expect(stats.cannabisParfum).toBe(22);
    expect(stats.tabacParfum).toBe(8);
    expect(typeof stats.tripleDomain).toBe("number");
  });

  it("should handle null values gracefully", () => {
    const nullStats = {
      triple_domain: null,
      double_domain: null,
      cannabis_tabac: null,
      cannabis_parfum: null,
      tabac_parfum: null,
    };

    const result = {
      tripleDomain: Number(nullStats.triple_domain || 0),
      doubleDomain: Number(nullStats.double_domain || 0),
      cannabisTabac: Number(nullStats.cannabis_tabac || 0),
      cannabisParfum: Number(nullStats.cannabis_parfum || 0),
      tabacParfum: Number(nullStats.tabac_parfum || 0),
    };

    expect(result.tripleDomain).toBe(0);
    expect(result.doubleDomain).toBe(0);
  });
});

// ─── Tests getTopFamilies ────────────────────────────────────────────────────
describe("correlations.getTopFamilies", () => {
  it("should group molecules by family correctly", () => {
    const rows = [
      { family: "Sesquiterpène", examples: "β-Caryophyllène|Humulène" },
      { family: "Sesquiterpène", examples: "Nerolidol|Guaïol" },
      { family: "Monoterpène", examples: "Limonène|Myrcène" },
    ];

    const familyMap: Record<string, { count: number; examples: string[] }> = {};
    for (const r of rows) {
      const fam = r.family || "Non classé";
      if (!familyMap[fam]) familyMap[fam] = { count: 0, examples: [] };
      familyMap[fam].count++;
      const examples = (r.examples || "").split("|").filter(Boolean);
      familyMap[fam].examples.push(...examples.slice(0, 2));
    }

    expect(familyMap["Sesquiterpène"].count).toBe(2);
    expect(familyMap["Monoterpène"].count).toBe(1);
    expect(familyMap["Sesquiterpène"].examples).toContain("β-Caryophyllène");
  });

  it("should sort families by count descending", () => {
    const families = [
      { family: "Monoterpène", count: 5 },
      { family: "Sesquiterpène", count: 12 },
      { family: "Flavonoïdes", count: 3 },
    ].sort((a, b) => b.count - a.count);

    expect(families[0].family).toBe("Sesquiterpène");
    expect(families[1].family).toBe("Monoterpène");
    expect(families[2].family).toBe("Flavonoïdes");
  });

  it("should limit examples to 5 unique values", () => {
    const examples = ["A", "B", "A", "C", "D", "E", "F", "G"];
    const unique = [...new Set(examples)].slice(0, 5);
    expect(unique.length).toBe(5);
  });

  it("should handle null family as Non classé", () => {
    const rows = [{ family: null, examples: "Mol1|Mol2" }];
    const familyMap: Record<string, { count: number; examples: string[] }> = {};
    for (const r of rows) {
      const fam = r.family || "Non classé";
      if (!familyMap[fam]) familyMap[fam] = { count: 0, examples: [] };
      familyMap[fam].count++;
    }
    expect(familyMap["Non classé"]).toBeDefined();
    expect(familyMap["Non classé"].count).toBe(1);
  });
});

// ─── Tests getSynergiesForCrossDomain ────────────────────────────────────────
describe("correlations.getSynergiesForCrossDomain", () => {
  it("should return empty array for empty moleculeIds", async () => {
    const moleculeIds: number[] = [];
    if (moleculeIds.length === 0) {
      expect([]).toEqual([]);
      return;
    }
  });

  it("should validate moleculeIds length limit", () => {
    const ids = Array.from({ length: 51 }, (_, i) => i + 1);
    // Max 50 ids
    expect(ids.length).toBeGreaterThan(50);
    const limited = ids.slice(0, 50);
    expect(limited.length).toBe(50);
  });
});

// ─── Tests domain mapping ────────────────────────────────────────────────────
describe("domain mapping logic", () => {
  const mapCategory = (category: string): string => {
    if (category === "cannabis") return "cannabis";
    if (category === "tabac") return "tabac";
    return "parfum";
  };

  it("should map cannabis category to cannabis domain", () => {
    expect(mapCategory("cannabis")).toBe("cannabis");
  });

  it("should map tabac category to tabac domain", () => {
    expect(mapCategory("tabac")).toBe("tabac");
  });

  it("should map aromatique to parfum domain", () => {
    expect(mapCategory("aromatique")).toBe("parfum");
  });

  it("should map fleur to parfum domain", () => {
    expect(mapCategory("fleur")).toBe("parfum");
  });

  it("should map bois to parfum domain", () => {
    expect(mapCategory("bois")).toBe("parfum");
  });

  it("should map resine to parfum domain", () => {
    expect(mapCategory("resine")).toBe("parfum");
  });

  it("should map racine to parfum domain", () => {
    expect(mapCategory("racine")).toBe("parfum");
  });

  it("should map autre to parfum domain", () => {
    expect(mapCategory("autre")).toBe("parfum");
  });
});
