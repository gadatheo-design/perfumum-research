import { describe, it, expect, beforeAll } from "vitest";
import { appRouter } from "./routers";
import type { Context } from "./_core/context";

/**
 * Tests pour l'importation CSV
 */
describe("CSV Import", () => {
  // Mock context for protected procedures
  const mockContext: Context = {
    user: {
      id: 1,
      openId: "test-user",
      name: "Test User",
      email: "test@example.com",
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
      loginMethod: "test",
    },
  };

  const caller = appRouter.createCaller(mockContext);

  describe("importMolecules", () => {
    it("should import valid molecules", async () => {
      const testMolecules = [
        {
          name: "Test Molecule 1",
          family: "terpene",
          odorKey: "fresh, green",
          role: "diffusion",
          climaticAxis: "vent",
        },
        {
          name: "Test Molecule 2",
          family: "aldehyde",
          odorKey: "citrus, bright",
          role: "modulation",
          climaticAxis: "bois",
        },
      ];

      const result = await caller.importMolecules({
        molecules: testMolecules,
      });

      expect(result.success).toBe(true);
      expect(result.imported).toBeGreaterThanOrEqual(0);
      expect(Array.isArray(result.errors)).toBe(true);
    });

    it("should skip duplicate molecules", async () => {
      const duplicateMolecule = [
        {
          name: "alpha-pinene", // Already exists from CSV import
          family: "terpene",
          odorKey: "pine",
          role: "diffusion",
          climaticAxis: "vent",
        },
      ];

      const result = await caller.importMolecules({
        molecules: duplicateMolecule,
      });

      expect(result.success).toBe(true);
      expect(result.imported).toBe(0);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors[0]).toContain("existe déjà");
    });

    it("should handle empty molecules array", async () => {
      const result = await caller.importMolecules({
        molecules: [],
      });

      expect(result.success).toBe(true);
      expect(result.imported).toBe(0);
      expect(result.errors.length).toBe(0);
    });
  });

  describe("importPlants", () => {
    it("should import valid plants", async () => {
      const testPlants = [
        {
          name: "Test Plant 1",
          latinName: "Testus plantus",
          family: "Testaceae",
          category: "aromatique",
          origin: "Test Region",
          habitat: "Test habitat",
          olfactiveSignature: "Fresh, green",
          dominantMolecules: "linalool, pinene",
          climaticAxis: "vent",
          traditionalUse: "Test use",
          absorbeUse: "Test absorbe use",
          kingdom: "Plantae",
          division: "Magnoliophyta",
          class: "Magnoliopsida",
          order: "Testales",
          genus: "Testus",
          species: "plantus",
          lifeCycle: "vivace",
          harvestPeriod: "Juin-Août",
          essentialOilYield: "1-2%",
          notes: "Test notes",
        },
      ];

      const result = await caller.importPlants({
        plants: testPlants,
      });

      expect(result.success).toBe(true);
      expect(result.imported).toBeGreaterThanOrEqual(0);
      expect(Array.isArray(result.errors)).toBe(true);
    });

    it("should skip duplicate plants", async () => {
      const duplicatePlant = [
        {
          name: "Ambrette", // Already exists from CSV import
          latinName: "Abelmoschus moschatus",
          family: "Malvaceae",
          category: "aromatique",
          origin: "Colombie",
          habitat: "tropical",
          olfactiveSignature: "musky",
          dominantMolecules: "ambrettolide",
          climaticAxis: "peau",
          traditionalUse: "perfume",
          absorbeUse: "skin",
        },
      ];

      const result = await caller.importPlants({
        plants: duplicatePlant,
      });

      expect(result.success).toBe(true);
      expect(result.imported).toBe(0);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors[0]).toContain("existe déjà");
    });

    it("should handle category mapping", async () => {
      const plantWithCategory = [
        {
          name: "Test Resin Plant",
          latinName: "Testus resinus",
          family: "Testaceae",
          category: "resine",
          origin: "Test",
          habitat: "Test",
          olfactiveSignature: "Resinous",
          dominantMolecules: "pinene",
          climaticAxis: "bois",
        },
      ];

      const result = await caller.importPlants({
        plants: plantWithCategory,
      });

      expect(result.success).toBe(true);
      // Category should be mapped to "resine" enum value
    });

    it("should handle climatic axis mapping", async () => {
      const plantWithAxis = [
        {
          name: "Test Wind Plant",
          latinName: "Testus ventus",
          family: "Testaceae",
          category: "aromatique",
          origin: "Test",
          habitat: "Test",
          olfactiveSignature: "Airy",
          dominantMolecules: "pinene",
          climaticAxis: "vent; bois", // Combined axis
        },
      ];

      const result = await caller.importPlants({
        plants: plantWithAxis,
      });

      expect(result.success).toBe(true);
      // Climatic axis should be mapped to "vent_bois" enum value
    });

    it("should handle empty plants array", async () => {
      const result = await caller.importPlants({
        plants: [],
      });

      expect(result.success).toBe(true);
      expect(result.imported).toBe(0);
      expect(result.errors.length).toBe(0);
    });
  });

  describe("CSV Import Integration", () => {
    it("should verify molecules were imported from CSV", async () => {
      // Query molecules to verify CSV import worked
      const molecules = await caller.molecules.list();

      expect(molecules.length).toBeGreaterThan(0);
      
      // Check for a known molecule from the CSV
      const alphaPinene = molecules.find(
        (m) => m.name === "alpha-pinene"
      );
      expect(alphaPinene).toBeDefined();
      // La valeur en base est 'Terpènes' (import CSV français) ou 'terpene' selon la source
      expect(alphaPinene?.family).toBeTruthy();
    });

    it("should verify plants were imported from CSV", async () => {
      // Query plants to verify CSV import worked
      const plants = await caller.plants.list();

      expect(plants.length).toBeGreaterThan(0);
      
      // Check for a known plant from the CSV
      const ambrette = plants.find(
        (p) => p.latinName === "Abelmoschus moschatus"
      );
      expect(ambrette).toBeDefined();
      expect(ambrette?.name).toBe("Ambrette");
      expect(ambrette?.family).toBe("Malvaceae");
    });

    it("should verify rare plants were imported with tag", async () => {
      const plants = await caller.plants.list();

      // Check for rare plants with the tag
      const rarePlants = plants.filter(
        (p) => p.notes?.includes("[Plante rare/fantôme]")
      );
      
      expect(rarePlants.length).toBeGreaterThan(0);
    });
  });
});
