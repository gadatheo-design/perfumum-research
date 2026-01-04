import { describe, it, expect, beforeAll } from "vitest";
import { appRouter } from "./routers";
import type { Context } from "./_core/context";

/**
 * Tests pour les procédures tRPC liées aux interactions Tabac-Cannabis-Parfum
 * 
 * Ces tests vérifient que les endpoints fonctionnent correctement,
 * même lorsque les tables sont vides (cas initial).
 */

describe("Molecular Interactions API", () => {
  let caller: ReturnType<typeof appRouter.createCaller>;

  beforeAll(async () => {
    const mockContext: Context = {
      user: {
        id: 1,
        openId: "test-user",
        name: "Test User",
        email: "test@example.com",
        role: "user",
        createdAt: new Date(),
        updatedAt: new Date(),
        lastSignedIn: new Date(),
        loginMethod: "oauth",
      },
      req: {} as any,
      res: {} as any,
    };

    caller = appRouter.createCaller(mockContext);
  });

  describe("molecularInteractions.list", () => {
    it("should return an array (empty or with data)", async () => {
      const result = await caller.molecularInteractions.list();
      expect(Array.isArray(result)).toBe(true);
    });

    it("should return objects with expected structure when data exists", async () => {
      const result = await caller.molecularInteractions.list();
      if (result.length > 0) {
        const interaction = result[0];
        expect(interaction).toHaveProperty("id");
        expect(interaction).toHaveProperty("interactionId");
        expect(interaction).toHaveProperty("name");
        expect(interaction).toHaveProperty("sourceCategory");
        expect(interaction).toHaveProperty("synergyType");
        expect(interaction).toHaveProperty("compatibilityScore");
      }
    });
  });

  describe("aromaticAccords.list", () => {
    it("should return an array (empty or with data)", async () => {
      const result = await caller.aromaticAccords.list();
      expect(Array.isArray(result)).toBe(true);
    });

    it("should return objects with expected structure when data exists", async () => {
      const result = await caller.aromaticAccords.list();
      if (result.length > 0) {
        const accord = result[0];
        expect(accord).toHaveProperty("id");
        expect(accord).toHaveProperty("accordId");
        expect(accord).toHaveProperty("name");
        expect(accord).toHaveProperty("category");
      }
    });
  });

  describe("entourageRules.list", () => {
    it("should return an array (empty or with data)", async () => {
      const result = await caller.entourageRules.list();
      expect(Array.isArray(result)).toBe(true);
    });

    it("should return objects with expected structure when data exists", async () => {
      const result = await caller.entourageRules.list();
      if (result.length > 0) {
        const rule = result[0];
        expect(rule).toHaveProperty("id");
        expect(rule).toHaveProperty("ruleId");
        expect(rule).toHaveProperty("name");
        expect(rule).toHaveProperty("ruleType");
      }
    });
  });

  describe("terpeneComparison.list", () => {
    it("should return an array (empty or with data)", async () => {
      const result = await caller.terpeneComparison.list();
      expect(Array.isArray(result)).toBe(true);
    });

    it("should return terpene profiles with correct structure when data exists", async () => {
      const result = await caller.terpeneComparison.list();
      if (result.length > 0) {
        const profile = result[0];
        expect(profile).toHaveProperty("id");
        expect(profile).toHaveProperty("profileId");
        expect(profile).toHaveProperty("name");
        expect(profile).toHaveProperty("sourceType");
        // Terpene values
        expect(profile).toHaveProperty("myrcene");
        expect(profile).toHaveProperty("limonene");
        expect(profile).toHaveProperty("pinene");
        expect(profile).toHaveProperty("linalool");
        expect(profile).toHaveProperty("caryophyllene");
      }
    });
  });

  describe("formulationTool.list", () => {
    it("should return an array (empty or with data)", async () => {
      const result = await caller.formulationTool.list();
      expect(Array.isArray(result)).toBe(true);
    });

    it("should return formulation suggestions with correct structure when data exists", async () => {
      const result = await caller.formulationTool.list();
      if (result.length > 0) {
        const suggestion = result[0];
        expect(suggestion).toHaveProperty("id");
        expect(suggestion).toHaveProperty("suggestionId");
        expect(suggestion).toHaveProperty("name");
        expect(suggestion).toHaveProperty("formulationType");
        expect(suggestion).toHaveProperty("difficulty");
      }
    });
  });

  describe("formulationTool.generateSuggestions", () => {
    it("should return suggestions for a valid molecule ID", async () => {
      // First get a molecule ID from the database
      const molecules = await caller.molecules.list();
      
      if (molecules.length > 0) {
        const moleculeId = molecules[0].id;
        const result = await caller.formulationTool.generateSuggestions(moleculeId);
        
        expect(result).toHaveProperty("baseMolecule");
        expect(result).toHaveProperty("suggestions");
        expect(Array.isArray(result.suggestions)).toBe(true);
      }
    });

    it("should handle non-existent molecule ID gracefully", async () => {
      const result = await caller.formulationTool.generateSuggestions(999999);
      
      expect(result).toHaveProperty("baseMolecule");
      expect(result.baseMolecule).toBeNull();
      expect(result).toHaveProperty("suggestions");
      expect(Array.isArray(result.suggestions)).toBe(true);
      expect(result.suggestions.length).toBe(0);
    });
  });
});

describe("Data Integrity", () => {
  let caller: ReturnType<typeof appRouter.createCaller>;

  beforeAll(async () => {
    const mockContext: Context = {
      user: {
        id: 1,
        openId: "test-user",
        name: "Test User",
        email: "test@example.com",
        role: "user",
        createdAt: new Date(),
        updatedAt: new Date(),
        lastSignedIn: new Date(),
        loginMethod: "oauth",
      },
      req: {} as any,
      res: {} as any,
    };

    caller = appRouter.createCaller(mockContext);
  });

  it("sourceCategory values should be valid enum values", async () => {
    const validCategories = ["tabac_cannabis", "tabac_parfum", "cannabis_parfum", "tabac_cannabis_parfum"];
    const interactions = await caller.molecularInteractions.list();
    
    for (const interaction of interactions) {
      expect(validCategories).toContain(interaction.sourceCategory);
    }
  });

  it("synergyType values should be valid enum values", async () => {
    const validTypes = ["entourage", "potentiation", "bridge", "stabilization", "transformation", "masking"];
    const interactions = await caller.molecularInteractions.list();
    
    for (const interaction of interactions) {
      expect(validTypes).toContain(interaction.synergyType);
    }
  });

  it("compatibilityScore should be between 0 and 100", async () => {
    const interactions = await caller.molecularInteractions.list();
    
    for (const interaction of interactions) {
      expect(interaction.compatibilityScore).toBeGreaterThanOrEqual(0);
      expect(interaction.compatibilityScore).toBeLessThanOrEqual(100);
    }
  });

  it("terpene profile sourceType should be valid", async () => {
    const validSourceTypes = ["tabac", "cannabis", "parfum"];
    const profiles = await caller.terpeneComparison.list();
    
    for (const profile of profiles) {
      expect(validSourceTypes).toContain(profile.sourceType);
    }
  });

  it("terpene values should be between 0 and 100 when present", async () => {
    const profiles = await caller.terpeneComparison.list();
    const terpeneKeys = ["myrcene", "limonene", "pinene", "linalool", "caryophyllene", "humulene", "terpinolene", "ocimene", "bisabolol", "geraniol"];
    
    for (const profile of profiles) {
      for (const key of terpeneKeys) {
        const value = profile[key as keyof typeof profile] as number | null;
        if (value !== null) {
          expect(value).toBeGreaterThanOrEqual(0);
          expect(value).toBeLessThanOrEqual(100);
        }
      }
    }
  });
});
