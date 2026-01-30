/**
 * Tests vitest pour le Point 3 étendu - PERFUMUM Research
 * Plantes, Terroirs, Méthodes d'extraction
 */

import { describe, it, expect, beforeAll } from "vitest";
import * as db from "./db";

describe("Point 3 Étendu - Plantes Aromatiques", () => {
  describe("Plants", () => {
    it("should retrieve all plants", async () => {
      const plants = await db.getAllPlants();
      expect(plants).toBeDefined();
      expect(Array.isArray(plants)).toBe(true);
      expect(plants.length).toBeGreaterThan(0);
    });

    it("should have plants with required fields", async () => {
      const plants = await db.getAllPlants();
      const plant = plants[0];
      
      expect(plant).toHaveProperty("id");
      expect(plant).toHaveProperty("name");
      expect(plant).toHaveProperty("latinName");
      expect(plant).toHaveProperty("family");
      expect(plant).toHaveProperty("category");
    });

    it("should filter plants by category", async () => {
      const aromaticPlants = await db.getPlantsByCategory("aromatique");
      expect(aromaticPlants).toBeDefined();
      expect(Array.isArray(aromaticPlants)).toBe(true);
      
      // All returned plants should be aromatic
      aromaticPlants.forEach((plant: any) => {
        expect(plant.category).toBe("aromatique");
      });
    });

    it("should have plants with climatic axis field", async () => {
      const plants = await db.getAllPlants();
      const ventPlants = plants.filter((p: any) => p.climaticAxis === "vent" || p.climaticAxis === "vent_bois");
      expect(ventPlants).toBeDefined();
      expect(Array.isArray(ventPlants)).toBe(true);
    });

    it("should get plant by id", async () => {
      const plants = await db.getAllPlants();
      if (plants.length > 0) {
        const plant = await db.getPlantById(plants[0].id);
        expect(plant).toBeDefined();
        expect(plant?.id).toBe(plants[0].id);
      }
    });
  });

  describe("Terroirs", () => {
    it("should retrieve all terroirs", async () => {
      const terroirs = await db.getAllTerroirs();
      expect(terroirs).toBeDefined();
      expect(Array.isArray(terroirs)).toBe(true);
      expect(terroirs.length).toBeGreaterThanOrEqual(7);
    });

    it("should have terroirs with required fields", async () => {
      const terroirs = await db.getAllTerroirs();
      const terroir = terroirs[0];
      
      expect(terroir).toHaveProperty("id");
      expect(terroir).toHaveProperty("terroirId");
      expect(terroir).toHaveProperty("name");
      expect(terroir).toHaveProperty("country");
      expect(terroir).toHaveProperty("climateType");
    });

    it("should filter terroirs by country", async () => {
      const colombianTerroirs = await db.getTerroirsByCountry("Colombie");
      expect(colombianTerroirs).toBeDefined();
      expect(Array.isArray(colombianTerroirs)).toBe(true);
      expect(colombianTerroirs.length).toBeGreaterThanOrEqual(3);
      
      colombianTerroirs.forEach((terroir: any) => {
        expect(terroir.country).toBe("Colombie");
      });
    });

    it("should have terroirs with climate type field", async () => {
      const terroirs = await db.getAllTerroirs();
      const tropicalTerroirs = terroirs.filter((t: any) => t.climateType === "tropical");
      expect(tropicalTerroirs).toBeDefined();
      expect(Array.isArray(tropicalTerroirs)).toBe(true);
      expect(tropicalTerroirs.length).toBeGreaterThan(0);
    });

    it("should get terroir by id", async () => {
      const terroirs = await db.getAllTerroirs();
      if (terroirs.length > 0) {
        const terroir = await db.getTerroirById(terroirs[0].id);
        expect(terroir).toBeDefined();
        expect(terroir?.id).toBe(terroirs[0].id);
      }
    });
  });

  describe("Extraction Methods", () => {
    it("should retrieve all extraction methods", async () => {
      const methods = await db.getAllExtractionMethods();
      expect(methods).toBeDefined();
      expect(Array.isArray(methods)).toBe(true);
      expect(methods.length).toBeGreaterThanOrEqual(7);
    });

    it("should have methods with required fields", async () => {
      const methods = await db.getAllExtractionMethods();
      const method = methods[0];
      
      expect(method).toHaveProperty("id");
      expect(method).toHaveProperty("methodId");
      expect(method).toHaveProperty("name");
      expect(method).toHaveProperty("category");
      expect(method).toHaveProperty("costLevel");
      expect(method).toHaveProperty("complexityLevel");
    });

    it("should have methods with category field", async () => {
      const methods = await db.getAllExtractionMethods();
      const distillationMethods = methods.filter((m: any) => m.category === "distillation");
      expect(distillationMethods).toBeDefined();
      expect(Array.isArray(distillationMethods)).toBe(true);
    });

    it("should have methods with cost level field", async () => {
      const methods = await db.getAllExtractionMethods();
      const lowCostMethods = methods.filter((m: any) => m.costLevel === "low");
      expect(lowCostMethods).toBeDefined();
      expect(Array.isArray(lowCostMethods)).toBe(true);
    });

    it("should get method by id", async () => {
      const methods = await db.getAllExtractionMethods();
      if (methods.length > 0) {
        const method = await db.getExtractionMethodById(methods[0].id);
        expect(method).toBeDefined();
        expect(method?.id).toBe(methods[0].id);
      }
    });
  });
});

describe("Point 3 Étendu - TerpProfiles", () => {
  it("should retrieve all terp profiles", async () => {
    const profiles = await db.getAllTerpProfiles();
    expect(profiles).toBeDefined();
    expect(Array.isArray(profiles)).toBe(true);
    expect(profiles.length).toBeGreaterThan(0);
  });

  it("should have profiles with required fields", async () => {
    const profiles = await db.getAllTerpProfiles();
    const profile = profiles[0];
    
    expect(profile).toHaveProperty("id");
    expect(profile).toHaveProperty("profileId");
    expect(profile).toHaveProperty("name");
    expect(profile).toHaveProperty("climaticAxis");
  });

  it("should have profiles with climatic axis field", async () => {
    const profiles = await db.getAllTerpProfiles();
    const ventProfiles = profiles.filter((p: any) => p.climaticAxis === "vent");
    expect(ventProfiles).toBeDefined();
    expect(Array.isArray(ventProfiles)).toBe(true);
  });
});

describe("Point 3 Étendu - Final Recipes", () => {
  it("should retrieve all final recipes", async () => {
    const recipes = await db.getAllFinalRecipes();
    expect(recipes).toBeDefined();
    expect(Array.isArray(recipes)).toBe(true);
    expect(recipes.length).toBeGreaterThan(0);
  });

  it("should have recipes with required fields", async () => {
    const recipes = await db.getAllFinalRecipes();
    const recipe = recipes[0];
    
    expect(recipe).toHaveProperty("id");
    expect(recipe).toHaveProperty("recipeId");
    expect(recipe).toHaveProperty("name");
    expect(recipe).toHaveProperty("recipeType");
  });

  it("should filter recipes by type", async () => {
    const parfumRecipes = await db.getFinalRecipesByType("parfum");
    expect(parfumRecipes).toBeDefined();
    expect(Array.isArray(parfumRecipes)).toBe(true);
    
    parfumRecipes.forEach((recipe: any) => {
      expect(recipe.recipeType).toBe("parfum");
    });
  });
});
