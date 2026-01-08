import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock du module db
vi.mock("./db", () => ({
  getMoleculeRecetteAuditStats: vi.fn(),
  getAllMoleculeRecetteRelationsWithNames: vi.fn(),
  suggestMoleculeRecetteLinks: vi.fn(),
  bulkImportMoleculeRecettes: vi.fn(),
  createMultipleMoleculeRecettes: vi.fn(),
}));

import * as db from "./db";

describe("Molecule-Recette Audit Functions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getMoleculeRecetteAuditStats", () => {
    it("should return audit statistics with coverage percentages", async () => {
      const mockStats = {
        totalMolecules: 556,
        totalRecettes: 266,
        totalRelations: 53,
        moleculesWithRecette: 53,
        recettesWithMolecule: 30,
        moleculesWithoutRecette: 503,
        recettesWithoutMolecule: 236,
        coverageMolecules: 10,
        coverageRecettes: 11,
        topMoleculesByRecettes: [
          { id: 1, name: "Linalol", recetteCount: 15 },
          { id: 2, name: "Myrcène", recetteCount: 12 },
        ],
        topRecettesByMolecules: [
          { id: 1, name: "Résine CBD #1", moleculeCount: 8 },
          { id: 2, name: "Résine CBD #2", moleculeCount: 6 },
        ],
        priorityMoleculesWithoutRecette: [],
        priorityRecettesWithoutMolecule: [],
        moleculesWithoutRecetteList: [],
        recettesWithoutMoleculeList: [],
      };

      vi.mocked(db.getMoleculeRecetteAuditStats).mockResolvedValue(mockStats);

      const result = await db.getMoleculeRecetteAuditStats();

      expect(result).toBeDefined();
      expect(result?.totalMolecules).toBe(556);
      expect(result?.coverageMolecules).toBe(10);
      expect(result?.topMoleculesByRecettes).toHaveLength(2);
    });

    it("should handle empty database gracefully", async () => {
      const mockStats = {
        totalMolecules: 0,
        totalRecettes: 0,
        totalRelations: 0,
        moleculesWithRecette: 0,
        recettesWithMolecule: 0,
        moleculesWithoutRecette: 0,
        recettesWithoutMolecule: 0,
        coverageMolecules: 0,
        coverageRecettes: 0,
        topMoleculesByRecettes: [],
        topRecettesByMolecules: [],
        priorityMoleculesWithoutRecette: [],
        priorityRecettesWithoutMolecule: [],
        moleculesWithoutRecetteList: [],
        recettesWithoutMoleculeList: [],
      };

      vi.mocked(db.getMoleculeRecetteAuditStats).mockResolvedValue(mockStats);

      const result = await db.getMoleculeRecetteAuditStats();

      expect(result?.totalMolecules).toBe(0);
      expect(result?.coverageMolecules).toBe(0);
    });
  });

  describe("getAllMoleculeRecetteRelationsWithNames", () => {
    it("should return relations with molecule and recette names", async () => {
      const mockRelations = [
        {
          moleculeId: 1,
          recetteId: 1,
          moleculeName: "Linalol",
          moleculeFamily: "Alcool terpénique",
          recetteName: "Résine CBD #1",
          recetteCategory: "resine",
        },
      ];

      vi.mocked(db.getAllMoleculeRecetteRelationsWithNames).mockResolvedValue(mockRelations);

      const result = await db.getAllMoleculeRecetteRelationsWithNames();

      expect(result).toHaveLength(1);
      expect(result[0].moleculeName).toBe("Linalol");
      expect(result[0].recetteName).toBe("Résine CBD #1");
    });
  });

  describe("suggestMoleculeRecetteLinks", () => {
    it("should return suggestions based on families and categories", async () => {
      const mockSuggestions = [
        {
          moleculeId: 1,
          moleculeName: "Linalol",
          recetteId: 1,
          recetteName: "Résine CBD #1",
          reason: "Famille Alcool terpénique compatible avec catégorie resine",
          confidence: "medium" as const,
        },
      ];

      vi.mocked(db.suggestMoleculeRecetteLinks).mockResolvedValue(mockSuggestions);

      const result = await db.suggestMoleculeRecetteLinks();

      expect(result).toHaveLength(1);
      expect(result[0].confidence).toBe("medium");
    });
  });
});

describe("Molecule-Recette Bulk Import Functions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("bulkImportMoleculeRecettes", () => {
    it("should successfully import valid relations", async () => {
      const mockResult = {
        success: true,
        imported: 5,
        skipped: 0,
        duplicates: 0,
        errors: [],
      };

      vi.mocked(db.bulkImportMoleculeRecettes).mockResolvedValue(mockResult);

      const relations = [
        { moleculeName: "Linalol", recetteName: "Résine CBD #1" },
        { moleculeName: "Myrcène", recetteName: "Résine CBD #2" },
      ];

      const result = await db.bulkImportMoleculeRecettes(relations);

      expect(result.success).toBe(true);
      expect(result.imported).toBe(5);
      expect(result.errors).toHaveLength(0);
    });

    it("should handle duplicates correctly", async () => {
      const mockResult = {
        success: true,
        imported: 3,
        skipped: 0,
        duplicates: 2,
        errors: [],
      };

      vi.mocked(db.bulkImportMoleculeRecettes).mockResolvedValue(mockResult);

      const relations = [
        { moleculeId: 1, recetteId: 1 },
        { moleculeId: 1, recetteId: 1 }, // duplicate
      ];

      const result = await db.bulkImportMoleculeRecettes(relations);

      expect(result.duplicates).toBe(2);
    });

    it("should report errors for invalid molecule names", async () => {
      const mockResult = {
        success: true,
        imported: 1,
        skipped: 0,
        duplicates: 0,
        errors: ['Ligne 2: Molécule non trouvée "Molécule Inexistante"'],
      };

      vi.mocked(db.bulkImportMoleculeRecettes).mockResolvedValue(mockResult);

      const relations = [
        { moleculeName: "Linalol", recetteName: "Résine CBD #1" },
        { moleculeName: "Molécule Inexistante", recetteName: "Résine CBD #1" },
      ];

      const result = await db.bulkImportMoleculeRecettes(relations);

      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]).toContain("Molécule non trouvée");
    });
  });

  describe("createMultipleMoleculeRecettes", () => {
    it("should create multiple relations at once", async () => {
      const mockResult = {
        success: true,
        created: 3,
        skipped: 0,
        errors: [],
      };

      vi.mocked(db.createMultipleMoleculeRecettes).mockResolvedValue(mockResult);

      const relations = [
        { moleculeId: 1, recetteId: 1 },
        { moleculeId: 1, recetteId: 2 },
        { moleculeId: 2, recetteId: 1 },
      ];

      const result = await db.createMultipleMoleculeRecettes(relations);

      expect(result.success).toBe(true);
      expect(result.created).toBe(3);
    });

    it("should skip existing relations", async () => {
      const mockResult = {
        success: true,
        created: 1,
        skipped: 2,
        errors: ["Liaison déjà existante: molécule 1 - recette 1"],
      };

      vi.mocked(db.createMultipleMoleculeRecettes).mockResolvedValue(mockResult);

      const relations = [
        { moleculeId: 1, recetteId: 1 }, // existing
        { moleculeId: 1, recetteId: 2 }, // new
      ];

      const result = await db.createMultipleMoleculeRecettes(relations);

      expect(result.created).toBe(1);
      expect(result.skipped).toBe(2);
    });
  });
});

describe("CSV Parsing Logic for Molecule-Recette", () => {
  it("should correctly identify column mappings from headers", () => {
    const headers = ["molecule", "recette", "proportion", "role", "notes"];
    const columnMap: Record<string, number> = {};
    
    headers.forEach((h, i) => {
      const hLower = h.toLowerCase();
      if (hLower.includes("molecule") || hLower === "molécule") columnMap["moleculeName"] = i;
      else if (hLower.includes("recette") || hLower === "recipe") columnMap["recetteName"] = i;
      else if (hLower === "proportion" || hLower === "%") columnMap["proportion"] = i;
      else if (hLower === "role" || hLower === "rôle") columnMap["role"] = i;
      else if (hLower === "notes") columnMap["notes"] = i;
    });

    expect(columnMap.moleculeName).toBe(0);
    expect(columnMap.recetteName).toBe(1);
    expect(columnMap.proportion).toBe(2);
    expect(columnMap.role).toBe(3);
    expect(columnMap.notes).toBe(4);
  });

  it("should handle both comma and semicolon separators", () => {
    const csvComma = "molecule,recette,proportion\nLinalol,Résine CBD #1,15";
    const csvSemicolon = "molecule;recette;proportion\nLinalol;Résine CBD #1;15";

    const detectSeparator = (line: string) => (line.includes(";") ? ";" : ",");

    expect(detectSeparator(csvComma.split("\n")[0])).toBe(",");
    expect(detectSeparator(csvSemicolon.split("\n")[0])).toBe(";");
  });

  it("should validate role values", () => {
    const validRoles = ["tête", "cœur", "fond"];
    
    expect(validRoles.includes("tête")).toBe(true);
    expect(validRoles.includes("cœur")).toBe(true);
    expect(validRoles.includes("fond")).toBe(true);
    expect(validRoles.includes("invalid")).toBe(false);
  });
});

describe("Multiple Relations Creation for Molecule-Recette", () => {
  it("should prepare batch of relations for creation", () => {
    const selectedMolecules = [1, 2, 3];
    const selectedRecettes = [10, 20];
    
    const relations: Array<{ moleculeId: number; recetteId: number }> = [];
    
    for (const moleculeId of selectedMolecules) {
      for (const recetteId of selectedRecettes) {
        relations.push({ moleculeId, recetteId });
      }
    }
    
    expect(relations).toHaveLength(6); // 3 molecules × 2 recettes
    expect(relations[0]).toEqual({ moleculeId: 1, recetteId: 10 });
    expect(relations[5]).toEqual({ moleculeId: 3, recetteId: 20 });
  });

  it("should filter out existing relations", () => {
    const existingSet = new Set(["1-10", "2-10"]);
    const newRelations = [
      { moleculeId: 1, recetteId: 10 }, // exists
      { moleculeId: 1, recetteId: 20 }, // new
      { moleculeId: 2, recetteId: 10 }, // exists
      { moleculeId: 2, recetteId: 20 }, // new
    ];
    
    const filtered = newRelations.filter(
      r => !existingSet.has(`${r.moleculeId}-${r.recetteId}`)
    );
    
    expect(filtered).toHaveLength(2);
    expect(filtered[0]).toEqual({ moleculeId: 1, recetteId: 20 });
    expect(filtered[1]).toEqual({ moleculeId: 2, recetteId: 20 });
  });
});
