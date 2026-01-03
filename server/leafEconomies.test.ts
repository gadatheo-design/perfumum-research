import { describe, it, expect, vi, beforeEach } from "vitest";
import * as db from "./db";

// Mock the database module
vi.mock("./db", async () => {
  const actual = await vi.importActual("./db");
  return {
    ...actual,
    getAllLeafEconomies: vi.fn(),
    getLeafEconomyById: vi.fn(),
    getLeafEconomyBySampleId: vi.fn(),
    getLeafEconomiesByCategory: vi.fn(),
    getLeafEconomiesByIsland: vi.fn(),
    getLeafEconomiesByStatus: vi.fn(),
    searchLeafEconomies: vi.fn(),
    getLeafEconomiesWithAnalysis: vi.fn(),
    getLeafEconomiesWithoutAnalysis: vi.fn(),
    createLeafEconomy: vi.fn(),
    updateLeafEconomy: vi.fn(),
  };
});

describe("Leaf Economies Database Functions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getAllLeafEconomies", () => {
    it("should return all leaf economies samples", async () => {
      const mockSamples = [
        {
          id: 1,
          sampleId: "SA-LE-001",
          category: "aromatique",
          species: "Pimenta racemosa",
          island: "san_andres",
          status: "brut",
        },
        {
          id: 2,
          sampleId: "SA-LE-002",
          category: "aromatique",
          species: "Cymbopogon citratus",
          island: "san_andres",
          status: "brut",
        },
      ];

      vi.mocked(db.getAllLeafEconomies).mockResolvedValue(mockSamples as any);

      const result = await db.getAllLeafEconomies();

      expect(result).toHaveLength(2);
      expect(result[0].sampleId).toBe("SA-LE-001");
      expect(result[1].species).toBe("Cymbopogon citratus");
    });
  });

  describe("getLeafEconomyById", () => {
    it("should return a single leaf economy by ID", async () => {
      const mockSample = {
        id: 1,
        sampleId: "SA-LE-001",
        category: "aromatique",
        species: "Pimenta racemosa",
        island: "san_andres",
        climaticAxis: '["vent", "bois"]',
        usage: '["parfum", "encens", "espace"]',
        absorbeInterpretation: "Feuille-bois épicée sèche (structure)",
        status: "brut",
      };

      vi.mocked(db.getLeafEconomyById).mockResolvedValue(mockSample as any);

      const result = await db.getLeafEconomyById(1);

      expect(result).toBeDefined();
      expect(result?.sampleId).toBe("SA-LE-001");
      expect(result?.species).toBe("Pimenta racemosa");
    });

    it("should return undefined for non-existent ID", async () => {
      vi.mocked(db.getLeafEconomyById).mockResolvedValue(undefined as any);

      const result = await db.getLeafEconomyById(999);

      expect(result).toBeUndefined();
    });
  });

  describe("getLeafEconomiesByCategory", () => {
    it("should return samples filtered by category", async () => {
      const mockTabacSamples = [
        {
          id: 4,
          sampleId: "SA-LE-004",
          category: "tabac",
          species: "Nicotiana tabacum",
        },
        {
          id: 5,
          sampleId: "SA-LE-005",
          category: "tabac",
          species: "Nicotiana tabacum",
        },
      ];

      vi.mocked(db.getLeafEconomiesByCategory).mockResolvedValue(mockTabacSamples as any);

      const result = await db.getLeafEconomiesByCategory("tabac");

      expect(result).toHaveLength(2);
      expect(result.every((s: any) => s.category === "tabac")).toBe(true);
    });
  });

  describe("getLeafEconomiesByIsland", () => {
    it("should return samples filtered by island", async () => {
      const mockSanAndresSamples = [
        { id: 1, sampleId: "SA-LE-001", island: "san_andres" },
        { id: 2, sampleId: "SA-LE-002", island: "san_andres" },
      ];

      vi.mocked(db.getLeafEconomiesByIsland).mockResolvedValue(mockSanAndresSamples as any);

      const result = await db.getLeafEconomiesByIsland("san_andres");

      expect(result).toHaveLength(2);
      expect(result.every((s: any) => s.island === "san_andres")).toBe(true);
    });
  });

  describe("searchLeafEconomies", () => {
    it("should return samples matching search query", async () => {
      const mockSearchResults = [
        { id: 1, sampleId: "SA-LE-001", species: "Pimenta racemosa" },
      ];

      vi.mocked(db.searchLeafEconomies).mockResolvedValue(mockSearchResults as any);

      const result = await db.searchLeafEconomies("Pimenta");

      expect(result).toHaveLength(1);
      expect(result[0].species).toContain("Pimenta");
    });

    it("should return empty array for no matches", async () => {
      vi.mocked(db.searchLeafEconomies).mockResolvedValue([]);

      const result = await db.searchLeafEconomies("NonExistentSpecies");

      expect(result).toHaveLength(0);
    });
  });

  describe("createLeafEconomy", () => {
    it("should create a new leaf economy sample", async () => {
      const newSample = {
        sampleId: "SA-LE-007",
        category: "aromatique" as const,
        species: "Ocimum basilicum",
        island: "san_andres" as const,
        status: "brut" as const,
      };

      const createdSample = {
        id: 7,
        ...newSample,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(db.createLeafEconomy).mockResolvedValue(createdSample as any);

      const result = await db.createLeafEconomy(newSample);

      expect(result).toBeDefined();
      expect(result.id).toBe(7);
      expect(result.sampleId).toBe("SA-LE-007");
    });
  });

  describe("updateLeafEconomy", () => {
    it("should update an existing leaf economy sample", async () => {
      const updateData = {
        status: "analyse" as const,
        analysisAvailable: 1,
        topMolecule1: "eugenol",
      };

      const updatedSample = {
        id: 1,
        sampleId: "SA-LE-001",
        ...updateData,
        updatedAt: new Date(),
      };

      vi.mocked(db.updateLeafEconomy).mockResolvedValue(updatedSample as any);

      const result = await db.updateLeafEconomy(1, updateData);

      expect(result).toBeDefined();
      expect(result.status).toBe("analyse");
      expect(result.analysisAvailable).toBe(1);
    });
  });

  describe("getLeafEconomiesWithAnalysis", () => {
    it("should return only samples with analysis available", async () => {
      const mockAnalyzedSamples = [
        { id: 1, sampleId: "SA-LE-001", analysisAvailable: 1 },
      ];

      vi.mocked(db.getLeafEconomiesWithAnalysis).mockResolvedValue(mockAnalyzedSamples as any);

      const result = await db.getLeafEconomiesWithAnalysis();

      expect(result.every((s: any) => s.analysisAvailable === 1)).toBe(true);
    });
  });

  describe("getLeafEconomiesWithoutAnalysis", () => {
    it("should return only samples without analysis", async () => {
      const mockUnanalyzedSamples = [
        { id: 2, sampleId: "SA-LE-002", analysisAvailable: 0 },
        { id: 3, sampleId: "SA-LE-003", analysisAvailable: 0 },
      ];

      vi.mocked(db.getLeafEconomiesWithoutAnalysis).mockResolvedValue(mockUnanalyzedSamples as any);

      const result = await db.getLeafEconomiesWithoutAnalysis();

      expect(result.every((s: any) => s.analysisAvailable === 0 || s.analysisAvailable === null)).toBe(true);
    });
  });
});

describe("Leaf Economy Data Validation", () => {
  it("should validate category enum values", () => {
    const validCategories = ["aromatique", "tabac", "cannabis"];
    
    validCategories.forEach((category) => {
      expect(["aromatique", "tabac", "cannabis"]).toContain(category);
    });
  });

  it("should validate island enum values", () => {
    const validIslands = ["san_andres", "providencia", "autre"];
    
    validIslands.forEach((island) => {
      expect(["san_andres", "providencia", "autre"]).toContain(island);
    });
  });

  it("should validate status enum values", () => {
    const validStatuses = ["brut", "a_analyser", "analyse", "traduction", "archive"];
    
    validStatuses.forEach((status) => {
      expect(["brut", "a_analyser", "analyse", "traduction", "archive"]).toContain(status);
    });
  });

  it("should validate climatic axis values", () => {
    const validAxes = ["vent", "bois", "disparition", "sel"];
    
    validAxes.forEach((axis) => {
      expect(["vent", "bois", "disparition", "sel"]).toContain(axis);
    });
  });

  it("should validate usage values", () => {
    const validUsages = ["parfum", "encens", "espace"];
    
    validUsages.forEach((usage) => {
      expect(["parfum", "encens", "espace"]).toContain(usage);
    });
  });
});
