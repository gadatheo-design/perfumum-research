import { describe, it, expect } from "vitest";

const API_URL = "http://localhost:3000/api/trpc";

describe("Genomics API", () => {
  describe("getTpsGenes", () => {
    it("should return TPS genes data", async () => {
      const response = await fetch(`${API_URL}/research.getTpsGenes?input=%7B%7D`);
      expect(response.ok).toBe(true);
      
      const data = await response.json();
      expect(data.result).toBeDefined();
      expect(data.result.data).toBeDefined();
      
      // Should return an array
      const genes = data.result.data.json;
      expect(Array.isArray(genes)).toBe(true);
      
      // Should have at least some genes
      expect(genes.length).toBeGreaterThan(0);
      
      // Check structure of first gene
      if (genes.length > 0) {
        const gene = genes[0];
        expect(gene).toHaveProperty("id");
        expect(gene).toHaveProperty("name");
        expect(gene).toHaveProperty("product_class");
      }
    });

    it("should filter TPS genes by product class", async () => {
      // tRPC with superjson requires the input to be wrapped in { json: ... }
      const input = encodeURIComponent(JSON.stringify({ json: { productClass: "monoterpene" } }));
      const response = await fetch(`${API_URL}/research.getTpsGenes?input=${input}`);
      expect(response.ok).toBe(true);
      
      const data = await response.json();
      const genes = data.result.data.json;
      
      // Should return some genes
      expect(genes.length).toBeGreaterThan(0);
      
      // All returned genes should be monoterpenes
      for (const gene of genes) {
        expect(gene.product_class).toBe("monoterpene");
      }
    });
  });

  describe("getBiosyntheticPathways", () => {
    it("should return biosynthetic pathways data", async () => {
      const response = await fetch(`${API_URL}/research.getBiosyntheticPathways`);
      expect(response.ok).toBe(true);
      
      const data = await response.json();
      expect(data.result).toBeDefined();
      expect(data.result.data).toBeDefined();
      
      // Should return an array
      const pathways = data.result.data.json;
      expect(Array.isArray(pathways)).toBe(true);
      
      // Should have MEP and MVA pathways
      expect(pathways.length).toBeGreaterThanOrEqual(2);
      
      // Check structure of first pathway
      if (pathways.length > 0) {
        const pathway = pathways[0];
        expect(pathway).toHaveProperty("id");
        expect(pathway).toHaveProperty("name");
        expect(pathway).toHaveProperty("location");
      }
    });
  });

  describe("getGenomicStats", () => {
    it("should return genomic statistics", async () => {
      const response = await fetch(`${API_URL}/research.getGenomicStats`);
      expect(response.ok).toBe(true);
      
      const data = await response.json();
      expect(data.result).toBeDefined();
      expect(data.result.data).toBeDefined();
      
      const stats = data.result.data.json;
      expect(stats).toHaveProperty("totalTpsGenes");
      expect(stats).toHaveProperty("monoterpenes");
      expect(stats).toHaveProperty("sesquiterpenes");
      expect(stats).toHaveProperty("diterpenes");
      expect(stats).toHaveProperty("pathways");
      
      // Values should be numbers
      expect(typeof stats.totalTpsGenes).toBe("number");
      expect(typeof stats.pathways).toBe("number");
    });
  });
});
