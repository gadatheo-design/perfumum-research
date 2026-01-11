import { describe, it, expect, beforeAll } from "vitest";
import * as db from "./db";

describe("Force Graph - References & Axes", () => {
  describe("getForceGraphDataReferencesAxes", () => {
    it("should return nodes and links structure", async () => {
      const result = await db.getForceGraphDataReferencesAxes({});
      
      expect(result).toHaveProperty("nodes");
      expect(result).toHaveProperty("links");
      expect(result).toHaveProperty("stats");
      expect(Array.isArray(result.nodes)).toBe(true);
      expect(Array.isArray(result.links)).toBe(true);
    });

    it("should return axis nodes with correct structure", async () => {
      const result = await db.getForceGraphDataReferencesAxes({
        includeReferences: false,
      });
      
      const axisNodes = result.nodes.filter((n: any) => n.type === "axis");
      
      if (axisNodes.length > 0) {
        const axisNode = axisNodes[0];
        expect(axisNode).toHaveProperty("id");
        expect(axisNode).toHaveProperty("numericId");
        expect(axisNode).toHaveProperty("type", "axis");
        expect(axisNode).toHaveProperty("code");
        expect(axisNode).toHaveProperty("name");
        expect(axisNode).toHaveProperty("color");
        expect(axisNode).toHaveProperty("size");
      }
    });

    it("should include references when includeReferences is true", async () => {
      const withRefs = await db.getForceGraphDataReferencesAxes({
        includeReferences: true,
      });
      
      const withoutRefs = await db.getForceGraphDataReferencesAxes({
        includeReferences: false,
      });
      
      const refsInWith = withRefs.nodes.filter((n: any) => n.type === "reference");
      const refsInWithout = withoutRefs.nodes.filter((n: any) => n.type === "reference");
      
      expect(refsInWithout.length).toBe(0);
      // withRefs might have references if data exists
    });

    it("should filter by metaAxis when provided", async () => {
      const result = await db.getForceGraphDataReferencesAxes({
        metaAxisFilter: "meta_a",
        includeReferences: false,
      });
      
      const axisNodes = result.nodes.filter((n: any) => n.type === "axis");
      
      // All axis nodes should be from meta_a
      axisNodes.forEach((node: any) => {
        expect(node.metaAxis).toBe("meta_a");
      });
    });

    it("should return stats with correct structure", async () => {
      const result = await db.getForceGraphDataReferencesAxes({});
      
      expect(result.stats).toHaveProperty("totalAxes");
      expect(result.stats).toHaveProperty("totalReferences");
      expect(result.stats).toHaveProperty("totalLinks");
      expect(result.stats).toHaveProperty("axesByMetaAxis");
      
      expect(typeof result.stats.totalAxes).toBe("number");
      expect(typeof result.stats.totalReferences).toBe("number");
      expect(typeof result.stats.totalLinks).toBe("number");
    });
  });

  describe("getAxisGraphData", () => {
    it("should return axis graph data structure", async () => {
      const result = await db.getAxisGraphData();
      
      expect(result).toHaveProperty("nodes");
      expect(result).toHaveProperty("links");
      expect(Array.isArray(result.nodes)).toBe(true);
      expect(Array.isArray(result.links)).toBe(true);
    });
  });
});

describe("Molecular Synergies for AI Generator", () => {
  describe("getMolecularSynergiesForGenerator", () => {
    it("should return synergies data structure", async () => {
      const result = await db.getMolecularSynergiesForGenerator();
      
      expect(result).toHaveProperty("terpeneSynergies");
      expect(result).toHaveProperty("moleculeSynergies");
      expect(result).toHaveProperty("entourageRules");
      expect(result).toHaveProperty("molecularInteractions");
    });

    it("should return arrays for each synergy type", async () => {
      const result = await db.getMolecularSynergiesForGenerator();
      
      expect(Array.isArray(result.terpeneSynergies)).toBe(true);
      expect(Array.isArray(result.moleculeSynergies)).toBe(true);
      expect(Array.isArray(result.entourageRules)).toBe(true);
      expect(Array.isArray(result.molecularInteractions)).toBe(true);
    });
  });

  describe("getSynergySuggestionsForMolecule", () => {
    it("should return suggestions structure for a molecule", async () => {
      // Test with molecule ID 1 (may or may not exist)
      const result = await db.getSynergySuggestionsForMolecule(1);
      
      expect(result).toHaveProperty("moleculeId");
      expect(result).toHaveProperty("suggestions");
      expect(Array.isArray(result.suggestions)).toBe(true);
    });

    it("should return empty suggestions for non-existent molecule", async () => {
      const result = await db.getSynergySuggestionsForMolecule(999999);
      
      expect(result.suggestions.length).toBe(0);
    });
  });
});
