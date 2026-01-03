import { describe, it, expect, beforeAll, afterAll } from "vitest";
import * as db from "./db";

describe("Geographic Origins API", () => {
  let testOriginId: number | null = null;

  describe("getAllGeographicOrigins", () => {
    it("should return a list of geographic origins", async () => {
      const origins = await db.getAllGeographicOrigins();
      expect(Array.isArray(origins)).toBe(true);
      expect(origins.length).toBeGreaterThan(0);
    });

    it("should include required fields for each origin", async () => {
      const origins = await db.getAllGeographicOrigins();
      if (origins.length > 0) {
        const origin = origins[0];
        expect(origin).toHaveProperty("id");
        expect(origin).toHaveProperty("name");
        expect(origin).toHaveProperty("country");
      }
    });
  });

  describe("getGeographicOriginById", () => {
    it("should return a specific origin by ID", async () => {
      const origins = await db.getAllGeographicOrigins();
      if (origins.length > 0) {
        const origin = await db.getGeographicOriginById(origins[0].id);
        expect(origin).toBeDefined();
        expect(origin?.id).toBe(origins[0].id);
      }
    });

    it("should return null for non-existent ID", async () => {
      const origin = await db.getGeographicOriginById(999999);
      expect(origin).toBeNull();
    });
  });

  describe("getGeographicOriginsByCountry", () => {
    it("should return origins filtered by country", async () => {
      const origins = await db.getGeographicOriginsByCountry("France");
      expect(Array.isArray(origins)).toBe(true);
      origins.forEach((origin) => {
        expect(origin.country).toBe("France");
      });
    });

    it("should return empty array for non-existent country", async () => {
      const origins = await db.getGeographicOriginsByCountry("NonExistentCountry");
      expect(Array.isArray(origins)).toBe(true);
      expect(origins.length).toBe(0);
    });
  });

  describe("createGeographicOrigin", () => {
    it("should create a new geographic origin", async () => {
      const newOrigin = {
        name: "Test Origin",
        country: "Test Country",
        region: "Test Region",
        terroir: "Test terroir description",
        climate: "Test climate",
      };

      const created = await db.createGeographicOrigin(newOrigin);
      expect(created).toBeDefined();
      expect(created.name).toBe(newOrigin.name);
      expect(created.country).toBe(newOrigin.country);
      
      testOriginId = created.id;
    });
  });

  describe("updateGeographicOrigin", () => {
    it("should update an existing geographic origin", async () => {
      if (testOriginId) {
        const updateData = {
          terroir: "Updated terroir description",
          climate: "Updated climate",
        };

        await db.updateGeographicOrigin(testOriginId, updateData);
        const updated = await db.getGeographicOriginById(testOriginId);
        
        expect(updated?.terroir).toBe(updateData.terroir);
        expect(updated?.climate).toBe(updateData.climate);
      }
    });
  });

  describe("deleteGeographicOrigin", () => {
    it("should delete an existing geographic origin", async () => {
      if (testOriginId) {
        await db.deleteGeographicOrigin(testOriginId);
        const deleted = await db.getGeographicOriginById(testOriginId);
        expect(deleted).toBeNull();
      }
    });
  });
});

describe("IFRA Restrictions API", () => {
  describe("getAllIfraRestrictions", () => {
    it("should return a list of IFRA restrictions", async () => {
      const restrictions = await db.getAllIfraRestrictions();
      expect(Array.isArray(restrictions)).toBe(true);
    });
  });

  describe("getRestrictedMolecules", () => {
    it("should return molecules with IFRA restrictions", async () => {
      const restricted = await db.getRestrictedMolecules();
      expect(Array.isArray(restricted)).toBe(true);
    });
  });
});

describe("Molecule Scientific Data API", () => {
  describe("getMoleculesWithoutCas", () => {
    it("should return molecules without CAS numbers", async () => {
      const molecules = await db.getMoleculesWithoutCas();
      expect(Array.isArray(molecules)).toBe(true);
    });
  });

  describe("getMoleculesWithCas", () => {
    it("should return molecules with CAS numbers", async () => {
      const molecules = await db.getMoleculesWithCas();
      expect(Array.isArray(molecules)).toBe(true);
    });
  });
});
