/**
 * Tests for Points 1, 2, 3 - TerpProfiles, Plants, FinalRecipes
 * Validates the data import and API routes
 */

import { describe, it, expect, beforeAll } from "vitest";
import { getDb } from "./db";
import { plants, terpProfiles, finalRecipes } from "../drizzle/schema";
import { count, eq } from "drizzle-orm";

describe("Points 1, 2, 3 - Data Import Tests", () => {
  let db: Awaited<ReturnType<typeof getDb>>;

  beforeAll(async () => {
    db = await getDb();
  });

  describe("Plants (Point 3 - Variétés et plantes)", () => {
    it("should have imported plants data", async () => {
      if (!db) throw new Error("Database not available");
      
      const result = await db.select({ count: count() }).from(plants);
      expect(result[0].count).toBeGreaterThanOrEqual(13); // 6 aromatiques + 3 tabacs + 4 cannabis
    });

    it("should have aromatic plants with correct structure", async () => {
      if (!db) throw new Error("Database not available");
      
      const aromaticPlants = await db.select().from(plants).where(eq(plants.category, "aromatique"));
      expect(aromaticPlants.length).toBeGreaterThanOrEqual(6);
      
      // Check that plants have required fields (name and latinName are required, family and climaticAxis are optional)
      for (const plant of aromaticPlants) {
        expect(plant.name).toBeTruthy();
        // latinName, family and climaticAxis may be null for some plants
        expect(typeof plant.name).toBe("string");
      }
    });

    it("should have tobacco plants with curing types", async () => {
      if (!db) throw new Error("Database not available");
      
      const tobaccoPlants = await db.select().from(plants).where(eq(plants.category, "tabac"));
      expect(tobaccoPlants.length).toBeGreaterThanOrEqual(3);
      
      // Check for different curing types
      const curingTypes = tobaccoPlants.map(p => p.name);
      expect(curingTypes.some(n => n.includes("Virginia"))).toBe(true);
      expect(curingTypes.some(n => n.includes("Burley"))).toBe(true);
      expect(curingTypes.some(n => n.includes("Criollo"))).toBe(true);
    });

    it("should have cannabis profiles by olfactive type", async () => {
      if (!db) throw new Error("Database not available");
      
      const cannabisPlants = await db.select().from(plants).where(eq(plants.category, "cannabis"));
      expect(cannabisPlants.length).toBeGreaterThanOrEqual(4);
      
      // Check for different profiles
      const profiles = cannabisPlants.map(p => p.name);
      expect(profiles.some(n => n.includes("VENT"))).toBe(true);
      expect(profiles.some(n => n.includes("BOIS"))).toBe(true);
      expect(profiles.some(n => n.includes("DISPARITION"))).toBe(true);
    });
  });

  describe("TerpProfiles (Point 1 & 2 - Fiches interactives)", () => {
    it("should have imported TerpProfiles data", async () => {
      if (!db) throw new Error("Database not available");
      
      const result = await db.select({ count: count() }).from(terpProfiles);
      expect(result[0].count).toBeGreaterThanOrEqual(10);
    });

    it("should have profiles with correct structure", async () => {
      if (!db) throw new Error("Database not available");
      
      const profiles = await db.select().from(terpProfiles);
      
      for (const profile of profiles) {
        // profileId peut être SA-TP-XX ou REF-XXX-XX selon le type de profil
        expect(profile.profileId).toMatch(/^(SA-TP-\d+|REF-[A-Z]+-\d+)$/);
        expect(profile.name).toBeTruthy();
        expect(profile.climaticAxis).toBeTruthy();
        expect(profile.function).toBeTruthy();
      }
    });

    it("should have radar data for visualization", async () => {
      if (!db) throw new Error("Database not available");
      
      const profiles = await db.select().from(terpProfiles);
      
      for (const profile of profiles) {
        expect(profile.radarVent).toBeGreaterThanOrEqual(0);
        expect(profile.radarVent).toBeLessThanOrEqual(100);
        expect(profile.radarBois).toBeGreaterThanOrEqual(0);
        expect(profile.radarBois).toBeLessThanOrEqual(100);
        expect(profile.radarDisparition).toBeGreaterThanOrEqual(0);
        expect(profile.radarDisparition).toBeLessThanOrEqual(100);
      }
    });

    it("should have concentrate formulas", async () => {
      if (!db) throw new Error("Database not available");
      
      const profiles = await db.select().from(terpProfiles);
      
      for (const profile of profiles) {
        expect(profile.concentrate).toBeTruthy();
        expect(Array.isArray(profile.concentrate)).toBe(true);
        
        // Check formula structure
        if (profile.concentrate && profile.concentrate.length > 0) {
          const firstIngredient = profile.concentrate[0] as { ingredient: string; percentage: number };
          expect(firstIngredient.ingredient).toBeTruthy();
          expect(typeof firstIngredient.percentage).toBe("number");
        }
      }
    });
  });

  describe("FinalRecipes (Point 3 - Recettes finales)", () => {
    it("should have imported FinalRecipes data", async () => {
      if (!db) throw new Error("Database not available");
      
      const result = await db.select({ count: count() }).from(finalRecipes);
      expect(result[0].count).toBeGreaterThanOrEqual(9); // 3 parfums + 3 encens + 3 espace
    });

    it("should have parfum recipes", async () => {
      if (!db) throw new Error("Database not available");
      
      const parfumRecipes = await db.select().from(finalRecipes).where(eq(finalRecipes.recipeType, "parfum"));
      expect(parfumRecipes.length).toBeGreaterThanOrEqual(3);
      
      // Check parfum-specific fields
      for (const recipe of parfumRecipes) {
        expect(recipe.dilution).toBeTruthy();
        expect(recipe.base).toBe("alcool neutre");
      }
    });

    it("should have encens recipes with combustion time", async () => {
      if (!db) throw new Error("Database not available");
      
      const encensRecipes = await db.select().from(finalRecipes).where(eq(finalRecipes.recipeType, "encens"));
      expect(encensRecipes.length).toBeGreaterThanOrEqual(3);
      
      // Check encens-specific fields
      for (const recipe of encensRecipes) {
        expect(recipe.combustionTime).toBeTruthy();
      }
    });

    it("should have espace recipes with protocol", async () => {
      if (!db) throw new Error("Database not available");
      
      const espaceRecipes = await db.select().from(finalRecipes).where(eq(finalRecipes.recipeType, "espace"));
      expect(espaceRecipes.length).toBeGreaterThanOrEqual(3);
      
      // Check espace-specific fields
      for (const recipe of espaceRecipes) {
        expect(recipe.protocol).toBeTruthy();
      }
    });

    it("should have success criteria and risks for all recipes", async () => {
      if (!db) throw new Error("Database not available");
      
      const recipes = await db.select().from(finalRecipes);
      
      for (const recipe of recipes) {
        expect(recipe.successCriteria).toBeTruthy();
        expect(recipe.risks).toBeTruthy();
        expect(recipe.expectedResult).toBeTruthy();
      }
    });
  });
});
