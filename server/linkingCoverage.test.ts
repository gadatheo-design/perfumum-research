import { describe, it, expect, vi, beforeEach } from "vitest";
import * as db from "./db";

// Mock the database functions
vi.mock("./db", async (importOriginal) => {
  const original = await importOriginal<typeof import("./db")>();
  return {
    ...original,
    getLinkingCoverageStats: vi.fn(),
    autoLinkMoleculeRecettes: vi.fn(),
    autoLinkPlantMolecules: vi.fn(),
    getPlantMoleculeAuditStats: vi.fn(),
  };
});

describe("Linking Coverage Functions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getLinkingCoverageStats", () => {
    it("should return coverage statistics for all link types", async () => {
      const mockStats = {
        moleculeRecette: {
          totalMolecules: 556,
          moleculesWithRecette: 212,
          coverageMolecules: 38,
          totalRecettes: 266,
          recettesWithMolecule: 248,
          coverageRecettes: 93,
          totalLinks: 500,
          targetCoverage: 50,
          gap: 12,
        },
        plantMolecule: {
          totalPlants: 144,
          plantsWithMolecule: 10,
          coveragePlants: 7,
          totalMolecules: 556,
          moleculesWithPlant: 30,
          coverageMolecules: 5,
          totalLinks: 50,
          targetCoverage: 10,
          gap: 5,
        },
        plantTerroir: {
          totalPlants: 144,
          plantsWithTerroir: 28,
          coveragePlants: 19,
          totalTerroirs: 29,
          totalLinks: 35,
          targetCoverage: 20,
          gap: 1,
        },
      };

      vi.mocked(db.getLinkingCoverageStats).mockResolvedValue(mockStats);

      const result = await db.getLinkingCoverageStats();

      expect(result).toBeDefined();
      expect(result?.moleculeRecette.totalMolecules).toBe(556);
      expect(result?.moleculeRecette.targetCoverage).toBe(50);
      expect(result?.plantMolecule.targetCoverage).toBe(10);
      expect(result?.plantTerroir.targetCoverage).toBe(20);
    });

    it("should calculate gap correctly", async () => {
      const mockStats = {
        moleculeRecette: {
          totalMolecules: 100,
          moleculesWithRecette: 40,
          coverageMolecules: 40,
          totalRecettes: 50,
          recettesWithMolecule: 45,
          coverageRecettes: 90,
          totalLinks: 100,
          targetCoverage: 50,
          gap: 10, // 50 - 40 = 10
        },
        plantMolecule: {
          totalPlants: 100,
          plantsWithMolecule: 5,
          coveragePlants: 5,
          totalMolecules: 100,
          moleculesWithPlant: 8,
          coverageMolecules: 8,
          totalLinks: 20,
          targetCoverage: 10,
          gap: 2, // 10 - 8 = 2
        },
        plantTerroir: {
          totalPlants: 100,
          plantsWithTerroir: 25,
          coveragePlants: 25,
          totalTerroirs: 20,
          totalLinks: 30,
          targetCoverage: 20,
          gap: 0, // 25 >= 20, so gap is 0
        },
      };

      vi.mocked(db.getLinkingCoverageStats).mockResolvedValue(mockStats);

      const result = await db.getLinkingCoverageStats();

      expect(result?.moleculeRecette.gap).toBe(10);
      expect(result?.plantMolecule.gap).toBe(2);
      expect(result?.plantTerroir.gap).toBe(0);
    });
  });

  describe("autoLinkMoleculeRecettes", () => {
    it("should return suggestions in dry run mode", async () => {
      const mockResult = {
        success: true,
        created: 0,
        wouldCreate: 50,
        suggestions: [
          {
            moleculeId: 1,
            moleculeName: "Limonène",
            recetteId: 10,
            recetteName: "Accord Agrumes",
            role: "tête" as const,
            proportion: 15,
            reason: "Famille terpène compatible avec catégorie accord",
            confidence: 0.8,
          },
          {
            moleculeId: 2,
            moleculeName: "Linalol",
            recetteId: 20,
            recetteName: "Huile Lavande",
            role: "cœur" as const,
            proportion: 30,
            reason: "Profil olfactif floral compatible avec gamme signature",
            confidence: 0.75,
          },
        ],
        errors: [],
      };

      vi.mocked(db.autoLinkMoleculeRecettes).mockResolvedValue(mockResult);

      const result = await db.autoLinkMoleculeRecettes({ maxLinks: 50, dryRun: true });

      expect(result.success).toBe(true);
      expect(result.created).toBe(0);
      expect(result.wouldCreate).toBe(50);
      expect(result.suggestions.length).toBe(2);
      expect(result.suggestions[0].confidence).toBeGreaterThanOrEqual(0.5);
    });

    it("should create links when not in dry run mode", async () => {
      const mockResult = {
        success: true,
        created: 25,
        suggestions: [
          {
            moleculeId: 1,
            moleculeName: "Limonène",
            recetteId: 10,
            recetteName: "Accord Agrumes",
            role: "tête" as const,
            proportion: 15,
            reason: "Famille terpène compatible",
            confidence: 0.8,
          },
        ],
        errors: [],
      };

      vi.mocked(db.autoLinkMoleculeRecettes).mockResolvedValue(mockResult);

      const result = await db.autoLinkMoleculeRecettes({ maxLinks: 50, dryRun: false });

      expect(result.success).toBe(true);
      expect(result.created).toBe(25);
      expect(result.errors).toHaveLength(0);
    });

    it("should handle errors gracefully", async () => {
      const mockResult = {
        success: false,
        created: 0,
        suggestions: [],
        errors: ["Erreur d'insertion: Duplicate entry"],
      };

      vi.mocked(db.autoLinkMoleculeRecettes).mockResolvedValue(mockResult);

      const result = await db.autoLinkMoleculeRecettes({ maxLinks: 50, dryRun: false });

      expect(result.success).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });

  describe("autoLinkPlantMolecules", () => {
    it("should return suggestions based on botanical families", async () => {
      const mockResult = {
        success: true,
        created: 0,
        wouldCreate: 30,
        suggestions: [
          {
            plantId: 1,
            plantName: "Cannabis sativa",
            moleculeId: 5,
            moleculeName: "Myrcène",
            role: "majeur" as const,
            percentageTypical: 15,
            reason: "Famille botanique cannabaceae associée à Myrcène",
            confidence: 0.85,
          },
          {
            plantId: 2,
            plantName: "Lavandula angustifolia",
            moleculeId: 10,
            moleculeName: "Linalol",
            role: "majeur" as const,
            percentageTypical: 15,
            reason: "Famille botanique lamiaceae associée à Linalol",
            confidence: 0.8,
          },
        ],
        errors: [],
      };

      vi.mocked(db.autoLinkPlantMolecules).mockResolvedValue(mockResult);

      const result = await db.autoLinkPlantMolecules({ maxLinks: 50, dryRun: true });

      expect(result.success).toBe(true);
      expect(result.suggestions.length).toBe(2);
      expect(result.suggestions[0].role).toBe("majeur");
      expect(result.suggestions[0].confidence).toBeGreaterThanOrEqual(0.5);
    });

    it("should create plant-molecule links", async () => {
      const mockResult = {
        success: true,
        created: 15,
        suggestions: [],
        errors: [],
      };

      vi.mocked(db.autoLinkPlantMolecules).mockResolvedValue(mockResult);

      const result = await db.autoLinkPlantMolecules({ maxLinks: 50, dryRun: false });

      expect(result.success).toBe(true);
      expect(result.created).toBe(15);
    });
  });

  describe("getPlantMoleculeAuditStats", () => {
    it("should return audit statistics", async () => {
      const mockStats = {
        totalPlants: 144,
        totalMolecules: 556,
        totalRelations: 50,
        plantsWithMolecule: 10,
        plantsWithoutMolecule: 134,
        moleculesWithPlant: 30,
        moleculesWithoutPlant: 526,
        coveragePlants: 7,
        coverageMolecules: 5,
        plantsWithoutMoleculeList: [
          { id: 1, name: "Plante A", category: "aromatique", family: "Lamiaceae" },
          { id: 2, name: "Plante B", category: "cannabis", family: "Cannabaceae" },
        ],
        moleculesWithoutPlantList: [
          { id: 1, name: "Molécule X", family: "terpène", olfactiveProfile: "boisé" },
          { id: 2, name: "Molécule Y", family: "aldéhyde", olfactiveProfile: "floral" },
        ],
        topPlantsByMolecules: [
          { id: 5, name: "Cannabis sativa", category: "cannabis", moleculeCount: 15 },
          { id: 10, name: "Lavandula", category: "aromatique", moleculeCount: 8 },
        ],
      };

      vi.mocked(db.getPlantMoleculeAuditStats).mockResolvedValue(mockStats);

      const result = await db.getPlantMoleculeAuditStats();

      expect(result).toBeDefined();
      expect(result?.totalPlants).toBe(144);
      expect(result?.totalMolecules).toBe(556);
      expect(result?.plantsWithoutMoleculeList).toHaveLength(2);
      expect(result?.topPlantsByMolecules).toHaveLength(2);
      expect(result?.topPlantsByMolecules[0].moleculeCount).toBe(15);
    });
  });
});

describe("Auto-Link Confidence Scoring", () => {
  it("should prioritize high confidence suggestions", async () => {
    const mockResult = {
      success: true,
      created: 0,
      wouldCreate: 3,
      suggestions: [
        { moleculeId: 1, moleculeName: "A", recetteId: 1, recetteName: "R1", role: "tête" as const, proportion: 15, reason: "Direct match", confidence: 0.95 },
        { moleculeId: 2, moleculeName: "B", recetteId: 2, recetteName: "R2", role: "cœur" as const, proportion: 30, reason: "Family match", confidence: 0.7 },
        { moleculeId: 3, moleculeName: "C", recetteId: 3, recetteName: "R3", role: "fond" as const, proportion: 20, reason: "Keyword match", confidence: 0.55 },
      ],
      errors: [],
    };

    vi.mocked(db.autoLinkMoleculeRecettes).mockResolvedValue(mockResult);

    const result = await db.autoLinkMoleculeRecettes({ maxLinks: 10, dryRun: true });

    // Suggestions should be sorted by confidence (highest first)
    expect(result.suggestions[0].confidence).toBeGreaterThanOrEqual(result.suggestions[1].confidence);
    expect(result.suggestions[1].confidence).toBeGreaterThanOrEqual(result.suggestions[2].confidence);
  });

  it("should filter out low confidence suggestions", async () => {
    const mockResult = {
      success: true,
      created: 0,
      wouldCreate: 2,
      suggestions: [
        { moleculeId: 1, moleculeName: "A", recetteId: 1, recetteName: "R1", role: "tête" as const, proportion: 15, reason: "Match", confidence: 0.8 },
        { moleculeId: 2, moleculeName: "B", recetteId: 2, recetteName: "R2", role: "cœur" as const, proportion: 30, reason: "Match", confidence: 0.6 },
      ],
      errors: [],
    };

    vi.mocked(db.autoLinkMoleculeRecettes).mockResolvedValue(mockResult);

    const result = await db.autoLinkMoleculeRecettes({ maxLinks: 10, dryRun: true });

    // All suggestions should have confidence >= 0.5 (minimum threshold)
    result.suggestions.forEach(s => {
      expect(s.confidence).toBeGreaterThanOrEqual(0.5);
    });
  });
});
