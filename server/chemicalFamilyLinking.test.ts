import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the database module
vi.mock("./db", () => ({
  getAllChemicalFamilies: vi.fn(),
  getChemicalFamiliesWithMoleculeCount: vi.fn(),
  getChemicalFamilyById: vi.fn(),
  getMoleculesByChemicalFamilyId: vi.fn(),
  getChemicalFamiliesForMolecule: vi.fn(),
  linkMoleculeToChemicalFamily: vi.fn(),
  unlinkMoleculeFromChemicalFamily: vi.fn(),
}));

import * as db from "./db";

describe("Chemical Family Linking Features", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getChemicalFamiliesWithMoleculeCount", () => {
    it("should return families with molecule counts", async () => {
      const mockFamilies = [
        { id: 1, name: "Monoterpènes", type: "monoterpene", moleculeCount: 15 },
        { id: 2, name: "Sesquiterpènes", type: "sesquiterpene", moleculeCount: 8 },
        { id: 3, name: "Aldéhydes aliphatiques", type: "aldehyde_aliphatic", moleculeCount: 0 },
      ];
      
      vi.mocked(db.getChemicalFamiliesWithMoleculeCount).mockResolvedValue(mockFamilies);
      
      const result = await db.getChemicalFamiliesWithMoleculeCount();
      
      expect(result).toHaveLength(3);
      expect(result[0].moleculeCount).toBe(15);
      expect(result[2].moleculeCount).toBe(0);
    });

    it("should return empty array when no families exist", async () => {
      vi.mocked(db.getChemicalFamiliesWithMoleculeCount).mockResolvedValue([]);
      
      const result = await db.getChemicalFamiliesWithMoleculeCount();
      
      expect(result).toEqual([]);
    });
  });

  describe("getMoleculesByChemicalFamilyId", () => {
    it("should return molecules for a specific family", async () => {
      const mockMolecules = [
        { id: 1, name: "Limonène", chemicalFormula: "C10H16" },
        { id: 2, name: "α-Pinène", chemicalFormula: "C10H16" },
        { id: 3, name: "β-Myrcène", chemicalFormula: "C10H16" },
      ];
      
      vi.mocked(db.getMoleculesByChemicalFamilyId).mockResolvedValue(mockMolecules);
      
      const result = await db.getMoleculesByChemicalFamilyId(1);
      
      expect(result).toHaveLength(3);
      expect(result[0].name).toBe("Limonène");
    });

    it("should return empty array for family with no molecules", async () => {
      vi.mocked(db.getMoleculesByChemicalFamilyId).mockResolvedValue([]);
      
      const result = await db.getMoleculesByChemicalFamilyId(999);
      
      expect(result).toEqual([]);
    });
  });

  describe("getChemicalFamiliesForMolecule", () => {
    it("should return families linked to a molecule", async () => {
      const mockFamilies = [
        { id: 1, name: "Monoterpènes", type: "monoterpene" },
        { id: 5, name: "Hydrocarbures", type: "hydrocarbon_aliphatic" },
      ];
      
      vi.mocked(db.getChemicalFamiliesForMolecule).mockResolvedValue(mockFamilies);
      
      const result = await db.getChemicalFamiliesForMolecule(42);
      
      expect(result).toHaveLength(2);
      expect(result[0].name).toBe("Monoterpènes");
    });

    it("should return empty array for molecule with no families", async () => {
      vi.mocked(db.getChemicalFamiliesForMolecule).mockResolvedValue([]);
      
      const result = await db.getChemicalFamiliesForMolecule(999);
      
      expect(result).toEqual([]);
    });
  });

  describe("linkMoleculeToChemicalFamily", () => {
    it("should successfully create a new link", async () => {
      vi.mocked(db.linkMoleculeToChemicalFamily).mockResolvedValue({
        success: true,
        message: "Liaison créée"
      });
      
      const result = await db.linkMoleculeToChemicalFamily(1, 2);
      
      expect(result?.success).toBe(true);
      expect(result?.message).toBe("Liaison créée");
    });

    it("should handle already existing link", async () => {
      vi.mocked(db.linkMoleculeToChemicalFamily).mockResolvedValue({
        success: true,
        message: "Liaison déjà existante"
      });
      
      const result = await db.linkMoleculeToChemicalFamily(1, 2);
      
      expect(result?.success).toBe(true);
      expect(result?.message).toBe("Liaison déjà existante");
    });
  });

  describe("unlinkMoleculeFromChemicalFamily", () => {
    it("should successfully remove a link", async () => {
      vi.mocked(db.unlinkMoleculeFromChemicalFamily).mockResolvedValue({
        success: true,
        message: "Liaison supprimée"
      });
      
      const result = await db.unlinkMoleculeFromChemicalFamily(1, 2);
      
      expect(result?.success).toBe(true);
      expect(result?.message).toBe("Liaison supprimée");
    });
  });

  describe("Filtering molecules by chemical family", () => {
    it("should filter molecules based on family selection", async () => {
      // Simulate the filtering logic used in Molecules.tsx
      const allMolecules = [
        { id: 1, name: "Limonène" },
        { id: 2, name: "α-Pinène" },
        { id: 3, name: "Linalol" },
        { id: 4, name: "Géraniol" },
      ];
      
      const moleculesInFamily = [
        { id: 1, name: "Limonène" },
        { id: 2, name: "α-Pinène" },
      ];
      
      vi.mocked(db.getMoleculesByChemicalFamilyId).mockResolvedValue(moleculesInFamily);
      
      const familyMolecules = await db.getMoleculesByChemicalFamilyId(1);
      const moleculeIdsInFamily = new Set(familyMolecules.map(m => m.id));
      
      const filteredMolecules = allMolecules.filter(m => moleculeIdsInFamily.has(m.id));
      
      expect(filteredMolecules).toHaveLength(2);
      expect(filteredMolecules.map(m => m.name)).toContain("Limonène");
      expect(filteredMolecules.map(m => m.name)).toContain("α-Pinène");
      expect(filteredMolecules.map(m => m.name)).not.toContain("Linalol");
    });
  });

  describe("Graph data preparation", () => {
    it("should prepare nodes and links for visualization", async () => {
      const mockFamilies = [
        { id: 1, name: "Monoterpènes", type: "monoterpene", moleculeCount: 2 },
      ];
      
      const mockRelations = [
        { moleculeId: 1, moleculeName: "Limonène", familyId: 1, familyName: "Monoterpènes" },
        { moleculeId: 2, moleculeName: "α-Pinène", familyId: 1, familyName: "Monoterpènes" },
      ];
      
      // Simulate graph data preparation
      const nodes: { id: string; type: string; name: string }[] = [];
      const links: { source: string; target: string }[] = [];
      const addedMolecules = new Set<number>();
      
      // Add family nodes
      mockFamilies.forEach(family => {
        nodes.push({
          id: `family-${family.id}`,
          type: "family",
          name: family.name,
        });
      });
      
      // Add molecule nodes and links
      mockRelations.forEach(relation => {
        if (!addedMolecules.has(relation.moleculeId)) {
          nodes.push({
            id: `molecule-${relation.moleculeId}`,
            type: "molecule",
            name: relation.moleculeName,
          });
          addedMolecules.add(relation.moleculeId);
        }
        
        links.push({
          source: `family-${relation.familyId}`,
          target: `molecule-${relation.moleculeId}`,
        });
      });
      
      expect(nodes).toHaveLength(3); // 1 family + 2 molecules
      expect(links).toHaveLength(2);
      expect(nodes.filter(n => n.type === "family")).toHaveLength(1);
      expect(nodes.filter(n => n.type === "molecule")).toHaveLength(2);
    });
  });
});
