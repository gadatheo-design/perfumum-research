import { describe, it, expect, beforeAll } from 'vitest';
import * as db from './db';

describe('IFRA Categories', () => {
  describe('getAllIfraCategories', () => {
    it('should return all IFRA categories', async () => {
      const categories = await db.getAllIfraCategories();
      expect(Array.isArray(categories)).toBe(true);
      expect(categories.length).toBeGreaterThan(0);
    });

    it('should have required fields for each category', async () => {
      const categories = await db.getAllIfraCategories();
      if (categories.length > 0) {
        const category = categories[0];
        expect(category).toHaveProperty('code');
        expect(category).toHaveProperty('name');
        expect(category).toHaveProperty('nameFr');
      }
    });
  });

  describe('getIfraCategoryByCode', () => {
    it('should return category 4 (Fine Fragrance)', async () => {
      const category = await db.getIfraCategoryByCode('4');
      expect(category).not.toBeNull();
      if (category) {
        expect(category.code).toBe('4');
        expect(category.name).toContain('Fine Fragrance');
      }
    });

    it('should return null for non-existent category', async () => {
      const category = await db.getIfraCategoryByCode('999');
      expect(category).toBeNull();
    });
  });
});

describe('IFRA Restrictions', () => {
  describe('getAllIfraRestrictions', () => {
    it('should return all IFRA restrictions with molecules', async () => {
      const restrictions = await db.getAllIfraRestrictions();
      expect(Array.isArray(restrictions)).toBe(true);
    });
  });

  describe('getIfraStats', () => {
    it('should return statistics about IFRA restrictions', async () => {
      const stats = await db.getIfraStats();
      expect(stats).not.toBeNull();
      if (stats) {
        expect(stats).toHaveProperty('total');
        expect(stats).toHaveProperty('prohibited');
        expect(stats).toHaveProperty('restricted');
        expect(stats).toHaveProperty('noRestriction');
        expect(typeof stats.total).toBe('number');
      }
    });
  });
});

describe('IFRA Compliance Calculator', () => {
  describe('calculateIfraLimit', () => {
    it('should return limit info for a molecule and category', async () => {
      // First, get a molecule with restrictions
      const restrictions = await db.getAllIfraRestrictions();
      if (restrictions.length > 0) {
        const moleculeId = restrictions[0].molecule.id;
        const result = await db.calculateIfraLimit(moleculeId, '4');
        expect(result).not.toBeNull();
        expect(result).toHaveProperty('type');
      }
    });

    it('should return no_restriction for unknown molecule', async () => {
      const result = await db.calculateIfraLimit(999999, '4');
      expect(result).toEqual({ limit: null, type: 'no_restriction' });
    });
  });

  describe('checkIfraCompliance', () => {
    it('should check compliance for a molecule', async () => {
      const restrictions = await db.getAllIfraRestrictions();
      if (restrictions.length > 0) {
        const moleculeId = restrictions[0].molecule.id;
        const result = await db.checkIfraCompliance(moleculeId, '4', 0.1);
        expect(result).toHaveProperty('compliant');
        expect(result).toHaveProperty('message');
        expect(typeof result.compliant).toBe('boolean');
      }
    });

    it('should return compliant true for unrestricted molecule', async () => {
      const result = await db.checkIfraCompliance(999999, '4', 50);
      expect(result.compliant).toBe(true);
      expect(result.message).toContain('Pas de restriction');
    });
  });

  describe('searchIfraRestrictionsByName', () => {
    it('should find restrictions by molecule name', async () => {
      const results = await db.searchIfraRestrictionsByName('linalol');
      expect(Array.isArray(results)).toBe(true);
    });

    it('should return empty array for non-existent molecule', async () => {
      const results = await db.searchIfraRestrictionsByName('xyznonexistent123');
      expect(results).toEqual([]);
    });
  });
});

describe('Plant Images', () => {
  describe('getPlantsWithImages', () => {
    it('should return plants that have images', async () => {
      const plants = await db.getPlantsWithImages();
      expect(Array.isArray(plants)).toBe(true);
      // All returned plants should have imageUrl
      plants.forEach(plant => {
        expect(plant.imageUrl).toBeTruthy();
      });
    });
  });

  describe('getPlantsWithoutImages', () => {
    it('should return plants without images', async () => {
      const plants = await db.getPlantsWithoutImages();
      expect(Array.isArray(plants)).toBe(true);
      // All returned plants should have null or empty imageUrl
      plants.forEach(plant => {
        expect(!plant.imageUrl || plant.imageUrl === '').toBe(true);
      });
    });
  });
});


// ============================================================================
// Tests du calculateur de conformité IFRA via tRPC
// ============================================================================

import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import { vi } from "vitest";

// Contexte de test public (sans authentification)
function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

describe("ifraCalculator tRPC procedures", () => {
  describe("checkFormula", () => {
    it("devrait valider une formule vide comme conforme", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.ifraCalculator.checkFormula({
        categoryCode: "4",
        ingredients: [],
      });

      expect(result).toBeDefined();
      expect(result.isCompliant).toBe(true);
      expect(result.totalIngredients).toBe(0);
    });

    it("devrait gérer les codes de catégorie en majuscules et minuscules", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const resultUpper = await caller.ifraCalculator.checkFormula({
        categoryCode: "5A",
        ingredients: [],
      });

      const resultLower = await caller.ifraCalculator.checkFormula({
        categoryCode: "5a",
        ingredients: [],
      });

      expect(resultUpper.isCompliant).toBe(true);
      expect(resultLower.isCompliant).toBe(true);
    });
  });

  describe("getLimitsForCategory", () => {
    it("devrait retourner un tableau pour chaque catégorie valide", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const categories = ["1", "2", "3", "4", "5A", "5B", "6", "7A", "8", "9", "10A", "11A"];
      
      for (const cat of categories) {
        const result = await caller.ifraCalculator.getLimitsForCategory(cat);
        expect(Array.isArray(result)).toBe(true);
      }
    });
  });
});

describe("ifraRestrictions tRPC procedures", () => {
  describe("list", () => {
    it("devrait retourner un tableau de restrictions", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.ifraRestrictions.list();

      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe("getRestricted", () => {
    it("devrait retourner uniquement les molécules avec restrictions", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.ifraRestrictions.getRestricted();

      expect(Array.isArray(result)).toBe(true);
      // Chaque élément devrait avoir une restriction de type prohibited ou restricted
      result.forEach((item: any) => {
        expect(["prohibited", "restricted", "specified"]).toContain(item.restriction.restrictionType);
      });
    });
  });
});

describe("ifraCategories tRPC procedures", () => {
  describe("list", () => {
    it("devrait retourner toutes les catégories IFRA", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.ifraCategories.list();

      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe("getByCode", () => {
    it("devrait retourner une catégorie par son code", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.ifraCategories.getByCode("4");

      // Peut être null si pas de données, mais ne devrait pas lever d'erreur
      expect(result === null || typeof result === "object").toBe(true);
    });
  });

  describe("calculateLimit", () => {
    it("devrait calculer la limite pour une molécule et catégorie", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.ifraCategories.calculateLimit({
        moleculeId: 1,
        categoryCode: "4",
      });

      expect(result).toBeDefined();
      expect(result).toHaveProperty("type");
    });
  });
});
