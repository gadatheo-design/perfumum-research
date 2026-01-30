import { describe, it, expect } from "vitest";
import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import superjson from "superjson";
import type { AppRouter } from "./routers";

const BASE_URL = "http://localhost:3000";

const client = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: `${BASE_URL}/api/trpc`,
      transformer: superjson,
    }),
  ],
});

describe("Coverage Goal Features", () => {
  describe("linkingCoverage router", () => {
    it("should get linking coverage stats", async () => {
      const stats = await client.linkingCoverage.getStats.query();
      
      expect(stats).toBeDefined();
      // Check actual structure returned by the API
      expect(typeof stats).toBe("object");
      // The stats object should have coverage data (actual property names from db.ts)
      expect(stats).toHaveProperty("moleculeRecette");
      // moleculeRecette should have sub-properties
      expect(stats.moleculeRecette).toHaveProperty("totalMolecules");
      expect(stats.moleculeRecette).toHaveProperty("coverageMolecules");
    });

    it("should get plant molecule audit stats", async () => {
      const auditStats = await client.linkingCoverage.getPlantMoleculeAuditStats.query();
      
      expect(auditStats).toBeDefined();
      // Check actual structure returned by the API (from db.ts getPlantMoleculeAuditStats)
      expect(auditStats).toHaveProperty("totalPlants");
      expect(auditStats).toHaveProperty("totalMolecules");
      expect(auditStats).toHaveProperty("totalRelations");
      expect(auditStats).toHaveProperty("plantsWithMolecule");
      expect(auditStats).toHaveProperty("moleculesWithPlant");
      expect(auditStats).toHaveProperty("coveragePlants");
      expect(auditStats).toHaveProperty("coverageMolecules");
      
      // Verify types
      expect(typeof auditStats.totalPlants).toBe("number");
      expect(typeof auditStats.totalMolecules).toBe("number");
      expect(typeof auditStats.totalRelations).toBe("number");
    });
  });

  describe("contributor router", () => {
    it("should find molecule duplicates", async () => {
      const result = await client.contributor.findMoleculeDuplicates.query({
        name: "Linalol",
      });
      
      expect(result).toBeDefined();
      expect(result).toHaveProperty("exact");
      expect(result).toHaveProperty("similar");
      expect(Array.isArray(result.exact)).toBe(true);
      expect(Array.isArray(result.similar)).toBe(true);
    });

    it("should find plant duplicates", async () => {
      const result = await client.contributor.findPlantDuplicates.query({
        name: "Lavande",
      });
      
      expect(result).toBeDefined();
      expect(result).toHaveProperty("exact");
      expect(result).toHaveProperty("similar");
      expect(Array.isArray(result.exact)).toBe(true);
      expect(Array.isArray(result.similar)).toBe(true);
    });

    it("should search molecules for autocomplete", async () => {
      const result = await client.contributor.searchMolecules.query({
        query: "lin",
        limit: 5,
      });
      
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });

    it("should search plants for autocomplete", async () => {
      const result = await client.contributor.searchPlants.query({
        query: "lav",
        limit: 5,
      });
      
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });

    it("should get plant molecule stats", async () => {
      const stats = await client.contributor.getPlantMoleculeStats.query();
      
      expect(stats).toBeDefined();
      // Check actual structure returned by the API
      expect(stats).toHaveProperty("total");
      expect(typeof stats.total).toBe("number");
    });

    it("should get orphan plants", async () => {
      const orphans = await client.contributor.getOrphanPlants.query({ limit: 10 });
      
      expect(orphans).toBeDefined();
      expect(Array.isArray(orphans)).toBe(true);
    });

    it("should get orphan molecules", async () => {
      const orphans = await client.contributor.getOrphanMolecules.query({ limit: 10 });
      
      expect(orphans).toBeDefined();
      expect(Array.isArray(orphans)).toBe(true);
    });

    it("should check if link exists", async () => {
      const exists = await client.contributor.checkLinkExists.query({
        plantId: 1,
        moleculeId: 1,
      });
      
      expect(typeof exists).toBe("boolean");
    });
  });

  describe("molecules router", () => {
    it("should list all molecules", async () => {
      const molecules = await client.molecules.list.query();
      
      expect(molecules).toBeDefined();
      expect(Array.isArray(molecules)).toBe(true);
      
      if (molecules.length > 0) {
        expect(molecules[0]).toHaveProperty("id");
        expect(molecules[0]).toHaveProperty("name");
      }
    });
  });

  describe("plants router", () => {
    it("should list all plants", async () => {
      const plants = await client.plants.list.query();
      
      expect(plants).toBeDefined();
      expect(Array.isArray(plants)).toBe(true);
      
      if (plants.length > 0) {
        expect(plants[0]).toHaveProperty("id");
        expect(plants[0]).toHaveProperty("name");
      }
    });
  });
});

describe("CSV Validation Features", () => {
  describe("importMolecules mutation", () => {
    it("should require authentication for molecule import", async () => {
      // Test with empty array - should fail with auth error
      try {
        await client.importMolecules.mutate({
          molecules: [],
        });
        // If we get here, the test should fail
        expect(true).toBe(false);
      } catch (error: any) {
        // If it fails due to auth, that's expected for protected routes
        expect(error.message).toContain("login");
      }
    });
  });

  describe("importPlants mutation", () => {
    it("should require authentication for plant import", async () => {
      // Test with empty array - should fail with auth error
      try {
        await client.importPlants.mutate({
          plants: [],
        });
        // If we get here, the test should fail
        expect(true).toBe(false);
      } catch (error: any) {
        // If it fails due to auth, that's expected for protected routes
        expect(error.message).toContain("login");
      }
    });
  });
});
