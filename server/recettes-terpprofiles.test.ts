import { describe, it, expect } from "vitest";
import * as db from "./db";

describe("Recettes TL / TerpProfiles Liaison Functions", () => {
  describe("getTerpProfilesForRecette", () => {
    it("should be a function", () => {
      expect(typeof db.getTerpProfilesForRecette).toBe("function");
    });

    it("should return an array", async () => {
      const result = await db.getTerpProfilesForRecette(1);
      expect(Array.isArray(result)).toBe(true);
    });

    it("should return empty array for non-existent recette", async () => {
      const result = await db.getTerpProfilesForRecette(999999);
      expect(result).toEqual([]);
    });
  });

  describe("getRecettesForTerpProfile", () => {
    it("should be a function", () => {
      expect(typeof db.getRecettesForTerpProfile).toBe("function");
    });

    it("should return an array", async () => {
      const result = await db.getRecettesForTerpProfile(1);
      expect(Array.isArray(result)).toBe(true);
    });

    it("should return empty array for non-existent TerpProfile", async () => {
      const result = await db.getRecettesForTerpProfile(999999);
      expect(result).toEqual([]);
    });
  });

  describe("getTerpProfilesForTagetesLucida", () => {
    it("should be a function", () => {
      expect(typeof db.getTerpProfilesForTagetesLucida).toBe("function");
    });

    it("should return an array", async () => {
      const result = await db.getTerpProfilesForTagetesLucida();
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe("getRecettesTLWithTerpProfiles", () => {
    it("should be a function", () => {
      expect(typeof db.getRecettesTLWithTerpProfiles).toBe("function");
    });

    it("should return an array", async () => {
      const result = await db.getRecettesTLWithTerpProfiles();
      expect(Array.isArray(result)).toBe(true);
    });

    it("should return recettes with TL prefix in name", async () => {
      const result = await db.getRecettesTLWithTerpProfiles();
      // All returned recettes should have TL in their name
      result.forEach((recette: any) => {
        expect(recette.name).toMatch(/TL-/);
      });
    });

    it("should include terpProfiles property for each recette", async () => {
      const result = await db.getRecettesTLWithTerpProfiles();
      // Each recette should have a terpProfiles array
      result.forEach((recette: any) => {
        expect(recette).toHaveProperty("terpProfiles");
        expect(Array.isArray(recette.terpProfiles)).toBe(true);
      });
    });
  });
});

describe("Match Score Calculation", () => {
  it("getTerpProfilesForRecette should include matchScore when profiles are found", async () => {
    // Use a known recette ID that has molecules (TL-01 = 450001)
    const result = await db.getTerpProfilesForRecette(450001);
    if (result.length > 0) {
      result.forEach((profile: any) => {
        expect(profile).toHaveProperty("matchScore");
        expect(typeof profile.matchScore).toBe("number");
        expect(profile.matchScore).toBeGreaterThanOrEqual(0);
        expect(profile.matchScore).toBeLessThanOrEqual(100);
      });
    }
  });

  it("getRecettesForTerpProfile should include matchScore when recettes are found", async () => {
    // Use a known TerpProfile ID
    const result = await db.getRecettesForTerpProfile(1);
    if (result.length > 0) {
      result.forEach((recette: any) => {
        expect(recette).toHaveProperty("matchScore");
        expect(typeof recette.matchScore).toBe("number");
        expect(recette.matchScore).toBeGreaterThanOrEqual(0);
        expect(recette.matchScore).toBeLessThanOrEqual(100);
      });
    }
  });
});
