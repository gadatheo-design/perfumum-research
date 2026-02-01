import { describe, it, expect } from "vitest";
import { 
  analyzeLinkCoverage,
  getMoleculesWithoutRecettes,
  getMoleculesWithoutPlants,
  getPlantsWithoutMolecules
} from "./link-analysis";

describe("Link Analysis Service", () => {
  describe("analyzeLinkCoverage", () => {
    it("should return complete analysis results", async () => {
      const result = await analyzeLinkCoverage();
      
      expect(result).not.toBeNull();
      if (result) {
        // Entities
        expect(result.entities).toBeDefined();
        expect(result.entities.molecules).toBeTypeOf("number");
        expect(result.entities.recettes).toBeTypeOf("number");
        expect(result.entities.plants).toBeTypeOf("number");
        expect(result.entities.terroirs).toBeTypeOf("number");
        
        // Links
        expect(result.links).toBeDefined();
        expect(result.links.moleculeRecette).toBeTypeOf("number");
        expect(result.links.plantMolecule).toBeTypeOf("number");
        
        // Coverage
        expect(result.coverage).toBeDefined();
        expect(result.coverage.moleculesWithRecettes).toBeTypeOf("number");
        expect(result.coverage.moleculesWithRecettesPercent).toBeTypeOf("number");
        expect(result.coverage.moleculesWithPlants).toBeTypeOf("number");
        expect(result.coverage.moleculesWithPlantsPercent).toBeTypeOf("number");
        expect(result.coverage.plantsWithMolecules).toBeTypeOf("number");
        expect(result.coverage.plantsWithMoleculesPercent).toBeTypeOf("number");
        
        // Gaps
        expect(result.gaps).toBeDefined();
        expect(result.gaps.moleculesWithoutRecettes).toBeTypeOf("number");
        expect(result.gaps.moleculesWithoutPlants).toBeTypeOf("number");
        expect(result.gaps.plantsWithoutMolecules).toBeTypeOf("number");
      }
    });
    
    it("should have consistent coverage percentages", async () => {
      const result = await analyzeLinkCoverage();
      
      if (result) {
        // Percentages should be between 0 and 100
        expect(result.coverage.moleculesWithRecettesPercent).toBeGreaterThanOrEqual(0);
        expect(result.coverage.moleculesWithRecettesPercent).toBeLessThanOrEqual(100);
        expect(result.coverage.moleculesWithPlantsPercent).toBeGreaterThanOrEqual(0);
        expect(result.coverage.moleculesWithPlantsPercent).toBeLessThanOrEqual(100);
        expect(result.coverage.plantsWithMoleculesPercent).toBeGreaterThanOrEqual(0);
        expect(result.coverage.plantsWithMoleculesPercent).toBeLessThanOrEqual(100);
      }
    });
    
    it("should have consistent gap calculations", async () => {
      const result = await analyzeLinkCoverage();
      
      if (result) {
        // Gaps should equal total minus covered
        expect(result.gaps.moleculesWithoutRecettes).toBe(
          result.entities.molecules - result.coverage.moleculesWithRecettes
        );
        expect(result.gaps.moleculesWithoutPlants).toBe(
          result.entities.molecules - result.coverage.moleculesWithPlants
        );
        expect(result.gaps.plantsWithoutMolecules).toBe(
          result.entities.plants - result.coverage.plantsWithMolecules
        );
      }
    });
  });
  
  describe("getMoleculesWithoutRecettes", () => {
    it("should return array of molecules", async () => {
      const result = await getMoleculesWithoutRecettes(10);
      
      expect(result).toBeInstanceOf(Array);
      if (result.length > 0) {
        expect(result[0]).toHaveProperty("id");
        expect(result[0]).toHaveProperty("name");
      }
    });
    
    it("should respect limit parameter", async () => {
      const result = await getMoleculesWithoutRecettes(5);
      expect(result.length).toBeLessThanOrEqual(5);
    });
  });
  
  describe("getMoleculesWithoutPlants", () => {
    it("should return array of molecules", async () => {
      const result = await getMoleculesWithoutPlants(10);
      
      expect(result).toBeInstanceOf(Array);
      if (result.length > 0) {
        expect(result[0]).toHaveProperty("id");
        expect(result[0]).toHaveProperty("name");
      }
    });
    
    it("should respect limit parameter", async () => {
      const result = await getMoleculesWithoutPlants(5);
      expect(result.length).toBeLessThanOrEqual(5);
    });
  });
  
  describe("getPlantsWithoutMolecules", () => {
    it("should return array of plants", async () => {
      const result = await getPlantsWithoutMolecules(10);
      
      expect(result).toBeInstanceOf(Array);
      if (result.length > 0) {
        expect(result[0]).toHaveProperty("id");
        expect(result[0]).toHaveProperty("name");
      }
    });
    
    it("should respect limit parameter", async () => {
      const result = await getPlantsWithoutMolecules(5);
      expect(result.length).toBeLessThanOrEqual(5);
    });
  });
});
