import { describe, it, expect, vi, beforeEach } from "vitest";
import * as db from "./db";

describe("getRecetteWithRelations", () => {
  it("should return recette with molecules including proportion and role", async () => {
    // Get a recette that has molecules linked
    const result = await db.getRecetteWithRelations(1);
    
    // If recette exists, check structure
    if (result) {
      expect(result).toHaveProperty("recette");
      expect(result).toHaveProperty("molecules");
      expect(result).toHaveProperty("family");
      expect(result).toHaveProperty("accord");
      
      // Check recette has required fields
      expect(result.recette).toHaveProperty("id");
      expect(result.recette).toHaveProperty("name");
      
      // Check molecules array structure if not empty
      if (result.molecules.length > 0) {
        const molecule = result.molecules[0];
        expect(molecule).toHaveProperty("id");
        expect(molecule).toHaveProperty("name");
        expect(molecule).toHaveProperty("chemicalFormula");
        // New fields for proportion and role
        expect(molecule).toHaveProperty("proportion");
        expect(molecule).toHaveProperty("role");
        expect(molecule).toHaveProperty("linkNotes");
        // Radar data
        expect(molecule).toHaveProperty("radarIntensity");
        expect(molecule).toHaveProperty("radarFreshness");
        // Additional fields
        expect(molecule).toHaveProperty("olfactiveProfile");
        expect(molecule).toHaveProperty("chemicalClass");
      }
    }
  });

  it("should return null for non-existent recette", async () => {
    const result = await db.getRecetteWithRelations(999999);
    expect(result).toBeNull();
  });

  it("should order molecules by proportion descending", async () => {
    // Find a recette with multiple molecules
    const result = await db.getRecetteWithRelations(1);
    
    if (result && result.molecules.length > 1) {
      // Check that molecules are ordered by proportion (descending)
      for (let i = 0; i < result.molecules.length - 1; i++) {
        const current = Number(result.molecules[i].proportion) || 0;
        const next = Number(result.molecules[i + 1].proportion) || 0;
        // Allow equal values but not ascending order
        expect(current).toBeGreaterThanOrEqual(next);
      }
    }
  });
});

describe("Terroirs and Plants", () => {
  it("should have terroirs linked to plants", async () => {
    const terroirs = await db.getAllTerroirs();
    expect(terroirs).toBeDefined();
    expect(Array.isArray(terroirs)).toBe(true);
    expect(terroirs.length).toBeGreaterThan(0);
    
    // Check that Hindu Kush terroir exists
    const hinduKush = terroirs.find((t: any) => t.name?.includes("Hindu Kush"));
    expect(hinduKush).toBeDefined();
  });

  it("should have plants in the database", async () => {
    // Vérifier qu'il y a des plantes
    const plants = await db.getAllPlants();
    expect(plants).toBeDefined();
    expect(Array.isArray(plants)).toBe(true);
    expect(plants.length).toBeGreaterThan(100); // Au moins 100 plantes
  });
});

describe("Molecules and Recettes", () => {
  it("should have molecules linked to recettes", async () => {
    const stats = await db.getDashboardStats();
    expect(stats).toBeDefined();
    
    // Check that we have molecule-recette relationships
    if (stats.moleculesRecettes) {
      expect(stats.moleculesRecettes).toBeGreaterThan(0);
    }
  });

  it("should have Geosmine and Indole molecules", async () => {
    const molecules = await db.getAllMolecules();
    expect(molecules).toBeDefined();
    
    const geosmine = molecules.find((m: any) => 
      m.name?.toLowerCase().includes("géosmine") || 
      m.name?.toLowerCase().includes("geosmine")
    );
    const indole = molecules.find((m: any) => 
      m.name?.toLowerCase().includes("indole")
    );
    
    expect(geosmine).toBeDefined();
    expect(indole).toBeDefined();
  });
});
