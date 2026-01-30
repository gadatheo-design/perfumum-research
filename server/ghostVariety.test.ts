import { describe, it, expect } from "vitest";
import * as db from "./db";

describe("Ghost Variety Extended Operations", () => {
  describe("getMoleculesForGhostVarietyLinking", () => {
    it("should return list of molecules available for linking", async () => {
      const molecules = await db.getMoleculesForGhostVarietyLinking();
      
      expect(Array.isArray(molecules)).toBe(true);
      // Each molecule should have required fields
      if (molecules.length > 0) {
        expect(molecules[0]).toHaveProperty("id");
        expect(molecules[0]).toHaveProperty("name");
        expect(molecules[0]).toHaveProperty("casNumber");
        expect(molecules[0]).toHaveProperty("family");
      }
    });
  });

  describe("getPlantsForGhostVarietyLinking", () => {
    it("should return list of plants available for linking", async () => {
      const plants = await db.getPlantsForGhostVarietyLinking();
      
      expect(Array.isArray(plants)).toBe(true);
      // Each plant should have required fields
      if (plants.length > 0) {
        expect(plants[0]).toHaveProperty("id");
        expect(plants[0]).toHaveProperty("name");
        expect(plants[0]).toHaveProperty("latinName");
        expect(plants[0]).toHaveProperty("category");
      }
    });
  });

  describe("searchMoleculesForGhostVariety", () => {
    it("should search molecules by name", async () => {
      const results = await db.searchMoleculesForGhostVariety("linalol", 5);
      
      expect(Array.isArray(results)).toBe(true);
      // Results should be limited
      expect(results.length).toBeLessThanOrEqual(5);
    });

    it("should return empty array for non-matching query", async () => {
      const results = await db.searchMoleculesForGhostVariety("xyznonexistent123", 5);
      
      expect(Array.isArray(results)).toBe(true);
      expect(results.length).toBe(0);
    });
  });

  describe("searchPlantsForGhostVariety", () => {
    it("should search plants by name", async () => {
      const results = await db.searchPlantsForGhostVariety("rosa", 5);
      
      expect(Array.isArray(results)).toBe(true);
      expect(results.length).toBeLessThanOrEqual(5);
    });

    it("should return empty array for non-matching query", async () => {
      const results = await db.searchPlantsForGhostVariety("xyznonexistent123", 5);
      
      expect(Array.isArray(results)).toBe(true);
      expect(results.length).toBe(0);
    });
  });

  describe("getGhostVarietyWithRelations", () => {
    it("should return variety with linked molecules and plants", async () => {
      // First get an existing variety
      const varieties = await db.getAllGhostVarieties();
      
      if (varieties.length > 0) {
        const result = await db.getGhostVarietyWithRelations(varieties[0].id);
        
        expect(result).toHaveProperty("variety");
        expect(result).toHaveProperty("linkedMolecules");
        expect(result).toHaveProperty("linkedPlants");
        expect(Array.isArray(result.linkedMolecules)).toBe(true);
        expect(Array.isArray(result.linkedPlants)).toBe(true);
      }
    });

    it("should return null variety for non-existent id", async () => {
      const result = await db.getGhostVarietyWithRelations(999999);
      
      expect(result.variety).toBeNull();
      expect(result.linkedMolecules).toEqual([]);
      expect(result.linkedPlants).toEqual([]);
    });
  });

  describe("bulkCreateGenomicMoleculeLinks", () => {
    it("should handle empty links array", async () => {
      const result = await db.bulkCreateGenomicMoleculeLinks([]);
      
      expect(result).toHaveProperty("success");
      expect(result).toHaveProperty("failed");
      expect(result).toHaveProperty("errors");
      expect(result.success).toBe(0);
      expect(result.failed).toBe(0);
    });
  });

  describe("bulkCreateGenomicPlantLinks", () => {
    it("should handle empty links array", async () => {
      const result = await db.bulkCreateGenomicPlantLinks([]);
      
      expect(result).toHaveProperty("success");
      expect(result).toHaveProperty("failed");
      expect(result).toHaveProperty("errors");
      expect(result.success).toBe(0);
      expect(result.failed).toBe(0);
    });
  });
});
