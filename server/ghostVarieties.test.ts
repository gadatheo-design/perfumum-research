import { describe, it, expect, beforeAll } from "vitest";
import * as db from "./db";

describe("Ghost Varieties", () => {
  describe("getAllGhostVarieties", () => {
    it("should return an array of ghost varieties", async () => {
      const varieties = await db.getAllGhostVarieties();
      expect(Array.isArray(varieties)).toBe(true);
    });

    it("should return varieties with required fields", async () => {
      const varieties = await db.getAllGhostVarieties();
      if (varieties.length > 0) {
        const variety = varieties[0];
        expect(variety).toHaveProperty("id");
        expect(variety).toHaveProperty("name");
        expect(variety).toHaveProperty("varietyType");
        expect(variety).toHaveProperty("conservationStatus");
        expect(variety).toHaveProperty("createdAt");
      }
    });
  });

  describe("getGhostVarietiesStats", () => {
    it("should return statistics object", async () => {
      const stats = await db.getGhostVarietiesStats();
      expect(stats).toHaveProperty("total");
      expect(stats).toHaveProperty("byVarietyType");
      expect(stats).toHaveProperty("byConservationStatus");
      expect(typeof stats.total).toBe("number");
      expect(Array.isArray(stats.byVarietyType)).toBe(true);
      expect(Array.isArray(stats.byConservationStatus)).toBe(true);
    });

    it("should have correct structure for byVarietyType", async () => {
      const stats = await db.getGhostVarietiesStats();
      if (stats.byVarietyType.length > 0) {
        const item = stats.byVarietyType[0];
        expect(item).toHaveProperty("type");
        expect(item).toHaveProperty("count");
        expect(typeof item.count).toBe("number");
      }
    });

    it("should have correct structure for byConservationStatus", async () => {
      const stats = await db.getGhostVarietiesStats();
      if (stats.byConservationStatus.length > 0) {
        const item = stats.byConservationStatus[0];
        expect(item).toHaveProperty("status");
        expect(item).toHaveProperty("count");
        expect(typeof item.count).toBe("number");
      }
    });
  });

  describe("getGhostVarietyById", () => {
    it("should return null for non-existent id", async () => {
      const variety = await db.getGhostVarietyById(999999);
      expect(variety).toBeNull();
    });

    it("should return variety for existing id", async () => {
      const varieties = await db.getAllGhostVarieties();
      if (varieties.length > 0) {
        const variety = await db.getGhostVarietyById(varieties[0].id);
        expect(variety).not.toBeNull();
        expect(variety?.id).toBe(varieties[0].id);
      }
    });
  });

  describe("searchGhostVarieties", () => {
    it("should return empty array for non-matching query", async () => {
      const results = await db.searchGhostVarieties("xyznonexistent123");
      expect(Array.isArray(results)).toBe(true);
      expect(results.length).toBe(0);
    });

    it("should return matching varieties", async () => {
      const varieties = await db.getAllGhostVarieties();
      if (varieties.length > 0) {
        const searchTerm = varieties[0].name.substring(0, 5);
        const results = await db.searchGhostVarieties(searchTerm);
        expect(Array.isArray(results)).toBe(true);
        expect(results.length).toBeGreaterThan(0);
      }
    });
  });

  describe("getGhostVarietiesByType", () => {
    it("should return varieties filtered by type", async () => {
      const stats = await db.getGhostVarietiesStats();
      if (stats.byVarietyType.length > 0) {
        const type = stats.byVarietyType[0].type;
        const varieties = await db.getGhostVarietiesByType(type);
        expect(Array.isArray(varieties)).toBe(true);
        varieties.forEach(v => {
          expect(v.varietyType).toBe(type);
        });
      }
    });
  });

  describe("getGhostVarietiesByStatus", () => {
    it("should return varieties filtered by status", async () => {
      const stats = await db.getGhostVarietiesStats();
      if (stats.byConservationStatus.length > 0) {
        const status = stats.byConservationStatus[0].status;
        const varieties = await db.getGhostVarietiesByStatus(status);
        expect(Array.isArray(varieties)).toBe(true);
        varieties.forEach(v => {
          expect(v.conservationStatus).toBe(status);
        });
      }
    });
  });
});

describe("Genomic Links", () => {
  describe("getAllGenomicMoleculeLinks", () => {
    it("should return an array", async () => {
      const links = await db.getAllGenomicMoleculeLinks();
      expect(Array.isArray(links)).toBe(true);
    });
  });

  describe("getAllGenomicPlantLinks", () => {
    it("should return an array", async () => {
      const links = await db.getAllGenomicPlantLinks();
      expect(Array.isArray(links)).toBe(true);
    });
  });

  describe("getGenomicLinksStats", () => {
    it("should return statistics object", async () => {
      const stats = await db.getGenomicLinksStats();
      expect(stats).toHaveProperty("totalMoleculeLinks");
      expect(stats).toHaveProperty("totalPlantLinks");
      expect(stats).toHaveProperty("byAxis");
      expect(stats).toHaveProperty("byLinkType");
      expect(stats).toHaveProperty("byConfidence");
      expect(typeof stats.totalMoleculeLinks).toBe("number");
      expect(typeof stats.totalPlantLinks).toBe("number");
      expect(Array.isArray(stats.byAxis)).toBe(true);
      expect(Array.isArray(stats.byLinkType)).toBe(true);
      expect(Array.isArray(stats.byConfidence)).toBe(true);
    });
  });

  describe("getGenomicMoleculeLinksByAxis", () => {
    it("should return links for G1 axis", async () => {
      const links = await db.getGenomicMoleculeLinksByAxis("G1");
      expect(Array.isArray(links)).toBe(true);
      links.forEach(link => {
        expect(link.genomicAxis).toBe("G1");
      });
    });

    it("should return links for G2 axis", async () => {
      const links = await db.getGenomicMoleculeLinksByAxis("G2");
      expect(Array.isArray(links)).toBe(true);
      links.forEach(link => {
        expect(link.genomicAxis).toBe("G2");
      });
    });

    it("should return links for G3 axis", async () => {
      const links = await db.getGenomicMoleculeLinksByAxis("G3");
      expect(Array.isArray(links)).toBe(true);
      links.forEach(link => {
        expect(link.genomicAxis).toBe("G3");
      });
    });
  });

  describe("getGenomicPlantLinksByAxis", () => {
    it("should return links for G1 axis", async () => {
      const links = await db.getGenomicPlantLinksByAxis("G1");
      expect(Array.isArray(links)).toBe(true);
      links.forEach(link => {
        expect(link.genomicAxis).toBe("G1");
      });
    });
  });

  describe("getGenomicLinksForMolecule", () => {
    it("should return empty array for non-existent molecule", async () => {
      const links = await db.getGenomicLinksForMolecule(999999);
      expect(Array.isArray(links)).toBe(true);
      expect(links.length).toBe(0);
    });
  });

  describe("getGenomicLinksForPlant", () => {
    it("should return empty array for non-existent plant", async () => {
      const links = await db.getGenomicLinksForPlant(999999);
      expect(Array.isArray(links)).toBe(true);
      expect(links.length).toBe(0);
    });
  });
});
