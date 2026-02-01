import { describe, it, expect } from "vitest";
import { 
  DUPLICATES_TO_MERGE, 
  MOLECULE_FORMULAS,
  analyzeDuplicates,
  mergeDuplicates,
  enrichWithFormulas
} from "./data-cleanup";

describe("Data Cleanup Service", () => {
  describe("DUPLICATES_TO_MERGE", () => {
    it("should have valid duplicate entries", () => {
      expect(DUPLICATES_TO_MERGE.length).toBeGreaterThan(0);
      
      DUPLICATES_TO_MERGE.forEach(dup => {
        expect(dup.keep).toBeTypeOf("number");
        expect(dup.remove).toBeInstanceOf(Array);
        expect(dup.remove.length).toBeGreaterThan(0);
        expect(dup.name).toBeTypeOf("string");
        expect(dup.name.length).toBeGreaterThan(0);
      });
    });
    
    it("should not have duplicate IDs to keep", () => {
      const keepIds = DUPLICATES_TO_MERGE.map(d => d.keep);
      const uniqueKeepIds = new Set(keepIds);
      expect(keepIds.length).toBe(uniqueKeepIds.size);
    });
    
    it("should not have overlapping remove IDs", () => {
      const allRemoveIds = DUPLICATES_TO_MERGE.flatMap(d => d.remove);
      const uniqueRemoveIds = new Set(allRemoveIds);
      expect(allRemoveIds.length).toBe(uniqueRemoveIds.size);
    });
    
    it("should not have keep IDs in remove lists", () => {
      const keepIds = new Set(DUPLICATES_TO_MERGE.map(d => d.keep));
      const allRemoveIds = DUPLICATES_TO_MERGE.flatMap(d => d.remove);
      
      allRemoveIds.forEach(removeId => {
        expect(keepIds.has(removeId)).toBe(false);
      });
    });
  });
  
  describe("MOLECULE_FORMULAS", () => {
    it("should have valid formula entries", () => {
      expect(Object.keys(MOLECULE_FORMULAS).length).toBeGreaterThan(50);
      
      Object.entries(MOLECULE_FORMULAS).forEach(([name, data]) => {
        expect(name.length).toBeGreaterThan(0);
        expect(data.formula).toBeTypeOf("string");
        expect(data.smiles).toBeTypeOf("string");
        expect(data.formula.length).toBeGreaterThan(0);
        expect(data.smiles.length).toBeGreaterThan(0);
      });
    });
    
    it("should have valid chemical formulas format", () => {
      const formulaRegex = /^[A-Z][a-z]?(\d+)?([A-Z][a-z]?(\d+)?)*$/;
      
      Object.entries(MOLECULE_FORMULAS).forEach(([name, data]) => {
        expect(data.formula).toMatch(formulaRegex);
      });
    });
    
    it("should have molecular weights when provided", () => {
      Object.entries(MOLECULE_FORMULAS).forEach(([name, data]) => {
        if (data.molecularWeight !== undefined) {
          expect(data.molecularWeight).toBeTypeOf("number");
          expect(data.molecularWeight).toBeGreaterThan(0);
        }
      });
    });
    
    it("should include common terpenes", () => {
      const terpenes = ["linalool", "limonene", "myrcene", "alpha-pinene"];
      terpenes.forEach(terpene => {
        expect(MOLECULE_FORMULAS[terpene]).toBeDefined();
      });
    });
    
    it("should include common aldehydes", () => {
      const aldehydes = ["citral", "benzaldehyde", "vanillin"];
      aldehydes.forEach(aldehyde => {
        expect(MOLECULE_FORMULAS[aldehyde]).toBeDefined();
      });
    });
    
    it("should include French and English variants", () => {
      // French variants
      expect(MOLECULE_FORMULAS["limonène"]).toBeDefined();
      expect(MOLECULE_FORMULAS["géraniol"]).toBeDefined();
      
      // English variants
      expect(MOLECULE_FORMULAS["limonene"]).toBeDefined();
      expect(MOLECULE_FORMULAS["geraniol"]).toBeDefined();
    });
  });
  
  describe("analyzeDuplicates", () => {
    it("should return analysis results", async () => {
      const result = await analyzeDuplicates();
      
      if (result && !("error" in result)) {
        expect(result.totalMolecules).toBeTypeOf("number");
        expect(result.duplicateGroups).toBeTypeOf("number");
        expect(result.totalDuplicates).toBeTypeOf("number");
        expect(result.duplicates).toBeInstanceOf(Array);
      }
    });
  });
  
  describe("mergeDuplicates (dry run)", () => {
    it("should return preview results without modifying data", async () => {
      const result = await mergeDuplicates(true);
      
      if (result && !("error" in result)) {
        expect(result.dryRun).toBe(true);
        expect(result.merged).toBeInstanceOf(Array);
        expect(result.errors).toBeInstanceOf(Array);
        expect(result.linksUpdated).toBeDefined();
      }
    });
  });
  
  describe("enrichWithFormulas (dry run)", () => {
    it("should return preview results without modifying data", async () => {
      const result = await enrichWithFormulas(true);
      
      if (result && !("error" in result)) {
        expect(result.dryRun).toBe(true);
        expect(result.updated).toBeInstanceOf(Array);
        expect(result.notFound).toBeInstanceOf(Array);
        expect(result.errors).toBeInstanceOf(Array);
        expect(result.totalWithoutFormula).toBeTypeOf("number");
      }
    });
  });
});
